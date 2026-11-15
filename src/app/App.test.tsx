import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { expect, test } from 'vitest';
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
