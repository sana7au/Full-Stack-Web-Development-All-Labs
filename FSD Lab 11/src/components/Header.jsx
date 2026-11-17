// Header.jsx - Top navigation header with current page and administrator profile

function Header({ pageTitle, onlineStatus }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{pageTitle === 'Dashboard' ? 'Student Dashboard' : pageTitle}</h1>
        <p className="header-welcome">Welcome back, Administrator</p>
      </div>
      <div className="header-right">
        <div className="session-badge">
          <span className="session-icon">📅</span>
          <span className="session-label">Session:</span>
          <strong className="session-value">Fall 2026</strong>
        </div>
        <div className="admin-profile">
          <div className="profile-avatar">AD</div>
          <div className="profile-details">
            <span className="profile-name">Administrator</span>
            <span className="profile-role">{onlineStatus}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
