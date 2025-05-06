// WeatherDisplay.js
import React from 'react';
import '../App.css'
// import '../styles/WeatherDisplay.css';

function WeatherDisplay({ temperature, condition }) {
  // Map weather conditions to icons
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear': return '☀️';
      case 'clouds': return '☁️';
      case 'rain': return '🌧️';
      case 'snow': return '❄️';
      default: return '🌡️';
    }
  };

  return (
    <div className="weather-display">
      <span className="weather-icon">{getWeatherIcon(condition)}</span>
      <span className="temperature">{Math.round(temperature)}°C</span>
    </div>
  );  
}

export default WeatherDisplay;