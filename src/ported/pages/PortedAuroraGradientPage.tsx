import { Fragment, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedAuroraGradientPage.css';

// The night page of an aurora tour operator in Tromsø, set like a printed timetable.
// Literata, a screen serif with an optical-size axis, carries the headlines and every
// figure; Public Sans carries the reading text. The aurora glows in one place only,
// behind tonight's forecast. Elsewhere one flat green marks what the visitor has chosen.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const OPERATOR = 'Polar Night Chase';

const BAR = {
  nav: { en: 'On this page', ko: '페이지 내 메뉴', ja: 'ページ内メニュー' },
  tonight: { en: 'Tonight', ko: '오늘 밤', ja: '今夜' },
  tours: { en: 'Tours', ko: '투어', ja: 'ツアー' },
  wear: { en: 'What to wear', ko: '복장', ja: '服装' },
  nights: { en: 'Next nights', ko: '다음 밤', ja: '次の夜' },
  where: { en: 'in Tromsø', ko: 'Tromsø 현지', ja: 'Tromsø現地' },
} satisfies Record<string, Tri>;

const NOW = '16:42';
const NOW_TEMP = '−6 °C';

const HERO = {
  title: { en: 'Clear skies from 22:40 tonight.', ko: '오늘 밤 22:40부터 하늘이 맑습니다.', ja: '今夜22:40から空が晴れます。' },
  weekday: { en: 'Friday', ko: '금요일', ja: '金曜日' },
  date: { en: '20 November', ko: '11월 20일', ja: '11月20日' },
  dark: {
    en: 'Dark from 16:10. Forecast updated at 16:30.',
    ko: '16:10부터 어둡습니다. 예보는 16:30에 갱신되었습니다.',
    ja: '16:10から暗くなります。予報は16:30に更新されました。',
  },
  link: { en: "See tonight's tours", ko: '오늘 밤 투어 보기', ja: '今夜のツアーを見る' },
} satisfies Record<string, Tri>;

const CHART = {
  label: {
    en: 'Kp index and cloud cover over Tromsø tonight, hour by hour',
    ko: '오늘 밤 Tromsø 상공의 시간별 Kp 지수와 구름량',
    ja: '今夜のTromsø上空の時間ごとのKp指数と雲量',
  },
  window: { en: 'Best window', ko: '최적 시간대', ja: '最適な時間帯' },
  kpIndex: { en: 'Kp index', ko: 'Kp 지수', ja: 'Kp指数' },
  cloud: { en: 'Cloud', ko: '구름량', ja: '雲量' },
  cloudPhone: { en: 'Cloud cover, %', ko: '구름량, %', ja: '雲量、%' },
  cloudAfter: { en: 'cloud', ko: '구름량', ja: '雲量' },
  lead: { en: 'Kp 5.3 at 23:00', ko: '23:00에 Kp 5.3', ja: '23:00にKp 5.3' },
  leadRest: {
    en: ', and the cloud from the west thins to 10% over the city. A new band comes in off the coast after 00:30.',
    ko: '이고, 서쪽에서 오는 구름이 도시 위에서 10%까지 옅어집니다. 00:30 이후 해안 쪽에서 새로운 오로라 띠가 들어옵니다.',
    ja: 'で、西から来る雲は市内の上空で10%まで薄くなります。00:30以降、沿岸から新しいオーロラ帯が入ってきます。',
  },
  enough: {
    en: 'Over Tromsø Kp 2 is enough to see the aurora overhead when the sky is clear.',
    ko: 'Tromsø에서는 하늘이 맑으면 Kp 2만으로도 머리 위의 오로라를 볼 수 있습니다.',
    ja: 'Tromsøでは空が晴れていれば、Kp 2でも頭上のオーロラが見えます。',
  },
  seats: {
    en: "{n} of tonight's 5 tours still have seats.",
    ko: '오늘 밤 투어 5개 중 {n}개에 아직 자리가 있습니다.',
    ja: '今夜の5ツアーのうち{n}件はまだ空席があります。',
  },
} satisfies Record<string, Tri>;

// The axis runs from 18:00 to 04:00, one column an hour. The best window is
// 22:40 to 00:30: it starts 4h40 into the axis and lasts 1h50.
const WINDOW = { from: '22:40', to: '00:30', left: (4 + 40 / 60) / 10, width: (1 + 50 / 60) / 10 };
// Kp runs from 0 to 7 on the chart (the stylesheet divides by 7); these get a line.
const SCALE = [6, 4, 2];
const HOURS = [
  { h: '18', kp: 2.3, cloud: 80 },
  { h: '19', kp: 2.7, cloud: 65 },
  { h: '20', kp: 3.3, cloud: 50 },
  { h: '21', kp: 4.0, cloud: 35 },
  { h: '22', kp: 4.7, cloud: 20, best: true },
  { h: '23', kp: 5.3, cloud: 10, best: true },
  { h: '00', kp: 5.0, cloud: 15, best: true },
  { h: '01', kp: 4.3, cloud: 45 },
  { h: '02', kp: 3.7, cloud: 60 },
  { h: '03', kp: 3.0, cloud: 70 },
];

type TourId = 'border' | 'minibus' | 'fjord' | 'photo' | 'boat';

interface Tour {
  id: TourId;
  time: string;
  hours: number;
  capacity: number;
  price: number;
  name: Tri;
  /** Where the guests are picked up. */
  pickup: Tri;
  /** The board line under the tour's name, when it says more than the pickup point. */
  board?: Tri;
  plan: Tri;
  /** Replaces `plan` on the first night, when the guide already knows the direction. */
  tonight?: Tri;
  included: Tri;
}

const TOURS: Tour[] = [
  {
    id: 'border',
    time: '18:00',
    hours: 10,
    capacity: 16,
    price: 2450,
    name: { en: 'Finland border chase', ko: '핀란드 국경 추격', ja: 'フィンランド国境チェイス' },
    pickup: { en: 'Prostneset bus terminal, stop B', ko: 'Prostneset 버스터미널, B 승강장', ja: 'Prostneset バスターミナル、Bのりば' },
    plan: {
      en: 'When the coast is cloudy the bus crosses into Finland, up to three hours each way. Bring your passport.',
      ko: '해안에 구름이 끼면 버스가 핀란드로 넘어갑니다. 편도 최대 3시간이 걸립니다. 여권을 챙겨 오세요.',
      ja: '沿岸に雲がかかっている場合、バスはフィンランドへ越境します。片道最長3時間です。パスポートをお持ちください。',
    },
    included: {
      en: 'Thermal suit, boots and mittens are included, with a hot meal at Kilpisjärvi.',
      ko: '방한복, 부츠, 미텐이 포함되며 Kilpisjärvi에서 따뜻한 식사를 제공합니다.',
      ja: '防寒スーツ、ブーツ、ミトンが含まれ、Kilpisjärviで温かい食事があります。',
    },
  },
  {
    id: 'minibus',
    time: '18:30',
    hours: 7,
    capacity: 8,
    price: 1890,
    name: { en: 'Minibus chase, eight guests', ko: '미니버스 추격, 8명', ja: 'ミニバスチェイス、8名' },
    pickup: { en: 'Our office, Storgata 52', ko: '사무실, Storgata 52', ja: '事務所、Storgata 52' },
    plan: {
      en: 'The guide picks the direction at 17:30 on the day, from the cloud forecast, and drives as far as the clear sky needs.',
      ko: '가이드가 당일 17:30에 구름 예보를 보고 방향을 정하며, 맑은 하늘이 있는 곳까지 필요한 만큼 달립니다.',
      ja: 'ガイドが当日17:30に雲の予報をもとに方角を決め、晴れ間が必要な距離まで走ります。',
    },
    tonight: {
      en: 'Tonight the guide expects to drive east to Skibotn, 1 hour 40 minutes each way, and to be back in Tromsø around 01:30.',
      ko: '오늘 밤 가이드는 동쪽 Skibotn까지 편도 1시간 40분을 달리고, 01:30경 Tromsø로 돌아올 예정입니다.',
      ja: '今夜のガイドは東のSkibotnまで片道1時間40分走り、01:30頃にTromsøへ戻る予定です。',
    },
    included: {
      en: 'Thermal suit, boots and mittens are included, with a hot drink and cinnamon buns by the fire. Photos of your group arrive by email the next day.',
      ko: '방한복, 부츠, 미텐이 포함되며 모닥불 옆에서 따뜻한 음료와 시나몬 롤을 드립니다. 단체 사진은 다음 날 이메일로 보내 드립니다.',
      ja: '防寒スーツ、ブーツ、ミトンが含まれ、焚き火のそばで温かい飲み物とシナモンロールを楽しめます。グループの写真は翌日メールでお届けします。',
    },
  },
  {
    id: 'fjord',
    time: '19:00',
    hours: 6,
    capacity: 20,
    price: 1650,
    name: { en: 'Fjord camp at Ersfjordbotn', ko: 'Ersfjordbotn 피오르드 캠프', ja: 'Ersfjordbotnのフィヨルドキャンプ' },
    pickup: {
      en: 'Tromsø Tourist Information, Samuel Arnesens gate 5',
      ko: 'Tromsø 관광안내소, Samuel Arnesens gate 5',
      ja: 'Tromsø観光案内所、Samuel Arnesens gate 5',
    },
    plan: {
      en: 'A heated tent on the shore, 30 minutes from the city. You wait by the fire and step out when the sky starts to move.',
      ko: '도시에서 30분 거리, 해변에 있는 난방 텐트입니다. 모닥불 곁에서 기다리다 하늘이 움직이기 시작하면 밖으로 나갑니다.',
      ja: '市内から30分、海岸にある暖房付きテントです。焚き火のそばで待ち、空が動き出したら外に出ます。',
    },
    included: {
      en: 'Fish soup and hot chocolate are included. The camp does not move, so on a cloudy night the minibus chase is the better bet.',
      ko: '생선 수프와 핫초코가 포함됩니다. 캠프는 움직이지 않으므로 구름이 낀 밤에는 미니버스 추격이 더 낫습니다.',
      ja: '魚のスープとホットチョコレートが含まれます。キャンプは移動しないため、曇りの夜はミニバスチェイスのほうが確実です。',
    },
  },
  {
    id: 'photo',
    time: '20:00',
    hours: 6,
    capacity: 4,
    price: 2950,
    name: { en: 'Photo chase, four guests', ko: '사진 촬영 추격, 4명', ja: '撮影チェイス、4名' },
    pickup: { en: 'Our office, Storgata 52', ko: '사무실, Storgata 52', ja: '事務所、Storgata 52' },
    board: {
      en: 'Our office, Storgata 52. Tripods and a camera guide included.',
      ko: '사무실, Storgata 52. 삼각대와 카메라 안내가 포함됩니다.',
      ja: '事務所、Storgata 52。三脚とカメラガイドを含みます。',
    },
    plan: {
      en: 'Four guests and two guides. One of them is a photographer who sets up your camera for the aurora and takes a portrait of you under it.',
      ko: '손님 4명과 가이드 2명입니다. 그중 한 명은 사진작가로, 오로라에 맞춰 카메라를 설정하고 오로라 아래에서 인물 사진을 찍어 줍니다.',
      ja: 'ゲスト4名、ガイド2名です。そのうち1名はカメラマンで、オーロラに合わせてカメラを設定し、オーロラの下でポートレートを撮影します。',
    },
    included: {
      en: 'Bring your own camera, or borrow one of ours at no charge.',
      ko: '카메라를 직접 가져오시거나, 무료로 대여해 드리는 카메라를 이용하세요.',
      ja: 'カメラをお持ちの方はご持参ください。お持ちでない場合は無料で貸し出しをご利用いただけます。',
    },
  },
  {
    id: 'boat',
    time: '21:00',
    hours: 3,
    capacity: 24,
    price: 1490,
    name: { en: 'Aurora boat into the fjord', ko: '피오르드로 나가는 오로라 보트', ja: 'フィヨルドへ向かうオーロラボート' },
    pickup: { en: 'Prostneset quay, berth 2', ko: 'Prostneset 부두, 2번 선석', ja: 'Prostneset桟橋、2番バース' },
    plan: {
      en: 'A quiet electric boat leaves the quay and sails out of the city lights into Kaldfjorden.',
      ko: '조용한 전기 보트가 부두를 떠나 도시 불빛을 벗어나 Kaldfjorden으로 나아갑니다.',
      ja: '静かな電動ボートが桟橋を出て、街の明かりを離れてKaldfjordenへ進みます。',
    },
    included: {
      en: 'Warm suits are on board. The boat sails only when the wind is under 10 metres a second.',
      ko: '보트에 방한복이 비치되어 있습니다. 풍속이 초속 10미터 미만일 때만 출항합니다.',
      ja: '船内に防寒スーツを用意しています。風速が毎秒10メートル未満のときのみ出航します。',
    },
  },
];

interface Night {
  iso: string;
  cloud: number;
  kp: number;
  /** Seats left on each tour before any booking made on this page. */
  seats: Record<TourId, number>;
  day: Tri;
  short: Tri;
  dd: Tri;
  full: Tri;
  sky: Tri;
}

const NIGHTS: Night[] = [
  {
    iso: '2026-11-20',
    cloud: 15,
    kp: 5.3,
    seats: { border: 5, minibus: 3, fjord: 9, photo: 1, boat: 0 },
    day: { en: 'Tonight', ko: '오늘 밤', ja: '今夜' },
    short: { en: 'Tonight', ko: '오늘', ja: '今夜' },
    dd: { en: '20 Nov', ko: '11월 20일', ja: '11月20日' },
    full: { en: 'Friday 20 November', ko: '금요일 11월 20일', ja: '11月20日(金)' },
    sky: {
      en: 'looks clear from 22:40 to 00:30, with Kp 5.3 at 23:00.',
      ko: '22:40부터 00:30까지 맑아 보이며, 23:00에 Kp 5.3입니다.',
      ja: '22:40から00:30まで晴れて見え、23:00にKp 5.3です。',
    },
  },
  {
    iso: '2026-11-21',
    cloud: 75,
    kp: 3.0,
    seats: { border: 12, minibus: 6, fjord: 14, photo: 2, boat: 8 },
    day: { en: 'Saturday', ko: '토요일', ja: '土曜日' },
    short: { en: 'Sat', ko: '토', ja: '土' },
    dd: { en: '21 Nov', ko: '11월 21일', ja: '11月21日' },
    full: { en: 'Saturday 21 November', ko: '토요일 11월 21일', ja: '11月21日(土)' },
    sky: {
      en: 'stays mostly cloudy. The guides will look for gaps towards the Finnish border.',
      ko: '대체로 흐린 상태가 이어집니다. 가이드가 핀란드 국경 쪽에서 구름 틈을 찾아볼 예정입니다.',
      ja: 'ほぼ曇りのままです。ガイドはフィンランド国境方面で雲の切れ間を探します。',
    },
  },
  {
    iso: '2026-11-22',
    cloud: 10,
    kp: 4.3,
    seats: { border: 8, minibus: 3, fjord: 15, photo: 0, boat: 0 },
    day: { en: 'Sunday', ko: '일요일', ja: '日曜日' },
    short: { en: 'Sun', ko: '일', ja: '日' },
    dd: { en: '22 Nov', ko: '11월 22일', ja: '11月22日' },
    full: { en: 'Sunday 22 November', ko: '일요일 11월 22일', ja: '11月22日(日)' },
    sky: {
      en: 'looks clear for most of the night, with Kp above 4 from about 21:00.',
      ko: '밤 대부분 맑아 보이며, 21:00경부터 Kp 4 이상입니다.',
      ja: '夜のほとんどが晴れて見え、21:00頃からKp 4以上です。',
    },
  },
  {
    iso: '2026-11-23',
    cloud: 40,
    kp: 3.3,
    seats: { border: 11, minibus: 5, fjord: 16, photo: 3, boat: 12 },
    day: { en: 'Monday', ko: '월요일', ja: '月曜日' },
    short: { en: 'Mon', ko: '월', ja: '月' },
    dd: { en: '23 Nov', ko: '11월 23일', ja: '11月23日' },
    full: { en: 'Monday 23 November', ko: '월요일 11월 23일', ja: '11月23日(月)' },
    sky: {
      en: 'has cloud coming and going, and Kp around 3.',
      ko: '구름이 드나들며, Kp는 3 안팎입니다.',
      ja: '雲が出入りし、Kpは3前後です。',
    },
  },
  {
    iso: '2026-11-24',
    cloud: 90,
    kp: 2.3,
    seats: { border: 14, minibus: 7, fjord: 17, photo: 4, boat: 10 },
    day: { en: 'Tuesday', ko: '화요일', ja: '火曜日' },
    short: { en: 'Tue', ko: '화', ja: '火' },
    dd: { en: '24 Nov', ko: '11월 24일', ja: '11月24日' },
    full: { en: 'Tuesday 24 November', ko: '화요일 11월 24일', ja: '11月24日(火)' },
    sky: {
      en: 'is overcast on the coast and inland, with a low Kp of 2.3.',
      ko: '해안과 내륙 모두 흐리며, Kp는 2.3으로 낮습니다.',
      ja: '沿岸も内陸も曇りで、Kpは2.3と低めです。',
    },
  },
  {
    iso: '2026-11-25',
    cloud: 55,
    kp: 4.0,
    seats: { border: 13, minibus: 6, fjord: 18, photo: 3, boat: 10 },
    day: { en: 'Wednesday', ko: '수요일', ja: '水曜日' },
    short: { en: 'Wed', ko: '수', ja: '水' },
    dd: { en: '25 Nov', ko: '11월 25일', ja: '11月25日' },
    full: { en: 'Wednesday 25 November', ko: '수요일 11월 25일', ja: '11月25日(水)' },
    sky: {
      en: 'has a clear spell after midnight, with Kp 4.0.',
      ko: '자정 이후 잠시 맑아지며, Kp는 4.0입니다.',
      ja: '真夜中過ぎにしばらく晴れ、Kpは4.0です。',
    },
  },
  {
    iso: '2026-11-26',
    cloud: 30,
    kp: 5.7,
    seats: { border: 9, minibus: 4, fjord: 12, photo: 1, boat: 12 },
    day: { en: 'Thursday', ko: '목요일', ja: '木曜日' },
    short: { en: 'Thu', ko: '목', ja: '木' },
    dd: { en: '26 Nov', ko: '11월 26일', ja: '11月26日' },
    full: { en: 'Thursday 26 November', ko: '목요일 11월 26일', ja: '11月26日(木)' },
    sky: {
      en: 'has the strongest Kp of the week, 5.7, and some cloud in the early evening.',
      ko: '이번 주 가장 강한 Kp 5.7이며, 초저녁에 구름이 조금 있습니다.',
      ja: '今週で最も強いKp 5.7で、夕方早い時間に少し雲があります。',
    },
  },
];

const BOARD = {
  titleTonight: { en: 'Leaving tonight', ko: '오늘 밤 출발', ja: '今夜の出発' },
  titleOn: { en: 'Leaving on {day}', ko: '{day} 출발', ja: '{day}の出発' },
  intro: {
    en: 'Times are pickup times. Every tour drives to the clearest sky it can reach, and the guide confirms the direction by text message at 17:30.',
    ko: '표시된 시간은 집합 시간입니다. 모든 투어는 도달할 수 있는 가장 맑은 하늘을 향해 이동하며, 가이드가 17:30에 문자 메시지로 방향을 확인해 드립니다.',
    ja: '表示の時刻は集合時刻です。どのツアーも到達できる最も晴れた空を目指して移動し、ガイドが17:30にテキストメッセージで方角を確認します。',
  },
  otherNights: { en: 'Other nights', ko: '다른 날 밤', ja: 'ほかの夜' },
  group: { en: 'Tours on {date}', ko: '{date} 투어', ja: '{date}のツアー' },
  pickup: { en: 'Pickup', ko: '집합 시간', ja: '集合時刻' },
  tour: { en: 'Tour and pickup point', ko: '투어 및 집합 장소', ja: 'ツアーと集合場所' },
  duration: { en: 'Duration', ko: '소요 시간', ja: '所要時間' },
  seatsLeft: { en: 'Seats left', ko: '남은 좌석', ja: '残席' },
  price: { en: 'Price', ko: '요금', ja: '料金' },
  h: { en: 'h', ko: '시간', ja: '時間' },
  hours: { en: 'hours', ko: '시간', ja: '時間' },
  of: { en: 'of {cap}', ko: '/ {cap}석', ja: '/ {cap}席' },
  left: { en: 'left', ko: '남음', ja: '残り' },
  full: { en: 'Full', ko: '마감', ja: '満席' },
} satisfies Record<string, Tri>;

const CURRENCY = 'NOK';

type Field = 'name' | 'email' | 'phone';
const FIELDS: Field[] = ['name', 'email', 'phone'];

const BOOK = {
  form: { en: 'Book the {tour}', ko: '{tour} 예약', ja: '{tour}を予約' },
  guests: { en: 'Guests', ko: '인원', ja: '人数' },
  fewer: { en: 'One fewer guest', ko: '1명 줄이기', ja: '1名減らす' },
  more: { en: 'One more guest', ko: '1명 늘리기', ja: '1名増やす' },
  totalOne: { en: '{total} for 1 guest', ko: '1명 기준 {total}', ja: '1名で{total}' },
  totalMany: { en: '{total} for {n} guests', ko: '{n}명 기준 {total}', ja: '{n}名で{total}' },
  submitOne: { en: 'Book 1 seat for {total}', ko: '{total}에 1석 예약', ja: '{total}で1席予約' },
  submitMany: { en: 'Book {n} seats for {total}', ko: '{total}에 {n}석 예약', ja: '{total}で{n}席予約' },
  note: {
    en: 'You pay on board, by card. You can cancel, or move to another night, for free until 15:00 on the day.',
    ko: '요금은 탑승 시 카드로 결제합니다. 당일 15:00까지는 무료로 취소하거나 다른 날 밤으로 변경할 수 있습니다.',
    ja: 'お支払いは乗車時にカードでお願いします。当日15:00まではキャンセル、または別の夜への変更が無料です。',
  },
  bookedOne: {
    en: 'Your seat is booked for {time} on {date}.',
    ko: '{date} {time} 좌석이 예약되었습니다.',
    ja: '{date} {time}の座席を予約しました。',
  },
  bookedMany: {
    en: 'Your {n} seats are booked for {time} on {date}.',
    ko: '{date} {time} 좌석 {n}석이 예약되었습니다.',
    ja: '{date} {time}の座席{n}席を予約しました。',
  },
  meet: { en: 'Pickup is at {place}.', ko: '집합 장소는 {place}입니다.', ja: '集合場所は{place}です。' },
  sent: {
    en: 'The booking is on its way to {email}, and the guide will text {phone} at 17:30 with the direction.',
    ko: '예약 내용을 {email} 주소로 보내 드렸습니다. 가이드가 17:30에 {phone}로 방향을 문자로 알려 드립니다.',
    ja: '予約内容を{email}宛に送信しました。ガイドが17:30に{phone}へ方角をテキストで連絡します。',
  },
} satisfies Record<string, Tri>;

const FIELD_COPY: Record<Field, { label: Tri; error: Tri; type: string; autoComplete: string }> = {
  name: {
    label: { en: 'Name on the booking', ko: '예약자 이름', ja: '予約者のお名前' },
    error: {
      en: 'Write the name the booking should be under.',
      ko: '예약을 받을 이름을 입력해 주세요.',
      ja: '予約名義のお名前を入力してください。',
    },
    type: 'text',
    autoComplete: 'name',
  },
  email: {
    label: { en: 'Email', ko: '이메일', ja: 'メールアドレス' },
    error: {
      en: 'Check the email address. It needs an @ and a domain.',
      ko: '이메일 주소를 확인해 주세요. @와 도메인이 필요합니다.',
      ja: 'メールアドレスを確認してください。@とドメインが必要です。',
    },
    type: 'email',
    autoComplete: 'email',
  },
  phone: {
    label: { en: 'Mobile number', ko: '휴대전화 번호', ja: '携帯電話番号' },
    error: {
      en: 'Write a mobile number with its country code, such as +47 912 34 567.',
      ko: '국가번호를 포함한 휴대전화 번호를 입력해 주세요. 예: +47 912 34 567',
      ja: '国番号を含む携帯電話番号を入力してください。例：+47 912 34 567',
    },
    type: 'tel',
    autoComplete: 'tel',
  },
};

const WEAR = {
  title: { en: 'What to wear tonight', ko: '오늘 밤 복장', ja: '今夜の服装' },
  temp: '−12',
  unit: '°C',
  tempNote: {
    en: 'at Skibotn around midnight, and it feels like −17 °C in the wind. At pickup in Tromsø it is −7 °C.',
    ko: '자정 무렵 Skibotn 기준입니다. 바람이 불면 체감 −17 °C이고, Tromsø 집합 장소는 −7 °C입니다.',
    ja: '真夜中頃のSkibotnの気温です。風の中では体感−17 °Cで、Tromsøの集合場所では−7 °Cです。',
  },
  lend: { en: 'We lend you', ko: '대여 물품', ja: '貸し出し品' },
  bring: { en: 'Bring these', ko: '준비물', ja: '持参するもの' },
  packed: { en: '{n} of {total} packed', ko: '{total}개 중 {n}개 챙김', ja: '{total}点中{n}点準備済み' },
} as const;

const LEND: Array<[Tri, Tri]> = [
  [
    { en: 'Thermal overall', ko: '방한 오버올', ja: '防寒オーバーオール' },
    { en: 'sizes XS to 3XL', ko: '사이즈 XS~3XL', ja: 'サイズ XS〜3XL' },
  ],
  [
    { en: 'Winter boots', ko: '겨울용 부츠', ja: '冬用ブーツ' },
    { en: 'sizes 36 to 48', ko: '사이즈 36~48', ja: 'サイズ 36〜48' },
  ],
  [
    { en: 'Wool mittens', ko: '울 미텐', ja: 'ウールのミトン' },
    { en: 'one size', ko: '원사이즈', ja: 'フリーサイズ' },
  ],
  [
    { en: 'Headlamp', ko: '헤드램프', ja: 'ヘッドランプ' },
    { en: 'with a red light for your eyes', ko: '눈을 보호하는 적색 조명 포함', ja: '目を守る赤色ライト付き' },
  ],
];

const PACK: Array<{ name: Tri; note: Tri }> = [
  {
    name: { en: 'Thermal base layer, top and bottom', ko: '상하의 방한 베이스레이어', ja: '上下の防寒ベースレイヤー' },
    note: {
      en: 'Wool or synthetic. Cotton holds sweat and gets cold.',
      ko: '울 또는 합성섬유를 고르세요. 면은 땀을 머금어 쉽게 차가워집니다.',
      ja: 'ウールか化学繊維を選んでください。綿は汗を吸って冷えやすいです。',
    },
  },
  {
    name: { en: 'Two pairs of wool socks', ko: '울 양말 두 켤레', ja: 'ウールの靴下 2足' },
    note: {
      en: 'One pair on, one dry pair in your bag for the drive back.',
      ko: '한 켤레는 신고, 마른 한 켤레는 가방에 넣어 돌아가는 길에 쓰세요.',
      ja: '1足は履いて、もう1足は乾いたものをバッグに入れて帰りに使ってください。',
    },
  },
  {
    name: { en: 'A fleece or wool sweater', ko: '플리스 또는 울 스웨터', ja: 'フリースかウールのセーター' },
    note: {
      en: 'It goes between the base layer and the thermal suit.',
      ko: '베이스레이어와 방한복 사이에 입습니다.',
      ja: 'ベースレイヤーと防寒スーツの間に着ます。',
    },
  },
  {
    name: { en: 'A hat that covers your ears', ko: '귀를 덮는 모자', ja: '耳まで覆える帽子' },
    note: {
      en: 'And a scarf or buff for the wind at the shore.',
      ko: '해안의 바람을 막을 목도리나 넥워머도 챙기세요.',
      ja: '海岸の風に備えて、マフラーかネックウォーマーも。',
    },
  },
  {
    name: { en: 'Thin gloves', ko: '얇은 장갑', ja: '薄手の手袋' },
    note: {
      en: 'Wear them under the mittens so you can work your camera.',
      ko: '미텐 안에 끼면 카메라를 조작할 수 있습니다.',
      ja: 'ミトンの下に着けると、カメラを操作できます。',
    },
  },
  {
    name: { en: 'A charged phone and a power bank', ko: '충전된 휴대폰과 보조배터리', ja: '充電済みのスマホとモバイルバッテリー' },
    note: {
      en: 'Batteries drain fast at −12 °C. Keep them in an inside pocket.',
      ko: '−12 °C에서는 배터리가 빨리 닳습니다. 안주머니에 넣어 두세요.',
      ja: '−12 °Cでは電池の消耗が早くなります。内ポケットに入れてください。',
    },
  },
];

const NIGHTS_COPY = {
  title: { en: 'The next seven nights', ko: '앞으로 7일 밤', ja: 'これからの7夜' },
  intro: {
    en: 'Here the cloud decides more than the Kp index. Cloud cover is shown for midnight. If the forecast turns, you can move your booking to another night for free until 15:00 on the day.',
    ko: '이곳에서는 Kp 지수보다 구름이 더 큰 영향을 줍니다. 구름량은 자정 기준입니다. 예보가 바뀌면 당일 15:00까지 무료로 다른 날 밤으로 예약을 옮길 수 있습니다.',
    ja: 'ここでは、Kp指数より雲のほうが観測を左右します。雲量は真夜中の値です。予報が変わった場合は、当日15:00まで無料で別の夜に予約を変更できます。',
  },
  choose: { en: 'Choose a night', ko: '밤 선택', ja: '夜を選ぶ' },
  seatsOne: { en: '{n} seat', ko: '{n}석', ja: '{n}席' },
  seatsMany: { en: '{n} seats', ko: '{n}석', ja: '{n}席' },
  allTours: {
    en: 'All 5 tours have seats, {seats} in all, from {price}.',
    ko: '5개 투어 모두 자리가 있으며, 총 {seats}석, {price}부터입니다.',
    ja: '5ツアーすべてに空席があり、合計{seats}席、{price}からです。',
  },
  someTours: {
    en: '{n} of the 5 tours have seats, {seats} in all, from {price}.',
    ko: '5개 투어 중 {n}개에 자리가 있으며, 총 {seats}석, {price}부터입니다.',
    ja: '5ツアーのうち{n}件に空席があり、合計{seats}席、{price}からです。',
  },
  noTours: {
    en: 'Every tour is full that night.',
    ko: '이날 밤은 모든 투어가 마감되었습니다.',
    ja: 'この夜は全ツアーが満席です。',
  },
  linkTonight: { en: "See tonight's tours", ko: '오늘 밤 투어 보기', ja: '今夜のツアーを見る' },
  linkOn: { en: "See {day}'s tours", ko: '{day} 투어 보기', ja: '{day}のツアーを見る' },
} satisfies Record<string, Tri>;

const FOOTER = {
  office: {
    en: 'Polar Night Chase, Storgata 52, 9008 Tromsø. The office is open from 10:00 to 20:00, 1 September to 15 April.',
    ko: 'Polar Night Chase, Storgata 52, 9008 Tromsø. 사무실은 9월 1일부터 4월 15일까지 10:00~20:00에 엽니다.',
    ja: 'Polar Night Chase、Storgata 52、9008 Tromsø。事務所は9月1日から4月15日まで10:00〜20:00に営業しています。',
  },
  promise: {
    en: 'If we see no aurora on a chase, your next chase in the same season costs half.',
    ko: '추격 투어에서 오로라를 보지 못하면, 같은 시즌의 다음 추격 투어는 요금의 절반입니다.',
    ja: 'チェイスでオーロラが見られなかった場合、同じシーズンの次回のチェイスは半額です。',
  },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in Aurora Gradient style: a deep night-blue page where the aurora glows in one place only, behind tonight's forecast, and everything else is ruled lines and type.

Pick a believable subject that lives at night under the northern lights, such as an aurora tour operator, an observatory or an arctic lodge, and write its real content. The page must read as that subject's page, never as a page about its own style.

COLOR TOKENS:
--bg: #070b1a
--surface: #10152a
--ink: #e4e5ee
--muted: #a6a8b4
--line: rgba(233,234,243,0.26)
--line-strong: rgba(233,234,243,0.52)
--green: #7be0a3
--violet: #9d7bff
--error: #ffa8a0
--field: #0b1024 (the fill of text fields)
No other colours, apart from white for the ink button's hover and the line tone rgba(233,234,243) at other opacities for fills, hatching, hover and disabled states.

THE AURORA:
- One full-width band behind the forecast chart: layered radial gradients of green (#7be0a3, up to 0.42 opacity, with a paler core rgba(140,240,180) at up to 0.62 behind the best viewing window) and violet (#9d7bff, up to 0.46 opacity), masked so it fades out at the top and bottom.
- Inside the green, thin vertical rays: a repeating linear gradient of pale green rgba(200,255,225) at 0.05 to 0.075 opacity, masked to an ellipse.
- It drifts and brightens slowly, over 18 to 26 seconds.
- Nowhere else: no gradient text, no gradient buttons, no glow on panels, no glass.
- Elsewhere the only colours are one flat green, which marks what the visitor has chosen (the open tour, a packed item, the chosen night, a confirmed booking), and the error colour on fields that need fixing. The site's own controls around the page stay in ink.

TYPOGRAPHY:
Two families. Literata, a screen serif with an optical-size axis, sets the headlines and the figures that stand on their own; Public Sans sets the reading text, labels and buttons, and the small figures inside them (cloud per hour, Kp and seats per night).
H1: Literata 500, clamp(2.75rem, 6.5vw, 6rem), line-height 1, tracking -0.032em
H2: Literata 500, clamp(2rem, 3.9vw, 3.125rem), line-height 1.04, tracking -0.025em
H3: Literata 500, 1.375rem
Figures (Kp values, hours, pickup times, seats, prices, cloud cover, the packed count): Literata 600 with tabular figures, 1.25rem to 1.875rem on desktop; on phones the hourly Kp values and hours drop to 1rem and pickup times to 1.5rem
Dates: Literata 500 in the hero and on the board, 600 in the nights strip. The temperature: Literata 400, 5.75rem (4.5rem below 1080px, 4.25rem on phones)
The hero's weekday and the words "Best window": Literata italic 400
Body: Public Sans 400, 1.0625rem, line-height 1.55. No text under 16px.

LAYOUT:
- One 12-column grid, max width about 1120px, sections 128px apart (104px below 1080px, 88px on phones).
- A page bar ruled off by a 1px line below it: the operator's name, links to the sections (hidden below 1080px), the local time and temperature.
- Hero: the date on the first three columns under a 2px rule, the headline on the other nine; below 1080px the headline takes the full width and the date runs under it. Under them the forecast band: the Kp index per hour as bars on a 0 to 7 scale with the best window marked, the hour axis on a 2px rule, and one small hatched square of sky per hour for the cloud cover. Then three short paragraphs.
- Departure board: the tours leaving that night as ruled rows with pickup time, tour and pickup point, duration, seats left with a thin meter, and price. Choosing a row opens its booking line under it.
- What to wear: the night's temperature in large type and what the operator lends, beside a packing checklist.
- The next seven nights as seven columns, each with a square of sky hatched by its cloud cover. Choosing a night updates the summary under them and the board.
- Below 860px the board rows stack; on phones the seven nights become rows, and the chart keeps its bars and drops its axis column.

COMPONENTS:
- Board rows are radio buttons drawn as rows: a 4px green bar on the left edge and a stronger outline mark the open one. A full tour is grey and cannot be chosen; one the visitor filled with their own booking stays in ink and can be chosen to see that booking again.
- Booking line: what that night holds, a guests stepper (44px square buttons, from 1 to the seats left), the total, three fields (name, email, mobile) with their errors under them, and one solid ink button whose label says the seats and the price.
- Checklist: 28px square boxes. A packed item fills green and its name is struck through in green.
- Night selector: toggle buttons with aria-pressed, exactly one pressed, marked by a green bar along the top (along the left edge on phones).
- Lines: 1px at 0.26 opacity. 2px ink rules start the date, the board, the hour axis, the packing list and the nights. Square corners everywhere.

MOTION:
- Only the aurora band moves, apart from the site's smooth scroll to anchors. Hover changes colour in 160ms.
- prefers-reduced-motion holds the band still.

FORBIDDEN:
- Gradient page backgrounds, gradient text, glowing buttons or panels
- Glass panels and backdrop blur on content
- Cards, pills, chips and rounded corners
- A small label above a heading, all-caps tracked labels
- Starfields, mountain silhouettes and other drawn scenery
- A table that scrolls sideways on phones

OUTPUT:
1) CSS custom properties
2) Semantic HTML and CSS: radio rows for the tours, a real form with its errors next to the fields, checkboxes, toggle buttons with aria-pressed
3) Responsive layout down to 320px with no horizontal scroll
4) Visible focus and reduced-motion support`;

const PROMPT_KO = `Aurora Gradient 스타일로 실제 페이지 하나를 디자인한다. 짙은 밤하늘색 페이지에서 오로라는 오늘 밤 예보 뒤 한 곳에서만 빛나고, 나머지는 선과 타이포그래피로만 구성한다.

