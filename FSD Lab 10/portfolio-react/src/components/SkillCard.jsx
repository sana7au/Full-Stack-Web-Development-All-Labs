function SkillCard({ skill }) {
  return (
    <div className="card">
      <div className="skill-top">
        <strong>{skill.name}</strong>
        <span className="muted">{skill.level}%</span>
      </div>
      <div className="bar">
        <div className="bar-fill" style={{ width: skill.level + '%' }}></div>
      </div>
    </div>
  );
}

export default SkillCard;
