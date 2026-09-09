"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * 스크롤 진입 시 부드럽게 나타나는 래퍼.
 * - 정적 HTML(JS 전)에서는 항상 보이는 상태라 썸네일·공유 미리보기가 비지 않는다.
 * - 화면 안에 이미 있는 요소는 숨기지 않는다 (첫 화면 깜빡임 방지).
 * - prefers-reduced-motion 이면 애니메이션 없음.
 * 움직임: 살짝 아래에서 올라오며(24px) 흐림이 걷히는(blur 6px→0) 1.1s, 감속 곡선. `delay` 로 같은 섹션 안 요소를 순차 등장.
 */
export default function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) return;
    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: React.CSSProperties | undefined =
    state === "hidden"
      ? { opacity: 0, transform: "translateY(24px)", filter: "blur(6px)" }
      : state === "shown"
        ? {
            opacity: 1,
            transform: "translateY(0)",
            filter: "blur(0)",
            transition: "opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s ease-out",
            transitionDelay: `${delay}ms`,
          }
        : undefined;

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
