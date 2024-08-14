// src/App.js

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ApartmentForm from "./components/ApartmentForm";
function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); 

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login setToken={setToken} setUser={setUser} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addApartment" element={<ApartmentForm />} />

          {/* Add more routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
