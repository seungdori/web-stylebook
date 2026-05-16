import { useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang) => obj[lang];

interface FilterValue {
  id: string;
  label: { en: string; ko: string; ja: string };
}
interface FilterGroup {
  id: string;
  label: { en: string; ko: string; ja: string };
  values: FilterValue[];
}

const FILTERS: FilterGroup[] = [
  {
    id: 'region',
    label: { en: 'Region', ko: '리전', ja: 'リージョン' },
    values: [
      { id: 'all',  label: { en: 'All', ko: '전체', ja: '全て' } },
      { id: 'apac', label: { en: 'APAC', ko: 'APAC', ja: 'APAC' } },
      { id: 'emea', label: { en: 'EMEA', ko: 'EMEA', ja: 'EMEA' } },
      { id: 'amer', label: { en: 'AMER', ko: 'AMER', ja: 'AMER' } },
    ],
  },
  {
    id: 'env',
    label: { en: 'Environment', ko: '환경', ja: '環境' },
    values: [
      { id: 'prod',    label: { en: 'Production', ko: '프로덕션', ja: 'プロダクション' } },
      { id: 'staging', label: { en: 'Staging',    ko: '스테이징',  ja: 'ステージング' } },
    ],
  },
  {
    id: 'status',
    label: { en: 'Status', ko: '상태', ja: 'ステータス' },
    values: [
      { id: 'live',     label: { en: 'Live',     ko: '라이브',  ja: '稼働' } },
      { id: 'draft',    label: { en: 'Draft',    ko: '초안',    ja: '下書き' } },
      { id: 'archived', label: { en: 'Archived', ko: '보관',    ja: 'アーカイブ' } },
    ],
  },
];

const TABLE_ROWS = [
  { id: 'tkn-014', name: 'color.brand.primary',   region: 'APAC', env: 'prod',    status: 'live',  consumers: 38, version: '4.12', updated: '12 May' },
  { id: 'tkn-013', name: 'radius.surface.lg',     region: 'EMEA', env: 'prod',    status: 'live',  consumers: 24, version: '4.12', updated: '12 May' },
  { id: 'tkn-012', name: 'shadow.elevation.02',   region: 'AMER', env: 'prod',    status: 'live',  consumers: 33, version: '4.11', updated: '11 May' },
  { id: 'tkn-011', name: 'space.gutter.xl',       region: 'APAC', env: 'staging', status: 'draft', consumers:  6, version: '4.13', updated: '14 May' },
  { id: 'tkn-010', name: 'type.display.tight',    region: 'EMEA', env: 'prod',    status: 'live',  consumers: 19, version: '4.11', updated: '10 May' },
  { id: 'tkn-009', name: 'motion.spring.subtle',  region: 'AMER', env: 'prod',    status: 'live',  consumers: 14, version: '4.10', updated: '08 May' },
  { id: 'tkn-008', name: 'border.line.hairline',  region: 'APAC', env: 'staging', status: 'draft', consumers:  3, version: '4.13', updated: '14 May' },
];

