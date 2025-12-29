import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SimpleNavBar from '../components/SimpleNavBar';
import Navbar from '../components/Navbar';
import logoLightMode from '../assets/logo_lightmode.png';
import Footer from '../components/Footer';
import '../styles/design.css';

const AboutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="about-page-bg">
      {/* Navbar Logic */}
      {user ? <Navbar /> : <SimpleNavBar />}

      <main className="about-content-card">
        {/* Back Button Logic */}
        {!user && (
          <button className="back-button" onClick={() => navigate(-1)}>
            <span className="back-icon">←</span> Back
          </button>
        )}

        {/* Section: What is ELBITutor? */}
        <section className="text-section">
          <h1 className="header-maroon">What is ELBITutor?</h1>
          <p className="body-text">
            ELBITutors is a peer-to-peer academic support platform designed for the University of the Philippines Los Baños (UPLB). 
            It connects students with trusted tutors, group study sessions, and official review programs from the Learning Resource Center (LRC). 
            Whether as a tutee seeking guidance or as a tutor sharing expertise, students can easily find opportunities to learn, teach, 
            and collaborate in one centralized platform.
          </p>
        </section>

        {/* Section: Our Vision */}
        <section className="text-section">
          <h2 className="header-green">Our Vision</h2>
          <p className="body-text">
            We envision a UPLB community where academic support is accessible, collaborative, and empowering. Through ELBITutors, 
            we aim to strengthen student preparedness, foster a culture of shared learning, and contribute to the university's mission of 
            academic excellence and holistic student development.
          </p>
        </section>

        {/* Section: About Us (Team Content) */}
        <section className="about-us-container">
          <h2 className="header-maroon">About Us</h2>
          <p className="sub-header">The team behind ELBITutors</p>

          <div className="team-inner-card">
            <div className="team-logo-container">
              <img src={logoLightMode} alt="ELBI Tutors Logo" className="team-logo-img" />
            </div>

            <h3 className="group-name">GABABIES</h3>
            
            <p className="group-description">
              We are YSES Applicants from the University of the Philippines - Los Baños. 
              This project is a requirement for the <span className="text-bold-maroon">YSES Trainee’s Project</span> requirement 
              as part of the Onboarding Process.
            </p>

            <p className="group-mission">
              Our goal is to create a platform that promotes peer tutoring among UPLB students, volunteer tutors, 
              and the LRC tutors by offering a space for them to navigate and book tutorial sessions for 
              any course.
            </p>
          </div>
        </section>
      </main>

      {/* Footer moved OUTSIDE of main content card */}
      <Footer />
    </div>
  );
};

export default AboutPage;