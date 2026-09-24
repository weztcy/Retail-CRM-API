Berikut rancangan **struktur folder dan roadmap implementasi frontend Retail CRM**, mengikuti pembagian area staf dan pelanggan dalam `Frontend Planning.md`, dengan API yang sudah ada tetap dipertahankan.

**Seluruh pengujian ditempatkan setelah implementasi coding selesai.** Tahap awal sampai tahap integrasi akhir hanya berisi setup dan implementasi; penulisan serta pelaksanaan pengujian dimulai pada tahap pengujian akhir.

Nama file frontend di bawah merupakan **usulan struktur implementasi**, bukan klaim bahwa file tersebut sudah ada di proyek.

## 1. Arah implementasi

Frontend ditambahkan ke proyek Next.js yang sudah memiliki API. Tidak membuat aplikasi backend baru dan tidak menimpa direktori backend.

Teknologi mengikuti perencanaan:

| Kebutuhan | Teknologi |
|---|---|
| Halaman dan navigasi | Next.js App Router |
| Bahasa | TypeScript |
| Styling responsif | Tailwind CSS |
| Data API dan cache | TanStack Query |
| Formulir | React Hook Form |
| Validasi formulir | Zod |
| Identitas sesi | React Context |
| Item transaksi sementara | `useReducer` |
| Filter, halaman, tab | Parameter URL |
| Grafik analitik | Pustaka grafik yang dipilih saat setup |

Pembagian tanggung jawab:

- `app`: definisi halaman, layout, dan batas penanganan error.
- `features`: implementasi bisnis frontend per modul.
- `components`: komponen bersama lintas modul.
- `lib`: infrastruktur API, sesi, akses, dan query.
- `providers`: pemasangan context dan query provider.
- `types`: tipe bersama; tipe khusus modul tetap berada di modulnya.
- `utils`: fungsi pemformatan dan pengolahan tampilan.
- `tests`: baru dibuat dan dikerjakan setelah seluruh implementasi selesai.

## 2. Struktur folder

### A. Struktur utama

```text
retail-crm/
├── package.json                         # Perbarui tanpa menghapus dependensi backend
├── tsconfig.json                        # Sesuaikan konfigurasi yang sudah ada
├── next.config.*                        # Pertahankan format konfigurasi proyek
├── postcss.config.*                     # Sesuaikan dengan versi Tailwind proyek
├── eslint.config.*                      # Ikuti konfigurasi proyek
├── .env.example                         # Dokumentasi variabel tanpa rahasia
│
├── public/
│   └── images/
│       ├── logo.svg
│       └── avatar-placeholder.svg
│
├── prisma/                              # Pertahankan jika berada di lokasi ini
│
├── src/
│   ├── app/
│   │   ├── api/                         # API yang sudah ada, tidak diubah
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── forbidden/
│   │   │   └── page.tsx
│   │   ├── staff/
│   │   │   ├── (public)/
│   │   │   └── (protected)/
│   │   └── customer/
│   │       ├── (public)/
│   │       └── (protected)/
│   │
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── providers/
│   ├── types/
│   ├── utils/
│   └── modules/                         # Layanan backend yang sudah ada
│
└── tests/                               # Dikerjakan hanya pada tahap akhir
```

Direktori backend lain yang ada dalam proyek tetap dipertahankan. Struktur di atas hanya menunjukkan area yang relevan dengan penambahan frontend.

### B. Struktur halaman staf

Kelompok `(public)` dan `(protected)` tidak menjadi bagian URL. Dengan demikian, login tetap berada di `/staff/login`.

```text
src/app/staff/
├── (public)/
│   ├── layout.tsx
│   └── login/
│       └── page.tsx
│
└── (protected)/
    ├── layout.tsx
    ├── loading.tsx
    ├── error.tsx
    │
    ├── dashboard/
    │   ├── page.tsx
    │   ├── sales/page.tsx
    │   ├── customers/page.tsx
    │   ├── products/page.tsx
    │   ├── inventory/page.tsx
    │   ├── loyalty/page.tsx
    │   ├── team-performance/page.tsx
    │   └── audit/page.tsx
    │
    ├── customers/
    │   ├── page.tsx
    │   ├── new/page.tsx
    │   ├── segments/page.tsx
    │   ├── membership/page.tsx
    │   └── [id]/
    │       ├── page.tsx
    │       └── edit/page.tsx
    │
    ├── products/
    │   ├── page.tsx
    │   ├── new/page.tsx
    │   └── [id]/
    │       ├── page.tsx
    │       └── edit/page.tsx
    │
    ├── transactions/
    │   ├── page.tsx
    │   ├── new/page.tsx
    │   └── [id]/page.tsx
    │
    ├── users/
    │   ├── page.tsx
    │   ├── new/page.tsx
    │   └── [id]/
    │       ├── page.tsx
    │       └── edit/page.tsx
    │
    ├── audit-logs/page.tsx
    ├── reports/page.tsx
    └── profile/page.tsx
```

### C. Struktur halaman pelanggan

```text
src/app/customer/
├── (public)/
│   ├── layout.tsx
│   ├── login/page.tsx
│   └── register/page.tsx
│
└── (protected)/
    ├── layout.tsx
    ├── loading.tsx
    ├── error.tsx
    ├── dashboard/page.tsx
    ├── transactions/page.tsx
    ├── loyalty/page.tsx
    ├── membership/page.tsx
    ├── purchase/page.tsx
    ├── recommendations/page.tsx
    ├── activities/page.tsx
    └── profile/page.tsx
```

