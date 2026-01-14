import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import logoLightMode from "../../assets/logo_lightmode.png";
import "../../styles/design.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { setAuthSession } = useAuth();
  const navigate = useNavigate();

  /**
   * ============================
   * GOOGLE LOGIN SUCCESS
   * ============================
   */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      // Send ID token to backend
      const { data } = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      // Existing user → log in
      setAuthSession(data.token, data.user);
      navigate("/dashboard");

    } catch (err) {
      // New user → onboarding
      if (err.response?.status === 404) {
        navigate("/basic-info", {
          state: {
            googleData: err.response.data.googleData,
            role: "tutee",
          },
        });
      } else {
        alert(err.response?.data?.message || "Google login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * ============================
   * CUSTOM BUTTON HANDLER
   * ============================
   */
  const handleCustomButtonClick = () => {
    // Trigger the hidden GoogleLogin button
    document.querySelector('div[role="button"]')?.click();
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

          {/* --- YOUR ORIGINAL MAROON BUTTON --- */}
          <button
            onClick={handleCustomButtonClick}
            className="login-btn-maroon"
            disabled={loading}
          >
            {loading ? "Connecting..." : <>Login with <strong>UP Mail</strong></>}
          </button>

          <button
            onClick={() => navigate("/about")}
            className="login-btn-gray"
          >
            What is ElBiTutors?
          </button>

          {/* --- HIDDEN GOOGLE LOGIN --- */}
          <div style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google Login Failed")}
              useOneTap={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
