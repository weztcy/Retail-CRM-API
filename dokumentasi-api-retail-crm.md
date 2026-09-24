# Dokumentasi API Retail CRM

Dokumen ini menyatukan dokumentasi API utama, autentikasi, customer, produk, transaksi, aktivitas, pengguna, serta dashboard user dan customer dari pembahasan sebelumnya. Contoh UUID, tanggal, nama, nominal, dan token adalah ilustrasi, bukan hasil pemanggilan server. Bagian yang belum terverifikasi ditandai; file route kosong tidak dinyatakan sebagai endpoint aktif. Dokumen ini merupakan konsolidasi pembacaan sebelumnya, bukan hasil pengujian langsung terhadap server.

## 1. Menjalankan aplikasi dan variabel klien

Skrip pengembangan `npm run dev` menjalankan `next dev -p 2000`. Base URL pengembangan: `http://localhost:2000`. README menyebut port 3000, tetapi skrip pengembangan menggunakan 2000. Gunakan alamat deployment untuk lingkungan lain.

Variabel Postman: `baseUrl`, `userAccessToken`, `customerAccessToken`, `refreshToken`, `userId`, `customerId`, `productId`, dan `transactionId`. ID wajib merujuk data sebenarnya. Token pengguna internal dan customer tidak dapat dipertukarkan pada endpoint yang membedakan identitas.

Dependensi utama yang dicatat pada pembacaan sebelumnya: Next.js, Prisma, adapter MariaDB, Zod, bcrypt, jose, dan jsonwebtoken. `.env.example` mencantumkan `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_ACCESS_EXPIRE`, dan `JWT_REFRESH_EXPIRE`. Layanan penyimpanan refresh token juga membaca `JWT_REFRESH_DAYS`, dengan bawaan 7. Utilitas JWT lain membaca `JWT_REFRESH_SECRET`; alur JWT aktif masih perlu dicocokkan sebelum menetapkan konfigurasi produksi. Jangan menganggap masa berlaku record refresh token selalu sama dengan masa berlaku JWT.

## 2. Konvensi header, akses, dan respons

Header untuk GET/DELETE terproteksi: `Authorization: Bearer {{userAccessToken}}` dan `Accept: application/json`. Untuk identitas customer, ganti token dengan `{{customerAccessToken}}`. Tambahkan `Content-Type: application/json` pada permintaan yang mengirim body JSON. Endpoint publik yang menerima JSON menggunakan `Content-Type: application/json` dan `Accept: application/json`, tanpa Bearer token. GET tanpa body tidak memerlukan Content-Type.

Singkatan header pada dokumentasi endpoint: **H-U** = Bearer `{{userAccessToken}}` + Accept JSON; **H-C** = Bearer `{{customerAccessToken}}` + Accept JSON; **H-P** = Accept JSON tanpa Bearer; **+J** = tambahan Content-Type JSON. Contoh literal H-U+J:

```http
Authorization: Bearer {{userAccessToken}}
Content-Type: application/json
Accept: application/json
```

Role internal: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `SALES`, `CUSTOMER_SERVICE`. Singkatan **M** berarti SUPER_ADMIN/ADMIN/MANAGER; **S** berarti M ditambah SALES; **I** berarti seluruh lima role internal. `requireRole` menerima identitas USER dengan role sesuai. `requireCustomer` menerima identitas CUSTOMER.

Respons berhasil menggunakan `{ "success": true, "message": "Pesan endpoint", "data": ... }`. Contoh di bawah memakai struktur pembungkus tersebut, kecuali bagian yang secara eksplisit hanya mendokumentasikan objek hasil layanan. Respons gagal umumnya `{ "success": false, "message": "Pesan kesalahan", "errors": [] }`. Status bawaan berhasil 200; route pembuatan tertentu menggunakan 201. Registrasi customer menggunakan 200. Penonaktifan yang terbaca menggunakan 200, bukan 204.

Status kesalahan: 400 untuk validasi; 401 untuk autentikasi; 403 untuk identitas/role yang tidak diizinkan atau akun nonaktif pada alur tertentu; 404 untuk data tidak ditemukan melalui ApiError; 409 untuk konflik unik; 500 untuk kesalahan umum. Prisma P2002 dipetakan ke 409 dan P2025 ke 404. Contoh validasi:

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    { "field": "items.0.quantity", "message": "Quantity harus lebih dari 0" }
  ]
}
```

Middleware global yang dicatat hanya mencakup `/api/protected/:path*`. Route lain bergantung pada pemeriksaan handler masing-masing. Pernyataan “tanpa pemeriksaan autentikasi” di bawah menggambarkan kode yang terbaca, bukan rekomendasi keamanan.

## 3. Autentikasi

### 3.1 POST /api/auth/login/user

Header **H-P+J**. Tidak memerlukan Bearer. Body wajib: email valid (di-trim), password minimal 6 karakter.

```json
{ "email": "admin@example.com", "password": "Admin123!" }
```

Berhasil **200**:

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "accessToken": "{{userAccessToken}}",
    "refreshToken": "{{refreshToken}}",
    "user": {
      "id": "33333333-3333-4333-8333-333333333333",
      "name": "Admin Retail",
      "email": "admin@example.com",
      "imageUrl": null,
      "role": "ADMIN",
      "isActive": true
    }
  }
}
```

Kesalahan: 401 `Email atau password salah`; 403 `User tidak aktif`.

### 3.2 POST /api/auth/login/customer

Header **H-P+J**. Email valid dan password minimal 6 karakter wajib.

```json
{ "email": "budi@example.com", "password": "Customer123!" }
```

Berhasil **200**:

```json
{
  "success": true,
  "message": "Login customer berhasil",
  "data": {
    "accessToken": "{{customerAccessToken}}",
    "refreshToken": "{{refreshToken}}",
    "customer": {
      "id": "11111111-1111-4111-8111-111111111111",
      "customerCode": "CUS-001",
      "name": "Budi Santoso",
      "phone": "081234567890",
      "email": "budi@example.com",
      "imageUrl": null,
      "membership": "BRONZE"
    }
  }
}
```

Kesalahan: 401 `Email atau nomor HP salah`, 401 `Password salah`, 403 `Customer tidak aktif`. Pesan menyebut nomor HP, tetapi implementasi yang tercatat mencari customer melalui email.

### 3.3 POST /api/auth/register/customer

Header **H-P+J**. Wajib: name minimal 3 karakter, email valid, phone minimal 10 karakter, password minimal 6 karakter. Opsional: imageUrl string, gender MALE/FEMALE/OTHER, birthDate string, address, city. Validasi panjang phone tidak memastikan isinya hanya angka.

