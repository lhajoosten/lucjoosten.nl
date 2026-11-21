export const releaseLogRefsUrl =
  'https://api.github.com/repos/lhajoosten/rolling-release/git/matching-refs/tags/v';

// GitHub returns matching refs, not a list ordered by semantic version.
export function latestStableTag(data: unknown): string | null {
  if (!Array.isArray(data)) return null;
  const versions = data.flatMap((entry: unknown) => {
    if (typeof entry !== 'object' || entry === null || !('ref' in entry)) return [];
    if (typeof entry.ref !== 'string') return [];
    const match = /^refs\/tags\/(v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*))$/.exec(entry.ref);
    if (!match) return [];
    return [{ tag: match[1]!, parts: match.slice(2).map(BigInt) }];
  });
  versions.sort((left, right) => {
    for (let index = 0; index < 3; index++) {
      if (left.parts[index]! > right.parts[index]!) return -1;
      if (left.parts[index]! < right.parts[index]!) return 1;
    }
    return 0;
  });
  return versions[0]?.tag ?? null;
}

export async function resolveReleaseLogVersion(signal: AbortSignal): Promise<string | null> {
  try {
    const response = await fetch(releaseLogRefsUrl, {
      signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) return null;
    return latestStableTag(await response.json());
  } catch {
    return null;
  }
}
