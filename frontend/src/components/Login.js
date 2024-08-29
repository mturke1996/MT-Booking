import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

export default function Login({ setToken, setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // إضافة حالة لتخزين رسائل الخطأ
  const [loading, setLoading] = useState(false); // حالة لتحميل المستخدم
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // منع إعادة تحميل الصفحة عند الإرسال

    // التحقق من صحة البيانات
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError(""); // مسح الرسالة السابقة

    try {
      const response = await axios.post("https://mt-booking.onrender.com/login", {
        username,
        password,
      });

      const { token } = response.data;

      // تخزين التوكن في localStorage
      localStorage.setItem("authToken", token);

      setToken(token);

      // استدعاء API للحصول على بيانات المستخدم بعد تسجيل الدخول
      const userResponse = await axios.get("https://mt-booking.onrender.com/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userResponse.data); // تخزين بيانات المستخدم في الحالة

      localStorage.setItem("user", JSON.stringify(userResponse.data));

      navigate("/"); 
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again."); // تعيين رسالة الخطأ
    } finally {
      setLoading(false); // إيقاف التحميل بعد الانتهاء
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h4
          style={{ color: "black", textAlign: "center", paddingBottom: "30px" }}
        >
          Login
        </h4>
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
          {error && <p className="error-message">{error}</p>} {/* عرض رسالة الخطأ */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="register-link" style={{ color: "black" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "blue" }}>
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
