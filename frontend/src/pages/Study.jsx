import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Study.css';
import '../styles/design.css';

const Study = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Mock Data for Tutors
  const tutors = [
    { id: 101, name: "Joanne Maryz Cabatingan", courses: "CMSC 12, CMSC 21, MATH 27", type: "recommended" },
    { id: 102, name: "Gavin", courses: "CHEM 18, BIO 11", type: "recommended" },
    { id: 103, name: "Angeline Cubelo", courses: "PHYS 71, MATH 28", type: "recommended" },
    { id: 104, name: "Lance", courses: "CMSC 123, STAT 1", type: "recommended" },
    { id: 105, name: "Eitan", courses: "ENG 10, COMM 10", type: "new" },
    { id: 106, name: "Kevin", courses: "ARTS 1, HUM 3", type: "new" },
  ];

  // Filtering Logic
  const filteredTutors = tutors.filter(tutor => {
    const matchesName = tutor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === '' || tutor.courses.includes(selectedSubject);
    return matchesName && matchesSubject;
  });

  const recommendedTutors = filteredTutors.filter(t => t.type === 'recommended');
  const newTutors = filteredTutors.filter(t => t.type === 'new');

  const handleVisitTutor = (tutorId) => {
    // Navigate to the public profile view of the tutor
    navigate(`/tutor/${tutorId}`);
  };

  return (
    <div className="study-page-bg">
      {/* <Navbar /> */}

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
            <select 
              className="subject-dropdown"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Select the subject(s) you want to study</option>
              <option value="CMSC">Computer Science (CMSC)</option>
              <option value="MATH">Mathematics (MATH)</option>
              <option value="CHEM">Chemistry (CHEM)</option>
              <option value="BIO">Biology (BIO)</option>
            </select>
          </div>
        </div>

        {/* RECOMMENDED SECTION */}
        <section className="tutor-section">
          <h2 className="section-header-maroon">Recommended</h2>
          <div className="tutor-grid">
            {recommendedTutors.length > 0 ? (
              recommendedTutors.map(tutor => (
                <TutorCard key={tutor.id} tutor={tutor} onVisit={handleVisitTutor} />
              ))
            ) : (
              <p className="no-results">No recommended tutors found.</p>
            )}
          </div>
        </section>

        {/* NEW TUTORS SECTION */}
        <section className="tutor-section">
          <h2 className="section-header-maroon">New Tutors</h2>
          <div className="tutor-grid">
            {newTutors.length > 0 ? (
              newTutors.map(tutor => (
                <TutorCard key={tutor.id} tutor={tutor} onVisit={handleVisitTutor} />
              ))
            ) : (
              <p className="no-results">No new tutors found.</p>
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
    <div className="card-top-accent"></div> {/* Optional visual touch */}
    <h3 className="tutor-name">{tutor.name}</h3>
    <p className="tutor-courses">{tutor.courses}</p>
    <button className="visit-btn" onClick={() => onVisit(tutor.id)}>
      Visit Tutor
    </button>
  </div>
);

export default Study;