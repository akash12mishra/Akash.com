"use client";

import React, { useState, useEffect } from "react";
import styles from "./NewHero.module.scss";
import Image from "next/image";
import { FaEnvelope } from "react-icons/fa6";
import { FaFileAlt, FaGithub } from "react-icons/fa";
import { HiOutlineBriefcase, HiOutlineLightBulb } from "react-icons/hi";
import { FiMapPin, FiCode, FiLayers, FiArrowDown } from "react-icons/fi";
import {
  SiNextdotjs,
  SiReact,
  SiPython,
  SiOpenai,
  SiMongodb,
  SiNodedotjs,
} from "react-icons/si";
import { motion } from "framer-motion";
import logoImg from "../../../assets/images/arka.png";

const NewHero = () => {
  const [buttonFallen, setButtonFallen] = useState(false);
  const [mobileButtonFallen, setMobileButtonFallen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDownloadClick = (e) => {
    if (buttonFallen) {
      e.preventDefault();
      return;
    }
    setButtonFallen(true);
  };

  const handleMobileDownloadClick = (e) => {
    if (mobileButtonFallen) {
      e.preventDefault();
      return;
    }
    setMobileButtonFallen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="home" className={styles.heroSection}>
      <motion.div
        className={styles.container}
        initial={isMounted ? "hidden" : false}
        animate={isMounted ? "visible" : false}
        variants={containerVariants}
      >
        {/* Top Bar */}
        <motion.div className={styles.topBar} variants={itemVariants}>
          <a
            href="mailto:admin@arkalalchakravarty.com"
            className={styles.emailTag}
          >
            <FaEnvelope size={14} />
            <span>admin@arkalalchakravarty.com</span>
          </a>

          {/* Mobile Hamburger Menu Button */}
          <div
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div
              className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ""}`}
            ></div>
            <div
              className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ""}`}
            ></div>
            <div
              className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ""}`}
            ></div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div
            className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ""}`}
          >
            <a
              href="https://github.com/arkalal/arkalalchakravarty.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileSourceButton}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaGithub size={18} />
              <span>Source</span>
            </a>
            <div className={styles.mobileDownloadWrapper}>
              {!mobileButtonFallen ? (
                <motion.a
                  href="/assets/doc/Arka_Lal_Chakravarty_Resume.pdf"
                  download="Arka_Lal_Chakravarty_Resume.pdf"
                  className={styles.mobileDownloadButton}
                  onClick={handleMobileDownloadClick}
                  whileHover="hover"
                  initial="initial"
                  animate="animate"
                  variants={{
                    initial: { rotate: 0 },
                    animate: {
                      boxShadow: [
                        "0 2px 8px rgba(255, 107, 53, 0.25)",
                        "0 4px 16px rgba(255, 107, 53, 0.4)",
                        "0 2px 8px rgba(255, 107, 53, 0.25)",
                      ],
                    },
                    hover: {
                      rotate: 10,
                      scale: 1.03,
                    },
                  }}
                  transition={{
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    rotate: { duration: 0.1, ease: "easeOut" },
                    scale: { duration: 0.1 },
                  }}
                >
                  <motion.span
                    className={styles.mobileDownloadIcon}
                    variants={{
                      initial: { y: 0 },
                      animate: { y: [0, 3, 0] },
                      hover: { y: [0, 8, 0] },
                    }}
                    transition={{
                      y: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    <FaFileAlt size={18} />
                  </motion.span>
                  <span>Download Resume</span>
                  <motion.span
                    className={styles.mobileArrowDown}
                    variants={{
                      initial: { opacity: 0, y: -5 },
                      hover: { opacity: [0, 1, 0], y: [0, 10, 15] },
                    }}
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      ease: "easeIn",
                    }}
                  >
                    <FiArrowDown size={14} />
                  </motion.span>
                </motion.a>
              ) : (
                <motion.div
                  className={styles.mobileDownloadButtonFalling}
                  initial={{
                    y: 0,
                    x: 0,
                    rotate: 10,
                    opacity: 1,
                  }}
                  animate={{
                    y: [0, 400, 385, 420, 410, 440, 435, 450, 448, 455, 800],
                    x: [0, 25, 28, 40, 43, 50, 53, 58, 60, 63, 100],
                    rotate: [
                      10, 90, 88, 110, 108, 125, 123, 135, 134, 140, 180,
                    ],
                    opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0.8, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    times: [
                      0, 0.25, 0.3, 0.4, 0.45, 0.55, 0.6, 0.7, 0.75, 0.85, 1,
                    ],
                    ease: [0.55, 0.085, 0.68, 0.53],
                  }}
                >
                  <FaFileAlt size={18} />
                  <span>Download Resume</span>
                </motion.div>
              )}
            </div>
          </div>

          <div className={styles.topBarActions}>
            <a
              href="https://github.com/arkalal/arkalalchakravarty.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceButton}
              title="View Source Code"
            >
              <FaGithub size={18} />
              <span>Source</span>
            </a>
            <div className={styles.downloadButtonWrapper}>
              {/* Invisible placeholder to maintain layout */}
              <div className={styles.downloadButtonPlaceholder}>
                <FaFileAlt size={18} />
                <span>Download Resume</span>
              </div>
              {/* Actual button - absolutely positioned */}
              {!buttonFallen ? (
                <motion.a
                  href="/assets/doc/Arka_Lal_Chakravarty_Resume.pdf"
                  download="Arka_Lal_Chakravarty_Resume.pdf"
                  className={styles.downloadButton}
                  onClick={handleDownloadClick}
                  whileHover="hover"
                  initial="initial"
                  animate="animate"
                  variants={{
                    initial: { rotate: 0 },
                    animate: {
                      boxShadow: [
                        "0 2px 8px rgba(255, 107, 53, 0.25)",
                        "0 4px 16px rgba(255, 107, 53, 0.4)",
                        "0 2px 8px rgba(255, 107, 53, 0.25)",
                      ],
                    },
                    hover: {
                      rotate: 15,
                      scale: 1.05,
                    },
                  }}
                  transition={{
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    rotate: {
                      duration: 0.1,
                      ease: "easeOut",
                    },
                    scale: {
                      duration: 0.1,
                    },
                  }}
                >
                  <motion.span
                    className={styles.downloadIcon}
                    variants={{
                      initial: { y: 0 },
                      animate: { y: [0, 3, 0] },
                      hover: { y: [0, 10, 0] },
                    }}
                    transition={{
                      y: {
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <FaFileAlt size={18} />
                  </motion.span>
                  <span className={styles.buttonText}>Download Resume</span>
                  <motion.span
                    className={styles.arrowDown}
                    variants={{
                      initial: { opacity: 0, y: -10 },
                      hover: {
                        opacity: [0, 1, 0],
                        y: [0, 15, 20],
                      },
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeIn",
                    }}
                  >
                    <FiArrowDown size={16} />
                  </motion.span>
                  <span className={styles.shineEffect}></span>
                </motion.a>
              ) : (
                <motion.div
                  className={styles.downloadButtonFalling}
                  initial={{
                    y: 0,
                    x: 0,
                    rotate: 15,
                    opacity: 1,
                  }}
                  animate={{
                    y: [0, 800, 780, 850, 840, 870, 865, 880, 878, 885, 2000],
                    x: [0, 50, 55, 80, 85, 100, 105, 115, 118, 125, 200],
                    rotate: [
                      15, 180, 175, 220, 215, 250, 245, 270, 268, 280, 360,
                    ],
                    opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0.8, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    times: [
                      0, 0.25, 0.3, 0.4, 0.45, 0.55, 0.6, 0.7, 0.75, 0.85, 1,
                    ],
                    ease: [0.55, 0.085, 0.68, 0.53],
                  }}
                >
                  <FaFileAlt size={18} />
                  <span>Download Resume</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Hero Content */}
        <motion.div className={styles.heroContent} variants={containerVariants}>
          <motion.h1 className={styles.mainHeading} variants={itemVariants}>
            <span className={styles.line1}>
              Hi, I&apos;m{" "}
              <span className={styles.avatarInline}>
                <Image
                  src={logoImg}
                  alt="Arka Lal Chakravarty"
                  width={52}
                  height={52}
                  className={styles.avatar}
                  priority
                />
              </span>{" "}
              Arka Lal Chakravarty!
            </span>
          </motion.h1>

          <motion.h2 className={styles.roleHeading} variants={itemVariants}>
            <span className={styles.rolePrefix}>I&apos;m an </span>
            <span className={styles.roleHighlight}>AI Engineer</span>
            <span className={styles.roleText}> & </span> <br />
            <span className={styles.roleHighlight}>
              Full Stack Developer.
            </span>{" "}
            <br />
            <span className={styles.statusBadge}>
              <span className={styles.statusDot}></span>
              Open to Collaborate
            </span>
          </motion.h2>

          {/* CTA Section */}
          <motion.div className={styles.ctaRow} variants={itemVariants}>
            <a
              href="https://calendly.com/arkalal-chakravarty/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
            >
              Book a call
            </a>
            <p className={styles.ctaText}>
              Feel free to explore my portfolio and reach out
              <br />
              —I&apos;d love to connect!
            </p>
          </motion.div>

          {/* Bento Cards Grid */}
          <motion.div className={styles.bentoGrid} variants={containerVariants}>
            {/* Experience Card with Timeline */}
            <motion.div
              className={`${styles.bentoCard} ${styles.experienceCard}`}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className={styles.cardHeader}>
                <HiOutlineBriefcase className={styles.cardIcon} />
                <span className={styles.cardTitle}>My Experience</span>
              </div>
              <div className={styles.experienceTimeline}>
                <ExperienceItem
                  role="Freelance Software Engineer"
                  company="arkalalchakravarty.com"
                  period="2025"
                  type="Freelance"
                  index={0}
                />
                <ExperienceItem
                  role="AI Engineer"
                  company="Helionix"
                  period="2025"
                  type="Contract"
                  index={1}
                />
                <ExperienceItem
                  role="AI Engineer"
                  company="ScaleGenAI"
                  period="2024"
                  type="Full-time"
                  index={2}
                />
                <ExperienceItem
                  role="Software Developer"
                  company="Infojini Inc"
                  period="2022-24"
                  type="Full-time"
                  index={3}
                />
                <ExperienceItem
                  role="Frontend Web Developer"
                  company="CRIMSON INTELLIGENCE SA"
                  period="2021-22"
                  type="Full-time"
                  index={4}
                  isLast
                />
              </div>
            </motion.div>

            {/* Tech Stack Card with Floating Icons */}
            <motion.div
              className={`${styles.bentoCard} ${styles.techCard}`}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className={styles.cardHeader}>
                <FiCode className={styles.cardIcon} />
                <span className={styles.cardTitle}>Tech Stack</span>
              </div>
              <div className={styles.techIconsGrid}>
                <TechIcon Icon={SiNextdotjs} name="NextJS" delay={0} />
                <TechIcon
                  Icon={SiReact}
                  name="React"
                  delay={0.1}
                  color="#61DAFB"
                />
                <TechIcon
                  Icon={SiPython}
                  name="Python"
                  delay={0.2}
                  color="#3776AB"
                />
                <TechIcon Icon={SiOpenai} name="OpenAI" delay={0.3} />
                <TechIcon
                  Icon={SiMongodb}
                  name="MongoDB"
                  delay={0.4}
                  color="#47A248"
                />
                <TechIcon
                  Icon={SiNodedotjs}
                  name="Node.js"
                  delay={0.5}
                  color="#339933"
                />
              </div>
            </motion.div>

            {/* What I Build Card */}
            <motion.div
              className={`${styles.bentoCard} ${styles.buildCard}`}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className={styles.cardHeader}>
                <FiLayers className={styles.cardIcon} />
                <span className={styles.cardTitle}>What I Build</span>
              </div>
              <p className={styles.buildText}>
                AI-powered SaaS products, automation tools, and full-stack web
                applications that solve real problems.
              </p>
            </motion.div>

            {/* Location Card with Map Animation */}
            <motion.div
              className={`${styles.bentoCard} ${styles.locationCard}`}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className={styles.cardHeader}>
                <FiMapPin className={styles.cardIcon} />
                <span className={styles.cardTitle}>Location</span>
              </div>
              <div className={styles.locationContent}>
                <div className={styles.mapContainer}>
                  <div className={styles.mapGrid}>
                    {[...Array(25)].map((_, i) => (
                      <div key={i} className={styles.mapDot} />
                    ))}
                  </div>
                  <motion.div
                    className={styles.locationPin}
                    animate={{
                      y: [0, -6, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <FiMapPin />
                    <motion.div
                      className={styles.pinPulse}
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.6, 0, 0.6],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  </motion.div>
                </div>
                <div className={styles.locationText}>
                  <span className={styles.city}>KOLKATA</span>
                  <span className={styles.country}>INDIA</span>
                  <span className={styles.remote}>Available Remotely</span>
                </div>
              </div>
            </motion.div>

            {/* How I Work Card with Step Animation */}
            <HowIWorkCard itemVariants={itemVariants} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Experience Item Component with Timeline
const ExperienceItem = ({ role, company, period, type, index, isLast }) => (
  <motion.div
    className={styles.expItem}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.15, duration: 0.4 }}
  >
    <div className={styles.expTimeline}>
      <motion.div
        className={styles.expDot}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(255, 107, 53, 0.4)",
            "0 0 0 6px rgba(255, 107, 53, 0)",
            "0 0 0 0 rgba(255, 107, 53, 0.4)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.3,
        }}
      />
      {!isLast && <div className={styles.expLine} />}
    </div>
    <div className={styles.expContent}>
      <div className={styles.expInfo}>
        <span className={styles.expRole}>{role}</span>
        <span className={styles.expCompany}>{company}</span>
      </div>
      <span className={styles.expPeriod}>
        {period} · {type}
      </span>
    </div>
  </motion.div>
);

// Tech Icon Component with Floating Animation
const TechIcon = ({ Icon, name, delay, color }) => (
  <motion.div
    className={styles.techIconWrapper}
    animate={{
      y: [0, -4, 0],
    }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
  >
    <Icon
      className={styles.techIcon}
      style={{ color: color || "var(--text-primary)" }}
    />
    <span className={styles.techName}>{name}</span>
  </motion.div>
);

// How I Work Card with Step Animation
const HowIWorkCard = ({ itemVariants }) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { number: "01", label: "Discovery" },
    { number: "02", label: "Design" },
    { number: "03", label: "Develop" },
    { number: "04", label: "Deploy" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <motion.div
      className={`${styles.bentoCard} ${styles.workCard}`}
      variants={itemVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className={styles.cardHeader}>
        <HiOutlineLightBulb className={styles.cardIcon} />
        <span className={styles.cardTitle}>How I Work</span>
      </div>
      <div className={styles.workSteps}>
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            className={`${styles.workStep} ${
              index === activeStep ? styles.activeStep : ""
            }`}
            animate={{
              scale: index === activeStep ? 1.02 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <span className={styles.stepNumber}>{step.number}</span>
            <span className={styles.stepLabel}>{step.label}</span>
          </motion.div>
        ))}
      </div>
      <div className={styles.stepProgress}>
        <motion.div
          className={styles.stepProgressFill}
          animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
};

export default NewHero;
