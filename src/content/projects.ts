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

// Reviewed summaries shared by the homepage and projects index.
export const projects = [
  {
    slug: 'release-log',
    title: 'Release Log',
    category: 'Developer tooling',
    summary:
      'A packaged TypeScript CLI for deterministic changelogs and reviewed release automation.',
    detail:
      'Release Log captures Git/PR context, prepares a release PR and tags its reviewed merge. The project uses its own workflow and distributes a Linux/amd64 container. Deterministic changelogs work without AI; AI-written release notes remain planned.',
    status: 'Available · actively developed',
    tags: ['TypeScript', 'GitHub', 'Developer tooling'],
    diagram: 'release',
    repository: { visibility: 'public', url: 'https://github.com/lhajoosten/release-log' },
  },
  {
    slug: 'upkeep',
    title: 'Upkeep',
    category: 'Developer tooling',
    summary: 'A Rust dependency management bot with local, read-only Python dependency discovery.',
    detail:
      'Upkeep is being built for Azure DevOps repositories and pipelines. Its aim is secure, configurable dependency updates with explicit policies and predictable execution. The current release provides local, read-only Python dependency discovery. Azure DevOps integration is planned.',
    status: 'Private · local discovery available',
    tags: ['Rust', 'Python dependencies', 'Azure DevOps planned'],
    diagram: 'review',
    repository: { visibility: 'private' },
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
