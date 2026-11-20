import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedMidnightNoirPage.css';

// The page of Oberlin & Søn, a watch repair workshop in Copenhagen, in the Midnight
// Noir style. Every measured value (rate, amplitude, prices, job numbers, slot times)
// is set in Bodoni Moda on its optical-size axis; Albert Sans reads the words around
// the numbers. Components come from the workshop: the timegrapher readout with its
// trace and five timing positions, a ruled price list, the job ticket with its six
// repair steps and the counter's appointment book. Gold marks only what is being
// measured now and the active choice.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const NAME = 'Oberlin & Søn';
const ADDRESS = 'Store Kongensgade 72, 1264 København K';
const PHONE = '+45 33 14 08 61';

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

// Puts one value into a sentence as a node, so it can be set in its own weight.
const place = (text: string, key: string, node: ReactNode): ReactNode[] =>
  text.split(`{${key}}`).flatMap((part, index) => (index === 0 ? [part] : [<span key={index}>{node}</span>, part]));

// A plus or minus in front of a Bodoni figure. The text cut gives the sign a stem.
function Signed({ value }: { value: number }) {
  return (
    <>
      <span className="os-sign">{value < 0 ? '−' : '+'}</span>
      {Math.abs(value)}
    </>
  );
}

const HEAD = {
  nav: { en: 'Workshop', ko: '작업장', ja: '工房' },
  service: { en: 'Service and prices', ko: '서비스와 요금', ja: 'サービスと料金' },
  status: { en: 'Repair status', ko: '수리 현황', ja: '修理状況' },
  handIn: { en: 'Hand in a watch', ko: '시계 맡기기', ja: '時計のお預け' },
  book: { en: 'Book a hand-in', ko: '맡기기 예약', ja: 'お預けの予約' },
  bookShort: { en: 'Book', ko: '예약', ja: '予約' },
  title: { en: 'Mechanical watch service in Copenhagen', ko: '코펜하겐의 기계식 시계 서비스', ja: 'コペンハーゲンの機械式時計サービス' },
} satisfies Record<string, Tri>;

type PositionId = 'dial-up' | 'dial-down' | 'crown-down' | 'crown-left' | 'crown-up';

interface Position {
  id: PositionId;
  name: Tri;
  /** Seconds a day gained (+) or lost (−) in this position. */
  rate: number;
  amplitude: number;
  beatError: number;
  /** Lying flat (dial up or down) or standing on its edge. */
  flat: boolean;
  /** The rate in words. {amount} is set in a heavier weight. */
  summary: Tri;
  amount: Tri;
  measuring: Tri;
}

const POSITIONS: Position[] = [
  {
    id: 'dial-up',
    name: { en: 'Dial up', ko: '문자판 위', ja: '文字盤上' },
    rate: 2,
    amplitude: 286,
    beatError: 0.2,
    flat: true,
    summary: { en: 'Gains {amount} dial up.', ko: '문자판 위 자세에서 {amount} 빨라집니다.', ja: '文字盤上では{amount}進みます。' },
    amount: { en: 'two seconds a day', ko: '하루 2초', ja: '1日2秒' },
    measuring: { en: 'Measuring dial up, 42 of 60 seconds', ko: '문자판 위 측정 중, 60초 중 42초', ja: '文字盤上を測定中、60秒中42秒' },
  },
  {
    id: 'dial-down',
    name: { en: 'Dial down', ko: '문자판 아래', ja: '文字盤下' },
    rate: 3,
    amplitude: 291,
    beatError: 0.2,
    flat: true,
    summary: { en: 'Gains {amount} dial down.', ko: '문자판 아래 자세에서 {amount} 빨라집니다.', ja: '文字盤下では{amount}進みます。' },
    amount: { en: 'three seconds a day', ko: '하루 3초', ja: '1日3秒' },
    measuring: { en: 'Measuring dial down, 42 of 60 seconds', ko: '문자판 아래 측정 중, 60초 중 42초', ja: '文字盤下を測定中、60秒中42秒' },
  },
  {
    id: 'crown-down',
    name: { en: 'Crown down', ko: '용두 아래', ja: '竜頭下' },
    rate: -1,
    amplitude: 262,
    beatError: 0.3,
    flat: false,
    summary: { en: 'Loses {amount} crown down.', ko: '용두 아래 자세에서 {amount} 느려집니다.', ja: '竜頭下では{amount}遅れます。' },
    amount: { en: 'one second a day', ko: '하루 1초', ja: '1日1秒' },
    measuring: { en: 'Measuring crown down, 42 of 60 seconds', ko: '용두 아래 측정 중, 60초 중 42초', ja: '竜頭下を測定中、60秒中42秒' },
  },
  {
    id: 'crown-left',
    name: { en: 'Crown left', ko: '용두 왼쪽', ja: '竜頭左' },
    rate: 1,
    amplitude: 258,
    beatError: 0.3,
    flat: false,
    summary: { en: 'Gains {amount} crown left.', ko: '용두 왼쪽 자세에서 {amount} 빨라집니다.', ja: '竜頭左では{amount}進みます。' },
    amount: { en: 'one second a day', ko: '하루 1초', ja: '1日1秒' },
    measuring: { en: 'Measuring crown left, 42 of 60 seconds', ko: '용두 왼쪽 측정 중, 60초 중 42초', ja: '竜頭左を測定中、60秒中42秒' },
  },
  {
    id: 'crown-up',
    name: { en: 'Crown up', ko: '용두 위', ja: '竜頭上' },
    rate: 4,
    amplitude: 255,
    beatError: 0.4,
    flat: false,
    summary: { en: 'Gains {amount} crown up.', ko: '용두 위 자세에서 {amount} 빨라집니다.', ja: '竜頭上では{amount}進みます。' },
    amount: { en: 'four seconds a day', ko: '하루 4초', ja: '1日4秒' },
    measuring: { en: 'Measuring crown up, 42 of 60 seconds', ko: '용두 위 측정 중, 60초 중 42초', ja: '竜頭上を測定中、60秒中42秒' },
  },
];

const METER = {
  label: { en: 'Timegrapher reading', ko: '타임그래퍼 측정값', ja: 'タイムグラファーの測定値' },
  job: { en: 'Job 2614', ko: '접수 2614', ja: '受付 2614' },
  watch: {
    en: 'Tudor Prince Date from 1989, ETA 2824-2, after a full service',
    ko: 'Tudor Prince Date 1989년형, ETA 2824-2, 오버홀 후',
    ja: 'Tudor Prince Date 1989年製、ETA 2824-2、オーバーホール後',
  },
  unit: { en: 's/d', ko: '초/일', ja: '秒/日' },
  perDay: { en: 'seconds a day', ko: '하루 기준 초', ja: '1日あたりの秒数' },
  overall: {
    en: 'Across all five positions it averages +1.8 with a spread of 5 seconds, inside our limit of 8.',
    ko: '다섯 자세 전체의 평균은 +1.8초이며, 편차는 5초로 우리 기준인 8초 이내입니다.',
    ja: '5つの姿勢の平均は+1.8秒、ばらつきは5秒で、当工房の基準である8秒以内です。',
  },
  amplitude: { en: 'Amplitude', ko: '진폭', ja: '振り角' },
  amplitudeFlat: {
    en: 'How far the balance swings. Lying flat, 270° to 310° is healthy.',
    ko: '밸런스가 얼마나 흔들리는지 나타냅니다. 평평하게 놓았을 때 270°에서 310°면 정상입니다.',
    ja: 'テンプの振れ幅を示します。平置きでは270°から310°が正常です。',
  },
  amplitudeEdge: {
    en: 'How far the balance swings. On its edge, 250° to 290° is healthy.',
    ko: '밸런스가 얼마나 흔들리는지 나타냅니다. 세워 놓았을 때 250°에서 290°면 정상입니다.',
    ja: 'テンプの振れ幅を示します。縦置きでは250°から290°が正常です。',
  },
  beatError: { en: 'Beat error', ko: '비트 에러', ja: 'ビートエラー' },
  beatErrorNote: {
    en: 'The difference between tick and tock. Under 0.5 ms passes.',
    ko: '틱과 탁의 차이입니다. 0.5ms 미만이면 통과입니다.',
    ja: 'ティックとタックの差です。0.5ms未満なら合格です。',
  },
  beatRate: { en: 'Beat rate', ko: '비트 레이트', ja: 'ビートレート' },
  beatRateNote: { en: 'Eight beats a second, set by the calibre.', ko: '초당 8비트, 칼리버에 따라 정해집니다.', ja: '毎秒8ビート、キャリバーによって決まります。' },
  traceGains: {
    en: 'Trace of tick and tock over the first 42 seconds, rising because the watch gains in this position. The scale runs from 2 ms ahead to 2 ms behind across one minute.',
    ko: '처음 42초 동안의 틱과 탁 궤적입니다. 이 자세에서 시계가 빨라서 선이 올라갑니다. 세로 눈금은 1분 기준으로 +2ms에서 −2ms까지입니다.',
    ja: '最初の42秒間のティックとタックの軌跡です。この姿勢では時計が進むため線が上がります。目盛りは1分間で+2msから−2msまでです。',
  },
  traceLoses: {
    en: 'Trace of tick and tock over the first 42 seconds, falling because the watch loses in this position. The scale runs from 2 ms ahead to 2 ms behind across one minute.',
    ko: '처음 42초 동안의 틱과 탁 궤적입니다. 이 자세에서 시계가 느려서 선이 내려갑니다. 세로 눈금은 1분 기준으로 +2ms에서 −2ms까지입니다.',
    ja: '最初の42秒間のティックとタックの軌跡です。この姿勢では時計が遅れるため線が下がります。目盛りは1分間で+2msから−2msまでです。',
  },
  legendGains: {
    en: 'The upper line is the tick and the lower line the tock. Both climb because the watch runs ahead; a watch keeping perfect time would draw them flat.',
    ko: '위쪽 선은 틱, 아래쪽 선은 탁입니다. 시계가 빨리 가기 때문에 두 선이 모두 올라갑니다. 정확한 시계라면 두 선이 수평으로 그려집니다.',
    ja: '上の線がティック、下の線がタックです。時計が進むため両方の線が上がります。正確に動く時計では線は水平になります。',
  },
  legendLoses: {
    en: 'The upper line is the tick and the lower line the tock. Both fall because the watch runs behind in this position; a watch keeping perfect time would draw them flat.',
    ko: '위쪽 선은 틱, 아래쪽 선은 탁입니다. 이 자세에서 시계가 늦게 가기 때문에 두 선이 모두 내려갑니다. 정확한 시계라면 두 선이 수평으로 그려집니다.',
    ja: '上の線がティック、下の線がタックです。この姿勢では時計が遅れるため両方の線が下がります。正確に動く時計では線は水平になります。',
  },
  positions: { en: 'Timing position', ko: '측정 자세', ja: '測定姿勢' },
  announce: {
    en: '{summary} Amplitude {amplitude}°, beat error {beatError} ms.',
    ko: '{summary} 진폭 {amplitude}°, 비트 에러 {beatError}ms.',
    ja: '{summary} 振り角 {amplitude}°、ビートエラー {beatError}ms。',
  },
} satisfies Record<string, Tri>;