북극광 아래에서 밤을 보내는 현실적인 주제를 하나 고르고, 그 주제의 실제 내용을 쓴다. 예: 오로라 투어 운영사, 천문대, 북극 롯지. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체에 관한 페이지처럼 보여서는 안 된다.

COLOR TOKENS:
--bg: #070b1a
--surface: #10152a
--ink: #e4e5ee
--muted: #a6a8b4
--line: rgba(233,234,243,0.26)
--line-strong: rgba(233,234,243,0.52)
--green: #7be0a3
--violet: #9d7bff
--error: #ffa8a0
--field: #0b1024 (텍스트 입력란의 배경)
이 밖의 색은 쓰지 않는다. 다만 잉크 버튼 호버의 흰색과, 선 색 rgba(233,234,243)을 채우기·빗금·호버·비활성 상태에 다른 불투명도로 쓰는 것은 예외다.

THE AURORA:
- 예보 차트 뒤에 전체 너비의 띠 하나를 둔다. 초록(#7be0a3, 불투명도 최대 0.42)과 보라(#9d7bff, 불투명도 최대 0.46)의 겹친 방사형 그라데이션을 쓰고, 위아래가 사라지도록 마스크를 씌운다. 최적 관측 시간대 뒤에는 더 밝은 중심부 rgba(140,240,180)를 불투명도 최대 0.62로 둔다.
- 초록 안에 가는 세로 빛줄기를 넣는다. 연한 초록 rgba(200,255,225)의 반복 선형 그라데이션을 불투명도 0.05~0.075로 쓰고, 타원 마스크로 자른다.
- 18~26초에 걸쳐 천천히 흐르며 밝아진다.
- 그 밖에는 쓰지 않는다: 그라데이션 텍스트, 그라데이션 버튼, 패널의 빛 번짐, 유리 질감.
- 그 밖의 곳에서 색은 단색 초록 하나뿐이며, 방문자가 고른 것을 표시한다: 열린 투어, 챙긴 준비물, 선택한 밤, 확정된 예약. 입력란에서 고쳐야 할 곳은 오류 색으로 표시한다. 페이지 주변의 사이트 컨트롤은 잉크 색을 유지한다.

TYPOGRAPHY:
서체는 두 가지다. Literata(광학 크기 축을 가진 화면용 세리프)는 제목과 단독으로 서는 숫자를 조판하고, Public Sans는 본문, 라벨, 버튼과 그 안의 작은 숫자(시간별 구름량, 밤별 Kp와 좌석 수)를 조판한다.
H1: Literata 500, clamp(2.75rem, 6.5vw, 6rem), line-height 1, tracking -0.032em
H2: Literata 500, clamp(2rem, 3.9vw, 3.125rem), line-height 1.04, tracking -0.025em
H3: Literata 500, 1.375rem
숫자(Kp 값, 집합 시각, 좌석 수, 가격, 구름량, 챙긴 항목 수): Literata 600, 표 형식 숫자(tabular figures), 데스크톱에서 1.25rem~1.875rem. 휴대폰에서는 시간별 Kp 값과 시간이 1rem, 집합 시각이 1.5rem으로 줄어든다.
날짜: 히어로와 보드에서는 Literata 500, 밤 목록 띠에서는 600. 기온: Literata 400, 5.75rem(1080px 미만에서는 4.5rem, 휴대폰에서는 4.25rem)
요일과 "Best window" 문구: Literata italic 400
본문: Public Sans 400, 1.0625rem, line-height 1.55. 16px 미만 글자는 쓰지 않는다.

LAYOUT:
- 12열 그리드 하나, 최대 너비 약 1120px, 섹션 간격 약 128px(1080px 미만에서는 104px, 휴대폰에서는 88px).
- 1px 선 아래의 페이지 바: 운영사 이름, 섹션 링크(1080px 미만에서는 숨김), 현지 시각과 기온.
- 히어로: 2px 선 아래 첫 3열에 날짜, 나머지 9열에 제목. 1080px 미만에서는 제목이 전체 너비를 쓰고 날짜가 그 아래에 놓인다. 그 아래에 예보 띠를 둔다. 시간별 Kp 지수를 0~7 눈금의 막대로 그리고 최적 시간대를 표시한다. 2px 선 위에 시간 축을 두고, 시간마다 구름량을 나타내는 작은 빗금 정사각형 하나를 둔다. 그 뒤에 짧은 문단 세 개를 둔다.
- 출발 보드: 그날 밤 출발하는 투어를 선으로 구분한 행으로 나열한다. 행마다 집합 시간, 투어와 집합 장소, 소요 시간, 얇은 게이지가 달린 남은 좌석, 요금을 넣는다. 행을 고르면 그 아래에 예약 줄이 열린다.
- 복장: 그날 밤의 기온을 큰 글씨로 보여 주고, 운영사가 대여하는 물품을 준비물 체크리스트 옆에 둔다.
- 앞으로 7일 밤을 7열로 나열한다. 각 열에는 구름량에 따라 빗금이 그려진 하늘 정사각형을 둔다. 밤을 고르면 그 아래 요약과 출발 보드가 함께 바뀐다.
- 860px 미만에서는 보드 행을 세로로 쌓고, 휴대폰에서는 7일 밤이 행으로 바뀌며, 차트는 막대를 유지하고 축 열은 뺀다.

COMPONENTS:
- 보드의 행은 행 모양으로 그린 라디오 버튼이다. 선택된 행은 왼쪽 가장자리의 4px 초록 막대와 더 진한 윤곽선으로 표시한다. 마감된 투어는 회색이며 선택할 수 없다. 방문자가 자신의 예약으로 채운 투어는 잉크 색을 유지하며, 골라서 그 예약을 다시 볼 수 있다.
- 예약 줄: 그날 밤의 출발 정보, 인원 스테퍼(44px 정사각형 버튼, 1명부터 남은 좌석 수까지), 합계, 세 개의 입력란(이름, 이메일, 휴대전화)과 각 입력란 아래의 오류 메시지, 좌석 수와 요금을 적은 진한 단색 버튼 하나.
- 체크리스트: 28px 정사각형 상자. 챙긴 항목은 초록으로 채워지고, 이름에 초록 취소선이 그어진다.
- 밤 선택기: aria-pressed를 쓰는 토글 버튼. 한 번에 정확히 하나만 눌린 상태이며, 위쪽을 따라 초록 막대로 표시한다(휴대폰에서는 왼쪽 가장자리를 따라).
- 선: 불투명도 0.26의 1px. 2px 진한 선이 날짜, 보드, 시간 축, 준비물 목록, 밤 목록을 구분한다. 모서리는 모두 직각이다.

MOTION:
- 사이트의 앵커 이동 시 부드러운 스크롤을 제외하면 움직이는 것은 오로라 띠뿐이다. 호버 시 색 변화는 160ms로 한다.
- prefers-reduced-motion일 때는 띠를 멈춘 상태로 둔다.

FORBIDDEN:
- 그라데이션 페이지 배경, 그라데이션 텍스트, 빛나는 버튼이나 패널
- 유리 패널과 콘텐츠 위의 배경 블러
- 카드, 필(pill), 칩, 둥근 모서리
- 제목 위의 작은 라벨, 대문자에 자간을 넓힌 라벨
- 별밭, 산 실루엣, 그 밖에 그려진 풍경
- 휴대폰에서 옆으로 스크롤되는 표

OUTPUT:
1) CSS 커스텀 속성
2) 시맨틱 HTML과 CSS: 투어는 라디오 행으로, 실제 폼은 각 입력란 옆에 오류를 표시하고, 체크박스와 aria-pressed 토글 버튼을 쓴다
3) 320px까지 대응하는 반응형 레이아웃, 가로 스크롤 없음
4) 눈에 보이는 포커스 표시와 reduced-motion 지원`;

const PROMPT_JA = `Aurora Gradientスタイルで実在するページを一つデザインする。深い紺色のページで、オーロラは今夜の予報の後ろの一か所だけで光り、ほかはすべて罫線と文字で構成する。

