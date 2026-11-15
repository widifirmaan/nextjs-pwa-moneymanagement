# MoneW

> Modern progressive web app (PWA) for personal finance management, expense tracking, and visual analytics.

MoneW is an offline-capable, mobile-first progressive web application engineered for intuitive personal financial control. Built with Next.js 16 (App Router), React 19, Tailwind CSS 4, and Recharts, MoneW empowers users to monitor account balances, manage multiple payment cards and digital wallets, log categorised transactions, and analyze monthly cash flow with interactive visual charts.

[![Live Demo](https://img.shields.io/badge/Demo-nextjs--pwa--moneymanagement.vercel.app-10B981?style=flat-square&logo=vercel&logoColor=white)](https://nextjs-pwa-moneymanagement.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4.0-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Charts-Recharts_3.6-22C55E?style=flat-square)](https://recharts.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Installable-blueviolet?style=flat-square&logo=pwa&logoColor=white)](#features)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

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

## Core Features

- **Consolidated Financial Overview (`/`)**: Real-time net balance calculations, monthly income and expense metrics, and chronological transaction ledger.
- **Visual Cash Flow Analytics (`/stats`)**: Interactive monthly spending breakdown powered by Recharts with donut category charts and historical trends.
- **Card & Account Management (`/cards`, `/wallets`)**: Dedicated sub-ledgers for multiple physical debit/credit cards and e-wallet services (GoPay, OVO, Dana, Bank).
- **Streamlined Transaction Entry (`/add`)**: Clean expense and income modal with automatic date picking, dynamic category tagging, and note attachments.
- **Privacy Mode**: One-tap balance concealing toggle to obscure sensitive currency figures in public environments.
- **Installable PWA Architecture**: Native application feel with service worker caching, instant offline asset delivery, and mobile viewport optimizations.
- **Fluid Theme Engine**: Dark, Light, and System themes with instant switching and persistent `localStorage` synchronization.

---

## Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js `16.1.1` | Modern App Router, Server Components, and optimized image rendering |
| **Core UI Library** | React `19.2.3` | Modern hooks, concurrent rendering, and reactive state management |
| **Styling** | Tailwind CSS `4.0` | Next-gen CSS engine with lightning-fast utility parsing |
| **Data Visualization** | Recharts `3.6.0` | Responsive SVG chart primitives for financial trend analysis |
| **Animation Engine** | Framer Motion `12.25.0` | Gesture-aware transitions and modal layout animations |
| **Icons** | Lucide React `0.562.0` | Pixel-perfect vector icon system |
| **Date Utilities** | Date-fns `4.1.0` | Lightweight and immutable date parsing and formatting |

---

## Project Structure

```text
nextjs-pwa-moneymanagement/
├── app/
│   ├── add/                 # Add transaction modal route
│   ├── cards/               # Payment card management
│   ├── wallets/             # Digital wallets and accounts
│   ├── stats/               # Visual charts and spending statistics
│   ├── profile/             # User settings and privacy toggles
│   ├── login/               # Authentication entry point
│   ├── layout.tsx           # Global app shell and navigation
│   └── page.tsx             # Primary dashboard and recent ledger
├── components/              # Reusable UI cards, inputs, charts, and navbar
├── context/                 # AuthContext, StoreContext, and ThemeContext
├── lib/                     # Database utilities and helper algorithms
├── raw_screenshots/         # High-resolution production screen captures
└── screenshots/             # MacBook Pro M4 & iPhone 16 Pro showcase mockups
```

---

## Getting Started & Local Development

### Prerequisites

- **Node.js**: Version 18.18.0 or higher
- **npm** or **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/widifirmaan/nextjs-pwa-moneymanagement.git
   cd nextjs-pwa-moneymanagement
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run local development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build production bundle**:
   ```bash
   npm run build
   ```

---

## License

This project is licensed under the [MIT License](LICENSE).
