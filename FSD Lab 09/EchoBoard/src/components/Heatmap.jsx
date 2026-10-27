// level: "good" = positive, "ok" = neutral, "bad" = negative
function Heatmap() {
  const weeks = ["W1", "W2", "W3", "W4"];

  const rows = [
    {
      department: "Computer Science",
      cells: [
        { score: 3.9, level: "good" },
        { score: 3.4, level: "ok" },
        { score: 2.6, level: "bad" },
        { score: 3.1, level: "ok" },
      ],
    },
    {
      department: "Aerospace",
      cells: [
        { score: 3.2, level: "ok" },
        { score: 3.6, level: "good" },
        { score: 3.8, level: "good" },
        { score: 3.5, level: "good" },
      ],
    },
    {
      department: "Library",
      cells: [
        { score: 2.4, level: "bad" },
        { score: 2.9, level: "bad" },
        { score: 3.3, level: "ok" },
        { score: 3.7, level: "good" },
      ],
    },
    {
      department: "Cafeteria",
      cells: [
        { score: 2.8, level: "bad" },
        { score: 3.0, level: "ok" },
        { score: 2.7, level: "bad" },
        { score: 3.2, level: "ok" },
      ],
    },
  ];

  return (
    <section className="card">
      <h2 className="card-title">Sentiment Heatmap</h2>
      <p className="card-subtitle">Average rating by department and week</p>

      <div className="heatmap">
        <div className="heatmap-row">
          <div className="heatmap-label"></div>
          {weeks.map((week) => (
            <div key={week} className="heatmap-head">
              {week}
            </div>
          ))}
        </div>

        {rows.map((row) => (
          <div key={row.department} className="heatmap-row">
            <div className="heatmap-label">{row.department}</div>
            {row.cells.map((cell, index) => (
              <div key={index} className={"heatmap-cell " + cell.level}>
                {cell.score}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="legend">
        <span className="legend-item"><i className="dot bad"></i>Negative</span>
        <span className="legend-item"><i className="dot ok"></i>Neutral</span>
        <span className="legend-item"><i className="dot good"></i>Positive</span>
      </div>
    </section>
  );
}

export default Heatmap;
