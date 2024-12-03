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

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Stack />
      <Showcase />
      <FounderInfo />
      <MovingHeadline />
      {/* <OnboardIntro /> */}
      <Services />
      <ChatBubble />
    </div>
  );
};

export default Home;
