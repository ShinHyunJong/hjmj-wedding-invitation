import Reveal from "@/components/ui/Reveal";
import type { Wedding } from "@/config/wedding";

const WEEKDAY_KO = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

/** Save the Date. 스크립트 제목만 영문이고 표 내용은 전부 한글. */
export default function SaveTheDate({ wedding }: { wedding: Wedding }) {
  const { date, venue } = wedding;
  const weekday = WEEKDAY_KO[new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay()];
  const hour12 = date.hour % 12 === 0 ? 12 : date.hour % 12;
  const meridiem = date.hour < 12 ? "오전" : "오후";
  const time = date.minute === 0 ? `${meridiem} ${hour12}시` : `${meridiem} ${hour12}시 ${date.minute}분`;

  return (
    <section className="px-8 pt-24 pb-16">
      <Reveal>
        <p className="font-script text-primary text-[54px] leading-[0.95]">
          Save
          <br />
          <span className="ml-14">the Date</span>
        </p>
      </Reveal>

      <Reveal delay={100}>
        <dl className="mt-12 border-t border-line text-[14px]">
          <Row label="날짜">
            {date.year}년 {date.month}월 {date.day}일 {weekday}
          </Row>
          <Row label="시간">{time}</Row>
          <Row label="장소" sub>
            {venue.name}
            <br />
            {venue.address}
          </Row>
        </dl>
      </Reveal>
    </section>
  );
}

function Row({ label, sub, children }: { label: string; sub?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-3.5">
      <dt className="pt-0.5 text-[12px] tracking-[0.08em] text-text-muted">{label}</dt>
      <dd className={sub ? "leading-[1.8] text-text-sub" : "text-[15px] font-medium text-text"}>{children}</dd>
    </div>
  );
}
