import { Given, Then, When } from '@cucumber/cucumber';
import { PageManager } from '../../page-objects/pages/pageManager';

Given('pelanggan telah memesan pesanan yang valid', async function () {
    this.pm = new PageManager(this.page);
    await this.pm.onMenuPage().siapkanCheckoutDenganItem('Ice Cappucino');
    await this.pm.onCheckoutPage().isiDataPelanggan('Habibi Yasin', '081234567890');
    await this.pm.onCheckoutPage().pilihTipePesanan('Makan di tempat');
    await this.pm.onCheckoutPage().isiNomorMeja('5');
    await this.pm.onCheckoutPage().pilihMetodePembayaran('Tunai');
    await this.pm.onCheckoutPage().buatPesanan();
    await this.pm.onCheckoutPage().validasiPesananBerhasil();
});

When('kasir membuka halaman login {string}', async function (url: string) {
    this.pm = new PageManager(this.page);
    await this.page.goto(url);
});

When('kasir login menggunakan email {string} dan password {string}', async function (email: string, password: string) {
    await this.pm.onLoginPage().login(email, password);
    await this.pm.onKasirDashboardPage().validasiDashboard();
});

When('kasir klik pesanan baru', async function () {
    await this.pm.onKasirDashboardPage().bukaPesananBaru();
});

When('kasir klik tombol {string}', async function (namaTombol: string) {
    if (namaTombol === 'Konfirmasi Pembayaran Tunai') {
        await this.pm.onKasirDashboardPage().konfirmasiPembayaranTunai();
        return;
    }

    if (namaTombol === 'Ya, Sudah Dibayar Tunai') {
        await this.pm.onKasirDashboardPage().konfirmasiSudahDibayarTunai();
        return;
    }

    if (namaTombol === 'Kirim ke Dapur') {
        await this.pm.onKasirDashboardPage().kirimKeDapur();
        return;
    }

    throw new Error(`Tombol kasir tidak didukung: ${namaTombol}`);
});

Then('pesanan hilang dari dashboard kasir', async function () {
    await this.pm.onKasirDashboardPage().validasiPesananHilangDariDashboard();
});