const COPY = {
  brand: 'STYLEBOOK / OPERATIONS',
  brandSub: { en: 'Operational tooling for design system teams', ko: '디자인 시스템 팀을 위한 운영 도구', ja: 'デザインシステムチームのための運用ツール' },
  navItems: [
    { en: 'Product',    ko: '제품',     ja: '製品' },
    { en: 'Ops Panel',  ko: '운영 콘솔', ja: '運用パネル' },
    { en: 'Pricing',    ko: '요금',     ja: '料金' },
    { en: 'Customers',  ko: '고객사',   ja: '顧客' },
    { en: 'Docs',       ko: '문서',     ja: 'ドキュメント' },
  ],
  version: 'v 2.4 · 2026 · 05',
  sectionMark: { en: 'N°', ko: 'N°', ja: 'N°' },
  hero: {
    eyebrow: { en: '01 / 06 · Product',  ko: '01 / 06 · 제품',  ja: '01 / 06 · 製品' },
    title: {
      en: 'Ship tokens, not screenshots.',
      ko: '스크린샷이 아니라 *토큰을 배포*하세요.',
      ja: 'スクリーンショットではなく*トークンを出荷*する。',
    },
    lede: {
      en: 'A purpose-built console for design systems teams: review, approve, and ship tokens, components, and content rules across every product surface — without filing a ticket.',
      ko: '디자인 시스템 팀을 위한 전용 콘솔입니다. 토큰·컴포넌트·콘텐츠 규칙을 *티켓 없이* 검토·승인·배포해서 모든 제품 표면에 반영합니다.',
      ja: 'デザインシステムチーム専用のコンソール。チケットを切らずにトークン・コンポーネント・コンテンツ規則を*レビュー・承認・出荷*して、全ての製品面に反映する。',
    },
    primaryCta: { en: 'Open the operations console', ko: '운영 콘솔 열기', ja: '運用パネルを開く' },
    secondaryCta: { en: 'View the schema →', ko: '스키마 보기 →', ja: 'スキーマを見る →' },
  },
  status: [
    { label: { en: 'Uptime',     ko: '가동',     ja: '稼働率' },   value: '99.94', unit: '%' },
    { label: { en: 'p95 deploy', ko: 'p95 배포', ja: 'p95デプロイ' }, value: '42',    unit: 'ms' },
    { label: { en: 'Regions',    ko: '리전',     ja: 'リージョン' },  value: '12',    unit: 'live' },
    { label: { en: 'Tokens',     ko: '토큰',     ja: 'トークン' },    value: '184',   unit: 'shipped' },
  ],
  ops: {
    eyebrow: { en: '02 / 06 · Operations panel',  ko: '02 / 06 · 운영 콘솔',  ja: '02 / 06 · 運用パネル' },
    title: {
      en: 'See every token in flight — without leaving the grid.',
      ko: '그리드를 떠나지 않고도 비행 중인 모든 토큰을 봅니다.',
      ja: 'グリッドを離れずに、稼働中の全トークンを見渡せる。',
    },
    sub: {
      en: 'A real working surface that ships with every Org plan. Filters, statuses, consumers, and version history — left-aligned, mono-numbered, no decoration.',
      ko: '모든 Org 플랜에 기본 포함되는 실제 작업 표면. 필터·상태·소비자·버전 이력 — 좌측 정렬, 모노 숫자, 장식 없음.',
      ja: '全Orgプランに同梱される実作業面。フィルタ・状態・利用者・バージョン履歴 — 左寄せ、モノ番号、装飾なし。',
    },
    columns: [
      { en: 'TOKEN',      ko: '토큰',      ja: 'トークン' },
      { en: 'REGION',     ko: '리전',      ja: 'リージョン' },
      { en: 'ENV',        ko: '환경',      ja: '環境' },
      { en: 'STATUS',     ko: '상태',      ja: '状態' },
      { en: 'CONSUMERS',  ko: '사용처',     ja: '利用箇所' },
      { en: 'VERSION',    ko: '버전',      ja: 'バージョン' },
      { en: 'UPDATED',    ko: '갱신',      ja: '更新' },
    ],
    summary: { en: 'Showing 7 of 184 tokens · 2026·05·15 · 09:24 KST', ko: '184개 중 7개 토큰 · 2026·05·15 · 09:24 KST', ja: '184件中7件 · 2026·05·15 · 09:24 KST' },
  },
  pricing: {
    eyebrow: { en: '03 / 06 · Pricing',  ko: '03 / 06 · 가격',  ja: '03 / 06 · 料金' },
    title: {
      en: 'Three tiers. One bill. No quotas in the way of the work.',
      ko: '세 등급. 단일 청구서. 작업을 가로막는 쿼터 없음.',
      ja: '3段階。請求は1本。作業を妨げるクォータなし。',
    },
    plans: [
      {
        id: 'starter',
        name: { en: 'Starter',  ko: '스타터',  ja: 'スターター' },
        price: { en: 'Free',    ko: '무료',    ja: '無料' },
        cycle: { en: 'forever', ko: '평생',    ja: '永続' },
        note:  { en: 'For an individual designer or a small library.', ko: '개인 디자이너 또는 소규모 라이브러리용.', ja: '個人デザイナーまたは小規模ライブラリ向け。' },
        rows: [
          { en: '3 projects',           ko: '프로젝트 3개',         ja: 'プロジェクト3' },
          { en: '1 region',             ko: '리전 1개',            ja: 'リージョン1' },
          { en: 'Community support',    ko: '커뮤니티 지원',         ja: 'コミュニティ・サポート' },
          { en: 'agent-handoff slim',   ko: 'agent-handoff slim',  ja: 'agent-handoff slim' },
        ],
      },
      {
        id: 'team',
        name: { en: 'Team',          ko: '팀',         ja: 'チーム' },
        price: { en: '$24',          ko: '$24',        ja: '$24' },
        cycle: { en: '/ seat / mo',  ko: '/ 시트 / 월', ja: '/ シート / 月' },
        note:  { en: 'For 5–40 product designers shipping daily.', ko: '매일 배포하는 5–40명의 제품 디자이너용.', ja: '毎日リリースする5〜40名のプロダクト・デザイナー向け。' },
        rows: [
          { en: 'Unlimited projects', ko: '무제한 프로젝트',     ja: '無制限プロジェクト' },
          { en: '6 regions',          ko: '리전 6개',            ja: 'リージョン6' },
          { en: '24-hour support',    ko: '24시간 지원',          ja: '24時間サポート' },
          { en: 'agent-handoff full', ko: 'agent-handoff full', ja: 'agent-handoff full' },
          { en: 'Token audit log',    ko: '토큰 감사 로그',        ja: 'トークン監査ログ' },
        ],
        featured: true,
      },
      {
        id: 'org',
        name: { en: 'Org',           ko: '오그',     ja: 'オーグ' },
        price: { en: 'Contact',      ko: '문의',     ja: 'お問い合わせ' },
        cycle: { en: 'annual',       ko: '연간',     ja: '年間' },
        note:  { en: 'For platforms with regulatory or multi-brand needs.', ko: '규제·멀티 브랜드 요구가 있는 플랫폼용.', ja: '規制要件・マルチブランドのプラットフォーム向け。' },
        rows: [
          { en: 'SSO + audit',           ko: 'SSO + 감사',         ja: 'SSO + 監査' },
          { en: '12 regions',            ko: '리전 12개',          ja: 'リージョン12' },
          { en: 'Dedicated CSM',         ko: '전담 CSM',           ja: '専任CSM' },
          { en: 'Custom data residency', ko: '커스텀 데이터 리전',   ja: 'カスタム・データ・レジデンシー' },
          { en: 'Private RFP review',    ko: '비공개 RFP 검토',      ja: '非公開RFPレビュー' },
        ],
      },
    ],
  },
  customers: {
    eyebrow: { en: '04 / 06 · Customers',  ko: '04 / 06 · 고객사',  ja: '04 / 06 · 顧客' },
    title:   { en: 'Trusted by teams that ship every weekday.', ko: '평일마다 배포하는 팀들이 신뢰합니다.', ja: '毎週日次でリリースするチームが信頼。' },
    logos: ['NORTHWIND', 'ACME / OS', 'CALMR', 'ATELIER 12', 'NORTH WINDOW', 'STRATA'],
  },
  quote: {
    eyebrow: { en: '05 / 06 · Quote',  ko: '05 / 06 · 인용',  ja: '05 / 06 · 引用' },
    body: {
      en: '"We replaced a Notion page, a Slack channel, and a weekly meeting with this console. The work that used to take Thursday afternoon now takes ten minutes on Monday morning."',
      ko: '"이 콘솔 하나가 Notion 페이지 한 장, Slack 채널 하나, 주간 회의 하나를 대체했습니다. 목요일 오후를 잡아먹던 작업이 이제 월요일 아침 10분이면 끝납니다."',
      ja: '「このコンソールはNotionページ1枚、Slackチャンネル1つ、週次ミーティング1回を置き換えた。木曜午後を費やしていた仕事が、月曜朝の10分で終わる。」',
    },
    by: { en: 'L. Kim — Design Systems Lead, Strata', ko: '— L. 김, 디자인 시스템 리드, Strata', ja: '— L. キム、デザインシステム・リード、Strata' },
  },
  cta: {
    eyebrow: { en: '06 / 06 · Get started',  ko: '06 / 06 · 시작하기',  ja: '06 / 06 · 始める' },
    title: { en: 'Open the console — 14-day trial, no card.', ko: '콘솔 열기 — 14일 평가판, 카드 없음.', ja: 'コンソールを開く — 14日トライアル、カード不要。' },
    placeholder: { en: 'work email', ko: '회사 이메일', ja: '会社のメール' },
    button: { en: 'Request access', ko: '액세스 요청', ja: 'アクセス申請' },
    meta: { en: 'No card. SOC 2 II in audit · Hosted in 12 regions.', ko: '카드 없음. SOC 2 II 감사 중 · 12개 리전 호스팅.', ja: 'カード不要。SOC 2 II 監査中 · 12リージョンでホスト。' },
  },
} as const;

