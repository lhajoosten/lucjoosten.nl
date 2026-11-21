# Phase 2, slice 1 — projects index and Release Log case study

Status: scope and README-only evidence allowlist approved by the owner on 2026-11-15. Prepared against commit `187bf9d755a632f448b4763767d3e80b2c97f972`. Implementation is authorized; publication requires human PR review and separate deployment approval.

## Purpose

Give visitors a browsable project overview and one substantive, evidence-backed case study. Start with Release Log because its reviewed homepage summary describes implemented functionality and explicit rollout limitations. Keep the existing static React foundation and Portfolio V2 visual language.

## Intended behavior

- `/projects` lists the three existing curated entries: Release Log, Azure AI Workbench and ReviewBot. Reuse reviewed summaries, tags, visibility and status; do not infer new claims. Release Log links to its case study. Azure AI Workbench retains its documentation-only status and public repository link. ReviewBot retains its private/overview-pending description, without a source link or invented case-study route.
- `/projects/release-log` provides a readable case study covering the problem, documented approach, implemented capabilities, limitations and source attribution. Separate deterministic changelog generation from optional AI-assisted release notes. State that the reusable workflow is not yet deployed unless approved evidence supports an explicit correction. Omit unsupported outcomes rather than filling gaps.
- The header's Projects link targets `/projects` on desktop and mobile. Add a visible link from the homepage's selected-work section to the index and a case-study link within the existing Release Log dialog. Preserve homepage cards and their dialog behavior. Other navigation destinations retain their homepage anchors.
- The index links home; the case study links back to the index and to the public Release Log repository. Navigation works by keyboard, direct URL, refresh and browser back/forward. Route changes expose the destination heading to keyboard and assistive-technology users without breaking homepage anchor navigation or dialog focus restoration.
- Both new routes use the shared header, footer, theme control, spacing, typography and responsive tokens. Extend the existing design language for the reading layout; preserve the local approved prototype unchanged.

## Evidence boundary and content review

Already available evidence is limited to reviewed copy in `src/content/home.ts` and the provenance recorded in [ADR 0001](../adr/0001-static-react-foundation.md). Those summaries are insufficient evidence for a full case study.

Approved fresh collection allowlist:

- Only the public Release Log README: `https://github.com/lhajoosten/release-log/blob/main/README.md`. Record the inspected commit and review date so claims remain traceable to a fixed version.

Do not follow README links into source code, issues, pull requests, workflows or external documentation without expanding the allowlist explicitly. Do not collect private repositories, employer/customer material or archived portfolio copy. No new Azure AI Workbench collection is needed for this slice. Keep unverified drafting outside public build inputs under ignored `docs/engineering/phase-2/`.

If the README cannot substantiate a proposed section, shorten or omit that section. Claims about tests must identify whether they are source documentation or checks actually executed here. No source-project test runs, production success claims, impact metrics or publication permission are implied by README access. Review the case-study copy in the implementation PR before publication.

## Implementation constraints

- Retain React, TypeScript, React Router and the static Vite build. Keep curated project content separate from presentation and shared layout. Introduce only the types and reusable components required by these routes; no new runtime dependency is planned.
- Revisit the two-document prerender script with a small explicit route/metadata definition shared by build output and client navigation where practical. Generate `/projects/index.html` and `/projects/release-log/index.html` alongside the existing homepage and `404.html`. Avoid a general content engine.
- Give each valid route its own title, description, canonical URL and Open Graph title, description and URL in the initial HTML and after client navigation. Returning home restores homepage metadata. Unknown routes retain the not-found view, noindex behavior and no valid-page canonical or social URL.
- Preserve filesystem-first hosting and real HTTP 404 responses for unknown routes, including unknown project slugs. Vite preview's SPA fallback alone cannot verify hosting status codes. Keep any hosting changes limited to serving these static routes correctly.
- Update README and maintained design/architecture guidance with implemented behavior. Record a new ADR only if implementation changes a durable architecture decision. Do not rewrite historical Phase 1 verification results as current checks.

## Observable acceptance

1. The index exposes exactly the three reviewed projects with accurate status and repository visibility. Only Release Log has an internal case-study destination. Unknown project slugs show the not-found page.
2. Visitors can reach the index through desktop/mobile navigation and the homepage, open the case study, return to the index and navigate home. Keyboard focus, skip link, mobile menu dismissal and browser history remain usable across these transitions.
3. Direct loading and refreshing either new route displays its correct heading and content. With JavaScript disabled, both documents contain readable content and usable ordinary navigation/source links. Hydration produces no page errors or content mismatch.
4. Initial documents and client transitions have the route-specific metadata defined above, including transitions between the two project routes, home and an unknown URL.
5. Inspect both routes on desktop and mobile in light/dark themes and with reduced motion. Check visible focus, semantic headings/landmarks, accessible link names and no horizontal overflow at 320, 390, 768, 1440 and 1920px. Automated axe checks supplement visual and keyboard inspection.
6. Existing homepage positioning, anchors, project dialogs, theme persistence/system preference and not-found behavior pass their regression checks. Preserve existing homepage composition apart from the specified navigation links.
7. Every substantive case-study claim is supported by the agreed evidence and distinguishes documented implementation, limitations and unverified outcomes. The public build contains only reviewed content.

