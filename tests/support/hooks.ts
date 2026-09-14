import { After, AfterAll, Before, HookTarget, setDefaultTimeout, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { PageManager } from '../../page-objects/pages/pageManager';
import { cleanupTodayTransactions } from './transactionCleanup';

setDefaultTimeout(30_000);

declare module '@cucumber/cucumber' {
    interface World {
        browser: Browser;
        context: BrowserContext;
        page: Page;
        pm: PageManager;
        randomItemName: string;
        hargaSatuan: number;
        kuantitasAkhir: number;
        multiItems: Array<{ namaItem: string; hargaSatuan: number; kuantitas: number }>;
    }
}

Before(async function (this: World) {
    this.browser = await chromium.launch({
        headless: process.env.HEADED !== 'true',
        slowMo: Number(process.env.SLOW_MO ?? 0),
    });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
});

After(async function (this: World) {
    await this.browser?.close();
});

AfterAll({ name: 'Delete today transactions (UTC)', on: HookTarget.COORDINATOR, timeout: 70_000 }, async function () {
    await cleanupTodayTransactions();
});
