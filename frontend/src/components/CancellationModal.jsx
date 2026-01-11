// Styling
import '../styles/Components.css';

import React, { useState } from 'react';
import SubmitModal from './SubmitModal'; // Ensure the path is correct

const CancellationModal = ({ sessionData, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false); // State to track submission success

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }
    
    // Call the original onSubmit logic if provided
    if (onSubmit) {
      onSubmit({ ...sessionData, status: 'pending', reason });
    }
    
    // Instead of immediate onClose(), trigger the SubmitModal
    setShowSubmitModal(true);
  };

  // If the request is submitted, swap the view to SubmitModal
  if (showSubmitModal) {
    return <SubmitModal onClose={onClose} />;
  }

  return (
    <div className="report-modal-overlay" onClick={(e) => e.target.className === 'report-modal-overlay' && onClose()}>
      <div className="report-modal-container">
        <div className="report-modal-header">
          <h1 className="report-modal-title">Cancel Session</h1>
        </div>

        <p className="text-sm mb-2" style={{ color: '#555' }}>
          Please state your reason for cancelling the session for <strong>{sessionData?.course || 'this session'}</strong>.
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