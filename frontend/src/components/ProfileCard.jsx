import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";


function ProfileCard({ user }) {
  const navigate = useNavigate();

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");


  if (!user) {
    return null;
  }


  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This will permanently remove your prediction and chat history."
    );

    if (!confirmed) {
      return;
    }


    try {
      setDeleting(true);
      setError("");

      await api.delete(
        "/api/auth/delete-account"
      );


      localStorage.removeItem("token");
      localStorage.removeItem("user");


      navigate("/register");

    } catch (error) {
      const backendMessage =
        error.response?.data?.message;

      setError(
        backendMessage ||
          "Unable to delete account."
      );

    } finally {
      setDeleting(false);
    }
  };


  return (
    <section className="dashboard-section">

      <div className="section-heading">

        <div>

          <span className="section-label">
            Account
          </span>

          <h2>
            User Profile
          </h2>

          <p>
            Basic information for the currently
            authenticated account.
          </p>

        </div>

      </div>


      <div className="profile-card-grid">

        <div className="profile-avatar-large">
          {user.full_name
            ?.charAt(0)
            .toUpperCase() || "U"}
        </div>


        <div className="profile-information">

          <div className="profile-info-row">

            <span>
              Full Name
            </span>

            <strong>
              {user.full_name || "Unavailable"}
            </strong>

          </div>


          <div className="profile-info-row">

            <span>
              Email Address
            </span>

            <strong>
              {user.email || "Unavailable"}
            </strong>

          </div>


          <div className="profile-info-row">

            <span>
              User ID
            </span>

            <strong className="profile-user-id">
              {user.id ||
                user.user_id ||
                "Unavailable"}
            </strong>

          </div>


          <div className="profile-info-row">

            <span>
              Authentication
            </span>

            <strong className="profile-auth-status">
              Authenticated
            </strong>

          </div>

        </div>

      </div>


      <div className="profile-note">

        <strong>
          Account Security
        </strong>

        <p>
          Passwords are stored as bcrypt hashes in
          MongoDB. The original password is not stored
          in plain text.
        </p>

      </div>


      <div className="danger-zone">

        <div>

          <strong>
            Delete Account
          </strong>

          <p>
            Permanently remove your account,
            prediction history and chatbot history.
            This action cannot be undone.
          </p>

        </div>


        <button
          type="button"
          className="delete-account-button"
          onClick={handleDeleteAccount}
          disabled={deleting}
        >
          {deleting
            ? "Deleting..."
            : "Delete Account"}
        </button>

      </div>


      {error && (
        <div className="profile-delete-error">
          {error}
        </div>
      )}

    </section>
  );
}


export default ProfileCard;