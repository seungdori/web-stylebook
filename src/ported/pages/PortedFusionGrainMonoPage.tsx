import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFusionGrainMonoPage.css';

// The order page of Halide, a film lab that develops and scans film sent by post,
// in the Grain Mono style. The page is typed like the lab's own paperwork: one
// fixed-pitch face, ink rules, a contact sheet strip, an order envelope with tick
// boxes and a tear-off stub, a ruled price list, a five-day line, an address label.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

// A few sentences carry a figure the page works out, written as {name} in the copy.
// Keep those tokens as they are in every language.
const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (token, key: string) => (key in values ? String(values[key]) : token));

const LAB = {
  mark: 'Halide',
  name: 'Halide Film Lab',
  address: ['Unit 7, Tannery Yard', 'Calder Street', 'Leeds LS9 8TT'],
} as const;

const ORDER_NO = '0417';
const FILM_STOCK = 'Kestrel 400';

// One price table for the whole page, in pence for one roll. The order form, the
// stub, the price list and the two worked figures in the copy all read from it.
// null means the lab does not offer that service for that format.
type FormatId = 'f35' | 'f120' | 'single';
type ProcessId = 'c41' | 'bw' | 'e6';
type ScanId = 'standard' | 'large';
type ExtraId = 'push' | 'prints';
type ServiceId = ProcessId | ScanId | ExtraId;

const PRICES: Record<ServiceId, Record<FormatId, number | null>> = {
  c41: { f35: 500, f120: 550, single: 500 },
  bw: { f35: 700, f120: 750, single: 700 },
  e6: { f35: 950, f120: 1000, single: null },
  standard: { f35: 500, f120: 600, single: 500 },
  large: { f35: 800, f120: 950, single: 800 },
  push: { f35: 200, f120: 200, single: null },
  prints: { f35: 650, f120: 400, single: 650 },
};
const RETURN_POST = 350;
const FREE_POST_FROM = 4;
const VAT_RATE = 20;
const MIN_ROLLS = 1;
const MAX_ROLLS = 10;

const PROCESSES: ProcessId[] = ['c41', 'bw', 'e6'];
const SCANS: ScanId[] = ['standard', 'large'];
const EXTRAS: ExtraId[] = ['push', 'prints'];
// The price list keeps the three kinds of service apart with a heavier rule.
const PRICE_GROUPS: ServiceId[][] = [PROCESSES, SCANS, EXTRAS];

const pounds = (pence: number) => (pence / 100).toFixed(2);
const money = (pence: number) => `£${pounds(pence)}`;
const clampRolls = (count: number) => Math.min(MAX_ROLLS, Math.max(MIN_ROLLS, count));

// The two figures the copy quotes: the cheapest roll in the hero, and the sum
// written out beside the price list (35 mm colour, standard scan, return post).
const CHEAPEST_ROLL = Math.min(...(['f35', 'f120', 'single'] as const).map((id) => (PRICES.c41[id] ?? 0) + (PRICES.standard[id] ?? 0)));
const EXAMPLE_PARTS = [PRICES.c41.f35 ?? 0, PRICES.standard.f35 ?? 0, RETURN_POST];
const EXAMPLE_SUM = `${EXAMPLE_PARTS.map(money).join(' + ')} = ${money(EXAMPLE_PARTS.reduce((total, part) => total + part, 0))}`;

const FORMATS: Array<{ id: FormatId; name: Tri; short: Tri }> = [
  { id: 'f35', name: { en: '35 mm', ko: '35 mm', ja: '35 mm' }, short: { en: '35 mm', ko: '35 mm', ja: '35 mm' } },
  { id: 'f120', name: { en: '120', ko: '120 (중형)', ja: '120(ブローニー)' }, short: { en: '120', ko: '120', ja: '120' } },
  {
    id: 'single',
    name: { en: 'Single-use camera', ko: '일회용 카메라', ja: 'レンズ付きフィルム' },
    short: { en: 'Single-use', ko: '일회용', ja: 'レンズ付き' },
  },
];

// `row` names the service in the price list and on the stub; `option` is the
// shorter name beside its tick box.
const SERVICES: Record<ServiceId, { row: Tri; option: Tri; hint?: Tri }> = {
  c41: {
    row: { en: 'Develop, C-41 colour', ko: '현상, C-41 컬러', ja: '現像、C-41 カラー' },
    option: { en: 'C-41 colour', ko: 'C-41 컬러', ja: 'C-41 カラー' },
  },
  bw: {
    row: { en: 'Develop, black and white', ko: '현상, 흑백', ja: '現像、モノクロ' },
    option: { en: 'Black and white', ko: '흑백', ja: 'モノクロ' },
  },
  e6: {
    row: { en: 'Develop, E-6 slide', ko: '현상, E-6 슬라이드', ja: '現像、E-6 リバーサル' },
    option: { en: 'E-6 slide', ko: 'E-6 슬라이드', ja: 'E-6 リバーサル' },
  },
  standard: {
    row: { en: 'Scan, standard', ko: '스캔, 표준', ja: 'スキャン、標準' },
    option: { en: 'Standard', ko: '표준', ja: '標準' },
    hint: { en: '3000 px on the long edge', ko: '긴 변 3000 px', ja: '長辺 3000 px' },
  },
  large: {
    row: { en: 'Scan, large', ko: '스캔, 대형', ja: 'スキャン、大サイズ' },
    option: { en: 'Large', ko: '대형', ja: '大サイズ' },
    hint: { en: '6000 px on the long edge', ko: '긴 변 6000 px', ja: '長辺 6000 px' },
  },
  push: {
    row: { en: 'Push or pull one stop', ko: '한 스톱 증감 또는 감감 현상', ja: '1段の増感または減感現像' },
    option: { en: 'Push or pull one stop', ko: '한 스톱 증감 또는 감감 현상', ja: '1段の増感または減感現像' },
  },
  prints: {
    row: { en: 'Prints, 6 × 4 in', ko: '인화, 6 × 4 in', ja: 'プリント、6 × 4 in' },
    option: { en: 'Prints', ko: '인화', ja: 'プリント' },
    hint: { en: '6 × 4 in, one of each frame', ko: '6 × 4 in, 프레임마다 한 장', ja: '6 × 4 in、コマごとに1枚' },
  },
};

const NAV = {
  label: { en: 'On this page', ko: '이 페이지 목차', ja: 'このページの目次' },
  prices: { en: 'Prices', ko: '가격', ja: '料金' },
  days: { en: 'Turnaround', ko: '진행 기간', ja: '所要日数' },
  post: { en: 'Where to post', ko: '발송 방법', ja: '発送方法' },
  questions: { en: 'Questions', ko: '질문', ja: 'よくある質問' },
  start: { en: 'Start an order', ko: '주문 시작', ja: '注文を始める' },
} satisfies Record<string, Tri>;

const HERO = {
  title: {
    en: 'Develop and scan, back in five working days.',
    ko: '현상과 스캔, 영업일 닷새면 돌려드립니다.',
    ja: '現像とスキャン、営業日5日でお返しします。',
  },
  lede: {
    en: 'Post your film to our lab in Leeds. We develop it, scan every frame and email you the files, then send the negatives back cut and sleeved.',
    ko: '리즈에 있는 저희 현상소로 필름을 보내 주세요. 현상하고 모든 프레임을 스캔한 뒤 파일을 이메일로 보내 드리며, 네거티브는 잘라서 슬리브에 담아 돌려보내 드립니다.',
    ja: 'Leeds にある当ラボにフィルムをお送りください。現像して全コマをスキャンし、データをメールでお送りします。ネガは切ってスリーブに入れた状態でご返却します。',
  },
  from: {
    en: 'From {price} a roll, developed and scanned.',
    ko: '롤당 {price}부터, 현상과 스캔 포함.',
    ja: '1本 {price} から、現像とスキャン込み。',
  },
  link: { en: 'Fill in the order envelope', ko: '주문 봉투 작성하기', ja: '注文封筒を記入する' },
} satisfies Record<string, Tri>;

