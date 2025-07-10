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
  let item_2: { name: string | null; price: string | null } = {
    name: null,
    price: null
  };
  let item_3: { name: string | null; price: string | null } = {
    name: null,
    price: null
  };

  // Normalizes values for accurate comparison across pages
  // Remove leading or trailing spaces, and $ sign
  // Converts number to string
  let normalizeText = (input) => {
    return String(input).trim().replace(/\$/g, '');
  }

  test('End to End Test', async ({ page }) => {

    // Define frequently used locator for first test case
    const LOCATOR_PRODUCT_NAME = page.locator('[data-test="product-name"]');

    await test.step(`Navigate to first product, do not add to cart`, async () => {
      // test.step('Complete purchase flow', async ({ page }) => {
      // NAVIGATE TO FIRST PRODUCT, BUT DON'T ADD TO CART
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
      const PRODUCT_1_CARD = page.locator('[data-test^="product-"]').first();
      item_1.name = await PRODUCT_1_CARD.locator('[data-test="product-name"]').textContent();
      item_1.price = await PRODUCT_1_CARD.locator('[data-test="product-price"]').textContent();
      item_1.price = normalizeText(item_1.price);

      // Click on first product
      // Confirm correct page loads, but don't add to cart
      await PRODUCT_1_CARD.click();
      expect(item_1.name).not.toBeNull();
      await expect(LOCATOR_PRODUCT_NAME).toHaveText(item_1.name as string);
      expect(item_1.price).not.toBeNull();
      await expect(page.locator('[data-test="unit-price"]')).toHaveText(new RegExp(item_1.price as string));
    }); // End step

    await test.step(`Navigate to second product, add to cart`, async () => {

      // NAVIGATE TO SECOND PRODUCT, ADD TO CART
      // Click on first recommended product
      await page.getByText('More information').first().click();

      // Wait for new product page to load, as indicated by updated product name
      // Ignores spaces added or removed temporarily during the loading process
      // Get the initial product name, with leading/trailing spaces removed
      let initialNormalized = normalizeText(item_1.name);

      await expect.poll(async () => {
        const currentRaw = await LOCATOR_PRODUCT_NAME.textContent();
        const currentNormalized = normalizeText(currentRaw);

        // Return the normalized text to decide if poll should end
        return currentNormalized;
      }).not.toBe(initialNormalized)

      // Capture details of new product page
      item_2.name = await LOCATOR_PRODUCT_NAME.textContent();
      item_2.price = await page.locator('[data-test="unit-price"]').textContent();
      await expect(item_1.name).not.toEqual(item_2.name);

      // Add current item to cart
      await page.locator('[data-test="add-to-cart"]').click();
      // Validate cart displays 1 item added
      await expect(page.locator('[data-test="cart-quantity"]')).toHaveText("1");
    }); // End step

    await test.step(`Navigate to third product, add to cart`, async () => {

      // NAVIGATE TO THIRD PRODUCT, ADD TO CART
      await page.locator('[data-test="nav-categories"]').click();
      await page.locator('[data-test="nav-power-tools"]').click();
      //Wait for products to fully load after clicking on page 
      await page.locator('[data-test^="product-"]').first().waitFor({ state: 'visible' });
      // Filter by first category
      await (page.locator('[data-test^="category-"]').nth(1)).check();

      const PRODUCT_3_CARD = page.locator('[data-test^="product-"]').first();
      item_3.name = await PRODUCT_3_CARD.locator('[data-test="product-name"]').textContent();
      item_3.price = await PRODUCT_3_CARD.locator('[data-test="product-price"]').textContent();
      item_3.price = normalizeText(item_3.price);

      // Click on third product
      await PRODUCT_3_CARD.click();
      expect(item_3.name).not.toBeNull();
      await expect(LOCATOR_PRODUCT_NAME).toHaveText(item_3.name as string);
      expect(item_3.price).not.toBeNull();
      await expect(page.locator('[data-test="unit-price"]')).toHaveText(new RegExp(item_3.price as string));

      // Add current item to cart
      await page.locator('[data-test="add-to-cart"]').click();
      // Validate cart displays 1 item added
      await expect(page.locator('[data-test="cart-quantity"]')).toHaveText("2");
    }); // End step

    await test.step(`Navigate to cart, check details, and increase item quantity`, async () => {
      // Wait until "Added to Cart" pop up is not obstructing cart icon, then navigate to cart
      const CART_BUTTON = page.locator('[data-test="nav-cart"]');

      await expect.poll(async () => {
        try {
          await CART_BUTTON.click({ trial: true });
          return true;
        } catch {
          return false;
        }
      },
        {
          timeout: 6000, // ⏱️ Set timeout to 6000 milliseconds (6 seconds)
        }
      ).toBe(true);
      await CART_BUTTON.click();

      // Validate 2 items are present, prices match what was gotten from home page
      // Determine expected display order of products, based on alpha order
      let item2NameNorm = normalizeText(item_2.name);
      let item3NameNorm = normalizeText(item_3.name);

      let item2Order;
      let item3Order;

      if (item2NameNorm < item3NameNorm) {
        item2Order = 0;
        item3Order = 1;
      }
      else if (item3NameNorm > item2NameNorm) {
        item3Order = 0;
        item2Order = 1;
      }
      else {
        console.log("error")
      }

      // Check details of item 2
      await expect((page.locator('[data-test = "product-title"]').nth(item2Order))).toHaveText(item2NameNorm);
      const item2Price = normalizeText(await page.locator('[data-test="product-price"]').nth(item2Order).textContent());
      expect(item2Price).toBe(item_2.price);

      // Check details of item 3
      await expect((page.locator('[data-test = "product-title"]').nth(item3Order))).toHaveText(item3NameNorm);
      const item3Price = normalizeText(await page.locator('[data-test="product-price"]').nth(item3Order).textContent());
      expect(item3Price).toBe(item_3.price);

      let cartTotal = (parseFloat(item2Price) + parseFloat(item3Price)).toString();
      let normalizedTotal = normalizeText(await page.locator('[data-test = "cart-total"]').textContent());
      expect(normalizedTotal).toEqual(cartTotal);

      // Increase quanity of item2 from 1 to 2
      await page.getByRole('spinbutton').nth(item2Order).click();
      await page.getByRole('spinbutton').nth(item2Order).fill('2');
      // De-select item counter box
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      let newExpectedTotal = parseFloat(cartTotal) + parseFloat(item2Price);
      await expect.poll(async () => {
        try {
          const newTotal = normalizeText(await page.locator('[data-test = "cart-total"]').textContent());
          const newTotalParse = parseFloat(newTotal);
          return newTotalParse;
        } catch {
          return false;
        }
      }
      ).toBe(newExpectedTotal)
    }); // End step
  }); // End TC1

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
