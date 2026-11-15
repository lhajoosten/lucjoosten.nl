export const profiles = {
  github: 'https://github.com/lhajoosten',
  linkedin: 'https://www.linkedin.com/in/lhajoosten/',
};

export const focusAreas = [
  {
    title: 'AI Engineering',
    description: 'LLM integrations, agentic workflows, and AI-powered applications.',
  },
  { title: 'Backend', description: 'Python, FastAPI, PostgreSQL, and clear API contracts.' },
  {
    title: 'Frontend',
    description: 'React, TypeScript, and thoughtful interfaces for data-intensive applications.',
  },
  {
    title: 'Cloud & Architecture',
    description: 'Azure infrastructure, software architecture, testing, and developer tooling.',
  },
] as const;

// Owner-reviewed positioning already published on the homepage.
export const positioning = {
  heading: 'Full-stack by foundation.',
  emphasis: 'AI-focused by practice.',
  approach:
    'My work connects application architecture, user experience, data systems, and AI integration. I prefer practical solutions with clear boundaries, sound testing, and observable behavior over complexity for its own sake.',
  currentWork:
    'At Crowe Netherlands, I work on CynthAI, building AI-powered applications for accountancy and financial services.',
  role: 'Software Engineer',
  employer: 'Crowe Netherlands',
  product: 'CynthAI',
  domain: 'Accountancy & financial services',
} as const;
