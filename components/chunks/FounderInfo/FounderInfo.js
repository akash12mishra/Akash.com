"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./FounderInfo.module.scss";
import founderLogo from "../../../assets/images/arka.png";
import Image from "next/image";

const FounderInfo = () => {
  const paragraphRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!paragraphRef.current) return;

      const paragraphRect = paragraphRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Adjust progress calculation to ensure the animation completes by the end of the scroll
      const progress = Math.min(
        Math.max(
          (windowHeight - paragraphRect.top) /
            (paragraphRect.height + windowHeight * 0.5), // Reduced height for faster completion
          0
        ),
        1
      );

      setScrollProgress(progress); // Update progress between 0 and 1
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Paragraph text with line breaks for rendering as per the image
  const paragraphText = [
    "“Arka is a dedicated developer delivering projects with ReactJS, Redux, and NextJS.",
    "Highly specialised in SEO, Generative AI, and user-focused products.",
    "",
    "We are super happy with the result and product we got.",
    "Love to work with experienced, friendly, and helpful clients.",
    "Let’s collaborate from scratch and ship real value, harnessing React, NextJS, Generative AI with building MPVs and Sass products from scratch integrating AI Automations”",
  ];

  const totalCharacters = paragraphText.join("").length;

  // Helper function to render text letter by letter
  const renderLetterByLetter = (text, startIndex) => {
    return text.split("").map((char, index) => {
      const progressIndex = startIndex + index;
      const opacity = Math.min(
        Math.max(scrollProgress * totalCharacters - progressIndex, 0),
        1
      );
      return (
        <span
          key={progressIndex}
          style={{
            color: opacity > 0 ? `rgba(0, 0, 0, ${opacity})` : "lightgray",
            transition: "color 0.1s ease-out",
            display: "inline", // Changed from inline-block
            whiteSpace: "pre-wrap", // Added this
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className={styles.FounderInfo}>
      <div className={styles.founderImage}>
        <Image src={founderLogo} alt="Founder" className={styles.founderImg} />
      </div>

      <div className={styles.founderDetails}>
        <p ref={paragraphRef}>
          {paragraphText.map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {renderLetterByLetter(
                line,
                paragraphText.slice(0, lineIndex).join("").length
              )}
              {lineIndex < paragraphText.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      </div>

      <div className={styles.founderSignature}>
        <h6>Arka Lal Chakravarty</h6>
        <p>Founder @ arkalalchakravarty.com</p>
      </div>
    </div>
  );
};

export default FounderInfo;
