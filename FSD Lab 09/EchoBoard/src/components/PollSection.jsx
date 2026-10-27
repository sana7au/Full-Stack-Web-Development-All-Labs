function PollSection() {
  const question = "Should the library stay open until midnight?";
  const totalVotes = 312;

  const options = [
    { text: "Yes, every day", percent: 58 },
    { text: "Only during exams", percent: 31 },
    { text: "No change needed", percent: 11 },
  ];

  return (
    <section className="card">
      <h2 className="card-title">Live Poll</h2>
      <p className="card-subtitle">
        {question} ({totalVotes} anonymous votes)
      </p>

      {options.map((option) => (
        <div key={option.text} className="poll-option">
          <div className="poll-text">
            <span>{option.text}</span>
            <span>{option.percent}%</span>
          </div>
          <div className="poll-track">
            <div
              className="poll-fill"
              style={{ width: option.percent + "%" }}
            ></div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default PollSection;
