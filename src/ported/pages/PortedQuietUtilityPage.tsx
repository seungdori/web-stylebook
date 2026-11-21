import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import { Alert } from '../../kit/alert/alert';
import { Button } from '../../kit/button/button';
import { EmptyState } from '../../kit/empty-state/empty-state';
import { SearchField } from '../../kit/search-field/search-field';
import { SegmentedControl } from '../../kit/segmented-control/segmented-control';
import { StatusBadge, type StatusTone } from '../../kit/status-badge/status-badge';
import { TextArea } from '../../kit/text-field/text-field';
import './PortedQuietUtilityPage.css';

// The page is one screen of Ledgerline, an invoice-approval tool, as the finance lead of
// Fernhill Cycles sees it on a Friday morning: the approval queue grouped by who has to act,
// with the chosen invoice open beside it. Quiet Utility is the base of the site's component
// kit, so the parts that exist in the kit are the kit's own React components (segmented
// control, search field, button, status badge, empty state, text area); the rest comes from
// the work itself: the month's money as a stacked bar, the three-way match, the line items
// with the one line that differs from the order, and the approval trail as a real sequence.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;
type Who = 'maya' | 'dev' | 'lena' | 'jonas';
type Stage = 'you' | 'others' | 'run' | 'disputed';
type View = 'mine' | 'team';
type IconName = 'check' | 'x' | 'flag' | 'file' | 'plus' | 'down' | 'up' | 'alert' | 'search';
type FocusTarget = 'heading' | 'outcome' | 'approve' | 'dispute' | 'reason' | 'search' | 'addDue' | 'removeDue';

const LOCALE: Record<Lang, string> = { en: 'en-GB', ko: 'ko-KR', ja: 'ja-JP' };
const ORG = 'Fernhill Cycles';
const USER = { name: 'Maya Okafor', initials: 'MO' };
const INBOX = 'invoices@fernhillcycles.co.uk';
// The scene is fixed in time: Friday 20 November 2026, mid-morning.
const TODAY = '2026-11-20';
const NOW = '2026-11-20T10:42';
const RUN_DAY = '2026-11-26';
const DUE_LIMIT = '2026-11-30';
const MONTH_COUNT = 38;
const PAID_PENCE = 7938407;

const GBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
const COUNT = new Intl.NumberFormat('en-GB');
const money = (pence: number) => GBP.format(pence / 100);
const pence = (pounds: number) => Math.round(pounds * 100);

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

// Puts nodes into a sentence at its {key} places, so a figure can carry its own weight.
function compose(text: string, nodes: Record<string, ReactNode>): ReactNode[] {
  return text.split(/(\{\w+\})/g).map((part, index) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    return key && key in nodes ? <Fragment key={index}>{nodes[key]}</Fragment> : part;
  });
}

function toDate(iso: string) {
  const [day, time = '00:00'] = iso.split('T');
  const [y, m, d] = day.split('-').map(Number);
  const [h, min] = time.split(':').map(Number);
  return new Date(Date.UTC(y, m - 1, d, h, min));
}

