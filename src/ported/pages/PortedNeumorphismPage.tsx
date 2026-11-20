import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedNeumorphismPage.css';

// One real screen in the Neumorphism style: Hearth, the thermostat of one house on a
// Friday evening. Only what you press, turn or drag has depth: the dial, the step keys,
// the mode keys and the schedule markers are raised; the chosen mode and the chosen room
// are pressed in. Text, lists and the charts stay flat on the grey. Orange means heat and
// teal means cool: on the dial only while it works, on the chosen Heat or Cool key while
// that mode is on. Names are set in Chivo, every reading (temperatures, times, kWh) in
// Chivo Mono.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;
type Mode = 'heat' | 'cool' | 'auto' | 'off';
type Action = 'heating' | 'cooling' | 'resting' | 'off';
type RoomId = 'living' | 'bedroom' | 'study' | 'bathroom';

interface Setting {
  name: Tri;
  start: number;
  temp: number;
}

interface Room {
  id: RoomId;
  name: Tri;
  phrase: Tri;
  now: number;
  settings: Setting[];
}

// The screen is frozen at one moment: Friday, 19:42.
const NOW = 19 * 60 + 42;
const DAY = 24 * 60;
const MIN_C = 10;
const MAX_C = 30;
const STEP_C = 0.5;
const PAGE_C = 2;
// A new target is read out once it has stopped changing for this long, so a held arrow
// key, quick presses of a step key or a turn of the dial are spoken once.
const SETTLE_MS = 600;
// The scale runs 270 degrees for 20 °C, with 20 °C at the top.
const DEG_PER_C = 13.5;
// How fast the house warms up and cools down, in °C per minute.
const HEAT_RATE = 0.075;
const COOL_RATE = 0.06;
// Schedule markers move in quarter hours and keep half an hour between two settings.
const SLOT = 15;
const PAGE_SLOT = 60;
const GAP = 30;
// The drawn schedule maps 16 to 22 °C onto a view box 70 units high, drawn 140px high.
const plotY = (temp: number) => 50 - (temp - 17) * 10;
const PLOT_TOP = 30;
// A block shorter than this has no room for its temperature inside it.
const LABEL_MIN = 120;

const HOUSE = {
  name: 'Hearth',
  address: { en: '14 Alder Road', ko: '14 Alder Road', ja: '14 Alder Road' },
  outside: { en: '6 °C outside', ko: '외부 6 °C', ja: '屋外 6 °C' },
} as const;

const ROOMS: Room[] = [
  {
    id: 'living',
    name: { en: 'Living room', ko: '거실', ja: 'リビング' },
    phrase: { en: 'the living room', ko: '거실', ja: 'リビング' },
    now: 19.8,
    settings: [
      { name: { en: 'Morning', ko: '아침', ja: '朝' }, start: 6 * 60 + 30, temp: 21 },
      { name: { en: 'Out at work', ko: '출근 중', ja: '外出中' }, start: 9 * 60, temp: 18 },
      { name: { en: 'Evening', ko: '저녁', ja: '夕方' }, start: 17 * 60 + 30, temp: 21.5 },
      { name: { en: 'Night', ko: '밤', ja: '夜' }, start: 23 * 60, temp: 17 },
    ],
  },
  {
    id: 'bedroom',
    name: { en: 'Bedroom', ko: '침실', ja: '寝室' },
    phrase: { en: 'the bedroom', ko: '침실', ja: '寝室' },
    now: 17.4,
    settings: [
      { name: { en: 'Waking up', ko: '기상', ja: '起床' }, start: 6 * 60 + 30, temp: 18 },
      { name: { en: 'Day', ko: '낮', ja: '日中' }, start: 8 * 60 + 30, temp: 17 },
      { name: { en: 'Bedtime', ko: '취침', ja: '就寝' }, start: 21 * 60 + 30, temp: 18.5 },
      { name: { en: 'Night', ko: '밤', ja: '夜' }, start: 23 * 60 + 30, temp: 16 },
    ],
  },
  {
    id: 'study',
    name: { en: 'Study', ko: '서재', ja: '書斎' },
    phrase: { en: 'the study', ko: '서재', ja: '書斎' },
    now: 18.9,
    settings: [
      { name: { en: 'Working', ko: '작업', ja: '作業' }, start: 8 * 60, temp: 20 },
      { name: { en: 'Afternoon', ko: '오후', ja: '午後' }, start: 12 * 60 + 30, temp: 19.5 },
      { name: { en: 'Evening', ko: '저녁', ja: '夕方' }, start: 18 * 60, temp: 19 },
      { name: { en: 'Night', ko: '밤', ja: '夜' }, start: 22 * 60, temp: 16 },
    ],
  },
  {
    id: 'bathroom',
    name: { en: 'Bathroom', ko: '욕실', ja: '浴室' },
    phrase: { en: 'the bathroom', ko: '욕실', ja: '浴室' },
    now: 20.6,
    settings: [
      { name: { en: 'Morning', ko: '아침', ja: '朝' }, start: 6 * 60, temp: 22 },
      { name: { en: 'Day', ko: '낮', ja: '日中' }, start: 8 * 60 + 30, temp: 18 },
      { name: { en: 'Evening', ko: '저녁', ja: '夕方' }, start: 19 * 60, temp: 21 },
      { name: { en: 'Night', ko: '밤', ja: '夜' }, start: 22 * 60 + 30, temp: 17 },
    ],
  },
];

const CONTROL = {
  modes: { en: 'Mode', ko: '모드', ja: 'モード' },
  dial: { en: 'Target temperature for {room}', ko: '{room} 목표 온도', ja: '{room}の目標温度' },
  value: { en: '{t} °C, room is {now} °C', ko: '{t} °C, 실내 {now} °C', ja: '{t} °C、室温 {now} °C' },
  valueOff: { en: 'Off, room is {now} °C', ko: '끔, 실내 {now} °C', ja: 'オフ、室温 {now} °C' },
  reading: { en: 'Now {t}°', ko: '현재 {t}°', ja: '現在 {t}°' },
  cooler: { en: 'Half a degree cooler', ko: '0.5 °C 낮추기', ja: '0.5 °C 下げる' },
  warmer: { en: 'Half a degree warmer', ko: '0.5 °C 높이기', ja: '0.5 °C 上げる' },
} satisfies Record<string, Tri>;

type StatusKey = 'heating' | 'cooling' | 'restingHeat' | 'restingCool' | 'off';