```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "phone": "081234567890",
  "password": "Customer123!",
  "imageUrl": "/uploads/customers/budi.jpg",
  "gender": "MALE",
  "birthDate": "1995-05-20",
  "address": "Jalan Melati Nomor 10",
  "city": "Bandung"
}
```

Berhasil **200**:

```json
{"success":true,"message":"Registrasi customer berhasil","data":{"id":"11111111-1111-4111-8111-111111111111","customerCode":"CUS-1750000000000","name":"Budi Santoso","email":"budi@example.com","phone":"081234567890","imageUrl":"/uploads/customers/budi.jpg","membership":"BRONZE","createdAt":"2026-09-24T08:00:00.000Z"}}}
```

Kode customer dibuat dengan awalan CUS- dan waktu pembuatan; membership awal BRONZE; akun loyalty awal 0; password di-hash. Tidak mengembalikan token. Email/telepon duplikat: 409 `Email atau nomor HP sudah digunakan`.

### 3.4 POST /api/auth/refresh

Header **H-P+J**. refreshToken wajib, di-trim, minimal 10 karakter.

```json
{ "refreshToken": "{{refreshToken}}" }
```

Berhasil **200**:

```json
{
  "success": true,
  "message": "Token berhasil diperbarui",
  "data": {
    "accessToken": "{{accessTokenBaru}}",
    "refreshToken": "{{refreshTokenBaru}}"
  }
}
```

Simpan kedua token baru. Record refresh token lama dihapus dan diganti. Kesalahan 401: `Refresh token tidak ditemukan`, `Refresh token expired`, `Refresh token tidak valid`; 403: `User tidak aktif` atau `Customer tidak aktif`.

### 3.5 POST /api/auth/logout

Header **H-P+J**. Body:

```json
{ "refreshToken": "{{refreshToken}}" }
```

Berhasil **200**:

```json
{ "success": true, "message": "Logout berhasil", "data": null }
```

Refresh token tidak ditemukan: 404 `Refresh token tidak ditemukan`. Logout menghapus refresh token yang diberikan; kode yang tercatat tidak mencabut access token yang sudah diterbitkan.

## 4. Produk

### 4.1 GET /api/products

Header **H-U**; role **S**; tanpa body. Contoh URL: `{{baseUrl}}/api/products?search=kopi&category=Minuman&status=ACTIVE&stock=LOW&sort=price_asc&page=1&limit=10`.

Query: `search` mencari sebagian SKU/nama/kategori; `category` mencocokkan kategori; `status=INACTIVE` mengambil nonaktif, nilai lain atau kosong mengambil aktif; `stock=LOW` berarti stok kurang dari 10 (termasuk 0), `stock=EMPTY` berarti 0; sort menerima price_asc, price_desc, stock_asc, stock_desc, oldest, selain itu terbaru; page bawaan 1, limit bawaan 10. Berhasil **200**:

```json
{
  "success": true,
  "message": "Product list berhasil diambil",
  "data": {
    "products": [
      {
        "id": "22222222-2222-4222-8222-222222222222",
        "sku": "KOPI-001",
        "name": "Kopi Arabika",
        "category": "Minuman",
        "price": "50000",
        "stock": 8,
        "isActive": true,
        "imageUrl": "/uploads/products/kopi.jpg",
        "createdAt": "2026-09-24T08:00:00.000Z",
        "updatedAt": "2026-09-24T08:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
  }
}
```

Harga pada CRUD produk berasal dari Prisma Decimal tanpa konversi Number pada layanan terkait; contoh ditulis sebagai string. Dashboard mengonversi nominalnya menjadi angka.

### 4.2 GET /api/products/{{productId}}

Header **H-U**; role **S**; tanpa body. Berhasil **200**:

```json
{
  "success": true,
  "message": "Detail product berhasil diambil",
  "data": {
    "id": "22222222-2222-4222-8222-222222222222",
    "sku": "KOPI-001",
    "name": "Kopi Arabika",
    "category": "Minuman",
    "price": "50000",
    "stock": 8,
    "isActive": true,
    "imageUrl": "/uploads/products/kopi.jpg",
    "createdAt": "2026-09-24T08:00:00.000Z",
    "updatedAt": "2026-09-24T08:00:00.000Z"
  }
}
```

Pencarian detail tidak memfilter isActive. Tidak ditemukan: 404 `Product tidak ditemukan`.

### 4.3 POST /api/products

Header **H-U+J**; role **M**. Wajib: sku minimal 3 dan unik, name minimal 3, category minimal 2, price number positif. Opsional: stock integer tidak negatif (bawaan 0), imageUrl berawalan `/uploads/`.

```json
{
  "sku": "KOPI-001",
  "name": "Kopi Arabika",
  "category": "Minuman",
  "price": 50000,
  "stock": 8,
  "imageUrl": "/uploads/products/kopi.jpg"
}
```

Berhasil **201**:

```json
{
  "success": true,
  "message": "Product berhasil dibuat",
  "data": {
    "id": "22222222-2222-4222-8222-222222222222",
    "sku": "KOPI-001",
    "name": "Kopi Arabika",
    "category": "Minuman",
    "price": "50000",
    "stock": 8,
    "isActive": true,
    "imageUrl": "/uploads/products/kopi.jpg",
    "createdAt": "2026-09-24T08:00:00.000Z",
    "updatedAt": "2026-09-24T08:00:00.000Z"
  }
}
```

SKU duplikat: 409 `SKU sudah digunakan`. Membuat audit log PRODUCT/CREATE.

### 4.4 PUT /api/products/{{productId}}

Header **H-U+J**; role **M**. Seluruh field berikut opsional, dengan validasi seperti pembuatan. SKU dan isActive tidak termasuk skema input pembaruan. Contoh body lengkap:

```json
{
  "name": "Kopi Arabika Premium",
  "category": "Minuman",
  "price": 55000,
  "stock": 12,
  "imageUrl": "/uploads/products/kopi-premium.jpg"
}
```

Perubahan parsial seperti `{"price":55000}` diterima oleh skema walaupun metode PUT. Berhasil **200**:

```json
{
  "success": true,
  "message": "Product berhasil diperbarui",
  "data": {
    "id": "22222222-2222-4222-8222-222222222222",
    "sku": "KOPI-001",
    "name": "Kopi Arabika Premium",
    "category": "Minuman",
    "price": "55000",
    "stock": 12,
    "isActive": true,
    "imageUrl": "/uploads/products/kopi-premium.jpg",
    "updatedAt": "2026-09-24T09:00:00.000Z"
  }
}
```

