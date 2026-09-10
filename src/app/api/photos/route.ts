import type { NextRequest } from "next/server";
import type { RowDataPacket } from "mysql2";
import { randomUUID } from "node:crypto";
import { exec, query } from "@/lib/server/db";
import { ok, bad, readJson, clientIp, clean, tooMany, isBot, todayKST } from "@/lib/server/http";
import { presignUpload, presignView, S3_PREFIX } from "@/lib/server/s3";
import { wedding } from "@/config/wedding";

export const runtime = "nodejs";

const MAX_SIZE = 25 * 1024 * 1024; // 25MB
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic", "image/heif": "heif" };

/** 예식 당일 0시(KST)부터 업로드 가능. 테스트용으로 PHOTO_UPLOAD_OPEN=1 이면 항상 열림. */
export function uploadOpen(): boolean {
  if (process.env.PHOTO_UPLOAD_OPEN === "1") return true;
  const { year, month, day } = wedding.date;
  const opens = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return todayKST() >= opens;
}

/** 업로드된 사진 목록 (최신순, 서명 URL 포함). ?limit=24&cursor=id */
export async function GET(req: NextRequest) {
  const limit = Math.min(60, Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || 24));
  const cursor = Number(req.nextUrl.searchParams.get("cursor")) || 0;
  const rows = await query<(RowDataPacket & { id: number; s3_key: string; uploader: string | null; created_at: Date })[]>(
    `SELECT id, s3_key, uploader, created_at FROM photos
     WHERE status = 'uploaded' ${cursor ? "AND id < ?" : ""}
     ORDER BY id DESC LIMIT ${limit + 1}`,
    cursor ? [cursor] : [],
  );
  const hasMore = rows.length > limit;
  const items = await Promise.all(
    rows.slice(0, limit).map(async (r) => ({
      id: r.id,
      url: await presignView(r.s3_key),
      uploader: r.uploader,
      createdAt: new Date(r.created_at).toISOString(),
    })),
  );
  return ok({ items, nextCursor: hasMore ? items[items.length - 1].id : null, open: uploadOpen() });
}

interface Body {
  contentType: string;
  size: number;
  uploader?: string;
  website?: string;
}

/** 업로드 준비: DB 에 pending 행을 만들고 S3 서명 PUT URL 을 돌려준다. */
export async function POST(req: NextRequest) {
  if (!uploadOpen()) return bad("예식 당일부터 업로드할 수 있습니다.", 403);
  const body = await readJson<Body>(req);
  if (isBot(body)) return ok();

  const contentType = typeof body.contentType === "string" ? body.contentType.toLowerCase() : "";
  const ext = TYPES[contentType];
  const size = Math.floor(Number(body.size) || 0);
  if (!ext) return bad("JPG, PNG, WebP, HEIC 이미지만 올릴 수 있습니다.");
  if (size <= 0 || size > MAX_SIZE) return bad("사진 한 장은 25MB 이하여야 합니다.");
  const uploader = clean(body.uploader, 40) || null;

  const ip = clientIp(req);
  if (await tooMany("photos", ip, 60, 10)) return bad("잠시 후 다시 시도해 주세요.", 429);

  const key = `${S3_PREFIX}/photos/${todayKST().replace(/-/g, "")}/${randomUUID()}.${ext}`;
  const res = await exec("INSERT INTO photos (s3_key, content_type, size, uploader, ip) VALUES (?, ?, ?, ?, ?)", [key, contentType, size, uploader, ip]);
  const uploadUrl = await presignUpload(key, contentType, size);
  return ok({ ok: true, id: res.insertId, uploadUrl });
}
