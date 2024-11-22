"use client";

import React, { useEffect, useRef } from "react";
import styles from "./OnboardIntro.module.scss";
import Image from "next/image";
import codeImg from "../../../assets/images/Code typing-rafiki.png";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";
import { FaCode } from "react-icons/fa6";
import { MdOutlineAttachMoney } from "react-icons/md";

const OnboardIntro = () => {
  const stepRefs = useRef([]);
  const lineRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      stepRefs.current.forEach((step, index) => {
        if (!step) return;

        const rect = step.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the step is in view
        if (rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2) {
          if (lineRefs.current[index]) {
            lineRefs.current[index].style.height = "80px"; // Set line height between icons
            lineRefs.current[index].style.transition = "height 0.5s ease-out";
          }
        } else {
          if (lineRefs.current[index]) {
            lineRefs.current[index].style.height = "0";
            lineRefs.current[index].style.transition = "height 0.5s ease-out";
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger on mount to initialize animations

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const steps = [
    {
      icon: <IoChatbubbleEllipsesOutline />,
      title: "Fill in the Questionnaire",
      desc: "Help us understand your business bottlenecks and challenges.",
    },
    {
      icon: <CiVideoOn />,
      title: "Book a Call",
      desc: "Discuss the identified challenges in detail with our experts.",
    },
    {
      icon: <FaCode />,
      title: "Get a Personalized Demo",
      desc: "Receive a tailored demonstration, including ROI analysis.",
    },
    {
      icon: <MdOutlineAttachMoney />,
      title: "Contract and Start Saving",
      desc: "Begin your journey towards cutting costs and increasing sales.",
    },
  ];

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
        {steps.map((step, index) => (
          <div
            key={index}
            ref={(el) => (stepRefs.current[index] = el)}
            className={styles.OnboardStep}
          >
            <div className={styles.OnboardStepIcon}>{step.icon}</div>
            <div className={styles.OnboardStepInfo}>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
            {index < steps.length - 1 && (
              <div
                ref={(el) => (lineRefs.current[index] = el)}
                className={styles.verticalLine}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardIntro;
