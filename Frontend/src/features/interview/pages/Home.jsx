import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useInterview } from "../hook/useInterview";
import "../home.scss";

function Home() {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const { handleGenerateReport, loading } = useInterview();
  const resumeInputRef = useRef(null);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [selfDeclaration, setSelfDeclaration] = useState("");
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogoutClick = async () => {
    const result = await handleLogout();
    if (result?.success) {
      sessionStorage.setItem("showLogoutSuccess", "true");
    }
    setShowUserMenu(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a valid PDF file");
      setErrorField("resume");
      setResumeFile(null);
      e.target.value = "";
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      setError("Resume file size should be less than 5MB");
      setErrorField("resume");
      setResumeFile(null);
      e.target.value = "";
      return;
    }

    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setError("");
      setErrorField("");
    } else {
      setError("Please upload a valid PDF file");
      setErrorField("resume");
      setResumeFile(null);
    }
  };

  const formatFileSize = (sizeInBytes) => {
    if (!sizeInBytes) return "0 KB";
    const kb = sizeInBytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const clearResumeSelection = () => {
    setResumeFile(null);
    setError("");
    setErrorField("");
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setError("");
    setErrorField("");

    if (!resumeFile) {
      setError("Please upload your resume (PDF)");
      setErrorField("resume");
      return;
    }
    if (!selfDeclaration.trim()) {
      setError("Please enter your self declaration");
      setErrorField("selfDeclaration");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please enter the job description");
      setErrorField("jobDescription");
      return;
    }

    try {
      const data = await handleGenerateReport({
        resume: resumeFile,
        selfDeclaration,
        jobDescription,
      });
      const generatedReport = data.interviewReport || data;
      navigate(`/interview/${generatedReport._id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to generate report";
      setError(errorMsg);
      setErrorField("form");
    }
  };

  return (
    <main className="Home">
      {/* User Profile Circle */}
      <div className="user-profile-section">
        <button
          className="history-redirect-btn"
          title="View Previous Reports"
          onClick={() => navigate('/reports')}
          style={{
            background: 'rgba(13, 31, 60, 0.05)',
            color: '#0d1f3c',
            border: '1px solid rgba(13, 31, 60, 0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            marginRight: '15px',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
        >
          My Reports
        </button>
        <div className="user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
          <span className="avatar-initials">{getInitials(user?.username)}</span>
        </div>
        {showUserMenu && (
          <div className="user-menu">
            <div className="user-info">
              <p className="username">{user?.username}</p>
              <p className="email">{user?.email}</p>
            </div>
            <button className="reports-btn" onClick={() => navigate('/reports')} style={{ background: 'transparent', color: '#0d1f3c', border: 'none', padding: '16px', textAlign: 'left', cursor: 'pointer', width: '100%', fontSize: '0.95rem', borderBottom: '1px solid #ccc5b8', fontWeight: '500' }}>
              My Reports
            </button>
            <button className="logout-btn" onClick={handleLogoutClick}>
              Logout
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="full-page-loader">
          <div className="loader-content">
            <div className="spinner"></div>
            <h2>Generating Report...</h2>
            <p>Please wait while we formulate your personalized interview strategy.</p>
          </div>
        </div>
      )}

      <div className="interview-container">
        <header className="home-hero">
          <p className="hero-kicker">AI Interview Studio</p>
          <h1>Build your interview game plan in minutes</h1>
          <p className="hero-subtitle">
            Upload your resume, add the target job description, and get tailored
            interview questions with a focused 7-day strategy.
          </p>
          <div className="hero-tags">
            <span>Personalized Questions</span>
            <span>Skill Gap Insights</span>
            <span>Prep Roadmap</span>
          </div>
        </header>

        <form onSubmit={onSubmitForm} className="interview-form">
          <div className="left panel">
            <h2>Interview Prep Assistant</h2>
            <div className="divider"></div>
            <div className="input-group">
              <label htmlFor="job-description">Job Description</label>
              <textarea
                id="job-description"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  if (errorField === "jobDescription") {
                    setError("");
                    setErrorField("");
                  }
                }}
                className="textarea"
              ></textarea>
              {error && errorField === "jobDescription" && (
                <div className="section-error" role="alert">{error}</div>
              )}
            </div>
          </div>

          <div className="right panel">
            <div className="input-group">
              <label htmlFor="resume">Upload Resume (PDF)</label>
              <div className="file-input-wrapper">
                <input
                  ref={resumeInputRef}
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <div className={`file-dropzone ${resumeFile ? "has-file" : ""}`}>
                  <label htmlFor="resume" className="file-label">
                    {resumeFile ? (
                      <>
                        <span className="file-icon is-ready" aria-hidden="true">
                          <span className="icon-core">✓</span>
                        </span>
                        <span className="file-text">Resume ready. Click to choose another file.</span>
                      </>
                    ) : (
                      <>
                        <span className="file-icon is-upload" aria-hidden="true">
                          <span className="icon-core">↑</span>
                        </span>
                        <span className="file-text">Click to upload your resume</span>
                      </>
                    )}
                  </label>

                  {resumeFile ? (
                    <div className="file-meta">
                      <div className="file-meta-info">
                        <p className="file-name">{resumeFile.name}</p>
                        <span className="file-size">{formatFileSize(resumeFile.size)}</span>
                      </div>
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={clearResumeSelection}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <p className="file-hint">PDF format only • Max size 5MB</p>
                  )}
                </div>
              </div>
              {error && errorField === "resume" && (
                <div className="section-error" role="alert">{error}</div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="self-declaration">Self Declaration</label>
              <textarea
                onChange={(e) => {
                  setSelfDeclaration(e.target.value);
                  if (errorField === "selfDeclaration") {
                    setError("");
                    setErrorField("");
                  }
                }}
                id="self-declaration"
                placeholder="Tell us about yourself, your skills, and experience..."
                value={selfDeclaration}
                className="textarea"
              ></textarea>
              {error && errorField === "selfDeclaration" && (
                <div className="section-error" role="alert">{error}</div>
              )}
            </div>

            {error && errorField === "form" && (
              <div className="section-error" role="alert">{error}</div>
            )}

            <div className="action-buttons-group" style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button
                type="submit"
                className="generate-btn"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? "Generating Report..." : "Generate Interview Report"}
              </button>

              <button
                type="button"
                className="view-reports-btn"
                onClick={() => navigate('/reports')}
                style={{
                  flex: 1,
                  background: 'transparent',
                  color: '#0d1f3c',
                  border: '2px solid rgba(13, 31, 60, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(13, 31, 60, 0.05)';
                  e.currentTarget.style.borderColor = '#0d1f3c';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(13, 31, 60, 0.2)';
                }}
              >
                View Previous Reports →
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Home;
