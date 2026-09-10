import type { NextRequest } from "next/server";
import type { RowDataPacket } from "mysql2";
import { exec, query } from "@/lib/server/db";
import { ok, bad, readJson, verifyPassword, isAdmin } from "@/lib/server/http";

export const runtime = "nodejs";

/** 삭제 (작성자 비밀번호 또는 관리자 토큰). 실제로는 deleted_at 만 찍는다. */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return bad("잘못된 요청입니다.");

  const rows = await query<(RowDataPacket & { password_hash: string })[]>("SELECT password_hash FROM guestbook WHERE id = ? AND deleted_at IS NULL", [id]);
  if (!rows[0]) return bad("이미 삭제되었거나 없는 글입니다.", 404);

  if (!isAdmin(req)) {
    const { password } = await readJson<{ password: string }>(req);
    if (typeof password !== "string" || !verifyPassword(password.trim(), rows[0].password_hash)) return bad("비밀번호가 맞지 않습니다.", 403);
  }

  await exec("UPDATE guestbook SET deleted_at = UTC_TIMESTAMP() WHERE id = ?", [id]);
  return ok();
}
