import { Link } from 'react-router';
import { useRef, useState } from 'react';
import { projectCatalog, projects } from '../content/projects';
import type { Project } from '../content/projects';
import { ProjectDiagram } from './ProjectDiagram';

export function Projects() {
  const [selected, setSelected] = useState<Project>(projectCatalog['release-log']);
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <div className="project-grid">
        {projects.map((project, index) => (
          <button
            key={project.slug}
            type="button"
            className={`project ${index === 0 ? 'featured' : ''}`}
            aria-haspopup="dialog"
            aria-label={`Read about ${project.title}`}
            onClick={() => {
              setSelected(project);
              dialog.current?.showModal();
            }}
          >
            <span className="project-top">
              <span className="mono">
                0{index + 1} / {project.category}
              </span>
              <span className="arrow" aria-hidden="true">
                ↗
              </span>
            </span>
            <span className="project-visual">
              <ProjectDiagram type={project.diagram} />
            </span>
            <span className="project-title">{project.title}</span>
            <span className="project-summary">{project.summary}</span>
            <span className="tags">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </span>
            <span className="project-status mono">{project.status}</span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="project-dialog"
        aria-labelledby="project-title"
        aria-describedby="project-description"
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]');
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        <div className="dialog-head">
          <span className="mono muted">Selected project / overview</span>
          <button
            className="icon-btn"
            type="button"
            aria-label="Close project details"
            onClick={() => dialog.current?.close()}
          >
            ×
          </button>
        </div>
        <h2 id="project-title">{selected.title}</h2>
        <p id="project-description">{selected.detail}</p>
        <dl>
          <dt>Status</dt>
          <dd>{selected.status}</dd>
          <dt>Repository</dt>
          <dd>
            {selected.repository.visibility === 'public'
              ? 'Public'
              : 'Private · source unavailable'}
          </dd>
        </dl>
        <Link className="btn secondary" to={`/projects/${selected.slug}`}>
          Read the case study <span aria-hidden="true">→</span>
        </Link>
        {selected.repository.visibility === 'public' && (
          <a className="btn blue" href={selected.repository.url} target="_blank" rel="noreferrer">
            Read the project README <span aria-hidden="true">↗</span>
          </a>
        )}
      </dialog>
    </>
  );
}
