// Styling
import '../styles/Components.css';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

const COURSE_CODES_LIST = ['AAE', 'ABE', 'AGRI', 'ANSC', 'BIO', 'BOT', 'CE', 'ChE', 'CHEM', 'CMSC', 'ECON', 'EE', 'ENSC', 'FBS', 'FOR', 'FPPS', 'FRM', 'Math', 'MCB', 'PHYS', 'SFI', 'STAT'];

// Generate time options from 7:00 AM to 7:00 PM with 30-minute intervals
const TIME_OPTIONS = [];
for (let i = 7; i <= 19; i++) {
  const hour = i > 12 ? i - 12 : i;
  const ampm = i >= 12 ? 'PM' : 'AM';
  
  // :00 slot
  TIME_OPTIONS.push(`${hour}:00 ${ampm}`);
  
  // :30 slot (skip for 7:00 PM to keep it as end time if strictly 7pm is the limit)
  if (i < 19) {
    TIME_OPTIONS.push(`${hour}:30 ${ampm}`);
  }
}

// Helper to convert time string to minutes for comparison
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
};

export default function BookingModal({ tutorName, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    courseCode: [], // Changed to array for multi-select
    topics: '',     // Changed to string for text input
    date: '',
    timeFrom: '7:00 AM', // Default to start of range
    timeTo: '8:00 AM',   // Default to 1 hour later
    location: '',
    participants: '1 PERSON' // Default set to 1 PERSON
  });
  
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Calculate minimum date (2 days from today)
  const today = new Date();
  const minDateObj = new Date(today);
  minDateObj.setDate(today.getDate() + 2);
  const minDate = minDateObj.toISOString().split('T')[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCourseDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'date') {
      const selectedDate = new Date(value);
      const day = selectedDate.getUTCDay();
      
      // Check if it's a weekend (0 = Sunday, 6 = Saturday)
      if (day === 0 || day === 6) {
        toast.error("Please select a weekday (Monday to Friday).");
        return; // Don't update state if weekend
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCourseToggle = (code) => {
    setFormData(prev => {
      const currentCodes = prev.courseCode || [];
      const newCodes = currentCodes.includes(code)
        ? currentCodes.filter(c => c !== code)
        : [...currentCodes, code];
      return { ...prev, courseCode: newCodes };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate Course Code Selection
    if (formData.courseCode.length === 0) {
      toast.error("Please select at least one Course Code.");
      return;
    }

    // Validate Time
    const startMinutes = timeToMinutes(formData.timeFrom);
    const endMinutes = timeToMinutes(formData.timeTo);

    if (endMinutes <= startMinutes) {
      toast.error("End time must be after start time.");
      return;
    }

    // If all validations pass, trigger onSubmit
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <div className="booking-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 10C18.6 10 17.5 11.1 17.5 12.5C17.5 13.9 18.6 15 20 15C21.4 15 22.5 13.9 22.5 12.5C22.5 11.1 21.4 10 20 10ZM10 10C8.6 10 7.5 11.1 7.5 12.5C7.5 13.9 8.6 15 10 15C11.4 15 12.5 13.9 12.5 12.5C12.5 11.1 11.4 10 10 10ZM30 10C28.6 10 27.5 11.1 27.5 12.5C27.5 13.9 28.6 15 30 15C31.4 15 32.5 13.9 32.5 12.5C32.5 11.1 31.4 10 30 10Z" fill="#800000"/>
            </svg>
          </div>
          <h2 className="booking-modal-title">Book Session</h2>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group" ref={dropdownRef}>
            <label className="form-label">Course Code*</label>
            <div 
              className="custom-multiselect" 
              onClick={() => setShowCourseDropdown(!showCourseDropdown)}
            >
              <div className={`selected-topics ${formData.courseCode.length === 0 ? 'placeholder' : ''}`}>
                {formData.courseCode.length > 0 ? formData.courseCode.join(', ') : 'Select course codes...'}
              </div>
              <span className="dropdown-arrow">▼</span>
            </div>
            
            {showCourseDropdown && (
              <div className="topics-dropdown">
                {COURSE_CODES_LIST.map(code => (
                  <div 
                    key={code} 
                    className="topic-option" 
                    onClick={() => handleCourseToggle(code)}
                  >
                    <input 
                      type="checkbox" 
                      checked={formData.courseCode.includes(code)} 
                      readOnly 
                      style={{ marginRight: '10px' }}
                    />
                    <span>{code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Topic(s)*</label>
            <input
              type="text"
              name="topics"
              className="form-input"
              placeholder="e.g. Singly Linked Lists"
              value={formData.topics}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date*</label>
              <div className="date-input-wrapper">
                <input
                  type="date"
                  name="date"
                  className="form-input date-input"
                  value={formData.date}
                  onChange={handleChange}
                  min={minDate}
                  required
                />
              </div>
            </div>

            <div className="form-group time-group">
              <label className="form-label">Time*</label>
              <div className="time-inputs">
                <div className="time-input-group">
                  <span className="time-label">From:</span>
                  <select
                    name="timeFrom"
                    className="form-select"
                    value={formData.timeFrom}
                    onChange={handleChange}
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={`from-${time}`} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div className="time-input-group">
                  <span className="time-label">To:</span>
                  <select
                    name="timeTo"
                    className="form-select"
                    value={formData.timeTo}
                    onChange={handleChange}
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={`to-${time}`} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location*</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="example: UPLB Main Library"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Participants*</label>
              <select
                name="participants"
                className="form-select participants-select"
                value={formData.participants}
                onChange={handleChange}
              >
                <option>1 PERSON</option>
                <option>2 PERSON</option>
                <option>3 PERSON</option>
                <option>4 PERSON</option>
                <option>5 PERSON</option>
              </select>
            </div>
          </div>

          <div className="booking-modal-actions">
            <button type="button" className="booking-btn booking-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="booking-btn booking-btn-add">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}