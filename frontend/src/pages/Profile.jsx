import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
// import NavBar from '../components/NavBar'; // Removed as requested
import Footer from '../components/Footer';
import ReportModal from '../components/ReportModal';
import CancellationModal from '../components/CancellationModal';
import EvaluationForm from '../components/EvaluationForm';
import BookingDetails from '../components/BookingDetails';
import Calendar from '../components/Calendar'; // Import the Calendar component

// Assets
import lrcBadge from '../assets/logo_lrc.png';
import userPlaceholder from '../assets/user_placeholder.png';

// Styling
import '../styles/design.css';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [showReport, setShowReport] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // State for toggling calendar edit mode
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);

  // Sync user state with authUser while keeping layout test data active
  const [user, setUser] = useState({
    name: "Maryz Cabatingan",
    email: "maryz@up.edu.ph",
    role: "tutor", // CHANGE THIS TO 'tutee' to see tutee view
    avatar: userPlaceholder,
    bio: "Coding is problem-solving in action. I help my peers understand data structures and computation by walking them through exercises step by step, focusing on logic and debugging.",
    courses: "CMSC 12, CMSC 21, CMSC 123, CMSC 150",
    experiences: [
      "Been tutoring for one year",
      "Worked part-time as an online tutor",
      "UPLB YSES Scholastic Head (A.Y. 2028-2029)",
      "P2OJECT YSES: Junior HackFest 2nd Runner Up"
    ]
  });

  // Expanded Mock Data (13+ items)
  const [bookings, setBookings] = useState([
    { id: 1, course: "CHEM 18 by Lance Perus", status: "active" },
    { id: 2, course: "CMSC 123 by Lance Perus", status: "active" },
    { id: 3, course: "STAT 101 by Lance Perus", status: "done" },
    { id: 4, course: "MATH 27 by Lance Perus", status: "evaluated" },
    { id: 5, course: "CMSC 21 by Maryz Cabatingan", status: "active" },
    { id: 6, course: "PHYS 71 by John Doe", status: "done" },
    { id: 7, course: "BIO 11 by Jane Smith", status: "evaluated" },
    { id: 8, course: "ENG 10 by Alex Jones", status: "active" },
    { id: 9, course: "ARTS 1 by Sarah Lee", status: "done" },
    { id: 10, course: "HK 11 by Mike Brown", status: "evaluated" },
    { id: 11, course: "CMSC 100 by Chris Green", status: "active" },
    { id: 12, course: "MATH 53 by Pat White", status: "done" },
    { id: 13, course: "CHEM 40 by Sam Black", status: "active" },
    { id: 14, course: "SOSC 3 by Kim Red", status: "done" },
  ]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const isTutor = user.role === 'tutor';
  const itemsPerPage = 5; // Fixed to 5 items max per page for both roles

  // Calculate Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  // Reset to page 1 if role changes
  useEffect(() => {
    setCurrentPage(1);
  }, [user.role]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleAction = (type, booking) => {
    setSelectedBooking(booking);
    if (type === 'cancel') setShowCancel(true);
    if (type === 'report') setShowReport(true);
    if (type === 'evaluate') setShowEvaluation(true);
    if (type === 'view') setShowDetails(true);
  };

  const handleEvaluationSubmit = () => {
    // Update the booking status to 'evaluated'
    if (selectedBooking) {
      setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, status: 'evaluated' } : b));
    }
    setShowEvaluation(false);
  };

  return (
    <div className="profile-page-bg">
      {/* NavBar removed as requested */}
      
      <div className="profile-container">
        {/* HEADER SECTION */}
        <header className="profile-header">
          <div className="profile-header-left">
            <div className="profile-avatar-wrapper">
              <img src={user.avatar} alt={user.name} className="profile-avatar" />
            </div>
            <div className="profile-identity">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>

          {isTutor && (
            <div className="profile-badge-section">
              <img src={lrcBadge} alt="LRC Logo" className="badge-logo" />
              <div className="badge-pill">LRC Tutor</div>
            </div>
          )}
        </header>

        {/* INFO GRID - Only visible for Tutors */}
        {isTutor && (
          <div className="tutor-info-grid">
            <div className="info-column-left">
              <div className="info-card bio-card">
                <p>{user.bio}</p>
              </div>
              <div className="info-card courses-card">
                <h3 className="card-label">Course(s) Offered</h3>
                <p>{user.courses}</p>
              </div>
            </div>
            <div className="info-card exp-card">
              <h3 className="card-title-maroon">Experiences</h3>
              <ul className="exp-list">
                {user.experiences.map((exp, i) => <li key={i}>{exp}</li>)}
              </ul>
            </div>
          </div>
        )}

        {/* REPORT LINK SECTION */}
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
                  
                  {/* Action Buttons Logic */}
                  <div className="action-buttons">
                    {/* Active bookings */}
                    {booking.status === 'active' && (
                      // UNIFIED ACTION: Both Tutors and Tutees see "View" for active bookings
                      <button className="btn-pill btn-view" onClick={() => handleAction('view', booking)}>View</button>
                    )}

                    {/* Tutee Actions for Done/Evaluated sessions */}
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
                    
                    {/* Tutor View for Past Sessions - Show View Details instead of nothing */}
                    {isTutor && booking.status !== 'active' && (
                       <button className="btn-pill btn-view" onClick={() => handleAction('view', booking)}>View</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                className="pagination-btn" 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="pagination-info">Page {currentPage} of {totalPages}</span>
              <button 
                className="pagination-btn" 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </section>

        {/* AVAILABILITY SECTION - Only visible for Tutors */}
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
            
            {/* Always show Calendar, toggle interactivity via readOnly prop */}
            <Calendar readOnly={!isEditingAvailability} />
          </section>
        )}

        {/* Spacer to push footer down */}
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
