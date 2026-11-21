import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedRetroPixelPage.css';

// The page of Insert Coin, an arcade bar in Manchester's Northern Quarter, in the Retro
// Pixel style. Silkscreen, a bitmap face, sets the bar's name, the section names and every
// figure a player reads off a screen: initials, scores, times and prices. DotGothic16, a
// 16-dot gothic drawn for screens, reads the sentences and the controls. Components come
// from the bar: the high-score board as a cabinet screen, a floor map of the machines as
// tiles, the machine roster with token pips, the tournament sign-up with three-letter
// initials entry, the rounds of the night as the field shrinking, token bundles drawn as
// tokens and a price board. Notched pixel frames, no rounding, no figures.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

const NAME = 'Insert Coin';
const ADDRESS = '41 Tib Street, Manchester M4 1LA';
const PHONE = '0161 496 0731';
const TOURNAMENT_PLACES = 32;
const PLACES_TAKEN = 23;

const HERO = {
  open: { en: 'Open today', ko: '오늘 영업', ja: '本日営業' },
  today: '17:00–01:00',
  lede: {
    en: "An arcade bar on Tib Street in Manchester's Northern Quarter, with 31 arcade cabinets and 5 pinball tables. Buy tokens at the bar with your drink. Most games take one.",
    ko: "맨체스터 Northern Quarter의 Tib Street에 있는 아케이드 바입니다. 아케이드 기계 31대와 핀볼 테이블 5대가 있습니다. 음료를 주문할 때 바에서 토큰을 구매하세요. 대부분의 게임은 토큰 한 개면 됩니다.",
    ja: "マンチェスターのNorthern Quarter、Tib Streetにあるアーケードバーです。アーケード筐体31台とピンボール台5台があります。ドリンクと一緒にバーでトークンを購入できます。ほとんどのゲームは1トークンで遊べます。",
  },
  week: { en: 'Opening hours this week', ko: '이번 주 영업시간', ja: '今週の営業時間' },
  closed: { en: 'Closed', ko: '휴무', ja: '休業' },
  machines: { en: 'See the machines', ko: '기계 보기', ja: '筐体を見る' },
  tournament: { en: 'Thursday tournament', ko: '목요일 토너먼트', ja: '木曜トーナメント' },
  findUs: {
    en: "Four minutes' walk from Shudehill tram stop, step-free from the street. Over-18s only after 21:00.",
    ko: "Shudehill 트램 정류장에서 도보 4분 거리이며, 길에서 단차 없이 들어갈 수 있습니다. 21:00 이후에는 만 18세 이상만 입장할 수 있습니다.",
    ja: "Shudehillトラム停留所から徒歩4分。通りから段差なく入れます。21:00以降は18歳以上のみ入店できます。",
  },
} as const;

interface WeekDay {
  id: string;
  name: Tri;
  hours: string | null;
}

// Today is Saturday 21 November; the tournament is on Thursday 26 November.
const TODAY = 'sat';

const WEEK: WeekDay[] = [
  { id: 'mon', name: { en: 'Mon', ko: '월', ja: '月' }, hours: null },
  { id: 'tue', name: { en: 'Tue', ko: '화', ja: '火' }, hours: '17:00–00:00' },
  { id: 'wed', name: { en: 'Wed', ko: '수', ja: '水' }, hours: '17:00–00:00' },
  { id: 'thu', name: { en: 'Thu', ko: '목', ja: '木' }, hours: '17:00–00:00' },
  { id: 'fri', name: { en: 'Fri', ko: '금', ja: '金' }, hours: '17:00–01:00' },
  { id: 'sat', name: { en: 'Sat', ko: '토', ja: '土' }, hours: '17:00–01:00' },
  { id: 'sun', name: { en: 'Sun', ko: '일', ja: '日' }, hours: '15:00–23:00' },
];

type Period = 'week' | 'all';

interface Score {
  ini: string;
  score: number;
  machine: string;
  when: Tri;
  /** Set last night. */
  isNew?: boolean;
}

const BOARD = {
  title: { en: 'High scores', ko: '하이스코어', ja: 'ハイスコア' },
  period: { en: 'Period', ko: '기간', ja: '期間' },
  week: { en: 'This week', ko: '이번 주', ja: '今週' },
  all: { en: 'All time', ko: '전체 기간', ja: '全期間' },
  player: { en: 'Player', ko: '플레이어', ja: 'プレイヤー' },
  score: { en: 'Score', ko: '점수', ja: 'スコア' },
  machine: { en: 'Machine', ko: '기계', ja: '筐体' },
  setOn: { en: 'Set on', ko: '기록일', ja: '記録日' },
  isNew: { en: 'New', ko: '신기록', ja: '新記録' },
  lastNight: { en: ', set last night', ko: ', 어젯밤 기록', ja: '、昨夜の記録' },
  footWeek: {
    en: 'The best score on each machine since Tuesday. Clears next Tuesday.',
    ko: '화요일 이후 각 기계의 최고 점수입니다. 다음 주 화요일에 초기화됩니다.',
    ja: '火曜日以降の、各筐体の最高スコアです。次の火曜日にリセットされます。',
  },
  footAll: {
    en: 'The record on each machine since Insert Coin opened in March 2017.',
    ko: '2017년 3월 Insert Coin 오픈 이후 각 기계의 기록입니다.',
    ja: '2017年3月のInsert Coinオープン以降の、各筐体の記録です。',
  },
  newsWeek: { en: "Showing this week's best scores.", ko: '이번 주 최고 점수를 표시합니다.', ja: '今週の最高スコアを表示しています。' },
  newsAll: { en: 'Showing the all-time records.', ko: '전체 기간 기록을 표시합니다.', ja: '全期間の記録を表示しています。' },
} as const;

const FRI: Tri = { en: 'Fri', ko: '금', ja: '金' };
const THU: Tri = { en: 'Thu', ko: '목', ja: '木' };
const WED: Tri = { en: 'Wed', ko: '수', ja: '水' };
const TUE: Tri = { en: 'Tue', ko: '화', ja: '火' };

const SCORES: Record<Period, Score[]> = {
  week: [
    { ini: 'QBE', score: 287450, machine: 'Galaga', when: FRI, isNew: true },
    { ini: 'OBI', score: 1286400, machine: 'Street Fighter II', when: FRI },
    { ini: 'RHA', score: 118370, machine: 'Ms. Pac-Man', when: THU },
    { ini: 'NAT', score: 612450, machine: 'Metal Slug', when: THU },
    { ini: 'JMC', score: 486200, machine: 'Donkey Kong', when: THU },
    { ini: 'DTK', score: 1042650, machine: 'Robotron: 2084', when: WED },
    { ini: 'MEG', score: 214577, machine: 'Tetris', when: WED },
    { ini: 'AVE', score: 84312, machine: 'Centipede', when: WED },
    { ini: 'SAM', score: 212400, machine: 'Joust', when: TUE },
    { ini: 'LIZ', score: 318900, machine: 'Defender', when: TUE },
  ],
  all: [
    { ini: 'MEG', score: 642880, machine: 'Tetris', when: { en: 'Aug 2025', ko: '2025년 8월', ja: '2025年8月' } },
    { ini: 'KAT', score: 2316500, machine: 'Street Fighter II', when: { en: 'Jan 2025', ko: '2025년 1월', ja: '2025年1月' } },
    { ini: 'NAT', score: 1036200, machine: 'Metal Slug', when: { en: 'Apr 2024', ko: '2024년 4월', ja: '2024年4月' } },
    { ini: 'TBK', score: 1412300, machine: 'Galaga', when: { en: 'Feb 2024', ko: '2024년 2월', ja: '2024年2月' } },
    { ini: 'JMC', score: 1065800, machine: 'Donkey Kong', when: { en: 'Sep 2023', ko: '2023년 9월', ja: '2023年9月' } },
    { ini: 'DTK', score: 1840250, machine: 'Robotron: 2084', when: { en: 'Jun 2022', ko: '2022년 6월', ja: '2022年6月' } },
    { ini: 'LIZ', score: 744100, machine: 'Defender', when: { en: 'Mar 2022', ko: '2022년 3월', ja: '2022年3月' } },
    { ini: 'RHA', score: 382760, machine: 'Ms. Pac-Man', when: { en: 'May 2021', ko: '2021년 5월', ja: '2021年5月' } },
    { ini: 'SAM', score: 1104550, machine: 'Joust', when: { en: 'Nov 2019', ko: '2019년 11월', ja: '2019年11月' } },
    { ini: 'AVE', score: 418236, machine: 'Centipede', when: { en: 'Dec 2018', ko: '2018년 12월', ja: '2018年12月' } },
  ],
};

// A cabinet's score counter has seven digits; the leading ones stay unlit.
const SCORE_DIGITS = 7;

type RoomId = 'front' | 'back' | 'pinball';

interface Machine {
  name: string;
  maker: string;
  year: number;
  tokens: number;
  /** Why it is out of order tonight. */
  out?: Tri;
}

interface Room {
  id: RoomId;
  name: Tri;
  machines: Machine[];
}

