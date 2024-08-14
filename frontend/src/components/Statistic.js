import React from "react";
import "../App.css"; // تأكد من وجود هذا الملف وتحوي الأنماط المخصصة

export default function Statistic() {
  return (
    <div className="container">
      <div className="custom-row mt-5">
        <div className="custom-col-12 custom-col-lg-6">
          <h3>
            Our’s Company
            <br />
            Statistics
          </h3>
          <p>
            In this space market-facing, yet UI work flows, or bake it in. Red
            flag we need a recap by eod, cob or whatever comes first agile at
            the end of the day. Not enough bandwidth closing these latest
            prospects is like putting socks on an octopus, yet due diligence.
          </p>
          <p>
            We need to get all stakeholders up to speed and in the right place
            hard stop, or technologically savvy or pre launch. Pro-sumer
            software commitment to the cause offline this discussion and wiggle
            room blue sky. Beef up teams were able to drive adoption and
            awareness. Screw the pooch killing it.
          </p>
        </div>
        <div className="custom-col-12 custom-col-lg-6 statistic-wrapper">
          <div className="statistic-box text-center">
            <p>385</p>
            <p>Clients</p>
          </div>
          <div className="statistic-box text-center">
            <p>500</p>
            <p>Apartments</p>
          </div>
          <div className="statistic-box text-center">
            <p>17</p>
            <p>Awards</p>
          </div>
          <div className="statistic-box text-center">
            <p>50</p>
            <p>Employees</p>
          </div>
        </div>
      </div>
    </div>
  );
}
