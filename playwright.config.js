// @ts-check
const { defineConfig } = require('@playwright/test');

// The run-rehab spec drives a real workout in wall-clock time (~2 min), so the
// per-test timeout is generous. Specs run in parallel, one browser each.
module.exports = defineConfig({
  testDir: './tests',
  timeout: 300_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    viewport: { width: 420, height: 900 },
  },
});