const ROOMS: Room[] = [
  {
    id: 'front',
    name: { en: 'Front room', ko: '앞쪽 방', ja: 'フロント側' },
    machines: [
      { name: 'Galaga', maker: 'Namco', year: 1981, tokens: 1 },
      { name: 'Ms. Pac-Man', maker: 'Midway', year: 1982, tokens: 1 },
      { name: 'Donkey Kong', maker: 'Nintendo', year: 1981, tokens: 1 },
      { name: 'Robotron: 2084', maker: 'Williams', year: 1982, tokens: 1 },
      {
        name: 'Defender',
        maker: 'Williams',
        year: 1981,
        tokens: 1,
        out: { en: 'Fire button sticks. New switch on Tuesday.', ko: '발사 버튼이 걸립니다. 화요일에 새 스위치로 교체합니다.', ja: '発射ボタンが引っかかります。火曜日に新しいスイッチへ交換します。' },
      },
      { name: 'Centipede', maker: 'Atari', year: 1981, tokens: 1 },
      { name: 'Joust', maker: 'Williams', year: 1982, tokens: 1 },
      { name: 'Tetris', maker: 'Atari Games', year: 1988, tokens: 1 },
      { name: 'Asteroids', maker: 'Atari', year: 1979, tokens: 1 },
      { name: 'Frogger', maker: 'Konami', year: 1981, tokens: 1 },
      { name: 'Dig Dug', maker: 'Namco', year: 1982, tokens: 1 },
      { name: 'Bubble Bobble', maker: 'Taito', year: 1986, tokens: 1 },
    ],
  },
  {
    id: 'back',
    name: { en: 'Back room', ko: '안쪽 방', ja: '奥の部屋' },
    machines: [
      { name: 'Street Fighter II', maker: 'Capcom', year: 1991, tokens: 1 },
      { name: 'Street Fighter Alpha 3', maker: 'Capcom', year: 1998, tokens: 1 },
      { name: 'Mortal Kombat II', maker: 'Midway', year: 1993, tokens: 1 },
      { name: 'Tekken 3', maker: 'Namco', year: 1997, tokens: 1 },
      { name: "The King of Fighters '98", maker: 'SNK', year: 1998, tokens: 1 },
      { name: 'Marvel vs. Capcom', maker: 'Capcom', year: 1998, tokens: 1 },
      { name: 'Metal Slug', maker: 'SNK', year: 1996, tokens: 1 },
      { name: 'Teenage Mutant Ninja Turtles', maker: 'Konami', year: 1989, tokens: 1 },
      { name: 'The Simpsons', maker: 'Konami', year: 1991, tokens: 1 },
      { name: 'Golden Axe', maker: 'Sega', year: 1989, tokens: 1 },
      { name: 'NBA Jam', maker: 'Midway', year: 1993, tokens: 1 },
      { name: 'OutRun', maker: 'Sega', year: 1986, tokens: 2 },
      { name: 'Daytona USA', maker: 'Sega', year: 1994, tokens: 2 },
      { name: 'Sega Rally Championship', maker: 'Sega', year: 1995, tokens: 2 },
      { name: "Cruis'n USA", maker: 'Midway', year: 1994, tokens: 2 },
      { name: 'Crazy Taxi', maker: 'Sega', year: 1999, tokens: 2 },
      { name: 'Time Crisis 2', maker: 'Namco', year: 1997, tokens: 2 },
      { name: 'The House of the Dead 2', maker: 'Sega', year: 1998, tokens: 2 },
      {
        name: 'Point Blank',
        maker: 'Namco',
        year: 1994,
        tokens: 2,
        out: { en: 'Screen fault. Engineer booked for Wednesday.', ko: '화면 오류입니다. 수요일에 기술자 방문이 예약되어 있습니다.', ja: '画面に不具合があります。水曜日に技術者の訪問を予約しています。' },
      },
    ],
  },
  {
    id: 'pinball',
    name: { en: 'Pinball', ko: '핀볼', ja: 'ピンボール' },
    machines: [
      { name: 'The Addams Family', maker: 'Bally', year: 1992, tokens: 3 },
      { name: 'Twilight Zone', maker: 'Bally', year: 1993, tokens: 3 },
      { name: 'Attack from Mars', maker: 'Bally', year: 1995, tokens: 3 },
      { name: 'Theatre of Magic', maker: 'Bally', year: 1995, tokens: 3 },
      { name: 'Medieval Madness', maker: 'Williams', year: 1997, tokens: 3 },
    ],
  },
];

const ALL_MACHINES = ROOMS.flatMap((room) => room.machines);
const OUT_COUNT = ALL_MACHINES.filter((machine) => machine.out).length;
const WORKING_COUNT = ALL_MACHINES.length - OUT_COUNT;

const MACHINES = {
  title: { en: 'The machines', ko: '기계 안내', ja: '筐体一覧' },
  intro: {
    en: 'The front room sits around the bar, the back room has the fighting, driving and light-gun cabinets, and the pinball tables line the corridor between them.',
    ko: '앞쪽 방은 바를 둘러싸고 있고, 안쪽 방에는 격투, 레이싱, 건슈팅 기계가 있습니다. 핀볼 테이블은 두 방 사이의 복도에 늘어서 있습니다.',
    ja: 'フロント側はバーを囲むように配置され、奥の部屋には格闘、レース、ガンシューティングの筐体があります。ピンボール台は両者をつなぐ通路に並んでいます。',
  },
  working: { en: 'working tonight', ko: '오늘 밤 작동 중', ja: '本日稼働中' },
  out: { en: 'out of order', ko: '고장 중', ja: '故障中' },
  rooms: { en: 'Room', ko: '방', ja: '部屋' },
  list: { en: '{room} machines', ko: '{room} 기계', ja: '{room}の筐体' },
  machine: { en: 'Machine', ko: '기계', ja: '筐体' },
  made: { en: 'Made', ko: '제조사·연도', ja: '製造元・年' },
  tokens: { en: 'Tokens a play', ko: '플레이당 토큰', ja: '1プレイのトークン' },
  tonight: { en: 'Tonight', ko: '오늘 밤 상태', ja: '本日の状態' },
  isWorking: { en: 'Working', ko: '작동 중', ja: '稼働中' },
  isOut: { en: 'Out of order', ko: '고장 중', ja: '故障中' },
  foot: {
    en: 'If a machine takes your token and does not start, tell the bar and you get the token back.',
    ko: '기계가 토큰을 먹고도 시작되지 않으면 바에 알려 주세요. 토큰을 돌려 드립니다.',
    ja: '筐体がトークンを受け付けたのに始まらない場合は、バーにお知らせください。トークンをお返しします。',
  },
} as const;

const TOUR = {
  title: { en: 'Thursday tournament', ko: '목요일 토너먼트', ja: '木曜トーナメント' },
  date: { en: 'Thu 26 Nov', ko: '11월 26일 목요일', ja: '11月26日(木)' },
  where: { en: 'from 20:00, on Ms. Pac-Man', ko: '20:00부터, Ms. Pac-Man 기계에서', ja: '20:00から、Ms. Pac-Manで' },
  format: {
    en: 'Qualifying runs from 20:00 to 21:30 on the cabinet by the window. You get three games and your best score counts. The top eight then play head to head on the two cabinets by the bar, one game each, and the higher score goes through.',
    ko: '예선은 20:00부터 21:30까지 창가 쪽 기계에서 진행됩니다. 세 게임을 하며 최고 점수가 인정됩니다. 상위 8명은 바 옆 기계 두 대에서 게임을 한 판씩 1대1로 겨루고, 점수가 높은 쪽이 다음 라운드에 진출합니다.',
    ja: '予選は20:00から21:30まで、窓際の筐体で行われます。3ゲームを行い、ベストスコアが採用されます。上位8名はバー横の筐体2台で1ゲームずつ1対1の対戦を行い、高いスコアの方が勝ち上がります。',
  },
  entry: {
    en: 'Entry is £5 at the bar on the night and comes with 10 tokens to warm up on anything else. The machine changes on the first Thursday of each month.',
    ko: '참가비는 당일 바에서 £5이며, 다른 기계에서 몸을 풀 수 있는 토큰 10개가 포함됩니다. 토너먼트 기계는 매월 첫 번째 목요일에 바뀝니다.',
    ja: '参加費は当日バーで£5、ほかの筐体で使えるトークン10枚付きです。トーナメントの筐体は毎月最初の木曜日に変わります。',
  },
  prizes: { en: 'Prizes', ko: '상품', ja: '賞品' },
} as const;

const PRIZES: Array<{ place: Tri; prize: Tri }> = [
  {
    place: { en: '1st', ko: '1위', ja: '1位' },
    prize: {
      en: '£100 bar tab and your initials on the brass plate by the door',
      ko: '£100 바 이용권과 출입문 옆 황동 명판에 이니셜 새기기',
      ja: '£100のバー利用券と、入口脇の真鍮プレートへのイニシャル掲載',
    },
  },
  { place: { en: '2nd', ko: '2위', ja: '2位' }, prize: { en: '80 tokens', ko: '토큰 80개', ja: 'トークン80枚' } },
  { place: { en: '3rd', ko: '3위', ja: '3位' }, prize: { en: '40 tokens', ko: '토큰 40개', ja: 'トークン40枚' } },
];

