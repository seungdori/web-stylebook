import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFusionClayAuroraPage.css';

// The page of Mud Room, a neighbourhood pottery studio that teaches wheel-throwing
// in four-evening courses. Everything on it is clay in one of two states, raised
// or pressed: the evening tokens, the glaze blobs and their test tile, the filter
// keys, the kiln week and the form fields.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

/** Puts values into the {placeholders} of a translated sentence. */
const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

const STUDIO = {
  name: 'Mud Room',
  nav: { en: 'On this page', ko: '이 페이지 목차', ja: 'このページの目次' },
  links: [
    { href: '#ca-glazes', label: { en: 'Glazes', ko: '유약', ja: '釉薬' } },
    { href: '#ca-classes', label: { en: 'Timetable', ko: '시간표', ja: '時間割' } },
    { href: '#ca-prices', label: { en: 'Prices', ko: '가격', ja: '料金' } },
    { href: '#ca-find', label: { en: 'Find us', ko: '찾아오기', ja: 'アクセス' } },
  ],
  title: {
    en: 'Make a mug in four evenings.',
    ko: '저녁 4회로 머그컵 한 개를 만듭니다.',
    ja: '4回の夜で、マグカップを一つ作ります。',
  },
  lede: {
    en: "Mud Room is a pottery studio on Tanner Row. The beginners' course runs one evening a week for four weeks, with eight wheels and one teacher in the room.",
    ko: 'Mud Room은 Tanner Row에 있는 도예 공방입니다. 입문 과정은 일주일에 한 번 저녁에 4주 동안 열리며, 방에는 물레 여덟 대와 강사 한 명이 있습니다.',
    ja: 'Mud Roomはタナーロウにある陶芸工房です。入門コースは週に1回の夜、4週間にわたって行われます。教室にはろくろが8台、講師が1名います。',
  },
  book: { en: 'Book a course', ko: '수강 예약', ja: 'コースを予約' },
  next: {
    en: 'The next one starts on Monday 4 January. £168 with clay, glazes and firing.',
    ko: '다음 과정은 1월 4일 월요일에 시작합니다. 흙, 유약, 소성 포함 £168입니다.',
    ja: '次のコースは1月4日(月)に始まります。粘土、釉薬、焼成込みで£168です。',
  },
  eveningsLabel: {
    en: 'The four evenings of the course',
    ko: '과정의 네 저녁',
    ja: 'コースの4回の夜',
  },
  eveningsNote: {
    en: 'Each evening runs for two and a half hours. Mugs go into the glaze firing that Friday and are ready to collect on Sunday.',
    ko: '수업은 매번 두 시간 반 동안 진행됩니다. 머그컵은 그 주 금요일 재벌 가마에 들어가며, 일요일부터 찾아가실 수 있습니다.',
    ja: '各回は2時間半です。マグカップはその週の金曜日に本焼きへ入り、日曜日から受け取れます。',
  },
  address: {
    en: 'Mud Room, 9 Tanner Row, in the yard behind the bakery',
    ko: 'Mud Room, 9 Tanner Row, in the yard behind the bakery',
    ja: 'Mud Room, 9 Tanner Row, in the yard behind the bakery',
  },
  email: 'hello@mudroom.example',
};

// What is made on each of the four evenings, in order.
const EVENINGS: Tri[] = [
  { en: 'Centre the clay', ko: '흙 중심 잡기', ja: '芯出し' },
  { en: 'Pull the walls', ko: '벽 올리기', ja: '引き上げ' },
  { en: 'Trim and handle', ko: '굽 깎기와 손잡이', ja: '削りと取っ手' },
  { en: 'Glaze', ko: '유약 입히기', ja: '釉掛け' },
];

// A glaze has four colours: one coat (g1), two coats (g2), the highlight (g3) and
// the pale break over edges (g4). `pool` is where it gathers in a groove.
const GLAZES = [
  {
    id: 'seafoam',
    name: { en: 'Seafoam', ko: 'Seafoam', ja: 'Seafoam' },
    cone: { en: 'Cone 6', ko: '콘 6', ja: 'コーン6' },
    facts: { en: 'Cone 6, satin, food safe', ko: '콘 6, 새틴, 식기 사용 가능', ja: 'コーン6、サテン、食器使用可' },
    body: {
      en: 'Two coats give an even, milky green. One coat goes nearly clear and lets the grey of the clay show through.',
      ko: '두 번 바르면 고르게 우윳빛이 도는 초록이 납니다. 한 번만 바르면 거의 투명해져 흙의 회색이 비칩니다.',
      ja: '2回掛けると、乳白色がかった均一な緑になります。1回だけだとほぼ透明になり、土の灰色が透けて見えます。',
    },
    g1: '#c2efe0', g2: '#7fcbb7', g3: '#e6faf3', g4: '#eefbf6', pool: '#2f7f6c',
  },
  {
    id: 'fjord',
    name: { en: 'Fjord', ko: 'Fjord', ja: 'Fjord' },
    cone: { en: 'Cone 6', ko: '콘 6', ja: 'コーン6' },
    facts: { en: 'Cone 6, glossy, food safe', ko: '콘 6, 광택, 식기 사용 가능', ja: 'コーン6、光沢、食器使用可' },
    body: {
      en: 'Two coats pool to a deep green in the grooves. One coat breaks to pale mint over edges and rims.',
      ko: '두 번 바르면 홈에 짙은 초록이 고입니다. 한 번만 바르면 모서리와 테두리에서 옅은 민트색으로 갈라집니다.',
      ja: '2回掛けると、溝に深い緑がたまります。1回だけだと、角や縁で淡いミント色に割れます。',
    },
    g1: '#5fb09c', g2: '#2c7a68', g3: '#a5dccd', g4: '#c2efe0', pool: '#104236',
  },
  {
    id: 'dusk',
    name: { en: 'Dusk', ko: 'Dusk', ja: 'Dusk' },
    cone: { en: 'Cone 6', ko: '콘 6', ja: 'コーン6' },
    facts: { en: 'Cone 6, glossy, food safe', ko: '콘 6, 광택, 식기 사용 가능', ja: 'コーン6、光沢、食器使用可' },
    body: {
      en: 'Two coats fire to a violet that is almost black where it pools. One coat stays bright and thins to lilac on rims.',
      ko: '두 번 바르면 고인 곳은 거의 검정에 가까운 보라로 구워집니다. 한 번만 바르면 밝게 남고, 테두리에서 라일락색으로 얇아집니다.',
      ja: '2回掛けると、溜まった部分はほぼ黒に近い紫に焼き上がります。1回だけだと明るいまま残り、縁で薄いライラック色になります。',
    },
    g1: '#6a5dd1', g2: '#3b3192', g3: '#a399ee', g4: '#c4bcf7', pool: '#1b1458',
  },
  {
    id: 'lilac',
    name: { en: 'Lilac', ko: 'Lilac', ja: 'Lilac' },
    cone: { en: 'Cone 5', ko: '콘 5', ja: 'コーン5' },
    facts: {
      en: 'Cone 5, matt, for the outside of a mug',
      ko: '콘 5, 무광, 머그컵 바깥쪽용',
      ja: 'コーン5、マット、マグカップの外側用',
    },
    body: {
      en: 'A soft matt glaze that turns mint where it runs thick. Cutlery marks it, so the inside gets a clear liner.',
      ko: '부드러운 무광 유약으로, 두껍게 흐른 곳은 민트색으로 변합니다. 식기 자국이 남으므로 안쪽에는 투명 유약을 한 겹 입힙니다.',
      ja: 'やわらかなマットの釉薬で、厚く流れた部分はミント色になります。カトラリーの跡が付くため、内側には透明の釉薬を重ねます。',
    },
    g1: '#d9d4fb', g2: '#b4e6d6', g3: '#f3f0ff', g4: '#f1eeff', pool: '#5fae98',
  },
  {
    id: 'chalk',
    name: { en: 'Chalk', ko: 'Chalk', ja: 'Chalk' },
    cone: { en: 'Cone 6', ko: '콘 6', ja: 'コーン6' },
    facts: { en: 'Cone 6, matt, food safe', ko: '콘 6, 무광, 식기 사용 가능', ja: 'コーン6、マット、食器使用可' },
    body: {
      en: 'A dry white that shows every throwing line. It needs two coats, because one coat fires thin and patchy.',
      ko: '물레 자국이 모두 드러나는 건조한 흰색입니다. 한 번 바르면 얇고 얼룩지게 구워지므로 두 번 발라야 합니다.',
      ja: 'ろくろ目がすべて見える、乾いた白です。1回だと薄くむらに焼けるため、2回掛けが必要です。',
    },
    g1: '#f2f1f5', g2: '#cfccda', g3: '#ffffff', g4: '#fbfaff', pool: '#8f8aa6',
  },
  {
    id: 'slate',
    name: { en: 'Slate', ko: 'Slate', ja: 'Slate' },
    cone: { en: 'Cone 5', ko: '콘 5', ja: 'コーン5' },
    facts: { en: 'Cone 5, satin, food safe', ko: '콘 5, 새틴, 식기 사용 가능', ja: 'コーン5、サテン、食器使用可' },
    body: {
      en: 'A dark grey with a faint violet cast. It breaks lighter over texture and shows every trimming mark.',
      ko: '희미하게 보라빛이 도는 짙은 회색입니다. 질감이 있는 곳에서는 더 밝게 갈라지며, 굽 깎기 자국이 모두 보입니다.',
      ja: '淡い紫味を帯びた濃いグレーです。凹凸のある部分ではより明るく割れ、削りの跡がすべて見えます。',
    },
    g1: '#56526e', g2: '#2a2740', g3: '#8d89a8', g4: '#a7a3c0', pool: '#0f0d1f',
  },
] satisfies Array<{ id: string; name: Tri; cone: Tri; facts: Tri; body: Tri; g1: string; g2: string; g3: string; g4: string; pool: string }>;

