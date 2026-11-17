# MoneW

> Progressive Web App (PWA) for multi-wallet expense tracking, payment cards, and cashflow analytics.

MoneW is an installable, mobile-first Progressive Web App (PWA) designed for personal finance tracking, wallet management, and expense analytics. Built on Next.js 16 (App Router), React 19, and Tailwind CSS v4, MoneW runs locally with an optimized client shell and an API router bridge (`worker.js`). Ledgers, wallets, transactions, and payment cards are persisted into a local relational SQLite database, with receipt uploads handled via local storage.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4.0-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite_3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## Showcase

| Desktop | Mobile |
| :---: | :---: |
| **Financial Dashboard Desktop**<br>![Financial Dashboard Desktop](screenshots/MoneW%20Dashboard%20Desktop.png) | **Financial Dashboard Mobile**<br>![Financial Dashboard Mobile](screenshots/MoneW%20Dashboard%20Mobile.png) |
| **Cashflow & Spending Analytics Desktop**<br>![Monthly Analytics Desktop](screenshots/MoneW%20Monthly%20Analytics%20Desktop.png) | **Cashflow & Spending Analytics Mobile**<br>![Monthly Analytics Mobile](screenshots/MoneW%20Monthly%20Analytics%20Mobile.png) |
| **Saved Credit & Debit Cards Desktop**<br>![Linked Cards Desktop](screenshots/MoneW%20Linked%20Cards%20Desktop.png) | **Saved Credit & Debit Cards Mobile**<br>![Linked Cards Mobile](screenshots/MoneW%20Linked%20Cards%20Mobile.png) |
| **Digital Wallets & Accounts Desktop**<br>![Digital Wallets Desktop](screenshots/MoneW%20Digital%20Wallets%20Desktop.png) | **Digital Wallets & Accounts Mobile**<br>![Digital Wallets Mobile](screenshots/MoneW%20Digital%20Wallets%20Mobile.png) |
| **Add Transaction Flow Desktop**<br>![Add Transaction Desktop](screenshots/MoneW%20Add%20Transaction%20Desktop.png) | **Add Transaction Flow Mobile**<br>![Add Transaction Mobile](screenshots/MoneW%20Add%20Transaction%20Mobile.png) |
| **User Profile & Theme Customization Desktop**<br>![User Profile Desktop](screenshots/MoneW%20User%20Profile%20Desktop.png) | **User Profile & Theme Customization Mobile**<br>![User Profile Mobile](screenshots/MoneW%20User%20Profile%20Mobile.png) |
| **Authentication Screen Desktop**<br>![Authentication Desktop](screenshots/MoneW%20Authentication%20Desktop.png) | **Authentication Screen Mobile**<br>![Authentication Mobile](screenshots/MoneW%20Authentication%20Mobile.png) |

---

## Features

