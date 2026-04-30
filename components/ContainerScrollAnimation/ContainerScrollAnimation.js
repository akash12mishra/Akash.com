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

  const cardStyle = isMobile
    ? undefined
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
