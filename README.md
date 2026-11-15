# lucjoosten.nl

Luc Joosten’s engineering portfolio. Phase 1 implements the approved Portfolio V2 homepage with React 19, TypeScript, Vite, Tailwind v4 and React Router. No backend is required. Production runs on Vercel at [lucjoosten.nl](https://lucjoosten.nl).

## Local development

Use Node 24+ and pnpm 12.14.0 (the `packageManager` field pins it).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the printed local URL. To check the production output:

```sh
pnpm check
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
pnpm preview
```

`pnpm check` runs format, lint, type checks and component/unit tests. Browser tests cover desktop/mobile layouts, both themes, navigation, project dialogs, automated axe accessibility, reduced motion and prerendered content. Screenshots and failing traces go to ignored `test-results/`. Browser installation may require network access and system libraries. CI installs these explicitly. `pnpm format` applies formatting; the supplied prototype is excluded.

## Structure and design

- `src/app`: routing, shared page shell and homepage.
- `src/components`: theme control, navigation, project diagrams and native dialogs.
- `src/content/home.ts`: reviewed homepage copy and public project summaries.
- `src/styles`: light/dark design tokens and responsive layouts.
- `docs/engineering/lucjoosten-portfolio-v2.html`: unchanged approved prototype, kept local and untracked.
- `docs/spec/phase-1-foundation.md`: scope, milestones and acceptance.
- `docs/architecture/design-system.md`: visual and interaction contract.
- `docs/adr/0001-static-react-foundation.md`: architecture and archived-repository inspection.

Homepage links use anchors intentionally. Full project, experience, about, writing and contact routes are later milestones. Unknown routes show a not-found view. No articles are published yet. Release Log and Azure AI Workbench summaries reflect their public READMEs; those repositories’ tests were not executed here. ReviewBot has no source link or implementation claims because it is private.

## Build and hosting

`pnpm build` generates static HTML for `/` and `/404.html` with React’s server renderer, then hydrates in the browser. Fonts are self-hosted. Theme preference initializes before paint, persists when storage is available, and otherwise follows the OS until explicitly changed. No analytics, tracking, external font service or secret configuration is required.

Vercel uses the following configuration: install `pnpm install --frozen-lockfile`, build `pnpm build`, output `dist`. It serves existing static files and a real HTTP 404 for unknown paths. Local Vite preview uses SPA fallback; the browser suite verifies its rendered not-found UI. Production HTTP checks separately verify Vercel routing. The public repository is `lhajoosten/lucjoosten.nl`. The owner approved production publication on 2026-11-15; GoDaddy manages DNS.

The provided Git directory is read-only and resolves to a parent workspace repository. An isolated writable checkout is used to push this implementation to the new repository; a normal clone of that repository has standard Git behavior.

## Next milestones

Phase 2 adds curated case studies and secondary pages, then Phase 3 introduces validated Markdown/MDX, draft exclusion, feeds and content routes. Phase 4 adds explicit source allowlists and reviewed agent publishing instructions. Scheduled automation is deferred. Before publication, all content changes require a reviewed PR and deployment requires explicit owner approval.

Known limits: automated axe checks do not replace assistive-technology testing; no Safari/Firefox test matrix is configured yet. No social preview image, RSS, sitemap, full content schemas or agent collection pipeline is included in Phase 1. With JavaScript disabled the homepage and external links remain readable; theme controls, project dialogs and the mobile menu require JavaScript.

## Production verification — 2026-11-15

The owner explicitly approved enabling commit `6e14b18e24a13fd67646bd101992f59d48541240`. Vercel project `lucjoosten-nl` in team `lhajoosten-dev` serves that build at `https://lucjoosten.nl/`; `www` redirects there with HTTP 308. The production deployment is `dpl_89PdmywWvGd3KvfGoGAGQV3oaztG`. PR #1 remains open; enabling the approved deployment did not merge it.

Verified public HTTPS responses: homepage, JavaScript and CSS return 200; an unknown URL returns the custom page with HTTP 404. Live Chromium smoke tests passed at 1440px and 390px, covering hydration, theme persistence, project dialogs, responsive width, mobile navigation and no page errors. The recent 15-minute Vercel error/fatal runtime-log query returned no entries. No external log drains are configured; these checks are a point-in-time verification rather than continuous monitoring. GitHub's Quality workflow also passed for the approved commit.

Both domains report valid DNS configuration in Vercel. Preserve unrelated GoDaddy DNS records, especially email records. Any later production deployment still requires explicit owner approval.
