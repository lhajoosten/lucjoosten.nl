# Portfolio V2 design system

The approved source is `docs/engineering/lucjoosten-portfolio-v2.html`; preserve it unchanged. It is local-only and ignored by Git, so fresh clones do not include the prototype. No separate reference screenshots were supplied.

Tokens live in `src/styles/tokens.css` and are exposed through Tailwind's `@theme inline`. Layout styles live in `site.css`; content does not own style values.

- Light: warm paper `#f6f5f1`, ink `#131616`, blue `#3679a9`, line `#d9dad6`.
- Dark: charcoal `#11171a`, ink `#f1f3f1`, blue `#7bb9df`, line `#324047`.
- DM Sans for editorial headings and body; DM Mono for section indices and technical labels. Fonts are local Latin subsets, with system fallbacks and swap rendering.
- Container: maximum 1480px; horizontal inset scales from 24px to 68px. Header: 84px desktop / 70px mobile. Sections: 108px / 75px top padding.
- Hero: large, tightly tracked headline, blue italic emphasis, five-column grid. Mobile uses three columns and stacked supporting content. The prototype's diffuse glow is omitted in favor of its restrained grid.
- Projects: asymmetric three-column composition; two columns below 950px; one below 650px. Diagrams explain project domains. Modest tag counts.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 72, 108px. Fine borders; circular utility controls; 2px focus outlines.
- Theme: system preference by default, explicit toggle persisted under `lucjoosten.theme`. Storage failure must not break the page. System changes apply while there is no saved preference.
- Interaction: 180ms transitions and small hover translations, disabled with smooth scrolling under reduced motion. Touch controls are at least 44px. Mobile navigation is a disclosure with Escape dismissal and focus restoration. Project summaries use native modal dialogs.

Intentional changes from the prototype: accessible contrast for small blue text, larger utility targets, visible keyboard focus and skip link; unverified graduation dates and experience history omitted; private ReviewBot summary withheld; public project summaries use current READMEs; writing has an honest empty state until approved articles exist.

## Project pages — Phase 2 slice 1

The projects index reuses the asymmetric card grid as semantic articles with explicit links, reviewed status and repository visibility. Homepage cards retain their native overview dialogs; the Release Log dialog adds a case-study link. The Projects header destination is `/projects`; other header destinations remain homepage anchors.

The case-study layout pairs an editorial title and project diagram, then a section navigation column and reading column capped at 720px. On mobile these stack into one column. Source attribution links to a pinned public README and records its review date. Reuse existing light/dark, focus and reduced-motion tokens. Client page transitions focus the destination heading; ordinary homepage and case-study anchors preserve native navigation.
