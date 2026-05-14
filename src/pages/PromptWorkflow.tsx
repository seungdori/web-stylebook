import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Lang } from '../data/styles';
import { localize, styleCatalog } from '../data/styles';
import { translate } from '../data/i18n';
import { antiPatterns, decisionExamples, preflightChecks, verificationGroups } from '../data/agentHandoff';
import { PromptBlock } from '../components/PromptBlock';
import { copyText } from '../utils/clipboard';

type SectionMode = 'manual' | 'ai';
type SectionId = 'purpose' | 'styleTone' | 'stack' | 'designSystem' | 'components' | 'assembly' | 'qa';
type WorkflowPath = 'ai' | 'custom';

const publicBaseUrl = 'https://www.webstylebook.com';

const text = (en: string, ko: string, ja: string) => ({ en, ko, ja });

const modeCopy = {
  manual: text('Manual', '직접 지정', '直接指定'),
  ai: text('AI auto', 'AI 자동', 'AI自動'),
};

const workflowCopy = {
  aiPathTitle: text('Agent handoff link', '자동 구현 링크', '自動実装リンク'),
  aiPathDesc: text(
    'Copy one link so an AI coding agent can read the style candidates, choose what it needs, and continue into implementation.',
    'AI에게 링크 하나만 전달하면 스타일 후보를 읽고, 필요한 방향을 고른 뒤 구현으로 이어가도록 만든 경로입니다.',
    'AIにリンクを1つ渡すだけで、スタイル候補を読み、必要な方向を選んで実装へ進めるルートです。',
  ),
  customPathTitle: text('Custom setup', '커스텀 설정', 'カスタム設定'),
  customPathDesc: text(
    'For people who want to override project details, references, and section ownership.',
    '프로젝트 정보, 레퍼런스, 섹션별 담당 방식을 직접 바꿀 때 쓰는 경로입니다.',
    'プロジェクト情報、参照、セクション別の担当方法を直接変えるルートです。',
  ),
  copyAiUrl: text('Copy Link', '링크 복사', 'リンクをコピー'),
  aiRouteTitle: text('Give this link to your AI builder', 'AI에게 이 링크를 전달하세요', 'AIにこのリンクを渡す'),
  aiRouteDesc: text(
    'The copied link opens the English handoff view. It contains the usage guide, style catalog, and build prompt so the agent can inspect only the references it needs.',
    '복사되는 링크는 영어 기준 화면으로 열립니다. 작업 안내, 스타일 후보, 구현 프롬프트가 함께 있어 AI가 필요한 레퍼런스만 골라 확인할 수 있습니다.',
    'コピーされるリンクは英語表示で開きます。使い方、スタイル候補、実装プロンプトを含み、AIが必要な参照だけを確認できます。',
  ),
  openAiPath: text('Use handoff link', '자동 구현 링크 보기', '自動実装リンクを見る'),
  openCustomPath: text('Customize', '커스텀하기', 'カスタムする'),
  parseContractTitle: text('How to use this link', '이 링크를 쓰는 방식', 'このリンクの使い方'),
  styleIndexTitle: text('Style candidates', '스타일 후보', 'スタイル候補'),
  implementationPromptTitle: text('Build prompt', '구현 프롬프트', '実装プロンプト'),
  oneShotTitle: text('Implementation prompt', '실행 프롬프트', '実行プロンプト'),
  phaseTitle: text('Staged prompts', '단계별 보조 프롬프트', '段階別補助プロンプト'),
  modeTitle: text('Section execution mode', '섹션별 실행 모드', 'セクション別実行モード'),
  modeDesc: text(
    'Choose where the human gives exact direction and where the AI should infer, design, and implement.',
    '사람이 정확히 지정할 영역과 AI가 추론, 설계, 구현까지 맡을 영역을 나눕니다.',
    '人が正確に指定する領域と、AIが推論・設計・実装まで担う領域を分けます。',
  ),
  noteLabel: text('Human notes / override', '직접 지시 / 오버라이드', '直接指示 / 上書き'),
  autoPreview: text('AI automation rule', 'AI 자동화 규칙', 'AI自動化ルール'),
  copyOneShot: text('Copy One-shot Prompt', '원샷 프롬프트 복사', 'ワンショットをコピー'),
  copyAll: text('Copy One-shot + Staged Prompts', '원샷 + 단계별 전체 복사', 'ワンショット + 段階別をコピー'),
  referenceTitle: text('Compact style reference pack', '압축 스타일 레퍼런스팩', '圧縮スタイル参照パック'),
  briefTitle: text('1. Project brief', '1. 프로젝트 브리프', '1. プロジェクトブリーフ'),
  referencePickerTitle: text('2. Style references', '2. 스타일 레퍼런스', '2. スタイル参照'),
  constraintsTitle: text('3. Build constraints', '3. 제작 조건', '3. 制作条件'),
  selectedRefs: text('Selected references', '선택된 레퍼런스', '選択中の参照'),
  editRefs: text('Edit references', '레퍼런스 수정', '参照を編集'),
  hideRefs: text('Hide reference list', '레퍼런스 목록 닫기', '参照リストを閉じる'),
  noRefsHint: text('No reference selected. Open the picker and choose at least one direction.', '선택된 레퍼런스가 없습니다. 목록을 열어 최소 하나의 방향을 고르세요.', '参照が選択されていません。リストを開いて少なくとも一つ選んでください。'),
  workflowCount: text('Sections', '섹션', 'セクション'),
  aiCount: text('AI auto', 'AI 자동', 'AI自動'),
  manualCount: text('Manual', '직접 지정', '直接指定'),
  outputReady: text('Ready to copy', '복사 준비 완료', 'コピー準備完了'),
  viewAutoRule: text('Automation rule', '자동화 규칙', '自動化ルール'),
  preflightTitle: text('Pre-flight: confirm before designing', '시작 전 사전 점검', '設計前のプリフライト'),
  preflightDesc: text(
    'Five facts the agent must establish before writing any design or code. Skipping these is the most common cause of wrong-product output.',
    'AI가 설계나 코드를 쓰기 전에 반드시 확정해야 할 5가지. 이 단계를 건너뛰면 가장 흔하게 잘못된 제품이 나옵니다.',
    'AIが設計やコードを書く前に必ず確定すべき5項目。ここを飛ばすと最も頻繁に誤った製品が出ます。',
  ),
  verificationTitle: text('Self-verification before reporting done', '완료 보고 전 자가 검증', '完了報告前のセルフ検証'),
  verificationDesc: text(
    'Run every group below before claiming the work is finished. Any failure becomes a FIX-NOW item in the self-audit prompt.',
    '작업이 끝났다고 말하기 전에 아래 모든 그룹을 점검합니다. 하나라도 실패하면 self-audit 프롬프트에서 FIX-NOW 항목이 됩니다.',
    '完了と言う前に下記の全グループを点検します。1つでも失敗するとself-auditでFIX-NOW項目になります。',
  ),
  antiPatternTitle: text('Anti-patterns to avoid', '피해야 할 안티패턴', '回避すべきアンチパターン'),
  antiPatternDesc: text(
    'Concrete failure modes that look acceptable in isolation but ruin the result. Treat each one as a hard constraint, not a stylistic preference.',
    '단독으로 보면 괜찮아 보이지만 결과를 망치는 구체적 실패 모드. 취향이 아니라 강제 제약으로 다룹니다.',
    '単独では問題なく見えても結果を台無しにする失敗モード。好みではなく強制制約として扱います。',
  ),
  selfAuditTitle: text('Self-audit prompt', '자가 감사 프롬프트', 'セルフ監査プロンプト'),
  selfAuditDesc: text(
    'Run this prompt after building, against your own output. It returns PASS / FIX-NOW / RISK verdicts for every checkpoint.',
    '구현이 끝난 뒤 자신의 결과물에 대고 실행하는 프롬프트. 각 항목에 PASS / FIX-NOW / RISK 판정을 돌려줍니다.',
    '実装完了後、自分の成果物に対して実行するプロンプト。各項目にPASS / FIX-NOW / RISKの判定を返します。',
  ),
  copySelfAudit: text('Copy Self-audit Prompt', '자가 감사 프롬프트 복사', 'セルフ監査をコピー'),
  copyJsonUrl: text('Copy slim JSON URL', '슬림 JSON URL 복사', 'スリムJSON URLをコピー'),
  copyFullJsonUrl: text('Copy full JSON URL', '전체 JSON URL 복사', 'フルJSON URLをコピー'),
  jsonEndpointTitle: text('Direct JSON endpoint (no JavaScript required)', 'JSON 엔드포인트 (JavaScript 불필요)', 'JSONエンドポイント (JavaScript不要)'),
  jsonEndpointDesc: text(
    'Two endpoints — slim (EN-only, ~20 kB) for fast agent fetches, full (trilingual + complete style metadata) when richer context is needed. Both return the same contract shape: pre-flight, style catalog, anti-patterns, verification checklist, build prompt, and self-audit prompt. Fetch with curl, WebFetch, or any HTTP client — no HTML scraping or JS execution required.',
    '두 가지 엔드포인트가 있습니다 — 슬림(EN 전용, 약 20 kB)은 빠른 agent 페치용, 풀(트리링구얼 + 전체 스타일 메타데이터)은 더 풍부한 맥락이 필요할 때 사용합니다. 둘 다 동일한 계약 구조를 반환합니다: 사전 점검, 스타일 카탈로그, 안티패턴, 검증 체크리스트, 구현·자가 감사 프롬프트. curl, WebFetch, 어떤 HTTP 클라이언트로든 가져올 수 있고 HTML 스크레이핑이나 JS 실행이 필요 없습니다.',
    '2つのエンドポイントがあります — スリム(EN専用、約20 kB)は高速なエージェントフェッチ用、フル(トリリンガル + 完全なスタイルメタデータ)はより豊富な文脈が必要なとき。両方とも同じ契約構造を返します: プリフライト、スタイルカタログ、アンチパターン、検証チェックリスト、実装・セルフ監査プロンプト。curl、WebFetch、任意のHTTPクライアントで取得でき、HTMLスクレイピングやJS実行は不要です。',
  ),
  rawJsonTitle: text('Raw JSON contract (human-readable)', '원본 JSON 계약 (사람이 읽는 용도)', '生JSON契約 (人が読む用)'),
  rawJsonDesc: text(
    'Same content the static /agent-handoff.json endpoint serves, pretty-printed for browser inspection. Expand to read or copy fields directly.',
    '정적 /agent-handoff.json 엔드포인트가 제공하는 것과 동일한 내용을 브라우저에서 확인할 수 있도록 정렬해 표시합니다. 펼쳐서 필드를 바로 읽거나 복사하세요.',
    '静的な/agent-handoff.jsonエンドポイントが提供するのと同じ内容をブラウザで確認できるよう整形して表示します。展開してフィールドを直接読むかコピーしてください。',
  ),
  rawJsonToggle: text('Show raw JSON', '원본 JSON 펼치기', '生JSONを開く'),
  decisionExamplesTitle: text('Decision examples (worked picks with reasoning)', '결정 예시 (선정 근거와 함께)', '判断例 (選定理由付き)'),
  decisionExamplesDesc: text(
    'Seven worked examples calibrate style selection. Each shows the product, the primary (and optional secondary) style picked, the reasoning, and styles deliberately not picked with reasons. Use these to bias your decision before scanning all 42 styles.',
    '7개의 worked example이 스타일 선택의 기준을 잡아줍니다. 각 예시는 제품, 선정된 주력(과 선택적 보조) 스타일, 근거, 그리고 의도적으로 배제한 스타일과 그 이유를 보여줍니다. 42개 스타일을 다 스캔하기 전에 이걸로 판단의 편향을 잡으세요.',
    '7つの判断例がスタイル選択の基準を作ります。各例は製品、選んだメインスタイル(と任意で補助)、理由、意図的に外したスタイルとその理由を示します。42個のスタイルを全部走査する前に、この例で判断のバイアスを整えてください。',
  ),
  primaryLabel: text('Primary', '주력', 'メイン'),
  secondaryLabel: text('Secondary', '보조', '補助'),
  reasoningLabel: text('Reasoning', '근거', '理由'),
  wouldNotPickLabel: text('Would not pick', '배제한 선택지', '選ばなかった候補'),
  whyLabel: text('Why', '이유', '理由'),
  fixLabel: text('Fix', '대응', '対応'),
  stepSelfAudit: text('5. Self-audit', '5. 자가 감사', '5. セルフ監査'),
};

