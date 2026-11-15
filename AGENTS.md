# Engineering instructions

## Scope and decisions

Read affected code, tests and current user changes before editing. Plan substantial work and agree its scope; work in small, verifiable increments. Phase 1 is the current implementation boundary: see `docs/spec/phase-1-foundation.md`. Record durable architecture changes in `docs/adr/` and update maintained documentation alongside code.

Use the existing package scripts and conventions. Keep TypeScript strict and maintain the separation between content, presentation and shared application layout. Prefer semantic HTML, accessible controls, visible focus and responsive layouts. Introduce abstractions or dependencies only for demonstrated requirements. Avoid unrelated refactoring.

## Verification

Write meaningful tests for observable behavior. Run the checks relevant to each change and report the exact commands and actual results. Never claim an unexecuted check passed. Do not suppress lint or type errors to make checks pass. Inspect desktop and mobile behavior for UI changes, including dark mode and reduced motion. The approved HTML prototype is the visual source of truth; preserve the reference file.

## Publication and privacy

Use only explicitly allowed evidence sources. Private access is not publication permission. Never collect employer/customer material, secrets, personal data or confidential infrastructure details. Keep unverified content in drafts outside public build inputs. Distinguish implemented, tested, experimental, proposed and interpreted claims; never manufacture outcomes or verification results.

Propose every publication change through a pull request for human review. Do not automatically merge, deploy, create releases or change DNS. Production deployment requires explicit approval. The archived reference repository must remain unchanged. Do not introduce Cursor-specific files, rules, skills or dependencies.
