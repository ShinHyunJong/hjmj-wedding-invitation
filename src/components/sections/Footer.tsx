"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import WaxSeal from "@/components/hero/WaxSeal";
import { KAKAO_JS_KEY, loadKakaoSdk } from "@/lib/kakao";
import type { Wedding } from "@/config/wedding";

/** 공유 · 저작권. 카카오톡 공유는 키가 있을 때만 버튼을 보인다. */
export default function Footer({ wedding }: { wedding: Wedding }) {
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("링크를 복사하세요", window.location.href);
    }
  }

  async function shareKakao() {
    const sdk = await loadKakaoSdk();
    if (!sdk) return setShareError(true);
    const url = window.location.origin + window.location.pathname;
    const imageUrl = new URL(wedding.share.image, window.location.origin).toString();
    sdk.Share.sendDefault({
      objectType: "feed",
      content: {
        title: wedding.share.title,
        description: wedding.share.description,
        imageUrl,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [{ title: "청첩장 보기", link: { mobileWebUrl: url, webUrl: url } }],
    });
  }

  return (
    <footer className="bg-bg-tint px-8 pt-12 pb-14 text-center">
      <div className="mb-10 flex justify-center">
        <WaxSeal initials={wedding.monogram} className="h-[84px] w-[84px] drop-shadow-[0_5px_8px_rgba(150,20,33,0.25)]" />
      </div>
      <div className="flex flex-col items-center gap-3">
        {KAKAO_JS_KEY && (
          <Button onClick={shareKakao} className="min-w-[220px] border-[#F7E600] bg-[#F7E600] text-[#1a1a1a] hover:border-[#F7E600] hover:text-[#1a1a1a]">
            <KakaoIcon />
            카카오톡으로 초대장 보내기
          </Button>
        )}
        <Button onClick={copyLink} className="min-w-[220px]">
          {copied ? "링크가 복사되었습니다" : "청첩장 링크 복사하기"}
        </Button>
        {shareError && <p className="text-[12px] text-text-muted">카카오톡 공유를 불러오지 못했습니다. 링크 복사를 이용해 주세요.</p>}
      </div>
      <p className="eyebrow mt-10 text-[9px] text-text-muted">
        {wedding.groom.nameEn} &amp; {wedding.bride.nameEn}
      </p>
      <p className="mt-1 text-[11px] text-text-muted">
        {wedding.date.year}. {wedding.date.month}. {wedding.date.day}
      </p>
    </footer>
  );
}

const KakaoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a1a1a" aria-hidden>
    <path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.7 1.8 5.1 4.5 6.5l-1 3.8c-.1.3.3.6.6.4l4.4-3c.5.1 1 .1 1.5.1 5.5 0 10-3.5 10-7.8S17.5 3 12 3z" />
  </svg>
);
