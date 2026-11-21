import { ProjectCaseStudyPage } from './ProjectCaseStudyPage';
import { projectCaseStudies } from '../content/project-case-studies';
import { useEffect, useRef } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router';
import { Header } from '../components/Header';
import { HomePage } from './HomePage';
import { AboutPage } from './AboutPage';
import { ProjectsPage } from './ProjectsPage';
import { ReleaseLogPage } from './ReleaseLogPage';
import { updateMetadata } from './metadata';

const currentYear = new Date().getFullYear();

export function App() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    updateMetadata(pathname);
    if (previousPath.current !== pathname && !hash) {
      const heading = document.querySelector<HTMLElement>('main h1');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
    previousPath.current = pathname;
  }, [pathname, hash]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header key={pathname} />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route caseSensitive path="/" element={<HomePage />} />
          <Route caseSensitive path="/about" element={<AboutPage />} />
          <Route caseSensitive path="/projects" element={<ProjectsPage />} />
          <Route caseSensitive path="/projects/release-log" element={<ReleaseLogPage />} />
          {projectCaseStudies.map((study) => (
            <Route
              caseSensitive
              key={study.project.slug}
              path={`/projects/${study.project.slug}`}
              element={<ProjectCaseStudyPage study={study} />}
            />
          ))}
          <Route
            path="*"
            element={
              <section className="not-found site-container">
                <p className="mono accent">404 / Page not found</p>
                <h1>
                  This path ends here<span className="accent">.</span>
                </h1>
                <p>The page you’re looking for doesn’t exist.</p>
                <Link className="btn blue" to="/">
                  Back to home <span aria-hidden="true">↗</span>
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer className="footer site-container">
        <span className="mono">© {currentYear} Luc Joosten</span>
        <span className="mono">Designed for clarity. Built with intention.</span>
        <a className="mono" href="#top">
          Back to top ↑
        </a>
      </footer>
    </>
  );
}