// The trace as the timegrapher draws it, 42 of 60 seconds in. The view box is 600 wide
// (10 units a second) and 200 high, from 2 ms ahead at the top to 2 ms behind at the bottom.
const TRACE_SECONDS = 42;
const UNITS_PER_MS = 50;

function drawTrace(rate: number, beatError: number, seed: number) {
  // A seeded jitter, so the page draws the same lines on every render.
  let state = seed;
  const jitter = () => {
    state = (state * 48271) % 2147483647;
    return (state / 2147483647 - 0.5) * 3;
  };
  // A watch that gains `rate` seconds a day runs rate / 86.4 ms ahead each second.
  const rise = ((rate * TRACE_SECONDS) / 86.4) * UNITS_PER_MS;
  const start = 100 + rise / 2;
  const half = (beatError * UNITS_PER_MS) / 2;
  const tick: string[] = [];
  const tock: string[] = [];
  const width = TRACE_SECONDS * 10;
  for (let x = 0; x <= width; x += 5) {
    const y = start - rise * (x / width);
    tick.push(`${x},${(y - half + jitter()).toFixed(1)}`);
    tock.push(`${x},${(y + half + jitter()).toFixed(1)}`);
  }
  return { tick: tick.join(' '), tock: tock.join(' '), tip: ((start - rise - half) / 200) * 100 };
}

const TRACES = Object.fromEntries(
  POSITIONS.map((position, index) => [position.id, drawTrace(position.rate, position.beatError, 1187 + index * 7919)]),
) as Record<PositionId, ReturnType<typeof drawTrace>>;

const SCALE = ['+2 ms', '0', '−2 ms'];
const AXIS = ['0 s', '10', '20', '30', '40', '50', '60 s'];

const SERVICE = {
  title: { en: 'Service and prices', ko: '서비스와 요금', ja: 'サービスと料金' },
  note: {
    en: 'Two watchmakers work at the bench and take about forty watches a month, in the order they arrive. A full service carries a two-year guarantee.',
    ko: '시계 기사 두 명이 작업대에서 일하며, 한 달에 약 40개를 도착한 순서대로 접수합니다. 전체 오버홀에는 2년 보증이 붙습니다.',
    ja: '時計技師2名が作業台で作業し、月に約40本を到着順にお預かりします。オーバーホールには2年間の保証が付きます。',
  },
  colService: { en: 'Service', ko: '서비스', ja: 'サービス' },
  colWork: { en: 'What is done', ko: '작업 내용', ja: '作業内容' },
  colTime: { en: 'Time', ko: '소요 시간', ja: '所要時間' },
  colPrice: { en: 'Price', ko: '가격', ja: '料金' },
  takes: { en: 'Takes', ko: '소요', ja: '所要' },
  from: { en: 'from', ko: '최저', ja: '最低' },
  rows: [
    {
      name: { en: 'Full service', ko: '전체 오버홀', ja: 'フルオーバーホール' },
      work: {
        en: 'The movement is taken apart, cleaned, oiled and put back together, then timed over two days in five positions. New gaskets and a water resistance test.',
        ko: '무브먼트를 분해해 세척하고 주유한 뒤 다시 조립합니다. 이틀 동안 다섯 자세에서 측정합니다. 가스켓을 새로 끼우고 방수 테스트를 합니다.',
        ja: 'ムーブメントを分解して洗浄、注油し、組み立て直します。2日間、5つの姿勢で計時します。ガスケットを新品に交換し、防水試験を行います。',
      },
      time: { en: '4 to 5 weeks', ko: '4~5주', ja: '4〜5週間' },
      from: true,
      price: '2,900',
      extra: { en: 'Chronographs from 4,100 DKK', ko: '크로노그래프 4,100 DKK부터', ja: 'クロノグラフは4,100 DKKから' } as Tri | null,
    },
    {
      name: { en: 'Regulation', ko: '조정', ja: '調整' },
      work: {
        en: 'For a watch that runs well but gains or loses. Rate and beat error are set on the timegrapher.',
        ko: '잘 돌아가지만 빨라지거나 느려지는 시계를 위한 작업입니다. 일차와 비트 에러를 타임그래퍼에서 맞춥니다.',
        ja: '作動は良好だが進みや遅れがある時計向けです。日差とビートエラーはタイムグラファーで調整します。',
      },
      time: { en: '30 minutes, while you wait', ko: '30분, 기다리는 동안', ja: '30分、お待ちの間に' },
      from: false,
      price: '450',
      extra: null,
    },
    {
      name: { en: 'Crystal replacement', ko: '유리 교체', ja: '風防交換' },
      work: {
        en: 'Acrylic crystals are pressed in. Sapphire is fitted with a new gasket and the case is pressure tested.',
        ko: '아크릴 유리는 눌러 끼웁니다. 사파이어 유리는 새 가스켓을 끼우고 케이스의 내압 테스트를 합니다.',
        ja: 'アクリル風防は押し込みで取り付けます。サファイア風防は新しいガスケットを付け、ケースの耐圧試験を行います。',
      },
      time: { en: '1 week', ko: '1주', ja: '1週間' },
      from: true,
      price: '650',
      extra: { en: 'Sapphire from 1,350 DKK', ko: '사파이어 1,350 DKK부터', ja: 'サファイアは1,350 DKKから' },
    },
    {
      name: { en: 'Strap', ko: '스트랩', ja: 'ストラップ' },
      work: {
        en: 'Calf, shell cordovan and canvas, 16 to 22 mm, fitted at the counter. Bring the buckle if you want to keep it.',
        ko: '송아지 가죽, 쉘 코도반, 캔버스 소재, 16~22mm. 창구에서 장착합니다. 버클을 그대로 쓰시려면 함께 가져와 주십시오.',
        ja: 'カーフ、シェルコードバン、キャンバス地、16〜22mm。カウンターで取り付けます。バックルを残したい場合はお持ちください。',
      },
      time: { en: '10 minutes', ko: '10분', ja: '10分' },
      from: true,
      price: '480',
      extra: null,
    },
  ],
};

const STATUS = {
  title: { en: 'Repair status', ko: '수리 현황', ja: '修理状況' },
  note: { en: 'Your job number is on the receipt you got at the counter.', ko: '접수 번호는 창구에서 받은 영수증에 적혀 있습니다.', ja: '受付番号は、カウンターでお渡しした領収書に記載されています。' },
  label: { en: 'Job number', ko: '접수 번호', ja: '受付番号' },
  submit: { en: 'Look up', ko: '조회', ja: '照会' },
  format: { en: 'Job numbers have four digits, like the one on your receipt.', ko: '접수 번호는 영수증에 적힌 것처럼 네 자리 숫자입니다.', ja: '受付番号は、領収書と同じ4桁の数字です。' },
  unknown: {
    en: 'There is no job {n} on the bench. Check the receipt, or call the counter on {phone}.',
    ko: '작업대에 접수 {n}번이 없습니다. 영수증을 확인하시거나 창구 전화 {phone}로 문의해 주십시오.',
    ja: '作業台に受付{n}はありません。領収書をご確認いただくか、カウンター {phone} までお電話ください。',
  },
  shown: { en: 'Showing job {n}, {watch}. Now: {step}.', ko: '접수 {n}번, {watch} 내용을 표시합니다. 현재 단계: {step}.', ja: '受付{n}、{watch}を表示しています。現在の段階：{step}。' },
  job: { en: 'Job {n}', ko: '접수 {n}번', ja: '受付 {n}' },
  steps: { en: 'Repair steps', ko: '수리 단계', ja: '修理工程' },
  work: { en: 'Work', ko: '작업', ja: '作業' },
  quote: { en: 'Quote', ko: '견적', ja: '見積もり' },
  collect: { en: 'Collect', ko: '찾는 곳', ja: '受け取り' },
  collectValue: {
    en: 'Store Kongensgade 72, or posted insured for 120 DKK',
    ko: 'Store Kongensgade 72 매장, 또는 120 DKK 보험 가입 우편 발송',
    ja: 'Store Kongensgade 72でのお受け取り、または120 DKKの保険付き郵送',
  },
};

