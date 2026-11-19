import { useEffect, useReducer, useState, type CSSProperties } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFusionHoloGlassPage.css';

// The product page of Pane, a focus timer that is one pane of glass over a
// slow aurora. The page has exactly one glass panel: the working timer.

type Tri = Record<Lang, string>;

// Each scene is three colours of light. The swatch in the timer shows the same three.
const SCENES = [
  { id: 'dawn', name: { en: 'Dawn', ko: '새벽', ja: '夜明け' }, a: '#a5e3ff', b: '#b9a4ff', c: '#ff9ec4' },
  { id: 'forest', name: { en: 'Forest', ko: '숲', ja: '森' }, a: '#9ff0c9', b: '#5ec7c0', c: '#c7f08c' },
  { id: 'lilac', name: { en: 'Lilac', ko: '라일락', ja: 'ライラック' }, a: '#d9b8ff', b: '#a68cff', c: '#ffb3e6' },
  { id: 'dusk', name: { en: 'Dusk', ko: '노을', ja: '夕暮れ' }, a: '#ffb199', b: '#ff8fb3', c: '#9c8cff' },
] satisfies Array<{ id: string; name: Tri; a: string; b: string; c: string }>;

// The focus length slider, in minutes.
const LENGTH = { min: 5, max: 60, step: 5, initial: 25 };

const BREAK_SECONDS = 5 * 60;
const LONG_BREAK_SECONDS = 15 * 60;
// A long break follows this many focus blocks.
const FOCUS_BLOCKS = 4;

const HERO = {
  title: { en: 'A focus timer on one pane of glass.', ko: '유리 한 장으로 만든 집중 타이머', ja: 'ガラス1枚の集中タイマー' },
  lede: {
    en: 'Pane is a single timer that floats at the edge of your screen. Focus for 25 minutes, rest for 5. As the time runs down, the light behind the glass dims with it.',
    ko: 'Pane은 화면 한쪽에 띄워 두는 타이머 한 장입니다. 25분 집중하고 5분 쉽니다. 시간이 줄어들면 유리 뒤의 빛도 함께 어두워집니다.',
    ja: 'Pane は、画面の端に浮かべておく1枚のタイマーです。25分集中して5分休みます。時間が減ると、ガラスの奥の光も一緒に暗くなります。',
  },
  how: { en: 'How a cycle runs', ko: '진행 순서 보기', ja: '進み方を見る' },
  get: { en: 'Devices and price', ko: '기기와 가격', ja: '対応機器と価格' },
} satisfies Record<string, Tri>;

const TIMER = {
  focus: { en: 'Focus', ko: '집중', ja: '集中' },
  rest: { en: 'Break', ko: '휴식', ja: '休憩' },
  // {n} is the focus block, {total} the number of focus blocks in a cycle.
  block: { en: 'block {n} of {total}', ko: '{total}회 중 {n}회차', ja: '{total}回中{n}回目' },
  afterBlock: { en: 'after block {n} of {total}', ko: '{total}회 중 {n}회차 후', ja: '{total}回中{n}回目の後' },
  start: { en: 'Start', ko: '시작', ja: '開始' },
  pause: { en: 'Pause', ko: '일시정지', ja: '一時停止' },
  reset: { en: 'Reset', ko: '초기화', ja: 'リセット' },
  length: { en: 'Focus length', ko: '집중 길이', ja: '集中の長さ' },
  minutes: { en: '{n} min', ko: '{n}분', ja: '{n}分' },
  scene: { en: 'Light', ko: '배경 빛', ja: '背景の光' },
  focusDone: { en: 'Focus finished. A 5-minute break has started.', ko: '집중이 끝났습니다. 5분 휴식을 시작합니다.', ja: '集中が終わりました。5分の休憩を始めます。' },
  longRest: { en: 'Four focus blocks finished. A 15-minute break has started.', ko: '집중 4회를 마쳤습니다. 15분 휴식을 시작합니다.', ja: '集中を4回終えました。15分の休憩を始めます。' },
  restDone: { en: 'Break finished. The next focus block has started.', ko: '휴식이 끝났습니다. 다음 집중을 시작합니다.', ja: '休憩が終わりました。次の集中を始めます。' },
  remaining: { en: 'Time left', ko: '남은 시간', ja: '残り時間' },
} satisfies Record<string, Tri>;

