import type { HeroProps } from "./types";

/** 2순위 변형: 폴라로이드 프레임 안에 대표 사진 + 하단 이름/날짜. */
export default function HeroPolaroid({ wedding, photo }: HeroProps) {
  const { date, tagline, groom, bride } = wedding;
  return (
    <section className="flex min-h-dvh flex-col items-center justify-between bg-bg px-8 pt-16 pb-12">
      <p className="eyebrow">Wedding Invitation</p>

      <figure className="w-full max-w-[300px] rotate-[-1.5deg] bg-white p-3 pb-12 shadow-[0_10px_30px_rgba(35,31,32,0.14)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          width={photo.width}
          height={photo.height}
          alt={`${groom.name} · ${bride.name}`}
          className="aspect-[4/5] w-full object-cover"
        />
      </figure>

      <div className="text-center">
        <p className="font-serif-ko text-[20px] font-medium text-text">
          {groom.name} <span className="text-primary">&amp;</span> {bride.name}
        </p>
        <p className="font-serif-en text-primary mt-2 text-[22px] tracking-[0.06em]">{date.labelShort}</p>
        <p className="eyebrow mt-3 text-[10px] leading-[1.9]">
          {tagline.line1}
          <br />
          {tagline.line2}
        </p>
      </div>
    </section>
  );
}
