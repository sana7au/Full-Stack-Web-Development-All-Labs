import { useState } from 'react';

function Hero({ profile }) {
  const [noImage, setNoImage] = useState(false);

  return (
    <section id="home" className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <p className="muted">Hello, I am</p>
          <h1>{profile.name}</h1>
          <h2>{profile.title}</h2>
          <div className="hero-buttons">
            <a className="btn" href="#projects">View Projects</a>
            <a className="btn btn-outline" href="#contact">Contact Me</a>
          </div>
        </div>
        <div className="avatar">
          {noImage ? (
            profile.name.charAt(0)
          ) : (
            <img src="/me.jpg" alt="My photo" onError={() => setNoImage(true)} />
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;