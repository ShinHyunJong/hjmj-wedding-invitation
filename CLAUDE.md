# 모바일 청첩장 (신현종 ♥ 강민지)

모바일 웹 청첩장 프로젝트. 종이 청첩장(`assets/`)과 동일한 컬러·분위기를 유지하면서,
참고 사이트(their mood 샘플)의 섹션 구성과 인터랙션을 따른다.

- 참고 디자인: https://w.theirmood.com/card/vzUGuBO4E1 (2026-09-08 변경. 전체 스크린샷: `docs/reference/theirmood-vzUGuBO4E1.jpg`)
  - 이전 참고: https://w.theirmood.com/card/RgBpuxZSRM (더 이상 기준 아님)
- 종이 청첩장 최종 시안: `assets/신현종최종시안 (1).pdf` (4페이지, Illustrator 원본, 141MB)
- 종이 청첩장 실물 사진: `assets/KakaoTalk_Photo_*.jpeg` (5장), 약도 캡처: `assets/KakaoTalk_Photo_2026-09-07-10-57-58.png`
- 갤러리 원본 사진: `weddingPhoto/신현종 강민지님 앨범수정본/` (64장 + `액자 크기 크롭본/` 8장, 총 약 1GB)

---

## 1. 결혼식 정보 (종이 청첩장 기준, 확정)

| 항목 | 내용 |
|---|---|
| 신랑 | 신현종 (SHIN HYUN JONG) — 신승원 · 김숙자의 아들 |
| 신부 | 강민지 (KANG MINJI) — 김애경의 딸. 아버지 강영수는 URL `/g` 에서만 표기 (아래 "URL 변형") |
| 일시 | 2026년 11월 22일 일요일 오후 4시 |
| 장소 | 라브르에드니아 단독홀 |
| 주소 | 서울시 송파구 백제고분로 95 라브르 에드니아 |
| 지하철 | 2 · 9호선 종합운동장역 9번 출구에서 400M (도보 5분) |
| 주차 | 라브르 에드니아 건물 (전 차량 발렛) |
| 영문 문구 | SHIN HYUN JONG & KANG MINJI / INVITE YOU TO CELEBRATE OUR WEDDING. |

### 초대 문구 (종이 청첩장 원문 그대로 사용)

```
결혼합니다.

사랑을 받는 일에 익숙했던 사람과
사랑을 주는 일에 익숙했던 사람이 만났습니다.
서로 다른 방식으로 배워 온 사랑을 나누며
따뜻하고 단단한 가정을 이루려 합니다.
저희의 새로운 시작을 함께 축복해 주시면 감사하겠습니다.

신승원 · 김숙자의 아들 신현종
김애경의 딸 강민지
```

### URL 변형 (신부 아버지 성함 표기 여부, 2026-09-09)

같은 페이지를 경로만 다르게 두 벌 낸다. 경로는 의미가 드러나지 않게 한 글자. `src/app/[variant]/page.tsx` + `weddingFor()`.

| 경로 | 신부측 표기 | 용도 |
|---|---|---|
| `/g` | **강영수 · 김애경**의 딸 강민지 | 아버지 성함 포함 버전 |
| `/t`, `/` | 김애경의 딸 강민지 | 종이 청첩장과 동일 |

- 다른 부분(사진 · 계좌 · 연락처)은 동일. 신부 아버지 연락처 · 계좌는 없음.
- 공유 링크는 `window.location.pathname` 을 그대로 쓰므로 `/g` 에서 공유하면 `/g` 로 간다.
- 변형을 늘리려면 `URL_VARIANTS` 와 `weddingFor()` 만 수정.

### 받은 정보 (2026-09-08, `src/config/wedding.ts`에 반영)

- 신랑 · 신부 연락처, 축의금 계좌 5건(신랑측 3, 신부측 2), 카카오 JavaScript 키(`.env`).

### 아직 없는 정보 (구현 전 사용자에게 확인)

