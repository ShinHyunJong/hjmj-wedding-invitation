"use client";

import { useEffect, type ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /**
   * sheet(기본): 하단에서 올라오는 시트, 배경 어둡게.
   * full: 화면 전체를 덮는 흐린(blur) 크림 배경 위에 내용 — 긴 폼용 (참고 사이트 참석 의사 폼 스타일).
   */
  variant?: "sheet" | "full";
  /** 제목 아래 붙는 부가 설명 */
  description?: ReactNode;
}

/** 모달. ESC · 배경 탭으로 닫힘. 열려 있는 동안 body 스크롤 잠금. */
export default function Modal({ open, onClose, title, children, variant = "sheet", description }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const close = (
    <button
      type="button"
      onClick={onClose}
      aria-label="닫기"
      className="flex h-9 w-9 items-center justify-center rounded-full text-text-sub hover:text-text focus-visible:outline-2 focus-visible:outline-primary"
    >
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M3 3l10 10M13 3L3 13" />
      </svg>
    </button>
  );

  if (variant === "full") {
    return (
      <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-bg-tint/85 backdrop-blur-xl" role="presentation">
        <div role="dialog" aria-modal="true" aria-label={title} className="relative w-full max-w-[430px] px-6 pt-4 pb-12">
          <div className="sticky top-0 z-10 -mx-6 mb-2 flex items-center justify-between bg-bg-tint/85 px-6 py-3 backdrop-blur-xl">
            <span className="w-9" />
            {title && <h3 className="font-serif-ko text-[19px] font-medium text-text">{title}</h3>}
            {close}
          </div>
          {description && <div className="mb-8 text-center text-[14px] leading-[1.9] text-text-sub">{description}</div>}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="presentation" onClick={onClose}>
      <div className="absolute inset-0 bg-text/40" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-[430px] rounded-t-[22px] bg-bg-tint px-6 pt-4 pb-8 shadow-[0_-8px_30px_rgba(35,31,32,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          {title ? <h3 className="font-serif-ko text-[18px] font-medium text-text">{title}</h3> : <span />}
          <span className="-mr-2">{close}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
