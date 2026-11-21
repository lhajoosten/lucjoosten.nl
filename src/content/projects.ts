export type Project = {
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
export const projectCatalog = {
  'release-log': {
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
  'lint-action': {
    slug: 'lint-action',
    title: 'Lint Action',
    category: 'Developer tooling',
    summary: 'A Rust CLI and GitHub Action that check cyclomatic complexity across four languages.',
    detail:
      'Lint Action uses Tree-sitter to score callables in Rust, TypeScript, TSX and Python. Teams can report findings, enforce limits immediately or adopt a baseline for existing exceptions.',
    status: 'Implemented · CLI and GitHub Action',
    tags: ['Rust', 'Tree-sitter', 'GitHub Actions'],
    diagram: 'review',
    repository: { visibility: 'public', url: 'https://github.com/lhajoosten/lint-action' },
  },
  upkeep: {
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
  'azure-ai-workbench': {
    slug: 'azure-ai-workbench',
    title: 'Azure AI Workbench',
    category: 'Cloud & AI',
    summary: 'A study project planning a document-processing backend on Azure.',
    detail:
      'Currently documentation only: a project brief, learning roadmap and exercises. The study material supports AI-200 preparation through a planned document-processing backend on Azure. There is no application or deployed infrastructure yet.',
    status: 'Planning · documentation only',
    tags: ['Azure', 'AI engineering', 'Learning'],
    diagram: 'cloud',
    repository: { visibility: 'public', url: 'https://github.com/lhajoosten/azure-ai-workbench' },
  },
  reviewbot: {
    slug: 'reviewbot',
    title: 'ReviewBot',
    category: 'Personal project',
    summary:
      'A private project exploring a review workflow through a terminal interface and dashboard.',
    detail:
      'The terminal interface and dashboard are two ways into the review workflow. A public engineering overview is in preparation.',
    status: 'Private · overview pending',
    tags: ['Private project'],
    diagram: 'review',
    repository: { visibility: 'private' },
  },
  'kube-lab': {
    slug: 'kube-lab',
    title: 'kube-lab',
    category: 'Cloud operations',
    summary: 'A lab exploring incident response with a Kubernetes dashboard and bot.',
    detail:
      'The intended workflow brings a dashboard and bot into incident resolution so operators can work through an incident in a lab setting.',
    status: 'Private · intended workflow',
    tags: ['Kubernetes', 'Incident response'],
    diagram: 'cloud',
    repository: { visibility: 'private' },
  },
  'lucjoosten-nl': {
    slug: 'lucjoosten-nl',
    title: 'lucjoosten.nl',
    category: 'Web engineering',
    summary: 'A static React portfolio with client-side navigation and prerendered pages.',
    detail:
      'The build renders the homepage, About page, and project routes to HTML. React adds interactive navigation and theme controls in the browser.',
    status: 'Live · static site',
    tags: ['React', 'TypeScript', 'Vite'],
    diagram: 'release',
    repository: { visibility: 'public', url: 'https://github.com/lhajoosten/lucjoosten.nl' },
  },
} as const satisfies Record<string, Project>;

export const projects = Object.values(projectCatalog);
