/** 브라우저 → /api 호출 도우미. 실패 시 서버가 준 한글 메시지를 Error 로 던진다. */
export async function api<T = { ok: true }>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, ...rest } = init ?? {};
  const res = await fetch(path, {
    ...rest,
    headers: { ...(json !== undefined ? { "content-type": "application/json" } : {}), ...(rest.headers ?? {}) },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });
  const data = (await res.json().catch(() => ({}))) as T & { ok?: boolean; error?: string };
  if (!res.ok || data.ok === false) throw new Error(data.error ?? "요청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  return data;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const kst = new Date(d.getTime() + 9 * 3600 * 1000);
  return `${kst.getUTCFullYear()}.${String(kst.getUTCMonth() + 1).padStart(2, "0")}.${String(kst.getUTCDate()).padStart(2, "0")}`;
}
