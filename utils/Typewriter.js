import React, { useState, useEffect } from "react";
import styles from "./Typewriter.module.scss";

const Typewriter = ({
  words,
  typeSpeed = 70,
  deleteSpeed = 50,
  delaySpeed = 2000,
  cursorStyle = "_",
  duration = 20000, // Duration in milliseconds (20 seconds)
}) => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const endTime = Date.now() + duration;

    const type = () => {
      const currentWord = words[wordIndex];
      if (Date.now() > endTime) {
        // Stop animation after duration ends
        setIsFinished(true);
        setText(words[words.length - 1]);
        return;
      }

      if (isDeleting) {
        // Delete character by character
        if (text === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        } else {
          setText(currentWord.substring(0, text.length - 1));
        }
      } else {
        // Type character by character
        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), delaySpeed);
        } else {
          setText(currentWord.substring(0, text.length + 1));
        }
      }
    };

    const timer = setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(timer);
  }, [
    text,
    isDeleting,
    wordIndex,
    words,
    typeSpeed,
    deleteSpeed,
    delaySpeed,
    duration,
  ]);

  return (
    <span className={styles.typewriter}>
      {text}
      <span className={styles.cursor}>{cursorStyle}</span>
    </span>
  );
};

export default Typewriter;
