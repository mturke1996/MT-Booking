import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";

const MyBooking = ({ username }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [apartments, setApartments] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/bookings")
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, []);

  useEffect(() => {
    if (username) {
      const filtered = bookings.filter(
        (booking) => booking.username === username
      );
      setFilteredBookings(filtered);

      const fetchApartmentDetails = async (apartmentIds) => {
        try {
          const responses = await Promise.all(
            apartmentIds.map((id) =>
              axios.get(`http://localhost:5000/api/apartments/${id}`)
            )
          );
          const apartmentsData = responses.reduce((acc, response) => {
            acc[response.data["Wohnungs-ID"]] = response.data;
            return acc;
          }, {});
          setApartments(apartmentsData);
        } catch (error) {
          console.error("Error fetching apartment details:", error);
        }
      };

      const apartmentIds = filtered.map((booking) => booking.apartmentId);
      fetchApartmentDetails(apartmentIds);
    }
  }, [username, bookings]);

  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
      setFilteredBookings(filteredBookings.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handlePay = (bookingId) => {
    console.log("Initiate payment for booking:", bookingId);
  };

  return (
    <div className="container">
      <h2 style={{ marginTop: "75px", marginBottom: "20px" }}>My Bookings</h2>
      <div className="">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking, index) => {
            const apartment = apartments[booking.apartmentId] || {};
            return (
              <div
                key={index}
                className="searchItem bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                <img
                  src={apartment.img1}
                  alt={apartment.Adresse}
                  className="siImg"
                  style={{ height: "350px", width: "40%" }}
                />
                <div className="siDesc">
                  <h1 className="siTitle text-2xl font-semibold mb-2">
                    {apartment.Adresse || "Unknown Address"}
                  </h1>
                  <span className="siDistance text-gray-500 text-sm">
                    500m from center
                  </span>
                  <span className="siTaxiOp text-gray-500 text-sm">
                    Free airport taxi
                  </span>
                  <p className="siSubtitle mt-2 text-gray-700">
                    {apartment.Beschreibung || "No description available"}
                  </p>
                  <p className="siFeatures mt-2 text-gray-600">
                    {`Rooms: ${apartment.Zimmeranzahl || "N/A"} • Area: ${
                      apartment["Fläche (m²)"] || "N/A"
                    } m²`}
                  </p>
                  <p className="siCancelOp mt-2 text-gray-600">
                    Free cancellation
                  </p>
                  <p className="siCancelOpSubtitle mt-1 text-gray-500 text-sm">
                    You can cancel later, so lock in this great price today!
                  </p>
                </div>
                <div className="siDetails p-4 border-t border-gray-200">
                  <div className="siRating flex items-center mb-2">
                    <span className="text-gray-600 text-sm">Excellent</span>
                    <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
                      {apartment.rating || 8.9}
                    </button>
                  </div>
                  <div className="siDetailTexts">
                    <span className="siPrice text-2xl font-bold">{`${
                      apartment["Monatliche Miete"] || "N/A"
                    }€ per night`}</span>
                    <span className="siTaxOp block text-gray-500 text-sm">
                      Includes taxes and fees
                    </span>
                    <div className="booking-info mt-4">
                      <p>
                        <strong>Check-in:</strong> {booking.startDate}
                      </p>
                      <p>
                        <strong>Check-out:</strong> {booking.endDate}
                      </p>
                      <p>
                        <strong>Guests:</strong> {booking.adult} Adults,{" "}
                        {booking.children} Children
                      </p>
                      <p>
                        <strong>Room:</strong> {booking.room} Room(s)
                      </p>
                    </div>
                    <div className="flex mt-4 space-x-2">
                      <div>
                        <Link
                          to={`/apartment/${apartment["Wohnungs-ID"]}`}
                          className="siCheckButton button"
                        >
                          See availability
                        </Link>
                      </div>
                      <div>
                        <button
                          onClick={() => handlePay(booking.id)}
                          className="pay-button button"
                        >
                          Pay
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="delete-button button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center">
            No bookings found for {username}.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyBooking;
