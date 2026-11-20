import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFramerMotionPage.css';

// One real page in the Framer Motion style: the site of Loop & Lag, a four-person
// motion studio in Berlin. The studio's name is its first piece of motion (its weight
// runs from hairline to heavy on load, over its own time ruler). Each case is laid out
// like a motion editor: a viewer playing the real piece, a timeline of six keyframes
// with a playhead, and an inspector with duration, curve, frame count and layers.
// Unbounded sets the name and headings, Onest the reading text and every figure.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;
type CaseId = 'saldo' | 'kanal' | 'westhafen';
type Bezier = [number, number, number, number];

const STUDIO = {
  mail: 'studio@loopandlag.de',
  phone: '+49 30 6098 4172',
};

const COPY = {
  nav: { en: 'On this page', ko: '페이지 내 메뉴', ja: 'このページ内' },
  navWork: { en: 'Work', ko: '작업', ja: '制作実績' },
  navClients: { en: 'Clients', ko: '클라이언트', ja: 'クライアント' },
  navContact: { en: 'Contact', ko: '문의', ja: 'お問い合わせ' },
  // {time} is the studio's local time, filled in live.
  local: { en: '{time} in Berlin', ko: '베를린 시간 {time}', ja: 'ベルリン時間 {time}' },
  lede: {
    en: 'Four people in a courtyard studio in Neukölln. We animate banking apps, live sport graphics and museum screens, and hand over files that developers and broadcast engineers can use as they are.',
    ko: '노이쾰른의 안뜰 스튜디오에서 일하는 네 명입니다. 뱅킹 앱, 생중계 스포츠 그래픽, 박물관 화면을 애니메이션으로 만들고, 개발자와 방송 엔지니어가 그대로 쓸 수 있는 파일을 전달합니다.',
    ja: 'ノイケルンの中庭にあるスタジオで働く4人のチームです。バンキングアプリ、生中継のスポーツグラフィック、美術館の画面をアニメーションにし、開発者と放送エンジニアがそのまま使えるファイルをお渡しします。',
  },
  booking: { en: 'Booking from March 2027', ko: '2027년 3월부터 예약 접수', ja: '2027年3月から受付' },
  workTitle: { en: 'Recent work', ko: '최근 작업', ja: '最近の制作実績' },
  // {rate} is replaced by the slowest speed, set in figures.
  workLede: {
    en: 'Three pieces from 2025 and 2026, running live. Set the speed to {rate} to watch each curve.',
    ko: '2025년과 2026년 작품 세 편을 실제로 재생합니다. 속도를 {rate}로 맞추면 각 곡선을 천천히 볼 수 있습니다.',
    ja: '2025年と2026年の作品を3本、実際に再生しています。速度を{rate}に合わせると、それぞれの曲線をゆっくり見られます。',
  },
  workLedeStill: {
    en: 'Three pieces from 2025 and 2026. Each viewer holds one frame, and the six keyframes under it show the rest of the move.',
    ko: '2025년과 2026년 작품 세 편입니다. 각 뷰어는 한 프레임에서 멈춰 있고, 아래의 키프레임 여섯 장이 나머지 움직임을 보여 줍니다.',
    ja: '2025年と2026年の作品を3本掲載しています。各ビューアーは1コマで止まっており、その下の6つのキーフレームで残りの動きを示しています。',
  },
  playback: { en: 'Playback', ko: '재생 컨트롤', ja: '再生コントロール' },
  pause: { en: 'Pause', ko: '일시정지', ja: '一時停止' },
  play: { en: 'Play', ko: '재생', ja: '再生' },
  speed: { en: 'Speed', ko: '속도', ja: '速度' },
  // The viewer is a toggle button: pressed means it is the selected scene.
  viewer: { en: '{client} scene', ko: '{client} 장면', ja: '{client}のシーン' },
  keyframes: { en: 'Keyframes', ko: '키프레임', ja: 'キーフレーム' },
  duration: { en: 'Duration', ko: '길이', ja: '長さ' },
  easing: { en: 'Easing', ko: '이징', ja: 'イージング' },
  frames: { en: 'Frames', ko: '프레임 수', ja: 'フレーム数' },
  fps: { en: 'at {fps} fps', ko: '· {fps} fps 기준', ja: '（毎秒{fps}フレーム）' },
  layers: { en: 'Layers', ko: '레이어', ja: 'レイヤー' },
  clientsTitle: { en: 'Clients', ko: '클라이언트', ja: 'クライアント' },
  clientsLede: {
    en: 'Ten clients since 2024. Seven of them have come back for a second project.',
    ko: '2024년 이후 클라이언트 열 곳과 일했습니다. 그중 일곱 곳이 두 번째 프로젝트를 다시 맡겼습니다.',
    ja: '2024年以降、10社のクライアントと仕事をしてきました。そのうち7社が2本目のプロジェクトでも依頼してくださいました。',
  },
  contactTitle: { en: 'Start a project', ko: '프로젝트 문의', ja: 'プロジェクトのご相談' },
  team: { en: 'The studio', ko: '스튜디오 구성원', ja: 'スタジオメンバー' },
  footer: { en: 'Loop & Lag GmbH, Berlin', ko: 'Loop & Lag GmbH, Berlin', ja: 'Loop & Lag GmbH, Berlin' },
  register: {
    en: 'Commercial register Berlin, HRB 241907 B',
    ko: '베를린 상업등기부 HRB 241907 B',
    ja: 'ベルリン商業登記簿 HRB 241907 B',
  },
} satisfies Record<string, Tri>;

// Text drawn inside the scenes. The scenes are drawings and hidden from assistive
// technology; every line of their text is repeated in each case's layer list.
const SALDO = {
  steps: [
    { en: 'Step 1 of 3', ko: '1/3단계', ja: 'ステップ 1/3' },
    { en: 'Step 2 of 3', ko: '2/3단계', ja: 'ステップ 2/3' },
    { en: 'Step 3 of 3', ko: '3/3단계', ja: 'ステップ 3/3' },
  ],
  address: { en: 'Your name and address', ko: '이름과 주소', ja: 'お名前とご住所' },
  photo: { en: 'A photo of your ID', ko: '신분증 사진', ja: '身分証の写真' },
  pin: { en: 'Choose a PIN', ko: 'PIN 번호 설정', ja: 'PINを設定' },
  next: { en: 'Continue', ko: '계속', ja: '次へ' },
  done: { en: 'On its way, arrives Thursday', ko: '발송됨, 목요일 도착 예정', ja: '発送済み、木曜日に到着予定' },
  name: 'Lena Hoffmann',
  street: 'Pannierstraße 12, Berlin',
  card: 'Saldo',
  digits: '4821',
} as const;

