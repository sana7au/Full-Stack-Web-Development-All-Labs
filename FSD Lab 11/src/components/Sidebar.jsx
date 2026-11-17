// Sidebar.jsx - Navigation sidebar for CampusHub

const navigationItems = [
  { label: 'Dashboard', icon: '📊' },
  { label: 'Students', icon: '🎓' },
  { label: 'Courses', icon: '📚' },
  { label: 'Attendance', icon: '📋' },
  { label: 'Settings', icon: '⚙️' },
];

function Sidebar({ activePage, onNavigate, isCollapsed, onToggle, onlineStatus }) {
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <span className="brand-icon">🏛️</span>
        <div className="brand-text">
          <span className="brand-title">CampusHub</span>
          <span className="brand-subtitle">University Portal</span>
        </div>
      </div>
      <button type="button" className="sidebar-toggle" onClick={onToggle} aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        {isCollapsed ? '»' : '«'}
      </button>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navigationItems.map((item) => (
            <li key={item.label}>
              <button type="button" className={`nav-item ${activePage === item.label ? 'active' : ''}`} onClick={() => onNavigate(item.label)} title={item.label}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="system-status">
          <span className={`status-dot ${onlineStatus === 'Offline' ? 'status-dot-offline' : ''}`}></span>
          <span className="status-text">{onlineStatus}</span>
        </div>
        <p className="system-version">CampusHub v1.0 • Fall 2026</p>
      </div>
    </aside>
  );
}

export default Sidebar;
