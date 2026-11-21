import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const sha = /^[a-f0-9]{40}$/u;

export function checkReleaseProposal(event, expectedBotId, repository = process.cwd()) {
  const pull = event.pull_request;
  if (pull?.base?.ref !== 'main' || pull.head?.ref !== 'release-log/main') return;

  const repositoryId = event.repository?.id;
  if (
    !/^[1-9][0-9]*$/u.test(expectedBotId ?? '') ||
    String(pull.user?.id) !== expectedBotId ||
    !Number.isSafeInteger(repositoryId) ||
    pull.head.repo?.id !== repositoryId
  ) {
    throw new Error('Only the configured Release Log bot may propose releases from this branch.');
  }

  const base = pull.base.sha;
  const head = pull.head.sha;
  if (!sha.test(base) || !sha.test(head)) {
    throw new Error('The release proposal event must provide exact base and head commits.');
  }

  const object = execFileSync('git', ['cat-file', 'commit', head], {
    cwd: repository,
    encoding: 'utf8',
    timeout: 10_000,
  });
  const separator = object.indexOf('\n\n');
  const message = object.slice(separator + 2);
  const marker = /\n\nRelease-Log-Proposal:\n((?:[A-Za-z0-9_-]{1,72}\n)+)$/u.exec(message)?.[1];
  if (!marker || marker.length > 32_768) {
    throw new Error(
      'The release branch head lacks a generated proposal marker. Let Release Log refresh it.',
    );
  }

  const encoded = marker.replaceAll('\n', '');
  const identity = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  if (
    !identity ||
    identity.schemaVersion !== 1 ||
    identity.repositoryId !== repositoryId ||
    identity.releaseBranch !== pull.base.ref ||
    String(identity.botUserId) !== expectedBotId ||
    !pull.body?.startsWith(`<!-- release-log:proposal:v1 ${encoded} -->`)
  ) {
    throw new Error('The generated proposal marker differs from the pull request or repository.');
  }

  const parents = object.slice(0, separator).match(/^parent [a-f0-9]{40}$/gmu) ?? [];
  const expectedParents = [`parent ${base}`];
  if (identity.previousHeadSha !== null && identity.previousHeadSha !== base) {
    if (!sha.test(identity.previousHeadSha)) {
      throw new Error('The generated proposal marker has an invalid previous head.');
    }
    expectedParents.push(`parent ${identity.previousHeadSha}`);
  }
  if (identity.sourceSha !== base || parents.join('\n') !== expectedParents.join('\n')) {
    throw new Error(
      'The release proposal is stale or was merged with main. Let Release Log refresh it.',
    );
  }
}

if (import.meta.main) {
  checkReleaseProposal(
    JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')),
    process.env.RELEASE_BOT_USER_ID,
  );
}
