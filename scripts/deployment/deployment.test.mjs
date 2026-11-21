import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { guard } from './guard.mjs';
import { documents, smoke } from './smoke.mjs';

const sha = 'a'.repeat(40);
const repository = 'lhajoosten/lucjoosten.nl';
function state() {
  return {
    '/actions/runs/1': {
      name: 'Quality',
      path: '.github/workflows/quality.yml',
      event: 'push',
      head_branch: 'main',
      status: 'completed',
      conclusion: 'success',
      head_sha: sha,
      head_repository: { full_name: repository },
    },
    '/git/ref/heads/main': { object: { sha } },
    '/environments/production': {
      protection_rules: [{ type: 'branch_policy' }],
      deployment_branch_policy: { custom_branch_policies: true, protected_branches: false },
    },
    '/environments/production/deployment-branch-policies?per_page=100': {
      branch_policies: [{ name: 'main', type: 'branch' }],
    },
  };
}
const check = (data, workflowSha = sha) =>
  guard({ repository, sha, workflowSha, runId: 1, github: async (path) => data[path] });

test('successful current main with main-only policy can deploy automatically', async () => {
  await check(state());
});
for (const [name, field, value] of [
  ['failed CI', 'conclusion', 'failure'],
  ['PR checks', 'event', 'pull_request'],
  ['other branch', 'head_branch', 'feature'],
  ['other workflow', 'path', '.github/workflows/other.yml'],
  ['other repository', 'head_repository', { full_name: 'someone/fork' }],
])
  test(`rejects ${name}`, async () => {
    const data = state();
    data['/actions/runs/1'][field] = value;
    await assert.rejects(check(data));
  });
test('rejects a stale run and workflow/deployment SHA mismatch', async () => {
  const data = state();
  data['/git/ref/heads/main'].object.sha = 'b'.repeat(40);
  await assert.rejects(check(data), /stale/);
  await assert.rejects(check(state(), 'b'.repeat(40)));
});
test('rejects broad environment branch policies', async () => {
  const data = state();
  data['/environments/production/deployment-branch-policies?per_page=100'].branch_policies.push({
    name: '*',
    type: 'branch',
  });
  await assert.rejects(check(data), /only the main/);
});

const expected = [
  {
    path: '/',
    title: '<title>Home</title>',
    canonical: '<link rel="canonical" href="https://lucjoosten.nl/" />',
    heading: '<h1>Home</h1>',
  },
];
const homepage = expected[0].title + expected[0].canonical + expected[0].heading;
const missing = '<meta name="robots" content="noindex" />This path ends here';
test('discovers new generated page routes without treating 404 as a valid page', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'portfolio-smoke-'));
  try {
    await mkdir(join(directory, 'about'));
    await writeFile(join(directory, 'index.html'), homepage);
    await writeFile(join(directory, 'about/index.html'), homepage);
    await writeFile(join(directory, '404.html'), missing);
    assert.deepEqual((await documents(directory)).map((page) => page.path).sort(), ['/', '/about']);
    await writeFile(join(directory, 'about/index.html'), '<h1>Incomplete</h1>');
    await assert.rejects(documents(directory), /Incomplete static/);
  } finally {
    await rm(directory, { recursive: true });
  }
});
const request = async (url) =>
  url.pathname === '/' ? new Response(homepage) : new Response(missing, { status: 404 });
test('smoke verifies content, metadata and real 404', async () => {
  await smoke('https://example.vercel.app', expected, { request });
});
test('smoke rejects a SPA fallback 200 for unknown URLs', async () => {
  await assert.rejects(
    smoke('https://example.vercel.app', expected, { request: async () => new Response(homepage) }),
    /404/,
  );
});
test('smoke rejects wrong content and prevents credential forwarding to another origin', async () => {
  await assert.rejects(
    smoke('https://example.vercel.app', expected, {
      request: async () => new Response('<h1>Wrong</h1>'),
    }),
    /smoke failed/,
  );
  await assert.rejects(
    smoke('https://example.vercel.app', expected, {
      bypass: 'fixture',
      request: async () =>
        new Response('', { status: 302, headers: { location: 'https://login.example.com' } }),
    }),
    /outside/,
  );
});
