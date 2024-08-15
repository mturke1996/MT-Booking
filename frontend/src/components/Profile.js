import React from "react";
import "../App.css"; // تأكد من إنشاء هذا الملف وتضمينه

export default function Profile({ user }) {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          className="profile-picture"
          src="/path/to/profile-picture.jpg" 
          alt="Profile"
        />
        <h1 className="profile-name">!!!!!!!!!!!!!!!!!!!!1</h1>
        <p className="profile-title">Web Developer | Designer</p>
      </div>
      <div className="profile-actions">
        <button className="profile-button edit-button">Edit Profile</button>
        <button className="profile-button contact-button">Contact</button>
      </div>
      <div className="profile-info">
        <div className="info-item">
          <span className="info-label">Email:</span>
          <span className="info-value">johndoe@example.com</span>
        </div>
        <div className="info-item">
          <span className="info-label">Phone:</span>
          <span className="info-value">+1 234 567 890</span>
        </div>
      </div>
    </div>
  );
}
