import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import SessionBookedModal from '../components/SessionBookedModal';
import ReportModal from '../components/ReportModal';
import Calendar from '../components/Calendar'; 
import lrcBadge from '../assets/logo_lrc.png';

// Styling
import '../styles/Components.css';
import '../styles/design.css';
export default function TutorProfileView() {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [tutorData, setTutorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSessionBookedModal, setShowSessionBookedModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [error, setError] = useState(null);
  const [lastBooking, setLastBooking] = useState(null);

  const isTutor = currentUser?.role === 'tutor';

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tutors/${tutorId}`);
        setTutorData(response.data);
      } catch (err) {
        console.error("Failed to fetch tutor", err);
        setError("Tutor not found");
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [tutorId]);

  const handleBookSession = async (bookingData) => {
    if (isTutor) return; 
    
    try {
      setError(null);
      
      // Helper to convert time string (e.g. "7:30 AM") to Date object
      const parseTime = (dateStr, timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        const date = new Date(dateStr);
        date.setHours(hours, minutes, 0, 0);
        return date;
      };

      const start = parseTime(bookingData.date, bookingData.timeFrom);
      const end = parseTime(bookingData.date, bookingData.timeTo);
      const isGroup = bookingData.participants !== '1 PERSON';
      const participantsCount = parseInt(bookingData.participants.split(' ')[0]);

      const payload = {
        tutorId: tutorData.userId?._id, 
        topic: `${bookingData.courseCode.join(', ')} - ${bookingData.topics}`,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        isGroup,
        participantsCount
      };

      await api.post('/sessions', payload);
      
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      
      const [year, month, day] = bookingData.date.split('-').map(Number);
      const safeDate = new Date(year, month - 1, day);

      const formattedBooking = {
        date: String(day),
        month: monthNames[safeDate.getMonth()],
        course: payload.topic,
        time: `${dayNames[safeDate.getDay()]}: ${bookingData.timeFrom}-${bookingData.timeTo}`,
        timezone: '(GMT+08:00) Philippine Standard Time'
      };

      setLastBooking(formattedBooking);
      setShowBookingModal(false);
      setShowSessionBookedModal(true);

    } catch (err) {
      console.error("Booking failed", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  const handleReportSubmit = async (reportData) => {
    try {
      await api.post('/reports', {
        reportedId: tutorData.userId?._id,
        description: reportData.report
      });
      setShowReportModal(true); // ReportModal will handle the success state internally
    } catch (err) {
      console.error("Report submission failed", err.response?.data || err.message);
      toast.error("Failed to submit report. Please try again.");
      setShowReportModal(false);
    }
  };

  return (
    <div className="tutor-profile-view-page">
      <NavBar />
      
      <div className="tutor-profile-content">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">Loading tutor profile...</div>
        ) : !tutorData ? (
          <div className="text-center py-10">Tutor not found</div>
        ) : (
          <>
        <div className="tutor-profile-header">
          <div className="tutor-header-main">
            <div className="tutor-avatar-large">
              <img src={tutorData.userId?.picture || lrcBadge} alt={tutorData.userId?.name} />
            </div>
            
            <div className="tutor-header-info">
              <h1 className="tutor-name">{tutorData.userId?.name}</h1>
              <p className="tutor-email">{tutorData.userId?.email}</p>
              <p className="tutor-program text-sm text-gray-500">{tutorData.userId?.degree_program}</p>
            </div>
          </div>

          <div className="tutor-badge-section">
            <div className="tutor-badge-image">
              <img src={lrcBadge} alt="LRC Badge" />
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
              <p className="courses-list">{tutorData.subjectsOffered?.join(', ')}</p>
            </div>

            <div className="availability-section">
              <h2 className="availability-title">Availability</h2>
              <div className="availability-calendar">
                {/* SRS 4.4.3 REQ-3: Embed Google Calendar Link */}
                <Calendar 
                  readOnly={true} 
                  availabilityImage={tutorData.availabilityImage} 
                  googleCalendarLink={tutorData.googleCalendarLink}
                />
              </div>
            </div>
          </div>

          <div className="tutor-info-right">
            <div className="tutor-experiences-card">
              <h3 className="experiences-title">Specialization</h3>
              <p className="p-4">{tutorData.specializationText || "Not specified"}</p>
            </div>

            <div className="book-session-button-wrapper">
              <button 
                className="book-session-button"
                onClick={() => setShowBookingModal(true)}
                disabled={isTutor} 
                style={isTutor ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
              >
                {isTutor ? 'Booking Disabled for Tutors' : 'Book a Session'}
              </button>
            </div>

            <div className="tutor-guidelines-card">
              <h3 className="guidelines-title">Guidelines</h3>
              <ul className="guidelines-list">
                <li>Book at least 2 days before your desired date.</li>
                <li>You can only have at most 3 active sessions at a time.</li>
              </ul>
            </div>

            <div className="report-link-section">
              <p>
                <span className="report-text-gray">If you're experiencing a problem, click </span>
                <button className="report-link" onClick={() => setShowReportModal(true)}>here</button>
                <span className="report-text-gray"> to report.</span>
              </p>
            </div>
          </div>
        </div>
          </>
        )}
      </div>

      <Footer />

      {showBookingModal && (
        <BookingModal
          tutorName={tutorData.userId?.name}
          onClose={() => setShowBookingModal(false)}
          onSubmit={handleBookSession}
          subjects={tutorData.subjectsOffered}
        />
      )}

      {showSessionBookedModal && (
        <SessionBookedModal 
          onClose={() => setShowSessionBookedModal(false)} 
          sessionData={lastBooking}
        />
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