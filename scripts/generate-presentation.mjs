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

console.log('Encoding MoneW screenshots...');

const images = {
  dashboardDesktop: encodeImage('Dashboard Desktop.png'),
  dashboardMobile: encodeImage('Dashboard Mobile.png'),
  walletsDesktop: encodeImage('Wallets Desktop.png'),
  walletsMobile: encodeImage('Wallets Mobile.png'),
  cardsDesktop: encodeImage('Cards Desktop.png'),
  cardsMobile: encodeImage('Cards Mobile.png'),
  analyticsDesktop: encodeImage('Analytics Desktop.png'),
  analyticsMobile: encodeImage('Analytics Mobile.png'),
  addTxDesktop: encodeImage('Add Transaction Desktop.png'),
  addTxMobile: encodeImage('Add Transaction Mobile.png'),
  loginDesktop: encodeImage('Login Desktop.png'),
  loginMobile: encodeImage('Login Mobile.png'),
  profileDesktop: encodeImage('Profile Desktop.png'),
  profileMobile: encodeImage('Profile Mobile.png'),
};

console.log('Constructing clean MoneW Presentation Deck HTML...');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>MoneW PWA - Web Architecture Showcase</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #090D14;
      --bg-card: rgba(16, 24, 38, 0.7);
      --border-card: rgba(255, 255, 255, 0.1);
      --accent-emerald: #10B981;
      --accent-cyan: #06B6D4;
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      background-color: var(--bg-dark);
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: var(--text-main);
      line-height: 1.45;
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
      background: var(--bg-dark);
      display: flex;
      flex-direction: column;
      padding: 16mm 18mm;
      overflow: hidden;
      background-image: 
        radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 100% 100%, 36px 36px, 36px 36px;
    }

    .slide::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #10B981, #06B6D4);
      z-index: 50;
    }

    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5mm;
      border-bottom: 1px solid var(--border-card);
      padding-bottom: 3.5mm;
    }

    .header-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      color: #34D399;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 3px 10px;
      border-radius: 4px;
    }

    .slide-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
    }

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
      gap: 8px;
    }

    .slide-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 24px;
      font-weight: 800;
      line-height: 1.2;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    .slide-desc {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 10px 0;
    }

    .feature-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 6px;
      padding: 12px 14px;
      border-left: 3.5px solid var(--accent-emerald);
    }

    .feature-card-title {
      font-size: 12px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 4px;
    }

    .feature-card-text {
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.45;
    }

    .metrics-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .metric-box {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 6px;
      padding: 8px 10px;
      text-align: center;
    }

    .metric-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 15px;
      font-weight: 800;
      color: #34D399;
    }

    .metric-lbl {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* Clean Direct Screenshot Display without nested mockup frames */
    .visual-stage {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      min-height: 0;
    }

    .screenshot-desktop {
      max-width: 95%;
      max-height: 380px;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.6));
    }

    .screenshot-mobile {
      position: absolute;
      right: 0px;
      bottom: -8px;
      max-height: 280px;
      max-width: 28%;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 16px 32px rgba(0, 0, 0, 0.7));
    }

    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border-card);
      padding-top: 3.5mm;
      margin-top: 4mm;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      color: #64748B;
      font-weight: 600;
    }

    /* Cover Slide */
    .cover-slide {
      background: 
        radial-gradient(circle at 75% 25%, rgba(16, 185, 129, 0.14) 0%, transparent 60%),
        #090D14;
      justify-content: space-between;
      padding: 18mm 20mm;
    }

    .cover-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 46px;
      font-weight: 900;
      line-height: 1.05;
      color: #FFFFFF;
      margin-bottom: 12px;
    }

    .cover-title span {
      color: #34D399;
    }

    .cover-desc {
      font-size: 15px;
      line-height: 1.5;
      color: var(--text-muted);
      max-width: 680px;
    }

    .cover-split {
      display: grid;
      grid-template-columns: 1fr 1.1fr;
      gap: 28px;
      align-items: center;
      margin: 10px 0;
    }

    .cover-specs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .spec-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 6px;
      padding: 12px 14px;
    }

    .spec-k {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      color: #34D399;
      text-transform: uppercase;
      margin-bottom: 3px;
    }

    .spec-v {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 13.5px;
      font-weight: 700;
      color: #FFFFFF;
    }

    /* Tech Stack Grid */
    .tech-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 10px;
      flex: 1;
    }

    .tech-col {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .tech-col-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--border-card);
      color: #34D399;
    }

    .tech-item {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 5px;
      padding: 8px 10px;
      font-size: 11px;
    }

    .tech-item-name {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 2px;
    }

    .tech-item-desc {
      font-size: 10px;
      color: var(--text-muted);
      line-height: 1.4;
    }

    /* Closing Slide */
    .closing-slide {
      background: radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.12) 0%, transparent 60%), #090D14;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20mm;
      gap: 18px;
    }

    .closing-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 36px;
      font-weight: 900;
      letter-spacing: -0.02em;
      color: #FFFFFF;
    }

    .closing-card {
      background: var(--bg-card);
      border: 1px solid var(--accent-emerald);
      border-radius: 8px;
      padding: 16px 36px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      margin-top: 10px;
    }

    .closing-url {
      font-family: 'JetBrains Mono', monospace;
      font-size: 16px;
      font-weight: 800;
      color: #34D399;
    }
  </style>
