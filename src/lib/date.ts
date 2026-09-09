/** 날짜 유틸. 모든 계산은 KST 기준 예식 시각(weddingDate) 하나에서 파생한다. */

export interface CalendarCell {
  day: number | null;
  /** 0=일 … 6=토 */
  weekday: number;
}

/** 해당 월의 달력 격자(일요일 시작). 앞뒤 빈 칸은 day=null. */
export function calendarGrid(year: number, month: number): CalendarCell[][] {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lead = first.getUTCDay();
  const cells: CalendarCell[] = [];
  for (let i = 0; i < lead; i++) cells.push({ day: null, weekday: i });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, weekday: (lead + d - 1) % 7 });
  while (cells.length % 7 !== 0) cells.push({ day: null, weekday: cells.length % 7 });
  const rows: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** 예식이 지났으면 true */
  passed: boolean;
}

export function countdownTo(target: Date, now: Date = new Date()): Countdown {
  let diff = Math.floor((target.getTime() - now.getTime()) / 1000);
  const passed = diff <= 0;
  if (passed) diff = 0;
  return {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
    passed,
  };
}

/** 예식일까지 남은 '날짜' 수 (시각 무시, KST 자정 기준). 당일이면 0. */
export function daysUntil(target: Date, now: Date = new Date()): number {
  const kst = (d: Date) => Math.floor((d.getTime() + 9 * 3600 * 1000) / 86400000);
  return kst(target) - kst(now);
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