Respons pembaruan tidak menyertakan createdAt. Layanan hanya memperbarui produk aktif; nonaktif/tidak ditemukan menghasilkan 404.

### 4.5 DELETE /api/products/{{productId}}

Header **H-U**; role **M**; tanpa body. Penonaktifan, bukan penghapusan fisik. Berhasil **200**, pesan `Product berhasil dinonaktifkan`. Struktur lengkap data hasil deleteProduct belum terverifikasi; tidak disediakan contoh JSON rekaan.

## 5. Transaksi

### 5.1 POST /api/transactions

Header **H-U+J**; role **S**. customerId UUID wajib; paymentMethod wajib CASH/CARD/TRANSFER/EWALLET/QRIS; paymentStatus opsional UNPAID/PAID/REFUND; notes opsional string; items minimal satu, productId UUID dan quantity integer positif. userId diambil dari token.

```json
{
  "customerId": "11111111-1111-4111-8111-111111111111",
  "paymentMethod": "CASH",
  "paymentStatus": "PAID",
  "notes": "Pembelian di toko",
  "items": [
    { "productId": "22222222-2222-4222-8222-222222222222", "quantity": 2 }
  ]
}
```

Berhasil **201**, pesan `Transaksi berhasil dibuat`. Objek hasil createTransaction dan seluruh perhitungan pembuatan belum selesai terverifikasi; jangan menganggap responsnya sama dengan detail transaksi.

### 5.2 GET /api/transactions

Header **H-U**; role **I**; tanpa body. Handler tidak membaca query pencarian/pagination. Urutan createdAt terbaru. Berhasil **200**:

```json
{
  "success": true,
  "message": "Transaction list berhasil diambil",
  "data": [
    {
      "id": "44444444-4444-4444-8444-444444444444",
      "invoiceNumber": "INV-20260924-1234",
      "customerId": "11111111-1111-4111-8111-111111111111",
      "userId": "33333333-3333-4333-8333-333333333333",
      "totalAmount": "100000",
      "paymentMethod": "CASH",
      "paymentStatus": "PAID",
      "status": "COMPLETED",
      "paymentReference": null,
      "notes": "Pembelian di toko",
      "transactionDate": "2026-09-24T08:00:00.000Z",
      "createdAt": "2026-09-24T08:00:00.000Z",
      "updatedAt": "2026-09-24T08:00:00.000Z",
      "customer": {
        "id": "11111111-1111-4111-8111-111111111111",
        "customerCode": "CUS-001",
        "name": "Budi Santoso"
      },
      "user": {
        "id": "33333333-3333-4333-8333-333333333333",
        "name": "Admin Retail"
      },
      "items": [
        {
          "id": "55555555-5555-4555-8555-555555555555",
          "transactionId": "44444444-4444-4444-8444-444444444444",
          "productId": "22222222-2222-4222-8222-222222222222",
          "quantity": 2,
          "price": "50000",
          "subtotal": "100000",
          "createdAt": "2026-09-24T08:00:00.000Z",
          "updatedAt": "2026-09-24T08:00:00.000Z",
          "product": {
            "id": "22222222-2222-4222-8222-222222222222",
            "sku": "KOPI-001",
            "name": "Kopi Arabika"
          }
        }
      ]
    }
  ]
}
```

### 5.3 GET /api/transactions/{{transactionId}}

Header **H-U**; role **I**; tanpa body. Berhasil **200**:

```json
{
  "success": true,
  "message": "Detail transaction berhasil diambil",
  "data": {
    "id": "44444444-4444-4444-8444-444444444444",
    "invoiceNumber": "INV-20260924-1234",
    "customerId": "11111111-1111-4111-8111-111111111111",
    "userId": "33333333-3333-4333-8333-333333333333",
    "totalAmount": "100000",
    "paymentMethod": "CASH",
    "paymentStatus": "PAID",
    "status": "COMPLETED",
    "paymentReference": null,
    "notes": "Pembelian di toko",
    "transactionDate": "2026-09-24T08:00:00.000Z",
    "createdAt": "2026-09-24T08:00:00.000Z",
    "updatedAt": "2026-09-24T08:00:00.000Z",
    "customer": {
      "id": "11111111-1111-4111-8111-111111111111",
      "customerCode": "CUS-001",
      "name": "Budi Santoso",
      "phone": "081234567890"
    },
    "user": {
      "id": "33333333-3333-4333-8333-333333333333",
      "name": "Admin Retail",
      "email": "admin@example.com"
    },
    "items": [
      {
        "id": "55555555-5555-4555-8555-555555555555",
        "transactionId": "44444444-4444-4444-8444-444444444444",
        "productId": "22222222-2222-4222-8222-222222222222",
        "quantity": 2,
        "price": "50000",
        "subtotal": "100000",
        "createdAt": "2026-09-24T08:00:00.000Z",
        "updatedAt": "2026-09-24T08:00:00.000Z",
        "product": {
          "id": "22222222-2222-4222-8222-222222222222",
          "sku": "KOPI-001",
          "name": "Kopi Arabika",
          "price": "50000"
        }
      }
    ]
  }
}
```

Tidak ditemukan: 404 `Transaction tidak ditemukan`.

### 5.4 PATCH /api/transactions/{{transactionId}}/status

Header **H-U+J**; role **M**. status wajib PENDING/PROCESSING/COMPLETED/CANCELLED.

```json
{ "status": "CANCELLED" }
```

Berhasil **200**:

```json
{
  "success": true,
  "message": "Status transaksi berhasil diperbarui",
  "data": {
    "id": "44444444-4444-4444-8444-444444444444",
    "invoiceNumber": "INV-20260924-1234",
    "customerId": "11111111-1111-4111-8111-111111111111",
    "userId": "33333333-3333-4333-8333-333333333333",
    "totalAmount": "100000",
    "paymentMethod": "CASH",
    "paymentStatus": "PAID",
    "status": "CANCELLED",
    "paymentReference": null,
    "notes": "Pembelian di toko",
    "transactionDate": "2026-09-24T08:00:00.000Z",
    "createdAt": "2026-09-24T08:00:00.000Z",
    "updatedAt": "2026-09-24T09:00:00.000Z",
    "customer": {
      "id": "11111111-1111-4111-8111-111111111111",
      "name": "Budi Santoso"
    },
    "items": [
      {
        "id": "55555555-5555-4555-8555-555555555555",
        "transactionId": "44444444-4444-4444-8444-444444444444",
        "productId": "22222222-2222-4222-8222-222222222222",
        "quantity": 2,
        "price": "50000",
        "subtotal": "100000",
        "createdAt": "2026-09-24T08:00:00.000Z",
        "updatedAt": "2026-09-24T08:00:00.000Z"
      }
    ]
  }
}
```

