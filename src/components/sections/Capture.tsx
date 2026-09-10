"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { api } from "@/lib/api";
import type { Wedding } from "@/config/wedding";
import type { GalleryPhoto } from "@/config/gallery";

interface Photo {
  id: number;
  url: string;
  uploader: string | null;
}

/**
 * 축하 사진 공유. 예식 당일부터 업로드가 열린다.
 * 흐름: /api/photos POST(서명 URL) → 브라우저가 S3 에 직접 PUT → /api/photos/:id PUT(완료 확인)
 */
export default function Capture({ wedding, decor }: { wedding: Wedding; decor: GalleryPhoto[] }) {
  const [open, setOpen] = useState<boolean | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const { date } = wedding;

  const load = useCallback(async () => {
    try {
      const data = await api<{ items: Photo[]; open: boolean }>("/api/photos?limit=12");
      setPhotos(data.items);
      setOpen(data.open);
    } catch {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files).slice(0, 20);
    setError("");
    setProgress({ done: 0, total: list.length });
    let failed = 0;
    for (const file of list) {
      try {
        const type = file.type || "image/jpeg";
        const { id, uploadUrl } = await api<{ id: number; uploadUrl: string }>("/api/photos", {
          method: "POST",
          json: { contentType: type, size: file.size },
        });
        const put = await fetch(uploadUrl, { method: "PUT", body: file, headers: { "content-type": type } });
        if (!put.ok) throw new Error("S3 업로드 실패");
        await api(`/api/photos/${id}`, { method: "PUT" });
      } catch (err) {
        failed++;
        setError((err as Error).message);
      } finally {
        setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
      }
    }
    setTimeout(() => setProgress(null), 1200);
    if (failed < list.length) load();
    if (input.current) input.current.value = "";
  }

  return (
    <section className="px-8 pt-20 pb-24">
      <Reveal>
        {/* 참고 사이트의 폴라로이드 3장 겹침 장식 */}
        <div className="relative mx-auto mb-10 h-[150px] w-[220px]" aria-hidden>
          {decor.slice(0, 3).map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.id}
              src={p.thumb}
              alt=""
              loading="lazy"
              className="absolute top-2 h-[130px] w-[100px] rounded-[4px] border-[5px] border-white object-cover shadow-[0_6px_16px_rgba(35,31,32,0.18)]"
              style={{ left: `${20 + i * 40}px`, transform: `rotate(${(i - 1) * 9}deg)`, zIndex: i }}
            />
          ))}
        </div>
        <SectionTitle en="Capture our moments" ko="축하 사진 공유" />
        <p className="mt-6 text-center text-[14px] leading-[1.9] text-text-sub">
          신랑신부의 행복한 순간을 담아주세요.
          <br />
          예식 당일, 아래 버튼을 통해 사진을 올려주세요.
          <br />
          많은 참여 부탁드려요!
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-8 text-center">
          <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
          <Button onClick={() => input.current?.click()} disabled={open !== true || progress !== null} className="min-w-[200px] disabled:opacity-60">
            <CameraIcon />
            {progress ? `업로드 중 ${progress.done}/${progress.total}` : "사진 업로드"}
          </Button>
          {open === false && (
            <p className="mt-3 text-[13px] leading-[1.8] text-text-muted">
              {date.year}-{String(date.month).padStart(2, "0")}-{String(date.day).padStart(2, "0")} 00:00부터
              <br />
              업로드 가능합니다.
            </p>
          )}
          {error && <p className="mt-3 text-[13px] text-primary">{error}</p>}
        </div>
      </Reveal>

      {photos.length > 0 && (
        <Reveal delay={100}>
          <div className="mt-10 grid grid-cols-3 gap-1.5">
            {photos.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.id} src={p.url} alt={p.uploader ? `${p.uploader}님이 올린 사진` : "하객이 올린 사진"} loading="lazy" className="aspect-square w-full object-cover" />
            ))}
          </div>
        </Reveal>
      )}
    </section>
  );
}

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);
