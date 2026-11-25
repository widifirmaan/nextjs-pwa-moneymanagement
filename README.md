# MoneW - Smart Money Management

Fullstack personal finance Progressive Web App built with Next.js App Router, React, TypeScript, and SQLite/LibSQL.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-LibSQL-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

MoneW tracks multi-wallet balances, transactions, receipt images, spending limits, and saved payment cards through a unified web interface and REST API. Data persists in SQLite (`local.db`) out of the box during local development and can also connect to remote LibSQL/Turso databases.

## Live URL

- **URL:** [https://money.widifirmaan.web.id](https://money.widifirmaan.web.id)

## Features

- **Authentication and Onboarding:** PBKDF2-SHA256 password hashing with HS256 JWT authentication (`/login`), plus an interactive Setup Wizard for new accounts that initializes default categories and starting wallet balances via `POST /api/seed`.
- **Dashboard Overview (`/`):** Displays total net worth with privacy masking, all-time income and expense summary cards, active daily/weekly/monthly budget limit breach alerts, quick wallet modals, and recent transactions.
- **Multi-Wallet Management (`/wallets`):** Create, edit, and delete `bank`, `ewallet`, and `cash` wallets, configure daily/weekly/monthly expense limits, transfer funds between wallets (`POST /api/transfer`), and freeze wallets (`isFrozen`) with API-level enforcement blocking new, edited, or deleted transactions on frozen accounts.
- **Transaction Logging and Receipt Storage (`/add`):** Add income or expense entries with category icons, timestamps, notes, and image receipt uploads (`/api/upload` and `/api/receipts/*`), automatically updating the linked wallet balance.
- **Financial Analytics (`/stats`):** Filter transactions by preset ranges (`This Month`, `Last Month`, `Last 3 Months`, `Custom Range`), transaction type, wallet, or category, inspect top spending category progress bars, paginate results, and edit or delete entries in place.
- **Saved Payment Cards (`/cards`):** Store and manage credit/debit card details (`Visa`, `Mastercard`, `Amex`, `JCB`) with customizable gradient styles.
- **Theme Engine and PWA Support (`/profile`):** Switch across 9 color themes (`Emerald Dream`, `Dark Emerald`, `Dark`, `Light`, `Ocean Blue`, `Royal Purple`, `Coklat Jawa`, `Sunset Orange`, `Rose Garden`) persisted per user, update profile names, reset user data, install via Web App Manifest, or download an iOS `.mobileconfig` web clip profile (`/api/ios-profile`).

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling and Motion:** Tailwind CSS 4, Framer Motion 12, Lucide React
- **Date Utilities:** date-fns 4
- **Database and Storage:** SQLite / LibSQL (`@libsql/client`), local receipt file storage (`.local-uploads/`) with data-URL fallback
- **Security:** Web Crypto API (`PBKDF2` password hashing and `HMAC-SHA256` JWT tokens)

## Screenshots

| Desktop | Mobile |
| :---: | :---: |
| ![Dashboard Desktop](screenshots/Dashboard%20Desktop.png) | ![Dashboard Mobile](screenshots/Dashboard%20Mobile.png) |
| ![Dashboard Wallet Details Desktop](screenshots/Dashboard%20Modal%20Wallet%20Details%20Desktop.png) | ![Dashboard Wallet Details Mobile](screenshots/Dashboard%20Modal%20Wallet%20Details%20Mobile.png) |
| ![Add Transaction Desktop](screenshots/Add%20Transaction%20Desktop.png) | ![Add Transaction Mobile](screenshots/Add%20Transaction%20Mobile.png) |
| ![Analytics Desktop](screenshots/Analytics%20Desktop.png) | ![Analytics Mobile](screenshots/Analytics%20Mobile.png) |
| ![Edit Transaction Desktop](screenshots/Analytics%20Modal%20Edit%20Transaction%20Desktop.png) | ![Edit Transaction Mobile](screenshots/Analytics%20Modal%20Edit%20Transaction%20Mobile.png) |
| ![Wallets Desktop](screenshots/Wallets%20Desktop.png) | ![Wallets Mobile](screenshots/Wallets%20Mobile.png) |
| ![Add Wallet Desktop](screenshots/Wallets%20Modal%20Add%20Wallet%20Desktop.png) | ![Add Wallet Mobile](screenshots/Wallets%20Modal%20Add%20Wallet%20Mobile.png) |
| ![Cards Desktop](screenshots/Cards%20Desktop.png) | ![Cards Mobile](screenshots/Cards%20Mobile.png) |
| ![Add Card Desktop](screenshots/Cards%20Modal%20Add%20Card%20Desktop.png) | ![Add Card Mobile](screenshots/Cards%20Modal%20Add%20Card%20Mobile.png) |
| ![Profile Desktop](screenshots/Profile%20Desktop.png) | ![Profile Mobile](screenshots/Profile%20Mobile.png) |
| ![Reset Confirm Desktop](screenshots/Profile%20Modal%20Reset%20Confirm%20Desktop.png) | ![Reset Confirm Mobile](screenshots/Profile%20Modal%20Reset%20Confirm%20Mobile.png) |
| ![Login Desktop](screenshots/Login%20Desktop.png) | ![Login Mobile](screenshots/Login%20Mobile.png) |
| ![Login Alert Desktop](screenshots/Login%20Alert%20Invalid%20Credentials%20Desktop.png) | ![Login Alert Mobile](screenshots/Login%20Alert%20Invalid%20Credentials%20Mobile.png) |

## Local Setup

### Prerequisites

- Node.js 18+ (tested with Node.js 26)
- npm

### Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables (optional)**

   The app runs with defaults out of the box using `local.db`. To set a custom JWT secret or connect to a remote LibSQL/Turso database, copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

3. **Initialize and seed the local SQLite database**

   ```bash
   npm run db:setup
   ```

   To wipe and recreate `local.db` from `schema.sql` and `scripts/seed.sql`:

   ```bash
   npm run db:reset
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open the application**

   Visit `http://localhost:3000`.

### Demo Credentials

| Account | Email | Password |
| :--- | :--- | :--- |
| Demo Account | `demo@monew.app` | `demo123` |

You can also create a new account from `/login`; default categories and a starter `Cash` wallet are seeded automatically on first sign-in.

## Author

**Widi Firmansyah** · [widifirmaan.web.id](https://widifirmaan.web.id)