Tidak dibuat halaman checkout, keranjang pelanggan, atau pembayaran daring.

### D. Komponen bersama

```text
src/components/
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── textarea.tsx
│   ├── checkbox.tsx
│   ├── form-field.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── avatar.tsx
│   ├── dialog.tsx
│   ├── tabs.tsx
│   ├── dropdown-menu.tsx
│   └── skeleton.tsx
│
├── layout/
│   ├── auth-layout.tsx
│   ├── staff-layout.tsx
│   ├── customer-layout.tsx
│   ├── sidebar.tsx
│   ├── topbar.tsx
│   ├── mobile-navigation.tsx
│   ├── breadcrumbs.tsx
│   ├── account-menu.tsx
│   └── page-header.tsx
│
├── data-display/
│   ├── data-table.tsx
│   ├── pagination.tsx
│   ├── search-input.tsx
│   ├── filter-bar.tsx
│   └── detail-field.tsx
│
├── feedback/
│   ├── empty-state.tsx
│   ├── error-state.tsx
│   ├── page-skeleton.tsx
│   ├── toast.tsx
│   ├── confirm-dialog.tsx
│   └── status-change-dialog.tsx
│
├── access/
│   ├── auth-guard.tsx
│   ├── permission-gate.tsx
│   └── role-badge.tsx
│
├── media/
│   ├── image-upload.tsx
│   └── image-preview.tsx
│
└── charts/
    ├── metric-card.tsx
    ├── chart-card.tsx
    └── ranking-table.tsx
```

### E. Infrastruktur frontend

```text
src/lib/
├── api/
│   ├── client.ts
│   ├── api-error.ts
│   ├── response.ts
│   └── endpoints.ts
├── auth/
│   ├── token-store.ts
│   ├── refresh-session.ts
│   └── session-redirect.ts
├── access/
│   ├── permissions.ts
│   ├── route-access.ts
│   └── navigation.ts
└── query/
    ├── query-client.ts
    ├── query-keys.ts
    └── invalidation.ts

src/providers/
├── app-provider.tsx
├── query-provider.tsx
├── session-provider.tsx
└── toast-provider.tsx

src/hooks/
├── use-session.ts
├── use-permission.ts
├── use-url-filters.ts
├── use-debounce.ts
└── use-disclosure.ts

src/types/
├── api.ts
├── auth.ts
├── pagination.ts
└── navigation.ts

src/utils/
├── format-date.ts
├── format-number.ts
├── format-currency.ts
├── format-label.ts
└── search-params.ts
```

### F. Modul fitur

Setiap fitur menggunakan pola yang konsisten:

```text
src/features/
├── auth/
├── uploads/
├── customers/
├── products/
├── transactions/
├── activities/
├── users/
├── audit-logs/
├── dashboard/
├── reports/
└── customer-portal/
```

Contoh isi modul:

```text
src/features/customers/
├── api/
│   └── customers.api.ts
├── queries/
│   ├── customers.queries.ts
│   └── customers.mutations.ts
├── schemas/
│   └── customer.schema.ts
├── types/
│   └── customer.types.ts
└── components/
    ├── customer-list.tsx
    ├── customer-filters.tsx
    ├── customer-form.tsx
    ├── customer-detail.tsx
    ├── customer-summary.tsx
    ├── customer-picker.tsx
    ├── customer-tabs.tsx
    ├── customer-transactions.tsx
    ├── customer-loyalty.tsx
    ├── customer-status-actions.tsx
    ├── customer-segments.tsx
    └── customer-membership.tsx
```

Halaman `page.tsx` cukup menyusun komponen fitur. Pemanggilan API, skema validasi, dan pengelolaan mutasi tidak ditumpuk di dalam halaman.

---

## 3. Roadmap implementasi detail

Urutannya adalah:

**Pemetaan kontrak → setup → infrastruktur → komponen → autentikasi → layout → unggah → pelanggan → produk → transaksi → CRM → administrasi → analitik → portal pelanggan → penyelesaian integrasi → seluruh pengujian → finalisasi.**

### Tahap 0 — Pemetaan proyek dan kontrak API

**Pekerjaan**

1. Petakan konfigurasi dan dependensi yang sudah digunakan.
2. Identifikasi file backend yang harus dipertahankan.
3. Petakan endpoint ke halaman dan tindakan frontend.
4. Catat struktur request, response, error, filter, dan paginasi.
5. Catat izin endpoint berdasarkan handler.
6. Pisahkan pembatasan backend dari kebijakan tampilan frontend.
7. Tandai respons yang belum terdokumentasi lengkap.

**File yang dikerjakan**

```text
docs/frontend/api-contract-map.md
docs/frontend/permission-matrix.md
docs/frontend/route-map.md
docs/frontend/implementation-roadmap.md
```

**Hasil tahap**

Setiap halaman mempunyai sumber API yang jelas. Tidak ada field request atau fitur yang ditentukan hanya berdasarkan perkiraan.

Khusus aktivitas portal pelanggan, bentuk respons harus diperjelas dari implementasi yang tersedia sebelum membuat pemetaan tampilan produksi.

### Tahap 1 — Setup frontend dalam proyek existing

**Pekerjaan**

