"use client";

import React, { useState, useEffect } from "react";
import styles from "./NewHero.module.scss";
import Image from "next/image";

import { FaFileAlt, FaGithub, FaTimes } from "react-icons/fa";
import CtaButton from "../../CtaButton/CtaButton";
import { HiOutlineBriefcase, HiOutlineLightBulb } from "react-icons/hi";
import { FiMapPin, FiCode, FiLayers } from "react-icons/fi";
import {
  SiNextdotjs,
  SiReact,
  SiPython,
  SiOpenai,
  SiMongodb,
  SiNodedotjs,
} from "react-icons/si";
import { motion } from "framer-motion";
import { ContainerScroll } from "../../ContainerScrollAnimation/ContainerScrollAnimation";
import logoImg from "../../../assets/images/arka.png";

const NewHero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const experienceWrapperRef = React.useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll while mobile drawer is open and close on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const mobileNavLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  // Smooth auto-scroll for the experience timeline card so the user
  // can see the entries that overflow the visible card area without
  // having to manually scroll. Bounces top↔bottom slowly; pauses on
  // hover so visitors can read at their own pace.
  useEffect(() => {
    const el = experienceWrapperRef.current;
    if (!el) return;

    let raf;
    let direction = 1;
    let last = performance.now();
    let paused = false;
    // Target ~3.5s per direction regardless of how much content overflows.
    // Recompute if the wrapper resizes (responsive). Falling back to a
    // sane minimum so very small overflows don't crawl.
    const directionDurationMs = 3500;
    // Hold time at each end so the user can read the first/last item
    // before the scroll reverses.
    const endHoldMs = 1400;
    let holdUntil = 0;

    const tick = (now) => {
      const dt = now - last;
      last = now;
      const max = el.scrollHeight - el.clientHeight;
      if (!paused && max > 0) {
        if (now < holdUntil) {
          // Currently holding at an end — skip movement this frame.
          raf = requestAnimationFrame(tick);
          return;
        }
        const speed = Math.max(20, max / (directionDurationMs / 1000));
        const next = el.scrollTop + direction * speed * (dt / 1000);
        if (next >= max) {
          el.scrollTop = max;
          direction = -1;
          holdUntil = now + endHoldMs;
        } else if (next <= 0) {
          el.scrollTop = 0;
          direction = 1;
          holdUntil = now + endHoldMs;
        } else {
          el.scrollTop = next;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      paused = true;
    };
    const onLeave = () => {
      paused = false;
      last = performance.now();
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", onEnter, { passive: true });
    el.addEventListener("touchend", onLeave, { passive: true });

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", onEnter);
      el.removeEventListener("touchend", onLeave);
    };
  }, [isMounted]);

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
          {/* Mobile Hamburger Menu Button */}
          <div
            className={`${styles.mobileMenuButton} ${mobileMenuOpen ? styles.hidden : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
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

          {/* Mobile Drawer Backdrop */}
          <div
            className={`${styles.mobileBackdrop} ${mobileMenuOpen ? styles.open : ""}`}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Mobile Navigation Drawer */}
          <aside
            className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.open : ""}`}
            aria-hidden={!mobileMenuOpen}
          >
            <div className={styles.mobileDrawerHeader}>
              <Image
                src={logoImg}
                alt="Arka Lal Chakravarty"
                width={40}
                height={40}
                className={styles.mobileDrawerLogo}
              />
              <span className={styles.mobileDrawerName}>
                Arka Lal Chakravarty
              </span>
              <button
                type="button"
                className={styles.mobileDrawerClose}
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>

            <ul className={styles.mobileDrawerLinks}>
              {mobileNavLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={closeMobileMenu}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className={styles.mobileDrawerActions}>
              <a
                href="https://github.com/arkalal/arkalalchakravarty.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileDrawerSource}
                onClick={closeMobileMenu}
              >
                <FaGithub size={18} />
                <span>Source</span>
              </a>
              <a
                href="/assets/doc/Arka Lal Chakravarty CV - 2026 .pdf"
                download="Arka_Lal_Chakravarty_CV_2026.pdf"
                className={styles.mobileDrawerCv}
                onClick={closeMobileMenu}
              >
                <FaFileAlt size={18} />
                <span>Download Resume</span>
              </a>
            </div>
          </aside>

          <div className={styles.topBarActions}>
            <CtaButton
              href="https://github.com/arkalal/arkalalchakravarty.com"
              label="Source"
              external
              size="sm"
              icon={<FaGithub />}
              title="View Source Code"
            />
            <CtaButton
              href="/assets/doc/Arka Lal Chakravarty CV - 2026 .pdf"
              download="Arka_Lal_Chakravarty_CV_2026.pdf"
              label="Download Resume"
              size="sm"
              icon={<FaFileAlt />}
            />
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
            <span className={styles.rolePrefix}>I&apos;m a </span>
            <span className={styles.roleHighlight}>Full Stack Engineer</span>
            <span className={styles.roleText}> & </span> <br />
            <span className={styles.roleHighlight}>AI Specialist</span> <br />
            <span className={styles.statusBadge}>
              <span className={styles.statusDot}></span>
              Open to Collaborate
            </span>
          </motion.h2>

          {/* CTA Section */}
          <motion.div className={styles.ctaRow} variants={itemVariants}>
            <CtaButton
              href="https://calendly.com/arkalal-chakravarty/30min"
              label="Book a Call"
              external
              variant="primary"
            />
            <p className={styles.ctaText}>
              Feel free to explore my portfolio and reach out
              <br />
              —I&apos;d love to connect!
            </p>
          </motion.div>

          {/* Bento Cards Grid — wrapped in scroll animation */}
          <ContainerScroll>
            <motion.div
              className={styles.bentoGrid}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
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
                <div
                  className={styles.experienceTimelineWrapper}
                  ref={experienceWrapperRef}
                >
                  <div className={styles.experienceTimeline}>
                    <ExperienceItem
                      role="Lead Software Engineer"
                      company="Epigroww Global"
                      period="2025"
                      type="Full-time"
                      index={0}
                      isCurrent
                    />
                    <ExperienceItem
                      role="Freelance Software Engineer"
                      company="arkalalchakravarty.com"
                      period="2025"
                      type="Freelance"
                      index={1}
                    />
                    <ExperienceItem
                      role="AI Engineer"
                      company="Helionix"
                      period="2025"
                      type="Contract"
                      index={2}
                    />
                    <ExperienceItem
                      role="AI Engineer"
                      company="ScaleGenAI"
                      period="2024"
                      type="Full-time"
                      index={3}
                    />
                    <ExperienceItem
                      role="Software Developer"
                      company="Infojini Inc"
                      period="2022-24"
                      type="Full-time"
                      index={4}
                    />
                    <ExperienceItem
                      role="Frontend Web Developer"
                      company="CRIMSON INTELLIGENCE SA"
                      period="2021-22"
                      type="Internship"
                      index={5}
                      isLast
                    />
                  </div>
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
                  Full-stack web applications with modern frontend UI/UX and
                  AI-powered SaaS products that solve real problems.
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
          </ContainerScroll>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Experience Item Component with Timeline
const ExperienceItem = ({
  role,
  company,
  period,
  type,
  index,
  isLast,
  isCurrent,
}) => (
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
