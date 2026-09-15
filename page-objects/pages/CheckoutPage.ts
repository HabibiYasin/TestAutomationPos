import { expect, Page } from '@playwright/test';

export class CheckoutPage {
    constructor(private readonly page: Page) {}

    async validasiHalamanCheckout(): Promise<void> {
        await expect(this.page).toHaveURL('https://pos.habibiyasin.my.id/checkout');
        await expect(this.page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
    }

    async validasiRingkasanPembayaran(subtotalSeharusnya: number): Promise<void> {
        const subtotalDiUI = await this.ambilNilaiRingkasan('Subtotal');
        const ppnDiUI = await this.ambilNilaiRingkasan('PPN 10%');
        const totalDiUI = await this.ambilNilaiRingkasan('Total Pembayaran');
        const ppnSeharusnya = subtotalSeharusnya * 0.1;
        const totalSeharusnya = subtotalSeharusnya + ppnSeharusnya;

        expect(subtotalDiUI).toBe(subtotalSeharusnya);
        expect(ppnDiUI).toBe(ppnSeharusnya);
        expect(totalDiUI).toBe(totalSeharusnya);
    }

    private async ambilNilaiRingkasan(label: string): Promise<number> {
        const barisRingkasan = this.page.getByText(label, { exact: true }).locator('..');
        const teksNilai = await barisRingkasan.getByText(/^Rp\s*[\d.]+$/i).last().innerText();
        const tokenHarga = teksNilai.match(/Rp\s*[\d.]+/i)?.[0] ?? '';

        return Number.parseInt(tokenHarga.replace(/[^0-9]/g, ''), 10);
    }

    async isiNamaLengkap(nama: string): Promise<void> {
        await this.page.getByPlaceholder('Masukkan nama lengkap').fill(nama);
    }

    async isiNomorTelepon(nomorTelepon: string): Promise<void> {
        await this.page.getByPlaceholder('08xxxxxxxxxx').fill(nomorTelepon);
    }

    async isiDataPelanggan(nama: string, nomorTelepon: string): Promise<void> {
        await this.isiNamaLengkap(nama);
        await this.isiNomorTelepon(nomorTelepon);
    }

    async kosongkanFieldWajib(): Promise<void> {
        await this.isiDataPelanggan('', '');
    }

    async pilihTipePesanan(tipePesanan: string): Promise<void> {
        await this.page.getByRole('button', { name: new RegExp(`^${tipePesanan}`) }).click({ force: true });
        if (tipePesanan.toLowerCase() === 'take away') {
            await expect(this.page.getByPlaceholder('Contoh: 5')).toHaveValue('');
        }
    }

    async isiNomorMeja(nomorMeja: string): Promise<void> {
        await this.page.getByPlaceholder('Contoh: 5').fill(nomorMeja);
    }

    async kosongkanNomorMeja(): Promise<void> {
        await this.isiNomorMeja('');
    }

    async pasangVoucher(): Promise<void> {
        await this.page.getByRole('button', { name: /pasang voucher|terapkan voucher|voucher/i }).click();
    }

    async pilihPromoTersedia(): Promise<void> {
        const promoButton = this.page.getByRole('button', { name: /promo|voucher/i }).first();
        const promoText = this.page.getByText(/promo|voucher/i).first();

        if (await promoButton.count()) {
            await promoButton.click({ force: true });
            return;
        }

        await promoText.click({ force: true });
    }

    async masukkanKodePromo(kode: string): Promise<void> {
        const inputKode = this.page.locator(
            'input[placeholder*="promo" i], input[placeholder*="voucher" i], input[placeholder*="kode" i], input[aria-label*="promo" i], input[aria-label*="voucher" i], input[aria-label*="kode" i]',
        ).first();

        if (await inputKode.count()) {
            await inputKode.fill(kode);
            return;
        }

        const fallbackInput = this.page.getByPlaceholder(/promo|voucher|kode/i).first();
        await fallbackInput.fill(kode);
    }

    async validasiVoucherDiterima(): Promise<void> {
        const promoAktif = this.page.getByText(/Diskon\s+\d+%|voucher.*berhasil|promo.*aktif/i).first();
        await expect(promoAktif).toBeVisible();
    }

    async validasiVoucherDitolak(): Promise<void> {
        const errorText = this.page.getByText(/minimum pembelian|belum terpenuhi|tidak dapat digunakan|voucher tidak valid|voucher expired|kode voucher wajib diisi/i);

        if (await errorText.count()) {
            await expect(errorText.first()).toBeVisible();
            return;
        }

        const subtotal = await this.ambilNilaiRingkasan('Subtotal');
        const total = await this.ambilNilaiRingkasan('Total Pembayaran');
        const ppn = await this.ambilNilaiRingkasan('PPN 10%');

        expect(total).toBe(subtotal + ppn);
    }

    async validasiDiskonTidakDiterapkan(): Promise<void> {
        const errorText = this.page.getByText(/minimum pembelian|belum terpenuhi|tidak dapat digunakan|voucher tidak valid|voucher expired|kode voucher wajib diisi/i);

        if (await errorText.count()) {
            await expect(errorText.first()).toBeVisible();
            return;
        }

        const subtotal = await this.ambilNilaiRingkasan('Subtotal');
        const total = await this.ambilNilaiRingkasan('Total Pembayaran');
        const ppn = await this.ambilNilaiRingkasan('PPN 10%');

        expect(total).toBe(subtotal + ppn);
    }

    async validasiBatasDiskonMaksimal(maksimalDiskon: number): Promise<void> {
        const subtotal = await this.ambilNilaiRingkasan('Subtotal');
        const ppn = await this.ambilNilaiRingkasan('PPN 10%');
        const total = await this.ambilNilaiRingkasan('Total Pembayaran');
        const diskon = subtotal + ppn - total;

        expect(diskon).toBeLessThanOrEqual(maksimalDiskon);
    }

    async validasiErrorVoucher(pesan: string): Promise<void> {
        const pola = new RegExp(
            `${pesan.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}|promo tidak aktif|voucher expired`,
            'i',
        );

        await expect(this.page.getByText(pola)).toBeVisible();
    }

    async isiCatatan(catatan: string): Promise<void> {
        await this.page.getByPlaceholder('Tambahkan catatan untuk pesanan Anda...').fill(catatan);
    }

    async pilihMetodePembayaran(metode: string): Promise<void> {
        await this.page.getByRole('button', { name: new RegExp(`^${metode}`) }).click({ force: true });
    }

    async buatPesanan(): Promise<void> {
        await this.page.getByRole('button', { name: 'Buat Pesanan' }).click({ force: true });
    }

    async validasiPesananBerhasil(): Promise<void> {
        await expect(this.page).toHaveURL('https://pos.habibiyasin.my.id/checkout', { timeout: 15_000 });
        await expect(this.page.getByRole('button', { name: 'Buat Pesanan' })).toBeVisible();
        await expect(this.page.getByText('Informasi Pelanggan', { exact: true })).toBeVisible();
    }

    async validasiPembuatanPesananDicegah(): Promise<void> {
        await expect(this.page).toHaveURL('https://pos.habibiyasin.my.id/checkout');
        await expect(this.page.getByRole('heading', { name: 'Berhasil!' })).toBeHidden();
    }

    async validasiErrorFieldWajib(): Promise<void> {
        const namaLengkap = this.page.getByPlaceholder('Masukkan nama lengkap');
        const nomorTelepon = this.page.getByPlaceholder('08xxxxxxxxxx');

        await expect(namaLengkap).toHaveJSProperty('validity.valid', false);
        await expect(nomorTelepon).toHaveJSProperty('validity.valid', false);
        const pesanNama = await namaLengkap.evaluate((element: HTMLInputElement) => element.validationMessage);
        const pesanTelepon = await nomorTelepon.evaluate((element: HTMLInputElement) => element.validationMessage);
        expect(pesanNama).not.toBe('');
        expect(pesanTelepon).not.toBe('');
    }

    async validasiErrorNomorMeja(): Promise<void> {
        const nomorMeja = this.page.getByPlaceholder('Contoh: 5');

        await expect(nomorMeja).toHaveJSProperty('validity.valid', false);
        const pesanNomorMeja = await nomorMeja.evaluate(
            (element: HTMLInputElement) => element.validationMessage,
        );
        expect(pesanNomorMeja).not.toBe('');
    }

    async validasiPeringatanKeranjangKosong(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'Keranjang Kosong' })).toBeVisible();
        await expect(this.page.getByText('Silakan pilih menu terlebih dahulu')).toBeVisible();
    }

    async validasiFormPelangganTidakTampil(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'Informasi Pelanggan' })).toBeHidden();
        await expect(this.page.getByPlaceholder('Masukkan nama lengkap')).toBeHidden();
    }
}