const STEP_NAMES: Tri[] = [
  { en: 'Received', ko: '접수', ja: '受付' },
  { en: 'Assessed', ko: '진단', ja: '診断' },
  { en: 'Quoted', ko: '견적 제시', ja: '見積もり提示' },
  { en: 'In service', ko: '수리 중', ja: '作業中' },
  { en: 'Timing', ko: '측정', ja: '計時' },
  { en: 'Ready', ko: '준비 완료', ja: '完了' },
];

interface Job {
  watch: Tri;
  who: Tri;
  /** The step the watch is at now, 1 to 6. */
  now: number;
  steps: Array<{ date: string; when: Tri; body: Tri }>;
  note: Tri;
  by: Tri;
  work: Tri;
  quote: Tri;
}

const JOBS: Record<string, Job> = {
  '2598': {
    watch: { en: 'Omega Seamaster from 1966, calibre 552', ko: 'Omega Seamaster 1966년형, 칼리버 552', ja: 'Omega Seamaster 1966年製、キャリバー552' },
    who: { en: 'Handed in by Ida Kjær on 2 November', ko: 'Ida Kjær 님이 11월 2일에 맡기셨습니다.', ja: 'Ida Kjær様、11月2日にお預かり' },
    now: 4,
    steps: [
      { date: '2026-11-02', when: { en: '2 November', ko: '11월 2일', ja: '11月2日' }, body: { en: 'Checked in at the counter, caseback opened.', ko: '창구에서 접수하고 케이스백을 열었습니다.', ja: 'カウンターで受け付け、裏蓋を開けました。' } },
      { date: '2026-11-04', when: { en: '4 November', ko: '11월 4일', ja: '11月4日' }, body: { en: 'Amplitude 182°. The mainspring has set.', ko: '진폭 182°. 메인스프링이 변형되어 있습니다.', ja: '振り角182°。ゼンマイがへたっています。' } },
      { date: '2026-11-05', when: { en: '5 November', ko: '11월 5일', ja: '11月5日' }, body: { en: '3,350 DKK, accepted by text the same day.', ko: '3,350 DKK, 같은 날 문자로 승인받았습니다.', ja: '3,350 DKK、同日にテキストメッセージで承諾。' } },
      {
        date: '2026-11-10',
        when: { en: 'Since 10 November', ko: '11월 10일부터', ja: '11月10日から' },
        body: {
          en: 'Cleaned. The new mainspring is in and the movement is being put back together.',
          ko: '세척했습니다. 새 메인스프링을 끼웠고 무브먼트를 다시 조립하는 중입니다.',
          ja: '洗浄済み。新しいゼンマイを取り付け、ムーブメントを組み立て直しています。',
        },
      },
      { date: '2026-12-01', when: { en: 'From 1 December', ko: '12월 1일부터', ja: '12月1日から' }, body: { en: 'Two days on the timegrapher, five positions.', ko: '타임그래퍼에서 이틀 동안, 다섯 자세로 측정합니다.', ja: 'タイムグラファーで2日間、5つの姿勢で計時します。' } },
      { date: '2026-12-04', when: { en: 'About 4 December', ko: '12월 4일 무렵', ja: '12月4日頃' }, body: { en: 'We send a text when you can collect it.', ko: '찾으실 수 있게 되면 문자로 알려 드립니다.', ja: 'お受け取り可能になりましたら、テキストでお知らせします。' } },
    ],
    note: {
      en: 'The mainspring had lost its tension and the pivots of the balance were dry, which is why it ran at 182° when it came in. Everything is clean now and the new spring is fitted. I expect to put it on the timegrapher on Tuesday 1 December.',
      ko: '메인스프링이 장력을 잃었고 밸런스 피벗에 기름이 말라 있었습니다. 그래서 들어왔을 때 진폭이 182°였습니다. 지금은 모두 세척했고 새 스프링을 끼웠습니다. 12월 1일 화요일에 타임그래퍼에 올릴 예정입니다.',
      ja: 'ゼンマイの張力が落ち、テンプのピボットに油が切れていたため、入庫時の振り角は182°でした。現在は洗浄を終え、新しいゼンマイを取り付けています。12月1日火曜日にタイムグラファーにかける予定です。',
    },
    by: { en: 'Mads Oberlin, at the bench on 18 November', ko: 'Mads Oberlin, 11월 18일 작업대에서', ja: 'Mads Oberlin、11月18日に作業台にて' },
    work: { en: 'Full service, new mainspring', ko: '전체 오버홀, 메인스프링 교체', ja: 'オーバーホール、ゼンマイ交換' },
    quote: { en: '3,350 DKK, paid on collection', ko: '3,350 DKK, 찾을 때 결제', ja: '3,350 DKK、お受け取り時にお支払い' },
  },
  '2614': {
    watch: { en: 'Tudor Prince Date from 1989, ETA 2824-2', ko: 'Tudor Prince Date 1989년형, ETA 2824-2', ja: 'Tudor Prince Date 1989年製、ETA 2824-2' },
    who: { en: 'Handed in by Henrik Lund on 20 October', ko: 'Henrik Lund 님이 10월 20일에 맡기셨습니다.', ja: 'Henrik Lund様、10月20日にお預かり' },
    now: 5,
    steps: [
      { date: '2026-10-20', when: { en: '20 October', ko: '10월 20일', ja: '10月20日' }, body: { en: 'Checked in at the counter, caseback opened.', ko: '창구에서 접수하고 케이스백을 열었습니다.', ja: 'カウンターで受け付け、裏蓋を開けました。' } },
      { date: '2026-10-22', when: { en: '22 October', ko: '10월 22일', ja: '10月22日' }, body: { en: 'Gaining 11 seconds a day at 214°. The oil has dried.', ko: '하루 11초 빠르고 진폭은 214°입니다. 기름이 말라 있습니다.', ja: '1日11秒進み、振り角は214°。油が乾いていました。' } },
      { date: '2026-10-23', when: { en: '23 October', ko: '10월 23일', ja: '10月23日' }, body: { en: '2,900 DKK, accepted by email the next day.', ko: '2,900 DKK, 다음 날 이메일로 승인받았습니다.', ja: '2,900 DKK、翌日にメールで承諾。' } },
      { date: '2026-11-17', when: { en: '17 November', ko: '11월 17일', ja: '11月17日' }, body: { en: 'Cleaned, oiled and put back together. New crown and case gaskets.', ko: '세척하고 주유한 뒤 다시 조립했습니다. 용두와 케이스 가스켓을 새로 끼웠습니다.', ja: '洗浄、注油の後に組み立て直しました。竜頭とケースのガスケットを新品に交換しました。' } },
      { date: '2026-11-18', when: { en: 'Since 18 November', ko: '11월 18일부터', ja: '11月18日から' }, body: { en: 'On the timegrapher in five positions. Two days of readings so far.', ko: '타임그래퍼에서 다섯 자세로 측정 중입니다. 지금까지 이틀치 측정값이 있습니다.', ja: 'タイムグラファーで5つの姿勢を計測中です。現在までに2日分の測定値があります。' } },
      { date: '2026-11-24', when: { en: 'About 24 November', ko: '11월 24일 무렵', ja: '11月24日頃' }, body: { en: 'We send a text when you can collect it.', ko: '찾으실 수 있게 되면 문자로 알려 드립니다.', ja: 'お受け取り可能になりましたら、テキストでお知らせします。' } },
    ],
    note: {
      en: 'It came in gaining eleven seconds a day, with the old oil gone hard on the pallet stones. After the service it swings at 286° lying flat and keeps inside our limit in all five positions. I will leave it on the stand over the weekend and send the text on Tuesday.',
      ko: '입고될 때 하루 11초 빨랐고, 옛 기름이 팔레트 스톤에 굳어 있었습니다. 오버홀 후에는 평평하게 놓았을 때 진폭 286°로 움직이며, 다섯 자세 모두 우리 기준 안에 듭니다. 주말 동안 스탠드에 두고 화요일에 문자를 보내 드리겠습니다.',
      ja: '入庫時は1日11秒進んでおり、古い油がパレットストーンに固着していました。オーバーホール後は平置きで振り角286°となり、5つの姿勢すべてで基準内に収まっています。週末は計測スタンドに置き、火曜日にご連絡します。',
    },
    by: { en: 'Emil Oberlin, at the bench on 20 November', ko: 'Emil Oberlin, 11월 20일 작업대에서', ja: 'Emil Oberlin、11月20日に作業台にて' },
    work: { en: 'Full service, new gaskets', ko: '전체 오버홀, 가스켓 교체', ja: 'オーバーホール、ガスケット交換' },
    quote: { en: '2,900 DKK, paid on collection', ko: '2,900 DKK, 찾을 때 결제', ja: '2,900 DKK、お受け取り時にお支払い' },
  },
};

const TIMES = ['10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'];

interface Day {
  id: string;
  name: Tri;
  date: Tri;
  /** Times already booked. */
  taken: string[];
  /** Saturday closes for hand-ins at noon. */
  morningOnly?: boolean;
}

