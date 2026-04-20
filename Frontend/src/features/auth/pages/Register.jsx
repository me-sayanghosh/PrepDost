import React, { useState } from "react";
import "../auth.form.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../components/SuccessModal.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { loading, handleRegister, user } = useAuth();
  const navigate = useNavigate();

  // Show success modal after user registers
  React.useEffect(() => {
    if (user && !loading) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, loading, navigate]);

  const shouldShowPasswordStatus =
    password.length > 0 && confirmPassword.length > 0;
  const normalizedEmail = String(email).trim().toLowerCase();
  const hasEmailInput = normalizedEmail.length > 0;
  const isEmailValid = EMAIL_REGEX.test(normalizedEmail);

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordsMatch(password === newConfirmPassword);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordsMatch(newPassword === confirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!EMAIL_REGEX.test(String(email).trim().toLowerCase())) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    setPasswordsMatch(true);
    setErrorMsg("");
    const result = await handleRegister({ username, email, password });
    if (result && !result.success) {
      setErrorMsg(result.error);
    }
  };

  if (loading) {
    return (
      <main className="loading-page">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-text">Creating account...</p>
        </div>
      </main>
    );
  }

  if (showSuccess) {
    return (
      <SuccessModal
        userName={user?.username}
        action="register"
        onClose={() => setShowSuccess(false)}
      />
    );
  }

  return (
    <>
      <button onClick={() => navigate(-1)} className="global-back-btn" aria-label="Go back" title="Go back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10.8284 12L15.7782 16.9497L14.364 18.364L7.99998 12L14.364 5.63604L15.7782 7.05025L10.8284 12Z" />
        </svg>
      </button>
      <main>
        <div className="form-container is-register">
          <h2>Register</h2>
          <div className="divider"></div>
          {errorMsg && (
            <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px 15px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem', border: '1px solid #ffcdd2' }}>
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
            onChange={(e) =>{setUsername(e.target.value)}}
              type="text"
              id="username"
              name="username"
              placeholder="Enter Your username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              onChange={(e) =>{setEmail(e.target.value)}}

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
            <label htmlFor="password">Enter Password:</label>
            <div className="password-field">
              <input
                
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={handlePasswordChange}
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
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Your Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          {shouldShowPasswordStatus && !passwordsMatch && (
            <p style={{ color: "#c23a3a", fontSize: "0.85rem" }}>
              Password and confirm password must match.
            </p>
          )}
          {shouldShowPasswordStatus && passwordsMatch && (
            <p style={{ color: "#28a745", fontSize: "0.85rem" }}>
              Password Matched properly.
            </p>
          )}
          <button className="button primary-button">Create Account</button>
        </form>
        <p>
            Already have an account?<Link to="/login" className="link">Login here</Link>
        </p>
        <div />
      </div>
    </main>
    </>
  );
}

export default Register;
