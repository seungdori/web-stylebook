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
  maya: { name: 'Maya Okafor', first: 'Maya', role: { en: 'finance lead', ko: 'finance lead', ja: 'finance lead' } },
  dev: { name: 'Dev Mistry', first: 'Dev', role: { en: 'production lead', ko: 'production lead', ja: 'production lead' } },
  lena: { name: 'Lena Hart', first: 'Lena', role: { en: 'operations manager', ko: 'operations manager', ja: 'operations manager' } },
  jonas: { name: 'Jonas Byrne', first: 'Jonas', role: { en: 'office manager', ko: 'office manager', ja: 'office manager' } },
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
  three: { en: 'Three-way match', ko: 'Three-way match', ja: 'Three-way match' },
  ordered: { en: 'Ordered', ko: 'Ordered', ja: 'Ordered' },
  received: { en: 'Received', ko: 'Received', ja: 'Received' },
  invoiced: { en: 'Invoiced', ko: 'Invoiced', ja: 'Invoiced' },
  same: { en: 'the same as the order', ko: 'the same as the order', ja: 'the same as the order' },
  sameBody: { en: 'The same as the order and the delivery.', ko: 'The same as the order and the delivery.', ja: 'The same as the order and the delivery.' },
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
    centre: { en: 'Frames production', ko: 'Frames production', ja: 'Frames production' },
    terms: { en: '14 days from receipt', ko: '14 days from receipt', ja: '14 days from receipt' },
    account: '4471',
    since: { en: 'March 2024', ko: 'March 2024', ja: 'March 2024' },
    po: { ref: 'PO-3311', by: 'dev', on: '2026-11-02' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 15320, note: { en: 'net on PO-3311, 2 Nov', ko: 'net on PO-3311, 2 Nov', ja: 'net on PO-3311, 2 Nov' } },
        { label: MATCH.received, value: { en: '3 of 3 items', ko: '3 of 3 items', ja: '3 of 3 items' }, note: { en: 'GRN-0907, booked in 11 Nov', ko: 'GRN-0907, booked in 11 Nov', ja: 'GRN-0907, booked in 11 Nov' } },
        {
          label: MATCH.invoiced,
          value: 15350,
          note: { en: '£30.00 over the order, inside the £50 tolerance', ko: '£30.00 over the order, inside the £50 tolerance', ja: '£30.00 over the order, inside the £50 tolerance' },
          flag: 'over',
        },
      ],
    },
    checked: {
      title: { en: 'Matched to PO-3311 and GRN-0907', ko: 'Matched to PO-3311 and GRN-0907', ja: 'Matched to PO-3311 and GRN-0907' },
      body: { en: 'Delivery is £30.00 over the order, inside the £50 tolerance.', ko: 'Delivery is £30.00 over the order, inside the £50 tolerance.', ja: 'Delivery is £30.00 over the order, inside the £50 tolerance.' },
    },
    lines: [
      { item: { en: '4130 tube set, 54–58 cm', ko: '4130 tube set, 54–58 cm', ja: '4130 tube set, 54–58 cm' }, qty: 40, unit: 312 },
      { item: { en: 'Chainstays, 22.2 mm, pairs', ko: 'Chainstays, 22.2 mm, pairs', ja: 'Chainstays, 22.2 mm, pairs' }, qty: 80, unit: 24.5 },
      { item: { en: 'Seat stays, 16 mm, pairs', ko: 'Seat stays, 16 mm, pairs', ja: 'Seat stays, 16 mm, pairs' }, qty: 80, unit: 9.5 },
      { item: { en: 'Pallet delivery to Sheffield', ko: 'Pallet delivery to Sheffield', ja: 'Pallet delivery to Sheffield' }, qty: 1, unit: 150, was: 120 },
    ],
    vat: 0.2,
    approvals: [
      {
        by: 'dev',
        at: '2026-11-16T16:40',
        note: {
          en: 'All 40 tube sets checked on arrival. The pallet rate went up in November, so the extra £30 is right.',
          ko: 'All 40 tube sets checked on arrival. The pallet rate went up in November, so the extra £30 is right.',
          ja: 'All 40 tube sets checked on arrival. The pallet rate went up in November, so the extra £30 is right.',
        },
      },
    ],
    stage: 'you',
    mine: true,
    reason: { en: 'Invoices over £10,000 need the finance lead after the budget owner.', ko: 'Invoices over £10,000 need the finance lead after the budget owner.', ja: 'Invoices over £10,000 need the finance lead after the budget owner.' },
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
    centre: { en: 'Wheel building', ko: 'Wheel building', ja: 'Wheel building' },
    terms: { en: '15 days from invoice', ko: '15 days from invoice', ja: '15 days from invoice' },
    account: '0932',
    since: { en: 'January 2025', ko: 'January 2025', ja: 'January 2025' },
    po: { ref: 'PO-3296', by: 'dev', on: '2026-10-28' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 5260.5, note: { en: 'net on PO-3296, 28 Oct', ko: 'net on PO-3296, 28 Oct', ja: 'net on PO-3296, 28 Oct' } },
        {
          label: MATCH.received,
          value: { en: '140 of 150 tyres', ko: '140 of 150 tyres', ja: '140 of 150 tyres' },
          note: { en: 'GRN-0899, booked in 9 Nov', ko: 'GRN-0899, booked in 9 Nov', ja: 'GRN-0899, booked in 9 Nov' },
          flag: 'short',
        },
        {
          label: MATCH.invoiced,
          value: 5260.5,
          note: { en: '£284.00 more than was received', ko: '£284.00 more than was received', ja: '£284.00 more than was received' },
          flag: 'short',
        },
      ],
    },
    checked: {
      title: { en: 'Matched to PO-3296 and GRN-0899', ko: 'Matched to PO-3296 and GRN-0899', ja: 'Matched to PO-3296 and GRN-0899' },
      body: {
        en: '10 tyres are missing from GRN-0899, so it bills £284.00 more than was received.',
        ko: '10 tyres are missing from GRN-0899, so it bills £284.00 more than was received.',
        ja: '10 tyres are missing from GRN-0899, so it bills £284.00 more than was received.',
      },
    },
    lines: [
      { item: { en: 'Gravel tyres, 700 × 40c', ko: 'Gravel tyres, 700 × 40c', ja: 'Gravel tyres, 700 × 40c' }, qty: 150, unit: 28.4, got: 140 },
      { item: { en: 'Inner tubes, 700c Presta', ko: 'Inner tubes, 700c Presta', ja: 'Inner tubes, 700c Presta' }, qty: 250, unit: 3.8 },
      { item: { en: 'Carriage', ko: 'Carriage', ja: 'Carriage' }, qty: 1, unit: 50.5 },
    ],
    vat: 0.2,
    approvals: [],
    stage: 'you',
    mine: true,
    reason: {
      en: 'A difference over the £50 tolerance comes to the finance lead before the budget owner.',
      ko: 'A difference over the £50 tolerance comes to the finance lead before the budget owner.',
      ja: 'A difference over the £50 tolerance comes to the finance lead before the budget owner.',
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
    centre: { en: 'Inbound freight', ko: 'Inbound freight', ja: 'Inbound freight' },
    terms: { en: '14 days from invoice', ko: '14 days from invoice', ja: '14 days from invoice' },
    account: '6620',
    since: { en: 'June 2023', ko: 'June 2023', ja: 'June 2023' },
    noPo: { en: 'Freight is billed per job, against a quote.', ko: 'Freight is billed per job, against a quote.', ja: 'Freight is billed per job, against a quote.' },
    check: {
      title: { en: 'Checked against the quote', ko: 'Checked against the quote', ja: 'Checked against the quote' },
      cells: [
        { label: { en: 'Quoted', ko: 'Quoted', ja: 'Quoted' }, value: 1820.3, note: { en: 'net on BQ-1180, 30 Oct', ko: 'net on BQ-1180, 30 Oct', ja: 'net on BQ-1180, 30 Oct' } },
        {
          label: { en: 'Delivered', ko: 'Delivered', ja: 'Delivered' },
          value: { en: '2 containers', ko: '2 containers', ja: '2 containers' },
          note: { en: 'signed for on 6 and 9 Nov', ko: 'signed for on 6 and 9 Nov', ja: 'signed for on 6 and 9 Nov' },
        },
        { label: MATCH.invoiced, value: 1820.3, note: { en: 'the same as the quote', ko: 'the same as the quote', ja: 'the same as the quote' } },
      ],
    },
    checked: {
      title: { en: 'Checked against quote BQ-1180', ko: 'Checked against quote BQ-1180', ja: 'Checked against quote BQ-1180' },
      body: { en: 'Both containers were signed for, and it bills the quoted amount.', ko: 'Both containers were signed for, and it bills the quoted amount.', ja: 'Both containers were signed for, and it bills the quoted amount.' },
    },
    lines: [
      { item: { en: 'Container haulage, Felixstowe to Sheffield', ko: 'Container haulage, Felixstowe to Sheffield', ja: 'Container haulage, Felixstowe to Sheffield' }, qty: 2, unit: 845 },
      { item: { en: 'Port handling and customs entry', ko: 'Port handling and customs entry', ja: 'Port handling and customs entry' }, qty: 1, unit: 130.3 },
    ],
    vat: 0.2,
    approvals: [],
    stage: 'you',
    mine: true,
    reason: { en: 'You hold the budget for inbound freight.', ko: 'You hold the budget for inbound freight.', ja: 'You hold the budget for inbound freight.' },
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
    centre: { en: 'Finance and admin', ko: 'Finance and admin', ja: 'Finance and admin' },
    terms: { en: '14 days from invoice', ko: '14 days from invoice', ja: '14 days from invoice' },
    account: '2207',
    since: { en: 'April 2022', ko: 'April 2022', ja: 'April 2022' },
    noPo: { en: 'Billed under the engagement letter.', ko: 'Billed under the engagement letter.', ja: 'Billed under the engagement letter.' },
    check: {
      title: { en: 'Checked against the engagement letter', ko: 'Checked against the engagement letter', ja: 'Checked against the engagement letter' },
      cells: [
        { label: { en: 'Agreed fee', ko: 'Agreed fee', ja: 'Agreed fee' }, value: 4750, note: { en: 'for the 2026 audit, billed in two halves', ko: 'for the 2026 audit, billed in two halves', ja: 'for the 2026 audit, billed in two halves' } },
        { label: { en: 'Billed before', ko: 'Billed before', ja: 'Billed before' }, value: 2375, note: { en: 'HW-26-0219, paid 14 Aug', ko: 'HW-26-0219, paid 14 Aug', ja: 'HW-26-0219, paid 14 Aug' } },
        { label: MATCH.invoiced, value: 2375, note: { en: 'the second half, as agreed', ko: 'the second half, as agreed', ja: 'the second half, as agreed' } },
      ],
    },
    checked: {
      title: { en: 'Checked against the engagement letter', ko: 'Checked against the engagement letter', ja: 'Checked against the engagement letter' },
      body: { en: 'The second of two equal bills for the 2026 audit.', ko: 'The second of two equal bills for the 2026 audit.', ja: 'The second of two equal bills for the 2026 audit.' },
    },
    lines: [{ item: { en: 'Audit fee for 2026, second half', ko: 'Audit fee for 2026, second half', ja: 'Audit fee for 2026, second half' }, qty: 1, unit: 2375 }],
    vat: 0.2,
    approvals: [],
    stage: 'you',
    mine: true,
    reason: { en: 'You hold the budget for finance and admin.', ko: 'You hold the budget for finance and admin.', ja: 'You hold the budget for finance and admin.' },
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
    centre: { en: 'Outbound deliveries', ko: 'Outbound deliveries', ja: 'Outbound deliveries' },
    terms: { en: '14 days from invoice', ko: '14 days from invoice', ja: '14 days from invoice' },
    account: '5518',
    since: { en: 'May 2024', ko: 'May 2024', ja: 'May 2024' },
    noPo: { en: 'Billed against the rate card.', ko: 'Billed against the rate card.', ja: 'Billed against the rate card.' },
    check: {
      title: { en: 'Checked against the rate card', ko: 'Checked against the rate card', ja: 'Checked against the rate card' },
      cells: [
        { label: { en: 'Rate', ko: 'Rate', ja: 'Rate' }, value: 44.5, note: { en: 'a pallet, on the 2026 rate card', ko: 'a pallet, on the 2026 rate card', ja: 'a pallet, on the 2026 rate card' } },
        { label: { en: 'Sent', ko: 'Sent', ja: 'Sent' }, value: { en: '12 pallets', ko: '12 pallets', ja: '12 pallets' }, note: { en: 'in the October dispatch log', ko: 'in the October dispatch log', ja: 'in the October dispatch log' } },
        { label: MATCH.invoiced, value: 534, note: { en: '12 pallets at the card rate', ko: '12 pallets at the card rate', ja: '12 pallets at the card rate' } },
      ],
    },
    checked: {
      title: { en: 'Checked against the rate card', ko: 'Checked against the rate card', ja: 'Checked against the rate card' },
      body: { en: '12 pallets in the October dispatch log, at £44.50 each.', ko: '12 pallets in the October dispatch log, at £44.50 each.', ja: '12 pallets in the October dispatch log, at £44.50 each.' },
    },
    lines: [{ item: { en: 'Pallet deliveries in October', ko: 'Pallet deliveries in October', ja: 'Pallet deliveries in October' }, qty: 12, unit: 44.5 }],
    vat: 0.2,
    approvals: [],
    stage: 'others',
    mine: false,
    holder: 'lena',
    reason: { en: 'Lena approves outbound delivery invoices as budget owner.', ko: 'Lena approves outbound delivery invoices as budget owner.', ja: 'Lena approves outbound delivery invoices as budget owner.' },
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
    centre: { en: 'Premises', ko: 'Premises', ja: 'Premises' },
    terms: { en: 'Due on the last day of the month', ko: 'Due on the last day of the month', ja: 'Due on the last day of the month' },
    account: '3090',
    since: { en: 'October 2021', ko: 'October 2021', ja: 'October 2021' },
    noPo: { en: 'Billed under the lease.', ko: 'Billed under the lease.', ja: 'Billed under the lease.' },
    check: {
      title: { en: 'Checked against the lease', ko: 'Checked against the lease', ja: 'Checked against the lease' },
      cells: [
        { label: { en: 'Lease', ko: 'Lease', ja: 'Lease' }, value: 8125, note: { en: 'a month for Unit 4, Attercliffe Works', ko: 'a month for Unit 4, Attercliffe Works', ja: 'a month for Unit 4, Attercliffe Works' } },
        { label: { en: 'Last month', ko: 'Last month', ja: 'Last month' }, value: 8125, note: { en: 'NB-1198, paid 30 Oct', ko: 'NB-1198, paid 30 Oct', ja: 'NB-1198, paid 30 Oct' } },
        { label: MATCH.invoiced, value: 8125, note: { en: 'the same as the lease', ko: 'the same as the lease', ja: 'the same as the lease' } },
      ],
    },
    checked: {
      title: { en: 'Checked against the lease', ko: 'Checked against the lease', ja: 'Checked against the lease' },
      body: { en: 'December rent for Unit 4, the same as every month this year.', ko: 'December rent for Unit 4, the same as every month this year.', ja: 'December rent for Unit 4, the same as every month this year.' },
    },
    lines: [{ item: { en: 'Rent for Unit 4, Attercliffe Works, December', ko: 'Rent for Unit 4, Attercliffe Works, December', ja: 'Rent for Unit 4, Attercliffe Works, December' }, qty: 1, unit: 8125 }],
    vat: 0.2,
    approvals: [],
    stage: 'others',
    mine: false,
    holder: 'lena',
    reason: { en: 'Lena approves premises invoices as budget owner.', ko: 'Lena approves premises invoices as budget owner.', ja: 'Lena approves premises invoices as budget owner.' },
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
    centre: { en: 'Wheel building', ko: 'Wheel building', ja: 'Wheel building' },
    terms: { en: '14 days from receipt', ko: '14 days from receipt', ja: '14 days from receipt' },
    account: '7745',
    since: { en: 'August 2023', ko: 'August 2023', ja: 'August 2023' },
    po: { ref: 'PO-3302', by: 'dev', on: '2026-10-30' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 4055, note: { en: 'net on PO-3302, 30 Oct', ko: 'net on PO-3302, 30 Oct', ja: 'net on PO-3302, 30 Oct' } },
        { label: MATCH.received, value: { en: '2 of 2 items', ko: '2 of 2 items', ja: '2 of 2 items' }, note: { en: 'GRN-0903, booked in 11 Nov', ko: 'GRN-0903, booked in 11 Nov', ja: 'GRN-0903, booked in 11 Nov' } },
        { label: MATCH.invoiced, value: 4055, note: MATCH.same },
      ],
    },
    checked: { title: { en: 'Matched to PO-3302 and GRN-0903', ko: 'Matched to PO-3302 and GRN-0903', ja: 'Matched to PO-3302 and GRN-0903' }, body: MATCH.sameBody },
    lines: [
      { item: { en: 'Rear hubs, 142 × 12 mm', ko: 'Rear hubs, 142 × 12 mm', ja: 'Rear hubs, 142 × 12 mm' }, qty: 60, unit: 48.5 },
      { item: { en: 'Front hubs, 100 × 12 mm', ko: 'Front hubs, 100 × 12 mm', ja: 'Front hubs, 100 × 12 mm' }, qty: 50, unit: 22.9 },
    ],
    vat: 0.2,
    approvals: [],
    stage: 'others',
    mine: false,
    holder: 'dev',
    reason: { en: 'Dev approves wheel building invoices as budget owner.', ko: 'Dev approves wheel building invoices as budget owner.', ja: 'Dev approves wheel building invoices as budget owner.' },
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
    centre: { en: 'Frames production', ko: 'Frames production', ja: 'Frames production' },
    terms: { en: '14 days from invoice', ko: '14 days from invoice', ja: '14 days from invoice' },
    account: '1186',
    since: { en: 'February 2025', ko: 'February 2025', ja: 'February 2025' },
    po: { ref: 'PO-3305', by: 'dev', on: '2026-11-03' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 2700, note: { en: 'net on PO-3305, 3 Nov', ko: 'net on PO-3305, 3 Nov', ja: 'net on PO-3305, 3 Nov' } },
        { label: MATCH.received, value: { en: '45 of 45 frames', ko: '45 of 45 frames', ja: '45 of 45 frames' }, note: { en: 'GRN-0905, booked in 12 Nov', ko: 'GRN-0905, booked in 12 Nov', ja: 'GRN-0905, booked in 12 Nov' } },
        { label: MATCH.invoiced, value: 2700, note: MATCH.same },
      ],
    },
    checked: { title: { en: 'Matched to PO-3305 and GRN-0905', ko: 'Matched to PO-3305 and GRN-0905', ja: 'Matched to PO-3305 and GRN-0905' }, body: MATCH.sameBody },
    lines: [
      { item: { en: 'Frame coating, gloss black', ko: 'Frame coating, gloss black', ja: 'Frame coating, gloss black' }, qty: 45, unit: 54 },
      { item: { en: 'Fork coating, gloss black', ko: 'Fork coating, gloss black', ja: 'Fork coating, gloss black' }, qty: 45, unit: 6 },
    ],
    vat: 0.2,
    approvals: [],
    stage: 'others',
    mine: false,
    holder: 'dev',
    reason: { en: 'Dev approves frames production invoices as budget owner.', ko: 'Dev approves frames production invoices as budget owner.', ja: 'Dev approves frames production invoices as budget owner.' },
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
    centre: { en: 'Utilities', ko: 'Utilities', ja: 'Utilities' },
    terms: { en: 'Pay by the date on the bill', ko: 'Pay by the date on the bill', ja: 'Pay by the date on the bill' },
    account: '0415',
    since: { en: 'October 2021', ko: 'October 2021', ja: 'October 2021' },
    noPo: { en: 'A quarterly bill for the works.', ko: 'A quarterly bill for the works.', ja: 'A quarterly bill for the works.' },
    check: {
      title: { en: 'Checked against the last bill', ko: 'Checked against the last bill', ja: 'Checked against the last bill' },
      cells: [
        { label: { en: 'Used', ko: 'Used', ja: 'Used' }, value: { en: '58 m³', ko: '58 m³', ja: '58 m³' }, note: { en: 'meter read on 31 Oct', ko: 'meter read on 31 Oct', ja: 'meter read on 31 Oct' } },
        { label: { en: 'Last quarter', ko: 'Last quarter', ja: 'Last quarter' }, value: 398.4, note: { en: '88207714, paid 26 Aug', ko: '88207714, paid 26 Aug', ja: '88207714, paid 26 Aug' } },
        { label: MATCH.invoiced, value: 412.18, note: { en: '£13.78 more, for 2 m³ more water', ko: '£13.78 more, for 2 m³ more water', ja: '£13.78 more, for 2 m³ more water' } },
      ],
    },
    checked: {
      title: { en: 'Checked against the last bill', ko: 'Checked against the last bill', ja: 'Checked against the last bill' },
      body: { en: '58 m³ this quarter against 56 m³ last quarter.', ko: '58 m³ this quarter against 56 m³ last quarter.', ja: '58 m³ this quarter against 56 m³ last quarter.' },
    },
    lines: [{ item: { en: 'Water and sewerage, 1 Aug to 31 Oct', ko: 'Water and sewerage, 1 Aug to 31 Oct', ja: 'Water and sewerage, 1 Aug to 31 Oct' }, qty: 1, unit: 412.18 }],
    vat: 0,
    approvals: [],
    stage: 'others',
    mine: false,
    holder: 'jonas',
    reason: { en: 'Jonas approves utility bills as budget owner.', ko: 'Jonas approves utility bills as budget owner.', ja: 'Jonas approves utility bills as budget owner.' },
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
    centre: { en: 'Quality', ko: 'Quality', ja: 'Quality' },
    terms: { en: '14 days from receipt', ko: '14 days from receipt', ja: '14 days from receipt' },
    account: '2964',
    since: { en: 'July 2024', ko: 'July 2024', ja: 'July 2024' },
    po: { ref: 'PO-3314', by: 'dev', on: '2026-11-05' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 777, note: { en: 'net on PO-3314, 5 Nov', ko: 'net on PO-3314, 5 Nov', ja: 'net on PO-3314, 5 Nov' } },
        { label: MATCH.received, value: { en: '6 of 6 gauges', ko: '6 of 6 gauges', ja: '6 of 6 gauges' }, note: { en: 'GRN-0911, booked in 18 Nov', ko: 'GRN-0911, booked in 18 Nov', ja: 'GRN-0911, booked in 18 Nov' } },
        { label: MATCH.invoiced, value: 777, note: MATCH.same },
      ],
    },
    checked: { title: { en: 'Matched to PO-3314 and GRN-0911', ko: 'Matched to PO-3314 and GRN-0911', ja: 'Matched to PO-3314 and GRN-0911' }, body: MATCH.sameBody },
    lines: [
      { item: { en: 'Thread gauges, M5 × 0.8', ko: 'Thread gauges, M5 × 0.8', ja: 'Thread gauges, M5 × 0.8' }, qty: 6, unit: 42.5 },
      { item: { en: 'Alignment table service', ko: 'Alignment table service', ja: 'Alignment table service' }, qty: 1, unit: 522 },
    ],
    vat: 0.2,
    approvals: [],
    stage: 'others',
    mine: false,
    holder: 'dev',
    reason: { en: 'Dev approves quality invoices as budget owner.', ko: 'Dev approves quality invoices as budget owner.', ja: 'Dev approves quality invoices as budget owner.' },
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
    centre: { en: 'Frames production', ko: 'Frames production', ja: 'Frames production' },
    terms: { en: '14 days from invoice', ko: '14 days from invoice', ja: '14 days from invoice' },
    account: '8823',
    since: { en: 'November 2022', ko: 'November 2022', ja: 'November 2022' },
    po: { ref: 'PO-3307', by: 'dev', on: '2026-11-04' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 2422, note: { en: 'net on PO-3307, 4 Nov', ko: 'net on PO-3307, 4 Nov', ja: 'net on PO-3307, 4 Nov' } },
        { label: MATCH.received, value: { en: '2 of 2 items', ko: '2 of 2 items', ja: '2 of 2 items' }, note: { en: 'GRN-0906, booked in 11 Nov', ko: 'GRN-0906, booked in 11 Nov', ja: 'GRN-0906, booked in 11 Nov' } },
        { label: MATCH.invoiced, value: 2422, note: MATCH.same },
      ],
    },
    checked: { title: { en: 'Matched to PO-3307 and GRN-0906', ko: 'Matched to PO-3307 and GRN-0906', ja: 'Matched to PO-3307 and GRN-0906' }, body: MATCH.sameBody },
    lines: [
      { item: { en: 'Bottle bosses, M5, stainless', ko: 'Bottle bosses, M5, stainless', ja: 'Bottle bosses, M5, stainless' }, qty: 4000, unit: 0.38 },
      { item: { en: 'Dropout hangers', ko: 'Dropout hangers', ja: 'Dropout hangers' }, qty: 220, unit: 4.1 },
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
    centre: { en: 'Warehouse', ko: 'Warehouse', ja: 'Warehouse' },
    terms: { en: 'Due by the end of the month', ko: 'Due by the end of the month', ja: 'Due by the end of the month' },
    account: '6051',
    since: { en: 'January 2026', ko: 'January 2026', ja: 'January 2026' },
    noPo: { en: 'A monthly subscription.', ko: 'A monthly subscription.', ja: 'A monthly subscription.' },
    check: {
      title: { en: 'Checked against the subscription', ko: 'Checked against the subscription', ja: 'Checked against the subscription' },
      cells: [
        { label: { en: 'Plan', ko: 'Plan', ja: 'Plan' }, value: { en: '25 seats', ko: '25 seats', ja: '25 seats' }, note: { en: 'at £34.60 a seat a month', ko: 'at £34.60 a seat a month', ja: 'at £34.60 a seat a month' } },
        { label: { en: 'Last month', ko: 'Last month', ja: 'Last month' }, value: 865, note: { en: 'TL-2026-10, paid 29 Oct', ko: 'TL-2026-10, paid 29 Oct', ja: 'TL-2026-10, paid 29 Oct' } },
        { label: MATCH.invoiced, value: 865, note: { en: 'the same as last month', ko: 'the same as last month', ja: 'the same as last month' } },
      ],
    },
    checked: {
      title: { en: 'Checked against the subscription', ko: 'Checked against the subscription', ja: 'Checked against the subscription' },
      body: { en: '25 seats, the same as last month.', ko: '25 seats, the same as last month.', ja: '25 seats, the same as last month.' },
    },
    lines: [{ item: { en: 'Stock tracking for December, seats', ko: 'Stock tracking for December, seats', ja: 'Stock tracking for December, seats' }, qty: 25, unit: 34.6 }],
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
    centre: { en: 'Office and marketing', ko: 'Office and marketing', ja: 'Office and marketing' },
    terms: { en: '14 days from invoice', ko: '14 days from invoice', ja: '14 days from invoice' },
    account: '4402',
    since: { en: 'March 2025', ko: 'March 2025', ja: 'March 2025' },
    po: { ref: 'PO-3309', by: 'jonas', on: '2026-11-05' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 324, note: { en: 'net on PO-3309, 5 Nov', ko: 'net on PO-3309, 5 Nov', ja: 'net on PO-3309, 5 Nov' } },
        { label: MATCH.received, value: { en: '300 of 300 copies', ko: '300 of 300 copies', ja: '300 of 300 copies' }, note: { en: 'GRN-0908, booked in 12 Nov', ko: 'GRN-0908, booked in 12 Nov', ja: 'GRN-0908, booked in 12 Nov' } },
        { label: MATCH.invoiced, value: 324, note: MATCH.same },
      ],
    },
    checked: { title: { en: 'Matched to PO-3309 and GRN-0908', ko: 'Matched to PO-3309 and GRN-0908', ja: 'Matched to PO-3309 and GRN-0908' }, body: MATCH.sameBody },
    lines: [{ item: { en: 'Spring catalogue, 300 copies', ko: 'Spring catalogue, 300 copies', ja: 'Spring catalogue, 300 copies' }, qty: 300, unit: 1.08 }],
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
    centre: { en: 'Wheel building', ko: 'Wheel building', ja: 'Wheel building' },
    terms: { en: '21 days from invoice', ko: '21 days from invoice', ja: '21 days from invoice' },
    account: '3377',
    since: { en: 'September 2024', ko: 'September 2024', ja: 'September 2024' },
    po: { ref: 'PO-3299', by: 'dev', on: '2026-10-29' },
    check: {
      title: MATCH.three,
      cells: [
        { label: MATCH.ordered, value: 15066, note: { en: 'net on PO-3299, 29 Oct', ko: 'net on PO-3299, 29 Oct', ja: 'net on PO-3299, 29 Oct' } },
        { label: MATCH.received, value: { en: '2 of 2 items', ko: '2 of 2 items', ja: '2 of 2 items' }, note: { en: 'GRN-0901, booked in 10 Nov', ko: 'GRN-0901, booked in 10 Nov', ja: 'GRN-0901, booked in 10 Nov' } },
        { label: MATCH.invoiced, value: 15066, note: MATCH.same },
      ],
    },
    checked: { title: { en: 'Matched to PO-3299 and GRN-0901', ko: 'Matched to PO-3299 and GRN-0901', ja: 'Matched to PO-3299 and GRN-0901' }, body: MATCH.sameBody },
    lines: [
      { item: { en: 'Rims, 700c, 28 hole', ko: 'Rims, 700c, 28 hole', ja: 'Rims, 700c, 28 hole' }, qty: 260, unit: 55.4 },
      { item: { en: 'Rim tape', ko: 'Rim tape', ja: 'Rim tape' }, qty: 260, unit: 1.8 },
      { item: { en: 'Carriage', ko: 'Carriage', ja: 'Carriage' }, qty: 1, unit: 194 },
    ],
    vat: 0.2,
    approvals: [
      { by: 'dev', at: '2026-11-12T10:15' },
      { by: 'maya', at: '2026-11-17T15:02' },
    ],
    stage: 'run',
    mine: true,
    reason: { en: 'Invoices over £10,000 need the finance lead after the budget owner.', ko: 'Invoices over £10,000 need the finance lead after the budget owner.', ja: 'Invoices over £10,000 need the finance lead after the budget owner.' },
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
  search: { en: 'Search invoices', ko: 'Search invoices', ja: 'Search invoices' },
  placeholder: { en: 'Supplier or invoice number', ko: 'Supplier or invoice number', ja: 'Supplier or invoice number' },
  clear: { en: 'Clear the search', ko: 'Clear the search', ja: 'Clear the search' },
} satisfies Record<string, Tri>;

