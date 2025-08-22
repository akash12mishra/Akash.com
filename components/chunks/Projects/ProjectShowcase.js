"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./ProjectShowcase.module.scss";
import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const ProjectShowcase = () => {
  const [showAll, setShowAll] = useState(false);

  // Project data
  const allProjects = [
    {
      id: 1,
      name: "CawLab",
      description: "A comprehensive social media analytics platform designed to track engagement, monitor audience growth, and provide actionable insights for content creators and social media managers.",
      image: "/images/projects/clientWork/cawlab-app.png",
      technologies: ["NextJS", "MongoDB", "Node.js", "Chart.js"],
      liveLink: "https://cawlab.ai",
      githubLink: "#",
      featured: true
    },
    {
      id: 2,
      name: "Disco",
      description: "An AI-powered music discovery platform that analyzes user preferences to provide personalized recommendations and create custom playlists based on mood, activity, and listening history.",
      image: "/images/projects/clientWork/disco-app.png",
      technologies: ["React", "Python", "TensorFlow", "AWS"],
      liveLink: "https://disco.com",
      githubLink: "#",
      featured: true
    },
    {
      id: 3,
      name: "BrowzPot",
      description: "A browser-based productivity suite that helps teams collaborate in real-time, integrating task management, document sharing, and communication tools in a unified workspace.",
      image: "/images/projects/selfWork/browzpot-app.png",
      technologies: ["React", "Socket.io", "Express", "MongoDB"],
      liveLink: "https://browzpot.com",
      githubLink: "https://github.com/arkalal/BrowzPot",
      featured: true
    },
    {
      id: 4,
      name: "Quenlo",
      description: "A modern e-learning platform that delivers personalized courses and adaptive learning paths using AI to identify knowledge gaps and optimize the learning experience.",
      image: "/images/projects/clientWork/quenlo-app.png",
      technologies: ["NextJS", "TensorFlow.js", "Firebase", "MaterialUI"],
      liveLink: "https://quenlo.edu",
      githubLink: "#",
      featured: true
    },
    {
      id: 5,
      name: "TalTracker",
      description: "An AI-powered talent acquisition and management system that streamlines recruitment workflows, automates candidate screening, and provides data-driven hiring insights.",
      image: "/images/projects/clientWork/taltracker-app.png",
      technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
      liveLink: "https://taltracker.io",
      githubLink: "#",
      featured: true
    }
  ];

  // Determine which projects to show based on showAll state
  const displayProjects = showAll ? allProjects : allProjects.slice(0, 3);

  // Handle the "See More Projects" button click
  const handleSeeMoreClick = () => {
    setShowAll(true);
  };

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Projects</span>
          <h2 className={styles.heading}>
            Recent <span>Work</span>
          </h2>
          <p className={styles.subheading}>
            A selection of my recent projects and applications built with modern technologies.
          </p>
        </div>

        <div className={styles.projectsGrid}>
          {displayProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className={styles.moreProjects}>
          {!showAll && (
            <button onClick={handleSeeMoreClick} className={styles.btnOutline}>
              See More Projects
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

// Project Card Component
const ProjectCard = ({ project }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      className={styles.projectCard}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Project Image */}
      <div className={styles.projectImageWrapper}>
        <Image 
          src={project.image} 
          alt={project.name} 
          width={600} 
          height={340} 
          className={styles.projectImage}
        />
      </div>

      {/* Project Content */}
      <div className={styles.projectContent}>
        <h3 className={styles.projectName}>{project.name}</h3>
        <p className={styles.projectDescription}>{project.description}</p>
        
        <div className={styles.techStack}>
          {project.technologies.map((tech, index) => (
            <span key={index} className={styles.techBadge}>
              {tech}
            </span>
          ))}
        </div>
        
        <div className={styles.projectLinks}>
          {project.githubLink && (
            <a href={project.githubLink} className={styles.projectLink} target="_blank" rel="noopener noreferrer">
              <FaGithub /> Code
            </a>
          )}
          {project.liveLink && (
            <a href={project.liveLink} className={`${styles.projectLink} ${styles.liveLink}`} target="_blank" rel="noopener noreferrer">
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectShowcase;
