"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.scss";
import axios from "../../../axios/api"; // Backend API
import SkeletonBox from "../../SkeletonBox/SkeletonBox";
import Box from "../../Box/Box";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]); // Chat messages
  const [input, setInput] = useState(""); // User input
  const [isLoading, setIsLoading] = useState(false); // Loader state for AI response
  const messagesEndRef = useRef(null); // For scrolling to the bottom
  const chatbotBoxRef = useRef(null); // Reference to chatbot box for independent scrolling

  // Scroll to the bottom of chatbot box
  const scrollToBottom = () => {
    if (chatbotBoxRef.current) {
      chatbotBoxRef.current.scrollTop = chatbotBoxRef.current.scrollHeight;
    }
  };

  // Scroll to bottom on chat history update
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Add a message to chat history
  const addMessage = (role, content) => {
    setChatHistory((prev) => [...prev, { role, content }]);
  };

  // Add progressively rendered messages
  const addProgressiveMessage = (role, contentArray) => {
    contentArray.forEach((content, index) => {
      setTimeout(() => {
        addMessage(role, content);
      }, index * 500); // Display each chunk with a delay
    });
  };

  // Handle input submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();

    if (!userMessage) return; // Prevent empty messages

    // Add user's message to chat history
    addMessage("user", userMessage);
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
          setChatHistory((prev) => [
            ...prev.slice(0, -1),
            {
              role: "assistant",
              content: "",
              boxData: null,
              isLoading: true,
            },
          ]);

          // Simulate box rendering delay
          setTimeout(() => {
            setChatHistory((prev) => [
              ...prev.slice(0, -1),
              {
                role: "assistant",
                content: "",
                boxData: "This is an AI-rendered box component!",
                isLoading: false,
              },
            ]);
          }, 3000);
        } else if (functionCall.name === "get_training_data") {
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
        // Normal AI response - split into chunks
        const responseChunks = aiMessage.content.split("\n\n");
        setChatHistory((prev) => prev.slice(0, -1)); // Remove loader
        addProgressiveMessage("assistant", responseChunks);
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
    <div className={styles.Chatbot}>
      {/* Chat Box */}
      <div className={styles.chatbotBox} ref={chatbotBoxRef}>
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user" ? styles.userMessage : styles.aiMessage
            }
          >
            {message.boxData !== undefined ? (
              message.isLoading ? (
                <SkeletonBox />
              ) : (
                <Box data={message.boxData} />
              )
            ) : (
              <p>{message.content}</p>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className={styles.chatbotInput}>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your query..."
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
