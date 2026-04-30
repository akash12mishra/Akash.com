"use client";

import React from "react";
import styles from "./NewHome.module.scss";
import NewHero from "../../chunks/Hero/NewHero";
import GlobalCollaboration from "../../chunks/GlobalCollaboration/GlobalCollaboration";
import About from "../../chunks/About/About";
import TechStack from "../../chunks/TechStack/TechStack";
import Skills from "../../chunks/Skills/Skills";
import ProjectShowcase from "../../chunks/Projects/ProjectShowcase";
import GitHubContributionHeatmap from "../../chunks/GitHubContributions/GitHubContributionHeatmap";
import GitHubAnalytics from "../../chunks/GitHubAnalytics/GitHubAnalytics";
import BuildInPublicCarousel from "../../chunks/BuildInPublic/BuildInPublicCarousel";
import Contact from "../../chunks/Contact/Contact";
import HireEngineer from "../../chunks/HireEngineer/HireEngineer";
import CTASection from "../../chunks/CTASection/CTASection";
import NewFooter from "../../chunks/Footer/NewFooter";
import ChatBubble from "../../chunks/ChatBubble/ChatBubble";
// Initial-load name intro animation disabled per request.
// import IntroAnimation from "../../chunks/IntroAnimation/IntroAnimation";

const NewHome = () => {
  // Intro animation logic disabled per request — site loads directly.
  // const [showIntro, setShowIntro] = useState(false);
  //
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //
  //   const prefersReduced = window.matchMedia(
  //     "(prefers-reduced-motion: reduce)"
  //   ).matches;
  //
  //   if (prefersReduced) {
  //     return;
  //   }
  //
  //   setShowIntro(true);
  //   const previousOverflow = document.body.style.overflow;
  //   document.body.style.overflow = "hidden";
  //
  //   return () => {
  //     document.body.style.overflow = previousOverflow;
  //   };
  // }, []);
  //
  // const handleIntroComplete = useCallback(() => {
  //   document.body.style.overflow = "";
  //   setShowIntro(false);
  // }, []);

  return (
    <div className={styles.pageWrapper}>
      {/* {showIntro && <IntroAnimation onComplete={handleIntroComplete} />} */}
      <NewHero />
      <GlobalCollaboration />
      <About />
      <TechStack />
      <Skills />
      <ProjectShowcase />
      <GitHubContributionHeatmap />
      <GitHubAnalytics />
      <BuildInPublicCarousel />
      <Contact />
      <HireEngineer />
      <CTASection />
      <NewFooter />
      <ChatBubble />
    </div>
  );
};

export default NewHome;
