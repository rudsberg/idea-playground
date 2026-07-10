// @ts-check
// Speed Draw: full 20-draw game, timer semantics, and best-time scoreboard reset.

const { test, expect } = require('@playwright/test');
const path = require('path');

const APP = 'file://' + path.resolve(__dirname, '../cards/index.html');

test('a 20-draw game stops the timer, blocks extra draws, and records a best time', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(APP);

  await expect(page.locator('#clearBtn')).toBeDisabled(); // no best recorded yet

  for (let i = 0; i < 20; i++) {
    await page.click('#drawBtn');
    await page.waitForTimeout(15);
  }
  await expect(page.locator('#drawnN')).toHaveText('20');
  await expect(page.locator('#timer')).toHaveClass(/done/);
  await expect(page.locator('#drawBtn')).toBeDisabled();
  await expect(page.locator('#best')).toContainText('New best');
  await expect(page.locator('#clearBtn')).toBeEnabled();

  // A 21st draw must be impossible (button disabled; stage tap is a no-op).
  await page.click('#stage');
  await expect(page.locator('#drawnN')).toHaveText('20');
  expect(errors).toEqual([]);
});

test('stage tap draws, restart resets the round, clear-best wipes the scoreboard', async ({ page }) => {
  await page.goto(APP);

  await page.click('#stage'); // the whole card area is a draw target
  await expect(page.locator('#drawnN')).toHaveText('1');

  await page.click('#restartBtn');
  await expect(page.locator('#drawnN')).toHaveText('0');

  for (let i = 0; i < 20; i++) {
    await page.click('#stage');
    await page.waitForTimeout(10);
  }
  await expect(page.locator('#best')).toContainText('New best');

  page.once('dialog', d => d.accept()); // confirm() guard on clearing
  await page.click('#clearBtn');
  await expect(page.locator('#best')).toHaveText('Best time: —');
  await expect(page.locator('#clearBtn')).toBeDisabled();
});
