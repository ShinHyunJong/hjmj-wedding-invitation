"use client";

import { useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import Modal from "@/components/ui/Modal";
import Reveal from "@/components/ui/Reveal";
import RsvpForm from "./RsvpForm";
import type { Wedding } from "@/config/wedding";

/**
 * R.S.V.P. — 페이지 중간에서 "꼭 전달해 주세요" 를 눈에 띄게 보여주는 안내 카드.
 * (팝업 없음. 2026-09-10 사용자 요청) 버튼 → 전체 화면(흐린 배경) 폼.
 */
export default function Rsvp({ wedding }: { wedding: Wedding }) {
  const [open, setOpen] = useState(false);
  const { date, venue } = wedding;
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay()];
  const hour12 = date.hour % 12 === 0 ? 12 : date.hour % 12;
  const when = `${date.year}.${String(date.month).padStart(2, "0")}.${String(date.day).padStart(2, "0")} (${weekday}) ${date.hour < 12 ? "오전" : "오후"} ${hour12}시${date.minute ? ` ${date.minute}분` : ""}`;

  return (
    <section className="px-6 pt-20 pb-24">
      <Reveal>
        <SectionTitle en="R.S.V.P." ko="참석 의사 전달" />
      </Reveal>

      <Reveal delay={80}>
        <div className="relative mt-9 overflow-hidden rounded-[18px] border border-primary-soft/70 bg-bg-tint px-5 pt-8 pb-6 text-center shadow-[0_10px_30px_rgba(150,20,33,0.08)]">
          {/* 상단 버건디 라인 + 배지 */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-primary" aria-hidden />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-white">
            <BellIcon />
            꼭 전달해 주세요
          </span>

          <h3 className="font-serif-ko mt-5 text-[18px] font-medium leading-[1.6] tracking-[-0.01em] text-text">
            참석 의사를 전달해 주셔야
            <br />
            <span className="text-primary">자리와 식사</span>를 준비할 수 있습니다
          </h3>
          <p className="mt-4 text-[14px] leading-[1.9] text-text-sub">
            소중한 분들을 한 분 한 분 귀하게 모시기 위해
            <br />
            참석 여부와 인원을 미리 알려주시면 감사하겠습니다.
          </p>

          <dl className="mx-auto mt-6 max-w-[290px] space-y-2.5 border-y border-line py-4 text-left text-[14px] text-text">
            <Row icon={<CalendarIcon />}>{when}</Row>
            <Row icon={<HallIcon />}>{venue.name}</Row>
            <Row icon={<PinIcon />}>{venue.address}</Row>
          </dl>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-primary text-[15px] font-medium text-white shadow-[0_6px_16px_rgba(150,20,33,0.25)] transition-transform active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <PersonIcon />
            참석의사 전달하기
          </button>
          <p className="mt-3 text-[12px] text-text-muted">성함 · 참석 인원 · 신랑/신부측만 입력하시면 됩니다 (약 20초)</p>
        </div>
      </Reveal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
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
        <RsvpForm wedding={wedding} onDone={() => setOpen(false)} />
      </Modal>
    </section>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <dt className="flex w-5 shrink-0 justify-center text-primary" aria-hidden>
        {icon}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

export const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const BellIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);
const HallIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
    <path d="M3 21V10l9-6 9 6v11" />
    <path d="M3 21h18M10 21v-6h4v6" />
  </svg>
);
const PinIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
    <path d="M12 21s-6-5.3-6-11a6 6 0 0 1 12 0c0 5.7-6 11-6 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
);
