import type { NextRequest } from "next/server";
import { exec } from "@/lib/server/db";
import { ok, bad, readJson, clientIp, clean, tooMany, isBot, withErrors } from "@/lib/server/http";

export const runtime = "nodejs";

interface Body {
  side: "groom" | "bride";
  name: string;
  attending: boolean;
  headcount: number;
  message?: string;
  website?: string; // 허니팟
}

/** 참석 의사 등록 */
export const POST = withErrors(async (req: NextRequest) => {
  const body = await readJson<Body>(req);
  if (isBot(body)) return ok();

  const side = body.side === "groom" || body.side === "bride" ? body.side : null;
  const name = clean(body.name, 40);
  const attending = body.attending === true;
  const headcount = attending ? Math.min(10, Math.max(1, Math.floor(Number(body.headcount) || 1))) : 0;
  const message = clean(body.message, 300) || null;

  if (!side) return bad("신랑측 / 신부측을 선택해 주세요.");
  if (name.length < 2) return bad("성함을 입력해 주세요.");

  const ip = clientIp(req);
  if (await tooMany("rsvp", ip, 5, 10)) return bad("잠시 후 다시 시도해 주세요.", 429);

  await exec("INSERT INTO rsvp (side, name, attending, headcount, message, ip) VALUES (?, ?, ?, ?, ?, ?)", [
    side,
    name,
    attending ? 1 : 0,
    headcount,
    message,
    ip,
  ]);
  return ok({ ok: true });
});
