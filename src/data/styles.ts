export type Lang = 'en' | 'ko' | 'ja';
export type LocalizedText = Record<Lang, string>;
export type StyleKind = 'style' | 'fusion';

export interface SeoInfo {
  title: LocalizedText;
  description: LocalizedText;
}

export interface PromptProfile {
  typography: string;
  layout: string;
  motion: string;
  bestFor: string[];
  constraints: string[];
  notIdealFor: string[];
}

export interface VisualProfile {
  headline: string;
  surface: string;
  rhythm: string;
}

export interface StyleData {
  id: string;
  kind: StyleKind;
  route: string;
  createdAt: string;
  tags: string[];
  palette: string[];
  accent: string;
  name: LocalizedText;
  description: LocalizedText;
  summary: LocalizedText;
  seo: SeoInfo;
  promptProfile: PromptProfile;
  visualProfile: VisualProfile;
  fusionOf?: string[];
}

interface StyleTimeline {
  createdAt: string;
}

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

// Keep latest sorting data-driven. Update this when a style page is added or
// when a more accurate historical creation date is backfilled.
const styleTimeline: Record<string, StyleTimeline> = {
  'brutalist-grid': { createdAt: '2026-03-05T11:20:25+09:00' },
  'editorial-silence': { createdAt: '2026-03-05T11:20:25+09:00' },
  'kinetic-pop': { createdAt: '2026-03-05T11:20:25+09:00' },
  'cyberpunk-glitch': { createdAt: '2026-03-05T11:20:25+09:00' },
  'swiss-poster': { createdAt: '2026-03-05T11:20:25+09:00' },
  'holographic-fluid': { createdAt: '2026-03-05T11:20:25+09:00' },
  'neon-drift': { createdAt: '2026-03-05T11:20:25+09:00' },
  'glass-orbit': { createdAt: '2026-03-05T11:20:25+09:00' },
  'terminal-core': { createdAt: '2026-03-05T11:20:25+09:00' },
  'midnight-noir': { createdAt: '2026-03-05T11:20:25+09:00' },
  'console-launch': { createdAt: '2026-03-05T11:20:25+09:00' },
  'bento-bloom': { createdAt: '2026-03-05T11:20:25+09:00' },
  'earth-atelier': { createdAt: '2026-03-05T11:20:25+09:00' },
  'liquid-metal': { createdAt: '2026-03-05T11:20:25+09:00' },
  'aurora-gradient': { createdAt: '2026-03-05T11:20:25+09:00' },
  'zen-minimalism': { createdAt: '2026-03-05T11:20:25+09:00' },
  'mono-type': { createdAt: '2026-03-05T11:20:25+09:00' },
  'mesh-gradient': { createdAt: '2026-03-05T11:20:25+09:00' },
  'claymorphism': { createdAt: '2026-03-05T11:20:25+09:00' },
  'neumorphism': { createdAt: '2026-03-05T11:20:25+09:00' },
  'soft-pastel': { createdAt: '2026-03-05T11:20:25+09:00' },
  'y2k-retro': { createdAt: '2026-03-05T11:20:25+09:00' },
  'fusion-neon-swiss': { createdAt: '2026-03-05T11:20:25+09:00' },
  'fusion-bento-noir': { createdAt: '2026-03-05T11:20:25+09:00' },
  'fusion-editorial-terminal': { createdAt: '2026-03-05T11:20:25+09:00' },
  'fusion-holo-glass': { createdAt: '2026-03-05T11:20:25+09:00' },
  'fusion-earth-zen': { createdAt: '2026-03-05T11:20:25+09:00' },
  'fusion-kinetic-brutal': { createdAt: '2026-03-05T11:20:25+09:00' },
  'fusion-cyber-console': { createdAt: '2026-03-05T11:20:25+09:00' },
  'duotone-bold': { createdAt: '2026-03-05T17:58:54+09:00' },
  'framer-motion': { createdAt: '2026-03-05T17:58:54+09:00' },
  'notion-style': { createdAt: '2026-03-05T17:58:54+09:00' },
  'retro-pixel': { createdAt: '2026-03-05T17:58:54+09:00' },
  'risograph-print': { createdAt: '2026-03-07T00:33:37+09:00' },
  'paper-cut': { createdAt: '2026-03-07T00:33:37+09:00' },
  'fusion-grain-mono': { createdAt: '2026-03-07T00:33:37+09:00' },
  'fusion-clay-aurora': { createdAt: '2026-03-07T00:33:37+09:00' },
  'quiet-utility': { createdAt: '2026-04-18T09:05:06+09:00' },
  'platform-core': { createdAt: '2026-04-18T09:05:06+09:00' },
  'runtime-signal': { createdAt: '2026-04-18T09:05:06+09:00' },
  'macos-liquid-glass': { createdAt: '2026-05-14T00:00:00+09:00' },
  'fusion-product-swiss': { createdAt: '2026-05-14T00:00:00+09:00' },
};

const timelineFor = (id: string): StyleTimeline => {
  const timeline = styleTimeline[id];
  if (!timeline) throw new Error(`Missing style timeline metadata: ${id}`);
  return timeline;
};

const seo = (name: string, description: LocalizedText): SeoInfo => ({
  title: t(
    `${name} - Web Stylebook`,
    `${name} - Web Stylebook`,
    `${name} - Web Stylebook`,
  ),
  description,
});

const detail = (
  id: string,
  kind: StyleKind,
  name: string,
  tags: string[],
  palette: string[],
  accent: string,
  description: LocalizedText,
  summary: LocalizedText,
  promptProfile: PromptProfile,
  visualProfile: VisualProfile,
  fusionOf?: string[],
): StyleData => ({
  id,
  kind,
  route: `/pages/${id}`,
  ...timelineFor(id),
  tags,
  palette,
  accent,
  name: t(name, name, name),
  description,
  summary,
  seo: seo(name, description),
  promptProfile,
  visualProfile,
  fusionOf,
});

const prompt = (
  typography: string,
  layout: string,
  motion: string,
  bestFor: string[],
  constraints: string[],
  notIdealFor: string[],
): PromptProfile => ({ typography, layout, motion, bestFor, constraints, notIdealFor });

const visual = (headline: string, surface: string, rhythm: string): VisualProfile => ({
  headline,
  surface,
  rhythm,
});

