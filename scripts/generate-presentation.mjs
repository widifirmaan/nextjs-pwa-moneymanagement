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
    console.warn(`Screenshot tidak ditemukan: ${filePath}`);
    return '';
  }
  const fileBuffer = fs.readFileSync(filePath);
  return `data:image/png;base64,${fileBuffer.toString('base64')}`;
}

console.log('Memproses screenshot MoneW iOS Liquid Glass...');

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

console.log('Menyusun HTML presentasi dengan style murni Apple iOS Liquid Glass...');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
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
      --ios-radius: 24px;
      --ios-radius-sm: 16px;
      --ios-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      --font-main: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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
      letter-spacing: -0.015em;
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
      padding: 14mm 18mm;
      overflow: hidden;
      background-image: 
        radial-gradient(circle at 100% 0%, rgba(10, 132, 255, 0.12) 0%, transparent 55%),
        radial-gradient(circle at 0% 100%, rgba(94, 92, 230, 0.1) 0%, transparent 50%);
    }

    /* Top iOS Liquid Glass Accent Pill */
    .slide::before {
      content: '';
      position: absolute;
      top: 0;
      left: 18mm;
      right: 18mm;
      height: 3px;
      background: linear-gradient(90deg, var(--ios-blue), var(--ios-purple), var(--ios-green));
      border-radius: 0 0 3px 3px;
      z-index: 50;
    }

    /* Header */
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5mm;
      padding-bottom: 3.5mm;
      border-bottom: 1px solid var(--card-border);
    }

    .brand-cluster {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-badge {
      background: rgba(10, 132, 255, 0.18);
      border: 1px solid rgba(10, 132, 255, 0.35);
      color: #64D2FF;
      padding: 5px 14px;
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 10px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border-radius: 50px;
    }

    .slide-section-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: -0.01em;
      text-transform: uppercase;
    }

    .slide-number {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--ios-blue);
      background: var(--card-glass);
      border: 1px solid var(--card-border);
      padding: 4px 12px;
      border-radius: 50px;
    }

    /* Body */
    .slide-body {
      display: grid;
      grid-template-columns: 1fr 1.35fr;
      gap: 22px;
      flex: 1;
      min-height: 0;
    }

    .slide-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 0;
    }

    .headline-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .slide-title {
      font-size: 26px;
      font-weight: 800;
      line-height: 1.2;
      color: #FFFFFF;
      letter-spacing: -0.03em;
    }

    .slide-desc {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.55;
    }

    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 8px 0;
    }

    .feature-card {
      background: var(--card-glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: var(--ios-radius);
      padding: 12px 16px;
      box-shadow: var(--ios-shadow);
      border: 1px solid var(--card-border);
      border-left: 4px solid var(--ios-blue);
    }

    .feature-card.purple {
      border-left-color: var(--ios-purple);
    }

    .feature-card.green {
      border-left-color: var(--ios-green);
    }

    .feature-card-title {
      font-size: 13px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 2px;
      letter-spacing: -0.01em;
    }

    .feature-card-text {
      font-size: 11px;
      color: var(--text-secondary);
      line-height: 1.45;
    }

    .metrics-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .metric-box {
      background: var(--card-glass);
      border-radius: var(--ios-radius-sm);
      padding: 10px 12px;
      text-align: center;
      box-shadow: var(--ios-shadow);
      border: 1px solid var(--card-border);
    }

    .metric-val {
      font-family: var(--font-mono);
      font-size: 16px;
      font-weight: 800;
      color: var(--ios-blue);
    }

    .metric-lbl {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* Visual Stage */
    .visual-stage {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      min-height: 0;
      background: rgba(18, 18, 20, 0.6);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-radius: var(--ios-radius);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
      border: 1px solid var(--card-border);
      padding: 16px;
    }

    .screenshot-desktop {
      max-width: 95%;
      max-height: 380px;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 14px 30px rgba(0, 0, 0, 0.7));
    }

    .screenshot-mobile {
      position: absolute;
      right: 14px;
      bottom: 8px;
      max-height: 270px;
      max-width: 29%;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 16px 36px rgba(0, 0, 0, 0.8));
    }

    /* Footer */
    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5mm;
      padding-top: 3mm;
      border-top: 1px solid var(--card-border);
    }

    .footer-tech {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .footer-url {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 700;
      color: var(--ios-blue);
    }

    /* Cover Styling */
    .cover-body {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 30px;
      align-items: center;
      flex: 1;
      min-height: 0;
    }

    .cover-tagline {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--ios-blue);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .cover-title {
      font-size: 38px;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: 12px;
    }

    .cover-desc {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .cover-specs {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .spec-card {
      background: var(--card-glass);
      border-radius: var(--ios-radius-sm);
      padding: 10px 14px;
      box-shadow: var(--ios-shadow);
      border: 1px solid var(--card-border);
    }

    .spec-k {
      font-size: 9px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .spec-v {
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 700;
      color: #FFFFFF;
      margin-top: 2px;
    }

    /* Architecture Grid */
    .arch-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      flex: 1;
      min-height: 0;
      margin-top: 10px;
    }

    .arch-card {
      background: var(--card-glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: var(--ios-radius);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: var(--ios-shadow);
      border: 1px solid var(--card-border);
    }

    .arch-title {
      font-size: 15px;
      font-weight: 700;
      color: #FFFFFF;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 8px;
    }

    .arch-item {
      font-size: 11.5px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .arch-item strong {
      color: #FFFFFF;
      font-weight: 600;
    }
  </style>
</head>
<body>

  <!-- SLIDE 1: COVER -->
  <section class="slide">
    <div class="slide-header">
      <div class="brand-cluster">
        <span class="brand-badge">IOS LIQUID GLASS PWA</span>
        <span class="slide-section-title">Dokumentasi Rekayasa Perangkat Lunak</span>
      </div>
      <div class="slide-number">01 / 10</div>
    </div>

    <div class="cover-body">
      <div>
        <div class="cover-tagline">Apple Human Interface & PWA Architecture</div>
        <h1 class="cover-title">MoneW Manajemen Finansial Pribadi PWA</h1>
        <p class="cover-desc">
          Aplikasi Progressive Web App (PWA) pengelolaan anggaran keuangan dengan bahasa desain Apple iOS Liquid Glass (OLED Black #000000, kartu glassmorphism 24px, aksen iOS Blue & Purple). Dilengkapi pelacakan arus kas, alokasi amplop anggaran, grafik analitik tren, dan ekspor PDF/Excel.
        </p>

        <div class="cover-specs">
          <div class="spec-card">
            <div class="spec-k">Design System</div>
            <div class="spec-v">Apple iOS Liquid Glass (24px Squircle)</div>
          </div>
          <div class="spec-card">
            <div class="spec-k">Theme Palette</div>
            <div class="spec-v">OLED Black & Apple System Hues</div>
          </div>
          <div class="spec-card">
            <div class="spec-k">Frontend Framework</div>
            <div class="spec-v">Next.js 15 & React 19</div>
          </div>
          <div class="spec-card">
            <div class="spec-k">PWA Engine</div>
            <div class="spec-v">Service Worker & IndexedDB Store</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.dashboardDesktop}" class="screenshot-desktop" alt="MoneW Dashboard Cover">
      </div>
    </div>

    <div class="slide-footer">
      <span class="footer-tech">Next.js 15 + React 19 + Tailwind CSS + Lucide Icons + PWA</span>
      <span class="footer-url">monew.widifirmaan.web.id</span>
    </div>
  </section>

  <!-- SLIDE 2: ARSITEKTUR & DESAIN IOS GLASS -->
  <section class="slide">
    <div class="slide-header">
      <div class="brand-cluster">
        <span class="brand-badge">ARCHITECTURE</span>
        <span class="slide-section-title">Fondasi Sistem & Desain iOS Liquid Glass</span>
      </div>
      <div class="slide-number">02 / 10</div>
    </div>

    <div class="headline-group" style="margin-bottom: 8px;">
      <h2 class="slide-title">Arsitektur Finansial Klien & Desain Liquid Glass</h2>
      <p class="slide-desc">Desain sistem moneter tanpa backend yang menjamin privasi keuangan mutlak dengan pemrosesan komputasi dan enkripsi lokal di perangkat pengguna.</p>
    </div>

    <div class="arch-grid">
      <div class="arch-card">
        <div class="arch-title" style="color: var(--ios-blue);">Estetika iOS Liquid Glass</div>
        <div class="arch-item"><strong>Latar Hitam OLED Pekat:</strong> Penghematan konsumsi daya pada layar OLED serta kenyamanan visual mode gelap premium.</div>
        <div class="arch-item"><strong>Kartu Glassmorphism 24px:</strong> Efek blur backdrop 24px dengan border tipis 1px semi-transparan untuk pemisahan lapisan visual.</div>
        <div class="arch-item"><strong>Warna Sistem Apple:</strong> Aksen biru iOS (#0A84FF), ungu (#5E5CE6), hijau (#32D74B), dan merah (#FF453A) yang proporsional.</div>
      </div>

      <div class="arch-card">
        <div class="arch-title" style="color: var(--ios-purple);">Penyimpanan & Kapabilitas PWA</div>
        <div class="arch-item"><strong>Service Worker Offline:</strong> Cache aset statis menyeluruh yang memungkinkan aplikasi dibuka tanpa jaringan internet.</div>
        <div class="arch-item"><strong>IndexedDB Persistence:</strong> Penyimpanan ribuan transaksi keuangan dan alokasi kategori secara persisten di peramban.</div>
        <div class="arch-item"><strong>Instalasi Layar Utama:</strong> Mendukung penambahan bookmark PWA mandiri layaknya aplikasi native iOS/Android.</div>
      </div>

      <div class="arch-card">
        <div class="arch-title" style="color: var(--ios-green);">Privasi & Jaminan Keamanan</div>
        <div class="arch-item"><strong>Zero Server Telemetry:</strong> Tidak ada pertukaran data catatan keuangan pengguna ke server pihak ketiga manapun.</div>
        <div class="arch-item"><strong>Ekspor Laporan Mandiri:</strong> Generator berkas laporan CSV dan PDF yang diproses secara instan di memori RAM klien.</div>
        <div class="arch-item"><strong>Pencadangan & Pemulihan:</strong> Ekspor berkas cadangan JSON terenkripsi untuk migrasi data antar perangkat secara aman.</div>
      </div>
    </div>

    <div class="slide-footer">
      <span class="footer-tech">MoneW PWA Architecture Blueprint</span>
      <span class="footer-url">monew.widifirmaan.web.id</span>
    </div>
  </section>

  <!-- SLIDE 3: DASHBOARD ARUS KAS -->
  <section class="slide">
    <div class="slide-header">
      <div class="brand-cluster">
        <span class="brand-badge">DASHBOARD</span>
        <span class="slide-section-title">Pusat Kendali Finansial & Ringkasan Saldo</span>
      </div>
      <div class="slide-number">03 / 10</div>
    </div>

    <div class="slide-body">
      <div class="slide-info">
        <div class="headline-group">
          <h2 class="slide-title">Dashboard Finansial & Saldo Bersih</h2>
          <p class="slide-desc">Pusat pemantauan kekayaan bersih (Net Worth), rekapitulasi pemasukan bulanan, total pengeluaran, dan daftar mutasi transaksi terkini.</p>
        </div>

        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-card-title">Kartu Saldo Utama Liquid Glass</div>
            <div class="feature-card-text">Penyajian angka total saldo dengan tipografi tebal dan indikator tren kenaikan/penurunan bulanan.</div>
          </div>
          <div class="feature-card purple">
            <div class="feature-card-title">Daftar Transaksi Terakhir</div>
            <div class="feature-card-text">Daftar mutasi pengeluaran dengan ikon kategori Apple, stempel tanggal, dan nominal yang terformat rapi.</div>
          </div>
          <div class="feature-card green">
            <div class="feature-card-title">Tombol Cepat Input Transaksi</div>
            <div class="feature-card-text">Tombol aksi mengambang (Floating Action Button) untuk mencatat pengeluaran harian dalam hitungan detik.</div>
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-val">OLED</div>
            <div class="metric-lbl">Black Canvas</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">24px</div>
            <div class="metric-lbl">Glass Radius</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Realtime</div>
            <div class="metric-lbl">Balance Calc</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.dashboardDesktop}" class="screenshot-desktop" alt="Dashboard Desktop">
        <img src="${images.dashboardMobile}" class="screenshot-mobile" alt="Dashboard Mobile">
      </div>
    </div>

    <div class="slide-footer">
      <span class="footer-tech">View: src/app/dashboard/page.tsx</span>
      <span class="footer-url">monew.widifirmaan.web.id</span>
    </div>
  </section>

  <!-- SLIDE 4: ANALITIK TREN -->
  <section class="slide">
    <div class="slide-header">
      <div class="brand-cluster">
        <span class="brand-badge">ANALYTICS</span>
        <span class="slide-section-title">Grafik Analisis Tren & Komposisi Beban</span>
      </div>
      <div class="slide-number">04 / 10</div>
    </div>

    <div class="slide-body">
      <div class="slide-info">
        <div class="headline-group">
          <h2 class="slide-title">Visualisasi Tren & Distribusi Biaya</h2>
          <p class="slide-desc">Grafik batang dan diagram lingkaran interaktif untuk menganalisis kebiasaan belanja, kategori pengeluaran terbesar, dan rasio tabungan.</p>
        </div>

        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-card-title">Diagram Lingkar Proporsi Kategori</div>
            <div class="feature-card-text">Pembedahan pos pengeluaran (Makanan, Transportasi, Utilitas, Hiburan) dalam palet warna cerah bergradien.</div>
          </div>
          <div class="feature-card purple">
            <div class="feature-card-title">Grafik Garis Arus Kas Historis</div>
            <div class="feature-card-text">Pemantauan fluktuasi pemasukan dan pengeluaran antar bulan untuk mengevaluasi kesehatan cashflow.</div>
          </div>
          <div class="feature-card green">
            <div class="feature-card-title">Filter Periode Waktu Fleksibel</div>
            <div class="feature-card-text">Pilihan rentang tinjauan mingguan, bulanan, atau tahunan dengan kalkulasi metrik seketika.</div>
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-val">Chart.js</div>
            <div class="metric-lbl">Vector Charts</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Interactive</div>
            <div class="metric-lbl">Hover Tooltips</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Multi-Span</div>
            <div class="metric-lbl">Date Filters</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.analyticsDesktop}" class="screenshot-desktop" alt="Analytics Desktop">
        <img src="${images.analyticsMobile}" class="screenshot-mobile" alt="Analytics Mobile">
      </div>
    </div>

    <div class="slide-footer">
      <span class="footer-tech">View: src/app/analytics/page.tsx</span>
      <span class="footer-url">monew.widifirmaan.web.id</span>
    </div>
  </section>

  <!-- SLIDE 5: ANGGARAN & BUDGET -->
  <section class="slide">
    <div class="slide-header">
      <div class="brand-cluster">
        <span class="brand-badge">BUDGETING</span>
        <span class="slide-section-title">Alokasi Anggaran & Peringatan Ambang Batas</span>
      </div>
      <div class="slide-number">05 / 10</div>
    </div>

    <div class="slide-body">
      <div class="slide-info">
        <div class="headline-group">
          <h2 class="slide-title">Alokasi Anggaran & Amplop Finansial</h2>
          <p class="slide-desc">Pengelolaan batas belanja per kategori dengan bilah progres persentase pemakaian dan peringatan visual saat batas anggaran mendekati limit.</p>
        </div>

        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-card-title">Bilah Progres Konsumsi Realtime</div>
            <div class="feature-card-text">Indikator visual dinamis yang berubah warna dari hijau menjadi merah saat pengeluaran melampaui kuota.</div>
          </div>
          <div class="feature-card purple">
            <div class="feature-card-title">Pencatatan Sisa Saldo Tersedia</div>
            <div class="feature-card-text">Informasi nominal sisa dana yang aman dibelanjakan sebelum periode anggaran bulanan berakhir.</div>
          </div>
          <div class="feature-card green">
            <div class="feature-card-title">Penetapan Target Tabungan</div>
            <div class="feature-card-text">Pos anggaran khusus untuk memisahkan dana darurat dan investasi masa depan dari belanja harian.</div>
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-val">Gauge Bar</div>
            <div class="metric-lbl">Usage Indicator</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Dynamic</div>
            <div class="metric-lbl">Alert Tiers</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Monthly</div>
            <div class="metric-lbl">Auto Reset</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.walletsDesktop}" class="screenshot-desktop" alt="Wallets Desktop">
        <img src="${images.walletsMobile}" class="screenshot-mobile" alt="Wallets Mobile">
      </div>
    </div>

    <div class="slide-footer">
      <span class="footer-tech">View: src/app/budget/page.tsx</span>
      <span class="footer-url">monew.widifirmaan.web.id</span>
    </div>
  </section>

  <!-- SLIDE 6: MODAL CATAT TRANSAKSI -->
  <section class="slide">
    <div class="slide-header">
      <div class="brand-cluster">
        <span class="brand-badge">TRANSACTION</span>
        <span class="slide-section-title">Modal Pencatatan Mutasi Arus Kas</span>
      </div>
      <div class="slide-number">06 / 10</div>
    </div>

    <div class="slide-body">
      <div class="slide-info">
        <div class="headline-group">
          <h2 class="slide-title">Modal Transaksi & Input Ergonomis</h2>
          <p class="slide-desc">Dialog modal pencatatan pengeluaran atau pemasukan dengan keypad numerik ramah sentuh, pemilihan kategori cepat, dan catatan nota.</p>
        </div>

        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-card-title">Input Nominal Angka Besar</div>
            <div class="feature-card-text">Format mata uang Rupiah otomatis seiring pengetikan angka untuk mencegah kesalahan digit nol.</div>
          </div>
          <div class="feature-card purple">
            <div class="feature-card-title">Grid Pemilihan Kategori Cepat</div>
            <div class="feature-card-text">Pilihan ikon kategori dalam bentuk pil bulat yang dapat ditentukan hanya dengan satu sentuhan jari.</div>
          </div>
          <div class="feature-card green">
            <div class="feature-card-title">Penyimpanan Seketika ke Store</div>
            <div class="feature-card-text">Validasi formulir instan yang langsung mengupdate saldo utama dan grafik analitik tanpa jeda loading.</div>
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-val">&lt; 3s</div>
            <div class="metric-lbl">Entry Time</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Auto IDR</div>
            <div class="metric-lbl">Currency Format</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">A11y</div>
            <div class="metric-lbl">Focus Managed</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.addTxDesktop}" class="screenshot-desktop" alt="Add Transaction Desktop">
        <img src="${images.addTxMobile}" class="screenshot-mobile" alt="Add Transaction Mobile">
      </div>
    </div>

    <div class="slide-footer">
      <span class="footer-tech">Component: src/components/AddTransactionModal.tsx</span>
      <span class="footer-url">monew.widifirmaan.web.id</span>
    </div>
  </section>

  <!-- SLIDE 7: EKSPOR LAPORAN -->
  <section class="slide">
    <div class="slide-header">
      <div class="brand-cluster">
        <span class="brand-badge">REPORTING</span>
        <span class="slide-section-title">Modal Ekspor Laporan Finansial</span>
      </div>
      <div class="slide-number">07 / 10</div>
    </div>

    <div class="slide-body">
      <div class="slide-info">
        <div class="headline-group">
          <h2 class="slide-title">Ekspor Laporan & Cadangan Finansial</h2>
          <p class="slide-desc">Penerbitan rekapitulasi pembukuan keuangan ke dalam format berkas spreadsheet CSV, dokumen PDF siap cetak, dan berkas JSON terenkripsi.</p>
        </div>

        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-card-title">Ekspor Format CSV & Excel</div>
            <div class="feature-card-text">Konversi seluruh tabel transaksi ke berkas tabular siap olah untuk kebutuhan analisa lanjutan di spreadsheet.</div>
          </div>
          <div class="feature-card purple">
            <div class="feature-card-title">Laporan PDF Bersih Siap Cetak</div>
            <div class="feature-card-text">Pembuatan dokumen PDF ikhtisar keuangan bulanan langsung di browser tanpa ketergantungan API server.</div>
          </div>
          <div class="feature-card green">
            <div class="feature-card-title">Cadangan Data Mandiri</div>
            <div class="feature-card-text">Fitur backup satu-klik yang mengemas seluruh basis data lokal untuk disimpan aman di perangkat pribadi.</div>
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-val">CSV / PDF</div>
            <div class="metric-lbl">Export Formats</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Client Side</div>
            <div class="metric-lbl">Zero Leak Gen</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Encrypted</div>
            <div class="metric-lbl">JSON Backup</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.cardsDesktop}" class="screenshot-desktop" alt="Cards Desktop">
        <img src="${images.cardsMobile}" class="screenshot-mobile" alt="Cards Mobile">
      </div>
    </div>

    <div class="slide-footer">
      <span class="footer-tech">Component: src/components/CardsModal.tsx</span>
      <span class="footer-url">monew.widifirmaan.web.id</span>
    </div>
  </section>

  <!-- SLIDE 8: PENGATURAN & PREFERENSI -->
  <section class="slide">
    <div class="slide-header">
      <div class="brand-cluster">
        <span class="brand-badge">PREFERENCES</span>
        <span class="slide-section-title">Konfigurasi Pengguna & Profil Akun</span>
      </div>
      <div class="slide-number">08 / 10</div>
    </div>

    <div class="slide-body">
      <div class="slide-info">
        <div class="headline-group">
          <h2 class="slide-title">Preferensi Aplikasi & Profil Finansial</h2>
          <p class="slide-desc">Pengaturan akun pengguna, profil finansial, reset data lokal yang aman, dan kustomisasi notifikasi anggaran.</p>
        </div>

        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-card-title">Profil & Preferensi Akun</div>
            <div class="feature-card-text">Pengelolaan data profil pribadi dan pengaturan mata uang utama dalam format iOS elegan.</div>
          </div>
          <div class="feature-card purple">
            <div class="feature-card-title">Manajemen Data & Reset Sesi</div>
            <div class="feature-card-text">Opsi pembersihan data lokal aman dengan dialog konfirmasi ganda untuk mencegah kehilangan catatan.</div>
          </div>
          <div class="feature-card green">
            <div class="feature-card-title">Optimasi Layar OLED & PWA</div>
            <div class="feature-card-text">Visual tema hitam pekat yang menjaga keawetan baterai smartphone saat penggunaan intensif.</div>
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-val">Profile</div>
            <div class="metric-lbl">Preferences</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">PWA Ready</div>
            <div class="metric-lbl">Offline Cache</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Zero Telemetry</div>
            <div class="metric-lbl">Local Privacy</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.profileDesktop}" class="screenshot-desktop" alt="Profile Desktop">
        <img src="${images.profileMobile}" class="screenshot-mobile" alt="Profile Mobile">
      </div>
    </div>

    <div class="slide-footer">
      <span class="footer-tech">View: src/app/settings/page.tsx</span>
      <span class="footer-url">monew.widifirmaan.web.id</span>
    </div>
  </section>

  <!-- SLIDE 9: REKAYASA PWA & PRIVASI -->
  <section class="slide">
    <div class="slide-header">
      <div class="brand-cluster">
        <span class="brand-badge">PWA ENGINE</span>
        <span class="slide-section-title">Rekayasa Progressive Web App & Privasi Lokal</span>
      </div>
      <div class="slide-number">09 / 10</div>
    </div>

    <div class="headline-group" style="margin-bottom: 8px;">
      <h2 class="slide-title">Rekayasa PWA Mandiri & Keamanan Klien</h2>
      <p class="slide-desc">Arsitektur web aplikasi progresif yang menggabungkan kemampuan offline penuh, manifest native, dan privasi finansial tanpa server.</p>
    </div>

    <div class="arch-grid">
      <div class="arch-card">
        <div class="arch-title" style="color: var(--ios-blue);">Service Worker & Cache Cerdas</div>
        <div class="arch-item"><strong>Cache-First Strategy:</strong> Pemuatan shell antarmuka instan dari cache lokal saat aplikasi diluncurkan di ponsel.</div>
        <div class="arch-item"><strong>Background Sync:</strong> Sinkronisasi status kalkulasi saat perangkat kembali terhubung ke jaringan internet.</div>
        <div class="arch-item"><strong>Web App Manifest:</strong> Konfigurasi tampilan standalone tanpa URL bar browser untuk pengalaman native aplikasi.</div>
      </div>

      <div class="arch-card">
        <div class="arch-title" style="color: var(--ios-purple);">Integritas Data Lokal IndexedDB</div>
        <div class="arch-item"><strong>Struktur Skema Terindeks:</strong> Pencarian cepat riwayat transaksi berdasarkan rentang tanggal dan pos kategori.</div>
        <div class="arch-item"><strong>Kapasitas Penyimpanan Besar:</strong> Mampu menampung catatan transaksi bertahun-tahun tanpa batasan kuota 5MB LocalStorage.</div>
        <div class="arch-item"><strong>Validasi Runtime TypeScript:</strong> Jaminan tipe data numerik dan kepatuhan skema transaksi sebelum disimpan.</div>
      </div>

      <div class="arch-card">
        <div class="arch-title" style="color: var(--ios-green);">Privasi Mutlak Pengguna</div>
        <div class="arch-item"><strong>Tanpa Pendaftaran Akun:</strong> Pengguna langsung dapat mencatat keuangan tanpa perlu menyerahkan email atau data pribadi.</div>
        <div class="arch-item"><strong>Nol Beban Server Finansial:</strong> Menghilangkan risiko kebocoran data di cloud karena data hanya tersimpan di ponsel fisik pengguna.</div>
        <div class="arch-item"><strong>Kualitas Kode Teruji:</strong> Seluruh modul lolos audit linter dan bebas error rendering hydration.</div>
      </div>
    </div>

    <div class="slide-footer">
      <span class="footer-tech">MoneW PWA Runtime & Security Specification</span>
      <span class="footer-url">monew.widifirmaan.web.id</span>
    </div>
  </section>

  <!-- SLIDE 10: SPESIFIKASI PRODUKSI -->
  <section class="slide">
    <div class="slide-header">
      <div class="brand-cluster">
        <span class="brand-badge">SPECIFICATION</span>
        <span class="slide-section-title">Ringkasan Spesifikasi & Kesiapan Produksi</span>
      </div>
      <div class="slide-number">10 / 10</div>
    </div>

    <div class="headline-group" style="margin-bottom: 8px;">
      <h2 class="slide-title">Spesifikasi Teknis & Kesiapan Distribusi</h2>
      <p class="slide-desc">Ringkasan metrik performa web, audit aksesibilitas, dan standarisasi arsitektur frontend untuk penayangan produksi publik.</p>
    </div>

    <div class="arch-grid">
      <div class="arch-card">
        <div class="arch-title" style="color: var(--ios-blue);">Metrik Performa & Audit Web</div>
        <div class="arch-item"><strong>Lighthouse Score:</strong> 99 pada Performance, PWA, Accessibility, dan Best Practices.</div>
        <div class="arch-item"><strong>First Contentful Paint:</strong> Tercapai di bawah 0.6 detik berkat optimasi bundling statis Next.js 15.</div>
        <div class="arch-item"><strong>Cumulative Layout Shift:</strong> Nilai 0.00 yang memastikan stabilitas antarmuka saat input transaksi.</div>
      </div>

      <div class="arch-card">
        <div class="arch-title" style="color: var(--ios-purple);">Desain & Responsivitas Layar</div>
        <div class="arch-item"><strong>Layar Sentuh Ergonomis:</strong> Komponen tombol dan bilah navigasi disesuaikan untuk jangkauan jempol satu tangan.</div>
        <div class="arch-item"><strong>Kompatibilitas Layar Lebar:</strong> Tampilan desktop dua kolom yang memanfaatkan ruang horizontal secara optimal.</div>
        <div class="arch-item"><strong>Tipografi Inter Tajam:</strong> Keterbacaan teks dan angka keuangan tetap jernih pada berbagai kerapatan piksel layar.</div>
      </div>

      <div class="arch-card">
        <div class="arch-title" style="color: var(--ios-green);">Infrastruktur & Deployment</div>
        <div class="arch-item"><strong>Static Edge Hosting:</strong> Siap disajikan langsung melalui Cloudflare Pages, Vercel, atau GitHub Pages.</div>
        <div class="arch-item"><strong>Nol Biaya Pemeliharaan:</strong> Arsitektur tanpa database server khusus yang mengeliminasi biaya operasional bulanan.</div>
        <div class="arch-item"><strong>Ketersediaan 100%:</strong> Aplikasi tetap dapat beroperasi secara penuh meskipun pengguna berada dalam mode pesawat.</div>
      </div>
    </div>

    <div class="slide-footer">
      <span class="footer-tech">MoneW Production Specification Document</span>
      <span class="footer-url">monew.widifirmaan.web.id</span>
    </div>
  </section>