北極光の下で夜を過ごす、実在しそうな題材を一つ選び、その実際の内容を書く。例：オーロラツアー会社、天文台、北極圏のロッジ。ページはその題材のページとして読めなければならず、スタイルそのものについてのページに見えてはならない。

COLOR TOKENS:
--bg: #070b1a
--surface: #10152a
--ink: #e4e5ee
--muted: #a6a8b4
--line: rgba(233,234,243,0.26)
--line-strong: rgba(233,234,243,0.52)
--green: #7be0a3
--violet: #9d7bff
--error: #ffa8a0
--field: #0b1024（テキスト入力欄の背景）
これ以外の色は使わない。ただし、インクボタンのホバーの白と、線色 rgba(233,234,243) を塗り、斜線、ホバー、無効状態に別の不透明度で使うことは例外とする。

THE AURORA:
- 予報チャートの後ろに全幅の帯を一つ置く。緑（#7be0a3、不透明度最大0.42）と紫（#9d7bff、不透明度最大0.46）の放射状グラデーションを重ね、上下が消えるようマスクをかける。最適な観測時間帯の後ろには、より明るい中心部 rgba(140,240,180) を不透明度最大0.62で置く。
- 緑の内側に細い縦の光線を入れる。淡い緑 rgba(200,255,225) の繰り返し線形グラデーションを不透明度0.05〜0.075で使い、楕円のマスクで切り抜く。
- 18〜26秒かけてゆっくり流れ、明るくなる。
- ほかの場所では使わない。グラデーションの文字、グラデーションのボタン、パネルの発光、ガラス調は使わない。
- ほかでは単色の緑だけを使い、訪問者が選んだものを示す。選んだツアー、準備したアイテム、選んだ夜、確定した予約。入力欄で直すべき箇所はエラーの色で示す。ページ周囲のサイトのコントロールはインクの色のままにする。