const formatDate = (iso: string, lang: Lang, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(LOCALE[lang], { timeZone: 'UTC', ...options }).format(toDate(iso));

/** Whole days from one date to another; the time of day is ignored. */
const daysBetween = (from: string, to: string) => Math.round((toDate(to.slice(0, 10)).getTime() - toDate(from.slice(0, 10)).getTime()) / 86400000);

const PEOPLE: Record<Who, { name: string; first: string; role: Tri }> = {
  maya: { name: 'Maya Okafor', first: 'Maya', role: { en: 'finance lead', ko: '재무 책임자', ja: '財務責任者' } },
  dev: { name: 'Dev Mistry', first: 'Dev', role: { en: 'production lead', ko: '생산 책임자', ja: '生産責任者' } },
  lena: { name: 'Lena Hart', first: 'Lena', role: { en: 'operations manager', ko: '운영 매니저', ja: '運営マネージャー' } },
  jonas: { name: 'Jonas Byrne', first: 'Jonas', role: { en: 'office manager', ko: '총무 매니저', ja: '総務マネージャー' } },
};

interface Line {
  item: Tri;
  qty: number;
  /** Unit price in pounds, as the invoice states it. */
  unit: number;
  /** The unit price on the order, when the invoice differs from it. */
  was?: number;
  /** How many were received, when fewer than were billed. */
  got?: number;
}

interface Cell {
  label: Tri;
  /** Pounds, or words. */
  value: number | Tri;
  note: Tri;
  /** A difference: 'over' stays inside the tolerance, 'short' does not. */
  flag?: 'over' | 'short';
}

interface Invoice {
  key: string;
  supplier: string;
  ref: string;
  email: string;
  pages: number;
  dated: string;
  received: string;
  due: string;
  centre: Tri;
  terms: Tri;
  account: string;
  since: Tri;
  po?: { ref: string; by: Who; on: string };
  /** Why there is no purchase order. */
  noPo?: Tri;
  check: { title: Tri; cells: [Cell, Cell, Cell] };
  /** The second step of the trail: what the invoice was checked against. */
  checked: { title: Tri; body: Tri };
  lines: Line[];
  vat: number;
  approvals: Array<{ by: Who; at: string; note?: Tri }>;
  stage: 'you' | 'others' | 'run';
  /** Needs, or needed, the finance lead. */
  mine: boolean;
  /** Who has it now, for invoices waiting on others. */
  holder?: Who;
  /** Why it is at its current step, or why it needed the finance lead. */
  reason?: Tri;
  /** When the current step began. */
  waiting?: string;
}

const MATCH = {
  three: { en: 'Three-way match', ko: '3방향 대조', ja: '3者照合' },
  ordered: { en: 'Ordered', ko: '발주', ja: '発注' },
  received: { en: 'Received', ko: '입고', ja: '入荷' },
  invoiced: { en: 'Invoiced', ko: '청구', ja: '請求' },
  same: { en: 'the same as the order', ko: '주문과 동일', ja: '注文と同額' },
  sameBody: { en: 'The same as the order and the delivery.', ko: '주문 및 납품 내역과 같습니다.', ja: '注文および納品内容と同じです。' },
} satisfies Record<string, Tri>;

const INVOICES: Invoice[] = [
  {
    key: 'kettering',
    supplier: 'Kettering Tube Works',
    ref: 'INV-20418',
    email: 'accounts@ketteringtube.co.uk',
    pages: 2,
    dated: '2026-11-12',
    received: '2026-11-13T09:12',
    due: '2026-11-27',
    centre: { en: 'Frames production', ko: '프레임 생산', ja: 'フレーム製造' },
    terms: { en: '14 days from receipt', ko: '수령 후 14일', ja: '受領から14日' },
    account: '4471',
    since: { en: 'March 2024', ko: '2024년 3월', ja: '2024年3月' },
    po: { ref: 'PO-3311', by: 'dev', on: '2026-11-02' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 15320, note: { en: 'net on PO-3311, 2 Nov', ko: 'PO-3311 기준 세전, 11월 2일', ja: 'PO-3311の税抜、11月2日' } },
        { label: MATCH.received, value: { en: '3 of 3 items', ko: '3개 중 3개 품목', ja: '3品中3品' }, note: { en: 'GRN-0907, booked in 11 Nov', ko: 'GRN-0907, 11월 11일 입고 등록', ja: 'GRN-0907、11月11日に計上' } },
        {
          label: MATCH.invoiced,
          value: 15350,
          note: { en: '£30.00 over the order, inside the £50 tolerance', ko: '주문보다 £30.00 많음, £50 허용 범위 안', ja: '注文より £30.00 多い、£50 の許容範囲内' },
          flag: 'over',
        },
      ],
    },
    checked: {
      title: { en: 'Matched to PO-3311 and GRN-0907', ko: 'PO-3311 및 GRN-0907과 대조함', ja: 'PO-3311 と GRN-0907 に照合済み' },
      body: { en: 'Delivery is £30.00 over the order, inside the £50 tolerance.', ko: '납품액은 주문보다 £30.00 많으며 £50 허용 범위 안입니다.', ja: '納品額は注文より £30.00 多く、£50 の許容範囲内です。' },
    },
    lines: [
      { item: { en: '4130 tube set, 54–58 cm', ko: '4130 튜브 세트, 54–58 cm', ja: '4130 チューブセット、54–58 cm' }, qty: 40, unit: 312 },
      { item: { en: 'Chainstays, 22.2 mm, pairs', ko: '체인스테이, 22.2 mm, 쌍', ja: 'チェーンステー、22.2 mm、組' }, qty: 80, unit: 24.5 },
      { item: { en: 'Seat stays, 16 mm, pairs', ko: '시트스테이, 16 mm, 쌍', ja: 'シートステー、16 mm、組' }, qty: 80, unit: 9.5 },
      { item: { en: 'Pallet delivery to Sheffield', ko: '셰필드 팔레트 배송', ja: 'シェフィールド向けパレット配送' }, qty: 1, unit: 150, was: 120 },
    ],
    vat: 0.2,
    approvals: [
      {
        by: 'dev',
        at: '2026-11-16T16:40',
        note: {
          en: 'All 40 tube sets checked on arrival. The pallet rate went up in November, so the extra £30 is right.',
          ko: '입고 시 튜브 세트 40개를 모두 확인했습니다. 11월에 팔레트 요금이 올라서 추가 £30은 맞습니다.',
          ja: '入荷時にチューブセット40個をすべて確認しました。11月にパレット料金が上がったため、追加の £30 は妥当です。',
        },
      },
    ],
    stage: 'you',
    mine: true,
    reason: { en: 'Invoices over £10,000 need the finance lead after the budget owner.', ko: '£10,000을 넘는 인보이스는 예산 책임자 다음에 재무 책임자 승인이 필요합니다.', ja: '£10,000 を超える請求書は、予算責任者の後に財務責任者の承認が必要です。' },
    waiting: '2026-11-16T16:40',
  },
  {
    key: 'velotread',
    supplier: 'Velotread Tyres UK',
    ref: 'VT-5530-118',
    email: 'ledger@velotread.co.uk',
    pages: 1,
    dated: '2026-11-10',
    received: '2026-11-10T14:03',
    due: '2026-11-25',
    centre: { en: 'Wheel building', ko: '휠 조립', ja: 'ホイール組み' },
    terms: { en: '15 days from invoice', ko: '인보이스 날짜 후 15일', ja: '請求書日付から15日' },
    account: '0932',
    since: { en: 'January 2025', ko: '2025년 1월', ja: '2025年1月' },
    po: { ref: 'PO-3296', by: 'dev', on: '2026-10-28' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 5260.5, note: { en: 'net on PO-3296, 28 Oct', ko: 'PO-3296 기준 세전, 10월 28일', ja: 'PO-3296の税抜、10月28日' } },
        {
          label: MATCH.received,
          value: { en: '140 of 150 tyres', ko: '타이어 150개 중 140개', ja: 'タイヤ150本中140本' },
          note: { en: 'GRN-0899, booked in 9 Nov', ko: 'GRN-0899, 11월 9일 입고 등록', ja: 'GRN-0899、11月9日に計上' },
          flag: 'short',
        },
        {
          label: MATCH.invoiced,
          value: 5260.5,
          note: { en: '£284.00 more than was received', ko: '입고분보다 £284.00 많음', ja: '受領分より £284.00 多い' },
          flag: 'short',
        },
      ],
    },
    checked: {
      title: { en: 'Matched to PO-3296 and GRN-0899', ko: 'PO-3296 및 GRN-0899과 대조함', ja: 'PO-3296 と GRN-0899 に照合済み' },
      body: {
        en: '10 tyres are missing from GRN-0899, so it bills £284.00 more than was received.',
        ko: 'GRN-0899에서 타이어 10개가 빠져 있어, 입고분보다 £284.00 많이 청구되었습니다.',
        ja: 'GRN-0899ではタイヤ10本が不足しており、受領分より £284.00 多く請求されています。',
      },
    },
    lines: [
      { item: { en: 'Gravel tyres, 700 × 40c', ko: '그래블 타이어, 700 × 40c', ja: 'グラベルタイヤ、700 × 40c' }, qty: 150, unit: 28.4, got: 140 },
      { item: { en: 'Inner tubes, 700c Presta', ko: '내부 튜브, 700c 프레스타', ja: 'チューブ、700c プレスタ' }, qty: 250, unit: 3.8 },
      { item: { en: 'Carriage', ko: '운송비', ja: '運賃' }, qty: 1, unit: 50.5 },
    ],
    vat: 0.2,
    approvals: [],
    stage: 'you',
    mine: true,
    reason: {
      en: 'A difference over the £50 tolerance comes to the finance lead before the budget owner.',
      ko: '£50 허용 범위를 넘는 차이는 예산 책임자보다 먼저 재무 책임자에게 갑니다.',
      ja: '£50 の許容範囲を超える差異は、予算責任者より先に財務責任者に回ります。',
    },
    waiting: '2026-11-10T14:03',
  },
  {
    key: 'brightline',
    supplier: 'Brightline Freight',
    ref: 'BF-077210',
    email: 'accounts@brightlinefreight.co.uk',
    pages: 3,
    dated: '2026-11-09',
    received: '2026-11-09T11:47',
    due: '2026-11-23',
    centre: { en: 'Inbound freight', ko: '입고 운송', ja: '入荷輸送' },
    terms: { en: '14 days from invoice', ko: '인보이스 날짜 후 14일', ja: '請求書日付から14日' },
    account: '6620',
    since: { en: 'June 2023', ko: '2023년 6월', ja: '2023年6月' },
    noPo: { en: 'Freight is billed per job, against a quote.', ko: '운송비는 견적을 기준으로 건별 청구됩니다.', ja: '運送料は見積もりに基づき案件ごとに請求されます。' },
    check: {
      title: { en: 'Checked against the quote', ko: '견적과 대조함', ja: '見積もりと照合' },
      cells: [
        { label: { en: 'Quoted', ko: '견적가', ja: '見積額' }, value: 1820.3, note: { en: 'net on BQ-1180, 30 Oct', ko: 'BQ-1180 기준 세전, 10월 30일', ja: 'BQ-1180の税抜、10月30日' } },
        {
          label: { en: 'Delivered', ko: '배송 완료', ja: '配送済み' },
          value: { en: '2 containers', ko: '컨테이너 2개', ja: 'コンテナ2個' },
          note: { en: 'signed for on 6 and 9 Nov', ko: '11월 6일과 9일 수령 서명', ja: '11月6日と9日に受領サイン' },
        },
        { label: MATCH.invoiced, value: 1820.3, note: { en: 'the same as the quote', ko: '견적과 동일', ja: '見積もりと同額' } },
      ],
    },
    checked: {
      title: { en: 'Checked against quote BQ-1180', ko: 'BQ-1180 견적과 대조함', ja: 'BQ-1180 の見積もりと照合' },
      body: { en: 'Both containers were signed for, and it bills the quoted amount.', ko: '컨테이너 2개 모두 수령 서명이 있었고, 견적 금액대로 청구되었습니다.', ja: 'コンテナ2個とも受領サインがあり、見積額どおりに請求されています。' },
    },
    lines: [
      { item: { en: 'Container haulage, Felixstowe to Sheffield', ko: '컨테이너 운송, 펠릭스토우에서 셰필드까지', ja: 'コンテナ輸送、フェリクストウからシェフィールドまで' }, qty: 2, unit: 845 },
      { item: { en: 'Port handling and customs entry', ko: '항만 하역 및 통관', ja: '港湾荷役・通関手続き' }, qty: 1, unit: 130.3 },
    ],
    vat: 0.2,
    approvals: [],
    stage: 'you',
    mine: true,
    reason: { en: 'You hold the budget for inbound freight.', ko: '입고 운송 예산은 본인이 담당합니다.', ja: '入荷輸送の予算はあなたが担当しています。' },
    waiting: '2026-11-09T11:47',
  },
  {
    key: 'hartley',
    supplier: 'Hartley & Webb',
    ref: 'HW-26-0412',
    email: 'billing@hartleywebb.co.uk',
    pages: 1,
    dated: '2026-11-18',
    received: '2026-11-18T08:30',
    due: '2026-12-02',
    centre: { en: 'Finance and admin', ko: '재무·총무', ja: '財務・総務' },
    terms: { en: '14 days from invoice', ko: '인보이스 날짜 후 14일', ja: '請求書日付から14日' },
    account: '2207',
    since: { en: 'April 2022', ko: '2022년 4월', ja: '2022年4月' },
    noPo: { en: 'Billed under the engagement letter.', ko: '업무 계약서에 따라 청구됩니다.', ja: '業務委託契約書に基づいて請求されています。' },
    check: {
      title: { en: 'Checked against the engagement letter', ko: '업무 계약서와 대조함', ja: '業務委託契約書と照合' },
      cells: [
        { label: { en: 'Agreed fee', ko: '합의 금액', ja: '合意額' }, value: 4750, note: { en: 'for the 2026 audit, billed in two halves', ko: '2026년 감사 보수, 두 번에 나누어 청구', ja: '2026年監査報酬、2回に分けて請求' } },
        { label: { en: 'Billed before', ko: '이전 청구액', ja: '前回までの請求額' }, value: 2375, note: { en: 'HW-26-0219, paid 14 Aug', ko: 'HW-26-0219, 8월 14일 지급', ja: 'HW-26-0219、8月14日支払い済み' } },
        { label: MATCH.invoiced, value: 2375, note: { en: 'the second half, as agreed', ko: '합의에 따른 후반분', ja: '合意どおりの後半分' } },
      ],
    },
    checked: {
      title: { en: 'Checked against the engagement letter', ko: '업무 계약서와 대조함', ja: '業務委託契約書と照合' },
      body: { en: 'The second of two equal bills for the 2026 audit.', ko: '2026년 감사 보수를 똑같이 나눈 두 청구 중 두 번째입니다.', ja: '2026年監査報酬を等分した2回分の請求のうち2回目です。' },
    },
    lines: [{ item: { en: 'Audit fee for 2026, second half', ko: '2026년 감사 보수, 후반분', ja: '2026年監査報酬、後半分' }, qty: 1, unit: 2375 }],
    vat: 0.2,
    approvals: [],
    stage: 'you',
    mine: true,
    reason: { en: 'You hold the budget for finance and admin.', ko: '재무·총무 예산은 본인이 담당합니다.', ja: '財務・総務の予算はあなたが担当しています。' },
    waiting: '2026-11-18T08:30',
  },
  {
    key: 'palletline',
    supplier: 'Pallet-Line North',
    ref: 'PLN-3307',
    email: 'accounts@pallet-line-north.co.uk',
    pages: 2,
    dated: '2026-11-04',
    received: '2026-11-04T10:15',
    due: '2026-11-18',
    centre: { en: 'Outbound deliveries', ko: '출고 배송', ja: '出荷配送' },
    terms: { en: '14 days from invoice', ko: '인보이스 날짜 후 14일', ja: '請求書日付から14日' },
    account: '5518',
    since: { en: 'May 2024', ko: '2024년 5월', ja: '2024年5月' },
    noPo: { en: 'Billed against the rate card.', ko: '요금표에 따라 청구됩니다.', ja: '料金表に基づいて請求されています。' },
    check: {
      title: { en: 'Checked against the rate card', ko: '요금표와 대조함', ja: '料金表と照合' },
      cells: [
        { label: { en: 'Rate', ko: '단가', ja: '単価' }, value: 44.5, note: { en: 'a pallet, on the 2026 rate card', ko: '팔레트 1개, 2026년 요금표 기준', ja: 'パレット1枚、2026年料金表による' } },
        { label: { en: 'Sent', ko: '발송', ja: '発送数' }, value: { en: '12 pallets', ko: '팔레트 12개', ja: 'パレット12枚' }, note: { en: 'in the October dispatch log', ko: '10월 출고 기록 기준', ja: '10月の出荷記録による' } },
        { label: MATCH.invoiced, value: 534, note: { en: '12 pallets at the card rate', ko: '요금표 단가로 팔레트 12개', ja: '料金表の単価でパレット12枚分' } },
      ],
    },
    checked: {
      title: { en: 'Checked against the rate card', ko: '요금표와 대조함', ja: '料金表と照合' },
      body: { en: '12 pallets in the October dispatch log, at £44.50 each.', ko: '10월 출고 기록의 팔레트 12개, 개당 £44.50입니다.', ja: '10月の出荷記録にあるパレット12枚、1枚あたり £44.50 です。' },
    },
    lines: [{ item: { en: 'Pallet deliveries in October', ko: '10월 팔레트 배송', ja: '10月のパレット配送' }, qty: 12, unit: 44.5 }],
    vat: 0.2,
    approvals: [],
    stage: 'others',
    mine: false,
    holder: 'lena',
    reason: { en: 'Lena approves outbound delivery invoices as budget owner.', ko: 'Lena 님은 예산 책임자로서 출고 배송 인보이스를 승인합니다.', ja: 'Lenaは予算責任者として出荷配送の請求書を承認します。' },
    waiting: '2026-11-04T10:15',
  },
  {
    key: 'northbank',
    supplier: 'Northbank Properties',
    ref: 'NB-1225',
    email: 'rent@northbankproperties.co.uk',
    pages: 1,
    dated: '2026-11-16',
    received: '2026-11-16T07:58',
    due: '2026-11-30',
    centre: { en: 'Premises', ko: '사업장 관리', ja: '施設管理' },
    terms: { en: 'Due on the last day of the month', ko: '매월 말일 마감', ja: '毎月末日期限' },
    account: '3090',
    since: { en: 'October 2021', ko: '2021년 10월', ja: '2021年10月' },
    noPo: { en: 'Billed under the lease.', ko: '임대차 계약에 따라 청구됩니다.', ja: '賃貸借契約に基づいて請求されています。' },
    check: {
      title: { en: 'Checked against the lease', ko: '임대차 계약과 대조함', ja: '賃貸借契約と照合' },
      cells: [
        { label: { en: 'Lease', ko: '임대료', ja: '賃料' }, value: 8125, note: { en: 'a month for Unit 4, Attercliffe Works', ko: 'Attercliffe Works 4호실 월 임대료', ja: 'Attercliffe Works 4号室の月額' } },
        { label: { en: 'Last month', ko: '지난달', ja: '先月' }, value: 8125, note: { en: 'NB-1198, paid 30 Oct', ko: 'NB-1198, 10월 30일 지급', ja: 'NB-1198、10月30日支払い済み' } },
        { label: MATCH.invoiced, value: 8125, note: { en: 'the same as the lease', ko: '임대차 계약과 동일', ja: '賃貸借契約と同額' } },
      ],
    },
    checked: {
      title: { en: 'Checked against the lease', ko: '임대차 계약과 대조함', ja: '賃貸借契約と照合' },
      body: { en: 'December rent for Unit 4, the same as every month this year.', ko: '4호실 12월 임대료로, 올해 매달 금액과 같습니다.', ja: '4号室の12月分の賃料で、今年の毎月と同額です。' },
    },
    lines: [{ item: { en: 'Rent for Unit 4, Attercliffe Works, December', ko: 'Attercliffe Works 4호실 12월 임대료', ja: 'Attercliffe Works 4号室 12月分賃料' }, qty: 1, unit: 8125 }],
    vat: 0.2,
    approvals: [],
    stage: 'others',
    mine: false,
    holder: 'lena',
    reason: { en: 'Lena approves premises invoices as budget owner.', ko: 'Lena 님은 예산 책임자로서 사업장 관리 인보이스를 승인합니다.', ja: 'Lenaは予算責任者として施設管理の請求書を承認します。' },
    waiting: '2026-11-16T07:58',
  },
  {
    key: 'calder',
    supplier: 'Calder Hub Co.',
    ref: 'CH-40981',
    email: 'accounts@calderhub.co.uk',
    pages: 2,
    dated: '2026-11-11',
    received: '2026-11-12T13:20',
    due: '2026-11-26',
    centre: { en: 'Wheel building', ko: '휠 조립', ja: 'ホイール組み' },
    terms: { en: '14 days from receipt', ko: '수령 후 14일', ja: '受領から14日' },
    account: '7745',
    since: { en: 'August 2023', ko: '2023년 8월', ja: '2023年8月' },
    po: { ref: 'PO-3302', by: 'dev', on: '2026-10-30' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 4055, note: { en: 'net on PO-3302, 30 Oct', ko: 'PO-3302 기준 세전, 10월 30일', ja: 'PO-3302の税抜、10月30日' } },
        { label: MATCH.received, value: { en: '2 of 2 items', ko: '2개 중 2개 품목', ja: '2点中2点' }, note: { en: 'GRN-0903, booked in 11 Nov', ko: 'GRN-0903, 11월 11일 입고 등록', ja: 'GRN-0903、11月11日に計上' } },
        { label: MATCH.invoiced, value: 4055, note: MATCH.same },
      ],
    },
    checked: { title: { en: 'Matched to PO-3302 and GRN-0903', ko: 'PO-3302 및 GRN-0903과 대조함', ja: 'PO-3302 と GRN-0903 に照合済み' }, body: MATCH.sameBody },
    lines: [
      { item: { en: 'Rear hubs, 142 × 12 mm', ko: '리어 허브, 142 × 12 mm', ja: 'リアハブ、142 × 12 mm' }, qty: 60, unit: 48.5 },
      { item: { en: 'Front hubs, 100 × 12 mm', ko: '프런트 허브, 100 × 12 mm', ja: 'フロントハブ、100 × 12 mm' }, qty: 50, unit: 22.9 },
    ],
    vat: 0.2,
    approvals: [],
    stage: 'others',
    mine: false,
    holder: 'dev',
    reason: { en: 'Dev approves wheel building invoices as budget owner.', ko: 'Dev 님은 예산 책임자로서 휠 조립 인보이스를 승인합니다.', ja: 'Devは予算責任者としてホイール組みの請求書を承認します。' },
    waiting: '2026-11-12T13:20',
  },
  {
    key: 'hallam',
    supplier: 'Hallam Powder Coating',
    ref: 'HPC-2291',
    email: 'office@hallampowder.co.uk',
    pages: 1,
    dated: '2026-11-13',
    received: '2026-11-13T15:41',
    due: '2026-11-27',
    centre: { en: 'Frames production', ko: '프레임 생산', ja: 'フレーム製造' },
    terms: { en: '14 days from invoice', ko: '인보이스 날짜 후 14일', ja: '請求書日付から14日' },
    account: '1186',
    since: { en: 'February 2025', ko: '2025년 2월', ja: '2025年2月' },
    po: { ref: 'PO-3305', by: 'dev', on: '2026-11-03' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 2700, note: { en: 'net on PO-3305, 3 Nov', ko: 'PO-3305 기준 세전, 11월 3일', ja: 'PO-3305の税抜、11月3日' } },
        { label: MATCH.received, value: { en: '45 of 45 frames', ko: '프레임 45개 중 45개', ja: 'フレーム45本中45本' }, note: { en: 'GRN-0905, booked in 12 Nov', ko: 'GRN-0905, 11월 12일 입고 등록', ja: 'GRN-0905、11月12日に計上' } },
        { label: MATCH.invoiced, value: 2700, note: MATCH.same },
      ],
    },
    checked: { title: { en: 'Matched to PO-3305 and GRN-0905', ko: 'PO-3305 및 GRN-0905과 대조함', ja: 'PO-3305 と GRN-0905 に照合済み' }, body: MATCH.sameBody },
    lines: [
      { item: { en: 'Frame coating, gloss black', ko: '프레임 도장, 광택 블랙', ja: 'フレーム塗装、グロスブラック' }, qty: 45, unit: 54 },
      { item: { en: 'Fork coating, gloss black', ko: '포크 도장, 광택 블랙', ja: 'フォーク塗装、グロスブラック' }, qty: 45, unit: 6 },
    ],
    vat: 0.2,
    approvals: [],
    stage: 'others',
    mine: false,
    holder: 'dev',
    reason: { en: 'Dev approves frames production invoices as budget owner.', ko: 'Dev 님은 예산 책임자로서 프레임 생산 인보이스를 승인합니다.', ja: 'Devは予算責任者としてフレーム製造の請求書を承認します。' },
    waiting: '2026-11-13T15:41',
  },
  {
    key: 'pennine',
    supplier: 'Pennine Water',
    ref: '88213407',
    email: 'business@penninewater.co.uk',
    pages: 2,
    dated: '2026-11-06',
    received: '2026-11-07T06:02',
    due: '2026-11-24',
    centre: { en: 'Utilities', ko: '공과금', ja: '光熱水費' },
    terms: { en: 'Pay by the date on the bill', ko: '청구서에 적힌 날짜까지 납부', ja: '請求書記載の期日までに支払い' },
    account: '0415',
    since: { en: 'October 2021', ko: '2021년 10월', ja: '2021年10月' },
    noPo: { en: 'A quarterly bill for the works.', ko: '사업장의 분기 청구서입니다.', ja: '工場の四半期請求書です。' },
    check: {
      title: { en: 'Checked against the last bill', ko: '지난 청구서와 대조함', ja: '前回の請求書と照合' },
      cells: [
        { label: { en: 'Used', ko: '사용량', ja: '使用量' }, value: { en: '58 m³', ko: '58 m³', ja: '58 m³' }, note: { en: 'meter read on 31 Oct', ko: '10월 31일 검침', ja: '10月31日の検針' } },
        { label: { en: 'Last quarter', ko: '지난 분기', ja: '前四半期' }, value: 398.4, note: { en: '88207714, paid 26 Aug', ko: '88207714, 8월 26일 지급', ja: '88207714、8月26日支払い済み' } },
        { label: MATCH.invoiced, value: 412.18, note: { en: '£13.78 more, for 2 m³ more water', ko: '£13.78 많음, 물 사용량 2 m³ 증가', ja: '£13.78 増、水道使用量 2 m³ 増加' } },
      ],
    },
    checked: {
      title: { en: 'Checked against the last bill', ko: '지난 청구서와 대조함', ja: '前回の請求書と照合' },
      body: { en: '58 m³ this quarter against 56 m³ last quarter.', ko: '이번 분기 58 m³, 지난 분기 56 m³입니다.', ja: '今四半期は58 m³、前四半期は56 m³です。' },
    },
    lines: [{ item: { en: 'Water and sewerage, 1 Aug to 31 Oct', ko: '상수도 및 하수도, 8월 1일~10월 31일', ja: '上水道・下水道、8月1日～10月31日' }, qty: 1, unit: 412.18 }],
    vat: 0,
    approvals: [],
    stage: 'others',
    mine: false,
    holder: 'jonas',
    reason: { en: 'Jonas approves utility bills as budget owner.', ko: 'Jonas 님은 예산 책임자로서 공과금 청구서를 승인합니다.', ja: 'Jonasは予算責任者として光熱水費の請求書を承認します。' },
    waiting: '2026-11-07T06:02',
  },
  {
    key: 'ashby',
    supplier: 'Ashby Gauges',
    ref: 'AG-7781',
    email: 'sales@ashbygauges.co.uk',
    pages: 1,
    dated: '2026-11-19',
    received: '2026-11-19T12:10',
    due: '2026-12-03',
    centre: { en: 'Quality', ko: '품질 관리', ja: '品質管理' },
    terms: { en: '14 days from receipt', ko: '수령 후 14일', ja: '受領から14日' },
    account: '2964',
    since: { en: 'July 2024', ko: '2024년 7월', ja: '2024年7月' },
    po: { ref: 'PO-3314', by: 'dev', on: '2026-11-05' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 777, note: { en: 'net on PO-3314, 5 Nov', ko: 'PO-3314 기준 세전, 11월 5일', ja: 'PO-3314の税抜、11月5日' } },
        { label: MATCH.received, value: { en: '6 of 6 gauges', ko: '게이지 6개 중 6개', ja: 'ゲージ6個中6個' }, note: { en: 'GRN-0911, booked in 18 Nov', ko: 'GRN-0911, 11월 18일 입고 등록', ja: 'GRN-0911、11月18日に計上' } },
        { label: MATCH.invoiced, value: 777, note: MATCH.same },
      ],
    },
    checked: { title: { en: 'Matched to PO-3314 and GRN-0911', ko: 'PO-3314 및 GRN-0911과 대조함', ja: 'PO-3314 と GRN-0911 に照合済み' }, body: MATCH.sameBody },
    lines: [
      { item: { en: 'Thread gauges, M5 × 0.8', ko: '나사 게이지, M5 × 0.8', ja: 'ねじゲージ、M5 × 0.8' }, qty: 6, unit: 42.5 },
      { item: { en: 'Alignment table service', ko: '정렬 테이블 정기 점검', ja: 'アライメント台の定期点検' }, qty: 1, unit: 522 },
    ],
    vat: 0.2,
    approvals: [],
    stage: 'others',
    mine: false,
    holder: 'dev',
    reason: { en: 'Dev approves quality invoices as budget owner.', ko: 'Dev 님은 예산 책임자로서 품질 관리 인보이스를 승인합니다.', ja: 'Devは予算責任者として品質管理の請求書を承認します。' },
    waiting: '2026-11-19T12:10',
  },
  {
    key: 'sheffield',
    supplier: 'Sheffield Steel Fixings',
    ref: 'SSF-1170',
    email: 'accounts@sheffieldsteelfixings.co.uk',
    pages: 1,
    dated: '2026-11-13',
    received: '2026-11-13T10:05',
    due: '2026-11-27',
    centre: { en: 'Frames production', ko: '프레임 생산', ja: 'フレーム製造' },
    terms: { en: '14 days from invoice', ko: '인보이스 날짜 후 14일', ja: '請求書日付から14日' },
    account: '8823',
    since: { en: 'November 2022', ko: '2022년 11월', ja: '2022年11月' },
    po: { ref: 'PO-3307', by: 'dev', on: '2026-11-04' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 2422, note: { en: 'net on PO-3307, 4 Nov', ko: 'PO-3307 기준 세전, 11월 4일', ja: 'PO-3307の税抜、11月4日' } },
        { label: MATCH.received, value: { en: '2 of 2 items', ko: '2개 중 2개 품목', ja: '2点中2点' }, note: { en: 'GRN-0906, booked in 11 Nov', ko: 'GRN-0906, 11월 11일 입고 등록', ja: 'GRN-0906、11月11日に計上' } },
        { label: MATCH.invoiced, value: 2422, note: MATCH.same },
      ],
    },
    checked: { title: { en: 'Matched to PO-3307 and GRN-0906', ko: 'PO-3307 및 GRN-0906과 대조함', ja: 'PO-3307 と GRN-0906 に照合済み' }, body: MATCH.sameBody },
    lines: [
      { item: { en: 'Bottle bosses, M5, stainless', ko: '물병 보스, M5, 스테인리스', ja: 'ボトルボス、M5、ステンレス' }, qty: 4000, unit: 0.38 },
      { item: { en: 'Dropout hangers', ko: '드롭아웃 행어', ja: 'ドロップアウトハンガー' }, qty: 220, unit: 4.1 },
    ],
    vat: 0.2,
    approvals: [{ by: 'dev', at: '2026-11-18T11:26' }],
    stage: 'run',
    mine: false,
  },
  {
    key: 'tracklog',
    supplier: 'Tracklog',
    ref: 'TL-2026-11',
    email: 'billing@tracklog.io',
    pages: 1,
    dated: '2026-11-01',
    received: '2026-11-01T00:04',
    due: '2026-11-30',
    centre: { en: 'Warehouse', ko: '창고', ja: '倉庫' },
    terms: { en: 'Due by the end of the month', ko: '월말까지 납부', ja: '月末までに支払い' },
    account: '6051',
    since: { en: 'January 2026', ko: '2026년 1월', ja: '2026年1月' },
    noPo: { en: 'A monthly subscription.', ko: '월간 구독 상품입니다.', ja: '毎月の定額契約です。' },
    check: {
      title: { en: 'Checked against the subscription', ko: '구독 계약과 대조함', ja: '定額契約と照合' },
      cells: [
        { label: { en: 'Plan', ko: '요금제', ja: 'プラン' }, value: { en: '25 seats', ko: '사용자 25명', ja: 'ユーザー25名' }, note: { en: 'at £34.60 a seat a month', ko: '사용자 1명당 월 £34.60', ja: '1ユーザーあたり月額 £34.60' } },
        { label: { en: 'Last month', ko: '지난달', ja: '先月' }, value: 865, note: { en: 'TL-2026-10, paid 29 Oct', ko: 'TL-2026-10, 10월 29일 지급', ja: 'TL-2026-10、10月29日支払い済み' } },
        { label: MATCH.invoiced, value: 865, note: { en: 'the same as last month', ko: '지난달과 동일', ja: '先月と同額' } },
      ],
    },
    checked: {
      title: { en: 'Checked against the subscription', ko: '구독 계약과 대조함', ja: '定額契約と照合' },
      body: { en: '25 seats, the same as last month.', ko: '사용자 25명, 지난달과 같습니다.', ja: 'ユーザー25名、先月と同じです。' },
    },
    lines: [{ item: { en: 'Stock tracking for December, seats', ko: '12월 재고 추적, 사용자 수', ja: '12月の在庫追跡、ユーザー数' }, qty: 25, unit: 34.6 }],
    vat: 0.2,
    approvals: [{ by: 'lena', at: '2026-11-17T09:03' }],
    stage: 'run',
    mine: false,
  },
  {
    key: 'eastgate',
    supplier: 'Eastgate Print',
    ref: 'EP-6612',
    email: 'studio@eastgateprint.co.uk',
    pages: 1,
    dated: '2026-11-12',
    received: '2026-11-12T16:30',
    due: '2026-11-26',
    centre: { en: 'Office and marketing', ko: '사무·마케팅', ja: '事務・マーケティング' },
    terms: { en: '14 days from invoice', ko: '인보이스 날짜 후 14일', ja: '請求書日付から14日' },
    account: '4402',
    since: { en: 'March 2025', ko: '2025년 3월', ja: '2025年3月' },
    po: { ref: 'PO-3309', by: 'jonas', on: '2026-11-05' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 324, note: { en: 'net on PO-3309, 5 Nov', ko: 'PO-3309 기준 세전, 11월 5일', ja: 'PO-3309の税抜、11月5日' } },
        { label: MATCH.received, value: { en: '300 of 300 copies', ko: '300부 중 300부', ja: '300部中300部' }, note: { en: 'GRN-0908, booked in 12 Nov', ko: 'GRN-0908, 11월 12일 입고 등록', ja: 'GRN-0908、11月12日に計上' } },
        { label: MATCH.invoiced, value: 324, note: MATCH.same },
      ],
    },
    checked: { title: { en: 'Matched to PO-3309 and GRN-0908', ko: 'PO-3309 및 GRN-0908과 대조함', ja: 'PO-3309 と GRN-0908 に照合済み' }, body: MATCH.sameBody },
    lines: [{ item: { en: 'Spring catalogue, 300 copies', ko: '봄 카탈로그, 300부', ja: '春のカタログ、300部' }, qty: 300, unit: 1.08 }],
    vat: 0.2,
    approvals: [{ by: 'jonas', at: '2026-11-19T14:12' }],
    stage: 'run',
    mine: false,
  },
  {
    key: 'brookfield',
    supplier: 'Brookfield Rims',
    ref: 'BR-55102',
    email: 'accounts@brookfieldrims.co.uk',
    pages: 2,
    dated: '2026-11-10',
    received: '2026-11-11T09:40',
    due: '2026-12-01',
    centre: { en: 'Wheel building', ko: '휠 조립', ja: 'ホイール組み' },
    terms: { en: '21 days from invoice', ko: '인보이스 날짜 후 21일', ja: '請求書日付から21日' },
    account: '3377',
    since: { en: 'September 2024', ko: '2024년 9월', ja: '2024年9月' },
    po: { ref: 'PO-3299', by: 'dev', on: '2026-10-29' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 15066, note: { en: 'net on PO-3299, 29 Oct', ko: 'PO-3299 기준 세전, 10월 29일', ja: 'PO-3299の税抜、10月29日' } },
        { label: MATCH.received, value: { en: '2 of 2 items', ko: '2개 중 2개 품목', ja: '2点中2点' }, note: { en: 'GRN-0901, booked in 10 Nov', ko: 'GRN-0901, 11월 10일 입고 등록', ja: 'GRN-0901、11月10日に計上' } },
        { label: MATCH.invoiced, value: 15066, note: MATCH.same },
      ],
    },
    checked: { title: { en: 'Matched to PO-3299 and GRN-0901', ko: 'PO-3299 및 GRN-0901과 대조함', ja: 'PO-3299 と GRN-0901 に照合済み' }, body: MATCH.sameBody },
    lines: [
      { item: { en: 'Rims, 700c, 28 hole', ko: '림, 700c, 28홀', ja: 'リム、700c、28穴' }, qty: 260, unit: 55.4 },
      { item: { en: 'Rim tape', ko: '림 테이프', ja: 'リムテープ' }, qty: 260, unit: 1.8 },
      { item: { en: 'Carriage', ko: '운송비', ja: '運賃' }, qty: 1, unit: 194 },
    ],
    vat: 0.2,
    approvals: [
      { by: 'dev', at: '2026-11-12T10:15' },
      { by: 'maya', at: '2026-11-17T15:02' },
    ],
    stage: 'run',
    mine: true,
    reason: { en: 'Invoices over £10,000 need the finance lead after the budget owner.', ko: '£10,000을 넘는 인보이스는 예산 책임자 다음에 재무 책임자 승인이 필요합니다.', ja: '£10,000 を超える請求書は、予算責任者の後に財務責任者の承認が必要です。' },
  },
];

