import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllInterviewReports } from "../services/interview.api";
import "../home.scss";

function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredReports(reports);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredReports(
        reports.filter((report) => 
          (report.title || "Interview Strategy").toLowerCase().includes(lowerQuery)
        )
      );
    }
  }, [searchQuery, reports]);

  const fetchReports = async () => {
    try {
      const data = await getAllInterviewReports();
      setReports(data.interviewReports || []);
      setFilteredReports(data.interviewReports || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reports");       
      setLoading(false);
    }
  };

  const getScoreColorClass = (score) => {
    if (score === undefined) return 'score-default';
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <main className="Home Reports">
      <button className="global-back-btn" onClick={() => navigate(-1)} aria-label="Go back" title="Go back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10.8284 12L15.7782 16.9497L14.364 18.364L7.99998 12L14.364 5.63604L15.7782 7.05025L10.8284 12Z" />
        </svg>
      </button>
      <div className="interview-container">
        <header className="home-hero">
          <p className="hero-kicker">My History</p>
          <h1>Previous Interview Reports</h1>
          <p className="hero-subtitle">
            Review your previously generated interview strategies, and track your practice sessions over time.
          </p>
        </header>

        {loading ? (
          <div className="full-page-loader">
            <div className="loader-content">
              <div className="spinner"></div>
              <h2>Loading Reports...</h2>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : reports.length === 0 ? (
          <div className="panel empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginBottom: '20px' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <p>No interview reports generated yet.</p>
            <button className="generate-btn" onClick={() => navigate("/dashboard")} style={{ width: 'auto', padding: '12px 24px', marginTop: '1rem' }}>
              Create Your First Report
            </button>
          </div>
        ) : (
          <>
            <div className="reports-controls input-group">
              <div className="search-wrapper" style={{ position: 'relative', maxWidth: '400px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  className="input-field search-input" 
                  placeholder="Search by job title or role..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>

            {filteredReports.length === 0 ? (
              <div className="panel empty-state">
                <p>No reports match your search query.</p>
                <button className="view-btn" onClick={() => setSearchQuery("")} style={{ marginTop: '1rem' }}>Clear Search</button>
              </div>
            ) : (
              <div className="reports-grid">
                {filteredReports.map((report, index) => (
                  <div
                    key={report._id}
                    className="report-card panel"
                    style={{ "--card-index": index }}
                    onClick={() => navigate(`/interview/${report._id}`)}
                  >
                    <div className="report-header">
                      <div className="report-title-wrap">
                        <span className="report-icon" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12h6" />
                            <path d="M9 16h6" />
                            <path d="M9 8h6" />
                            <rect x="4" y="3" width="16" height="18" rx="2" ry="2" />
                          </svg>
                        </span>
                        <h3 className="report-title">{report.title || "Interview Strategy"}</h3>
                      </div>
                      {report.matchScore !== undefined && (
                        <span className={`match-score ${getScoreColorClass(report.matchScore)}`}>
                          {report.matchScore}% Match
                        </span>
                      )}
                    </div>
                    <div className="report-meta">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span className="date">{formatDate(report.createdAt)}</span>
                    </div>
                    <div className="report-footer">
                      <button className="view-btn">
                        View Details 
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default Reports;