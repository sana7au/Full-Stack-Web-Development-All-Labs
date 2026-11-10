import { useState } from 'react';
import SectionTitle from './SectionTitle.jsx';

function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', message: '' });
  const [showCard, setShowCard] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Show the confirmation card
  function handleSubmit(e) {
    e.preventDefault();
    setShowCard(true);
  }

  // Close the card and empty the form
  function handleOk() {
    setShowCard(false);
    setForm({ name: '', message: '' });
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionTitle title="Contact" />
        <div className="about-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Your Name</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} required></textarea>
            <button type="submit" className="btn">Send Message</button>
          </form>
          <ul className="contact-list">
            <li><span>Email</span>{profile.email}</li>
            <li><span>Phone</span>{profile.phone}</li>
            <li><span>GitHub</span><a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a></li>
            <li><span>LinkedIn</span><a href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedin}</a></li>
          </ul>
        </div>
      </div>

      {showCard && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-icon">&#10003;</div>
            <h3>Message Sent</h3>
            <p>Thank you {form.name}, your message has been sent successfully.</p>
            <button className="btn" onClick={handleOk}>OK</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Contact;