"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Experience.module.scss";
import { FaBriefcase, FaGraduationCap, FaBuilding, FaLaptopCode, FaRobot } from "react-icons/fa";

const Experience = () => {
  const [activeExperience, setActiveExperience] = useState(0);
  const timelineRef = useRef(null);
  
  // Experience data
  const experiences = [
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
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    const current = timelineRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);

  return (
    <section id="experience" className={styles.experienceSection} ref={timelineRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Experience</span>
          <h2 className={styles.sectionTitle}>My Journey</h2>
          <p className={styles.sectionDescription}>
            A timeline of my professional experiences and educational background.
          </p>
        </div>
        
        <div className={styles.timelineContainer}>
          <div className={styles.timelineNavigation}>
            {experiences.map((exp, index) => (
              <button
                key={exp.id}
                className={`${styles.timelineButton} ${activeExperience === index ? styles.active : ''}`}
                onClick={() => setActiveExperience(index)}
                style={activeExperience === index ? { borderColor: exp.color } : {}}
              >
                <div 
                  className={styles.iconContainer} 
                  style={{ backgroundColor: activeExperience === index ? exp.color : 'var(--card-bg)' }}
                >
                  {exp.icon}
                </div>
                <div className={styles.timelineInfo}>
                  <h3>{exp.role}</h3>
                  <p>{exp.company}</p>
                </div>
                <span 
                  className={styles.duration}
                  style={activeExperience === index ? { color: exp.color } : {}}
                >
                  {exp.duration}
                </span>
              </button>
            ))}
          </div>
          
          <div className={styles.timelineContent}>
            <div className={styles.experienceDetails} style={{ borderColor: experiences[activeExperience].color }}>
              <div 
                className={styles.experienceHeader} 
                style={{ backgroundColor: experiences[activeExperience].color }}
              >
                <h3>{experiences[activeExperience].role}</h3>
                <p>{experiences[activeExperience].company}</p>
              </div>
              <div className={styles.experienceBody}>
                <ul className={styles.responsibilities}>
                  {experiences[activeExperience].description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