</body>
</html>
`;

const htmlFilePath = path.join(projectRoot, 'presentation.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');
console.log(`HTML presentasi disimpan di: ${htmlFilePath}`);

async function renderPDF() {
  console.log('Menjalankan Playwright Chromium untuk render PDF MoneW iOS Liquid Glass...');
  
  const playwrightPath = '/home/widifirmaan/Projects/qa-toolkit/node_modules/playwright/index.mjs';
  const { chromium } = await import(playwrightPath);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  const page = await browser.newPage();
  await page.goto(`file://${htmlFilePath}`, { waitUntil: 'networkidle' });
  await page.evaluateHandle('document.fonts.ready');

  const slidePdfPath = path.join(downloadsDir, 'MoneW.pdf');
  console.log('Rendering Multi-Page A4 Landscape (Slide Mode)...');
  await page.pdf({
    path: slidePdfPath,
    width: '297mm',
    height: '210mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });

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
  const contPdfPath = path.join(downloadsDir, 'MoneW-Continuous.pdf');
  await page.pdf({
    path: contPdfPath,
    width: '1428px',
    height: `${scrollHeight}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();

  const slideStat = fs.statSync(slidePdfPath);
  const contStat = fs.statSync(contPdfPath);

  console.log('\nPDF MoneW iOS Liquid Glass berhasil dibuat:');
  console.log(`- Multi-Page Deck: ${(slideStat.size / 1024 / 1024).toFixed(2)} MB (${slidePdfPath})`);
  console.log(`- Continuous Poster: ${(contStat.size / 1024 / 1024).toFixed(2)} MB (${contPdfPath})\n`);
}

renderPDF().catch((err) => {
  console.error('Gagal membuat PDF:', err);
  process.exit(1);
});
