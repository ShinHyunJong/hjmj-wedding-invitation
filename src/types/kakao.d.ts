/* 카카오 JS SDK(공유) 최소 타입. 쓰는 부분만 선언한다. */

interface KakaoShareNamespace {
  sendDefault(settings: {
    objectType: "feed";
    content: { title: string; description: string; imageUrl: string; link: { mobileWebUrl: string; webUrl: string } };
    buttons?: Array<{ title: string; link: { mobileWebUrl: string; webUrl: string } }>;
  }): void;
}

interface KakaoNaviNamespace {
  /** 카카오내비 앱으로 길안내 시작. 앱이 없으면 설치 페이지로 이동. */
  start(options: { name: string; x: number; y: number; coordType: "wgs84" | "katec"; vehicleType?: number; rpOption?: number }): void;
}

interface KakaoSdk {
  init(key: string): void;
  isInitialized(): boolean;
  Share: KakaoShareNamespace;
  Navi: KakaoNaviNamespace;
}

interface Window {
  Kakao?: KakaoSdk;
}