const workflowSections = [
  {
    id: 'purpose',
    title: text('Purpose & product framing', '목적과 제품 정의', '目的とプロダクト定義'),
    desc: text(
      'Clarifies what is being built, who it is for, and what a successful first screen must communicate.',
      '무엇을 만들고, 누구에게 쓰이며, 첫 화면이 무엇을 전달해야 하는지 고정합니다.',
      '何を作り、誰が使い、最初の画面で何を伝えるべきかを固定します。',
    ),
    auto: text(
      'Infer the product goal, audience, primary jobs-to-be-done, and MVP page scope from the brief. If details are missing, make conservative assumptions, record them in design.md, and continue.',
      '브리프에서 제품 목적, 타겟, 핵심 사용 과업, MVP 페이지 범위를 추론합니다. 정보가 비면 보수적으로 가정하고 design.md에 기록한 뒤 멈추지 말고 진행합니다.',
      'ブリーフから目的、対象、主要タスク、MVPページ範囲を推論します。不明点は保守的に仮定し、design.mdに記録して進めます。',
    ),
  },
  {
    id: 'styleTone',
    title: text('Style, tone & manner', '스타일, 톤 앤 매너', 'スタイル、トーン&マナー'),
    desc: text(
      'Forces an intentional visual direction before writing components.',
      '컴포넌트를 쓰기 전에 목적에 맞는 시각 방향을 먼저 정합니다.',
      'コンポーネントを書く前に目的に合う視覚方向を決めます。',
    ),
    auto: text(
      'First decide which style and tone fit the implementation goal. Use the selected Web Stylebook profiles below as the primary reference. Only open www.webstylebook.com when the compact reference pack is insufficient, to avoid unnecessary token use.',
      '가장 먼저 구현 목적에 어울리는 스타일과 톤 앤 매너를 결정합니다. 아래 선택된 Web Stylebook 프로필을 기본 레퍼런스로 쓰고, 압축 레퍼런스만으로 부족할 때만 토큰 낭비를 피하며 www.webstylebook.com을 참조합니다.',
      '最初に目的に合うスタイルとトーンを決めます。下のWeb Stylebookプロファイルを主参照にし、不足するときだけwww.webstylebook.comを参照します。',
    ),
  },
  {
    id: 'stack',
    title: text('Stack & project bootstrap', '스택과 프로젝트 설치', 'スタックとプロジェクト作成'),
    desc: text(
      'Controls framework defaults and installation choices.',
      '프레임워크 기본값과 설치 방식을 제어합니다.',
      'フレームワーク既定値と導入方法を制御します。',
    ),
    auto: text(
      'Unless the human explicitly asks for another stack, create the project with the current stable Next.js release, TypeScript, App Router, ESLint, and a package manager consistent with the repository. Add libraries only when they pay for themselves.',
      '사람이 다른 스택을 명시하지 않으면 현재 안정화된 최신 Next.js, TypeScript, App Router, ESLint 기준으로 설치합니다. 패키지 매니저는 저장소 관례를 따르고, 라이브러리는 실제 이득이 있을 때만 추가합니다.',
      '別スタックの明示がなければ、安定版の最新Next.js、TypeScript、App Router、ESLintで作成します。パッケージマネージャーはリポジトリに合わせ、必要なライブラリだけ追加します。',
    ),
  },
  {
    id: 'designSystem',
    title: text('Design tokens & design.md', '디자인 토큰과 design.md', 'デザイントークンとdesign.md'),
    desc: text(
      'Requires a written design contract before implementation spreads.',
      '구현이 퍼지기 전에 디자인 계약을 문서와 토큰으로 고정합니다.',
      '実装が広がる前にデザイン契約を文書とトークンで固定します。',
    ),
    auto: text(
      'Before page assembly, create design.md and define stable keys for colors, typography, spacing, radius, shadows, borders, motion, elevation, component density, and responsive breakpoints. Implement those keys as CSS variables or theme tokens.',
      '페이지 조립 전에 design.md를 만들고 색상, 타이포그래피, 간격, 반경, 그림자, 보더, 모션, elevation, 컴포넌트 밀도, 반응형 브레이크포인트 키를 먼저 정의합니다. 이 키들을 CSS 변수나 테마 토큰으로 구현합니다.',
      'ページ組み立て前にdesign.mdを作り、色、タイポグラフィ、余白、半径、影、境界線、モーション、elevation、密度、ブレークポイントを先に定義します。それをCSS変数またはテーマトークンとして実装します。',
    ),
  },
  {
    id: 'components',
    title: text('Component foundation', '컴포넌트 기초 제작', 'コンポーネント基盤'),
    desc: text(
      'Builds reusable frames before individual pages.',
      '개별 페이지보다 재사용 가능한 틀을 먼저 만듭니다.',
      '個別ページより先に再利用可能な土台を作ります。',
    ),
    auto: text(
      'Create the component foundations first: AppShell, Header/Nav, Button, FormControls, Card/Panel, SectionHeader, FeatureList, CTA, Empty/Loading/Error states, and any domain-specific blocks. Use shadcn/ui actively when it improves reliability for common controls, but avoid it when the desired visual style needs freer custom composition.',
      'AppShell, Header/Nav, Button, FormControls, Card/Panel, SectionHeader, FeatureList, CTA, Empty/Loading/Error 상태, 도메인 전용 블록 같은 컴포넌트 기초를 먼저 만듭니다. 일반 컨트롤의 안정성이 필요하면 shadcn/ui를 적극 활용하되, 원하는 스타일의 자유도가 더 중요하면 억지로 쓰지 않습니다.',
      'AppShell、Header/Nav、Button、FormControls、Card/Panel、SectionHeader、FeatureList、CTA、Empty/Loading/Error状態、ドメイン固有ブロックを先に作ります。一般的な制御の信頼性が必要ならshadcn/uiを使い、自由な見た目が必要なら無理に使いません。',
    ),
  },
  {
    id: 'assembly',
    title: text('Page assembly', '페이지 조립', 'ページ組み立て'),
    desc: text(
      'Turns the design system and components into complete screens.',
      '디자인 시스템과 컴포넌트를 완성 화면으로 조립합니다.',
      'デザインシステムとコンポーネントを完成画面に組み立てます。',
    ),
    auto: text(
      'After tokens and components exist, assemble the screens. Keep routes, sections, and copy data-driven where useful. Ensure each viewport has stable dimensions, readable hierarchy, no horizontal overflow, and no generic decorative filler.',
      '토큰과 컴포넌트가 준비된 뒤 화면을 조립합니다. 라우트, 섹션, 카피는 유용한 범위에서 데이터 기반으로 둡니다. 모든 뷰포트에서 안정적인 치수, 읽히는 위계, 가로 오버플로우 없음, 의미 없는 장식 없음 상태를 유지합니다.',
      'トークンとコンポーネント作成後に画面を組み立てます。ルート、セクション、コピーは有用な範囲でデータ駆動にします。全ビューポートで安定寸法、読みやすい階層、横スクロールなし、無意味な装飾なしを守ります。',
    ),
  },
  {
    id: 'qa',
    title: text('QA & verification', 'QA와 검증', 'QAと検証'),
    desc: text(
      'Defines the checks the AI must run before claiming completion.',
      'AI가 완료라고 말하기 전에 수행해야 할 검증을 정합니다.',
      'AIが完了と言う前に実行すべき検証を決めます。',
    ),
    auto: text(
      'Run the available checks before completion: lint, typecheck, build, and browser verification for desktop and mobile. Inspect real rendered screens for overlap, clipping, contrast, console errors, hydration issues, keyboard focus, and reduced-motion behavior.',
      '완료 전 가능한 검증을 실행합니다: lint, typecheck, build, 데스크톱/모바일 브라우저 확인. 실제 렌더링 화면에서 겹침, 잘림, 대비, 콘솔 오류, hydration 문제, 키보드 포커스, reduced-motion 동작을 확인합니다.',
      '完了前に可能な検証を実行します: lint、typecheck、build、デスクトップ/モバイルブラウザ確認。実画面で重なり、切れ、コントラスト、コンソールエラー、hydration、キーボードフォーカス、reduced-motionを確認します。',
    ),
  },
] as const;

