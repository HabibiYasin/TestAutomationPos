import { Page } from '@playwright/test';
import { CheckoutPage } from './CheckoutPage';
import { MenuPage } from './MenuPage';

export class PageManager {
    private readonly menuPage: MenuPage;
    private readonly checkoutPage: CheckoutPage;

    constructor(page: Page) {
        this.menuPage = new MenuPage(page);
        this.checkoutPage = new CheckoutPage(page);
    }

    onMenuPage(): MenuPage {
        return this.menuPage;
    }

    onCheckoutPage(): CheckoutPage {
        return this.checkoutPage;
    }
}
