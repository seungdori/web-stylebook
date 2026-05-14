import type { LocalizedText } from './styles';

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

export interface PreflightCheck {
  id: string;
  label: LocalizedText;
  detail: LocalizedText;
}

export interface VerificationGroup {
  id: string;
  title: LocalizedText;
  items: LocalizedText[];
}

export interface AntiPattern {
  id: string;
  pattern: LocalizedText;
  why: LocalizedText;
  fix: LocalizedText;
}

export const preflightChecks: PreflightCheck[] = [
  {
    id: 'product-source',
    label: t(
      'Identify the real product source before anything else',
      '먼저 실제 제품 출처를 확인',
      '何より先に実際の製品ソースを確認',
    ),
    detail: t(
      'The product is described by the human request, attached files, the current repository, or the current task. The Web Stylebook page itself is never the product unless the human explicitly says so.',
      '제품은 사람의 요청, 첨부 파일, 현재 저장소, 현재 작업이 가리키는 것입니다. 사람이 명시적으로 말하지 않는 한 Web Stylebook 페이지 자체는 절대 제품이 아닙니다.',
      '製品は人の依頼、添付ファイル、現在のリポジトリ、現在のタスクが指すものです。人が明示しない限り、Web Stylebookページ自体は決して製品ではありません。',
    ),
  },
  {
    id: 'repo-context',
    label: t(
      'Inspect the repository before choosing a stack',
      '스택을 정하기 전에 저장소 점검',
      'スタックを決める前にリポジトリを点検',
    ),
    detail: t(
      'If a repository exists, read package.json, README, framework config, and existing routes first. Do not override an existing framework without explicit instruction. Match the package manager already in use.',
      '저장소가 있으면 package.json, README, 프레임워크 설정, 기존 라우트를 먼저 읽습니다. 명시적 지시 없이 기존 프레임워크를 바꾸지 않습니다. 패키지 매니저는 이미 쓰이는 것을 따릅니다.',
      'リポジトリがあれば、package.json、README、フレームワーク設定、既存ルートを先に読みます。明示的指示なく既存フレームワークを変えません。パッケージマネージャーは既存に合わせます。',
    ),
  },
  {
    id: 'style-pick',
    label: t(
      'Choose exactly one primary style up front',
      '주력 스타일 1개를 가장 먼저 결정',
      '最初にメインスタイル1つを決定',
    ),
    detail: t(
      'Pick one primary style that fits the product purpose. Optionally pick one secondary style for accents. Record the reasoning in design.md so future changes stay consistent.',
      '제품 목적에 어울리는 주력 스타일 1개를 고릅니다. 보조 스타일은 선택사항으로 1개까지 추가할 수 있습니다. 일관성을 위해 선택 근거를 design.md에 기록합니다.',
      '製品目的に合うメインスタイル1つを選びます。補助スタイルは任意で1つまで追加できます。一貫性のため選択理由をdesign.mdに記録します。',
    ),
  },
  {
    id: 'page-scope',
    label: t(
      'Define the minimum page set',
      '최소 페이지 범위를 정의',
      '最小ページ範囲を定義',
    ),
    detail: t(
      'List only the pages needed to make the product usable. Do not generate generic marketing pages (Hero + Features + Testimonials + CTA) unless the product is actually a marketing site.',
      '제품을 사용 가능하게 만드는 데 꼭 필요한 페이지만 정합니다. 제품이 실제로 마케팅 사이트가 아닌 한, 일반 마케팅 페이지(히어로 + 피처 + 후기 + CTA)를 만들지 않습니다.',
      '製品を使用可能にするのに必要なページだけ決めます。製品が実際にマーケティングサイトでない限り、一般的マーケティングページ(ヒーロー+機能+お客様の声+CTA)を作りません。',
    ),
  },
  {
    id: 'missing-detail-policy',
    label: t(
      'Handle missing details without stalling',
      '정보가 비어도 멈추지 않고 처리',
      '情報が不足しても停止せず処理',
    ),
    detail: t(
      'When a detail is missing, make a conservative assumption, write it in design.md under an "Assumptions" section, and continue. Only stop and ask when the missing detail makes implementation literally impossible.',
      '정보가 비면 보수적으로 가정하고, design.md의 "Assumptions" 섹션에 기록한 뒤 계속 진행합니다. 빠진 정보 때문에 구현 자체가 불가능할 때만 멈춰서 질문합니다.',
      '情報が不足する場合は保守的に仮定し、design.mdの「Assumptions」セクションに記録して進めます。情報不足で実装自体が不可能なときだけ停止して質問します。',
    ),
  },
];

