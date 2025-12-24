"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./ProjectShowcase.module.scss";
import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt, FaYoutube, FaPlay } from "react-icons/fa";
import VideoPopup from "./VideoPopup";

let youTubeIframeApiPromise;

const getYouTubeVideoId = (url) => {
  if (!url) return "";
  if (url.includes("youtu.be")) {
    const id = url.split("/").pop();
    return id || "";
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length === 11 ? match[2] : "";
};

const loadYouTubeIframeApi = () => {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.YT && window.YT.Player) return Promise.resolve(true);

  if (youTubeIframeApiPromise) return youTubeIframeApiPromise;

  youTubeIframeApiPromise = new Promise((resolve) => {
    if (!window.__ytIframeApiReadyCallbacks) {
      window.__ytIframeApiReadyCallbacks = [];
    }

    window.__ytIframeApiReadyCallbacks.push(() => resolve(true));

    const existingScript = document.getElementById("youtube-iframe-api");
    if (!existingScript) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === "function") previousReady();
      const callbacks = window.__ytIframeApiReadyCallbacks || [];
      window.__ytIframeApiReadyCallbacks = [];
      callbacks.forEach((cb) => {
        try {
          cb();
        } catch (e) {
          return;
        }
      });
    };
  });

  return youTubeIframeApiPromise;
};

