import { useState, useRef } from "react"; // Removed useEffect as it's not used
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import toast from "react-hot-toast";
import logoLightMode from "../../assets/logo_lightmode.png";
import "../../styles/design.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { setAuthSession } = useAuth();
  const navigate = useNavigate();
  const googleButtonContainerRef = useRef(null); // Ref for the container div

  const triggerGoogleLogin = () => {
    setLoading(true);
    if (googleButtonContainerRef.current) {
      // The Google button is rendered inside the container; we need to find and click it.
      const googleButton = googleButtonContainerRef.current.querySelector('div[role="button"]');
      if (googleButton) {
        googleButton.click();
      } else {
        toast.error("Google login is not ready. Please wait a moment and try again.");
        setLoading(false);
      }
    } else {
      toast.error("Google login component failed to load.");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error("Google login failed: missing credential.");
      setLoading(false);
      return;
    }

    // setLoading(true) was already called by triggerGoogleLogin
    try {
      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      if (response?.data?.token && response?.data?.user) {
        const { token, user } = response.data;
        setAuthSession(token, user);
        
        if (user.role === 'admin' || user.isLRCAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
        
        toast.success(`Welcome back, ${user.name}!`);
      } else {
        throw new Error("Unexpected server response");
      }

    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);
      const googleData = err.response?.data?.googleData;
      if (googleData) {
        const dataToSave = { 
          ...googleData, 
          idToken: credentialResponse.credential 
        };
        localStorage.setItem("googleData", JSON.stringify(dataToSave));
        navigate("/basic-info", { state: { googleData: dataToSave, role: "tutee" } });
      } else {
        toast.error(err.response?.data?.message || "Google login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again or check your browser settings.");
    setLoading(false);
  };

  return (
    <div className="login-page-container">
      <div className="login-content-wrapper">
        <div className="login-step-container">
          <img
            src={logoLightMode}
            alt="ELBI Tutors"
            className="login-main-logo"
          />

          <button
            onClick={triggerGoogleLogin}
            className="login-btn-maroon"
            disabled={loading}
          >
            {loading ? "Connecting..." : <>Login with <strong>UP Mail</strong></>}
          </button>

          <button onClick={() => navigate("/about")} className="login-btn-gray">
            What is ELBI Tutors?
          </button>

          {/* This div holds the invisible Google button */}
          <div
            ref={googleButtonContainerRef}
            style={{ position: 'absolute', top: '-1000px', left: '-1000px' }}
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}