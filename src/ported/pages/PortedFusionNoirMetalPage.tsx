import { useEffect, useMemo, useRef, useState } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang) => obj[lang];

interface Floor {
  id: string;
  num: string;
  ord: number;
  name: Record<Lang, string>;
  kicker: Record<Lang, string>;
  blurb: Record<Lang, string>;
  rooms: Array<{ no: string; name: Record<Lang, string>; meta: Record<Lang, string> }>;
  ticker: Record<Lang, string[]>;
}

const FLOORS: Floor[] = [
  {
    id: 'lobby',
    num: '01',
    ord: 1,
    name: { en: 'Lobby', ko: '로비', ja: 'ロビー' },
    kicker: { en: 'arrival · entrance', ko: '도착 · 입구', ja: '到着・入口' },
    blurb: {
      en: 'The chassis is a single embossed plate — depth without a single border. Neon is only allowed to live behind the engraved glass.',
      ko: '엠보싱된 단일 플레이트 하나가 섀시 전체를 이룹니다 — 테두리 없이, 오직 깊이만으로. 음각된 유리 안쪽에서만 네온이 살아 있습니다.',
      ja: 'シャーシは一枚のエンボス・プレート — 罫線なく、深さのみで成立する。ネオンは彫り込まれたガラスの内側でだけ生きる。',
    },
    rooms: [
      { no: '1A', name: { en: 'Reception', ko: '리셉션', ja: '受付' }, meta: { en: '08:00 — 22:00', ko: '08:00 — 22:00', ja: '08:00 — 22:00' } },
      { no: '1B', name: { en: 'Concierge', ko: '컨시어지', ja: 'コンシェルジュ' }, meta: { en: 'no appointment', ko: '예약 불필요', ja: '予約不要' } },
      { no: '1C', name: { en: 'Bell Stand', ko: '벨 스탠드', ja: 'ベルスタンド' }, meta: { en: 'porter on call', ko: '관리인 대기', ja: '管理人待機' } },
    ],
    ticker: {
      en: ['WELCOME · ARRIVED AT 01', 'PRESS A FLOOR OR SCROLL TO RIDE', 'BRASS DOES NOT GLOW'],
      ko: ['환영합니다 · 1층 도착', '층 번호를 누르거나 스크롤하여 운행', '황동은 빛나지 않습니다'],
      ja: ['ようこそ · 1階到着', '階番号を押すかスクロールで運行', 'ブラスは光らない'],
    },
  },
  {
    id: 'mail',
    num: '02',
    ord: 2,
    name: { en: 'Mail Room', ko: '메일 룸', ja: 'メールルーム' },
    kicker: { en: 'parents · references', ko: '모체 스타일 · 레퍼런스', ja: '母体スタイル・参照' },
    blurb: {
      en: 'Two parent styles are sorted on this floor. Neumorphism carries the chassis: no borders, only inset and outset shadow. Cyberpunk Glitch carries the screen behaviour: scanlines, sub-pixel RGB offset, fast counters — all kept behind glass.',
      ko: '두 모체 스타일을 분류하는 층입니다. Neumorphism은 섀시를 맡습니다 — 테두리 없이 음각·양각 그림자만으로. Cyberpunk Glitch는 화면의 거동을 맡습니다 — 스캔라인, 1픽셀 RGB 오프셋, 빠른 숫자 변화까지, 모두 유리 안쪽에 격리됩니다.',
      ja: '二つの母体スタイルを仕分けるフロア。Neumorphismはシャーシを担当 — 罫線なく凹凸の影のみで。Cyberpunk Glitchは画面の挙動を担当 — スキャンライン、1pxのRGBオフセット、速いカウンタまで、すべてガラスの内側に閉じる。',
    },
    rooms: [
      { no: '2A', name: { en: 'Postage', ko: '우편', ja: '郵便' }, meta: { en: 'from neumorphism', ko: 'neumorphism에서', ja: 'neumorphismより' } },
      { no: '2B', name: { en: 'Sort', ko: '분류', ja: '仕分け' }, meta: { en: 'glitch quarantined', ko: '글리치 격리', ja: 'グリッチ隔離' } },
      { no: '2C', name: { en: 'Returns', ko: '반송', ja: '返送' }, meta: { en: 'no neon to chassis', ko: '섀시에 네온 없음', ja: 'シャーシにネオンなし' } },
    ],
    ticker: {
      en: ['IN · NEUMORPHISM', 'IN · CYBERPUNK GLITCH', 'OUT · ALL NEON SEALED IN GLASS'],
      ko: ['입고 · NEUMORPHISM', '입고 · CYBERPUNK GLITCH', '출고 · 네온은 유리 안에 봉인'],
      ja: ['入庫 · NEUMORPHISM', '入庫 · CYBERPUNK GLITCH', '出庫 · ネオンはガラス内に封印'],
    },
  },
  {
    id: 'archives',
    num: '03',
    ord: 3,
    name: { en: 'Archives', ko: '아카이브', ja: 'アーカイブ' },
    kicker: { en: 'records since 1947', ko: '1947년부터의 기록', ja: '1947年からの記録' },
    blurb: {
      en: 'A quiet floor of long shelves. The label drawers are engraved bronze; index lookups float on small flickering tags. Information is dense but the surface stays calm.',
      ko: '긴 선반이 늘어선 조용한 층입니다. 라벨 서랍은 음각된 청동, 색인 조회는 깜박이는 작은 태그 위에 떠 있습니다. 정보는 빽빽하지만 표면은 침착합니다.',
      ja: '長い棚が続く静かな階。ラベルの引出は刻印された青銅、索引照会は瞬く小さなタグに浮かぶ。情報は密だが、表面は静か。',
    },
    rooms: [
      { no: '3A', name: { en: 'Catalog', ko: '카탈로그', ja: '台帳' }, meta: { en: '48 styles indexed', ko: '48개 스타일 색인', ja: '48スタイル索引' } },
      { no: '3B', name: { en: 'Index', ko: '색인', ja: '索引' }, meta: { en: 'alpha · tag · era', ko: 'a-z · 태그 · 시대', ja: 'a-z · タグ · 時代' } },
      { no: '3C', name: { en: 'Microfilm', ko: '마이크로필름', ja: 'マイクロフィルム' }, meta: { en: '4 reels per minute', ko: '분당 4릴', ja: '毎分4リール' } },
    ],
    ticker: {
      en: ['SEEK · A-04', 'SEEK · C-12', 'SEEK · F-22', 'REEL ADVANCE …'],
      ko: ['검색 · A-04', '검색 · C-12', '검색 · F-22', '릴 전진 …'],
      ja: ['検索 · A-04', '検索 · C-12', '検索 · F-22', 'リール前進 …'],
    },
  },
  {
    id: 'stage',
    num: '04',
    ord: 4,
    name: { en: 'Stage', ko: '무대', ja: 'ステージ' },
    kicker: { en: 'current bill', ko: '현재 상연', ja: '現在上演' },
    blurb: {
      en: 'The performance floor. Tonight\'s LCD marquee runs the bill in a slow horizontal scan. The wings stay matte; only the bulbs that aren\'t bulbs — those are LCDs — flicker amber.',
      ko: '공연이 열리는 층입니다. 오늘 밤의 LCD 마키는 천천히 가로로 스캔하며 프로그램을 흘립니다. 무대 양 옆은 무광 그대로, 전구처럼 보이는 LCD만이 호박빛으로 깜박입니다.',
      ja: '公演が開かれるフロア。今夜のLCDマーキーはゆっくり横スキャンで演目を流す。舞台の両袖はマットのまま、電球に見えるLCDだけが琥珀色に揺らぐ。',
    },
    rooms: [
      { no: '4A', name: { en: 'Box Office', ko: '매표소', ja: 'ボックスオフィス' }, meta: { en: 'open · 30 min before', ko: '개막 30분 전 개방', ja: '開演30分前開場' } },
      { no: '4B', name: { en: 'Green Room', ko: '분장실', ja: '楽屋' }, meta: { en: 'cast only', ko: '출연자 전용', ja: '出演者のみ' } },
      { no: '4C', name: { en: 'Booth', ko: '부스', ja: 'ブース' }, meta: { en: 'tech · light · sound', ko: '연출 · 조명 · 음향', ja: 'テック · 照明 · 音響' } },
    ],
    ticker: {
      en: ['BILL · WEB STYLEBOOK No. 11', 'CURTAIN · 19:30', 'HOUSE OPEN · 19:00', 'NORMAL RUN'],
      ko: ['프로그램 · WEB STYLEBOOK No. 11', '개막 · 19:30', '개장 · 19:00', '정상 운영'],
      ja: ['演目 · WEB STYLEBOOK No.11', '開演 · 19:30', '開場 · 19:00', '通常運行'],
    },
  },
  {
    id: 'studio',
    num: '05',
    ord: 5,
    name: { en: 'Studio', ko: '스튜디오', ja: 'スタジオ' },
    kicker: { en: 'production · craft', ko: '제작 · 공예', ja: '製作・工房' },
    blurb: {
      en: 'Plates, presses, vaults. This floor\'s discipline is the whole building\'s discipline: keep colour out of the room, keep it inside the screen. Every brass nameplate is engraved, never printed.',
      ko: '판, 프레스, 금고. 이 층의 규율이 곧 건물 전체의 규율입니다 — 색은 방이 아닌 화면 안에 둘 것. 모든 청동 명패는 인쇄가 아니라 음각으로 새깁니다.',
      ja: '版、プレス、金庫。このフロアの規律が建物全体の規律 — 色は部屋ではなく画面の内側に置く。すべての青銅銘板は印刷ではなく刻印で。',
    },
    rooms: [
      { no: '5A', name: { en: 'Press', ko: '프레스', ja: 'プレス' }, meta: { en: '1 plate at a time', ko: '한 번에 한 판', ja: '一度に一版' } },
      { no: '5B', name: { en: 'Plate Room', ko: '판 보관실', ja: 'プレート室' }, meta: { en: 'inks at rest', ko: '잉크 휴면', ja: 'インク休眠' } },
      { no: '5C', name: { en: 'Vault', ko: '금고', ja: '金庫' }, meta: { en: 'reference colours', ko: '기준 색상 보관', ja: '基準色保管' } },
    ],
    ticker: {
      en: ['PLATE 06 · MOUNTED', 'INK · SODIUM AMBER', 'INK · COOL TEAL · 4% AREA MAX'],
      ko: ['판 06 · 장착', '잉크 · 소듐 앰버', '잉크 · 쿨 틸 · 면적 최대 4%'],
      ja: ['版06 · 装着', 'インク · ソジウム琥珀', 'インク · クールティール · 面積最大4%'],
    },
  },
  {
    id: 'rooftop',
    num: '06',
    ord: 6,
    name: { en: 'Rooftop', ko: '루프탑', ja: 'ルーフトップ' },
    kicker: { en: 'manifesto · view', ko: '선언 · 전망', ja: '宣言・展望' },
    blurb: {
      en: 'You arrived at the top. From here the rule is visible at a glance: the building is matte, the night is matte, only the screens carry colour. Noir Metal is what holds the warmth — a black chassis that catches a single amber light.',
      ko: '옥상에 도착했습니다. 여기서 규칙이 한눈에 들어옵니다 — 건물도 밤도 무광, 색을 운반하는 건 화면뿐입니다. Noir Metal은 그 따뜻함을 담아내는 검은 섀시 — 단 하나의 호박색 빛을 받아내는 그릇입니다.',
      ja: '屋上に到着しました。ここから規律が一望できる — 建物も夜もマット、色を運ぶのは画面だけ。Noir Metalは、その温もりを容れる黒のシャーシ — ただ一つの琥珀の光を受け止める器である。',
    },
    rooms: [
      { no: '6A', name: { en: 'Air Plant', ko: '공조실', ja: '空調室' }, meta: { en: 'sodium lamps · low', ko: '소듐 램프 · 약한 빛', ja: 'ナトリウムランプ · 微光' } },
      { no: '6B', name: { en: 'Antenna Forest', ko: '안테나 군', ja: 'アンテナ群' }, meta: { en: '36 dishes · steady', ko: '36개 · 안정', ja: '36基 · 安定' } },
      { no: '6C', name: { en: 'Observation', ko: '전망대', ja: '展望台' }, meta: { en: 'open to sky', ko: '하늘 개방', ja: '空に開放' } },
    ],
    ticker: {
      en: ['WIND · NE · 4.2 M/S', 'TEMP · 14°C', 'PARKED AT ROOF'],
      ko: ['바람 · 북동 · 4.2 m/s', '기온 · 14°C', '정차 · 옥상'],
      ja: ['風 · 北東 · 4.2 m/s', '気温 · 14°C', '停車 · 屋上'],
    },
  },
];