const YouTubePreview = ({ videoUrl, poster, title, active }) => {
  const videoId = getYouTubeVideoId(videoUrl);
  const playerHostRef = useRef(null);
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);

  const [mediaRef, mediaInView] = useInView({
    threshold: 0.35,
    triggerOnce: false,
    rootMargin: "200px",
  });

  useEffect(() => {
    if (!videoId) return;
    let isCancelled = false;

    loadYouTubeIframeApi().then((ok) => {
      if (!ok || isCancelled) return;
      if (!playerHostRef.current) return;
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(playerHostRef.current, {
        host: "https://www.youtube-nocookie.com",
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          playlist: videoId,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (isCancelled) return;
            setPlayerReady(true);
            try {
              event.target.mute();
              if (active && mediaInView) event.target.playVideo();
            } catch (e) {
              return;
            }
          },
          onStateChange: (event) => {
            if (isCancelled) return;
            if (event.data === window.YT.PlayerState.ENDED) {
              try {
                event.target.seekTo(0);
                event.target.playVideo();
              } catch (e) {
                return;
              }
            }
          },
        },
      });
    });

    return () => {
      isCancelled = true;
      if (
        playerRef.current &&
        typeof playerRef.current.destroy === "function"
      ) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          return;
        }
      }
      playerRef.current = null;
      setPlayerReady(false);
    };
  }, [videoId]);

  useEffect(() => {
    const player = playerRef.current;
    if (!playerReady || !player) return;

    try {
      if (active && mediaInView) {
        player.mute();
        player.playVideo();
        return;
      }

      player.pauseVideo();
      if (!active) {
        player.seekTo(0);
      }
    } catch (e) {
      return;
    }
  }, [active, mediaInView, playerReady]);

  if (!videoId) {
    return (
      <Image
        src={poster}
        alt={title}
        width={600}
        height={340}
        className={styles.projectImage}
      />
    );
  }

  return (
    <div ref={mediaRef} className={styles.projectMediaRoot}>
      <Image
        src={poster}
        alt={title}
        width={600}
        height={340}
        className={styles.projectImage}
      />
      <div
        className={`${styles.youtubePreview} ${
          playerReady && active ? styles.youtubePreviewReady : ""
        }`}
      >
        <div className={styles.youtubePlayer}>
          <div ref={playerHostRef} className={styles.youtubePlayerHost} />
        </div>
      </div>
    </div>
  );
};

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

  // Project data - Order: Disco, NixBuilder, AI RAG Copilot, Browzpot, TalTracker, Quenlo
  const allProjects = [
    {
      id: 1,
      name: "Disco",
      description:
        "Full-scale influencer marketing platform with in-depth creator discovery, filtering, and profile enrichment.",
      image: "/images/projects/selfWork/disco-image.png",
      technologies: ["Next.js 16", "Node.js", "MongoDB"],
      liveLink: null,
      githubLink: null,
      featured: true,
      demoVideo: "https://youtu.be/9Dhl5c9lDN8",
      previewVideo: "https://youtu.be/GLAM1qw2ZHA",
    },
    {
      id: 2,
      name: "NixBuilder — AI App Builder",
      description:
        "AI-powered platform that enables users to build full SaaS MVP applications end-to-end using natural language prompts, without writing code.",
      image: "/images/projects/selfWork/nixbuilder-image.png",
      technologies: [
        "Next.js 16",
        "Node.js",
        "Supabase",
        "OpenRouter LLM APIs",
        "Vercel AI SDK",
      ],
      liveLink: null,
      githubLink: null,
      featured: true,
      demoVideo: "https://youtu.be/BYfE1g8MC0g",
      previewVideo: "https://youtu.be/zcdSslIl5pw",
    },
    {
      id: 3,
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
      liveLink: null,
      githubLink: null,
      featured: true,
      demoVideo: "https://youtu.be/UaMSO7ypGEs",
      previewVideo: "https://youtu.be/Y1sDX0leo5o",
    },
    {
      id: 4,
      name: "BrowzPot",
      description:
        "AI powered chrome extension Software that helps in your day to day productivity automation from writing emails to getting summaries from web pages to taking notes instantly on your browser and many more ! (Under Development)",
      image: "/images/projects/selfWork/browzpot-app.png",
      technologies: ["NextJS", "NextAuthJS", "MongoDB", "NodeJS", "OpenAI"],
      liveLink: "https://browzpot.com",
      githubLink: "https://github.com/arkalal/BrowzPot",
      featured: true,
      demoVideo: "https://youtu.be/GwutUEqp2gc",
      previewVideo: "https://youtu.be/PSeyteGONXg",
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
    {
      id: 6,
      name: "CawLab",
      description:
        "AI-powered floor plan generator that converts sketches into professional 2D floor plans.",
      image: "/images/projects/clientWork/cawlab-app.png",
      technologies: ["NextJS", "NextAuthJS", "MongoDB", "NodeJS", "OpenAI"],
      liveLink: "https://cawlab.ai",
      githubLink: null,
      featured: true,
      demoVideo: "https://youtu.be/egetCm7cjJM",
      previewVideo: "https://youtu.be/hpRzwtmf8H0",
    },
    {
      id: 7,
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
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  // Set mounted state to prevent SSR hydration flicker
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  useEffect(() => {
    if (isMobile) {
      setIsHovering(false);
      setIsPreviewPlaying(false);
    }
  }, [isMobile]);

  // Reset preview when not hovering
  useEffect(() => {
    if (!isHovering) {
      setIsPreviewPlaying(false);
    }
  }, [isHovering]);

  const [ref, inView] = useInView({
    threshold: 0.05,
    triggerOnce: true,
    rootMargin: "100px",
  });

  const handlePlayClick = (e) => {
    e.stopPropagation();
    setIsPreviewPlaying(true);
  };

  return (
    <motion.div
      ref={ref}
      className={styles.projectCard}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{ opacity: 0, y: 20 }}
    >
      {/* Project Image */}
      <div
        className={styles.projectImageWrapper}
        onMouseEnter={() => {
          if (!isMobile) setIsHovering(true);
        }}
        onMouseLeave={() => {
          if (!isMobile) setIsHovering(false);
        }}
      >
        {project.previewVideo && isPreviewPlaying ? (
          <YouTubePreview
            videoUrl={project.previewVideo}
            poster={project.image}
            title={project.name}
            active={!isMobile && isHovering && isPreviewPlaying}
          />
        ) : (
          <>
            <Image
              src={project.image}
              alt={project.name}
              width={600}
              height={340}
              className={styles.projectImage}
            />
            {project.previewVideo && isHovering && !isMobile && (
              <motion.button
                className={styles.playButton}
                onClick={handlePlayClick}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={styles.playButtonInner}>
                  <FaPlay className={styles.playIcon} />
                </div>
                <div className={styles.playButtonRing} />
              </motion.button>
            )}
          </>
        )}
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
