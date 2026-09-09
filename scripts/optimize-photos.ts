/**
 * 갤러리 원본(weddingPhoto/…) → public/gallery/ 로 WebP 최적화.
 *
 *   pnpm photos            # 전체 처리 (이미 있는 결과물은 건너뜀)
 *   pnpm photos --force    # 전부 다시 생성
 *
 * 결과:
 *   public/gallery/<id>.webp        긴 변 1600px, q80
 *   public/gallery/<id>.thumb.webp  긴 변 480px,  q75
 *   src/config/gallery.generated.json  { id, src, thumb, width, height, orientation }[]
 *
 * 원본 폴더는 절대 수정하지 않는다. '액자 크기 크롭본/' 하위 폴더는 제외한다.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "weddingPhoto", "신현종 강민지님 앨범수정본");
const OUT_DIR = path.join(ROOT, "public", "gallery");
const MANIFEST = path.join(ROOT, "src", "config", "gallery.generated.json");

const FULL_MAX = 1600;
const THUMB_MAX = 480;
const CONCURRENCY = 4;
const force = process.argv.includes("--force");

interface Entry {
  id: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  /** 원본 파일명 (참고용, 웹에서는 쓰지 않음) */
  original: string;
}

/** "YS_01595 첫장---.jpg" → "YS_01595" */
function idFromFilename(file: string): string {
  const base = path.basename(file, path.extname(file));
  const token = base.split(/[\s-]/)[0];
  return token.replace(/[^A-Za-z0-9_]/g, "");
}

async function exists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function processOne(file: string): Promise<Entry> {
  const id = idFromFilename(file);
  const input = path.join(SRC_DIR, file);
  const fullOut = path.join(OUT_DIR, `${id}.webp`);
  const thumbOut = path.join(OUT_DIR, `${id}.thumb.webp`);

  const meta = await sharp(input).rotate().metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const scale = Math.min(1, FULL_MAX / Math.max(w, h));
  const width = Math.round(w * scale);
  const height = Math.round(h * scale);

  if (force || !(await exists(fullOut))) {
    await sharp(input)
      .rotate()
      .resize({ width: FULL_MAX, height: FULL_MAX, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(fullOut);
  }
  if (force || !(await exists(thumbOut))) {
    await sharp(input)
      .rotate()
      .resize({ width: THUMB_MAX, height: THUMB_MAX, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(thumbOut);
  }

  return {
    id,
    src: `/gallery/${id}.webp`,
    thumb: `/gallery/${id}.thumb.webp`,
    width,
    height,
    orientation: w >= h ? "landscape" : "portrait",
    original: file,
  };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const files = (await fs.readdir(SRC_DIR, { withFileTypes: true }))
    .filter((d) => d.isFile() && /\.(jpe?g|png)$/i.test(d.name))
    .map((d) => d.name)
    .sort();

  const ids = new Set<string>();
  for (const f of files) {
    const id = idFromFilename(f);
    if (ids.has(id)) throw new Error(`중복 id: ${id} (${f})`);
    ids.add(id);
  }

  const entries: Entry[] = [];
  let next = 0;
  async function worker() {
    while (next < files.length) {
      const file = files[next++];
      const entry = await processOne(file);
      entries.push(entry);
      console.log(`✓ ${entry.id}  ${entry.width}x${entry.height}  (${file})`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  entries.sort((a, b) => a.id.localeCompare(b.id));
  await fs.writeFile(MANIFEST, JSON.stringify(entries, null, 2) + "\n");
  console.log(`\n${entries.length}장 처리 완료 → ${path.relative(ROOT, MANIFEST)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
