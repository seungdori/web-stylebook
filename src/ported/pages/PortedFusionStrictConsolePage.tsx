import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang) => obj[lang];

interface Departure {
  flight: string;
  token: string;
  to: string;
  gate: string;
  status: 'BOARDING' | 'ON TIME' | 'DELAYED' | 'SCHEDULED';
  time: string;
  delay: number;
}

const DEPARTURES: Departure[] = [
  { flight: 'SB 014', token: 'color.brand.primary',  to: 'APAC · 01', gate: 'A12', status: 'BOARDING',  time: '09:24', delay: 0 },
  { flight: 'SB 013', token: 'radius.surface.lg',    to: 'EMEA · 02', gate: 'B07', status: 'ON TIME',   time: '09:42', delay: 0 },
  { flight: 'SB 012', token: 'shadow.elevation.02',  to: 'AMER · 01', gate: 'C03', status: 'ON TIME',   time: '10:08', delay: 0 },
  { flight: 'SB 011', token: 'space.gutter.xl',      to: 'APAC · 02', gate: '—',   status: 'DELAYED',   time: '10:35', delay: 18 },
  { flight: 'SB 010', token: 'type.display.tight',   to: 'EMEA · 01', gate: 'B14', status: 'ON TIME',   time: '11:02', delay: 0 },
  { flight: 'SB 009', token: 'motion.spring.subtle', to: 'AMER · 02', gate: 'C08', status: 'BOARDING',  time: '11:18', delay: 0 },
  { flight: 'SB 008', token: 'border.line.hairline', to: 'APAC · 01', gate: '—',   status: 'SCHEDULED', time: '11:44', delay: 0 },
];

const FILTERS = [
  {
    id: 'terminal',
    label: { en: 'TERMINAL', ko: '터미널', ja: 'ターミナル' },
    values: [
      { id: 'all',  label: { en: 'ALL',     ko: '전체', ja: '全て' } },
      { id: 'apac', label: { en: 'APAC',    ko: 'APAC', ja: 'APAC' } },
      { id: 'emea', label: { en: 'EMEA',    ko: 'EMEA', ja: 'EMEA' } },
      { id: 'amer', label: { en: 'AMER',    ko: 'AMER', ja: 'AMER' } },
    ],
  },
  {
    id: 'sector',
    label: { en: 'SECTOR', ko: '섹터', ja: 'セクター' },
    values: [
      { id: 'prod',    label: { en: 'PROD',    ko: 'PROD', ja: 'PROD' } },
      { id: 'staging', label: { en: 'STAGE',   ko: 'STAGE', ja: 'STAGE' } },
    ],
  },
  {
    id: 'status',
    label: { en: 'STATUS', ko: '상태', ja: 'ステータス' },
    values: [
      { id: 'all',     label: { en: 'ALL',     ko: '전체',   ja: '全て' } },
      { id: 'live',    label: { en: 'LIVE',    ko: 'LIVE',   ja: 'LIVE' } },
      { id: 'delayed', label: { en: 'DELAYED', ko: 'DELAYED', ja: 'DELAYED' } },
    ],
  },
];