const HEAD = {
  title: { en: 'Approval queue', ko: 'Approval queue', ja: 'Approval queue' },
  lead: {
    en: '{org} finance. The next payment run is {run}. Invoices approved by Wednesday at 17:00 go in it.',
    ko: '{org} finance. The next payment run is {run}. Invoices approved by Wednesday at 17:00 go in it.',
    ja: '{org} finance. The next payment run is {run}. Invoices approved by Wednesday at 17:00 go in it.',
  },
} satisfies Record<string, Tri>;

const MONTH = {
  title: { en: 'November so far', ko: 'November so far', ja: 'November so far' },
  count: { en: '{n} invoices since 1 Nov', ko: '{n} invoices since 1 Nov', ja: '{n} invoices since 1 Nov' },
  paid: { en: 'Paid', ko: 'Paid', ja: 'Paid' },
  approved: { en: 'Approved', ko: 'Approved', ja: 'Approved' },
  waiting: { en: 'Waiting', ko: 'Waiting', ja: 'Waiting' },
  disputed: { en: 'Disputed', ko: 'Disputed', ja: 'Disputed' },
  bar: {
    en: 'Paid {paid}, approved {approved}, waiting {waiting}, disputed {disputed}',
    ko: 'Paid {paid}, approved {approved}, waiting {waiting}, disputed {disputed}',
    ja: 'Paid {paid}, approved {approved}, waiting {waiting}, disputed {disputed}',
  },
} satisfies Record<string, Tri>;

