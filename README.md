# lucjoosten.nl [![Production](https://github.com/lhajoosten/lucjoosten.nl/actions/workflows/production.yml/badge.svg)](https://github.com/lhajoosten/lucjoosten.nl/actions/workflows/production.yml)

<img width="2172" height="724" alt="lucjoosten nl-header" src="https://github.com/user-attachments/assets/d39c8ba7-54db-4bfd-bc7c-4067ef2b0d48" />

Luc Joosten’s engineering portfolio. The foundation implements the approved Portfolio V2 homepage with React 19, TypeScript, Vite, Tailwind v4 and React Router. Phase 2 adds a projects index, project case studies and an About page. No backend is required. Production runs on Vercel at [lucjoosten.nl](https://lucjoosten.nl).

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

- `src/app`: routing, shared page shell, homepage, project pages and About page.
- `src/components`: theme control, navigation, project diagrams and native dialogs.
- `src/content/home.ts`: navigation.
- `src/content/profile.ts`: approved positioning, current role, technical focus and profile links shared by home/About.
- `src/content/projects.ts`: shared reviewed project summaries and visibility.
- `src/content/release-log.ts`: curated case-study copy and pinned README provenance.
- `src/content/release-log-version.ts`: optional public GitHub stable-tag resolution for the Release Log case study.
- `src/app/metadata.ts`: explicit page list and metadata for prerendering and client navigation.
- `src/styles`: light/dark design tokens and responsive layouts.
- `docs/engineering/lucjoosten-portfolio-v2.html`: unchanged approved prototype, kept local and untracked.
- `docs/spec/phase-1-foundation.md`: historical foundation scope and acceptance.
- `docs/spec/phase-2-projects.md`: approved first Phase 2 slice and acceptance.
- `docs/spec/phase-2-about.md`: approved About page scope and acceptance.
- `docs/architecture/design-system.md`: visual and interaction contract.
- `docs/adr/0001-static-react-foundation.md`: architecture and archived-repository inspection.

Projects navigation opens `/projects`. The index and homepage share the same seven projects in the same order. Homepage cards open overview dialogs, and both surfaces link to each project’s case study. About navigation opens `/about`. Experience, Expertise, Writing and Contact retain homepage anchors. Unknown routes, including unknown project slugs, show a not-found view.

Release Log and Azure AI Workbench retain their reviewed README-based summaries. The Upkeep case study uses the owner’s publication-approved description from 2026-11-16. ReviewBot and kube-lab use the project goals documented in issue #19. Lint Action cites the public README at the reviewed implementation revision. The portfolio case study uses the site README and the route and rendering behavior of this repository.

Release Log’s expanded case study covers its packaged CLI, human-reviewed release cycle, self-use, AI boundaries and remaining validation. The narrative is reviewed against a pinned README; it does not update automatically. On each case-study mount, an optional browser request to GitHub’s public matching-refs API selects the highest stable `vMAJOR.MINOR.PATCH` tag numerically. Prereleases and malformed tags are excluded. New tags appear on a later visit without a website commit or deployment. No credentials, referrer, persistent cache, scheduled job or build-time network access is used. GitHub still receives the visitor’s ordinary network request. Failure, rate limiting, a five-second timeout or disabled JavaScript leaves ordinary usage/tag links available. Tags identify source versions, not successful container publication; the usage link always points to the current upstream README for verified image/digest instructions. See [ADR 0003](docs/adr/0003-release-log-version-resolution.md).

## Build and hosting

The [Release Log CI integration](docs/operations/release-log.md) previews releases with the latest stable CLI and uses a separate pinned writer when the Release Log App is configured. The bot maintains a changelog proposal and tags its landing after a human merges it. The initial proposal includes existing history after the initial commit, with legacy metadata handling through the fixed onboarding boundary. The PR template supplies structured changelog context.

The [production workflow](docs/operations/production-deployment.md) deploys automatically after a successful main Quality run. It builds the exact tested commit, runs staged smoke checks, promotes the build and verifies the public site. GitHub shows the production environment URL, job summary and status badge. PR previews are available through Vercel.

`pnpm build` generates static HTML for `/`, `/about`, `/projects`, `/projects/release-log`, `/projects/upkeep`, `/projects/lucjoosten-nl` and `/404.html` with React’s server renderer, then hydrates in the browser. The project pages are emitted as directory index documents. Every valid page has a title, description, canonical URL and Open Graph metadata in its initial HTML and after client navigation. Unknown client routes clear valid-page metadata and set noindex. Fonts are self-hosted. Theme preference initializes before paint, persists when storage is available, and otherwise follows the OS until explicitly changed. No analytics, tracking, external font service or secret configuration is required.

Vercel uses the following configuration: install `pnpm install --frozen-lockfile`, build `pnpm build`, output `dist`. It serves existing static files and a real HTTP 404 for unknown paths. Explicit Vercel routes map the About and project URLs to their generated documents before the 404 fallback. A small Vite preview hook serves the same project documents for direct loads; unknown URLs still use Vite’s SPA fallback. The browser suite verifies navigation, route metadata and no-JavaScript project content, but local preview does not prove Vercel HTTP status behavior. Check valid-route HTTP 200 and unknown-route HTTP 404 on an authorized hosted preview before merge. The public repository is `lhajoosten/lucjoosten.nl`. The owner approved production publication on 2026-11-15; GoDaddy manages DNS.

The workspace has its own Git metadata for `lhajoosten/lucjoosten.nl`. The initial parent-repository limitation is resolved; the temporary publishing checkout is no longer needed. Sandbox permissions may still require escalation for Git writes.

## Next milestones

Phase 2 continues with separately scoped case studies and secondary pages, then Phase 3 introduces validated Markdown/MDX, draft exclusion, feeds and content routes. Phase 4 adds explicit source allowlists and reviewed agent publishing instructions. Scheduled automation is deferred. Before publication, all content changes require a reviewed PR.

Known limits: automated axe checks do not replace assistive-technology testing; no Safari/Firefox test matrix is configured yet. No social preview image, RSS, sitemap, full content schemas or agent collection pipeline is included in Phase 1. With JavaScript disabled the homepage, project pages and ordinary navigation/source links remain readable; theme controls, project dialogs and the mobile menu require JavaScript.

## Production verification — 2026-11-15

Phase 1 is merged and live. The owner merged [PR #1](https://github.com/lhajoosten/lucjoosten.nl/pull/1) as commit `00a0a4336ca10643d47757ca1e5d0c6d4f40b617`. On 2026-11-15, Vercel resolved `https://lucjoosten.nl/` to production deployment `dpl_5PyQuUGHP2C1MiQ9XycUuUZJ9Wwm`, READY at that merge commit in project `lucjoosten-nl`, team `lhajoosten-dev`. The Git integration deployed the merge; pushes or merges to `main` affect production. The [Quality workflow for the merge commit](https://github.com/lhajoosten/lucjoosten.nl/actions/runs/43711835753) completed successfully.

Earlier live checks on the initially approved commit `6e14b18e24a13fd67646bd101992f59d48541240` verified public HTTPS responses: homepage, JavaScript and CSS returned 200; `www` redirected to the canonical domain with HTTP 308; an unknown URL returned the custom page with HTTP 404. Live Chromium smoke tests passed at 1440px and 390px, covering hydration, theme persistence, project dialogs, responsive width, mobile navigation and no page errors. The post-launch 15-minute Vercel error/fatal runtime-log query returned no entries. No external log drains were configured. These are historical, point-in-time results; the browser, HTTP and runtime-log checks were not rerun for this documentation update.

Both domains reported valid DNS configuration in Vercel during initial publication. Preserve unrelated GoDaddy DNS records, especially email records.
