import Reveal from "@/components/ui/Reveal";
import type { Wedding } from "@/config/wedding";
import type { GalleryPhoto } from "@/config/gallery";

/** 참고 사이트의 버건디 대문자 타이포 블록 + 전폭 사진. */
export default function JoinUs({ wedding, photo }: { wedding: Wedding; photo: GalleryPhoto }) {
  const { date, tagline } = wedding;
  const rows: readonly (readonly string[])[] = [
    tagline.joinUs,
    [String(date.day), date.monthEn, String(date.year)],
    [date.weekdayEn, date.timeEn],
  ];
  return (
    <section className="pt-8 pb-20">
      <Reveal>
        <div className="space-y-2 px-6 font-sans text-[13px] font-semibold tracking-[0.04em] text-primary">
          {rows.map((r, i) => (
            <div key={i} className="flex justify-between">
              {r.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal delay={100}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          width={photo.width}
          height={photo.height}
          alt=""
          loading="lazy"
          className="mx-auto mt-6 aspect-[4/5] w-[calc(100%-32px)] object-cover"
          style={{ objectPosition: photo.focal }}
        />
      </Reveal>
    </section>
  );
}
