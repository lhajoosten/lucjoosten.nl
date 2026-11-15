import { useSyncExternalStore } from 'react';

const storageKey = 'lucjoosten.theme';
type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#11171a' : '#f6f5f1');
}

function subscribe(notify: () => void) {
  const media = matchMedia('(prefers-color-scheme: dark)');
  let preference: string | null = null;
  try {
    preference = localStorage.getItem(storageKey);
  } catch {
    /* Storage can be disabled. */
  }
  let followsSystem = preference !== 'light' && preference !== 'dark';
  const systemTheme = (): Theme => (media.matches ? 'dark' : 'light');
  applyTheme(followsSystem ? systemTheme() : preference === 'dark' ? 'dark' : 'light');
  const onSystemChange = () => {
    if (followsSystem) {
      applyTheme(systemTheme());
      notify();
    }
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== null) return;
    followsSystem = event.newValue !== 'light' && event.newValue !== 'dark';
    applyTheme(followsSystem ? systemTheme() : event.newValue === 'dark' ? 'dark' : 'light');
    notify();
  };
  const onPreference = () => {
    followsSystem = false;
    notify();
  };
  media.addEventListener('change', onSystemChange);
  window.addEventListener('storage', onStorage);
  window.addEventListener('theme-preference', onPreference);
  return () => {
    media.removeEventListener('change', onSystemChange);
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('theme-preference', onPreference);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}
function getServerSnapshot(): Theme {
  return 'light';
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      /* Theme still works without persistence. */
    }
    window.dispatchEvent(new Event('theme-preference'));
  };
  return (
    <button
      className="icon-btn"
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☾' : '☼'}</span>
    </button>
  );
}
