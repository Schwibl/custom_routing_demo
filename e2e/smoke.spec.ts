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
});

// Client navigation plus a full reload of a deep link
test('navigates between routes and survives a deep-link reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'Feed' })).toBeVisible();

  await page.getByRole('navigation').getByRole('link', { name: 'Items', exact: true }).click();
  await expect(page).toHaveURL(/\/items$/);
  await expect(page.getByRole('heading', { name: 'Items' })).toBeVisible();

  await page.getByRole('link', { name: 'Alpha module' }).click();
  await expect(page).toHaveURL(/\/items\/1$/);
  await expect(page.getByRole('heading', { name: 'Item 1' })).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/\/items\/1$/);
  await expect(page.getByRole('heading', { name: 'Item 1' })).toBeVisible();
});
