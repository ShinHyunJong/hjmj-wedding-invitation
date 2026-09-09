import { notFound } from "next/navigation";
import InvitationPage from "@/components/InvitationPage";
import { URL_VARIANTS, weddingFor, type UrlVariant } from "@/config/wedding";

/** /g, /t — 정적 export 로 각각 g/index.html, t/index.html 이 생성된다. 그 외 경로는 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return URL_VARIANTS.map((variant) => ({ variant }));
}

export default async function VariantPage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  if (!(URL_VARIANTS as readonly string[]).includes(variant)) notFound();
  return <InvitationPage wedding={weddingFor(variant as UrlVariant)} />;
}
