"use client";

import React, { useRef, useEffect } from "react";
import styles from "./CTASection.module.scss";
import { FaCalendarCheck } from "react-icons/fa";

const CTASection = () => {
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    const current = sectionRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);
  
  return (
    <section className={styles.ctaSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.ctaContent}>
          <h2>Ready to build something amazing?</h2>
          <p>
            Looking to hire me as your AI Engineer or Full-Stack Developer? Whether you need help with an 
            AI-powered SaaS, MVP development, or want to discuss full-time or contract opportunities, 
            I'm here to help bring your vision to life.
          </p>
          <a 
            href="https://calendly.com/arkalal-chakravarty/30min" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            <FaCalendarCheck />
            Schedule a Meeting
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
