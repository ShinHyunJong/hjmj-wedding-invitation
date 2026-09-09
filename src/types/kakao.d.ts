/* 카카오 JS SDK(공유) 최소 타입. 쓰는 부분만 선언한다. */

interface KakaoShareNamespace {
  sendDefault(settings: {
    objectType: "feed";
    content: { title: string; description: string; imageUrl: string; link: { mobileWebUrl: string; webUrl: string } };
    buttons?: Array<{ title: string; link: { mobileWebUrl: string; webUrl: string } }>;
  }): void;
}

interface KakaoSdk {
  init(key: string): void;
  isInitialized(): boolean;
  Share: KakaoShareNamespace;
}

interface Window {
  Kakao?: KakaoSdk;
}
