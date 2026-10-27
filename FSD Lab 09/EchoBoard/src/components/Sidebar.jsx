function Sidebar() {
  const menuItems = [
    "Dashboard",
    "Feedback Feed",
    "Polls",
    "Campus Map",
    "Moderation",
    "Reports",
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">EchoBoard</div>
      <p className="sidebar-tagline">Your campus, finally heard.</p>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item} className={item === "Dashboard" ? "active" : ""}>
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
