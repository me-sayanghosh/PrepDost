import React from "react";
import "../modals/success-modal.scss";

function SuccessModal({ userName, action = "login", onClose }) {
  const getGreeting = () => {
    if (action === "login") {
      return `Welcome back, ${userName || "there"}!`;
    }
    if (action === "register") {
      return `Welcome, ${userName || "there"}!`;
    }
    if (action === "logout") {
      return "Logged out successfully";
    }
    return "Success";
  };

  const getMessage = () => {
    if (action === "login") {
      return "You are successfully logged in. Your interview dashboard is ready.";
    }
    if (action === "register") {
      return "Your account has been created successfully. Let's start preparing.";
    }
    if (action === "logout") {
      return "You are successfully logged out.";
    }
    return "Action completed successfully.";
  };

  const getButtonLabel = () => {
    if (action === "login") {
      return "Continue to Dashboard";
    }
    if (action === "register") {
      return "Go to Dashboard";
    }
    if (action === "logout") {
      return "Go to Home";
    }
    return "Continue";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content is-${action}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">✓</div>
        <h2>{getGreeting()}</h2>
        <p>{getMessage()}</p>
        <button className="modal-button" onClick={onClose}>
          {getButtonLabel()}
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
