import { expect, test, vi } from 'vitest';
import {
  latestStableTag,
  releaseLogRefsUrl,
  resolveReleaseLogVersion,
} from './release-log-version';

test('chooses the highest stable semantic version rather than ref order', () => {
  const refs = ['v0.9.0', 'v0.3.0', 'v0.10.0', 'v0.2.1', 'v0.11.0-rc.1', 'v01.0.0', 'latest'];
  expect(latestStableTag(refs.map((tag) => ({ ref: `refs/tags/${tag}` })))).toBe('v0.10.0');
  expect(latestStableTag([{ ref: 'refs/tags/v1.0.0' }, { ref: 'refs/tags/v0.99.0' }])).toBe(
    'v1.0.0',
  );
  expect(latestStableTag([{ ref: 'refs/tags/v0.3.1' }, { ref: 'refs/tags/v0.3.0' }])).toBe(
    'v0.3.1',
  );
});

test.each([null, {}, [], [null, {}, { ref: 3 }], [{ ref: 'refs/tags/v0.3.0-rc.1' }]])(
  'returns no version for invalid or empty data: %j',
  (data) => expect(latestStableTag(data)).toBeNull(),
);

test('resolves public tags without credentials or a referrer', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(new Response(JSON.stringify([{ ref: 'refs/tags/v0.3.0' }])));
  vi.stubGlobal('fetch', fetchMock);
  const signal = new AbortController().signal;
  expect(await resolveReleaseLogVersion(signal)).toBe('v0.3.0');
  expect(fetchMock).toHaveBeenCalledWith(releaseLogRefsUrl, {
    signal,
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    headers: { Accept: 'application/vnd.github+json' },
  });
});

test.each([new Response('', { status: 403 }), new Response('invalid json')])(
  'falls back when GitHub rate limits or returns invalid JSON',
  async (response) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    expect(await resolveReleaseLogVersion(new AbortController().signal)).toBeNull();
  },
);

test('falls back on network or abort errors', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network unavailable')));
  expect(await resolveReleaseLogVersion(new AbortController().signal)).toBeNull();
});
