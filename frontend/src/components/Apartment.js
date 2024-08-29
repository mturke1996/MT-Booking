import React, { useEffect, useState } from "react";
import ApartmentCard from "./ApartmentCard";
import axios from "axios";
import "../App.css";

export default function Apartment() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await axios.get("https://mt-booking.onrender.com/api/apartments");
        const allApartments = response.data;

        if (Array.isArray(allApartments) && allApartments.length > 0) {
          // Shuffle the array to randomize the order
          const shuffledApartments = allApartments.sort(() => 0.5 - Math.random());
          // Select the first 6 apartments from the shuffled list
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
          {/* Display 6 apartments */}
          <div className="custom-col-4">
            {apartments[0] && <ApartmentCard apartment={apartments[0]} />}
          </div>
          <div className="custom-col-4">
            {apartments[1] && <ApartmentCard apartment={apartments[1]} />}
          </div>
          <div className="custom-col-4">
            {apartments[2] && <ApartmentCard apartment={apartments[2]} />}
          </div>
          <div className="custom-col-4">
            {apartments[3] && <ApartmentCard apartment={apartments[3]} />}
          </div>
          <div className="custom-col-4">
            {apartments[4] && <ApartmentCard apartment={apartments[4]} />}
          </div>
          <div className="custom-col-4">
            {apartments[5] && <ApartmentCard apartment={apartments[5]} />}
          </div>
        </div>
      </div>
    </div>
  );
}
