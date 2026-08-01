# Rehab Run Trainer

A self-contained, single-file web app for guided run/walk rehabilitation
sessions with live GPS pace-zone feedback and on-device progress history. Workout
settings and completed sessions stay in the browser's local storage; no account or
server-side data store is used.

Completed workouts are grouped automatically by their run time, walk time, and set
count. The progress view compares interval duration, planned running time, and
measured distance between workout groups.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/run-rehab/
```

GPS pace tracking requires HTTPS (or `localhost`) and location permission.
The in-zone pace window is the selected tempo plus or minus 20 seconds per kilometre.

## Live site

Served via GitHub Pages at `run-rehab/` (see repo root README for setup).