const BY_KEY = Object.fromEntries(INVOICES.map((invoice) => [invoice.key, invoice])) as Record<string, Invoice>;

const netOf = (invoice: Invoice) => invoice.lines.reduce((sum, line) => sum + Math.round(line.qty * line.unit * 100), 0);
const AMOUNTS = Object.fromEntries(
  INVOICES.map((invoice) => {
    const net = netOf(invoice);
    const vat = Math.round(net * invoice.vat);
    return [invoice.key, { net, vat, total: net + vat }];
  }),
) as Record<string, { net: number; vat: number; total: number }>;

// Disputes settled this year, shown from the empty state of the Disputed group.
const SETTLED = [
  { supplier: 'Kettering Tube Works', ref: 'INV-19877', credit: 'CN-0412', amount: 9600, on: '2026-09-14' },
  { supplier: 'Velotread Tyres UK', ref: 'VT-5530-071', credit: 'CN-2231', amount: 34080, on: '2026-07-02' },
  { supplier: 'Hallam Powder Coating', ref: 'HPC-2104', credit: 'CN-118', amount: 16200, on: '2026-05-21' },
  { supplier: 'Brightline Freight', ref: 'BF-076552', credit: 'CN-9034', amount: 21000, on: '2026-03-03' },
];

interface Live {
  stage: Stage;
  /** Approved by the finance lead on this page, so it can be undone. */
  byMe?: boolean;
  /** The reason given for a dispute. */
  reason?: string;
}

const INITIAL: Record<string, Live> = Object.fromEntries(INVOICES.map((invoice) => [invoice.key, { stage: invoice.stage }]));

const lateBy = (invoice: Invoice, stage: Stage) => (stage === 'you' || stage === 'others' ? Math.max(0, daysBetween(invoice.due, TODAY)) : 0);

/** The queue as filtered: late first, then the largest amount. */
function visibleRows(live: Record<string, Live>, view: View, dueOnly: boolean, query: string) {
  const q = query.trim().toLowerCase();
  return INVOICES.filter(
    (invoice) =>
      (view === 'team' || invoice.mine) &&
      (!dueOnly || invoice.due <= DUE_LIMIT) &&
      (!q || invoice.supplier.toLowerCase().includes(q) || invoice.ref.toLowerCase().includes(q)),
  ).sort((a, b) => {
    const late = Number(lateBy(b, live[b.key].stage) > 0) - Number(lateBy(a, live[a.key].stage) > 0);
    return late || AMOUNTS[b.key].total - AMOUNTS[a.key].total;
  });
}

const sumOf = (invoices: Invoice[]) => invoices.reduce((sum, invoice) => sum + AMOUNTS[invoice.key].total, 0);

const TOP = {
  search: { en: 'Search invoices', ko: '인보이스 검색', ja: '請求書を検索' },
  placeholder: { en: 'Supplier or invoice number', ko: '공급업체 또는 인보이스 번호', ja: '取引先名または請求書番号' },
  clear: { en: 'Clear the search', ko: '검색 지우기', ja: '検索をクリア' },
} satisfies Record<string, Tri>;

const HEAD = {
  title: { en: 'Approval queue', ko: '승인 대기열', ja: '承認キュー' },
  lead: {
    en: '{org} finance. The next payment run is {run}. Invoices approved by Wednesday at 17:00 go in it.',
    ko: '{org} 재무팀입니다. 다음 지급 회차는 {run}입니다. 수요일 17:00까지 승인된 인보이스가 이번 회차에 지급됩니다.',
    ja: '{org} 財務部です。次回の支払い回は{run}です。水曜日17:00までに承認された請求書が対象になります。',
  },
} satisfies Record<string, Tri>;

const MONTH = {
  title: { en: 'November so far', ko: '11월 누계', ja: '11月の累計' },
  count: { en: '{n} invoices since 1 Nov', ko: '11월 1일 이후 인보이스 {n}건', ja: '11月1日以降の請求書 {n}件' },
  paid: { en: 'Paid', ko: '지급 완료', ja: '支払い済み' },
  approved: { en: 'Approved', ko: '승인됨', ja: '承認済み' },
  waiting: { en: 'Waiting', ko: '승인 대기', ja: '承認待ち' },
  disputed: { en: 'Disputed', ko: '이의 제기', ja: '異議あり' },
  bar: {
    en: 'Paid {paid}, approved {approved}, waiting {waiting}, disputed {disputed}',
    ko: '지급 완료 {paid}, 승인됨 {approved}, 승인 대기 {waiting}, 이의 제기 {disputed}',
    ja: '支払い済み {paid}、承認済み {approved}、承認待ち {waiting}、異議あり {disputed}',
  },
} satisfies Record<string, Tri>;