const defaultSectionModes: Record<SectionId, SectionMode> = {
  purpose: 'manual',
  styleTone: 'ai',
  stack: 'ai',
  designSystem: 'ai',
  components: 'ai',
  assembly: 'ai',
  qa: 'ai',
};

const defaultSectionNotes: Record<SectionId, string> = {
  purpose: 'Use the project, target, and product fields as the source of truth. Do not dilute the brief into a generic landing page.',
  styleTone: 'If a specific style preset is selected, preserve its intent rather than averaging it into a generic SaaS look.',
  stack: 'Only override the Next.js default when the human explicitly names another stack or the existing repository already uses a different framework.',
  designSystem: 'Keep token names stable and reusable. The generated UI must be explainable from design.md.',
  components: 'Build the reusable component layer before page-specific composition.',
  assembly: 'Assemble real usable pages, not a marketing-only placeholder.',
  qa: 'Do not claim completion until checks and browser verification are summarized.',
};

const defaultSelected = () => {
  const preset = new URLSearchParams(window.location.search).get('stylePreset');
  if (!preset) return [];
  const keys = preset.split(',').map((item) => item.trim()).filter(Boolean);
  return keys.filter((key) => styleCatalog.some((style) => style.id === key));
};

const defaultWorkflowPath = (): WorkflowPath => {
  const value = new URLSearchParams(window.location.search).get('path');
  return value === 'custom' ? 'custom' : 'ai';
};

