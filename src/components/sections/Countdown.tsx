"use client";

import { useEffect, useState } from "react";
import { countdownTo, daysUntil, pad2 } from "@/lib/date";

interface Props {
  target: Date;
  groomName: string;
  brideName: string;
}

/** D-day 카운트다운. 정적 HTML에는 0으로 나오고, 마운트 후 1초마다 갱신. */
export default function Countdown({ target, groomName, brideName }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const c = now ? countdownTo(target, now) : { days: 0, hours: 0, minutes: 0, seconds: 0, passed: false };
  const dday = now ? daysUntil(target, now) : 0;

  const cells: [string, string, string][] = [
    ["DAYS", String(c.days), "days"],
    ["HOUR", pad2(c.hours), "hours"],
    ["MIN", pad2(c.minutes), "minutes"],
    ["SEC", pad2(c.seconds), "seconds"],
  ];

  // data-cd-* 속성은 정적 미리보기(scripts/build-preview.mjs)의 인라인 스크립트가 값을 채우는 데 쓴다.
  return (
    <div className="text-center" data-cd-target={target.toISOString()}>
      <div className="flex items-end justify-center gap-3 font-serif-en text-text">
        {cells.map(([label, value, key], i) => (
          <div key={label} className="flex items-end gap-3">
            <div className="flex flex-col items-center">
              <span className="eyebrow text-[10px] text-text-muted">{label}</span>
              <span className="mt-1 min-w-[2.2ch] text-[30px] leading-none tabular-nums" data-cd={key}>
                {value}
              </span>
            </div>
            {i < cells.length - 1 && <span className="pb-1 text-[20px] text-text-muted">:</span>}
          </div>
        ))}
      </div>
      <p className="mt-6 text-[14px] text-text-sub">
        {c.passed ? (
          <>
            {brideName}, {groomName}의 결혼식이 있었습니다. 축복해 주셔서 감사합니다.
          </>
        ) : dday === 0 ? (
          <>
            오늘은 {brideName}, {groomName}의 결혼식 날입니다.
          </>
        ) : (
          <>
            {brideName}, {groomName}의 결혼식이{" "}
            <span className="font-medium text-primary tabular-nums" data-cd="dday">
              {dday}
            </span>
            일 남았습니다.
          </>
        )}
      </p>
    </div>
  );
}
