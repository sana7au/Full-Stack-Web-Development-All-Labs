// SummaryCards.jsx - Four key metric summary cards for the university dashboard
function SummaryCards() {
  return (
    <section className="summary-cards">
      {/* Card 1: Total Students */}
      <div className="card card-blue">
        <div className="card-top">
          <span className="card-label">Total Students</span>
          <span className="card-icon">👨‍🎓</span>
        </div>
        <div className="card-value">248</div>
        <div className="card-accent-line"></div>
        <p className="card-footer-text">Enrolled across all programs</p>
      </div>

      {/* Card 2: Active Courses */}
      <div className="card card-indigo">
        <div className="card-top">
          <span className="card-label">Active Courses</span>
          <span className="card-icon">📚</span>
        </div>
        <div className="card-value">12</div>
        <div className="card-accent-line"></div>
        <p className="card-footer-text">Undergraduate offerings</p>
      </div>

      {/* Card 3: Average Attendance */}
      <div className="card card-emerald">
        <div className="card-top">
          <span className="card-label">Average Attendance</span>
          <span className="card-icon">📊</span>
        </div>
        <div className="card-value">87%</div>
        <div className="card-accent-line"></div>
        <p className="card-footer-text">Current semester average</p>
      </div>

      {/* Card 4: Departments */}
      <div className="card card-amber">
        <div className="card-top">
          <span className="card-label">Departments</span>
          <span className="card-icon">🏛️</span>
        </div>
        <div className="card-value">6</div>
        <div className="card-accent-line"></div>
        <p className="card-footer-text">Faculties in operation</p>
      </div>
    </section>
  );
}

export default SummaryCards;
