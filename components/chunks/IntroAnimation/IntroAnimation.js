"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./IntroAnimation.module.scss";

const WORDS = ["Arka", "LAL", "Chakravarty", "Arka Lal Chakravarty"];

const MORPH_TIME = 1.4;
const COOLDOWN_TIME = 0.55;
const FINAL_HOLD = 2.0;
const FADE_OUT_MS = 700;

const useMorphingText = (texts, onComplete) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(null);
  const finalHoldRef = useRef(FINAL_HOLD);
  const completedRef = useRef(false);

  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  const setStyles = useCallback(
    (fraction) => {
      const c1 = text1Ref.current;
      const c2 = text2Ref.current;
      if (!c1 || !c2 || !texts || texts.length === 0) return;

      c2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      c2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const inv = 1 - fraction;
      c1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      c1.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;

      c1.textContent = texts[textIndexRef.current % texts.length];
      c2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts]
  );

  const doMorph = useCallback(() => {
    let fraction = morphRef.current / MORPH_TIME;
    if (fraction > 1) {
      cooldownRef.current = COOLDOWN_TIME;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const c1 = text1Ref.current;
    const c2 = text2Ref.current;
    if (c1 && c2) {
      c2.style.filter = "none";
      c2.style.opacity = "100%";
      c1.style.filter = "none";
      c1.style.opacity = "0%";
    }
  }, []);

  useEffect(() => {
    if (!texts || texts.length === 0) return undefined;

    let animationFrameId;
    timeRef.current = new Date();

    // Pre-paint the first word in the "cooldown" slot so it reads
    // clearly before any morph begins.
    const c1 = text1Ref.current;
    const c2 = text2Ref.current;
    if (c1 && c2) {
      c1.textContent = "";
      c1.style.opacity = "0%";
      c1.style.filter = "none";
      c2.textContent = texts[0];
      c2.style.opacity = "100%";
      c2.style.filter = "none";
    }
    cooldownRef.current = COOLDOWN_TIME;
    morphRef.current = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      // Reached the final word — hold it crisp, then signal completion.
      if (textIndexRef.current >= texts.length - 1) {
        doCooldown();
        finalHoldRef.current -= dt;
        if (finalHoldRef.current <= 0 && !completedRef.current) {
          completedRef.current = true;
          if (typeof onComplete === "function") onComplete();
        }
        return;
      }

      if (cooldownRef.current > 0) {
        cooldownRef.current -= dt;
        doCooldown();
      } else {
        morphRef.current += dt;
        doMorph();
      }
    };

    animate();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [texts, doMorph, doCooldown, onComplete]);

  return { text1Ref, text2Ref };
};

const SvgFilters = () => (
  <svg
    className={styles.filterDefs}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <filter id="intro-threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
);

const IntroAnimation = ({ onComplete }) => {
  const [exiting, setExiting] = useState(false);
  const exitedRef = useRef(false);

  const handleSequenceComplete = useCallback(() => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    setExiting(true);
    window.setTimeout(() => {
      if (typeof onComplete === "function") onComplete();
    }, FADE_OUT_MS);
  }, [onComplete]);

  const { text1Ref, text2Ref } = useMorphingText(WORDS, handleSequenceComplete);

  return (
    <div
      className={`${styles.overlay} ${exiting ? styles.exiting : ""}`}
      aria-hidden="true"
    >
      <div className={styles.morphWrapper}>
        <div className={styles.morphText}>
          <span ref={text1Ref} className={styles.textLayer} />
          <span ref={text2Ref} className={styles.textLayer} />
        </div>
        <SvgFilters />
      </div>
    </div>
  );
};

export default IntroAnimation;
