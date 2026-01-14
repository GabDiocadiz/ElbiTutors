import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
// Styling
import '../styles/Components.css';
import '../styles/design.css';

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthSession } = useAuth();
  const [loading, setLoading] = useState(false);

  // Get Data passed from BasicInfo
  const { googleUser, profileData } = location.state || {};

  const handleAgree = async () => {
    // 1. Validation: Ensure we have the data to register
    if (!googleUser || !profileData) {
      alert("Missing registration data. Please restart the process.");
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      // 2. Prepare Payload (Force role to 'tutee' for self-registration)
      const payload = {
        email: googleUser.email,
        googleId: googleUser.uid,
        name: googleUser.displayName,
        picture: googleUser.photoURL,
        role: 'tutee', 
        degree_program: profileData.degreeProgram,
        classification: profileData.classification
      };

      // 3. Call Backend to create user
      const { data } = await api.post('/auth/google', payload);

      // 4. Set Session & Redirect to Dashboard
      setAuthSession(data.token, data.user);
      navigate('/dashboard');

    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to Basic Info to allow edits
    navigate(-1);
  };

  return (
    <div className="guide-page-container fade-in">
      <div className="guide-content-wrapper">
        <h1 className="guide-title">Terms and Conditions</h1>

        <div className="guide-scroll-box">
          <p className="guide-intro">
            Welcome to <strong>ELBI Tutors</strong>. By using our platform, you agree to comply with and be bound by the following terms and conditions of use.
          </p>

          <h3 className="guide-section-header">1. ACCEPTANCE OF TERMS</h3>
          <p className="guide-text-block">
            By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>

          <h3 className="guide-section-header">2. USER RESPONSIBILITIES</h3>
          <p className="guide-text-block">
            You agree to provide accurate and complete information when creating your account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
          </p>

          <h3 className="guide-section-header">3. ACADEMIC INTEGRITY</h3>
          <p className="guide-text-block">
            ELBI Tutors is designed to facilitate learning. Users are expected to uphold the University's code of academic integrity. The platform should not be used for cheating, plagiarism, or any form of academic dishonesty.
          </p>

          <h3 className="guide-section-header">4. PRIVACY POLICY</h3>
          <p className="guide-text-block">
            Your privacy is important to us. We collect only the data necessary to provide our services, such as your UP Mail, student number, and degree program, to verify your identity as a UPLB student.
          </p>
        </div>

        <div className="guide-action-area">
          <button 
            className="guide-btn-cancel" 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          
          <button 
            className="guide-btn-agree" 
            onClick={handleAgree}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'I Agree'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;