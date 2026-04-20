import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SuccessModal from "../components/SuccessModal.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const { loading, handleLogin, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showRegisterNow, setShowRegisterNow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { interviewId } = useParams();

  const redirectTarget = interviewId
    ? `/interview/${interviewId}`
    : location.state?.redirectTo || "/dashboard";
  const normalizedEmail = String(email).trim().toLowerCase();
  const hasEmailInput = normalizedEmail.length > 0;
  const isEmailValid = EMAIL_REGEX.test(normalizedEmail);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setShowRegisterNow(false);

    if (!EMAIL_REGEX.test(String(email).trim().toLowerCase())) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    const result = await handleLogin({ email, password });
    if (result && !result.success) {
      setErrorMsg(result.error);
      setShowRegisterNow(result.code === "USER_NOT_FOUND");
    }
  };

  // Show success modal after user logs in
  React.useEffect(() => {
    if (user && !loading) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        navigate(redirectTarget, { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, loading, navigate, redirectTarget]);

  if (loading) {
    return (
      <main className="loading-page">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-text">Logging in...</p>
        </div>
      </main>
    );
  }








  if (showSuccess) {
    return (
      <SuccessModal
        userName={user?.username}
        action="login"
        onClose={() => setShowSuccess(false)}
      />
    );
  }

  return (
    <>
      <button onClick={() => navigate(-1)} className="global-back-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        <span>Back</span>
      </button>
      <main>
        <div className="form-container is-login">
          <h2>Login</h2>
          <div className="divider"></div>
          {errorMsg && (
            <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px 15px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem', border: '1px solid #ffcdd2' }}>
              {errorMsg}
            </div>
          )}
          {showRegisterNow && (
            <p style={{ marginBottom: "16px" }}>
              No account found for this email. <Link to="/register" className="link">Register now</Link>
            </p>
          )}
          <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email"
            />
            {hasEmailInput && (
              <p style={{ color: isEmailValid ? "#28a745" : "#c23a3a", fontSize: "0.85rem", marginTop: "6px" }}>
                {isEmailValid ? "This email is valid" : "Please enter a valid email address"}
              </p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter Your Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                <span
                  className={`eye-icon ${
                    showPassword ? "is-visible" : "is-hidden"
                  }`}
                  aria-hidden="true"
                >
                  <span className="eye-outline"></span>
                  <span className="eye-pupil"></span>
                  <span className="eye-slash"></span>
                </span>
                <span className="toggle-label">
                  {showPassword ? "Hide" : "Show"}
                </span>
              </button>
            </div>
          </div>
          <button className="button primary-button">Login</button>
        </form>

        <p>
            <Link to="/forgot-password" className="link">Forgot password?</Link>
        </p>

        <p>
            Don't have an account?<Link to="/register" className="link">Register here</Link>
        </p>


        <div />
      </div>
    </main>
    </>
  );
}

export default Login;
