import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

export async function promote({
  deploymentUrl,
  sha,
  teamId,
  projectId,
  token,
  request = fetch,
  sleep = delay,
  attempts = 36,
}) {
  const url = new URL(deploymentUrl);
  if (
    url.protocol !== 'https:' ||
    url.origin !== deploymentUrl ||
    !url.hostname.endsWith('.vercel.app') ||
    !/^team_[a-zA-Z0-9]+$/.test(teamId ?? '') ||
    !/^prj_[a-zA-Z0-9]+$/.test(projectId ?? '') ||
    !/^[a-f0-9]{40}$/.test(sha ?? '') ||
    !token
  )
    throw new Error('Valid staged URL, tested SHA, team, project and token are required.');

  const api = async (path, method = 'GET') => {
    const response = await request(`https://api.vercel.com${path}?teamId=${teamId}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      ...(method === 'POST' ? { body: '{}' } : {}),
      redirect: 'error',
      signal: AbortSignal.timeout(30_000),
    });
    // Never echo API response bodies, credentials or retry an uncertain POST.
    if (!response.ok) throw new Error(`Vercel ${method} ${path} failed (${response.status}).`);
    return method === 'POST' ? null : response.json();
  };
  const projectPath = `/v9/projects/${projectId}`;
  const project = await api(projectPath);
  if (project.id !== projectId || project.accountId !== teamId)
    throw new Error('Vercel project/team mismatch.');
  const deployment = await api(`/v13/deployments/${url.hostname}`);
  if (
    !/^dpl_[a-zA-Z0-9]+$/.test(deployment.id ?? '') ||
    deployment.projectId !== projectId ||
    deployment.url !== url.hostname ||
    deployment.target !== 'production' ||
    deployment.readyState !== 'READY' ||
    deployment.meta?.githubCommitSha !== sha
  )
    throw new Error('Staged deployment must be READY production for the tested project and SHA.');

  await api(`/v10/projects/${projectId}/promote/${deployment.id}`, 'POST');
  for (let attempt = 0; attempt < attempts; attempt++) {
    const current = await api(projectPath);
    if (current.id !== projectId || current.accountId !== teamId)
      throw new Error('Vercel project/team changed while waiting for promotion.');
    const status = current.lastAliasRequest;
    if (status?.toDeploymentId === deployment.id) {
      if (status.jobStatus === 'failed') throw new Error('Production alias promotion failed.');
      if (status.jobStatus === 'succeeded') {
        console.log(`Promoted verified deployment ${deployment.id} at ${sha}.`);
        return;
      }
    }
    if (attempt + 1 < attempts) await sleep(5000);
  }
  throw new Error('Promotion completion was not confirmed; inspect Vercel before retrying.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  promote({
    deploymentUrl: process.env.DEPLOYMENT_URL,
    sha: process.env.DEPLOY_SHA,
    teamId: process.env.VERCEL_ORG_ID,
    projectId: process.env.VERCEL_PROJECT_ID,
    token: process.env.VERCEL_TOKEN,
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
