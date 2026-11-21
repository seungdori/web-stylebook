import { Fragment, useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedCyberpunkGlitchPage.css';

// The page of Sector 9 Repair, a phone, tablet and laptop repair stall in a night market
// in Kowloon, in the Cyberpunk Glitch style. Tektur, a squared face with a width axis,
// sets the stall's name wide and heavy and every figure a customer reads from across the
// aisle at the condensed end of the axis: the number being served, prices, tickets, part
// counts. Red Hat Mono says everything else, in the voice of the queue screen.
// Components come from the stall: the hours on hazard tape, the now-serving display over
// the three benches, a lit price board with a device switch, the queue screen with a
// ticket lookup and a ticket machine, the parts drawers, and a plan of the market rows.
// Colour has one meaning each: yellow is what to look at now, cyan is on a bench, in
// stock or a link, magenta is waiting, running low or a mistake in a form.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const NAME = 'Sector 9 Repair';
const NAME_LINES = ['Sector 9', 'Repair'];

// Fills {key} slots; a slot without a value is left for place().
const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (slot, key: string) => (key in values ? String(values[key]) : slot));
// Puts one value into a sentence as a node, so it can be set in its own face and colour.
const place = (text: string, key: string, node: ReactNode): ReactNode[] =>
  text.split(`{${key}}`).flatMap((part, index) => (index === 0 ? [part] : [<Fragment key={index}>{node}</Fragment>, part]));
