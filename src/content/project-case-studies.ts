import { projectCatalog } from './projects.ts';

type StudyContent = {
  subtitle: string;
  sections: readonly { id: string; title: string; paragraphs: readonly string[] }[];
  source?: { url: string; revision: string; reviewed: string };
};

const studies = {
  'lint-action': {
    subtitle: 'Make complexity visible before making it a merge gate.',
    sections: [
      {
        id: 'scoring',
        title: 'One scoring engine for local runs and CI',
        paragraphs: [
          'Cyclomatic complexity measures decision paths within a callable. Lint Action parses Rust, TypeScript, TSX and Python with bundled Tree-sitter grammars. Language-specific adapters identify callables and decision points, while a shared analyzer applies the scoring rules. The local CLI and composite GitHub Action use that same engine.',
          'A repository policy sets limits by language and selects paths with include and exclude globs. Scores equal to the configured limit pass. Findings identify the callable, its location, score, limit and disposition so a reviewer can find the code that triggered the check.',
        ],
      },
      {
        id: 'baseline',
        title: 'Adopt the gate in stages',
        paragraphs: [
          'Report-only mode gives a team a first look at existing findings. Strict mode blocks over-limit callables. Baseline mode preserves reviewed exceptions as long as each callable still has a unique, stable identity and its score stays at or below the recorded value.',
          'For example, if a TypeScript function scores 24 against a limit of 20, a reviewed baseline can let that function pass at 24. Increasing it to 25 blocks the run. The identity includes the file path and qualified callable name, so inserting lines above the function leaves the exception intact.',
        ],
      },
      {
        id: 'ci',
        title: 'Keep policy and findings reviewable',
        paragraphs: [
          'In a pull request, the Action takes its policy and baseline from the base commit by default and analyzes the checked-out candidate. Policy changes can be validated separately. The Action posts a job summary and up to ten GitHub annotations, with a fuller JSON report for automation.',
          'The Action targets GitHub-hosted Ubuntu 24.04 x64 initially and builds the analyzer with Cargo. A run reports blocking findings separately from analysis failures such as invalid policy or parse errors.',
        ],
      },
    ],
    source: {
      url: 'https://github.com/lhajoosten/lint-action/blob/a0be508341f2ac8001143cd13e729ae8579b0b1c/README.md',
      revision: 'a0be508341f2ac8001143cd13e729ae8579b0b1c',
      reviewed: '2026-11-21',
    },
  },
  upkeep: {
    subtitle: 'Dependency automation starts with an inventory.',
    sections: [
      {
        id: 'local-discovery',
        title: 'Local dependency discovery',
        paragraphs: [
          'Before a dependency bot can propose an update, it needs to know what the project depends on. Upkeep’s current Rust implementation handles this first step for Python dependencies. It runs locally and reads project dependencies without applying changes.',
          'This gives the discovery step a purpose on its own. A developer can inspect what Upkeep finds before adopting any workflow that changes dependencies.',
        ],
      },
      {
        id: 'integration',
        title: 'Azure DevOps plans',
        paragraphs: [
          'The planned integration brings dependency updates to Azure DevOps repositories and pipelines. Configuration would define which updates to consider, with explicit policies and predictable execution as design goals.',
          'Local discovery is the available capability. Update automation and Azure DevOps integration remain planned.',
        ],
      },
    ],
  },
  'azure-ai-workbench': {
    subtitle: 'Learn Azure AI by planning a document-processing backend.',
    sections: [
      {
        id: 'learning',
        title: 'A concrete problem for the study plan',
        paragraphs: [
          'The workbench uses document processing as a thread through its AI-200 preparation. The project brief sets the problem, the roadmap sequences the learning, and the exercises give individual topics a place to be explored before they are tied together.',
        ],
      },
      {
        id: 'scope',
        title: 'From exercises to a backend',
        paragraphs: [
          'The proposed backend gives the exercises a common destination. It provides a way to ask where document processing belongs in an application and what the surrounding backend would need to do.',
          'The public repository currently contains the brief, roadmap and exercises. The backend remains a plan, with application code and deployed infrastructure still to come.',
        ],
      },
    ],
  },
  reviewbot: {
    subtitle: 'Two interfaces for one review workflow.',
    sections: [
      {
        id: 'interfaces',
        title: 'The terminal and the dashboard',
        paragraphs: [
          'ReviewBot explores how a review workflow might feel in two places. The terminal offers a way to enter the workflow while working at the command line. The dashboard explores how the same workflow can be represented visually.',
          'The design question is what each surface should make easy. A terminal interaction can favor a direct next action, while a dashboard can give more room to the surrounding context.',
        ],
      },
      {
        id: 'scope',
        title: 'Current scope',
        paragraphs: [
          'The project is private and a public engineering overview is in preparation. The two interfaces describe the direction of the project.',
        ],
      },
    ],
  },
  'kube-lab': {
    subtitle: 'Practice working through a Kubernetes incident in a lab.',
    sections: [
      {
        id: 'incident-workflow',
        title: 'A dashboard and a bot in the same exercise',
        paragraphs: [
          'kube-lab explores how a Kubernetes dashboard and bot could support an operator during incident resolution. The lab gives that idea a setting where an incident can be worked through as an exercise.',
          'A question for that exercise is how the two surfaces complement each other. The dashboard is a place to inspect the situation, while the bot explores a conversational way to work through it.',
        ],
      },
      {
        id: 'scope',
        title: 'Current scope',
        paragraphs: [
          'The dashboard-and-bot experience describes the intended workflow for this private lab. The project is presented as an incident response exercise.',
        ],
      },
    ],
  },
  'lucjoosten-nl': {
    subtitle: 'A portfolio that renders before JavaScript runs.',
    sections: [
      {
        id: 'static-build',
        title: 'Rendering the portfolio at build time',
        paragraphs: [
          'Vite builds both the React application and a server-rendering entry point. The build uses the route metadata list to generate a standalone HTML document for each page with its own title, description and canonical URL.',
          'A direct link to a project serves readable HTML with normal navigation links. The static documents also let the host serve unknown paths with a dedicated 404 page.',
        ],
      },
      {
        id: 'browser',
        title: 'Navigation in the browser',
        paragraphs: [
          'Once React hydrates, React Router handles in-site navigation and updates the same page metadata. Route changes with no fragment move keyboard focus to the new heading, while links with fragments take readers to the named section.',
          'The homepage, project index and case studies share the curated catalog. The layout and theme controls carry across routes, so moving from the grid to a detailed project write-up preserves the reading experience.',
        ],
      },
    ],
    source: {
      url: 'https://github.com/lhajoosten/lucjoosten.nl/blob/518ac803c49ba6569c58e824e551ebd7ac13bf35/README.md',
      revision: '518ac803c49ba6569c58e824e551ebd7ac13bf35',
      reviewed: '2026-11-21',
    },
  },
} satisfies Record<Exclude<keyof typeof projectCatalog, 'release-log'>, StudyContent>;

export type ProjectCaseStudy = StudyContent & {
  project: (typeof projectCatalog)[keyof typeof studies];
};

export const projectCaseStudies: readonly ProjectCaseStudy[] = Object.entries(studies).map(
  ([slug, study]) => ({ ...study, project: projectCatalog[slug as keyof typeof studies] }),
);
