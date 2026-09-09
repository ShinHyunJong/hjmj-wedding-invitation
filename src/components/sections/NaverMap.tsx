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
      const marker = new maps.Marker({ position: center, map, title });
      // 마커 위 장소명 라벨 (기본 InfoWindow 프레임은 없애고 우리 스타일의 알약 형태로)
      const label = new maps.InfoWindow({
        content: `<div style="padding:6px 12px;border:1px solid #e7d4d6;border-radius:999px;background:#fff;color:#231f20;font:500 13px/1.4 'SUIT Variable','Apple SD Gothic Neo',sans-serif;white-space:nowrap;box-shadow:0 2px 8px rgba(35,31,32,.12)">${title}</div>`,
        borderWidth: 0,
        backgroundColor: "transparent",
        disableAnchor: true,
        pixelOffset: new maps.Point(0, -6),
      });
      label.open(map, marker);
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

  // 지도 div 자체에 높이를 준다 (SDK 가 컨테이너 position 을 바꾸므로 absolute inset-0 으로는 높이가 0이 된다).
  return (
    <div className="relative w-full bg-bg-tint">
      <div ref={ref} className="aspect-[4/3] w-full" aria-label={`${title} 지도`} role="img" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-[13px] text-text-muted" aria-hidden>
          지도를 불러오는 중…
        </div>
      )}
    </div>
  );
}
