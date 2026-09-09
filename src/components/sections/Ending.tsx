import Reveal from "@/components/ui/Reveal";
import type { Wedding } from "@/config/wedding";
import type { GalleryPhoto } from "@/config/gallery";

/**
 * 엔딩: 전폭 사진 위에 시 한 편.
 * 사진 상단은 흰색으로 스며들어 앞 섹션과 이어지고, 하단은 살짝 어두워져 글이 읽힌다.
 * 글은 세리프 한글, 넓은 자간(0.14em), 줄간격 2.2 — 참고 사이트의 타자기 느낌을 종이 청첩장 톤으로 옮긴 것.
 */
export default function Ending({ wedding, photo, position = "center" }: { wedding: Wedding; photo: GalleryPhoto; position?: string }) {
  const { lines, author } = wedding.ending;
  return (
    <section className="relative mt-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt=""
        loading="lazy"
        className="block aspect-[2/3] w-full object-cover"
        style={{ objectPosition: position }}
      />
      {/* 위: 흰색 페이드, 아래: 글 가독성용 어두운 페이드 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-bg) 0%, rgba(255,255,255,0) 20%, rgba(35,31,32,0) 52%, rgba(35,31,32,0.72) 100%)",
        }}
        aria-hidden
      />
      <Reveal className="absolute inset-x-0 bottom-0 px-8 pb-10" delay={120}>
        <blockquote className="font-serif-ko text-[14.5px] leading-[2.2] tracking-[0.14em] text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
          <footer className="mt-5 text-[12.5px] tracking-[0.18em] text-white/80">{author}</footer>
        </blockquote>
      </Reveal>
    </section>
  );
}
