import React from "react";
import styles from "./Showcase.module.scss";
import Image from "next/image";
import discoImg from "../../../assets/images/disco.png";
import genfunnelsImg from "../../../assets/images/genfunnels.png";

const Showcase = () => {
  return (
    <div className={styles.Showcase}>
      <div className={styles.ShowcaseTitle}>
        <h2>
          <span>Applications</span> that we have built.
        </h2>
      </div>

      <div className={styles.ShowcaseCards}>
        <Image src={discoImg} className={styles.ShowcaseCard} alt="" />
        <Image src={genfunnelsImg} className={styles.ShowcaseCard} alt="" />
      </div>
    </div>
  );
};

export default Showcase;
