### why in `test('name test', ({page}) => { })` `page` needs to be in `{}`

### 1. What `page` is

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

---

### 3. Why this design?

Playwright Test doesn’t inject globals like `page` or `browser`.
Instead, it passes fixtures explicitly into your test function. This makes your tests:

* **Predictable** → no hidden globals.
* **Customizable** → you can define your own fixtures and pass them the same way.
* **Isolated** → each test gets its own `page` and `context`.

---

**So:**

* `fixtures.page` *is* real, but only as a property of the object Playwright passes into your test function.
* Outside of a test callback, it doesn’t exist.

&nbsp;

# 🎭 Playwright Locator Syntax Examples & Cheat Sheet

## Code Example

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

## 📌 Locator Syntax Cheat Sheet

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

## 🧑‍💻 User-facing locators in Playwright

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

## 🔎 Using `data-testid` in Playwright

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
