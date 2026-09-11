/**
 * 결혼식 정보 단일 소스.
 * 텍스트 원문은 종이 청첩장(assets/신현종최종시안 (1).pdf)과 한 글자도 다르지 않게 유지한다.
 * 연락처·계좌 등 개인정보는 이 파일에만 둔다.
 */

export type HeroVariant = "sealed" | "polaroid" | "photo";

export interface Person {
  /** 한글 성함 */
  name: string;
  /** 영문 표기 (대문자) */
  nameEn: string;
  /** 전화번호. 미정이면 빈 문자열 */
  phone: string;
}

export interface Parent extends Person {
  /** 부/모 */
  role: "father" | "mother";
}

export interface Account {
  /** 예금주 */
  holder: string;
  bank: string;
  number: string;
  /** 카카오페이 송금 링크 (선택) */
  kakaoPayUrl?: string;
}

export const wedding = {
  /** 메인(hero) 변형. 이 값 하나로 첫 화면을 교체한다. */
  heroVariant: "photo" as HeroVariant,

  /** 실링왁스 모노그램 (스크립트 폰트로 렌더링) */
  monogram: "SK",

  /** 서버(API)가 필요한 섹션 켜고 끄기. RDS MySQL + S3 (src/app/api). */
  features: { rsvp: true, guestbook: false, photos: true }, // 방명록은 일단 숨김 (2026-09-11). 다시 켜려면 true.

  groom: {
    name: "신현종",
    nameEn: "SHIN HYUN JONG",
    phone: "010-7712-9638",
    parents: [
      { role: "father", name: "신승원", nameEn: "", phone: "" },
      { role: "mother", name: "김숙자", nameEn: "", phone: "" },
    ] as Parent[],
    /** 부모님 기준 관계 표기 */
    relation: "아들",
  },

  bride: {
    name: "강민지",
    nameEn: "KANG MINJI",
    phone: "010-4626-1505",
    /** 기본(종이 청첩장과 동일): 어머니만. 아버지 포함 버전은 weddingFor("g") 참고. */
    parents: [{ role: "mother", name: "김애경", nameEn: "", phone: "" }] as Parent[],
    relation: "딸",
  },

  /** 예식 일시 (KST). 월은 1부터. */
  date: {
    year: 2026,
    month: 11,
    day: 22,
    hour: 16,
    minute: 0,
    /** 표시용 */
    label: "2026년 11월 22일 일요일 오후 4시",
    labelShort: "2026.11.22.",
    weekdayEn: "SUNDAY",
    monthEn: "NOVEMBER",
    timeEn: "PM 4:00",
  },

  venue: {
    name: "라브르에드니아 단독홀",
    /** 건물명 (주소 표기용) */
    building: "라브르 에드니아",
    address: "서울시 송파구 백제고분로 95 라브르 에드니아",
    /** 지오코딩용 도로명 주소 (건물명 없이) */
    roadAddress: "서울특별시 송파구 백제고분로 95",
    phone: "",
    /** 지도 좌표 (WGS84). 네이버 지역검색 API 결과(2026-09-09): 라브르에드니아, 백제고분로 95 */
    coords: { lat: 37.5083186, lng: 127.0795732 } as { lat: number; lng: number } | null,
    subway: "2 · 9호선 종합운동장역 9번 출구에서 400M (도보 5분)",
    parking: "라브르 에드니아 건물 (전 차량 발렛)",
    bus: [] as string[],
  },

  /** 초대 문구. 종이 청첩장 원문 그대로. */
  invitation: {
    title: "결혼합니다.",
    body: [
      "사랑을 받는 일에 익숙했던 사람과",
      "사랑을 주는 일에 익숙했던 사람이 만났습니다.",
      "서로 다른 방식으로 배워 온 사랑을 나누며",
      "따뜻하고 단단한 가정을 이루려 합니다.",
      "저희의 새로운 시작을 함께 축복해 주시면 감사하겠습니다.",
    ],
  },

  /** 영문 장식 문구 */
  tagline: {
    line1: "SHIN HYUN JONG & KANG MINJI",
    line2: "INVITE YOU TO CELEBRATE OUR WEDDING.",
    joinUs: ["JOIN US", "AS", "WE", "BECOME ONE"],
  },

  accounts: {
    groom: [
      { holder: "신현종", bank: "국민은행", number: "613402-04-035602" },
      { holder: "신승원", bank: "NH농협", number: "1292-12-00003-2" },
      { holder: "김숙자", bank: "NH농협", number: "3561576962913" },
    ] as Account[],
    bride: [
      { holder: "강민지", bank: "신한은행", number: "110-426-862194" },
      { holder: "김애경", bank: "신한은행", number: "354-02-184220" },
    ] as Account[],
  },

  /**
   * 엔딩 시 (전폭 사진 위에 얹는 글).
   * 현재 문구는 참고 사이트와 같은 이수동 시인의 「사랑가」 구절 — 두 사람만의 문구가 있으면 교체한다.
   */
  ending: {
    lines: ["장담하건대, 세상이 다 겨울이어도", "우리 사랑은 늘 봄처럼 따뜻하고", "간혹, 여름처럼 뜨거울 겁니다."],
    author: "이수동, 사랑가",
  },

  /** 카카오톡 공유 메타 */
  share: {
    title: "신현종 ♥ 강민지 결혼합니다",
    description: "2026년 11월 22일 일요일 오후 4시, 라브르에드니아 단독홀",
    /** public/ 기준 경로 */
    image: "/images/og.jpg",
  },
} as const;

export type Wedding = typeof wedding;

/**
 * URL 경로 변형. 겉으로 의미가 드러나지 않도록 한 글자 경로를 쓴다.
 *   /g  → 신부측에 아버지(강영수) 성함 포함: "강영수 · 김애경의 딸 강민지"
 *   /t  → 아버지 성함 없음 (종이 청첩장과 동일): "김애경의 딸 강민지"
 *   /   → t 와 같음
 */
export const URL_VARIANTS = ["g", "t"] as const;
export type UrlVariant = (typeof URL_VARIANTS)[number];

/**
 * 신부 아버지. `wedding` 객체 밖에 두는 이유: 컴포넌트에 넘기는 wedding 이 HTML(RSC payload)에 그대로 직렬화되므로,
 * 안에 넣으면 /t 페이지 소스에도 성함이 남는다. 여기서만 "g" 일 때 합친다.
 */
const brideFather: Parent = { role: "father", name: "강영수", nameEn: "", phone: "" };

export function weddingFor(variant: UrlVariant | undefined): Wedding {
  if (variant !== "g") return wedding;
  return {
    ...wedding,
    bride: { ...wedding.bride, parents: [brideFather, ...wedding.bride.parents] as Parent[] },
  };
}

/** 예식 시각을 Date 객체로 (KST 기준) */
export function weddingDate(): Date {
  const { year, month, day, hour, minute } = wedding.date;
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  const hh = String(hour).padStart(2, "0");
  const mi = String(minute).padStart(2, "0");
  return new Date(`${year}-${mm}-${dd}T${hh}:${mi}:00+09:00`);
}
