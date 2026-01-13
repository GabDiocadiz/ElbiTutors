import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoDarkMode from '../assets/logo_darkmode.png';
// Styling
import '../styles/Components.css';
import '../styles/design.css';

const BasicInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentNumber: '',
    degreeProgram: '',
    classification: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    // TODO: Save basic info to context or backend
    // Navigate to Terms and Conditions
    navigate('/terms');
  };

  return (
    <div className="split-page-container">
      {/* LEFT SIDE: FORM */}
      <div className="split-left">
        <div className="form-wrapper">
          <h1 className="basic-info-title">Let's get started</h1>
          
          <form onSubmit={handleContinue}>
            <div className="input-group">
              <label>Student Number*</label>
              <input 
                type="text" 
                name="studentNumber"
                placeholder="202X-XXXXX" 
                value={formData.studentNumber}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Degree Program*</label>
              <input 
                type="text" 
                name="degreeProgram"
                placeholder="BS Computer Science" 
                value={formData.degreeProgram}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Classification*</label>
              <select 
                name="classification"
                value={formData.classification}
                onChange={handleChange}
                required
              >
                <option value="">Select your year level</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <button type="submit" className="btn-yellow-wide">
              Continue
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: LOGO */}
      <div className="split-right">
        <img src={logoDarkMode} alt="ELBI Tutors Logo" className="hero-logo" />
      </div>
    </div>
  );
};

export default BasicInfo;