import { projects } from './projects.ts';

export const projectCaseStudies = [
  {
    project: projects[1],
    sections: [
      {
        id: 'local-discovery',
        title: 'Local dependency discovery',
        text: 'Upkeep starts with a read-only discovery step for Python dependencies. The current release runs locally, giving developers a view of dependencies before any update workflow takes place.',
      },
      {
        id: 'integration',
        title: 'Azure DevOps plans',
        text: 'The project aims to bring configurable dependency updates to Azure DevOps repositories and pipelines. Explicit update policies and predictable execution are goals for that integration.',
      },
    ],
  },
  {
    project: projects[5],
    sections: [
      {
        id: 'static-build',
        title: 'Rendering the portfolio at build time',
        text: 'Vite builds the React application and a server-rendering entry point. The build renders each registered page to HTML with its own metadata. Visitors can open and share a project URL and follow links even with JavaScript disabled.',
      },
      {
        id: 'browser',
        title: 'Navigation in the browser',
        text: 'React Router handles navigation after hydration. Route changes update page metadata and move keyboard focus to the destination heading. The site uses shared layout and theme controls across the homepage, About page and project pages.',
      },
    ],
    source: {
      url: 'https://github.com/lhajoosten/lucjoosten.nl/blob/518ac803c49ba6569c58e824e551ebd7ac13bf35/README.md',
      revision: '518ac803c49ba6569c58e824e551ebd7ac13bf35',
      reviewed: '2026-11-21',
    },
  },
] as const;