const DAYS: Day[] = [
  { id: 'tue', name: { en: 'Tuesday', ko: '화요일', ja: '火曜日' }, date: { en: '24 November', ko: '11월 24일', ja: '11月24日' }, taken: ['10:00', '11:00', '14:30'] },
  { id: 'wed', name: { en: 'Wednesday', ko: '수요일', ja: '水曜日' }, date: { en: '25 November', ko: '11월 25일', ja: '11月25日' }, taken: ['10:00', '10:30', '15:30'] },
  { id: 'thu', name: { en: 'Thursday', ko: '목요일', ja: '木曜日' }, date: { en: '26 November', ko: '11월 26일', ja: '11月26日' }, taken: ['10:00', '11:00', '14:00', '15:00'] },
  { id: 'fri', name: { en: 'Friday', ko: '금요일', ja: '金曜日' }, date: { en: '27 November', ko: '11월 27일', ja: '11月27日' }, taken: ['11:30'] },
  { id: 'sat', name: { en: 'Saturday', ko: '토요일', ja: '土曜日' }, date: { en: '28 November', ko: '11월 28일', ja: '11月28日' }, taken: ['10:00', '10:30', '11:30'], morningOnly: true },
];

const slotsOf = (day: Day) => (day.morningOnly ? TIMES.slice(0, 4) : TIMES);

// The counter offers the earliest free time first.
const FIRST_FREE = (() => {
  for (const day of DAYS) {
    const time = slotsOf(day).find((slot) => !day.taken.includes(slot));
    if (time) return `${day.id} ${time}`;
  }
  return '';
})();

const HAND_IN = {
  title: { en: 'Hand in a watch', ko: '시계 맡기기', ja: '時計のお預け' },
  note: {
    en: 'A hand-in takes about fifteen minutes at the counter. We open the caseback, put the movement on the timegrapher and send a written quote within three working days. Bring any papers and old parts you have.',
    ko: '맡기는 데 창구에서 약 15분이 걸립니다. 케이스백을 열어 무브먼트를 타임그래퍼에 올린 뒤 영업일 기준 3일 안에 견적서를 보내 드립니다. 서류나 기존 부품이 있으면 함께 가져와 주십시오.',
    ja: 'お預けには、カウンターで15分ほどかかります。裏蓋を開け、ムーブメントをタイムグラファーに載せ、3営業日以内に書面で見積もりをお送りします。書類や古い部品があればお持ちください。',
  },
  group: { en: 'Hand-in time, 24 to 28 November', ko: '맡기는 시간, 11월 24일~28일', ja: 'お預けの時間、11月24日〜28日' },
  taken: { en: 'taken', ko: '예약됨', ja: '予約済み' },
  saturday: { en: 'No hand-ins after 12:00 on Saturdays', ko: '토요일은 12:00 이후 접수하지 않습니다', ja: '土曜日は12:00以降のお預かりはありません' },
  bookNote: {
    en: 'Struck-through times are taken. The counter does not take hand-ins between 12:00 and 14:00.',
    ko: '취소선이 그어진 시간은 예약이 끝났습니다. 창구는 12:00부터 14:00까지 접수하지 않습니다.',
    ja: '取り消し線の時間は予約済みです。12:00から14:00までは、カウンターでお預かりしていません。',
  },
  lockedNote: {
    en: 'Your time is booked, so the book is closed. To move it, choose Change the time.',
    ko: '예약 시간이 정해져 장부를 닫았습니다. 시간을 바꾸시려면 \'시간 변경\'을 선택해 주십시오.',
    ja: 'お時間が予約済みのため、予約台帳を閉じています。変更するには「時間を変更」を選択してください。',
  },
  at: { en: 'at {time}', ko: '{time}', ja: '{time}に' },
  where: {
    en: 'At the counter, Store Kongensgade 72. We hold the time for ten minutes.',
    ko: '창구, Store Kongensgade 72에서 받습니다. 시간은 10분 동안 잡아 둡니다.',
    ja: 'カウンター、Store Kongensgade 72。お時間は10分間お取り置きします。',
  },
  name: { en: 'Name', ko: '이름', ja: 'お名前' },
  phone: { en: 'Phone', ko: '연락처', ja: '電話番号' },
  watch: { en: 'The watch and what it does', ko: '시계와 증상', ja: '時計と症状' },
  optional: { en: '(optional)', ko: '(선택)', ja: '（任意）' },
  nameError: { en: 'Write the name for the ticket.', ko: '접수증에 쓸 이름을 입력해 주십시오.', ja: '受付票に記載するお名前を入力してください。' },
  phoneError: {
    en: 'Write a phone number we can text, with at least eight digits.',
    ko: '문자를 받을 수 있는 전화번호를 8자리 이상으로 입력해 주십시오.',
    ja: 'テキストメッセージを送れる電話番号を、8桁以上で入力してください。',
  },
  submit: { en: 'Book {day} at {time}', ko: '{day} {time} 예약하기', ja: '{day} {time}で予約する' },
  doneTitle: { en: 'Thank you, {name}. The time is yours.', ko: '{name} 님, 감사합니다. 시간이 예약되었습니다.', ja: '{name}様、ありがとうございます。お時間を確保しました。' },
  doneBody: {
    en: 'We have sent the time and our address to {phone}. Bring the watch and any papers or old parts you have.',
    ko: '예약 시간과 주소를 {phone} 번호로 보내 드렸습니다. 시계와 서류, 기존 부품이 있으면 함께 가져와 주십시오.',
    ja: '予約時間と住所を{phone}にお送りしました。時計と書類、古い部品があればお持ちください。',
  },
  change: { en: 'Change the time', ko: '시간 변경', ja: '時間を変更' },
} satisfies Record<string, Tri>;

const FOOT = {
  hours: { en: 'Counter hours', ko: '창구 운영 시간', ja: 'カウンター営業時間' },
  hoursValue: {
    en: 'Tuesday to Friday 10:00 to 17:30, Saturday 10:00 to 14:00',
    ko: '화요일~금요일 10:00~17:30, 토요일 10:00~14:00',
    ja: '火曜日〜金曜日 10:00〜17:30、土曜日 10:00〜14:00',
  },
  phone: { en: 'Phone', ko: '연락처', ja: '電話番号' },
  phoneValue: { en: '{phone}, Tuesday to Friday from 10:00', ko: '{phone}, 화요일~금요일 10:00부터', ja: '{phone}、火曜日〜金曜日 10:00から' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Midnight Noir style: a near-black page in warm ivory type, with one antique gold that marks only what is being measured now and the choice that is active.

Pick a believable subject that lives on precise figures read in low light, such as a watch repair workshop, an observatory's open night or a cellar's tasting book, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Oberlin & Søn, a two-person watch repair workshop in Copenhagen: the timegrapher reading of a watch on the stand, the price list, the repair status of a job and the counter's appointment book.

TOKENS:
--bg: #0c0e12
--surface: #181a1f (opaque, for any menu that opens over the page)
--ink: #ece4d4
--muted: #a39e93
--dim: #7f7b73 (taken times, and the free times once a hand-in is booked)
--line: rgba(236,228,212,0.28)
--line-strong: rgba(236,228,212,0.5)
--gold: #c6a15b
--gold-wash: rgba(198,161,91,0.12)
--error: #f2967f

COLOUR:
- Gold appears on the live reading (the trace, the marker and the "measuring" line), the active timing position, the current repair step and the chosen appointment. Nothing else is gold: no gold headings, no gold buttons, no gold gradients.
- Text is ivory on near-black; muted text keeps at least 4.5:1. Structural lines are 1px at 0.28, and the top of the readout, the price table, the job ticket and the appointment book is a 1px ivory rule.

TYPOGRAPHY:
Two families. Bodoni Moda (400 to 700, with its optical-size axis from 6 to 96) sets every measured value and the headings. Albert Sans (400 to 700) reads the words around the numbers.
H1: Bodoni Moda 500, clamp(2.25rem, 4vw, 3.25rem), line-height 1.05, letter-spacing -0.012em, one line on desktop.
H2: Bodoni Moda 500, clamp(2rem, 3.4vw, 2.875rem), line-height 1.04.
The rate: Bodoni Moda 400, line-height 0.8, letter-spacing -0.035em, at 11rem beside the trace on desktop, clamp(8rem, 19vw, 15.5rem) on tablets and clamp(6.5rem, 34vw, 8rem) on phones; its unit in Albert Sans 500 at 1.5rem.
Readout values: Bodoni Moda 400 at clamp(2.75rem, 4.2vw, 3.625rem), 2.5rem on phones; the job number 400 at 3rem, 2.5rem on phones; the chosen time 500 at clamp(2rem, 3.4vw, 2.75rem).
Medium figures use weight 500 and a smaller optical size, so their hairlines hold at 1x: positions 1.75rem at opsz 14, service names 1.75rem at opsz 18, prices 2rem at opsz 20, step numbers 2.5rem at opsz 28, slot times 1.3125rem (1.125rem below 1080px) and the job field 1.375rem at opsz 12, the workshop name 600 at 1.375rem and opsz 14. On phones service names drop to 1.5rem, prices to 1.75rem and step numbers to 2rem. Plus and minus signs use opsz 6, so they keep a stem.
Figures are lining; all but the rate, the prices and the step numbers are also tabular. Body: Albert Sans 400 at 1.0625rem, line-height 1.6; notes at 1rem. No text under 1rem. No all-caps tracked labels.

LAYOUT:
- Top bar: the workshop name, three in-page links and one outlined "Book a hand-in" action on a 1px rule.
- Hero: the H1 on one line, then the timegrapher reading on a 12-column grid, with the whole trace on the first screen of a 1280x800 laptop: a head line with the job and what is being measured; the rate huge in the first four columns with one sentence under it, and the trace beside it in the other eight; the five positions as a ruled row under both; amplitude, beat error and beat rate in three columns, each figure above its name and note. Below 1080px the readout stacks: the rate, the three readings as ruled rows, the trace, the positions.
- Then the service list, the repair status, the appointment book with the form, and a three-column footer with address, hours and phone.
- A 1120px column, sections 112px apart (88px on phones).

COMPONENTS:
- Timing positions: a radio group of five (Dial up, Dial down, Crown down, Crown left, Crown up). Each shows its rate; the active one has a 3px gold rule on top and gold text. Choosing one changes the rate and its sentence, the amplitude and its healthy range, the beat error, the "measuring" line, the trace's slope and the trace's text alternative.
- The trace: two gold lines (tick and tock) on a ruled field with a centre line and ten-second gridlines, a dashed "now" line at 42 of 60 seconds and a square marker at the tip. Lines rise when the watch gains and fall when it loses; their gap is the beat error.
- Service list: a table with explicit roles. Name in Bodoni, what is done, time, and the price right-aligned with its "from" and any extra price under it. On phones each row stacks and the time gets a "Takes" label.
- Repair status: a job-number field on a single underline with a text button. A known number shows its ticket: the number large, the watch, who handed it in, six steps on 3px rules (done in ivory, the current one gold with aria-current, the next ones on a thin rule), then the watchmaker's note and three facts. An unknown or malformed number shows an error next to the field and takes the ticket that was shown off the page.
- Appointment book: one row per day with eight half-hour slots as one radio group; taken slots are struck through and disabled, the lunch gap has a stronger line, Saturday closes at noon. The chosen slot is gold on a gold wash. Once a hand-in is booked the book closes: the other free times dim to --dim and the note under the book says to use Change the time.
- Hand-in form: the chosen day and time large on the left; name, phone and the watch on underlined fields on the right; one solid rectangular button that names the day and time. Errors sit under their field; a valid booking replaces the form with a confirmation that takes focus.
- Square corners everywhere, 1px lines, no shadows.

MOTION:
- A 160ms colour change on hover. Nothing moves on its own. prefers-reduced-motion removes the transition.

FORBIDDEN:
- Cards, rounded boxes, pills, chips, badges, glass panels, glows, shadows
- A small label above a heading, all-caps tracked labels, numbered section markers
- Gold text blocks, gold buttons, metallic gradients, gold on anything not measured or chosen
- Watch illustrations, dial drawings, photographs, emoji, decorative ornaments
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about luxury, darkness or restraint

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: radio groups for the positions and the slots, a table with roles for the prices, an ordered list for the steps, labelled forms
3) Working positions, job lookup with its error, slot choice and a form with error and success states
4) Responsive layout down to 320px with no horizontal scroll; on phones the positions sit under the rate
5) Visible focus on every control, a text alternative for the trace, reduced-motion support`;

const PROMPT_KO = `Midnight Noir 스타일로 실제 페이지 한 장을 디자인한다. 거의 검은 바탕에 따뜻한 아이보리 글자를 쓰고, 지금 측정 중인 것과 선택된 항목만 앤티크 골드로 표시한다.

