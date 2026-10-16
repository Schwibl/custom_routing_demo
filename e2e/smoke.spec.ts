import { readFileSync } from 'node:fs';

import { expect, test, type Page } from '@playwright/test';

// Collect console and uncaught errors for the load check
function watchErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
}

// App loads with no console errors
test('app loads with no console errors', async ({ page }) => {
  const errors = watchErrors(page);

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page).toHaveTitle('Sign in · Custom routing demo');
  await expect(page.locator('.app-header')).toBeHidden();
  expect(errors).toEqual([]);
});

// Main UI renders, then the authenticated shell after the demo sign-in
test('main UI renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();

  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'Feed' })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Logout', exact: true })).toBeVisible();
});

// Client navigation plus a full reload of a deep link
test('navigates between routes and survives a deep-link reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'Feed' })).toBeVisible();

  await page.getByRole('navigation').getByRole('link', { name: 'Items', exact: true }).click();
  await expect(page).toHaveURL(/\/items$/);
  await expect(page.getByRole('heading', { name: 'Items' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Items' })).toBeFocused();
  await expect(page).toHaveTitle('Items · Custom routing demo');
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Items', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );

  await page.getByRole('link', { name: 'Alpha module' }).click();
  await expect(page).toHaveURL(/\/items\/1$/);
  await expect(page.getByRole('heading', { name: 'Item 1' })).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/\/items\/1$/);
  await expect(page.getByRole('heading', { name: 'Item 1' })).toBeVisible();
  await expect(page).toHaveTitle('Item 1 · Custom routing demo');
});

// Cold load of a nested path — the Vercel miss was a server 404 before the SPA booted
test('cold deep link returns the app', async ({ page }) => {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
    rewrites?: { source: string; destination: string }[];
  };
  expect(config.rewrites).toEqual([{ source: '/(.*)', destination: '/index.html' }]);

  const errors = watchErrors(page);
  const loggedOut = await page.goto('/items/1');
  expect(loggedOut?.status()).toBe(200);
  expect(loggedOut?.headers()['content-type'] ?? '').toContain('text/html');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByText('NOT_FOUND')).toHaveCount(0);

  await page.getByRole('button', { name: 'Continue' }).click();
  const authed = await page.goto('/items/1');
  expect(authed?.status()).toBe(200);
  await expect(page).toHaveURL(/\/items\/1$/);
  await expect(page.getByRole('heading', { name: 'Item 1' })).toBeVisible();
  expect(errors).toEqual([]);
});

// Unknown paths stay on the URL and render the in-app not-found view
test('unknown route renders not found with a link home', async ({ page }) => {
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/does-not-exist$/);
  await expect(page).toHaveTitle('Page not found · Custom routing demo');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/');

  await page.goto('/items/nope');
  await expect(page).toHaveURL(/\/items\/nope$/);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();

  await page.getByRole('link', { name: 'Back home' }).click();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

// Desktop floor is 36px; a 390px viewport uses the 44px touch floor and 16px fields
test('controls meet desktop and phone size floors', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const form = page.locator('.login-page');
  const formBox = await form.boundingBox();
  expect(formBox?.width ?? 0).toBeLessThanOrEqual(360);

  const desktopButton = await page.getByRole('button', { name: 'Continue' }).boundingBox();
  expect(desktopButton?.height ?? 0).toBeGreaterThanOrEqual(36);

  await page.setViewportSize({ width: 390, height: 844 });
  const input = page.locator('input[name="email"]');
  const fontSize = await input.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
  expect(fontSize).toBeGreaterThanOrEqual(16);

  const phoneButton = await page.getByRole('button', { name: 'Continue' }).boundingBox();
  expect(phoneButton?.height ?? 0).toBeGreaterThanOrEqual(44);

  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('.app-header__brand')).toHaveCSS('white-space', 'nowrap');
  await expect(page.locator('.app-header__nav')).toHaveCSS('overflow-x', 'auto');

  const feedLink = await page.getByRole('navigation').getByRole('link', { name: 'Feed', exact: true }).boundingBox();
  expect(feedLink?.height ?? 0).toBeGreaterThanOrEqual(44);
});
