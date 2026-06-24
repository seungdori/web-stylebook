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

export interface DecisionExample {
  id: string;
  product: LocalizedText;
  chosenPrimary: string;
  chosenSecondary?: string;
  reasoning: LocalizedText;
  wouldNotPick: { id: string; reason: LocalizedText }[];
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
      t('the opening’s visual is a bespoke product demonstration, not generic furniture (a stock photo, abstract shape, or a card you could paste onto another product), and the copy column is not the full eyebrow+headline+sub+buttons quartet', '오프닝의 비주얼이 범용 장식 요소(스톡 사진·추상 형태·다른 제품에 그대로 옮길 수 있는 카드)가 아니라 이 제품에 맞춘 시연이고, 카피 컬럼이 eyebrow+헤드라인+서브+버튼 풀세트가 아님', 'オープニングのビジュアルが汎用な飾り(ストック写真・抽象形状・別製品に貼れるカード)でなく製品専用のデモであり、コピー列がeyebrow+見出し+サブ+ボタンのフルセットでない'),
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
      t('the headline is specific to this product (couldn’t sit on a competitor by swapping one noun) and avoids the default AI cadence — an evocative fragment with one italic-accent word', '헤드라인이 이 제품에 특화됨(명사 하나만 바꿔 경쟁사에 붙으면 안 됨) + 틀에 박힌 AI식 헤드라인(시적 단편 + 한 단어 이탤릭 강조)을 피함', '見出しがこの製品に特化(名詞を一つ替えて競合に貼れてはいけない)し、既定のAIっぽい言い回し(詩的断片+一語イタリック強調)を避けている'),
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
    id: 'formulaic-opening',
    pattern: t(
      'Formulaic opening — generic furniture beside a copy stack',
      '틀에 박힌 오프닝 — 카피 스택 옆 범용 장식 요소',
      '定型のオープニング — コピー塊の横に汎用な飾り',
    ),
    why: t(
      'The disease is not two columns — strong products put copy beside a visual. It is GENERIC FURNITURE: a copy stack (eyebrow + headline + sub + buttons + stats) next to a decorative panel — a stock photo, an abstract blob, generic app chrome, or a card you could paste onto a different product by swapping the logo. The all-text centered-stack and giant-centered-word openings are equally generic.',
      '병은 2단 자체가 아닙니다 — 좋은 제품도 카피 옆에 비주얼을 둡니다. 병은 범용 장식 요소입니다: 카피 스택(eyebrow + 헤드라인 + 서브 + 버튼 + 수치) 옆에 장식용 패널 — 스톡 사진, 추상 블롭, 흔한 앱 화면, 또는 로고만 바꿔 다른 제품에 그대로 옮길 수 있는 카드. 본문만 가운데로 쌓은 스택이나 거대한 한 단어 오프닝도 똑같이 뻔합니다.',
      '病は2列そのものではありません — 良い製品もコピーの横にビジュアルを置きます。病は汎用な飾りです: コピー塊(eyebrow+見出し+サブ+ボタン+数値)の横に装飾パネル — ストック写真、抽象ブロブ、汎用アプリUI、またはロゴだけ替えて別製品に貼れるカード。テキストだけ中央に積んだスタックや巨大中央ワードのオープニングも同じく定型です。',
    ),
    fix: t(
      'Derive the opening from the product’s single most important object/action/feeling. Two columns are fine WHEN the visual is a bespoke demonstration of THIS product’s core mechanic (its actual input→output with realistic domain content, nonsensical if pasted onto another product); a stock photo / abstract shape / generic card fails, and a decorative seam bridging the columns does not launder a generic visual. Cap opening prose at a headline + one short line + one action.',
      '제품의 가장 중요한 객체·행동·감정 하나에서 오프닝을 도출하세요. 비주얼이 이 제품의 핵심 동작을 보여주는 맞춤 시연(실제 입력→출력, 현실적인 도메인 데이터, 다른 제품에 옮기면 말이 안 되는 것)일 때라야 2단이 허용됩니다. 스톡 사진·추상 형태·범용 카드는 안 되고, 두 컬럼을 잇는 장식용 띠를 둔다고 범용 비주얼이 통과되지는 않습니다. 오프닝 카피는 헤드라인 + 짧은 한 줄 + 액션 하나로 제한하세요.',
      '製品の最も重要なオブジェクト/アクション/感情からオープニングを導きます。ビジュアルがこの製品の中核メカニズムを示す専用デモ(実際の入力→出力、現実的なドメインデータ、別製品に貼ると意味をなさない)であれば2列でも構いません。ストック写真・抽象形状・汎用カードは失格で、列をつなぐ装飾的な継ぎ目(seam)を入れても、汎用ビジュアルが許容されるわけではありません。オープニングのコピーは見出し+短い一行+アクション1つに制限します。',
    ),
  },
  {
    id: 'ai-headline-cadence',
    pattern: t(
      'AI headline cadence — evocative fragment + one italic-accent word',
      '틀에 박힌 AI 헤드라인 — 시적 단편 + 한 단어만 이탤릭 강조',
      'AI見出しの常套句 — 詩的な断片 + 一語だけ強調',
    ),
    why: t(
      'The reflexive AI headline is an evocative, abstract noun-phrase fragment (often two beats split by a comma, mood over substance) with one word italicized in the accent color. The same cadence and the same emphasis move on every product is the tell — it reads as designed-by-AI, not written for this product.',
      '반사적인 AI 헤드라인은 막연히 시적인 명사구 단편(자주 쉼표로 끊은 두 박자, 정보보다 분위기)에 한 단어만 액센트 컬러 이탤릭으로 강조한 형태입니다. 제품이 무엇이든 같은 리듬과 같은 강조가 반복된다는 점이 단서(tell)이고, 이 제품을 위해 쓴 게 아니라 AI가 찍어낸 것처럼 읽힙니다.',
      '反射的なAI見出しは、漠然と詩的な名詞句の断片(しばしば読点で区切る二拍、内容より雰囲気)に一語だけアクセント色のイタリックで強調した形です。製品が何であれ同じ調子・同じ強調が繰り返されるのが手がかりで、この製品のために書かれたのではなくAIが量産したように読まれます。',
    ),
    fix: t(
      'Make the headline say something only THIS product could say — paste-test it: if swapping one noun lets it sit on a competitor, it is generic, so rewrite until it is specific (a real claim, fact, or offer). Vary the form every time (sentence vs fragment, plain vs blunt, long vs terse) and do not reflexively italicize one accent word; choose the emphasis, or none, to fit. There is no house voice — write what this product actually is.',
      '헤드라인이 이 제품만 할 수 있는 말을 담게 하세요 — paste-test: 명사 하나만 바꿔 경쟁사에 붙여도 말이 되면 범용이라는 뜻이니, 구체적(실제 주장·사실·제안)이 될 때까지 다시 씁니다. 형식을 매번 바꾸고(문장 vs 단편, 평이 vs 직설, 길게 vs 짧게) 한 단어만 이탤릭으로 강조하는 버릇을 버리세요 — 강조는 맥락에 맞게 고르거나 아예 빼도 됩니다. 고정된 보이스는 없습니다 — 이 제품이 실제로 무엇인지를 쓰세요.',
      '見出しはこの製品だけが言えることを述べさせます — paste-test: 名詞を一つ替えて競合に貼っても成立するなら汎用なので、具体的(実際の主張・事実・提案)になるまで書き直します。形式を毎回変え(文 vs 断片、平易 vs 率直、長い vs 短い)、一語だけイタリックで強調する癖をやめます — 強調は文脈に合わせて選ぶか、無しでも構いません。固定のボイスはありません — この製品が実際に何かを書きます。',
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

export const decisionExamples: DecisionExample[] = [
  {
    id: 'fleet-tracking-dashboard',
    product: t(
      'Real-time fleet tracking dashboard for logistics ops managers; dense tables, map view, vehicle status, alerts.',
      '물류 운영 매니저용 실시간 차량 추적 대시보드. 밀도 높은 테이블, 지도 뷰, 차량 상태, 알림.',
      '物流オペレーション管理者向けのリアルタイム車両追跡ダッシュボード。密度の高い表、地図ビュー、車両状態、アラート。',
    ),
    chosenPrimary: 'quiet-utility',
    chosenSecondary: 'runtime-signal',
    reasoning: t(
      'Operational SaaS that gets repeated daily use. Trust and scanning matter more than spectacle. quiet-utility carries the calm-base; runtime-signal contributes the technical status-readout language for the live data panels.',
      '매일 반복 사용되는 운영 SaaS. 화려함보다 신뢰와 스캔성이 중요. quiet-utility가 차분한 베이스, runtime-signal이 실시간 데이터 패널의 기술적 상태 표기 언어 담당.',
      '毎日繰り返し使う運用SaaS。派手さより信頼と一覧性が重要。quiet-utilityが落ち着いた土台、runtime-signalがリアルタイムデータパネルの技術的状態表現を担当。',
    ),
    wouldNotPick: [
      {
        id: 'kinetic-pop',
        reason: t(
          'Oversized loud type and springy hovers would fatigue daily operators and bury alert hierarchy.',
          '크고 시끄러운 타입과 스프링 호버는 매일 쓰는 운영자를 피로하게 만들고 알림 위계를 묻어버립니다.',
          '大きく騒がしい書体やスプリングホバーは毎日のオペレーターを疲弊させ、アラート階層を埋もれさせます。',
        ),
      },
      {
        id: 'holographic-fluid',
        reason: t(
          'Iridescent gradients beneath dense data destroy contrast and slow scanning.',
          '밀도 높은 데이터 아래의 무지갯빛 그라데이션은 대비를 무너뜨리고 스캔 속도를 떨어뜨립니다.',
          '密度の高いデータの背景で虹色グラデーションを使うとコントラストが壊れ、走査が遅くなります。',
        ),
      },
    ],
  },
  {
    id: 'indie-music-label-launch',
    product: t(
      'Launch site for an indie music label dropping its first compilation; artist roster, listen previews, vinyl preorder.',
      '인디 음악 레이블의 첫 컴필레이션 발매를 위한 런칭 사이트. 아티스트 로스터, 미리듣기, 바이닐 예약 주문.',
      'インディーズ音楽レーベルの初コンピレーション発売用ローンチサイト。アーティスト一覧、プレビュー試聴、レコード予約。',
    ),
    chosenPrimary: 'duotone-bold',
    chosenSecondary: 'neon-drift',
    reasoning: t(
      'Music release benefits from focused 2-color identity (duotone-bold lists music apps in bestFor). Optional neon-drift accent for the listen preview rail brings nightlife energy without flooding the page.',
      '음반 발매는 집중된 2색 아이덴티티가 어울리고 (duotone-bold의 bestFor에 음악 앱 포함), 미리듣기 레일에 neon-drift 보조를 더하면 페이지 전체를 덮지 않으면서 나이트 라이프 에너지를 살릴 수 있습니다.',
      '音楽リリースは集中した2色アイデンティティが合い(duotone-boldのbestForに音楽アプリが含まれる)、試聴レールにneon-driftの補助を加えると、ページ全体を覆わずに夜の都市的なエネルギーを出せます。',
    ),
    wouldNotPick: [
      {
        id: 'quiet-utility',
        reason: t(
          'Calm operations grammar undersells a release moment and feels institutional for a creator product.',
          '차분한 운영 문법은 발매 순간을 과소판매하고 크리에이터 제품에는 관공서처럼 느껴집니다.',
          '落ち着いた運用言語は発売の瞬間を売り損ない、クリエイター製品には事務的に映ります。',
        ),
      },
    ],
  },
  {
    id: 'security-scanner-homepage',
    product: t(
      'Marketing homepage for an open-source secrets-scanning CLI; positioning, install flow, GitHub stars, enterprise CTA.',
      '오픈소스 시크릿 스캐닝 CLI의 마케팅 홈페이지. 포지셔닝, 설치 흐름, GitHub 스타, 엔터프라이즈 CTA.',
      'オープンソースのシークレットスキャンCLI向けマーケティングサイト。位置付け、インストール手順、GitHubスター、エンタープライズCTA。',
    ),
    chosenPrimary: 'terminal-core',
    chosenSecondary: 'platform-core',
    reasoning: t(
      'Developer-native CLI product. terminal-core gives the install-and-scan demo authentic command-line feel. platform-core provides the enterprise CTA section with the deployable-platform polish that converts buyers.',
      '개발자 네이티브 CLI 제품. terminal-core가 설치/스캔 데모에 진짜 커맨드라인 감각을 주고, platform-core가 엔터프라이즈 CTA 섹션에 구매자를 전환시키는 배포 가능한 플랫폼 분위기를 더합니다.',
      '開発者ネイティブのCLI製品。terminal-coreがインストール/スキャンのデモに本物のコマンドライン感を与え、platform-coreがエンタープライズCTAに購買者を転換させる「導入できるプラットフォーム」の質感を加えます。',
    ),
    wouldNotPick: [
      {
        id: 'claymorphism',
        reason: t(
          'Puffy friendly shapes break developer trust signal and contradict security positioning.',
          '푹신한 친화적 형태는 개발자 신뢰 시그널을 깨고 보안 포지셔닝과 모순됩니다.',
          '柔らかな親しみやすい形状は開発者の信頼シグナルを壊し、セキュリティのポジショニングと矛盾します。',
        ),
      },
      {
        id: 'kinetic-pop',
        reason: t(
          'Campaign loudness reads as marketing hype, not as technical credibility.',
          '캠페인의 시끌벅적함은 기술적 신뢰가 아니라 마케팅 과장으로 읽힙니다.',
          'キャンペーン的な賑やかさは技術的信頼ではなく、マーケティング誇張に読まれます。',
        ),
      },
    ],
  },
  {
    id: 'sdk-documentation-site',
    product: t(
      'Public documentation site for a payments SDK; reference, guides, code samples in multiple languages, searchable.',
      '결제 SDK의 공개 문서 사이트. 레퍼런스, 가이드, 다국어 코드 샘플, 검색 가능.',
      '決済SDKの公開ドキュメントサイト。リファレンス、ガイド、複数言語のコードサンプル、検索可能。',
    ),
    chosenPrimary: 'fusion-editorial-terminal',
    chosenSecondary: 'platform-core',
    reasoning: t(
      'Long-form technical reading + code blocks is exactly fusion-editorial-terminal\'s remit (article flow with log callouts and code cards). platform-core supplies the cross-cutting navigation, auth, and pricing pages without breaking the docs reading rhythm.',
      '긴 기술 문서 읽기와 코드 블록은 fusion-editorial-terminal의 정확한 영역 (아티클 흐름 + 로그 콜아웃 + 코드 카드). platform-core가 가로지르는 내비게이션, 인증, 요금 페이지를 문서 읽기 리듬을 깨지 않고 제공합니다.',
      '長文の技術読み物とコードブロックはまさにfusion-editorial-terminalの領域(記事の流れにログ注釈とコードカード)。platform-coreが横断的なナビゲーション、認証、料金ページを文書読書のリズムを壊さず提供します。',
    ),
    wouldNotPick: [
      {
        id: 'aurora-gradient',
        reason: t(
          'Cosmic background atmosphere is unreadable for long-form technical text and code.',
          '우주적 배경 분위기는 긴 기술 텍스트와 코드에 가독성을 망칩니다.',
          '宇宙的な背景の雰囲気は長文の技術テキストやコードの可読性を破壊します。',
        ),
      },
    ],
  },
  {
    id: 'limited-drop-product-launch',
    product: t(
      'One-page launch for a limited drop of designer sneakers; countdown, hero shot, drop time, single CTA.',
      '디자이너 스니커즈 한정 발매의 원페이지 런칭. 카운트다운, 히어로 샷, 발매 시각, 단일 CTA.',
      'デザイナースニーカーの限定発売のワンページローンチ。カウントダウン、ヒーローショット、発売時刻、単一CTA。',
    ),
    chosenPrimary: 'fusion-kinetic-brutal',
    reasoning: t(
      'One bold moment that must convert before the drop ends. fusion-kinetic-brutal gives maximum energy with structural guardrails (so the countdown and CTA stay readable). No secondary needed — splitting the visual direction would weaken the punch.',
      '발매 종료 전에 전환을 받아야 하는 강한 한 순간. fusion-kinetic-brutal이 구조적 가드레일을 가진 최대 에너지를 제공 (카운트다운과 CTA가 읽힙니다). 보조 스타일은 불필요 — 시각 방향을 쪼개면 임팩트가 약해집니다.',
      '発売終了前にコンバージョンを取らなければならない強い瞬間。fusion-kinetic-brutalが構造的なガードレールを持つ最大エネルギーを提供(カウントダウンとCTAが読める)。補助スタイルは不要 — 視覚方向を割るとパンチが弱まります。',
    ),
    wouldNotPick: [
      {
        id: 'zen-minimalism',
        reason: t(
          'Restraint-first whitespace would feel like the brand is unsure about the drop and kills urgency.',
          '절제 우선 여백은 브랜드가 발매에 자신 없어 보이게 만들고 긴급함을 죽입니다.',
          '抑制を優先した余白はブランドが発売に自信がないように見せ、緊急感を消します。',
        ),
      },
      {
        id: 'editorial-silence',
        reason: t(
          'Magazine cadence is the opposite tempo of a countdown-driven sale.',
          '잡지형 리듬은 카운트다운 기반 세일의 정반대 템포입니다.',
          '雑誌的なリズムはカウントダウン主導のセールとは真逆のテンポです。',
        ),
      },
    ],
  },
  {
    id: 'internal-hr-onboarding-tool',
    product: t(
      'Internal HR onboarding admin used by operations teams to set up new employee accounts and access; multi-step forms, status board, audit log.',
      '운영팀이 신규 입사자 계정과 접근 권한을 설정할 때 쓰는 내부 HR 온보딩 어드민. 다단계 폼, 상태 보드, 감사 로그.',
      '運用チームが新入社員プロビジョニングに使う社内HRオンボーディング管理。多段フォーム、ステータスボード、監査ログ。',
    ),
    chosenPrimary: 'quiet-utility',
    reasoning: t(
      'Internal tool used daily by a small team; correctness, scanning, and trust dominate over expressive design. quiet-utility was built for exactly this: dense but breathable forms, restrained type, no decorative illustration. No secondary — single grammar reduces cognitive load.',
      '소규모 팀이 매일 사용하는 내부 도구. 표현보다 정확성·스캔성·신뢰가 우선. quiet-utility가 바로 이런 용도로 설계됨 (밀도 있지만 호흡 가능한 폼, 절제된 타입, 장식 일러스트 없음). 보조 불필요 — 단일 문법이 인지 부하를 줄입니다.',
      '小規模チームが毎日使う社内ツール。表現より正確性・走査性・信頼が優先。quiet-utilityはまさにこの用途のために設計(密度はあるが息の通うフォーム、抑えた書体、装飾イラストなし)。補助不要 — 単一の文法が認知負荷を下げます。',
    ),
    wouldNotPick: [
      {
        id: 'duotone-bold',
        reason: t(
          'Media-rail composition has no relevance to multi-step employee forms.',
          '미디어 레일 구성은 다단계 사원 폼과 아무 관련이 없습니다.',
          'メディアレール構成は多段社員フォームとは無関係です。',
        ),
      },
    ],
  },
  {
    id: 'designer-portfolio',
    product: t(
      'Personal portfolio for an independent product designer; case studies with long-form writing, full-bleed visuals, contact.',
      '독립 프로덕트 디자이너의 개인 포트폴리오. 긴 글이 있는 케이스 스터디, 풀-블리드 비주얼, 연락처.',
      'インディペンデントなプロダクトデザイナーの個人ポートフォリオ。長文を含むケーススタディ、フルブリードビジュアル、連絡先。',
    ),
    chosenPrimary: 'editorial-silence',
    chosenSecondary: 'mono-type',
    reasoning: t(
      'Portfolio sells the designer\'s eye through hierarchy and restraint. editorial-silence carries the case-study reading. mono-type can take the index/archive page where typography alone should rank work — color would distract.',
      '포트폴리오는 위계와 절제로 디자이너의 안목을 팔아야 합니다. editorial-silence가 케이스 스터디 읽기를 맡고, 인덱스/아카이브 페이지는 mono-type이 (타이포그래피만으로 작업을 정렬, 색상은 산만함). ',
      'ポートフォリオは階層と抑制でデザイナーの審美眼を売ります。editorial-silenceがケーススタディの読書を担い、索引/アーカイブはmono-type(タイポグラフィだけで作品をランク付け、色は散漫)。',
    ),
    wouldNotPick: [
      {
        id: 'cyberpunk-glitch',
        reason: t(
          'Glitch surface fights the case-study reading and reads as one specific genre rather than designer range.',
          '글리치 표면은 케이스 스터디 읽기를 방해하고, 디자이너의 폭이 아니라 특정 장르로만 읽힙니다.',
          'グリッチ表現はケーススタディの読書を妨げ、デザイナーの幅ではなく特定ジャンルとして読まれます。',
        ),
      },
      {
        id: 'retro-pixel',
        reason: t(
          'Game aesthetic limits the portfolio to a niche audience and undermines premium client trust.',
          '게임 미학은 포트폴리오를 니치 청중에 묶고 프리미엄 클라이언트 신뢰를 약화시킵니다.',
          'ゲーム的な美学はポートフォリオをニッチな客層に限定し、プレミアム客の信頼を弱めます。',
        ),
      },
    ],
  },
];
