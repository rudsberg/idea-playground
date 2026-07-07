# Idea Playground

A collection of small, self-contained web experiments, published with GitHub Pages.

**Live site:** https://rudsberg.github.io/idea-playground/

## Apps

| App | Path | What it does |
| --- | --- | --- |
| 🏃 Rehab Run Trainer | [`run-rehab/`](run-rehab/) | Run/walk interval trainer with live GPS pace zones. |
| 🃏 Speed Draw | [`cards/`](cards/) | Draw 20 poker cards against the clock — faster is better. |

Each app is a single, dependency-free `index.html` in its own directory.

## Hosting

Pages is served from the `main` branch root (`/`). Every app lives in a
subdirectory and is reachable at `…/idea-playground/<app>/`. A `.nojekyll`
file at the root disables Jekyll so files are served exactly as committed.
