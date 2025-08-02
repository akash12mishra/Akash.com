"use client";

import React from "react";
import NewNavbar from "../../chunks/Navbar/NewNavbar";
import NewHero from "../../chunks/Hero/NewHero";
import About from "../../chunks/About/About";
import Projects from "../../chunks/Projects/Projects";
import Experience from "../../chunks/Experience/Experience";
import NewBuildinPublic from "../../chunks/BuildinPublic/NewBuildinPublic";
import Resume from "../../chunks/Resume/Resume";
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
      <Experience />
      <Projects />
      <NewBuildinPublic />
      <Resume />
      <Contact />
      <CTASection />
      <NewFooter />
      <ChatBubble />
    </div>
  );
};

export default NewHome;
