import '../styles/SubmitModal.css';

export default function SubmitModal({ onClose, title = "Submitted", message = "Thank you for your response" }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="submit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="submit-success-icon">
          <svg width="170" height="170" viewBox="0 0 170 170" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="85" cy="85" r="85" fill="#3F5A36"/>
            <path d="M50 85L72.5 107.5L120 60" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="submit-title">{title}</h1>
        
        <p className="submit-message">{message}</p>

        <button className="submit-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
