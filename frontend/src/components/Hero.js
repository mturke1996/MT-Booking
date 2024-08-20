import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Hero() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    // التنقل إلى صفحة البحث أو أي صفحة أخرى
    navigate("/Searchitem");
  };

  return (
    <header className="hero">
      <div className="hero-content">
        <h1>Good Morning!</h1>
        <p>Explore beautiful places in the world with MT Booking</p>
        <button onClick={handleGetStartedClick}>Get Started</button>
      </div>
    </header>
  );
}

export default Hero;
