import React from "react";
import Navbar from "../../chunks/Navbar/Navbar";
import MovingHeadline from "../../chunks/MovingHeadline/MovingHeadline";
import OnboardIntro from "../../chunks/OnboardIntro/OnboardIntro";
import FounderInfo from "../../chunks/FounderInfo/FounderInfo";
import StackBucket from "../../chunks/StackBucket/StackBucket";

const Home = () => {
  return (
    <div>
      <Navbar />
      <MovingHeadline />
      <OnboardIntro />
      <FounderInfo />
      <StackBucket />
    </div>
  );
};

export default Home;
