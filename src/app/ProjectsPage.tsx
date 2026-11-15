import { Link } from 'react-router';
import { projects } from '../content/projects';
import { ProjectDiagram } from '../components/ProjectDiagram';

export function ProjectsPage() {
  return (
    <section className="section site-container projects-page" aria-labelledby="projects-heading">
      <Link className="small-link" to="/">
        ← Back to home
      </Link>
      <div className="page-intro">
        <p className="mono accent">Selected work / Project index</p>
        <h1 id="projects-heading">
          Engineering in <em>practice.</em>
        </h1>
        <p>
          Developer tooling, cloud exploration and work in progress. Each project keeps its current
          status visible.
        </p>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => (
          <article
            key={project.slug}
            className={`project ${index === 0 ? 'featured' : ''}`}
            aria-labelledby={`${project.slug}-heading`}
          >
            <p className="project-top">
              <span className="mono">
                0{index + 1} / {project.category}
              </span>
            </p>
            <div className="project-visual">
              <ProjectDiagram type={project.diagram} />
            </div>
            <h2 className="project-title" id={`${project.slug}-heading`}>
              {project.title}
            </h2>
            <p className="project-summary">{project.summary}</p>
            <div className="tags">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <p className="project-status mono">{project.status}</p>
            <p className="project-summary">{project.detail}</p>
            {project.slug === 'release-log' ? (
              <Link className="small-link" to="/projects/release-log">
                Read the Release Log case study <span aria-hidden="true">→</span>
              </Link>
            ) : project.repository.visibility === 'public' ? (
              <a
                className="small-link"
                href={project.repository.url}
                target="_blank"
                rel="noreferrer"
              >
                Read the {project.title} README <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <p className="mono muted">Private · source unavailable</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
