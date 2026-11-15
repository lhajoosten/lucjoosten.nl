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
