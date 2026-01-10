import { useState } from 'react';
import '../styles/BookingModal.css';

export default function BookingModal({ tutorName, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    courseCode: '',
    topics: '',
    date: '',
    timeFrom: '2:00 PM',
    timeTo: '4:00 PM',
    location: '',
    participants: '5 PERSON'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
          <div className="form-group">
            <label className="form-label">Course Code*</label>
            <input
              type="text"
              name="courseCode"
              className="form-input"
              placeholder="Please enter the course code (e.g. CMSC 21)"
              value={formData.courseCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Topic(s)*</label>
            <input
              type="text"
              name="topics"
              className="form-input"
              placeholder="example: UPLB Main Library"
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
                  type="text"
                  name="date"
                  className="form-input date-input"
                  placeholder="dd/mm/yyyy"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                <span className="calendar-icon">📅</span>
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
                    <option>1:00 PM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                    <option>5:00 PM</option>
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
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                    <option>5:00 PM</option>
                    <option>6:00 PM</option>
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
