import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/Footer';
import ReportModal from '../components/ReportModal';
import CancellationModal from '../components/CancellationModal';
import EvaluationForm from '../components/EvaluationForm';
import BookingDetails from '../components/BookingDetails';
import Calendar from '../components/Calendar';

// Assets
import lrcBadge from '../assets/logo_lrc.png';
import userPlaceholder from '../assets/user_placeholder.png';

// Styling
import '../styles/design.css';

const Profile = () => {
  const { user: authUser } = useAuth(); // Contains Google profile info (name, email, picture)
  
  // Database States
  const [dbUser, setDbUser] = useState(null);
  const [tutorData, setTutorData] = useState(null);
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

  // Mock Bookings (Replace with API call in future iterations)
  const [bookings, setBookings] = useState([
    { id: 1, course: "CHEM 18 by Lance Perus", status: "active" },
    { id: 2, course: "CMSC 123 by Lance Perus", status: "active" },
    { id: 3, course: "STAT 101 by Lance Perus", status: "done" },
    { id: 4, course: "MATH 27 by Lance Perus", status: "evaluated" },
    { id: 5, course: "CMSC 21 by Maryz Cabatingan", status: "active" },
  ]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        };

        // 1. Fetch User Info from Database (userController.getUserProfile)
        const userRes = await fetch('/api/users/me', { headers });
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();
        setDbUser(userData);

        // 2. If User is a Tutor in DB, fetch Tutor specific profile
        if (userData.role === 'tutor') {
          const tutorRes = await fetch('/api/tutors/profile', { headers });
          if (tutorRes.ok) {
            const tutorInfo = await tutorRes.json();
            setTutorData(tutorInfo);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  /**
   * INTEGRATION LOGIC
   * 1. Identity (Name, Email, Picture) comes from Google Profile (authUser)
   * 2. Role and Academic details come from Database (dbUser)
   */
  const isTutor = dbUser?.role === 'tutor';
  
  // Use authUser for identity, fallback to dbUser
  const displayName = authUser?.name || dbUser?.name || "User";
  const displayEmail = authUser?.email || dbUser?.email || "";
  
  // Fix for Profile Picture: Check authUser.picture first (Google), then dbUser.picture, then placeholder
  const displayAvatar = authUser?.picture || dbUser?.picture || userPlaceholder;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

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
    if (selectedBooking) {
      setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, status: 'evaluated' } : b));
    }
    setShowEvaluation(false);
  };

  if (loading) {
    return (
      <div className="profile-loading-container">
        <div className="loader"></div>
        <p>Syncing Profile...</p>
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
              {/* Academic info always from DB */}
              <p className="profile-academic-info">
                {dbUser?.degree_program} | {dbUser?.classification}
              </p>
            </div>
          </div>

          {/* LRC Badge: Visible if DB role is tutor */}
          {isTutor && (
            <div className="profile-badge-section">
              <img src={lrcBadge} alt="LRC Logo" className="badge-logo" />
              <div className="badge-pill">LRC Tutor</div>
            </div>
          )}
        </header>

        {/* INFO GRID - Only for Tutors */}
        {isTutor && tutorData && (
          <div className="tutor-info-grid">
            <div className="info-column-left">
              <div className="info-card bio-card">
                <p>{tutorData.bio || "No bio available. Add one in settings!"}</p>
              </div>
              <div className="info-card courses-card">
                <h3 className="card-label">Course(s) Offered</h3>
                <p>{tutorData.subjectsOffered?.join(', ') || "None listed"}</p>
              </div>
            </div>
            <div className="info-card exp-card">
              <h3 className="card-title-maroon">Specialization</h3>
              <p>{tutorData.specializationText || "Generalist"}</p>
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

        {/* BOOKING HISTORY */}
        <section className="booking-history-section">
          <div className="booking-history-header">
            <h2 className="section-title">My booking history</h2>
            <div className="history-column-labels">
              <span>Status</span>
              <span>Action</span>
            </div>
          </div>

          <div className="booking-list">
            {currentBookings.map((booking) => (
              <div key={booking.id} className="booking-row">
                <div className="booking-name-pill">{booking.course}</div>
                <div className="booking-status-action" style={{ flexWrap: 'nowrap' }}>
                  <span className={`status-pill status-${booking.status === 'evaluated' ? 'done' : booking.status}`}>
                    {booking.status === 'evaluated' ? 'Done' : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  
                  <div className="action-buttons">
                    {booking.status === 'active' && (
                      <button className="btn-pill btn-view" onClick={() => handleAction('view', booking)}>View</button>
                    )}

                    {!isTutor && (
                      <>
                        {booking.status === 'done' && (
                          <button 
                            className="btn-pill btn-evaluate" 
                            style={{backgroundColor: '#2d5a27', color: 'white'}} 
                            onClick={() => handleAction('evaluate', booking)}
                          >
                            Evaluate
                          </button>
                        )}
                        {booking.status === 'evaluated' && (
                          <button 
                            className="btn-pill btn-evaluated" 
                            disabled
                            style={{backgroundColor: '#ccc', color: '#666', cursor: 'not-allowed'}} 
                          >
                            Evaluated
                          </button>
                        )}
                      </>
                    )}
                    
                    {isTutor && booking.status !== 'active' && (
                       <button className="btn-pill btn-view" onClick={() => handleAction('view', booking)}>View</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
      {showCancel && <CancellationModal sessionData={selectedBooking} onClose={() => setShowCancel(false)} onSubmit={(data) => setBookings(prev => prev.map(b => b.id === data.id ? {...b, status: 'pending'} : b))} />}
      {showReport && <ReportModal sessionData={selectedBooking} onClose={() => setShowReport(false)} onSubmit={() => setShowReport(false)} />}
      {showEvaluation && <EvaluationForm sessionData={selectedBooking} onClose={() => setShowEvaluation(false)} onSubmit={handleEvaluationSubmit} />}
      {showDetails && <BookingDetails sessionData={selectedBooking} onClose={() => setShowDetails(false)} />}
    </div>
  );
};

export default Profile;