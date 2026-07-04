# Rehab Run Trainer

A self-contained, single-file web app for guided run/walk rehabilitation
sessions with live GPS pace-zone feedback. No build step, no dependencies —
just `index.html`.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/run-rehab/
```

GPS pace tracking requires HTTPS (or `localhost`) and location permission.

## Live site

Served via GitHub Pages at `run-rehab/` (see repo root README for setup).