1. Tambahkan dependensi frontend yang belum tersedia.
2. Sesuaikan Tailwind dengan versi proyek.
3. Siapkan alias impor tanpa merusak alias backend.
4. Buat fondasi tampilan global.
5. Siapkan root layout dan halaman awal.
6. Dokumentasikan konfigurasi lingkungan yang diperlukan.

**File yang dikerjakan**

```text
package.json
tsconfig.json
next.config.*
postcss.config.*
eslint.config.*
.env.example

src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/app/error.tsx
src/app/not-found.tsx
src/app/forbidden/page.tsx

public/images/logo.svg
public/images/avatar-placeholder.svg
```

**Hasil tahap**

Fondasi frontend dan struktur direktori terbentuk. Pada tahap ini belum menjalankan lint, typecheck, build verifikasi, atau pengujian.

### Tahap 2 — Infrastruktur HTTP, query, dan tipe bersama

**Pekerjaan**

1. Implementasikan klien HTTP untuk JSON dan `FormData`.
2. Normalisasikan respons sesuai kontrak API.
3. Buat objek error yang menyimpan status dan informasi validasi.
4. Siapkan dukungan Bearer token.
5. Siapkan penyimpanan token di memori.
6. Implementasikan refresh sesi tunggal untuk permintaan bersamaan.
7. Batasi pengulangan permintaan agar tidak membentuk loop refresh.
8. Matikan retry otomatis mutasi.
9. Buat query key dan kebijakan invalidasi.
10. Pisahkan kegagalan jaringan dari respons error API.

**File yang dikerjakan**

```text
src/lib/api/client.ts
src/lib/api/api-error.ts
src/lib/api/response.ts
src/lib/api/endpoints.ts

src/lib/auth/token-store.ts
src/lib/auth/refresh-session.ts

src/lib/query/query-client.ts
src/lib/query/query-keys.ts
src/lib/query/invalidation.ts

src/providers/query-provider.tsx
src/providers/app-provider.tsx

src/types/api.ts
src/types/auth.ts
src/types/pagination.ts

src/utils/search-params.ts
src/hooks/use-url-filters.ts
src/hooks/use-debounce.ts

src/app/layout.tsx
```

**Hasil tahap**

Semua fitur mempunyai satu jalur pemanggilan API dan penanganan error yang konsisten.

Untuk pembuatan transaksi, koneksi terputus tidak boleh memicu pengiriman ulang otomatis ketika hasil penyimpanannya belum diketahui.

### Tahap 3 — Komponen dasar dan umpan balik

**Pekerjaan**

1. Implementasikan input dan komponen formulir.
2. Implementasikan tabel, pencarian, filter, dan paginasi.
3. Implementasikan dialog beserta pengelolaan fokus.
4. Implementasikan indikator pemuatan, keadaan kosong, dan error.
5. Implementasikan notifikasi hasil tindakan.
6. Siapkan format tanggal, angka, mata uang, dan label.
7. Terapkan aksesibilitas dasar saat menulis komponen.

**File yang dikerjakan**

```text
src/components/ui/*
src/components/data-display/*
src/components/feedback/*

src/providers/toast-provider.tsx
src/providers/app-provider.tsx

src/hooks/use-disclosure.ts

src/utils/format-date.ts
src/utils/format-number.ts
src/utils/format-currency.ts
src/utils/format-label.ts

src/app/globals.css
```

Tanda `*` pada roadmap merujuk pada file yang sudah dirinci dalam struktur folder, bukan penambahan file tanpa batas.

**Hasil tahap**

Komponen lintas fitur siap digunakan tanpa membuat implementasi input, tabel, dan dialog berulang.

### Tahap 4 — Autentikasi, sesi, dan hak akses

**Pekerjaan**

1. Implementasikan login staf.
2. Implementasikan login pelanggan.
3. Implementasikan registrasi pelanggan.
4. Pasang session context.
5. Integrasikan refresh dan logout.
6. Bersihkan token serta cache ketika logout atau berganti akun.
7. Implementasikan pengarah halaman berdasarkan jenis akun dan peran.
8. Implementasikan pembatasan area staf dan pelanggan.
9. Implementasikan izin menu dan tindakan.
10. Cegah halaman login ikut terproteksi.

**File yang dikerjakan**

```text
src/features/auth/api/auth.api.ts
src/features/auth/queries/auth.mutations.ts
src/features/auth/schemas/login.schema.ts
src/features/auth/schemas/register.schema.ts
src/features/auth/types/auth.types.ts

src/features/auth/components/staff-login-form.tsx
src/features/auth/components/customer-login-form.tsx
src/features/auth/components/customer-register-form.tsx
src/features/auth/components/access-selector.tsx

src/providers/session-provider.tsx
src/providers/app-provider.tsx

src/lib/auth/session-redirect.ts
src/lib/auth/refresh-session.ts
src/lib/access/permissions.ts
src/lib/access/route-access.ts

src/hooks/use-session.ts
src/hooks/use-permission.ts

src/components/access/auth-guard.tsx
src/components/access/permission-gate.tsx
src/components/access/role-badge.tsx
src/components/layout/auth-layout.tsx

src/app/page.tsx
src/app/staff/(public)/layout.tsx
src/app/staff/(public)/login/page.tsx
src/app/customer/(public)/layout.tsx
src/app/customer/(public)/login/page.tsx
src/app/customer/(public)/register/page.tsx
src/app/forbidden/page.tsx
```

**Hasil tahap**

