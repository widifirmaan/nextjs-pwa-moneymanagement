#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const screenshotsDir = path.join(projectRoot, 'screenshots');
const downloadsDir = '/home/widifirmaan/Downloads';
const artifactsDir = '/home/widifirmaan/.gemini/antigravity-cli/brain/08ebf919-b450-4a62-aa6d-40dba251fefc';

// Require Playwright from qa-toolkit
const { chromium } = await import('/home/widifirmaan/Projects/qa-toolkit/node_modules/playwright/index.mjs');

function loadBase64Image(filename) {
  const filePath = path.join(screenshotsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Warning: Image not found: ${filePath}`);
    return '';
  }
  const buffer = fs.readFileSync(filePath);
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

console.log('🖼️  Encoding MoneW screenshots into high-resolution base64 data URIs...');
const imgDashboard = loadBase64Image('Dashboard Desktop.png');
const imgDashboardMobile = loadBase64Image('Dashboard Mobile.png');
const imgWallets = loadBase64Image('Wallets Desktop.png');
const imgCards = loadBase64Image('Cards Desktop.png');
const imgAnalytics = loadBase64Image('Analytics Desktop.png');
const imgAnalyticsMobile = loadBase64Image('Analytics Mobile.png');
const imgAdd = loadBase64Image('Add Transaction Desktop.png');
const imgLoginAlert = loadBase64Image('Login Alert Invalid Credentials Desktop.png');
const imgProfile = loadBase64Image('Profile Desktop.png');

console.log('🎨 Constructing MoneW Modern Fintech PWA presentation deck...');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>MoneW PWA - Presentasi Arsitektur &amp; Fitur Web Keuangan</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap');

  @page {
    size: 297mm 210mm;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #0b0e14;
    color: #f1f5f9;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .slide {
    width: 297mm;
    height: 210mm;
    padding: 14mm 16mm;
    page-break-after: always;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #0b0e14 radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.12) 0%, rgba(11, 14, 20, 0.98) 75%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* Grid lines background */
  .fintech-bg {
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 15% 25%, rgba(16, 185, 129, 0.04) 0%, transparent 40%),
      radial-gradient(circle at 85% 75%, rgba(59, 130, 246, 0.04) 0%, transparent 40%),
      linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
    background-size: 100% 100%, 100% 100%, 36px 36px, 36px 36px;
    pointer-events: none;
    z-index: 1;
  }

  .slide-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Fintech Dark Card */
  .fintech-card {
    background: rgba(24, 28, 38, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 18px;
    padding: 18px 22px;
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  /* Pill Badge */
  .pill-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 15px;
    border-radius: 9999px;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.35);
    color: #10b981;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    width: fit-content;
  }

  .pill-badge.blue {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.35);
    color: #60a5fa;
  }

  .pill-badge.purple {
    background: rgba(168, 85, 247, 0.1);
    border-color: rgba(168, 85, 247, 0.35);
    color: #c084fc;
  }

  /* Typography */
  .gradient-title {
    font-size: 2.4rem;
    font-weight: 900;
    letter-spacing: -0.035em;
    line-height: 1.08;
    background: linear-gradient(180deg, #FFFFFF 20%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .gradient-emerald {
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Mockup Frame */
  .mockup-frame {
    background: #0f131a;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 25px 50px -10px rgba(0, 0, 0, 0.95), 0 0 25px rgba(16, 185, 129, 0.08);
    display: flex;
    flex-direction: column;
  }

  .mockup-header {
    background: #141923;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .traffic-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
  }
  .dot-red { background: #ef4444; }
  .dot-yellow { background: #f59e0b; }
  .dot-green { background: #10b981; }
  .browser-url {
    margin-left: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: #64748b;
    letter-spacing: 0.04em;
  }

  .mockup-img {
    width: 100%;
    height: auto;
    max-height: 122mm;
    display: block;
    object-fit: contain;
    background: #0f131a;
  }

  /* Page Number */
  .page-num {
    position: absolute;
    bottom: 11mm;
    right: 14mm;
    background: rgba(255, 255, 255, 0.035);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #10b981;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 800;
    padding: 4px 14px;
    border-radius: 9999px;
    letter-spacing: 0.12em;
    z-index: 10;
  }

  /* Split layout */
  .split-layout {
    display: grid;
    grid-template-columns: 1fr 1.25fr;
    gap: 26px;
    align-items: center;
    height: 100%;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .split-layout.reverse {
    grid-template-columns: 1.25fr 1fr;
  }

  /* Feature Checklist Item */
  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 8px;
  }

  .feature-icon {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #10b981;
    font-size: 10.5px;
    font-weight: 900;
    flex-shrink: 0;
  }

  .feature-text h4 {
    font-size: 12px;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 2px;
  }

  .feature-text p {
    font-size: 10px;
    color: #94a3b8;
    line-height: 1.4;
  }

  /* Dual phone mockups */
  .dual-phone-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
  }

  .phone-mockup {
    width: 140px;
    border-radius: 22px;
    background: #000;
    border: 2px solid #1e293b;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.9), 0 0 20px rgba(16, 185, 129, 0.1);
    overflow: hidden;
  }

  .phone-mockup img {
    width: 100%;
    display: block;
  }

  .phone-mockup.tilt-left {
    transform: rotate(-3deg);
  }

  .phone-mockup.tilt-right {
    transform: rotate(3deg);
  }
</style>
</head>
<body>

  <!-- ========================================================================= -->
  <!-- SLIDE 01: COVER -->
  <!-- ========================================================================= -->
  <section class="slide">
    <div class="fintech-bg"></div>
    <div class="slide-content" style="justify-content: center; align-items: center; text-align: center;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 860px;">
        <div class="pill-badge">
          <span>●</span> WEB APPLICATION SHOWCASE · 2026
        </div>
        <h1 class="gradient-title" style="font-size: 4.2rem; line-height: 1;">
          MONEW <span class="gradient-emerald">FINANCE PWA</span>
        </h1>
        <div class="fintech-card" style="padding: 12px 28px; margin-top: 6px;">
          <p style="font-size: 14px; font-weight: 600; color: #cbd5e1; letter-spacing: 0.02em;">
            Personal Finance Management &amp; Real-time Budgeting PWA
          </p>
        </div>
        
        <p style="font-size: 12px; color: #94a3b8; max-width: 680px; line-height: 1.6; margin-top: 6px;">
          Aplikasi web progresif (PWA) untuk pencatatan keuangan personal dengan validasi formula saldo matematis, visualisasi diagram analitik Recharts, manajemen multi-dompet dan kartu virtual, serta kesiapan operasi offline.
        </p>

        <div style="display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap; justify-content: center;">
          <span style="font-size: 10px; font-weight: 700; color: #94a3b8; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 5px 12px; border-radius: 9999px;">Next.js 16</span>
          <span style="font-size: 10px; font-weight: 700; color: #94a3b8; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 5px 12px; border-radius: 9999px;">React 19</span>
          <span style="font-size: 10px; font-weight: 700; color: #94a3b8; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 5px 12px; border-radius: 9999px;">Framer Motion</span>
          <span style="font-size: 10px; font-weight: 700; color: #94a3b8; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 5px 12px; border-radius: 9999px;">Recharts</span>
          <span style="font-size: 10px; font-weight: 700; color: #94a3b8; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 5px 12px; border-radius: 9999px;">Cloudflare D1</span>
          <span style="font-size: 10px; font-weight: 700; color: #94a3b8; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 5px 12px; border-radius: 9999px;">PWA Manifest</span>
        </div>

        <div style="margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px; width: 100%;">
          <p style="font-size: 11px; font-weight: 800; color: #f8fafc; letter-spacing: 0.1em; text-transform: uppercase;">
            WIDI FIRMAAN <span style="color: #64748b; font-weight: 400;">|</span> LEAD FULLSTACK DEVELOPER
          </p>
          <p style="font-size: 9.5px; color: #64748b; margin-top: 2px;">Dokumentasi &amp; Presentasi Arsitektur Web Keuangan PWA</p>
        </div>
      </div>
    </div>
    <div class="page-num">01</div>
  </section>

  <!-- ========================================================================= -->
  <!-- SLIDE 02: FITUR WEB - FINANCIAL DASHBOARD & MATH CHECK -->
  <!-- ========================================================================= -->
  <section class="slide">
    <div class="fintech-bg"></div>
    <div class="slide-content">
      <div class="split-layout">
        <!-- Left: Text -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="pill-badge">
            <span>01</span> FITUR WEB: FINANCIAL DASHBOARD
          </div>
          <h2 class="gradient-title">
            Real-time Balance &amp; Math Verification
          </h2>
          <div class="fintech-card">
            <p style="font-size: 11.5px; line-height: 1.6; color: #cbd5e1;">
              Halaman ikhtisar utama yang menyajikan Total Saldo, Pemasukan, dan Pengeluaran secara real-time dengan format mata uang Rupiah dan verifikasi otomatis formula konsistensi: <code style="color: #10b981; font-family: monospace;">Saldo = Pemasukan - Pengeluaran</code>.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 2px;">
            <div class="feature-item">
              <div class="feature-icon">✓</div>
              <div class="feature-text">
                <h4>Kalkulasi Agregat Mutasi Instan</h4>
                <p>Menghitung total kas masuk dan keluar secara reaktif di client-side tanpa reload halaman.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">✓</div>
              <div class="feature-text">
                <h4>Format Mata Uang Rupiah (Rp)</h4>
                <p>Penggunaan pemisah ribuan otomatis dengan pembacaan jelas pada nominal angka besar.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">✓</div>
              <div class="feature-text">
                <h4>Kartu Metrik Finansial Dinamis</h4>
                <p>Indikator visual warna hijau untuk pemasukan dan merah koral untuk pengeluaran bulanan.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Mockup -->
        <div class="mockup-frame">
          <div class="mockup-header">
            <div class="traffic-dot dot-red"></div>
            <div class="traffic-dot dot-yellow"></div>
            <div class="traffic-dot dot-green"></div>
            <span class="browser-url">https://money.widifirmaan.web.id/</span>
          </div>
          <img class="mockup-img" src="${imgDashboard}" alt="Dashboard MoneW Desktop" />
        </div>
      </div>
    </div>
    <div class="page-num">02</div>
  </section>

  <!-- ========================================================================= -->
  <!-- SLIDE 03: FITUR WEB - MULTI WALLET MANAGEMENT -->
  <!-- ========================================================================= -->
  <section class="slide">
    <div class="fintech-bg"></div>
    <div class="slide-content">
      <div class="split-layout reverse">
        <!-- Left: Mockup -->
        <div class="mockup-frame">
          <div class="mockup-header">
            <div class="traffic-dot dot-red"></div>
            <div class="traffic-dot dot-yellow"></div>
            <div class="traffic-dot dot-green"></div>
            <span class="browser-url">https://money.widifirmaan.web.id/wallets</span>
          </div>
          <img class="mockup-img" src="${imgWallets}" alt="Multi-Wallet Management" />
        </div>

        <!-- Right: Text -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="pill-badge blue">
            <span>02</span> FITUR WEB: WALLET MANAGEMENT
          </div>
          <h2 class="gradient-title">
            Multi-Wallet Ledger &amp; Modal Details
          </h2>
          <div class="fintech-card">
            <p style="font-size: 11.5px; line-height: 1.6; color: #cbd5e1;">
              Manajemen dompet digital multi-akun (Rekening Bank, E-Wallet, Kas Fisik) dengan modal rincian transaksi terisolasi dan indikator persentase alokasi dana terhadap total portofolio kas.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 2px;">
            <div class="feature-item">
              <div class="feature-icon" style="background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.35); color: #60a5fa;">✦</div>
              <div class="feature-text">
                <h4>Modal Interaktif Framer Motion</h4>
                <p>Dialog detail transaksi dompet dengan animasi pop-in dan backdrop blur yang halus.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon" style="background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.35); color: #60a5fa;">✦</div>
              <div class="feature-text">
                <h4>Klasifikasi Entitas Keuangan</h4>
                <p>Mendukung kategori dompet fleksibel: Rekening Tabungan, Dompet Elektronik, dan Uang Tunai.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon" style="background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.35); color: #60a5fa;">✦</div>
              <div class="feature-text">
                <h4>Perhitungan Saldo Independen</h4>
                <p>Setiap dompet memelihara ledger mutasi sendiri tanpa tumpang tindih dengan saldo akun lain.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-num">03</div>
  </section>

  <!-- ========================================================================= -->
  <!-- SLIDE 04: FITUR WEB - VIRTUAL PAYMENT CARDS -->
  <!-- ========================================================================= -->
  <section class="slide">
    <div class="fintech-bg"></div>
    <div class="slide-content">
      <div class="split-layout">
        <!-- Left: Text -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="pill-badge purple">
            <span>03</span> FITUR WEB: CARDS VISUALIZER
          </div>
          <h2 class="gradient-title">
            Credit &amp; Debit Card Visualizer
          </h2>
          <div class="fintech-card">
            <p style="font-size: 11.5px; line-height: 1.6; color: #cbd5e1;">
              Sistem komponen visualisasi kartu perbankan virtual dengan efek gradien metalik, representasi chip EMV, indikator jaringan pembayaran (Visa, Mastercard), dan penomoran digit tersamarkan (*masked digits*).
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 2px;">
            <div class="feature-item">
              <div class="feature-icon" style="background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.35); color: #c084fc;">💳</div>
              <div class="feature-text">
                <h4>Dynamic Gradient Theming</h4>
                <p>Skema warna gradien otomatis yang disesuaikan dengan jenis kartu debit maupun kartu kredit.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon" style="background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.35); color: #c084fc;">💳</div>
              <div class="feature-text">
                <h4>Modal Form Tambah Kartu</h4>
                <p>Formulir entri kartu baru dengan validasi masa berlaku (MM/YY) dan batasan limit belanja.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon" style="background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.35); color: #c084fc;">💳</div>
              <div class="feature-text">
                <h4>Toggle Status Kartu Aktif</h4>
                <p>Memungkinkan pengguna menonaktifkan atau mengaktifkan kartu tanpa menghapus entri database.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Mockup -->
        <div class="mockup-frame">
          <div class="mockup-header">
            <div class="traffic-dot dot-red"></div>
            <div class="traffic-dot dot-yellow"></div>
            <div class="traffic-dot dot-green"></div>
            <span class="browser-url">https://money.widifirmaan.web.id/cards</span>
          </div>
          <img class="mockup-img" src="${imgCards}" alt="Virtual Payment Cards" />
        </div>
      </div>
    </div>
    <div class="page-num">04</div>
  </section>

  <!-- ========================================================================= -->
  <!-- SLIDE 05: FITUR WEB - RECHARTS EXPENSE ANALYTICS -->
  <!-- ========================================================================= -->
  <section class="slide">
    <div class="fintech-bg"></div>
    <div class="slide-content">
      <div class="split-layout reverse">
        <!-- Left: Mockup -->
        <div class="mockup-frame">
          <div class="mockup-header">
            <div class="traffic-dot dot-red"></div>
            <div class="traffic-dot dot-yellow"></div>
            <div class="traffic-dot dot-green"></div>
            <span class="browser-url">https://money.widifirmaan.web.id/stats</span>
          </div>
          <img class="mockup-img" src="${imgAnalytics}" alt="Recharts Financial Analytics" />
        </div>

        <!-- Right: Text -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="pill-badge">
            <span>04</span> FITUR WEB: RECHARTS ANALYTICS
          </div>
          <h2 class="gradient-title">
            Interactive Expense Visualization
          </h2>
          <div class="fintech-card">
            <p style="font-size: 11.5px; line-height: 1.6; color: #cbd5e1;">
              Visualisasi proporsi pengeluaran interaktif memanfaatkan pustaka <strong style="color:#10b981">Recharts</strong> (Pie Chart &amp; Bar Chart) dengan filter rentang waktu dinamis (Mingguan, Bulanan, Tahunan).
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 2px;">
            <div class="feature-item">
              <div class="feature-icon">📊</div>
              <div class="feature-text">
                <h4>Tooltip Interaktif &amp; Segment Highlight</h4>
                <p>Tooltip kustom yang menampilkan nominal rupiah dan persentase saat kursor menyentuh irisan diagram.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📊</div>
              <div class="feature-text">
                <h4>Pengelompokan Kategori Otomatis</h4>
                <p>Mengagregasi pengeluaran ke dalam kategori belanja (Makanan, Transportasi, Hiburan, Tagihan).</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📊</div>
              <div class="feature-text">
                <h4>Render SVG Responsif</h4>
                <p>Grafik berbasis vektor SVG yang menyesuaikan dimensi kontainer secara otomatis tanpa pixelated.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-num">05</div>
  </section>

  <!-- ========================================================================= -->
  <!-- SLIDE 06: FITUR WEB - TRANSACTION RECORDING & INPUT MASK -->
  <!-- ========================================================================= -->
  <section class="slide">
    <div class="fintech-bg"></div>
    <div class="slide-content">
      <div class="split-layout">
        <!-- Left: Text -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="pill-badge blue">
            <span>05</span> FITUR WEB: TRANSACTION FORM
          </div>
          <h2 class="gradient-title">
            Transaction Entry &amp; Input Masking
          </h2>
          <div class="fintech-card">
            <p style="font-size: 11.5px; line-height: 1.6; color: #cbd5e1;">
              Formulir pencatatan transaksi masuk dan keluar (<code style="font-family:monospace; background:rgba(255,255,255,0.06); padding:1px 4px; border-radius:4px">/add</code>) dengan pemilih kategori cepat, toggle tipe transaksi, input tanggal kalender, dan pemformatan angka otomatis.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 2px;">
            <div class="feature-item">
              <div class="feature-icon" style="background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.35); color: #60a5fa;">✏️</div>
              <div class="feature-text">
                <h4>Input Masking Pemisah Ribuan</h4>
                <p>Format nominal otomatis saat diketik tanpa menyebabkan pergeseran kursor pada keyboard.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon" style="background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.35); color: #60a5fa;">✏️</div>
              <div class="feature-text">
                <h4>Toggle Income vs Expense Instan</h4>
                <p>Peralihan tipe transaksi dengan perubahan tema tombol dinamis (Hijau untuk Pemasukan, Merah untuk Pengeluaran).</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon" style="background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.35); color: #60a5fa;">✏️</div>
              <div class="feature-text">
                <h4>Pemilihan Dompet Asal Sumber Dana</h4>
                <p>Dropdown sumber rekening yang menampilkan sisa saldo terkini secara transparan sebelum disimpan.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Mockup -->
        <div class="mockup-frame">
          <div class="mockup-header">
            <div class="traffic-dot dot-red"></div>
            <div class="traffic-dot dot-yellow"></div>
            <div class="traffic-dot dot-green"></div>
            <span class="browser-url">https://money.widifirmaan.web.id/add</span>
          </div>
          <img class="mockup-img" src="${imgAdd}" alt="Add Transaction Form" />
        </div>
      </div>
    </div>
    <div class="page-num">06</div>
  </section>

  <!-- ========================================================================= -->
  <!-- SLIDE 07: FITUR WEB - MOBILE PWA & SAFE AREA -->
  <!-- ========================================================================= -->
  <section class="slide">
    <div class="fintech-bg"></div>
    <div class="slide-content">
      <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;">
        <div class="pill-badge">
          <span>06</span> FITUR WEB: MOBILE PWA UX
        </div>
        <h2 class="gradient-title" style="font-size: 2.2rem;">
          Fixed Bottom Navigation &amp; Safe Area Insets
        </h2>
        <p style="font-size: 11.5px; color: #94a3b8; max-width: 650px;">
          Bilah navigasi bawah tetap (*fixed bottom bar*) ramah jempol dengan tombol aksi cepat (+) di tengah dan kompensasi bantalan safe-area iPhone 16 Pro.
        </p>
      </div>

      <div style="display: flex; align-items: center; justify-content: center; gap: 36px; margin: 12px 0;">
        <!-- Dual Phone Mockups -->
        <div class="dual-phone-container">
          <div class="phone-mockup tilt-left">
            <img src="${imgDashboardMobile}" alt="Mobile PWA Dashboard" />
          </div>
          <div class="phone-mockup tilt-right">
            <img src="${imgAnalyticsMobile}" alt="Mobile PWA Analytics" />
          </div>
        </div>

        <!-- Right Detail Card -->
        <div class="fintech-card" style="max-width: 380px; display: flex; flex-direction: column; gap: 10px;">
          <h3 style="font-size: 13.5px; font-weight: 800; color: #ffffff;">Prinsip Desain PWA Mobile:</h3>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <div class="feature-text">
              <h4>Fixed Bottom Bar dengan Tombol (+)</h4>
              <p>Navigasi utama tersemat di bagian bawah layar agar dapat dijangkau satu tangan dengan mudah.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <div class="feature-text">
              <h4>Safe Area Insets (env-safe-area)</h4>
              <p>Kompensasi bantalan bawah agar tombol navigasi tidak terhalang oleh home indicator bar iOS.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <div class="feature-text">
              <h4>Kesiapan Instalasi Web App Manifest</h4>
              <p>Dapat diinstal langsung ke homescreen perangkat mobile layaknya aplikasi native mandiri.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-num">07</div>
  </section>

  <!-- ========================================================================= -->
  <!-- SLIDE 08: FITUR WEB - AUTHENTICATION GATE & ALERTS -->
  <!-- ========================================================================= -->
  <section class="slide">
    <div class="fintech-bg"></div>
    <div class="slide-content">
      <div class="split-layout reverse">
        <!-- Left: Mockup -->
        <div class="mockup-frame">
          <div class="mockup-header">
            <div class="traffic-dot dot-red"></div>
            <div class="traffic-dot dot-yellow"></div>
            <div class="traffic-dot dot-green"></div>
            <span class="browser-url">https://money.widifirmaan.web.id/login</span>
          </div>
          <img class="mockup-img" src="${imgLoginAlert}" alt="Login Authentication Alert" />
        </div>

        <!-- Right: Text -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="pill-badge purple">
            <span>07</span> FITUR WEB: AUTH GATEWAY
          </div>
          <h2 class="gradient-title">
            Authentication Gate &amp; Alert Feedback
          </h2>
          <div class="fintech-card">
            <p style="font-size: 11.5px; line-height: 1.6; color: #cbd5e1;">
              Gerbang masuk aplikasi keuangan dengan proteksi rute internal, validasi form kredensial, dan komponen peringatan alert dinamis saat verifikasi email atau password tidak sesuai.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 2px;">
            <div class="feature-item">
              <div class="feature-icon" style="background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.35); color: #c084fc;">🔒</div>
              <div class="feature-text">
                <h4>Proteksi Rute Navigasi Internal</h4>
                <p>Mengalihkan pengunjung tanpa sesi autentikasi (<code style="color:#cbd5e1">monew_token</code>) secara tegas ke halaman login.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon" style="background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.35); color: #c084fc;">🔒</div>
              <div class="feature-text">
                <h4>Banner Alert Beranimasi</h4>
                <p>Komponen feedback kesalahan input dengan animasi slide-down dan border aksen merah peringatan.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon" style="background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.35); color: #c084fc;">🔒</div>
              <div class="feature-text">
                <h4>Penyimpanan Token Kredensial Aman</h4>
                <p>Session storage token terisolasi untuk otorisasi permintaan REST API ke Cloudflare D1.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-num">08</div>
  </section>

  <!-- ========================================================================= -->
  <!-- SLIDE 09: FITUR WEB - PROFILE & DATA MANAGEMENT -->
  <!-- ========================================================================= -->
  <section class="slide">
    <div class="fintech-bg"></div>
    <div class="slide-content">
      <div class="split-layout">
        <!-- Left: Text -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="pill-badge">
            <span>08</span> FITUR WEB: PROFILE &amp; DATA
          </div>
          <h2 class="gradient-title">
            Profile Management &amp; Data Control
          </h2>
          <div class="fintech-card">
            <p style="font-size: 11.5px; line-height: 1.6; color: #cbd5e1;">
              Pengaturan akun pengguna (<code style="font-family:monospace; background:rgba(255,255,255,0.06); padding:1px 4px; border-radius:4px">/profile</code>) dengan informasi identitas, preferensi sistem, dan dialog konfirmasi ganda sebelum melakukan tindakan reset database transaksi.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 2px;">
            <div class="feature-item">
              <div class="feature-icon">👤</div>
              <div class="feature-text">
                <h4>Informasi Akun &amp; Peran Pengguna</h4>
                <p>Menampilkan profil terautentikasi lengkap dengan status hak akses dan email terdaftar.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">👤</div>
              <div class="feature-text">
                <h4>Dialog Konfirmasi Destruktif</h4>
                <p>Modal peringatan dua langkah sebelum mereset riwayat transaksi untuk mencegah kehilangan data tidak sengaja.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">👤</div>
              <div class="feature-text">
                <h4>Pembersihan Sesi Logout Menyeluruh</h4>
                <p>Menghapus cache lokal dan token otentikasi secara bersih saat pengguna menekan tombol keluar.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Mockup -->
        <div class="mockup-frame">
          <div class="mockup-header">
            <div class="traffic-dot dot-red"></div>
            <div class="traffic-dot dot-yellow"></div>
            <div class="traffic-dot dot-green"></div>
            <span class="browser-url">https://money.widifirmaan.web.id/profile</span>
          </div>
          <img class="mockup-img" src="${imgProfile}" alt="User Profile Management" />
        </div>
      </div>
    </div>
    <div class="page-num">09</div>
  </section>

  <!-- ========================================================================= -->
  <!-- SLIDE 10: ARSITEKTUR TEKNOLOGI & RINGKASAN -->
  <!-- ========================================================================= -->
  <section class="slide">
    <div class="fintech-bg"></div>
    <div class="slide-content" style="align-items: center; text-align: center;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <div class="pill-badge">
          <span>09</span> ARSITEKTUR &amp; STACK TEKNOLOGI
        </div>
        <h2 class="gradient-title" style="font-size: 2.2rem;">
          The Architecture Behind MoneW PWA
        </h2>
      </div>

      <!-- 3 Stack Cards -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; width: 100%; max-width: 900px; margin: 12px 0;">
        <div class="fintech-card" style="text-align: left; padding: 14px 18px;">
          <h3 style="font-size: 12px; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
            CORE &amp; PWA
          </h3>
          <ul style="font-size: 10.5px; color: #cbd5e1; list-style: none; line-height: 1.8;">
            <li>✦ <strong>Next.js 16:</strong> Modern App Router &amp; SSR</li>
            <li>✦ <strong>React 19:</strong> Concurrent UI rendering</li>
            <li>✦ <strong>PWA Manifest:</strong> Homescreen installable</li>
            <li>✦ <strong>TypeScript:</strong> Type-safe interfaces</li>
          </ul>
        </div>

        <div class="fintech-card" style="text-align: left; padding: 14px 18px;">
          <h3 style="font-size: 12px; font-weight: 800; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
            CHARTS &amp; MOTION
          </h3>
          <ul style="font-size: 10.5px; color: #cbd5e1; list-style: none; line-height: 1.8;">
            <li>✦ <strong>Recharts:</strong> Vector SVG chart rendering</li>
            <li>✦ <strong>Framer Motion:</strong> Modal &amp; card animations</li>
            <li>✦ <strong>Tailwind CSS v4:</strong> Modern CSS-first engine</li>
            <li>✦ <strong>Date-fns:</strong> Modular date manipulation</li>
          </ul>
        </div>

        <div class="fintech-card" style="text-align: left; padding: 14px 18px;">
          <h3 style="font-size: 12px; font-weight: 800; color: #c084fc; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
            DATABASE &amp; EDGE
          </h3>
          <ul style="font-size: 10.5px; color: #cbd5e1; list-style: none; line-height: 1.8;">
            <li>✦ <strong>Cloudflare D1:</strong> Serverless SQLite database</li>
            <li>✦ <strong>Edge Runtime:</strong> Low-latency global execution</li>
            <li>✦ <strong>REST Endpoints:</strong> Transaction CRUD routes</li>
            <li>✦ <strong>Wrangler CLI:</strong> Cloudflare deployment tool</li>
          </ul>
        </div>
      </div>

      <!-- Grand Footer -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; margin-top: 6px;">
        <h1 class="gradient-title" style="font-size: 2.8rem; letter-spacing: 0.04em; line-height: 1;">
          MONEW PERSONAL FINANCE PWA
        </h1>
        <div class="pill-badge" style="font-size: 10.5px; padding: 5px 20px;">
          WIDI FIRMAAN <span style="opacity: 0.6;">·</span> LEAD FULLSTACK DEVELOPER
        </div>
        <p style="font-size: 9.5px; color: #64748b; margin-top: 3px; font-family: 'JetBrains Mono', monospace;">
          Personal Finance Management PWA · 2026 Production Edition · money.widifirmaan.web.id
        </p>
      </div>
    </div>
    <div class="page-num">10</div>
  </section>

</body>
</html>`;

// Write the generated HTML to a temporary file
const htmlPath = path.join(projectRoot, 'presentation.html');
fs.writeFileSync(htmlPath, htmlContent);
console.log(`📄 Presentation HTML written to: ${htmlPath}`);

console.log('🚀 Launching Chromium with Playwright to render MoneW PDF...');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2,
});

