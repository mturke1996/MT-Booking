import React, { useState, useEffect } from "react";
import "../App.css";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Import basic styles
import "react-date-range/dist/theme/default.css"; // Import default theme
import SearchItem from "./SearchItem";

function List() {
  // State hooks
  const [date, setDate] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState({ adult: 1, children: 0, room: 1 });
  const [searchQuery, setSearchQuery] = useState("");
  const [apartments, setApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch apartments when searchQuery changes
  useEffect(() => {
    fetchApartments();
  }, [searchQuery]);

  const fetchApartments = () => {
    setIsLoading(true);
    setError(null);

    fetch(`http://localhost:5000/api/apartments`)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((apartment) =>
          apartment.Adresse.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setApartments(filteredData);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Error fetching apartments");
        setIsLoading(false);
      });
  };

  const handleDateChange = (item) => {
    setDate([item.selection]);
  };

  const toggleOpenDate = () => {
    setOpenDate((prevOpenDate) => !prevOpenDate);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchApartments();
  };

  return (
    <div className="listContainer">
      <div className="listWrapper">
        <div className="listSearch">
          <h1 className="lsTitle">Search</h1>
          <form onSubmit={handleSearchSubmit}>
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
                {["Min price", "Max price", "Adult", "Children", "Room"].map((option, index) => (
                  <div className="lsOptionItem" key={index}>
                    <span className="lsOptionText">
                      {option} <small>{option.includes("price") ? "per night" : ""}</small>
                    </span>
                    <input
                      type="number"
                      className="lsOptionInput"
                      value={options[option.toLowerCase().replace(" ", "")] || ""}
                      onChange={(e) => setOptions({
                        ...options,
                        [option.toLowerCase().replace(" ", "")]: e.target.value
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button type="submit">Search</button>
          </form>
        </div>
        <div className="listResult">
          {isLoading && <p>Loading apartments...</p>}
          {error && <p>{error}</p>}
          {apartments.map((apartment) => (
            <SearchItem key={apartment["Wohnungs-ID"]} apartment={apartment} />
          ))}
          {!isLoading && apartments.length === 0 && <p>No apartments found</p>}
        </div>
      </div>
    </div>
  );
}

export default List;
