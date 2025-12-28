import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logoLightMode from '../../assets/logo_lightmode.png';
import '../../styles/design.css';

export default function Login() {
  const [step, setStep] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Step 1: Login with UP Mail
  const handleGoogleLogin = async () => {
    // In a real scenario, login() would trigger the Google Popup
    setStep(2);
  };

  // Step 3: Final Submission
  const handleFinalSignup = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-page-container">
      <div className="login-content-wrapper">
        
        {/* STEP 1: LANDING */}
        {step === 1 && (
          <div className="login-step-container">
            <img 
              src={logoLightMode} 
              alt="ELBI Tutors" 
              className="login-main-logo" 
            />
            
            <button onClick={handleGoogleLogin} className="login-btn-maroon">
              Login with <strong>UP Mail</strong>
            </button>
            
            <button onClick={() => navigate('/about')} className="login-btn-gray">
              What is ElBiTutors?
            </button>
          </div>
        )}

        {/* STEP 2: CHOICE */}
        {step === 2 && (
          <div className="login-step-container">
            {/* UPDATED: Navigates to Basic Info */}
            <button onClick={() => navigate('/basic-info')} className="login-btn-green">
              I want to <strong>learn.</strong>
            </button>
            
            {/* UPDATED: Navigates to LRC Guide (from previous request) */}
            <button onClick={() => navigate('/lrc-guide')} className="login-btn-maroon">
              I want to become an <strong>LRC-Certified tutor</strong>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}