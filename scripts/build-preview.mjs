/**
 * Artifact(claude.ai 링크) 공유용 단일 HTML 생성.
 *
 *   pnpm preview                      # hero 변형 전부 빌드 → screenshots/preview.html
 *   pnpm preview --variants photo     # 특정 변형만
 *
 * 동작: heroVariant 를 바꿔 가며 `next build` 를 돌리고, out/index.html 의 <main> 과 CSS 를 하나로 합친다.
 * - next/font self-host @font-face 는 제거하고 Google Fonts <link> 로 대체 (Artifact CSP 는 fonts.googleapis.com 만 허용)
 * - SUIT CDN @import 는 CSP 에 막히므로 미리보기에서는 Noto Sans KR 로 대체
 * - /gallery, /images 이미지는 data URI 로 인라인 (16MB 제한 안에서)
 * config/wedding.ts 는 작업 후 원래 값으로 복구한다.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONFIG = path.join(ROOT, "src/config/wedding.ts");
const OUT = path.join(ROOT, "out");
const DEST_DIR = path.join(ROOT, "screenshots");
const DEST = path.join(DEST_DIR, "preview.html");

const LABELS = { photo: "사진", sealed: "실링왁스", polaroid: "폴라로이드" };
const argIdx = process.argv.indexOf("--variants");
const variants = argIdx >= 0 ? process.argv[argIdx + 1].split(",") : ["photo", "sealed", "polaroid"];

const original = readFileSync(CONFIG, "utf8");
const current = original.match(/heroVariant: "(\w+)" as HeroVariant/)?.[1];
if (!current) throw new Error("heroVariant 를 config 에서 찾지 못함");

function buildWith(variant) {
  writeFileSync(CONFIG, original.replace(/heroVariant: "\w+" as HeroVariant/, `heroVariant: "${variant}" as HeroVariant`));
  execSync("pnpm build", { cwd: ROOT, stdio: "pipe" });
  return readFileSync(path.join(OUT, "index.html"), "utf8");
}

const mime = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", svg: "image/svg+xml" };
function inlineImages(html) {
  return html.replace(/src="(\/(?:gallery|images)\/[^"]+)"/g, (m, p) => {
    const file = path.join(ROOT, "public", p);
    if (!existsSync(file)) return m;
    const ext = p.split(".").pop().toLowerCase();
    return `src="data:${mime[ext] ?? "application/octet-stream"};base64,${readFileSync(file).toString("base64")}"`;
  });
}

try {
  const mains = {};
  let css = "";
  for (const v of variants) {
    const html = buildWith(v);
    if (!css) {
      for (const [, href] of html.matchAll(/<link[^>]+href="([^"]+\.css)"[^>]*>/g)) css += readFileSync(path.join(OUT, href), "utf8") + "\n";
    }
    const main = html.match(/<main[\s\S]*?<\/main>/)?.[0];
    if (!main) throw new Error("main not found");
    mains[v] = inlineImages(main);
    console.log(`✓ ${v}`);
  }

  css = css
    .replace(/@font-face\{[^}]*\}/g, "")
    .replace(/@import[^;]*jsdelivr[^;]*;/g, "")
    .replace(/'__Pinyon_Script(_Fallback)?_[a-z0-9]+'/g, "'Pinyon Script'")
    .replace(/'__Cormorant_Garamond(_Fallback)?_[a-z0-9]+'/g, "'Cormorant Garamond'")
    .replace(/'__Noto_Serif_KR(_Fallback)?_[a-z0-9]+'/g, "'Noto Serif KR'")
    .replace(/"SUIT Variable",\s*"SUIT",\s*"Pretendard",/g, '"Noto Sans KR",')
    .replace(/('[^']+'),\s*\1/g, "$1");

  const first = variants.includes(current) ? current : variants[0];
  const bar =
    variants.length > 1
      ? `<div class="preview-bar" role="group" aria-label="첫 화면 변형 선택"><span class="label">첫 화면</span>${variants
          .map((v) => `<button type="button" data-variant="${v}" aria-pressed="${v === first}">${LABELS[v] ?? v}${v === current ? " (기본)" : ""}</button>`)
          .join("")}</div>`
      : "";

  const page = `<title>신현종 ♥ 강민지 청첩장</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:wght@400;500;600&family=Noto+Serif+KR:wght@400;500;600&family=Noto+Sans+KR:wght@300;400;500;600&display=swap">
<style>
${css}
:root { --font-script: 'Pinyon Script'; --font-serif-en: 'Cormorant Garamond'; --font-serif-ko: 'Noto Serif KR'; }
html, body { background: var(--color-bg-tint); }
.preview-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 40; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 12px; background: rgba(255,255,255,.86); backdrop-filter: blur(8px); border-bottom: 1px solid var(--color-line); font-family: 'Noto Sans KR', sans-serif; font-size: 12px; color: var(--color-text-sub); }
.preview-bar .label { margin-right: 4px; }
.preview-bar button { appearance: none; border: 1px solid var(--color-line); background: #fff; color: var(--color-text-sub); border-radius: 999px; padding: 4px 12px; font: inherit; cursor: pointer; }
.preview-bar button[aria-pressed="true"] { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
.preview-bar button:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
${bar ? ".card { padding-top: 44px; }" : ""}
</style>
${bar}
${variants.map((v) => `<div id="v-${v}"${v === first ? "" : " hidden"}>${mains[v]}</div>`).join("\n")}
<script>
(function () {
  // 미리보기에는 Next 런타임이 없으므로 카운트다운만 인라인으로 돌린다. (더보기 · 라이트박스 · 복사 버튼은 실제 사이트에서만 동작)
  function tick() {
    document.querySelectorAll("[data-cd-target]").forEach(function (root) {
      var target = new Date(root.getAttribute("data-cd-target")).getTime();
      var diff = Math.max(0, Math.floor((target - Date.now()) / 1000));
      var v = { days: Math.floor(diff / 86400), hours: Math.floor(diff % 86400 / 3600), minutes: Math.floor(diff % 3600 / 60), seconds: diff % 60 };
      var kst = function (t) { return Math.floor((t + 9 * 3600 * 1000) / 86400000); };
      v.dday = kst(target) - kst(Date.now());
      root.querySelectorAll("[data-cd]").forEach(function (el) {
        var k = el.getAttribute("data-cd"); var n = v[k];
        el.textContent = (k === "days" || k === "dday") ? String(n) : String(n).padStart(2, "0");
      });
    });
  }
  tick(); setInterval(tick, 1000);

  var buttons = document.querySelectorAll(".preview-bar button");
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.dataset.variant;
      document.querySelectorAll('[id^="v-"]').forEach(function (el) { el.hidden = el.id !== "v-" + v; });
      buttons.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      window.scrollTo(0, 0);
    });
  });
})();
</script>
`;
  mkdirSync(DEST_DIR, { recursive: true });
  writeFileSync(DEST, page);
  console.log(`→ ${path.relative(ROOT, DEST)}  (${(page.length / 1024 / 1024).toFixed(2)} MB)`);
} finally {
  writeFileSync(CONFIG, original);
  execSync("pnpm build", { cwd: ROOT, stdio: "pipe" }); // out/ 을 기본 변형으로 되돌림
}
