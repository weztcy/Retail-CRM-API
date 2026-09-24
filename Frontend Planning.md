# Rencana Website Retail CRM System

**Retail CRM System akan menjadi aplikasi operasional dan hubungan pelanggan untuk toko offline**, menggunakan **Next.js App Router dan Tailwind CSS**. API yang ada menjadi kontrak tetap: halaman, formulir, hak akses, dan alur kerja front-end mengikuti API tanpa meminta perubahan backend.

Ada dua area aplikasi:

- **Area USER:** dipakai pengelola dan staf untuk mengelola pelanggan, mencatat penjualan di toko, melakukan tindak lanjut, serta melihat laporan.
- **Area CUSTOMER:** dipakai pelanggan untuk melihat informasi akun, riwayat belanja, loyalitas, dan keanggotaan.

Pelanggan melakukan pembelian di toko. Pencatatan transaksinya dilakukan oleh staf.

## 1. Batas fungsi aplikasi

### Fungsi yang dibuat

1. Autentikasi pengguna internal dan pelanggan.
2. Pengelolaan pelanggan.
3. Pengelolaan produk.
4. Pencatatan transaksi penjualan toko.
5. Aktivitas dan tindak lanjut pelanggan.
6. Informasi loyalitas dan keanggotaan.
7. Segmentasi pelanggan.
8. Dasbor, laporan, persediaan, dan kinerja tim.
9. Pengelolaan pengguna internal.
10. Log audit.
11. Portal pelanggan.
12. Pengelolaan profil dan unggah gambar.

### Fungsi yang tidak dimasukkan

Karena API sudah final, rencana tidak mencakup:

- Keranjang dan pemesanan oleh pelanggan.
- Pembayaran daring, pembuatan QRIS, atau verifikasi transfer otomatis.
- Pengiriman barang dan pelacakan kurir.
- Pengiriman WhatsApp/email otomatis.
- Penukaran poin, kupon, dan diskon baru.
- Pengembalian dana otomatis.
- Pengadaan barang dari pemasok.
- Sinkronisasi transaksi tanpa internet.
- Pengaturan aturan loyalitas atau keanggotaan baru.

Metode `QRIS`, `TRANSFER`, atau `CARD` pada transaksi menjadi **pencatatan cara pembayaran yang berlangsung di toko**. Begitu juga aktivitas `WHATSAPP` dan `EMAIL` menjadi catatan komunikasi.

**Toko offline tetap menggunakan aplikasi yang terhubung ke server.** Tidak ada antrean penjualan tanpa koneksi yang ditambahkan.

## 2. Jenis pengguna dan pembagian tugas

### A. USER — pengguna internal

`USER` adalah jenis akun. Di dalamnya terdapat peran:

| Peran | Fokus penggunaan website |
|---|---|
| `SUPER_ADMIN` | Pengelolaan menyeluruh, termasuk akun staf |
| `ADMIN` | Administrasi toko, pelanggan, produk, transaksi, dan audit |
| `MANAGER` | Pemantauan operasional, laporan, serta pengelolaan sesuai izin |
| `SALES` | Mencari pelanggan dan produk, mencatat penjualan |
| `CUSTOMER_SERVICE` | Melihat pelanggan dan riwayat transaksi untuk pelayanan |

Tombol dan menu mengikuti izin endpoint, bukan sekadar nama peran.

Contoh penting dari API:

- `SALES` boleh membuat transaksi.
- `CUSTOMER_SERVICE` boleh melihat daftar transaksi, tetapi tidak membuatnya.
- Perubahan status transaksi hanya untuk `SUPER_ADMIN`, `ADMIN`, dan `MANAGER`.
- Daftar serta pembuatan pengguna internal dibatasi untuk `SUPER_ADMIN`.
- Log audit dibatasi untuk `SUPER_ADMIN` dan `ADMIN`.

Untuk tindakan yang belum memiliki pembatasan peran eksplisit di handler, pembatasan menu menjadi kebijakan antarmuka. Pembatasan tersebut tidak dianggap menggantikan keamanan API.

### B. CUSTOMER — pelanggan

Pelanggan dapat:

- Registrasi dan login.
- Melihat akun serta profil sendiri.
- Melihat riwayat belanja.
- Melihat informasi loyalitas.
- Melihat keanggotaan.
- Melihat analisis pembelian dan rekomendasi.
- Mengakses bagian aktivitas pelanggan sesuai data rutenya.

