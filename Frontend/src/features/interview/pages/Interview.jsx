import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInterview } from "../hook/useInterview";
import "../../styles/interview.scss";

function Interview() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { interviewReport, handleGetReportById, loading } = useInterview();
  const [activePanel, setActivePanel] = useState("technical");

  useEffect(() => {
    if (interviewId) {
      handleGetReportById(interviewId);
    }
  }, [interviewId]);

  const report = interviewReport?.interviewReport || interviewReport;

  const activeItems = useMemo(() => {
    if (!report) return [];
    if (activePanel === "technical") {
      return report.technicalQuestions || [];
    }
    if (activePanel === "behavioral") {
      return report.behavioralQuestions || [];
    }
    return report.preparationStrategy || [];
  }, [activePanel, report]);

  if (loading) {
    return (
      <div className="full-page-loader">
        <div className="loader-content">
          <div className="spinner"></div>
          <h2>Loading Report...</h2>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="error-container">
        <h2>Report not found</h2>
        <button onClick={() => navigate("/")} className="back-btn">Go to Home</button>
      </div>
    );
  }

  return (
    <>
      <button onClick={() => navigate(-1)} className="global-back-btn" aria-label="Go back" title="Go back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10.8284 12L15.7782 16.9497L14.364 18.364L7.99998 12L14.364 5.63604L15.7782 7.05025L10.8284 12Z" />
        </svg>
      </button>
    <main className="InterviewPage">
      <section className="interview-layout">
        <aside className="left-nav panel">
          <h3>Interview Report</h3>
          <button
            type="button"
            className={activePanel === "technical" ? "is-active" : ""}
            onClick={() => setActivePanel("technical")}
          >
            Technical questions
          </button>
          <button
            type="button"
            className={activePanel === "behavioral" ? "is-active" : ""}
            onClick={() => setActivePanel("behavioral")}
          >
            Behavioral questions
          </button>
          <button
            type="button"
            className={activePanel === "roadmap" ? "is-active" : ""}
            onClick={() => setActivePanel("roadmap")}
          >
            Road Map
          </button>
        </aside>

        <section className="center-content panel">
          <header>
            <p className="meta">Match Score</p>
            <h2>{report.matchScore}%</h2>
          </header>
          <p className="meta">Interview ID: {interviewId}</p>

          <div className="content-items">
            {activeItems.length === 0 ? (
              <p className="empty-text">No data available for this section.</p>
            ) : activePanel === "roadmap" ? (
              activeItems.map((item, idx) => (
                <article key={idx} className="content-card">
                  <p className="tag">Day {item.day || idx + 1}</p>
                  <h4>{item.focus}</h4>
                  <p>{item.task}</p>
                </article>
              ))
            ) : (
              activeItems.map((item, idx) => (
                <article key={idx} className="content-card">
                  <p className="tag">Q{idx + 1}</p>
                  <h4>{item.question}</h4>
                  <p><strong>Intension:</strong> {item.intension}</p>
                  <p><strong>Answer:</strong> {item.answer}</p>
                </article>
              ))
            )}
          </div>
        </section>

        <aside className="skills-panel panel">
          <h3>Skill Gaps</h3>
          <div className="skill-tags">
            {(report.skillAssessments || []).map((skill, idx) => (
              <span
                key={idx}
                className={`skill-tag severity-${String(skill.severity || "medium").toLowerCase()}`}
              >
                {skill.skill}
              </span>
            ))}
          </div>
        </aside>
      </section>
    </main>
    </>
  );
}

export default Interview;