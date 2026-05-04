"use client";

import React, { useRef } from "react";
import CtaButton from "../../CtaButton/CtaButton";
import styles from "./CTASection.module.scss";

const CTASection = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const ctaRef = useRef(null);

  // On-scroll word-by-word fade-in animation disabled per request —
  // paragraph and CTA render statically without entrance animation.

  return (
    <section className={styles.ctaSection} ref={sectionRef}>
      <div className={styles.ctaContent}>
        <p className={styles.ctaText} ref={textRef}>
          <span className={styles.word}>Great</span>{" "}
          <span className={styles.word}>products</span>{" "}
          <span className={styles.word}>don&apos;t</span>{" "}
          <span className={styles.word}>build</span>{" "}
          <span className={styles.word}>themselves.</span>{" "}
          <span className={styles.word}>They</span>{" "}
          <span className={styles.word}>need</span>{" "}
          <span className={styles.word}>the</span>{" "}
          <span className={styles.word}>right</span>{" "}
          <span className={styles.word}>engineer</span>{" "}
          <span className={styles.word}>—</span>{" "}
          <span className={styles.word}>one</span>{" "}
          <span className={styles.word}>who</span>{" "}
          <span className={styles.word}>ships</span>{" "}
          <span className={`${styles.word} ${styles.highlight}`}>
            AI-powered SaaS,
          </span>{" "}
          <span className={`${styles.word} ${styles.highlight}`}>
            full-stack Apps,
          </span>{" "}
          <span className={styles.word}>and</span>{" "}
          <span className={`${styles.word} ${styles.highlight}`}>
            production-ready code.
          </span>
        </p>
        <div className={styles.ctaBtnWrap} ref={ctaRef}>
          <CtaButton
            href="https://calendly.com/arkalal-chakravarty/30min"
            label="Schedule a Meeting"
            external
            variant="primary"
          />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