const SHEET = {
  alt: {
    en: 'Contact sheet of roll 0398: twelve frames on Kestrel 400 film, numbered 1 to 12',
    ko: '롤 0398의 밀착 인화: Kestrel 400 필름 12컷, 1번부터 12번까지 번호 표시',
    ja: 'ロール0398のコンタクトシート：Kestrel 400の12コマ、1から12までの番号付き',
  },
  caption: {
    en: 'Roll 0398, twelve frames of 120 on Kestrel 400. A contact sheet like this one comes back with every order.',
    ko: '롤 0398, Kestrel 400 120 필름 12컷. 주문마다 이런 밀착 인화가 함께 돌아갑니다.',
    ja: 'ロール0398、Kestrel 400・120の12コマ。ご注文ごとにこのようなコンタクトシートを同封します。',
  },
  remark: {
    en: 'Frame 7 came out a stop under, so we scanned it a second time for the shadows.',
    ko: '7번 프레임은 한 스톱 적게 나와서, 그림자를 살리려고 한 번 더 스캔했습니다.',
    ja: '7番のコマは1段露出が不足していたため、影を出すためにもう一度スキャンしました。',
  },
} satisfies Record<string, Tri>;

// Twelve frames of one roll. `tone` is the exposure of the frame; the stylesheet
// lays the film grain over it. `edge` says on which strip lengths the frame's edge
// carries the stock name: 'a' for rows of twelve and four, 'b' for rows of six.
const FRAMES: Array<{ tone: string; edge: Array<'a' | 'b'> }> = [
  { tone: 'linear-gradient(175deg, #c4c2bd, #7d7b77 60%, #55534f)', edge: ['a', 'b'] },
  { tone: 'linear-gradient(200deg, #8f8d89, #4a4845)', edge: [] },
  { tone: 'radial-gradient(120% 90% at 30% 20%, #d6d4cf, #8a8884 70%)', edge: [] },
  { tone: 'linear-gradient(160deg, #6b6966, #2f2d2b)', edge: ['b'] },
  { tone: 'linear-gradient(185deg, #a9a7a2, #b9b7b2 40%, #6a6865)', edge: ['a'] },
  { tone: 'radial-gradient(90% 90% at 70% 65%, #9c9a96, #3c3a38 85%)', edge: [] },
  { tone: 'linear-gradient(170deg, #353331, #1f1d1b)', edge: ['b'] },
  { tone: 'linear-gradient(190deg, #dedcd6, #a3a19c)', edge: [] },
  { tone: 'linear-gradient(150deg, #807e7a, #5b5956 50%, #8d8b87)', edge: ['a'] },
  { tone: 'radial-gradient(110% 80% at 50% 0%, #cfcdc8, #6e6c68 80%)', edge: ['b'] },
  { tone: 'linear-gradient(180deg, #5d5b58, #777571 45%, #3e3c3a)', edge: [] },
  { tone: 'linear-gradient(205deg, #b3b1ac, #4f4d4a)', edge: [] },
];

const ENVELOPE = {
  title: { en: 'Fill in the order envelope', ko: '주문 봉투 작성하기', ja: '注文封筒を記入する' },
  note: {
    en: 'Tick what you want done with your film. The total on the stub keeps up as you go. Nothing is paid on this page: we email the bill once your film is in the lab.',
    ko: '필름에 대해 원하는 작업을 체크해 주세요. 보관증의 합계는 선택에 맞춰 바로 바뀝니다. 이 페이지에서는 결제하지 않습니다. 필름이 현상소에 도착하면 청구서를 이메일로 보내 드립니다.',
    ja: 'フィルムに対して希望する作業にチェックを入れてください。控えの合計金額は選択に合わせて更新されます。このページでは支払いは発生しません。フィルムがラボに届いたら、請求書をメールでお送りします。',
  },
  head: { en: 'Halide Film Lab order', ko: 'Halide Film Lab 주문서', ja: 'Halide Film Lab 注文書' },
  number: { en: 'No. {no}', ko: '번호 {no}', ja: '番号 {no}' },
  name: { en: 'Name', ko: '이름', ja: 'お名前' },
  email: { en: 'Email', ko: '이메일', ja: 'メールアドレス' },
  rolls: { en: 'Rolls', ko: '롤 수', ja: '本数' },
  fewer: { en: 'One roll fewer', ko: '롤 한 개 줄이기', ja: '1本減らす' },
  more: { en: 'One roll more', ko: '롤 한 개 늘리기', ja: '1本増やす' },
  format: { en: 'Film format', ko: '필름 형식', ja: 'フィルム形式' },
  process: { en: 'Process', ko: '현상 방식', ja: '現像方法' },
  scan: { en: 'Scan size', ko: '스캔 크기', ja: 'スキャンサイズ' },
  extras: { en: 'Extras', ko: '추가 옵션', ja: 'オプション' },
  tickOne: { en: 'tick one', ko: '하나만 선택', ja: '1つ選択' },
  tickAny: { en: 'tick any', ko: '여러 개 선택 가능', ja: '複数選択可' },
  notOffered: {
    en: 'Not offered for single-use cameras',
    ko: '일회용 카메라에는 제공하지 않습니다',
    ja: 'レンズ付きフィルムには提供していません',
  },
  notes: { en: 'Notes for the lab', ko: '현상소에 전할 메모', ja: 'ラボへのメモ' },
  notesExample: {
    en: 'For example: shot at 800, push one stop',
    ko: '예: 800으로 촬영, 한 스톱 증감',
    ja: '例：800で撮影、1段増感',
  },
  required: { en: 'Needed for every order.', ko: '모든 주문에 필수입니다.', ja: 'すべての注文で必須です。' },
  limit: {
    en: 'One envelope takes up to {max} rolls.',
    ko: '봉투 한 장에는 최대 {max}롤까지 담을 수 있습니다.',
    ja: '封筒1枚には最大{max}本まで入れられます。',
  },
  nameMissing: { en: 'Write your name.', ko: '이름을 입력해 주세요.', ja: 'お名前を入力してください。' },
  emailMissing: { en: 'Write your email address.', ko: '이메일 주소를 입력해 주세요.', ja: 'メールアドレスを入力してください。' },
  emailInvalid: {
    en: 'Check the email address. It needs an @ and a domain.',
    ko: '이메일 주소를 확인해 주세요. @와 도메인이 있어야 합니다.',
    ja: 'メールアドレスを確認してください。@とドメインが必要です。',
  },
} satisfies Record<string, Tri>;