const QUEUE = {
  title: { en: 'Invoices', ko: 'Invoices', ja: 'Invoices' },
  whose: { en: 'Whose invoices', ko: 'Whose invoices', ja: 'Whose invoices' },
  mine: { en: 'Mine', ko: 'Mine', ja: 'Mine' },
  team: { en: 'Team', ko: 'Team', ja: 'Team' },
  due: { en: 'Due', ko: 'Due', ja: 'Due' },
  byLimit: { en: 'by 30 Nov', ko: 'by 30 Nov', ja: 'by 30 Nov' },
  removeDue: { en: 'Remove the due date filter', ko: 'Remove the due date filter', ja: 'Remove the due date filter' },
  addDue: { en: 'Due by 30 Nov', ko: 'Due by 30 Nov', ja: 'Due by 30 Nov' },
  addDueName: { en: 'Due by 30 Nov, add as a filter', ko: 'Due by 30 Nov, add as a filter', ja: 'Due by 30 Nov, add as a filter' },
  count: { en: '{n} of {total} invoices, {sum}', ko: '{n} of {total} invoices, {sum}', ja: '{n} of {total} invoices, {sum}' },
  dueOn: { en: 'Due {date}', ko: 'Due {date}', ja: 'Due {date}' },
} satisfies Record<string, Tri>;