export const verificationGroups: VerificationGroup[] = [
  {
    id: 'build',
    title: t('Build checks', '빌드 검증', 'ビルド検証'),
    items: [
      t('lint passes', 'lint 통과', 'lintが通る'),
      t('typecheck passes', 'typecheck 통과', 'typecheckが通る'),
      t('build command succeeds', 'build 명령 성공', 'buildコマンドが成功'),
      t('no runtime console errors or warnings', '런타임 콘솔 오류·경고 없음', 'ランタイムコンソールエラー・警告なし'),
      t('no hydration mismatch warnings', 'hydration mismatch 경고 없음', 'hydrationミスマッチ警告なし'),
    ],
  },
  {
    id: 'layout',
    title: t('Layout & rendering checks', '레이아웃·렌더링 검증', 'レイアウト・レンダリング検証'),
    items: [
      t('no horizontal scroll on any breakpoint (≥320px through ≥1440px)', '모든 브레이크포인트(≥320px ~ ≥1440px)에서 가로 스크롤 없음', 'すべてのブレークポイント(≥320px~≥1440px)で横スクロールなし'),
      t('no text clipping or truncation that hides meaning', '의미를 가리는 텍스트 잘림 없음', '意味を隠すテキスト切れなし'),
      t('mobile viewport (≤390px) renders cleanly without zoom', '모바일 뷰포트(≤390px)가 줌 없이 깔끔하게 렌더링', 'モバイルビューポート(≤390px)がズームなしできれいに表示'),
      t('desktop viewport (≥1280px) does not look stretched or empty', '데스크톱 뷰포트(≥1280px)가 늘어지거나 비어 보이지 않음', 'デスクトップビューポート(≥1280px)が間延びや空白に見えない'),
      t('no nested cards or panels-inside-panels without purpose', '의미 없는 중첩 카드·패널 없음', '意味のないネストカード・パネルなし'),
      t('borders are visibly visible (not 8–12% opacity ghosts)', '보더가 눈에 보임 (불투명도 8–12% 유령 보더 금지)', 'ボーダーが目に見える (不透明度8–12%の幽霊ボーダー禁止)'),
    ],
  },
  {
    id: 'fidelity',
    title: t('Style fidelity checks', '스타일 충실도 검증', 'スタイル忠実度検証'),
    items: [
      t('chosen style direction is visibly present — not averaged into a generic SaaS look', '선택한 스타일이 일반 SaaS로 평균화되지 않고 분명히 드러남', '選択したスタイルが一般SaaSに均されず明確に表れている'),
      t('design tokens are used (no hardcoded hex/px values in components)', '디자인 토큰 사용 (컴포넌트 내 하드코딩 hex/px 없음)', 'デザイントークンを使用 (コンポーネント内ハードコードhex/pxなし)'),
      t('typography hierarchy reads at a glance (display ≫ heading ≫ body)', '타이포 위계가 한눈에 읽힘 (display ≫ heading ≫ body)', 'タイポ階層が一目で読める (display ≫ heading ≫ body)'),
      t('contrast meets WCAG AA for body text (≥4.5:1)', '본문이 WCAG AA 대비 충족 (≥4.5:1)', '本文がWCAG AAコントラスト達成 (≥4.5:1)'),
      t('no decorative chips, badges, or bullets without specific information', '구체적 정보 없는 장식용 칩·뱃지·불릿 없음', '具体的情報のない装飾チップ・バッジ・ビュレットなし'),
    ],
  },
  {
    id: 'behavior',
    title: t('Behavioral checks', '동작 검증', '動作検証'),
    items: [
      t('keyboard focus is visible on every interactive element', '모든 인터랙티브 요소에 키보드 포커스가 보임', 'すべてのインタラクティブ要素にキーボードフォーカスが見える'),
      t('reduced-motion preference is honored', 'reduced-motion 설정 반영', 'reduced-motion設定を反映'),
      t('forms validate and surface errors without silent failure', '폼이 검증되고 오류가 조용히 실패하지 않음', 'フォーム検証とエラーが沈黙せず表示される'),
      t('copy buttons, navigation, and route preservation work', '복사 버튼, 내비게이션, 라우트 보존이 동작', 'コピーボタン、ナビゲーション、ルート保持が動作'),
    ],
  },
  {
    id: 'docs',
    title: t('Documentation checks', '문서 검증', 'ドキュメント検証'),
    items: [
      t('design.md exists and matches the implemented output', 'design.md가 존재하고 구현 결과와 일치', 'design.mdが存在し、実装結果と一致'),
      t('all assumptions made for missing details are recorded in design.md', '정보 부족 시 한 모든 가정이 design.md에 기록됨', '情報不足時の全仮定がdesign.mdに記録'),
      t('verification summary lists commands run, viewports inspected, and remaining risks', '검증 요약에 실행 명령·확인한 뷰포트·남은 리스크가 정리됨', '検証要約に実行コマンド・確認ビューポート・残リスクが整理'),
    ],
  },
];

