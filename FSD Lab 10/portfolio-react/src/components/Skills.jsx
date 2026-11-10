import SectionTitle from './SectionTitle.jsx';
import SkillCard from './SkillCard.jsx';
import { skills } from '../data/portfolioData.js';

function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionTitle title="Skills" />
        <div className="grid">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
