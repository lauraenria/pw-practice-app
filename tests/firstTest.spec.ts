import { test } from '@playwright/test'


test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200/')
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async ({ page }) => {

  //by Tag name (args: a string and a obj for different options)
  await page.locator("input").first().click()

  //by ID
  page.locator('#inputEmail1')

  //by Class value
  page.locator(".shape-rectangle")

  //by attribute
  page.locator('[placeholder="Email"]')

  //by Class value (full)
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

  //combine different selectors
  page.locator('input [placeholder="Email"][nbinput]')

  // by XPath (NOT RECOMMENDED)
  page.locator('//*[@id="inputEmail1"]')

  // by partial text match
  page.locator(':text("Using")')

  //by exact text match
  page.locator(':text-is ("Using the Grid")')
})

test('User facing locators', async ({ page }) => {

  // By role + accessible named
  await page.getByRole('textbox', { name: 'Email' }).first().click();

  await page.getByRole('button', { name: 'Sign in' }).first().click();

  // By label (associated with an input)
  await page.getByLabel('Email').first().click();

  // By placeholder text
  await page.getByPlaceholder('Jane Doe').click();

  // By visible text
  await page.getByText('Using the Grid').click();

  // By test id
  await page.getByTestId('SignIn').click();

  // By title attribute
  await page.getByTitle('IoT Dashboard').click();
});


test('locating child elements', async ({ page }) => {
  /*
    Best Practice: Try to find unique elements, avoiding the use of indexes or relying on the order of elements when writing locators.
    Locating child elements:
    - You can combine multiple selectors (tags, attributes, IDs, etc.) in a single string,
      separated by spaces. Each part acts as a "child locator" in relation to the previous one.
      Example: 'form button[type="submit"]' → finds a <button> inside a <form>.

    - Alternatively, you can chain locators step by step:
      page.locator('form').locator('button[type="submit"]')

    Chaining is often clearer and easier to maintain, while combined selectors are more concise.
  */

  // Combined selector (child locator inside nb-card)
  await page.locator('nb-card nb-radio :text-is("Option 1")').click()

  // Chained locators
  await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

  // Avoid relying on .first() or .last() — fragile if the DOM changes
  await page.locator('nb-card').getByRole("button", { name: "Sign in" }).first().click()

  // Avoid using indexes (.nth) — index starts at 0 and can break easily
  await page.locator('nb-card').nth(3).getByRole("button").click()
});


/*  How to locate a Parent Element in order to find a unique child/element on the page:

Sometimes you need to scope your search by starting from a **parent element**
(e.g., a specific container, card, or form) to uniquely identify a child element.
This makes your locator more stable and avoids conflicts when multiple elements
share the same role, label, or text on the page.

In order to find a web element using a "locator method", you can use a "text filter" or "locator filter",
and then chain from this  parent element all the child elements you want to select.
Also, you can alternatively use a filter method that will do exactly the same thing.
The benefit of using a "filter method" is that you can chain multiple filters one by one,
narrowing down your output to the unique element until you get the desired result.
And if you just want to go one level up in the DOM to the parent element
you can use the XPath approach by providing just double dots (..) in the locator element
and then find the child element you want.

These are the several ways to achieve this:

1. Use `hasText` to filter a parent by the visible text it contains.
   Example: page.locator('nb-card', { hasText: 'Basic form' })

2. Use `has` to filter a parent by checking if it contains a specific child.
   Example: page.locator('nb-card', { has: page.locator('#inputEmail1') })

3. Chain `.filter()` calls to narrow down results step by step until only
   the desired element remains.
   Example: page.locator('nb-card').filter({ has: page.locator('nb-checkbox') }).filter({ hasText: 'Sign in' })

Note: You can also use XPath with `..` to move one level up in the DOM
   (parent element), but this approach is **not recommended** in Playwright
   because it’s less readable and harder to maintain.
*/


test('locating parent elements', async ({ page }) => {

  // nb-card that contains the exact text "Using the Grid" → then the Email textbox
  await page
    .locator('nb-card', { hasText: 'Using the Grid' })
    .getByRole('textbox', { name: 'Email' })
    .click();

  // nb-card that has a child matching #inputEmail1 → then the Email textbox
  await page
    .locator('nb-card', { has: page.locator('#inputEmail1') })
    .getByRole('textbox', { name: 'Email' })
    .click();

  // nb-card filtered by text "Basic form" → then the Email textbox
  await page
    .locator('nb-card')
    .filter({ hasText: 'Basic form' })
    .getByRole('textbox', { name: 'Email' })
    .click();

  // nb-card that has a child with class .status-danger → then the Password textbox
  await page
    .locator('nb-card')
    .filter({ has: page.locator('.status-danger') })
    .getByRole('textbox', { name: 'Password' })
    .click();

  // nb-card that has any nb-checkbox and contains "Sign in" → then the Email textbox
  await page
    .locator('nb-card')
    .filter({ has: page.locator('nb-checkbox') })
    .filter({ hasText: 'Sign in' })
    .getByRole('textbox', { name: 'Email' })
    .click();

  // NOT recommended
  // Find the exact text "Using the Grid", go to its parent, then the Email textbox
  await page
    .locator(':text-is("Using the Grid")')
    .locator('..')
    .getByRole('textbox', { name: 'Email' })
    .click();
});