// {t} is the target, {now} the room's temperature, {time} when the room gets there.
const STATUS: Record<StatusKey, { lead: Tri; rest: Tri }> = {
  heating: {
    lead: { en: 'Heating to {t} °C.', ko: '{t} °C까지 난방합니다.', ja: '{t} °Cまで暖房します。' },
    rest: { en: 'Warm by about {time}.', ko: '{time}쯤 따뜻해집니다.', ja: '{time}頃に暖まります。' },
  },
  cooling: {
    lead: { en: 'Cooling to {t} °C.', ko: '{t} °C까지 냉방합니다.', ja: '{t} °Cまで冷房します。' },
    rest: { en: 'Cool by about {time}.', ko: '{time}쯤 시원해집니다.', ja: '{time}頃に涼しくなります。' },
  },
  restingHeat: {
    lead: { en: 'Set to {t} °C.', ko: '{t} °C로 설정되어 있습니다.', ja: '{t} °Cに設定されています。' },
    rest: {
      en: 'The room is warm enough, so the heating is resting.',
      ko: '실내가 충분히 따뜻해서 난방은 대기 중입니다.',
      ja: '室温が十分に高いため、暖房は待機中です。',
    },
  },
  restingCool: {
    lead: { en: 'Set to {t} °C.', ko: '{t} °C로 설정되어 있습니다.', ja: '{t} °Cに設定されています。' },
    rest: {
      en: 'The room is cool enough, so the cooling is resting.',
      ko: '실내가 충분히 시원해서 냉방은 대기 중입니다.',
      ja: '室温が十分に低いため、冷房は待機中です。',
    },
  },
  off: {
    lead: { en: 'Off.', ko: '꺼져 있습니다.', ja: 'オフになっています。' },
    rest: {
      en: 'The room is {now} °C. Frost protection heats it if it falls below 7 °C.',
      ko: '실내는 {now} °C입니다. 7 °C 아래로 떨어지면 동파 방지 기능이 난방합니다.',
      ja: '室温は {now} °Cです。7 °Cを下回ると凍結防止機能が暖房します。',
    },
  },
};

const UNTIL = {
  drops: {
    en: 'Holds until {time}, then drops to {t}°.',
    ko: '{time}까지 유지한 뒤 {t}°로 내려갑니다.',
    ja: '{time}まで維持し、その後 {t}°に下がります。',
  },
  rises: {
    en: 'Holds until {time}, then rises to {t}°.',
    ko: '{time}까지 유지한 뒤 {t}°로 올라갑니다.',
    ja: '{time}まで維持し、その後 {t}°に上がります。',
  },
  stays: {
    en: 'Holds until {time}, then stays at {t}°.',
    ko: '{time}까지 유지한 뒤 {t}°에서 그대로 유지합니다.',
    ja: '{time}まで維持し、その後も {t}°のままです。',
  },
  off: {
    en: 'Choose Heat, Cool or Auto to set a temperature.',
    ko: '난방, 냉방 또는 자동을 선택하면 온도를 설정할 수 있습니다.',
    ja: '暖房、冷房、自動のいずれかを選ぶと温度を設定できます。',
  },
} satisfies Record<string, Tri>;

const MODES: Array<{ id: Mode; label: Tri }> = [
  { id: 'heat', label: { en: 'Heat', ko: '난방', ja: '暖房' } },
  { id: 'cool', label: { en: 'Cool', ko: '냉방', ja: '冷房' } },
  { id: 'auto', label: { en: 'Auto', ko: '자동', ja: '自動' } },
  { id: 'off', label: { en: 'Off', ko: '끔', ja: 'オフ' } },
];

const ROOM_LIST = {
  title: { en: 'Rooms', ko: '방', ja: '部屋' },
  heating: { en: 'Heating to {t}°', ko: '{t}°까지 난방', ja: '{t}°まで暖房' },
  cooling: { en: 'Cooling to {t}°', ko: '{t}°까지 냉방', ja: '{t}°まで冷房' },
  resting: { en: 'Set to {t}°', ko: '{t}°로 설정', ja: '{t}°に設定' },
  off: { en: 'Off', ko: '끔', ja: 'オフ' },
  now: { en: 'Now', ko: '현재', ja: '現在' },
} satisfies Record<string, Tri>;

const SCHEDULE = {
  title: { en: 'Today', ko: '오늘', ja: '今日' },
  note: {
    en: 'The weekday schedule for {room}. Drag a marker along the day to change when a setting starts.',
    ko: '{room} 평일 일정입니다. 마커를 하루 위에서 끌어 설정이 시작되는 시간을 바꿉니다.',
    ja: '{room}の平日スケジュールです。マーカーを一日の上でドラッグして、設定の開始時刻を変更します。',
  },
  starts: { en: '{name} starts', ko: '{name} 시작', ja: '{name} 開始' },
  now: { en: 'Now {time}', ko: '현재 {time}', ja: '現在 {time}' },
  until: { en: 'Now, until {time}', ko: '현재, {time}까지', ja: '現在、{time}まで' },
} satisfies Record<string, Tri>;

const HOURS = ['00', '06', '12', '18', '24'];

const ENERGY = {
  title: { en: 'Energy use', ko: '에너지 사용량', ja: 'エネルギー使用量' },
  note: {
    en: '82.5 kWh in the last seven days, about £20.20 at 24.5p per kWh.',
    ko: '최근 7일 동안 82.5 kWh, kWh당 24.5p 기준 약 £20.20입니다.',
    ja: '過去7日間で82.5 kWh、kWhあたり24.5pで約£20.20です。',
  },
  list: { en: 'Energy per day', ko: '일별 에너지 사용량', ja: '日別のエネルギー使用量' },
  after: {
    en: 'Today is counted up to 19:42. Sunday used the most; it was the coldest day, 1 °C at noon.',
    ko: '오늘은 19:42까지 집계합니다. 일요일 사용량이 가장 많았습니다. 이날이 가장 추웠고, 정오에 1 °C였습니다.',
    ja: '今日は19:42までを集計しています。日曜日の使用量が最も多く、最も寒い日で、正午は1 °Cでした。',
  },
} satisfies Record<string, Tri>;

const DAYS: Array<{ day: Tri; kwh: number; today?: boolean }> = [
  { day: { en: 'Sat', ko: '토', ja: '土' }, kwh: 12.6 },
  { day: { en: 'Sun', ko: '일', ja: '日' }, kwh: 14.1 },
  { day: { en: 'Mon', ko: '월', ja: '月' }, kwh: 11.8 },
  { day: { en: 'Tue', ko: '화', ja: '火' }, kwh: 10.9 },
  { day: { en: 'Wed', ko: '수', ja: '水' }, kwh: 12.2 },
  { day: { en: 'Thu', ko: '목', ja: '木' }, kwh: 13.5 },
  { day: { en: 'Fri', ko: '금', ja: '金' }, kwh: 7.4, today: true },
];