const promptEn = `Design a creative single-page B2B SaaS landing in Strict Console fusion: Swiss-poster grid discipline holds a calm operational dashboard. The page should feel like a product, not a brochure.

PARENTS:
Swiss Poster brings the chassis: 12-column left-aligned grid, red coordinate marker for section numbers only, thick rule for major separators, hairline for inner rules, Inter at a single weight family.
Quiet Utility brings the inside: dense panels (filters, tables, status rows), tabular mono numerics, low-drama state colours, working-tool spacing.

DISCIPLINE:
1) ONE red (#e6332d) on the page. Reserved for: section number (N°01-06), table status pulse, hero punctuation. Never on buttons.
2) Buttons are outlined black or solid black — text-only or with a 1-px outline. Outlined for secondary, solid for primary.
3) All numbers in JetBrains Mono with tabular figures. No proportional numerics anywhere.
4) Hairlines are real: 1.5 px solid #111 for strong rules, 1 px solid rgba(0,0,0,0.22) for inner rules. No 8 % opacity decoration.
5) Page background is paper-grey #f4f1ea. White only inside white panels.
6) No gradients. No glow. No animation longer than 200 ms.

TOKENS:
--paper #f4f1ea  --surface #ffffff  --ink #0a0a0a  --ink-2 #3a3833  --mute #6a655e  --line rgba(0,0,0,0.22)  --rule #0a0a0a  --red #e6332d

TYPOGRAPHY:
Display: Inter at 500, tracking -0.025em on h1.
Body: Inter at 400, line-height 1.55.
Mono: JetBrains Mono at 400 for every number, every code id, every tag.

LAYOUT (single page, six sections):
1) Top brand bar — brand left ("STYLEBOOK / OPERATIONS") + nav center + version mono right. Bottom: 1.5 px black rule.
2) Hero (N°01) — left half: red section mark + eyebrow + huge headline + lede + primary button (solid black) + secondary link. Right half: status strip (4 metric tiles) with mono numerics and red pulse on the live indicator.
3) Operations panel (N°02) — eyebrow + headline + sub + a working table interface. Filter row (3 dropdown chips, each currently selected). 7-row table. Status badges: live = mono green dot, draft = grey dot. Bottom right summary line ("Showing 7 of 184 tokens").
4) Pricing matrix (N°03) — strict 3-column with hairline cell borders. Each plan: name, price (huge mono), cycle, note, bullet rows with hairline separators, and a row-bottom CTA (outlined or solid). Center plan is featured (red top accent stripe, otherwise identical).
5) Customers (N°04) — eyebrow + small headline + 6-logo strip (logo placeholders as bordered cells with uppercase tracked-out type).
6) Quote (N°05) — large serif-less quote in Inter 500, attribution in mono.
7) Get started (N°06) — eyebrow + headline + a 1-row form (email input + solid black button) + a tiny mono note line (no card / SOC2 / regions).

INTERACTIONS:
· Filter chips: clicking cycles selected value. Selected = solid black background, paper text.
· Table row hover: paper background.
· Primary button hover: invert to outlined.
· Email input focus: 1.5 px black outline, no glow.

MOTION:
None except 160 ms state transitions on hover/focus.

OUTPUT:
1) Tokens above as CSS variables.
2) Sections 1–7 in order.
3) Mobile: nav collapses, hero stacks, table becomes a scroll-x area but keeps mono numerics, pricing becomes one column with featured first.`;

