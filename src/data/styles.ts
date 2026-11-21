export type Lang = 'en' | 'ko' | 'ja';
export type LocalizedText = Record<Lang, string>;
export type StyleKind = 'style' | 'fusion';

export interface SeoInfo {
  title: LocalizedText;
  description: LocalizedText;
}

/**
 * What every page needs to name, list, route and color a style.
 * The longer direction copy (summary, prompt and visual profile) is in styleProfiles.ts,
 * so the pages that do not show it do not load it.
 */
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
  seo: SeoInfo;
  fusionOf?: string[];
}

interface StyleTimeline {
  createdAt: string;
}

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

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
  'fusion-floppy-exe': { createdAt: '2026-05-15T00:00:00+09:00' },
  'fusion-noir-metal': { createdAt: '2026-05-15T00:00:00+09:00' },
  'fusion-strict-console': { createdAt: '2026-05-15T11:05:00+09:00' },
  'fusion-quiet-manifesto': { createdAt: '2026-05-15T11:10:00+09:00' },
  'fusion-pure-noir':       { createdAt: '2026-05-16T10:00:00+09:00' },
  'fusion-soft-inflate':    { createdAt: '2026-05-16T14:00:00+09:00' },
  'fusion-studio-pixel':    { createdAt: '2026-05-16T18:00:00+09:00' },
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
  seo: seo(name, description),
  fusionOf,
});

