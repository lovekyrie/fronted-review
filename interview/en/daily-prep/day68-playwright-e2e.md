# Day 68 Playwright E2E execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 68 | Playwright | [Testing strategy](../advanced/week7/testing-strategy), [Automated testing](../engineering/automated-testing) |

## Today's goals

- Finish Playwright Writing Tests docs
- Write 1 E2E sample: login / navigate / assert a key element
- Produce an E2E strategy: core paths + canary data + CI parallelism

## Reading notes

- Locator priority: `getByRole > getByLabel > getByText > locator('css')`, closer to the user
- Default retry + auto-wait; do not sleep by hand
- In CI, E2E uses `workers` for parallelism, but avoid shared state

## Cheat sheet / knowledge

### Locator priority

| Priority | Method | Example | Why |
|--------|------|------|------|
| 1 | `getByRole` | `getByRole('button', { name: 'Submit' })` | Semantic, close to the user |
| 2 | `getByLabel` | `getByLabel('Username')` | Most natural for forms |
| 3 | `getByText` | `getByText('Welcome back')` | Visible text |
| 4 | `getByTestId` | `getByTestId('submit-btn')` | Fallback |
| 5 | `locator('css')` | `locator('.btn-primary')` | Last resort |

### Common expect assertions

```ts
await expect(page).toHaveURL('/dashboard')
await expect(page).toHaveTitle('Home')
await expect(locator).toBeVisible()
await expect(locator).toHaveText('Hello')
await expect(locator).toHaveCount(3)
await expect(locator).toBeDisabled()
await expect(locator).toHaveAttribute('href', '/about')
```

### Playwright core features

| Feature | Notes |
|------|------|
| **Auto-wait** | Automatically wait until the element is visible + actionable before acting |
| **Retry** | Assertions retry by default until timeout |
| **Trace Viewer** | Records per-step screenshots + network + DOM; great for debugging |
| **Multi-browser** | Chromium / Firefox / WebKit |
| **Parallel** | `workers` controls concurrency |
| **Codegen** | `npx playwright codegen` records and generates code |

### E2E strategy principles

```text
✅ Cover: core business paths (login/signup/order/pay/logout)
✅ Cover: P0 regression (smoke that every release must pass)
❌ Do not cover: every UI detail (use component tests instead)
❌ Do not cover: every combination (use parameterized unit tests instead)
```

## Handwritten / flowcharts

### Full E2E example: login flow

```ts
import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Account').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('invalid credentials shows error', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Account').fill('wrong@example.com')
    await page.getByLabel('Password').fill('wrong')
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect(page.getByText('Invalid account or password')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })
})
```

### Page Object Model

```ts
// pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Account').fill(email)
    await this.page.getByLabel('Password').fill(password)
    await this.page.getByRole('button', { name: 'Log in' }).click()
  }
}

// tests/login.spec.ts
test('login', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login('admin@example.com', 'password123')
  await expect(page).toHaveURL('/dashboard')
})
```

### CI config

```yaml
# .github/workflows/e2e.yml
- name: Run E2E
  run: npx playwright test --workers=4 --reporter=html
- name: Upload trace
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-traces
    path: test-results/
```

## Oral questions

### 1. Which scenarios should E2E cover?

Answer template:

> Only **core business paths** — the ones users take most, and where a bug hurts most. For ecommerce: login → search → add to cart → place order → pay. These are P0 paths; every release must pass them.
>
> Do not cover UI details and every combination — leave those to component and unit tests. E2E ROI is “few and sharp”: 10–20 critical tests beat 200 brittle ones. In my experience, keep E2E count around 1/10 of component tests.

### 2. How do you treat the usual E2E “slow + brittle” problems?

Answer template:

> For “slow”: first, run in parallel with `workers` in CI (4–8 workers). Second, each test is independent and does not rely on the previous test’s state, so they can run in any order. Third, set up preconditions via API (e.g. create a user with an API) instead of driving the UI.
>
> For “brittle”: first, use semantic locators (`getByRole` / `getByLabel`) instead of CSS selectors, so style tweaks do not break tests. Second, rely on Playwright’s built-in auto-wait and retry; do not `sleep` by hand. Third, isolate test data — each test gets its own account, no shared state. Fourth, on failure use Trace Viewer (screenshots + network + DOM snapshots) to find the cause.

## 5-minute recording order

Record in this order; do not reorganize on the spot:

1. Where E2E sits in the layers + what it covers (1 min)
2. Locator priority + auto-wait + no sleep (2 min)
3. CI parallelism + Trace Viewer debugging + Page Object pattern (2 min)

After recording, self-check:

- Did you say `getByRole` beats CSS selectors.
- Did you mention auto-wait and retry.
- Did you say E2E only covers P0 core paths.
- Did you mention Trace Viewer’s debugging value.

## Today's recap

The 3 points that most need review today:

1. Skipping login with Playwright `test.use({ storageState })`.
2. Playwright Component Testing (experimental) vs Vitest component tests.
3. When to use visual regression (`toHaveScreenshot`) and how to set the threshold.
