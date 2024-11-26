"use client";

import React from "react";
import styles from "./StackHeadline.module.scss";
import Image from "next/image";
import mongoDBImg from "../../../assets/images/mongoDB.png";
import vercelImg from "../../../assets/images/vercel.png";
import openaiImg from "../../../assets/images/openai.png";
import reactImg from "../../../assets/images/React.png";
import nextjsImg from "../../../assets/images/nextJS.png";

const StackHeadline = () => {
  const images = [
    { src: reactImg, alt: "React" },
    { src: nextjsImg, alt: "Next.js" },
    { src: mongoDBImg, alt: "MongoDB" },
    { src: openaiImg, alt: "OpenAI" },
    { src: vercelImg, alt: "Vercel" },
  ];

  return (
    <div className={styles.StackHeadline}>
      <div className={styles.movingImages}>
        {images.map((image, index) => (
          <Image
            key={`image-${index}`}
            src={image.src}
            alt={image.alt}
            className={styles.StackHeadlineImg}
          />
        ))}
        {/* Duplicate images for seamless animation */}
        {images.map((image, index) => (
          <Image
            key={`duplicate-image-${index}`}
            src={image.src}
            alt={image.alt}
            className={styles.StackHeadlineImg}
          />
        ))}
      </div>
    </div>
  );
};

export default StackHeadline;
