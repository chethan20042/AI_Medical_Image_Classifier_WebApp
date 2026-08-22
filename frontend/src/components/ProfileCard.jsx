function ProfileCard({ user }) {
  if (!user) {
    return null;
  }

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
              {user.id || "Unavailable"}
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

    </section>
  );
}


export default ProfileCard;