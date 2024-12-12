import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt, conversationHistory } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ message: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const functions = [
      {
        name: "get_training_data",
        description: "Fetch training data for the user.",
        parameters: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "render_box_component",
        description: "Render a box component with some data.",
        parameters: {
          type: "object",
          properties: {},
        },
      },
    ];

    const systemMessage = {
      role: "system",
      content:
        "You are a smart actionable chatbot. You can fetch training data or render components based on user requests. You are developed by Arka Lal Chakravarty and you are a chatbot of arkalalchakravarty.com. Be professional and precise. Use emojis where appropriate.",
    };

    const messages = [
      systemMessage,
      ...conversationHistory.map((item) => ({
        role: item.role,
        content: item.content,
      })),
      { role: "user", content: prompt },
    ];

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-2024-05-13",
          temperature: 0.9,
          max_tokens: 4090,
          stream: true,
          messages,
          function_call: "auto",
          functions,
        }),
      }
    );

    const reader = openaiResponse.body.getReader();
    const decoder = new TextDecoder("utf-8");

    const stream = new ReadableStream({
      async start(controller) {
        let isFunctionCall = false;
        let functionCallPayload = "";
        let wordBuffer = "";
        let isInWord = false;

        // Helper to check if char is part of a word
        const isWordChar = (char) => /[a-zA-Z0-9']/.test(char);

        // Helper to check if we should send the buffer
        const shouldSendBuffer = (char) => {
          return (
            char === " " ||
            char === "\n" ||
            /[.,!?:;]/.test(char) ||
            wordBuffer.length > 20
          );
        };

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Send any remaining buffered word
            if (wordBuffer) {
              controller.enqueue(new TextEncoder().encode(wordBuffer));
            }
            if (isFunctionCall && functionCallPayload) {
              controller.enqueue(new TextEncoder().encode(functionCallPayload));
            }
            controller.close();
            break;
          }

          const decodedChunk = decoder.decode(value);
          const lines = decodedChunk.split("\n");
          const parsedLines = lines
            .map((line) => line.replace(/^data: /, "").trim())
            .filter((line) => line !== "" && line !== "[DONE]")
            .map((line) => {
              try {
                return JSON.parse(line);
              } catch (err) {
                console.log("Non-JSON chunk received:", line);
                return null;
              }
            });

          for (const parsedLine of parsedLines) {
            if (!parsedLine) continue;

            const { choices } = parsedLine;
            const { delta } = choices[0];

            if (delta.function_call) {
              isFunctionCall = true;
              functionCallPayload = JSON.stringify({
                function_call: delta.function_call,
              });
              console.log("Function call detected:", functionCallPayload);
            } else if (delta.content) {
              const content = delta.content;
              console.log("Received content:", content);

              // Process content character by character
              for (let i = 0; i < content.length; i++) {
                const char = content[i];

                if (isWordChar(char)) {
                  wordBuffer += char;
                  isInWord = true;
                } else {
                  // If we were in a word, send the buffered word first
                  if (isInWord && wordBuffer) {
                    controller.enqueue(new TextEncoder().encode(wordBuffer));
                    wordBuffer = "";
                  }
                  // Send the non-word character immediately
                  controller.enqueue(new TextEncoder().encode(char));
                  isInWord = false;
                }

                // Send buffer if it's getting too long
                if (wordBuffer && shouldSendBuffer(char)) {
                  controller.enqueue(new TextEncoder().encode(wordBuffer));
                  wordBuffer = "";
                  isInWord = false;
                }
              }
            }
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in backend:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