Pembatalan dari status selain CANCELLED mengembalikan stok, membuat STOCK_IN, mengurangi totalSpent customer sampai minimum 0, mengurangi poin sebesar pembulatan ke bawah totalAmount/10000 sampai minimum 0, membuat ROLLBACK dan audit. paymentStatus tidak otomatis menjadi REFUND. Tidak terlihat larangan membuka kembali transaksi batal; perubahan kembali juga tidak mengurangi stok ulang pada fungsi tersebut. Alur ini perlu dibatasi sebelum operasional.

## 6. Customer

### 6.1 GET /api/customers/{{customerId}}

Header **H-U**; role **I**; tanpa body; ID divalidasi UUID. Berhasil 200, pesan `Detail customer berhasil diambil`. Struktur data getCustomerById belum terverifikasi lengkap.

### 6.2 PUT /api/customers/{{customerId}}

Header **H-U+J**; role **S**. Seluruh field opsional: name minimal 3, phone minimal 8, email valid, imageUrl berawalan /uploads/, gender MALE/FEMALE/OTHER, birthDate tanggal YYYY-MM-DD, address/city string, membership BRONZE/SILVER/GOLD/PLATINUM, isActive boolean. password dan customerCode tidak termasuk input.

```json
{
  "name": "Budi Santoso",
  "phone": "081234567890",
  "email": "budi@example.com",
  "imageUrl": "/uploads/customers/budi.jpg",
  "gender": "MALE",
  "birthDate": "1995-05-20",
  "address": "Jalan Melati Nomor 10",
  "city": "Bandung",
  "membership": "GOLD",
  "isActive": true
}
```

Berhasil 200, pesan `Customer berhasil diperbarui`; struktur data belum terverifikasi lengkap. Body kosong atau {}: 400 `Tidak ada data yang diperbarui`. JSON tidak valid: 400 `Format JSON tidak valid`.

### 6.3 DELETE /api/customers/{{customerId}}

Header **H-U**; role **M**; tanpa body; ID UUID. Berhasil 200, pesan `Customer berhasil dinonaktifkan`. Struktur data hasil layanan belum terverifikasi lengkap.

### 6.4 GET /api/customers/{{customerId}}/loyalty

Header **H-P**; handler yang terbaca tidak memeriksa autentikasi; tanpa body. Berhasil **200**:

```json
{
  "success": true,
  "message": "Loyalty customer berhasil diambil",
  "data": {
    "customerId": "11111111-1111-4111-8111-111111111111",
    "customer": "Budi Santoso",
    "points": 150
  }
}
```

Tanpa akun loyalty, points 0. Customer tidak ditemukan: 404 `Customer tidak ditemukan`.

### 6.5 GET /api/customers/{{customerId}}/transactions

Header **H-P**; handler yang terbaca tidak memeriksa autentikasi; tanpa body. Berhasil 200, pesan `Riwayat transaksi customer berhasil diambil`. Struktur getCustomerTransactions belum terverifikasi. Berbeda dari dashboard customer yang menentukan ID dari token.

### 6.6 GET /api/customers/segment dan GET /api/customers/segment/summary

Keduanya memakai **H-P**, tanpa body, dan tidak terlihat pemeriksaan autentikasi pada handler. Status 200. Pesan endpoint pertama `Customer segmentation berhasil diambil`; endpoint kedua `Customer segment summary berhasil diambil`. Bentuk data serta perhitungan segmentasi belum terverifikasi.

## 7. Aktivitas

### 7.1 POST /api/activities

Header **H-P+J**; tidak terlihat pemeriksaan autentikasi. customerId dan userId UUID wajib; type wajib CALL/WHATSAPP/EMAIL/MEETING/COMPLAINT/NOTE; subject minimal 3; description string opsional. userId berasal dari body.

```json
{
  "customerId": "11111111-1111-4111-8111-111111111111",
  "userId": "33333333-3333-4333-8333-333333333333",
  "type": "CALL",
  "subject": "Tindak lanjut pembelian",
  "description": "Customer meminta informasi produk tambahan."
}
```

Berhasil 201, pesan `Aktivitas customer berhasil dibuat`. Respons lengkap layanan belum terverifikasi. Model mempunyai status awal PENDING, tetapi model saja tidak menentukan seluruh respons HTTP.

### 7.2 Skema pembaruan status aktivitas

Skema menerima `{"status":"DONE"}` dengan pilihan PENDING/PROCESS/DONE/CANCELLED. Metode, path, otorisasi, dan respons handler belum tercocokkan; ini dokumentasi skema, bukan deklarasi endpoint aktif.

## 8. Pengguna internal: kontrak layanan

Bagian ini memuat skema dan hasil layanan yang telah dicatat. Path, metode, header, status, serta pesan tiap handler belum seluruhnya dicocokkan; objek berikut bukan respons HTTP lengkap.

**Pembuatan pengguna:** name minimal 3, email valid, password minimal 6, role internal, semuanya wajib. Input `{"name":"Siti Rahma","email":"siti@example.com","password":"Admin123!","role":"SALES"}`. Hasil layanan:

```json
{
  "id": "66666666-6666-4666-8666-666666666666",
  "name": "Siti Rahma",
  "email": "siti@example.com",
  "role": "SALES",
  "isActive": true,
  "createdAt": "2026-09-24T08:00:00.000Z"
}
```

**Pembaruan pengguna:** name/email/role/isActive opsional. Input `{"name":"Siti Rahma","email":"siti@example.com","role":"MANAGER","isActive":true}`. Hasil layanan:

```json
{
  "id": "66666666-6666-4666-8666-666666666666",
  "name": "Siti Rahma",
  "email": "siti@example.com",
  "role": "MANAGER",
  "isActive": true,
  "updatedAt": "2026-09-24T09:00:00.000Z"
}
```

**Profil sendiri:** name/email/password/imageUrl opsional; imageUrl berawalan /uploads/. Input `{"name":"Siti Rahma","email":"siti@example.com","password":"PasswordBaru123!","imageUrl":"/uploads/users/siti.jpg"}`. Password di-hash; penggantian gambar memanggil penghapusan gambar lama. Hasil layanan:

