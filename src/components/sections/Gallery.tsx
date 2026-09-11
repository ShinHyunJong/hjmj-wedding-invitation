"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import SectionTitle from "@/components/ui/SectionTitle";
import Reveal from "@/components/ui/Reveal";
import type { GalleryPhoto } from "@/config/gallery";

/**
 * 갤러리: 위에 대표 사진 하나(스와이프), 아래 4열 썸네일. 썸네일을 누르면 그 사진이 위로 올라온다.
 * 대표 사진을 누르면 전체화면(핀치 줌 · 스와이프).
 */
export default function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const onSelect = useCallback(() => {
    if (embla) setIndex(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  const goTo = (i: number) => embla?.scrollTo(i);

  return (
    <section className="pt-20 pb-24">
      <Reveal>
        <SectionTitle en="Gallery" ko="웨딩 갤러리" />
      </Reveal>

      <Reveal delay={80}>
        <div className="relative mt-9 px-4">
          <div ref={emblaRef} className="overflow-hidden rounded-[6px] bg-bg-tint">
            <div className="flex touch-pan-y">
              {photos.map((p, i) => (
                <div key={p.id} className="min-w-0 flex-[0_0_100%]">
                  <button type="button" onClick={() => setLightbox(true)} className="block w-full focus-visible:outline-2 focus-visible:outline-primary" aria-label="사진 크게 보기">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.src}
                      width={p.width}
                      height={p.height}
                      alt=""
                      loading={i < 2 ? "eager" : "lazy"}
                      className={`aspect-[4/5] w-full ${p.orientation === "landscape" ? "object-contain" : "object-cover"}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <span className="pointer-events-none absolute right-7 bottom-3 rounded-full bg-text/45 px-2.5 py-1 font-serif-en text-[12px] tracking-[0.1em] text-white tabular-nums" aria-live="polite">
            {index + 1} / {photos.length}
          </span>
          <NavArrow side="left" onClick={() => embla?.scrollPrev()} />
          <NavArrow side="right" onClick={() => embla?.scrollNext()} />
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-3 grid grid-cols-4 gap-1.5 px-4" role="listbox" aria-label="사진 목록">
          {photos.map((p, i) => {
            const active = i === index;
            return (
              <button
                key={p.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => goTo(i)}
                className="relative aspect-square overflow-hidden rounded-[4px] focus-visible:outline-2 focus-visible:outline-primary"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                {active && <span className="pointer-events-none absolute inset-0 rounded-[4px] ring-2 ring-primary ring-inset" aria-hidden />}
              </button>
            );
          })}
        </div>
      </Reveal>

      <Lightbox
        open={lightbox}
        index={index}
        close={() => setLightbox(false)}
        on={{ view: ({ index: i }) => goTo(i) }}
        slides={photos.map((p) => ({ src: p.src, width: p.width, height: p.height }))}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: "rgba(35, 31, 32, 0.96)" } }}
      />
    </section>
  );
}

function NavArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "이전 사진" : "다음 사진"}
      className={`absolute top-1/2 ${side === "left" ? "left-6" : "right-6"} flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-text shadow-sm backdrop-blur hover:bg-white`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}
