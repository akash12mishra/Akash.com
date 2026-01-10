"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./GlobalCollaboration.module.scss";
import { motion } from "framer-motion";
import { HiOutlineArrowRight } from "react-icons/hi";

const floatingAvatars = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    position: { top: "8%", left: "25%" },
    delay: 0,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    position: { top: "15%", right: "20%" },
    delay: 0.2,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    position: { top: "45%", left: "2%" },
    delay: 0.4,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face",
    position: { top: "70%", right: "18%" },
    delay: 0.6,
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    position: { top: "35%", right: "5%" },
    delay: 0.3,
  },
];

const pulseAnimation = {
  initial: { scale: 1, opacity: 0.6 },
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const GlobalCollaboration = () => {
  const canvasRef = useRef(null);
  const globeRef = useRef(null);
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const phiRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !isInView) return;

    const getGlobeSize = () => {
      if (typeof window === "undefined") return 600;
      if (window.innerWidth <= 480) return 300;
      if (window.innerWidth <= 768) return 380;
      return 600;
    };

    let currentSize = getGlobeSize();

    const initGlobe = async () => {
      const createGlobe = (await import("cobe")).default;

      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }

      globeRef.current = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: currentSize * 2,
        height: currentSize * 2,
        phi: 0,
        theta: 0.25,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.15, 0.15, 0.2],
        markerColor: [1, 0.42, 0.21],
        glowColor: [0.15, 0.15, 0.2],
        markers: [
          { location: [37.7595, -122.4367], size: 0.06 },
          { location: [40.7128, -74.006], size: 0.06 },
          { location: [51.5074, -0.1278], size: 0.06 },
          { location: [35.6762, 139.6503], size: 0.06 },
          { location: [-33.8688, 151.2093], size: 0.06 },
          { location: [19.076, 72.8777], size: 0.06 },
          { location: [22.5726, 88.3639], size: 0.06 },
          { location: [1.3521, 103.8198], size: 0.06 },
        ],
        onRender: (state) => {
          state.phi = phiRef.current;
          phiRef.current += 0.003;
        },
      });
    };

    initGlobe();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newSize = getGlobeSize();
        if (newSize !== currentSize) {
          currentSize = newSize;
          initGlobe();
        }
      }, 300);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className={styles.globalSection}>
      <motion.div
        className={styles.container}
        initial={isMounted ? "hidden" : false}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className={styles.textContent}>
          <motion.h2 className={styles.headline} variants={itemVariants}>
            Building with <span className={styles.highlight}>Global Teams</span>
          </motion.h2>

          <motion.p className={styles.subheadline} variants={itemVariants}>
            I collaborate with founders and engineering teams worldwide to ship
            AI products and full-stack applications with high ownership and
            clear communication.
          </motion.p>

          <motion.div className={styles.ctaRow} variants={itemVariants}>
            <a
              href="https://calendly.com/arkalal-chakravarty/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryCta}
            >
              <span>Book a call</span>
              <HiOutlineArrowRight className={styles.ctaIcon} />
            </a>
          </motion.div>
        </div>

        <div className={styles.globeContainer} ref={containerRef}>
          <motion.div
            className={styles.globeWrapper}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <canvas
              ref={canvasRef}
              className={styles.globeCanvas}
              style={{ width: "100%", height: "100%" }}
            />

            {floatingAvatars.map((avatar) => (
              <motion.div
                key={avatar.id}
                className={styles.floatingAvatar}
                style={{
                  top: avatar.position.top,
                  left: avatar.position.left,
                  right: avatar.position.right,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        scale: 1,
                        y: [-5, 5, -5],
                      }
                    : {}
                }
                transition={{
                  opacity: { delay: avatar.delay, duration: 0.5 },
                  scale: { delay: avatar.delay, duration: 0.5 },
                  y: {
                    delay: avatar.delay + 0.5,
                    duration: 3 + avatar.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <div className={styles.avatarRing}>
                  <motion.div
                    className={styles.ringPulse}
                    variants={pulseAnimation}
                    initial="initial"
                    animate="animate"
                  />
                </div>
                <img
                  src={avatar.image}
                  alt="Team member"
                  className={styles.avatarImage}
                />
              </motion.div>
            ))}

            <div className={styles.globeGlow} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default GlobalCollaboration;
