import { test, expect, Page } from '@playwright/test';

  test('Validate Home Page Loads', async ({ page }: { page: Page }, testInfo) => {
  console.log('Test timeout (ms):', testInfo.timeout);

  // Check home page loads
  await page.goto('https://practicesoftwaretesting.com/');
  await expect(page).toHaveURL('https://practicesoftwaretesting.com/');
    
  // Check key element is visible on home screen
  await expect(page.getByRole('link', { name: 'Practice Software Testing -' })).toBeVisible();
});

  test('Validate Link Works', async ({ page }: { page: Page }) => {
  // Check link can be clicked
  await page.goto('https://practicesoftwaretesting.com/');
  await page.locator('[data-test="nav-categories"]').click();
  await page.locator('[data-test="nav-hand-tools"]').click();
  await expect(page).toHaveURL('https://practicesoftwaretesting.com/category/hand-tools')
});