const KANAL = {
  role: { en: 'Left back, SG Förde Kiel', ko: '레프트백, SG Förde Kiel', ja: 'レフトバック、SG Förde Kiel' },
  stat: { en: '6 goals from 7 shots', ko: '7개 슛에서 6골', ja: '7本のシュートから6得点' },
  player: 'Jonas Wilke',
  shirt: '7',
  clock: '51:14',
} as const;

const WESTHAFEN = {
  here: { en: 'Level 1', ko: '1층', ja: '1階' },
  hall: { en: 'Hall C', ko: 'C홀', ja: 'Cホール' },
  hallWhat: { en: 'Textiles and dye', ko: '섬유와 염색', ja: '繊維と染色' },
  hallWay: { en: '40 m, about a minute', ko: '40m, 약 1분', ja: '40m、徒歩約1分' },
  up: { en: 'Level 2', ko: '2층', ja: '2階' },
  upWhat: { en: 'Café and library', ko: '카페와 도서관', ja: 'カフェと図書館' },
  upWay: { en: 'Stairs in 15 m', ko: '15m 앞 계단', ja: '15m先に階段' },
  clock: '11:04',
} as const;

interface Layer {
  text: Tri;
  from: number;
  to: number;
}

interface Case {
  id: CaseId;
  client: string;
  year: string;
  piece: Tri;
  desc: Tri;
  /** Length of one loop in ms. */
  dur: number;
  ease: Bezier;
  fps: number;
  /** The still frame shown with reduced motion, in ms. */
  rest: number;
  layers: Layer[];
}

// In and out times come from the scenes' keyframes in the stylesheet, at the case's duration.
const CASES: Case[] = [
  {
    id: 'saldo',
    client: 'Saldo Bank',
    year: '2026',
    piece: { en: 'Account opening in the app, iOS and Android', ko: '앱에서 하는 계좌 개설, iOS와 Android', ja: 'アプリの口座開設、iOS・Android' },
    desc: {
      en: 'New customers pass three steps, from their address to a PIN. Each finished step flicks off to the left and the next one rises from the stack, so nobody loses their place. The new card lands last, with its delivery day.',
      ko: '신규 고객은 주소 입력부터 PIN 설정까지 세 단계를 거칩니다. 완료된 단계는 왼쪽으로 밀려 나가고 다음 단계가 스택에서 올라오므로, 누구도 진행 위치를 잃지 않습니다. 새 카드는 마지막에 배송일과 함께 나타납니다.',
      ja: '新規のお客様は、ご住所の入力からPINの設定まで3つのステップを進みます。完了したステップは左へ流れて消え、次のステップが重なりの下から上がってくるため、現在地を見失うことはありません。新しいカードは最後に、配達日と一緒に現れます。',
    },
    dur: 2400,
    ease: [0.32, 0.72, 0, 1],
    fps: 60,
    rest: 0,
    layers: [
      {
        text: {
          en: 'Step 1 of 3, Your name and address, filled in with Lena Hoffmann, Pannierstraße 12, Berlin',
          ko: '1/3단계, 이름과 주소, Lena Hoffmann, Pannierstraße 12, Berlin 입력 완료',
          ja: 'ステップ 1/3、お名前とご住所、Lena Hoffmann、Pannierstraße 12, Berlin を入力済み',
        },
        from: 0,
        to: 620,
      },
      { text: { en: 'Step 2 of 3, A photo of your ID', ko: '2/3단계, 신분증 사진', ja: 'ステップ 2/3、身分証の写真' }, from: 0, to: 1420 },
      { text: { en: 'Step 3 of 3, Choose a PIN', ko: '3/3단계, PIN 번호 설정', ja: 'ステップ 3/3、PINを設定' }, from: 0, to: 1780 },
      { text: { en: 'The Saldo card, ending 4821', ko: 'Saldo 카드, 끝자리 4821', ja: 'Saldoカード、末尾4821' }, from: 1540, to: 2400 },
      { text: SALDO.done, from: 1730, to: 2330 },
    ],
  },
  {
    id: 'kanal',
    client: 'Kanal 8 Sport',
    year: '2025',
    piece: { en: 'Lower thirds for live handball', ko: '생중계 핸드볼 하단 자막', ja: '生中継ハンドボールの下段テロップ' },
    desc: {
      en: 'Player names for 34 league matches a season. The plate has to be readable within 400 ms, because the director can cut to a replay at any moment. After two seconds the second line turns into a match stat.',
      ko: '시즌 리그 경기 34경기에 쓰이는 선수 이름 자막입니다. 연출자가 언제든 리플레이로 전환할 수 있으므로 자막은 400ms 안에 읽혀야 합니다. 2초가 지나면 둘째 줄이 경기 기록으로 바뀝니다.',
      ja: '1シーズンのリーグ戦34試合で使われる選手名のテロップです。ディレクターはいつでもリプレイに切り替えるため、400ms以内に読めなければなりません。2秒後、2行目が試合の記録に切り替わります。',
    },
    dur: 3000,
    ease: [0.16, 1, 0.3, 1],
    fps: 50,
    rest: 1500,
    layers: [
      { text: { en: 'Score: Kiel 24, Flensburg 22, at 51:14', ko: '스코어: Kiel 24, Flensburg 22, 51:14 시점', ja: 'スコア: Kiel 24、Flensburg 22、51:14 時点' }, from: 0, to: 3000 },
      { text: { en: 'Shirt number 7', ko: '등번호 7', ja: '背番号 7' }, from: 90, to: 2820 },
      { text: { en: 'Jonas Wilke', ko: 'Jonas Wilke', ja: 'Jonas Wilke' }, from: 240, to: 2730 },
      { text: KANAL.role, from: 540, to: 1830 },
      { text: KANAL.stat, from: 1710, to: 2700 },
    ],
  },
  {
    id: 'westhafen',
    client: 'Museum Westhafen',
    year: '2026',
    piece: { en: 'Wayfinding screens on three floors', ko: '3개 층의 길안내 화면', ja: '3フロアの案内サイン画面' },
    desc: {
      en: 'Forty-two screens point visitors to the next hall. The arrows pulse at walking pace and turn upward when the way goes on by the stairs, so a screen never needs more than one destination at a time.',
      ko: '42개의 화면이 방문객을 다음 홀로 안내합니다. 화살표는 걷는 속도에 맞춰 깜박이고, 계단으로 이어지는 길에서는 위를 가리킵니다. 그래서 화면마다 한 번에 하나의 목적지만 보이면 됩니다.',
      ja: '42台の画面が来館者を次のホールへ案内します。矢印は歩く速さに合わせて点滅し、階段へ続く道では上向きに変わります。そのため、どの画面も一度に示す行き先は一つで済みます。',
    },
    dur: 3600,
    ease: [0.65, 0, 0.35, 1],
    fps: 60,
    rest: 1800,
    layers: [
      { text: { en: 'Level 1, 11:04', ko: '1층, 11:04', ja: '1階、11:04' }, from: 0, to: 3600 },
      {
        text: { en: 'Hall C, Textiles and dye, 40 m, about a minute', ko: 'C홀, 섬유와 염색, 40m, 약 1분', ja: 'Cホール、繊維と染色、40m、徒歩約1分' },
        from: 0,
        to: 1190,
      },
      {
        text: { en: 'Level 2, Café and library, Stairs in 15 m', ko: '2층, 카페와 도서관, 15m 앞 계단', ja: '2階、カフェと図書館、15m先に階段' },
        from: 1220,
        to: 2990,
      },
      { text: { en: 'Arrows, turning up for the stairs', ko: '화살표, 계단 방향으로 위를 향함', ja: '矢印、階段に向けて上向きに変化' }, from: 970, to: 3240 },
    ],
  },
];