// The blobs stand on two boards, three to a board.
const SHELVES = [GLAZES.slice(0, 3), GLAZES.slice(3)];

const GLAZE_SHELF = {
  title: { en: 'The glaze shelf', ko: '유약 선반', ja: '釉薬の棚' },
  note: {
    en: 'Six glazes are mixed in the studio. On the fourth evening you pick one and dip your mug yourself.',
    ko: '여섯 가지 유약은 공방에서 직접 배합합니다. 네 번째 저녁에 원하는 유약을 골라 머그컵을 직접 담급니다.',
    ja: '6種類の釉薬は工房で調合しています。4回目の夜に好きなものを選び、マグカップを自分で浸けます。',
  },
  group: { en: 'Glazes', ko: '유약', ja: '釉薬' },
  // {name} is the glaze.
  tile: {
    en: 'Test tile glazed in {name}: two coats at the top, one coat below, bare clay at the foot',
    ko: '{name} 유약을 입힌 시험편: 위쪽은 두 번, 아래쪽은 한 번 바르고, 굽 쪽은 흙을 그대로 둡니다.',
    ja: '{name}を施釉した試験片：上は2回掛け、下は1回掛け、底は素地のまま',
  },
} satisfies Record<string, Tri>;

type Level = 'beginner' | 'improver';
type LevelFilter = 'all' | Level;

// Each class has eight places, one for each wheel; `left` is how many are free.
const CLASSES: Array<{ id: string; day: Tri; from: Tri; time: Tri; level: Level; left: number }> = [
  {
    id: 'mon',
    day: { en: 'Mondays', ko: '월요일', ja: '月曜日' },
    from: { en: 'from 4 Jan', ko: '1월 4일부터', ja: '1月4日から' },
    time: { en: '6:30 to 9:00 pm', ko: '오후 6:30~9:00', ja: '18:30〜21:00' },
    level: 'beginner',
    left: 2,
  },
  {
    id: 'tue',
    day: { en: 'Tuesdays', ko: '화요일', ja: '火曜日' },
    from: { en: 'from 5 Jan', ko: '1월 5일부터', ja: '1月5日から' },
    time: { en: '6:30 to 9:00 pm', ko: '오후 6:30~9:00', ja: '18:30〜21:00' },
    level: 'beginner',
    left: 0,
  },
  {
    id: 'wed',
    day: { en: 'Wednesdays', ko: '수요일', ja: '水曜日' },
    from: { en: 'from 6 Jan', ko: '1월 6일부터', ja: '1月6日から' },
    time: { en: '6:30 to 9:00 pm', ko: '오후 6:30~9:00', ja: '18:30〜21:00' },
    level: 'improver',
    left: 5,
  },
  {
    id: 'thu',
    day: { en: 'Thursdays', ko: '목요일', ja: '木曜日' },
    from: { en: 'from 7 Jan', ko: '1월 7일부터', ja: '1月7日から' },
    time: { en: '7:00 to 9:30 pm', ko: '오후 7:00~9:30', ja: '19:00〜21:30' },
    level: 'beginner',
    left: 3,
  },
  {
    id: 'fri',
    day: { en: 'Fridays', ko: '금요일', ja: '金曜日' },
    from: { en: 'from 8 Jan', ko: '1월 8일부터', ja: '1月8日から' },
    time: { en: '6:30 to 9:00 pm', ko: '오후 6:30~9:00', ja: '18:30〜21:00' },
    level: 'improver',
    left: 6,
  },
  {
    id: 'sat',
    day: { en: 'Saturdays', ko: '토요일', ja: '土曜日' },
    from: { en: 'from 9 Jan', ko: '1월 9일부터', ja: '1月9日から' },
    time: { en: '5:00 to 7:30 pm', ko: '오후 5:00~7:30', ja: '17:00〜19:30' },
    level: 'beginner',
    left: 4,
  },
  {
    id: 'sun',
    day: { en: 'Sundays', ko: '일요일', ja: '日曜日' },
    from: { en: 'from 10 Jan', ko: '1월 10일부터', ja: '1月10日から' },
    time: { en: '5:00 to 7:30 pm', ko: '오후 5:00~7:30', ja: '17:00〜19:30' },
    level: 'beginner',
    left: 1,
  },
];

