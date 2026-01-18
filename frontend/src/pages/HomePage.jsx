// pages/HomePage.jsx
import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturedCategories from "../components/FeaturedCategories";
import Promotional from "../components/Promotional";
import BestSellers from "../components/AllProducts";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <Promotional />
      <BestSellers />
    </>
  );
};

export default HomePage;