import React, { useState } from 'react';
import '../styles/Calendar.css';

/**
 * Calendar Component
 * Features:
 * - 30-minute intervals from 7:00 AM to 7:00 PM.
 * - Supports a 'readOnly' prop for the profile view.
 * - Interactive plotting with click-and-drag functionality.
 */

const Calendar = ({ readOnly = false }) => {
  // Days of the week
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Time slots from 7 AM to 7 PM (19:00) with 30-minute intervals
  const timeSlots = [];
  const startHour = 7;
  const endHour = 19; // 7 PM

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const start = new Date(0, 0, 0, hour, minute);
      const end = new Date(0, 0, 0, hour, minute + 30);
      
      const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
      };

      timeSlots.push(`${formatTime(start)} - ${formatTime(end)}`);
    }
  }

  // State to track selected slots (dayIndex-timeIndex)
  const [selectedSlots, setSelectedSlots] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState('select'); // 'select' or 'deselect'

  // Toggle a slot's selection status
  const toggleSlot = (dayIndex, timeIndex) => {
    if (readOnly) return;
    const slotId = `${dayIndex}-${timeIndex}`;
    const newSlots = new Set(selectedSlots);
    if (newSlots.has(slotId)) {
      newSlots.delete(slotId);
    } else {
      newSlots.add(slotId);
    }
    setSelectedSlots(newSlots);
  };

  // Handle mouse down event
  const handleMouseDown = (dayIndex, timeIndex) => {
    if (readOnly) return;
    setIsDragging(true);
    const slotId = `${dayIndex}-${timeIndex}`;
    setDragMode(selectedSlots.has(slotId) ? 'deselect' : 'select');
    toggleSlot(dayIndex, timeIndex);
  };

  // Handle mouse enter event (while dragging)
  const handleMouseEnter = (dayIndex, timeIndex) => {
    if (readOnly || !isDragging) return;
    const slotId = `${dayIndex}-${timeIndex}`;
    const newSlots = new Set(selectedSlots);
    
    if (dragMode === 'select') {
      newSlots.add(slotId);
    } else {
      newSlots.delete(slotId);
    }
    setSelectedSlots(newSlots);
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={`calendar-plotting-container ${readOnly ? 'read-only' : ''}`} 
      onMouseUp={handleMouseUp} 
      onMouseLeave={handleMouseUp}
    >
      <div className="calendar-header">
        <h2 className="calendar-title">
          {readOnly ? 'Weekly Availability' : 'Set Your Weekly Availability'}
        </h2>
        {!readOnly && (
          <div className="calendar-controls">
            <button className="calendar-btn btn-secondary" onClick={() => setSelectedSlots(new Set())}>
              Clear All
            </button>
            <button className="calendar-btn btn-primary" onClick={() => alert('Schedule Saved!')}>
              Save Schedule
            </button>
          </div>
        )}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-box color-unavailable"></div>
          <span>Unavailable</span>
        </div>
        <div className="legend-item">
          <div className="legend-box color-available"></div>
          <span>Available</span>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-day-header corner-cell"></div>
        {days.map((day, index) => (
          <div key={index} className="calendar-day-header">{day}</div>
        ))}

        {timeSlots.map((time, timeIndex) => (
          <React.Fragment key={timeIndex}>
            {/* Display only start time for a cleaner look */}
            <div className="time-label-cell">{time.split(' - ')[0]}</div>
            {days.map((_, dayIndex) => {
              const slotId = `${dayIndex}-${timeIndex}`;
              const isSelected = selectedSlots.has(slotId);
              return (
                <div
                  key={slotId}
                  className={`time-slot-cell ${isSelected ? 'selected' : ''} ${readOnly ? 'read-only-cell' : ''}`}
                  onMouseDown={() => handleMouseDown(dayIndex, timeIndex)}
                  onMouseEnter={() => handleMouseEnter(dayIndex, timeIndex)}
                  title={`${days[dayIndex]} ${time}`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;