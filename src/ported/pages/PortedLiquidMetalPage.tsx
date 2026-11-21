import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedLiquidMetalPage.css';

// The product page of the Halden HA-1, a headphone amplifier built in Halden, Norway, in
// the Liquid Metal style. Michroma, the wide squared face engraved on test equipment, sets
// the name, the dial scale, the panel legends and every measured value; Hind reads the
// sentences. Components come from the amplifier: the volume knob as a working slider on its
// engraved scale, the rear panel as a brushed plate with its sockets, a measured power table
// with log-scale bars, an impedance scale that sets the drawn gain switch, and a packing
// list. One black base throughout; chrome is the only light.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const MODEL = 'HA-1';
const PRICE = '1,290';

// Per-element custom properties, so the stylesheet can place an element differently at each width.
const vars = (values: Record<string, string | number>) => values as CSSProperties;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

// Puts one value into a sentence as a node, so it can be set in its own weight.
const place = (text: string, key: string, node: ReactNode): ReactNode[] =>
  text.split(`{${key}}`).flatMap((part, index) => (index === 0 ? [part] : [<span key={index}>{node}</span>, part]));

const HEAD = {
  nav: { en: 'Product', ko: '제품', ja: '製品' },
  io: { en: 'Inputs and outputs', ko: '입력과 출력', ja: '入力と出力' },
  specs: { en: 'Specifications', ko: '사양', ja: '仕様' },
  headphones: { en: 'Headphones', ko: '헤드폰', ja: 'ヘッドフォン' },
  box: { en: 'In the box', ko: '구성품', ja: '同梱品' },
  buy: { en: 'Buy', ko: '구매', ja: '購入' },
  basket: { en: 'Basket', ko: '장바구니', ja: 'カート' },
} satisfies Record<string, Tri>;

// The volume knob: Mute, then 1 dB steps from −79 dB to 0 dB. The scale is linear in dB,
// 3.375 degrees a step, so Mute sits at the bottom left and 0 dB at the bottom right.
const MUTE = -80;
const TOP = 0;
const PAGE_DB = 6;
const DEG_PER_DB = 3.375;
const START_DB = -18;

const angleOf = (db: number) => 135 + db * DEG_PER_DB;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const decibels = (db: number) => (db === 0 ? '0' : `−${Math.abs(db)}`);

// The engraved scale, drawn once: a tick every 2 dB, a longer one at each figure.
const MAJOR = [-80, -60, -40, -20, -10, 0];

const point = (db: number, radius: number) => {
  const angle = (angleOf(db) * Math.PI) / 180;
  return { x: 300 + radius * Math.sin(angle), y: 300 - radius * Math.cos(angle) };
};

const stroke = (db: number, inner: number, outer: number) => {
  const a = point(db, inner);
  const b = point(db, outer);
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};

const MINOR_TICKS = Array.from({ length: 41 }, (_, index) => MUTE + index * 2)
  .filter((db) => !MAJOR.includes(db))
  .map((db) => stroke(db, 205, 217))
  .join('');
const MAJOR_TICKS = MAJOR.map((db) => stroke(db, 205, 228)).join('');
// Figures at the ends and the top sit centred beyond their ticks. The side figures hang off
// their ticks, anchored at the end nearest the dial, so they never cross a tick at any size.
const SCALE_FIGURES = MAJOR.map((db) => {
  const side: 'start' | 'middle' | 'end' = db === -60 ? 'end' : db === -20 || db === -10 ? 'start' : 'middle';
  return { db, anchor: side, ...point(db, side === 'middle' ? 256 : 234) };
});

const HERO = {
  drives: {
    en: 'Drives everything from 12 ohm in-ears to 600 ohm studio headphones, through balanced or single-ended outputs.',
    ko: '12옴 인이어부터 600옴 스튜디오 헤드폰까지 모두 구동합니다. 밸런스 또는 싱글엔디드 출력을 사용합니다.',
    ja: '12オームのインイヤーから600オームのスタジオ用ヘッドフォンまで、バランス・シングルエンド出力で駆動します。',
  },
  volume: { en: 'Volume', ko: '볼륨', ja: 'ボリューム' },
  mute: { en: 'Mute', ko: '음소거', ja: 'ミュート' },
  db: { en: '{v} dB', ko: '{v} dB', ja: '{v} dB' },
  priceNote: { en: 'Including VAT and shipping in Europe', ko: '유럽 내 부가세 및 배송비 포함', ja: 'VATと欧州内の送料込み' },
  finish: { en: 'Finish', ko: '마감', ja: '仕上げ' },
  add: { en: 'Add to basket', ko: '장바구니에 담기', ja: 'カートに入れる' },
  dealer: { en: 'Hear one at a dealer', ko: '판매점에서 직접 들어보기', ja: '販売店で試聴する' },
  stock: {
    en: 'In stock. Built and tested in Halden, ships in 2 working days.',
    ko: '재고 있음. 할덴에서 제작하고 시험하며, 영업일 기준 2일 안에 발송합니다.',
    ja: '在庫あり。ハルデンで組立・試験し、2営業日以内に発送します。',
  },
  addedOne: {
    en: 'Added to your basket: the HA-1 in {finish}, €1,290.',
    ko: '장바구니에 담았습니다: {finish} 마감 HA-1, €1,290.',
    ja: 'カートに追加しました: {finish}仕上げの HA-1、€1,290。',
  },
  addedMore: {
    en: 'Added another HA-1 in {finish}. Your basket holds {n}.',
    ko: '{finish} 마감 HA-1을 한 대 더 담았습니다. 장바구니에 {n}대가 있습니다.',
    ja: '{finish}仕上げの HA-1をもう1台追加しました。カートには{n}台あります。',
  },
  finishNews: {
    en: '{finish} finish. The knob and the rear panel are shown in {phrase}.',
    ko: '{finish} 마감입니다. 노브와 후면 패널을 {phrase} 마감으로 표시합니다.',
    ja: '{finish}仕上げです。ノブとリアパネルを{phrase}仕上げで表示しています。',
  },
} satisfies Record<string, Tri>;

type FinishId = 'silver' | 'black';

const FINISHES: Array<{ id: FinishId; name: Tri; phrase: Tri }> = [
  { id: 'silver', name: { en: 'Silver', ko: '실버', ja: 'シルバー' }, phrase: { en: 'silver', ko: '실버', ja: 'シルバー' } },
  { id: 'black', name: { en: 'Black', ko: '블랙', ja: 'ブラック' }, phrase: { en: 'black', ko: '블랙', ja: 'ブラック' } },
];

const IO = {
  title: { en: 'Inputs and outputs', ko: '입력과 출력', ja: '入力と出力' },
  note: {
    en: 'Headphones plug in at the front, into a 6.35 mm, a 4.4 mm balanced or a 4-pin XLR socket. Sources and speakers connect at the back.',
    ko: '헤드폰은 앞면의 6.35 mm, 4.4 mm 밸런스 또는 4핀 XLR 단자에 연결합니다. 음원과 스피커는 뒷면에 연결합니다.',
    ja: 'ヘッドフォンは前面の6.35 mm、4.4 mm バランス、または4ピンXLR端子に接続します。音源機器とスピーカーは背面に接続します。',
  },
  groups: [
    {
      name: { en: 'Balanced in', ko: '밸런스 입력', ja: 'バランス入力' },
      body: {
        en: 'Two XLR sockets for a DAC with balanced outputs. Pin 2 hot, takes up to 8 V.',
        ko: 'XLR 단자 2개로 밸런스 출력이 있는 DAC를 연결합니다. 2번 핀이 핫이며, 최대 8 V까지 받습니다.',
        ja: 'バランス出力のあるDAC用のXLR端子が2つあります。2番ピンがホットで、最大8 Vを受け付けます。',
      },
    },
    {
      name: { en: 'Line in', ko: '라인 입력', ja: 'ライン入力' },
      body: {
        en: 'Two RCA sockets for a DAC, streamer or phono stage. Takes up to 4 V.',
        ko: 'RCA 단자 2개로 DAC, 스트리머 또는 포노 단을 연결합니다. 최대 4 V까지 받습니다.',
        ja: 'DAC、ストリーマー、またはフォノ段用のRCA端子が2つあります。最大4 Vを受け付けます。',
      },
    },
    {
      name: { en: 'Pre out', ko: '프리 출력', ja: 'プリアウト' },
      body: {
        en: 'To powered speakers. Follows the volume knob and mutes when headphones go in.',
        ko: '액티브 스피커에 연결합니다. 볼륨 노브를 따르며, 헤드폰을 꽂으면 음소거됩니다.',
        ja: 'パワード・スピーカーへ出力します。ボリュームノブに追従し、ヘッドフォンを挿すとミュートされます。',
      },
    },
    {
      name: { en: 'Serial number', ko: '일련번호', ja: 'シリアル番号' },
      body: {
        en: 'Engraved before assembly, No. 0412 on this one. The same number is on the measurement report in the box.',
        ko: '조립 전에 새깁니다. 이 제품은 0412번입니다. 같은 번호가 구성품의 측정 보고서에도 적혀 있습니다.',
        ja: '組み立て前に刻印されます。この個体は0412番です。同じ番号が同梱の測定レポートにも記載されています。',
      },
    },
    {
      name: { en: 'Power', ko: '전원', ja: '電源' },
      body: {
        en: 'IEC inlet with its own switch. Works on any mains supply and draws 14 W at idle.',
        ko: '전용 스위치가 있는 IEC 인렛입니다. 어떤 전원에서도 작동하며, 대기 시 14 W를 사용합니다.',
        ja: '専用スイッチ付きのIECインレットです。どの電源でも動作し、待機時の消費電力は14 Wです。',
      },
    },
  ],
};