export const styleCatalog: StyleData[] = [
  detail(
    'brutalist-grid',
    'style',
    'Brutalist Grid',
    ['light', 'bold', 'minimal'],
    ['#e6e6e1', '#ffffff', '#111111', '#d72600'],
    '#d72600',
    t(
      'Raw, heavy lines and structural typographic block system.',
      '굵고 투박한 선, 구조적인 타이포 블록 시스템.',
      '太い線と構造的なタイポグラフィブロックで組む生々しいスタイル。',
    ),
  ),
  detail(
    'editorial-silence',
    'style',
    'Editorial Silence',
    ['light', 'minimal', 'editorial'],
    ['#f8f8f8', '#ffffff', '#1c1c1e', '#52525b'],
    '#1c1c1e',
    t(
      'Restrained elegance with magazine typography and generous whitespace.',
      '잡지형 타이포그래피와 여백을 살린 절제미.',
      '雑誌のようなタイポグラフィと余白を活かした静かな上質感。',
    ),
  ),
  detail(
    'kinetic-pop',
    'style',
    'Kinetic Pop',
    ['light', 'bold', 'motion'],
    ['#f6f3ea', '#ffe85d', '#ff4f7b', '#196bff'],
    '#ff4f7b',
    t(
      'Bold color contrast and rhythm-driven motion design.',
      '강렬한 컬러 대비와 리듬감 있는 모션 중심.',
      '強い色の対比とリズム感のある動きが中心のデザイン。',
    ),
  ),
  detail(
    'cyberpunk-glitch',
    'style',
    'Cyberpunk Glitch',
    ['dark', 'bold', 'tech'],
    ['#09090b', '#fde047', '#22d3ee', '#d946ef'],
    '#22d3ee',
    t(
      'Neon contrast, monospace, and glitch-infused terminal look.',
      '네온 대비와 모노스페이스, 글리치가 결합된 터미널 룩.',
      'ネオンの対比、等幅文字、グリッチを組み合わせた端末的な見た目。',
    ),
  ),
  detail(
    'swiss-poster',
    'style',
    'Swiss Poster',
    ['light', 'bold', 'minimal'],
    ['#f5f4ef', '#ffffff', '#111111', '#d41f18'],
    '#d41f18',
    t(
      'Grid-system and alignment-focused informational style.',
      '격자 시스템과 정렬 중심의 정보 지향적 스타일.',
      'グリッドと整列を中心にした情報志向のスタイル。',
    ),
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
  ),
  detail(
    'platform-core',
    'style',
    'Platform Core',
    ['dual', 'tech', 'product', 'minimal'],
    ['#101010', '#fafafa', '#2b2b2b', '#e5e5e5'],
    '#171717',
    t(
      'Real-service platform style with dual dark/light themes, centered auth flows, and restrained documentation cards.',
      '다크와 라이트를 모두 다듬은 실제 서비스형 플랫폼 스타일. 가운데 정렬한 인증 화면과 절제된 문서 카드가 핵심입니다.',
      'ダーク/ライト両対応の実サービス型プラットフォームスタイル。中央寄せの認証画面と抑えた文書カードが核です。',
    ),
  ),
  detail(
    'runtime-signal',
    'style',
    'Runtime Signal',
    ['dark', 'tech', 'minimal'],
    ['#0b0b0c', '#131416', '#74c2b4', '#c9a36a'],
    '#74c2b4',
    t(
      'Dark technical interface style with faint grid lines, crisp grotesk type, mono times and identifiers, and restrained mineral-teal accents.',
      '희미한 그리드 선, 선명한 그로테스크 서체, 모노 시간 표기와 식별자, 절제된 미네랄 틸 포인트 색을 갖춘 다크 기술 인터페이스 스타일.',
      '淡いグリッド、鋭いグロテスク書体、等幅の時刻表記と識別子、抑えたミネラルティールが効く、ダークな技術インターフェーススタイル。',
    ),
  ),
  detail(
    'holographic-fluid',
    'style',
    'Holographic Fluid',
    ['dark', 'bold', 'glass'],
    ['#0b0f19', '#ff7eb3', '#4facfe', '#c084fc'],
    '#ff7eb3',
    t(
      'One holographic object on a dark canvas with dreamy fluid motion.',
      '어두운 캔버스 위의 홀로그램 오브젝트 하나와 몽환적인 유체 모션.',
      '暗いキャンバス上のホログラフィックなオブジェクト一つと、夢のような流体モーション。',
    ),
  ),
  detail(
    'neon-drift',
    'style',
    'Neon Drift',
    ['dark', 'tech'],
    ['#05070f', '#e5f4ff', '#2ef2d5', '#ff745f'],
    '#2ef2d5',
    t(
      'Matte dark product UI. The default ION palette uses #05070f, #e5f4ff, #2ef2d5, and #ff745f, and neon is limited to thin keylines.',
      '매트한 다크 제품 UI. 기본 ION 팔레트는 #05070f, #e5f4ff, #2ef2d5, #ff745f이고 네온은 얇은 키라인에만 씁니다.',
      'マットなダーク製品UI。既定のIONパレットは #05070f、#e5f4ff、#2ef2d5、#ff745fで、ネオンは細いキーラインだけに使う。',
    ),
  ),
  detail(
    'glass-orbit',
    'style',
    'Glass Orbit',
    ['dark', 'glass', 'product'],
    ['#241024', '#3a1538', '#ff7ab8', '#fbeaf3'],
    '#ff7ab8',
    t(
      'Rose glass panes over a deep plum field, with glass used only where the subject is glass or where the eye looks through something.',
      '짙은 자두색 바탕 위의 로즈빛 유리 패널. 유리는 실제 유리인 대상이나 무언가를 통해 보는 자리에만 씁니다.',
      '深いプラム色の地に広がるローズ色のガラス板。ガラスは、対象が実際にガラスである場合や、向こうを透かして見る場面にだけ使います。',
    ),
  ),
  detail(
    'terminal-core',
    'style',
    'Terminal Core',
    ['dark', 'tech'],
    ['#071109', '#b9ffbe', '#d4ff5c', '#1e4f22'],
    '#b9ffbe',
    t(
      'Monospace fonts and developer console narrative.',
      '모노스페이스 폰트와 개발자 콘솔 내러티브.',
      '等幅フォントと開発者コンソールの物語性。',
    ),
  ),
  detail(
    'midnight-noir',
    'style',
    'Midnight Noir',
    ['dark', 'luxury'],
    ['#0c0e12', '#181a1f', '#c6a15b', '#ece4d4'],
    '#c6a15b',
    t(
      'A near-black page in warm ivory type, with one antique gold that marks only what is measured now and the active choice.',
      '거의 검은 바탕에 따뜻한 아이보리 글자. 앤티크 골드 하나로 지금 측정 중인 값과 선택된 항목만 표시합니다.',
      'ほぼ黒の地に温かみのあるアイボリーの文字。アンティークゴールド一色で、今計測している値と選択中の項目だけを示します。',
    ),
  ),
  detail(
    'console-launch',
    'style',
    'Console Launch',
    ['dual', 'tech', 'product'],
    ['#080808', '#121212', '#e6e6e6', '#10b981'],
    '#10b981',
    t(
      'Dark onboarding with interactive cursor and panels.',
      '다크 온보딩 방식의 인터랙티브 커서와 패널.',
      'ダークなオンボーディング、インタラクティブなカーソルとパネル。',
    ),
  ),
  detail(
    'bento-bloom',
    'style',
    'Bento Bloom',
    ['light', 'minimal', 'product'],
    ['#fffdf9', '#a7d3b8', '#f4d56a', '#f1c6a6'],
    '#f4d56a',
    t(
      'Soft pastel tones with an Apple-inspired bento grid.',
      '부드러운 파스텔 톤과 애플 감성의 벤토 구조.',
      '柔らかなパステルとApple風のベントーグリッド。',
    ),
  ),
  detail(
    'earth-atelier',
    'style',
    'Earth Atelier',
    ['light', 'nature', 'texture'],
    ['#f4f3f1', '#ab6b49', '#283a57', '#2e2a24'],
    '#ab6b49',
    t(
      'Undyed linen, plant dyes and quiet ink, where every coloured surface is a piece of dyed cloth.',
      '염색하지 않은 리넨, 식물 염료, 차분한 잉크. 색이 있는 면은 모두 염색한 천 한 조각입니다.',
      '無染色のリネン、植物染料、落ち着いたインク。色のついた面はすべて染めた布の一片です。',
    ),
  ),
  detail(
    'liquid-metal',
    'style',
    'Liquid Metal',
    ['dark', 'luxury', 'tech'],
    ['#0C0C0C', '#C0C0C0', '#FFFFFF', '#6B6B6B'],
    '#C0C0C0',
    t(
      'Chrome metallic reflections with monochrome silver palette.',
      '크롬과 메탈릭 질감의 반사 효과, 모노크롬 실버 팔레트.',
      'クロームと金属質の反射、モノクロームな銀のパレット。',
    ),
  ),
  detail(
    'aurora-gradient',
    'style',
    'Aurora Gradient',
    ['dark', 'motion', 'nature'],
    ['#070b1a', '#7be0a3', '#9d7bff', '#e4e5ee'],
    '#7be0a3',
    t(
      'A deep night-blue page where green and violet aurora glows in one band, and everything else is ruled lines and type.',
      '짙은 밤하늘색 페이지에서 초록과 보라의 오로라 빛이 한 띠로 흐르고, 나머지는 선과 타입으로만 구성됩니다.',
      '深い夜空色のページで、緑と紫のオーロラが一本の帯となって光り、それ以外は罫線と文字だけで構成されます。',
    ),
  ),
  detail(
    'zen-minimalism',
    'style',
    'Zen Minimalism',
    ['light', 'minimal'],
    ['#ffffff', '#3a3a36', '#8a8a85', '#1a1a18'],
    '#1a1a18',
    t(
      'Extreme whitespace and one monospace, where empty space, a ruled line and a short bar do all the work.',
      '극단적인 여백과 모노스페이스 글꼴 하나. 빈 공간, 구분선 하나, 짧은 막대 하나가 모든 역할을 합니다.',
      '極端な余白と一つの等幅書体。空白、罫線一本、短いバーだけで全体を成り立たせます。',
    ),
  ),
  detail(
    'mono-type',
    'style',
    'Mono Type',
    ['dual', 'minimal', 'editorial'],
    ['#111111', '#eeeeee', '#aaaaaa', '#7d7d7d'],
    '#eeeeee',
    t(
      'Monochrome style using only typographic weight and size for hierarchy.',
      '오직 타이포그래피의 크기와 무게로만 위계를 만드는 모노크롬 스타일.',
      '文字のサイズと太さだけで階層を作るモノクロームスタイル。',
    ),
  ),
  detail(
    'duotone-bold',
    'style',
    'Duotone Bold',
    ['dark', 'bold'],
    ['#0a0a0a', '#c5ff00', '#ff3b6b', '#0e1230'],
    '#c5ff00',
    t(
      'High-contrast duotone cards with bold typography and vibrant gradients.',
      '대담한 타이포그래피와 생동감 있는 그라데이션의 고대비 듀오톤 카드.',
      '大胆な書体と鮮やかなグラデーションの高コントラストなデュオトーン。',
    ),
  ),
  detail(
    'mesh-gradient',
    'style',
    'Mesh Gradient',
    ['light', 'bold', 'print'],
    ['#ffffff', '#96d0ff', '#6c63ff', '#1a1a2e'],
    '#6c63ff',
    t(
      'A soft multi-point mesh gradient printed on one poster, on a white page of ink and ruled lines.',
      '잉크와 줄 선이 있는 흰 페이지 위에, 포스터 한 장으로 인쇄된 부드러운 다중 점 메시 그라데이션.',
      'インクと罫線のある白いページに、一枚のポスターとして刷られた柔らかな多点メッシュグラデーション。',
    ),
  ),
  detail(
    'framer-motion',
    'style',
    'Framer Motion',
    ['dark', 'motion', 'product'],
    ['#0a0a0b', '#141416', '#8b5cf6', '#fafafa'],
    '#8b5cf6',
    t(
      'A near-black page where the work itself moves and every timing value is printed beside it, in one violet that marks time.',
      '거의 검은 페이지에서 작업물이 직접 움직이며, 모든 타이밍 값을 옆에 함께 적어 둡니다. 시간을 나타내는 보라색 하나를 씁니다.',
      'ほぼ黒のページで作品そのものが動き、すべてのタイミング値を横に併記します。時間を示す一色のバイオレットを使います。',
    ),
  ),
  detail(
    'claymorphism',
    'style',
    'Claymorphism',
    ['light', 'soft'],
    ['#fdfdfd', '#ff8b7e', '#7edbb0', '#414a52'],
    '#ff8b7e',
    t(
      'Soft volumetric clay for the things a child touches, on a plain white page with ruled lines.',
      '아이가 만지는 것들을 위한 부드럽고 입체적인 점토 질감. 줄 선이 있는 흰 페이지 위에 놓입니다.',
      '子どもが触れるもののための、やわらかく立体的な粘土の質感。罫線のある白いページに載せます。',
    ),
  ),
  detail(
    'neumorphism',
    'style',
    'Neumorphism',
    ['light', 'soft', 'minimal'],
    ['#e0e5ec', '#d45a10', '#13827c', '#344055'],
    '#d45a10',
    t(
      'Light and shadow emboss on one grey surface, used only on what you press, turn or drag.',
      '회색 면 하나에 빛과 그림자로 돋을새김을 주고, 누르거나 돌리거나 끄는 요소에만 씁니다.',
      '一枚のグレーの面に光と影で浮き彫りを作り、押す・回す・ドラッグする要素にだけ使います。',
    ),
  ),
  detail(
    'soft-pastel',
    'style',
    'Soft Pastel',
    ['light', 'minimal', 'soft'],
    ['#fbfafa', '#ff9a76', '#b09be8', '#3d3229'],
    '#ff9a76',
    t(
      'Ink on white with soft rounded corners, where pastel colour appears only as data, never as a background or a pill.',
      '흰 바탕에 잉크색 글자와 부드럽게 둥근 모서리. 파스텔 색은 데이터에만 쓰고 배경이나 알약형 버튼에는 쓰지 않습니다.',
      '白地にインクの文字、やわらかく丸い角。パステルカラーはデータにだけ使い、背景や丸型ボタンには使いません。',
    ),
  ),
  detail(
    'notion-style',
    'style',
    'Notion Style',
    ['light', 'minimal', 'product'],
    ['#ffffff', '#f7f6f3', '#37352f', '#2383e2'],
    '#2383e2',
    t(
      'Clean productivity UI with sidebar, block-based content, and minimal chrome.',
      '사이드바와 블록 기반 콘텐츠, 미니멀 크롬의 깔끔한 생산성 UI.',
      'サイドバー、ブロック型コンテンツ、最小限のクロームを持つ生産性UI。',
    ),
  ),
  detail(
    'retro-pixel',
    'style',
    'Retro Pixel',
    ['dark', 'retro'],
    ['#1a1c2c', '#333c57', '#a7f070', '#f77622'],
    '#a7f070',
    t(
      '8-bit pixel art aesthetic with Game Boy colors and RPG-style UI elements.',
      '게임보이 컬러와 RPG 스타일 UI 요소의 8비트 픽셀 아트 감성.',
      'Game BoyカラーとRPG風UIを持つ8-bitピクセルアート感。',
    ),
  ),
  detail(
    'y2k-retro',
    'style',
    'Windows 98',
    ['light', 'retro'],
    ['#008080', '#c0c0c0', '#000080', '#ffffff'],
    '#000080',
    t(
      'Windows 95/98 desktop chrome: teal #008080, silver #c0c0c0, navy title bars, and Tahoma. This is not a Y2K chrome style.',
      'Windows 95/98 데스크톱 크롬입니다. 틸 #008080, 은색 #c0c0c0, 남색 제목 표시줄, Tahoma. Y2K 크롬 스타일이 아닙니다.',
      'Windows 95/98のデスクトップクローム。ティール #008080、シルバー #c0c0c0、紺のタイトルバー、Tahoma。Y2Kクロームではない。',
    ),
  ),
  detail(
    'risograph-print',
    'style',
    'Risograph Print',
    ['light', 'print', 'texture'],
    ['#fefaf0', '#ff6b6b', '#4ecdc4', '#2a2015'],
    '#ff6b6b',
    t(
      'Limited spot colors, halftone dots, and charming misregistration of soy-based ink layers on textured paper.',
      '제한된 스팟 컬러와 하프톤 도트, 콩기름 잉크 특유의 매력적인 판 어긋남이 만드는 질감 있는 인쇄 감성.',
      '限られたスポットカラー、ハーフトーン、版ズレが生む質感ある印刷感。',
    ),
  ),
  detail(
    'paper-cut',
    'style',
    'Paper Cut',
    ['light', 'print', 'texture'],
    ['#ffffff', '#e8c5a5', '#8eb59b', '#486b8c'],
    '#486b8c',
    t(
      'Layered paper craft with cut shadows, flat matte colors, and tactile depth from stacked sheets.',
      '종이를 겹겹이 잘라 붙여 만든 입체적 깊이감, 플랫한 매트 컬러와 손에 잡힐 듯한 그림자의 공예 미학.',
      '切り重ねた紙、マットな色、積層影による触覚的なクラフト感。',
    ),
  ),
  detail(
    'macos-liquid-glass',
    'style',
    'macOS Liquid Glass',
    ['dual', 'glass', 'product'],
    ['#f7f9fb', '#ffffff', '#2f6feb', '#0a84ff'],
    '#2f6feb',
    t(
      'Translucent desktop UI in the shape of macOS 27 Liquid Glass. Liquid Glass began in macOS 26; the current Apple design kits are macOS 27.',
      'macOS 27 Liquid Glass 형태의 반투명 데스크톱 UI. Liquid Glass는 macOS 26에서 시작됐고, 현재 Apple 디자인 키트는 macOS 27입니다.',
      'macOS 27 Liquid Glassの形をした半透明デスクトップUI。Liquid GlassはmacOS 26で始まり、現行のAppleデザインキットはmacOS 27。',
    ),
  ),
  detail(
    'fusion-neon-swiss',
    'fusion',
    'Neon x Swiss',
    ['dark', 'bold', 'tech'],
    ['#06080f', '#16f2d1', '#7cc7ff', '#e6ff4d'],
    '#16f2d1',
    t('A perfect blend of neon energy and Swiss design alignment.', '네온의 에너지와 스위스식 정렬이 어우러진 조합.', 'ネオンのエネルギーとスイス的整列の融合。'),
    ['neon-drift', 'swiss-poster'],
  ),
  detail(
    'fusion-product-swiss',
    'fusion',
    'Product x Swiss',
    ['light', 'product', 'bold'],
    ['#fffdfa', '#e6dfd2', '#0b0b0b', '#ff5c35'],
    '#ff5c35',
    t('A crisp product-marketing canvas where Swiss grid discipline meets playful collaboration graphics.', '스위스 그리드의 정밀함에 협업 제품 그래픽의 경쾌함을 얹은 선명한 프로덕트 마케팅 캔버스.', 'スイスグリッドの精密さに、共同作業プロダクトの軽やかなグラフィックを重ねた明快な画面。'),
    ['swiss-poster', 'platform-core', 'kinetic-pop'],
  ),
  detail(
    'fusion-bento-noir',
    'fusion',
    'Bento x Noir',
    ['dark', 'luxury', 'product'],
    ['#0c0c10', '#0e0a08', '#c9a96e', '#c47a52'],
    '#c9a96e',
    t('Premium look combining efficient bento layout with dark luxury.', '효율적인 벤토 구조에 다크 럭셔리를 얹어낸 프리미엄 룩.', '効率的なベントー構造にダークラグジュアリーを重ねた見た目。'),
    ['bento-bloom', 'midnight-noir'],
  ),
  detail(
    'fusion-editorial-terminal',
    'fusion',
    'Editorial x Terminal',
    ['dark', 'editorial', 'tech'],
    ['#0a0e08', '#f4ecd6', '#ffb45a', '#7aff9c'],
    '#ffb45a',
    t('Editorial readability meets tech log aesthetics.', '에디토리얼 가독성과 기술 로그 감성의 조화.', '編集的な読みやすさと技術ログの美学の融合。'),
    ['editorial-silence', 'terminal-core'],
  ),
  detail(
    'fusion-holo-glass',
    'fusion',
    'Holo x Glass',
    ['dark', 'glass', 'bold'],
    ['#080a12', '#a5e3ff', '#b9a4ff', '#ff9ec4'],
    '#a5e3ff',
    t('A dreamy aurora background behind one frosted glass panel.', '몽환적인 오로라 배경 앞에 놓인 프로스트 글래스 패널 하나.', '夢のようなオーロラ背景の前に配置された、一枚のフロストガラスパネル。'),
    ['holographic-fluid', 'glass-orbit'],
  ),
  detail(
    'fusion-kinetic-brutal',
    'fusion',
    'Kinetic x Brutal',
    ['light', 'bold', 'motion'],
    ['#fff200', '#0a0a0a', '#ff2b1c', '#1f5bbf'],
    '#ff2b1c',
    t('Bold primary-color pop art with thick borders and destructive wireframes.', '강렬한 원색 팝아트와 두꺼운 테두리, 파괴적인 와이어프레임.', '強烈な原色ポップアート、太い罫線、破壊的なワイヤーフレーム。'),
    ['kinetic-pop', 'brutalist-grid'],
  ),
  detail(
    'fusion-cyber-console',
    'fusion',
    'Cyber x Console',
    ['dark', 'tech', 'bold'],
    ['#060608', '#ff2db1', '#a3ff2d', '#2df0ff'],
    '#ff2db1',
    t('A command-line console with three status neons and one static glitch on the wordmark.', '명령줄 콘솔에 상태를 나타내는 네온 세 가지와, 제품명 워드마크에 넣은 정적 글리치 하나를 담았습니다.', 'コマンドライン型のコンソールに、状態を示す3色のネオンと、製品名ワードマークの静的なグリッチ1つを備えた構成です。'),
    ['cyberpunk-glitch', 'console-launch'],
  ),
  detail(
    'fusion-grain-mono',
    'fusion',
    'Analog Press',
    ['light', 'print', 'editorial'],
    ['#f3eee3', '#1a1612', '#b85431', '#2e6f7d'],
    '#b85431',
    t('Film grain meets typewriter paperwork — one typed face, ink rules and off-white paper stock.', '필름 그레인과 타자기 문서의 만남 — 타자체 하나, 잉크 선, 오프화이트 용지.', 'フィルムの粒子感とタイプライター文書の融合 — 一つのタイプフェイス、インクの罫線、オフホワイトの用紙。'),
    ['mono-type', 'risograph-print'],
  ),
  detail(
    'fusion-clay-aurora',
    'fusion',
    'Clay Aurora',
    ['light', 'soft', 'motion'],
    ['#f6f4ff', '#c2efe0', '#5fb09c', '#6a5dd1'],
    '#5fb09c',
    t('Soft 3D clay elements, raised or pressed, under one band of dreamy northern light.', '솟아 있거나 눌린 부드러운 3D 클레이 요소가 몽환적인 북극광 띠 아래 놓인 스타일.', '浮き上がったり沈んだりする柔らかな3D粘土要素が、幻想的な北極光の帯の下に置かれたスタイル。'),
    ['claymorphism', 'aurora-gradient'],
  ),
  detail(
    'fusion-floppy-exe',
    'fusion',
    'Floppy.exe',
    ['light', 'retro', 'tech'],
    ['#008080', '#c0c0c0', '#060808', '#33ff66'],
    '#33ff66',
    t(
      'A Windows 98 desktop where a beveled window opens onto a phosphor terminal.',
      '베벨 윈도우를 열면 그 안에 인광 터미널이 있는 Windows 98 데스크톱입니다.',
      'ベベルウィンドウを開くと、その中でリン光ターミナルが動く Windows 98 デスクトップ。',
    ),
    ['y2k-retro', 'terminal-core'],
  ),
  detail(
    'fusion-noir-metal',
    'fusion',
    'Noir Metal',
    ['dark', 'luxury'],
    ['#000000', '#1a1612', '#ffb02e', '#3ce0c4'],
    '#ffb02e',
    t(
      'Cinematic black, one amber sodium light. Midnight Noir × Liquid Metal.',
      '시네마틱한 검정과 단 하나의 호박색 빛. Midnight Noir × Liquid Metal.',
      'シネマティックな黒に、ただ一つの琥珀色の光。Midnight Noir × Liquid Metal。',
    ),
    ['midnight-noir', 'liquid-metal'],
  ),
  detail(
    'fusion-strict-console',
    'fusion',
    'Strict Console',
    ['dark', 'tech', 'motion'],
    ['#0a0a0a', '#161616', '#ebebeb', '#ffb000'],
    '#ffb000',
    t(
      'A B2B SaaS landing rebuilt as a SOLARI split-flap departures board — mechanical, true-black, amber-accented.',
      'B2B SaaS 랜딩을 솔라리 스플릿플랩 출발 안내판으로 재구성 — 기계식, 진짜 검정, 앰버 포인트 색.',
      'B2B SaaSランディングをソラリ・スプリットフラップ出発案内板として再構築 — 機械式、真の黒、アンバー・アクセント。',
    ),
    ['swiss-poster', 'quiet-utility'],
  ),
  detail(
    'fusion-quiet-manifesto',
    'fusion',
    'Quiet Manifesto',
    ['light', 'editorial', 'tech'],
    ['#fafaf7', '#ece4ca', '#0a0a0a', '#6e1d1f'],
    '#6e1d1f',
    t(
      'A design-studio manifesto rendered as a draughtsman\'s technical sheet.',
      '제도사의 도면 시트처럼 그려낸 디자인 스튜디오 선언문.',
      '製図者の図面シートとしてレンダリングされたデザイン・スタジオ宣言。',
    ),
    ['brutalist-grid', 'mono-type'],
  ),
  detail(
    'fusion-pure-noir',
    'fusion',
    'Pure Noir',
    ['dark', 'product', 'minimal'],
    ['#08090a', '#0f0f11', '#fafafa', '#daa520'],
    '#daa520',
    t(
      'Near-black SaaS landing. One goldenrod, #DAA520, is used only on the brand wordmark. Every other color is neutral.',
      '거의 검정인 SaaS 랜딩. 골든로드 #DAA520은 브랜드 워드마크에만 씁니다. 나머지 색은 모두 무채색입니다.',
      'ほぼ黒のSaaSランディング。ゴールデンロッド #DAA520 はブランドのワードマークだけに使う。それ以外の色はすべて無彩色。',
    ),
    ['midnight-noir', 'platform-core'],
  ),
  detail(
    'fusion-soft-inflate',
    'fusion',
    'Soft Inflate',
    ['light', 'editorial', 'soft'],
    ['#ffffff', '#fafbfc', '#0a0c10', '#0ea5e9'],
    '#0ea5e9',
    t(
      'A quiet white page. Soft photographs of inflated forms — balloons, fabric, sky — sit on surfaces that gently rise and sink. Sky blue appears only four times.',
      '조용한 흰 페이지. 부드럽게 부푼 사물들의 사진 — 풍선, 천, 하늘 — 이 떠오르거나 가라앉는 표면 위에 놓입니다. 하늘색은 단 네 번만 등장합니다.',
      '静かな白いページ。膨らんだ事物の柔らかな写真 — 風船、布、空 — が、浮かんで沈む面の上に置かれる。空色は四度だけ姿を見せる。',
    ),
    ['neumorphism', 'editorial-silence'],
  ),
  detail(
    'fusion-studio-pixel',
    'fusion',
    'Studio Pixel',
    ['light', 'retro', 'product'],
    ['#fff4ee', '#080604', '#cf493c', '#2f8b8e'],
    '#cf493c',
    t(
      'A studio landing system where clean agency typography is interrupted by pixel utility type and a crooked service ticket board.',
      '깔끔한 스튜디오 타이포 위에 픽셀 라벨과 비뚤어진 서비스 티켓 보드를 얹은 스튜디오용 랜딩 스타일.',
      'クリーンなエージェンシー書体を、ピクセルのユーティリティ文字と歪んだサービスチケットボードが断ち切るスタジオ向けランディング。',
    ),
    ['retro-pixel', 'swiss-poster', 'platform-core'],
  ),
];

export const styles = styleCatalog.filter((item) => item.kind === 'style');
export const fusionStyles = styleCatalog.filter((item) => item.kind === 'fusion');
export const styleById = new Map(styleCatalog.map((style) => [style.id, style]));

export const styleTags = ['dark', 'light', 'dual', 'minimal', 'bold', 'soft', 'tech', 'product', 'editorial', 'luxury', 'nature', 'motion', 'glass', 'retro', 'print', 'texture'];

export function getStyleById(id: string | null | undefined): StyleData | undefined {
  return id ? styleById.get(id) : undefined;
}

export function localize(text: LocalizedText, lang: Lang): string {
  return text[lang] || text.en;
}