</head>
<body>

  <!-- SLIDE 01: COVER -->
  <div class="slide cover-slide">
    <div>
      <div style="display:flex; gap:12px; align-items:center;">
        <div class="header-tag">FINTECH PWA</div>
        <div class="header-tag" style="border-color:#10B981; color:#34D399; background:rgba(16,185,129,0.1);">PRODUCTION READY</div>
      </div>
      <div style="margin-top: 20px; max-width: 80%;">
        <div class="cover-title">
          <span>MONEW</span> PWA FINTECH
        </div>
        <p class="cover-desc">
          Aplikasi web pencatatan keuangan pribadi dan manajemen dompet digital berbasis Next.js 14, Recharts data visualisasi, dan Progressive Web App (PWA) architecture.
        </p>
      </div>
    </div>

    <div class="cover-split">
      <div class="cover-specs">
        <div class="spec-card">
          <div class="spec-k">FRAMEWORK</div>
          <div class="spec-v">Next.js 14 + React 18</div>
        </div>
        <div class="spec-card">
          <div class="spec-k">DATABASE</div>
          <div class="spec-v">Supabase PostgreSQL</div>
        </div>
        <div class="spec-card">
          <div class="spec-k">CHARTS</div>
          <div class="spec-v">Recharts SVG Engine</div>
        </div>
        <div class="spec-card">
          <div class="spec-k">CAPABILITY</div>
          <div class="spec-v">Installable PWA App</div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.dashboardDesktop}" class="screenshot-desktop" alt="MoneW Cover">
      </div>
    </div>

    <div class="slide-footer">
      <div>WIDI FIRMANSYAH</div>
      <div>NEXTJS PWA MONEY MANAGEMENT</div>
      <div>01 / 10</div>
    </div>
  </div>

  <!-- SLIDE 02: DASHBOARD -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-tag">DASBOR UTAMA</div>
      <div class="slide-num">02 / 10</div>
    </div>

    <div class="slide-body">
      <div class="slide-info">
        <div class="headline-group">
          <h2 class="slide-title">Dasbor Keuangan & Ringkasan Saldo</h2>
          <p class="slide-desc">
            Halaman ikhtisar finansial yang menyajikan total saldo bersih, kartu ringkasan arus kas pemasukan dan pengeluaran bulan berjalan, serta daftar mutasi terbaru.
          </p>
        </div>

        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-card-title">Kalkulasi Saldo Terpusat</div>
            <div class="feature-card-text">
              Total saldo dikalkulasi otomatis dari akumulasi seluruh akun dompet terdaftar secara konsisten.
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-card-title">Daftar Mutasi Terkini</div>
            <div class="feature-card-text">
              Menampilkan 5 transaksi terakhir lengkap dengan kategori ikon, waktu pencatatan, dan tanda plus/minus nominal.
            </div>
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-val">100%</div>
            <div class="metric-lbl">Akurat</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Realtime</div>
            <div class="metric-lbl">Pembaruan</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Rupiah</div>
            <div class="metric-lbl">Format IDR</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.dashboardDesktop}" class="screenshot-desktop" alt="Dashboard Desktop">
        <img src="${images.dashboardMobile}" class="screenshot-mobile" alt="Dashboard Mobile">
      </div>
    </div>

    <div class="slide-footer">
      <div>DASBOR KEUANGAN</div>
      <div>RINGKASAN SALDO & ARUS KAS</div>
      <div>02 / 10</div>
    </div>
  </div>

  <!-- SLIDE 03: WALLETS -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-tag">MANAJEMEN DOMPET</div>
      <div class="slide-num">03 / 10</div>
    </div>

    <div class="slide-body">
      <div class="slide-info">
        <div class="headline-group">
          <h2 class="slide-title">Pemisahan Akun & Multi-Dompet</h2>
          <p class="slide-desc">
            Pengelolaan berbagai rekening terpisah dalam satu aplikasi, mencakup rekening bank konvensional, dompet digital, dan kas tunai fisik.
          </p>
        </div>

        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-card-title">Modal Tambah & Edit Dompet</div>
            <div class="feature-card-text">
              Pengguna dapat membuat dompet baru, menetapkan saldo awal, dan memilih warna kartu pengenal akun.
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-card-title">Isolasi Mutasi Akun</div>
            <div class="feature-card-text">
              Setiap transaksi terikat langsung pada ID dompet spesifik sehingga histori per rekening dapat diaudit terpisah.
            </div>
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-val">Multi</div>
            <div class="metric-lbl">Akun Bank</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">E-Wallet</div>
            <div class="metric-lbl">Kategori</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">CRUD</div>
            <div class="metric-lbl">Aksi Dompet</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.walletsDesktop}" class="screenshot-desktop" alt="Wallets Desktop">
        <img src="${images.walletsMobile}" class="screenshot-mobile" alt="Wallets Mobile">
      </div>
    </div>

    <div class="slide-footer">
      <div>MANAJEMEN DOMPET</div>
      <div>ISOLASI REKENING MULTI-AKUN</div>
      <div>03 / 10</div>
    </div>
  </div>

  <!-- SLIDE 04: CARDS -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-tag">KARTU VIRTUAL</div>
      <div class="slide-num">04 / 10</div>
    </div>

    <div class="slide-body">
      <div class="slide-info">
        <div class="headline-group">
          <h2 class="slide-title">Visualisasi Kartu & Pemantauan Limit</h2>
          <p class="slide-desc">
            Tampilan kartu debit dan kredit virtual berdesain modern yang memudahkan pengguna memantau penggunaan limit belanja bulanan.
          </p>
        </div>

        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-card-title">Bilah Progres Limit Belanja</div>
            <div class="feature-card-text">
              Indikator visual persentase pemakaian saldo terhadap batas anggaran yang ditetapkan pengguna.
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-card-title">Masking Nomor Kartu</div>
            <div class="feature-card-text">
              Nomor kartu disamarkan otomatis untuk menjaga privasi data finansial saat dilihat di ruang publik.
            </div>
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-val">Virtual</div>
            <div class="metric-lbl">Kartu Debit</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Limit</div>
            <div class="metric-lbl">Tracking</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Masked</div>
            <div class="metric-lbl">Nomor Kartu</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.cardsDesktop}" class="screenshot-desktop" alt="Cards Desktop">
        <img src="${images.cardsMobile}" class="screenshot-mobile" alt="Cards Mobile">
      </div>
    </div>

    <div class="slide-footer">
      <div>KARTU VIRTUAL</div>
      <div>PEMANTAUAN LIMIT ANGGARAN</div>
      <div>04 / 10</div>
    </div>
  </div>

  <!-- SLIDE 05: ANALYTICS -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-tag">ANALITIK KEUANGAN</div>
      <div class="slide-num">05 / 10</div>
    </div>

    <div class="slide-body">
      <div class="slide-info">
        <div class="headline-group">
          <h2 class="slide-title">Visualisasi Data Grafik Recharts</h2>
          <p class="slide-desc">
            Analisis pengeluaran komprehensif menggunakan grafik batang dan donat SVG interaktif untuk mengevaluasi alokasi pos belanja.
          </p>
        </div>

        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-card-title">Grafik Komposisi Kategori</div>
            <div class="feature-card-text">
              Diagram donat Recharts yang memetakan persentase biaya kebutuhan pokok, transportasi, hiburan, dan tabungan.
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-card-title">Tren Bulanan</div>
            <div class="feature-card-text">
              Grafik perbandingan pengeluaran antar bulan untuk melihat pola kenaikan atau penurunan pengeluaran.
            </div>
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-val">Recharts</div>
            <div class="metric-lbl">SVG Charts</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Kategori</div>
            <div class="metric-lbl">Breakdown</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Bulanan</div>
            <div class="metric-lbl">Pola Tren</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.analyticsDesktop}" class="screenshot-desktop" alt="Analytics Desktop">
        <img src="${images.analyticsMobile}" class="screenshot-mobile" alt="Analytics Mobile">
      </div>
    </div>

    <div class="slide-footer">
      <div>ANALITIK GRAFIK RECHARTS</div>
      <div>VISUALISASI POS ANGGARAN</div>
      <div>05 / 10</div>
    </div>
  </div>

  <!-- SLIDE 06: ADD TRANSACTION -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-tag">PENCATATAN TRANSAKSI</div>
      <div class="slide-num">06 / 10</div>
    </div>

    <div class="slide-body">
      <div class="slide-info">
        <div class="headline-group">
          <h2 class="slide-title">Formulir Transaksi & Masking Nominal</h2>
          <p class="slide-desc">
            Form pencatatan pengeluaran dan pemasukan dengan pemformatan mata uang otomatis, pemilih tanggal, dan tombol kategori cepat.
          </p>
        </div>

        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-card-title">Format Input Angka Otomatis</div>
            <div class="feature-card-text">
              Angka yang diketik otomatis diformat dengan pemisah ribuan titik sehingga memudahkan pembacaan nominal besar.
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-card-title">Pemilih Kategori Cepat</div>
            <div class="feature-card-text">
              Ikon kategori yang dapat dipilih dengan sekali sentuh untuk mempercepat proses pencatatan belanja harian.
            </div>
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-val">&lt; 5 Detik</div>
            <div class="metric-lbl">Waktu Catat</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Auto</div>
            <div class="metric-lbl">Masking Nilai</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Validation</div>
            <div class="metric-lbl">Ketat</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.addTxDesktop}" class="screenshot-desktop" alt="Add Transaction Desktop">
        <img src="${images.addTxMobile}" class="screenshot-mobile" alt="Add Transaction Mobile">
      </div>
    </div>

    <div class="slide-footer">
      <div>PENCATATAN TRANSAKSI</div>
      <div>FORMULIR VALIDASI INPUT</div>
      <div>06 / 10</div>
    </div>
  </div>

  <!-- SLIDE 07: PWA CAPABILITIES -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-tag">PROGRESSIVE WEB APP</div>
      <div class="slide-num">07 / 10</div>
    </div>

    <div class="slide-body">
      <div class="slide-info">
        <div class="headline-group">
          <h2 class="slide-title">Navigasi Bawah & Karakteristik PWA</h2>
          <p class="slide-desc">
            Dirancang sebagai Progressive Web App yang dapat dipasang ke layar beranda ponsel dengan bilah navigasi bawah khas aplikasi native.
          </p>
        </div>

        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-card-title">Bottom Navigation Bar Mobile</div>
            <div class="feature-card-text">
              Akses cepat ke menu Beranda, Dompet, Tambah Transaksi, Analitik, dan Profil dalam jangkauan satu tangan.
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-card-title">Manifest & Service Worker</div>
            <div class="feature-card-text">
              Dukungan file manifest.json memungkinkan pemasangan ikon aplikasi langsung di layar beranda Android dan iOS.
            </div>
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-val">PWA</div>
            <div class="metric-lbl">Installable</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Bottom</div>
            <div class="metric-lbl">Bar Menu</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Safe-Area</div>
            <div class="metric-lbl">Padding</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.dashboardDesktop}" class="screenshot-desktop" alt="PWA Desktop">
        <img src="${images.dashboardMobile}" class="screenshot-mobile" alt="PWA Mobile">
      </div>
    </div>

    <div class="slide-footer">
      <div>PROGRESSIVE WEB APP</div>
      <div>ADAPTASI PWA MOBILE FIRST</div>
      <div>07 / 10</div>
    </div>
  </div>

  <!-- SLIDE 08: AUTH & PROFILE -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-tag">AKUN & PROFIL</div>
      <div class="slide-num">08 / 10</div>
    </div>

    <div class="slide-body">
      <div class="slide-info">
        <div class="headline-group">
          <h2 class="slide-title">Autentikasi Akun & Pengaturan Pengguna</h2>
          <p class="slide-desc">
            Sistem masuk pengguna berbasis email dan kata sandi dengan validasi keamanan sesi serta pengaturan preferensi mata uang profil.
          </p>
        </div>

        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-card-title">Peringatan Kredensial Tidak Valid</div>
            <div class="feature-card-text">
              Notifikasi umpan balik instan saat kombinasi email atau kata sandi tidak cocok tanpa kehilangan isi input.
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-card-title">Kontrol Data & Ekspor</div>
            <div class="feature-card-text">
              Halaman profil menyediakan pengaturan reset histori data transaksi dan opsi keluar akun yang aman.
            </div>
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-val">Auth</div>
            <div class="metric-lbl">Session Token</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Profil</div>
            <div class="metric-lbl">Preferensi</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Aman</div>
            <div class="metric-lbl">Enkripsi Data</div>
          </div>
        </div>
      </div>

      <div class="visual-stage">
        <img src="${images.loginDesktop}" class="screenshot-desktop" alt="Login Desktop">
        <img src="${images.loginMobile}" class="screenshot-mobile" alt="Login Mobile">
      </div>
    </div>

    <div class="slide-footer">
      <div>AUTENTIKASI & PROFIL</div>
      <div>PENGATURAN PENGGUNA</div>
      <div>08 / 10</div>
    </div>
  </div>

  <!-- SLIDE 09: TECH STACK -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-tag">TEKNOLOGI</div>
      <div class="slide-num">09 / 10</div>
    </div>

    <div style="margin-bottom: 8px;">
      <h2 class="slide-title">Susunan Teknologi & Dependensi</h2>
      <p class="slide-desc">
        Aplikasi web dibangun menggunakan Next.js 14 App Router yang dikombinasikan dengan basis data Supabase PostgreSQL dan pustaka visualisasi grafik Recharts.
      </p>
    </div>

    <div class="tech-grid">
      <div class="tech-col">
        <div class="tech-col-title">01. FRONTEND CORE</div>
        <div class="tech-item">
          <div class="tech-item-name">Next.js 14 App Router</div>
          <div class="tech-item-desc">Framework React untuk routing modular dan perenderan halaman teroptimasi.</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-name">React 18</div>
          <div class="tech-item-desc">Manajemen state UI untuk perhitungan saldo dinamis dan mutasi dompet.</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-name">Tailwind CSS</div>
          <div class="tech-item-desc">Styling tema fintech gelap dengan skema warna emerald yang bersih.</div>
        </div>
      </div>

      <div class="tech-col">
        <div class="tech-col-title">02. DATA & VISUALISASI</div>
        <div class="tech-item">
          <div class="tech-item-name">Supabase PostgreSQL</div>
          <div class="tech-item-desc">Basis data relasional SQL untuk penyimpanan transaksi dan saldo akun.</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-name">Recharts</div>
          <div class="tech-item-desc">Pustaka grafik SVG interaktif untuk visualisasi arus kas bulanan.</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-name">Lucide React</div>
          <div class="tech-item-desc">Koleksi ikon kategori pengeluaran dan navigasi menu.</div>
        </div>
      </div>

      <div class="tech-col">
        <div class="tech-col-title">03. PWA & DEPLOYMENT</div>
        <div class="tech-item">
          <div class="tech-item-name">next-pwa</div>
          <div class="tech-item-desc">Konfigurasi Service Worker dan Web App Manifest untuk instalasi homescreen.</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-name">Vercel Platform</div>
          <div class="tech-item-desc">Penyajian serverless frontend dengan latensi edge rendah.</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-name">Playwright E2E</div>
          <div class="tech-item-desc">Pengujian alur pencatatan transaksi untuk memastikan integritas data.</div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>SUSUNAN TEKNOLOGI</div>
      <div>ARSITEKTUR & DEPENDENSI</div>
      <div>09 / 10</div>
    </div>
  </div>

  <!-- SLIDE 10: CLOSING -->
  <div class="slide closing-slide">
    <div class="header-tag" style="padding: 5px 16px; font-size: 11px;">MONEW PWA PLATFORM</div>
    <h1 class="closing-title">PERSONAL MONEY MANAGEMENT PWA</h1>
    
    <p style="font-size: 14.5px; color: var(--text-muted); max-width: 650px; line-height: 1.5;">
      Solusi pencatatan keuangan pribadi modern yang menyatukan kemudahan manajemen multi-dompet, kejelasan grafik pengeluaran, dan kenyamanan akses sebagai aplikasi web progresif.
    </p>

    <div class="closing-card">
      <div style="font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em;">
        DEMO PRODUKSI
      </div>
      <div class="closing-url">https://monew.widifirmaan.web.id</div>
      <div style="font-size:11px; color:var(--text-muted);">
        Next.js 14 • Supabase PostgreSQL • Recharts • PWA Installable
      </div>
    </div>

    <div class="slide-footer" style="width: 100%; margin-top: 15px;">
      <div>WIDI FIRMANSYAH</div>
      <div>PENGEMBANG UTAMA</div>
      <div>10 / 10</div>
    </div>
  </div>

</body>
</html>
`;

const htmlFilePath = path.join(projectRoot, 'presentation.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');
console.log(`Presentation HTML written to: ${htmlFilePath}`);

console.log('Launching Chromium with Playwright to render MoneW PDF...');

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
  console.log('Rendering Multi-Page A4 Landscape Presentation PDF (Slide Mode)...');
  await page.pdf({
    path: slidePdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
  });

  // 2. Continuous Poster Mode (Single tall scroll)
  console.log('Rendering Continuous Single-Scroll Showcase PDF (Poster Mode)...');
  await page.addStyleTag({
    content: `
      @page {
        size: auto;
        margin: 0;
      }
      body {
        background: #090D14 !important;
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

  console.log('\nMoneW PDFs successfully generated:');
  console.log(`- Multi-Page Deck: ${(slideStat.size / 1024 / 1024).toFixed(2)} MB (${slidePdfPath})`);
  console.log(`- Continuous Poster: ${(contStat.size / 1024 / 1024).toFixed(2)} MB (${continuousPdfPath})\n`);
}

renderPDF().catch((err) => {
  console.error('Error during PDF generation:', err);
  process.exit(1);
});
