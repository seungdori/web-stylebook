import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Locale = 'en' | 'co' | 'ko' | 'ja';
type AppLang = Exclude<Locale, 'co'>;
type LocalizedCopy = Record<AppLang, string>;
const L = <T extends LocalizedCopy>(obj: T, lang: AppLang) => obj[lang];

// ============================================================
// CONCEPT — Pure Noir v5 · "Editorial + Replay" (additive)
// ============================================================
// Two distinct rhetorical modes stacked, not collapsed:
//
//   1) HERO — editorial drop-cap opener with marginalia rail. A
//      Libre Baskerville drop cap, serif prose with italic emphasis,
//      and a "Echelon does that." reveal. This establishes voice:
//      a writer's hand was here. The H1 lives below the prose, demoted.
//
//   2) REPLAY — sticky 4-stop time-rail (T-0 → T+5min → T+1hr → T+30d)
//      with horizontal time-slices on the right. Each slice has a
//      mono header strip, a slice headline (italic+700 verb), body,
//      and a product mock. As you scroll, the active stop tracks the
//      slice in view; a white progress line fills the rail behind it.
//
// Editorial = "why" (literary). Replay = "how" (mechanical demo).
// Then: integration logos → trust full-bleed → pricing → quote +
// footnote → final CTA → footer.
// ============================================================

const NAV = [
  { en: 'Product',   ko: '제품',     ja: 'プロダクト' },
  { en: 'Customers', ko: '고객사',   ja: '導入事例' },
  { en: 'Pricing',   ko: '가격',     ja: '料金' },
  { en: 'Changelog', ko: '체인지로그', ja: '更新履歴' },
  { en: 'Docs',      ko: '문서',     ja: 'ドキュメント' },
];

// ============================================================
// SVG wordmarks — integration partners (honest framing for a
// hypothetical product). Each mark is a typographic interpretation,
// not a pixel-perfect copy.
// ============================================================
type LogoName = 'slack' | 'pagerduty' | 'sentry' | 'github' | 'datadog' | 'jira' | 'notion';

function Logo({ name }: { name: LogoName }) {
  const common = { fill: 'currentColor', stroke: 'none' } as const;
  switch (name) {
    case 'slack':
      return (
        <svg viewBox="0 0 100 22" className="pn-logo" aria-label="Slack">
          <g {...common}>
            <rect x="2"  y="3"  width="4" height="9" rx="1.5" />
            <rect x="2"  y="14" width="9" height="4" rx="1.5" />
            <rect x="13" y="3"  width="4" height="9" rx="1.5" />
            <rect x="8"  y="3"  width="9" height="4" rx="1.5" />
          </g>
          <text x="24" y="16" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="-0.04em" {...common}>Slack</text>
        </svg>
      );
    case 'pagerduty':
      return (
        <svg viewBox="0 0 110 22" className="pn-logo" aria-label="PagerDuty">
          <rect x="2" y="4" width="14" height="14" rx="1" {...common} />
          <text x="22" y="16" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="-0.04em" {...common}>PagerDuty</text>
        </svg>
      );
    case 'sentry':
      return (
        <svg viewBox="0 0 100 22" className="pn-logo" aria-label="Sentry">
          <path d="M2 18 L10 4 L18 18 L14 18 L10 11 L6 18 Z" {...common} />
          <text x="22" y="16" fontSize="14" fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="-0.04em" {...common}>Sentry</text>
        </svg>
      );
    case 'github':
      return (
        <svg viewBox="0 0 100 22" className="pn-logo" aria-label="GitHub">
          <g {...common}>
            <circle cx="10" cy="11" r="8" />
            <rect x="6" y="16" width="8" height="6" fill="currentColor" />
          </g>
          <text x="22" y="16" fontSize="14" fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="-0.04em" {...common}>GitHub</text>
        </svg>
      );
    case 'datadog':
      return (
        <svg viewBox="0 0 100 22" className="pn-logo" aria-label="Datadog">
          <g {...common}>
            <path d="M2 16 Q2 4 12 4 Q16 4 16 9 L16 16 Z" />
            <circle cx="13" cy="9" r="1.6" fill="var(--pn-bg)" />
          </g>
          <text x="22" y="16" fontSize="14" fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="-0.04em" {...common}>Datadog</text>
        </svg>
      );
    case 'jira':
      return (
        <svg viewBox="0 0 100 22" className="pn-logo" aria-label="Jira">
          <g transform="translate(10, 11) rotate(45)" {...common}>
            <rect x="-6" y="-6" width="12" height="12" />
            <rect x="-6" y="-6" width="6" height="6" fill="var(--pn-bg)" />
          </g>
          <text x="22" y="16" fontSize="14" fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="-0.04em" {...common}>Jira</text>
        </svg>
      );
    case 'notion':
      return (
        <svg viewBox="0 0 100 22" className="pn-logo" aria-label="Notion">
          <rect x="2" y="3" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M6 16 L6 6 L10 6 L14 13 L14 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="miter" />
          <text x="24" y="16" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="-0.04em" {...common}>Notion</text>
        </svg>
      );
  }
}

const LOGOS: LogoName[] = ['slack', 'pagerduty', 'sentry', 'github', 'datadog', 'jira', 'notion'];

const TRUST = [
  { k: { en: 'SOC 2 Type II',   ko: 'SOC 2 Type II',   ja: 'SOC 2 Type II' },   v: { en: 'Audited annually',           ko: '연 1회 감사',                  ja: '年次監査済' } },
  { k: { en: 'ISO 27001',       ko: 'ISO 27001',       ja: 'ISO 27001' },       v: { en: 'Certified',                   ko: '인증 완료',                    ja: '認証取得済' } },
  { k: { en: 'HIPAA',           ko: 'HIPAA',           ja: 'HIPAA' },           v: { en: 'BAA available',               ko: 'BAA 체결 가능',                ja: 'BAA締結可' } },
  { k: { en: 'GDPR',            ko: 'GDPR',            ja: 'GDPR' },            v: { en: 'EU + US data residency',      ko: 'EU·US 데이터 리전',            ja: 'EU·US データレジデンシー' } },
  { k: { en: 'Uptime',          ko: '가동률',         ja: '稼働率' },          v: { en: '99.99 % across 12 months',    ko: '12개월 99.99 %',               ja: '12か月 99.99 %' } },
  { k: { en: 'Retention',       ko: '보관 기간',      ja: '保存期間' },        v: { en: 'Up to 10 years',              ko: '최대 10년',                    ja: '最大10年' } },
];

const PRICING = [
  {
    name:    { en: 'Free',         ko: '무료',        ja: '無料' },
    price:   { en: '$0',           ko: '$0',          ja: '$0' },
    period:  { en: 'forever',      ko: '평생',        ja: 'ずっと' },
    sub:     { en: 'For the engineer who\'s about to pitch this to their team lead.',  ko: '이걸 팀 리드한테 보여 주려는 엔지니어용.',  ja: 'これをチームリードに提案しようとしているエンジニアへ。' },
    cta:     { en: 'Start free',   ko: '시작',        ja: '開始' },
    features: [
      { en: '25 postmortems / mo',     ko: '월 25건',           ja: '月25件' },
      { en: 'Slack + PagerDuty',       ko: 'Slack + PagerDuty', ja: 'Slack + PagerDuty' },
      { en: '90-day retention',        ko: '90일 보관',         ja: '90日保存' },
    ],
    highlight: false,
  },
  {
    name:    { en: 'Team',         ko: '팀',          ja: 'チーム' },
    price:   { en: '$24',          ko: '$24',         ja: '$24' },
    period:  { en: 'per seat / month', ko: '시트 / 월', ja: 'シート / 月' },
    sub:     { en: 'For teams that ship every week and write postmortems they actually read.',  ko: '매주 배포하고, 나중에 다시 들춰보는 에러 보고서를 쓰는 팀용.',  ja: '毎週リリースし、本当に読み返すポストモーテムを書くチーム。' },
    cta:     { en: 'Start 14-day trial', ko: '14일 체험', ja: '14日トライアル' },
    features: [
      { en: 'Unlimited postmortems',    ko: '무제한',                  ja: '無制限' },
      { en: 'All integrations · SSO',   ko: '전체 연동 · SSO',         ja: '全連携 · SSO' },
      { en: 'Pattern search',           ko: '패턴 검색',                ja: 'パターン検索' },
      { en: '2-year retention',         ko: '2년 보관',                 ja: '2年保存' },
    ],
    highlight: true,
  },
  {
    name:    { en: 'Business',     ko: '비즈니스',    ja: 'ビジネス' },
    price:   { en: 'Custom',       ko: '맞춤',        ja: '個別' },
    period:  { en: 'volume + residency', ko: '볼륨 + 리전', ja: 'ボリューム + リージョン' },
    sub:     { en: 'For platforms whose lawyers and their lawyers all want to sign off.',  ko: '법무팀, 그리고 그 법무팀의 법무팀까지 사인해야 하는 플랫폼용.',  ja: '法務、そしてその法務まで承認を必要とするプラットフォーム。' },
    cta:     { en: 'Book a demo',  ko: '데모',        ja: 'デモ' },
    features: [
      { en: 'Everything in Team',       ko: 'Team 전체',                ja: 'Team の全機能' },
      { en: 'SOC 2 · ISO · HIPAA',     ko: 'SOC 2 · ISO · HIPAA',     ja: 'SOC 2 · ISO · HIPAA' },
      { en: 'BYO model · VPC',          ko: 'BYO 모델 · VPC',           ja: 'BYO モデル · VPC' },
      { en: 'Named SRE',                ko: '전담 SRE',                 ja: '専任 SRE' },
    ],
    highlight: false,
  },
];

