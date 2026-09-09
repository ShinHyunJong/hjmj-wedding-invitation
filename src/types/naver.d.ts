/* 네이버 지도 SDK 최소 타입. 쓰는 부분만 선언한다. */

interface NaverLatLng {
  lat(): number;
  lng(): number;
}

interface NaverMapsNamespace {
  LatLng: new (lat: number, lng: number) => NaverLatLng;
  Map: new (
    container: HTMLElement,
    options: { center: NaverLatLng; zoom?: number; scrollWheel?: boolean; draggable?: boolean; pinchZoom?: boolean; zoomControl?: boolean; mapDataControl?: boolean; logoControlOptions?: { position: number } },
  ) => { setCenter(latlng: NaverLatLng): void };
  Marker: new (options: { position: NaverLatLng; map?: unknown; title?: string }) => { setMap(map: unknown): void };
  InfoWindow: new (options: {
    content: string;
    borderWidth?: number;
    backgroundColor?: string;
    disableAnchor?: boolean;
    pixelOffset?: unknown;
    anchorSize?: unknown;
  }) => { open(map: unknown, marker: unknown): void };
  Point: new (x: number, y: number) => unknown;
  Size: new (w: number, h: number) => unknown;
  Position: { BOTTOM_LEFT: number; BOTTOM_RIGHT: number };
  Service: {
    Status: { OK: string; ERROR: string };
    geocode(
      options: { query: string },
      cb: (status: string, response: { v2?: { addresses?: Array<{ x: string; y: string; roadAddress?: string }> } }) => void,
    ): void;
  };
  onJSContentLoaded?: () => void;
}

interface Window {
  naver?: { maps: NaverMapsNamespace };
  navermap_authFailure?: () => void;
}
