import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoDarkMode from '../assets/logo_darkmode.png';
import '../styles/Components.css';
import '../styles/design.css';

const BasicInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve Google data (including idToken from Login.jsx)
  const googleData = location.state?.googleData || JSON.parse(localStorage.getItem("googleData") || "{}");
  
  const [formData, setFormData] = useState({
    studentNumber: '', // Restored student number
    degreeProgram: '',
    classification: ''
  });

  useEffect(() => {
    if (!googleData?.idToken) {
      navigate('/login');
    }
  }, [googleData, navigate]);

  const degreeOptions = [
    "Bachelor of Science in Agriculture",
    "Bachelor of Science in Agricultural Biotechnology",
    "Bachelor of Science in Food Technology",
    "Bachelor of Science in Agricultural Chemistry",
    "Bachelor of Arts in Communication Arts",
    "Bachelor of Arts in Philosophy",
    "Bachelor of Arts in Sociology",
    "Bachelor of Science in Applied Mathematics",
    "Bachelor of Science in Applied Physics",
    "Bachelor of Science in Biology",
    "Bachelor of Science in Chemistry",
    "Bachelor of Science in Computer Sciences",
    "Bachelor of Science in Mathematics",
    "Bachelor of Science in Mathematics and Science Teaching",
    "Bachelor of Science in Statistics",
    "Bachelor of Science in Development Communication",
    "Bachelor of Science in Agricultural Economics",
    "Bachelor of Science in Agribusiness Management",
    "Bachelor of Science in Economics",
    "Bachelor of Science in Agricultural and Biosystems Engineering",
    "Bachelor of Science in Chemical Engineering",
    "Bachelor of Science in Civil Engineering",
    "Bachelor of Science in Electrical Engineering",
    "Bachelor of Science in Industrial Engineering",
    "Bachelor of Science in Forestry",
    "Bachelor of Science in Human Ecology",
    "Bachelor of Science in Nutrition",
    "Doctor of Veterinary Medicine",
    "Other"
  ];

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleContinue = (e) => {
    e.preventDefault();
    // Pass everything to Terms and Conditions
    navigate('/terms', { 
      state: { googleData, profileData: formData, role: 'tutee' } 
    });
  };

  return (
    <div className="split-page-container fade-in">
      <div className="split-left">
        <div className="form-wrapper">
          <h1 className="basic-info-title">Let's get started</h1>
          <p className="basic-info-subtitle">
            Hi <strong>{googleData.name}</strong>! Please fill in your academic details.
          </p>
          
          <form onSubmit={handleContinue} className="modern-form">
            {/* RESTORED STUDENT NUMBER FIELD */}
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
              <select name="degreeProgram" value={formData.degreeProgram} onChange={handleChange} required>
                <option value="" disabled>Select your degree</option>
                {degreeOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label>Classification*</label>
              <select name="classification" value={formData.classification} onChange={handleChange} required>
                <option value="" disabled>Select your year level</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <button type="submit" className="btn-yellow-wide shadow-hover">Continue</button>
          </form>
        </div>
      </div>
      <div className="split-right animated-bg">
        <img src={logoDarkMode} alt="ELBI Tutors Logo" className="hero-logo drop-shadow" />
      </div>
    </div>
  );
};

export default BasicInfo;