// NotesView.js
import React, { useState } from 'react';
// import '../styles/NotesView.css';
import '../App.css'

function NotesView({ entries, switchView }) {
  const [filterMood, setFilterMood] = useState('all');
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  // Filter entries by mood if filter is active
  const filteredEntries = filterMood === 'all' 
    ? entries 
    : entries.filter(entry => entry.mood === filterMood);

  // Sort entries by date (newest first)
  const sortedEntries = [...filteredEntries].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="notes-view">
      <div className="header">
        <h1>MoodMate</h1>
      </div>
      
      <div className="notes-container">
        <div className="notes-header">
          <h2>All Notes</h2>
          <div className="filter-controls">
            <select 
              value={filterMood} 
              onChange={(e) => setFilterMood(e.target.value)}
            >
              <option value="all">All Moods</option>
              <option value="happy">Happy</option>
              <option value="neutral">Neutral</option>
              <option value="sad">Sad</option>
              <option value="angry">Angry</option>
              <option value="sick">Sick</option>
            </select>
          </div>
        </div>
        
        <div className="notes-grid">
          {sortedEntries.length > 0 ? (
            sortedEntries.map((entry, index) => (
              <div key={index} className={`note-card mood-${entry.mood}`}>
                <div className="note-mood">
                  {entry.mood === 'happy' && '😊'}
                  {entry.mood === 'neutral' && '😐'}
                  {entry.mood === 'sad' && '😔'}
                  {entry.mood === 'angry' && '😠'}
                  {entry.mood === 'sick' && '🤢'}
                </div>
                <div className="note-content">
                  <p>{entry.note}</p>
                </div>
                <div className="note-footer">
                  <span className="note-date">{formatDate(entry.date)}</span>
                  {entry.weather && (
                    <span className="note-weather">
                      {Math.round(entry.weather.temperature)}°C
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="no-entries">No mood entries yet.</p>
          )}
        </div>
      </div>
      
      <button className="view-toggle" onClick={switchView}>Back to Tracker</button>
    </div>
  );
}

export default NotesView;