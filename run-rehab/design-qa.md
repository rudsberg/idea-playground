# Design QA

## Comparison target

- Source visual truth: `qa/05-current-start-audit.png` and the existing Progress references in `qa/13-target-pace-progress-390.png` / `qa/13-target-pace-progress-320.png`.
- Combined source/implementation evidence: `qa/20-program-comparison.png`.
- Program selection: `qa/14-program-select-390.png` and `qa/14-program-select-320.png`.
- Program preview: `qa/15-program-preview-390.png` and `qa/15-program-preview-320.png`.
- Guided next session: `qa/16-next-program-session-390.png` and `qa/16-next-program-session-320.png`.
- New-user roadmap: `qa/17-program-roadmap-390.png` and `qa/17-program-roadmap-320.png`.
- Migrated Level 6 state: `qa/18-migrated-level-6-390.png` and `qa/19-migrated-roadmap-390.png`.
- Source and viewport implementation captures use device scale factor 1. Phone viewport captures are 390 × 844 and 320 × 844 CSS pixels; full-page roadmap captures preserve the same CSS width.

## State and intended outcome

The existing dark mobile trainer is the visual source. The new flow must prevent a first-time user from entering the trainer until they open and accept the single available program, then replace manual level creation with a prescribed next session and a locked six-level roadmap. Existing local history must migrate into the program without inventing Joel's missing second Level 4 run.

## Full-view comparison evidence

`qa/20-program-comparison.png` places the source trainer, program selection, and program preview in one normalized comparison. The new screens preserve the navy canvas, system typeface, green primary action, blue/green workout semantics, compact uppercase labels, 16–22px card radii, and 20px mobile gutters. The onboarding screens add a stronger explanatory hierarchy without introducing a competing visual system.

The guided home state keeps the source header and bottom action position. Its content now reads in the intended order: current Level, prescribed workout, required-session progress, tertiary custom action, then Start next session.

The roadmap retains the existing compact one-row progression bridge and charging green rail. The current Level has exactly one glowing position marker; future Levels are readable but visibly subdued and labeled Locked. Completed history remains detailed and honest, including `1 of 2 sessions recorded` at Level 4.

## Focused comparison evidence

- At 320px, the program preview keeps all six prescriptions and the Accept program CTA within the page width; the title wraps intentionally without colliding with Back or Program preview.
- At 320px, all three progression metrics remain on one row with no horizontal overflow.
- At 390px, migrated history makes Level 6 current and shows Level 4 as completed through advancement while retaining the one recorded session.
- Browser measurements report `scrollWidth === innerWidth` at 320px and 390px for program selection and preview.

## Findings and comparison history

- No actionable P0, P1, or P2 differences remain.
- The first comparison showed no structural overflow, clipped controls, unreadable locked states, or hierarchy regressions, so no visual fix loop was required.
- P3 observation: the preview title wraps to two lines at 320px. This is acceptable because the program name remains the strongest element and the six-level list plus CTA stay visible without compression.

## Required fidelity surfaces

- Fonts and typography: preserves the existing system font, optical weights, tabular numeric values, uppercase micro-labels, and 9–32px mobile hierarchy. Headings and prescriptions remain readable at both tested widths.
- Spacing and layout rhythm: preserves 20px onboarding gutters, 16px Progress gutters, 8–18px internal spacing, and the source card radii. Primary actions remain comfortably tappable and visually anchored.
- Colors and visual tokens: reuses the established background, card, border, run green, walk blue, muted text, and charging green progression palette. Locked states use opacity and muted borders without losing legibility.
- Image quality and asset fidelity: the referenced product screens contain no raster product imagery, illustrations, logos, or non-standard icon assets. No placeholder imagery was introduced.
- Copy and content: the program name, all six prescriptions, 15-session total, 6:30/km target, acceptance language, next-session language, custom-session boundary, and locked prerequisites match the approved model.
- Accessibility and responsiveness: onboarding uses semantic buttons, the program card has an explicit accessible label, locked cards expose state in text, the progress strip has an accessible completion label, and no tested state has horizontal overflow.

## Primary interactions tested

- Open the only available program, return to selection, reopen it, and explicitly accept it.
- Persist acceptance on the device and enter Level 1, session 1 of 3.
- Automatically migrate existing history and prescribe Level 6, session 1 of 2.
- Keep a missing Level 4 session visible without blocking already-reached Levels.
- Unlock Levels from fixed required-session counts and show a complete state after both Level 6 sessions.
- Configure a custom run outside program progression and return to the prescribed program session.
- Render current, locked, completed, and program-complete Progress states.
- Preserve GPS pace measurement, ±20-second target tolerance, halfway cue, audio, private backfill, and duplicate-safe import.
- Browser console and page errors: none in the captured onboarding, preview, guided session, new-user roadmap, and migrated Level 6 states.

final result: passed
