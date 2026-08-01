# Design QA

## Comparison target

- Audit baseline: `qa/01-current-progress-audit.png`
- Revised implementation: `qa/02-revised-progress.png`
- Narrow responsive check: `qa/revised-320.png`
- Wide responsive check: `qa/revised-768.png`
- CSS viewports: 320, 390, and 768 × 844 at device scale factor 1.
- State: imported 11-session history, rendered newest-first across five inferred phases.

## Audit findings

- The previous comparison band looked like a detached statistics card. It did not name the two workout groups it compared, so its role was ambiguous.
- Group headings were visually dominant while table labels and session values were comparatively cramped.
- The green connector indicated sequence but not direction or meaning.
- Reconstructed sessions carried estimate badges even though the product has no estimate state or workflow.

## Implemented design response

- Every chronological workout group is inferred as Phase 1, Phase 2, and so on. The latest group adds a quiet Current label.
- Each connector is now explicitly labeled Progression and shows the direction, for example `Phase 4 → Phase 5`, before the run interval, total running, and distance changes.
- A battery-like rail charges from deep green at the older phase to a bright, softly glowing endpoint at the newer phase. The compact inset comparison card keeps the relationship clear without consuming excessive vertical space.
- Group padding, radii, title sizing, table column rhythm, row height, and numeric alignment were normalized for a clearer hierarchy.
- Estimate badges, estimate-specific model fields, import copy, and history copy were removed.

## Visual QA result

The revised 390px rendering keeps the five-phase history within a 1,944px document, compared with 1,870px for the ambiguous unlabeled version. The 74px increase buys explicit phase-to-phase comprehension while remaining substantially more compact than the original 2,321px stepped layout. No horizontal overflow, clipping, overlap, or unreadable wrapping appears at 320px, 390px, or 768px.

No actionable P0, P1, or P2 visual issue remains.

## Required fidelity surfaces

- Typography: compact system sans-serif, 20–22px workout titles, 10px phase labels, 13px row values, and tabular numerals maintain a clear hierarchy.
- Spacing: 16px page gutters, 14–16px group interiors, 60px session rows, and 10px progression gaps follow a consistent compact rhythm.
- Color: green communicates run/progression, blue communicates walking, and muted blue-gray supports secondary labels without competing with the data.
- Responsiveness: body width equals viewport width at 320px, 390px, and 768px; the history column remains capped at 620px.
- Accessibility: native navigation buttons remain keyboard/touch accessible, and every progression bridge has a descriptive `aria-label` naming both phases.

## Interaction and regression coverage

- Phase numbering is inferred from oldest to newest while the page remains newest-first.
- Matching workouts continue to group automatically.
- Progression percentages still calculate run interval, total running, and distance changes.
- The private 11-session backfill remains idempotent and renders five phases.
- No estimate label appears in import or history views, including previously stored records that contain the old field.
- Setup remains phase-free, last-used settings persist, the ±20 seconds/km pace zone remains active, and the halfway cue still fires once.

final result: passed
