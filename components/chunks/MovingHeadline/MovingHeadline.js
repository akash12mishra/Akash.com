import React from "react";
import styles from "./MovingHeadline.module.scss";

const MovingHeadline = () => {
  const sentence = (
    <>
      <span className={`${styles.word} ${styles.filled}`}></span>
      <span className={`${styles.word} ${styles.bordered}`}>APPLICATION</span>
      <span className={`${styles.word} ${styles.filled}`}>DEVELOPMENT</span>
      <span className={`${styles.word} ${styles.bordered}`}>DESIGN</span>
      <span className={`${styles.word} ${styles.filled}`}>AI</span>
    </>
  );

  return (
    <div className={styles.MovingHeadline}>
      <div className={styles.movingText}>
        {sentence}
        {sentence} {/* Duplicate sentence to create a smooth loop */}
      </div>
    </div>
  );
};

export default MovingHeadline;
