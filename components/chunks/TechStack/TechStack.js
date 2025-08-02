"use client";

import React, { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./TechStack.module.scss";
import { 
  SiNextdotjs, 
  SiVercel, 
  SiMongodb, 
  SiOpenai, 
  SiNodedotjs, 
  SiJavascript,
  SiTypescript,
  SiReact,
  SiSass,
  SiGit,
  SiPython
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

const TechStack = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const techItemVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const techItems = [
    { icon: SiNextdotjs, name: "Next.js", color: "#000000" },
    { icon: SiVercel, name: "Vercel", color: "#000000" },
    { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
    { icon: SiOpenai, name: "OpenAI", color: "#412991" },
    { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
    { icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" },
    { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
    { icon: SiReact, name: "React", color: "#61DAFB" },
    { icon: SiSass, name: "SASS", color: "#CC6699" },
    { icon: SiGit, name: "Git", color: "#F05032" },
    { icon: FaAws, name: "AWS", color: "#FF9900" },
    { icon: SiPython, name: "Python", color: "#3776AB" }
  ];

  const sectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    });
    
    const currentRef = sectionRef.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section id="tech-stack" className={styles.techStackSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Technologies</span>
          <h2 className={styles.sectionTitle}>My Tech Stack</h2>
          <p className={styles.sectionDescription}>
            The cutting-edge technologies I use to build powerful applications
          </p>
        </div>

        <motion.div 
          className={styles.techGrid}
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {techItems.map((tech, index) => (
            <motion.div 
              className={styles.techItem}
              key={index}
              variants={techItemVariants}
              whileHover={{ 
                scale: 1.1, 
                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 }
              }}
            >
              <div className={styles.iconWrapper} style={{ color: tech.color }}>
                <tech.icon size={38} />
              </div>
              <span className={styles.techName}>{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
