import {useAuth} from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export function Protected({ children }) {
  const { loading,user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (<main><div>Loading...</div></main>);
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