const FOOTER = {
  link: {
    en: 'Heat pump connected. Last report at 19:41.',
    ko: '히트펌프 연결됨. 마지막 보고 19:41.',
    ja: 'ヒートポンプ接続済み。最終報告 19:41。',
  },
  device: { en: 'Hearth H2, software 4.2.1', ko: 'Hearth H2, 소프트웨어 4.2.1', ja: 'Hearth H2、ソフトウェア 4.2.1' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in Neumorphism style — a soft grey control surface where only the things you press, turn or drag have depth.

Pick a believable subject whose page is mostly controls, such as a thermostat, a hi-fi amplifier, a coffee machine or a lighting panel, and write its real content. The page must read as that product's own screen, never as a page about its style. Here: Hearth, the thermostat of one house at 14 Alder Road, on a Friday evening at 19:42.

COLOR TOKENS:
--bg: #e0e5ec
--surface: #edf1f6
--ink: #344055
--muted: #535e72
--line: rgba(52, 64, 85, 0.32)
--edge: #6f7b8f (the hard edge on the shadow side of every raised or pressed shape)
--hi: #ffffff
--lo: #a3b1c6
--face: linear-gradient(145deg, #e9eef5, #d6dce5)
--heat: #a8420a text, #d45a10 marks, #f47b2c lamp
--cool: #0e6f6b text, #13827c marks, #3cc4bb lamp
--bar: #56627a
No other colours, except the ink at low opacity for shading and hover, each lamp colour at low opacity for its glow, and three greys for what is off: #c3cbd7 an unlit lamp, #a9b2c0 the dial when off, #8d97a8 the sign on a step key at its limit.

DEPTH:
- Only what you press, turn or drag is raised: the dial, the two step keys, the four mode keys, the schedule markers.
- Raised: background var(--face), a var(--lo) shadow down-right and a var(--hi) shadow up-left, deeper for bigger parts (knob 12px 12px 24px, keys 5px 5px 11px, markers 2px 2px 4px), and a 1px border that is white on the light side and var(--edge) on the shadow side.
- Pressed (the chosen mode, the chosen room, the dial's well, the marker track): background var(--bg), box-shadow inset 4px 4px 9px var(--lo), inset -4px -4px 9px var(--hi), the border colours swapped; the marker track and the lamp's socket are shallower, inset 2px 2px 4px.
- The hard edge keeps every soft shape at 3:1 or more against the grey.
- Text, lists and charts are flat on the background. Colour marks only heat and cool: the dial's span and lamp are orange while heating and teal while cooling, and the chosen Heat or Cool key keeps its orange or teal while that mode is on; grey when off.

TYPOGRAPHY:
Names, headings and text: Chivo. Room name 700, 2.125rem, line-height 1.02, tracking -0.035em; section headings 700, 1.375rem; product name 800, 1.4375rem, tracking -0.045em; body 400, 1rem, line-height 1.5; mode keys 600, the chosen one 800.
Every reading in Chivo Mono, so readings sit in fixed columns like an instrument panel: the dial's figures, room temperatures, schedule times and temperatures, kWh. Figures inside sentences and the schedule's Now mark stay in Chivo. The dial figure 300 at 16% of the dial's width, tracking -0.06em; room readings 400, 1.4375rem.
Text at least 16px. Only labels inside the drawings, hidden from screen readers, are smaller: the schedule's hours and block temperatures 14px, its Now mark and the dial's 10 and 30 15px. The rows under the schedule and the dial's slider value say the same in real text.

LAYOUT:
- A top bar: the product name, the address and the outside temperature, on a 1px rule.
- Desktop: two columns with a 1px rule between them. Left: the room's control and the room list. Right: today's schedule and the week's energy. One column on phones.
- The control, centred: the room name, one status line (what it is doing and when the room gets there), the dial, a line saying how long the setting holds, and four mode keys in one row.
- The dial: a 270-degree scale from 10 to 30 °C with a tick every half degree and a longer one every 5; the span from the room's temperature to the target drawn in the working colour; a notch for the room's temperature; a raised knob in a pressed well, carrying the target figure, the room's temperature and a lamp at the target's angle; the two step keys in the dial's lower corners.

COMPONENTS:
- Dial: role="slider", 0.5 °C steps from 10 to 30, arrow keys, Page Up/Down for 2 °C, Home/End, and drag to turn it.
- Step keys −/+: round raised keys that press in while held.
- Mode keys Heat, Cool, Auto, Off: a radio group with arrow keys; the chosen key is pressed in, its label and lamp orange for Heat and teal for Cool, and for Auto the colour of what it is doing. Off lights nothing and greys the dial.
- Room list: flat rows on rules, the name and its state on the left, the room's temperature in mono on the right; the chosen room is pressed in and the dial shows its values.
- Schedule: the day's settings as a step line over a 24-hour axis, the setting in force drawn heavier under a "Now" mark; raised markers on a pressed track, which you drag or move with the arrow keys to change when a setting starts; the same settings as rows of time, name and temperature. Choosing a row shades its block in the drawing.
- Energy: seven flat bars with the figure above each; today is hatched because the day is not over.

MOTION:
- Keys press in over 120ms. The dial's marks follow the target as it turns, without easing.
- prefers-reduced-motion removes the transitions.

FORBIDDEN:
- Raised or pressed cards around text or charts, and a grid of identical rounded panels
- Soft shapes without a hard edge, dissolving into the grey
- Colour on anything other than the heat and cool states above
- Pills, small labels above headings, all-caps tracked labels
- A palette switcher, a sampler of unrelated widgets (music player, weather, clock), or any heading about the style
- Grey text under 4.5:1 on the grey

OUTPUT:
1) CSS custom properties for the colours and the raised and pressed shadows
2) Semantic HTML and CSS
3) Responsive layout down to 320px with no horizontal scroll
4) A working dial, keys, room list and schedule, with keyboard support, visible focus and reduced-motion support`;

const PROMPT_KO = `뉴모피즘 스타일로 실제 페이지 하나를 디자인한다. 누르거나, 돌리거나, 드래그하는 요소만 깊이감을 갖는 부드러운 회색 조작 화면이다.

대부분이 조작 요소로 이루어진 현실적인 주제를 고르고, 실제 콘텐츠를 작성한다. 예: 온도조절기, 하이파이 앰프, 커피머신, 조명 패널. 페이지는 그 제품 자체의 화면처럼 읽혀야 하며, 스타일에 관한 페이지처럼 보이면 안 된다. 이 경우: 14 Alder Road 주택의 온도조절기 Hearth, 금요일 저녁 19:42.

