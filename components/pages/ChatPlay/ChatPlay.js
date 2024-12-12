"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatPlay.module.scss";
import Box from "../../Box/Box";
import SkeletonBox from "../../SkeletonBox/SkeletonBox";

const TypingAnimation = () => (
  <div className={styles.typingAnimation}>
    <div className={styles.dot}></div>
    <div className={styles.dot}></div>
    <div className={styles.dot}></div>
  </div>
);

const ChatPlay = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatbotBoxRef = useRef(null);
  const assistantMessageIndex = useRef(null);
  const currentMessageRef = useRef("");

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

  const updateAssistantMessage = (chunk) => {
    setChatHistory((prev) => {
      const updatedHistory = [...prev];
      const assistantIndex = updatedHistory.findIndex(
        (msg) => msg.role === "assistant" && msg.isLoading === true
      );

      if (assistantIndex !== -1) {
        const previousContent = updatedHistory[assistantIndex].content || "";
        const needsSpace =
          previousContent &&
          !previousContent.endsWith(" ") &&
          !previousContent.endsWith("\n") &&
          !chunk.startsWith(" ") &&
          !chunk.startsWith("\n") &&
          !chunk.startsWith(".") &&
          !chunk.startsWith(",") &&
          !chunk.startsWith("!") &&
          !chunk.startsWith("?");

        currentMessageRef.current =
          previousContent + (needsSpace ? " " : "") + chunk;

        updatedHistory[assistantIndex] = {
          ...updatedHistory[assistantIndex],
          content: currentMessageRef.current,
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

    const processListItems = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} className={styles.bulletList}>
            {listItems.map((item, idx) => (
              <li key={idx} className={styles.bulletItem}>
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
        processListItems();
        inList = false;
        elements.push(
          <div key={`space-${index}`} className={styles.emptyLine} />
        );
        return;
      }

      // Headers
      if (line.startsWith("#")) {
        processListItems();
        inList = false;
        const level = line.match(/^#+/)[0].length;
        const text = line.replace(/^#+\s+/, "");
        elements.push(
          <div key={index} className={styles[`heading${level}`]}>
            {text}
          </div>
        );
        return;
      }

      // Numbered headings
      const numberedHeading = line.match(/^(\d+)\.\s*\*\*(.*?)\*\*(.*)/);
      if (numberedHeading) {
        processListItems();
        inList = false;
        const [, number, heading, rest] = numberedHeading;
        elements.push(
          <div key={index} className={styles.numberedHeading}>
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
        processListItems();
        inList = false;
        elements.push(
          <p key={index} className={styles.paragraph}>
            {parts.map((part, idx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={idx}>{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
        return;
      }

      // Regular text
      processListItems();
      inList = false;
      elements.push(
        <p key={index} className={styles.paragraph}>
          {line.trim()}
        </p>
      );
    });

    // Process remaining list items
    processListItems();

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    // Determine indices before state updates:
    // After adding a user message, it will be placed at current length.
    // The next assistant message will be at current length + 1.
    const userIndex = chatHistory.length;
    const assistantIndex = chatHistory.length + 1;

    // Add user message
    addMessage("user", userMessage);

    // Add assistant "loading" message
    addMessage("assistant", "", true);

    // Now set the assistant message index
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

      let accumulatedFunctionCall = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        console.log("chunk", chunk);

        try {
          const parsedChunk = JSON.parse(chunk);

          if (parsedChunk.function_call) {
            if (typeof parsedChunk.function_call === "string") {
              accumulatedFunctionCall += parsedChunk.function_call;
            } else {
              await handleFunctionCall(
                parsedChunk.function_call.name,
                parsedChunk.function_call.arguments
              );
            }
          }
        } catch {
          if (accumulatedFunctionCall) {
            try {
              const parsedFunction = JSON.parse(accumulatedFunctionCall);
              if (parsedFunction.function_call) {
                await handleFunctionCall(
                  parsedFunction.function_call.name,
                  parsedFunction.function_call.arguments
                );
                accumulatedFunctionCall = "";
              }
            } catch {
              // Not yet a complete function call, continue accumulating
            }
          }
          updateAssistantMessage(chunk.trim());
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
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  return (
    <div className={styles.ChatPlay}>
      <div className={styles.chatPlayBox} ref={chatbotBoxRef}>
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
      <div className={styles.chatPlayInput}>
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

export default ChatPlay;
