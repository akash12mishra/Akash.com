"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./BuildInPublicCarousel.module.scss";
import Image from "next/image";
import { FaTwitter, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// LinkedIn post images
import linkPost1 from "../../../assets/images/Socials/linkPost1.png";
import linkPost2 from "../../../assets/images/Socials/linkPost2.png";
import linkPost3 from "../../../assets/images/Socials/linkPost3.png";

// Twitter/X post images
import xPost1 from "../../../assets/images/Socials/xPost1.png";
import xPost2 from "../../../assets/images/Socials/xPost2.png";
import xPost3 from "../../../assets/images/Socials/xPost3.png";

const linkedInPosts = [
  {
    id: 1,
    image: linkPost1,
    link: "https://www.linkedin.com/posts/arkalal_saas-ai-startups-activity-7365767471435345921-G37X?utm_source=share&utm_medium=member_desktop&rcm=ACoAACEK0AwBq29eqk-Q-7_FsDHB32Yxq4h0p_s",
    platform: "LinkedIn",
  },
  {
    id: 2,
    image: linkPost2,
    link: "https://www.linkedin.com/posts/arkalal_ai-mvpdevelopment-softwareengineering-activity-7365586268459626496-5UV-?utm_source=share&utm_medium=member_desktop&rcm=ACoAACEK0AwBq29eqk-Q-7_FsDHB32Yxq4h0p_s",
    platform: "LinkedIn",
  },
  {
    id: 3,
    image: linkPost3,
    link: "https://www.linkedin.com/posts/arkalal_ai-saas-chromeextension-activity-7364635102699548673-QeJV?utm_source=share&utm_medium=member_desktop&rcm=ACoAACEK0AwBq29eqk-Q-7_FsDHB32Yxq4h0p_s",
    platform: "LinkedIn",
  },
  // Duplicate posts for infinite scrolling effect
  {
    id: 4,
    image: linkPost1,
    link: "https://www.linkedin.com/posts/arkalal_saas-ai-startups-activity-7365767471435345921-G37X?utm_source=share&utm_medium=member_desktop&rcm=ACoAACEK0AwBq29eqk-Q-7_FsDHB32Yxq4h0p_s",
    platform: "LinkedIn",
  },
  {
    id: 5,
    image: linkPost2,
    link: "https://www.linkedin.com/posts/arkalal_ai-mvpdevelopment-softwareengineering-activity-7365586268459626496-5UV-?utm_source=share&utm_medium=member_desktop&rcm=ACoAACEK0AwBq29eqk-Q-7_FsDHB32Yxq4h0p_s",
    platform: "LinkedIn",
  },
  {
    id: 6,
    image: linkPost3,
    link: "https://www.linkedin.com/posts/arkalal_ai-saas-chromeextension-activity-7364635102699548673-QeJV?utm_source=share&utm_medium=member_desktop&rcm=ACoAACEK0AwBq29eqk-Q-7_FsDHB32Yxq4h0p_s",
    platform: "LinkedIn",
  },
  // Additional duplicates for smoother infinite effect
  {
    id: 7,
    image: linkPost1,
    link: "https://www.linkedin.com/posts/arkalal_saas-ai-startups-activity-7365767471435345921-G37X?utm_source=share&utm_medium=member_desktop&rcm=ACoAACEK0AwBq29eqk-Q-7_FsDHB32Yxq4h0p_s",
    platform: "LinkedIn",
  },
  {
    id: 8,
    image: linkPost2,
    link: "https://www.linkedin.com/posts/arkalal_ai-mvpdevelopment-softwareengineering-activity-7365586268459626496-5UV-?utm_source=share&utm_medium=member_desktop&rcm=ACoAACEK0AwBq29eqk-Q-7_FsDHB32Yxq4h0p_s",
    platform: "LinkedIn",
  },
  {
    id: 9,
    image: linkPost3,
    link: "https://www.linkedin.com/posts/arkalal_ai-saas-chromeextension-activity-7364635102699548673-QeJV?utm_source=share&utm_medium=member_desktop&rcm=ACoAACEK0AwBq29eqk-Q-7_FsDHB32Yxq4h0p_s",
    platform: "LinkedIn",
  },
];

const twitterPosts = [
  {
    id: 1,
    image: xPost1,
    link: "https://x.com/arka_codes/status/1959639336426570178",
    platform: "Twitter",
  },
  {
    id: 2,
    image: xPost2,
    link: "https://x.com/arka_codes/status/1959458143244886277",
    platform: "Twitter",
  },
  {
    id: 3,
    image: xPost3,
    link: "https://x.com/arka_codes/status/1958422709966188795",
    platform: "Twitter",
  },
  // Duplicate posts for infinite scrolling effect
  {
    id: 4,
    image: xPost1,
    link: "https://x.com/arka_codes/status/1959639336426570178",
    platform: "Twitter",
  },
  {
    id: 5,
    image: xPost2,
    link: "https://x.com/arka_codes/status/1959458143244886277",
    platform: "Twitter",
  },
  {
    id: 6,
    image: xPost3,
    link: "https://x.com/arka_codes/status/1958422709966188795",
    platform: "Twitter",
  },
  // Additional duplicates for smoother infinite effect
  {
    id: 7,
    image: xPost1,
    link: "https://x.com/arka_codes/status/1959639336426570178",
    platform: "Twitter",
  },
  {
    id: 8,
    image: xPost2,
    link: "https://x.com/arka_codes/status/1959458143244886277",
    platform: "Twitter",
  },
  {
    id: 9,
    image: xPost3,
    link: "https://x.com/arka_codes/status/1958422709966188795",
    platform: "Twitter",
  },
];

const BuildInPublicCarousel = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // No animation controls for posts - using CSS animations instead

  // No animation controls for Twitter posts - will use CSS animation instead

  return (
    <section
      id="buildinpublic"
      className={styles.buildinPublicSection}
      ref={ref}
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>#buildinpublic</span>
          <h2 className={styles.sectionTitle}>My Journey</h2>
          <p className={styles.sectionDescription}>
            Experience my unwavering dedication to building innovative projects
            and sharing every milestone in real-time on X and LinkedIn.
          </p>
        </div>

        <div className={styles.carouselContainer}>
          {/* LinkedIn Posts Row */}
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

          <div className={styles.marqueeContainer}>
            <div className={styles.marqueeRow}>
              <div className={styles.marqueeTrackLeft}>
                {/* First set of LinkedIn posts */}
                {linkedInPosts.map((post) => (
                  <div key={`first-${post.id}`} className={styles.postCard}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={post.image}
                        alt="LinkedIn post"
                        width={380}
                        height={230}
                        className={styles.postImage}
                        priority={post.id === 1}
                      />
                      <div className={styles.overlay}>
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewButton}
                        >
                          View Post
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Second set of LinkedIn posts (duplicate for seamless loop) */}
                {linkedInPosts.map((post) => (
                  <div key={`second-${post.id}`} className={styles.postCard}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={post.image}
                        alt="LinkedIn post"
                        width={380}
                        height={230}
                        className={styles.postImage}
                      />
                      <div className={styles.overlay}>
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewButton}
                        >
                          View Post
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Twitter/X Posts Row */}
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

          <div className={styles.marqueeContainer}>
            <div className={styles.marqueeRow}>
              <div className={styles.marqueeTrack}>
                {/* First set of posts */}
                {twitterPosts.map((post) => (
                  <div key={`first-${post.id}`} className={styles.postCard}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={post.image}
                        alt="Twitter post"
                        width={380}
                        height={230}
                        className={styles.postImage}
                        priority={post.id === 1}
                      />
                      <div className={styles.overlay}>
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewButton}
                        >
                          View Post
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Second set of posts (duplicate for seamless loop) */}
                {twitterPosts.map((post) => (
                  <div key={`second-${post.id}`} className={styles.postCard}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={post.image}
                        alt="Twitter post"
                        width={380}
                        height={230}
                        className={styles.postImage}
                      />
                      <div className={styles.overlay}>
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewButton}
                        >
                          View Post
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildInPublicCarousel;
