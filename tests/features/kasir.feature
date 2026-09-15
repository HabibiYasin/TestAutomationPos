Feature: Proses Kasir

Scenario: Proses makanan pembayaran tunai oleh kasir ke koki
	Given pelanggan telah memesan pesanan yang valid
	When kasir membuka halaman login "https://pos.habibiyasin.my.id/login"
	And kasir login menggunakan email "kasir1@gmail.com" dan password "kasir1123"
	And kasir klik pesanan baru
	And kasir klik tombol "Konfirmasi Pembayaran Tunai"
	And kasir klik tombol "Ya, Sudah Dibayar Tunai"
	And kasir klik tombol "Kirim ke Dapur"
	Then pesanan hilang dari dashboard kasir
    