import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import '../styles/Components.css';
import '../styles/design.css';

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthSession } = useAuth();
  const [loading, setLoading] = useState(false);

  const { googleData, profileData, role } = location.state || {};

  if (!googleData || !profileData) {
    navigate('/login');
    return null;
  }

  const handleAgree = async () => {
    try {
      setLoading(true);
      const payload = {
        credential: googleData.idToken, // Required for verifyIdToken
        role: role || 'tutee',
        student_number: profileData.studentNumber,
        degree_program: profileData.degreeProgram,
        classification: profileData.classification,
      };

      const { data } = await api.post('/auth/google', payload); // Creates account in DB

      if (data.success) {
        setAuthSession(data.token, data.user);
        localStorage.removeItem("googleData");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Registration failed", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guide-page-container fade-in">
      <div className="guide-content-wrapper">
        <h1 className="guide-title">Terms and Conditions</h1>

        <div className="guide-scroll-box">
          <p className="guide-intro">
            Welcome to <strong>ELBI Tutors</strong>. By creating an account, you agree to the following terms regarding your use of our peer-tutoring services.
          </p>

          <h3 className="guide-section-header">1. ELIGIBILITY</h3>
          <p className="guide-text-block">
            This platform is exclusively for currently enrolled students of the University of the Philippines Los Baños. Use of an "@up.edu.ph" account is mandatory for verification.
          </p>

          <h3 className="guide-section-header">2. CODE OF CONDUCT</h3>
          <p className="guide-text-block">
            Users must maintain professional and respectful behavior during tutoring sessions. Any form of harassment, discrimination, or inappropriate conduct will result in immediate account suspension.
          </p>

          <h3 className="guide-section-header">3. ACADEMIC INTEGRITY</h3>
          <p className="guide-text-block">
            ELBI Tutors is a platform for learning assistance, not a shortcut. Tutors shall not complete assignments, exams, or projects for tutees. All participants must uphold the UP Code of Academic Integrity.
          </p>

          <h3 className="guide-section-header">4. DATA PRIVACY</h3>
          <p className="guide-text-block">
            We collect your name, email, student number, and academic details to facilitate pairings. Your data is stored securely and will not be shared with third parties without your explicit consent.
          </p>

          <h3 className="guide-section-header">5. LIMITATION OF LIABILITY</h3>
          <p className="guide-text-block">
            While we strive for quality, ELBI Tutors does not guarantee specific academic grades or outcomes resulting from the use of this service.
          </p>
        </div>

        <div className="guide-action-area">
          <button className="guide-btn-cancel" onClick={() => navigate(-1)} disabled={loading}>
            Back
          </button>
          <button className="guide-btn-agree" onClick={handleAgree} disabled={loading}>
            {loading ? 'Processing...' : 'I Agree & Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;