const SIGNUP = {
  title: { en: 'Sign up for 26 November', ko: '11월 26일 참가 신청', ja: '11月26日の参加申し込み' },
  note: {
    en: 'Your initials go on the qualifying board exactly as you enter them.',
    ko: '입력한 이니셜 그대로 예선 보드에 올라갑니다.',
    ja: 'イニシャルは入力したとおりに予選ボードへ掲載されます。',
  },
  left: { en: '{n} places left', ko: '{n}자리 남음', ja: '残り{n}席' },
  oneLeft: { en: '1 place left', ko: '1자리 남음', ja: '残り1席' },
  of: { en: 'of {total}', ko: '/ {total}', ja: '/ {total}席' },
  initials: { en: 'Initials', ko: '이니셜', ja: 'イニシャル' },
  hint: {
    en: 'Three letters, A to Z. Type them, or step through the alphabet with the up and down arrows.',
    ko: 'A부터 Z까지 영문자 세 글자를 입력하세요. 직접 입력하거나 위아래 화살표로 알파벳을 넘겨 고를 수 있습니다.',
    ja: 'A〜Zのアルファベット3文字を入力してください。直接入力するか、上下の矢印キーでアルファベットを選べます。',
  },
  letters: [
    { en: 'Initials, first letter', ko: '이니셜, 첫 번째 글자', ja: 'イニシャル、1文字目' },
    { en: 'Initials, second letter', ko: '이니셜, 두 번째 글자', ja: 'イニシャル、2文字目' },
    { en: 'Initials, third letter', ko: '이니셜, 세 번째 글자', ja: 'イニシャル、3文字目' },
  ] as Tri[],
  missing: { en: 'Enter all three initials.', ko: '이니셜 세 글자를 모두 입력해 주세요.', ja: 'イニシャルを3文字とも入力してください。' },
  notLetters: {
    en: 'Initials take the letters A to Z only, no numbers or symbols.',
    ko: '이니셜은 A부터 Z까지의 영문자만 입력할 수 있습니다. 숫자와 기호는 사용할 수 없습니다.',
    ja: 'イニシャルはA〜Zのアルファベットのみ使えます。数字や記号は使えません。',
  },
  name: { en: 'First name', ko: '이름', ja: 'お名前' },
  nameError: {
    en: 'Write your first name, so the bar can call you to the cabinet.',
    ko: '바에서 기계 앞으로 불러 드릴 수 있도록 이름을 입력해 주세요.',
    ja: 'バーから筐体の前にお呼びできるよう、お名前を入力してください。',
  },
  submit: { en: 'Hold my place', ko: '자리 예약하기', ja: '席を確保する' },
  after: {
    en: 'Pay at the bar when you arrive. Places not claimed by 19:45 go to the waiting list.',
    ko: '도착하시면 바에서 결제해 주세요. 19:45까지 확인되지 않은 자리는 대기자 명단으로 넘어갑니다.',
    ja: 'ご来店時にバーでお支払いください。19:45までに確認できなかった席は、キャンセル待ちに回ります。',
  },
  doneTitle: { en: '{ini} is on the board.', ko: '{ini}, 예선 보드에 등록되었습니다.', ja: '{ini}、予選ボードに登録されました。' },
  doneBody: {
    en: 'Thanks, {name}. Your place is held for Thursday 26 November. Pay £5 at the bar and collect your 10 tokens before 19:45.',
    ko: '{name}님, 감사합니다. 11월 26일 목요일 자리가 예약되었습니다. 19:45 전에 바에서 £5를 결제하고 토큰 10개를 받아 가세요.',
    ja: '{name}様、ありがとうございます。11月26日(木)の席を確保しました。19:45までにバーで£5をお支払いいただき、トークン10枚を受け取ってください。',
  },
  another: { en: 'Sign up another player', ko: '다른 플레이어 신청하기', ja: '別のプレイヤーを申し込む' },
  full: {
    en: 'That was the last place. Ask at the bar to join the waiting list.',
    ko: '마지막 자리였습니다. 바에서 대기자 명단에 올려 달라고 요청해 주세요.',
    ja: 'これで最後の席が埋まりました。バーでキャンセル待ちへの登録をお申し出ください。',
  },
} as const;

const NIGHT = {
  title: { en: 'How the night runs', ko: '하루 진행 방식', ja: '当日の進行' },
  note: {
    en: 'Each round halves the field. Matches are called on the screen above the bar.',
    ko: '라운드마다 참가자가 절반으로 줄어듭니다. 대진은 바 위 화면에서 호출됩니다.',
    ja: 'ラウンドごとに参加者が半分になります。対戦はバーの上の画面で呼び出されます。',
  },
} as const;

const ROUNDS: Array<{ time: string; name: Tri; detail: Tri; field: number; win?: boolean }> = [
  {
    time: '19:00',
    name: { en: 'Sign-up desk opens', ko: '접수 데스크 오픈', ja: '受付開始' },
    detail: { en: 'Collect your 10 tokens', ko: '토큰 10개를 받으세요', ja: 'トークン10枚を受け取る' },
    field: 0,
  },
  {
    time: '20:00',
    name: { en: 'Qualifying', ko: '예선', ja: '予選' },
    detail: { en: '32 players, best of three games', ko: '32명, 3게임 중 최고 점수', ja: '32名、3ゲームのベストスコア' },
    field: 32,
  },
  {
    time: '21:45',
    name: { en: 'Quarterfinals', ko: '8강', ja: '準々決勝' },
    detail: { en: '8 players, four matches', ko: '8명, 4경기', ja: '8名、4試合' },
    field: 8,
  },
  {
    time: '22:30',
    name: { en: 'Semifinals', ko: '4강', ja: '準決勝' },
    detail: { en: '4 players, two matches', ko: '4명, 2경기', ja: '4名、2試合' },
    field: 4,
  },
  {
    time: '23:00',
    name: { en: 'Final', ko: '결승', ja: '決勝' },
    detail: { en: '2 players, one game', ko: '2명, 1게임', ja: '2名、1ゲーム' },
    field: 2,
  },
  {
    time: '23:20',
    name: { en: 'Prizes', ko: '시상', ja: '表彰' },
    detail: {
      en: "The winner's initials go to the engraver on Friday",
      ko: '우승자의 이니셜은 금요일에 각인 업체로 보냅니다.',
      ja: '優勝者のイニシャルは金曜日に彫刻業者へ送られます。',
    },
    field: 1,
    win: true,
  },
];

const PRICES = {
  title: { en: 'Tokens and drinks', ko: '토큰과 음료', ja: 'トークンとドリンク' },
  intro: {
    en: 'Tokens are sold at the bar and never expire, so keep what you have left for next time.',
    ko: '토큰은 바에서 판매하며 유효기간이 없습니다. 남은 토큰은 다음 방문 때 사용하세요.',
    ja: 'トークンはバーで販売しており、有効期限はありません。余ったトークンは次回のためにお取りおきください。',
  },
  tokens: { en: 'Tokens', ko: '토큰', ja: 'トークン' },
  count: { en: '{n} tokens', ko: '토큰 {n}개', ja: 'トークン{n}枚' },
  one: { en: '1 token', ko: '토큰 1개', ja: 'トークン1枚' },
  costs: { en: 'Tokens a play', ko: '플레이당 토큰', ja: '1プレイのトークン' },
  happy: {
    en: 'Tuesday to Thursday before 19:00, £1 buys 6 tokens.',
    ko: '화요일부터 목요일까지 19:00 이전에는 £1로 토큰 6개를 살 수 있습니다.',
    ja: '火曜日から木曜日の19:00前は、£1でトークン6枚を購入できます。',
  },
  bar: { en: 'At the bar', ko: '바 메뉴', ja: 'バーメニュー' },
} as const;

const BUNDLES = [
  { price: '£1', tokens: 4 },
  { price: '£5', tokens: 22 },
  { price: '£10', tokens: 50 },
];

const COSTS: Array<{ what: Tri; tokens: number }> = [
  { what: { en: 'Arcade cabinets', ko: '아케이드 기계', ja: 'アーケード筐体' }, tokens: 1 },
  { what: { en: 'Driving and light-gun cabinets', ko: '레이싱·건슈팅 기계', ja: 'レースとガンシューティングの筐体' }, tokens: 2 },
  { what: { en: 'Pinball, three balls', ko: '핀볼, 3볼', ja: 'ピンボール、3球' }, tokens: 3 },
];

const DRINKS: Array<{ id: string; title: Tri; items: Array<{ name: Tri; abv?: string; price: string }> }> = [
  {
    id: 'draught',
    title: { en: 'Draught, by the pint', ko: '생맥주, 파인트 단위', ja: '生ビール、パイント単位' },
    items: [
      { name: { en: 'House lager', ko: '하우스 라거', ja: 'ハウスラガー' }, abv: '4.2%', price: '£5.20' },
      { name: { en: 'Pale ale', ko: '페일 에일', ja: 'ペールエール' }, abv: '5.0%', price: '£5.80' },
      { name: { en: 'Stout', ko: '스타우트', ja: 'スタウト' }, abv: '4.2%', price: '£5.40' },
      { name: { en: 'Dry cider', ko: '드라이 사이더', ja: 'ドライサイダー' }, abv: '4.5%', price: '£5.30' },
    ],
  },
  {
    id: 'cocktails',
    title: { en: 'Cocktails', ko: '칵테일', ja: 'カクテル' },
    items: [
      { name: { en: 'Margarita', ko: '마르가리타', ja: 'マルガリータ' }, price: '£9.50' },
      { name: { en: 'Paloma', ko: '팔로마', ja: 'パロマ' }, price: '£9.50' },
      { name: { en: 'Espresso martini', ko: '에스프레소 마티니', ja: 'エスプレッソマティーニ' }, price: '£10.00' },
    ],
  },
  {
    id: 'soft',
    title: { en: 'Without alcohol', ko: '무알코올', ja: 'ノンアルコール' },
    items: [
      { name: { en: 'Lager', ko: '라거', ja: 'ラガー' }, abv: '0.0%', price: '£4.50' },
      { name: { en: 'Ginger beer', ko: '진저비어', ja: 'ジンジャービア' }, price: '£3.20' },
      { name: { en: 'Cola', ko: '콜라', ja: 'コーラ' }, price: '£2.80' },
    ],
  },
];

const RULES_TITLE: Tri = { en: 'House rules', ko: '바 이용 규칙', ja: '店内のルール' };

const RULES: Array<{ rule: Tri; why: Tri }> = [
  {
    rule: { en: 'Over-18s only after 21:00', ko: '21:00 이후에는 만 18세 이상만 입장', ja: '21:00以降は18歳以上のみ' },
    why: {
      en: 'Before then, under-18s are welcome with an adult.',
      ko: '그 전에는 18세 미만도 성인과 함께라면 입장할 수 있습니다.',
      ja: 'それ以前は、18歳未満の方も成人の方と一緒であればご利用いただけます。',
    },
  },
  {
    rule: { en: 'Let the next player on', ko: '다음 플레이어에게 자리를 양보하세요', ja: '次のプレイヤーに譲ってください' },
    why: {
      en: 'When there is a queue, play one game, then step back.',
      ko: '대기 줄이 있을 때는 한 게임만 하고 자리에서 물러나 주세요.',
      ja: '順番待ちがいるときは1ゲームだけ遊んで、席を譲ってください。',
    },
  },
  {
    rule: { en: 'Drinks on the shelves', ko: '음료는 선반 위에', ja: 'ドリンクは棚の上に' },
    why: {
      en: 'Never on top of a cabinet or on the pinball glass.',
      ko: '기계 위나 핀볼 유리 위에는 절대 올려 두지 마세요.',
      ja: '筐体の上やピンボールのガラスの上には置かないでください。',
    },
  },
  {
    rule: { en: "Nudge, don't lift", ko: '살짝 밀되, 들어 올리지 마세요', ja: '揺らしてもよいが、持ち上げないでください' },
    why: {
      en: 'Rocking a pinball table is part of the game. Lifting its legs is not.',
      ko: '핀볼 테이블을 흔드는 것도 게임의 일부입니다. 다리를 들어 올리는 것은 안 됩니다.',
      ja: 'ピンボール台を揺らすのはゲームの一部です。脚を持ち上げるのは不可です。',
    },
  },
  {
    rule: { en: 'Lost a token?', ko: '토큰을 잃어버리셨나요?', ja: 'トークンをなくしましたか？' },
    why: {
      en: 'Tell the bar. We give it back and put a note on the machine.',
      ko: '바에 말씀해 주세요. 토큰을 돌려 드리고 기계에 메모를 붙여 둡니다.',
      ja: 'バーにお申し出ください。トークンをお返しし、筐体にメモを貼っておきます。',
    },
  },
  {
    rule: { en: 'Beat a record?', ko: '기록을 경신하셨나요?', ja: '記録を更新しましたか？' },
    why: {
      en: 'Call the bar before you walk away so we can photograph the screen.',
      ko: '자리를 뜨기 전에 바에 알려 주세요. 화면을 촬영해 드리겠습니다.',
      ja: '席を離れる前にバーにお声がけください。画面を撮影いたします。',
    },
  },
];

