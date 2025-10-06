"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ExperienceTestimonial.module.scss";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IoPersonCircle } from "react-icons/io5";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ExperienceTestimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const cardsRef = useRef(null);
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  // Experience data with full details from the original timeline
  const experiences = [
    {
      id: 1,
      role: "Freelance Software Engineer",
      company: "arkalalchakravarty.com",
      duration: "Jan 2025 - Present",
      descriptions: [
        "Developing AI-driven SaaS MVPs for diverse clients, enhancing their operational efficiency",
        "Implementing agentic automation solutions, streamlining workflows and reducing manual effort by up to 30%",
        "Collaborating closely with clients to understand their needs, ensuring tailored solutions that drive business growth",
      ],
      icon: <IoPersonCircle />,
      color: "#6366F1",
    },
    {
      id: 2,
      role: "AI Engineer",
      company: "Helionix",
      duration: "Feb 2025 - Jun 2025",
      descriptions: [
        "Developed a social media content automation platform as a contractor",
        "Built and coded multiple agentic workflows using Microsoft Autogen and Python FastAPI",
        "Created a LinkedIn automation Chrome extension, enhancing user engagement and efficiency",
      ],
      icon: <IoPersonCircle />,
      color: "#3B82F6",
    },
    {
      id: 3,
      role: "AI Engineer",
      company: "ScaleGenAI",
      duration: "Jul 2024 - Dec 2024",
      descriptions: [
        "Developed AI-powered solutions using NextJS and SCSS",
        "Implemented scalable AI technologies for business applications",
        "Built efficient and maintainable code for AI systems",
      ],
      icon: <IoPersonCircle />,
      color: "#8B5CF6",
    },
    {
      id: 4,
      role: "Software Developer",
      company: "Infojini Inc",
      duration: "Mar 2022 - Jul 2024",
      descriptions: [
        "Worked on US State Govt projects including healthcare domain applications",
        "Developed a full working CMS web app for Lee County State using ReactJS",
        "Contributed to legacy code maintenance in AngularJS for CMS projects",
        "Developed generative AI features for client and internal projects",
      ],
      icon: <IoPersonCircle />,
      color: "#EC4899",
    },
    {
      id: 5,
      role: "Frontend Web Developer",
      company: "CRIMSON INTELLIGENCE SA",
      duration: "Sep 2021 - Feb 2022",
      descriptions: [
        "Developed E-commerce products from scratch using HTML5, CSS3 and JavaScript",
        "Built data dashboards to analyze sales reports and customer engagement",
        "Implemented responsive designs for web applications",
      ],
      icon: <IoPersonCircle />,
      color: "#10B981",
    },
  ];

  // Auto scroll to cycle through experiences - set to 3 seconds
  // Check if we're on mobile device
  // Define handleNext and handlePrevious first to avoid reference error
  const handleNext = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % experiences.length);
    setDirection("right");
  }, [experiences.length]);

  const handlePrevious = useCallback(() => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + experiences.length) % experiences.length
    );
    setDirection("left");
  }, [experiences.length]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    // Auto-scroll functionality
    if (isVisible && !isPaused) {
      const interval = setInterval(() => {
        handleNext();
      }, 3000); // Consistent 3 second interval for all devices

      return () => clearInterval(interval);
    }
  }, [isVisible, isPaused, handleNext]); // Removed dependency on activeIndex and isMobile

  useEffect(() => {
    setIsVisible(inView);
  }, [inView]);

  const handleCardClick = (idx) => {
    setActiveIndex(idx);
  };

  const variants = {
    active: {
      scale: 1,
      x: 0,
      opacity: 1,
      zIndex: 30,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        ease: isMobile ? "easeIn" : "easeOut",
        type: isMobile ? "tween" : "spring",
      },
      filter: "brightness(1)",
    },
    previous: (custom) => ({
      scale: isMobile ? 0.92 : 0.9,
      x:
        custom === "left"
          ? isMobile
            ? "-15%"
            : "-20%"
          : isMobile
          ? "15%"
          : "20%",
      opacity: isMobile ? 0.75 : 0.7,
      zIndex: 20,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        ease: isMobile ? "easeIn" : "easeOut",
        type: isMobile ? "tween" : "spring",
      },
      filter: "brightness(0.9)",
    }),
    next: (custom) => ({
      scale: isMobile ? 0.92 : 0.9,
      x:
        custom === "left"
          ? isMobile
            ? "15%"
            : "20%"
          : isMobile
          ? "-15%"
          : "-20%",
      opacity: isMobile ? 0.75 : 0.7,
      zIndex: 20,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        ease: isMobile ? "easeIn" : "easeOut",
        type: isMobile ? "tween" : "spring",
      },
      filter: "brightness(0.9)",
    }),
    hidden: (custom) => ({
      scale: isMobile ? 0.85 : 0.8,
      x:
        custom === "left"
          ? isMobile
            ? "-30%"
            : "-40%"
          : isMobile
          ? "30%"
          : "40%",
      opacity: 0,
      zIndex: 10,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        ease: isMobile ? "easeIn" : "easeOut",
        type: isMobile ? "tween" : "spring",
      },
      filter: "brightness(0.8)",
    }),
  };

  return (
    <section id="experience" className={styles.experienceSection} ref={ref}>
      <div className={styles.container}>
        <div className={styles.experienceGrid}>
          {/* Left side: Heading and Statistics */}
          <div className={styles.experienceIntro}>
            <span className={styles.sectionTag}>Experience</span>
            <h2 className={styles.heading}>
              Professional <span>Journey</span>
            </h2>
            <p className={styles.subheading}>
              A timeline of my career growth and technical expertise across
              multiple roles.
            </p>

            {/* Statistics */}
            <div className={styles.statsContainer}>
              <div className={styles.statBox}>
                <h3>3.7+</h3>
                <p>Years Experience</p>
              </div>
              <div className={styles.statBox}>
                <h3>{experiences.length}</h3>
                <p>Professional Roles</p>
              </div>
              <div className={styles.statBox}>
                <h3>20+</h3>
                <p>Projects Completed</p>
              </div>
            </div>

            {/* Call-to-action buttons */}
            <div className={styles.ctaButtons}>
              <a
                href="/assets/doc/Arka resume 2025 - AI new.pdf"
                download="Arka_Lal_Chakravarty_Resume.pdf"
                className={styles.btnOutline}
              >
                Download CV
              </a>
              <a href="#contact" className={styles.btnFilled}>
                Contact Me
              </a>
            </div>
          </div>

          {/* Right side: Experience Cards */}
          <div className={styles.experienceCards}>
            {experiences.map((exp, idx) => {
              const cardPosition =
                idx === activeIndex
                  ? "active"
                  : idx < activeIndex
                  ? "previous"
                  : idx > activeIndex
                  ? "next"
                  : "hidden";

              return (
                <motion.div
                  ref={cardsRef}
                  key={idx}
                  custom={direction}
                  variants={variants}
                  initial="hidden"
                  animate={cardPosition}
                  className={`${styles.experienceCard} ${styles[cardPosition]} ${exp.id === 4 ? `${styles.moreContentCard} ${styles.infojiniCard}` : ''}`}
                  whileHover={
                    !isMobile
                      ? {
                          scale: cardPosition === "active" ? 1.02 : 1,
                          cursor: "grab",
                        }
                      : {}
                  }
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onClick={() =>
                    cardPosition !== "active" && handleCardClick(idx)
                  }
                  layout={!isMobile}
                >
                  <div className={styles.cardContent}>
                    {/* Client avatar */}
                    <div
                      className={styles.avatar}
                      style={{
                        backgroundColor: `rgba(${parseInt(
                          exp.color.slice(1, 3),
                          16
                        )}, ${parseInt(exp.color.slice(3, 5), 16)}, ${parseInt(
                          exp.color.slice(5, 7),
                          16
                        )}, 0.2)`,
                        color: exp.color,
                      }}
                    >
                      {exp.icon}
                    </div>

                    {/* Client details */}
                    <div className={styles.clientDetails}>
                      <h3>{exp.role}</h3>
                      <p className={styles.company}>{exp.company}</p>
                      <p className={styles.duration}>{exp.duration}</p>
                    </div>

                    {/* Experience descriptions as bullet points */}
                    <ul className={styles.experienceList}>
                      {exp.descriptions.map((desc, i) => (
                        <li key={i} className={styles.experienceItem}>
                          {desc}
                        </li>
                      ))}
                    </ul>
                    {/* Add extra spacing specifically for Infojini card with inline style for more reliability */}
                    {exp.id === 4 && <div style={{ height: '50px', width: '100%', flexShrink: 0, marginBottom: '15px' }}></div>}
                  </div>
                </motion.div>
              );
            })}

            {/* Navigation arrows */}
            <div className={styles.navigationArrows}>
              <motion.button
                className={styles.navArrow}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                whileHover={!isMobile ? { scale: 1.1 } : {}}
                whileTap={!isMobile ? { scale: 0.95 } : { scale: 0.98 }}
                aria-label="Previous experience card"
              >
                <FiChevronLeft />
              </motion.button>
              <motion.button
                className={styles.navArrow}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                whileHover={!isMobile ? { scale: 1.1 } : {}}
                whileTap={!isMobile ? { scale: 0.95 } : { scale: 0.98 }}
                aria-label="Next experience card"
              >
                <FiChevronRight />
              </motion.button>
            </div>

            {/* Pagination indicators */}
            <div className={styles.pagination}>
              {experiences.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.paginationDot} ${
                    index === activeIndex ? styles.active : ""
                  }`}
                  onClick={() => {
                    setActiveIndex(index);
                    // Brief pause when clicking pagination, but will resume on mouseout
                    setIsPaused(true);
                  }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceTestimonial;
