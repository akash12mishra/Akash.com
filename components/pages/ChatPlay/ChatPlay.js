"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import styles from "./ChatPlay.module.scss";
import axios from "../../../axios/api"; // Backend API
import SkeletonBox from "../../SkeletonBox/SkeletonBox";
import Box from "../../Box/Box";

const ChatPlay = () => {
  const [chatHistory, setChatHistory] = useState([]); // Chat messages
  const [input, setInput] = useState(""); // User input
  const [isLoading, setIsLoading] = useState(false); // Loader state for AI response
  const messagesEndRef = useRef(null); // For scrolling to the bottom
  const chatbotBoxRef = useRef(null); // Reference to chatbot box for independent scrolling

  // Scroll to the bottom of chatbot box smoothly
  const scrollToBottom = () => {
    if (chatbotBoxRef.current) {
      chatbotBoxRef.current.scrollTo({
        top: chatbotBoxRef.current.scrollHeight,
        behavior: "smooth", // Enables smooth scrolling
      });
    }
  };

  // Scroll to bottom on chat history update
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

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
        // Normal AI response
        setChatHistory((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1
              ? { ...msg, isLoading: false, content: aiMessage.content }
              : msg
          )
        );
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

  // Function to parse and render formatted AI messages
  const renderFormattedMessage = (content) => {
    const lines = content.split("\n"); // Split by lines
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
        // Handle bullet points
        elements.push(
          <ul key={index} className={styles.description}>
            <li>{line.replace("-", "").trim()}</li>
          </ul>
        );
      } else {
        // Handle normal paragraphs or other text
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
              <div className={styles.loaderContainer}>typing...</div> // Render typing loader
            ) : (
              <div>{renderFormattedMessage(message.content)}</div> // Render formatted message
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatPlayInput}>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