const SERVICE_FLOOR: Floor = {
  id: 'service',
  num: 'B1',
  ord: 0,
  name: { en: 'Service', ko: '서비스', ja: 'サービス' },
  kicker: { en: 'authorised access only', ko: '관계자 전용', ja: '関係者専用' },
  blurb: {
    en: 'Below the lobby. The control panel for the building itself — switches for fire service, inspection, lockout, and ventilation. Engaged only by an authorised key.',
    ko: '로비 아래층. 건물 자체를 다루는 컨트롤 패널 — 소방, 점검, 잠금, 환풍 스위치. 관계자 키로만 작동합니다.',
    ja: 'ロビーの直下。建物自体を扱う制御パネル — 消防、点検、ロック、換気のスイッチ。関係者のキーでのみ作動。',
  },
  rooms: [],
  ticker: {
    en: ['KEY IN USE · 02', 'INSPECTION DUE · 2026.06.01', 'VENTILATION · AUTO'],
    ko: ['키 사용 중 · 02', '점검 예정 · 2026.06.01', '환풍 · AUTO'],
    ja: ['キー使用中 · 02', '点検予定 · 2026.06.01', '換気 · AUTO'],
  },
};

const SERVICE_SWITCHES = [
  { id: 'fire', label: { en: 'Fire Service', ko: '소방',   ja: '消防' }, state: { en: 'OFF',  ko: 'OFF',  ja: 'OFF' },  pos: 'down' as const },
  { id: 'insp', label: { en: 'Inspection',   ko: '점검',   ja: '点検' }, state: { en: 'OFF',  ko: 'OFF',  ja: 'OFF' },  pos: 'down' as const },
  { id: 'key',  label: { en: 'Lockout',      ko: '잠금',   ja: 'ロック' }, state: { en: 'OFF',  ko: 'OFF',  ja: 'OFF' },  pos: 'down' as const },
  { id: 'fan',  label: { en: 'Ventilation',  ko: '환풍',   ja: '換気' }, state: { en: 'AUTO', ko: 'AUTO', ja: 'AUTO' }, pos: 'up'   as const },
];