export const styleCatalog: StyleData[] = [
  detail(
    'brutalist-grid',
    'style',
    'Brutalist Grid',
    ['bold', 'minimal', 'grid'],
    ['#ffffff', '#000000', '#ff3b30', '#333333'],
    '#111111',
    t(
      'Raw, heavy lines and structural typographic block system.',
      '굵고 투박한 선, 구조적인 타이포 블록 시스템.',
      '太い線と構造的なタイポグラフィブロックで組む生々しいスタイル。',
    ),
    t(
      'High-contrast boxes, unforgiving alignment, and visible structure for products that need attitude.',
      '고대비 박스, 타협 없는 정렬, 노출된 구조로 강한 태도가 필요한 제품에 어울립니다.',
      '高コントラストの箱、厳密な整列、見える構造で強い姿勢を出します。',
    ),
    prompt('Mono or compressed grotesk, large weight jumps', 'Hard grid, thick rules, block sections', 'Minimal snaps and abrupt hover shifts', ['developer tools', 'manifestos', 'launch pages'], ['No soft shadows', 'No decorative gradients'], ['healthcare', 'children products', 'wellness apps', 'finance trust products']),
    visual('uppercase blocks', 'white panels with black rules', 'strict modular grid'),
  ),
  detail(
    'editorial-silence',
    'style',
    'Editorial Silence',
    ['light', 'minimal', 'editorial'],
    ['#f8f8f8', '#ffffff', '#52525b', '#d4d4d4'],
    '#52525b',
    t(
      'Restrained elegance with magazine typography and generous whitespace.',
      '잡지형 타이포그래피와 여백을 살린 절제미.',
      '雑誌のようなタイポグラフィと余白を活かした静かな上質感。',
    ),
    t(
      'A calm editorial system where hierarchy comes from type scale, measure, and deliberate silence.',
      '타입 스케일, 문장 폭, 의도적인 침묵으로 위계를 만드는 차분한 에디토리얼 시스템입니다.',
      '文字サイズ、行幅、意図した余白で階層を作る静かな編集的システムです。',
    ),
    prompt('Serif headline with quiet sans body', 'Single-column reading flow with wide margins', 'Subtle fade and underline transitions', ['essays', 'portfolios', 'premium docs'], ['No icon grids', 'No saturated accents'], ['gaming launches', 'flash commerce', 'developer dashboards', 'high-energy campaigns']),
    visual('serif rhythm', 'paper-white surface', 'long-form spacing'),
  ),
  detail(
    'kinetic-pop',
    'style',
    'Kinetic Pop',
    ['bold', 'color', 'motion'],
    ['#ff3b30', '#ffcc00', '#ff9500', '#1a1a1a'],
    '#ff3b30',
    t(
      'Bold color contrast and rhythm-driven motion design.',
      '강렬한 컬러 대비와 리듬감 있는 모션 중심.',
      '強い色の対比とリズム感のある動きが中心のデザイン。',
    ),
    t(
      'Posters, oversized labels, and punched-up actions for pages that should feel loud and immediate.',
      '포스터, 큰 라벨, 강한 액션으로 즉각적이고 큰 에너지가 필요한 페이지에 맞습니다.',
      'ポスター的な大きなラベルと強いアクションで即時性を出します。',
    ),
    prompt('Heavy geometric sans with compressed labels', 'Asymmetric cards and oversized calls to action', 'Springy hover, staggered entrances', ['campaigns', 'events', 'creator products'], ['No muted monochrome', 'Avoid timid spacing'], ['B2B operational dashboards', 'enterprise admin', 'financial reporting', 'medical or legal products']),
    visual('oversized display type', 'primary color surfaces', 'staggered pop rhythm'),
  ),
  detail(
    'cyberpunk-glitch',
    'style',
    'Cyberpunk Glitch',
    ['dark', 'bold', 'tech'],
    ['#22d3ee', '#d946ef', '#ff007f', '#0a0a1a'],
    '#22d3ee',
    t(
      'Neon contrast, monospace, and glitch-infused terminal look.',
      '네온 대비와 모노스페이스, 글리치가 결합된 터미널 룩.',
      'ネオンの対比、等幅文字、グリッチを組み合わせた端末的な見た目。',
    ),
    t(
      'A high-voltage interface language for security, gaming, and speculative products.',
      '보안, 게임, 미래형 제품에 맞는 고전압 인터페이스 언어입니다.',
      'セキュリティ、ゲーム、未来的な製品に合う高電圧のUI言語です。',
    ),
    prompt('Mono labels with neon display headlines', 'Layered dark panels and scanline dividers', 'Glitch flicker, cursor blinks, sharp hovers', ['security products', 'game launchers', 'crypto tools'], ['Do not overuse blur', 'Keep text contrast high'], ['healthcare apps', 'financial trust products', 'children products', 'editorial publications']),
    visual('neon terminal type', 'dark glass panels', 'glitch pulses'),
  ),
  detail(
    'swiss-poster',
    'style',
    'Swiss Poster',
    ['bold', 'minimal', 'grid'],
    ['#ff3b30', '#000000', '#ffffff', '#333333'],
    '#ff3b30',
    t(
      'Grid-system and alignment-focused informational style.',
      '격자 시스템과 정렬 중심의 정보 지향적 스타일.',
      'グリッドと整列を中心にした情報志向のスタイル。',
    ),
    t(
      'International Typographic Style translated into a product page: precise, lean, and confident.',
      '국제 타이포그래픽 스타일을 제품 페이지로 옮긴 정확하고 군더더기 없는 방향입니다.',
      '国際タイポグラフィ様式をプロダクトページに移した正確で無駄のない方向です。',
    ),
    prompt('Neo-grotesk sans, strict type scale', '12-column grid, hard alignment, red markers', 'Almost static, purposeful state changes only', ['information products', 'guides', 'architecture studios'], ['No centered paragraphs', 'No random decoration'], ['casual consumer apps', 'playful onboarding', 'gaming UI', 'illustrative storytelling']),
    visual('grid-first type', 'flat white canvas', 'poster-like rhythm'),
  ),
  detail(
    'quiet-utility',
    'style',
    'Quiet Utility',
    ['light', 'minimal', 'tech', 'product'],
    ['#ffffff', '#edf2f4', '#1f2328', '#526371'],
    '#526371',
    t(
      'Calm operations software style with a white canvas, slate-tinted surfaces, restrained type, and precise spacing.',
      '흰 캔버스와 옅은 슬레이트 패널, 절제된 타이포, 정교한 간격으로 만든 차분한 실무형 SaaS 스타일.',
      '白いキャンバス、淡いスレート面、抑えた書体、精密な余白の業務向けSaaSスタイル。',
    ),
    t(
      'A practical product interface that favors scanning, repeated work, and trust over spectacle.',
      '화려함보다 스캔성, 반복 업무, 신뢰를 우선하는 실무형 제품 인터페이스입니다.',
      '派手さよりも一覧性、反復作業、信頼を重視する実務的なUIです。',
    ),
    prompt('Readable sans, compact labels, clear weights', 'Dense but breathable dashboards and forms', 'Fast restrained transitions', ['B2B SaaS', 'ops dashboards', 'admin tools'], ['No oversized hero cards', 'No decorative illustration'], ['consumer marketing pages', 'creator launches', 'campaign sites', 'gaming and entertainment']),
    visual('compact work type', 'white and slate panels', 'steady operational cadence'),
  ),
  detail(
    'platform-core',
    'style',
    'Platform Core',
    ['dark', 'light', 'tech', 'product', 'minimal'],
    ['#101010', '#fafafa', '#f4f4f4', '#d7d1c6'],
    '#171717',
    t(
      'Real-service platform style with dual dark/light themes, centered auth flows, and restrained documentation cards.',
      '다크와 라이트가 모두 정제된 실제 서비스형 플랫폼 스타일. 중앙 인증 플로우와 절제된 문서 카드가 핵심입니다.',
      'ダーク/ライト両対応の実サービス型プラットフォームスタイル。',
    ),
    t(
      'A developer-platform surface that looks deployable: auth, docs, billing, and product primitives feel aligned.',
      '인증, 문서, 결제, 제품 기본 요소가 실제 배포 가능한 플랫폼처럼 정렬됩니다.',
      '認証、ドキュメント、課金、製品要素が実運用の平台として揃います。',
    ),
    prompt('Neutral sans with documentation mono accents', 'Centered flows plus thin-line resource cards', 'Small fades and focus states', ['developer platforms', 'SaaS onboarding', 'API products'], ['Avoid novelty styling', 'Keep contrast policy strict'], ['playful consumer products', 'lifestyle apps', 'editorial publications', 'art portfolios']),
    visual('platform headline', 'dual-theme cards', 'documentation cadence'),
  ),
  detail(
    'runtime-signal',
    'style',
    'Runtime Signal',
    ['dark', 'grid', 'developer', 'runtime', 'minimal'],
    ['#0b0b0c', '#101113', '#74c2b4', '#b89663'],
    '#74c2b4',
    t(
      'Dark technical reference style with faint grid lines, crisp grotesk type, mono utility labels, and restrained mineral-teal accents.',
      '희미한 그리드 라인, 선명한 그로테스크 타이포, 모노 유틸리티 라벨, 절제된 미네랄 틸 포인트가 있는 다크 기술 레퍼런스 스타일.',
      '淡いグリッド、鋭いグロテスク書体、等幅ラベル、ミネラルティールの技術リファレンス。',
    ),
    t(
      'Feels like a runtime dashboard and a reference manual in one surface.',
      '런타임 대시보드와 레퍼런스 매뉴얼이 한 화면에 결합된 느낌입니다.',
      'ランタイムダッシュボードとリファレンスマニュアルを一体化した印象です。',
    ),
    prompt('Crisp grotesk headings and mono metadata', 'Dark reference panels with faint grid lines', 'Precise status transitions and counters', ['observability', 'infra dashboards', 'technical docs'], ['No glow overload', 'No low-contrast code'], ['consumer marketing', 'lifestyle apps', 'storytelling pages', 'children or education products']),
    visual('technical heading', 'grid-dark panels', 'status signal rhythm'),
  ),
  detail(
    'holographic-fluid',
    'style',
    'Holographic Fluid',
    ['bold', 'tech', 'gradient'],
    ['#ff7eb3', '#00f2fe', '#a855f7', '#1a1a2e'],
    '#ff7eb3',
    t(
      'Holographic mesh gradients with dreamy fluid motion.',
      '홀로그래픽 매시 그라데이션과 몽환적인 유체 모션.',
      'ホログラフィックなメッシュグラデーションと夢のような流体モーション。',
    ),
    t(
      'Iridescent surfaces and soft spatial depth for experimental premium experiences.',
      '무지갯빛 표면과 부드러운 공간 깊이로 실험적인 프리미엄 경험을 만듭니다.',
      '虹色の面と柔らかな奥行きで実験的なプレミアム体験を作ります。',
    ),
    prompt('Rounded sans over luminous headings', 'Layered gradient mesh with translucent panels', 'Slow fluid shifts and hover refractions', ['AI tools', 'creative portfolios', 'premium launches'], ['Keep text on solid overlays', 'Respect reduced motion'], ['enterprise admin', 'financial dashboards', 'documentation sites', 'high-density data tools']),
    visual('luminous gradient type', 'fluid translucent layers', 'slow shimmer cadence'),
  ),
  detail(
    'neon-drift',
    'style',
    'Neon Drift',
    ['dark', 'bold', 'tech'],
    ['#00ffff', '#00aaff', '#a855f7', '#1a1a2e'],
    '#00ffff',
    t(
      'Dynamic neon glow style inspired by night cityscapes.',
      '야간 도시, 네온, 글로우 중심의 역동적 스타일.',
      '夜の都市、ネオン、グローを中心にした動的なスタイル。',
    ),
    t(
      'A nightlife-inspired SaaS and creator surface with luminous edges and fast perceived energy.',
      '빛나는 엣지와 빠른 에너지를 가진 나이트 시티 감성의 SaaS/크리에이터 표면입니다.',
      '光るエッジと速いエネルギーを持つ夜景的なSaaS/クリエイターUIです。',
    ),
    prompt('Italic display accents with clean sans body', 'Dark panels, light trails, neon borders', 'Glow hovers and delayed card reveals', ['music tools', 'AI launches', 'creative apps'], ['Do not bury copy in glow', 'Limit accent count'], ['enterprise B2B', 'healthcare', 'legal or financial trust products', 'editorial long-form']),
    visual('glowing display type', 'dark neon surfaces', 'drifting reveal rhythm'),
  ),
  detail(
    'glass-orbit',
    'style',
    'Glass Orbit',
    ['minimal', 'tech', 'glass'],
    ['#0e1a2e', '#257bff', '#eff8ff', '#ffffff'],
    '#257bff',
    t(
      'Layered transparent panels with 3D depth glassmorphism.',
      '투명 레이어 중첩과 깊이감을 살린 3D 배경 글래스모피즘.',
      '透明レイヤーの重なりと奥行きを活かしたグラスモーフィズム。',
    ),
    t(
      'Orbital glass panels for interfaces that need depth without losing a clean product feel.',
      '깨끗한 제품 감각을 잃지 않으면서 깊이감이 필요한 인터페이스용 오비탈 글래스 패널입니다.',
      'クリーンさを保ちながら奥行きを出す軌道的なガラスUIです。',
    ),
    prompt('Soft sans with light numeric labels', 'Glass cards over controlled spatial gradients', 'Parallax-like hover and gentle blur shifts', ['finance apps', 'AI dashboards', 'premium SaaS'], ['Blur only on overlays', 'Keep borders visible'], ['high-density admin tools', 'editorial documentation', 'wellness or craft brands', 'retro products']),
    visual('floating glass type', 'transparent panels', 'orbital depth rhythm'),
  ),
  detail(
    'terminal-core',
    'style',
    'Terminal Core',
    ['dark', 'tech', 'developer'],
    ['#071109', '#0a190c', '#b9ffbe', '#d4ff5c'],
    '#d4ff5c',
    t(
      'Monospace fonts and developer console narrative.',
      '모노스페이스 폰트와 개발자 콘솔 내러티브.',
      '等幅フォントと開発者コンソールの物語性。',
    ),
    t(
      'A command-line mood for developer-native products and technical storytelling.',
      '개발자 네이티브 제품과 기술 내러티브에 맞는 커맨드라인 무드입니다.',
      '開発者向け製品と技術的ストーリーに合うコマンドラインのムードです。',
    ),
    prompt('Monospace everywhere with restrained weights', 'Console frames, log rows, prompt blocks', 'Cursor blink, line reveal, command copy feedback', ['CLIs', 'developer tools', 'automation products'], ['Do not fake unreadable code', 'Avoid rainbow terminal colors'], ['consumer SaaS', 'marketing campaigns', 'editorial pages', 'wellness and lifestyle']),
    visual('terminal prompt type', 'green-black panels', 'command-line rhythm'),
  ),
  detail(
    'midnight-noir',
    'style',
    'Midnight Noir',
    ['dark', 'luxury'],
    ['#111214', '#1a1c21', '#eee5d6', '#be9c65'],
    '#be9c65',
    t(
      'Overwhelming dark luxury with gold and silver accents.',
      '압도적인 다크 럭셔리와 세밀한 골드/은빛 포인트.',
      '圧倒的なダークラグジュアリーと繊細な金銀のアクセント。',
    ),
    t(
      'High-contrast luxury for premium products, private clubs, and high-value services.',
      '프리미엄 제품, 프라이빗 클럽, 고가 서비스에 맞는 고대비 럭셔리입니다.',
      '高級製品、プライベートクラブ、高価値サービス向けの高コントラストなラグジュアリー。',
    ),
    prompt('Elegant serif headlines with refined sans body', 'Dark editorial panels, gold hairlines', 'Slow reveals and polished hover states', ['luxury commerce', 'private memberships', 'premium services'], ['No playful icons', 'No bright saturated palette'], ['developer tools', 'operational dashboards', 'casual consumer apps', 'children products']),
    visual('luxury serif type', 'black-gold panels', 'slow premium cadence'),
  ),
  detail(
    'console-launch',
    'style',
    'Console Launch',
    ['dark', 'tech', 'onboarding'],
    ['#05070c', '#0c111a', '#d7dbe6', '#1ece79'],
    '#1ece79',
    t(
      'Dark onboarding with interactive cursor and panels.',
      '다크 온보딩 방식의 인터랙티브 커서와 패널.',
      'ダークなオンボーディング、インタラクティブなカーソルとパネル。',
    ),
    t(
      'A launch interface that makes setup, status, and next actions feel immediate.',
      '설정, 상태, 다음 액션이 즉시 보이게 만드는 런칭 인터페이스입니다.',
      'セットアップ、状態、次の行動を即座に見せるローンチUIです。',
    ),
    prompt('Mono labels with pragmatic sans content', 'Setup panels, keycaps, status columns', 'Cursor, keypress, and panel activation motion', ['onboarding', 'CLI products', 'beta launches'], ['Avoid heavy marketing hero language', 'Keep actions obvious'], ['marketing landing pages', 'editorial publications', 'consumer commerce', 'luxury brand sites']),
    visual('setup console type', 'dark launch panels', 'activation rhythm'),
  ),
  detail(
    'bento-bloom',
    'style',
    'Bento Bloom',
    ['light', 'minimal', 'bento'],
    ['#fffdf9', '#f9f3ea', '#4b8878', '#d9c8b4'],
    '#4b8878',
    t(
      'Soft pastel tones with an Apple-inspired bento grid.',
      '부드러운 파스텔 톤과 애플 감성의 벤토 구조.',
      '柔らかなパステルとApple風のベントーグリッド。',
    ),
    t(
      'A friendly modular layout for communicating multiple features without visual noise.',
      '여러 기능을 시각적 소음 없이 전달하는 친화적인 모듈형 레이아웃입니다.',
      '複数機能を視覚的なノイズなく伝える親しみやすいモジュール構成です。',
    ),
    prompt('Rounded sans, friendly weights, compact captions', 'Bento grid with feature cards and small metrics', 'Gentle hover lift and card reveal', ['consumer SaaS', 'productivity tools', 'feature pages'], ['No nested cards', 'Avoid one-note pastel wash'], ['luxury brand sites', 'editorial publications', 'security or dev tools', 'finance trust products']),
    visual('friendly product type', 'warm bento cards', 'modular bloom rhythm'),
  ),
  detail(
    'earth-atelier',
    'style',
    'Earth Atelier',
    ['nature', 'minimal', 'warm'],
    ['#ede3d4', '#f8f0e4', '#68754f', '#cab498'],
    '#68754f',
    t(
      'Neutral, nature-inspired textures and organic layout.',
      '자연의 질감과 뉴트럴 감성 기반의 레이아웃.',
      '自然の質感とニュートラルな感性に基づくレイアウト。',
    ),
    t(
      'Warm tactile design language for brands that need calm craft instead of corporate polish.',
      '기업형 광택 대신 차분한 공예 감각이 필요한 브랜드용 따뜻한 촉각 디자인입니다.',
      '企業的な艶より静かなクラフト感が必要なブランド向けです。',
    ),
    prompt('Humanist serif/sans pairing, warm line height', 'Organic asymmetry, material panels, generous gutters', 'Slow natural reveals and soft hover states', ['wellness', 'studios', 'food and craft brands'], ['Avoid sterile white', 'Avoid hyper-saturated accents'], ['developer tools', 'gaming or tech launches', 'corporate enterprise dashboards', 'high-density data UI']),
    visual('atelier typography', 'earth-tone surfaces', 'organic spacing rhythm'),
  ),
  detail(
    'liquid-metal',
    'style',
    'Liquid Metal',
    ['dark', 'luxury', 'tech'],
    ['#050505', '#c0c0c0', '#eeeeee', '#2c2c2c'],
    '#c0c0c0',
    t(
      'Chrome metallic reflections with monochrome silver palette.',
      '크롬과 메탈릭 질감의 반사 효과, 모노크롬 실버 팔레트.',
      'クロームと金属質の反射、モノクロームな銀のパレット。',
    ),
    t(
      'A reflective premium technology direction with restrained copy and strong material presence.',
      '절제된 카피와 강한 소재감을 가진 반사형 프리미엄 기술 방향입니다.',
      '控えめなコピーと強い素材感を持つ反射的なプレミアム技術表現です。',
    ),
    prompt('Sharp sans with metallic display treatments', 'Chrome cards, black negative space, product-like slabs', 'Specular hover shimmer and slow reveal', ['hardware', 'luxury tech', 'automotive'], ['Do not use rainbow chrome everywhere', 'Keep body text flat'], ['B2B SaaS dashboards', 'editorial content sites', 'wellness and lifestyle', 'children and education']),
    visual('metal display type', 'chrome surfaces', 'reflective cadence'),
  ),
  detail(
    'aurora-gradient',
    'style',
    'Aurora Gradient',
    ['dark', 'bold', 'gradient'],
    ['#0b1020', '#7c4dff', '#21d4fd', '#f857a6'],
    '#7c4dff',
    t(
      'Organic multi-color blur gradients flowing like aurora.',
      '오로라처럼 유기적으로 흐르는 다중 컬러 블러 그라데이션 배경.',
      'オーロラのように有機的に流れる多色ブラーグラデーション。',
    ),
    t(
      'A cosmic atmospheric system for expressive hero sections and immersive product stories.',
      '표현적인 히어로와 몰입형 제품 스토리를 위한 우주적 분위기 시스템입니다.',
      '表現的なヒーローと没入型ストーリーのための宇宙的な雰囲気です。',
    ),
    prompt('Rounded modern sans over high-contrast panels', 'Aurora background with solid content islands', 'Slow gradient drift, reveal on scroll', ['AI products', 'creative launches', 'media pages'], ['No text directly on low-contrast gradients', 'Respect reduced motion'], ['operational dashboards', 'documentation sites', 'finance trust products', 'admin tools']),
    visual('glowing gradient type', 'aurora backdrop', 'slow atmospheric rhythm'),
  ),
  detail(
    'zen-minimalism',
    'style',
    'Zen Minimalism',
    ['light', 'minimal', 'nature'],
    ['#fafaf6', '#e5e1da', '#45413e', '#a6a197'],
    '#45413e',
    t(
      'Extreme whitespace and serif fonts focused on essence.',
      '극도의 여백과 세리프 폰트로 본질에 집중하는 스타일.',
      '極端な余白とセリフ体で本質に集中するスタイル。',
    ),
    t(
      'A restraint-first layout where each object earns its place.',
      '모든 요소가 놓일 이유를 가져야 하는 절제 우선 레이아웃입니다.',
      'すべての要素が置かれる理由を持つ、抑制を優先したレイアウトです。',
    ),
    prompt('Serif headline, sparse sans captions', 'Single-column sections with extreme margins', 'Almost no motion except focus transitions', ['galleries', 'mindfulness', 'premium portfolios'], ['No crowded grids', 'No bright accent noise'], ['dense data dashboards', 'gaming and entertainment', 'high-energy campaigns', 'feature-rich SaaS']),
    visual('quiet serif type', 'empty paper surface', 'breathing rhythm'),
  ),
  detail(
    'mono-type',
    'style',
    'Mono Type',
    ['dark', 'minimal', 'type'],
    ['#0a0a0a', '#eeeeee', '#666666', '#1f1f1f'],
    '#eeeeee',
    t(
      'Monochrome style using only typographic weight and size for hierarchy.',
      '오직 타이포그래피의 크기와 무게로만 위계를 만드는 모노크롬 스타일.',
      '文字のサイズと太さだけで階層を作るモノクロームスタイル。',
    ),
    t(
      'Typography as the interface: no color crutches, no extra ornament.',
      '색상 보조나 장식 없이 타이포그래피 자체가 인터페이스가 됩니다.',
      '色や装飾に頼らず、タイポグラフィそのものがUIになります。',
    ),
    prompt('Mono or grotesk type with strict weights', 'Text-led layouts, black-white blocks, list systems', 'Instant, editorial transitions', ['docs', 'archives', 'minimal portfolios'], ['No accent palette', 'No heavy shadow'], ['marketing campaigns', 'consumer commerce', 'gaming and playful apps', 'data visualization tools']),
    visual('type-only hierarchy', 'monochrome slabs', 'reading rhythm'),
  ),
  detail(
    'duotone-bold',
    'style',
    'Duotone Bold',
    ['dark', 'bold', 'music', 'duotone'],
    ['#121212', '#1db954', '#ffffff', '#282828'],
    '#1db954',
    t(
      'High-contrast duotone cards with bold typography and vibrant gradients.',
      '대담한 타이포그래피와 생동감 있는 그라데이션의 고대비 듀오톤 카드.',
      '大胆な書体と鮮やかなグラデーションの高コントラストなデュオトーン。',
    ),
    t(
      'A focused two-color system for content libraries, music products, and punchy media surfaces.',
      '콘텐츠 라이브러리, 음악 제품, 강한 미디어 표면에 맞는 2색 중심 시스템입니다.',
      'コンテンツライブラリ、音楽製品、強いメディア面に合う二色中心のシステムです。',
    ),
    prompt('Heavy sans with compact uppercase labels', 'Duotone cards, horizontal media rails, bold CTAs', 'Card scale hovers and row reveals', ['music apps', 'media libraries', 'creator tools'], ['No multicolor palette creep', 'Keep black base stable'], ['B2B admin', 'finance dashboards', 'documentation sites', 'wellness apps']),
    visual('duotone media type', 'dark vivid cards', 'rail-based rhythm'),
  ),
  detail(
    'mesh-gradient',
    'style',
    'Mesh Gradient',
    ['light', 'bold', 'gradient'],
    ['#ffffff', '#6c63ff', '#ff9a9e', '#fad0c4'],
    '#6c63ff',
    t(
      'Apple-style multi-point mesh gradient, bright and refined.',
      'Apple 스타일 다중 포인트 메시 그라데이션, 밝고 세련된 느낌.',
      'Apple風の多点メッシュグラデーション、明るく洗練された印象。',
    ),
    t(
      'A polished consumer-tech direction with soft color depth and simple product hierarchy.',
      '부드러운 색 깊이와 단순한 제품 위계를 가진 세련된 컨슈머 테크 방향입니다.',
      '柔らかな色の奥行きと単純な製品階層を持つ洗練された方向です。',
    ),
    prompt('Clean rounded sans with light display weight', 'Bright mesh hero, simple white product sections', 'Gradient drift and soft hover lifts', ['consumer apps', 'AI writing tools', 'landing pages'], ['Do not use gradient behind every card', 'Keep copy areas solid'], ['developer tools', 'admin and data dashboards', 'editorial documentation', 'craft or wellness brands']),
    visual('soft display type', 'bright mesh surfaces', 'gentle launch rhythm'),
  ),
  detail(
    'framer-motion',
    'style',
    'Framer Motion',
    ['dark', 'motion', 'saas', 'modern'],
    ['#09090b', '#8b5cf6', '#06b6d4', '#fafafa'],
    '#8b5cf6',
    t(
      'Motion-centric SaaS landing with gradient text, glow borders, and entrance animations.',
      '그라데이션 텍스트, 글로우 보더, 등장 애니메이션의 모션 중심 SaaS 랜딩.',
      'グラデーション文字、光る境界線、登場アニメーションを持つモーション中心のSaaS。',
    ),
    t(
      'A motion-first reference where state changes, reveal timing, and hover depth carry the brand.',
      '상태 변화, 등장 타이밍, 호버 깊이가 브랜드를 이끄는 모션 우선 레퍼런스입니다.',
      '状態変化、登場タイミング、ホバーの奥行きがブランドを担うモーション優先の参考です。',
    ),
    prompt('Modern sans with gradient-highlight headlines', 'Dark SaaS bento, glowing borders, interactive panels', 'Stagger, spring hover, scroll reveal', ['motion tools', 'SaaS launches', 'AI products'], ['Respect prefers-reduced-motion', 'Do not animate layout unpredictably'], ['accessibility-critical products', 'documentation sites', 'long-form editorial', 'low-motion contexts']),
    visual('gradient motion type', 'dark glow cards', 'staggered entrance rhythm'),
  ),
  detail(
    'claymorphism',
    'style',
    'Claymorphism',
    ['soft', 'pleasant', '3d'],
    ['#e8eaed', '#ffffff', '#ff8b7e', '#414a52'],
    '#ff8b7e',
    t(
      'Cozy double-shadow volumetric clay-style web structure.',
      '포근하고 푹신한 더블 그림자 기반의 친화형 웹 구조.',
      '柔らかな二重影で作る粘土のような親しみやすいWeb構造。',
    ),
    t(
      'Puffy depth and friendly components for onboarding, education, and playful tools.',
      '온보딩, 교육, playful 도구에 맞는 푹신한 깊이감과 친화적 컴포넌트입니다.',
      'オンボーディング、教育、遊び心あるツールに合う柔らかな奥行きです。',
    ),
    prompt('Rounded friendly sans, high legibility', 'Puffy cards, soft shadows, tactile controls', 'Squash hover and soft spring tap', ['education', 'wellness', 'creator tools'], ['No sharp corporate styling', 'Do not over-stack shadows'], ['professional B2B', 'finance or legal', 'developer tools', 'security products']),
    visual('friendly rounded type', 'puffy clay cards', 'soft spring rhythm'),
  ),
  detail(
    'neumorphism',
    'style',
    'Neumorphism',
    ['minimal', 'clean', 'shadow'],
    ['#e0e5ec', '#1a73e8', '#344055', '#a3b1c6'],
    '#1a73e8',
    t(
      'Light and shadow emboss on a unified background surface.',
      '배경과 통일된 컬러 위에서 빛과 그림자 양각만으로 승부하는 룩.',
      '背景と一体化した面で光と影の浮き彫りを使うルック。',
    ),
    t(
      'A soft hardware-like UI language for controls, calculators, and tactile settings.',
      '컨트롤, 계산기, 촉각적 설정 화면에 맞는 부드러운 하드웨어형 UI 언어입니다.',
      'コントロール、計算機、触覚的な設定画面に合う柔らかなハードウェア風UIです。',
    ),
    prompt('Rounded sans with clear numeric hierarchy', 'Inset/outset controls on one background tone', 'Pressed states and small shadow transitions', ['settings panels', 'calculators', 'IoT controls'], ['Check contrast carefully', 'Avoid large text on embossed surfaces'], ['content-heavy sites', 'editorial publications', 'marketing campaigns', 'high-density dashboards']),
    visual('soft control type', 'embossed panels', 'pressed-state rhythm'),
  ),
  detail(
    'soft-pastel',
    'style',
    'Soft Pastel',
    ['light', 'minimal', 'soft'],
    ['#fdf0f5', '#ff9a76', '#c78daa', '#fff7fb'],
    '#ff9a76',
    t(
      'Ultra-soft pastel tones with warm rounded pill-shaped UI.',
      '울트라 소프트 파스텔 톤과 둥근 필 형태의 따뜻한 인터페이스.',
      '非常に柔らかなパステルと丸いピル型UI。',
    ),
    t(
      'Gentle, pleasant interface tone for personal tools and lightweight lifestyle products.',
      '개인 도구와 가벼운 라이프스타일 제품에 맞는 부드럽고 편안한 인터페이스 톤입니다.',
      '個人ツールや軽いライフスタイル製品に合う穏やかなUIトーンです。',
    ),
    prompt('Rounded sans with soft weights', 'Pill controls, warm panels, spacious cards', 'Gentle fades and hover lifts', ['personal apps', 'lifestyle products', 'journals'], ['Avoid low-contrast pastel text', 'Limit roundedness hierarchy'], ['enterprise B2B', 'developer tools', 'finance or legal', 'gaming or security']),
    visual('soft rounded type', 'pastel pill surfaces', 'gentle rhythm'),
  ),
  detail(
    'notion-style',
    'style',
    'Notion Style',
    ['minimal', 'clean', 'productivity'],
    ['#ffffff', '#f7f6f3', '#2383e2', '#37352f'],
    '#2383e2',
    t(
      'Clean productivity UI with sidebar, block-based content, and minimal chrome.',
      '사이드바와 블록 기반 콘텐츠, 미니멀 크롬의 깔끔한 프로덕티비티 UI.',
      'サイドバー、ブロック型コンテンツ、最小限のクロームを持つ生産性UI。',
    ),
    t(
      'A writing-and-organization surface optimized for clarity, hierarchy, and editing flow.',
      '명료함, 위계, 편집 흐름에 최적화된 작성/정리용 표면입니다.',
      '明瞭さ、階層、編集の流れに最適化された作成/整理画面です。',
    ),
    prompt('System-like sans, compact text, tiny labels', 'Sidebar plus block content with subtle dividers', 'Tiny hover affordances and command states', ['knowledge bases', 'dashboards', 'collaboration tools'], ['No heavy shadows', 'No decorative backgrounds'], ['marketing landing pages', 'gaming and entertainment', 'high-energy launches', 'luxury commerce']),
    visual('block editor type', 'clean document surface', 'editorial utility rhythm'),
  ),
  detail(
    'retro-pixel',
    'style',
    'Retro Pixel',
    ['retro', 'pixel', 'game', 'dark'],
    ['#1a1c2c', '#a7f070', '#f77622', '#333c57'],
    '#f77622',
    t(
      '8-bit pixel art aesthetic with Game Boy colors and RPG-style UI elements.',
      '게임보이 컬러와 RPG 스타일 UI 요소의 8비트 픽셀 아트 감성.',
      'Game BoyカラーとRPG風UIを持つ8-bitピクセルアート感。',
    ),
    t(
      'A nostalgic game-interface language for playful products and retro communities.',
      'playful 제품과 레트로 커뮤니티에 맞는 향수 어린 게임 인터페이스 언어입니다.',
      '遊び心ある製品やレトロコミュニティに合う懐かしいゲームUIです。',
    ),
    prompt('Pixel or mono type with hard edges', 'Pixel frames, RPG panels, inventory-like grids', 'Step-based animation and sprite-like hover', ['games', 'communities', 'collectibles'], ['No anti-aliased glossy cards', 'Keep hit targets usable'], ['B2B SaaS', 'professional services', 'finance or legal', 'enterprise admin', 'wellness apps']),
    visual('pixel label type', 'game panels', 'stepped rhythm'),
  ),
  detail(
    'y2k-retro',
    'style',
    'Windows 98',
    ['retro', 'web1.0', 'vibrant'],
    ['#008080', '#c0c0c0', '#000080', '#ffffff'],
    '#000080',
    t(
      'Clean retro UI with beveled chrome, teal desktop, and classic window components.',
      '베벨 크롬, 틸 데스크톱, 클래식 윈도우 컴포넌트의 깔끔한 레트로 UI.',
      'ベベル、ティールのデスクトップ、クラシックなウィンドウ部品のレトロUI。',
    ),
    t(
      'A nostalgic desktop metaphor that still works for docs, launchers, and playful tools.',
      '문서, 런처, playful 도구에도 통하는 향수 어린 데스크톱 메타포입니다.',
      'ドキュメント、ランチャー、遊び心あるツールにも使える懐かしいデスクトップ比喩です。',
    ),
    prompt('Tahoma-like sans, tiny UI labels', 'Window chrome, menu bars, beveled buttons', 'Instant pressed states, no smooth transitions', ['retro docs', 'launchers', 'indie tools'], ['No modern rounded cards', 'Keep spacing compact'], ['modern enterprise SaaS', 'finance or legal trust products', 'wellness and lifestyle apps', 'premium luxury']),
    visual('classic desktop type', 'beveled chrome windows', 'instant UI rhythm'),
  ),
  detail(
    'risograph-print',
    'style',
    'Risograph Print',
    ['texture', 'print', 'minimal'],
    ['#f5efe6', '#ff6b6b', '#2aa198', '#8b5e3c'],
    '#ff6b6b',
    t(
      'Limited spot colors, halftone dots, and charming misregistration of soy-based ink layers on textured paper.',
      '소이 잉크의 제한된 스팟 컬러, 하프톤 도트, 매력적인 판 어긋남이 만드는 질감 있는 인쇄 감성.',
      '限られたスポットカラー、ハーフトーン、版ズレが生む質感ある印刷感。',
    ),
    t(
      'A print-shop visual system with tactile paper and deliberate imperfect color separation.',
      '촉각적인 종이와 의도적인 색 분판 어긋남을 가진 인쇄소형 시각 시스템입니다.',
      '触感のある紙と意図した色分解のずれを持つ印刷所的な視覚システムです。',
    ),
    prompt('Editorial serif plus stamped labels', 'Paper texture, two-color layers, registration marks', 'Low-fi layer offsets and print proof reveals', ['art projects', 'zines', 'creative studios'], ['Limit to two or three spot colors', 'Keep body text on quiet paper'], ['developer dashboards', 'finance applications', 'enterprise SaaS', 'high-density data tools']),
    visual('printed label type', 'paper ink layers', 'misregistered print rhythm'),
  ),
  detail(
    'paper-cut',
    'style',
    'Paper Cut',
    ['craft', 'layered', 'warm'],
    ['#faf3eb', '#e85d4a', '#6b4c3b', '#f2d5c4'],
    '#e85d4a',
    t(
      'Layered paper craft with cut shadows, flat matte colors, and tactile depth from stacked sheets.',
      '종이를 겹겹이 잘라 붙인 입체적 깊이감, 플랫 매트 컬러와 촉각적 그림자의 공예 미학.',
      '切り重ねた紙、マットな色、積層影による触覚的なクラフト感。',
    ),
    t(
      'A handcrafted layered system for warm storytelling and tactile product explanations.',
      '따뜻한 스토리텔링과 촉각적인 제품 설명을 위한 수공예 레이어 시스템입니다.',
      '暖かなストーリーテリングと触感ある製品説明のための手作りレイヤーです。',
    ),
    prompt('Friendly serif/sans with cutout labels', 'Layered sheets, tabs, shadow-only depth', 'Lift on hover and staged paper reveals', ['education', 'craft brands', 'story pages'], ['No glossy gradients on paper shapes', 'Keep shadows directional'], ['developer tools', 'B2B SaaS dashboards', 'finance or legal', 'high-density data']),
    visual('craft label type', 'stacked paper layers', 'cutout reveal rhythm'),
  ),
  detail(
    'macos-liquid-glass',
    'style',
    'macOS Liquid Glass',
    ['light', 'glass', 'product', 'apple'],
    ['#f7f9fb', '#ffffff', '#cfd8e6', '#2f6feb'],
    '#2f6feb',
    t(
      'macOS 26-inspired translucent desktop UI with layered glass controls, windows, sheets, and dock chrome.',
      'macOS 26에서 영감을 받은 반투명 데스크톱 UI. 레이어드 글래스 컨트롤, 윈도우, 시트, Dock 크롬을 다룹니다.',
      'macOS 26に着想を得た半透明デスクトップUI。レイヤードガラスのコントロール、ウィンドウ、シート、Dockクロームを扱います。',
    ),
    t(
      'A practical Apple-platform surface for product dashboards that need native familiarity, depth, and careful text clarity.',
      '네이티브한 익숙함, 깊이감, 텍스트 명료도가 필요한 제품 대시보드에 맞는 Apple 플랫폼형 표면입니다.',
      'ネイティブな親しみ、奥行き、テキストの明瞭さが必要なプロダクトダッシュボード向けのAppleプラットフォーム調サーフェスです。',
    ),
    prompt('SF-style system sans with compact labels and clear hierarchy', 'Desktop window chrome, translucent sidebars, sheets, segmented controls, dock layer', 'Subtle refraction shifts, focus rings, and sheet depth transitions', ['macOS apps', 'admin dashboards', 'creative tools'], ['Never place long body copy on busy glass', 'Keep controls functional, not decorative'], ['print-style editorial', 'craft or wellness brands', 'gaming and entertainment', 'retro or nostalgic products']),
    visual('system glass type', 'translucent desktop windows', 'native control rhythm'),
  ),
  detail(
    'fusion-neon-swiss',
    'fusion',
    'Neon x Swiss',
    ['dark', 'bold', 'tech', 'grid'],
    ['#111722', '#ff3b30', '#00ffff', '#f3f2ee'],
    '#ff3b30',
    t('A perfect blend of neon energy and Swiss design alignment.', '네온 에너지와 스위스 디자인 정렬의 결합.', 'ネオンのエネルギーとスイス的整列の融合。'),
    t('Swiss grid discipline holds neon drama in place.', '스위스 그리드가 네온의 드라마를 단단히 붙잡습니다.', 'スイスグリッドがネオンの演出を制御します。'),
    prompt('Clean sans with neon emphasis', 'Strict grid plus glow accents', 'Measured glow hover and grid reveals', ['AI dashboards', 'event tech', 'launch pages'], ['Keep alignment strict', 'Do not flood every edge with neon'], ['wellness apps', 'editorial long-form', 'children products', 'craft or lifestyle brands']),
    visual('grided neon type', 'dark poster panels', 'disciplined glow rhythm'),
    ['neon-drift', 'swiss-poster'],
  ),
  detail(
    'fusion-product-swiss',
    'fusion',
    'Product x Swiss',
    ['light', 'product', 'grid', 'color'],
    ['#ffffff', '#0b0b0b', '#ffcd29', '#26c6f9'],
    '#ff5c35',
    t('A crisp product-marketing canvas where Swiss grid discipline meets playful collaboration graphics.', '스위스 그리드의 정밀함에 협업 제품 그래픽의 경쾌함을 얹은 선명한 프로덕트 마케팅 캔버스.', 'スイスグリッドの精密さに、共同作業プロダクトの軽やかなグラフィックを重ねた明快な画面。'),
    t('Use it when a page should feel clean, real, and optimistic without drifting into generic AI SaaS gradients.', '페이지가 깔끔하고 실제 제품 같으면서도, 흔한 AI SaaS 그라데이션처럼 보이지 않아야 할 때 맞습니다.', 'ページを清潔で実在感のある楽観的な印象にしつつ、よくあるAI SaaSのグラデーションから離したい時に合います。'),
    prompt('Confident grotesk headlines, calm product body copy, mono utility labels', 'Large white canvas, 12-column alignment, product UI frames, small collaboration objects, controlled color islands', 'Short staggered reveals, cursor nudge, comment-card lift, no background spectacle', ['collaboration tools', 'design systems', 'AI product builders', 'creative SaaS launches'], ['Keep the canvas mostly white', 'Use color as object, not atmosphere', 'Show product UI or workflow artifacts', 'Avoid glossy purple gradients'], ['gaming and entertainment', 'craft or wellness brands', 'luxury commerce', 'long-form editorial']),
    visual('clean product headline', 'white canvas with UI frames', 'playful but governed rhythm'),
    ['swiss-poster', 'platform-core', 'kinetic-pop'],
  ),
  detail(
    'fusion-bento-noir',
    'fusion',
    'Bento x Noir',
    ['dark', 'luxury', 'bento'],
    ['#09090b', '#d4af37', '#fffdf9', '#1a1c21'],
    '#d4af37',
    t('Premium look combining efficient bento layout with dark luxury.', '효율적인 벤토 구조에 다크 럭셔리를 얹어낸 프리미엄 룩.', '効率的なベントー構造にダークラグジュアリーを重ねた見た目。'),
    t('Modular luxury for premium platforms with many features.', '기능이 많은 프리미엄 플랫폼에 맞는 모듈형 럭셔리입니다.', '機能の多いプレミアム平台に合うモジュール型ラグジュアリーです。'),
    prompt('Elegant sans/serif pairing', 'Bento modules in dark-gold palette', 'Slow polished card reveals', ['premium SaaS', 'membership products', 'finance'], ['No playful pastel drift', 'Keep gold sparse'], ['developer tools', 'craft or wellness brands', 'children or education products', 'playful consumer apps']),
    visual('luxury module type', 'dark bento cards', 'premium modular rhythm'),
    ['bento-bloom', 'midnight-noir'],
  ),
  detail(
    'fusion-editorial-terminal',
    'fusion',
    'Editorial x Terminal',
    ['dark', 'tech', 'minimal', 'editorial'],
    ['#0b0f19', '#4ade80', '#fbfbfb', '#18181b'],
    '#4ade80',
    t('Editorial readability meets tech log aesthetics.', '에디토리얼 가독성과 기술 로그 감성의 조화.', '編集的な読みやすさと技術ログの美学の融合。'),
    t('A reference/manual format with enough console texture to feel technical.', '기술적으로 느껴질 만큼 콘솔 질감을 가진 레퍼런스/매뉴얼 형식입니다.', '技術感を出すだけのコンソール質感を持つリファレンス形式です。'),
    prompt('Serif headlines, mono labels, readable sans body', 'Article flow with log callouts and code cards', 'Line-by-line reveals for technical explanations', ['technical docs', 'release pages', 'developer education'], ['Keep body reading comfortable', 'Do not turn the whole page into code'], ['marketing landing pages', 'consumer commerce', 'wellness and lifestyle', 'gaming and entertainment']),
    visual('manual terminal type', 'article-code surfaces', 'documentation rhythm'),
    ['editorial-silence', 'terminal-core'],
  ),
  detail(
    'fusion-holo-glass',
    'fusion',
    'Holo x Glass',
    ['tech', 'bold', 'glass', 'gradient'],
    ['#050510', '#ff007f', '#00f2fe', '#ffffff'],
    '#ff007f',
    t('Dreamy organic backgrounds with transparent 3D glassmorphism.', '몽환적인 유기적 배경에 투명한 입체감을 얹은 프리미엄 글래스모피즘.', '夢のような有機背景に透明な立体感を重ねたグラス表現。'),
    t('Iridescent glass for premium AI and creator products.', '프리미엄 AI/크리에이터 제품에 맞는 무지갯빛 글래스입니다.', 'プレミアムAIやクリエイター製品に合う虹色のガラス表現です。'),
    prompt('Luminous sans, compact glass labels', 'Holographic mesh beneath transparent panels', 'Refraction hover and slow color drift', ['AI tools', 'creative suites', 'premium dashboards'], ['Do not place text on uncontrolled gradients', 'Limit blur depth'], ['admin dashboards', 'finance or legal', 'editorial documentation', 'craft and wellness']),
    visual('holo glass type', 'transparent gradient panels', 'refraction rhythm'),
    ['holographic-fluid', 'glass-orbit'],
  ),
  detail(
    'fusion-earth-zen',
    'fusion',
    'Earth x Zen',
    ['nature', 'minimal', 'warm'],
    ['#f0ebe3', '#6b5e50', '#8b7d6b', '#ffffff'],
    '#8b7d6b',
    t('Natural neutral tones with gallery-grade whitespace.', '자연의 뉴트럴 톤과 압도적인 여백 미학의 갤러리 룩.', '自然なニュートラル色とギャラリー級の余白美。'),
    t('A restrained warm system where product content can breathe.', '제품 콘텐츠가 숨 쉴 수 있는 절제된 따뜻한 시스템입니다.', '製品内容が呼吸できる抑制された温かなシステムです。'),
    prompt('Serif warmth with quiet sans captions', 'Earth-toned panels floating in large whitespace', 'Near-static, soft scroll reveals', ['wellness', 'architecture', 'premium studios'], ['Avoid clutter', 'Keep color changes subtle'], ['dense SaaS dashboards', 'gaming and entertainment', 'developer tools', 'high-energy campaigns']),
    visual('earth serif type', 'warm empty panels', 'quiet breathing rhythm'),
    ['earth-atelier', 'zen-minimalism'],
  ),
  detail(
    'fusion-kinetic-brutal',
    'fusion',
    'Kinetic x Brutal',
    ['bold', 'grid', 'motion'],
    ['#ffff00', '#000000', '#ff3b30', '#ffffff'],
    '#ffff00',
    t('Bold primary-color pop art with thick borders and destructive wireframes.', '강렬한 원색 팝아트와 두꺼운 테두리, 파괴적인 와이어프레임.', '強烈な原色ポップアート、太い罫線、破壊的なワイヤーフレーム。'),
    t('Maximum energy with structural guardrails.', '구조적 가드레일을 가진 최대 에너지 스타일입니다.', '構造のガードレールを持つ最大エネルギーのスタイルです。'),
    prompt('Heavy sans/mono labels, loud type scale', 'Thick bordered modules, oversized shapes, raw grids', 'Punchy spring motion and abrupt section shifts', ['campaign pages', 'events', 'creator drops'], ['Keep layout readable', 'Use loud color intentionally'], ['B2B trust products', 'finance or legal', 'wellness apps', 'documentation sites']),
    visual('loud block type', 'primary-color wireframes', 'impact rhythm'),
    ['kinetic-pop', 'brutalist-grid'],
  ),
  detail(
    'fusion-cyber-console',
    'fusion',
    'Cyber x Console',
    ['dark', 'tech', 'bold'],
    ['#050505', '#ff00ff', '#00f0ff', '#1ece79'],
    '#ff00ff',
    t('Hacker console sensibility fused with cyberpunk neon glitch.', '해커 콘솔 감성과 사이버펑크 네온 글리치의 치명적 융합.', 'ハッカーコンソール感とサイバーパンクネオンの融合。'),
    t('A launch console that looks dangerous, technical, and fast.', '위험하고 기술적이며 빠르게 느껴지는 런칭 콘솔입니다.', '危険で技術的、そして速く感じるローンチコンソールです。'),
    prompt('Mono-heavy UI with neon display accents', 'Command console plus glitch panels', 'Cursor, error pulse, and neon scan motion', ['security launches', 'game ops', 'automation tools'], ['Do not fake inaccessible text', 'Throttle glitch effects'], ['wellness and lifestyle', 'consumer commerce', 'editorial publications', 'children products']),
    visual('hacker launch type', 'neon command panels', 'scanline rhythm'),
    ['cyberpunk-glitch', 'console-launch'],
  ),
  detail(
    'fusion-grain-mono',
    'fusion',
    'Analog Press',
    ['vintage', 'texture', 'minimal'],
    ['#15100d', '#f4f1de', '#e07a5f', '#eeeeee'],
    '#e07a5f',
    t('Film grain darkroom aesthetic meets typewriter manuscript — vintage print shop warmth.', '필름 그레인 암실 감성과 타자기 원고의 만남 — 빈티지 인쇄소의 따뜻함.', 'フィルム粒子の暗室感とタイプライター原稿の融合。'),
    t('A monochrome reading system warmed by analog grain and print-shop color.', '아날로그 그레인과 인쇄소 컬러로 따뜻해진 모노크롬 읽기 시스템입니다.', 'アナログ粒子と印刷所の色で温めたモノクロ読書システムです。'),
    prompt('Mono type with analog serif notes', 'Text-first layouts with grain and print accents', 'Small opacity reveals and page-turn cues', ['editorial archives', 'music writing', 'zines'], ['Keep grain subtle', 'Preserve line length'], ['developer dashboards', 'enterprise admin', 'gaming and entertainment', 'high-density data']),
    visual('typewriter print type', 'grain monochrome panels', 'slow archive rhythm'),
    ['mono-type'],
  ),
  detail(
    'fusion-clay-aurora',
    'fusion',
    'Clay Aurora',
    ['playful', 'gradient', '3d'],
    ['#f5f3ff', '#56d991', '#7c4dff', '#ff8b7e'],
    '#56d991',
    t('Soft puffy 3D clay elements floating under dreamy northern lights gradients.', '부풀린 3D 클레이 요소가 몽환적인 오로라 그라데이션 위를 떠다니는 스타일.', '柔らかな3D粘土要素が幻想的なオーロラの上に浮かぶスタイル。'),
    t('A playful but polished motion surface for onboarding and learning products.', '온보딩과 학습 제품에 맞는 playful하지만 정돈된 모션 표면입니다.', 'オンボーディングや学習製品に合う遊び心があり整ったモーション面です。'),
    prompt('Rounded friendly sans with luminous accents', 'Puffy clay cards over aurora background', 'Spring taps, floating cards, slow gradient drift', ['education', 'AI companions', 'creative onboarding'], ['Respect reduced motion', 'Keep content on solid cards'], ['enterprise B2B', 'developer tools', 'finance or legal products', 'gaming']),
    visual('puffy gradient type', 'clay aurora surfaces', 'floating spring rhythm'),
    ['claymorphism', 'aurora-gradient'],
  ),
];

export const styles = styleCatalog.filter((item) => item.kind === 'style');
export const fusionStyles = styleCatalog.filter((item) => item.kind === 'fusion');
export const styleById = new Map(styleCatalog.map((style) => [style.id, style]));

export const styleTags = ['dark', 'light', 'minimal', 'bold', 'tech', 'luxury', 'nature', 'motion', 'texture'];

export function getStyleById(id: string | null | undefined): StyleData | undefined {
  return id ? styleById.get(id) : undefined;
}

export function localize(text: LocalizedText, lang: Lang): string {
  return text[lang] || text.en;
}
