import { Page } from '@playwright/test';
import { CheckoutPage } from './CheckoutPage';
import { KasirDashboardPage } from './KasirDashboardPage';
import { LoginPage } from './LoginPage';
import { MenuPage } from './MenuPage';

export class PageManager {
    private readonly loginPage: LoginPage;
    private readonly menuPage: MenuPage;
    private readonly checkoutPage: CheckoutPage;
    private readonly kasirDashboardPage: KasirDashboardPage;

    constructor(page: Page) {
        this.loginPage = new LoginPage(page);
        this.menuPage = new MenuPage(page);
        this.checkoutPage = new CheckoutPage(page);
        this.kasirDashboardPage = new KasirDashboardPage(page);
    }

    onLoginPage(): LoginPage {
        return this.loginPage;
    }

    onMenuPage(): MenuPage {
        return this.menuPage;
    }

    onCheckoutPage(): CheckoutPage {
        return this.checkoutPage;
    }

    onKasirDashboardPage(): KasirDashboardPage {
        return this.kasirDashboardPage;
    }
}