// Initial pool of incident rows shown in the T-0 mock.
const INCIDENT_POOL = [
  { id: 'INC-0421', t: { en: 'Stripe webhook backlog spike', ko: 'Stripe 웹훅 백로그 급증', ja: 'Stripe webhook バックログ急増' }, s: { en: 'P1 · 18 min', ko: 'P1 · 18분', ja: 'P1 · 18分' }, a: 'priya · raj' },
  { id: 'INC-0420', t: { en: 'Email send queue saturation', ko: '이메일 발송 큐 포화', ja: 'メール送信キュー飽和' }, s: { en: 'P2 · 41 min', ko: 'P2 · 41분', ja: 'P2 · 41分' }, a: 'mei' },
  { id: 'INC-0418', t: { en: '500s on /v1/usage', ko: '/v1/usage 500 오류', ja: '/v1/usage で500発生' }, s: { en: 'P0 · 6 min', ko: 'P0 · 6분', ja: 'P0 · 6分' }, a: 'tomi · ali' },
  { id: 'INC-0417', t: { en: 'OAuth grant flow slow', ko: 'OAuth 승인 흐름 지연', ja: 'OAuth grant フロー遅延' }, s: { en: 'P3 · 2 h', ko: 'P3 · 2시간', ja: 'P3 · 2時間' }, a: 'kai' },
  { id: 'INC-0416', t: { en: 'Sentry rate-limit hit', ko: 'Sentry rate-limit 도달', ja: 'Sentry rate-limit 到達' }, s: { en: 'P2 · 22 min', ko: 'P2 · 22분', ja: 'P2 · 22分' }, a: 'priya' },
  { id: 'INC-0415', t: { en: 'CDN purge missed eu-west', ko: 'eu-west CDN purge 누락', ja: 'eu-west CDN purge 漏れ' }, s: { en: 'P3 · 1.4 h', ko: 'P3 · 1.4시간', ja: 'P3 · 1.4時間' }, a: 'jules' },
];

const INCIDENT_POOL_EXTRA = [
  { id: 'INC-0422', t: { en: 'Kafka rebalance storm', ko: 'Kafka rebalance 폭주', ja: 'Kafka rebalance ストーム' }, s: { en: 'P2 · 11 min', ko: 'P2 · 11분', ja: 'P2 · 11分' }, a: 'kai · mei' },
  { id: 'INC-0423', t: { en: 'Auth0 social login error spike', ko: 'Auth0 소셜 로그인 오류 급증', ja: 'Auth0 ソーシャルログイン障害急増' }, s: { en: 'P1 · 24 min', ko: 'P1 · 24분', ja: 'P1 · 24分' }, a: 'priya' },
  { id: 'INC-0424', t: { en: 'pg replica lag · checkout', ko: 'pg replica 지연 · checkout', ja: 'pg replica 遅延 · checkout' }, s: { en: 'P0 · 4 min', ko: 'P0 · 4분', ja: 'P0 · 4分' }, a: 'tomi' },
  { id: 'INC-0425', t: { en: 'Sentry 429 from ingest worker', ko: 'ingest worker의 Sentry 429', ja: 'ingest worker の Sentry 429' }, s: { en: 'P3 · 38 min', ko: 'P3 · 38분', ja: 'P3 · 38分' }, a: 'jules' },
  { id: 'INC-0426', t: { en: 'CDN MISS rate · 38 % on jp-east', ko: 'jp-east CDN MISS 비율 · 38%', ja: 'jp-east CDN MISS率 · 38%' }, s: { en: 'P2 · 17 min', ko: 'P2 · 17분', ja: 'P2 · 17分' }, a: 'ali' },
];

// 4 stops on the replay timeline. Order matters — JS uses index for active state.
const RAIL = [
  {
    id: 't-0',
    t:    { en: 'T-0',       ko: 'T-0',     ja: 'T-0' },
    when: { en: '14:18 KST', ko: '14:18 KST', ja: '14:18 KST' },
    what: { en: 'Detected',  ko: '감지',    ja: '検知' },
  },
  {
    id: 't-5m',
    t:    { en: 'T+5min',    ko: 'T+5분',   ja: 'T+5分' },
    when: { en: '14:23 KST', ko: '14:23 KST', ja: '14:23 KST' },
    what: { en: 'Drafted',   ko: '초안',    ja: '起草' },
  },
  {
    id: 't-1h',
    t:    { en: 'T+1hr',     ko: 'T+1시간', ja: 'T+1時間' },
    when: { en: '15:18 KST', ko: '15:18 KST', ja: '15:18 KST' },
    what: { en: 'Tracked',   ko: '추적',    ja: '追跡' },
  },
  {
    id: 't-30d',
    t:    { en: 'T+30day',   ko: 'T+30일',  ja: 'T+30日' },
    when: { en: '2026-06-15', ko: '2026-06-15', ja: '2026-06-15' },
    what: { en: 'Remembered', ko: '기억',   ja: '記憶' },
  },
];

