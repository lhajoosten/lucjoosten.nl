import { useEffect, useState } from 'react';
import { resolveReleaseLogVersion } from '../content/release-log-version';

export function ReleaseLogAvailability() {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    void resolveReleaseLogVersion(controller.signal).then((resolved) => {
      if (!controller.signal.aborted) setVersion(resolved);
      window.clearTimeout(timeout);
    });
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <section aria-labelledby="get-cli-heading">
      <h2 id="get-cli-heading">Get the CLI</h2>
      <p>Follow the upstream instructions for the published container and its verified digest.</p>
      <a
        className="btn secondary"
        href="https://github.com/lhajoosten/rolling-release/blob/main/README.md#run-the-published-cli"
        target="_blank"
        rel="noreferrer"
      >
        Run the published CLI <span aria-hidden="true">↗</span>
      </a>
      <p aria-live="polite" aria-atomic="true">
        {version ? (
          <>
            Latest stable tag:{' '}
            <a href={`https://github.com/lhajoosten/rolling-release/tree/${version}`}>{version}</a>.
            Container availability is listed in the upstream instructions.
          </>
        ) : (
          <a href="https://github.com/lhajoosten/rolling-release/tags">Browse version tags on GitHub</a>
        )}
      </p>
    </section>
  );
}
