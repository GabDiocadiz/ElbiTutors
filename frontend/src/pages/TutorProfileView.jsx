import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookSession } from '../services/api'; // Import your frozen API
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import SessionBookedModal from '../components/SessionBookedModal';
import ReportModal from '../components/ReportModal';
import '../styles/TutorProfileView.css';
import lrcBadge from '../assets/logo_lrc.png';

export default function TutorProfileView() {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSessionBookedModal, setShowSessionBookedModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [error, setError] = useState(null);

  // Aligned with the User Model
  const tutorData = {
    name: 'Maryz Cabatingan',
    email: 'maryz@up.edu.ph',
    picture: 'https://api.builder.io/api/v1/image/assets/TEMP/33f681955265eab93c0437386819243dea878996',
    degree_program: 'BS Computer Science',
    role: 'tutor',
    badgeImage: lrcBadge,
    bio: 'Coding is problem-solving in action. I help my peers understand data structures and computation.',
    courses: 'CMSC 12, CMSC 21, CMSC 123, CMSC 150',
    experiences: [
      'Been tutoring for one year',
      'UPLB YSES Scholastic Head (A.Y. 2028-2029)',
      'P20JECT YSES: Junior HackFest 2nd Runner Up'
    ],
    guidelines: [
      'Book at least 2 days before your desired date.',
      'You can only have at most 3 active sessions at a time.'
    ]
  };

  const handleBookSession = async (bookingData) => {
    try {
      setError(null);
      // Flow: Connect to Task #24 API Contract
      const response = await bookSession({
        tutorId: tutorId,
        ...bookingData
      });
      
      console.log('Booking successful:', response.data);
      setShowBookingModal(false);
      setShowSessionBookedModal(true);
    } catch (err) {
      // Catching the "Frozen Error" from your api.js interceptor
      setError(err);
      console.error('Booking failed:', err);
    }
  };

  const handleReportSubmit = (reportData) => {
    console.log('Report submitted:', reportData);
    setShowReportModal(false);
  };

  return (
    <div className="tutor-profile-view-page">
      <NavBar />
      
      <div className="tutor-profile-content">
        {/* Error Banner for Intercepted API Errors */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="tutor-profile-header">
          <div className="tutor-header-main">
            <div className="tutor-avatar-large">
              {/* Using "picture" from User Model */}
              <img src={tutorData.picture} alt={tutorData.name} />
            </div>
            
            <div className="tutor-header-info">
              <h1 className="tutor-name">{tutorData.name}</h1>
              <p className="tutor-email">{tutorData.email}</p>
              <p className="tutor-program text-sm text-gray-500">{tutorData.degree_program}</p>
            </div>
          </div>

          <div className="tutor-badge-section">
            <div className="tutor-badge-image">
              <img src={tutorData.badgeImage} alt="LRC Badge" />
            </div>
            <div className="tutor-badge-label">
              <span>LRC Tutor</span>
            </div>
          </div>
        </div>

        <div className="tutor-info-section">
          <div className="tutor-info-left">
            <div className="tutor-bio-card">
              <p>{tutorData.bio}</p>
            </div>

            <div className="tutor-courses-card">
              <h3 className="courses-label">Course(s) Offered</h3>
              <p className="courses-list">{tutorData.courses}</p>
            </div>
          </div>

          <div className="tutor-info-right">
            <div className="tutor-experiences-card">
              <h3 className="experiences-title">Experiences</h3>
              <ul className="experiences-list">
                {tutorData.experiences.map((exp, index) => (
                  <li key={index}>{exp}</li>
                ))}
              </ul>
            </div>

            <div className="book-session-button-wrapper">
              <button 
                className="book-session-button"
                onClick={() => setShowBookingModal(true)}
              >
                Book a Session Now
              </button>
            </div>

            <div className="tutor-guidelines-card">
              <h3 className="guidelines-title">Guidelines</h3>
              <ul className="guidelines-list">
                {tutorData.guidelines.map((guideline, index) => (
                  <li key={index}>{guideline}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="report-link-section">
          <p>
            <span className="report-text-gray">If you're experiencing a problem, click </span>
            <button className="report-link" onClick={() => setShowReportModal(true)}>here</button>
            <span className="report-text-gray"> to report.</span>
          </p>
        </div>

        <div className="availability-section">
          <h2 className="availability-title">Availability</h2>
          <div className="availability-calendar">
            <div className="calendar-placeholder py-10 text-center border-2 border-dashed border-gray-300 rounded">
              <p className="text-gray-400 font-medium italic">Calendar Integration Coming Soon</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {showBookingModal && (
        <BookingModal
          tutorName={tutorData.name}
          onClose={() => setShowBookingModal(false)}
          onSubmit={handleBookSession}
        />
      )}

      {showSessionBookedModal && (
        <SessionBookedModal onClose={() => setShowSessionBookedModal(false)} />
      )}

      {showReportModal && (
        <ReportModal
          sessionData={{ tutorName: tutorData.name, type: 'tutor' }}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
}