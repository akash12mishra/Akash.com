import { NextResponse } from "next/server";

// Per-IP in-memory rate limit. Best-effort only: each Vercel serverless
// instance has its own Map, so the effective ceiling can be looser than
// the constants suggest. That's acceptable for a portfolio chatbot —
// the goal is just to blunt obvious abuse without a Redis dependency.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 15;
const rateLimitStore = new Map();

function getClientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { windowStart: now, count: 1 });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil(
      (RATE_LIMIT_WINDOW_MS - (now - entry.windowStart)) / 1000
    );
    return { allowed: false, retryAfter };
  }

  entry.count += 1;
  // Opportunistic cleanup to keep the Map bounded; only sweeps when
  // it grows large so the common path stays O(1).
  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (now - value.windowStart > RATE_LIMIT_WINDOW_MS * 2) {
        rateLimitStore.delete(key);
      }
    }
  }
  return { allowed: true };
}

export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const limit = checkRateLimit(ip);
    if (!limit.allowed) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(limit.retryAfter),
          },
        }
      );
    }

    const { prompt, conversationHistory } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ message: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Define available tools (formerly functions)
    const tools = [
      {
        type: "function",
        function: {
          name: "get_portfolio_info",
          description: "Fetch detailed information about Arka's portfolio projects and skills when asked specifically about his work or experience.",
          parameters: {
            type: "object",
            properties: {},
            required: [],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "render_box_component",
          description: "Render a box component when the user explicitly asks to render a box or see a demo.",
          parameters: {
            type: "object",
            properties: {},
            required: [],
          },
        },
      },
    ];

    // Updated system prompt for portfolio context
    const systemMessage = {
      role: "system",
      content: `You are an AI assistant for Arka Lal Chakravarty's personal portfolio website. Your purpose is to help visitors learn about Arka's skills, experience, and projects. Be concise, professional and helpful.

# About Arka
Arka is an AI Engineer and Full-Stack Developer specializing in building advanced AI SaaS products and automations.

# Skills & Expertise
- AI Engineering & Integration (GPT-4o, AutoGen, RAG systems)
- Full-Stack Development (Next.js, React, Node.js)
- Database Design & Management (MongoDB, PostgreSQL)
- Machine Learning & Data Science
- Workflow Automation & Chrome Extensions
- SEO Optimization

# Tech Stack
- Frontend: React, Next.js, SCSS/SASS, ShadCN UI, Framer Motion
- Backend: Node.js, Express, FastAPI, Python
- Database: MongoDB, Supabase, PostgreSQL, Redis
- AI/ML: OpenAI APIs, LangChain, Vector DBs, TensorFlow
- Deployment: Vercel, AWS, Docker

# Services
- AI-Powered Web Applications
- SaaS Product Development
- Workflow Automation
- Chrome Extension Development
- SEO Automation Platforms
- AI Chatbots (RAG, AutoGen)
- Technical Consulting

# Values
- Fast execution and delivery
- Product-focused approach
- Modern, clean, and performant code
- User-centric design

# Current Availability
Arka is currently available for freelance/contract opportunities and select full-time positions.

Respond in a friendly, professional manner. Use markdown formatting for better readability. Keep your answers concise but informative. If asked about something outside of this scope, politely explain that you can only provide information about Arka's professional work and skills.`,
    };

    // Format message history including the system prompt
    const messages = [
      systemMessage,
      ...conversationHistory.map((item) => ({
        role: item.role,
        content: item.content,
      })),
      { role: "user", content: prompt },
    ];

    // OpenAI API call with the latest model and API structure
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",           // Updated to latest GPT-4o model
          temperature: 0.7,         // Slightly reduced for more consistent responses
          max_tokens: 4000,
          stream: true,
          messages,
          tools,                    // Using tools instead of functions (new API format)
          tool_choice: "auto",      // Let the model decide when to use tools
        }),
      }
    );

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }

    const reader = openaiResponse.body.getReader();
    const decoder = new TextDecoder("utf-8");

    // For accumulating tool calls (formerly function calls)
    let accumulatedToolCall = null;

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // Handle any remaining buffer
            if (buffer) {
              controller.enqueue(new TextEncoder().encode(buffer));
              buffer = "";
            }

            // Handle any final tool calls
            if (accumulatedToolCall) {
              controller.enqueue(
                new TextEncoder().encode(JSON.stringify(accumulatedToolCall))
              );
            }

            controller.close();
            break;
          }

          // Process the chunk
          const decodedChunk = decoder.decode(value);
          const lines = decodedChunk.split("\n");
          
          for (const line of lines) {
            // Skip empty lines or [DONE] markers
            const cleanLine = line.replace(/^data: /, "").trim();
            if (!cleanLine || cleanLine === "[DONE]") continue;
            
            try {
              // Parse the JSON response
              const parsedLine = JSON.parse(cleanLine);
              const { choices } = parsedLine;
              
              if (!choices || choices.length === 0) continue;
              
              const { delta, finish_reason } = choices[0];
              
              // Handle tool call chunks (formerly function call)
              if (delta.tool_calls) {
                const toolCall = delta.tool_calls[0];
                
                // Initialize tool call accumulator if needed
                if (!accumulatedToolCall) {
                  accumulatedToolCall = { tool_call: { id: toolCall.id } };
                }
                
                // Accumulate function name
                if (toolCall.function?.name) {
                  if (!accumulatedToolCall.tool_call.function) {
                    accumulatedToolCall.tool_call.function = {};
                  }
                  accumulatedToolCall.tool_call.function.name = toolCall.function.name;
                }
                
                // Accumulate arguments
                if (toolCall.function?.arguments) {
                  if (!accumulatedToolCall.tool_call.function) {
                    accumulatedToolCall.tool_call.function = {};
                  }
                  
                  if (!accumulatedToolCall.tool_call.function.arguments) {
                    accumulatedToolCall.tool_call.function.arguments = toolCall.function.arguments;
                  } else {
                    accumulatedToolCall.tool_call.function.arguments += toolCall.function.arguments;
                  }
                }
                
                // If tool call is complete, send it and reset
                if (finish_reason === "tool_calls") {
                  controller.enqueue(
                    new TextEncoder().encode(JSON.stringify(accumulatedToolCall))
                  );
                  accumulatedToolCall = null;
                }
              } 
              // Handle normal content
              else if (delta.content) {
                // Stream the content directly
                controller.enqueue(new TextEncoder().encode(delta.content));
              }
            } catch (error) {
              // Handle parsing errors
              console.error("Error parsing stream:", error, cleanLine);
            }
          }
        }
      },
    });

    // Return the streaming response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Chat service unavailable" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