const QUEUE = {
  title: { en: 'Invoices', ko: '인보이스', ja: '請求書' },
  whose: { en: 'Whose invoices', ko: '담당 인보이스', ja: '担当の請求書' },
  mine: { en: 'Mine', ko: '내 것', ja: '自分の' },
  team: { en: 'Team', ko: '팀', ja: 'チーム' },
  due: { en: 'Due', ko: '마감', ja: '期限' },
  byLimit: { en: 'by 30 Nov', ko: '11월 30일까지', ja: '11月30日まで' },
  removeDue: { en: 'Remove the due date filter', ko: '마감일 필터 해제', ja: '期限フィルターを解除' },
  addDue: { en: 'Due by 30 Nov', ko: '11월 30일까지 마감', ja: '11月30日まで期限' },
  addDueName: { en: 'Due by 30 Nov, add as a filter', ko: '11월 30일까지 마감, 필터로 추가', ja: '11月30日まで期限、フィルターに追加' },
  count: { en: '{n} of {total} invoices, {sum}', ko: '인보이스 {total}건 중 {n}건, {sum}', ja: '請求書 {total}件中 {n}件、{sum}' },
  dueOn: { en: 'Due {date}', ko: '마감 {date}', ja: '期限 {date}' },
} satisfies Record<string, Tri>;

const GROUPS: Array<{ id: Stage; title: Tri }> = [
  { id: 'you', title: { en: 'Waiting on you', ko: '내 승인 대기', ja: 'あなたの承認待ち' } },
  { id: 'others', title: { en: 'Waiting on others', ko: '다른 사람 승인 대기', ja: '他の人の承認待ち' } },
  { id: 'run', title: { en: 'In Thursday’s run', ko: '목요일 지급 회차 포함', ja: '木曜日の支払い回に含む' } },
  { id: 'disputed', title: { en: 'Disputed', ko: '이의 제기', ja: '異議あり' } },
];

const BADGE = {
  you: { en: 'Your approval', ko: '내 승인 필요', ja: 'あなたの承認が必要' },
  with: { en: 'With {name}', ko: '{name} 검토 중', ja: '{name}が確認中' },
  run: { en: 'Approved', ko: '승인됨', ja: '承認済み' },
  disputed: { en: 'Disputed', ko: '이의 제기됨', ja: '異議あり' },
  lateOne: { en: '1 day late', ko: '1일 지연', ja: '1日遅延' },
  lateMany: { en: '{n} days late', ko: '{n}일 지연', ja: '{n}日遅延' },
} satisfies Record<string, Tri>;

const EMPTY = {
  youTitle: { en: 'Nothing is waiting on you', ko: '내 승인 대기 항목이 없습니다', ja: 'あなたの承認待ちはありません' },
  youTitleDue: { en: 'Nothing waiting on you is due by 30 Nov', ko: '11월 30일까지 마감인 내 승인 대기 항목이 없습니다', ja: '11月30日までに期限の、あなたの承認待ちはありません' },
  youText: { en: 'Thursday’s run closes on Wednesday at 17:00.', ko: '목요일 지급 회차는 수요일 17:00에 마감됩니다.', ja: '木曜日の支払い回は水曜日17:00に締め切られます。' },
  disputedTitle: { en: 'No disputed invoices', ko: '이의 제기된 인보이스가 없습니다', ja: '異議ありの請求書はありません' },
  disputedTitleDue: { en: 'No disputed invoices due by 30 Nov', ko: '11월 30일까지 마감인 이의 제기 인보이스가 없습니다', ja: '11月30日までに期限の異議あり請求書はありません' },
  disputedText: {
    en: 'If a price, a quantity or a delivery is wrong, open the invoice and choose Dispute. Ledgerline holds it out of the payment run and emails the supplier for a credit note.',
    ko: '단가, 수량 또는 납품에 오류가 있으면 인보이스를 열고 이의 제기를 선택하세요. Ledgerline이 해당 인보이스를 지급 회차에서 제외하고 공급업체에 크레딧 노트를 요청하는 이메일을 보냅니다.',
    ja: '単価、数量、納品のいずれかに誤りがあれば、請求書を開いて「異議申し立て」を選んでください。Ledgerlineが支払い回からその請求書を外し、取引先にクレジットノートを求めるメールを送ります。',
  },
  settled: { en: 'See the 4 settled this year', ko: '올해 해결된 4건 보기', ja: '今年解決した4件を見る' },
  settledList: { en: 'Disputes settled this year', ko: '올해 해결된 이의 제기', ja: '今年解決した異議申し立て' },
  credit: { en: 'credit note {ref}', ko: '크레딧 노트 {ref}', ja: 'クレジットノート {ref}' },
  settledOn: { en: 'settled {date}', ko: '{date} 해결', ja: '{date}解決' },
  searchTitle: { en: 'No invoices match “{q}”', ko: '“{q}”에 맞는 인보이스가 없습니다', ja: '「{q}」に一致する請求書はありません' },
  searchText: { en: 'Search looks at supplier names and invoice numbers.', ko: '검색은 공급업체 이름과 인보이스 번호를 대상으로 합니다.', ja: '検索の対象は取引先名と請求書番号です。' },
  searchElsewhereOne: {
    en: '1 invoice outside this view matches. Choose Team or remove the due date filter to see it.',
    ko: '이 보기 밖에 일치하는 인보이스가 1건 있습니다. 팀을 선택하거나 마감일 필터를 해제하면 볼 수 있습니다.',
    ja: 'この表示の外に一致する請求書が1件あります。「チーム」を選ぶか、期限フィルターを解除すると表示されます。',
  },
  searchElsewhereMany: {
    en: '{n} invoices outside this view match. Choose Team or remove the due date filter to see them.',
    ko: '이 보기 밖에 일치하는 인보이스가 {n}건 있습니다. 팀을 선택하거나 마감일 필터를 해제하면 볼 수 있습니다.',
    ja: 'この表示の外に一致する請求書が{n}件あります。「チーム」を選ぶか、期限フィルターを解除すると表示されます。',
  },
} satisfies Record<string, Tri>;

const DETAIL = {
  previous: { en: 'Previous invoice waiting on you', ko: '내 승인 대기 중 이전 인보이스', ja: 'あなたの承認待ちの前の請求書' },
  next: { en: 'Next invoice waiting on you', ko: '내 승인 대기 중 다음 인보이스', ja: 'あなたの承認待ちの次の請求書' },
  place: { en: '{i} of {n} waiting on you', ko: '내 승인 대기 {n}건 중 {i}번째', ja: 'あなたの承認待ち {n}件中 {i}件目' },
  count: { en: '{n} waiting on you', ko: '내 승인 대기 {n}건', ja: 'あなたの承認待ち {n}件' },
  none: { en: 'None waiting on you', ko: '내 승인 대기 없음', ja: 'あなたの承認待ちはありません' },
  withVat: { en: 'including {vat} VAT', ko: '부가세 {vat} 포함', ja: 'VAT {vat} 込み' },
  noVat: { en: 'no VAT', ko: '부가세 없음', ja: 'VATなし' },
  dueIn: { en: 'Due {date}, in {n} days', ko: '마감 {date}, {n}일 후', ja: '期限 {date}、{n}日後' },
  dueTomorrow: { en: 'Due {date}, tomorrow', ko: '마감 {date}, 내일', ja: '期限 {date}、明日' },
  dueToday: { en: 'Due today, {date}', ko: '오늘 마감, {date}', ja: '本日期限、{date}' },
  wasDueOne: { en: 'Was due {date}, a day ago', ko: '마감 {date}, 1일 지남', ja: '期限 {date}、1日前' },
  wasDueMany: { en: 'Was due {date}, {n} days ago', ko: '마감 {date}, {n}일 지남', ja: '期限 {date}、{n}日前' },
  earlyOne: { en: 'If you approve it by Wednesday at 17:00, Thursday’s run pays it a day early.', ko: '수요일 17:00까지 승인하면 목요일 지급 회차에서 하루 일찍 지급됩니다.', ja: '水曜日17:00までに承認すると、木曜日の支払い回で1日早く支払われます。' },
  earlyMany: {
    en: 'If you approve it by Wednesday at 17:00, Thursday’s run pays it {n} days early.',
    ko: '수요일 17:00까지 승인하면 목요일 지급 회차에서 {n}일 일찍 지급됩니다.',
    ja: '水曜日17:00までに承認すると、木曜日の支払い回で{n}日早く支払われます。',
  },
  onTime: {
    en: 'If you approve it by Wednesday at 17:00, Thursday’s run pays it on the day it is due.',
    ko: '수요일 17:00까지 승인하면 목요일 지급 회차에서 마감일에 지급됩니다.',
    ja: '水曜日17:00までに承認すると、木曜日の支払い回で期限日に支払われます。',
  },
  afterOne: { en: 'Thursday’s run is the day after it is due.', ko: '목요일 지급 회차는 마감일 다음 날입니다.', ja: '木曜日の支払い回は期限の翌日です。' },
  afterMany: { en: 'Thursday’s run is {n} days after it is due.', ko: '목요일 지급 회차는 마감일보다 {n}일 늦습니다.', ja: '木曜日の支払い回は期限の{n}日後です。' },
  approve: { en: 'Approve for Thursday’s run', ko: '목요일 지급 회차에 승인', ja: '木曜日の支払い回で承認' },
  dispute: { en: 'Dispute', ko: '이의 제기', ja: '異議申し立て' },
  approvedNow: { en: 'Approved for Thursday’s run, which pays it on {run}.', ko: '목요일 지급 회차로 승인했습니다. {run}에 지급됩니다.', ja: '木曜日の支払い回で承認しました。{run}に支払われます。' },
  undo: { en: 'Undo the approval', ko: '승인 취소', ja: '承認を取り消す' },
  disputedNow: {
    en: 'Disputed and held out of Thursday’s run. Ledgerline has emailed {email} and asked for a credit note.',
    ko: '이의 제기되어 목요일 지급 회차에서 보류되었습니다. Ledgerline이 {email}로 이메일을 보내 크레딧 노트를 요청했습니다.',
    ja: '異議申し立てされ、木曜日の支払い回から保留されています。Ledgerlineが{email}にメールを送り、クレジットノートを求めました。',
  },
  yourReason: { en: 'Your reason', ko: '이의 제기 사유', ja: '異議申し立ての理由' },
  withdraw: { en: 'Withdraw the dispute', ko: '이의 제기 철회', ja: '異議申し立てを取り下げる' },
  withOther: {
    en: 'With {name}, {role}, since {date}. Nothing is needed from you.',
    ko: '{name}({role}) 검토 중, {date}부터입니다. 별도로 처리할 일은 없습니다.',
    ja: '{name}（{role}）が{date}から確認中です。あなたの対応は必要ありません。',
  },
  approvedBy: { en: 'Approved by {name} on {date}. Thursday’s run pays it.', ko: '{name} 승인, {date}. 목요일 지급 회차에서 지급됩니다.', ja: '{name}が{date}に承認。木曜日の支払い回で支払われます。' },
  approvedByYou: { en: 'Approved by you on {date}. Thursday’s run pays it.', ko: '{date}에 본인이 승인했습니다. 목요일 지급 회차에서 지급됩니다.', ja: '{date}にあなたが承認しました。木曜日の支払い回で支払われます。' },
} satisfies Record<string, Tri>;

const DISPUTE = {
  label: { en: 'What is wrong with this invoice?', ko: '이 인보이스의 어떤 점이 잘못되었나요?', ja: 'この請求書のどこに問題がありますか？' },
  hint: { en: 'Ledgerline sends this to {email} and asks for a credit note.', ko: 'Ledgerline이 이 내용을 {email}로 보내고 크레딧 노트를 요청합니다.', ja: 'この内容はLedgerlineから{email}に送られ、クレジットノートを求めます。' },
  empty: { en: 'Write what is wrong, so the supplier knows what to correct.', ko: '공급업체가 무엇을 고쳐야 할지 알 수 있도록 잘못된 내용을 적어 주세요.', ja: '取引先が修正できるよう、問題の内容を入力してください。' },
  short: { en: 'Add a little more: which line is wrong, and what it should be.', ko: '조금 더 적어 주세요. 어느 품목이 잘못되었고 어떻게 되어야 하는지요.', ja: 'もう少し詳しく入力してください。どの明細が誤っていて、どうあるべきかを書いてください。' },
  submit: { en: 'Dispute and hold payment', ko: '이의 제기하고 지급 보류', ja: '異議申し立てして支払いを保留' },
  cancel: { en: 'Cancel', ko: '취소', ja: 'キャンセル' },
} satisfies Record<string, Tri>;

const PROPS = {
  invoice: { en: 'Invoice', ko: '인보이스', ja: '請求書' },
  dated: { en: 'dated {date}', ko: '{date} 작성', ja: '{date}付' },
  po: { en: 'Purchase order', ko: '발주서', ja: '発注書' },
  raised: { en: 'raised by {name}', ko: '{name} 발행', ja: '{name}が発行' },
  none: { en: 'None', ko: '없음', ja: 'なし' },
  centre: { en: 'Cost centre', ko: '비용 센터', ja: '費用センター' },
  terms: { en: 'Terms', ko: '결제 조건', ja: '支払い条件' },
  payTo: { en: 'Pay to', ko: '입금 계좌', ja: '振込先' },
  account: { en: 'Account ending {n}', ko: '계좌 끝자리 {n}', ja: '口座番号末尾 {n}' },
  unchanged: { en: 'unchanged since {when}', ko: '{when} 이후 변경 없음', ja: '{when}から変更なし' },
  original: { en: 'Original', ko: '원본', ja: '原本' },
  pageOne: { en: '1 page', ko: '1쪽', ja: '1ページ' },
  pageMany: { en: '{n} pages', ko: '{n}쪽', ja: '{n}ページ' },
} satisfies Record<string, Tri>;

const LINES = {
  title: { en: 'Lines', ko: '품목 명세', ja: '明細' },
  item: { en: 'Item', ko: '품목', ja: '品目' },
  qty: { en: 'Qty', ko: '수량', ja: '数量' },
  unit: { en: 'Unit price', ko: '단가', ja: '単価' },
  amount: { en: 'Amount', ko: '금액', ja: '金額' },
  was: { en: 'The order says {price}', ko: '주문서에는 {price}로 되어 있습니다', ja: '注文書では{price}です' },
  short: { en: '{n} not received yet', ko: '{n}개 미입고', ja: '{n}点 未入荷' },
  net: { en: 'Net', ko: '공급가액', ja: '税抜' },
  vat: { en: 'VAT at {rate}%', ko: '부가세 {rate}%', ja: 'VAT {rate}%' },
  total: { en: 'Total', ko: '합계', ja: '合計' },
} satisfies Record<string, Tri>;

