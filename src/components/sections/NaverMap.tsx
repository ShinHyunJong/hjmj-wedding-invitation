"use client";

import { useEffect, useRef, useState } from "react";
import { loadNaverMaps, geocode, type Coords } from "@/lib/naver";

interface Props {
  /** 미리 알고 있는 좌표. 없으면 도로명 주소로 지오코딩한다. */
  coords: Coords | null;
  /** 지오코딩용 도로명 주소 (건물명 제외) */
  address: string;
  /** 마커 툴팁 · 접근성 레이블 */
  title: string;
  /** 좌표가 확정되면 알려준다 (내비게이션 링크용) */
  onCoords?: (c: Coords) => void;
  /** SDK 로드 실패 시 보여줄 내용 */
  fallback: React.ReactNode;
}

/** 네이버 지도 임베드. 키가 없거나 인증 · 지오코딩에 실패하면 fallback 을 렌더링한다. */
export default function NaverMap({ coords, address, title, onCoords, fallback }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const maps = await loadNaverMaps();
      if (!maps || cancelled) return setStatus("failed");
      const c = coords ?? (await geocode(maps, address));
      if (!c || cancelled || !ref.current) return setStatus("failed");
      // 인증(/v3/auth)은 Map 생성 뒤 비동기로 검사된다. 실패하면 SDK 가 이 전역 함수를 부르므로 그때 약도로 전환.
      window.navermap_authFailure = () => {
        if (!cancelled) setStatus("failed");
      };
      const center = new maps.LatLng(c.lat, c.lng);
      const map = new maps.Map(ref.current, {
        center,
        zoom: 16,
        scrollWheel: false,
        zoomControl: false,
        mapDataControl: false,
        logoControlOptions: { position: maps.Position.BOTTOM_LEFT },
      });
      new maps.Marker({ position: center, map, title });
      setStatus("ready");
      onCoords?.(c);
    })();
    return () => {
      cancelled = true;
    };
    // onCoords 는 부모의 state setter 라 안정적이라고 가정
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.lat, coords?.lng, address, title]);

  if (status === "failed") return <>{fallback}</>;

  return (
    <div className="relative aspect-[4/3] w-full bg-bg-tint">
      <div ref={ref} className="absolute inset-0" aria-label={`${title} 지도`} role="img" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-[13px] text-text-muted" aria-hidden>
          지도를 불러오는 중…
        </div>
      )}
    </div>
  );
}