const TIMETABLE = {
  title: { en: 'Classes starting in January', ko: '1월에 시작하는 수업', ja: '1月開講のクラス' },
  levelGroup: { en: 'Level', ko: '수준', ja: 'レベル' },
  levels: {
    all: { en: 'All', ko: '전체', ja: 'すべて' },
    beginner: { en: 'Beginner', ko: '입문', ja: '入門' },
    improver: { en: 'Improver', ko: '중급', ja: '中級' },
  } as Record<LevelFilter, Tri>,
  columns: {
    day: { en: 'Evening', ko: '요일', ja: '曜日' },
    time: { en: 'Time', ko: '시간', ja: '時間' },
    level: { en: 'Level', ko: '수준', ja: 'レベル' },
    places: { en: 'Places left', ko: '남은 자리', ja: '残席' },
    action: { en: 'Booking', ko: '예약', ja: '予約' },
  },
  // {n} is the number of free places.
  left: { en: '{n} left', ko: '{n}자리 남음', ja: '残り{n}席' },
  full: { en: 'Full', ko: '마감', ja: '満席' },
  book: { en: 'Book', ko: '예약', ja: '予約' },
  // The accessible name of a row's booking link. {day} is the class.
  bookDay: { en: 'Book {day}', ko: '{day} 예약', ja: '{day}を予約' },
  waiting: { en: 'Waiting list', ko: '대기자 명단', ja: 'キャンセル待ち' },
  // Read out when the filter changes. {n} of {total} classes are listed.
  shown: {
    en: 'Showing {n} of {total} classes',
    ko: '{total}개 수업 중 {n}개를 표시합니다.',
    ja: '{total}件のクラスのうち{n}件を表示しています。',
  },
  note: {
    en: 'A course is four evenings in a row on the same weekday. There are eight wheels, so eight places in each class. To join the waiting list of a full class, write to {email}.',
    ko: '한 과정은 같은 요일에 네 번 연속으로 열리는 저녁 수업입니다. 물레가 여덟 대이므로 각 수업의 자리는 여덟 개입니다. 마감된 수업의 대기자 명단에 올리려면 {email} 주소로 메일을 보내 주세요.',
    ja: 'コースは同じ曜日に4回連続で行う夜間レッスンです。ろくろは8台あるので、各クラスの定員は8名です。満席のクラスのキャンセル待ちは、{email}までご連絡ください。',
  },
};

type KilnDay = 'bisque' | 'glaze' | 'cool-b' | 'cool-g';

const KILN = {
  title: { en: 'Kiln week', ko: '가마 주간', ja: '窯の一週間' },
  lead: {
    en: "The kiln fires twice a week, and glazed work from Friday's firing is on the shelf by the door from Sunday. Collect it between 10 am and 2 pm on any Sunday within four weeks.",
    ko: '가마는 일주일에 두 번 소성합니다. 금요일 재벌을 마친 작품은 일요일부터 출입문 옆 선반에 놓입니다. 4주 안의 일요일 아무 날이나 오전 10시부터 오후 2시 사이에 찾아가 주세요.',
    ja: '窯は週に2回焼成します。金曜日の本焼きを終えた作品は、日曜日から入口脇の棚に置かれます。4週間以内のどの日曜日でも、午前10時から午後2時の間に受け取れます。',
  },
  weekLabel: {
    en: 'One week of the kiln, Monday to Sunday',
    ko: '가마의 일주일, 월요일부터 일요일까지',
    ja: '窯の一週間、月曜日から日曜日まで',
  },
  days: [
    { day: { en: 'Mon', ko: '월', ja: '月' }, what: { en: 'Loading', ko: '가마 넣기', ja: '窯詰め' } },
    {
      day: { en: 'Tue', ko: '화', ja: '火' },
      what: { en: 'Bisque firing', ko: '초벌 소성', ja: '素焼き' },
      detail: { en: 'cone 06, 1000 °C', ko: '콘 06, 1000 °C', ja: 'コーン06、1000 °C' },
      kind: 'bisque',
    },
    { day: { en: 'Wed', ko: '수', ja: '水' }, what: { en: 'Cooling', ko: '식히기', ja: '冷却' }, kind: 'cool-b' },
    { day: { en: 'Thu', ko: '목', ja: '木' }, what: { en: 'Unloading', ko: '가마 빼기', ja: '窯出し' } },
    {
      day: { en: 'Fri', ko: '금', ja: '金' },
      what: { en: 'Glaze firing', ko: '재벌 소성', ja: '本焼き' },
      detail: { en: 'cone 6, 1220 °C', ko: '콘 6, 1220 °C', ja: 'コーン6、1220 °C' },
      kind: 'glaze',
    },
    { day: { en: 'Sat', ko: '토', ja: '土' }, what: { en: 'Cooling', ko: '식히기', ja: '冷却' }, kind: 'cool-g' },
    {
      day: { en: 'Sun', ko: '일', ja: '日' },
      what: { en: 'Collection', ko: '수령', ja: '受け取り' },
      detail: { en: '10 am to 2 pm', ko: '오전 10시~오후 2시', ja: '午前10時〜午後2時' },
    },
  ] as Array<{ day: Tri; what: Tri; detail?: Tri; kind?: KilnDay }>,
};

// The two firings are raised blocks; the day after each still holds some heat.
const KILN_CLASS: Record<KilnDay, string> = {
  bisque: 'is-fire is-bisque',
  glaze: 'is-fire is-glaze',
  'cool-b': 'is-cool-b',
  'cool-g': 'is-cool-g',
};

