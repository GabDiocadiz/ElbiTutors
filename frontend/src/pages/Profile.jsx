import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // Hook imported
import Navbar from '../components/Navbar';
import avatarTutor from '../assets/user_placeholder.png'; 
import avatarTutee from '../assets/user_placeholder.png';
import lrcBadge from '../assets/logo_lrc.png'; 
import '../styles/Profile.css';

const Profile = () => {
  // 1. INTEGRATED AUTH HOOK
  // We alias 'user' to 'authUser' so it doesn't conflict with the mock data below.
  // When you are ready to connect real data, delete the mock state and rename 'authUser' back to 'user'.
  const { user: authUser } = useAuth(); 

  // 2. PLACEHOLDER DATA (Currently Active)
  // Change 'role' to 'tutee' to view the Tutee layout
  const [user] = useState({
    name: "Maryz Cabatingan",
    email: "maryz@up.edu.ph",
    role: "tutor", // Options: 'tutor' or 'tutee'
    avatar: avatarTutor,
    // Tutor specific data
    bio: "Coding is problem-solving in action. I help my peers understand data structures and computation by walking them through exercises step by step, focusing on logic and debugging.",
    courses: "CMSC 12, CMSC 21, CMSC 123, CMSC 150",
    experiences: [
      "Been tutoring for one year",
      "Worked part-time as an online tutor",
      "UPLB YSES Scholastic Head (A.Y. 2028-2029)",
      "P2OJECT YSES: Junior HackFest 2nd Runner Up"
    ]
  });

  // Mock Booking Data
  const bookings = [
    { id: 1, course: "CHEM 18 Tutorial", status: "Active", action: "Cancel" },
    { id: 2, course: "CMSC 123 Tutorial", status: "Active", action: "Cancel" },
    { id: 3, course: "CMSC 100 Tutorial", status: "Evaluate", action: "Report" }, 
    { id: 4, course: "MATH 27 Tutorial", status: "Done", action: "Report" },
  ];

  const handleActionClick = (action, courseName) => {
    alert(`You clicked ${action} for ${courseName}`);
  };

  return (
    <div className="profile-page-bg">
      {/* <Navbar /> */}
      
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
                  <span className={`status-pill status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>

                  <button 
                    className={`action-pill action-${booking.action.toLowerCase()}`}
                    onClick={() => handleActionClick(booking.action, booking.course)}
                  >
                    {booking.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;