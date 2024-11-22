import React from "react";
import Navbar from "../../chunks/Navbar/Navbar";
import MovingHeadline from "../../chunks/MovingHeadline/MovingHeadline";
import OnboardIntro from "../../chunks/OnboardIntro/OnboardIntro";

const Home = () => {
  return (
    <div>
      <Navbar />
      <MovingHeadline />
      <OnboardIntro />
    </div>
  );
};

export default Home;
