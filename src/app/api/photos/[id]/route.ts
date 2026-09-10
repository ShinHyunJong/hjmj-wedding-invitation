import type { NextRequest } from "next/server";
import type { RowDataPacket } from "mysql2";
import { exec, query } from "@/lib/server/db";
import { ok, bad } from "@/lib/server/http";
import { headObject } from "@/lib/server/s3";

export const runtime = "nodejs";

/** 업로드 완료 확인: S3 에 객체가 실제로 있으면 uploaded 로 표시. */
export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return bad("잘못된 요청입니다.");

  const rows = await query<(RowDataPacket & { s3_key: string; status: string })[]>("SELECT s3_key, status FROM photos WHERE id = ?", [id]);
  const row = rows[0];
  if (!row) return bad("없는 사진입니다.", 404);
  if (row.status === "uploaded") return ok();

  const head = await headObject(row.s3_key);
  if (!head || head.size === 0) return bad("업로드가 완료되지 않았습니다.", 409);

  await exec("UPDATE photos SET status = 'uploaded', size = ?, content_type = COALESCE(?, content_type) WHERE id = ?", [head.size, head.contentType ?? null, id]);
  return ok();
}
