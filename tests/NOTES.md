## Index

* [1. What `page` is](#1-what-page-is)
* [2. Why `{ page }` (destructuring)](#2-why-page-destructuring)
* [3. If you wanted multiple fixtures](#3-if-you-wanted-multiple-fixtures)
* [but `fixtures.page` is not a real thing](#but-fixturespage-is-not-a-real-thing-in-the-sense-i-cannot-use-it-as-code)

  * [1. How Playwright Test calls your test](#1-how-playwright-test-calls-your-test)
  * [2. Destructuring vs. full object](#2-destructuring-vs-full-object)
  * [3. Why this design?](#3-why-this-design)
* [🎭 Playwright Locator Syntax Examples & Cheat Sheet](#playwright-locator-syntax-examples--cheat-sheet)

  * [Code Example](#code-example)
  * [Locator Syntax Cheat Sheet](#locator-syntax-cheat-sheet)
  * [User-facing locators in Playwright](#user-facing-locators-in-playwright)
  * [Using `data-testid` in Playwright](#using-data-testid-in-playwright)
  * [Child Elements in Play](#child-elements-in-play)
  * [Parent Elements in Playwright](#parent-elements-in-playwright)
  * [How reuse locators](#how-reuse-locators)
  * [Extracting Values in Playwright](#extracting-values-in-playwright)

    * [RECAP](#recap)
    * [Example Test](#example-test)
* [Assertions](#assertions)

  * [1. General Assertions](#1-general-assertions)
  * [2. Locator Assertions](#2-locator-assertions)
  * [Soft assertions](#soft-assertions)
  * [Example Test](#example-test)
* [Auto-Waiting](#auto-waiting)
* [Timeouts](#timeouts)
* [Section UI Components](#section-ui-components)

  * [Input Fields](#input-fields)
  * [Radio Buttons](#radio-buttons)
  * [Checkboxes](#checkboxes)
  * [Lists and Dropdowns](#lists-and-dropdowns)
  * [Tooltips](#tooltips)
  * [Dialog Boxes](#dialog-boxes)
  * [Web Tables (Part 1)](#web-tables-part-1)
  * [Web Tables (Part 2)](#web-tables-part-2)
  * [Date Picker (Part 1)](#date-picker-part-1)
  * [Date Picker (Part 2)](#date-picker-part-2)
  * [Sliders](#sliders)
  * [Drag & Drop with iFrames](#drag--drop-with-iframes)


### 1. What `page` is

Why in `test('name test', ({page}) => { })` `page` needs to be in `{}`

In Playwright Test, every test gets access to a set of built-in **fixtures** — ready-made objects you can use in your tests.
The most common one is `page`, which represents a single browser tab.

Other fixtures include:

* `browser` → the browser instance
* `context` → the browser context (like a profile / isolated session)
* `request` → an APIRequestContext for API testing

---

### 2. Why `{ page }` (destructuring)

Fixtures are passed to your test function as **one object**.
So Playwright actually calls your test with something like:

```ts
test('the first test', async (fixtures) => {
  // fixtures.page, fixtures.context, fixtures.browser, etc.
});
```

To make it easier, you use **object destructuring**:

```ts
test('the first test', async ({ page }) => {
  // instead of fixtures.page
  await page.goto('https://example.com');
});
```

Here, `{ page }` means *“take the `page` property from the fixtures object and bind it to a local variable called `page`.”*

---

### 3. If you wanted multiple fixtures

You can destructure more than one:

```ts
test('with multiple fixtures', async ({ page, context, browser }) => {
  console.log(await context.cookies());
});
```

Or if you prefer, you could accept the full object and use dot notation (less common):

```ts
test('without destructuring', async (fixtures) => {
  await fixtures.page.goto('https://example.com');
});
```

---

**Summary:**
`page` is not a magical keyword — it’s a **fixture property**.
Playwright injects an object with all fixtures into your test, and `{ page }` is just JavaScript object destructuring to pull out the `page` property.

### but fixtures.page is not a real thing, in the sense I cannot use it as code

Exactly — you’ve spotted the subtlety 👀

You’re right: you can’t just write `fixtures.page` out of nowhere in your code, because there’s no global variable named `fixtures`.

Here’s what’s happening under the hood:

---

### 1. How Playwright Test calls your test

When you write:

```ts
test('the first test', async ({ page }) => {
  await page.goto('https://example.com');
});
```

Playwright actually runs it *roughly like this* internally:

```ts
async function runTest() {
  const fixtures = {
    page: /* a ready-to-use Page object */,
    context: /* the BrowserContext */,
    browser: /* the Browser */,
    request: /* APIRequestContext */,
    // ... other built-ins
  };

  // then your function is called with those fixtures
  await yourTestFunction(fixtures);
}
```

So **`fixtures` exists only as the argument** passed into your test callback.
That’s why you can’t just type `fixtures.page` at the top level of your file — it’s not defined in global scope.

---

### 2. Destructuring vs. full object

If you want to use `fixtures.page`, you need to declare the parameter as a single object:

```ts
test('without destructuring', async (fixtures) => {
  await fixtures.page.goto('https://example.com');
});
```

But almost everyone prefers destructuring for brevity:

```ts
test('with destructuring', async ({ page }) => {
  await page.goto('https://example.com');
});
```

Both are equivalent — destructuring just pulls out the property you need.


### 3. Why this design?

Playwright Test doesn’t inject globals like `page` or `browser`.
Instead, it passes fixtures explicitly into your test function. This makes your tests:

* **Predictable** → no hidden globals.
* **Customizable** → you can define your own fixtures and pass them the same way.
* **Isolated** → each test gets its own `page` and `context`.


**So:**

* `fixtures.page` *is* real, but only as a property of the object Playwright passes into your test function.
* Outside of a test callback, it doesn’t exist.

&nbsp;

# Playwright Locator Syntax Examples & Cheat Sheet

### Code Example

```ts
import { test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async ({ page }) => {
    // by Tag name (args: a string and an obj for different options)
    page.locator("input")

    // by ID
    page.locator('#inputEmail1')

    // by Class value
    page.locator(".shape-rectangle")

    // by attribute
    page.locator('[placeholder="Email"]')

    // by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // combine different selectors
    page.locator('input [placeholder="Email"][nbinput]')

    // by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")')
})
````

## Locator Syntax Cheat Sheet

| Locator Type                     | Syntax                                     | Example / Notes                                                                                     |
| -------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **By Tag name**                  | `page.locator("tag")`                      | `page.locator("input")`                                                                             |
| **By ID**                        | `page.locator("#id")`                      | `page.locator("#inputEmail1")`                                                                      |
| **By Class (single)**            | `page.locator(".className")`               | `page.locator(".shape-rectangle")`                                                                  |
| **By Attribute**                 | `page.locator('[attr="value"]')`           | `page.locator('[placeholder="Email"]')`                                                             |
| **By Full Class Value**          | `page.locator('[class="..."]')`            | `page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')` |
| **By Combined Selectors**        | `page.locator('tag [attr] [anotherAttr]')` | `page.locator('input [placeholder="Email"] [nbinput]')`                                             |
| **By XPath** (❌ not recommended) | `page.locator('//xpath')`                  | `page.locator('//*[@id="inputEmail1"]')`                                                            |
| **By Partial Text**              | `page.locator(':text("partial")')`         | `page.locator(':text("Using")')`                                                                    |
| **By Exact Text**                | `page.locator(':text-is("exact text")')`   | `page.locator(':text-is("Using the Grid")')`                                                        |

---

🔹 **Important Notes:**

* `locator()` → does **not** return a *Promise*, it returns a Locator object.
* Methods like `click()`, `fill()`, `type()` → return a *Promise*, so they must be awaited with `await`.
```ts
    page.locator("input") // does not return a promise
    
    await page.locator("input").click() // return a promise
```
* Avoid **XPath**: Playwright supports more robust and readable selectors.

&nbsp;

## User-facing locators in Playwright

Playwright provides different ways to locate elements that are **visible and meaningful to the user**.  
Here’s a test example showing the most common locator strategies:

```ts
import { test } from '@playwright/test';

test('User facing locators', async ({ page }) => {
  // By role + accessible name
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
````

👉 Use **user-facing locators** whenever possible (`getByRole`, `getByLabel`, `getByText`),
and keep `getByTestId` as a fallback when no semantic locator is available.

&nbsp;

## Using `data-testid` in Playwright

### Example HTML snippet

```html
<div class="form-group row">
  <div class="offset-sm-3 col-sm-9">
    <button data-testid="SignIn"
            type="submit"
            nbButton
            status="primary">
      Sign_in
    </button>
  </div>
</div>
````


### What is `data-testid`?

* `data-testid` is a **custom HTML attribute** used only for testing purposes.
* It does **not affect rendering** or the application itself.
* Its purpose is to provide a **stable selector** that will not break when classes, styles, or IDs change.
* It is widely used in Playwright, Testing Library, and Cypress.


### Playwright Example

```ts
import { test, expect } from '@playwright/test';

test('login button works', async ({ page }) => {
  await page.goto('http://localhost:4200/');

  // Locate button by test id
  const signInButton = page.getByTestId('SignIn');

  await expect(signInButton).toBeVisible();
  await signInButton.click();
});
```

👉 `page.getByTestId('SignIn')` directly matches `data-testid="SignIn"` in the HTML.


### 📌 Best Practices

* ✅ Prefer **semantic locators** (`getByRole`, `getByLabel`, `getByText`) when possible.
* ✅ Use `data-testid` only when semantic locators are not available (e.g., custom UI components, icons).
* 🚫 Avoid CSS selectors or IDs — they are likely to change during UI refactoring.
* 🚫 Do not overuse `data-testid`; keep it as a **fallback** strategy.

&nbsp;

## Child Elements in Play

```ts
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
```


## Parent Elements in Playwright

How to locate a Parent Element in order to find a unique child/element on the page:

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


```ts
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
```
## How reuse locators

```ts
test('Reusing the locators', async ({ page }) => {

  /* FROM

    await page.locator('nb-card').filter({ hasText: 'Basic form' }).getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page.locator('nb-card').filter({ hasText: 'Basic form' }).getByRole('textbox', { name: 'Password' }).fill('Welcome123');
    await page.locator('nb-card').filter({ hasText: 'Basic form' }).getByRole('button').click();

    TO
  */
  const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });
  const emailField = basicForm.getByRole('textbox', { name: 'Email' });

  await emailField.fill('test@test.com');
  await basicForm.getByRole('textbox', { name: 'Password' }).fill('Welcome123');
  await basicForm.locator('nb-checkbox').click();
  await basicForm.getByRole('button').click();

  await expect(emailField).toHaveValue('test@test.com');
});
```

## Extracting Values in Playwright

When working with elements on a web page, Playwright provides different methods
depending on what you want to retrieve:

| Method              | Description                                                                 | Example                                                                 |
|---------------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------|
| `.textContent()`    | Gets the text of a **single element**.                                      | `await page.locator('button').textContent()` → `"Submit"`              |
| `.allTextContents()`| Gets the text of **all matching elements** (returns an array of strings).   | `await page.locator('nb-radio').allTextContents()` → `["Option 1", "Option 2"]` |
| `.inputValue()`     | Gets the **value property** of an input field (not text content).           | `await page.getByRole('textbox').inputValue()` → `"test@test.com"`     |
| `.getAttribute()`   | Gets the value of a specific **attribute** of an element.                   | `await page.getByRole('textbox').getAttribute('placeholder')` → `"Email"` |

#### RECAP

- If you want to grab a single text from a web page element, use the method `.textContent()`.
  - If you want to grab all text elements from a list of web elements (for example, radio buttons),
    use the method `.allTextContents()`.
  - If you want to get the property of an input field (for example, its value), which is not text content,
    use the method `.inputValue()`.
  - If you want to get the value of any attribute on the web page, use the method `.getAttribute()`.
    As an argument, provide the name of the attribute and you will get the value of that particular attribute.

### Example Test

```ts
test.('extracting values', async ({ page }) => {
  // Locate the Basic form card
  const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });

  // 1. Single text value
  // .textContent() → gets the text of a single element
  const buttonText = await basicForm.locator('button').textContent();
  expect(buttonText).toEqual('Submit');

  // 2. All text values
  // .allTextContents() → gets the text of all matching elements (returns an array)
  const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents();
  expect(allRadioButtonsLabels).toContain('Option 1');

  // 3. Input value
  // .inputValue() → gets the value property of an input field (not the text content)
  const emailField = basicForm.getByRole('textbox', { name: 'Email' });
  await emailField.fill('test@test.com');
  const emailValue = await emailField.inputValue();
  expect(emailValue).toEqual('test@test.com');

  // 4. Attribute value
  // .getAttribute() → gets the value of a specific attribute
  const placeholderValue = await emailField.getAttribute('placeholder');
  expect(placeholderValue).toEqual('Email');
});
```

&nbsp;

# Assertions

Playwright has 2 type of assertions:
1. general assertion and
2. locator assertions

### 1. **General Assertions**

These are just plain **`expect`** checks on any JavaScript value (numbers, strings, objects, arrays).

* Example:

  ```ts
  const result = 5;
  expect(result).toBe(5);
  expect([1, 2, 3]).toContain(2);
  expect('Hello').toMatch(/Hell/);
  ```

They do **not** auto-wait — they check immediately when that line executes.
You can look in the list of this method just by typing dot `expect(result).` and see the list of all possible assertions.

&nbsp;

Here’s the list of **general (value) assertions** you can use with `expect(value)` — i.e., not tied to locators:

* `toBe(value)` (method) GenericAssertions<void>
* `toEqual(value)`
* `toStrictEqual(value)`
* `toBeTruthy()`
* `toBeFalsy()`
* `toBeDefined()`
* `toBeUndefined()`
* `toBeNull()`
* `toBeNaN()`
* `toBeGreaterThan(number)`
* `toBeGreaterThanOrEqual(number)`
* `toBeLessThan(number)`
* `toBeLessThanOrEqual(number)`
* `toBeCloseTo(number, numDigits?)`
* `toContain(item)` (arrays/strings/Sets)
* `toContainEqual(item)` (deep contain)
* `toHaveLength(number)`
* `toHaveProperty(keyPath, value?)`
* `toMatch(regexOrString)`
* `toMatchObject(object)` (partial object match)
* `toBeInstanceOf(Class)`
* `toThrow(errorOrMessage?)` *(alias: `toThrowError`)*
* `toMatchSnapshot(nameOrOptions?)` *(for strings/buffers/objects; snapshot testing)*

&nbsp;

**Modifiers & helpers you can combine with any of the above:**

* `.not` (negation) → `expect(value).not.toBe(3)`
* `.resolves` / `.rejects` (for Promises) → `await expect(promise).resolves.toEqual(...)`
* `.soft` (don’t fail the test immediately) → `await expect.soft(value).toEqual(...)`
* Asymmetric matchers:
  `expect.any(Constructor)`, `expect.anything()`,
  `expect.arrayContaining(items)`, `expect.objectContaining(obj)`,
  `expect.stringContaining(substr)`, `expect.stringMatching(re)`

&nbsp;

### 2. **Locator Assertions**

Special assertions tied to **Playwright locators**.

Assert UI state on elements (text, visibility, attributes, etc.).

They **auto-retry** until the condition is true or the **expect timeout** is reached. (default **5**s).


Example:

  ```ts
  const button = page.getByRole('button', { name: 'Submit' });
  await expect(button).toBeVisible();
  await expect(button).toHaveText('Submit');
  await expect(page.locator('#username')).toHaveValue('laura');
  ```
Very useful in E2E because the DOM may take time to update.

&nbsp;

Here’s a simple list of **locator assertions**:

* `toBeVisible()` (method) LocatorAssertions
* `toBeHidden()`
* `toBeEnabled()`
* `toBeDisabled()`
* `toBeEditable()`
* `toBeChecked()`
* `toBeFocused()`
* `toBeInViewport()`
* `toHaveText(text | regex | string[])`
* `toContainText(text | regex | string[])`
* `toHaveValue(value)`
* `toHaveValues(values[])`
* `toHaveAttribute(name, value)`
* `toHaveClass(className | regex | string[])`
* `toHaveCount(number)`
* `toHaveCSS(name, value)`
* `toHaveJSProperty(name, value)`
* `toHaveScreenshot([options])`
* `toHaveAccessibleName(name)`
* `toHaveAccessibleDescription(desc)`

*(All locator assertions auto-wait; you can use `.not` and `.soft` too.)*


📌 **Key difference**:

* General assertions → check values right away.
* Locator assertions → tied to Playwright’s auto-waiting (smart retries, DOM awareness).

### Soft assertions

Add .soft to keep the test running even if the assertion fails (failure is reported but doesn’t stop execution).

Works with both general and locator assertions.

```ts
await expect.soft(btn).toHaveText('Submit');
```

### Example Test

```ts
test('assertions', async ({ page }) => {
  // Locate the "Basic form" button inside the nb-card
  const basicFormButton = page
    .locator('nb-card')
    .filter({ hasText: "Basic form" })
    .locator('button');

  // General assertions (no auto-wait)
  const value = 5;
  expect(value).toEqual(5);

  // Read button text as a plain value and assert equality
  const text = await basicFormButton.textContent();
  expect(text).toEqual("Submit");

  // Locator assertion (auto-waits for the DOM state)
  await expect(basicFormButton).toHaveText('Submit');

  // Soft assertion (test continues even if this fails)
  await expect.soft(basicFormButton).toHaveText('Submit5');

  // Click the button (separate statement; semicolon above is required)
  await basicFormButton.click();
});
```

## Auto-Waiting

```ts
import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
})
test('auto waiting', async ({ page }) => {
    const successButton = page.locator('.bg-success')
    // await successButton.click()
    // const text = await successButton.textContent()
    // await successButton.waitFor({state: "attached"})
    // const text = await successButton.allTextContents()
    // expect(text).toContain ('Data loaded with AJAX get request.')
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 })
})

test('alternative waits', async({page}) => {
  const successButton = page. locator('.bg-success')
  //
  // wait for element
  // await page.waitForSelector('.bg-success')
  // _wait for particlular response
  // await page.waitForResponse('http://uitestingplayground.com/ajaxdata')
  // _wait for network calls to be completed ('NOT RECOMMENDED')
  // await page.waitForLoadState('networkidle')
  const text = await successButton.allTextContents()
  expect(text).toContain ('Data loaded with AJAX get request.')
})
```
