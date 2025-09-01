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

✅ **Summary:**
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

✅ **So:**

* `fixtures.page` *is* real, but only as a property of the object Playwright passes into your test function.
* Outside of a test callback, it doesn’t exist.