const COPY = {
  brand:        { en: 'Echelon',         ko: 'Echelon',        ja: 'Echelon' },
  navCta:       { en: 'Open Echelon',    ko: 'Echelon 열기',   ja: 'Echelon を開く' },
  navSignIn:    { en: 'Sign in',         ko: '로그인',         ja: 'ログイン' },
  mockWorkspaces: { en: 'Workspaces', ko: '워크스페이스', ja: 'ワークスペース' },
  mockViews: { en: 'Views', ko: '보기', ja: 'ビュー' },
  mockOpenView: { en: 'Open · 3', ko: '열림 · 3', ja: '未解決 · 3' },
  mockThisWeekView: { en: 'This week · 12', ko: '이번 주 · 12', ja: '今週 · 12' },
  mockPatternView: { en: 'Pattern matches · 4', ko: '패턴 일치 · 4', ja: 'パターン一致 · 4' },
  mockFilter: { en: 'Filter', ko: '필터', ja: 'フィルター' },
  mockSort: { en: 'Sort', ko: '정렬', ja: '並び替え' },
  mockGroup: { en: 'Group', ko: '그룹', ja: 'グループ' },
  mockPatternMatch: { en: 'Pattern match', ko: '패턴 일치', ja: 'パターン一致' },
  mockDrafting: { en: 'drafting', ko: '초안 작성 중', ja: '下書き中' },
  mockDraftReady: { en: 'draft ready', ko: '초안 준비', ja: '下書き準備完了' },
  mockTimelineFoot: { en: '4 sources · 23 events · 1 cause', ko: '소스 4개 · 이벤트 23개 · 원인 1개', ja: '4ソース · 23イベント · 原因1件' },
  mockExportDraft: { en: 'Export draft', ko: '초안 내보내기', ja: '下書きを書き出す' },
  mockTracked:  { en: 'tracked',         ko: '추적 중',        ja: '追跡中' },
  mockFollowupFoot: {
    en: 'auto-tracked from postmortem · linked to GitHub PRs',
    ko: '보고서에서 자동 추적 · GitHub PR과 연결',
    ja: 'ポストモーテムから自動追跡 · GitHub PRに接続',
  },
  mockViewAll: { en: 'View all', ko: '전체 보기', ja: 'すべて見る' },
  mockSimilarIncidents: { en: '4 similar incidents', ko: '유사한 에러 4건', ja: '類似インシデント4件' },
  mockSimilarity: { en: 'sim', ko: '유사도', ja: '類似度' },
  mockPatternFoot: {
    en: 'cause-pattern match · BYO embedding',
    ko: '원인 패턴 매칭 · BYO embedding',
    ja: '原因パターン照合 · BYO embedding',
  },
  mockOpenReport: { en: 'Open report', ko: '보고서 열기', ja: 'レポートを開く' },

  announce:     { en: 'Now in beta · Pattern search v2 ships next week',  ko: '베타 진행 중 · 다음 주, 패턴 검색 v2 출시',  ja: 'ベータ進行中 · 来週パターン検索 v2 リリース' },
  announceCta:  { en: 'Read the note',  ko: '노트 보기',  ja: 'ノートを見る' },

  // Editorial hero — small mono kicker above the prose
  // KO: "에러 대응 보고서" — user-preferred term. Developer-friendly,
  // unambiguous, no disability connotation (avoid 장애), no homophone (avoid 사고).
  heroEyebrow:  { en: 'Incident postmortems · built for the team',  ko: '에러 대응 보고서 · 팀을 위한 도구',  ja: 'インシデント・ポストモーテム · チームのためのツール' },

  // Drop-cap prose, paragraph-split for readability.
  // '\n\n' = paragraph break. '\n' = soft line break (meaning unit).
  // '*' delimits italic emphasis spans.
  heroEditorial: {
    en: 'We stopped writing postmortems three years ago.\nThe fourth time we had to re-debug the same webhook backlog — we were done.\n\nWhat we wanted was simple.\nA tool that would *draft itself* during the incident,\nand *chase every follow-up* until it shipped.\n\nAnd when something like it happened again,\nwould *surface the four other times* it already had.',
    ko: '3년 전, 같은 웹훅 백로그를 *네 번째로* 다시 들여다본 날.\n우리는 에러 보고서를 손으로 쓰는 일을 그만뒀습니다.\n\n우리가 원했던 건 단순합니다.\n에러 대응 중에 *보고서 초안을 자동으로 써 주고*,\n후속 작업이 *배포될 때까지 추적하는* 도구.\n\n그리고 비슷한 일이 다시 생기면,\n*전에 네 번 있었다*는 걸 먼저 *알려 주는* 도구.',
    ja: '3年前、同じ webhook バックログを *4回目* に追い直した日。\n私たちはポストモーテムを手で書くのをやめました。\n\n欲しかったのは単純な道具です。\nインシデント進行中に *下書きを自動で生成し*、\n後続作業が *リリースされるまで追いかけてくれる* 道具。\n\nそして似たことが再び起きた時に、\n*過去に4回あった* ことを *先に教えてくれる* 道具。',
  },
  // Single line — Echelon's brand font + colour give it visual weight
  // without needing a line break for hierarchy.
  heroEditorialClose: {
    en: 'Echelon does that.',
    ko: 'Echelon이 바로 그 일을 합니다.',
    ja: 'Echelon が、その役を担います。',
  },
  // Marginalia — small mono annotations in the left gutter alongside hero
  heroMarginalia: [
    { y: '01', en: 'see also: pattern search',  ko: 'see also: 패턴 검색',  ja: 'see also: パターン検索' },
    { y: '02', en: 'updated 2026·05·16',         ko: 'updated 2026·05·16',   ja: 'updated 2026·05·16' },
    { y: '03', en: 'reading time · 1 min',       ko: 'reading time · 1 min', ja: 'reading time · 1 min' },
  ],

  // Mixed-weight H1 — the verb gets italic + 700.
  // Used in editorial hero (demoted byline below the prose) and recycled
  // in the final CTA via ctaHead.
  openerH: {
    en:  { a: 'Stop ', b: 'forgetting', c: '\nwhy things broke.' },
    ko:  { a: '왜 그랬는지,\n', b: '잊지', c: ' 마세요.' },
    ja:  { a: 'なぜそうなったのか、\n', b: '忘れない', c: '。' },
  },
  openerCtaA:   { en: 'Get a demo',     ko: '데모 신청',  ja: 'デモを予約' },
  openerCtaB:   { en: 'Read the docs',  ko: '문서',      ja: 'ドキュメント' },

  // Hero → Replay bridge. A small mono link that pivots the reader from
  // the editorial into the demo. The big H1 + CTAs live in the final CTA.
  heroCue:      { en: 'See how it works',  ko: '어떻게 작동하는지 보기',  ja: '実際の動きを見る' },

  // Replay-section intro — a small bridge line that sits ABOVE the rail,
  // signalling "now look at the actual mechanics."
  replayIntro:  { en: 'Watch one incident move through Echelon.',  ko: '에러 한 건이 Echelon을 거쳐 가는 과정을 보세요.',  ja: '1件のインシデントが Echelon を通る様子を見る。' },

  // Replay rail title
  replayTitle:  { en: 'Replay · INC-0421',  ko: '리플레이 · INC-0421',  ja: 'リプレイ · INC-0421' },

  // ---- Slice 1 · T-0 · Detected ----
  slice1State:  { en: 'Triaging',  ko: '분류 중',  ja: '分類中' },
  slice1H: {
    en:  { a: 'An incident lands ', b: 'as a single row', c: '.' },
    // KO: "에러" — developer-natural term, no homophone, no disability concern.
    ko:  { a: '에러는 ', b: '한 줄', c: '로 도착합니다.' },
    ja:  { a: 'インシデントは ', b: '一行', c: 'で届く。' },
  },
  slice1Body: {
    en: 'Same place, same shape, every time. ID, title, severity, owner. Not a flood of cards or a wall of alerts — one row, in the same queue you triage from every day. This is where the work begins.',
    ko: '항상 같은 자리, 같은 모양으로 도착합니다. ID, 제목, 심각도, 담당. 카드가 쏟아지지도, 알림이 벽처럼 쌓이지도 않습니다 — 매일 보던 그 한 줄. 작업은 여기서 시작합니다.',
    ja: 'いつも同じ場所、同じ形。ID、タイトル、重大度、担当者。カードの嵐でもアラートの壁でもなく — 毎日トリアージするキューの一行。作業はここから始まります。',
  },

  // ---- Slice 2 · T+5min · Drafted ----
  slice2State:  { en: 'Auto-drafting',  ko: '자동 초안',  ja: '自動起草' },
  slice2H: {
    en:  { a: 'A timeline ', b: 'before the meeting', c: '.' },
    ko:  { a: '회의 전에 ', b: '도착하는', c: '\n정확한 타임라인.' },
    ja:  { a: '会議の前に ', b: '届く', c: '\n正確なタイムライン。' },
  },
  slice2Body: {
    en: 'Echelon ingests Slack, PagerDuty, Sentry, GitHub, and your runbooks during the incident. By the time you sit down, the timeline is deduplicated, time-zoned, and attributed to source.',
    ko: '에러 대응 중에 Echelon이 Slack · PagerDuty · Sentry · GitHub · 런북을 함께 읽습니다. 회의 자리에 앉을 때쯤이면 타임라인은 중복이 정리되고, 시간대가 맞춰지고, 출처까지 적혀 있습니다.',
    ja: 'インシデントの最中に、Echelon が Slack · PagerDuty · Sentry · GitHub · ランブックをまとめて読み込みます。会議の席に着く頃には、タイムラインは重複が整理され、タイムゾーンが揃い、出典まで記されています。',
  },

  // ---- Slice 3 · T+1hr · Tracked ----
  slice3State:  { en: '4 of 7 shipped',  ko: '7건 중 4건 배포',  ja: '7件中4件リリース' },
  slice3H: {
    en:  { a: 'Followups, ', b: 'tracked', c: '\nuntil they ship.' },
    ko:  { a: '후속 작업이 ', b: '배포될', c: '\n때까지 추적합니다.' },
    ja:  { a: '後続作業を ', b: 'リリース', c: 'まで追跡。' },
  },
  slice3Body: {
    en: 'Action items from the postmortem become tracked tasks — owner, due date, source PR. When the PR merges, the row strikes through. No copy-pasting into Jira, no "did anyone do this?" three weeks later.',
    ko: '보고서의 후속 작업이 그대로 추적됩니다 — 담당, 기한, 출처 PR. PR이 머지되면 줄이 그어집니다. Jira로 옮겨 적을 일도, 3주 뒤에 "이거 누가 했죠?" 물어볼 일도 없습니다.',
    ja: 'ポストモーテムのアクションアイテムがそのまま追跡対象に — 担当者、期日、ソース PR。PR がマージされれば行が打ち消されます。Jira に転記する必要も、3週間後に「これ誰がやりましたっけ?」と聞く必要もありません。',
  },

  // ---- Slice 4 · T+30day · Remembered ----
  // Action-first headline: WHEN + WHAT + WHERE all explicit.
  // KO rewrite: drop all English jargon (임베딩/매칭/라이브러리/핀해/패턴).
  // Korean reader gets native prose, not transliterated SaaS English.
  slice4State:  { en: 'Auto-matched on arrival',  ko: '들어오면 자동 대조',  ja: '到着時に自動照合' },
  slice4H: {
    en:  { a: 'When the next one lands, ', b: 'the four other times', c: '\nare right there beside it.' },
    ko:  { a: '새 에러가 들어오면, ', b: '비슷한 과거 네 건', c: '이\n바로 옆에 따라붙습니다.' },
    ja:  { a: '次が届いた瞬間に、', b: '過去にあった4回', c: 'が\nすぐ横に並びます。' },
  },
  slice4Body: {
    en: 'Every postmortem is embedded by cause pattern — not by keyword. When a new incident is triaged, Echelon matches it against the library automatically and pins the closest past cases beside it. You see the four other times this happened before you start typing the new postmortem. Stop relearning the same lesson every quarter.',
    ko: 'Echelon은 과거 보고서를 "원인의 모양"으로 정리해 둡니다. 키워드가 아니라 에러의 구조로 비교하기 때문에, 새 에러가 들어오는 순간 가장 비슷한 과거 사례가 바로 옆에 따라붙습니다. 새 보고서의 첫 줄을 쓰기 전에, 같은 일이 네 번 있었다는 걸 먼저 알게 됩니다. 같은 교훈을 분기마다 다시 배울 일이 없습니다.',
    ja: 'Echelon は過去のポストモーテムを原因の型で整理します。キーワードではなく原因の構造で照合するので、新しいインシデントを分類した瞬間、最も近い過去事例が隣に並びます。新しいポストモーテムの一行目を書く前に、同じことが4回あったと先に分かります。同じ教訓を四半期ごとに学び直さずに済みます。',
  },

  logoEyebrow:  { en: 'Plugs into the tools your team already runs on',  ko: '팀이 이미 쓰는 도구들과 연동됩니다',  ja: 'チームがすでに使っているツールにそのままつながります' },

  trustTag:     { en: 'Trust',             ko: '신뢰',          ja: '信頼' },
  trustHead:    { en: 'Enterprise-ready\nout of the box.', ko: '처음부터\n엔터프라이즈에 바로.',  ja: 'はじめから\nエンタープライズ対応。' },

  pricingTag:   { en: 'Pricing',           ko: '가격',          ja: '料金' },
  pricingHead:  { en: 'Plain numbers.\nNo "contact us" for the first plan.', ko: '숨김 없는 가격.\n첫 플랜부터 "문의하기" 없이.',  ja: '明快な数字。\n最初のプランに「お問い合わせ」なし。' },

  quote: {
    en: 'We stopped writing postmortems the week we adopted Echelon.\nBy the time the team sits down, the draft is ninety percent there — and the meeting is for deciding, not transcribing.',
    ko: 'Echelon을 도입한 주에 우리 손으로 에러 보고서를 쓰는 일을 그만뒀습니다.\n팀이 자리에 앉을 때쯤 초안은 90 % 완성되어 있고 — 회의는 옮겨 적는 자리가 아니라 결정하는 자리가 됩니다.',
    ja: 'Echelon を導入した週から、ポストモーテムを手で書くのをやめた。\nチームが席に着く頃には下書きは 90 % 完成しており、会議は転記の場ではなく意思決定の場になる。',
  },
  quoteBy: { en: 'Priya N. · SRE Lead at a pilot team',  ko: 'Priya N. · 파일럿 팀 SRE 리드',     ja: 'Priya N. · パイロット・チーム SRE リード' },
  quoteFootnote: {
    en: 'Priya hadn\'t agreed we could quote her when she said this. She agreed later, in a chat message we screenshotted with her permission. Names and companies on this page are illustrative — Echelon is a design sample.',
    ko: 'Priya가 이 말을 했을 때는 아직 인용 허가를 받기 전이었습니다. 며칠 뒤 채팅으로 허락해 줬고, 우리는 그 허락을 받아 메시지를 캡처했습니다. 이 페이지의 이름·회사는 설명용 가상 정보이며, Echelon은 디자인 샘플입니다.',
    ja: 'この発言をした時点では、Priya はまだ引用を承諾していませんでした。数日後にチャットで承諾してくれたので、本人の了承を得てそのメッセージをキャプチャしました。本ページの名前・会社は説明用の架空情報であり、Echelon はデザイン・サンプルです。',
  },

  ctaHead: { en: 'Stop forgetting why things broke.', ko: '왜 그랬는지, 잊지 마세요.',  ja: 'なぜそうなったのか、忘れない。' },
  ctaSub:  { en: 'Free for pilots. Fourteen-day trial for teams. No card required.',  ko: '파일럿 무료. 팀은 14일 체험. 카드 등록 없음.',  ja: 'パイロット無料。チームは14日トライアル。カード登録不要。' },
  ctaA:    { en: 'Get a demo',           ko: '데모 신청',           ja: 'デモを予約' },
  ctaB:    { en: 'View the changelog',     ko: '체인지로그 보기',         ja: '更新履歴を見る' },

  footerCols: [
    {
      head:  { en: 'Product',     ko: '제품',         ja: 'プロダクト' },
      items: [
        { en: 'Timeline',           ko: '타임라인',         ja: 'タイムライン' },
        { en: 'Pattern search',     ko: '패턴 검색',        ja: 'パターン検索' },
        { en: 'Integrations',       ko: '연동',             ja: '連携' },
        { en: 'Changelog',          ko: '체인지로그',       ja: '更新履歴' },
      ],
    },
    {
      head:  { en: 'Resources',   ko: '리소스',       ja: 'リソース' },
      items: [
        { en: 'Docs',               ko: '문서',             ja: 'ドキュメント' },
        { en: 'API reference',      ko: 'API 레퍼런스',     ja: 'API リファレンス' },
        { en: 'Postmortem library', ko: '보고서 라이브러리', ja: 'ポストモーテム・ライブラリ' },
        { en: 'Field notes',        ko: '현장 기록',         ja: '現場記録' },
      ],
    },
    {
      head:  { en: 'Company',     ko: '회사',         ja: '会社' },
      items: [
        { en: 'About',              ko: '소개',             ja: '会社概要' },
        { en: 'Careers · 6',        ko: '채용 · 6명',        ja: '採用 · 6名' },
        { en: 'Security',           ko: '보안',             ja: 'セキュリティ' },
        { en: 'Contact',            ko: '연락',             ja: 'お問い合わせ' },
      ],
    },
  ],
  footColo: { en: 'Echelon, Inc. · San Francisco · Seoul · Berlin · 2026',  ko: 'Echelon, Inc. · San Francisco · Seoul · Berlin · 2026',  ja: 'Echelon, Inc. · San Francisco · Seoul · Berlin · 2026' },
  footStatus: { en: 'All systems normal',  ko: '모든 시스템 정상',  ja: '全システム正常' },
  footTerms: [
    { en: 'Status',  ko: '상태',  ja: 'ステータス' },
    { en: 'Privacy', ko: '개인정보', ja: 'プライバシー' },
    { en: 'Terms',   ko: '약관',  ja: '利用規約' },
  ],

  hover: {
    title: { en: 'Stripe webhook backlog spike', ko: 'Stripe 웹훅 백로그 급증', ja: 'Stripe webhook バックログ急増' },
    note:  { en: 'Pattern match · 3 similar in 90 days', ko: '패턴 일치 · 90일 내 유사 3건', ja: 'パターン一致 · 90日以内に類似3件' },
    open:  { en: 'Open report →', ko: '보고서 →', ja: 'レポート →' },
  },
} as const;