const SPECS = {
  title: { en: 'Specifications', ko: '사양', ja: '仕様' },
  note: {
    en: 'Measured on an Audio Precision APx555 at our bench in Halden. Every unit is measured before it ships, and the report for your serial number comes in the box.',
    ko: '할덴의 자체 측정실에서 Audio Precision APx555로 측정합니다. 모든 제품은 출하 전에 측정하며, 일련번호에 맞는 보고서가 구성품에 들어 있습니다.',
    ja: 'ハルデンの自社ベンチでAudio Precision APx555を使って測定しています。すべての製品は出荷前に測定し、お使いの製品番号に対応するレポートを同梱します。',
  },
  caption: { en: 'Output power per channel', ko: '채널당 출력', ja: 'チャンネルあたりの出力' },
  captionNote: { en: 'at 1% distortion', ko: '왜곡률 1% 기준', ja: '歪率1%時' },
  load: { en: 'Load', ko: '부하', ja: '負荷' },
  single: { en: '6.35 mm', ko: '6.35 mm', ja: '6.35 mm' },
  balanced: { en: 'Balanced', ko: '밸런스', ja: 'バランス' },
  scale: { en: 'Power on a log scale', ko: '출력을 로그 눈금으로 표시', ja: '出力を対数目盛りで表示' },
  ohms: { en: '{n} ohms', ko: '{n} 옴', ja: '{n} オーム' },
} satisfies Record<string, Tri>;

// Output power per channel; the bars are drawn on a log scale from 0.1 W to 10 W.
const POWER = [
  { load: 16, single: ['4.8', 'W'], balanced: ['5.0', 'W'], bars: [84.1, 85] },
  { load: 32, single: ['2.5', 'W'], balanced: ['9.5', 'W'], bars: [69.9, 98.9] },
  { load: 64, single: ['1.3', 'W'], balanced: ['5.0', 'W'], bars: [55.7, 85] },
  { load: 150, single: ['540', 'mW'], balanced: ['2.2', 'W'], bars: [36.6, 67.1] },
  { load: 300, single: ['270', 'mW'], balanced: ['1.1', 'W'], bars: [21.6, 52.1] },
  { load: 600, single: ['135', 'mW'], balanced: ['540', 'mW'], bars: [6.5, 36.6] },
];

interface Spec {
  name: Tri;
  value: (lang: Lang) => ReactNode;
  note: Tri;
}

const unit = (text: string, mid = false) => <small className={mid ? 'ha-mid' : undefined}>{text}</small>;

const OHM: Tri = { en: 'ohm', ko: '옴', ja: 'オーム' };
const HZ_TO: Tri = { en: 'Hz to', ko: 'Hz ~', ja: 'Hz～' };
const STEPS: Tri = { en: 'steps of 1 dB', ko: '단계 (1 dB 간격)', ja: '段階（1 dB刻み）' };
const IDLE: Tri = { en: 'W at idle', ko: 'W (대기 시)', ja: 'W（待機時）' };

const SPEC_LIST: Spec[] = [
  { name: { en: 'THD+N', ko: 'THD+N', ja: 'THD+N' }, value: () => <>0.0006{unit('%')}</>, note: { en: '1 kHz, 1 W into 32 ohms, balanced', ko: '1 kHz, 32옴 부하에서 1 W, 밸런스', ja: '1 kHz、32オーム負荷で1 W、バランス' } },
  { name: { en: 'Output impedance', ko: '출력 임피던스', ja: '出力インピーダンス' }, value: (lang) => <>0.1{unit(OHM[lang])}</>, note: { en: 'All three headphone outputs', ko: '헤드폰 출력 3개 모두', ja: 'ヘッドフォン出力3系統すべて' } },
  { name: { en: 'Output noise', ko: '출력 잡음', ja: '出力ノイズ' }, value: () => <>0.8{unit('µV')}</>, note: { en: 'A-weighted, Low gain', ko: 'A 가중, 낮음 게인 기준', ja: 'A 特性、ローゲイン時' } },
  { name: { en: 'Frequency response', ko: '주파수 특성', ja: '周波数特性' }, value: (lang) => <>4{unit(HZ_TO[lang], true)}120{unit('kHz')}</>, note: { en: 'Within 1 dB', ko: '1 dB 이내', ja: '1 dB以内' } },
  { name: { en: 'Dynamic range', ko: '다이내믹 레인지', ja: 'ダイナミックレンジ' }, value: () => <>131{unit('dB')}</>, note: { en: 'Balanced, at full output', ko: '밸런스, 최대 출력 기준', ja: 'バランス、最大出力時' } },
  { name: { en: 'Channel separation', ko: '채널 분리도', ja: 'チャンネル分離度' }, value: () => <>112{unit('dB')}</>, note: { en: '1 kHz, balanced', ko: '1 kHz, 밸런스', ja: '1 kHz、バランス' } },
  { name: { en: 'Gain', ko: '게인', ja: 'ゲイン' }, value: () => <>0, +10, +18{unit('dB')}</>, note: { en: 'Low, Mid and High, on a switch at the front', ko: '낮음, 중간, 높음. 전면 스위치로 선택', ja: 'ロー、ミッド、ハイ。フロントのスイッチで選択' } },
  {
    name: { en: 'Volume', ko: '볼륨', ja: 'ボリューム' },
    value: (lang) => <>80{unit(STEPS[lang])}</>,
    note: {
      en: 'A relay attenuator from −79 dB to 0 dB, then Mute. Channels matched within 0.05 dB',
      ko: '릴레이 감쇠기로 −79 dB에서 0 dB까지, 그다음 음소거. 채널 차이 0.05 dB 이내',
      ja: 'リレー式アッテネーターで −79 dB から 0 dB まで、その後ミュート。チャンネル差は 0.05 dB 以内',
    },
  },
  { name: { en: 'Size', ko: '크기', ja: 'サイズ' }, value: () => <>220 × 64 × 240{unit('mm')}</>, note: { en: 'Width, height and depth. Weighs 3.9 kg', ko: '가로, 세로, 깊이. 무게 3.9 kg', ja: '幅、高さ、奥行き。重量 3.9 kg' } },
  { name: { en: 'Power', ko: '전원', ja: '電源' }, value: (lang) => <>14{unit(IDLE[lang])}</>, note: { en: '100 to 240 V, 50 or 60 Hz', ko: '100~240 V, 50 또는 60 Hz', ja: '100～240 V、50 または 60 Hz' } },
];

const PHONES = {
  title: { en: 'Which headphones it drives', ko: '구동 가능한 헤드폰', ja: '駆動できるヘッドフォン' },
  note: {
    en: 'Impedance is the quickest guide. Find your headphones on the scale, then set the gain switch on the front to the position shown.',
    ko: '임피던스가 가장 빠른 기준입니다. 눈금에서 헤드폰을 찾은 다음, 전면 게인 스위치를 표시된 위치에 맞춥니다.',
    ja: 'インピーダンスがもっとも手早い目安です。目盛りでお使いのヘッドフォンを探し、フロントのゲインスイッチを表示された位置に合わせてください。',
  },
  scale: { en: 'Headphone impedance in ohms', ko: '헤드폰 임피던스(옴)', ja: 'ヘッドフォンのインピーダンス（オーム）' },
  group: { en: 'Impedance range', ko: '임피던스 범위', ja: 'インピーダンス範囲' },
  ohms: { en: ' ohms', ko: ' 옴', ja: ' オーム' },
  set: { en: 'Set the gain switch on the front to {gain}.', ko: '전면 게인 스위치를 {gain} 위치로 설정합니다.', ja: 'フロントのゲインスイッチを{gain}に設定します。' },
  setFor: { en: 'For {range} ohms', ko: '{range} 옴 기준', ja: '{range}オーム向け' },
  news: { en: '{range} ohms. Set the gain switch to {gain}.', ko: '{range} 옴. 게인 스위치를 {gain} 위치로 설정합니다.', ja: '{range}オーム。ゲインスイッチを{gain}に設定します。' },
  colRange: { en: 'Impedance', ko: '임피던스', ja: 'インピーダンス' },
  colWho: { en: 'Typical headphones', ko: '대표 헤드폰', ja: '代表的なヘッドフォン' },
  colGain: { en: 'Gain', ko: '게인', ja: 'ゲイン' },
  colPower: { en: 'Power, balanced', ko: '출력, 밸런스', ja: '出力、バランス' },
} satisfies Record<string, Tri>;

type GainId = 'low' | 'mid' | 'high';