const STUB = {
  label: { en: 'Running total for order {no}', ko: '주문 {no} 합계', ja: '注文番号 {no} の合計' },
  note: { en: 'Prices in pounds, VAT included', ko: '가격은 파운드 기준, 부가세 포함', ja: '価格はポンド表記、税込' },
  contact: { en: 'Contact sheet', ko: '밀착 인화', ja: 'ベタ焼き' },
  each: { en: 'Each roll', ko: '롤당', ja: '1本あたり' },
  rolls: { en: 'Rolls', ko: '롤 수', ja: '本数' },
  post: { en: 'Return post, tracked', ko: '반송 우편 (추적 가능)', ja: '返送料（追跡あり）' },
  postFree: { en: 'Return post, free', ko: '반송 우편 (무료)', ja: '返送料（無料）' },
  total: { en: 'Total so far', ko: '현재 합계', ja: '現在の合計' },
  vat: { en: 'Includes VAT at {rate}%, {amount}', ko: '부가세 포함 (세율 {rate}%), {amount}', ja: '消費税{rate}%、{amount}を含む' },
  submit: { en: 'Send the order', ko: '주문 보내기', ja: '注文を送信' },
  payNote: {
    en: 'Nothing to pay now. We email the bill when your film arrives.',
    ko: '지금 결제할 금액은 없습니다. 필름이 도착하면 청구서를 이메일로 보내 드립니다.',
    ja: '今はお支払いの必要はありません。フィルムが届いたら、請求書をメールでお送りします。',
  },
  doneTitle: { en: 'Order no. {no} is booked in.', ko: '주문 번호 {no} 접수가 완료되었습니다.', ja: '注文番号 {no} を受け付けました。' },
  doneHow: {
    en: 'Write {no} and your name on the parcel and post it to:',
    ko: '소포 겉면에 주문 번호 {no}과 이름을 적어 아래 주소로 보내 주세요:',
    ja: '小包の外側に注文番号 {no} とお名前を書き、下記までお送りください:',
  },
  donePay: {
    en: 'Nothing has been charged. The bill follows by email.',
    ko: '아직 결제되지 않았습니다. 청구서는 이메일로 보내 드립니다.',
    ja: 'まだ請求はされていません。請求書はメールでお送りします。',
  },
  change: { en: 'Change the order', ko: '주문 수정', ja: '注文を変更' },
} satisfies Record<string, Tri>;

const PRICE_LIST = {
  title: { en: 'Prices for one roll', ko: '1롤 기준 가격', ja: '1本あたりの料金' },
  note: {
    en: 'Add one developing price and one scan price. Extras are optional.',
    ko: '현상 가격 하나와 스캔 가격 하나를 더하세요. 추가 옵션은 선택 사항입니다.',
    ja: '現像料金とスキャン料金をそれぞれ1つずつ足してください。オプションは任意です。',
  },
  service: { en: 'Service', ko: '항목', ja: '項目' },
  notOffered: { en: 'not offered', ko: '제공 안 함', ja: '提供なし' },
  post: {
    en: 'Return post is {post} for each order, tracked. Orders of {count} rolls or more go back free.',
    ko: '반송 우편은 주문마다 {post}이며 추적이 가능합니다. {count}롤 이상 주문은 무료로 반송합니다.',
    ja: '返送料は注文ごとに{post}で、追跡付きです。{count}本以上のご注文は返送料が無料です。',
  },
  example: {
    en: 'One roll of 35 mm colour with a standard scan comes to {sum}.',
    ko: '35 mm 컬러 한 롤에 표준 스캔을 더하면 {sum}입니다.',
    ja: '35mmカラー1本に標準スキャンを付けた場合は{sum}です。',
  },
  link: { en: 'Work out your own total', ko: '직접 합계 계산해 보기', ja: '自分の合計を計算する' },
} satisfies Record<string, Tri>;

const DAYS = {
  title: {
    en: 'What happens in the five working days',
    ko: '영업일 닷새 동안 진행되는 과정',
    ja: '営業日5日間の流れ',
  },
  note: {
    en: 'Film that reaches us by 10:00 on a Monday is posted back on the Friday.',
    ko: '월요일 10:00까지 도착한 필름은 금요일에 발송해 드립니다.',
    ja: '月曜日の10:00までに届いたフィルムは、金曜日に返送します。',
  },
  day: { en: 'Day {n}', ko: '{n}일차', ja: '{n}日目' },
  steps: [
    {
      weekday: { en: 'Monday', ko: '월요일', ja: '月曜日' },
      name: { en: 'Received', ko: '접수', ja: '受付' },
      body: {
        en: 'We log your rolls against the order number and email you the bill.',
        ko: '롤을 주문 번호와 대조해 등록하고, 청구서를 이메일로 보내 드립니다.',
        ja: 'ロールを注文番号と照合して登録し、請求書をメールでお送りします。',
      },
    },
    {
      weekday: { en: 'Tuesday', ko: '화요일', ja: '火曜日' },
      name: { en: 'Developed', ko: '현상', ja: '現像' },
      body: {
        en: 'Colour goes through the machine each morning. Black and white is developed by hand in tanks.',
        ko: '컬러는 매일 아침 현상기에 넣습니다. 흑백은 탱크에서 손으로 현상합니다.',
        ja: 'カラーは毎朝、現像機で処理します。モノクロはタンクで手作業により現像します。',
      },
    },
    {
      weekday: { en: 'Wednesday', ko: '수요일', ja: '水曜日' },
      name: { en: 'Scanned', ko: '스캔', ja: 'スキャン' },
      body: {
        en: 'Every frame is scanned at the size you ticked and saved as a JPEG file.',
        ko: '모든 프레임을 선택하신 크기로 스캔하고 JPEG 파일로 저장합니다.',
        ja: '全コマを選択されたサイズでスキャンし、JPEGファイルとして保存します。',
      },
    },
    {
      weekday: { en: 'Thursday', ko: '목요일', ja: '木曜日' },
      name: { en: 'Checked', ko: '검수', ja: '検品' },
      body: {
        en: 'A technician looks over each scan for dust and colour, then emails your download link.',
        ko: '기술 담당자가 스캔본마다 먼지와 색감을 확인한 뒤 다운로드 링크를 이메일로 보내 드립니다.',
        ja: '技術担当者がスキャンごとにホコリと色味を確認し、ダウンロードリンクをメールでお送りします。',
      },
    },
    {
      weekday: { en: 'Friday', ko: '금요일', ja: '金曜日' },
      name: { en: 'Posted', ko: '발송', ja: '発送' },
      body: {
        en: 'Your negatives are cut, sleeved and posted back to you, tracked.',
        ko: '네거티브는 잘라서 슬리브에 담고, 추적 가능한 우편으로 보내 드립니다.',
        ja: 'ネガは切ってスリーブに入れ、追跡付きで返送します。',
      },
    },
  ] as Array<{ weekday: Tri; name: Tri; body: Tri }>,
};

const POST = {
  title: { en: 'Where to post your film', ko: '필름을 보내실 주소', ja: 'フィルムの送付先' },
  note: {
    en: 'Any padded envelope will do. Write your name and the order number on the outside, as on this label.',
    ko: '뽁뽁이 봉투면 충분합니다. 이 라벨처럼 겉면에 이름과 주문 번호를 적어 주세요.',
    ja: '緩衝材入りの封筒であれば問題ありません。このラベルのように、外側にお名前と注文番号を書いてください。',
  },
  from: { en: 'From:', ko: '보내는 사람:', ja: '差出人：' },
  fromBlank: { en: 'your name', ko: '이름', ja: 'お名前' },
  order: { en: 'Order no. {no}', ko: '주문 번호 {no}', ja: '注文番号 {no}' },
  stamp: { en: 'Stamp', ko: '우표', ja: '切手' },
  parcelTitle: { en: 'What to put in the parcel', ko: '소포에 넣을 것', ja: '小包に入れるもの' },
  parcel: [
    {
      en: 'Your rolls, each in its tub or wrapped in foil.',
      ko: '롤은 각각 통에 담거나 호일로 감싸서 넣어 주세요.',
      ja: 'ロールはそれぞれケースに入れるか、ホイルで包んでください。',
    },
    {
      en: 'Single-use cameras whole. We open them here.',
      ko: '일회용 카메라는 통째로 넣어 주세요. 개봉은 저희가 합니다.',
      ja: 'レンズ付きフィルムはそのままお送りください。開封はこちらで行います。',
    },
    {
      en: 'Nothing else. The order number on the outside tells us what to do.',
      ko: '그 밖의 물건은 넣지 마세요. 겉면의 주문 번호를 보고 작업을 진행합니다.',
      ja: 'それ以外のものは入れないでください。外側の注文番号で作業を判断します。',
    },
  ] as Tri[],
  counter: {
    en: 'You can also hand film in at the counter, Monday to Friday, 9:00 to 17:00.',
    ko: '월요일부터 금요일, 9:00~17:00에는 창구에서도 필름을 맡기실 수 있습니다.',
    ja: '月曜日から金曜日の9:00〜17:00は、窓口でフィルムをお預けいただくこともできます。',
  },
};