const promptEn = `Dark-mode SaaS landing — "Editorial + Replay" structure. Two distinct rhetorical modes stack: a literary editorial-prose hero that establishes voice, then a sticky-rail timeline that demonstrates mechanics. Standard SaaS infrastructure (logos / trust / pricing / quote / final CTA / footer) closes. Restrained, opinionated, chromaless except for a single brand accent.

## Aesthetic identity
- Dark mode, near-black base (#08090A), surface (#0F0F11), borders #1F1F23 → #3A3A3F (hairlines, never visible above ~25% white).
- Body emphasis ladder: text-hi #FAFAFA → mid #A1A1A8 → low #6E6E76 → soft #4A4A52. Body prose against the dark base reads #D4D4D8 (one step brighter than mid) at weight 500 — serif on dark needs more luminance than sans.
- ONE brand accent colour (e.g. #DAA520 deep goldenrod) used EXCLUSIVELY on the brand wordmark — never elsewhere on the page.
- ONE brand display font (e.g. Space Grotesk 700) used EXCLUSIVELY on the brand wordmark — even inside italic serif prose, the brand mark stays UPRIGHT in its own font, reading like a sticker, not a word.

## Type pairing
- Inter (sans) — body, display headings, nav, mocks.
- Serif with East-Asian fallback (e.g. Libre Baskerville + Noto Serif KR) — editorial drop-cap prose ONLY.
- JetBrains Mono (mono) — labels, timestamps, mock chrome, marginalia.
- Space Grotesk (geometric grotesque) — brand wordmark ONLY.
- ss01 + ss03 stylistic alts on display headings.

## Architecture
1. NAV (sticky, top:0, blurred) — brand lockup uses brand colour + brand font on icon and wordmark.
2. EDITORIAL HERO — voice. Layout: narrow sticky marginalia rail (~160px) of small mono micro-notes (01/02/03 — see also / updated / reading time) on the left + main column (~720px) on the right.
   - Main column flow: tiny announce pill → mono eyebrow → drop-cap serif prose in 3 paragraphs (soft line breaks at meaning units inside paragraphs; *italic emphasis* on key phrases at weight 700; drop cap on FIRST character of FIRST paragraph for Latin scripts only, ~4.2em float-left) → italic serif close that ends with the brand wordmark → mono scroll-cue link ("↓ see how it works") with a hairline underline that pivots to the next section.
3. REPLAY — mechanics. Sticky 4-stop vertical time-rail (~220px wide) on the left + 4 stacked horizontal time-slices on the right.
   - Rail: 1px vertical spine, one dot per stop. A white "progress" line fills behind via a custom property set by a scroll listener (rAF + ~30% from top trigger line). Past = filled grey dot. Active = filled white dot + 3px soft halo. Future = empty ring. Click any pill → smooth scroll to slice.
   - Each slice: small mono header strip (kicker / timestamp / state pill margin-left:auto) → big italic+700-verb headline (a regular phrase, italic verb sandwiched, regular phrase — with soft line break) → body prose → product mock with chrome (file path + ⌘K kbd + traffic-light dots).
   - Four mocks, each a different shape: a list view with one pinned row carrying a persistent hover card while tail rows slow-cycle (~10s); a multi-source SVG timeline with event bars and a dashed marker; a checklist with three state variants (done / open / overdue) showing pill style differences; a search-pattern results list with similarity scores.
4. LOGO STRIP — 7 hand-drawn SVG wordmarks at ~50% opacity, lifting to 100% on hover.
5. TRUST — FULL-BLEED strip on surface colour with 96px vertical padding, 6 KV pairs in a 3-col hairline grid.
6. PRICING — 3 tiers, middle one highlighted with subtle inset shadow, persona-voice subtitles.
7. QUOTE — italic display quote on serif + a small transparency footnote.
8. FINAL CTA — centered card on surface. The page's big H1 line lives HERE, not in the hero (the hero ends on the editorial close).
9. FOOTER — brand lockup + 3 link columns + status dot.

## Motion vocabulary
- 700ms reveal on scroll (cubic-bezier .22 .61 .36 1) for any [data-reveal] element.
- 320ms rail progress fill.
- 240ms colour transitions.
- One slow content cycle (~10s) somewhere on the page.
- prefers-reduced-motion disables everything.

## Vertical rhythm
First content should sit ~150px from viewport top, not 300+. Override outer shell padding aggressively (e.g. 16–20px) and tighten the hero's top margin (~36px desktop / ~40px mobile).

## Mobile (≤880)
The vertical rail flattens to a horizontal pill stepper above the slices; active pill expands to show "WHEN WHAT" inline. Hover affordances are removed (no hover on touch). Mock toolbars wrap. Drop cap downscales. State pills hide on the smallest screens.

## Distinctive moves (what makes this aesthetic memorable)
1. Editorial drop cap + marginalia rail in a SaaS landing — borrowed from print publishing.
2. Sticky time-rail with white progress fill — turns the middle of the page into a demo that "unfolds over time" while you scroll.
3. Chromaless palette + single brand accent — the brand mark POPS every time, with no other colour competing.
4. Brand mark always upright in its own font — even inside italic serif prose, it reads as a logo.

## DO NOT
- Put accent colour anywhere except the brand mark.
- Apply italic to the brand mark even when surrounding text is italic.
- Strip either the editorial hero or the Replay — the page's identity is the pairing of voice + mechanics.
- Reduce the rail to decoration — it must update its active state on scroll AND act as in-page navigation.
- Use a templated SaaS rhythm (hero + features grid + CTA). This page's whole point is to invert that.

Reusable for any product where you want both *voice* (a writer's hand) and *demo* (a mechanic unfolding). Swap the brand mark, the wordmarks, the metric names, and the product mocks — keep the architecture.`;

