import Reveal from "@/components/ui/Reveal";
import type { GalleryPhoto } from "@/config/gallery";

/** 중간 사진 한 장. (JOIN US 타이포 블록은 어색해서 제거 — 2026-09-14 사용자 요청) */
export default function JoinUs({ photo }: { photo: GalleryPhoto }) {
  return (
    <section className="pt-8 pb-20">
      <Reveal delay={100}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          width={photo.width}
          height={photo.height}
          alt=""
          loading="lazy"
          className="mx-auto aspect-[4/5] w-[calc(100%-32px)] object-cover"
          style={{ objectPosition: photo.focal }}
        />
      </Reveal>
    </section>
  );
}