const TRAIL = {
  title: { en: 'Approval trail', ko: '승인 기록', ja: '承認の経緯' },
  stamp: { en: '{day}, {time}', ko: '{day} {time}', ja: '{day} {time}' },
  received: { en: 'Received by email', ko: '이메일로 접수', ja: 'メールで受信' },
  receivedBody: { en: 'Read from {inbox} and filed under {supplier}.', ko: '{inbox}에서 읽어 {supplier} 건으로 분류했습니다.', ja: '{inbox}から読み取り、{supplier}として保存しました。' },
  approvedBy: { en: 'Approved by {name}, {role}', ko: '{name} 승인, {role}', ja: '{name}が承認、{role}' },
  ownerBody: { en: 'Budget owner for {centre}.', ko: '{centre} 예산 책임자입니다.', ja: '{centre}の予算責任者です。' },
  approvedYou: { en: 'Approved by you as finance lead', ko: '재무 책임자로서 본인이 승인', ja: '財務責任者としてあなたが承認' },
  yours: { en: 'Your approval as finance lead', ko: '재무 책임자로서 내 승인', ja: '財務責任者としてのあなたの承認' },
  withOther: { en: 'With {name}, {role}', ko: '{name}({role}) 검토 중', ja: '{name}（{role}）が確認中' },
  waitingToday: { en: 'since today', ko: '오늘부터', ja: '本日から' },
  waitingOne: { en: 'waiting 1 day', ko: '1일째 대기 중', ja: '1日間待機中' },
  waitingMany: { en: 'waiting {n} days', ko: '{n}일째 대기 중', ja: '{n}日間待機中' },
  paid: { en: 'Paid in Thursday’s run', ko: '목요일 지급 회차에서 지급', ja: '木曜日の支払い回で支払い' },
  paidBody: { en: 'Bacs from the operating account, arriving {date}.', ko: '운영 계좌에서 BACS 이체, {date} 입금 예정.', ja: '運用口座からBACS振込、{date}着予定。' },
  disputed: { en: 'Disputed by you', ko: '본인이 이의 제기', ja: 'あなたが異議申し立て' },
  credit: { en: 'Waiting for a credit note from {supplier}', ko: '{supplier}의 크레딧 노트 대기 중', ja: '{supplier}からのクレジットノートを待機中' },
  creditBody: {
    en: 'Ledgerline emailed {email}. The invoice stays out of payment runs until the credit note arrives.',
    ko: 'Ledgerline이 {email}로 이메일을 보냈습니다. 크레딧 노트가 도착할 때까지 이 인보이스는 지급 회차에 포함되지 않습니다.',
    ja: 'Ledgerlineが{email}にメールを送りました。クレジットノートが届くまで、この請求書は支払い回に含まれません。',
  },
} satisfies Record<string, Tri>;

const NEWS = {
  countOne: { en: '1 invoice, {sum}.', ko: '인보이스 1건, {sum}.', ja: '請求書1件、{sum}。' },
  countMany: { en: '{n} invoices, {sum}.', ko: '인보이스 {n}건, {sum}.', ja: '請求書{n}件、{sum}。' },
  filterOff: { en: 'Due date filter removed.', ko: '마감일 필터를 해제했습니다.', ja: '期限フィルターを解除しました。' },
  filterOn: { en: 'Showing invoices due by 30 Nov.', ko: '11월 30일까지 마감인 인보이스를 표시합니다.', ja: '11月30日までに期限の請求書を表示しています。' },
  showing: { en: 'Showing {supplier}, {ref}.', ko: '{supplier}, {ref} 표시 중.', ja: '{supplier}、{ref}を表示中。' },
  approved: { en: '{supplier} approved. {ref} moves to Thursday’s run.', ko: '{supplier} 승인 완료. {ref}, 목요일 지급 회차로 이동했습니다.', ja: '{supplier}を承認しました。{ref}は木曜日の支払い回に移動しました。' },
  undone: { en: 'Approval undone. {ref} is waiting on you again.', ko: '승인을 취소했습니다. {ref}, 다시 내 승인 대기 상태입니다.', ja: '承認を取り消しました。{ref}は再びあなたの承認待ちです。' },
  disputed: { en: '{supplier} disputed. {ref} is held out of Thursday’s run.', ko: '{supplier}에 이의를 제기했습니다. {ref}, 목요일 지급 회차에서 보류됩니다.', ja: '{supplier}に異議を申し立てました。{ref}は木曜日の支払い回から保留されます。' },
  withdrawn: { en: 'Dispute withdrawn. {ref} is waiting on you again.', ko: '이의 제기를 철회했습니다. {ref}, 다시 내 승인 대기 상태입니다.', ja: '異議申し立てを取り下げました。{ref}は再びあなたの承認待ちです。' },
} satisfies Record<string, Tri>;

const ICONS: Record<IconName, ReactNode> = {
  check: <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />,
  x: <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />,
  flag: <path d="M4 14V2.5M4 3h8l-2 3 2 3H4" />,
  file: <path d="M4 1.75h5l3 3v9.5H4zM9 1.75v3h3" />,
  plus: <path d="M8 3.5v9M3.5 8h9" />,
  down: <path d="M4 6l4 4 4-4" />,
  up: <path d="M4 10l4-4 4 4" />,
  alert: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3.5M8 11v.01" />
    </>
  ),
  search: (
    <>
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5 14 14" />
    </>
  ),
};

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className ? `lg-g ${className}` : 'lg-g'} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {ICONS[name]}
    </svg>
  );
}

const PROMPT_EN = `Design one real page in the Quiet Utility style: one screen of a working tool on a white canvas, with slate-tinted frames around white panels, 1px lines you can see, one muted slate accent for the primary action, and status colours that carry meaning only.

Pick a believable subject that is daily operational work, such as an invoice-approval tool, a dispatch board or a support inbox, and write its real content. The page must read as that tool's screen, never as a page about its own style. Here it is Ledgerline, the invoice-approval tool of Fernhill Cycles, a frame and wheel maker in Sheffield, as the finance lead sees it on Friday 20 November: the approval queue grouped by who has to act, with the chosen invoice open beside it.

Where a component library exists, use its components: segmented control, search field, button, status badge, empty state, alert, text area. Everything else comes from the work itself.

TOKENS:
--canvas: #ffffff (page and panels; opaque, also behind any menu that opens over the page)
--surface: #edf2f4 (the frame around a panel; hover on group heads)
--surface-2: #e5ebee (segmented track, the chosen row)
--inset: #f7f9fa (group heads, hover on rows and buttons, quoted notes)
--ink: #1f2328
--muted: #5d6772
--rule: #bdc7cf (lines inside a panel)
--line: #7a848e (panel edges, control edges)
--line-hover: #6e7a84 (control edges on hover)
--field: #68727c (text field edges)
--accent: #526371, with #ffffff on it
Status, each as text / tint / mark: neutral #424b55 / #dfe5ea / #6f7b86; positive #116329 / #dcf0e2 / #1a7f37; caution #7a4c00 / #fbeccb / #9a6700, with a #dbbb6c rule; critical #a40e26 / #fbe2e5 / #cf222e; info mark #0969da.

COLOUR:
- The accent fills the primary button, the product mark, the avatar and the dots of finished steps (with the 2px line that joins them), outlines the filter token and the focus ring, and marks the chosen row with a 3px inner edge. Hovering the primary button turns it ink.
- Status colours appear only where they mean something: caution for what waits on you and for a line or a match cell that differs from the order; critical for late, disputed, the dispute actions and errors; positive for approved and paid.
- The month's stacked bar has four series: paid in positive mark, approved in info mark, waiting in caution mark and disputed in critical text, with 2px gaps and a legend that states each amount. The slate accent is not a series colour; it reads grey beside the others.
- Body text is ink or muted; muted keeps at least 4.5:1 on every surface. No gradients and no drop shadows: the 3px inner edges and the 4px caution halo around the current step's dot are the only box shadows.

TYPOGRAPHY:
One family: Inter, at 400, 500 and 600, with its default glyphs (no stylistic sets). Every amount uses tabular figures with a slashed zero, so columns of pounds line up; invoice numbers use the slashed zero with proportional figures.
H1: 600, 1.875rem, line-height 1.15, letter-spacing -0.024em (1.625rem below 760px).
H2, the open invoice: 600, 1.25rem, line-height 1.25, letter-spacing -0.016em. H3 and the month title: 600, 1rem, letter-spacing -0.006em.
The open amount: 600, 2.75rem, line-height 1, letter-spacing -0.035em (2.25rem below 480px). The month total: 600, 1.75rem, letter-spacing -0.03em.
Body 1rem, line-height 1.5; supplier names 500. Meta text (dates, references, counts, column heads, property labels, notes under a value) 0.875rem. Group heads 600 at 0.875rem. The product name 600 at 1.0625rem; the company and the signed-in name 0.9375rem.
The library's controls keep their own sizes: buttons 500 at 0.875rem, segmented options 500 at 0.8125rem, field labels 0.8125rem, status badges 500 at 0.75rem. Count chips, the shortcut hint and the avatar initials are 0.75rem. No all-caps, no tracked labels.

LAYOUT:
- An app bar on a 1px rule: the product mark and name, the company, a search field with a "/" shortcut hint, and the signed-in person.
- A head: the H1 and one sentence with the payment run date on the left; on the right the month summary in a 12px box with a 1px #7a848e edge (title, invoice count, total, a 10px stacked bar, and the legend).
- A split view, 5:7, with the queue on the left and the open invoice on the right. Each side is a frame: a 4px #edf2f4 shell with a 16px radius, a head row of controls on the shell, and a white panel inside with a 1px #7a848e edge and a 12px radius. On a 1280x800 laptop the head, the queue's first group and the open invoice's amount and actions are all on the first screen.
- Below 1080px the split stacks (queue first) and choosing a row moves focus to the invoice. Below 760px the search takes its own row, the properties run in two columns, the match strip stacks, and the line items show quantity and unit price under the item instead of in their own columns.

COMPONENTS:
- Queue head: a segmented control (Mine, Team, each with its count), a removable filter token ("Due by 30 Nov", 6px radius) that becomes an add button once removed, and a count line ("11 of 38 invoices, £50,159.14").
- Groups in this order: Waiting on you, Waiting on others, In Thursday's run, Disputed. Each head is a collapsible button on an inset strip with a count chip and the group's sum. Rows are buttons: supplier and amount on the first line, reference and due date under them, a status badge at the end. The chosen row has aria-current. Late rows come first, then the largest amounts.
- Empty states are the library's compact empty state: a 32px round icon, a title, one sentence and, where there is one, an action under it; Disputed offers the disputes settled this year.
- The open invoice: supplier and badge as the H2, a pager over the invoices waiting on you, then blocks separated by 1px rules: the amount and due date with Approve (primary) and Dispute (outlined, critical text); properties (invoice, purchase order, cost centre, terms, pay-to account, original); a three-cell strip on an 8px frame, the three-way match (ordered, received, invoiced) or, without an order, the quote, lease, rate card or last bill it was checked against, with a caution tint on a cell that differs; the line items as a table with the differing line tinted and given a 3px caution edge, then the totals; the approval trail as an ordered list with done (accent), current (caution ring) and later (hollow) dots.
- Approve moves the invoice to In Thursday's run, updates the counts, the sums and the month bar, shows a positive alert with Undo and announces the change. Dispute opens a text area that needs a reason of a few words, then moves the invoice to Disputed with the reason quoted in the trail and a caution alert with Withdraw.
- Corners: 4px small blocks, 6px tokens and the product mark, 8px controls and the match strip, 12px panels and alerts, 16px shells; capsules only for badges and the month bar; circles for the avatar, the step dots and the empty-state icons.

MOTION:
- 120ms colour changes on controls and rows, a 120ms turn of a group's chevron, and buttons that press to 98%. The library's segmented thumb slides for 200ms on a click, and a new badge, empty state or field error fades in over 200ms. Nothing moves on its own. prefers-reduced-motion removes all of it.

FORBIDDEN:
- Cards in a grid, glass, blur, glows, gradients, drop shadows
- A small label above a heading, all-caps tracked labels, numbered section markers
- Saturated brand colour, accent-coloured text, colour without meaning
- Dashboards of big-number tiles, charts without their values, decorative icons or illustrations, emoji
- Arrows on links, middle-dot meta strings, controls that do nothing
- Copy about calm, clarity or the style itself

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a radiogroup for Mine and Team, headings with buttons for the groups, buttons for the rows, a description list for the properties, a table for the lines, an ordered list for the trail
3) Working view switch, filter token, search with its empty state, row choice, pager, approve with undo, and a dispute form with an error and a success state
4) Responsive layout down to 320px with no horizontal scroll and nothing cut off; every control 44px tall on phones
5) Visible focus on every control, a polite live region for what changed, reduced-motion support`;

