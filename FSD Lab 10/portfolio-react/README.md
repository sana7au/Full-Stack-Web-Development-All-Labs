# Personal Portfolio (React + Vite)

Static, responsive portfolio website. No backend, no database.

## Run

```bash
npm install
npm run dev
```

Open the link shown in the terminal (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Edit your data

All text (name, skills, projects, contact) lives in one file: `src/data/portfolioData.js`.

## Structure

```
src/
  main.jsx            entry point
  App.jsx             puts all sections together
  index.css           all styling
  data/portfolioData.js
  components/
    Navbar.jsx  Hero.jsx  About.jsx  Skills.jsx  SkillCard.jsx
    Projects.jsx  ProjectCard.jsx  Contact.jsx  Footer.jsx
    SectionTitle.jsx
```
