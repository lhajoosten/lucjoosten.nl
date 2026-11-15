export const navigation = [
  { href: '/#projects', label: 'Projects' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#expertise', label: 'Expertise' },
  { href: '/#writing', label: 'Writing' },
  { href: '/#contact', label: 'Contact' },
] as const;

export const profiles = {
  github: 'https://github.com/lhajoosten',
  linkedin: 'https://www.linkedin.com/in/lhajoosten/',
};

export type HomepageProject = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  detail: string;
  status: string;
  tags: readonly string[];
  diagram: 'review' | 'cloud' | 'release';
  repository: { visibility: 'public'; url: string } | { visibility: 'private' };
};

// Homepage summaries only. Full case-study metadata belongs to Phase 2.
export const projects = [
  {
    slug: 'release-log',
    title: 'Release Log',
    category: 'Developer tooling',
    summary: 'A TypeScript CLI for deterministic changelogs and structured release context.',
    detail:
      'Release Log separates reproducible changelog generation from optional AI-assisted release notes. Git/PR collection, snapshots, version planning and rendering are implemented. Release automation has documented rollout limits; the reusable workflow is not yet deployed.',
    status: 'In development',
    tags: ['TypeScript', 'GitHub', 'Developer tooling'],
    diagram: 'release',
    repository: { visibility: 'public', url: 'https://github.com/lhajoosten/release-log' },
  },
  {
    slug: 'azure-ai-workbench',
    title: 'Azure AI Workbench',
    category: 'Cloud & AI',
    summary: 'A study project planning a document-processing backend on Azure.',
    detail:
      'Currently documentation only: a project brief, learning roadmap and exercises. The intended application explores document-processing jobs and AI backends on Azure. There is no application or deployed infrastructure yet.',
    status: 'Planning · documentation only',
    tags: ['Azure', 'AI engineering', 'Learning'],
    diagram: 'cloud',
    repository: { visibility: 'public', url: 'https://github.com/lhajoosten/azure-ai-workbench' },
  },
  {
    slug: 'reviewbot',
    title: 'ReviewBot',
    category: 'Personal project',
    summary: 'A private project. A public engineering overview is being prepared.',
    detail:
      'This repository is private. A public case study is in preparation; source code is not publicly available.',
    status: 'Private · overview pending',
    tags: ['Private project'],
    diagram: 'review',
    repository: { visibility: 'private' },
  },
] as const satisfies readonly HomepageProject[];

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
