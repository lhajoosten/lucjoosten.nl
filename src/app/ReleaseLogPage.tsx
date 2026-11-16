import { Link } from 'react-router';
import { releaseLog } from '../content/release-log';
import { projects } from '../content/projects';
import { ProjectDiagram } from '../components/ProjectDiagram';
import { ReleaseLogAvailability } from '../components/ReleaseLogAvailability';

export function ReleaseLogPage() {
  const project = projects[0];
  return (
    <article className="section site-container case-study" aria-labelledby="case-study-heading">
      <Link className="small-link" to="/projects">
        ← Back to projects
      </Link>
      <div className="case-intro">
        <div className="page-intro">
          <p className="mono accent">Developer tooling / Case study</p>
          <h1 id="case-study-heading">
            {releaseLog.title}
            <span className="accent">.</span>
          </h1>
          <p className="case-subtitle">{releaseLog.subtitle}</p>
          <p>{releaseLog.introduction}</p>
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
          <ProjectDiagram type="release" />
        </div>
      </div>
      <div className="case-body">
        <aside>
          <nav aria-label="Case study sections">
            <p className="mono muted">In this case study</p>
            <a href="#get-cli-heading">Get the CLI</a>
            {releaseLog.sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>
        <div className="case-prose">
          <ReleaseLogAvailability />
          {releaseLog.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
              <h2 id={`${section.id}-heading`}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
          <section className="case-source" aria-labelledby="source-heading">
            <h2 id="source-heading">Source & review</h2>
            <p>
              This case study is based only on the public README, reviewed{' '}
              <time dateTime={releaseLog.source.reviewed}>16 November 2026</time>. It describes the
              project at that revision. The latest stable tag above is resolved separately from
              public GitHub tags when this page is opened.
            </p>
            <a className="small-link" href={releaseLog.source.url} target="_blank" rel="noreferrer">
              Read the reviewed README <span aria-hidden="true">↗</span>
            </a>
            <p className="mono muted source-revision">Revision {releaseLog.source.revision}</p>
            <a
              className="btn secondary"
              href={project.repository.url}
              target="_blank"
              rel="noreferrer"
            >
              View repository <span aria-hidden="true">↗</span>
            </a>
          </section>
          <Link className="small-link" to="/projects">
            ← Back to projects
          </Link>
        </div>
      </div>
    </article>
  );
}