저조도에서 정밀한 숫자를 읽는 그럴듯한 주제를 고르고 실제 내용을 쓴다. 예: 시계 수리 공방, 천문대의 야간 공개, 와인 저장고의 테이스팅 기록. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일을 설명하는 페이지로 읽히면 안 된다. 여기서는 코펜하겐의 2인 시계 수리 공방 Oberlin & Søn이다. 받침대 위 시계의 타임그래퍼 측정값, 가격표, 작업의 수리 현황, 창구의 예약 장부를 담는다.

TOKENS:
--bg: #0c0e12
--surface: #181a1f (불투명, 페이지 위에 열리는 메뉴용)
--ink: #ece4d4
--muted: #a39e93
--dim: #7f7b73 (예약된 시간, 그리고 맡기기 예약 후의 빈 시간)
--line: rgba(236,228,212,0.28)
--line-strong: rgba(236,228,212,0.5)
--gold: #c6a15b
--gold-wash: rgba(198,161,91,0.12)
--error: #f2967f

COLOUR:
- 골드는 실시간 측정값(궤적, 마커, '측정 중' 줄), 활성 측정 자세, 현재 수리 단계, 선택된 예약에만 쓴다. 그 밖에는 골드를 쓰지 않는다: 골드 제목, 골드 버튼, 골드 그라데이션 금지.
- 글자는 거의 검은 바탕 위의 아이보리를 쓴다. 보조 글자는 4.5:1 이상의 대비를 유지한다. 구조선은 불투명도 0.28의 1px 선이며, 측정값 영역, 가격표, 작업 접수표, 예약 장부의 맨 위는 1px 아이보리 선으로 한다.

TYPOGRAPHY:
두 가지 서체 계열을 쓴다. Bodoni Moda(400~700, 광학 크기 축 6~96)는 모든 측정값과 제목을 조판한다. Albert Sans(400~700)는 숫자 주변의 글을 조판한다.
H1: Bodoni Moda 500, clamp(2.25rem, 4vw, 3.25rem), 줄 높이 1.05, 자간 -0.012em, 데스크톱에서는 한 줄.
H2: Bodoni Moda 500, clamp(2rem, 3.4vw, 2.875rem), 줄 높이 1.04.
일차(rate): Bodoni Moda 400, 줄 높이 0.8, 자간 -0.035em, 데스크톱에서는 궤적 옆에 11rem, 태블릿에서는 clamp(8rem, 19vw, 15.5rem), 휴대폰에서는 clamp(6.5rem, 34vw, 8rem). 단위는 Albert Sans 500, 1.5rem.
측정값: Bodoni Moda 400, clamp(2.75rem, 4.2vw, 3.625rem), 휴대폰에서는 2.5rem. 접수 번호는 400, 3rem이며 휴대폰에서는 2.5rem. 선택된 시간은 500, clamp(2rem, 3.4vw, 2.75rem).
중간 크기 숫자는 굵기 500과 더 작은 광학 크기를 써서 1배율에서도 가는 획이 살아 있게 한다: 자세 1.75rem(opsz 14), 서비스 이름 1.75rem(opsz 18), 가격 2rem(opsz 20), 단계 번호 2.5rem(opsz 28), 시간 슬롯 1.3125rem(1080px 미만에서는 1.125rem), 접수 번호 입력란 1.375rem(opsz 12), 공방 이름은 600, 1.375rem, opsz 14. 휴대폰에서는 서비스 이름 1.5rem, 가격 1.75rem, 단계 번호 2rem. 플러스·마이너스 기호는 opsz 6을 써서 세로 획이 살아 있게 한다.
숫자는 정렬 숫자(lining)를 쓴다. 일차, 가격, 단계 번호를 제외한 모든 숫자는 고정폭 숫자(tabular)도 쓴다. 본문: Albert Sans 400, 1.0625rem, 줄 높이 1.6. 설명 글은 1rem. 1rem 미만 글자는 쓰지 않는다. 자간을 넓힌 대문자 라벨은 쓰지 않는다.

LAYOUT:
- 상단 바: 공방 이름, 페이지 안 링크 세 개, 1px 선으로 둘러싼 "맡기기 예약" 버튼 하나.
- 히어로: 한 줄의 H1, 이어서 12열 격자의 타임그래퍼 측정값. 1280x800 노트북의 첫 화면에 궤적 전체가 보여야 한다. 머리글 줄에는 접수 번호와 측정 대상을 둔다. 일차 숫자는 앞의 네 열에 아주 크게 두고 그 아래에 한 문장을 둔다. 궤적은 나머지 여덟 열에 둔다. 다섯 측정 자세는 두 영역 아래에 선으로 구분한 한 줄로 둔다. 진폭, 비트 에러, 비트 레이트는 세 열에 두며 각 숫자는 이름과 설명 위에 놓는다. 1080px 미만에서는 측정값이 세로로 쌓인다: 일차, 세 측정값을 선으로 구분한 행, 궤적, 측정 자세 순서.
- 그다음 서비스 목록, 수리 현황, 폼이 있는 예약 장부, 주소·운영 시간·전화번호를 담은 3열 바닥글.
- 1120px 폭의 칼럼. 섹션 간격은 112px(휴대폰에서는 88px).

