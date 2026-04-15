import React from "react";
import "../modals/success-modal.scss";

function SuccessModal({ userName, action = "login", onClose }) {
  const getGreeting = () => {
    if (action === "login") {
      return `Welcome back, ${userName || "there"}!`;
    }
    return `Welcome, ${userName || "there"}!`;
  };

  const getMessage = () => {
    if (action === "login") {
      return "You have successfully logged in. Get ready to ace your interview!";
    }
    return "Your account is ready! Let's prepare you for your interview.";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">✓</div>
        <h2>{getGreeting()}</h2>
        <p>{getMessage()}</p>
        <button className="modal-button" onClick={onClose}>
          Start Preparing
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
