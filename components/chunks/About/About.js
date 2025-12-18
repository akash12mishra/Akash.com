"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./About.module.scss";
import Image from "next/image";
import logoImg from "../../../assets/images/arka.png";
import { FaCode, FaLaptopCode, FaRobot } from "react-icons/fa";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useAnimate,
  stagger,
} from "framer-motion";

const About = () => {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [cardsScope, animateCards] = useAnimate();

  // Typewriter animation states
  const [typedText1, setTypedText1] = useState("");
  const [typedText2, setTypedText2] = useState("");
  const [showSimulations, setShowSimulations] = useState(false);
  const [greetingText, setGreetingText] = useState("Hi there! I'm Arka");
  const [showCursor, setShowCursor] = useState(true);

  const bioText1 = "I'm an ";
  const bioHighlight1 = "AI Engineer";
  const bioText2 = " and ";
  const bioHighlight2 = "Full-Stack Developer";
  const bioText3 =
    " with a passion for building advanced AI SaaS products and automations. With expertise in both AI integration and web development, I specialize in creating powerful, user-friendly applications that leverage cutting-edge technologies.";

  const fullBio1 =
    bioText1 + bioHighlight1 + bioText2 + bioHighlight2 + bioText3;
  const bio2Full =
    "My journey in tech has given me a unique perspective on how to create efficient, scalable solutions that help businesses grow. I'm always excited to take on new challenges and bring innovative ideas to life.";

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Trigger animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            entry.target.classList.add(styles.visible);
            setIsVisible(true);
          }
        });
      },
      { threshold: isMobile ? 0.1 : 0.2 }
    );

    const current = sectionRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [isMobile, isVisible]);

  // Greeting typing animation with cycling titles
  useEffect(() => {
    if (!isVisible) return;

    const phrases = [
      "Hi there! I'm Arka",
      "Hi there! I'm a Full Stack developer",
      "Hi there! I'm an AI engineer",
      "Hi there! I build AI Agents",
      "Need tech support? Lets collaborate and work together!",
    ];

    let currentPhraseIndex = 0;
    let isFirstLoop = true;

    const typeText = (fromText, toText, callback) => {
      // Find common prefix
      let commonLength = 0;
      const minLength = Math.min(fromText.length, toText.length);
      for (let i = 0; i < minLength; i++) {
        if (fromText[i] === toText[i]) {
          commonLength++;
        } else {
          break;
        }
      }

      // Erase uncommon part
      let currentText = fromText;
      const eraseSpeed = 50;
      const typeSpeed = 80;

      const erase = () => {
        if (currentText.length > commonLength) {
          currentText = currentText.slice(0, -1);
          setGreetingText(currentText);
          setTimeout(erase, eraseSpeed);
        } else {
          // Start typing new part
          type();
        }
      };

      const type = () => {
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
      const currentPhrase = phrases[currentPhraseIndex];
      const nextIndex = (currentPhraseIndex + 1) % phrases.length;
      const nextPhrase = phrases[nextIndex];

      const delay = isFirstLoop && currentPhraseIndex === 0 ? 4000 : 2000;

      setTimeout(() => {
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
  }, [isVisible]);

  // Bio paragraph typewriter animation
  useEffect(() => {
    if (!isVisible) return;

    let i = 0;
    let j = 0;
    const speed1 = 3000 / fullBio1.length;
    const speed2 = 2000 / bio2Full.length;

    const typeFirst = () => {
      if (i < fullBio1.length) {
        setTypedText1(fullBio1.slice(0, i + 1));
        i++;
        setTimeout(typeFirst, speed1);
      } else {
        typeSecond();
      }
    };

    const typeSecond = () => {
      if (j < bio2Full.length) {
        setTypedText2(bio2Full.slice(0, j + 1));
        j++;
        setTimeout(typeSecond, speed2);
      } else {
        setTypewriterComplete(true);
        setTimeout(() => setShowSimulations(true), 1000);
      }
    };

    typeFirst();
  }, [isVisible]);

  // Card reveal animations
  useEffect(() => {
    if (!typewriterComplete || !cardsScope.current) return;

    const animateSequence = async () => {
      await animateCards(
        ".skill-card",
        {
          opacity: [0, 1],
          y: [20, 0],
          scale: [0.95, 1],
        },
        {
          duration: 0.4,
          delay: stagger(0.15),
          ease: "easeOut",
        }
      );
    };

    animateSequence();
  }, [typewriterComplete, animateCards, cardsScope]);

  return (
    <section id="about" className={styles.aboutSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          {isMobile ? (
            /* Mobile version of the button with minimal styling */
            <div className={styles.mobileTagWrapper}>
              <span className={styles.mobileSectionTag}>About Me</span>
            </div>
          ) : (
            /* Desktop version remains unchanged */
            <span className={styles.sectionTag}>About Me</span>
          )}
          <h2 className={styles.sectionTitle}>Who I Am</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <Image
              src={logoImg}
              alt="Arka Lal Chakravarty"
              width={350}
              height={350}
              className={styles.profileImage}
            />
            <div className={styles.imageBorder}></div>
          </div>

          <div className={styles.textContent}>
            <h3 className={styles.greeting}>
              {greetingText}
              <span className={styles.cursor}>|</span>
            </h3>
            <p className={styles.bio}>
              {typedText1.slice(0, bioText1.length)}
              {typedText1.length > bioText1.length && (
                <span>
                  {typedText1.slice(
                    bioText1.length,
                    bioText1.length + bioHighlight1.length
                  )}
                </span>
              )}
              {typedText1.length > bioText1.length + bioHighlight1.length && (
                <>
                  {typedText1.slice(
                    bioText1.length + bioHighlight1.length,
                    bioText1.length + bioHighlight1.length + bioText2.length
                  )}
                </>
              )}
              {typedText1.length >
                bioText1.length + bioHighlight1.length + bioText2.length && (
                <span>
                  {typedText1.slice(
                    bioText1.length + bioHighlight1.length + bioText2.length,
                    bioText1.length +
                      bioHighlight1.length +
                      bioText2.length +
                      bioHighlight2.length
                  )}
                </span>
              )}
              {typedText1.length >
                bioText1.length +
                  bioHighlight1.length +
                  bioText2.length +
                  bioHighlight2.length && (
                <>
                  {typedText1.slice(
                    bioText1.length +
                      bioHighlight1.length +
                      bioText2.length +
                      bioHighlight2.length
                  )}
                </>
              )}
            </p>
            <p className={styles.bio}>{typedText2}</p>

            <div className={styles.skillCards} ref={cardsScope}>
              <motion.div
                className={`${styles.skillCard} skill-card`}
                initial={{ opacity: 0 }}
              >
                <motion.div
                  className={styles.iconContainer}
                  animate={
                    typewriterComplete
                      ? {
                          rotate: [0, -10, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    delay: 1.2,
                    ease: "easeInOut",
                  }}
                >
                  <FaLaptopCode className={styles.icon} />
                </motion.div>
                <h4>Full-Stack Development</h4>
                <p>
                  Building modern, responsive web applications with the latest
                  technologies.
                </p>
                {showSimulations && (
                  <motion.div
                    className={styles.codeSimulation}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.codeHeader}>
                      <span
                        className={styles.codeDot}
                        style={{ background: "#ff5f56" }}
                      />
                      <span
                        className={styles.codeDot}
                        style={{ background: "#ffbd2e" }}
                      />
                      <span
                        className={styles.codeDot}
                        style={{ background: "#27ca40" }}
                      />
                      <span className={styles.codeTitle}>app.js</span>
                    </div>
                    <div className={styles.codeBody}>
                      {[
                        { text: "const app = express();", delay: 0 },
                        { text: "app.use(cors());", delay: 0.3 },
                        { text: "app.get('/api', handler);", delay: 0.6 },
                        { text: "app.listen(3000); ✓", delay: 0.9 },
                      ].map((line, i) => (
                        <motion.div
                          key={i}
                          className={styles.codeLine}
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "100%" }}
                          transition={{ duration: 0.4, delay: line.delay }}
                        >
                          <span className={styles.lineNum}>{i + 1}</span>
                          <span className={styles.lineCode}>{line.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className={`${styles.skillCard} skill-card`}
                initial={{ opacity: 0 }}
              >
                <motion.div
                  className={styles.iconContainer}
                  animate={
                    typewriterComplete
                      ? {
                          scale: [1, 1.2, 1, 1.2, 1],
                          rotate: [0, 360],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    delay: 1.35,
                    ease: "easeInOut",
                  }}
                >
                  <FaRobot className={styles.icon} />
                </motion.div>
                <h4>AI Integration</h4>
                <p>
                  Implementing advanced AI solutions and automations for
                  practical business needs.
                </p>
                {showSimulations && (
                  <motion.div
                    className={styles.aiSimulation}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className={styles.chatBubble}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <span className={styles.userLabel}>You</span>
                      <span>Build me an AI chatbot</span>
                    </motion.div>
                    <motion.div
                      className={styles.aiThinking}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{
                        duration: 1.2,
                        delay: 0.4,
                        times: [0, 0.2, 0.8, 1],
                      }}
                    >
                      <span className={styles.thinkingDot} />
                      <span className={styles.thinkingDot} />
                      <span className={styles.thinkingDot} />
                    </motion.div>
                    <motion.div
                      className={`${styles.chatBubble} ${styles.aiResponse}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 1.6 }}
                    >
                      <span className={styles.aiLabel}>AI</span>
                      <span>Done! Your chatbot is ready ✨</span>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className={`${styles.skillCard} skill-card`}
                initial={{ opacity: 0 }}
              >
                <motion.div
                  className={styles.iconContainer}
                  animate={
                    typewriterComplete
                      ? {
                          y: [0, -8, 0],
                          rotate: [0, 5, -5, 0],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    delay: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  <FaCode className={styles.icon} />
                </motion.div>
                <h4>Product Architecture</h4>
                <p>
                  Designing scalable, maintainable systems with a focus on
                  performance and user experience.
                </p>
                {showSimulations && (
                  <motion.div
                    className={styles.archSimulation}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.archDiagram}>
                      <motion.div
                        className={styles.archNode}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        🖥️ Frontend
                      </motion.div>
                      <motion.div
                        className={styles.archConnector}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.2, delay: 0.4 }}
                      />
                      <motion.div
                        className={styles.archNode}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      >
                        ⚙️ API
                      </motion.div>
                      <motion.div
                        className={styles.archConnector}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.2, delay: 0.9 }}
                      />
                      <motion.div
                        className={styles.archNode}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 1.1 }}
                      >
                        🗄️ Database
                      </motion.div>
                    </div>
                    <motion.div
                      className={styles.archStatus}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      ✓ Architecture Ready
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