const QUESTIONS = {
  title: { en: 'Questions', ko: '질문', ja: 'よくある質問' },
  rows: [
    [
      {
        en: 'Can you develop film that expired years ago?',
        ko: '몇 년 전에 유통기한이 지난 필름도 현상해 주나요?',
        ja: '期限が何年も前に切れたフィルムも現像できますか？',
      },
      {
        en: 'Yes. We give it the standard time unless your notes ask for a push. Expect more grain and flatter colour.',
        ko: '네. 메모에 증감 현상을 요청하지 않으셨다면 표준 시간으로 현상합니다. 입자는 조금 거칠고 색은 다소 밋밋해질 수 있습니다.',
        ja: 'はい。メモで増感の指定がない限り、標準時間で現像します。粒状感が増し、色味はやや平坦になる場合があります。',
      },
    ],
    [
      { en: 'What if a roll comes out blank?', ko: '롤이 빈 상태로 나오면 어떻게 되나요?', ja: 'ロールが空白で出てきたら、どうなりますか？' },
      {
        en: 'You pay for developing only. We take the scan off the bill and tell you what we think went wrong.',
        ko: '현상 요금만 내시면 됩니다. 스캔 요금은 청구서에서 빼고, 무엇이 문제였을지 알려 드립니다.',
        ja: '現像料金のみお支払いいただきます。スキャン料金は請求から外し、考えられる原因をお伝えします。',
      },
    ],
    [
      { en: 'How do I get my scans?', ko: '스캔본은 어떻게 받나요?', ja: 'スキャンデータはどのように受け取りますか？' },
      {
        en: 'We email a download link on day 4. The files stay there for 60 days.',
        ko: '4일차에 다운로드 링크를 이메일로 보내 드립니다. 파일은 60일 동안 보관됩니다.',
        ja: '4日目にダウンロードリンクをメールでお送りします。ファイルは60日間保管されます。',
      },
    ],
    [
      { en: 'Do you keep my negatives?', ko: '네거티브도 보관해 주나요?', ja: 'ネガは保管していただけますか？' },
      {
        en: 'No. They go back to you cut and sleeved, with the contact sheet. A parcel that is returned to us is kept for six months.',
        ko: '아니요. 네거티브는 잘라서 슬리브에 담고 밀착 인화와 함께 돌려보내 드립니다. 저희에게 되돌아온 소포는 6개월 동안 보관합니다.',
        ja: 'いいえ。ネガは切ってスリーブに入れ、ベタ焼きと一緒にお返しします。返送されて当店に戻った小包は6か月間保管します。',
      },
    ],
    [
      { en: 'Can I send more than ten rolls?', ko: '롤을 열 개 넘게 보내도 되나요?', ja: '10本以上送ってもいいですか？' },
      {
        en: 'Yes. Fill in a second envelope for the rest. Every envelope of four rolls or more goes back post free.',
        ko: '네. 나머지는 봉투를 한 장 더 작성해 주세요. 네 롤 이상 담긴 봉투는 모두 반송 우편이 무료입니다.',
        ja: 'はい。残りは封筒をもう1枚記入してください。4本以上入った封筒はすべて返送料が無料です。',
      },
    ],
  ] as Array<[Tri, Tri]>,
};

const FOOTER = {
  counter: {
    en: 'Counter open Monday to Friday, 9:00 to 17:00',
    ko: '창구 운영: 월요일~금요일 9:00~17:00',
    ja: '窓口営業：月曜日〜金曜日 9:00〜17:00',
  },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in Grain Mono style — a typed page on grainy paper: one typewriter face, ink rules and film grain, like the paperwork of a small workshop.

Pick a believable subject that lives on paper forms, such as a film lab that develops by post, a repair bench, a print shop or a parcel counter, and write its real content. The page must read as that subject's page, never as a page about its own style.

COLOR TOKENS:
--paper: #f3eee3
--stock: rgba(255,255,255,0.56) over the paper (#faf8f3 where it must be opaque)
--ink: #1a1612
--muted: #5d5851
--rule: rgba(26,22,18,0.36)
--rust: #b85431
--teal: #2e6f7d
No other colours. Rust has one job: the running total and the required marks. Teal has one job: links and the focus ring. Everything else is ink on paper, and the paper must read as off-white stock, never yellow.

GRAIN:
- A CSS texture: an inline SVG feTurbulence used as a background image. No photographs.
- Very faint on the page: ink-coloured specks from fractalNoise at baseFrequency 0.8, tiled at 180px.
- Strong on the film frames only: grey noise at baseFrequency 1.15, blended with overlay over each frame's tonal gradient.

TYPOGRAPHY:
One family for everything: Courier Prime, regular 400 and bold 700. It is fixed pitch, so figures line up in columns on their own.
Headline: bold, clamp(2.1rem, 7.6vw, 6rem), line-height 0.98, tracking -0.045em, at most 18 characters to a line
Section headings: bold, clamp(1.625rem, 3.3vw, 2.375rem), tracking -0.035em, underlined with a 3px ink line
Body: regular, 1.0625rem, line-height 1.55
Form labels and small print: 0.9375rem
The running total: bold, 2.5rem, in rust
No second typeface, no light weights, no italics for emphasis.

LAYOUT:
- Top bar: the name typed bold on the left, in-page links, one solid ink button, a 2px ink rule under it.
- Hero: the headline, then two sentences on the left and the "from" price with one underlined link on the right.
- Under the hero a contact sheet strip: twelve numbered frames in one row on a band of ink that runs to both edges of the screen, with the stock name on the film edge. On smaller screens the strip is cut into rows of six, then four.
- The order envelope: a ruled form on the left and a tear-off stub on the right behind a dashed line. The stub carries the receipt lines and the running total.
- Prices as one ruled table with a short note beside it. On a phone each row stacks, with the format named above each figure.
- The five working days on one line, a square for each day. On a phone the line turns upright.
- The address as a typed label with a dashed box for the postage stamp, next to what goes in the parcel.
- Questions as plain ruled rows, question on the left and answer on the right, all open.
- Max width about 1120px, section gap 104px.

COMPONENTS:
- Envelope: 2px ink border, cells divided by 1px ink rules, the label typed bold inside each cell above a dashed writing line. No separate input boxes.
- Tick boxes: 22px squares with a 2px ink border, for single choices and for extras alike. A tick is a pen cross drawn a little larger than its box.
- Stepper: two square keys with ink borders around the number.
- Receipt lines: the label, a leader of dots on the character grid, the figure at the right, and a double rule above the total.
- Buttons: solid ink, square, bold, at least 44px high. Two on the whole page.
- Links: teal, bold, 2px underline.
- Rules: 2px ink for edges, 1px ink inside the form, 1px at 0.36 opacity between table rows, dashed where the paper tears.
- Errors: one line under the field that says what to write, led by the rust asterisk.
- Corners are square everywhere.

MOTION:
- None. The total changes at once. Nothing fades, slides or bounces.

FORBIDDEN:
- A second typeface, or a monospace used as decoration around a sans-serif page
- Cards, pills and rounded corners
- A small label above every heading, all-caps tracked labels, section numbers
- Fake terminal prompts, ASCII boxes, a blinking typewriter cursor
- Coffee rings, torn edges, tape, rubber stamps, sepia or yellowed paper
- Photographs and illustrations: the frames are gradients and grain
- Rust or teal on anything outside their one job

OUTPUT:
1) CSS custom properties
2) Semantic HTML and CSS
3) Responsive layout down to 320px with no horizontal scroll: the table stacks, it does not scroll sideways
4) Visible focus, labelled form fields, errors next to the field, a running total that is announced`;

const PROMPT_KO = `Grain Mono 스타일로 실제 페이지 하나를 디자인한다. 그레인이 있는 종이 위에 타자로 친 페이지이며, 서체는 하나, 잉크 선과 필름 그레인을 쓴다. 작은 작업장의 서류처럼 보여야 한다.

