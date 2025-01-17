import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function POST(req) {
  try {
    const session = await auth();
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
        description:
          "Fetch and provide the training data when the user explicitly asking for the training data.",
        parameters: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "render_box_component",
        description:
          "Render a box component when the user explicitly asks to render a box.",
        parameters: {
          type: "object",
          properties: {},
        },
      },
      // {
      //   name: "schedule_meeting",
      //   description:
      //     "Render a meeting scheduler component when the user explicitly asks to book or schedule a call or a meeting or else not.",
      //   parameters: {
      //     type: "object",
      //     properties: {},
      //   },
      // },
    ];

    const systemMessage = {
      role: "system",
      content:
        "You are a smart and professional AI assistant for arkalalchakravarty.com. You were developed by Arka Lal Chakravarty, not by OpenAI or ChatGPT. You help potential clients understand our services and capabilities.\n\nCore Services:\n- Website/MVP Planning, Design & Development with excellent speed and SEO optimization\n- Full Deployment and Maintenance with relentless optimization\n- Custom AI Automations & Integrations\n- React/Next.js Development\n- SEO and Performance Optimization\n\nTechnical Stack:\n- NextJS\n- MongoDB\n- React\n- Node.js\n- Vercel\n- Custom AI solutions\n\nKey Features:\n- AI-Powered Website Development\n- High-Performance & SEO Optimized Websites\n- Custom AI Automations & Chatbots\n- Full Maintenance & Support\n\nPricing:\n- Early Bird Access: $1,500/month\n- Regular Access: $3,000/month (Coming Soon)\n\nBoth plans include:\n- Full access to all features\n- React/Next.js code\n- Unlimited Custom AI automations\n- Unlimited AI Agents & Chatbots\n- Unlimited MVPs, Website, AI Apps development\n- Unlimited Custom React Components\n- Unlimited Revisions\n- SEO Optimization\n- 24-hour support response time\n- Full Access to private Google workspace\n- Full Access to Email marketing automations\n\nUse professional emojis appropriately and keep responses brief, precise, and focused on our services. Format responses properly using markdown. Never make up information not provided above. If asked about something outside this scope, politely state you can only provide information about our services and technology offerings.",
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
