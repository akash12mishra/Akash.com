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
      const scrollTop = window.scrollY;
      
      // Completely disable scroll animations on smaller mobile devices
      if (isMobile && window.innerWidth <= 480) {
        // Just ensure hero is fully visible with no animation effects
        heroRef.current.style.opacity = 1;
        heroRef.current.style.transform = 'none';
        return;
      }
      
      // Use different fade rates for mobile and desktop
      // On mobile: slower fade, larger minimum threshold
      // On desktop: faster fade, smaller threshold
      const mobileScrollThreshold = 150; // Increased threshold for mobile
      const desktopScrollThreshold = 30; // Min scroll before fading on desktop
      
      const threshold = isMobile ? mobileScrollThreshold : desktopScrollThreshold;
      const fadeRate = isMobile ? 0.0004 : 0.002; // Much slower fade on mobile (halved)
      const moveRate = isMobile ? 0.08 : 0.3; // Much slower movement on mobile
      
      // Only start fading after the threshold
      let opacity = 1;
      let translateY = 0;
      
      if (scrollTop > threshold) {
        // Calculate based on scroll position beyond threshold
        const adjustedScroll = scrollTop - threshold;
        opacity = 1 - (adjustedScroll * fadeRate);
        translateY = adjustedScroll * moveRate;
      }
      
      if (heroRef.current) {
        heroRef.current.style.opacity = Math.max(opacity, 0.3); // Never fade below 30% opacity
        heroRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };
    
    // Handle mouse move without triggering state updates that cause re-renders
    const handleMouseMove = (e) => {
      // Skip mouse move animations completely on mobile devices
      if (isMobile || !avatarRef.current) return;
      
      const { clientX, clientY } = e;
      mousePositionRef.current = {
        x: (clientX / window.innerWidth - 0.5) * 20,
        y: (clientY / window.innerHeight - 0.5) * 20
      };
      
      // Apply the transform directly to the DOM element
      if (avatarRef.current) {
        avatarRef.current.style.transform = `perspective(1000px) rotateY(${mousePositionRef.current.x}deg) rotateX(${-mousePositionRef.current.y}deg)`;
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
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
