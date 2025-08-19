"use client";

import React, { useState, useEffect, useMemo } from "react";
import styles from "./Experience.module.scss";
import { FaBriefcase, FaGraduationCap, FaBuilding, FaLaptopCode, FaRobot } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Experience = () => {
  const [activeExperience, setActiveExperience] = useState(0);
  const timelineControlsMain = useAnimation();
  const [timelineRef, timelineInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  
  // Handle responsive behavior for the timeline
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
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

  // Handle timeline animations
  useEffect(() => {
    if (timelineInView) {
      timelineControlsMain.start("visible");
    }
  }, [timelineInView, timelineControlsMain]);
  
  // Client-side only effects
  useEffect(() => {
    // Mark component as hydrated
    setIsHydrated(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.2, // Reduce stagger time on mobile
        duration: isMobile ? 0.3 : 0.5 // Faster overall animation on mobile
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

  // Different animation variants for desktop and mobile timeline
  const lineVariants = {
    hidden: { height: '0%', width: '0%' },
    visible: isMobile ? { 
      width: '100%',
      height: '100%',
      transition: { 
        duration: 0.8,
        ease: "easeInOut"
      }
    } : {
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
  
  // Only apply animations if hydrated (client-side)
  // Only animate if hydrated and not on mobile, or if on mobile but with reduced effects
  const shouldAnimate = isHydrated && (!isMobile || window.innerWidth > 480);
  
  // On smaller mobile devices, completely disable animations for better performance
  const disableAllAnimations = isHydrated && isMobile && window.innerWidth <= 480;
  

  
  // Render different JSX for mobile vs desktop
  const renderTimeline = () => {
    if (isMobile) {
      return (
        <div className={`${styles.timelineWrapper} ${styles.mobileTimeline}`}>
          {experiences.map((exp, index) => (
            <div 
              key={exp.id} 
              className={`${styles.timelineItem} ${activeExperience === index ? styles.active : ''}`}
              onClick={() => setActiveExperience(index)}
            >
              <div className={styles.timelineBubbleContainer}>
                <div 
                  className={styles.timelineBubble}
                  style={{ 
                    borderColor: exp.color,
                    backgroundColor: activeExperience === index ? exp.color : "var(--card-bg)" 
                  }}
                >
                  {exp.icon}
                </div>
              </div>
              
              <div className={`${styles.timelineItemContent} ${activeExperience === index ? styles.activeContent : ''}`}>
                <div className={styles.timelineHeader}>
                  <h3 style={{ color: exp.color }}>
                    {exp.role}
                  </h3>
                  <span className={styles.timelineCompany}>{exp.company}</span>
                  <span className={styles.timelineDuration}>{exp.duration}</span>
                </div>
                
                <div className={styles.timelineDetails}>
                  <ul className={styles.responsibilities}>
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Desktop version with animations
    return (
      <div className={styles.timelineWrapper}>
        <div className={styles.timelineProgressLine}>
          <motion.div 
            className={styles.progressBar}
            variants={shouldAnimate ? lineVariants : {}}
            initial={shouldAnimate ? "hidden" : false}
            animate={shouldAnimate ? "visible" : false}
            style={{ 
              backgroundImage: `linear-gradient(to bottom, ${experiences[0].color}, ${experiences[experiences.length-1].color})`
            }}
          />
        </div>
        <div className={styles.timelineContent}>
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className={`${styles.timelineItem} ${activeExperience === index ? styles.active : ''}`}
              variants={shouldAnimate && !isMobile ? itemVariants : {}}
              initial={shouldAnimate && !isMobile ? 'hidden' : false}
              animate={shouldAnimate && !isMobile ? 'visible' : false}
            >
              <div className={styles.timelineBubbleContainer}>
                <motion.div
                  className={styles.timelineBubble}
                  variants={shouldAnimate && !disableAllAnimations ? bubbleVariants : {}}
                  animate={shouldAnimate ? (activeExperience === index ? 'active' : 'visible') : false}
                  onClick={() => setActiveExperience(index)}
                  style={{
                    borderColor: exp.color,
                    backgroundColor: activeExperience === index ? exp.color : 'var(--card-bg)',
                  }}
                >
                  {exp.icon}
                </motion.div>
              </div>

              <motion.div
                className={`${styles.timelineItemContent} ${activeExperience === index ? styles.activeContent : ''}`}
                variants={shouldAnimate && !isMobile ? itemVariants : {}}
                initial={shouldAnimate && !isMobile ? 'hidden' : false}
                animate={shouldAnimate && !isMobile ? 'visible' : false}
              >
                <div className={styles.timelineHeader}>
                  <h3 style={{ color: exp.color }}>{exp.role}</h3>
                  <span className={styles.timelineCompany}>{exp.company}</span>
                  <span className={styles.timelineDuration}>{exp.duration}</span>
                </div>

                <motion.div
                  className={styles.timelineDetails}
                  variants={shouldAnimate ? itemVariants : {}}
                  initial={shouldAnimate && !isMobile ? 'hidden' : false}
                  animate={shouldAnimate ? 'visible' : false}
                >
                  <ul className={styles.responsibilities}>
                    {exp.description.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={shouldAnimate && !isMobile ? { opacity: 0, x: -10 } : false}
                        animate={{ opacity: 1, x: 0 }}
                        transition={shouldAnimate && !isMobile ? { delay: 0.05 * i } : { delay: 0 }}
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
    );
  };

  return (
    <section id="experience" className={styles.experienceSection}>
      <motion.div 
        className={styles.container}
        ref={timelineRef}
        variants={shouldAnimate && !disableAllAnimations ? containerVariants : {}}
        initial={shouldAnimate && !isMobile ? "hidden" : false}
        animate={shouldAnimate && !isMobile ? timelineControlsMain : {}}
      >
        <motion.div 
          className={styles.sectionHeader}
          variants={shouldAnimate && !isMobile ? itemVariants : {}}
        >
          <motion.span 
            className={styles.sectionTag}
            variants={shouldAnimate && !isMobile ? itemVariants : {}}
          >
            Experience
          </motion.span>
          <motion.h2 
            className={styles.sectionTitle}
            variants={shouldAnimate && !isMobile ? itemVariants : {}}
          >
            My Journey
          </motion.h2>
          <motion.p 
            className={styles.sectionDescription}
            variants={shouldAnimate && !isMobile ? itemVariants : {}}
          >
            A timeline of my professional experiences and career milestones
          </motion.p>
        </motion.div>
        
        {renderTimeline()}
      </motion.div>
    </section>
  );
};

export default Experience;
