"use client";

import React from "react";
import styles from "./NewFooter.module.scss";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

const NewFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.branding}>
            <h3>Arka Lal Chakravarty</h3>
            <p>Full Stack Engineer & AI Enthusiast</p>
          </div>

          <div className={styles.navLinks}>
            <div className={styles.linksColumn}>
              <h4>Navigation</h4>
              <ul>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#experience">Experience</a>
                </li>
              </ul>
            </div>
            <div className={styles.linksColumn}>
              <h4>Work</h4>
              <ul>
                <li>
                  <a href="#projects">Projects</a>
                </li>
                <li>
                  <a href="#buildinpublic">Journey</a>
                </li>
                <li>
                  <a href="#resume">Resume</a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.socialLinks}>
            <h4>Connect</h4>
            <div className={styles.socialIcons}>
              <a
                href="https://www.linkedin.com/in/arkalal/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://x.com/arka_codes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://github.com/arkalal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} Arka Lal Chakravarty. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="/privacy-policy">Privacy Policy</a>
            <span className={styles.divider}>•</span>
            <a href="/terms">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
