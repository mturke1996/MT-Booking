import React, { Component } from "react";
import "../App.css";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "./SearchItem"; // استيراد SearchItem

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      destination: "",
      date: [{ startDate: new Date(), endDate: new Date() }],
      openDate: false,
      options: { adult: 1, children: 0, room: 1 },
      searchQuery: "",
      apartments: [],
      isLoading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchApartments();
  }

  fetchApartments = () => {
    const { searchQuery } = this.state;
    this.setState({ isLoading: true, error: null });

    fetch(`http://localhost:5000/api/apartments`)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((apartment) =>
          apartment.Adresse.toLowerCase().includes(searchQuery.toLowerCase())
        );
        this.setState({ apartments: filteredData, isLoading: false });
      })
      .catch((error) =>
        this.setState({ error: "Error fetching apartments", isLoading: false })
      );
  };

  handleDateChange = (item) => {
    this.setState({ date: [item.selection] });
  };

  toggleOpenDate = () => {
    this.setState((prevState) => ({ openDate: !prevState.openDate }));
  };

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleSearchSubmit = (event) => {
    event.preventDefault();
    this.fetchApartments();
  };

  render() {
    const { date, openDate, options, apartments, isLoading, error } = this.state;

    return (
      <div>
        <div className="listContainer">
          <div className="listWrapper">
            <div className="listSearch">
              <h1 className="lsTitle">Search</h1>
              <div className="lsItem">
                <label>Destination</label>
                <input
                  placeholder="Enter destination"
                  type="text"
                  value={this.state.searchQuery}
                  onChange={this.handleSearchChange}
                />
              </div>
              <div className="lsItem">
                <label>Check-in Date</label>
                <span onClick={this.toggleOpenDate}>
                  {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
                    date[0].endDate,
                    "MM/dd/yyyy"
                  )}`}
                </span>
                {openDate && (
                  <DateRange
                    onChange={this.handleDateChange}
                    minDate={new Date()}
                    ranges={date}
                  />
                )}
              </div>
              <div className="lsItem">
                <label>Options</label>
                <div className="lsOptions">
                  <div className="lsOptionItem">
                    <span className="lsOptionText">
                      Min price <small>per night</small>
                    </span>
                    <input type="number" className="lsOptionInput" />
                  </div>
                  <div className="lsOptionItem">
                    <span className="lsOptionText">
                      Max price <small>per night</small>
                    </span>
                    <input type="number" className="lsOptionInput" />
                  </div>
                  <div className="lsOptionItem">
                    <span className="lsOptionText">Adult</span>
                    <input
                      type="number"
                      min={1}
                      className="lsOptionInput"
                      placeholder={options.adult}
                    />
                  </div>
                  <div className="lsOptionItem">
                    <span className="lsOptionText">Children</span>
                    <input
                      type="number"
                      min={0}
                      className="lsOptionInput"
                      placeholder={options.children}
                    />
                  </div>
                  <div className="lsOptionItem">
                    <span className="lsOptionText">Room</span>
                    <input
                      type="number"
                      min={1}
                      className="lsOptionInput"
                      placeholder={options.room}
                    />
                  </div>
                </div>
              </div>
              <button onClick={this.handleSearchSubmit}>Search</button>
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
      </div>
    );
  }
}

export default List;