const promptKo = `Strict Console 퓨전 — *스위스 12열 그리드*가 *차분한 운영 대시보드*를 잡아주는 B2B SaaS 랜딩. 페이지가 브로셔가 아니라 *제품*처럼 느껴져야 합니다.

부모:
Swiss Poster = 섀시 — 12열 좌측 정렬 그리드, 빨강 좌표는 *섹션 번호*에만, 두꺼운 룰로 주요 분리, 하어라인으로 내부 분리, Inter 단일 굵기 패밀리.
Quiet Utility = 내부 — 밀도 높은 패널(필터·테이블·상태 행), tabular 모노 숫자, 차분한 상태 색, 작업 도구 간격.

규율:
1) 빨강(#e6332d) 한 색만. 섹션 번호(N°01-06)·테이블 상태 펄스·히어로 구두점에만. 버튼에 사용 금지.
2) 버튼은 검정 솔리드 또는 검정 아웃라인 — 텍스트 전용이거나 1 px 아웃라인. 보조는 아웃라인, 주요는 솔리드.
3) 모든 숫자는 JetBrains Mono, tabular figures. 비례 숫자 사용 금지.
4) 하어라인은 진짜로: 굵은 룰 1.5 px solid #111, 내부 룰 1 px solid rgba(0,0,0,0.22). 8% 투명 장식 금지.
5) 페이지 배경은 페이퍼 그레이 #f4f1ea. 흰색은 흰 패널 안에서만.
6) 그라디언트 금지, 글로우 금지, 200 ms 초과 애니메이션 금지.

토큰:
--paper #f4f1ea  --surface #ffffff  --ink #0a0a0a  --ink-2 #3a3833  --mute #6a655e  --line rgba(0,0,0,0.22)  --rule #0a0a0a  --red #e6332d

타이포: 디스플레이 Inter 500, h1 자간 -0.025em. 본문 Inter 400, 라인하이트 1.55. 모노 JetBrains Mono 400.

레이아웃(6섹션):
1) 톱 브랜드 바 — 좌 "STYLEBOOK / OPERATIONS" + 중앙 nav + 우 mono 버전. 하단 1.5 px 검정 룰.
2) 히어로(N°01) — 좌반: 빨강 섹션 마크 + 키커 + 큰 헤드라인 + 리드 + 솔리드 검정 버튼 + 보조 링크. 우반: 4타일 상태 스트립(mono 숫자 + live 빨강 펄스).
3) 운영 콘솔(N°02) — 키커 + 헤드라인 + 서브 + *진짜 작동하는 듯한 테이블*. 필터 행 3칩(선택 칩은 솔리드 검정 배경). 7행 테이블. 상태 뱃지(live=초록 점, draft=회색 점). 우하단 요약 라인.
4) 가격(N°03) — 3열 엄격, 셀 하어라인. 각 플랜: 이름·가격(큰 모노)·주기·메모·하어라인 행·CTA. 중앙 플랜은 featured(상단 빨강 스트라이프, 그 외 동일).
5) 고객사(N°04) — 키커 + 작은 헤드라인 + 6 로고 스트립(보더 셀, 대문자 자간 0.18em 활자).
6) 인용(N°05) — 큰 Inter 500 인용 + mono 출처.
7) 시작(N°06) — 키커 + 헤드라인 + 1행 폼(이메일 + 솔리드 검정 버튼) + 모노 메타 한 줄.

인터랙션: 필터 칩 사이클, 행 호버 페이퍼 배경, 주요 버튼 호버 시 아웃라인 반전, 이메일 포커스 1.5 px 검정 아웃라인.

모션: 160 ms hover/focus 상태 전환만.

출력: 위 토큰을 CSS 변수로, 섹션 1-7 순서대로, 모바일에서 nav 접힘·히어로 스택·테이블 가로 스크롤·가격 1열(피처드 먼저).`;

