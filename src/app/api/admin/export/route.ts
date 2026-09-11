import type { NextRequest } from "next/server";
import type { RowDataPacket } from "mysql2";
import { query } from "@/lib/server/db";
import { bad, isAdmin, withErrors } from "@/lib/server/http";

export const runtime = "nodejs";

/**
 * 관리자용 CSV 내보내기. ADMIN_TOKEN 환경변수가 있어야 동작.
 *   /api/admin/export?type=rsvp&token=...      참석 의사
 *   /api/admin/export?type=guestbook&token=...  방명록 (삭제 포함)
 *   /api/admin/export?type=photos&token=...     사진 목록 (S3 키)
 * 엑셀에서 한글이 깨지지 않도록 UTF-8 BOM 을 붙인다.
 */
export const GET = withErrors(async (req: NextRequest) => {
  if (!isAdmin(req)) return bad("권한이 없습니다.", 401);
  const type = req.nextUrl.searchParams.get("type") ?? "rsvp";

  let sql: string;
  if (type === "rsvp") sql = "SELECT id, side, name, attending, headcount, message, created_at FROM rsvp ORDER BY id";
  else if (type === "guestbook") sql = "SELECT id, name, message, created_at, deleted_at FROM guestbook ORDER BY id";
  else if (type === "photos") sql = "SELECT id, s3_key, uploader, size, status, created_at FROM photos ORDER BY id";
  else return bad("type 은 rsvp, guestbook, photos 중 하나입니다.");

  const rows = await query<RowDataPacket[]>(sql);
  const cols = rows[0] ? Object.keys(rows[0]) : [];
  const esc = (v: unknown) => {
    const s = v instanceof Date ? new Date(v.getTime() + 9 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 19) : v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = "﻿" + [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  return new Response(csv, {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${type}.csv"` },
  });
});
