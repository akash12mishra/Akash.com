"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import styles from "./CtaButton.module.scss";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CtaButton = ({
  href,
  label = "Book a Call",
  onClick,
  external = false,
  variant = "primary",
  size = "md",
  className = "",
  download,
  title,
  icon,
  ariaLabel,
}) => {
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  // Measure the text once mounted (and again on resize) so the hover
  // animation can shift the arrow circle exactly past the text width
  // — this is what makes the same component work for any label/size
  // without breaking when the button is wider or narrower.
  useIsoLayoutEffect(() => {
    if (!textRef.current) return;
    const measure = () => {
      if (textRef.current) setTextWidth(textRef.current.offsetWidth);
    };
    measure();
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(textRef.current);
    } else {
      window.addEventListener("resize", measure);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", measure);
    };
  }, [label]);

  const combinedClass =
    `${styles.ctaBtn} ${styles[variant] || ""} ${styles[size] || ""} ${className}`.trim();

  const inlineStyle = { "--cta-text-w": `${textWidth}px` };

  const inner = (
    <>
      <span className={styles.btnText} ref={textRef}>
        {label}
      </span>
      <span className={styles.btnArrow} aria-hidden="true">
        {icon || <GoArrowUpRight />}
      </span>
    </>
  );

  if (onClick && !href) {
    return (
      <button
        className={combinedClass}
        style={inlineStyle}
        onClick={onClick}
        type="button"
        title={title}
        aria-label={ariaLabel || label}
      >
        {inner}
      </button>
    );
  }

  return (
    <a
      href={href}
      className={combinedClass}
      style={inlineStyle}
      onClick={onClick}
      download={download}
      title={title}
      aria-label={ariaLabel || label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {inner}
    </a>
  );
};

export default CtaButton;
