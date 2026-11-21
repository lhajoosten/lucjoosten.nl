# Changelog automation

The workflow previews releases with `ghcr.io/lhajoosten/release-log:latest`
using a repository-scoped read-only token. A separate SHA-pinned job recomputes
the release using fresh GitHub evidence and receives its own write token. The
preview passes no output or artifacts to the writer.

When the App is configured, an ordinary PR merge into `main` runs
capture and deterministic changelog generation. The bot maintains one release
PR containing `CHANGELOG.md`, the proposed package version and captured inputs.
A human reviews and merges it, and the bot then tags that exact landing. Merged
release PRs follow the main/Quality production approval path.

The formatter skips the generated `CHANGELOG.md` and `.release-log/inputs.json`
to preserve the exact bytes recorded in the proposal.

## Repository setup

Install the Release Log GitHub App for `lhajoosten/lucjoosten.nl`, with Contents
and Pull requests write permissions for the pinned writer. The preview requests
read access to those resources. Keep credentials out of this repository and logs.

Configure these repository Actions settings:

| Kind     | Name                        | Value                                                                        |
| -------- | --------------------------- | ---------------------------------------------------------------------------- |
| Variable | `RELEASE_APP_ID`            | The installed App's ID                                                       |
| Variable | `RELEASE_BOT_USER_ID`       | The App bot account's numeric user ID, distinct from the App/installation ID |
| Secret   | `RELEASE_APP_PRIVATE_KEY`   | The App's private key                                                        |
| Variable | `RELEASE_LOG_WRITE_ENABLED` | Set to `false` to keep previews and disable writes                           |

Configuration is trusted input embedded in the reviewed
[workflow](../../.github/workflows/rolling-release.yml), not a file loaded from
a PR head or a mutable configuration variable. Changes alter captured identities
and need PR review. Full main history and tags are checked
out without persisted credentials and mounted read-only alongside trusted config,
bot identity and event files. The container uses the host UID/GID, a read-only root
filesystem, dropped capabilities and temporary scratch space. Network access is
enabled for GitHub API reads. Each job mints its own App token. The App private
key goes only to the token action.
Consumer code and dependency scripts are not executed. Runs are serialized per
repository/main branch without cancellation.

The approved exclusive baseline is the initial commit,
`ed051000556633e810eaee8d9d403516c299b823`; its own changes are excluded, and all
subsequent reachable history is included. The fixed onboarding boundary is
`93cce7c4b3b8ca65e9102af6316860d23e3dcc8a`, main when the choice was proposed.
History through that boundary receives legacy metadata handling with warnings;
later changes require normal PR metadata. Never invent a previous release tag or
move onboarding forward on later runs. Initial adoption proposes `0.1.0`; the
existing package version is also `0.1.0`, but is not evidence of a tagged release.

## Review the first proposal

After the activation PR merges, inspect the Release Log run for that merge and
review the generated PR's captured range, warnings, proposed version and
changelog. New PRs need scoped conventional titles, unscoped conventional
commit messages and one valid release-context block. Use the PR template.

Use a new merge event to verify workflow changes. A rerun uses the workflow
revision from its original event. The CLI authenticates with the App installation
token.

## Recovery and upgrades

For metadata or read failures, inspect diagnostics and rerun the relevant merge
event after resolving the cause. For `release-tag-pending`, recover the original
release-merge event; never tag the latest main tip instead. A tag already at the
exact landing is reusable. Conflicting tags, edited generated proposals and
deliberately closed proposals require human inspection before recovery.

Set `RELEASE_LOG_WRITE_ENABLED` to `false` to disable future writes and keep
previews. Inspect an in-progress run separately. The preview follows the latest
stable image. To upgrade the writer, review the matching immutable workflow and
tool SHA and keep the trusted replay runtimes needed by existing proposals.
Preserve capture identities, bootstrap/onboarding boundaries and existing tags.
