import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/design.css';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  const handleAgree = () => {
    // Navigate to User Homepage / Dashboard
    navigate('/dashboard');
  };

  const handleCancel = () => {
    // Navigate back to Basic Info
    navigate(-1);
  };

  return (
    <div className="guide-page-container">
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
          <button className="guide-btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          
          <button className="guide-btn-agree" onClick={handleAgree}>
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;