import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoLightMode from '../assets/logo_lightmode.png';
// Styling
import '../styles/Components.css';
import '../styles/design.css';

const BasicInfo = () => {
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();
    // Navigate to Terms and Conditions
    navigate('/terms');
  };

  return (
    <div className="split-page-container">
      {/* LEFT SIDE: FORM */}
      <div className="split-left">
        <div className="form-wrapper">
          <h1 className="basic-info-title">Let’s get started</h1>
          
          <form onSubmit={handleContinue}>
            <div className="input-group">
              <label>Username*</label>
              <input type="text" placeholder="myusername" required />
            </div>

            <div className="input-group">
              <label>Student Number*</label>
              <input type="text" placeholder="202X-XXXXX" required />
            </div>

            <div className="input-group">
              <label>Degree Program*</label>
              <input type="text" placeholder="BS Computer Science" required />
            </div>

            <button type="submit" className="btn-yellow-wide">
              Continue
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: LOGO */}
      <div className="split-right">
        <img src={logoLightMode} alt="ELBI Tutors Logo" className="hero-logo" />
      </div>
    </div>
  );
};

export default BasicInfo;