import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/Footer';
import ReportModal from '../components/ReportModal';
import CancellationModal from '../components/CancellationModal';
import EvaluationForm from '../components/EvaluationForm';
import BookingDetails from '../components/BookingDetails';
import Calendar from '../components/Calendar';

// Assets
// Assets
import lrcBadge from '../assets/logo_lrc.png';
import userPlaceholder from '../assets/user_placeholder.png';
import api, { getUserProfile } from '../services/api';

// Styling
import '../styles/design.css';

const Profile = () => {
  const { user: authUser } = useAuth(); // Data from Google Auth Context
  
  // Database States
  const [dbUser, setDbUser] = useState(null);
  const [tutorData, setTutorData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [showReport, setShowReport] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch User Info (Role, Program, Classification) from Database using axios service
        const userRes = await getUserProfile();
        const userData = userRes.data;
        setDbUser(userData);

        // 2. Fetch Sessions/Bookings
        const sessionRes = await api.get('/sessions/my-sessions');
        setBookings(sessionRes.data);

        // 3. Fetch Tutor Details if role is 'tutor'
        if (userData.role === 'tutor') {
          const tutorRes = await api.get('/tutors/profile');
          setTutorData(tutorRes.data);
        }
      } catch (err) {
        console.error("Profile Data Sync Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  /**
   * INTEGRATION LOGIC
   * Priority 1: Google Account (authUser) for Identity
   * Priority 2: Database (dbUser) for Academic/Role details
   */
  const isTutor = dbUser?.role === 'tutor';
  
  // Name resolution: First try Google full name, then given/family, then DB fallback
  const displayName = authUser?.name || dbUser?.name || "User";



  // Email
  const displayEmail = authUser?.email || dbUser?.email || "";

  // Profile Picture
  const displayAvatar = authUser?.picture || authUser?.photoURL || dbUser?.picture || userPlaceholder;


  // Pagination Logic for Dynamic Bookings
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookings.length / itemsPerPage) || 1;

  const handleNextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);

  const handleAction = (type, booking) => {
    setSelectedBooking(booking);
    if (type === 'cancel') setShowCancel(true);
    if (type === 'report') setShowReport(true);
    if (type === 'evaluate') setShowEvaluation(true);
    if (type === 'view') setShowDetails(true);
  };

  const handleEvaluationSubmit = () => {
    setShowEvaluation(false);
  };

  if (loading) {
    return (
      <div className="profile-loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="loader"></div>
        <p style={{ marginTop: '1rem', color: '#800000', fontWeight: 'bold' }}>Syncing Account...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-bg">
      <div className="profile-container">
        {/* HEADER SECTION */}
        <header className="profile-header">
          <div className="profile-header-left">
            <div className="profile-avatar-wrapper">
              <img 
                src={displayAvatar} 
                alt={displayName} 
                className="profile-avatar" 
                onError={(e) => { e.target.src = userPlaceholder; }}
              />
            </div>
            <div className="profile-identity">
              <h1 className="profile-name">{displayName}</h1>
              <p className="profile-email">{displayEmail}</p>
              <p className="profile-academic-info">
                {dbUser?.degree_program || "No Program Set"} | {dbUser?.classification || "No Classification"}
              </p>
            </div>
          </div>

          {/* LRC Badge: Corrected Conditional Rendering based on DB role */}
          {isTutor && (
            <div className="profile-badge-section">
              <img src={lrcBadge} alt="LRC Logo" className="badge-logo" />
              <div className="badge-pill">LRC Tutor</div>
            </div>
          )}
        </header>

        {/* INFO GRID - Tutor specific data */}
        {isTutor && tutorData && (
          <div className="tutor-info-grid">
            <div className="info-column-left">
              <div className="info-card bio-card">
                <p>{tutorData.bio || "No bio added yet."}</p>
              </div>
              <div className="info-card courses-card">
                <h3 className="card-label">Course(s) Offered</h3>
                <p>{tutorData.subjectsOffered?.join(', ') || "No subjects listed."}</p>
              </div>
            </div>
            <div className="info-card exp-card">
              <h3 className="card-title-maroon">Specialization</h3>
              <p>{tutorData.specializationText || "LRC Peer Tutor"}</p>
            </div>
          </div>
        )}

        {/* REPORT LINK - Tutee Only */}
        {!isTutor && (
          <div className="report-link-section" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p>
              <span className="report-text-gray" style={{ color: '#959595', fontSize: '15px', fontWeight: '700' }}>If you're experiencing a problem, click </span>
              <button 
                className="report-link" 
                style={{ color: '#800000', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '700', padding: 0 }}
                onClick={() => setShowReport(true)}
              >
                here
              </button>
              <span className="report-text-gray" style={{ color: '#959595', fontSize: '15px', fontWeight: '700' }}> to report.</span>
            </p>
          </div>
        )}

        {/* BOOKING HISTORY - Dynamic Data */}
        <section className="booking-history-section">
          <div className="booking-history-header">
            <h2 className="section-title">My booking history</h2>
            <div className="history-column-labels">
              <span>Status</span>
              <span>Action</span>
            </div>
          </div>

          <div className="booking-list">
            {currentBookings.length > 0 ? (
              currentBookings.map((booking) => (
                <div key={booking._id || booking.id} className="booking-row">
                  <div className="booking-name-pill">{booking.topic || "Untitled Session"}</div>
                  <div className="booking-status-action" style={{ flexWrap: 'nowrap' }}>
                    <span className={`status-pill status-${booking.status === 'done' ? 'done' : booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    
                    <div className="action-buttons">
                      <button className="btn-pill btn-view" onClick={() => handleAction('view', booking)}>View</button>
                      
                      {!isTutor && booking.status === 'done' && (
                        <button 
                          className="btn-pill btn-evaluate" 
                          style={{backgroundColor: '#2d5a27', color: 'white'}} 
                          onClick={() => handleAction('evaluate', booking)}
                        >
                          Evaluate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '20px', color: '#959595' }}>No booking history found.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <button className="pagination-btn" onClick={handlePrevPage} disabled={currentPage === 1}>Prev</button>
              <span className="pagination-info">Page {currentPage} of {totalPages}</span>
              <button className="pagination-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
          )}
        </section>

        {/* AVAILABILITY SECTION - Only for Tutors */}
        {isTutor && (
          <section className="availability-container">
            <div className="availability-header-row">
              <h2 className="availability-title">Availability</h2>
              <button 
                className="btn-edit-availability"
                onClick={() => setIsEditingAvailability(!isEditingAvailability)}
              >
                {isEditingAvailability ? 'Done Editing' : 'Edit Availability'}
              </button>
            </div>
            
            <Calendar 
              readOnly={!isEditingAvailability} 
              initialEvents={tutorData?.availabilityImage} 
            />
          </section>
        )}

        <div className="profile-footer-spacer"></div>
      </div>

      <Footer />
      {showCancel && <CancellationModal sessionData={selectedBooking} onClose={() => setShowCancel(false)} />}
      {showReport && <ReportModal sessionData={selectedBooking} onClose={() => setShowReport(false)} />}
      {showEvaluation && <EvaluationForm sessionData={selectedBooking} onClose={() => setShowEvaluation(false)} onSubmit={handleEvaluationSubmit} />}
      {showDetails && <BookingDetails sessionData={selectedBooking} onClose={() => setShowDetails(false)} />}
    </div>
  );
};

export default Profile;