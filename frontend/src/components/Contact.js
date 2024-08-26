import React, { useState } from 'react';
import '../App.css';

export default function Contact() {
    const [customerName, setCustomerName] = useState('');
    const [message, setMessage] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Message sent by ${customerName}`);
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        alert(`Feedback submitted: ${feedback}`);
    };

    return (
        <div className="contact-container">
            <h1>Contact Us</h1>

            {/* Map Integration */}
            <div className="map-container">
                <iframe
                    title="Company Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345098047!2d144.95592331577716!3d-37.8172099797517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf57763f077a2df20!2sRialto%20Towers!5e0!3m2!1sen!2sau!4v1613989692835!5m2!1sen!2sau"
                    width="100%"
                    height="300"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    aria-hidden="false"
                    tabIndex="0"
                />
            </div>

            {/* Social Media Links */}
            <div className="social-media">
                <h2>Connect with Us</h2>
                <div className="social-links" style={{ display: "flex",
  justifyContent: "center"}}>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
            </div>

            {/* Office Hours and Address */}
            <div className="office-info">
                <h2>Our Office</h2>
                <p><strong>Address:</strong> 123 Main St, Suite 500, Melbourne, VIC 3000</p>
                <p><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
            </div>

            {/* Multiple Contact Methods */}
            <div className="contact-methods">
                <h2>Contact Methods</h2>
                <div className="contact-methods-list">
                    <a href="tel:0011223344">Call Us: 0011223344</a>
                    <a href="mailto:george@mtbooking.com">Email: george@mtbooking.com</a>
                    <a href="https://wa.me/0011223344" target="_blank" rel="noopener noreferrer">WhatsApp: 0011223344</a>
                </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="customerName">Your Name:</label>
                    <input
                        type="text"
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Your Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Send Message</button>
            </form>
        </div>
    );
}
