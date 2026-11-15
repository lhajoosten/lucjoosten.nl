# Phase 1 — portfolio foundation

Status: implementation approved by the project handoff. Deployment requires separate explicit approval.

## Scope and acceptance

Build the homepage and shared layout from `docs/engineering/lucjoosten-portfolio-v2.html` using strict TypeScript, React 19, Vite, Tailwind v4 and React Router. Preserve the prototype's editorial composition, DM Sans/DM Mono typography, warm light palette, charcoal dark palette, fine grid, blue accents and desktop/mobile proportions. Add accessible navigation, persisted/system-aware themes, reduced motion, a not-found page and meaningful quality gates.

Milestones:

1. Inspect the prototype and read the archived reference without modifying it; record architecture and design decisions.
2. Establish the toolchain and tokens; build shared navigation, homepage and footer.
3. Verify theme behavior, navigation, keyboard interaction, responsive layout and accessibility; prerender homepage HTML and document operation.

Acceptance: `pnpm check`, `pnpm build` and `pnpm test:e2e` pass; inspect desktop and mobile screenshots against the supplied HTML. Do not describe automated accessibility checks as a complete accessibility audit.

## Content boundaries

Use the owner's supplied current professional positioning. Archived copy is historical evidence, not permission to republish it. Only public, explicitly identified personal projects may supply evidence for initial summaries. ReviewBot is private: do not collect its source or present a source link. Do not invent project outcomes or test results. No articles are approved yet; use a truthful writing empty state.

## Exclusions and next phases

Full project case studies, secondary profile pages, Markdown/MDX, Zod schemas, feeds and publishing agents belong to later phases. Use homepage anchors until those routes exist. No automated collection, authentication, backend, database, contact form, analytics or deployment. No Cursor files.

## Workspace limitation

The provided `.git` directory is read-only and Git resolves to the parent workspace repository. Build an independently installable project here; leave parent Git state and sibling projects untouched. The owner subsequently authorized pushing the implementation. A new public `lhajoosten/lucjoosten.nl` repository and an isolated writable checkout are used for the initial review branch. The provided `.git` mount remains unchanged.

## Verified implementation — 2026-11-15

The homepage, shared layout, tokens, theme handling, project overview dialogs, not-found view, prerendering, quality workflow and engineering instructions are implemented locally. The initial review branch is pushed using the isolated checkout described above. At initial local verification, no remote CI or production deployment had been executed. The owner subsequently approved production publication; see the production verification record in `README.md` for the approved commit and executed live checks.

Executed on Node 26.13.0 with pnpm 12.14.0:

- `pnpm check`: formatting, Oxlint, strict TypeScript and all 6 component/unit tests passed.
- `pnpm build`: passed; generated static homepage and 404 HTML.
- `pnpm exec playwright install chromium`: installed the matching browser required for verification.
- `pnpm test:e2e`: all 12 Chromium desktop/mobile tests passed, including axe checks in both themes, native dialogs, keyboard navigation, system theme changes, persistence, reduced motion and content without JavaScript.
- Overflow assertions passed at widths 320, 390, 768, 1440 and 1920px.

Inspected light/dark desktop/mobile screenshots and compared them with captures of the supplied prototype. Corrected a Tailwind utility naming collision, small-text contrast on the featured card, dialog focus wrapping and narrow-grid overflow. Generated screenshots live under ignored `test-results/`; the reference HTML remains unchanged. Automated accessibility checks cover configured rules and states, not a full assistive-technology audit.

The owner requested excluding the prototype from Git. It now lives at `docs/engineering/lucjoosten-portfolio-v2.html`; all of `docs/engineering/` is ignored and excluded from publication.