const pad = (n: number) => String(n).padStart(3, '0');
const clock = (minutes: number) => {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

const HEAD = {
  nav: { en: 'Stall', ko: '매대', ja: '屋台' },
  prices: { en: 'Prices', ko: '가격', ja: '料金' },
  queue: { en: 'Queue', ko: '대기열', ja: '待ち行列' },
  parts: { en: 'Parts', ko: '부품', ja: '部品' },
  find: { en: 'Find the stall', ko: '매대 찾기', ja: '屋台を探す' },
} satisfies Record<string, Tri>;

const HERO = {
  open: { en: 'Open 19:00–03:00', ko: '영업 19:00–03:00', ja: '営業 19:00–03:00' },
  openNote: { en: 'Last walk-in at 02:15. Closed on Tuesdays.', ko: '마지막 접수는 02:15입니다. 화요일은 휴무입니다.', ja: '最終受付は02:15です。火曜日は休業です。' },
  lede: {
    en: 'Phone, tablet and laptop repairs at stall 14 in Row C of the Temple Lane night market, Kowloon. Screens and batteries are fitted at the counter while you wait. Longer jobs are ready the next night.',
    ko: '홍콩 구룡 템플 레인 야시장 C열 14번 매대에서 하는 휴대폰, 태블릿, 노트북 수리입니다. 화면과 배터리는 기다리는 동안 카운터에서 바로 교체합니다. 오래 걸리는 작업은 다음 날 밤에 찾아가실 수 있습니다.',
    ja: '香港九龍、テンプル・レーン夜市C列14番屋台で行う、スマートフォン、タブレット、ノートパソコンの修理です。画面とバッテリーは、お待ちいただいている間にカウンターで交換します。時間のかかる作業は翌日の夜にお渡しします。',
  },
  take: { en: 'Take a queue ticket', ko: '대기 번호표 받기', ja: '整理券を取る' },
  prices: { en: 'See tonight’s prices', ko: '오늘 밤 가격 보기', ja: '今夜の料金を見る' },
  benches: {
    en: 'Three benches tonight: Kit on batteries and ports, Joy on screens, Marco on laptops and data recovery.',
    ko: '오늘 밤 작업대는 세 곳입니다. Kit은 배터리와 포트, Joy는 화면, Marco는 노트북과 데이터 복구를 맡습니다.',
    ja: '今夜の作業台は3か所です。Kitはバッテリーとポート、Joyは画面、Marcoはノートパソコンとデータ復旧を担当します。',
  },
} satisfies Record<string, Tri>;

const HUD = {
  label: { en: 'Now serving', ko: '현재 번호', ja: '現在の番号' },
  what: { en: 'Pixel 7 screen', ko: 'Pixel 7 화면', ja: 'Pixel 7 画面' },
  where: { en: 'Bench 2 with Joy', ko: '2번 작업대, Joy', ja: '2番作業台、Joy' },
  benches: { en: 'On the benches', ko: '작업대 현황', ja: '作業台の状況' },
  next: { en: 'The next ticket is {n}, about {wait} away.', ko: '다음 번호는 {n}번이며, 약 {wait} 뒤입니다.', ja: '次の番号は{n}番で、約{wait}後です。' },
  full: { en: 'No more tickets tonight. The queue is full until 03:00.', ko: '오늘 밤 번호표는 모두 나갔습니다. 03:00까지 대기열이 가득 찼습니다.', ja: '今夜の整理券は終了しました。03:00まで待ち行列は満席です。' },
  ready: { en: 'Ready to collect', ko: '수령 가능', ja: '受け取り可能' },
} satisfies Record<string, Tri>;

const NOW_SERVING = 47;

const BENCHES: Array<{ job: Tri; state: Tri; progress: number }> = [
  { job: { en: '045 iPhone 13 battery', ko: '045 iPhone 13 배터리', ja: '045 iPhone 13 バッテリー' }, state: { en: 'Bench 1, 3 min left', ko: '1번 작업대, 3분 남음', ja: '1番作業台、残り3分' }, progress: 87 },
  { job: { en: '046 MacBook data recovery', ko: '046 MacBook 데이터 복구', ja: '046 MacBook データ復旧' }, state: { en: 'Bench 3, 100 of 238 GB', ko: '3번 작업대, 238GB 중 100GB', ja: '3番作業台、238GB中100GB' }, progress: 42 },
  { job: { en: '044 Galaxy S22 screen', ko: '044 Galaxy S22 화면', ja: '044 Galaxy S22 画面' }, state: { en: 'At the counter since 21:12', ko: '21:12부터 카운터 보관 중', ja: '21:12からカウンターで保管中' }, progress: 100 },
];

// "1 h 50 min", the wait for a ticket taken now. No-break spaces keep it on one line.
const WAIT = { en: '{h}\u00a0h\u00a0{m}\u00a0min', ko: '{h}\u00a0\uc2dc\uac04\u00a0{m}\u00a0\ubd84', ja: '{h}\u00a0\u6642\u9593\u00a0{m}\u00a0\u5206' } satisfies Tri;

type DeviceId = 'phones' | 'tablets' | 'laptops' | 'consoles';

interface Service {
  name: Tri;
  note: Tri;
  time: Tri;
  from: boolean;
  price: string;
}

const PRICES = {
  title: { en: 'Prices', ko: '가격', ja: '料金' },
  intro: {
    en: 'Every price includes the part and a 90-day warranty on it. We quote before we open anything, and if the quote changes once the device is open, you decide again.',
    ko: '모든 가격에는 부품과 부품 90일 보증이 포함됩니다. 기기를 열기 전에 견적을 드리며, 기기를 연 뒤 견적이 바뀌면 다시 결정하실 수 있습니다.',
    ja: '表示価格にはすべて部品代と部品の90日保証が含まれます。機器を開ける前に見積もりを出し、開けた後に見積もりが変わった場合は、改めてご判断いただけます。',
  },
  device: { en: 'Device', ko: '기기', ja: '機器' },
  note: { en: 'In HK$. Cash, Octopus or FPS.', ko: '단위는 HK$입니다. 현금, Octopus 또는 FPS로 결제합니다.', ja: '単位はHK$です。現金、Octopus、FPSでお支払いいただけます。' },
  from: { en: 'from', ko: '최저', ja: '〜から' },
  takes: { en: 'Takes', ko: '소요 시간', ja: '所要時間' },
  currency: { en: 'HK$', ko: 'HK$', ja: 'HK$' },
} satisfies Record<string, Tri>;

const DEVICES: Array<{ id: DeviceId; name: Tri; services: Service[] }> = [
  {
    id: 'phones',
    name: { en: 'Phones', ko: '휴대폰', ja: 'スマートフォン' },
    services: [
      {
        name: { en: 'Screen replacement', ko: '화면 교체', ja: '画面交換' },
        note: {
          en: 'OLED or LCD, fitted and sealed at the counter. iPhone 11 to 15, Galaxy S21 to S24, Pixel 6 to 8.',
          ko: 'OLED 또는 LCD이며, 카운터에서 장착하고 밀봉합니다. iPhone 11~15, Galaxy S21~S24, Pixel 6~8을 지원합니다.',
          ja: 'OLEDまたはLCD。カウンターで取り付けて密封します。iPhone 11〜15、Galaxy S21〜S24、Pixel 6〜8に対応します。',
        },
        time: { en: '40 min', ko: '40분', ja: '40分' },
        from: true,
        price: '480',
      },
      {
        name: { en: 'Battery swap', ko: '배터리 교체', ja: 'バッテリー交換' },
        note: {
          en: 'A new cell and a new adhesive seal. Battery health reads 100% when you leave.',
          ko: '새 셀과 새 접착 씰을 씁니다. 떠나실 때 배터리 상태는 100%로 표시됩니다.',
          ja: '新しいセルと新しい接着シールを使用します。お持ち帰りの際、バッテリーの状態は100%と表示されます。',
        },
        time: { en: '20 min', ko: '20분', ja: '20分' },
        from: false,
        price: '280',
      },
      {
        name: { en: 'Data recovery', ko: '데이터 복구', ja: 'データ復旧' },
        note: {
          en: 'From phones that will not start, or after water. You pay only if we recover the files you list.',
          ko: '전원이 켜지지 않거나 침수된 휴대폰이 대상입니다. 지정하신 파일을 복구한 경우에만 요금을 받습니다.',
          ja: '電源が入らないスマートフォン、または水没したスマートフォンが対象です。ご指定のファイルを復旧できた場合にのみ料金をいただきます。',
        },
        time: { en: '1 to 3 nights', ko: '1~3일', ja: '1〜3日' },
        from: true,
        price: '900',
      },
      {
        name: { en: 'Charging port', ko: '충전 포트', ja: '充電ポート' },
        note: {
          en: 'Cleaned first at no charge, and replaced only if cleaning does not fix it.',
          ko: '먼저 무료로 청소하고, 청소로 해결되지 않을 때만 교체합니다.',
          ja: 'まず無料で清掃し、清掃で直らない場合にのみ交換します。',
        },
        time: { en: '30 min', ko: '30분', ja: '30分' },
        from: false,
        price: '220',
      },
      {
        name: { en: 'Back glass', ko: '후면 유리', ja: '背面ガラス' },
        note: {
          en: 'The cracked glass comes off by laser. New panel and camera lens cover.',
          ko: '깨진 유리는 레이저로 떼어냅니다. 새 패널과 카메라 렌즈 커버를 장착합니다.',
          ja: '割れたガラスはレーザーで取り外します。新しいパネルとカメラレンズカバーを取り付けます。',
        },
        time: { en: '90 min', ko: '90분', ja: '90分' },
        from: false,
        price: '420',
      },
    ],
  },
  {
    id: 'tablets',
    name: { en: 'Tablets', ko: '태블릿', ja: 'タブレット' },
    services: [
      {
        name: { en: 'Screen and touch glass', ko: '화면과 터치 유리', ja: '画面とタッチガラス' },
        note: {
          en: 'Replaced together, so the glass sits flat. iPad 7th to 10th generation, iPad Air 3 to 5, Galaxy Tab S7 to S9.',
          ko: '유리가 평평하게 맞도록 화면과 터치 유리를 함께 교체합니다. iPad 7~10세대, iPad Air 3~5, Galaxy Tab S7~S9를 지원합니다.',
          ja: 'ガラスが平らに収まるよう、画面とタッチガラスを一緒に交換します。iPad 第7〜10世代、iPad Air 3〜5、Galaxy Tab S7〜S9に対応します。',
        },
        time: { en: '2 hours', ko: '2시간', ja: '2時間' },
        from: true,
        price: '950',
      },
      {
        name: { en: 'Battery', ko: '배터리', ja: 'バッテリー' },
        note: {
          en: 'Tablet batteries are glued in. We fit the new one tonight and keep the tablet until the adhesive has set.',
          ko: '태블릿 배터리는 접착제로 고정되어 있습니다. 오늘 밤 새 배터리를 장착하고, 접착제가 굳을 때까지 태블릿을 보관합니다.',
          ja: 'タブレットのバッテリーは接着されています。今夜新しいバッテリーを取り付け、接着剤が固まるまでタブレットをお預かりします。',
        },
        time: { en: 'Next night', ko: '다음 날 밤', ja: '翌日の夜' },
        from: true,
        price: '650',
      },
      {
        name: { en: 'Charging port', ko: '충전 포트', ja: '充電ポート' },
        note: {
          en: 'USB-C and Lightning ports, on a new flex cable.',
          ko: 'USB-C와 Lightning 포트를 새 플렉스 케이블에 장착합니다.',
          ja: 'USB-CとLightningのポートを、新しいフレックスケーブルに交換します。',
        },
        time: { en: '60 min', ko: '60분', ja: '60分' },
        from: false,
        price: '380',
      },
      {
        name: { en: 'Water damage', ko: '침수 피해', ja: '水没' },
        note: {
          en: 'Opened, cleaned in the ultrasonic bath and dried overnight. No charge if it does not come back.',
          ko: '분해해서 초음파 세척기로 씻고 하룻밤 말립니다. 복구되지 않으면 요금을 받지 않습니다.',
          ja: '分解して超音波洗浄機で洗浄し、一晩乾燥させます。復旧しなかった場合は料金をいただきません。',
        },
        time: { en: '1 night', ko: '하룻밤', ja: '一晩' },
        from: false,
        price: '450',
      },
      {
        name: { en: 'Bent frame', ko: '휜 프레임', ja: '曲がったフレーム' },
        note: {
          en: 'Pressed straight before a new screen goes on, so it does not crack again in a week.',
          ko: '새 화면을 붙이기 전에 프레임을 펴서, 일주일 안에 다시 금이 가지 않게 합니다.',
          ja: '新しい画面を取り付ける前にフレームを矯正し、1週間以内に再び割れないようにします。',
        },
        time: { en: '30 min', ko: '30분', ja: '30分' },
        from: false,
        price: '300',
      },
    ],
  },
  {
    id: 'laptops',
    name: { en: 'Laptops', ko: '노트북', ja: 'ノートパソコン' },
    services: [
      {
        name: { en: 'Screen', ko: '화면', ja: '画面' },
        note: {
          en: 'MacBook Air and Pro from 2018, ThinkPad T and X series, Dell XPS 13. Panels we do not stock arrive in two days.',
          ko: '2018년 이후 MacBook Air 및 Pro, ThinkPad T·X 시리즈, Dell XPS 13을 지원합니다. 재고가 없는 패널은 이틀 안에 들어옵니다.',
          ja: '2018年以降のMacBook AirとPro、ThinkPad TおよびXシリーズ、Dell XPS 13に対応します。在庫のないパネルは2日で入荷します。',
        },
        time: { en: '1 to 2 nights', ko: '1~2일', ja: '1〜2日' },
        from: true,
        price: '1,600',
      },
      {
        name: { en: 'Keyboard', ko: '키보드', ja: 'キーボード' },
        note: {
          en: 'MacBook Air M1 and M2 keyboards in stock. Other models are ordered and fitted two nights later.',
          ko: 'MacBook Air M1·M2 키보드는 재고가 있습니다. 다른 모델은 주문한 뒤 이틀 후에 장착합니다.',
          ja: 'MacBook Air M1・M2のキーボードは在庫があります。その他のモデルは注文後、2日後に取り付けます。',
        },
        time: { en: '1 night', ko: '하룻밤', ja: '一晩' },
        from: true,
        price: '1,100',
      },
      {
        name: { en: 'Battery', ko: '배터리', ja: 'バッテリー' },
        note: {
          en: 'Cells of the original capacity. The cycle count starts again at zero.',
          ko: '원래 용량의 셀을 사용합니다. 충전 사이클 횟수는 0부터 다시 셉니다.',
          ja: '純正と同じ容量のセルを使用します。充放電サイクル数は0から数え直します。',
        },
        time: { en: '90 min', ko: '90분', ja: '90分' },
        from: true,
        price: '780',
      },
      {
        name: { en: 'Data recovery', ko: '데이터 복구', ja: 'データ復旧' },
        note: {
          en: 'From drives that will not mount, after a spill or a failed update. You pay only if we recover the files you list.',
          ko: '드라이브가 마운트되지 않는 경우가 대상입니다. 액체를 쏟았거나 업데이트가 실패한 뒤에도 가능합니다. 지정하신 파일을 복구한 경우에만 요금을 받습니다.',
          ja: '液体をこぼした後や、更新に失敗した後などにマウントできなくなったドライブが対象です。ご指定のファイルを復旧できた場合にのみ料金をいただきます。',
        },
        time: { en: '1 to 3 nights', ko: '1~3일', ja: '1〜3日' },
        from: true,
        price: '1,200',
      },
      {
        name: { en: 'Fan and thermal paste', ko: '팬과 써멀 페이스트', ja: 'ファンとサーマルペースト' },
        note: {
          en: 'Dust out, new paste on the processor, and a new fan if the old one rattles.',
          ko: '먼지를 제거하고 프로세서에 새 페이스트를 바릅니다. 기존 팬에서 덜걱거리는 소리가 나면 새 팬으로 교체합니다.',
          ja: 'ほこりを除去し、プロセッサーに新しいペーストを塗ります。古いファンがガタガタ鳴る場合は、新しいファンに交換します。',
        },
        time: { en: '60 min', ko: '60분', ja: '60分' },
        from: false,
        price: '350',
      },
    ],
  },
  {
    id: 'consoles',
    name: { en: 'Consoles', ko: '게임기', ja: 'ゲーム機' },
    services: [
      {
        name: { en: 'Joy-Con stick', ko: 'Joy-Con 스틱', ja: 'Joy-Con スティック' },
        note: {
          en: 'Hall-effect sticks that do not drift. Both sticks of a pair for HK$ 300.',
          ko: '드리프트가 없는 홀 센서 스틱입니다. 한 쌍의 양쪽 스틱을 모두 교체하면 HK$ 300입니다.',
          ja: 'ドリフトしないホール効果センサー式スティックです。一対の両スティックを交換する場合はHK$ 300です。',
        },
        time: { en: '20 min', ko: '20분', ja: '20分' },
        from: false,
        price: '180',
      },
      {
        name: { en: 'Switch screen', ko: 'Switch 화면', ja: 'Switch 画面' },
        note: {
          en: 'Switch, Switch Lite and Switch OLED, with new touch glass.',
          ko: 'Switch, Switch Lite, Switch OLED 모두 새 터치 유리로 교체합니다.',
          ja: 'Switch、Switch Lite、Switch OLEDの新しいタッチガラスに交換します。',
        },
        time: { en: '90 min', ko: '90분', ja: '90分' },
        from: true,
        price: '520',
      },
      {
        name: { en: 'HDMI port', ko: 'HDMI 포트', ja: 'HDMIポート' },
        note: {
          en: 'PS5 and Xbox Series X ports, soldered at the bench and tested on a 4K screen.',
          ko: 'PS5와 Xbox Series X 포트를 작업대에서 납땜하고 4K 화면에서 테스트합니다.',
          ja: 'PS5とXbox Series Xのポートを作業台ではんだ付けし、4K画面で動作を確認します。',
        },
        time: { en: '1 night', ko: '하룻밤', ja: '一晩' },
        from: false,
        price: '650',
      },
      {
        name: { en: 'Disc drive', ko: '디스크 드라이브', ja: 'ディスクドライブ' },
        note: {
          en: 'A new laser or drive belt for PS4, PS5, Xbox One and Series X.',
          ko: 'PS4, PS5, Xbox One, Series X용 새 레이저 또는 드라이브 벨트입니다.',
          ja: 'PS4、PS5、Xbox One、Series X用の新しいレーザーまたはドライブベルトです。',
        },
        time: { en: '1 night', ko: '하룻밤', ja: '一晩' },
        from: true,
        price: '480',
      },
      {
        name: { en: 'Clean and repaste', ko: '청소 및 페이스트 교체', ja: '清掃とペーストの塗り直し' },
        note: {
          en: 'For consoles that run loud or switch themselves off. Dust out, new paste and thermal pads.',
          ko: '소음이 크거나 저절로 꺼지는 게임기용입니다. 먼지를 제거하고 새 페이스트와 써멀 패드를 교체합니다.',
          ja: '動作音が大きい、または勝手に電源が切れるゲーム機向けです。ほこりを除去し、新しいペーストとサーマルパッドに交換します。',
        },
        time: { en: '60 min', ko: '60분', ja: '60分' },
        from: false,
        price: '320',
      },
    ],
  },
];

type QueueState = 'ready' | 'bench' | 'called' | 'part' | 'queued';

interface Ticket {
  n: number;
  /** A device name, or what the visitor typed when taking a ticket. */
  device: string;
  repair: Tri;
  state: QueueState;
  /** Shown in the State column, except for queued tickets. */
  stateText?: Tri;
  progress?: number;
  doneBy: string;
  /** What the lookup says about a ticket that is not simply queued. */
  summary?: Tri;
  /** Said after the queued sentence. */
  extra?: Tri;
  /** What the visitor chose, on a ticket taken from this page. */
  problem?: ProblemId;
}

const QUEUE_BASE: Ticket[] = [
  {
    n: 44,
    device: 'Galaxy S22',
    repair: { en: 'Screen', ko: '화면', ja: '画面' },
    state: 'ready',
    stateText: { en: 'Ready to collect', ko: '수령 가능', ja: '受け取り可能' },
    doneBy: '21:12',
    summary: {
      en: 'Your Galaxy S22 has been ready since 21:12. Collect it at the counter with this ticket.',
      ko: '고객님의 Galaxy S22는 21:12부터 수령 가능합니다. 이 번호표를 가지고 카운터에서 받아 가세요.',
      ja: 'Galaxy S22は21:12から受け取り可能です。この整理券をお持ちのうえ、カウンターでお受け取りください。',
    },
  },
  {
    n: 45,
    device: 'iPhone 13',
    repair: { en: 'Battery', ko: '배터리', ja: 'バッテリー' },
    state: 'bench',
    stateText: { en: 'Bench 1', ko: '1번 작업대', ja: '1番作業台' },
    progress: 87,
    doneBy: '21:43',
    summary: {
      en: 'Your iPhone 13 is on bench 1 with Kit, about 3 minutes left. Wait by the counter.',
      ko: '고객님의 iPhone 13은 1번 작업대에서 Kit이 작업 중이며, 약 3분 남았습니다. 카운터 근처에서 기다려 주세요.',
      ja: 'iPhone 13は1番作業台でKitが作業中で、残り約3分です。カウンター付近でお待ちください。',
    },
  },
  {
    n: 46,
    device: 'MacBook Air M1',
    repair: { en: 'Data recovery', ko: '데이터 복구', ja: 'データ復旧' },
    state: 'bench',
    stateText: { en: 'Bench 3', ko: '3번 작업대', ja: '3番作業台' },
    progress: 42,
    doneBy: '23:10',
    summary: {
      en: 'Your MacBook Air is on bench 3 with Marco. 100 of 238 GB are copied so far, and it should be done around 23:10.',
      ko: '고객님의 MacBook Air는 3번 작업대에서 Marco가 작업 중입니다. 238GB 중 100GB를 복사했으며, 23:10쯤 끝날 예정입니다.',
      ja: 'MacBook Airは3番作業台でMarcoが作業中です。238GBのうち100GBのコピーが完了しており、23:10頃に終わる予定です。',
    },
  },
  {
    n: 47,
    device: 'Pixel 7',
    repair: { en: 'Screen', ko: '화면', ja: '画面' },
    state: 'called',
    stateText: { en: 'Called to bench 2', ko: '2번 작업대로 호출됨', ja: '2番作業台へ呼び出し中' },
    doneBy: '22:20',
    summary: {
      en: 'Your number is on the screen now. Bring the Pixel 7 to bench 2, where Joy is waiting.',
      ko: '지금 고객님의 번호가 화면에 떴습니다. Pixel 7을 2번 작업대로 가져와 주세요. Joy가 기다리고 있습니다.',
      ja: '今、お客様の番号が画面に表示されています。Pixel 7を2番作業台までお持ちください。Joyがお待ちしています。',
    },
  },
  {
    n: 48,
    device: 'iPad, 9th generation',
    repair: { en: 'Charging port', ko: '충전 포트', ja: '充電ポート' },
    state: 'part',
    stateText: { en: 'Waiting for the part, due 23:30', ko: '부품 대기 중, 23:30 도착 예정', ja: '部品待ち、23:30入荷予定' },
    doneBy: '00:10',
    summary: {
      en: 'Waiting for the part, due at 23:30. Your iPad goes on a bench as soon as it arrives and should be done around 00:10.',
      ko: '부품 대기 중이며 23:30 도착 예정입니다. 부품이 도착하는 대로 고객님의 iPad를 작업대에 올리며, 00:10쯤 끝날 예정입니다.',
      ja: '部品待ちで、23:30入荷予定です。部品が届き次第お客様のiPadを作業台に乗せ、00:10頃に終わる予定です。',
    },
  },
  { n: 49, device: 'Switch OLED', repair: { en: 'Joy-Con stick', ko: 'Joy-Con 스틱', ja: 'Joy-Con スティック' }, state: 'queued', doneBy: '22:05' },
  { n: 50, device: 'Galaxy A54', repair: { en: 'Battery', ko: '배터리', ja: 'バッテリー' }, state: 'queued', doneBy: '22:30' },
  { n: 51, device: 'iPhone 12 mini', repair: { en: 'Back glass', ko: '후면 유리', ja: '背面ガラス' }, state: 'queued', doneBy: '22:50' },
  {
    n: 52,
    device: 'iPhone 14',
    repair: { en: 'Screen', ko: '화면', ja: '画面' },
    state: 'queued',
    doneBy: '23:05',
    extra: { en: 'The screen for it is already set aside.', ko: '이 기기의 화면은 이미 따로 준비해 두었습니다.', ja: 'この機種の画面はすでに取り分けてあります。' },
  },
];

const FIRST_TICKET = QUEUE_BASE[0].n;
const NEXT_TICKET = QUEUE_BASE[QUEUE_BASE.length - 1].n + 1;
// A ticket taken now is done 1 h 50 min from now, at 23:30; each one after it 25 minutes later.
const FIRST_WAIT = 110;
const FIRST_DONE = 23 * 60 + 30;
const STEP = 25;
// After six more tickets the last one is done at 01:35, and the benches are full until closing.
const MAX_TAKEN = 6;

const QUEUE = {
  title: { en: 'Queue', ko: '대기열', ja: '待ち行列' },
  intro: {
    en: 'Take a ticket at the counter or from this page. Numbers are called on the screen above the stall, and a missed number is held for 15 minutes.',
    ko: '카운터에서 또는 이 페이지에서 번호표를 받으세요. 번호는 매대 위 화면에 호출되며, 놓친 번호는 15분 동안 보관합니다.',
    ja: '整理券は、カウンターかこのページで受け取れます。番号は屋台の上の画面で呼び出され、呼ばれた番号を逃した場合は15分間保留します。',
  },
  label: { en: 'Your ticket', ko: '내 번호표', ja: 'あなたの整理券' },
  find: { en: 'Find my ticket', ko: '내 번호표 찾기', ja: '整理券を確認' },
  format: { en: 'Write the three-digit number on your ticket, like 052.', ko: '번호표에 적힌 세 자리 숫자를 입력하세요. 예: 052', ja: '整理券に書かれた3桁の番号を入力してください。例: 052' },
  collected: {
    en: 'Ticket {n} was collected earlier tonight. If you still have the device with you, show this ticket at the counter.',
    ko: '{n}번 번호표는 오늘 밤 앞서 이미 수령되었습니다. 기기를 아직 가지고 계시면 카운터에서 이 번호표를 보여 주세요.',
    ja: '{n}番の整理券は今夜すでに受け取られています。機器をお持ちの場合は、カウンターでこの整理券をお見せください。',
  },
  notYet: {
    en: 'Ticket {n} has not been given out yet tonight. The next ticket is {next}.',
    ko: '{n}번 번호표는 오늘 밤 아직 발급되지 않았습니다. 다음 번호표는 {next}번입니다.',
    ja: '{n}番の整理券は今夜まだ発行されていません。次の整理券は{next}番です。',
  },
  notTonight: {
    en: 'Ticket {n} has not been given out, and tonight’s queue is full.',
    ko: '{n}번 번호표는 발급되지 않았으며, 오늘 밤 대기열은 가득 찼습니다.',
    ja: '{n}番の整理券は発行されておらず、今夜の待ち行列は満席です。',
  },
  next: { en: 'You are next. Your {device} should be done around {time}.', ko: '다음 차례입니다. {device} 작업은 {time}쯤 끝날 예정입니다.', ja: '次の番です。{device}は{time}頃に終わる予定です。' },
  one: {
    en: 'One ticket ahead of you. Your {device} should be done around {time}.',
    ko: '앞에 1건이 대기 중입니다. {device} 작업은 {time}쯤 끝날 예정입니다.',
    ja: '前に1件待っています。{device}は{time}頃に終わる予定です。',
  },
  many: {
    en: '{count} tickets ahead of you. Your {device} should be done around {time}.',
    ko: '앞에 {count}건이 대기 중입니다. {device} 작업은 {time}쯤 끝날 예정입니다.',
    ja: '前に{count}件待っています。{device}は{time}頃に終わる予定です。',
  },
  table: { en: 'Tonight’s queue', ko: '오늘 밤 대기열', ja: '今夜の待ち行列' },
  colTicket: { en: 'Ticket', ko: '번호', ja: '番号' },
  colDevice: { en: 'Device', ko: '기기', ja: '機器' },
  colRepair: { en: 'Repair', ko: '수리', ja: '修理' },
  colState: { en: 'State', ko: '상태', ja: '状態' },
  colDone: { en: 'Done by', ko: '완료 예정', ja: '完了予定' },
  queued: { en: 'Queued', ko: '대기 중', ja: '待機中' },
  yours: { en: '{state}, your ticket', ko: '{state}, 내 번호표', ja: '{state}、あなたの整理券' },
} satisfies Record<string, Tri>;

type ProblemId = 'screen' | 'battery' | 'port' | 'water' | 'start' | 'other';

const PROBLEMS: Array<{ id: ProblemId; name: Tri; repair: Tri }> = [
  { id: 'screen', name: { en: 'Screen', ko: '화면', ja: '画面' }, repair: { en: 'Screen', ko: '화면', ja: '画面' } },
  { id: 'battery', name: { en: 'Battery', ko: '배터리', ja: 'バッテリー' }, repair: { en: 'Battery', ko: '배터리', ja: 'バッテリー' } },
  { id: 'port', name: { en: 'Charging port', ko: '충전 포트', ja: '充電ポート' }, repair: { en: 'Charging port', ko: '충전 포트', ja: '充電ポート' } },
  { id: 'water', name: { en: 'Water damage', ko: '침수 피해', ja: '水没' }, repair: { en: 'Water damage', ko: '침수 피해', ja: '水没' } },
  { id: 'start', name: { en: 'Will not start', ko: '켜지지 않음', ja: '電源が入らない' }, repair: { en: 'Check first', ko: '먼저 확인', ja: '要確認' } },
  { id: 'other', name: { en: 'Something else', ko: '기타', ja: 'その他' }, repair: { en: 'Check first', ko: '먼저 확인', ja: '要確認' } },
];

const TAKE = {
  title: { en: 'Take a queue ticket', ko: '대기 번호표 받기', ja: '整理券を取る' },
  intro: {
    en: 'Tell us the device and what is wrong, and you get the next number. Bring the device to the counter before your number comes up; we look at it there before it goes on a bench.',
    ko: '기기와 증상을 알려 주시면 다음 번호를 드립니다. 번호가 불리기 전에 기기를 카운터로 가져와 주세요. 작업대에 올리기 전에 카운터에서 먼저 확인합니다.',
    ja: '機器と不具合の内容をお知らせいただくと、次の番号をお渡しします。番号が呼ばれる前に機器をカウンターまでお持ちください。作業台に乗せる前に、カウンターで確認します。',
  },
  rule: {
    en: 'One ticket for each device. Tickets are given out until 02:15.',
    ko: '기기 한 대당 번호표는 한 장입니다. 번호표는 02:15까지 발급합니다.',
    ja: '機器1台につき整理券は1枚です。整理券は02:15まで発行します。',
  },
  device: { en: 'Device', ko: '기기', ja: '機器' },
  deviceHint: { en: 'For example iPhone 14 or Switch OLED', ko: '예: iPhone 14 또는 Switch OLED', ja: '例: iPhone 14 または Switch OLED' },
  deviceError: { en: 'Write the device, for example Galaxy A54.', ko: '기기명을 입력하세요. 예: Galaxy A54', ja: '機器名を入力してください。例: Galaxy A54' },
  problem: { en: 'What is wrong', ko: '증상', ja: '不具合の内容' },
  problemError: { en: 'Choose what is wrong, or Something else.', ko: '증상을 고르거나 기타를 선택하세요.', ja: '不具合の内容を選ぶか、その他を選んでください。' },
  submit: { en: 'Take ticket {n}', ko: '{n}번 번호표 받기', ja: '{n}番の整理券を取る' },
  doneTitle: { en: 'Ticket {n} is yours.', ko: '{n}번 번호표가 발급되었습니다.', ja: '{n}番の整理券を発行しました。' },
  doneBody: {
    en: '{device}, {problem}. About {wait} from now, done around {time}. It is marked as your ticket in the queue above, and a missed number is held for 15 minutes.',
    ko: '{device}, {problem}. 지금부터 약 {wait} 뒤, {time}쯤 끝날 예정입니다. 위 대기열에 내 번호표로 표시되며, 놓친 번호는 15분 동안 보관합니다.',
    ja: '{device}、{problem}。今から約{wait}後、{time}頃に終わる予定です。上の待ち行列にお客様の整理券として表示され、呼ばれた番号を逃した場合は15分間保留します。',
  },
  again: { en: 'Take another ticket', ko: '다른 번호표 받기', ja: '別の整理券を取る' },
  full: {
    en: 'Tonight’s queue is full. Come to the counter: if a bench frees up before 02:15, we take walk-ins.',
    ko: '오늘 밤 대기열이 가득 찼습니다. 카운터로 오세요. 02:15 전에 작업대가 비면 현장 접수를 받습니다.',
    ja: '今夜の待ち行列は満席です。カウンターまでお越しください。02:15までに作業台が空けば、その場での受付を行います。',
  },
} satisfies Record<string, Tri>;

const PARTS = {
  title: { en: 'Parts in stock', ko: '재고 부품', ja: '在庫部品' },
  intro: {
    en: 'Counted at 19:00 tonight. Message us the model and we will hold a part for 24 hours.',
    ko: '오늘 밤 19:00 기준으로 집계한 수량입니다. 기종을 메시지로 알려 주시면 부품을 24시간 동안 보관해 드립니다.',
    ja: '今夜19:00時点で集計した数量です。機種をメッセージでお知らせいただければ、部品を24時間お取り置きします。',
  },
  inStock: { en: 'in stock', ko: '재고', ja: '在庫' },
} satisfies Record<string, Tri>;

const DRAWERS: Array<{ count: number; part: Tri; fits: Tri; level?: 'low' | 'out' }> = [
  { count: 6, part: { en: 'iPhone 13 screen', ko: 'iPhone 13 화면', ja: 'iPhone 13 画面' }, fits: { en: 'OLED, original grade', ko: 'OLED, 정품 등급', ja: 'OLED、純正グレード' } },
  { count: 2, part: { en: 'iPhone 14 screen', ko: 'iPhone 14 화면', ja: 'iPhone 14 画面' }, fits: { en: 'One held for ticket 052', ko: '052번 번호표용 1개 보관 중', ja: '整理券052番用に1個取り置き中' }, level: 'low' },
  { count: 0, part: { en: 'iPhone 15 screen', ko: 'iPhone 15 화면', ja: 'iPhone 15 画面' }, fits: { en: 'Next delivery Thursday', ko: '다음 입고 목요일', ja: '次回入荷は木曜日' }, level: 'out' },
  { count: 3, part: { en: 'Galaxy S23 screen', ko: 'Galaxy S23 화면', ja: 'Galaxy S23 画面' }, fits: { en: 'With frame, fitted in 50 min', ko: '프레임 포함, 50분 내 장착', ja: 'フレーム付き、50分で取り付け' } },
  { count: 4, part: { en: 'Pixel 7 screen', ko: 'Pixel 7 화면', ja: 'Pixel 7 画面' }, fits: { en: 'With frame', ko: '프레임 포함', ja: 'フレーム付き' } },
  { count: 23, part: { en: 'iPhone batteries', ko: 'iPhone 배터리', ja: 'iPhone バッテリー' }, fits: { en: 'iPhone 11 to 14', ko: 'iPhone 11~14', ja: 'iPhone 11〜14' } },
  { count: 11, part: { en: 'Galaxy batteries', ko: 'Galaxy 배터리', ja: 'Galaxy バッテリー' }, fits: { en: 'S21 to S23', ko: 'S21~S23', ja: 'S21〜S23' } },
  { count: 18, part: { en: 'USB-C ports', ko: 'USB-C 포트', ja: 'USB-Cポート' }, fits: { en: 'Galaxy A and S series', ko: 'Galaxy A·S 시리즈', ja: 'Galaxy AおよびSシリーズ' } },
  { count: 9, part: { en: 'Lightning ports', ko: 'Lightning 포트', ja: 'Lightningポート' }, fits: { en: 'iPhone 11 to 14', ko: 'iPhone 11~14', ja: 'iPhone 11〜14' } },
  { count: 1, part: { en: 'MacBook Air keyboard', ko: 'MacBook Air 키보드', ja: 'MacBook Air キーボード' }, fits: { en: 'M1 and M2, US layout', ko: 'M1·M2, US 배열', ja: 'M1・M2、US配列' }, level: 'low' },
  { count: 40, part: { en: 'Joy-Con sticks', ko: 'Joy-Con 스틱', ja: 'Joy-Con スティック' }, fits: { en: 'Hall-effect, no drift', ko: '홀 센서, 드리프트 없음', ja: 'ホール効果センサー、ドリフトなし' } },
  { count: 7, part: { en: '1 TB drives', ko: '1TB 드라이브', ja: '1TBドライブ' }, fits: { en: 'For recovered data, HK$ 520', ko: '데이터 복구용, HK$ 520', ja: 'データ復旧用、HK$ 520' } },
];

const FIND = {
  title: { en: 'Find the stall', ko: '매대 찾기', ja: '屋台を探す' },
  intro: {
    en: 'The market has five rows off one main aisle. We are near the middle, two minutes from the gate.',
    ko: '시장에는 중앙 통로 양쪽으로 다섯 개 열이 있습니다. 저희는 가운데 근처에 있으며, 입구에서 걸어서 2분 거리입니다.',
    ja: '市場には中央通路から5つの列が延びています。当店は中ほどにあり、入口から歩いて2分です。',
  },
  plan: {
    en: 'Plan of the market: rows A to E off the main aisle. The walk goes from the Temple Lane gate up the aisle, right into Row C at the fish-ball stall, to stall 14.',
    ko: '시장 배치도: 중앙 통로 양쪽으로 A열부터 E열까지 있습니다. 템플 레인 입구에서 통로를 따라 올라가, 피시볼 가게에서 오른쪽으로 C열에 들어서면 14번 매대입니다.',
    ja: '市場の配置図：中央通路に沿ってA列からE列まで並びます。テンプル・レーンの入口から通路を進み、魚団子の屋台で右に曲がってC列に入ると、14番屋台です。',
  },
  gate: { en: 'Temple Lane gate', ko: '템플 레인 입구', ja: 'テンプル・レーン入口' },
  keyStall: { en: 'Sector 9 Repair, C14', ko: 'Sector 9 Repair, C14', ja: 'Sector 9 Repair, C14' },
  keyCorner: { en: 'Fish-ball stall on the corner', ko: '모퉁이의 피시볼 가게', ja: '角の魚団子の屋台' },
  keyWalk: { en: 'The walk from the gate', ko: '입구에서 가는 길', ja: '入口からの道順' },
  row: { en: 'Row C', ko: 'C열', ja: 'C列' },
  stall: { en: 'stall 14', ko: '14번 매대', ja: '14番屋台' },
  where: { en: 'Temple Lane night market, Kowloon.', ko: '홍콩 구룡, 템플 레인 야시장.', ja: '香港九龍、テンプル・レーン夜市。' },
  steps: { en: 'The walk from the gate', ko: '입구에서 가는 길', ja: '入口からの道順' },
  closed: { en: 'Closed', ko: '휴무', ja: '休業日' },
  closedNote: {
    en: 'on Tuesdays, and whenever typhoon signal 8 or higher is up.',
    ko: '화요일과 태풍 신호 8호 이상이 발령된 때에 쉽니다.',
    ja: '毎週火曜日と、台風8号以上の信号が出ているときです。',
  },
} satisfies Record<string, Tri>;

const STEPS: Tri[] = [
  { en: 'Come in at the Temple Lane gate, next to the 24-hour pharmacy.', ko: '템플 레인 입구로 들어오세요. 24시간 약국 옆입니다.', ja: 'テンプル・レーンの入口から入ってください。24時間営業の薬局の隣です。' },
  { en: 'Walk up the main aisle past Rows E and D, about 60 metres.', ko: '중앙 통로를 따라 E열과 D열을 지나 약 60m 올라가세요.', ja: '中央通路を進み、E列とD列の前を通って約60m歩いてください。' },
  { en: 'Turn right into Row C at the fish-ball stall.', ko: '피시볼 가게에서 오른쪽으로 꺾어 C열로 들어가세요.', ja: '魚団子の屋台で右に曲がり、C列に入ってください。' },
  { en: 'We are the 14th stall on the left, under the yellow sign with the 9.', ko: '왼쪽에서 14번째 매대입니다. 9가 적힌 노란 간판이 표시입니다.', ja: '左側の14番目の屋台です。9と書かれた黄色い看板が目印です。' },
];

const ROWS = ['A', 'B', 'C', 'D', 'E'];

const FOOT = {
  address: { en: 'Row C, stall 14, Temple Lane night market, Kowloon', ko: 'C열 14번 매대, 템플 레인 야시장, 구룡', ja: '香港九龍、テンプル・レーン夜市 C列14番屋台' },
  hours: { en: 'Hours', ko: '영업시간', ja: '営業時間' },
  hoursValue: { en: '19:00 to 03:00, Wednesday to Monday', ko: '19:00~03:00, 수요일~월요일', ja: '19:00〜03:00、水曜日〜月曜日' },
  messages: { en: 'Messages', ko: '메시지', ja: 'メッセージ' },
  messagesValue: { en: 'WhatsApp or Signal, answered from 18:00', ko: 'WhatsApp 또는 Signal, 18:00부터 답장', ja: 'WhatsApp または Signal、18:00から返信' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Cyberpunk Glitch style: a near-black ground with a faint cyan grid and scanlines, three neons with one meaning each, square corners, neon frames with corner brackets, and an RGB split on the name.

Pick a believable subject that lives on numbers read from across a dark room, such as a repair stall in a night market, an arcade's prize counter or a late-night noodle bar's order screen, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Sector 9 Repair, a phone, tablet and laptop repair stall at Row C, stall 14 of the Temple Lane night market in Kowloon: tonight's hours, the number being served, the price board, the queue with a ticket lookup and a ticket form, the parts in stock and the walk from the gate.

TOKENS:
--bg: #09090b
--surface: #16161a (opaque, for any menu that opens over the page)
--ink: #e2e8f0
--muted: #a7b0c0
--line: rgba(226,232,240,0.28)
--line-strong: rgba(226,232,240,0.5)
--yellow: #fde047
--cyan: #22d3ee
--magenta: #d946ef
--hover: cyan at 14% over --bg (color-mix), for the device keys and the problem cells

COLOUR:
- Yellow is what to look at now: the stall's name and hours, the number being served, prices, the next ticket, your ticket, the stall on the plan, the buttons.
- Cyan is on a bench, in stock, a link or a chosen option: bench meters, part counts, times, in-page links, the selected device key and problem cell, the focus ring.
- Magenta is waiting or wrong: a job waiting for a part, a part running low, the now-serving frame, and form errors.
- No other hues. Every tint, stripe and glow is one of the three neons or ink at an alpha: frame fills 4% (the price board a cyan wash from 8% to 2%), the lookup and confirmation 6%, your queue row 9%, hazard stripes yellow 9%, low-stock stripes magenta 12%, out-of-stock stripes ink 7%. The ground carries a 1px cyan grid at 5% every 30px, and the whole page sits under fixed scanlines (2px clear, 2px black at 16%). Muted text keeps at least 4.5:1; structural lines are 1px at 0.28 or 0.5, section rules 1px cyan.

TYPOGRAPHY:
Two families. Tektur (400 to 900, width axis 75 to 100) sets the stall's name, headings, service and part names, buttons and every figure. Red Hat Mono (400, and 500 on the yellow "Ready to collect" bar) says everything else.
Name: Tektur 800 at full width, uppercase, line-height 0.84, letter-spacing -0.02em, two lines ("Sector 9" / "Repair"); clamp(3rem, 18vw, 13.5rem) below 1080px and clamp(6.5rem, 9.7vw, 7.75rem) from 1080px. Its split is a 3px magenta shadow down-right and a 3px cyan shadow up-left (1.8px below 760px).
H2: Tektur 700, clamp(2rem, 3.6vw, 3rem), line-height 1.05, letter-spacing -0.025em, sentence case, with a 2px magenta and cyan sideways split at 85%.
Service names Tektur 600 1.5rem (1.375rem at 480px and below); part names Tektur 600 1.25rem; the ticket form heading Tektur 700 clamp(1.75rem, 2.6vw, 2.25rem); the hours Tektur 700 1.375rem; the stall mark Tektur 800 1.25rem; buttons Tektur 600 1.125rem; footer names Tektur 700 1.125rem.
Figures drop to the condensed end of the width axis (font-stretch 75%), Tektur 700, tabular: the number being served 6rem in the desktop display and clamp(6rem, 11vw, 9rem) when stacked; prices clamp(2.75rem, 4.6vw, 4rem); queue tickets 1.75rem; the ticket field 1.875rem; part counts 3rem; step numbers 1.5rem. The stall address ("Row C / stall 14") is Tektur 800 uppercase at clamp(2.5rem, 4.4vw, 3.75rem) with a 2px split.
Body: Red Hat Mono 400 at 1rem, line-height 1.65; the lede 1.1875rem, line-height 1.55 (1.125rem at 480px and below); device keys and "Now serving" 1.0625rem; text fields 1.125rem. No text under 1rem. No all-caps tracked labels.

LAYOUT:
- A 1120px column. The stall's bar: the name on the left and four in-page links in cyan on the right, on a 1px cyan rule, at least 60px tall; below 760px the links wrap under the name. Every link and control is at least 44px tall.
- Hero from 1080px: two columns, 28fr and 26fr with a 32px gap. Left: the hours on hazard tape, the name, the lede, a yellow outline button "Take a queue ticket" and a cyan underlined link. Right: the now-serving display and one muted line about tonight's three benches. On a 1280x800 laptop the name and the whole display sit on the first screen. Below 1080px everything stacks in that order, the display at most 640px wide.
- Section heads: the H2 left and a muted intro right (5fr and 6fr, bottom aligned), one column below 1080px. Sections 112px apart, 88px below 760px.
- Then the price board, the queue (lookup, queue screen, ticket form), the parts cabinet, the plan with the walk, and a three-column footer on a cyan rule (one column below 760px).

COMPONENTS:
- Hazard tape: 2px yellow border, -45° stripes of yellow at 9% every 18px, a lit 14x20px square before the hours, the walk-in and closing note in yellow at 82%.
- Neon frame: 1px border with 3px corner brackets 18px long at the top left and bottom right. Magenta for the now-serving display, cyan for the price board.
- Now serving: "Now serving" with a lit square, the number with a 3px split, the job and bench beside it; three bench lines, each the job and its state on one line over a 20px meter of cyan segments (10px lit, 2px gap) with a 14px glow; a finished job is a solid yellow bar reading "Ready to collect"; a last line names the next ticket in yellow and the wait.
- Price board: a device switch that is a real tab list (Phones, Tablets, Laptops, Consoles): keys 44px tall with 1px cyan walls, the selected key solid cyan with dark text, arrow keys, Home and End move and select. One tab panel of five services: name and note, the time in cyan, the price right-aligned with "from" when it varies, lit as a dot matrix (a 3px grid of dots masked over the figure) with a 7px yellow glow. Below 1080px the time moves under the name; on phones the note takes the full width and the time and price share the last line.
- Ticket lookup: a yellow frame at 6% with "Your ticket", a three-digit field (52px tall, 2px yellow border, 4px yellow halo at 20%) and a "Find my ticket" button. A known number marks its row in the queue and says what happens next (tickets ahead and the time, or bench, ready, called, waiting for a part). An unknown number, a number collected earlier tonight, a number not given out yet or anything that is not a number shows a magenta error with a lit square next to the field (role alert); the frame turns magenta and no row stays marked.
- Queue screen: a table with explicit roles: ticket, device, repair, state, done by. State squares: solid yellow ready, solid cyan on a bench or called, 2px magenta outline waiting for a part, 1px muted outline queued; a bench job also shows a 120px segmented bar. The called number is yellow with a 1px split; your row has a 9% yellow wash and a 4px yellow edge, and its state ends with ", your ticket". On phones each ticket is one block: the number on the left, then device, repair, state and "Done by".
- Ticket form, under a cyan rule: what to do on the left (5fr), the form on the right (6fr). A device field (52px, 1px line-strong border) with a hint, and "What is wrong" as one radio group of six square cells with shared 1px walls, three across (two below 760px), the chosen cell solid cyan. One solid yellow button that names the number: "Take ticket 053". Errors sit under their field in magenta; the first invalid field takes focus. A valid ticket replaces the form with a confirmation in a yellow frame that takes focus, adds the row to the queue as your ticket, and moves the next number on; after six tickets the queue is full and says so.
- Parts cabinet: one grid with 1px shared walls, four across (three below 1080px, two below 760px), each drawer a count, the part and what it fits. Running low: magenta count and note on magenta stripes; out of stock: muted count on ink stripes.
- The plan: 18 columns, rows A to E as strips of 16 stalls off one aisle, the gate as a cyan block, the corner stall outlined in cyan, our stall solid yellow with a 3px split, the walk as a dashed cyan line (7 on, 5 off); a legend under it, then the address large, four numbered steps (a real sequence) and when the stall is closed.
- Square corners everywhere. Focus ring 2px cyan at 3px offset; yellow on the device keys, the problem cells and the ticket field. The confirmation shows its ring on focus.

MOTION:
- The name has two copies behind it, cyan and magenta, each clipped to a band. When the page opens they slide between five positions for about 3.75 seconds (3s and 2.5s linear runs, 1.25 and 1.5 times, alternating) and then hold still; they slide again only while the pointer rests on the name. They slide, never blink, so nothing flashes.
- The two lit squares (hours and "Now serving") blink three times, once every 1.1 seconds, then stay lit.
- Hover changes fill and colour, over 160ms on buttons, device keys and problem cells; buttons light up yellow with a 22px glow.
- prefers-reduced-motion: no slices moving, no blinking, no transitions.

FORBIDDEN:
- Cards, rounded boxes, pills, chips, badges, glass panels
- A small label above a heading, all-caps tracked labels, numbered section markers
- Neon text or fills outside the colour rules (the RGB split on the name, headings and address is the only decoration), gradient text, extra hues
- Endless glitch loops, flicker, flashing, text that jitters while it is read
- Circuit-board art, skylines, figures, photographs, emoji, binary-code backgrounds, terminal prompts
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about hacking, the future, neon or the style itself

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a tab list and one tab panel for the price board, a table with roles for the queue, a radio group for the problems, labelled forms, an ordered list for the walk
3) Working device switch, ticket lookup with its errors, ticket form with error and success states that adds the ticket to the queue
4) Responsive layout down to 320px with no horizontal scroll; the queue becomes one block per ticket on phones
5) Visible focus on every control, a text alternative for the plan, the slices kept out of the heading's accessible name, reduced-motion support`;

