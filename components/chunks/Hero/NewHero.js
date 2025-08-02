"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./NewHero.module.scss";
import Image from "next/image";
import Typewriter from "../../../utils/Typewriter";
import { FaArrowDown, FaLinkedin, FaXTwitter, FaGithub } from "react-icons/fa6";
import { motion } from "framer-motion";
import logoImg from "../../../assets/images/arka.png";


const NewHero = () => {
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollTop = window.scrollY;
      const opacity = 1 - (scrollTop * 0.003);
      const translateY = scrollTop * 0.3;
      
      if (heroRef.current) {
        heroRef.current.style.opacity = Math.max(opacity, 0);
        heroRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };
    
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <section id="home" className={styles.heroSection}>
      <div className={styles.heroBackground}>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.gridPattern}></div>
      </div>
      
      <motion.div 
        className={styles.container} 
        ref={heroRef}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className={styles.content} variants={containerVariants}>
          <motion.div 
            className={styles.avatarContainer}
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 0.02}deg) rotateX(${-mousePosition.y * 0.02}deg)`
            }}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={styles.glassCard}>
              <Image 
                src={logoImg} 
                alt="Arka Lal Chakravarty" 
                width={220} 
                height={220} 
                className={styles.avatar} 
                priority
              />
              <div className={styles.avatarGlow}></div>
              <div className={styles.avatarRing}></div>
            </div>
          </motion.div>
          
          <motion.div className={styles.textContent} variants={containerVariants}>
            <motion.h1 className={styles.title} variants={itemVariants}>
              <motion.span className={styles.greeting} variants={itemVariants}>Hello, I&apos;m</motion.span>
              <motion.span className={styles.name} variants={itemVariants}>Arka Lal Chakravarty</motion.span>
              <motion.span className={styles.role} variants={itemVariants}>
                <span className={styles.rolePrefix}>I&apos;m a </span>
                <Typewriter
                  words={["AI Engineer", "Full Stack Developer", "Automation Architect"]}
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={2000}
                  cursorStyle="|"
                />
              </motion.span>
            </motion.h1>
            
            <motion.p className={styles.description} variants={itemVariants}>
              Building cutting-edge AI-powered SaaS products, automation workflows, and web platforms.
              Specializing in advanced AI integrations, high-performance applications, and custom solutions.
            </motion.p>
            
            <motion.div className={styles.actionButtons} variants={itemVariants}>
              <motion.a 
                href="#projects" 
                className={`${styles.button} ${styles.primary}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                View Projects
              </motion.a>
              <motion.a 
                href="#contact" 
                className={`${styles.button} ${styles.secondary}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Contact Me
              </motion.a>
            </motion.div>
            
            <motion.div className={styles.socialLinks} variants={itemVariants}>
              <motion.a 
                href="https://www.linkedin.com/in/arkalal/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className={styles.socialLink}
                whileHover={{ y: -5, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaLinkedin size={22} />
              </motion.a>
              <motion.a 
                href="https://github.com/arkalal" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className={styles.socialLink}
                whileHover={{ y: -5, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaGithub size={22} />
              </motion.a>
              <motion.a 
                href="https://x.com/arka_codes" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter/X Profile"
                className={styles.socialLink}
                whileHover={{ y: -5, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaXTwitter size={20} />
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className={styles.scrollIndicator}
          variants={itemVariants}
          animate={{ 
            y: [0, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2
          }}
        >
          <span>Scroll Down</span>
          <FaArrowDown size={16} className={styles.scrollIcon} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default NewHero;
