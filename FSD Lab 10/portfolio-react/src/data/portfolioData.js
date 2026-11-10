// All portfolio content is stored here. Edit this file to change the website.

export const profile = {
  name: 'SANA FATIMA',
  title: 'BSCS Student and Game Developer',
  email: '245207@aack.au.edu.pk',
  phone: '+92 343 8504412',
  location: 'Kamra, Pakistan',
  github: 'https://github.com/sana7au',
  linkedin: 'https://www.linkedin.com/in/sanafatimaa',
  about:
    'I am a BSCS student at Air University, Aerospace and Aviation Campus, Kamra (Batch F24). ' +
    'Currently in my 5th Semester, and already worked as a game development intern at Plasma IT Solutions, where I built game features using Unity and C#.\n\n' +
    'I enjoy turning ideas into working software, from games to full stack web apps and mobile apps. ' +
    'Would love to grow by your advice. I am also open to internships and freelance work, so feel free to contact me if you have any opportunities.'
};

export const skills = [
  { id: 1, name: 'Unity and C#', level: 80 },
  { id: 2, name: 'React', level: 70 },
  { id: 3, name: 'HTML and CSS', level: 85 },
  { id: 4, name: 'JavaScript and jQuery', level: 75 },
  { id: 5, name: 'Node.js and Express', level: 70 },
  { id: 6, name: 'MySQL', level: 70 },
  { id: 7, name: 'Flutter', level: 65 },
  { id: 8, name: 'Python', level: 65 },
  { id: 9, name: 'Assembly (x86 MASM)', level: 55 }
];

export const projects = [
  {
    id: 1,
    title: 'Sorting Algorithm Game',
    description:
      'A Unity game based learning platform that teaches sorting algorithms through play. ' +
      'Built with 19 C# scripts, DOTween animations, scoring, timer and win or lose panels.',
    tech: ['Unity', 'C#', 'DOTween']
  },
  {
    id: 2,
    title: 'PulseChat',
    description:
      'A Flutter chat app with contacts, role based login, SQLite storage and an AI assistant, ' +
      'wrapped in a dark premium theme.',
    tech: ['Flutter', 'SQLite', 'Claude API']
  },
  {
    id: 3,
    title: 'Dev Assistant',
    description:
      'A learning platform with a Flutter frontend and a Node.js and Express backend, ' +
      'using MySQL for data and an AI model for answers.',
    tech: ['Flutter', 'Node.js', 'MySQL']
  },
  {
    id: 4,
    title: 'Typing Speed Analyzer',
    description:
      'An x86 assembly language project that measures typing speed, made for the COAL course.',
    tech: ['Assembly', 'x86', 'MASM']
  },
  {
    id: 5,
    title: 'Campus AI Assistant',
    description:
      'A Flutter app with a dark theme and several screens that helps students with campus information.',
    tech: ['Flutter', 'Dart']
  }
];
