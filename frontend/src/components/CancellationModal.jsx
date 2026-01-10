// Styling
import '../styles/Components.css';

import React, { useState } from 'react';

const CancellationModal = ({ sessionData, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }
    // Transition session to 'pending' state upon submission
    onSubmit({ ...sessionData, status: 'pending', reason });
    onClose();
  };

  return (
    <div className="report-modal-overlay" onClick={(e) => e.target.className === 'report-modal-overlay' && onClose()}>
      <div className="report-modal-container">
        <div className="report-modal-header">
          <h1 className="report-modal-title">Cancel Session</h1>
          {/* <span style={{ fontSize: '2rem' }}>⚠️</span> */}
        </div>

        <p className="text-sm mb-2" style={{ color: '#555' }}>
          Please state your reason for cancelling the session for <strong>{sessionData.course}</strong>.
        </p>

        <textarea
          className="report-modal-textarea"
          placeholder="Reason for cancellation..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="report-modal-actions">
          <button className="report-modal-btn close-btn" onClick={onClose}>
            Back
          </button>
          <button className="report-modal-btn submit-btn" onClick={handleSubmit}>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;