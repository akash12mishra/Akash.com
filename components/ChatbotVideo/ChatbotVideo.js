import React from "react";
import styles from "./ChatbotVideo.module.scss";

const ChatbotVideo = () => {
  return (
    <video autoPlay loop muted playsInline className={styles.chatbotVideo}>
      <source src="/videos/chatBot.mp4" type="video/mp4" />
    </video>
  );
};

export default ChatbotVideo;
