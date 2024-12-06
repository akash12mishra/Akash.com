import React from "react";
import styles from "./Stack.module.scss";
import Image from "next/image";

const Stack = () => {
  return (
    <div className={styles.Stack}>
      <Image
        src="/images/nextJS.png"
        alt="NextJS"
        className={styles.stackImg}
        width={100}
        height={100}
      />

      <Image
        src="/images/mongoDB.png"
        alt="MongoDB"
        className={styles.stackImg}
        width={100}
        height={100}
      />

      <Image
        src="/images/openai.png"
        alt="OpenAI"
        className={styles.stackImg}
        width={100}
        height={100}
      />

      <Image
        src="/images/react.png"
        alt="React"
        className={styles.stackImg}
        width={100}
        height={100}
      />

      <Image
        src="/images/node.png"
        alt="React"
        className={styles.stackImg}
        width={100}
        height={100}
      />

      <Image
        src="/images/vercel.png"
        alt="Vercel"
        className={styles.stackImg}
        width={100}
        height={100}
      />
    </div>
  );
};

export default Stack;
