# Production deployment

The proposed `Production` GitHub Actions workflow replaces automatic Vercel Git deployment of main. PR previews remain enabled and independent of Quality. The workflow uses the successful main **push** Quality run, requires approval, builds its exact SHA, stages a production-target build, smoke-tests it, promotes it and checks the public site.

## Before merging the cutover PR

The workflow PR is intentionally a draft until these prerequisites are complete. No GitHub environment existed during read-only inspection on 2026-11-15, and no settings or secrets were changed.

1. Create a GitHub environment named `production`. Add at least one required reviewer. Configure **selected branches and tags** with exactly one **branch** rule named `main`; no tag rule or wildcard. Confirm that required reviewer protection is enforced by the account/plan. Keep administrative bypass restricted by owner policy; the workflow itself never bypasses approval.
2. In that environment, configure `VERCEL_TOKEN` with the narrowest supported scope that can build, deploy and promote project `lucjoosten-nl` in team `lhajoosten-dev`. Configure `VERCEL_AUTOMATION_BYPASS_SECRET` for smoke requests against the protected staged deployment. Configure values directly in the provider UI; never put tokens in chat, source, command arguments or logs. Do not use repository-wide secrets for these names.
3. Verify the workflow's fixed team/project IDs against the intended Vercel project. The CLI is pinned to `65.16.0`; action revisions were resolved from the existing v4 action lines and pinned. Review updates before changing pins. Vercel's CLI supports `VERCEL_TOKEN` authentication; no `--token` argument is used.
4. Confirm the `Quality` workflow remains enabled for pushes to main. This repository uses PR review as the merge gate. The production environment and token are the additional deployment gate.
5. Review and merge only with explicit owner approval. The PR changes `git.deploymentEnabled.main` to false, so that merge should stop the independent Git-triggered production release. Other branches default to enabled and retain previews. Leave the Vercel Git connection installed.
6. Wait for the merge SHA's main Quality run. The separate Production workflow runs preflight, then appears under GitHub Actions awaiting environment approval. Approve only the desired SHA. The environment job automatically creates a GitHub deployment record with the production URL; preflight requires its workflow SHA to equal the tested SHA.

Do not merge the cutover before setup: the guard will refuse production work, while automatic main deployment will already be disabled. The existing production deployment stays live during setup and while approval is pending.

## What happens after approval

The workflow rechecks Quality, main and environment protection, installs pinned tooling, pulls production configuration, builds the exact checked-out SHA and uploads it with `--prebuilt --prod --skip-domain`. Generated `.vercel/` state and any pulled configuration stay on the ephemeral runner and are excluded from Git. No secret-bearing artifacts are uploaded.

Smoke checks discover every generated directory index in `dist`, so future pages such as About are covered without duplicating a route list. They require each page's initial title, canonical and heading, plus the custom noindex HTTP 404 for an unknown path. Staging requests use a protection-bypass header only on same-origin HTTPS requests; cross-origin redirects fail without forwarding it. Public production checks use no bypass.

Immediately before promotion, the workflow rechecks current main and environment rules. Only the already staged production build is promoted. It then verifies `https://lucjoosten.nl`. If public verification fails, the job/deployment is marked failed and the result summary identifies the SHA and staged URL. There is no automatic rollback.

## Repository visibility

Use the README's **Production** workflow badge, the Actions tab, job summaries and the GitHub **production** environment/deployment history. A green Quality/PR preview check does not mean a production release occurred. The production badge may have no run data until the workflow reaches main and receives its first eligible completion event.

## Recovery

- A missing environment, reviewer, branch rule or credential fails before deployment. Complete setup, then re-run the successful current-main Quality workflow to produce a fresh eligible completion event. Production workflows are intentionally not manually dispatchable on arbitrary refs.
- If main advances while an older run waits for approval, reject/cancel that waiting run. A mistakenly approved older run fails its guard; the newer run can then proceed. Do not cancel during promotion; concurrency is configured to avoid doing so automatically.
- If staging/build/smoke fails before promotion, the existing production deployment remains live. Fix through a new reviewed PR and deploy the new successful main SHA.
- If public checks fail after promotion, inspect the exact deployment and make an explicit owner-approved rollback or fix-forward decision. Workflow reruns check current main again.
- Re-enabling automatic Vercel main deployments is a separate reviewed cutover, alongside disabling the Production workflow, to prevent duplicate releases. Never change DNS as part of workflow recovery.

Local guard/smoke tests and actionlint validate the code and workflow structure; they cannot prove GitHub approval or Vercel promotion end to end. The first live run needs separate explicit approval and must be recorded with its actual outcome.

References: [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration), [Vercel CLI deployment](https://vercel.com/docs/cli/deploy), [Vercel promotion](https://vercel.com/docs/cli/promote), [GitHub environment protection](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments).