Portal pelanggan tidak menampilkan tombol tambah produk, buat transaksi, atau pengelolaan pelanggan lain.

## 3. Struktur halaman website

Agar kedua area jelas, gunakan awalan **`/staff`** dan **`/customer`**. Ini adalah URL halaman front-end; alamat API tetap `/api/...`.

### A. Halaman akses

| URL halaman | Isi dan tujuan |
|---|---|
| `/` | Pengarah ke area sesuai sesi; jika belum login, menampilkan pilihan akses staf atau pelanggan |
| `/staff/login` | Login staf |
| `/customer/login` | Login pelanggan |
| `/customer/register` | Registrasi pelanggan |
| `/forbidden` | Informasi akses ditolak |

Setelah login:

- `SUPER_ADMIN`, `ADMIN`, `MANAGER` → `/staff/dashboard`.
- `SALES` → `/staff/transactions`.
- `CUSTOMER_SERVICE` → `/staff/customers`.
- `CUSTOMER` → `/customer/dashboard`.

### B. Halaman operasional staf

| URL halaman | Konten utama |
|---|---|
| `/staff/customers` | Daftar, pencarian, filter, dan status pelanggan |
| `/staff/customers/new` | Tambah pelanggan |
| `/staff/customers/[id]` | Profil, transaksi, aktivitas, dan loyalitas pelanggan |
| `/staff/customers/[id]/edit` | Edit pelanggan |
| `/staff/customers/segments` | Segmentasi dan ringkasannya |
| `/staff/customers/membership` | Pelanggan berdasarkan keanggotaan |
| `/staff/products` | Daftar produk, kategori, stok, dan status |
| `/staff/products/new` | Tambah produk |
| `/staff/products/[id]` | Detail produk |
| `/staff/products/[id]/edit` | Edit produk |
| `/staff/transactions` | Daftar transaksi |
| `/staff/transactions/new` | Pencatatan penjualan toko |
| `/staff/transactions/[id]` | Detail transaksi dan tindakan status |
| `/staff/users` | Daftar pengguna internal |
| `/staff/users/new` | Tambah pengguna |
| `/staff/users/[id]` | Detail pengguna |
| `/staff/users/[id]/edit` | Edit pengguna |
| `/staff/audit-logs` | Daftar log audit |
| `/staff/profile` | Profil staf yang sedang login |

Aktivitas pelanggan dikelola dari detail pelanggan. Dengan demikian, tidak perlu menciptakan halaman daftar aktivitas global beserta kebutuhan API baru.

### C. Halaman analitik staf

| URL halaman | Konten utama |
|---|---|
| `/staff/dashboard` | Ringkasan operasional |
| `/staff/dashboard/sales` | Analitik penjualan |
| `/staff/dashboard/customers` | Analitik pelanggan |
| `/staff/dashboard/products` | Analitik produk |
| `/staff/dashboard/inventory` | Informasi persediaan |
| `/staff/dashboard/loyalty` | Analitik loyalitas |
| `/staff/dashboard/team-performance` | Kinerja tim |
| `/staff/dashboard/audit` | Ringkasan audit |
| `/staff/reports` | Laporan dari API |

Setiap halaman menampilkan metrik yang memang dikembalikan API. Jangan memasang filter periode pada grafik jika data endpoint tidak menyediakan dukungan atau rincian yang memungkinkan penyaringan tersebut.

### D. Portal pelanggan

| URL halaman | Konten utama |
|---|---|
| `/customer/dashboard` | Ringkasan akun dan belanja |
| `/customer/transactions` | Riwayat pembelian di toko |
| `/customer/loyalty` | Informasi poin dan loyalitas |
| `/customer/membership` | Keanggotaan |
| `/customer/purchase` | Analisis pembelian |
| `/customer/recommendations` | Rekomendasi dari API |
| `/customer/activities` | Aktivitas pelanggan |
| `/customer/profile` | Lihat dan edit profil |

Detail transaksi pelanggan dapat ditampilkan melalui dialog atau panel dari data riwayatnya. Portal tidak perlu menggunakan endpoint transaksi internal hanya untuk membuka detail.

