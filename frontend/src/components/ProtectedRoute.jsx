import {
  useEffect,
  useState
} from "react";

import {
  Navigate
} from "react-router-dom";

import api from "../services/api";


function ProtectedRoute({ children }) {
  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);


  useEffect(() => {
    const verifyAuthentication = async () => {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setAuthenticated(false);
        setCheckingAuth(false);

        return;
      }

      try {
        const response = await api.get(
          "/api/auth/me"
        );

        const user =
          response.data.user;

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        setAuthenticated(true);

      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAuthenticated(false);

      } finally {
        setCheckingAuth(false);
      }
    };


    verifyAuthentication();
  }, []);


  // ---------------------------------------------------------
  // CHECKING AUTHENTICATION
  // ---------------------------------------------------------

  if (checkingAuth) {
    return (
      <main className="auth-check-page">

        <div className="auth-check-card">

          <div className="auth-check-spinner" />

          <p>
            Verifying your session...
          </p>

        </div>

      </main>
    );
  }


  // ---------------------------------------------------------
  // NOT AUTHENTICATED
  // ---------------------------------------------------------

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // ---------------------------------------------------------
  // AUTHENTICATED
  // ---------------------------------------------------------

  return children;
}


export default ProtectedRoute;