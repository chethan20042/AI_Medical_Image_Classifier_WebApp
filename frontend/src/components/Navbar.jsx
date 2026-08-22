import { useState } from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";


function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);


  const token =
    localStorage.getItem("token");


  const storedUser =
    localStorage.getItem("user");


  const user = storedUser
    ? JSON.parse(storedUser)
    : null;


  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);

    navigate("/login");
  };


  // ---------------------------------------------------------
  // CLOSE MOBILE MENU
  // ---------------------------------------------------------

  const closeMenu = () => {
    setMenuOpen(false);
  };


  return (
    <header className="site-header">

      <nav className="navbar">

        {/* BRAND */}

        <Link
          to="/"
          className="navbar-brand"
          onClick={closeMenu}
        >

          <div className="brand-icon">
            AI
          </div>


          <div className="brand-content">

            <strong>
              AI Medical Classifier
            </strong>

            <span>
              Academic Classification System
            </span>

          </div>

        </Link>


        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMenuOpen(
              (previous) => !previous
            )
          }
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >

          <span />
          <span />
          <span />

        </button>


        {/* NAVIGATION */}

        <div
          className={
            menuOpen
              ? "navbar-menu navbar-menu-open"
              : "navbar-menu"
          }
        >

          <div className="navbar-links">

            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active-nav-link"
                  : "nav-link"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active-nav-link"
                  : "nav-link"
              }
            >
              About
            </NavLink>


            {token && (

              <NavLink
                to="/dashboard"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active-nav-link"
                    : "nav-link"
                }
              >
                Dashboard
              </NavLink>

            )}

          </div>


          {/* LOGGED OUT */}

          {!token && (

            <div className="navbar-actions">

              <Link
                to="/login"
                className="navbar-login-button"
                onClick={closeMenu}
              >
                Login
              </Link>


              <Link
                to="/register"
                className="navbar-register-button"
                onClick={closeMenu}
              >
                Create Account
              </Link>

            </div>

          )}


          {/* LOGGED IN */}

          {token && (

            <div className="navbar-authenticated">

              {user && (

                <div className="navbar-user-info">

                  <div className="navbar-user-avatar">

                    {user.full_name
                      ?.charAt(0)
                      .toUpperCase() || "U"}

                  </div>


                  <div className="navbar-user-text">

                    <strong>
                      {user.full_name ||
                        "User"}
                    </strong>

                    <span>
                      Authenticated User
                    </span>

                  </div>

                </div>

              )}


              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>

          )}

        </div>

      </nav>

    </header>
  );
}


export default Navbar;