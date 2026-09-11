import type { RowDataPacket } from "mysql2";
import { query } from "@/lib/server/db";
import { ok } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 배포 환경 점검용. 값은 보여주지 않고 "설정됐는지" 와 DB 연결 여부만 알려준다.
 *   GET /api/health
 */
export async function GET() {
  const has = (k: string) => Boolean(process.env[k]);
  const env = {
    DB_HOST: has("DB_HOST"),
    DB_USER: has("DB_USER"),
    DB_PASSWORD: has("DB_PASSWORD"),
    DB_NAME: has("DB_NAME"),
    S3_ACCESS_KEY: has("S3_ACCESS_KEY") || has("AWS_ACCESS_KEY_ID"),
    S3_SECRET_KEY: has("S3_SECRET_KEY") || has("AWS_SECRET_ACCESS_KEY"),
    KAKAO_JS_KEY: Boolean(process.env.NEXT_PUBLIC_KAKAO_JS_KEY),
    NAVER_CLIENT_ID: Boolean(process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID),
    ADMIN_TOKEN: has("ADMIN_TOKEN"),
  };

  let db: { ok: boolean; error?: string; ms?: number } = { ok: false };
  const t = Date.now();
  try {
    await query<RowDataPacket[]>("SELECT 1");
    db = { ok: true, ms: Date.now() - t };
  } catch (e) {
    db = { ok: false, error: describe(e), ms: Date.now() - t };
  }

  return ok({ ok: db.ok, env, db, region: process.env.VERCEL_REGION ?? null, node: process.version });
}

/** 비밀번호 등이 섞이지 않게 에러 코드/메시지만 */
function describe(e: unknown): string {
  const err = e as { code?: string; message?: string };
  return [err.code, err.message?.replace(/password[^,]*/gi, "password ***").slice(0, 200)].filter(Boolean).join(": ");
}
