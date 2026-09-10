"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Honeypot } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { Wedding } from "@/config/wedding";

/**
 * 참석 의사 폼 (참고 사이트 mZdJd64x2r 스타일).
 * 가능/불가 카드 → 성함(밑줄 입력) + 신랑측/신부측 라디오 → 인원(원형 ±) → 동의 → 버튼(입력이 끝나야 활성화).
 * 항목은 사용자 확정: 성함 · 인원 · 신랑/신부측 (+ 참석 가능/불가).
 */
export default function RsvpForm({ wedding, onDone }: { wedding: Wedding; onDone?: () => void }) {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [side, setSide] = useState<"groom" | "bride" | null>(null);
  const [name, setName] = useState("");
  const [extra, setExtra] = useState(0); // 본인 외 추가 인원
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const valid = attending !== null && side !== null && name.trim().length >= 2 && agree;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    try {
      await api("/api/rsvp", { method: "POST", json: { side, name, attending, headcount: attending ? 1 + extra : 0, website } });
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="py-10 text-center">
        <p className="font-serif-ko text-[20px] text-text">전달되었습니다</p>
        <p className="mt-4 text-[14px] leading-[1.9] text-text-sub">
          소중한 마음 감사합니다.
          <br />
          {wedding.date.label}
          <br />
          {wedding.venue.name}에서 뵙겠습니다.
        </p>
        {onDone && (
          <Button onClick={onDone} className="mt-8 min-w-[150px]">
            닫기
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative">
      <Honeypot value={website} onChange={setWebsite} />

      {/* 가능 / 불가 */}
      <div className="grid grid-cols-2 gap-3">
        <OptionCard selected={attending === true} onClick={() => setAttending(true)} icon={<ChairIcon />}>
          참석 가능
        </OptionCard>
        <OptionCard selected={attending === false} onClick={() => setAttending(false)} icon={<ChairOffIcon />}>
          참석 불가
        </OptionCard>
      </div>

      {/* 성함 + 측 */}
      <div className="mt-9">
        <div className="flex items-end justify-between gap-4">
          <label htmlFor="rsvp-name" className="text-[13px] font-medium text-text">
            성함
          </label>
          <div className="flex gap-4" role="radiogroup" aria-label="신랑측 / 신부측">
            <Radio checked={side === "groom"} onClick={() => setSide("groom")}>
              신랑측
            </Radio>
            <Radio checked={side === "bride"} onClick={() => setSide("bride")}>
              신부측
            </Radio>
          </div>
        </div>
        <input
          id="rsvp-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="성함을 입력해 주세요."
          maxLength={40}
          autoComplete="name"
          className="mt-3 w-full border-0 border-b border-line bg-transparent py-2.5 text-[15px] text-text placeholder:text-text-muted/70 focus:border-primary focus:outline-none"
        />
      </div>

      {/* 인원 */}
      {attending !== false && (
        <div className="mt-9 flex items-center justify-between">
          <span className="text-[13px] font-medium text-text">
            <span className="mr-1 text-primary">*</span>추가 인원 <span className="ml-1 font-normal text-text-muted">(본인 제외)</span>
          </span>
          <div className="flex items-center gap-6">
            <Circle onClick={() => setExtra((n) => Math.max(0, n - 1))} label="추가 인원 줄이기">
              −
            </Circle>
            <span className="min-w-[2ch] text-center text-[17px] tabular-nums text-text">{extra}</span>
            <Circle onClick={() => setExtra((n) => Math.min(9, n + 1))} label="추가 인원 늘리기">
              +
            </Circle>
          </div>
        </div>
      )}

      {/* 동의 */}
      <label className={`mt-10 flex cursor-pointer gap-3 rounded-[14px] border bg-bg/70 px-4 py-4 ${agree ? "border-primary-soft" : "border-line"}`}>
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="sr-only" />
        <span
          aria-hidden
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border ${agree ? "border-primary bg-primary text-white" : "border-line bg-bg"}`}
        >
          {agree && <CheckIcon size={12} />}
        </span>
        <span className="text-[13px] leading-[1.7] text-text-sub">
          <span className="font-medium text-text">동의합니다.</span>
          <br />
          참석 여부 전달을 위한 개인정보 수집 및 이용에 동의해 주세요.
          <br />
          항목: 성함, 참석 인원 · 보유 기간: 예식 종료 시까지
        </span>
      </label>

      {error && <p className="mt-4 text-center text-[13px] text-primary">{error}</p>}

      <button
        type="submit"
        disabled={!valid || busy}
        className={`mt-6 h-[52px] w-full rounded-[14px] text-[15px] font-medium transition-colors ${
          valid ? "bg-primary text-white" : "border border-line bg-bg text-text-muted"
        } disabled:cursor-not-allowed`}
      >
        {busy ? "전달 중…" : "신랑 & 신부에게 전달하기"}
      </button>
    </form>
  );
}

function OptionCard({ selected, onClick, icon, children }: { selected: boolean; onClick: () => void; icon: ReactNode; children: ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex h-[64px] items-center justify-between rounded-[14px] border px-4 text-[15px] transition-colors ${
        selected ? "border-primary bg-bg text-text" : "border-line bg-bg/60 text-text-sub"
      }`}
    >
      <span className="flex items-center gap-2">
        <span className={selected ? "text-primary" : "text-text-muted"}>{icon}</span>
        {children}
      </span>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-primary bg-primary text-white" : "border-line bg-bg"}`} aria-hidden>
        {selected && <CheckIcon size={11} />}
      </span>
    </button>
  );
}

function Radio({ checked, onClick, children }: { checked: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" role="radio" aria-checked={checked} onClick={onClick} className="flex items-center gap-1.5 text-[14px] text-text">
      <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border ${checked ? "border-primary bg-primary text-white" : "border-line bg-bg"}`} aria-hidden>
        {checked && <CheckIcon size={10} />}
      </span>
      {children}
    </button>
  );
}

function Circle({ children, onClick, label }: { children: string; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-bg text-[18px] leading-none text-text-sub hover:border-primary-soft hover:text-primary">
      {children}
    </button>
  );
}

const CheckIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 6.5l2.6 2.5L10 3.5" />
  </svg>
);
const ChairIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 3h9l-1 9H7z" />
    <path d="M5 12h14v3H5zM6 15v6M18 15v6M6 18h12" />
  </svg>
);
const ChairOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 3h9l-1 9H7z" />
    <path d="M5 12h14v3H5zM6 15v6M18 15v6M6 18h12" />
    <path d="M3 3l18 18" />
  </svg>
);
