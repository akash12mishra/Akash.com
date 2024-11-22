import React from "react";
import styles from "./OnboardIntro.module.scss";
import Image from "next/image";
import codeImg from "../../../assets/images/Code typing-rafiki.png";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";
import { FaCode } from "react-icons/fa6";
import { MdOutlineAttachMoney } from "react-icons/md";

const OnboardIntro = () => {
  return (
    <div className={styles.OnboardIntro}>
      <div className={styles.OnboardTitle}>
        <p>How it works</p>

        <h2>
          Let us integrate advanced AI <br /> solutions into your business.
        </h2>

        <div className={styles.OnboardIntroImgBox}>
          <Image
            src={codeImg}
            alt="Onboard Intro"
            className={styles.OnboardIntroImg}
          />
        </div>
      </div>

      <div className={styles.OnboardSteps}>
        <div className={styles.OnboardStep}>
          <div className={styles.OnboardStepIcon}>
            <IoChatbubbleEllipsesOutline
              className={styles.OnboardStepIconImg}
            />
          </div>

          <div className={styles.OnboardStepInfo}>
            <h3>Fill in the Questionnaire</h3>
            <p>Help us understand your business bottlenecks and challenges.</p>
          </div>
        </div>

        <div className={styles.OnboardStep}>
          <div className={styles.OnboardStepIcon}>
            <CiVideoOn className={styles.OnboardStepIconImg} />
          </div>

          <div className={styles.OnboardStepInfo}>
            <h3>Fill in the Questionnaire</h3>
            <p>Help us understand your business bottlenecks and challenges.</p>
          </div>
        </div>

        <div className={styles.OnboardStep}>
          <div className={styles.OnboardStepIcon}>
            <FaCode className={styles.OnboardStepIconImg} />
          </div>

          <div className={styles.OnboardStepInfo}>
            <h3>Fill in the Questionnaire</h3>
            <p>Help us understand your business bottlenecks and challenges.</p>
          </div>
        </div>

        <div className={styles.OnboardStep}>
          <div className={styles.OnboardStepIcon}>
            <MdOutlineAttachMoney className={styles.OnboardStepIconImg} />
          </div>

          <div className={styles.OnboardStepInfo}>
            <h3>Fill in the Questionnaire</h3>
            <p>Help us understand your business bottlenecks and challenges.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardIntro;
