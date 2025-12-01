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
 *              1. A field will only be accepted as valid if it is within the character limit
 *
 *              2. Address cannot be submitted if any field is missing
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

import { test, expect } from '@playwright/test';
import type {Page} from '@playwright/test'; 

test.describe('Billing Address Test', () => {

    // Helper function to set preconditions for various flows

    async function setPreconditions(testCase: string, page: Page,) {
        // Begin on home page
        await page.goto('https://practicesoftwaretesting.com/');
        await expect(page).toHaveURL('https://practicesoftwaretesting.com/');
        await expect(page.locator('[data-test="nav-categories"]')).toMatchAriaSnapshot(`- button "Categories"`);
        await page.locator('[data-test="nav-categories"]').click();
        await page.locator('[data-test="nav-hand-tools"]').click();
        await page.locator('[data-test^="product-"]').first().click();
        await page.locator('[data-test="add-to-cart"]').click();
        await page.locator('[data-test="nav-cart"]').click();
        await page.locator('[data-test="proceed-1"]').click();

        if (testCase === "noAccount") {
            const GUEST = {
                firstName: "Jack",
                lastName: "Howe",
                email: "customer101@practicesoftwaretesting.com"
            }
            await page.locator('a[href="#guest-tab"]').click();
            await page.locator('[data-test="guest-first-name"]').fill(GUEST.firstName)
            await page.locator('[data-test="guest-last-name"]').fill(GUEST.lastName)
            await page.locator('[data-test="guest-email"]').fill(GUEST.email)
            await page.locator('[data-test="guest-submit"]').click();
            await page.locator('[data-test="proceed-2-guest"]').click();
        }

    }

    const BILLING_ADDRESS_FIELDS = {
        street: '[data-test="street"]',
        city: '[data-test="city"]',
        state: '[data-test="state"]',
        country: '[data-test="country"]',
        postal: '[data-test="postal_code"]',
    }

    test('Guest Checkout Flow', async ({ page }) => {

        test.setTimeout(120000) // 2m overall for test time
        await setPreconditions("noAccount", page);

        async function validateProceedDisabled() {
            let PROCEED_BUTTON = page.locator('[data-test="proceed-3"]');
            await expect(PROCEED_BUTTON).toBeDisabled();
        }

        await test.step("Confirm character limits for fields", async () => {

            const CHAR_TEXT_0 = "0";
            // Postal/zip code field allows max 10 characters
            const CHAR_TEXT_10 = "012345 AB-";
            const CHAR_TEXT_11 = "012345 AB-C";
            // Country, city, and state fields allow max 40 characters
            const CHAR_TEXT_40 = "abc 124 ghi jkl mno pqrs tuv wxyzz AB. D";
            const CHAR_TEXT_41 = "abc 124 ghi jkl mno pqrs tuv wxyzz AB. DC";
            // Street field allows max 70 characters
            const CHAR_TEXT_70 = "abc def ghi jkl mno pqr's tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !";
            const CHAR_TEXT_71 = "abc def ghi jkl mno pqr's tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !§";

            // Only street field has invalid length
            await page.locator(BILLING_ADDRESS_FIELDS.street).fill(CHAR_TEXT_71);
            await page.locator(BILLING_ADDRESS_FIELDS.city).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.state).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.country).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.postal).fill(CHAR_TEXT_10);
            validateProceedDisabled();

            // Only city field has invalid length
            await page.locator(BILLING_ADDRESS_FIELDS.street).fill(CHAR_TEXT_70);
            await page.locator(BILLING_ADDRESS_FIELDS.city).fill(CHAR_TEXT_41);
            validateProceedDisabled();

            // Only state field has invalid length
            await page.locator(BILLING_ADDRESS_FIELDS.city).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.state).fill(CHAR_TEXT_41);
            validateProceedDisabled();

            // Only country field has invalid length
            await page.locator(BILLING_ADDRESS_FIELDS.state).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.country).fill(CHAR_TEXT_41);
            validateProceedDisabled();

            // Only zip field has invalid length
            await page.locator(BILLING_ADDRESS_FIELDS.country).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.postal).fill(CHAR_TEXT_11);
            validateProceedDisabled();
        }) // End step 'confirm character limits for fields'

        // Address cannot be submitted if field if any field is missing
        // Address can be submitted once fields are filled in
    })
    // End test case "Guest Checkout Flow"

}) // End Billing Address Test