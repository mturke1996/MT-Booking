import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [apartments, setApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      fetchApartments();
    }
  }, [searchQuery]);

  const fetchApartments = () => {
    setIsLoading(true);
    setError(null);

    fetch(`http://localhost:5000/api/apartments`)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((apartment) =>
          apartment.Adresse.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setApartments(filteredData);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Error fetching apartments");
        setIsLoading(false);
      });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchApartments();

    // التنقل إلى صفحة النتائج مع تمرير الشقق المصفاة
    navigate("/Searchitem", {
      state: { results: apartments },
    });
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
                placeholder="Enter Address"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button onClick={handleSearchSubmit}>Search</button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Hero;