```json
{
  "id": "66666666-6666-4666-8666-666666666666",
  "name": "Siti Rahma",
  "email": "siti@example.com",
  "imageUrl": "/uploads/users/siti.jpg",
  "role": "MANAGER",
  "updatedAt": "2026-09-24T09:00:00.000Z"
}
```

**Status pengguna:** isActive boolean wajib. Input `{"isActive":false}`. Hasil layanan:

```json
{
  "id": "66666666-6666-4666-8666-666666666666",
  "name": "Siti Rahma",
  "email": "siti@example.com",
  "role": "MANAGER",
  "isActive": false,
  "updatedAt": "2026-09-24T09:00:00.000Z"
}
```

## 9. Ketentuan dashboard

Dashboard user: **GET**, header **H-U**, role **M**, tanpa body atau parameter path. Dashboard customer: **GET**, header **H-C**, identitas CUSTOMER, tanpa body atau parameter path. Jangan mengirim customerId; ID berasal dari token. Semua handler dashboard aktif yang tercatat tidak membaca query startDate/endDate/page/limit. Semua respons berhasil 200. Satu file customer/activity kosong dan tidak mempunyai kontrak endpoint.

### 9.1 GET /api/dashboard/user/summary

Header **H-U**; role **M**; tanpa body/parameter. Respons **200**:

```json
{
  "success": true,
  "message": "Dashboard summary berhasil diambil",
  "data": {
    "customer": { "total": 120, "active": 110, "newThisMonth": 15 },
    "product": { "total": 80, "active": 75, "lowStock": 12 },
    "transaction": { "total": 350, "today": 8, "month": 60 },
    "sales": { "today": 2400000, "month": 18000000 }
  }
}
```

Total customer/produk termasuk nonaktif; active berdasarkan isActive. newThisMonth berdasarkan createdAt sejak awal bulan. lowStock berarti stok 10 atau kurang, termasuk produk nonaktif. Hitungan transaksi/penjualan hanya COMPLETED sekaligus PAID, memakai transactionDate untuk hari/bulan. Nominal berupa angka.

### 9.2 GET /api/dashboard/user/sales

Header **H-U**; role **M**; tanpa body/parameter. Respons **200**:

```json
{
  "success": true,
  "message": "Dashboard sales berhasil diambil",
  "data": {
    "overview": {
      "today": 2400000,
      "month": 18000000,
      "averageTransaction": 300000
    },
    "trend": [
      { "month": "Aug 2026", "sales": 12000000, "transaction": 40 },
      { "month": "Sep 2026", "sales": 18000000, "transaction": 60 }
    ],
    "paymentMethod": [
      { "method": "CASH", "total": 60, "amount": 18000000 },
      { "method": "QRIS", "total": 40, "amount": 12000000 }
    ],
    "topProducts": [
      {
        "productId": "22222222-2222-4222-8222-222222222222",
        "productName": "Kopi Arabika",
        "quantity": 100,
        "sales": 5000000
      }
    ]
  }
}
```

Semua penjualan memakai COMPLETED dan PAID. today/month sejak awal hari/bulan; averageTransaction rata-rata bulan berjalan, 0 jika kosong. trend mulai tanggal 1 pada bulan 11 bulan sebelum bulan berjalan, dikelompokkan per bulan; bulan kosong tidak otomatis muncul, urutan tidak ditetapkan eksplisit. paymentMethod seluruh periode, total jumlah transaksi, amount nominal. topProducts maksimal 10 menurut unit terbesar; sales penjumlahan subtotal.

### 9.3 GET /api/dashboard/user/customers

Header **H-U**; role **M**; tanpa body/parameter. Respons **200**:

```json
{
  "success": true,
  "message": "Dashboard customer berhasil diambil",
  "data": {
    "overview": {
      "total": 120,
      "active": 110,
      "inactive": 10,
      "newThisMonth": 15
    },
    "membership": [
      { "level": "BRONZE", "total": 60 },
      { "level": "SILVER", "total": 35 },
      { "level": "GOLD", "total": 20 },
      { "level": "PLATINUM", "total": 5 }
    ],
    "growth": [
      { "month": "Aug 2026", "total": 10 },
      { "month": "Sep 2026", "total": 15 }
    ],
    "topCustomers": [
      {
        "customerId": "11111111-1111-4111-8111-111111111111",
        "name": "Budi Santoso",
        "totalSpent": 18000000,
        "transactionCount": 24
      }
    ]
  }
}
```

membership termasuk customer nonaktif. growth mulai awal bulan 11 bulan sebelum bulan berjalan. topCustomers maksimal 10 berdasarkan belanja terbesar dari transaksi COMPLETED dan PAID, bukan field Customer.totalSpent; transactionCount menggunakan filter yang sama. Membership/bulan tanpa record tidak otomatis muncul.

### 9.4 GET /api/dashboard/user/products

Header **H-U**; role **M**; tanpa body/parameter. Respons **200**:

```json
{
  "success": true,
  "message": "Dashboard product berhasil diambil",
  "data": {
    "overview": { "total": 80, "active": 75, "inactive": 5, "lowStock": 12 },
    "categoryDistribution": [
      { "category": "Minuman", "total": 50 },
      { "category": "Makanan", "total": 30 }
    ],
    "topSellingProducts": [
      {
        "productId": "22222222-2222-4222-8222-222222222222",
        "name": "Kopi Arabika",
        "quantity": 100,
        "revenue": 5000000
      }
    ],
    "slowMovingProducts": [
      {
        "productId": "77777777-7777-4777-8777-777777777777",
        "name": "Teh Melati",
        "stock": 20,
        "soldQuantity": 0
      }
    ]
  }
}
```

lowStock stok 10 atau kurang, tanpa filter aktif. Distribusi kategori seluruh produk. Penjualan hanya COMPLETED dan PAID; topSellingProducts maksimal 10 menurut unit; revenue penjumlahan subtotal. slowMovingProducts maksimal 10 produk aktif dengan jumlah unit terjual memenuhi filter masih 0. Tidak ada pembatasan periode.

### 9.5 GET /api/dashboard/user/inventory

Header **H-U**; role **M**; tanpa body/parameter. Handler memanggil getUserDashboardInventory. Berhasil 200, pesan `Dashboard inventory berhasil diambil`. Struktur data inventory.service.ts/inventory.types.ts belum terverifikasi. Tidak disediakan JSON rekaan. Bagian inventory pada /report bukan pengganti respons endpoint ini.

### 9.6 GET /api/dashboard/user/loyalty

Header **H-U**; role **M**; tanpa body/parameter. Respons **200**:

