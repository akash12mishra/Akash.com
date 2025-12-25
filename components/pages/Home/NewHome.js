"use client";

import React from "react";
import styles from "./NewHome.module.scss";
import NewHero from "../../chunks/Hero/NewHero";
import GlobalCollaboration from "../../chunks/GlobalCollaboration/GlobalCollaboration";
import About from "../../chunks/About/About";
import TechStack from "../../chunks/TechStack/TechStack";
import ExperienceTestimonial from "../../chunks/Experience/ExperienceTestimonial";
import ProjectShowcase from "../../chunks/Projects/ProjectShowcase";
import GitHubContributionHeatmap from "../../chunks/GitHubContributions/GitHubContributionHeatmap";
import GitHubAnalytics from "../../chunks/GitHubAnalytics/GitHubAnalytics";
import BuildInPublicCarousel from "../../chunks/BuildInPublic/BuildInPublicCarousel";
import Contact from "../../chunks/Contact/Contact";
import CTASection from "../../chunks/CTASection/CTASection";
import NewFooter from "../../chunks/Footer/NewFooter";
import ChatBubble from "../../chunks/ChatBubble/ChatBubble";

const NewHome = () => {
  return (
    <div className={styles.pageWrapper}>
      <NewHero />
      <GlobalCollaboration />
      <About />
      <TechStack />
      <ExperienceTestimonial />
      <ProjectShowcase />
      <GitHubContributionHeatmap />
      <GitHubAnalytics />
      <BuildInPublicCarousel />
      <Contact />
      <CTASection />
      <NewFooter />
      <ChatBubble />
    </div>
  );
};

export default NewHome;
