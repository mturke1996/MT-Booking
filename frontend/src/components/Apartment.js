import React, { useEffect, useState } from "react";
import ApartmentCard from "./ApartmentCard";
import axios from "axios";
import "../App.css";

export default function Apartment() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://mt-booking.onrender.com/api/apartments")
      .then((response) => {
        const allApartments = response.data;
        const selectedIndices = [0, 3, 4, 6, 12, 14];
        const selectedApartments = selectedIndices.map(
          (index) => allApartments[index]
        );
        setApartments(selectedApartments);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching apartments:", error);
        setError(error.message);
        setLoading(false);
      });
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
          {apartments.map((apartment) => (
            <div key={apartment._id} className="custom-col-4">
              <ApartmentCard apartment={apartment} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
