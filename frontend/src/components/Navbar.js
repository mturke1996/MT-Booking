import React, { useState } from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../App.css";

function Navbar({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">MT Booking</Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/" onClick={closeMenu}>Home</Link>
        </li>
        <li>
          <Link to="/Weather" onClick={closeMenu}>Weather</Link>
        </li>
        <li>
          <Link to="/city" onClick={closeMenu}>City</Link>
        </li>
        <li>
          <Link to="/budget" onClick={closeMenu}>Budget planner</Link>
        </li>
        <li>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
        </li>
      </ul>

      <div className="user-info">
        {user ? (
          <>
            <span className="welcome-message">
              <i className="fa-solid fa-user fa-beat-fade"></i> Hi,{" "}
              {user.username}
            </span>
            <div className="user-menu" onClick={toggleMenu}>
              <span className="icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <ul
                className={`dropdown-menu ${isMenuOpen ? "visible" : "hidden"}`}
              >
                <li>
                  <Link to="/profile" className="profile-link" onClick={closeMenu}>
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/myBooking" className="profile-link" onClick={closeMenu}>
                    My Booking
                  </Link>
                </li>
                <li>
                  <Link to="/addApartment" className="profile-link" onClick={closeMenu}>
                    Add New Apartment
                  </Link>
                </li>
                <li>
                  <button onClick={() => { onLogout(); closeMenu(); }} className="logout-button">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link to="/login" className="login-button">
            Login
          </Link>
        )}
      </div>

      <button className="mobile-menu-button" onClick={toggleMenu}>
        ☰ Menu
      </button>

      {isMenuOpen && (
        <ul className="mobile-menu">
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          <li>
            <Link to="/Weather" onClick={closeMenu}>Weather</Link>
          </li>
          <li>
            <Link to="/city" onClick={closeMenu}>City</Link>
          </li>
          <li>
            <Link to="/budget" onClick={closeMenu}>Budget planner</Link>
          </li>
          <li>
            <Link to="/contact" onClick={closeMenu}>Contact</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/profile" className="profile-link" onClick={closeMenu}>
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/myBooking" className="profile-link" onClick={closeMenu}>
                  My Booking
                </Link>
              </li>
              <li>
                <Link to="/addApartment" className="profile-link" onClick={closeMenu}>
                  Add New Apartment
                </Link>
              </li>
              <li>
                <button onClick={() => { onLogout(); closeMenu(); }} className="logout-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="login-button mobile-login-button" onClick={closeMenu}>
                Login
              </Link>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
