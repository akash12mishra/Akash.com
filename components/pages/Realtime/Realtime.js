"use client";

import React, { useState } from "react";
import axios from "../../../axios/api"; // Adjust based on your setup
import styles from "./Realtime.module.scss";

const Realtime = () => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
        console.log("[Recording] Audio Blob size:", blob.size);
      };

      recorder.start();
      setIsRecording(true);

      setTimeout(() => {
        recorder.stop();
        setIsRecording(false);
      }, 8000);
    } catch (error) {
      console.error("[Recording Error]:", error);
    }
  };

  const sendAudio = async () => {
    if (!audioBlob) {
      console.error("[Error] No audio recorded.");
      return;
    }

    try {
      setIsSending(true);

      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const response = await axios.post("audioChat", {
        audioData: base64Audio,
      });

      if (response.data.audioData) {
        playAudio(response.data.audioData);
        addMessage("assistant", response.data.response);
      } else {
        addMessage("assistant", "No audio response received.");
      }
    } catch (error) {
      console.error("[Error Sending Audio]:", error);
      addMessage("assistant", "Error sending audio.");
    } finally {
      setIsSending(false);
    }
  };

  const playAudio = (audioBase64) => {
    const audioBlob = new Blob(
      [Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))],
      { type: "audio/wav" }
    );
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => URL.revokeObjectURL(audioUrl);
  };

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  return (
    <div className={styles.Realtime}>
      <div className={styles.messages}>
        {messages.map((message, index) => (
          <div key={index} className={styles.message}>
            <span
              className={
                message.role === "user" ? styles.user : styles.assistant
              }
            >
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button
          onClick={startRecording}
          disabled={isRecording || isSending}
          className={styles.recordButton}
        >
          {isRecording ? "Recording..." : "Start Recording"}
        </button>
        <button
          onClick={sendAudio}
          disabled={!audioBlob || isSending}
          className={styles.sendButton}
        >
          {isSending ? "Sending..." : "Send Audio"}
        </button>
      </div>
    </div>
  );
};

export default Realtime;
