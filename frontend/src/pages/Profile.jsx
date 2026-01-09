import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import EvaluationForm from '../components/EvaluationForm';
import ReportModal from '../components/ReportModal';
import avatarTutor from '../assets/user_placeholder.png';
import avatarTutee from '../assets/user_placeholder.png';
import lrcBadge from '../assets/logo_lrc.png';
import '../styles/Profile.css';

const Profile = () => {
  const { user: authUser } = useAuth();

  // PLACEHOLDER DATA (Currently Active)
  // Change 'role' to 'tutee' to view the Tutee layout
  const [user] = useState({
    name: "Gabby Diocadiz",
    email: "gabby@up.edu.ph",
    role: "tutee", // Options: 'tutor' or 'tutee'
    avatar: avatarTutee,
    // Tutor specific data
    bio: "Coding is problem-solving in action. I help my peers understand data structures and computation by walking them step by step, focusing on logic and debugging.",
    courses: "CMSC 12, CMSC 21, CMSC 123, CMSC 150",
    experiences: [
      "Been tutoring for one year",
      "Worked part-time as an online tutor",
      "UPLB YSES Scholastic Head (A.Y. 2028-2029)",
      "P2OJECT YSES: Junior HackFest 2nd Runner Up"
    ]
  });

  // State for evaluation modal
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // State for report modal
  const [showReport, setShowReport] = useState(false);
  const [reportSession, setReportSession] = useState(null);

  // Mock Booking Data with different statuses
  const bookings = [
    { 
      id: 1, 
      course: "CHEM 18 Tutorial", 
      status: "active",
      tutor: "Maryz Cabatingan",
      tutee: "Gabby Diocadiz",
      topic: "Chemical Bonding",
      date: "09/19/2025 3:00 PM - 4:00 PM"
    },
    { 
      id: 2, 
      course: "CMSC 123 Tutorial", 
      status: "active",
      tutor: "Maryz Cabatingan",
      tutee: "Gabby Diocadiz",
      topic: "Binary Search Trees",
      date: "09/20/2025 2:00 PM - 3:00 PM"
    },
    { 
      id: 3, 
      course: "[Course Code] Tutorial", 
      status: "completed",
      tutor: "Maryz Cabatingan",
      tutee: "Gabby Diocadiz",
      topic: "Singly Linked Lists",
      date: "09/18/2025 1:00 PM - 2:00 PM"
    },
    { 
      id: 4, 
      course: "[Course Code] Tutorial", 
      status: "completed",
      tutor: "Maryz Cabatingan",
      tutee: "Gabby Diocadiz",
      topic: "Sorting Algorithms",
      date: "09/17/2025 4:00 PM - 5:00 PM"
    },
    { 
      id: 5, 
      course: "[Course Code] Tutorial", 
      status: "done",
      tutor: "Maryz Cabatingan",
      tutee: "Gabby Diocadiz",
      topic: "Recursion",
      date: "09/15/2025 10:00 AM - 11:00 AM"
    },
    { 
      id: 6, 
      course: "[Course Code] Tutorial", 
      status: "done",
      tutor: "Maryz Cabatingan",
      tutee: "Gabby Diocadiz",
      topic: "Graph Theory",
      date: "09/14/2025 3:00 PM - 4:00 PM"
    },
  ];

  const handleActionClick = (action, booking) => {
    if (action === 'cancel') {
      alert(`Cancelling session: ${booking.course}`);
    } else if (action === 'evaluate') {
      setSelectedSession(booking);
      setShowEvaluation(true);
    } else if (action === 'report') {
      setReportSession(booking);
      setShowReport(true);
    }
  };

  const handleEvaluationSubmit = (evaluationData) => {
    console.log('Evaluation submitted:', evaluationData);
    alert('Thank you for your feedback!');
  };

  const handleReportSubmit = (reportData) => {
    console.log('Report submitted:', reportData);
    alert('Report submitted successfully. We will review it shortly.');
  };

  const renderStatusBadge = (status) => {
    if (status === 'active') {
      return <span className="status-badge status-active">Active</span>;
    } else if (status === 'done') {
      return <span className="status-badge status-done">Done</span>;
    }
    return null;
  };

  const renderActionButtons = (booking) => {
    const { status } = booking;
    const isTutee = user.role === 'tutee';

    if (status === 'active') {
      // Active sessions
      if (isTutee) {
        return (
          <button 
            className="action-button action-cancel"
            onClick={() => handleActionClick('cancel', booking)}
          >
            Cancel
          </button>
        );
      } else {
        // Tutor: no action button, just status is enough
        return null;
      }
    } else if (status === 'completed') {
      // Completed sessions (awaiting evaluation)
      if (isTutee) {
        return (
          <>
            <button 
              className="action-button action-evaluate"
              onClick={() => handleActionClick('evaluate', booking)}
            >
              Evaluate
            </button>
            <button 
              className="action-button action-report"
              onClick={() => handleActionClick('report', booking)}
            >
              Report
            </button>
          </>
        );
      } else {
        // Tutor: no action buttons
        return null;
      }
    } else if (status === 'done') {
      // Done sessions (evaluated)
      if (isTutee) {
        return (
          <button 
            className="action-button action-report"
            onClick={() => handleActionClick('report', booking)}
          >
            Report
          </button>
        );
      } else {
        // Tutor: no action buttons
        return null;
      }
    }
  };

  return (
    <div className="profile-page-bg">
      <div className="profile-container">
        
        {/* HEADER SECTION */}
        <header className="profile-header">
          <div className="profile-avatar-wrapper">
            <img src={user.avatar} alt={user.name} className="profile-avatar" />
          </div>
          
          <div className="profile-identity">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
          </div>

          {/* Show LRC Badge only if Tutor */}
          {user.role === 'tutor' && (
            <div className="profile-badge-section">
              <div className="badge-logo-wrapper">
                 <img src={lrcBadge} alt="LRC Logo" className="badge-logo" />
              </div>
              <div className="badge-pill">LRC Tutor</div>
            </div>
          )}
        </header>

        {/* TUTOR SPECIFIC CONTENT */}
        {user.role === 'tutor' && (
          <div className="tutor-info-grid">
            <div className="info-card bio-card">
              <p>{user.bio}</p>
            </div>

            <div className="info-card exp-card">
              <h3 className="card-title-red">Experiences</h3>
              <ul className="exp-list">
                {user.experiences.map((exp, index) => (
                  <li key={index}>{exp}</li>
                ))}
              </ul>
            </div>

            <div className="info-card courses-card">
              <h3 className="card-title-red">Course(s) Offered</h3>
              <p>{user.courses}</p>
            </div>
          </div>
        )}

        {/* BOOKING HISTORY */}
        <div className={`booking-section ${user.role === 'tutee' ? 'tutee-layout' : ''}`}>
          <h2 className="section-title">My booking history</h2>

          <div className="booking-list">
            {/* Column Headers */}
            <div className="booking-header-row">
              <span></span>
              <span className="col-header">Status</span>
              <span className="col-header">Action</span>
            </div>

            {bookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <div className="booking-course-name">
                  {booking.course}
                </div>
                
                <div className="booking-actions">
                  {renderStatusBadge(booking.status)}
                  {renderActionButtons(booking)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Evaluation Modal */}
      {showEvaluation && selectedSession && (
        <EvaluationForm
          sessionData={{
            tutor: selectedSession.tutor,
            tutee: selectedSession.tutee,
            course: selectedSession.course,
            topic: selectedSession.topic,
            date: selectedSession.date,
          }}
          onClose={() => setShowEvaluation(false)}
          onSubmit={handleEvaluationSubmit}
        />
      )}

      {/* Report Modal */}
      {showReport && reportSession && (
        <ReportModal
          sessionData={{
            tutor: reportSession.tutor,
            tutee: reportSession.tutee,
            course: reportSession.course,
            topic: reportSession.topic,
            date: reportSession.date,
          }}
          onClose={() => setShowReport(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
};

export default Profile;
