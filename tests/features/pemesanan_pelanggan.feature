Feature: Alur Pemesanan Pelanggan

  @negatif
  Scenario: Akses checkout dengan keranjang kosong
    Given pelanggan memiliki keranjang yang kosong
    When pelanggan mengakses URL "https://pos.habibiyasin.my.id/checkout" secara langsung
    Then sistem menampilkan halaman peringatan yang menyuruh pelanggan mengisi keranjang terlebih dahulu
    And pelanggan tidak bisa melihat form informasi pelanggan

  Scenario: End-to-End Pemesanan Berhasil (Makan di Tempat - Tunai)
    Given pelanggan berada di halaman "https://pos.habibiyasin.my.id/menu"
    When pelanggan mencari item menggunakan fitur search
    And pelanggan memilih filter kategori "Minuman"
    And pelanggan klik tombol "+ Tambah" pada item "Ice Cappucino"
    And pelanggan membuka keranjang
    And pelanggan klik tombol "Checkout"
    Then pelanggan diarahkan ke halaman "https://pos.habibiyasin.my.id/checkout"
    When pelanggan mengisi "Nama Lengkap" dengan "Habibi Yasin"
    And pelanggan mengisi "Nomor Telepon" dengan "081234567890"
    And pelanggan memilih tipe pesanan "Makan di tempat"
    And pelanggan mengisi "Nomor Meja" dengan "5"
    And pelanggan menambahkan teks pada "Catatan (Opsional)"
    And pelanggan memastikan metode pembayaran "Tunai" terpilih
    And pelanggan klik tombol "Buat Pesanan"
    Then sistem berhasil memproses pesanan

  @voucher
  Scenario: Validasi voucher valid untuk pesanan di atas minimum pembelian
    Given pelanggan berada di halaman "https://pos.habibiyasin.my.id/menu"
    When pelanggan menambahkan item hingga total pembelian lebih dari Rp 100000
    And pelanggan membuka keranjang
    And pelanggan klik tombol "Checkout"
    Then pelanggan diarahkan ke halaman "https://pos.habibiyasin.my.id/checkout"
    When pelanggan mengisi "Nama Lengkap" dengan "Habibi Yasin"
    And pelanggan mengisi "Nomor Telepon" dengan "081234567890"
    And pelanggan memilih tipe pesanan "Makan di tempat"
    And pelanggan mengisi "Nomor Meja" dengan "5"
    And pelanggan memasukkan voucher yang valid
    Then sistem menerima voucher dan menerapkan diskon
    When pelanggan memastikan metode pembayaran "Tunai" terpilih
    And pelanggan klik tombol "Buat Pesanan"
    Then sistem berhasil memproses pesanan

  @vouchernegative
  Scenario: Validasi voucher tidak dapat digunakan di bawah minimum pembelian dengan klik promo yang tersedia
    Given pelanggan berada di halaman "https://pos.habibiyasin.my.id/menu"
    When pelanggan menambahkan item hingga total pembelian kurang dari Rp 100000
    And pelanggan membuka keranjang
    And pelanggan klik tombol "Checkout"
    Then pelanggan diarahkan ke halaman "https://pos.habibiyasin.my.id/checkout"
    When pelanggan memilih promo yang tersedia
    Then sistem menolak voucher karena minimum pembelian belum terpenuhi
    And diskon voucher tidak diterapkan

  @voucher
  Scenario: Validasi voucher tidak dapat digunakan di bawah minimum pembelian dengan kode promo manual
    Given pelanggan berada di halaman "https://pos.habibiyasin.my.id/menu"
    When pelanggan menambahkan item hingga total pembelian kurang dari Rp 100000
    And pelanggan membuka keranjang
    And pelanggan klik tombol "Checkout"
    Then pelanggan diarahkan ke halaman "https://pos.habibiyasin.my.id/checkout"
    When pelanggan memasukkan kode promo manual yang valid
    Then sistem menolak voucher karena minimum pembelian belum terpenuhi
    And diskon voucher tidak diterapkan

  @voucher @test
  Scenario: Validasi voucher wajib diisi
    Given pelanggan berada di halaman checkout dengan item di dalam keranjang
    When pelanggan memasang voucher tanpa kode
    Then sistem menampilkan pesan error voucher "Kode voucher wajib diisi"

  @voucher
  Scenario: Validasi voucher expired
    Given pelanggan berada di halaman checkout dengan item di dalam keranjang
    When pelanggan memasang voucher dengan kode "expired"
    Then sistem menampilkan pesan error "voucher expired"

  @voucher
  Scenario: Validasi voucher yang telah habis penggunaannya
    Given pelanggan berada di halaman checkout dengan item di dalam keranjang
    When pelanggan memasang voucher dengan kode "VOUCHERHABIS"
    Then sistem menampilkan pesan error "voucher expired"

  @vouchermax
  Scenario: Validasi batas maksimum diskon voucher
    Given pelanggan berada di halaman "https://pos.habibiyasin.my.id/menu"
    When pelanggan mencari item "Gold Coffee" menggunakan fitur search
    And pelanggan klik tombol "+ Tambah" pada item "Gold Coffee"
    And pelanggan membuka keranjang
    And pelanggan klik tombol "Checkout"
    Then pelanggan diarahkan ke halaman "https://pos.habibiyasin.my.id/checkout"
    When pelanggan memasukkan voucher yang valid
    Then sistem menerima voucher dan menerapkan diskon
    And diskon voucher yang diterapkan tidak lebih dari Rp 300000
    When pelanggan mengisi "Nama Lengkap" dengan "Habibi Yasin"
    And pelanggan mengisi "Nomor Telepon" dengan "081234567890"
    And pelanggan memilih tipe pesanan "Makan di tempat"
    And pelanggan mengisi "Nomor Meja" dengan "5"
    And pelanggan memastikan metode pembayaran "Tunai" terpilih
    And pelanggan klik tombol "Buat Pesanan"
    Then sistem berhasil memproses pesanan

  Scenario: End-to-End Pemesanan Berhasil (Take Away - Tunai)
    Given pelanggan berada di halaman checkout dengan item di dalam keranjang
    When pelanggan mengisi "Nama Lengkap" dan "Nomor Telepon" dengan data valid
    And pelanggan memilih tipe pesanan "Take away"
    And pelanggan klik tombol "Buat Pesanan"
    Then sistem berhasil memproses pesanan tanpa memerlukan data Nomor Meja

  @negatif
  Scenario: Mengosongkan field wajib saat checkout
    Given pelanggan berada di halaman checkout dengan item di dalam keranjang
    When pelanggan mengosongkan field "Nama Lengkap" dan "Nomor Telepon"
    And pelanggan klik tombol "Buat Pesanan"
    Then sistem mencegah pembuatan pesanan
    And sistem menampilkan pesan error validasi pada field yang kosong

  @negatif
  Scenario: Tidak mengisi nomor meja untuk Dine-In
    Given pelanggan berada di halaman checkout dengan item di dalam keranjang
    When pelanggan mengisi "Nama Lengkap" dan "Nomor Telepon" dengan data valid
    And pelanggan memilih tipe pesanan "Makan di tempat"
    And pelanggan mengosongkan field "Nomor Meja"
    And pelanggan klik tombol "Buat Pesanan"
    Then sistem mencegah pembuatan pesanan
    And sistem menampilkan pesan error validasi pada field Nomor Meja

  @negatif
  Scenario: Mengurangi kuantitas item menjadi nol melalui keranjang
    Given pelanggan memiliki item "Lemon Tea" dengan kuantitas 1 di dalam keranjang
    When pelanggan membuka keranjang
    And pelanggan klik tombol "-" pada item "Lemon Tea"
    Then item "Lemon Tea" terhapus dari keranjang
    And sistem menampilkan pesan "Keranjang kosong" di dalam popup keranjang

  @keranjang
  Scenario Outline: Perhitungan total harga dengan kuantitas item acak - Percobaan <percobaan>
    Given pelanggan berada di halaman "https://pos.habibiyasin.my.id/menu"
    When pelanggan menambahkan satu item secara acak ke keranjang
    And pelanggan membuka keranjang
    And pelanggan mengubah jumlah kuantitas item secara acak
    Then total harga di keranjang harus sesuai dengan harga satuan dikali kuantitas

    Examples:
      | percobaan |
      | 1         |
      | 2         |
      | 3         |

  @multi-item
  Scenario Outline: Perhitungan Grand Total untuk beberapa item acak - Percobaan <percobaan>
    Given pelanggan berada di halaman menu
    When pelanggan menambahkan <jumlah_item> item berbeda secara acak ke keranjang
    And pelanggan membuka keranjang
    And pelanggan mengubah kuantitas setiap item secara acak
    Then Grand Total di keranjang harus sesuai dengan penjumlahan harga item dikali kuantitas

    Examples:
      | percobaan | jumlah_item |
      | 1         | 2           |
      | 2         | 3           |
      | 3         | 2           |

  @multi-item2
  Scenario Outline: Validasi ringkasan pembayaran multi-item di checkout - Percobaan <percobaan>
    Given pelanggan berada di halaman menu
    When pelanggan menambahkan <jumlah_item> item berbeda secara acak ke keranjang
    And pelanggan membuka keranjang
    And pelanggan mengubah kuantitas setiap item secara acak
    And pelanggan klik tombol "Checkout"
    Then pelanggan diarahkan ke halaman "https://pos.habibiyasin.my.id/checkout"
    And subtotal, PPN 10 persen, dan total pembayaran harus sesuai perhitungan

    Examples:
      | percobaan | jumlah_item |
      | 1         | 2           |
      | 2         | 3           |
      | 3         | 2           |
