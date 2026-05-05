"use client";

import React, { useRef } from "react";
import CtaButton from "../../CtaButton/CtaButton";
import styles from "./HireEngineer.module.scss";

const HireEngineer = () => {
  const sectionRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const ctaRef = useRef(null);

  // On-scroll fade-in animation disabled per request — content renders
  // statically without entrance animation.

  return (
    <section className={styles.hireSection} ref={sectionRef}>
      <div className={styles.content}>
        <h2 className={styles.heading}>
          <span className={styles.line} ref={line1Ref}>
            Hire
          </span>
          <span className={styles.line} ref={line2Ref}>
            Your
          </span>
          <span className={styles.line} ref={line3Ref}>
            Engineer
          </span>
        </h2>
        <div className={styles.ctaWrap} ref={ctaRef}>
          <CtaButton
            href="https://calendly.com/arkalal-chakravarty/30min"
            label="Book a Call"
            external
            variant="primary"
          />
        </div>
      </div>
    </section>
  );
};

export default HireEngineer;