Pengarah setelah login mengikuti perencanaan:

| Akun/peran | Tujuan |
|---|---|
| `SUPER_ADMIN`, `ADMIN`, `MANAGER` | `/staff/dashboard` |
| `SALES` | `/staff/transactions` |
| `CUSTOMER_SERVICE` | `/staff/customers` |
| `CUSTOMER` | `/customer/dashboard` |

Token tetap berada di memori. Pemuatan ulang penuh dapat meminta login kembali. Guard frontend mengatur pengalaman pengguna; otorisasi tetap menjadi tanggung jawab API.

### Tahap 5 — Layout dan navigasi dua area

**Pekerjaan**

1. Implementasikan layout staf.
2. Implementasikan layout pelanggan.
3. Buat sidebar dan navigasi ponsel.
4. Tampilkan identitas akun serta menu logout.
5. Filter navigasi berdasarkan izin.
6. Implementasikan breadcrumb dan judul halaman.
7. Pasang guard pada kelompok rute terproteksi.

**File yang dikerjakan**

```text
src/components/layout/staff-layout.tsx
src/components/layout/customer-layout.tsx
src/components/layout/sidebar.tsx
src/components/layout/topbar.tsx
src/components/layout/mobile-navigation.tsx
src/components/layout/breadcrumbs.tsx
src/components/layout/account-menu.tsx
src/components/layout/page-header.tsx

src/lib/access/navigation.ts
src/types/navigation.ts

src/app/staff/(protected)/layout.tsx
src/app/staff/(protected)/loading.tsx
src/app/staff/(protected)/error.tsx

src/app/customer/(protected)/layout.tsx
src/app/customer/(protected)/loading.tsx
src/app/customer/(protected)/error.tsx
```

**Hasil tahap**

Seluruh modul berikutnya memiliki kerangka halaman dan navigasi yang sama.

### Tahap 6 — Unggah gambar

**Pekerjaan**

1. Implementasikan layanan unggah user, customer, dan product.
2. Validasi format serta ukuran mengikuti API.
3. Tampilkan pratinjau gambar.
4. Kirim gambar menggunakan `FormData`.
5. Ambil `data.url` untuk field `imageUrl`.
6. Tangani unggah gagal dan cegah simpan saat unggah masih berlangsung.

**File yang dikerjakan**

```text
src/features/uploads/api/uploads.api.ts
src/features/uploads/queries/uploads.mutations.ts
src/features/uploads/schemas/upload.schema.ts
src/features/uploads/types/upload.types.ts

src/components/media/image-upload.tsx
src/components/media/image-preview.tsx
```

**Hasil tahap**

Unggah dapat digunakan ulang pada formulir pelanggan, produk, dan profil sesuai izin endpoint.

### Tahap 7 — Manajemen pelanggan dasar

**Pekerjaan**

1. Implementasikan daftar pelanggan.
2. Tambahkan pencarian dan filter yang didukung API.
3. Simpan filter dan paginasi di URL.
4. Implementasikan tambah dan edit pelanggan.
5. Implementasikan detail profil pelanggan.
6. Integrasikan unggah gambar.
7. Implementasikan nonaktifkan dan pulihkan sesuai akses.
8. Buat pemilih pelanggan aktif untuk transaksi.
9. Siapkan tab detail untuk integrasi CRM berikutnya.

**File yang dikerjakan**

```text
src/features/customers/api/customers.api.ts
src/features/customers/queries/customers.queries.ts
src/features/customers/queries/customers.mutations.ts
src/features/customers/schemas/customer.schema.ts
src/features/customers/types/customer.types.ts

src/features/customers/components/customer-list.tsx
src/features/customers/components/customer-filters.tsx
src/features/customers/components/customer-form.tsx
src/features/customers/components/customer-detail.tsx
src/features/customers/components/customer-summary.tsx
src/features/customers/components/customer-picker.tsx
src/features/customers/components/customer-tabs.tsx
src/features/customers/components/customer-status-actions.tsx

src/app/staff/(protected)/customers/page.tsx
src/app/staff/(protected)/customers/new/page.tsx
src/app/staff/(protected)/customers/[id]/page.tsx
src/app/staff/(protected)/customers/[id]/edit/page.tsx
```

**Hasil tahap**

Manajemen data pelanggan dasar selesai. Tab transaksi, aktivitas, dan loyalitas dihubungkan pada tahap CRM.

### Tahap 8 — Manajemen produk

**Pekerjaan**

1. Implementasikan daftar dan detail produk.
2. Implementasikan pencarian, kategori, status, dan paginasi sesuai API.
3. Implementasikan formulir tambah dan edit.
4. Integrasikan gambar.
5. Kirim harga dan stok sebagai angka.
6. Implementasikan tindakan nonaktifkan produk.
7. Buat pemilih produk aktif untuk transaksi.
8. Tampilkan informasi stok dari server.

**File yang dikerjakan**

```text
src/features/products/api/products.api.ts
src/features/products/queries/products.queries.ts
src/features/products/queries/products.mutations.ts
src/features/products/schemas/product.schema.ts
src/features/products/types/product.types.ts

src/features/products/components/product-list.tsx
src/features/products/components/product-filters.tsx
src/features/products/components/product-form.tsx
src/features/products/components/product-detail.tsx
src/features/products/components/product-picker.tsx
src/features/products/components/product-status-actions.tsx
src/features/products/components/stock-badge.tsx

src/app/staff/(protected)/products/page.tsx
src/app/staff/(protected)/products/new/page.tsx
src/app/staff/(protected)/products/[id]/page.tsx
src/app/staff/(protected)/products/[id]/edit/page.tsx
```

