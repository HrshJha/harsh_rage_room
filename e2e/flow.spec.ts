import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function enter(page: Page, level = '01A little annoyed') {
  await page.goto('/');
  await page.getByPlaceholder('Enter your name...').fill('Aman');
  await page.getByRole('button', { name: 'ENTER THE RAGE ROOM' }).click();
  await page.getByRole('button', { name: 'YES, EXTREMELY.' }).click();
  await page.getByRole('button', { name: new RegExp(level) }).click();
  await page.getByRole('button', { name: 'TAKE ME TO THE ROOM' }).click();
  await expect(page.getByTestId('stage')).toBeVisible();
}
async function hit(page: Page) {
  await page.getByTestId('stage').click({ position: { x: 20, y: 190 } });
}
test.beforeEach(async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: { token: 'test-token', sid: 'test-sid', expiresAt: Date.now() / 1000 + 1800 },
    }),
  );
  await page.route('**/api/notify', (route) =>
    route.fulfill({ status: 202, json: { ok: true, mode: 'dry-run' } }),
  );
});
test('revenge path, complaint, attacks, sentence and PNG export', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await enter(page, 'A little annoyed');
  await page.getByRole('button', { name: 'FILE A COMPLAINT' }).click();
  await expect(page.getByText('Filed by Aman')).toBeVisible();
  await page.getByRole('button', { name: 'Left me on seen', exact: true }).click();
  await page.getByRole('button', { name: 'COMPLAINT NOTED' }).click();
  await page.getByRole('button', { name: 'Slap', exact: true }).dblclick();
  await expect(page.getByRole('status').last()).toContainText('Attack 1');
  await expect(page.getByRole('button', { name: /Thunder, requires/ })).toBeDisabled();
  await page.screenshot({ path: `test-results/${info.project.name}-room.png`, fullPage: true });
  await page.getByRole('button', { name: 'I’M DONE' }).click();
  await page.getByRole('button', { name: 'SKIP THE LEGAL DRAMA' }).click();
  await page.getByRole('button', { name: 'SPIN THE SENTENCE' }).click();
  await page.getByRole('button', { name: 'MAKE IT OFFICIAL' }).click();
  await expect(page.getByRole('heading', { name: 'Aman', exact: true })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'DOWNLOAD PNG' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/HRR-.*\.png/);
  await file.saveAs(`test-results/${info.project.name}-certificate.png`);
  await expect(page.getByRole('status')).toContainText('downloaded');
  await page.screenshot({
    path: `test-results/${info.project.name}-certificate-page.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
  await page.getByRole('button', { name: 'ANOTHER ROUND' }).click();
  await expect(page.getByTestId('stage')).toBeVisible();
  await expect(page.getByRole('status').last()).toHaveText('');
});
test('NO path holds scan, chooses compliments, earns kindness certificate', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'ENTER THE RAGE ROOM' }).click();
  await page.getByRole('button', { name: 'NO, HE’S ALRIGHT…' }).click();
  const pad = page.getByRole('button', { name: 'Hold to scan for 1.8 seconds' });
  await pad.focus();
  await page.keyboard.down('Space');
  await expect(page.getByRole('heading', { name: 'LIE DETECTED.' })).toBeVisible();
  await page.keyboard.up('Space');
  await page.getByRole('button', { name: 'STILL NO.' }).click();
  await page.getByRole('button', { name: 'He has excellent taste in friends.' }).click();
  await page.getByRole('button', { name: 'He always has a chai plan.' }).click();
  await page.getByRole('button', { name: 'SEND SOME LOVE' }).click();
  await expect(page.getByRole('heading', { name: /UNNECESSARY\s*KINDNESS/ })).toBeVisible();
});
test('keyboard play, Calm mode, offline resilience and no horizontal overflow', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByLabel('Calm Chaos').check();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await enter(page, 'Pretty angry');
  await page.locator('main').focus();
  await page.keyboard.press('2');
  await page.keyboard.press('Space');
  await expect(page.getByRole('status').last()).toContainText('Attack 1');
  await expect(page.getByTestId('stage')).toHaveAttribute('aria-busy', 'false');
  await page.context().setOffline(true);
  await page.keyboard.press('1');
  await page.keyboard.press('Space');
  await expect(page.getByRole('status').last()).toContainText('Attack 2');
  await page.context().setOffline(false);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
test('all weapon controls and rage-gated ultimate', async ({ page }) => {
  await enter(page, 'Beyond human limits');
  for (const name of [
    'Slap',
    'Punch',
    'Chappal',
    'Bonk',
    'Tomato',
    'Roast Harsh',
    'Thunder',
    'Emotional',
  ])
    await expect(page.getByRole('button', { name, exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Emotional', exact: true }).dblclick();
  await expect(page.getByRole('status').last()).toContainText('Attack 1');
  await expect(page.getByRole('button', { name: /Thunder, requires/ })).toBeDisabled();
});
test('rapid taps do not stack hero attacks or break the scene', async ({ page }) => {
  await enter(page, 'A little annoyed');
  for (let i = 0; i < 20; i++) await hit(page);
  await expect(page.getByTestId('stage')).toBeVisible();
  await expect(page.getByRole('button', { name: 'I’M DONE' })).toBeEnabled();
  await page.getByRole('button', { name: 'I’M DONE' }).click();
  await expect(page.getByRole('heading', { name: 'THE VERDICT IS IN.' })).toBeVisible();
});
test('landing and arena meet serious accessibility checks', async ({ page }, info) => {
  await page.goto('/');
  await page.screenshot({ path: `test-results/${info.project.name}-landing.png`, fullPage: true });
  let results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((v) => ['serious', 'critical'].includes(v.impact || '')),
  ).toEqual([]);
  await enter(page, 'A little annoyed');
  await expect(page.locator('.fight-intro')).toHaveCount(0);
  results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((v) => ['serious', 'critical'].includes(v.impact || '')),
  ).toEqual([]);
});

test('every attack commits one result, including roast and both ultimates', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'desktop',
    'Distinct attack sequences are exercised once; shared input paths run on all engines.',
  );
  for (const weapon of [
    'Slap',
    'Punch',
    'Chappal',
    'Bonk',
    'Tomato',
    'Roast Harsh',
    'Thunder',
    'Emotional',
  ]) {
    await enter(page, 'Beyond human limits');
    if (weapon === 'Roast Harsh') {
      await page.getByRole('button', { name: weapon, exact: true }).click();
      await page
        .getByPlaceholder('Harsh, your coding skills need a software update...')
        .fill('Your code needs a nap.');
      await page.getByRole('button', { name: 'SEND ROAST' }).click();
    } else await page.getByRole('button', { name: weapon, exact: true }).dblclick();
    await expect(page.getByRole('status').last()).toContainText('Attack 1.');
    await expect(page.getByTestId('stage')).toHaveAttribute('aria-busy', 'false');
    await expect(page.getByRole('status').last()).toContainText('Attack 1.');
  }
});

test('small phone and landscape keep the entire weapon dock reachable', async ({ page }, info) => {
  test.skip(
    info.project.name !== 'desktop',
    'Viewport geometry needs one deterministic browser pass.',
  );
  for (const viewport of [
    { width: 360, height: 640 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await enter(page, 'A little annoyed');
    const geometry = await page.locator('.weapon-dock').boundingBox();
    expect(geometry).not.toBeNull();
    expect(geometry!.y + geometry!.height).toBeLessThanOrEqual(viewport.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: `test-results/arena-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    });
  }
});

test('real local API issues a token and confirms practice delivery', async ({ page }, info) => {
  test.skip(
    info.project.name !== 'desktop',
    'The real dry-run transport is shared by all clients.',
  );
  const health = await page.request.get('http://127.0.0.1:8787/api/health');
  test.skip((await health.json()).mode !== 'dry-run', 'Avoid sending live Telegram during automated tests.');
  await page.unroute('**/api/session');
  await page.unroute('**/api/notify');
  await enter(page, 'A little annoyed');
  await page.getByRole('button', { name: 'Slap', exact: true }).dblclick();
  await expect(page.getByText('PRACTICE DELIVERY', { exact: true })).toBeVisible();
});
