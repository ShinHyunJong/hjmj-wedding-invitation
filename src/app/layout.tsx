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

export const metadata: Metadata = {
  // 배포 도메인이 정해지면 .env 의 NEXT_PUBLIC_SITE_URL 로 지정 (OG 이미지 절대경로용)
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: wedding.share.title,
  description: wedding.share.description,
  openGraph: {
    title: wedding.share.title,
    description: wedding.share.description,
    images: [wedding.share.image],
    type: "website",
    locale: "ko_KR",
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
