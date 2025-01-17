"use client";

import React from "react";
import styles from "./Footer.module.scss";
import { IoSparklesOutline } from "react-icons/io5";
import arkaImg from "../../../assets/images/arka.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  return (
    <div className={styles.Footer}>
      <div className={styles.footerLeft}>
        <h3>arkalalchakravarty.</h3>

        <h2>
          Build your <br /> <span>MVPs</span> and <span>Applications</span>{" "}
          Efficiently{" "}
        </h2>

        <button
          onClick={() =>
            window.open(
              "https://calendly.com/arkalal-chakravarty/30min",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          Book a call <IoSparklesOutline className={styles.FooterBtnIcon} />{" "}
        </button>

        <p>A L Chakravarty Technologies.</p>

        <div className={styles.policyPages}>
          <a href="/privacyPolicy">Privacy Policy</a>
          <a href="/termsOfService">Terms Of Service</a>
        </div>
      </div>

      <div className={styles.footerRight}>
        <Image src={arkaImg} alt="logo" className={styles.arkaImgFoot} />
      </div>
    </div>
  );
};

export default Footer;