```json
{
  "success": true,
  "message": "Dashboard loyalty berhasil diambil",
  "data": {
    "overview": {
      "totalMember": 100,
      "totalPoints": 25000,
      "averagePoints": 250,
      "activeMember": 95
    },
    "pointActivity": [
      { "type": "EARN", "totalPoints": 30000, "totalTransaction": 300 },
      { "type": "ROLLBACK", "totalPoints": 5000, "totalTransaction": 20 }
    ],
    "topCustomers": [
      {
        "customerId": "11111111-1111-4111-8111-111111111111",
        "customerName": "Budi Santoso",
        "membership": "GOLD",
        "points": 1800
      }
    ],
    "trend": [
      { "month": "Aug 2026", "points": 10000 },
      { "month": "Sep 2026", "points": 15000 }
    ]
  }
}
```

Member berarti akun loyalty. totalPoints saldo seluruh akun; averagePoints rata-rata, 0 bila tanpa akun. activeMember adalah akun milik customer aktif. pointActivity.totalTransaction menghitung record histori, bukan transaksi unik. topCustomers maksimal 10 saldo terbesar, tidak hanya customer aktif. Tren mulai awal bulan 11 bulan sebelumnya; EARN menambah dan ROLLBACK mengurangi, sehingga nilai bulanan bisa negatif.

### 9.7 GET /api/dashboard/user/report

Header **H-U**; role **M**; tanpa body/parameter. Respons **200**:

```json
{
  "success": true,
  "message": "Dashboard report berhasil diambil",
  "data": {
    "sales": {
      "totalTransaction": 100,
      "totalRevenue": 30000000,
      "averageTransaction": 300000
    },
    "transactionStatus": [
      { "status": "PENDING", "total": 5 },
      { "status": "PROCESSING", "total": 3 },
      { "status": "COMPLETED", "total": 100 },
      { "status": "CANCELLED", "total": 2 }
    ],
    "customer": {
      "totalCustomer": 120,
      "newCustomer": 15,
      "activeCustomer": 110
    },
    "product": { "totalProduct": 80, "activeProduct": 75, "lowStock": 12 },
    "inventory": { "stock": 1500, "stockValue": 75000000 }
  }
}
```

Sales seluruh periode dengan COMPLETED dan PAID. transactionStatus semua transaksi tanpa filter pembayaran; status tanpa record tidak otomatis ditambahkan. newCustomer sejak awal bulan; lowStock stok 10 atau kurang. inventory seluruh produk termasuk nonaktif; stock total unit, stockValue penjumlahan stok dikali harga produk, bukan harga modal.

### 9.8 GET /api/dashboard/user/audit

Header **H-U**; role **M**; tanpa body/parameter. Respons **200**:

```json
{
  "success": true,
  "message": "Dashboard audit berhasil diambil",
  "data": {
    "overview": { "totalActivity": 500, "todayActivity": 12, "activeUser": 8 },
    "moduleActivity": [
      { "module": "PRODUCT", "total": 200 },
      { "module": "TRANSACTION", "total": 300 }
    ],
    "actionActivity": [
      { "action": "CREATE", "total": 350 },
      { "action": "UPDATE", "total": 150 }
    ],
    "recentActivity": [
      {
        "id": "88888888-8888-4888-8888-888888888888",
        "userName": "Admin Retail",
        "module": "PRODUCT",
        "action": "CREATE",
        "description": "Membuat produk Kopi Arabika",
        "createdAt": "2026-09-24T08:00:00.000Z"
      }
    ]
  }
}
```

Total/today dari audit log; today memakai createdAt sejak awal hari. activeUser jumlah akun internal aktif, bukan pengguna daring. Rekap berdasarkan modul/aksi. recentActivity maksimal 10 audit terbaru; userName dari relasi pengguna.

### 9.9 GET /api/dashboard/user/team-performance

Header **H-U**; role **M**; tanpa body/parameter. Contoh respons **200** mengikuti kontrak tipe hasil layanan:

```json
{
  "success": true,
  "message": "Dashboard team performance berhasil diambil",
  "data": {
    "overview": {
      "totalStaff": 2,
      "totalRevenue": 12000000,
      "totalTransaction": 40,
      "averageRevenue": 6000000
    },
    "ranking": [
      {
        "userId": "33333333-3333-4333-8333-333333333333",
        "name": "Siti Rahma",
        "role": "SALES",
        "transaction": 25,
        "revenue": 7500000,
        "customer": 15
      },
      {
        "userId": "66666666-6666-4666-8666-666666666666",
        "name": "Andi Pratama",
        "role": "MANAGER",
        "transaction": 15,
        "revenue": 4500000,
        "customer": 10
      }
    ],
    "topProducts": [
      {
        "userName": "Siti Rahma",
        "productName": "Kopi Arabika",
        "quantity": 40
      }
    ]
  }
}
```

Staf yang dianalisis: akun aktif SALES/MANAGER/ADMIN/SUPER_ADMIN; CUSTOMER_SERVICE tidak termasuk. Transaksi hanya COMPLETED tanpa syarat PAID, seluruh periode. customer jumlah customer unik per staf. ranking pendapatan terbesar. averageRevenue total pendapatan dibagi seluruh staf terpilih, termasuk tanpa transaksi. Field topProducts diketahui dari tipe; batas jumlah dan pengelompokan akhir belum terverifikasi.

## 10. Dashboard customer

### 10.1 GET /api/dashboard/customer/summary

Header **H-C**; tanpa body/parameter. Respons **200**:

```json
{
  "success": true,
  "message": "Dashboard customer summary berhasil diambil",
  "data": {
    "overview": {
      "customerName": "Budi Santoso",
      "membership": "SILVER",
      "totalSpent": 6000000,
      "totalTransaction": 20,
      "loyaltyPoints": 600
    },
    "lastTransaction": {
      "invoiceNumber": "INV-20260924-1234",
      "amount": 300000,
      "date": "2026-09-24T08:00:00.000Z"
    },
    "favoriteProduct": { "productName": "Kopi Arabika", "totalPurchase": 30 },
    "customerSince": "2026-01-10T07:00:00.000Z"
  }
}
```

totalSpent dari Customer.totalSpent; totalTransaction hanya COMPLETED tanpa PAID; loyaltyPoints saldo, 0 bila akun tidak ada. lastTransaction terbaru menurut createdAt tanpa filter status/pembayaran; date juga createdAt. Favorite product berdasarkan unit transaksi COMPLETED, dikelompokkan menurut nama produk (nama sama dapat tergabung). totalPurchase jumlah unit. customerSince waktu pendaftaran. Tanpa transaksi: lastTransaction dan favoriteProduct null; contoh customer baru:

