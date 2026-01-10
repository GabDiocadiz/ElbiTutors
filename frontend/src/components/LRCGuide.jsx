import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/design.css';

const LRCGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="guide-page-container">
      <div className="guide-content-wrapper">
        <h1 className="guide-title">LRC-Certification Guidelines</h1>

        <div className="guide-scroll-box">
          <p className="guide-intro">
            The <strong>Learning Resource Center (LRC)</strong> is looking for dedicated students who are eager to support their 
            fellow Iskolar in achieving academic success. This is more than just work; it's a chance to grow 
            professionally, develop essential skills, and make a positive difference in the lives of UPLB students. Apply 
            now and kick off an exciting new journey
          </p>

          <h3 className="guide-section-header">QUALIFICATIONS:</h3>
          <ul className="guide-list">
            <li><span>☑</span> Must be at least a continuing freshie;</li>
            <li><span>☑</span> Currently enrolled in at least one academic unit;</li>
            <li><span>☑</span> With strong academic standing;</li>
            <li><span>☑</span> Preferably has experience in one or more of the following areas: copywriting, graphic design, video editing, and administrative tasks; and</li>
            <li><span>☑</span> Passionate about supporting others and helping them achieve academic success.</li>
          </ul>

          <h3 className="guide-section-header">REQUIREMENTS:</h3>
          <ul className="guide-list">
            <li><span>☑</span> Clear, readable AMIS screenshots of grades;</li>
            <li><span>☑</span> E-copy of Form 5 for Midyear 2025;</li>
            <li><span>☑</span> Curriculum Vitae with 2x2 photo;</li>
            <li><span>☑</span> Recommendation letter from previous professor;</li>
          </ul>
        </div>

        <div className="guide-action-area">
          <button className="guide-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default LRCGuide;