const PRICES = {
  title: { en: 'Prices', ko: '가격', ja: '料金' },
  lead: {
    en: 'Clay, glazes and firing are included in every course. Aprons and tools are in the studio.',
    ko: '모든 과정에는 흙, 유약, 소성 비용이 포함됩니다. 앞치마와 도구는 공방에 있습니다.',
    ja: '料金にはすべてのコースで粘土、釉薬、焼成費用が含まれます。エプロンと道具は工房に用意されています。',
  },
  rows: [
    {
      name: { en: 'Four-evening course', ko: '저녁 4회 과정', ja: '4回の夜のコース' },
      detail: {
        en: '10 hours of teaching, 3 kg of clay, glazes and both firings',
        ko: '수업 10시간, 흙 3 kg, 유약과 두 번의 소성',
        ja: '授業10時間、粘土3 kg、釉薬と2回の焼成',
      },
      price: { en: '£168', ko: '£168', ja: '£168' },
    },
    {
      name: { en: 'Taster evening', ko: '체험 수업', ja: '体験の夜' },
      detail: {
        en: 'One evening on the wheel, with one piece fired for you',
        ko: '물레 수업 한 번과 작품 한 점 소성 포함',
        ja: 'ろくろ1回と、作品1点の焼成付き',
      },
      price: { en: '£45', ko: '£45', ja: '£45' },
    },
    {
      name: { en: 'Open studio', ko: '자유 작업', ja: 'オープンスタジオ' },
      detail: {
        en: 'Per evening, for anyone who has finished a course',
        ko: '1회당, 과정을 마친 분을 위한 자유 작업',
        ja: '1回につき、コースを修了した方向け',
      },
      price: { en: '£12', ko: '£12', ja: '£12' },
    },
    {
      name: { en: 'Extra firing', ko: '추가 소성', ja: '追加の焼成' },
      detail: {
        en: 'Per piece up to 15 cm tall, bisque and glaze',
        ko: '높이 15 cm 이하 작품 1점당, 초벌과 재벌',
        ja: '高さ15 cm以下の作品1点につき、素焼きと本焼き',
      },
      price: { en: '£5', ko: '£5', ja: '£5' },
    },
  ],
};

const BOOKING = {
  title: { en: 'Book a place', ko: '자리 예약', ja: '席を予約' },
  lead: {
    en: 'Choose a class and leave your name. We hold a wheel for you and take payment at the studio on the first evening.',
    ko: '수업을 고르고 이름을 남겨 주세요. 물레 한 대를 잡아 두고, 결제는 첫 저녁에 공방에서 받습니다.',
    ja: 'クラスを選び、お名前をお預けください。ろくろを1台お取りし、お支払いは初回の夜に工房でお受けします。',
  },
  classLabel: { en: 'Class', ko: '수업', ja: 'クラス' },
  classEmpty: { en: 'Choose a class', ko: '수업을 선택하세요', ja: 'クラスを選択してください' },
  // One option of the class list. {day} and {time} come from the timetable.
  option: { en: '{day}, {time}', ko: '{day} {time}', ja: '{day} {time}' },
  optionFull: { en: '{day}, {time} (full)', ko: '{day} {time} (마감)', ja: '{day} {time} (満席)' },
  nameLabel: { en: 'Name', ko: '이름', ja: 'お名前' },
  emailLabel: { en: 'Email', ko: '이메일', ja: 'メールアドレス' },
  submit: { en: 'Book this place', ko: '이 자리 예약하기', ja: 'この席を予約する' },
  classError: { en: 'Choose a class first.', ko: '먼저 수업을 선택하세요.', ja: '先にクラスを選択してください。' },
  nameError: { en: 'Enter your name.', ko: '이름을 입력하세요.', ja: 'お名前を入力してください。' },
  emailError: {
    en: 'Check the email address. It needs an @ and a domain.',
    ko: '이메일 주소를 확인하세요. @와 도메인이 있어야 합니다.',
    ja: 'メールアドレスを確認してください。@とドメインが必要です。',
  },
  doneTitle: { en: 'Your wheel is booked', ko: '물레 자리가 예약되었습니다', ja: 'ろくろの予約が完了しました' },
  // The class that was booked. {day}, {from} and {time} come from the timetable.
  doneClass: { en: '{day} {from}, {time}', ko: '{day}, {from}, {time}', ja: '{day} {from}、{time}' },
  // {name} is what the visitor typed.
  doneBody: {
    en: 'Thank you, {name}. One of the eight wheels is held in your name, and you pay at the studio on the first evening.',
    ko: '{name}님, 감사합니다. 물레 여덟 대 중 한 대를 예약자 이름으로 잡아 두었으며, 결제는 첫 저녁에 공방에서 하시면 됩니다.',
    ja: '{name}様、ありがとうございます。ろくろ8台のうち1台をお名前で確保しました。お支払いは初回の夜に工房でお願いします。',
  },
  sample: {
    en: 'This is a sample page, so no booking was made.',
    ko: '이 페이지는 샘플이므로 실제 예약은 이루어지지 않았습니다.',
    ja: 'これはサンプルページのため、予約は行われていません。',
  },
} satisfies Record<string, Tri>;

