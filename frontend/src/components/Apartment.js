import React, { useEffect, useState } from "react";
import ApartmentCard from "./ApartmentCard";
import axios from "axios";
import "../App.css";

// Helper function to shuffle an array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const Apartment = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await axios.get("https://mt-booking.onrender.com/api/apartments");
        const allApartments = response.data;

        if (Array.isArray(allApartments) && allApartments.length > 0) {
          // Shuffle and select 6 random apartments
          const shuffledApartments = shuffleArray(allApartments);
          const selectedApartments = shuffledApartments.slice(0, 6);
          setApartments(selectedApartments);
        } else {
          console.warn("API returned unexpected data format or no data.");
        }
      } catch (error) {
        console.error("Error fetching apartments:", error);
        setError("Error fetching apartments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="apartments">
      <div className="container">
        <div className="custom-row">
          <div className="custom-col-12">
            <h2>
              More Than 500+
              <br />
              Apartments for Rent
            </h2>
          </div>
        </div>
        <div className="custom-row">
          {apartments.length > 0 ? (
            apartments.map((apartment) => (
              <div key={apartment._id} className="custom-col-4">
                <ApartmentCard apartment={apartment} />
              </div>
            ))
          ) : (
            <div>No apartments available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Apartment;
