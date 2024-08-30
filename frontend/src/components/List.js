import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Import basic styles
import "react-date-range/dist/theme/default.css"; // Import default theme
import SearchItem from "./SearchItem";

function List() {
  const [date, setDate] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState({ adult: 1, children: 0, room: 1 });
  const [searchQuery, setSearchQuery] = useState("");
  const [apartments, setApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApartments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get("https://mt-booking.onrender.com/api/apartments");

        console.log("Response Status:", response.status); // Log response status
        console.log("Response Data:", response.data); // Log response data

        if (response.status !== 200) {
          throw new Error(`Error: ${response.status}`);
        }

        // Check if the response data is an array
        const data = response.data;
        if (!Array.isArray(data)) {
          throw new Error("Data is not an array");
        }

        const filteredData = data.filter((apartment) => {
          // Ensure the apartment object has the expected properties
          if (!apartment.Adresse || !apartment.Miete || !apartment.Zimmeranzahl) {
            console.warn("Apartment missing expected properties:", apartment);
            return false;
          }

          const matchesQuery = apartment.Adresse.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesPrice = apartment.Miete >= (options.minprice || 0) && apartment.Miete <= (options.maxprice || Infinity);
          const matchesRooms = apartment.Zimmeranzahl >= options.room;
          return matchesQuery && matchesPrice && matchesRooms;
        });
        setApartments(filteredData);
      } catch (error) {
        console.error("Error fetching apartments:", error.message); // Log error message
        setError("Error fetching apartments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApartments();
  }, [searchQuery, options]);

  const handleDateChange = (item) => {
    setDate([item.selection]);
  };

  const toggleOpenDate = () => {
    setOpenDate((prevOpenDate) => !prevOpenDate);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOptionChange = (name, value) => {
    setOptions({
      ...options,
      [name]: value,
    });
  };

  return (
    <div className="listContainer">
      <div className="listWrapper">
        <div className="listSearch">
          <h1 className="lsTitle">Search for Apartments</h1>
          <div className="lsItem">
            <label>Destination</label>
            <input
              placeholder="Enter destination"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="lsItem">
            <label>Check-in Date</label>
            <span onClick={toggleOpenDate}>
              {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
                date[0].endDate,
                "MM/dd/yyyy"
              )}`}
            </span>
            {openDate && (
              <DateRange
                onChange={handleDateChange}
                minDate={new Date()}
                ranges={date}
              />
            )}
          </div>
          <div className="lsItem">
            <label>Options</label>
            <div className="lsOptions">
              {[
                { name: "minprice", label: "Min price" },
                { name: "maxprice", label: "Max price" },
                { name: "adult", label: "Adult" },
                { name: "children", label: "Children" },
                { name: "room", label: "Room" },
              ].map((option) => (
                <div className="lsOptionItem" key={option.name}>
                  <span className="lsOptionText">
                    {option.label}{" "}
                    {option.name.includes("price") ? "per night" : ""}
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    value={options[option.name]}
                    onChange={(e) => handleOptionChange(option.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="listResult">
          {isLoading && <p>Loading apartments...</p>}
          {error && <p>{error}</p>}
          {!isLoading && apartments.length === 0 && <p>No apartments found</p>}
          {apartments.map((apartment) => (
            <SearchItem key={apartment._id} apartment={apartment} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default List;
