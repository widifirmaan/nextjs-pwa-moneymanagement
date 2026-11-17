# MoneW

> Aplikasi web progresif (PWA) untuk manajemen keuangan multi-dompet, pencatatan transaksi, sub-ledger kartu pembayaran, dan analisis cashflow bulanan.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4.0-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite_3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Live Demo](https://img.shields.io/badge/Demo-money.widifirmaan.web.id-10B981?style=flat-square)](https://money.widifirmaan.web.id)

---

## Live URL

- **Production URL**: [https://money.widifirmaan.web.id](https://money.widifirmaan.web.id)

---

## Screenshot

| Desktop | Mobile |
| :---: | :---: |
| **Dashboard Ringkasan Saldo**<br>![Dashboard](screenshots/Dashboard%20Desktop.png) | **Dashboard Ringkasan Saldo**<br>![Dashboard](screenshots/Dashboard%20Mobile.png) |
| **Daftar Dompet & Akun Bank**<br>![Wallets](screenshots/Wallets%20Desktop.png) | **Daftar Dompet & Akun Bank**<br>![Wallets](screenshots/Wallets%20Mobile.png) |
| **Sub-Ledger Kartu Debit & Kredit**<br>![Cards](screenshots/Cards%20Desktop.png) | **Sub-Ledger Kartu Debit & Kredit**<br>![Cards](screenshots/Cards%20Mobile.png) |
| **Analisis Cashflow & Filter Transaksi**<br>![Analytics](screenshots/Analytics%20Desktop.png) | **Analisis Cashflow & Filter Transaksi**<br>![Analytics](screenshots/Analytics%20Mobile.png) |
| **Form Tambah Transaksi**<br>![Add Transaction](screenshots/Add%20Transaction%20Desktop.png) | **Form Tambah Transaksi**<br>![Add Transaction](screenshots/Add%20Transaction%20Mobile.png) |
| **Profil Pengguna & Pilihan Aksen Tema**<br>![Profile](screenshots/Profile%20Desktop.png) | **Profil Pengguna & Pilihan Aksen Tema**<br>![Profile](screenshots/Profile%20Mobile.png) |
| **Autentikasi Login & Register**<br>![Login](screenshots/Login%20Desktop.png) | **Autentikasi Login & Register**<br>![Login](screenshots/Login%20Mobile.png) |

---

## Fitur

- **Konsolidasi Saldo & Net Worth (`/`)**: Menghitung total akumulasi saldo dari seluruh dompet aktif, total pemasukan, dan total pengeluaran bulan berjalan secara real-time.
- **Multi-Wallet Accounts (`/wallets`)**: Manajemen terpisah untuk rekening bank (BCA, Mandiri), dompet digital (GoPay, OVO, DANA), dan uang tunai fisik dengan fitur transfer saldo antar-dompet.
- **Batas Pengeluaran & Safety Freeze**: Pengaturan batas maksimal transaksi harian, mingguan, dan bulanan per dompet, disertai opsi membekukan (*freeze*) dompet untuk mencegah penarikan.
- **Sub-Ledger Kartu Pembayaran (`/cards`)**: Visualisasi kartu debit dan kredit (Visa & Mastercard) dengan nomor kartu terenkripsi/tersamar, masa berlaku, dan simulasi interaktif flip CVV 3D.
- **Analisis Cashflow & Laporan Kategori (`/stats`)**: Filter rentang waktu ("Bulan Ini", "Bulan Lalu", "3 Bulan Terakhir", "Kustom"), grafik spending, pemeringkatan 3 kategori teratas, dan riwayat transaksi dengan filter multi-parameter.
- **Pencatatan Transaksi Cepat (`/add`)**: Alur input pengeluaran dan pemasukan dengan pemilih kategori berikon Lucide, keterhubungan dompet sumber, dan pengatur tanggal.
- **Lampiran Struk Pembayaran (`/api/upload`)**: Dukungan upload gambar bukti transaksi struk atau tagihan ke penyimpanan lokal.
- **Privacy Mode**: Tombol 1-klik untuk menyamarkan semua angka nominal saldo menjadi tanda bintang (`••••••`) agar aman saat dibuka di ruang publik.
- **Dukungan Dynamic Theme**: Pilihan tema gelap/terang serta 5 aksen warna (Emerald, Violet, Blue, Amber, Rose) yang dikelola melalui CSS variables.
- **Progressive Web App (PWA)**: Manifest aplikasi standalone, caching aset offline melalui service worker (`sw.js`), dan banner rekomendasi instalasi ke layar utama perangkat.

---

## Tech Stack

| Kategori | Teknologi | Deskripsi / Peran |
| :--- | :--- | :--- |
| **Framework Utama** | Next.js `16.1.1` (App Router), React `19.2.3` | SPA modern dengan rendering cepat dan arsitektur modular |
| **Styling** | Tailwind CSS `v4.0`, CSS Custom Properties | Styling responsif dengan sistem tema aksen dinamis |
| **Animasi** | Framer Motion `12.25.0` | Transisi halaman, drawer modal, dan interaksi komponen |
| **Database** | SQLite 3 | Basis data relasional lokal untuk pencatatan user, dompet, kartu, dan transaksi |
| **API Engine** | Local Server Router (`worker.js`) | Router endpoint lokal untuk melayani persistensi data `/api/*` |
| **Keamanan & Kredensial** | PBKDF2 (100.000 iterasi, Web Crypto), HMAC-SHA256 JWT | Hashing kata sandi dan manajemen token stateless |
| **Fitur PWA** | Service Worker (`sw.js`), Web App Manifest | Dukungan offline caching dan instalasi standalone |
| **Utilitas** | Date-fns `4.1.0`, Lucide React `0.562.0` | Kalkulasi rentang tanggal dan ikon vektor visual |

---

## Database Architecture

MoneW menggunakan database SQLite dengan integritas transaksi ACID. Skema didefinisikan dalam `schema.sql`:

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    password TEXT NOT NULL DEFAULT '',
    colorScheme TEXT NOT NULL DEFAULT 'dark',
    isSetupCompleted INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE wallets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('bank', 'ewallet', 'cash')),
    balance REAL NOT NULL DEFAULT 0,
    color TEXT NOT NULL,
    accountNumber TEXT,
    userId TEXT NOT NULL,
    isFrozen INTEGER NOT NULL DEFAULT 0,
    expenseLimitsDaily REAL NOT NULL DEFAULT 0,
    expenseLimitsWeekly REAL NOT NULL DEFAULT 0,
    expenseLimitsMonthly REAL NOT NULL DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    categoryId TEXT NOT NULL,
    walletId TEXT NOT NULL,
    date TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    receiptUrl TEXT,
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE CASCADE
);

