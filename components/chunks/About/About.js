"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./About.module.scss";
import AboutHeroSimulation from "./AboutHeroSimulation";

const About = () => {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Only the greeting typewriter is animated
  const [greetingText, setGreetingText] = useState("Hi there! I'm Arka");

  // Bio text — shown instantly (no typewriter)
  const bioText1 = "I'm a ";
  const bioHighlight1 = "Full-Stack Engineer";
  const bioText2 = " and ";
  const bioHighlight2 = "AI Specialist";
  const bioText3 =
    " with a passion for building advanced AI SaaS and full stack applications. With expertise in both AI integration and full stack development, I specialize in creating powerful, user-friendly applications that leverage cutting-edge technologies.";

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Greeting typing animation with cycling titles — KEPT
  useEffect(() => {
    const phrases = [
      "Hi there! I'm Arka",
      "Hi there! I'm a Full Stack engineer",
      "Hi there! I'm an AI Specialist",
      "Hi there! I'm Frontend focused",
      "Hi there! I've built AI Agentic features",
      "Looking for an Engineer? Let's collaborate!",
    ];

    let currentPhraseIndex = 0;
    let isFirstLoop = true;
    let cancelled = false;

    const typeText = (fromText, toText, callback) => {
      let commonLength = 0;
      const minLength = Math.min(fromText.length, toText.length);
      for (let i = 0; i < minLength; i++) {
        if (fromText[i] === toText[i]) {
          commonLength++;
        } else {
          break;
        }
      }

      let currentText = fromText;
      const eraseSpeed = 50;
      const typeSpeed = 80;

      const erase = () => {
        if (cancelled) return;
        if (currentText.length > commonLength) {
          currentText = currentText.slice(0, -1);
          setGreetingText(currentText);
          setTimeout(erase, eraseSpeed);
        } else {
          type();
        }
      };

      const type = () => {
        if (cancelled) return;
        if (currentText.length < toText.length) {
          currentText = toText.slice(0, currentText.length + 1);
          setGreetingText(currentText);
          setTimeout(type, typeSpeed);
        } else {
          callback();
        }
      };

      if (currentText.length > commonLength) {
        erase();
      } else {
        type();
      }
    };

    const startCycle = () => {
      if (cancelled) return;
      const currentPhrase = phrases[currentPhraseIndex];
      const nextIndex = (currentPhraseIndex + 1) % phrases.length;
      const nextPhrase = phrases[nextIndex];

      const delay = isFirstLoop && currentPhraseIndex === 0 ? 4000 : 2000;

      setTimeout(() => {
        if (cancelled) return;
        typeText(currentPhrase, nextPhrase, () => {
          currentPhraseIndex = nextIndex;
          if (currentPhraseIndex === 0) {
            isFirstLoop = false;
          }
          startCycle();
        });
      }, delay);
    };

    startCycle();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="about"
      className={`${styles.aboutSection} ${styles.visible}`}
      ref={sectionRef}
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          {isMobile ? (
            <div className={styles.mobileTagWrapper}>
              <span className={styles.mobileSectionTag}>About Me</span>
            </div>
          ) : (
            <span className={styles.sectionTag}>About Me</span>
          )}
        </div>

        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <h3 className={styles.greeting}>
              {greetingText}
              <span className={styles.cursor}>|</span>
            </h3>
            <h2 className={styles.heroHeadline}>
              I build <span className={styles.highlight}>AI-powered SaaS</span>,{" "}
              <span className={styles.highlight}>full-stack apps</span>, and{" "}
              <span className={styles.highlight}>production-ready code</span>.
            </h2>
            <p className={styles.bio}>
              {bioText1}
              <span className={styles.bioAccent}>{bioHighlight1}</span>
              {bioText2}
              <span className={styles.bioAccent}>{bioHighlight2}</span>
              {bioText3}
            </p>
          </div>

          <div className={styles.heroRight}>
            {/* Decorative floating particles around the tilted card */}
            <span className={`${styles.particle} ${styles.partTopRightDot}`} />
            <span
              className={`${styles.particle} ${styles.partTopRightSquare}`}
            />
            <span className={`${styles.particle} ${styles.partTopRightVbar}`} />
            <span className={`${styles.particle} ${styles.partTopRightHbar}`} />
            <span
              className={`${styles.particle} ${styles.partTopLeftSquare}`}
            />
            <span
              className={`${styles.particle} ${styles.partBottomRightDot}`}
            />
            <span className={`${styles.particle} ${styles.partMidRightVbar}`} />
            <span
              className={`${styles.particle} ${styles.partLeftBottomDot}`}
            />
            <span className={`${styles.particle} ${styles.partLeftMidVbar}`} />

            <AboutHeroSimulation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