export const antiPatterns: AntiPattern[] = [
  {
    id: 'generic-saas',
    pattern: t('Generic SaaS landing template', '일반 SaaS 랜딩 템플릿', '一般SaaSランディングテンプレ'),
    why: t(
      'Hero + 3 features + testimonial + CTA defaults dilute the chosen style and ignore what the product actually needs.',
      '히어로 + 3개 피처 + 후기 + CTA 기본 구성은 선택한 스타일을 희석시키고 제품에 실제로 필요한 화면을 무시합니다.',
      'ヒーロー+3機能+お客様の声+CTAの定型は、選んだスタイルを薄め、製品に実際必要な画面を無視します。',
    ),
    fix: t(
      'Start from what the product actually needs (dashboard? editor? form?), then apply the chosen style. Marketing-page structure is never the default.',
      '제품에 실제로 필요한 화면(대시보드? 에디터? 폼?)에서 출발한 뒤 선택한 스타일을 적용합니다. 마케팅 페이지 구조는 절대 기본값이 아닙니다.',
      '製品に実際必要な画面(ダッシュボード?エディタ?フォーム?)から出発し、選んだスタイルを適用します。マーケティングページ構造は決して既定ではありません。',
    ),
  },
  {
    id: 'fake-content',
    pattern: t('Placeholder copy and fake content', '플레이스홀더 카피와 가짜 콘텐츠', 'プレースホルダコピーと偽コンテンツ'),
    why: t(
      'Lorem ipsum, invented testimonials, stock metrics, and "trusted by 10,000+ teams" lines make the result untrustworthy and not ship-able.',
      'Lorem ipsum, 만들어낸 후기, 임의 수치, "10,000+ 팀이 신뢰" 같은 문구는 결과를 신뢰할 수 없고 배포 불가하게 만듭니다.',
      'Lorem ipsum、作り上げた声、適当な数値、「10,000+チームが信頼」のような文言は結果を信用できず、出荷不可にします。',
    ),
    fix: t(
      'Write real or plausible product-specific copy. If a metric or testimonial is unknown, omit the section entirely rather than fabricating it.',
      '실제 또는 그럴듯한 제품 카피를 씁니다. 수치나 후기를 모르면 만들어내지 말고 섹션 자체를 빼버립니다.',
      '実在または妥当な製品コピーを書きます。数値や声が不明なら作らず、セクション自体を削除します。',
    ),
  },
  {
    id: 'nested-cards',
    pattern: t('Nested cards and stacked panels', '중첩 카드·누적 패널', 'ネストカード・積み重ねパネル'),
    why: t(
      'Cards inside cards inflate borders, kill hierarchy, and produce cheap-looking output. Two stacked rounded panels rarely add information.',
      '카드 안에 카드는 보더를 부풀리고 위계를 무너뜨려 싸 보입니다. 둥근 패널이 두 겹 쌓인다고 정보가 늘어나지 않습니다.',
      'カードの中のカードはボーダーを増やし、階層を壊し、安っぽく見えます。丸いパネルが2層重なっても情報は増えません。',
    ),
    fix: t(
      'Use one surface level per section. Group with spacing, dividers, or typography — not by wrapping more cards.',
      '섹션당 표면 한 단계만 씁니다. 카드를 더 두르는 대신 간격, 디바이더, 타이포로 그룹화합니다.',
      'セクションごとに面1段階だけ使います。カードを増やすのではなく、余白、区切り線、タイポでグループ化します。',
    ),
  },
  {
    id: 'decorative-chips',
    pattern: t('Decorative chips and badges without information', '정보 없는 장식용 칩·뱃지', '情報のない装飾チップ・バッジ'),
    why: t(
      'Generic chips like "AI-powered", "Modern UI", "Fast", or empty status pills add no information and signal templated work.',
      '"AI-powered", "Modern UI", "Fast" 같은 일반 칩이나 빈 상태 알약은 정보가 없고 템플릿 작업처럼 보입니다.',
      '"AI-powered", "Modern UI", "Fast"のような一般チップや空のステータスピルは情報がなく、テンプレ作業に見えます。',
    ),
    fix: t(
      'Every chip must carry a specific, verifiable fact (a number, a name, a constraint, a status). If you cannot fill that, delete the chip.',
      '모든 칩에는 구체적이고 확인 가능한 사실(수치, 이름, 제약, 상태)이 들어가야 합니다. 못 채우면 칩을 삭제합니다.',
      'すべてのチップに具体的で検証可能な事実(数値、名前、制約、状態)が必要です。書けないなら削除します。',
    ),
  },
  {
    id: 'unverified-completion',
    pattern: t('Claiming completion without verification', '검증 없이 완료 선언', '検証なしで完了宣言'),
    why: t(
      'Saying "done" without listing the checks run, the viewports inspected, and the remaining risks hides regressions and forces re-work.',
      '실행한 검증, 확인한 뷰포트, 남은 리스크를 정리하지 않고 "완료"라고 말하면 회귀를 감추고 재작업을 강요합니다.',
      '実行した検証、確認したビューポート、残リスクを整理せず「完了」と言うと、回帰を隠し再作業を強います。',
    ),
    fix: t(
      'End every implementation with a verification summary: commands run, viewports inspected, fonts loaded, console state, and remaining risks. Use the self-audit prompt on this page.',
      '모든 구현은 검증 요약으로 마무리합니다: 실행 명령, 확인한 뷰포트, 폰트 로딩, 콘솔 상태, 남은 리스크. 이 페이지의 self-audit 프롬프트를 사용합니다.',
      'すべての実装は検証要約で終えます: 実行コマンド、確認ビューポート、フォント読み込み、コンソール状態、残リスク。このページのself-auditプロンプトを使います。',
    ),
  },
  {
    id: 'wsb-as-product',
    pattern: t('Mistaking Web Stylebook for the product', 'Web Stylebook을 제품으로 착각', 'Web Stylebookを製品と誤認'),
    why: t(
      'If the agent treats this style catalog as the product, the resulting work has nothing to do with the human request.',
      '에이전트가 이 스타일 카탈로그를 만들 제품으로 착각하면, 결과물이 사람의 요청과 무관해집니다.',
      'エージェントがこのスタイルカタログを作る製品と誤認すると、結果が人の依頼と無関係になります。',
    ),
    fix: t(
      'The product is whatever the human request, repository, attached task, or URL context describes. Web Stylebook is only the style reference.',
      '제품은 사람의 요청, 저장소, 첨부 작업, URL 맥락이 가리키는 것입니다. Web Stylebook은 스타일 레퍼런스일 뿐입니다.',
      '製品は人の依頼、リポジトリ、添付タスク、URL文脈が指すものです。Web Stylebookはスタイル参照に過ぎません。',
    ),
  },
];
