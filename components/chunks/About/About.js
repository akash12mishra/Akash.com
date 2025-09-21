"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./About.module.scss";
import Image from "next/image";
import logoImg from "../../../assets/images/arka.png";
import { FaCode, FaLaptopCode, FaRobot } from "react-icons/fa";

const About = () => {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: isMobile ? 0.1 : 0.2 } // Lower threshold for mobile
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
  }, [isMobile]);

  return (
    <section id="about" className={styles.aboutSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          {isMobile ? (
            /* Mobile version of the button with minimal styling */
            <div className={styles.mobileTagWrapper}>
              <span className={styles.mobileSectionTag}>About Me</span>
            </div>
          ) : (
            /* Desktop version remains unchanged */
            <span className={styles.sectionTag}>About Me</span>
          )}
          <h2 className={styles.sectionTitle}>Who I Am</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <Image
              src={logoImg}
              alt="Arka Lal Chakravarty"
              width={350}
              height={350}
              className={styles.profileImage}
            />
            <div className={styles.imageBorder}></div>
          </div>

          <div className={styles.textContent}>
            <h3 className={styles.greeting}>Hi there! I&apos;m Arka</h3>
            <p className={styles.bio}>
              I&apos;m an <span>AI Engineer</span> and{" "}
              <span>Full-Stack Developer</span> with a passion for building
              advanced AI SaaS products and automations. With expertise in both
              AI integration and web development, I specialize in creating
              powerful, user-friendly applications that leverage cutting-edge
              technologies.
            </p>
            <p className={styles.bio}>
              My journey in tech has given me a unique perspective on how to
              create efficient, scalable solutions that help businesses grow.
              I&apos;m always excited to take on new challenges and bring
              innovative ideas to life.
            </p>

            <div className={styles.skillCards}>
              <div className={styles.skillCard}>
                <div className={styles.iconContainer}>
                  <FaLaptopCode className={styles.icon} />
                </div>
                <h4>Full-Stack Development</h4>
                <p>
                  Building modern, responsive web applications with the latest
                  technologies.
                </p>
              </div>

              <div className={styles.skillCard}>
                <div className={styles.iconContainer}>
                  <FaRobot className={styles.icon} />
                </div>
                <h4>AI Integration</h4>
                <p>
                  Implementing advanced AI solutions and automations for
                  practical business needs.
                </p>
              </div>

              <div className={styles.skillCard}>
                <div className={styles.iconContainer}>
                  <FaCode className={styles.icon} />
                </div>
                <h4>Product Architecture</h4>
                <p>
                  Designing scalable, maintainable systems with a focus on
                  performance and user experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
