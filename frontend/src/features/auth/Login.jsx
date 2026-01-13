import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import logoDarkMode from '../../assets/logo_darkmode.png';
import '../../styles/design.css';

export default function Login() {
  const [step, setStep, loading, setLoading] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Step 1: Login with UP Mail
  const handleGoogleLogin = async () => {
    try {
      // 1. Trigger the actual Google Login
      const user = await login(); 

      // 2. CHECK IF USER EXISTS IN DATABASE
      const { data } = await api.get(`/auth/check-user?email=${user.email}`);
      const isExistingUser = data.exists;

      if (isExistingUser) {
        // FLOW A: User exists -> Redirect to home or show error
        alert('You already have an account. Please use the main login page.');
        navigate('/');
      } else {
        // FLOW B: New User -> Go to Onboarding (Step 2)
        setStep(2);
      }
			setLoading(0);
			
    } catch (error) {
      console.error("Login failed:", error);
      alert('Login failed. Please try again.');
      setLoading(0);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-content-wrapper">
        
        {/* STEP 1: LANDING */}
        {step === 1 && (
          <div className="login-step-container">
            <img 
              src={logoDarkMode} 
              alt="ELBI Tutors" 
              className="login-main-logo" 
            />
            
            <button 
              onClick={handleGoogleLogin} 
              className="login-btn-maroon"
              disabled={loading}
            >
              {loading ? 'Loading...' : (
                <>Login with <strong>UP Mail</strong></>
              )}
            </button>
            
            <button onClick={() => navigate('/about')} className="login-btn-gray">
              What is ElBiTutors?
            </button>
          </div>
        )}

        {/* STEP 2: CHOICE (Only shown if New User) */}
        {step === 2 && (
          <div className="login-step-container">
            {/* Tutee Flow -> Basic Info */}
            <button onClick={() => navigate('/basic-info')} className="login-btn-green">
              I want to <strong>learn.</strong>
            </button>
            
            {/* Tutor Flow -> LRC Guide */}
            <button onClick={() => navigate('/lrc-guide')} className="login-btn-maroon">
              I want to become an <strong>LRC-Certified tutor</strong>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}