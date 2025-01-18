"use client";

import React, { useRef, useState } from "react";
import styles from "./Hero.module.scss";
import { CiVideoOn } from "react-icons/ci";
import Typewriter from "../../../utils/Typewriter";
import Chatbot from "../Chatbot/Chatbot";

const Hero = () => {
  const [showVideo, setShowVideo] = useState(true);
  const chatbotRef = useRef(null);

  // const handleCallButtonClick = () => {
  //   setShowVideo(false);
  //   setTimeout(() => {
  //     chatbotRef.current?.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center", // This will center the element in viewport
  //     });
  //   }, 100); // Small delay to ensure state update completes
  // };

  return (
    <div className={styles.Hero}>
      <div className={styles.heroGlassSlots}>
        <p>
          {" "}
          <span>Limited Availability:</span> 3 spots available
        </p>
      </div>

      <div className={styles.HeroTitle}>
        <h2>
          Building{" "}
          <span>
            {" "}
            <Typewriter
              words={["AI Powered", "High Performance", "SEO Optimized"]}
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
              cursorStyle="_"
              duration={20000} // Stops after 20 seconds
            />{" "}
          </span>
          {"  "}
          MVPs with <br /> Excellent Design & Speed{" "}
        </h2>
      </div>

      <div className={styles.HeroDesc}>
        <p>
          We build Websites, MVPs and AI Automations that drive results and help{" "}
          <br />
          your business grow. No Calls. Just Results.
        </p>
      </div>

      <div className={styles.HeroBtn}>
        <button
          onClick={() =>
            window.open(
              "https://calendly.com/arkalal-chakravarty/30min",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          Book a call <CiVideoOn className={styles.HeroBtnIcon} />{" "}
        </button>
      </div>

      <Chatbot
        ref={chatbotRef}
        // showVideo={showVideo}
        setShowVideo={setShowVideo}
      />
    </div>
  );
};

export default Hero;
