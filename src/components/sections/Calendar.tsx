import Reveal from "@/components/ui/Reveal";
import Countdown from "./Countdown";
import { calendarGrid } from "@/lib/date";
import { weddingDate, type Wedding } from "@/config/wedding";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function Calendar({ wedding }: { wedding: Wedding }) {
  const { date, groom, bride } = wedding;
  const rows = calendarGrid(date.year, date.month);
  const timeLabel = date.label.replace(/^.*?일요일\s*/, "일요일 ");

  return (
    <section className="px-8 pt-20 pb-24">
      <Reveal>
        <div className="text-center">
          <p className="font-serif-en text-[26px] tracking-[0.06em] text-text">
            {date.year}.{String(date.month).padStart(2, "0")}.{String(date.day).padStart(2, "0")}
          </p>
          <p className="mt-2 text-[14px] text-text-sub">{timeLabel}</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <table className="mx-auto mt-9 w-full max-w-[300px] border-y border-line py-3 text-center tabular-nums" role="grid" aria-label={`${date.year}년 ${date.month}월`}>
          <thead>
            <tr>
              {WEEKDAYS.map((w, i) => (
                <th key={w} scope="col" className={`pt-4 pb-2 text-[14px] font-normal ${i === 0 ? "text-primary-soft" : "text-text"}`}>
                  {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  const isWedding = cell.day === date.day;
                  return (
                    <td key={ci} className={`h-10 text-[15px] ${ri === rows.length - 1 ? "pb-4" : ""}`}>
                      {cell.day && (
                        <span
                          className={
                            isWedding
                              ? "mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary font-medium text-white"
                              : cell.weekday === 0
                                ? "text-primary-soft"
                                : "text-text"
                          }
                          aria-current={isWedding ? "date" : undefined}
                        >
                          {cell.day}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        <Countdown target={weddingDate()} groomName={groom.name.slice(1)} brideName={bride.name.slice(1)} />
      </Reveal>
    </section>
  );
}
