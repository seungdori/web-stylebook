import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedHolographicFluidPage.css';

// One album release page in the Holographic Fluid style, set like a record sleeve:
// a light soft serif for the title, a mono for lengths and dates, Side A / Side B,
// dotted leaders, underlined words for actions. The iridescent gradient lives in
// one object, the record; everything around it stays flat.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const ALBUM = {
  artist: 'HAEPA',
  kind: { en: 'Second album', ko: '정규 2집', ja: 'セカンドアルバム' },
  title: { en: 'Afloat', ko: '유영', ja: '遊泳' },
  nav: { en: 'On this page', ko: '이 페이지 목차', ja: 'このページの目次' },
  lede: {
    en: 'HAEPA recorded these eight tracks over one winter in a studio by the harbour. Three of them are out now.',
    ko: 'HAEPA가 항구 옆 작업실에서 한 해 겨울 동안 녹음한 여덟 곡입니다. 세 곡은 지금 들을 수 있습니다.',
    ja: 'HAEPAが港のそばのスタジオで、ひと冬をかけて録音した8曲です。3曲は先行公開しています。',
  },
  facts: [
    [
      { en: 'Released', ko: '발매일', ja: '発売日' },
      { en: 'Friday, Dec 4, 2026', ko: '2026년 12월 4일(금)', ja: '2026年12月4日(金)' },
    ],
    [
      { en: 'Length', ko: '재생 시간', ja: '収録時間' },
      { en: '8 tracks, 34 min', ko: '8곡, 34분', ja: '8曲、34分' },
    ],
    [
      { en: 'Label', ko: '레이블', ja: 'レーベル' },
      { en: 'Tidewater Records TW-014', ko: 'Tidewater Records TW-014', ja: 'Tidewater Records TW-014' },
    ],
  ],
  listen: { en: 'Preview tracks', ko: '미리 듣기', ja: '試聴する' },
  reserve: { en: 'See the editions', ko: '에디션 보기', ja: 'エディションを見る' },
  discLabel: {
    en: 'Holographic vinyl record of the album Afloat',
    ko: '음반 유영의 홀로그램 바이닐',
    ja: 'アルバム「遊泳」のホログラムレコード',
  },
} as const;

const TRACKS: Array<{ title: Tri; length: string; preview: boolean }> = [
  { title: { en: 'Tide Table', ko: '물때', ja: '潮どき' }, length: '3:42', preview: true },
  { title: { en: 'Afloat', ko: '유영', ja: '遊泳' }, length: '4:18', preview: true },
  { title: { en: 'Shallows', ko: '얕은 곳', ja: '浅瀬' }, length: '3:05', preview: false },
  { title: { en: 'Glass Jelly', ko: '유리 해파리', ja: 'ガラスのクラゲ' }, length: '5:11', preview: true },
  { title: { en: 'Night Swell', ko: '밤물결', ja: '夜のうねり' }, length: '4:27', preview: false },
  { title: { en: 'Buoy', ko: '부표', ja: 'ブイ' }, length: '2:58', preview: false },
  { title: { en: 'Deep Breath', ko: '깊은 숨', ja: '深い息' }, length: '4:49', preview: false },
  { title: { en: 'Ebb', ko: '썰물', ja: '引き潮' }, length: '5:36', preview: false },
];

const TRACKLIST = {
  title: { en: 'Tracks', ko: '수록곡', ja: '収録曲' },
  sideA: { en: 'Side A', ko: 'A면', ja: 'A面' },
  sideB: { en: 'Side B', ko: 'B면', ja: 'B面' },
  note: {
    en: 'Three tracks are out ahead of the release. The rest open on December 4.',
    ko: '세 곡을 먼저 공개했습니다. 나머지는 12월 4일에 공개합니다.',
    ja: '3曲を先行公開しました。残りは12月4日に公開します。',
  },
  locked: { en: 'Dec 4', ko: '12월 4일', ja: '12月4日' },
  play: { en: 'Preview', ko: '미리 듣기', ja: '試聴' },
  stop: { en: 'Stop', ko: '정지', ja: '停止' },
  silent: {
    en: 'This is a sample page, so the preview makes no sound.',
    ko: '예시 페이지라서 미리 듣기에서 소리는 나지 않습니다.',
    ja: 'サンプルページのため、試聴で音は出ません。',
  },
} satisfies Record<string, Tri>;