```json
{
  "success": true,
  "message": "Dashboard customer summary berhasil diambil",
  "data": {
    "overview": {
      "customerName": "Budi Santoso",
      "membership": "BRONZE",
      "totalSpent": 0,
      "totalTransaction": 0,
      "loyaltyPoints": 0
    },
    "lastTransaction": null,
    "favoriteProduct": null,
    "customerSince": "2026-09-24T07:00:00.000Z"
  }
}
```

### 10.2 GET /api/dashboard/customer/transaction

Header **H-C**; tanpa body/parameter. Path memakai transaction tunggal. Respons **200**:

```json
{
  "success": true,
  "message": "Riwayat transaksi customer berhasil diambil",
  "data": {
    "summary": { "totalTransaction": 1, "totalSpent": 100000 },
    "transactions": [
      {
        "id": "44444444-4444-4444-8444-444444444444",
        "invoiceNumber": "INV-20260924-1234",
        "transactionDate": "2026-09-24T08:00:00.000Z",
        "totalAmount": 100000,
        "paymentMethod": "CASH",
        "paymentStatus": "PAID",
        "status": "COMPLETED",
        "items": [
          {
            "productId": "22222222-2222-4222-8222-222222222222",
            "productName": "Kopi Arabika",
            "quantity": 2,
            "price": 50000,
            "subtotal": 100000
          }
        ]
      }
    ]
  }
}
```

Semua status, transactionDate terbaru, tanpa pagination. summary menghitung seluruh hasil termasuk batal/belum dibayar. Nominal berupa angka. Tanpa transaksi:

```json
{
  "success": true,
  "message": "Riwayat transaksi customer berhasil diambil",
  "data": {
    "summary": { "totalTransaction": 0, "totalSpent": 0 },
    "transactions": []
  }
}
```

### 10.3 GET /api/dashboard/customer/purchase

Header **H-C**; tanpa body/parameter. Respons **200**:

```json
{
  "success": true,
  "message": "Dashboard purchase customer berhasil diambil",
  "data": {
    "overview": {
      "totalTransaction": 4,
      "totalSpent": 600000,
      "averageTransaction": 150000
    },
    "spendingTrend": [
      { "month": "Aug 2026", "spent": 200000 },
      { "month": "Sep 2026", "spent": 400000 }
    ],
    "favoriteCategory": [
      { "category": "Minuman", "totalPurchase": 8 },
      { "category": "Makanan", "totalPurchase": 4 }
    ],
    "favoriteProduct": [
      {
        "productId": "22222222-2222-4222-8222-222222222222",
        "productName": "Kopi Arabika",
        "quantity": 8
      },
      {
        "productId": "77777777-7777-4777-8777-777777777777",
        "productName": "Biskuit",
        "quantity": 4
      }
    ]
  }
}
```

Hanya COMPLETED tanpa PAID; totalSpent dihitung dari transaksi. Tren memakai createdAt. favoriteCategory jumlah unit, urutan terbesar; favoriteProduct maksimal 10 berdasarkan unit, dikelompokkan per ID. Seluruh periode: variabel startDate dibuat tetapi tidak digunakan pada query/pengelompokan. Bila kosong, overview bernilai 0 dan ketiga array kosong.

### 10.4 GET /api/dashboard/customer/loyalty

Header **H-C**; tanpa body/parameter. Respons **200**:

```json
{
  "success": true,
  "message": "Dashboard loyalty customer berhasil diambil",
  "data": {
    "overview": { "points": 150, "totalEarned": 200, "totalRollback": 50 },
    "membership": { "current": "SILVER", "next": "GOLD", "progress": 50 },
    "history": [
      {
        "type": "ROLLBACK",
        "points": 50,
        "description": "Rollback poin transaksi yang dibatalkan",
        "date": "2026-09-24T09:00:00.000Z"
      },
      {
        "type": "EARN",
        "points": 200,
        "description": "Poin pembelian",
        "date": "2026-09-23T08:00:00.000Z"
      }
    ]
  }
}
```

points saldo; totalEarned/totalRollback penjumlahan histori per jenis, rollback ditampilkan positif sesuai record. Semua histori terbaru dahulu, tanpa pagination; description dapat null. Tanpa akun, overview seluruhnya 0 dan history kosong. Progress diatur tetap: BRONZE → SILVER 25; SILVER → GOLD 50; GOLD → PLATINUM 75; PLATINUM → null 100. Bukan perhitungan dari belanja/poin.

### 10.5 GET /api/dashboard/customer/membership

Header **H-C**; tanpa body/parameter. Respons **200**:

```json
{
  "success": true,
  "message": "Dashboard membership customer berhasil diambil",
  "data": {
    "currentLevel": "SILVER",
    "nextLevel": "GOLD",
    "progress": {
      "currentSpent": 6000000,
      "targetSpent": 15000000,
      "remaining": 9000000,
      "percentage": 40
    },
    "benefits": ["Diskon member 5%", "Promo khusus member"]
  }
}
```

Konfigurasi: BRONZE target SILVER 5000000, manfaat `Member Bronze` dan `Promo reguler`; SILVER target GOLD 15000000, manfaat `Diskon member 5%` dan `Promo khusus member`; GOLD target PLATINUM 30000000, manfaat `Diskon member 10%` dan `Prioritas promo`; PLATINUM next null, target sama dengan totalSpent, manfaat `Diskon member 15%`, `VIP customer`, `Prioritas layanan`.

currentSpent dari Customer.totalSpent; remaining selisih target-belanja minimum 0; percentage belanja/target ×100 dibulatkan, maksimum 100. Perhitungan bukan kemajuan setelah mengurangi ambang level sebelumnya. Contoh Platinum:

```json
{
  "success": true,
  "message": "Dashboard membership customer berhasil diambil",
  "data": {
    "currentLevel": "PLATINUM",
    "nextLevel": null,
    "progress": {
      "currentSpent": 35000000,
      "targetSpent": 35000000,
      "remaining": 0,
      "percentage": 100
    },
    "benefits": ["Diskon member 15%", "VIP customer", "Prioritas layanan"]
  }
}
```

Endpoint hanya membaca status/manfaat. Teks diskon tidak membuktikan penerapan diskon otomatis pada transaksi.

### 10.6 GET /api/dashboard/customer/recommendation

Header **H-C**; tanpa body/parameter. Respons **200**:

