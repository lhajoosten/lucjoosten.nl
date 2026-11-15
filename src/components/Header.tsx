import { Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { navigation } from '../content/home';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const media = matchMedia('(min-width: 651px)');
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener('change', closeOnDesktop);
    return () => media.removeEventListener('change', closeOnDesktop);
  }, []);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);
  return (
    <header id="top">
      <div className="topbar site-container">
        <a className="brand" href="/" aria-label="Luc Joosten homepage">
          luc<span>.</span>joosten
        </a>
        <nav className="nav" aria-label="Main navigation">
          {navigation.map((item) =>
            item.href === '/projects' ? (
              <Link key={item.label} to={item.href}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ),
          )}
        </nav>
        <div className="nav-tools">
          <span className="mono muted region">NL / EU</span>
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            className="icon-btn menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-controls="mobile-navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span aria-hidden="true">{open ? '×' : '☰'}</span>
          </button>
        </div>
      </div>
      <nav
        className="mobile-menu site-container"
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {navigation.map((item) =>
          item.href === '/projects' ? (
            <Link key={item.label} to={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ) : (
            <a key={item.label} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ),
        )}
      </nav>
    </header>
  );
}
