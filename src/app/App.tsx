import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router';
import { Header } from '../components/Header';
import { HomePage } from './HomePage';

const currentYear = new Date().getFullYear();

export function App() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  useEffect(() => {
    document.title = isHome
      ? 'Luc Joosten — Software Engineer | AI & Full-Stack'
      : 'Page not found — Luc Joosten';
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (isHome) canonical.setAttribute('href', 'https://lucjoosten.nl/');
      else canonical.removeAttribute('href');
    }
  }, [isHome]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header key={pathname} />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
