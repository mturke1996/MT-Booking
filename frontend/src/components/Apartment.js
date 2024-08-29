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
        const response = await axios.get(
          "https://mt-booking.onrender.com/api/apartments"
        );
        console.log("API Response:", response.data); // Debugging line to inspect the response
        const allApartments = response.data;

        // Check if allApartments is an array
        if (Array.isArray(allApartments)) {
          console.log("Number of Apartments:", allApartments.length); // Debugging line to check the number of items

          // Define the selected IDs
          const selectedIndices = [
            "66d063be1e5fee2817f80d8b",
            "66d063e01e5fee2817f80d8f",
            "66d063f61e5fee2817f80d93",
            "66d064fe1e5fee2817f80dbb",
            "66d0658b1e5fee2817f80dcf",
            "66d065ea1e5fee2817f80de1",
          ];

          // Filter apartments by ID
          const selectedApartments = allApartments.filter((apartment) =>
            selectedIndices.includes(apartment._id)
          );

          console.log("Selected Apartments:", selectedApartments); // Debugging line to check filtered apartments
          setApartments(selectedApartments);
        } else {
          console.warn("API returned unexpected data format.");
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
