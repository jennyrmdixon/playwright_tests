/**
 * ================================================================
 * Billing Address Entry Test
 * ----------------------------------------------------------------
 * Description :
 * 
 *              This test focuses on the billing address step of the checkout workflow.
 *              The purpose of the test is to validate that the form uses expected validation
 *              logic to determine if the form can be submitted. 
 *              Specific validations include:
 *
 *              1. A field will only be accepted as valid if it is within the limit of 100 characters
 *                  - A field with 99 characters may be accepted
 *                  - A field with 100 characters entered will not be accepted
 *
 *              2. Address cannot be submitted if a field is missing or invalid
 *                  - Address cannot be submitted if 1 field is invalid
 *                  - Address cannot be submitted if all fields are invalid
 *                  - Address cannot be submitted if 1 field is missing
 *                  - Address cannot be submitted if all fields are missing
 * 
 *              3. Address will be accepted if all fields are filled in from customer account (in guest checkout scenario)
 *
 *              4. Form follows expected validations when details are partly filled in from customer account
 *                  - Address cannot be submitted if a field from customer account is missing
 *                  - Address can be submitted after field from customer account is filled in
 *
 *              5. Form follows expected validations when details are fully filled in from customer account
 *                  - Address can be submitted after all fields are filled in from customer account
 *                  - Address can be submitted if form is filled from account, then fields are overwritten
 *
 *              At various points in validations, the test also validates that GUI elements such as the
 *              "continue" button and error messages are in expected states
 * 
 * Author      : Jenny Dixon
 * ================================================================
 */

import { test, expect, Page } from '@playwright/test';

// Helper function to set preconditions for various flows

async function setPreconditions(testCase: string, page: Page,) {
    // Begin on home page
    await page.goto('https://practicesoftwaretesting.com/');
    await expect(page).toHaveURL('https://practicesoftwaretesting.com/');
    await expect(page.locator('[data-test="nav-categories"]')).toMatchAriaSnapshot(`- button "Categories"`);
    await page.locator('[data-test="nav-categories"]').click();
    await page.locator('[data-test="nav-hand-tools"]').click();
    const PRODUCT_1_CARD = page.locator('[data-test^="product-"]').first();
    // Wait for product name to load, then click? Confirm best way to handle this step
    await PRODUCT_1_CARD.locator('[data-test="product-name"]').click();
    await page.locator('[data-test="add-to-cart"]').click();
    await page.locator('[data-test="nav-cart"]').click();
    await page.locator('[data-test="proceed-1"]').click();

    if (testCase === "noAccount"){
        await page.locator('a[href = "#guest-tab"]').click();
    }

}

test.describe('Billing Address Test', () => {

test('Guest Checkout Flow', async ({page}) => {

    test.setTimeout(120000) // 2m overall for test time
    await setPreconditions("noAccount", page);

    // Preconditions
    // Test character limits
    // Address cannot be submitted if field is missing or invalid
    // Address can be submitted once fields are filled in

})
// End test case "Guest Checkout Flow"

}) // End Billing Address Test