// The list follows the two sides of the record. `first` is the index of the
// side's first track in TRACKS, so one preview state covers both lists.
const SIDES = [
  { letter: 'A', name: TRACKLIST.sideA, first: 0, tracks: TRACKS.slice(0, 4) },
  { letter: 'B', name: TRACKLIST.sideB, first: 4, tracks: TRACKS.slice(4) },
];

const EDITIONS = {
  title: { en: 'Formats', ko: '음반', ja: 'フォーマット' },
  vinylName: { en: 'Holographic vinyl', ko: '홀로그램 바이닐', ja: 'ホログラムレコード' },
  vinylBody: {
    en: 'A 12-inch record whose colour shifts with the angle of the light. Only 500 are pressed.',
    ko: '빛의 각도에 따라 색이 바뀌는 12인치 바이닐입니다. 500장만 제작합니다.',
    ja: '光の角度で色が変わる12インチレコードです。500枚のみ製作します。',
  },
  vinylFacts: [
    [
      { en: 'Includes', ko: '구성', ja: '内容' },
      { en: 'One 12-inch LP and a 16-page lyric book', ko: '12인치 LP 1장, 가사집 16쪽', ja: '12インチLP1枚、歌詞ブック16ページ' },
    ],
    [
      { en: 'Price', ko: '가격', ja: '価格' },
      { en: '$36', ko: '48,000원', ja: '5,400円' },
    ],
    [
      { en: 'Ships', ko: '발송', ja: '発送' },
      { en: 'From December 4', ko: '12월 4일부터', ja: '12月4日から' },
    ],
    [
      { en: 'Left', ko: '남은 수량', ja: '残り' },
      { en: '137 of 500', ko: '500장 중 137장', ja: '500枚中137枚' },
    ],
  ] as Array<[Tri, Tri]>,
  others: [
    {
      name: { en: 'Digital album', ko: '디지털 음원', ja: 'デジタルアルバム' },
      body: {
        en: 'FLAC and MP3. The download link is sent on release day.',
        ko: 'FLAC과 MP3. 발매일에 내려받기 링크를 보냅니다.',
        ja: 'FLACとMP3。発売日にダウンロードリンクを送ります。',
      },
      price: { en: '$8', ko: '9,900원', ja: '1,100円' },
    },
    {
      name: { en: 'Cassette', ko: '카세트테이프', ja: 'カセットテープ' },
      body: {
        en: 'Clear shell and case. 300 copies.',
        ko: '투명 케이스에 담았습니다. 300개 제작합니다.',
        ja: 'クリアケース入り。300本製作します。',
      },
      price: { en: '$14', ko: '18,000원', ja: '2,000円' },
    },
  ],
};

type SessionState = 'open' | 'sold';

