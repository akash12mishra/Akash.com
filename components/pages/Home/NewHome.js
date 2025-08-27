"use client";

import React from "react";
import NewNavbar from "../../chunks/Navbar/NewNavbar";
import NewHero from "../../chunks/Hero/NewHero";
import About from "../../chunks/About/About";
import ProjectShowcase from "../../chunks/Projects/ProjectShowcase";
import ExperienceTestimonial from "../../chunks/Experience/ExperienceTestimonial";
import BuildInPublicCarousel from "../../chunks/BuildInPublic/BuildInPublicCarousel";
import Contact from "../../chunks/Contact/Contact";
import CTASection from "../../chunks/CTASection/CTASection";
import NewFooter from "../../chunks/Footer/NewFooter";
import TechStack from "../../chunks/TechStack/TechStack";
import ChatBubble from "../../chunks/ChatBubble/ChatBubble";

const NewHome = () => {
  return (
    <div>
      <NewNavbar />
      <NewHero />
      <About />
      <TechStack />
      <ExperienceTestimonial />
      <ProjectShowcase />
      <BuildInPublicCarousel />
      <Contact />
      <CTASection />
      <NewFooter />
      <ChatBubble />
    </div>
  );
};

export default NewHome;
