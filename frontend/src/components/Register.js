// src/components/Register.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css"; // افترض أنك أضفت ملف CSS خاصًا بالتسجيل

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // إضافة حالة لتخزين رسائل الخطأ
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // منع إعادة تحميل الصفحة عند الإرسال

    // التحقق من صحة البيانات
    if (!username || !password || !name || !lastname || !email) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("https://mt-booking.onrender.com/register", {
        username,
        password,
        name,
        lastname,
        email,
      });
      console.log("Registered:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            aria-label="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Password"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            aria-label="First name"
          />
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Last name"
            aria-label="Last name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            aria-label="Email"
          />
          {error && <p className="error-message">{error}</p>} {/* عرض رسالة الخطأ */}
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