const promptJa = `Strict Consoleフュージョン — *スイス12カラム・グリッド*が*静かな運用ダッシュボード*を支えるB2B SaaSランディング。ページがブローシャではなく*プロダクト*に感じられる必要がある。

親:
Swiss Poster = シャーシ — 12カラム左寄せ、赤い座標マークは*セクション番号*にのみ、太い罫で主要分離、ヘアラインで内側、Interの単一ウェイト・ファミリ。
Quiet Utility = 内部 — 高密度パネル(フィルタ・テーブル・状態行)、tabularモノ数字、控えめな状態色、作業道具の間隔。

規律:
1) 赤(#e6332d)を1色のみ。セクション番号(N°01-06)・テーブル状態パルス・ヒーロー句読のみ。ボタン使用禁止。
2) ボタンは黒ソリッドまたは黒アウトライン — テキスト専用または1 pxアウトライン。補助はアウトライン、主要はソリッド。
3) 全ての数字はJetBrains Mono、tabular figures。プロポーショナル数字禁止。
4) ヘアラインは本物に: 強い罫は1.5 px solid #111、内側は1 px solid rgba(0,0,0,0.22)。8 %透明の装飾禁止。
5) ページ背景は紙色グレー #f4f1ea。白は白パネルの中だけ。
6) グラデーション禁止、グロウ禁止、200 msを超えるアニメーション禁止。

トークン:
--paper #f4f1ea  --surface #ffffff  --ink #0a0a0a  --ink-2 #3a3833  --mute #6a655e  --line rgba(0,0,0,0.22)  --rule #0a0a0a  --red #e6332d

タイポ: ディスプレイInter 500、h1の字間-0.025em。本文Inter 400、行間1.55。モノはJetBrains Mono 400。

レイアウト(6セクション):
1) ブランドバー — 左「STYLEBOOK / OPERATIONS」+ 中央nav + 右モノ・バージョン。下部1.5 px黒罫。
2) ヒーロー(N°01)— 左半分: 赤セクション・マーク+キッカー+大見出し+リード+黒ソリッド・ボタン+補助リンク。右半分: 4タイル状態ストリップ(モノ数字+live赤パルス)。
3) 運用パネル(N°02)— キッカー+見出し+サブ+*実作業に見えるテーブル*。フィルタ行3チップ(選択チップは黒ソリッド)。7行テーブル。状態バッジ(live=緑点、draft=灰点)。右下に要約行。
4) 料金(N°03)— 3列の厳格、セル・ヘアライン。各プラン: 名前・価格(大きなモノ)・周期・メモ・ヘアライン行・CTA。中央プランはfeatured(上部に赤ストライプ、その他は同一)。
5) 顧客(N°04)— キッカー+小見出し+6ロゴ・ストリップ(罫付きセル、字間0.18emの大文字)。
6) 引用(N°05)— 大きなInter 500の引用+モノの出所。
7) 始める(N°06)— キッカー+見出し+1行フォーム(メール+黒ソリッド・ボタン)+モノ・メタ一行。

インタラクション: フィルタ・チップ循環、行ホバー=紙色、主要ボタンのホバー=アウトライン反転、メール・フォーカス=1.5 px黒アウトライン。

モーション: 160 msのhover/focus状態遷移のみ。

出力: 上記トークンをCSS変数で、セクション1-7を順に、モバイルではnav折畳・ヒーロー縦積み・テーブル横スクロール・料金1列(featured先頭)。`;