const PROMPT_KO = `사이버펑크 글리치 스타일로 실제 페이지 하나를 만든다. 거의 검은 바탕에 옅은 시안 격자와 주사선을 깔고, 네온 세 가지는 각각 의미를 하나만 갖는다. 모서리는 직각으로 하고, 모서리 브래킷이 달린 네온 테두리를 쓰며, 이름에는 RGB 분할을 준다.

어두운 방 건너편에서 읽는 숫자에 의존하는 그럴듯한 주제를 고르고, 그 주제의 실제 내용을 쓴다. 야시장 수리 매대, 오락실 경품 카운터, 심야 국숫집 주문 화면이 예다. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체에 관한 페이지로 읽혀서는 안 된다. 여기서는 구룡 템플 레인 야시장 C열 14번 매대의 휴대폰, 태블릿, 노트북 수리점 Sector 9 Repair다. 오늘 밤 영업시간, 호출 중인 번호, 가격판, 번호표 조회와 번호표 양식이 있는 대기열, 재고 부품, 입구에서 가는 길을 담는다.

TOKENS:
--bg: #09090b
--surface: #16161a (불투명, 페이지 위에 열리는 메뉴용)
--ink: #e2e8f0
--muted: #a7b0c0
--line: rgba(226,232,240,0.28)
--line-strong: rgba(226,232,240,0.5)
--yellow: #fde047
--cyan: #22d3ee
--magenta: #d946ef
--hover: --bg 위의 시안 14%(color-mix), 기기 키와 증상 셀용

COLOUR:
- 노랑은 지금 볼 것: 매대 이름과 영업시간, 호출 중인 번호, 가격, 다음 번호, 내 번호표, 배치도의 매대, 버튼.
- 시안은 작업대, 재고, 링크, 선택된 옵션: 작업대 게이지, 부품 수량, 시간, 페이지 내 링크, 선택된 기기 키와 증상 셀, 포커스 링.
- 마젠타는 대기 중이거나 잘못된 것: 부품을 기다리는 작업, 재고가 부족한 부품, 호출 중 번호 프레임, 양식 오류.
- 다른 색은 쓰지 않는다. 모든 틴트, 줄무늬, 빛 번짐은 세 네온 중 하나이거나 투명도를 준 잉크여야 한다: 프레임 채움 4%(가격판은 시안 8%에서 2%까지 흐리게), 번호표 조회와 확인 6%, 내 대기열 행 9%, 노란 빗금 9%, 재고 부족 마젠타 빗금 12%, 재고 없음 잉크 빗금 7%.
- 바탕에는 30px마다 5% 시안 1px 격자를 깐다. 페이지 전체에 고정 주사선(투명 2px, 검정 2px 16%)을 얹는다. 흐린 글자는 명도 대비 4.5:1 이상을 유지한다. 구조선은 1px에 0.28 또는 0.5, 섹션 구분선은 1px 시안.

TYPOGRAPHY:
두 서체 패밀리를 쓴다. Tektur(400~900, 너비 축 75~100)는 매대 이름, 제목, 서비스와 부품 이름, 버튼, 모든 숫자를 맡는다. Red Hat Mono(400, 노란 "수령 가능" 막대에서만 500)는 그 밖의 모든 글을 맡는다.
이름: Tektur 800, 전체 너비, 대문자, 줄 높이 0.84, 자간 -0.02em, 두 줄("Sector 9" / "Repair"). 1080px 미만은 clamp(3rem, 18vw, 13.5rem), 1080px 이상은 clamp(6.5rem, 9.7vw, 7.75rem). 분할은 아래-오른쪽 3px 마젠타 그림자와 위-왼쪽 3px 시안 그림자(760px 미만은 1.8px).
H2: Tektur 700, clamp(2rem, 3.6vw, 3rem), 줄 높이 1.05, 자간 -0.025em, 문장형 대소문자. 85% 지점에 2px 마젠타와 시안의 좌우 분할.
서비스 이름 Tektur 600 1.5rem(480px 이하 1.375rem), 부품 이름 Tektur 600 1.25rem, 번호표 양식 제목 Tektur 700 clamp(1.75rem, 2.6vw, 2.25rem), 영업시간 Tektur 700 1.375rem, 매대 마크 Tektur 800 1.25rem, 버튼 Tektur 600 1.125rem, 바닥글 이름 Tektur 700 1.125rem.
숫자는 너비 축의 좁은 끝(font-stretch 75%), Tektur 700, 고정폭으로 쓴다. 데스크톱 디스플레이의 현재 번호 6rem, 쌓인 배치에서는 clamp(6rem, 11vw, 9rem). 가격 clamp(2.75rem, 4.6vw, 4rem), 대기 번호 1.75rem, 번호표 입력 칸 1.875rem, 부품 수량 3rem, 단계 번호 1.5rem. 매대 주소("C열 / 14번 매대")는 Tektur 800 대문자, clamp(2.5rem, 4.4vw, 3.75rem), 2px 분할.
본문: Red Hat Mono 400, 1rem, 줄 높이 1.65. 도입 문단은 1.1875rem, 줄 높이 1.55(480px 이하 1.125rem). 기기 키와 "현재 번호"는 1.0625rem, 입력 칸은 1.125rem. 1rem보다 작은 글자 금지. 자간을 넓힌 대문자 라벨 금지.

LAYOUT:
- 1120px 칼럼. 매대 바: 왼쪽에 이름, 오른쪽에 시안 페이지 내 링크 4개를 1px 시안 구분선 위에 둔다. 높이 60px 이상. 760px 미만에서는 링크가 이름 아래로 줄바꿈한다. 모든 링크와 컨트롤은 높이 44px 이상.
- 히어로(1080px 이상): 32px 간격의 두 칼럼, 28fr과 26fr. 왼쪽: 빗금 테이프 위의 영업시간, 이름, 도입 문단, 노란 외곽선 버튼 "대기 번호표 받기", 시안 밑줄 링크. 오른쪽: 현재 번호 디스플레이와 오늘 밤 작업대 세 곳을 설명하는 흐린 한 줄. 1280x800 노트북에서는 이름과 디스플레이 전체가 첫 화면에 들어온다. 1080px 미만에서는 위 순서대로 모두 쌓고, 디스플레이 최대 너비 640px.
- 섹션 머리: 왼쪽에 H2, 오른쪽에 흐린 소개 문단(5fr과 6fr, 아래 정렬). 1080px 미만은 한 칼럼. 섹션 간격 112px, 760px 미만은 88px.
- 이후 가격판, 대기열(조회, 대기 화면, 번호표 양식), 부품 보관함, 도보 경로가 있는 배치도, 시안 구분선 위의 세 칼럼 바닥글(760px 미만은 한 칼럼).

COMPONENTS:
- 빗금 테이프: 노란 2px 테두리, 18px마다 9% 노랑 -45° 줄무늬, 영업시간 앞에 빛나는 14x20px 사각형, 입장과 마감 안내는 노랑 82%.
- 네온 프레임: 1px 테두리, 왼쪽 위와 오른쪽 아래에 길이 18px의 3px 모서리 브래킷. 현재 번호 디스플레이는 마젠타, 가격판은 시안.
- 현재 번호: "현재 번호"와 빛나는 사각형, 3px 분할이 있는 번호, 옆에 작업과 작업대. 작업대 줄 세 개는 각각 작업과 상태를 한 줄에 쓰고, 그 아래 20px 게이지(시안 세그먼트 10px 점등, 간격 2px, 14px 글로우). 끝난 작업은 "수령 가능"이라 적힌 노란 실선 막대. 마지막 줄은 다음 번호와 대기 시간을 노랑으로 쓴다.
- 가격판: 실제 탭 목록인 기기 전환(휴대폰, 태블릿, 노트북, 게임기). 키는 높이 44px, 1px 시안 테두리, 선택된 키는 시안 채움에 어두운 글자. 화살표 키, Home, End로 이동하고 선택한다. 탭 패널 하나에 서비스 다섯 개: 이름과 설명, 시안 소요 시간, 가격은 오른쪽 정렬하며 가격이 달라지면 "최저"를 붙인다. 가격은 숫자 위에 덮은 3px 점 격자 도트 매트릭스로 밝히고 7px 노란 글로우를 준다. 1080px 미만은 소요 시간을 이름 아래로 내린다. 휴대폰에서는 설명이 전체 너비를 쓰고, 소요 시간과 가격이 마지막 줄을 함께 쓴다.
- 번호표 조회: "내 번호표" 라벨이 있는 6% 노란 프레임, 세 자리 입력 칸(높이 52px, 2px 노란 테두리, 20% 노란 4px 후광), "내 번호표 찾기" 버튼. 찾은 번호는 대기열에서 해당 행을 표시하고 다음에 일어날 일을 말한다(앞선 대기 수와 시간, 또는 작업대, 수령 가능, 호출 중, 부품 대기). 없는 번호, 오늘 밤 이미 수령한 번호, 아직 발급되지 않은 번호, 숫자가 아닌 입력은 입력 칸 옆에 빛나는 사각형과 함께 마젠타 오류를 보인다(role alert). 프레임은 마젠타로 바뀌고 어떤 행도 표시하지 않는다.
- 대기 화면: 역할을 명시한 표(번호, 기기, 수리, 상태, 완료 예정). 상태 사각형: 수령 가능은 노랑 실선, 작업대와 호출 중은 시안 실선, 부품 대기는 2px 마젠타 외곽선, 대기 중은 1px 흐린 외곽선. 작업대 작업에는 120px 세그먼트 게이지를 붙인다. 호출 중 번호는 1px 분할이 있는 노랑. 내 행은 9% 노란 틴트와 4px 노란 가장자리, 상태는 ", 내 번호표"로 끝낸다. 휴대폰에서는 번호마다 한 블록: 왼쪽에 번호, 이어서 기기, 수리, 상태, "완료 예정".
- 번호표 양식: 시안 구분선 아래. 왼쪽(5fr)에 할 일, 오른쪽(6fr)에 양식. 기기 입력 칸(52px, 1px line-strong 테두리)과 힌트. "증상"은 공유 1px 벽의 정사각형 셀 여섯 개 라디오 그룹, 세 칸씩(760px 미만은 두 칸), 선택된 셀은 시안 실선. 노란 실선 버튼 하나에 번호를 쓴다: "053번 번호표 받기". 오류는 해당 입력 아래에 마젠타로 표시하고, 첫 번째 잘못된 입력에 포커스를 준다. 유효한 번호표를 내면 양식을 노란 프레임의 확인 화면으로 바꾸고, 이 화면이 포커스를 받는다. 대기열에 내 번호표로 행을 추가하고 다음 번호를 넘긴다. 여섯 장 이후에는 대기열이 가득 찼다고 알린다.
- 부품 보관함: 1px 공유 벽의 격자, 네 칸(1080px 미만 세 칸, 760px 미만 두 칸). 각 서랍에 수량, 부품, 맞는 기종. 재고가 부족하면 수량과 메모를 마젠타로, 빗금도 마젠타. 재고가 없으면 흐린 수량과 잉크 빗금.
- 배치도: 18열 격자. A열부터 E열까지 중앙 통로 하나에 붙은 16개 매대의 띠. 입구는 시안 블록, 모서리 매대는 시안 외곽선, 우리 매대는 3px 분할이 있는 노란 실선, 도보 경로는 시안 점선(7 켜짐, 5 꺼짐). 아래에 범례, 큰 글씨 주소, 번호가 붙은 4단계 안내(실제 순서), 매대가 문을 닫는 조건.
- 모든 곳에 각진 모서리. 포커스 링은 3px 간격의 2px 시안이며, 기기 키, 증상 셀, 번호표 입력 칸은 노랑. 확인 화면은 포커스를 받으면 링을 보인다.

MOTION:
- 이름 뒤에는 시안과 마젠타 두 복사본이 있고, 각각 띠에 잘려 있다. 페이지가 열리면 다섯 위치 사이를 약 3.75초 미끄러진 뒤 멈춘다(3초와 2.5초 선형 주행, 1.25배와 1.5배, 번갈아). 포인터가 이름 위에 머무는 동안에만 다시 미끄러진다. 미끄러질 뿐 깜빡이지 않는다.
- 두 빛나는 사각형(영업시간과 현재 번호)은 1.1초마다 세 번 깜빡인 뒤 켜진 채로 둔다.
- 호버는 버튼, 기기 키, 증상 셀에서 160ms에 걸쳐 채움과 색을 바꾼다. 버튼은 22px 글로우와 함께 노랑으로 켜진다.
- prefers-reduced-motion: 움직이는 조각, 깜빡임, 전환 없음.

FORBIDDEN:
- 카드, 둥근 상자, 알약 모양, 칩, 배지, 유리 패널
- 제목 위의 작은 라벨, 자간을 넓힌 대문자 라벨, 번호가 붙은 섹션 표시
- 색 규칙 밖의 네온 글자나 채움(이름, 제목, 주소의 RGB 분할만 장식으로 허용), 그라데이션 글자, 추가 색조
- 끝없는 글리치 반복, 깜빡임, 번쩍임, 읽는 동안 떨리는 글자
- 회로 기판 그림, 스카이라인, 인물, 사진, 이모지, 이진 코드 배경, 터미널 프롬프트
- 링크의 화살표, 가운뎃점으로 이은 메타 문자열, 실제 순서가 아닌 곳의 번호
- 해킹, 미래, 네온, 스타일 자체에 관한 문구

OUTPUT:
1) 위 토큰의 CSS 사용자 지정 속성
2) 시맨틱 HTML: 가격판은 탭 목록과 탭 패널 하나, 대기열은 역할이 있는 표, 증상은 라디오 그룹, 라벨이 있는 양식, 도보 경로는 순서 목록
3) 작동하는 기기 전환, 오류가 있는 번호표 조회, 오류와 성공 상태가 있는 번호표 양식(번호표를 대기열에 추가)
4) 320px까지 반응형, 가로 스크롤 없음. 휴대폰에서는 대기열이 번호표마다 한 블록
5) 모든 컨트롤의 보이는 포커스, 배치도의 텍스트 대체 설명, 글리치 조각이 제목의 접근성 이름에 들어가지 않게 함, 동작 감소 지원`;

