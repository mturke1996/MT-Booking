import React from "react";
import Hero from "./Hero";
import Statistic from "./Statistic";
import Apartment from "./Apartment";
import Footer from "./Footer";
import Agent from "./Agent";


export default function Home() {
  return (
    <div>
      <Hero />
      <Statistic />
      <Apartment />
      <Agent/>
      <Footer/>
    </div>
  );
}