const CYCLE = {
  title: { en: 'Four focus blocks, then one long break', ko: '집중 네 번에 긴 휴식 한 번', ja: '集中4回のあとに、長い休憩を1回' },
  body: {
    en: 'Pane moves through this order on its own. After the long break it starts again from the first block.',
    ko: 'Pane이 이 순서를 자동으로 넘깁니다. 긴 휴식이 끝나면 첫 집중으로 돌아갑니다.',
    ja: 'Pane はこの順番を自動で進めます。長い休憩が終わると、最初の集中に戻ります。',
  },
  minutes: { en: ' min', ko: '분', ja: '分' },
  total: {
    en: 'Filled blocks are focus, outlined blocks are breaks. One cycle takes 2 hours 10 minutes.',
    ko: '채운 칸은 집중, 빈 칸은 휴식입니다. 한 바퀴는 2시간 10분입니다.',
    ja: '塗りつぶしは集中、枠だけは休憩です。1周は2時間10分です。',
  },
  // 집중과 휴식의 길이(분). 합계 130분.
  blocks: [25, 5, 25, 5, 25, 5, 25, 15],
};

type LogState = 'done' | 'now';

const LOG = {
  title: { en: "Today's record", ko: '오늘의 기록', ja: '今日の記録' },
  body: {
    en: 'Each block is saved with the name you give it. The record stays on your device.',
    ko: '집중할 때마다 붙인 이름과 함께 저장합니다. 기록은 기기에만 저장합니다.',
    ja: '集中するたびに、付けた名前と一緒に保存します。記録は端末にだけ保存します。',
  },
  state: {
    done: { en: 'Done', ko: '완료', ja: '完了' },
    now: { en: 'In progress', ko: '진행 중', ja: '進行中' },
  } as Record<LogState, Tri>,
  rows: [
    { time: '09:00', what: { en: 'Proposal draft', ko: '기획서 초안', ja: '企画書の下書き' }, state: 'done' as LogState },
    { time: '09:30', what: { en: 'Proposal draft', ko: '기획서 초안', ja: '企画書の下書き' }, state: 'done' as LogState },
    { time: '10:00', what: { en: 'Email replies', ko: '메일 답장', ja: 'メールの返信' }, state: 'done' as LogState },
    { time: '10:30', what: { en: 'Design review', ko: '디자인 검토', ja: 'デザインレビュー' }, state: 'now' as LogState },
  ],
  length: { en: '25 min', ko: '25분', ja: '25分' },
  sum: { en: 'Focused today: 1 hour 15 minutes', ko: '오늘 집중한 시간: 1시간 15분', ja: '今日の集中時間: 1時間15分' },
};

const GET = {
  title: { en: 'Devices and price', ko: '기기와 가격', ja: '対応機器と価格' },
  rows: [
    { device: 'Mac', body: { en: 'The timer sits in the menu bar and opens as one pane.', ko: '메뉴 막대에 타이머를 두고, 누르면 유리 한 장으로 열립니다.', ja: 'メニューバーに置き、押すと1枚のガラスとして開きます。' } },
    { device: 'iPhone', body: { en: 'The time left shows on the lock screen.', ko: '잠금 화면에 남은 시간을 표시합니다.', ja: 'ロック画面に残り時間を表示します。' } },
    { device: 'visionOS', body: { en: 'One pane floats in the room, at the size you set.', ko: '방 안에 유리 한 장을 띄우고 크기를 정합니다.', ja: '部屋の中にガラスを1枚浮かべ、大きさを決めます。' } },
  ] satisfies Array<{ device: string; body: Tri }>,
  price: { en: '$9, paid once. No subscription.', ko: '12,000원, 한 번만 결제합니다. 구독은 없습니다.', ja: '1,300円、買い切りです。サブスクリプションはありません。' },
  priceNote: { en: 'One purchase covers all three devices.', ko: '한 번 사면 세 기기에서 모두 씁니다.', ja: '1回の購入で3つの機器すべてで使えます。' },
  action: { en: 'Try the timer', ko: '타이머 써 보기', ja: 'タイマーを試す' },
};

