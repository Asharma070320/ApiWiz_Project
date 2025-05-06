// MoodSelector.js
import React from 'react';
// import '../styles/MoodSelector.css';
import '../App.css'

function MoodSelector({ selectedMood, onMoodSelect }) {
  const moods = [
    { id: 'happy', emoji: '😊' },
    { id: 'neutral', emoji: '😐' },
    { id: 'sad', emoji: '😔' },
    { id: 'angry', emoji: '😠' },
    { id: 'sick', emoji: '🤢' }
  ];

  return (
    <div className="mood-selector">
      {moods.map(mood => (
        <button
          key={mood.id}
          className={`mood-button ${selectedMood === mood.id ? 'selected' : ''}`}
          onClick={() => onMoodSelect(mood.id)}
        >
          <span role="img" aria-label={mood.id}>{mood.emoji}</span>
        </button>
      ))}
    </div>
  );
}

export default MoodSelector;