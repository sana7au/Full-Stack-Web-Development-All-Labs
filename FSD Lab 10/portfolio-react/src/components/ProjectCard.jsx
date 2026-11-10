function ProjectCard({ project }) {
  return (
    <div className="card">
      <h3>{project.title}</h3>
      <p className="desc">{project.description}</p>
      <div className="tags">
        {project.tech.map((t) => (
          <span className="tag" key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export default ProjectCard;