const GAIN: Record<GainId, Tri> = {
  low: { en: 'Low', ko: '낮음', ja: 'ロー' },
  mid: { en: 'Mid', ko: '중간', ja: 'ミッド' },
  high: { en: 'High', ko: '높음', ja: 'ハイ' },
};

interface Range {
  id: string;
  label: Tri;
  /** The range inside a sentence. */
  phrase: Tri;
  kind: Tri;
  models: Tri;
  gain: GainId;
  balanced: string;
  single: Tri;
  note: Tri;
  /** Where the range sits on the log scale from 8 to 600 ohms, in percent. */
  from: number;
  to: number;
}

const RANGES: Range[] = [
  {
    id: 'under-20',
    label: { en: 'Under 20', ko: '20 미만', ja: '20未満' },
    phrase: { en: 'under 20', ko: '20 미만', ja: '20未満' },
    kind: { en: 'In-ears with several drivers', ko: '다중 드라이버 인이어', ja: 'マルチドライバーのインイヤー' },
    models: { en: 'Campfire Andromeda, 12.8 ohms. Shure SE215, 17 ohms.', ko: 'Campfire Andromeda, 12.8 옴. Shure SE215, 17 옴.', ja: 'Campfire Andromeda、12.8オーム。Shure SE215、17オーム。' },
    gain: 'low',
    balanced: '5.0 W',
    single: { en: '4.8 W from 6.35 mm', ko: '6.35 mm에서 4.8 W', ja: '6.35 mmから4.8 W' },
    note: {
      en: 'Sensitive in-ears are loud long before 12 o’clock. Low gain keeps the knob in its fine middle range and the noise floor at 0.8 µV, below anything you can hear.',
      ko: '감도가 높은 인이어는 노브를 12시 방향까지 돌리기 전에 이미 크게 들립니다. 낮음 게인은 노브를 세밀하게 조절할 수 있는 중간 구간에 두고, 잡음 바닥을 0.8 µV로 유지해 들리지 않는 수준으로 만듭니다.',
      ja: '感度の高いインイヤーは、ノブが12時の位置に来る前からすでに大きく鳴ります。ローゲインならノブを細かく調整しやすい中央付近に保て、ノイズフロアは 0.8 µV に抑えられるため、聞こえない水準になります。',
    },
    from: 0,
    to: 18.98,
  },
  {
    id: '20-80',
    label: { en: '20 to 80', ko: '20~80', ja: '20～80' },
    phrase: { en: '20 to 80', ko: '20~80', ja: '20～80' },
    kind: { en: 'Planar magnetic and closed headphones', ko: '평면 자기형 및 밀폐형 헤드폰', ja: '平面駆動型および密閉型ヘッドフォン' },
    models: {
      en: 'Audeze LCD-X, 20 ohms. HiFiMAN Sundara, 37 ohms. Audio-Technica ATH-M50x, 38 ohms.',
      ko: 'Audeze LCD-X, 20 옴. HiFiMAN Sundara, 37 옴. Audio-Technica ATH-M50x, 38 옴.',
      ja: 'Audeze LCD-X、20オーム。HiFiMAN Sundara、37オーム。Audio-Technica ATH-M50x、38オーム。',
    },
    gain: 'mid',
    balanced: '9.5 W',
    single: { en: '2.5 W from 6.35 mm', ko: '6.35 mm에서 2.5 W', ja: '6.35 mmから2.5 W' },
    note: {
      en: 'Planar headphones want current more than voltage, and this is where the HA-1 has the most of it. A Sundara at Mid gain reaches a loud 100 dB with the knob just past 12 o’clock.',
      ko: '평면형 헤드폰은 전압보다 전류를 더 많이 필요로 하며, HA-1은 이 구간에서 전류 여유가 가장 큽니다. 중간 게인에서 Sundara는 노브를 12시 방향을 조금 지난 위치에 두면 100 dB의 큰 음량에 도달합니다.',
      ja: '平面駆動型ヘッドフォンは電圧よりも電流を必要とし、HA-1はこの範囲でもっとも大きな電流を供給できます。ミッドゲインでSundaraを鳴らすと、ノブを12時の位置を少し過ぎたところで100 dBの大音量に達します。',
    },
    from: 18.98,
    to: 47.69,
  },
  {
    id: '80-300',
    label: { en: '80 to 300', ko: '80~300', ja: '80～300' },
    phrase: { en: '80 to 300', ko: '80~300', ja: '80～300' },
    kind: { en: 'Open dynamic and studio headphones', ko: '개방형 다이내믹 및 스튜디오 헤드폰', ja: '開放型ダイナミックおよびスタジオ用ヘッドフォン' },
    models: {
      en: 'Beyerdynamic DT 770 Pro, 80 ohms. Sennheiser HD 650 and HD 800 S, 300 ohms.',
      ko: 'Beyerdynamic DT 770 Pro, 80 옴. Sennheiser HD 650 및 HD 800 S, 300 옴.',
      ja: 'Beyerdynamic DT 770 Pro、80オーム。Sennheiser HD 650 および HD 800 S、300オーム。',
    },
    gain: 'mid',
    balanced: '1.1 W',
    single: { en: '270 mW from 6.35 mm', ko: '6.35 mm에서 270 mW', ja: '6.35 mmから270 mW' },
    note: {
      en: 'An HD 650 at Mid gain plays at a comfortable 80 dB with the knob near 12 o’clock, which leaves the top half of the dial for quiet recordings.',
      ko: '중간 게인에서 HD 650은 노브를 12시 근처에 두면 편안한 80 dB로 재생됩니다. 다이얼의 윗부분이 남아 있어 조용한 녹음에도 여유가 있습니다.',
      ja: 'ミッドゲインでHD 650を鳴らすと、ノブを12時付近に合わせた状態で快適な80 dBになります。そのためダイヤルの上半分を、小さな音量の録音のために残しておけます。',
    },
    from: 47.69,
    to: 75.06,
  },
  {
    id: '300-600',
    label: { en: '300 to 600', ko: '300~600', ja: '300～600' },
    phrase: { en: '300 to 600', ko: '300~600', ja: '300～600' },
    kind: { en: 'High-impedance studio headphones', ko: '고임피던스 스튜디오 헤드폰', ja: '高インピーダンスのスタジオ用ヘッドフォン' },
    models: { en: 'Beyerdynamic DT 880 and DT 990, 600 ohms.', ko: 'Beyerdynamic DT 880 및 DT 990, 600 옴.', ja: 'Beyerdynamic DT 880 および DT 990、600オーム。' },
    gain: 'high',
    balanced: '540 mW',
    single: { en: '135 mW from 6.35 mm', ko: '6.35 mm에서 135 mW', ja: '6.35 mmから135 mW' },
    note: {
      en: 'High-impedance headphones need voltage. At High gain a DT 880 plays at 85 dB with the knob near 1 o’clock and keeps 10 dB in hand for quiet passages.',
      ko: '고임피던스 헤드폰은 전압이 필요합니다. 높음 게인에서 DT 880은 노브를 1시 근처에 두면 85 dB로 재생되며, 조용한 구간을 위해 10 dB의 여유가 남습니다.',
      ja: '高インピーダンスのヘッドフォンには電圧が必要です。ハイゲインでDT 880を鳴らすと、ノブを1時付近にした状態で85 dBになり、静かな部分のために10 dBの余裕が残ります。',
    },
    from: 75.06,
    to: 89.42,
  },
];

// The impedance scale's figures, at their place on the log scale from 8 to 600 ohms.
const OHM_MARKS = [
  { n: '8', at: 0 },
  { n: '20', at: 18.98 },
  { n: '80', at: 47.69 },
  { n: '300', at: 75.06 },
  { n: '600', at: 89.42 },
];

const BOX = {
  title: { en: 'In the box', ko: '구성품', ja: '同梱品' },
  amp: { en: 'HA-1 amplifier', ko: 'HA-1 앰프', ja: 'HA-1 アンプ' },
  ampNote: {
    en: 'In {phrase}, with its serial number engraved on the back',
    ko: '{phrase} 마감, 뒷면에 일련번호가 각인되어 있습니다',
    ja: '{phrase}仕上げ、背面に製造番号を刻印',
  },
  items: [
    { n: 1, name: { en: 'Power cable, 1.8 m', ko: '전원 케이블, 1.8 m', ja: '電源ケーブル、1.8 m' }, note: { en: 'With the plug for your country', ko: '사용 국가에 맞는 플러그 포함', ja: 'お住まいの国のプラグ付き' } as Tri | null },
    { n: 1, name: { en: 'Pair of RCA cables, 1 m', ko: 'RCA 케이블 한 쌍, 1 m', ja: 'RCAケーブル 1組、1 m' }, note: null },
    { n: 1, name: { en: 'Adapter from 6.35 mm to 3.5 mm', ko: '6.35 mm에서 3.5 mm로 바꾸는 어댑터', ja: '6.35 mmから3.5 mmへの変換アダプター' }, note: null },
    {
      n: 1,
      name: { en: 'Measurement report', ko: '측정 보고서', ja: '測定レポート' },
      note: { en: 'For your serial number, signed by the person who tested it', ko: '일련번호에 맞춘 보고서이며, 시험 담당자의 서명이 있습니다', ja: 'お使いの製品のシリアル番号に対応し、試験担当者の署名入り' },
    },
    { n: 2, name: { en: 'Spare fuses, T1.6 A slow-blow', ko: '예비 퓨즈, T1.6 A 슬로우 블로우', ja: '予備ヒューズ、T1.6 A スロー・ブロー' }, note: null },
  ],
};

