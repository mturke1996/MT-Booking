import React from "react";
import "../App.css";

function Hero() {
  return (
      <header className="hero">
        <div className="hero-content">
          <div className="search-bar">
            <div>
              <h1>Good Morning!</h1>
              <p>Explore beautiful places in the world with MT Booking</p>
            </div>
            <div>
              <input type="text" placeholder="Location" />
              <input type="date" placeholder="Check-in" />
              <input type="date" placeholder="Check-out" />
              <input type="number" placeholder="Guests" />
              <button>Search</button>
            </div>
          </div>
        </div>
      </header>

  );
}

export default Hero;
