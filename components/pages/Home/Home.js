import React from "react";
import Navbar from "../../chunks/Navbar/Navbar";
import MovingHeadline from "../../chunks/MovingHeadline/MovingHeadline";
import OnboardIntro from "../../chunks/OnboardIntro/OnboardIntro";
import FounderInfo from "../../chunks/FounderInfo/FounderInfo";

const Home = () => {
  return (
    <div>
      <Navbar />
      <MovingHeadline />
      <OnboardIntro />
      <FounderInfo />
    </div>
  );
};

export default Home;