const PROMPTS: Record<Lang, string> = {
  en: `Design one real product page in Holo × Glass fusion: a dark page where one frosted glass panel floats over a slow aurora.

Pick a believable product that is naturally one floating panel, such as a timer, a music player or a weather glance, and write its real content. The page must read as that product's page, never as a page about its own style.

TOKENS:
--bg: #080a12
--ink: #ffffff
--muted: rgba(255,255,255,0.7)
--line: rgba(255,255,255,0.28)
--accent and two companion colours per light scene:
  dawn #a5e3ff / #b9a4ff / #ff9ec4
  forest #9ff0c9 / #5ec7c0 / #c7f08c
  lilac #d9b8ff / #a68cff / #ffb3e6
  dusk #ffb199 / #ff8fb3 / #9c8cff

ATMOSPHERE:
- Three blurred radial fields behind the panel, in the scene's three colours.
- The fields carry meaning: their brightness follows the product's state (here, time left).

THE ONE GLASS PANEL:
- rgba(14,16,28,0.34) fill, 1px line at rgba(255,255,255,0.36), backdrop-filter blur(24px) saturate(140%), radius 30px. The dark fill keeps the text readable when the light is at its brightest.
- It is the working product: a live timer. The time comes first, then the mode with "block N of 4", a thin progress line and the controls.
- No second glass panel anywhere on the page.

TYPOGRAPHY:
Two families: Sofia Sans Extra Condensed for the headline, section headings, the time and other figures, and Sofia Sans for running text and labels.
Headings: Sofia Sans Extra Condensed 500, line-height 0.94 to 0.96. H1 clamp(3.4rem, 7.6vw, 6.6rem), H2 clamp(2.6rem, 5.4vw, 4.4rem).
Timer digits: Sofia Sans Extra Condensed 200, thin tall figures at clamp(9.5rem, 36vw, 20rem) with line-height 0.78. The family's tabular figures are too wide, so each character sits in its own fixed-width cell and the time does not shift while it counts.
Body: Sofia Sans 400 at 1.0625rem with line-height 1.6, values and button labels at 500 to 600. No all-caps tracked labels.

COMPONENTS:
- The timer's own controls only: one round Start/Pause button, Reset as underlined text, a range slider for the focus length (5 to 60 minutes in steps of 5) and four round colour swatches for the light, with the chosen scene's name beside them.
- Actions outside the timer are underlined text links.
- No pills, no chips, no cards.

LAYOUT:
- Hero: one centred column. The product name, the headline and two text links come first, and the glass timer sits under them as the main object of the page.
- Below the hero everything is flat: a proportional bar that shows the focus and break cycle with its minutes in the condensed face, a record in plain rows, device rows and one price line.
- Rows are separated by 1px lines. No grid of identical cards.

MOTION:
- The aurora drifts over 24s. The timer ticks once a second.
- prefers-reduced-motion stops the drift.

FORBIDDEN:
- Stacked glass, more than one glass panel, blur above 30px on the panel
- Pill buttons, chip rows, rounded bordered cards
- A colour-chip row that only recolours the page: a scene choice must be a product setting
- A one-word accent in the headline, issue numbers, stamps, marquees
- A small label above every heading

OUTPUT:
1) CSS custom properties with the four light scenes
2) Semantic HTML and CSS, a working timer
3) Responsive layout down to 320px with no horizontal scroll
4) Visible focus, labelled controls, reduced-motion support`,
  ko: `Holo × Glass 퓨전으로 실제 제품 페이지 한 장을 디자인해줘: 느린 오로라 위에 프로스티드 글래스 패널 한 장이 떠 있는 다크 페이지.

원래 패널 한 장으로 떠 있는 제품(타이머, 음악 플레이어, 날씨 요약 등)을 하나 정하고 그 제품의 실제 내용을 써라. 페이지는 그 제품의 페이지로 읽혀야 하고, 자기 스타일을 설명하는 페이지가 되면 안 된다.

TOKENS:
--bg: #080a12
--ink: #ffffff
--muted: rgba(255,255,255,0.7)
--line: rgba(255,255,255,0.28)
--accent와 보조 색 2개를 빛 장면마다 정한다:
  새벽 #a5e3ff / #b9a4ff / #ff9ec4
  숲 #9ff0c9 / #5ec7c0 / #c7f08c
  라일락 #d9b8ff / #a68cff / #ffb3e6
  노을 #ffb199 / #ff8fb3 / #9c8cff

분위기:
- 패널 뒤에 장면의 세 색으로 흐린 radial 면 3개를 둔다.
- 이 빛은 뜻이 있어야 한다. 밝기가 제품의 상태(여기서는 남은 시간)를 따른다.

글래스 패널은 한 장:
- rgba(14,16,28,0.34) 채움, rgba(255,255,255,0.36) 1px 선, backdrop-filter blur(24px) saturate(140%), radius 30px. 어두운 채움이 빛이 가장 밝을 때도 글자를 읽기 쉽게 유지한다.
- 이 패널이 동작하는 제품이다: 실제로 돌아가는 타이머. 시간이 먼저 오고, 다음은 "4회 중 N회차"가 붙은 모드 표시, 얇은 진행선, 조작 요소 순이다.
- 페이지 어디에도 두 번째 글래스 패널을 두지 않는다.

TYPOGRAPHY:
두 가지 서체를 쓴다. 제목, 섹션 제목, 시간과 다른 숫자는 Sofia Sans Extra Condensed, 본문과 라벨은 Sofia Sans.
제목: Sofia Sans Extra Condensed 500, 행간 0.94~0.96. H1 clamp(3.4rem, 7.6vw, 6.6rem), H2 clamp(2.6rem, 5.4vw, 4.4rem).
타이머 숫자: Sofia Sans Extra Condensed 200, 가늘고 키가 큰 숫자를 clamp(9.5rem, 36vw, 20rem), 행간 0.78. 이 서체의 고정폭 숫자는 너무 넓으므로, 각 글자를 고정 폭 칸에 하나씩 넣어 시간이 가는 동안 자리가 밀리지 않게 한다.
본문: Sofia Sans 400, 1.0625rem, 행간 1.6. 값과 버튼 라벨은 500~600. 전부 대문자이고 자간을 넓힌 라벨은 쓰지 않는다.

COMPONENTS:
- 타이머 자체의 조작 요소만 둔다: 둥근 시작/일시정지 버튼 하나, 밑줄 텍스트로 된 초기화, 집중 길이용 range 슬라이더(5~60분, 5분 단위), 빛 장면용 둥근 색 스와치 4개와 그 옆의 선택한 장면 이름.
- 타이머 밖의 동작은 밑줄 텍스트 링크로 둔다.
- 알약 버튼, 칩, 카드는 쓰지 않는다.

LAYOUT:
- 첫 화면: 가운데 정렬된 한 단. 제품 이름, 제목, 텍스트 링크 2개를 먼저 두고, 그 아래에 글래스 타이머를 페이지의 주인공으로 둔다.
- 그 아래는 모두 평평하게: 집중과 휴식의 순서를 길이 비율로 보여 주는 막대(분 단위 숫자는 압축 서체로), 줄로 된 기록, 기기별 줄과 가격 한 줄.
- 줄은 1px 선으로 나눈다. 같은 모양의 카드 격자는 쓰지 않는다.

MOTION:
- 오로라는 24초에 걸쳐 흐른다. 타이머는 1초마다 바뀐다.
- prefers-reduced-motion에서는 흐름을 멈춘다.

FORBIDDEN:
- 글래스 적층, 두 장 이상의 글래스 패널, 패널의 blur 30px 초과
- 알약 모양 버튼, 칩 줄, 둥근 테두리 카드
- 페이지 색만 바꾸는 색 칩 줄. 장면 선택은 제품의 설정이어야 한다
- 제목의 한 단어만 색을 바꾸기, 호수 표기, 도장, 흐르는 띠
- 제목마다 붙는 작은 라벨

OUTPUT:
1) 네 가지 빛 장면을 포함한 CSS custom properties
2) 시맨틱 HTML과 CSS, 동작하는 타이머
3) 320px까지 가로 스크롤 없는 반응형
4) 보이는 포커스, 라벨이 있는 조작 요소, 동작 줄이기 지원`,
  ja: `Holo × Glass フュージョンで、実在しそうな製品ページを1枚デザインしてください: ゆっくり動くオーロラの上に、フロストガラスのパネルが1枚浮かぶダークページ。

もともと1枚のパネルとして浮かぶ製品(タイマー、音楽プレーヤー、天気の要約など)を1つ決め、その製品の実際の内容を書くこと。ページはその製品のページとして読めること。自分のスタイルを説明するページにしないこと。

TOKENS:
--bg: #080a12
--ink: #ffffff
--muted: rgba(255,255,255,0.7)
--line: rgba(255,255,255,0.28)
--accent と補助色2つを、光のシーンごとに決める:
  夜明け #a5e3ff / #b9a4ff / #ff9ec4
  森 #9ff0c9 / #5ec7c0 / #c7f08c
  ライラック #d9b8ff / #a68cff / #ffb3e6
  夕暮れ #ffb199 / #ff8fb3 / #9c8cff

雰囲気:
- パネルの背後に、シーンの3色でぼかした radial の面を3つ置く。
- この光には意味を持たせる。明るさが製品の状態(ここでは残り時間)に従う。

ガラスパネルは1枚だけ:
- rgba(14,16,28,0.34) の塗り、rgba(255,255,255,0.36) の1px線、backdrop-filter blur(24px) saturate(140%)、radius 30px。暗い塗りは、光が最も明るいときも文字を読みやすく保つ。
- このパネルが動く製品そのもの: 実際に動くタイマー。時間が先頭に来て、次に「4回中N回目」付きのモード表示、細い進行線、操作部が続く。
- ページのどこにも2枚目のガラスパネルを置かない。

TYPOGRAPHY:
2つの書体ファミリーを使う。見出し、セクション見出し、時間などの数字は Sofia Sans Extra Condensed、本文とラベルは Sofia Sans。
見出し: Sofia Sans Extra Condensed 500、行間 0.94〜0.96。H1 clamp(3.4rem, 7.6vw, 6.6rem)、H2 clamp(2.6rem, 5.4vw, 4.4rem)。
タイマーの数字: Sofia Sans Extra Condensed 200、細く縦に長い数字を clamp(9.5rem, 36vw, 20rem)、行間 0.78。この書体の等幅数字は幅が広すぎるため、各文字を固定幅のマスに1つずつ入れ、数えている間も時間がずれないようにする。
本文: Sofia Sans 400、1.0625rem、行間 1.6。値とボタンのラベルは 500〜600。全大文字で字間を空けたラベルは使わない。

COMPONENTS:
- タイマー自体の操作だけ: 丸い開始/一時停止ボタン1つ、下線付きテキストのリセット、集中時間のレンジスライダー（5〜60分、5分刻み）、光の丸い色スウォッチ4つと、その横に選んだシーン名。
- タイマーの外の操作は下線付きテキストリンクにする。
- ピル型ボタン、チップ、カードは使わない。

LAYOUT:
- ヒーロー: 中央揃えの一段組み。製品名、見出し、テキストリンク2つを先に置き、その下にガラスのタイマーをページの主役として配置。
- ヒーローの下はすべてフラット: 集中と休憩の順番を長さの比率で示すバー（分の数字は圧縮書体）、行で並べた記録、機器ごとの行と価格1行。
- 行は1pxの線で区切る。同じ形のカードを並べたグリッドは使わない。

MOTION:
- オーロラは24秒かけて漂う。タイマーは1秒ごとに変わる。
- prefers-reduced-motion では漂いを止める。

FORBIDDEN:
- ガラスの重ね置き、2枚以上のガラスパネル、パネルの blur 30px 超え
- ピル型ボタン、チップ列、角丸の枠付きカード
- ページの色を変えるだけのカラーチップ列。シーン選択は製品の設定であること
- 見出しの1語だけ色を変えること、号数表記、スタンプ、流れる帯
- すべての見出しの上に付く小さなラベル

OUTPUT:
1) 4つの光のシーンを含む CSS custom properties
2) セマンティックな HTML と CSS、動くタイマー
3) 320pxまで横スクロールのないレスポンシブ
4) 見えるフォーカス、ラベル付きの操作要素、reduced-motion 対応`,
};

