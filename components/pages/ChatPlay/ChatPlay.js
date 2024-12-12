"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatPlay.module.scss";
import SkeletonBox from "../../SkeletonBox/SkeletonBox";
import Box from "../../Box/Box";

const ChatPlay = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatbotBoxRef = useRef(null);
  const assistantMessageIndex = useRef(null); // Tracks the assistant message index
  const accumulatedText = useRef(""); // Tracks accumulated AI response text to prevent duplication

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
      if (assistantMessageIndex.current !== null) {
        const currentMessage = updatedHistory[assistantMessageIndex.current];
        if (!currentMessage.content.endsWith(chunk)) {
          // Append only new content to prevent duplication
          currentMessage.content += chunk;
        }
      }
      return updatedHistory;
    });
  };

  const finalizeAssistantMessage = () => {
    setChatHistory((prev) => {
      const updatedHistory = [...prev];
      if (assistantMessageIndex.current !== null) {
        updatedHistory[assistantMessageIndex.current].isLoading = false;
      }
      return updatedHistory;
    });
    assistantMessageIndex.current = null; // Reset the index
    accumulatedText.current = ""; // Reset accumulated text
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    // Add user message
    addMessage("user", userMessage);
    setInput("");

    // Add an empty assistant message and track its index
    const currentAssistantIndex = chatHistory.length;
    assistantMessageIndex.current = currentAssistantIndex;
    addMessage("assistant", "", true);
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

        const chunk = decoder.decode(value).trim(); // Trim incoming chunks to avoid whitespace issues
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
            return; // Exit after handling function call
          }
        } catch {
          // Append the chunk to the AI message
          updateAssistantMessage(chunk);
        }

        scrollToBottom();
      }

      finalizeAssistantMessage(); // Finalize the AI message
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
    return lines.map((line, idx) => (
      <p key={idx} className={styles.description}>
        {line.trim()}
      </p>
    ));
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
            {msg.isLoading ? (
              <>
                {msg.boxData ? (
                  <Box data={msg.boxData} />
                ) : (
                  <div className={styles.loader}>
                    <SkeletonBox />
                  </div>
                )}
              </>
            ) : (
              renderFormattedMessage(msg.content)
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
