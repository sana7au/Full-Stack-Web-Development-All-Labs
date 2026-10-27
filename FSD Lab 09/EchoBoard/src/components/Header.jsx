function Header() {
  const pageTitle = "Admin Dashboard";
  const subtitle = "Overview of campus feedback this week";
  const session = "Fall 2026";

  return (
    <header className="site-header">
      <div>
        <h1>{pageTitle}</h1>
        <p>{subtitle}</p>
      </div>
      <span className="header-badge">Session: {session}</span>
    </header>
  );
}

export default Header;