- 양가 부모님 연락처 (전화 / 문자) — 지금은 신랑 · 신부만 연락하기 모달에 표시
- 카카오페이 송금 링크 여부
- 예식장 전화번호 (좌표는 확보됨: 37.5083186, 127.0795732 — 네이버 지역검색 API, `venue.coords`)
- 버스 노선 정보 (종이 청첩장에는 없음)
- 카카오톡 공유용 썸네일 · 제목 · 설명 문구
- Profile 섹션용 신랑 · 신부 소개 문구(각 4줄 내외)와 개인 사진 1장씩
- 인터뷰 / SINCE(연애 스토리, 사귄 시작일) / Notice 섹션 포함 여부
- 배포 도메인 (정해지면: 카카오 Web 플랫폼, NCP Web 서비스 URL, S3 CORS AllowedOrigins, NEXT_PUBLIC_SITE_URL 네 곳에 등록)

---

## 2. 컬러 테마 (종이 청첩장 PDF 벡터 색상에서 추출)

종이 청첩장은 **흰 바탕 + 버건디 레드 포인트 + 짙은 차콜 본문**의 3색 구성이다.
모바일 청첩장도 이 3색을 그대로 쓰고, 참고 사이트의 베이지 배경은 쓰지 않는다.

```css
:root {
  --color-bg:        #FFFFFF;  /* 종이 바탕. 섹션 구분용으로만 아래 tint 사용 */
  --color-bg-tint:   #FBF6F7;  /* 아주 옅은 핑크빛 화이트 (PDF 2차 배경색) */
  --color-primary:   #961421;  /* 버건디 레드 — 스크립트 타이틀, 날짜, 실링왁스, 캘린더 강조 */
  --color-text:      #231F20;  /* 본문 차콜 (PDF 본문 텍스트 색) */
  --color-text-sub:  #393536;  /* 부모님 성함, 보조 텍스트 */
  --color-text-muted:#8A8A8F;  /* 캡션, 영문 소문구 */
  --color-line:      #E7D4D6;  /* 구분선 (버건디를 연하게 희석한 톤) */
  --color-primary-soft: #D49FA4; /* 버건디 20~30% 톤, 캘린더 일요일·hover 등 */
}
```

