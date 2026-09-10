import Hero from "@/components/hero";
import Invitation from "@/components/sections/Invitation";
import Calendar from "@/components/sections/Calendar";
import JoinUs from "@/components/sections/JoinUs";
import Location from "@/components/sections/Location";
import Gallery from "@/components/sections/Gallery";
import Guestbook from "@/components/sections/Guestbook";
import Account from "@/components/sections/Account";
import Rsvp from "@/components/sections/Rsvp";
import Capture from "@/components/sections/Capture";
import SaveTheDate from "@/components/sections/SaveTheDate";
import Closing from "@/components/sections/Closing";
import Ending from "@/components/sections/Ending";
import Footer from "@/components/sections/Footer";
import type { Wedding } from "@/config/wedding";
import { gallery, photo, FEATURED } from "@/config/gallery";

/**
 * 단일 스크롤 페이지. 섹션 순서는 CLAUDE.md 4절.
 * `/`, `/g`, `/t` 가 모두 이 컴포넌트를 쓰고, wedding 객체만 다르다 (config/wedding.ts weddingFor).
 * 미구현(정보 필요): Profile, Our story, Notice. Interview 는 제외 확정.
 */
export default function InvitationPage({ wedding }: { wedding: Wedding }) {
  const { features } = wedding;
  return (
    <main className="card">
      <Hero variant={wedding.heroVariant} wedding={wedding} photo={photo(FEATURED.hero)} />
      <Invitation wedding={wedding} />
      <Calendar wedding={wedding} />
      <JoinUs wedding={wedding} photo={photo(FEATURED.middle)} />
      <Location wedding={wedding} />
      <Gallery photos={gallery} />
      {features.guestbook && <Guestbook />}
      <Account wedding={wedding} />
      {features.rsvp && <Rsvp wedding={wedding} />}
      {features.photos && <Capture wedding={wedding} decor={FEATURED.closing.map(photo)} />}
      <Closing photos={FEATURED.closing.map(photo)} />
      <SaveTheDate wedding={wedding} />
      <Ending wedding={wedding} photo={photo(FEATURED.ending)} position={FEATURED.endingPosition} />
      <Footer wedding={wedding} />
    </main>
  );
}
