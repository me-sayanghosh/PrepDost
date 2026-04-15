import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import "./landing.scss";

function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  const handleLoginClick = () => {
    // try to get redirectTo if present
    navigate("/login", { state: location.state });
  };
  const handleRegisterClick = () => {
    navigate("/register", { state: location.state });
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="logo-container">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
            <path d="M10 21V15c-3 0-6-2-6-5a7 7 0 0 1 14 0v2h-1.5v3H14v6Z" />
            <path d="M11 16V6" />
            <path d="M8 9l3-3 3 3" />
          </svg>
          <span className="logo-text">PrepDost</span>
        </div>
        <nav className="landing-nav">
          {user ? (
            <button className="btn-primary" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
          ) : (
            <>
              <button className="btn-secondary" onClick={handleLoginClick}> 
                Log In
              </button>
              <button className="btn-primary" onClick={handleRegisterClick}> 
                Get Started
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-text-block">
            <div className="pill-badge">Built for Job Seekers</div>
            <h1 className="hero-title">
              Ace Your Next Interview with <span>Better</span> Preparation
            </h1>
            <p className="hero-description">
              Upload your resume and the target job description. We'll generate personalized technical questions, behavioral challenges, and a focused 7-day preparation strategy tailored specifically to you.
            </p>
          </div>
            
          <div className="feature-metrics">
            <div className="metric">
              <h3>Smart Matching</h3>
              <p>Aligns resume to JD seamlessly</p>
            </div>
            <div className="metric">
              <h3>Custom Questions</h3>
              <p>Tailored technical & behavioral</p>
            </div>
            <div className="metric">
              <h3>7-Day Strategy</h3>
              <p>Actionable structured practice</p>
            </div>
          </div>

          <div className="hero-cta-container">
            {user ? (
              <button className="cta-button" onClick={() => navigate("/dashboard")}>
                Enter Studio
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            ) : (
              <button className="cta-button" onClick={handleRegisterClick}>   
                Start Preparing Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            )}
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="card-header">
                <div className="dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="mock-url">studio.ai/generate</div>
              </div>
              <div className="card-body">
                <div className="mock-skeleton header-skeleton"></div>
                <div className="mock-skeleton h1-skeleton"></div>
                <div className="mock-skeleton p-skeleton"></div>
                
                <div className="mock-panels">
                  <div className="mock-panel p-left">
                    <div className="skeleton-line full"></div>
                    <div className="skeleton-line half"></div>
                    <div className="skeleton-box"></div>
                    <div className="skeleton-btn"></div>
                  </div>
                  <div className="mock-panel p-right">
                    <div className="skeleton-line full"></div>
                    <div className="skeleton-line third"></div>
                    <div className="skeleton-box large"></div>
                    <div className="skeleton-btn full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative background blobs */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Landing;