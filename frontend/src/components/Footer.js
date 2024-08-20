import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <div>
      <footer id="contact">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-section">
              <h3>MT booking</h3>
              <h3>Explore Apartments around europe</h3>
            </div>
            <div className="footer-section Newsletter">
              <input type="text" placeholder="Subscribe To Our Newsletter" className="newsletter-input"/>
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-logo footer-section">
              <h4>MT booking</h4>
              <p>© 2024 - MT booking,<br/>All Right Reserved</p>
            </div>
            <div className="footer-column footer-section">
              <h5>MT booking</h5>
              <a href="#">Agents</a>
              <a href="#">Hunters</a>
            </div>
            <div className="footer-column footer-section">
              <h5>COMPANY</h5>
              <a href="#">About</a>
              <a href="#">FAQ</a>
              <a href="#">Contact</a>
              <a href="#">Social</a>
            </div>
            <div className="footer-column footer-section">
              <h5>PRODUCT</h5>
              <a href="#">Apartments</a>
              <a href="#">How It Works</a>
            </div>
          
          </div>
        </div>
      </footer>
    </div>
  );
}