TYPOGRAPHY:
書体は二種類。Literata（光学サイズ軸を持つ画面用セリフ体）は見出しと単独で立つ数字を組み、Public Sansは本文、ラベル、ボタン、およびその中の小さな数字（時間ごとの雲量、夜ごとのKpと席数）を組む。
H1: Literata 500, clamp(2.75rem, 6.5vw, 6rem), line-height 1, tracking -0.032em
H2: Literata 500, clamp(2rem, 3.9vw, 3.125rem), line-height 1.04, tracking -0.025em
H3: Literata 500, 1.375rem
数字（Kp値、集合時刻、席数、料金、雲量、準備済みの項目数）：Literata 600、表形式の数字（tabular figures）。デスクトップでは1.25rem〜1.875rem、スマートフォンでは時間ごとのKp値と時間が1rem、集合時刻が1.5remになる。
日付：ヒーローとボードではLiterata 500、夜の一覧では600。気温：Literata 400、5.75rem（1080px未満では4.5rem、スマートフォンでは4.25rem）
曜日と「Best window」の語：Literata italic 400
本文：Public Sans 400、1.0625rem、line-height 1.55。16px未満の文字は使わない。

LAYOUT:
- 12列のグリッドを一つ。最大幅は約1120px、セクション間は約128px（1080px未満では104px、スマートフォンでは88px）。
- 1pxの線の下にページバーを置く：運営会社名、各セクションへのリンク（1080px未満では非表示）、現地時刻と気温。
- ヒーロー：2pxの罫線の下、最初の3列に日付、残りの9列に見出し。1080px未満では見出しが全幅を使い、日付はその下に置く。その下に予報帯を置く。時間ごとのKp指数を0〜7の目盛りの棒グラフで示し、最適な時間帯を印す。2pxの罫線の上に時間軸を置き、時間ごとに雲量を示す小さな斜線の正方形を一つずつ置く。そのあと短い段落を三つ置く。
- 出発ボード：その夜に出発するツアーを罫線付きの行で並べる。集合時刻、ツアーと集合場所、所要時間、細いメーター付きの残席、料金を入れる。行を選ぶと、その下に予約欄が開く。
- 服装：その夜の気温を大きな文字で示し、運営会社が貸し出す品を持ち物チェックリストの横に置く。
- これからの7夜を7列で並べる。各列には、雲量に応じて斜線を引いた空の正方形を置く。夜を選ぶと、その下の要約と出発ボードが更新される。
- 860px未満ではボードの行を縦に積み、スマートフォンでは7夜が行に変わる。チャートは棒を残し、時間軸の列は省く。

