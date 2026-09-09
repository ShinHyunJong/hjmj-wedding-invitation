"use client";

import { useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { Button, LinkButton } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Reveal from "@/components/ui/Reveal";
import type { Wedding, Person } from "@/config/wedding";

function Flower() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className="mr-1.5 inline-block align-[-2px] text-primary-soft" aria-hidden>
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <ellipse key={r} cx="7" cy="3.6" rx="1.7" ry="2.6" fill="currentColor" transform={`rotate(${r} 7 7)`} />
      ))}
      <circle cx="7" cy="7" r="1.6" fill="var(--color-primary)" />
    </svg>
  );
}

function Family({ side }: { side: Wedding["groom"] | Wedding["bride"] }) {
  const parents = side.parents.map((p) => p.name).join(" · ");
  return (
    <p className="text-[15px] leading-[2.1] text-text-sub">
      <Flower />
      {parents}
      <span className="mx-1 text-text-muted">의</span>
      <span className="mr-2 text-text-muted">{side.relation}</span>
      <span className="font-medium text-text">{side.name}</span>
    </p>
  );
}

function ContactRow({ label, person }: { label: string; person: Person }) {
  if (!person.phone) return null;
  return (
    <li className="flex items-center justify-between py-3">
      <span className="text-[14px] text-text-sub">
        {label} <span className="ml-1 font-medium text-text">{person.name}</span>
      </span>
      <span className="flex gap-2">
        <a href={`tel:${person.phone}`} aria-label={`${person.name}에게 전화`} className="rounded-full border border-line p-2.5 text-text hover:text-primary">
          <PhoneIcon />
        </a>
        <a href={`sms:${person.phone}`} aria-label={`${person.name}에게 문자`} className="rounded-full border border-line p-2.5 text-text hover:text-primary">
          <SmsIcon />
        </a>
      </span>
    </li>
  );
}

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.8 2.1z" />
  </svg>
);
const SmsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function Invitation({ wedding }: { wedding: Wedding }) {
  const [open, setOpen] = useState(false);
  const { invitation, groom, bride } = wedding;
  const hasContact =
    [groom, bride].some((s) => s.phone) || [...groom.parents, ...bride.parents].some((p) => p.phone);

  return (
    <section className="px-8 pt-24 pb-24">
      <Reveal>
        <SectionTitle en="Invitation" ko="소중한 분들을 초대합니다" />
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-10 text-center">
          <p className="font-serif-ko text-[17px] font-medium text-text">{invitation.title}</p>
          <p className="mt-5 text-[15px] leading-[2] text-text-sub">
            {invitation.body.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </Reveal>

      <div className="mx-auto my-10 h-px w-10 bg-line" aria-hidden />

      <Reveal delay={120}>
        <div className="text-center">
          <Family side={groom} />
          <Family side={bride} />
        </div>
      </Reveal>

      {hasContact && (
        <div className="mt-8 text-center">
          <Button onClick={() => setOpen(true)} className="min-w-[180px]">
            <PhoneIcon />
            연락하기
          </Button>
          <Modal open={open} onClose={() => setOpen(false)} title="연락하기">
            <ul className="divide-y divide-line">
              <ContactRow label="신랑" person={groom} />
              {groom.parents.map((p) => (
                <ContactRow key={p.name} label={`신랑 ${p.role === "father" ? "아버지" : "어머니"}`} person={p} />
              ))}
              <ContactRow label="신부" person={bride} />
              {bride.parents.map((p) => (
                <ContactRow key={p.name} label={`신부 ${p.role === "father" ? "아버지" : "어머니"}`} person={p} />
              ))}
            </ul>
            <div className="mt-4 text-center">
              <LinkButton href="#" onClick={(e) => { e.preventDefault(); setOpen(false); }} className="px-8">
                닫기
              </LinkButton>
            </div>
          </Modal>
        </div>
      )}
    </section>
  );
}