const FOOT = {
  entrance: { en: 'Step-free entrance on Tib Street.', ko: 'Tib Street 쪽 입구는 단차가 없습니다.', ja: 'Tib Streetの入口は段差がありません。' },
  midweek: { en: 'Tuesday to Thursday 17:00–00:00', ko: '화요일부터 목요일 17:00–00:00', ja: '火曜日〜木曜日 17:00–00:00' },
  weekend: { en: 'Friday and Saturday 17:00–01:00', ko: '금요일과 토요일 17:00–01:00', ja: '金曜日・土曜日 17:00–01:00' },
  sunday: { en: 'Sunday 15:00–23:00, closed Monday', ko: '일요일 15:00–23:00, 월요일 휴무', ja: '日曜日 15:00–23:00、月曜日定休' },
} as const;

const PROMPT_EN = `Design one real page in the Retro Pixel style: an 8-bit screen interface on dark navy, notched pixel frames, bright pixel colours that each mean one thing, and chunky bitmap type.

Pick a believable subject that lives on a screen of pixels, such as an arcade bar, a retro game shop or a chiptune night, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Insert Coin, an arcade bar on Tib Street in Manchester: the week's high-score board, today's opening hours, the machines on the floor, Thursday's tournament with its sign-up, token and drink prices and the house rules.

TOKENS:
--bg: #1a1c2c
--deep: #10111c (the board screen, the sign-up panel, the drinks board, and text on green, yellow and orange)
--surface: #333c57 (offset shadows of the headings, the board's inner frame, dimmed floor tiles, the focused initials slot, the outlined button's bevel, menus over the page)
--frame: #5d6f8e (every pixel frame and solid rule; dashed rules between rows at 60% of it)
--ink: #e0f8cf
--muted: #a7b5d1
--green: #a7f070, bevel #5f9a3c (open, working, today, the main button)
--yellow: #ffec27 (records: the board, the initials that go on it, the first prize)
--orange: #f77622, bevel #a8461a (tokens and Thursday)
--red: #ff004d (out of order, form errors)
--blue: #29adff (keyboard focus only)

COLOUR:
- Each colour has one meaning: green is open or working, yellow is a record, orange is tokens and Thursday, red is out of order or an error, blue is keyboard focus.
- The board alone adds four details: 2px scanlines at 22% black, unlit leading score digits at 24% of muted, a #0b0c14 hard shadow and a 10% yellow wash on the newest row. No other colours.
- Red text appears only on --deep, where it keeps 4.5:1, and as the large out-of-order count; in the roster "Out of order" is ink beside a red square.
- Hover: buttons brighten by 8% (filter: brightness(1.08)); the period switch and the room tabs go from muted to ink. Nothing else changes on hover.

TYPOGRAPHY:
Two families. Silkscreen (400 and 700), a bitmap face, sets the name, the section names and every figure a player reads off a screen: initials, scores, times, prices, counts. DotGothic16 (400), a 16-dot screen gothic, sets the reading text, the controls and every small label. Silkscreen sizes stay on multiples of 8px so its pixels stay square.
H1 "Insert Coin": Silkscreen 700, 88px, line-height 1, green, an 8px offset shadow in --surface; on two lines beside the board on desktop, one line when the hero is one column; 72px below 860px, 64px below 640px, 56px below 400px.
H2: Silkscreen 700, 48px, line-height 1.05, ink, a 4px offset shadow in --surface; 40px below 860px, 32px below 640px. The board's heading is yellow without a shadow: 32px beside the hero copy, 40px when the hero is one column, 32px below 860px, 24px below 640px.
H3: DotGothic16 22px, line-height 1.3.
Initials on the board: Silkscreen 700, 32px, yellow. Scores: Silkscreen 400, 32px, seven digits with the leading zeros unlit. Both 24px on phones.
Other figures in Silkscreen: today's hours, the tournament date and the prizes at 40px (32px on phones, 24px below 400px), the prizes in 700 and the others in 400; the counts 400 at 56px (40px on phones), round times 400 at 32px (24px on phones), prices 400 at 24px, initials slots 700 at 48px (40px below 400px).
Body: DotGothic16 400 at 18px, line-height 1.7; the lede 20px; controls 18px; notes, hints, errors and table heads 16px. No text under 16px. No letter-spacing anywhere.

LAYOUT:
- A 1120px column. Hero: a 432px copy column beside the board. The copy column holds the H1, "Open today 17:00–01:00" with a green square, the lede, the week's hours in two columns with today filled green, two buttons and the address. The board takes the rest and sits whole on the first screen of a 1280x800 laptop. Below 1272px the hero is one column and the board moves up under the lede.
- Then the machines (counts and a floor map on the left, the roster on the right), Thursday's tournament (format and prizes, the sign-up panel, the rounds of the night across the width), tokens and drinks, house rules and a two-part footer.
- Sections 120px apart (88px below 860px), each opened by a 4px frame rule. Below 1060px every section is one column.

COMPONENTS:
- Pixel frame: four 4px offset box-shadows that leave the corners out, so every frame has notched corners. No border-radius anywhere.
- High-score board: a --deep screen with scanlines, a 4px --surface inner frame, a 12px hard offset shadow (8px on phones). A heading, a This week / All time switch (two aria-pressed buttons, 44px tall), then a table with roles of ten rows: initials, score, machine and the day it was set, on dashed rules. The newest row has a 6px yellow bar at its left, the yellow wash and a "New" tag. The switch changes all ten rows and the note under them and is announced in a polite live region. On phones each row becomes two lines and the column heads are kept for screen readers only.
- Week hours: seven rows on dashed rules; today is filled green with aria-current="date".
- Floor map: one tile per machine, 22px squares (pinball 22x40), grouped by room; the room chosen in the roster is lit green, the others dim to --surface with a 2px frame; out-of-order tiles stay red.
- Machine roster: tabs Front room, Back room, Pinball (tab pattern: roving tabindex, arrows, Home and End, one labelled panel), each with its count, the chosen one ink with a 4px green underline; a table with roles: machine, maker and year, token pips (14px orange squares with a 3px bevel) with the number, and tonight's state. On phones each row stacks.
- Tournament sign-up: a --deep panel in a pixel frame. Places left as one orange tile per place in rows of sixteen (taken filled, free outlined) above the form. Initials are three 64x72 slots in Silkscreen: typing moves to the next slot, Backspace goes back, the up and down arrows step through the alphabet, a paste fills all three; a focused slot fills --surface with a yellow underline. Only A to Z is accepted on submit. First name on an underlined field. An orange "Hold my place" button. Errors sit under their field in red with role="alert" and focus moves to the field; a valid sign-up replaces the form with a confirmation that takes focus, and the places drop by one.
- Rounds: time, round and players, and the field drawn as one 14px orange square per player (32, 8, 4, 2), ending in one 30px yellow square for the winner.
- Token bundles drawn as rows of tokens, twenty-five to a row; costs with pips; the drinks board with dotted leaders and right-aligned prices.
- Buttons: a flat face with a 4px darker bevel on the bottom and right, a notched frame; the bevel flips when pressed. 52px tall; every control at least 44px.

MOTION:
- The green square by "Open today" and the "New" tag blink once a second, five times, then stay lit. Nothing else moves. prefers-reduced-motion stops the blinking.

FORBIDDEN:
- Figurative pixel art: characters, sprites, hearts, swords, coins, scenes
- Health bars, XP bars, RPG dialog boxes and other game-interface pastiche that is not the subject's own
- Rounded corners, soft shadows, glows, neon, gradients other than the scanlines and the dashed rules
- Cards in a grid, pills, chips, a small label above a heading, all-caps tracked labels
- Emoji, arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about pixels, nostalgia, 8-bit or the style itself

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: aria-pressed buttons for the period, the tab pattern for the rooms, tables with explicit roles, ordered lists for the prizes and the rounds, a labelled form
3) A working period switch, room tabs, initials entry with validation, and the sign-up with error and success states
4) Responsive layout down to 320px with no horizontal scroll; board and roster rows stack on phones
5) Visible blue focus on every control, blinking stopped under reduced motion`;

