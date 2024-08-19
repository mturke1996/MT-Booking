import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // استيراد useNavigate
import "../App.css";

function Hero() {
  // إعداد الحالة لتخزين مدخلات البحث
  const [location, setLocation] = useState("");
  // const [checkInDate, setCheckInDate] = useState("");
  // const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate(); // إنشاء دالة التنقل

  // دالة للبحث عن الشقق
  const handleSearch = async () => {
    try {
      // إرسال طلب HTTP لجلب البيانات
      const response = await fetch("http://localhost:5000/api/apartments");
      const data = await response.json();

      // تصفية النتائج بناءً على المدخلات
      const filteredResults = data.filter((apartment) => {
        return apartment.Adresse.toLowerCase().includes(location.toLowerCase());
      });

      // تحديث حالة النتائج
      setSearchResults(filteredResults);

      // التنقل إلى صفحة /Searchitem مع تمرير البيانات
      navigate("/Searchitem", {
        state: {
          location,
          // checkInDate,
          // checkOutDate,
          guests,
          results: filteredResults,
        },
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div>
      <header className="hero">
        <div className="hero-content">
          <div className="search-bar">
            <div>
              <h1>Good Morning!</h1>
              <p>Explore beautiful places in the world with MT Booking</p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {/* <input
                type="date"
                placeholder="Check-in"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
              />
              <input
                type="date"
                placeholder="Check-out"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
              /> */}
              <input
                type="number"
                placeholder="Guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min="1"
              />
              <button onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>
      </header>
      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((apartment) => (
            <div key={apartment["Wohnungs-ID"]} className="search-item">
              <h2>{apartment.Adresse}</h2>
              <p>Rooms: {apartment.Zimmeranzahl}</p>
              <p>Area: {apartment["Fläche (m²)"]} m²</p>
              <p>Price: {apartment["Monatliche Miete"]} per month</p>
              <img src={apartment.img1} alt={apartment.Beschreibung} />
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default Hero;
