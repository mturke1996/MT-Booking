import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Calendarselect() {
  const [dates, setDates] = useState([new Date(), new Date()]); // Initial dates

  const onChange = (selectedDates) => {
    setDates(selectedDates);
  };

  const [checkIn, checkOut] = dates;

  return (
    <div className='container'>
      <div className='calendar-main'>
      <h2>Select Check-in and Check-out Dates</h2>
      <Calendar
        onChange={onChange}
        value={dates}
        selectRange={true}
      />
      {checkIn && checkOut && (
        <div>
          <p>
            <strong>Check-in:</strong> {checkIn.toDateString()}
          </p>
          <p>
            <strong>Check-out:</strong> {checkOut.toDateString()}
          </p>
        </div>
      )}
      </div>
     
    </div>
  );
}

export default Calendarselect;