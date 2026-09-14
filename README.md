# POS Restaurant Test Automation

Automation testing project for the POS Go restaurant application:

- Application under test: https://pos.habibiyasin.my.id/
- Target menu page: https://pos.habibiyasin.my.id/menu
- Repository: https://github.com/HabibiYasin/TestAutomationPos
- Reference project: https://github.com/donnyfauzi

This project was created and modified as an automated testing suite for a restaurant POS workflow. It validates customer ordering flows, cart calculations, checkout information, payment summaries, and negative cases.

## Technology

- Playwright for browser automation
- Cucumber for BDD and Gherkin scenarios
- TypeScript with ts-node
- Page Object Model with a Page Manager

## Project Structure

```text
.
├── cucumber.json
├── page-objects/
│   └── pages/
│       ├── CheckoutPage.ts
│       ├── MenuPage.ts
│       └── pageManager.ts
├── tests/
│   ├── features/
│   │   └── pemesanan_pelanggan.feature
│   ├── steps/
│   │   └── pemesanan_pelanggan.steps.ts
│   └── support/
│       └── hooks.ts
├── reports/
├── package.json
└── tsconfig.json
```

## Installation

Requirements:

- Node.js
- npm

Install dependencies:

```bash
npm install
npx playwright install chromium
```

## Run Tests

Run the complete BDD suite in headless mode:

```bash
npm run test:bdd
```

Run only negative scenarios:

```bash
npm run test:bdd -- --tags "@negatif"
```

Run cart calculation scenarios:

```bash
npm run test:bdd -- --tags "@keranjang"
```

Run multi-item scenarios, including checkout payment summary validation:

```bash
npm run test:bdd -- --tags "@multi-item"
```

Run one scenario by name:

```bash
npm run test:bdd -- --name "Perhitungan total harga dengan kuantitas item acak - Percobaan 1"
```

Run with a visible browser without slow motion in PowerShell:

```powershell
$env:HEADED="false"; $env:SLOW_MO="0"; npm run test:bdd
```

Set `SLOW_MO` to a value in milliseconds when manually observing the test, for example `500`.

HTML reports are generated at:

```text
reports/report.html
```

## Supabase transaction cleanup

Requires Node.js 22.15+ (or Node.js 24). Set `SUPABASE_URL` and
`SUPABASE_SECRET_KEY` in the root `.env` file; legacy
`SUPABASE_SERVICE_ROLE_KEY` is also supported. Keep `.env` out of Git.

After each BDD run, the Cucumber coordinator deletes **all transactions for
the current UTC date**, using `created_at >= 00:00 UTC` and `< 00:00 UTC` of
the next day. The date is evaluated when cleanup starts. Use this suite only
with the testing database. Related `transaction_items` are deleted by the
database's existing `ON DELETE CASCADE` constraint.

Cleanup logs the number deleted and checks that no matching transactions
remain. A cleanup error fails the run. Forced process termination may prevent
the hook from running. To run cleanup separately:

```bash
npm run cleanup:transactions
```

## Test Coverage

The suite currently covers:

- Checkout access with an empty cart
- Successful dine-in orders with cash payment
- Successful take-away orders without a table number
- Required customer field validation
- Required table number validation for dine-in orders
- Removing an item when its quantity reaches zero
- Random single-item quantity and total calculations
- Random multi-item quantity and Grand Total calculations
- Checkout validation for Subtotal, 10% VAT, and Total Payment

## Architecture

Business-readable scenarios are stored in `tests/features`. Step definitions connect Gherkin steps to Playwright actions. Page-specific locators and actions are kept in `page-objects/pages`, while `pageManager.ts` centralizes page object initialization.

Randomized cart tests keep item history in scenario state as objects containing the item name, unit price, and quantity. Currency values such as `Rp 15.000` are parsed with a regular expression before mathematical assertions are performed.

## Attribution

This test automation project is for the POS Go restaurant application and was created and modified for the `HabibiYasin/TestAutomationPos` repository, with the requested reference to the work associated with:

https://github.com/donnyfauzi
