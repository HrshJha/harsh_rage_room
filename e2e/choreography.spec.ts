import { expect, test, type Page } from '@playwright/test';
import type { NotifyEvent } from '../shared/contracts';

async function enter(page: Page) {
  await page.goto('/');
  await page.getByPlaceholder('Enter your name...').fill('Alex');
  await page.getByRole('button', { name: 'ENTER THE RAGE ROOM' }).click();
  await page.getByRole('button', { name: 'YES, EXTREMELY.' }).click();
  await page.getByRole('button', { name: /Beyond human limits/ }).click();
  await page.getByRole('button', { name: 'TAKE ME TO THE ROOM' }).click();
  await expect(page.getByTestId('stage')).toBeVisible();
  await expect(page.locator('.fight-intro')).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/session', (r) =>
    r.fulfill({ json: { token: 'test', sid: 'test', expiresAt: Date.now() / 1000 + 1800 } }),
  );
});

test('single tap contacts once and the next slap uses a different take', async ({ page }) => {
  const sent: NotifyEvent[] = [];
  await page.route('**/api/notify', (r) => {
    sent.push(r.request().postDataJSON());
    return r.fulfill({ status: 202, json: { ok: true, mode: 'dry-run' } });
  });
  await enter(page);
  const stage = page.getByTestId('stage');
  await page.getByRole('button', { name: 'Slap', exact: true }).click();
  await expect(stage).toHaveAttribute('aria-busy', 'true');
  const first = await stage.getAttribute('data-variant');
  await expect(stage).toHaveAttribute('aria-busy', 'false');
  await expect.poll(() => sent.length).toBe(1);
  await page.getByRole('button', { name: 'Slap', exact: true }).click();
  await expect(stage).not.toHaveAttribute('data-variant', first!);
  await expect(stage).toHaveAttribute('aria-busy', 'false');
  await expect.poll(() => sent.length).toBe(2);
  expect(sent.map((e) => e.attack)).toEqual(['slap', 'slap']);
});

test('leaving during anticipation cancels the attack without a notification', async ({ page }) => {
  const sent: NotifyEvent[] = [];
  await page.route('**/api/notify', (r) => {
    sent.push(r.request().postDataJSON());
    return r.fulfill({ status: 202, json: { ok: true, mode: 'dry-run' } });
  });
  await enter(page);
  // Both events in the same task: no contact frame can occur before cancellation.
  await page.evaluate(() => {
    (document.querySelector('button[aria-label="Thunder"]') as HTMLButtonElement).click();
    const exit = [...document.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('I’M DONE'),
    )!;
    exit.click();
  });
  await expect(page.getByTestId('stage')).toHaveCount(0);
  await page.waitForTimeout(900);
  expect(sent.filter((e) => e.kind === 'attack')).toHaveLength(0);
});

test('reduced motion retains the exact roast on stage and in the notification', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const sent: NotifyEvent[] = [];
  await page.route('**/api/notify', (r) => {
    sent.push(r.request().postDataJSON());
    return r.fulfill({ status: 202, json: { ok: true, mode: 'dry-run' } });
  });
  await enter(page);
  const roast = 'Harsh, your <code> needs a nap.\nTry sleep() & repeat.';
  await page.getByRole('button', { name: 'Roast Harsh', exact: true }).click();
  await page.getByPlaceholder('Harsh, your coding skills need a software update...').fill(roast);
  await page.getByRole('button', { name: 'SEND ROAST' }).click();
  await expect(page.getByTestId('stage')).toHaveAttribute('aria-busy', 'false');
  await expect(page.locator('.roast-lettering')).toBeVisible();
  expect(await page.locator('.roast-lettering p').textContent()).toBe(roast);
  await expect.poll(() => sent.length).toBe(1);
  expect(sent[0]).toMatchObject({ name: 'Alex', attack: 'roast', roastText: roast });
  expect(await page.locator('.stage-camera').evaluate((e) => getComputedStyle(e).transform)).toBe(
    'matrix(1, 0, 0, 1, 0, 0)',
  );
});
