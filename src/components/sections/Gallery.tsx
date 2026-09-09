"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import SectionTitle from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import type { GalleryPhoto } from "@/config/gallery";

const INITIAL = 12;

/** 2열 그리드(원본 비율 유지) + 더보기 + 전체화면 라이트박스. */
export default function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = useState(-1);
  const visible = expanded ? photos : photos.slice(0, INITIAL);

  // 2열: 높이 합이 균형 잡히도록 짧은 열에 순서대로 배치 (순서는 좌→우 시각 순서와 거의 일치)
  const cols: GalleryPhoto[][] = [[], []];
  const heights = [0, 0];
  visible.forEach((p) => {
    const i = heights[0] <= heights[1] ? 0 : 1;
    cols[i].push(p);
    heights[i] += p.height / p.width;
  });

  return (
    <section className="pt-20 pb-24">
      <Reveal>
        <SectionTitle en="Gallery" ko="웨딩 갤러리" />
      </Reveal>

      <div className="mt-9 grid grid-cols-2 gap-2 px-4">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-2">
            {col.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setIndex(photos.indexOf(p))}
                className="block overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="사진 크게 보기"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumb}
                  width={p.width}
                  height={p.height}
                  alt=""
                  loading="lazy"
                  className="block w-full transition-transform duration-500 hover:scale-[1.02]"
                />
              </button>
            ))}
          </div>
        ))}
      </div>

      {!expanded && photos.length > INITIAL && (
        <div className="mt-8 text-center">
          <Button onClick={() => setExpanded(true)} className="min-w-[180px]">
            더보기
            <span className="text-[12px] text-text-muted">+{photos.length - INITIAL}</span>
          </Button>
        </div>
      )}

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos.map((p) => ({ src: p.src, width: p.width, height: p.height }))}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: "rgba(35, 31, 32, 0.96)" } }}
      />
    </section>
  );
}