const COPY = {
  topLeft:  'STYLEBOOK INTL · OPS BOARD',
  topMid:   { en: 'DEPARTURES — LIVE',  ko: '출발편 — 실시간',  ja: '出発便 — リアルタイム' },
  topRight: '2026·05·15 · 09:24 KST',
  navItems: [
    { en: 'BOARD',     ko: '보드',   ja: 'ボード' },
    { en: 'GATES',     ko: '게이트', ja: 'ゲート' },
    { en: 'SCHEDULE',  ko: '시간표', ja: '時刻表' },
    { en: 'OPERATORS', ko: '운항사', ja: '運航社' },
    { en: 'BOARDING',  ko: '탑승',   ja: '搭乗' },
  ],

  // HERO — the board
  hero: {
    sectionTag: { en: 'A · DEPARTURES BOARD', ko: 'A · 출발 안내판', ja: 'A · 出発案内板' },
    overline: { en: 'NOW DEPARTING', ko: '지금 출발', ja: '出発中' },
    line1: { en: 'SHIP',     ko: '배포',  ja: '出荷' },
    line2: { en: 'TOKENS',   ko: '토큰',  ja: 'トークン' },
    line3: { en: 'NOT TICKETS', ko: '티켓 없이', ja: 'チケット不要' },
    lede: {
      en: 'A live operations board for design system teams. Every token is a flight: filed, gated, and departed across twelve regions — no ticket queue, no Slack thread, no Thursday afternoon meeting.',
      ko: '디자인 시스템 팀을 위한 실시간 운영 보드입니다. 모든 토큰은 한 편의 비행 — 12개 리전으로 *티켓 큐 없이*, *Slack 스레드 없이*, *목요일 오후 회의 없이* 출발합니다.',
      ja: 'デザインシステムチームのためのライブ運用ボード。すべてのトークンは1便のフライト — 12のリージョンへ、*チケット待ち列なし*・*Slackスレッドなし*・*木曜午後ミーティングなし*で出発する。',
    },
    primaryCta:   { en: 'OPEN THE BOARD',      ko: '보드 열기',     ja: 'ボードを開く' },
    secondaryCta: { en: 'VIEW SCHEDULE →',     ko: '시간표 보기 →', ja: '時刻表を見る →' },
  },

  // STATUS RAIL (right side of hero)
  rail: [
    { label: { en: 'NEXT DEPART', ko: '다음 출발',   ja: '次の出発' }, value: '09:24', sub: { en: 'A12 · APAC',  ko: 'A12 · APAC', ja: 'A12 · APAC' }, live: true  },
    { label: { en: 'ON TIME',     ko: '정시',        ja: '定時' },    value: '99.94', sub: { en: '%',           ko: '%',          ja: '%' },          live: false },
    { label: { en: 'BOARDING',    ko: '탑승 중',     ja: '搭乗中' },  value: '02',    sub: { en: 'GATES OPEN', ko: '게이트 개방', ja: 'ゲート開放' }, live: true  },
    { label: { en: 'IN FLIGHT',   ko: '운항 중',     ja: '運航中' },  value: '184',   sub: { en: 'TOKENS',      ko: '토큰',       ja: 'トークン' },   live: false },
  ],

  // GATES section (was operations panel)
  gates: {
    sectionTag: { en: 'B · GATES',  ko: 'B · 게이트', ja: 'B · ゲート' },
    title:    { en: 'The board is the product.', ko: '*보드 자체가* 제품입니다.', ja: '*ボード自体が*プロダクト。' },
    sub: {
      en: 'A working departures grid that ships with every Org plan. Filters, gates, fares, and arrival times — mechanical, mono, no decoration. Hover any row to re-flip its destination.',
      ko: '모든 Org 플랜에 기본 포함되는 *진짜로 작동하는 출발 보드*. 필터·게이트·운임·도착 시간 — 기계식, 모노, 장식 없음. 행에 호버하면 도착지가 다시 *플립*됩니다.',
      ja: 'すべてのOrgプランに同梱される*実作業のための出発ボード*。フィルタ・ゲート・運賃・到着時刻 — 機械式、モノ、装飾なし。行をホバーすると到着地が再度*フリップ*する。',
    },
    columns: [
      { en: 'FLIGHT', ko: '편명',   ja: '便名' },
      { en: 'TOKEN',  ko: '토큰',   ja: 'トークン' },
      { en: 'TO',     ko: '도착지', ja: '到着' },
      { en: 'GATE',   ko: '게이트', ja: 'ゲート' },
      { en: 'STATUS', ko: '상태',   ja: '状態' },
      { en: 'TIME',   ko: '시각',   ja: '時刻' },
    ],
    summary: { en: 'SHOWING 7 OF 184 DEPARTURES · LAST FLIP 09:24 KST', ko: '184편 중 7편 표시 · 마지막 플립 09:24 KST', ja: '184便中7便表示 · 最終フリップ 09:24 KST' },
  },

  // SCHEDULE section (was pricing) — boarding passes
  schedule: {
    sectionTag: { en: 'C · SCHEDULE',   ko: 'C · 시간표', ja: 'C · 時刻表' },
    title: {
      en: 'Three classes. One board. No quotas in the way of the work.',
      ko: '세 등급. 단일 보드. 작업을 가로막는 *쿼터 없음*.',
      ja: '3クラス。1ボード。作業を妨げる*クォータなし*。',
    },
    fares: [
      {
        id: 'economy',
        class: { en: 'ECONOMY', ko: '이코노미',   ja: 'エコノミー' },
        name:  { en: 'STARTER', ko: '스타터',     ja: 'スターター' },
        fare:  { en: 'FREE',    ko: '무료',       ja: '無料' },
        cycle: { en: 'OPEN-ENDED',  ko: '평생',   ja: '永続' },
        note:  { en: 'For a single designer or a small library.', ko: '개인 디자이너 또는 소규모 라이브러리용.', ja: '個人デザイナーまたは小規模ライブラリ向け。' },
        rows: [
          { en: '3 ROUTES',           ko: '루트 3개',           ja: 'ルート3' },
          { en: '1 REGION',           ko: '리전 1개',           ja: 'リージョン1' },
          { en: 'COMMUNITY DESK',     ko: '커뮤니티 데스크',     ja: 'コミュニティ・デスク' },
          { en: 'HANDOFF — SLIM',     ko: 'HANDOFF — SLIM',     ja: 'HANDOFF — SLIM' },
        ],
        cta: { en: 'BOOK ECONOMY',  ko: '이코노미 예약',     ja: 'エコノミーを予約' },
      },
      {
        id: 'business',
        class: { en: 'BUSINESS', ko: '비즈니스',  ja: 'ビジネス' },
        name:  { en: 'TEAM',     ko: '팀',         ja: 'チーム' },
        fare:  { en: '$24',      ko: '$24',        ja: '$24' },
        cycle: { en: '/ SEAT / MO', ko: '/ 시트 / 월', ja: '/ シート / 月' },
        note:  { en: 'For 5–40 product designers shipping daily.', ko: '매일 배포하는 5–40명의 제품 디자이너용.', ja: '毎日リリースする5〜40名のプロダクト・デザイナー向け。' },
        rows: [
          { en: 'UNLIMITED ROUTES', ko: '무제한 루트',         ja: '無制限ルート' },
          { en: '6 REGIONS',        ko: '리전 6개',            ja: 'リージョン6' },
          { en: '24-HOUR DESK',     ko: '24시간 데스크',        ja: '24時間デスク' },
          { en: 'HANDOFF — FULL',   ko: 'HANDOFF — FULL',     ja: 'HANDOFF — FULL' },
          { en: 'TOKEN AUDIT LOG',  ko: '토큰 감사 로그',       ja: 'トークン監査ログ' },
        ],
        cta: { en: 'BOOK BUSINESS', ko: '비즈니스 예약',      ja: 'ビジネスを予約' },
        featured: true,
      },
      {
        id: 'first',
        class: { en: 'FIRST',   ko: '퍼스트',  ja: 'ファースト' },
        name:  { en: 'ORG',     ko: '오그',     ja: 'オーグ' },
        fare:  { en: 'CONTACT', ko: '문의',     ja: 'お問い合わせ' },
        cycle: { en: 'ANNUAL',  ko: '연간',     ja: '年間' },
        note:  { en: 'For platforms with regulatory or multi-brand needs.', ko: '규제·멀티 브랜드 요구가 있는 플랫폼용.', ja: '規制要件・マルチブランドのプラットフォーム向け。' },
        rows: [
          { en: 'SSO + AUDIT',         ko: 'SSO + 감사',         ja: 'SSO + 監査' },
          { en: '12 REGIONS',          ko: '리전 12개',          ja: 'リージョン12' },
          { en: 'DEDICATED PURSER',    ko: '전담 퍼서',           ja: '専任パーサー' },
          { en: 'PRIVATE TARMAC',      ko: '프라이빗 타맥',       ja: 'プライベート・ターマック' },
          { en: 'CLOSED-DOOR RFP',     ko: '비공개 RFP',          ja: '非公開RFP' },
        ],
        cta: { en: 'CONTACT PURSER', ko: '퍼서에게 문의',     ja: 'パーサーに問い合わせ' },
      },
    ],
  },

  // OPERATORS (was customers)
  operators: {
    sectionTag: { en: 'D · OPERATORS', ko: 'D · 운항사', ja: 'D · 運航社' },
    title: { en: 'Operated daily by teams that file every weekday.', ko: '평일마다 운항하는 팀들이 운영합니다.', ja: '平日ごとに運航するチームが運用。' },
    logos: [
      { code: 'NW',  name: 'NORTHWIND'    },
      { code: 'AC',  name: 'ACME / OS'    },
      { code: 'CL',  name: 'CALMR'        },
      { code: 'A12', name: 'ATELIER 12'   },
      { code: 'NWN', name: 'NORTH WINDOW' },
      { code: 'STR', name: 'STRATA'       },
    ],
  },

  // ANNOUNCEMENT (was quote)
  announce: {
    sectionTag: { en: 'E · ANNOUNCEMENT', ko: 'E · 안내방송', ja: 'E · アナウンス' },
    body: {
      en: 'We replaced a Notion page, a Slack channel, and a weekly meeting with this board. Thursday afternoon now takes ten minutes on Monday morning.',
      ko: '이 보드 하나가 Notion 페이지 한 장, Slack 채널 하나, 주간 회의 하나를 *대체했습니다*. 목요일 오후 작업이 *월요일 아침 10분*이면 끝납니다.',
      ja: 'このボードはNotionページ1枚、Slackチャンネル1つ、週次ミーティング1回を*置き換えた*。木曜午後の仕事が*月曜朝の10分*で終わる。',
    },
    by: { en: 'L. KIM · DESIGN SYSTEMS LEAD · STRATA', ko: 'L. 김 · 디자인 시스템 리드 · STRATA', ja: 'L. キム · デザインシステム・リード · STRATA' },
  },

  // BOARDING (was CTA)
  boarding: {
    sectionTag: { en: 'F · BOARDING PASS', ko: 'F · 탑승권', ja: 'F · 搭乗券' },
    title: { en: 'Issue the pass.', ko: '*탑승권을 발권*하세요.', ja: '*搭乗券を発券*する。' },
    sub: {
      en: '14-day trial · no card · SOC 2 II in audit · hosted in 12 regions.',
      ko: '14일 평가판 · 카드 없음 · SOC 2 II 감사 중 · 12개 리전 호스팅.',
      ja: '14日トライアル · カード不要 · SOC 2 II監査中 · 12リージョンでホスト。',
    },
    passField:  { en: 'PASSENGER',    ko: '탑승자',         ja: '搭乗者' },
    passPh:     { en: 'work email',   ko: '회사 이메일',    ja: '会社のメール' },
    button:     { en: 'CHECK IN',     ko: '체크인',         ja: 'チェックイン' },
    serial:     { en: 'PNR / SB-2026·05·15', ko: 'PNR / SB-2026·05·15', ja: 'PNR / SB-2026·05·15' },
  },
} as const;

