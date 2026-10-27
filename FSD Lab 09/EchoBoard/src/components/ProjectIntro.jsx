function ProjectIntro() {
  const features = [
    "Anonymous feedback",
    "Sentiment heatmap",
    "Complaint clustering",
    "Anonymous polls",
    "Live campus map",
  ];

  return (
    <section className="card intro-card">
      <h2>About EchoBoard</h2>
      <p>
        EchoBoard is an anonymous campus feedback platform. Students share
        feedback about courses, facilities and events without revealing their
        identity. Admins see where problems are growing, and similar complaints
        are grouped into one issue.
      </p>

      <div className="chip-row">
        {features.map((feature) => (
          <span key={feature} className="chip">
            {feature}
          </span>
        ))}
      </div>
    </section>
  );
}

export default ProjectIntro;
