# Changelog automation

The `Release Log` workflow calls the upstream reusable rolling-release workflow.
The workflow and CLI both pin `e3f2d317370447f6608be17941ade53b099d8fd2`, inspected
2026-11-16. See the pinned [setup contract](https://github.com/lhajoosten/release-log/blob/e3f2d317370447f6608be17941ade53b099d8fd2/docs/release-workflow.md)
and [release policy](https://github.com/lhajoosten/release-log/blob/e3f2d317370447f6608be17941ade53b099d8fd2/docs/release-policy.md).

## Current state and intended behavior

The caller is staged for validation: `RELEASE_LOG_ENABLED` is unset and `write`
is `false`. The owner reports that the App is installed. The required repository
Actions variables and secret were still absent on the latest setup check.
No changelog has been generated and no live integration run has been verified.
The owner approved including existing history on 2026-11-16. The fixed history
boundaries are recorded in the caller's trusted configuration.

After setup, an ordinary PR merge into `main` runs capture and deterministic
changelog generation. With live writes separately enabled, the bot maintains one
release PR containing `CHANGELOG.md`, the proposed package version and captured
inputs. A human reviews and merges it; the bot then tags that exact landing.
Existing Quality, production triggers and protection settings remain in place.
Tags do not initiate site deployment; merged release PRs still follow the existing
main/Quality production approval path. No AI provider is needed.

## Repository setup

Install the Release Log GitHub App for `lhajoosten/lucjoosten.nl`, with Contents
and Pull requests write permissions. The reusable workflow requests these even for
dry runs. Its installation token can write repository contents; it is not technically
confined to a release branch. Keep credentials out of this repository and logs.

Configure these repository Actions settings:

| Kind     | Name                      | Value                                                                        |
| -------- | ------------------------- | ---------------------------------------------------------------------------- |
| Variable | `RELEASE_APP_ID`          | The installed App's ID                                                       |
| Variable | `RELEASE_BOT_USER_ID`     | The App bot account's numeric user ID, distinct from the App/installation ID |
| Secret   | `RELEASE_APP_PRIVATE_KEY` | The App's private key                                                        |
| Variable | `RELEASE_LOG_ENABLED`     | `true`, after the other settings are ready                                   |

Configuration is trusted input embedded in the reviewed
[caller workflow](../../.github/workflows/release-log.yml), not a file loaded from
a PR head or a mutable configuration variable. Changes alter captured identities
and need PR review, just like caller-pin changes. The reusable workflow executes
only pinned tool code; consumer history is read as data.

The approved exclusive baseline is the initial commit,
`ed051000556633e810eaee8d9d403516c299b823`; its own changes are excluded, and all
subsequent reachable history is included. The fixed onboarding boundary is
`93cce7c4b3b8ca65e9102af6316860d23e3dcc8a`, main when the choice was proposed.
History through that boundary receives legacy metadata handling with warnings;
later changes require normal PR metadata. Never invent a previous release tag or
move onboarding forward on later runs. Initial adoption proposes `0.1.0`; the
existing package version is also `0.1.0`, but is not evidence of a tagged release.

## Validation and activation

1. Review the pinned upstream workflow, tool and lockfile together and configure
   the App settings above. The history boundaries are already approved.
2. Merge the reviewed integration PR, then inspect a merged-PR run with
   `write: false`. Closed but unmerged PRs are skipped. The reusable workflow
   supplies CLI diagnostics in run logs, not caller outputs or a downloadable
   changelog artifact. Inspect the captured range, warnings and proposed version.
3. Resolve metadata, association or permission failures before enabling writes.
   Historical entries through onboarding retain warnings rather than invented
   context. New PRs need scoped conventional titles, unscoped conventional commit
   messages and one valid release-context block; use the PR template. This change
   does not add a pre-merge metadata gate.
4. In a separately approved PR, change `write: false` to `write: true`. This
   enables proposals and exact-landing tags. Keep GitHub Release publication and
   self-upgrade options omitted. Review the first generated release PR and
   changelog before any human merge.

Use the approved workflow revision on a new merge event after changing caller
code; an old dry-run event does not pick up later caller changes. Never substitute
`GITHUB_TOKEN` for the App installation token.

## Recovery and upgrades

For metadata or read failures, inspect diagnostics and rerun the relevant merge
event after resolving the cause. For `release-tag-pending`, recover the original
release-merge event; never tag the latest main tip instead. A tag already at the
exact landing is reusable. Conflicting tags, edited generated proposals and
deliberately closed proposals require human inspection before recovery.

Set `RELEASE_LOG_ENABLED` to `false` to stop future runs; inspect any run already
in progress separately. Disabling does not undo existing refs or proposals. Tool
upgrades update both immutable pins in one reviewed PR and must retain compatibility
with captured proposals and prior producer runtimes. Bootstrap/onboarding identities
stay fixed. Do not delete or move tags as part of a rollback.
