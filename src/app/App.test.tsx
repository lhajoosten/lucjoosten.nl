import { render, screen } from '@testing-library/react';
import { Link, MemoryRouter } from 'react-router';
import { expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { App } from './App';

test('renders the supplied professional positioning and real homepage destinations', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('I build software');
  expect(screen.getByText(/Currently engineering at Crowe Netherlands/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Explore my work' })).toHaveAttribute(
    'href',
    '#projects',
  );
  expect(screen.queryByRole('link', { name: /ReviewBot/ })).not.toBeInTheDocument();
});

test('unknown routes offer an accessible route home', () => {
  render(
    <MemoryRouter initialEntries={['/missing']}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('This path ends here');
  expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
  expect(document.title).toBe('Page not found — Luc Joosten');
});

test('projects retain reviewed status and expose only the available case study', () => {
  render(
    <MemoryRouter initialEntries={['/projects']}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getAllByRole('article')).toHaveLength(3);
  expect(screen.getByText('Planning · documentation only')).toBeInTheDocument();
  expect(screen.getByText('Private · source unavailable')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Read the Release Log case study' })).toHaveAttribute(
    'href',
    '/projects/release-log',
  );
  expect(screen.getByRole('link', { name: 'Read the Azure AI Workbench README' })).toHaveAttribute(
    'href',
    'https://github.com/lhajoosten/azure-ai-workbench',
  );
  expect(screen.queryByRole('link', { name: /ReviewBot/ })).not.toBeInTheDocument();
});

test('route changes update metadata, clear not-found directives and focus the destination', async () => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={['/projects']}>
      <App />
      <Link to="/projects/missing">Unknown project</Link>
    </MemoryRouter>,
  );
  await user.click(screen.getByRole('link', { name: 'Read the Release Log case study' }));
  expect(document.title).toBe('Release Log — Luc Joosten');
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://lucjoosten.nl/projects/release-log',
  );
  expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://lucjoosten.nl/projects/release-log',
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
  expect(screen.getByText(/Source-project tests were not executed/)).toBeInTheDocument();
  await user.click(screen.getByRole('link', { name: 'Unknown project' }));
  expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  expect(document.querySelector('meta[property="og:url"]')).toBeNull();
  expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await user.click(screen.getByRole('link', { name: 'Back to home' }));
  expect(document.title).toBe('Luc Joosten — Software Engineer | AI & Full-Stack');
  expect(document.querySelector('meta[name="robots"]')).toBeNull();
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://lucjoosten.nl/',
  );
  expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
    'content',
    document.title,
  );
});
