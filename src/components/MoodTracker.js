// MoodTracker.js
import React, { useState, useEffect } from 'react';
import MoodSelector from './MoodSelector';
import Calendar from './Calendar';
import WeatherDisplay from './WeatherDisplay';
import { getCurrentDateFormatted } from '../utils/dateUtils';
import { fetchWeatherData } from '../utils/weatherUtils';
// import '../styles/MoodTracker.css';
import '../App.css'

function MoodTracker({ onSaveMood, switchView }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [currentDate, setCurrentDate] = useState(getCurrentDateFormatted());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Get user's location and fetch weather data
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude)
            .then(data => {
              setWeatherData(data);
            })
            .catch(error => console.error('Error fetching weather data:', error));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleSave = () => {
    if (!selectedMood) {
      alert('Please select a mood before saving.');
      return;
    }

    const entry = {
      date: new Date().toISOString(),
      mood: selectedMood,
      note: note,
      weather: weatherData ? {
        temperature: weatherData.main.temp,
        condition: weatherData.weather[0].main
      } : null
    };

    onSaveMood(entry);
    setShowConfirmation(true);
    setSelectedMood(null);
    setNote('');

    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(month);
  };

  return (
    <div className="mood-tracker">
      <div className="header">
        <h1>MoodMate</h1>
        {weatherData && (
          <WeatherDisplay temperature={weatherData.main.temp} condition={weatherData.weather[0].main} />
        )}
      </div>
      
      <div className="content">
        <div className="left-panel">
          <h2>{currentDate}</h2>
          <p className="question">How are you feeling today?</p>
          
          <MoodSelector selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
          
          <textarea
            className="note-input"
            placeholder="Add a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          
          <button className="save-button" onClick={handleSave}>Save</button>
          
          {showConfirmation && (
            <div className="confirmation-message">Mood saved successfully!</div>
          )}
        </div>
        
        <div className="right-panel">
          <Calendar 
            month={currentMonth} 
            year={currentYear} 
            onMonthChange={handleMonthChange}
            moodEntries={[]} // We'll pass the actual entries here
          />
        </div>
      </div>
      
      <button className="view-toggle" onClick={switchView}>All Notes</button>
    </div>
  );
}

export default MoodTracker;
