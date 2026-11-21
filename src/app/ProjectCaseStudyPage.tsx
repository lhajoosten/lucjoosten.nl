import { CaseStudyLayout } from './CaseStudyLayout';
import type { ProjectCaseStudy } from '../content/project-case-studies';

export function ProjectCaseStudyPage({ study }: { study: ProjectCaseStudy }) {
  const { project, sections, subtitle, source } = study;
  return (
    <CaseStudyLayout
      project={project}
      heading={project.title}
      introduction={
        <>
          <p className="case-subtitle">{subtitle}</p>
          <p>{project.summary}</p>
        </>
      }
      sections={sections}
    >
      {sections.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
          <h2 id={`${section.id}-heading`}>{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
      {source && (
        <section className="case-source" aria-labelledby="source-heading">
          <h2 id="source-heading">Source & review</h2>
          <p>
            README reviewed on{' '}
            <time dateTime={source.reviewed}>
              {new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(
                new Date(source.reviewed),
              )}
            </time>
            .
          </p>
          <a className="small-link" href={source.url}>
            Read the reviewed README
          </a>
          <p className="mono muted source-revision">Revision {source.revision}</p>
        </section>
      )}
      {project.repository.visibility === 'public' && (
        <p>
          <a className="btn secondary" href={project.repository.url}>
            View repository
          </a>
        </p>
      )}
    </CaseStudyLayout>
  );
}
