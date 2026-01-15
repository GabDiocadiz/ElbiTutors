// Styling
import '../styles/Components.css';
import React, { useState } from 'react';
import SubmitModal from './SubmitModal'; // Ensure correct path

const ReportModal = ({ sessionData, onClose, onSubmit }) => {
  const [reportText, setReportText] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false); // Track submission state

  const handleSubmit = () => {
    if (!reportText.trim()) {
      alert('Please enter a report description.');
      return;
    }
    
    // Execute the parent submission logic
    if (onSubmit) {
      onSubmit({ ...sessionData, report: reportText });
    }
    
    setReportText('');
    // Instead of onClose(), show the success modal
    setShowSubmitModal(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'report-modal-overlay') {
      onClose();
    }
  };

  // Switch view if submitted successfully
  if (showSubmitModal) {
    return (
      <SubmitModal 
        onClose={onClose} 
        title="Report Submitted" 
        message="Your report has been received. We will look into this immediately." 
      />
    );
  }

  return (
    <div className="report-modal-overlay" onClick={handleOverlayClick}>
      <div className="report-modal-container">
        <div className="report-modal-header">
          <h1 className="report-modal-title">Report an experience</h1>
          <svg className="report-modal-icon" width="46" height="46" viewBox="0 0 24 24" fill="none">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#800020"/>
          </svg>
        </div>

        <textarea
          className="report-modal-textarea"
          placeholder="Describe your experience..."
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
        />

        <div className="report-modal-actions">
          <button className="report-modal-btn close-btn" onClick={onClose}>
            Close
          </button>
          <button className="report-modal-btn submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;