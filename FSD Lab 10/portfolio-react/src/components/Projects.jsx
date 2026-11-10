import SectionTitle from './SectionTitle.jsx';
import ProjectCard from './ProjectCard.jsx';
import { projects } from '../data/portfolioData.js';

function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionTitle title="Projects" />
        <div className="grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