const GROUPS: Array<{ id: Stage; title: Tri }> = [
  { id: 'you', title: { en: 'Waiting on you', ko: 'Waiting on you', ja: 'Waiting on you' } },
  { id: 'others', title: { en: 'Waiting on others', ko: 'Waiting on others', ja: 'Waiting on others' } },
  { id: 'run', title: { en: 'In Thursday’s run', ko: 'In Thursday’s run', ja: 'In Thursday’s run' } },
  { id: 'disputed', title: { en: 'Disputed', ko: 'Disputed', ja: 'Disputed' } },
];

const BADGE = {
  you: { en: 'Your approval', ko: 'Your approval', ja: 'Your approval' },
  with: { en: 'With {name}', ko: 'With {name}', ja: 'With {name}' },
  run: { en: 'Approved', ko: 'Approved', ja: 'Approved' },
  disputed: { en: 'Disputed', ko: 'Disputed', ja: 'Disputed' },
  lateOne: { en: '1 day late', ko: '1 day late', ja: '1 day late' },
  lateMany: { en: '{n} days late', ko: '{n} days late', ja: '{n} days late' },
} satisfies Record<string, Tri>;

const EMPTY = {
  youTitle: { en: 'Nothing is waiting on you', ko: 'Nothing is waiting on you', ja: 'Nothing is waiting on you' },
  youTitleDue: { en: 'Nothing waiting on you is due by 30 Nov', ko: 'Nothing waiting on you is due by 30 Nov', ja: 'Nothing waiting on you is due by 30 Nov' },
  youText: { en: 'Thursday’s run closes on Wednesday at 17:00.', ko: 'Thursday’s run closes on Wednesday at 17:00.', ja: 'Thursday’s run closes on Wednesday at 17:00.' },
  disputedTitle: { en: 'No disputed invoices', ko: 'No disputed invoices', ja: 'No disputed invoices' },
  disputedTitleDue: { en: 'No disputed invoices due by 30 Nov', ko: 'No disputed invoices due by 30 Nov', ja: 'No disputed invoices due by 30 Nov' },
  disputedText: {
    en: 'If a price, a quantity or a delivery is wrong, open the invoice and choose Dispute. Ledgerline holds it out of the payment run and emails the supplier for a credit note.',
    ko: 'If a price, a quantity or a delivery is wrong, open the invoice and choose Dispute. Ledgerline holds it out of the payment run and emails the supplier for a credit note.',
    ja: 'If a price, a quantity or a delivery is wrong, open the invoice and choose Dispute. Ledgerline holds it out of the payment run and emails the supplier for a credit note.',
  },
  settled: { en: 'See the 4 settled this year', ko: 'See the 4 settled this year', ja: 'See the 4 settled this year' },
  settledList: { en: 'Disputes settled this year', ko: 'Disputes settled this year', ja: 'Disputes settled this year' },
  credit: { en: 'credit note {ref}', ko: 'credit note {ref}', ja: 'credit note {ref}' },
  settledOn: { en: 'settled {date}', ko: 'settled {date}', ja: 'settled {date}' },
  searchTitle: { en: 'No invoices match “{q}”', ko: 'No invoices match “{q}”', ja: 'No invoices match “{q}”' },
  searchText: { en: 'Search looks at supplier names and invoice numbers.', ko: 'Search looks at supplier names and invoice numbers.', ja: 'Search looks at supplier names and invoice numbers.' },
  searchElsewhereOne: {
    en: '1 invoice outside this view matches. Choose Team or remove the due date filter to see it.',
    ko: '1 invoice outside this view matches. Choose Team or remove the due date filter to see it.',
    ja: '1 invoice outside this view matches. Choose Team or remove the due date filter to see it.',
  },
  searchElsewhereMany: {
    en: '{n} invoices outside this view match. Choose Team or remove the due date filter to see them.',
    ko: '{n} invoices outside this view match. Choose Team or remove the due date filter to see them.',
    ja: '{n} invoices outside this view match. Choose Team or remove the due date filter to see them.',
  },
} satisfies Record<string, Tri>;

