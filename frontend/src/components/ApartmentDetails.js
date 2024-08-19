import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // import the default styles
import "react-date-range/dist/theme/default.css"; // import the default theme

const ApartmentDetails = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [images, setImages] = useState([]);
  const [date, setDate] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  }]);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/apartments/${id}`)
      .then((response) => {
        setApartment(response.data);
        setImages([
          response.data.img1,
          response.data.img2,
          response.data.img3,
          response.data.img4,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching apartment details:", error);
      });
  }, [id]);

  const handleDateChange = (ranges) => {
    setDate([ranges.selection]);
  };

  const handleSearchSubmit = () => {
    // Implement the search submit logic here
    console.log("Search clicked", { date, options });
  };

  if (!apartment)
    return (
      <p style={{ marginTop: "300px", textAlign: "center" }}>Loading...</p>
    );

  const renderAmenities = () => {
    return (
      <div className="flex flex-wrap gap-4 mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🌐</span>
          <span>Wi-Fi</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xl">🅿️</span>
          <span>Parking</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xl">🏊</span>
          <span>Pool</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xl">🐾</span>
          <span>Pets Allowed</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xl">🛏️</span>
          <span>{apartment.Zimmeranzahl} Bedrooms</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">{apartment.Adresse}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative">
          <Carousel showThumbs={false} infiniteLoop autoPlay>
            {images.map(
              (img, index) =>
                img && (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <img
                      src={img}
                      alt={`Apartment image ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )
            )}
          </Carousel>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Details</h3>
            <p>
              <strong>Rooms:</strong> {apartment.Zimmeranzahl}
            </p>
            <p>
              <strong>Size:</strong> {apartment["Fläche (m²)"]} m²
            </p>
            <p>
              <strong>Rent:</strong> {apartment["Monatliche Miete"]} €/month
            </p>
            <p className="mt-4">
              <strong>Description:</strong> {apartment.Beschreibung}
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Amenities</h3>
            {renderAmenities()}
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Search</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label>Check-in Date</label>
                <span
                  onClick={() => setOpenDate(!openDate)}
                  className="block mt-1 cursor-pointer"
                >
                  {`${date[0].startDate.toLocaleDateString()} to ${date[0].endDate.toLocaleDateString()}`}
                </span>
                {openDate && (
                  <DateRange
                    onChange={handleDateChange}
                    minDate={new Date()}
                    ranges={date}
                  />
                )}
              </div>
              <div>
                <label>Options</label>
                <div className="space-y-2 mt-2">
                  <div>
                    <span className="block">Min price <small>per night</small></span>
                    <input type="number" className="w-full mt-1 p-2 border rounded" />
                  </div>
                  <div>
                    <span className="block">Max price <small>per night</small></span>
                    <input type="number" className="w-full mt-1 p-2 border rounded" />
                  </div>
                  <div>
                    <span className="block">Adult</span>
                    <input
                      type="number"
                      min={1}
                      className="w-full mt-1 p-2 border rounded"
                      value={options.adult}
                      onChange={(e) => setOptions({ ...options, adult: e.target.value })}
                    />
                  </div>
                  <div>
                    <span className="block">Children</span>
                    <input
                      type="number"
                      min={0}
                      className="w-full mt-1 p-2 border rounded"
                      value={options.children}
                      onChange={(e) => setOptions({ ...options, children: e.target.value })}
                    />
                  </div>
                  <div>
                    <span className="block">Room</span>
                    <input
                      type="number"
                      min={1}
                      className="w-full mt-1 p-2 border rounded"
                      value={options.room}
                      onChange={(e) => setOptions({ ...options, room: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSearchSubmit}
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
        {/* <Reviews apartmentId={id} /> */}
      </div>
    </div>
  );
};

export default ApartmentDetails;
