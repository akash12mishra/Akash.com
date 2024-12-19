import React, { useEffect } from "react";
import styles from "./Showcase.module.scss";
import Image from "next/image";
import discoImg from "../../../assets/images/disco.png";
import genfunnelsImg from "../../../assets/images/genfunnels.png";

const Showcase = () => {
  useEffect(() => {
    const cards = document.querySelectorAll("[data-tilt]");

    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = (card) => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => handleMouseMove(e, card));
      card.addEventListener("mouseleave", () => handleMouseLeave(card));
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <div className={styles.Showcase}>
      <div className={styles.titleContainer}>
        <h2>
          <span>Applications</span> that we have built.
        </h2>
      </div>

      <div className={styles.showcaseContainer}>
        <div className={styles.ShowcaseCards}>
          <div className={styles.cardContainer}>
            <Image
              src={discoImg}
              className={styles.ShowcaseCard}
              alt=""
              data-tilt
            />
          </div>
          <div className={styles.cardContainer}>
            <Image
              src={genfunnelsImg}
              className={styles.ShowcaseCard}
              alt=""
              data-tilt
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