const COPY = {
  brand:      'BRONZE & SODIUM CO.',
  car:        'ELEVATOR 01-B',
  title:      { en: 'Noir Metal — Service Plate', ko: 'Noir Metal — 서비스 플레이트', ja: 'Noir Metal — サービスプレート' },
  ride:       { en: 'IN MOTION', ko: '운행 중', ja: '運行中' },
  idle:       { en: 'AT FLOOR',  ko: '층 정차', ja: '階停車' },
  rail:       { en: 'CALL', ko: '호출', ja: '呼出' },
  service:    { en: 'Service Panel', ko: '서비스 패널', ja: 'サービス・パネル' },
  serviceSub: { en: 'authorised access only', ko: '관계자 전용', ja: '関係者専用' },
  ridingTo:   { en: 'RIDING TO', ko: '이동 중', ja: '移動先' },
  arrived:    { en: 'ARRIVED', ko: '도착', ja: '到着' },
  rooms:      { en: 'DIRECTORY', ko: '안내', ja: '案内' },
  ticker:     { en: 'LIVE FROM THIS FLOOR', ko: '이 층의 실시간', ja: 'この階のライブ' },
  guide:      { en: 'SCROLL TO RIDE · PRESS A FLOOR TO CALL', ko: '스크롤하여 운행 · 층 번호를 눌러 호출', ja: 'スクロールで運行 · 階番号で呼出' },
  manualA:    { en: 'A · NEUMORPHISM — the elevator stays matte. No borders, only depth.', ko: 'A · NEUMORPHISM — 엘리베이터는 무광 그대로. 테두리 없이, 깊이만으로.', ja: 'A · NEUMORPHISM — エレベーターはマットのまま。罫線なく、深さのみで。' },
  manualB:    { en: 'B · CYBERPUNK GLITCH — neon is sealed behind LCD glass. Scanlines, sub-pixel RGB offset, fast counters.', ko: 'B · CYBERPUNK GLITCH — 네온은 LCD 유리 안에 봉인됩니다. 스캔라인, 1픽셀 RGB 오프셋, 빠른 카운터.', ja: 'B · CYBERPUNK GLITCH — ネオンはLCDガラスの内側に封印される。スキャンライン、1pxのRGBオフセット、速いカウンタ。' },
  manualC:    { en: 'The chassis stays matte. Only the screens carry colour.', ko: '섀시는 무광 그대로. 색은 오직 화면에만.', ja: 'シャーシはマットのまま。色は画面の中だけに。' },
  clockLabel: { en: 'KEY · 02', ko: '키 · 02', ja: 'キー · 02' },
} as const;

