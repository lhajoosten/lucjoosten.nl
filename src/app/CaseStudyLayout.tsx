import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ProjectDiagram } from '../components/ProjectDiagram';
import type { HomepageProject } from '../content/projects';

type SectionLink = { id: string; title: string };

export function CaseStudyLayout({
  project,
  heading,
  introduction,
  sections,
  firstSection,
  children,
}: {
  project: HomepageProject;
  heading: ReactNode;
  introduction: ReactNode;
  sections: readonly SectionLink[];
  firstSection?: SectionLink;
  children: ReactNode;
}) {
  return (
    <article className="section site-container case-study" aria-labelledby="case-study-heading">
      <Link className="small-link" to="/projects">
        ← Back to projects
      </Link>
      <div className="case-intro">
        <div className="page-intro">
          <p className="mono accent">{project.category} / Case study</p>
          <h1 id="case-study-heading">{heading}</h1>
          {introduction}
          <p className="project-status mono">{project.status}</p>
          <div className="tags">
            {project.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="case-visual">
          <ProjectDiagram type={project.diagram} />
        </div>
      </div>
      <div className="case-body">
        <aside>
          <nav aria-label="Case study sections">
            <p className="mono muted">In this case study</p>
            {firstSection && <a href={`#${firstSection.id}`}>{firstSection.title}</a>}
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>
        <div className="case-prose">
          {children}
          <Link className="small-link" to="/projects">
            ← Back to projects
          </Link>
        </div>
      </div>
    </article>
  );
}
