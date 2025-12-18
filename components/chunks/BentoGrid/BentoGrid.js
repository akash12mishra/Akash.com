"use client";

import React from "react";
import styles from "./BentoGrid.module.scss";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaCode,
} from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";

const BentoGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const experiences = [
    {
      role: "AI Engineer",
      company: "Freelance",
      period: "2024 - Present",
      type: "Full-time",
    },
    {
      role: "SDE-I",
      company: "Infojini Consulting",
      period: "2023 - 2024",
      type: "Full-time",
    },
    {
      role: "Full Stack Developer",
      company: "Freelance",
      period: "2022 - 2023",
      type: "Freelance",
    },
  ];

  const projects = [
    {
      name: "CawLab AI",
      image: "/images/projects/clientWork/cawlab-app.png",
      link: "https://cawlab.ai",
    },
    {
      name: "BrowzPot",
      image: "/images/projects/selfWork/browzpot-app.png",
      link: "https://browzpot.com",
    },
    {
      name: "AI RAG Copilot",
      image: "/images/projects/clientWork/copilot-app.png",
      link: "#",
    },
  ];

  const techStack = [
    { name: "Next.js", icon: "/images/nextJS.png" },
    { name: "React", icon: "/images/React.png" },
    { name: "MongoDB", icon: "/images/mongoDB.png" },
    { name: "Node.js", icon: "/images/node.webp" },
  ];

  const workSteps = [
    {
      step: "01",
      title: "Discovery Call",
      desc: "Discuss your goals and requirements",
    },
    { step: "02", title: "Planning", desc: "Create detailed project roadmap" },
    {
      step: "03",
      title: "Development",
      desc: "Build your solution iteratively",
    },
    { step: "04", title: "Delivery", desc: "Launch and provide support" },
  ];

  return (
    <motion.div
      className={styles.bentoContainer}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={styles.bentoGrid}>
        {/* Experience Card */}
        <motion.div
          className={`${styles.card} ${styles.experienceCard}`}
          variants={itemVariants}
        >
          <div className={styles.cardHeader}>
            <FaBriefcase className={styles.cardIcon} />
            <span className={styles.cardTitle}>My Experience</span>
          </div>
          <div className={styles.experienceList}>
            {experiences.map((exp, index) => (
              <div key={index} className={styles.experienceItem}>
                <div className={styles.expDot}></div>
                <div className={styles.expContent}>
                  <h4>{exp.role}</h4>
                  <p className={styles.expCompany}>{exp.company}</p>
                  <span className={styles.expPeriod}>
                    {exp.period} · {exp.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Projects Card */}
        <motion.div
          className={`${styles.card} ${styles.projectsCard}`}
          variants={itemVariants}
        >
          <div className={styles.cardHeader}>
            <FaCode className={styles.cardIcon} />
            <span className={styles.cardTitle}>Featured Projects</span>
          </div>
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectThumb}
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  width={120}
                  height={80}
                  className={styles.projectImage}
                />
              </a>
            ))}
          </div>
          <a href="#projects" className={styles.viewAll}>
            View all projects <HiOutlineExternalLink />
          </a>
        </motion.div>

        {/* Tech Stack Card */}
        <motion.div
          className={`${styles.card} ${styles.techCard}`}
          variants={itemVariants}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Tech Stack</span>
          </div>
          <div className={styles.techGrid}>
            {techStack.map((tech, index) => (
              <div key={index} className={styles.techItem}>
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  width={40}
                  height={40}
                  className={styles.techIcon}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Location Card */}
        <motion.div
          className={`${styles.card} ${styles.locationCard}`}
          variants={itemVariants}
        >
          <div className={styles.cardHeader}>
            <FaMapMarkerAlt className={styles.cardIcon} />
            <span className={styles.cardTitle}>Location</span>
          </div>
          <div className={styles.locationContent}>
            <div className={styles.mapPlaceholder}>
              <Image
                src="/images/india-map.png"
                alt="India Map"
                width={200}
                height={140}
                className={styles.mapImage}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div className={styles.locationInfo}>
              <h3>KOLKATA</h3>
              <p>INDIA</p>
            </div>
          </div>
        </motion.div>

        {/* How I Work Card */}
        <motion.div
          className={`${styles.card} ${styles.howIWorkCard}`}
          variants={itemVariants}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>How I work</span>
          </div>
          <p className={styles.workDescription}>
            I follow a structured approach to ensure successful project delivery
            and client satisfaction.
          </p>
          <div className={styles.stepsRow}>
            {workSteps.map((item, index) => (
              <button
                key={index}
                className={`${styles.stepButton} ${
                  index === 0 ? styles.active : ""
                }`}
              >
                Step {item.step}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Connect Card */}
        <motion.div
          className={`${styles.card} ${styles.connectCard}`}
          variants={itemVariants}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Let&apos;s Connect</span>
          </div>
          <div className={styles.socialLinks}>
            <a
              href="https://github.com/arkalal"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <FaGithub size={20} />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/arkalal/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <FaLinkedin size={20} />
              <span>LinkedIn</span>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BentoGrid;