Required implementation checks: `pnpm check`, `pnpm build` and `pnpm test:e2e`. Add meaningful component/browser coverage for project visibility, navigation, metadata transitions and no-JavaScript direct loads. Inspect generated HTML as part of build verification. Verify valid-route HTTP 200 and unknown-route HTTP 404 on an authorized preview using the hosting configuration; do not count a rendered Vite fallback as HTTP verification. Report exact commands, actual results and any verification limitations. Production verification requires separately approved deployment.

## Exclusions

Other case-study routes; about, experience, contact or writing pages; Talven curation; Markdown/MDX, schemas, CMS, feeds, sitemap or social preview images; collection agents or schedules; backend, analytics, contact forms or new infrastructure. No archive changes, Cursor files, merge, release, deployment or DNS change.

## Implementation sequence and agreement

1. Owner agrees this route/navigation scope and the README-only evidence allowlist. If a richer engineering account is wanted, agree additional sources before collecting them.
2. Inspect the allowed README at a recorded revision and prepare reviewable case-study copy. Resolve unsupported claims before adding public content.
3. Implement the two routes, the minimal shared content/routing/metadata support and the specified navigation changes on a new implementation branch.
4. Run the required checks and visual inspections; propose all publication changes through a human-reviewed PR. Preview/publication permissions and production deployment approval remain separate.

The owner agreed to this scope and the README-only evidence allowlist on 2026-11-15. No merge, release, deployment or DNS change is authorized.

## Implementation verification — 2026-11-15

Implemented on `feat/phase-2-projects`; awaiting human PR/content review and separate deployment approval. Fresh collection was limited to the Release Log README at commit `53eaaf949d242b848108fed106a6809cadf74416` (README blob `d12d74cb37a251d8e9b65f8638ae90b36ceedeb3`). No linked documents or source-project tests were collected or run.

Executed locally:

- `pnpm check`: formatting, lint, strict TypeScript and all 8 component/unit tests passed.
- `pnpm build`: passed; generated homepage, projects index, Release Log and 404 documents with initial metadata.
- `pnpm test:e2e`: all 26 Chromium desktop/mobile tests passed, including no-JavaScript project navigation, direct loads, metadata, history, focus, theme persistence, reduced motion, axe checks and homepage regressions.
- `git diff --check`: passed.

Inspected both new routes in light/dark desktop/mobile screenshots. Overflow assertions passed at 320, 390, 768, 1440 and 1920px. Browser tests caught Vite preview returning homepage HTML for extensionless directory routes; a preview hook now serves the generated project documents. Explicit Vercel mappings cover those URLs while preserving the 404 fallback. Local preview is not hosting HTTP-status verification. The existing Git integration subsequently created feature-branch preview `dpl_C4BUuGb29GDfD7KZPjiyZVAkcvqu` at implementation commit `b7e9719bba2f23f951a648246787bf2429f86b61`; Vercel reported READY. Authenticated Vercel URL fetches verified HTTP 200 and correct initial headings/metadata for `/projects` and `/projects/release-log`, with and without trailing slashes. `/projects/missing` and `/missing-page` returned HTTP 404, the custom not-found document, noindex and no canonical URL. No manual deployment or production change was requested. [Draft PR #3](https://github.com/lhajoosten/lucjoosten.nl/pull/3) holds the changes for human review.

## Catalog and case-study follow-up — 2026-11-21

The owner requested Lint Action, matching project listings and fuller project write-ups. The homepage and index use the same ordered catalog and link to a case study for every entry. The homepage keeps the overview dialogs.

The Lint Action write-up uses its [public README at the reviewed implementation revision](https://github.com/lhajoosten/lint-action/blob/a0be508341f2ac8001143cd13e729ae8579b0b1c/README.md), inspected in the owner-identified local checkout on 2026-11-21. GitHub confirms the repository is public and the reviewed commit is an ancestor of the default branch. The write-up describes that pinned implementation. For other projects, use the already reviewed material and this portfolio’s own implementation. For private and planned projects, frame workflow descriptions as goals where applicable and keep private source out of the build.
