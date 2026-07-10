// Deterministic navigator.geolocation mock for driving the Rehab Run Trainer in tests.
//
// Simulates a runner heading due north at a constant target pace, delivering one fix per
// second with seeded gaussian position jitter — so test runs are reproducible. Optional
// fault injection: periodically weak-accuracy fixes, and a window where the reported
// position freezes (the signature of a real GPS dropout: coordinates repeat while the
// runner keeps moving).
//
// Usage: await page.addInitScript(mockGeo, { targetPaceSec: 390, jitterM: 4, seed: 42 });
// The function is serialized into the page, so it must stay fully self-contained.

function mockGeo(cfg) {
  const TARGET_SPEED = 1000 / cfg.targetPaceSec;           // m/s
  const JITTER_M = cfg.jitterM ?? 4;                        // gaussian stddev, metres
  const WEAK_EVERY = cfg.weakEvery ?? 0;                    // every Nth fix reports accuracy 60m (0 = never)
  const FREEZE_FROM = cfg.freezeFrom ?? 0;                  // position freezes during [from, to) ticks
  const FREEZE_TO = cfg.freezeTo ?? 0;
  const START_LAT = 57.7089, START_LON = 11.9746;
  const M_PER_DEG_LAT = 111320;

  let seed = cfg.seed ?? 1;
  const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const gauss = () => {
    let u = 0, v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const t0 = Date.now();
  let tick = 0, frozenLat = null, frozenLon = null;

  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: {
      watchPosition(success) {
        const id = setInterval(() => {
          tick++;
          const trueDist = TARGET_SPEED * tick;
          let lat = START_LAT + (trueDist + gauss() * JITTER_M) / M_PER_DEG_LAT;
          let lon = START_LON + (gauss() * JITTER_M) / (M_PER_DEG_LAT * Math.cos(START_LAT * Math.PI / 180));
          if (FREEZE_TO > FREEZE_FROM && tick >= FREEZE_FROM && tick < FREEZE_TO) {
            if (frozenLat == null) { frozenLat = lat; frozenLon = lon; }
            lat = frozenLat; lon = frozenLon;               // frozen receiver still reports good accuracy
          } else {
            frozenLat = null;
          }
          const weak = WEAK_EVERY > 0 && tick % WEAK_EVERY === 0;
          success({
            coords: { latitude: lat, longitude: lon, accuracy: weak ? 60 : 5, speed: null, speedAccuracy: null },
            timestamp: t0 + tick * 1000,                    // synthetic 1Hz clock, no event-loop drift
          });
        }, 1000);
        window.__geoIds = window.__geoIds || [];
        window.__geoIds.push(id);
        return 1;
      },
      clearWatch() {
        (window.__geoIds || []).forEach(clearInterval);
        window.__geoIds = [];
      },
    },
  });
}

module.exports = { mockGeo };