COMPONENTS:
- 측정 자세: 다섯 개(문자판 위, 문자판 아래, 용두 아래, 용두 왼쪽, 용두 위)의 라디오 그룹. 각 항목은 일차를 보여 준다. 선택된 항목은 위쪽에 3px 골드 선이 있고 글자도 골드다. 하나를 고르면 일차와 그 문장, 진폭과 정상 범위, 비트 에러, '측정 중' 줄, 궤적의 기울기, 궤적의 글자 대체 설명이 바뀐다.
- 궤적: 중앙선과 10초 간격 격자선이 있는 선 바탕 위에 두 개의 골드 선(틱과 탁). 60초 중 42초 지점에 점선 '지금' 선, 끝에 정사각형 마커. 시계가 빨라지면 선이 올라가고 느려지면 내려간다. 두 선 사이 간격이 비트 에러다.
- 서비스 목록: 역할을 명시한 표. 이름은 Bodoni, 작업 내용, 시간, 가격은 오른쪽 정렬하고 '최저'와 추가 가격은 그 아래에 둔다. 휴대폰에서는 각 행을 세로로 쌓고 시간 칸에 '소요' 라벨을 붙인다.
- 수리 현황: 한 줄 밑줄이 있는 접수 번호 입력란과 텍스트 버튼. 알려진 번호는 접수증을 보여 준다. 번호를 크게 표시하고, 시계, 맡긴 분, 3px 선으로 구분된 여섯 단계(끝난 단계는 아이보리, 현재 단계는 골드이며 aria-current를 붙이고, 다음 단계는 얇은 선), 그다음 수리사의 메모와 세 가지 사실을 보여 준다. 알 수 없거나 형식이 틀린 번호는 입력란 옆에 오류를 보여 주며, 그때까지 보이던 접수증은 화면에서 뺀다.
- 예약 장부: 날짜마다 한 행, 30분 간격 여덟 개 슬롯을 하나의 라디오 그룹으로. 예약된 슬롯은 취소선을 긋고 비활성화한다. 점심 공백에는 더 굵은 선을 둔다. 토요일은 정오에 마감한다. 선택된 슬롯은 골드 글자와 골드 바탕 음영을 쓴다. 맡기기 예약이 끝나면 장부를 닫는다: 나머지 빈 시간은 --dim으로 흐리게 하고, 장부 아래 안내 문구에 '시간 변경'을 쓰라고 적는다.
- 맡기기 폼: 왼쪽에 선택한 날짜와 시간을 크게, 오른쪽에 이름, 연락처, 시계 정보를 밑줄 입력란으로. 날짜와 시간을 적은 채워진 직사각형 버튼 하나. 오류는 해당 입력란 아래에 둔다. 예약이 유효하면 폼을 포커스를 받는 확인 화면으로 바꾼다.
- 모서리는 모두 직각, 선은 1px, 그림자 없음.

MOTION:
- 호버 시 160ms 색 변화. 스스로 움직이는 것은 없다. prefers-reduced-motion에서는 전환을 없앤다.

FORBIDDEN:
- 카드, 둥근 상자, 알약형 버튼, 칩, 배지, 유리 패널, 글로우, 그림자 금지
- 제목 위의 작은 라벨, 자간을 넓힌 대문자 라벨, 번호가 붙은 섹션 표시 금지
- 골드 글자 블록, 골드 버튼, 금속 그라데이션, 측정되거나 선택되지 않은 것에 쓰는 골드 금지
- 시계 일러스트, 문자판 그림, 사진, 이모지, 장식 요소 금지
- 링크의 화살표, 가운뎃점으로 이은 메타 문자열, 실제 순서가 아닌 것에 붙인 숫자 금지
- 고급스러움, 어둠, 절제에 대한 문구 금지

OUTPUT:
1) 위 토큰을 담은 CSS 사용자 지정 속성
2) 시맨틱 HTML: 자세와 슬롯에는 라디오 그룹, 가격에는 역할을 가진 표, 단계에는 순서 목록, 라벨이 있는 폼
3) 작동하는 측정 자세, 오류가 있는 접수 번호 조회, 슬롯 선택, 오류와 성공 상태가 있는 폼
4) 320px까지 가로 스크롤 없이 반응형 레이아웃. 휴대폰에서는 측정 자세를 일차 아래에 둔다.
5) 모든 컨트롤에 보이는 포커스, 궤적의 글자 대체 설명, 모션 감소 지원`;

const PROMPT_JA = `Midnight Noirのスタイルで、実在するページを1枚デザインする。ほぼ黒の背景に温かみのあるアイボリーの文字を使い、いま計測している値と選択中の項目だけをアンティークゴールドで示す。

暗い照明の下で精密な数値を読むような、もっともらしい題材を選び、実際の内容を書く。例: 時計修理工房、天文台の夜間公開、ワインセラーのテイスティング記録。ページはその題材のページとして読めなければならず、スタイルについて説明するページに見えてはならない。ここではコペンハーゲンの2人体制の時計修理工房「Oberlin & Søn」とする。スタンドに置かれた時計のタイムグラファーの測定値、価格表、作業の修理状況、受付の予約台帳を扱う。

TOKENS:
--bg: #0c0e12
--surface: #181a1f（不透明、ページの上に開くメニュー用）
--ink: #ece4d4
--muted: #a39e93
--dim: #7f7b73（予約済みの時間と、予約後に残る空き時間）
--line: rgba(236,228,212,0.28)
--line-strong: rgba(236,228,212,0.5)
--gold: #c6a15b
--gold-wash: rgba(198,161,91,0.12)
--error: #f2967f

COLOUR:
- ゴールドは、リアルタイムの測定値（軌跡、マーカー、「測定中」の行）、有効な計時姿勢、現在の修理工程、選択された予約にのみ使う。それ以外には使わない。ゴールドの見出し、ゴールドのボタン、ゴールドのグラデーションは禁止。
- 文字はほぼ黒の背景に対するアイボリー。補助テキストは4.5:1以上のコントラストを保つ。構造線は不透明度0.28の1px線とし、測定値の欄、価格表、受付票、予約台帳の上端は1pxのアイボリー線とする。

TYPOGRAPHY:
2つのフォントファミリー。Bodoni Moda（400〜700、光学サイズ軸6〜96）は、すべての測定値と見出しを組む。Albert Sans（400〜700）は数字の周りの文章を組む。
H1: Bodoni Moda 500、clamp(2.25rem, 4vw, 3.25rem)、行の高さ1.05、字間 -0.012em、デスクトップでは1行。
H2: Bodoni Moda 500、clamp(2rem, 3.4vw, 2.875rem)、行の高さ1.04。
日差（rate）: Bodoni Moda 400、行の高さ0.8、字間 -0.035em、デスクトップでは軌跡の横に11rem、タブレットでは clamp(8rem, 19vw, 15.5rem)、スマートフォンでは clamp(6.5rem, 34vw, 8rem)。単位は Albert Sans 500、1.5rem。
測定値: Bodoni Moda 400、clamp(2.75rem, 4.2vw, 3.625rem)、スマートフォンでは2.5rem。受付番号は400、3rem、スマートフォンでは2.5rem。選択された時間は500、clamp(2rem, 3.4vw, 2.75rem)。
中サイズの数字は、1倍でも細線が保たれるよう太さ500と小さい光学サイズを使う: 姿勢1.75rem（opsz 14）、サービス名1.75rem（opsz 18）、価格2rem（opsz 20）、工程番号2.5rem（opsz 28）、時間枠1.3125rem（1080px未満では1.125rem）、受付番号欄1.375rem（opsz 12）、工房名は600、1.375rem、opsz 14。スマートフォンではサービス名1.5rem、価格1.75rem、工程番号2rem。プラス・マイナス記号は光学サイズ6を使い、縦画を保つ。
数字はlining（本文の高さに揃う）を使い、日差、価格、工程番号以外は tabular（等幅）も使う。本文: Albert Sans 400、1.0625rem、行の高さ1.6。注記は1rem。1rem未満の文字は使わない。字間を空けた大文字のラベルは使わない。

LAYOUT:
- 上部バー: 工房名、ページ内リンク3つ、1pxの罫線で囲んだ「お預けの予約」ボタン1つ。
- ヒーロー: 1行のH1、続いて12列グリッドのタイムグラファーの測定値。1280x800のノートPCの最初の画面に軌跡全体が収まる。見出しの行には受付番号と測定対象を置く。左の4列には大きな日差の数値と、その下の1文を置く。右の8列には軌跡を置く。その両方の下に、5つの計時姿勢を罫線付きの1行として置く。振り角、ビートエラー、ビートレートは3列に並べ、各数値は名前と注記の上に置く。1080px未満では測定値が縦に積まれる: 日差、3つの値を罫線付きの行で示したもの、軌跡、計時姿勢の順。
- 続いてサービス一覧、修理状況、フォーム付きの予約台帳、住所・営業時間・電話番号の3列フッター。
- 幅1120pxのカラム。セクション間隔は112px（スマートフォンでは88px）。

COMPONENTS:
- 計時姿勢: 5つ（文字盤上、文字盤下、竜頭下、竜頭左、竜頭上）のラジオグループ。各項目は日差を表示する。選択中の項目は上に3pxのゴールドの線があり、文字もゴールドになる。選ぶと、日差とその文、振り角と正常範囲、ビートエラー、「測定中」の行、軌跡の傾き、軌跡の文字による代替説明が変わる。
- 軌跡: 中央線と10秒ごとの格子線を備えた罫線の面に、2本のゴールドの線（ティックとタック）。60秒中42秒の位置に破線の「現在」線、先端に正方形のマーカー。時計が進むと線は上がり、遅れると下がる。2本の線の間隔がビートエラーである。
- サービス一覧: 役割を明示した表。名前はBodoni、作業内容、時間、価格は右揃えで、「最低」と追加料金をその下に置く。スマートフォンでは各行を縦に積み、時間には「所要」のラベルを付ける。
- 修理状況: 1本の下線が付いた受付番号の入力欄とテキストボタン。既知の番号は受付票を表示する。番号を大きく、時計、お預けになった方、3pxの罫線で区切られた6つの工程（完了はアイボリー、現在の工程はゴールドでaria-current付き、次の工程は細い罫線）、続いて修理師のメモと3つの事実を示す。未知または形式の誤った番号は入力欄の横にエラーを表示し、それまで表示していた受付票は画面から外す。
- 予約台帳: 日ごとに1行、30分枠8つを1つのラジオグループに。予約済みの枠は取り消し線を引いて無効にする。昼休みの空白にはより太い線を入れる。土曜日は12時に締める。選択された枠はゴールドの文字とゴールドの薄い地色。お預けの予約が済むと台帳は閉じる。ほかの空き時間は--dimで薄くし、台帳の下の注記で「時間を変更」を使うよう案内する。
- お預けフォーム: 左に選んだ日付と時間を大きく、右に名前、電話番号、時計の情報を下線付きの入力欄で置く。日付と時間を書いた、塗りつぶした角型のボタン1つ。エラーは該当する入力欄の下に出す。予約が有効なら、フォームをフォーカスを受ける確認画面に置き換える。
- 角はすべて直角、線は1px、影は使わない。

