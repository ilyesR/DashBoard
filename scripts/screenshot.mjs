/**
 * Capture the review set. Usage: node scripts/screenshot.mjs <baseUrl>
 * Writes into .impeccable/review/.
 */
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer";

const base = process.argv[2] ?? "http://localhost:3000";
const out = ".impeccable/review";

const SHOTS = [
  { file: "desktop.png", path: "/", width: 1440, height: 900, full: true },
  { file: "desktop-hero.png", path: "/", width: 1440, height: 900, full: false },
  { file: "desktop-projects.png", path: "/projects", width: 1440, height: 900, full: true },
  { file: "desktop-project-detail.png", path: "/projects/marasi", width: 1440, height: 900, full: true },
  { file: "desktop-transactions.png", path: "/transactions", width: 1440, height: 900, full: false },
  { file: "desktop-unattributed.png", path: "/transactions/unattributed", width: 1440, height: 900, full: true },
  { file: "desktop-settings.png", path: "/settings", width: 1440, height: 900, full: true },
  { file: "desktop-connections.png", path: "/settings/connections", width: 1440, height: 900, full: true },
  { file: "mobile.png", path: "/", width: 390, height: 844, full: true },
  { file: "mobile-hero.png", path: "/", width: 390, height: 844, full: false },
  { file: "mobile-transactions.png", path: "/transactions", width: 390, height: 844, full: false },
  { file: "mobile-project-detail.png", path: "/projects/marasi", width: 390, height: 844, full: true },
];

await mkdir(out, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--force-color-profile=srgb", "--font-render-hinting=none"],
});

for (const shot of SHOTS) {
  const page = await browser.newPage();
  await page.setViewport({
    width: shot.width,
    height: shot.height,
    deviceScaleFactor: 2,
    isMobile: shot.width < 768,
    hasTouch: shot.width < 768,
  });
  await page.goto(base + shot.path, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1400)); // let the settle finish
  await page.screenshot({ path: `${out}/${shot.file}`, fullPage: shot.full });
  console.log(`${shot.file}  ${shot.width}x${shot.height}${shot.full ? " (full)" : ""}`);
  await page.close();
}

await browser.close();
