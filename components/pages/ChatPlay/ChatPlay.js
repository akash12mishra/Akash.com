"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatPlay.module.scss";
import axios from "../../../axios/api"; // Backend API
import SkeletonBox from "../../SkeletonBox/SkeletonBox";
import Box from "../../Box/Box";

const ChatPlay = () => {
  const [chatHistory, setChatHistory] = useState([]); // Chat messages
  const [input, setInput] = useState(""); // User input
  const [isLoading, setIsLoading] = useState(false); // Loader state for AI response
  const [isFirstMessage, setIsFirstMessage] = useState(true); // Track the first message
  const chatbotBoxRef = useRef(null); // Reference to chatbot box for independent scrolling

  // Scroll to the bottom of the chat box
  const scrollToBottom = () => {
    if (chatbotBoxRef.current) {
      chatbotBoxRef.current.scrollTo({
        top: chatbotBoxRef.current.scrollHeight,
        behavior: "smooth", // Smooth scrolling for new messages
      });
    }
  };

  // Scroll to the top of the chat box
  const scrollToTop = () => {
    if (chatbotBoxRef.current) {
      chatbotBoxRef.current.scrollTo({
        top: 0,
        behavior: "smooth", // Smooth scrolling to the top
      });
    }
  };

  // Initial scroll when the component mounts (for mobile devices)
  useEffect(() => {
    if (window.innerWidth <= 480) {
      setTimeout(scrollToBottom, 100); // Scroll to the bottom initially
    }
  }, []);

  // Scroll to bottom when chat history updates (after the first message)
  useEffect(() => {
    if (!isFirstMessage || window.innerWidth > 480) {
      scrollToBottom();
    }
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

    if (isFirstMessage && window.innerWidth <= 480) {
      // On mobile, scroll to the top for the first message
      setIsFirstMessage(false); // Mark that the first message has been sent
      scrollToTop();
    }

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
        const functionCall = aiMessage.function_call;

        if (functionCall.name === "render_box_component") {
          setChatHistory((prev) =>
            prev.map((msg, index) =>
              index === prev.length - 1
                ? { ...msg, isLoading: false, boxData: null, isRenderBox: true }
                : msg
            )
          );

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
          }, 3000);
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

  const handleKeyDown = (e) => {
    // Prevent form submission on mobile when Enter is pressed
    if (window.innerWidth <= 480 && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setInput((prev) => prev + "\n"); // Add a new line instead
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
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user" ? styles.userMessage : styles.aiMessage
            }
          >
            {message.isRenderBox && message.boxData === null ? (
              <SkeletonBox />
            ) : message.boxData !== null ? (
              <Box data={message.boxData} />
            ) : message.isLoading ? (
              <div className={styles.loaderContainer}>typing...</div>
            ) : (
              <div>{renderFormattedMessage(message.content)}</div>
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
