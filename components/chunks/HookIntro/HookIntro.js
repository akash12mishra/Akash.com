import React from "react";
import styles from "./HookIntro.module.scss";
import { IoSparklesOutline } from "react-icons/io5";

const HookIntro = () => {
  return (
    <div className={styles.HookIntro}>
      <div className={styles.HookIntroTitle}>
        <h3>
          Unlimited <span>AI Assistants</span> and <span>Automations</span>{" "}
          <br /> and <span>MVPs</span> and many more...
        </h3>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A, quaerat.
        </p>
      </div>

      <video autoPlay loop muted playsInline className={styles.HookIntroVideo}>
        <source src="/videos/HookIntro.mp4" type="video/mp4" />
      </video>

      <div className={styles.HookIntroBtn}>
        <button>
          Book a call <IoSparklesOutline className={styles.HookIntroBtnIcon} />{" "}
        </button>
      </div>
    </div>
  );
};

export default HookIntro;
