"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatPlay.module.scss";
import Box from "../../Box/Box";

// Typing animation component
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
  };

  const updateAssistantMessage = (chunk) => {
    setChatHistory((prev) => {
      const updatedHistory = [...prev];
      const assistantIndex = updatedHistory.findIndex(
        (msg) => msg.role === "assistant" && msg.isLoading === true
      );

      if (assistantIndex !== -1) {
        const previousContent = updatedHistory[assistantIndex].content || "";
        // Add space if needed between chunks
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

        updatedHistory[assistantIndex] = {
          ...updatedHistory[assistantIndex],
          content: previousContent + (needsSpace ? " " : "") + chunk,
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
  };

  console.log("chatHistory", chatHistory);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    addMessage("user", userMessage);
    setInput("");
    addMessage("assistant", "", true);
    assistantMessageIndex.current = chatHistory.length;
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value).trim();
        console.log("chunk", chunk);

        try {
          const parsedChunk = JSON.parse(chunk);

          if (parsedChunk.function_call) {
            const { name } = parsedChunk.function_call;

            if (name === "render_box_component") {
              setChatHistory((prev) =>
                prev.map((msg, idx) =>
                  idx === assistantMessageIndex.current
                    ? { ...msg, isLoading: false, boxData: "AI Box Rendered" }
                    : msg
                )
              );
            } else if (name === "get_training_data") {
              const trainingData = await fetch("/api/train").then((res) =>
                res.json()
              );
              setChatHistory((prev) =>
                prev.map((msg, idx) =>
                  idx === assistantMessageIndex.current
                    ? {
                        ...msg,
                        isLoading: false,
                        content: `Training data: ${trainingData.message}`,
                      }
                    : msg
                )
              );
            }
            return;
          }
        } catch {
          updateAssistantMessage(chunk);
        }

        scrollToBottom();
      }

      finalizeAssistantMessage();
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

  const renderFormattedMessage = (content) => {
    const lines = content.split("\n");
    const elements = [];

    lines.forEach((line, index) => {
      const match = line.match(/^(\d+)\.\s\*\*(.*?)\*\*(.*)/); // Match numbered headings with optional emoji/colon
      if (match) {
        const [, number, heading, emojiOrColon] = match;
        elements.push(
          <div key={index} className={styles.formattedMessage}>
            <div className={styles.headingLine}>
              <span className={styles.number}>{number}.</span>
              <span className={styles.heading}>{heading}</span>
              {emojiOrColon && (
                <span className={styles.emojiOrColon}>
                  {emojiOrColon.trim()}
                </span>
              )}
            </div>
          </div>
        );
      } else if (line.startsWith("-")) {
        elements.push(
          <ul key={index} className={styles.description}>
            <li>{line.replace("-", "").trim()}</li>
          </ul>
        );
      } else {
        elements.push(
          <p key={index} className={styles.description}>
            {line.trim()}
          </p>
        );
      }
    });

    return elements;
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
            {msg.isLoading && !msg.content ? (
              <>
                {msg.boxData ? <Box data={msg.boxData} /> : <TypingAnimation />}
              </>
            ) : (
              renderFormattedMessage(msg.content || "")
            )}
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
