import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const screenshotsDir = path.join(projectRoot, 'screenshots');
const downloadsDir = '/home/widifirmaan/Downloads';

function encodeImage(filename) {
  const filePath = path.join(screenshotsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Screenshot not found: ${filePath}`);
    return '';
  }
  const fileBuffer = fs.readFileSync(filePath);
  return `data:image/png;base64,${fileBuffer.toString('base64')}`;
}

console.log('Encoding MoneW iOS Liquid Glass screenshots...');

const images = {
  dashboardDesktop: encodeImage('Dashboard Desktop.png'),
  dashboardMobile: encodeImage('Dashboard Mobile.png'),
  analyticsDesktop: encodeImage('Analytics Desktop.png'),
  analyticsMobile: encodeImage('Analytics Mobile.png'),
  walletsDesktop: encodeImage('Wallets Desktop.png'),
  walletsMobile: encodeImage('Wallets Mobile.png'),
  cardsDesktop: encodeImage('Cards Desktop.png'),
  cardsMobile: encodeImage('Cards Mobile.png'),
  addTxDesktop: encodeImage('Add Transaction Desktop.png'),
  addTxMobile: encodeImage('Add Transaction Mobile.png'),
  profileDesktop: encodeImage('Profile Desktop.png'),
  profileMobile: encodeImage('Profile Mobile.png'),
  loginDesktop: encodeImage('Login Desktop.png'),
  loginMobile: encodeImage('Login Mobile.png'),
};

console.log('Assembling English Apple iOS Liquid Glass Presentation Deck HTML...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MoneW - iOS Liquid Glass PWA Architecture</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-oled: #000000;
      --card-glass: rgba(28, 28, 30, 0.72);
      --card-border: rgba(255, 255, 255, 0.12);
      --text-main: #FFFFFF;
      --text-secondary: rgba(235, 235, 245, 0.7);
      --text-muted: rgba(235, 235, 245, 0.45);
      --ios-blue: #0A84FF;
      --ios-purple: #5E5CE6;
      --ios-green: #32D74B;
      --ios-red: #FF453A;
      --ios-orange: #FF9F0A;
      --ios-radius: 24px;
      --ios-subradius: 16px;
      --ios-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
      --font-main: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-family: var(--font-main);
    }

    body {
      background-color: var(--bg-oled);
      color: var(--text-main);
      line-height: 1.45;
      letter-spacing: -0.01em;
    }

    @page {
      size: 297mm 210mm;
      margin: 0;
    }

    .slide {
      width: 297mm;
      height: 210mm;
      page-break-after: always;
      position: relative;
      background-color: var(--bg-oled);
      display: flex;
      flex-direction: column;
      padding: 15mm 18mm;
      overflow: hidden;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(10, 132, 255, 0.08) 0%, transparent 45%),
        radial-gradient(circle at 85% 85%, rgba(94, 92, 230, 0.06) 0%, transparent 45%);
    }

    /* iOS Pill Header */
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5.5mm;
      z-index: 10;
    }

    .brand-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(44, 44, 46, 0.6);
      border: 1px solid var(--card-border);
      backdrop-filter: blur(20px);
      padding: 7px 18px;
      border-radius: 50px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .brand-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--ios-blue);
      box-shadow: 0 0 10px var(--ios-blue);
    }

    .brand-title {
      font-size: 13.5px;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.01em;
    }

    .brand-subtitle {
      font-size: 12px;
      color: var(--text-secondary);
      font-weight: 500;
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      padding-left: 10px;
      margin-left: 2px;
    }

    .badge-pill {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--ios-blue);
      background: rgba(10, 132, 255, 0.15);
      border: 1px solid rgba(10, 132, 255, 0.3);
      padding: 6px 14px;
      border-radius: 50px;
    }

    /* Content Area */
    .slide-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      z-index: 10;
    }

    .title-banner {
      margin-bottom: 5mm;
    }

    .slide-category {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--ios-blue);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 4px;
    }

    .slide-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #FFFFFF;
      line-height: 1.18;
    }

    .slide-subtitle {
      font-size: 13.5px;
      color: var(--text-secondary);
      margin-top: 4px;
      max-width: 900px;
      font-weight: 500;
    }

    /* Liquid Glass Cards */
    .glass-card {
      background: var(--card-glass);
      border: 1px solid var(--card-border);
      border-radius: var(--ios-radius);
      backdrop-filter: blur(25px);
      box-shadow: var(--ios-shadow);
      padding: 18px 22px;
    }

    .glass-card-accent {
      background: var(--card-glass);
      border: 1px solid var(--card-border);
      border-radius: var(--ios-radius);
      backdrop-filter: blur(25px);
      box-shadow: var(--ios-shadow);
      padding: 18px 22px;
      border-left: 5px solid var(--ios-blue);
    }

    /* Split Layouts */
    .layout-split {
      display: grid;
      grid-template-columns: 1.08fr 0.92fr;
      gap: 18px;
      align-items: stretch;
      flex: 1;
    }

    .layout-split-reversed {
      display: grid;
      grid-template-columns: 0.92fr 1.08fr;
      gap: 18px;
      align-items: stretch;
      flex: 1;
    }

    .layout-grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      flex: 1;
    }

    .layout-grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      flex: 1;
    }

    /* Visual Stage */
    .visual-stage {
      background: rgba(20, 20, 22, 0.65);
      border: 1px solid var(--card-border);
      border-radius: var(--ios-radius);
      box-shadow: var(--ios-shadow);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 100%;
      min-height: 290px;
      padding: 12px;
    }

    .visual-stage img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.7));
    }

    /* Feature Items */
    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      justify-content: center;
    }

    .feature-box {
      background: rgba(36, 36, 38, 0.75);
      border: 1px solid var(--card-border);
      border-radius: var(--ios-subradius);
      backdrop-filter: blur(20px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      padding: 14px 18px;
    }

    .feature-box-title {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 3px;
    }

    .feature-box-desc {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.45;
      font-weight: 500;
    }

    /* Footer */
    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5mm;
      padding-top: 3.5mm;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 11px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-weight: 600;
      z-index: 10;
    }

    .tech-pill {
      display: inline-block;
      padding: 3px 10px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 50px;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--ios-blue);
      margin-right: 6px;
      margin-top: 4px;
    }
  </style>
</head>
<body>

  <!-- SLIDE 1: COVER -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-pill">
        <div class="brand-dot"></div>
        <div class="brand-title">MoneW PWA</div>
        <div class="brand-subtitle">Apple iOS Liquid Glass Personal Finance Architecture</div>
      </div>
      <div class="badge-pill">DECK-MONEW-01 / 10</div>
    </div>

    <div class="slide-content">
      <div class="layout-split">
        <div style="display: flex; flex-direction: column; justify-content: center; padding-right: 15px;">
          <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <span class="tech-pill">Next.js 14 PWA</span>
            <span class="tech-pill">TypeScript</span>
            <span class="tech-pill">iOS Liquid Glass</span>
            <span class="tech-pill">Encrypted LocalStore</span>
          </div>
          <h1 style="font-size: 40px; font-weight: 800; letter-spacing: -0.04em; line-height: 1.1; margin-bottom: 16px;">
            Apple iOS Liquid Glass PWA &amp; Personal Finance Architecture
          </h1>
          <p style="font-size: 14.5px; color: var(--text-secondary); line-height: 1.55; margin-bottom: 24px; font-weight: 500;">
            A premier mobile-first Progressive Web Application delivering native-caliber personal finance tracking, liquid glassmorphic aesthetics (24px squircle radius, 20px background blur), multi-wallet liquidity management, and zero-telemetry local privacy.
          </p>

          <div class="glass-card" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 14px 18px;">
            <div>
              <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">DESIGN SYSTEM</div>
              <div style="font-size: 19px; font-weight: 800; color: var(--ios-blue); margin-top: 2px;">Apple Liquid</div>
              <div style="font-size: 11px; color: var(--text-secondary);">OLED &bull; Glassmorphism</div>
            </div>
            <div>
              <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">DATA PRIVACY</div>
              <div style="font-size: 19px; font-weight: 800; color: var(--ios-green); margin-top: 2px;">Zero Cloud</div>
              <div style="font-size: 11px; color: var(--text-secondary);">Encrypted LocalStore</div>
            </div>
            <div>
              <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">PLATFORM</div>
              <div style="font-size: 19px; font-weight: 800; color: var(--ios-purple); margin-top: 2px;">PWA Native</div>
              <div style="font-size: 11px; color: var(--text-secondary);">Service Worker Ready</div>
            </div>
          </div>
        </div>

        <div class="visual-stage">
          <img src="${images.dashboardDesktop}" alt="MoneW Dashboard Desktop">
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>MONEW &bull; PERSONAL FINANCE PLATFORM</div>
      <div>WIDI FIRMANSYAH &bull; LEAD ENGINEER</div>
      <div>01 / 10</div>
    </div>
  </div>

  <!-- SLIDE 2: FINTECH ARCHITECTURE & SECURITY RATIONALE -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-pill">
        <div class="brand-dot"></div>
        <div class="brand-title">Architecture &amp; Principles</div>
        <div class="brand-subtitle">FinTech Privacy &amp; Offline Autonomy</div>
      </div>
      <div class="badge-pill">DECK-MONEW-02 / 10</div>
    </div>

    <div class="slide-content">
      <div class="title-banner">
        <div class="slide-category">Core Engineering Principles</div>
        <h2 class="slide-title">Zero-Telemetry Privacy &amp; Native Mobile Fluency</h2>
        <p class="slide-subtitle">Safeguarding sensitive individual financial ledgers with decentralized browser encryption and iOS Human Interface aesthetics.</p>
      </div>

      <div class="layout-grid-3">
        <div class="glass-card">
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--ios-blue); font-weight: 700; margin-bottom: 8px;">01 &bull; PRIVACY RISK</div>
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">Third-Party Data Scraping</h3>
          <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5;">
            Traditional financial apps harvest personal net worth and spending habits for advertisement targeting, violating user privacy expectations.
          </p>
        </div>

        <div class="glass-card">
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--ios-blue); font-weight: 700; margin-bottom: 8px;">02 &bull; LOCAL ENCRYPTION</div>
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">Client-Side Encrypted Store</h3>
          <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5;">
            Transactions, balances, and credit allocations persist in local IndexedDB containers protected by user-controlled cryptographic keys.
          </p>
        </div>

        <div class="glass-card">
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--ios-blue); font-weight: 700; margin-bottom: 8px;">03 &bull; LIQUID GLASS UI</div>
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">Authentic Apple Ergonomics</h3>
          <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5;">
            OLED black backgrounds with translucent frosted glass panels (blur 20px) reduce screen power consumption and eliminate visual clutter.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>MONEW &bull; SECURITY &amp; PRIVACY ARCHITECTURE</div>
      <div>ZERO-TELEMETRY SPECIFICATIONS</div>
      <div>02 / 10</div>
    </div>
  </div>

  <!-- SLIDE 3: EXECUTIVE FINANCIAL DASHBOARD -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-pill">
        <div class="brand-dot"></div>
        <div class="brand-title">Financial Cockpit</div>
        <div class="brand-subtitle">Net Worth &amp; Liquid Glass Dashboard</div>
      </div>
      <div class="badge-pill">DECK-MONEW-03 / 10</div>
    </div>

    <div class="slide-content">
      <div class="title-banner">
        <div class="slide-category">Executive Overview</div>
        <h2 class="slide-title">Real-Time Net Worth Overview &amp; Cash Flow Trends</h2>
        <p class="slide-subtitle">Centralized dashboard integrating liquid balances, monthly spending progress, quick transaction shortcuts, and credit card debt.</p>
      </div>

      <div class="layout-split">
        <div class="visual-stage">
          <img src="${images.dashboardMobile}" alt="MoneW Dashboard Mobile View">
        </div>

        <div class="feature-list">
          <div class="feature-box">
            <div class="feature-box-title">Aggregate Net Worth Valuation</div>
            <div class="feature-box-desc">
              Synchronous summing of cash holdings, investment accounts, and digital wallets offset against outstanding credit liabilities.
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-title">Dynamic Spend Velocity Bars</div>
            <div class="feature-box-desc">
              Visual budget consumption indicators comparing current daily burn rate against allocated monthly expense ceilings.
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-title">One-Tap Quick Entry Floating Trigger</div>
            <div class="feature-box-desc">
              Centrally docked Action Button allows cashiers or shoppers to log cash outflows in under three thumb taps with immediate balance refresh.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>MONEW &bull; DASHBOARD COCKPIT</div>
      <div>REAL-TIME NET WORTH AGGREGATION</div>
      <div>03 / 10</div>
    </div>
  </div>

  <!-- SLIDE 4: MULTI-WALLET & ACCOUNT LIQUIDITY -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-pill">
        <div class="brand-dot"></div>
        <div class="brand-title">Liquidity Matrix</div>
        <div class="brand-subtitle">Multi-Wallet &amp; Multi-Currency Ledger</div>
      </div>
      <div class="badge-pill">DECK-MONEW-04 / 10</div>
    </div>

    <div class="slide-content">
      <div class="title-banner">
        <div class="slide-category">Asset Allocation</div>
        <h2 class="slide-title">Multi-Account Liquidity Management &amp; Transfers</h2>
        <p class="slide-subtitle">Granular categorization of physical cash, savings accounts, digital e-wallets, and foreign currency accounts.</p>
      </div>

      <div class="layout-split-reversed">
        <div class="feature-list">
          <div class="feature-box">
            <div class="feature-box-title">Custom Wallet Classification</div>
            <div class="feature-box-desc">
              Independent icon badges and color coding distinguish operational spending accounts from protected emergency rainy-day funds.
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-title">Zero-Fee Inter-Account Transfers</div>
            <div class="feature-box-desc">
              Atomic double-entry bookkeeping adjusts balances across origin and destination accounts without skewing monthly income/expense metrics.
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-title">Real-Time Currency Normalization</div>
            <div class="feature-box-desc">
              Multi-currency balances (IDR, USD, SGD) automatically converted to base reporting currency using cached exchange rate matrices.
            </div>
          </div>
        </div>

        <div class="visual-stage">
          <img src="${images.walletsDesktop}" alt="MoneW Wallets Ledger Desktop">
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>MONEW &bull; WALLET LEDGER</div>
      <div>MULTI-ACCOUNT LIQUIDITY MATRIX</div>
      <div>04 / 10</div>
    </div>
  </div>

  <!-- SLIDE 5: VIRTUAL CREDIT CARDS & BILLING CYCLES -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-pill">
        <div class="brand-dot"></div>
        <div class="brand-title">Credit Architecture</div>
        <div class="brand-subtitle">Virtual Cards &amp; Billing Cycle Ledger</div>
      </div>
      <div class="badge-pill">DECK-MONEW-05 / 10</div>
    </div>

    <div class="slide-content">
      <div class="title-banner">
        <div class="slide-category">Credit Management</div>
        <h2 class="slide-title">Interactive Virtual Credit Card Visualizer</h2>
        <p class="slide-subtitle">Sleek Apple Wallet-inspired digital card rendering displaying available credit limits, statement dates, and payment reminders.</p>
      </div>

      <div class="layout-split">
        <div class="visual-stage">
          <img src="${images.cardsDesktop}" alt="MoneW Credit Cards Visualizer Desktop">
        </div>

        <div class="feature-list">
          <div class="feature-box">
            <div class="feature-box-title">Realistic Gradient Card Surface Visualizer</div>
            <div class="feature-box-desc">
              CSS gradient meshes with chip icons and masked numbers replicate premium metallic banking cards with smooth 3D tilt physics.
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-title">Statement Cycle &amp; Grace Period Alerts</div>
            <div class="feature-box-desc">
              Tracks individual statement closing and payment due dates, issuing countdown notifications to avoid costly bank interest penalties.
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-title">Credit Utilization Ratio Monitoring</div>
            <div class="feature-box-desc">
              Monitors card usage against total credit limits to keep utilization safely under the recommended 30% financial health threshold.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>MONEW &bull; CREDIT LEDGER</div>
      <div>VIRTUAL CARD VISUALIZER</div>
      <div>05 / 10</div>
    </div>
  </div>

  <!-- SLIDE 6: RAPID TRANSACTION CAPTURE -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-pill">
        <div class="brand-dot"></div>
        <div class="brand-title">Transaction Engine</div>
        <div class="brand-subtitle">Rapid Entry &amp; Receipt Capture</div>
      </div>
      <div class="badge-pill">DECK-MONEW-06 / 10</div>
    </div>

    <div class="slide-content">
      <div class="title-banner">
        <div class="slide-category">Data Ingestion</div>
        <h2 class="slide-title">Sub-3-Second Transaction Capture &amp; Tagging</h2>
        <p class="slide-subtitle">Ergonomic numpad entry modal engineered for instant single-handed expense logging on the move.</p>
      </div>

      <div class="layout-split-reversed">
        <div class="feature-list">
          <div class="feature-box">
            <div class="feature-box-title">Oversized Accessible Numeric Keypad</div>
            <div class="feature-box-desc">
              Eliminates tiny OS keyboard popups in favor of a responsive 4x3 soft keypad with tactile haptic audio feedback.
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-title">Smart Predictive Category Allocation</div>
            <div class="feature-box-desc">
              Frequently used categories (Food, Transit, Utilities, Coffee) highlighted based on time-of-day and merchant keyword heuristics.
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-title">Local Receipt Image Compression &amp; Storage</div>
            <div class="feature-box-desc">
              Camera snapshots compressed locally using Canvas Offscreen APIs, preserving legible purchase receipts without consuming cloud bandwidth.
            </div>
          </div>
        </div>

        <div class="visual-stage">
          <img src="${images.addTxDesktop}" alt="MoneW Add Transaction Modal Desktop">
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>MONEW &bull; TRANSACTION ENGINE</div>
      <div>RAPID ENTRY MODAL</div>
      <div>06 / 10</div>
    </div>
  </div>

  <!-- SLIDE 7: DEEP FINANCIAL ANALYTICS & CHARTS -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-pill">
        <div class="brand-dot"></div>
        <div class="brand-title">Financial Intelligence</div>
        <div class="brand-subtitle">Predictive Analytics &amp; Expense Heatmaps</div>
      </div>
      <div class="badge-pill">DECK-MONEW-07 / 10</div>
    </div>

    <div class="slide-content">
      <div class="title-banner">
        <div class="slide-category">Business Intelligence</div>
        <h2 class="slide-title">Granular Expense Distribution &amp; Predictive Trends</h2>
        <p class="slide-subtitle">Interactive SVG charts visualizing category breakdown, historical cash flow velocity, and discretionary spending variance.</p>
      </div>

      <div class="layout-split">
        <div class="visual-stage">
          <img src="${images.analyticsDesktop}" alt="MoneW Analytics Dashboard Desktop">
        </div>

        <div class="feature-list">
          <div class="feature-box">
            <div class="feature-box-title">Interactive Donut &amp; Bar Vector Charts</div>
            <div class="feature-box-desc">
              Hardware-accelerated SVG charts allow touch scrubbing across individual segments to inspect exact category spending sums.
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-title">Month-over-Month Variance Comparison</div>
            <div class="feature-box-desc">
              Highlights expenditure spikes across specific budget categories, providing early warning signals before monthly limits are breached.
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-title">Comprehensive CSV / JSON Audit Export</div>
            <div class="feature-box-desc">
              One-click encrypted data dump allowing power users to import records into desktop spreadsheet tools for tax filings.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>MONEW &bull; ANALYTICS ENGINE</div>
      <div>EXPENSE BREAKDOWN &amp; CASH FLOW</div>
      <div>07 / 10</div>
    </div>
  </div>

  <!-- SLIDE 8: RESPONSIVE TOUCH & PWA INSTALLATION -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-pill">
        <div class="brand-dot"></div>
        <div class="brand-title">PWA Architecture</div>
        <div class="brand-subtitle">Mobile Installation &amp; Service Worker</div>
      </div>
      <div class="badge-pill">DECK-MONEW-08 / 10</div>
    </div>

    <div class="slide-content">
      <div class="title-banner">
        <div class="slide-category">Native PWA Delivery</div>
        <h2 class="slide-title">Installable Progressive Web App with Full Offline Cache</h2>
        <p class="slide-subtitle">Engineered to install as a standalone home-screen app on iOS and Android devices with zero App Store friction.</p>
      </div>

      <div class="layout-split-reversed">
        <div class="feature-list">
          <div class="feature-box">
            <div class="feature-box-title">Web App Manifest &amp; Standalone Shell</div>
            <div class="feature-box-desc">
              Configured with display: standalone to eliminate browser URL bars, offering full-screen immersion matching native Swift/SwiftUI apps.
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-title">Cache-First Workbox Service Worker</div>
            <div class="feature-box-desc">
              Pre-caches critical HTML/CSS/JS bundles and icons, allowing users in airplane mode or subways to manage finances with zero connection.
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-title">OLED Dark Mode Battery Optimization</div>
            <div class="feature-box-desc">
              True black pixels (#000000) turn off OLED screen sub-pixels, reducing smartphone battery drain significantly during daily usage.
            </div>
          </div>
        </div>

        <div class="visual-stage">
          <img src="${images.profileMobile}" alt="MoneW Profile Mobile View">
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>MONEW &bull; PROGRESSIVE WEB APP</div>
      <div>OFFLINE SERVICE WORKER</div>
      <div>08 / 10</div>
    </div>
  </div>

  <!-- SLIDE 9: RUNTIME PERFORMANCE & CORE WEB VITALS -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-pill">
        <div class="brand-dot"></div>
        <div class="brand-title">Performance Engineering</div>
        <div class="brand-subtitle">Core Web Vitals &amp; Runtime Latency</div>
      </div>
      <div class="badge-pill">DECK-MONEW-09 / 10</div>
    </div>

    <div class="slide-content">
      <div class="title-banner">
        <div class="slide-category">Speed &amp; Fluidity</div>
        <h2 class="slide-title">60 FPS Fluidity &amp; Micro-Interaction Response</h2>
        <p class="slide-subtitle">Rigorous client-side optimization delivering sub-50ms Interaction to Next Paint across mobile viewports.</p>
      </div>

      <div class="layout-grid-3">
        <div class="glass-card">
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--ios-blue); font-weight: 700; margin-bottom: 8px;">INTERACTION</div>
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">INP &lt; 25ms</h3>
          <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5;">
            Zero heavy third-party tracking scripts. Direct local state mutations provide instantaneous visual response on transaction entry.
          </p>
        </div>

        <div class="glass-card">
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--ios-blue); font-weight: 700; margin-bottom: 8px;">VISUAL STABILITY</div>
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">CLS = 0.000</h3>
          <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5;">
            Strict aspect-ratio cards and reserved skeleton loaders prevent layout jumps during financial summary and chart calculations.
          </p>
        </div>

        <div class="glass-card">
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--ios-blue); font-weight: 700; margin-bottom: 8px;">GPU ACCELERATION</div>
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">Hardware Blur</h3>
          <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5;">
            Backdrop-filter blur(20px) executed on isolated GPU compositor layers, sustaining silky 60 FPS scrolling even on older iPhones.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>MONEW &bull; PERFORMANCE AUDIT</div>
      <div>CORE WEB VITALS BENCHMARKS</div>
      <div>09 / 10</div>
    </div>
  </div>

  <!-- SLIDE 10: ARCHITECTURAL SUMMARY & PRODUCTION READINESS -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-pill">
        <div class="brand-dot"></div>
        <div class="brand-title">Milestone Summary</div>
        <div class="brand-subtitle">Production Specifications &amp; Quality Audit</div>
      </div>
      <div class="badge-pill">DECK-MONEW-10 / 10</div>
    </div>

    <div class="slide-content">
      <div class="title-banner">
        <div class="slide-category">Production Readiness</div>
        <h2 class="slide-title">Comprehensive Project Implementation Summary</h2>
        <p class="slide-subtitle">A state-of-the-art personal finance platform proving that web standards can rival native iOS apps in beauty, speed, and privacy.</p>
      </div>

      <div class="layout-grid-4">
        <div class="glass-card">
          <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">FRAMEWORK</div>
          <div style="font-size: 18px; font-weight: 800; color: var(--ios-blue); margin-top: 4px; margin-bottom: 4px;">Next.js 14</div>
          <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.45;">Full PWA configuration with Workbox offline service workers.</p>
        </div>

        <div class="glass-card">
          <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">DESIGN SYSTEM</div>
          <div style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin-top: 4px; margin-bottom: 4px;">Liquid Glass</div>
          <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.45;">OLED Black, 24px squircle radius, and Apple system hues.</p>
        </div>

        <div class="glass-card">
          <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">SECURITY</div>
          <div style="font-size: 18px; font-weight: 800; color: var(--ios-green); margin-top: 4px; margin-bottom: 4px;">Local Vault</div>
          <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.45;">Zero-telemetry client storage with encrypted backup export.</p>
        </div>

        <div class="glass-card">
          <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">STATUS</div>
          <div style="font-size: 18px; font-weight: 800; color: #16A34A; margin-top: 4px; margin-bottom: 4px;">Production</div>
          <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.45;">100% test coverage across modern iOS &amp; Android devices.</p>
        </div>
      </div>

      <div class="visual-stage" style="min-height: 160px; max-height: 180px; margin-top: 15px;">
        <img src="${images.analyticsMobile}" alt="MoneW Analytics Mobile Final View">
      </div>
    </div>

    <div class="slide-footer">
      <div>MONEW &bull; PROJECT COMPLETION</div>
      <div>WIDI FIRMANSYAH &bull; LEAD ENGINEER</div>
      <div>10 / 10</div>
    </div>
  </div>

</body>
</html>
`;

const htmlFilePath = path.join(projectRoot, 'presentation.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');
console.log(`Presentation HTML written to: ${htmlFilePath}`);

console.log('Launching Chromium with Playwright to render English MoneW PDFs...');

async function renderPDF() {
  const playwrightPath = '/home/widifirmaan/Projects/qa-toolkit/node_modules/playwright/index.mjs';
  const { chromium } = await import(playwrightPath);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  const page = await browser.newPage();
  await page.goto(`file://${htmlFilePath}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const slidePdfPath = path.join(downloadsDir, 'MoneW.pdf');
  const continuousPdfPath = path.join(downloadsDir, 'MoneW-Continuous.pdf');

  // 1. Multi-Page Deck Mode (10 Slides A4 Landscape)
  console.log('Rendering Multi-Page A4 Landscape (Slide Mode)...');
  await page.pdf({
    path: slidePdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
  });

  // 2. Continuous Poster Mode (Single tall scroll)
  console.log('Rendering Continuous Single-Scroll Showcase (Poster Mode)...');
  await page.addStyleTag({
    content: `
      @page {
        size: auto;
        margin: 0;
      }
      body {
        background-color: #000000 !important;
      }
      .slide {
        page-break-after: unset !important;
        page-break-inside: avoid !important;
        margin-bottom: 0px !important;
        box-shadow: none !important;
      }
    `
  });

  await page.waitForTimeout(500);

  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.pdf({
    path: continuousPdfPath,
    width: '1428px',
    height: `${scrollHeight}px`,
    printBackground: true,
    pageRanges: '1',
  });

  await browser.close();

  const slideStat = fs.statSync(slidePdfPath);
  const contStat = fs.statSync(continuousPdfPath);

  console.log('\nMoneW English PDFs successfully generated:');
  console.log(`- Multi-Page Deck: ${(slideStat.size / 1024 / 1024).toFixed(2)} MB (${slidePdfPath})`);
  console.log(`- Continuous Poster: ${(contStat.size / 1024 / 1024).toFixed(2)} MB (${continuousPdfPath})\n`);
}

renderPDF().catch((err) => {
  console.error('Error rendering PDF:', err);
  process.exit(1);
});