const ALL_FLOORS = [...FLOORS, SERVICE_FLOOR];

const promptEn = `Design a single-page elevator service plate in Hardware Glitch fusion: the page IS the freight-elevator control panel of a brass-and-sodium building. Every physical element — call buttons, floor plaques, service switches — is calmly embossed in oil-rubbed bronze. Only the LCD readouts leak sodium amber and a sub-pixel cool-teal glitch.

PARENTS:
Neumorphism brings the chassis: one continuous matte bronze base, inset/outset shadows on buttons, plaques, switches. No borders — only depth.
Cyberpunk Glitch brings the screens: scanlines, sub-pixel RGB offset, fast counters. Glitch is contained to the LCD rectangles.

DISCIPLINE:
1) Outside the LCDs: zero neon. Brass letterforms are engraved (text-shadow inset), never glowing.
2) Inside the LCDs: scanlines + 1px sub-pixel RGB offset + slow horizontal scan + a juddered floor digit during scroll transitions.
3) Two accent colours total: sodium amber (#ffb02e — primary) and cool teal (#3ce0c4 — secondary, <5% area). Both live ONLY inside LCD rectangles and around the active call button.
4) No glow on buttons or plaques. Glow earns its place by sitting on a screen.

TOKENS:
--chassis #1a1612  --chassis-up #2a221b  --chassis-down #0b0907
--brass #c89a5b  --brass-soft #836037
--ink #d8cdb8  --ink-mute #7a6f5e
--lcd-bg #050402
--neon-a #ffb02e (sodium amber) — primary
--neon-b #3ce0c4 (cool teal) — secondary, glitch offset only

TYPOGRAPHY:
Chassis chrome: Inter 500-600, 11-13 px, tracking 0.18-0.32 em uppercase for labels.
Floor plaques + display headlines: Georgia/serif at 32-80 px (engraved via text-shadow).
LCD readouts: Share Tech Mono / JetBrains Mono with tabular numerals.

LAYOUT (single page, vertical scroll = elevator ride):
1) Header — brand left, ride instruction right (engraved on bronze).
2) Sticky LCD floor counter (centre, top). Sodium-amber 7-segment numeral. Judders between floor numbers during scroll: RGB offset jumps from 1px to 3px, digit shows random garbage chars for ~400ms, then settles.
3) Right-rail call panel — round embossed brass buttons in a vertical column, one per floor. Highest floor at the top of the rail. Active button shows a 2px neon-a ring + amber-tinted numeral. B1 sits below a thin divider.
4) Floor sections (01 LOBBY → 06 ROOFTOP, then B1 SERVICE). Each floor has a bronze plaque (huge engraved numeral + serif name + small LCD ticker), a serif blurb max 64ch, and an engraved directory of "rooms".
5) Service panel (B1) — three brass toggle switches (FIRE / INSP / KEY HOLD / CAR FAN) and an LCD timestamp.

INTERACTIONS:
· Scroll: IntersectionObserver detects floor in the centre band; on change, trigger a glitch on the LCD counter (~400ms, RGB split + garbage chars), then settle.
· Click a rail button: smooth-scroll to that floor and trigger the same judder.
· Reduced motion: skip the judder; switch immediately.

MOTION:
LCD horizontal scan 6s ease-in-out alternate (slow). RGB offset 1px static during idle; 3px + jitter during transition. No motion on the chassis. prefers-reduced-motion freezes scan and skips judder.

OUTPUT:
1) Tokens listed above as CSS variables.
2) Sections 1–5 in a single elevator service plate.
3) Mobile: rail collapses to a horizontal sticky strip below the counter; floor sections stack vertically.`;

