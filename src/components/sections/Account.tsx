"use client";

import { useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import Reveal from "@/components/ui/Reveal";
import type { Account as AccountInfo, Wedding } from "@/config/wedding";

/** 마음 전하실 곳. 신랑측/신부측 아코디언. 계좌가 하나도 없으면 섹션을 렌더링하지 않는다. */
export default function Account({ wedding }: { wedding: Wedding }) {
  const { groom, bride } = wedding.accounts;
  const [open, setOpen] = useState<"groom" | "bride" | null>(null);
  if (groom.length === 0 && bride.length === 0) return null;

  return (
    <section className="px-8 pt-20 pb-24">
      <Reveal>
        <SectionTitle en="Account" ko="마음 전하실 곳" />
        <p className="mt-6 text-center text-[14px] leading-[1.9] text-text-sub">
          참석이 어려우신 분들을 위해
          <br />
          계좌번호를 기재하였습니다.
          <br />
          너그러운 마음으로 양해 부탁드립니다.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-8 space-y-3">
          {groom.length > 0 && <Group id="groom" label="신랑측 계좌번호" items={groom} open={open === "groom"} onToggle={() => setOpen(open === "groom" ? null : "groom")} />}
          {bride.length > 0 && <Group id="bride" label="신부측 계좌번호" items={bride} open={open === "bride"} onToggle={() => setOpen(open === "bride" ? null : "bride")} />}
        </div>
      </Reveal>
    </section>
  );
}

function Group({ id, label, items, open, onToggle }: { id: string; label: string; items: readonly AccountInfo[]; open: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl bg-bg-tint">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`acc-${id}`}
        className="flex w-full items-center justify-center gap-2 py-4 text-[15px] font-medium text-text"
      >
        {label}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="M3 5l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <ul id={`acc-${id}`} className="space-y-2 px-3 pb-3">
          {items.map((a) => (
            <AccountRow key={a.number} account={a} />
          ))}
        </ul>
      )}
    </div>
  );
}

function AccountRow({ account }: { account: AccountInfo }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(`${account.bank} ${account.number}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("계좌번호를 복사하세요", `${account.bank} ${account.number}`);
    }
  }
  return (
    <li className="flex items-center justify-between rounded-lg bg-bg px-4 py-3">
      <button type="button" onClick={copy} className="text-left" aria-label={`${account.holder} ${account.bank} ${account.number} 복사`}>
        <span className="flex items-center gap-1.5 text-[14px] font-medium text-text">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
          {account.holder}
          {copied && <span className="ml-1 text-[12px] font-normal text-primary">복사됨</span>}
        </span>
        <span className="mt-0.5 block text-[14px] tabular-nums text-text-sub">
          {account.bank} {account.number}
        </span>
      </button>
      {account.kakaoPayUrl && (
        <a href={account.kakaoPayUrl} target="_blank" rel="noopener noreferrer" aria-label="카카오페이로 송금" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7E600]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1a1a" aria-hidden>
            <path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.7 1.8 5.1 4.5 6.5l-1 3.8c-.1.3.3.6.6.4l4.4-3c.5.1 1 .1 1.5.1 5.5 0 10-3.5 10-7.8S17.5 3 12 3z" />
          </svg>
        </a>
      )}
    </li>
  );
}