**Hasil tahap**

Produk dapat dikelola dan dipilih pada formulir penjualan tanpa menambahkan alur pengadaan barang.

### Tahap 9 — Pencatatan dan pengelolaan transaksi

**Pekerjaan**

1. Implementasikan daftar transaksi.
2. Lakukan filter dan paginasi tampilan di sisi klien terhadap daftar yang dikembalikan API.
3. Implementasikan pemilihan pelanggan aktif.
4. Implementasikan pemilihan produk aktif.
5. Kelola item menggunakan reducer.
6. Gabungkan produk yang sama menjadi satu baris.
7. Implementasikan kuantitas, metode pembayaran, status pembayaran, dan catatan.
8. Tampilkan ringkasan sementara; gunakan harga dan total server sebagai hasil final.
9. Cegah klik simpan berulang.
10. Tampilkan invoice dari respons API.
11. Implementasikan detail dan perubahan status sesuai izin.
12. Invalidasi transaksi, stok, dan data pelanggan terkait.

**File yang dikerjakan**

```text
src/features/transactions/api/transactions.api.ts
src/features/transactions/queries/transactions.queries.ts
src/features/transactions/queries/transactions.mutations.ts
src/features/transactions/schemas/transaction.schema.ts
src/features/transactions/types/transaction.types.ts

src/features/transactions/state/transaction-form.reducer.ts
src/features/transactions/utils/transaction-summary.ts
src/features/transactions/utils/transaction-filters.ts

src/features/transactions/components/transaction-list.tsx
src/features/transactions/components/transaction-filters.tsx
src/features/transactions/components/transaction-form.tsx
src/features/transactions/components/transaction-items.tsx
src/features/transactions/components/quantity-input.tsx
src/features/transactions/components/payment-fields.tsx
src/features/transactions/components/order-summary.tsx
src/features/transactions/components/invoice-detail.tsx
src/features/transactions/components/transaction-status-badge.tsx
src/features/transactions/components/payment-status-badge.tsx
src/features/transactions/components/transaction-status-actions.tsx

src/app/staff/(protected)/transactions/page.tsx
src/app/staff/(protected)/transactions/new/page.tsx
src/app/staff/(protected)/transactions/[id]/page.tsx

src/lib/query/invalidation.ts
```

**Hasil tahap**

Alur pencatatan penjualan selesai dengan ketentuan:

- Tidak ada transaksi tanpa pelanggan aktif.
- Tidak ada `productId` duplikat dalam payload.
- Simpan transaksi tidak dilabeli simpan draf.
- Tidak ada perubahan status otomatis setelah transaksi dibuat.
- Status pembayaran dan transaksi tetap terpisah.
- Pembatalan tidak disebut refund otomatis.
- Frontend tidak menghitung ulang perubahan stok atau loyalitas.

### Tahap 10 — CRM, aktivitas, segmentasi, dan keanggotaan

**Pekerjaan**

1. Hubungkan tab riwayat transaksi pelanggan.
2. Hubungkan tab loyalitas.
3. Implementasikan daftar aktivitas dalam detail pelanggan.
4. Implementasikan formulir pencatatan aktivitas.
5. Ambil identitas staf dari sesi ketika kontrak memerlukan `userId`.
6. Implementasikan perubahan status aktivitas.
7. Implementasikan halaman segmentasi dan ringkasannya.
8. Implementasikan halaman keanggotaan.
9. Hubungkan perpindahan dari pelanggan terpilih ke formulir transaksi.

**File yang dikerjakan**

```text
src/features/activities/api/activities.api.ts
src/features/activities/queries/activities.queries.ts
src/features/activities/queries/activities.mutations.ts
src/features/activities/schemas/activity.schema.ts
src/features/activities/types/activity.types.ts

src/features/activities/components/activity-form.tsx
src/features/activities/components/activity-timeline.tsx
src/features/activities/components/activity-status-badge.tsx
src/features/activities/components/activity-status-actions.tsx

src/features/customers/components/customer-transactions.tsx
src/features/customers/components/customer-loyalty.tsx
src/features/customers/components/customer-segments.tsx
src/features/customers/components/customer-membership.tsx
src/features/customers/components/customer-tabs.tsx
src/features/customers/components/customer-detail.tsx

src/features/customers/api/customers.api.ts
src/features/customers/queries/customers.queries.ts
src/features/customers/types/customer.types.ts

src/app/staff/(protected)/customers/segments/page.tsx
src/app/staff/(protected)/customers/membership/page.tsx
src/app/staff/(protected)/transactions/new/page.tsx
```

**Hasil tahap**

Fungsi CRM tersambung ke pelanggan terkait. Tidak dibuat halaman aktivitas global yang memerlukan endpoint baru.

### Tahap 11 — Pengguna internal, profil staf, dan audit

**Pekerjaan**

1. Implementasikan daftar, tambah, detail, dan edit pengguna.
2. Implementasikan perubahan status pengguna.
3. Terapkan izin setiap tindakan sesuai endpoint.
4. Implementasikan profil staf menggunakan endpoint profil.
5. Integrasikan pembaruan gambar profil.
6. Implementasikan daftar audit dan filter yang tersedia.
7. Perbarui identitas sesi setelah perubahan profil bila relevan.