const PROMPT_JA = `サイバーパンク・グリッチのスタイルで、実在するページを1枚デザインする。ほぼ黒の背景に薄いシアンのグリッドとスキャンラインを敷き、ネオンは3色、それぞれ意味は1つだけにする。角は直角、コーナーブラケット付きのネオン枠を使い、名前にはRGB分割を入れる。

暗い部屋の向こうから読む数字に頼る、もっともらしいテーマを選び、その実際の内容を書く。夜市の修理屋台、ゲームセンターの景品カウンター、深夜の麺屋の注文画面などが例になる。ページはそのテーマのページとして読めなければならず、スタイル自体についてのページに見えてはならない。ここでは、九龍テンプル・レーン夜市C列14番屋台の、スマートフォン・タブレット・ノートパソコン修理店Sector 9 Repairとする。今夜の営業時間、呼び出し中の番号、料金表、整理券の照会と整理券フォームのある待ち行列、在庫部品、入口からの道順を載せる。

TOKENS:
--bg: #09090b
--surface: #16161a（不透明。ページの上に開くメニュー用）
--ink: #e2e8f0
--muted: #a7b0c0
--line: rgba(226,232,240,0.28)
--line-strong: rgba(226,232,240,0.5)
--yellow: #fde047
--cyan: #22d3ee
--magenta: #d946ef
--hover: --bg の上のシアン14%（color-mix）。機器キーと症状セル用

COLOUR:
- 黄色は今見るべきもの。屋台の名前と営業時間、呼び出し中の番号、料金、次の番号、自分の整理券、配置図の屋台、ボタン。
- シアンは作業台、在庫、リンク、選択された項目。作業台のゲージ、部品の数、時間、ページ内リンク、選択された機器キーと症状セル、フォーカスリング。
- マゼンタは待機中または不具合。部品待ちの作業、残りわずかの部品、呼び出し中の番号の枠、フォームのエラー。
- 他の色は使わない。すべての色味、縞、光の広がりは、3つのネオンのいずれか、または透明度を付けたインクでなければならない。枠の塗り4%（料金板はシアン8%から2%へ薄くする）、整理券の照会と確認6%、自分の待ち行列の行9%、黄色の斜線9%、残りわずかのマゼンタの斜線12%、在庫切れのインクの斜線7%。
- 背景には30pxごとに5%のシアン1pxグリッドを敷く。ページ全体に固定のスキャンライン（透明2px、黒2px・16%）をかける。薄い文字は明度コントラスト4.5:1以上を保つ。構造線は1pxで0.28または0.5、セクションの区切り線は1pxのシアン。

TYPOGRAPHY:
フォントは2系統。Tektur（400〜900、幅の軸75〜100）は屋台の名前、見出し、サービス名と部品名、ボタン、すべての数字を組む。Red Hat Mono（400。黄色の「受け取り可能」バーだけ500）はそれ以外のすべてを組む。
名前: Tektur 800、全幅、大文字、行の高さ0.84、字間-0.02em、2行（"Sector 9" / "Repair"）。1080px未満は clamp(3rem, 18vw, 13.5rem)、1080px以上は clamp(6.5rem, 9.7vw, 7.75rem)。分割は右下に3pxのマゼンタの影、左上に3pxのシアンの影（760px未満は1.8px）。
H2: Tektur 700、clamp(2rem, 3.6vw, 3rem)、行の高さ1.05、字間-0.025em、文頭のみ大文字。85%の位置に2pxのマゼンタとシアンの左右分割。
サービス名 Tektur 600 1.5rem（480px以下は1.375rem）、部品名 Tektur 600 1.25rem、整理券フォームの見出し Tektur 700 clamp(1.75rem, 2.6vw, 2.25rem)、営業時間 Tektur 700 1.375rem、屋台のマーク Tektur 800 1.25rem、ボタン Tektur 600 1.125rem、フッターの名前 Tektur 700 1.125rem。
数字は幅の軸の狭い側（font-stretch 75%）、Tektur 700、等幅にする。デスクトップの表示の呼び出し中番号は6rem、積み重ねた配置では clamp(6rem, 11vw, 9rem)。料金は clamp(2.75rem, 4.6vw, 4rem)、整理券の番号は1.75rem、整理券の入力欄は1.875rem、部品の数は3rem、手順番号は1.5rem。屋台の住所（"C列 / 14番屋台"）は Tektur 800 大文字、clamp(2.5rem, 4.4vw, 3.75rem)、2pxの分割。
本文: Red Hat Mono 400、1rem、行の高さ1.65。導入文は1.1875rem、行の高さ1.55（480px以下は1.125rem）。機器キーと「現在の番号」は1.0625rem、入力欄は1.125rem。1remより小さい文字は使わない。字間を空けた大文字のラベルは使わない。

LAYOUT:
- 1120pxのカラム。屋台のバー: 左に名前、右に4つのページ内リンク（シアン）。1pxのシアンの罫線の上に置き、高さは60px以上。760px未満ではリンクが名前の下に折り返す。すべてのリンクと操作部は高さ44px以上。
- ヒーロー（1080px以上）: 間隔32pxの2カラム、28frと26fr。左: 斜線テープ上の営業時間、名前、導入文、黄色の輪郭ボタン「整理券を取る」、シアンの下線付きリンク。右: 呼び出し中の番号の表示と、今夜の作業台3つを説明する薄い1行。1280x800のノートパソコンでは、名前と表示の全体が最初の画面に収まる。1080px未満では上の順序ですべて積み重ね、表示は最大幅640px。
- セクションの見出し: 左にH2、右に薄い導入文（5frと6fr、下揃え）。1080px未満は1カラム。セクションの間隔は112px、760px未満は88px。
- 続けて、料金板、待ち行列（照会、待ち画面、整理券フォーム）、部品の棚、徒歩の道順を含む配置図、シアンの罫線の上の3カラムのフッター（760px未満は1カラム）。

COMPONENTS:
- 斜線テープ: 2pxの黄色の枠、18pxごとに9%の黄色の-45°の縞、営業時間の前に14x20pxの光る四角、入場と閉店の案内は黄色82%。
- ネオン枠: 1pxの枠。左上と右下に長さ18px、太さ3pxの角のブラケット。現在の番号の表示はマゼンタ、料金板はシアン。
- 現在の番号: 「現在の番号」と光る四角、3pxの分割がある番号、その横に作業と作業台。作業台の行3つは、それぞれ作業と状態を1行に書き、その下に20pxのゲージ（シアンのセグメント10px点灯、間隔2px、14pxのグロー）。終わった作業は「受け取り可能」と書かれた黄色の実線のバー。最後の行は次の番号と待ち時間を黄色で書く。
- 料金板: 実際のタブリストである機器の切り替え（スマートフォン、タブレット、ノートパソコン、ゲーム機）。キーは高さ44px、1pxのシアンの枠。選択されたキーはシアンの塗りに暗い文字。矢印キー、Home、Endで移動し選択する。タブパネルは1つ、サービスは5つ。名前と説明、シアンの所要時間、価格は右揃え。価格が変わるものには「〜から」を付ける。価格は数字に重ねた3pxのドットのグリッド（ドットマトリクス）で光らせ、7pxの黄色のグロー。1080px未満では所要時間を名前の下へ移す。スマートフォンでは説明が全幅を使い、所要時間と価格が最後の行を共有する。
- 整理券の照会: 「自分の整理券」ラベルのある6%の黄色の枠。3桁の入力欄（高さ52px、2pxの黄色の枠、20%の黄色の4pxのハロ）と「整理券を確認」ボタン。見つかった番号は待ち行列でその行を示し、次に起こることを伝える（前の待ちの数と時間、または作業台、受け取り可能、呼び出し中、部品待ち）。見つからない番号、今夜すでに受け取られた番号、まだ発行されていない番号、数字でない入力は、入力欄の横に光る四角とマゼンタのエラーを出す（role alert）。枠はマゼンタになり、どの行も示さない。
- 待ち画面: 役割を明示した表（番号、機器、修理、状態、完了予定）。状態の四角: 受け取り可能は黄色の実線、作業台と呼び出し中はシアンの実線、部品待ちは2pxのマゼンタの輪郭、待機中は1pxの薄い輪郭。作業台の作業には120pxのセグメントのゲージを付ける。呼び出し中の番号は1pxの分割がある黄色。自分の行は9%の黄色の色味と4pxの黄色の縁で、状態は「、自分の整理券」で終わる。スマートフォンでは番号ごとに1ブロック: 左に番号、続いて機器、修理、状態、「完了予定」。
- 整理券フォーム: シアンの罫線の下。左（5fr）に手順、右（6fr）にフォーム。機器の入力欄（52px、1pxの line-strong の枠）と説明。「症状」は共有の1pxの壁を持つ正方形の6つのセルによるラジオグループ、3つずつ（760px未満は2つずつ）、選択されたセルはシアンの実線。黄色の実線のボタン1つに番号を入れる: 「053番の整理券を取る」。エラーはその入力欄の下にマゼンタで表示し、最初の不正な入力にフォーカスを移す。有効な整理券を出すと、フォームは黄色の枠の確認画面に置き換わり、その画面がフォーカスを受ける。待ち行列に自分の整理券として行を追加し、次の番号を進める。6枚の後は待ち行列が満席であることを伝える。
- 部品の棚: 1pxの共有の壁の格子、4列（1080px未満は3列、760px未満は2列）。各引き出しに数、部品、合う機種。残りわずかならば数と注記をマゼンタにし、斜線もマゼンタ。在庫切れならば薄い数とインクの斜線。
- 配置図: 18列の格子。A列からE列までを、中央通路1本に沿った16屋台ずつの帯として並べる。入口はシアンのブロック、角の屋台はシアンの輪郭、当店は3pxの分割がある黄色の実線、徒歩の道順はシアンの破線（7つ点灯、5つ消灯）。その下に凡例、大きな文字の住所、番号付きの4段階の案内（実際の順序）、屋台が閉まっている場合。
- どこも角は直角。フォーカスリングは3pxの間隔の2pxシアン。機器キー、症状セル、整理券の入力欄は黄色。確認画面はフォーカスを受けるとリングを示す。

MOTION:
- 名前の背後には、シアンとマゼンタの2つのコピーがあり、それぞれ帯で切り取られている。ページが開くと5つの位置の間を約3.75秒かけてすべり、その後止まる（3秒と2.5秒の等速走行、1.25倍と1.5倍を交互に）。ポインターが名前の上にとどまっている間だけ、再びすべる。すべるだけで点滅はしない。
- 2つの光る四角（営業時間と現在の番号）は1.1秒ごとに3回点滅し、その後は点灯したままにする。
- ホバーは、ボタン、機器キー、症状セルで160msかけて塗りと色を変える。ボタンは22pxのグローとともに黄色に点灯する。
- prefers-reduced-motion: 動く断片、点滅、トランジションなし。

FORBIDDEN:
- カード、角丸の箱、ピル型、チップ、バッジ、ガラス調のパネル
- 見出しの上の小さなラベル、字間を空けた大文字のラベル、番号付きのセクションの印
- 色のルールの外のネオンの文字や塗り（名前、見出し、住所のRGB分割のみを装飾として許可）、グラデーションの文字、追加の色相
- 終わらないグリッチの反復、ちらつき、点滅、読んでいる間に揺れる文字
- 回路基板の絵、スカイライン、人物、写真、絵文字、2進数コードの背景、ターミナルのプロンプト
- リンクの矢印、中黒で区切ったメタ文字列、実際の順序ではないものへの番号
- ハッキング、未来、ネオン、スタイルそのものについての文言

OUTPUT:
1) 上記のトークンのCSSカスタムプロパティ
2) セマンティックなHTML: 料金板はタブリストとタブパネル1つ、待ち行列は役割を付けた表、症状はラジオグループ、ラベル付きのフォーム、徒歩の道順は順序付きリスト
3) 動作する機器の切り替え、エラーを含む整理券の照会、エラーと成功の状態を持つ整理券フォーム（整理券を待ち行列に追加する）
4) 320pxまで対応するレスポンシブレイアウト、横スクロールなし。スマートフォンでは待ち行列を整理券ごとに1ブロックにする
5) すべての操作部の見えるフォーカス、配置図のテキストによる代替説明、グリッチの断片が見出しのアクセシブルネームに含まれないようにする、動きの軽減への対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

type FormErrors = { device: boolean; problem: boolean };
type Lookup = { kind: 'found'; n: number } | { kind: 'error'; message: string };

export function PortedCyberpunkGlitchPage({ lang }: PortedStylePageProps) {
  const [deviceId, setDeviceId] = useState<DeviceId>('phones');
  const [taken, setTaken] = useState<Ticket[]>([]);
  const [ticketInput, setTicketInput] = useState('052');
  const [lookup, setLookup] = useState<Lookup>({ kind: 'found', n: 52 });
  const lookupErrorRef = useRef<HTMLParagraphElement>(null);
  // On a phone the error can appear below the fold; bring it into view (the alert is also announced).
  useEffect(() => {
    if (lookup.kind === 'error') lookupErrorRef.current?.scrollIntoView({ block: 'nearest' });
  }, [lookup]);
  const [lookupNews, setLookupNews] = useState('');
  const [form, setForm] = useState<{ device: string; problem: ProblemId | '' }>({ device: '', problem: '' });
  const [errors, setErrors] = useState<FormErrors>({ device: false, problem: false });
  const [issued, setIssued] = useState<number | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const deviceRef = useRef<HTMLInputElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const wasIssued = useRef(false);

  const t = (text: Tri) => text[lang];

  const device = DEVICES.find((item) => item.id === deviceId) ?? DEVICES[0];
  const queue = [...QUEUE_BASE, ...taken];
  const nextNumber = NEXT_TICKET + taken.length;
  const full = taken.length >= MAX_TAKEN;
  const waitFor = (index: number) => {
    const minutes = FIRST_WAIT + STEP * index;
    return fill(t(WAIT), { h: Math.floor(minutes / 60), m: String(minutes % 60).padStart(2, '0') });
  };
  const found = lookup.kind === 'found' ? lookup.n : null;
  const issuedTicket = issued === null ? undefined : queue.find((ticket) => ticket.n === issued);

  // The form and the confirmation replace each other. Focus goes to what took the place
  // of the control that had it: the confirmation, or, after "Take another ticket", the
  // device field.
  useEffect(() => {
    if (issued !== null) doneRef.current?.focus();
    else if (wasIssued.current) deviceRef.current?.focus();
    wasIssued.current = issued !== null;
  }, [issued]);

  const describe = (ticket: Ticket) => {
    if (ticket.state !== 'queued') return t(ticket.summary ?? QUEUE.queued);
    const ahead = queue.filter((other) => other.state === 'queued' && other.n < ticket.n).length;
    const template = ahead === 0 ? QUEUE.next : ahead === 1 ? QUEUE.one : QUEUE.many;
    const sentence = fill(t(template), { count: ahead, device: ticket.device, time: ticket.doneBy });
    return ticket.extra ? `${sentence} ${t(ticket.extra)}` : sentence;
  };

  const chooseDevice = (index: number) => {
    const next = DEVICES[(index + DEVICES.length) % DEVICES.length];
    setDeviceId(next.id);
    tabRefs.current[DEVICES.indexOf(next)]?.focus();
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: DEVICES.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    chooseDevice(moves[event.key]);
  };

  const findTicket = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = ticketInput.trim();
    const fail = (message: string) => {
      setLookup({ kind: 'error', message });
      setLookupNews('');
    };
    if (!/^\d{1,3}$/.test(value)) {
      fail(t(QUEUE.format));
      return;
    }
    const n = Number(value);
    const ticket = queue.find((item) => item.n === n);
    if (!ticket) {
      const message = n < FIRST_TICKET ? QUEUE.collected : full ? QUEUE.notTonight : QUEUE.notYet;
      fail(fill(t(message), { n: pad(n), next: pad(nextNumber) }));
      return;
    }
    setTicketInput(pad(n));
    setLookup({ kind: 'found', n });
    setLookupNews(describe(ticket));
  };

  const takeTicket = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.device.trim();
    const next = { device: name === '', problem: form.problem === '' };
    if (next.device || next.problem) {
      // The error renders first, so the whole field can be brought into view above the fixed page bar.
      flushSync(() => setErrors(next));
      if (next.device) {
        deviceRef.current?.focus();
        deviceRef.current?.parentElement?.scrollIntoView({ block: 'nearest' });
      } else {
        problemRef.current?.querySelector<HTMLInputElement>('input')?.focus();
        problemRef.current?.scrollIntoView({ block: 'nearest' });
      }
      return;
    }
    const problem = PROBLEMS.find((item) => item.id === form.problem) ?? PROBLEMS[0];
    const index = taken.length;
    const ticket: Ticket = { n: nextNumber, device: name, repair: problem.repair, state: 'queued', doneBy: clock(FIRST_DONE + STEP * index), problem: problem.id };
    setErrors({ device: false, problem: false });
    setTaken([...taken, ticket]);
    // The new ticket becomes the one the queue marks as yours. The confirmation takes
    // focus and says so, so the lookup's live region stays quiet.
    setTicketInput(pad(ticket.n));
    setLookup({ kind: 'found', n: ticket.n });
    setLookupNews('');
    setIssued(ticket.n);
  };

  const takeAnother = () => {
    setForm({ device: '', problem: '' });
    setIssued(null);
  };

  const foundTicket = found === null ? undefined : queue.find((ticket) => ticket.n === found);

  return (
    <FusionShell
      fusionId="cyberpunk-glitch"
      lang={lang}
      tone="dark"
      accent="#22d3ee"
      prev={{ href: '/pages/kinetic-pop.html', label: 'Kinetic Pop' }}
      next={{ href: '/pages/swiss-poster.html', label: 'Swiss Poster' }}
      prompts={PROMPTS}
    >
      <div className="s9">
        <header className="s9-bar">
          <p className="s9-mark">{NAME}</p>
          <nav className="s9-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#s9-prices">{t(HEAD.prices)}</a>
            <a href="#s9-queue">{t(HEAD.queue)}</a>
            <a href="#s9-parts">{t(HEAD.parts)}</a>
            <a href="#s9-find">{t(HEAD.find)}</a>
          </nav>
        </header>

        <section className="s9-hero" aria-labelledby="s9-title">
          <div className="s9-hero__main">
            <p className="s9-hours">
              <b><i className="s9-sq s9-blink" aria-hidden="true" />{t(HERO.open)}</b> <span>{t(HERO.openNote)}</span>
            </p>
            <h1 className="s9-glitch" id="s9-title" data-text={NAME_LINES.join('\n')}>
              <span>{NAME_LINES[0]}</span> <span>{NAME_LINES[1]}</span>
            </h1>
            <p className="s9-lede">{t(HERO.lede)}</p>
            <div className="s9-actions">
              <a className="s9-btn" href="#s9-take">{t(HERO.take)}</a>
              <a className="s9-link" href="#s9-prices">{t(HERO.prices)}</a>
            </div>
          </div>

          <div className="s9-hero__side">
            <section className="s9-hud s9-frame" aria-labelledby="s9-now-label">
              <div className="s9-now">
                <p className="s9-now__label" id="s9-now-label"><i className="s9-sq s9-blink" aria-hidden="true" />{t(HUD.label)}</p>
                <p className="s9-now__num s9-num">{pad(NOW_SERVING)}</p>
                <p className="s9-now__what">{t(HUD.what)}<span>{t(HUD.where)}</span></p>
              </div>
              <ul className="s9-benches" aria-label={t(HUD.benches)}>
                {BENCHES.map((bench) => (
                  <li key={bench.job.en}>
                    <span className="s9-benches__job">{t(bench.job)}</span>
                    <span className="s9-benches__state">{t(bench.state)}</span>
                    {bench.progress === 100 ? (
                      <span className="s9-meter s9-meter--done"><b>{t(HUD.ready)}</b></span>
                    ) : (
                      <span className="s9-meter" aria-hidden="true"><i style={{ '--p': `${bench.progress}%` } as CSSProperties} /></span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="s9-hud__foot">
                {full ? t(HUD.full) : place(fill(t(HUD.next), { wait: waitFor(taken.length) }), 'n', <b>{pad(nextNumber)}</b>)}
              </p>
            </section>
            <p className="s9-hero__note">{t(HERO.benches)}</p>
          </div>
        </section>

        <section className="s9-section" id="s9-prices" aria-labelledby="s9-prices-title">
          <div className="s9-head">
            <h2 id="s9-prices-title">{t(PRICES.title)}</h2>
            <p className="s9-intro">{t(PRICES.intro)}</p>
          </div>
          <div className="s9-board s9-frame">
            <div className="s9-board__top">
              <div className="s9-seg" role="tablist" aria-label={t(PRICES.device)}>
                {DEVICES.map((item, index) => {
                  const selected = item.id === device.id;
                  return (
                    <button
                      key={item.id}
                      ref={(node) => {
                        tabRefs.current[index] = node;
                      }}
                      type="button"
                      role="tab"
                      id={`s9-tab-${item.id}`}
                      aria-selected={selected}
                      aria-controls="s9-price-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => chooseDevice(index)}
                      onKeyDown={(event) => onTabKey(event, index)}
                    >
                      {t(item.name)}
                    </button>
                  );
                })}
              </div>
              <p className="s9-board__note">{t(PRICES.note)}</p>
            </div>
            <div className="s9-board__panel" role="tabpanel" id="s9-price-panel" aria-labelledby={`s9-tab-${device.id}`} tabIndex={0}>
              <ul className="s9-rows">
                {device.services.map((service) => (
                  <li key={service.name.en} className="s9-row">
                    <div>
                      <h3>{t(service.name)}</h3>
                      <p>{t(service.note)}</p>
                    </div>
                    <p className="s9-time"><span className="s9-sr">{t(PRICES.takes)} </span>{t(service.time)}</p>
                    <p className="s9-price">
                      {service.from ? <small>{t(PRICES.from)}</small> : null}
                      <span className="s9-sr">{t(PRICES.currency)} </span>
                      <b className="s9-led s9-num"><span>{service.price}</span></b>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="s9-section" id="s9-queue" aria-labelledby="s9-queue-title">
          <div className="s9-head">
            <h2 id="s9-queue-title">{t(QUEUE.title)}</h2>
            <p className="s9-intro">{t(QUEUE.intro)}</p>
          </div>

          <div className={`s9-lookup${lookup.kind === 'error' ? ' is-invalid' : ''}`}>
            <form className="s9-lookup__form" noValidate onSubmit={findTicket}>
              <label htmlFor="s9-ticket">{t(QUEUE.label)}</label>
              <input
                id="s9-ticket"
                className="s9-num"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={ticketInput}
                aria-invalid={lookup.kind === 'error' || undefined}
                aria-describedby={lookup.kind === 'error' ? 's9-ticket-error' : undefined}
                onChange={(event) => setTicketInput(event.target.value)}
              />
              <button className="s9-btn s9-btn--small" type="submit">{t(QUEUE.find)}</button>
            </form>
            {lookup.kind === 'error' ? (
              <p className="s9-error" id="s9-ticket-error" role="alert" ref={lookupErrorRef}><i className="s9-sq" aria-hidden="true" />{lookup.message}</p>
            ) : foundTicket ? (
              <p className="s9-lookup__result">{describe(foundTicket)}</p>
            ) : null}
          </div>
          <p className="s9-sr" role="status">{lookupNews}</p>

          <div className="s9-q" role="table" aria-label={t(QUEUE.table)}>
            <div role="rowgroup">
              <div className="s9-q__row s9-q__row--head" role="row">
                <span role="columnheader">{t(QUEUE.colTicket)}</span>
                <span role="columnheader">{t(QUEUE.colDevice)}</span>
                <span role="columnheader">{t(QUEUE.colRepair)}</span>
                <span role="columnheader">{t(QUEUE.colState)}</span>
                <span role="columnheader">{t(QUEUE.colDone)}</span>
              </div>
            </div>
            <div role="rowgroup">
              {queue.map((ticket) => {
                const mine = ticket.n === found;
                const state = ticket.stateText ? t(ticket.stateText) : t(QUEUE.queued);
                return (
                  <div
                    key={ticket.n}
                    className={`s9-q__row is-${ticket.state}${mine ? ' is-you' : ''}${ticket.n === NOW_SERVING ? ' is-called' : ''}`}
                    role="row"
                    aria-current={mine ? 'true' : undefined}
                  >
                    <span className="s9-q__tk s9-num" role="rowheader">{pad(ticket.n)}</span>
                    <span className="s9-q__device" role="cell">{ticket.device}</span>
                    <span className="s9-q__repair" role="cell">{t(ticket.repair)}</span>
                    <span className="s9-q__state" role="cell">
                      <span className="s9-state">
                        <i className="s9-sq" aria-hidden="true" />
                        {mine ? fill(t(QUEUE.yours), { state }) : state}
                      </span>
                      {ticket.progress ? (
                        <span className="s9-blocks" aria-hidden="true"><i style={{ '--p': `${ticket.progress}%` } as CSSProperties} /></span>
                      ) : null}
                    </span>
                    <span className="s9-q__done" role="cell">
                      <span className="s9-q__label" aria-hidden="true">{t(QUEUE.colDone)} </span>
                      {ticket.doneBy}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="s9-take" id="s9-take">
            <div className="s9-take__intro">
              <h3>{t(TAKE.title)}</h3>
              <p>{t(TAKE.intro)}</p>
              <p className="s9-take__rule">{t(TAKE.rule)}</p>
            </div>
            {issuedTicket ? (
              <div className="s9-done">
                <p className="s9-done__title" ref={doneRef} tabIndex={-1}>
                  {place(t(TAKE.doneTitle), 'n', <b className="s9-num">{pad(issuedTicket.n)}</b>)}
                </p>
                <p className="s9-done__body">
                  {fill(t(TAKE.doneBody), {
                    device: issuedTicket.device,
                    problem: t((PROBLEMS.find((item) => item.id === issuedTicket.problem) ?? PROBLEMS[0]).name),
                    wait: waitFor(issuedTicket.n - NEXT_TICKET),
                    time: issuedTicket.doneBy,
                  })}
                </p>
                {full ? <p className="s9-done__full">{t(TAKE.full)}</p> : <button className="s9-btn" type="button" onClick={takeAnother}>{t(TAKE.again)}</button>}
              </div>
            ) : full ? (
              <p className="s9-take__full">{t(TAKE.full)}</p>
            ) : (
              <form className="s9-form" noValidate onSubmit={takeTicket}>
                <div className={`s9-field${errors.device ? ' is-invalid' : ''}`}>
                  <label htmlFor="s9-device">{t(TAKE.device)}</label>
                  <input
                    id="s9-device"
                    ref={deviceRef}
                    type="text"
                    autoComplete="off"
                    maxLength={40}
                    value={form.device}
                    aria-invalid={errors.device || undefined}
                    aria-describedby={errors.device ? 's9-device-hint s9-device-error' : 's9-device-hint'}
                    onChange={(event) => {
                      setForm({ ...form, device: event.target.value });
                      if (errors.device) setErrors({ ...errors, device: false });
                    }}
                  />
                  <p className="s9-field__hint" id="s9-device-hint">{t(TAKE.deviceHint)}</p>
                  {errors.device ? <p className="s9-error" id="s9-device-error" role="alert"><i className="s9-sq" aria-hidden="true" />{t(TAKE.deviceError)}</p> : null}
                </div>
                <div
                  className={`s9-field${errors.problem ? ' is-invalid' : ''}`}
                  role="radiogroup"
                  aria-labelledby="s9-problem-label"
                  aria-describedby={errors.problem ? 's9-problem-error' : undefined}
                  ref={problemRef}
                >
                  <p className="s9-field__label" id="s9-problem-label">{t(TAKE.problem)}</p>
                  <div className="s9-choices">
                    {PROBLEMS.map((problem) => (
                      <label key={problem.id} className={`s9-choice${form.problem === problem.id ? ' is-on' : ''}`}>
                        <input
                          className="s9-sr"
                          type="radio"
                          name="s9-problem"
                          value={problem.id}
                          checked={form.problem === problem.id}
                          onChange={() => {
                            setForm({ ...form, problem: problem.id });
                            if (errors.problem) setErrors({ ...errors, problem: false });
                          }}
                        />
                        {t(problem.name)}
                      </label>
                    ))}
                  </div>
                  {errors.problem ? <p className="s9-error" id="s9-problem-error" role="alert"><i className="s9-sq" aria-hidden="true" />{t(TAKE.problemError)}</p> : null}
                </div>
                <button className="s9-btn s9-btn--solid" type="submit">{fill(t(TAKE.submit), { n: pad(nextNumber) })}</button>
              </form>
            )}
          </div>
        </section>

        <section className="s9-section" id="s9-parts" aria-labelledby="s9-parts-title">
          <div className="s9-head">
            <h2 id="s9-parts-title">{t(PARTS.title)}</h2>
            <p className="s9-intro">{t(PARTS.intro)}</p>
          </div>
          <ul className="s9-cabinet">
            {DRAWERS.map((drawer) => (
              <li key={drawer.part.en} className={drawer.level ? `is-${drawer.level}` : undefined}>
                <b className="s9-count s9-num">{drawer.count}<span className="s9-sr"> {t(PARTS.inStock)}</span></b>
                <span className="s9-part">{t(drawer.part)}</span>
                <span className="s9-fits">{t(drawer.fits)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="s9-section" id="s9-find" aria-labelledby="s9-find-title">
          <div className="s9-head">
            <h2 id="s9-find-title">{t(FIND.title)}</h2>
            <p className="s9-intro">{t(FIND.intro)}</p>
          </div>
          <div className="s9-find">
            <div>
              <div className="s9-plan" role="img" aria-label={t(FIND.plan)}>
                {ROWS.map((row, index) => (
                  <Fragment key={row}>
                    <b className={`s9-rl${row === 'C' ? ' s9-rl--c' : ''}`} style={{ gridRow: index * 2 + 1 }}>{row}</b>
                    <i className="s9-strip" style={{ gridRow: index * 2 + 1 }} />
                  </Fragment>
                ))}
                <i className="s9-aisle" />
                <i className="s9-corner" />
                <i className="s9-stall" />
                <i className="s9-gate" />
                <span className="s9-gate-label">{t(FIND.gate)}</span>
                <svg className="s9-route" viewBox="0 0 18 27" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M1.5 25.6 V14 H15.5 V13" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <ul className="s9-legend">
                <li><i className="s9-legend__stall" aria-hidden="true" />{t(FIND.keyStall)}</li>
                <li><i className="s9-legend__corner" aria-hidden="true" />{t(FIND.keyCorner)}</li>
                <li><i className="s9-legend__walk" aria-hidden="true" />{t(FIND.keyWalk)}</li>
              </ul>
            </div>
            <div>
              <p className="s9-addr"><span>{t(FIND.row)}</span> <span>{t(FIND.stall)}</span></p>
              <p className="s9-where">{t(FIND.where)}</p>
              <ol className="s9-steps" aria-label={t(FIND.steps)}>
                {STEPS.map((step) => <li key={step.en}>{t(step)}</li>)}
              </ol>
              <p className="s9-closed"><b>{t(FIND.closed)}</b> {t(FIND.closedNote)}</p>
            </div>
          </div>
        </section>

        <footer className="s9-foot">
          <p><b>{NAME}</b>{t(FOOT.address)}</p>
          <p><b>{t(FOOT.hours)}</b>{t(FOOT.hoursValue)}</p>
          <p><b>{t(FOOT.messages)}</b>{t(FOOT.messagesValue)}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
