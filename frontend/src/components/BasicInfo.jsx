import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoDarkMode from '../assets/logo_darkmode.png';
import '../styles/Components.css';
import '../styles/design.css';

const BasicInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [focused, setFocused] = useState('');

  // 1. Get Data passed from Login
  const { googleUser, role } = location.state || {};

  // Safety: If no data, kick back to login
  useEffect(() => {
    if (!googleUser) {
      navigate('/login');
    }
  }, [googleUser, navigate]);

  const [formData, setFormData] = useState({
    studentNumber: '',
    degreeProgram: '',
    classification: ''
  });

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
    // 2. Pass EVERYTHING to Terms (Google Data + Form Data)
    navigate('/terms', { 
      state: { 
        googleUser, 
        role, 
        profileData: formData 
      } 
    });
  };

  return (
    <div className="split-page-container fade-in">
      <div className="split-left">
        <div className="form-wrapper">
          <h1 className="basic-info-title">Let's get started</h1>
          <p className="basic-info-subtitle">Hi <strong>{googleUser?.displayName}</strong>! Please fill in your academic details.</p>
          
          <form onSubmit={handleContinue} className="modern-form">
            {/* Student Number Input */}
            <div className={`input-group ${focused === 'studentNumber' ? 'focused' : ''}`}>
              <label>Student Number*</label>
              <input 
                type="text" name="studentNumber" placeholder="202X-XXXXX" 
                value={formData.studentNumber} onChange={handleChange}
                onFocus={() => setFocused('studentNumber')} onBlur={() => setFocused('')} required 
              />
            </div>

            {/* Degree Select */}
            <div className={`input-group ${focused === 'degreeProgram' ? 'focused' : ''}`}>
              <label>Degree Program*</label>
              <div className="select-wrapper">
                <select 
                  name="degreeProgram" value={formData.degreeProgram} onChange={handleChange}
                  onFocus={() => setFocused('degreeProgram')} onBlur={() => setFocused('')} required 
                >
                  <option value="" disabled>Select your degree</option>
                  {degreeOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Classification Select */}
            <div className={`input-group ${focused === 'classification' ? 'focused' : ''}`}>
              <label>Classification*</label>
              <div className="select-wrapper">
                <select 
                  name="classification" value={formData.classification} onChange={handleChange}
                  onFocus={() => setFocused('classification')} onBlur={() => setFocused('')} required
                >
                  <option value="" disabled>Select your year level</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
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