**File yang dikerjakan**

```text
src/features/users/api/users.api.ts
src/features/users/queries/users.queries.ts
src/features/users/queries/users.mutations.ts
src/features/users/schemas/user.schema.ts
src/features/users/schemas/staff-profile.schema.ts
src/features/users/types/user.types.ts

src/features/users/components/user-list.tsx
src/features/users/components/user-form.tsx
src/features/users/components/user-detail.tsx
src/features/users/components/user-status-actions.tsx
src/features/users/components/staff-profile-form.tsx

src/features/audit-logs/api/audit-logs.api.ts
src/features/audit-logs/queries/audit-logs.queries.ts
src/features/audit-logs/types/audit-log.types.ts
src/features/audit-logs/components/audit-log-list.tsx
src/features/audit-logs/components/audit-log-filters.tsx

src/app/staff/(protected)/users/page.tsx
src/app/staff/(protected)/users/new/page.tsx
src/app/staff/(protected)/users/[id]/page.tsx
src/app/staff/(protected)/users/[id]/edit/page.tsx
src/app/staff/(protected)/profile/page.tsx
src/app/staff/(protected)/audit-logs/page.tsx
```

**Hasil tahap**

Administrasi internal selesai. Daftar dan pembuatan pengguna dibatasi untuk `SUPER_ADMIN`; audit untuk `SUPER_ADMIN` dan `ADMIN`, mengikuti perencanaan.

### Tahap 12 — Dasbor staf dan laporan

**Pekerjaan**

1. Petakan respons setiap endpoint dasbor yang tersedia.
2. Buat tipe dan fungsi pemanggilan endpoint.
3. Implementasikan kartu metrik dan grafik.
4. Implementasikan ringkasan operasional.
5. Implementasikan analitik penjualan, pelanggan, produk, persediaan, loyalitas, tim, dan audit.
6. Implementasikan laporan.
7. Terapkan izin halaman.
8. Tambahkan filter periode hanya jika kontrak mendukungnya.

**File yang dikerjakan**

```text
src/features/dashboard/api/dashboard.api.ts
src/features/dashboard/queries/dashboard.queries.ts
src/features/dashboard/types/dashboard.types.ts
src/features/dashboard/utils/chart-mappers.ts

src/features/dashboard/components/overview-dashboard.tsx
src/features/dashboard/components/sales-dashboard.tsx
src/features/dashboard/components/customers-dashboard.tsx
src/features/dashboard/components/products-dashboard.tsx
src/features/dashboard/components/inventory-dashboard.tsx
src/features/dashboard/components/loyalty-dashboard.tsx
src/features/dashboard/components/team-performance-dashboard.tsx
src/features/dashboard/components/audit-dashboard.tsx

src/features/reports/api/reports.api.ts
src/features/reports/queries/reports.queries.ts
src/features/reports/types/report.types.ts
src/features/reports/components/reports-view.tsx

src/components/charts/metric-card.tsx
src/components/charts/chart-card.tsx
src/components/charts/ranking-table.tsx

src/app/staff/(protected)/dashboard/page.tsx
src/app/staff/(protected)/dashboard/sales/page.tsx
src/app/staff/(protected)/dashboard/customers/page.tsx
src/app/staff/(protected)/dashboard/products/page.tsx
src/app/staff/(protected)/dashboard/inventory/page.tsx
src/app/staff/(protected)/dashboard/loyalty/page.tsx
src/app/staff/(protected)/dashboard/team-performance/page.tsx
src/app/staff/(protected)/dashboard/audit/page.tsx
src/app/staff/(protected)/reports/page.tsx
```

**Hasil tahap**

Analitik menampilkan data API tanpa membuat metrik bisnis baru. Pengolahan grafik hanya mengubah bentuk penyajian, bukan definisi metrik.

### Tahap 13 — Portal pelanggan

**Pekerjaan**

1. Implementasikan ringkasan akun.
2. Implementasikan riwayat pembelian.
3. Tampilkan detail transaksi melalui dialog dari data riwayat yang tersedia.
4. Implementasikan loyalitas dan keanggotaan.
5. Implementasikan analisis pembelian.
6. Implementasikan rekomendasi tanpa tindakan pembelian.
7. Implementasikan aktivitas sesuai bentuk respons endpoint.
8. Implementasikan profil dan pembaruan gambar sesuai akses API.
9. Prioritaskan tampilan ponsel.

**File yang dikerjakan**

```text
src/features/customer-portal/api/customer-portal.api.ts
src/features/customer-portal/queries/customer-portal.queries.ts
src/features/customer-portal/queries/customer-portal.mutations.ts
src/features/customer-portal/schemas/customer-profile.schema.ts
src/features/customer-portal/types/customer-portal.types.ts

src/features/customer-portal/components/customer-dashboard.tsx
src/features/customer-portal/components/purchase-history.tsx
src/features/customer-portal/components/purchase-detail-dialog.tsx
src/features/customer-portal/components/loyalty-overview.tsx
src/features/customer-portal/components/membership-overview.tsx
src/features/customer-portal/components/purchase-analysis.tsx
src/features/customer-portal/components/recommendations-list.tsx
src/features/customer-portal/components/customer-activities.tsx
src/features/customer-portal/components/customer-profile-form.tsx

src/app/customer/(protected)/dashboard/page.tsx
src/app/customer/(protected)/transactions/page.tsx
src/app/customer/(protected)/loyalty/page.tsx
src/app/customer/(protected)/membership/page.tsx
src/app/customer/(protected)/purchase/page.tsx
src/app/customer/(protected)/recommendations/page.tsx
src/app/customer/(protected)/activities/page.tsx
src/app/customer/(protected)/profile/page.tsx
```

