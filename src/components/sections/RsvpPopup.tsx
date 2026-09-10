"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import RsvpForm from "./RsvpForm";
import type { Wedding } from "@/config/wedding";

/**
 * 진입 시 바로 뜨는 참석 의사 안내 시트 (참고 사이트 mZdJd64x2r).
 * 페이지 첫 렌더링부터 열린 상태로 그려지며(지연 없음), × 로 닫거나 폼을 제출하면 사라진다. 매 방문마다 다시 뜬다.
 */
export default function RsvpPopup({ wedding }: { wedding: Wedding }) {
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState(false);
  const { date, venue } = wedding;

  const weekday = ["일", "월", "화", "수", "목", "금", "토"][new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay()];
  const hour12 = date.hour % 12 === 0 ? 12 : date.hour % 12;
  const when = `${date.year}.${String(date.month).padStart(2, "0")}.${String(date.day).padStart(2, "0")} (${weekday}) ${date.hour < 12 ? "오전" : "오후"} ${hour12}시${date.minute ? ` ${date.minute}분` : ""}`;

  return (
    <>
      <Modal open={open && !form} onClose={() => setOpen(false)}>
        <div className="pb-1 text-center">
          <h3 className="font-serif-ko text-[21px] font-medium text-text">참석 의사 전달</h3>
          <div className="mt-5 flex justify-center text-text-muted" aria-hidden>
            <PeopleIcon />
          </div>
          <p className="mt-5 text-[14px] leading-[1.9] text-text-sub">
            특별한 날 축하의 마음으로 참석해주시는 모든 분들을
            <br />한 분 한 분 더욱 귀하게 모실 수 있도록,
            <br />
            아래 버튼으로 신랑 &amp; 신부에게
            <br />꼭 참석여부 전달을 부탁드립니다.
          </p>

          <dl className="mt-7 space-y-3 border-y border-line py-5 text-left text-[14px] text-text">
            <Row icon={<CalendarIcon />}>{when}</Row>
            <Row icon={<HallIcon />}>{venue.name}</Row>
            <Row icon={<PinIcon />}>{venue.address}</Row>
          </dl>

          <div className="mt-6">
            <Button onClick={() => setForm(true)} className="w-full">
              참석의사 전달하기
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={form}
        onClose={() => {
          setForm(false);
          setOpen(false);
        }}
        variant="full"
        title="참석 의사 전달"
        description={
          <>
            원활한 예식 진행을 위해 참석 정보를
            <br />
            미리 알려주시면 감사하겠습니다.
          </>
        }
      >
        <RsvpForm
          wedding={wedding}
          onDone={() => {
            setForm(false);
            setOpen(false);
          }}
        />
      </Modal>
    </>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 px-2">
      <dt className="flex w-5 shrink-0 justify-center text-text-sub" aria-hidden>
        {icon}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

const PeopleIcon = () => (
  <svg width="44" height="30" viewBox="0 0 44 30" fill="currentColor" aria-hidden>
    <circle cx="13" cy="8" r="6" opacity=".55" />
    <path d="M1 28c0-7 5.4-12 12-12s12 5 12 12z" opacity=".55" />
    <circle cx="30" cy="8" r="6" />
    <path d="M18 28c0-7 5.4-12 12-12s12 5 12 12z" />
    <path d="M32 21l3 3 6-6" fill="none" stroke="var(--color-bg-tint)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 21l3 3 6-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);
const HallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
    <path d="M3 21V10l9-6 9 6v11" />
    <path d="M3 21h18M10 21v-6h4v6" />
  </svg>
);
const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
    <path d="M12 21s-6-5.3-6-11a6 6 0 0 1 12 0c0 5.7-6 11-6 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
);
