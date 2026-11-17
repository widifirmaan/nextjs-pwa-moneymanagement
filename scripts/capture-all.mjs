import puppeteer from 'puppeteer-core';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createJWT(payload, secret) {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
    const body = Buffer.from(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) })).toString("base64");
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${header}.${body}`);
    const sig = hmac.digest("base64");
    return `${header}.${body}.${sig}`;
}

const token = createJWT(
    { id: "620c27fa-2024-4863-8ac5-2c2f1514a4aa", email: "vejoyf@gmail.com", name: "Widi Firmansyah" },
    "dev-secret"
);

const BASE_URL = 'https://money.widifirmaan.web.id';
const rawDir = path.resolve(__dirname, '../raw_screenshots');
const screenshotsDir = path.resolve(__dirname, '../screenshots');

if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

const desktopViewport = { width: 1440, height: 900, deviceScaleFactor: 1.5 };
const mobileViewport = { width: 390, height: 806, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

const scenes = [
    {
        name: 'MoneW Dashboard',
        path: '/',
        selector: 'h1',
        requiresAuth: true,
        extraWait: 3000,
    },
    {
        name: 'MoneW Monthly Analytics',
        path: '/stats',
        selector: 'h1',
        requiresAuth: true,
        extraWait: 3000,
    },
    {
        name: 'MoneW Linked Cards',
        path: '/cards',
        selector: 'h1',
        requiresAuth: true,
        extraWait: 3000,
    },
    {
        name: 'MoneW Digital Wallets',
        path: '/wallets',
        selector: 'h1',
        requiresAuth: true,
        extraWait: 3000,
    },
    {
        name: 'MoneW Add Transaction',
        path: '/add',
        selector: 'form, input',
        requiresAuth: true,
        extraWait: 3000,
    },
    {
        name: 'MoneW User Profile',
        path: '/profile',
        selector: 'h3',
        requiresAuth: true,
        extraWait: 3000,
    },
    {
        name: 'MoneW Authentication',
        path: '/login',
        selector: 'form',
        requiresAuth: false,
        extraWait: 3000,
    },
];

async function capture() {
    console.log('🚀 Starting screenshot capture from:', BASE_URL);
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    for (const scene of scenes) {
        for (const isMobile of [false, true]) {
            const mode = isMobile ? 'Mobile' : 'Desktop';
            const filename = `${scene.name} ${mode}.png`;
            const destPath = path.join(rawDir, filename);

            console.log(`📸 Capturing: ${filename}...`);
            const page = await browser.newPage();
            await page.setViewport(isMobile ? mobileViewport : desktopViewport);

            // Pre-seed localStorage BEFORE navigation starts
            if (scene.requiresAuth) {
                await page.evaluateOnNewDocument((t) => {
                    localStorage.setItem('monew_token', t);
                    localStorage.setItem('isPrivacyMode', 'false');
                    localStorage.setItem('install-prompt-dismissed', Date.now().toString());
                }, token);
            } else {
                await page.evaluateOnNewDocument(() => {
                    localStorage.removeItem('monew_token');
                    localStorage.setItem('install-prompt-dismissed', Date.now().toString());
                });
            }

            // Navigate to actual target page
            const targetUrl = `${BASE_URL}${scene.path}`;
            await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

            if (scene.selector) {
                try {
                    await page.waitForSelector(scene.selector, { timeout: 8000 });
                } catch {
                    console.warn(`⚠️ Selector ${scene.selector} timeout on ${targetUrl}, continuing...`);
                }
            }

            // Dismiss any install prompt or modal that might linger
            await page.evaluate(() => {
                const dismissBtns = Array.from(document.querySelectorAll('button'));
                for (const b of dismissBtns) {
                    if (b.textContent && (b.textContent.includes('Not now') || b.textContent.includes('Later'))) {
                        b.click();
                    }
                }
            });

            await new Promise((r) => setTimeout(r, scene.extraWait || 3000));

            // Wait for fonts
            await page.evaluate(async () => {
                if (document.fonts) await document.fonts.ready;
            });

            await page.screenshot({ path: destPath });
            await page.close();
        }
    }

    await browser.close();
    console.log('✅ All raw screenshots captured successfully!');

    // Generate framed mockups
    console.log('🎨 Generating device mockups (MacBook Pro & iPhone 16 Pro)...');
    const mockupScript = '/home/widifirmaan/readme-project/scripts/generate-mockups.mjs';
    execSync(`NODE_PATH=/home/widifirmaan/node_modules node "${mockupScript}" --input "${rawDir}" --output "${screenshotsDir}"`, {
        stdio: 'inherit',
    });

    console.log('🎉 Mockup generation completed!');
    // Clean up raw screenshots
    fs.rmSync(rawDir, { recursive: true, force: true });
    console.log('🧹 Cleaned up temporary raw screenshots.');
}

capture().catch((err) => {
    console.error('Error during capture:', err);
    process.exit(1);
});