const promptKo = `다크모드 SaaS 랜딩 — "Editorial + Replay" 구조. 두 가지 다른 *수사* 가 쌓인다: *목소리* 를 확립하는 문학적 editorial-prose 히어로, 이어서 *작동 방식* 을 시연하는 sticky-rail 타임라인. 마지막은 표준 SaaS 인프라(로고 / trust / pricing / quote / final CTA / footer)로 닫힌다. 절제된, 의견 있는, 단 하나의 브랜드 액센트를 제외하고 chromaless.

## 미적 정체성
- 다크모드, near-black 베이스 (#08090A), surface (#0F0F11), 보더는 hairline 만 (#1F1F23 → #3A3A3F).
- Body 위계: text-hi #FAFAFA → mid #A1A1A8 → low #6E6E76 → soft #4A4A52. 다크 위 본문 prose 는 #D4D4D8 (mid 보다 한 단계 밝게) + weight 500 — serif 는 dark 위에서 sans 보다 더 luminance 필요.
- *단 하나의* 브랜드 액센트 컬러 (예: #DAA520 deep goldenrod) — 브랜드 워드마크에만 전용, 다른 어디에도 사용 금지.
- *단 하나의* 브랜드 디스플레이 폰트 (예: Space Grotesk 700) — 브랜드 워드마크에만 전용. 주변 italic serif 안에서도 브랜드는 항상 UPRIGHT 으로 자기 폰트 유지 → 단어가 아닌 *스티커* 처럼 읽힘.

## 타입 페어링
- Inter (sans) — 본문, 디스플레이, nav, 모크.
- Serif + East-Asian fallback (예: Libre Baskerville + Noto Serif KR) — editorial drop-cap prose 전용.
- JetBrains Mono (mono) — 라벨, 타임스탬프, 모크 chrome, 마지널리아.
- Space Grotesk (geometric grotesque) — 브랜드 워드마크 전용.
- 디스플레이 헤드라인에 ss01 + ss03 stylistic alt.

## 페이지 구조
1. NAV (sticky, top:0, blurred) — 브랜드 lockup은 아이콘과 워드마크 둘 다 브랜드 컬러 + 브랜드 폰트.
2. EDITORIAL HERO — 목소리. 레이아웃: 좌측에 좁은 sticky 마지널리아 rail (~160px) 작은 mono 마이크로 노트 (01/02/03 — see also / updated / reading time) + 우측에 메인 컬럼 (~720px).
   - 메인 컬럼 흐름: 작은 announce pill → mono eyebrow → drop-cap serif prose 3 문단 (문단 안에 의미단위 soft 줄바꿈; 핵심 구절에 *이탤릭 강조* + weight 700; drop cap 은 라틴 스크립트에서만 첫 문단 첫 글자에 ~4.2em float-left) → italic serif close 가 브랜드 워드마크로 끝남 → mono scroll-cue 링크 ("↓ 어떻게 작동하는지 보기") hairline 언더라인으로 다음 섹션 pivot.
3. REPLAY — 메커닉. 좌측에 sticky 4-stop 세로 time-rail (~220px wide) + 우측에 가로 4 stacked time-slices.
   - Rail: 1px 세로 spine, stop 마다 점 1개. 흰색 "progress" 라인이 scroll listener (rAF + ~30% from top 트리거) 가 set 한 custom property 로 active 점 뒤를 채움. Past = 회색 채워짐. Active = 흰색 채워짐 + 3px soft halo. Future = 빈 ring. Pill 클릭 → 해당 slice 로 smooth scroll.
   - 각 slice: 작은 mono header strip (kicker / 타임스탬프 / state pill margin-left:auto) → 큰 italic+700-동사 헤드라인 (일반 구절 — italic 동사 sandwich — 일반 구절, soft 줄바꿈 포함) → body prose → 제품 모크 + chrome (file path + ⌘K kbd + traffic-light dots).
   - 모크 4개, 각각 다른 형태: 0행 PINNED + 영구 hover 카드 + 꼬리 행 10초 slow-cycle 리스트 뷰 / event bar 와 dashed marker 가 있는 멀티-소스 SVG 타임라인 / 3가지 state 변형 (done / open / overdue) 보여주는 체크리스트 / similarity score 가 있는 패턴-검색 결과 리스트.
4. LOGO STRIP — 7개 손-그린 SVG 워드마크, ~50% opacity, hover에 100%.
5. TRUST — surface 컬러 위 FULL-BLEED 스트립, 세로 96px 패딩, KV 6쌍 3-col hairline 그리드.
6. PRICING — 3 tier, 중간 highlighted (subtle inset shadow), persona-voice 서브타이틀.
7. QUOTE — serif italic 디스플레이 인용 + 작은 투명성 풋노트.
8. FINAL CTA — surface 위 centered 카드. 페이지의 큰 H1 라인이 *HERE* 에 위치 (히어로 아님 — 히어로는 editorial close 로 끝남).
9. FOOTER — 브랜드 lockup + 3 링크 컬럼 + status dot.

## 모션 어휘
- 700ms scroll reveal (cubic-bezier .22 .61 .36 1) on [data-reveal].
- 320ms rail progress fill.
- 240ms 컬러 전환.
- 페이지 어딘가에 1개의 slow content cycle (~10s).
- prefers-reduced-motion 에서 모두 비활성.

## Vertical rhythm
첫 콘텐츠는 viewport top 에서 ~150px 위치 (300+px 아님). 외부 shell padding 을 공격적으로 override (예: 16–20px) + 히어로 top margin 도 타이트하게 (~36px desktop / ~40px mobile).

## 모바일 (≤880)
세로 rail이 슬라이스 위 가로 pill stepper 로 접힘, active pill 만 "WHEN WHAT" inline 펼침. Hover 어포던스 제거 (터치에는 hover 없음). 모크 툴바 wrap. Drop cap 다운스케일. State pill 작은 화면에서 숨김.

## 시그니처 무브 (이 미감을 기억에 남게 하는 것)
1. SaaS 랜딩에 editorial drop cap + 마지널리아 rail — 인쇄 출판에서 가져옴.
2. 흰색 progress fill 이 있는 sticky time-rail — 페이지 중앙을 "스크롤하면 시간 따라 펼쳐지는 데모" 로 바꿈.
3. Chromaless 팔레트 + 단 하나의 브랜드 액센트 — 브랜드 마크가 매번 *튀어 오름*, 경쟁할 다른 컬러 없음.
4. 브랜드 마크는 항상 자기 폰트로 upright — italic serif 안에서도 *로고로* 읽힘.

## 금지
- 브랜드 마크 외 위치에 액센트 컬러 사용 금지.
- 주변 텍스트가 italic 이어도 브랜드 마크에 italic 적용 금지.
- Editorial 히어로 또는 Replay 어느 한 쪽도 제거 금지 — 페이지의 정체성은 voice (히어로) + mechanics (Replay) 의 *짝지움*.
- Rail 을 장식으로만 만들지 말 것 — 스크롤에 따라 active state 업데이트 + in-page navigation 둘 다 해야 함.
- 템플릿적 SaaS 리듬 (히어로 + features 그리드 + CTA) 금지. 이 페이지의 핵심은 그걸 *뒤집는 것*.

*voice* (작가의 손) 와 *demo* (메커닉이 펼쳐짐) 둘 다 원하는 어떤 제품에도 재사용 가능. 브랜드 마크, 워드마크, 메트릭 이름, 제품 모크는 교체 — 아키텍처는 유지.`;

const promptJa = `ダークモード SaaS ランディング — 「Editorial + Replay」構造。2 つの異なる*修辞*が重なる: *声*を確立する文学的 editorial-prose ヒーロー、続いて*仕組み*をデモする sticky-rail タイムライン。最後は標準 SaaS インフラ (ロゴ / trust / pricing / quote / final CTA / footer) で締めくくる。抑制された、意見のある、1 つのブランド・アクセントを除き chromaless。

## 美的アイデンティティ
- ダークモード、near-black ベース (#08090A)、surface (#0F0F11)、ボーダーはヘアラインのみ (#1F1F23 → #3A3A3F)。
- Body 階調: text-hi #FAFAFA → mid #A1A1A8 → low #6E6E76 → soft #4A4A52。ダーク上の本文 prose は #D4D4D8 (mid より一段明るい) + weight 500 — serif は dark 上で sans より luminance が必要。
- *ただ 1 つ*のブランド・アクセント・カラー (例: #DAA520 deep goldenrod) — ブランド・ワードマークに専用、他のどこにも使用禁止。
- *ただ 1 つ*のブランド・ディスプレイ・フォント (例: Space Grotesk 700) — ブランド・ワードマーク専用。周囲が italic serif でもブランドは常に UPRIGHT で自分のフォントを維持 → 単語ではなく*ステッカー*のように読める。

## タイプ・ペアリング
- Inter (sans) — 本文、ディスプレイ、nav、モック。
- Serif + 東アジア・フォールバック (例: Libre Baskerville + Noto Serif KR) — editorial drop-cap prose 専用。
- JetBrains Mono (mono) — ラベル、タイムスタンプ、モック・クロム、マージナリア。
- Space Grotesk (geometric grotesque) — ブランド・ワードマーク専用。
- ディスプレイ見出しに ss01 + ss03 スタイリスティック・オルト。

## ページ構成
1. NAV (sticky, top:0, blurred) — ブランド lockup はアイコンとワードマーク両方にブランド色 + ブランド・フォント。
2. EDITORIAL HERO — 声。レイアウト: 左に狭いスティッキー・マージナリア rail (~160px) 小さな mono マイクロ・ノート (01/02/03 — see also / updated / reading time) + 右にメイン・カラム (~720px)。
   - メイン・カラム流れ: 小さな announce pill → mono eyebrow → drop-cap serif prose 3 段落 (段落内に意味単位 soft 改行; 鍵となる句に *イタリック強調* + weight 700; drop cap はラテン文字のみ最初の段落の最初の文字に ~4.2em float-left) → italic serif close がブランド・ワードマークで終わる → mono scroll-cue リンク (「↓ 実際の動きを見る」) ヘアライン・アンダーラインで次セクションに pivot。
3. REPLAY — メカニクス。左に sticky 4-stop 縦 time-rail (~220px wide) + 右に横 4 stacked time-slices。
   - Rail: 1px 縦 spine、stop ごとに 1 ドット。白い「progress」ラインが scroll listener (rAF + ~30% from top トリガー) が set した custom property で active ドット背後に伸びる。Past = グレー塗り。Active = 白塗り + 3px soft halo。Future = 空のリング。Pill クリック → 対応 slice にスムーズスクロール。
   - 各 slice: 小さな mono ヘッダ・ストリップ (kicker / タイムスタンプ / state pill margin-left:auto) → 大きな italic+700-動詞 見出し (通常の句 — italic 動詞 sandwich — 通常の句、soft 改行) → body prose → プロダクト・モック + chrome (file path + ⌘K kbd + traffic-light dots)。
   - モック 4 つ、それぞれ異なる形: 0 行 PINNED + 常設 hover カード + テール行 10 秒 slow-cycle のリスト・ビュー / イベント・バーと dashed マーカーのマルチソース SVG タイムライン / 3 種類の state 変形 (done / open / overdue) を見せるチェックリスト / 類似度スコア付きパターン検索結果リスト。
4. LOGO STRIP — 7 つの手描き SVG ワードマーク、~50% opacity、hover で 100%。
5. TRUST — surface カラー上 FULL-BLEED ストリップ、縦 96px パディング、KV 6 ペア 3-col ヘアライン・グリッド。
6. PRICING — 3 ティア、中央 highlighted (subtle inset shadow)、ペルソナ・ボイス・サブタイトル。
7. QUOTE — serif italic ディスプレイ引用 + 小さな透明性フットノート。
8. FINAL CTA — surface 上 centered カード。ページの大きな H1 ラインが*HERE*に位置 (ヒーローではなく — ヒーローは editorial close で終わる)。
9. FOOTER — ブランド lockup + 3 リンク・カラム + status ドット。

## モーション・ボキャブラリ
- 700ms scroll reveal (cubic-bezier .22 .61 .36 1) on [data-reveal].
- 320ms rail progress fill.
- 240ms カラー遷移.
- ページのどこかに 1 つの slow content cycle (~10s).
- prefers-reduced-motion で全て無効.

## Vertical rhythm
最初のコンテンツは viewport top から ~150px の位置 (300+px ではなく)。外部 shell padding を積極的に override (例: 16–20px) + ヒーロー top margin もタイトに (~36px desktop / ~40px mobile)。

## モバイル (≤880)
縦 rail がスライス上の横ピル・ステッパーに折り畳まれ、active pill のみ「WHEN WHAT」インライン展開。Hover アフォーダンス削除 (タッチには hover なし)。モック・ツールバー wrap。Drop cap ダウンスケール。State pill は小さな画面で非表示。

## シグネチャ・ムーブ (この美感を記憶に残すもの)
1. SaaS ランディングに editorial drop cap + マージナリア rail — 印刷出版から借用。
2. 白い progress fill 付きスティッキー time-rail — ページ中央を「スクロールに従って時間が展開するデモ」に変える。
3. Chromaless パレット + 単一のブランド・アクセント — ブランド・マークが毎回*飛び出す*、他に競合するカラーなし。
4. ブランド・マークは常に自分のフォントで upright — italic serif の中でも*ロゴ*として読める。

## 禁止
- ブランド・マーク以外にアクセント・カラー禁止。
- 周囲のテキストが italic でもブランド・マークに italic 適用禁止。
- Editorial ヒーローまたは Replay のどちらか削除禁止 — ページのアイデンティティは voice (ヒーロー) + mechanics (Replay) の*ペアリング*。
- Rail を装飾だけにしない — スクロールに従って active state 更新 + in-page navigation 両方が必要。
- テンプレート的 SaaS リズム (ヒーロー + features グリッド + CTA) 禁止。このページの本質はそれを*反転させること*。

*voice* (作家の手) と *demo* (メカニクスが展開) の両方を望むあらゆるプロダクトに再利用可能。ブランド・マーク、ワードマーク、メトリック名、プロダクト・モックは差し替え — アーキテクチャは維持。`;

