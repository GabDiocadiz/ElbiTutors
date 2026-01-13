import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/globals.css'; 

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-message">
          Oops! The page you are looking for might have been removed, 
          had its name changed, or is temporarily unavailable.
        </p>
        <button onClick={() => navigate(-1)} className="not-found-button">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;