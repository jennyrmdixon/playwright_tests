import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {

  test('Validate Home Page Loads', async ({ page }) => {
  // Check home page loads
  await page.goto('https://practicesoftwaretesting.com/');
  await expect(page).toHaveURL('https://practicesoftwaretesting.com/');
    
  // Check key element is visible on home screen
  await expect(page.getByRole('link', { name: 'Practice Software Testing -' })).toBeVisible();
});

  test('Validate Link Works', async ({ page }) => {
  // Check link can be clicked
  await page.goto('https://practicesoftwaretesting.com/');
  await page.locator('[data-test="nav-categories"]').click();
  await page.locator('[data-test="nav-hand-tools"]').click();
  await expect(page).toHaveURL('https://practicesoftwaretesting.com/category/hand-tools')
});

})

