"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.scss";
import axios from "../../../axios/api"; // Backend API
import SkeletonBox from "../../SkeletonBox/SkeletonBox";
import Box from "../../Box/Box";
import { RingLoader } from "react-spinners"; // Import RingLoader

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]); // Chat messages
  const [input, setInput] = useState(""); // User input
  const [isLoading, setIsLoading] = useState(false); // Global loader state
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
  const addMessage = (
    role,
    content,
    isLoading = false,
    boxData = null,
    isRenderBox = false
  ) => {
    setChatHistory((prev) => [
      ...prev,
      { role, content, isLoading, boxData, isRenderBox },
    ]);
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
    addMessage("assistant", "", true);
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
          // Replace the RingLoader with SkeletonBox for this response
          setChatHistory((prev) =>
            prev.map((msg, index) =>
              index === prev.length - 1
                ? { ...msg, isLoading: false, boxData: null, isRenderBox: true }
                : msg
            )
          );

          // Simulate box rendering delay
          setTimeout(() => {
            setChatHistory((prev) =>
              prev.map((msg, index) =>
                index === prev.length - 1 && msg.isRenderBox
                  ? {
                      ...msg,
                      boxData: "This is an AI-rendered box component!",
                      isRenderBox: false,
                    }
                  : msg
              )
            );
          }, 3000); // Simulated 3-second delay
        } else if (functionCall.name === "get_training_data") {
          const trainingData = await axios.get("train");
          setChatHistory((prev) =>
            prev.map((msg, index) =>
              index === prev.length - 1
                ? {
                    ...msg,
                    isLoading: false,
                    content: `Training data: ${trainingData.data.message}`,
                  }
                : msg
            )
          );
        }
      } else {
        // Normal AI response - split into chunks
        const responseChunks = aiMessage.content.split("\n\n");
        setChatHistory((prev) => prev.slice(0, -1)); // Remove loader
        responseChunks.forEach((chunk, index) => {
          setTimeout(() => {
            addMessage("assistant", chunk);
          }, index * 500); // Progressive rendering
        });
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setChatHistory((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1
            ? { ...msg, isLoading: false, content: "Error. Please try again." }
            : msg
        )
      );
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
            {message.isRenderBox && message.boxData === null ? (
              <SkeletonBox /> // Render SkeletonBox only for render_box_component
            ) : message.boxData !== null ? (
              <Box data={message.boxData} /> // Render actual Box after loading
            ) : message.isLoading ? (
              <div className={styles.loaderContainer}>
                <RingLoader color="#000000" size={30} />
              </div> // Render RingLoader for normal loading
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
