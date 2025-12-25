"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./GlobalCollaboration.module.scss";
import { motion } from "framer-motion";
import { HiOutlineArrowRight } from "react-icons/hi";
import Image from "next/image";

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
    if (!canvasRef.current || !containerRef.current || !isInView) return;

    if (globeRef.current) return;

    let width = containerRef.current.offsetWidth;
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);

    const initGlobe = async () => {
      const createGlobe = (await import("cobe")).default;

      globeRef.current = createGlobe(canvasRef.current, {
        devicePixelRatio: pixelRatio,
        width: width * pixelRatio,
        height: width * pixelRatio,
        phi: 0,
        theta: 0.25,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 4000,
        mapBrightness: 6,
        baseColor: [0.15, 0.15, 0.15],
        markerColor: [1, 0.42, 0.21],
        glowColor: [0.08, 0.08, 0.08],
        markers: [
          { location: [22.5726, 88.3639], size: 0.06 },
          { location: [37.7749, -122.4194], size: 0.04 },
          { location: [51.5074, -0.1278], size: 0.04 },
          { location: [40.7128, -74.006], size: 0.04 },
          { location: [19.076, 72.8777], size: 0.03 },
        ],
        onRender: (state) => {
          state.phi = phiRef.current;
          phiRef.current += 0.003;
          state.width = width * pixelRatio;
          state.height = width * pixelRatio;
        },
      });
    };

    initGlobe();

    return () => {
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

  const avatarNodes = [
    { id: 1, top: "12%", left: "35%", delay: 0 },
    { id: 2, top: "18%", left: "58%", delay: 0.1 },
    { id: 3, top: "38%", left: "22%", delay: 0.2 },
    { id: 4, top: "45%", left: "72%", delay: 0.3 },
    { id: 5, top: "58%", left: "40%", delay: 0.4 },
    { id: 6, top: "65%", left: "62%", delay: 0.5 },
  ];

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
            AI products and full-stack systems with high ownership and clear
            communication.
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

        <motion.div
          className={styles.globeWrapper}
          variants={itemVariants}
          ref={containerRef}
        >
          <div className={styles.globeContainer}>
            <canvas
              ref={canvasRef}
              className={styles.globeCanvas}
              style={{
                width: "100%",
                height: "100%",
                contain: "layout paint size",
              }}
            />

            {avatarNodes.map((node) => (
              <motion.div
                key={node.id}
                className={styles.avatarNode}
                style={{ top: node.top, left: node.left }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: node.delay + 0.5,
                  duration: 0.4,
                  ease: "backOut",
                }}
              >
                <div className={styles.avatarRing}>
                  <div className={styles.avatarInner}>
                    <Image
                      src={`https://i.pravatar.cc/100?img=${node.id + 10}`}
                      alt="Team member"
                      width={40}
                      height={40}
                      className={styles.avatarImage}
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            <div className={styles.globeGradient} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default GlobalCollaboration;
