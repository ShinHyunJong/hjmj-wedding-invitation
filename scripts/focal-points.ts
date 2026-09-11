/**
 * 사진별 초점(얼굴 위치) 계산 → src/config/focal.generated.json  { id: { x, y, faces } }  (x, y 는 0~100 %)
 *   pnpm focal
 * macOS 전용: Vision 프레임워크를 쓰는 scripts/faces/faces.swift 를 swiftc 로 컴파일해 실행한다.
 * 얼굴이 없으면 세로 사진 50%/35%, 가로 사진 50%/50%.
 * 결과는 갤러리 썸네일 · 대표 사진 · hero · closing 의 object-position 에 쓰인다.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "scripts/faces/faces.swift");
const BIN = path.join(ROOT, "node_modules/.cache/faces");
const MANIFEST = path.join(ROOT, "src/config/gallery.generated.json");
const OUT = path.join(ROOT, "src/config/focal.generated.json");

interface Entry { id: string; width: number; height: number; orientation: "portrait" | "landscape" }
interface Focal { x: number; y: number; faces: number }

function build() {
  if (existsSync(BIN) && statSync(BIN).mtimeMs >= statSync(SRC).mtimeMs) return;
  mkdirSync(path.dirname(BIN), { recursive: true });
  execFileSync("swiftc", ["-O", SRC, "-o", BIN], { stdio: "inherit" });
}

function main() {
  if (process.platform !== "darwin") throw new Error("macOS 에서만 실행할 수 있습니다 (Vision 프레임워크)");
  build();
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8")) as Entry[];
  const files = manifest.map((p) => path.join(ROOT, "public/gallery", `${p.id}.webp`));
  const lines = execFileSync(BIN, files, { encoding: "utf8", maxBuffer: 1 << 24 }).trim().split("\n");

  const result: Record<string, Focal> = {};
  for (const line of lines) {
    const [file, w, h, ...boxes] = line.split(" ");
    const id = path.basename(file, ".webp");
    const entry = manifest.find((p) => p.id === id);
    if (!entry || w === "ERR") continue;
    const W = Number(w), H = Number(h);
    // 얼굴 박스 전체를 감싸는 사각형의 중심을 초점으로. 아주 작은(배경) 얼굴은 가장 큰 얼굴의 1/3 미만이면 제외.
    const rects = boxes.map((b) => b.split(",").map(Number)).map(([x, y, bw, bh]) => ({ x, y, w: bw, h: bh }));
    const maxW = Math.max(0, ...rects.map((r) => r.w));
    const keep = rects.filter((r) => r.w >= maxW / 3);
    if (keep.length === 0) {
      result[id] = { x: 50, y: entry.orientation === "portrait" ? 35 : 50, faces: 0 };
      continue;
    }
    const left = Math.min(...keep.map((r) => r.x));
    const right = Math.max(...keep.map((r) => r.x + r.w));
    const top = Math.min(...keep.map((r) => r.y));
    const bottom = Math.max(...keep.map((r) => r.y + r.h));
    // 초점은 얼굴 묶음의 중심. 세로는 이마 위 여백을 위해 살짝 위(박스 높이의 15%)로.
    const cx = (left + right) / 2 / W;
    const cy = ((top + bottom) / 2 - (bottom - top) * 0.15) / H;
    result[id] = { x: Math.round(cx * 100), y: Math.round(cy * 100), faces: keep.length };
  }
  writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n");
  const noFace = Object.entries(result).filter(([, v]) => v.faces === 0).map(([k]) => k);
  console.log(`${Object.keys(result).length}장 처리 → ${path.relative(ROOT, OUT)}`);
  console.log(`얼굴 못 찾음 (${noFace.length}): ${noFace.join(", ") || "없음"}`);
}
main();
