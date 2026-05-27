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
          <span>Tagline copied to clipboard!</span>
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
              <div className="pill-badge">Built for Job Seekers</div>
              <h1 className="hero-title highlight-title">
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
              </div>

              <div className="step-card">
                <div className="step-num">02</div>
                <div className="step-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <h3>Set Job Goal</h3>
                <p>Paste the Job Description for your target role. We evaluate exactly what recruiters are looking for.</p>
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
                <h2 className="section-title">Test Drive the Experience</h2>
                <p className="section-subtitle">
                  We generate custom-tailored prep questions that prepare you for exactly what your interviewers will ask. Tap different categories below to preview generated material.
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
                    <span className="q-label">SAMPLE INTERVIEW PROMPT</span>
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
                              <span className="bullet">✦</span>
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
              <div className="feature-card">
                <div className="feature-icon bg-light-blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                </div>
                <h3>Deep Match Engine</h3>
                <p>Identifies crucial conceptual misalignments by cross-referencing your resume lines directly with core JD requirements.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon bg-light-purple">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h3>Custom Behavioral Prompts</h3>
                <p>Presents highly contextual behavioral prompts based on your parsed projects, guiding you to highlight real impact.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon bg-light-red">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <h3>Structured 7-Day Strategy</h3>
                <p>Builds a bite-sized dashboard agenda calendar that maps out preparation steps so you avoid last-minute stress.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon bg-light-green">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <h3>AI Keyword Targets</h3>
                <p>Suggests critical terminology and technical benchmarks to mention so your answers satisfy scanning systems and technical leads.</p>
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
          <div className="footer-content">
            <div className="footer-info">
              <div className="logo-container">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
                  <path d="M10 21V15c-3 0-6-2-6-5a7 7 0 0 1 14 0v2h-1.5v3H14v6Z" />
                  <path d="M11 16V6" />
                  <path d="M8 9l3-3 3 3" />
                </svg>
                <span className="logo-text">PrepDost</span>
              </div>
              <p className="footer-desc">
                Hyper-tailored interview blueprints generated in seconds to help job seekers land roles at global technology platforms.
              </p>
            </div>

            <div className="footer-links-grid">
              <div className="links-col">
                <h4>Product</h4>
                <a href="#how">How it Works</a>
                <a href="#sandbox">Demo Sandbox</a>
                <a href="#features">Features</a>
              </div>
              <div className="links-col">
                <h4>Resources</h4>
                <a href="#faq">FAQ</a>
                <a href="#guides">Prep Guides</a>
                <a href="#api">API Access</a>
              </div>
              <div className="links-col">
                <h4>Company</h4>
                <a href="#about">About Us</a>
                <a href="#careers">Careers</a>
                <a href="#privacy">Privacy Policy</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} PrepDost. All rights reserved.</p>
            <div className="socials">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Landing;