COMPONENTS:
- ボードの行は、行の形で描いたラジオボタンにする。選んでいる行は、左端の4pxの緑の棒と、より濃い輪郭線で示す。満席のツアーはグレーで、選べない。ただし、訪問者自身の予約で埋まったツアーはインクの色のままで、選ぶとその予約をもう一度表示できる。
- 予約欄：その夜の出発情報、人数ステッパー（44pxの正方形ボタン、1名から残席数まで）、合計、三つの入力欄（お名前、メールアドレス、携帯電話番号）とそれぞれの下のエラー、そして席数と料金を表示する濃い単色のボタン一つ。
- チェックリスト：28pxの正方形のボックス。準備済みの項目は緑で塗りつぶされ、名前に緑の取り消し線が入る。
- 夜の選択：aria-pressedを使うトグルボタン。押された状態は常に一つだけで、上端に沿った緑の棒で示す（スマートフォンでは左端に沿って）。
- 線：不透明度0.26の1px。2pxの濃い罫線で、日付、ボード、時間軸、準備リスト、夜の一覧を区切る。角はすべて直角。

MOTION:
- サイトのアンカーへのなめらかなスクロールを除き、動くのはオーロラの帯だけ。ホバー時の色の変化は160msにする。
- prefers-reduced-motionのときは、帯を静止させる。

