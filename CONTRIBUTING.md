# Contributing

Read `AGENTS.md` and the Phase 1 scope before changes. Use Node 24+ and the pinned pnpm version. Install with the frozen lockfile, keep changes focused and explain their purpose in a pull request.

Use `pnpm format` while editing. Before review run `pnpm check`, `pnpm build` and `pnpm test:e2e` (after installing Chromium with Playwright). Report executed commands, results and any limitations. For visual changes inspect desktop/mobile screenshots in both themes against the reference. Avoid broad snapshot updates or assertions that simply repeat implementation details.

For changelog collection, use scoped conventional PR titles and unscoped conventional commit messages. Complete the PR template's `release-log` block with factual summary, impact and any required reader action. See [changelog automation](docs/operations/release-log.md) for the staged CI integration and setup requirements.

Keep claims grounded in explicitly permitted evidence. Public source summaries are not independent test verification. Private repository access, archived copy and employer work are not publication authorization. Leave unverified content unpublished. Do not publish confidential information. Every content change requires human PR review; deployment, merges and DNS changes require explicit approval.