const clock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

const fill = (text: string, values: Record<string, number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

// The condensed face has no narrow tabular figures, so every character of a time
// gets its own fixed-width cell. The cells are hidden from assistive technology:
// the caller gives the whole value a name or a hidden text copy.
function Digits({ value }: { value: string }) {
  return [...value].map((char, index) => (
    <span key={index} className={/\d/.test(char) ? 'hg-digit' : 'hg-digit hg-digit--mark'} aria-hidden="true">{char}</span>
  ));
}

interface TimerState {
  minutes: number;
  mode: 'focus' | 'rest';
  left: number;
  running: boolean;
  notice: 'focusDone' | 'longRest' | 'restDone' | null;
  /** Focus blocks finished in the current cycle. */
  done: number;
}

type TimerAction = { type: 'tick' } | { type: 'toggle' } | { type: 'reset' } | { type: 'length'; minutes: number };

const restSeconds = (done: number) => (done === FOCUS_BLOCKS ? LONG_BREAK_SECONDS : BREAK_SECONDS);

const blockSeconds = (state: Pick<TimerState, 'mode' | 'minutes' | 'done'>) => (state.mode === 'focus' ? state.minutes * 60 : restSeconds(state.done));

// One place decides what the timer does next. When a block ends the timer moves
// to the following one by itself: a break after focus, a long break after the
// fourth focus block, then the first focus block again.
function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'tick':
      if (!state.running) return state;
      if (state.left > 1) return { ...state, left: state.left - 1 };
      if (state.mode === 'focus') {
        const done = state.done + 1;
        return { ...state, mode: 'rest', done, left: restSeconds(done), notice: done === FOCUS_BLOCKS ? 'longRest' : 'focusDone' };
      }
      return { ...state, mode: 'focus', done: state.done === FOCUS_BLOCKS ? 0 : state.done, left: state.minutes * 60, notice: 'restDone' };
    case 'toggle':
      return { ...state, running: !state.running, notice: null };
    case 'reset':
      return { ...state, running: false, left: blockSeconds(state), notice: null };
    case 'length':
      return { minutes: action.minutes, mode: 'focus', left: action.minutes * 60, running: false, notice: null, done: 0 };
  }
}

