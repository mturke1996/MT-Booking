// src/components/Login.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

export default function Login({ setToken, setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      setToken(response.data.token);
      setUser({ username }); 
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed, please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h4 style={{color: "black", textAlign: "center", paddingBottom: "30px"}}>Login</h4>
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
        <button onClick={login} className="login-button">
          Login
        </button>
        <p className="register-link" style={{color: "black"}}>
          Don't have an account? <Link to="/register" style={{color: "blue"}}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