const promptKo = `Hardware Glitch 퓨전 — 페이지 자체가 *황동과 소듐의 빌딩에 설치된 화물용 엘리베이터 컨트롤 패널*입니다. 호출 버튼, 층 명패, 서비스 스위치 등 모든 물리 요소는 오일러브드 브론즈로 차분히 엠보싱되어 있고, *LCD 표시창*에서만 소듐 앰버와 픽셀 단위 쿨 틸 글리치가 새어 나옵니다.

부모:
Neumorphism = 섀시 — 하나의 매트 브론즈 베이스, 버튼·명패·스위치의 음각/양각 그림자. 테두리 금지, 깊이만.
Cyberpunk Glitch = 화면 — 스캔라인, 픽셀 단위 RGB 오프셋, 빠른 카운터. *LCD 사각형 안에서만* 살아 움직인다.

규율:
1) LCD 밖에는 네온 0. 브라스 글자는 음각(inset text-shadow), 절대 빛나지 않음.
2) LCD 안에는 스캔라인 + 1px RGB 오프셋 + 느린 가로 스캔 + 스크롤 전환 시 디지트 떨림.
3) 액센트는 총 2색: 소듐 앰버(#ffb02e, 프라이머리)와 쿨 틸(#3ce0c4, 세컨더리, 면적 5% 이하). 둘 다 *LCD 사각형 / 활성 호출 버튼 주변*에만.
4) 버튼·명패는 절대 빛나지 않음. 빛은 화면 위에서만 자격을 얻는다.

토큰:
--chassis #1a1612  --chassis-up #2a221b  --chassis-down #0b0907
--brass #c89a5b  --brass-soft #836037
--ink #d8cdb8  --ink-mute #7a6f5e
--lcd-bg #050402
--neon-a #ffb02e (소듐 앰버) — 프라이머리
--neon-b #3ce0c4 (쿨 틸) — 세컨더리, 글리치 오프셋 전용

타이포: 섀시는 Inter 500-600, 11-13 px, 라벨은 대문자 자간 0.18-0.32em. 층 명패·디스플레이는 Georgia 계열 세리프 32-80 px(text-shadow로 음각 표현). LCD는 Share Tech Mono / JetBrains Mono, 탭ular numerals.

레이아웃 (단일 페이지, 세로 스크롤 = 엘리베이터 운행):
1) 헤더 — 좌측 브랜드, 우측 운행 안내(브론즈에 음각).
2) 상단 중앙에 sticky LCD 층 카운터. 소듐 앰버 7-segment 숫자. 스크롤로 층이 바뀌면 ~400ms 동안 RGB 오프셋이 1px에서 3px로 튀고, 무작위 글리치 문자가 잠시 표시된 뒤 정착.
3) 우측 레일 호출 패널 — 세로 컬럼의 둥근 엠보싱 브라스 버튼, 층당 하나. 최상층(06)이 레일 위, 최하층(01)이 아래. 활성 버튼은 2px neon-a 링 + 앰버 색 숫자. B1은 가는 디바이더 아래 분리 배치.
4) 층 섹션(01 LOBBY → 06 ROOFTOP, 마지막 B1 SERVICE). 각 층: 청동 명패(큰 음각 숫자 + 세리프 이름 + 작은 LCD 티커) + 64ch 이하의 세리프 블러브 + 음각 청동 명패로 표기된 "객실" 디렉터리.
5) 서비스 패널(B1) — 세 개의 브라스 토글 스위치(소방/점검/키 홀드/카 팬) + LCD 타임스탬프.

인터랙션:
· 스크롤: IntersectionObserver로 뷰포트 중앙 밴드의 층 감지 → LCD 카운터에서 ~400ms 글리치 전환(RGB 분리 + 글리치 문자) → 새 숫자 정착.
· 레일 버튼 클릭: 해당 층으로 부드럽게 스크롤 + 동일한 떨림 트리거.
· reduced-motion이면 떨림 생략, 즉시 전환.

모션: LCD 가로 스캔 6s ease-in-out 무한 alternate. RGB 오프셋은 정적일 때 1px, 전환 중에는 3px + 떨림. 섀시에는 모션 없음. prefers-reduced-motion이면 스캔 정지 + 떨림 생략.

출력:
1) 위 토큰을 CSS 변수로.
2) 섹션 1–5를 단일 엘리베이터 서비스 플레이트로.
3) 모바일: 레일은 카운터 아래 가로 sticky 스트립으로 접힘. 층 섹션은 세로로 쌓임.`;

