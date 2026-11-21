# Production deployment workflow

This spec records the original cutover. The [automatic deployment decision](../adr/0002-gated-production-workflow.md#automatic-deployments) updates its manual approval requirement.

Status: owner approved the proposed flow and requested a separate PR on 2026-11-15. This authorizes implementation and review, not live configuration changes or a deployment. The owner explicitly requested both this and the About PR in the current session, with isolated branches. Base refreshed after the owner merged About PR #4: `c842370e56a33388f955c732056a33b4c35a6120`.

## Problem and scope

Vercel Git integration currently deploys PR branches as previews and main as production independently of the Quality workflow. Keep PR previews, but give production an explicit GitHub workflow and approval gate after main Quality succeeds. Display the production environment URL, workflow job summary and README status badge in the repository.

The workflow must deploy only the exact successful main push SHA, reject PR/foreign/failed workflow runs and stale commits, and verify the production environment has required reviewers and a main-only branch policy before any environment job or Vercel command. No environment exists at the time of inspection; setup is a documented merge prerequisite.

Stage a production-target build with domain assignment disabled. Verify all generated static pages against their initial title, canonical and heading plus an unknown route's real noindex HTTP 404. Recheck main before promoting that same build; verify public routes after promotion. Failure before promotion leaves production unchanged; failure after promotion is reported without automatic rollback. Serialise runs without cancelling an in-progress production operation.

Disable automatic Vercel Git deployment for main in this PR, preserving other branches and all routing. This cutover must not merge until protected environment/credentials are configured and reviewed. Document recovery and setup in [production operations](../operations/production-deployment.md). About/content changes, DNS, new services, token provisioning, live environment changes and deployments are excluded.

## Acceptance

- Production runs only after a successful main push Quality result and required human environment approval. It checks out and builds the tested SHA; GitHub's workflow/deployment SHA must match it.
- Reject stale main, missing approval rules, extra environment branch/tag policies, missing credentials and a smoke response containing wrong content or a fallback HTTP 200 for missing URLs.
- Keep secrets in protected environment secrets and pass Vercel authentication through environment variables. Avoid PR artifacts/caches in the privileged workflow. Use pinned action revisions and CLI version.
- Production status/URL and results are visible in GitHub. Preserve PR previews. No duplicate automatic main deployment after cutover.
- Run guard/smoke tests, formatting/lint/types/unit tests, build and workflow syntax checks. Live deployment cannot be claimed tested before explicit approval and execution.

There is a small unavoidable interval between the final GitHub main check and Vercel promotion. Serialisation and repeated checks reject known stale runs; they do not create an atomic transaction across GitHub and Vercel.

## Local verification — 2026-11-15

On the updated About merge base, `pnpm --config.verifyDepsBeforeRun=false check` passed formatting, lint, strict TypeScript, all 8 component/unit tests and all 12 deployment guard/smoke tests. `pnpm --config.verifyDepsBeforeRun=false build` generated four valid pages and the 404 document. The command-line override avoids pnpm trying to reinstall unchanged dependencies through the temporary worktree's shared node_modules symlink; no dependency inputs changed.

`actionlint` v1.7.12 (`-shellcheck= .github/workflows/production.yml`) passed; shellcheck was unavailable, so shellcheck integration was disabled. `git diff --check` passed. The pinned CLI's package code confirms VERCEL_TOKEN environment authentication. No live environment, credentials, staging deployment or production promotion was configured/executed; those remain explicit setup and activation prerequisites. Application/browser checks for the separately merged About change are recorded in its spec and PR #4.
