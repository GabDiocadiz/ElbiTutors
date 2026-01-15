import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google"; // Import the hook
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import toast from "react-hot-toast";
import logoLightMode from "../../assets/logo_lightmode.png";
import "../../styles/design.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { setAuthSession } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    // This function remains the same as it's the logic AFTER getting the credential
    if (!credentialResponse?.credential) {
      toast.error("Google login failed: missing credential.");
      setLoading(false);
      return;
    }

    try {
      // setLoading is already true from the button click
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
        
        toast.success(`Welcome back, ${user.name}!`);
        return;
      }

      throw new Error("Unexpected server response");

    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);

      // NEW USER: 404 + googleData
      const googleData = err.response?.data?.googleData;
      if (googleData) {
        const dataToSave = { 
          ...googleData, 
          idToken: credentialResponse.credential 
        };
        
        localStorage.setItem("googleData", JSON.stringify(dataToSave));
        navigate("/basic-info", { state: { googleData: dataToSave, role: "tutee" } });
        return;
      }

      toast.error(
        err.response?.data?.message || "Google login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Initialize the login hook
  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      toast.error("Google login failed. Please try again.");
      setLoading(false);
    },
    // The 'code' flow is more secure, but requires more backend logic.
    // Your current implementation uses the 'implicit' flow which gives a credential directly.
    // We will stick to the implicit flow to match your backend.
  });

  const handleCustomButtonClick = () => {
    setLoading(true);
    login(); // Call the function from the hook
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
          
          {/* The hidden GoogleLogin component is no longer needed */}
        </div>
      </div>
    </div>
  );
}