/**
 * ================================================================
 * Billing Address Form Entry Test
 * ----------------------------------------------------------------
 * Description :
 * 
 *              This test focuses on the billing address form within the checkout workflow.
 *              The purpose of the test is to validate that the form uses expected logic to determine 
 *              if the form can be submitted. 
 *              
 *              Specific validations include:
 *
 *              1. Form cannot be submitted if any field goes over character limit
 *
 *              2. Form cannot be submitted if any field is missing
 * 
 *              3. Form can be submitted if all fields are filled and within character limit
 *              
 *              4. Form logic is consistent whether it is reached through guest checkout flow or existing account
 * 
 * Author      : Jenny Dixon
 * ================================================================
 */

import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe('Billing Address Test', () => {

    // Helper function to set preconditions for various flows

    type checkoutFlow = "noAccount" | "account1" | "account2";

    async function setPreconditions(testCase: checkoutFlow, page: Page) {
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
            await page.locator('[data-test="guest-first-name"]').fill(GUEST.firstName);
            await page.locator('[data-test="guest-last-name"]').fill(GUEST.lastName);
            await page.locator('[data-test="guest-email"]').fill(GUEST.email);
            await page.locator('[data-test="guest-submit"]').click();
            await page.locator('[data-test="proceed-2-guest"]').click();
        }

        if (testCase === "account1") {
            const ACCOUNT1 = {
                email: "customer@practicesoftwaretesting.com",
                password: "welcome01"
            }
            await page.locator('[data-test="email"]').fill(ACCOUNT1.email);
            await page.locator('[data-test="password"]').fill(ACCOUNT1.password);
            await page.locator('[data-test="login-submit"]').click();
            await page.locator('[data-test="proceed-2"]').click();
        }
        
        if (testCase === "account2") {
            const ACCOUNT2 = {
                email: "jennytestemail@yahoo.com",
                password: "Welcome02????"
            }
            await page.locator('[data-test="email"]').fill(ACCOUNT2.email);
            await page.locator('[data-test="password"]').fill(ACCOUNT2.password);
            await page.locator('[data-test="login-submit"]').click();
            await page.locator('[data-test="proceed-2"]').click();
        }
    }

    const BILLING_ADDRESS_FIELDS = {
        street: '[data-test="street"]',
        city: '[data-test="city"]',
        state: '[data-test="state"]',
        country: '[data-test="country"]',
        postal: '[data-test="postal_code"]',
    }

    async function validateProceedDisabled(page: Page) {
         const PROCEED_BUTTON = page.locator('[data-test="proceed-3"]');
         await expect(PROCEED_BUTTON).toBeDisabled();
    }

    async function validateProceedEnabled(page: Page) {
         const PROCEED_BUTTON = page.locator('[data-test="proceed-3"]');
         await expect(PROCEED_BUTTON).toBeEnabled();
    }

    const CHAR_TEXT_0 = "";
    // Postal/zip code field allows max 10 characters
    const CHAR_TEXT_10 = "012345 AB-";
    const CHAR_TEXT_11 = "012345 AB-C";
    // Country, city, and state fields allow max 40 characters
    const CHAR_TEXT_40 = "abc 124 ghi jkl mno pqrs tuv wxyzz AB. D";
    const CHAR_TEXT_41 = "abc 124 ghi jkl mno pqrs tuv wxyzz AB. DC";
    // Street field allows max 70 characters
    const CHAR_TEXT_70 = "abc def ghi jkl mno pqr's tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !";
    const CHAR_TEXT_71 = "abc def ghi jkl mno pqr's tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !§";

    test('Guest Checkout Flow', async ({ page }) => {

        await setPreconditions("noAccount", page);

        // Validate fully empty field cannot be submitted

        await test.step("Confirm character limits for fields", async () => {

            // Only street field has invalid length
            await page.locator(BILLING_ADDRESS_FIELDS.street).fill(CHAR_TEXT_71);
            await page.locator(BILLING_ADDRESS_FIELDS.city).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.state).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.country).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.postal).fill(CHAR_TEXT_10);
            await validateProceedDisabled(page);

            // Only city field has invalid length
            await page.locator(BILLING_ADDRESS_FIELDS.street).fill(CHAR_TEXT_70);
            await page.locator(BILLING_ADDRESS_FIELDS.city).fill(CHAR_TEXT_41);
            await validateProceedDisabled(page);

            // Only state field has invalid length
            await page.locator(BILLING_ADDRESS_FIELDS.city).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.state).fill(CHAR_TEXT_41);
            await validateProceedDisabled(page);

            // Only country field has invalid length
            await page.locator(BILLING_ADDRESS_FIELDS.state).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.country).fill(CHAR_TEXT_41);
            await validateProceedDisabled(page);

            // Only zip field has invalid length
            await page.locator(BILLING_ADDRESS_FIELDS.country).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.postal).fill(CHAR_TEXT_11);
            await validateProceedDisabled(page);
        }) // End step 

        await test.step("Validate form cannot be submitted if any field is blank", async () => {
            // Only zip field is blank
            await page.locator(BILLING_ADDRESS_FIELDS.postal).fill(CHAR_TEXT_0);
            await validateProceedDisabled(page);

            // Only country field is blank
            await page.locator(BILLING_ADDRESS_FIELDS.postal).fill(CHAR_TEXT_10);
            await page.locator(BILLING_ADDRESS_FIELDS.country).fill(CHAR_TEXT_0);
            await validateProceedDisabled(page);

            // Only state field is blank
            await page.locator(BILLING_ADDRESS_FIELDS.country).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.state).fill(CHAR_TEXT_0);
            await validateProceedDisabled(page);

            // Only city field is blank
            await page.locator(BILLING_ADDRESS_FIELDS.state).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.city).fill(CHAR_TEXT_0);
            await validateProceedDisabled(page);

            // Only street field is blank
            await page.locator(BILLING_ADDRESS_FIELDS.city).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.street).fill(CHAR_TEXT_0);
            await validateProceedDisabled(page);

        }); // End step 

        await test.step("Exception tests - validate form cannot be submitted if all fields are missing or invalid", async () => {
           // All fields blank
            await page.locator(BILLING_ADDRESS_FIELDS.street).fill(CHAR_TEXT_0);
            await page.locator(BILLING_ADDRESS_FIELDS.city).fill(CHAR_TEXT_0);
            await page.locator(BILLING_ADDRESS_FIELDS.state).fill(CHAR_TEXT_0);
            await page.locator(BILLING_ADDRESS_FIELDS.country).fill(CHAR_TEXT_0);
            await page.locator(BILLING_ADDRESS_FIELDS.postal).fill(CHAR_TEXT_0);
            await validateProceedDisabled(page);

            // All fields invalid 
            await page.locator(BILLING_ADDRESS_FIELDS.street).fill(CHAR_TEXT_71);
            await page.locator(BILLING_ADDRESS_FIELDS.city).fill(CHAR_TEXT_41);
            await page.locator(BILLING_ADDRESS_FIELDS.state).fill(CHAR_TEXT_41);
            await page.locator(BILLING_ADDRESS_FIELDS.country).fill(CHAR_TEXT_41);
            await page.locator(BILLING_ADDRESS_FIELDS.postal).fill(CHAR_TEXT_11);
            await validateProceedDisabled(page);
        }); // End step

        await test.step("Test form can be submitted when all fields are filled with valid character counts", async () => {
            await page.locator(BILLING_ADDRESS_FIELDS.street).fill(CHAR_TEXT_70);
            await page.locator(BILLING_ADDRESS_FIELDS.city).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.state).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.country).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.postal).fill(CHAR_TEXT_10);
            await validateProceedEnabled(page);
        }); // End step
    }) // End test case "Guest Checkout Flow"

    test('Existing User Checkout Flow - Account Details Partly Filled', async ({page}) => {

        await setPreconditions("account1", page);

        await test.step("Validate form cannot be submitted if user data is partly filled in", async () => {
            await expect(page.locator(BILLING_ADDRESS_FIELDS.street)).toHaveValue("Test street 98");
            await expect(page.locator(BILLING_ADDRESS_FIELDS.city)).toHaveValue("Vienna");
            await expect(page.locator(BILLING_ADDRESS_FIELDS.state)).toHaveValue("");
            await expect(page.locator(BILLING_ADDRESS_FIELDS.country)).toHaveValue("Austria");
            await expect(page.locator(BILLING_ADDRESS_FIELDS.postal)).toHaveValue("");
            await validateProceedDisabled(page);
        }); // End step

        await test.step("Validate form can be submitted after fields filled in", async () => {
            await page.locator(BILLING_ADDRESS_FIELDS.state).fill(CHAR_TEXT_40);
            await page.locator(BILLING_ADDRESS_FIELDS.postal).fill(CHAR_TEXT_10);
            await validateProceedEnabled(page);
        }); // End step

    }) // End test case "Existing User Checkout Flow - Account Details Partly Filled"

    // Test case temporarily disabled, until website adds ability to create new account
    test.skip('Existing User Checkout Flow - Account Details Pre-Filled', async ({page}) => {

        await setPreconditions("account2", page);

        await test.step("Validate form can be submitted if all user data is autofilled", async () => {
            await expect(page.locator(BILLING_ADDRESS_FIELDS.street)).toHaveValue("Test street 123");
            await expect(page.locator(BILLING_ADDRESS_FIELDS.city)).toHaveValue("Los Angeles");
            await expect(page.locator(BILLING_ADDRESS_FIELDS.state)).toHaveValue("CA");
            await expect(page.locator(BILLING_ADDRESS_FIELDS.country)).toHaveValue("USA");
            await expect(page.locator(BILLING_ADDRESS_FIELDS.postal)).toHaveValue("90001");
            await validateProceedEnabled(page);
        }); // End step   
    }); // End test case "Existing User Checkout Flow - Account Details Pre-Filled"

}) // End Billing Address Test