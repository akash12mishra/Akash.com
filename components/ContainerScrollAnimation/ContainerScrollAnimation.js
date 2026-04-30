"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import "./ContainerScrollAnimation.scss";

export const ContainerScroll = ({ titleComponent, children }) => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Spring config for butter-smooth interpolation
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Raw transforms from scroll (desktop only — mobile renders the card
  // statically so the bento content is never blank on initial load and
  // child entrance animations driven by `whileInView` can fire reliably).
  const rawRotateX = useTransform(scrollYProgress, [0.05, 0.4], [35, 0]);
  const rawScale = useTransform(scrollYProgress, [0.05, 0.4], [0.8, 1.05]);
  const rawTranslateY = useTransform(
    scrollYProgress,
    [0.05, 0.4],
    [120, -40],
  );
  const rawOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

  // Apply spring physics for smooth, premium feel
  const rotateX = useSpring(rawRotateX, springConfig);
  const scale = useSpring(rawScale, springConfig);
  const translateY = useSpring(rawTranslateY, springConfig);
  const opacity = useSpring(rawOpacity, springConfig);

  // On mobile, render the card at identity values (no scroll-driven
  // animation). We must pass explicit values rather than `undefined`,
  // because framer-motion does not reliably clear previously-applied
  // inline transforms/opacity when the `style` prop changes from a
  // motion-value object to `undefined`. On real iOS/Android devices
  // the card was getting stuck at `opacity: 0` (the initial value of
  // the spring transform when scrollYProgress is at 0), making the
  // hero card invisible. Explicit identity values guarantee the DOM
  // is written with `opacity: 1` on mobile.
  const cardStyle = isMobile
    ? { rotateX: 0, scale: 1, translateY: 0, opacity: 1 }
    : { rotateX, scale, translateY, opacity };

  return (
    <div className="container-scroll" ref={containerRef}>
      {titleComponent && (
        <div className="container-scroll__title">{titleComponent}</div>
      )}
      <div className="container-scroll__perspective">
        <motion.div className="container-scroll__card" style={cardStyle}>
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default ContainerScroll;
