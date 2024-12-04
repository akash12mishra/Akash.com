"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import styles from "./ChatPlay.module.scss";
import axios from "../../../axios/api"; // Backend API

const ChatPlay = () => {
  const [chatHistory, setChatHistory] = useState([]); // Chat messages
  const [input, setInput] = useState(""); // User input
  const [isLoading, setIsLoading] = useState(false); // Loader state for AI response
  const messagesEndRef = useRef(null); // For scrolling to the bottom

  // Scroll to the bottom when chat history updates
  useLayoutEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Handle input submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();

    if (!userMessage) return; // Prevent empty messages

    // Add user's message to chat history
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput(""); // Clear the input field

    // Add loading message for AI
    setChatHistory((prev) => [
      ...prev,
      { role: "assistant", content: "", isLoading: true },
    ]);
    setIsLoading(true);

    try {
      const response = await axios.post("chat", {
        prompt: userMessage,
        conversationHistory: chatHistory,
      });

      const aiMessage = response.data;

      if (aiMessage.function_call) {
        // Handle AI function calls
        const functionCall = aiMessage.function_call;

        if (functionCall.name === "render_box_component") {
          // Simulate box rendering
          setChatHistory((prev) => [
            ...prev.slice(0, -1), // Remove the loader
            {
              role: "assistant",
              content: "",
              boxData: "This is an AI-rendered box component!",
            },
          ]);
        } else if (functionCall.name === "get_training_data") {
          // Fetch training data from API
          const trainingData = await axios.get("train");
          setChatHistory((prev) => [
            ...prev.slice(0, -1),
            {
              role: "assistant",
              content: `Training data: ${trainingData.data.message}`,
            },
          ]);
        }
      } else {
        // Normal AI response
        setChatHistory((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: aiMessage.content },
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.ChatPlay}>
      {/* Chat Box */}
      <div className={styles.chatPlayBox}>
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user" ? styles.userMessage : styles.aiMessage
            }
          >
            {message.boxData ? (
              <div className={styles.box}>{message.boxData}</div>
            ) : (
              <p>{message.content || "Loading..."}</p>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className={styles.chatPlayInput}>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your query..."
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPlay;
