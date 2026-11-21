import { releaseLog } from '../content/release-log';
import { projects } from '../content/projects';
import { CaseStudyLayout } from './CaseStudyLayout';
import { ReleaseLogAvailability } from '../components/ReleaseLogAvailability';

export function ReleaseLogPage() {
  const project = projects[0];
  return (
    <CaseStudyLayout
      project={project}
      heading={
        <>
          {project.title}
          <span className="accent">.</span>
        </>
      }
      introduction={
        <>
          <p className="case-subtitle">{releaseLog.subtitle}</p>
          <p>{releaseLog.introduction}</p>
        </>
      }
      sections={releaseLog.sections}
      firstSection={{ id: 'get-cli-heading', title: 'Get the CLI' }}
    >
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
          project at that revision. The latest stable tag above is resolved separately from public
          GitHub tags when this page is opened.
        </p>
        <a className="small-link" href={releaseLog.source.url} target="_blank" rel="noreferrer">
          Read the reviewed README <span aria-hidden="true">↗</span>
        </a>
        <p className="mono muted source-revision">Revision {releaseLog.source.revision}</p>
        <a className="btn secondary" href={project.repository.url} target="_blank" rel="noreferrer">
          View repository <span aria-hidden="true">↗</span>
        </a>
      </section>
    </CaseStudyLayout>
  );
}
