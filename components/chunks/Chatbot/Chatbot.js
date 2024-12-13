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

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatbotBoxRef = useRef(null);
  const assistantMessageIndex = useRef(null);
  const currentMessageRef = useRef("");
  const functionCallBuffer = useRef("");

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
        // Immediately show skeleton loader
        setChatHistory((prev) =>
          prev.map((msg, idx) =>
            idx === assistantMessageIndex.current
              ? { ...msg, isLoading: false, boxData: "loading" }
              : msg
          )
        );

        // Simulate loading time, then show actual box
        setTimeout(() => {
          setChatHistory((prev) =>
            prev.map((msg, idx) =>
              idx === assistantMessageIndex.current
                ? { ...msg, boxData: "AI Box Rendered" }
                : msg
            )
          );
        }, 2000);
        break;
    }
  };

  const tryParseFunctionCall = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.function_call) {
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
          // Not JSON. Possibly a partial function call or normal text.
        }

        if (parsedChunk && parsedChunk.function_call) {
          if (!parsedChunk.function_call.name) {
            updateAssistantMessage(
              "Sorry, I did not understand your request. Can you type it again?"
            );
            finalizeAssistantMessage();
            return;
          }

          // If we got a direct function call JSON
          if (typeof parsedChunk.function_call === "string") {
            // Accumulate and try parse again
            functionCallBuffer.current += parsedChunk.function_call;
            const parsedFunction = tryParseFunctionCall(
              functionCallBuffer.current
            );
            if (parsedFunction) {
              await handleFunctionCall(
                parsedFunction.function_call.name,
                parsedFunction.function_call.arguments
              );
              functionCallBuffer.current = "";
            }
            // If still not parseable, just continue accumulating
          } else {
            // Fully formed function call
            await handleFunctionCall(
              parsedChunk.function_call.name,
              parsedChunk.function_call.arguments
            );
            functionCallBuffer.current = "";
          }
        } else {
          // No direct function_call in chunk
          // Maybe it's partial function call data or normal text
          if (functionCallBuffer.current) {
            // We have some accumulated data, try adding this chunk to the buffer and parse
            functionCallBuffer.current += chunk;
            const parsedFunction = tryParseFunctionCall(
              functionCallBuffer.current
            );
            if (parsedFunction) {
              await handleFunctionCall(
                parsedFunction.function_call.name,
                parsedFunction.function_call.arguments
              );
              functionCallBuffer.current = "";
              continue;
            } else {
              // Still not parseable as function call. It might be normal text after all.
              // Since we failed to parse even after accumulation, let's treat this new chunk as text.
              // But we must not lose previously accumulated data. Since it didn't form a valid function call,
              // we assume it was just text. So updateAssistantMessage with the entire buffer + this chunk.
              updateAssistantMessage(functionCallBuffer.current);
              functionCallBuffer.current = "";
            }
          } else {
            // No accumulated function call, just normal text.
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
      // If there's any leftover function call buffer at the end, treat it as text.
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

  return (
    <div className={styles.Chatbot}>
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
                  // Show skeleton loader
                  return (
                    <div className={styles.boxLoader}>
                      <SkeletonBox />
                    </div>
                  );
                } else {
                  // Render the box with the data
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
};

export default Chatbot;
