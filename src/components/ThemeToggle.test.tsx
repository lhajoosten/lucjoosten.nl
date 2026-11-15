import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

test('persists an explicit preference and restores it on remount', async () => {
  const user = userEvent.setup();
  const { unmount } = render(<ThemeToggle />);
  await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  expect(localStorage.getItem('lucjoosten.theme')).toBe('dark');
  unmount();
  render(<ThemeToggle />);
  expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
});

test('uses the system preference and follows changes until a user chooses', async () => {
  const media = new EventTarget();
  const query = Object.assign(media, { matches: true });
  vi.stubGlobal('matchMedia', () => query);
  render(<ThemeToggle />);
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  query.matches = false;
  act(() => {
    query.dispatchEvent(new Event('change'));
  });
  expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
  act(() => {
    query.dispatchEvent(new Event('change'));
  });
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
});

test('works when browser storage is blocked', async () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('Blocked');
  });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Blocked');
  });
  render(<ThemeToggle />);
  await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
});

test('reflects a preference changed in another tab', () => {
  render(<ThemeToggle />);
  fireEvent(window, new StorageEvent('storage', { key: 'lucjoosten.theme', newValue: 'dark' }));
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
});
