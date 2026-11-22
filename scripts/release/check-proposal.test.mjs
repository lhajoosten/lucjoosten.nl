import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { checkReleaseProposal } from './check-proposal.mjs';

test('required Quality check accepts generated heads and blocks manual or stale heads', (t) => {
  const repository = mkdtempSync(join(tmpdir(), 'website-release-proposal-'));
  t.after(() => rmSync(repository, { recursive: true, force: true }));
  const git = (args, input) =>
    execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', ...args], {
      cwd: repository,
      encoding: 'utf8',
      input,
    }).trim();
  git(['init', '--quiet']);
  const tree = git(['mktree'], '');
  const commit = (message, ...parents) =>
    git(['commit-tree', tree, ...parents.flatMap((parent) => ['-p', parent])], message);

  const source = commit('main');
  const newer = commit('ordinary merge', source);
  const marker = (sourceSha, previousHeadSha, seriesId) =>
    Buffer.from(
      JSON.stringify({
        schemaVersion: 1,
        repositoryId: 17,
        releaseBranch: 'main',
        seriesId,
        botUserId: 35,
        sourceSha,
        previousHeadSha,
      }),
    ).toString('base64url');
  const generated = (sourceSha, previousHeadSha = null, seriesId) => {
    const identity = marker(sourceSha, previousHeadSha, seriesId);
    const message = `chore: prepare v0.1.0\n\nRelease-Log-Proposal:\n${identity.match(/.{1,72}/gu).join('\n')}\n`;
    return {
      sha: commit(message, sourceSha, ...(previousHeadSha ? [previousHeadSha] : [])),
      body: `<!-- release-log:proposal:v1 ${identity} -->\n`,
    };
  };

  const initial = generated(source);
  const refresh = generated(newer, initial.sha);
  const event = (
    head,
    baseSha = newer,
    userId = 35,
    headRepositoryId = 17,
    ref = 'release-log/main',
  ) => ({
    repository: { id: 17 },
    pull_request: {
      base: { ref: 'main', sha: baseSha },
      body: head.body,
      head: { ref, sha: head.sha, repo: { id: headRepositoryId } },
      user: { id: userId },
    },
  });

  assert.doesNotThrow(() => checkReleaseProposal(event(initial, source), '35', repository));
  assert.doesNotThrow(() => checkReleaseProposal(event(refresh), '35', repository));
  assert.throws(() => checkReleaseProposal(event(initial), '35', repository), /stale/);
  const manualMerge = commit("Merge branch 'main' into release-log/main", initial.sha, newer);
  assert.throws(
    () => checkReleaseProposal(event({ ...initial, sha: manualMerge }), '35', repository),
    /generated proposal marker/,
  );
  assert.throws(
    () => checkReleaseProposal(event({ ...refresh, body: initial.body }), '35', repository),
    /marker/,
  );
  assert.throws(() => checkReleaseProposal(event(refresh, newer, 78), '35', repository), /bot/);
  assert.throws(() => checkReleaseProposal(event(refresh, newer, 35, 78), '35', repository), /bot/);

  const fresh = generated(newer, null, 'ground-zero');
  const freshRef = 'release-log-series/ground-zero/main';
  assert.doesNotThrow(() =>
    checkReleaseProposal(event(fresh, newer, 35, 17, freshRef), '35', repository),
  );
  assert.throws(
    () => checkReleaseProposal(event(refresh, newer, 35, 17, freshRef), '35', repository),
    /marker differs/,
  );
  assert.throws(
    () =>
      checkReleaseProposal(
        event(fresh, newer, 35, 17, 'release-log-series/wrong/main'),
        '35',
        repository,
      ),
    /marker differs/,
  );
  assert.throws(
    () =>
      checkReleaseProposal(
        event({ ...fresh, sha: manualMerge }, newer, 35, 17, freshRef),
        '35',
        repository,
      ),
    /generated proposal marker/,
  );
});
