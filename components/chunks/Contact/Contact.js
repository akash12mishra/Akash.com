"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Contact.module.scss";
import {
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaCalendarAlt,
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    status: null, // null, 'submitting', 'success', 'error'
    message: "",
  });

  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ status: "submitting", message: "Sending your message..." });

    // This is a placeholder for form submission
    // In a real implementation, you would send the data to a backend
    setTimeout(() => {
      setFormStatus({
        status: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <section id="contact" className={styles.contactSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Contact</span>
          <h2 className={styles.sectionTitle}>Get In Touch</h2>
          <p className={styles.sectionDescription}>
            Have a project in mind or want to discuss collaboration
            opportunities? Feel free to reach out!
          </p>
        </div>

        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <div className={styles.iconContainer}>
                <FaEnvelope />
              </div>
              <h3>Email</h3>
              <p>arkalal.chakravarty@gmail.com</p>
              <a
                href="mailto:arkalal.chakravarty@gmail.com"
                className={styles.contactButton}
              >
                Send Email
              </a>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconContainer}>
                <FaCalendarAlt />
              </div>
              <h3>Schedule a Call</h3>
              <p>Book a time slot that works for you</p>
              <a
                href="https://calendly.com/arkalal-chakravarty/30min"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactButton}
              >
                Book a Meeting
              </a>
            </div>

            <div className={styles.socialsContainer}>
              <h3>Connect with me</h3>
              <div className={styles.socialIcons}>
                <a
                  href="https://www.linkedin.com/in/arkalal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://x.com/arka_codes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://github.com/arkalal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                >
                  <FaGithub />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
