"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Reveal from "@/components/ui/Reveal";
import { Input, Textarea, Label, Honeypot, SubmitButton } from "@/components/ui/Form";
import { api, formatDate } from "@/lib/api";

interface Entry {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

/** 방명록: 최근 글 카드 가로 스크롤 + 작성하기 / 전체보기 + 비밀번호 삭제 */
export default function Guestbook() {
  const [items, setItems] = useState<Entry[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [write, setWrite] = useState(false);
  const [all, setAll] = useState(false);
  const [target, setTarget] = useState<Entry | null>(null); // 삭제 대상

  const load = useCallback(async (cursor?: number | null) => {
    const data = await api<{ items: Entry[]; nextCursor: number | null }>(`/api/guestbook?limit=10${cursor ? `&cursor=${cursor}` : ""}`);
    setItems((prev) => (cursor ? [...prev, ...data.items] : data.items));
    setNextCursor(data.nextCursor);
    setLoaded(true);
  }, []);

  useEffect(() => {
    // 렌더 직후 비동기로 불러온다 (effect 안에서 동기 setState 를 피하기 위해 한 틱 미룸)
    const t = setTimeout(() => load().catch(() => setLoaded(true)), 0);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <section className="pt-20 pb-24">
      <Reveal>
        <SectionTitle en="Guestbook" ko="방명록" />
      </Reveal>

      <Reveal delay={80}>
        {items.length > 0 ? (
          <div className="mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto px-8 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((e) => (
              <Card key={e.id} entry={e} onDelete={() => setTarget(e)} />
            ))}
          </div>
        ) : (
          <p className="mt-9 text-center text-[14px] text-text-muted">{loaded ? "첫 번째 축하 글을 남겨 주세요." : "불러오는 중…"}</p>
        )}
      </Reveal>

      <div className="mt-6 flex justify-center gap-3 px-8">
        <Button onClick={() => setWrite(true)} className="min-w-[130px]">
          <PenIcon />
          작성하기
        </Button>
        {items.length > 0 && (
          <Button onClick={() => setAll(true)} className="min-w-[130px]">
            전체보기
          </Button>
        )}
      </div>

      <WriteModal open={write} onClose={() => setWrite(false)} onWritten={() => load()} />

      <Modal open={all} onClose={() => setAll(false)} title="방명록">
        <ul className="max-h-[60dvh] space-y-3 overflow-y-auto pr-1">
          {items.map((e) => (
            <li key={e.id} className="rounded-[12px] bg-bg-tint px-4 py-3">
              <p className="whitespace-pre-wrap text-[14px] leading-[1.8] text-text">{e.message}</p>
              <div className="mt-2 flex items-center justify-between text-[12px] text-text-muted">
                <span>
                  {e.name} · {formatDate(e.createdAt)}
                </span>
                <button type="button" onClick={() => setTarget(e)} className="underline-offset-2 hover:underline">
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
        {nextCursor && (
          <div className="mt-4 text-center">
            <Button onClick={() => load(nextCursor)} className="min-w-[140px]">
              더 보기
            </Button>
          </div>
        )}
      </Modal>

      <DeleteModal entry={target} onClose={() => setTarget(null)} onDeleted={() => load()} />
    </section>
  );
}

function Card({ entry, onDelete }: { entry: Entry; onDelete: () => void }) {
  return (
    <article className="relative w-[240px] shrink-0 snap-start rounded-[14px] bg-bg-tint px-5 pt-9 pb-5">
      <span className="absolute left-1/2 top-3 -translate-x-1/2 text-primary-soft" aria-hidden>
        <FlowerIcon />
      </span>
      <button type="button" onClick={onDelete} aria-label="이 글 삭제" className="absolute right-3 top-2.5 p-1 text-text-muted hover:text-text">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
          <path d="M2 2l8 8M10 2l-8 8" />
        </svg>
      </button>
      <p className="line-clamp-6 min-h-[120px] whitespace-pre-wrap text-[13.5px] leading-[1.8] text-text">{entry.message}</p>
      <p className="mt-4 text-center text-[12px] text-text-sub">- {entry.name} -</p>
    </article>
  );
}

function WriteModal({ open, onClose, onWritten }: { open: boolean; onClose: () => void; onWritten: () => void }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/guestbook", { method: "POST", json: { name, message, password, website } });
      setName("");
      setMessage("");
      setPassword("");
      onWritten();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="방명록 작성">
      <form onSubmit={submit} className="relative space-y-4">
        <Honeypot value={website} onChange={setWebsite} />
        <div>
          <Label htmlFor="gb-name">이름</Label>
          <Input id="gb-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} required />
        </div>
        <div>
          <Label htmlFor="gb-message">축하 메시지</Label>
          <Textarea id="gb-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} required />
          <p className="mt-1 text-right text-[12px] text-text-muted">{message.length}/500</p>
        </div>
        <div>
          <Label htmlFor="gb-password">비밀번호 (삭제할 때 필요, 4자 이상)</Label>
          <Input id="gb-password" type="password" inputMode="numeric" value={password} onChange={(e) => setPassword(e.target.value)} minLength={4} maxLength={20} required autoComplete="off" />
        </div>
        {error && <p className="text-[13px] text-primary">{error}</p>}
        <SubmitButton disabled={busy}>{busy ? "남기는 중…" : "남기기"}</SubmitButton>
      </form>
    </Modal>
  );
}

function DeleteModal({ entry, onClose, onDeleted }: { entry: Entry | null; onClose: () => void; onDeleted: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!entry) return;
    setBusy(true);
    setError("");
    try {
      await api(`/api/guestbook/${entry.id}`, { method: "DELETE", json: { password } });
      setPassword("");
      onDeleted();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={!!entry} onClose={onClose} title="방명록 삭제">
      <form onSubmit={submit} className="space-y-4">
        <p className="text-[14px] leading-[1.8] text-text-sub">작성할 때 입력한 비밀번호를 넣으면 글이 삭제됩니다.</p>
        <Input type="password" inputMode="numeric" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" required autoComplete="off" />
        {error && <p className="text-[13px] text-primary">{error}</p>}
        <SubmitButton disabled={busy}>{busy ? "삭제 중…" : "삭제하기"}</SubmitButton>
      </form>
    </Modal>
  );
}

const PenIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);
const FlowerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden>
    {[0, 60, 120, 180, 240, 300].map((r) => (
      <ellipse key={r} cx="7" cy="3.6" rx="1.7" ry="2.6" fill="currentColor" transform={`rotate(${r} 7 7)`} />
    ))}
    <circle cx="7" cy="7" r="1.6" fill="var(--color-primary)" />
  </svg>
);
