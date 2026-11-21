# ADR 0002 — gated production workflow

Status: proposed implementation approved for PR review on 2026-11-15; activation pending protected-environment setup, owner review and an explicitly approved merge/deployment.

## Context

Vercel Git integration builds previews and production independently of repository Quality. The owner wants a separate visible production workflow after merge. PR previews should remain available, and production needs explicit approval.

## Decision

Disable Git-triggered deployment for main only. After a successful main push Quality run, a separate Production workflow verifies the exact tested SHA is still current main and checks production environment protections. A required reviewer approves its environment job. Build for production, stage without assigning domains, verify generated pages and HTTP 404, recheck main, then promote the same build and verify the public domain. Record status, SHA and URL through GitHub environment deployments and job summaries, with a README badge.

Privileged work uses no PR artifacts or caches. The checked-out source and GitHub workflow SHA must match the successful Quality SHA. Credentials belong to the protected environment. Failed checks reject deployment rather than falling back to direct publication. No live deployment is performed while preparing the PR.

## Alternatives

Keeping automatic main deployment and merely observing its completion is simpler, but does not order deployment after Quality or enforce the requested approval gate. Vercel Deployment Checks can gate promotion while retaining Git builds; that remains a viable alternative if the owner prefers Vercel-managed release control. A GitHub workflow makes the requested release sequence and approvals directly visible in this repository.

## Consequences

Protected environment and Vercel credentials must exist before merging the cutover. Pending approval keeps the existing production deployment live. Staged verification checks the production build that will be promoted, at the cost of CLI setup and a second build after Quality. Repeated SHA checks and serialisation reject known stale runs but are not atomic across both services. Failed post-promotion checks require a human recovery decision; rollback is not automatic.

See the [spec](../spec/production-deployment.md) and [operations guide](../operations/production-deployment.md). The independent About PR has no dependency on this cutover.

## Promotion recovery — 2026-11-16

Keep the approved Quality, reviewer, staged-build and smoke-check sequence. Use a small Node helper for the promotion step only: call Vercel’s documented team-scoped promotion API and confirm that the canonical production domain maps to that exact deployment in the validated project. CLI 65.16.0 staged the production build successfully but failed promotion with a personal-user lookup error; its published context-resolution code reproduces that failure even with explicit team scope. Avoid broadening token access to a personal account to work around a team operation.

Before mutation, validate the fixed project/team and staged URL, READY production target and tested Git commit. Submit promotion once; an uncertain response requires inspection before any retry. Credentials remain protected environment variables, API requests refuse redirects and public smoke checks still follow confirmed promotion. This changes no reviewer protections, deploy targets or release triggers. The recovery PR’s local fixtures do not establish live promotion success; review and a separately approved workflow run remain required.

The first API-based live run promoted successfully but timed out in confirmation. Read-only inspection verified the production domain and completed aliases for the exact tested deployment. Use the domain mapping as serving-state evidence instead of requiring project job-status fields; retain failure detection when an explicit failed job belongs to the same deployment. The workflow still performs public content/metadata/HTTP checks afterward. This confirmation correction requires no repeat promotion of the already live deployment.

## Automatic deployments

The owner requested automatic production deployment after merge on 2026-11-21. Human review happens on the PR. After a successful main push Quality run, GitHub Actions can stage, verify and promote the exact current main commit automatically.

Remove the required reviewer rule from the GitHub `production` environment after the workflow change reaches main. Keep the exact main branch restriction and the environment-scoped credentials. The workflow continues to verify the staged build before promotion and the public site afterward. The [operations guide](../operations/production-deployment.md#enable-automatic-deployments) records the settings change and recovery steps.

Preflight rejects environment deployment gates before a job can wait for approval. Move the production concurrency group to the deploy job so eligible runs can pass preflight independently. Keep one active deploy job and one replaceable pending job so an active promotion can finish. Repeat the current-main check after the queue and immediately before promotion.
