import React from 'react'
import { useState } from 'react';

export default function Contact() {
    const [customerName, setCustomerName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Message sent by ${customerName}`);
    }
  return (
    <div style={{maxWidth: "600px", marginTop:"150px", margin: "50px auto", padding: "20px", border: "1px solid #ccc",
        borderRadius: "10px"}}>
         <h1>Contact Us</h1>
         <div className="contact-info" style={{marginTop:"75px",marginBottom:"50px", display: "flex",justifyContent:"space-between" }}>
                <div>
                    <a href="mailto:lolo@gmail.com"><strong>george@mtbooking.com</strong></a>
                </div>
                <div>
                    <p style={{color:"black"}}><strong>Telephone:</strong> 0011223344</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="contact-form">
                <label htmlFor="customerName">Your Name:</label>
                <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                />
                <label htmlFor="message">Your Message:</label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
                <button type="submit" style={{ width: "100%",
    padding: "10px"
    }}>Send Message</button>
            </form>
    </div>
  )
}
