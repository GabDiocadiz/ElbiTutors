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

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      alert("Google login failed: missing credential.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      // Existing user → log in
      if (response?.data?.token && response?.data?.user) {
        const { token, user } = response.data;
        setAuthSession(token, user);
        
        // Redirect based on role
        if (user.role === 'admin' || user.isLRCAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
        return;
      }

      throw new Error("Unexpected server response");

    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);

      // NEW USER: 404 + googleData
      const googleData = err.response?.data?.googleData;
      if (googleData) {
        // IMPORTANT: Attach the credential (ID Token) to the data object
        // This is required for the final registration step in TermsAndConditions
        const dataToSave = { 
          ...googleData, 
          idToken: credentialResponse.credential 
        };
        
        localStorage.setItem("googleData", JSON.stringify(dataToSave));
        navigate("/basic-info", { state: { googleData: dataToSave, role: "tutee" } });
        return;
      }

      alert(
        err.response?.data?.message || "Google login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCustomButtonClick = () => {
    const googleButton = document.querySelector('div[role="button"]');
    if (googleButton) googleButton.click();
    else alert("Google login button not ready. Please try again.");
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
            onClick={handleCustomButtonClick}
            className="login-btn-maroon"
            disabled={loading}
          >
            {loading ? "Connecting..." : <>Login with <strong>UP Mail</strong></>}
          </button>

          {/* RESTORED BUTTON */}
          <button onClick={() => navigate("/about")} className="login-btn-gray">
            What is ELBI Tutors?
          </button>

          <div style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google login failed")}
              useOneTap={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}