await page.setContent(htmlContent, { waitUntil: 'load' });
await page.waitForTimeout(1000); // Allow any fonts and layout to settle

// 1. Generate Multi-Page Landscape PDF Presentation (A4 297x210mm)
const pdfPathProject = path.join(projectRoot, 'MoneW.pdf');
const pdfPathDownloads = path.join(downloadsDir, 'MoneW.pdf');
const pdfPathArtifacts = path.join(artifactsDir, 'MoneW.pdf');

console.log('🖨️  Rendering Multi-Page A4 Landscape Presentation PDF (Slide Mode)...');
const pdfBuffer = await page.pdf({
  format: 'A4',
  landscape: true,
  printBackground: true,
  preferCSSPageSize: true,
});

fs.writeFileSync(pdfPathProject, pdfBuffer);
fs.writeFileSync(pdfPathDownloads, pdfBuffer);
fs.writeFileSync(pdfPathArtifacts, pdfBuffer);

const pdfSizeMB = (pdfBuffer.length / (1024 * 1024)).toFixed(2);

// 2. Generate Continuous Showcase PDF (Matching Book Games single long scroll format)
const pdfContinuousProject = path.join(projectRoot, 'MoneW-Continuous.pdf');
const pdfContinuousDownloads = path.join(downloadsDir, 'MoneW-Continuous.pdf');
const pdfContinuousArtifacts = path.join(artifactsDir, 'MoneW-Continuous.pdf');