const promptJa = `Hardware Glitchフュージョン — ページ自体が*ブロンズとナトリウムの建物に設置された貨物用エレベーターのコントロールパネル*。呼出ボタン、フロアプラーク、サービス・スイッチ — すべての物理要素はオイルラブド・ブロンズで静かにエンボスされ、*LCD表示窓*だけがソジウム琥珀とサブピクセルのクール・ティール・グリッチを漏らす。

親:
Neumorphism = シャーシ — 一枚の連続したマット・ブロンズ・ベース、ボタン・プラーク・スイッチの凹凸の影。罫線禁止、深さのみ。
Cyberpunk Glitch = 画面 — スキャンライン、サブピクセルRGBオフセット、速いカウンタ。*LCDの長方形の内側でだけ*生きる。

規律:
1) LCDの外にネオン0。ブラスの文字は刻印(inset text-shadow)、決して光らない。
2) LCDの内側にスキャンライン+1pxサブピクセルRGBオフセット+ゆっくりの横スキャン+スクロール遷移時のディジット震え。
3) アクセントは合計2色: ソジウム琥珀(#ffb02e、プライマリ)とクール・ティール(#3ce0c4、セカンダリ、面積5%以下)。両方とも*LCDの長方形/アクティブな呼出ボタン周辺*のみ。
4) ボタン・プラークは絶対に光らない。光は画面の上でだけ資格を得る。

トークン:
--chassis #1a1612  --chassis-up #2a221b  --chassis-down #0b0907
--brass #c89a5b  --brass-soft #836037
--ink #d8cdb8  --ink-mute #7a6f5e
--lcd-bg #050402
--neon-a #ffb02e (ソジウム琥珀) — プライマリ
--neon-b #3ce0c4 (クール・ティール) — セカンダリ、グリッチ・オフセット専用

タイポ: シャーシはInter 500-600、11-13 px、ラベルは大文字字間0.18-0.32em。フロアプラーク・ディスプレイはGeorgia系セリフ32-80 px(text-shadowで刻印表現)。LCDはShare Tech Mono / JetBrains Mono、tabular numerals。

レイアウト(単一ページ、縦スクロール=エレベーター運行):
1) ヘッダー — 左にブランド、右に運行案内(ブロンズに刻印)。
2) 上部中央にsticky LCDフロアカウンタ。ソジウム琥珀の7-segment数字。スクロールでフロアが変わると~400ms間、RGBオフセットが1pxから3pxに跳ね、ランダム・グリッチ文字を経由してから定着。
3) 右レール呼出パネル — 縦コラムの丸いエンボス・ブラス・ボタン、階ごとに一つ。最上階(06)がレールの上、最下階(01)が下。アクティブは2px neon-aリング+琥珀色の数字。B1は細いディバイダーの下に分離配置。
4) フロアセクション(01 LOBBY → 06 ROOFTOP、最後にB1 SERVICE)。各フロア: 青銅プラーク(大きな刻印数字+セリフ名+小さなLCDティッカー)+64ch以下のセリフ文+刻印青銅プレートの「客室」ディレクトリ。
5) サービス・パネル(B1) — 三つのブラス・トグル・スイッチ(消防/点検/キー固定/カーファン)+LCDタイムスタンプ。

インタラクション:
· スクロール: IntersectionObserverでビューポート中央バンドのフロアを検出 → LCDカウンタで~400msグリッチ遷移(RGB分離+グリッチ文字)→ 新しい数字に定着。
· レール・ボタン・クリック: 該当フロアへスムーズ・スクロール+同じ震えをトリガー。
· prefers-reduced-motion: 震えを省略、即時切替。

モーション: LCD横スキャン6s ease-in-out無限alternate。RGBオフセットは静止時1px、遷移中3px+震え。シャーシにモーションなし。prefers-reduced-motionでスキャン停止+震え省略。

出力:
1) 上記トークンをCSS変数で。
2) セクション1–5を単一エレベーター・サービス・プレートで。
3) モバイル: レールはカウンター直下の横stickyストリップに畳まれ、フロアセクションは縦に積まれる。`;

// Page reading order: top of the page is the TOP of the building (06     */
// ROOFTOP) — so scrolling DOWN takes you DOWN through the floors, which   */
// matches the rail (06 at top of rail, 01 below it). Pressing the highest */
// floor button now actually moves you upward. B1 SERVICE sits at the very */
// bottom of the page below the lobby (a real basement).                   */
const STACK_FLOORS = [...FLOORS].sort((a, b) => b.ord - a.ord);
const TOP_FLOOR = STACK_FLOORS[0];

// Per-floor visual anchor — a single environmental element that gives the
// floor its own room. Type and palette stay constant; only the surrounding
// chassis "breathes" the floor's concept.
// Each floor's "anchor" is now a real photograph of its room (loaded as a
// CSS background-image by [data-floor-id]). The component renders only a
// small mono stamp label so each floor still has its functional caption.
const FLOOR_STAMP: Record<string, string> = {
  rooftop:  'ALT · 1247 FT · 41°N 28°E',
  studio:   'PROOF · 1947 · PLATE 06',
  stage:    'CURTAIN · 19:30',
  archives: 'VOL 04 · REEL 0271',
  mail:     'CANCELED · 2026.05.16',
  lobby:    'DOORS OPEN · 08:00',
};
function FloorAnchor({ kind }: { kind: string }) {
  const stamp = FLOOR_STAMP[kind];
  if (!stamp) return null;
  return (
    <div className="lift-floor__anchor" data-anchor={kind} aria-hidden="true">
      <span className="lift-anchor__stamp">{stamp}</span>
    </div>
  );
}

