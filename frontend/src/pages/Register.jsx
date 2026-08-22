import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


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


  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one number.";
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirm_password
    ) {
      newErrors.confirm_password =
        "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/api/auth/register",
        formData
      );

      setMessage(
        response.data.message ||
          "Registration successful."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      const backendMessage =
        error.response?.data?.message;

      setMessage(
        backendMessage ||
          "Registration failed. Please try again."
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

          <h1>Create your account</h1>

          <p>
            Register to access the X-ray classification
            dashboard and prediction history.
          </p>

        </div>


        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* FULL NAME */}

          <div className="form-group">

            <label htmlFor="full_name">
              Full Name
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
            />

            {errors.full_name && (
              <span className="field-error">
                {errors.full_name}
              </span>
            )}

          </div>


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
                placeholder="Create a strong password"
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
              >

                {showPassword ? (

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


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label htmlFor="confirm_password">
              Confirm Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="confirm_password"
                name="confirm_password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Re-enter your password"
                value={formData.confirm_password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) => !previous
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showConfirmPassword ? (

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


            {errors.confirm_password && (
              <span className="field-error">
                {errors.confirm_password}
              </span>
            )}

          </div>


          {/* MESSAGE */}

          {message && (
            <div className="form-message">
              {message}
            </div>
          )}


          {/* CREATE ACCOUNT */}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        <div className="auth-footer">

          <p>
            Already have an account?{" "}

            <Link to="/login">
              Login
            </Link>
          </p>

        </div>


        <div className="auth-disclaimer">

          <strong>
            Academic Use Only
          </strong>

          <p>
            This application is an academic AI
            classification system and is not a clinical
            diagnostic tool.
          </p>

        </div>

      </section>
    </main>
  );
}

export default Register;