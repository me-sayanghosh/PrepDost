import { Link } from "react-router-dom";
import "./not-found.scss";

function NotFound() {
  return (
    <main className="not-found-page" role="main" aria-labelledby="not-found-title">
      <div className="not-found-card">
        <p className="code">404</p>
        <h1 id="not-found-title">Page Not Found</h1>
        <p className="description">
          The page you are looking for does not exist or may have been moved.
          Continue exploring PrepDost using the links below.
        </p>

        <nav className="links" aria-label="Helpful links">
          <Link to="/" className="primary">Go to Home</Link>
          <Link to="/login" className="secondary">Log In</Link>
          <Link to="/register" className="secondary">Create Account</Link>
        </nav>
      </div>
    </main>
  );
}

export default NotFound;
