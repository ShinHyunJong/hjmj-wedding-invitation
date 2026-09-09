import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 정적 export. 사진은 scripts/optimize-photos.ts 로 미리 최적화하므로 next/image 최적화는 끈다.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    // .env 의 KAKAO_JS_KEY 를 클라이언트에서 쓸 수 있게 노출 (카카오맵 · 카카오톡 공유). JavaScript 키는 원래 브라우저에 노출되는 키다.
    NEXT_PUBLIC_KAKAO_JS_KEY: process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? process.env.KAKAO_JS_KEY ?? "",
    // 네이버 지도 Client ID (.env 의 NAVER_MAP_CLIENT_ID. 아래 이름들도 허용)
    NEXT_PUBLIC_NAVER_MAP_CLIENT_ID:
      process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ??
      process.env.NAVER_MAP_CLIENT_ID ??
      process.env.NAVER_CLIENT_ID ??
      process.env.NAVER_MAP_KEY ??
      process.env.NCP_KEY_ID ??
      "",
  },
};

export default nextConfig;