Rute aktivitas pelanggan tetap masuk perencanaan sesuai permintaan. Karena file `/api/dashboard/customer/activity` dalam XML tidak mencantumkan bentuk respons, isi datanya tidak diasumsikan dan tidak diganti dengan data contoh dalam integrasi produksi.

## 4. Rancangan isi halaman utama

### A. Daftar pelanggan

Bagian halaman:

- Judul dan tombol **Tambah pelanggan**, sesuai izin.
- Pencarian.
- Filter keanggotaan, jenis kelamin, kota, dan status sesuai API.
- Tabel pelanggan.
- Paginasi.
- Tindakan lihat, edit, nonaktifkan, dan pulihkan sesuai akses.

Saat pengguna kembali dari detail, pertahankan filter dan halaman sebelumnya melalui query URL.

### B. Detail pelanggan

Bagian atas menampilkan identitas, kode pelanggan, status, dan keanggotaan.

Empat tab:

| Tab | Isi |
|---|---|
| Profil | Informasi pelanggan |
| Transaksi | Riwayat pembelian dan ringkasan |
| Aktivitas | Catatan komunikasi, keluhan, dan tindak lanjut |
| Loyalitas | Informasi poin yang dikembalikan API |

Tombol **Catat aktivitas** membuka formulir sederhana. Identitas staf diambil dari sesi bila endpoint membutuhkan `userId`, sehingga staf tidak perlu memilih dirinya sendiri.

### C. Daftar dan detail produk

Tabel menampilkan gambar, SKU, nama, kategori, harga, stok, dan status.

Formulir mengikuti skema produk. Harga, stok, dan nilai numerik dikirim sebagai angka, bukan teks berformat mata uang.

Tindakan penghapusan diberi label **Nonaktifkan produk** sesuai perilaku API.

### D. Formulir penjualan

Pada desktop, susunan dua kolom:

**Kolom kiri**
- Pemilihan pelanggan.
- Pencarian dan pemilihan produk.
- Daftar item beserta jumlah.

**Kolom kanan**
- Ringkasan belanja.
- Metode pembayaran.
- Status pembayaran sesuai kontrak.
- Catatan.
- Tombol **Simpan transaksi**.

Pada ponsel, susunan menjadi satu kolom.

Tidak ada input harga bebas, diskon, atau pajak baru karena data pembuatan transaksi tidak membutuhkan fitur tersebut.

### E. Detail transaksi

Menampilkan:

- Nomor invoice dari server.
- Pelanggan.
- Staf pencatat.
- Waktu transaksi.
- Item, jumlah, harga saat transaksi, dan subtotal.
- Total.
- Metode pembayaran.
- Status pembayaran.
- Status transaksi.
- Catatan.

**Status pembayaran dan status transaksi ditampilkan terpisah.** Transaksi berstatus `COMPLETED` tidak boleh otomatis dilabeli telah dibayar jika `paymentStatus` mengatakan sebaliknya.

### F. Portal pelanggan

Tampilan lebih sederhana daripada area staf:

- Ringkasan akun.
- Keanggotaan dan informasi loyalitas.
- Riwayat belanja.
- Akses cepat ke profil.
- Rekomendasi tanpa tombol pembelian daring.

Prioritas portal adalah nyaman dipakai lewat ponsel.

## 5. Alur kerja utama

### Alur 1 — Pelanggan datang ke toko

1. Staf mencari pelanggan berdasarkan informasi yang tersedia.
2. Jika sudah terdaftar, pilih pelanggan tersebut.
3. Jika belum terdaftar, staf dengan izin membuat data pelanggan.
4. Pelanggan yang dipilih diteruskan ke formulir transaksi.
5. Staf mencatat barang dan pembayaran.

**API transaksi membutuhkan pelanggan aktif.** Karena itu, formulir tidak menyediakan transaksi tanpa pelanggan atau membuat akun “pelanggan umum” secara otomatis.

Registrasi portal tetap menjadi jalur tersendiri. Jangan mengarahkan pelanggan yang sudah tercatat untuk mendaftar ulang menggunakan email atau telepon yang sama; login dilakukan dengan kredensial akun yang tersedia.

### Alur 2 — Pencatatan penjualan

