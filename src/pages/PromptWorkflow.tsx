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
    'AI에게 링크 하나만 보내면 스타일 후보를 읽고 필요한 방향을 고른 뒤 구현까지 이어가는 경로입니다.',
    'AIにリンクを1つ渡すだけで、スタイル候補を読み、必要な方向を選んで実装へ進めるルートです。',
  ),
  customPathTitle: text('Custom setup', '커스텀 설정', 'カスタム設定'),
  customPathDesc: text(
    'For people who want to override project details, references, and section ownership.',
    '프로젝트 정보, 레퍼런스, 섹션별 담당 방식을 직접 바꾸는 경로입니다.',
    'プロジェクト情報、参照、セクション別の担当方法を直接変えるルートです。',
  ),
  copyAiUrl: text('Copy page link', '페이지 링크 복사', 'ページリンクをコピー'),
  heroTitle: text(
    'Let AI build the design for you',
    'AI에게 디자인을 맡기세요',
    'AIにデザインを任せましょう',
  ),
  heroDesc: text(
    'Hand this page off to AI tools like ChatGPT, Claude, or Cursor. The AI picks a fitting style, writes a design guide, and produces the code. You only need to tell it what you want to build, in one short line.',
    '이 페이지를 ChatGPT, Claude, Cursor 같은 AI에게 그대로 넘기세요. AI가 어울리는 스타일을 고르고, 디자인 가이드를 만들고, 코드까지 짭니다. 무엇을 만들고 싶은지 한 줄만 적으면 됩니다.',
    'このページをChatGPT、Claude、CursorなどのAIにそのまま渡してください。AIが合うスタイルを選び、デザインガイドを書き、コードまで作ります。あなたは作りたいものを一行書くだけです。',
  ),
  heroPrimaryButton: text('Copy full prompt for AI', 'AI에게 줄 프롬프트 전체 복사', 'AI用プロンプト全文をコピー'),
  heroPrimaryHint: text(
    'Press this, paste into your AI chat, then add a sentence describing your project.',
    '이 버튼을 누르고 AI 채팅창에 붙여넣은 뒤, 만들고 싶은 것을 한 줄 적으세요.',
    'このボタンを押し、AIチャットに貼り付け、作りたい内容を一行追加してください。',
  ),
  heroSecondaryHint: text(
    'Or share the page link itself — AIs that can browse the web will open and read it.',
    '또는 페이지 링크를 그대로 공유해도 됩니다. 웹을 읽는 AI는 이 페이지를 직접 열어 봅니다.',
    'またはページのリンクを共有することもできます。Webを読めるAIはこのページを直接開いて読みます。',
  ),
  howToTitle: text('How to use', '이렇게 쓰세요', '使い方'),
  step1Title: text('Press copy', '복사 버튼 누르기', 'コピーを押す'),
  step1Desc: text(
    'Press the "Copy full prompt for AI" button above.',
    '위쪽의 "AI에게 줄 프롬프트 전체 복사" 버튼을 누르세요.',
    '上の「AI用プロンプト全文をコピー」を押します。',
  ),
  step2Title: text(
    'Paste into your AI and add one line about what you want',
    'AI에게 붙여넣고, 만들 것을 한 줄 적기',
    'AIに貼り付け、作りたいものを一行書く',
  ),
  step2Desc: text(
    'Use ChatGPT, Claude, Cursor — any AI works. The copied text is in English (the AI reads English best), but write your one-line request in any language. Examples: "A launch site for an indie music label.", "An internal admin tool for our ops team.", "A portfolio for a freelance designer."',
    'ChatGPT, Claude, Cursor 어디든 좋습니다. 복사된 내용은 영어지만(AI가 영어를 가장 잘 알아들어요), 요청은 한국어로 적어도 됩니다. 예시: "인디 음악 레이블 런칭 사이트 만들어줘", "우리 운영팀이 쓸 내부 어드민 만들어줘", "프리랜서 디자이너 포트폴리오 만들어줘"',
    'ChatGPT、Claude、Cursorどれでも構いません。コピーした文面は英語ですが(AIは英語が一番得意です)、依頼は日本語で書いて大丈夫です。例: 「インディーズ音楽レーベルのローンチサイトを作って」「運用チーム用の社内管理ツール」「フリーランスデザイナーのポートフォリオ」',
  ),
  step3Title: text(
    'AI takes it from there',
    'AI가 알아서 만듭니다',
    'AIが自動で進めます',
  ),
  step3Desc: text(
    'The AI reads everything on this page — the style catalog, the decision examples, the checks — picks the right direction, writes a design guide, then produces the code. It also runs its own self-check before reporting done. You receive the result.',
    'AI는 이 페이지의 모든 내용 — 스타일 카탈로그, 결정 예시, 점검 항목 — 을 읽고 어울리는 방향을 정한 뒤, 디자인 가이드를 만들고 코드까지 짭니다. 끝났다고 말하기 전에 결과물을 스스로 다시 한 번 점검합니다. 사용자는 결과만 받으면 됩니다.',
    'AIはこのページのすべて — スタイルカタログ、判断例、チェック項目 — を読み、合う方向を決め、デザインガイドを書き、コードまで作ります。完了と言う前に、自分の成果物を自分で点検し直します。あとは結果を受け取るだけです。',
  ),
  techDetailsToggle: text(
    'For the curious: what the AI is reading (expand)',
    '궁금하면 펼쳐보기: AI가 자동으로 읽는 내용',
    '気になる方へ: AIが自動で読む内容 (展開)',
  ),
  techDetailsDesc: text(
    'You do not need to look at any of this. It is the technical contract the AI reads — checklists, the build prompt text, the self-audit prompt, and the raw data. Expand only if you are curious about how it works.',
    '직접 볼 필요는 없습니다. AI가 읽어가는 기술적인 약속들입니다 — 체크리스트, 작업 안내문, 자가 점검 안내문, 원본 데이터. 어떻게 동작하는지 궁금할 때만 펼쳐보세요.',
    '直接見る必要はありません。AIが自動で読み取る技術的な内容です — チェックリスト、作業指示文、自己点検ガイド、生データです。仕組みが気になる場合だけ展開してください。',
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
    '사람이 직접 지정할 영역과 AI가 추론부터 설계, 구현까지 맡을 영역을 나눕니다.',
    '人が正確に指定する領域と、AIが推論・設計・実装まで担う領域を分けます。',
  ),
  noteLabel: text('Human notes / override', '직접 지시 / 오버라이드', '直接指示 / 上書き'),
  autoPreview: text('AI automation rule', 'AI 자동화 규칙', 'AI自動化ルール'),
  copyOneShot: text('Copy full prompt for AI', 'AI에게 줄 프롬프트 전체 복사', 'AI用プロンプト全文をコピー'),
  copyAll: text('Copy One-shot + Staged Prompts', '원샷 + 단계별 전체 복사', 'ワンショット + 段階別をコピー'),
  referenceTitle: text('Compact style reference pack', '압축 스타일 레퍼런스팩', '圧縮スタイル参照パック'),
  briefTitle: text('1. Project brief', '1. 프로젝트 브리프', '1. プロジェクトブリーフ'),
  referencePickerTitle: text('2. Style references', '2. 스타일 레퍼런스', '2. スタイル参照'),
  constraintsTitle: text('3. Build constraints', '3. 제작 조건', '3. 制作条件'),
  selectedRefs: text('Selected references', '선택된 레퍼런스', '選択中の参照'),
  editRefs: text('Edit references', '레퍼런스 수정', '参照を編集'),
  hideRefs: text('Hide reference list', '레퍼런스 목록 닫기', '参照リストを閉じる'),
  noRefsHint: text('No reference selected. Open the picker and choose at least one direction.', '선택한 레퍼런스가 없습니다. 목록을 열어 방향을 하나 이상 고르세요.', '参照が選択されていません。リストを開いて少なくとも一つ選んでください。'),
  workflowCount: text('Sections', '섹션', 'セクション'),
  aiCount: text('AI auto', 'AI 자동', 'AI自動'),
  manualCount: text('Manual', '직접 지정', '直接指定'),
  outputReady: text('Ready to copy', '복사 준비 완료', 'コピー準備完了'),
  viewAutoRule: text('Automation rule', '자동화 규칙', '自動化ルール'),
  preflightTitle: text(
    'What AI confirms before starting',
    'AI가 시작하기 전에 정해두는 5가지',
    'AIが始める前に確認する5項目',
  ),
  preflightDesc: text(
    'Five things the AI nails down before writing any design or code, so the result actually matches what you want.',
    'AI가 디자인이나 코드를 쓰기 전에 먼저 확정하는 다섯 가지입니다. 이게 정리되어야 원하던 것과 결과물이 일치합니다.',
    'AIがデザインやコードを書く前に最初に決める5項目。これが揃って初めて、欲しいものと結果が一致します。',
  ),
  verificationTitle: text(
    'What AI checks before saying "done"',
    'AI가 끝났다고 말하기 전에 스스로 점검하는 항목',
    'AIが「完了」と言う前に自分でチェックする項目',
  ),
  verificationDesc: text(
    'A built-in safety net. After producing the result, the AI runs through these checks itself — build, layout, style match, behavior, documentation — so you do not have to verify each item.',
    '내장된 안전망입니다. AI가 결과물을 만든 뒤 빌드, 레이아웃, 스타일 일치, 동작, 문서를 스스로 다시 확인합니다. 사용자가 일일이 점검하지 않아도 되게 한 장치예요.',
    '組み込みのセーフティネットです。AIが成果物を作った後、ビルド/レイアウト/スタイル一致/動作/ドキュメントを自分で再確認します。利用者が逐一点検しなくて済むようにしています。',
  ),
  antiPatternTitle: text(
    'Common mistakes AI is told to avoid',
    'AI가 피하도록 만든 흔한 실수들',
    'AIが避けるよう設定されているよくあるミス',
  ),
  antiPatternDesc: text(
    'Concrete bad outputs the AI must steer around — generic SaaS templates, fake content, nested cards, and so on. Treated as hard rules, not style preferences.',
    'AI가 반드시 피해야 하는 구체적인 나쁜 결과들 — 어디서 본 듯한 SaaS 템플릿, 가짜 후기, 중첩 카드 같은 것들입니다. 취향이 아니라 강제 규칙입니다.',
    'AIが必ず避けるべき具体的な悪い成果物 — どこかで見たSaaSテンプレ、偽のレビュー、入れ子のカードなど。好みではなく絶対のルールです。',
  ),
  selfAuditTitle: text(
    'Self-audit guide AI runs on its own output',
    'AI가 결과물에 스스로 돌리는 점검 안내문',
    'AIが成果物に対して自分で実行する点検ガイド',
  ),
  selfAuditDesc: text(
    'After producing the result, the AI runs this guide against itself to grade every checkpoint — pass, fix-now, or accepted-risk. Anything that fails is fixed before reporting back.',
    'AI가 결과를 다 만든 뒤 자기 결과물에 이 안내문을 다시 실행해 모든 항목을 점검합니다 — 통과 / 지금 고칠 것 / 감수할 위험으로 판정합니다. "지금 고칠 것"은 보고 전에 모두 해결합니다.',
    'AIが結果を作り終えた後、このガイドを自分の成果物に当てて全項目を点検します — 合格 / 今すぐ修正 / 容認できるリスクで判定します。「今すぐ修正」は報告前にすべて解決します。',
  ),
  copySelfAudit: text('Copy self-audit guide', '점검 안내문 복사', '点検ガイドをコピー'),
  copyJsonUrl: text('Copy data URL (compact)', '데이터 URL 복사 (간단판)', 'データURLをコピー (簡易版)'),
  copyFullJsonUrl: text('Copy data URL (full)', '데이터 URL 복사 (전체판)', 'データURLをコピー (完全版)'),
  jsonEndpointTitle: text(
    'Data URL for advanced AI tools',
    '고급 AI 도구용 데이터 URL',
    '高度なAI向けデータURL',
  ),
  jsonEndpointDesc: text(
    'For people building AI agents that read structured data: the same handoff content is available at these URLs as machine-readable data. Most people do not need this — the copy button above is enough.',
    'AI 에이전트를 직접 만드는 분들을 위한 정보입니다. 이 페이지의 내용을 기계가 읽을 수 있는 형태로 아래 URL에 제공합니다. 대부분은 신경 쓸 필요 없고, 위쪽 복사 버튼만으로 충분합니다.',
    'AIエージェントを自分で作る方向け。このページの内容が機械可読の形で下記URLにあります。多くのユーザーは気にしなくて構いません。上のコピーボタンだけで十分です。',
  ),
  rawJsonTitle: text(
    'Raw data (what the AI actually receives)',
    '원본 데이터 (AI가 실제로 받는 내용)',
    '生データ (AIが実際に受け取る内容)',
  ),
  rawJsonDesc: text(
    'The full handoff content in raw form. You do not need to read this — it is here so you can verify what the AI receives.',
    '핸드오프 전체 내용의 원본 형태입니다. 읽을 필요는 없고, AI가 실제로 무엇을 받는지 확인하고 싶을 때만 펼치세요.',
    'ハンドオフの全内容を加工せずそのまま載せたものです。読む必要はありません。AIが実際に何を受け取るかを確認したいときだけ展開してください。',
  ),
  rawJsonToggle: text('Show raw data', '원본 데이터 펼치기', '生データを開く'),
  decisionExamplesTitle: text(
    'How AI picks a style — worked examples',
    'AI가 스타일을 고르는 방식 — 사례 모음',
    'AIがスタイルを選ぶ方法 — 事例集',
  ),
  decisionExamplesDesc: text(
    'Seven real-world examples showing how a style is chosen for different product types: which style won, which were rejected, and the reasoning. The AI uses these to calibrate its own decision for your project.',
    '서로 다른 7가지 제품 유형에서 어떤 스타일을 왜 골랐는지 보여주는 사례 모음입니다. 선택한 스타일, 배제한 후보, 그 이유까지 적혀 있습니다. AI는 이 사례를 기준으로 사용자 프로젝트에 맞는 판단을 보정합니다.',
    '異なる7つの製品タイプで、どのスタイルをなぜ選んだかを示す事例集です。選んだスタイル、外した候補、その理由まで書かれています。AIはこれを手がかりに、あなたのプロジェクトに合わせて自分の判断を調整します。',
  ),
  primaryLabel: text('Main style', '주력 스타일', 'メインスタイル'),
  secondaryLabel: text('Accent style', '보조 스타일', '補助スタイル'),
  reasoningLabel: text('Why', '선택 이유', '選んだ理由'),
  wouldNotPickLabel: text('Rejected candidates', '배제한 후보들', '外した候補'),
  whyLabel: text('Why', '이유', '理由'),
  fixLabel: text('Fix', '해결 방법', '対処'),
  stepSelfAudit: text('5. Self-check', '5. 결과 자가 점검', '5. 結果の自己点検'),
};