const DETAIL = {
  previous: { en: 'Previous invoice waiting on you', ko: 'Previous invoice waiting on you', ja: 'Previous invoice waiting on you' },
  next: { en: 'Next invoice waiting on you', ko: 'Next invoice waiting on you', ja: 'Next invoice waiting on you' },
  place: { en: '{i} of {n} waiting on you', ko: '{i} of {n} waiting on you', ja: '{i} of {n} waiting on you' },
  count: { en: '{n} waiting on you', ko: '{n} waiting on you', ja: '{n} waiting on you' },
  none: { en: 'None waiting on you', ko: 'None waiting on you', ja: 'None waiting on you' },
  withVat: { en: 'including {vat} VAT', ko: 'including {vat} VAT', ja: 'including {vat} VAT' },
  noVat: { en: 'no VAT', ko: 'no VAT', ja: 'no VAT' },
  dueIn: { en: 'Due {date}, in {n} days', ko: 'Due {date}, in {n} days', ja: 'Due {date}, in {n} days' },
  dueTomorrow: { en: 'Due {date}, tomorrow', ko: 'Due {date}, tomorrow', ja: 'Due {date}, tomorrow' },
  dueToday: { en: 'Due today, {date}', ko: 'Due today, {date}', ja: 'Due today, {date}' },
  wasDueOne: { en: 'Was due {date}, a day ago', ko: 'Was due {date}, a day ago', ja: 'Was due {date}, a day ago' },
  wasDueMany: { en: 'Was due {date}, {n} days ago', ko: 'Was due {date}, {n} days ago', ja: 'Was due {date}, {n} days ago' },
  earlyOne: { en: 'If you approve it by Wednesday at 17:00, Thursday’s run pays it a day early.', ko: 'If you approve it by Wednesday at 17:00, Thursday’s run pays it a day early.', ja: 'If you approve it by Wednesday at 17:00, Thursday’s run pays it a day early.' },
  earlyMany: {
    en: 'If you approve it by Wednesday at 17:00, Thursday’s run pays it {n} days early.',
    ko: 'If you approve it by Wednesday at 17:00, Thursday’s run pays it {n} days early.',
    ja: 'If you approve it by Wednesday at 17:00, Thursday’s run pays it {n} days early.',
  },
  onTime: {
    en: 'If you approve it by Wednesday at 17:00, Thursday’s run pays it on the day it is due.',
    ko: 'If you approve it by Wednesday at 17:00, Thursday’s run pays it on the day it is due.',
    ja: 'If you approve it by Wednesday at 17:00, Thursday’s run pays it on the day it is due.',
  },
  afterOne: { en: 'Thursday’s run is the day after it is due.', ko: 'Thursday’s run is the day after it is due.', ja: 'Thursday’s run is the day after it is due.' },
  afterMany: { en: 'Thursday’s run is {n} days after it is due.', ko: 'Thursday’s run is {n} days after it is due.', ja: 'Thursday’s run is {n} days after it is due.' },
  approve: { en: 'Approve for Thursday’s run', ko: 'Approve for Thursday’s run', ja: 'Approve for Thursday’s run' },
  dispute: { en: 'Dispute', ko: 'Dispute', ja: 'Dispute' },
  approvedNow: { en: 'Approved for Thursday’s run, which pays it on {run}.', ko: 'Approved for Thursday’s run, which pays it on {run}.', ja: 'Approved for Thursday’s run, which pays it on {run}.' },
  undo: { en: 'Undo the approval', ko: 'Undo the approval', ja: 'Undo the approval' },
  disputedNow: {
    en: 'Disputed and held out of Thursday’s run. Ledgerline has emailed {email} and asked for a credit note.',
    ko: 'Disputed and held out of Thursday’s run. Ledgerline has emailed {email} and asked for a credit note.',
    ja: 'Disputed and held out of Thursday’s run. Ledgerline has emailed {email} and asked for a credit note.',
  },
  yourReason: { en: 'Your reason', ko: 'Your reason', ja: 'Your reason' },
  withdraw: { en: 'Withdraw the dispute', ko: 'Withdraw the dispute', ja: 'Withdraw the dispute' },
  withOther: {
    en: 'With {name}, {role}, since {date}. Nothing is needed from you.',
    ko: 'With {name}, {role}, since {date}. Nothing is needed from you.',
    ja: 'With {name}, {role}, since {date}. Nothing is needed from you.',
  },
  approvedBy: { en: 'Approved by {name} on {date}. Thursday’s run pays it.', ko: 'Approved by {name} on {date}. Thursday’s run pays it.', ja: 'Approved by {name} on {date}. Thursday’s run pays it.' },
  approvedByYou: { en: 'Approved by you on {date}. Thursday’s run pays it.', ko: 'Approved by you on {date}. Thursday’s run pays it.', ja: 'Approved by you on {date}. Thursday’s run pays it.' },
} satisfies Record<string, Tri>;

