import { Given, Then, When } from '@cucumber/cucumber';
import { PageManager } from '../../page-objects/pages/pageManager';

Given('pengguna berada di halaman login', async function () {
    this.pm = new PageManager(this.page);
    await this.pm.onLoginPage().buka();
});

When('pengguna login dengan email {string} dan password {string}', async function (email: string, password: string) {
    await this.pm.onLoginPage().login(email, password);
});

Then('pengguna diarahkan ke dashboard {string}', async function (url: string) {
    await this.pm.onLoginPage().validasiPengalihan(url);
});

Then('sistem menolak login dan menampilkan pesan kredensial salah', async function () {
    await this.pm.onLoginPage().validasiLoginDitolak();
});

Given('pelanggan memiliki keranjang yang kosong', async function () {
    this.pm = new PageManager(this.page);
    await this.pm.onMenuPage().pastikanKeranjangKosong();
});

When('pelanggan mengakses URL {string} secara langsung', async function (url: string) {
    await this.page.goto(url);
});

Then('sistem menampilkan halaman peringatan yang menyuruh pelanggan mengisi keranjang terlebih dahulu', async function () {
    await this.pm.onCheckoutPage().validasiPeringatanKeranjangKosong();
});

Then('pelanggan tidak bisa melihat form informasi pelanggan', async function () {
    await this.pm.onCheckoutPage().validasiFormPelangganTidakTampil();
});

Given('pelanggan berada di halaman {string}', async function (url: string) {
    this.pm = new PageManager(this.page);
    await this.pm.onMenuPage().buka();
    await this.page.goto(url);
});

When('pelanggan mencari item menggunakan fitur search', async function () {
    await this.pm.onMenuPage().cariItem('Ice Cappucino');
});

When('pelanggan memilih filter kategori {string}', async function (kategori: string) {
    await this.pm.onMenuPage().pilihKategori(kategori);
});

When('pelanggan klik tombol "+ Tambah" pada item {string}', async function (namaItem: string) {
    await this.pm.onMenuPage().tambahItem(namaItem);
});

When('pelanggan membuka keranjang', async function () {
    await this.pm.onMenuPage().bukaKeranjang();
});

When('pelanggan klik tombol "Checkout"', async function () {
    await this.pm.onMenuPage().checkout();
});

Then('pelanggan diarahkan ke halaman {string}', async function (url: string) {
    await this.pm.onCheckoutPage().validasiHalamanCheckout();
});

When('pelanggan mengisi "Nama Lengkap" dengan {string}', async function (nama: string) {
    await this.pm.onCheckoutPage().isiNamaLengkap(nama);
});

When('pelanggan mengisi "Nomor Telepon" dengan {string}', async function (nomorTelepon: string) {
    await this.pm.onCheckoutPage().isiNomorTelepon(nomorTelepon);
});

When('pelanggan memilih tipe pesanan {string}', async function (tipePesanan: string) {
    await this.pm.onCheckoutPage().pilihTipePesanan(tipePesanan);
});

When('pelanggan mengisi "Nomor Meja" dengan {string}', async function (nomorMeja: string) {
    await this.pm.onCheckoutPage().isiNomorMeja(nomorMeja);
});

When('pelanggan menambahkan teks pada {string}', async function (_field: string) {
    await this.pm.onCheckoutPage().isiCatatan('Catatan pesanan pelanggan');
});

When('pelanggan memastikan metode pembayaran {string} terpilih', async function (metode: string) {
    await this.pm.onCheckoutPage().pilihMetodePembayaran(metode);
});

When('pelanggan klik tombol "Buat Pesanan"', async function () {
    await this.pm.onCheckoutPage().buatPesanan();
});

Then('sistem berhasil memproses pesanan', async function () {
    await this.pm.onCheckoutPage().validasiPesananBerhasil();
});

Given('pelanggan berada di halaman checkout dengan item di dalam keranjang', async function () {
    this.pm = new PageManager(this.page);
    await this.pm.onMenuPage().siapkanCheckoutDenganItem('Ice Cappucino');
    await this.pm.onCheckoutPage().validasiHalamanCheckout();
});

