"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import styles from "./BuildInPublicCarousel.module.scss";

import linkPost1 from "../../../assets/images/Socials/linkPost1.png";
import linkPost2 from "../../../assets/images/Socials/linkPost2.png";
import linkPost3 from "../../../assets/images/Socials/linkPost3.png";
import xPost1 from "../../../assets/images/Socials/xPost1.png";
import xPost2 from "../../../assets/images/Socials/xPost2.png";
import xPost3 from "../../../assets/images/Socials/xPost3.png";
import xPost4 from "../../../assets/images/Socials/xPost4.png";

const posts = [
  {
    image: linkPost1,
    platform: "linkedin",
    title: "The harsh truth about SaaS MVPs",
    summary:
      "Most SaaS MVPs fail because founders polish ideas in Figma for months. By launch, the market has already moved on. Build fast, ship rough, iterate in public.",
    link: "https://www.linkedin.com/posts/arkalal_the-harsh-truth-about-building-saas-mvps-activity-7381168964229513216-w0RJ",
  },
  {
    image: xPost1,
    platform: "x",
    title: "Ship weekly, not quarterly",
    summary:
      "Most AI SaaS founders talk big but ship slow. The real formula: Idea → MVP → Feedback → Iterate. Weeks, not months. Validation beats planning, every time.",
    link: "https://x.com/arka_codes/status/1983773028132462664",
  },
  {
    image: linkPost2,
    platform: "linkedin",
    title: "AI-augmented engineers are the new 10×",
    summary:
      "Developers who master AI-augmented workflows are becoming 5× more effective. The edge isn't typing fast — it's prompting smart, architecting cleanly, and pair-programming with an AI that knows your codebase.",
    link: "https://www.linkedin.com/posts/arkalal_ive-seen-a-shift-in-how-developers-activity-7383524420293890048-2HJG",
  },
  {
    image: xPost2,
    platform: "x",
    title: "Junior devs + AI > slow seniors",
    summary:
      "Developers in 2025 will ship 5× faster when they pair founder-mode thinking with AI-powered execution. Slow engineers aren't getting replaced by AI — they're getting replaced by devs who know how to build with it.",
    link: "https://x.com/arka_codes/status/1982832159036432523",
  },
  {
    image: linkPost3,
    platform: "linkedin",
    title: "A production-ready SaaS in ≤21 days",
    summary:
      "Building a scalable SaaS MVP isn't about writing code — it's about designing systems that don't break when success hits. Next.js App Router + MongoDB + edge APIs = founder-friendly production launches.",
    link: "https://www.linkedin.com/posts/arkalal_building-a-scalable-saas-mvp-isnt-just-about-activity-7393490086593605632-sdBk",
  },
  {
    image: xPost3,
    platform: "x",
    title: "Direction over typing",
    summary:
      "The AI shift isn't about writing code — it's about directing it. Learn to build with AI, own the end-to-end loop, and you'll outship teams ten times your size.",
    link: "https://x.com/arka_codes/status/1982605665861554439",
  },
  {
    image: xPost4,
    platform: "x",
    title: "Stop waiting, start validating",
    summary:
      "Sitting on a SaaS idea? Stop waiting for perfect conditions. The fastest validation is to build, test, and iterate in public. The founders shipping weekly are the ones winning.",
    link: "https://x.com/arka_codes/status/1975422072433017024",
  },
];

const AUTOPLAY_INTERVAL = 3000;

function calculateGap(width) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return (
    minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
  );
}

const PlatformIcon = ({ platform }) =>
  platform === "linkedin" ? <FaLinkedin /> : <FaXTwitter />;

const platformLabel = (platform) =>
  platform === "linkedin" ? "LinkedIn" : "X (Twitter)";

const BuildInPublicCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);
  const imageContainerRef = useRef(null);

  const total = useMemo(() => posts.length, []);
  const activePost = posts[activeIndex];

  useEffect(() => {
    const handleResize = () => {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [total]);

  const getImageStyle = (index) => {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + total) % total === index;
    const isRight = (activeIndex + 1) % total === index;

    const centerBase = "translate(-50%, -50%)";
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `${centerBase} translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `${centerBase} translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `${centerBase} translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transform: `${centerBase} scale(0.7)`,
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section id="buildinpublic" className={styles.buildinPublicSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>#Build_in_Public</span>
          <h2 className={styles.heading}>Building in public.</h2>
          <p className={styles.subheading}>
            A live feed of what I&apos;m shipping, the lessons, and the
            experiments — straight from my LinkedIn and X.
          </p>
        </div>

        <div className={styles.testimonialContainer}>
          <div className={styles.testimonialGrid}>
            <div className={styles.imageContainer} ref={imageContainerRef}>
              {posts.map((post, index) => (
                <div
                  key={index}
                  className={`${styles.cardFrame} ${styles[post.platform]}`}
                  style={{
                    ...getImageStyle(index),
                    "--aspect": post.image.width / post.image.height,
                  }}
                >
                  <img
                    src={post.image.src}
                    alt={post.title}
                    className={styles.cardImage}
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            <div className={styles.testimonialContent}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div
                    className={`${styles.platformBadge} ${styles[activePost.platform]}`}
                  >
                    <PlatformIcon platform={activePost.platform} />
                    <span>{platformLabel(activePost.platform)}</span>
                  </div>

                  <h3 className={styles.postTitle}>{activePost.title}</h3>

                  <motion.p className={styles.postSummary}>
                    {activePost.summary.split(" ").map((word, i) => (
                      <motion.span
                        key={`${activeIndex}-${i}`}
                        initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.22,
                          ease: "easeInOut",
                          delay: 0.02 * i,
                        }}
                        style={{ display: "inline-block" }}
                      >
                        {word}&nbsp;
                      </motion.span>
                    ))}
                  </motion.p>

                  <a
                    href={activePost.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.postLink}
                  >
                    <span>View original post</span>
                    <FiExternalLink />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildInPublicCarousel;