const SESSIONS = {
  title: { en: 'Listening sessions', ko: '청음회', ja: '試聴会' },
  note: {
    en: 'In the weeks after release, the whole album is played start to finish in three cities.',
    ko: '발매 뒤 3주 동안 세 도시에서 음반 전체를 처음부터 끝까지 함께 듣습니다.',
    ja: '発売後の3週間、3つの都市でアルバムを最初から最後まで一緒に聴きます。',
  },
  state: {
    open: { en: 'Tickets on sale', ko: '예매 중', ja: '販売中' },
    sold: { en: 'Sold out', ko: '매진', ja: '完売' },
  } as Record<SessionState, Tri>,
  rows: [
    {
      date: { en: 'Sun, Dec 6', ko: '12월 6일 (일)', ja: '12月6日(日)' },
      place: { en: 'Seoul, warehouse studio in Seongsu', ko: '서울 성수, 창고 스튜디오', ja: 'ソウル 聖水、倉庫スタジオ' },
      time: { en: '7 pm', ko: '오후 7시', ja: '19時' },
      state: 'open' as SessionState,
    },
    {
      date: { en: 'Sat, Dec 12', ko: '12월 12일 (토)', ja: '12月12日(土)' },
      place: { en: 'Busan, pier warehouse in Yeongdo', ko: '부산 영도, 부두 창고', ja: '釜山 影島、埠頭の倉庫' },
      time: { en: '6 pm', ko: '오후 6시', ja: '18時' },
      state: 'open' as SessionState,
    },
    {
      date: { en: 'Sat, Dec 19', ko: '12월 19일 (토)', ja: '12月19日(土)' },
      place: { en: 'Tokyo, basement hall in Shimokitazawa', ko: '도쿄 시모키타자와, 지하 홀', ja: '東京 下北沢、地下ホール' },
      time: { en: '7 pm', ko: '오후 7시', ja: '19時' },
      state: 'sold' as SessionState,
    },
  ],
};

const NOTIFY = {
  title: { en: 'Get release news', ko: '발매 소식 받기', ja: '発売情報を受け取る' },
  body: {
    en: 'One email when vinyl reservations open, and one on release day.',
    ko: '바이닐 예약을 열 때와 발매일에 메일을 한 번씩 보냅니다.',
    ja: 'レコードの予約開始時と発売日に、メールを1通ずつ送ります。',
  },
  label: { en: 'Email', ko: '이메일', ja: 'メールアドレス' },
  submit: { en: 'Notify me', ko: '알림 신청', ja: '通知を申し込む' },
  error: {
    en: 'Check the email address. It needs an @ and a domain.',
    ko: '이메일 주소를 확인하세요. @와 도메인이 있어야 합니다.',
    ja: 'メールアドレスを確認してください。@とドメインが必要です。',
  },
  done: {
    en: 'You are on the list. The first email arrives when reservations open.',
    ko: '신청했습니다. 예약을 열 때 첫 메일을 보냅니다.',
    ja: '申し込みを受け付けました。予約開始時に最初のメールを送ります。',
  },
} satisfies Record<string, Tri>;

const CREDITS = {
  title: { en: 'Credits', ko: '크레디트', ja: 'クレジット' },
  rows: [
    [
      { en: 'Written and produced by', ko: '작사, 작곡, 프로듀싱', ja: '作詞・作曲・プロデュース' },
      { en: 'HAEPA', ko: 'HAEPA', ja: 'HAEPA' },
    ],
    [
      { en: 'Mixed and mastered at', ko: '믹싱, 마스터링', ja: 'ミキシング・マスタリング' },
      { en: 'Low Water Studio', ko: '낮은물 스튜디오', ja: 'ロウウォーター・スタジオ' },
    ],
    [
      { en: 'Released by', ko: '유통', ja: '発売元' },
      { en: 'Tidewater Records', ko: 'Tidewater Records', ja: 'Tidewater Records' },
    ],
  ] as Array<[Tri, Tri]>,
};

