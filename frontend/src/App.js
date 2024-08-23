import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Weather from "./components/Weather";
import Profile from "./components/Profile";
import ApartmentForm from "./components/ApartmentForm";
import List from "./components/List";
import ApartmentDetails from "./components/ApartmentDetails";

function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    if (token && !user) {
      axios
        .get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setToken(null);
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        });
    }
  }, [token, user]);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
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
          <Route path="/Weather" element={<Weather />} />
          <Route path="/addApartment" element={<ApartmentForm />} />
          <Route path="/Searchitem" element={<List />} />
          <Route path="/apartment/:id" element={<ApartmentDetails />} />
          {/* أضف المزيد من المسارات حسب الحاجة */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