CREATE TABLE saved_cards (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    cardName TEXT NOT NULL,
    cardHolderName TEXT NOT NULL,
    cardNumber TEXT NOT NULL,
    expiryDate TEXT NOT NULL,
    cvv TEXT NOT NULL,
    cardType TEXT NOT NULL,
    color TEXT NOT NULL,
    bankName TEXT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Panduan Setup & Menjalankan Lokal

### 1. Prasyarat Sistem

- **Node.js**: Versi `20.x` atau `22.x`
- **npm** atau **pnpm**
- **SQLite 3**: Native CLI (`sqlite3`)

### 2. Environment Variables

Buat file `.env.local` pada direktori root:

```env
JWT_SECRET=dev-secret-key-change-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Instalasi Dependensi

```bash
# Clone repository
git clone https://github.com/widifirmaan/nextjs-pwa-moneymanagement.git
cd nextjs-pwa-moneymanagement

# Install package
npm install
```

### 4. Setup Database & Seeder Lokal

Inisialisasi tabel dan isi data awal (seeder) ke database SQLite lokal:

```bash
# Menggunakan SQLite CLI lokal
sqlite3 local.db < schema.sql
sqlite3 local.db < scripts/seed.sql
```

#### Data Seeder Bawaan:
- **Akun Demo**: `vejoyf@gmail.com`
- **11 Kategori**: Makanan & Minuman, Transportasi, Belanja, Tagihan, Gaji, Investasi, Hiburan, Kesehatan, Pendidikan, dll.
- **4 Dompet**:
  - Bank BCA (`Rp 18.450.000`)
  - Bank Mandiri (`Rp 24.800.000`)
  - GoPay (`Rp 2.150.000`)
  - Tunai Fisik (`Rp 1.250.000`)
- **3 Kartu Pembayaran**: BCA Platinum Visa, Mandiri Prioritas Mastercard, Jenius Contactless.
- **13 Transaksi Riil**: Gaji, listrik, internet, gym pass, groceries, dan belanja harian.

### 5. Menjalankan Server Lokal

```bash
# Jalankan mode development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 6. Panduan Uji Manual (Testing Checklist)

| No | Fitur | Langkah Pengujian | Hasil yang Diharapkan |
| :---: | :--- | :--- | :--- |
| 1 | **Login** | Buka `/login`, masukkan email `vejoyf@gmail.com` | Berhasil login dan diarahkan ke dashboard `/` |
| 2 | **Konsolidasi Saldo** | Periksa kartu total di dashboard `/` | Total saldo menampilkan gabungan nominal seluruh dompet (~Rp 46.650.000) |
| 3 | **Filter Analytics** | Buka `/stats`, ubah dropdown filter waktu | Tampil grafik spending, breakdown persentase, dan ranking 3 kategori teratas |
| 4 | **Tambah Transaksi** | Buka `/add`, pilih Pengeluaran, isi `50000`, pilih kategori `Food & Drink`, pilih dompet `GoPay`, simpan | Transaksi baru tercatat dan saldo GoPay berkurang sebesar `Rp 50.000` |
| 5 | **Sub-Ledger Kartu** | Buka `/cards` | Tampil 3 kartu (BCA, Mandiri, Jenius) dengan preview flip CVV interaktif |
| 6 | **Privacy Mode** | Klik ikon mata pada header | Seluruh nominal saldo berubah menjadi tanda bintang (`••••••`) |

---

## Author

Developed by **[Widi Firmansyah](https://widifirmaan.web.id)**.
