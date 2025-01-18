"use client";

import React from "react";
import styles from "./HookIntro.module.scss";
import { IoSparklesOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const HookIntro = () => {
  const router = useRouter();

  return (
    <div className={styles.HookIntro}>
      <div className={styles.HookIntroTitle}>
        <h3>
          Unlimited <span>AI Assistants</span> and <span>Automations</span>{" "}
          <br /> and <span>MVPs</span> and many more...
        </h3>

        <p>
          Get your business to the next level with our MVP development & AI
          powered solutions.
        </p>
      </div>

      <video autoPlay loop muted playsInline className={styles.HookIntroVideo}>
        <source src="/videos/HookIntro.mp4" type="video/mp4" />
      </video>

      <div className={styles.HookIntroBtn}>
        <button
          onClick={() =>
            window.open(
              "https://calendly.com/arkalal-chakravarty/30min",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          Book a call <IoSparklesOutline className={styles.HookIntroBtnIcon} />{" "}
        </button>
      </div>
    </div>
  );
};

export default HookIntro;
