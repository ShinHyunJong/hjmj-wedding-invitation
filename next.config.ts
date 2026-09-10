import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버 API(/api/rsvp 등)를 쓰므로 정적 export 는 하지 않는다 (Vercel 배포). 사진은 미리 최적화한 WebP 를 <img> 로 쓴다.
  images: { unoptimized: true },
  env: {
    // .env 의 KAKAO_JS_KEY 를 클라이언트에서 쓸 수 있게 노출 (카카오톡 공유 · 카카오내비). JavaScript 키는 원래 브라우저에 노출되는 키다.
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
