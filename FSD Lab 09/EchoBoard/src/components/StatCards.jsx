function StatCards() {
  const stats = [
    { label: "Total Feedback", value: "1,284", note: "+86 this week" },
    { label: "Open Issues", value: "23", note: "5 new today" },
    { label: "Active Polls", value: "4", note: "312 votes" },
    { label: "Resolved Rate", value: "68%", note: "+4% vs last week" },
  ];

  return (
    <section className="stats-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="card stat-card">
          <p className="stat-label">{stat.label}</p>
          <h3 className="stat-value">{stat.value}</h3>
          <p className="stat-note">{stat.note}</p>
        </div>
      ))}
    </section>
  );
}

export default StatCards;
