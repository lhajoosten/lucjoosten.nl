# ADR 0001 — static React foundation

Status: accepted for Phase 1, following the approved handoff.

## Decision

Use React 19 and React Router in a Vite static build, strict TypeScript, Tailwind v4's Vite plugin and CSS theme tokens. Self-host the prototype's DM Sans and DM Mono with Fontsource. Keep approved homepage copy in a typed content module, presentation in components and styles, and shared layout/routing in `src/app`.

Prerender `/` and `/404.html` with React's server renderer in the build, then hydrate in the browser. This makes core content available without JavaScript while preserving a simple static hosting model. React Router handles unknown client URLs with a real not-found view. Vercel configuration serves the generated 404 with HTTP 404. No production deployment is authorized.

Use Oxlint, Oxfmt, Vitest, Testing Library and Playwright with axe for quality checks. Pin resolved dependencies in the pnpm lockfile and use Node 24 in CI. Install Zod and Markdown tooling when Phase 2/3 first requires them, avoiding unused dependencies today.

## Alternatives and consequences

A client-only SPA is simpler but hides the initial document from clients without JavaScript. A full server framework adds runtime and hosting obligations that this portfolio does not need. The small prerender script is sufficient for two routes; revisit route generation when content routes arrive.

No data repository layer, global state framework or search engine is warranted. Markdown content validation must occur before future public bundles are generated, so drafts cannot leak through client-side filtering.

## Reference inspection

Read-only inspection of [the archived repository](https://github.com/lhajoosten/personal-website) covered its root, README, package manifest, routing, content types, writing parser and project catalog. Useful concepts: centralized content, self-hosted fonts, theme initialization before paint, generated static metadata. Excluded: DuckDB, database persistence, dual visual systems, server contact API, Cursor configuration and archived project claims. Current positioning comes from the approved handoff, not the old README.

The original writing parser defaults missing publication status to published; do not reuse this behavior. Future schemas must default to draft and reject invalid metadata. The archive's project catalog also differs from today's candidates and is not republished.

## Initial homepage evidence

Reviewed on 2026-11-15: the public [Release Log README](https://github.com/lhajoosten/release-log/blob/main/README.md) describes implemented core CLI components and explicit rollout limitations; the public [Azure AI Workbench README](https://github.com/lhajoosten/azure-ai-workbench/blob/main/README.md) explicitly states documentation-only status. Homepage summaries retain these distinctions. No source-project tests were run and no production outcomes are claimed. ReviewBot's private repository metadata was checked only for visibility; its source was not collected. Talven is deferred to later curation.

## Phase 2 extension — 2026-11-15

The owner approved [the first projects slice](../spec/phase-2-projects.md). Keep the static foundation: extend prerendering with a small explicit page/metadata list shared with client navigation and Vite preview. Emit project routes as directory index documents, with explicit hosting mappings and the existing HTTP 404 fallback. This revisits the two-route script without introducing a content engine or server runtime. Phase 1 production approval remains historical; this extension does not authorize deployment.

The Release Log case study uses only the README at commit `53eaaf949d242b848108fed106a6809cadf74416`, reviewed 2026-11-15. No linked source files or source-project tests were collected or executed. Its documented implementation and rollout limitations remain distinct from proposed AI behavior and unverified production outcomes.