const DISPUTE = {
  label: { en: 'What is wrong with this invoice?', ko: 'What is wrong with this invoice?', ja: 'What is wrong with this invoice?' },
  hint: { en: 'Ledgerline sends this to {email} and asks for a credit note.', ko: 'Ledgerline sends this to {email} and asks for a credit note.', ja: 'Ledgerline sends this to {email} and asks for a credit note.' },
  empty: { en: 'Write what is wrong, so the supplier knows what to correct.', ko: 'Write what is wrong, so the supplier knows what to correct.', ja: 'Write what is wrong, so the supplier knows what to correct.' },
  short: { en: 'Add a little more: which line is wrong, and what it should be.', ko: 'Add a little more: which line is wrong, and what it should be.', ja: 'Add a little more: which line is wrong, and what it should be.' },
  submit: { en: 'Dispute and hold payment', ko: 'Dispute and hold payment', ja: 'Dispute and hold payment' },
  cancel: { en: 'Cancel', ko: 'Cancel', ja: 'Cancel' },
} satisfies Record<string, Tri>;

const PROPS = {
  invoice: { en: 'Invoice', ko: 'Invoice', ja: 'Invoice' },
  dated: { en: 'dated {date}', ko: 'dated {date}', ja: 'dated {date}' },
  po: { en: 'Purchase order', ko: 'Purchase order', ja: 'Purchase order' },
  raised: { en: 'raised by {name}', ko: 'raised by {name}', ja: 'raised by {name}' },
  none: { en: 'None', ko: 'None', ja: 'None' },
  centre: { en: 'Cost centre', ko: 'Cost centre', ja: 'Cost centre' },
  terms: { en: 'Terms', ko: 'Terms', ja: 'Terms' },
  payTo: { en: 'Pay to', ko: 'Pay to', ja: 'Pay to' },
  account: { en: 'Account ending {n}', ko: 'Account ending {n}', ja: 'Account ending {n}' },
  unchanged: { en: 'unchanged since {when}', ko: 'unchanged since {when}', ja: 'unchanged since {when}' },
  original: { en: 'Original', ko: 'Original', ja: 'Original' },
  pageOne: { en: '1 page', ko: '1 page', ja: '1 page' },
  pageMany: { en: '{n} pages', ko: '{n} pages', ja: '{n} pages' },
} satisfies Record<string, Tri>;

