# UI / UX Feature Audit & TODO

This document captures a focused UI/UX audit and a concrete, testable TODO list to bring the repository's frontend(s) to enterprise-grade consistency and usability.

## High-level plan
- Perform audits and small, low-risk fixes in the two UI clients:
  - `ui-client/product-dashboard-react`
  - `ui-client/product-dashboard-angular`
- Implement features incrementally with tests and update the status below after each completion.

## Requirements checklist (extracted from brief)
Each item below must be implemented without changing core business logic or introducing a new UI framework.

- Responsive layout — Status: NOT STARTED
- Loading states and spinners — Status: NOT STARTED
- Global error handling — Status: NOT STARTED
- Toast notifications (success/error) — Status: NOT STARTED
- Pagination for product listing (preserve filters/sorting, accessible) — Status: NOT STARTED
- Featured products carousel — Status: NOT STARTED
- Product image gallery (thumbnail + fallback) — Status: NOT STARTED
- Responsive navigation menu (hamburger/menu button) — Status: NOT STARTED

## Implementation rules (must follow)
- Follow the global enterprise UI system: shared spacing, typography, colors. No ad-hoc styling.
- Buttons:
  - Uniform height & width across app
  - Center-aligned text
  - Clear disabled & loading states
- Product listing:
  - Thumbnail MUST appear in image column
  - Provide a proper fallback image when missing
- Responsive behavior:
  - Add a hamburger/menu button on mobile/tablet
  - The menu button must allow access to full navigation
  - Layout must not break on small screens
- UX:
  - Loading spinners for all async actions
  - Toast notifications for success and error
  - Pagination must preserve filters/sorting and be accessible

## Per-feature tasks, acceptance criteria, and tests

1) Responsive layout
   - Tasks: audit key pages (product listing, product details, nav), add responsive grid/flex rules.
   - Acceptance: pages reflow at common breakpoints (>=1024, 768-1023, <=767). No horizontal scroll.
   - Tests: snapshot + viewport tests (small, medium, large).

2) Loading states & spinners
   - Tasks: add central spinner / inline skeletons for async content. Use consistent spinner component.
   - Acceptance: any async fetch shows spinner; buttons show loading state when submitting.
   - Tests: render while promise pending; assert spinner present.

3) Global error handling
   - Tasks: surface network / unexpected errors to a global handler that triggers toast & logs.
   - Acceptance: uncaught fetch error shows a user-friendly toast and doesn't crash UI.
   - Tests: simulate failed fetch and assert toast + graceful fallback.

4) Toast notifications
   - Tasks: implement/tope a toast system used by components for success/error messages.
   - Acceptance: success and error messages appear, dismissible, and accessible (aria-live).
   - Tests: render toast and assert content + accessibility attributes.

5) Pagination for product listing
   - Tasks: add accessible pagination controls that maintain query params (filters/sort).
   - Acceptance: changing page updates listing, preserves filters/sort; keyboard operable.
   - Tests: navigate pages; assert query string and displayed items.

6) Featured products carousel
   - Tasks: implement accessible carousel with pause/play, keyboard controls, focus management.
   - Acceptance: swipe/arrow/keyboard navigable; screen-reader friendly.
   - Tests: keyboard navigation and structure tests.

7) Product image gallery
   - Tasks: product thumbnails in listing; product detail gallery with lightbox and fallback image.
   - Acceptance: thumbnail column always shows image or fallback; gallery opens full image.
   - Tests: missing-image case uses fallback; gallery opens on click.

8) Responsive navigation menu (hamburger)
   - Tasks: add hamburger visible on small viewports, toggles full navigation; trap focus when open.
   - Acceptance: mobile shows button; nav fully accessible via menu; close on Escape.
   - Tests: responsive render, toggle behavior, focus trap, Escape closes.

## TODO management & status updates
- After completing a feature, update this file and move the Status to DONE with a one-line PR link and date.
- Use the following minimal status template per feature entry:

  - Feature: <name>
    - Status: NOT STARTED / IN PROGRESS / DONE
    - Owner: @<github-handle>
    - PR: <link>
    - Date: YYYY-MM-DD

## Testing (quality gates)
- Component rendering tests (Jest/karma as appropriate in each client)
- Responsive behavior tests (viewport snapshots or Playwright/Cypress for high confidence)
- Loading & error state tests (unit + integration mocks)

Add tests alongside component code. Strive for at least one happy-path unit test plus one edge-case (error/missing data) per changed component.

## Small, low-risk improvements to implement first (proactive)
- Add a shared `components/ui/Button` with standardized sizing, loading and disabled visuals in both clients.
- Add a shared `components/ui/Spinner` and `components/ui/Toast`.
- Add a fallback product image asset and wire it into the product list and detail components.

### Progress (delta)

- Implemented (React client):
   - Feature: Shared UI components (Button, Spinner)
      - Status: DONE
      - Owner: @repo-contributor
      - PR: <local change - committed>
      - Date: 2026-02-04
   - Notes: Added `src/components/ui/Button.js`, `Spinner.js` and `Button.test.js` to `ui-client/product-dashboard-react`.

Next small steps:
- Add `Toast` component and wire global error handling to use it in the React client.
- Add a fallback image asset file and update `Products.js` to reference it (currently it uses an inline SVG fallback).


## Assumptions
- Both `ui-client/product-dashboard-react` and `ui-client/product-dashboard-angular` are active frontends; choose one to implement first depending on ownership.
- No new UI frameworks will be introduced.

## Next steps
1. Pick a single frontend to start (recommend: `product-dashboard-react` for faster iteration).
2. Implement the shared Button, Spinner, Toast, and fallback image.
3. Add tests for the Button and Spinner.
4. Update this file statuses as features are completed.

---
Requirements coverage (initial):

- All items: NOT STARTED

If anything here should live in a different path or be split into separate RFCs, update this file and note the change.
