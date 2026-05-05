"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./TechStack.module.scss";
import {
  SiNextdotjs,
  SiVercel,
  SiMongodb,
  SiOpenai,
  SiNodedotjs,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiSass,
  SiGit,
  SiPython,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const TECH_ITEMS = [
  { icon: SiNextdotjs, name: "Next.js", color: "#000000" },
  { icon: SiVercel, name: "Vercel", color: "#000000" },
  { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
  { icon: SiOpenai, name: "OpenAI", color: "#412991" },
  { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
  { icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" },
  { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
  { icon: SiReact, name: "React", color: "#61DAFB" },
  { icon: SiSass, name: "SASS", color: "#CC6699" },
  { icon: SiGit, name: "Git", color: "#F05032" },
  { icon: FaAws, name: "AWS", color: "#FF9900" },
  { icon: SiPython, name: "Python", color: "#3776AB" },
];

const TOTAL = TECH_ITEMS.length;
const SETS = 3;
const MAX_SCROLL = 600;
const DELTA_CLAMP = 25;
const lerp = (a, b, t) => a * (1 - t) + b * t;

// Touch-primary device check: pointer:coarse means the user's primary
// input is a finger (true mobile/tablet). Hybrid devices like
// touchscreen laptops report pointer:fine and stay on the desktop path.
const detectTouchPrimary = () => {
  if (typeof window === "undefined") return false;
  if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return true;
  return false;
};

// --- Icon Card ---
const TechIconCard = ({ tech, target }) => {
  const Icon = tech.icon;
  return (
    <motion.div
      className={styles.morphCard}
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: "spring", stiffness: 150, damping: 20,
        opacity: { type: "tween", duration: 0.05 },
      }}
    >
      <div
        className={styles.morphCardIcon}
        style={{
          boxShadow: `0 4px 18px ${tech.color}22, 0 1px 6px rgba(0,0,0,0.06)`,
        }}
      >
        <Icon size={24} style={{ color: tech.color }} />
      </div>
    </motion.div>
  );
};

// --- Main ---
const TechStack = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  // Decide once at mount which scroll mechanism to use. Desktop keeps
  // the proven IO + Lenis-stop + virtual-scroll wheel/touch path that
  // shipped previously. Touch-primary devices use a ScrollTrigger pin
  // — Lenis ↔ ScrollTrigger is already wired up in SmoothScroll, and
  // ScrollTrigger doesn't body-lock or corrupt Lenis state, so it
  // avoids the iOS momentum-scroll, spring-lag, and snap-to-top
  // problems that the desktop path runs into on mobile hardware.
  const [isTouchDevice] = useState(detectTouchPrimary);

  // Desktop-path state/refs. Unused on the mobile path but cheap to
  // declare unconditionally so the hooks rules stay satisfied.
  const [isPinned, setIsPinned] = useState(false);
  const isPinnedRef = useRef(false);
  const morphValRef = useRef(0);
  const scrollRef = useRef(0);
  const virtualScroll = useMotionValue(0);

  // --- Container size (both paths) ---
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        setContainerSize({ width: e.contentRect.width, height: e.contentRect.height });
      }
    });
    ro.observe(el);
    setContainerSize({ width: el.offsetWidth, height: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  // --- Pin / Unpin (desktop path) ---
  const pinSection = useCallback(() => {
    if (isPinnedRef.current) return;
    isPinnedRef.current = true;
    setIsPinned(true);
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.stop();
    }
  }, []);

  const unpinSection = useCallback(() => {
    if (!isPinnedRef.current) return;
    isPinnedRef.current = false;
    setIsPinned(false);
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.start();
    }
  }, []);

  // --- Desktop: IntersectionObserver (direction-aware) ---
  useEffect(() => {
    if (isTouchDevice) return;
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.95) {
          pinSection();
        }
        if (!entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          if (rect.top < 0) {
            scrollRef.current = MAX_SCROLL;
            virtualScroll.set(MAX_SCROLL);
          } else {
            scrollRef.current = 0;
            virtualScroll.set(0);
          }
          unpinSection();
        }
      },
      { threshold: [0, 0.95] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isTouchDevice, pinSection, unpinSection, virtualScroll]);

  // --- Desktop: Wheel / Touch handlers with delta clamping ---
  useEffect(() => {
    if (isTouchDevice) return;
    const handleWheel = (e) => {
      if (!isPinnedRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      const rawDelta = e.deltaY;
      const current = scrollRef.current;

      if (current <= 0 && rawDelta < 0 && morphValRef.current < 0.02) { unpinSection(); return; }
      if (current >= MAX_SCROLL && rawDelta > 0 && morphValRef.current > 0.98) { unpinSection(); return; }

      const delta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), DELTA_CLAMP);
      const next = Math.min(Math.max(current + delta, 0), MAX_SCROLL);
      scrollRef.current = next;
      virtualScroll.set(next);
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e) => {
      if (!isPinnedRef.current) return;

      const rawDy = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;

      const current = scrollRef.current;
      if (current <= 0 && rawDy < 0 && morphValRef.current < 0.02) { unpinSection(); return; }
      if (current >= MAX_SCROLL && rawDy > 0 && morphValRef.current > 0.98) { unpinSection(); return; }

      e.preventDefault();
      const dy = Math.sign(rawDy) * Math.min(Math.abs(rawDy), DELTA_CLAMP);
      const next = Math.min(Math.max(current + dy, 0), MAX_SCROLL);
      scrollRef.current = next;
      virtualScroll.set(next);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.start();
      }
    };
  }, [isTouchDevice, virtualScroll, unpinSection]);

  // --- Morph: circle → line (scroll 0→400) ---
  // Spring-smoothed value drives the desktop path's visuals AND its
  // pin-release boundary check. Mobile path drives morphVal directly
  // via ScrollTrigger so the spring is unused there.
  const morphProgress = useTransform(virtualScroll, [0, 400], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 120, damping: 30 });

  const [morphVal, setMorphVal] = useState(0);
  useEffect(() => {
    if (isTouchDevice) return;
    return smoothMorph.on("change", (v) => {
      setMorphVal(v);
      morphValRef.current = v;
    });
  }, [isTouchDevice, smoothMorph]);

  // --- Mobile: ScrollTrigger pin ---
  // Same pattern Projects and Contact already use successfully here.
  // Driven by real document scroll via the Lenis ↔ ScrollTrigger
  // integration in SmoothScroll. No body lock, no manual handlers, no
  // virtual-scroll spring lag — so iOS momentum scroll can't fly past
  // the section, the morph progresses 1:1 with each swipe, and pin
  // release continues into the next section without snapping to top.
  // Morph runs over the first 70% of the pin (circle → line); the
  // remaining 30% is the marquee phase before pin releases.
  useEffect(() => {
    if (!isTouchDevice) return;
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight}`,
      pin: true,
      // Lenis uses native window scroll, so pinType:"fixed" matches
      // ProjectShowcase's rationale — "transform" introduces sub-pixel
      // vibration under native-scroll smooth scrollers like Lenis.
      pinType: "fixed",
      pinSpacing: true,
      anticipatePin: 1,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setMorphVal(Math.min(1, self.progress / 0.7));
      },
    });

    return () => trigger.kill();
  }, [isTouchDevice]);

  // Header transitions — derived from morphVal state so both paths
  // produce the same reveal regardless of which mechanism is driving
  // morphVal. (Desktop previously used motion-value transforms here;
  // collapsing to plain state values keeps behavior identical and
  // avoids needing a parallel mobile-only transform chain.)
  const contentOpacity = Math.max(0, Math.min(1, (morphVal - 0.8) / 0.2));
  const contentY = lerp(20, 0, contentOpacity);

  // Line fully formed — start marquee scrolling
  const lineFormed = morphVal > 0.98;

  // Computed layout values
  const isSmallMobile = containerSize.width < 480;
  const isMobile = containerSize.width < 768;
  const isTablet = containerSize.width < 1024;
  const spacing = isMobile ? 56 : 72;
  const oneSetWidth = TOTAL * spacing;
  // Circle radius — bigger on mobile so the icons spread further out
  // and don't crowd the centre "My Tech Stack" text. Capped by the
  // viewport via maxR inside getTarget so it never escapes the stage.
  const baseCircleR = isSmallMobile ? 135 : isMobile ? 150 : isTablet ? 180 : 200;
  // Stage height — just tall enough for the icon circle plus a small
  // breathing margin above and below. The stage is a flex item now,
  // so this also implicitly defines how much vertical room the icons
  // get in the section.
  const stageHeight = baseCircleR * 2 + 80;

  // Edge mask — fades in as line forms (doesn't affect circle since icons are centered)
  const showMask = morphVal > 0.5;

  // --- Position: circle → horizontal line (unified 3-set system) ---
  const getTarget = (setIndex, itemIndex) => {
    const cw = containerSize.width;

    // Global position in the 3-set line
    const globalIndex = setIndex * TOTAL + itemIndex;
    const centerIndex = (SETS * TOTAL - 1) / 2;
    const lineX = (globalIndex - centerIndex) * spacing;
    // Line collapses to the centre of the stage (which is now a
    // flex-laid-out band right under the header) — no Y offset needed.
    const lineY = 0;

    if (setIndex === 1) {
      // Main set (center) — morphs from circle to its line position.
      // Bound the radius to fit the actual stage rather than the full
      // section, so the icons don't escape the stage at any breakpoint.
      const maxR = Math.min(cw / 2 - 40, stageHeight / 2 - 26);
      const circleR = Math.min(maxR, baseCircleR);
      const cAngle = (itemIndex / TOTAL) * 360;
      const cRad = (cAngle * Math.PI) / 180;

      const circlePos = {
        x: Math.cos(cRad) * circleR,
        y: Math.sin(cRad) * circleR,
        rotation: cAngle + 90,
      };

      return {
        x: lerp(circlePos.x, lineX, morphVal),
        y: lerp(circlePos.y, lineY, morphVal),
        rotation: lerp(circlePos.rotation, 0, morphVal),
        scale: 1,
        opacity: 1,
      };
    } else {
      // Side sets — only visible when line is fully formed
      const extraOpacity = morphVal < 0.9 ? 0 : Math.min(1, (morphVal - 0.9) / 0.08);
      return {
        x: lineX,
        y: lineY,
        rotation: 0,
        scale: 1,
        opacity: extraOpacity,
      };
    }
  };

  // Intro header
  const introHeaderShow = morphVal < 0.4;
  const introHeaderOpacity = Math.max(0, 1 - morphVal * 3);

  return (
    <section id="tech-stack" className={styles.techStackSection} ref={sectionRef}>
      <div className={styles.container} ref={containerRef}>
        {/* Section header — sits above the stage in flex flow, fades in during morph */}
        <motion.div className={styles.arcHeader} style={{ opacity: contentOpacity, y: contentY }}>
          <span className={styles.sectionTag}>Technologies</span>
          <h2 className={styles.arcTitle}>Tools I Build With</h2>
          <p className={styles.arcDesc}>
            The cutting-edge technologies I use to craft powerful, modern applications.
          </p>
        </motion.div>

        {/* Unified icon stage — height tuned to the circle so the
            section reads as a tight, balanced cluster on every
            viewport. Intro text lives inside the stage so it's
            always at the centre of the icon circle. */}
        <div
          className={styles.stage}
          style={{
            height: `${stageHeight}px`,
            ...(showMask ? {
              maskImage: 'linear-gradient(to right, transparent 20%, black 35%, black 65%, transparent 80%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 20%, black 35%, black 65%, transparent 80%)',
            } : {}),
          }}
        >
          {/* Intro text — at the centre of the icon circle */}
          <div className={styles.introText}>
            <motion.h2
              className={styles.introTitle}
              initial={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              animate={
                introHeaderShow
                  ? { opacity: introHeaderOpacity, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, filter: "blur(8px)" }
              }
              transition={{ duration: 0.5 }}
            >
              My Tech Stack
            </motion.h2>
            <motion.p
              className={styles.introSub}
              initial={{ opacity: 0.5 }}
              animate={introHeaderShow ? { opacity: Math.max(0, 0.5 - morphVal) } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              SCROLL TO EXPLORE
            </motion.p>
          </div>

          <div
            className={`${styles.scrollWrapper} ${lineFormed ? styles.scrolling : ''}`}
            style={{ '--scroll-distance': `-${oneSetWidth}px` }}
          >
            {Array.from({ length: SETS }).flatMap((_, setIdx) =>
              TECH_ITEMS.map((tech, itemIdx) => (
                <TechIconCard
                  key={`${setIdx}-${itemIdx}`}
                  tech={tech}
                  target={getTarget(setIdx, itemIdx)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
