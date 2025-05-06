// App.js
import React, { useState, useEffect } from 'react';
// import MoodTracker from './MoodTracker';
// import NotesView from './NotesView';
import MoodTracker from './components/MoodTracker';
import NotesView from './components/NotesView';
// import '../styles/App.css';
import './App.css'

function App() {
  const [view, setView] = useState('tracker'); // 'tracker' or 'notes'
  const [moodEntries, setMoodEntries] = useState([]);
  
  // Load mood entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save mood entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);

  const addMoodEntry = (entry) => {
    setMoodEntries([...moodEntries, entry]);
  };

  return (
    <div className="app-container">
      {view === 'tracker' ? (
        <MoodTracker onSaveMood={addMoodEntry} switchView={() => setView('notes')} />
      ) : (
        <NotesView entries={moodEntries} switchView={() => setView('tracker')} />
      )}
    </div>
  );
}

export default App;