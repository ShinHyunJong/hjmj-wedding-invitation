/**
 * 갤러리 노출 순서.
 * - manifest는 scripts/optimize-photos.ts 가 생성한다 (직접 수정 금지).
 * - 순서를 바꾸려면 아래 ORDER 배열만 편집한다. ORDER에 없는 사진은 뒤에 id 순으로 붙는다.
 * - 특정 사진을 빼려면 EXCLUDE에 id를 넣는다.
 */
import manifest from "./gallery.generated.json";

export interface GalleryPhoto {
  id: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
}

/**
 * 앞에 보여줄 사진 id (처음 12장이 '더보기' 전 노출분).
 * 비슷한 컷이 연달아 나오지 않도록 장면을 섞어 배치했다. 사진관 '순서' 힌트는 앨범 스프레드용이라 쓰지 않는다.
 */
const ORDER: string[] = [
  "YS_01595", // 클래식카 위 부감 (첫장)
  "MS_00500", // 정원, 강아지와 함께
  "YS_00776", // 베일 + 호접란
  "YS_04153", // 계단, 꽃잎
  "MS_01359", // 스튜디오, 강아지와 셋
  "YS_03741", // 핑크 부케
  "YS_04810", // 팜파스 신부
  "YS_02664", // 부케 클로즈업
  "YS_05374", // 블랙 드레스, 강아지
  "MS_00665", // 클래식카 (가로)
  "YS_03217", // 다크 배경 신부
  "YS_05638", // 정원 샴페인
];

const EXCLUDE: string[] = [];

/**
 * 종이 청첩장 폴라로이드에 실린 메인 사진. PDF에서 추출 (public/images/main.jpg).
 * 갤러리 원본 폴더에는 없는 컷이라 별도로 둔다.
 */
export const mainPhoto = { src: "/images/main.jpg", width: 1200, height: 1800 } as const;

/** 섹션별 대표 사진 id. 바꾸려면 여기만 수정. */
export const FEATURED = {
  /** photo hero 전폭 사진 (검은 문 앞 꽃잎 컷, 종이 청첩장 메인과 같은 장면) */
  hero: "YS_04054",
  /** Join Us 블록 아래 사진 (팜파스 정원) */
  middle: "YS_04911",
  /** 마무리 3장: 클로즈업, 클래식카, 신부와 강아지. 스크립트 문구가 왼쪽 아래에 겹치므로 얼굴이 왼쪽에 있는 컷은 피한다. */
  closing: ["MS_01844", "YS_04465", "YS_05463"],
  /** 엔딩 시 배경. 글이 아래쪽에 올라가므로 하단이 어두운 사진. (다크 스튜디오 컷, 2:3 이라 크롭 없이 전체 표시) */
  ending: "YS_03366",
  /** 가로 사진을 3:4 로 자를 때 보여줄 위치 (CSS object-position) */
  endingPosition: "center",
} as const;

const byId = new Map(manifest.map((p) => [p.id, p as GalleryPhoto]));

export const gallery: GalleryPhoto[] = [
  ...ORDER.map((id) => byId.get(id)).filter((p): p is GalleryPhoto => Boolean(p)),
  ...(manifest as GalleryPhoto[]).filter((p) => !ORDER.includes(p.id)),
].filter((p) => !EXCLUDE.includes(p.id));

export function photo(id: string): GalleryPhoto {
  const p = byId.get(id);
  if (!p) throw new Error(`갤러리에 없는 사진 id: ${id}. pnpm photos 를 먼저 실행했는지 확인.`);
  return p;
}
