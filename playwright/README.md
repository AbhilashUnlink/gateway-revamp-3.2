# `playwright/` — E2E suite

All Playwright artefacts (config, POMs, utils, specs, reports) live in this folder.

## Layout

```
playwright/
├── playwright.config.ts          # config (testDir, reporters, baseURL, webServer)
├── .env.example                  # copy to .env, fill in creds
├── .gitignore                    # ignores .env + reports
├── README.md
│
├── fixtures/
│   └── test-config.ts            # creds, routes, scroll tuning, action labels
│
├── pages/
│   ├── auth/
│   │   └── LoginPage.ts
│   └── transactions/
│       ├── TransactionsPage.ts          # table + infinite scroll + row navigation
│       ├── TransactionDetailsPage.ts    # /transactions/:id action buttons
│       └── TransactionDrawerPage.ts     # global drawer action buttons
│
├── utils/
│   ├── scroll.ts                 # scroll-until-N-rows w/ idle detection
│   ├── retry.ts                  # backoff retry helper
│   ├── logger.ts                 # structured console logging
│   └── validators.ts             # per-row + cross-surface assertions
│
├── tests/
│   └── transactions/
│       └── action-buttons.spec.ts
│
└── reports/                      # generated; html, junit, traces, screenshots, videos
    ├── html/
    ├── junit.xml
    └── artifacts/                # per-test traces + media
```

## Install

```bash
npm i -D @playwright/test dotenv
npx playwright install --with-deps chromium
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "test:e2e": "playwright test --config=playwright/playwright.config.ts",
    "test:e2e:ui": "playwright test --config=playwright/playwright.config.ts --ui",
    "test:e2e:report": "playwright show-report playwright/reports/html"
  }
}
```

## Configure

Copy `playwright/.env.example` → `playwright/.env` and fill in:

```
BASE_URL=http://localhost:5173
TEST_USERNAME=...
TEST_PASSWORD=...
TRANSACTION_COUNT=20
```

`fixtures/test-config.ts` calls `dotenv.config()` so this file is loaded automatically.

## Run

```bash
npm run test:e2e

# bump row count, no code change
TRANSACTION_COUNT=100 npm run test:e2e

# point at staging
BASE_URL=https://staging.example.com npm run test:e2e
```

In CI (`CI=1`), Playwright auto-starts `npm run dev` (see `webServer` block).

## What it asserts per row

For each of the top N rows:

1. **Drawer flow** — click the transaction-ref-id link in the first cell:
   - URL gets `?drawer=details&id=...`, the global drawer renders.
   - Read visibility of `refund` / `capture` / `void` / `dispute` / `editStatus` from the drawer header.
   - Close the drawer (close button → ESC fallback).
2. **Details page flow** — click the row body:
   - Navigates to `/transactions/:id`.
   - Read visibility on the details page.
3. **Cross-surface check** — drawer and details page both consume `selectTransactionActions`; their visibility maps must be identical.
4. **Per-button**: any visible button must also be _enabled_ (catches loading-stuck UI).
5. **Mutual exclusion**: `capture` and `void` cannot both be visible (mirrors selector logic).
6. **Logging**: per row + per surface, with the transaction ref id — failures pinpoint **which** transaction broke and on **which** surface.

## Recommended `data-testid`s in app code

| Component                                                   | testid                                                                                                                     |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `LoginForm.tsx` username/password/submit                    | `login-username`, `login-password`, `login-submit`                                                                         |
| `DataTable.tsx` outer scroll wrapper                        | `transactions-table`                                                                                                       |
| `TableRow.tsx` `<tr>`                                       | `transactions-row`                                                                                                         |
| `CopyCell.tsx` primary `<span>` (when `onPrimaryClick` set) | `transactions-row-ref-link`                                                                                                |
| `SkeletonRow.tsx` `<tr>`                                    | `skeleton-row`                                                                                                             |
| `TransactionDetailsPage.tsx` action buttons                 | `action-refund`, `action-capture`, `action-void`, `action-dispute`, `action-editStatus`                                    |
| `DasDrawer/index.tsx` panel root                            | `transaction-drawer`                                                                                                       |
| `DrawerTransactionHeader.tsx` action buttons                | `drawer-action-refund`, `drawer-action-capture`, `drawer-action-void`, `drawer-action-dispute`, `drawer-action-editStatus` |

The suite falls back to role + accessible name when testids aren't present, but adding them removes brittleness.

## Tuning

- `TEST_CONFIG.scroll.maxAttempts` — hard cap on scroll iterations.
- `TEST_CONFIG.scroll.idleAttemptsBeforeStop` — no-progress scrolls tolerated before assuming end of data.
- `retry({ attempts, delayMs })` — per-row retry budget for flaky transitions.