// ============================================================
// Mocks
// ============================================================
type Row = { id: string; t: LocalizedCopy; s: LocalizedCopy; a: string };

function HeroMock({ lang, rows, hover }: { lang: AppLang; rows: Row[]; hover: typeof COPY.hover }) {
  const label = lang === 'ko' ? '오늘의 에러 · 3건 미해결' : lang === 'ja' ? '本日のインシデント · 未解決3件' : 'Today’s incidents · 3 open';
  return (
    <div className="pn-mock pn-mock--hero" aria-hidden="true">
      <div className="pn-mock__chrome">
        <span className="pn-mock__path">echelon.app / incidents</span>
        <span className="pn-mock__kbd">⌘ K</span>
      </div>
      <div className="pn-mock__body">
        <aside className="pn-mock__side">
          <span className="pn-mock__side-h">{L(COPY.mockWorkspaces, lang)}</span>
          <ul>
            <li className="is-active">platform-core</li>
            <li>checkout</li>
            <li>data-ingest</li>
            <li>billing</li>
            <li>email</li>
          </ul>
          <span className="pn-mock__side-h">{L(COPY.mockViews, lang)}</span>
          <ul>
            <li>{L(COPY.mockOpenView, lang)}</li>
            <li>{L(COPY.mockThisWeekView, lang)}</li>
            <li>{L(COPY.mockPatternView, lang)}</li>
          </ul>
        </aside>
        <main className="pn-mock__main">
          <header className="pn-mock__toolbar">
            <span className="pn-mock__crumb">{label}</span>
            <span className="pn-mock__actions">
              <span>{L(COPY.mockFilter, lang)}</span>
              <span>{L(COPY.mockSort, lang)}</span>
              <span>{L(COPY.mockGroup, lang)}</span>
            </span>
          </header>
          <ul className="pn-mock__list">
            {rows.map((row, i) => (
              <li key={row.id} className={i === 0 ? 'is-hover' : ''}>
                <span className="pn-mock__id">{row.id}</span>
                <span className="pn-mock__title">{L(row.t, lang)}</span>
                <span className="pn-mock__meta">{L(row.s, lang)}</span>
                <span className="pn-mock__people">{row.a}</span>
                {i === 0 && (
                  <div className="pn-mock__hovercard" role="tooltip">
                    <span className="pn-mock__hovercard-tag">▲ {L(COPY.mockPatternMatch, lang)}</span>
                    <span className="pn-mock__hovercard-title">{L(hover.title, lang)}</span>
                    <span className="pn-mock__hovercard-note">{L(hover.note, lang)}</span>
                    <a className="pn-mock__hovercard-cta" href="#">{L(hover.open, lang)}</a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}

function TimelineMock({ lang }: { lang: AppLang }) {
  const labels = ['Slack', 'PagerDuty', 'Sentry', 'GitHub'];
  const events = [
    [{ x: 28, w: 12 }, { x: 64, w: 8 }, { x: 130, w: 18 }, { x: 184, w: 12 }, { x: 242, w: 6 }],
    [{ x: 44, w: 8 }, { x: 96, w: 14 }, { x: 198, w: 10 }],
    [{ x: 12, w: 6 }, { x: 78, w: 22 }, { x: 156, w: 10 }, { x: 220, w: 14 }, { x: 268, w: 8 }],
    [{ x: 110, w: 10 }, { x: 168, w: 16 }, { x: 232, w: 8 }],
  ];
  return (
    <div className="pn-mock pn-mock--timeline" aria-hidden="true">
      <div className="pn-mock__chrome">
        <span className="pn-mock__path">echelon.app / incidents / INC-0421</span>
        <span className="pn-mock__kbd">⌘ E</span>
      </div>
      <header className="pn-mock__head">
        <span className="pn-mock__crumb">INC-0421 · Stripe webhook backlog spike</span>
        <span className="pn-mock__chip">P1 · {L(COPY.mockDrafting, lang)}</span>
      </header>
      <svg viewBox="0 0 320 220" className="pn-timeline">
        <line x1="0" y1="40" x2="320" y2="40" stroke="#2A2A2F" strokeWidth="0.5" />
        {[60, 120, 180, 240].map((x) => (
          <g key={x}>
            <line x1={x} y1="38" x2={x} y2="42" stroke="#6E6E76" strokeWidth="0.5" />
            <text x={x} y="32" fontSize="6.5" fontFamily="JetBrains Mono, monospace" fill="#6E6E76" textAnchor="middle">{`14:${18 + ((x - 60) / 60) * 2}`}</text>
          </g>
        ))}
        {labels.map((label, i) => {
          const y = 70 + i * 36;
          return (
            <g key={label}>
              <text x="0" y={y + 3} fontSize="7" fontFamily="Inter, sans-serif" fill="#A1A1A8">{label}</text>
              <line x1="38" y1={y} x2="320" y2={y} stroke="#1F1F23" strokeWidth="1" />
              {events[i].map((e, j) => (
                <rect key={j} x={42 + e.x} y={y - 4} width={e.w} height="8" fill="#FAFAFA" rx="1.5" />
              ))}
            </g>
          );
        })}
        <line x1="172" y1="55" x2="172" y2="205" stroke="#FAFAFA" strokeWidth="1" strokeDasharray="2 3" />
        <text x="178" y="58" fontSize="7" fontFamily="JetBrains Mono, monospace" fill="#FAFAFA">14:23 KST · {L(COPY.mockDraftReady, lang)}</text>
      </svg>
      <footer className="pn-mock__footrow">
        <span>{L(COPY.mockTimelineFoot, lang)}</span>
        <span>{L(COPY.mockExportDraft, lang)} →</span>
      </footer>
    </div>
  );
}

function FollowupMock({ lang }: { lang: AppLang }) {
  const head = lang === 'ko' ? '후속 작업 · 7건 중 4건 배포' : lang === 'ja' ? '後続作業 · 7件中4件リリース' : 'Followups · 4 of 7 shipped';
  const items = [
    { state: 'shipped',  t: { en: 'Add backlog metric to Stripe webhook dashboard', ko: 'Stripe 웹훅 대시보드에 백로그 지표 추가', ja: 'Stripe webhook ダッシュボードにバックログ指標追加' }, owner: 'priya',   due: '#418' },
    { state: 'shipped',  t: { en: 'Tighten retry backoff on /v1/charges',           ko: '/v1/charges 재시도 backoff 조정',           ja: '/v1/charges のリトライ backoff 調整' },              owner: 'raj',     due: '#421' },
    { state: 'shipped',  t: { en: 'Add runbook link to incident channel template',   ko: '에러 대응 채널 템플릿에 런북 링크 추가',     ja: 'インシデントチャネルテンプレートにランブックリンク追加' }, owner: 'mei',     due: '#423' },
    { state: 'shipped',  t: { en: 'Alert on backlog > 1k for > 60s',                 ko: '백로그 1k 60초 초과 시 알람',               ja: 'バックログ1k超60秒でアラート' },                       owner: 'tomi',    due: '#430' },
    { state: 'open',     t: { en: 'Document Stripe webhook idempotency contract',    ko: 'Stripe 웹훅 idempotency 계약 문서화',       ja: 'Stripe webhook idempotency 仕様書化' },                owner: 'priya',   due: '06-08' },
    { state: 'overdue',  t: { en: 'Migrate webhook ingestion to dedicated worker',   ko: '웹훅 수집을 전용 워커로 이전',               ja: 'webhook 取り込みを専用ワーカーへ移行' },              owner: 'kai',     due: '06-01' },
    { state: 'open',     t: { en: 'Add load test for 5x backlog spike',              ko: '5배 백로그 스파이크 부하 테스트 추가',     ja: '5倍バックログスパイクの負荷試験追加' },              owner: 'jules',   due: '06-12' },
  ] as const;
  return (
    <div className="pn-mock pn-mock--followup" aria-hidden="true">
      <div className="pn-mock__chrome">
        <span className="pn-mock__path">echelon.app / incidents / INC-0421 / followups</span>
        <span className="pn-mock__kbd">⌘ J</span>
      </div>
      <header className="pn-mock__head">
        <span className="pn-mock__crumb">{head}</span>
        <span className="pn-mock__chip">{L(COPY.mockTracked, lang)}</span>
      </header>
      <ul className="pn-followup">
        {items.map((it, i) => (
          <li key={i} className={`is-${it.state}`}>
            <span className="pn-followup__check" aria-hidden="true">
              <svg viewBox="0 0 9 9"><path d="M1 4.6 L3.5 7 L8 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="pn-followup__title">{L(it.t, lang)}</span>
            <span className="pn-followup__owner">{it.owner}</span>
            <span className="pn-followup__due">{it.due}</span>
          </li>
        ))}
      </ul>
      <footer className="pn-mock__footrow">
        <span>{L(COPY.mockFollowupFoot, lang)}</span>
        <span>{L(COPY.mockViewAll, lang)} →</span>
      </footer>
    </div>
  );
}

function PatternMock({ lang }: { lang: AppLang }) {
  const matches = [
    { id: 'INC-0421', t: { en: 'Stripe webhook backlog spike', ko: 'Stripe 웹훅 백로그 급증', ja: 'Stripe webhook バックログ急増' }, tag: { en: 'queue · backpressure', ko: '큐 · 역압', ja: 'キュー · backpressure' }, sim: '0.93', age: { en: 'today', ko: '오늘', ja: '今日' } },
    { id: 'INC-0312', t: { en: 'Webhook 5xx during sale ramp', ko: '세일 램프 중 웹훅 5xx', ja: 'セール増加中のWebhook 5xx' }, tag: { en: 'queue · backpressure', ko: '큐 · 역압', ja: 'キュー · backpressure' }, sim: '0.87', age: { en: '8 weeks ago', ko: '8주 전', ja: '8週間前' } },
    { id: 'INC-0204', t: { en: 'Retry storm on /v1/charges', ko: '/v1/charges 재시도 폭주', ja: '/v1/charges のリトライストーム' }, tag: { en: 'queue · backpressure', ko: '큐 · 역압', ja: 'キュー · backpressure' }, sim: '0.81', age: { en: '5 months ago', ko: '5개월 전', ja: '5か月前' } },
    { id: 'INC-0091', t: { en: 'Backlog growth · weekend', ko: '주말 백로그 증가', ja: '週末のバックログ増加' }, tag: { en: 'queue · backpressure', ko: '큐 · 역압', ja: 'キュー · backpressure' }, sim: '0.74', age: { en: '11 months ago', ko: '11개월 전', ja: '11か月前' } },
  ];
  return (
    <div className="pn-mock pn-mock--pattern" aria-hidden="true">
      <div className="pn-mock__chrome">
        <span className="pn-mock__path">echelon.app / patterns</span>
        <span className="pn-mock__kbd">⌘ /</span>
      </div>
      <div className="pn-mock__searchbar">
        <span className="pn-mock__searchq">webhook backlog · backpressure</span>
        <span className="pn-mock__searchhit">{L(COPY.mockSimilarIncidents, lang)}</span>
      </div>
      <ul className="pn-mock__matches">
        {matches.map((m) => (
          <li key={m.id}>
            <div className="pn-mock__matchhead">
              <span className="pn-mock__id">{m.id}</span>
              <span className="pn-mock__matchsim">{L(COPY.mockSimilarity, lang)} {m.sim}</span>
            </div>
            <div className="pn-mock__matchtitle">{L(m.t, lang)}</div>
            <div className="pn-mock__matchfoot">
              <span className="pn-mock__matchtag">{L(m.tag, lang)}</span>
              <span className="pn-mock__matchage">{L(m.age, lang)}</span>
            </div>
          </li>
        ))}
      </ul>
      <footer className="pn-mock__footrow">
        <span>{L(COPY.mockPatternFoot, lang)}</span>
        <span>{L(COPY.mockOpenReport, lang)} →</span>
      </footer>
    </div>
  );
}

// Renders mixed-weight headlines like H1: { a, b (verb), c }
type SplitH = { a: string; b: string; c: string };
function renderSplit(s: SplitH): ReactNode {
  const aParts = s.a.split('\n');
  const cParts = s.c.split('\n');
  return (
    <>
      {aParts.map((p, i) => (
        <span key={`a-${i}`}>{p}{i < aParts.length - 1 ? <br/> : null}</span>
      ))}
      <em>{s.b}</em>
      {cParts.map((p, i) => (
        <span key={`c-${i}`}>{p}{i < cParts.length - 1 ? <br/> : null}</span>
      ))}
    </>
  );
}

// Wraps every "Echelon" mention with a coloured brand-mark span and respects
// '\n' soft line breaks. The brand colour is applied via CSS (.pn-brand).
function renderWithBrand(text: string): ReactNode {
  const lines = text.split('\n');
  return lines.flatMap((line, li) => {
    const parts = line.split(/(Echelon)/g).map((part, pi) =>
      part === 'Echelon'
        ? <span key={`${li}-${pi}`} className="pn-brand">Echelon</span>
        : <span key={`${li}-${pi}`}>{part}</span>
    );
    return li < lines.length - 1 ? [...parts, <br key={`br-${li}`} />] : parts;
  });
}

// ============================================================
// Page
// ============================================================
export function PortedFusionPureNoirPage({ lang }: PortedStylePageProps) {
  const lng = lang as Exclude<Locale, 'co'>;
  const rootRef = useRef<HTMLDivElement>(null);
  const railListRef = useRef<HTMLOListElement>(null);
  const sliceRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeSlice, setActiveSlice] = useState(0);

  // Slow incident-list cycle (10 s). Row 0 stays pinned (carries the hover card).
  const PINNED_ROW: Row = INCIDENT_POOL[0];
  const [tailRows, setTailRows] = useState<Row[]>(INCIDENT_POOL.slice(1));
  const cycleIdx = useRef(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      cycleIdx.current = (cycleIdx.current + 1) % INCIDENT_POOL_EXTRA.length;
      setTailRows((prev) => {
        const next = INCIDENT_POOL_EXTRA[cycleIdx.current];
        if (prev.some((r) => r.id === next.id)) return prev;
        return [next, ...prev.slice(0, prev.length - 1)];
      });
    }, 10_000);
    return () => clearInterval(id);
  }, []);
  const rows = [PINNED_ROW, ...tailRows];

  // Scroll reveal
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );
    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [lng]);

  // Active-slice tracker — top-of-viewport detection. The slice whose top
  // most recently passed the 30%-from-top line is "active".
  useEffect(() => {
    const slices = sliceRefs.current.filter((el): el is HTMLElement => Boolean(el));
    if (slices.length === 0) return;
    let ticking = false;
    const compute = () => {
      ticking = false;
      const triggerY = window.innerHeight * 0.32;
      let idx = 0;
      slices.forEach((el, i) => {
        const top = el.getBoundingClientRect().top;
        if (top - triggerY <= 0) idx = i;
      });
      setActiveSlice(idx);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lng]);

  // Sync rail progress line — height up to active dot.
  useEffect(() => {
    const list = railListRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLLIElement>('li'));
    if (items.length === 0) return;
    const target = items[activeSlice];
    if (!target) return;
    // distance from list top to target's dot center
    const listTop = list.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    const offset = targetTop - listTop + 22; // 22px = dot vertical center inside li
    list.style.setProperty('--pn-rail-progress', `${Math.max(0, offset - 22)}px`);
  }, [activeSlice]);

  const onRailJump = (i: number) => () => {
    const el = sliceRefs.current[i];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <FusionShell
      fusionId="fusion-pure-noir"
      lang={lang}
      tone="dark"
      accent="#daa520"
      prev={{ href: '/pages/fusion-quiet-manifesto.html', label: 'Quiet Manifesto' }}
      next={{ href: '/pages/fusion-strict-console.html', label: 'Strict Console' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
    >
      <div className="pn-shell" ref={rootRef}>

        {/* NAV */}
        <header className="pn-nav">
          <div className="pn-nav__inner">
            <a className="pn-nav__brand" href="#">
              <span className="pn-nav__mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
                  <path d="M4 18 L4 6 L14 6 L20 12 L14 18 Z" />
                  <line x1="9" y1="12" x2="14" y2="12" />
                </svg>
              </span>
              <strong>{L(COPY.brand, lng)}</strong>
            </a>
            <nav className="pn-nav__links" aria-label="Primary">
              {NAV.map((n, i) => <a key={i} href="#">{L(n, lng)}</a>)}
            </nav>
            <div className="pn-nav__end">
              <a className="pn-nav__signin" href="#">{L(COPY.navSignIn, lng)}</a>
              <a className="pn-btn pn-btn--ghost" href="#">{L(COPY.navCta, lng)}</a>
            </div>
          </div>
        </header>

        {/* HERO · editorial drop-cap opener (voice) */}
        <section className="pn-hero">
          {/* left rail · marginalia */}
          <aside className="pn-hero__margin" aria-hidden="true">
            <ul>
              {COPY.heroMarginalia.map((m, i) => (
                <li key={i} data-reveal>
                  <span className="pn-hero__margin-y">{m.y}</span>
                  <span className="pn-hero__margin-t">{L(m, lng)}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* main · prose */}
          <div className="pn-hero__main">
            <a className="pn-announce" href="#" data-reveal>
              <span className="pn-announce__mark" aria-hidden="true">▲</span>
              <span className="pn-announce__text">{L(COPY.announce, lng)}</span>
              <span className="pn-announce__cta">{L(COPY.announceCta, lng)} →</span>
            </a>

            <span className="pn-eyebrow" data-reveal>{L(COPY.heroEyebrow, lng)}</span>

            {(() => {
              // Paragraph break = '\n\n'. Soft line break inside paragraph = '\n'.
              // Italic emphasis = '*…*'. Drop cap (EN only) on the very first char.
              const paragraphs = L(COPY.heroEditorial, lng).split('\n\n');

              const renderSegments = (text: string, isFirstParagraph: boolean): ReactNode[] => {
                const segments: ReactNode[] = text.split('*').map((seg, i) => {
                  // Soft line breaks within a segment
                  const lines = seg.split('\n');
                  const inner: ReactNode[] = [];
                  lines.forEach((line, li) => {
                    inner.push(<span key={`l-${li}`}>{line}</span>);
                    if (li < lines.length - 1) inner.push(<br key={`br-${li}`} />);
                  });
                  return i % 2 === 1
                    ? <em key={i}>{inner}</em>
                    : <span key={i}>{inner}</span>;
                });

                // Drop cap — only on the first character of the first paragraph (EN only).
                if (isFirstParagraph && lng === 'en') {
                  const firstSeg = segments[0] as ReactElement<{ children: ReactNode }>;
                  const firstChild = firstSeg?.props?.children;
                  const firstSpan = Array.isArray(firstChild) ? firstChild[0] : firstChild;
                  const firstSpanProps = (firstSpan as ReactElement<{ children: string }>)?.props;
                  const text2 = firstSpanProps?.children;
                  if (typeof text2 === 'string' && text2.length > 0) {
                    const first = text2.charAt(0);
                    const rest = text2.slice(1);
                    const newFirstSpan = (
                      <span key="l-0">
                        <span className="pn-hero__dropcap">{first}</span>
                        {rest}
                      </span>
                    );
                    const newChildren = Array.isArray(firstChild)
                      ? [newFirstSpan, ...firstChild.slice(1)]
                      : newFirstSpan;
                    segments[0] = <span key={0}>{newChildren}</span>;
                  }
                }
                return segments;
              };

              return paragraphs.map((para, pi) => (
                <p key={pi} className="pn-hero__prose" data-reveal>
                  {renderSegments(para, pi === 0)}
                </p>
              ));
            })()}

            <p className="pn-hero__close" data-reveal>{renderWithBrand(L(COPY.heroEditorialClose, lng))}</p>

            {/* Scroll cue — pivots from the editorial close into the demo (Replay).
                Replaces the previous hero H1 + CTAs, which made the hero feel
                terminal (the same H1 + CTAs still live in the final-CTA section). */}
            <a className="pn-hero__cue" href="#replay" data-reveal>
              <span className="pn-hero__cue-arrow" aria-hidden="true">↓</span>
              <span>{L(COPY.heroCue, lng)}</span>
            </a>
          </div>
        </section>

        {/* REPLAY · sticky time-rail + 4 time-slices (mechanics demo) */}
        <section className="pn-replay" id="replay">
          {/* sticky rail */}
          <aside className="pn-rail" aria-label={L(COPY.replayTitle, lng)}>
            <span className="pn-rail__title">{L(COPY.replayTitle, lng)}</span>
            <ol className="pn-rail__list" ref={railListRef}>
              {RAIL.map((stop, i) => {
                const cls = i === activeSlice ? 'is-active' : i < activeSlice ? 'is-past' : '';
                return (
                  <li key={stop.id} className={cls} onClick={onRailJump(i)}>
                    <span className="pn-rail__t">{L(stop.t, lng)}</span>
                    <span className="pn-rail__when">{L(stop.when, lng)}</span>
                    <span className="pn-rail__what">{L(stop.what, lng)}</span>
                  </li>
                );
              })}
            </ol>
          </aside>

          {/* slices */}
          <div className="pn-slices">
            <article className="pn-slice" ref={(el) => { sliceRefs.current[0] = el; }}>
              <header className="pn-slice__head">
                <span className="pn-slice__t">{L(RAIL[0].t, lng)} · {L(RAIL[0].what, lng)}</span>
                <span className="pn-slice__when">{L(RAIL[0].when, lng)}</span>
                <span className="pn-slice__state">{L(COPY.slice1State, lng)}</span>
              </header>
              <h2 className="pn-slice__h" data-reveal>{renderSplit(COPY.slice1H[lng])}</h2>
              <p className="pn-slice__body" data-reveal>{L(COPY.slice1Body, lng)}</p>
              <div className="pn-slice__art" data-reveal>
                <HeroMock lang={lng} rows={rows} hover={COPY.hover} />
              </div>
            </article>

            <article className="pn-slice" ref={(el) => { sliceRefs.current[1] = el; }}>
              <header className="pn-slice__head">
                <span className="pn-slice__t">{L(RAIL[1].t, lng)} · {L(RAIL[1].what, lng)}</span>
                <span className="pn-slice__when">{L(RAIL[1].when, lng)}</span>
                <span className="pn-slice__state">{L(COPY.slice2State, lng)}</span>
              </header>
              <h2 className="pn-slice__h" data-reveal>{renderSplit(COPY.slice2H[lng])}</h2>
              <p className="pn-slice__body" data-reveal>{renderWithBrand(L(COPY.slice2Body, lng))}</p>
              <div className="pn-slice__art" data-reveal><TimelineMock lang={lng} /></div>
            </article>

            <article className="pn-slice" ref={(el) => { sliceRefs.current[2] = el; }}>
              <header className="pn-slice__head">
                <span className="pn-slice__t">{L(RAIL[2].t, lng)} · {L(RAIL[2].what, lng)}</span>
                <span className="pn-slice__when">{L(RAIL[2].when, lng)}</span>
                <span className="pn-slice__state">{L(COPY.slice3State, lng)}</span>
              </header>
              <h2 className="pn-slice__h" data-reveal>{renderSplit(COPY.slice3H[lng])}</h2>
              <p className="pn-slice__body" data-reveal>{L(COPY.slice3Body, lng)}</p>
              <div className="pn-slice__art" data-reveal><FollowupMock lang={lng} /></div>
            </article>

            <article className="pn-slice" ref={(el) => { sliceRefs.current[3] = el; }}>
              <header className="pn-slice__head">
                <span className="pn-slice__t">{L(RAIL[3].t, lng)} · {L(RAIL[3].what, lng)}</span>
                <span className="pn-slice__when">{L(RAIL[3].when, lng)}</span>
                <span className="pn-slice__state">{L(COPY.slice4State, lng)}</span>
              </header>
              <h2 className="pn-slice__h" data-reveal>{renderSplit(COPY.slice4H[lng])}</h2>
              <p className="pn-slice__body" data-reveal>{renderWithBrand(L(COPY.slice4Body, lng))}</p>
              <div className="pn-slice__art" data-reveal><PatternMock lang={lng} /></div>
            </article>
          </div>
        </section>

        {/* LOGOS */}
        <section className="pn-logos" data-reveal>
          <span className="pn-logos__eye">{L(COPY.logoEyebrow, lng)}</span>
          <ul className="pn-logos__row">
            {LOGOS.map((n) => <li key={n}><Logo name={n} /></li>)}
          </ul>
        </section>

        {/* TRUST — full bleed */}
        <section className="pn-trust">
          <div className="pn-trust__inner">
            <div className="pn-trust__head" data-reveal>
              <span className="pn-eyebrow">{L(COPY.trustTag, lng)}</span>
              <h2 className="pn-h2">
                {L(COPY.trustHead, lng).split('\n').map((l, i, a) => (
                  <span key={i}>{l}{i < a.length - 1 ? <br/> : null}</span>
                ))}
              </h2>
            </div>
            <ul className="pn-trust__grid" data-reveal>
              {TRUST.map((t, i) => (
                <li key={i}>
                  <span className="pn-trust__k">{L(t.k, lng)}</span>
                  <span className="pn-trust__v">{L(t.v, lng)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* PRICING */}
        <section className="pn-pricing" id="cta">
          <div className="pn-pricing__head" data-reveal>
            <span className="pn-eyebrow">{L(COPY.pricingTag, lng)}</span>
            <h2 className="pn-h2">
              {L(COPY.pricingHead, lng).split('\n').map((l, i, a) => (
                <span key={i}>{l}{i < a.length - 1 ? <br/> : null}</span>
              ))}
            </h2>
          </div>
          <ul className="pn-pricing__grid">
            {PRICING.map((p, i) => (
              <li key={i} className={`pn-tier ${p.highlight ? 'is-highlight' : ''}`} data-reveal>
                <h3 className="pn-tier__name">{L(p.name, lng)}</h3>
                <div className="pn-tier__price">
                  <strong>{L(p.price, lng)}</strong>
                  <em>{L(p.period, lng)}</em>
                </div>
                <p className="pn-tier__sub">{L(p.sub, lng)}</p>
                <a className={`pn-btn ${p.highlight ? 'pn-btn--primary' : 'pn-btn--ghost'} pn-tier__cta`} href="#">{L(p.cta, lng)}</a>
                <ul className="pn-tier__features">
                  {p.features.map((f, j) => <li key={j}>{L(f, lng)}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* QUOTE + footnote */}
        <section className="pn-quotebox" data-reveal>
          <blockquote className="pn-quote">
            <p>{renderWithBrand(L(COPY.quote, lng))}</p>
            <cite>{L(COPY.quoteBy, lng)}</cite>
          </blockquote>
          <p className="pn-quote__footnote">{renderWithBrand(L(COPY.quoteFootnote, lng))}</p>
        </section>

        {/* FINAL CTA */}
        <section className="pn-final" data-reveal>
          <h2 className="pn-h2">{L(COPY.ctaHead, lng)}</h2>
          <p className="pn-final__sub">{L(COPY.ctaSub, lng)}</p>
          <div className="pn-final__ctas">
            <a className="pn-btn pn-btn--primary" href="#">{L(COPY.ctaA, lng)}</a>
            <a className="pn-btn pn-btn--text" href="#">{L(COPY.ctaB, lng)} →</a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pn-footer">
          <div className="pn-footer__top">
            <div className="pn-footer__brand">
              <a className="pn-nav__brand" href="#">
                <span className="pn-nav__mark" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
                    <path d="M4 18 L4 6 L14 6 L20 12 L14 18 Z" />
                    <line x1="9" y1="12" x2="14" y2="12" />
                  </svg>
                </span>
                <strong>{L(COPY.brand, lng)}</strong>
              </a>
              <p className="pn-footer__tag">{L({en: 'Postmortems that actually close.',  ko: '끝까지 마무리되는 에러 보고서.',  ja: '最後までやり切るポストモーテム。'}, lng)}</p>
            </div>
            <div className="pn-footer__cols">
              {COPY.footerCols.map((col, i) => (
                <div key={i} className="pn-footer__col">
                  <span className="pn-footer__h">{L(col.head, lng)}</span>
                  <ul>
                    {col.items.map((it, j) => <li key={j}><a href="#">{L(it, lng)}</a></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="pn-footer__bottom">
            <span className="pn-footer__colo">{L(COPY.footColo, lng)}</span>
            <ul className="pn-footer__terms">
              <li className="pn-footer__status">
                <span className="pn-footer__status-dot" aria-hidden="true" />
                {L(COPY.footStatus, lng)}
              </li>
              {COPY.footTerms.map((t, i) => <li key={i}><a href="#">{L(t, lng)}</a></li>)}
            </ul>
          </div>
        </footer>
      </div>
    </FusionShell>
  );
}