종이 양식 위에서 움직이는 현실적인 주제를 고른다. 예를 들어 우편으로 현상을 받는 필름 현상소, 수리 작업대, 인쇄소, 소포 창구 같은 곳이다. 그 주제의 실제 내용을 써서 넣는다. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일을 설명하는 페이지로 읽혀서는 안 된다.

COLOR TOKENS:
--paper: #f3eee3
--stock: 종이 위에 덮는 rgba(255,255,255,0.56) (불투명이 필요한 곳은 #faf8f3)
--ink: #1a1612
--muted: #5d5851
--rule: rgba(26,22,18,0.36)
--rust: #b85431
--teal: #2e6f7d
다른 색은 쓰지 않는다. 러스트는 합계와 필수 표시에만 쓴다. 틸은 링크와 포커스 링에만 쓴다. 나머지는 모두 종이 위의 잉크다. 종이는 오프화이트 용지로 보여야 하며, 노란 기가 돌아서는 안 된다.

GRAIN:
- CSS 질감을 쓴다. 배경 이미지로 쓰는 인라인 SVG feTurbulence다. 사진은 쓰지 않는다.
- 페이지에는 아주 희미하게 쓴다. baseFrequency 0.8의 fractalNoise로 만든 잉크색 점을 180px 타일로 반복한다.
- 필름 프레임에만 강하게 쓴다. baseFrequency 1.15의 회색 노이즈를 각 프레임의 톤 그라데이션 위에 overlay로 섞는다.

TYPOGRAPHY:
서체는 하나만 쓴다. Courier Prime, regular 400과 bold 700이다. 고정폭이라 숫자는 따로 맞추지 않아도 열이 맞는다.
제목: bold, clamp(2.1rem, 7.6vw, 6rem), 줄 간격 0.98, 자간 -0.045em, 한 줄 최대 18자
섹션 제목: bold, clamp(1.625rem, 3.3vw, 2.375rem), 자간 -0.035em, 3px 잉크 선으로 밑줄
본문: regular, 1.0625rem, 줄 간격 1.55
양식 라벨과 작은 글씨: 0.9375rem
합계: bold, 2.5rem, 러스트색
두 번째 서체 금지. 얇은 굵기 금지. 강조용 기울임꼴 금지.

LAYOUT:
- 상단 바: 왼쪽에 이름을 bold로 쓰고, 페이지 안 링크와 단색 잉크 버튼 하나를 둔다. 그 아래에 2px 잉크 선을 긋는다.
- 히어로: 제목, 왼쪽에 두 문장, 오른쪽에 "from" 가격과 밑줄 친 링크 하나.
- 히어로 아래에 밀착 인화 띠를 둔다. 화면 양쪽 끝까지 이어지는 잉크색 띠 위에 번호가 붙은 프레임 12개를 한 줄로 놓고, 필름 가장자리에 필름명을 적는다. 작은 화면에서는 띠를 6개씩, 다음에는 4개씩 줄로 나눈다.
- 주문 봉투: 왼쪽에 선으로 구획한 양식, 오른쪽에 점선 뒤의 떼어 내는 보관증. 보관증에는 영수증 항목과 합계를 넣는다.
- 가격은 선으로 나눈 표 하나와 옆의 짧은 메모로 구성한다. 휴대폰에서는 각 행을 쌓고, 각 금액 위에 형식명을 쓴다.
- 영업일 5일을 한 줄에 놓고 하루마다 네모 하나를 둔다. 휴대폰에서는 줄을 세운다.
- 주소는 타자로 친 라벨로 두고, 우표 자리에 점선 상자를 둔다. 소포에 넣을 것과 나란히 배치한다.
- 질문은 선으로 구분한 평범한 행으로 두고, 왼쪽에 질문, 오른쪽에 답을 둔다. 모두 펼쳐 둔다.
- 최대 너비 약 1120px, 섹션 간격 104px.

COMPONENTS:
- 봉투: 2px 잉크 테두리, 칸은 1px 잉크 선으로 나눈다. 각 칸 안에 bold 라벨을 두고, 그 아래 점선 쓰기 줄을 둔다. 별도의 입력 상자는 쓰지 않는다.
- 체크 박스: 22px 정사각형, 2px 잉크 테두리. 단일 선택과 추가 옵션에 같은 것을 쓴다. 체크 표시는 펜으로 그린 엑스 자이며, 상자보다 조금 크게 그린다.
- 증감 조절: 숫자 양옆에 잉크 테두리를 두른 정사각형 버튼 두 개.
- 영수증 줄: 항목명, 글자 격자에 맞춘 점 리더, 오른쪽의 금액, 합계 위의 이중 선.
- 버튼: 잉크색 단색, 직각, bold, 높이 최소 44px. 페이지 전체에 두 개만 둔다.
- 링크: 틸색, bold, 2px 밑줄.
- 선: 가장자리는 2px 잉크, 양식 안은 1px 잉크, 표 행 사이는 불투명도 0.36의 1px, 종이가 찢어지는 곳은 점선.
- 오류: 입력 칸 아래에 한 줄로 무엇을 적어야 하는지 쓰고, 앞에 러스트색 별표를 붙인다.
- 모서리는 어디서나 직각이다.

MOTION:
- 없음. 합계는 즉시 바뀐다. 페이드, 슬라이드, 바운스는 쓰지 않는다.

FORBIDDEN:
- 두 번째 서체, 또는 산세리프 페이지를 꾸미는 데 쓴 고정폭 서체 금지
- 카드, 알약형 버튼, 둥근 모서리 금지
- 모든 제목 위에 붙이는 작은 라벨, 대문자 자간 라벨, 섹션 번호 금지
- 가짜 터미널 프롬프트, ASCII 상자, 깜빡이는 타자기 커서 금지
- 커피 자국, 찢어진 가장자리, 테이프, 고무 도장, 세피아나 누렇게 바랜 종이 금지
- 사진과 일러스트 금지. 프레임은 그라데이션과 그레인으로만 만든다.
- 러스트나 틸을 본래 역할 밖에 쓰는 것 금지

OUTPUT:
1) CSS 커스텀 속성
2) 의미에 맞는 HTML과 CSS
3) 320px까지 반응형 레이아웃, 가로 스크롤 없음: 표는 옆으로 스크롤하지 않고 쌓인다
4) 보이는 포커스, 라벨이 있는 양식 항목, 항목 옆의 오류 메시지, 읽어 주는 합계`;

const PROMPT_JA = `Grain Mono スタイルで実在するようなページを1つデザインする。粒状の紙にタイプで打ち込んだページで、タイプライター書体は1種類、インクの罫線とフィルムの粒状感を使う。小さな工房の書類のように見せる。

紙の書式の上で動く、もっともらしいテーマを選ぶ。例えば郵送で現像を受け付けるフィルム現像所、修理工房、印刷所、小包の窓口など。そのテーマの実際の内容を書く。ページはそのテーマのページとして読めなければならず、スタイルそのものを説明するページに見えてはならない。

