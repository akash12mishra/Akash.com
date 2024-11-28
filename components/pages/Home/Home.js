import React from "react";
import Navbar from "../../chunks/Navbar/Navbar";
import MovingHeadline from "../../chunks/MovingHeadline/MovingHeadline";
import OnboardIntro from "../../chunks/OnboardIntro/OnboardIntro";
import FounderInfo from "../../chunks/FounderInfo/FounderInfo";
import StackBucket from "../../chunks/StackBucket/StackBucket";
import Hero from "../../chunks/Hero/Hero";
import Showcase from "../../chunks/Showcase/Showcase";
import ChatBubble from "../../chunks/ChatBubble/ChatBubble";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Showcase />
      <StackBucket />
      <MovingHeadline />
      <FounderInfo />
      {/* <OnboardIntro /> */}
      <ChatBubble />
    </div>
  );
};

export default Home;
