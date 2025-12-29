import React from 'react';
import { Link } from 'react-router-dom';
import logoLightMode from '../assets/logo_lightmode.png';
import '../styles/design.css';

const Footer = () => {
  return (
    // 1. Outer wrapper handles the full-width background
    <footer className="footer">
      
      {/* 2. Inner container handles the width limit and grid layout */}
      <div className="footer-container">
        
        {/* Logo Section */}
        <div className="footer-section">
          <img src={logoLightMode} alt="ELBI Tutors" className="footer-logo" />
        </div>

        {/* Navigation */}
        <div className="footer-section">
          <h4 className="footer-section-title">Navigation</h4>
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/study" className="footer-link">Find a Tutor</Link>
          <Link to="/about" className="footer-link">About ElbiTutor</Link>
        </div>

        {/* Contacts */}
        <div className="footer-section">
          <h4 className="footer-section-title">Contacts</h4>
          <a href="mailto:lrc.uplb@up.edu.ph" className="footer-link underlined">
            lrc.uplb@up.edu.ph
          </a>
          <Link to="/report" className="footer-link">Report a problem</Link>
        </div>

        {/* Affiliations */}
        <div className="footer-section">
          <h4 className="footer-section-title">Affiliations</h4>
          <span className="footer-link">University of the Philippines Los Baños</span>
          <span className="footer-link">UPLB Learning Resource Center (LRC)</span>
        </div>

        {/* Policies */}
        <div className="footer-section">
          <h4 className="footer-section-title">Policies & Legal</h4>
          <Link to="/terms" className="footer-link">Terms and Conditions</Link>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;