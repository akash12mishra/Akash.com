"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./ChatBubble.module.scss";
import Chatbot from "../Chatbot/Chatbot";
import Image from "next/image";
import arkImg from "../../../assets/images/arka.png";
import { IoMdClose } from "react-icons/io";
import { FaRobot } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ChatBubble = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const onOpenBubble = () => {
      if (typeof window !== "undefined" && !window.bubbleClosed && !isChatOpen) {
        setIsChatOpen(true);
      }
    };

    window.addEventListener("openBubble", onOpenBubble);

    return () => {
      window.removeEventListener("openBubble", onOpenBubble);
    };
  }, [isChatOpen]);

  const handleToggleChat = (e) => {
    if (e) e.stopPropagation(); // Prevent click from bubbling up
    setIsChatOpen(prev => !prev);
  };

  return (
    <div className={styles.chatBubbleContainer}>
      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            className={styles.chatWindow}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: isMobile ? "tween" : "spring", // Use simpler animation on mobile
              stiffness: isMobile ? 100 : 300, // Lower stiffness on mobile 
              damping: isMobile ? 15 : 25,    // Adjusted damping
              duration: isMobile ? 0.2 : 0.3   // Faster animation on mobile
            }}
          >
            <div className={styles.chatHeader}>
              <div className={styles.chatTitle}>
                <span className={styles.pulseDot}></span>
                <h3>Ask me about Arka</h3>
              </div>
              <button 
                className={styles.closeButton}
                onClick={handleToggleChat}
                aria-label="Close chat"
              >
                <IoMdClose />
              </button>
            </div>
            <div className={styles.chatContent}>
              <Chatbot />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Bubble */}
      <motion.button
        className={styles.chatBubble}
        onClick={handleToggleChat}
        whileHover={!isMobile ? { scale: 1.1 } : {}} // Disable hover on mobile
        whileTap={{ scale: 0.95 }}
        animate={isChatOpen && !isMobile ? { rotate: [0, 15, -15, 0] } : {}} // Disable rotation on mobile
        aria-label="Open chat assistant"
      >
        {!isChatOpen && (
          <motion.div 
            className={styles.bubbleContent}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              type: isMobile ? "tween" : "spring", // Use simpler animation on mobile
              duration: isMobile ? 0.2 : 0.3      // Faster animation on mobile
            }}
          >
            <FaRobot className={styles.robotIcon} />
            <div className={styles.glowEffect}></div>
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default ChatBubble;
