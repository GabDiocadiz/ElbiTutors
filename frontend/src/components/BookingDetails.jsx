import React, { useState } from 'react';
import CancellationModal from './CancellationModal'; // Ensure the path is correct

const BookingDetails = ({ sessionData, onClose }) => {
  const [isCancelling, setIsCancelling] = useState(false);

  if (!sessionData) return null;

  const getCourseAndTutor = (courseString) => {
    if (!courseString) return { course: 'N/A', tutor: 'N/A' };
    const parts = courseString.split(' by ');
    if (parts.length === 2) {
      return { course: parts[0], tutor: parts[1] };
    }
    return { course: courseString, tutor: 'N/A' };
  };

  const { course, tutor } = getCourseAndTutor(sessionData.course);

  // If the user clicks "Cancel Booking", we show the CancellationModal instead
  if (isCancelling) {
    return (
      <CancellationModal 
        sessionData={sessionData} 
        onClose={() => setIsCancelling(false)} // Go back to details
        onConfirm={onClose} // Close everything after successful cancellation
      />
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header" style={{ marginBottom: '20px' }}>
          <h2 className="booking-modal-title">Session Details</h2>
        </div>

        <div className="session-details-content" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="detail-row">
            <strong>Course:</strong> {course}
          </div>
          <div className="detail-row">
            <strong>Tutor:</strong> {tutor}
          </div>
          <div className="detail-row">
            <strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{sessionData.status}</span>
          </div>
          
          <div className="detail-row">
            <strong>Date:</strong> October 24, 2025
          </div>
          <div className="detail-row">
            <strong>Time:</strong> 10:00 AM - 11:00 AM
          </div>
          <div className="detail-row">
            <strong>Student:</strong> Juan Dela Cruz
          </div>
          <div className="detail-row">
            <strong>Topic:</strong> Introduction to Data Structures
          </div>
        </div>

        <div className="booking-modal-actions" style={{ justifyContent: 'center', marginTop: '30px', gap: '10px', display: 'flex' }}>
          {/* Trigger the Cancellation Modal */}
          <button 
            className="booking-btn booking-btn-cancel" 
            onClick={() => setIsCancelling(true)}
            style={{ width: '150px' }}
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;