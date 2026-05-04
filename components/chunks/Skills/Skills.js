"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import styles from "./Skills.module.scss";

const SKILLS_DATA = [
  {
    category: "Languages",
    tags: ["JAVASCRIPT", "TYPESCRIPT", "PYTHON"],
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=720&fit=crop",
    color: "#1a1a1a",
  },
  {
    category: "Frontend",
    tags: ["REACT", "NEXT.JS 16", "HTML5", "CSS3", "SCSS", "TAILWIND CSS"],
    image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&h=720&fit=crop",
    color: "#0f172a",
  },
  {
    category: "Backend",
    tags: ["NODE.JS", "EXPRESS.JS", "FASTAPI", "REST APIS"],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=720&fit=crop",
    color: "#111827",
  },
  {
    category: "Databases",
    tags: ["MONGODB", "SUPABASE", "PINECONE", "QDRANT"],
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=720&fit=crop",
    color: "#1c1917",
  },
  {
    category: "AI & Automation",
    tags: [
      "OPENAI API",
      "CLAUDE API",
      "LLMS",
      "RAG",
      "EMBEDDINGS",
      "PROMPT ENGINEERING",
      "AGENT WORKFLOWS",
    ],
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=720&fit=crop",
    color: "#0b1020",
  },
  {
    category: "Soft Skills",
    tags: [
      "COLLABORATION",
      "TECHNICAL COMMUNICATION",
      "PROBLEM-SOLVING",
      "ADAPTABILITY",
      "OWNERSHIP",
    ],
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=720&fit=crop",
    color: "#1f1611",
  },
];

const scaleAnimation = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter: {
    scale: 1,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    scale: 0,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] },
  },
};

const SkillRow = ({ index, skill, setModal }) => {
  return (
    <li
      className={styles.skillRow}
      onMouseEnter={() => setModal({ active: true, index })}
      onMouseLeave={() => setModal({ active: false, index })}
    >
      <div className={styles.rowLeft}>
        <h3 className={styles.rowTitle}>{skill.category}</h3>
        <div className={styles.rowTags}>
          {skill.tags.map((tag, i) => (
            <span key={i} className={styles.rowTag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className={styles.rowMeta}>Skills & Expertise</p>
    </li>
  );
};

const HoverModal = ({ modal, items }) => {
  const { active, index } = modal;
  const modalContainer = useRef(null);
  const cursor = useRef(null);
  const cursorLabel = useRef(null);

  useEffect(() => {
    const xMoveContainer = gsap.quickTo(modalContainer.current, "left", {
      duration: 0.8,
      ease: "power3",
    });
    const yMoveContainer = gsap.quickTo(modalContainer.current, "top", {
      duration: 0.8,
      ease: "power3",
    });
    const xMoveCursor = gsap.quickTo(cursor.current, "left", {
      duration: 0.5,
      ease: "power3",
    });
    const yMoveCursor = gsap.quickTo(cursor.current, "top", {
      duration: 0.5,
      ease: "power3",
    });
    const xMoveCursorLabel = gsap.quickTo(cursorLabel.current, "left", {
      duration: 0.45,
      ease: "power3",
    });
    const yMoveCursorLabel = gsap.quickTo(cursorLabel.current, "top", {
      duration: 0.45,
      ease: "power3",
    });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      xMoveContainer(clientX);
      yMoveContainer(clientY);
      xMoveCursor(clientX);
      yMoveCursor(clientY);
      xMoveCursorLabel(clientX);
      yMoveCursorLabel(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <motion.div
        ref={modalContainer}
        className={styles.modalContainer}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? "enter" : "closed"}
      >
        <div
          className={styles.modalSlider}
          style={{ top: `${index * -100}%` }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className={styles.modalSlide}
              style={{ backgroundColor: item.color }}
            >
              <img
                src={item.image}
                alt={item.category}
                className={styles.modalImage}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        ref={cursor}
        className={styles.cursor}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? "enter" : "closed"}
      />
      <motion.div
        ref={cursorLabel}
        className={styles.cursorLabel}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? "enter" : "closed"}
      >
        View
      </motion.div>
    </>
  );
};

const Skills = () => {
  const [modal, setModal] = useState({ active: false, index: 0 });

  return (
    <section id="skills" className={styles.skillsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionTag}>Skills</span>
          <h2 className={styles.title}>What I Work With</h2>
          <p className={styles.subtitle}>
            Technologies, tools, and expertise I bring to every project.
          </p>
        </div>

        <ul className={styles.skillsList}>
          {SKILLS_DATA.map((skill, idx) => (
            <SkillRow
              key={skill.category}
              index={idx}
              skill={skill}
              setModal={setModal}
            />
          ))}
        </ul>
      </div>

      <HoverModal modal={modal} items={SKILLS_DATA} />
    </section>
  );
};

export default Skills;
