import { useEffect, useRef, useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFusionBentoNoirPage.css';

// The page of Kuro, a counter restaurant with eight seats, one set course and
// two seatings a night. Tonight's course is one lacquer tray whose compartments
// are the dishes. The seats are eight marks for each seating.

type Tri = Record<Lang, string>;

const NAME = 'Kuro';
const SEATS = 8;
const PRICE = 185;
const MAX_PARTY = 4;

// `taken` is the number of seats other guests have already reserved.
const SEATINGS = [
  { id: 'early', time: '18:00', ends: '20:00', taken: 7 },
  { id: 'late', time: '20:30', ends: '22:30', taken: 3 },
];

const HERO = {
  offer: {
    en: 'Eight seats. One course. Two seatings a night.',
    ko: '좌석 8석, 코스 하나, 하루 두 번의 회차.',
    ja: '8席、コースは一つ、一晩に二回の入れ替え。',
  },
  date: { en: 'Thursday, November 19', ko: '11월 19일 목요일', ja: '11月19日(木)' },
  priceNote: { en: 'per person, service included', ko: '1인 기준, 봉사료 포함', ja: 'お一人様、サービス料込み' },
  action: { en: 'Reserve a seat', ko: '좌석 예약하기', ja: '席を予約する' },
  nav: { en: 'On this page', ko: '페이지 목차', ja: 'このページの目次' },
  navCourse: { en: 'Course', ko: '코스', ja: 'コース' },
  navSeats: { en: 'Seats', ko: '좌석', ja: '席' },
  navNotes: { en: 'House notes', ko: '가게 안내', ja: '店からのご案内' },
  navFind: { en: 'Find us', ko: '오시는 길', ja: 'アクセス' },
} satisfies Record<string, Tri>;

// A dish's size is its weight in the course: it sets how large its compartment is.
const COURSE = {
  title: { en: "Tonight's course", ko: '오늘 밤의 코스', ja: '本日のコース' },
  note: {
    en: 'Seven dishes, served in this order over about two hours. The course changes with what the fish market has that morning.',
    ko: '일곱 가지 요리를 이 순서대로 약 두 시간에 걸쳐 내놓습니다. 코스는 그날 아침 생선 시장에 들어온 재료에 따라 바뀝니다.',
    ja: '七品の料理を、この順番で約二時間かけてお出しします。コースは、その朝に市場で仕入れた食材によって変わります。',
  },
  dishes: [
    {
      size: 'sm',
      name: { en: 'Persimmon and tofu', ko: '감과 두부', ja: '柿と豆腐' },
      of: {
        en: 'Fuyu persimmon, chrysanthemum greens, sesame tofu dressing',
        ko: '후유 감, 쑥갓, 참깨 두부 드레싱',
        ja: '富有柿、春菊、ごま豆腐のドレッシング',
      },
      note: { en: 'Served cold as you sit down.', ko: '자리에 앉으시면 차갑게 내놓습니다.', ja: 'お席に着かれたら冷たいままお出しします。' },
    },
    {
      size: 'sm',
      name: { en: 'Clear soup of tilefish', ko: '옥돔 맑은국', ja: '甘鯛のお吸い物' },
      of: {
        en: 'Tilefish, turnip, yuzu peel, first dashi',
        ko: '옥돔, 무, 유자 껍질, 초번 다시',
        ja: '甘鯛、蕪、柚子の皮、一番だし',
      },
      note: {
        en: 'The dashi is drawn fresh for each seating.',
        ko: '다시는 회차마다 새로 우려 냅니다.',
        ja: 'だしは回ごとに取り直します。',
      },
    },
    {
      size: 'md',
      name: { en: 'Sea bream, three cuts', ko: '도미 세 가지 부위', ja: '鯛の三種盛り' },
      of: {
        en: 'Sea bream aged three days, squid, fresh wasabi, two soy sauces',
        ko: '3일 숙성한 도미, 오징어, 생와사비, 간장 두 가지',
        ja: '三日熟成の鯛、イカ、生わさび、醤油二種',
      },
      note: {
        en: 'Cut at the counter in front of you.',
        ko: '눈앞의 카운터에서 썰어 드립니다.',
        ja: 'お目の前のカウンターで切り分けます。',
      },
    },
    {
      size: 'lg',
      name: { en: 'Spanish mackerel over charcoal', ko: '삼치 숯불구이', ja: '鰆の炭火焼き' },
      of: {
        en: 'Spanish mackerel, 48-hour white miso marinade, grated daikon, sudachi',
        ko: '삼치, 48시간 백된장 양념, 무 간 것, 스다치',
        ja: '鰆、四十八時間漬けの白味噌床、大根おろし、すだち',
      },
      note: {
        en: 'Grilled over binchotan one portion at a time, so the counter is served from left to right.',
        ko: '비장탄에 한 점씩 구워 카운터의 왼쪽에서 오른쪽으로 차례로 내놓습니다.',
        ja: '備長炭で一人前ずつ焼き、カウンターの左から右へ順にお出しします。',
      },
    },
    {
      size: 'sm',
      name: { en: 'Duck and daikon', ko: '오리와 무', ja: '鴨と大根' },
      of: {
        en: 'Duck breast, daikon simmered for six hours, hot mustard',
        ko: '오리 가슴살, 여섯 시간 졸인 무, 핫 머스터드',
        ja: '鴨の胸肉、六時間炊いた大根、からし',
      },
      note: { en: 'The only meat in the course.', ko: '코스에서 유일한 육류입니다.', ja: 'コースで唯一の肉料理です。' },
    },
    {
      size: 'md',
      name: { en: 'Clay-pot rice', ko: '토기 솥밥', ja: '土鍋ご飯' },
      of: {
        en: 'Koshihikari rice, salmon roe, pickles, red miso soup',
        ko: '고시히카리 쌀, 연어알, 절임 반찬, 적된장국',
        ja: 'コシヒカリ、いくら、漬物、赤だし',
      },
      note: {
        en: 'One pot per seating. Seconds are offered, and what is left is wrapped for you to take home.',
        ko: '회차마다 한 솥씩 지어 냅니다. 한 공기 더 드릴 수 있으며, 남은 밥은 포장해 드립니다.',
        ja: '回ごとに一釜ずつ炊きます。おかわりをお出しし、残った分はお持ち帰り用にお包みします。',
      },
    },
    {
      size: 'sm',
      name: { en: 'Roasted tea ice', ko: '호지차 아이스크림', ja: 'ほうじ茶アイス' },
      of: {
        en: 'Hojicha ice cream, candied chestnut, black sugar syrup',
        ko: '호지차 아이스크림, 밤 설탕 조림, 흑설탕 시럽',
        ja: 'ほうじ茶アイス、栗の甘露煮、黒糖シロップ',
      },
      note: {
        en: 'Comes with a cup of the same tea.',
        ko: '같은 차를 한 잔 곁들여 나옵니다.',
        ja: '同じお茶を一杯お付けします。',
      },
    },
  ] satisfies Array<{ size: 'sm' | 'md' | 'lg'; name: Tri; of: Tri; note: Tri }>,
};

// {n} is a number of seats or guests, {time} a time of day, {free} and {total} seat counts.
// A text with a One and a Many form is chosen by {n}.
const BOOKING = {
  title: { en: 'Seats for tonight', ko: '오늘 밤 좌석', ja: '本日の席' },
  note: {
    en: 'The counter has eight seats. Both seatings serve the same course.',
    ko: '카운터에는 8석이 있습니다. 두 회차 모두 같은 코스를 냅니다.',
    ja: 'カウンターは8席です。両回とも同じコースをお出しします。',
  },
  group: { en: 'Seating', ko: '회차', ja: '回' },
  ends: { en: 'until about {time}', ko: '약 {time}까지', ja: '{time}頃まで' },
  leftOne: { en: '1 seat left', ko: '{n}석 남음', ja: '残り{n}席' },
  leftMany: { en: '{n} seats left', ko: '{n}석 남음', ja: '残り{n}席' },
  heldOne: { en: '1 is held for your party.', ko: '{n}석이 일행을 위해 확보되어 있습니다.', ja: '{n}席がお連れ様のために確保されています。' },
  heldMany: { en: '{n} are held for your party.', ko: '{n}석이 일행을 위해 확보되어 있습니다.', ja: '{n}席がお連れ様のために確保されています。' },
  reservedOne: { en: '1 is reserved for you.', ko: '{n}석이 예약되었습니다.', ja: '{n}席がご予約済みです。' },
  reservedMany: { en: '{n} are reserved for you.', ko: '{n}석이 예약되었습니다.', ja: '{n}席がご予約済みです。' },
  tooFew: { en: 'Too few for a party of {n}.', ko: '{n}명 일행이 앉기에는 좌석이 부족합니다.', ja: '{n}名では空席が足りません。' },
  enough: { en: 'Enough for your party.', ko: '일행이 앉을 수 있습니다.', ja: 'お連れ様の人数分あります。' },
  marks: { en: '{free} of {total} seats free', ko: '{total}석 중 {free}석 비어 있음', ja: '{total}席中{free}席が空席' },
  marksHeld: {
    en: '{free} of {total} seats free, {n} held for your party',
    ko: '{total}석 중 {free}석 비어 있음, 일행을 위해 {n}석 확보',
    ja: '{total}席中{free}席が空席、お連れ様のために{n}席を確保',
  },
  legendTaken: { en: 'taken', ko: '예약됨', ja: '予約済み' },
  legendFree: { en: 'free', ko: '비어 있음', ja: '空席' },
  legendHeld: { en: 'held for your party', ko: '일행을 위해 확보', ja: 'お連れ様のために確保' },
  party: { en: 'Party size', ko: '인원', ja: '人数' },
  less: { en: 'One guest fewer', ko: '한 명 줄이기', ja: '一名減らす' },
  more: { en: 'One guest more', ko: '한 명 늘리기', ja: '一名増やす' },
  guestsOne: { en: '1 guest', ko: '{n}명', ja: '{n}名' },
  guestsMany: { en: '{n} guests', ko: '{n}명', ja: '{n}名' },
  capParty: {
    en: 'One reservation is for up to {n} guests.',
    ko: '한 번에 최대 {n}명까지 예약할 수 있습니다.',
    ja: '一度にご予約いただけるのは最大{n}名までです。',
  },
  capSeatsOne: { en: 'Only 1 seat is free at {time}.', ko: '{time}에는 1석만 비어 있습니다.', ja: '{time}は空席が1席のみです。' },
  capSeatsMany: {
    en: 'Only {n} seats are free at {time}.',
    ko: '{time}에는 {n}석만 비어 있습니다.',
    ja: '{time}は空席が{n}席のみです。',
  },
  locked: {
    en: 'These seats are reserved. To change them, use the button under your confirmation.',
    ko: '이 좌석은 예약되어 있습니다. 변경하려면 예약 확인 아래의 버튼을 이용해 주세요.',
    ja: 'この席はご予約済みです。変更される場合は、予約確認の下のボタンをご利用ください。',
  },
  sumOne: { en: '1 seat at {time}', ko: '{time} 회차 1석', ja: '{time}の回 1席' },
  sumMany: { en: '{n} seats at {time}', ko: '{time} 회차 {n}석', ja: '{time}の回 {n}席' },
} satisfies Record<string, Tri>;

// {name} and {email} are what the guest typed. {date} is HERO.date, {ends} the end of the seating.
const RESERVE = {
  title: { en: 'Reserve the seats', ko: '좌석 예약', ja: '席の予約' },
  note: {
    en: 'We hold the seats under your name and send a confirmation by email. You pay at the counter after the meal.',
    ko: '고객님 성함으로 좌석을 잡아 두고 확인 메일을 보내 드립니다. 결제는 식사 후 카운터에서 하시면 됩니다.',
    ja: 'お名前で席を確保し、確認メールをお送りします。お支払いは食事の後、カウンターでお願いします。',
  },
  name: { en: 'Name', ko: '이름', ja: 'お名前' },
  email: { en: 'Email', ko: '이메일', ja: 'メールアドレス' },
  nameError: {
    en: 'Enter the name for the reservation.',
    ko: '예약자 이름을 입력해 주세요.',
    ja: 'ご予約のお名前を入力してください。',
  },
  emailError: {
    en: 'Enter an email address, like name@example.com.',
    ko: 'name@example.com 형식의 이메일 주소를 입력해 주세요.',
    ja: 'name@example.com のような形式でメールアドレスを入力してください。',
  },
  submitOne: { en: 'Reserve 1 seat at {time}', ko: '{time} 회차 1석 예약하기', ja: '{time}の回で1席を予約する' },
  submitMany: { en: 'Reserve {n} seats at {time}', ko: '{time} 회차 {n}석 예약하기', ja: '{time}の回で{n}席を予約する' },
  doneTitle: {
    en: 'Your seats are reserved, {name}.',
    ko: '{name}님, 좌석 예약이 완료되었습니다.',
    ja: '{name}様、お席のご予約が確定しました。',
  },
  doneSeating: { en: 'Seating', ko: '회차', ja: '回' },
  doneSeatingValue: {
    en: '{time} on {date}, until about {ends}',
    ko: '{date} {time}, 약 {ends}까지',
    ja: '{date} {time}、約{ends}まで',
  },
  doneParty: { en: 'Party', ko: '인원', ja: '人数' },
  doneTotal: { en: 'Total', ko: '합계', ja: '合計' },
  doneTotalValue: { en: '{total}, paid at the counter', ko: '{total}, 카운터에서 결제', ja: '{total}、カウンターでお支払い' },
  doneMail: {
    en: 'A confirmation is on its way to {email}.',
    ko: '확인 메일을 {email} 주소로 발송했습니다.',
    ja: '{email}宛に確認メールを送信しました。',
  },
  change: { en: 'Change this reservation', ko: '예약 변경하기', ja: '予約を変更する' },
} satisfies Record<string, Tri>;

const NOTES = {
  title: { en: 'House notes', ko: '가게 안내', ja: '店からのご案内' },
  rows: [
    {
      term: { en: 'Allergies', ko: '알레르기', ja: 'アレルギー' },
      body: {
        en: 'Reply to your confirmation with any allergy. We can leave out shellfish, nuts and gluten. Fish and dashi run through the whole course, so we cannot cook without them.',
        ko: '알레르기가 있으면 예약 확인 메일에 답장해 주세요. 갑각류, 견과류, 글루텐은 빼 드릴 수 있습니다. 생선과 다시는 코스 전체에 쓰이므로 이것 없이는 조리할 수 없습니다.',
        ja: 'アレルギーがある場合は、予約確認メールにご返信ください。甲殻類、ナッツ、グルテンは抜くことができます。魚とだしはコース全体に使われるため、これなしでは調理できません。',
      },
    },
    {
      term: { en: 'Corkage', ko: '콜키지', ja: '持ち込み料' },
      body: {
        en: '$40 a bottle, one bottle for every two guests. Sake and wine are poured by the glass from $14.',
        ko: '병당 $40, 두 명당 한 병까지 가능합니다. 사케와 와인은 잔당 $14부터 제공합니다.',
        ja: '一本につき$40、二名様につき一本まで。日本酒とワインはグラス$14からお注ぎします。',
      },
    },
    {
      term: { en: 'Cancellation', ko: '취소', ja: 'キャンセル' },
      body: {
        en: 'Free up to 48 hours before your seating. After that we ask for the full course price, because the fish is bought for your seat that morning.',
        ko: '회차 48시간 전까지는 무료로 취소할 수 있습니다. 그 이후에는 코스 전체 금액을 받습니다. 고객님의 좌석을 위해 그날 아침 생선을 미리 구매하기 때문입니다.',
        ja: 'お席の回の48時間前まで無料でキャンセルできます。それ以降は、お席のためにその朝魚を仕入れているため、コース料金全額をいただきます。',
      },
    },
  ] satisfies Array<{ term: Tri; body: Tri }>,
};

const FIND = {
  title: { en: 'Find us', ko: '오시는 길', ja: 'アクセス' },
  rows: [
    {
      term: { en: 'Address', ko: '주소', ja: '住所' },
      body: {
        en: '27 Mercer Row, lower level. The door is to the left of the bookshop. Ring the bell.',
        ko: '27 Mercer Row, 지하 1층. 서점 왼쪽에 있는 문입니다. 벨을 눌러 주세요.',
        ja: '27 Mercer Row、地下一階。書店の左隣の扉です。ベルを押してください。',
      },
    },
    {
      term: { en: 'Hours', ko: '영업시간', ja: '営業時間' },
      body: {
        en: 'Tuesday to Saturday, with seatings at 18:00 and 20:30. Closed Sunday and Monday.',
        ko: '화요일부터 토요일까지, 18:00과 20:30 두 회차로 운영합니다. 일요일과 월요일은 휴무입니다.',
        ja: '火曜日から土曜日まで、18:00と20:30の二回入れ替え制です。日曜・月曜は定休日です。',
      },
    },
    {
      term: { en: 'Arriving', ko: '가는 길', ja: '道順' },
      body: {
        en: 'Six minutes on foot from Harrow Street station, exit 3. There is no parking on Mercer Row. The door opens fifteen minutes before each seating.',
        ko: 'Harrow Street역 3번 출구에서 도보 6분입니다. Mercer Row에는 주차 공간이 없습니다. 문은 회차 15분 전에 엽니다.',
        ja: 'Harrow Street駅3番出口から徒歩6分です。Mercer Rowには駐車場がありません。扉は各回の15分前に開きます。',
      },
    },
  ] satisfies Array<{ term: Tri; body: Tri }>,
};

const PROMPT_EN = `Design one real page in Bento × Noir fusion: a near-black page whose main content sits in one lacquer tray, with compartments divided by thin gold lines.

Pick a believable subject that is naturally a set of unequal parts served in a fixed order, such as a counter restaurant's set course, a tasting flight or one evening's programme, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Kuro, a counter restaurant with eight seats, one set course and two seatings a night.

TOKENS:
--bg: #0c0c10
--lacquer: #0e0a08 (the inside of the tray, the form fields)
--rim: #1c1510 (the tray's rim and any opaque menu surface)
--ink: #ece8e1
--soft: #d2ccc3
--muted: #a39c92
--line: rgba(236,232,225,0.27)
--gold: #c9a96e
--copper: #c47a52

COLOUR:
- Gold draws the tray's lines and the frame of the stepper, and colours two figures: the price per person and the total. Nothing else is gold.
- Copper marks what belongs to the guest: the chosen seating, the seats held for the party, a pressed stepper button, a field error. It also warms the top right corner of the page, the largest compartment and the shadow under the tray as a low glow.
- Text is off-white on near-black. Muted text keeps at least 4.5:1.

THE TRAY:
- One object: a 1px gold outline with a 5px radius, a 9px rim in --rim, then an inner 1px gold frame.
- The compartments are one ordered list on a 24-column grid with a 1px gap. The gold beneath the gap is the divider. Never separate boxes.
- Seven compartments sized by the weight of the dish: three across the top, one large main dish, two stacked beside it, one wide strip for the dessert.
- Each compartment holds the course number, the dish name, its ingredients and one note from the kitchen. The numbers are there because the order is real.
- The reading order 1 to 7 holds in the DOM and at every width: six columns on tablets, one column on phones with the first two dishes side by side.

TYPOGRAPHY:
Two families: Shippori Mincho for the name, dish names, times, figures and headings, and Hanken Grotesk for running text, labels and controls.
H1, the name: Shippori Mincho 600, clamp(4.5rem, 10.5vw, 8rem), line-height 1, letter-spacing 0.03em.
H2: Shippori Mincho 600, clamp(1.875rem, 3.3vw, 2.5rem), line-height 1.25, letter-spacing 0.02em.
Dish names: Shippori Mincho 600 at 1.375rem, 1.6875rem or clamp(2.25rem, 3.5vw, 2.875rem), by the size of the compartment. Seating times at 2.625rem with tabular figures.
Body: Hanken Grotesk 400 at 1.0625rem with line-height 1.6, labels and buttons at 500. No text under 1rem. No all-caps tracked labels.

COMPONENTS:
- Seatings: a radio group of two ruled rows. Each row has a square radio, the time, when it ends, eight round seat marks on a counter line (filled is taken, outlined is free, copper is held for the party) and the count in words. A seating that cannot fit the party is disabled and says why.
- Party size: a stepper drawn like the tray, three compartments in one gold frame. Its limits are 1, 4 and the free seats of the chosen seating, and the limit is written next to it. The total updates with it.
- Reservation: name and email in square fields with labels above and errors under the field, and one solid rectangular button that names the seats and the seating. A valid submit replaces the form with a confirmation that lists the seating, the party and the total, and focus moves to it.
- House notes and directions: definition rows on 1px lines with the term in the mincho.
- Buttons are rectangles with a 1px line and no radius. The in-page navigation is plain words.

LAYOUT:
- Hero: the name and the one-line offer on the left, tonight's date, the price and one action on the right, a short in-page navigation above them.
- Then the tray, the seatings with the party size and the total, the reservation form, the house notes, the directions and one footer line.
- A 12-column grid in a 1120px column. Sections stand 104px apart, 80px on phones.

MOTION:
- A 160ms colour change on hover and nothing else. prefers-reduced-motion removes it.

FORBIDDEN:
- A grid of separate rounded cards, one card per dish, cells that light up on hover
- Gold text blocks, gold buttons, gold gradients, gold on more than two figures
- Pill buttons, chips, badges, a small label above a heading, all-caps tracked labels
- Arrows on links, middle-dot meta strings, issue numbers, stamps, marquees
- A palette switcher, photographs of food, drawn illustrations, emoji
- Numbers on anything that is not a real sequence

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML and CSS: an ordered list for the course, a radio group, a labelled form
3) A working seating choice, stepper, total and form with its error and success states
4) Responsive layout down to 320px with no horizontal scroll
5) Visible focus, a text alternative for the seat marks, reduced-motion support`;

const PROMPT_KO = `Bento × Noir 퓨전으로 실제 페이지 하나를 디자인한다. 거의 검은 페이지이며, 주요 내용은 옻칠 쟁반 하나에 담기고 칸들은 얇은 금색 선으로 나뉜다.

자연스럽게 고정된 순서로 나오는 크기가 다른 부분들로 이루어진 그럴듯한 주제를 고른다. 예를 들어 카운터 레스토랑의 정식 코스, 테이스팅 플라이트, 하룻밤의 프로그램 같은 것이다. 실제 내용을 쓴다. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체에 관한 페이지로 읽혀서는 안 된다. 여기서는 좌석 8석, 정식 코스 하나, 하룻밤 두 회차를 운영하는 카운터 레스토랑 Kuro다.

TOKENS:
--bg: #0c0c10
--lacquer: #0e0a08 (쟁반 안쪽, 폼 입력란)
--rim: #1c1510 (쟁반 테두리와 불투명한 메뉴 표면)
--ink: #ece8e1
--soft: #d2ccc3
--muted: #a39c92
--line: rgba(236,232,225,0.27)
--gold: #c9a96e
--copper: #c47a52

COLOUR:
- 금색은 쟁반의 선과 수량 조절기의 테두리를 그리며, 두 숫자인 1인당 가격과 합계에 쓴다. 그 밖에는 금색을 쓰지 않는다.
- 구리색은 손님의 몫을 표시한다: 선택한 회차, 일행을 위해 확보한 좌석, 눌린 수량 조절 버튼, 입력란 오류. 또한 페이지 오른쪽 위 모서리, 가장 큰 칸, 쟁반 아래 그림자에 낮은 빛으로 온기를 더한다.
- 텍스트는 거의 검은 바탕 위의 오프화이트다. 보조 텍스트는 명암비 4.5:1 이상을 유지한다.

THE TRAY:
- 하나의 오브젝트로 만든다: 반지름 5px의 1px 금색 외곽선, --rim 색의 9px 테두리, 그 안쪽의 1px 금색 틀.
- 칸들은 24열 격자 위의 순서 있는 목록 하나이며 간격은 1px이다. 간격 아래의 금색이 구분선이 된다. 칸을 따로 떨어진 상자로 만들지 않는다.
- 일곱 칸의 크기는 요리의 무게로 정한다: 위쪽 세 칸, 큰 메인 요리 한 칸, 그 옆에 쌓은 두 칸, 디저트를 위한 가로로 긴 띠 한 칸.
- 각 칸에는 코스 번호, 요리 이름, 재료, 주방에서 전하는 메모 한 줄을 담는다. 번호는 실제 순서가 있기 때문에 넣는다.
- 1부터 7까지의 읽기 순서는 DOM에서도, 모든 너비에서도 유지한다: 태블릿에서는 여섯 열, 휴대폰에서는 한 열이며 첫 두 요리는 나란히 놓는다.

TYPOGRAPHY:
두 서체 계열을 쓴다: 이름, 요리 이름, 시각, 숫자와 제목에는 Shippori Mincho, 본문, 라벨과 컨트롤에는 Hanken Grotesk.
H1, 이름: Shippori Mincho 600, clamp(4.5rem, 10.5vw, 8rem), line-height 1, letter-spacing 0.03em.
H2: Shippori Mincho 600, clamp(1.875rem, 3.3vw, 2.5rem), line-height 1.25, letter-spacing 0.02em.
요리 이름: Shippori Mincho 600, 칸의 크기에 따라 1.375rem, 1.6875rem 또는 clamp(2.25rem, 3.5vw, 2.875rem). 회차 시각은 2.625rem, 고정폭 숫자(tabular figures).
본문: Hanken Grotesk 400, 1.0625rem, line-height 1.6. 라벨과 버튼은 500. 1rem 미만 글자 금지. 자간을 넓힌 전체 대문자 라벨 금지.

COMPONENTS:
- 회차: 선으로 구분된 두 행의 라디오 그룹. 각 행에는 정사각형 라디오, 시각, 끝나는 시각, 카운터 선 위의 둥근 좌석 표시 여덟 개(채운 표시는 예약됨, 테두리만은 비어 있음, 구리색은 일행을 위해 확보), 그리고 글로 쓴 잔여 좌석 수가 있다. 일행이 들어갈 수 없는 회차는 비활성화하고 그 이유를 밝힌다.
- 인원: 쟁반과 같은 방식으로 그린 수량 조절기. 금색 틀 하나 안에 칸 세 개. 제한은 1, 4, 선택한 회차의 빈 좌석 수이며, 제한 값을 옆에 적는다. 합계도 이에 맞춰 갱신된다.
- 예약: 이름과 이메일은 정사각형 입력란에, 라벨은 위에, 오류는 입력란 아래에 둔다. 좌석과 회차를 명시하는 단색 직사각형 버튼 하나. 유효하게 제출하면 양식을 회차, 인원, 합계를 나열한 확인 화면으로 바꾸고 포커스를 그쪽으로 옮긴다.
- 가게 안내와 오시는 길: 1px 선으로 구분한 정의 행, 용어는 명조체.
- 버튼은 1px 선이 있고 모서리가 없는 직사각형이다. 페이지 내 탐색은 평이한 단어를 쓴다.

LAYOUT:
- 히어로: 왼쪽에 이름과 한 줄 소개, 오른쪽에 오늘의 날짜, 가격, 버튼 하나. 그 위에 짧은 페이지 내 탐색.
- 이어서 쟁반, 인원과 합계가 있는 회차, 예약 양식, 가게 안내, 오시는 길, 마지막 줄 바닥글.
- 1120px 열 안의 12열 격자. 섹션 간격은 104px, 휴대폰에서는 80px.

MOTION:
- 호버 시 160ms 색 변화만 둔다. 그 밖의 움직임은 없다. prefers-reduced-motion에서는 이것도 제거한다.

FORBIDDEN:
- 요리마다 둥근 카드를 하나씩 나열한 격자, 호버하면 켜지는 셀 금지
- 금색 텍스트 블록, 금색 버튼, 금색 그라데이션, 숫자 두 개를 넘는 금색 사용 금지
- 알약형 버튼, 칩, 배지, 제목 위의 작은 라벨, 자간을 넓힌 전체 대문자 라벨 금지
- 링크의 화살표, 가운뎃점으로 이은 메타 문자열, 호수 표기, 스탬프, 마키 금지
- 팔레트 전환기, 음식 사진, 그린 일러스트, 이모지 금지
- 실제 순서가 아닌 대상에 붙이는 번호 금지

OUTPUT:
1) 위 토큰을 담은 CSS 커스텀 속성
2) 시맨틱 HTML과 CSS: 코스용 순서 목록, 라디오 그룹, 라벨이 있는 양식
3) 동작하는 회차 선택, 수량 조절기, 합계, 오류와 완료 상태가 있는 양식
4) 가로 스크롤 없이 320px까지 대응하는 반응형 레이아웃
5) 보이는 포커스, 좌석 표시의 대체 텍스트, reduced-motion 지원`;

const PROMPT_JA = `Bento × Noir フュージョンで実際のページを一つデザインする。ほぼ黒のページで、主要な内容は一つの漆の箱に収まり、仕切りは細い金線で区切られる。

自然に不均等な部分が決まった順序で供される、もっともらしい題材を選び、その実際の内容を書く。カウンター割烹のおまかせコース、テイスティングのフライト、一晩のプログラムなどが例になる。ページはその題材のページとして読まれなければならず、スタイルについてのページとして読まれてはならない。ここでは、八席、おまかせコース一種、一晩二回入れ替えのカウンター割烹「Kuro」とする。

TOKENS:
--bg: #0c0c10
--lacquer: #0e0a08（箱の内側、フォーム入力欄）
--rim: #1c1510（箱の縁と不透明なメニュー面）
--ink: #ece8e1
--soft: #d2ccc3
--muted: #a39c92
--line: rgba(236,232,225,0.27)
--gold: #c9a96e
--copper: #c47a52

COLOUR:
- 金は箱の線と数量ステッパーの枠を描き、二つの数字、一人あたりの価格と合計に使う。それ以外に金は使わない。
- 銅色はゲストのものを示す：選んだ回、一行のために確保した席、押された数量ボタン、入力欄のエラー。ページ右上の角、最も大きな仕切り、箱の下の影にも、弱い光として温かみを加える。
- テキストはほぼ黒の上のオフホワイトにする。補助テキストは4.5:1以上のコントラストを保つ。

THE TRAY:
- 一つの物体として作る：半径5px、1pxの金の輪郭、--rim 色の9pxの縁、その内側の1pxの金の枠。
- 仕切りは24列グリッド上の順序付きリスト一つで、間隔は1px。間隔の下の金が仕切り線になる。独立した箱にはしない。
- 七つの仕切りは料理の重さで大きさを決める：上に三つ、大きなメイン料理一つ、その横に重ねた二つ、デザート用の横長の帯一つ。
- 各仕切りには、コース番号、料理名、材料、厨房からのメモ一つを入れる。番号は順序が実際にあるから付ける。
- 1から7までの読み順は、DOMでもすべての幅でも保つ：タブレットでは六列、スマートフォンでは一列にし、最初の二品は並べる。

TYPOGRAPHY:
二つの書体系を使う：名前、料理名、時刻、数字、見出しには Shippori Mincho、本文、ラベル、コントロールには Hanken Grotesk。
H1、名前：Shippori Mincho 600、clamp(4.5rem, 10.5vw, 8rem)、line-height 1、letter-spacing 0.03em。
H2：Shippori Mincho 600、clamp(1.875rem, 3.3vw, 2.5rem)、line-height 1.25、letter-spacing 0.02em。
料理名：Shippori Mincho 600、仕切りの大きさに応じて 1.375rem、1.6875rem または clamp(2.25rem, 3.5vw, 2.875rem)。回の時刻は 2.625rem、等幅数字。
本文：Hanken Grotesk 400、1.0625rem、line-height 1.6。ラベルとボタンは 500。1rem未満の文字は禁止。字間を広げた全大文字のラベルは禁止。

COMPONENTS:
- 回：罫線で区切られた二行のラジオグループ。各行には、正方形のラジオ、時刻、終了時刻、カウンター線の上の丸い席マーク八つ（塗りは予約済み、枠のみは空席、銅色はお連れ様のために確保）、そして席数を言葉で示す表示がある。人数が入らない回は無効にし、その理由を示す。
- 人数：箱と同じように描いたステッパー。一つの金の枠の中に仕切り三つ。上限は 1、4、選んだ回の空席数で、上限の値を横に書く。合計はそれに合わせて更新する。
- 予約：名前とメールは正方形の入力欄にし、ラベルは上、エラーは欄の下に置く。席と回を明示する、単色の長方形ボタン一つ。有効な送信では、フォームを回、人数、合計を並べた確認画面に置き換え、フォーカスをそこへ移す。
- 店からのご案内とアクセス：1pxの線で区切った定義行。用語は明朝体。
- ボタンは1pxの線を持つ角のない長方形。ページ内ナビゲーションは平易な言葉のみを使う。

LAYOUT:
- ヒーロー：左に名前と一行の案内、右に本日の日付、価格、ボタン一つ。その上に短いページ内ナビゲーション。
- 続いて箱、人数と合計のある回、予約フォーム、店からのご案内、アクセス、最後に一行のフッター。
- 幅1120pxの欄内の12列グリッド。セクションの間隔は104px、スマートフォンでは80px。

MOTION:
- ホバー時の160msの色変化のみ。それ以外の動きはない。prefers-reduced-motion では色変化も削除する。

FORBIDDEN:
- 料理ごとに別々の丸い角のカードを並べたグリッド、ホバーで点灯するセル 禁止
- 金の文字ブロック、金のボタン、金のグラデーション、数字三つを超える金の使用 禁止
- 丸いボタン、チップ、バッジ、見出し上の小さなラベル、字間を広げた全大文字のラベル 禁止
- リンクの矢印、中黒で区切るメタ文字列、号数、スタンプ、マーキー 禁止
- 配色切り替え、料理の写真、描き起こしのイラスト、絵文字 禁止
- 実際の順序ではないものに付ける番号 禁止

OUTPUT:
1) 上記トークンの CSS カスタムプロパティ
2) セマンティックな HTML と CSS：コースの順序付きリスト、ラジオグループ、ラベル付きフォーム
3) 動作する回の選択、ステッパー、合計、エラーと完了の状態を持つフォーム
4) 横スクロールなしで 320px まで対応するレスポンシブレイアウト
5) 見えるフォーカス、席マークの代替テキスト、reduced-motion 対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const money = (amount: number) => `$${amount}`;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

export function PortedFusionBentoNoirPage({ lang }: PortedStylePageProps) {
  const [seatingId, setSeatingId] = useState('late');
  const [party, setParty] = useState(2);
  const [guest, setGuest] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({ name: false, email: false });
  const [booked, setBooked] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const wasBooked = useRef(false);

  const t = (text: Tri) => text[lang];
  // Picks the singular or the plural text by {n}.
  const count = (one: Tri, many: Tri, n: number, values: Record<string, string | number> = {}) => fill(t(n === 1 ? one : many), { n, ...values });

  const seating = SEATINGS.find((item) => item.id === seatingId) ?? SEATINGS[0];
  const free = SEATS - seating.taken;
  // The party can never be larger than the chosen seating can take, so the chosen seating always fits.
  const maxParty = Math.min(MAX_PARTY, free);
  const total = money(party * PRICE);
  const guests = count(BOOKING.guestsOne, BOOKING.guestsMany, party);
  const limit = booked
    ? t(BOOKING.locked)
    : free < MAX_PARTY
      ? count(BOOKING.capSeatsOne, BOOKING.capSeatsMany, free, { time: seating.time })
      : fill(t(BOOKING.capParty), { n: MAX_PARTY });

  // The form and the confirmation replace each other, and the control that had
  // focus leaves the page with them. Focus goes to what took its place.
  useEffect(() => {
    if (booked) doneRef.current?.focus();
    else if (wasBooked.current) nameRef.current?.focus();
    wasBooked.current = booked;
  }, [booked]);

  const step = (delta: number) => {
    if (booked) return;
    setParty((value) => Math.min(maxParty, Math.max(1, value + delta)));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = { name: guest.name.trim() === '', email: !EMAIL_PATTERN.test(guest.email.trim()) };
    if (!next.name && !next.email) {
      setErrors(next);
      setBooked(true);
      return;
    }
    // The error text sits under its field and can land below the fold or under the
    // fixed page bar. It is rendered first, so the whole field can be brought into view.
    flushSync(() => setErrors(next));
    const field = next.name ? nameRef.current : emailRef.current;
    field?.focus();
    field?.parentElement?.scrollIntoView({ block: 'nearest' });
  };

  return (
    <FusionShell
      fusionId="fusion-bento-noir"
      lang={lang}
      tone="dark"
      accent="#c47a52"
      prev={{ href: '/pages/fusion-product-swiss.html', label: 'Product × Swiss' }}
      next={{ href: '/pages/fusion-editorial-terminal.html', label: 'Editorial × Terminal' }}
      prompts={PROMPTS}
    >
      <div className="bn">
        <header className="bn-hero">
          <nav className="bn-hero__nav" aria-label={t(HERO.nav)}>
            <a href="#bn-course">{t(HERO.navCourse)}</a>
            <a href="#bn-seats">{t(HERO.navSeats)}</a>
            <a href="#bn-notes">{t(HERO.navNotes)}</a>
            <a href="#bn-find">{t(HERO.navFind)}</a>
          </nav>
          <div className="bn-hero__name">
            <h1>{NAME}</h1>
            <p className="bn-hero__offer">{t(HERO.offer)}</p>
          </div>
          <div className="bn-tonight">
            <p className="bn-tonight__date">{t(HERO.date)}</p>
            <p className="bn-tonight__price"><b>{money(PRICE)}</b> {t(HERO.priceNote)}</p>
            <a className="bn-btn" href="#bn-seats">{t(HERO.action)}</a>
          </div>
        </header>

        <section className="bn-section" aria-labelledby="bn-course">
          <h2 id="bn-course">{t(COURSE.title)}</h2>
          <p className="bn-section__note">{t(COURSE.note)}</p>
          <div className="bn-tray">
            {/* The list role is restated because list-style: none removes it in Safari. */}
            <ol role="list">
              {COURSE.dishes.map((dish, index) => (
                <li key={dish.name.en} className={`bn-dish bn-dish--${dish.size} bn-dish--${index + 1}`}>
                  <span className="bn-dish__no" aria-hidden="true">{index + 1}</span>
                  <div className="bn-dish__body">
                    <h3>{t(dish.name)}</h3>
                    <p className="bn-dish__of">{t(dish.of)}</p>
                    <p className="bn-dish__note">{t(dish.note)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bn-section" aria-labelledby="bn-seats">
          <h2 id="bn-seats">{t(BOOKING.title)}</h2>
          <p className="bn-section__note">{t(BOOKING.note)}</p>
          <div className="bn-seatings" role="radiogroup" aria-label={t(BOOKING.group)}>
            {SEATINGS.map((item) => {
              const itemFree = SEATS - item.taken;
              const selected = item.id === seating.id;
              const short = party > itemFree;
              const held = selected ? party : 0;
              const state = short
                ? fill(t(BOOKING.tooFew), { n: party })
                : selected
                  ? booked
                    ? count(BOOKING.reservedOne, BOOKING.reservedMany, party)
                    : count(BOOKING.heldOne, BOOKING.heldMany, party)
                  : booked
                    ? ''
                    : t(BOOKING.enough);
              return (
                <label key={item.id} className={`bn-seating${short ? ' is-short' : ''}${short || booked ? ' is-off' : ''}`}>
                  <input
                    type="radio"
                    name="bn-seating"
                    value={item.id}
                    checked={selected}
                    disabled={short || booked}
                    aria-labelledby={`bn-time-${item.id} bn-ends-${item.id}`}
                    aria-describedby={`bn-left-${item.id}`}
                    onChange={() => setSeatingId(item.id)}
                  />
                  <span className="bn-seating__time" id={`bn-time-${item.id}`}>{item.time}</span>
                  <span className="bn-seating__ends" id={`bn-ends-${item.id}`}>{fill(t(BOOKING.ends), { time: item.ends })}</span>
                  <span
                    className="bn-marks"
                    role="img"
                    aria-label={fill(t(held ? BOOKING.marksHeld : BOOKING.marks), { free: itemFree, total: SEATS, n: held })}
                  >
                    {Array.from({ length: SEATS }, (_, seat) => (
                      <i key={seat} className={seat < item.taken ? 'is-taken' : seat < item.taken + held ? 'is-held' : undefined} />
                    ))}
                  </span>
                  <span className="bn-seating__left" id={`bn-left-${item.id}`}>
                    <b>{count(BOOKING.leftOne, BOOKING.leftMany, itemFree)}</b> {state}
                  </span>
                </label>
              );
            })}
          </div>
          <p className="bn-legend" aria-hidden="true">
            <span><i className="is-taken" />{t(BOOKING.legendTaken)}</span>
            <span><i />{t(BOOKING.legendFree)}</span>
            <span><i className="is-held" />{t(BOOKING.legendHeld)}</span>
          </p>

          <div className="bn-party">
            <div className="bn-party__size">
              <span className="bn-party__label" id="bn-party-label">{t(BOOKING.party)}</span>
              {/* The buttons stay focusable at a limit, so focus is not lost when one is reached. */}
              <span className="bn-stepper" role="group" aria-labelledby="bn-party-label" aria-describedby="bn-party-limit">
                <button type="button" aria-label={t(BOOKING.less)} aria-disabled={booked || party <= 1} onClick={() => step(-1)}>&minus;</button>
                <output>
                  <span aria-hidden="true">{party}</span>
                  <span className="bn-sr">{guests}, {total}</span>
                </output>
                <button type="button" aria-label={t(BOOKING.more)} aria-disabled={booked || party >= maxParty} onClick={() => step(1)}>+</button>
              </span>
            </div>
            <p className="bn-party__limit" id="bn-party-limit">{limit}</p>
            <p className="bn-sum">
              <span>{count(BOOKING.sumOne, BOOKING.sumMany, party, { time: seating.time })}</span>
              <b>{total}</b>
            </p>
          </div>
        </section>

        <section className="bn-section" aria-labelledby="bn-reserve">
          <h2 id="bn-reserve">{t(RESERVE.title)}</h2>
          <p className="bn-section__note">{t(RESERVE.note)}</p>
          {booked ? (
            <div className="bn-done" ref={doneRef} tabIndex={-1} role="group" aria-labelledby="bn-done-title">
              <h3 id="bn-done-title">{fill(t(RESERVE.doneTitle), { name: guest.name.trim() })}</h3>
              <dl className="bn-rows">
                <div>
                  <dt>{t(RESERVE.doneSeating)}</dt>
                  <dd>{fill(t(RESERVE.doneSeatingValue), { time: seating.time, date: t(HERO.date), ends: seating.ends })}</dd>
                </div>
                <div>
                  <dt>{t(RESERVE.doneParty)}</dt>
                  <dd>{guests}</dd>
                </div>
                <div>
                  <dt>{t(RESERVE.doneTotal)}</dt>
                  <dd>{fill(t(RESERVE.doneTotalValue), { total })}</dd>
                </div>
              </dl>
              <p className="bn-done__mail">{fill(t(RESERVE.doneMail), { email: guest.email.trim() })}</p>
              <button type="button" className="bn-btn" onClick={() => setBooked(false)}>{t(RESERVE.change)}</button>
            </div>
          ) : (
            <form className="bn-form" noValidate onSubmit={handleSubmit}>
              <div className={`bn-field${errors.name ? ' is-invalid' : ''}`}>
                <label htmlFor="bn-name">{t(RESERVE.name)}</label>
                <input
                  id="bn-name"
                  ref={nameRef}
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={guest.name}
                  aria-invalid={errors.name}
                  aria-describedby={errors.name ? 'bn-name-error' : undefined}
                  onChange={(event) => {
                    setGuest({ ...guest, name: event.target.value });
                    if (errors.name) setErrors({ ...errors, name: false });
                  }}
                />
                {errors.name ? <p className="bn-field__error" id="bn-name-error" role="alert">{t(RESERVE.nameError)}</p> : null}
              </div>
              <div className={`bn-field${errors.email ? ' is-invalid' : ''}`}>
                <label htmlFor="bn-email">{t(RESERVE.email)}</label>
                <input
                  id="bn-email"
                  ref={emailRef}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={guest.email}
                  aria-invalid={errors.email}
                  aria-describedby={errors.email ? 'bn-email-error' : undefined}
                  onChange={(event) => {
                    setGuest({ ...guest, email: event.target.value });
                    if (errors.email) setErrors({ ...errors, email: false });
                  }}
                />
                {errors.email ? <p className="bn-field__error" id="bn-email-error" role="alert">{t(RESERVE.emailError)}</p> : null}
              </div>
              <button className="bn-btn bn-btn--solid" type="submit">
                {count(RESERVE.submitOne, RESERVE.submitMany, party, { time: seating.time })}
              </button>
            </form>
          )}
        </section>

        <section className="bn-section" aria-labelledby="bn-notes">
          <h2 id="bn-notes">{t(NOTES.title)}</h2>
          <dl className="bn-rows">
            {NOTES.rows.map((row) => (
              <div key={row.term.en}>
                <dt>{t(row.term)}</dt>
                <dd>{t(row.body)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="bn-section" aria-labelledby="bn-find">
          <h2 id="bn-find">{t(FIND.title)}</h2>
          <dl className="bn-rows">
            {FIND.rows.map((row) => (
              <div key={row.term.en}>
                <dt>{t(row.term)}</dt>
                <dd>{t(row.body)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="bn-footer">© 2026 {NAME}</footer>
      </div>
    </FusionShell>
  );
}
