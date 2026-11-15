export const navigation = [
  { href: '/projects', label: 'Projects' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#expertise', label: 'Expertise' },
  { href: '/#writing', label: 'Writing' },
  { href: '/#contact', label: 'Contact' },
] as const;

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