```json
{
  "success": true,
  "message": "Recommendation customer berhasil diambil",
  "data": {
    "recommendations": [
      {
        "productId": "77777777-7777-4777-8777-777777777777",
        "productName": "Teh Melati",
        "category": "Minuman",
        "price": 25000,
        "reason": "Karena Anda sering membeli kategori Minuman"
      }
    ]
  }
}
```

Kategori favorit dihitung dari jumlah record item transaksi COMPLETED, bukan unit. Pilih produk aktif kategori tersebut yang belum dibeli pada transaksi selesai, stok terbesar, maksimal 10. Tidak mensyaratkan stok positif. Customer tanpa riwayat selesai mendapat produk aktif stok terbesar dengan reason `Produk populer untuk customer baru`; kata populer bukan berdasarkan penjualan. Contoh:

```json
{
  "success": true,
  "message": "Recommendation customer berhasil diambil",
  "data": {
    "recommendations": [
      {
        "productId": "22222222-2222-4222-8222-222222222222",
        "productName": "Kopi Arabika",
        "category": "Minuman",
        "price": 50000,
        "reason": "Produk populer untuk customer baru"
      }
    ]
  }
}
```

Tidak ada kandidat: `{"success":true,"message":"Recommendation customer berhasil diambil","data":{"recommendations":[]}}`.

### 10.7 /api/dashboard/customer/activity — belum diimplementasikan

File `src/app/api/dashboard/customer/activity/route.ts` kosong pada pembacaan sebelumnya. Belum ada metode, header wajib, pemeriksaan akses, body, atau respons berhasil yang dapat dinyatakan. Jangan mengandalkan endpoint ini sebelum handler ditambahkan.

## 11. Kesalahan dan konsistensi dashboard

Contoh token invalid, 401: `{"success":false,"message":"Invalid token","errors":[]}`. Identitas/role salah, 403: `{"success":false,"message":"Forbidden","errors":[]}`. Pesan autentikasi dapat berbeda menurut penyebab. Customer summary/loyalty/membership melempar Error biasa `Customer tidak ditemukan`, sehingga masuk penanganan kesalahan umum; jangan didokumentasikan otomatis sebagai 404. Transaction/purchase/recommendation tidak memiliki pemeriksaan keberadaan customer yang sama.

Perbedaan hitungan: user summary/sales, penjualan report, top customer, dan penjualan produk memakai COMPLETED+PAID; team-performance dan customer purchase memakai COMPLETED saja; customer transaction seluruh status; transaksi terakhir customer summary seluruh status; totalSpent customer summary/membership dari field customer. Karena filter berbeda, angka antardashboard dapat berbeda. Batas hari/bulan mengikuti waktu lokal server. Beberapa tren memakai createdAt, penjualan user memakai transactionDate; label bulan mengikuti en-US. Batas stok rendah daftar produk adalah kurang dari 10, sedangkan dashboard adalah 10 atau kurang.

## 12. Pengujian token

### GET /api/protected

Header **H-U** dengan token yang diterima authenticate; tanpa body. Berhasil 200 dengan message `Authorized`; data berisi message `Protected API accessed` dan user hasil authenticate. Struktur lengkap user belum terverifikasi. Middleware tanpa token mengembalikan 401 `{"success":false,"message":"Unauthorized"}`; token invalid 401 `{"success":false,"message":"Invalid token"}`. Kedua respons middleware ini tidak memuat errors.

## 13. Model data dan fungsi pendukung

Model yang dicatat: User, Customer, CustomerActivity, Product, Transaction, TransactionItem, AuditLog, RefreshToken, InventoryTransaction, LoyaltyAccount, LoyaltyHistory. Customer memiliki banyak transaksi/aktivitas dan maksimal satu akun loyalty. Transaksi memiliki banyak item serta terkait customer dan user. Item terkait produk. Pergerakan stok/histori loyalty dapat terkait transaksi. Refresh token dapat terkait user atau customer.

Enum inventori: STOCK_OUT/STOCK_IN/ADJUSTMENT. Enum histori loyalty: EARN/ROLLBACK. Skema penyesuaian inventori menerima productId UUID, quantity integer bukan 0 (negatif diterima), description. Contoh input `{"productId":"22222222-2222-4222-8222-222222222222","quantity":-2,"description":"Koreksi hasil stok opname"}`. Keberadaan skema/layanan tidak membuktikan keberadaan route HTTP penyesuaian inventori.

## 14. Temuan implementasi

Otorisasi belum merata pada route customer, segmentasi, dan aktivitas. POST aktivitas mengambil userId dari klien. Role SALES dapat memperbarui customer dengan skema yang menerima membership dan isActive. Penonaktifan akun belum tentu langsung membatalkan access token karena pemeriksaan role yang tercatat menggunakan payload token, sedangkan login/refresh memeriksa status akun. Logout tidak mencabut access token secara eksplisit.

Konfigurasi adapter MariaDB pada src/lib/prisma.ts dicatat memakai konfigurasi lokal langsung, sedangkan konfigurasi Prisma memakai DATABASE_URL; perubahan variabel saja belum tentu mengubah koneksi aplikasi. Terdapat lebih dari satu utilitas JWT. Pesan exception dapat dikirim ke klien melalui penanganan kesalahan umum. Validasi tanggal dan imageUrl tidak konsisten antara registrasi dan pembaruan. Tipe layanan tidak selalu sama dengan field yang diterima skema route. Pembatalan transaksi tidak sama dengan refund pembayaran, dan perpindahan kembali dari CANCELLED perlu ditinjau.

## 15. Daftar kontrak yang belum tertutup

Dokumen telah menyatukan isi kedua jawaban, tetapi belum membuktikan seluruh kontrak proyek lengkap. Bagian yang masih perlu pembacaan sumber: respons dashboard user inventory; akhir pengelompokan topProducts team-performance; respons createTransaction dan deleteProduct; respons layanan customer; handler CRUD/status/profil pengguna; daftar/pembuatan/profil/pemulihan/membership customer dan aktivitas per customer; status aktivitas; audit log non-dashboard; unggahan gambar customer/produk/user (termasuk metode, field multipart, MIME, batas ukuran); perhitungan segmentasi; alur JWT aktif; serta aturan bisnis pembuatan transaksi. Customer dashboard activity memerlukan implementasi, bukan sekadar dokumentasi.

Tidak ada path, body, header wajib, atau contoh respons yang ditambahkan untuk kontrak yang belum terbaca. Bagian ini membedakan kelengkapan penggabungan dokumen dari kelengkapan verifikasi seluruh proyek.
