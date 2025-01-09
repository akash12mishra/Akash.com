"use client";

import React, { useEffect, useRef } from "react";
import styles from "./OnboardIntro.module.scss";
import Image from "next/image";
import codeImg from "../../../assets/images/Code typing-rafiki.png";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";
import { FaCode } from "react-icons/fa6";
import { MdOutlineAttachMoney } from "react-icons/md";

const OnboardIntro = ({ servicesRef }) => {
  const stepRefs = useRef([]);
  const lineRefs = useRef([]);
  const componentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;

      if (!componentRef.current) return;

      const componentRect = componentRef.current.getBoundingClientRect();

      // Start first line animation as soon as the component enters the viewport
      if (
        componentRect.top <= windowHeight &&
        stepRefs.current[0] &&
        stepRefs.current[1] &&
        lineRefs.current[0]
      ) {
        const firstStepRect = stepRefs.current[0].getBoundingClientRect();
        const secondStepRect = stepRefs.current[1].getBoundingClientRect();

        const distance = secondStepRect.top - firstStepRect.bottom;
        const scrollProgress =
          1 -
          Math.min(
            Math.max((secondStepRect.top - windowHeight / 2) / distance, 0),
            1
          );

        lineRefs.current[0].style.height = `${scrollProgress * 100}px`;
        lineRefs.current[0].style.transition = "height 0.1s linear";
      }

      // Handle other lines based on scroll position
      stepRefs.current.forEach((step, index) => {
        if (!step || !stepRefs.current[index + 1] || !lineRefs.current[index])
          return;

        const currentStepRect = step.getBoundingClientRect();
        const nextStepRect =
          stepRefs.current[index + 1].getBoundingClientRect();

        if (
          currentStepRect.bottom <= windowHeight * 0.8 &&
          nextStepRect.top >= windowHeight * 0.2
        ) {
          const distance = nextStepRect.top - currentStepRect.bottom; // Total distance between two steps
          const scrollProgress =
            1 -
            Math.min(
              Math.max((nextStepRect.top - windowHeight / 2) / distance, 0),
              1
            ); // Calculate scroll progress

          lineRefs.current[index].style.height = `${scrollProgress * 100}px`; // Adjust line height based on scroll progress
          lineRefs.current[index].style.transition = "height 0.1s linear";
        } else {
          lineRefs.current[index].style.height = "0"; // Reset if out of view
        }
      });

      // Trigger last line animation when user reaches the end of the component
      if (lineRefs.current[lineRefs.current.length - 1]) {
        const lastStepRect =
          stepRefs.current[
            stepRefs.current.length - 1
          ]?.getBoundingClientRect();

        if (lastStepRect && componentRect.bottom <= windowHeight) {
          const distance = componentRect.bottom - lastStepRect.bottom; // Distance to the bottom
          const scrollProgress = Math.max(
            1 - Math.abs(distance / windowHeight),
            0
          );

          lineRefs.current[lineRefs.current.length - 1].style.height = `${
            scrollProgress * 100
          }px`;
          lineRefs.current[lineRefs.current.length - 1].style.transition =
            "height 0.1s linear";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const steps = [
    {
      icon: <IoChatbubbleEllipsesOutline />,
      title: "Talk to our AI chatbot",
      desc: "Ask your queries to our AI chatbot regarding our services and get instant answers.",
    },
    {
      icon: <CiVideoOn />,
      title: "Book a Call",
      desc: "Schedule your meeting with us in our chatbot and lets discuss about your requirements.",
    },
    {
      icon: <FaCode />,
      title: "Get a Personalized Demo",
      desc: "Receive a tailored demonstration, including a working demo of our software solutions.",
    },
    {
      icon: <MdOutlineAttachMoney />,
      title: "Get Onboarded",
      desc: "Begin your journey towards cutting costs and building advanced software solutions with us.",
    },
  ];

  return (
    <div
      ref={(el) => {
        servicesRef.current = el;
        componentRef.current = el;
      }}
      className={styles.OnboardIntro}
    >
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
