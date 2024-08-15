import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

export default function ApartmentCard() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/apartments')
      .then(response => {
        const allApartments = response.data;

        // Select specific apartments by index without repetition
        const selectedIndices = [0, 3, 4, 6, 12, 14];
        const selectedApartments = selectedIndices.map(index => allApartments[index]);

        // Remove duplicates if any
        const uniqueApartments = Array.from(new Set(selectedApartments.map(apartment => apartment.id)))
                                      .map(id => {
                                        return selectedApartments.find(apartment => apartment.id === id);
                                      });

        setApartments(uniqueApartments);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching apartments:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="custom-row">
      {apartments.map((apartment) => (
        <div key={apartment.id} className="custom-col-4">
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
        </div>
      ))}
    </div>
  );
}