FORBIDDEN:
- グラデーションの背景、グラデーションの文字、発光するボタンやパネル
- ガラス調のパネルと、コンテンツ上の背景ぼかし
- カード、ピル型、チップ、角丸
- 見出しの上の小さなラベル、字間を広げた全大文字のラベル
- 星空、山のシルエット、その他の描かれた風景
- スマートフォンで横にスクロールする表

OUTPUT:
1) CSSカスタムプロパティ
2) セマンティックなHTMLとCSS：ツアーはラジオの行、フォームは各入力欄の横にエラーを表示する実際のフォーム、チェックボックス、aria-pressedのトグルボタン
3) 320pxまで対応するレスポンシブレイアウト。横スクロールなし
4) 見えるフォーカス表示とreduced-motionへの対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

// A translated sentence with {slots}, where a slot takes an element such as <b>.
function phrase(text: string, slots: Record<string, ReactNode>): ReactNode[] {
  return text
    .split(/(\{\w+\})/)
    .filter(Boolean)
    .map((part, index) => {
      const slot = part.match(/^\{(\w+)\}$/)?.[1];
      return <Fragment key={index}>{slot ? slots[slot] : part}</Fragment>;
    });
}

const money = (amount: number) => amount.toLocaleString('en-US');
const priced = (amount: number) => `${CURRENCY} ${money(amount)}`;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fieldError(field: Field, value: string): boolean {
  const text = value.trim();
  if (field === 'name') return text === '';
  if (field === 'email') return !EMAIL.test(text);
  const digits = text.replace(/\D/g, '');
  return !/^\+?[\d\s().-]+$/.test(text) || digits.length < 8 || digits.length > 15;
}

