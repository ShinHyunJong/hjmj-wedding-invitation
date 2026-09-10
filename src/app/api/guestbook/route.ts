import type { NextRequest } from "next/server";
import type { RowDataPacket } from "mysql2";
import { exec, query } from "@/lib/server/db";
import { ok, bad, readJson, clientIp, clean, tooMany, isBot, hashPassword } from "@/lib/server/http";

export const runtime = "nodejs";

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

/** 목록 (최신순, 커서 = 마지막 id). ?limit=20&cursor=123 */
export async function GET(req: NextRequest) {
  const limit = Math.min(50, Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || 20));
  const cursor = Number(req.nextUrl.searchParams.get("cursor")) || 0;
  const rows = await query<(RowDataPacket & { id: number; name: string; message: string; created_at: Date })[]>(
    `SELECT id, name, message, created_at FROM guestbook
     WHERE deleted_at IS NULL ${cursor ? "AND id < ?" : ""}
     ORDER BY id DESC LIMIT ${limit + 1}`,
    cursor ? [cursor] : [],
  );
  const hasMore = rows.length > limit;
  const items: GuestbookEntry[] = rows.slice(0, limit).map((r) => ({
    id: r.id,
    name: r.name,
    message: r.message,
    createdAt: new Date(r.created_at).toISOString(),
  }));
  return ok({ items, nextCursor: hasMore ? items[items.length - 1].id : null });
}

interface Body {
  name: string;
  message: string;
  password: string;
  website?: string;
}

/** 작성 */
export async function POST(req: NextRequest) {
  const body = await readJson<Body>(req);
  if (isBot(body)) return ok();

  const name = clean(body.name, 40);
  const message = clean(body.message, 500);
  const password = typeof body.password === "string" ? body.password.trim() : "";

  if (name.length < 1) return bad("이름을 입력해 주세요.");
  if (message.length < 2) return bad("내용을 입력해 주세요.");
  if (password.length < 4 || password.length > 20) return bad("비밀번호는 4~20자로 입력해 주세요.");

  const ip = clientIp(req);
  if (await tooMany("guestbook", ip, 5, 10)) return bad("잠시 후 다시 시도해 주세요.", 429);

  const res = await exec("INSERT INTO guestbook (name, message, password_hash, ip) VALUES (?, ?, ?, ?)", [name, message, hashPassword(password), ip]);
  return ok({ ok: true, id: res.insertId });
}
