import React from "react";
import Navbar from "../../chunks/Navbar/Navbar";
import MovingHeadline from "../../chunks/MovingHeadline/MovingHeadline";
import OnboardIntro from "../../chunks/OnboardIntro/OnboardIntro";
import FounderInfo from "../../chunks/FounderInfo/FounderInfo";
import StackBucket from "../../chunks/StackBucket/StackBucket";
import Hero from "../../chunks/Hero/Hero";
import Showcase from "../../chunks/Showcase/Showcase";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Showcase />
      {/* <MovingHeadline />
      <OnboardIntro />
      <FounderInfo />
      <StackBucket /> */}
    </div>
  );
};

export default Home;
