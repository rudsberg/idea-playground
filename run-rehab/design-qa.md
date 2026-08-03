# Design QA

## Comparison target

- Source visual truth: `qa/32-live-level1-progress-one-of-three.png` (production before this change) plus the approved requirement that the current Level always show every required session.
- Browser-rendered implementation: `qa/checklist-one-of-three-390-viewport.png`.
- Combined comparison evidence: `qa/comparison-session-checklist.png`.
- Additional state evidence: `qa/checklist-zero-of-three-390.png`, `qa/checklist-two-of-three-390.png`, and the matching 320px captures.
- Source and implementation viewport: 390 × 844 CSS pixels at device scale factor 1. Both comparison images are 390 × 844 pixels, so no density normalization was required.

## State and intended outcome

The comparison represents Level 1 with one of three prescribed sessions completed. The source only shows the recorded run, making the two remaining sessions invisible. The implementation keeps three stable rows: a completed session with its recorded metrics, a highlighted next session, and a muted upcoming session.

## Full-view comparison evidence

The combined 820px comparison shows that the new checklist preserves the existing navy canvas, program header, Level card, typography, metrics columns, progression bridge, green rail, and locked-Level treatment. The current card grows only by the two intentionally added session rows. At 390px and 320px, `document.documentElement.scrollWidth === innerWidth`; no horizontal overflow is introduced.

## Focused comparison evidence

- The completed row uses a Bootstrap Icons check-circle asset, visible `Completed` text, the session number, date, distance, duration, and pace.
- The next row uses a green outline icon, green left accent, subtle green surface, and visible `Next` text.
- Upcoming rows use a muted outline icon, muted type, visible `Upcoming` text, and em dashes instead of invented metrics.
- The current card remains the same height across 0/3, 1/3, and 2/3 states, preventing layout jumps as sessions are completed.
- At 320px, every label and all four table columns remain readable without clipping or overlap.

## Findings and comparison history

- No actionable P0, P1, or P2 findings remain.
- First implementation comparison: the three status states were distinct, all real metrics remained legible, the 320px layout had no overflow, and no visual correction loop was required.
- P3 observation: the checklist adds 120px to the current Level card. This is intentional and limited to the current Level; completed historical Levels keep their compact recorded-only rows.

## Required fidelity surfaces

- Fonts and typography: retains the system font, established weights, tabular numerals, uppercase micro-labels, and existing 9–22px hierarchy. Session labels remain readable at both tested widths.
- Spacing and layout rhythm: preserves 16px page gutters, existing card radius, 60px row height, metrics alignment, and the established rail-to-card spacing.
- Colors and visual tokens: reuses the existing run green, muted blue-gray, card, border, and background tokens. Status is never communicated by color alone.
- Image quality and asset fidelity: status icons are local SVG assets from Bootstrap Icons rather than text glyphs, emoji, or improvised CSS drawings. They render sharply at device scale factor 1.
- Copy and content: visible labels are `Completed`, `Next`, and `Upcoming`; pending metrics use em dashes and completed metrics remain factual.
- Accessibility and responsiveness: each row has an explicit status in visible text and its accessible label, decorative icon images use empty alt text, and all tested states avoid horizontal overflow.

## Primary interactions tested

- Render Level 1 at 0/3, 1/3, and 2/3 without changing the number or position of rows.
- Convert the next slot into a completed row while retaining recorded metrics.
- After 3/3, unlock Level 2 and render its fresh 0/3 checklist while Level 1 moves into completed history.
- Complete both Level 6 sessions without introducing another locked Level.
- Browser console and page errors: none in the 390px and 320px checklist captures.

final result: passed
