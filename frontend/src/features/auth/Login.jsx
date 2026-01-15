import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import toast from "react-hot-toast";
import logoLightMode from "../../assets/logo_lightmode.png";
import "../../styles/design.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { setAuthSession } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (codeResponse) => {
    const code = codeResponse?.code;

    if (!code) {
      toast.error("Google login failed: No authorization code returned.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/google", { code });

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
        throw new Error("Unexpected server response during login.");
      }

    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);

      const googleData = err.response?.data?.googleData;
      if (googleData) {
        const dataToSave = { ...googleData };
        localStorage.setItem("googleData", JSON.stringify(dataToSave));
        navigate("/basic-info", { state: { googleData: dataToSave, role: "tutee" } });
      } else {
        toast.error(err.response?.data?.message || "An error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      toast.error("Google login popup failed. Please try again.");
      setLoading(false);
    },
    flow: 'auth-code',
  });

  const handleCustomButtonClick = () => {
    setLoading(true);
    login();
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

          <button onClick={() => navigate("/about")} className="login-btn-gray">
            What is ELBI Tutors?
          </button>
        </div>
      </div>
    </div>
  );
}