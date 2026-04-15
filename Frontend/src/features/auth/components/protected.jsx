import {useAuth} from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export function Protected({ children }) {
  const { loading,user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="global-loader-container">
        <div className="global-spinner"></div>
        <p className="global-loader-text">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={"/"}
        state={{ redirectTo: `${location.pathname}${location.search}` }}
        replace
      />
    );
  }

  return children;
}
