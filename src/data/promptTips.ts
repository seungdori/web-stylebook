import type { LocalizedText } from './styles';

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

export interface AntiPattern {
  title: LocalizedText;
  description: LocalizedText;
  vague: string;
  specific: string;
}

export interface Principle {
  title: LocalizedText;
  description: LocalizedText;
  tip: string;
}

export interface PromptSnippet {
  title: LocalizedText;
  code: string;
}

export const antiPatterns: AntiPattern[] = [
  {
    title: t('The Gradient Fog', '그라데이션 안개', 'グラデーションの霧'),
    description: t(
      'Soft purple-to-blue gradients applied everywhere instead of real hierarchy.',
      '실제 위계 대신 보라-파랑 그라데이션을 어디에나 바르는 패턴입니다.',
      '本当の階層の代わりに紫から青のグラデーションをどこにでも使うパターンです。',
    ),
    vague: 'Make it modern and visually appealing with a nice gradient background.',
    specific: 'Background: flat #0b0d12. Use a gradient only on the primary CTA button. No gradients elsewhere.',
  },
  {
    title: t('The Blur Crutch', '블러 의존', 'ぼかしへの依存'),
    description: t(
      'Backdrop blur on every panel makes the page foggy and ungrounded.',
      '모든 패널에 backdrop blur를 쓰면 화면이 흐리고 근거 없어 보입니다.',
      'すべてのパネルにbackdrop blurを使うと、画面が霧っぽく不安定になります。',
    ),
    vague: 'Use glassmorphism for a premium feel.',
    specific: 'Cards: solid rgba(28,28,30,.85), 1px border rgba(255,255,255,.08). Blur only the nav overlay.',
  },
  {
    title: t('Rounded Everything', '전부 둥글게', 'すべてを丸くする'),
    description: t(
      'The same large radius on every element erases visual hierarchy.',
      '모든 요소에 같은 큰 radius를 주면 시각적 위계가 사라집니다.',
      'すべての要素に同じ大きな角丸を使うと階層が消えます。',
    ),
    vague: 'Use rounded corners for a friendly look.',
    specific: 'Radius system: containers 16px, cards 8px, buttons 6px, tags 3px. Never round full-width sections.',
  },
  {
    title: t('Decorative Animation', '장식용 애니메이션', '装飾だけのアニメーション'),
    description: t(
      'Floating objects and scroll fades that add no information quickly become noise.',
      '정보를 더하지 않는 떠다니는 오브젝트와 스크롤 페이드는 곧 소음이 됩니다.',
      '情報を増やさない浮遊物やスクロールフェードはすぐにノイズになります。',
    ),
    vague: 'Add some animations to make it feel alive.',
    specific: 'Motion: 180ms hover transitions, staggered feature reveal once, no looping decoration, respect prefers-reduced-motion.',
  },
];

export const principles: Principle[] = [
  {
    title: t('Name a specific style', '구체적인 스타일 이름을 지정', '具体的なスタイル名を指定する'),
    description: t(
      'Modern and clean are too broad. Named visual systems reduce ambiguity.',
      'modern, clean은 너무 넓습니다. 이름 있는 시각 시스템이 모호함을 줄입니다.',
      'modernやcleanは広すぎます。名前のある視覚システムが曖昧さを減らします。',
    ),
    tip: 'Use: Swiss Poster style, Terminal Core style, Quiet Utility style, or Kinetic x Brutal fusion.',
  },
  {
    title: t('Lock typography early', '타이포그래피를 먼저 고정', 'タイポグラフィを先に固定する'),
    description: t(
      'Typography defines most of the perceived design character.',
      '타이포그래피는 디자인 인상의 대부분을 결정합니다.',
      'タイポグラフィはデザイン印象の大部分を決めます。',
    ),
    tip: 'Specify heading font, body font, code font, size scale, line-height, and letter spacing.',
  },
  {
    title: t('Define what is forbidden', '금지 항목을 명시', '禁止事項を定義する'),
    description: t(
      'Negative constraints often prevent generic defaults better than positive adjectives.',
      '부정 제약은 긍정 형용사보다 기본값 수렴을 더 잘 막습니다.',
      '否定制約は肯定的な形容詞よりも凡庸な初期値を防ぎます。',
    ),
    tip: 'FORBIDDEN: horizontal scroll, random gradients, blur over 8px, low contrast, nested cards.',
  },
  {
    title: t('Specify layout as structure', '레이아웃을 구조로 설명', 'レイアウトを構造として説明する'),
    description: t(
      'Spacious is subjective; grid, width, gap, and component order are implementable.',
      'spacious는 주관적입니다. grid, width, gap, component order는 구현 가능합니다.',
      'spaciousは主観的です。grid、width、gap、component orderは実装できます。',
    ),
    tip: 'Content max-width 1120px. Hero left-aligned. Feature grid 3 columns desktop, 1 column mobile.',
  },
];

export const promptSnippets: PromptSnippet[] = [
  {
    title: t('Anti-Generic Constraint', '반-제네릭 제약', '反ジェネリック制約'),
    code: `FORBIDDEN:
- no generic purple/blue gradient background
- no floating decorative orbs
- no card-inside-card layout
- no low contrast muted text
- no border radius larger than 12px unless the style requires it`,
  },
  {
    title: t('Typography Lock', '타이포그래피 고정', 'タイポグラフィ固定'),
    code: `TYPOGRAPHY:
- Heading: distinctive display font, 700 weight, tight line-height
- Body: readable sans, 16px, line-height 1.65
- Code/metadata: mono only for technical labels
- Paragraph measure: 45-75 characters`,
  },
  {
    title: t('Motion Constraints', '모션 제약', 'モーション制約'),
    code: `MOTION:
- hover transitions: 160-220ms
- one staggered reveal for primary content only
- no infinite decorative loops
- support prefers-reduced-motion
- animation must communicate state or hierarchy`,
  },
  {
    title: t('Quality Gate Prompt', '품질 검증 프롬프트', '品質ゲートプロンプト'),
    code: `SELF-CHECK:
- no horizontal overflow at 375px width
- every button label fits
- text contrast passes WCAG AA where possible
- layout does not shift on hover
- all interactive states are keyboard reachable`,
  },
];
