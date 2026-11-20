# MoneW

> Progressive Web App (PWA) for multi-wallet personal finance management, expense tracking, payment card sub-ledgers, and monthly cashflow analytics.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4.0-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite_3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## Live URL

- **Production URL:** [https://money.widifirmaan.web.id](https://money.widifirmaan.web.id)
- **Deployment Platform:** Cloudflare Pages & Cloudflare Workers

---

## Screenshots

| Desktop (MacBook Pro M4) | Mobile (iPhone 16 Pro) |
| :---: | :---: |
| **Balance & Net Worth Dashboard**<br>![Dashboard](screenshots/Dashboard%20Desktop.png) | **Balance & Net Worth Dashboard**<br>![Dashboard](screenshots/Dashboard%20Mobile.png) |
| **Wallet Details Modal & Ledger Tabs**<br>![Dashboard Modal Wallet Details](screenshots/Dashboard%20Modal%20Wallet%20Details%20Desktop.png) | **Wallet Details Modal & Ledger Tabs**<br>![Dashboard Modal Wallet Details](screenshots/Dashboard%20Modal%20Wallet%20Details%20Mobile.png) |
| **Wallets & Bank Accounts Hub**<br>![Wallets](screenshots/Wallets%20Desktop.png) | **Wallets & Bank Accounts Hub**<br>![Wallets](screenshots/Wallets%20Mobile.png) |
| **Add Wallet Modal & Color Picker**<br>![Wallets Modal Add Wallet](screenshots/Wallets%20Modal%20Add%20Wallet%20Desktop.png) | **Add Wallet Modal & Color Picker**<br>![Wallets Modal Add Wallet](screenshots/Wallets%20Modal%20Add%20Wallet%20Mobile.png) |
| **Saved Payment Cards Sub-Ledger**<br>![Cards](screenshots/Cards%20Desktop.png) | **Saved Payment Cards Sub-Ledger**<br>![Cards](screenshots/Cards%20Mobile.png) |
| **Add Payment Card Modal**<br>![Cards Modal Add Card](screenshots/Cards%20Modal%20Add%20Card%20Desktop.png) | **Add Payment Card Modal**<br>![Cards Modal Add Card](screenshots/Cards%20Modal%20Add%20Card%20Mobile.png) |
| **Cashflow & Spending Analytics**<br>![Analytics](screenshots/Analytics%20Desktop.png) | **Cashflow & Spending Analytics**<br>![Analytics](screenshots/Analytics%20Mobile.png) |
| **Edit Transaction Modal**<br>![Analytics Modal Edit Transaction](screenshots/Analytics%20Modal%20Edit%20Transaction%20Desktop.png) | **Edit Transaction Modal**<br>![Analytics Modal Edit Transaction](screenshots/Analytics%20Modal%20Edit%20Transaction%20Mobile.png) |
| **Add Transaction Form**<br>![Add Transaction](screenshots/Add%20Transaction%20Desktop.png) | **Add Transaction Form**<br>![Add Transaction](screenshots/Add%20Transaction%20Mobile.png) |
| **User Profile & Theme Accent Selector**<br>![Profile](screenshots/Profile%20Desktop.png) | **User Profile & Theme Accent Selector**<br>![Profile](screenshots/Profile%20Mobile.png) |
| **Reset Data Confirmation Modal**<br>![Profile Modal Reset Confirm](screenshots/Profile%20Modal%20Reset%20Confirm%20Desktop.png) | **Reset Data Confirmation Modal**<br>![Profile Modal Reset Confirm](screenshots/Profile%20Modal%20Reset%20Confirm%20Mobile.png) |
| **Authentication Portal (Login & Register)**<br>![Login](screenshots/Login%20Desktop.png) | **Authentication Portal (Login & Register)**<br>![Login](screenshots/Login%20Mobile.png) |
| **Invalid Credentials Error Alert**<br>![Login Alert Invalid Credentials](screenshots/Login%20Alert%20Invalid%20Credentials%20Desktop.png) | **Invalid Credentials Error Alert**<br>![Login Alert Invalid Credentials](screenshots/Login%20Alert%20Invalid%20Credentials%20Mobile.png) |

---

## Fitur

- **Consolidated Balance & Net Worth (`/`)**: Aggregated net worth tracking across all active wallets, current month income and expense totals, and real-time transaction ledger.
- **Multi-Wallet Accounts (`/wallets`)**: Dedicated sub-ledgers for commercial bank accounts (BCA, Mandiri), digital e-wallets (GoPay, OVO, DANA), and physical cash with inter-wallet balance transfers.
- **Spending Limits & Account Safety Freeze**: Configurable daily, weekly, and monthly threshold limits per wallet, paired with a one-tap account freeze toggle.
- **Payment Card Sub-Ledger (`/cards`)**: 3D card visualization supporting Visa and Mastercard networks with masked card numbers, expiration dates, and interactive 3D flip CVV inspection.
- **Cashflow & Spending Analytics (`/stats`)**: Timeframe filtering across "This Month", "Last Month", "Last 3 Months", or "Custom Range", percentage category breakdown, top 3 expense rankings, and a filterable transaction table.
- **Streamlined Transaction Entry (`/add`)**: Expense and income recording workflows with Lucide category icons, default source wallet selection, and wheel date picker.
- **Receipt Attachments (`/api/upload`)**: Support for attaching invoice and receipt image files to transaction records stored in Cloudflare R2 object storage.
- **Privacy Mode**: 1-click balance obscuring toggle masking sensitive financial amounts into asterisks (`••••••`) for secure usage in public spaces.
- **Adaptive Dynamic Theming**: Dark and light mode foundation paired with 5 selectable theme accent color schemes (Emerald, Violet, Blue, Amber, Rose) injected via CSS variables.
- **Installable Progressive Web App (PWA)**: Web app manifest for standalone home screen installation, offline service worker asset caching (`sw.js`), and install prompt banner.

---

## Tech Stack

| Category | Technology | Description / Purpose |
| :--- | :--- | :--- |
| **Core Framework** | Next.js `16.1.1` (App Router), React `19.2.3` | SPA architecture with pre-rendered app shell and client routing |
| **Styling** | Tailwind CSS `v4.0`, CSS Custom Properties | Responsive styling with dynamic theme accent tokens |
| **Animation** | Framer Motion `12.25.0` | Route transitions, modal drawers, and interactive card components |
| **Charts** | Recharts `3.6.0` | SVG cashflow analytics, category distribution donut, and spending trends |
| **Database & Storage** | Cloudflare D1 (SQLite 3), Cloudflare R2 (`MONEY_IMAGES`) | Relational database for ledgers and object storage for receipt attachments |
| **API Router** | Serverless Edge Worker (`worker.js`) | API route handler handling `/api/*` data persistence and R2 uploads |
| **Security & Auth** | PBKDF2 (100,000 rounds, Web Crypto), HMAC-SHA256 JWT | Password hashing and stateless token authentication |
| **PWA Capabilities** | Service Worker (`sw.js`), Web App Manifest | Offline asset caching and standalone installation |
| **Utilities** | Date-fns `4.1.0`, Lucide React `0.562.0` | Date interval math and UI vector iconography |

---

## Tutorial Run Local & Setup

### 1. Prerequisites
- **Node.js**: Version `20.x` or `22.x`
- **npm** or **pnpm**
- Database: **No native database installation needed** (handled by Cloudflare D1 local simulation via Wrangler).

### 2. Environment Variables Setup
Buat file `.env.local` di root project:

```env
JWT_SECRET=dev-secret-key-change-in-production
```

### 3. Installation
```bash
# Clone the repository
git clone https://github.com/widifirmaan/nextjs-pwa-moneymanagement.git
cd nextjs-pwa-moneymanagement

# Install dependencies
npm install
```

### 4. Database Schema & Seeder Setup

MoneW mengorganisir akun dompet, batas pengeluaran kategori, kartu tersimpan, dan catatan transaksi dalam database SQLite / Cloudflare D1 (`schema.sql`):

| Tabel | Keterangan / Entitas Data |
| :--- | :--- |
| `users` | Akun pengguna, profil email, hash sandi PBKDF2, dan preferensi tema |
| `categories` | Kategori pemasukan/pengeluaran (ikon, warna, dan tipe) |
| `wallets` | Akun dompet (Bank, E-Wallet, Cash), saldo, limit pengeluaran harian/mingguan/bulanan |
| `transactions` | Log transaksi keuangan (pemasukan/pengeluaran, tanggal, catatan, struk) |
| `saved_cards` | Data kartu tersimpan (nomor kartu, masa berlaku, nama bank) |

Inisialisasi skema Cloudflare D1 lokal dan seeder data awal:

```bash
# Initialize schema and seed records in Cloudflare D1 local simulation
npm run seed
```

#### Pre-seeded Demo Data & Auth Credentials:
- **Demo User Profile**: `vejoyf@gmail.com`
- **11 Categories**: Food & Drink, Transport, Shopping, Bills, Salary, Investments, Entertainment, Health, Education, etc.
- **4 Multi-Wallet Accounts**:
  - Bank BCA (`Rp 18,450,000`)
  - Bank Mandiri (`Rp 24,800,000`)
  - GoPay E-Wallet (`Rp 2,150,000`)
  - Physical Cash (`Rp 1,250,000`)
- **3 Payment Cards**: BCA Platinum Visa, Mandiri Prioritas Mastercard, Jenius Contactless.
- **13 Realistic Transactions**: Salary, utility bills, internet, gym pass, groceries, and daily expenses.

### 5. Running the Local Server

MoneW operates as a static export SPA (`output: 'export'`) with its API and R2 uploads handled by `worker.js`:

```bash
# Option A: Start Next.js development server (UI layout development)
npm run dev

# Option B: Run fullstack locally (Worker API + D1 DB + R2 Bucket)
npx wrangler dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port output by Wrangler) in your browser.

---

## Author

Made with ❤️ by **Widi Firmansyah** / [widifirmaan.web.id](https://widifirmaan.web.id)