console.log('📜 Rendering Continuous Single-Scroll Showcase PDF (Poster Mode)...');
await page.addStyleTag({
  content: `
    @page { size: auto; margin: 0; }
    body { padding: 40px 0; background: #080a0e; display: flex; flex-direction: column; align-items: center; gap: 40px; }
    .slide { page-break-after: unset !important; border: 1px solid rgba(255,255,255,0.12) !important; border-radius: 24px !important; box-shadow: 0 30px 60px rgba(0,0,0,0.8) !important; }
  `
});
await page.waitForTimeout(500);

const bodyHeight = await page.evaluate(() => document.documentElement.scrollHeight);
const continuousBuffer = await page.pdf({
  width: '1428px',
  height: `${bodyHeight}px`,
  printBackground: true,
});

fs.writeFileSync(pdfContinuousProject, continuousBuffer);
fs.writeFileSync(pdfContinuousDownloads, continuousBuffer);
fs.writeFileSync(pdfContinuousArtifacts, continuousBuffer);

const contSizeMB = (continuousBuffer.length / (1024 * 1024)).toFixed(2);

console.log(`\n================================================================================`);
console.log(`🎉 MONEW WEB ARCHITECTURE PDFS SUCCESSFULLY GENERATED!`);
console.log(`📦 Multi-Page Deck (Slides)   : ${pdfSizeMB} MB (10 Pages A4 Landscape)`);
console.log(`   -> Saved: ${pdfPathDownloads}`);
console.log(`📦 Continuous Poster (Scroll) : ${contSizeMB} MB (1 Long Showcase Page)`);
console.log(`   -> Saved: ${pdfContinuousDownloads}`);
console.log(`================================================================================\n`);

await browser.close();
process.exit(0);
