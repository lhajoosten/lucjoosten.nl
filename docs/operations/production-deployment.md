# Production deployment

The `Production` GitHub Actions workflow uses a successful main **push** Quality run to build its exact SHA, stage a production-target build, smoke-test it, promote it and check the public site. Vercel handles previews for PR branches. Its Git-triggered deployment for main is disabled in `vercel.json`.

## Enable automatic deployments

1. Merge the reviewed workflow change. Until the GitHub setting is updated, preflight reports the deployment gate and stops before the environment job.
2. In GitHub Actions, cancel any old Production runs that are still waiting for review or pending behind them. Let an active promotion finish.
3. Under **Settings → Environments → production**, clear **Required reviewers** and save. Keep **Selected branches and tags** with exactly one **branch** rule named `main`. Keep the environment secrets and administrative bypass setting.
4. Re-run Quality for the current main SHA and verify that Production completes automatically.

For a new environment, configure `VERCEL_TOKEN` for Vercel project `lucjoosten-nl` in team `lhajoosten-dev` and `VERCEL_AUTOMATION_BYPASS_SECRET` for staged smoke requests. Store both as `production` environment secrets. Confirm the workflow's fixed team and project IDs against Vercel before running it.

## Deployment sequence

The workflow rechecks Quality, main and environment protection, installs pinned tooling, pulls production configuration, builds the exact checked-out SHA and uploads it with `--prebuilt --prod --skip-domain`. Generated `.vercel/` state and any pulled configuration stay on the ephemeral runner and are excluded from Git. No secret-bearing artifacts are uploaded.

Smoke checks discover every generated directory index in `dist`, so future pages such as About are covered without duplicating a route list. They require each page's initial title, canonical and heading, plus the custom noindex HTTP 404 for an unknown path. Staging requests use a protection-bypass header only on same-origin HTTPS requests; cross-origin redirects fail without forwarding it. Public production checks use no bypass.

Immediately before promotion, the workflow rechecks current main and environment rules. Only the already staged production build is promoted. The Node promotion helper uses Vercel’s team-scoped REST API, verifies project ownership and the READY production deployment’s exact URL/project/tested commit, requests promotion once and waits up to about three minutes for `lucjoosten.nl` to map to that deployment in the same project without a redirect. A completed project job status alone cannot confirm serving state; missing job-status fields do not prevent confirmation through the domain mapping. An explicit failed job for the same deployment still stops the workflow. It never rebuilds a preview or retries an uncertain promotion request. It then verifies `https://lucjoosten.nl`. If public verification fails, the job/deployment is marked failed and the result summary identifies the SHA and staged URL. There is no automatic rollback.

## Repository visibility

Use the README's **Production** workflow badge, the Actions tab, job summaries and the GitHub **production** environment/deployment history. A green Quality/PR preview check does not mean a production release occurred.

## Recovery

- A missing environment, branch rule or credential fails before deployment. Complete setup, then re-run the successful current-main Quality workflow to produce a fresh eligible completion event. Production workflows are intentionally not manually dispatchable on arbitrary refs.
- If main advances, the guard rejects older SHAs before staging or promotion. Let any promotion already underway finish. Only runs that pass preflight enter the deployment queue. GitHub keeps one active deploy job and replaces its pending job when another arrives.
- If staging/build/smoke fails before promotion, the existing production deployment remains live. Fix through a new reviewed PR and deploy the new successful main SHA.
- If promotion fails with `User not found. (404)` under CLI 65.16.0 after staging succeeds, the CLI’s personal-user lookup can fail despite valid team project access. Do not rotate working credentials merely on that evidence. The promotion helper calls the [production promotion API](https://vercel.com/docs/rest-api/projects/point-production-traffic-to-a-given-deployment) with the fixed team ID and avoids that lookup. Inspect the staged deployment and alias status before any retry after a network error or timeout; the server may already have accepted the request.
- If public checks fail after promotion, inspect the exact deployment and make an explicit owner-approved rollback or fix-forward decision. Workflow reruns check current main again.
- Re-enabling automatic Vercel main deployments is a separate reviewed cutover, alongside disabling the Production workflow, to prevent duplicate releases. Never change DNS as part of workflow recovery.

Local guard/smoke tests and actionlint validate the code and workflow structure. Verify the first automatic run in GitHub and check the production domain.

## Recovery evidence — 2026-11-16

Production run `43961621433` initially failed preflight because the repository had no environments. At the owner’s recovery request, `production` was created with required owner review, administrative bypass disabled and one `main` branch policy. The actual guard passed against live GitHub state, and the rerun’s preflight succeeded. The owner subsequently configured both required Vercel secrets and approved deployment.

After Upkeep PR #7 merged, run `43963778042` at commit `6085708a72a40f7f4b5902bde63fd264dce454e8` built and staged deployment `dpl_BpJABGQfVoBdrstikVEdk3zRNvFs`. Staged page/HTTP checks and the final GitHub guard passed. CLI promotion failed with `User not found. (404)`; public verification was skipped. Vercel reported the staged deployment READY, target production, with no aliases. No successful production promotion is claimed.

Inspection of the published `@vercel/cli-support@65.16.0` package reproduced its context lookup failure with a synthetic personal-user 404, both with and without explicit team scope. The helper’s regression fixtures exercise team-only API access, exact deployment identity, single promotion submission, pending/success/failure alias states and uncertain-request handling. A successful live run of the changed helper remains to be established after PR review and deployment approval.

After PR #8 merged, Production run `43967677181` at `53e394b079060a9a64b08fbf083f1a20769a0aef` staged `dpl_A8oieHV2cXWXJZC7E51bxJ4cfMG3` and passed staged smoke checks. Its promotion request took effect: read-only Vercel inspection confirmed `lucjoosten.nl` mapped to that exact deployment and reported completed production aliases. The helper nevertheless timed out while waiting on project job-status fields, so the run remained failed and skipped its public checks. A regression fixture with completed domain mapping and absent job-status fields reproduced that timeout before the confirmation fix. Confirmation now reads the [production alias](https://vercel.com/docs/rest-api/aliases/get-an-alias) directly. No promotion was repeated during diagnosis; pipeline status and actual serving state must be checked separately when recovering this failure.

After the confirmation fix, `pnpm check` passed (21 component/unit tests, 12 guard/smoke tests and 13 promotion tests), `pnpm build` and `git diff --check` passed. Read-only `node scripts/deployment/smoke.mjs https://lucjoosten.nl` passed against the already promoted site: all four routes returned HTTP 200 with expected initial metadata/headings, and the unknown route returned the custom noindex HTTP 404. These public checks were run separately after the failed workflow, not by that run; its failure status remains accurate for its execution. The corrected helper still needs confirmation through a subsequent approved workflow run.

References: [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration), [Vercel CLI deployment](https://vercel.com/docs/cli/deploy), [Vercel promotion](https://vercel.com/docs/cli/promote), [GitHub environment protection](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments).