const LINES = {
  title: { en: 'Lines', ko: 'Lines', ja: 'Lines' },
  item: { en: 'Item', ko: 'Item', ja: 'Item' },
  qty: { en: 'Qty', ko: 'Qty', ja: 'Qty' },
  unit: { en: 'Unit price', ko: 'Unit price', ja: 'Unit price' },
  amount: { en: 'Amount', ko: 'Amount', ja: 'Amount' },
  was: { en: 'The order says {price}', ko: 'The order says {price}', ja: 'The order says {price}' },
  short: { en: '{n} not received yet', ko: '{n} not received yet', ja: '{n} not received yet' },
  net: { en: 'Net', ko: 'Net', ja: 'Net' },
  vat: { en: 'VAT at {rate}%', ko: 'VAT at {rate}%', ja: 'VAT at {rate}%' },
  total: { en: 'Total', ko: 'Total', ja: 'Total' },
} satisfies Record<string, Tri>;

const TRAIL = {
  title: { en: 'Approval trail', ko: 'Approval trail', ja: 'Approval trail' },
  stamp: { en: '{day}, {time}', ko: '{day}, {time}', ja: '{day}, {time}' },
  received: { en: 'Received by email', ko: 'Received by email', ja: 'Received by email' },
  receivedBody: { en: 'Read from {inbox} and filed under {supplier}.', ko: 'Read from {inbox} and filed under {supplier}.', ja: 'Read from {inbox} and filed under {supplier}.' },
  approvedBy: { en: 'Approved by {name}, {role}', ko: 'Approved by {name}, {role}', ja: 'Approved by {name}, {role}' },
  ownerBody: { en: 'Budget owner for {centre}.', ko: 'Budget owner for {centre}.', ja: 'Budget owner for {centre}.' },
  approvedYou: { en: 'Approved by you as finance lead', ko: 'Approved by you as finance lead', ja: 'Approved by you as finance lead' },
  yours: { en: 'Your approval as finance lead', ko: 'Your approval as finance lead', ja: 'Your approval as finance lead' },
  withOther: { en: 'With {name}, {role}', ko: 'With {name}, {role}', ja: 'With {name}, {role}' },
  waitingToday: { en: 'since today', ko: 'since today', ja: 'since today' },
  waitingOne: { en: 'waiting 1 day', ko: 'waiting 1 day', ja: 'waiting 1 day' },
  waitingMany: { en: 'waiting {n} days', ko: 'waiting {n} days', ja: 'waiting {n} days' },
  paid: { en: 'Paid in Thursday’s run', ko: 'Paid in Thursday’s run', ja: 'Paid in Thursday’s run' },
  paidBody: { en: 'Bacs from the operating account, arriving {date}.', ko: 'Bacs from the operating account, arriving {date}.', ja: 'Bacs from the operating account, arriving {date}.' },
  disputed: { en: 'Disputed by you', ko: 'Disputed by you', ja: 'Disputed by you' },
  credit: { en: 'Waiting for a credit note from {supplier}', ko: 'Waiting for a credit note from {supplier}', ja: 'Waiting for a credit note from {supplier}' },
  creditBody: {
    en: 'Ledgerline emailed {email}. The invoice stays out of payment runs until the credit note arrives.',
    ko: 'Ledgerline emailed {email}. The invoice stays out of payment runs until the credit note arrives.',
    ja: 'Ledgerline emailed {email}. The invoice stays out of payment runs until the credit note arrives.',
  },
} satisfies Record<string, Tri>;

