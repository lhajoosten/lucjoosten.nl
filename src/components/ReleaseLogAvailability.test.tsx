import { act, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { ReleaseLogAvailability } from './ReleaseLogAvailability';

test('keeps usage instructions available and resolves a new tag on a later visit', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([{ ref: 'refs/tags/v0.2.1' }])))
    .mockResolvedValueOnce(new Response(JSON.stringify([{ ref: 'refs/tags/v0.3.0' }])));
  vi.stubGlobal('fetch', fetchMock);
  const firstVisit = render(<ReleaseLogAvailability />);
  expect(screen.getByRole('link', { name: 'Run the published CLI' })).toHaveAttribute(
    'href',
    'https://github.com/lhajoosten/release-log/blob/main/README.md#run-the-published-cli',
  );
  expect(await screen.findByRole('link', { name: 'v0.2.1' })).toHaveAttribute(
    'href',
    'https://github.com/lhajoosten/release-log/tree/v0.2.1',
  );
  firstVisit.unmount();
  render(<ReleaseLogAvailability />);
  expect(await screen.findByRole('link', { name: 'v0.3.0' })).toBeInTheDocument();
});

test('aborts a stalled lookup after five seconds and retains the fallback', async () => {
  vi.useFakeTimers();
  let signal: AbortSignal | undefined;
  vi.stubGlobal(
    'fetch',
    vi.fn((_url: string, options: RequestInit) => {
      signal = options.signal as AbortSignal;
      return new Promise((_resolve, reject) => {
        signal!.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });
    }),
  );
  try {
    render(<ReleaseLogAvailability />);
    await act(() => vi.advanceTimersByTimeAsync(5000));
    expect(signal?.aborted).toBe(true);
    expect(screen.getByRole('link', { name: 'Browse version tags on GitHub' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Run the published CLI' })).toBeInTheDocument();
  } finally {
    vi.useRealTimers();
  }
});

test('cancels the lookup when leaving the page', () => {
  const fetchMock = vi.fn().mockReturnValue(new Promise(() => {}));
  vi.stubGlobal('fetch', fetchMock);
  const view = render(<ReleaseLogAvailability />);
  const signal = fetchMock.mock.calls[0]![1].signal as AbortSignal;
  view.unmount();
  expect(signal.aborted).toBe(true);
});