const WARRANTY = {
  title: { en: 'Warranty', ko: '보증', ja: '保証' },
  years: { en: '5 years', ko: '5년', ja: '5年' },
  lead: {
    en: 'Parts and labour, counted from the day it is delivered. If you sell the amplifier, the warranty goes with it; the new owner only needs the serial number.',
    ko: '부품과 작업비를 배송일부터 계산합니다. 앰프를 판매하면 보증도 함께 넘어가며, 새 소유자는 일련번호만 있으면 됩니다.',
    ja: '部品と工賃は、お届けした日から起算します。アンプを売却した場合は保証も一緒に移り、新しいオーナーは製造番号があれば足ります。',
  },
  terms: [
    {
      name: { en: 'Repairs', ko: '수리', ja: '修理' },
      body: {
        en: 'Done at the bench in Halden by the people who built it. We pay shipping both ways inside Europe.',
        ko: '할덴의 자체 작업대에서 제품을 만든 담당자가 수리합니다. 유럽 내 왕복 배송비는 당사가 부담합니다.',
        ja: 'ハルデンの自社工房で、組み立てた担当者が修理します。ヨーロッパ国内の往復の送料は当社が負担します。',
      },
    },
    {
      name: { en: 'Returns', ko: '반품', ja: '返品' },
      body: { en: '30 days to send it back for a full refund, for any reason.', ko: '30일 안에 사유와 관계없이 반송하면 전액 환불됩니다.', ja: '30日以内であれば、理由を問わず返送により全額返金いたします。' },
    },
    {
      name: { en: 'After 5 years', ko: '5년 이후', ja: '5年経過後' },
      body: {
        en: 'We keep parts for every HA-1 and quote a repair before we start it.',
        ko: '모든 HA-1의 부품을 보관하고 있으며, 수리를 시작하기 전에 견적을 드립니다.',
        ja: '全HA-1の部品を保管しており、修理を始める前に見積もりをお出しします。',
      },
    },
  ],
};

const FOOT = {
  company: 'Halden Lydteknikk AS',
  address: { en: 'Tistedalsgata 14, 1772 Halden, Norway', ko: 'Tistedalsgata 14, 1772 Halden, Norway', ja: 'Tistedalsgata 14, 1772 Halden, Norway' },
  dealers: { en: 'Hear one at a dealer', ko: '판매점에서 직접 들어보기', ja: '販売店で試聴する' },
  dealersBody: {
    en: 'Dealers in Oslo, Stockholm, Copenhagen, Hamburg and Amsterdam keep an HA-1 for listening. Our own room in Halden is open on Saturdays from 11:00 to 15:00.',
    ko: '오슬로, 스톡홀름, 코펜하겐, 함부르크, 암스테르담의 판매점에서 청취용 HA-1을 보유하고 있습니다. 할덴의 자체 청취실은 토요일 11:00부터 15:00까지 엽니다.',
    ja: 'オスロ、ストックホルム、コペンハーゲン、ハンブルク、アムステルダムの販売店では、試聴用のHA-1を用意しています。ハルデンの自社試聴室は、土曜日の11:00から15:00まで開いています。',
  },
  service: { en: 'Service', ko: '고객 지원', ja: 'サポート' },
  serviceBody: {
    en: '+47 69 17 42 00, weekdays 9:00 to 15:00. The manual and the measurement report for any serial number are sent on request.',
    ko: '+47 69 17 42 00, 평일 9:00~15:00. 모든 일련번호의 사용 설명서와 측정 보고서는 요청 시 보내 드립니다.',
    ja: '+47 69 17 42 00、平日 9:00～15:00。どのシリアル番号の取扱説明書と測定レポートも、ご依頼に応じて送付します。',
  },
} as const;

const PROMPT_EN = `Design one real page in the Liquid Metal style: one black page where polished and brushed metal is the only light, and every number reads like an engraved instrument scale.

Pick a believable subject made of machined metal and precise figures, such as a headphone amplifier, a turntable or a camera lens, and write its real content. The page must read as that product's page, never as a page about its own style. Here it is the Halden HA-1, a headphone amplifier built in Halden, Norway: its volume knob, rear panel, measured specifications, the headphones it drives and what comes in the box.

TOKENS:
--bg: #0a0a0a (one base from top to bottom)
--surface: #161616 (opaque, for any menu that opens over the page)
--ink: #f0f0f0
--muted: #a7a7a7
--line: rgba(240,240,240,0.26)
--line-strong: rgba(240,240,240,0.5)
--chrome: linear-gradient(180deg, #ffffff 0%, #e0e0e0 20%, #9e9e9e 45%, #c0c0c0 55%, #ffffff 72%, #a0a0a0 100%) (the product name only, as clipped text)
--button: linear-gradient(180deg, #fbfbfb 0%, #dcdcdc 44%, #a9a9a9 56%, #e9e9e9 100%) with #0a0a0a text (a lighter version of the same on hover)
--bar: linear-gradient(180deg, #ffffff 0%, #d4d4d4 40%, #8d8d8d 56%, #e2e2e2 100%)
No hue anywhere: greys, white and black only. The metal itself (knob, plate, sockets, switch) is drawn with layered linear, radial and conic gradients in greys.

TYPOGRAPHY:
Two families. Michroma (400 only) sets the product name, the headings, the dial scale, the panel legends and every measured value. Hind (400, 500, 600) sets the sentences, labels and buttons.
H1: Michroma 400, clamp(2.75rem, 4.8vw, 3.875rem), line-height 1.04, letter-spacing -0.01em, two lines (maker, model), filled with --chrome.
H2: Michroma 400, clamp(1.5rem, 2.6vw, 2.125rem), line-height 1.18.
H3 (rear panel labels): Michroma 400, 1rem, line-height 1.35.
Price: Michroma 400 at clamp(2rem, 3.2vw, 2.5rem), the euro sign in Hind 500 at 0.62em, raised. Measured values: Michroma at clamp(1.25rem, 1.8vw, 1.5rem), 1.1875rem below 400px; power figures at clamp(1.125rem, 1.7vw, 1.4375rem), 1rem below 400px; the volume readout 1.375rem; the warranty years at clamp(3.5rem, 7vw, 5.5rem); quantities 1.5rem. Units sit beside the figures in Hind 400 at 1rem, muted.
Body: Hind 400 at 1.0625rem, line-height 1.6; notes and labels 1rem. No text under 1rem except the legends engraved in the drawings (rear plate, gain switch) and the impedance scale's figures on phones, all hidden from assistive technology and said again in real text. The dial's figures are sized inside the drawing and grow on phones. Figures lining and tabular, except the price. No all-caps tracked labels. Write "ohms" in words: the faces have no ohm sign.

LAYOUT:
- A 1120px column, sections 120px apart (88px after the hero and on phones).
- Top bar: the maker's name, four in-page links (hidden below 960px) and one outlined "Buy" link that becomes "Basket" with its count.
- Hero on a 12-column grid: the name, one sentence and the buy block (price, finish, Add to basket, a dealer link, stock) in the first five columns; the volume dial, at most 468px, centred in the other seven. On a 1280x800 laptop the dial, name, price and Add to basket all show on the first screen. Below 960px it stacks: name, dial, buy block.
- Then inputs and outputs, specifications, the headphones it drives, in the box with the warranty beside it, and a three-column footer.

COMPONENTS:
- Volume dial: an engraved 270-degree scale (a tick every 2 dB, longer ticks and figures at Mute, -60, -40, -20, -10 and 0 dB) around a spun-aluminium knob drawn with conic and repeating gradients, with a pointer groove. It is a real slider: role="slider", 1 dB steps from Mute (-80) to 0 dB, arrow keys 1 dB, Page Up/Down 6 dB, Home Mute, End 0 dB, and a pointer drag that turns it. The readout under it ("Volume -18 dB") follows. Reflections stay put; only the groove turns.
- Finish: two toggle buttons (Silver, Black) with a brushed swatch each. Black re-draws the knob and the rear panel in black anodised metal with light engraving.
- Add to basket: a chrome button. It confirms in a status line under it and the top bar's link turns into "Basket" with the count.
- Rear panel: one brushed plate with four screws, XLR and RCA sockets, the engraved serial number, the IEC inlet and its switch; a line drops from each group to a label (H3 and a sentence) under the plate. On phones the plate turns on end and the labels sit beside each group.
- Power table: a table with explicit roles. Load, 6.35 mm and balanced power, and a pair of bars per row on a log scale from 0.1 W to 10 W (chrome bar for balanced, outlined bar for 6.35 mm). On phones each row keeps the three figures and puts its bars under them.
- Specifications: a two-column ruled list (one column below 1080px), the name in muted Hind and the value large in Michroma with its unit and a note.
- Impedance scale: a log scale from 8 to 600 ohms with ticks; four range buttons (aria-pressed) laid on it at their real width. Choosing one highlights its stretch of the scale, sets a drawn three-position gain switch (Low, Mid, High) and highlights its row in the list below, which then shows a note on how loud it plays. On tablets and phones the buttons sit in a row or a 2x2 grid under the scale.
- In the box: a ruled list with the quantity in Michroma; the amplifier line names the finish chosen above. Warranty: "5 years" large on an ink rule and three ruled terms.
- Corners 2 to 4px; the plate 10px; the knob and the sockets round. Lines 1px. Shadows only on the drawn metal (knob, plate, sockets, switch) and under the chrome button.

MOTION:
- Nothing moves on its own. Hover changes border, underline and text colour in 160ms, and the chrome button's gradient lightens; the gain switch slides 160ms to its new place. prefers-reduced-motion removes the transitions.

FORBIDDEN:
- Any colour accent; blue or warm-tinted metal; glows behind text; text-shadow
- Cards, pills, chips, badges, glass panels, tiles, a grid of feature boxes
- A small label above a heading, all-caps tracked labels, numbered section markers
- Chrome gradients on body text, headings other than the product name, or on lines
- Photographs, product renders, illustrations, emoji, swirling liquid blobs
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about chrome, metal, luxury or precision as a style

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a slider for the volume, toggle buttons for the finish and the impedance ranges, a table with roles for the power, a description list for the specifications, lists for the ranges and the box
3) Working volume slider (keys and drag), finish, impedance choice and Add to basket, with status changes announced politely
4) Responsive layout down to 320px with no horizontal scroll; the rear panel turns on end on phones
5) Visible focus on every control, text alternatives for every drawing, reduced-motion and forced-colours support`;