**Hasil tahap**

Portal pelanggan selesai tanpa mengakses pengelolaan internal atau menyediakan pembelian daring.

Apabila kontrak aktivitas belum tersedia, integrasi bagian tersebut dicatat sebagai penghambat penyelesaian; tidak diisi data contoh lalu dinyatakan selesai.

### Tahap 14 — Penyelesaian seluruh implementasi coding

Tahap ini merupakan penutupan pekerjaan implementasi sebelum pengujian dimulai.

**Pekerjaan**

1. Lengkapi invalidasi cache antarmodul.
2. Lengkapi penanganan sesi kedaluwarsa.
3. Lengkapi kondisi memuat, kosong, gagal, dan berhasil.
4. Lengkapi pemetaan error API ke formulir.
5. Lengkapi penguncian tombol selama mutasi.
6. Lengkapi navigasi kembali dengan filter sebelumnya.
7. Lengkapi tampilan responsif seluruh halaman.
8. Hilangkan tombol dummy dan data contoh dari integrasi produksi.
9. Lengkapi aksesibilitas dialog, input, dan navigasi.
10. Dokumentasikan perilaku sesi serta keterbatasan API.

**File yang dikerjakan**

```text
src/lib/query/invalidation.ts
src/lib/api/client.ts
src/lib/auth/refresh-session.ts
src/providers/session-provider.tsx

src/components/layout/*
src/components/feedback/*
src/components/access/*

src/features/*/components/*
src/features/*/queries/*

docs/frontend/api-contract-map.md
docs/frontend/permission-matrix.md
docs/frontend/implementation-roadmap.md
docs/frontend/known-limitations.md
```

Perubahan dilakukan hanya pada file yang memerlukan penyelesaian, bukan menulis ulang seluruh modul.

**Hasil tahap**

Seluruh halaman dan tindakan dalam ruang lingkup sudah diimplementasikan. Setelah titik ini, pekerjaan berpindah ke pengujian dan perbaikan hasil pengujian.

---

## 4. Pengujian seluruhnya di akhir

Perangkat pengujian berikut merupakan usulan: **Vitest, React Testing Library, MSW, dan Playwright**. Dependensi, konfigurasi, data pengujian, serta file pengujian baru dikerjakan pada tahap ini.

### Tahap 15 — Setup pengujian akhir

**Pekerjaan**

1. Pasang dependensi pengujian.
2. Siapkan lingkungan pengujian terpisah.
3. Siapkan akun kelima peran staf dan akun pelanggan.
4. Siapkan data pelanggan, produk, dan transaksi khusus pengujian.
5. Susun skenario dan matriks akses.
6. Siapkan mock respons yang mengikuti kontrak API.
7. Siapkan pencatatan temuan.

**File yang dikerjakan**

```text
package.json
vitest.config.ts
playwright.config.ts
.env.test.example

tests/setup.ts
tests/helpers/render-with-providers.tsx
tests/helpers/session.ts

tests/mocks/server.ts
tests/mocks/handlers/auth.handlers.ts
tests/mocks/handlers/customers.handlers.ts
tests/mocks/handlers/products.handlers.ts
tests/mocks/handlers/transactions.handlers.ts

tests/fixtures/accounts.ts
tests/fixtures/customers.ts
tests/fixtures/products.ts
tests/fixtures/transactions.ts

docs/testing/test-plan.md
docs/testing/permission-cases.md
docs/testing/bug-log.md
```

Pengujian mutasi menggunakan lingkungan dan data khusus pengujian, bukan data operasional toko.

### Tahap 16 — Pemeriksaan statis dan pengujian unit

**Pekerjaan**

1. Jalankan lint.
2. Jalankan pemeriksaan TypeScript.
3. Jalankan build produksi.
4. Uji fungsi format dan parameter URL.
5. Uji pemetaan izin.
6. Uji reducer transaksi.
7. Uji skema formulir.
8. Uji penyimpanan token serta koordinasi refresh.

**File yang dikerjakan**

```text
tests/unit/formatters.test.ts
tests/unit/search-params.test.ts
tests/unit/permissions.test.ts
tests/unit/route-access.test.ts
tests/unit/token-store.test.ts
tests/unit/refresh-session.test.ts
tests/unit/transaction-form.reducer.test.ts
tests/unit/transaction-summary.test.ts
tests/unit/form-schemas.test.ts
```

**Fokus penting**

Produk duplikat menjadi satu baris, angka tidak terkirim dalam format mata uang, dan status aktivitas tidak tertukar dengan status transaksi.

### Tahap 17 — Pengujian komponen dan integrasi frontend

**Pekerjaan**

1. Uji formulir dan pesan validasi.
2. Uji tabel serta filter URL.
3. Uji dialog konfirmasi.
4. Uji tampilan berdasarkan izin.
5. Uji login, refresh, logout, dan pembersihan cache.
6. Uji unggah gambar.
7. Uji invalidasi setelah mutasi.
8. Uji pencegahan pengiriman ganda.
9. Uji seluruh keadaan tampilan.

