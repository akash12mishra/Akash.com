"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./ProjectShowcase.module.scss";
import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt, FaYoutube } from "react-icons/fa";
import VideoPopup from "./VideoPopup";

const ProjectShowcase = () => {
  const [showAll, setShowAll] = useState(false);
  const [videoPopup, setVideoPopup] = useState({
    isOpen: false,
    videoId: "",
  });

  // Open video popup
  const openVideoPopup = (videoId) => {
    setVideoPopup({
      isOpen: true,
      videoId,
    });
  };

  // Close video popup
  const closeVideoPopup = () => {
    setVideoPopup({
      isOpen: false,
      videoId: "",
    });
  };

  // Project data
  const allProjects = [
    {
      id: 1,
      name: "CawLab",
      description:
        "AI-powered floor plan generator that converts sketches into professional 2D floor plans.",
      image: "/images/projects/clientWork/cawlab-app.png",
      technologies: ["NextJS", "NextAuthJS", "MongoDB", "NodeJS", "OpenAI"],
      liveLink: "https://cawlab.ai",
      githubLink: null,
      featured: true,
      demoVideo: "https://youtu.be/egetCm7cjJM",
    },
    // Commented out Disco project as requested
    // {
    //   id: 2,
    //   name: "Disco",
    //   description: "Influencer marketing platform connecting brands with social media influencers.",
    //   image: "/images/projects/clientWork/disco-app.png",
    //   technologies: ["NextJS", "NextAuthJS", "MongoDB", "NodeJS", "OpenAI"],
    //   liveLink: null,
    //   githubLink: null,
    //   featured: true
    // },
    {
      id: 2,
      name: "AI RAG Copilot",
      description:
        "Advanced AI Integrated RAG system chatbot agent, where you can chat with your created knowledge base data and allow LLM Models to take actions on your behalf.",
      image: "/images/projects/clientWork/copilot-app.png",
      technologies: [
        "NextJS",
        "LangChain",
        "OpenRouter",
        "OpenAI",
        "NodeJS",
        "RAG",
        "Vector DB",
        "Prisma",
      ],
      liveLink: "https://youtu.be/CtTtYksEmxs",
      githubLink: null,
      featured: true,
      demoVideo: "https://youtu.be/CtTtYksEmxs",
    },
    {
      id: 3,
      name: "BrowzPot",
      description:
        "AI powered chrome extension Software that helps in your day to day productivity automation from writing emails to getting summaries from web pages to taking notes instantly on your browser and many more ! (Under Development)",
      image: "/images/projects/selfWork/browzpot-app.png",
      technologies: ["NextJS", "NextAuthJS", "MongoDB", "NodeJS", "OpenAI"],
      liveLink: "https://browzpot.com",
      githubLink: "https://github.com/arkalal/BrowzPot",
      featured: true,
      demoVideo: "https://youtu.be/FWaDZX17rEE",
    },
    {
      id: 4,
      name: "Quenlo AI",
      description:
        "AI-driven content generation and marketing automation platform.",
      image: "/images/projects/clientWork/quenlo-app.png",
      technologies: [
        "NextJS",
        "Python",
        "Clerk Auth",
        "Supabase",
        "Prisma",
        "OpenAI",
      ],
      liveLink: null,
      githubLink: null,
      featured: true,
    },
    {
      id: 5,
      name: "TalTracker",
      description:
        "Advanced talent tracking and management platform for recruiting professionals.",
      image: "/images/projects/clientWork/taltracker-app.png",
      technologies: ["NextJS", "NextAuthJS", "MongoDB", "NodeJS", "OpenAI"],
      liveLink: "https://taltracker.io",
      githubLink: null,
      featured: true,
      demoVideo: "https://youtu.be/zAr0qU9_onk",
    },
  ];

  // Determine which projects to show based on showAll state
  const displayProjects = showAll ? allProjects : allProjects.slice(0, 4);

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
            A selection of my recent projects and applications built with modern
            technologies.
          </p>
        </div>

        <div className={styles.projectsGrid}>
          {displayProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              openVideoPopup={openVideoPopup}
            />
          ))}
        </div>

        <div className={styles.moreProjects}>
          {!showAll && (
            <button onClick={handleSeeMoreClick} className={styles.btnOutline}>
              See More Projects
            </button>
          )}
        </div>

        {/* Video Popup Component */}
        <VideoPopup
          isOpen={videoPopup.isOpen}
          onClose={closeVideoPopup}
          videoId={videoPopup.videoId}
        />
      </div>
    </section>
  );
};

// Project Card Component
const ProjectCard = ({ project, openVideoPopup }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
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

  const [ref, inView] = useInView({
    threshold: 0.05, // Very low threshold to trigger earlier
    triggerOnce: true,
    rootMargin: "100px", // Much larger margin to preload before element is visible
  });

  // Apply optimizations for mobile rendering to prevent flicker
  useEffect(() => {
    // Store the ref value in a variable to use in cleanup
    const currentRef = ref.current;

    if (currentRef) {
      // Apply will-change before element is in view
      currentRef.style.willChange = "opacity";
      currentRef.style.backfaceVisibility = "hidden";
      currentRef.style.webkitBackfaceVisibility = "hidden";

      // Force hardware acceleration
      currentRef.style.transform = "translateZ(0)";

      return () => {
        if (currentRef) {
          currentRef.style.willChange = "auto";
          currentRef.style.backfaceVisibility = "visible";
          currentRef.style.webkitBackfaceVisibility = "visible";
        }
      };
    }
  }, [ref]);

  return (
    <motion.div
      ref={ref}
      className={styles.projectCard}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: isMobile ? 0.1 : 0.3, // Ultra fast on mobile to prevent flickering
        ease: "linear",
      }}
      style={{
        // Apply styles that help with mobile rendering
        transform: "translate3d(0,0,0)",
        WebkitTransform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        perspective: 1000,
        WebkitPerspective: 1000,
      }}
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
          {/* GitHub code link when available */}
          {project.githubLink && (
            <a
              href={project.githubLink}
              className={styles.projectLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub /> Code
            </a>
          )}

          {/* Demo video button */}
          {project.demoVideo && (
            <button
              className={`${styles.projectLink} ${styles.liveLink}`}
              onClick={(e) => {
                e.preventDefault();
                openVideoPopup(project.demoVideo);
              }}
            >
              <FaYoutube /> Live Demo
            </button>
          )}

          {/* External link when there's no demo video */}
          {project.liveLink && !project.demoVideo && (
            <a
              href={project.liveLink}
              className={`${styles.projectLink} ${styles.liveLink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectShowcase;
