import type { Metadata, Viewport } from "next";
import { Pinyon_Script, Cormorant_Garamond, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { wedding } from "@/config/wedding";

const script = Pinyon_Script({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const serifEn = Cormorant_Garamond({
  variable: "--font-serif-en",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const serifKo = Noto_Serif_KR({
  variable: "--font-serif-ko",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

/**
 * OG 이미지 절대경로의 기준 URL.
 * 우선순위: NEXT_PUBLIC_SITE_URL(직접 지정) → Vercel 프로덕션 도메인 → Vercel 배포 URL → localhost.
 * Vercel 은 VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL 을 빌드에 자동 주입하므로 따로 설정하지 않아도 배포 도메인이 잡힌다.
 */
function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:5400");
}

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: wedding.share.title,
  description: wedding.share.description,
  openGraph: {
    title: wedding.share.title,
    description: wedding.share.description,
    images: [{ url: wedding.share.image, width: 1200, height: 630, alt: `${wedding.groom.name} · ${wedding.bride.name} 웨딩 사진` }],
    type: "website",
    locale: "ko_KR",
    siteName: wedding.share.title,
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.share.title,
    description: wedding.share.description,
    images: [wedding.share.image],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${script.variable} ${serifEn.variable} ${serifKo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