const workflowSections = [
  {
    id: 'purpose',
    title: text('Purpose & product framing', '목적과 제품 정의', '目的とプロダクト定義'),
    desc: text(
      'Clarifies what is being built, who it is for, and what a successful first screen must communicate.',
      '무엇을 만들고 누가 쓰며, 첫 화면이 무엇을 전달해야 하는지 고정합니다.',
      '何を作り、誰が使い、最初の画面で何を伝えるべきかを固定します。',
    ),
    auto: text(
      'Infer the product goal, audience, primary jobs-to-be-done, and MVP page scope from the brief. If details are missing, make conservative assumptions, record them in design.md, and continue.',
      '브리프에서 제품 목적, 타겟, 핵심 과업, MVP 페이지 범위를 추론합니다. 정보가 비면 보수적으로 가정하고 design.md에 기록한 뒤 멈추지 말고 진행합니다.',
      'ブリーフから目的、対象、主要タスク、MVPページ範囲を推論します。不明点は保守的に仮定し、design.mdに記録して進めます。',
    ),
  },
  {
    id: 'styleTone',
    title: text('Style, tone & manner', '스타일, 톤 앤 매너', 'スタイル、トーン&マナー'),
    desc: text(
      'Forces an intentional visual direction before writing components.',
      '컴포넌트를 만들기 전에 목적에 맞는 시각 방향을 먼저 정합니다.',
      'コンポーネントを書く前に目的に合う視覚方向を決めます。',
    ),
    auto: text(
      'First decide which style and tone fit the implementation goal. Use the selected Web Stylebook profiles below as the primary reference. Only open www.webstylebook.com when the compact reference pack is insufficient, to avoid unnecessary token use.',
      '가장 먼저 구현 목적에 어울리는 스타일과 톤 앤 매너를 정합니다. 아래에서 고른 Web Stylebook 프로필을 기본 레퍼런스로 쓰고, 압축 레퍼런스만으로 부족할 때만 토큰을 아끼며 www.webstylebook.com을 참조합니다.',
      'まず実装の目的に合うスタイルとトーンを決めます。下で選んだWeb Stylebookプロファイルを基本の参照にし、圧縮した参照だけでは足りないときだけ、トークンを節約しつつwww.webstylebook.comを開きます。',
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
      '사람이 다른 스택을 지정하지 않으면 안정화된 최신 Next.js, TypeScript, App Router, ESLint로 설치합니다. 패키지 매니저는 저장소 관례를 따르고, 라이브러리는 그만한 이득이 있을 때만 추가합니다.',
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
      '페이지를 조립하기 전에 design.md를 만들고 색상, 타이포그래피, 간격, 반경, 그림자, 보더, 모션, elevation, 컴포넌트 밀도, 반응형 브레이크포인트 키를 먼저 정의합니다. 이 키들을 CSS 변수나 테마 토큰으로 구현합니다.',
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
      'AppShell, Header/Nav, Button, FormControls, Card/Panel, SectionHeader, FeatureList, CTA, Empty/Loading/Error 상태, 도메인 전용 블록 같은 컴포넌트 기초부터 만듭니다. 일반 컨트롤의 안정성이 필요하면 shadcn/ui를 적극 쓰되, 원하는 스타일의 자유도가 더 중요하면 억지로 쓰지 않습니다.',
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
      '토큰과 컴포넌트가 준비된 뒤 화면을 조립합니다. 라우트, 섹션, 문구는 유용한 범위에서 데이터 기반으로 둡니다. 모든 뷰포트에서 치수를 안정적으로 유지하고, 위계가 잘 읽히게 하며, 가로 오버플로우와 의미 없는 장식이 없도록 합니다.',
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

  // Prompt-construction strings must stay English regardless of UI lang —
  // the prompt is the contract handed to the AI and mixing locales breaks it.
  const styleSummary = selectedStyles
    .map((style) => `${style!.name.en}: ${style!.summary.en}`)
    .join('\n');

  const styleReferencePack = selectedStyles
    .map((style) => [
      `- ${style!.name.en} (${style!.id})`,
      `  Summary: ${style!.summary.en}`,
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
      .map((style) => `${style!.name.en} -> ${style!.promptProfile.typography}`)
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
    `Compact style reference pack:\n${styleReferencePack || 'No compact style reference selected. Use the product purpose to choose a style.'}`,
  ].join('\n\n');

  const sectionBrief = workflowSections.map((section) => {
    const mode = workflowPath === 'ai' ? 'ai' : sectionModes[section.id];
    const modeLabel = mode === 'manual' ? 'Human-directed' : 'AI-autonomous';
    const instruction = mode === 'manual'
      ? `Follow this human-provided direction exactly:\n${sectionNotes[section.id] || 'No manual override was provided. Use the base facts and proceed conservatively.'}`
      : section.auto.en;

    return [
      `### ${section.title.en}`,
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
      'AI가 이 페이지를 보고 알아서 진행하는 방식을 짧게 설명합니다.',
      '',
      '먼저 AI는 시작 전에 다섯 가지를 확정합니다 — 어떤 제품을 만드는지, 저장소가 있는지, 어떤 스타일을 고를지, 어떤 화면이 필요한지, 정보가 부족할 때 어떻게 처리할지.',
      '그 다음 페이지에 실린 스타일 카탈로그를 모두 살펴보고, 어울리지 않는 후보를 먼저 제외한 뒤 가장 맞는 스타일을 고릅니다.',
      '비슷한 사례 7개(결정 예시)와 비교해 자기 선택을 한 번 더 확인하고, 어디서나 보일 만한 SaaS 템플릿 같은 흔한 실수들을 피해갑니다.',
      '디자인 가이드 문서를 만들고, 재사용 가능한 컴포넌트를 먼저 짠 뒤, 화면을 조립하고, 마지막에는 결과물에 스스로 다시 점검 안내문을 실행해 통과/지금 고칠 것/감수할 위험을 분류합니다.',
      '',
      '사용자가 추가로 해야 할 일은 만들고 싶은 것을 한 줄 적는 것뿐입니다.',
    ].join('\n'),
    [
      'AIがこのページを見て自動で進める流れを短く説明します。',
      '',
      'まずAIは始める前に5項目を確定します — どんな製品か、リポジトリの有無、選ぶスタイル、必要な画面、情報不足の対処方法。',
      '次にページに載っているスタイルカタログをすべて見て、合わない候補を先に外してから一番合うスタイルを選びます。',
      '似た事例7件(判断例)と比較して自分の選択をもう一度確認し、どこにでもあるSaaSテンプレートのようなよくあるミスを回避します。',
      'デザインガイド文書を作り、再利用できるコンポーネントを先に書き、画面を組み立て、最後に成果物へ自己点検ガイドを実行して合格/今すぐ修正/容認できるリスクに振り分けます。',
      '',
      'あなたがすることは、作りたいものを一行書くだけです。',
    ].join('\n'),
  )[lang];

  const styleCatalogNote = text(
    `The full style catalog is embedded in this page for agents. There are ${styleCatalog.length} candidates; the agent should choose only the references that fit the product instead of copying a default style.`,
    `전체 스타일 후보 데이터는 이 페이지 안에 들어 있습니다. 총 ${styleCatalog.length}개 후보 중 제품 목적에 맞는 것만 골라 쓰도록 설계했습니다.`,
    `スタイル候補の全データはこのページの中に入っています。合計${styleCatalog.length}件の候補から、製品の目的に合うものだけを選ぶ設計です。`,
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
          <header className="workflow-ai-hero">
            <h2>{c.heroTitle}</h2>
            <p className="workflow-ai-hero__desc">{c.heroDesc}</p>
            <div className="workflow-ai-hero__cta">
              <button className="button button--primary workflow-ai-hero__primary" type="button" onClick={copyOneShot}>
                {copiedOneShot ? translate(lang, 'detail.copied') : c.heroPrimaryButton}
              </button>
              <p className="workflow-ai-hero__hint">{c.heroPrimaryHint}</p>
            </div>
            <div className="workflow-ai-hero__secondary">
              <button className="button" type="button" onClick={copyAiUrl}>
                {copiedUrl ? translate(lang, 'detail.copied') : c.copyAiUrl}
              </button>
              <p className="workflow-ai-hero__hint workflow-ai-hero__hint--quiet">{c.heroSecondaryHint}</p>
            </div>
          </header>

          <section className="workflow-howto" aria-labelledby="workflow-howto-title">
            <h3 id="workflow-howto-title">{c.howToTitle}</h3>
            <ol className="workflow-howto__steps">
              <li>
                <span className="workflow-howto__num">1</span>
                <strong>{c.step1Title}</strong>
                <p>{c.step1Desc}</p>
              </li>
              <li>
                <span className="workflow-howto__num">2</span>
                <strong>{c.step2Title}</strong>
                <p>{c.step2Desc}</p>
              </li>
              <li>
                <span className="workflow-howto__num">3</span>
                <strong>{c.step3Title}</strong>
                <p>{c.step3Desc}</p>
              </li>
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

          <details className="workflow-tech-details">
            <summary>{c.techDetailsToggle}</summary>
            <div className="workflow-tech-details__body">
              <p className="workflow-tech-details__intro">{c.techDetailsDesc}</p>

              <section className="workflow-ai-readable" id="agent-guide" data-agent-section="usage-guide">
                <h4>{c.parseContractTitle}</h4>
                <pre>{agentGuide}</pre>
              </section>

              <section className="workflow-ai-readable workflow-checklist" id="preflight" data-agent-section="preflight">
                <h4>{c.preflightTitle}</h4>
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

              <section className="workflow-ai-readable workflow-antipatterns" id="anti-patterns" data-agent-section="anti-patterns">
                <h4>{c.antiPatternTitle}</h4>
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
                <h4>{c.verificationTitle}</h4>
                <p>{c.verificationDesc}</p>
                <div className="workflow-verification__groups">
                  {verificationGroups.map((group) => (
                    <div key={group.id} className="workflow-verification__group">
                      <h5>{group.title[lang]}</h5>
                      <ul>
                        {group.items.map((entry) => (
                          <li key={entry.en}>{entry[lang]}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section className="workflow-ai-readable" data-agent-section="build-prompt">
                <h4>{c.implementationPromptTitle}</h4>
                <PromptBlock title={c.implementationPromptTitle} text={prompts.oneShot} lang={lang} collapsible defaultCollapsed />
              </section>

              <section className="workflow-ai-readable" id="self-audit" data-agent-section="self-audit">
                <h4>{c.selfAuditTitle}</h4>
                <p>{c.selfAuditDesc}</p>
                <button className="button" type="button" onClick={copySelfAuditPrompt}>
                  {copiedSelfAudit ? translate(lang, 'detail.copied') : c.copySelfAudit}
                </button>
                <PromptBlock title={c.selfAuditTitle} text={prompts.selfAudit} lang={lang} collapsible defaultCollapsed />
              </section>

              <section className="workflow-ai-readable workflow-json-endpoint" id="json-endpoint" data-agent-section="json-endpoint">
                <h4>{c.jsonEndpointTitle}</h4>
                <p>{c.jsonEndpointDesc}</p>
                <div className="workflow-json-endpoint__row">
                  <code>{jsonHandoffUrl}</code>
                  <div className="workflow-json-endpoint__actions">
                    <button className="button" type="button" onClick={copyJsonHandoffUrl}>
                      {copiedJsonUrl ? translate(lang, 'detail.copied') : c.copyJsonUrl}
                    </button>
                    <a className="button button--dark" href={jsonHandoffUrl} target="_blank" rel="noreferrer">
                      {lang === 'ko' ? '간단판 열기' : lang === 'ja' ? '簡易版を開く' : 'Open compact'}
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
                      {lang === 'ko' ? '전체판 열기' : lang === 'ja' ? '完全版を開く' : 'Open full'}
                    </a>
                  </div>
                </div>
              </section>

              <section className="workflow-ai-readable workflow-raw-json" id="raw-json" data-agent-section="raw-json">
                <h4>{c.rawJsonTitle}</h4>
                <p>{c.rawJsonDesc}</p>
                <details className="workflow-raw-json__details">
                  <summary>{c.rawJsonToggle}</summary>
                  <pre className="workflow-raw-json__pre">{styleIndexJson}</pre>
                </details>
              </section>
            </div>
          </details>

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
