import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../auth.form.scss";
import { forgotPassword, resetPassword, verifyResetCode } from "../services/auth.api.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
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
      setCodeSent(true);
      setCodeVerified(false);
      setCode("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const apiMessage = error.response?.data?.message || "Unable to send verification code";
      const apiCode = error.response?.data?.code;
      setErrorMsg(apiMessage);
      setShowRegisterNow(apiCode === "USER_NOT_FOUND");
      setCodeSent(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    if (!EMAIL_REGEX.test(String(email).trim().toLowerCase())) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    if (!String(code).trim()) {
      setErrorMsg("Please enter verification code");
      return;
    }

    setLoading(true);

    try {
      const data = await verifyResetCode({ email, code });
      setCodeVerified(true);
      setMessage(data.message || "Code verified successfully. You can now reset your password.");
    } catch (error) {
      setCodeVerified(false);
      setErrorMsg(error.response?.data?.message || "Unable to verify code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    if (!EMAIL_REGEX.test(String(email).trim().toLowerCase())) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Password and confirm password must match.");
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword({ email, code, password });
      setMessage(data.message || "Password reset successfully.");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

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

          {codeSent && (
            <form onSubmit={handleVerifyCode} style={{ marginTop: '18px' }}>
              <div className="input-group">
                <label htmlFor="code">Verification Code:</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  type="text"
                  id="code"
                  name="code"
                  placeholder="Enter 6-digit code"
                />
              </div>
              <button className="button primary-button" disabled={loading}>
                {loading ? "Verifying..." : "Verify Now"}
              </button>
            </form>
          )}

          {codeVerified && (
            <form onSubmit={handleResetPassword} style={{ marginTop: '18px' }}>
              <div className="input-group">
                <label htmlFor="password">New Password:</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter new password"
                />
              </div>
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                />
              </div>
              <button className="button primary-button" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
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