const PROMPTS: Record<Lang, string> = {
  en: `Design one real page in Clay Aurora style — a pale ground where every object and control is a piece of soft clay with real depth, under one band of northern light.

Pick a believable subject that is made by hand, such as a pottery studio, a bakery, a toy maker or a children's workshop, and write its real content. The page must read as that subject's page, never as a page about its own style.

COLOR TOKENS:
--bg: #f6f4ff
--dent: #e9e5fa
--mint: #c2efe0
--teal: #5fb09c
--violet: #6a5dd1
--violet-deep: #463b9f
--text: #1c1733
--muted: #5a5574
--line: rgba(52, 40, 128, 0.42)
--edge: #7b72ad
--shadow: rgb(52, 40, 128) at 0.14 to 0.6 opacity
No other hues. Shadows are violet, never grey or black.

CLAY HAS TWO STATES:
- Raised: lit from the top left. A 1.5px white inner line along the top edge, a soft white inner glow from the top left, a violet inner shade at the bottom right, and a short, tight drop shadow.
- Pressed: the reverse. A violet inner shadow from the top left and a white inner line at the bottom right, on the dent colour.
- Trays, wells and form fields are pressed. Tokens, keys, the test tile and the firing days are raised.
- Bare clay carries a fine grain (SVG turbulence at low opacity). Glazed clay has no grain and one sharp white highlight.
- Lines are scored into the surface: a 1px violet line with a 1.5px white line under it.

THE BAND OF LIGHT:
- Once, behind the first screen, and nowhere else: a horizontal gradient from mint through teal to violet, rotated -6deg. It is drawn twice: as a soft band (blur 38px, opacity 0.6) and as rays above it, masked with two repeating gradients and fading upward.
- It is atmosphere. It never appears on text, buttons or cards.

TYPOGRAPHY:
One family: Fredoka (variable, width 75 to 125, weights 400, 500 and 600).
Headline: weight 600, font-stretch 122%, tracking -0.015em, line-height 0.96, clamp(2.9rem, 5.2vw, 4rem)
Section headings: weight 600, font-stretch 116%, tracking -0.01em, line-height 1, clamp(2.2rem, 4.2vw, 3.2rem)
Small headings: weight 600, font-stretch 110%, 1.75rem
Names, prices and token numbers: weight 600, 1.25rem to 1.875rem
Body: weight 400 at normal width, 1.0625rem, line-height 1.55. Labels: weight 500.
No second typeface. Width and weight do the work a second face would do.

LAYOUT:
- Hero in two columns: the headline, two sentences and the one clay button on the left; on the right a pressed tray that holds the steps of the course as four raised tokens. They are numbered because they are a real sequence, and each has its own shape: a soft lump, a taller pulled form, then two trimmed squares, the last one glazed.
- A shelf of six glaze blobs on two clay boards works as a single-choice control. The chosen glaze is shown on one large test tile beside it, with its name and a two-line description.
- The timetable is a plain table on scored lines. Free places are counted with beads in a row of eight wells. A tray of three keys filters it by level. On a phone each class becomes a stacked row.
- One week of the kiln as a pressed channel of seven days; the two firing days are raised blocks.
- Prices as plain rows on scored lines beside their heading.
- A booking form with pressed fields and the clay button. The confirmation that replaces it is one glazed slab.
- Max width about 1120px, section gap 128px.

COMPONENTS:
- Clay button: 62px high, radius 22px, violet with a 6px solid side in the deeper violet. When pressed it travels down 5px and the side closes.
- Filter keys: white raised keys in a pressed tray. The active key is violet and pressed in, and carries aria-pressed.
- Glaze choice: radio inputs drawn as irregular blobs with a visible name. The chosen blob lifts 9px and gets a 3px dark ring; keyboard focus adds a second ring.
- Beads: 15px wells, a teal bead in each free one, with the count in text next to them.
- Fields: 56px high, radius 16px, dent colour, 2px outline and an inner shadow. The error text sits under its field.
- Focus: a 3px dark outline with a 4px offset.

MOTION:
- The clay button and the filter keys travel on press in 80ms.
- The chosen blob lifts in 160ms. The test tile is set down again when the glaze changes.
- prefers-reduced-motion removes the travel and the set-down.

FORBIDDEN:
- A grid of identical rounded cards
- Thin outlined pills and tags
- Rounded shapes with a flat fill and no light or shade
- Grey or black shadows
- The band of light in more than one place, or as a fill for text and buttons
- Drawn mugs, pots, hands or people
- A small label above every heading, and all-caps tracked labels
- Dark page backgrounds

OUTPUT:
1) CSS custom properties
2) Semantic HTML and CSS
3) Responsive layout down to 320px with no horizontal scroll; the timetable stacks on a phone
4) Visible focus, labelled form fields with errors next to them, reduced-motion support`,
  ko: `Clay Aurora 스타일로 실제 페이지 한 장을 디자인한다. 모든 사물과 컨트롤이 실제 깊이를 가진 부드러운 흙 조각인 옅은 바탕에, 북쪽 빛의 띠 하나가 놓인 페이지다.

손으로 만드는 그럴듯한 주제를 고르고 그 실제 내용을 쓴다. 예: 도예 공방, 빵집, 장난감 공방, 어린이 공방. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체에 관한 페이지로 읽혀서는 안 된다.

COLOR TOKENS:
--bg: #f6f4ff
--dent: #e9e5fa
--mint: #c2efe0
--teal: #5fb09c
--violet: #6a5dd1
--violet-deep: #463b9f
--text: #1c1733
--muted: #5a5574
--line: rgba(52, 40, 128, 0.42)
--edge: #7b72ad
--shadow: rgb(52, 40, 128), 불투명도 0.14~0.6
다른 색상은 쓰지 않는다. 그림자는 보라색이며, 회색이나 검은색은 금지한다.

CLAY HAS TWO STATES:
- 올림: 왼쪽 위에서 빛을 받는다. 위쪽 가장자리를 따라 1.5px 흰색 안쪽 선, 왼쪽 위에서 오는 부드러운 흰색 안쪽 빛, 오른쪽 아래의 보라색 안쪽 그늘, 짧고 촘촘한 그림자를 준다.
- 눌림: 그 반대다. 왼쪽 위에서 오는 보라색 안쪽 그림자와 오른쪽 아래의 흰색 안쪽 선을, 움푹한 색 위에 준다.
- 쟁반, 우물, 입력 칸은 눌린 상태다. 수업 단계 토큰, 키, 시험편, 소성 요일은 올린 상태다.
- 유약을 바르지 않은 흙에는 고운 결을 준다(낮은 불투명도의 SVG turbulence). 유약을 바른 흙에는 결이 없고 날카로운 흰색 하이라이트 하나만 둔다.
- 선은 표면에 새긴 홈처럼 그린다. 1px 보라색 선 아래에 1.5px 흰색 선을 둔다.

THE BAND OF LIGHT:
- 첫 화면 뒤에 한 번만, 다른 곳에는 두지 않는다. 민트에서 청록을 거쳐 보라로 가는 가로 그라데이션을 -6deg 회전해 쓴다. 두 번 그린다. 하나는 부드러운 띠(blur 38px, opacity 0.6), 다른 하나는 그 위의 광선으로, 두 개의 반복 그라데이션으로 마스크하고 위로 갈수록 흐리게 한다.
- 분위기를 위한 요소다. 글자, 버튼, 카드 위에는 절대 두지 않는다.

TYPOGRAPHY:
서체는 하나: Fredoka(가변, 폭 75~125, 굵기 400, 500, 600).
제목: 굵기 600, font-stretch 122%, 자간 -0.015em, 행간 0.96, clamp(2.9rem, 5.2vw, 4rem)
섹션 제목: 굵기 600, font-stretch 116%, 자간 -0.01em, 행간 1, clamp(2.2rem, 4.2vw, 3.2rem)
작은 제목: 굵기 600, font-stretch 110%, 1.75rem
이름, 가격, 토큰 숫자: 굵기 600, 1.25rem~1.875rem
본문: 굵기 400, 보통 폭, 1.0625rem, 행간 1.55. 라벨: 굵기 500.
두 번째 서체는 쓰지 않는다. 폭과 굵기가 두 번째 서체의 역할을 한다.

LAYOUT:
- 히어로는 두 열이다. 왼쪽에 제목, 두 문장, 흙 버튼 하나. 오른쪽에는 과정의 단계를 올린 토큰 네 개로 담은 눌린 쟁반. 토큰에는 번호를 붙인다. 실제 순서이기 때문이며, 각 토큰은 고유한 모양을 갖는다. 부드러운 덩어리, 더 높이 빚어 올린 형태, 그다음 모서리를 깎은 정사각형 두 개, 마지막은 유약을 입힌 것이다.
- 흙 판 두 장에 놓인 유약 덩어리 여섯 개의 선반은 단일 선택 컨트롤로 작동한다. 선택한 유약은 옆의 큰 시험편 하나에 이름과 두 줄 설명과 함께 보인다.
- 시간표는 새긴 선 위에 놓인 평범한 표다. 남은 자리는 여덟 개의 우물에 놓인 구슬로 센다. 키 세 개가 든 쟁반으로 수준별 필터를 건다. 휴대폰에서는 각 수업이 쌓인 행이 된다.
- 가마의 한 주는 7일을 담은 눌린 홈이다. 두 소성일은 올린 블록이다.
- 가격은 제목 옆, 새긴 선 위에 놓인 평범한 행으로 보인다.
- 눌린 입력 칸과 흙 버튼이 있는 예약 양식. 양식을 대신하는 확인 화면은 유약을 입힌 판 하나다.
- 최대 너비 약 1120px, 섹션 간격 128px.

COMPONENTS:
- 흙 버튼: 높이 62px, 모서리 반경 22px, 보라색 바탕에 더 짙은 보라색 6px 옆면. 눌리면 5px 아래로 내려가고 옆면이 닫힌다.
- 필터 키: 눌린 쟁반 위의 흰색 올린 키. 활성 키는 보라색이며 눌린 상태이고 aria-pressed를 가진다.
- 유약 선택: 이름이 보이는 불규칙한 덩어리 모양의 라디오 입력. 선택된 덩어리는 9px 올라가고 3px 짙은 고리를 얻는다. 키보드 포커스는 두 번째 고리를 더한다.
- 구슬: 15px 우물. 빈 자리마다 청록 구슬 하나를 두고, 옆에 개수를 글로 적는다.
- 입력 칸: 높이 56px, 모서리 반경 16px, 움푹한 색, 2px 윤곽선, 안쪽 그림자. 오류 문구는 입력 칸 아래에 둔다.
- 포커스: 4px 간격을 둔 3px 짙은 윤곽선.

MOTION:
- 흙 버튼과 필터 키는 누를 때 80ms 동안 이동한다.
- 선택된 덩어리는 160ms에 올라간다. 유약이 바뀌면 시험편은 다시 내려앉는다.
- prefers-reduced-motion에서는 이동과 내려앉는 동작을 없앤다.

FORBIDDEN:
- 같은 둥근 카드를 격자로 늘어놓기
- 얇은 윤곽선의 알약 모양 태그
- 빛과 그늘 없이 평평하게 칠한 둥근 형태
- 회색이나 검은색 그림자
- 빛의 띠를 두 곳 이상에 두기, 또는 글자와 버튼의 채우기로 쓰기
- 그려 넣은 머그컵, 항아리, 손, 사람
- 모든 제목 위의 작은 라벨, 전부 대문자에 자간을 넓힌 라벨
- 어두운 페이지 배경

OUTPUT:
1) CSS 사용자 지정 속성
2) 의미를 갖춘 HTML과 CSS
3) 320px까지 가로 스크롤 없이 반응형 레이아웃. 휴대폰에서는 시간표가 쌓인다.
4) 보이는 포커스, 이름표가 붙은 입력 칸과 그 옆의 오류 문구, reduced-motion 지원`,
  ja: `Clay Aurora スタイルで、実在するように見える一枚のページをデザインする。すべての要素とコントロールが実際の奥行きを持つ柔らかな粘土でできた、淡い地の上に、北の光の帯が一本走るページ。

手作りされる、もっともらしい題材を一つ選び、その実際の内容を書く。例：陶芸工房、パン屋、おもちゃ工房、子ども向け工房。ページはその題材のページとして読めなければならず、スタイルそのものについてのページになってはならない。

COLOR TOKENS:
--bg: #f6f4ff
--dent: #e9e5fa
--mint: #c2efe0
--teal: #5fb09c
--violet: #6a5dd1
--violet-deep: #463b9f
--text: #1c1733
--muted: #5a5574
--line: rgba(52, 40, 128, 0.42)
--edge: #7b72ad
--shadow: rgb(52, 40, 128)、不透明度0.14〜0.6
他の色相は使わない。影は紫とし、グレーや黒にはしない。

CLAY HAS TWO STATES:
- 隆起：左上から光が当たる。上端に沿った1.5pxの白い内側の線、左上からの柔らかな白い内側の光、右下の紫の内側の陰、短く締まったドロップシャドウ。
- 押し込み：その逆。左上からの紫の内側の影と、右下の白い内側の線を、くぼみの色の上に置く。
- トレイ、くぼみ、入力欄は押し込み。工程のトークン、キー、試験片、焼成の日は隆起。
- 素地の粘土には細かい粒子感を付ける（低い不透明度のSVG turbulence）。釉薬をかけた粘土には粒子感を付けず、鋭い白いハイライトを一つだけ置く。
- 線は表面に刻んだ溝として描く。1pxの紫の線の下に1.5pxの白い線を置く。

THE BAND OF LIGHT:
- 最初の画面の背後に一度だけ。ほかでは使わない。ミントからティール、紫へ向かう横方向のグラデーションを-6degに回転させる。二重に描く。柔らかな帯（blur 38px、opacity 0.6）と、その上の光線として。光線は二つの繰り返しグラデーションでマスクし、上へ向かって消える。
- 雰囲気を作るための要素。文字、ボタン、カードには決して置かない。

TYPOGRAPHY:
書体は一つ：Fredoka（可変、幅75〜125、ウェイト400・500・600）。
見出し（ヘッドライン）：ウェイト600、font-stretch 122%、字間 -0.015em、行間 0.96、clamp(2.9rem, 5.2vw, 4rem)
セクション見出し：ウェイト600、font-stretch 116%、字間 -0.01em、行間 1、clamp(2.2rem, 4.2vw, 3.2rem)
小見出し：ウェイト600、font-stretch 110%、1.75rem
名前、価格、トークンの数字：ウェイト600、1.25rem〜1.875rem
本文：ウェイト400、標準の幅、1.0625rem、行間 1.55。ラベル：ウェイト500。
二つ目の書体は使わない。幅とウェイトが、二つ目の書体の役割を果たす。

LAYOUT:
- ヒーローは2列。左に見出し、二文、粘土のボタン一つ。右には、講座の工程を四つの隆起したトークンで並べた押し込みトレイ。実際の順序なので番号を付け、それぞれ固有の形にする。柔らかい塊、より高く引き伸ばした形、次に角を削った正方形二つ、最後は釉薬をかけたもの。
- 粘土の板2枚に並べた釉薬の塊6個の棚は、単一選択のコントロールとして働く。選んだ釉薬は、横にある大きな試験片一枚に、名前と二行の説明とともに示す。
- 時間割は刻まれた線の上に置かれたシンプルな表。空席は、八つのくぼみに並ぶビーズで数える。キー3つのトレイで級ごとに絞り込む。スマートフォンでは各クラスが積み重なった行になる。
- 窯の一週間は、七日間を収めた押し込みの溝。二回の焼成日は隆起したブロック。
- 料金は見出しの横に、刻まれた線の上の平易な行として並べる。
- 押し込んだ入力欄と粘土のボタンを備えた予約フォーム。それに代わる確認は、釉薬をかけた板一枚。
- 最大幅 約1120px、セクション間隔 128px。

COMPONENTS:
- 粘土ボタン：高さ62px、角丸半径22px、紫の地に、より濃い紫の6pxの側面。押すと5px下に沈み、側面が閉じる。
- フィルターキー：押し込みトレイの上にある白い隆起したキー。アクティブなキーは紫で押し込まれ、aria-pressedを持つ。
- 釉薬の選択：名前が見える不規則な塊として描かれたラジオ入力。選ばれた塊は9px持ち上がり、3pxの濃いリングを得る。キーボードのフォーカスでは二つ目のリングが加わる。
- ビーズ：15pxのくぼみ。空いている席ごとにティールのビーズを一つ置き、横に数を文字で添える。
- 入力欄：高さ56px、角丸半径16px、くぼみの色、2pxの輪郭線と内側の影。エラー文は入力欄の下に置く。
- フォーカス：4pxのオフセットを持つ3pxの濃い輪郭線。

MOTION:
- 粘土ボタンとフィルターキーは、押すと80msで沈む。
- 選ばれた塊は160msで持ち上がる。釉薬が変わると、試験片は再び下に置かれる。
- prefers-reduced-motionでは、移動と沈み込みの動きをなくす。

FORBIDDEN:
- 同じ丸いカードを格子状に並べること
- 細い輪郭線のピル型タグ
- 光と影のない、平面的に塗られた丸い形
- グレーや黒の影
- 光の帯を複数箇所に置くこと、または文字やボタンの塗りに使うこと
- 描かれたマグカップ、壺、手、人物
- すべての見出しの上に置く小さなラベル、すべて大文字で字間を空けたラベル
- 暗いページ背景

OUTPUT:
1) CSS カスタムプロパティ
2) セマンティックなHTMLとCSS
3) 320pxまで横スクロールなしのレスポンシブレイアウト。スマートフォンでは時間割が積み重なる。
4) 見えるフォーカス、ラベル付きの入力欄とその横のエラー、reduced-motionへの対応`,
};