const PROMPT_KO = `Retro Pixel 스타일로 실제 페이지 하나를 디자인하세요. 짙은 네이비 배경 위의 8비트 화면 인터페이스, 모서리를 잘라 낸 픽셀 프레임, 각각 한 가지 뜻만 가진 선명한 픽셀 색, 굵은 비트맵 글자를 사용합니다.

픽셀로 이루어진 화면에 존재할 법한 주제를 고르고 실제 콘텐츠를 쓰세요. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체에 관한 페이지가 되어서는 안 됩니다. 여기서는 맨체스터 Tib Street의 아케이드 바 Insert Coin입니다. 이번 주 하이스코어 보드, 오늘의 영업시간, 매장 안 기계, 목요일 토너먼트와 참가 신청, 토큰과 음료 가격, 매장 규칙을 담습니다.

TOKENS:
--bg: #1a1c2c
--deep: #10111c (기록 보드 화면, 참가 신청 패널, 음료 보드, 초록·노랑·주황 위의 글자)
--surface: #333c57 (제목의 오프셋 그림자, 보드 안쪽 프레임, 흐리게 처리한 바닥 타일, 포커스된 이니셜 칸, 테두리 버튼의 베벨, 페이지 위의 메뉴)
--frame: #5d6f8e (모든 픽셀 프레임과 실선 구분선, 행 사이 점선 구분선은 이 색의 60%)
--ink: #e0f8cf
--muted: #a7b5d1
--green: #a7f070, bevel #5f9a3c (영업 중, 작동 중, 오늘, 기본 버튼)
--yellow: #ffec27 (기록: 보드, 보드에 오르는 이니셜, 1등 상품)
--orange: #f77622, bevel #a8461a (토큰과 목요일)
--red: #ff004d (고장, 폼 오류)
--blue: #29adff (키보드 포커스 전용)

COLOUR:
- 각 색은 한 가지 뜻만 가집니다. 초록은 영업 중이거나 작동 중, 노랑은 기록, 주황은 토큰과 목요일, 빨강은 고장이나 오류, 파랑은 키보드 포커스입니다.
- 보드에만 세부 장치가 네 개 더 있습니다. 검정 22%의 2px 스캔라인, muted의 24%로 밝히지 않은 앞자리 0, #0b0c14 하드 그림자, 가장 최근 행의 노랑 10% 틴트입니다. 그 밖의 색은 쓰지 않습니다.
- 빨간 글자는 --deep 위에서만 쓰며 4.5:1 대비를 유지합니다. 큰 고장 대수 숫자로만 씁니다. 기계 목록의 고장 상태는 빨간 사각형 옆의 ink 글자로 표시합니다.
- 호버: 버튼은 8% 밝아집니다(filter: brightness(1.08)). 기간 전환과 방 탭은 muted에서 ink로 바뀝니다. 호버에서 그 밖의 것은 바뀌지 않습니다.

TYPOGRAPHY:
서체는 두 가지입니다. Silkscreen(400과 700)은 비트맵 서체로, 이름, 섹션 이름, 플레이어가 화면에서 읽는 모든 숫자(이니셜, 점수, 시간, 가격, 개수)를 씁니다. DotGothic16(400)은 16도트 화면용 고딕으로, 본문, 컨트롤, 모든 작은 라벨을 씁니다. Silkscreen 크기는 8px의 배수로 유지해 픽셀이 정사각형으로 남게 합니다.
H1 "Insert Coin": Silkscreen 700, 88px, line-height 1, 초록, --surface 색의 8px 오프셋 그림자. 데스크톱에서는 보드 옆에 두 줄로, 히어로가 한 열일 때는 한 줄로 둡니다. 860px 미만에서 72px, 640px 미만에서 64px, 400px 미만에서 56px.
H2: Silkscreen 700, 48px, line-height 1.05, ink, --surface 색의 4px 오프셋 그림자. 860px 미만에서 40px, 640px 미만에서 32px. 보드 제목은 그림자 없는 노란색입니다. 히어로 문구 옆에서 32px, 히어로가 한 열일 때 40px, 860px 미만에서 32px, 640px 미만에서 24px.
H3: DotGothic16 22px, line-height 1.3.
보드의 이니셜: Silkscreen 700, 32px, 노랑. 점수: Silkscreen 400, 32px, 앞의 0은 밝히지 않은 7자리. 둘 다 휴대폰에서는 24px.
그 밖의 Silkscreen 숫자: 오늘의 영업시간, 토너먼트 날짜, 상품은 40px(휴대폰 32px, 400px 미만 24px)이며 상품은 700, 나머지는 400입니다. 개수는 400, 56px(휴대폰 40px). 라운드 시각은 400, 32px(휴대폰 24px). 가격은 400, 24px. 이니셜 칸은 700, 48px(400px 미만 40px).
본문: DotGothic16 400, 18px, line-height 1.7. lede는 20px. 컨트롤은 18px. 메모, 힌트, 오류, 표 머리글은 16px. 16px 미만 글자는 쓰지 않습니다. 자간은 어디에도 주지 않습니다.

LAYOUT:
- 1120px 컬럼. 히어로: 432px 문구 열과 나란히 놓인 보드. 문구 열에는 H1, 초록 사각형이 있는 "오늘 영업 17:00–01:00", lede, 두 열로 된 이번 주 영업시간(오늘은 초록으로 채움), 버튼 두 개, 주소가 들어갑니다. 보드는 나머지 공간을 차지하며, 1280x800 노트북의 첫 화면에 통째로 들어옵니다. 1272px 미만에서는 히어로가 한 열이 되고, 보드가 lede 아래로 올라옵니다.
- 이어서 기계(개수와 바닥 지도는 왼쪽, 목록은 오른쪽), 목요일 토너먼트(형식과 상품, 참가 신청 패널, 전체 너비의 라운드), 토큰과 음료, 매장 규칙, 두 부분으로 된 푸터.
- 섹션 간격은 120px(860px 미만에서 88px). 각 섹션은 4px 프레임 선으로 시작합니다. 1060px 미만에서는 모든 섹션이 한 열입니다.

COMPONENTS:
- 픽셀 프레임: 모서리를 비운 4px 오프셋 box-shadow 네 개로 만들어, 모든 프레임의 모서리가 잘려 있습니다. border-radius는 어디에도 쓰지 않습니다.
- 하이스코어 보드: --deep 화면에 스캔라인, 4px --surface 안쪽 프레임, 12px 하드 오프셋 그림자(휴대폰에서는 8px)를 둡니다. 제목, 이번 주 / 전체 기간 전환(aria-pressed 버튼 두 개, 높이 44px), 그리고 열 개 행의 role을 가진 표가 이어집니다. 열은 이니셜, 점수, 기계, 기록일이며 행 사이는 점선 구분선입니다. 가장 최근 행에는 왼쪽에 6px 노란 막대, 노란 틴트, 신기록 태그가 있습니다. 전환은 열 행 전체와 그 아래 메모를 바꾸며, 그 변경은 polite 라이브 영역으로 알립니다. 휴대폰에서는 각 행이 두 줄이 되고, 열 머리글은 스크린리더용으로만 남깁니다.
- 요일별 영업시간: 점선 구분선으로 나눈 일곱 행. 오늘은 초록으로 채우고 aria-current="date"를 줍니다.
- 바닥 지도: 기계마다 타일 하나, 22px 정사각형(핀볼은 22x40), 방별로 묶습니다. 목록에서 고른 방은 초록으로 켜지고, 나머지는 2px 프레임과 --surface 색으로 흐리게 처리합니다. 고장 난 타일은 빨간색을 유지합니다.
- 기계 목록: 탭 앞쪽 방, 안쪽 방, 핀볼(탭 패턴: roving tabindex, 화살표 키, Home, End, 레이블이 붙은 패널 하나). 각 탭에는 개수가 있고, 선택된 탭은 ink 글자에 4px 초록 밑줄을 씁니다. 표의 role은 기계, 제조사와 연도, 토큰 핍(주황 14px 정사각형, 3px 베벨)과 숫자, 오늘 밤 상태입니다. 휴대폰에서는 각 행이 세로로 쌓입니다.
- 토너먼트 참가 신청: --deep 패널을 픽셀 프레임으로 감쌉니다. 남은 자리는 폼 위에 16개씩 한 줄로 주황 타일 하나씩 표시합니다(찬 자리는 채우고, 빈 자리는 테두리만 씁니다). 이니셜은 Silkscreen으로 된 64x72 칸 세 개입니다. 입력하면 다음 칸으로 넘어가고, Backspace는 앞 칸으로 돌아가며, 위아래 화살표로 알파벳을 넘기고, 붙여넣기는 세 칸을 한꺼번에 채웁니다. 포커스된 칸은 --surface로 채우고 노란 밑줄을 씁니다. 제출 시에는 A부터 Z까지만 허용합니다. 이름은 밑줄 있는 입력란입니다. 주황색 "자리 예약하기" 버튼을 둡니다. 오류는 해당 필드 아래에 빨간색으로 role="alert"와 함께 표시되고, 포커스는 그 필드로 옮깁니다. 유효한 신청은 폼을 확인 화면으로 바꾸며, 확인 화면이 포커스를 받고, 남은 자리는 하나 줄어듭니다.
- 라운드: 시간, 라운드와 참가자 수, 그리고 참가자마다 14px 주황 정사각형 하나로 그린 판(32, 8, 4, 2)을 두고, 마지막에 우승자를 뜻하는 30px 노란 정사각형 하나로 끝냅니다.
- 토큰 묶음은 한 줄에 토큰 25개씩 그립니다. 비용은 핍과 함께 표시합니다. 음료 보드는 점선 리더와 오른쪽 정렬된 가격을 씁니다.
- 버튼: 평평한 면에, 아래와 오른쪽에 4px 더 어두운 베벨을 두고, 잘린 모서리 프레임을 씁니다. 눌리면 베벨이 뒤집힙니다. 높이 52px. 모든 컨트롤은 최소 44px입니다.

MOTION:
- "오늘 영업" 옆의 초록 사각형과 "신기록" 태그는 1초에 한 번씩 다섯 번 깜빡인 뒤 켜진 상태로 머뭅니다. 그 밖의 것은 움직이지 않습니다. prefers-reduced-motion에서는 깜빡임을 멈춥니다.

FORBIDDEN:
- 그림 같은 픽셀 아트: 캐릭터, 스프라이트, 하트, 검, 코인, 장면
- 체력 바, 경험치 바, RPG 대화창, 주제 자체의 것이 아닌 게임 인터페이스 흉내
- 둥근 모서리, 부드러운 그림자, 글로우, 네온, 스캔라인과 점선 구분선 외의 그라데이션
- 격자형 카드, 알약 모양, 칩, 제목 위의 작은 라벨, 전부 대문자이고 자간을 준 라벨
- 이모지, 링크의 화살표, 가운뎃점으로 이은 메타 문자열, 실제 순서가 아닌 것에 붙인 숫자
- 픽셀, 향수, 8비트, 스타일 자체에 관한 문구

OUTPUT:
1) 위 TOKENS의 CSS 사용자 지정 속성
2) 시맨틱 HTML: 기간 전환은 aria-pressed 버튼, 방은 탭 패턴, 표는 명시적 role, 상품과 라운드는 순서 있는 목록, 레이블이 있는 폼
3) 동작하는 기간 전환, 방 탭, 검증이 있는 이니셜 입력, 오류와 성공 상태가 있는 참가 신청
4) 320px까지 가로 스크롤 없이 반응형 레이아웃. 휴대폰에서 보드와 목록의 행은 세로로 쌓입니다.
5) 모든 컨트롤에 보이는 파란 포커스, reduced motion에서는 깜빡임 중지`;

