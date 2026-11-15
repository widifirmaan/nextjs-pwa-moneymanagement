# MoneW

> Modern progressive web app (PWA) for personal finance management, expense tracking, and visual analytics.

MoneW is an installable Progressive Web App (PWA) for personal expense tracking and financial analysis, built with Next.js 16 (App Router), React 19, Tailwind CSS 4, and Recharts. Deployed as a static export on Cloudflare Pages via a custom Edge Worker bridge (`worker.js`), it features offline local storage persistence, multi-wallet and card tracking, visual category analytics, and customizable color themes.

[![Live Demo](https://img.shields.io/badge/Demo-nextjs--pwa--moneymanagement.vercel.app-10B981?style=flat-square&logo=vercel&logoColor=white)](https://nextjs-pwa-moneymanagement.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4.0-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Charts-Recharts_3.6-22C55E?style=flat-square)](https://recharts.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Installable-blueviolet?style=flat-square&logo=pwa&logoColor=white)](#features)

---

## Live Production

- **URL:** [https://nextjs-pwa-moneymanagement.vercel.app/](https://nextjs-pwa-moneymanagement.vercel.app/)
- **Deployment:** Vercel Edge Runtime & Cloudflare Pages compatibility
- **Form Factor:** PWA (Installable on iOS Safari and Android Chrome with standalone display)

---

## Showcase

| Desktop Interface (MacBook Pro M4) | Mobile Interface (iPhone 16 Pro) |
| :---: | :---: |
| **Financial Dashboard Desktop**<br>![Financial Dashboard Desktop](screenshots/MoneW%20Dashboard%20Desktop.png) | **Financial Dashboard Mobile**<br>![Financial Dashboard Mobile](screenshots/MoneW%20Dashboard%20Mobile.png) |
| **Monthly Analytics & Category Breakdown Desktop**<br>![Monthly Analytics Desktop](screenshots/MoneW%20Monthly%20Analytics%20Desktop.png) | **Monthly Analytics & Category Breakdown Mobile**<br>![Monthly Analytics Mobile](screenshots/MoneW%20Monthly%20Analytics%20Mobile.png) |
| **Linked Credit & Debit Cards Desktop**<br>![Linked Cards Desktop](screenshots/MoneW%20Linked%20Cards%20Desktop.png) | **Linked Credit & Debit Cards Mobile**<br>![Linked Cards Mobile](screenshots/MoneW%20Linked%20Cards%20Mobile.png) |
| **Digital Wallets & Accounts Desktop**<br>![Digital Wallets Desktop](screenshots/MoneW%20Digital%20Wallets%20Desktop.png) | **Digital Wallets & Accounts Mobile**<br>![Digital Wallets Mobile](screenshots/MoneW%20Digital%20Wallets%20Mobile.png) |
| **Add Transaction Flow Desktop**<br>![Add Transaction Desktop](screenshots/MoneW%20Add%20Transaction%20Desktop.png) | **Add Transaction Flow Mobile**<br>![Add Transaction Mobile](screenshots/MoneW%20Add%20Transaction%20Mobile.png) |

---

## Features

- **Consolidated Balance Ledger (`/`)**: Total balance tracking with monthly income versus expenses totals, recent transaction feeds, and category filter chips.
- **Interactive Financial Visualizations (`/stats`)**: Monthly expenditure trends and category distribution charts powered by Recharts with custom tooltips and percentage breakdowns.
- **Multi-Wallet Accounts (`/wallets`)**: Separate account ledgers for cash, bank savings, and digital e-wallets (GoPay, OVO, DANA, ShopeePay) with inter-wallet balance transfers.
- **Payment Card Sub-Ledgers (`/cards`)**: Credit and debit card manager tracking card networks, billing cycles, available credit lines, and linked expenditure totals.
- **Quick Transaction Entry (`/add`)**: Transaction entry form supporting Expense, Income, and Transfer types with category selection, iOS wheel date picker, and notes.
- **Onboarding Setup Wizard (`SetupWizard.tsx`)**: First-launch onboarding wizard to configure base currency (IDR, USD, EUR, etc.), initial wallet balances, and primary accounts.
- **Privacy Mode**: 1-click balance obscuring mode toggling asterisks (`••••••`) across financial figures for safe usage in public spaces.
- **Multi-Color Theme Accents (`ThemeContext.tsx`)**: Dynamic CSS theme engine supporting system dark/light switching and customizable accent color schemes (Emerald, Violet, Blue, Amber, Rose).
- **Installable Progressive Web App (PWA)**: Offline service worker caching, instant shell delivery, standalone application manifest, and native install prompt banner.
- **Data Backup & Profile Portability (`/profile`)**: Complete offline data export and restore in JSON format, along with user profile settings and account reset capability.

---

## Tech Stack

| Category | Technologies | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | Next.js `16.1.1`, React `19.2.3` | App Router architecture, static output export, and client state orchestration |
| **Styling & Theme** | Tailwind CSS `4.0` | Utility-first styling with native CSS variable color schemes |
| **Data Visualization** | Recharts `3.6.0` | SVG chart components for spending category breakdowns and monthly trends |
| **Transitions** | Framer Motion `12.25.0` | Smooth drawer transitions and modal overlays |
| **Date Utilities** | Date-fns `4.1.0` | Date parsing, interval calculations, and formatting |
| **Iconography** | Lucide React `0.562.0` | Vector line icons across navigation tabs and category badges |

---

## Project Structure

```bash
/
├── app/
│   ├── add/                 # Add transaction modal route
│   ├── cards/               # Payment card management
│   ├── wallets/             # Digital wallets and accounts
│   ├── stats/               # Visual charts and spending statistics
│   ├── profile/             # User settings and privacy toggles
│   ├── login/               # Authentication entry point
│   ├── layout.tsx           # Global app shell, bottom nav, and context providers
│   └── page.tsx             # Primary dashboard and recent ledger
├── components/              # Reusable UI cards, inputs, charts, and navbar
├── context/                 # AuthContext, StoreContext, and ThemeContext
├── lib/                     # Database utilities, sample transactions, and math helpers
├── screenshots/             # MacBook Pro M4 & iPhone 16 Pro showcase mockups
└── README.md
```

---

## Getting Started & Local Development

### Prerequisites

- **Node.js**: Version 18.18.0 or higher
- **npm** or **pnpm**

### Installation & Setup

> **Environment Variables:** No external database or API keys are required for local development. Default sample accounts, cards, and transactions run 100% in-browser via local persistence.

```bash
# 1. Clone the repository
git clone https://github.com/widifirmaan/nextjs-pwa-moneymanagement.git
cd nextjs-pwa-moneymanagement

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Production Build & Deployment

```bash
# Build optimized static export and copy Cloudflare worker bridge
npm run build

# Deploy to Cloudflare Pages via Wrangler CLI
npm run deploy
```

---

## Author

Developed by **[Widi Firmansyah](https://widifirmaan.web.id)**.
