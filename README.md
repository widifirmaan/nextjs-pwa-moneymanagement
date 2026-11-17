# MoneW

> High-performance Progressive Web App (PWA) for multi-wallet expense tracking, payment cards, and cashflow analytics.

MoneW is an installable, mobile-first Progressive Web App (PWA) designed for modern personal finance management. Built on Next.js 16 (App Router), React 19, and Tailwind CSS v4, MoneW runs serverless by pairing an optimized static export shell with a Cloudflare Edge Worker bridge (`worker.js`). All financial ledgers, wallets, transactions, and payment cards are persisted into Cloudflare D1 (relational SQLite) with cryptographic PBKDF2 password hashing and HMAC-SHA256 JWT sessions, with receipt uploads handled via Cloudflare R2 object storage.

[![Live Demo](https://img.shields.io/badge/Demo-money.widifirmaan.web.id-10B981?style=flat-square&logo=cloudflare&logoColor=white)](https://money.widifirmaan.web.id)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4.0-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare D1](https://img.shields.io/badge/Database-Cloudflare_D1_(SQLite)-F38020?style=flat-square&logo=cloudflare)](https://developers.cloudflare.com/d1/)
[![Cloudflare R2](https://img.shields.io/badge/Storage-Cloudflare_R2-F59E0B?style=flat-square&logo=cloudflare)](https://developers.cloudflare.com/r2/)
[![Edge Worker](https://img.shields.io/badge/Runtime-Cloudflare_Worker-F38020?style=flat-square&logo=cloudflareworkers&logoColor=white)](https://workers.cloudflare.com/)
[![Security](https://img.shields.io/badge/Auth-PBKDF2_•_JWT-EC4899?style=flat-square)](#edge-serverless-architecture)
[![PWA](https://img.shields.io/badge/PWA-Installable-blueviolet?style=flat-square&logo=pwa&logoColor=white)](#features)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## Live Production

- **URL:** [https://money.widifirmaan.web.id](https://money.widifirmaan.web.id)
- **Deployment:** Cloudflare Pages with Edge Worker runtime bridge (`out/_worker.js`)
- **Database:** Cloudflare D1 Relational SQLite (`monew-db`)
- **Object Storage:** Cloudflare R2 Bucket (`monew-images`)
- **PWA Capabilities:** Standalone installable application on iOS Safari and Android Chrome with offline service worker caching and native web clip configuration

---

## Showcase

| Desktop Interface (MacBook Pro M4) | Mobile Interface (iPhone 16 Pro) |
| :---: | :---: |
| **Financial Dashboard Desktop**<br>![Financial Dashboard Desktop](screenshots/MoneW%20Dashboard%20Desktop.png) | **Financial Dashboard Mobile**<br>![Financial Dashboard Mobile](screenshots/MoneW%20Dashboard%20Mobile.png) |
| **Cashflow & Spending Analytics Desktop**<br>![Monthly Analytics Desktop](screenshots/MoneW%20Monthly%20Analytics%20Desktop.png) | **Cashflow & Spending Analytics Mobile**<br>![Monthly Analytics Mobile](screenshots/MoneW%20Monthly%20Analytics%20Mobile.png) |
| **Saved Credit & Debit Cards Desktop**<br>![Linked Cards Desktop](screenshots/MoneW%20Linked%20Cards%20Desktop.png) | **Saved Credit & Debit Cards Mobile**<br>![Linked Cards Mobile](screenshots/MoneW%20Linked%20Cards%20Mobile.png) |
| **Digital Wallets & Accounts Desktop**<br>![Digital Wallets Desktop](screenshots/MoneW%20Digital%20Wallets%20Desktop.png) | **Digital Wallets & Accounts Mobile**<br>![Digital Wallets Mobile](screenshots/MoneW%20Digital%20Wallets%20Mobile.png) |
| **Add Transaction Flow Desktop**<br>![Add Transaction Desktop](screenshots/MoneW%20Add%20Transaction%20Desktop.png) | **Add Transaction Flow Mobile**<br>![Add Transaction Mobile](screenshots/MoneW%20Add%20Transaction%20Mobile.png) |
| **User Profile & Theme Customization Desktop**<br>![User Profile Desktop](screenshots/MoneW%20User%20Profile%20Desktop.png) | **User Profile & Theme Customization Mobile**<br>![User Profile Mobile](screenshots/MoneW%20User%20Profile%20Mobile.png) |
| **Glassmorphism Authentication Desktop**<br>![Authentication Desktop](screenshots/MoneW%20Authentication%20Desktop.png) | **Glassmorphism Authentication Mobile**<br>![Authentication Mobile](screenshots/MoneW%20Authentication%20Mobile.png) |

---

## Features

- **Consolidated Balance & Net Worth (`/`)**: Aggregated multi-wallet net worth tracking, monthly income and expense totals, wallet summary carousel, and real-time transaction ledger.
- **Multi-Wallet Accounts (`/wallets`)**: Dedicated sub-ledgers for bank accounts (BCA, Mandiri), digital e-wallets (GoPay, OVO, DANA), and physical cash reserves with balance transfers.
- **Wallet Expense Limits & Safety Freeze**: Configurable daily, weekly, and monthly threshold limits per wallet with automated alert badges and one-tap account freeze capability.
- **Cashflow & Spending Analytics (`/stats`)**: Timeframe filtering across "This Month", "Last Month", "Last 3 Months", or "Custom Date Range" with month-over-month percentage changes, top spending category rankings (#1, #2, #3) with exact expense values and progress bars, and a filterable transaction audit ledger (filter by Type, Wallet, Category) with pagination.
- **Saved Payment Cards Sub-Ledger (`/cards`)**: Realistic 3D gradient card mockups supporting Visa and Mastercard networks with masked card numbers, cardholder identification, expiration dates, bank branding, and flip CVV security.
- **Streamlined Transaction Entry (`/add`)**: Split expense/income workflow, large numeric typography, category picker with colorful Lucide icons, default active wallet binding, and custom iOS wheel date picker.
- **Digital Receipt Capture (`/api/upload`)**: Direct upload integration to Cloudflare R2 object storage to attach receipt images and invoices to transaction records.
- **Privacy Mode**: 1-click balance obscuring toggle hiding all sensitive financial numbers behind asterisks (`••••••`) for safe usage in public spaces.
- **Adaptive Dynamic Theming (`ThemeContext.tsx`)**: Theme engine supporting dark and light modes alongside 5 accent color schemes (Emerald, Violet, Blue, Amber, Rose) injected into CSS custom properties.
- **Installable Progressive Web App (PWA)**: Standalone web app manifest, offline service worker caching (`sw.js`), in-app install prompt banner (`InstallPrompt.tsx`), and automated iOS `.mobileconfig` web clip profile generator (`/api/ios-profile`).
- **Edge Serverless Architecture (`worker.js`)**: Single edge worker bundling static asset delivery via `env.ASSETS` and RESTful API endpoints with PBKDF2 password derivation (100,000 iterations) and HMAC-SHA256 JWT tokens.

---

## Tech Stack

| Category | Technologies | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | Next.js `16.1.1` (App Router, Static Export), React `19.2.3` | Modern SPA foundation with fast client-side routing and pre-rendered shell |
| **Styling & Design System** | Tailwind CSS `v4.0`, CSS Custom Properties | Utility-first responsive styling with dynamic accent color tokens and glassmorphism |
| **Motion & Micro-interactions** | Framer Motion `12.25.0` | 3D interactive sidebar tilt, tab transitions, and animated modal drawers |
| **Database & Storage** | Cloudflare D1 (SQLite), Cloudflare R2 | Serverless relational edge database for financial records and object storage for receipts |
| **Edge API Bridge** | Cloudflare Pages Worker (`worker.js`) | Single unified edge script serving static assets and handling secure `/api/*` endpoints |
| **Security & Authentication** | PBKDF2 (100,000 rounds, Web Crypto), HMAC-SHA256 JWT | Edge-native password hashing, token creation, and stateless authorization |
| **PWA & Device Integration** | Service Worker (`sw.js`, Workbox), Web App Manifest | Standalone display mode, offline asset caching, and iOS mobile configuration profiles |
| **Date & Icon Utilities** | Date-fns `4.1.0`, Lucide React `0.562.0` | Financial interval math, date formatting, and category vector iconography |

---

## Database Architecture

MoneW utilizes Cloudflare D1, a serverless relational database built on SQLite with ACID transaction guarantees. The schema (`schema.sql`) organizes data across 5 normalized tables:

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
    receiptUrl TEXT,                              -- Cloudflare R2 public URL
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
│   ├── login/               # Glassmorphism authentication and registration
│   ├── profile/             # Profile settings, theme selector, and iOS profile
│   ├── stats/               # Cashflow, percentage breakdown, and transaction ledger
│   ├── wallets/             # Multi-wallet accounts, limits, and transfer drawer
│   ├── globals.css          # Tailwind CSS v4 variables and theme tokens
│   ├── layout.tsx           # Global app shell, providers, and viewport setup
│   └── page.tsx             # Primary overview dashboard and recent feed
├── components/
│   ├── layout/              # MobileLayout wrapper and safe area padding
│   ├── ui/                  # GlassCard, Icon, IOSDatePicker, ConfirmModal, Modal
│   ├── AuthWrapper.tsx      # Client-side JWT session gateway
│   ├── BottomNav.tsx        # Mobile tab bar with floating action button
│   ├── DesktopSidebar.tsx   # Interactive 3D tilt sidebar for desktop displays
│   ├── InstallPrompt.tsx    # Native PWA install notification banner
│   ├── Providers.tsx        # React context tree provider
│   └── SetupWizard.tsx      # First-launch currency and account onboarding modal
├── context/
│   ├── AuthContext.tsx      # Authentication state, login, register, and token sync
│   ├── StoreContext.tsx     # Financial store, wallet operations, and transaction CRUD
│   └── ThemeContext.tsx     # Color scheme (green, purple, blue, amber, rose) and dark mode
├── lib/
│   ├── types.ts             # TypeScript definitions for wallets, cards, and categories
│   └── utils.ts             # CSS class merging helper (clsx + twMerge)
├── public/
│   ├── manifest.json        # PWA application manifest
│   ├── monew-logo.png       # High-resolution application icon
│   └── sw.js                # Offline caching service worker
├── screenshots/             # MacBook Pro M4 & iPhone 16 Pro device showcase mockups
├── scripts/
│   ├── capture-all.mjs      # Production screenshot capture and mockup generator
│   └── seed.sql             # Turnkey database seed data with realistic Indonesian records
├── package.json
├── schema.sql               # SQLite schema definition for Cloudflare D1
├── tsconfig.json
├── worker.js                # Cloudflare Worker REST API and edge router
└── wrangler.jsonc           # Cloudflare Pages, D1, and R2 resource bindings
```

---

## Getting Started & Local Development

### Prerequisites

- **Node.js**: `20.x` or `22.x`
- **npm** or **pnpm**
- **Cloudflare Wrangler CLI**: Installed via npm or run directly with `npx wrangler`

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/widifirmaan/nextjs-pwa-moneymanagement.git
cd nextjs-pwa-moneymanagement

# Install dependencies
npm install
```

### 2. Environment & Database Configuration

MoneW uses Cloudflare D1 for SQLite persistence. You can run with local D1 emulation or bind directly to a remote Cloudflare D1 database.

#### Local D1 Database Setup:

```bash
# Apply schema to local SQLite instance
npx wrangler d1 execute monew-db --file=schema.sql

# Seed local database with demo user and realistic transactions
npm run seed
```

#### Remote Cloudflare D1 Setup:

If deploying to your own Cloudflare account, create the database and R2 bucket:

```bash
# 1. Create Cloudflare D1 database
npx wrangler d1 create monew-db

# 2. Create Cloudflare R2 bucket
npx wrangler r2 bucket create monew-images

# 3. Update database_id in wrangler.jsonc with your generated database ID

# 4. Apply schema and seed remote database
npx wrangler d1 execute monew-db --remote --file=schema.sql
npm run seed:remote
```

### 3. Local Development

Because MoneW pairs a Next.js static shell with a Cloudflare Edge Worker API (`worker.js`), you can run the full-stack edge environment locally:

```bash
# Build the application bundle and edge worker bridge
npm run build

# Start local Cloudflare Pages runtime with local D1 database emulation
npx wrangler pages dev out --d1 MONEY_DB=monew-db
```

Or run the fast Next.js development server for rapid UI iteration:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (Next.js) or [http://localhost:8788](http://localhost:8788) (Wrangler Pages Dev) in your browser.

---

## Production Build & Deployment

To deploy MoneW to Cloudflare Pages:

```bash
# 1. Compile Next.js static export and copy worker.js to out/_worker.js
npm run build

# 2. Deploy out/ directory to Cloudflare Pages
npm run deploy
```

---

## Author

Developed by **[Widi Firmansyah](https://widifirmaan.web.id)**.