COLOR TOKENS:
--bg: #e0e5ec
--surface: #edf1f6
--ink: #344055
--muted: #535e72
--line: rgba(52, 64, 85, 0.32)
--edge: #6f7b8f (모든 돌출 또는 눌린 형태의 그림자 쪽 단단한 가장자리)
--hi: #ffffff
--lo: #a3b1c6
--face: linear-gradient(145deg, #e9eef5, #d6dce5)
--heat: #a8420a 글자, #d45a10 눈금, #f47b2c 표시등
--cool: #0e6f6b 글자, #13827c 눈금, #3cc4bb 표시등
--bar: #56627a
다른 색은 쓰지 않는다. 예외는 그림자와 호버에 쓰는 --ink의 낮은 불투명도, 각 표시등 색의 낮은 불투명도(빛 번짐용), 꺼진 상태의 회색 세 가지다: 켜지지 않은 표시등 #c3cbd7, 꺼진 다이얼 #a9b2c0, 단계 키 한계의 기호 #8d97a8.

DEPTH:
- 누르거나, 돌리거나, 드래그하는 것만 돌출시킨다: 다이얼, 두 개의 단계 키, 네 개의 모드 키, 일정 마커.
- 돌출: 배경 var(--face), 오른쪽 아래로 var(--lo) 그림자, 왼쪽 위로 var(--hi) 그림자를 준다. 큰 부품일수록 그림자를 깊게 한다(손잡이 12px 12px 24px, 키 5px 5px 11px, 마커 2px 2px 4px). 1px 테두리는 밝은 쪽이 흰색, 그림자 쪽이 var(--edge)다.
- 눌림 (선택된 모드, 선택된 방, 다이얼 홈, 마커 트랙): 배경 var(--bg), box-shadow inset 4px 4px 9px var(--lo), inset -4px -4px 9px var(--hi), 테두리 색은 서로 바꾼다. 마커 트랙과 표시등 홈은 더 얕게, inset 2px 2px 4px로 한다.
- 단단한 가장자리로 모든 부드러운 형태가 회색 배경 대비 3:1 이상을 유지한다.
- 텍스트, 목록, 차트는 배경 위에 평평하게 둔다. 색은 난방과 냉방만 나타낸다. 다이얼의 구간과 표시등은 난방 중 주황, 냉방 중 청록이며, 선택된 난방 또는 냉방 키는 그 모드가 켜져 있는 동안 주황 또는 청록을 유지한다. 꺼져 있으면 회색이다.

TYPOGRAPHY:
이름, 제목, 본문: Chivo. 방 이름 700, 2.125rem, line-height 1.02, tracking -0.035em; 섹션 제목 700, 1.375rem; 제품명 800, 1.4375rem, tracking -0.045em; 본문 400, 1rem, line-height 1.5; 모드 키 600, 선택된 키는 800.
모든 측정값과 수치는 Chivo Mono를 쓴다. 계기판처럼 고정된 열에 맞추기 위해서다: 다이얼 숫자, 방 온도, 일정의 시각과 온도, kWh. 문장 안의 숫자와 일정의 "현재" 표시는 Chivo를 쓴다. 다이얼 숫자는 300, 다이얼 너비의 16%, tracking -0.06em; 방 측정값은 400, 1.4375rem.
본문은 최소 16px. 그려진 일정 안의 라벨만 작으며 스크린 리더에서는 숨긴다: 일정의 시각과 구간 온도 14px, "현재" 표시와 다이얼의 10과 30은 15px. 일정 아래 행과 다이얼의 슬라이더 값이 같은 내용을 실제 텍스트로 담는다.

LAYOUT:
- 상단 바: 제품명, 주소, 외부 온도를 1px 선 위에 둔다.
- 데스크톱: 1px 선으로 나뉜 두 개의 열. 왼쪽: 방의 조작부와 방 목록. 오른쪽: 오늘의 일정과 한 주의 에너지. 휴대폰에서는 한 열.
- 조작부는 가운데 정렬: 방 이름, 상태 한 줄(무엇을 하고 있으며 방이 언제 목표에 도달하는지), 다이얼, 설정이 얼마나 유지되는지 알려주는 한 줄, 그리고 한 줄로 배열된 네 개의 모드 키.
- 다이얼: 10~30 °C를 잇는 270도 눈금. 0.5도마다 짧은 눈금, 5도마다 긴 눈금. 방 온도에서 목표 온도까지의 구간은 작동 색으로 그린다. 방 온도를 나타내는 노치. 눌린 홈 안의 돌출 손잡이에는 목표 숫자, 방 온도, 목표 각도의 표시등을 담는다. 다이얼 아래 모서리에 두 개의 단계 키.

COMPONENTS:
- 다이얼: role="slider", 10~30 °C까지 0.5 °C 단위, 화살표 키, Page Up/Down은 2 °C, Home/End, 드래그로 돌린다.
- 단계 키 −/+: 누르고 있는 동안 안으로 들어가는 둥근 돌출 키.
- 모드 키 난방, 냉방, 자동, 끔: 화살표 키로 움직이는 라디오 그룹. 선택된 키는 눌린 상태이며, 난방은 주황, 냉방은 청록으로 글자와 표시등에 색을 준다. 자동은 작동 중인 것의 색을 따른다. 끔은 아무것도 켜지 않고 다이얼을 회색으로 바꾼다.
- 방 목록: 선으로 구분된 평평한 행. 왼쪽에 이름과 상태, 오른쪽에 방 온도를 모노스페이스로. 선택된 방은 눌린 상태이며 다이얼이 그 값을 보여준다.
- 일정: 하루의 설정을 24시간 축 위의 계단선으로 그린다. 적용 중인 설정은 "현재" 표시 아래를 더 굵게 그린다. 눌린 트랙 위의 돌출 마커는 드래그하거나 화살표 키로 옮겨 설정 시작 시각을 바꾼다. 같은 설정을 시각, 이름, 온도의 행으로 보여준다. 행을 고르면 그림에서 해당 구간에 음영이 생긴다.
- 에너지: 각 막대 위에 수치를 붙인 평평한 막대 일곱 개. 오늘은 아직 하루가 끝나지 않았으므로 빗금으로 표시한다.

MOTION:
- 키는 120ms에 걸쳐 눌려 들어간다. 다이얼의 눈금은 돌아가면서 목표를 따라가며, 이징 없이 움직인다.
- prefers-reduced-motion에서는 전환 효과를 없앤다.

FORBIDDEN:
- 텍스트나 차트를 감싸는 돌출 또는 눌린 카드, 같은 모양의 둥근 패널을 늘어놓은 격자
- 단단한 가장자리 없이 회색 속으로 녹아드는 부드러운 형태
- 난방과 냉방 상태 외의 것에 쓰는 색
- 알약 모양 버튼, 제목 위의 작은 라벨, 대문자에 자간을 준 라벨
- 색상 전환기, 관계없는 위젯 모음(음악 플레이어, 날씨, 시계), 스타일에 관한 어떤 제목
- 회색 배경 위에서 4.5:1 미만인 회색 글자

OUTPUT:
1) 색과 돌출·눌림 그림자를 위한 CSS 사용자 정의 속성
2) 의미 기반 HTML과 CSS
3) 320px까지 가로 스크롤 없이 반응형 레이아웃
4) 작동하는 다이얼, 키, 방 목록, 일정. 키보드 지원, 보이는 포커스, reduced-motion 지원 포함`;

const PROMPT_JA = `ニューモーフィズムのスタイルで実在のページを1つデザインする。押す、回す、ドラッグする要素だけに奥行きがある、柔らかい灰色の操作画面である。