const PROMPTS: Record<Lang, string> = {
  en: `Design one real page in Holographic Fluid style — a deep dark canvas where a single iridescent object carries all the colour.

Pick a believable subject that suits iridescence, such as an album release, a festival, a perfume or a film premiere, and write its real content. The page must read as that subject's page, never as a page about its own style.

COLOR TOKENS:
--bg: #0b0f19
--surface: #121829
--text: #ffffff
--muted: rgba(255,255,255,0.68)
--line: rgba(255,255,255,0.26)
--c1: #ff7eb3
--c2: #ff758c
--c3: #4facfe
--c4: #00f2fe
--c5: #c084fc
No other colours.

THE ONE IRIDESCENT OBJECT:
- A conic gradient through c1, c3, c4, c5, c2 on one large object (here a vinyl record) with fine concentric grooves.
- It turns slowly and its hue angle follows the pointer.
- The gradient appears on nothing but the record: no gradient text, no gradient borders, no glass cards.

ATMOSPHERE:
- Two blurred colour fields behind the content at about 0.2 opacity, drifting over 18s.
- They are atmosphere. Body text never sits on a field brighter than that.

TYPOGRAPHY:
Display: Fraunces 300 with the soft axis at its maximum (font-variation-settings: 'SOFT' 100, 'WONK' 1), tracking -0.05em, line-height 0.8, clamp(5.5rem, 31vw, 25rem)
Headings: the same light, soft Fraunces, tracking -0.035em, clamp(2.75rem, 6.6vw, 5.25rem)
Body: Fraunces 400 to 600 with Noto Sans KR for Hangul, 1.0625rem, line-height 1.6
Lengths, dates, prices and catalogue numbers: Fragment Mono, 0.95rem
No neutral sans-serif for the title, headings or body.

LAYOUT:
- Hero: the artist's name, then the title at full size; under it a short statement, release facts joined by dotted leaders and two text links on the left, the record on the right and cut by the edge of the screen.
- Track list split like the record into Side A and Side B, each an ordered list (A1 to A4, B1 to B4 are real track numbers) with a dotted leader between title and length.
- Formats: the vinyl spec as a list with dotted leaders, next to the sign-up field; the other formats as plain rows.
- Dated sessions as plain rows; credits as liner notes in columns.
- No cards anywhere.
- Max width about 1120px, section gap 120px.

COMPONENTS:
- Actions are underlined words: weight 600, 2px underline. No filled buttons, no outlined buttons, no pills.
- Dotted leader: a 2px dotted line at 0.38 opacity that joins a label to its value.
- Rows: 1px line at 0.26 opacity, no background, no radius. A 2px white rule under each side heading.
- Form: one single-line field on a 2px underline with a text button on the same line, visible label, error text under the field.

MOTION:
- The record turns once every 48s. Fields drift over 18s.
- A previewed track shows a progress line under its row.
- prefers-reduced-motion stops the turning and the drift.

FORBIDDEN:
- Gradient text, or the gradient on anything other than the record
- Glass panels and backdrop blur on content
- Cards, pills and rounded bordered boxes
- A row of widgets that the subject does not need
- A small label above every heading
- Light page backgrounds

OUTPUT:
1) CSS custom properties
2) Semantic HTML and CSS
3) Responsive layout down to 320px with no horizontal scroll
4) Visible focus, labelled form field, reduced-motion support`,
  ko: `Holographic Fluid 스타일로 실제 페이지 한 장을 디자인해줘 — 깊은 다크 캔버스 위에서 무지갯빛 사물 하나가 색을 전부 맡는다.

무지갯빛이 어울리는 현실적인 주제(음반 발매, 페스티벌, 향수, 영화 개봉 등)를 하나 정하고 그 주제의 실제 내용을 써라. 페이지는 그 주제의 페이지로 읽혀야 하고, 자기 스타일을 설명하는 페이지가 되면 안 된다.

COLOR TOKENS:
--bg: #0b0f19
--surface: #121829
--text: #ffffff
--muted: rgba(255,255,255,0.68)
--line: rgba(255,255,255,0.26)
--c1: #ff7eb3
--c2: #ff758c
--c3: #4facfe
--c4: #00f2fe
--c5: #c084fc
다른 색은 쓰지 않는다.

무지갯빛 사물 하나:
- 큰 사물 하나(여기서는 바이닐)에 c1, c3, c4, c5, c2를 지나는 conic 그라데이션과 가는 동심원 홈을 넣는다.
- 천천히 돌고, 색상 각도가 포인터를 따라 바뀐다.
- 그라데이션은 바이닐에만 쓴다. 그라데이션 글자, 그라데이션 테두리, 글래스 카드 금지.

분위기:
- 콘텐츠 뒤에 흐린 색 면 2개를 불투명도 약 0.2로 두고 18초에 걸쳐 흐르게 한다.
- 분위기용이다. 본문 글자를 이보다 밝은 면 위에 두지 않는다.

TYPOGRAPHY:
디스플레이: Fraunces 300, 부드러운 축(font-variation-settings: 'SOFT' 100, 'WONK' 1)을 최대로, 자간 -0.05em, 행간 0.8, clamp(5.5rem, 31vw, 25rem)
제목: 같은 가볍고 부드러운 Fraunces, 자간 -0.035em, clamp(2.75rem, 6.6vw, 5.25rem)
본문: Fraunces 400~600, 한글은 Noto Sans KR, 1.0625rem, 행간 1.6
곡 길이, 날짜, 가격, 카탈로그 번호: Fragment Mono, 0.95rem
제목, 소제목, 본문에 중립 산세리프를 쓰지 않는다.

LAYOUT:
- 첫 화면: 아티스트 이름, 그 아래 전체 크기의 제목. 제목 아래에 짧은 소개 문장, 점선 리더로 이어진 발매 정보와 텍스트 링크 2개를 왼쪽에 두고, 화면 가장자리에서 잘린 바이닐을 오른쪽에 둔다.
- 수록곡은 바이닐처럼 A면과 B면으로 나눈다. 각 면은 순서 목록(A1~A4, B1~B4는 실제 트랙 번호)으로 하고, 곡명과 길이 사이에 점선 리더를 둔다.
- 음반 종류: 바이닐 사양은 점선 리더가 있는 목록으로 신청 폼 옆에 둔다. 나머지 음반 종류는 일반 행으로 둔다.
- 날짜가 있는 청음회는 일반 행으로 두고, 크레디트는 열로 나눈 라이너 노트로 둔다.
- 카드는 어디에도 쓰지 않는다.
- 최대 폭 약 1120px, 섹션 간격 120px.

COMPONENTS:
- 동작은 밑줄 친 단어로 쓴다: 굵기 600, 밑줄 2px. 채운 버튼, 테두리 버튼, 알약 모양은 쓰지 않는다.
- 점선 리더: 불투명도 0.38의 2px 점선으로, 라벨과 값을 잇는다.
- 줄: 불투명도 0.26의 1px 선. 배경과 모서리 둥글기는 없다. 각 면 제목 아래에 2px 흰 선을 둔다.
- 입력 칸: 2px 밑줄이 있는 한 줄 입력 칸, 같은 줄의 텍스트 버튼, 보이는 라벨, 칸 아래에 오류 문구.

MOTION:
- 바이닐은 48초에 한 바퀴. 색 면은 18초에 걸쳐 흐른다.
- 미리 듣는 곡은 행 아래에 진행 선을 표시한다.
- prefers-reduced-motion에서는 회전과 흐름을 멈춘다.

FORBIDDEN:
- 그라데이션 글자, 바이닐이 아닌 사물에 넣은 그라데이션
- 콘텐츠에 쓰는 글래스 패널과 backdrop blur
- 카드, 알약 모양, 둥근 테두리 상자
- 주제에 필요 없는 위젯 나열
- 제목마다 붙는 작은 라벨
- 밝은 페이지 배경

OUTPUT:
1) CSS 커스텀 속성
2) 시맨틱 HTML과 CSS
3) 320px까지 가로 스크롤 없는 반응형
4) 보이는 포커스, 라벨이 있는 입력 칸, 동작 줄이기 지원`,
  ja: `Holographic Fluid スタイルで、実在しそうなページを1枚デザインしてください — 深いダークキャンバスの上で、虹色に光るオブジェクト1つがすべての色を担います。

虹色が似合う現実的な題材(アルバム発売、フェスティバル、香水、映画公開など)を1つ決め、その題材の実際の内容を書くこと。ページはその題材のページとして読めること。自分のスタイルを説明するページにしないこと。

COLOR TOKENS:
--bg: #0b0f19
--surface: #121829
--text: #ffffff
--muted: rgba(255,255,255,0.68)
--line: rgba(255,255,255,0.26)
--c1: #ff7eb3
--c2: #ff758c
--c3: #4facfe
--c4: #00f2fe
--c5: #c084fc
ほかの色は使わない。

虹色のオブジェクトは1つだけ:
- 大きなオブジェクト1つ(ここではレコード)に、c1、c3、c4、c5、c2 を通る conic グラデーションと細い同心円の溝を入れる。
- ゆっくり回り、色相の角度がポインターに合わせて変わる。
- グラデーションはレコードにだけ使う。グラデーション文字、グラデーションの枠線、ガラスカードは禁止。

雰囲気:
- コンテンツの背後に、ぼかした色面を2つ、不透明度約0.2で置き、18秒かけて漂わせる。
- 雰囲気づくりのためのもの。本文をこれより明るい面の上に置かない。

TYPOGRAPHY:
ディスプレイ: Fraunces 300、ソフト軸(font-variation-settings: 'SOFT' 100, 'WONK' 1)を最大に、字間 -0.05em、行間 0.8、clamp(5.5rem, 31vw, 25rem)
見出し: 同じ軽くやわらかい Fraunces、字間 -0.035em、clamp(2.75rem, 6.6vw, 5.25rem)
本文: Fraunces 400〜600、ハングルには Noto Sans KR、1.0625rem、行間 1.6
曲の長さ、日付、価格、カタログ番号: Fragment Mono、0.95rem
タイトル、見出し、本文に中立的なサンセリフは使わない。

LAYOUT:
- ヒーロー: アーティスト名、その下に全幅のタイトル。タイトルの下に短い紹介文、点線リーダーでつないだ発売情報とテキストリンク2つを左に、画面の端で切れるレコードを右に置く。
- 収録曲はレコードのように A面 と B面 に分け、それぞれを順序付きリスト(A1〜A4、B1〜B4は実際のトラック番号)にする。曲名と長さの間は点線リーダーでつなぐ。
- フォーマット: レコードの仕様は点線リーダー付きのリストにして申し込み欄の横に置く。ほかのフォーマットは通常の行にする。
- 日付のある試聴会は通常の行にし、クレジットは段組みのライナーノーツにする。
- カードはどこにも使わない。
- 最大幅は約1120px、セクション間隔は120px。

COMPONENTS:
- アクションは下線付きの語にする。太さ600、下線2px。塗りつぶしボタン、枠線ボタン、ピル形は使わない。
- 点線リーダー: 不透明度0.38の2pxの点線で、ラベルと値をつなぐ。
- 行: 不透明度0.26の1pxの線。背景も角丸もない。各面の見出しの下に2pxの白い線。
- 入力欄: 2pxの下線を持つ1行の入力欄と、同じ行のテキストボタン。見えるラベルと、欄の下のエラー文。

MOTION:
- レコードは48秒で1回転。色面は18秒かけて漂う。
- 試聴中の曲は、行の下に進行線を表示。
- prefers-reduced-motion では回転と漂いを止める。

FORBIDDEN:
- グラデーション文字、レコード以外のオブジェクトに入れたグラデーション
- コンテンツに使うガラスパネルと backdrop blur
- カード、ピル形、角丸で枠線のある箱
- 題材に必要のないウィジェットの羅列
- すべての見出しの上に付く小さなラベル
- 明るいページ背景

OUTPUT:
1) CSS カスタムプロパティ
2) セマンティックな HTML と CSS
3) 320pxまで横スクロールのないレスポンシブ
4) 見えるフォーカス、ラベル付きの入力欄、reduced-motion 対応`,
};

