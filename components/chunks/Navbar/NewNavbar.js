"use client";

import React, { useState, useEffect } from "react";
import styles from "./NewNavbar.module.scss";
import Image from "next/image";
import logoImg from "../../../assets/images/arka.png";
import { FaGithub } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
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
    { name: "Resume", href: "#resume" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Link href="/">
            <Image src={logoImg} alt="Arka Lal Chakravarty" className={styles.logo} width={50} height={50} />
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
            <button 
              className={styles.themeToggle} 
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>
            
            <a 
              href="https://github.com/arkalal" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.githubButton}
            >
              <FaGithub size={20} />
              <span>Follow</span>
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className={styles.mobileMenuButton} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <div className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ''}`}></div>
          <div className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ''}`}></div>
          <div className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ''}`}></div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${styles.mobileNav} ${mobileMenuOpen ? styles.open : ''}`}>
        <ul className={styles.mobileNavLinks}>
          {navLinks.map((link, index) => (
            <li key={index} onClick={() => setMobileMenuOpen(false)}>
              <a href={link.href}>{link.name}</a>
            </li>
          ))}
          <li className={styles.mobileActions}>
            <button 
              className={styles.mobileThemeToggle} 
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
              <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
            </button>
            
            <a 
              href="https://github.com/arkalal" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.mobileGithubButton}
            >
              <FaGithub size={20} />
              <span>Follow on GitHub</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NewNavbar;
