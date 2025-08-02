"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Projects.module.scss";
import Image from "next/image";
import {
  FaArrowRight,
  FaGithub,
  FaYoutube,
  FaExternalLinkAlt,
} from "react-icons/fa";

// Client Project Images
import cawlabImg from "../../../assets/images/projects/clientWork/cawlab-app.png";
import taltrackerImg from "../../../assets/images/projects/clientWork/taltracker-app.png";
import discoImg from "../../../assets/images/projects/clientWork/disco-app.png";
import quenloImg from "../../../assets/images/projects/clientWork/quenlo-app.png";

// Own SaaS Project Images
import browzpotImg from "../../../assets/images/projects/selfWork/browzpot-app.png";

const Projects = () => {
  const [activeTab, setActiveTab] = useState("client");
  const [showModal, setShowModal] = useState(false);
  const projectsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    const current = projectsRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);

  // Client projects data
  const clientProjects = [
    {
      id: 1,
      name: "Cawlab - 2D Floor Plan Generator",
      image: cawlabImg,
      description:
        "AI-powered floor plan generator that converts sketches into professional 2D floor plans.",
      tags: ["AI", "NextJS", "MongoDB"],
    },
    {
      id: 2,
      name: "Taltracker",
      image: taltrackerImg,
      description:
        "Advanced talent tracking and management platform for recruiting professionals.",
      tags: ["React", "NodeJS", "PostgreSQL"],
    },
    {
      id: 3,
      name: "Disco Influencer Marketing",
      image: discoImg,
      description:
        "Influencer marketing platform connecting brands with social media influencers.",
      tags: ["NextJS", "AI", "Firebase"],
    },
    {
      id: 4,
      name: "Quenlo AI",
      image: quenloImg,
      description:
        "AI-driven content generation and marketing automation platform.",
      tags: ["AI", "React", "Python"],
    },
  ];

  // Own SaaS projects data
  const ownProjects = [
    {
      id: 1,
      name: "BrowzPot",
      image: browzpotImg,
      description:
        "An AI-powered SaaS platform that helps businesses optimize their web presence and customer engagement.",
      tags: ["AI", "NextJS", "MongoDB", "OpenAI"],
      appLink: "https://www.browzpot.com/",
      demoLink: "#", // Will be updated later with YouTube demo link
    },
  ];

  return (
    <section id="projects" className={styles.projectsSection} ref={projectsRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Projects</span>
          <h2 className={styles.sectionTitle}>My Recent Work</h2>
          <p className={styles.sectionDescription}>
            A collection of projects Ive worked on, showcasing my expertise in
            AI, web development, and creative problem-solving.
          </p>
        </div>

        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${
                activeTab === "client" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("client")}
            >
              Client Projects
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "own" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("own")}
            >
              My SaaS Products
            </button>
          </div>

          <div
            className={styles.tabIndicator}
            style={{
              left: activeTab === "client" ? "0" : "50%",
            }}
          ></div>
        </div>

        <div className={styles.projectsContainer}>
          {/* Client Projects Grid */}
          {activeTab === "client" && (
            <div className={styles.projectsGrid}>
              {clientProjects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.projectImage}
                    />
                    <div className={styles.overlay}>
                      <h4>{project.name}</h4>
                      <p>{project.description}</p>
                      <div className={styles.tags}>
                        {project.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Own SaaS Projects Grid */}
          {activeTab === "own" && (
            <div className={styles.projectsGrid}>
              {ownProjects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.projectImage}
                    />
                    <div className={styles.overlay}>
                      <h4>{project.name}</h4>
                      <p>{project.description}</p>
                      <div className={styles.tags}>
                        {project.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className={styles.buttons}>
                        <a
                          href={project.appLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.button}
                        >
                          <span>Visit App</span>
                          <FaExternalLinkAlt />
                        </a>
                        <button
                          className={styles.button}
                          onClick={() => setShowModal(true)}
                        >
                          <span>Show Demo</span>
                          <FaYoutube />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Demo Modal - to be populated with YouTube embed when available */}
      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <div className={styles.videoContainer}>
              <p>YouTube video demo will be added here</p>
              {/* When the YouTube video is available, uncomment and add the correct video ID */}
              {/* <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="BrowzPot Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe> */}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