const CREDITS: Array<{ what: Tri; client: string; year: string }> = [
  { what: { en: 'Account opening animation', ko: '계좌 개설 애니메이션', ja: '口座開設アニメーション' }, client: 'Saldo Bank', year: '2026' },
  { what: { en: 'Wayfinding screens', ko: '길안내 화면', ja: '案内サイン画面' }, client: 'Museum Westhafen', year: '2026' },
  { what: { en: 'Launch film', ko: '론칭 영상', ja: 'ローンチ映像' }, client: 'Velotakt e-bikes', year: '2026' },
  { what: { en: 'Lower thirds and score bug', ko: '하단 자막과 스코어 바', ja: '下段テロップとスコアバグ' }, client: 'Kanal 8 Sport', year: '2025' },
  { what: { en: '48 animated icons', ko: '애니메이션 아이콘 48종', ja: 'アニメーションアイコン48点' }, client: 'Porta Health', year: '2025' },
  { what: { en: 'Opening titles, season 3', ko: '오프닝 타이틀, 시즌 3', ja: 'オープニングタイトル、シーズン3' }, client: 'Kiezfunk podcast', year: '2025' },
  { what: { en: 'Platform screens', ko: '플랫폼 화면', ja: 'プラットフォーム画面' }, client: 'Havelbahn', year: '2024' },
  { what: { en: 'Election night graphics', ko: '개표 방송 그래픽', ja: '選挙速報グラフィック' }, client: 'Spree TV', year: '2024' },
  { what: { en: 'Loading and empty states', ko: '로딩 및 빈 상태 화면', ja: '読み込み中と空の状態の画面' }, client: 'Kontor invoicing', year: '2024' },
  { what: { en: 'Festival trailer', ko: '영화제 예고편', ja: '映画祭の予告編' }, client: 'Kurzfilmtage Wedding', year: '2024' },
];

const FACTS: Array<{ term: Tri; lines: Tri[]; figures?: boolean }> = [
  {
    term: { en: 'Studio', ko: '스튜디오', ja: 'スタジオ' },
    lines: [
      { en: 'Weserstraße 58', ko: 'Weserstraße 58', ja: 'Weserstraße 58' },
      { en: 'Courtyard, second floor', ko: '안뜰 쪽 2층', ja: '中庭側 2階' },
      { en: '12045 Berlin', ko: '12045 Berlin', ja: '12045 Berlin' },
    ],
  },
  {
    term: { en: 'Phone', ko: '전화', ja: '電話' },
    lines: [{ en: STUDIO.phone, ko: STUDIO.phone, ja: STUDIO.phone }],
    figures: true,
  },
  {
    term: { en: 'Visits', ko: '방문 시간', ja: '訪問時間' },
    lines: [{ en: 'Tuesday to Thursday, 10:00 to 18:00, by appointment', ko: '화요일~목요일 10:00~18:00, 예약제', ja: '火曜日～木曜日 10:00～18:00、予約制' }],
  },
  {
    term: { en: 'Next opening', ko: '다음 접수', ja: '次回の受付' },
    lines: [{ en: 'March 2027, for projects of six weeks or more', ko: '2027년 3월, 6주 이상의 프로젝트 대상', ja: '2027年3月、6週間以上のプロジェクトが対象' }],
  },
];

const TEAM: Array<{ name: string; role: Tri }> = [
  { name: 'Mara Voss', role: { en: 'Direction and new work', ko: '디렉션 및 신규 프로젝트', ja: 'ディレクションと新規案件' } },
  { name: 'Jonas Feld', role: { en: 'Animation', ko: '애니메이션', ja: 'アニメーション' } },
  { name: 'Ilka Brandt', role: { en: 'Animation and front-end code', ko: '애니메이션과 프런트엔드 코드', ja: 'アニメーションとフロントエンドのコード' } },
  { name: 'Tomás Rey', role: { en: 'Sound and edit', ko: '사운드와 편집', ja: 'サウンドと編集' } },
];