/* ============================================================== */
/* Split-flap character primitive                                 */
/* ============================================================== */
interface FlapProps {
  text: string;
  delayBase?: number;
  perCharMs?: number;
  className?: string;
  trigger?: number;
}
function Flap({ text, delayBase = 0, perCharMs = 36, className = '', trigger = 0 }: FlapProps) {
  const chars = useMemo(() => [...text], [text]);
  return (
    <span className={`sf-flap ${className}`} data-trigger={trigger}>
      {chars.map((ch, i) => {
        const isSpace = ch === ' ';
        const style = { '--sf-delay': `${delayBase + i * perCharMs}ms` } as CSSProperties;
        return (
          <span
            key={`${trigger}-${i}-${ch}`}
            className={`sf-char ${isSpace ? 'sf-char--space' : ''}`}
            style={style}
            aria-hidden="true"
          >
            {isSpace ? ' ' : ch}
          </span>
        );
      })}
      <span className="sf-sr">{text}</span>
    </span>
  );
}

/* ============================================================== */
/* Page                                                           */
/* ============================================================== */
export function PortedFusionStrictConsolePage({ lang }: PortedStylePageProps) {
  const lng = lang as Lang;

  const [selected, setSelected] = useState<Record<string, string>>({
    terminal: 'all',
    sector: 'prod',
    status: 'all',
  });
  const [tableTrigger, setTableTrigger] = useState(0);
  const [email, setEmail] = useState('');

  // re-flip table whenever filters change
  useEffect(() => {
    setTableTrigger((t) => t + 1);
  }, [selected]);

  const setFilter = (groupId: string, valueId: string) => {
    setSelected((prev) => ({ ...prev, [groupId]: valueId }));
  };

  return (
    <FusionShell
      fusionId="fusion-strict-console"
      lang={lang}
      tone="dark"
      accent="#ffb000"
      prev={{ href: '/pages/fusion-noir-metal.html', label: 'Noir Metal' }}
      next={{ href: '/pages/fusion-quiet-manifesto.html', label: 'Quiet Manifesto' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
    >
      <div className="sc-board">

        {/* ============= TOP RAIL ============= */}
        <header className="sc-rail-top">
          <span className="sc-rail-top__brand">
            <span className="sc-rail-top__dot" aria-hidden="true" />
            {COPY.topLeft}
          </span>
          <span className="sc-rail-top__live">
            <span className="sc-rail-top__pulse" aria-hidden="true" />
            {L(COPY.topMid, lng)}
          </span>
          <nav className="sc-rail-top__nav">
            {COPY.navItems.map((n, i) => (
              <a key={i} href="#" className={i === 0 ? 'is-active' : ''}>{L(n, lng)}</a>
            ))}
          </nav>
          <span className="sc-rail-top__clock">{COPY.topRight}</span>
        </header>

        {/* ============= SECTION A · BOARD HERO ============= */}
        <section className="sc-frame sc-frame--hero" aria-label="Departures board">
          <div className="sc-frame__head">
            <span className="sc-frame__tag">{L(COPY.hero.sectionTag, lng)}</span>
            <span className="sc-frame__overline">{L(COPY.hero.overline, lng)}</span>
          </div>

          <div className="sc-board-wall">
            <Flap className="sc-mega sc-mega--1" text={L(COPY.hero.line1, lng)} delayBase={140}  perCharMs={48} />
            <Flap className="sc-mega sc-mega--2" text={L(COPY.hero.line2, lng)} delayBase={620}  perCharMs={48} />
            <Flap className="sc-mega sc-mega--3" text={L(COPY.hero.line3, lng)} delayBase={1180} perCharMs={42} />
          </div>

          <div className="sc-hero-foot">
            <p className="sc-hero-foot__lede">
              {L(COPY.hero.lede, lng).split('*').map((chunk, i) =>
                i % 2 === 1 ? <strong key={i}>{chunk}</strong> : <span key={i}>{chunk}</span>
              )}
            </p>
            <div className="sc-hero-foot__ctas">
              <a href="#" className="sc-btn sc-btn--primary">
                <Flap text={L(COPY.hero.primaryCta, lng)} delayBase={1700} perCharMs={26} />
                <span className="sc-btn__arrow" aria-hidden="true">→</span>
              </a>
              <a href="#" className="sc-btn sc-btn--ghost">{L(COPY.hero.secondaryCta, lng)}</a>
            </div>
          </div>

          {/* status rail */}
          <aside className="sc-statrail" aria-label="Live status">
            {COPY.rail.map((r, i) => (
              <div key={i} className="sc-statrail__cell">
                <span className="sc-statrail__label">
                  {r.live ? <span className="sc-statrail__beacon" aria-hidden="true" /> : null}
                  {L(r.label, lng)}
                </span>
                <span className="sc-statrail__value">
                  <Flap text={r.value} delayBase={1400 + i * 120} perCharMs={32} />
                </span>
                <span className="sc-statrail__sub">{L(r.sub, lng)}</span>
              </div>
            ))}
          </aside>
        </section>

        {/* ============= SECTION B · GATES ============= */}
        <section className="sc-frame" aria-label="Gates">
          <div className="sc-frame__head">
            <span className="sc-frame__tag">{L(COPY.gates.sectionTag, lng)}</span>
          </div>
          <h2 className="sc-h2">
            {L(COPY.gates.title, lng).split('*').map((chunk, i) =>
              i % 2 === 1 ? <em key={i}>{chunk}</em> : <span key={i}>{chunk}</span>
            )}
          </h2>
          <p className="sc-sub">{L(COPY.gates.sub, lng)}</p>

          <div className="sc-grid-panel">
            <div className="sc-filters" role="toolbar" aria-label="Filters">
              {FILTERS.map((group) => (
                <div key={group.id} className="sc-filtergroup">
                  <span className="sc-filtergroup__label">{L(group.label, lng)}</span>
                  <div className="sc-filtergroup__chips">
                    {group.values.map((value) => (
                      <button
                        key={value.id}
                        type="button"
                        className={`sc-chip ${selected[group.id] === value.id ? 'is-on' : ''}`}
                        onClick={() => setFilter(group.id, value.id)}
                      >
                        {L(value.label, lng)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="sc-grid">
              <div className="sc-grid__head">
                {COPY.gates.columns.map((c, i) => (
                  <span key={i} className="sc-grid__th">{L(c, lng)}</span>
                ))}
              </div>
              <ul className="sc-grid__body">
                {DEPARTURES.map((d, i) => (
                  <li key={d.flight} className="sc-row" style={{ '--row-delay': `${i * 60}ms` } as CSSProperties}>
                    <span className="sc-row__cell sc-row__cell--mono">
                      <Flap text={d.flight} delayBase={i * 60} perCharMs={22} trigger={tableTrigger} />
                    </span>
                    <span className="sc-row__cell sc-row__cell--ink">
                      {d.token}
                    </span>
                    <span className="sc-row__cell sc-row__cell--dest">
                      <Flap text={d.to} delayBase={i * 60 + 80} perCharMs={22} trigger={tableTrigger} />
                    </span>
                    <span className="sc-row__cell sc-row__cell--mono">
                      <Flap text={d.gate} delayBase={i * 60 + 120} perCharMs={22} trigger={tableTrigger} />
                    </span>
                    <span className={`sc-row__cell sc-row__cell--badge sc-status--${d.status.replace(' ', '-').toLowerCase()}`}>
                      <span className="sc-status__dot" aria-hidden="true" />
                      <Flap text={d.status} delayBase={i * 60 + 160} perCharMs={20} trigger={tableTrigger} />
                      {d.delay > 0 ? <em>+{d.delay}m</em> : null}
                    </span>
                    <span className="sc-row__cell sc-row__cell--mono sc-row__cell--right">
                      <Flap text={d.time} delayBase={i * 60 + 200} perCharMs={22} trigger={tableTrigger} />
                    </span>
                  </li>
                ))}
              </ul>
              <footer className="sc-grid__foot">
                <span>{L(COPY.gates.summary, lng)}</span>
              </footer>
            </div>
          </div>
        </section>

        {/* ============= SECTION C · SCHEDULE ============= */}
        <section className="sc-frame" aria-label="Schedule">
          <div className="sc-frame__head">
            <span className="sc-frame__tag">{L(COPY.schedule.sectionTag, lng)}</span>
          </div>
          <h2 className="sc-h2">
            {L(COPY.schedule.title, lng).split('*').map((chunk, i) =>
              i % 2 === 1 ? <em key={i}>{chunk}</em> : <span key={i}>{chunk}</span>
            )}
          </h2>

          <div className="sc-fares">
            {COPY.schedule.fares.map((fare) => (
              <article key={fare.id} className={`sc-pass ${fare.featured ? 'is-featured' : ''}`}>
                <div className="sc-pass__stub">
                  <span className="sc-pass__stub-label">CLASS</span>
                  <span className="sc-pass__stub-class">{L(fare.class, lng)}</span>
                  <span className="sc-pass__stub-name">{L(fare.name, lng)}</span>
                  <span className="sc-pass__stub-route">SB · INTL</span>
                </div>
                <div className="sc-pass__perforation" aria-hidden="true">
                  <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
                </div>
                <div className="sc-pass__body">
                  <div className="sc-pass__fare">
                    <span className="sc-pass__fare-amt">{L(fare.fare, lng)}</span>
                    <span className="sc-pass__fare-cycle">{L(fare.cycle, lng)}</span>
                  </div>
                  <p className="sc-pass__note">{L(fare.note, lng)}</p>
                  <ul className="sc-pass__list">
                    {fare.rows.map((row, i) => (
                      <li key={i}>
                        <span className="sc-pass__list-mark" aria-hidden="true">▌</span>
                        <span>{L(row, lng)}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#" className={`sc-btn ${fare.featured ? 'sc-btn--primary' : 'sc-btn--outline'}`}>
                    <span>{L(fare.cta, lng)}</span>
                    <span className="sc-btn__arrow" aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============= SECTION D · OPERATORS ============= */}
        <section className="sc-frame" aria-label="Operators">
          <div className="sc-frame__head">
            <span className="sc-frame__tag">{L(COPY.operators.sectionTag, lng)}</span>
          </div>
          <h2 className="sc-h2 sc-h2--sm">{L(COPY.operators.title, lng)}</h2>
          <div className="sc-operators">
            {COPY.operators.logos.map((op) => (
              <div key={op.code} className="sc-operator">
                <span className="sc-operator__code">{op.code}</span>
                <span className="sc-operator__name">{op.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ============= SECTION E · ANNOUNCEMENT ============= */}
        <section className="sc-frame sc-frame--announce" aria-label="Announcement">
          <div className="sc-frame__head">
            <span className="sc-frame__tag">{L(COPY.announce.sectionTag, lng)}</span>
            <span className="sc-frame__overline">PA · CH 1</span>
          </div>
          <blockquote className="sc-announce">
            <p>
              {L(COPY.announce.body, lng).split('*').map((chunk, i) =>
                i % 2 === 1 ? <em key={i}>{chunk}</em> : <span key={i}>{chunk}</span>
              )}
            </p>
            <cite>{L(COPY.announce.by, lng)}</cite>
          </blockquote>
        </section>

        {/* ============= SECTION F · BOARDING ============= */}
        <section className="sc-frame sc-frame--boarding" aria-label="Boarding">
          <div className="sc-frame__head">
            <span className="sc-frame__tag">{L(COPY.boarding.sectionTag, lng)}</span>
          </div>
          <h2 className="sc-h2">
            {L(COPY.boarding.title, lng).split('*').map((chunk, i) =>
              i % 2 === 1 ? <em key={i}>{chunk}</em> : <span key={i}>{chunk}</span>
            )}
          </h2>
          <p className="sc-sub">{L(COPY.boarding.sub, lng)}</p>

          <form className="sc-boarding" onSubmit={(e) => e.preventDefault()}>
            <div className="sc-boarding__pass">
              <div className="sc-boarding__col sc-boarding__col--main">
                <label className="sc-boarding__label">
                  <span>{L(COPY.boarding.passField, lng)}</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={L(COPY.boarding.passPh, lng)}
                  />
                </label>
              </div>
              <div className="sc-boarding__col sc-boarding__col--meta">
                <span className="sc-boarding__meta-label">FLIGHT</span>
                <span className="sc-boarding__meta-value">SB · OPS</span>
                <span className="sc-boarding__meta-label">GATE</span>
                <span className="sc-boarding__meta-value">A12</span>
              </div>
              <div className="sc-boarding__col sc-boarding__col--cta">
                <button type="submit" className="sc-btn sc-btn--primary sc-btn--block">
                  <span>{L(COPY.boarding.button, lng)}</span>
                  <span className="sc-btn__arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </div>
            <span className="sc-boarding__serial">{L(COPY.boarding.serial, lng)}</span>
          </form>
        </section>

      </div>
    </FusionShell>
  );
}

/* ============================================================== */
/* AI Prompts                                                     */
/* ============================================================== */
const promptEn = `Design a B2B SaaS landing rebuilt as a SOLARI split-flap DEPARTURES BOARD (FIDS). The page IS a flight-information display — true black surfaces, mechanical character cells, one amber accent, mechanical flap kinetic everywhere.

METAPHOR (the only one):
- The product (a design-system console) is presented as an airport departures board.
- Tokens are flights. Regions are terminals. Pricing tiers are fare classes (ECONOMY / BUSINESS / FIRST). The CTA is a boarding pass. The quote is a PA announcement. Customers are operators.
- Every section uses board vocabulary; no "N°01–06" anchors, no portfolio template.

PALETTE (true black per console-identity rule):
--sc-board #0a0a0a   page + board face
--sc-rail  #161616   raised rails/headers
--sc-cell  #141414   flap cell back
--sc-edge  #2a2a2a   visible cell separators (≥22% on black-equivalent)
--sc-glyph #ebebeb   primary character color (slightly cool off-white, NOT cream)
--sc-mute  #6a6a6a
--sc-amber #ffb000   ONLY accent — used for: live beacons, primary CTA, hero accent letter, featured fare stripe
--sc-rust  #c5523a   reserved for DELAYED status only

TYPOGRAPHY:
Display: 'Oswald' / 'Bebas Neue' / 'Archivo Black' — tall condensed mechanical character. Weights 600/700. UPPERCASE everywhere on the board.
Mono: 'JetBrains Mono' — flight codes, times, gates, serial numbers. Tabular figures.
Body: 'Inter' 400 / 500 for the small amount of running prose.

THE SIGNATURE KINETIC:
Every uppercase character animates as a mechanical flap on first paint:
@keyframes sf-flap-in {
  0%   { transform: rotateX(-92deg); opacity: 0; filter: blur(4px); }
  35%  { transform: rotateX(18deg);  opacity: 1; filter: blur(0); }
  62%  { transform: rotateX(-7deg); }
  100% { transform: rotateX(0); }
}
.sf-char { display:inline-block; transform-origin:50% 100%; backface-visibility:hidden;
  animation: sf-flap-in 0.46s cubic-bezier(.55,.05,.25,1) var(--sf-delay,0ms) backwards; }
Characters stagger by 22–48ms by char index. On filter change, the gate rows re-key and flap again. Honour prefers-reduced-motion → animation:none.

LAYOUT (six frames, each full-width, NO numbered Cavity anchors):

1) TOP RAIL — fixed-rhythm bar: brand left ("STYLEBOOK INTL · OPS BOARD") + live indicator center ("DEPARTURES — LIVE" with amber pulse) + nav (BOARD / GATES / SCHEDULE / OPERATORS / BOARDING) + mono clock right.

2) FRAME A · DEPARTURES BOARD (hero) — the dominant cinematic visual.
   - Black "board wall" panel with subtle bevelled top rail.
   - Three giant flap lines stacked: SHIP / TOKENS / NOT TICKETS. Second line at clamp(7rem, 19vw, 16rem), tracked +0.04em, white glyphs, EXCEPT middle word "TOKENS" in amber (#ffb000). Lines crop intentionally at viewport edges on wide screens — the board is bigger than the viewport.
   - Beneath: lede (Inter 400, ≤60ch, white-on-near-black) with two bolded fragments. Primary CTA "OPEN THE BOARD" (amber block, black ink, no rounding above 2px), secondary "VIEW SCHEDULE →" ghost link.
   - Right rail (above mobile breakpoint): four cells (NEXT DEPART / ON TIME / BOARDING / IN FLIGHT) — each a mono value with sub-label. Amber beacon dot on live cells. Cells share heavy hairline grid (1px #2a2a2a). NO drop shadows.

3) FRAME B · GATES — the working departures grid.
   - Filter toolbar (TERMINAL / SECTOR / STATUS chips). Selected chip: amber fill, black ink. Idle chip: transparent, white ink, 1px #2a2a2a border.
   - 7-row grid: FLIGHT / TOKEN / TO / GATE / STATUS / TIME. Every cell except TOKEN column animates with the flap. STATUS column uses a colored dot (BOARDING=amber, ON TIME=white, DELAYED=rust, SCHEDULED=mute). Row hover: amber 8% wash, no transform.
   - Bottom-right summary line in mono, smaller scale.

4) FRAME C · SCHEDULE — three horizontal BOARDING PASSES.
   - Each pass is a wide card split by a perforated edge (10 small circles vertically) into a "stub" (left: class + name + route) and "body" (right: fare amount, cycle, note, inclusion bullets, CTA).
   - Featured (BUSINESS) pass: amber top stripe, slightly larger fare. Others: 1.5px #2a2a2a frame.
   - Fare amount in Oswald 700 at clamp(2.4rem,4.2vw,3.6rem). All-caps INCLUSION list with amber tick mark "▌" before each item.

5) FRAME D · OPERATORS — 6 cells, each an operator code badge (2–3 char ID in big Oswald) with operator full name below in mono. Bordered grid, no logos.

6) FRAME E · ANNOUNCEMENT — full-width quote presented as a PA announcement. Body in Oswald 600 at clamp(1.6rem,3vw,2.6rem), short attribution in mono. Section tag includes "PA · CH 1" overline.

7) FRAME F · BOARDING PASS — final CTA as one big horizontal boarding pass: PASSENGER input (email) on the left, mono FLIGHT/GATE meta in the middle, "CHECK IN" amber button on the right. Below: serial PNR mono line.

DISCIPLINE (do/don't):
- ONE amber. Reserved for: live beacon, primary CTA, hero accent word, featured stripe, ON TIME positive states. Never amber backgrounds across whole sections.
- Borders: 1.5px solid #2a2a2a for frames, 1px for inner rules. NEVER 8% opacity decoration.
- No gradients, no glow, no shadow except a single 0 1px 0 #000 highlight on raised rails.
- No animations beyond the flap kinetic and a 1.6s amber pulse on live beacons.
- Mobile (≤900px): hero board collapses to two stacked lines (line 2 shrinks to clamp(4rem,16vw,7rem)), status rail moves below hero as 2×2 grid, schedule passes stack vertically (featured first), gates grid becomes a single mono list (TIME + STATUS + FLIGHT + TO only, GATE/TOKEN as second row).
- Respect prefers-reduced-motion: kill all sf-* animations.

OUTPUT: tokens as CSS variables, sections 1–7 in order, complete React component with the Flap primitive above.`;

const promptKo = `B2B SaaS 랜딩 페이지를 *솔라리 스플릿-플랩 출발 안내판(FIDS)*으로 재구성합니다. 페이지는 *비행 정보 표시판 자체* — 진짜 검정 표면, 기계식 문자 셀, 단 하나의 앰버 액센트, 모든 곳에 기계식 플랩 키네틱.

메타포 (유일한 하나):
- 제품(디자인 시스템 콘솔)을 *공항 출발 안내판*으로 제시.
- 토큰 = 비행, 리전 = 터미널, 가격 등급 = 운임 클래스 (이코노미 / 비즈니스 / 퍼스트), CTA = 탑승권, 인용 = 안내방송, 고객사 = 운항사.
- 모든 섹션은 보드 어휘를 사용. "N°01–06" 앵커 금지, 포트폴리오 템플릿 금지.

팔레트 (콘솔 정체성 규칙에 따라 진짜 검정):
--sc-board #0a0a0a   페이지 + 보드 면
--sc-rail  #161616   상단 레일/헤더
--sc-cell  #141414   플랩 셀 뒷면
--sc-edge  #2a2a2a   가시 셀 분리선 (검정 환산 ≥22%)
--sc-glyph #ebebeb   주 문자색 (약간 차가운 오프화이트, *크림색 금지*)
--sc-mute  #6a6a6a
--sc-amber #ffb000   *유일한* 액센트 — 라이브 비콘, 주요 CTA, 히어로 액센트 글자, 추천 운임 스트라이프
--sc-rust  #c5523a   DELAYED 상태에만 한정

타이포: 디스플레이 'Oswald' / 'Bebas Neue' / 'Archivo Black' — 키 큰 컨덴스드 기계식 활자. 600/700. 보드 위는 *전부 대문자*. 모노 'JetBrains Mono' — 편명·시각·게이트·시리얼. 본문 'Inter' 400/500.

시그니처 키네틱:
모든 대문자가 첫 페인트 때 기계식 플랩으로 애니메이션:
@keyframes sf-flap-in {
  0%   { transform: rotateX(-92deg); opacity:0; filter: blur(4px); }
  35%  { transform: rotateX(18deg);  opacity:1; filter: blur(0); }
  62%  { transform: rotateX(-7deg); }
  100% { transform: rotateX(0); }
}
.sf-char { display:inline-block; transform-origin:50% 100%; backface-visibility:hidden;
  animation: sf-flap-in 0.46s cubic-bezier(.55,.05,.25,1) var(--sf-delay,0ms) backwards; }
문자 단위로 22-48ms 스태거. 필터 변경 시 게이트 행이 리키되며 다시 플립. prefers-reduced-motion 존중 → animation:none.

레이아웃 (6 프레임, 각각 풀-와이드, 번호 앵커 *금지*):

1) 상단 레일 — 좌: 브랜드 "STYLEBOOK INTL · OPS BOARD", 중앙: 라이브 인디케이터 ("DEPARTURES — LIVE" + 앰버 펄스), 우측 nav, 모노 시계.

2) 프레임 A · 출발 안내판 (히어로) — *지배적인 시네마틱 비주얼*.
   - 검정 "보드 월" 패널, 상단 레일 미묘한 경사.
   - 거대 플랩 3줄: SHIP / TOKENS / NOT TICKETS. 둘째 줄 clamp(7rem, 19vw, 16rem), tracking +0.04em, 흰 글리프, 가운데 단어 "TOKENS"는 *앰버*. 와이드 화면에서 글자가 *뷰포트 가장자리에서 잘림* — 보드가 뷰포트보다 큼.
   - 아래: 리드(Inter 400, ≤60ch, near-black 위 흰색), 굵게 강조된 두 구절. 주요 CTA "OPEN THE BOARD"(앰버 블록, 검정 잉크, 둥글기 ≤2px), 보조 "VIEW SCHEDULE →" 고스트 링크.
   - 우측 레일(모바일 위): 4셀(NEXT DEPART / ON TIME / BOARDING / IN FLIGHT). 라이브 셀에는 앰버 비콘 도트. 셀들은 1px #2a2a2a 그리드 공유. *드롭 섀도 금지*.

3) 프레임 B · 게이트 — *작동하는 출발 그리드*.
   - 필터 (TERMINAL / SECTOR / STATUS 칩). 선택 칩: 앰버 fill, 검정 잉크. 휴면 칩: 투명, 흰 잉크, 1px #2a2a2a 보더.
   - 7행 그리드: FLIGHT / TOKEN / TO / GATE / STATUS / TIME. TOKEN 컬럼 제외 모든 셀 플랩 애니메이션. STATUS 도트(BOARDING=앰버, ON TIME=흰, DELAYED=러스트, SCHEDULED=뮤트). 행 호버: 앰버 8% 워시, 트랜스폼 없음.
   - 우하단 모노 요약 라인.

4) 프레임 C · 시간표 — 3개의 가로 *탑승권*.
   - 각 패스는 천공된 가장자리(작은 원 10개 수직)로 "스텁"(좌: 클래스 + 이름 + 노선)과 "본체"(우: 운임·주기·노트·포함 항목·CTA)로 분할.
   - 추천(BUSINESS) 패스: 상단 앰버 스트라이프, 운임 살짝 더 큼. 나머지: 1.5px #2a2a2a 프레임.
   - 운임 Oswald 700, clamp(2.4rem, 4.2vw, 3.6rem). 포함 항목 대문자, 항목 앞 앰버 "▌" 표식.

5) 프레임 D · 운항사 — 6셀, 각 운항사 코드 뱃지(2-3자 ID, Oswald 큰 크기)와 모노 운항사 풀네임. 보더 그리드, 로고 없음.

6) 프레임 E · 안내방송 — 인용을 PA 안내방송으로. 본문 Oswald 600 clamp(1.6rem, 3vw, 2.6rem), 출처 모노. 섹션 태그에 "PA · CH 1" 오버라인.

7) 프레임 F · 탑승권 — 최종 CTA를 하나의 큰 가로 탑승권으로: 좌측 PASSENGER 입력(이메일), 중앙 모노 FLIGHT/GATE 메타, 우측 "CHECK IN" 앰버 버튼. 아래: PNR 시리얼 모노 라인.

규율 (할 것/말 것):
- 앰버 하나만. 라이브 비콘·주요 CTA·히어로 액센트 단어·추천 스트라이프·ON TIME 긍정 상태에 한정. *섹션 전체를 앰버 배경으로 칠하지 말 것*.
- 보더: 프레임 1.5px solid #2a2a2a, 내부 룰 1px. *8% 투명 장식 금지*.
- 그라디언트·글로우·섀도 금지. 단, 레일에 0 1px 0 #000 하이라이트 한 줄만 허용.
- 플랩 키네틱과 라이브 비콘의 1.6s 앰버 펄스 외 *애니메이션 금지*.
- 모바일(≤900px): 히어로 보드 2줄로 축약(둘째 줄 clamp(4rem,16vw,7rem)), 상태 레일 히어로 아래 2×2 그리드, 시간표 패스 세로 적층(추천 먼저), 게이트 그리드 단일 모노 리스트(TIME + STATUS + FLIGHT + TO만, GATE/TOKEN은 두 번째 줄).
- prefers-reduced-motion 존중: 모든 sf-* 애니메이션 비활성화.

출력: 위 토큰을 CSS 변수로, 섹션 1–7 순서대로, 위의 Flap 프리미티브 포함한 완전한 React 컴포넌트.`;

const promptJa = `B2B SaaSランディングページを*ソラリ・スプリットフラップ・出発案内板(FIDS)*として再構築する。ページは*飛行情報表示板そのもの* — 真の黒い表面、機械式文字セル、唯一のアンバー・アクセント、あらゆる箇所に機械式フラップ・キネティック。

メタファー(唯一):
- プロダクト(デザインシステム・コンソール)を*空港の出発案内板*として提示。
- トークン=フライト、リージョン=ターミナル、料金階層=運賃クラス(ECONOMY / BUSINESS / FIRST)、CTA=搭乗券、引用=PAアナウンス、顧客=運航社。
- 全セクションがボード語彙を使う。「N°01–06」アンカー禁止、ポートフォリオ・テンプレート禁止。

パレット(コンソール識別ルールに従い真の黒):
--sc-board #0a0a0a   ページ + ボード面
--sc-rail  #161616   レイズドレール/ヘッダー
--sc-cell  #141414   フラップセル裏面
--sc-edge  #2a2a2a   可視セル分離線(黒換算 ≥22%)
--sc-glyph #ebebeb   主文字色(やや冷たいオフホワイト、*クリーム禁止*)
--sc-mute  #6a6a6a
--sc-amber #ffb000   *唯一の*アクセント — ライブ・ビーコン、主要CTA、ヒーロー・アクセント文字、推奨運賃ストライプ
--sc-rust  #c5523a   DELAYED状態のみ

タイポグラフィ: ディスプレイ 'Oswald' / 'Bebas Neue' / 'Archivo Black' — 背の高いコンデンスド機械式書体。600/700。ボード上は*全て大文字*。モノ 'JetBrains Mono' — 便名・時刻・ゲート・シリアル。本文 'Inter' 400/500。

シグネチャ・キネティック:
全ての大文字が初回ペイント時に機械式フラップとしてアニメーション:
@keyframes sf-flap-in {
  0%   { transform: rotateX(-92deg); opacity:0; filter: blur(4px); }
  35%  { transform: rotateX(18deg);  opacity:1; filter: blur(0); }
  62%  { transform: rotateX(-7deg); }
  100% { transform: rotateX(0); }
}
.sf-char { display:inline-block; transform-origin:50% 100%; backface-visibility:hidden;
  animation: sf-flap-in 0.46s cubic-bezier(.55,.05,.25,1) var(--sf-delay,0ms) backwards; }
文字単位で22-48msスタガー。フィルタ変更時にゲート行が再キーされて再びフリップ。prefers-reduced-motion尊重→animation:none。

レイアウト(6フレーム、全幅、番号アンカー*禁止*):

1) トップレール — 左: ブランド「STYLEBOOK INTL · OPS BOARD」、中央: ライブ表示(「DEPARTURES — LIVE」+ アンバーパルス)、右側ナビ、モノクロック。

2) フレームA · 出発案内板(ヒーロー) — *支配的なシネマティック・ビジュアル*。
   - 黒い「ボードウォール」パネル、上部レール微妙なベベル。
   - 巨大フラップ3行: SHIP / TOKENS / NOT TICKETS。2行目 clamp(7rem, 19vw, 16rem)、tracking +0.04em、白グリフ、中央単語「TOKENS」は*アンバー*。ワイド画面で文字が*ビューポート端で切れる* — ボードがビューポートより大きい。
   - 下: リード(Inter 400、≤60ch、near-black上の白)、太字強調された2フラグメント。主要CTA「OPEN THE BOARD」(アンバーブロック、黒インク、角丸≤2px)、補助「VIEW SCHEDULE →」ゴーストリンク。
   - 右側レール(モバイル以上): 4セル(NEXT DEPART / ON TIME / BOARDING / IN FLIGHT)。ライブセルにアンバービーコンドット。セルは1px #2a2a2aグリッド共有。*ドロップシャドウ禁止*。

3) フレームB · ゲート — *作動する出発グリッド*。
   - フィルタ(TERMINAL / SECTOR / STATUSチップ)。選択チップ: アンバーfill、黒インク。休眠: 透明、白インク、1px #2a2a2aボーダー。
   - 7行グリッド: FLIGHT / TOKEN / TO / GATE / STATUS / TIME。TOKEN列以外全セルがフラップ・アニメーション。STATUSドット(BOARDING=アンバー、ON TIME=白、DELAYED=ラスト、SCHEDULED=ミュート)。行ホバー: アンバー8%ウォッシュ、トランスフォームなし。
   - 右下モノ要約行。

4) フレームC · 時刻表 — 3つの横*搭乗券*。
   - 各パスは穿孔エッジ(小円10個垂直)で「半券」(左: クラス+名前+路線)と「本体」(右: 運賃·周期·注記·包含項目·CTA)に分割。
   - 推奨(BUSINESS)パス: 上部アンバーストライプ、運賃やや大きい。他: 1.5px #2a2a2aフレーム。
   - 運賃Oswald 700、clamp(2.4rem, 4.2vw, 3.6rem)。包含項目大文字、項目前にアンバー「▌」マーク。

5) フレームD · 運航社 — 6セル、各運航社コードバッジ(2-3文字ID、Oswald大)とモノ運航社フルネーム。ボーダー・グリッド、ロゴなし。

6) フレームE · アナウンス — 引用をPAアナウンスとして。本文Oswald 600 clamp(1.6rem, 3vw, 2.6rem)、出典モノ。セクションタグに「PA · CH 1」オーバーライン。

7) フレームF · 搭乗券 — 最終CTAを1つの大きな横搭乗券として: 左PASSENGER入力(メール)、中央モノFLIGHT/GATEメタ、右「CHECK IN」アンバーボタン。下: PNRシリアル・モノ行。

規律(やる/やらない):
- アンバー1色のみ。ライブビーコン·主要CTA·ヒーロー·アクセント語·推奨ストライプ·ON TIME肯定状態のみ。*セクション全体をアンバー背景にしない*。
- ボーダー: フレーム1.5px solid #2a2a2a、内部1px。*8%透明装飾禁止*。
- グラデーション·グロー·シャドウ禁止。ただしレールに0 1px 0 #000ハイライト1行のみ許可。
- フラップ・キネティックとライブビーコンの1.6sアンバーパルス以外*アニメーション禁止*。
- モバイル(≤900px): ヒーローボード2行に縮約(2行目 clamp(4rem,16vw,7rem))、ステータスレール ヒーロー下に2×2グリッド、時刻表パス縦積み(推奨が先)、ゲートグリッド単一モノリスト(TIME + STATUS + FLIGHT + TOのみ、GATE/TOKENは第2行)。
- prefers-reduced-motion尊重: 全sf-*アニメーション無効化。

出力: 上記トークンをCSS変数として、セクション1–7順番に、上記Flapプリミティブを含む完全なReactコンポーネント。`;