규칙:
- 버건디는 **포인트 색**이다. 큰 면적 배경으로 깔지 않는다. (실링왁스, 타이틀, 날짜, 강조 숫자 정도)
- 본문은 검정(#000)이 아니라 `--color-text` 차콜을 쓴다.
- 그 외 색(참고 사이트의 핑크 #F79E9E, 골드 등)은 도입하지 않는다.
- 다크모드는 지원하지 않는다. `color-scheme: light` 고정.

---

## 3. 타이포그래피

종이 청첩장에 쓰인 폰트(PDF 임베드): Snell Roundhand Bold(영문 스크립트), Californian FB(영문 세리프),
Arita-buri SemiBold(한글 세리프), SUIT Light/Medium/Bold(한글 산세리프), Ethereal Thin.

웹에서는 아래 대체 조합을 쓴다. (무료 웹폰트, 라이선스 문제 없음)

| 역할 | 종이 청첩장 | 웹 대체 | 용도 |
|---|---|---|---|
| 영문 스크립트 | Snell Roundhand | **Pinyon Script** (Google Fonts), fallback: Great Vibes | "Wedding Day", "Invitation", "Location" 등 섹션 타이틀 |
| 영문 세리프 | Californian FB | **Cormorant Garamond** (Google Fonts) | 날짜 `2026.11.22.`, 영문 이름, 소문구 |
| 한글 본문 | SUIT | **SUIT Variable** (CDN: sun-typeface/SUIT) | 본문, 안내 텍스트, 버튼 |
| 한글 강조 | Arita-buri | **Noto Serif KR** 또는 Gowun Batang | 초대 문구 제목("결혼합니다."), 성함 |

- 영문 소문구는 `letter-spacing: 0.15em`, 대문자 (종이 청첩장의 `SHIN HYUN JONG & KANG MINJI` 느낌).
- 한글 본문 기본 15px, line-height 1.8. 참고 사이트와 유사한 밀도.
- 폰트는 `next/font` 또는 `<link preload>`로 로드하고, 스크립트 폰트는 `font-display: swap`.

---

## 4. 페이지 구조 (참고 사이트 vzUGuBO4E1 기준 섹션 순서)

세로 스크롤 단일 페이지. 최대 폭 **430px**, 그 이상은 가운데 정렬 + 흰 여백.
섹션마다 상단에 영문 소제목(eyebrow, 자간 넓은 세리프 대문자) + 한글 제목이 온다.
참고 사이트는 섹션 제목을 연한 로즈(#B27085)로 쓰지만, 우리는 버건디 `--color-primary`로 통일한다.

1. **Hero (메인)** — 아래 5절 참고. 참고 사이트 hero는 상단에 세리프 날짜 `2027 / 10 / 23` + `SATURDAY`, 그 아래 전폭 사진, 사진 아래 `신랑 · 신부` 이름, 일시 한 줄, 장소 한 줄.
2. **Invitation** — eyebrow `INVITATION`, 제목 "소중한 분들을 초대합니다", 초대 문구(종이 청첩장 원문), 짧은 구분선, 양가 부모님 + 신랑신부 성함(줄마다 작은 꽃 아이콘), `연락하기` 버튼(전화/문자 모달).
3. **Profile** — eyebrow `PROFILE`, "두 사람을 소개합니다." 신랑 · 신부 각각 사진 1장 + 이름 + 4줄 소개. 신랑은 사진 왼쪽/글 오른쪽, 신부는 반대로 엇갈림. **소개 문구는 사용자에게 받아야 함.**
4. **Calendar** — `2026.11.22` + `일요일 오후 4시`, 11월 달력(일요일 · 22일 버건디, 22일은 채운 원), 위아래 가는 구분선. D-day 카운트다운 `DAYS : HOUR : MIN : SEC` + "민지, 현종의 결혼식이 N일 남았습니다."
   - 참고 사이트의 "함께 보낸 소중한 날 +N일"(사귄 날짜 카운터)은 선택. 포함하려면 시작일 필요.
5. **Our story (SINCE)** — 사진 1장 + "Our story" 스크립트 + `이야기 시작하기` 버튼(타임라인 모달). 선택 섹션.
6. ~~**Interview**~~ — **제외 확정** (2026-09-08 사용자 결정). 구현하지 않는다.
7. **Join Us** — 버건디 대문자 타이포 블록 `JOIN US / AS / WE / BECOME ONE`, `22 / NOVEMBER / 2026`, `SUNDAY / PM 4:00` (3행, 좌우 양끝 정렬) + 전폭 사진 1장.
8. **Location** — eyebrow `LOCATION`, "오시는 길", 홀 이름(굵게) · 주소 · `Tel.` 링크, 네이버 지도(전폭), `약도 이미지 보기` 버튼(`public/images/map.png` 모달), **내비게이션** 소제목 + 버튼 3종(네이버지도 / 티맵 / 카카오내비), **지하철** · **주차** 안내(참고 사이트는 버스도 있으나 우리는 주차로 대체).
9. **Notice** — eyebrow `NOTICE` + 안내 제목 + 본문 + 사진. 참고 사이트는 포토부스 안내. **우리 예식에 안내할 내용이 있는지 확인 필요.** 없으면 생략.
10. **Gallery** — eyebrow `GALLERY`, "웨딩 갤러리". **2열 메이슨리 그리드**(세로 사진 기준, 가로 사진은 원본 비율 유지), 초기 N장만 보여주고 `더보기` 버튼으로 확장. 탭 시 전체화면 라이트박스(스와이프).
11. **Guestbook** — eyebrow `GUESTBOOK`, "방명록". 카드형 가로 스크롤(최근 10) + `작성하기`(이름 · 메시지 · 비밀번호 4~20자) / `전체보기`(더 보기 페이징) / 카드 × 로 본인 삭제(비밀번호). **구현됨** (`sections/Guestbook.tsx`).
12. **Account** — eyebrow `ACCOUNT`, "마음 전하실 곳", 안내 3줄. `신랑측 계좌번호` / `신부측 계좌번호` **아코디언**(펼치면 예금주 + 복사 아이콘, 은행 · 계좌번호, 오른쪽에 카카오페이 노란 원형 버튼).
13. **R.S.V.P.** — "참석 의사 전달", 설명 2줄, `참석의사 전달하기` 버튼 → **전체 화면 흐림 배경 폼**(`Modal variant="full"`, 참고 mZdJd64x2r): 참석 가능/불가 카드(체크 원), 성함 밑줄 입력 + 신랑측/신부측 라디오, 추가 인원 원형 ±(본인 제외, headcount = 1+추가), 개인정보 동의 카드, 다 채워야 버건디로 활성화되는 버튼. 팝업은 **없음**(2026-09-10 사용자 결정: 팝업 대신 섹션 자체를 강조). 섹션은 **강조 카드**: 버건디 상단 라인 + '꼭 전달해 주세요' 배지, 세리프 제목("참석 의사를 전달해 주셔야 자리와 식사를 준비할 수 있습니다", 핵심어 버건디), 설명, 일시/장소/주소 행(버건디 아이콘), 채운 버건디 버튼, '약 20초' 안내. **구현됨**, 2026-09-10 헤드리스로 제출까지 검증.
14. **Capture our moments** — "축하 사진 공유". 폴라로이드 3장 장식, 설명, `사진 업로드`(예식일 00:00 KST 전에는 비활성 + 안내), 업로드 후 3열 그리드로 최근 12장. **구현됨** (`sections/Capture.tsx`).
15. **Closing** — 사진 3장을 세로로, 각 사진 왼쪽 아래에 스크립트 "Love story is beautiful, but ours is my favorite" 겹침.
16. **Save the Date** — 스크립트 "Save the Date"(버건디) + 한글 표 3행 `날짜 | 2026년 11월 22일 일요일`, `시간 | 오후 4시`, `장소 | 홀 이름 · 주소` (2026-09-10 사용자 요청으로 표 내용 전부 한글. 요일 · 오전/오후는 date 값에서 계산).
17. **Ending** — 전폭 사진(2:3, `FEATURED.ending` + `endingPosition`) 위에 시. 상단은 흰색으로 페이드, 하단은 어둡게 페이드. 글은 세리프 한글 · 자간 0.14em · 줄간격 2.2 · 흰색, 아래에 출처. 문구는 `wedding.ending` (지금은 이수동 「사랑가」, **두 사람 문구로 교체 여부 확인**).
18. **Footer** — 실링왁스 모노그램, `카카오톡으로 초대장 보내기`(키 있을 때), 링크 복사, 영문 이름 · 날짜.

구현됨: 1, 2, 4, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18. 순서: Gallery → Guestbook → Account → RSVP → Capture → Closing → Save the Date → Ending → Footer.
사용자 확인 후 추가: 3(소개 문구), 5, 9. 6(Interview)은 제외.
(참고 사이트 번호와 어긋남 주의: 우리 순서는 Closing → Save the Date → Ending → Footer.)

---

## 5. Hero(메인) 섹션 — 교체 가능하게 설계

메인 화면은 **계속 바뀔 수 있다**. 따라서:

- `src/components/hero/` 아래에 변형을 각각 별도 컴포넌트로 둔다. (예: `HeroSealed.tsx`, `HeroPhoto.tsx`, `HeroPolaroid.tsx`)
- 어떤 hero를 쓸지는 `src/config/wedding.ts`의 `heroVariant` 한 줄로 바꾼다.
- 모든 hero 변형은 같은 props(`WeddingInfo`)만 받는다. 텍스트 · 날짜 · 사진 경로를 hero 안에 하드코딩하지 않는다.
- 각 변형은 390 × 844 뷰포트에서 폴드 위에 완결되어야 한다(스크롤 없이 첫 화면 완성).

구현된 변형 (`src/components/hero/`):
- `photo` (**기본**, 참고 사이트 vzUGuBO4E1 hero 재현): 상단 세리프 날짜 `2026 / 11 / 22` + `SUNDAY`, 전폭 사진 4:5(`FEATURED.hero` = YS_04054, 사용자 지정), 아래 `신현종 · 강민지`, 일시, 장소. 폴드 안에 끝나지 않아도 됨.
- `sealed` (종이 청첩장 표지 재현): 흰 배경, 스크립트 "WeddingDay"(버건디), 봉투 플랩 V선 + 버건디 실링왁스 SVG(`WaxSeal.tsx`, 모노그램은 `wedding.monogram`), 하단에 `2026.11.22.` 세리프 + 영문 소문구.
- `polaroid`: 폴라로이드 프레임 안에 메인 사진 + 하단 이름/날짜. 메인 사진은 PDF에서 추출한 `public/images/main.jpg` (1200 × 1800, `gallery.ts`의 `mainPhoto`).
- 실링왁스를 탭하면 봉투가 열리며 다음 섹션으로 스크롤하는 인터랙션은 선택(미구현).

새 변형 추가 절차: `HeroXxx.tsx` 작성 → `hero/index.tsx`의 `variants`에 등록 → `HeroVariant` 타입에 이름 추가 → `heroVariant` 값 변경.

---

## 6. 사진 · 에셋 처리 규칙

원본은 4672 × 7008 급 JPEG(장당 2~25MB)이므로 **원본을 그대로 웹에 올리지 않는다.**

- `pnpm photos` (`scripts/optimize-photos.ts`, sharp) 로 원본 → `public/gallery/` 생성 (이미 실행됨, 64장 → 6.3MB):
  - 갤러리용: `<id>.webp` 긴 변 1600px, q80
  - 썸네일용: `<id>.thumb.webp` 긴 변 480px, q75
  - manifest: `src/config/gallery.generated.json` (직접 수정 금지, 스크립트가 덮어씀)
  - id는 파일명 첫 토큰 (`YS_01595 첫장---.jpg` → `YS_01595`). 이미 있는 결과물은 건너뛰며 `--force`로 재생성.
- 원본 폴더 `weddingPhoto/`와 `assets/`는 **git에 커밋하지 않는다** (`.gitignore` 등록됨). 최적화 결과물만 커밋.
- 갤러리 순서는 `src/config/gallery.ts`의 `ORDER` 배열로, 제외는 `EXCLUDE`로 관리. 파일명의 `순서1~4`, `첫장` 표기는 사진관의 앨범 배치 힌트일 뿐이므로 초기값으로만 반영했다.
- 사진 비율: 세로 54장, 가로 10장. 갤러리는 2열 메이슨리 그리드(CSS columns 또는 높이 계산)로, 각 사진은 원본 비율 유지. 라이트박스에서는 `object-fit: contain`.
- `액자 크기 크롭본/`은 액자 인쇄용 복제본이므로 웹에서는 사용하지 않는다.
- 약도: PDF 4페이지에서 300dpi로 추출한 `public/images/map.png` (756 × 456) 사용. assets의 카카오톡 캡처 PNG는 저해상도라 쓰지 않는다.
- OG 이미지(`public/images/og.jpg`, 1200 × 630)는 아직 없음. 카카오 공유 구현 시 생성.

---

## 7. 기술 스택 (세팅 완료)

- **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4**. 2026-09-10 부터 **서버 API 포함**(정적 export 아님) → **Vercel** 배포. 페이지는 prerender(SSG), `/api/*` 는 서버리스 함수.
- 패키지 매니저 **pnpm**. Node 24.
- 상태 관리 없음. 데이터는 `src/config/wedding.ts` 단일 파일.
- 폰트: `next/font/google`로 Pinyon Script / Cormorant Garamond / Noto Serif KR, SUIT Variable은 `globals.css`에서 jsDelivr CDN `@import`.
- 라이트박스: `yet-another-react-lightbox` / 가로 스크롤(방명록 카드 등): `embla-carousel-react` (둘 다 설치됨, 미사용)
- 지도: **네이버 지도 (NCP Maps JS API v3)** (`src/lib/naver.ts`, `sections/NaverMap.tsx`, 2026-09-09 카카오맵에서 교체). 좌표가 없으면 `venue.roadAddress` 를 지오코딩(geocoder 서브모듈)한다. 키 없음 · 인증 실패(`navermap_authFailure`) · 지오코딩 실패 시 종이 청첩장 약도(`public/images/map.png`)로 대체.
  - **네이버 키**: `.env`의 `NAVER_MAP_CLIENT_ID` (NCP 콘솔 → AI·NAVER API → Maps → Application → Client ID). `next.config.ts`가 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`로 노출 (`NAVER_CLIENT_ID` 등 별칭도 인식). NCP Application 의 **Web 서비스 URL** 에 `http://localhost:5400` 과 배포 도메인 등록 필요.
  - 주의: 2026-09-09 현재 `.env`의 `NAVER_CLIENT_ID`/`NAVER_CLIENT_SECRET` 은 **developers.naver.com(네이버 개발자센터) 키**다. 지역검색 API에는 동작하지만(좌표 확보에 사용) 지도 SDK 인증(`/v3/auth`)은 401 → 약도로 대체. 지도를 띄우려면 **NCP(네이버 클라우드 플랫폼) Maps Client ID** 가 필요하다.
  - 좌표가 `venue.coords` 에 있으므로 Geocoding 은 실제로 호출되지 않는다 (좌표가 null 일 때만 사용).
  - SDK 인증은 Map 생성 후 비동기로 검사되므로 `NaverMap.tsx` 가 `navermap_authFailure` 를 다시 등록해 실패 시 약도로 전환한다.
- 카카오톡 공유: Kakao JS SDK 2.7.4 `Share.sendDefault` (feed, `public/images/og.jpg`). 카카오맵 코드는 제거됨(공유만 카카오).
- **카카오 키**: `.env`의 `KAKAO_JS_KEY` (JavaScript 키, gitignore 됨). `next.config.ts`가 `NEXT_PUBLIC_KAKAO_JS_KEY`로 노출한다. **키나 값을 채팅 · 문서 · 로그에 절대 출력하지 않는다** (`.env` 를 볼 때는 `sed -E 's/=(.{3}).*/=\1…/'` 로 마스킹).
  - 카카오 개발자 콘솔 → 앱 → 플랫폼 → Web 에 **`http://localhost:5400`** 과 배포 도메인을 등록해야 공유가 동작한다. 미등록이면 401 `domain mismatched`(2026-09-08 확인).
  - `.env`/`next.config.ts` 변경 후에는 dev 서버를 재시작해야 반영된다.
- 내비게이션 링크 (`sections/Location.tsx`): 좌표 있으면 네이버 `nmap://route/public?dlat&dlng&dname`, 티맵 `tmap://?rGoName&rGoY(위도)&rGoX(경도)`, 카카오내비는 **Kakao JS SDK `Navi.start`** (앱 실행, 미설치 시 설치 안내. 2026-09-10 헤드리스로 `kakaonavi://` 스킴 호출 확인) — SDK 를 못 쓰면 `map.kakao.com/link/to/이름,위도,경도`. 좌표 없으면 장소명 검색 링크. 앱 스킴은 미설치 시 웹 링크로 폴백.
- 애니메이션: `ui/Reveal.tsx` — 스크롤 진입 시 24px 상승 + blur 6px→0 + opacity, 1.1s 감속 곡선, `delay`로 순차 등장. 정적 HTML에서는 항상 보임(썸네일 안전). reduced-motion 존중.
- 버튼(`ui/Button.tsx`): **참고 사이트와 동일하게** 흰 바탕 · 1px `--color-line` 테두리 · 모서리 14px · 높이 46px · 포인트 색 글자 + 같은 색 얇은 선 아이콘. 내비 버튼은 모서리 10px에 브랜드 색 아이콘.
- `next/image`는 `unoptimized`. 사진은 미리 최적화된 WebP를 `<img>`로 쓴다.

### 명령어

```
pnpm dev          # 개발 서버 (package.json 에 --port 5400 고정. 카카오 Web 도메인도 localhost:5400 으로 등록)
                  # Next 는 프로젝트당 dev 서버 1개만 허용. 사용자 서버가 떠 있으면 `pnpm build && pnpm exec next start -p 5401` 로 확인.
pnpm build        # 프로덕션 빌드 (.next). 로컬 확인은 pnpm exec next start -p 5401
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm photos       # 갤러리 사진 최적화 (--force 로 재생성)
pnpm shot         # 헤드리스 스크린샷 → screenshots/viewport.png (--full, --url, --width/--height, --out)
pnpm preview      # 공유용 단일 HTML → screenshots/preview.html (Artifact 로 게시. hero 변형 토글 포함, --variants photo 로 제한 가능)
```

"링크로 보여줘" 요청 시: `pnpm preview` → `screenshots/preview.html` 을 Artifact 도구로 게시 (기존 URL 갱신). 정적 export 가 없어진 뒤로는 `.next/server/app/index.html` 에서 읽는다.
미리보기에는 Next 런타임이 없어 카운트다운만 동작하고 더보기 · 라이트박스 · 복사 · 모달은 동작하지 않는다.

### 백엔드 (참석 의사 · 방명록 · 하객 사진) — 2026-09-10

- **DB**: RDS MySQL 8.4 (서울), 데이터베이스 `wedding`. `pnpm db:migrate` 로 테이블 생성(멱등). 테이블 `rsvp`, `guestbook`(soft delete: `deleted_at`), `photos`(S3 키 + `pending/uploaded`).
- **S3**: 버킷 `rechee-platform-asset`, 접두어 `wedding/` (사진은 `wedding/photos/YYYYMMDD/<uuid>.<ext>`). 버킷은 비공개, 열람은 1시간 서명 URL, 업로드는 5분 서명 PUT URL 로 브라우저가 직접 올린다. **버킷 CORS 에 배포 도메인 등록 필요** (PUT/GET, 현재 localhost:5400 만).
- **API** (`src/app/api/`, `runtime = "nodejs"`):
  - `POST /api/rsvp` {side, name, headcount} — 이름 · 인원 · 신랑/신부측 (사용자 확정 항목)
  - `GET /api/guestbook?limit&cursor`, `POST /api/guestbook` {name, message, password}, `DELETE /api/guestbook/:id` {password} (또는 관리자 토큰)
  - `GET /api/photos`(서명 URL 목록 + open 여부), `POST /api/photos` {contentType, size} → {id, uploadUrl}, `PUT /api/photos/:id` (S3 HeadObject 로 완료 확인)
  - `GET /api/admin/export?type=rsvp|guestbook|photos&token=` → CSV (BOM 포함, 엑셀용). `ADMIN_TOKEN` 없으면 항상 401.
- **보호**: 허니팟 필드 `website`(값 있으면 조용히 ok), IP 별 DB 카운트 제한(rsvp · guestbook 10분 5건, photos 10분 60건), 길이 · 크기(25MB) · 형식(JPG/PNG/WebP/HEIC) 제한, 방명록 비밀번호 scrypt 해시.
- **업로드 개방**: 예식일 00:00 KST 부터. `PHOTO_UPLOAD_OPEN=1` 이면 항상 열림(테스트).
- **환경변수**: `.env.example` 참고. Vercel 에도 같은 이름으로 넣는다. `.env` 의 값은 채팅에 절대 출력하지 않는다(`sed -E 's/=(.{3}).*/=\1…/' .env` 로 마스킹).
- **로컬 확인**: dev 서버는 프로젝트당 1개라, 사용자 서버가 떠 있으면 `pnpm build && PHOTO_UPLOAD_OPEN=1 pnpm exec next start -p 5401` 로 띄워 curl · 헤드리스로 검사. 테스트로 넣은 행과 S3 객체는 반드시 지운다.
- **섹션 on/off**: `wedding.features` {rsvp, guestbook, photos}.
- 2026-09-10 end-to-end 검증 완료: rsvp 등록/검증/허니팟, 방명록 작성/목록/오답 거부/삭제, 사진 presign → S3 PUT → 확인 → 서명 URL 열람, CSV export, 토큰 없는 export 401.

### 디렉터리

```
src/
  app/            layout.tsx(폰트·메타), page.tsx(/ = t), [variant]/page.tsx(/g, /t), globals.css(컬러·폰트 토큰)
    api/          rsvp, guestbook(+[id]), photos(+[id]), admin/export — 서버 라우트
  components/
    InvitationPage.tsx   섹션 순서 (모든 경로가 공유)
    hero/         HeroSealed, HeroPolaroid, WaxSeal, types.ts, index.tsx(variant 선택)
    sections/     Invitation, Calendar(+Countdown), JoinUs, Location(+NaverMap), Gallery, Guestbook, Account, Rsvp, Capture, Closing, SaveTheDate, Ending, Footer
    ui/           SectionTitle, Button, Modal, Reveal, Form(Input/Textarea/Segmented/Honeypot/SubmitButton)
  config/
    wedding.ts    결혼 정보 · 연락처 · 계좌 · heroVariant · monogram
    gallery.ts    갤러리 순서(ORDER/EXCLUDE), mainPhoto, FEATURED
    gallery.generated.json   pnpm photos 산출물
  lib/            date(D-day), kakao(공유·내비), naver(지도), api(fetch 도우미)
    server/       db(mysql2 풀), s3(서명 URL), http(응답·검증·제한·해시) — 서버 전용(server-only)
public/
  gallery/        최적화된 사진 (자동 생성)
  images/         main.jpg(메인 사진), map.png(약도), (예정) og.jpg
scripts/
  db-migrate.ts        pnpm db:migrate
  optimize-photos.ts   pnpm photos
  screenshot.ts        pnpm shot (헤드리스 Chromium)
  build-preview.mjs    pnpm preview (Artifact 공유용 단일 HTML)
screenshots/           스크린샷 산출물 (gitignore)
```

### Tailwind 토큰 사용법

`globals.css`의 `@theme inline`에 등록돼 있어 유틸리티로 바로 쓴다:
`bg-bg`, `bg-bg-tint`, `text-primary`, `text-text`, `text-text-sub`, `text-text-muted`, `border-line`,
`font-script`, `font-serif-en`, `font-serif-ko`, `font-sans`. 영문 소문구는 `.eyebrow` 클래스.

---

## 8. 작업 규칙

- 개인정보(연락처, 계좌번호)는 `src/config/wedding.ts`에만 두고, 공개 저장소에 올릴 경우 환경변수로 분리한다.
- 텍스트 원문(초대 문구, 성함, 일시, 주소)은 종이 청첩장과 **한 글자도 다르지 않게** 유지한다. 바꿔야 하면 사용자에게 먼저 확인.
- 색은 반드시 CSS 변수 토큰만 사용. 컴포넌트에 hex 직접 쓰지 않는다.
- 모바일 우선. 기준 뷰포트 390 × 844 (iPhone 14/15). 데스크톱은 가운데 정렬 카드 형태.
- 한국어 UI. 영문은 장식 문구(섹션 소제목, 날짜)에만.
- 변경 후 `pnpm dev`(5400) 상태에서 `pnpm shot` / `pnpm shot --full` 로 390 × 844 스크린샷을 찍어 확인한다.
  **Playwright MCP 브라우저 도구는 쓰지 않는다** (창이 열려 포커스를 뺏음). 반드시 헤드리스 스크립트만 사용.
- 원본 사진 · assets 폴더는 절대 수정 · 삭제하지 않는다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
