// Header.jsx - Top navigation header with title, session, and administrator profile
function Header() {
  const academicSession = "Fall 2026";
  const welcomeMessage = "Welcome back, Administrator";

  return (
    <header className="header">
      {/* Page Title & Welcome */}
      <div className="header-left">
        <h1 className="header-title">Student Dashboard</h1>
        <p className="header-welcome">{welcomeMessage}</p>
      </div>

      {/* Session Info & Administrator Profile */}
      <div className="header-right">
        {/* Academic Session Badge */}
        <div className="session-badge">
          <span className="session-icon">📅</span>
          <span className="session-label">Session:</span>
          <strong className="session-value">{academicSession}</strong>
        </div>

        {/* Administrator Profile Card */}
        <div className="admin-profile">
          <div className="profile-avatar">AD</div>
          <div className="profile-details">
            <span className="profile-name">Administrator</span>
            <span className="profile-role">Academic Affairs</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