COLOR TOKENS:
--paper: #f3eee3
--stock: 紙の上の rgba(255,255,255,0.56)（不透明が必要な箇所は #faf8f3）
--ink: #1a1612
--muted: #5d5851
--rule: rgba(26,22,18,0.36)
--rust: #b85431
--teal: #2e6f7d
他の色は使わない。ラストは合計と必須マークだけに使う。ティールはリンクとフォーカスリングだけに使う。それ以外はすべて紙の上のインクである。紙はオフホワイトの用紙に見えなければならず、黄色く見えてはならない。

GRAIN:
- CSS の質感。背景画像として使うインラインの SVG feTurbulence。写真は使わない。
- ページ全体にはごく薄く使う。baseFrequency 0.8 の fractalNoise によるインク色の斑点を、180px のタイルで並べる。
- フィルムのコマにだけ強く使う。baseFrequency 1.15 のグレーのノイズを、各コマの階調グラデーションの上に overlay で重ねる。

TYPOGRAPHY:
全体で1つのファミリーを使う。Courier Prime、regular 400 と bold 700。固定幅なので、数字は別途そろえなくても列がそろう。
見出し（大）: bold、clamp(2.1rem, 7.6vw, 6rem)、行送り 0.98、字間 -0.045em、1行は最大18文字
セクション見出し: bold、clamp(1.625rem, 3.3vw, 2.375rem)、字間 -0.035em、3px のインクの線で下線
本文: regular、1.0625rem、行送り 1.55
フォームのラベルと小さな文字: 0.9375rem
合計: bold、2.5rem、ラスト色
第2の書体、細いウェイト、強調のためのイタリック体は使わない。

LAYOUT:
- 上部バー: 左に名前を bold で置き、ページ内リンクと単色のインクボタン1つ。その下に 2px のインクの罫線。
- ヒーロー: 見出し、左に2文、右に「from」の価格と下線付きリンク1つ。
- ヒーローの下にベタ焼きの帯を置く。画面の両端まで続くインク色の帯の上に、番号付きのコマを1列に12枚並べ、フィルムの縁にフィルム名を入れる。小さい画面では帯を6枚ずつ、次に4枚ずつの列に分ける。
- 注文封筒: 左に罫線のあるフォーム、右に点線の向こう側の切り取り式の控え。控えには領収の項目と合計を載せる。
- 価格は罫線のある表1つと、その横の短い注記。スマートフォンでは各行を積み重ね、各金額の上に形式名を入れる。
- 営業日5日を1行に並べ、各日に四角を1つずつ置く。スマートフォンでは行を縦に立てる。
- 住所はタイプした宛名ラベルとし、切手用の点線の枠を添える。小包に入れるものと並べる。
- 質問は罫線のある平らな行にする。左に質問、右に回答。すべて開いた状態にする。
- 最大幅は約 1120px、セクション間は 104px。

COMPONENTS:
- 封筒: 2px のインクの枠線、各欄は 1px のインクの罫線で区切る。各欄の中に bold のラベル、その下に点線の記入線。別個の入力ボックスは使わない。
- チェックボックス: 22px の正方形、2px のインクの枠線。単一選択でもオプションでも同じもの。チェックは線を引いたバツ印で、枠より少し大きく描く。
- 数量ステッパー: 数字の両側に、インクの枠線の正方形のキーを2つ。
- 領収の行: 項目名、文字グリッドに合わせたドットのリーダー、右端の金額、合計の上の二重線。
- ボタン: インクの単色、角は直角、bold、高さ 44px 以上。ページ全体で2つだけ。
- リンク: ティール、bold、2px の下線。
- 罫線: 縁は 2px のインク、フォーム内は 1px のインク、表の行間は不透明度 0.36 の 1px、紙が破れる箇所は点線。
- エラー: 入力欄の下に1行で、何を書くべきかを示す。先頭にラスト色のアスタリスク。
- 角は全体で直角。

MOTION:
- なし。合計は即座に切り替わる。フェード、スライド、バウンドは使わない。

FORBIDDEN:
- 第2の書体、またはサンセリフのページの装飾として使う等幅フォント 禁止
- カード、ピル型の要素、角丸 禁止
- すべての見出しの上に置く小さなラベル、全大文字で字間を空けたラベル、セクション番号 禁止
- 偽のターミナルのプロンプト、ASCII の枠、点滅するタイプライターのカーソル 禁止
- コーヒーの輪染み、破れた縁、テープ、ゴム印、セピアや黄ばんだ紙 禁止
- 写真とイラスト禁止。コマはグラデーションと粒状感だけで作る。
- ラストまたはティールを本来の役割以外に使うこと 禁止

