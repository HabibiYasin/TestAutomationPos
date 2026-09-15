import { expect, Page } from '@playwright/test';

export class KasirDashboardPage {
    private nomorPesanan = '';

    constructor(private readonly page: Page) {}

    async validasiDashboard(): Promise<void> {
        await expect(this.page).toHaveURL('https://pos.habibiyasin.my.id/kasir/dashboard');
        await expect(this.page.getByRole('heading', { name: /Selamat Datang, Kasir 1!/i })).toBeVisible();
    }

    async bukaPesananBaru(): Promise<void> {
        await this.page.getByRole('button', { name: 'Baru', exact: true }).click();
        const nomorPesanan = this.page.getByText(/^#[A-Z0-9]+$/, { exact: true }).first();
        await expect(nomorPesanan).toBeVisible();
        this.nomorPesanan = (await nomorPesanan.innerText()).trim();
        await nomorPesanan.click();
    }

    async konfirmasiPembayaranTunai(): Promise<void> {
        await this.page.getByRole('button', { name: /Konfirmasi Pembayaran Tunai/i }).click();
    }

    async konfirmasiSudahDibayarTunai(): Promise<void> {
        await this.page.getByRole('button', { name: /Ya, Sudah Dibayar Tunai/i }).click();
    }

    async kirimKeDapur(): Promise<void> {
        await this.page.getByRole('button', { name: /Kirim ke Dapur/i }).click();
    }

    async validasiPesananHilangDariDashboard(): Promise<void> {
        const antrian = this.page.getByRole('heading', { name: 'Antrian Pesanan' }).locator('..');
        await expect(antrian.getByText(this.nomorPesanan, { exact: true })).toHaveCount(0);
    }
}