const INITIAL_TIMER: TimerState = { minutes: LENGTH.initial, mode: 'focus', left: LENGTH.initial * 60, running: false, notice: null, done: 0 };

export function PortedFusionHoloGlassPage({ lang }: PortedStylePageProps) {
  const [sceneId, setSceneId] = useState(SCENES[0].id);
  const [timer, dispatch] = useReducer(timerReducer, INITIAL_TIMER);
  const { minutes, mode, left, running, notice, done } = timer;
  const t = (text: Tri) => text[lang];

  const scene = SCENES.find((item) => item.id === sceneId) ?? SCENES[0];
  const total = blockSeconds(timer);
  const time = clock(left);
  // During a break `done` is the focus block that has just ended.
  const position = fill(t(mode === 'focus' ? TIMER.block : TIMER.afterBlock), { n: mode === 'focus' ? done + 1 : done, total: FOCUS_BLOCKS });
  const lengthText = fill(t(TIMER.minutes), { n: minutes });

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const pageVars = {
    '--hg-a': scene.a,
    '--hg-b': scene.b,
    '--hg-c': scene.c,
    // 유리 뒤의 빛은 남은 시간만큼 밝다.
    '--hg-light': (0.22 + 0.4 * (left / total)).toFixed(3),
  } as CSSProperties;

  const cycleTotal = CYCLE.blocks.reduce((sum, value) => sum + value, 0);

  return (
    <FusionShell
      fusionId="fusion-holo-glass"
      lang={lang}
      tone="dark"
      accent={scene.a}
      prev={{ href: '/pages/fusion-editorial-terminal.html', label: 'Editorial × Terminal' }}
      next={{ href: '/pages/fusion-kinetic-brutal.html', label: 'Kinetic × Brutal' }}
      prompts={PROMPTS}
    >
      <div className="hg" style={pageVars}>
        <section className="hg-hero" aria-labelledby="hg-title">
          <div className="hg-hero__copy">
            <div className="hg-hero__brand">Pane</div>
            <h1 id="hg-title">{t(HERO.title)}</h1>
            <p className="hg-hero__lede">{t(HERO.lede)}</p>
            <div className="hg-hero__jump">
              <a className="hg-link" href="#hg-cycle">{t(HERO.how)}</a>
              <a className="hg-link" href="#hg-get">{t(HERO.get)}</a>
            </div>
          </div>

          <div className="hg-stage">
            <div className="hg-aurora" aria-hidden="true" />
            <div className="hg-pane" id="hg-timer">
              <div className="hg-pane__time" role="timer" aria-label={`${t(TIMER.remaining)} ${time}`}>
                <Digits value={time} />
              </div>
              <div className="hg-pane__mode">
                <b>{t(mode === 'focus' ? TIMER.focus : TIMER.rest)}</b>
                <span>{position}</span>
              </div>
              <div className="hg-pane__meter" aria-hidden="true"><i style={{ transform: `scaleX(${left / total})` }} /></div>
              <div className="hg-pane__run">
                <button type="button" className="hg-pane__go" onClick={() => dispatch({ type: 'toggle' })}>
                  {t(running ? TIMER.pause : TIMER.start)}
                </button>
                <button type="button" className="hg-pane__reset" onClick={() => dispatch({ type: 'reset' })}>{t(TIMER.reset)}</button>
              </div>
              <div className="hg-pane__notice" role="status">{notice ? t(TIMER[notice]) : ''}</div>

              <div className="hg-set">
                <label className="hg-set__name" htmlFor="hg-length">{t(TIMER.length)}</label>
                <div className="hg-slider">
                  <input
                    id="hg-length"
                    type="range"
                    min={LENGTH.min}
                    max={LENGTH.max}
                    step={LENGTH.step}
                    value={minutes}
                    aria-valuetext={lengthText}
                    onChange={(event) => dispatch({ type: 'length', minutes: event.currentTarget.valueAsNumber })}
                  />
                </div>
                <output className="hg-set__value" htmlFor="hg-length">{lengthText}</output>
              </div>
              <div className="hg-set">
                <span className="hg-set__name" id="hg-light-label">{t(TIMER.scene)}</span>
                <div className="hg-lights" role="group" aria-labelledby="hg-light-label">
                  {SCENES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="hg-lights__swatch"
                      style={{ '--hg-s-a': item.a, '--hg-s-b': item.b, '--hg-s-c': item.c } as CSSProperties}
                      aria-pressed={item.id === sceneId}
                      aria-label={t(item.name)}
                      onClick={() => setSceneId(item.id)}
                    />
                  ))}
                </div>
                <span className="hg-set__value">{t(scene.name)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="hg-section" id="hg-cycle" aria-labelledby="hg-cycle-title">
          <h2 id="hg-cycle-title">{t(CYCLE.title)}</h2>
          <p className="hg-section__body">{t(CYCLE.body)}</p>
          <ol className="hg-cycle" aria-label={t(CYCLE.title)}>
            {CYCLE.blocks.map((length, index) => {
              const focus = index % 2 === 0;
              return (
                <li key={index} className={focus ? 'is-focus' : undefined} style={{ flexGrow: length, flexBasis: `${(length / cycleTotal) * 100}%` }}>
                  <span className="hg-cycle__bar" />
                  <span className="hg-cycle__label">
                    <span className="hg-cycle__time"><b>{length}</b><span className="hg-cycle__unit">{t(CYCLE.minutes)}</span></span>{' '}
                    <span className="hg-cycle__word">{t(focus ? TIMER.focus : TIMER.rest)}</span>
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="hg-section__body">{t(CYCLE.total)}</p>
        </section>

        <section className="hg-section" aria-labelledby="hg-log-title">
          <h2 id="hg-log-title">{t(LOG.title)}</h2>
          <p className="hg-section__body">{t(LOG.body)}</p>
          <ul className="hg-log">
            {LOG.rows.map((row) => (
              <li key={row.time} className={row.state === 'now' ? 'is-now' : undefined}>
                <time className="hg-log__time" dateTime={row.time}>
                  <span className="hg-sr">{row.time}</span>
                  <Digits value={row.time} />
                </time>
                <span className="hg-log__what">{t(row.what)}</span>
                <span className="hg-log__length">{t(LOG.length)}</span>
                <span className="hg-log__state">{t(LOG.state[row.state])}</span>
              </li>
            ))}
          </ul>
          <p className="hg-log__sum">{t(LOG.sum)}</p>
        </section>

        <section className="hg-section" id="hg-get" aria-labelledby="hg-get-title">
          <h2 id="hg-get-title">{t(GET.title)}</h2>
          <dl className="hg-devices">
            {GET.rows.map((row) => (
              <div key={row.device}>
                <dt>{row.device}</dt>
                <dd>{t(row.body)}</dd>
              </div>
            ))}
          </dl>
          <p className="hg-price">{t(GET.price)}</p>
          <p className="hg-section__body">{t(GET.priceNote)}</p>
          <p className="hg-get__action"><a className="hg-link" href="#hg-timer">{t(GET.action)}</a></p>
        </section>

        <footer className="hg-footer">© 2026 Pane</footer>
      </div>
    </FusionShell>
  );
}
