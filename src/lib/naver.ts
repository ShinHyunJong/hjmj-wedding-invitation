/**
 * 네이버 지도 (NCP Maps JavaScript API v3) 로더.
 * 키: .env 의 NAVER_MAP_CLIENT_ID (NCP 콘솔 → AI·NAVER API → Maps → Application → Client ID).
 * next.config.ts 가 NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 로 노출한다. 키가 없으면 null 을 돌려주고 호출부가 약도로 대체한다.
 * NCP 콘솔의 Application 에 "Web 서비스 URL" 로 http://localhost:5400 과 배포 도메인이 등록돼 있어야 한다.
 */
export const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || "";

let loading: Promise<NaverMapsNamespace | null> | null = null;

export function loadNaverMaps(): Promise<NaverMapsNamespace | null> {
  if (!NAVER_MAP_CLIENT_ID || typeof window === "undefined") return Promise.resolve(null);
  if (window.naver?.maps) return Promise.resolve(window.naver.maps);
  if (loading) return loading;

  loading = new Promise((resolve) => {
    // 인증 실패(도메인 미등록 등) 시 SDK 가 이 전역 함수를 호출한다.
    window.navermap_authFailure = () => resolve(null);
    const el = document.createElement("script");
    el.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}&submodules=geocoder`;
    el.async = true;
    el.onload = () => {
      const maps = window.naver?.maps;
      if (!maps) return resolve(null);
      // 서브모듈까지 로드된 뒤 콜백
      if (maps.Service) resolve(maps);
      else maps.onJSContentLoaded = () => resolve(window.naver?.maps ?? null);
    };
    el.onerror = () => resolve(null);
    document.head.appendChild(el);
  });
  return loading;
}

export interface Coords {
  lat: number;
  lng: number;
}

/** 도로명 주소 → 좌표 (Geocoding). 결과가 없으면 null. */
export function geocode(maps: NaverMapsNamespace, address: string): Promise<Coords | null> {
  return new Promise((resolve) => {
    try {
      maps.Service.geocode({ query: address }, (status, response) => {
        const hit = status === maps.Service.Status.OK ? response?.v2?.addresses?.[0] : undefined;
        resolve(hit ? { lat: Number(hit.y), lng: Number(hit.x) } : null);
      });
    } catch {
      resolve(null);
    }
  });
}