const RATES = [
  { rate: 1, label: '1×' },
  { rate: 0.5, label: '0.5×' },
  { rate: 0.25, label: '0.25×' },
];

const PROMPT_EN = `Design one real page in Framer Motion style: a near-black page for a small motion studio, where the work itself moves and every timing value is printed beside it.

Pick a believable subject whose product is motion, such as an animation studio, a title designer or a broadcast graphics team, and write its real content. The page must read as that subject's page, never as a page about its own style or about an animation library.

TOKENS:
--bg: #0a0a0b
--ink: #fafafa
--muted: #a1a1aa
--line: rgba(255,255,255,0.26)
--line-strong: rgba(255,255,255,0.52)
--stage: #141416
--accent: #8b5cf6
Violet is the only colour. It marks time (playheads, keyframes, curves) and the selected scene, nothing else.

TYPOGRAPHY:
Two families: Unbounded for the name, the headings, the large figures, the client and team names, the contact email address and the display lines inside the scenes; Onest for reading text and every other figure (tabular figures, no monospace).
Name: Unbounded 800, sized to fill the column on one line, line-height 0.92, letter-spacing -0.035em; when the column is under 860px it breaks after "Loop" onto two lines at line-height 0.95. On load its weight runs from 200 to 800 over 1400ms, each word 100ms after the one before.
H2: Unbounded 600, clamp(2.25rem, 4.4vw, 3.5rem), line-height 1, letter-spacing -0.045em; the contact heading a step smaller, clamp(2rem, 3.4vw, 2.75rem)
H3: Unbounded 500, 1.75rem (1.5rem under 600px), letter-spacing -0.035em
Large figures (duration, frame count): Unbounded 500, 2rem (1.75rem under 600px), letter-spacing -0.05em
Body: Onest 400, 1.0625rem, line-height 1.6; the standfirst 1.3125rem (1.25rem under 740px)
Timing values: Onest with tabular figures at 1rem

LAYOUT:
- 12-column grid, max width about 1120px, square corners everywhere.
- Hero: a thin bar with in-page links and the studio's local time; the name across the full width; a 1600ms ruler under it whose playhead runs with the name; the standfirst on seven columns and the contact details on the last four.
- Recent work: the heading with a playback bar on the right (Pause/Play, speeds 1×, 0.5×, 0.25×). Three cases, each a viewer on eight columns and an inspector on the last four, with a timeline of six keyframes and a moving playhead under the viewer.
- Clients as end credits on the centre line: what was made on the left, the client and year on the right.
- Contact: the email address as large as the column allows, four facts, the team in four columns (two on tablets, one on phones).

COMPONENTS:
- Scene: a 16:9 stage drawn in HTML and CSS, every size in container units, playing the real piece on a loop with its case's duration and curve. On phones the stage is cropped to its active area instead of shrunk.
- Keyframes: six paused copies of the same scene at evenly spaced times, with time labels, a tick every 100ms and violet diamond markers. Under 600px they sit in two rows of three, without the ruler and the playhead.
- Inspector: a short description; duration, easing (with a 52px drawing of the curve) and frame count; then the layers with their in and out times in ms.
- Playback buttons: 44px high, 1px rule, square; the pressed speed is filled white.
- Selecting a scene gives its viewer a 2px violet frame.
- Links in the text are underlined words; the in-page links in the top bar are muted words that underline on hover.

MOTION:
- The scenes are the only things that loop. Pause and speed act on every scene and its playhead together, so they stay in step.
- prefers-reduced-motion: the name is set at full weight, each viewer holds a still frame, the playhead parks on it and the playback bar is hidden.

FORBIDDEN:
- A page about motion design, springs or the library itself; feature lists, token tables, code samples
- Cards, bento grids, pills, badges, tilt on hover
- Gradient text, glow, glass, floating orbs, dotted backgrounds
- A small label above a heading, all-caps tracked labels
- A second accent colour
- Motion that does not show the work

OUTPUT:
1) CSS custom properties
2) Semantic HTML and CSS; the scenes are aria-hidden and their text is repeated in the layer list
3) Responsive layout down to 320px with no horizontal scroll
4) Visible focus, toggle buttons with aria-pressed, reduced-motion support`;

