// Styling
import '../styles/Components.css';

export default function SessionBookedModal({ onClose, sessionData }) {
  const defaultSessionData = {
    date: '18',
    month: 'SEP',
    course: 'CMSC 21 - Singly Linked Lists',
    time: 'Thursday: 1:00-3:00 PM',
    timezone: '(GMT+08:00) Philippine Standard Time'
  };

  const data = sessionData || defaultSessionData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="session-booked-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">
          <svg width="67" height="67" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="33.5" cy="33.5" r="33.5" fill="#3F5A36"/>
            <path d="M20 33.5L28.5 42L47 23.5" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 className="session-booked-title">Session Booked</h2>
        
        <p className="session-booked-message">
          Please wait for our confirmation email regarding your booking.
        </p>

        <div className="session-booked-divider"></div>

        <div className="session-booked-details">
          <div className="session-date-box">
            <div className="session-date-number">{data.date}</div>
            <div className="session-date-month">{data.month}</div>
          </div>
          
          <div className="session-info">
            <div className="session-course">{data.course}</div>
            <div className="session-time">{data.time}</div>
            <div className="session-timezone">{data.timezone}</div>
          </div>
        </div>

        <div className="session-booked-divider"></div>

        {/* <p className="session-cancel-text">
          Changed your mind? <button className="cancel-link">Cancel.</button>
        </p> */}
      </div>
    </div>
  );
}
