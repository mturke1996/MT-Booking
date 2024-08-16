import React from "react";
import "../App.css";

const SearchItem = ({ apartment }) => {
  return (
    <div className="searchItem">
      <img
        src={apartment.img1}
        alt={apartment.Adresse}
        className="siImg"
      />
      <div className="siDesc">
        <h1 className="siTitle">{apartment.Adresse}</h1>
        <span className="siDistance">500m from center</span>
        <span className="siTaxiOp">Free airport taxi</span>
        <span className="siSubtitle">
          {apartment.Beschreibung}
        </span>
        <span className="siFeatures">
          {`Rooms: ${apartment.Zimmeranzahl} • Area: ${apartment["Fläche (m²)"]}m²`}
        </span>
        <span className="siCancelOp">Free cancellation</span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="siDetails">
        <div className="siRating">
          <span>Excellent</span>
          <button>{apartment.rating || 8.9}</button> {/* فرضنا أن لديك خاصية للتقييم */}
        </div>
        <div className="siDetailTexts">
          <span className="siPrice">{`${apartment["Monatliche Miete"]}€`}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button className="siCheckButton">See availability</button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
