import Reveal from "@/components/ui/Reveal";
import type { Wedding } from "@/config/wedding";

export default function SaveTheDate({ wedding }: { wedding: Wedding }) {
  const { date, venue } = wedding;
  const weekdayShort = date.weekdayEn.slice(0, 3);
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
          <div className="grid grid-cols-2 border-b border-line py-3">
            <dt className="eyebrow text-[10px] text-text-muted">Date</dt>
            <dt className="eyebrow text-[10px] text-text-muted">Time</dt>
            <dd className="mt-2 font-serif-en text-[16px] text-text">
              {date.year}. {String(date.month).padStart(2, "0")}. {date.day} {weekdayShort}
            </dd>
            <dd className="mt-2 font-serif-en text-[16px] text-text">{date.timeEn}</dd>
          </div>
          <div className="border-b border-line py-3 text-text-sub">
            <dd>{venue.address}</dd>
          </div>
        </dl>
      </Reveal>
    </section>
  );
}
