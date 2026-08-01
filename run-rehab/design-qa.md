# Design QA

## Comparison target

- Source visual truth: `qa/source-option-2.png`
- Implementation screenshot: `qa/progress-390x844-pass2.png`
- Combined comparison: `qa/comparison-pass2.png`
- Source pixels: 853 × 1844, normalized by browser rendering to 390 × 844.
- Implementation pixels: 390 × 844.
- CSS viewport: 390 × 844 at device scale factor 1.
- State: progress history with three sessions in each of two workout groups and one progression transition.

## Full-view comparison evidence

The source and implementation were rendered together in `qa/comparison-pass2.png`. Both use the same dark navy mobile surface, strong green/blue interval heading, compact table rows, current-workout emphasis, and a longer stepped transition between workout groups. The implementation intentionally keeps the requested aggregate running and walking totals above the latest group and uses text-first transition steps so the dynamic percentages remain legible.

No actionable P0, P1, or P2 mismatch remains. The implementation is slightly more vertically spacious than the concept and therefore scrolls, which is acceptable for variable-length real history and preserves readable tap/text sizing.

## Focused region comparison evidence

- Header and first group: the visual hierarchy, weights, colors, border treatment, and four-column session table match the selected direction.
- Progression transition: the implementation preserves the stepped offsets, green connecting rail, purple percentage emphasis, and longer separation between workout groups.
- Previous group: heading and table structure repeat consistently and remain readable below the fold.

## Findings

No P0/P1/P2 findings.

## Required fidelity surfaces

- Fonts and typography: system sans-serif matches the source's mobile UI character; bold tabular numerals and compact muted labels preserve the hierarchy without clipping.
- Spacing and layout rhythm: 16px mobile gutters, 20px group radii, compact table rows, and the extended transition gap match the source intent. Dynamic history scrolls vertically without horizontal overflow.
- Colors and visual tokens: `#0b1020`, `#151b30`, `#22c55e`, `#38bdf8`, `#a78bfa`, near-white, and muted blue-gray map directly to the selected concept.
- Image quality and asset fidelity: the screen requires no raster imagery. The source's illustrative icons were omitted in favor of dynamic text content; no placeholder images or fake image assets are present.
- Copy and content: phase terminology is absent; current workout, newest-first sessions, aggregate distances, and progression comparisons are coherent and populated from stored workout data.
- Accessibility and responsiveness: native buttons remain keyboard/touch accessible; history has no horizontal overflow at 320px, 390px, or 768px; live halfway feedback uses a status region.

## Primary interactions tested

- Open progress from setup and return with Back.
- Restore last-used run, walk, set, and tempo values after reload.
- Render two automatically grouped workout chapters newest-first.
- Calculate +100% run interval and +60% total running transitions.
- Announce and display the halfway turn-back cue exactly once.
- Apply the ±20 seconds/km pace zone.
- Complete the existing real-time GPS warm-up, dropout, pace, and finish-summary flow.
- Browser console and page errors: none during the visual and responsive checks.

## Responsive evidence

- 320 × 844: document width 320, no horizontal overflow.
- 390 × 844: document width 390, no horizontal overflow.
- 768 × 844: document width 768, no horizontal overflow; content remains capped to a readable column.

## Comparison history

- Initial pass: browser evidence was unavailable, so QA was blocked.
- Pass 1: functional screenshot captured; aggregate copy wrapped with an orphaned final word.
- Fix: aggregate content was split into two balanced semantic spans with responsive wrapping.
- Pass 2: combined source/implementation comparison found no actionable P0/P1/P2 issues; responsive and interaction checks passed with no browser errors.

## Follow-up polish

- [P3] A future icon-library pass could replace the textual Back control and add the concept's decorative transition icons. This is non-blocking and does not affect comprehension or use.

final result: passed
