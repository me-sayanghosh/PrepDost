import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../auth.form.scss";
import { forgotPassword } from "../services/auth.api.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegisterNow, setShowRegisterNow] = useState(false);
  const navigate = useNavigate();
  const normalizedEmail = String(email).trim().toLowerCase();
  const hasEmailInput = normalizedEmail.length > 0;
  const isEmailValid = EMAIL_REGEX.test(normalizedEmail);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");
    setShowRegisterNow(false);

    if (!EMAIL_REGEX.test(String(email).trim().toLowerCase())) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const data = await forgotPassword(email);
      setMessage(data.message || "Verification code sent to your registered email.");
      setTimeout(() => {
        navigate("/verify-code", {
          state: { email: String(email).trim().toLowerCase() },
          replace: true,
        });
      }, 600);
    } catch (error) {
      const apiMessage = error.response?.data?.message || "Unable to send verification code";
      const apiCode = error.response?.data?.code;
      setErrorMsg(apiMessage);
      setShowRegisterNow(apiCode === "USER_NOT_FOUND");
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
        <div className="form-container is-login">
          <h2>Forgot Password</h2>
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
          <form onSubmit={handleSendCode}>
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                placeholder="Enter your account email"
              />
              {hasEmailInput && (
                <p style={{ color: isEmailValid ? "#28a745" : "#c23a3a", fontSize: "0.85rem", marginTop: "6px" }}>
                  {isEmailValid ? "This email is valid" : "Please enter a valid email address"}
                </p>
              )}
            </div>
            <button className="button primary-button" disabled={loading}>
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>

          {showRegisterNow && (
            <p style={{ marginTop: "12px" }}>
              No account found for this email. <Link to="/register" className="link">Register now</Link>
            </p>
          )}

          <p>
            Remembered it? <Link to="/login" className="link">Back to login</Link>
          </p>
        </div>
      </main>
    </>
  );
}

export default ForgotPassword;