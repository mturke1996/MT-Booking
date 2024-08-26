import React from "react";
import "../App.css";
import "./FAQ.js";

export default function Footer() {
  return (
    <footer id="contact">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-section footer-contact-info" style={{display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
            <div>
              <h2>MT Booking</h2>
              <br />
              <p>Explore Apartments around Europe with ease.</p>
            </div>
            <div>
              <p>
                <i className="fa-solid fa-phone footer-icon"></i> +1 (234)
                567-890
              </p>
              <p>
                <i className="fa-solid fa-location-dot footer-icon"></i> 1234
                Main St, Anytown, Europe
              </p>
            </div>
          </div>
          <div className="footer-section footer-newsletter">
            <h4>Subscribe to our Newsletter</h4>
            <div className="footer-newsletter-box">
              <input
                type="text"
                placeholder="Enter your email"
                className="footer-newsletter-input"
              />
              <button className="footer-newsletter-btn">Subscribe</button>
            </div>
            <div className="footer-section footer-sitemap">
              <h4>Quick Links</h4>
              <br />
              <br />
              <a href="#">Home</a>
              <a href="/Searchitem">Apartments</a>
              <a href="#">About Us</a>
              <a href="#">Contact Us</a>
              <a href="#">FAQ</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-section footer-logo">
            <h4>MT Booking</h4>
            <p>© 2024 MT Booking, All Rights Reserved</p>
            <div className="footer-social-icons">
              <a href="#">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-snapchat"></i>
              </a>
            </div>
            <div className="footer-payment-icons">
              <i className="fa-brands fa-cc-visa"></i>
              <i className="fa-brands fa-cc-mastercard"></i>
              <i className="fa-brands fa-cc-apple-pay"></i>
              <i className="fa-brands fa-cc-paypal"></i>
            </div>
          </div>

          <div className="footer-section footer-testimonials">
            <h4>What Our Clients Say</h4>
            <p>
              "MT Booking made finding our dream apartment so easy! Highly
              recommend." - Jane D.
            </p>
            <p>
              "Great service and amazing selection of apartments." - John S.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
