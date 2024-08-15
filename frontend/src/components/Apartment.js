import React from "react";
import ApartmentCard from "./ApartmentCard";
import "../App.css";

export default function Apartment() {
  return (
    <div className="apartment">
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
          <div className="custom-col-4">
            <ApartmentCard />
          </div>
          <div className="custom-col-4">
            <ApartmentCard />
          </div>
          <div className="custom-col-4">
            <ApartmentCard />
          </div>
          <div className="custom-col-4">
            <ApartmentCard />
          </div>
          <div className="custom-col-4">
            <ApartmentCard />
          </div>
          <div className="custom-col-4">
            <ApartmentCard />
          </div>
        </div>
        <div className="custom-row">
          <div className="custom-col-12">
            <div className="search lux-shadow search-apartment">
              <input
                type="text"
                className="search-input left"
                placeholder="Search Location"
              />
              <button className="search-btn left">Search</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
