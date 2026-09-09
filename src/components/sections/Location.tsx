"use client";

import { useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Reveal from "@/components/ui/Reveal";
import NaverMap from "./NaverMap";
import type { Coords } from "@/lib/naver";
import type { Wedding } from "@/config/wedding";

/**
 * 오시는 길. 네이버 지도를 띄우고(키 없거나 인증 실패면 종이 청첩장 약도로 대체), 약도는 버튼 → 모달로 본다.
 * 내비게이션 링크는 좌표가 있으면 바로 길찾기, 없으면 장소명 검색.
 */
export default function Location({ wedding }: { wedding: Wedding }) {
  const { venue } = wedding;
  const [coords, setCoords] = useState<Coords | null>(venue.coords);
  const [copied, setCopied] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const name = encodeURIComponent(venue.building);
  const nav = coords
    ? {
        naver: `nmap://route/public?dlat=${coords.lat}&dlng=${coords.lng}&dname=${name}&appname=wedding`,
        naverWeb: `https://map.naver.com/p/search/${name}`,
        tmap: `tmap://?rGoName=${name}&rGoY=${coords.lat}&rGoX=${coords.lng}`,
        kakao: `https://map.kakao.com/link/to/${name},${coords.lat},${coords.lng}`,
      }
    : {
        naver: `https://map.naver.com/p/search/${name}`,
        naverWeb: `https://map.naver.com/p/search/${name}`,
        tmap: `tmap://search?name=${name}`,
        kakao: `https://map.kakao.com/link/search/${name}`,
      };

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(venue.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("주소를 복사하세요", venue.address);
    }
  }

  const sketch = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/images/map.png" width={756} height={456} alt={`${venue.name} 약도`} loading="lazy" className="mx-auto w-full max-w-[340px]" />
  );

  return (
    <section className="pt-20 pb-24">
      <Reveal>
        <SectionTitle en="Location" ko="오시는 길" />
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-9 px-8 text-center">
          <p className="font-serif-ko text-[18px] font-medium text-text">{venue.name}</p>
          <p className="mt-2 text-[14px] text-text-sub">{venue.address}</p>
          {venue.phone && (
            <a href={`tel:${venue.phone}`} className="mt-1 inline-block text-[14px] text-text-sub underline-offset-4 hover:underline">
              Tel. {venue.phone}
            </a>
          )}
        </div>
      </Reveal>

      <div className="mt-8 border-y border-line">
        <NaverMap
          coords={venue.coords}
          address={venue.roadAddress}
          title={venue.name}
          onCoords={setCoords}
          fallback={<figure className="bg-bg-tint px-6 py-6">{sketch}</figure>}
        />
      </div>

      <div className="px-8">
        <div className="mt-6 text-center">
          <Button onClick={() => setMapOpen(true)} className="w-full">
            <MapIcon />
            약도 이미지 보기
          </Button>
          <Modal open={mapOpen} onClose={() => setMapOpen(false)} title="약도">
            {sketch}
            <p className="mt-4 text-center text-[13px] leading-[1.8] text-text-sub">{venue.address}</p>
          </Modal>
        </div>

        <Reveal delay={80}>
          <div className="mt-10">
            <h3 className="text-[15px] font-semibold text-text">내비게이션</h3>
            <p className="mt-1 text-[13px] text-text-sub">원하시는 앱을 선택하시면 길안내가 시작됩니다.</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <NavLink href={nav.naver} fallbackHref={nav.naverWeb} label="네이버지도" icon={<NaverIcon />} />
              <NavLink href={nav.tmap} label="티맵" icon={<TmapIcon />} />
              <NavLink href={nav.kakao} label="카카오내비" icon={<KakaoNaviIcon />} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <dl className="mt-8 divide-y divide-line border-t border-line">
            <Row term="지하철">{venue.subway}</Row>
            <Row term="주차">{venue.parking}</Row>
            {venue.bus.length > 0 && (
              <Row term="버스">
                {venue.bus.map((b) => (
                  <span key={b} className="block">
                    {b}
                  </span>
                ))}
              </Row>
            )}
          </dl>
        </Reveal>

        <div className="mt-8 text-center">
          <Button onClick={copyAddress} className="min-w-[180px]">
            {copied ? "주소가 복사되었습니다" : "주소 복사하기"}
          </Button>
        </div>
      </div>
    </section>
  );
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="py-4">
      <dt className="text-[15px] font-semibold text-text">{term}</dt>
      <dd className="mt-1.5 text-[14px] leading-[1.8] text-text-sub">{children}</dd>
    </div>
  );
}

/**
 * 앱 스킴(nmap://, tmap://) 링크는 앱이 없으면 아무 일도 안 일어나므로,
 * 잠시 후에도 페이지가 그대로면 웹 링크(fallbackHref)로 보낸다.
 */
function NavLink({ href, fallbackHref, label, icon }: { href: string; fallbackHref?: string; label: string; icon: React.ReactNode }) {
  const isScheme = !href.startsWith("http");
  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!isScheme || !fallbackHref) return;
    e.preventDefault();
    const start = Date.now();
    window.location.href = href;
    setTimeout(() => {
      if (Date.now() - start < 2200 && !document.hidden) window.open(fallbackHref, "_blank", "noopener");
    }, 1500);
  }
  return (
    <a
      href={href}
      onClick={onClick}
      target={isScheme ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="flex h-[46px] items-center justify-center gap-1.5 rounded-[10px] border border-line bg-bg text-[13px] text-text hover:bg-bg-tint"
    >
      {icon}
      {label}
    </a>
  );
}

/* 내비 앱 아이콘 (브랜드 색 단순화) */
const NaverIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
    <path d="M9 1.5a5 5 0 0 0-5 5c0 3.6 5 8.5 5 8.5s5-4.9 5-8.5a5 5 0 0 0-5-5z" fill="#03C75A" />
    <path d="M6.9 4.2h1.5l1.9 2.8V4.2h1.4v5H10.2L8.3 6.4v2.8H6.9z" fill="#fff" />
    <path d="M4 16.2c1.6-.9 3.4-.9 5-.3 1.6.6 3.4.6 5-.3" stroke="#3B6CF6" strokeWidth="1.2" strokeLinecap="round" fill="none" />
  </svg>
);
const TmapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
    <defs>
      <linearGradient id="tmapG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5B4DFF" />
        <stop offset="1" stopColor="#1E9BFF" />
      </linearGradient>
    </defs>
    <path d="M2.5 3.5h13v3.2H11v8.3H7V6.7H2.5z" fill="url(#tmapG)" />
  </svg>
);
const KakaoNaviIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
    <rect x="1" y="1" width="16" height="16" rx="4" fill="#FAE100" />
    <path d="M9 3.6l4.6 9.4-4.6-2.1-4.6 2.1z" fill="#1EB2A6" />
  </svg>
);

const MapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
    <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z" />
    <path d="M8 2v16M16 6v16" />
  </svg>
);
