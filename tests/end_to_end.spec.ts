/**
 * ================================================================
 * End to End Test
 * ----------------------------------------------------------------
 * Description : The purpose of this test is to validate core 
 *               funtionality of the website by stepping  through the 
 *               process of browsing for items, adding items to 
 *               the cart and completing checkout. 
 * 
 * Author      : Jenny Dixon
 * ================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('E2E Checkout Test', () => {

let item_1: { name: string | null; price: string | null } = {
  name: null,
  price: null
};
let item_2 = {};
let item_3 = {};

test('Search for items add 2 items to cart', async ({ page }) => {
  // Begin on home page
  await page.goto('https://practicesoftwaretesting.com/');
  await expect(page).toHaveURL('https://practicesoftwaretesting.com/');

  // Enter search term
  await page.locator('[data-test="search-query"]').click();
  await page.locator('[data-test="search-query"]').fill('hammer');
  await page.locator('[data-test="search-submit"]').click();
  
  // Capture produce name and price of first search result
  await expect(page.locator('[data-test="search-term"]')).toHaveText('hammer');
  await expect(page.locator('[data-test="search_completed"]')).toBeVisible();
  const PRODUCT_CARD = page.locator('[data-test^="product-"]').first();
  item_1.name = await PRODUCT_CARD.locator('[data-test="product-name"]').textContent();
  item_1.price = await PRODUCT_CARD.locator('[data-test="product-price"]').textContent();
  // Remove dollar symbol, if price exists
  if(item_1.price){
    item_1.price = item_1.price.replace('$','');
  }
  // Click on first product
  // Confirm correct page loads, but don't add to cart
  await PRODUCT_CARD.click();
  expect(item_1.name).not.toBeNull();
  await expect(page.locator('[data-test="product-name"]')).toHaveText(item_1.name as string);
  expect(item_1.price).not.toBeNull();
  await expect(page.locator('[data-test="unit-price"]')).toHaveText(new RegExp(item_1.price as string));



// // await page.goto('https://practicesoftwaretesting.com/product/01JW49MHHG4P2061T4T1SD2FQD');
//   await page.getByRole('link', { name: 'Thor Hammer Thor Hammer More' }).click();
//    //Validate page appears with a different product name (what was shown before)

//   await page.locator('[data-test="add-to-cart"]').click();
//   //Validate cart icon displays 1 item is in cart

 
//   await page.locator('[data-test="nav-categories"]').click();
//   await page.locator('[data-test="nav-power-tools"]').click();
//   await page.locator('[data-test="category-01JW49MHER9CJYK8D8GZ1PBGES"]').check();
//   await page.locator('[data-test="product-01JW49MHKPM0XFJGQ48T9PX9E5"]').click();

//  //Validate product name is shown, matches what was used before

//   await page.locator('[data-test="increase-quantity"]').click();
//   await page.locator('[data-test="add-to-cart"]').click();

//   //Validate cart icon increase by 1
//   await page.locator('[data-test="nav-cart"]').click();
//   //Validate 2 items are present, prices match what was gotten from home page
//   await page.getByRole('spinbutton', { name: 'Quantity for Cordless Drill' }).click();
//   await page.getByRole('spinbutton', { name: 'Quantity for Cordless Drill' }).fill('1');
//   await page.locator('aw-wizard-step').filter({ hasText: 'ItemQuantityPriceTotalThor' }).click();
//   //Validate price has updated 

  })

test.skip('Checkout process completes successfully', async ({ page }) => {

  await page.locator('[data-test="proceed-1"]').click();
  await page.locator('[data-test="email"]').click();
  await page.locator('[data-test="email"]').click();
  await page.locator('[data-test="email"]').fill('customer@practicesoftwaretesting.com');
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill('welcome01');
  await page.locator('[data-test="login-submit"]').click();
  await page.locator('[data-test="proceed-2"]').click();
  await page.locator('[data-test="street"]').click();
  await page.locator('[data-test="state"]').click();
  await page.locator('[data-test="state"]').click();
  await page.locator('[data-test="state"]').fill('Burgenland');
  await page.locator('[data-test="postal_code"]').click();
  await page.locator('[data-test="postal_code"]').click();
  await page.locator('[data-test="postal_code"]').fill('7461');
  await page.locator('[data-test="proceed-3"]').click();
  //Validate next page is reached
  await page.locator('[data-test="payment-method"]').selectOption('credit-card');
  await page.locator('[data-test="credit_card_number"]').click();
  await page.locator('[data-test="credit_card_number"]').fill('0000-0000-0000-0000');
  await page.locator('[data-test="expiration_date"]').click();
  await page.locator('[data-test="expiration_date"]').click();
  await page.locator('[data-test="expiration_date"]').fill('12/2030');
  await page.locator('[data-test="cvv"]').click();
  await page.locator('[data-test="cvv"]').fill('123');
  await page.locator('[data-test="card_holder_name"]').click();
  await page.locator('[data-test="card_holder_name"]').fill('Jane Doe');
  await page.locator('[data-test="finish"]').click();
  //Validate success message was reached
})
});
