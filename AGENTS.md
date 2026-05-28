# Codex Guidance

Use this file as the persistent project guidance for Codex sessions using Bootstrap.

## Working Principles

- Preserve existing behavior unless the task explicitly changes it.
- Keep changes scoped to the current task; avoid unrelated refactors, formatting churn, or cleanup.
- Prefer existing project patterns over introducing new abstractions.
- When replacing Bootstrap classes or components, check the surrounding UI for matching spacing, alignment, responsiveness, and interaction states.
- Maintain accessibility behavior, including labels, focus states, keyboard interaction, ARIA attributes, and semantic HTML.
- Treat responsive behavior as part of the task, not a follow-up.
- Do not remove existing tests or weaken assertions to make the code changes pass.

## Before Editing

- Read the affected component, nearby styles, and any existing tests before changing code.
- Check whether the project already has a preferred pattern for Bootstrap utilities or components.
- Note any user changes in the working tree and work with them; do not revert unrelated edits.

## Implementation

- WOrk on one coherent area at a time.
- Keep visual and behavioral parity unless the requested task says otherwise.
- Avoid broad CSS overrides that may affect unrelated pages.
- Use small helper components only when they reduce real duplication or match an existing pattern.

## Verification

- Run the relevant tests or checks for the touched area.
- For visible UI changes, inspect the result in a browser when practical.
- Check desktop and mobile layouts for text wrapping, spacing, alignment, and overlap.
- Call out anything not verified, especially visual parity or unavailable test coverage.

## Project-Specific Notes

- Add exact migration rules here as they come up, such as preferred component libraries, class replacement mappings, branch strategy, or pages that should not be touched.

## Example prompt from Bootstrap migration project

You are migrating a web project from Bootstrap 3.3.5 to Bootstrap 5.3.

Your goals:

<!--
- Preserve the exact visual layout and behavior as closely as possible

- Update deprecated Bootstrap 3 classes to Bootstrap 5 equivalents

- Do NOT redesign or simplify the UI

- Do NOT remove elements unless absolutely necessary

- Keep the structure as similar as possible

Key migration rules:

- Replace Bootstrap 3 classes with Bootstrap 5 equivalents

  (e.g., col-xs-* → col-*, pull-right → float-end, etc.)

- Convert removed components:

  - panels → cards

  - wells → utility spacing (p-3, bg-light, etc.)

- Update grid and spacing carefully (Bootstrap 5 uses flexbox and different gutters)

- Replace Glyphicons with placeholder comments (do not add new icon libraries)

- Remove jQuery dependencies ONLY if they relate to Bootstrap components

- Convert Bootstrap JS usage to Bootstrap 5 vanilla JS API

- Update data attributes:

  - data-toggle → data-bs-toggle

  - data-target → data-bs-target

Constraints:

- Do NOT introduce new frameworks

- Do NOT rewrite unrelated JavaScript

- Do NOT change IDs, names, or backend hooks

- Keep code clean and minimal

Output:

- Provide the fully updated code

- Briefly list any changes that may affect layout or behavior
-->
