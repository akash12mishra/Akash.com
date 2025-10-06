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
  const avatarRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      // Keep the hero section fully visible with no fade or movement animations
      heroRef.current.style.opacity = 1;
      heroRef.current.style.transform = 'none';
    };
    
    // Store current hover state to avoid conflicts with mouse move effect
    let isHovering = false;
    
    // Store ref value to fix lint warning
    const currentAvatarRef = avatarRef.current;
    
    // Disable mouse move effect completely to avoid any conflicts with hover
    // This ensures the hover animation works perfectly without any interference
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);
  
  // Optimize animations for mobile
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: isMobile ? 0.05 : 0.2, // Reduce stagger time on mobile
        delayChildren: isMobile ? 0.1 : 0.3,   // Reduce delay on mobile
        duration: isMobile ? 0.3 : 0.5         // Faster animations on mobile
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: isMobile ? "tween" : "spring", // Use simpler animation type on mobile
        stiffness: isMobile ? 50 : 100,    // Reduce spring stiffness on mobile
        damping: isMobile ? 15 : 10,       // Increase damping on mobile for quicker settle
        duration: isMobile ? 0.2 : 0.3      // Shorter animation duration on mobile
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
        transition={{ duration: isMobile ? 0.2 : 0.5 }} // Faster transitions on mobile
      >
        <motion.div className={styles.content} variants={containerVariants}>
          <motion.div 
            className={styles.avatarContainer}
            ref={avatarRef}
            variants={itemVariants}
            animate={{ scale: 1 }}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ 
              type: "tween", 
              ease: [0.25, 0.1, 0.25, 1],
              duration: 0.4,
            }}
            style={{
              transformOrigin: "center center",
              transform: "perspective(1000px)"
            }}
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