type FormState = 'idle' | 'error' | 'done';

// A preview plays for this long, then the row goes back to its resting state.
const PREVIEW_MS = 20000;

export function PortedHolographicFluidPage({ lang }: PortedStylePageProps) {
  const [playing, setPlaying] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const discRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const t = (text: Tri) => text[lang];

  // The form leaves the page once the request is in, and focus would fall back to
  // the top of the document. Focus goes to the confirmation that replaces the form.
  useEffect(() => {
    if (formState === 'done') doneRef.current?.focus();
  }, [formState]);

  // The end of a preview is timed here and not by the progress bar's animation:
  // reduced motion cuts that animation short, and the preview would stop at once.
  useEffect(() => {
    if (playing === null) return undefined;
    const timer = window.setTimeout(() => setPlaying(null), PREVIEW_MS);
    return () => window.clearTimeout(timer);
  }, [playing]);

  // The record's hue angle follows the pointer across the hero.
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    discRef.current?.style.setProperty('--hf-shift', `${Math.round(ratio * 140)}deg`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? 'done' : 'error');
  };

  return (
    <FusionShell
      fusionId="holographic-fluid"
      lang={lang}
      tone="dark"
      accent="#ff7eb3"
      prev={{ href: '/pages/runtime-signal.html', label: 'Runtime Signal' }}
      next={{ href: '/pages/neon-drift.html', label: 'Neon Drift' }}
      prompts={PROMPTS}
    >
      <div className="hf">
        <div className="hf-fields" aria-hidden="true"><i /><i /></div>

        <section className="hf-hero" onPointerMove={handlePointerMove} aria-labelledby="hf-title">
          <div className="hf-top">
            <p className="hf-top__artist">{ALBUM.artist} <span>{t(ALBUM.kind)}</span></p>
            <nav className="hf-top__nav" aria-label={t(ALBUM.nav)}>
              <a href="#hf-tracks">{t(TRACKLIST.title)}</a>
              <a href="#hf-editions">{t(EDITIONS.title)}</a>
              <a href="#hf-sessions">{t(SESSIONS.title)}</a>
            </nav>
          </div>
          <h1 id="hf-title" className="hf-hero__title">{t(ALBUM.title)}</h1>
          <div className="hf-hero__row">
            <div className="hf-hero__copy">
              <p className="hf-statement">{t(ALBUM.lede)}</p>
              <dl className="hf-facts">
                {ALBUM.facts.map(([term, value]) => (
                  <div key={term.en}><dt>{t(term)}</dt><dd>{t(value)}</dd></div>
                ))}
              </dl>
              <div className="hf-links">
                <a className="hf-link" href="#hf-tracks">{t(ALBUM.listen)}</a>
                <a className="hf-link hf-link--quiet" href="#hf-editions">{t(ALBUM.reserve)}</a>
              </div>
            </div>
            <div className="hf-disc" ref={discRef} role="img" aria-label={t(ALBUM.discLabel)}>
              <div className="hf-disc__foil" />
            </div>
          </div>
        </section>

        <section className="hf-section" id="hf-tracks" aria-labelledby="hf-tracks-title">
          <h2 id="hf-tracks-title" className="hf-heading">{t(TRACKLIST.title)}</h2>
          <p className="hf-note">{t(TRACKLIST.note)}</p>
          <div className="hf-sides">
            {SIDES.map((side) => (
              <div key={side.letter}>
                <h3 id={`hf-side-${side.letter.toLowerCase()}`} className="hf-rule">{t(side.name)}</h3>
                <ol aria-labelledby={`hf-side-${side.letter.toLowerCase()}`}>
                  {side.tracks.map((track, position) => {
                    const index = side.first + position;
                    const active = playing === index;
                    return (
                      <li key={track.title.en} className={`hf-track${active ? ' is-playing' : ''}`}>
                        <span className="hf-track__num">{`${side.letter}${position + 1}`}</span>
                        <span className="hf-track__title">{t(track.title)}</span>
                        <i className="hf-leader" aria-hidden="true" />
                        <span className="hf-track__length">{track.length}</span>
                        <span className="hf-track__action">
                          {track.preview ? (
                            <button
                              type="button"
                              className="hf-track__play"
                              aria-label={`${t(track.title)} ${t(active ? TRACKLIST.stop : TRACKLIST.play)}`}
                              onClick={() => setPlaying(active ? null : index)}
                            >
                              {t(active ? TRACKLIST.stop : TRACKLIST.play)}
                            </button>
                          ) : (
                            <span className="hf-track__locked">{t(TRACKLIST.locked)}</span>
                          )}
                        </span>
                        {active ? <span className="hf-track__bar" aria-hidden="true" style={{ animationDuration: `${PREVIEW_MS}ms` }} /> : null}
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
          <p className="hf-footnote">{t(TRACKLIST.silent)}</p>
        </section>

        <section className="hf-section" id="hf-editions" aria-labelledby="hf-editions-title">
          <h2 id="hf-editions-title" className="hf-heading">{t(EDITIONS.title)}</h2>
          <div className="hf-edition">
            <div className="hf-vinyl">
              <h3 className="hf-subhead">{t(EDITIONS.vinylName)}</h3>
              <p className="hf-lead">{t(EDITIONS.vinylBody)}</p>
              <dl className="hf-facts">
                {EDITIONS.vinylFacts.map(([term, value]) => (
                  <div key={term.en}><dt>{t(term)}</dt><dd>{t(value)}</dd></div>
                ))}
              </dl>
            </div>
            <div id="hf-notify">
              <h3 id="hf-notify-title" className="hf-subhead">{t(NOTIFY.title)}</h3>
              <p className="hf-lead">{t(NOTIFY.body)}</p>
              {formState === 'done' ? (
                <p className="hf-form__done" ref={doneRef} tabIndex={-1}>{t(NOTIFY.done)}</p>
              ) : (
                <form className="hf-form" onSubmit={handleSubmit} noValidate aria-labelledby="hf-notify-title">
                  <label htmlFor="hf-email">{t(NOTIFY.label)}</label>
                  <div className={`hf-field${formState === 'error' ? ' is-invalid' : ''}`}>
                    <input
                      id="hf-email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={email}
                      aria-invalid={formState === 'error'}
                      aria-describedby={formState === 'error' ? 'hf-email-error' : undefined}
                      onChange={(event) => { setEmail(event.target.value); if (formState === 'error') setFormState('idle'); }}
                    />
                    <button className="hf-field__submit" type="submit">{t(NOTIFY.submit)}</button>
                  </div>
                  {formState === 'error' ? <p className="hf-form__error" id="hf-email-error" role="alert">{t(NOTIFY.error)}</p> : null}
                </form>
              )}
            </div>
          </div>
          <ul className="hf-formats">
            {EDITIONS.others.map((format) => (
              <li key={format.name.en}>
                <h3 className="hf-formats__name">{t(format.name)}</h3>
                <p className="hf-formats__body">{t(format.body)}</p>
                <span className="hf-price">{t(format.price)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="hf-section" id="hf-sessions" aria-labelledby="hf-sessions-title">
          <h2 id="hf-sessions-title" className="hf-heading">{t(SESSIONS.title)}</h2>
          <p className="hf-note">{t(SESSIONS.note)}</p>
          <ul className="hf-sessions">
            {SESSIONS.rows.map((row) => (
              <li key={row.date.en}>
                <span className="hf-sessions__date">{t(row.date)}</span>
                <span className="hf-sessions__place">{t(row.place)}</span>
                <span className="hf-sessions__time">{t(row.time)}</span>
                <span className={`hf-sessions__state hf-sessions__state--${row.state}`}>{t(SESSIONS.state[row.state])}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="hf-section" aria-labelledby="hf-credits-title">
          <h2 id="hf-credits-title" className="hf-rule">{t(CREDITS.title)}</h2>
          <dl className="hf-liner__notes">
            {CREDITS.rows.map(([term, value]) => (
              <div key={term.en}><dt>{t(term)}</dt><dd>{t(value)}</dd></div>
            ))}
          </dl>
        </section>

        <footer className="hf-footer">
          <span>© 2026 HAEPA</span>
          <span>Tidewater Records TW-014</span>
        </footer>
      </div>
    </FusionShell>
  );
}
