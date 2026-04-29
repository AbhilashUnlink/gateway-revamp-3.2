import { expect, type Locator, type Page } from '@playwright/test';
import { TEST_CONFIG } from '../../fixtures/test-config';
import { scrollUntilRowCount } from '../../utils/scroll';
import { log } from '../../utils/logger';

export interface TransactionRowSnapshot {
  index: number;
  refId: string | null;
}

export class TransactionsPage {
  readonly page: Page;
  readonly tableContainer: Locator;
  readonly rows: Locator;
  readonly skeletonRows: Locator;
  readonly emptyState: Locator;
  readonly endOfData: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tableContainer = page
      .getByTestId('transactions-table')
      .or(
        page
          .locator('table')
          .first()
          .locator('xpath=ancestor::div[contains(@class, "overflow-auto")][1]')
      )
      .first();
    this.rows = page
      .getByTestId('transactions-row')
      .or(
        page
          .locator('table tbody tr:not([data-testid="skeleton-row"])')
          .filter({ hasNotText: /no more data|empty/i })
      )
      .filter({ has: page.locator('td:not([colspan])') });
    this.skeletonRows = page
      .getByTestId('skeleton-row')
      .or(page.locator('[class*="animate-pulse"]'));
    this.emptyState = page.getByText(/no\s*data|empty/i).first();
    this.endOfData = page.getByText(/no more data/i);
  }

  async goto() {
    await this.page.goto(TEST_CONFIG.routes.transactions);
    await this.waitForInitialLoad();
  }

  async waitForInitialLoad() {
    await expect(async () => {
      const rowCount = await this.rows.count();
      if (rowCount > 0) return;
      await expect(this.emptyState.or(this.endOfData)).toBeVisible();
    }).toPass({ timeout: 30_000 });
    await expect(this.skeletonRows).toHaveCount(0, { timeout: 30_000 });
  }

  async loadAtLeast(targetCount: number): Promise<number> {
    log.info(`Loading rows via infinite scroll`, { targetCount });
    const rendered = await scrollUntilRowCount(this.page, {
      targetCount,
      rowsLocator: this.rows,
      scrollContainer: this.tableContainer,
      stepPx: TEST_CONFIG.scroll.stepPx,
      settleMs: TEST_CONFIG.scroll.settleMs,
      maxAttempts: TEST_CONFIG.scroll.maxAttempts,
      idleAttemptsBeforeStop: TEST_CONFIG.scroll.idleAttemptsBeforeStop,
    });
    await expect(this.skeletonRows).toHaveCount(0, { timeout: 15_000 });
    return rendered;
  }

  async getRowSnapshots(limit: number): Promise<TransactionRowSnapshot[]> {
    const total = Math.min(await this.rows.count(), limit);
    const snapshots: TransactionRowSnapshot[] = [];
    for (let i = 0; i < total; i++) {
      const row = this.rows.nth(i);
      const refId = (await row.locator('td').first().innerText()).split('\n')[0]?.trim() || null;
      snapshots.push({ index: i, refId });
    }
    return snapshots;
  }

  async openRow(index: number) {
    const row = this.rows.nth(index);
    await row.scrollIntoViewIfNeeded();
    await Promise.all([
      this.page.waitForURL(/\/transactions\/[^/]+/, { timeout: 15_000 }),
      row.click(),
    ]);
  }

  /**
   * Click the transaction-ref-id link in the first cell to open the global drawer
   * (DrawerManager). This does NOT navigate the page — it adds ?drawer=details&id=...
   *
   * The first column (cellType: 'link-copy') renders a clickable <span> for the ref id
   * next to a <button aria-label="Copy">. We must click the SPAN, not the button.
   */
  async openDrawer(index: number) {
    const row = this.rows.nth(index);
    await row.scrollIntoViewIfNeeded();
    const firstCell = row.locator('td').first();
    const refLink = firstCell
      .getByTestId('transactions-row-ref-link')
      .or(firstCell.locator('span.cursor-pointer'))
      .or(firstCell.locator('span').first())
      .first();
    await Promise.all([this.page.waitForURL(/[?&]drawer=/, { timeout: 15_000 }), refLink.click()]);
  }

  async returnToList() {
    await this.page.goBack();
    await this.waitForInitialLoad();
  }
}