const PROMPT_KO = `Framer Motion 스타일의 실제 페이지 한 장을 디자인한다. 작은 모션 스튜디오를 위한 거의 검은 페이지이며, 작업물 자체가 움직이고 모든 타이밍 값이 그 옆에 표시된다.

제품이 모션인 주제(애니메이션 스튜디오, 타이틀 디자이너, 방송 그래픽 팀 등)를 골라 실제 콘텐츠를 쓴다. 페이지는 그 주제의 페이지로 읽혀야 하며, 자체 스타일이나 애니메이션 라이브러리에 관한 페이지로 읽혀서는 안 된다.

TOKENS:
--bg: #0a0a0b
--ink: #fafafa
--muted: #a1a1aa
--line: rgba(255,255,255,0.26)
--line-strong: rgba(255,255,255,0.52)
--stage: #141416
--accent: #8b5cf6
바이올렛은 유일한 색이다. 시간(재생 헤드, 키프레임, 곡선)과 선택된 장면에만 쓰고, 그 밖에는 쓰지 않는다.

TYPOGRAPHY:
서체는 두 가지다. 이름, 제목, 큰 숫자, 클라이언트와 팀 이름, 문의 이메일 주소, 장면 안의 표시 문구는 Unbounded를 쓰고, 본문과 그 밖의 모든 숫자는 Onest를 쓴다. 숫자는 고정폭 숫자(tabular figures)로 하며 모노스페이스 서체는 쓰지 않는다.
이름: Unbounded 800. 한 줄로 열 너비를 채우는 크기로 한다. line-height 0.92, letter-spacing -0.035em. 열이 860px 미만이면 "Loop" 뒤에서 줄을 바꿔 두 줄로 하고 line-height는 0.95로 한다. 로드 시 굵기는 1400ms 동안 200에서 800까지 올라가며, 각 단어는 앞 단어보다 100ms 늦게 시작한다.
H2: Unbounded 600, clamp(2.25rem, 4.4vw, 3.5rem), line-height 1, letter-spacing -0.045em. 문의 제목은 한 단계 작게, clamp(2rem, 3.4vw, 2.75rem)
H3: Unbounded 500, 1.75rem (600px 미만에서는 1.5rem), letter-spacing -0.035em
큰 숫자(길이, 프레임 수): Unbounded 500, 2rem (600px 미만에서는 1.75rem), letter-spacing -0.05em
본문: Onest 400, 1.0625rem, line-height 1.6. 리드 문단은 1.3125rem (740px 미만에서는 1.25rem)
타이밍 값: Onest, 고정폭 숫자, 1rem

LAYOUT:
- 12열 그리드, 최대 너비 약 1120px, 모든 모서리는 직각.
- 히어로: 페이지 내 링크와 스튜디오의 현지 시각이 있는 얇은 막대. 전체 너비에 걸친 이름. 그 아래 1600ms 눈금자, 재생 헤드는 이름과 함께 움직인다. 리드 문단은 7열, 연락처는 마지막 4열에 둔다.
- 최근 작업: 제목 오른쪽에 재생 막대(일시정지/재생, 속도 1×, 0.5×, 0.25×). 작품 세 편을 각각 뷰어(8열)와 인스펙터(마지막 4열)로 배치하고, 뷰어 아래에 키프레임 여섯 개의 타임라인과 움직이는 재생 헤드를 둔다.
- 클라이언트는 중앙선에 맞춘 엔딩 크레딧으로 둔다. 왼쪽에 제작물, 오른쪽에 클라이언트와 연도.
- 문의: 이메일 주소는 열 너비가 허락하는 한 크게. 정보 네 항목. 팀은 네 열로(태블릿에서는 두 열, 휴대폰에서는 한 열).

COMPONENTS:
- 장면(Scene): HTML과 CSS로 그린 16:9 무대. 모든 크기는 컨테이너 단위로 하며, 작품의 길이와 곡선대로 실제 작품을 반복 재생한다. 휴대폰에서는 무대를 줄이지 않고 활성 영역만 잘라서 보여 준다.
- 키프레임: 같은 장면을 일정한 간격의 시점에 멈춘 복사본 여섯 개. 시간 라벨, 100ms마다 눈금, 바이올렛 마름모 마커를 붙인다. 600px 미만에서는 눈금자와 재생 헤드 없이 세 장씩 두 줄로 놓는다.
- 인스펙터: 짧은 설명. 길이, 이징(52px 곡선 그림 포함), 프레임 수. 이어서 레이어를 시작과 끝 시간(ms)과 함께 나열한다.
- 재생 버튼: 높이 44px, 1px 선, 직각. 눌린 속도는 흰색으로 채운다.
- 장면을 선택하면 해당 뷰어에 2px 바이올렛 테두리가 생긴다.
- 본문의 링크는 밑줄 친 단어로, 상단 막대의 페이지 내 링크는 흐린 단어로 표시하며 호버하면 밑줄이 생긴다.

MOTION:
- 반복되는 것은 장면뿐이다. 일시정지와 속도는 모든 장면과 그 재생 헤드에 함께 적용되어 서로 어긋나지 않는다.
- prefers-reduced-motion: 이름은 최대 굵기로 고정하고, 각 뷰어는 정지 프레임을 유지하며, 재생 헤드는 그 프레임에 멈추고, 재생 막대는 숨긴다.

FORBIDDEN:
- 모션 디자인, 스프링, 라이브러리 자체에 관한 페이지. 기능 목록, 토큰 표, 코드 샘플 금지
- 카드, 벤토 그리드, 필(pill), 배지, 호버 시 기울기 금지
- 그라데이션 텍스트, 글로우, 글래스, 떠다니는 오브, 점무늬 배경 금지
- 제목 위의 작은 라벨, 대문자에 자간을 넓힌 라벨 금지
- 두 번째 강조색 금지
- 작품을 보여 주지 않는 모션 금지

OUTPUT:
1) CSS 커스텀 속성
2) 시맨틱 HTML과 CSS. 장면에는 aria-hidden을 붙이고, 장면의 텍스트는 레이어 목록에 다시 나열한다.
3) 320px까지 반응형 레이아웃, 가로 스크롤 없음
4) 보이는 포커스, aria-pressed를 쓰는 토글 버튼, 모션 감소 설정(reduced-motion) 지원`;