const PROMPT_JA = `Retro Pixelスタイルで実在するページを1つデザインする。深いネイビーの背景に、8ビット画面のインターフェース、角を切り欠いたピクセル枠、それぞれ一つの意味を持つ鮮やかなピクセルカラー、太いビットマップ書体を使う。

ピクセルの画面の中に存在しそうな題材を選び、その実際のコンテンツを書く。ページはその題材のページとして読めること。スタイルそのものについてのページにしてはならない。ここではマンチェスターのTib Streetにあるアーケードバー、Insert Coinを扱う。今週のハイスコアボード、本日の営業時間、フロアの筐体、木曜日のトーナメントと参加申し込み、トークンとドリンクの価格、店内ルールを載せる。

TOKENS:
--bg: #1a1c2c
--deep: #10111c（記録ボードの画面、参加申し込みパネル、ドリンクボード、緑・黄・オレンジの上の文字）
--surface: #333c57（見出しのオフセットシャドウ、ボード内側の枠、暗くした床のタイル、フォーカスされたイニシャル欄、枠線ボタンのベベル、ページ上のメニュー）
--frame: #5d6f8e（すべてのピクセル枠と実線の罫線。行間の破線の罫線はこの色の60%）
--ink: #e0f8cf
--muted: #a7b5d1
--green: #a7f070、ベベル #5f9a3c（営業中、稼働中、本日、主要ボタン）
--yellow: #ffec27（記録：ボード、ボードに載るイニシャル、1等の賞品）
--orange: #f77622、ベベル #a8461a（トークンと木曜日）
--red: #ff004d（故障、フォームのエラー）
--blue: #29adff（キーボードフォーカスのみ）

COLOUR:
- 色にはそれぞれ一つの意味だけを持たせる。緑は営業中または稼働中、黄色は記録、オレンジはトークンと木曜日、赤は故障またはエラー、青はキーボードフォーカスに使う。
- ボードだけに細部を四つ加える。黒22%の2pxスキャンライン、mutedの24%で点灯しない先頭のスコア桁、#0b0c14のハードシャドウ、最新行の黄色10%のウォッシュ。ほかの色は使わない。
- 赤い文字は--deepの上だけで使い、4.5:1のコントラストを保つ。大きな故障台数の数字としてのみ使う。筐体一覧で故障の状態は、赤い四角の横のink文字で示す。
- ホバー：ボタンは8%明るくする（filter: brightness(1.08)）。期間切り替えと部屋のタブは、mutedからinkに変わる。ホバーでそれ以外は変えない。

TYPOGRAPHY:
書体は二つのファミリーを使う。Silkscreen（400と700）はビットマップ書体で、名前、セクション名、プレイヤーが画面から読むすべての数字（イニシャル、スコア、時刻、価格、件数）を組む。DotGothic16（400）は16ドットの画面用ゴシックで、本文、コントロール、すべての小さなラベルを組む。Silkscreenのサイズは8pxの倍数に保ち、ピクセルが正方形のままになるようにする。
H1 "Insert Coin"：Silkscreen 700、88px、line-height 1、緑、--surfaceの8pxオフセットシャドウ。デスクトップではボードの横に二行で置き、ヒーローが一列のときは一行にする。860px未満で72px、640px未満で64px、400px未満で56px。
H2：Silkscreen 700、48px、line-height 1.05、ink、--surfaceの4pxオフセットシャドウ。860px未満で40px、640px未満で32px。ボードの見出しはシャドウのない黄色。ヒーローの文章の横では32px、ヒーローが一列のときは40px、860px未満で32px、640px未満で24px。
H3：DotGothic16 22px、line-height 1.3。
ボードのイニシャル：Silkscreen 700、32px、黄色。スコア：Silkscreen 400、32px、先頭の0は点灯させない7桁。どちらもスマートフォンでは24px。
その他のSilkscreenの数字：本日の営業時間、トーナメントの日付、賞品は40px（スマートフォンでは32px、400px未満では24px）。賞品は700、そのほかは400。件数は400、56px（スマートフォンでは40px）。ラウンドの時刻は400、32px（スマートフォンでは24px）。価格は400、24px。イニシャル欄は700、48px（400px未満では40px）。
本文：DotGothic16 400、18px、line-height 1.7。lede は20px。コントロールは18px。注記、ヒント、エラー、表の見出しは16px。16px未満の文字は使わない。文字間隔はどこにも設定しない。

LAYOUT:
- 1120pxのカラム。ヒーロー：432pxの文章欄と、その横のボード。文章欄には、H1、緑の四角が付いた「本日営業 17:00–01:00」、lede、今週の営業時間を二列で（本日は緑で塗る）、ボタン二つ、住所を置く。ボードは残りの幅を占め、1280x800のノートPCの最初の画面に収まること。1272px未満ではヒーローが一列になり、ボードはledeの下に上がる。
- 続けて、筐体（件数とフロアマップが左、一覧が右）、木曜トーナメント（形式と賞品、参加申し込みパネル、幅いっぱいのラウンド）、トークンとドリンク、店内ルール、二部構成のフッター。
- セクションの間隔は120px（860px未満で88px）。各セクションは4pxのフレームの罫線で始める。1060px未満ではすべてのセクションが一列になる。

COMPONENTS:
- ピクセル枠：角を抜いた4pxのオフセットbox-shadowを四つ使い、すべての枠の角を切り欠く。border-radiusはどこにも使わない。
- ハイスコアボード：--deepの画面にスキャンライン、4pxの--surface内枠、12pxのハードオフセットシャドウ（スマートフォンでは8px）。見出し、今週／全期間の切り替え（aria-pressedのボタン二つ、高さ44px）、そして十行分の role を持つ表。列はイニシャル、スコア、筐体、記録日で、行の区切りは破線。最新行には左に6pxの黄色いバー、黄色のウォッシュ、新記録のタグを付ける。切り替えは十行すべてと、その下の注記を変え、polite のライブリージョンで伝える。スマートフォンでは各行が二行になり、列の見出しはスクリーンリーダー用にだけ残す。
- 曜日別の営業時間：破線の罫線で区切った七行。本日は緑で塗り、aria-current="date" を付ける。
- フロアマップ：筐体ごとに一つのタイル、22pxの正方形（ピンボールは22x40）、部屋ごとにまとめる。一覧で選んだ部屋は緑に点灯し、ほかは2pxの枠と--surfaceで暗くする。故障したタイルは赤のままにする。
- 筐体一覧：タブは 手前のフロア、奥の部屋、ピンボール（タブパターン：roving tabindex、矢印キー、Home、End、ラベル付きのパネル一つ）。各タブには件数があり、選択中のタブはinkの文字と4pxの緑の下線。表の role は、筐体、製造元と年、トークンのピップ（オレンジの14px正方形、3pxのベベル）と数字、本日の状態。スマートフォンでは各行が縦に積み上がる。
- トーナメント参加申し込み：--deepのパネルをピクセル枠で囲む。残りの席は、フォームの上に16個ずつの行で、席ごとにオレンジのタイル一つで示す（埋まった席は塗り、空いた席は枠のみ）。イニシャルは、Silkscreenの64x72の欄三つ。入力すると次の欄に進み、Backspaceで前の欄に戻り、上下の矢印でアルファベットを送り、貼り付けは三欄すべてを埋める。フォーカスされた欄は--surfaceで塗り、黄色の下線を引く。送信時はAからZまでのみ受け付ける。名前は下線付きの入力欄。オレンジの「席を確保する」ボタン。エラーは該当項目の下に赤で、role="alert" とともに表示し、フォーカスはその項目へ移す。有効な申し込みはフォームを確認画面に置き換え、確認画面がフォーカスを受け取り、残りの席が一つ減る。
- ラウンド：時刻、ラウンドと参加者数、そして参加者ごとに14pxのオレンジの正方形一つで描いた枠（32、8、4、2）。最後は勝者を示す30pxの黄色の正方形一つで終わる。
- トークンの束は、一行25個のトークンとして描く。費用はピップと並べる。ドリンクボードは点線のリーダーと右揃えの価格を使う。
- ボタン：平らな面に、下と右に4pxの濃いベベル、切り欠いた枠。押すとベベルが反転する。高さ52px。すべてのコントロールは最低44px。

MOTION:
- 「本日営業」の横の緑の四角と「新記録」のタグは、1秒に一回、五回点滅してから点灯したままにする。ほかは動かさない。prefers-reduced-motionでは点滅を止める。

FORBIDDEN:
- 絵になるピクセルアート：キャラクター、スプライト、ハート、剣、コイン、場面
- 体力バー、経験値バー、RPGの会話ウィンドウ、題材自身のものではないゲームUIの模倣
- 角丸、やわらかいシャドウ、グロー、ネオン、スキャンラインと破線の罫線以外のグラデーション
- カードのグリッド、ピル型、チップ、見出しの上の小さなラベル、すべて大文字で字間を空けたラベル
- 絵文字、リンクの矢印、中黒でつないだメタ文字列、実際の順序ではないものに付けた数字
- ピクセル、ノスタルジア、8ビット、スタイルそのものについての文言

OUTPUT:
1) 上記TOKENSのCSSカスタムプロパティ
2) セマンティックHTML：期間の切り替えはaria-pressedのボタン、部屋はタブパターン、表は明示的な role、賞品とラウンドは順序付きリスト、ラベルのあるフォーム
3) 動く期間切り替え、部屋のタブ、検証付きのイニシャル入力、エラーと成功の状態を持つ参加申し込み
4) 320pxまで横スクロールなしのレスポンシブレイアウト。スマートフォンではボードと一覧の行を縦に積む
5) すべてのコントロールに見える青いフォーカス、reduced motionでは点滅を止める`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

