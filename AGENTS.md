# FoxyFurniture Next-Phase Guidance

Use this file as persistent project guidance for Codex sessions working on
FoxyFurniture.

The prior Bootstrap migration is conceptually separate from the next phase. The
current phase is a mobile-first redesign effort, not another framework migration.
Bootstrap may still be useful, but the primary goal is to improve the site's
design, usability, and maintainability within the constraints of the existing
project.

## Current Project Goals

FoxyFurniture is a personal vanity site and a programming/design exercise. Keep
that character intact. It should feel simple, personal, and intentionally made,
not like a commercial furniture storefront or a large product platform.

Analytics added during the Bootstrap migration indicate that approximately 80%
of visitors use mobile devices. Mobile is therefore the primary design target,
with tablet and desktop layouts adapted from a strong phone-sized experience.

The redesign must treat the existing media library as a hard constraint. The
user can no longer create new image or media assets, so do not assume new
photography, illustrations, videos, icons, or other custom media will be
available.

The current Gallery is a specific area for exploration. Agents may compare
Bootstrap implementations with lightweight alternatives, but should evaluate
options primarily for mobile usability, touch interaction, accessibility,
simplicity, and long-term maintainability.

## Working Principles

- Preserve existing behavior unless the redesign task explicitly changes it.
- Keep changes scoped to the requested redesign area; avoid unrelated refactors,
  formatting churn, or cleanup.
- Prefer existing project patterns over introducing new abstractions.
- Favor understandable, low-complexity HTML, CSS, Bootstrap, and JavaScript over
  elaborate frameworks or JavaScript-heavy solutions.
- Treat mobile responsiveness as a core design requirement, not a follow-up.
- Design and evaluate phone-sized layouts first, then adapt upward for tablet
  and desktop.
- Maintain accessibility behavior, including labels, focus states, keyboard
  interaction, ARIA attributes, alt text, and semantic HTML.
- Do not remove existing tests or weaken assertions to make a change pass.

## Before Editing

- Inspect the existing implementation, nearby styles, available assets, and any
  existing tests before changing code.
- Check whether the project already has preferred patterns for Bootstrap
  utilities, components, image handling, galleries, and responsive behavior.
- Review the existing media assets before proposing or implementing visual
  changes. Use only assets already present in the project.
- Note any user changes in the working tree and work with them; do not revert
  unrelated edits.

## Implementation

- Work iteratively on one coherent area at a time.
- Avoid wholesale rewrites unless the user explicitly asks for one.
- Keep useful existing structure and behavior unless the requested redesign
  benefits from changing it.
- Use Bootstrap components when they provide a simple, maintainable answer, but
  do not force Bootstrap where a lighter project-local implementation would be
  clearer.
- For Gallery work, compare approaches against practical criteria: phone layout,
  touch targets, swipe or tap behavior, keyboard access, screen-reader behavior,
  image loading, code size, dependency cost, and ease of maintenance.
- Prefer CSS, layout, typography, cropping, spacing, and thoughtful reuse of
  existing assets over designs that require new media.
- Avoid broad CSS overrides that may affect unrelated pages.
- Use small helper components only when they reduce real duplication or match an existing pattern.

## Verification

- Run the relevant tests or checks for the touched area.
- For visible UI changes, inspect the result in a browser when practical.
- Check mobile layouts first for text wrapping, spacing, alignment, touch target
  size, media cropping, gallery interaction, and overlap.
- Also check tablet and desktop layouts after the mobile experience is sound.
- Call out anything not verified, especially visual parity or unavailable test coverage.

## Project-Specific Notes

- This phase is a mobile-first redesign phase, distinct from the prior Bootstrap
  migration.
- The site is a personal/vanity project and a programming/design exercise; keep
  it approachable and understandable.
- Existing images and media assets are a hard constraint.
- The Gallery is open for experimentation with Bootstrap or lightweight
  alternatives, provided the result is mobile-friendly, accessible, simple, and
  maintainable.
