import React from "react";
import styles from "./Footer.module.scss";
import { IoSparklesOutline } from "react-icons/io5";
import arkaImg from "../../../assets/images/arka.png";
import Image from "next/image";

const Footer = () => {
  return (
    <div className={styles.Footer}>
      <div className={styles.footerLeft}>
        <h3>arkalalchakravarty.</h3>

        <h2>
          Build your <br /> <span>MVPs</span> and <span>Applications</span>{" "}
          Efficiently{" "}
        </h2>

        <button>
          Book a call <IoSparklesOutline className={styles.FooterBtnIcon} />{" "}
        </button>

        <p>A L Chakravarty Technologies.</p>
      </div>

      <div className={styles.footerRight}>
        <Image src={arkaImg} alt="logo" className={styles.arkaImgFoot} />
      </div>
    </div>
  );
};

export default Footer;