type Field = 'classId' | 'name' | 'email';

const FIELD_IDS: Record<Field, string> = { classId: 'ca-class', name: 'ca-name', email: 'ca-email' };
const FIELD_ORDER: Field[] = ['classId', 'name', 'email'];
const LEVEL_FILTERS: LevelFilter[] = ['all', 'beginner', 'improver'];

export function PortedFusionClayAuroraPage({ lang }: PortedStylePageProps) {
  const [glazeId, setGlazeId] = useState('fjord');
  const [level, setLevel] = useState<LevelFilter>('all');
  const [values, setValues] = useState<Record<Field, string>>({ classId: '', name: '', email: '' });
  const [invalid, setInvalid] = useState<Field[]>([]);
  const [booked, setBooked] = useState<{ classId: string; name: string } | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const t = (text: Tri) => text[lang];

  const glaze = GLAZES.find((item) => item.id === glazeId) ?? GLAZES[0];
  const listed = CLASSES.filter((item) => level === 'all' || item.level === level);
  const bookedClass = booked ? CLASSES.find((item) => item.id === booked.classId) : undefined;

  // The form leaves the page once the booking is in, and focus would fall back to
  // the top of the document. Focus goes to the confirmation that replaces the form.
  useEffect(() => {
    if (booked) doneRef.current?.focus();
  }, [booked]);

  const setValue = (field: Field, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setInvalid((current) => current.filter((item) => item !== field));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const checks: Record<Field, boolean> = {
      classId: CLASSES.some((item) => item.id === values.classId && item.left > 0),
      name: values.name.trim() !== '',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()),
    };
    const failed = FIELD_ORDER.filter((field) => !checks[field]);
    setInvalid(failed);
    if (failed.length > 0) {
      // The first field that needs attention takes focus; its error is read out by role="alert".
      event.currentTarget.querySelector<HTMLElement>(`#${FIELD_IDS[failed[0]]}`)?.focus();
      return;
    }
    setBooked({ classId: values.classId, name: values.name.trim() });
  };

  const glazeVars = (item: (typeof GLAZES)[number]) =>
    ({ '--ca-g1': item.g1, '--ca-g2': item.g2, '--ca-g3': item.g3, '--ca-g4': item.g4, '--ca-pool': item.pool }) as CSSProperties;

  const errorProps = (field: Field) => ({
    'aria-invalid': invalid.includes(field),
    'aria-describedby': invalid.includes(field) ? `${FIELD_IDS[field]}-error` : undefined,
  });

  return (
    <FusionShell
      fusionId="fusion-clay-aurora"
      lang={lang}
      tone="light"
      accent="#6a5dd1"
      prev={{ href: '/pages/fusion-grain-mono.html', label: 'Analog Press' }}
      next={{ href: '/pages/fusion-floppy-exe.html', label: 'Floppy.exe' }}
      prompts={PROMPTS}
    >
      <div className="ca">
        <div className="ca-top">
          <p className="ca-mark">{STUDIO.name}</p>
          <nav className="ca-top__nav" aria-label={t(STUDIO.nav)}>
            {STUDIO.links.map((link) => (
              <a key={link.href} href={link.href}>{t(link.label)}</a>
            ))}
          </nav>
        </div>

        <section className="ca-hero" aria-labelledby="ca-title">
          <div>
            <h1 id="ca-title">{t(STUDIO.title)}</h1>
            <p className="ca-lede">{t(STUDIO.lede)}</p>
            <div className="ca-act">
              <a className="ca-key" href="#ca-book">{t(STUDIO.book)}</a>
              <p>{t(STUDIO.next)}</p>
            </div>
          </div>
          <div>
            <ol className="ca-evenings" aria-label={t(STUDIO.eveningsLabel)}>
              {EVENINGS.map((evening, index) => (
                <li key={evening.en}><b>{index + 1}</b><span>{t(evening)}</span></li>
              ))}
            </ol>
            <p className="ca-hero__note">{t(STUDIO.eveningsNote)}</p>
          </div>
        </section>

        <section className="ca-section" id="ca-glazes" aria-labelledby="ca-glazes-title">
          <h2 id="ca-glazes-title" className="ca-heading">{t(GLAZE_SHELF.title)}</h2>
          <p className="ca-section__note">{t(GLAZE_SHELF.note)}</p>
          <div className="ca-glazes__grid">
            <fieldset className="ca-shelves">
              <legend className="ca-sr">{t(GLAZE_SHELF.group)}</legend>
              {SHELVES.map((shelf) => (
                <div className="ca-shelf" key={shelf[0].id}>
                  {shelf.map((item) => (
                    <label className="ca-glaze" key={item.id} style={glazeVars(item)}>
                      <input
                        type="radio"
                        name="ca-glaze"
                        value={item.id}
                        checked={item.id === glaze.id}
                        onChange={() => setGlazeId(item.id)}
                      />
                      <i aria-hidden="true" />
                      <b>{t(item.name)}</b>
                      <span>{t(item.cone)}</span>
                    </label>
                  ))}
                </div>
              ))}
            </fieldset>
            <div className="ca-test">
              <div
                key={glaze.id}
                className="ca-tile"
                role="img"
                aria-label={fill(t(GLAZE_SHELF.tile), { name: t(glaze.name) })}
                style={glazeVars(glaze)}
              >
                <i /><i /><i />
              </div>
              <div aria-live="polite">
                <h3 className="ca-test__name">{t(glaze.name)}</h3>
                <p className="ca-test__facts">{t(glaze.facts)}</p>
                <p className="ca-test__body">{t(glaze.body)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="ca-section" id="ca-classes" aria-labelledby="ca-classes-title">
          <div className="ca-classes__head">
            <h2 id="ca-classes-title" className="ca-heading">{t(TIMETABLE.title)}</h2>
            <div className="ca-levels" role="group" aria-label={t(TIMETABLE.levelGroup)}>
              {LEVEL_FILTERS.map((item) => (
                <button key={item} type="button" aria-pressed={level === item} onClick={() => setLevel(item)}>
                  {t(TIMETABLE.levels[item])}
                </button>
              ))}
            </div>
          </div>
          <table className="ca-timetable" role="table" aria-labelledby="ca-classes-title">
            <thead role="rowgroup">
              <tr role="row">
                <th scope="col" role="columnheader">{t(TIMETABLE.columns.day)}</th>
                <th scope="col" role="columnheader">{t(TIMETABLE.columns.time)}</th>
                <th scope="col" role="columnheader">{t(TIMETABLE.columns.level)}</th>
                <th scope="col" role="columnheader">{t(TIMETABLE.columns.places)}</th>
                <th scope="col" role="columnheader"><span className="ca-sr">{t(TIMETABLE.columns.action)}</span></th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {listed.map((item) => {
                const full = item.left === 0;
                return (
                  <tr role="row" key={item.id} className={full ? 'is-full' : undefined}>
                    <th scope="row" role="rowheader" className="ca-timetable__day">
                      <b>{t(item.day)}</b> <span>{t(item.from)}</span>
                    </th>
                    <td role="cell">{t(item.time)}</td>
                    <td role="cell" className="ca-timetable__level">{t(TIMETABLE.levels[item.level])}</td>
                    <td role="cell" className="ca-timetable__places">
                      <span className="ca-places">
                        <span className="ca-wheels" aria-hidden="true">
                          <i style={{ '--ca-free': item.left } as CSSProperties} />
                        </span>
                        {full ? t(TIMETABLE.full) : fill(t(TIMETABLE.left), { n: item.left })}
                      </span>
                    </td>
                    <td role="cell" className="ca-timetable__action">
                      {full ? (
                        <span className="ca-waiting">{t(TIMETABLE.waiting)}</span>
                      ) : (
                        <a
                          href="#ca-book"
                          aria-label={fill(t(TIMETABLE.bookDay), { day: t(item.day) })}
                          onClick={() => setValue('classId', item.id)}
                        >
                          {t(TIMETABLE.book)}
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="ca-sr" role="status">
            {fill(t(TIMETABLE.shown), { n: listed.length, total: CLASSES.length })}
          </p>
          <p className="ca-classes__note">{fill(t(TIMETABLE.note), { email: STUDIO.email })}</p>
        </section>

        <section className="ca-section ca-section--sub ca-kiln" id="ca-kiln" aria-labelledby="ca-kiln-title">
          <div>
            <h2 id="ca-kiln-title" className="ca-subhead">{t(KILN.title)}</h2>
            <p>{t(KILN.lead)}</p>
          </div>
          <ol className="ca-week" aria-label={t(KILN.weekLabel)}>
            {KILN.days.map((item) => (
              <li key={item.day.en} className={item.kind ? KILN_CLASS[item.kind] : undefined}>
                <b>{t(item.day)}</b>
                <span>
                  {t(item.what)}
                  {item.detail ? <small>{t(item.detail)}</small> : null}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="ca-section ca-section--sub ca-split" id="ca-prices" aria-labelledby="ca-prices-title">
          <div>
            <h2 id="ca-prices-title" className="ca-subhead">{t(PRICES.title)}</h2>
            <p>{t(PRICES.lead)}</p>
          </div>
          <dl className="ca-pricelist">
            {PRICES.rows.map((row) => (
              <div key={row.name.en}>
                <dt>{t(row.name)}<small>{t(row.detail)}</small></dt>
                <dd>{t(row.price)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ca-section ca-book__grid" id="ca-book" aria-labelledby="ca-book-title">
          <div>
            <h2 id="ca-book-title" className="ca-heading">{t(BOOKING.title)}</h2>
            <p className="ca-section__note">{t(BOOKING.lead)}</p>
          </div>
          {booked && bookedClass ? (
            <div className="ca-booked" ref={doneRef} tabIndex={-1}>
              <h3>{t(BOOKING.doneTitle)}</h3>
              <p className="ca-booked__class">
                {fill(t(BOOKING.doneClass), { day: t(bookedClass.day), from: t(bookedClass.from), time: t(bookedClass.time) })}
              </p>
              <p className="ca-booked__body">{fill(t(BOOKING.doneBody), { name: booked.name })}</p>
              <p className="ca-booked__sample">{t(BOOKING.sample)}</p>
            </div>
          ) : (
            <form className="ca-form" onSubmit={handleSubmit} noValidate aria-labelledby="ca-book-title">
              <div className="ca-field ca-field--wide">
                <label htmlFor="ca-class">{t(BOOKING.classLabel)}</label>
                <div className="ca-select">
                  <select
                    id="ca-class"
                    value={values.classId}
                    onChange={(event) => setValue('classId', event.target.value)}
                    {...errorProps('classId')}
                  >
                    <option value="">{t(BOOKING.classEmpty)}</option>
                    {CLASSES.map((item) => (
                      <option key={item.id} value={item.id} disabled={item.left === 0}>
                        {fill(t(item.left === 0 ? BOOKING.optionFull : BOOKING.option), { day: t(item.day), time: t(item.time) })}
                      </option>
                    ))}
                  </select>
                </div>
                {invalid.includes('classId') ? <p className="ca-error" id="ca-class-error" role="alert">{t(BOOKING.classError)}</p> : null}
              </div>
              <div className="ca-field">
                <label htmlFor="ca-name">{t(BOOKING.nameLabel)}</label>
                <input
                  id="ca-name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={(event) => setValue('name', event.target.value)}
                  {...errorProps('name')}
                />
                {invalid.includes('name') ? <p className="ca-error" id="ca-name-error" role="alert">{t(BOOKING.nameError)}</p> : null}
              </div>
              <div className="ca-field">
                <label htmlFor="ca-email">{t(BOOKING.emailLabel)}</label>
                <input
                  id="ca-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={values.email}
                  onChange={(event) => setValue('email', event.target.value)}
                  {...errorProps('email')}
                />
                {invalid.includes('email') ? <p className="ca-error" id="ca-email-error" role="alert">{t(BOOKING.emailError)}</p> : null}
              </div>
              <div className="ca-form__send">
                <button className="ca-key" type="submit">{t(BOOKING.submit)}</button>
              </div>
            </form>
          )}
        </section>

        <footer className="ca-footer" id="ca-find">
          <span>{t(STUDIO.address)}</span>
          <span>{STUDIO.email}</span>
        </footer>
      </div>
    </FusionShell>
  );
}
