import React from 'react';
import { Link } from 'react-router-dom';
import SimpleNavBar from '../components/SimpleNavBar';
import logoLightMode from '../assets/logo_lightmode.png';
import '../styles/design.css'; // Updated path to centralized CSS

export default function Home() {
  return (
    <div className="landing-page">
      <SimpleNavBar />
      
      <main className="landing-content">
        <div className="landing-logo-container">
          <img
            src={logoLightMode}
            alt="ELBI Tutors Logo"
            className="landing-logo-image"
          />
        </div>
        
        <h1 className="landing-title">
          <span className="maroon">Learn. </span>
          <span className="gold">Teach.</span>
          <span className="green"> Succeed.</span>
          <span className="dark"> Together.</span>
        </h1>
        
        <p className="landing-subtitle">
          Connect with peers, certified tutors, and group study opportunities — all in one place.
        </p>
        
        <Link to="/login" className="cta-button-link">
          <button className="cta-button">
            Log in
          </button>
        </Link>
      </main>
    </div>
  );
}