const LETTER = /^[A-Z]$/;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

type SignupErrors = { initials: 'missing' | 'letters' | null; name: boolean };

function Pips({ count }: { count: number }) {
  return (
    <span className="ic-pips" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => <i key={index} />)}
    </span>
  );
}

function Tiles({ count, className }: { count: number; className?: string }) {
  return (
    <span className={`ic-tiles${className ? ` ${className}` : ''}`} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => <i key={index} />)}
    </span>
  );
}

export function PortedRetroPixelPage({ lang }: PortedStylePageProps) {
  const [period, setPeriod] = useState<Period>('week');
  const [roomId, setRoomId] = useState<RoomId>('front');
  const [initials, setInitials] = useState(['', '', '']);
  const [firstName, setFirstName] = useState('');
  const [errors, setErrors] = useState<SignupErrors>({ initials: null, name: false });
  const [placesLeft, setPlacesLeft] = useState(TOURNAMENT_PLACES - PLACES_TAKEN);
  const [signed, setSigned] = useState<{ ini: string; name: string } | null>(null);
  const [news, setNews] = useState({ text: '', count: 0 });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const slotRefs = useRef<Array<HTMLInputElement | null>>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const wasSigned = useRef(false);

  const t = (text: Tri) => text[lang];
  const say = (text: string) => setNews((current) => ({ text, count: current.count + 1 }));

  const room = ROOMS.find((item) => item.id === roomId) ?? ROOMS[0];
  const scores = SCORES[period];
  const taken = TOURNAMENT_PLACES - placesLeft;

  // The form and the confirmation replace each other, and the control that had focus leaves
  // the page with them. Focus goes to what took its place: the confirmation, or, after
  // "Sign up another player", the first initials slot.
  useEffect(() => {
    if (signed) doneRef.current?.focus();
    else if (wasSigned.current) slotRefs.current[0]?.focus();
    wasSigned.current = signed !== null;
  }, [signed]);

  const choosePeriod = (next: Period) => {
    if (next === period) return;
    setPeriod(next);
    say(t(next === 'week' ? BOARD.newsWeek : BOARD.newsAll));
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = ROOMS.length - 1;
    const target = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    setRoomId(ROOMS[target].id);
    tabRefs.current[target]?.focus();
  };

  const focusSlot = (index: number) => {
    const slot = slotRefs.current[index];
    if (!slot) return;
    slot.focus();
    slot.select();
  };

  const setLetter = (index: number, letter: string) => {
    setInitials((current) => current.map((value, i) => (i === index ? letter : value)));
    if (errors.initials) setErrors((current) => ({ ...current, initials: null }));
  };

  const onSlotChange = (index: number, value: string) => {
    // The newest character typed wins; a slot holds one.
    const letter = value.slice(-1).toUpperCase();
    setLetter(index, letter);
    if (letter && index < 2) focusSlot(index + 1);
  };

  const onSlotKey = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    const current = initials[index];
    if (event.key === 'Backspace' && current === '' && index > 0) {
      event.preventDefault();
      setLetter(index - 1, '');
      focusSlot(index - 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusSlot(index - 1);
    } else if (event.key === 'ArrowRight' && index < 2) {
      event.preventDefault();
      focusSlot(index + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      // As on a cabinet: up steps forward through the alphabet, down steps back.
      event.preventDefault();
      const at = ALPHABET.indexOf(current);
      const step = event.key === 'ArrowUp' ? 1 : -1;
      const next = at === -1 ? (step === 1 ? 0 : 25) : (at + step + 26) % 26;
      setLetter(index, ALPHABET[next]);
    }
  };

  const onSlotPaste = (event: ClipboardEvent<HTMLInputElement>, index: number) => {
    event.preventDefault();
    const chars = event.clipboardData.getData('text').replace(/\s/g, '').toUpperCase().slice(0, 3 - index).split('');
    if (chars.length === 0) return;
    setInitials((current) => current.map((value, i) => (i >= index && i < index + chars.length ? chars[i - index] : value)));
    if (errors.initials) setErrors((current) => ({ ...current, initials: null }));
    focusSlot(Math.min(index + chars.length, 2));
  };

  const signUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missing = initials.some((letter) => letter === '');
    const wrong = initials.some((letter) => letter !== '' && !LETTER.test(letter));
    const next: SignupErrors = { initials: wrong ? 'letters' : missing ? 'missing' : null, name: firstName.trim() === '' };
    if (!next.initials && !next.name) {
      setErrors(next);
      setPlacesLeft((left) => left - 1);
      setSigned({ ini: initials.join(''), name: firstName.trim() });
      return;
    }
    // The error renders first, so the whole field can be brought into view above the page bar.
    flushSync(() => setErrors(next));
    if (next.initials) {
      const bad = initials.findIndex((letter) => !LETTER.test(letter));
      focusSlot(bad === -1 ? 0 : bad);
      document.getElementById('ic-ini-field')?.scrollIntoView({ block: 'nearest' });
    } else {
      nameRef.current?.focus();
      nameRef.current?.parentElement?.scrollIntoView({ block: 'nearest' });
    }
  };

  const another = () => {
    setInitials(['', '', '']);
    setFirstName('');
    setErrors({ initials: null, name: false });
    setSigned(null);
  };

  const iniDescribedBy = ['ic-ini-hint', errors.initials ? 'ic-ini-error' : ''].filter(Boolean).join(' ');

  return (
    <FusionShell
      fusionId="retro-pixel"
      lang={lang}
      tone="dark"
      accent="#a7f070"
      prev={{ href: '/pages/notion-style.html', label: 'Notion Style' }}
      next={{ href: '/pages/y2k-retro.html', label: 'Windows 98' }}
      prompts={PROMPTS}
    >
      <div className="ic">
        <section className="ic-hero" aria-labelledby="ic-title">
          <div className="ic-hero__copy">
            <h1 id="ic-title">{NAME}</h1>
            <p className="ic-open">
              <i className="ic-blink" aria-hidden="true" />
              <span>{t(HERO.open)}</span> <b>{HERO.today}</b>
            </p>
            <p className="ic-lede">{t(HERO.lede)}</p>
            <ul className="ic-week" aria-label={t(HERO.week)}>
              {WEEK.map((day) => (
                <li key={day.id} className={day.id === TODAY ? 'is-today' : undefined} aria-current={day.id === TODAY ? 'date' : undefined}>
                  <b>{t(day.name)}</b>
                  <span>{day.hours ?? t(HERO.closed)}</span>
                </li>
              ))}
            </ul>
            <div className="ic-actions">
              <a className="ic-btn" href="#ic-machines">{t(HERO.machines)}</a>
              <a className="ic-btn ic-btn--line" href="#ic-thursday">{t(HERO.tournament)}</a>
            </div>
            <p className="ic-findus"><b>{ADDRESS}.</b> {t(HERO.findUs)}</p>
          </div>

          <section className="ic-board" aria-labelledby="ic-board-title">
            <div className="ic-board__top">
              <h2 id="ic-board-title">{t(BOARD.title)}</h2>
              <div className="ic-seg" role="group" aria-label={t(BOARD.period)}>
                {(['week', 'all'] as const).map((item) => (
                  <button key={item} type="button" aria-pressed={period === item} onClick={() => choosePeriod(item)}>
                    {t(BOARD[item])}
                  </button>
                ))}
              </div>
            </div>
            <div className="ic-scores" role="table" aria-labelledby="ic-board-title" aria-describedby="ic-board-foot">
              <div role="rowgroup">
                <div className="ic-scores__row ic-scores__row--head" role="row">
                  <span role="columnheader">{t(BOARD.player)}</span>
                  <span className="ic-scores__sc" role="columnheader">{t(BOARD.score)}</span>
                  <span role="columnheader">{t(BOARD.machine)}</span>
                  <span className="ic-scores__day" role="columnheader">{t(BOARD.setOn)}</span>
                </div>
              </div>
              <div role="rowgroup">
                {scores.map((row) => {
                  const digits = String(row.score);
                  return (
                    <div key={`${period}-${row.ini}-${row.machine}`} className={`ic-scores__row${row.isNew ? ' is-new' : ''}`} role="row">
                      <span className="ic-scores__ini" role="cell" data-label={t(BOARD.player)}>{row.ini}</span>
                      <span className="ic-scores__sc" role="cell" data-label={t(BOARD.score)}>
                        <s aria-hidden="true">{'0'.repeat(Math.max(0, SCORE_DIGITS - digits.length))}</s>
                        {digits}
                      </span>
                      <span className="ic-scores__mach" role="cell" data-label={t(BOARD.machine)}>{row.machine}</span>
                      <span className="ic-scores__day" role="cell" data-label={t(BOARD.setOn)}>
                        {row.isNew ? <span className="ic-new ic-blink">{t(BOARD.isNew)}</span> : null}
                        {t(row.when)}
                        {row.isNew ? <span className="ic-sr">{t(BOARD.lastNight)}</span> : null}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="ic-board__foot" id="ic-board-foot">{t(period === 'week' ? BOARD.footWeek : BOARD.footAll)}</p>
          </section>
        </section>

        <section className="ic-section" id="ic-machines" aria-labelledby="ic-machines-title">
          <div className="ic-floorwrap">
            <div className="ic-floorwrap__side">
              <h2 id="ic-machines-title">{t(MACHINES.title)}</h2>
              <p className="ic-intro">{t(MACHINES.intro)}</p>
              <div className="ic-counts">
                <p className="ic-counts__ok"><b>{WORKING_COUNT}</b>{t(MACHINES.working)}</p>
                <p className="ic-counts__out"><b>{OUT_COUNT}</b>{t(MACHINES.out)}</p>
              </div>
              <div className="ic-floor" aria-hidden="true">
                {ROOMS.map((item) => (
                  <div key={item.id} className={`ic-room${item.id === roomId ? ' is-on' : ''}`}>
                    <p>{t(item.name)} <span>{item.machines.length}</span></p>
                    <span className={`ic-tiles ic-tiles--${item.id}`}>
                      {item.machines.map((machine) => <i key={machine.name} className={machine.out ? 'is-out' : undefined} />)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="ic-note">{t(MACHINES.foot)}</p>
            </div>

            <div className="ic-roster">
              <div className="ic-tabs" role="tablist" aria-label={t(MACHINES.rooms)}>
                {ROOMS.map((item, index) => (
                  <button
                    key={item.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    id={`ic-tab-${item.id}`}
                    type="button"
                    role="tab"
                    aria-selected={item.id === roomId}
                    aria-controls="ic-room-panel"
                    tabIndex={item.id === roomId ? 0 : -1}
                    onClick={() => setRoomId(item.id)}
                    onKeyDown={(event) => onTabKey(event, index)}
                  >
                    {t(item.name)} <span>{item.machines.length}</span>
                  </button>
                ))}
              </div>
              <div className="ic-panel" role="tabpanel" id="ic-room-panel" aria-labelledby={`ic-tab-${room.id}`} tabIndex={0}>
                <div className="ic-machines" role="table" aria-label={fill(t(MACHINES.list), { room: t(room.name) })}>
                  <div role="rowgroup">
                    <div className="ic-machines__row ic-machines__row--head" role="row">
                      <span role="columnheader">{t(MACHINES.machine)}</span>
                      <span role="columnheader">{t(MACHINES.made)}</span>
                      <span role="columnheader">{t(MACHINES.tokens)}</span>
                      <span role="columnheader">{t(MACHINES.tonight)}</span>
                    </div>
                  </div>
                  <div role="rowgroup">
                    {room.machines.map((machine) => (
                      <div key={machine.name} className={`ic-machines__row${machine.out ? ' is-out' : ''}`} role="row">
                        <span className="ic-machines__name" role="rowheader" data-label={t(MACHINES.machine)}>{machine.name}</span>
                        <span className="ic-machines__made" role="cell" data-label={t(MACHINES.made)}>{machine.maker}, {machine.year}</span>
                        <span className="ic-machines__tokens" role="cell" data-label={t(MACHINES.tokens)}>
                          <Pips count={machine.tokens} />
                          {machine.tokens}
                        </span>
                        <span className="ic-machines__state" role="cell" data-label={t(MACHINES.tonight)}>
                          <span className={`ic-state${machine.out ? ' ic-state--out' : ''}`}>{t(machine.out ? MACHINES.isOut : MACHINES.isWorking)}</span>
                          {machine.out ? <small>{t(machine.out)}</small> : null}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ic-section" id="ic-thursday" aria-labelledby="ic-thursday-title">
          <div className="ic-tour">
            <div className="ic-tour__about">
              <h2 id="ic-thursday-title">{t(TOUR.title)}</h2>
              <p className="ic-when"><b>{t(TOUR.date)}</b> <span>{t(TOUR.where)}</span></p>
              <p className="ic-intro">{t(TOUR.format)}</p>
              <p className="ic-intro">{t(TOUR.entry)}</p>
              <ol className="ic-prizes" aria-label={t(TOUR.prizes)}>
                {PRIZES.map((item) => (
                  <li key={item.place.en} className="ic-prize">
                    <b>{t(item.place)}</b>
                    <span>{t(item.prize)}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="ic-signup ic-px">
              <h3 id="ic-signup-title">{t(SIGNUP.title)}</h3>
              <p className="ic-signup__note">{t(SIGNUP.note)}</p>
              <div className="ic-places">
                <p>
                  <b>{placesLeft === 1 ? t(SIGNUP.oneLeft) : fill(t(SIGNUP.left), { n: placesLeft })}</b> {fill(t(SIGNUP.of), { total: TOURNAMENT_PLACES })}
                </p>
                <span className="ic-tiles ic-tiles--places" aria-hidden="true">
                  {Array.from({ length: TOURNAMENT_PLACES }, (_, index) => <i key={index} className={index < taken ? undefined : 'is-free'} />)}
                </span>
              </div>

              {signed ? (
                <div className="ic-done" ref={doneRef} tabIndex={-1}>
                  <p className="ic-done__title">{fill(t(SIGNUP.doneTitle), { ini: signed.ini })}</p>
                  <p className="ic-done__body">{fill(t(SIGNUP.doneBody), { name: signed.name })}</p>
                  {placesLeft > 0 ? (
                    <button className="ic-btn ic-btn--line" type="button" onClick={another}>{t(SIGNUP.another)}</button>
                  ) : (
                    <p className="ic-done__full">{t(SIGNUP.full)}</p>
                  )}
                </div>
              ) : (
                <form className="ic-form" aria-labelledby="ic-signup-title" noValidate onSubmit={signUp}>
                  <div className={`ic-field${errors.initials ? ' is-invalid' : ''}`} id="ic-ini-field">
                    <span className="ic-field__label" id="ic-ini-label">{t(SIGNUP.initials)}</span>
                    <span className="ic-field__hint" id="ic-ini-hint">{t(SIGNUP.hint)}</span>
                    <div className="ic-initials" role="group" aria-labelledby="ic-ini-label">
                      {initials.map((letter, index) => (
                        <input
                          key={index}
                          ref={(node) => {
                            slotRefs.current[index] = node;
                          }}
                          className="ic-slot"
                          type="text"
                          inputMode="text"
                          autoComplete="off"
                          autoCapitalize="characters"
                          spellCheck={false}
                          value={letter}
                          aria-label={t(SIGNUP.letters[index])}
                          aria-describedby={iniDescribedBy}
                          aria-invalid={errors.initials && !LETTER.test(letter) ? true : undefined}
                          onFocus={(event) => event.currentTarget.select()}
                          onChange={(event) => onSlotChange(index, event.target.value)}
                          onKeyDown={(event) => onSlotKey(event, index)}
                          onPaste={(event) => onSlotPaste(event, index)}
                        />
                      ))}
                    </div>
                    {errors.initials ? (
                      <p className="ic-field__error" id="ic-ini-error" role="alert">
                        {t(errors.initials === 'letters' ? SIGNUP.notLetters : SIGNUP.missing)}
                      </p>
                    ) : null}
                  </div>
                  <div className={`ic-field${errors.name ? ' is-invalid' : ''}`}>
                    <label className="ic-field__label" htmlFor="ic-name">{t(SIGNUP.name)}</label>
                    <input
                      id="ic-name"
                      ref={nameRef}
                      className="ic-input"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={firstName}
                      aria-invalid={errors.name || undefined}
                      aria-describedby={errors.name ? 'ic-name-error' : undefined}
                      onChange={(event) => {
                        setFirstName(event.target.value);
                        if (errors.name) setErrors((current) => ({ ...current, name: false }));
                      }}
                    />
                    {errors.name ? <p className="ic-field__error" id="ic-name-error" role="alert">{t(SIGNUP.nameError)}</p> : null}
                  </div>
                  <button className="ic-btn ic-btn--orange" type="submit">{t(SIGNUP.submit)}</button>
                  <p className="ic-signup__after">{t(SIGNUP.after)}</p>
                </form>
              )}
            </div>

            <div className="ic-night">
              <h3>{t(NIGHT.title)}</h3>
              <p className="ic-night__note">{t(NIGHT.note)}</p>
              <ol className="ic-rounds">
                {ROUNDS.map((round) => (
                  <li key={round.time} className="ic-round">
                    <time>{round.time}</time>
                    <div>
                      <b>{t(round.name)}</b>
                      <span>{t(round.detail)}</span>
                    </div>
                    <Tiles count={round.field} className={round.win ? 'ic-tiles--win' : 'ic-tiles--field'} />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="ic-section" id="ic-prices" aria-labelledby="ic-prices-title">
          <h2 id="ic-prices-title">{t(PRICES.title)}</h2>
          <p className="ic-intro">{t(PRICES.intro)}</p>
          <div className="ic-prices">
            <div className="ic-tokens">
              <h3>{t(PRICES.tokens)}</h3>
              <ul className="ic-bundles">
                {BUNDLES.map((bundle) => (
                  <li key={bundle.price} className="ic-bundle">
                    <p><b>{bundle.price}</b> <span>{fill(t(PRICES.count), { n: bundle.tokens })}</span></p>
                    <Tiles count={bundle.tokens} className="ic-tiles--tokens" />
                  </li>
                ))}
              </ul>
              <ul className="ic-costs" aria-label={t(PRICES.costs)}>
                {COSTS.map((cost) => (
                  <li key={cost.tokens}>
                    <span>{t(cost.what)}</span>
                    <span className="ic-costs__n">
                      {cost.tokens === 1 ? t(PRICES.one) : fill(t(PRICES.count), { n: cost.tokens })}
                      <Pips count={cost.tokens} />
                    </span>
                  </li>
                ))}
              </ul>
              <p className="ic-note">{t(PRICES.happy)}</p>
            </div>

            <div className="ic-drinks ic-px">
              <h3 id="ic-drinks-title">{t(PRICES.bar)}</h3>
              {DRINKS.map((group) => (
                <section key={group.id} className="ic-drinks__group" aria-labelledby={`ic-drinks-${group.id}`}>
                  <h4 id={`ic-drinks-${group.id}`}>{t(group.title)}</h4>
                  <ul className="ic-menu">
                    {group.items.map((item) => (
                      <li key={item.name.en}>
                        <span>{t(item.name)}{item.abv ? <small>{item.abv}</small> : null}</span>
                        <b>{item.price}</b>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="ic-section" id="ic-rules" aria-labelledby="ic-rules-title">
          <div className="ic-rules-wrap">
            <h2 id="ic-rules-title">{t(RULES_TITLE)}</h2>
            <ul className="ic-rules">
              {RULES.map((item) => (
                <li key={item.rule.en}>
                  <b>{t(item.rule)}</b>
                  <span>{t(item.why)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="ic-foot">
          <p><b>{NAME}</b>, {ADDRESS}<br />{PHONE}. {t(FOOT.entrance)}</p>
          <p>{t(FOOT.midweek)}<br />{t(FOOT.weekend)}<br />{t(FOOT.sunday)}</p>
        </footer>

        <p className="ic-sr" role="status">{news.text}{news.count % 2 ? ' ' : ''}</p>
      </div>
    </FusionShell>
  );
}
