import { expect, Page } from '@playwright/test';

export class LoginPage {
    constructor(private readonly page: Page) {}

    async buka(): Promise<void> {
        await this.page.goto('https://pos.habibiyasin.my.id/login');
    }

    async login(email: string, password: string): Promise<void> {
        await this.page.getByPlaceholder('nama@email.com').fill(email);
        await this.page.getByPlaceholder('Masukkan password').fill(password);
        await this.page.getByRole('button', { name: 'Masuk', exact: true }).click();
    }

    async validasiPengalihan(url: string): Promise<void> {
        await expect(this.page).toHaveURL(url);
    }

    async validasiLoginDitolak(): Promise<void> {
        await expect(this.page.getByRole('alert')).toContainText('Email atau password salah, silahkan coba lagi');
    }
}