const PROMPT_JA = `Framer Motionスタイルの実在するページを1枚デザインする。小規模なモーションスタジオ向けのほぼ黒いページで、作品そのものが動き、すべてのタイミング値がその横に表示される。

製品がモーションである実在しそうな題材(アニメーションスタジオ、タイトルデザイナー、放送グラフィックチームなど)を選び、その実際のコンテンツを書く。ページはその題材のページとして読まれなければならず、自らのスタイルやアニメーションライブラリについてのページとして読まれてはならない。

TOKENS:
--bg: #0a0a0b
--ink: #fafafa
--muted: #a1a1aa
--line: rgba(255,255,255,0.26)
--line-strong: rgba(255,255,255,0.52)
--stage: #141416
--accent: #8b5cf6
バイオレットが唯一の色である。時間(再生ヘッド、キーフレーム、曲線)と選択中のシーンにのみ使い、それ以外には使わない。

TYPOGRAPHY:
書体は2種類である。名前、見出し、大きな数字、クライアント名とチーム名、問い合わせのメールアドレス、シーン内の表示文字はUnbounded、本文とそのほかのすべての数字はOnestを使う。数字は等幅数字(tabular figures)とし、等幅フォントは使わない。
名前: Unbounded 800。1行で列幅いっぱいになる大きさにする。line-height 0.92、letter-spacing -0.035em。列幅が860px未満の場合は「Loop」の後で改行して2行にし、line-height は0.95にする。読み込み時、ウェイトは1400msかけて200から800まで変化し、各単語は前の単語より100ms遅れて始まる。
H2: Unbounded 600, clamp(2.25rem, 4.4vw, 3.5rem), line-height 1, letter-spacing -0.045em。お問い合わせの見出しは一段小さく、clamp(2rem, 3.4vw, 2.75rem)
H3: Unbounded 500, 1.75rem (600px未満では1.5rem), letter-spacing -0.035em
大きな数字(長さ、フレーム数): Unbounded 500, 2rem (600px未満では1.75rem), letter-spacing -0.05em
本文: Onest 400, 1.0625rem, line-height 1.6。リード文は1.3125rem (740px未満では1.25rem)
タイミング値: Onest、等幅数字、1rem

LAYOUT:
- 12列のグリッド、最大幅は約1120px、角はすべて直角。
- ヒーロー: ページ内リンクとスタジオの現地時刻を置いた細いバー。全幅の名前。その下に1600msの目盛りを置き、再生ヘッドは名前と同時に動く。リード文は7列、連絡先は最後の4列に置く。
- 最近の制作実績: 見出しの右側に再生バー(一時停止/再生、速度 1×、0.5×、0.25×)。作品3本をそれぞれ、ビューアー(8列)とインスペクター(最後の4列)で構成する。ビューアーの下には、6つのキーフレームのタイムラインと動く再生ヘッドを置く。
- クライアントは中央線に沿ったエンドクレジットとして配置する。左に制作物、右にクライアントと年。
- お問い合わせ: メールアドレスは列幅に収まる最大サイズで、基本情報4項目、チームは4列で配置する(タブレットでは2列、スマートフォンでは1列)。

COMPONENTS:
- シーン: HTMLとCSSで描いた16:9のステージ。すべてのサイズはコンテナ単位とし、作品の長さと曲線に従って実際の作品をループ再生する。スマートフォンでは縮小せず、アクティブな領域をトリミングして表示する。
- キーフレーム: 同じシーンを等間隔の時点で一時停止した6つのコピー。時間ラベル、100msごとの目盛り、バイオレットのひし形マーカーを付ける。600px未満では、再生ヘッドと目盛りを省き、3つずつ2段に並べる。
- インスペクター: 短い説明、長さ、イージング(52pxの曲線図付き)、フレーム数。続けてレイヤーを、開始と終了の時間(ms)とともに並べる。
- 再生ボタン: 高さ44px、1pxの線、角は直角。押されている速度は白で塗りつぶす。
- シーンを選択すると、そのビューアーに2pxのバイオレットの枠が付く。
- 本文のリンクは下線付きの語で示し、上部バーのページ内リンクは薄い色の語で、ホバー時に下線が付く。

MOTION:
- ループするのはシーンだけである。一時停止と速度は、すべてのシーンとその再生ヘッドに同時に作用し、足並みが揃ったままになる。
- prefers-reduced-motion: 名前は最大のウェイトで固定し、各ビューアーは静止フレームを保持する。再生ヘッドはその位置で止まり、再生バーは非表示にする。

FORBIDDEN:
- モーションデザイン、スプリング、ライブラリ自体についてのページ。機能一覧、トークン表、コードサンプルは禁止
- カード、ベントグリッド、ピル、バッジ、ホバー時の傾き禁止
- グラデーション文字、グロー、グラス、浮遊するオーブ、ドット柄の背景禁止
- 見出しの上の小さなラベル、字間を広げた大文字のラベル禁止
- 2つ目のアクセントカラー禁止
- 作品を見せないモーション禁止

OUTPUT:
1) CSSカスタムプロパティ
2) セマンティックなHTMLとCSS。シーンにはaria-hiddenを付け、シーンのテキストはレイヤー一覧で繰り返す。
3) 320pxまで対応するレスポンシブレイアウト。横スクロールなし
4) 見えるフォーカス、aria-pressedを付けたトグルボタン、モーション軽減(reduced-motion)対応`;

const PROMPTS: Record<Lang, string> = {
  en: PROMPT_EN,
  ko: PROMPT_KO,
  ja: PROMPT_JA,
};

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const readReduced = () => window.matchMedia(REDUCED_QUERY).matches;

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReduced, readReduced, () => false);
}

// The name's first frame waits for its face, so the weight never runs in a fallback.
// The ceiling is the longest it waits, not a delay.
function useFaceReady(family: string, ceilingMs: number) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let settled = false;
    let ceiling = 0;
    let poll = 0;
    const stop = () => {
      settled = true;
      window.clearTimeout(ceiling);
      window.clearInterval(poll);
    };
    const release = () => {
      if (settled) return;
      stop();
      setReady(true);
    };
    // The route's font stylesheet may still be on its way, so the face is asked for
    // again until it has loaded.
    const probe = () => {
      document.fonts.load(`800 1em "${family}"`).then((faces) => {
        if (faces.length > 0) release();
      }, () => undefined);
    };
    ceiling = window.setTimeout(release, ceilingMs);
    poll = window.setInterval(probe, 120);
    probe();
    return stop;
  }, [family, ceilingMs]);
  return ready;
}

const BERLIN_TIME = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const berlinNow = () => BERLIN_TIME.format(Date.now());

function BerlinTime({ template }: { template: string }) {
  const [time, setTime] = useState(berlinNow);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(berlinNow()), 10000);
    return () => window.clearInterval(timer);
  }, []);
  const [before, after = ''] = template.split('{time}');
  return <p className="ll-local">{before}<time dateTime={time}>{time}</time>{after}</p>;
}

const ms = (value: number) => `${value} ms`;
const round = (value: number) => Math.round(value * 10) / 10;

// The curve drawn in a 52px square, from (2, 50) to (50, 2).
function curvePath([x1, y1, x2, y2]: Bezier) {
  const x = (value: number) => round(2 + 48 * value);
  const y = (value: number) => round(50 - 48 * value);
  return `M2 50 C ${x(x1)} ${y(y1)}, ${x(x2)} ${y(y2)}, 50 2`;
}