1. Pilih pelanggan aktif.
2. Cari produk aktif.
3. Tambahkan produk ke daftar belanja.
4. Atur jumlah.
5. Catat metode dan status pembayaran.
6. Periksa ringkasan.
7. Simpan satu kali.
8. Tampilkan invoice dari respons server.
9. Muat ulang data stok dan transaksi terkait.

Penyesuaian penting dengan implementasi API:

- Produk yang sama digabung menjadi **satu baris dengan jumlah bertambah**. API membandingkan jumlah produk yang ditemukan dengan jumlah item, sehingga baris `productId` duplikat perlu dihindari.
- Harga dan total final berasal dari server.
- Stok berkurang **saat transaksi dibuat**, sehingga tombol simpan tidak disebut “Simpan draf”.
- Draf sebelum dikirim hanya menjadi state formulir.
- Jangan otomatis mengirim permintaan perubahan status setelah pembuatan transaksi.
- `SALES` cukup mencatat transaksi; tindakan status yang memerlukan izin pengelola ditangani oleh peran yang diizinkan.

### Alur 3 — Perubahan status dan pembatalan

1. Pengelola membuka detail transaksi.
2. Memilih tindakan status.
3. Aplikasi menampilkan konfirmasi.
4. Permintaan dikirim ke API.
5. Tampilan transaksi dan data terkait dimuat ulang.

Pembatalan di layanan yang ada mengembalikan stok serta memproses penyesuaian belanja dan loyalitas. Front-end hanya meminta tindakan dan menampilkan hasil server.

**Pembatalan tidak diberi label “Refund otomatis”.** Pembatalan transaksi dan pengembalian uang adalah hal yang berbeda.

Sebagai kebijakan UI, transaksi yang telah dibatalkan tidak ditawarkan untuk dibuka kembali. Ini mencegah alur bolak-balik status yang tidak diperlukan dalam operasional toko.

### Alur 4 — Pelayanan dan tindak lanjut pelanggan

1. Staf membuka detail pelanggan.
2. Melihat transaksi atau aktivitas sebelumnya.
3. Menambahkan catatan `CALL`, `WHATSAPP`, `EMAIL`, `MEETING`, `COMPLAINT`, atau `NOTE`.
4. Mengisi subjek dan deskripsi.
5. Memperbarui status aktivitas saat tindak lanjut dilakukan.

Status aktivitas menggunakan:

`PENDING`, `PROCESS`, `DONE`, `CANCELLED`.

Status transaksi menggunakan:

`PENDING`, `PROCESSING`, `COMPLETED`, `CANCELLED`.

Keduanya mempunyai komponen label dan pilihan masing-masing.

### Alur 5 — Pelanggan memeriksa akun

1. Pelanggan login.
2. Membuka ringkasan akun.
3. Melihat riwayat belanja, keanggotaan, atau loyalitas.
4. Memperbarui profil jika diperlukan.
5. Logout.

Portal menampilkan nilai dari API tanpa menghitung atau menjanjikan tambahan poin berdasarkan perubahan status transaksi.

## 6. Komponen UI

| Kelompok | Komponen | Fungsi |
|---|---|---|
| Tata letak | `StaffLayout`, `CustomerLayout`, `AuthLayout` | Kerangka tiga area |
| Navigasi | `Sidebar`, `Topbar`, `MobileNavigation`, `Breadcrumbs` | Navigasi responsif |
| Identitas | `AccountMenu`, `Avatar`, `RoleBadge` | Informasi akun |
| Hak akses | `PermissionGate` | Menyembunyikan tindakan yang tidak sesuai |
| Formulir dasar | `FormField`, `Input`, `Select`, `Textarea`, `Button` | Input konsisten |
| Gambar | `ImageUpload`, `ImagePreview` | Unggah dan pratinjau |
| Daftar | `DataTable`, `SearchInput`, `FilterBar`, `Pagination` | Pengelolaan daftar |
| Pelanggan | `CustomerForm`, `CustomerPicker`, `CustomerSummary` | Input dan pemilihan pelanggan |
| Produk | `ProductForm`, `ProductPicker`, `StockBadge` | Produk dan persediaan |
| Transaksi | `TransactionForm`, `TransactionItems`, `QuantityInput`, `PaymentFields` | Pencatatan penjualan |
| Ringkasan | `OrderSummary`, `InvoiceDetail` | Total dan detail transaksi |
| CRM | `ActivityForm`, `ActivityTimeline`, `CustomerTabs` | Aktivitas dan detail pelanggan |
| Status | `TransactionStatusBadge`, `PaymentStatusBadge`, `ActivityStatusBadge` | Status yang tidak tercampur |
| Analitik | `MetricCard`, `ChartCard`, `RankingTable` | Penyajian data analitik |
| Konfirmasi | `ConfirmDialog`, `StatusChangeDialog` | Tindakan penting |
| Umpan balik | `Skeleton`, `EmptyState`, `ErrorState`, `Toast` | Kondisi pemuatan dan hasil |

