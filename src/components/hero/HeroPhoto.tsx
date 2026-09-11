import type { HeroProps } from "./types";

/**
 * 참고 사이트(vzUGuBO4E1) hero 재현: 상단 세리프 날짜 + 전폭 사진 + 이름 · 일시 · 장소.
 * 폴드 안에 끝나지 않아도 된다.
 */
export default function HeroPhoto({ wedding, photo }: HeroProps) {
  const { date, venue, groom, bride } = wedding;
  return (
    <section className="bg-bg pt-12">
      <div className="text-center">
        <p className="font-serif-en text-[30px] leading-none tracking-[0.08em] text-text">
          {date.year} / {String(date.month).padStart(2, "0")} / {String(date.day).padStart(2, "0")}
        </p>
        <p className="eyebrow mt-3 text-[12px] text-text-sub">{date.weekdayEn}</p>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={`${groom.name}, ${bride.name} 웨딩 사진`}
        className="mt-8 aspect-[4/5] w-full object-cover"
        style={{ objectPosition: photo.focal ?? "50% 35%" }}
        fetchPriority="high"
      />

      <div className="px-8 pt-9 pb-4 text-center">
        <p className="font-serif-ko text-[20px] font-medium tracking-[0.02em] text-text">
          {groom.name}
          <span className="mx-3 text-primary">·</span>
          {bride.name}
        </p>
        <p className="mt-5 text-[14px] leading-[1.9] text-text-sub">
          {date.label}
          <br />
          {venue.name}
        </p>
      </div>
    </section>
  );
}
