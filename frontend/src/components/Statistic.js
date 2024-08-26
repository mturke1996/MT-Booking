import React from "react";
import "../App.css"; 

export default function Statistic() {
  return (
    <div className="container">
      <div className="custom-row mt-5">
        <div className="custom-col-12 custom-col-lg-6">
          <br />
          <br />
          <h3>
            Our’s Company
            <br />
            Statistics
          </h3>
          <br />
          <br />
          <br />
          <p>
          With our booking app, you can complete your booking in under 2 minutes,
           with 95% confirmed instantly, making your experience quick and hassle-free. Trusted by users worldwide, our app boasts a 4.8-star rating,
            backed by thousands of positive reviews. You’ll also gain access to deals you won’t find anywhere else, available 24/7, with personalized recommendations tailored to your preferences. 
            Plus, enjoy the peace of mind with secure payments and responsive customer support that resolves 90% of issues within 24 hours. As a bonus, you’ll earn rewards with every booking, making your next trip even more affordable.
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