Pemilih staf global tidak dipasang pada formulir operasional jika sumber daftar pengguna hanya tersedia bagi `SUPER_ADMIN`.

## 7. Integrasi API per modul

| Modul front-end | Sumber API |
|---|---|
| Autentikasi | `/api/auth/login/user`, `/api/auth/login/customer`, `/api/auth/register/customer`, `/api/auth/refresh`, `/api/auth/logout` |
| Pelanggan | `/api/customers`, `/api/customers/{id}`, `/api/customers/{id}/restore` |
| Detail pelanggan | `/api/customers/{id}/transactions`, `/api/customers/{id}/activities`, `/api/customers/{id}/loyalty` |
| Segmentasi | `/api/customers/segment`, `/api/customers/segment/summary` |
| Keanggotaan | `/api/customers/membership` |
| Produk | `/api/products`, `/api/products/{id}` |
| Transaksi | `/api/transactions`, `/api/transactions/{id}`, `/api/transactions/{id}/status` |
| Aktivitas | `/api/activities`, `/api/activities/{id}/status` |
| Pengguna | `/api/users`, `/api/users/{id}`, `/api/users/{id}/status` |
| Profil | `/api/users/profile`, `/api/customers/profile` |
| Audit | `/api/audit-logs` |
| Gambar | `/api/upload/user`, `/api/upload/customer`, `/api/upload/product` |
| Analitik staf | Rute yang ada pada `/api/dashboard/user/` |
| Portal pelanggan | Rute yang ada pada `/api/dashboard/customer/` |

### Penyaringan data

- Daftar pelanggan dan produk memakai parameter pencarian/filter/paginasi yang didukung API.
- Daftar transaksi dari `getTransactions()` mengembalikan seluruh daftar. Pencarian, filter, dan paginasi tampilannya dapat dilakukan di sisi klien terhadap hasil tersebut.
- Tidak mengirim parameter baru dengan harapan API akan memprosesnya.
- Ringkasan dasbor mengikuti definisi data server; front-end tidak mengubah arti metrik.

### Unggah gambar

Urutan integrasi:

1. Pilih gambar.
2. Validasi format dan ukuran sesuai API.
3. Unggah dengan `FormData`.
4. Ambil `data.url`.
5. Masukkan URL ke properti `imageUrl`.
6. Simpan formulir entitas.

## 8. Arsitektur teknis dan pengelolaan state

### Teknologi

- **Next.js App Router:** halaman, tata letak, dan navigasi.
- **TypeScript:** tipe permintaan dan respons.
- **Tailwind CSS:** desain responsif.
- **TanStack Query:** data server dan cache.
- **React Hook Form:** formulir.
- **Zod:** validasi antarmuka yang mengikuti skema API.
- **React Context:** identitas sesi.
- Pustaka grafik untuk menampilkan data analitik yang tersedia.

### Pembagian state

| Data | Tempat pengelolaan |
|---|---|
| Daftar dan detail dari API | TanStack Query |
| Identitas dan peran sesi | Context |
| Formulir | React Hook Form |
| Item transaksi sementara | State lokal atau `useReducer` |
| Filter, halaman, dan tab | Query URL |
| Dialog dan menu | State lokal |

Zustand atau Redux belum diperlukan. Keranjang transaksi hanya berada pada halaman pencatatan penjualan, sehingga tidak membutuhkan penyimpanan global.

### Sesi tanpa perubahan API

Gunakan autentikasi Bearer yang sudah ada. Selama aplikasi terbuka, token disimpan dalam memori dan diperbarui melalui endpoint refresh.

