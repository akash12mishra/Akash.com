"use client";

import React, { useState, useEffect } from "react";
import styles from "./ExperienceTestimonial.module.scss";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { HiOutlineBriefcase } from "react-icons/hi";
import { FiMapPin, FiCalendar } from "react-icons/fi";

const ExperienceTestimonial = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [activeId, setActiveId] = useState(1); // Track which dot is glowing
  const [isMounted, setIsMounted] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const experiences = [
    {
      id: 1,
      role: "Lead Software Engineer",
      company: "Epigroww Global",
      location: "Remote",
      duration: "Sept 2025 - Present",
      type: "Full-time",
      description:
        "Leading development of influencer marketing platform using Next.js 16, Node.js, and MongoDB. Built AI automations reducing manual effort by ~30%.",
      skills: ["Next.js 16", "Node.js", "MongoDB", "AI Automation"],
    },
    {
      id: 2,
      role: "Freelance Software Engineer",
      company: "arkalalchakravarty.com",
      location: "Remote",
      duration: "Jan 2025 - Aug 2025",
      type: "Freelance",
      description:
        "Building AI-driven SaaS MVPs and implementing agentic automation solutions for diverse clients.",
      skills: ["AI/ML", "NextJS", "Python", "Automation"],
    },
    {
      id: 3,
      role: "AI Engineer",
      company: "Helionix",
      location: "Remote",
      duration: "Feb 2025 - Jun 2025",
      type: "Contract",
      description:
        "Developed social media automation platform and LinkedIn Chrome extension using Microsoft Autogen.",
      skills: ["Autogen", "FastAPI", "Chrome Extension", "AI"],
    },
    {
      id: 4,
      role: "AI Engineer",
      company: "ScaleGenAI",
      location: "Remote",
      duration: "Jul 2024 - Dec 2024",
      type: "Full-time",
      description:
        "Built AI-powered solutions and scalable technologies for business applications.",
      skills: ["NextJS", "AI", "SCSS", "Scalable Systems"],
    },
    {
      id: 5,
      role: "Software Developer",
      company: "Infojini Inc",
      location: "Hyderabad, Telangana, India",
      duration: "Mar 2022 - Jul 2024",
      type: "Full-time",
      description:
        "Worked on US State Govt healthcare projects and developed CMS applications using ReactJS.",
      skills: ["ReactJS", "AngularJS", "CMS", "Healthcare"],
    },
    {
      id: 6,
      role: "Frontend Web Developer",
      company: "CRIMSON INTELLIGENCE SA",
      location: "Remote",
      duration: "Sep 2021 - Feb 2022",
      type: "Internship",
      description:
        "Developed E-commerce products and data dashboards for sales analytics.",
      skills: ["HTML5", "CSS3", "JavaScript", "E-commerce"],
    },
  ];

  const handleCardClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
    setActiveId(id); // Shift the glowing dot to this card
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="experience" className={styles.experienceSection} ref={ref}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>
            <HiOutlineBriefcase /> Experience
          </span>
        </div>

        <motion.div
          className={styles.timeline}
          variants={containerVariants}
          initial={isMounted ? "hidden" : false}
          animate={
            isMounted && inView ? "visible" : isMounted ? "hidden" : false
          }
        >
          {experiences.map((exp, index) => {
            const isExpanded = expandedId === exp.id;
            const isActive = activeId === exp.id;

            return (
              <motion.div
                key={exp.id}
                className={`${styles.timelineItem} ${
                  isExpanded ? styles.expanded : ""
                }`}
                variants={itemVariants}
                onClick={() => handleCardClick(exp.id)}
              >
                {/* Timeline dot and line */}
                <div className={styles.timelineTrack}>
                  <motion.div
                    className={`${styles.dot} ${
                      isActive ? styles.activeDot : ""
                    }`}
                    animate={
                      isActive
                        ? {
                            boxShadow: [
                              "0 0 0 0 rgba(255, 107, 53, 0.7)",
                              "0 0 0 8px rgba(255, 107, 53, 0)",
                              "0 0 0 0 rgba(255, 107, 53, 0.7)",
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  {index < experiences.length - 1 && (
                    <div className={styles.line} />
                  )}
                </div>

                {/* Content card */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.titleSection}>
                      <h3 className={styles.role}>{exp.role}</h3>
                      <div className={styles.companyInfo}>
                        <span className={styles.company}>{exp.company}</span>
                        <span
                          className={styles.typeBadge}
                          data-type={exp.type.toLowerCase()}
                        >
                          {exp.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.meta}>
                    <span className={styles.metaItem}>
                      <FiCalendar />
                      {exp.duration}
                    </span>
                    <span className={styles.metaItem}>
                      <FiMapPin />
                      {exp.location}
                    </span>
                  </div>

                  {isExpanded && (
                    <motion.div
                      className={styles.expandedContent}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className={styles.description}>{exp.description}</p>
                      <div className={styles.skills}>
                        {exp.skills.map((skill, i) => (
                          <span key={i} className={styles.skillTag}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceTestimonial;
