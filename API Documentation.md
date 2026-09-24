# Dokumentasi API Retail CRM

Dokumentasi ini mengacu pada `repomix-output.xml` dan mencakup seluruh rute pada direktori `src/app/api`, termasuk rute yang tidak mencantumkan handler HTTP.

## 1. Ketentuan umum

**Awalan rute:** `/api`

Permintaan dengan body JSON menggunakan:

```http
Content-Type: application/json
```

Permintaan yang membutuhkan autentikasi menggunakan:

```http
Authorization: Bearer <accessToken>
```

Parameter `{id}` pada alamat endpoint diganti dengan ID data yang dituju.

### Autentikasi

API menggunakan dua jenis identitas:

| Identitas | Penggunaan |
|---|---|
| `USER` | Pengguna internal |
| `CUSTOMER` | Pelanggan |

Peran internal yang digunakan:

`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `SALES`, dan `CUSTOMER_SERVICE`.

Untuk mempersingkat tabel endpoint, digunakan kelompok berikut:

| Kode | Peran |
|---|---|
| A | `SUPER_ADMIN` |
| B | `SUPER_ADMIN`, `ADMIN` |
| C | `SUPER_ADMIN`, `ADMIN`, `MANAGER` |
| D | `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `SALES` |
| E | `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `SALES`, `CUSTOMER_SERVICE` |

Keterangan akses pada tabel merujuk pada pemeriksaan di handler. Tanda **—** berarti detail tersebut tidak ditetapkan dalam dokumentasi ini; rutenya tetap dicantumkan.

### Format respons

Respons berhasil menggunakan bentuk:

```json
{
  "success": true,
  "message": "Pesan keberhasilan",
  "data": {}
}
```

`data` dapat berupa objek, daftar, atau `null`, sesuai operasi.

Respons gagal menggunakan bentuk:

```json
{
  "success": false,
  "message": "Pesan kesalahan",
  "errors": []
}
```

## 2. Autentikasi dan sesi

| Metode | Endpoint | Fungsi |
|---|---|---|
| `POST` | `/api/auth/login/user` | Login pengguna internal |
| `POST` | `/api/auth/login/customer` | Login pelanggan |
| `POST` | `/api/auth/register/customer` | Registrasi pelanggan |
| `POST` | `/api/auth/refresh` | Memperbarui token sesi |
| `POST` | `/api/auth/logout` | Mengakhiri sesi refresh token |
| `GET` | `/api/protected` | Mengambil identitas dari token valid |

### 2.1 Login pengguna internal

**`POST /api/auth/login/user`**

Body:

```json
{
  "email": "admin@example.com",
  "password": "contoh-password"
}
```

| Properti | Tipe | Ketentuan |
|---|---|---|
| `email` | string | Wajib, format email |
| `password` | string | Wajib, minimal 6 karakter |

**Respons berhasil:** `200`, pesan `Login berhasil`.

Isi `data`:

- `accessToken`
- `refreshToken`
- `user`: `id`, `name`, `email`, `imageUrl`, `role`, `isActive`

Kesalahan khusus:

| Status | Pesan |
|---|---|
| `401` | `Email atau password salah` |
| `403` | `User tidak aktif` |

### 2.2 Login pelanggan

**`POST /api/auth/login/customer`**

Body:

```json
{
  "email": "pelanggan@example.com",
  "password": "contoh-password"
}
```

Email wajib berformat email dan password minimal 6 karakter.

**Respons berhasil:** `200`, pesan `Login customer berhasil`.

Isi `data`:

- `accessToken`
- `refreshToken`
- `customer`: `id`, `customerCode`, `name`, `phone`, `email`, `imageUrl`, `membership`

Kesalahan khusus:

| Status | Pesan |
|---|---|
| `401` | `Email atau nomor HP salah` |
| `401` | `Password salah` |
| `403` | `Customer tidak aktif` |

Input login menggunakan `email`, meskipun salah satu pesan kesalahannya menyebut nomor HP.

### 2.3 Registrasi pelanggan

**`POST /api/auth/register/customer`**

| Properti | Tipe | Wajib | Ketentuan |
|---|---|---|---|
| `name` | string | Ya | Minimal 3 karakter |
| `email` | string | Ya | Format email |
| `phone` | string | Ya | Minimal 10 karakter |
| `password` | string | Ya | Minimal 6 karakter |
| `imageUrl` | string | Tidak | Lokasi gambar |
| `gender` | string | Tidak | `MALE`, `FEMALE`, `OTHER` |
| `birthDate` | string | Tidak | Diubah menjadi tanggal oleh layanan |
| `address` | string | Tidak | Alamat |
| `city` | string | Tidak | Kota |

Contoh body:

```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "phone": "081234567890",
  "password": "contoh-password",
  "gender": "MALE",
  "birthDate": "1995-05-20",
  "address": "Jalan Melati 10",
  "city": "Bandung"
}
```

**Respons berhasil:** `200`, pesan `Registrasi customer berhasil`.

Isi `data`: `id`, `customerCode`, `name`, `email`, `phone`, `imageUrl`, `membership`, dan `createdAt`.

Keanggotaan awal adalah `BRONZE`, dengan saldo poin loyalitas awal `0`. Email atau nomor telepon yang sudah terdaftar menghasilkan konflik `409`.

### 2.4 Memperbarui token

**`POST /api/auth/refresh`**

Body:

```json
{
  "refreshToken": "<refreshToken>"
}
```

Body divalidasi menggunakan `refreshTokenSchema`.

**Respons berhasil:** `200`, pesan `Token berhasil diperbarui`.

Layanan memeriksa refresh token dan akun, menghapus token lama, lalu menghasilkan pasangan token baru. Gunakan token baru untuk permintaan berikutnya.

### 2.5 Logout

**`POST /api/auth/logout`**

Body:

```json
{
  "refreshToken": "<refreshToken>"
}
```

`refreshToken` wajib berupa string minimal 10 karakter.

Respons berhasil:

```json
{
  "success": true,
  "message": "Logout berhasil",
  "data": null
}
```

Refresh token yang tidak ditemukan menghasilkan `404` dengan pesan `Refresh token tidak ditemukan`.

### 2.6 Pemeriksaan token

**`GET /api/protected`**

Memerlukan token Bearer valid.

**Respons berhasil:** `200`, pesan `Authorized`.

Isi `data` memuat `message` dengan nilai `Protected API accessed` dan `user` berisi identitas dari token.

## 3. Pengguna internal

| Metode | Endpoint | Fungsi | Akses di handler |
|---|---|---|---|
| `GET` | `/api/users` | Daftar pengguna | A |
| `POST` | `/api/users` | Membuat pengguna | A |
| `GET` | `/api/users/{id}` | Detail pengguna | `getCurrentUser()` |
| `PUT` | `/api/users/{id}` | Memperbarui pengguna | `getCurrentUser()` |
| `DELETE` | `/api/users/{id}` | Menonaktifkan pengguna | `getCurrentUser()` |
| `PATCH` | `/api/users/{id}/status` | Mengubah status aktif | Tidak ada pemanggilan autentikasi |
| `GET` | `/api/users/profile` | Profil pengguna sendiri | `USER` |
| `PUT` | `/api/users/profile` | Memperbarui profil sendiri | `USER` |

### Daftar dan pembuatan pengguna

**`GET /api/users`** memanggil `getUsers()` tanpa parameter.

Pesan berhasil: `User list berhasil diambil`.

**`POST /api/users`** menerima JSON sesuai `createUserSchema`. ID pembuat diambil dari token.

Respons berhasil: `201`, pesan `User berhasil dibuat`.

### Detail dan perubahan pengguna

Parameter `{id}` diperiksa menggunakan `userIdSchema`.

| Operasi | Body | Pesan berhasil |
|---|---|---|
| `GET /api/users/{id}` | Tidak diperlukan | `Detail user berhasil diambil` |
| `PUT /api/users/{id}` | Sesuai `updateUserSchema` | `User berhasil diperbarui` |
| `DELETE /api/users/{id}` | Tidak dibaca handler | `User berhasil dinonaktifkan` |

Penghapusan menggunakan penonaktifan data (*soft delete*). Detail pengguna yang tidak ditemukan menghasilkan `404`, pesan `User tidak ditemukan`.

### Status pengguna

**`PATCH /api/users/{id}/status`**

Body:

```json
{
  "isActive": true
}
```

Body diperiksa menggunakan `updateStatusSchema`, lalu `isActive` diteruskan ke `updateUserStatus()`.

Pesan berhasil: `Status user berhasil diperbarui`.

### Profil pengguna

**`GET /api/users/profile`** mengambil profil berdasarkan ID pengguna dari token.

**`PUT /api/users/profile`** menerima JSON sesuai `updateUserProfileSchema`.

Pesan berhasil masing-masing:

- `Profile user berhasil diambil`
- `Profile user berhasil diperbarui`

## 4. Pelanggan

| Metode | Endpoint | Fungsi | Akses di handler |
|---|---|---|---|
| `GET` | `/api/customers` | Daftar pelanggan | E |
| `POST` | `/api/customers` | Membuat pelanggan | D |
| — | `/api/customers/{id}` | Rute pelanggan berdasarkan ID | — |
| — | `/api/customers/{id}/activities` | Rute aktivitas pelanggan | — |
| `GET` | `/api/customers/{id}/loyalty` | Loyalitas pelanggan | Tidak ada pemanggilan autentikasi |
| `PATCH` | `/api/customers/{id}/restore` | Mengaktifkan kembali pelanggan | C |
| `GET` | `/api/customers/{id}/transactions` | Riwayat transaksi pelanggan | Tidak ada pemanggilan autentikasi |
| `GET` | `/api/customers/membership` | Pelanggan berdasarkan keanggotaan | Tidak ada pemanggilan autentikasi |
| `GET` | `/api/customers/profile` | Profil pelanggan sendiri | `CUSTOMER` |
| `PUT` | `/api/customers/profile` | Memperbarui profil sendiri | `CUSTOMER` |
| `GET` | `/api/customers/segment` | Segmentasi pelanggan | Tidak ada pemanggilan autentikasi |
| `GET` | `/api/customers/segment/summary` | Ringkasan segmentasi | Tidak ada pemanggilan autentikasi |

### 4.1 Daftar pelanggan

**`GET /api/customers`**

| Parameter query | Fungsi | Nilai bawaan |
|---|---|---|
| `search` | Pencarian | — |
| `membership` | Filter keanggotaan | — |
| `gender` | Filter jenis kelamin | — |
| `city` | Filter kota | — |
| `sort` | Pengurutan | — |
| `page` | Halaman | `1` |
| `limit` | Jumlah data per halaman | `10` |
| `includeInactive` | Sertakan pelanggan nonaktif | `false` |

Contoh:

```http
GET /api/customers?search=Budi&city=Bandung&page=1&limit=10
```

`includeInactive` aktif hanya jika query bernilai persis `true`. Penggunaan `includeInactive=true` dibatasi untuk kelompok C.

Pesan berhasil: `Customer list berhasil diambil`.

### 4.2 Membuat pelanggan

**`POST /api/customers`**

Body JSON mengikuti `createCustomerSchema`. ID pengguna pembuat berasal dari token.

**Respons berhasil:** `201`, pesan `Customer berhasil dibuat`.

Skema pembuatan pelanggan internal dipisahkan dari skema registrasi pelanggan.

### 4.3 Mengaktifkan kembali pelanggan

**`PATCH /api/customers/{id}/restore`**

Parameter `{id}` divalidasi menggunakan `customerIdSchema`. Handler tidak membaca body.

Pesan berhasil: `Customer berhasil diaktifkan kembali`.

Isi `data`:

- `id`
- `customerCode`
- `name`
- `isActive`

| Status | Kondisi |
|---|---|
| `404` | Pelanggan tidak ditemukan |
| `400` | Pelanggan sudah aktif |

### 4.4 Pelanggan berdasarkan keanggotaan

**`GET /api/customers/membership?level=GOLD`**

| Parameter | Lokasi | Nilai |
|---|---|---|
| `level` | Query | `BRONZE`, `SILVER`, `GOLD`, `PLATINUM` |

Mengambil pelanggan aktif sesuai keanggotaan, diurutkan berdasarkan `totalSpent` menurun.

Data pelanggan memuat `id`, `customerCode`, `name`, `phone`, `membership`, `totalSpent`, dan `isActive`.

Pesan berhasil: `Customer membership berhasil diambil`.

### 4.5 Profil pelanggan

**`GET /api/customers/profile`**

Mengambil profil sesuai ID pelanggan dalam token.

Pesan berhasil: `Profile customer berhasil diambil`.

**`PUT /api/customers/profile`**

Body JSON mengikuti `updateCustomerProfileSchema`. Target perubahan berasal dari token pelanggan.

Pesan berhasil: `Profile customer berhasil diperbarui`.

### 4.6 Loyalitas pelanggan

**`GET /api/customers/{id}/loyalty`**

Mengambil hasil `getCustomerLoyalty(id)`.

Pesan berhasil: `Loyalty customer berhasil diambil`.

### 4.7 Riwayat transaksi pelanggan

**`GET /api/customers/{id}/transactions`**

Isi `data`:

| Properti | Isi |
|---|---|
| `customer` | `id`, `customerCode`, `name`, `isActive` |
| `summary.totalTransaction` | Jumlah transaksi |
| `summary.totalSpent` | Total nilai transaksi berstatus `COMPLETED` |
| `transactions` | Daftar transaksi beserta item dan produk |

Transaksi diurutkan berdasarkan `createdAt` menurun.

Pesan berhasil: `Riwayat transaksi customer berhasil diambil`.

### 4.8 Segmentasi pelanggan

| Endpoint | Layanan | Pesan berhasil |
|---|---|---|
| `/api/customers/segment` | `getCustomerSegments()` | `Customer segmentation berhasil diambil` |
| `/api/customers/segment/summary` | `getCustomerSegmentSummary()` | `Customer segment summary berhasil diambil` |

Keduanya menggunakan `GET` tanpa pembacaan body atau query pada handler.

## 5. Produk

| Metode | Endpoint | Fungsi | Akses |
|---|---|---|---|
| `GET` | `/api/products` | Daftar produk | D |
| `POST` | `/api/products` | Membuat produk | C |
| `GET` | `/api/products/{id}` | Detail produk | D |
| `PUT` | `/api/products/{id}` | Memperbarui produk | C |
| `DELETE` | `/api/products/{id}` | Menonaktifkan produk | C |

### 5.1 Daftar produk

**`GET /api/products`**

Parameter query: `search`, `category`, `status`, `stock`, `sort`, `page`, dan `limit`.

Nilai bawaan `page` adalah `1`, sedangkan `limit` adalah `10`.

Contoh:

```http
GET /api/products?search=kopi&category=Minuman&page=1&limit=10
```

Pesan berhasil: `Product list berhasil diambil`.

### 5.2 Membuat produk

**`POST /api/products`**

| Properti | Tipe | Wajib | Ketentuan |
|---|---|---|---|
| `sku` | string | Ya | Minimal 3 karakter |
| `name` | string | Ya | Minimal 3 karakter |
| `category` | string | Ya | Minimal 2 karakter |
| `price` | number | Ya | Lebih besar dari 0 |
| `stock` | integer | Tidak | Tidak negatif |
| `imageUrl` | string | Tidak | Diawali `/uploads/` |

Contoh body:

```json
{
  "sku": "KOP-001",
  "name": "Kopi Arabika",
  "category": "Minuman",
  "price": 25000,
  "stock": 100,
  "imageUrl": "/uploads/products/product-contoh.jpg"
}
```

**Respons berhasil:** `201`, pesan `Product berhasil dibuat`.

### 5.3 Detail produk

**`GET /api/products/{id}`**

Pesan berhasil: `Detail product berhasil diambil`.

Jika produk tidak ditemukan: `404`, pesan `Product tidak ditemukan`.

### 5.4 Memperbarui produk

**`PUT /api/products/{id}`**

Body JSON diperiksa menggunakan `updateProductSchema`. ID pengguna pengubah diambil dari token.

Pesan berhasil: `Product berhasil diperbarui`.

### 5.5 Menonaktifkan produk

**`DELETE /api/products/{id}`**

Memanggil `deleteProduct(id, user.id)` untuk penonaktifan produk.

Pesan berhasil: `Product berhasil dinonaktifkan`.

## 6. Transaksi

| Metode | Endpoint | Fungsi | Akses |
|---|---|---|---|
| `GET` | `/api/transactions` | Daftar transaksi | E |
| `POST` | `/api/transactions` | Membuat transaksi | D |
| — | `/api/transactions/{id}` | Rute transaksi berdasarkan ID | — |
| `PATCH` | `/api/transactions/{id}/status` | Memperbarui status transaksi | C |

### 6.1 Daftar transaksi

**`GET /api/transactions`**

Handler memanggil `getTransactions()` tanpa parameter query.

Daftar diurutkan dari transaksi terbaru dan menyertakan relasi pelanggan, pengguna, serta item produk.

Pesan berhasil: `Transaction list berhasil diambil`.

### 6.2 Membuat transaksi

**`POST /api/transactions`**

| Properti | Tipe | Wajib | Ketentuan |
|---|---|---|---|
| `customerId` | string | Ya | UUID |
| `paymentMethod` | string | Ya | `CASH`, `CARD`, `TRANSFER`, `EWALLET`, `QRIS` |
| `paymentStatus` | string | Tidak | `UNPAID`, `PAID`, `REFUND` |
| `notes` | string | Tidak | Catatan |
| `items` | array | Ya | Minimal 1 item |
| `items[].productId` | string | Ya | UUID |
| `items[].quantity` | integer | Ya | Lebih besar dari 0 |

Contoh body dengan ID ilustratif:

```json
{
  "customerId": "7e3b48b2-5516-4b58-a7d6-6ee2114ff001",
  "paymentMethod": "QRIS",
  "paymentStatus": "PAID",
  "notes": "Pembelian di toko",
  "items": [
    {
      "productId": "5f9b9da8-48aa-4b23-83bd-d6ff8456f001",
      "quantity": 2
    }
  ]
}
```

Harga dan subtotal dihitung oleh layanan berdasarkan produk. `paymentStatus` menggunakan `PAID` jika tidak dikirim. ID pengguna pembuat berasal dari token.

**Respons berhasil:** `201`, pesan `Transaksi berhasil dibuat`.

| Status | Kondisi |
|---|---|
| `404` | Pelanggan aktif tidak ditemukan |
| `404` | Produk tidak ditemukan atau tidak aktif |
| `400` | Stok produk tidak mencukupi |

### 6.3 Memperbarui status transaksi

**`PATCH /api/transactions/{id}/status`**

Body:

```json
{
  "status": "COMPLETED"
}
```

Nilai yang diterima:

`PENDING`, `PROCESSING`, `COMPLETED`, `CANCELLED`.

Pesan berhasil: `Status transaksi berhasil diperbarui`.

Transaksi yang tidak ditemukan menghasilkan `404`, pesan `Transaction tidak ditemukan`.

## 7. Aktivitas pelanggan

| Metode | Endpoint | Fungsi |
|---|---|---|
| `POST` | `/api/activities` | Membuat aktivitas pelanggan |
| `PATCH` | `/api/activities/{id}/status` | Memperbarui status aktivitas |

### 7.1 Membuat aktivitas

**`POST /api/activities`**

Body divalidasi menggunakan `createActivitySchema`. Properti yang diteruskan ke layanan:

| Properti | Keterangan |
|---|---|
| `customerId` | ID pelanggan |
| `userId` | ID pengguna |
| `type` | Jenis aktivitas |
| `subject` | Subjek |
| `description` | Deskripsi opsional menurut tipe input |

Jenis aktivitas pada tipe input:

`CALL`, `WHATSAPP`, `EMAIL`, `MEETING`, `COMPLAINT`, `NOTE`.

ID pengguna berasal dari body pada handler ini.

**Respons berhasil:** `201`, pesan `Aktivitas customer berhasil dibuat`.

### 7.2 Memperbarui status aktivitas

**`PATCH /api/activities/{id}/status`**

Parameter `{id}` menggunakan UUID.

Body:

```json
{
  "status": "DONE"
}
```

Nilai status aktivitas:

`PENDING`, `PROCESS`, `DONE`, `CANCELLED`.

Pesan berhasil: `Status aktivitas berhasil diperbarui`.

Status aktivitas menggunakan `PROCESS` dan `DONE`; status transaksi menggunakan `PROCESSING` dan `COMPLETED`.

## 8. Dasbor pelanggan

Endpoint berakses `CUSTOMER` menggunakan ID pelanggan dari token.

| Metode | Endpoint | Fungsi | Akses |
|---|---|---|---|
| — | `/api/dashboard/customer/activity` | Rute dasbor aktivitas | — |
| `GET` | `/api/dashboard/customer/loyalty` | Dasbor loyalitas | `CUSTOMER` |
| `GET` | `/api/dashboard/customer/membership` | Status keanggotaan | `CUSTOMER` |
| `GET` | `/api/dashboard/customer/purchase` | Analisis pembelian | `CUSTOMER` |
| `GET` | `/api/dashboard/customer/recommendation` | Rekomendasi pelanggan | `CUSTOMER` |
| `GET` | `/api/dashboard/customer/summary` | Ringkasan dasbor | `CUSTOMER` |
| `GET` | `/api/dashboard/customer/transaction` | Riwayat transaksi | `CUSTOMER` |

Handler `GET` di atas tidak membaca body atau query. Respons `data` berisi hasil layanan terkait.

| Bagian | Pesan berhasil |
|---|---|
| Loyalitas | `Dashboard loyalty customer berhasil diambil` |
| Keanggotaan | `Dashboard membership customer berhasil diambil` |
| Pembelian | `Dashboard purchase customer berhasil diambil` |
| Rekomendasi | `Recommendation customer berhasil diambil` |
| Ringkasan | `Dashboard customer summary berhasil diambil` |
| Transaksi | `Riwayat transaksi customer berhasil diambil` |

Rute `/api/dashboard/customer/activity` tetap tercakup. File rutenya dalam XML tidak mencantumkan metode, parameter, atau respons.

## 9. Dasbor pengguna internal

Semua endpoint berikut menggunakan **`GET`** dengan akses **kelompok C**.

| Endpoint | Fungsi |
|---|---|
| `/api/dashboard/user/audit` | Dasbor audit |
| `/api/dashboard/user/customers` | Dasbor pelanggan |
| `/api/dashboard/user/inventory` | Dasbor persediaan |
| `/api/dashboard/user/loyalty` | Dasbor loyalitas |
| `/api/dashboard/user/products` | Dasbor produk |
| `/api/dashboard/user/report` | Dasbor laporan |
| `/api/dashboard/user/sales` | Dasbor penjualan |
| `/api/dashboard/user/summary` | Ringkasan dasbor |
| `/api/dashboard/user/team-performance` | Kinerja tim |

Handler tidak membaca body atau query. Hasil layanan masing-masing ditempatkan dalam `data`.

Tipe data kinerja tim mencantumkan:

| Bagian | Properti |
|---|---|
| `overview` | `totalStaff`, `totalRevenue`, `totalTransaction`, `averageRevenue` |
| `ranking[]` | `userId`, `name`, `role`, `transaction`, `revenue`, `customer` |
| `topProducts[]` | `userName`, `productName`, `quantity` |

## 10. Log audit

**`GET /api/audit-logs`**

**Akses:** kelompok B.

Mengambil log audit berdasarkan `createdAt` menurun. Handler tidak membaca query.

Isi setiap data log:

- `id`
- `action`
- `module`
- `description`
- `ipAddress`
- `createdAt`
- `user`: `id`, `name`, `email`

Pesan berhasil: `Audit log berhasil diambil`.

## 11. Unggah gambar

| Metode | Endpoint | Tujuan |
|---|---|---|
| `POST` | `/api/upload/customer` | Gambar pelanggan |
| `POST` | `/api/upload/product` | Gambar produk |
| `POST` | `/api/upload/user` | Gambar pengguna |

### Format permintaan

Gunakan **`multipart/form-data`** dengan field:

| Field | Tipe | Wajib |
|---|---|---|
| `file` | File gambar | Ya |

Ketentuan:

- MIME: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`.
- Ukuran maksimal: `2 × 1024 × 1024` byte.
- Nama berkas dibuat dengan UUID.
- Handler unggah yang terbaca tidak memanggil pemeriksaan autentikasi.

