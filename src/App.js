import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [view, setView] = useState("input");
  const [temperature, setTemperature] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("☀️");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMood, setSelectedMood] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [entries, setEntries] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "c36ada644a991a50e5d1c4d65e232be7";

  const moods = [
    {
      emoji: "😃",
      label: "Happy",
      className: "mood-happy",
      dotClassName: "dot-happy",
    },
    {
      emoji: "😐",
      label: "Neutral",
      className: "mood-neutral",
      dotClassName: "dot-neutral",
    },
    {
      emoji: "😔",
      label: "Sad",
      className: "mood-sad",
      dotClassName: "dot-sad",
    },
    {
      emoji: "😡",
      label: "Angry",
      className: "mood-angry",
      dotClassName: "dot-angry",
    },
    {
      emoji: "🤢",
      label: "Sick",
      className: "mood-sick",
      dotClassName: "dot-sick",
    },
  ];

  const weatherIconMap = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "❄️",
    "13n": "❄️",
    "50d": "🌫️",
    "50n": "🌫️",
  };

  useEffect(() => {
    const savedEntries = localStorage.getItem("moodEntries");
    if (savedEntries) setEntries(JSON.parse(savedEntries));

    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLocation({ lat: coords.latitude, lon: coords.longitude });
          setIsLoading(false);
        },
        () => {
          setError("Could not get location. Using default weather.");
          setTemperature("25°C");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported.");
      setTemperature("25°C");
    }
  }, []);

  useEffect(() => {
    if (location) fetchWeather(location.lat, location.lon);
  }, [location]);

  const fetchWeather = async (lat, lon) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setWeatherData(data);
      setTemperature(`${Math.round(data.main.temp)}°C`);
      setWeatherIcon(weatherIconMap[data.weather[0].icon] || "☀️");
    } catch {
      setError("Could not fetch weather data.");
      setTemperature("25°C");
    } finally {
      setIsLoading(false);
    }
  };

  const saveMoodEntry = () => {
    if (!selectedMood) return;
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood: selectedMood,
      note: noteText,
      temperature,
      weatherCondition: weatherData?.weather[0].main || "Unknown",
      weatherIcon,
    };
    const updated = [...entries, newEntry];
    setEntries(updated);
    localStorage.setItem("moodEntries", JSON.stringify(updated));
    setSelectedMood(null);
    setNoteText("");
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  const deleteEntry = (id) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem("moodEntries", JSON.stringify(updated));
  };

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const renderCalendar = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
    for (let i = 0; i < firstDay; i++)
      days.push(<div key={`empty-${i}`} className="calendar-empty-day" />);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(selectedYear, selectedMonth, d);
      const dayEntry = entries.find(
        (e) => new Date(e.date).toDateString() === date.toDateString()
      );
      const dotClass = dayEntry
        ? `day-dot ${
            moods.find((m) => m.label === dayEntry.mood.label)?.dotClassName ||
            ""
          }`
        : "day-dot invisible";
      const isToday = date.toDateString() === new Date().toDateString();
      days.push(
        <div key={d} className={`calendar-day ${isToday ? "today" : ""}`}>
          <div className="day-number">{d}</div>
          <div className={dotClass}></div>
        </div>
      );
    }
    return days;
  };

  const formatDate = (d) =>
    d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const getMonthName = (i) =>
    [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][i];

  return (
    <div className="app-container">
      <div className="mood-app">
        <div className="app-header">
          <h1 className="app-title">MoodMate</h1>
          {temperature && (
            <div className="weather-display">
              <span className="weather-icon">{weatherIcon}</span> {temperature}
              {isLoading && <span className="loading-indicator">...</span>}
            </div>
          )}
        </div>

        <div className="main-content">
          <div className="view-toggle">
            <button
              onClick={() => setView("input")}
              className={`toggle-btn ${
                view === "input" ? "toggle-btn-active" : ""
              }`}
            >
              Today's Mood
            </button>
            <button
              onClick={() => setView("allNotes")}
              className={`toggle-btn ${
                view === "allNotes" ? "toggle-btn-active" : ""
              }`}
            >
              All Notes
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {view === "input" ? (
            <div className="input-view">
              <div className="date-display">{formatDate(currentDate)}</div>
              <div className="mood-question">How are you feeling today?</div>
              {weatherData && (
                <div className="weather-condition">
                  Current weather: {weatherData.weather[0].main}
                </div>
              )}
              <div className="mood-selector">
                {moods.map((mood) => (
                  <button
                    key={mood.label}
                    className={`mood-btn ${
                      selectedMood?.label === mood.label ? mood.className : ""
                    }`}
                    onClick={() => setSelectedMood(mood)}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                className="note-input"
              ></textarea>

              <div className="calendar-section">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(+e.target.value)}
                  className="month-dropdown"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {getMonthName(i)}
                    </option>
                  ))}
                </select>
                <div className="calendar">
                  <div className="weekdays">
                    {"SMTWTFS".split("").map((d) => (
                      <div key={d} className="weekday">
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="days-grid">{renderCalendar()}</div>
                </div>
              </div>

              <button
                onClick={saveMoodEntry}
                disabled={!selectedMood}
                className="save-btn"
              >
                Save
              </button>
              {showConfirmation && (
                <div className="confirmation-msg">Entry saved!</div>
              )}
            </div>
          ) : (
            <div className="notes-view">
              <h2 className="notes-title">All Notes</h2>
              <div className="notes-list">
                {entries.length === 0 ? (
                  <div className="no-entries">No entries yet</div>
                ) : (
                  entries.map((entry) => {
                    const date = new Date(entry.date);
                    const moodInfo = moods.find(
                      (m) => m.label === entry.mood.label
                    );
                    return (
                      <div
                        key={entry.id}
                        className={`note-card ${moodInfo?.className || ""}`}
                      >
                        <div className="note-header">
                          <span className="note-emoji">{entry.mood.emoji}</span>
                          <span className="note-text">{entry.note}</span>
                        </div>
                        <div className="note-footer">
                          <div>
                            {date.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="weather-info">
                            <span>{entry.weatherIcon}</span>
                            <span>{entry.temperature}</span>
                            <span> ({entry.weatherCondition})</span>
                          </div>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="delete-btn"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default App;
