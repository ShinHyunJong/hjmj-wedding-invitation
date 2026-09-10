"use client";

import { useState, type FormEvent } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Reveal from "@/components/ui/Reveal";
import { Input, Label, Segmented, Honeypot, SubmitButton } from "@/components/ui/Form";
import { api } from "@/lib/api";
import type { Wedding } from "@/config/wedding";

/** R.S.V.P. 참석 의사 전달 — 버튼 → 하단 시트 폼 → /api/rsvp */
export default function Rsvp({ wedding }: { wedding: Wedding }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [side, setSide] = useState<"groom" | "bride">("groom");
  const [name, setName] = useState("");
  const [headcount, setHeadcount] = useState(1);
  const [website, setWebsite] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/rsvp", { method: "POST", json: { side, name, attending: true, headcount, website } });
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

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

      <Modal open={open} onClose={() => setOpen(false)} title="참석 의사 전달">
        {done ? (
          <div className="py-6 text-center">
            <p className="font-serif-ko text-[18px] text-text">전달되었습니다</p>
            <p className="mt-3 text-[14px] leading-[1.8] text-text-sub">
              소중한 마음 감사합니다.
              <br />
              {wedding.date.label}에 뵙겠습니다.
            </p>
            <Button onClick={() => setOpen(false)} className="mt-6 min-w-[140px]">
              닫기
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="relative space-y-5">
            <Honeypot value={website} onChange={setWebsite} />
            <p className="text-[13px] leading-[1.8] text-text-sub">
              {wedding.date.label}
              <br />
              {wedding.venue.name}
            </p>
            <div>
              <Label>어느 분의 하객이신가요?</Label>
              <Segmented
                name="구분"
                value={side}
                onChange={setSide}
                options={[
                  { value: "groom", label: `신랑 ${wedding.groom.name}` },
                  { value: "bride", label: `신부 ${wedding.bride.name}` },
                ]}
              />
            </div>
            <div>
              <Label htmlFor="rsvp-name">성함</Label>
              <Input id="rsvp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="대표자 성함" maxLength={40} required autoComplete="name" />
            </div>
            <div>
              <Label>참석 인원 (본인 포함)</Label>
              <div className="flex h-[46px] items-center justify-between rounded-[12px] border border-line px-2">
                <Stepper onClick={() => setHeadcount((n) => Math.max(1, n - 1))} label="인원 줄이기">
                  −
                </Stepper>
                <span className="text-[15px] tabular-nums text-text">{headcount}명</span>
                <Stepper onClick={() => setHeadcount((n) => Math.min(10, n + 1))} label="인원 늘리기">
                  +
                </Stepper>
              </div>
            </div>
            {error && <p className="text-[13px] text-primary">{error}</p>}
            <SubmitButton disabled={busy}>{busy ? "전달 중…" : "전달하기"}</SubmitButton>
          </form>
        )}
      </Modal>
    </section>
  );
}

function Stepper({ children, onClick, label }: { children: string; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full text-[18px] text-text-sub hover:bg-bg-tint">
      {children}
    </button>
  );
}

const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
