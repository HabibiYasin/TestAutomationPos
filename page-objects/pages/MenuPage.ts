import { expect, Page } from '@playwright/test';

export class MenuPage {
    constructor(private readonly page: Page) {}

    async buka(): Promise<void> {
        await this.page.goto('https://pos.habibiyasin.my.id/menu');
    }

    async cariItem(namaItem: string): Promise<void> {
        await this.page.getByPlaceholder('Cari menu...').fill(namaItem);
    }

    async pilihKategori(namaKategori: string): Promise<void> {
        await this.page.getByRole('combobox').selectOption({ label: namaKategori });
    }

    async tambahItem(namaItem: string): Promise<void> {
        const kartuItem = this.page.getByRole('heading', { name: namaItem }).locator('..');
        await kartuItem.getByRole('button', { name: 'Tambah' }).click({ force: true });
    }

    async bukaKeranjang(): Promise<void> {
        await this.page.getByRole('button', { name: /^Keranjang/ }).click({ force: true });
    }

    async checkout(): Promise<void> {
        await this.page.getByRole('button', { name: 'Checkout', exact: true }).click({ force: true });
    }

    async siapkanCheckoutDenganItem(namaItem: string): Promise<void> {
        await this.pastikanKeranjangKosong();
        await this.cariItem(namaItem);
        await this.tambahItem(namaItem);
        await this.bukaKeranjang();
        await this.checkout();
    }

    async siapkanKeranjangDenganItem(namaItem: string): Promise<void> {
        await this.pastikanKeranjangKosong();
        await this.cariItem(namaItem);
        await this.tambahItem(namaItem);
    }

    async kurangiKuantitasItem(namaItem: string): Promise<void> {
        const barisItem = this.page.getByRole('heading', { name: namaItem }).last().locator('../..');
        await barisItem.getByRole('button').first().click({ force: true });
    }

    async validasiKeranjangKosong(): Promise<void> {
        await expect(this.page.getByText('Keranjang kosong', { exact: true })).toBeVisible();
    }

    async tambahItemAcak(): Promise<{ namaItem: string; hargaSatuan: number }> {
        const tombolTambah = this.page.getByRole('button', { name: 'Tambah' });
        const jumlahItem = await tombolTambah.count();
        const indeksAcak = Math.floor(Math.random() * jumlahItem);
        const kartuItem = tombolTambah.nth(indeksAcak).locator('../..');
        const teksKartu = await kartuItem.innerText();
        const namaItem = (await kartuItem.getByRole('heading').innerText()).trim();
        const hargaSatuan = this.parseHarga(teksKartu);

        await tombolTambah.nth(indeksAcak).click({ force: true });
        return { namaItem, hargaSatuan };
    }

    async tambahBeberapaItemAcak(jumlahItem: number): Promise<Array<{ namaItem: string; hargaSatuan: number }>> {
        const tombolTambah = this.page.getByRole('button', { name: 'Tambah' });
        await tombolTambah.first().waitFor({ state: 'visible' });
        const jumlahItemTersedia = await tombolTambah.count();
        if (jumlahItem < 2 || jumlahItem > jumlahItemTersedia) {
            throw new Error(`Jumlah item ${jumlahItem} tidak tersedia. Item tersedia: ${jumlahItemTersedia}`);
        }

        const indeksAcak = Array.from({ length: jumlahItemTersedia }, (_, indeks) => indeks)
            .sort(() => Math.random() - 0.5)
            .slice(0, jumlahItem);
        const itemTerpilih: Array<{ namaItem: string; hargaSatuan: number }> = [];

        for (const indeks of indeksAcak) {
            const tombolItem = tombolTambah.nth(indeks);
            const kartuItem = tombolItem.locator('../..');
            const teksKartu = await kartuItem.innerText();
            itemTerpilih.push({
                namaItem: (await kartuItem.getByRole('heading').innerText()).trim(),
                hargaSatuan: this.parseHarga(teksKartu),
            });
            await tombolItem.click({ force: true });
            await this.page.waitForTimeout(100);
        }

        return itemTerpilih;
    }

    async ubahJumlahKuantitasAcak(namaItem: string): Promise<{ hargaSatuan: number; kuantitasAkhir: number }> {
        const barisItem = this.page.getByRole('heading', { name: namaItem }).last().locator('../..');
        const hargaSatuan = this.parseHarga(await barisItem.innerText());
        const kuantitasAkhir = Math.floor(Math.random() * 4) + 2;
        const tombolPlus = barisItem.getByRole('button').last();

        for (let indeks = 1; indeks < kuantitasAkhir; indeks += 1) {
            await tombolPlus.click({ force: true });
            await this.page.waitForTimeout(100);
        }

        return { hargaSatuan, kuantitasAkhir };
    }

    async ubahKuantitasBeberapaItemAcak(
        items: Array<{ namaItem: string; hargaSatuan: number; kuantitas: number }>,
    ): Promise<Array<{ namaItem: string; hargaSatuan: number; kuantitas: number }>> {
        const kuantitasAcak = [2, 3, 4, 5].sort(() => Math.random() - 0.5).slice(0, items.length);

        for (let indeksItem = 0; indeksItem < items.length; indeksItem += 1) {
            const item = items[indeksItem];
            const kuantitas = kuantitasAcak[indeksItem];
            const barisItem = this.page.getByRole('heading', { name: item.namaItem }).last().locator('../..');
            const tombolPlus = barisItem.getByRole('button').last();

            for (let indeks = 1; indeks < kuantitas; indeks += 1) {
                await tombolPlus.click({ force: true });
                await this.page.waitForTimeout(100);
            }
            item.kuantitas = kuantitas;
        }

        return items;
    }

    async validasiGrandTotal(items: Array<{ hargaSatuan: number; kuantitas: number }>): Promise<void> {
        const totalSeharusnya = items.reduce(
            (total, item) => total + item.hargaSatuan * item.kuantitas,
            0,
        );
        const popupKeranjang = this.page.getByRole('heading', { name: 'Keranjang' }).locator('../..');
        const teksTotal = await popupKeranjang.getByText(/^Rp [\d.]+$/).last().innerText();
        const grandTotalDiUI = this.parseHarga(teksTotal);

        expect(grandTotalDiUI).toBe(totalSeharusnya);
    }

    async validasiTotalHarga(hargaSatuan: number, kuantitasAkhir: number): Promise<void> {
        const popupKeranjang = this.page.getByRole('heading', { name: 'Keranjang' }).locator('../..');
        const teksTotal = await popupKeranjang.getByText(/^Rp [\d.]+$/).last().innerText();
        const totalDiUI = this.parseHarga(teksTotal);

        expect(totalDiUI).toBe(hargaSatuan * kuantitasAkhir);
    }

    private parseHarga(teksHarga: string): number {
        const tokenHarga = teksHarga.match(/Rp\s*[\d.]+/i)?.[0] ?? '';
        return Number.parseInt(tokenHarga.replace(/[^0-9]/g, ''), 10);
    }

    async pastikanKeranjangKosong(): Promise<void> {
        await this.page.goto(process.env.POS_MENU_URL ?? 'https://pos.habibiyasin.my.id/menu');
        await this.page.evaluate(() => window.localStorage.clear());
        await this.page.reload();
    }
}
