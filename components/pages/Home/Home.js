import React from "react";
import Navbar from "../../chunks/Navbar/Navbar";
import MovingHeadline from "../../chunks/MovingHeadline/MovingHeadline";
import OnboardIntro from "../../chunks/OnboardIntro/OnboardIntro";
import FounderInfo from "../../chunks/FounderInfo/FounderInfo";
import StackHeadline from "../../chunks/StackHeadline/StackHeadline";

const Home = () => {
  return (
    <div>
      <Navbar />
      <MovingHeadline />
      <OnboardIntro />
      <FounderInfo />
      <StackHeadline />
    </div>
  );
};

export default Home;
