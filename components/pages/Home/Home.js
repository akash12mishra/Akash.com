"use client";

import React from "react";
import Navbar from "../../chunks/Navbar/Navbar";
import MovingHeadline from "../../chunks/MovingHeadline/MovingHeadline";
import OnboardIntro from "../../chunks/OnboardIntro/OnboardIntro";
import FounderInfo from "../../chunks/FounderInfo/FounderInfo";
import Hero from "../../chunks/Hero/Hero";
import Showcase from "../../chunks/Showcase/Showcase";
import ChatBubble from "../../chunks/ChatBubble/ChatBubble";
import Stack from "../../chunks/Stack/Stack";
import Services from "../../chunks/Services/Services";
import BuildInPublic from "../../chunks/BuildInPublic/BuildInPublic";
import { useEffect, useRef } from "react";
import PricingSection from "../../chunks/PricingSection/PricingSection";
import HookIntro from "../../chunks/HookIntro/HookIntro";
import Footer from "../../chunks/Footer/Footer";

const Home = () => {
  const servicesRef = useRef(null);

  if (typeof window !== "undefined") {
    if (window.bubbleOpened === undefined) window.bubbleOpened = false;
    if (window.bubbleClosed === undefined) window.bubbleClosed = false;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If Services is in view
        if (entries[0].isIntersecting) {
          // Attempt to open the bubble if not opened or closed
          if (
            typeof window !== "undefined" &&
            !window.bubbleOpened &&
            !window.bubbleClosed
          ) {
            window.bubbleOpened = true;
            // Dispatch a custom event to notify ChatBubble
            window.dispatchEvent(new Event("openBubble"));
          }
        }
      },
      { threshold: 0.1 }
    ); // Adjust threshold as needed

    const currentServicesRef = servicesRef.current;
    if (currentServicesRef) {
      observer.observe(currentServicesRef);
    }

    return () => {
      if (currentServicesRef) {
        observer.unobserve(currentServicesRef);
      }
    };
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />
      <Stack />
      <Showcase />
      <FounderInfo />
      <MovingHeadline />
      <Services />
      <ChatBubble />
      <BuildInPublic servicesRef={servicesRef} />
      <PricingSection />
      <OnboardIntro />
      <HookIntro />
      <Footer />
    </div>
  );
};

export default Home;