Konsekuensinya, pemuatan ulang penuh dapat meminta login kembali. Ini menjadi pilihan awal yang tidak membutuhkan endpoint sesi tambahan dan tidak menyimpan refresh token secara persisten di penyimpanan browser.

Saat beberapa permintaan menerima `401`, hanya satu proses refresh berjalan. Setelah gagal, bersihkan sesi dan arahkan ke login.

### Konsistensi data

- Bersihkan cache saat logout atau pergantian akun.
- Setelah membuat transaksi, perbarui daftar transaksi dan produk.
- Setelah pembatalan, perbarui transaksi, stok, serta data pelanggan yang terkait.
- Setelah perubahan pelanggan, perbarui daftar dan detailnya.
- Jangan otomatis mengulang permintaan pembuatan transaksi ketika koneksi terputus dan hasilnya belum diketahui.
- API tetap menjadi sumber nilai final untuk harga, stok, loyalitas, dan keanggotaan.

## 9. Organisasi proyek

Pertahankan kode API dan layanan yang sudah ada. Tambahkan front-end dengan pembagian berikut:

| Direktori | Isi |
|---|---|
| `src/app/staff/` | Seluruh halaman staf |
| `src/app/customer/` | Seluruh halaman pelanggan |
| `src/app/api/` | API yang sudah ada, tidak diubah |
| `src/components/ui/` | Komponen dasar |
| `src/components/layout/` | Tata letak dan navigasi |
| `src/components/feedback/` | Status pemuatan, kosong, gagal |
| `src/features/auth/` | Login, registrasi, dan sesi |
| `src/features/customers/` | Pelanggan dan aktivitas |
| `src/features/products/` | Produk |
| `src/features/transactions/` | Transaksi |
| `src/features/users/` | Pengguna internal |
| `src/features/dashboard/` | Analitik staf |
| `src/features/customer-portal/` | Portal pelanggan |
| `src/lib/api/` | Klien HTTP dan penanganan respons |
| `src/providers/` | Provider sesi dan query |
| `src/types/` | Tipe data bersama |
| `src/utils/` | Pemformatan tanggal, angka, dan label |
| `src/modules/` | Layanan backend yang sudah ada |

Di dalam setiap modul fitur, pisahkan komponen, fungsi API, query, tipe data, dan validasi.

Tata letak publik seperti login dipisahkan dari tata letak terproteksi menggunakan kelompok rute Next.js agar halaman login tidak ikut terkena pengalihan sesi.

## 10. Urutan pengembangan

| Tahap | Hasil |
|---|---|
| 1. Fondasi | Tailwind, komponen dasar, tata letak staf/pelanggan, navigasi |
| 2. Autentikasi | Login dua jenis akun, registrasi pelanggan, sesi, logout, izin UI |
| 3. Pelanggan | Daftar, detail, formulir, status, unggah gambar |
| 4. Produk | Daftar, detail, formulir, stok, penonaktifan |
| 5. Penjualan | Pemilihan pelanggan/produk, transaksi baru, detail, status |
| 6. CRM | Aktivitas, riwayat pelanggan, segmentasi, keanggotaan |
| 7. Administrasi | Pengguna internal, profil, audit |
| 8. Analitik | Dasbor operasional, laporan, persediaan, kinerja tim |
| 9. Portal pelanggan | Ringkasan, riwayat, loyalitas, keanggotaan, rekomendasi, aktivitas |
| 10. Pengujian | Akses per peran, responsivitas, validasi, sesi, dan alur penjualan |

Perkiraan keseluruhan **7–10 minggu kerja untuk satu pengembang**, bergantung pada detail desain dan kompleksitas respons dasbor.

### Kriteria selesai

- Tidak ada halaman yang membutuhkan endpoint baru.
- Setiap tombol tindakan terhubung ke operasi API yang sesuai.
- Pelanggan tidak memiliki alur pembelian daring.
- Penjualan selalu memakai pelanggan aktif dan produk aktif.
- Item produk yang sama tidak dikirim sebagai baris duplikat.
- Status pembayaran, transaksi, dan aktivitas dibedakan.
- Pengiriman ganda dicegah pada formulir penjualan.
- Tidak ada perhitungan ulang poin atau stok oleh front-end.
- Semua halaman memiliki kondisi memuat, kosong, gagal, dan berhasil.
- Pengujian mencakup kelima peran `USER` serta akun `CUSTOMER`.