大半が操作部品からなる、実在しそうな題材を選び、実際の内容を書く。例: サーモスタット、ハイファイアンプ、コーヒーマシン、照明パネル。ページはその製品自身の画面に見えなければならず、スタイルについてのページに見えてはならない。この場合: 14 Alder Road の住宅のサーモスタット Hearth、金曜日の夕方19:42。

COLOR TOKENS:
--bg: #e0e5ec
--surface: #edf1f6
--ink: #344055
--muted: #535e72
--line: rgba(52, 64, 85, 0.32)
--edge: #6f7b8f（突出または押し込まれた形状すべての影側の硬い縁）
--hi: #ffffff
--lo: #a3b1c6
--face: linear-gradient(145deg, #e9eef5, #d6dce5)
--heat: #a8420a 文字, #d45a10 目盛り, #f47b2c 表示灯
--cool: #0e6f6b 文字, #13827c 目盛り, #3cc4bb 表示灯
--bar: #56627a
その他の色は使わない。例外は、影とホバーに使う --ink の低い不透明度、光の滲みに使う各表示灯色の低い不透明度、そして消灯時の3種類の灰色だけである: 点灯していない表示灯 #c3cbd7、オフ時のダイヤル #a9b2c0、ステップキーの上限の記号 #8d97a8。

DEPTH:
- 押す、回す、ドラッグするものだけを浮き上がらせる：ダイヤル、2つのステップキー、4つのモードキー、スケジュールのマーカー。
- 突出: 背景 var(--face)、右下に var(--lo) の影、左上に var(--hi) の影を付ける。大きな部品ほど影を深くする（つまみ 12px 12px 24px、キー 5px 5px 11px、マーカー 2px 2px 4px）。1pxの枠線は、明るい側が白、影の側が var(--edge) である。
- 押し込み（選択中のモード、選択中の部屋、ダイヤルの窪み、マーカーのトラック）: 背景 var(--bg)、box-shadow inset 4px 4px 9px var(--lo)、inset -4px -4px 9px var(--hi)、枠線の色は入れ替える。マーカーのトラックと表示灯の台座は浅く、inset 2px 2px 4px にする。
- 硬い縁によって、すべての柔らかい形状が灰色に対して3:1以上を保つ。
- テキスト、リスト、グラフは背景の上に平らに置く。色は暖房と冷房だけを示す。ダイヤルの区間と表示灯は、暖房中はオレンジ、冷房中はティールにする。選択中の暖房または冷房キーは、そのモードがオンの間オレンジまたはティールを保つ。オフのときはグレーにする。

TYPOGRAPHY:
名前、見出し、本文: Chivo。部屋名 700、2.125rem、line-height 1.02、tracking -0.035em; セクション見出し 700、1.375rem; 製品名 800、1.4375rem、tracking -0.045em; 本文 400、1rem、line-height 1.5; モードキー 600、選択中のものは 800。
すべての測定値と数値は Chivo Mono を使う。計器盤のように固定の列に揃えるため: ダイヤルの数字、部屋の測定値、スケジュールの時刻と温度、kWh。文中の数字とスケジュールの「現在」の印は Chivo を使う。ダイヤルの数字は 300、ダイヤル幅の16%、tracking -0.06em; 部屋の測定値は 400、1.4375rem。
テキストは最小16px。描画されたスケジュール内のラベルだけは小さく、スクリーンリーダーからは隠す: 時刻と区間の温度は14px、「現在」の印とダイヤルの10と30は15px。スケジュールの下の行とダイヤルのスライダー値が、同じ内容を実際のテキストで示す。

LAYOUT:
- 上部バー: 製品名、住所、屋外温度を1pxの罫線の上に置く。
- デスクトップ: 1pxの罫線で区切られた2列。左: 部屋の操作部と部屋の一覧。右: 今日のスケジュールと週間のエネルギー。スマートフォンでは1列。
- 操作部は中央揃え: 部屋の名前、状態を示す1行（何をしていて、いつ部屋が目標に達するか）、ダイヤル、設定がどのくらい保たれるかを示す1行、そして1列に並んだ4つのモードキー。
- ダイヤル: 10〜30 °Cを結ぶ270度の目盛り。0.5度ごとに短い目盛り、5度ごとに長い目盛り。部屋の温度から目標温度までの区間は作動色で描く。部屋の温度を示すノッチ。押し込まれた窪みの中の突出したつまみには、目標の数字、部屋の温度、目標の角度にある表示灯を載せる。ダイヤルの下の角に2つのステップキー。

COMPONENTS:
- ダイヤル: role="slider"、10〜30 °Cまで0.5 °C刻み、矢印キー、Page Up/Downは2 °C、Home/End、ドラッグで回す。
- ステップキー −/+: 押している間に沈み込む丸い突出キー。
- モードキー 暖房、冷房、自動、オフ: 矢印キーで操作するラジオグループ。選択中のキーは押し込まれ、ラベルと表示灯が暖房はオレンジ、冷房はティールになる。自動は作動中のものの色を使う。オフは何も点灯させず、ダイヤルをグレーにする。
- 部屋の一覧: 罫線で区切られたフラットな行。左に名前と状態、右に部屋の温度をモノスペースで。選択中の部屋は押し込まれ、ダイヤルがその値を示す。
- スケジュール: その日の設定を24時間軸上の階段状の線で描く。適用中の設定は「現在」の印の下で太く描く。押し込まれたトラック上の突出したマーカーは、ドラッグか矢印キーで動かし、設定の開始時刻を変える。同じ設定を時刻、名前、温度の行として並べる。行を選ぶと、描画上の対応する区間に網掛けが付く。
- エネルギー: 各バーの上に数値を付けたフラットなバー7本。今日はまだ一日が終わっていないため、斜線で示す。

MOTION:
- キーは120msかけて沈み込む。ダイヤルの目盛りは回転に合わせて目標を追い、イージングはかけない。
- prefers-reduced-motion のときはトランジションを取り除く。

FORBIDDEN:
- テキストやグラフを囲む突出または押し込まれたカード、同じ形の丸いパネルを並べたグリッド
- 硬い縁のない、灰色に溶け込む柔らかい形状
- 暖房と冷房の状態以外のものに付ける色
- ピル型のボタン、見出しの上の小さなラベル、大文字で字間を空けたラベル
- 配色切り替え、無関係なウィジェットの寄せ集め（音楽プレーヤー、天気、時計）、スタイルについての見出し
- 灰色の背景上で4.5:1を下回る灰色の文字

OUTPUT:
1) 色と突出・押し込みの影のための CSS カスタムプロパティ
2) セマンティックな HTML と CSS
3) 320pxまで横スクロールなしのレスポンシブレイアウト
4) 動作するダイヤル、キー、部屋の一覧、スケジュール。キーボード操作、見えるフォーカス、reduced-motion 対応を含む`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

const clock = (minutes: number) => {
  const m = ((Math.round(minutes) % DAY) + DAY) % DAY;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

const degrees = (temp: number) => (Number.isInteger(temp) ? String(temp) : temp.toFixed(1));

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** The setting in force at a minute of the day. Before the first start, the last setting of the day before still holds. */
const settingAt = (starts: number[], minute: number) =>
  starts.reduce((found, start, index) => (start <= minute ? index : found), starts.length - 1);

function actionFor(mode: Mode, target: number, now: number): Action {
  if (mode === 'off') return 'off';
  if (mode !== 'cool' && target > now) return 'heating';
  if (mode !== 'heat' && target < now) return 'cooling';
  return 'resting';
}

/** When the room reaches its target, rounded up to five minutes. */
function readyAt(action: Action, target: number, now: number) {
  const rate = action === 'heating' ? HEAT_RATE : COOL_RATE;
  const minutes = Math.ceil(Math.abs(target - now) / rate - 1e-9);
  return clock(Math.ceil((NOW + minutes) / 5) * 5);
}

function statusOf(mode: Mode, action: Action, target: number, now: number, lang: Lang) {
  const key: StatusKey = action === 'resting' ? (mode === 'cool' ? 'restingCool' : 'restingHeat') : action;
  const working = action === 'heating' || action === 'cooling';
  const values = { t: degrees(target), now: degrees(now), time: working ? readyAt(action, target, now) : '' };
  return { lead: fill(STATUS[key].lead[lang], values), rest: fill(STATUS[key].rest[lang], values) };
}

/** Each setting runs to the next start. The last one also covers the hours before the first start. */
function spansOf(starts: number[], index: number): Array<[number, number]> {
  const last = starts.length - 1;
  if (index < last) return [[starts[index], starts[index + 1]]];
  return [[starts[last], DAY], [0, starts[0]]];
}

const INITIAL_STARTS = Object.fromEntries(ROOMS.map((room) => [room.id, room.settings.map((setting) => setting.start)])) as Record<RoomId, number[]>;
const INITIAL_TARGETS = Object.fromEntries(
  ROOMS.map((room) => [room.id, room.settings[settingAt(INITIAL_STARTS[room.id], NOW)].temp]),
) as Record<RoomId, number>;

export function PortedNeumorphismPage({ lang }: PortedStylePageProps) {
  const [mode, setMode] = useState<Mode>('heat');
  const [roomId, setRoomId] = useState<RoomId>('living');
  const [targets, setTargets] = useState(INITIAL_TARGETS);
  const [starts, setStarts] = useState(INITIAL_STARTS);
  const [chosen, setChosen] = useState(() => settingAt(INITIAL_STARTS.living, NOW));
  // `n` gives every announcement its own node, so the same words said twice are read twice.
  const [announcement, setAnnouncement] = useState({ text: '', n: 0 });
  const modeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const scaleRef = useRef<HTMLDivElement>(null);
  // `shown` is the snapped target the drag last set, so a small move within one step sets nothing.
  const turn = useRef<{ pointer: number; angle: number; value: number; shown: number } | null>(null);
  const marker = useRef<{ pointer: number; index: number } | null>(null);
  const settle = useRef<number | undefined>(undefined);
  const t = (text: Tri) => text[lang];

  useEffect(() => () => window.clearTimeout(settle.current), []);

  const room = ROOMS.find((item) => item.id === roomId) ?? ROOMS[0];
  const target = targets[roomId];
  const action = actionFor(mode, target, room.now);
  const off = action === 'off';
  const status = statusOf(mode, action, target, room.now, lang);

  const roomStarts = starts[roomId];
  const last = roomStarts.length - 1;
  const nowIndex = settingAt(roomStarts, NOW);
  const nextIndex = (nowIndex + 1) % roomStarts.length;
  const nextTemp = room.settings[nextIndex].temp;
  const until = off
    ? t(UNTIL.off)
    : fill(t(nextTemp < target ? UNTIL.drops : nextTemp > target ? UNTIL.rises : UNTIL.stays), {
        time: clock(roomStarts[nextIndex]),
        t: degrees(nextTemp),
      });

  // The dial: the span between the room's temperature and the target is drawn in the
  // working colour and reaches across the whole tick of the target.
  const toDeg = (target - 20) * DEG_PER_C;
  const nowDeg = (room.now - 20) * DEG_PER_C;
  let spanFrom = 0;
  let span = 0;
  if (action === 'heating') {
    spanFrom = nowDeg;
    span = toDeg - nowDeg + 0.45;
  } else if (action === 'cooling') {
    spanFrom = toDeg - 0.45;
    span = nowDeg - toDeg + 0.45;
  }
  const dialStyle = {
    '--hh-now': `${nowDeg}deg`,
    '--hh-to': `${toDeg}deg`,
    '--hh-from': `${spanFrom}deg`,
    '--hh-span': `${span}deg`,
  } as CSSProperties;

  // An announcement said now replaces one still waiting for the target to settle.
  const announce = (prefix: string, next: { lead: string; rest: string }) => {
    window.clearTimeout(settle.current);
    setAnnouncement((current) => ({ text: `${prefix}${next.lead} ${next.rest}`, n: current.n + 1 }));
  };

  const snap = (value: number) => clamp(Math.round(value / STEP_C) * STEP_C, MIN_C, MAX_C);

  // Sets a new target and reads the status line out once the target settles.
  const changeTarget = (next: number) => {
    setTargets((current) => ({ ...current, [roomId]: next }));
    const nextStatus = statusOf(mode, actionFor(mode, next, room.now), next, room.now, lang);
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => announce('', nextStatus), SETTLE_MS);
  };

  // Keys and step keys: each press is its own event, so `target` is current.
  const stepTarget = (value: number) => {
    const next = snap(value);
    if (next !== target) changeTarget(next);
  };

  const chooseMode = (next: Mode) => {
    setMode(next);
    announce('', statusOf(next, actionFor(next, target, room.now), target, room.now, lang));
  };

  const chooseRoom = (id: RoomId) => {
    const next = ROOMS.find((item) => item.id === id) ?? ROOMS[0];
    setRoomId(id);
    setChosen(settingAt(starts[id], NOW));
    announce(`${t(next.name)}. `, statusOf(mode, actionFor(mode, targets[id], next.now), targets[id], next.now, lang));
  };

  // Turning the knob: the target follows the change of angle from where the pointer
  // went down, so a tap changes nothing and the dial turns like a real one.
  const angleAt = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - (box.left + box.width / 2);
    const y = event.clientY - (box.top + box.height / 2);
    return { angle: (Math.atan2(x, -y) * 180) / Math.PI, centre: Math.hypot(x, y) < box.width * 0.12 };
  };

  const onKnobDown = (event: PointerEvent<HTMLDivElement>) => {
    if (off || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    turn.current = { pointer: event.pointerId, angle: angleAt(event).angle, value: target, shown: target };
  };

  const onKnobMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = turn.current;
    if (!drag || drag.pointer !== event.pointerId) return;
    const { angle, centre } = angleAt(event);
    if (centre) return;
    let delta = angle - drag.angle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    drag.angle = angle;
    drag.value = clamp(drag.value + delta / DEG_PER_C, MIN_C, MAX_C);
    const next = snap(drag.value);
    if (next === drag.shown) return;
    drag.shown = next;
    changeTarget(next);
  };

  const endTurn = (event: PointerEvent<HTMLDivElement>) => {
    if (turn.current?.pointer === event.pointerId) turn.current = null;
  };

  const onKnobKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowUp: STEP_C,
      ArrowRight: STEP_C,
      ArrowDown: -STEP_C,
      ArrowLeft: -STEP_C,
      PageUp: PAGE_C,
      PageDown: -PAGE_C,
    };
    let next: number | undefined;
    if (event.key in steps) next = target + steps[event.key];
    else if (event.key === 'Home') next = MIN_C;
    else if (event.key === 'End') next = MAX_C;
    if (next === undefined) return;
    event.preventDefault();
    if (!off) stepTarget(next);
  };

  const onModeKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = MODES.findIndex((item) => item.id === mode);
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: MODES.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + MODES.length) % MODES.length;
    chooseMode(MODES[next].id);
    modeRefs.current[next]?.focus();
  };

  // Schedule markers: each one moves between its neighbours, half an hour clear of them.
  const moveStart = (index: number, minute: number) => {
    setStarts((current) => {
      const list = current[roomId];
      const min = index === 0 ? GAP : list[index - 1] + GAP;
      const max = index === list.length - 1 ? DAY - GAP : list[index + 1] - GAP;
      const value = clamp(Math.round(minute / SLOT) * SLOT, min, max);
      if (value === list[index]) return current;
      const next = list.slice();
      next[index] = value;
      return { ...current, [roomId]: next };
    });
  };

  const minuteAt = (clientX: number) => {
    const box = scaleRef.current?.getBoundingClientRect();
    return box ? ((clientX - box.left) / box.width) * DAY : null;
  };

  const onMarkerDown = (index: number) => (event: PointerEvent<HTMLSpanElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    marker.current = { pointer: event.pointerId, index };
  };

  const onMarkerMove = (event: PointerEvent<HTMLSpanElement>) => {
    const drag = marker.current;
    if (!drag || drag.pointer !== event.pointerId) return;
    const minute = minuteAt(event.clientX);
    if (minute !== null) moveStart(drag.index, minute);
  };

  const endMarker = (event: PointerEvent<HTMLSpanElement>) => {
    if (marker.current?.pointer === event.pointerId) marker.current = null;
  };

  const onMarkerKey = (index: number) => (event: KeyboardEvent<HTMLSpanElement>) => {
    const start = roomStarts[index];
    const moves: Record<string, number> = {
      ArrowRight: start + SLOT,
      ArrowUp: start + SLOT,
      ArrowLeft: start - SLOT,
      ArrowDown: start - SLOT,
      PageUp: start + PAGE_SLOT,
      PageDown: start - PAGE_SLOT,
      Home: 0,
      End: DAY,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    moveStart(index, moves[event.key]);
  };

  // A click on the drawing chooses the block under the pointer, as the rows do.
  const onPlotClick = (event: MouseEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    setChosen(settingAt(roomStarts, ((event.clientX - box.left) / box.width) * DAY));
  };

  // The step line: it starts at the night's temperature carried over from the day before.
  const ys = room.settings.map((setting) => plotY(setting.temp));
  const points: Array<[number, number]> = [[0, ys[last]]];
  roomStarts.forEach((start, index) => {
    points.push([start, ys[index === 0 ? last : index - 1]], [start, ys[index]]);
  });
  points.push([DAY, ys[last]]);
  const line = points.map(([x, y]) => `${x},${y}`).join(' ');
  const area = `M0 70 L${points.map(([x, y]) => `${x} ${y}`).join(' L')} L${DAY} 70 Z`;

  const roomState = (item: Room) => {
    const itemAction = actionFor(mode, targets[item.id], item.now);
    return itemAction === 'off' ? t(ROOM_LIST.off) : fill(t(ROOM_LIST[itemAction]), { t: degrees(targets[item.id]) });
  };

  return (
    <FusionShell
      fusionId="neumorphism"
      lang={lang}
      tone="light"
      accent="#344055"
      prev={{ href: '/pages/claymorphism.html', label: 'Claymorphism' }}
      next={{ href: '/pages/soft-pastel.html', label: 'Soft Pastel' }}
      prompts={PROMPTS}
    >
      <div className="hh">
        <header className="hh-bar">
          <p className="hh-mark">{HOUSE.name}</p>
          <p className="hh-bar__meta">
            <span>{t(HOUSE.address)}</span>
            <span>{t(HOUSE.outside)}</span>
          </p>
        </header>

        <div className="hh-cols">
          <div className="hh-main">
            <section className="hh-control" data-action={action} aria-labelledby="hh-room">
              <h1 id="hh-room">{t(room.name)}</h1>
              <p className="hh-status">
                <span className="hh-status__lead">{status.lead}</span> {status.rest}
              </p>
              <p className="hh-vh" aria-live="polite">
                <span key={announcement.n}>{announcement.text}</span>
              </p>

              <div className="hh-dial" style={dialStyle}>
                <div className="hh-ticks" aria-hidden="true" />
                <div className="hh-ticks hh-ticks--major" aria-hidden="true" />
                <span className="hh-notch" aria-hidden="true" />
                <span className="hh-end hh-end--lo" aria-hidden="true">10</span>
                <span className="hh-end hh-end--hi" aria-hidden="true">30</span>
                <div className="hh-well" aria-hidden="true" />
                <div
                  className="hh-knob"
                  role="slider"
                  tabIndex={0}
                  aria-label={fill(t(CONTROL.dial), { room: t(room.phrase) })}
                  aria-valuemin={MIN_C}
                  aria-valuemax={MAX_C}
                  aria-valuenow={target}
                  aria-valuetext={fill(t(off ? CONTROL.valueOff : CONTROL.value), { t: degrees(target), now: degrees(room.now) })}
                  aria-disabled={off || undefined}
                  onKeyDown={onKnobKey}
                  onPointerDown={onKnobDown}
                  onPointerMove={onKnobMove}
                  onPointerUp={endTurn}
                  onPointerCancel={endTurn}
                >
                  <span className="hh-grip" />
                  <span className="hh-target">
                    {target.toFixed(1)}
                    <sup>°C</sup>
                  </span>
                  <span className="hh-reading">{fill(t(CONTROL.reading), { t: degrees(room.now) })}</span>
                </div>
                <button
                  className="hh-step hh-step--down"
                  type="button"
                  aria-label={t(CONTROL.cooler)}
                  aria-disabled={off || target <= MIN_C}
                  onClick={() => {
                    if (!off) stepTarget(target - STEP_C);
                  }}
                >
                  <svg viewBox="0 0 20 20" width={20} height={20} aria-hidden="true">
                    <path d="M4.5 10h11" />
                  </svg>
                </button>
                <button
                  className="hh-step hh-step--up"
                  type="button"
                  aria-label={t(CONTROL.warmer)}
                  aria-disabled={off || target >= MAX_C}
                  onClick={() => {
                    if (!off) stepTarget(target + STEP_C);
                  }}
                >
                  <svg viewBox="0 0 20 20" width={20} height={20} aria-hidden="true">
                    <path d="M4.5 10h11M10 4.5v11" />
                  </svg>
                </button>
              </div>

              <p className="hh-until">{until}</p>

              {/* The chosen Heat or Cool key keeps its colour while the room needs nothing;
                  Auto and Off follow what the house is doing. */}
              <div
                className="hh-modes"
                role="radiogroup"
                aria-label={t(CONTROL.modes)}
                data-tone={mode === 'heat' || mode === 'cool' ? mode : undefined}
                onKeyDown={onModeKey}
              >
                {MODES.map((item, index) => (
                  <button
                    key={item.id}
                    ref={(node) => {
                      modeRefs.current[index] = node;
                    }}
                    className="hh-mode"
                    type="button"
                    role="radio"
                    aria-checked={mode === item.id}
                    tabIndex={mode === item.id ? 0 : -1}
                    onClick={() => chooseMode(item.id)}
                  >
                    {t(item.label)}
                  </button>
                ))}
              </div>
            </section>

            <section className="hh-rooms-sec" aria-labelledby="hh-rooms">
              <h2 id="hh-rooms">{t(ROOM_LIST.title)}</h2>
              <ul className="hh-rooms">
                {ROOMS.map((item) => (
                  <li key={item.id}>
                    <button className="hh-room" type="button" aria-pressed={item.id === roomId} onClick={() => chooseRoom(item.id)}>
                      <span className="hh-room__name">{t(item.name)}</span>
                      <span className="hh-room__state">{roomState(item)}</span>
                      <span className="hh-room__t">
                        <span className="hh-vh">{t(ROOM_LIST.now)} </span>
                        {degrees(item.now)}°
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="hh-side">
            <section className="hh-sched" aria-labelledby="hh-today">
              <h2 id="hh-today">{t(SCHEDULE.title)}</h2>
              <p className="hh-note">{fill(t(SCHEDULE.note), { room: t(room.phrase) })}</p>

              <div className="hh-plot">
                <span className="hh-track" aria-hidden="true" />
                <div className="hh-scale" ref={scaleRef}>
                  <svg viewBox={`0 0 ${DAY} 70`} preserveAspectRatio="none" aria-hidden="true" onClick={onPlotClick}>
                    <path className="hh-area" d={area} />
                    {spansOf(roomStarts, chosen).map(([from, to]) => (
                      <rect key={from} className="hh-shade" x={from} y={ys[chosen]} width={to - from} height={70 - ys[chosen]} />
                    ))}
                    <polyline className="hh-line" points={line} />
                    {spansOf(roomStarts, nowIndex).map(([from, to]) => (
                      <polyline key={from} className="hh-line hh-line--now" points={`${from},${ys[nowIndex]} ${to},${ys[nowIndex]}`} />
                    ))}
                  </svg>
                  <span className="hh-now" style={{ left: `${(NOW / DAY) * 100}%` }} aria-hidden="true">
                    {fill(t(SCHEDULE.now), { time: clock(NOW) })}
                  </span>
                  {room.settings.map((setting, index) => {
                    const [from, to] = spansOf(roomStarts, index).reduce((a, b) => (b[1] - b[0] > a[1] - a[0] ? b : a));
                    if (to - from < LABEL_MIN) return null;
                    return (
                      <span
                        key={setting.name.en}
                        className="hh-pt"
                        style={{ left: `${((from + to) / 2 / DAY) * 100}%`, top: `${PLOT_TOP + ys[index] * 2 + 12}px` }}
                        aria-hidden="true"
                      >
                        {degrees(setting.temp)}°
                      </span>
                    );
                  })}
                  <span className="hh-base" aria-hidden="true" />
                  {room.settings.map((setting, index) => (
                    <span
                      key={setting.name.en}
                      className="hh-handle"
                      role="slider"
                      tabIndex={0}
                      style={{ left: `${(roomStarts[index] / DAY) * 100}%` }}
                      aria-label={fill(t(SCHEDULE.starts), { name: t(setting.name) })}
                      aria-valuemin={index === 0 ? GAP : roomStarts[index - 1] + GAP}
                      aria-valuemax={index === last ? DAY - GAP : roomStarts[index + 1] - GAP}
                      aria-valuenow={roomStarts[index]}
                      aria-valuetext={clock(roomStarts[index])}
                      onKeyDown={onMarkerKey(index)}
                      onPointerDown={onMarkerDown(index)}
                      onPointerMove={onMarkerMove}
                      onPointerUp={endMarker}
                      onPointerCancel={endMarker}
                    />
                  ))}
                  <div className="hh-hours" aria-hidden="true">
                    {HOURS.map((hour, index) => (
                      <span key={hour} style={{ left: `${index * 25}%` }}>{hour}</span>
                    ))}
                  </div>
                </div>
              </div>

              <ol className="hh-points">
                {room.settings.map((setting, index) => (
                  <li key={setting.name.en}>
                    <button className="hh-point" type="button" aria-pressed={chosen === index} onClick={() => setChosen(index)}>
                      <time dateTime={clock(roomStarts[index])}>{clock(roomStarts[index])}</time>
                      <span className="hh-point__name">
                        {t(setting.name)}
                        {index === nowIndex ? (
                          <span className="hh-point__now">{fill(t(SCHEDULE.until), { time: clock(roomStarts[nextIndex]) })}</span>
                        ) : null}
                      </span>
                      <span className="hh-point__t">{degrees(setting.temp)}°</span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>

            <section className="hh-energy" aria-labelledby="hh-energy-title">
              <h2 id="hh-energy-title">{t(ENERGY.title)}</h2>
              <p className="hh-note">{t(ENERGY.note)}</p>
              <ol className="hh-bars" aria-label={t(ENERGY.list)}>
                {DAYS.map((item) => (
                  <li key={item.day.en} className={item.today ? 'is-today' : undefined} style={{ '--v': item.kwh } as CSSProperties}>
                    <span className="hh-bars__day">{t(item.day)}</span>
                    <span className="hh-bars__v">
                      {item.kwh}
                      <span className="hh-vh"> kWh</span>
                    </span>
                    <i aria-hidden="true" />
                  </li>
                ))}
              </ol>
              <p className="hh-energy__after">{t(ENERGY.after)}</p>
            </section>
          </div>
        </div>

        <footer className="hh-foot">
          <p>{t(FOOTER.link)}</p>
          <p>{t(FOOTER.device)}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
