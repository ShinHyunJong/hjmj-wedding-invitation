import InvitationPage from "@/components/InvitationPage";
import { weddingFor } from "@/config/wedding";

/** 루트: 종이 청첩장과 동일한 버전 (= /t) */
export default function Page() {
  return <InvitationPage wedding={weddingFor("t")} />;
}
