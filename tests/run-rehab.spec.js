// @ts-check
// Drives a full run/walk workout against the real app with a simulated GPS feed:
// a runner holding exactly the target pace (6:30/km) with realistic jitter, occasional
// weak-accuracy fixes, and a 12s frozen-GPS dropout injected mid-set-2.
//
// Verifies the pace engine's core guarantees:
//   1. Per-set warm-up: no pace is shown until a set has ~10s of clean run-only data
//      ("Measuring…"), so walking speed can never contaminate a run reading.
//   2. Once shown, the set average stays in a sane band around the true pace and the
//      end-of-set recap is honest.
//   3. A frozen-GPS dropout is surfaced as "Weak GPS" (holding the last good value)
//      instead of a phantom slow pace, and does not poison the averages.
//   4. The session average accumulates across sets and lands near the true pace.
//
// Runs in wall-clock time (~2 min) because the app's interval clock is real.

const { test, expect } = require('@playwright/test');
const path = require('path');
const { mockGeo } = require('./helpers/mock-geo');

const APP = 'file://' + path.resolve(__dirname, '../run-rehab/index.html');
const TARGET_PACE_SEC = 390; // 6:30/km — the app's default Tempo

const parsePace = txt => {
  const m = /^(\d+):(\d{2})$/.exec(txt.trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

test('pace engine: warm-up, set averages, dropout robustness, session average', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));

  // Freeze ticks 63–75: inside set 2 (run 2 spans ~48–78s) but AFTER its ~10s warm-up,
  // so a pace is already on screen when the receiver freezes — exercising the
  // "hold last good value + Weak GPS badge" path rather than the silent warm-up path.
  await page.addInitScript(mockGeo, {
    targetPaceSec: TARGET_PACE_SEC, jitterM: 4, seed: 42, weakEvery: 17,
    freezeFrom: 63, freezeTo: 75,
  });
  await page.goto(APP);

  // Configure run 30s / walk 15s / 2 sets (defaults are 60/120/10).
  for (let i = 0; i < 2; i++) await page.click('button[data-step="run"][data-d="-15"]');
  for (let i = 0; i < 7; i++) await page.click('button[data-step="walk"][data-d="-15"]');
  for (let i = 0; i < 8; i++) await page.click('button[data-step="sets"][data-d="-1"]');
  await expect(page.locator('#runVal')).toHaveText('0:30');
  await expect(page.locator('#walkVal')).toHaveText('0:15');
  await expect(page.locator('#setsVal')).toHaveText('2');

  await page.click('#mainBtn'); // Start: 3s ready + (30+15)×2 = 93s

  // Sample the pace panel once per second for the whole workout.
  const samples = [];
  for (let i = 0; i < 110; i++) {
    await page.waitForTimeout(1000);
    const done = await page.locator('#doneView').evaluate(el => !el.classList.contains('hidden'));
    samples.push({
      t: i,
      phase: await page.locator('#phaseLabel').textContent(),
      now: (await page.locator('#paceNow').textContent())?.trim(),
      ses: (await page.locator('#paceSession').textContent())?.trim(),
      status: (await page.locator('#paceStatus').textContent())?.trim(),
      done,
    });
    if (done) break;
  }
  expect(samples.at(-1)?.done, 'workout should reach the done screen').toBe(true);
  expect(errors, 'no page errors').toEqual([]);

  // Split samples into segments (run1, walk1, run2, walk2) by phase transitions.
  const segs = [];
  for (const s of samples) {
    if (!segs.length || segs.at(-1).phase !== s.phase) segs.push({ phase: s.phase, rows: [] });
    segs.at(-1).rows.push(s);
  }
  const runs = segs.filter(s => s.phase === 'RUN');
  const walks = segs.filter(s => s.phase === 'WALK');
  expect(runs.length, 'two run segments observed').toBe(2);
  expect(walks.length, 'two walk segments observed').toBe(2);

  for (const [i, run] of runs.entries()) {
    // 1. Warm-up: the first ~7s of each run set must show no pace, status Measuring…
    const early = run.rows.slice(0, 7);
    for (const r of early) {
      expect(r.now, `set ${i + 1} t=${r.t}: no pace during warm-up`).toBe('--:--');
      expect(['Measuring…', 'Locating…', 'Weak GPS']).toContain(r.status);
    }
    // 2. A pace must appear later in the set, within a sane band of the true 6:30/km.
    const shown = run.rows.filter(r => r.now !== '--:--');
    expect(shown.length, `set ${i + 1}: pace eventually shown`).toBeGreaterThan(3);
    for (const r of shown) {
      const p = parsePace(r.now);
      expect(p, `set ${i + 1} t=${r.t}: parsable pace`).not.toBeNull();
      // 3. Never a phantom slow reading (the old dropout failure mode was ~9:00/km).
      expect(p).toBeGreaterThan(TARGET_PACE_SEC * 0.72);  // faster than ~4:41 → nonsense
      expect(p).toBeLessThan(TARGET_PACE_SEC * 1.35);     // slower than ~8:46 → nonsense
    }
  }

  // 3b. The injected freeze must surface as a "Weak GPS" status at least once in set 2.
  expect(runs[1].rows.some(r => r.status === 'Weak GPS'),
    'frozen-GPS dropout surfaces as Weak GPS').toBe(true);

  // 2b. Walk recaps hold the finished set's average, in band.
  for (const [i, walk] of walks.entries()) {
    const recap = parsePace(walk.rows[1]?.now ?? '');
    expect(recap, `walk ${i + 1} recap parsable`).not.toBeNull();
    expect(recap).toBeGreaterThan(TARGET_PACE_SEC * 0.8);
    expect(recap).toBeLessThan(TARGET_PACE_SEC * 1.25);
    // Recap must hold steady for the whole walk.
    const uniq = new Set(walk.rows.map(r => r.now));
    expect(uniq.size, `walk ${i + 1} recap frozen`).toBe(1);
  }

  // 1b. Set 2's warm-up resets the set display while the session average persists.
  const run2Early = runs[1].rows.slice(0, 5);
  expect(run2Early.every(r => r.now === '--:--'), 'set 2 restarts from Measuring…').toBe(true);
  expect(run2Early.every(r => parsePace(r.ses) !== null), 'session avg persists through set 2 warm-up').toBe(true);

  // 4. Session average converges near the true pace, and the summary reports it.
  const lastSes = parsePace(samples.at(-1).ses);
  expect(lastSes).toBeGreaterThan(TARGET_PACE_SEC * 0.85);
  expect(lastSes).toBeLessThan(TARGET_PACE_SEC * 1.15);
  const summary = await page.locator('#doneSummary').textContent();
  const m = /Session avg run pace (\d+):(\d{2})\/km/.exec(summary ?? '');
  expect(m, `summary reports a session pace (got: ${summary})`).not.toBeNull();
  const sumPace = Number(m[1]) * 60 + Number(m[2]);
  expect(sumPace).toBeGreaterThan(TARGET_PACE_SEC * 0.85);
  expect(sumPace).toBeLessThan(TARGET_PACE_SEC * 1.15);
});

test('tempo stepper drives the target shown in the gauge and hint', async ({ page }) => {
  await page.addInitScript(mockGeo, { targetPaceSec: 390, jitterM: 4, seed: 7 });
  await page.goto(APP);
  await expect(page.locator('#paceVal')).toHaveText('6:30');
  await page.click('button[data-step="pace"][data-d="5"]');   // +5s → 6:35
  await page.click('button[data-step="pace"][data-d="5"]');   // +5s → 6:40
  await expect(page.locator('#paceVal')).toHaveText('6:40');
  await expect(page.locator('#runPaceLbl')).toHaveText('at 6:40 /km');
  await page.click('#mainBtn');
  await expect(page.locator('#gaugeTargetLbl')).toHaveText('6:40');
});
