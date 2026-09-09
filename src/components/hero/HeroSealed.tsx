import type { HeroProps } from "./types";
import WaxSeal from "./WaxSeal";

/**
 * 종이 청첩장 표지 재현: 흰 봉투 + 스크립트 "WeddingDay" + 버건디 실링왁스 + 날짜/영문 소문구.
 * 390×844 뷰포트에서 스크롤 없이 완결.
 */
export default function HeroSealed({ wedding }: HeroProps) {
  const { date, tagline, monogram } = wedding;
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-between bg-bg px-8 pt-24 pb-14">
      <h1 className="font-script text-primary text-[64px] leading-none">WeddingDay</h1>

      {/* 봉투 플랩: 종이 청첩장 표지의 V자 접힘선 */}
      <div className="relative flex w-full flex-1 flex-col items-center justify-center">
        <svg
          className="absolute inset-x-0 top-1/2 w-full -translate-y-[62%]"
          viewBox="0 0 390 180"
          fill="none"
          aria-hidden
        >
          <path
            d="M-2 8 L195 172 L392 8"
            stroke="var(--color-line)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <WaxSeal
          initials={monogram}
          className="relative z-10 h-[124px] w-[124px] drop-shadow-[0_6px_10px_rgba(150,20,33,0.28)]"
        />
      </div>

      <div className="text-center">
        <p className="font-serif-en text-primary text-[26px] tracking-[0.06em]">{date.labelShort}</p>
        <p className="eyebrow mt-3 text-[10px] leading-[1.9]">
          {tagline.line1}
          <br />
          {tagline.line2}
        </p>
      </div>
    </section>
  );
}
