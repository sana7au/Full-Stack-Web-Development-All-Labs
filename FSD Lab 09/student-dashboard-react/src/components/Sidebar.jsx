// Sidebar.jsx - Navigation sidebar for CampusHub
function Sidebar() {
  return (
    <aside className="sidebar">
      {/* University Branding */}
      <div className="sidebar-brand">
        <span className="brand-icon">🏛️</span>
        <div className="brand-text">
          <span className="brand-title">CampusHub</span>
          <span className="brand-subtitle">University Portal</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item active">
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">🎓</span>
            <span className="nav-label">Students</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">📚</span>
            <span className="nav-label">Courses</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">📋</span>
            <span className="nav-label">Attendance</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Settings</span>
          </li>
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot"></span>
          <span className="status-text">System Online</span>
        </div>
        <p className="system-version">CampusHub v1.0 • Fall 2026</p>
      </div>
    </aside>
  );
}

export default Sidebar;
