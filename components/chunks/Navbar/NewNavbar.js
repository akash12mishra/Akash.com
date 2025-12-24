"use client";

import React, { useState, useEffect } from "react";
import styles from "./NewNavbar.module.scss";
import Image from "next/image";
import logoImg from "../../../assets/images/arka.png";
import { FaGithub, FaFileDownload, FaFileAlt } from "react-icons/fa";
import { useTheme } from "../../ThemeProvider";
import Link from "next/link";

const NewNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track scrolling for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Link href="/">
            <Image
              src={logoImg}
              alt="Arka Lal Chakravarty"
              className={styles.logo}
              width={50}
              height={50}
            />
          </Link>
          <h1 className={styles.name}>Arka Lal Chakravarty</h1>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <ul className={styles.navLinks}>
            {navLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <a
              href="https://github.com/arkalal/arkalalchakravarty.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceButton}
              title="View Source Code"
            >
              <FaGithub size={18} />
              <span>Source</span>
            </a>
            <a
              href="/assets/doc/Arka Lal Chakravarty CV - 2026.pdf"
              download="Arka_Lal_Chakravarty_CV_2026.pdf"
              className={styles.cvButton}
            >
              <FaFileDownload size={18} />
              <span>Download CV</span>
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div
            className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ""}`}
          ></div>
          <div
            className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ""}`}
          ></div>
          <div
            className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ""}`}
          ></div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`${styles.mobileNav} ${mobileMenuOpen ? styles.open : ""}`}
      >
        <ul className={styles.mobileNavLinks}>
          {navLinks.map((link, index) => (
            <li key={index} onClick={() => setMobileMenuOpen(false)}>
              <a href={link.href}>{link.name}</a>
            </li>
          ))}
          <li className={styles.mobileActions}>
            <a
              href="https://github.com/arkalal/arkalalchakravarty.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileSourceButton}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaGithub size={20} />
              <span>Source</span>
            </a>
            <a
              href="/assets/doc/Arka Lal Chakravarty CV - 2026.pdf"
              download="Arka_Lal_Chakravarty_CV_2026.pdf"
              className={styles.mobileCvButton}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaFileAlt size={20} />
              <span>Download Resume</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NewNavbar;
