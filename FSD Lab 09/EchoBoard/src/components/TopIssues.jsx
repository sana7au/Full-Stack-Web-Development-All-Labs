function TopIssues() {
  const issues = [
    { title: "AC not working in Lab 3", reports: 14, status: "In Progress" },
    { title: "Library closes too early", reports: 11, status: "Acknowledged" },
    { title: "Cafeteria queue is too long", reports: 9, status: "Open" },
    { title: "Wi-Fi drops in Block B", reports: 7, status: "Open" },
    { title: "Broken light near parking", reports: 4, status: "Resolved" },
  ];

  return (
    <section className="card">
      <h2 className="card-title">Top Issues</h2>
      <p className="card-subtitle">Similar complaints grouped together</p>

      <ul className="issue-list">
        {issues.map((issue) => (
          <li key={issue.title} className="issue-item">
            <div>
              <strong>{issue.title}</strong>
              <p className="issue-meta">{issue.reports} students reported</p>
            </div>
            <span className="status">{issue.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TopIssues;
