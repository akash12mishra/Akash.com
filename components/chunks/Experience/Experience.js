"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import styles from "./Experience.module.scss";
import { FaBriefcase, FaGraduationCap, FaBuilding, FaLaptopCode, FaRobot } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Experience = () => {
  const [activeExperience, setActiveExperience] = useState(0);
  const timelineControlsMain = useAnimation();
  const [timelineRef, timelineInView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });
  
  // Animation states for each experience item
  const [animationStates, setAnimationStates] = useState([]);
  
  // Experience data memoized to prevent unnecessary re-renders
  const experiences = useMemo(() => [
    {
      id: 1,
      role: "Freelance Software Engineer",
      company: "arkalalchakravarty.com",
      duration: "Jan 2025 - Present",
      description: [
        "Developing AI-driven SaaS MVPs for diverse clients, enhancing their operational efficiency",
        "Implementing agentic automation solutions, streamlining workflows and reducing manual effort by up to 30%",
        "Collaborating closely with clients to understand their needs, ensuring tailored solutions that drive business growth"
      ],
      icon: <FaLaptopCode />,
      color: "#6366F1",
    },
    {
      id: 2,
      role: "AI Engineer",
      company: "Helionix",
      duration: "Feb 2025 - Jun 2025",
      description: [
        "Developed a social media content automation platform as a contractor",
        "Built and coded multiple agentic workflows using Microsoft Autogen and Python FastAPI",
        "Created a LinkedIn automation Chrome extension, enhancing user engagement and efficiency"
      ],
      icon: <FaLaptopCode />,
      color: "#3B82F6",
    },
    {
      id: 3,
      role: "AI Engineer",
      company: "ScaleGenAI",
      duration: "Jul 2024 - Dec 2024",
      description: [
        "Developed AI-powered solutions using NextJS and SCSS",
        "Implemented scalable AI technologies for business applications",
        "Built efficient and maintainable code for AI systems"
      ],
      icon: <FaRobot />,
      color: "#8B5CF6",
    },
    {
      id: 4,
      role: "Software Developer",
      company: "Infojini Inc",
      duration: "Mar 2022 - Jul 2024",
      description: [
        "Worked on US State Govt projects including healthcare domain applications",
        "Developed a full working CMS web app for Lee County State using ReactJS",
        "Contributed to legacy code maintenance in AngularJS for CMS projects",
        "Developed generative AI features for client and internal projects"
      ],
      icon: <FaBuilding />,
      color: "#EC4899",
    },
    {
      id: 5,
      role: "Frontend Web Developer",
      company: "CRIMSON INTELLIGENCE SA",
      duration: "Sep 2021 - Feb 2022",
      description: [
        "Developed E-commerce products from scratch using HTML5, CSS3 and JavaScript",
        "Built data dashboards to analyze sales reports and customer engagement",
        "Implemented responsive designs for web applications"
      ],
      icon: <FaBriefcase />,
      color: "#10B981",
    }
  ], []);

  // Initialize animation states for each experience
  useEffect(() => {
    setAnimationStates(experiences.map((_, index) => ({
      isActive: index === activeExperience,
      hasBeenViewed: index === activeExperience
    })));
  }, [experiences, activeExperience]);

  // Handle timeline animations
  useEffect(() => {
    if (timelineInView) {
      timelineControlsMain.start("visible");
    }
  }, [timelineInView, timelineControlsMain]);
  
  // Update animation states when active experience changes
  useEffect(() => {
    setAnimationStates(prevStates => 
      prevStates.map((state, index) => ({
        isActive: index === activeExperience,
        hasBeenViewed: state.hasBeenViewed || index === activeExperience
      }))
    );
  }, [activeExperience]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const lineVariants = {
    hidden: { height: '0%' },
    visible: { 
      height: '100%',
      transition: { 
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const bubbleVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    active: {
      scale: 1.2,
      backgroundColor: "var(--accent-primary)",
      transition: {
        duration: 0.3
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.3
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <section id="experience" className={styles.experienceSection}>
      <motion.div 
        className={styles.container}
        ref={timelineRef}
        variants={containerVariants}
        initial="hidden"
        animate={timelineControlsMain}
      >
        <motion.div 
          className={styles.sectionHeader}
          variants={itemVariants}
        >
          <motion.span 
            className={styles.sectionTag}
            variants={itemVariants}
          >
            Experience
          </motion.span>
          <motion.h2 
            className={styles.sectionTitle}
            variants={itemVariants}
          >
            My Journey
          </motion.h2>
          <motion.p 
            className={styles.sectionDescription}
            variants={itemVariants}
          >
            A timeline of my professional experiences and career milestones
          </motion.p>

        </motion.div>
        
        <div className={styles.timelineWrapper}>
          <div className={styles.timelineProgressLine}>
            <motion.div 
              className={styles.progressBar}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              style={{ 
                background: `linear-gradient(to bottom, ${experiences[0].color}, ${experiences[experiences.length-1].color})` 
              }}
            />
          </div>

          <div className={styles.timelineContent}>
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className={`${styles.timelineItem} ${activeExperience === index ? styles.active : ''}`}
                variants={timelineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-100px" }}
              >
                <div className={styles.timelineBubbleContainer}>
                  <motion.div 
                    className={styles.timelineBubble}
                    variants={bubbleVariants}
                    animate={activeExperience === index ? "active" : "visible"}
                    onClick={() => setActiveExperience(index)}
                    style={{ 
                      borderColor: exp.color,
                      backgroundColor: activeExperience === index ? exp.color : "var(--card-bg)" 
                    }}
                  >
                    {exp.icon}
                  </motion.div>
                </div>
                
                <motion.div 
                  className={`${styles.timelineItemContent} ${styles.activeContent}`}
                  variants={itemVariants}
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.4 }}
                  initial="hidden"
                >
                  <div className={styles.timelineHeader}>
                    <h3 style={{ color: exp.color }}>
                      {exp.role}
                    </h3>
                    <span className={styles.timelineCompany}>{exp.company}</span>
                    <span className={styles.timelineDuration}>{exp.duration}</span>
                  </div>
                  
                  <motion.div 
                    className={styles.timelineDetails}
                    variants={contentVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.4 }}
                    exit="exit"
                  >
                      <ul className={styles.responsibilities}>
                        {exp.description.map((item, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                          >
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Experience;