export function PortedFusionStrictConsolePage({ lang }: PortedStylePageProps) {
  const lng = lang as Lang;
  const [selected, setSelected] = useState<Record<string, string>>({
    region: 'all', env: 'prod', status: 'live',
  });
  const [email, setEmail] = useState<string>('');

  const cycleFilter = (groupId: string, valueId: string) => {
    setSelected((prev) => ({ ...prev, [groupId]: valueId }));
  };

  const styleVars: CSSProperties = {};

  return (
    <FusionShell
      fusionId="fusion-strict-console"
      lang={lang}
      prev={{ href: '/pages/fusion-noir-metal.html', label: 'Noir Metal' }}
      next={{ href: '/pages/fusion-quiet-manifesto.html', label: 'Quiet Manifesto' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
    >
      <div className="sc-shell" style={styleVars}>

        {/* Top bar */}
        <header className="sc-topbar">
          <div className="sc-topbar__brand">
            <span className="sc-topbar__mark" aria-hidden="true" />
            <strong>{COPY.brand}</strong>
          </div>
          <nav className="sc-topbar__nav">
            {COPY.navItems.map((n, i) => (
              <a key={i} href="#" className={i === 0 ? 'is-active' : ''}>{L(n, lng)}</a>
            ))}
          </nav>
          <span className="sc-topbar__version">{COPY.version}</span>
        </header>

        {/* HERO N°01 */}
        <section className="sc-hero">
          <div className="sc-hero__left">
            <div className="sc-eyebrow">
              <span className="sc-eyebrow__mark" aria-hidden="true">●</span>
              <span>{L(COPY.hero.eyebrow, lng)}</span>
            </div>
            <h1 className="sc-hero__title">
              {L(COPY.hero.title, lng).split('*').map((chunk, i) =>
                i % 2 === 1 ? <em key={i} className="sc-hero__accent">{chunk}</em> : <span key={i}>{chunk}</span>
              )}
            </h1>
            <p className="sc-hero__lede">{L(COPY.hero.lede, lng)}</p>
            <div className="sc-hero__ctas">
              <a href="#" className="sc-btn sc-btn--primary">
                <span>{L(COPY.hero.primaryCta, lng)}</span>
                <span className="sc-btn__arrow" aria-hidden="true">→</span>
              </a>
              <a href="#" className="sc-btn sc-btn--link">{L(COPY.hero.secondaryCta, lng)}</a>
            </div>
          </div>
          <aside className="sc-hero__status">
            {COPY.status.map((tile, i) => (
              <div key={i} className="sc-status">
                <span className="sc-status__label">{L(tile.label, lng)}</span>
                <span className="sc-status__value">{tile.value}<em>{tile.unit}</em></span>
                {i === 0 ? <span className="sc-status__pulse" aria-hidden="true" /> : null}
              </div>
            ))}
          </aside>
        </section>

        {/* OPS N°02 */}
        <section className="sc-section">
          <header className="sc-section__head">
            <div className="sc-eyebrow"><span className="sc-eyebrow__mark" aria-hidden="true">●</span><span>{L(COPY.ops.eyebrow, lng)}</span></div>
            <h2 className="sc-section__title">{L(COPY.ops.title, lng)}</h2>
            <p className="sc-section__sub">{L(COPY.ops.sub, lng)}</p>
          </header>

          <div className="sc-panel">
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
                        onClick={() => cycleFilter(group.id, value.id)}
                      >
                        {L(value.label, lng)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="sc-table-wrap">
              <table className="sc-table">
                <thead>
                  <tr>
                    {COPY.ops.columns.map((c, i) => (
                      <th key={i} scope="col">{L(c, lng)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <span className="sc-table__id">{row.id}</span>
                        <span className="sc-table__name">{row.name}</span>
                      </td>
                      <td className="sc-table__mono">{row.region}</td>
                      <td className="sc-table__mono">{row.env}</td>
                      <td>
                        <span className={`sc-badge sc-badge--${row.status}`}>
                          <span className="sc-badge__dot" aria-hidden="true" />
                          {row.status}
                        </span>
                      </td>
                      <td className="sc-table__mono sc-table__right">{row.consumers}</td>
                      <td className="sc-table__mono">{row.version}</td>
                      <td className="sc-table__mono">{row.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="sc-panel__foot">
              <span>{L(COPY.ops.summary, lng)}</span>
            </footer>
          </div>
        </section>

        {/* PRICING N°03 */}
        <section className="sc-section">
          <header className="sc-section__head">
            <div className="sc-eyebrow"><span className="sc-eyebrow__mark" aria-hidden="true">●</span><span>{L(COPY.pricing.eyebrow, lng)}</span></div>
            <h2 className="sc-section__title">{L(COPY.pricing.title, lng)}</h2>
          </header>
          <div className="sc-pricing">
            {COPY.pricing.plans.map((plan) => (
              <article key={plan.id} className={`sc-plan ${plan.featured ? 'is-featured' : ''}`}>
                {plan.featured ? <span className="sc-plan__stripe" aria-hidden="true" /> : null}
                <header className="sc-plan__head">
                  <span className="sc-plan__name">{L(plan.name, lng)}</span>
                  <span className="sc-plan__price">
                    <strong>{L(plan.price, lng)}</strong>
                    <em>{L(plan.cycle, lng)}</em>
                  </span>
                  <span className="sc-plan__note">{L(plan.note, lng)}</span>
                </header>
                <ul className="sc-plan__rows">
                  {plan.rows.map((row, i) => (
                    <li key={i}><span aria-hidden="true">·</span><span>{L(row, lng)}</span></li>
                  ))}
                </ul>
                <a href="#" className={`sc-btn ${plan.featured ? 'sc-btn--primary' : 'sc-btn--outline'}`}>
                  <span>{plan.id === 'org' ? (lng === 'ko' ? '영업팀 문의' : lng === 'ja' ? '営業に問い合わせ' : 'Talk to sales') : (lng === 'ko' ? '시작하기' : lng === 'ja' ? '始める' : 'Start free trial')}</span>
                  <span className="sc-btn__arrow" aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* CUSTOMERS N°04 */}
        <section className="sc-section">
          <header className="sc-section__head">
            <div className="sc-eyebrow"><span className="sc-eyebrow__mark" aria-hidden="true">●</span><span>{L(COPY.customers.eyebrow, lng)}</span></div>
            <h2 className="sc-section__title sc-section__title--small">{L(COPY.customers.title, lng)}</h2>
          </header>
          <div className="sc-logos" aria-label="Customer logos">
            {COPY.customers.logos.map((logo) => (
              <span key={logo} className="sc-logo">{logo}</span>
            ))}
          </div>
        </section>

        {/* QUOTE N°05 */}
        <section className="sc-section">
          <div className="sc-eyebrow"><span className="sc-eyebrow__mark" aria-hidden="true">●</span><span>{L(COPY.quote.eyebrow, lng)}</span></div>
          <blockquote className="sc-quote">
            <p>{L(COPY.quote.body, lng)}</p>
            <cite>{L(COPY.quote.by, lng)}</cite>
          </blockquote>
        </section>

        {/* CTA N°06 */}
        <section className="sc-section sc-section--cta">
          <header className="sc-section__head">
            <div className="sc-eyebrow"><span className="sc-eyebrow__mark" aria-hidden="true">●</span><span>{L(COPY.cta.eyebrow, lng)}</span></div>
            <h2 className="sc-section__title">{L(COPY.cta.title, lng)}</h2>
          </header>
          <form className="sc-cta-form" onSubmit={(e) => e.preventDefault()}>
            <label className="sc-input">
              <span className="sc-input__label">{L(COPY.cta.placeholder, lng)}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@team.example"
              />
            </label>
            <button type="submit" className="sc-btn sc-btn--primary">
              <span>{L(COPY.cta.button, lng)}</span>
              <span className="sc-btn__arrow" aria-hidden="true">→</span>
            </button>
          </form>
          <p className="sc-cta-meta">{L(COPY.cta.meta, lng)}</p>
        </section>
      </div>
    </FusionShell>
  );
}
