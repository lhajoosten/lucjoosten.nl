import { CaseStudyLayout } from './CaseStudyLayout';
import type { projectCaseStudies } from '../content/project-case-studies';

export function ProjectCaseStudyPage({ study }: { study: (typeof projectCaseStudies)[number] }) {
  const { project, sections } = study;
  return (
    <CaseStudyLayout
      project={project}
      heading={project.title}
      introduction={<p>{project.summary}</p>}
      sections={sections}
    >
      {sections.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
          <h2 id={`${section.id}-heading`}>{section.title}</h2>
          <p>{section.text}</p>
        </section>
      ))}
      {'source' in study && (
        <section className="case-source" aria-labelledby="source-heading">
          <h2 id="source-heading">Source & review</h2>
          <p>
            README reviewed on <time dateTime={study.source.reviewed}>21 November 2026</time>.
          </p>
          <a className="small-link" href={study.source.url}>
            Read the reviewed README
          </a>
          <p className="mono muted source-revision">Revision {study.source.revision}</p>
        </section>
      )}
    </CaseStudyLayout>
  );
}
