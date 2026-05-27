import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import "./landing.scss";

function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [showLogoutSuccess, setShowLogoutSuccess] = React.useState(false);
  const [showCopyToast, setShowCopyToast] = React.useState(false);
  const [titleAnimated, setTitleAnimated] = React.useState(false);
  
  // State for Interactive Sandbox
  const [activeCategory, setActiveCategory] = React.useState("React Native");
  const [showAnswerTips, setShowAnswerTips] = React.useState(false);

  // State for FAQ Accordion
  const [faqOpenIndex, setFaqOpenIndex] = React.useState(0);

  React.useEffect(() => {
    const shouldShow = sessionStorage.getItem("showLogoutSuccess") === "true";
    if (shouldShow) {
      setShowLogoutSuccess(true);
      sessionStorage.removeItem("showLogoutSuccess");

      const timer = setTimeout(() => {
        setShowLogoutSuccess(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  // trigger hero title highlight animation shortly after mount
  React.useEffect(() => {
    const t = setTimeout(() => setTitleAnimated(true), 180);
    return () => clearTimeout(t);
  }, []);

  const handleLoginClick = () => {
    navigate("/login", { state: location.state });
  };
  const handleRegisterClick = () => {
    navigate("/register", { state: location.state });
  };

  // Tagline Copy Trigger
  const handleCopyTagline = () => {
    navigator.clipboard.writeText("YOU DON'T NEED MORE CONTENT. YOU NEED A PLAN THAT ACTUALLY WORKS.");
    setShowCopyToast(true);
    
    const timer = setTimeout(() => {
      setShowCopyToast(false);
    }, 2000);
  };

  // Sandbox data definitions
  const sandboxQuestions = {
    "React Native": {
      title: "Optimize FlatList Performance",
      question: "How do you optimize a React Native FlatList that is rendering hundreds of items with complex layouts and heavy images?",
      tips: [
        "Use getItemLayout to avoid dynamic layout measurement overhead",
        "Implement keyExtractor correctly with unique stable string IDs",
        "Control initialNumToRender and maxToRenderPerBatch to throttle frame rendering",
        "Memoize renderItem components with React.memo to prevent unnecessary updates",
        "Optimize image assets using fast-image or offline caching libraries"
      ]
    },
    "System Design": {
      title: "Real-time Notification Service",
      question: "Design a real-time notification system for a social media platform that handles millions of active users and pushes instant alerts.",
      tips: [
        "Establish WebSocket connections for active browser sessions with SSE fallbacks",
        "Leverage Redis Pub/Sub or Apache Kafka to distribute push event payloads asynchronously",
        "Integrate mobile-native gateways (FCM and APNs) for background/inactive devices",
        "Apply rate limiting and message deduplication at the API gateway layer",
        "Design database storage with horizontal sharding based on target UserID keys"
      ]
    },
    "Behavioral": {
      title: "Handling Critical Technical Debt",
      question: "Describe a time when you had to convince your engineering manager or business stakeholders to invest time in refactoring critical technical debt.",
      tips: [
        "Structure the story using the STAR method (Situation, Task, Action, Result)",
        "Quantify the debt's impact (e.g. higher regression rates, slower deployment velocity)",
        "Present a modular, phased refactoring plan that permits ongoing feature ship cycles",
        "Detail the final value delivered (e.g., cloud cost savings, 40% faster dev iterations)",
        "Share a concrete lesson learned on developer communication and alignment"
      ]
    }
  };

  const currentSandbox = sandboxQuestions[activeCategory];

  const faqs = [
    {
      question: "How does PrepDost analyze my resume?",
      answer: "PrepDost uses advanced semantic parsing to extract your skills, project experience, and tech stack, matching them against the core requirements of your target job description. We highlight exact keyword matches, skill gaps, and crucial discussion points."
    },
    {
      question: "Is my resume and data kept secure?",
      answer: "Absolutely. We treat your personal and professional credentials with complete confidentiality. Your uploads are securely transmitted, encrypted at rest, and never shared with third-party advertisers or recruitment agencies."
    },
    {
      question: "Can I customize my 7-day prep strategy?",
      answer: "Yes! Once you generate your interview blueprint, you can adjust daily difficulty levels, focus on specific topics, check off tasks as you finish them, and reset dates to align with your interview schedules."
    },
    {
      question: "What types of job roles does the platform support?",
      answer: "We support engineering, design, product management, data science, QA, and tech lead roles. The AI model is highly adaptive and tailors questions precisely from junior to executive leadership tiers."
    }
  ];

  return (
    <>
      {showLogoutSuccess && (
        <div className="logout-toast" role="status" aria-live="polite">
          <span className="toast-icon" aria-hidden="true">✓</span>
          <span>You are successfully logged out.</span>
        </div>
      )}
      
      {showCopyToast && (
        <div className="copy-toast" role="status" aria-live="polite">
          <span className="toast-icon" aria-hidden="true">✓</span>
          <div className="toast-content">
            <span className="toast-title">Copied to Clipboard</span>
            <span className="toast-message">Your PrepDost tagline is ready to paste.</span>
          </div>
        </div>
      )}

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
          {/* HERO SECTION */}
          <section className="hero-section">
            <div className="hero-text-block">
              <div className="pill-badge"><span className="badge-pulse-dot" aria-hidden="true"></span>Built for Job Seekers</div>
              <h1 className={`hero-title highlight-title ${titleAnimated ? 'is-animated' : ''}`}>
                <span className="title-line line-1">
                  <span className="highlight-block">Ace Your Next</span>
                </span>
                <span className="title-line line-2">
                  <span className="highlight-block">Interview</span> <span className="no-highlight">with</span>
                </span>
                <span className="title-line line-3">
                  <span className="highlight-block">Better Preparation.</span>
                </span>
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
              {/* VINTAGE WORKSPACE DESK CANVAS */}
              <div className="newspaper-desk">
                
                {/* Background Overlapping Torn Scraps */}
                <div className="newspaper-scrap scrap-top" aria-hidden="true">
                  <div className="scrap-header">The Chronicle</div>
                  <div className="scrap-body">
                    <h5>TALENT DEMAND OUTSTRIPS SUPPLY</h5>
                    <p>Technical leads report severe bottlenecks in backend scaling. Performance optimization experts are sought after.</p>
                  </div>
                </div>
                
                <div className="newspaper-scrap scrap-bottom" aria-hidden="true">
                  <div className="scrap-header">Daily Telegraph</div>
                  <div className="scrap-body">
                    <h5>REFACTORS DELIVER 40% SPEEDUP</h5>
                    <p>State-sharding memory queues successfully implemented. Uptime is reportedly exceeding initial engineering estimates.</p>
                  </div>
                </div>

                {/* CONTAINER TO PERMIT ROTATION, SCALE AND 3D DROP SHADOW OF COMBINED JAGGED BODY + OVERLAYS */}
                <div className="newspaper-wrapper">
                  {/* MAIN ROTATED NEWSPAPER CLIPPING */}
                  <div className="newspaper-body">
                    {/* Decorative Elements */}
                    <div className="coffee-stain" aria-hidden="true"></div>
                  <div className="newspaper-torn-edge" aria-hidden="true"></div>
                  <div className="ink-stamp stamp-hired" aria-hidden="true">HIRED</div>

                  {/* NEWSPAPER RESUME HEADER */}
                  <div className="newspaper-header">
                    <div className="newspaper-kicker">EXTRAORDINARY DISPATCH — SPECIAL EDITION</div>
                    <h3 className="newspaper-title">The PrepDost Gazette</h3>
                    <div className="newspaper-meta">
                      <span>ESTD. 2026</span>
                      <span>•</span>
                      <span>SAN FRANCISCO, CALIFORNIA</span>
                      <span>•</span>
                      <span>PRICE FIVE CENTS</span>
                    </div>
                  </div>

                  {/* NEWSPAPER COLUMNS */}
                  <div className="newspaper-columns">
                    {/* LEFT COLUMN - THE HEADLINE STORY (RESUME PROFILE) */}
                    <div className="column col-left">
                      <div className="news-article">
                        <h4>Engineer Lands FAANG Offer in Record Time!</h4>
                        <div className="article-byline">By Our Technology Correspondent</div>
                        <p>
                          <span className="drop-cap">T</span>hrough meticulous resume alignment and rigorous platform prep, a local developer has successfully bypassed generic study plans to secure a senior engineering role at a major platform.
                        </p>
                        <p>
                          By cross-referencing past project experience with core recruiter requirements, the candidate resolved critical technical gaps. Platform metrics indicate an impressive <mark className="news-highlight">40% latency reduction</mark> achieved via optimized state-sharding queues.
                        </p>
                      </div>
                      
                      {/* Black & White Woodcut Sketch Overlay */}
                      <div className="news-sketch-container">
                        <svg className="woodcut-svg" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Ink drawing of an engineer working on a retro terminal">
                          {/* Halftone grid lines mimicking engraving */}
                          <line x1="0" y1="5" x2="100" y2="5" stroke="#111111" strokeWidth="0.5" />
                          <line x1="0" y1="10" x2="100" y2="10" stroke="#111111" strokeWidth="0.5" />
                          <line x1="0" y1="15" x2="100" y2="15" stroke="#111111" strokeWidth="0.5" />
                          <line x1="0" y1="20" x2="100" y2="20" stroke="#111111" strokeWidth="0.5" />
                          <line x1="0" y1="25" x2="100" y2="25" stroke="#111111" strokeWidth="0.5" />
                          <line x1="0" y1="30" x2="100" y2="30" stroke="#111111" strokeWidth="0.5" />
                          <line x1="0" y1="35" x2="100" y2="35" stroke="#111111" strokeWidth="0.5" />
                          <line x1="0" y1="40" x2="100" y2="40" stroke="#111111" strokeWidth="0.5" />
                          <line x1="0" y1="45" x2="100" y2="45" stroke="#111111" strokeWidth="0.5" />
                          <line x1="0" y1="50" x2="100" y2="50" stroke="#111111" strokeWidth="0.5" />
                          <line x1="0" y1="55" x2="100" y2="55" stroke="#111111" strokeWidth="0.5" />
                          
                          {/* Stylized Computer/Desk Silhouette using Engraving Shading */}
                          <path d="M15,48 L85,48 L80,20 L20,20 Z" fill="#fbf9f4" stroke="#111111" strokeWidth="1.5" />
                          <path d="M25,25 L75,25 L72,43 L28,43 Z" fill="none" stroke="#111111" strokeWidth="1" />
                          
                          {/* Code Lines on Screen */}
                          <line x1="32" y1="30" x2="60" y2="30" stroke="#111111" strokeWidth="1.5" />
                          <line x1="32" y1="34" x2="52" y2="34" stroke="#111111" strokeWidth="1.5" />
                          <line x1="32" y1="38" x2="68" y2="38" stroke="#111111" strokeWidth="1.5" />
                          
                          {/* Keyboard Base */}
                          <rect x="25" y="50" width="50" height="4" rx="1" fill="#111111" />
                        </svg>
                        <span className="sketch-caption">FIG 1. HIGH-PERFORMANCE WORKSTATION</span>
                      </div>
                    </div>

                    {/* RIGHT COLUMN - EXPERIENCE BULLETS & CLASSIFIED ADS */}
                    <div className="column col-right">
                      <div className="news-article">
                        <h4>Dispatches & Key Expertise</h4>
                        <p>
                          The candidate's core dossier highlights remarkable versatility across <mark className="news-highlight">React Native, system design</mark>, and large-scale state orchestration. Reports claim a 99.99% operational uptime maintained under peak traffic conditions.
                        </p>
                      </div>

                      {/* Vintage Classified Ads Section */}
                      <div className="classified-section">
                        <div className="classified-title">Classified Notices</div>
                        
                        <div className="classified-item">
                          <strong>WANTED:</strong> Tech Leads who appreciate clean architectures, robust telemetry, and optimized thread layouts. FAANG firms hiring immediately.
                        </div>
                        
                        <div className="classified-item">
                          <strong>SITUATIONS WANTED:</strong> Expert Developer with a history of resolving critical code debt & boosting team velocity by 40%. Full credentials available on request.
                        </div>
                        
                        <div className="classified-item">
                          <strong>BLUEPRINTS READY:</strong> Tailored 7-day interview blueprints designed to tackle high-stress mock loops. Success guaranteed.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rolled Page Corners (Placed outside body as siblings so their shadows/borders aren't clipped!) */}
                <div className="rolled-corner-tr" aria-hidden="true"></div>
                <div className="rolled-corner-bl" aria-hidden="true"></div>
              </div>
            </div>

            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
          </div>
        </section>

          {/* DYNAMIC SELECTION TAGLINE SECTION */}
          <section className="tagline-section">
            <div className="selection-container">
              {/* Tooltip Overlay Menu */}
              <div className="ios-tooltip" onClick={handleCopyTagline} title="Click to copy tagline">
                <span className="tooltip-action">Copy</span>
                <span className="tooltip-divider"></span>
                <span className="tooltip-action">Select All</span>
                <span className="tooltip-divider"></span>
                <span className="tooltip-action">Share</span>
                <span className="tooltip-arrow"></span>
              </div>
              
              <h2 className="tagline-text">
                <span className="line first-line">YOU </span>
                <span className="line highlight-line">
                  <span className="pin-handle pin-start"></span>
                  DON'T NEED MORE CONTENT.
                  <span className="pin-handle pin-end"></span>
                </span>
                <span className="line third-line">
                  YOU NEED{" "}
                  <span className="decorated-word text-plan">
                    A PLAN
                    <svg className="svg-scribble svg-underline" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <path d="M2,15 Q50,5 98,15" stroke="#ff4757" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>{" "}
                  THAT ACTUALLY
                </span>
                <span className="line fourth-line">
                  <span className="decorated-word text-works">
                    WORKS.
                    <svg className="svg-scribble svg-circle" viewBox="0 0 120 45" preserveAspectRatio="none">
                      <path d="M10,22 C10,5 110,3 110,22 C110,40 10,42 8,24 C6,6 102,8 108,18" stroke="#ff4757" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </h2>
            </div>
          </section>

          {/* HOW IT WORKS SECTION */}
          <section className="how-it-works-section">
            <div className="section-header">
              <span className="section-pill">Workflow</span>
              <h2 className="section-title">How PrepDost Works</h2>
              <p className="section-subtitle">Get fully prepared in 3 steps. No generic study guides, just focused practice.</p>
            </div>
            
            <div className="steps-container">
              <div className="step-card">
                <div className="step-num">01</div>
                <div className="step-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                </div>
                <h3>Share Profile</h3>
                <p>Upload your resume. We automatically parse your projects, technical skills, and experience details.</p>
                <span className="step-arrow" aria-hidden="true">
                  <svg width="20" height="14" viewBox="0 0 20 14" fill="none"><path d="M1 7h18M13 1l6 6-6 6" stroke="#0d1f3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>

              <div className="step-card">
                <div className="step-num">02</div>
                <div className="step-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <h3>Set Job Goal</h3>
                <p>Paste the Job Description for your target role. We evaluate exactly what recruiters are looking for.</p>
                <span className="step-arrow" aria-hidden="true">
                  <svg width="20" height="14" viewBox="0 0 20 14" fill="none"><path d="M1 7h18M13 1l6 6-6 6" stroke="#0d1f3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>

              <div className="step-card">
                <div className="step-num">03</div>
                <div className="step-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <h3>Get Action Plan</h3>
                <p>Instantly secure your personalized 7-day preparation roadmap and hyper-tailored practice questions.</p>
              </div>
            </div>
          </section>

          {/* INTERACTIVE SANDBOX SECTION */}
          <section className="sandbox-section">
            <div className="sandbox-grid">
              <div className="sandbox-text">
                <span className="section-pill">Interactive Demo</span>
                <h2 className="section-title">Try a Live Question Preview</h2>
                <p className="section-subtitle">
                  We generate hyper-tailored prep questions that match exactly what your interviewers will ask. Switch categories to preview real outputs.
                </p>
                <div className="category-tabs">
                  {Object.keys(sandboxQuestions).map((cat) => (
                    <button
                      key={cat}
                      className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
                      onClick={() => {
                        setActiveCategory(cat);
                        setShowAnswerTips(false);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sandbox-visual">
                <div className="dashboard-card">
                  <div className="card-topbar">
                    <span className="mock-badge green-badge">AI Response generated</span>
                    <span className="mock-badge outline-badge">{activeCategory}</span>
                  </div>
                  <div className="card-content">
                    <span className="q-label">Sample Interview Prompt</span>
                    <h3 className="q-title">{currentSandbox.title}</h3>
                    <p className="q-desc">{currentSandbox.question}</p>
                    
                    <div className="tips-container">
                      <button 
                        className={`tips-trigger-btn ${showAnswerTips ? "active" : ""}`}
                        onClick={() => setShowAnswerTips(!showAnswerTips)}
                      >
                        {showAnswerTips ? "Hide Answering Tips" : "Reveal AI Answering Tips"}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </button>

                      {showAnswerTips && (
                        <ul className="tips-list">
                          {currentSandbox.tips.map((tip, idx) => (
                            <li key={idx} className="tip-item">
                              <span className="bullet">{idx + 1}</span>
                              <span className="tip-text">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DETAILED FEATURES SECTION */}
          <section className="features-section">
            <div className="section-header">
              <span className="section-pill">Features</span>
              <h2 className="section-title">Prep Smarter, Move Faster</h2>
              <p className="section-subtitle">Unlock robust capabilities designed to build interview-ready confidence in minimal time.</p>
            </div>

            <div className="features-grid">
              {/* Hero card – left column, spans 2 rows */}
              <div className="feature-card">
                <div className="feature-icon bg-light-blue">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                </div>
                <h3>Deep Match Engine</h3>
                <p>Identifies crucial conceptual misalignments by cross-referencing your resume lines directly with core JD requirements — so nothing falls through the cracks.</p>
                <span className="feature-tag">✦ AI-Powered Matching</span>
              </div>

              {/* Compact card 2 */}
              <div className="feature-card">
                <div className="feature-icon bg-light-purple">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div className="feature-text">
                  <h3>Custom Behavioral Prompts</h3>
                  <p>Highly contextual behavioral questions based on your parsed projects, guiding you to highlight real impact.</p>
                </div>
              </div>

              {/* Compact card 3 */}
              <div className="feature-card">
                <div className="feature-icon bg-light-red">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <div className="feature-text">
                  <h3>Structured 7-Day Strategy</h3>
                  <p>A bite-sized preparation calendar that maps out daily study steps so you avoid last-minute panic.</p>
                </div>
              </div>

              {/* Full-width card 4 */}
              <div className="feature-card">
                <div className="feature-icon bg-light-green">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <div className="feature-text">
                  <h3>AI Keyword Targets</h3>
                  <p>Suggests critical terminology and technical benchmarks to mention so your answers satisfy both ATS scanning systems and human technical leads.</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ SECTION */}
          <section className="faq-section">
            <div className="section-header">
              <span className="section-pill">FAQ</span>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">Everything you need to know about preparing for your next role with PrepDost.</p>
            </div>

            <div className="accordion-container">
              {faqs.map((faq, index) => {
                const isOpen = faqOpenIndex === index;
                return (
                  <div key={index} className={`accordion-item ${isOpen ? "open" : ""}`}>
                    <button
                      className="accordion-header"
                      onClick={() => setFaqOpenIndex(isOpen ? -1 : index)}
                    >
                      <span>{faq.question}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <div className="accordion-body">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        {/* PREMIUM FOOTER */}
        <footer className="landing-footer">
          <div className="footer-inner">
            <div className="footer-content">
              <div className="footer-info">
                <div className="logo-container">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
                    <path d="M10 21V15c-3 0-6-2-6-5a7 7 0 0 1 14 0v2h-1.5v3H14v6Z" />
                    <path d="M11 16V6" />
                    <path d="M8 9l3-3 3 3" />
                  </svg>
                  <span className="logo-text">PrepDost</span>
                </div>
                <p className="footer-desc">
                  Hyper-tailored interview blueprints generated in seconds to help job seekers land roles at global technology platforms.
                </p>
                <div className="footer-socials">
                  <a href="https://github.com/me-sayanghosh" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub profile">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 1.5A10.5 10.5 0 0 0 8.678 21.96c.526.097.72-.229.72-.507v-1.97c-2.93.636-3.548-1.244-3.548-1.244-.48-1.218-1.172-1.542-1.172-1.542-.96-.656.073-.642.073-.642 1.061.075 1.619 1.09 1.619 1.09.944 1.617 2.477 1.15 3.08.88.095-.684.37-1.15.673-1.414-2.339-.266-4.798-1.17-4.798-5.21 0-1.15.41-2.09 1.084-2.828-.11-.266-.47-1.336.102-2.784 0 0 .884-.283 2.897 1.08a10.06 10.06 0 0 1 5.274 0c2.012-1.363 2.895-1.08 2.895-1.08.574 1.448.213 2.518.104 2.784.675.738 1.083 1.678 1.083 2.828 0 4.05-2.464 4.94-4.81 5.2.38.327.72.972.72 1.96v2.905c0 .281.19.61.726.507A10.5 10.5 0 0 0 12 1.5Z" />
                    </svg>
                  </a>
                  <a href="https://x.com/SayanDev01" target="_blank" rel="noopener noreferrer" title="X" aria-label="X profile">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.901 2H22l-6.768 7.735L23.194 22h-6.233l-4.882-7.07L5.894 22H2.792l7.24-8.277L.5 2h6.39l4.414 6.39L18.9 2Zm-1.092 18.027h1.724L5.958 3.868H4.108l13.7 16.159Z" />
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/in/sayan-ghosh-b7aaa5293/" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn profile">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.09V21h-4v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95V21h-4V9Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} PrepDost. All rights reserved.</p>
              {false && <div className="footer-bottom-links">
                <a href="#privacy">Privacy</a>
                <span>·</span>
                <a href="#terms">Terms</a>
                <span>·</span>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                <span>·</span>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                <span>·</span>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Landing;
