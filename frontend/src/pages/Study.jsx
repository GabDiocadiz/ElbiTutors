import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/Footer';
import SubjectDropdown from '../components/SubjectDropdown';
import '../styles/design.css';

const Study = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Tutors from API
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        // GET /api/tutors returns certified tutors
        const response = await api.get('/tutors');
        setTutors(response.data);
      } catch (err) {
        console.error("Failed to fetch tutors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  // Filtering Logic
  const filteredTutors = tutors.filter(tutor => {
    const tutorName = tutor.userId?.name || "";
    const courses = tutor.subjectsOffered?.join(", ") || "";
    
    const matchesName = tutorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubjects.length === 0 ||
      selectedSubjects.some(subject => courses.includes(subject));
    return matchesName && matchesSubject;
  });

  // For now, we split by those with higher ratings for "Recommended"
  // or just show all in one if preferred.
  const recommendedTutors = filteredTutors.filter(t => (t.rating || 0) >= 4.5);
  const newTutors = filteredTutors.filter(t => (t.rating || 0) < 4.5);

  const handleVisitTutor = (tutorId) => {
    navigate(`/tutor/${tutorId}/view`); 
  };

  return (
    <div className="study-page-bg">
      <main className="study-container">
        {/* SEARCH SECTION */}
        <div className="search-section">
          <div className="search-bar-wrapper">
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-wrapper">
            <SubjectDropdown
              selectedSubjects={selectedSubjects}
              onChange={setSelectedSubjects}
              placeholder="Select the subject(s) you want to study"
            />
          </div>
        </div>

        {/* RECOMMENDED SECTION */}
        <section className="tutor-section">
          <h2 className="section-header-maroon">Recommended</h2>
          <div className="tutor-grid">
            {loading ? (
              <p className="no-results">Loading tutors...</p>
            ) : recommendedTutors.length > 0 ? (
              recommendedTutors.map(tutor => (
                <TutorCard key={tutor._id} tutor={tutor} onVisit={handleVisitTutor} />
              ))
            ) : (
              <p className="no-results">No recommended tutors found.</p>
            )}
          </div>
        </section>

        {/* NEW TUTORS SECTION */}
        <section className="tutor-section">
          <h2 className="section-header-maroon">Other Tutors</h2>
          <div className="tutor-grid">
            {loading ? (
              <p className="no-results">Loading tutors...</p>
            ) : newTutors.length > 0 ? (
              newTutors.map(tutor => (
                <TutorCard key={tutor._id} tutor={tutor} onVisit={handleVisitTutor} />
              ))
            ) : (
              <p className="no-results">No other tutors found.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Sub-component for the card to keep code clean
const TutorCard = ({ tutor, onVisit }) => (
  <div className="tutor-card">
    <div className="card-top-accent"></div> 
    <h3 className="tutor-name">{tutor.userId?.name || "Anonymous"}</h3>
    <p className="tutor-courses">{tutor.subjectsOffered?.join(", ") || "No courses listed"}</p>
    <button className="visit-btn" onClick={() => onVisit(tutor._id)}>
      Visit Tutor
    </button>
  </div>
);

export default Study;