- **Consolidated Balance & Net Worth (`/`)**: Aggregated multi-wallet net worth tracking, monthly income and expense totals, wallet summary carousel, and real-time transaction ledger.
- **Multi-Wallet Accounts (`/wallets`)**: Dedicated sub-ledgers for bank accounts (BCA, Mandiri), digital e-wallets (GoPay, OVO, DANA), and physical cash reserves with balance transfers.
- **Wallet Expense Limits & Safety Freeze**: Configurable daily, weekly, and monthly threshold limits per wallet with automated alert badges and one-tap account freeze capability.
- **Cashflow & Spending Analytics (`/stats`)**: Timeframe filtering across "This Month", "Last Month", "Last 3 Months", or "Custom Date Range" with month-over-month percentage changes, top spending category rankings (#1, #2, #3) with exact expense values and progress bars, and a filterable transaction audit ledger (filter by Type, Wallet, Category) with pagination.
- **Saved Payment Cards Sub-Ledger (`/cards`)**: 3D gradient card views supporting Visa and Mastercard networks with masked card numbers, cardholder identification, expiration dates, bank branding, and flip CVV security.
- **Streamlined Transaction Entry (`/add`)**: Split expense/income workflow, large numeric typography, category picker with Lucide icons, default active wallet binding, and custom iOS wheel date picker.
- **Digital Receipt Capture (`/api/upload`)**: Upload integration to attach receipt images and invoices to transaction records.
- **Privacy Mode**: 1-click balance obscuring toggle hiding all sensitive financial numbers behind asterisks (`••••••`) for safe usage in public spaces.
- **Adaptive Dynamic Theming (`ThemeContext.tsx`)**: Theme engine supporting dark and light modes alongside 5 accent color schemes (Emerald, Violet, Blue, Amber, Rose) injected into CSS custom properties.
- **Installable Progressive Web App (PWA)**: Standalone web app manifest, offline service worker caching (`sw.js`), and in-app install prompt banner (`InstallPrompt.tsx`).

---

## Tech Stack

| Category | Technologies | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | Next.js `16.1.1` (App Router), React `19.2.3` | SPA foundation with fast client-side routing and pre-rendered shell |
| **Styling & Design System** | Tailwind CSS `v4.0`, CSS Custom Properties | Utility-first responsive styling with dynamic accent color tokens |
| **Motion & Transitions** | Framer Motion `12.25.0` | Tab transitions, animated modal drawers, and interactive cards |
| **Database & Storage** | SQLite 3, Local Object Storage | Relational SQLite database for financial records and receipt attachments |
| **API Router** | Edge API Server (`worker.js`) | Local API router serving endpoints and handling `/api/*` data persistence |
| **Security & Authentication** | PBKDF2 (100,000 rounds, Web Crypto), HMAC-SHA256 JWT | Local password hashing, token creation, and stateless authorization |
| **PWA & Offline** | Service Worker (`sw.js`), Web App Manifest | Standalone display mode and offline asset caching |
| **Date & Icon Utilities** | Date-fns `4.1.0`, Lucide React `0.562.0` | Financial interval math, date formatting, and category vector iconography |

---

## Database Architecture

MoneW organizes relational financial data with SQLite ACID transaction guarantees. The schema (`schema.sql`) organizes data across 5 normalized tables:

```sql
-- 1. User Profiles & Display Preferences
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    password TEXT NOT NULL DEFAULT '',           -- PBKDF2 256-bit hash
    colorScheme TEXT NOT NULL DEFAULT 'dark',     -- Theme accent preference
    isSetupCompleted INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Expense & Income Categories
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Multi-Wallet Accounts & Spending Limits
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

-- 4. Financial Transactions & Receipt Links
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

-- 5. Saved Payment Cards
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

## Project Structure

```bash
/
├── app/
│   ├── add/                 # Quick transaction entry modal route
│   ├── cards/               # Saved credit and debit cards management
│   ├── login/               # Authentication and registration
│   ├── profile/             # Profile settings and theme selector
│   ├── stats/               # Cashflow, percentage breakdown, and transaction ledger
│   ├── wallets/             # Multi-wallet accounts, limits, and transfer drawer
│   ├── globals.css          # Tailwind CSS v4 variables and theme tokens
│   ├── layout.tsx           # Global app shell, providers, and viewport setup
│   └── page.tsx             # Primary overview dashboard and recent feed
├── components/              # UI primitives, bottom nav, modals, setup wizard
├── context/                 # AuthContext, StoreContext, and ThemeContext
├── lib/                     # Data types and CSS class merging helper
├── public/                  # Manifest, logo, and offline service worker
├── screenshots/             # Desktop and mobile showcase mockups
├── scripts/
│   ├── capture-all.mjs      # Screenshot capture and mockup generator
│   └── seed.sql             # Turnkey database seeder with realistic Indonesian records
├── package.json
├── schema.sql               # SQLite schema definition
├── tsconfig.json
├── worker.js                # Local API and edge router
└── wrangler.jsonc           # Local D1 SQLite and storage resource bindings
```

---

## Local Setup & Deployment

### 1. Prerequisites

- **Node.js**: Version `20.x` or `22.x`
- **npm** or **pnpm**
- **SQLite 3**: Native CLI (`sqlite3`) or local runner via `npx wrangler`

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/widifirmaan/nextjs-pwa-moneymanagement.git
cd nextjs-pwa-moneymanagement

# Install dependencies
npm install
```

### 3. Setup Database & Seeder Lokal

Inisialisasi skema tabel dan isi data awal (seeder) ke database SQLite lokal:

```bash
# Opsi A: Menggunakan SQLite3 CLI
sqlite3 local.db < schema.sql
sqlite3 local.db < scripts/seed.sql

# Opsi B: Menggunakan local runtime
npx wrangler d1 execute monew-db --local --file=schema.sql
npm run seed
```

#### Isi Data Seeder:
* **User Profile**: Akun demo `vejoyf@gmail.com`
* **11 Kategori Standar**: Food & Drink, Transport, Shopping, Bills, Salary, Investments, Entertainment, Health, Education, dll.
* **4 Multi-Wallet Accounts**:
  * Bank BCA (`Rp 18.450.000`)
  * Bank Mandiri (`Rp 24.800.000`)
  * GoPay E-Wallet (`Rp 2.150.000`)
  * Cash Fisik (`Rp 1.250.000`)
* **3 Kartu Pembayaran**: BCA Platinum Visa, Mandiri Prioritas Mastercard, Jenius Contactless.
* **13 Transaksi Realistis**: Gaji bulanan, tagihan listrik & internet, gym pass, langganan kursus online, belanja, dll.

### 4. Menjalankan Server Lokal

```bash
# Jalankan server frontend Next.js
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

Atau jalankan full edge API runtime lokal:

```bash
npm run build
npx wrangler dev
```

Buka [http://localhost:8787](http://localhost:8787) di browser.

### 5. Panduan Uji Manual (Testing Checklist)

Lakukan verifikasi manual berikut di browser:

| No | Fitur yang Diuji | Langkah Pengujian | Hasil yang Diharapkan |
| :---: | :--- | :--- | :--- |
| 1 | **Login Gateway** | Buka `/login`, masukkan email `vejoyf@gmail.com` | Berhasil login dan dialihkan ke dashboard `/` |
| 2 | **Konsolidasi Saldo** | Periksa ringkasan di dashboard `/` | Total saldo menampilkan total gabungan seluruh dompet (~Rp 46.650.000) |
| 3 | **Filter Analytics** | Buka `/stats`, ubah dropdown filter waktu | Tampil grafik spending, breakdown persentase, dan ranking kategori |
| 4 | **Tambah Transaksi** | Buka `/add`, pilih Expense, masukkan nominal `50000`, pilih kategori `Food & Drink`, pilih dompet `GoPay`, submit | Transaksi tersimpan dan saldo GoPay berkurang `Rp 50.000` |
| 5 | **Sub-Ledger Kartu** | Buka `/cards` | Tampil 3 kartu (BCA, Mandiri, Jenius) dengan preview flip CVV interaktif |
| 6 | **Privacy Mode** | Klik ikon mata di header | Semua angka saldo tersamarkan menjadi tanda bintang (`••••••`) |

---

## Author

Developed by **[Widi Firmansyah](https://widifirmaan.web.id)**.
