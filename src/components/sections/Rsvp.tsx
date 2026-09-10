"use client";

import { useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Reveal from "@/components/ui/Reveal";
import RsvpForm from "./RsvpForm";
import type { Wedding } from "@/config/wedding";

/**
 * R.S.V.P. — 종이 청첩장 카드 느낌의 안내 패널 (팝업 없음, 띠 · 배지 · 그림자 없음. 2026-09-10 사용자 요청).
 * 강조는 세리프 문장과 버건디 "꼭" 한 글자로만. 버튼 → 전체 화면(흐린 배경) 폼.
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
        {/* 종이 청첩장 카드처럼: 얇은 이중 테두리, 세리프 문장, 장식 없음 */}
        <div className="mt-9 border border-line bg-bg-tint p-[6px]">
          <div className="border border-line/80 px-6 pt-9 pb-8 text-center">
            <p className="eyebrow text-[10px]">Kindly reply</p>
            <h3 className="font-serif-ko mt-4 text-[19px] font-medium leading-[1.65] text-text">
              참석 의사를 <span className="text-primary">꼭</span> 전달해 주세요
            </h3>
            <p className="mt-4 text-[14px] leading-[1.95] text-text-sub">
              한 분 한 분 귀하게 모시기 위해
              <br />
              참석 여부에 맞춰 자리와 식사를 준비합니다.
              <br />
              성함과 인원만 알려주시면 됩니다.
            </p>

            <div className="mx-auto my-7 h-px w-8 bg-line" aria-hidden />

            <dl className="space-y-2 text-[14px]">
              <div className="flex items-baseline justify-center gap-3">
                <dt className="w-8 text-right text-[12px] tracking-[0.08em] text-text-muted">일시</dt>
                <dd className="text-text">{when}</dd>
              </div>
              <div className="flex items-baseline justify-center gap-3">
                <dt className="w-8 text-right text-[12px] tracking-[0.08em] text-text-muted">장소</dt>
                <dd className="text-text">{venue.name}</dd>
              </div>
            </dl>

            <Button onClick={() => setOpen(true)} className="mt-8 w-full">
              <PersonIcon />
              참석의사 전달하기
            </Button>
          </div>
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

export const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
