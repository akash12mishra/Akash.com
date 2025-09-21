"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.scss";
import Box from "../../Box/Box";
import SkeletonBox from "../../SkeletonBox/SkeletonBox";

const TypingAnimation = () => (
  <div className={styles.typingAnimation}>
    <div className={styles.dot}></div>
    <div className={styles.dot}></div>
    <div className={styles.dot}></div>
  </div>
);

const Chatbot = React.forwardRef(function Chatbot({ showVideo }, ref) {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatbotBoxRef = useRef(null);
  const assistantMessageIndex = useRef(null);
  const currentMessageRef = useRef("");
  const functionCallBuffer = useRef("");

  // Session removed as part of authentication cleanup

  const scrollToBottom = () => {
    if (chatbotBoxRef.current) {
      chatbotBoxRef.current.scrollTo({
        top: chatbotBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const addMessage = (role, content, isLoading = false, boxData = null) => {
    setChatHistory((prev) => [...prev, { role, content, isLoading, boxData }]);
    currentMessageRef.current = "";
  };

  console.log("chatHistory", chatHistory);

  const updateAssistantMessage = (chunk) => {
    // Just append chunk as is, no extra spacing logic.
    setChatHistory((prev) => {
      const updatedHistory = [...prev];
      const assistantIndex = updatedHistory.findIndex(
        (msg) => msg.role === "assistant" && msg.isLoading === true
      );
      if (assistantIndex !== -1) {
        const previousContent = updatedHistory[assistantIndex].content || "";
        updatedHistory[assistantIndex] = {
          ...updatedHistory[assistantIndex],
          content: previousContent + chunk,
          isLoading: true,
        };
      }
      return updatedHistory;
    });
  };

  const finalizeAssistantMessage = () => {
    setChatHistory((prev) => {
      const updatedHistory = [...prev];
      const assistantIndex = updatedHistory.findIndex(
        (msg) => msg.role === "assistant" && msg.isLoading === true
      );
      if (assistantIndex !== -1) {
        updatedHistory[assistantIndex] = {
          ...updatedHistory[assistantIndex],
          isLoading: false,
        };
      }
      return updatedHistory;
    });
    currentMessageRef.current = "";
  };

  const renderFormattedMessage = (content) => {
    if (!content) return null;

    const lines = content.split("\n");
    const elements = [];
    let inList = false;
    let listItems = [];

    const processListItems = (lineIndex) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${lineIndex}`} className={styles.bulletList}>
            {listItems.map((item, idx) => (
              <li
                key={`line-${lineIndex}-item-${idx}`}
                className={styles.bulletItem}
              >
                {item}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      // Empty line
      if (!line.trim()) {
        processListItems(index);
        inList = false;
        elements.push(
          <div key={`empty-${index}`} className={styles.emptyLine} />
        );
        return;
      }

      // Headers
      if (line.startsWith("#")) {
        processListItems(index);
        inList = false;
        const level = line.match(/^#+/)[0].length;
        const text = line.replace(/^#+\s+/, "");
        elements.push(
          <div key={`heading-${index}`} className={styles[`heading${level}`]}>
            {text}
          </div>
        );
        return;
      }

      // Numbered headings (e.g., "1. **Title**:")
      const numberedHeading = line.match(/^(\d+)\.\s*\*\*(.*?)\*\*(.*)/);
      if (numberedHeading) {
        processListItems(index);
        inList = false;
        const [, number, heading, rest] = numberedHeading;
        elements.push(
          <div key={`numHeading-${index}`} className={styles.numberedHeading}>
            <span className={styles.number}>{number}.</span>
            <span className={styles.heading}>{heading}</span>
            <span className={styles.rest}>{rest}</span>
          </div>
        );
        return;
      }

      // Bullet points
      if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
        inList = true;
        listItems.push(line.substring(1).trim());
        return;
      }

      // Bold text
      const parts = line.split(/(\*\*.*?\*\*)/g);
      if (parts.length > 1) {
        processListItems(index);
        inList = false;
        elements.push(
          <p key={`paragraph-bold-${index}`} className={styles.paragraph}>
            {parts.map((part, idx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={`bold-${index}-${idx}`}>
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
        return;
      }

      // Regular text
      processListItems(index);
      inList = false;
      elements.push(
        <p key={`paragraph-${index}`} className={styles.paragraph}>
          {line.trim()}
        </p>
      );
    });

    // Process any remaining list items
    processListItems(lines.length);

    return elements;
  };

  const handleFunctionCall = async (name, args) => {
    switch (name) {
      case "get_training_data":
        try {
          const trainingData = await fetch("/api/train").then((res) =>
            res.json()
          );
          updateAssistantMessage(`Training data: ${trainingData.message}`);
          finalizeAssistantMessage();
        } catch (error) {
          console.error("Error fetching training data:", error);
          updateAssistantMessage(
            "Error fetching training data. Please try again."
          );
          finalizeAssistantMessage();
        }
        break;

      case "render_box_component":
        // First add a loading box
        setChatHistory((prev) => {
          const updatedHistory = [...prev];
          const loadingIndex = updatedHistory.findIndex(
            (msg) => msg.role === "assistant" && msg.isLoading === true
          );
          if (loadingIndex !== -1) {
            updatedHistory[loadingIndex] = {
              role: "assistant",
              content: "Here's a demo of my tech stack:",
              isLoading: false,
              boxData: "loading",
            };
          }
          return updatedHistory;
        });

        // After a short delay, replace with the actual box
        setTimeout(() => {
          setChatHistory((prev) => {
            const updatedHistory = [...prev];
            const boxIndex = updatedHistory.findIndex(
              (msg) => msg.boxData === "loading"
            );
            if (boxIndex !== -1) {
              updatedHistory[boxIndex] = {
                ...updatedHistory[boxIndex],
                boxData: {
                  title: "Tech Stack",
                  description: "Technologies I work with:",
                  items: [
                    {
                      name: "Next.js",
                      icon: "nextjs",
                    },
                    {
                      name: "React",
                      icon: "react",
                    },
                    {
                      name: "MongoDB",
                      icon: "mongodb",
                    },
                    {
                      name: "Node.js",
                      icon: "nodejs",
                    },
                    {
                      name: "Python",
                      icon: "python",
                    },
                    {
                      name: "OpenAI",
                      icon: "openai",
                    },
                  ],
                },
              };
            }
            return updatedHistory;
          });
        }, 1500);
        break;
    }
  };

  const tryParseToolCall = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.tool_call) {
        return parsed;
      }
    } catch {
      return null;
    }
    return null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    const assistantIndex = chatHistory.length + 1;

    // Add user message
    addMessage("user", userMessage);

    // Add assistant "loading" message
    addMessage("assistant", "", true);

    // Set the assistant message index
    assistantMessageIndex.current = assistantIndex;

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          conversationHistory: chatHistory,
        }),
      });

      if (!response.body) throw new Error("No response body from API");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      functionCallBuffer.current = ""; // Reset function call buffer for this interaction

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        console.log("chunk", chunk);

        // First, try parsing chunk directly
        let parsedChunk = null;
        try {
          parsedChunk = JSON.parse(chunk);
        } catch {
          // Not JSON. Possibly a partial tool call or normal text.
        }

        if (parsedChunk && parsedChunk.tool_call) {
          if (!parsedChunk.tool_call.function?.name) {
            updateAssistantMessage(
              "Sorry, I encountered an issue. Can you try again?"
            );
            finalizeAssistantMessage();
            return;
          }

          // Fully formed tool call
          await handleToolCall(
            parsedChunk.tool_call.function.name,
            parsedChunk.tool_call.function.arguments
          );
          functionCallBuffer.current = "";
          console.log("Tool call executed:", parsedChunk.tool_call.function.name);
        } else {
          // No direct tool_call in chunk
          // Maybe it's partial tool call data or normal text
          if (functionCallBuffer.current) {
            // We have some accumulated data, try adding this chunk to the buffer and parse
            functionCallBuffer.current += chunk;
            const parsedTool = tryParseToolCall(functionCallBuffer.current);
            if (parsedTool) {
              await handleToolCall(
                parsedTool.tool_call.function.name,
                parsedTool.tool_call.function.arguments
              );
              functionCallBuffer.current = "";
              continue;
            } else {
              // Still not parseable as tool call. It might be normal text after all.
              // Since we failed to parse even after accumulation, let's treat this new chunk as text.
              updateAssistantMessage(functionCallBuffer.current);
              functionCallBuffer.current = "";
            }
          } else {
            // No accumulated tool call, just normal text.
            updateAssistantMessage(chunk);
          }
        }

        scrollToBottom();
      }

      if (!isLoading) {
        finalizeAssistantMessage();
      }
    } catch (error) {
      console.error("Error streaming AI response:", error);
      setChatHistory((prev) =>
        prev.map((msg, idx) =>
          idx === assistantMessageIndex.current
            ? { ...msg, isLoading: false, content: "Error. Please try again." }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      // If there's any leftover tool call buffer at the end, treat it as text.
      if (functionCallBuffer.current) {
        updateAssistantMessage(functionCallBuffer.current);
        functionCallBuffer.current = "";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  const initialMessageShown = useRef(false);

  useEffect(() => {
    if (!initialMessageShown.current) {
      addMessage(
        "assistant",
        "Hey! welcome to arkalalchakravarty.com 🎉. I'm Arka's assistant. Feel free to ask me anything! 👀🧑🏻‍💻"
      );
      initialMessageShown.current = true;
    }
  }, []);

  return (
    <div ref={ref} className={styles.Chatbot}>
      <div className={styles.chatbotBox} ref={chatbotBoxRef}>
        {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.role === "user" ? styles.userMessage : styles.aiMessage
                }
              >
                {(() => {
                  // If we have boxData
                  if (msg.boxData) {
                    if (msg.boxData === "loading") {
                      return (
                        <div className={styles.boxLoader}>
                          <SkeletonBox />
                        </div>
                      );
                    } else if (msg.boxData.type === "schedulingLoader") {
                      return (
                        <div className={styles.schedulingLoader}>
                          <div className={styles.spinner}></div>
                          <span>{msg.boxData.text}</span>
                        </div>
                      );
                    } else {
                      return <Box data={msg.boxData} />;
                    }
                  } else if (msg.isLoading && !msg.content) {
                    // No boxData yet, isLoading and no content => show typing animation
                    return <TypingAnimation />;
                  } else {
                    // Show the formatted message if content is available
                    return renderFormattedMessage(msg.content || "");
                  }
                })()}
              </div>
            ))}
      </div>
      <div className={styles.chatbotInput}>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your query..."
          />
          <button type="submit" disabled={isLoading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
});

export default Chatbot;