MOTION:
- ホバー時は160msで色が変わる。自動で動くものはない。prefers-reduced-motionではトランジションを外す。

FORBIDDEN:
- カード、角丸の箱、ピル型、チップ、バッジ、ガラスのパネル、グロー、影は禁止
- 見出しの上の小さなラベル、字間を空けた大文字のラベル、番号付きのセクション記号は禁止
- ゴールドの文字ブロック、ゴールドのボタン、金属的なグラデーション、計測も選択もされていないものへのゴールドは禁止
- 時計のイラスト、文字盤の図、写真、絵文字、装飾は禁止
- リンクの矢印、中黒でつないだメタ文字列、実際の順序ではないものへの番号は禁止
- 高級感、暗さ、抑制についての文言は禁止

OUTPUT:
1) 上記トークンのCSSカスタムプロパティ
2) セマンティックHTML: 姿勢と枠にはラジオグループ、価格には役割付きの表、工程には順序付きリスト、ラベル付きのフォーム
3) 作動する計時姿勢、エラー付きの受付番号検索、枠の選択、エラーと成功の状態を持つフォーム
4) 320pxまで横スクロールなしのレスポンシブレイアウト。スマートフォンでは計時姿勢を日差の下に置く。
5) すべてのコントロールに見えるフォーカス、軌跡の文字による代替説明、モーション低減への対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

type Errors = { name: boolean; phone: boolean };