### Respons

Isi `data` memuat `url`:

```json
{
  "success": true,
  "message": "Upload image berhasil",
  "data": {
    "url": "/uploads/products/product-contoh.jpg"
  }
}
```

Contoh di atas menggambarkan unggah produk; nama berkas sebenarnya dibuat server.

| Endpoint | Awalan URL hasil | Pesan |
|---|---|---|
| `/api/upload/customer` | `/uploads/customers/` | `Upload customer image berhasil` |
| `/api/upload/product` | `/uploads/products/` | `Upload image berhasil` |
| `/api/upload/user` | `/uploads/users/` | `Upload user image berhasil` |

URL hasil unggah dapat digunakan sebagai nilai `imageUrl` pada operasi terkait.

### Kesalahan unggah

| HTTP | Pesan |
|---|---|
| `400` | `File tidak ditemukan` |
| `400` | `Format file harus JPG, JPEG, PNG, atau WEBP` |
| `400` | `Ukuran file maksimal 2MB` |

## 12. Kode status

| HTTP | Penggunaan |
|---|---|
| `200` | Operasi berhasil dengan status bawaan respons |
| `201` | Pembuatan pengguna, pelanggan internal, produk, transaksi, atau aktivitas |
| `400` | Kesalahan permintaan atau kondisi bisnis tertentu |
| `401` | Kredensial atau token tidak valid |
| `403` | Akses ditolak atau akun tidak aktif |
| `404` | Data tidak ditemukan |
| `409` | Konflik data unik |
| `500` | Kesalahan internal |

## 13. Rute tambahan dalam cakupan XML

Rute berikut tetap masuk inventaris dokumentasi. Detail yang tidak tersedia dalam bukti kode yang terbaca tidak diisi dengan asumsi.

| Rute | Parameter path | Keterangan |
|---|---|---|
| `/api/customers/{id}` | `id` | Rute pelanggan berdasarkan ID |
| `/api/customers/{id}/activities` | `id` | Rute aktivitas pelanggan |
| `/api/transactions/{id}` | `id` | Rute transaksi berdasarkan ID |
| `/api/dashboard/customer/activity` | Tidak ada | Rute dasbor aktivitas pelanggan |

Penandaan ini menjelaskan kelengkapan kontrak dalam dokumentasi, bukan menyatakan rute tersebut gagal atau tidak dapat digunakan.