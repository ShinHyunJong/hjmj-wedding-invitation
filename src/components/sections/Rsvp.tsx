"use client";

import { useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Reveal from "@/components/ui/Reveal";
import RsvpForm from "./RsvpForm";
import type { Wedding } from "@/config/wedding";

/** R.S.V.P. 섹션 — 버튼 → 전체 화면(흐린 배경) 폼 */
export default function Rsvp({ wedding }: { wedding: Wedding }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="px-8 pt-20 pb-24">
      <Reveal>
        <SectionTitle en="R.S.V.P." ko="참석 의사 전달" />
        <p className="mt-6 text-center text-[14px] leading-[1.9] text-text-sub">
          신랑, 신부에게 참석의사를
          <br />
          미리 전달할 수 있어요.
        </p>
      </Reveal>
      <Reveal delay={80}>
        <div className="mt-8 text-center">
          <Button onClick={() => setOpen(true)} className="min-w-[200px]">
            <PersonIcon />
            참석의사 전달하기
          </Button>
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
