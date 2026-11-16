# ADR 0003 — optional Release Log version resolution

Status: accepted for the expansion PR requested by the owner on 2026-11-16. Human review and separate production deployment approval remain required.

## Context

Release Log now distributes a CLI container and uses its own release workflow. The owner requested expanded website content and automatic version resolution while preparing another release. Baking a current version into the portfolio would require a website change for every upstream tag.

## Decision

Keep the engineering narrative curated against the public README at commit `033903ca288b623d0014e5e0e23de354b5668ea8`, reviewed 2026-11-16. Update the shared homepage/index summary, case study and metadata to reflect packaged availability, the release PR/tag lifecycle, documented self-use and remaining limits. The previous slice’s evidence boundary remains historical; this expansion reads only the README plus public ref metadata needed for provenance and version resolution. No linked source, private sandbox material or source-project tests are collected or executed.

After hydration, query only `https://api.github.com/repos/lhajoosten/release-log/git/matching-refs/tags/v`. GitHub’s [matching references API](https://docs.github.com/en/rest/git/refs#list-matching-references) returns matching refs without requiring authentication for public resources. Select the numerically greatest exact stable `vMAJOR.MINOR.PATCH` ref, excluding prereleases and malformed entries. Label the result “Latest stable tag” and link to its source tree. Do not infer container availability from tag existence or announce an upcoming version before it is tagged.

Send no credentials or referrer, keep no persistent client cache and cancel on unmount or after five seconds. Render ordinary links to GitHub tags and the current README’s published-CLI instructions in the initial HTML. Errors, empty/invalid data, rate limits and disabled JavaScript retain those links. The narrative, metadata and static build never depend on this lookup.

## Alternatives and consequences

A hardcoded version is deterministic but needs ongoing website edits. A build-time lookup cannot update an already deployed site. Scheduled commits or cross-repository dispatch would add automation, credentials and publication maintenance beyond this request. A server proxy/cache would add a backend to a static portfolio. An optional browser lookup handles this small display without those additions.

The browser contacts GitHub, exposing its ordinary request/network metadata; no tracking or secret is introduced. Unauthenticated rate limits can suppress the version display, and the result reflects the time the page is opened rather than continuous polling. No source version implies that its image has finished publishing. Current upstream instructions remain the authority for runnable image versions and verified digests. Changes to project capabilities still require a reviewed content PR.
