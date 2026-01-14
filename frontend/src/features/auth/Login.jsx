import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google'; // Real Google Login Hook
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import logoLightMode from '../../assets/logo_lightmode.png';
import '../../styles/design.css';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { setAuthSession } = useAuth(); 
  const navigate = useNavigate();

  // --- REAL GOOGLE LOGIN IMPLEMENTATION ---
  const loginToGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        
        // 1. Fetch Real User Info from Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const googleUser = userInfo.data; // Contains email, name, picture, sub (id)

        // 2. Check Backend with Real Data
        try {
          const { data } = await api.post('/auth/google', {
              email: googleUser.email,
              googleId: googleUser.sub,
              name: googleUser.name,
              picture: googleUser.picture
          });

          // SUCCESS: Log in
          console.log("Login Success:", data.user);
          setAuthSession(data.token, data.user);
          navigate('/dashboard');

        } catch (backendError) {
          if (backendError.response && backendError.response.status === 404) {
               // USER NOT FOUND -> New User Flow (Go to Basic Info)
               // Map Google Data to our expected format
               navigate('/basic-info', { 
                 state: { 
                   googleUser: {
                     email: googleUser.email,
                     displayName: googleUser.name,
                     photoURL: googleUser.picture,
                     uid: googleUser.sub
                   },
                   role: 'tutee' 
                 } 
               });
          } else {
               const msg = backendError.response?.data?.message || "Unknown error";
               alert('Login Server Error: ' + msg);
          }
        }
      } catch (error) {
        console.error("Failed to get user info from Google", error);
        alert("Could not retrieve Google Profile.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      alert('Google Login Failed');
      setLoading(false);
    }
  });

  return (
    <div className="login-page-container">
      <div className="login-content-wrapper">
        <div className="login-step-container">
          <img src={logoLightMode} alt="ELBI Tutors" className="login-main-logo" />
          
          <button 
            onClick={() => loginToGoogle()} // Triggers the popup
            className="login-btn-maroon"
            disabled={loading}
          >
            {loading ? 'Connecting...' : <>Login with <strong>UP Mail</strong></>}
          </button>
          
          <button onClick={() => navigate('/about')} className="login-btn-gray">
            What is ElBiTutors?
          </button>
        </div>
      </div>
    </div>
  );
}