const PROMPT_KO = `Liquid Metal 스타일로 실제 페이지 하나를 디자인한다. 검은 페이지 하나에서 광택 금속과 헤어라인 금속만 빛을 내며, 모든 숫자는 각인된 계기 눈금처럼 읽혀야 한다.

가공 금속과 정밀한 수치로 이루어진 현실적인 주제를 고르고, 그 제품의 실제 내용을 쓴다. 페이지는 그 제품의 페이지로 읽혀야 하며, 스타일을 설명하는 페이지로 읽혀서는 안 된다. 여기서는 노르웨이 할덴에서 만든 헤드폰 앰프 Halden HA-1이다. 볼륨 노브, 후면 패널, 측정 사양, 구동 가능한 헤드폰, 구성품을 다룬다.

TOKENS:
--bg: #0a0a0a (위에서 아래까지 하나의 바탕)
--surface: #161616 (불투명, 페이지 위에 열리는 모든 메뉴용)
--ink: #f0f0f0
--muted: #a7a7a7
--line: rgba(240,240,240,0.26)
--line-strong: rgba(240,240,240,0.5)
--chrome: linear-gradient(180deg, #ffffff 0%, #e0e0e0 20%, #9e9e9e 45%, #c0c0c0 55%, #ffffff 72%, #a0a0a0 100%) (제품명에만, 잘라낸 텍스트로 적용)
--button: linear-gradient(180deg, #fbfbfb 0%, #dcdcdc 44%, #a9a9a9 56%, #e9e9e9 100%) 글자색 #0a0a0a (호버 시 같은 값의 더 밝은 버전)
--bar: linear-gradient(180deg, #ffffff 0%, #d4d4d4 40%, #8d8d8d 56%, #e2e2e2 100%)
색상은 어디에도 쓰지 않는다. 회색, 흰색, 검은색만 쓴다. 금속 자체(노브, 판, 단자, 스위치)는 회색의 선형, 방사형, 원뿔형 그라데이션을 겹쳐 그린다.

TYPOGRAPHY:
서체는 두 가지다. Michroma(400만)는 제품명, 제목, 다이얼 눈금, 패널 표기, 모든 측정값을 조판한다. Hind(400, 500, 600)는 문장, 라벨, 버튼을 조판한다.
H1: Michroma 400, clamp(2.75rem, 4.8vw, 3.875rem), 줄 높이 1.04, 자간 -0.01em, 두 줄(제조사, 모델), --chrome으로 채운다.
H2: Michroma 400, clamp(1.5rem, 2.6vw, 2.125rem), 줄 높이 1.18.
H3(후면 패널 라벨): Michroma 400, 1rem, 줄 높이 1.35.
가격: Michroma 400, clamp(2rem, 3.2vw, 2.5rem), 유로 기호는 Hind 500으로 0.62em, 위에 올린다. 측정값: Michroma, clamp(1.25rem, 1.8vw, 1.5rem), 400px 미만에서는 1.1875rem. 출력 수치: clamp(1.125rem, 1.7vw, 1.4375rem), 400px 미만에서는 1rem. 볼륨 표시: 1.375rem. 보증 연수: clamp(3.5rem, 7vw, 5.5rem). 수량: 1.5rem. 단위는 수치 옆에 Hind 400, 1rem, 흐린 색으로 둔다.
본문: Hind 400, 1.0625rem, 줄 높이 1.6. 메모와 라벨은 1rem. 1rem 미만 텍스트는 두지 않는다. 예외는 그림에 새겨진 표기(후면 판, 게인 스위치)와 휴대폰에서의 임피던스 눈금 숫자뿐이며, 이것들은 보조 기술에서 숨기고 실제 텍스트로 다시 설명한다. 다이얼의 숫자는 그림 안에서 크기가 정해지고, 휴대폰에서는 커진다. 숫자는 가격을 제외하고 줄 맞춤, 고정폭으로 조판한다. 대문자에 자간을 준 라벨은 쓰지 않는다. "ohms"는 글자로 쓴다. 표면에 옴 기호가 없다.

LAYOUT:
- 폭 1120px 칼럼. 섹션 간격 120px(히어로 다음과 휴대폰에서는 88px).
- 상단 바: 제조사 이름, 페이지 내 링크 네 개(960px 미만에서는 숨김), 그리고 외곽선 "구매" 링크 하나. 이 링크는 개수와 함께 "장바구니"로 바뀐다.
- 12열 그리드의 히어로: 앞 5열에 제품명, 한 문장, 구매 블록(가격, 마감, 장바구니에 담기, 판매점 링크, 재고)을 둔다. 나머지 7열 가운데에 최대 468px의 볼륨 다이얼을 둔다. 1280x800 노트북에서는 다이얼, 제품명, 가격, 장바구니에 담기가 모두 첫 화면에 보여야 한다. 960px 미만에서는 세로로 쌓는다: 제품명, 다이얼, 구매 블록.
- 이어서 입력과 출력, 사양, 구동 가능한 헤드폰, 보증을 옆에 둔 구성품, 세 칼럼 푸터.

COMPONENTS:
- 볼륨 다이얼: 270도 각인 눈금(2 dB마다 눈금, 음소거, -60, -40, -20, -10, 0 dB에는 더 긴 눈금과 숫자)을 두고, 원뿔형과 반복 그라데이션으로 그린 스피닝 알루미늄 노브를 둔다. 포인터 홈이 있다. 실제 슬라이더다: role="slider", 음소거(-80)부터 0 dB까지 1 dB 단위, 화살표 키 1 dB, Page Up/Down 6 dB, Home은 음소거, End는 0 dB, 포인터 드래그로 돌린다. 아래 표시("Volume -18 dB")가 따라간다. 반사광은 제자리에 있고, 홈만 돈다.
- 마감: 토글 버튼 두 개(Silver, Black), 각각 헤어라인 견본 색을 갖는다. Black을 고르면 노브와 후면 패널을 흑색 아노다이즈 금속에 얕은 각인으로 다시 그린다.
- 장바구니에 담기: 크롬 버튼. 아래 상태 줄에 확인 메시지를 표시하고, 상단 바의 링크는 개수와 함께 "장바구니"로 바뀐다.
- 후면 패널: 나사 4개가 있는 헤어라인 판 하나, XLR과 RCA 단자, 각인된 일련번호, IEC 인렛과 그 스위치. 각 그룹에서 선이 내려가 판 아래의 라벨(H3과 한 문장)에 닿는다. 휴대폰에서는 판을 세우고, 라벨은 각 그룹 옆에 둔다.
- 출력 표: 역할을 명시한 표. 부하, 6.35 mm 출력과 밸런스 출력, 그리고 행마다 0.1 W에서 10 W까지 로그 눈금 막대 한 쌍(밸런스는 크롬 막대, 6.35 mm는 외곽선 막대). 휴대폰에서는 각 행이 수치 세 개를 유지하고, 막대는 그 아래에 둔다.
- 사양: 구분선이 있는 두 칼럼 목록(1080px 미만에서는 한 칼럼). 항목명은 흐린 Hind, 값은 큰 Michroma로, 단위와 메모를 함께 둔다.
- 임피던스 눈금: 8옴에서 600옴까지의 로그 눈금에 눈금선을 두고, 그 위에 실제 폭만큼 네 개의 범위 버튼(aria-pressed)을 놓는다. 하나를 고르면 눈금에서 그 구간이 강조되고, 그려진 3단 게인 스위치(Low, Mid, High)가 맞춰지며, 아래 목록에서 해당 행이 강조되어 그 범위가 얼마나 크게 재생되는지 메모를 보여 준다. 태블릿과 휴대폰에서 버튼은 눈금 아래에서 한 줄 또는 2x2 격자로 놓인다.
- 구성품: 수량은 Michroma로 적은 구분선 목록. 앰프 줄에는 위에서 고른 마감을 적는다. 보증: 잉크색 선 위에 큰 "5년"과 구분선이 있는 세 가지 조건.
- 모서리 2~4px, 판은 10px, 노브와 단자는 둥글게. 선은 1px. 그림의 금속(노브, 판, 단자, 스위치)과 크롬 버튼 아래에만 그림자를 둔다.

MOTION:
- 자동으로 움직이는 것은 없다. 호버 시 테두리, 밑줄, 글자색이 160ms에 바뀌고, 크롬 버튼의 그라데이션이 밝아진다. 게인 스위치는 160ms 동안 새 위치로 미끄러진다. prefers-reduced-motion은 전환 효과를 없앤다.

FORBIDDEN:
- 색 강조 전부; 파란색이나 따뜻한 색조의 금속; 텍스트 뒤의 빛번짐; text-shadow
- 카드, 알약형 버튼, 칩, 배지, 유리 패널, 타일, 기능 상자 격자
- 제목 위의 작은 라벨, 대문자에 자간을 준 라벨, 번호가 붙은 섹션 표시
- 본문, 제품명 이외의 제목, 선에 크롬 그라데이션
- 사진, 제품 렌더, 일러스트, 이모지, 소용돌이치는 액체 덩어리
- 링크의 화살표, 가운데점으로 이은 메타 문자열, 실제 순서가 아닌 것에 붙인 번호
- 스타일로서의 크롬, 금속, 고급스러움, 정밀함에 관한 문구

OUTPUT:
1) 위 토큰을 담은 CSS 커스텀 속성
2) 시맨틱 HTML: 볼륨에는 슬라이더, 마감과 임피던스 범위에는 토글 버튼, 출력에는 역할을 지정한 표, 사양에는 설명 목록, 범위와 구성품에는 목록
3) 작동하는 볼륨 슬라이더(키와 드래그), 마감, 임피던스 선택, 장바구니에 담기. 상태 변경은 polite하게 알린다.
4) 320px까지 가로 스크롤 없이 반응형 레이아웃. 휴대폰에서는 후면 패널을 세운다.
5) 모든 컨트롤에 보이는 포커스, 모든 그림에 대체 텍스트, reduced-motion과 forced-colors 지원`;

