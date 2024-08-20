import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);

      // استدعاء API للحصول على بيانات المستخدم
      axios
        .get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
        .then((response) => {
          setUser(response.data); // استرجاع بيانات المستخدم من الاستجابة
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // التعامل مع الأخطاء هنا، مثل تسجيل خروج المستخدم إذا كان التوكن غير صالح
        });
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken"); // حذف التوكن من localStorage عند تسجيل الخروج
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

          {/* Add more routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