export function PromptWorkflow({ lang }: { lang: Lang }) {
  const [workflowPath, setWorkflowPathState] = useState<WorkflowPath>(defaultWorkflowPath);
  const [selected, setSelected] = useState<string[]>(defaultSelected);
  const [stylePickerOpen, setStylePickerOpen] = useState(() => defaultSelected().length === 0);
  const [project, setProject] = useState('');
  const [target, setTarget] = useState('');
  const [product, setProduct] = useState('');
  const [typographyMode, setTypographyMode] = useState<'auto' | 'manual'>('auto');
  const [headingFont, setHeadingFont] = useState('Instrument Sans / display-specific fallback');
  const [bodyFont, setBodyFont] = useState('IBM Plex Sans KR / Noto Sans JP / system sans');
  const [codeFont, setCodeFont] = useState('JetBrains Mono / ui-monospace');
  const [pages, setPages] = useState('');
  const [stack, setStack] = useState('');
  const [direction, setDirection] = useState('');
  const [mustKeep, setMustKeep] = useState('');
  const [forbidden, setForbidden] = useState('');
  const [sectionModes, setSectionModes] = useState<Record<SectionId, SectionMode>>(defaultSectionModes);
  const [sectionNotes, setSectionNotes] = useState<Record<SectionId, string>>(defaultSectionNotes);
  const [copiedOneShot, setCopiedOneShot] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSelfAudit, setCopiedSelfAudit] = useState(false);
  const [copiedJsonUrl, setCopiedJsonUrl] = useState(false);
  const [copiedFullJsonUrl, setCopiedFullJsonUrl] = useState(false);

  const selectedStyles = useMemo(() => selected.map((id) => styleCatalog.find((style) => style.id === id)).filter(Boolean), [selected]);
  const emptySelection = lang === 'ko' ? '선택된 레퍼런스 없음' : lang === 'ja' ? '選択された参照なし' : 'No references selected';
  const c = Object.fromEntries(Object.entries(workflowCopy).map(([key, value]) => [key, value[lang]])) as Record<keyof typeof workflowCopy, string>;
  const aiSectionCount = workflowSections.filter((section) => sectionModes[section.id] === 'ai').length;
  const manualSectionCount = workflowSections.length - aiSectionCount;

  function toggleStyle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function setSectionMode(id: SectionId, mode: SectionMode) {
    setSectionModes((current) => ({ ...current, [id]: mode }));
  }

  function setSectionNote(id: SectionId, value: string) {
    setSectionNotes((current) => ({ ...current, [id]: value }));
  }

  function workflowUrl(path: WorkflowPath) {
    const url = new URL(window.location.href);
    url.searchParams.set('path', path);
    return `${url.pathname}${url.search}${url.hash}`;
  }

  function agentHandoffUrl() {
    const url = new URL('/pages/prompt-workflow', publicBaseUrl);
    url.searchParams.set('path', 'ai');
    return url.toString();
  }

  const canonicalAiUrl = agentHandoffUrl();
  const jsonHandoffUrl = `${publicBaseUrl}/agent-handoff.json`;
  const fullJsonHandoffUrl = `${publicBaseUrl}/agent-handoff.full.json`;

  function setWorkflowPath(path: WorkflowPath) {
    setWorkflowPathState(path);
    window.history.pushState({}, '', workflowUrl(path));
  }

  async function copyAiUrl() {
    await copyText(canonicalAiUrl);
    setCopiedUrl(true);
    window.setTimeout(() => setCopiedUrl(false), 1200);
  }

  const withFallback = (value: string, fallback: string) => value.trim() || fallback;

  const styleSummary = selectedStyles
    .map((style) => `${localize(style!.name, lang)}: ${localize(style!.summary, lang)}`)
    .join('\n');

  const styleReferencePack = selectedStyles
    .map((style) => [
      `- ${localize(style!.name, lang)} (${style!.id})`,
      `  Summary: ${localize(style!.summary, lang)}`,
      `  Palette: ${style!.palette.join(', ')}`,
      `  Typography: ${style!.promptProfile.typography}`,
      `  Layout: ${style!.promptProfile.layout}`,
      `  Motion: ${style!.promptProfile.motion}`,
      `  Best for: ${style!.promptProfile.bestFor.join(', ')}`,
      `  Constraints: ${style!.promptProfile.constraints.join(', ')}`,
    ].join('\n'))
    .join('\n\n');

  const styleIndexJson = JSON.stringify({
    schema: 'webstylebook.agent-handoff.v2',
    handoffUrl: canonicalAiUrl,
    jsonEndpoint: jsonHandoffUrl,
    fullJsonEndpoint: fullJsonHandoffUrl,
    displayLanguage: lang,
    handoffLanguage: 'en',
    purpose: 'Machine-readable handoff for AI coding agents. Run the pre-flight checklist, choose the smallest useful set of style references, execute the build prompt, then run the self-audit against the verification checklist before reporting completion. For JS-free fetching, the same contract is served at jsonEndpoint (slim, EN-only) and fullJsonEndpoint (trilingual + complete metadata).',
    humanInputPolicy: {
      productContext: 'Use the human request, repository context, attached notes, or current task as the product source. Do not infer that Web Stylebook itself is the product.',
      missingDetails: 'Make conservative assumptions, document them in design.md under an "Assumptions" section, and continue unless the missing detail blocks implementation.',
      customRoute: `${publicBaseUrl}/pages/prompt-workflow?path=custom`,
    },
    parseOrder: [
      'Read this usage guide and the pre-flight checklist first.',
      'Confirm all five pre-flight items, recording assumptions in design.md.',
      'Scan the embedded style catalog by tags, bestFor, constraints, notIdealFor, typography, layout, motion, and palette. Read every entry — do not stop after the heuristics.',
      'Reject any candidate whose notIdealFor matches the target product before picking.',
      'Calibrate your pick against decisionExamples (product → chosen → reasoning → wouldNotPick).',
      'Choose one primary style and optionally one secondary style.',
      'Open detailUrl only for selected styles when the embedded catalog is insufficient.',
      'Read the build prompt as the implementation contract.',
      'Implement design.md, theme tokens, reusable components, then complete responsive screens.',
      'Run every group of the self-verification checklist.',
      'Run the self-audit prompt against your own output to produce PASS / FIX-NOW / RISK verdicts.',
      'Do not treat Web Stylebook itself as the target product unless the human explicitly says so.',
    ],
    preflightChecklist: preflightChecks.map((item) => ({
      id: item.id,
      label: item.label.en,
      detail: item.detail.en,
    })),
    selfVerificationChecklist: verificationGroups.map((group) => ({
      id: group.id,
      title: group.title.en,
      items: group.items.map((entry) => entry.en),
    })),
    antiPatterns: antiPatterns.map((entry) => ({
      id: entry.id,
      pattern: entry.pattern.en,
      why: entry.why.en,
      fix: entry.fix.en,
    })),
    decisionExamples: decisionExamples.map((example) => ({
      id: example.id,
      product: example.product.en,
      chosenPrimary: example.chosenPrimary,
      chosenSecondary: example.chosenSecondary,
      reasoning: example.reasoning.en,
      wouldNotPick: example.wouldNotPick.map((item) => ({
        id: item.id,
        reason: item.reason.en,
      })),
    })),
    styleSelectionHeuristics: [
      'Operational SaaS, dashboards, admin, and repeated workflows usually fit Quiet Utility or Platform Core.',
      'Documentation, premium writing, portfolios, and editorial products usually fit Editorial Silence, Swiss Poster, or Mono Type.',
      'Creator launches, events, campaigns, and bold consumer products usually fit Kinetic Pop, Duotone Bold, or selected fusion styles.',
      'Security, developer tools, trading, infrastructure, and terminal-heavy products can fit Terminal Core, Console Launch, Cyberpunk Glitch, or Runtime Signal when contrast remains readable.',
      'If the product requires trust, repeated use, or dense scanning, favor restraint over spectacle even when using an expressive reference.',
    ],
    detailFetchPolicy: {
      compactFirst: true,
      fetchWhen: [
        'The chosen style needs concrete layout, surface, or motion examples beyond this JSON.',
        'The target product has an unusual tone and one detail page can prevent generic output.',
        'Two candidate styles are close and the detail pages will clarify which one fits.',
      ],
      avoidWhen: [
        'The JSON already provides enough palette, typography, layout, motion, and constraints.',
        'Opening many style pages would waste context without improving implementation.',
      ],
    },
    implementationProtocol: {
      defaultStack: 'Unless the human explicitly asks for another stack, use the current stable Next.js release with TypeScript, App Router, ESLint, and the repository-consistent package manager.',
      designDocument: 'Create design.md before broad implementation. It must define the chosen style, tone, token keys, component rules, responsive behavior, and assumptions.',
      tokenContract: ['colors', 'typography', 'spacing', 'radius', 'borders', 'shadows', 'motion', 'density', 'breakpoints', 'focus states'],
      componentFoundation: ['AppShell', 'Header/Nav', 'Button', 'FormControls', 'Card/Panel', 'SectionHeader', 'FeatureList', 'CTA', 'Empty/Loading/Error states', 'domain-specific blocks'],
      libraryPolicy: 'Use shadcn/ui when it improves common-control reliability. Skip it when the chosen style needs freer custom composition.',
      assemblyPolicy: 'Build complete usable screens from tokens and components. Avoid placeholder-only landing pages, nested card stacks, meaningless decoration, clipped text, and horizontal overflow.',
      verificationChecklist: verificationGroups.flatMap((group) => group.items.map((entry) => entry.en)),
      selfAuditRoute: `${canonicalAiUrl}#self-audit`,
    },
    styleCount: styleCatalog.length,
    styles: styleCatalog.map((style) => ({
      id: style.id,
      name: style.name,
      kind: style.kind,
      tags: style.tags,
      detailUrl: `${publicBaseUrl}${style.route}`,
      workflowUrl: `${publicBaseUrl}/pages/prompt-workflow?path=custom&stylePreset=${style.id}`,
      palette: style.palette,
      accent: style.accent,
      summary: style.summary,
      promptProfile: style.promptProfile,
      visualProfile: style.visualProfile,
      fusionOf: style.fusionOf || [],
    })),
  }, null, 2);

  const typography = workflowPath === 'ai'
    ? 'AI chooses a purpose-fit typography system after deciding the product style and tone. If compact style references are provided, use their typography hints.'
    : typographyMode === 'auto'
    ? selectedStyles
      .map((style) => `${localize(style!.name, lang)} -> ${style!.promptProfile.typography}`)
      .join('\n') || 'AI chooses based on selected style and product purpose.'
    : `Heading: ${headingFont}\nBody: ${bodyFont}\nCode: ${codeFont}`;

  const baseFacts = [
    `Project: ${workflowPath === 'ai' ? 'Use the project described by the human, URL context, repository, or current task. Do not assume this Web Stylebook page is the project being built.' : withFallback(project, 'Unspecified by the human. Infer from the request and repository context.')}`,
    `Target: ${workflowPath === 'ai' ? 'Infer the audience from the human request. If missing, choose a conservative product audience and record the assumption in design.md.' : withFallback(target, 'Unspecified by the human. Infer a practical audience and record the assumption in design.md.')}`,
    `Product: ${workflowPath === 'ai' ? 'Infer the product/service from the human request. If the request is vague, define a narrow MVP that can be built and verified.' : withFallback(product, 'Unspecified by the human. Define the narrowest useful product scope before implementation.')}`,
    `Selected style references:\n${styleSummary || 'No style selected'}`,
    `Typography:\n${typography}`,
    `Required pages: ${workflowPath === 'ai' ? 'Infer the minimum page set needed for the product. Do not create unnecessary marketing pages.' : withFallback(pages, 'Infer the minimum useful page set from the product goal.')}`,
    `Tech stack: ${workflowPath === 'ai' ? 'Unless explicitly told otherwise, use the current stable Next.js release with TypeScript, App Router, ESLint, and a package manager matching the repository.' : withFallback(stack, 'Unless explicitly told otherwise, use the current stable Next.js release with TypeScript, App Router, ESLint, and repository-consistent package management.')}`,
    `Preferred direction: ${workflowPath === 'ai' ? 'First choose the style, tone, and manner that match the product purpose. Avoid generic AI-looking UI.' : withFallback(direction, 'AI decides a purpose-fit style, tone, and manner before implementation.')}`,
    `Must keep: ${workflowPath === 'ai' ? 'Mobile stability, readable typography, accessible controls, stable responsive dimensions, clear hierarchy, and no routine clarifying questions.' : withFallback(mustKeep, 'Mobile stability, readable typography, accessible controls, stable responsive dimensions, and clear hierarchy.')}`,
    `Forbidden: ${workflowPath === 'ai' ? 'Horizontal scroll, clipped text, low contrast, nested cards, meaningless decoration, placeholder-only pages, and claiming completion without verification.' : withFallback(forbidden, 'Horizontal scroll, clipped text, low contrast, nested cards, meaningless decoration, and claiming completion without verification.')}`,
    `${c.referenceTitle}:\n${styleReferencePack || 'No compact style reference selected. Use the product purpose to choose a style.'}`,
  ].join('\n\n');

  const sectionBrief = workflowSections.map((section) => {
    const mode = workflowPath === 'ai' ? 'ai' : sectionModes[section.id];
    const modeLabel = mode === 'manual' ? 'Human-directed' : 'AI-autonomous';
    const instruction = mode === 'manual'
      ? `Follow this human-provided direction exactly:\n${sectionNotes[section.id] || 'No manual override was provided. Use the base facts and proceed conservatively.'}`
      : localize(section.auto, lang);

    return [
      `### ${localize(section.title, lang)}`,
      `Mode: ${modeLabel}`,
      instruction,
    ].join('\n');
  }).join('\n\n');

  const foundationProtocol = [
    'Execution protocol:',
    '0. If this prompt came with a Web Stylebook link, open that link first and read the usage guide, pre-flight checklist, style catalog, anti-patterns, verification checklist, and build prompt before designing.',
    '1. Run the pre-flight checklist. Confirm the product source, repository state, primary style choice, page scope, and missing-detail policy before writing anything.',
    '2. Decide the purpose-fit visual style, tone, and manner. Use the style catalog to select one primary style and optionally one secondary style. Explain why the chosen direction fits the product and audience.',
    '3. If the compact style catalog is not enough, open only the selected style detailUrl pages. Do not browse every style page.',
    '4. If the human did not explicitly require another stack, create or continue with the current stable Next.js release, TypeScript, App Router, and ESLint.',
    '5. Before page implementation, create design.md with the chosen visual direction: color keys, typography keys, spacing, radius, borders, shadows, motion, density, responsive rules, and an Assumptions section.',
    '6. Implement the design keys as reusable theme tokens or CSS variables before building screens.',
    '7. Build the component foundation first. Use shadcn/ui for reliable common controls when it helps, but do not force it when custom composition is needed for the style.',
    '8. Assemble complete, usable screens from those components. Avoid placeholder-only landing pages unless that is the actual product.',
    '9. Confirm every anti-pattern listed in the handoff is absent from the result.',
    '10. Walk through every group of the self-verification checklist. Fix anything that fails before reporting completion.',
    '11. Run the self-audit prompt on your own output and produce PASS / FIX-NOW / RISK verdicts for every checkpoint.',
  ].join('\n');

  const agentGuide = text(
    [
      'This link is the briefing page for an AI coding agent to open before implementation.',
      `Share link: ${canonicalAiUrl}`,
      `Direct JSON (no JS required): ${jsonHandoffUrl}`,
      '',
      'Read in this order:',
      '1. This usage guide.',
      '2. Pre-flight checklist — confirm all five items before writing any code or design.',
      '3. Style catalog — pick one primary style (optionally one secondary) for the product. Read every entry; check notIdealFor before committing.',
      '4. Decision examples — calibrate your pick against worked examples.',
      '5. Anti-patterns — hard constraints, not preferences.',
      '6. Build prompt — the implementation contract.',
      '7. Self-verification checklist — run before reporting completion.',
      '8. Self-audit prompt — run on your own output to grade PASS / FIX-NOW / RISK.',
      '',
      'Rules:',
      '- Do not copy Web Stylebook as the target product.',
      '- Infer the product from the human request, repository, URL context, or attached notes.',
      '- If details are missing, make a conservative assumption, record it in design.md under "Assumptions", and continue.',
      '- Produce design.md, theme tokens, reusable components, complete responsive screens, an anti-pattern absence check, and a verification summary.',
      '- Never claim completion without running the self-audit.',
    ].join('\n'),
    [
      '이 링크는 AI 코딩 에이전트가 구현 전에 먼저 열어보는 기준 페이지입니다.',
      `공유 링크: ${canonicalAiUrl}`,
      `직접 JSON (JS 불필요): ${jsonHandoffUrl}`,
      '',
      '읽는 순서:',
      '1. 이 작업 안내.',
      '2. 사전 점검(Pre-flight) — 코드/디자인 작성 전 5가지를 모두 확정합니다.',
      '3. 스타일 카탈로그 — 제품에 맞는 주력 1개(+선택적 보조 1개)를 고릅니다. 모든 항목을 읽고, 결정 전에 notIdealFor를 반드시 확인합니다.',
      '4. 결정 예시(decisionExamples) — worked example과 비교해 선택을 보정합니다.',
      '5. 안티패턴 — 취향이 아니라 강제 제약입니다.',
      '6. 구현 프롬프트 — 작업 계약서입니다.',
      '7. 자가 검증 체크리스트 — 완료 보고 전에 모두 확인합니다.',
      '8. 자가 감사 프롬프트 — 자신의 결과물에 실행해 PASS / FIX-NOW / RISK 판정을 냅니다.',
      '',
      '규칙:',
      '- Web Stylebook 자체를 만들 제품으로 착각하지 않습니다.',
      '- 사람의 요청, 저장소, URL 맥락, 첨부 노트에서 제품을 추론합니다.',
      '- 정보가 비면 보수적으로 가정하고 design.md의 "Assumptions"에 기록한 뒤 계속 진행합니다.',
      '- design.md, 테마 토큰, 재사용 컴포넌트, 완성된 반응형 화면, 안티패턴 부재 확인, 검증 요약까지 만듭니다.',
      '- 자가 감사 없이 완료라고 보고하지 않습니다.',
    ].join('\n'),
    [
      'このリンクは、AIコーディングエージェントが実装前に最初に開く基準ページです。',
      `共有リンク: ${canonicalAiUrl}`,
      `直接JSON (JS不要): ${jsonHandoffUrl}`,
      '',
      '読む順序:',
      '1. この使い方ガイド。',
      '2. プリフライトチェック — コードやデザインを書く前に5項目すべて確定。',
      '3. スタイルカタログ — 製品に合うメイン1つ(+任意で補助1つ)を選ぶ。全項目を読み、決定前にnotIdealForを必ず確認。',
      '4. 判断例(decisionExamples) — worked exampleと比較して選択を校正。',
      '5. アンチパターン — 好みではなく強制制約。',
      '6. 実装プロンプト — 作業契約。',
      '7. セルフ検証チェックリスト — 完了報告前に全項目を確認。',
      '8. セルフ監査プロンプト — 自分の成果物に対して実行し、PASS / FIX-NOW / RISKを判定。',
      '',
      'ルール:',
      '- Web Stylebook自体を作る製品と誤解しません。',
      '- 人の依頼、リポジトリ、URL文脈、添付ノートから製品を推論します。',
      '- 情報が不足する場合は保守的に仮定し、design.mdの「Assumptions」に記録して進めます。',
      '- design.md、テーマトークン、再利用コンポーネント、完成レスポンシブ画面、アンチパターン不在確認、検証要約まで作ります。',
      '- セルフ監査なしに完了と報告しません。',
    ].join('\n'),
  )[lang];

  const styleCatalogNote = text(
    `The full style catalog is embedded in this page for agents. There are ${styleCatalog.length} candidates; the agent should choose only the references that fit the product instead of copying a default style.`,
    `전체 스타일 후보 데이터는 이 페이지 안에 포함되어 있습니다. 총 ${styleCatalog.length}개 후보 중에서 제품 목적에 맞는 것만 골라 쓰도록 설계했습니다.`,
    `スタイル候補の完全なデータはこのページ内に含まれています。合計${styleCatalog.length}件の候補から、製品目的に合うものだけを選ぶ設計です。`,
  )[lang];

  const preflightAsText = preflightChecks
    .map((item, index) => `${index + 1}. ${item.label.en} — ${item.detail.en}`)
    .join('\n');

  const verificationAsText = verificationGroups
    .map((group) => [
      `[${group.title.en}]`,
      ...group.items.map((entry) => `- ${entry.en}`),
    ].join('\n'))
    .join('\n\n');

  const antiPatternsAsText = antiPatterns
    .map((entry, index) => [
      `${index + 1}. ${entry.pattern.en}`,
      `   Why: ${entry.why.en}`,
      `   Fix: ${entry.fix.en}`,
    ].join('\n'))
    .join('\n\n');

  const oneShotPrompt = [
    'You are an autonomous senior frontend product designer and implementation engineer.',
    workflowPath === 'ai'
      ? `Open this Web Stylebook handoff link before designing: ${canonicalAiUrl}. Or fetch ${jsonHandoffUrl} directly (no JS execution required) to get the full handoff contract — usage guide, pre-flight checklist, style catalog, anti-patterns, verification checklist, build prompt, and self-audit prompt — in one HTTP call. Choose the product-fit style before implementing, and open selected style detailUrl pages only when the compact catalog is insufficient.`
      : 'The human wants one prompt that takes the work from pre-flight reasoning through design, component foundation, page assembly, and self-audit without stopping for routine questions.',
    `How to pick the style direction (do not skip): the full catalog is in the styles[] array of this same handoff JSON (also embedded as <script type="application/json" id="webstylebook-agent-style-catalog"> in the HTML). Each entry has summary, bestFor, constraints, notIdealFor, and detailUrl. Read every entry — styleSelectionHeuristics is a starting point, not a final answer. Calibrate your decision against decisionExamples (each example shows product, chosenPrimary, chosenSecondary, reasoning, and wouldNotPick). Reject any style whose notIdealFor matches the target product. If two candidates remain close, open their detailUrl pages.`,
    baseFacts,
    'Pre-flight (confirm before any design or code):',
    preflightAsText,
    foundationProtocol,
    'Section execution plan:',
    sectionBrief,
    'Anti-patterns — every item below must be absent from the result:',
    antiPatternsAsText,
    'Self-verification — run every group below before reporting completion:',
    verificationAsText,
    'Required deliverables:',
    '- design.md with the chosen visual style, tone, token keys, component rules, responsive behavior, and an Assumptions section.',
    '- A tokenized theme or CSS variable layer that matches design.md.',
    '- Reusable base components before page-specific layouts.',
    '- Complete responsive pages using the chosen stack.',
    '- A final verification summary listing commands run, viewports inspected, anti-patterns confirmed absent, remaining risks, and files changed.',
    'Working rule: if information is missing, make a reasonable assumption, write it in design.md under Assumptions, and keep moving unless the missing detail makes implementation impossible.',
  ].join('\n\n');

  const selfAuditPrompt = [
    'You are auditing your own frontend implementation against the Web Stylebook handoff contract.',
    'For every checkpoint, return one verdict: PASS, FIX-NOW, or RISK. FIX-NOW must be fixed before the work is reported as done. RISK is acceptable but must be named in the verification summary.',
    workflowPath === 'ai'
      ? `Handoff link the work used: ${canonicalAiUrl}`
      : 'This audit covers the same product brief used to build the work.',
    baseFacts,
    'Pre-flight — confirm each item is reflected in the actual output and in design.md:',
    preflightAsText,
    'Anti-patterns — confirm each is absent. If present, report FIX-NOW with the exact location:',
    antiPatternsAsText,
    'Self-verification checklist — verdict per item:',
    verificationAsText,
    'Output format:',
    '1. Pre-flight verdicts (per item).',
    '2. Anti-pattern verdicts (per item) with file:line references for any FIX-NOW.',
    '3. Verification verdicts grouped by category, with the failing command output for any FIX-NOW.',
    '4. Final summary: total PASS / FIX-NOW / RISK counts, the smallest concrete next change for every FIX-NOW, and the residual concern for every RISK.',
    'Working rule: do not soften verdicts to look better. A genuine FIX-NOW that survives this audit is worth more than a clean-looking report that hides issues.',
  ].join('\n\n');

  const prompts = {
    oneShot: oneShotPrompt,
    design: [
      'You are a senior product designer.',
      'Create a precise visual direction before any page implementation. Decide the style, tone, and manner that fit the product goal.',
      baseFacts,
      foundationProtocol,
      sectionBrief,
      'Output: design.md draft, color tokens, typography scale, spacing/radius rules, layout grid, component tone, and responsive notes.',
    ].join('\n\n'),
    component: [
      'You are a frontend design-system engineer.',
      'Convert the design direction into reusable frontend component foundations before building pages.',
      baseFacts,
      foundationProtocol,
      sectionBrief,
      'Output components: AppShell, Header/Nav, Footer, Button, FormControls, Card/Panel, SectionHeader, FeatureList, CTA, Empty/Loading/Error states, PromptBlock, PageNav, and any domain-specific blocks. Include states and accessibility requirements.',
    ].join('\n\n'),
    assembly: [
      'You are a frontend implementation engineer.',
      'Assemble complete screens from the design tokens and reusable components.',
      baseFacts,
      foundationProtocol,
      sectionBrief,
      'Output: route map, data flow, state ownership, responsive behavior, implementation sequence, and static build notes.',
    ].join('\n\n'),
    qa: [
      'You are a QA reviewer for production frontend work.',
      'Audit the result against the following product constraints.',
      baseFacts,
      foundationProtocol,
      sectionBrief,
      'Check: lint/typecheck/build, console errors, desktop and mobile layout, overflow, text clipping, keyboard focus, contrast, reduced-motion behavior, copy buttons, route/query preservation, and whether the output follows design.md.',
    ].join('\n\n'),
    selfAudit: selfAuditPrompt,
  };

  const allPrompt = Object.entries(prompts).map(([key, value]) => `## ${key.toUpperCase()}\n${value}`).join('\n\n');

  async function copyOneShot() {
    await copyText(oneShotPrompt);
    setCopiedOneShot(true);
    window.setTimeout(() => setCopiedOneShot(false), 1200);
  }

  async function copyAll() {
    await copyText(allPrompt);
    setCopiedAll(true);
    window.setTimeout(() => setCopiedAll(false), 1200);
  }

  async function copySelfAuditPrompt() {
    await copyText(selfAuditPrompt);
    setCopiedSelfAudit(true);
    window.setTimeout(() => setCopiedSelfAudit(false), 1200);
  }

  async function copyJsonHandoffUrl() {
    await copyText(jsonHandoffUrl);
    setCopiedJsonUrl(true);
    window.setTimeout(() => setCopiedJsonUrl(false), 1200);
  }

  async function copyFullJsonHandoffUrl() {
    await copyText(fullJsonHandoffUrl);
    setCopiedFullJsonUrl(true);
    window.setTimeout(() => setCopiedFullJsonUrl(false), 1200);
  }

  return (
    <>
      <section className="page-hero page-hero--workflow">
        <p className="hero__eyebrow">Prompt Workflow</p>
        <h1>{translate(lang, 'prompt.title')}</h1>
        <p>{translate(lang, 'prompt.desc')}</p>
      </section>

      <section className="workflow-path-router" aria-label="Prompt workflow path">
        {(['ai', 'custom'] as const).map((path) => (
          <button
            key={path}
            className={`workflow-path-card${workflowPath === path ? ' is-active' : ''}`}
            type="button"
            aria-pressed={workflowPath === path}
            onClick={() => setWorkflowPath(path)}
          >
            <strong>{path === 'ai' ? c.aiPathTitle : c.customPathTitle}</strong>
            <span>{path === 'ai' ? c.aiPathDesc : c.customPathDesc}</span>
          </button>
        ))}
      </section>

      {workflowPath === 'ai' ? (
        <section className="workflow-ai-route">
          <div className="workflow-ai-route__head">
            <div>
              <h2>{c.aiRouteTitle}</h2>
              <p>{c.aiRouteDesc}</p>
            </div>
            <div className="workflow-ai-route__actions">
              <button className="button" type="button" onClick={copyAiUrl}>
                {copiedUrl ? translate(lang, 'detail.copied') : c.copyAiUrl}
              </button>
              <button className="button button--dark" type="button" onClick={copyOneShot}>
                {copiedOneShot ? translate(lang, 'detail.copied') : c.copyOneShot}
              </button>
              <button className="button" type="button" onClick={copySelfAuditPrompt}>
                {copiedSelfAudit ? translate(lang, 'detail.copied') : c.copySelfAudit}
              </button>
            </div>
          </div>
          <section className="workflow-ai-readable workflow-json-endpoint" id="json-endpoint" data-agent-section="json-endpoint">
            <h3>{c.jsonEndpointTitle}</h3>
            <p>{c.jsonEndpointDesc}</p>
            <div className="workflow-json-endpoint__row">
              <code>{jsonHandoffUrl}</code>
              <div className="workflow-json-endpoint__actions">
                <button className="button" type="button" onClick={copyJsonHandoffUrl}>
                  {copiedJsonUrl ? translate(lang, 'detail.copied') : c.copyJsonUrl}
                </button>
                <a className="button button--dark" href={jsonHandoffUrl} target="_blank" rel="noreferrer">
                  {lang === 'ko' ? '슬림 열기' : lang === 'ja' ? 'スリムを開く' : 'Open slim'}
                </a>
              </div>
            </div>
            <div className="workflow-json-endpoint__row">
              <code>{fullJsonHandoffUrl}</code>
              <div className="workflow-json-endpoint__actions">
                <button className="button" type="button" onClick={copyFullJsonHandoffUrl}>
                  {copiedFullJsonUrl ? translate(lang, 'detail.copied') : c.copyFullJsonUrl}
                </button>
                <a className="button button--dark" href={fullJsonHandoffUrl} target="_blank" rel="noreferrer">
                  {lang === 'ko' ? '전체 열기' : lang === 'ja' ? 'フルを開く' : 'Open full'}
                </a>
              </div>
            </div>
          </section>
          <section className="workflow-ai-readable" id="agent-guide" data-agent-section="usage-guide">
            <h3>{c.parseContractTitle}</h3>
            <pre>{agentGuide}</pre>
          </section>
          <section className="workflow-ai-readable workflow-checklist" id="preflight" data-agent-section="preflight">
            <h3>{c.preflightTitle}</h3>
            <p>{c.preflightDesc}</p>
            <ol className="workflow-checklist__list">
              {preflightChecks.map((item) => (
                <li key={item.id}>
                  <strong>{item.label[lang]}</strong>
                  <span>{item.detail[lang]}</span>
                </li>
              ))}
            </ol>
          </section>
          <section className="workflow-ai-readable workflow-style-catalog" id="style-catalog" data-agent-section="style-catalog">
            <h3>{c.styleIndexTitle}</h3>
            <p>{styleCatalogNote}</p>
            <div className="workflow-candidate-list" aria-label={c.styleIndexTitle}>
              {styleCatalog.slice(0, 18).map((style) => (
                <span key={style.id} style={{ '--accent': style.accent } as CSSProperties}>
                  {localize(style.name, lang)}
                </span>
              ))}
              <span>{lang === 'ko' ? `외 ${styleCatalog.length - 18}개` : lang === 'ja' ? `ほか${styleCatalog.length - 18}件` : `+${styleCatalog.length - 18} more`}</span>
            </div>
          </section>
          <section className="workflow-ai-readable workflow-decision-examples" id="decision-examples" data-agent-section="decision-examples">
            <h3>{c.decisionExamplesTitle}</h3>
            <p>{c.decisionExamplesDesc}</p>
            <ol className="workflow-decision-examples__list">
              {decisionExamples.map((example) => (
                <li key={example.id}>
                  <strong>{example.product[lang]}</strong>
                  <div className="workflow-decision-examples__picks">
                    <span className="workflow-decision-examples__pick workflow-decision-examples__pick--primary">
                      <em>{c.primaryLabel}:</em> <code>{example.chosenPrimary}</code>
                    </span>
                    {example.chosenSecondary ? (
                      <span className="workflow-decision-examples__pick workflow-decision-examples__pick--secondary">
                        <em>{c.secondaryLabel}:</em> <code>{example.chosenSecondary}</code>
                      </span>
                    ) : null}
                  </div>
                  <p className="workflow-decision-examples__reasoning">
                    <em>{c.reasoningLabel}:</em> {example.reasoning[lang]}
                  </p>
                  {example.wouldNotPick.length > 0 ? (
                    <div className="workflow-decision-examples__avoid">
                      <em>{c.wouldNotPickLabel}:</em>
                      <ul>
                        {example.wouldNotPick.map((item) => (
                          <li key={item.id}>
                            <code>{item.id}</code> — {item.reason[lang]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
          <section className="workflow-ai-readable workflow-antipatterns" id="anti-patterns" data-agent-section="anti-patterns">
            <h3>{c.antiPatternTitle}</h3>
            <p>{c.antiPatternDesc}</p>
            <ol className="workflow-antipatterns__list">
              {antiPatterns.map((entry) => (
                <li key={entry.id}>
                  <strong>{entry.pattern[lang]}</strong>
                  <p><em>{c.whyLabel}:</em> {entry.why[lang]}</p>
                  <p><em>{c.fixLabel}:</em> {entry.fix[lang]}</p>
                </li>
              ))}
            </ol>
          </section>
          <section className="workflow-ai-readable workflow-verification" id="self-verification" data-agent-section="self-verification">
            <h3>{c.verificationTitle}</h3>
            <p>{c.verificationDesc}</p>
            <div className="workflow-verification__groups">
              {verificationGroups.map((group) => (
                <div key={group.id} className="workflow-verification__group">
                  <h4>{group.title[lang]}</h4>
                  <ul>
                    {group.items.map((entry) => (
                      <li key={entry.en}>{entry[lang]}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <PromptBlock title={c.implementationPromptTitle} text={prompts.oneShot} lang={lang} collapsible />
          <section className="workflow-ai-readable" id="self-audit" data-agent-section="self-audit">
            <h3>{c.selfAuditTitle}</h3>
            <p>{c.selfAuditDesc}</p>
            <PromptBlock title={c.selfAuditTitle} text={prompts.selfAudit} lang={lang} collapsible defaultCollapsed />
          </section>
          <section className="workflow-ai-readable workflow-raw-json" id="raw-json" data-agent-section="raw-json">
            <h3>{c.rawJsonTitle}</h3>
            <p>{c.rawJsonDesc}</p>
            <details className="workflow-raw-json__details">
              <summary>{c.rawJsonToggle}</summary>
              <pre className="workflow-raw-json__pre">{styleIndexJson}</pre>
            </details>
          </section>
          <script type="application/json" id="webstylebook-agent-style-catalog">
            {styleIndexJson}
          </script>
        </section>
      ) : (
        <>
          <section className="workflow-layout">
        <form className="workflow-form">
          <section className="workflow-panel">
            <div className="workflow-panel__head">
              <h2>{c.briefTitle}</h2>
            </div>
            <div className="workflow-field-grid">
              <label>
                {translate(lang, 'prompt.project')}
                <input value={project} placeholder="예: 신규 SaaS 랜딩 페이지" onChange={(event) => setProject(event.target.value)} />
              </label>
              <label>
                {translate(lang, 'prompt.target')}
                <input value={target} placeholder="예: 초기 스타트업 팀" onChange={(event) => setTarget(event.target.value)} />
              </label>
            </div>
            <label>
              {translate(lang, 'prompt.product')}
              <textarea value={product} placeholder="무엇을 만들지 짧게 적으세요. 비워두면 AI가 요청과 저장소에서 추론합니다." onChange={(event) => setProduct(event.target.value)} />
            </label>
          </section>

          <section className="workflow-panel workflow-reference-picker" aria-labelledby="workflow-reference-title">
            <div className="workflow-panel__head">
              <h2 id="workflow-reference-title">{c.referencePickerTitle}</h2>
              <div className="workflow-panel__actions">
                <button className="button" type="button" onClick={() => setSelected([])}>
                  {translate(lang, 'prompt.deselect')}
                </button>
                <button className="button button--dark" type="button" onClick={() => setStylePickerOpen((value) => !value)}>
                  {stylePickerOpen ? c.hideRefs : c.editRefs}
                </button>
              </div>
            </div>
            <div className="workflow-reference-summary" aria-label={c.selectedRefs}>
              {selectedStyles.length > 0 ? selectedStyles.map((style) => (
                <span key={style!.id} style={{ '--accent': style!.accent } as CSSProperties}>
                  {localize(style!.name, lang)}
                </span>
              )) : <p>{c.noRefsHint}</p>}
            </div>
            {stylePickerOpen ? (
              <div className="preset-grid">
                {styleCatalog.map((style) => {
                  const checked = selected.includes(style.id);
                  return (
                    <label
                      key={style.id}
                      className={`preset-option${checked ? ' is-selected' : ''}`}
                      style={{ '--accent': style.accent } as CSSProperties}
                    >
                      <input type="checkbox" checked={checked} onChange={() => toggleStyle(style.id)} />
                      <span className="preset-option__name">{localize(style.name, lang)}</span>
                    </label>
                  );
                })}
              </div>
            ) : null}
          </section>

          <section className="workflow-panel">
            <div className="workflow-panel__head">
              <h2>{c.constraintsTitle}</h2>
            </div>
            <div className="workflow-field-grid">
              <label>
                {translate(lang, 'prompt.typo')}
                <select value={typographyMode} onChange={(event) => setTypographyMode(event.target.value as 'auto' | 'manual')}>
                  <option value="auto">{translate(lang, 'prompt.auto')}</option>
                  <option value="manual">{translate(lang, 'prompt.manual')}</option>
                </select>
              </label>
              <label>
                {translate(lang, 'prompt.stack')}
                <input value={stack} placeholder="비워두면 안정화된 최신 Next.js 기준" onChange={(event) => setStack(event.target.value)} />
              </label>
            </div>
            {typographyMode === 'manual' ? (
              <div className="form-grid">
                <label>
                  {translate(lang, 'prompt.headingFont')}
                  <input value={headingFont} onChange={(event) => setHeadingFont(event.target.value)} />
                </label>
                <label>
                  {translate(lang, 'prompt.bodyFont')}
                  <input value={bodyFont} onChange={(event) => setBodyFont(event.target.value)} />
                </label>
                <label>
                  {translate(lang, 'prompt.codeFont')}
                  <input value={codeFont} onChange={(event) => setCodeFont(event.target.value)} />
                </label>
              </div>
            ) : null}
            <label>
              {translate(lang, 'prompt.pages')}
              <input value={pages} placeholder="비워두면 AI가 최소 페이지 범위 추론" onChange={(event) => setPages(event.target.value)} />
            </label>
            <div className="workflow-field-grid workflow-field-grid--three">
              <label>
                {translate(lang, 'prompt.direction')}
                <textarea value={direction} placeholder="원하는 톤이 있으면 입력" onChange={(event) => setDirection(event.target.value)} />
              </label>
              <label>
                {translate(lang, 'prompt.mustKeep')}
                <textarea value={mustKeep} placeholder="반드시 지켜야 할 조건" onChange={(event) => setMustKeep(event.target.value)} />
              </label>
              <label>
                {translate(lang, 'prompt.forbidden')}
                <textarea value={forbidden} placeholder="피해야 할 표현/구조" onChange={(event) => setForbidden(event.target.value)} />
              </label>
            </div>
          </section>

          <section className="workflow-mode-board" aria-labelledby="workflow-mode-title">
            <div className="workflow-mode-board__head">
              <div>
                <h2 id="workflow-mode-title">{c.modeTitle}</h2>
                <p>{c.modeDesc}</p>
              </div>
            </div>
            <div className="workflow-mode-list">
              {workflowSections.map((section) => {
                const activeMode = sectionModes[section.id];
                return (
                  <div className="workflow-mode-row" key={section.id}>
                    <div className="workflow-mode-row__main">
                      <strong>{localize(section.title, lang)}</strong>
                      <p>{localize(section.desc, lang)}</p>
                    </div>
                    <div className="workflow-mode-row__controls" role="group" aria-label={localize(section.title, lang)}>
                      {(['manual', 'ai'] as const).map((mode) => (
                        <button
                          key={mode}
                          className={`mode-toggle${activeMode === mode ? ' is-active' : ''}`}
                          type="button"
                          aria-pressed={activeMode === mode}
                          onClick={() => setSectionMode(section.id, mode)}
                        >
                          {modeCopy[mode][lang]}
                        </button>
                      ))}
                    </div>
                    {activeMode === 'manual' ? (
                      <label className="workflow-mode-row__note">
                        {c.noteLabel}
                        <textarea value={sectionNotes[section.id]} onChange={(event) => setSectionNote(section.id, event.target.value)} />
                      </label>
                    ) : (
                      <details className="workflow-mode-row__auto">
                        <summary>{c.viewAutoRule}</summary>
                        <p>{localize(section.auto, lang)}</p>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </form>

        <aside className="workflow-state">
          <h2>{translate(lang, 'prompt.current')}</h2>
          <div className="workflow-state__metrics">
            <div>
              <strong>{workflowSections.length}</strong>
              <span>{c.workflowCount}</span>
            </div>
            <div>
              <strong>{aiSectionCount}</strong>
              <span>{c.aiCount}</span>
            </div>
            <div>
              <strong>{manualSectionCount}</strong>
              <span>{c.manualCount}</span>
            </div>
          </div>
          {selectedStyles.length > 0 ? (
            <div className="workflow-state__chips">
              {selectedStyles.map((style) => (
                <span key={style!.id}>{localize(style!.name, lang)}</span>
              ))}
            </div>
          ) : (
            <p className="workflow-state__empty">{emptySelection}</p>
          )}
          <p className="workflow-state__ready">{c.outputReady}</p>
          <pre>{styleSummary || emptySelection}</pre>
          <button className="button" type="button" onClick={copyOneShot}>
            {copiedOneShot ? translate(lang, 'detail.copied') : c.copyOneShot}
          </button>
          <button className="button button--dark" type="button" onClick={copyAll}>
            {copiedAll ? translate(lang, 'detail.copied') : c.copyAll}
          </button>
        </aside>
      </section>

      <section className="prompt-workflow-section">
        <div className="section__head">
          <h2>{c.oneShotTitle}</h2>
        </div>
        <PromptBlock title={c.oneShotTitle} text={prompts.oneShot} lang={lang} collapsible />
      </section>

      <div className="section__head">
        <h2>{c.phaseTitle}</h2>
      </div>
      <div className="prompt-grid">
        <PromptBlock title={translate(lang, 'prompt.step.design')} text={prompts.design} lang={lang} collapsible defaultCollapsed />
        <PromptBlock title={translate(lang, 'prompt.step.component')} text={prompts.component} lang={lang} collapsible defaultCollapsed />
        <PromptBlock title={translate(lang, 'prompt.step.assembly')} text={prompts.assembly} lang={lang} collapsible defaultCollapsed />
        <PromptBlock title={translate(lang, 'prompt.step.qa')} text={prompts.qa} lang={lang} collapsible defaultCollapsed />
        <PromptBlock title={c.stepSelfAudit} text={prompts.selfAudit} lang={lang} collapsible defaultCollapsed />
      </div>
        </>
      )}
    </>
  );
}
