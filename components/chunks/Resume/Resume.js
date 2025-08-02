"use client";

import React, { useRef, useEffect } from "react";
import styles from "./Resume.module.scss";
import { FaFileDownload, FaExternalLinkAlt } from "react-icons/fa";

const Resume = () => {
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
    <section id="resume" className={styles.resumeSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Resume</span>
          <h2 className={styles.sectionTitle}>My Curriculum Vitae</h2>
          <p className={styles.sectionDescription}>
            Download my resume or view it online to learn more about my professional journey and skills.
          </p>
        </div>
        
        <div className={styles.resumeContent}>
          <div className={styles.resumeActions}>
            <a 
              href="/assets/doc/Arka resume 2024 - AI new.pdf" 
              download="Arka_Lal_Chakravarty_Resume.pdf"
              className={`${styles.resumeButton} ${styles.downloadButton}`}
            >
              <FaFileDownload /> Download Resume
            </a>
          </div>
          

        </div>
      </div>
    </section>
  );
};

export default Resume;
