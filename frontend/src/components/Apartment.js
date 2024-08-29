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

        // Check if allApartments is an array and has at least 15 items
        if (Array.isArray(allApartments) && allApartments.length >= 15) {
          const selectedIndices = ["66d063be1e5fee2817f80d8b", "66d063e01e5fee2817f80d8f", "66d063f61e5fee2817f80d93", "66d064fe1e5fee2817f80dbb", "66d0658b1e5fee2817f80dcf", "66d065ea1e5fee2817f80de1"];
          const selectedApartments = selectedIndices
            .filter(index => index < allApartments.length)
            .map(index => allApartments[index]);

          setApartments(selectedApartments);
        } else {
          console.warn("API returned unexpected data or insufficient data.");
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
}
