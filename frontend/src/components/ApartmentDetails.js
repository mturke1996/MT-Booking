import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import Reviews from "./Reviews";
import "../App.css";

const ApartmentDetails = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [images, setImages] = useState([]);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const [bookingMessage, setBookingMessage] = useState("");
  const [loading, setLoading] = useState(false); // إدارة حالة التحميل

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchApartment = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://mt-booking.onrender.com/api/apartments/${id}`);
        setApartment(response.data);
        setImages([
          response.data.img1,
          response.data.img2,
          response.data.img3,
          response.data.img4,
        ]);
      } catch (error) {
        console.error("Error fetching apartment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id]);

  const handleDateChange = (ranges) => {
    setDate([ranges.selection]);
  };

  const handleSearchSubmit = async () => {
    if (!user) {
      setBookingMessage("You need to be logged in to make a booking.");
      return;
    }

    if (!date[0].startDate || !date[0].endDate) {
      setBookingMessage("Please select valid dates.");
      return;
    }

    setLoading(true);
    setBookingMessage("");
    
    try {
      const response = await axios.post("https://mt-booking.onrender.com/api/bookings", {
        apartmentId: id,
        username: user.username,
        startDate: format(date[0].startDate, "yyyy-MM-dd"),
        endDate: format(date[0].endDate, "yyyy-MM-dd"),
        adult: options.adult,
        children: options.children,
        room: options.room,
      });
      console.log("Booking successful:", response.data);
      setBookingMessage("Your booking was successful!");
    } catch (error) {
      console.error("Error booking apartment:", error);
      setBookingMessage("There was an error with your booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderAmenities = () => {
    const amenities = [
      { icon: "🌐", label: "Wi-Fi" },
      { icon: "🅿️", label: "Parking" },
      { icon: "🏊", label: "Pool" },
      { icon: "🐾", label: "Pets Allowed" },
      { icon: "🛏️", label: `${apartment?.Zimmeranzahl} Bedrooms` },
      { icon: "📷", label: "überwachung" },
    ];

    return (
      <div className="amenities">
        {amenities.map((amenity, index) => (
          <div key={index} className="amenity-item">
            <span className="text-xl">{amenity.icon}</span>
            <span>{amenity.label}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading)
    return (
      <p className="loading" style={{ marginTop: "300px", textAlign: "center" }}>
        Loading...
      </p>
    );

  if (!apartment)
    return (
      <p className="loading" style={{ marginTop: "300px", textAlign: "center" }}>
        Apartment not found.
      </p>
    );

  return (
    <div className="listContainer">
      <div className="listWrapper">
        <div className="details flex-1">
          <h2 className="text-3xl font-bold mb-6">{apartment.Adresse}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="carousel-container relative">
              <Carousel showThumbs={false} infiniteLoop autoPlay>
                {images.map(
                  (img, index) =>
                    img && (
                      <div key={index} className="carousel-item rounded-lg overflow-hidden">
                        <img
                          src={img}
                          alt={`Apartment image ${index + 1}`}
                          className="carousel-image w-full h-64 object-cover"
                        />
                      </div>
                    )
                )}
              </Carousel>
            </div>
            <div className="details-info" style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Details</h3>
                <p>
                  <strong>Rooms:</strong> {apartment.Zimmeranzahl}
                </p>
                <p>
                  <strong>Size:</strong> {apartment["Fläche (m²)"]} m²
                </p>
                <p>
                  <strong>Rent:</strong> {apartment["Monatliche Miete"]} €/per Night
                </p>
                <p className="mt-4">
                  <strong>Description:</strong> {apartment.Beschreibung}
                </p>
              </div>
            </div>
            <div className="amenities-section">
              <h3 className="text-2xl font-semibold mb-4">Amenities</h3>
              {renderAmenities()}
            </div>
            <hr />
            <div className="reviews-section mt-8">
              <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
              <Reviews apartmentId={id} />
            </div>
          </div>
        </div>
        <div className="listSearch">
          <div className="listWrapper">
            <h1 className="lsTitle">Booking</h1>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span
                onClick={() => setOpenDate(!openDate)}
                className="date-selector block mt-1 cursor-pointer"
              >
                {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(date[0].endDate, "MM/dd/yyyy")}`}
              </span>
              {openDate && (
                <DateRange
                  onChange={handleDateChange}
                  minDate={new Date()}
                  ranges={date}
                  className="date-range"
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={options.adult}
                    onChange={(e) =>
                      setOptions({ ...options, adult: e.target.value })
                    }
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    value={options.children}
                    onChange={(e) =>
                      setOptions({ ...options, children: e.target.value })
                    }
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={options.room}
                    onChange={(e) =>
                      setOptions({ ...options, room: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <button
              className="search-button"
              onClick={handleSearchSubmit}
              disabled={loading}
            >
              {loading ? "Processing..." : "Book Now"}
            </button>
            {bookingMessage && (
              <p className="booking-message mt-4">{bookingMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetails;
