import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css"; // تأكد من وجود هذا الملف وتحديثه ليتناسب مع التصميم الذي تريده

export default function ApartmentCard() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch apartments data from the API
    axios.get('http://localhost:5000/api/apartments') // هنا نستخدم الرابط الكامل
      .then(response => {
        setApartments(response.data);
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
    <div className="apartments">
      <div className="container">
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
                  <div className="price left">
                    <p>${apartment["Monatliche Miete"]}</p>
                  </div>
                  <div className="details-item right flex-center">
                    <img src="bed_icon_url_here" alt="Bedrooms" />
                    <p>{apartment.Zimmeranzahl} BD</p>
                  </div>
                  <div className="details-item right flex-center">
                    <img src="bath_icon_url_here" alt="Bathrooms" />
                    <p>2 BA</p> {/* Assuming a static number of bathrooms as it's not provided */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
