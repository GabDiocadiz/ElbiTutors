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

  // Simple validation state to trigger UI styles
  const [focused, setFocused] = useState('');

  const degreeOptions = [
    "BS Computer Science",
    "BS Applied Mathematics",
    "BS Statistics",
    "BS Biology",
    "BS Chemistry",
    "BS Agriculture",
    "Other"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    navigate('/terms');
  };

  return (
    <div className="split-page-container fade-in">
      {/* LEFT SIDE: FORM */}
      <div className="split-left">
        <div className="form-wrapper">
          
          <h1 className="basic-info-title">Let's get started</h1>
          <p className="basic-info-subtitle">Please fill in your academic details below.</p>
          
          <form onSubmit={handleContinue} className="modern-form">
            <div className={`input-group ${focused === 'studentNumber' ? 'focused' : ''}`}>
              <label>Student Number*</label>
              <input 
                type="text" 
                name="studentNumber"
                placeholder="202X-XXXXX" 
                value={formData.studentNumber}
                onChange={handleChange}
                onFocus={() => setFocused('studentNumber')}
                onBlur={() => setFocused('')}
                required 
              />
            </div>

            <div className={`input-group ${focused === 'degreeProgram' ? 'focused' : ''}`}>
              <label>Degree Program*</label>
              <div className="select-wrapper">
                <select 
                  name="degreeProgram"
                  value={formData.degreeProgram}
                  onChange={handleChange}
                  onFocus={() => setFocused('degreeProgram')}
                  onBlur={() => setFocused('')}
                  required 
                >
                  <option value="" disabled>Select your degree</option>
                  {degreeOptions.map((degree) => (
                    <option key={degree} value={degree}>{degree}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={`input-group ${focused === 'classification' ? 'focused' : ''}`}>
              <label>Classification*</label>
              <div className="select-wrapper">
                <select 
                  name="classification"
                  value={formData.classification}
                  onChange={handleChange}
                  onFocus={() => setFocused('classification')}
                  onBlur={() => setFocused('')}
                  required
                >
                  <option value="" disabled>Select your year level</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-yellow-wide shadow-hover">
              Continue
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: LOGO */}
      <div className="split-right animated-bg">
        <img src={logoDarkMode} alt="ELBI Tutors Logo" className="hero-logo drop-shadow" />
      </div>
    </div>
  );
};

export default BasicInfo;