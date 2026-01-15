import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ maxWidth: '500px' }}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title" style={{ fontSize: '1.8rem' }}>{title}</h2>
        </div>
        
        <div style={{ padding: '0 20px 20px', textAlign: 'center', color: '#555', fontSize: '1.1rem' }}>
          <p>{message}</p>
        </div>

        <div className="admin-modal-actions" style={{ justifyContent: 'center' }}>
          <button className="admin-modal-button cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="admin-modal-button save" 
            onClick={onConfirm}
            style={{ backgroundColor: '#D32F2F' }} // Red for danger
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;