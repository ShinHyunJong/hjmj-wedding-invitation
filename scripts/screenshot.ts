/**
 * 헤드리스 Chromium으로 페이지 스크린샷. Playwright MCP(브라우저 창이 열려 포커스를 뺏음) 대신 이 스크립트를 쓴다.
 *
 *   pnpm shot                          # http://localhost:5400 첫 화면(390×844) → screenshots/viewport.png
 *   pnpm shot --full                   # 전체 페이지 → screenshots/full.png
 *   pnpm shot --url http://localhost:5400/#gallery --out gallery.png
 *   pnpm shot --width 430 --height 932 # 뷰포트 변경
 *
 * hero 변형을 비교하려면 config/wedding.ts 의 heroVariant 를 바꾸고 다시 찍는다.
 * 결과 파일은 screenshots/ (gitignore) 에 저장된다.
 */
import { chromium } from "playwright";
import path from "node:path";
import { promises as fs } from "node:fs";

const args = process.argv.slice(2);
function opt(name: string, def?: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
}
const flag = (name: string) => args.includes(`--${name}`);

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "screenshots");

async function main() {
  const full = flag("full");
  const width = Number(opt("width", "390"));
  const height = Number(opt("height", "844"));
  const url = opt("url", "http://localhost:5400/")!;
  const out = path.join(OUT_DIR, opt("out", full ? "full.png" : "viewport.png")!);

  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (full) {
    // 스크롤 진입 애니메이션(Reveal)과 lazy 이미지가 모두 나타나도록 끝까지 스크롤한 뒤 캡처
    await page.evaluate(async () => {
      const total = document.documentElement.scrollHeight;
      for (let y = 0; y < total; y += 300) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);
  }
  await page.screenshot({ path: out, fullPage: full });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  await browser.close();

  console.log(`saved ${path.relative(ROOT, out)}  (viewport ${width}x${height}, page height ${h}px)`);
  if (errors.length) {
    console.log(`console errors (${errors.length}):`);
    for (const e of errors) console.log("  - " + e);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
