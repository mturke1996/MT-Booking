import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const apiKey = 'b4f4314f282d134fd834515ad5d5fc29'; // ضع مفتاح الـ API الخاص بك هنا

  const getWeather = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setError('');
    } catch (error) {
      setWeather(null);
      setError('City not found');
    }
  };

  return (
    <div className="container">
      <div className="weather-container">
        <h1 className="title">Weather App</h1>
        <form onSubmit={getWeather} className="form">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input"
          />
          <button type="submit" className="button">Get Weather</button>
        </form>
        {error && <p className="error">{error}</p>}
        {weather && (
          <div className="weather-info">
            <h2 className="city-name">Weather in {weather.name}</h2>
            <p className="description">{weather.weather[0].description}</p>
            <p className="temperature">Temperature: {weather.main.temp}°C</p>
            <p className="humidity">Humidity: {weather.main.humidity}%</p>
            <p className="wind-speed">Wind Speed: {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
