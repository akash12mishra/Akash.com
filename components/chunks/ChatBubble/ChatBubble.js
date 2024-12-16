"use client";

import React, { useEffect, useState } from "react";
import styles from "./ChatBubble.module.scss";
import Chatbot from "../Chatbot/Chatbot";
import Image from "next/image";
import arkImg from "../../../assets/images/arka.png";
import { IoMdClose } from "react-icons/io";

const ChatBubble = () => {
  const [IsBubbl, setIsBubbl] = useState(false);

  useEffect(() => {
    const onOpenBubble = () => {
      if (typeof window !== "undefined" && !window.bubbleClosed && !IsBubbl) {
        setIsBubbl(true);
      }
    };

    window.addEventListener("openBubble", onOpenBubble);

    return () => {
      window.removeEventListener("openBubble", onOpenBubble);
    };
  }, [IsBubbl]);

  return (
    <div onClick={() => setIsBubbl(!IsBubbl)} className={styles.ChatBubble}>
      {IsBubbl ? (
        <>
          {" "}
          <IoMdClose className={styles.ChatBubbleClose} />
        </>
      ) : (
        <>
          <Image
            className={styles.ChatBubbleImg}
            src={arkImg}
            alt="Chat bubble"
          />
        </>
      )}

      {IsBubbl && (
        <div className={styles.ChatBubbleChatbox}>
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
