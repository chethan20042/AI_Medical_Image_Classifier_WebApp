import { Link } from "react-router-dom";


function NotFound() {
  return (
    <main className="not-found-page">

      <section className="not-found-card">

        <span className="not-found-code">
          404
        </span>

        <h1>
          Page Not Found
        </h1>

        <p>
          The page you are looking for does not exist
          or may have been moved.
        </p>


        <div className="not-found-actions">

          <Link
            to="/"
            className="hero-primary-button"
          >
            Go to Home
          </Link>

          <Link
            to="/dashboard"
            className="hero-secondary-button"
          >
            Dashboard
          </Link>

        </div>

      </section>

    </main>
  );
}


export default NotFound;