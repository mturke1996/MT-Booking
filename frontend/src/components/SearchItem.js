import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const SearchItem = ({ apartment }) => {
  if (!apartment || !apartment.Adresse || !apartment.img1) {
    console.error("Missing apartment data:", apartment);
    return null;
  }

  return (
    <div className="searchItem">
      <img src={apartment.img1} alt={apartment.Adresse} className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{apartment.Adresse}</h1>
        <span className="siDistance">500m from center</span>
        <span className="siTaxiOp">Free airport taxi</span>
        <span className="siSubtitle">{apartment.Beschreibung}</span>
        <span className="siFeatures">
          {`Rooms: ${apartment.Zimmeranzahl} • Area: ${apartment.Flaeche}m²`}
        </span>
        <span className="siCancelOp">Free cancellation</span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="siDetails">
        <div className="siRating">
          <span>Excellent</span>
          <button>{apartment.rating || 8.9}</button>{" "}
        </div>
        <div className="siDetailTexts">
          <span className="siPrice">{`${apartment.Miete}€`}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button className="siCheckButton">
            <Link to={`/apartment/${apartment._id}`} style={{color: "white"}}}>
              See availability
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