const PROMPT_KO = `Quiet Utility 스타일로 실제 페이지 한 장을 디자인한다. 흰 캔버스 위에서 돌아가는 업무 도구의 화면 한 장이어야 한다. 슬레이트 색조의 틀 안에 흰 패널을 두고, 보이는 1px 선을 쓰며, 기본 동작에만 절제된 슬레이트 강조색 하나를 쓴다. 상태 색은 의미가 있을 때만 쓴다.

일상 업무에 쓰이는 그럴듯한 주제를 고르고 실제 내용을 쓴다. 예: 인보이스 승인 도구, 출고 현황판, 고객 지원 수신함. 페이지는 그 도구의 화면으로 읽혀야 하며, 스타일을 설명하는 페이지처럼 보이면 안 된다. 여기서는 셰필드에서 프레임과 휠을 만드는 Fernhill Cycles의 인보이스 승인 도구 Ledgerline이다. 금요일 아침 재무 책임자가 보는 화면으로, 담당자별로 묶은 승인 대기열과 선택한 인보이스가 옆에 열려 있다.

컴포넌트 라이브러리가 있으면 그 컴포넌트를 쓴다: 세그먼티드 컨트롤, 검색 필드, 버튼, 상태 배지, 빈 상태, 알림, 텍스트 영역. 나머지는 작업 내용에서 가져온다.

TOKENS:
--canvas: #ffffff (페이지와 패널. 불투명하게, 페이지 위에 열리는 메뉴 뒤에도 같은 색)
--surface: #edf2f4 (패널을 감싸는 틀. 그룹 머리글 hover)
--surface-2: #e5ebee (세그먼티드 트랙, 선택된 행)
--inset: #f7f9fa (그룹 머리글, 행과 버튼 hover, 인용된 메모)
--ink: #1f2328
--muted: #5d6772
--rule: #bdc7cf (패널 안의 선)
--line: #7a848e (패널 가장자리, 컨트롤 가장자리)
--line-hover: #6e7a84 (hover 시 컨트롤 가장자리)
--field: #68727c (텍스트 필드 가장자리)
--accent: #526371, 그 위에 #ffffff
상태, 각각 텍스트 / 틴트 / 마크: neutral #424b55 / #dfe5ea / #6f7b86; positive #116329 / #dcf0e2 / #1a7f37; caution #7a4c00 / #fbeccb / #9a6700, #dbbb6c 구분선; critical #a40e26 / #fbe2e5 / #cf222e; info 마크 #0969da.

COLOUR:
- 강조색은 기본 버튼, 제품 마크, 아바타, 완료된 단계의 점(이를 잇는 2px 선 포함)을 채운다. 필터 토큰과 포커스 링의 테두리를 그리고, 선택된 행에 3px 안쪽 테두리를 준다. 기본 버튼에 hover하면 ink 색이 된다.
- 상태 색은 의미가 있는 곳에만 쓴다. caution은 내 승인을 기다리는 항목과, 발주서와 다른 줄이나 대조 셀에 쓴다. critical은 지연, 이의 제기, 이의 제기 동작, 오류에 쓴다. positive는 승인과 지급 완료에 쓴다.
- 월 누적 막대는 계열 네 개를 쓴다. 지급 완료는 positive 마크, 승인됨은 info 마크, 승인 대기는 caution 마크, 이의 제기는 critical 텍스트 색이다. 계열 사이는 2px 간격을 두고, 범례에 각 금액을 적는다. 강조 슬레이트는 계열 색이 아니며, 다른 색 옆에서 회색으로 보인다.
- 본문은 ink 또는 muted 색을 쓴다. muted는 모든 표면에서 4.5:1 이상 대비를 유지한다. 그라데이션과 그림자는 쓰지 않는다. 박스 그림자는 3px 안쪽 테두리와 현재 단계 점 주위의 4px caution halo만 허용한다.

TYPOGRAPHY:
Inter 한 가지 서체를 400, 500, 600으로 쓴다. 기본 글리프를 그대로 쓰며 stylistic set은 쓰지 않는다. 모든 금액은 tabular figures와 슬래시 0을 써서 파운드 금액 열이 맞도록 한다. 인보이스 번호는 슬래시 0과 proportional figures를 쓴다.
H1: 600, 1.875rem, line-height 1.15, letter-spacing -0.024em (760px 미만에서는 1.625rem).
H2, 열린 인보이스: 600, 1.25rem, line-height 1.25, letter-spacing -0.016em. H3과 월 제목: 600, 1rem, letter-spacing -0.006em.
열린 금액: 600, 2.75rem, line-height 1, letter-spacing -0.035em (480px 미만에서는 2.25rem). 월 합계: 600, 1.75rem, letter-spacing -0.03em.
본문 1rem, line-height 1.5. 공급업체 이름은 500. 메타 텍스트(날짜, 참조 번호, 개수, 열 머리글, 속성 라벨, 값 아래 메모)는 0.875rem. 그룹 머리글은 600, 0.875rem. 제품 이름은 600, 1.0625rem. 회사 이름과 로그인한 사람 이름은 0.9375rem.
라이브러리 컨트롤은 자체 크기를 유지한다. 버튼 500, 0.875rem. 세그먼티드 옵션 500, 0.8125rem. 필드 라벨 0.8125rem. 상태 배지 500, 0.75rem. 개수 칩, 단축키 힌트, 아바타 이니셜은 0.75rem. 전부 대문자와 자간을 넓힌 라벨은 쓰지 않는다.

LAYOUT:
- 1px 선이 있는 앱 바: 제품 마크와 이름, 회사, '/' 단축키 힌트가 있는 검색 필드, 로그인한 사람.
- 머리글: 왼쪽에 H1과 지급 회차 날짜가 있는 한 문장, 오른쪽에 월 요약 박스(12px 둥근 모서리, 1px #7a848e 테두리)를 둔다. 박스에는 제목, 인보이스 개수, 합계, 10px 누적 막대, 범례가 들어간다.
- 5:7 분할 뷰. 왼쪽은 대기열, 오른쪽은 열린 인보이스. 각 쪽은 틀로 감싼다: 16px 둥근 모서리에 4px #edf2f4 셸, 셸 위에 컨트롤이 있는 머리글 행, 그 안에 1px #7a848e 테두리와 12px 둥근 모서리를 가진 흰 패널. 1280x800 노트북 화면에서 머리글, 대기열의 첫 그룹, 열린 인보이스의 금액과 동작이 모두 첫 화면에 보여야 한다.
- 1080px 미만에서는 분할이 세로로 쌓인다(대기열이 먼저). 행을 고르면 포커스가 인보이스로 이동한다. 760px 미만에서는 검색이 자기 줄을 차지하고, 속성은 두 열로 배치되고, 대조 띠는 세로로 쌓이며, 품목 줄은 수량과 단가를 별도 열 대신 품목 아래에 보여 준다.

COMPONENTS:
- 대기열 머리글: 세그먼티드 컨트롤(내 것, 팀, 각각 개수 포함), 제거할 수 있는 필터 토큰('11월 30일까지 마감', 6px 둥근 모서리이며 제거되면 추가 버튼으로 바뀜), 개수 줄('인보이스 38건 중 11건, £50,159.14').
- 그룹 순서: 내 승인 대기, 다른 사람 승인 대기, 목요일 지급 회차, 이의 제기. 각 머리글은 안쪽 띠 위의 접을 수 있는 버튼이며, 개수 칩과 그룹 합계가 있다. 행은 버튼이다. 첫 줄에 공급업체와 금액, 그 아래에 참조 번호와 마감일, 끝에 상태 배지를 둔다. 선택된 행에는 aria-current를 둔다. 지연된 행이 먼저, 그다음 금액이 큰 순서다.
- 빈 상태는 라이브러리의 compact 빈 상태를 쓴다: 32px 원형 아이콘, 제목, 한 문장, 있으면 그 아래 동작. 이의 제기 그룹은 올해 해결된 이의 제기를 보여 준다.
- 열린 인보이스: 공급업체와 배지를 H2로 두고, 내 승인 대기 인보이스로 가는 페이저를 둔다. 그다음 1px 선으로 나뉜 블록들을 둔다. 금액과 마감일에 승인(기본)과 이의 제기(외곽선, critical 텍스트)가 붙는다. 속성(인보이스, 발주서, 비용 센터, 결제 조건, 입금 계좌, 원본). 8px 틀에 든 세 칸 띠: 3방향 대조(발주, 입고, 청구), 또는 발주서가 없으면 견적, 임대 계약, 요금표, 지난 청구서와 대조한 결과. 주문과 다른 칸은 caution 틴트를 준다. 품목은 표로 두고, 다른 줄은 틴트하고 3px caution 테두리를 준 뒤 합계를 붙인다. 승인 기록은 순서 있는 목록으로 두고, 완료(강조색), 현재(caution 링), 이후(속이 빈 점)로 표시한다.
- 승인을 누르면 인보이스가 목요일 지급 회차로 옮겨지고, 개수, 합계, 월 막대가 갱신되며, 실행 취소가 있는 positive 알림이 뜨고 변경을 알린다. 이의 제기를 누르면 몇 단어 이상의 사유를 요구하는 텍스트 영역이 열린다. 제출하면 인보이스는 이의 제기 그룹으로 옮겨지고, 사유가 기록에 인용되며, 철회 버튼이 있는 caution 알림이 뜬다.
- 모서리: 4px 작은 블록, 6px 토큰과 제품 마크, 8px 컨트롤과 대조 띠, 12px 패널과 알림, 16px 셸. 캡슐은 배지와 월 막대에만 쓴다. 원은 아바타, 단계 점, 빈 상태 아이콘에만 쓴다.

MOTION:
- 컨트롤과 행의 색 변화는 120ms, 그룹 쉐브론 회전은 120ms, 버튼은 누르면 98%로 줄어든다. 라이브러리의 세그먼티드 thumb은 클릭 시 200ms 동안 미끄러진다. 새 배지, 빈 상태, 필드 오류는 200ms에 걸쳐 나타난다. 스스로 움직이는 것은 없다. prefers-reduced-motion이면 이 모든 움직임을 없앤다.

FORBIDDEN:
- 격자형 카드, 유리 효과, 블러, 글로우, 그라데이션, 드롭 섀도
- 제목 위의 작은 라벨, 전부 대문자와 자간을 넓힌 라벨, 번호가 붙은 섹션 표식
- 채도 높은 브랜드 색, 강조색 텍스트, 의미 없는 색
- 큰 숫자 타일 대시보드, 값 없는 차트, 장식용 아이콘이나 일러스트, 이모지
- 링크의 화살표, 가운뎃점으로 이은 메타 문자열, 동작하지 않는 컨트롤
- 차분함, 명확함, 스타일 자체에 대한 문구

OUTPUT:
1) 위 토큰의 CSS 사용자 지정 속성
2) 시맨틱 HTML: 내 것과 팀을 위한 radiogroup, 그룹에는 버튼이 있는 제목, 행에는 버튼, 속성에는 description list, 품목에는 table, 승인 기록에는 ordered list
3) 동작하는 보기 전환, 필터 토큰, 빈 상태가 있는 검색, 행 선택, 페이저, 실행 취소가 있는 승인, 오류 상태와 성공 상태가 있는 이의 제기 양식
4) 320px까지 반응형 레이아웃, 가로 스크롤 없음, 잘린 요소 없음. 휴대폰에서는 모든 컨트롤 높이 44px
5) 모든 컨트롤에 보이는 포커스, 변경 사항을 알리는 polite live region, reduced-motion 지원`;