**File yang dikerjakan**

```text
tests/components/data-table.test.tsx
tests/components/confirm-dialog.test.tsx
tests/components/permission-gate.test.tsx
tests/components/image-upload.test.tsx
tests/components/customer-form.test.tsx
tests/components/product-form.test.tsx
tests/components/transaction-form.test.tsx

tests/integration/auth-flow.test.tsx
tests/integration/session-refresh.test.tsx
tests/integration/cache-isolation.test.tsx
tests/integration/customer-management.test.tsx
tests/integration/product-management.test.tsx
tests/integration/transaction-creation.test.tsx
tests/integration/transaction-cancellation.test.tsx
tests/integration/customer-portal.test.tsx
```

Pengujian berbasis mock memeriksa perilaku frontend. Kesesuaian dengan backend nyata dilanjutkan pada tahap berikutnya.

### Tahap 18 — Pengujian menyeluruh dengan API nyata

**Pekerjaan**

1. Uji login semua peran.
2. Uji akses halaman melalui URL langsung.
3. Uji tindakan yang diizinkan dan ditolak.
4. Uji tambah pelanggan hingga pencatatan penjualan.
5. Uji perubahan status serta pembatalan.
6. Uji aktivitas pelanggan.
7. Uji administrasi dan audit.
8. Uji dasbor serta portal pelanggan.
9. Uji responsivitas desktop dan ponsel.
10. Uji sesi kedaluwarsa, unggah gagal, jaringan terputus, serta respons API gagal.
11. Uji bahwa data akun sebelumnya tidak tampil setelah pergantian akun.

**File yang dikerjakan**

```text
tests/e2e/auth.spec.ts
tests/e2e/role-access.spec.ts
tests/e2e/customers.spec.ts
tests/e2e/products.spec.ts
tests/e2e/sales-flow.spec.ts
tests/e2e/transaction-status.spec.ts
tests/e2e/customer-activities.spec.ts
tests/e2e/users.spec.ts
tests/e2e/audit-logs.spec.ts
tests/e2e/staff-dashboard.spec.ts
tests/e2e/customer-portal.spec.ts
tests/e2e/session-expiry.spec.ts
tests/e2e/responsive.spec.ts

docs/testing/manual-checklist.md
docs/testing/test-results.md
docs/testing/bug-log.md
```

Saat menguji pembatalan, nilai stok dan loyalitas diperiksa terhadap hasil backend. Tidak menambahkan logika koreksi bisnis di frontend agar pengujian lolos.

### Tahap 19 — Perbaikan temuan dan pengujian ulang

**Pekerjaan**

1. Kelompokkan temuan berdasarkan dampak.
2. Perbaiki kehilangan sesi, kebocoran tampilan data, dan pengiriman ganda terlebih dahulu.
3. Perbaiki kegagalan alur bisnis.
4. Perbaiki validasi dan masalah tampilan.
5. Tambahkan pengujian regresi untuk bug yang ditemukan.
6. Jalankan ulang pengujian terkait.
7. Jalankan seluruh rangkaian pengujian setelah perbaikan selesai.

**File yang dikerjakan**

```text
File implementasi yang terkait dengan temuan
File tests yang terkait dengan temuan

docs/testing/bug-log.md
docs/testing/test-results.md
docs/testing/manual-checklist.md
```

Perbaikan pada tahap ini merupakan tindak lanjut pengujian akhir, bukan penambahan ruang lingkup fitur baru.

### Tahap 20 — Finalisasi dan kesiapan rilis

**Pekerjaan**

1. Finalisasi dokumentasi instalasi dan konfigurasi.
2. Dokumentasikan cara menjalankan aplikasi.
3. Dokumentasikan perilaku login kembali setelah pemuatan ulang.
4. Dokumentasikan hak akses.
5. Dokumentasikan keterbatasan yang masih berlaku.
6. Siapkan daftar pemeriksaan rilis.
7. Jika deployment termasuk ruang lingkup, jalankan pemeriksaan singkat pada lingkungan rilis setelah deployment.

**File yang dikerjakan**

```text
README.md
.env.example

docs/frontend/known-limitations.md
docs/release/deployment-guide.md
docs/release/release-checklist.md
docs/release/user-guide-staff.md
docs/release/user-guide-customer.md
docs/testing/test-results.md
```

## 5. Ketentuan selesai

Implementasi dinyatakan selesai setelah:

- Seluruh rute dalam perencanaan terimplementasi.
- Semua tindakan terhubung ke endpoint yang tersedia.
- Tidak ada perubahan backend yang diperlukan untuk menjalankan frontend.
- Hak akses kelima peran staf dan pelanggan sudah diuji.
- Pelanggan tidak memiliki alur pembelian daring.
- Transaksi memakai pelanggan aktif dan produk aktif.
- Pengiriman ganda serta item produk duplikat dicegah.
- Status pembayaran, transaksi, dan aktivitas ditampilkan terpisah.
- Harga, stok, poin, dan keanggotaan final mengikuti server.
- Logout membersihkan identitas sesi dan cache.
- Setiap halaman memiliki keadaan memuat, kosong, gagal, dan berhasil.
- Pemeriksaan statis, build, pengujian unit, integrasi, dan pengujian menyeluruh sudah selesai.
- Temuan yang menghambat alur utama sudah diperbaiki dan diuji ulang.
- Dokumentasi penggunaan serta konfigurasi sudah lengkap.