When('pelanggan mengisi "Nama Lengkap" dan "Nomor Telepon" dengan data valid', async function () {
    await this.pm.onCheckoutPage().isiDataPelanggan('Habibi Yasin', '081234567890');
});

Then('sistem berhasil memproses pesanan tanpa memerlukan data Nomor Meja', async function () {
    await this.pm.onCheckoutPage().validasiPesananBerhasil();
});

When('pelanggan mengosongkan field "Nama Lengkap" dan "Nomor Telepon"', async function () {
    await this.pm.onCheckoutPage().kosongkanFieldWajib();
});

Then('sistem mencegah pembuatan pesanan', async function () {
    await this.pm.onCheckoutPage().validasiPembuatanPesananDicegah();
});

Then('sistem menampilkan pesan error validasi pada field yang kosong', async function () {
    await this.pm.onCheckoutPage().validasiErrorFieldWajib();
});

When('pelanggan mengosongkan field "Nomor Meja"', async function () {
    await this.pm.onCheckoutPage().kosongkanNomorMeja();
});

Then('sistem menampilkan pesan error validasi pada field Nomor Meja', async function () {
    await this.pm.onCheckoutPage().validasiErrorNomorMeja();
});

Given('pelanggan memiliki item {string} dengan kuantitas 1 di dalam keranjang', async function (namaItem: string) {
    this.pm = new PageManager(this.page);
    await this.pm.onMenuPage().siapkanKeranjangDenganItem(namaItem);
});

When('pelanggan klik tombol "-" pada item {string}', async function (namaItem: string) {
    await this.pm.onMenuPage().kurangiKuantitasItem(namaItem);
});

Then('item {string} terhapus dari keranjang', async function (namaItem: string) {
    await this.pm.onMenuPage().validasiKeranjangKosong();
});

Then('sistem menampilkan pesan "Keranjang kosong" di dalam popup keranjang', async function () {
    await this.pm.onMenuPage().validasiKeranjangKosong();
});

When('pelanggan menambahkan satu item secara acak ke keranjang', async function () {
    const hasil = await this.pm.onMenuPage().tambahItemAcak();
    this.randomItemName = hasil.namaItem;
    this.hargaSatuan = hasil.hargaSatuan;
});

When('pelanggan mengubah jumlah kuantitas item secara acak', async function () {
    const hasil = await this.pm.onMenuPage().ubahJumlahKuantitasAcak(this.randomItemName);
    this.hargaSatuan = hasil.hargaSatuan;
    this.kuantitasAkhir = hasil.kuantitasAkhir;
});

Then('total harga di keranjang harus sesuai dengan harga satuan dikali kuantitas', async function () {
    await this.pm.onMenuPage().validasiTotalHarga(this.hargaSatuan, this.kuantitasAkhir);
});

Given('pelanggan berada di halaman menu', async function () {
    this.pm = new PageManager(this.page);
    await this.pm.onMenuPage().buka();
});

When('pelanggan menambahkan {int} item berbeda secara acak ke keranjang', async function (jumlahItem: number) {
    const itemTerpilih = await this.pm.onMenuPage().tambahBeberapaItemAcak(jumlahItem);
    this.multiItems = itemTerpilih.map((item) => ({ ...item, kuantitas: 1 }));
});

When('pelanggan mengubah kuantitas setiap item secara acak', async function () {
    this.multiItems = await this.pm.onMenuPage().ubahKuantitasBeberapaItemAcak(this.multiItems);
});

Then('Grand Total di keranjang harus sesuai dengan penjumlahan harga item dikali kuantitas', async function () {
    await this.pm.onMenuPage().validasiGrandTotal(this.multiItems);
});

Then('subtotal, PPN 10 persen, dan total pembayaran harus sesuai perhitungan', async function () {
    const subtotalSeharusnya = this.multiItems.reduce(
        (total, item) => total + item.hargaSatuan * item.kuantitas,
        0,
    );
    await this.pm.onCheckoutPage().validasiRingkasanPembayaran(subtotalSeharusnya);
});