const PROMPT_JA = `Liquid Metal スタイルで、実在するページを一つデザインする。黒い一枚のページで、磨き仕上げとヘアライン仕上げの金属だけが光を放ち、すべての数字は刻印された計器の目盛りのように読めるようにする。

機械加工された金属と精密な数値からなる、実在しそうな題材を一つ選び、その製品の実際の内容を書く。ページはその製品のページとして読めること。スタイルについてのページとして読まれてはならない。ここではノルウェーのハルデンで作られたヘッドフォンアンプ、Halden HA-1とする。ボリュームノブ、リアパネル、測定済みの仕様、駆動できるヘッドフォン、同梱品を扱う。

TOKENS:
--bg: #0a0a0a（上から下まで一つの下地）
--surface: #161616（不透明。ページ上に開くすべてのメニュー用）
--ink: #f0f0f0
--muted: #a7a7a7
--line: rgba(240,240,240,0.26)
--line-strong: rgba(240,240,240,0.5)
--chrome: linear-gradient(180deg, #ffffff 0%, #e0e0e0 20%, #9e9e9e 45%, #c0c0c0 55%, #ffffff 72%, #a0a0a0 100%)（製品名のみ。クリップされたテキストとして適用）
--button: linear-gradient(180deg, #fbfbfb 0%, #dcdcdc 44%, #a9a9a9 56%, #e9e9e9 100%) 文字色 #0a0a0a（ホバー時は同じものをより明るく）
--bar: linear-gradient(180deg, #ffffff 0%, #d4d4d4 40%, #8d8d8d 56%, #e2e2e2 100%)
色相は一切使わない。グレー、白、黒のみ。金属そのもの（ノブ、プレート、端子、スイッチ）は、グレーの線形・放射状・円錐状のグラデーションを重ねて描く。

TYPOGRAPHY:
書体は二種類。Michroma（400のみ）は製品名、見出し、ダイヤルの目盛り、パネルの表記、すべての測定値を組む。Hind（400、500、600）は文章、ラベル、ボタンを組む。
H1: Michroma 400、clamp(2.75rem, 4.8vw, 3.875rem)、行の高さ 1.04、字間 -0.01em、二行（メーカー、モデル）、--chrome で塗る。
H2: Michroma 400、clamp(1.5rem, 2.6vw, 2.125rem)、行の高さ 1.18。
H3（リアパネルのラベル）: Michroma 400、1rem、行の高さ 1.35。
価格: Michroma 400、clamp(2rem, 3.2vw, 2.5rem)。ユーロ記号は Hind 500 の 0.62em で、上に上げる。測定値: Michroma、clamp(1.25rem, 1.8vw, 1.5rem)、400px未満では 1.1875rem。出力値: clamp(1.125rem, 1.7vw, 1.4375rem)、400px未満では 1rem。ボリューム表示: 1.375rem。保証年数: clamp(3.5rem, 7vw, 5.5rem)。数量: 1.5rem。単位は数値の横に、Hind 400、1rem、薄い色で置く。
本文: Hind 400、1.0625rem、行の高さ 1.6。注記とラベルは 1rem。1rem未満の文字は、図に刻まれた表記（リアプレート、ゲインスイッチ）と、スマホでのインピーダンス目盛りの数字のみ可。これらは支援技術から隠し、実際のテキストで改めて説明する。ダイヤルの数字は図の中でサイズを決め、スマホでは大きくなる。数字は価格を除き、すべて等幅の揃い数字とする。大文字で字間を空けたラベルは使わない。「ohms」は文字で書く。面にオーム記号は使わない。

LAYOUT:
- 幅 1120px のカラム。セクションの間隔は 120px（ヒーローの後とスマホでは 88px）。
- 上部バー: メーカー名、ページ内リンク4つ（960px未満では非表示）、そして枠線付きの「購入」リンク1つ。件数付きの「カート」に変わる。
- 12カラムグリッドのヒーロー: 最初の5カラムに製品名、一文、購入ブロック（価格、仕上げ、カートに入れる、販売店リンク、在庫）。残りの7カラムの中央に、最大468pxのボリュームダイヤル。1280x800のノートPCでは、ダイヤル、製品名、価格、カートに入れるがすべて最初の画面に表示されること。960px未満では縦に積む: 製品名、ダイヤル、購入ブロック。
- 続いて、入力と出力、仕様、駆動できるヘッドフォン、保証を横に置いた同梱品、三カラムのフッター。

COMPONENTS:
- ボリュームダイヤル: 270度の刻印目盛り（2 dBごとに目盛り、ミュート、-60、-40、-20、-10、0 dB には長い目盛りと数字）。円錐状と繰り返しのグラデーションで描いたスピン加工のアルミノブを囲む。ポインターの溝がある。本物のスライダーである: role="slider"、ミュート（-80）から 0 dB まで 1 dB刻み、矢印キーは 1 dB、Page Up/Down は 6 dB、Home はミュート、End は 0 dB、ポインターのドラッグで回す。その下の表示（"Volume -18 dB"）が追従する。映り込みは動かさず、溝だけが回る。
- 仕上げ: トグルボタン2つ（Silver、Black）。それぞれにヘアライン仕上げの見本を付ける。Black を選ぶと、ノブとリアパネルを黒いアルマイト金属に、浅い刻印を施した状態で描き直す。
- カートに入れる: クロームのボタン。その下のステータス行に確認を表示し、上部バーのリンクは件数付きの「カート」に変わる。
- リアパネル: ネジ4本付きのヘアライン仕上げのプレート1枚、XLRとRCAの端子、刻印された製造番号、IECインレットとそのスイッチ。各グループから線が伸び、プレートの下のラベル（H3と一文）につながる。スマホではプレートを縦に立て、ラベルは各グループの横に置く。
- 出力表: 役割を明示した表。負荷、6.35 mm とバランスの出力、そして行ごとに 0.1 W から 10 W の対数目盛りの棒グラフ 2本（バランスはクロームの棒、6.35 mm は枠線の棒）。スマホでは各行が3つの数値を保ち、棒はその下に置く。
- 仕様: 罫線で区切った二カラムのリスト（1080px未満では一カラム）。項目名は薄い色の Hind、値は大きな Michroma で、単位と注記を添える。
- インピーダンス目盛り: 8オームから600オームまでの対数目盛りに目盛りを付け、その上に実際の幅で4つの範囲ボタン（aria-pressed）を配置する。一つを選ぶと、目盛り上のその区間が強調され、描かれた3段のゲインスイッチ（Low、Mid、High）が切り替わり、下のリストの該当行が強調されて、その範囲でどれだけ大きく鳴るかの注記が表示される。タブレットとスマホでは、ボタンを目盛りの下に一列または2x2のグリッドで置く。
- 同梱品: 数量は Michroma で示した罫線付きリスト。アンプの行には、上で選んだ仕上げを書く。保証: インクの線の上に大きく「5年」、罫線で区切った三つの条件。
- 角丸は2～4px、プレートは10px、ノブと端子は丸く。線は1px。影は描いた金属（ノブ、プレート、端子、スイッチ）とクロームボタンの下だけに付ける。

MOTION:
- 勝手に動くものはない。ホバーでは枠線、下線、文字色が160msで変わり、クロームボタンのグラデーションが明るくなる。ゲインスイッチは160msで新しい位置へスライドする。prefers-reduced-motion では遷移をなくす。

FORBIDDEN:
- 色のアクセント全般; 青や暖色系の金属; 文字の背後の光; text-shadow
- カード、ピル型ボタン、チップ、バッジ、ガラス調パネル、タイル、機能ボックスのグリッド
- 見出しの上の小さなラベル、大文字で字間を空けたラベル、番号付きのセクション表示
- 本文、製品名以外の見出し、線へのクロームのグラデーション
- 写真、製品レンダリング、イラスト、絵文字、渦を巻く液体の塊
- リンクの矢印、中黒で区切ったメタ文字列、実際の順序ではないものへの番号
- スタイルとしてのクローム、金属、高級感、精密さについての文章

OUTPUT:
1) 上記トークンのCSSカスタムプロパティ
2) セマンティックHTML: ボリュームにはスライダー、仕上げとインピーダンス範囲にはトグルボタン、出力には役割を指定した表、仕様には説明リスト、範囲と同梱品にはリスト
3) 動作するボリュームスライダー（キーとドラッグ）、仕上げ、インピーダンスの選択、カートに入れる。状態の変化は polite に知らせる。
4) 320pxまで横スクロールなしのレスポンシブレイアウト。スマホではリアパネルを縦に立てる。
5) すべての操作要素に見えるフォーカス、すべての図に代替テキスト、reduced-motion と forced-colors への対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

// The engraved legends on the rear plate are the same in every language.
function RearPlate() {
  return (
    <>
      <div className="ha-plate" aria-hidden="true" />
      <div className="ha-grp" style={vars({ '--ha-i': 1 })} aria-hidden="true">
        <span className="ha-eng">Balanced in</span>
        <span className="ha-jacks">
          <span className="ha-jack"><i className="ha-xlr" /><span className="ha-eng">L</span></span>
          <span className="ha-jack"><i className="ha-xlr" /><span className="ha-eng">R</span></span>
        </span>
      </div>
      <div className="ha-grp" style={vars({ '--ha-i': 2 })} aria-hidden="true">
        <span className="ha-eng">Line in</span>
        <span className="ha-jacks">
          <span className="ha-jack"><i className="ha-rca" /><span className="ha-eng">L</span></span>
          <span className="ha-jack"><i className="ha-rca" /><span className="ha-eng">R</span></span>
        </span>
      </div>
      <div className="ha-grp" style={vars({ '--ha-i': 3 })} aria-hidden="true">
        <span className="ha-eng">Pre out</span>
        <span className="ha-jacks">
          <span className="ha-jack"><i className="ha-rca" /><span className="ha-eng">L</span></span>
          <span className="ha-jack"><i className="ha-rca" /><span className="ha-eng">R</span></span>
        </span>
      </div>
      <div className="ha-grp" style={vars({ '--ha-i': 4 })} aria-hidden="true">
        <span className="ha-serial">
          <span className="ha-serial__no">No. 0412</span>
          <span className="ha-eng">Made in Halden, Norway</span>
        </span>
      </div>
      <div className="ha-grp" style={vars({ '--ha-i': 5 })} aria-hidden="true">
        <span className="ha-eng">100–240 V<br />50/60 Hz</span>
        <span className="ha-power-in"><i className="ha-iec"><i /></i><i className="ha-rocker" /></span>
      </div>
    </>
  );
}

export function PortedLiquidMetalPage({ lang }: PortedStylePageProps) {
  const [volume, setVolume] = useState(START_DB);
  const [finishId, setFinishId] = useState<FinishId>('silver');
  const [rangeId, setRangeId] = useState('80-300');
  const [basket, setBasket] = useState<FinishId[]>([]);
  const [news, setNews] = useState('');
  const turn = useRef<{ pointer: number; angle: number; value: number } | null>(null);

  const t = (text: Tri) => text[lang];

  const finish = FINISHES.find((item) => item.id === finishId) ?? FINISHES[0];
  const range = RANGES.find((item) => item.id === rangeId) ?? RANGES[2];
  const volumeText = volume <= MUTE ? t(HERO.mute) : fill(t(HERO.db), { v: decibels(volume) });
  const lastAdded = basket.length > 0 ? FINISHES.find((item) => item.id === basket[basket.length - 1]) ?? FINISHES[0] : null;

  const setDb = (db: number) => setVolume(clamp(Math.round(db), MUTE, TOP));

  const onKnobKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowUp: 1,
      ArrowRight: 1,
      ArrowDown: -1,
      ArrowLeft: -1,
      PageUp: PAGE_DB,
      PageDown: -PAGE_DB,
    };
    let next: number | undefined;
    if (event.key in steps) next = volume + steps[event.key];
    else if (event.key === 'Home') next = MUTE;
    else if (event.key === 'End') next = TOP;
    if (next === undefined) return;
    event.preventDefault();
    setDb(next);
  };

  // Turning the knob: the level follows the change of angle from where the pointer went
  // down, so a tap changes nothing and the knob turns like a real one.
  const angleAt = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - (box.left + box.width / 2);
    const y = event.clientY - (box.top + box.height / 2);
    return { angle: (Math.atan2(x, -y) * 180) / Math.PI, centre: Math.hypot(x, y) < box.width * 0.08 };
  };

  const onKnobDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    turn.current = { pointer: event.pointerId, angle: angleAt(event).angle, value: volume };
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
    drag.value = clamp(drag.value + delta / DEG_PER_DB, MUTE, TOP);
    setDb(drag.value);
  };

  const endTurn = (event: PointerEvent<HTMLDivElement>) => {
    if (turn.current?.pointer === event.pointerId) turn.current = null;
  };

  const chooseFinish = (id: FinishId) => {
    if (id === finishId) return;
    const next = FINISHES.find((item) => item.id === id) ?? FINISHES[0];
    setFinishId(id);
    setNews(fill(t(HERO.finishNews), { finish: t(next.name), phrase: t(next.phrase) }));
  };

  const chooseRange = (next: Range) => {
    if (next.id === rangeId) return;
    setRangeId(next.id);
    setNews(fill(t(PHONES.news), { range: t(next.label), gain: t(GAIN[next.gain]) }));
  };

  const addToBasket = () => setBasket((items) => [...items, finishId]);

  return (
    <FusionShell
      fusionId="liquid-metal"
      lang={lang}
      tone="dark"
      accent="#f0f0f0"
      prev={{ href: '/pages/earth-atelier.html', label: 'Earth Atelier' }}
      next={{ href: '/pages/aurora-gradient.html', label: 'Aurora Gradient' }}
      prompts={PROMPTS}
    >
      <div className="ha" data-finish={finishId}>
        <header className="ha-bar">
          <p className="ha-mark">Halden</p>
          <nav className="ha-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#ha-io">{t(HEAD.io)}</a>
            <a href="#ha-specs">{t(HEAD.specs)}</a>
            <a href="#ha-phones">{t(HEAD.headphones)}</a>
            <a href="#ha-box">{t(HEAD.box)}</a>
          </nav>
          <a className="ha-btn ha-bar__buy" href="#ha-buy">
            {basket.length > 0 ? (
              <>
                {t(HEAD.basket)} <b className="ha-num">{basket.length}</b>
              </>
            ) : (
              t(HEAD.buy)
            )}
          </a>
        </header>

        <section className="ha-hero" aria-labelledby="ha-name">
          <div className="ha-hero__name">
            <h1 id="ha-name" className="ha-chrome">
              <span>Halden</span> <span>{MODEL}</span>
            </h1>
            <p className="ha-drives">{t(HERO.drives)}</p>
          </div>

          <div className="ha-dial">
            <svg viewBox="0 0 600 600" aria-hidden="true" focusable="false">
              <path className="ha-dial__arc" d="M155.2 444.8A205 205 0 1 1 444.8 444.8" />
              <path className="ha-dial__tick" d={MINOR_TICKS} />
              <path className="ha-dial__tick ha-dial__tick--major" d={MAJOR_TICKS} />
              {SCALE_FIGURES.map((figure) => (
                <text
                  key={figure.db}
                  className={figure.db === TOP ? 'is-top' : undefined}
                  x={figure.x.toFixed(1)}
                  y={figure.y.toFixed(1)}
                  textAnchor={figure.anchor}
                >
                  {figure.db === MUTE ? t(HERO.mute) : figure.db === TOP ? '0 dB' : decibels(figure.db)}
                </text>
              ))}
            </svg>
            <div
              className="ha-knob"
              role="slider"
              tabIndex={0}
              aria-labelledby="ha-volume-label"
              aria-valuemin={MUTE}
              aria-valuemax={TOP}
              aria-valuenow={volume}
              aria-valuetext={volumeText}
              onKeyDown={onKnobKey}
              onPointerDown={onKnobDown}
              onPointerMove={onKnobMove}
              onPointerUp={endTurn}
              onPointerCancel={endTurn}
            >
              <span className="ha-knob__face" />
              <span className="ha-knob__ptr" style={{ transform: `rotate(${angleOf(volume)}deg)` }}>
                <i />
              </span>
            </div>
            <p className="ha-readout">
              <span id="ha-volume-label">{t(HERO.volume)}</span> <b className="ha-num">{volumeText}</b>
            </p>
          </div>

          <div className="ha-hero__buy" id="ha-buy">
            <p className="ha-price">
              <b className="ha-num"><span className="ha-cur">€</span>{PRICE}</b> <span>{t(HERO.priceNote)}</span>
            </p>
            <fieldset className="ha-finish">
              <legend>{t(HERO.finish)}</legend>
              {FINISHES.map((item) => (
                <button key={item.id} type="button" aria-pressed={item.id === finishId} onClick={() => chooseFinish(item.id)}>
                  <i className={`ha-sw ha-sw--${item.id}`} aria-hidden="true" />
                  {t(item.name)}
                </button>
              ))}
            </fieldset>
            <div className="ha-actions">
              <button className="ha-btn ha-btn--chrome" type="button" onClick={addToBasket}>{t(HERO.add)}</button>
              <a className="ha-link" href="#ha-dealers">{t(HERO.dealer)}</a>
            </div>
            <p className="ha-added" role="status">
              {lastAdded
                ? fill(t(basket.length === 1 ? HERO.addedOne : HERO.addedMore), { finish: t(lastAdded.phrase), n: basket.length })
                : ''}
            </p>
            <p className="ha-stock">{t(HERO.stock)}</p>
          </div>
        </section>

        <section className="ha-section" id="ha-io" aria-labelledby="ha-io-title">
          <div className="ha-sec-head">
            <h2 id="ha-io-title">{t(IO.title)}</h2>
            <p>{t(IO.note)}</p>
          </div>
          <div className="ha-rear">
            <RearPlate />
            {IO.groups.map((group, index) => (
              <div key={group.name.en} className="ha-lab" style={vars({ '--ha-i': index + 1 })}>
                <h3>{t(group.name)}</h3>
                <p>{t(group.body)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ha-section" id="ha-specs" aria-labelledby="ha-specs-title">
          <div className="ha-sec-head">
            <h2 id="ha-specs-title">{t(SPECS.title)}</h2>
            <p>{t(SPECS.note)}</p>
          </div>

          <p className="ha-power__cap" id="ha-power-cap">
            {t(SPECS.caption)} <span>{t(SPECS.captionNote)}</span>
          </p>
          <div className="ha-power" role="table" aria-labelledby="ha-power-cap">
            <div role="rowgroup">
              <div className="ha-power__row ha-power__row--head" role="row">
                <span role="columnheader">{t(SPECS.load)}</span>
                <span role="columnheader"><i className="ha-key ha-key--se" aria-hidden="true" />{t(SPECS.single)}</span>
                <span role="columnheader"><i className="ha-key ha-key--bal" aria-hidden="true" />{t(SPECS.balanced)}</span>
                <span className="ha-power__scale" role="columnheader">
                  <span className="ha-sr">{t(SPECS.scale)}</span>
                  <span className="ha-power__marks ha-num" aria-hidden="true">
                    <span>0.1 W</span>
                    <span>1 W</span>
                    <span>10 W</span>
                  </span>
                </span>
              </div>
            </div>
            <div role="rowgroup">
              {POWER.map((row) => (
                <div key={row.load} className="ha-power__row" role="row">
                  <span className="ha-power__load" role="rowheader">{fill(t(SPECS.ohms), { n: row.load })}</span>
                  <span className="ha-power__v ha-num" role="cell">{row.single[0]}<small>{row.single[1]}</small></span>
                  <span className="ha-power__v ha-num" role="cell">{row.balanced[0]}<small>{row.balanced[1]}</small></span>
                  <span className="ha-power__bars" role="cell">
                    <span aria-hidden="true">
                      <i className="ha-bar-se" style={{ width: `${row.bars[0]}%` }} />
                      <i className="ha-bar-bal" style={{ width: `${row.bars[1]}%` }} />
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <dl className="ha-spec">
            {SPEC_LIST.map((spec) => (
              <div key={spec.name.en}>
                <dt>{t(spec.name)}</dt>
                <dd>
                  <b className="ha-num">{spec.value(lang)}</b>
                  <span>{t(spec.note)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ha-section" id="ha-phones" aria-labelledby="ha-phones-title">
          <div className="ha-sec-head">
            <h2 id="ha-phones-title">{t(PHONES.title)}</h2>
            <p>{t(PHONES.note)}</p>
          </div>

          <div className="ha-scale-box">
            <p className="ha-scale-cap">{t(PHONES.scale)}</p>
            <div className="ha-scale ha-num" aria-hidden="true">
              {OHM_MARKS.map((mark) => (
                <span key={mark.n} style={{ left: `${mark.at}%` }}>{mark.n}</span>
              ))}
            </div>
            <div className="ha-ticks" aria-hidden="true">
              <i className="ha-ticks__on" style={{ left: `${range.from}%`, width: `${range.to - range.from}%` }} />
            </div>
            <div className="ha-bands" role="group" aria-label={t(PHONES.group)}>
              {RANGES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === rangeId}
                  style={vars({ '--ha-from': `${item.from}%`, '--ha-to': `${item.to}%` })}
                  onClick={() => chooseRange(item)}
                >
                  {t(item.label)}
                  <span className="ha-sr">{t(PHONES.ohms)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ha-setting">
            <span className="ha-setting__panel" aria-hidden="true">
              <span className="ha-switch ha-switch--large" data-pos={range.gain}>
                <i />
              </span>
              <span className="ha-setting__legend">
                <span>{t(GAIN.low)}</span>
                <span>{t(GAIN.mid)}</span>
                <span>{t(GAIN.high)}</span>
              </span>
            </span>
            <p className="ha-setting__text">
              <span className="ha-setting__for">{fill(t(PHONES.setFor), { range: t(range.phrase) })}</span>
              {place(t(PHONES.set), 'gain', <b>{t(GAIN[range.gain])}</b>)}
            </p>
          </div>

          <div className="ha-ranges">
            <div className="ha-ranges__th" aria-hidden="true">
              <span>{t(PHONES.colRange)}</span>
              <span>{t(PHONES.colWho)}</span>
              <span>{t(PHONES.colGain)}</span>
              <span>{t(PHONES.colPower)}</span>
            </div>
            <ul>
              {RANGES.map((item) => {
                const on = item.id === rangeId;
                return (
                  <li key={item.id} className={`ha-range${on ? ' is-on' : ''}`} aria-current={on ? 'true' : undefined}>
                    <b className="ha-range__ohms ha-num">{t(item.label)}{t(PHONES.ohms)}</b>
                    <div className="ha-range__who">
                      <p>{t(item.kind)}</p>
                      <p>{t(item.models)}</p>
                    </div>
                    <p className="ha-range__gain">
                      <span className="ha-sr">{t(PHONES.colGain)}: </span>
                      {t(GAIN[item.gain])}
                    </p>
                    <p className="ha-range__pw">
                      <span className="ha-sr">{t(PHONES.colPower)}: </span>
                      <b className="ha-num">{item.balanced}</b>
                      <span>{t(item.single)}</span>
                    </p>
                    {on ? <p className="ha-range__note">{t(item.note)}</p> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="ha-section ha-box" id="ha-box" aria-labelledby="ha-box-title ha-war-title">
          <div className="ha-box__in">
            <h2 id="ha-box-title">{t(BOX.title)}</h2>
            <ul className="ha-items">
              <li>
                <b className="ha-items__q ha-num">1</b>
                <span>
                  {t(BOX.amp)}
                  <small>{fill(t(BOX.ampNote), { phrase: t(finish.phrase) })}</small>
                </span>
              </li>
              {BOX.items.map((item) => (
                <li key={item.name.en}>
                  <b className="ha-items__q ha-num">{item.n}</b>
                  <span>
                    {t(item.name)}
                    {item.note ? <small>{t(item.note)}</small> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ha-box__war">
            <h2 id="ha-war-title">{t(WARRANTY.title)}</h2>
            <p className="ha-years ha-num">{t(WARRANTY.years)}</p>
            <p className="ha-war__lead">{t(WARRANTY.lead)}</p>
            <dl className="ha-war">
              {WARRANTY.terms.map((term) => (
                <div key={term.name.en}>
                  <dt>{t(term.name)}</dt>
                  <dd>{t(term.body)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <footer className="ha-foot">
          <p>
            <b>{FOOT.company}</b>
            {t(FOOT.address)}
          </p>
          <p id="ha-dealers">
            <b>{t(FOOT.dealers)}</b>
            {t(FOOT.dealersBody)}
          </p>
          <p>
            <b>{t(FOOT.service)}</b>
            {t(FOOT.serviceBody)}
          </p>
        </footer>

        <p className="ha-sr" role="status">{news}</p>
      </div>
    </FusionShell>
  );
}
