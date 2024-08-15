// src/components/ApartmentCard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const ApartmentCard = ({ id }) => {
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/apartments/${id}`)
        .then(response => {
          console.log('Fetched apartment:', response.data); // Debugging line
          setApartment(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching apartment:', error);
          setError(error.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!apartment) return <div>No apartment found</div>;

  return (
    <div className="apartment-box">
      <div className="apartment-image">
        <img src={apartment.img1} alt={apartment.Adresse} />
      </div>
      <div className="apartment-info">
        <div className="apartment-title">
          <p>{apartment.Adresse}</p>
        </div>
      </div>
      <div className="apartment-details">
        <div className="price">
          <p>${apartment["Monatliche Miete"]}</p>
        </div>
        <div className="details-item">
          <p>{apartment.Zimmeranzahl} BD</p>
        </div>
      </div>
    </div>
  );
}

export default ApartmentCard;
