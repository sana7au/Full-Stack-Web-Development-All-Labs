import SectionTitle from './SectionTitle.jsx';

function About({ profile }) {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionTitle title="About Me" />
        <div className="about-grid">
          <p className="about-text">{profile.about}</p>
          <ul className="contact-list">
            <li><span>Email</span>{profile.email}</li>
            <li><span>Phone</span>{profile.phone}</li>
            <li><span>Location</span>{profile.location}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;
