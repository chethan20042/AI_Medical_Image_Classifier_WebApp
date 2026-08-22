import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";


function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  // ---------------------------------------------------------
  // HANDLE INPUT CHANGE
  // ---------------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setMessage("");
  };


  // ---------------------------------------------------------
  // VALIDATE FORM
  // ---------------------------------------------------------

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/api/auth/login",
        formData
      );

      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setMessage(
        "Login successful. Redirecting..."
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (error) {
      const backendMessage =
        error.response?.data?.message;

      setMessage(
        backendMessage ||
          "Login failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="auth-page">
      <section className="auth-card">

        <div className="auth-heading">

          <span className="auth-badge">
            AI Medical Image Classifier
          </span>

          <h1>Welcome back</h1>

          <p>
            Sign in to access your X-ray
            classification dashboard and prediction
            history.
          </p>

        </div>


        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            {errors.email && (
              <span className="field-error">
                {errors.email}
              </span>
            )}

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                title={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showPassword ? (

                  // HIDE PASSWORD ICON

                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 4.2A10.8 10.8 0 0112 4c5.5 0 9 5 9 5a15.7 15.7 0 01-3.1 3.6M6.6 6.6C4.3 8 3 10 3 10s3.5 5 9 5c1.2 0 2.3-.2 3.3-.6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                ) : (

                  // SHOW PASSWORD ICON

                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />

                  </svg>

                )}

              </button>

            </div>


            {errors.password && (
              <span className="field-error">
                {errors.password}
              </span>
            )}

          </div>


          {/* LOGIN MESSAGE */}

          {message && (
            <div className="form-message">
              {message}
            </div>
          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>

        </form>


        {/* REGISTER */}

        <div className="auth-footer">

          <p>
            Don't have an account?{" "}

            <Link to="/register">
              Create Account
            </Link>
          </p>

        </div>


        {/* DISCLAIMER */}

        <div className="auth-disclaimer">

          <strong>
            Academic Use Only
          </strong>

          <p>
            This system is intended for educational
            and research purposes and is not a
            clinical diagnostic tool.
          </p>

        </div>

      </section>
    </main>
  );
}


export default Login;