function SaldoScene({ t }: { t: (text: Tri) => string }) {
  return (
    <>
      <span className="ll-bk-prog"><i /><i /><i /></span>
      <span className="ll-bk-stack">
        <span className="ll-bk-c ll-bk-c3">
          <span className="ll-bk-step">{t(SALDO.steps[2])}</span>
          <span className="ll-bk-title">{t(SALDO.pin)}</span>
          <span className="ll-bk-pin"><i /><i /><i /><i /></span>
          <span className="ll-bk-go">{t(SALDO.next)}</span>
        </span>
        <span className="ll-bk-c ll-bk-c2">
          <span className="ll-bk-step">{t(SALDO.steps[1])}</span>
          <span className="ll-bk-title">{t(SALDO.photo)}</span>
          <span className="ll-bk-id" />
          <span className="ll-bk-go">{t(SALDO.next)}</span>
        </span>
        <span className="ll-bk-c ll-bk-c1">
          <span className="ll-bk-step">{t(SALDO.steps[0])}</span>
          <span className="ll-bk-title">{t(SALDO.address)}</span>
          <span className="ll-bk-fld">{SALDO.name}</span>
          <span className="ll-bk-fld">{SALDO.street}</span>
          <span className="ll-bk-go">{t(SALDO.next)}</span>
        </span>
        <span className="ll-bk-card">
          <span className="ll-bk-card__name">{SALDO.card}</span>
          <i />
          <span className="ll-bk-card__num">{SALDO.digits}</span>
        </span>
      </span>
      <span className="ll-bk-done"><i />{t(SALDO.done)}</span>
    </>
  );
}

function KanalScene({ t }: { t: (text: Tri) => string }) {
  return (
    <>
      <i className="ll-lt-arc" />
      <i className="ll-lt-mid" />
      <span className="ll-lt-bug">
        <span className="ll-lt-home">KIE<b>24</b></span>
        <span>FLE<b>22</b></span>
        <span className="ll-lt-clock">{KANAL.clock}</span>
      </span>
      <span className="ll-lt-third">
        <span className="ll-lt-num">{KANAL.shirt}</span>
        <span className="ll-lt-name"><span>{KANAL.player}</span></span>
        <span className="ll-lt-sub">
          <span className="ll-lt-s1">{t(KANAL.role)}</span>
          <span className="ll-lt-s2">{t(KANAL.stat)}</span>
        </span>
      </span>
    </>
  );
}

function WesthafenScene({ t }: { t: (text: Tri) => string }) {
  return (
    <>
      <span className="ll-wf-top"><span>{t(WESTHAFEN.here)}</span><span>{WESTHAFEN.clock}</span></span>
      <span className="ll-wf-tx ll-wf-a">
        <span className="ll-wf-to">{t(WESTHAFEN.hall)}</span>
        <span className="ll-wf-what">{t(WESTHAFEN.hallWhat)}</span>
        <span className="ll-wf-way">{t(WESTHAFEN.hallWay)}</span>
      </span>
      <span className="ll-wf-tx ll-wf-b">
        <span className="ll-wf-to">{t(WESTHAFEN.up)}</span>
        <span className="ll-wf-what">{t(WESTHAFEN.upWhat)}</span>
        <span className="ll-wf-way">{t(WESTHAFEN.upWay)}</span>
      </span>
      <span className="ll-wf-arrows"><i /><i /><i /><i /></span>
    </>
  );
}

// One scene. The viewer plays it; each keyframe is the same markup paused at `at` ms.
function Scene({ id, at, t }: { id: CaseId; at?: number; t: (text: Tri) => string }) {
  const style = at === undefined ? undefined : ({ '--ll-t': `${at}ms` } as CSSProperties);
  return (
    <span className={`ll-scene ll-scene--${id}`} style={style} aria-hidden="true">
      <span className="ll-stage">
        {id === 'saldo' ? <SaldoScene t={t} /> : null}
        {id === 'kanal' ? <KanalScene t={t} /> : null}
        {id === 'westhafen' ? <WesthafenScene t={t} /> : null}
      </span>
    </span>
  );
}

