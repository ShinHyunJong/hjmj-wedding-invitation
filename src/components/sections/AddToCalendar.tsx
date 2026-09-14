"use client";

import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import type { Wedding } from "@/config/wedding";

/**
 * 캘린더에 저장: 구글 캘린더(링크) · 아이폰/기타(.ics 다운로드).
 * 예식 1시간 30분으로 등록. 시각은 KST → 구글 링크에는 UTC 로 변환해 넣는다.
 */
export default function AddToCalendar({ wedding }: { wedding: Wedding }) {
  const [open, setOpen] = useState(false);
  const { date, venue, groom, bride } = wedding;

  const pad = (n: number) => String(n).padStart(2, "0");
  const startKst = Date.UTC(date.year, date.month - 1, date.day, date.hour - 9, date.minute); // KST → UTC
  const fmt = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const title = `${groom.name} ♥ ${bride.name} 결혼식`;
  const google =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${fmt(startKst)}/${fmt(startKst + 90 * 60 * 1000)}` +
    `&details=${encodeURIComponent(`${date.label}\n${venue.name}`)}` +
    `&location=${encodeURIComponent(venue.address)}` +
    "&ctz=Asia/Seoul";

  return (
    <>
      <Button onClick={() => setOpen(true)} className="min-w-[180px]">
        <CalendarIcon />
        캘린더에 저장
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="캘린더에 저장">
        <p className="text-[14px] leading-[1.8] text-text-sub">
          {date.year}.{pad(date.month)}.{pad(date.day)} {date.label.slice(-6)} · {venue.name}
        </p>
        <div className="mt-5 grid gap-2">
          <LinkButton href={google} target="_blank" rel="noopener noreferrer" className="w-full">
            <GoogleIcon />
            구글 캘린더에 추가
          </LinkButton>
          <LinkButton href="/wedding.ics" download="wedding.ics" className="w-full">
            <AppleIcon />
            아이폰 · 기타 캘린더 (.ics)
          </LinkButton>
        </div>
      </Modal>
    </>
  );
}

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4M12 14v4M10 16h4" />
  </svg>
);
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z" />
    <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" />
    <path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9z" />
    <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z" />
  </svg>
);
const AppleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9s-2-.9-3.3-.9C6.1 6.9 4.5 7.9 3.6 9.5c-1.9 3.3-.5 8.1 1.4 10.8.9 1.3 2 2.8 3.4 2.7 1.4-.1 1.9-.9 3.5-.9s2.1.9 3.5.9c1.5 0 2.4-1.3 3.3-2.6 1-1.5 1.5-3 1.5-3.1-.1 0-2.8-1.1-2.8-4.7zM14 5.2c.7-.9 1.2-2.1 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.1.1 2.3-.6 3-1.6z" />
  </svg>
);
