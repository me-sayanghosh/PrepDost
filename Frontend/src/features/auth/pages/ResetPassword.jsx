import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../auth.form.scss";
import { resetPassword } from "../services/auth.api.js";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const code = location.state?.code || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword({ email, code, password });
      setMessage(data.message || "Password updated successfully.");
      setTimeout(() => navigate("/login", { replace: true }), 1800);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => navigate(-1)} className="global-back-btn" aria-label="Go back" title="Go back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10.8284 12L15.7782 16.9497L14.364 18.364L7.99998 12L14.364 5.63604L15.7782 7.05025L10.8284 12Z" />
        </svg>
      </button>
      <main>
        <div className="form-container is-register">
          <h2>Reset Password</h2>
          <div className="divider"></div>
          {errorMsg && (
            <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px 15px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem', border: '1px solid #ffcdd2' }}>
              {errorMsg}
            </div>
          )}
          {message && (
            <div style={{ backgroundColor: '#eef7ee', color: '#1f6b2c', padding: '10px 15px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem', border: '1px solid #cfe8d1' }}>
              {message}
            </div>
          )}
          {!email || !code ? (
            <div style={{ backgroundColor: '#fff8e1', color: '#7a5a00', padding: '10px 15px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem', border: '1px solid #ffe08a' }}>
              Verification step is required before resetting password.
            </div>
          ) : null}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="password">New Password:</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p style={{ color: '#c23a3a', fontSize: '0.85rem' }}>Password and confirm password must match.</p>
            )}
            <button className="button primary-button" disabled={loading || !email || !code}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>

          <p>
            <Link to="/verify-code" className="link">Back to verify code</Link>
          </p>
          <p>
            <Link to="/login" className="link">Back to login</Link>
          </p>
        </div>
      </main>
    </>
  );
}

export default ResetPassword;