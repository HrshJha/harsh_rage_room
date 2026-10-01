import { expect, test, type Page } from '@playwright/test';
import type { NotifyEvent } from '../shared/contracts';

async function enter(page: Page, name = 'Alex') {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /WELCOME TO THE RAGE ROOM/ })).toBeVisible();
  if (name) await page.getByPlaceholder('Enter your name...').fill(name);
  await page.getByRole('button', { name: 'ENTER THE RAGE ROOM' }).click();
  await page.getByRole('button', { name: 'YES, EXTREMELY.' }).click();
  await page.getByRole('button', { name: /Beyond human limits/ }).click();
  await page.getByRole('button', { name: 'TAKE ME TO THE ROOM' }).click();
  await expect(page.getByTestId('stage')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: { token: 'test-token', sid: 'test-sid', expiresAt: Date.now() / 1000 + 1800 },
    }),
  );
});

for (const weapon of ['Slap', 'Punch', 'Chappal', 'Bonk', 'Tomato', 'Thunder'] as const) {
  test(`${weapon} sends a completed action with the entered name and time`, async ({
    page,
  }, info) => {
    test.skip(info.project.name !== 'desktop', 'Action payloads are checked once in Chromium.');
    const sent: NotifyEvent[] = [];
    await page.route('**/api/notify', (route) => {
      sent.push(route.request().postDataJSON() as NotifyEvent);
      return route.fulfill({ status: 202, json: { ok: true, mode: 'dry-run' } });
    });
    await enter(page);
    expect(sent).toHaveLength(0);
    await page.getByRole('button', { name: weapon, exact: true }).dblclick();
    await expect.poll(() => sent.length).toBe(1);
    expect(sent[0]).toMatchObject({
      kind: 'attack',
      name: 'Alex',
      attack: weapon.toLowerCase(),
      anger: 'beyond',
      hit: true,
    });
    expect(Number.isNaN(Date.parse(sent[0].occurredAt!))).toBe(false);
  });
}

test('roast sends the exact submitted text after contact and remembers the name', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop', 'Roast payload is checked once in Chromium.');
  const sent: NotifyEvent[] = [];
  await page.route('**/api/notify', (route) => {
    sent.push(route.request().postDataJSON() as NotifyEvent);
    return route.fulfill({ status: 202, json: { ok: true, mode: 'dry-run' } });
  });
  await page.goto('/');
  await page.getByPlaceholder('Enter your name...').fill('Alex');
  await page.getByRole('button', { name: 'ENTER THE RAGE ROOM' }).click();
  await page.reload();
  await expect(page.getByPlaceholder('Enter your name...')).toHaveValue('Alex');
  expect(sent).toHaveLength(0);
  await page.getByRole('button', { name: 'ENTER THE RAGE ROOM' }).click();
  await page.getByRole('button', { name: 'YES, EXTREMELY.' }).click();
  await page.getByRole('button', { name: /Beyond human limits/ }).click();
  await page.getByRole('button', { name: 'TAKE ME TO THE ROOM' }).click();
  await page.getByRole('button', { name: 'Roast Harsh', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'ROAST HARSH' })).toBeVisible();
  expect(sent).toHaveLength(0);
  const roast = 'Harsh, your <code> is shit & needs\na software update.';
  await page.getByPlaceholder('Harsh, your coding skills need a software update...').fill(roast);
  await page.getByRole('button', { name: 'SEND ROAST' }).click();
  await expect.poll(() => sent.length).toBe(1);
  expect(sent[0]).toMatchObject({
    kind: 'attack',
    attack: 'roast',
    name: 'Alex',
    roastText: roast,
  });
  expect(sent[0].occurredAt).toBeTruthy();
});

test('blank name enters as anonymous and sends no opening notification', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Anonymous identity is checked once in Chromium.');
  const sent: NotifyEvent[] = [];
  await page.route('**/api/notify', (route) => {
    sent.push(route.request().postDataJSON() as NotifyEvent);
    return route.fulfill({ status: 202, json: { ok: true, mode: 'dry-run' } });
  });
  await enter(page, '');
  expect(sent).toHaveLength(0);
  await page.getByRole('button', { name: 'Slap', exact: true }).dblclick();
  await expect.poll(() => sent.length).toBe(1);
  expect(sent[0].name).toBe('');
});
