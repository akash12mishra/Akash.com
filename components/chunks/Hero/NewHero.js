"use client";

import React, { useEffect, useRef } from "react";
import styles from "./NewHero.module.scss";
import Image from "next/image";
import Typewriter from "../../../utils/Typewriter";
import { FaArrowDown, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import logoImg from "../../../assets/images/arka.png";

const NewHero = () => {
  const heroRef = useRef(null);
  
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
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="home" className={styles.heroSection}>
      <div className={styles.heroBackground}>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.gridPattern}></div>
      </div>
      
      <div className={styles.container} ref={heroRef}>
        <div className={styles.content}>
          <div className={styles.avatarContainer}>
            <Image 
              src={logoImg} 
              alt="Arka Lal Chakravarty" 
              width={180} 
              height={180} 
              className={styles.avatar} 
              priority
            />
            <div className={styles.avatarGlow}></div>
          </div>
          
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              <span className={styles.greeting}>Hello, I'm</span>
              <span className={styles.name}>Arka Lal Chakravarty</span>
              <span className={styles.role}>
                <span className={styles.rolePrefix}>I'm a </span>
                <Typewriter
                  words={["AI Engineer", "Full Stack Developer", "Automation Architect"]}
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={2000}
                  cursorStyle="|"
                />
              </span>
            </h1>
            
            <p className={styles.description}>
              Building powerful AI & SaaS experiences that drive results and help businesses grow.
              Specializing in advanced AI integrations, high-performance websites, and custom automations.
            </p>
            
            <div className={styles.actionButtons}>
              <a 
                href="#resume" 
                className={`${styles.button} ${styles.primary}`}
              >
                View Resume
              </a>
              <a 
                href="#contact" 
                className={`${styles.button} ${styles.secondary}`}
              >
                Contact Me
              </a>
            </div>
            
            <div className={styles.socialLinks}>
              <a 
                href="https://www.linkedin.com/in/arkalal/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className={styles.socialLink}
              >
                <FaLinkedin size={22} />
              </a>
              <a 
                href="https://x.com/arka_codes" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter/X Profile"
                className={styles.socialLink}
              >
                <FaXTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className={styles.scrollIndicator}>
          <span>Scroll Down</span>
          <FaArrowDown size={16} className={styles.scrollIcon} />
        </div>
      </div>
    </section>
  );
};

export default NewHero;
