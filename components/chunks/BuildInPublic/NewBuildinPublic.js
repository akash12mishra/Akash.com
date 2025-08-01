"use client";

import React, { useRef, useEffect } from "react";
import styles from "./NewBuildinPublic.module.scss";
import Image from "next/image";
import { FaTwitter, FaLinkedin } from "react-icons/fa";
import linkPost1 from "../../../assets/images/Socials/linkPost1.png";
import linkPost2 from "../../../assets/images/Socials/linkPost2.png";
import linkPost3 from "../../../assets/images/Socials/linkPost3.png";
import xPost1 from "../../../assets/images/Socials/xPost1.png";
import xPost2 from "../../../assets/images/Socials/xPost2.png";
import xPost3 from "../../../assets/images/Socials/xPost3.png";

const linkedInPosts = [
  {
    id: 1,
    image: linkPost1,
    link: "https://www.linkedin.com/in/arkalal/",
    platform: "LinkedIn",
  },
  {
    id: 2,
    image: linkPost2,
    link: "https://www.linkedin.com/in/arkalal/",
    platform: "LinkedIn",
  },
  {
    id: 3,
    image: linkPost3,
    link: "https://www.linkedin.com/in/arkalal/",
    platform: "LinkedIn",
  },
];

const twitterPosts = [
  {
    id: 4,
    image: xPost1,
    link: "https://x.com/arka_codes",
    platform: "Twitter",
  },
  {
    id: 5,
    image: xPost2,
    link: "https://x.com/arka_codes",
    platform: "Twitter",
  },
  {
    id: 6,
    image: xPost3,
    link: "https://x.com/arka_codes",
    platform: "Twitter",
  },
];

const NewBuildinPublic = () => {
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
    <section id="buildinpublic" className={styles.buildinPublicSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>#buildinpublic</span>
          <h2 className={styles.sectionTitle}>My Journey</h2>
          <p className={styles.sectionDescription}>
            Experience my unwavering dedication to building innovative projects
            and sharing every milestone in real-time on X and LinkedIn.
          </p>
        </div>

        <div className={styles.platformsContainer}>
          <div className={styles.platformCard}>
            <div className={styles.platformHeader}>
              <FaLinkedin className={styles.platformIcon} />
              <h3>LinkedIn Updates</h3>
              <a
                href="https://www.linkedin.com/in/arkalal/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.followButton}
              >
                Follow
              </a>
            </div>
            <div className={styles.postsContainer}>
              {linkedInPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.postCard}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={post.image}
                      alt="LinkedIn post"
                      layout="fill"
                      objectFit="cover"
                      className={styles.postImage}
                      priority={post.id === 1}
                    />
                    <div className={styles.overlay}>
                      <span className={styles.viewPost}>View Post</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className={styles.platformCard}>
            <div className={styles.platformHeader}>
              <FaTwitter className={styles.platformIcon} />
              <h3>X/Twitter Updates</h3>
              <a
                href="https://x.com/arka_codes"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.followButton}
              >
                Follow
              </a>
            </div>
            <div className={styles.postsContainer}>
              {twitterPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.postCard}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={post.image}
                      alt="Twitter post"
                      layout="fill"
                      objectFit="cover"
                      className={styles.postImage}
                      priority={post.id === 4}
                    />
                    <div className={styles.overlay}>
                      <span className={styles.viewPost}>View Post</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewBuildinPublic;
