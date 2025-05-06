// Calendar.js
import React from 'react';
// import '../styles/Calendar.css';
import '../App.css'

function Calendar({ month, year, onMonthChange, moodEntries }) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // Generate days array for the current month
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null); // Empty cells for days from previous month
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Map mood entries to days
  const moodsByDay = moodEntries.reduce((acc, entry) => {
    const entryDate = new Date(entry.date);
    if (entryDate.getMonth() === month && entryDate.getFullYear() === year) {
      acc[entryDate.getDate()] = entry.mood;
    }
    return acc;
  }, {});

  const handlePrevMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear = year - 1;
    }
    onMonthChange(newMonth, newYear);
  };

  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 11) {
      newMonth = 0;
      newYear = year + 1;
    }
    onMonthChange(newMonth, newYear);
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <select 
          value={months[month]} 
          onChange={(e) => onMonthChange(months.indexOf(e.target.value), year)}
        >
          {months.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      
      <div className="calendar-days">
        <div className="weekday">S</div>
        <div className="weekday">M</div>
        <div className="weekday">T</div>
        <div className="weekday">W</div>
        <div className="weekday">T</div>
        <div className="weekday">F</div>
        <div className="weekday">S</div>
        
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`day ${day ? 'day-number' : ''} ${moodsByDay[day] ? 'has-mood' : ''}`}
          >
            {day && (
              <>
                <span>{day}</span>
                {moodsByDay[day] && (
                  <div className={`mood-indicator mood-${moodsByDay[day]}`}></div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;