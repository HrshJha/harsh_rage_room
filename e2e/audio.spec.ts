import { expect, test } from '@playwright/test';

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

test('sound-on entry loads playable Foley and keeps the attack playable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = AudioBufferSourceNode.prototype.start;
    const debug = window as Window & { __foleyStarts?: number[]; __foleyBuffers?: AudioBuffer[] };
    debug.__foleyStarts = [];
    debug.__foleyBuffers = [];
    AudioBufferSourceNode.prototype.start = function (when, offset, duration) {
      debug.__foleyStarts!.push(this.buffer?.duration ?? 0);
      if (this.buffer && this.buffer.duration > 0.28) debug.__foleyBuffers!.push(this.buffer);
      return original.call(this, when, offset, duration);
    };
  });
  const assets = new Map<string, { status: number; type: string }>();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.url().includes('/audio/')) {
      assets.set(new URL(response.url()).pathname, {
        status: response.status(),
        type: response.headers()['content-type'] ?? '',
      });
    }
  });
  await page.goto('/');
  await page.getByLabel('PLAY WITH SOUND').check();
  await page.getByRole('button', { name: 'ENTER THE RAGE ROOM' }).click();
  await expect.poll(() => assets.size).toBe(20);
  for (const asset of assets.values()) {
    expect(asset.status).toBe(200);
    expect(asset.type).toContain('audio/');
  }
  await page.getByRole('button', { name: 'YES, EXTREMELY.' }).click();
  await page.getByRole('button', { name: /A little annoyed/ }).click();
  await page.getByRole('button', { name: 'TAKE ME TO THE ROOM' }).click();
  await expect(page.getByTestId('stage')).toBeVisible();
  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByLabel('Arcade music').check();
  await page.getByRole('button', { name: 'TEST SOUND' }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as Window & { __foleyStarts?: number[] }).__foleyStarts!.filter((n) => n > 0.28)
            .length,
      ),
    )
    .toBeGreaterThan(0);
  const before = await page.evaluate(
    () =>
      (window as Window & { __foleyStarts?: number[] }).__foleyStarts!.filter((n) => n > 0.28)
        .length,
  );
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'Slap', exact: true }).dblclick();
  await expect(page.getByRole('status').last()).toContainText('Attack 1');
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as Window & { __foleyStarts?: number[] }).__foleyStarts!.filter((n) => n > 0.28)
            .length,
      ),
    )
    .toBeGreaterThan(before);
  for (let attack = 2; attack <= 3; attack++) {
    await expect(page.getByTestId('stage')).toHaveAttribute('aria-busy', 'false');
    await page.getByRole('button', { name: 'Slap', exact: true }).dblclick();
    await expect(page.getByRole('status').last()).toContainText(`Attack ${attack}`);
  }
  const takeIds = await page.evaluate(() => {
    const played = (window as Window & { __foleyBuffers?: AudioBuffer[] }).__foleyBuffers!;
    return played.slice(-3).map((buffer) => played.indexOf(buffer));
  });
  expect(new Set(takeIds).size).toBe(3);
  expect(errors).toEqual([]);
});

test('missing Foley uses fallback and does not break a hit', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Failure recovery is checked once in Chromium.');
  await page.route('**/audio/slap/contact-*.mp3', (route) =>
    route.fulfill({ status: 404, body: '' }),
  );
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByLabel('PLAY WITH SOUND').check();
  await page.getByRole('button', { name: 'ENTER THE RAGE ROOM' }).click();
  await page.getByRole('button', { name: 'YES, EXTREMELY.' }).click();
  await page.getByRole('button', { name: /A little annoyed/ }).click();
  await page.getByRole('button', { name: 'TAKE ME TO THE ROOM' }).click();
  await page.getByRole('button', { name: 'Slap', exact: true }).dblclick();
  await expect(page.getByRole('status').last()).toContainText('Attack 1');
  expect(errors).toEqual([]);
});
