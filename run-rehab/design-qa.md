# Design QA

## Comparison target

- Source visual truth: `qa/05-current-start-audit.png`
- Primary implementation: `qa/06-next-workout-390.png`
- Level-up state: `qa/07-level-up-390.png`
- Custom-session state: `qa/08-custom-session-390.png`
- Updated progress screen: `qa/09-level-progress-390.png`
- Narrow responsive pass: `qa/11-next-workout-320-pass2.png`
- Combined source/implementation evidence: `qa/10-level-picker-comparison.png`
- Source and implementation: 390 × 844 pixels at device scale factor 1.

## State and intended outcome

The existing start screen is the visual source. The selected product change adds a decision layer for continuing the current Level, progressing to a new Level, or configuring a secondary custom session without changing the established dark mobile visual language.

## Full-view comparison evidence

The combined comparison shows that the implementation preserves the source header, dark navy canvas, single contained workout editor, green primary action, typography family, control shapes, and bottom action placement. The new current-Level context and two-option selector occupy previously unused vertical space rather than compressing the workout controls.

The hierarchy now reads in the required order: current Level context, next-session decision, workout configuration, tertiary custom action, then Start. The primary action remains visible at 320 × 568, 320 × 667, 320 × 844, and 390 × 844.

## Focused-state evidence

- Another session: run, walk, and set controls are visibly locked while tempo remains adjustable; the button reads `Start Level 5`.
- Level up: the selected state is clear, structural controls unlock, and the compact comparison shows live run-interval and total-running percentages. Start remains disabled until the Level recipe changes.
- Custom session: neither standard path appears selected, the editor is labeled as outside progression, and the supporting copy explains where the session will be stored.
- Progress: all visible Phase terminology has been replaced by Level, while the single current-position marker and charging rails remain intact.

## Findings and iteration history

- [P2 resolved] At 320px, the original absolute Progress action overlapped the centered product title.
  - Fix: converted the header to a three-column grid and tightened the narrow breakpoint typography.
  - Post-fix evidence: `qa/11-next-workout-320-pass2.png` shows clear separation with no horizontal overflow.
- No remaining actionable P0, P1, or P2 findings.

## Required fidelity surfaces

- Fonts and typography: the existing system typeface, weights, uppercase labels, tabular values, and compact mobile scale are preserved. New labels use the same 10–13px hierarchy as Progress.
- Spacing and layout rhythm: the new sections use the existing 8–16px rhythm, 16px page gutters, and 16–20px radii. The bottom action remains visually anchored.
- Colors and tokens: Level progression uses the established run green; walking remains blue; secondary and disabled states use existing muted and ring-track tokens.
- Image quality and assets: this screen contains no raster imagery or non-standard icon assets. Existing text controls are preserved; no placeholder visual assets were introduced.
- Copy and content: `Level`, `Another session`, `Level up`, and `Custom session` match the selected terminology and mental model. Custom copy explicitly states that the session does not affect progression.
- Accessibility and responsiveness: choice buttons expose tab roles and selected state, disabled controls use native semantics, the live progression preview uses an announced region, and no horizontal overflow appears at tested widths.

## Primary interactions tested

- Continue the current Level with locked structural settings and adjustable tempo.
- Select Level up, edit the Level recipe, see live progression deltas, and enable the next-Level start action.
- Select a custom session and unlock all configuration controls without assigning a Level.
- Restore the latest Level recipe after reload or import.
- Migrate legacy history into stable Level numbers.
- Keep custom sessions in aggregate totals while rendering them under Other sessions rather than in the Level ladder.
- Render five imported Levels newest-first with exactly one current-position marker.
- Preserve pace-zone, halfway cue, GPS handling, audio, and completion behavior.
- Browser console and page errors: none in setup-state, Level-up, custom-session, and Progress captures.

final result: passed