export function PortedMidnightNoirPage({ lang }: PortedStylePageProps) {
  const [positionId, setPositionId] = useState<PositionId>('dial-up');
  const [positionNews, setPositionNews] = useState('');
  const [jobInput, setJobInput] = useState('2598');
  // The job whose ticket is shown. A lookup that fails clears it, so its error is never
  // read as news about the ticket that was there before.
  const [jobId, setJobId] = useState<string | null>('2598');
  const [jobError, setJobError] = useState<string | null>(null);
  const [jobNews, setJobNews] = useState('');
  const [slot, setSlot] = useState(FIRST_FREE);
  const [guest, setGuest] = useState({ name: '', phone: '', watch: '' });
  const [errors, setErrors] = useState<Errors>({ name: false, phone: false });
  const [booked, setBooked] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const wasBooked = useRef(false);

  const t = (text: Tri) => text[lang];

  const position = POSITIONS.find((item) => item.id === positionId) ?? POSITIONS[0];
  const trace = TRACES[position.id];
  const gains = position.rate >= 0;
  const job = jobId === null ? null : JOBS[jobId];
  const [dayId, time] = slot.split(' ');
  const day = DAYS.find((item) => item.id === dayId) ?? DAYS[0];

  // The form and the confirmation replace each other, and the control that had focus
  // leaves the page with them. Focus goes to what took its place: the confirmation,
  // or, after "Change the time", the chosen slot in the book.
  useEffect(() => {
    if (booked) doneRef.current?.focus();
    else if (wasBooked.current) bookRef.current?.querySelector<HTMLInputElement>('input:checked')?.focus();
    wasBooked.current = booked;
  }, [booked]);

  const choosePosition = (next: Position) => {
    setPositionId(next.id);
    setPositionNews(
      fill(t(METER.announce), {
        summary: fill(t(next.summary), { amount: t(next.amount) }),
        amplitude: next.amplitude,
        beatError: next.beatError.toFixed(1),
      }),
    );
  };

  const lookUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = jobInput.trim();
    const wellFormed = /^\d{4}$/.test(value);
    const found: Job | undefined = wellFormed ? JOBS[value] : undefined;
    if (!found) {
      // The ticket on show leaves with a failed lookup, so the error stands on its own.
      setJobError(wellFormed ? fill(t(STATUS.unknown), { n: value, phone: PHONE }) : t(STATUS.format));
      setJobId(null);
      setJobNews('');
      return;
    }
    setJobError(null);
    setJobId(value);
    setJobNews(fill(t(STATUS.shown), { n: value, watch: t(found.watch), step: t(STEP_NAMES[found.now - 1]) }));
  };

  const handIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = { name: guest.name.trim() === '', phone: !/^\+?[\d\s()-]+$/.test(guest.phone.trim()) || guest.phone.replace(/\D/g, '').length < 8 };
    if (!next.name && !next.phone) {
      setErrors(next);
      setBooked(true);
      return;
    }
    // The error renders first, so the whole field can be brought into view above the fixed page bar.
    flushSync(() => setErrors(next));
    const field = next.name ? nameRef.current : phoneRef.current;
    field?.focus();
    field?.parentElement?.scrollIntoView({ block: 'nearest' });
  };

  return (
    <FusionShell
      fusionId="midnight-noir"
      lang={lang}
      tone="dark"
      accent="#c6a15b"
      prev={{ href: '/pages/terminal-core.html', label: 'Terminal Core' }}
      next={{ href: '/pages/console-launch.html', label: 'Console Launch' }}
      prompts={PROMPTS}
    >
      <div className="os">
        <header className="os-bar">
          <p className="os-mark">{NAME}</p>
          <nav className="os-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#os-service">{t(HEAD.service)}</a>
            <a href="#os-status">{t(HEAD.status)}</a>
            <a href="#os-hand-in">{t(HEAD.handIn)}</a>
          </nav>
          <a className="os-btn os-bar__book" href="#os-hand-in" aria-label={t(HEAD.book)}>
            <span className="os-bar__long">{t(HEAD.book)}</span>
            <span className="os-bar__short">{t(HEAD.bookShort)}</span>
          </a>
        </header>

        <section className="os-hero" aria-labelledby="os-title">
          <h1 id="os-title">{t(HEAD.title)}</h1>

          <section className="os-meter" aria-label={t(METER.label)}>
            <div className="os-meter__head">
              <span className="os-meter__job">{t(METER.job)}</span>
              <span>{t(METER.watch)}</span>
              <span className="os-live">{t(position.measuring)}</span>
            </div>

            <div className="os-rate">
              <p className="os-rate__fig">
                <b><Signed value={position.rate} /></b>
                <span className="os-rate__unit">{t(METER.unit)}</span>
              </p>
              <p className="os-rate__note">
                {place(t(position.summary), 'amount', <strong>{t(position.amount)}</strong>)} {t(METER.overall)}
              </p>
            </div>

            <ul className="os-vals">
              <li>
                <span className="os-vals__key">{t(METER.amplitude)}</span>
                <b className="os-vals__fig">{position.amplitude}°</b>
                <span className="os-vals__note">{t(position.flat ? METER.amplitudeFlat : METER.amplitudeEdge)}</span>
              </li>
              <li>
                <span className="os-vals__key">{t(METER.beatError)}</span>
                <b className="os-vals__fig">{position.beatError.toFixed(1)}<span className="os-vals__unit">ms</span></b>
                <span className="os-vals__note">{t(METER.beatErrorNote)}</span>
              </li>
              <li>
                <span className="os-vals__key">{t(METER.beatRate)}</span>
                <b className="os-vals__fig">28,800<span className="os-vals__unit">vph</span></b>
                <span className="os-vals__note">{t(METER.beatRateNote)}</span>
              </li>
            </ul>

            <div className="os-trace">
              <div className="os-trace__scale" aria-hidden="true">
                {SCALE.map((mark) => <span key={mark}>{mark}</span>)}
              </div>
              <div className="os-trace__field" role="img" aria-label={t(gains ? METER.traceGains : METER.traceLoses)}>
                <svg viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
                  <polyline vectorEffect="non-scaling-stroke" points={trace.tick} />
                  <polyline vectorEffect="non-scaling-stroke" points={trace.tock} />
                </svg>
                <i className="os-trace__now" />
                <i className="os-trace__tip" style={{ top: `${trace.tip.toFixed(2)}%` }} />
              </div>
              <div className="os-trace__axis" aria-hidden="true">
                {AXIS.map((mark) => <span key={mark}>{mark}</span>)}
              </div>
              <p className="os-trace__legend">{t(gains ? METER.legendGains : METER.legendLoses)}</p>
            </div>

            <div className="os-pos" role="radiogroup" aria-label={t(METER.positions)}>
              {POSITIONS.map((item) => (
                <label key={item.id} className={`os-pos__item${item.id === position.id ? ' is-on' : ''}`}>
                  <input
                    className="os-sr"
                    type="radio"
                    name="os-position"
                    value={item.id}
                    checked={item.id === position.id}
                    onChange={() => choosePosition(item)}
                  />
                  <span className="os-pos__name">{t(item.name)}</span>
                  <b className="os-pos__rate">
                    <Signed value={item.rate} />
                    <span className="os-sr"> {t(METER.perDay)}</span>
                  </b>
                </label>
              ))}
            </div>
            <p className="os-sr" role="status">{positionNews}</p>
          </section>
        </section>

        <section className="os-section" id="os-service" aria-labelledby="os-service-title">
          <div className="os-sec-head">
            <div>
              <h2 id="os-service-title">{t(SERVICE.title)}</h2>
              <p className="os-intro">{t(SERVICE.note)}</p>
            </div>
          </div>
          <div className="os-svc" role="table" aria-labelledby="os-service-title">
            <div role="rowgroup">
              <div className="os-svc__row os-svc__row--head" role="row">
                <span role="columnheader">{t(SERVICE.colService)}</span>
                <span role="columnheader">{t(SERVICE.colWork)}</span>
                <span role="columnheader">{t(SERVICE.colTime)}</span>
                <span className="os-svc__price" role="columnheader">{t(SERVICE.colPrice)}</span>
              </div>
            </div>
            <div role="rowgroup">
              {SERVICE.rows.map((row) => (
                <div key={row.name.en} className="os-svc__row" role="row">
                  <span className="os-svc__name" role="rowheader" data-label={t(SERVICE.colService)}>{t(row.name)}</span>
                  <span className="os-svc__work" role="cell" data-label={t(SERVICE.colWork)}>{t(row.work)}</span>
                  <span className="os-svc__time" role="cell" data-label={t(SERVICE.colTime)}>
                    <span className="os-svc__takes">{t(SERVICE.takes)} </span>
                    {t(row.time)}
                  </span>
                  <span className="os-svc__price" role="cell" data-label={t(SERVICE.colPrice)}>
                    <span className="os-svc__amount">
                      {row.from ? <span>{t(SERVICE.from)} </span> : null}
                      <b>{row.price}</b> <span>DKK</span>
                    </span>
                    {row.extra ? <span className="os-svc__extra">{t(row.extra)}</span> : null}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="os-section" id="os-status" aria-labelledby="os-status-title">
          <div className="os-sec-head">
            <div>
              <h2 id="os-status-title">{t(STATUS.title)}</h2>
              <p className="os-intro">{t(STATUS.note)}</p>
            </div>
            <div className="os-find">
              <form className={`os-lookup${jobError ? ' is-invalid' : ''}`} noValidate onSubmit={lookUp}>
                <label htmlFor="os-job">{t(STATUS.label)}</label>
                <input
                  id="os-job"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={jobInput}
                  aria-invalid={jobError ? true : undefined}
                  aria-describedby={jobError ? 'os-job-error' : undefined}
                  onChange={(event) => {
                    setJobInput(event.target.value);
                    if (jobError) setJobError(null);
                  }}
                />
                <button type="submit">{t(STATUS.submit)}</button>
              </form>
              {jobError ? <p className="os-find__error" id="os-job-error" role="alert">{jobError}</p> : null}
            </div>
          </div>
          <p className="os-sr" role="status">{jobNews}</p>

          {job && jobId ? (
            <article className="os-ticket" aria-labelledby="os-ticket-job">
              <div className="os-ticket__head">
                <h3 className="os-ticket__job" id="os-ticket-job">{fill(t(STATUS.job), { n: jobId })}</h3>
                <p>{t(job.watch)}</p>
                <p className="os-ticket__who">{t(job.who)}</p>
              </div>
              <ol className="os-steps" aria-label={t(STATUS.steps)}>
                {job.steps.map((step, index) => {
                  const n = index + 1;
                  const state = n === job.now ? 'is-now' : n > job.now ? 'is-next' : undefined;
                  return (
                    <li key={STEP_NAMES[index].en} className={state} aria-current={n === job.now ? 'step' : undefined}>
                      <span className="os-steps__n" aria-hidden="true">{n}</span>
                      <b>{t(STEP_NAMES[index])}</b>
                      <time dateTime={step.date}>{t(step.when)}</time>
                      <p>{t(step.body)}</p>
                    </li>
                  );
                })}
              </ol>
              <div className="os-bench">
                <blockquote className="os-bench__note">
                  <p>{t(job.note)}</p>
                  <footer>{t(job.by)}</footer>
                </blockquote>
                <dl className="os-facts">
                  <div><dt>{t(STATUS.work)}</dt><dd>{t(job.work)}</dd></div>
                  <div><dt>{t(STATUS.quote)}</dt><dd>{t(job.quote)}</dd></div>
                  <div><dt>{t(STATUS.collect)}</dt><dd>{t(STATUS.collectValue)}</dd></div>
                </dl>
              </div>
            </article>
          ) : null}
        </section>

        <section className="os-section" id="os-hand-in" aria-labelledby="os-hand-title">
          <div className="os-sec-head">
            <div>
              <h2 id="os-hand-title">{t(HAND_IN.title)}</h2>
              <p className="os-intro">{t(HAND_IN.note)}</p>
            </div>
          </div>

          <div
            className={`os-book${booked ? ' is-locked' : ''}`}
            role="radiogroup"
            aria-label={t(HAND_IN.group)}
            aria-describedby="os-book-note"
            ref={bookRef}
          >
            {DAYS.map((item) => (
              <div key={item.id} className="os-book__day">
                <p className="os-book__date"><b>{t(item.name)}</b> <span>{t(item.date)}</span></p>
                {slotsOf(item).map((slotTime) => {
                  const value = `${item.id} ${slotTime}`;
                  const taken = item.taken.includes(slotTime);
                  const chosen = value === slot;
                  return (
                    <label key={slotTime} className={`os-slot${taken ? ' is-taken' : ''}${chosen ? ' is-on' : ''}`}>
                      <input
                        className="os-sr"
                        type="radio"
                        name="os-slot"
                        value={value}
                        checked={chosen}
                        disabled={taken || booked}
                        onChange={() => setSlot(value)}
                      />
                      <span className="os-sr">{t(item.name)} {t(item.date)}, </span>
                      {slotTime}
                      {taken ? <span className="os-sr">, {t(HAND_IN.taken)}</span> : null}
                    </label>
                  );
                })}
                {item.morningOnly ? <p className="os-book__closed">{t(HAND_IN.saturday)}</p> : null}
              </div>
            ))}
          </div>
          <p className="os-book__note" id="os-book-note">{t(booked ? HAND_IN.lockedNote : HAND_IN.bookNote)}</p>

          <div className="os-confirm">
            <div className="os-chosen">
              <p className="os-when">
                <span>{t(day.name)} {t(day.date)}</span> <span>{fill(t(HAND_IN.at), { time })}</span>
              </p>
              <p className="os-where">{t(HAND_IN.where)}</p>
            </div>
            {booked ? (
              <div className="os-done">
                <p className="os-done__title" ref={doneRef} tabIndex={-1}>{fill(t(HAND_IN.doneTitle), { name: guest.name.trim() })}</p>
                <p className="os-done__body">{fill(t(HAND_IN.doneBody), { phone: guest.phone.trim() })}</p>
                <button className="os-btn" type="button" onClick={() => setBooked(false)}>{t(HAND_IN.change)}</button>
              </div>
            ) : (
              <form className="os-form" noValidate onSubmit={handIn}>
                <div className={`os-field${errors.name ? ' is-invalid' : ''}`}>
                  <label htmlFor="os-name">{t(HAND_IN.name)}</label>
                  <input
                    id="os-name"
                    ref={nameRef}
                    type="text"
                    autoComplete="name"
                    required
                    value={guest.name}
                    aria-invalid={errors.name || undefined}
                    aria-describedby={errors.name ? 'os-name-error' : undefined}
                    onChange={(event) => {
                      setGuest({ ...guest, name: event.target.value });
                      if (errors.name) setErrors({ ...errors, name: false });
                    }}
                  />
                  {errors.name ? <p className="os-field__error" id="os-name-error" role="alert">{t(HAND_IN.nameError)}</p> : null}
                </div>
                <div className={`os-field${errors.phone ? ' is-invalid' : ''}`}>
                  <label htmlFor="os-phone">{t(HAND_IN.phone)}</label>
                  <input
                    id="os-phone"
                    ref={phoneRef}
                    type="tel"
                    autoComplete="tel"
                    required
                    value={guest.phone}
                    aria-invalid={errors.phone || undefined}
                    aria-describedby={errors.phone ? 'os-phone-error' : undefined}
                    onChange={(event) => {
                      setGuest({ ...guest, phone: event.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: false });
                    }}
                  />
                  {errors.phone ? <p className="os-field__error" id="os-phone-error" role="alert">{t(HAND_IN.phoneError)}</p> : null}
                </div>
                <div className="os-field os-field--wide">
                  <label htmlFor="os-watch">{t(HAND_IN.watch)} <span>{t(HAND_IN.optional)}</span></label>
                  <input
                    id="os-watch"
                    type="text"
                    value={guest.watch}
                    onChange={(event) => setGuest({ ...guest, watch: event.target.value })}
                  />
                </div>
                <button className="os-btn os-btn--solid" type="submit">{fill(t(HAND_IN.submit), { day: t(day.name), time })}</button>
              </form>
            )}
          </div>
        </section>

        <footer className="os-foot">
          <p><b>{NAME}</b>{ADDRESS}</p>
          <p><b>{t(FOOT.hours)}</b>{t(FOOT.hoursValue)}</p>
          <p><b>{t(FOOT.phone)}</b>{fill(t(FOOT.phoneValue), { phone: PHONE })}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
