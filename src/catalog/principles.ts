import { t } from './localization';
import type {
  UxEvidenceConfidence, UxEvidenceKind,
  UxOutcome, UxPhase, UxPrinciple, UxPrincipleAttribution,
  UxPrincipleCategory, UxPrincipleCategoryDef, UxSurface,
} from './types';

const evidenceById: Record<string, {
  kind: UxEvidenceKind;
  confidence: UxEvidenceConfidence;
  references: Array<{ title: string; url: string }>;
}> = {
  'aesthetic-usability-effect': {
    kind: 'empirical', confidence: 'contextual',
    references: [{ title: 'Apparent Usability vs. Inherent Usability', url: 'https://doi.org/10.1145/223355.223680' }],
  },
  'choice-overload': {
    kind: 'empirical', confidence: 'contested',
    references: [{ title: 'Can There Ever Be Too Many Options? A Meta-Analytic Review of Choice Overload', url: 'https://scheibehenne.com/ScheibehenneGreifenederTodd2010.pdf' }],
  },
  chunking: {
    kind: 'empirical', confidence: 'contextual',
    references: [{ title: 'How Chunking Helps Content Processing', url: 'https://www.nngroup.com/articles/chunking/' }],
  },
  'cognitive-load': {
    kind: 'empirical', confidence: 'strong',
    references: [{ title: 'Cognitive Architecture and Instructional Design', url: 'https://doi.org/10.1207/s15516709cog1202_4' }],
  },
  'doherty-threshold': {
    kind: 'empirical', confidence: 'contextual',
    references: [{ title: 'The Economic Value of Rapid Response Time', url: 'https://www.ibm.com/support/pages/sites/default/files/inline-files/EconomicValueofResponseTime.pdf' }],
  },
  'fitts-law': {
    kind: 'empirical', confidence: 'strong',
    references: [
      { title: 'The Information Capacity of the Human Motor System in Controlling the Amplitude of Movement', url: 'https://doi.org/10.1037/h0055392' },
      { title: 'WCAG 2.2: Understanding Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum' },
    ],
  },
  'goal-gradient-effect': {
    kind: 'empirical', confidence: 'contextual',
    references: [{ title: 'The Goal-Gradient Hypothesis Resurrected', url: 'https://home.uchicago.edu/ourminsky/Goal-Gradient_Illusionary_Goal_Progress.pdf' }],
  },
  'hicks-law': {
    kind: 'empirical', confidence: 'contextual',
    references: [{ title: 'On the Rate of Gain of Information', url: 'https://doi.org/10.1080/17470215208416600' }],
  },
  'jakobs-law': {
    kind: 'heuristic', confidence: 'contextual',
    references: [{ title: '10 Usability Heuristics for User Interface Design', url: 'https://www.nngroup.com/articles/ten-usability-heuristics/' }],
  },
  'law-of-common-region': {
    kind: 'gestalt', confidence: 'contextual',
    references: [{ title: 'Gestalt Principles', url: 'https://www.scholarpedia.org/article/Gestalt_principles' }],
  },
  'law-of-proximity': {
    kind: 'gestalt', confidence: 'contextual',
    references: [{ title: 'Gestalt Principles', url: 'https://www.scholarpedia.org/article/Gestalt_principles' }],
  },
  'law-of-similarity': {
    kind: 'gestalt', confidence: 'contextual',
    references: [{ title: 'Gestalt Principles', url: 'https://www.scholarpedia.org/article/Gestalt_principles' }],
  },
  'law-of-uniform-connectedness': {
    kind: 'gestalt', confidence: 'contextual',
    references: [{ title: 'Gestalt Principles', url: 'https://www.scholarpedia.org/article/Gestalt_principles' }],
  },
  'mental-model': {
    kind: 'heuristic', confidence: 'contextual',
    references: [{ title: 'Mental Models', url: 'https://www.nngroup.com/articles/mental-models/' }],
  },
  'paradox-of-the-active-user': {
    kind: 'empirical', confidence: 'contextual',
    references: [{ title: 'Resolving the Paradox of the Active User: Stable Suboptimal Performance in Interactive Tasks', url: 'https://doi.org/10.1207/s15516709cog2806_2' }],
  },
  'peak-end-rule': {
    kind: 'empirical', confidence: 'contextual',
    references: [{ title: 'When More Pain Is Preferred to Less: Adding a Better End', url: 'https://doi.org/10.1111/j.1467-9280.1993.tb00589.x' }],
  },
  'postels-law': {
    kind: 'systems-maxim', confidence: 'contextual',
    references: [{ title: 'RFC 9413: Maintaining Robust Protocols', url: 'https://www.rfc-editor.org/info/rfc9413/' }],
  },
  'selective-attention': {
    kind: 'empirical', confidence: 'strong',
    references: [{ title: 'Gorillas in Our Midst: Sustained Inattentional Blindness for Dynamic Events', url: 'https://doi.org/10.1068/p281059' }],
  },
  'serial-position-effect': {
    kind: 'empirical', confidence: 'contextual',
    references: [{ title: 'The Serial Position Effect of Free Recall', url: 'https://doi.org/10.1037/h0045106' }],
  },
  'teslers-law': {
    kind: 'heuristic', confidence: 'contextual',
    references: [{ title: 'Law of Conservation of Complexity', url: 'https://en.wikipedia.org/wiki/Law_of_conservation_of_complexity' }],
  },
  'von-restorff-effect': {
    kind: 'empirical', confidence: 'contextual',
    references: [{ title: 'The Subtlety of Distinctiveness: What von Restorff Really Did', url: 'https://doi.org/10.3758/BF03214414' }],
  },
  'working-memory': {
    kind: 'empirical', confidence: 'strong',
    references: [{ title: 'The Magical Mystery Four: How Is Working Memory Capacity Limited, and Why?', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2864034/' }],
  },
  'zeigarnik-effect': {
    kind: 'empirical', confidence: 'contested',
    references: [{ title: 'Interruption, Recall and Resumption: A Meta-Analysis of the Zeigarnik and Ovsiankina Effects', url: 'https://www.nature.com/articles/s41599-025-05000-w' }],
  },
};

export const uxPrincipleCategories: UxPrincipleCategoryDef[] = [
  {
    id: 'perception',
    label: t('Perception & attention', '지각과 주의', '知覚と注意'),
    description: t(
      'How visual grouping, contrast, and focus shape what people notice first.',
      '시각적 그룹, 대비, 초점이 무엇을 먼저 보게 만드는지 다룹니다.',
      '視覚的なまとまり、対比、焦点が、最初に何を認識させるかを扱います。',
    ),
  },
  {
    id: 'cognition',
    label: t('Cognition & understanding', '인지와 이해', '認知と理解'),
    description: t(
      'How people form meaning while attention and working memory stay limited.',
      '주의와 작업 기억이 제한된 상태에서 의미를 만드는 방식을 다룹니다.',
      '注意と作業記憶に限界がある中で、人が意味を組み立てる仕組みを扱います。',
    ),
  },
  {
    id: 'decision',
    label: t('Choice & decision', '선택과 의사결정', '選択と意思決定'),
    description: t(
      'How the number, order, and framing of options change a decision.',
      '선택지의 수, 순서, 표현 방식이 결정에 미치는 영향을 다룹니다.',
      '選択肢の数、順序、見せ方が意思決定に与える影響を扱います。',
    ),
  },
  {
    id: 'interaction',
    label: t('Action & feedback', '행동과 피드백', '操作とフィードバック'),
    description: t(
      'How controls, conventions, response time, and feedback support fluent action.',
      '컨트롤, 관습, 응답 시간, 피드백이 막힘없는 행동을 돕는 방식을 다룹니다.',
      'コントロール、慣習、応答時間、フィードバックが円滑な操作を支える仕組みを扱います。',
    ),
  },
  {
    id: 'motivation',
    label: t('Motivation & progress', '동기와 진행', '動機づけと進捗'),
    description: t(
      'How challenge, momentum, and visible progress affect continued effort.',
      '난이도, 탄력, 보이는 진행이 지속적인 노력에 미치는 영향을 다룹니다.',
      '難易度、勢い、見える進捗が継続する意欲に与える影響を扱います。',
    ),
  },
  {
    id: 'memory',
    label: t('Memory & experience', '기억과 경험', '記憶と体験'),
    description: t(
      'How order, endings, and unfinished work influence what remains after use.',
      '순서, 마무리, 미완료 상태가 사용 후 기억에 남는 방식을 다룹니다.',
      '順序、終わり方、未完了の状態が利用後の記憶に与える影響を扱います。',
    ),
  },
];

export const uxPrincipleAttribution: UxPrincipleAttribution = {
  sourceName: 'Laws of UX',
  creator: 'Jon Yablonski',
  sourceUrl: 'https://lawsofux.com/',
  sourceLicense: {
    name: 'CC BY-NC-ND 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  },
  authoredContentLicense: {
    name: 'MIT',
    url: 'https://github.com/seungdori/web-stylebook-mcp/blob/main/LICENSE',
  },
  notice: t(
    'The index was inspired by Laws of UX. Principle names refer to established ideas; every summary, design question, application note, and check here is independently authored for Web Stylebook and made available under MIT through the standalone Web Stylebook MCP package. Laws of UX source prose, illustrations, and layout are not reproduced.',
    '이 색인은 Laws of UX에서 영감을 받았습니다. 원칙 이름은 널리 알려진 개념을 가리키며, 요약·설계 질문·적용법·검증 항목은 Web Stylebook용으로 독립 작성하고 별도 Web Stylebook MCP 패키지를 통해 MIT로 제공합니다. Laws of UX의 원문·일러스트레이션·레이아웃은 복제하지 않았습니다.',
    'この索引は Laws of UX から着想を得ています。原則名は広く知られた概念を指し、要約、設計上の問い、適用方法、検証項目は Web Stylebook 向けに独自執筆し、別の Web Stylebook MCP パッケージを通じて MIT で提供しています。Laws of UX の原文、図版、レイアウトは転載していません。',
  ),
};

function principle(
  id: string,
  name: ReturnType<typeof t>,
  aliases: string[],
  category: UxPrincipleCategory,
  summary: ReturnType<typeof t>,
  designQuestion: ReturnType<typeof t>,
  apply: ReturnType<typeof t>[],
  verify: ReturnType<typeof t>[],
  caution: ReturnType<typeof t>,
  outcomeTags: UxOutcome[],
  surfaceTags: UxSurface[],
  phaseTags: UxPhase[],
  relatedPrincipleIds: string[],
  referenceSlug = id,
): UxPrinciple {
  const evidence = evidenceById[id];
  if (!evidence) throw new Error(`[principles] missing evidence metadata for '${id}'`);
  return {
    id,
    name,
    aliases,
    category,
    summary,
    designQuestion,
    apply,
    verify,
    caution,
    outcomeTags,
    surfaceTags,
    phaseTags,
    evidence,
    relatedPrincipleIds,
    referenceUrl: `https://lawsofux.com/${referenceSlug}/`,
  };
}

const principleEntries: UxPrinciple[] = [
  principle(
    'aesthetic-usability-effect',
    t('Aesthetic-Usability Effect', '심미적 사용성 효과', '美的ユーザビリティ効果'),
    ['aesthetic usability', 'perceived usability'],
    'perception',
    t(
      'Visual polish can raise perceived ease and tolerance, even when task performance has not improved.',
      '시각적 완성도는 실제 과업 성능이 같아도 더 쉽고 관대하게 느끼게 할 수 있습니다.',
      '見た目の完成度は、実際の操作性が変わらなくても、使いやすさや許容度を高く感じさせます。',
    ),
    t(
      'Is the interface genuinely easier to use, or only easier to trust at first glance?',
      '이 인터페이스는 실제로 더 쉬운가요, 아니면 첫인상만 더 믿음직한가요?',
      'この画面は本当に使いやすいのか、それとも第一印象だけが良いのでしょうか。',
    ),
    [
      t('Use visual order and craft to make system status and next actions feel dependable.', '시각적 질서와 완성도로 상태와 다음 행동을 믿을 수 있게 만드세요.', '視覚的な秩序と仕上げによって、状態と次の操作を信頼できるものにします。'),
      t('Pair visual refinement with real task simplification and accessible states.', '시각 개선을 실제 과업 단순화와 접근 가능한 상태 설계와 함께 진행하세요.', '見た目の改善を、実際のタスク簡略化とアクセシブルな状態設計と組み合わせます。'),
    ],
    [
      t('Compare completion time, errors, and recovery—not preference scores alone.', '선호도뿐 아니라 완료 시간, 오류, 복구 성공도 함께 비교하세요.', '好みだけでなく、完了時間、エラー、復帰成功率も比較します。'),
      t('Test the same flow with reduced decoration to reveal hidden usability debt.', '장식을 줄인 같은 흐름도 테스트해 감춰진 사용성 부채를 드러내세요.', '装飾を減らした同じフローも試し、隠れたユーザビリティ負債を見つけます。'),
    ],
    t('Polish can mask broken interaction; never treat delight as proof of usability.', '완성도는 망가진 상호작용을 가릴 수 있으므로 호감을 사용성의 증거로 보지 마세요.', '美しさは壊れた操作を隠すため、好印象を使いやすさの証拠にしてはいけません。'),
    ['comprehension', 'trust'],
    ['global', 'landing-page', 'content'],
    ['content', 'validation'],
    ['cognitive-load'],
  ),
  principle(
    'choice-overload',
    t('Choice Overload', '선택 과부하', '選択過多'),
    ['overchoice', 'paradox of choice'],
    'decision',
    t(
      'Too many plausible options can make comparison harder, delay action, and reduce confidence.',
      '그럴듯한 선택지가 너무 많으면 비교가 어려워지고 행동이 늦어지며 확신도 낮아집니다.',
      'もっともらしい選択肢が多すぎると、比較が難しくなり、行動が遅れ、確信も弱まります。',
    ),
    t(
      'Which choices are necessary now, and which can wait until the user has more context?',
      '지금 꼭 필요한 선택은 무엇이며, 더 많은 맥락이 생길 때까지 미뤄도 되는 것은 무엇인가요?',
      '今必要な選択はどれで、文脈が増えるまで後回しにできるものはどれですか。',
    ),
    [
      t('Group comparable options and expose filters or sensible defaults before long lists.', '비교 가능한 선택지를 묶고 긴 목록 앞에 필터나 합리적인 기본값을 제공하세요.', '比較可能な選択肢をまとめ、長い一覧の前にフィルターや妥当な初期値を用意します。'),
      t('Sequence decisions so each step asks only for information needed at that moment.', '결정을 단계화해 각 단계가 그 순간 필요한 정보만 묻게 하세요.', '意思決定を段階化し、その時点で必要な情報だけを尋ねます。'),
    ],
    [
      t('Measure abandonment and time-to-decision as option counts change.', '선택지 수를 바꿔 이탈률과 결정 시간을 측정하세요.', '選択肢数を変え、離脱率と決定時間を測ります。'),
      t('Confirm that hidden advanced options remain discoverable and reversible.', '숨긴 고급 옵션도 찾을 수 있고 되돌릴 수 있는지 확인하세요.', '隠した詳細設定も発見でき、元に戻せることを確認します。'),
    ],
    t('Reducing visible choice must not become coercion or hide materially different terms.', '보이는 선택을 줄인다는 이유로 강요하거나 중요한 조건 차이를 숨기지 마세요.', '見える選択肢を減らすことを、誘導や重要条件の隠蔽に使ってはいけません。'),
    ['decision', 'action'],
    ['landing-page', 'navigation', 'search', 'form', 'checkout'],
    ['structure', 'interaction', 'validation'],
    ['hicks-law', 'selective-attention'],
  ),
  principle(
    'chunking',
    t('Chunking', '청킹', 'チャンキング'),
    ['grouping information', 'content chunks'],
    'cognition',
    t(
      'Meaningful groups let people scan and process a complex information set as fewer units.',
      '의미 있는 그룹은 복잡한 정보를 더 적은 단위로 훑고 처리하게 해줍니다.',
      '意味のあるまとまりは、複雑な情報を少ない単位として把握しやすくします。',
    ),
    t(
      'Can users identify the next meaningful group without reading every item?',
      '모든 항목을 읽지 않아도 다음 의미 단위를 찾을 수 있나요?',
      'すべてを読まなくても、次の意味のまとまりを見つけられますか。',
    ),
    [
      t('Group by user goal or decision, then label each group with a concrete heading.', '사용자 목표나 결정 기준으로 묶고 각 그룹에 구체적인 제목을 붙이세요.', '利用者の目的や判断単位でまとめ、具体的な見出しを付けます。'),
      t('Use spacing and hierarchy before adding more boxes and borders.', '박스와 보더를 늘리기 전에 간격과 위계를 먼저 사용하세요.', '箱や罫線を増やす前に、余白と階層を使います。'),
    ],
    [
      t('Scan-test headings alone: they should reconstruct the task structure.', '제목만 훑어도 과업 구조가 재구성되는지 확인하세요.', '見出しだけを追っても、タスク構造を再現できるか確認します。'),
      t('Check that no group mixes unrelated actions merely to balance the layout.', '레이아웃 균형 때문에 무관한 행동을 한 그룹에 섞지 않았는지 확인하세요.', 'レイアウトの均衡だけのために、無関係な操作を同じ群に入れていないか確認します。'),
    ],
    t('Over-chunking creates a maze of tiny sections; groups should express real relationships.', '과도한 청킹은 작은 섹션의 미로를 만드니 실제 관계가 있는 것만 묶으세요.', '細分化しすぎると小区画の迷路になるため、実際の関係があるものだけをまとめます。'),
    ['comprehension', 'memory'],
    ['landing-page', 'content', 'form', 'data-table', 'navigation'],
    ['structure', 'content', 'validation'],
    ['cognitive-load', 'working-memory'],
  ),
  principle(
    'cognitive-load',
    t('Cognitive Load', '인지 부하', '認知負荷'),
    ['mental effort', 'cognitive overload'],
    'cognition',
    t(
      'Every interface consumes limited mental resources; irrelevant processing competes with the task.',
      '모든 인터페이스는 제한된 정신 자원을 쓰며, 무관한 처리는 실제 과업과 경쟁합니다.',
      'あらゆる画面は限られた認知資源を使い、不要な処理は本来のタスクと競合します。',
    ),
    t(
      'What must the user remember, infer, or ignore to complete this step?',
      '이 단계를 완료하려면 무엇을 기억하고 추론하며 무시해야 하나요?',
      'この手順を終えるために、何を記憶し、推測し、無視する必要がありますか。',
    ),
    [
      t('Keep needed context visible and remove decoration that does not explain or support action.', '필요한 맥락은 보이게 두고 설명이나 행동에 도움 없는 장식은 줄이세요.', '必要な文脈を見える状態にし、理解や操作に寄与しない装飾を減らします。'),
      t('Split complex work by meaningful stages while preserving progress and entered data.', '복잡한 작업은 의미 있는 단계로 나누되 진행과 입력값은 보존하세요.', '複雑な作業を意味のある段階に分け、進捗と入力内容を保持します。'),
    ],
    [
      t('Observe where users reread, backtrack, or ask what a label means.', '사용자가 다시 읽고 되돌아가며 라벨 의미를 묻는 지점을 관찰하세요.', '読み直し、戻り、ラベルの意味を尋ねる箇所を観察します。'),
      t('Count simultaneous decisions and facts that must be remembered at each step.', '각 단계에서 동시에 결정하고 기억해야 할 사실의 수를 세어보세요.', '各段階で同時に判断し記憶する事実の数を数えます。'),
    ],
    t('Do not simplify away essential risk, price, or consequence information.', '단순화를 이유로 중요한 위험, 가격, 결과 정보를 없애지 마세요.', '簡略化を理由に、重要なリスク、価格、結果の情報を削ってはいけません。'),
    ['comprehension', 'action'],
    ['global', 'landing-page', 'form', 'onboarding', 'developer-console'],
    ['structure', 'interaction', 'content', 'validation'],
    ['chunking', 'working-memory', 'teslers-law'],
  ),
  principle(
    'doherty-threshold',
    t('Doherty Threshold', '도허티 임계', 'ドハティーの閾値'),
    ['response-time feedback', 'system responsiveness'],
    'interaction',
    t(
      'Fast, visible response keeps a human-computer exchange feeling continuous instead of stalled.',
      '빠르고 보이는 응답은 사람과 컴퓨터의 교환을 멈춤 없이 이어지게 합니다.',
      '素早く見える応答は、人とコンピューターのやり取りを途切れさせません。',
    ),
    t(
      'Does every action acknowledge the user quickly, even when completion takes longer?',
      '완료에 시간이 걸리더라도 모든 행동에 빠른 응답이 있나요?',
      '完了に時間がかかっても、すべての操作にすぐ反応がありますか。',
    ),
    [
      t('Acknowledge input immediately, then show determinate progress when duration is knowable.', '입력은 즉시 확인하고 예상 가능한 작업은 진행률을 보여주세요.', '入力を即座に受け付け、時間を見積もれる処理には進捗を示します。'),
      t('Keep prior content and controls stable while background work continues.', '백그라운드 작업 중에도 기존 콘텐츠와 컨트롤을 안정적으로 유지하세요.', 'バックグラウンド処理中も、既存の内容と操作を安定させます。'),
    ],
    [
      t('Measure input-to-feedback latency separately from total completion time.', '입력부터 피드백까지의 지연과 전체 완료 시간을 따로 측정하세요.', '入力から反応までの遅延と、全体の完了時間を別々に測ります。'),
      t('Test slow networks and devices so feedback does not depend on ideal conditions.', '느린 네트워크와 기기에서도 피드백이 유지되는지 테스트하세요.', '遅い回線や端末でも反応が保たれるか確認します。'),
    ],
    t('Never add fake delay to manufacture importance or trust.', '중요함이나 신뢰를 연출하려고 가짜 지연을 추가하지 마세요.', '重要さや信頼感を演出するために、偽の待ち時間を加えてはいけません。'),
    ['action', 'feedback', 'trust'],
    ['global', 'form', 'data-table', 'checkout', 'chat', 'developer-console'],
    ['interaction', 'validation'],
    ['goal-gradient-effect'],
  ),
  principle(
    'fitts-law',
    t('Fitts’s Law', '피츠의 법칙', 'フィッツの法則'),
    ['target acquisition', 'touch target'],
    'interaction',
    t(
      'Targets are faster and easier to acquire when they are larger, nearer, and well separated.',
      '대상이 더 크고 가깝고 충분히 떨어져 있을수록 빠르고 정확하게 선택할 수 있습니다.',
      '対象が大きく近く、十分に離れているほど、速く正確に選択できます。',
    ),
    t(
      'Are frequent and important actions easy to reach without risking a nearby wrong action?',
      '자주 쓰고 중요한 행동을 쉽게 누르면서 주변 오작동은 피할 수 있나요?',
      '頻繁で重要な操作に届きやすく、隣の誤操作を避けられますか。',
    ),
    [
      t('Give primary and touch actions generous hit areas, not merely larger visual labels.', '주요 터치 행동은 글자만 키우지 말고 실제 클릭 영역을 넉넉히 만드세요.', '主要なタッチ操作は文字だけでなく、実際の当たり判定を広くします。'),
      t('Place repeated controls near the task context and separate destructive neighbors.', '반복 컨트롤은 과업 맥락 가까이에 두고 파괴적 행동과 거리를 두세요.', '反復操作は対象の近くに置き、破壊的操作とは距離を取ります。'),
    ],
    [
      t('Inspect hit-box size and spacing at the smallest supported viewport.', '지원하는 가장 작은 화면에서 클릭 영역 크기와 간격을 확인하세요.', '対応する最小画面で、当たり判定の大きさと間隔を確認します。'),
      t('Complete key flows with touch and keyboard, not a precise mouse alone.', '정밀한 마우스뿐 아니라 터치와 키보드로 핵심 흐름을 완료해보세요.', '精密なマウスだけでなく、タッチとキーボードで主要フローを完了します。'),
    ],
    t('A large target still fails if its label, state, or consequence is unclear.', '큰 대상도 라벨, 상태, 결과가 모호하면 실패합니다.', '大きな対象でも、ラベル、状態、結果が曖昧なら失敗です。'),
    ['action'],
    ['global', 'navigation', 'form', 'checkout', 'settings'],
    ['structure', 'interaction', 'validation'],
    ['selective-attention'],
    'fittss-law',
  ),
  principle(
    'goal-gradient-effect',
    t('Goal-Gradient Effect', '목표 경사 효과', '目標勾配効果'),
    ['progress motivation', 'goal proximity'],
    'motivation',
    t(
      'Visible proximity to a goal can increase effort and help people finish a bounded task.',
      '목표에 가까워지는 정도가 보이면 노력이 커지고 한정된 과업을 마치기 쉬워집니다.',
      '目標への近さが見えると努力が高まり、区切りのあるタスクを完了しやすくなります。',
    ),
    t(
      'Can users see what is complete, what remains, and what completion means?',
      '완료한 것, 남은 것, 완료의 의미를 사용자가 알 수 있나요?',
      '完了したこと、残り、完了の意味を利用者が把握できますか。',
    ),
    [
      t('Show honest step or task progress when the sequence has a real endpoint.', '실제 끝이 있는 순서에는 정직한 단계 또는 과업 진행을 보여주세요.', '実際の終点がある手順には、正直な段階や進捗を示します。'),
      t('Break long work into meaningful milestones and celebrate completion without blocking it.', '긴 작업을 의미 있는 이정표로 나누고 완료를 방해하지 않는 방식으로 확인해 주세요.', '長い作業を意味ある節目に分け、完了を妨げずに達成を伝えます。'),
    ],
    [
      t('Confirm progress labels match actual remaining work, including optional branches.', '선택 분기를 포함해 진행 표시가 실제 남은 작업과 맞는지 확인하세요.', '任意分岐も含め、進捗表示が実際の残作業と一致するか確認します。'),
      t('Measure where users stop relative to milestone boundaries.', '사용자가 어느 이정표 경계에서 멈추는지 측정하세요.', '利用者がどの節目で止まるか測ります。'),
    ],
    t('Never fabricate head starts, completion percentages, or urgency to pressure users.', '사용자를 압박하려고 가짜 선행 진행, 완료율, 긴급성을 만들지 마세요.', '利用者を急かすために、偽の先行進捗、完了率、緊急性を作ってはいけません。'),
    ['progress', 'action'],
    ['form', 'checkout', 'onboarding', 'settings'],
    ['interaction', 'content', 'validation'],
    ['doherty-threshold', 'zeigarnik-effect'],
  ),
  principle(
    'hicks-law',
    t('Hick’s Law', '힉의 법칙', 'ヒックの法則'),
    ['choice reaction time', 'decision time'],
    'decision',
    t(
      'Decision time generally grows as the number and complexity of visible choices grows.',
      '보이는 선택지의 수와 복잡성이 커질수록 결정 시간도 대체로 길어집니다.',
      '見える選択肢の数と複雑さが増えるほど、判断時間も一般に長くなります。',
    ),
    t(
      'Which decision is primary here, and can secondary choices be organized without disappearing?',
      '여기서 핵심 결정은 무엇이며, 부차적 선택을 숨기지 않고 정리할 수 있나요?',
      'ここで中心となる判断は何で、二次的な選択を消さずに整理できますか。',
    ),
    [
      t('Prioritize the likely path and group alternatives by a criterion users understand.', '가능성 높은 경로를 우선하고 사용자가 이해하는 기준으로 대안을 묶으세요.', '可能性の高い経路を優先し、利用者が理解できる基準で代替案をまとめます。'),
      t('Use progressive disclosure for rare complexity while keeping a clear route to it.', '드문 복잡성은 단계적으로 공개하되 접근 경로는 분명히 두세요.', 'まれな複雑さは段階的に開示しつつ、到達経路を明確にします。'),
    ],
    [
      t('Time first meaningful choice and compare it across menu or option structures.', '첫 의미 있는 선택까지 걸리는 시간을 메뉴·선택 구조별로 비교하세요.', '最初の意味ある選択までの時間を、メニュー構造ごとに比較します。'),
      t('Verify that priority styling matches user frequency and consequence, not business preference alone.', '우선순위 스타일이 사업 선호가 아니라 사용자 빈도와 결과에 맞는지 확인하세요.', '優先表示が事業都合だけでなく、利用頻度と結果に合うか確認します。'),
    ],
    t('Fewer choices are not automatically better when users need comparison or control.', '사용자에게 비교나 통제가 필요하다면 선택지가 적다고 자동으로 더 좋은 것은 아닙니다.', '比較や制御が必要な場合、選択肢が少ないだけで良くなるわけではありません。'),
    ['decision', 'action'],
    ['landing-page', 'navigation', 'search', 'form', 'checkout'],
    ['structure', 'interaction', 'validation'],
    ['choice-overload', 'cognitive-load'],
  ),
  principle(
    'jakobs-law',
    t('Jakob’s Law', '야콥의 법칙', 'ヤコブの法則'),
    ['familiar conventions', 'external consistency'],
    'interaction',
    t(
      'People transfer expectations from products they already use, so familiar conventions reduce relearning.',
      '사람은 이미 쓰는 제품의 기대를 옮겨오므로 익숙한 관습이 재학습을 줄입니다.',
      '人は既存製品の期待を持ち込むため、慣れた慣習は学び直しを減らします。',
    ),
    t(
      'Where will a familiar convention speed understanding, and where is novelty worth the learning cost?',
      '어디서는 익숙한 관습이 이해를 빠르게 하고, 어디서는 새로움이 학습 비용을 감수할 가치가 있나요?',
      'どこでは慣習が理解を速め、どこでは新規性が学習コストに見合いますか。',
    ),
    [
      t('Keep common controls, navigation, and platform behaviors recognizable.', '일반적인 컨트롤, 내비게이션, 플랫폼 동작은 알아볼 수 있게 유지하세요.', '一般的な操作、ナビゲーション、プラットフォーム動作は見慣れた形にします。'),
      t('Spend novelty on the product-specific mechanic, not basic operation.', '새로움은 기본 조작이 아니라 제품 고유의 핵심 작동 방식에 사용하세요.', '新規性は基本操作ではなく、製品固有の中核機能に使います。'),
    ],
    [
      t('Ask first-time users what they expect before they click.', '첫 사용자가 클릭 전에 무엇을 예상하는지 물어보세요.', '初回利用者に、クリック前の予想を聞きます。'),
      t('Check keyboard, browser, and OS conventions as well as visual conventions.', '시각 관습뿐 아니라 키보드, 브라우저, 운영체제 관습도 확인하세요.', '見た目だけでなく、キーボード、ブラウザー、OS の慣習も確認します。'),
    ],
    t('Familiarity is evidence, not a veto; do not preserve a harmful pattern merely because it is common.', '익숙함은 근거이지 거부권이 아니므로 흔하다는 이유로 해로운 패턴을 유지하지 마세요.', '慣れは根拠であって拒否権ではありません。一般的でも有害なパターンは残しません。'),
    ['comprehension', 'action', 'trust'],
    ['global', 'landing-page', 'navigation', 'form', 'checkout'],
    ['discover', 'structure', 'validation'],
    ['mental-model', 'paradox-of-the-active-user'],
  ),
  principle(
    'law-of-common-region',
    t('Law of Common Region', '공통 영역의 법칙', '共通領域の法則'),
    ['common region', 'bounded grouping'],
    'perception',
    t(
      'Items inside the same visible boundary are likely to be understood as one group.',
      '같은 보이는 경계 안의 항목은 하나의 그룹으로 이해되기 쉽습니다.',
      '同じ見える境界内の要素は、一つのグループとして理解されやすくなります。',
    ),
    t(
      'Do boundaries express a real relationship, or are they only decorating the layout?',
      '경계가 실제 관계를 표현하나요, 아니면 레이아웃을 장식할 뿐인가요?',
      '境界は本当の関係を示していますか、それとも配置を飾るだけですか。',
    ),
    [
      t('Use a shared region for fields, controls, or evidence that must be interpreted together.', '함께 해석해야 하는 필드, 컨트롤, 근거를 같은 영역에 두세요.', '一緒に解釈すべき項目、操作、根拠を同じ領域に置きます。'),
      t('Prefer one clear boundary over nested panels that repeat the same grouping.', '같은 그룹을 반복하는 중첩 패널보다 하나의 분명한 경계를 사용하세요.', '同じまとまりを繰り返す入れ子パネルより、一つの明確な境界を使います。'),
    ],
    [
      t('Hide headings and ask whether the region still implies the intended grouping.', '제목을 가려도 영역이 의도한 그룹을 암시하는지 확인하세요.', '見出しを隠しても意図したまとまりが伝わるか確認します。'),
      t('Check mobile reflow so boundaries do not split related controls apart.', '모바일 재배치에서 경계가 관련 컨트롤을 갈라놓지 않는지 확인하세요.', 'モバイル再配置で、境界が関連操作を分断しないか確認します。'),
    ],
    t('Too many containers make every group look equally important and increase visual load.', '컨테이너가 너무 많으면 모든 그룹이 똑같이 중요해 보이고 시각 부하가 커집니다.', '容器が多すぎると、すべてが同じ重要度に見え、視覚負荷が増えます。'),
    ['attention', 'comprehension'],
    ['global', 'form', 'data-table', 'content'],
    ['structure', 'validation'],
    ['law-of-proximity', 'law-of-uniform-connectedness'],
  ),
  principle(
    'law-of-proximity',
    t('Law of Proximity', '근접성의 법칙', '近接の法則'),
    ['proximity grouping', 'spatial grouping'],
    'perception',
    t(
      'Elements placed near one another are likely to be interpreted as related.',
      '서로 가까운 요소는 관련된 것으로 해석되기 쉽습니다.',
      '近くに置かれた要素は、関連するものとして解釈されやすくなります。',
    ),
    t(
      'Does spacing make labels, values, actions, and sections belong to the right thing?',
      '간격이 라벨, 값, 행동, 섹션을 올바른 대상에 연결하나요?',
      '余白によって、ラベル、値、操作、区画が正しい対象に結びついていますか。',
    ),
    [
      t('Keep labels and help text closer to their control than to neighboring controls.', '라벨과 도움말은 주변 컨트롤보다 해당 컨트롤에 더 가깝게 두세요.', 'ラベルと補足は、隣の操作より対象の操作に近づけます。'),
      t('Use larger gaps between groups than within a group.', '그룹 사이 간격을 그룹 내부 간격보다 크게 두세요.', 'グループ間の余白を、グループ内より大きくします。'),
    ],
    [
      t('Trace each label to its target at desktop and mobile widths.', '데스크톱과 모바일에서 각 라벨이 어떤 대상에 연결되는지 따라가 보세요.', 'デスクトップとモバイルで、各ラベルがどの対象に結びつくか確認します。'),
      t('Check that validation messages appear beside the field they describe.', '검증 메시지가 설명하는 필드 바로 옆에 나타나는지 확인하세요.', '検証メッセージが対象項目のすぐ近くに出るか確認します。'),
    ],
    t('Proximity should reinforce semantics; do not squeeze unrelated actions together to save space.', '근접성은 의미를 강화해야 하며 공간 절약을 위해 무관한 행동을 붙이지 마세요.', '近接は意味を補強すべきです。省スペースのために無関係な操作を寄せません。'),
    ['attention', 'comprehension'],
    ['global', 'landing-page', 'navigation', 'form', 'data-table'],
    ['structure', 'validation'],
    ['law-of-common-region', 'law-of-similarity'],
  ),
  principle(
    'law-of-similarity',
    t('Law of Similarity', '유사성의 법칙', '類同の法則'),
    ['visual similarity', 'consistent encoding'],
    'perception',
    t(
      'Elements that look alike are likely to be read as sharing a role or behavior.',
      '비슷하게 보이는 요소는 같은 역할이나 동작을 공유하는 것으로 읽히기 쉽습니다.',
      '似た見た目の要素は、同じ役割や動作を持つものとして読まれやすくなります。',
    ),
    t(
      'Do repeated visual treatments mean the same thing everywhere?',
      '반복되는 시각 처리가 어디서나 같은 의미를 가지나요?',
      '繰り返す見た目は、どこでも同じ意味を持っていますか。',
    ),
    [
      t('Give the same component role consistent shape, type, color, and state behavior.', '같은 컴포넌트 역할에 일관된 형태, 글꼴, 색, 상태 동작을 주세요.', '同じ役割の部品には、一貫した形、文字、色、状態動作を与えます。'),
      t('Use a deliberate difference when an item has a materially different action or status.', '행동이나 상태가 실질적으로 다르면 의도적인 차이를 사용하세요.', '操作や状態が実質的に違う場合は、意図的に見た目を変えます。'),
    ],
    [
      t('Inventory repeated colors and shapes and name the meaning of each.', '반복되는 색과 형태를 목록화하고 각각의 의미를 적어보세요.', '繰り返す色と形を一覧にし、それぞれの意味を言語化します。'),
      t('Verify links do not look like plain text and non-actions do not look clickable.', '링크가 일반 텍스트처럼 보이거나 비행동 요소가 클릭 가능해 보이지 않는지 확인하세요.', 'リンクが通常文に見えず、非操作要素がクリック可能に見えないか確認します。'),
    ],
    t('Similarity without semantic consistency teaches the wrong interaction model.', '의미적 일관성 없는 유사성은 잘못된 상호작용 모델을 학습시킵니다.', '意味の一貫性がない類似は、誤った操作モデルを学習させます。'),
    ['attention', 'comprehension', 'action'],
    ['global', 'navigation', 'form', 'data-table'],
    ['structure', 'interaction', 'validation'],
    ['law-of-proximity', 'law-of-uniform-connectedness', 'von-restorff-effect'],
  ),
  principle(
    'law-of-uniform-connectedness',
    t('Law of Uniform Connectedness', '균일 연결성의 법칙', '一様連結の法則'),
    ['connectedness', 'visual connection'],
    'perception',
    t(
      'A visible connection makes elements feel more related than elements that are merely close or similar.',
      '보이는 연결은 단순히 가깝거나 비슷한 요소보다 더 강한 관계를 느끼게 합니다.',
      '見える接続は、近さや類似だけより強い関係を感じさせます。',
    ),
    t(
      'Which relationships need an explicit connection instead of another card or label?',
      '어떤 관계는 카드나 라벨을 하나 더 추가하는 대신 명시적 연결이 필요한가요?',
      'どの関係には、カードやラベルの追加より明示的な接続が必要ですか。',
    ),
    [
      t('Connect steps, dependencies, or selected items when the relationship drives the task.', '관계가 과업을 좌우하는 단계, 의존성, 선택 항목은 연결해 보여주세요.', '関係がタスクを左右する手順、依存、選択項目は接続して示します。'),
      t('Keep connector meaning consistent for flow, hierarchy, and status.', '흐름, 계층, 상태를 나타내는 연결선 의미를 일관되게 유지하세요.', '流れ、階層、状態を示す接続の意味を一貫させます。'),
    ],
    [
      t('Remove connector lines and ask what relationship becomes ambiguous.', '연결선을 제거했을 때 어떤 관계가 모호해지는지 확인하세요.', '接続線を外したとき、どの関係が曖昧になるか確認します。'),
      t('Check that connections remain understandable without color alone.', '색에만 의존하지 않아도 연결 관계를 이해할 수 있는지 확인하세요.', '色だけに頼らず接続関係を理解できるか確認します。'),
    ],
    t('Decorative lines that imply a false sequence or dependency are misinformation.', '거짓 순서나 의존성을 암시하는 장식용 연결선은 잘못된 정보입니다.', '偽の順序や依存を示す装飾線は誤情報です。'),
    ['comprehension', 'action'],
    ['navigation', 'form', 'data-table', 'developer-console'],
    ['structure', 'interaction', 'validation'],
    ['law-of-common-region', 'law-of-similarity'],
  ),
  principle(
    'mental-model',
    t('Mental Model', '멘탈 모델', 'メンタルモデル'),
    ['conceptual model', 'user expectation'],
    'cognition',
    t(
      'People act from a simplified internal explanation of how a system works and what each action will cause.',
      '사람은 시스템 작동 방식과 행동 결과에 대한 단순화된 내부 설명을 바탕으로 움직입니다.',
      '人は、システムの仕組みと操作結果についての簡略化した内的説明をもとに行動します。',
    ),
    t(
      'Does the interface match the user’s cause-and-effect expectations, or explain the difference before it matters?',
      '인터페이스가 사용자의 인과 기대와 맞나요, 아니면 차이를 중요해지기 전에 설명하나요?',
      '画面は利用者の因果関係の期待に合っていますか。違う場合、問題になる前に説明していますか。',
    ),
    [
      t('Use domain language and object relationships that users already understand.', '사용자가 이미 이해하는 도메인 용어와 객체 관계를 사용하세요.', '利用者が理解している分野用語と対象関係を使います。'),
      t('Preview consequences before irreversible actions and reflect changes where users expect them.', '되돌릴 수 없는 행동 전 결과를 미리 보여주고 예상한 위치에 변경을 반영하세요.', '取り消せない操作の前に結果を示し、期待される場所に変更を反映します。'),
    ],
    [
      t('Ask users to predict what a control will do before activating it.', '컨트롤을 실행하기 전에 어떤 일이 일어날지 예측해보게 하세요.', '操作前に、そのコントロールが何をするか予測してもらいます。'),
      t('Trace misunderstandings back to labels, grouping, state, or delayed feedback.', '오해의 원인을 라벨, 그룹, 상태, 지연된 피드백까지 거슬러 확인하세요.', '誤解の原因を、ラベル、まとまり、状態、遅れた反応まで遡って確認します。'),
    ],
    t('Do not force users to learn an implementation model that exists only for internal convenience.', '내부 편의를 위한 구현 모델을 사용자에게 억지로 학습시키지 마세요.', '内部都合だけの実装モデルを利用者に学ばせてはいけません。'),
    ['comprehension', 'action', 'trust'],
    ['global', 'landing-page', 'navigation', 'form', 'settings', 'developer-console'],
    ['discover', 'structure', 'interaction', 'validation'],
    ['jakobs-law', 'paradox-of-the-active-user', 'postels-law'],
  ),
  principle(
    'paradox-of-the-active-user',
    t('Paradox of the Active User', '능동적 사용자 역설', 'アクティブユーザーのパラドックス'),
    ['active user paradox', 'learning by doing'],
    'interaction',
    t(
      'People often start acting before reading instructions, even when a short learning step could save time later.',
      '사람은 짧게 학습하면 나중에 시간을 아낄 수 있어도 설명을 읽기 전에 행동부터 시작하곤 합니다.',
      '短く学べば後で時間を節約できても、人は説明を読む前に操作を始めがちです。',
    ),
    t(
      'Can someone begin safely, then discover help exactly when the next obstacle appears?',
      '안전하게 시작한 뒤 다음 장애가 나타날 때 정확히 도움을 찾을 수 있나요?',
      '安全に始め、次の障害が出た瞬間に必要な助けを見つけられますか。',
    ),
    [
      t('Let users perform the core action early with safe defaults and reversible results.', '안전한 기본값과 되돌릴 수 있는 결과로 핵심 행동을 일찍 수행하게 하세요.', '安全な初期値と取り消せる結果で、中核操作を早く試せるようにします。'),
      t('Place contextual help, examples, and shortcuts where the need appears.', '도움말, 예시, 단축키를 필요가 생기는 맥락에 배치하세요.', 'ヘルプ、例、ショートカットを必要になる場所に置きます。'),
    ],
    [
      t('Run first-use testing without asking participants to read onboarding copy.', '온보딩 문구를 읽으라고 요청하지 않고 첫 사용 테스트를 진행하세요.', 'オンボーディング文を読むよう求めず、初回利用を試します。'),
      t('Check that skipped education can be reopened later and does not block recovery.', '건너뛴 교육을 나중에 다시 열 수 있고 복구를 막지 않는지 확인하세요.', '飛ばした説明を後で開け、復帰を妨げないか確認します。'),
    ],
    t('“Learn by doing” is not a reason to expose beginners to destructive or costly mistakes.', '행동하며 배운다는 이유로 초보자를 파괴적이거나 큰 비용의 실수에 노출하지 마세요.', '「操作しながら学ぶ」を理由に、初心者を破壊的・高額な失敗にさらしてはいけません。'),
    ['action', 'comprehension'],
    ['global', 'onboarding', 'form', 'developer-console'],
    ['structure', 'interaction', 'content', 'validation'],
    ['jakobs-law', 'mental-model'],
  ),
  principle(
    'peak-end-rule',
    t('Peak-End Rule', '피크엔드 법칙', 'ピーク・エンドの法則'),
    ['peak end', 'remembered experience'],
    'memory',
    t(
      'People’s memory of an experience can be strongly shaped by its most intense moment and its ending.',
      '경험에 대한 기억은 가장 강한 순간과 마무리의 영향을 크게 받을 수 있습니다.',
      '体験の記憶は、最も強い瞬間と終わり方に大きく左右されることがあります。',
    ),
    t(
      'What is the most consequential moment, and does the ending clearly resolve what happened?',
      '가장 중요한 순간은 무엇이며, 마무리가 일어난 일을 분명히 정리하나요?',
      '最も重要な瞬間は何で、終わりが起きたことを明確に締めくくっていますか。',
    ),
    [
      t('Design confirmation, recovery, and handoff moments as carefully as the primary action.', '확인, 복구, 인계 순간을 주요 행동만큼 세심하게 설계하세요.', '確認、復帰、引き継ぎの瞬間を主要操作と同じように設計します。'),
      t('End flows with the result, next safe action, and any lasting consequence made explicit.', '흐름의 끝에 결과, 다음 안전한 행동, 지속되는 영향을 명시하세요.', 'フローの最後に、結果、次の安全な操作、残る影響を明示します。'),
    ],
    [
      t('Test the final screen after success, failure, cancellation, and retry.', '성공, 실패, 취소, 재시도 후의 마지막 화면을 모두 테스트하세요.', '成功、失敗、取消、再試行後の最終画面をすべて確認します。'),
      t('Ask what users remember after a delay, not only how they rate the moment.', '즉시 평가뿐 아니라 시간이 지난 뒤 무엇을 기억하는지 물어보세요.', 'その場の評価だけでなく、時間後に何を覚えているか尋ねます。'),
    ],
    t('A polished peak or ending cannot compensate for a harmful or frustrating middle.', '잘 만든 절정이나 마무리도 해롭고 답답한 중간 경험을 보상하지 못합니다.', '良い山場や終わりでも、有害で苛立つ途中を帳消しにはできません。'),
    ['memory', 'trust'],
    ['global', 'onboarding', 'form', 'checkout', 'chat'],
    ['interaction', 'content', 'validation'],
    ['serial-position-effect', 'zeigarnik-effect'],
  ),
  principle(
    'postels-law',
    t('Postel’s Law', '포스텔의 법칙', 'ポステルの法則'),
    ['robustness principle', 'input tolerance'],
    'interaction',
    t(
      'Interfaces can accept known harmless input variation while emitting clear, consistent output.',
      '인터페이스는 알려진 무해한 입력 변형을 받아들이되 명확하고 일관된 출력을 내보낼 수 있습니다.',
      '既知で無害な入力の違いを受け入れつつ、明確で一貫した出力を返せます。',
    ),
    t(
      'Which variations can be normalized safely, and which ambiguity must produce a clear error?',
      '어떤 변형은 안전하게 정규화할 수 있고, 어떤 모호함은 분명한 오류를 내야 하나요?',
      'どの違いは安全に正規化でき、どの曖昧さは明確なエラーにすべきですか。',
    ),
    [
      t('Normalize harmless formatting differences such as whitespace or familiar date separators.', '공백이나 익숙한 날짜 구분자 같은 무해한 형식 차이를 정규화하세요.', '空白や一般的な日付区切りなど、無害な形式差を正規化します。'),
      t('Show the normalized interpretation before committing expensive or irreversible actions.', '비용이 크거나 되돌릴 수 없는 행동 전 정규화한 해석을 보여주세요.', '高額・不可逆な操作の前に、正規化した解釈を示します。'),
    ],
    [
      t('Test locale, whitespace, pasted content, and boundary values.', '로케일, 공백, 붙여넣은 콘텐츠, 경계값을 테스트하세요.', 'ロケール、空白、貼り付け内容、境界値を試します。'),
      t('Verify malformed input fails explicitly and does not change stored data.', '잘못된 입력이 명시적으로 실패하고 저장 데이터를 바꾸지 않는지 확인하세요.', '不正入力が明示的に失敗し、保存データを変えないか確認します。'),
    ],
    t('Do not apply permissive parsing to security boundaries or ambiguous protocols; RFC 9413 explains the risk.', '보안 경계나 모호한 프로토콜에 관대한 파싱을 적용하지 마세요. RFC 9413이 그 위험을 설명합니다.', 'セキュリティ境界や曖昧なプロトコルに寛容な解析を使わないでください。RFC 9413 が危険を説明しています。'),
    ['action', 'feedback', 'trust'],
    ['search', 'form', 'checkout', 'developer-console'],
    ['interaction', 'validation'],
    ['mental-model'],
  ),
  principle(
    'selective-attention',
    t('Selective Attention', '선택적 주의', '選択的注意'),
    ['attention filtering', 'inattentional blindness'],
    'perception',
    t(
      'People focus on stimuli related to their current goal and can miss other visible information.',
      '사람은 현재 목표와 관련된 자극에 집중하며 화면에 보이는 다른 정보도 놓칠 수 있습니다.',
      '人は現在の目的に関係する刺激へ集中し、見えている他の情報を見落とすことがあります。',
    ),
    t(
      'Does visual emphasis follow the user’s current goal, and can critical exceptions still break through?',
      '시각적 강조가 현재 사용자 목표를 따르며 중요한 예외는 여전히 눈에 들어오나요?',
      '視覚的強調は現在の目的に沿い、重要な例外はそれでも気づけますか。',
    ),
    [
      t('Give the current task one dominant focal path and quiet secondary information.', '현재 과업에는 하나의 주된 시선 경로를 만들고 부차 정보는 차분하게 두세요.', '現在のタスクに一つの主な視線経路を作り、二次情報は静かにします。'),
      t('Place critical warnings beside the action or data they change, not in a distant banner.', '중요 경고는 멀리 떨어진 배너가 아니라 영향을 주는 행동이나 데이터 옆에 두세요.', '重要な警告は遠いバナーではなく、影響する操作やデータの近くに置きます。'),
    ],
    [
      t('Use task-based observation to see what visible information users actually notice.', '과업 기반 관찰로 사용자가 보이는 정보 중 실제로 무엇을 알아채는지 확인하세요.', 'タスク観察で、見えている情報のうち実際に何へ気づくか確認します。'),
      t('Check that alerts remain distinguishable without relying on motion or color alone.', '알림이 모션이나 색에만 의존하지 않아도 구분되는지 확인하세요.', '警告が動きや色だけに頼らず区別できるか確認します。'),
    ],
    t('Attention capture is a scarce resource; do not spend it on decorative badges, motion, or urgency.', '주의를 끄는 힘은 희소하므로 장식용 뱃지, 모션, 긴급성에 낭비하지 마세요.', '注意を引く力は限られています。装飾バッジ、動き、緊急性に浪費しません。'),
    ['attention', 'comprehension'],
    ['global', 'landing-page', 'navigation', 'data-table', 'checkout', 'developer-console'],
    ['structure', 'content', 'validation'],
    ['von-restorff-effect', 'cognitive-load'],
  ),
  principle(
    'serial-position-effect',
    t('Serial Position Effect', '계열 위치 효과', '系列位置効果'),
    ['primacy effect', 'recency effect'],
    'memory',
    t(
      'Items near the beginning and end of a sequence are often easier to recall than items in the middle.',
      '순서의 시작과 끝에 가까운 항목은 중간 항목보다 기억되기 쉬운 경우가 많습니다.',
      '並びの最初と最後に近い項目は、中間より思い出しやすい傾向があります。',
    ),
    t(
      'Which items must be remembered or found again, and where are they placed in the sequence?',
      '반드시 기억하거나 다시 찾아야 하는 항목은 무엇이며 순서상 어디에 있나요?',
      '覚える、または再び見つける必要がある項目は何で、並びのどこにありますか。',
    ),
    [
      t('Place the most important first step and final action at stable, easy-to-find positions.', '가장 중요한 첫 단계와 마지막 행동을 안정적이고 찾기 쉬운 위치에 두세요.', '最重要の最初の手順と最後の操作を、安定した見つけやすい位置に置きます。'),
      t('Break long sequences with headings and persistent navigation so middle items are not lost.', '긴 순서는 제목과 지속 내비게이션으로 나눠 중간 항목이 묻히지 않게 하세요.', '長い並びを見出しと持続的ナビで分け、中間項目を埋もれさせません。'),
    ],
    [
      t('Run recall and findability tests for middle items, not only first and last items.', '첫 항목과 마지막 항목뿐 아니라 중간 항목도 기억·탐색 테스트를 하세요.', '最初と最後だけでなく、中間項目の想起と発見性も試します。'),
      t('Check reordered and localized lists because item position can change by language.', '언어에 따라 항목 위치가 달라질 수 있으므로 재정렬·번역 목록을 확인하세요.', '言語で位置が変わるため、並び替え後と翻訳後の一覧も確認します。'),
    ],
    t('Do not bury required disclosures or accessibility controls in the weak middle of a long list.', '필수 고지나 접근성 컨트롤을 긴 목록의 약한 중간 위치에 묻지 마세요.', '必須説明やアクセシビリティ操作を、長い一覧の弱い中間に埋めてはいけません。'),
    ['attention', 'memory'],
    ['landing-page', 'navigation', 'content', 'checkout', 'onboarding'],
    ['structure', 'content', 'validation'],
    ['peak-end-rule', 'von-restorff-effect'],
  ),
  principle(
    'teslers-law',
    t('Tesler’s Law', '테슬러의 법칙', 'テスラーの法則'),
    ['law of conservation of complexity', 'conservation of complexity'],
    'cognition',
    t(
      'Some domain complexity cannot be removed; design decides whether the system or the user carries it.',
      '일부 도메인 복잡성은 없앨 수 없으며 설계는 시스템과 사용자 중 누가 이를 감당할지 결정합니다.',
      '一部の分野の複雑さは消せず、設計はシステムと利用者のどちらが負担するかを決めます。',
    ),
    t(
      'Which complexity is essential, and can the system absorb it without removing user control?',
      '어떤 복잡성이 필수이며, 사용자 통제를 없애지 않고 시스템이 대신 감당할 수 있나요?',
      'どの複雑さが不可欠で、利用者の制御を失わずシステムが引き受けられますか。',
    ),
    [
      t('Automate repeated translation, formatting, and dependency work while exposing the result.', '반복되는 변환, 형식, 의존성 작업은 자동화하되 결과는 보여주세요.', '反復する変換、形式、依存作業は自動化し、結果を見せます。'),
      t('Offer a simple common path and a deliberate expert path for irreducible controls.', '줄일 수 없는 컨트롤에는 단순한 일반 경로와 의도적인 전문가 경로를 제공하세요.', '削れない操作には、簡単な一般経路と明確な専門家経路を用意します。'),
    ],
    [
      t('List every rule users must infer or maintain outside the interface.', '사용자가 인터페이스 밖에서 추론하거나 관리해야 하는 규칙을 모두 적어보세요.', '画面外で利用者が推測・管理する規則を列挙します。'),
      t('Test automation failures and confirm manual recovery remains possible.', '자동화 실패를 테스트하고 수동 복구가 가능한지 확인하세요.', '自動化失敗を試し、手動復帰が可能か確認します。'),
    ],
    t('Hiding complexity is not the same as resolving it; invisible decisions can remove consent and control.', '복잡성을 숨기는 것과 해결하는 것은 다르며 보이지 않는 결정은 동의와 통제를 없앨 수 있습니다.', '複雑さを隠すことと解決することは別です。見えない判断は同意と制御を奪います。'),
    ['comprehension', 'action', 'trust'],
    ['global', 'form', 'settings', 'developer-console'],
    ['discover', 'structure', 'interaction', 'validation'],
    ['cognitive-load', 'mental-model'],
  ),
  principle(
    'von-restorff-effect',
    t('Von Restorff Effect', '폰 레스토프 효과', 'フォン・レストルフ効果'),
    ['isolation effect', 'distinctiveness effect'],
    'perception',
    t(
      'Among similar items, a genuinely different item is more likely to attract attention and be remembered.',
      '비슷한 항목 사이에서 실제로 다른 항목은 주의를 끌고 기억될 가능성이 높습니다.',
      '似た項目の中で本当に異なるものは、注意を引き記憶されやすくなります。',
    ),
    t(
      'What single exception or action deserves contrast, and what becomes quieter so it can stand out?',
      '어떤 하나의 예외나 행동이 대비를 받을 가치가 있으며, 이를 돋보이게 하려면 무엇이 차분해져야 하나요?',
      'どの一つの例外や操作に対比が必要で、目立たせるために何を静かにしますか。',
    ),
    [
      t('Reserve the strongest contrast for one primary action, exception, or changed state per region.', '한 영역에서 가장 강한 대비는 하나의 주요 행동, 예외, 변경 상태에만 사용하세요.', '一領域の最強の対比は、一つの主要操作、例外、変更状態に限定します。'),
      t('Make the distinction semantic through label and shape, not color alone.', '차이는 색만이 아니라 라벨과 형태로도 의미 있게 만드세요.', '違いを色だけでなく、ラベルと形でも意味づけます。'),
    ],
    [
      t('Count competing accents in one viewport and name what each is asking the user to notice.', '한 화면의 경쟁하는 강조 수를 세고 각각 무엇을 보라고 하는지 적어보세요.', '一画面の競合する強調を数え、それぞれ何へ気づかせるか言語化します。'),
      t('Check grayscale and reduced-motion modes to confirm the exception remains distinct.', '회색조와 모션 축소 모드에서도 예외가 구분되는지 확인하세요.', 'グレースケールと動き軽減でも例外が区別できるか確認します。'),
    ],
    t('If everything is special, nothing is; do not turn salience into a field of competing CTAs.', '모든 것이 특별하면 아무것도 특별하지 않으니 경쟁하는 CTA 밭을 만들지 마세요.', 'すべてを特別にすると何も目立ちません。競合する CTA だらけにしないでください。'),
    ['attention', 'memory'],
    ['global', 'landing-page', 'navigation', 'form', 'checkout'],
    ['structure', 'content', 'validation'],
    ['selective-attention', 'law-of-similarity', 'serial-position-effect'],
  ),
  principle(
    'working-memory',
    t('Working Memory', '작업 기억', 'ワーキングメモリ'),
    ['short-term processing', 'active memory'],
    'cognition',
    t(
      'People can hold and manipulate only a small amount of task-relevant information at one time.',
      '사람은 한 번에 소량의 과업 관련 정보만 유지하고 조작할 수 있습니다.',
      '人が一度に保持し操作できるタスク情報は少量に限られます。',
    ),
    t(
      'What context disappears between steps and forces the user to remember it?',
      '단계 사이에 어떤 맥락이 사라져 사용자가 기억해야 하나요?',
      '手順の間でどの文脈が消え、利用者の記憶に委ねられていますか。',
    ),
    [
      t('Keep selected values, comparison targets, constraints, and progress visible across steps.', '선택값, 비교 대상, 제약, 진행 상태를 단계가 바뀌어도 보이게 유지하세요.', '選択値、比較対象、制約、進捗を手順間でも見えるようにします。'),
      t('Prefer recognition from visible options over recall of codes, labels, or prior screens.', '코드, 라벨, 이전 화면을 기억하게 하기보다 보이는 선택지에서 알아보게 하세요.', 'コード、ラベル、前画面を思い出させるより、見える選択肢から認識できるようにします。'),
    ],
    [
      t('Complete multi-step tasks after a brief interruption and note what must be reconstructed.', '잠깐 중단한 뒤 다단계 과업을 재개해 무엇을 다시 구성해야 하는지 확인하세요.', '短い中断後に多段階タスクを再開し、何を再構築する必要があるか確認します。'),
      t('Check that validation errors preserve entered data and the reason for the choice.', '검증 오류가 입력값과 선택 이유를 보존하는지 확인하세요.', '検証エラー時に入力内容と選択理由が保持されるか確認します。'),
    ],
    t('Do not turn a remembered item count into a universal menu or layout limit.', '기억 항목 수를 보편적인 메뉴나 레이아웃 상한으로 만들지 마세요.', '記憶項目数を、普遍的なメニューや配置の上限にしてはいけません。'),
    ['comprehension', 'memory', 'action'],
    ['form', 'data-table', 'onboarding', 'chat', 'developer-console'],
    ['structure', 'interaction', 'content', 'validation'],
    ['chunking', 'cognitive-load'],
  ),
  principle(
    'zeigarnik-effect',
    t('Zeigarnik & Ovsiankina Effects', '자이가르닉·옵시안키나 효과', 'ツァイガルニク効果とオヴシアンキナ効果'),
    ['zeigarnik effect', 'unfinished task effect', 'task resumption', 'ovsiankina effect'],
    'motivation',
    t(
      'A memory advantage for unfinished work is not reliably supported; the separate but related Ovsiankina effect describes a tendency to resume interrupted tasks.',
      '미완료 작업이 더 잘 기억된다는 주장은 일관되게 지지되지 않으며, 관련되지만 별개인 옵시안키나 효과는 중단한 과업을 재개하려는 경향을 설명합니다.',
      '未完了課題がよく記憶されるという主張は一貫して支持されておらず、関連する別概念のオヴシアンキナ効果が中断課題を再開する傾向を説明します。',
    ),
    t(
      'Can users leave safely and later recover the exact state, next step, and reason it remains incomplete?',
      '사용자가 안전하게 떠난 뒤 정확한 상태, 다음 단계, 미완료 이유를 복구할 수 있나요?',
      '安全に離れた後、正確な状態、次の手順、未完了理由を復元できますか。',
    ),
    [
      t('Auto-save drafts and provide a specific resume point instead of a vague unfinished badge.', '초안을 자동 저장하고 막연한 미완료 뱃지 대신 구체적인 재개 지점을 제공하세요.', '下書きを自動保存し、曖昧な未完了バッジではなく具体的な再開地点を示します。'),
      t('Show remaining work and expiration only when both are real and useful.', '남은 작업과 만료는 실제이며 유용할 때만 보여주세요.', '残作業と期限は、実在し役立つ場合だけ表示します。'),
    ],
    [
      t('Interrupt a task, return later, and verify state, inputs, and focus are recoverable.', '과업을 중단했다가 나중에 돌아와 상태, 입력, 포커스를 복구할 수 있는지 확인하세요.', 'タスクを中断し後で戻り、状態、入力、焦点を復元できるか確認します。'),
      t('Distinguish genuine resumption from anxiety-driven re-engagement in research.', '연구에서 실제 재개 필요와 불안으로 인한 재참여를 구분하세요.', '調査では、本当の再開需要と不安による再関与を区別します。'),
    ],
    t('Do not call resumability a proven Zeigarnik memory effect, and never weaponize incompleteness or false urgency.', '재개 가능성을 입증된 자이가르닉 기억 효과라고 부르지 말고, 미완료감이나 가짜 긴급성을 악용하지 마세요.', '再開しやすさを実証済みのツァイガルニク記憶効果と呼ばず、未完了感や偽の緊急性を悪用しないでください。'),
    ['progress', 'memory', 'action'],
    ['form', 'checkout', 'onboarding', 'settings'],
    ['interaction', 'content', 'validation'],
    ['goal-gradient-effect', 'peak-end-rule'],
  ),
];

const categoryOrder = new Map(
  uxPrincipleCategories.map((category, index) => [category.id, index]),
);

export const uxPrinciples: UxPrinciple[] = [...principleEntries].sort((a, b) => {
  const categoryDelta = (categoryOrder.get(a.category) ?? 0) - (categoryOrder.get(b.category) ?? 0);
  if (categoryDelta) return categoryDelta;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
});
