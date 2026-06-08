import React, { useEffect, useRef } from "react";

function GoogleLoginButton({ onSuccess, onError }) {
  const btnRef = useRef(null);

  useEffect(() => {
    let intervalId;
    
    const initializeGoogleSignIn = () => {
      if (!window.google) return;

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error("VITE_GOOGLE_CLIENT_ID is not configured in Frontend environment variables.");
        if (onError) onError("Google Sign-In is not configured on the client.");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) {
            onSuccess(response.credential);
          } else {
            if (onError) onError("Failed to authenticate with Google.");
          }
        },
      });

      window.google.accounts.id.renderButton(btnRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
        shape: "rectangular",
      });
    };

    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Poll until the google script is loaded
      intervalId = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(intervalId);
        }
      }, 300);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [onSuccess, onError]);

  return <div ref={btnRef} className="google-login-btn-container" />;
}

export default GoogleLoginButton;
