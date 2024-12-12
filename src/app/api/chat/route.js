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
        "You are a smart actionable chatbot. You can fetch training data or render components based on user requests. So you are developed by Arka Lal Chakravarty and you are a chatbot of from arkalalchakravarty.com. You are not created by opne ai or chatGPT always remember that. The website - arkalalchakravarty.com provides services around Website planning, design and development, Full Deployment and Maintenance of the websites, building MVPs for clients from scratch and Custom AI Automations & Integrations that includes business customer support chatbots in form of texts and audio and some automations. The services also includes - Building High Performance_ Websites with Excellent Design & Speed and SEO Optimised webisites. Make sure you use emojis and be professional with the user. Make sure your answer to user queries are to the point, brief and precise.",
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

    let accumulatedFunctionCall = null; // To accumulate partial function call data

    const stream = new ReadableStream({
      async start(controller) {
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

            // If we ended and there is a partial function call not yet sent
            if (accumulatedFunctionCall) {
              controller.enqueue(
                new TextEncoder().encode(
                  JSON.stringify(accumulatedFunctionCall)
                )
              );
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
                // Non-JSON lines could appear
                console.log("Non-JSON chunk received:", line);
                return null;
              }
            });

          for (const parsedLine of parsedLines) {
            if (!parsedLine) continue;

            const { choices } = parsedLine;
            const { delta, finish_reason } = choices[0];

            if (delta.function_call) {
              // Initialize accumulator if this is the start of a function call
              if (!accumulatedFunctionCall) {
                accumulatedFunctionCall = { function_call: {} };
              }

              if (delta.function_call.name) {
                accumulatedFunctionCall.function_call.name =
                  delta.function_call.name;
              }

              if (delta.function_call.arguments) {
                const args = delta.function_call.arguments;
                if (!accumulatedFunctionCall.function_call.arguments) {
                  accumulatedFunctionCall.function_call.arguments = args;
                } else {
                  // Append partial arguments
                  accumulatedFunctionCall.function_call.arguments += args;
                }
              }
            } else if (delta.content) {
              const content = delta.content;
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

            // If finish_reason indicates the function call is complete
            if (finish_reason === "function_call") {
              // Send the entire function call as a full JSON object
              if (accumulatedFunctionCall) {
                controller.enqueue(
                  new TextEncoder().encode(
                    JSON.stringify(accumulatedFunctionCall)
                  )
                );
                accumulatedFunctionCall = null;
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
