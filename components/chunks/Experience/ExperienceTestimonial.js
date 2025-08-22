"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./ExperienceTestimonial.module.scss";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IoPersonCircle } from "react-icons/io5";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ExperienceTestimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollRef = useRef(null);
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
        "Collaborating closely with clients to understand their needs, ensuring tailored solutions that drive business growth"
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
        "Created a LinkedIn automation Chrome extension, enhancing user engagement and efficiency"
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
        "Built efficient and maintainable code for AI systems"
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
        "Developed generative AI features for client and internal projects"
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
        "Implemented responsive designs for web applications"
      ],
      icon: <IoPersonCircle />,
      color: "#10B981",
    },
  ];

  // Auto scroll to cycle through experiences - set to 3 seconds
  useEffect(() => {
    if (isAutoScrolling && inView) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % experiences.length);
      }, 3000); // Changed from 5000 to 3000 (3 seconds)
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isAutoScrolling, experiences.length, inView]);

  // Pause auto-scrolling when user interacts with experience cards
  const pauseAutoScroll = () => {
    setIsAutoScrolling(false);
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    
    // Resume after 30 seconds of inactivity
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 30000);
  };
  
  // Navigate to previous experience card
  const goToPrevious = () => {
    pauseAutoScroll();
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? experiences.length - 1 : prevIndex - 1
    );
  };
  
  // Navigate to next experience card
  const goToNext = () => {
    pauseAutoScroll();
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % experiences.length
    );
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
              A timeline of my career growth and technical expertise across multiple roles.
            </p>

            {/* Statistics */}
            <div className={styles.statsContainer}>
              <div className={styles.statBox}>
                <h3>5+</h3>
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
              <a href="#resume" className={styles.btnOutline}>
                View Resume
              </a>
              <a href="#contact" className={styles.btnFilled}>
                Contact Me
              </a>
            </div>
          </div>

          {/* Right side: Experience Cards */}
          <div className={styles.experienceCards}>
            {experiences.map((exp, index) => {
              // Calculate stacking order and animations
              const isActive = index === currentIndex;
              const isPrevious = (index === currentIndex - 1) || 
                (currentIndex === 0 && index === experiences.length - 1);
              const isNext = (index === currentIndex + 1) || 
                (currentIndex === experiences.length - 1 && index === 0);
              
              // Define position based on order
              let position = "hidden";
              if (isActive) position = "active";
              else if (isPrevious) position = "previous";
              else if (isNext) position = "next";
              
              return (
                <motion.div
                  key={exp.id}
                  className={`${styles.experienceCard} ${styles[position]}`}
                  initial="hidden"
                  animate={position}
                  onClick={() => {
                    pauseAutoScroll();
                    setCurrentIndex(index);
                  }}
                  variants={{
                    active: { 
                      scale: 1, 
                      y: 0, 
                      opacity: 1, 
                      zIndex: 30,
                      transition: { type: "spring", stiffness: 300, damping: 24 }
                    },
                    previous: { 
                      scale: 0.95, 
                      y: 30, 
                      opacity: 0.7, 
                      zIndex: 20,
                      transition: { type: "spring", stiffness: 300, damping: 24 }
                    },
                    next: { 
                      scale: 0.95, 
                      y: -30, 
                      opacity: 0.7, 
                      zIndex: 20,
                      transition: { type: "spring", stiffness: 300, damping: 24 }
                    },
                    hidden: { 
                      scale: 0.9, 
                      y: 60, 
                      opacity: 0, 
                      zIndex: 10,
                      transition: { type: "spring", stiffness: 300, damping: 24 }
                    }
                  }}
                >
                  <div className={styles.cardContent}>
                    {/* Client avatar */}
                    <div 
                      className={styles.avatar} 
                      style={{ 
                        backgroundColor: `rgba(${parseInt(exp.color.slice(1, 3), 16)}, ${parseInt(exp.color.slice(3, 5), 16)}, ${parseInt(exp.color.slice(5, 7), 16)}, 0.2)`,
                        color: exp.color 
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
                  </div>
                </motion.div>
              );
            })}
            
            {/* Navigation arrows */}
            <div className={styles.navigationArrows}>
              <button 
                className={styles.navArrow} 
                onClick={goToPrevious}
                aria-label="Previous experience"
              >
                <FiChevronLeft />
              </button>
              <button 
                className={styles.navArrow} 
                onClick={goToNext}
                aria-label="Next experience"
              >
                <FiChevronRight />
              </button>
            </div>
            
            {/* Pagination indicators */}
            <div className={styles.pagination}>
              {experiences.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.paginationDot} ${index === currentIndex ? styles.active : ''}`}
                  onClick={() => {
                    pauseAutoScroll();
                    setCurrentIndex(index);
                  }}
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
