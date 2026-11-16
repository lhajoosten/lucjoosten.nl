import assert from 'node:assert/strict';
import { test } from 'node:test';
import { promote } from './promote.mjs';

const settings = {
  deploymentUrl: 'https://portfolio-test.vercel.app',
  sha: 'a'.repeat(40),
  teamId: 'team_test',
  projectId: 'prj_test',
  token: 'synthetic-test-token',
  attempts: 2,
  sleep: async () => {},
};
function fixture({
  deployment = {},
  project = {},
  statuses = ['succeeded'],
  postStatus = 201,
} = {}) {
  const calls = [];
  let reads = 0;
  const request = async (input, options) => {
    const url = new URL(input);
    calls.push({ url, options });
    assert.equal(url.origin, 'https://api.vercel.com');
    assert.equal(url.searchParams.get('teamId'), settings.teamId);
    // A team token may have project/deployment access without personal-user access.
    if (url.pathname === '/v2/user') return new Response('', { status: 404 });
    if (url.pathname === '/v9/projects/prj_test') {
      const jobStatus = reads++ === 0 ? undefined : statuses.shift();
      return Response.json({
        id: 'prj_test',
        accountId: 'team_test',
        lastAliasRequest: { toDeploymentId: 'dpl_test', jobStatus },
        ...project,
      });
    }
    if (url.pathname === '/v13/deployments/portfolio-test.vercel.app')
      return Response.json({
        id: 'dpl_test',
        projectId: 'prj_test',
        url: 'portfolio-test.vercel.app',
        target: 'production',
        readyState: 'READY',
        meta: { githubCommitSha: settings.sha },
        ...deployment,
      });
    assert.equal(url.pathname, '/v10/projects/prj_test/promote/dpl_test');
    assert.equal(options.method, 'POST');
    return new Response('', { status: postStatus });
  };
  return { calls, request };
}

test('promotes with team-only API access, then waits for the exact deployment', async () => {
  const { calls, request } = fixture({ statuses: ['pending', 'succeeded'] });
  await promote({ ...settings, request });
  assert.equal(calls.length, 5);
  assert.equal(calls.filter(({ options }) => options.method === 'POST').length, 1);
  assert.ok(calls.every(({ url }) => url.pathname !== '/v2/user'));
  for (const { options } of calls) {
    assert.equal(options.headers.Authorization, `Bearer ${settings.token}`);
    assert.equal(options.redirect, 'error');
  }
});

for (const deployment of [
  { target: 'preview' },
  { readyState: 'ERROR' },
  { projectId: 'prj_other' },
  { meta: { githubCommitSha: 'b'.repeat(40) } },
  { url: 'other.vercel.app' },
])
  test(`rejects a mismatched staged deployment: ${JSON.stringify(deployment)}`, async () => {
    const { calls, request } = fixture({ deployment });
    await assert.rejects(promote({ ...settings, request }), /Staged deployment/);
    assert.ok(calls.every(({ options }) => options.method !== 'POST'));
  });

test('rejects a different owning team before any mutation', async () => {
  const { calls, request } = fixture({ project: { accountId: 'team_other' } });
  await assert.rejects(promote({ ...settings, request }), /project\/team mismatch/);
  assert.equal(calls.length, 1);
});

test('does not retry a rejected or uncertain promotion request', async () => {
  const { calls, request } = fixture({ postStatus: 403 });
  await assert.rejects(promote({ ...settings, request }), /failed \(403\)/);
  assert.equal(calls.filter(({ options }) => options.method === 'POST').length, 1);
  let posts = 0;
  await assert.rejects(
    promote({
      ...settings,
      request: async (url, options) => {
        if (options.method === 'POST') {
          posts++;
          throw new Error('Connection lost');
        }
        return request(url, options);
      },
    }),
    /Connection lost/,
  );
  assert.equal(posts, 1);
});

test('rejects failed aliasing and does not mistake a different promotion for success', async () => {
  await assert.rejects(
    promote({ ...settings, request: fixture({ statuses: ['failed'] }).request }),
    /alias promotion failed/,
  );
  await assert.rejects(
    promote({
      ...settings,
      request: fixture({
        project: {
          lastAliasRequest: { toDeploymentId: 'dpl_other', jobStatus: 'succeeded' },
        },
      }).request,
    }),
    /not confirmed/,
  );
});
