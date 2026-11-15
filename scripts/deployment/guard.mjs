import { appendFile, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function validateRun(run, repository, sha, workflowSha) {
  if (!/^[a-f0-9]{40}$/.test(sha ?? '')) throw new Error('Invalid deployment commit.');
  if (
    run.name !== 'Quality' ||
    run.path !== '.github/workflows/quality.yml' ||
    run.event !== 'push' ||
    run.head_branch !== 'main' ||
    run.status !== 'completed' ||
    run.conclusion !== 'success' ||
    run.head_repository?.full_name !== repository ||
    run.head_sha !== sha ||
    workflowSha !== sha
  )
    throw new Error('Only successful main push Quality runs at the workflow commit may deploy.');
}

export function validateEnvironment(environment, policies) {
  const reviewers = environment.protection_rules?.find(
    (rule) => rule.type === 'required_reviewers',
  );
  if (!reviewers?.reviewers?.length)
    throw new Error(
      'Configure required reviewers on the production environment before enabling deployment.',
    );
  if (
    environment.deployment_branch_policy?.custom_branch_policies !== true ||
    environment.deployment_branch_policy?.protected_branches !== false ||
    policies.length !== 1 ||
    policies[0].name !== 'main' ||
    policies[0].type !== 'branch'
  ) {
    throw new Error('The production environment must allow only the main branch.');
  }
}

export async function guard({ repository, sha, workflowSha, runId, github }) {
  const run = await github(`/actions/runs/${runId}`);
  validateRun(run, repository, sha, workflowSha);
  const main = await github('/git/ref/heads/main');
  if (main.object.sha !== sha) throw new Error('Main advanced; refusing a stale deployment.');
  const environment = await github('/environments/production');
  const policies = await github('/environments/production/deployment-branch-policies?per_page=100');
  validateEnvironment(environment, policies.branch_policies);
}

async function main() {
  const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository || !process.env.GH_TOKEN)
    throw new Error('GitHub repository and token are required.');
  const github = async (path) => {
    const response = await fetch(`https://api.github.com/repos/${repository}${path}`, {
      headers: {
        Authorization: `Bearer ${process.env.GH_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok)
      throw new Error(
        `GitHub guard request failed (${response.status}); check production environment setup and permissions.`,
      );
    return response.json();
  };
  const sha = event.workflow_run?.head_sha;
  await guard({
    repository,
    sha,
    workflowSha: process.env.WORKFLOW_SHA,
    runId: event.workflow_run?.id,
    github,
  });
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `sha=${sha}\n`);
  console.log(`Verified successful Quality, current main and production protections for ${sha}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
