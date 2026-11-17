# MoneW

> Progressive Web App (PWA) for multi-wallet personal finance management, expense tracking, payment card sub-ledgers, and monthly cashflow analytics.

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

## Screenshots

| Desktop | Mobile |
| :---: | :---: |
| **Balance & Net Worth Dashboard**<br>![Dashboard](screenshots/Dashboard%20Desktop.png) | **Balance & Net Worth Dashboard**<br>![Dashboard](screenshots/Dashboard%20Mobile.png) |
| **Wallets & Bank Accounts Hub**<br>![Wallets](screenshots/Wallets%20Desktop.png) | **Wallets & Bank Accounts Hub**<br>![Wallets](screenshots/Wallets%20Mobile.png) |
| **Saved Payment Cards Sub-Ledger**<br>![Cards](screenshots/Cards%20Desktop.png) | **Saved Payment Cards Sub-Ledger**<br>![Cards](screenshots/Cards%20Mobile.png) |
| **Cashflow & Spending Analytics**<br>![Analytics](screenshots/Analytics%20Desktop.png) | **Cashflow & Spending Analytics**<br>![Analytics](screenshots/Analytics%20Mobile.png) |
| **Add Transaction Form**<br>![Add Transaction](screenshots/Add%20Transaction%20Desktop.png) | **Add Transaction Form**<br>![Add Transaction](screenshots/Add%20Transaction%20Mobile.png) |
| **User Profile & Theme Accent Selector**<br>![Profile](screenshots/Profile%20Desktop.png) | **User Profile & Theme Accent Selector**<br>![Profile](screenshots/Profile%20Mobile.png) |
| **Authentication Portal (Login & Register)**<br>![Login](screenshots/Login%20Desktop.png) | **Authentication Portal (Login & Register)**<br>![Login](screenshots/Login%20Mobile.png) |

---

## Features

- **Consolidated Balance & Net Worth (`/`)**: Aggregated net worth tracking across all active wallets, current month income and expense totals, and real-time transaction ledger.
- **Multi-Wallet Accounts (`/wallets`)**: Dedicated sub-ledgers for commercial bank accounts (BCA, Mandiri), digital e-wallets (GoPay, OVO, DANA), and physical cash with inter-wallet balance transfers.
- **Spending Limits & Account Safety Freeze**: Configurable daily, weekly, and monthly threshold limits per wallet, paired with a one-tap account freeze toggle.
- **Payment Card Sub-Ledger (`/cards`)**: 3D card visualization supporting Visa and Mastercard networks with masked card numbers, expiration dates, and interactive 3D flip CVV inspection.
- **Cashflow & Spending Analytics (`/stats`)**: Timeframe filtering across "This Month", "Last Month", "Last 3 Months", or "Custom Range", percentage category breakdown, top 3 expense rankings, and a filterable transaction table.
- **Streamlined Transaction Entry (`/add`)**: Expense and income recording workflows with Lucide category icons, default source wallet selection, and wheel date picker.
- **Receipt Attachments (`/api/upload`)**: Support for attaching invoice and receipt image files to transaction records stored locally.
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
| **Database** | SQLite 3 | Local relational database for user profiles, wallets, cards, and transactions |
| **API Router** | Local Server Router (`worker.js`) | Local endpoint router handling `/api/*` data persistence |
| **Security & Auth** | PBKDF2 (100,000 rounds, Web Crypto), HMAC-SHA256 JWT | Local password hashing and stateless token authentication |
| **PWA Capabilities** | Service Worker (`sw.js`), Web App Manifest | Offline asset caching and standalone installation |
| **Utilities** | Date-fns `4.1.0`, Lucide React `0.562.0` | Date interval math and UI vector iconography |

---

## Database Architecture

MoneW organizes financial records in a relational SQLite database with ACID transaction guarantees. The schema is defined in `schema.sql`:

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

## Local Setup & Deployment

### 1. Prerequisites

- **Node.js**: Version `20.x` or `22.x`
- **npm** or **pnpm**
- **SQLite 3**: Native CLI (`sqlite3`)

### 2. Environment Variables Setup

Create a `.env.local` file in the project root:

```env
JWT_SECRET=dev-secret-key-change-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Installation

```bash
# Clone the repository
git clone https://github.com/widifirmaan/nextjs-pwa-moneymanagement.git
cd nextjs-pwa-moneymanagement

# Install dependencies
npm install
```

### 4. Local Database & Seeder Setup

Initialize the SQLite database schema and seed default records:

```bash
# Initialize schema and seed data
sqlite3 local.db < schema.sql
sqlite3 local.db < scripts/seed.sql
```

#### Pre-seeded Demo Data:
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

```bash
# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Manual Testing Checklist

| No | Feature | Test Steps | Expected Result |
| :---: | :--- | :--- | :--- |
| 1 | **Login Gateway** | Navigate to `/login`, enter `vejoyf@gmail.com` | Authentication succeeds and redirects to dashboard `/` |
| 2 | **Consolidated Net Worth** | Verify summary card on dashboard `/` | Displays combined balance across all 4 wallets (~Rp 46,650,000) |
| 3 | **Analytics Filtering** | Open `/stats`, toggle timeframe dropdown | Renders spending charts, percentage breakdowns, and top 3 categories |
| 4 | **Add Transaction** | Go to `/add`, select Expense, enter `50000`, choose `Food & Drink`, choose `GoPay`, submit | Transaction is saved and GoPay balance decreases by `Rp 50,000` |
| 5 | **Payment Cards Hub** | Open `/cards` | Displays 3 cards (BCA, Mandiri, Jenius) with interactive 3D flip CVV preview |
| 6 | **Privacy Mode** | Click the eye icon in the header | All sensitive financial figures are masked with asterisks (`••••••`) |

---

## Author

Developed by **[Widi Firmansyah](https://widifirmaan.web.id)**.
