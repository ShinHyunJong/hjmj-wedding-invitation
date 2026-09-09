/**
 * 카카오 JS SDK(카카오톡 공유) 로더. 키는 next.config.ts 가 .env 의 KAKAO_JS_KEY 를 NEXT_PUBLIC_KAKAO_JS_KEY 로 노출한다.
 * 키가 없으면 null 을 돌려주고, 호출한 쪽에서 대체 UI를 보여준다.
 * (지도는 네이버 지도를 쓴다 — src/lib/naver.ts)
 */
export const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "";

const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";

let pending: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  if (pending) return pending;
  pending = new Promise<void>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`script load failed: ${src}`));
    document.head.appendChild(el);
  });
  return pending;
}

/** 카카오 JS SDK(공유). 초기화까지 마친 Kakao 객체를 돌려준다. */
export async function loadKakaoSdk(): Promise<KakaoSdk | null> {
  if (!KAKAO_JS_KEY || typeof window === "undefined") return null;
  try {
    await loadScript(KAKAO_SDK_URL);
    const sdk = window.Kakao;
    if (!sdk) return null;
    if (!sdk.isInitialized()) sdk.init(KAKAO_JS_KEY);
    return sdk;
  } catch {
    return null;
  }
}
