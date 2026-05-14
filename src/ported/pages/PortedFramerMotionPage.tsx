import { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from 'motion/react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

type Loc = { en: string; ko: string; ja: string };
const t = (en: string, ko: string, ja: string): Loc => ({ en, ko, ja });
const pick = (value: Loc, lang: Lang) => value[lang] ?? value.en;

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const REVEAL_VIEWPORT = { once: true, margin: '0px 0px -80px 0px' } as const;

const headReveal: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const riseChild: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

const slideChild: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

const ctaSpring = { type: 'spring' as const, stiffness: 320, damping: 22, mass: 0.6 };

function BentoCard({
  className = '',
  children,
  variants,
}: {
  className?: string;
  children: ReactNode;
  variants?: Variants;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), {
    stiffness: 220,
    damping: 22,
    mass: 0.5,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), {
    stiffness: 220,
    damping: 22,
    mass: 0.5,
  });

  return (
    <motion.div
      ref={ref}
      className={`bento-card ${className}`.trim()}
      style={{
        animation: 'none',
        rotateX: reduced ? 0 : rotateX,
        rotateY: reduced ? 0 : rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
      }}
      variants={variants}
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
      onMouseMove={(event) => {
        if (reduced) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((event.clientX - rect.left) / rect.width - 0.5);
        my.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

const COPY = {
  hero: {
    badge: t('Motion-First Design', '모션 중심 디자인', 'モーションファースト デザイン'),
    titleLineA: t('Build with', '함께 만드는', 'ともに作る'),
    titleAccent: t('Framer Motion', 'Framer Motion', 'Framer Motion'),
    lead: t(
      'A dark, motion-centric SaaS aesthetic inspired by Framer, Linear, and Vercel. Gradient text, bento grids, and spring-eased interactions create a premium interactive landing — without the heavy choreography.',
      'Framer, Linear, Vercel에서 영감 받은 다크 모션 중심 SaaS 미학입니다. 그라디언트 텍스트, 벤토 그리드, 스프링 이징의 인터랙션이 과한 연출 없이 프리미엄 랜딩 경험을 만들어 냅니다.',
      'Framer、Linear、Vercelからインスピレーションを得たダークでモーション中心のSaaS美学です。グラデーションテキスト、ベントグリッド、スプリングイージングが過剰演出なしにプレミアムなランディング体験を生み出します。',
    ),
    pills: [
      { code: 'motion/react', label: t('Spring physics', '스프링 피직스', 'スプリング物理') },
      { code: 'whileHover', label: t('Cursor tilt', '커서 틸트', 'カーソルチルト') },
      { code: 'useSpring', label: t('Damped easing', '댐핑 이징', 'ダンピングイージング') },
      { code: 'reduced', label: t('Accessible motion', '접근성 모션', 'アクセシブルモーション') },
    ],
    ctaPrimary: t('Copy the prompt', '프롬프트 복사', 'プロンプトをコピー'),
    ctaSecondary: t('Compare other styles', '다른 스타일과 비교', '他のスタイルと比較'),
    statLabel: t('Motion footprint', '모션 풋프린트', 'モーションフットプリント'),
    stats: [
      { value: '18', label: t('motion blocks', '모션 블록', 'モーションブロック') },
      { value: '4', label: t('content lanes', '콘텐츠 레인', 'コンテンツレーン') },
      { value: '< 1ms', label: t('per frame work', '프레임당 작업', 'フレームあたり') },
      { value: '0', label: t('layout shifts', '레이아웃 시프트', 'レイアウトシフト') },
    ],
  },
  bentoLabel: t('Bento Surface', '벤토 서피스', 'ベントサーフェス'),
  bentoTitle: t(
    'A glassmorphic stage for the surface tokens.',
    '서피스 토큰을 위한 글래스모피즘 무대.',
    'サーフェストークンのためのグラスモーフィズム舞台。',
  ),
  bento: [
    {
      icon: '◆',
      title: t('Gradient text', '그라디언트 텍스트', 'グラデーションテキスト'),
      desc: t(
        'Headings use background-clip: text with a violet-to-cyan gradient for that signature modern SaaS look.',
        '제목에 background-clip: text와 보라에서 시안 그라디언트를 적용하여 시그니처 모던 SaaS 룩을 만듭니다.',
        '見出しにbackground-clip: textとバイオレットからシアンのグラデーションを適用し、モダンSaaSの特徴的なルックを作ります。',
      ),
      tag: 'background-clip: text',
    },
    {
      icon: '◾',
      title: t('Border glow', '보더 글로우', 'ボーダーグロウ'),
      desc: t(
        'Cards reveal an animated gradient border on hover using mask-composite for a premium interaction feel.',
        '카드 위로 마우스가 올라오면 mask-composite를 사용한 그라디언트 보더가 나타나 프리미엄 인터랙션 감을 줍니다.',
        'カードにhover時にmask-compositeを使用したグラデーションボーダーが現れ、プレミアムなインタラクション感を演出します。',
      ),
      tag: 'mask-composite',
      hint: t('hover me', '호버하세요', 'ホバーしてください'),
    },
    {
      icon: '★',
      title: t('Spotlight glow', '스포트라이트 글로우', 'スポットライトグロウ'),
      desc: t(
        'A large radial gradient floats behind the hero area, adding depth and drawing the eye to key content.',
        '큰 방사형 그라디언트가 히어로 영역 뒤에 떠올라 깊이를 더하고 핵심 콘텐츠로 시선을 모읍니다.',
        '大きなラジアルグラデーションがヒーローエリアの背後に浮かび、深みを加えて核心コンテンツに視線を集めます。',
      ),
      tag: 'radial-gradient',
    },
    {
      icon: '☰',
      title: t('Animated gradient border', '애니메이션 그라디언트 보더', 'アニメーショングラデーションボーダー'),
      desc: t(
        'A continuously animated border using background-size animation gives elements a living, dynamic edge.',
        'background-size 애니메이션으로 지속적으로 움직이는 보더는 요소에 살아 움직이는 다이내믹한 엣지를 부여합니다.',
        'background-size アニメーションで連続的に動くボーダーが要素に生き生きとしたダイナミックなエッジを与えます。',
      ),
      tag: 'background-size',
      featured: true,
    },
    {
      icon: '❖',
      title: t('Entrance cascade', '진입 캐스케이드', '入場カスケード'),
      desc: t(
        'Elements fade in with staggered delays driven from a single token, instead of per-element hand-tuning.',
        '요소들이 하나의 토큰에서 비롯된 짧은 stagger 지연으로 페이드 인합니다. 요소마다 손으로 잡지 않아도 흐름이 정돈됩니다.',
        '要素は単一のトークンから派生する短いスタガー遅延でフェードインします。要素ごとに手動調整しなくても流れが整います。',
      ),
      tag: 'animation-delay',
    },
    {
      icon: '⋯',
      title: t('Dotted grid + dark surface', '도트 그리드 + 다크 서피스', 'ドットグリッド + ダークサーフェス'),
      desc: t(
        'A subtle repeating dot pattern over a near-black background gives structure without visual noise, while glassmorphic cards float above with soft borders and gentle hover glow.',
        '거의 검은색 배경 위 미세한 반복 도트 패턴이 시각적 노이즈 없이 구조를 잡아주고, 그 위로 글래스모피즘 카드가 부드러운 보더와 은은한 호버 글로우와 함께 떠 있습니다.',
        'ほぼ黒い背景の上の繊細な反復ドットパターンが視覚的ノイズなしに構造を作り、その上にグラスモーフィズムカードが柔らかなボーダーと優しいホバーグロウとともに浮かびます。',
      ),
      tag: 'backdrop-filter',
      wide: true,
    },
  ],
  principles: {
    label: t('Motion Principles', '모션 원리', 'モーション原則'),
    title: t(
      'Motion that earns its presence on the page.',
      '페이지에 존재할 이유가 있는 모션.',
      'ページに存在する理由のあるモーション。',
    ),
    body: t(
      'Each animation does one job — explain a state change, suggest interactivity, or set hierarchy. Decoration without purpose makes a page feel slower, not richer.',
      '모든 애니메이션은 한 가지 일을 합니다. 상태 변화를 설명하거나 인터랙션을 암시하거나 위계를 잡는 일입니다. 목적 없는 장식은 페이지를 풍부하게 만들지 않고 느리게 만듭니다.',
      'すべてのアニメーションは一つの仕事をします。状態の変化を説明する、インタラクションを示唆する、階層を作る、のいずれかです。目的のない装飾はページを豊かにせず、遅く感じさせます。',
    ),
    items: [
      {
        num: '01',
        title: t('Purposeful', '목적이 먼저', '目的が先'),
        desc: t(
          'Animation should explain what changed. If you can remove it without losing meaning, remove it.',
          '애니메이션은 무엇이 바뀌었는지 설명해야 합니다. 빼도 의미가 같다면 빼는 것이 맞습니다.',
          'アニメーションは何が変わったかを説明すべきです。外しても意味が同じなら外す方が正解です。',
        ),
      },
      {
        num: '02',
        title: t('Short travel', '짧은 거리', '短い距離'),
        desc: t(
          '24-48px movement and a quick settle feel more premium than long, flashy travels.',
          '24-48px의 짧은 이동과 빠른 안착이 길고 화려한 이동보다 더 프리미엄하게 느껴집니다.',
          '24-48pxの短い移動と素早い収束は、長く派手な移動より上質に感じます。',
        ),
      },
      {
        num: '03',
        title: t('Single lead', '하나의 주연', '主役は一つ'),
        desc: t(
          'A scene should have one strong motion; everything else supports it without competing.',
          '한 장면에는 강한 모션 하나만 두고 나머지는 경쟁하지 않고 받쳐줍니다.',
          '一場面で強いモーションは一つにし、残りは競わずに支えます。',
        ),
      },
      {
        num: '04',
        title: t('Reduce when asked', '요청 시 절약', '要求があれば抑える'),
        desc: t(
          'useReducedMotion respects user settings. Animations should degrade gracefully to plain opacity changes.',
          'useReducedMotion이 사용자 설정을 존중합니다. 애니메이션은 단순한 페이드로 자연스럽게 낮춰져야 합니다.',
          'useReducedMotionがユーザー設定を尊重します。アニメーションは単純なフェードへ自然にダウングレードします。',
        ),
      },
    ],
  },
  tokens: {
    label: t('Motion Tokens', '모션 토큰', 'モーショントークン'),
    title: t(
      'A handful of tokens keeps a hundred screens consistent.',
      '몇 개의 토큰이 백 개의 화면을 일관되게 유지합니다.',
      'いくつかのトークンが百枚の画面を一貫させます。',
    ),
    body: t(
      'Instead of tuning each animation by hand, lean on five shared tokens. Every entrance, hover, and reveal on this page reads from the same set — that is why the choreography never feels noisy.',
      '애니메이션마다 손으로 조정하지 말고 다섯 개의 공유 토큰에 기대세요. 이 페이지의 모든 진입, 호버, 리빌은 같은 세트에서 값을 가져옵니다. 그래서 안무가 소란스럽지 않습니다.',
      'アニメーションを個別に調整せず、五つの共有トークンに頼ります。このページのすべての入場、ホバー、リビールは同じセットから値を取ります。だから演出が騒がしくなりません。',
    ),
    items: [
      {
        key: 'easing',
        value: 'cubic-bezier(0.22, 1, 0.36, 1)',
        note: t('Hero entrance · CSS-driven', '히어로 진입 · CSS 기반', 'ヒーロー入場 · CSS駆動'),
      },
      {
        key: 'duration',
        value: '0.35s – 0.45s',
        note: t('Fade lengths', '페이드 길이', 'フェードの長さ'),
      },
      {
        key: 'spring',
        value: 'stiffness 220 · damping 22',
        note: t('Cursor tilt · hover lift', '커서 틸트 · 호버 리프트', 'カーソルチルト · ホバーリフト'),
      },
      {
        key: 'stagger',
        value: '0.06s – 0.10s',
        note: t('Hero element sequence', '히어로 요소 시퀀스', 'ヒーロー要素シーケンス'),
      },
      {
        key: 'tilt range',
        value: 'rotateX ±4° · rotateY ±6°',
        note: t('Premium without spinning', '돌리지 않고 프리미엄', '回さずにプレミアム'),
      },
    ],
  },
  cases: {
    label: t('Where it fits', '어디에 어울리는가', 'どこに合うか'),
    title: t(
      'A surface built for premium product pages.',
      '프리미엄 제품 페이지에 어울리는 서피스.',
      'プレミアムプロダクトページに合うサーフェス。',
    ),
    items: [
      {
        num: '01',
        title: t('Marketing landings', '마케팅 랜딩', 'マーケティングランディング'),
        desc: t(
          'Bento grids and gradient headlines pair well with hero badges and scroll-led storytelling on conversion pages.',
          '벤토 그리드와 그라디언트 헤드라인은 히어로 배지, 스크롤 기반 스토리텔링과 함께 컨버전 페이지에 잘 어울립니다.',
          'ベントグリッドとグラデーションヘッドラインは、ヒーローバッジやスクロール起点のストーリーテリングとともにコンバージョンページに合います。',
        ),
      },
      {
        num: '02',
        title: t('Developer tools', '개발자 도구', '開発者ツール'),
        desc: t(
          'Dark surfaces, dotted grids, and monospace pill tags feel native to engineering products and CLI-flavored brands.',
          '다크 서피스, 도트 그리드, 모노스페이스 펄 태그가 엔지니어링 제품과 CLI 무드 브랜드에 자연스럽게 녹아듭니다.',
          'ダークサーフェス、ドットグリッド、モノスペースのピルタグはエンジニアリングプロダクトやCLI調のブランドに自然に馴染みます。',
        ),
      },
      {
        num: '03',
        title: t('AI and SaaS', 'AI와 SaaS', 'AIとSaaS'),
        desc: t(
          'Spring-eased motion gives chatbots and generative tools the premium signature buyers expect from the category leaders.',
          '스프링 이징 모션은 챗봇과 생성 도구에 카테고리 리더에게 기대하는 프리미엄 시그니처를 부여합니다.',
          'スプリングイージングモーションはチャットボットや生成系ツールに、カテゴリリーダーに期待されるプレミアム感を与えます。',
        ),
      },
      {
        num: '04',
        title: t('Portfolio shells', '포트폴리오 셸', 'ポートフォリオシェル'),
        desc: t(
          'Use it as a portfolio frame — the restrained motion keeps individual case studies the lead, not the chrome around them.',
          '포트폴리오 셸로 사용하기 좋습니다. 절제된 모션이 개별 케이스 스터디를 주연으로 두고 주변 크롬은 받쳐 줍니다.',
          'ポートフォリオシェルとして最適です。抑制されたモーションが個々のケーススタディを主役に保ち、周囲は支え役に回ります。',
        ),
      },
    ],
  },
  recipe: {
    label: t('Component Recipe', '컴포넌트 레시피', 'コンポーネントレシピ'),
    title: t(
      'The hover tilt in roughly thirty lines.',
      '호버 틸트, 대략 서른 줄로.',
      'ホバーチルト、およそ30行で。',
    ),
    body: t(
      'Two motion values feed a useTransform pair, then run through useSpring. The card listens to mouse coordinates and lets the spring smooth out the jitter — no requestAnimationFrame, no manual math.',
      '두 개의 motion value가 useTransform 쌍에 들어가고, 그 결과를 useSpring으로 부드럽게 만듭니다. 카드는 마우스 좌표만 받고, 떨림은 스프링이 정리합니다. requestAnimationFrame도 수동 보간도 필요 없습니다.',
      '二つのmotion valueがuseTransformペアに入り、useSpringで滑らかに整えます。カードはマウス座標を受け取るだけで、揺れはスプリングが整理します。requestAnimationFrameも手作業の補間も不要です。',
    ),
    snippet: `const mx = useMotionValue(0);
const my = useMotionValue(0);

const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), {
  stiffness: 220,
  damping: 22,
});
const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), {
  stiffness: 220,
  damping: 22,
});

return (
  <motion.div
    style={{ rotateX, rotateY, transformPerspective: 900 }}
    onMouseMove={(event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      mx.set((event.clientX - rect.left) / rect.width - 0.5);
      my.set((event.clientY - rect.top) / rect.height - 0.5);
    }}
    onMouseLeave={() => { mx.set(0); my.set(0); }}
  >
    ...
  </motion.div>
);`,
  },
  promptHeading: t('AI Request Prompt', 'AI 요청 프롬프트', 'AIリクエストプロンプト'),
  promptBody: t(
    'Paste this prompt into Claude or ChatGPT to regenerate the page with the same constraints.',
    '이 프롬프트를 Claude나 ChatGPT에 붙여 넣으면 같은 제약 조건으로 페이지를 재생성할 수 있습니다.',
    'このプロンプトをClaudeまたはChatGPTに貼り付ければ、同じ制約条件でページを再生成できます。',
  ),
  copyPrompt: t('Copy Prompt', '프롬프트 복사', 'プロンプトをコピー'),
};

const PROMPT_TEXT: Record<Lang, string> = {
  en: `Design a landing page in Framer Motion style — dark, motion-centric SaaS aesthetic inspired by Framer, Linear, and Vercel.

COLOR TOKENS:
--bg: #09090b
--surface: rgba(255, 255, 255, 0.05)
--text: #fafafa
--text-muted: #a1a1aa
--border: rgba(255, 255, 255, 0.1)
--accent: #8b5cf6 (violet)
--accent-2: #06b6d4 (cyan)
All surfaces use rgba white overlays on the dark base.

TYPOGRAPHY:
- Heading: "Plus Jakarta Sans" 700-800
- Body: "Inter" 400-500, 15px
- Code accents: "JetBrains Mono"
- Hero title: clamp(2.2rem, 6vw, 4rem), gradient via background-clip: text

MOTION (restrained, flicker-free):
- Hero entrance: CSS-driven opacity stagger (badge → h1 → lead → pills → CTA → stats), 0.4s ease-out, 0.06s steps. No transform on entry to avoid layout shift.
- Bento card hover: motion/react useTransform on mouse coords → useSpring (220/22) on rotateX/rotateY. whileHover y: -4 lift.
- No whileInView, no scroll-linked transforms, no continuous CSS shimmer.
- Floating orbs: pure CSS keyframe loop.
- useReducedMotion fallback to no transform.

CONTENT SECTIONS:
1. Hero (badge, gradient h1, lead, pill tags, CTAs, stats row)
2. Bento grid (6 cards, one featured spanning 2, one summary spanning 3)
3. Motion principles (4 numbered cards)
4. Motion tokens (5 token rows with key / value / note)
5. Use cases (4 numbered cards)
6. Component recipe (intro + code block showing the hover tilt)
7. AI prompt block with copy button

LAYOUT:
- Container min(1100px, 92vw), padding 28px 0 100px.
- Bento: 3 columns desktop, 2 tablet, 1 mobile.

FORBIDDEN:
- Entrance transforms (translateY, scale) that cause layout shift on mount.
- Continuous CSS keyframes on type (no text shimmer).
- whileInView triggers for entrance.
- Light backgrounds.
- Border-radius below 16px on cards.
- Heavy drop shadows (use glow box-shadow).
- More than 2 accent colors.`,
  ko: `Framer Motion 스타일의 랜딩 페이지를 디자인해줘 — Framer, Linear, Vercel에서 영감 받은 다크 모션 중심 SaaS 미학.

색상 토큰:
--bg: #09090b
--surface: rgba(255, 255, 255, 0.05)
--text: #fafafa
--text-muted: #a1a1aa
--border: rgba(255, 255, 255, 0.1)
--accent: #8b5cf6 (바이올렛)
--accent-2: #06b6d4 (시안)
모든 서피스는 다크 베이스 위 rgba 화이트 오버레이.

타이포그래피:
- 제목: "Plus Jakarta Sans" 700-800
- 본문: "Inter" 400-500, 15px
- 코드 액센트: "JetBrains Mono"
- 히어로 타이틀: clamp(2.2rem, 6vw, 4rem), background-clip: text로 그라디언트.

모션 (절제, 플리커 없음):
- 히어로 진입: CSS 기반 opacity 순차 (배지 → h1 → 리드 → 펄 → CTA → 스탯), 0.4s ease-out, 0.06s 간격. 진입 시 transform 변화 없음 (layout shift 회피).
- 벤토 카드 호버: motion/react의 useTransform + useSpring(220/22)을 rotateX/rotateY에 적용. whileHover y: -4 리프트.
- whileInView·스크롤 트랜스폼·텍스트 시머 없음.
- 플로팅 오브: 순수 CSS 키프레임 루프.
- useReducedMotion 시 transform 제거 폴백.

콘텐츠 섹션:
1. 히어로 (배지, 그라디언트 h1, 리드, 펄 태그, CTA, 스탯 행)
2. 벤토 그리드 (6 카드, 피처드 2열, 요약 3열)
3. 모션 원리 (4 카드)
4. 모션 토큰 (5 토큰 행: key / value / note)
5. 사용 예 (4 카드)
6. 컴포넌트 레시피 (호버 틸트 코드 블록 + 설명)
7. AI 프롬프트 블록 + 복사 버튼

레이아웃:
- 컨테이너 min(1100px, 92vw), padding 28px 0 100px.
- 벤토: 데스크톱 3열, 태블릿 2열, 모바일 1열.

금지:
- 진입 시 translateY·scale 등의 transform (layout shift 유발).
- 텍스트에 무한 키프레임 (텍스트 시머 금지).
- 진입 트리거로 whileInView 사용.
- 밝은 배경.
- 카드 border-radius 16px 미만.
- 무거운 드롭 섀도우 (글로우 box-shadow 사용).
- 2개 초과 액센트 컬러.`,
  ja: `Framer Motionスタイルのランディングページをデザインしてください — Framer、Linear、Vercelからインスピレーションを得たダーク・モーション中心のSaaS美学。

カラートークン:
--bg: #09090b
--surface: rgba(255, 255, 255, 0.05)
--text: #fafafa
--text-muted: #a1a1aa
--border: rgba(255, 255, 255, 0.1)
--accent: #8b5cf6（バイオレット）
--accent-2: #06b6d4（シアン）
すべてのサーフェスはダークベース上のrgbaホワイトオーバーレイ。

タイポグラフィ:
- 見出し: "Plus Jakarta Sans" 700-800
- 本文: "Inter" 400-500, 15px
- コードアクセント: "JetBrains Mono"
- ヒーロータイトル: clamp(2.2rem, 6vw, 4rem), background-clip: textでグラデーション。

モーション（抑制・フリッカーなし）:
- ヒーロー入場: CSS駆動のopacity順次（バッジ → h1 → リード → ピル → CTA → スタッツ）、0.4s ease-out、0.06sステップ。入場時transform変化なし（レイアウトシフト回避）。
- ベントカードホバー: motion/reactのuseTransform + useSpring(220/22) を rotateX/rotateY に適用。whileHover y: -4 リフト。
- whileInView、スクロール連動transform、テキストシマー無し。
- フローティングオーブ: 純粋なCSSキーフレームのループ。
- useReducedMotion時はtransform除去フォールバック。

コンテンツセクション:
1. ヒーロー（バッジ、グラデーションh1、リード、ピルタグ、CTA、スタッツ行）
2. ベントグリッド（6カード、フィーチャード2列、サマリー3列）
3. モーション原則（4カード）
4. モーショントークン（5トークン行: key / value / note）
5. ユースケース（4カード）
6. コンポーネントレシピ（ホバーチルトのコードブロックと説明）
7. AIプロンプトブロック + コピーボタン

レイアウト:
- コンテナ min(1100px, 92vw), padding 28px 0 100px。
- ベント: デスクトップ3列、タブレット2列、モバイル1列。

禁止:
- 入場時のtranslateY・scaleなどのtransform（レイアウトシフト誘発）。
- テキストへの無限キーフレーム（テキストシマー禁止）。
- 入場トリガとしてのwhileInView使用。
- 明るい背景。
- カードborder-radius 16px未満。
- 重いドロップシャドウ（グロウbox-shadowを使用）。
- アクセント色2色超え。`,
};

export function PortedFramerMotionPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  const bento = COPY.bento;

  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--framer-motion">
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Hub</span>
        </a>

        <div className="dot-grid" />
        <div className="spotlight" />

        <main className="shell">
          <a className="skip-link" href="#main-content" data-i18n="skip">Skip to content</a>
          <nav className="site-nav" role="navigation" aria-label="Main navigation">
            <div className="site-nav__inner">
              <a className="site-nav__logo" href="/">Web Stylebook</a>
              <ul className="site-nav__links">
                <li><a href="/#styles" data-i18n="nav.styles">Styles</a></li>
                <li><a href="/pages/compare" data-i18n="nav.compare">Compare</a></li>
                <li><a href="/pages/color-system" data-i18n="nav.tips">Colors</a></li>
                <li><a href="/pages/prompt-workflow" data-i18n="nav.workflow">Prompt Builder</a></li>
                <li><a href="/pages/prompt-tips" data-i18n="nav.more-tips">Tips</a></li>
              </ul>
              <div className="nav-actions">
                <button className="nav-burger" id="nav-burger" aria-label="Toggle menu" aria-expanded="false">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1={3} y1={6} x2={21} y2={6} />
                    <line x1={3} y1={12} x2={21} y2={12} />
                    <line x1={3} y1={18} x2={21} y2={18} />
                  </svg>
                </button>
                <div className="lang-dropdown" id="lang-dropdown">
                  <button className="lang-toggle" id="lang-toggle" data-i18n-aria="lang.toggle.aria" aria-label="Switch language">English</button>
                  <ul className="lang-menu" role="menu">
                    <li><button role="menuitem" data-lang-select="en">English</button></li>
                    <li><button role="menuitem" data-lang-select="ko">한국어</button></li>
                    <li><button role="menuitem" data-lang-select="ja">日本語</button></li>
                  </ul>
                </div>
                <button className="theme-toggle" id="global-theme-reset" aria-label="Reset Global Theme" data-color="Reset Global Theme" title="Reset Global Theme">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>

          <section className="hero" id="main-content" style={{ position: 'relative' }}>
            <div className="floating-orb floating-orb--1" />
            <div className="floating-orb floating-orb--2" />
            <div className="floating-orb floating-orb--3" />
            <div className="floating-orb floating-orb--4" />

            <div className="hero-badge fm-fade fm-fade-1">
              <span className="hero-badge-dot" />
              {pick(COPY.hero.badge, lang)}
            </div>

            <h1 className="fm-fade fm-fade-2">
              <span>{pick(COPY.hero.titleLineA, lang)}</span>
              <br />
              <span className="gradient-text">{pick(COPY.hero.titleAccent, lang)}</span>
            </h1>

            <p className="hero-lead fm-fade fm-fade-3">{pick(COPY.hero.lead, lang)}</p>

            <div className="hero-pills fm-fade fm-fade-4">
              {COPY.hero.pills.map((pill, idx) => (
                <span className="hero-pill" key={idx}>
                  <code>{pill.code}</code> {pick(pill.label, lang)}
                </span>
              ))}
            </div>

            <div className="hero-actions fm-fade fm-fade-5">
              <motion.a
                className="hero-cta hero-cta--primary"
                href="#fm-prompt"
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={ctaSpring}
              >
                {pick(COPY.hero.ctaPrimary, lang)}
              </motion.a>
              <motion.a
                className="hero-cta hero-cta--ghost"
                href="/pages/compare"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={ctaSpring}
              >
                {pick(COPY.hero.ctaSecondary, lang)}
              </motion.a>
            </div>

            <div className="hero-stats fm-fade fm-fade-6">
              <span className="hero-stats__label">{pick(COPY.hero.statLabel, lang)}</span>
              <div className="hero-stats__row">
                {COPY.hero.stats.map((stat, idx) => (
                  <motion.div
                    className="hero-stats__cell"
                    key={idx}
                    whileHover={{ y: -3 }}
                    transition={ctaSpring}
                  >
                    <strong>{stat.value}</strong>
                    <span>{pick(stat.label, lang)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="fm-section" aria-labelledby="fm-bento-heading">
            <motion.div
              className="fm-section-head"
              initial="hidden"
              whileInView="show"
              viewport={REVEAL_VIEWPORT}
              variants={headReveal}
            >
              <p className="fm-eyebrow">{pick(COPY.bentoLabel, lang)}</p>
              <h2 id="fm-bento-heading">{pick(COPY.bentoTitle, lang)}</h2>
            </motion.div>
            <motion.div
              className="bento"
              initial="hidden"
              whileInView="show"
              viewport={REVEAL_VIEWPORT}
              variants={staggerParent}
            >
              {bento.map((card, idx) => (
                <BentoCard
                  key={idx}
                  variants={riseChild}
                  className={[card.featured ? 'featured' : '', card.wide ? 'wide' : ''].filter(Boolean).join(' ')}
                >
                  <div className="card-icon">{card.icon}</div>
                  <div className="card-title">{pick(card.title, lang)}</div>
                  <p className="card-desc">{pick(card.desc, lang)}</p>
                  {card.tag && <span className="card-tag">{card.tag}</span>}
                  {card.hint && <span className="hover-hint">{pick(card.hint, lang)}</span>}
                  {card.featured && (
                    <div className="gradient-border-demo">
                      <div className="gradient-border-demo-inner">border animation preview</div>
                    </div>
                  )}
                </BentoCard>
              ))}
            </motion.div>
          </section>

          <section className="fm-section" aria-labelledby="fm-principles-heading">
            <motion.div
              className="fm-section-head"
              initial="hidden"
              whileInView="show"
              viewport={REVEAL_VIEWPORT}
              variants={headReveal}
            >
              <p className="fm-eyebrow">{pick(COPY.principles.label, lang)}</p>
              <h2 id="fm-principles-heading">{pick(COPY.principles.title, lang)}</h2>
              <p className="fm-section-body">{pick(COPY.principles.body, lang)}</p>
            </motion.div>
            <motion.div
              className="fm-grid-4"
              initial="hidden"
              whileInView="show"
              viewport={REVEAL_VIEWPORT}
              variants={staggerParent}
            >
              {COPY.principles.items.map((item, idx) => (
                <motion.article
                  key={idx}
                  className="fm-card"
                  variants={riseChild}
                  whileHover={{ y: -4 }}
                  transition={ctaSpring}
                >
                  <div className="fm-card-num">{item.num}</div>
                  <div className="fm-card-title">{pick(item.title, lang)}</div>
                  <p className="fm-card-desc">{pick(item.desc, lang)}</p>
                </motion.article>
              ))}
            </motion.div>
          </section>

          <section className="fm-section" aria-labelledby="fm-tokens-heading">
            <motion.div
              className="fm-section-head"
              initial="hidden"
              whileInView="show"
              viewport={REVEAL_VIEWPORT}
              variants={headReveal}
            >
              <p className="fm-eyebrow">{pick(COPY.tokens.label, lang)}</p>
              <h2 id="fm-tokens-heading">{pick(COPY.tokens.title, lang)}</h2>
              <p className="fm-section-body">{pick(COPY.tokens.body, lang)}</p>
            </motion.div>
            <motion.div
              className="fm-tokens"
              initial="hidden"
              whileInView="show"
              viewport={REVEAL_VIEWPORT}
              variants={staggerParent}
            >
              {COPY.tokens.items.map((row, idx) => (
                <motion.div className="fm-token-row" key={idx} variants={slideChild}>
                  <span className="fm-token-key">{row.key}</span>
                  <span className="fm-token-value">{row.value}</span>
                  <span className="fm-token-note">{pick(row.note, lang)}</span>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <section className="fm-section" aria-labelledby="fm-cases-heading">
            <motion.div
              className="fm-section-head"
              initial="hidden"
              whileInView="show"
              viewport={REVEAL_VIEWPORT}
              variants={headReveal}
            >
              <p className="fm-eyebrow">{pick(COPY.cases.label, lang)}</p>
              <h2 id="fm-cases-heading">{pick(COPY.cases.title, lang)}</h2>
            </motion.div>
            <motion.div
              className="fm-grid-4"
              initial="hidden"
              whileInView="show"
              viewport={REVEAL_VIEWPORT}
              variants={staggerParent}
            >
              {COPY.cases.items.map((item, idx) => (
                <motion.article
                  key={idx}
                  className="fm-card"
                  variants={riseChild}
                  whileHover={{ y: -4 }}
                  transition={ctaSpring}
                >
                  <div className="fm-card-num">{item.num}</div>
                  <div className="fm-card-title">{pick(item.title, lang)}</div>
                  <p className="fm-card-desc">{pick(item.desc, lang)}</p>
                </motion.article>
              ))}
            </motion.div>
          </section>

          <section className="fm-section" aria-labelledby="fm-recipe-heading">
            <motion.div
              className="fm-section-head"
              initial="hidden"
              whileInView="show"
              viewport={REVEAL_VIEWPORT}
              variants={headReveal}
            >
              <p className="fm-eyebrow">{pick(COPY.recipe.label, lang)}</p>
              <h2 id="fm-recipe-heading">{pick(COPY.recipe.title, lang)}</h2>
              <p className="fm-section-body">{pick(COPY.recipe.body, lang)}</p>
            </motion.div>
            <motion.div
              className="fm-recipe"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={REVEAL_VIEWPORT}
              transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.08 }}
            >
              <pre className="fm-recipe__code">{COPY.recipe.snippet}</pre>
            </motion.div>
          </section>

          <motion.section
            className="prompt"
            id="fm-prompt"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            <h2>{pick(COPY.promptHeading, lang)}</h2>
            <p className="prompt-body">{pick(COPY.promptBody, lang)}</p>
            <pre>{PROMPT_TEXT[lang] ?? PROMPT_TEXT.en}</pre>
            <motion.button
              type="button"
              data-copy-prompt
              onClick={handleCopyPrompt}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={ctaSpring}
            >
              {pick(COPY.copyPrompt, lang)}
            </motion.button>
          </motion.section>
        </main>

        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션">
          <a href="/pages/mesh-gradient.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span><span className="page-nav__label">이전</span>Mesh Gradient</span>
          </a>
          <div className="page-nav__divider" />
          <a href="/pages/claymorphism.html">
            <span><span className="page-nav__label">다음</span>Claymorphism</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  );
}
