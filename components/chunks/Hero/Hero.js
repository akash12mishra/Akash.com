"use client";

import React from "react";
import styles from "./Hero.module.scss";
import { CiVideoOn } from "react-icons/ci";
import Typewriter from "../../../utils/Typewriter";

const Hero = () => {
  return (
    <div className={styles.Hero}>
      <div className={styles.HeroTitle}>
        <h2>
          Building{" "}
          <span>
            {" "}
            <Typewriter
              words={["AI Powered", "High Performance", "Communities"]}
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
              cursorStyle="_"
              duration={20000} // Stops after 20 seconds
            />{" "}
          </span>
          {"  "}
          Websites with <br /> Excellent Design & Speed{" "}
        </h2>
      </div>

      <div className={styles.HeroDesc}>
        <p>
          We build websites that drive results and help your business grow.{" "}
          <br /> No Calls. No BS. Just Results.
        </p>
      </div>

      <div className={styles.HeroBtn}>
        <button>
          Book a call <CiVideoOn className={styles.HeroBtnIcon} />{" "}
        </button>
      </div>

      <div className={styles.HeroChatbot}></div>
    </div>
  );
};

export default Hero;