OUTPUT:
1) CSS カスタムプロパティ
2) セマンティックな HTML と CSS
3) 320px まで対応し、横スクロールなし: 表は横に流れず、積み重なる
4) 見えるフォーカス、ラベル付きのフォーム項目、項目の横のエラー、読み上げられる合計`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

interface Order {
  rolls: number;
  format: FormatId;
  process: ProcessId;
  scan: ScanId;
  extras: Record<ExtraId, boolean>;
}

/** The stub's figures for one order, all in pence. */
function quote(order: Order) {
  const services: ServiceId[] = [order.process, order.scan, ...EXTRAS.filter((id) => order.extras[id])];
  const lines = services.map((id) => ({ id, price: PRICES[id][order.format] ?? 0 }));
  const perRoll = lines.reduce((sum, line) => sum + line.price, 0);
  const post = order.rolls >= FREE_POST_FROM ? 0 : RETURN_POST;
  const total = perRoll * order.rolls + post;
  return { lines, perRoll, post, total, vat: Math.round((total * VAT_RATE) / (100 + VAT_RATE)) };
}

type FieldError = 'missing' | 'invalid';

export function PortedFusionGrainMonoPage({ lang }: PortedStylePageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollsText, setRollsText] = useState(String(MIN_ROLLS));
  const [format, setFormat] = useState<FormatId>('f35');
  const [process, setProcess] = useState<ProcessId>('c41');
  const [scan, setScan] = useState<ScanId>('standard');
  const [extras, setExtras] = useState<Record<ExtraId, boolean>>({ push: false, prints: false });
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: FieldError; email?: FieldError }>({});
  const [sent, setSent] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const reopened = useRef(false);
  const t = (text: Tri) => text[lang];

  // The button and the confirmation replace each other on the stub. Focus follows
  // whichever one has just appeared, so it never falls back to the top of the page.
  useEffect(() => {
    if (sent) doneRef.current?.focus();
    else if (reopened.current) {
      reopened.current = false;
      submitRef.current?.focus();
    }
  }, [sent]);

  // The field may be empty while the customer is typing; the order then counts one roll.
  const rolls = rollsText === '' ? MIN_ROLLS : clampRolls(Number(rollsText));
  const bill = quote({ rolls, format, process, scan, extras });
  const offered = (id: ServiceId) => PRICES[id][format] !== null;
  // Under a tick: what the option means, or why it cannot be ticked for this format.
  const tickHint = (id: ServiceId) => {
    const hint = offered(id) ? SERVICES[id].hint : ENVELOPE.notOffered;
    return hint ? <small>{t(hint)}</small> : null;
  };

  const typeRolls = (value: string) => {
    const digits = value.replace(/\D/g, '');
    setRollsText(digits === '' ? '' : String(clampRolls(Number(digits))));
  };

  const stepRolls = (change: number) => setRollsText(String(clampRolls(rolls + change)));

  const handleRollsKey = (event: KeyboardEvent<HTMLInputElement>) => {
    const targets: Record<string, number | undefined> = { ArrowUp: rolls + 1, ArrowDown: rolls - 1, Home: MIN_ROLLS, End: MAX_ROLLS };
    const next = targets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setRollsText(String(clampRolls(next)));
  };

  // A format change can leave a choice the lab does not offer for it. The process
  // goes back to colour and the extra is unticked, so the order always has a price.
  const chooseFormat = (next: FormatId) => {
    setFormat(next);
    if (PRICES[process][next] === null) setProcess('c41');
    setExtras((current) => ({
      push: current.push && PRICES.push[next] !== null,
      prints: current.prints && PRICES.prints[next] !== null,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const address = email.trim();
    const found: { name?: FieldError; email?: FieldError } = {};
    if (name.trim() === '') found.name = 'missing';
    if (address === '') found.email = 'missing';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) found.email = 'invalid';
    setErrors(found);
    if (found.name) nameRef.current?.focus();
    else if (found.email) emailRef.current?.focus();
    else setSent(true);
  };

  const reopen = () => {
    reopened.current = true;
    setSent(false);
  };

  return (
    <FusionShell
      fusionId="fusion-grain-mono"
      lang={lang}
      tone="light"
      accent="#2e6f7d"
      prev={{ href: '/pages/fusion-cyber-console.html', label: 'Cyber × Console' }}
      next={{ href: '/pages/fusion-clay-aurora.html', label: 'Clay × Aurora' }}
      prompts={PROMPTS}
    >
      <div className="gm">
        <div className="gm-bar">
          <p className="gm-mark">{LAB.mark}</p>
          <nav className="gm-bar__nav" aria-label={t(NAV.label)}>
            <a href="#gm-prices">{t(NAV.prices)}</a>
            <a href="#gm-days">{t(NAV.days)}</a>
            <a href="#gm-post">{t(NAV.post)}</a>
            <a href="#gm-questions">{t(NAV.questions)}</a>
          </nav>
          <a className="gm-btn" href="#gm-envelope">{t(NAV.start)}</a>
        </div>

        <section className="gm-hero" aria-labelledby="gm-title">
          <h1 id="gm-title" className="gm-title">{t(HERO.title)}</h1>
          <div className="gm-hero__row">
            <p className="gm-lede">{t(HERO.lede)}</p>
            <p className="gm-start">
              {fill(t(HERO.from), { price: money(CHEAPEST_ROLL) })}{' '}
              <a className="gm-go" href="#gm-envelope">{t(HERO.link)}</a>
            </p>
          </div>
        </section>

        <figure>
          <div className="gm-strip" role="img" aria-label={t(SHEET.alt)}>
            {FRAMES.map((frame, index) => (
              <div key={frame.tone} className="gm-fr" style={{ '--gm-i': index + 1, '--gm-t': frame.tone } as CSSProperties}>
                <span className={['gm-fr__stock', ...frame.edge.map((length) => `gm-fr__stock--${length}`)].join(' ')}>
                  {frame.edge.length > 0 ? FILM_STOCK : null}
                </span>
                <i />
                <span className="gm-fr__no">{index + 1}</span>
              </div>
            ))}
          </div>
          <figcaption className="gm-sheet__caption">
            <p>{t(SHEET.caption)}</p>
            <p>{t(SHEET.remark)}</p>
          </figcaption>
        </figure>

        <section className="gm-section" id="gm-envelope" aria-labelledby="gm-envelope-title">
          <h2 id="gm-envelope-title" className="gm-h2">{t(ENVELOPE.title)}</h2>
          <p className="gm-note">{t(ENVELOPE.note)}</p>
          <form className="gm-env" onSubmit={handleSubmit} noValidate aria-labelledby="gm-envelope-title">
            <div className="gm-env__form">
              <div className="gm-env__head">
                <b>{t(ENVELOPE.head)}</b>
                <span>{fill(t(ENVELOPE.number), { no: ORDER_NO })}</span>
              </div>

              <div className="gm-fields">
                <div className="gm-field">
                  <label htmlFor="gm-name">{t(ENVELOPE.name)}<i className="gm-req" aria-hidden="true">*</i></label>
                  <input
                    id="gm-name"
                    ref={nameRef}
                    type="text"
                    autoComplete="name"
                    required
                    disabled={sent}
                    value={name}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? 'gm-name-error' : undefined}
                    onChange={(event) => { setName(event.target.value); setErrors((current) => ({ ...current, name: undefined })); }}
                  />
                  {errors.name ? (
                    <p className="gm-error" id="gm-name-error" role="alert">
                      <i className="gm-req" aria-hidden="true">*</i>{t(ENVELOPE.nameMissing)}
                    </p>
                  ) : null}
                </div>
                <div className="gm-field">
                  <label htmlFor="gm-email">{t(ENVELOPE.email)}<i className="gm-req" aria-hidden="true">*</i></label>
                  <input
                    id="gm-email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    required
                    disabled={sent}
                    value={email}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? 'gm-email-error' : undefined}
                    onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined })); }}
                  />
                  {errors.email ? (
                    <p className="gm-error" id="gm-email-error" role="alert">
                      <i className="gm-req" aria-hidden="true">*</i>{t(errors.email === 'missing' ? ENVELOPE.emailMissing : ENVELOPE.emailInvalid)}
                    </p>
                  ) : null}
                </div>
                <div className="gm-field">
                  <label htmlFor="gm-rolls">{t(ENVELOPE.rolls)}</label>
                  <div className="gm-rolls">
                    <button
                      type="button"
                      className="gm-rolls__key"
                      aria-label={t(ENVELOPE.fewer)}
                      aria-disabled={rolls <= MIN_ROLLS}
                      disabled={sent}
                      onClick={() => stepRolls(-1)}
                    >
                      −
                    </button>
                    <input
                      id="gm-rolls"
                      type="text"
                      inputMode="numeric"
                      role="spinbutton"
                      aria-valuemin={MIN_ROLLS}
                      aria-valuemax={MAX_ROLLS}
                      aria-valuenow={rolls}
                      autoComplete="off"
                      disabled={sent}
                      value={rollsText}
                      onChange={(event) => typeRolls(event.target.value)}
                      onKeyDown={handleRollsKey}
                      onBlur={() => setRollsText(String(rolls))}
                    />
                    <button
                      type="button"
                      className="gm-rolls__key"
                      aria-label={t(ENVELOPE.more)}
                      aria-disabled={rolls >= MAX_ROLLS}
                      disabled={sent}
                      onClick={() => stepRolls(1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="gm-ticks">
                <div className="gm-group" role="radiogroup" aria-labelledby="gm-format-label">
                  <p className="gm-group__label" id="gm-format-label">{t(ENVELOPE.format)} <span>{t(ENVELOPE.tickOne)}</span></p>
                  {FORMATS.map((item) => (
                    <label key={item.id} className="gm-tick">
                      <input type="radio" name="gm-format" value={item.id} checked={format === item.id} disabled={sent} onChange={() => chooseFormat(item.id)} />
                      <span>{t(item.name)}</span>
                    </label>
                  ))}
                </div>
                <div className="gm-group" role="radiogroup" aria-labelledby="gm-process-label">
                  <p className="gm-group__label" id="gm-process-label">{t(ENVELOPE.process)} <span>{t(ENVELOPE.tickOne)}</span></p>
                  {PROCESSES.map((id) => (
                    <label key={id} className={offered(id) ? 'gm-tick' : 'gm-tick is-off'}>
                      <input type="radio" name="gm-process" value={id} checked={process === id} disabled={sent || !offered(id)} onChange={() => setProcess(id)} />
                      <span>{t(SERVICES[id].option)}{tickHint(id)}</span>
                    </label>
                  ))}
                </div>
                <div className="gm-group" role="radiogroup" aria-labelledby="gm-scan-label">
                  <p className="gm-group__label" id="gm-scan-label">{t(ENVELOPE.scan)} <span>{t(ENVELOPE.tickOne)}</span></p>
                  {SCANS.map((id) => (
                    <label key={id} className="gm-tick">
                      <input type="radio" name="gm-scan" value={id} checked={scan === id} disabled={sent} onChange={() => setScan(id)} />
                      <span>{t(SERVICES[id].option)}{tickHint(id)}</span>
                    </label>
                  ))}
                </div>
                <div className="gm-group" role="group" aria-labelledby="gm-extras-label">
                  <p className="gm-group__label" id="gm-extras-label">{t(ENVELOPE.extras)} <span>{t(ENVELOPE.tickAny)}</span></p>
                  {EXTRAS.map((id) => (
                    <label key={id} className={offered(id) ? 'gm-tick' : 'gm-tick is-off'}>
                      <input
                        type="checkbox"
                        checked={extras[id]}
                        disabled={sent || !offered(id)}
                        onChange={(event) => setExtras((current) => ({ ...current, [id]: event.target.checked }))}
                      />
                      <span>{t(SERVICES[id].option)}{tickHint(id)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="gm-field gm-field--notes">
                <label htmlFor="gm-notes">{t(ENVELOPE.notes)}</label>
                <textarea id="gm-notes" rows={2} disabled={sent} placeholder={t(ENVELOPE.notesExample)} value={notes} onChange={(event) => setNotes(event.target.value)} />
              </div>

              <p className="gm-env__foot">
                <i className="gm-req" aria-hidden="true">*</i>{t(ENVELOPE.required)} {fill(t(ENVELOPE.limit), { max: MAX_ROLLS })}
              </p>
            </div>

            <div className="gm-stub" role="group" aria-label={fill(t(STUB.label), { no: ORDER_NO })}>
              <div className="gm-stub__lines">
                <p className="gm-stub__head">
                  {LAB.name}
                  <b>{fill(t(ENVELOPE.number), { no: ORDER_NO })}</b>
                  {t(STUB.note)}
                </p>
                <dl className="gm-rc">
                  {bill.lines.map((line) => (
                    <div key={line.id}><dt>{t(SERVICES[line.id].row)}</dt><dd>{pounds(line.price)}</dd></div>
                  ))}
                  <div><dt>{t(STUB.contact)}</dt><dd>{pounds(0)}</dd></div>
                  <div className="gm-rc__sum"><dt>{t(STUB.each)}</dt><dd>{pounds(bill.perRoll)}</dd></div>
                  <div><dt>{t(STUB.rolls)}</dt><dd>× {rolls}</dd></div>
                  <div><dt>{t(bill.post === 0 ? STUB.postFree : STUB.post)}</dt><dd>{pounds(bill.post)}</dd></div>
                </dl>
              </div>
              <div className="gm-pay">
                <p className="gm-total" aria-live="polite" aria-atomic="true"><span>{t(STUB.total)}</span><b>{money(bill.total)}</b></p>
                <p className="gm-vat">{fill(t(STUB.vat), { rate: VAT_RATE, amount: money(bill.vat) })}</p>
                {sent ? (
                  <div className="gm-done" ref={doneRef} tabIndex={-1} role="group" aria-labelledby="gm-done-title">
                    <p className="gm-done__title" id="gm-done-title">{fill(t(STUB.doneTitle), { no: ORDER_NO })}</p>
                    <p>{fill(t(STUB.doneHow), { no: ORDER_NO })}</p>
                    <address>{LAB.name}<br />{LAB.address[0]}<br />{LAB.address[1]}<br />{LAB.address[2]}</address>
                    <p>{t(STUB.donePay)}</p>
                    <button type="button" className="gm-go gm-done__change" onClick={reopen}>{t(STUB.change)}</button>
                  </div>
                ) : (
                  <>
                    <button className="gm-btn" type="submit" ref={submitRef}>{t(STUB.submit)}</button>
                    <p className="gm-pay__note">{t(STUB.payNote)}</p>
                  </>
                )}
              </div>
            </div>
          </form>
        </section>

        <section className="gm-section" id="gm-prices" aria-labelledby="gm-prices-title">
          <h2 id="gm-prices-title" className="gm-h2">{t(PRICE_LIST.title)}</h2>
          <p className="gm-note">{t(PRICE_LIST.note)}</p>
          <div className="gm-prices">
            <table className="gm-table" role="table" aria-labelledby="gm-prices-title">
              <thead role="rowgroup">
                <tr role="row">
                  <th role="columnheader" scope="col">{t(PRICE_LIST.service)}</th>
                  {FORMATS.map((item) => <th key={item.id} role="columnheader" scope="col">{t(item.name)}</th>)}
                </tr>
              </thead>
              <tbody role="rowgroup">
                {PRICE_GROUPS.flatMap((group, groupIndex) =>
                  group.map((id, index) => (
                    <tr key={id} role="row" className={groupIndex > 0 && index === 0 ? 'gm-table__kind' : undefined}>
                      <th role="rowheader" scope="row">{t(SERVICES[id].row)}</th>
                      {FORMATS.map((item) => {
                        const price = PRICES[id][item.id];
                        return (
                          <td key={item.id} role="cell" data-label={t(item.short)} className={price === null ? 'gm-na' : undefined}>
                            {price === null ? t(PRICE_LIST.notOffered) : money(price)}
                          </td>
                        );
                      })}
                    </tr>
                  )),
                )}
              </tbody>
            </table>
            <div className="gm-prices__aside">
              <p>{fill(t(PRICE_LIST.post), { post: money(RETURN_POST), count: FREE_POST_FROM })}</p>
              <p>{fill(t(PRICE_LIST.example), { sum: EXAMPLE_SUM })}</p>
              <a className="gm-go" href="#gm-envelope">{t(PRICE_LIST.link)}</a>
            </div>
          </div>
        </section>

        <section className="gm-section" id="gm-days" aria-labelledby="gm-days-title">
          <h2 id="gm-days-title" className="gm-h2">{t(DAYS.title)}</h2>
          <p className="gm-note">{t(DAYS.note)}</p>
          <ol className="gm-days">
            {DAYS.steps.map((step, index) => (
              <li key={step.name.en}>
                <p className="gm-when"><b>{fill(t(DAYS.day), { n: index + 1 })}</b><span>{t(step.weekday)}</span></p>
                <h3 className="gm-h3">{t(step.name)}</h3>
                <p>{t(step.body)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="gm-section" id="gm-post" aria-labelledby="gm-post-title">
          <h2 id="gm-post-title" className="gm-h2">{t(POST.title)}</h2>
          <p className="gm-note">{t(POST.note)}</p>
          <div className="gm-post">
            <div className="gm-label">
              <p className="gm-label__from">
                {t(POST.from)} {name.trim() || t(POST.fromBlank)}
                <br />
                {fill(t(POST.order), { no: ORDER_NO })}
              </p>
              <i className="gm-stamp" aria-hidden="true">{t(POST.stamp)}</i>
              <address>{LAB.name}<br />{LAB.address[0]}<br />{LAB.address[1]}<br />{LAB.address[2]}</address>
            </div>
            <div className="gm-post__how">
              <h3 className="gm-h3">{t(POST.parcelTitle)}</h3>
              <ul className="gm-parcel">
                {POST.parcel.map((item) => <li key={item.en}>{t(item)}</li>)}
              </ul>
              <p>{t(POST.counter)}</p>
            </div>
          </div>
        </section>

        <section className="gm-section" id="gm-questions" aria-labelledby="gm-questions-title">
          <h2 id="gm-questions-title" className="gm-h2">{t(QUESTIONS.title)}</h2>
          <dl className="gm-qa">
            {QUESTIONS.rows.map(([question, answer]) => (
              <div key={question.en}><dt>{t(question)}</dt><dd>{t(answer)}</dd></div>
            ))}
          </dl>
        </section>

        <footer className="gm-footer">
          <span>{[LAB.name, ...LAB.address].join(', ')}</span>
          <span>{t(FOOTER.counter)}</span>
        </footer>
      </div>
    </FusionShell>
  );
}