export function PortedFusionNoirMetalPage({ lang }: PortedStylePageProps) {
  const lng = lang as Lang;
  const [active, setActive] = useState<string>(TOP_FLOOR.id);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down' | 'idle'>('idle');
  const [displayNum, setDisplayNum] = useState<string>(TOP_FLOOR.num);
  const [tickerIdx, setTickerIdx] = useState<number>(0);
  const [doorsOpen, setDoorsOpen] = useState<boolean>(false);
  const [transitionPath, setTransitionPath] = useState<string[]>([]);
  const floorRefs = useRef<Record<string, HTMLElement | null>>({});
  const judderTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevOrdRef = useRef<number>(TOP_FLOOR.ord);

  const activeFloor = ALL_FLOORS.find((f) => f.id === active) ?? TOP_FLOOR;

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length === 0) return;
        intersecting.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = (intersecting[0].target as HTMLElement).dataset.floorId;
        if (!id) return;
        setActive((prev) => {
          if (prev === id) return prev;
          const nextFloor = ALL_FLOORS.find((f) => f.id === id);
          if (nextFloor) {
            const prevOrd = prevOrdRef.current;
            const newOrd = nextFloor.ord;
            setDirection(newOrd > prevOrd ? 'up' : 'down');

            // build the slot-machine path: every floor numeral between the
            // previous active and the new active, in order. Going up counts
            // upward (03, 04, 05, 06); going down counts downward.
            const path: string[] = [];
            if (newOrd > prevOrd) {
              for (let o = prevOrd + 1; o <= newOrd; o++) {
                const f = ALL_FLOORS.find((x) => x.ord === o);
                if (f) path.push(f.num);
              }
            } else if (newOrd < prevOrd) {
              for (let o = prevOrd - 1; o >= newOrd; o--) {
                const f = ALL_FLOORS.find((x) => x.ord === o);
                if (f) path.push(f.num);
              }
            }
            setTransitionPath(path);
            prevOrdRef.current = newOrd;
          }
          setTransitioning(true);
          return id;
        });
      },
      {
        rootMargin: '-32% 0px -42% 0px',
        threshold: [0.01, 0.25, 0.6],
      },
    );
    Object.values(floorRefs.current).forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // Doors-opening intro animation. On mount, two brass slabs slide apart
  // to reveal the page — the building literally opens for you. Skipped
  // when prefers-reduced-motion is set.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const t = setTimeout(() => setDoorsOpen(true), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDoorsOpen(true), 120);
    return () => clearTimeout(t);
  }, []);

  // Initial positioning: on first paint, scroll the page down to the
  // rooftop floor so the hero shows up immediately ("the doors opened
  // at the top floor"). After that, scroll is unrestricted — no snap
  // type, so the user can scroll back up to expose the page header
  // without being pulled back down.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const delay = reduced ? 80 : 320;
    const t = setTimeout(() => {
      const rooftop = floorRefs.current.rooftop;
      if (rooftop) {
        rooftop.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, delay);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (judderTimeout.current) clearTimeout(judderTimeout.current);

    const reduced = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!transitioning || reduced || transitionPath.length === 0) {
      const t = setTimeout(() => {
        setDisplayNum(activeFloor.num);
        setTransitioning(false);
      }, 0);
      return () => clearTimeout(t);
    }

    // Slot-machine: walk through every intermediate floor numeral on the
    // path from previous to current, ~220ms per floor.
    const path = transitionPath;
    let step = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      if (step < path.length - 1) {
        setDisplayNum(path[step]);
        step += 1;
        judderTimeout.current = setTimeout(tick, 220);
      } else {
        setDisplayNum(activeFloor.num);
        setTransitioning(false);
      }
    };
    judderTimeout.current = setTimeout(() => {
      if (cancelled) return;
      setDisplayNum(path[0]);
      judderTimeout.current = setTimeout(tick, 220);
    }, 0);

    return () => {
      cancelled = true;
      if (judderTimeout.current) clearTimeout(judderTimeout.current);
    };
  }, [transitioning, activeFloor.num, transitionPath]);

  // Reset direction to idle a beat after settling so the arrow goes neutral.
  useEffect(() => {
    if (transitioning) return;
    const t = setTimeout(() => setDirection('idle'), 900);
    return () => clearTimeout(t);
  }, [transitioning, active]);

  useEffect(() => {
    const t = setInterval(() => setTickerIdx((i) => i + 1), 2400);
    return () => clearInterval(t);
  }, []);

  const callFloor = (id: string) => {
    const el = floorRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const railFloors = useMemo(() => [...ALL_FLOORS].sort((a, b) => b.ord - a.ord), []);

  const clock = '2026.05.16 · 10:24';

  return (
    <FusionShell
      fusionId="fusion-noir-metal"
      lang={lang}
      prev={{ href: '/pages/fusion-floppy-exe.html', label: 'Floppy.exe' }}
      next={{ href: '/pages/fusion-strict-console.html', label: 'Strict Console' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
    >
      <div
        className="lift-shell"
        data-transition={transitioning ? 'on' : 'off'}
        data-direction={direction}
        data-doors={doorsOpen ? 'open' : 'closed'}
      >
        <div className="lift-doors" aria-hidden="true">
          <div className="lift-doors__leaf lift-doors__leaf--l">
            <span className="lift-doors__seam" />
            <span className="lift-doors__handle" />
          </div>
          <div className="lift-doors__leaf lift-doors__leaf--r">
            <span className="lift-doors__seam" />
            <span className="lift-doors__handle" />
          </div>
        </div>
        <header className="lift-head">
          <div className="lift-head__brand">
            <span className="lift-head__chip" aria-hidden="true" />
            <strong>{COPY.brand}</strong>
            <span className="lift-head__sub">{COPY.car} · {L(COPY.title, lng)}</span>
          </div>
          <p className="lift-head__guide">{L(COPY.guide, lng)}</p>
        </header>

        <div className="lift-board">
          <main className="lift-main">

            <div className="lift-stack">
              {STACK_FLOORS.map((floor, i) => {
                const tickers = floor.ticker[lng];
                const tickerText = tickers[tickerIdx % tickers.length];
                const isHero = i === 0;
                return (
                  <article
                    key={floor.id}
                    ref={(el) => { floorRefs.current[floor.id] = el; }}
                    data-floor-id={floor.id}
                    data-active={floor.id === active}
                    data-hero={isHero ? 'true' : undefined}
                    className="lift-floor"
                  >
                    <FloorAnchor kind={floor.id} />
                    <header className="lift-floor__head">
                      <span className="lift-floor__num" aria-hidden="true">{floor.num}</span>
                      <span className="lift-floor__rule" aria-hidden="true" />
                      <span className="lift-floor__kicker">{L(floor.kicker, lng)}</span>
                    </header>

                    <h2 className="lift-floor__name">{L(floor.name, lng)}</h2>

                    <div className="lift-floor__body">
                      <p className="lift-floor__blurb">{L(floor.blurb, lng)}</p>
                      <aside className="lift-floor__ticker" aria-label={L(COPY.ticker, lng)}>
                        <span className="lift-floor__ticker-label">{L(COPY.ticker, lng)}</span>
                        <span className="lift-floor__ticker-screen">
                          <span className="lift-floor__ticker-text" data-text={tickerText}>{tickerText}</span>
                          <span className="lift-floor__ticker-scan" aria-hidden="true" />
                        </span>
                      </aside>
                    </div>

                    <footer className="lift-floor__rooms">
                      <span className="lift-floor__rooms-label">{L(COPY.rooms, lng)}</span>
                      <span className="lift-floor__rooms-list">
                        {floor.rooms.map((room, ri) => (
                          <span key={room.no} className="lift-floor__room">
                            <em className="lift-floor__room-no">{room.no}</em>
                            <span className="lift-floor__room-name">{L(room.name, lng)}</span>
                            {ri < floor.rooms.length - 1 ? (
                              <span className="lift-floor__room-sep" aria-hidden="true">·</span>
                            ) : null}
                          </span>
                        ))}
                      </span>
                    </footer>
                  </article>
                );
              })}
            </div>

            <footer
              className="lift-service"
              ref={(el) => { floorRefs.current[SERVICE_FLOOR.id] = el; }}
              data-floor-id={SERVICE_FLOOR.id}
              data-active={active === SERVICE_FLOOR.id}
            >
              <header className="lift-service__head">
                <div>
                  <span className="lift-service__num">B1</span>
                  <h3>{L(COPY.service, lng)}</h3>
                  <p>{L(COPY.serviceSub, lng)}</p>
                </div>
                <div className="lift-service__clock">
                  <span className="lift-service__clock-label">{L(COPY.clockLabel, lng)}</span>
                  <span className="lift-service__clock-lcd">
                    <span className="lift-service__clock-text" data-text={clock}>{clock}</span>
                    <span className="lift-service__clock-scan" aria-hidden="true" />
                  </span>
                </div>
              </header>
              <ul className="lift-service__switches">
                {SERVICE_SWITCHES.map((sw) => (
                  <li key={sw.id} className="lift-service__switch">
                    <span className="lift-service__switch-toggle" data-pos={sw.pos} aria-hidden="true">
                      <span className="lift-service__switch-stem" />
                      <span className="lift-service__switch-hub" />
                    </span>
                    <span className="lift-service__switch-label">{L(sw.label, lng)}</span>
                    <span className="lift-service__switch-state">{L(sw.state, lng)}</span>
                  </li>
                ))}
              </ul>
              <p className="lift-service__manual">
                <span>{L(COPY.manualA, lng)}</span>
                <span>{L(COPY.manualB, lng)}</span>
                <span className="lift-service__rule">{L(COPY.manualC, lng)}</span>
              </p>
            </footer>
          </main>

          <aside className="lift-rail" aria-label="Floor selector">
            <div className="lift-counter" role="status" aria-live="polite">
              <div className="lift-counter__plate">
                <div className="lift-counter__lcd">
                  <span
                    className="lift-counter__arrow"
                    aria-hidden="true"
                    data-dir={transitioning ? direction : 'idle'}
                  >
                    {direction === 'down' ? '▼' : '▲'}
                  </span>
                  <span className="lift-counter__digit" data-text={displayNum}>{displayNum}</span>
                  <span className="lift-counter__scan" aria-hidden="true" />
                </div>
                <span className="lift-counter__meta">{L(activeFloor.name, lng)}</span>
              </div>
            </div>
            <header className="lift-rail__head">
              <span className="lift-rail__head-label">{L(COPY.rail, lng)}</span>
              <span className="lift-rail__head-rule" aria-hidden="true" />
            </header>
            <ul className="lift-rail__buttons">
              {railFloors.map((floor, i) => {
                const isActive = floor.id === active;
                const showDivider = i > 0 && railFloors[i - 1].ord > 0 && floor.ord === 0;
                return (
                  <li key={floor.id} className={showDivider ? 'lift-rail__sep' : ''}>
                    <button
                      type="button"
                      className={`lift-rail__btn ${isActive ? 'is-active' : ''}`}
                      onClick={() => callFloor(floor.id)}
                      aria-label={`Call ${floor.num} — ${floor.name.en}`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className="lift-rail__btn-num">{floor.num}</span>
                      <span className="lift-rail__btn-ring" aria-hidden="true" />
                      <span className="lift-rail__btn-glow" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </FusionShell>
  );
}