interface Booking {
  night: number;
  tour: TourId;
  guests: number;
  email: string;
  phone: string;
}

const vars = (values: Record<string, string | number>) => values as CSSProperties;

export function PortedAuroraGradientPage({ lang }: PortedStylePageProps) {
  const [night, setNight] = useState(0);
  const [tourId, setTourId] = useState<TourId | null>('minibus');
  const [guests, setGuests] = useState(2);
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, boolean>>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const focusDone = useRef(false);
  const [packed, setPacked] = useState<boolean[]>(() => PACK.map((_, index) => index === 0));
  const inputs = useRef<Partial<Record<Field, HTMLInputElement | null>>>({});
  const doneRef = useRef<HTMLDivElement>(null);
  const t = (text: Tri) => text[lang];

  // The form leaves once the booking is in; focus goes to the confirmation that replaces it.
  useEffect(() => {
    if (!focusDone.current) return;
    focusDone.current = false;
    doneRef.current?.focus();
  }, [bookings]);

  const seatsLeft = (nightIndex: number, id: TourId) =>
    NIGHTS[nightIndex].seats[id] - bookings.filter((item) => item.night === nightIndex && item.tour === id).reduce((sum, item) => sum + item.guests, 0);
  const bookingFor = (nightIndex: number, id: TourId) => [...bookings].reverse().find((item) => item.night === nightIndex && item.tour === id);

  const chooseTour = (id: TourId) => {
    setTourId(id);
    setGuests((count) => Math.max(1, Math.min(count, seatsLeft(night, id))));
    setErrors({});
  };

  // A tour that is full on the new night closes; otherwise the party size is kept within its seats.
  const chooseNight = (index: number) => {
    setNight(index);
    if (tourId === null) return;
    const left = seatsLeft(index, tourId);
    if (left === 0 && !bookingFor(index, tourId)) setTourId(null);
    else setGuests((count) => Math.max(1, Math.min(count, left)));
    setErrors({});
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (tourId === null) return;
    const found = Object.fromEntries(FIELDS.map((field) => [field, fieldError(field, values[field])])) as Record<Field, boolean>;
    setErrors(found);
    const first = FIELDS.find((field) => found[field]);
    if (first) {
      inputs.current[first]?.focus();
      return;
    }
    focusDone.current = true;
    setBookings((list) => [...list, { night, tour: tourId, guests, email: values.email.trim(), phone: values.phone.trim() }]);
  };

  const current = NIGHTS[night];
  const tonightOpen = TOURS.filter((tour) => seatsLeft(0, tour.id) > 0).length;
  const openTours = TOURS.filter((tour) => seatsLeft(night, tour.id) > 0);
  const seatsTotal = (index: number) => TOURS.reduce((sum, tour) => sum + seatsLeft(index, tour.id), 0);
  const seatPhrase = (n: number) => phrase(t(n === 1 ? NIGHTS_COPY.seatsOne : NIGHTS_COPY.seatsMany), { n: <b>{n}</b> });
  const fromPrice = openTours.length ? Math.min(...openTours.map((tour) => tour.price)) : 0;
  const toursLine = openTours.length === 0
    ? t(NIGHTS_COPY.noTours)
    : fill(t(openTours.length === TOURS.length ? NIGHTS_COPY.allTours : NIGHTS_COPY.someTours), {
      n: openTours.length,
      seats: seatsTotal(night),
      price: priced(fromPrice),
    });
  const packedCount = packed.filter(Boolean).length;

  const renderMore = (tour: Tour) => {
    const left = seatsLeft(night, tour.id);
    const booking = bookingFor(night, tour.id);
    const total = priced(guests * tour.price);
    const txt = (
      <div className="pn-more__txt">
        <p>{t(night === 0 && tour.tonight ? tour.tonight : tour.plan)}</p>
        <p>{t(tour.included)}</p>
      </div>
    );

    if (booking) {
      return (
        <div className="pn-more__grid">
          {txt}
          <div className="pn-done" ref={doneRef} tabIndex={-1}>
            <p>
              <b>
                {fill(t(booking.guests === 1 ? BOOK.bookedOne : BOOK.bookedMany), { n: booking.guests, time: tour.time, date: t(current.full) })}
              </b>{' '}
              {fill(t(BOOK.meet), { place: t(tour.pickup) })}
            </p>
            <p>{fill(t(BOOK.sent), { email: booking.email, phone: booking.phone })}</p>
          </div>
        </div>
      );
    }

    return (
      <form className="pn-more__grid" onSubmit={handleSubmit} noValidate aria-label={fill(t(BOOK.form), { tour: t(tour.name) })}>
        {txt}
        <div className="pn-book">
          <div className="pn-guests" role="group" aria-labelledby="pn-guests-label">
            <span id="pn-guests-label">{t(BOOK.guests)}</span>
            <button
              type="button"
              aria-label={t(BOOK.fewer)}
              aria-disabled={guests <= 1}
              onClick={() => setGuests((count) => Math.max(1, count - 1))}
            >
              −
            </button>
            <output aria-labelledby="pn-guests-label">{guests}</output>
            <button
              type="button"
              aria-label={t(BOOK.more)}
              aria-disabled={guests >= left}
              onClick={() => setGuests((count) => Math.min(left, count + 1))}
            >
              +
            </button>
          </div>
          <p className="pn-total" aria-live="polite">
            {phrase(t(guests === 1 ? BOOK.totalOne : BOOK.totalMany), { total: <b>{total}</b>, n: guests })}
          </p>
        </div>
        <div className="pn-fields">
          {FIELDS.map((field) => {
            const copy = FIELD_COPY[field];
            const invalid = Boolean(errors[field]);
            return (
              <div className="pn-field" key={field}>
                <label htmlFor={`pn-${field}`}>{t(copy.label)}</label>
                <input
                  ref={(node) => { inputs.current[field] = node; }}
                  id={`pn-${field}`}
                  type={copy.type}
                  autoComplete={copy.autoComplete}
                  value={values[field]}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? `pn-${field}-error` : undefined}
                  onChange={(event) => {
                    const next = event.target.value;
                    setValues((all) => ({ ...all, [field]: next }));
                    if (invalid) setErrors((all) => ({ ...all, [field]: false }));
                  }}
                />
                {invalid ? <p className="pn-field__error" id={`pn-${field}-error`} role="alert">{t(copy.error)}</p> : null}
              </div>
            );
          })}
        </div>
        <div className="pn-submit">
          <p>{t(BOOK.note)}</p>
          <button className="pn-btn" type="submit">
            {fill(t(guests === 1 ? BOOK.submitOne : BOOK.submitMany), { n: guests, total })}
          </button>
        </div>
      </form>
    );
  };

  return (
    <FusionShell
      fusionId="aurora-gradient"
      lang={lang}
      tone="dark"
      accent="#7be0a3"
      prev={{ href: '/pages/liquid-metal.html', label: 'Liquid Metal' }}
      next={{ href: '/pages/zen-minimalism.html', label: 'Zen Minimalism' }}
      prompts={PROMPTS}
    >
      <div className="pn">
        <div className="pn-bar">
          <p className="pn-mark">{OPERATOR}</p>
          <nav className="pn-bar__nav" aria-label={t(BAR.nav)}>
            <a href="#pn-tonight">{t(BAR.tonight)}</a>
            <a href="#pn-tours">{t(BAR.tours)}</a>
            <a href="#pn-wear">{t(BAR.wear)}</a>
            <a href="#pn-nights">{t(BAR.nights)}</a>
          </nav>
          <p className="pn-clock">
            <time dateTime={NOW}>{NOW}</time>
            <span className="pn-where">{` ${t(BAR.where)}`}</span>, {NOW_TEMP}
          </p>
        </div>

        <section className="pn-hero" id="pn-tonight" aria-labelledby="pn-title">
          <div className="pn-hero__top pn-grid">
            <h1 id="pn-title">{t(HERO.title)}</h1>
            <div className="pn-when">
              <time dateTime={NIGHTS[0].iso}>
                <span className="pn-wday">{t(HERO.weekday)}</span> <span className="pn-wdate">{t(HERO.date)}</span>
              </time>
              <p>{t(HERO.dark)}</p>
              <a href="#pn-tours" onClick={() => chooseNight(0)}>{t(HERO.link)}</a>
            </div>
          </div>

          <div className="pn-band">
            <figure className="pn-fc" aria-label={t(CHART.label)}>
              <ol className="pn-scale" aria-hidden="true">
                {SCALE.map((k) => <li key={k} style={vars({ '--k': k })}>Kp {k}</li>)}
              </ol>
              <span className="pn-rowlabel pn-rowlabel--kp" aria-hidden="true">{t(CHART.kpIndex)}</span>
              <div className="pn-gridlines" aria-hidden="true" />
              <div
                className="pn-window"
                style={vars({
                  '--wl': `${WINDOW.left * 100}%`,
                  '--ww': `${WINDOW.width * 100}%`,
                  // The Kp of the hours the window's edges fall in: each edge line stops above that hour's figure.
                  '--kl': HOURS[Math.floor(WINDOW.left * HOURS.length)].kp,
                  '--kr': HOURS[Math.floor((WINDOW.left + WINDOW.width) * HOURS.length)].kp,
                })}
              >
                <p>
                  <i>{t(CHART.window)}</i> <b>{WINDOW.from}–{WINDOW.to}</b>
                </p>
              </div>
              <ol className="pn-hours">
                {HOURS.map((hour) => (
                  <li key={hour.h} className={hour.best ? 'is-best' : undefined}>
                    <span className="pn-h">{hour.h}<span className="pn-mm">:00</span></span>
                    <span className="pn-k" style={vars({ '--k': hour.kp })}>
                      <b><span className="pn-sr">Kp </span>{hour.kp.toFixed(1)}</b>
                      <i aria-hidden="true" />
                    </span>
                    <span className="pn-c">
                      <i className="pn-sky" style={vars({ '--c': hour.cloud })} aria-hidden="true" />
                      {hour.cloud}<span className="pn-pc">%</span><span className="pn-sr"> {t(CHART.cloudAfter)}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <span className="pn-rowlabel pn-rowlabel--cloud" aria-hidden="true">
                <span className="pn-wide">{t(CHART.cloud)}</span>
                <span className="pn-narrow">{t(CHART.cloudPhone)}</span>
              </span>
            </figure>
            <div className="pn-caption pn-grid">
              <p><b>{t(CHART.lead)}</b>{t(CHART.leadRest)}</p>
              <p>{t(CHART.enough)}</p>
              <p>{fill(t(CHART.seats), { n: tonightOpen })}</p>
            </div>
          </div>
        </section>

        <section className="pn-section" id="pn-tours" aria-labelledby="pn-tours-title">
          <div className="pn-head pn-grid">
            <h2 id="pn-tours-title">{night === 0 ? t(BOARD.titleTonight) : fill(t(BOARD.titleOn), { day: t(current.day) })}</h2>
            <p>{t(BOARD.intro)}</p>
          </div>

          <div className="pn-board">
            <div className="pn-board__top">
              <p className="pn-board__date"><time dateTime={current.iso}>{t(current.full)}</time></p>
              <a href="#pn-nights">{t(BOARD.otherNights)}</a>
            </div>
            <div className="pn-cols" aria-hidden="true">
              <span>{t(BOARD.pickup)}</span>
              <span>{t(BOARD.tour)}</span>
              <span>{t(BOARD.duration)}</span>
              <span>{t(BOARD.seatsLeft)}</span>
              <span>{t(BOARD.price)}</span>
            </div>
            <div role="radiogroup" aria-label={fill(t(BOARD.group), { date: t(current.full) })}>
              {TOURS.map((tour) => {
                const left = seatsLeft(night, tour.id);
                const open = tourId === tour.id;
                // A full tour cannot be chosen, unless the visitor's own booking filled it:
                // then choosing it opens that booking's confirmation again.
                const locked = left === 0 && !bookingFor(night, tour.id);
                return (
                  <div key={tour.id} className={`pn-dep${open ? ' is-on' : ''}${left === 0 ? ' is-full' : ''}${locked ? ' is-locked' : ''}`}>
                    <label className="pn-dep__row">
                      <input
                        type="radio"
                        name="pn-tour"
                        value={tour.id}
                        checked={open}
                        disabled={locked && !open}
                        onChange={() => chooseTour(tour.id)}
                      />
                      <span className="pn-t">{tour.time}</span>
                      <span className="pn-tour">
                        <b>{t(tour.name)}</b>
                        <small>{t(tour.board ?? tour.pickup)}</small>
                      </span>
                      <span className="pn-facts">
                        <span className="pn-dur">
                          <b>{tour.hours}</b> <span aria-hidden="true">{t(BOARD.h)}</span><span className="pn-sr">{t(BOARD.hours)}</span>
                        </span>
                        <span className="pn-seats">
                          {left > 0 ? (
                            <>
                              <b>{left}</b> {fill(t(BOARD.of), { cap: tour.capacity })}<span className="pn-m"> {t(BOARD.left)}</span>
                            </>
                          ) : (
                            <b>{t(BOARD.full)}</b>
                          )}
                          <i className="pn-meter" style={vars({ '--f': left / tour.capacity })} aria-hidden="true" />
                        </span>
                        <span className="pn-price">{CURRENCY} <b>{money(tour.price)}</b></span>
                      </span>
                    </label>
                    {open ? <div className="pn-more">{renderMore(tour)}</div> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="pn-section pn-wear pn-grid" id="pn-wear" aria-labelledby="pn-wear-title">
          <div className="pn-wear__side">
            <h2 id="pn-wear-title">{t(WEAR.title)}</h2>
            <p className="pn-temp">
              <b><span className="pn-minus">{WEAR.temp.slice(0, 1)}</span>{WEAR.temp.slice(1)}<small>{WEAR.unit}</small></b>
              <span>{t(WEAR.tempNote)}</span>
            </p>
            <div className="pn-lend">
              <h3>{t(WEAR.lend)}</h3>
              <dl>
                {LEND.map(([item, size]) => (
                  <div key={item.en}><dt>{t(item)}</dt><dd>{t(size)}</dd></div>
                ))}
              </dl>
            </div>
          </div>

          <div className="pn-wear__list">
            <div className="pn-list__head">
              <h3 id="pn-bring">{t(WEAR.bring)}</h3>
              <p>{phrase(t(WEAR.packed), { n: <b>{packedCount}</b>, total: PACK.length })}</p>
            </div>
            <ul className="pn-check" aria-labelledby="pn-bring">
              {PACK.map((item, index) => (
                <li key={item.name.en}>
                  <label>
                    <input
                      type="checkbox"
                      checked={packed[index]}
                      onChange={() => setPacked((list) => list.map((value, at) => (at === index ? !value : value)))}
                    />
                    <span className="pn-box" aria-hidden="true" />
                    <span className="pn-it"><b>{t(item.name)}</b><span>{t(item.note)}</span></span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pn-section" id="pn-nights" aria-labelledby="pn-nights-title">
          <div className="pn-head pn-grid">
            <h2 id="pn-nights-title">{t(NIGHTS_COPY.title)}</h2>
            <p>{t(NIGHTS_COPY.intro)}</p>
          </div>

          <div className="pn-strip" role="group" aria-label={t(NIGHTS_COPY.choose)}>
            {NIGHTS.map((item, index) => (
              <button
                key={item.iso}
                type="button"
                className="pn-night"
                aria-pressed={index === night}
                onClick={() => chooseNight(index)}
              >
                <span className="pn-wd">
                  <span className="pn-long">{t(item.day)}</span>
                  <span className="pn-short" aria-hidden="true">{t(item.short)}</span>
                </span>
                <span className="pn-dd">{t(item.dd)}</span>
                <i className="pn-sky" style={vars({ '--c': item.cloud })} aria-hidden="true" />
                <span className="pn-cc"><b>{item.cloud}%</b><span className="pn-w"> {t(CHART.cloudAfter)}</span></span>
                <span className="pn-kp">Kp <b>{item.kp.toFixed(1)}</b></span>
                <span className="pn-left">{seatPhrase(seatsTotal(index))}</span>
              </button>
            ))}
          </div>

          <div className="pn-picked pn-grid">
            <p aria-live="polite">
              <b>{t(current.full)}</b> {t(current.sky)} {toursLine}
            </p>
            <a href="#pn-tours">{night === 0 ? t(NIGHTS_COPY.linkTonight) : fill(t(NIGHTS_COPY.linkOn), { day: t(current.day) })}</a>
          </div>
        </section>

        <footer className="pn-end pn-grid">
          <p>{t(FOOTER.office)}</p>
          <p>{t(FOOTER.promise)}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
