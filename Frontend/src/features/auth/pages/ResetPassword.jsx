import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../auth.form.scss";
import { resetPassword } from "../services/auth.api.js";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      const data = await resetPassword(token, password);
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
      <button onClick={() => navigate(-1)} className="global-back-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        <span>Back</span>
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
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="password">New Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p style={{ color: '#c23a3a', fontSize: '0.85rem' }}>Password and confirm password must match.</p>
            )}
            <button className="button primary-button" disabled={loading || !token}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>

          <p>
            <Link to="/login" className="link">Back to login</Link>
          </p>
        </div>
      </main>
    </>
  );
}

export default ResetPassword;