export function PortedFramerMotionPage({ lang }: PortedStylePageProps) {
  const [active, setActive] = useState<CaseId>('saldo');
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const reduced = usePrefersReducedMotion();
  const faceReady = useFaceReady('Unbounded', 1500);
  const workRef = useRef<HTMLElement>(null);
  const t = (text: Tri) => text[lang];

  // Speed is set on the running animations themselves, so a scene and its playhead
  // change pace at the same moment and stay in step. Pause is a class (play state).
  useEffect(() => {
    const work = workRef.current;
    if (!work) return;
    work.querySelectorAll<HTMLElement>('.ll-viewer .ll-scene, .ll-ph').forEach((element) => {
      element.getAnimations({ subtree: true }).forEach((animation) => animation.updatePlaybackRate(rate));
    });
  }, [rate, reduced]);

  const [workA, workB = ''] = t(COPY.workLede).split('{rate}');

  return (
    <FusionShell
      fusionId="framer-motion"
      lang={lang}
      tone="dark"
      accent="#8b5cf6"
      prev={{ href: '/pages/mesh-gradient.html', label: 'Mesh Gradient' }}
      next={{ href: '/pages/claymorphism.html', label: 'Claymorphism' }}
      prompts={PROMPTS}
    >
      <div className="ll">
        <header className="ll-bar">
          <nav className="ll-bar__nav" aria-label={t(COPY.nav)}>
            <a href="#ll-work">{t(COPY.navWork)}</a>
            <a href="#ll-clients">{t(COPY.navClients)}</a>
            <a href="#ll-contact">{t(COPY.navContact)}</a>
          </nav>
          <BerlinTime template={t(COPY.local)} />
        </header>

        <section className={`ll-hero${faceReady || reduced ? '' : ' is-held'}`} aria-labelledby="ll-name">
          <h1 id="ll-name" className="ll-name">
            <span>Loop</span>{' '}<br className="ll-br" /><span>&amp;</span>{' '}<span>Lag</span>
          </h1>
          <div className="ll-reel" aria-hidden="true"><b /><span>{ms(0)}</span><span>{ms(1600)}</span></div>
          <div className="ll-intro ll-grid">
            <p className="ll-lede">{t(COPY.lede)}</p>
            <address className="ll-reach">
              <a className="ll-reach__mail" href={`mailto:${STUDIO.mail}`}>{STUDIO.mail}</a>
              <span className="ll-reach__tel">{STUDIO.phone}</span>
              <span className="ll-reach__note">{t(COPY.booking)}</span>
            </address>
          </div>
        </section>

        <section
          ref={workRef}
          className={`ll-work${paused ? ' is-paused' : ''}`}
          id="ll-work"
          aria-labelledby="ll-work-title"
        >
          <div className="ll-work__head ll-grid">
            <h2 id="ll-work-title">{t(COPY.workTitle)}</h2>
            {reduced ? (
              <p className="ll-work__lede">{t(COPY.workLedeStill)}</p>
            ) : (
              <p className="ll-work__lede">{workA}<span className="ll-x">0.25×</span>{workB}</p>
            )}
            {reduced ? null : (
              <div className="ll-transport" role="group" aria-label={t(COPY.playback)}>
                <button type="button" className="ll-transport__pause" onClick={() => setPaused((value) => !value)}>
                  {t(paused ? COPY.play : COPY.pause)}
                </button>
                <div className="ll-transport__speed" role="group" aria-labelledby="ll-speed">
                  <span className="ll-transport__label" id="ll-speed">{t(COPY.speed)}</span>
                  {RATES.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      aria-pressed={rate === option.rate}
                      onClick={() => setRate(option.rate)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {CASES.map((item) => {
            const isActive = active === item.id;
            const caseStyle = {
              '--ll-dur': `${item.dur}ms`,
              '--ll-ease': `cubic-bezier(${item.ease.join(', ')})`,
              '--ll-rest': `${item.rest}ms`,
              '--ll-rest-r': item.rest / item.dur,
              '--ll-ticks': item.dur / 100,
            } as CSSProperties;
            const frames = Array.from({ length: 6 }, (_, index) => (index * item.dur) / 6);
            return (
              // A change of the motion setting remounts the case, so its scene restarts
              // from the right frame and its playhead stays on the same clock.
              <article
                key={`${item.id}-${reduced ? 'still' : 'live'}`}
                className={`ll-case ll-grid${isActive ? ' is-active' : ''}`}
                style={caseStyle}
                aria-labelledby={`ll-${item.id}-title`}
              >
                <header className="ll-case__head">
                  <h3 id={`ll-${item.id}-title`} className="ll-case__title">{item.client}</h3>
                  <p className="ll-case__piece">{t(item.piece)}</p>
                  <p className="ll-case__year">{item.year}</p>
                </header>

                <button
                  type="button"
                  className="ll-viewer"
                  aria-pressed={isActive}
                  aria-label={t(COPY.viewer).replace('{client}', item.client)}
                  onClick={() => setActive(item.id)}
                >
                  <Scene id={item.id} t={t} />
                </button>

                <div className="ll-track">
                  <ol className="ll-frames" aria-label={t(COPY.keyframes)}>
                    {frames.map((at) => (
                      <li key={at}>
                        <time>{ms(at)}</time>
                        <div className="ll-thumb"><Scene id={item.id} at={at} t={t} /></div>
                      </li>
                    ))}
                  </ol>
                  <span className="ll-ph" aria-hidden="true" />
                </div>

                <div className="ll-inspector">
                  <p className="ll-desc">{t(item.desc)}</p>
                  <dl className="ll-readout">
                    <div>
                      <dt>{t(COPY.duration)}</dt>
                      <dd><b>{item.dur}</b>ms</dd>
                    </div>
                    <div>
                      <dt>{t(COPY.easing)}</dt>
                      <dd className="ll-ease">
                        <svg className="ll-curve" viewBox="0 0 52 52" aria-hidden="true">
                          <rect x="0.5" y="0.5" width="51" height="51" />
                          <path d={curvePath(item.ease)} />
                          <circle cx="2" cy="50" r="2.5" />
                          <circle cx="50" cy="2" r="2.5" />
                        </svg>
                        {item.ease.join(', ')}
                      </dd>
                    </div>
                    <div>
                      <dt>{t(COPY.frames)}</dt>
                      <dd><b>{(item.dur * item.fps) / 1000}</b>{t(COPY.fps).replace('{fps}', String(item.fps))}</dd>
                    </div>
                  </dl>
                  <div className="ll-layers">
                    <h4 id={`ll-${item.id}-layers`}>{t(COPY.layers)}</h4>
                    <ul aria-labelledby={`ll-${item.id}-layers`}>
                      {item.layers.map((layer) => (
                        <li key={layer.text.en}>
                          <span className="ll-layers__text">{t(layer.text)}</span>
                          <span className="ll-layers__time">{`${layer.from}–${layer.to} ms`}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="ll-clients" id="ll-clients" aria-labelledby="ll-clients-title">
          <h2 id="ll-clients-title">{t(COPY.clientsTitle)}</h2>
          <p className="ll-clients__lede">{t(COPY.clientsLede)}</p>
          <dl className="ll-credits">
            {CREDITS.map((credit) => (
              <div key={credit.client}>
                <dt>{t(credit.what)}</dt>
                <dd>{credit.client} <span>{credit.year}</span></dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ll-contact" id="ll-contact" aria-labelledby="ll-contact-title">
          <h2 id="ll-contact-title">{t(COPY.contactTitle)}</h2>
          <a className="ll-mail" href={`mailto:${STUDIO.mail}`}>{STUDIO.mail}</a>
          <dl className="ll-facts ll-grid">
            {FACTS.map((fact) => (
              <div key={fact.term.en}>
                <dt>{t(fact.term)}</dt>
                <dd className={fact.figures ? 'll-figures' : undefined}>
                  {fact.lines.map((line) => <span key={line.en}>{t(line)}</span>)}
                </dd>
              </div>
            ))}
          </dl>
          <ul className="ll-team" aria-label={t(COPY.team)}>
            {TEAM.map((person) => (
              <li key={person.name}>
                <b>{person.name}</b>
                <span>{t(person.role)}</span>
              </li>
            ))}
          </ul>
        </section>

        <footer className="ll-foot">
          <span>{t(COPY.footer)}</span>
          <span>{t(COPY.register)}</span>
        </footer>
      </div>
    </FusionShell>
  );
}