const NEWS = {
  countOne: { en: '1 invoice, {sum}.', ko: '1 invoice, {sum}.', ja: '1 invoice, {sum}.' },
  countMany: { en: '{n} invoices, {sum}.', ko: '{n} invoices, {sum}.', ja: '{n} invoices, {sum}.' },
  filterOff: { en: 'Due date filter removed.', ko: 'Due date filter removed.', ja: 'Due date filter removed.' },
  filterOn: { en: 'Showing invoices due by 30 Nov.', ko: 'Showing invoices due by 30 Nov.', ja: 'Showing invoices due by 30 Nov.' },
  showing: { en: 'Showing {supplier}, {ref}.', ko: 'Showing {supplier}, {ref}.', ja: 'Showing {supplier}, {ref}.' },
  approved: { en: '{supplier} approved. {ref} moves to Thursday’s run.', ko: '{supplier} approved. {ref} moves to Thursday’s run.', ja: '{supplier} approved. {ref} moves to Thursday’s run.' },
  undone: { en: 'Approval undone. {ref} is waiting on you again.', ko: 'Approval undone. {ref} is waiting on you again.', ja: 'Approval undone. {ref} is waiting on you again.' },
  disputed: { en: '{supplier} disputed. {ref} is held out of Thursday’s run.', ko: '{supplier} disputed. {ref} is held out of Thursday’s run.', ja: '{supplier} disputed. {ref} is held out of Thursday’s run.' },
  withdrawn: { en: 'Dispute withdrawn. {ref} is waiting on you again.', ko: 'Dispute withdrawn. {ref} is waiting on you again.', ja: 'Dispute withdrawn. {ref} is waiting on you again.' },
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

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

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