const PROMPT_JA = `Quiet Utilityスタイルで実在するページを1枚デザインする。白いキャンバスの上で動く業務ツールの画面1枚であり、スレート系の色味を帯びた枠の中に白いパネルを置く。見える1pxの罫線を使い、主要な操作にだけ抑えたスレート系のアクセント色を1つ使う。状態の色は意味があるときだけ使う。

日常業務にあたる、もっともらしい題材を選び、実際の内容を書く。例：請求書承認ツール、出荷ボード、サポートの受信箱。ページはそのツールの画面として読めなければならず、スタイルについて説明するページに見えてはならない。ここでは、シェフィールドでフレームとホイールを作るFernhill Cyclesの請求書承認ツール、Ledgerlineである。金曜日の朝に財務責任者が見る画面で、担当者ごとに分けた承認待ちの一覧と、選んだ請求書が横に開いている。

コンポーネントライブラリがあれば、そのコンポーネントを使う。セグメントコントロール、検索フィールド、ボタン、ステータスバッジ、空状態、アラート、テキストエリア。それ以外は作業の内容から取る。

TOKENS:
--canvas: #ffffff（ページとパネル。不透明にし、ページの上に開くメニューの背景にも使う）
--surface: #edf2f4（パネルを囲む枠。グループ見出しのhover）
--surface-2: #e5ebee（セグメントのトラック、選択中の行）
--inset: #f7f9fa（グループ見出し、行とボタンのhover、引用されたメモ）
--ink: #1f2328
--muted: #5d6772
--rule: #bdc7cf（パネル内の罫線）
--line: #7a848e（パネルの縁、コントロールの縁）
--line-hover: #6e7a84（hover時のコントロールの縁）
--field: #68727c（テキストフィールドの縁）
--accent: #526371、その上に #ffffff
状態。それぞれ 文字 / ティント / マーク: neutral #424b55 / #dfe5ea / #6f7b86; positive #116329 / #dcf0e2 / #1a7f37; caution #7a4c00 / #fbeccb / #9a6700、罫線 #dbbb6c; critical #a40e26 / #fbe2e5 / #cf222e; info マーク #0969da。

COLOUR:
- 強調色は、基本ボタン、製品マーク、アバター、完了したステップの点（それらをつなぐ2pxの線を含む）を塗る。フィルタートークンとフォーカスリングの縁を描き、選択中の行に3pxの内側の縁を付ける。基本ボタンにhoverするとinkになる。
- 状態の色は意味がある場所にだけ使う。cautionは自分の承認を待つ項目と、発注書と異なる明細や照合セルに使う。criticalは遅延、異議申し立て、異議申し立ての操作、エラーに使う。positiveは承認と支払い済みに使う。
- 月の積み上げバーは4つの系列を使う。支払い済みはpositiveマーク、承認済みはinfoマーク、承認待ちはcautionマーク、異議ありはcritical文字色とし、系列の間は2pxの隙間を空け、凡例に各金額を書く。強調のスレートは系列の色ではなく、ほかの色の横ではグレーに見える。
- 本文はinkまたはmutedを使う。mutedはすべての面で4.5:1以上のコントラストを保つ。グラデーションとドロップシャドウは使わない。ボックスの影は、3pxの内側の縁と、現在のステップの点の周りの4pxのcaution halo のみ許す。

TYPOGRAPHY:
Inter一種類を400、500、600で使う。標準のグリフをそのまま使い、stylistic setは使わない。すべての金額はtabular figuresとスラッシュ付きゼロを使い、ポンドの金額の列がそろうようにする。請求書番号はスラッシュ付きゼロとproportional figuresを使う。
H1：600、1.875rem、line-height 1.15、letter-spacing -0.024em（760px未満では1.625rem）。
H2、開いている請求書：600、1.25rem、line-height 1.25、letter-spacing -0.016em。H3と月のタイトル：600、1rem、letter-spacing -0.006em。
開いている金額：600、2.75rem、line-height 1、letter-spacing -0.035em（480px未満では2.25rem）。月の合計：600、1.75rem、letter-spacing -0.03em。
本文は1rem、line-height 1.5。取引先名は500。メタテキスト（日付、参照番号、件数、列見出し、項目のラベル、値の下のメモ）は0.875rem。グループ見出しは600、0.875rem。製品名は600、1.0625rem。会社名とログインしている人の名前は0.9375rem。
ライブラリのコントロールは固有のサイズを保つ。ボタンは500、0.875rem。セグメントの選択肢は500、0.8125rem。フィールドのラベルは0.8125rem。ステータスバッジは500、0.75rem。件数のチップ、ショートカットのヒント、アバターのイニシャルは0.75rem。すべて大文字やletter-spacingを広げたラベルは使わない。

LAYOUT:
- 1pxの罫線のあるアプリバー：製品マークと名前、会社、「/」のショートカットヒントを持つ検索フィールド、ログインしている人。
- ヘッダー：左にH1と支払い回の日付を含む1文。右に月の要約ボックス（12pxの角丸、1px #7a848e の縁）。タイトル、請求書の件数、合計、10pxの積み上げバー、凡例を入れる。
- 5:7の分割ビュー。左が一覧、右が開いている請求書。各側は枠で囲む：16pxの角丸を持つ4px #edf2f4 のシェル、シェル上にコントロールを置くヘッダー行、その中に1px #7a848e の縁と12pxの角丸を持つ白いパネル。1280x800のノートPCの画面で、ヘッダー、一覧の最初のグループ、開いている請求書の金額と操作がすべて最初の画面に見えること。
- 1080px未満では分割が縦に積まれる（一覧が先）。行を選ぶとフォーカスが請求書へ移る。760px未満では検索が自分の行を取り、属性は2列になり、照合の帯は縦に積まれ、明細は数量と単価を別の列ではなく品目の下に表示する。

COMPONENTS:
- 一覧のヘッダー：セグメントコントロール（自分の、チーム。それぞれ件数付き）、取り除けるフィルタートークン（「11月30日まで期限」、6pxの角丸。取り除くと追加ボタンに変わる）、件数の行（「請求書38件中11件、£50,159.14」）。
- グループは次の順：内 承認待ち、他の人の承認待ち、木曜日の支払い回、異議あり。各見出しは内側の帯の上にある折りたたみ可能なボタンで、件数チップとグループの合計を持つ。行はボタンである。1行目に取引先と金額、その下に参照番号と期限日、末尾にステータスバッジを置く。選択中の行にはaria-currentを付ける。遅延している行が先で、その後は金額の大きい順。
- 空の状態はライブラリのcompactな空状態を使う：32pxの丸いアイコン、タイトル、1文、ある場合はその下にアクション。異議ありのグループには、今年解決した異議申し立てを表示する。
- 開いている請求書：取引先とバッジをH2とし、自分の承認待ちの請求書へのページャーを置く。その後に1pxの罫線で区切られたブロックを置く。金額と期限日には、承認（基本）と異議申し立て（枠線、critical文字色）を付ける。属性（請求書、発注書、費用センター、支払い条件、振込先、原本）。8pxの枠に入った3つのセルの帯：3者照合（発注、入荷、請求）、または発注書がない場合は見積もり、リース契約、料金表、前回の請求書と照合した結果。注文と異なるセルにはcautionのティントを付ける。明細は表にし、異なる行はティントして3pxのcaution縁を付け、その後に合計を置く。承認の経緯は順序付きリストにし、完了（強調色）、現在（cautionのリング）、これから（空洞の点）で示す。
- 承認を押すと、請求書は木曜日の支払い回へ移り、件数、合計、月のバーが更新され、取り消しのあるpositiveアラートが表示されて変更が通知される。異議申し立てを押すと、数語以上の理由を求めるテキストエリアが開く。送信すると、請求書は異議ありのグループへ移り、理由が経緯に引用され、取り下げボタンのあるcautionアラートが表示される。
- 角丸：4pxの小さなブロック、6pxのトークンと製品マーク、8pxのコントロールと照合の帯、12pxのパネルとアラート、16pxのシェル。カプセル型はバッジと月のバーだけ。円はアバター、ステップの点、空状態のアイコンだけ。

MOTION:
- コントロールと行の色変化は120ms、グループのシェブロンの回転は120ms、ボタンは押すと98%まで縮む。ライブラリのセグメントのthumbはクリック時に200msかけてスライドする。新しいバッジ、空状態、フィールドエラーは200msかけてフェードインする。自ら動くものはない。prefers-reduced-motionではこれらすべての動きを取り除く。

FORBIDDEN:
- グリッド状のカード、ガラス効果、ぼかし、グロー、グラデーション、ドロップシャドウ
- 見出しの上の小さなラベル、すべて大文字で字間を広げたラベル、番号付きのセクションマーカー
- 彩度の高いブランド色、強調色の文字、意味のない色
- 大きな数字のタイルのダッシュボード、値のないグラフ、装飾的なアイコンやイラスト、絵文字
- リンクの矢印、中黒でつないだメタ文字列、何もしないコントロール
- 落ち着き、明快さ、スタイルそのものについての文言

OUTPUT:
1) 上記トークンのCSSカスタムプロパティ
2) セマンティックHTML：自分の、チームのためのradiogroup、グループには見出しの中のボタン、行にはボタン、属性にはdescription list、明細にはtable、承認の経緯にはordered list
3) 動作する表示の切り替え、フィルタートークン、空状態のある検索、行の選択、ページャー、取り消しのある承認、エラー状態と成功状態のある異議申し立てフォーム
4) 320pxまでのレスポンシブなレイアウト。横スクロールなし、何も切れない。スマートフォンでは全コントロールの高さを44px
5) すべてのコントロールに見えるフォーカス、変更を伝えるpolite live region、reduced-motion対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

interface Step {
  state: 'done' | 'now' | 'later';
  tone?: 'bad';
  title: string;
  when: string;
  at?: string;
  body?: string;
  note?: { text: string; by: string };
}

export function PortedQuietUtilityPage({ lang }: PortedStylePageProps) {
  const [live, setLive] = useState<Record<string, Live>>(INITIAL);
  const [view, setView] = useState<View>('team');
  const [dueOnly, setDueOnly] = useState(true);
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState('kettering');
  const [shut, setShut] = useState<Partial<Record<Stage, boolean>>>({});
  const [draft, setDraft] = useState<{ text: string; error: string } | null>(null);
  const [settledOpen, setSettledOpen] = useState(false);
  const [news, setNews] = useState({ text: '', n: 0 });
  const focusNext = useRef<FocusTarget | null>(null);
  const searchTimer = useRef(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const outcomeRef = useRef<HTMLDivElement>(null);
  const approveRef = useRef<HTMLButtonElement>(null);
  const disputeRef = useRef<HTMLButtonElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const addDueRef = useRef<HTMLButtonElement>(null);
  const removeDueRef = useRef<HTMLButtonElement>(null);

  const t = (text: Tri) => text[lang];
  const dayLong = (iso: string) => formatDate(iso, lang, { weekday: 'long', day: 'numeric', month: 'long' });
  const dayShort = (iso: string) => formatDate(iso, lang, { day: 'numeric', month: 'short' });
  const stamp = (iso: string) => fill(t(TRAIL.stamp), { day: formatDate(iso, lang, { weekday: 'short', day: 'numeric', month: 'short' }), time: iso.slice(11, 16) });

  // Focus follows the control that replaced the one that had it, once the new one is on the page.
  useEffect(() => {
    const target = focusNext.current;
    if (!target) return;
    focusNext.current = null;
    const element = {
      heading: headingRef,
      outcome: outcomeRef,
      approve: approveRef,
      dispute: disputeRef,
      reason: reasonRef,
      search: searchRef,
      addDue: addDueRef,
      removeDue: removeDueRef,
    }[target].current;
    element?.focus();
    if (target === 'heading') element?.scrollIntoView({ block: 'start' });
  });

  // "/" goes to the search field from anywhere outside a text field.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented) return;
      const target = event.target as Element | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const timer = searchTimer;
    return () => window.clearTimeout(timer.current);
  }, []);

  const announce = (text: string) => setNews((previous) => ({ text, n: previous.n + 1 }));
  const countNews = (rows: Invoice[]) => fill(t(rows.length === 1 ? NEWS.countOne : NEWS.countMany), { n: rows.length, sum: money(sumOf(rows)) });

  const rows = visibleRows(live, view, dueOnly, query);
  const mineCount = visibleRows(live, 'mine', dueOnly, query).length;
  const teamCount = visibleRows(live, 'team', dueOnly, query).length;
  const searching = query.trim() !== '';
  const elsewhere = searching ? visibleRows(live, 'team', false, query).length - rows.length : 0;

  const open = BY_KEY[openKey];
  const openLive = live[open.key];
  const amounts = AMOUNTS[open.key];
  const waitingList = rows.filter((invoice) => live[invoice.key].stage === 'you');
  const place = waitingList.findIndex((invoice) => invoice.key === open.key);
  const previous = place >= 0 ? waitingList[place - 1] : waitingList[waitingList.length - 1];
  const next = place >= 0 ? waitingList[place + 1] : waitingList[0];

  const sumWhere = (stages: Stage[]) => sumOf(INVOICES.filter((invoice) => stages.includes(live[invoice.key].stage)));
  const month = { paid: PAID_PENCE, approved: sumWhere(['run']), waiting: sumWhere(['you', 'others']), disputed: sumWhere(['disputed']) };
  const monthTotal = month.paid + month.approved + month.waiting + month.disputed;
  const segments = [
    { id: 'paid', label: MONTH.paid, pence: month.paid },
    { id: 'approved', label: MONTH.approved, pence: month.approved },
    { id: 'waiting', label: MONTH.waiting, pence: month.waiting },
    { id: 'disputed', label: MONTH.disputed, pence: month.disputed },
  ] as const;

  const badgeOf = (invoice: Invoice, state: Live): { tone: StatusTone; label: string } => {
    const late = lateBy(invoice, state.stage);
    if (state.stage === 'disputed') return { tone: 'critical', label: t(BADGE.disputed) };
    if (state.stage === 'run') return { tone: 'positive', label: t(BADGE.run) };
    if (late > 0) return { tone: 'critical', label: late === 1 ? t(BADGE.lateOne) : fill(t(BADGE.lateMany), { n: late }) };
    if (state.stage === 'you') return { tone: 'caution', label: t(BADGE.you) };
    return { tone: 'neutral', label: fill(t(BADGE.with), { name: PEOPLE[invoice.holder ?? 'dev'].first }) };
  };

  const waitingFor = (iso: string) => {
    const n = daysBetween(iso, TODAY);
    return n <= 0 ? t(TRAIL.waitingToday) : n === 1 ? t(TRAIL.waitingOne) : fill(t(TRAIL.waitingMany), { n });
  };

  const trailOf = (invoice: Invoice, state: Live): Step[] => {
    const paid: Step = {
      state: 'later',
      title: t(TRAIL.paid),
      when: formatDate(RUN_DAY, lang, { weekday: 'short', day: 'numeric', month: 'short' }),
      at: RUN_DAY,
      body: fill(t(TRAIL.paidBody), { date: dayLong('2026-11-27') }),
    };
    const steps: Step[] = [
      { state: 'done', title: t(TRAIL.received), when: stamp(invoice.received), at: invoice.received, body: fill(t(TRAIL.receivedBody), { inbox: INBOX, supplier: invoice.supplier }) },
      { state: 'done', title: t(invoice.checked.title), when: stamp(invoice.received), at: invoice.received, body: t(invoice.checked.body) },
      ...invoice.approvals.map((approval): Step => {
        const person = PEOPLE[approval.by];
        return approval.by === 'maya'
          ? { state: 'done', title: t(TRAIL.approvedYou), when: stamp(approval.at), at: approval.at, body: invoice.reason ? t(invoice.reason) : undefined }
          : {
              state: 'done',
              title: fill(t(TRAIL.approvedBy), { name: person.name, role: t(person.role) }),
              when: stamp(approval.at),
              at: approval.at,
              body: fill(t(TRAIL.ownerBody), { centre: t(invoice.centre) }),
              note: approval.note ? { text: t(approval.note), by: person.name } : undefined,
            };
      }),
    ];
    if (state.stage === 'you') {
      steps.push({ state: 'now', title: t(TRAIL.yours), when: waitingFor(invoice.waiting ?? TODAY), body: invoice.reason ? t(invoice.reason) : undefined }, paid);
    } else if (state.stage === 'others') {
      const person = PEOPLE[invoice.holder ?? 'dev'];
      steps.push({ state: 'now', title: fill(t(TRAIL.withOther), { name: person.name, role: t(person.role) }), when: waitingFor(invoice.waiting ?? TODAY), body: invoice.reason ? t(invoice.reason) : undefined }, paid);
    } else if (state.stage === 'run') {
      if (state.byMe) steps.push({ state: 'done', title: t(TRAIL.approvedYou), when: stamp(NOW), at: NOW, body: invoice.reason ? t(invoice.reason) : undefined });
      steps.push(paid);
    } else {
      steps.push(
        { state: 'done', tone: 'bad', title: t(TRAIL.disputed), when: stamp(NOW), at: NOW, note: { text: state.reason ?? '', by: USER.name } },
        { state: 'now', title: fill(t(TRAIL.credit), { supplier: invoice.supplier }), when: t(TRAIL.waitingToday), body: fill(t(TRAIL.creditBody), { email: invoice.email }) },
      );
    }
    return steps;
  };

  const show = (key: string, from: 'row' | 'pager') => {
    const invoice = BY_KEY[key];
    setOpenKey(key);
    setDraft(null);
    // In one column the invoice sits under the whole queue, so the reader is taken to it.
    if (from === 'row' && window.matchMedia('(max-width: 1079px)').matches) focusNext.current = 'heading';
    else announce(fill(t(NEWS.showing), { supplier: invoice.supplier, ref: invoice.ref }));
  };

  const changeView = (value: View) => {
    setView(value);
    announce(countNews(visibleRows(live, value, dueOnly, query)));
  };

  const setDue = (on: boolean) => {
    setDueOnly(on);
    focusNext.current = on ? 'removeDue' : 'addDue';
    announce(`${t(on ? NEWS.filterOn : NEWS.filterOff)} ${countNews(visibleRows(live, view, on, query))}`);
  };

  const search = (value: string) => {
    setQuery(value);
    window.clearTimeout(searchTimer.current);
    // Read the count once typing pauses, not on every key.
    searchTimer.current = window.setTimeout(() => announce(countNews(visibleRows(live, view, dueOnly, value))), 700);
  };

  const clearSearch = () => {
    window.clearTimeout(searchTimer.current);
    setQuery('');
    focusNext.current = 'search';
    announce(countNews(visibleRows(live, view, dueOnly, '')));
  };

  const update = (key: string, next: Live, group: Stage) => {
    setLive((current) => ({ ...current, [key]: next }));
    setShut((current) => ({ ...current, [group]: false }));
  };

  const approve = () => {
    update(open.key, { stage: 'run', byMe: true }, 'run');
    focusNext.current = 'outcome';
    announce(fill(t(NEWS.approved), { supplier: open.supplier, ref: open.ref }));
  };

  const reopen = (message: Tri) => {
    update(open.key, { stage: 'you' }, 'you');
    focusNext.current = 'approve';
    announce(fill(t(message), { ref: open.ref }));
  };

  const startDispute = () => {
    setDraft({ text: '', error: '' });
    focusNext.current = 'reason';
  };

  const cancelDispute = () => {
    setDraft(null);
    focusNext.current = 'dispute';
  };

  const submitDispute = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    const text = draft.text.trim();
    const error = text === '' ? t(DISPUTE.empty) : text.length < 12 ? t(DISPUTE.short) : '';
    if (error) {
      setDraft({ ...draft, error });
      focusNext.current = 'reason';
      return;
    }
    update(open.key, { stage: 'disputed', reason: text }, 'disputed');
    setDraft(null);
    focusNext.current = 'outcome';
    announce(fill(t(NEWS.disputed), { supplier: open.supplier, ref: open.ref }));
  };

  const dueLine = (invoice: Invoice) => {
    const n = daysBetween(TODAY, invoice.due);
    const date = dayLong(invoice.due);
    if (n > 1) return fill(t(DETAIL.dueIn), { date, n });
    if (n === 1) return fill(t(DETAIL.dueTomorrow), { date });
    if (n === 0) return fill(t(DETAIL.dueToday), { date });
    return n === -1 ? fill(t(DETAIL.wasDueOne), { date }) : fill(t(DETAIL.wasDueMany), { date, n: -n });
  };

  const runNote = (invoice: Invoice) => {
    const n = daysBetween(RUN_DAY, invoice.due);
    if (n > 1) return fill(t(DETAIL.earlyMany), { n });
    if (n === 1) return t(DETAIL.earlyOne);
    if (n === 0) return t(DETAIL.onTime);
    return n === -1 ? t(DETAIL.afterOne) : fill(t(DETAIL.afterMany), { n: -n });
  };

  const openBadge = badgeOf(open, openLive);
  const lastApproval = open.approvals[open.approvals.length - 1];
  const holder = PEOPLE[open.holder ?? 'dev'];

  const groupEmpty = (id: Stage) => {
    if (id === 'you') {
      return <EmptyState compact className="lg-empty" icon={<Icon name="check" />} title={t(dueOnly ? EMPTY.youTitleDue : EMPTY.youTitle)} description={t(EMPTY.youText)} />;
    }
    return (
      <div className="lg-empty-wrap">
        <EmptyState
          compact
          className="lg-empty"
          icon={<Icon name="flag" />}
          title={t(dueOnly ? EMPTY.disputedTitleDue : EMPTY.disputedTitle)}
          description={t(EMPTY.disputedText)}
          actions={
            <Button aria-expanded={settledOpen} aria-controls="lg-settled" onClick={() => setSettledOpen(!settledOpen)}>
              {t(EMPTY.settled)}
            </Button>
          }
        />
        <ul className="lg-settled" id="lg-settled" aria-label={t(EMPTY.settledList)} hidden={!settledOpen}>
          {SETTLED.map((item) => (
            <li key={item.ref}>
              <span className="lg-settled__who">{item.supplier}</span>
              <span className="lg-settled__amt lg-num">{money(item.amount)}</span>
              <span className="lg-settled__meta">
                <span className="lg-id">{item.ref}</span>
                <span>{fill(t(EMPTY.credit), { ref: item.credit })}</span>
                <span>{fill(t(EMPTY.settledOn), { date: dayShort(item.on) })}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const groups = GROUPS.map((group) => ({ ...group, items: rows.filter((invoice) => live[invoice.key].stage === group.id) })).filter(
    (group) => (searching ? group.items.length > 0 : group.items.length > 0 || group.id === 'you' || group.id === 'disputed'),
  );

  return (
    <FusionShell
      fusionId="quiet-utility"
      lang={lang}
      tone="light"
      accent="#526371"
      prev={{ href: '/pages/swiss-poster.html', label: 'Swiss Poster' }}
      next={{ href: '/pages/platform-core.html', label: 'Platform Core' }}
      prompts={PROMPTS}
    >
      <div className="lg" data-theme="light">
        <p className="lg-sr" role="status">
          {news.text}
          {news.n % 2 ? ' ' : ''}
        </p>

        <header className="lg-top">
          <p className="lg-brand">
            <i aria-hidden="true" />
            Ledgerline
          </p>
          <p className="lg-org">{ORG}</p>
          <div className="lg-find">
            <SearchField
              ref={searchRef}
              className="lg-search"
              label={t(TOP.search)}
              placeholder={t(TOP.placeholder)}
              clearLabel={t(TOP.clear)}
              aria-keyshortcuts="/"
              value={query}
              onValueChange={search}
            />
            {query === '' ? (
              <kbd className="lg-kbd" aria-hidden="true">
                /
              </kbd>
            ) : null}
          </div>
          <p className="lg-me">
            <span className="lg-av" aria-hidden="true">
              {USER.initials}
            </span>
            <span className="lg-me__name">{USER.name}</span>
          </p>
        </header>

        <div className="lg-head">
          <div className="lg-head__intro">
            <h1>{t(HEAD.title)}</h1>
            <p>{compose(t(HEAD.lead), { org: ORG, run: <b>{dayLong(RUN_DAY).replace(/ (?=\S+$)/, '\u00a0')}</b> })}</p>
          </div>
          <section className="lg-month" aria-labelledby="lg-month-title">
            <div className="lg-month__row">
              <h2 id="lg-month-title">{t(MONTH.title)}</h2>
              <span className="lg-month__count">{fill(t(MONTH.count), { n: MONTH_COUNT })}</span>
              <b className="lg-month__total lg-num">{money(monthTotal)}</b>
            </div>
            <div
              className="lg-stack"
              role="img"
              aria-label={fill(t(MONTH.bar), { paid: money(month.paid), approved: money(month.approved), waiting: money(month.waiting), disputed: money(month.disputed) })}
            >
              {segments.map((segment) => (segment.pence > 0 ? <i key={segment.id} className={`lg-stack__part lg-tone--${segment.id}`} style={{ flexGrow: segment.pence }} /> : null))}
            </div>
            <ul className="lg-legend">
              {segments.map((segment) => (
                <li key={segment.id}>
                  <i className={`lg-sw lg-tone--${segment.id}`} aria-hidden="true" />
                  {t(segment.label)} <b className="lg-num">{money(segment.pence)}</b>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="lg-split">
          <section className="lg-shell lg-queue" aria-labelledby="lg-queue-title">
            <h2 className="lg-sr" id="lg-queue-title">
              {t(QUEUE.title)}
            </h2>
            <div className="lg-shell__head">
              <SegmentedControl
                className="lg-seg"
                size="sm"
                label={t(QUEUE.whose)}
                value={view}
                onValueChange={changeView}
                options={[
                  { value: 'mine', label: <>{t(QUEUE.mine)} <span className="lg-seg__n lg-num">{mineCount}</span></> },
                  { value: 'team', label: <>{t(QUEUE.team)} <span className="lg-seg__n lg-num">{teamCount}</span></> },
                ]}
              />
              {dueOnly ? (
                <span className="lg-token">
                  <span className="lg-token__key">{t(QUEUE.due)}</span>
                  {t(QUEUE.byLimit)}
                  <button ref={removeDueRef} type="button" className="lg-token__x" aria-label={t(QUEUE.removeDue)} onClick={() => setDue(false)}>
                    <Icon name="x" />
                  </button>
                </span>
              ) : (
                <Button ref={addDueRef} className="lg-add" variant="quiet" icon={<Icon name="plus" />} aria-label={t(QUEUE.addDueName)} onClick={() => setDue(true)}>
                  {t(QUEUE.addDue)}
                </Button>
              )}
              <p className="lg-count">
                {compose(t(QUEUE.count), { n: <b>{rows.length}</b>, total: MONTH_COUNT, sum: <span className="lg-num">{money(sumOf(rows))}</span> })}
              </p>
            </div>
            <div className="lg-panel">
              {searching && rows.length === 0 ? (
                <EmptyState
                  className="lg-empty lg-empty--search"
                  icon={<Icon name="search" />}
                  title={fill(t(EMPTY.searchTitle), { q: query.trim() })}
                  description={elsewhere > 0 ? (elsewhere === 1 ? t(EMPTY.searchElsewhereOne) : fill(t(EMPTY.searchElsewhereMany), { n: elsewhere })) : t(EMPTY.searchText)}
                  actions={<Button onClick={clearSearch}>{t(TOP.clear)}</Button>}
                />
              ) : (
                groups.map((group) => (
                  <div key={group.id} className="lg-grp">
                    <h3 className="lg-grp__head">
                      <button type="button" aria-expanded={!shut[group.id]} aria-controls={`lg-grp-${group.id}`} onClick={() => setShut({ ...shut, [group.id]: !shut[group.id] })}>
                        <Icon name="down" className="lg-grp__chev" />
                        <span className="lg-grp__name">{t(group.title)}</span>
                        <span className="lg-grp__n lg-num">{group.items.length}</span>
                        <span className="lg-grp__sum lg-num">{money(sumOf(group.items))}</span>
                      </button>
                    </h3>
                    <div id={`lg-grp-${group.id}`} hidden={shut[group.id]}>
                      {group.items.length > 0 ? (
                        <ul className="lg-list">
                          {group.items.map((invoice) => {
                            const badge = badgeOf(invoice, live[invoice.key]);
                            return (
                              <li key={invoice.key}>
                                <button type="button" className="lg-inv" aria-current={invoice.key === open.key ? 'true' : undefined} onClick={() => show(invoice.key, 'row')}>
                                  <span className="lg-inv__who">{invoice.supplier}</span>
                                  <span className="lg-inv__amt lg-num">{money(AMOUNTS[invoice.key].total)}</span>
                                  <span className="lg-inv__meta">
                                    <span className="lg-id">{invoice.ref}</span>
                                    <span className={lateBy(invoice, live[invoice.key].stage) > 0 ? 'lg-late' : undefined}>{fill(t(QUEUE.dueOn), { date: dayShort(invoice.due) })}</span>
                                  </span>
                                  <StatusBadge className="lg-inv__badge" tone={badge.tone}>
                                    {badge.label}
                                  </StatusBadge>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        groupEmpty(group.id)
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="lg-shell lg-detail" aria-labelledby="lg-inv-title">
            <div className="lg-shell__head">
              <h2 id="lg-inv-title" ref={headingRef} tabIndex={-1}>
                {open.supplier} <StatusBadge tone={openBadge.tone}>{openBadge.label}</StatusBadge>
              </h2>
              <div className="lg-pager">
                <span className="lg-pager__where">
                  {place >= 0 ? fill(t(DETAIL.place), { i: place + 1, n: waitingList.length }) : waitingList.length > 0 ? fill(t(DETAIL.count), { n: waitingList.length }) : t(DETAIL.none)}
                </span>
                <Button
                  className="lg-pager__btn"
                  aria-label={t(DETAIL.previous)}
                  icon={<Icon name="up" />}
                  aria-disabled={previous ? undefined : true}
                  onClick={() => (previous ? show(previous.key, 'pager') : undefined)}
                />
                <Button
                  className="lg-pager__btn"
                  aria-label={t(DETAIL.next)}
                  icon={<Icon name="down" />}
                  aria-disabled={next ? undefined : true}
                  onClick={() => (next ? show(next.key, 'pager') : undefined)}
                />
              </div>
            </div>

            <div className="lg-panel">
              <div className="lg-block lg-decide">
                <p className="lg-amount">
                  <b className="lg-num">{money(amounts.total)}</b>
                  <span>{open.vat > 0 ? fill(t(DETAIL.withVat), { vat: money(amounts.vat) }) : t(DETAIL.noVat)}</span>
                </p>
                <p className="lg-due">
                  {dueLine(open)}
                  {openLive.stage === 'you' ? <small>{runNote(open)}</small> : null}
                </p>

                {openLive.stage === 'you' && !draft ? (
                  <div className="lg-acts">
                    <Button ref={approveRef} variant="primary" icon={<Icon name="check" />} onClick={approve}>
                      {t(DETAIL.approve)}
                    </Button>
                    <Button ref={disputeRef} className="lg-dispute" icon={<Icon name="flag" />} onClick={startDispute}>
                      {t(DETAIL.dispute)}
                    </Button>
                  </div>
                ) : null}

                {openLive.stage === 'you' && draft ? (
                  <form className="lg-form" noValidate onSubmit={submitDispute}>
                    <TextArea
                      ref={reasonRef}
                      className="lg-reason"
                      label={t(DISPUTE.label)}
                      description={fill(t(DISPUTE.hint), { email: open.email })}
                      error={
                        draft.error ? (
                          <span key={draft.error} role="alert">
                            {draft.error}
                          </span>
                        ) : undefined
                      }
                      required
                      rows={3}
                      value={draft.text}
                      onValueChange={(text) => setDraft({ text, error: '' })}
                    />
                    <div className="lg-acts">
                      <Button type="submit" variant="critical" icon={<Icon name="flag" />}>
                        {t(DISPUTE.submit)}
                      </Button>
                      <Button variant="quiet" onClick={cancelDispute}>
                        {t(DISPUTE.cancel)}
                      </Button>
                    </div>
                  </form>
                ) : null}

                {openLive.stage === 'run' && openLive.byMe ? (
                  <div className="lg-outcome" ref={outcomeRef} tabIndex={-1}>
                    <Alert tone="positive" title={fill(t(DETAIL.approvedNow), { run: dayLong(RUN_DAY) })}>
                      <Button onClick={() => reopen(NEWS.undone)}>{t(DETAIL.undo)}</Button>
                    </Alert>
                  </div>
                ) : null}

                {openLive.stage === 'disputed' ? (
                  <div className="lg-outcome" ref={outcomeRef} tabIndex={-1}>
                    <Alert tone="caution" icon={<Icon name="flag" />} title={fill(t(DETAIL.disputedNow), { email: open.email })}>
                      <figure className="lg-said">
                        <figcaption>{t(DETAIL.yourReason)}</figcaption>
                        <blockquote>
                          <p>{openLive.reason}</p>
                        </blockquote>
                      </figure>
                      <Button onClick={() => reopen(NEWS.withdrawn)}>{t(DETAIL.withdraw)}</Button>
                    </Alert>
                  </div>
                ) : null}

                {openLive.stage === 'others' ? (
                  <p className="lg-state">{fill(t(DETAIL.withOther), { name: holder.name, role: t(holder.role), date: dayLong(open.waiting ?? TODAY) })}</p>
                ) : null}

                {openLive.stage === 'run' && !openLive.byMe && lastApproval ? (
                  <p className="lg-state lg-state--ok">
                    <Icon name="check" className="lg-state__mark" />
                    <span>
                      {lastApproval.by === 'maya'
                        ? fill(t(DETAIL.approvedByYou), { date: dayLong(lastApproval.at) })
                        : fill(t(DETAIL.approvedBy), { name: PEOPLE[lastApproval.by].name, date: dayLong(lastApproval.at) })}
                    </span>
                  </p>
                ) : null}
              </div>

              <div className="lg-block">
                <dl className="lg-props">
                  <div>
                    <dt>{t(PROPS.invoice)}</dt>
                    <dd>
                      <span className="lg-id">{open.ref}</span>
                      <small>{fill(t(PROPS.dated), { date: formatDate(open.dated, lang, { day: 'numeric', month: 'short', year: 'numeric' }) })}</small>
                    </dd>
                  </div>
                  <div>
                    <dt>{t(PROPS.po)}</dt>
                    <dd>
                      {open.po ? <span className="lg-id">{open.po.ref}</span> : t(PROPS.none)}
                      <small>{open.po ? fill(t(PROPS.raised), { name: PEOPLE[open.po.by].name }) : open.noPo ? t(open.noPo) : null}</small>
                    </dd>
                  </div>
                  <div>
                    <dt>{t(PROPS.centre)}</dt>
                    <dd>{t(open.centre)}</dd>
                  </div>
                  <div>
                    <dt>{t(PROPS.terms)}</dt>
                    <dd>{t(open.terms)}</dd>
                  </div>
                  <div>
                    <dt>{t(PROPS.payTo)}</dt>
                    <dd>
                      {compose(t(PROPS.account), { n: <span className="lg-num">{open.account}</span> })}
                      <small>{fill(t(PROPS.unchanged), { when: t(open.since) })}</small>
                    </dd>
                  </div>
                  <div>
                    <dt>{t(PROPS.original)}</dt>
                    <dd>
                      <span className="lg-file">
                        <Icon name="file" />
                        <span className="lg-id">{open.ref}.pdf</span>
                      </span>
                      <small>{open.pages === 1 ? t(PROPS.pageOne) : fill(t(PROPS.pageMany), { n: open.pages })}</small>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="lg-block">
                <h3>{t(open.check.title)}</h3>
                <dl className="lg-match">
                  {open.check.cells.map((cell) => (
                    <div key={cell.label.en} className={cell.flag ? 'is-flag' : undefined}>
                      <dt>
                        <Icon name={cell.flag === 'short' ? 'alert' : 'check'} />
                        {t(cell.label)}
                      </dt>
                      <dd>
                        <b>{typeof cell.value === 'number' ? <span className="lg-num">{money(pence(cell.value))}</span> : t(cell.value)}</b>
                        <span>{t(cell.note)}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="lg-block">
                <h3 id="lg-lines-title">{t(LINES.title)}</h3>
                <table className="lg-lines" aria-labelledby="lg-lines-title">
                  <thead>
                    <tr>
                      <th scope="col">{t(LINES.item)}</th>
                      <th scope="col" className="lg-r lg-wide">
                        {t(LINES.qty)}
                      </th>
                      <th scope="col" className="lg-r lg-wide">
                        {t(LINES.unit)}
                      </th>
                      <th scope="col" className="lg-r">
                        {t(LINES.amount)}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {open.lines.map((line) => {
                      const note = line.was !== undefined ? fill(t(LINES.was), { price: money(pence(line.was)) }) : line.got !== undefined ? fill(t(LINES.short), { n: COUNT.format(line.qty - line.got) }) : '';
                      return (
                        <tr key={line.item.en} className={note ? 'is-flag' : undefined}>
                          <td>
                            {t(line.item)}
                            <small className="lg-lines__qty lg-num">
                              {COUNT.format(line.qty)} × {money(pence(line.unit))}
                            </small>
                            {note ? <small className="lg-lines__note">{note}</small> : null}
                          </td>
                          <td className="lg-r lg-wide lg-num">{COUNT.format(line.qty)}</td>
                          <td className="lg-r lg-wide lg-num">{money(pence(line.unit))}</td>
                          <td className="lg-r lg-num">{money(Math.round(line.qty * line.unit * 100))}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <dl className="lg-totals">
                  <dt>{t(LINES.net)}</dt>
                  <dd className="lg-num">{money(amounts.net)}</dd>
                  <dt>{fill(t(LINES.vat), { rate: Math.round(open.vat * 100) })}</dt>
                  <dd className="lg-num">{money(amounts.vat)}</dd>
                  <dt className="lg-totals__t">{t(LINES.total)}</dt>
                  <dd className="lg-totals__t lg-num">{money(amounts.total)}</dd>
                </dl>
              </div>

              <div className="lg-block">
                <h3>{t(TRAIL.title)}</h3>
                <ol className="lg-trail">
                  {trailOf(open, openLive).map((step) => (
                    <li key={`${step.title}-${step.when}`} className={`lg-step is-${step.state}${step.tone ? ' is-bad' : ''}`} aria-current={step.state === 'now' ? 'step' : undefined}>
                      <span className="lg-step__dot" aria-hidden="true">
                        {step.state === 'done' ? <Icon name={step.tone ? 'flag' : 'check'} /> : null}
                      </span>
                      <div className="lg-step__body">
                        <p className="lg-step__top">
                          <span className="lg-step__title">{step.title}</span>
                          {step.at ? <time dateTime={step.at}>{step.when}</time> : <span className="lg-step__when">{step.when}</span>}
                        </p>
                        {step.body ? <p className="lg-step__text">{step.body}</p> : null}
                        {step.note ? (
                          <blockquote className="lg-note">
                            <p>{step.note.text}</p>
                            <footer>{step.note.by}</footer>
                          </blockquote>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        </div>
      </div>
    </FusionShell>
  );
}
