import React, { useState } from "react";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../App.css";

function Navbar({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">MT Booking</Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Weather">Weather</Link></li>
        <li><Link to="#">Blog</Link></li>
        <li><Link to="#">News</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <div className="user-info">
        {user ? (
          <>
            <span className="welcome-message">
              <i className="fa-solid fa-user fa-beat-fade"></i> Hi, {user.username}
            </span>
            <div className="user-menu" onClick={toggleMenu}>
              <span className="icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <ul className={`dropdown-menu ${isMenuOpen ? 'visible' : 'hidden'}`}>
                <li><Link to="/profile" className="profile-link">My Profile</Link></li>
                <li><Link to="/myBooking" className="profile-link">My Booking</Link></li>
                <li><Link to="/addApartment" className="profile-link">Add New Apartment</Link></li>
                <li><button onClick={onLogout} className="logout-button">Logout</button></li>
              </ul>
            </div>
          </>
        ) : (
          <Link to="/login" className="login-button">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
