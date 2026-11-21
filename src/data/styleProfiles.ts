import { styleCatalog, type LocalizedText } from './styles';

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

/**
 * The direction copy behind each style in styles.ts.
 * The style page, purpose discovery, the MCP catalog and the agent handoff read it;
 * the tool pages do not, so it stays out of their bundles.
 */
export interface StyleProfile {
  summary: LocalizedText;
  promptProfile: PromptProfile;
  visualProfile: VisualProfile;
}

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

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

const profile = (id: string, summary: LocalizedText, promptProfile: PromptProfile, visualProfile: VisualProfile): [string, StyleProfile] => [
  id,
  { summary, promptProfile, visualProfile },
];

const styleProfiles = new Map<string, StyleProfile>([
  profile(
    'brutalist-grid',
    t(
      'High-contrast boxes, unforgiving alignment, and visible structure for products that need attitude.',
      '고대비 박스와 타협 없는 정렬, 드러난 구조로 강한 태도가 필요한 제품에 어울립니다.',
      '高コントラストの箱、厳密な整列、見える構造で強い姿勢を出します。',
    ),
    prompt('Mono or compressed grotesk, large weight jumps', 'Hard grid, thick rules, block sections', 'Minimal snaps and abrupt hover shifts', ['developer tools', 'manifestos', 'launch pages'], ['No soft shadows', 'No decorative gradients'], ['healthcare', 'children products', 'wellness apps', 'finance trust products']),
    visual('uppercase blocks', 'white panels with black rules', 'strict modular grid'),
  ),
  profile(
    'editorial-silence',
    t(
      'A calm editorial system where hierarchy comes from type scale, measure, and deliberate silence.',
      '타입 스케일과 문장 폭, 의도적인 여백으로 위계를 잡는 차분한 에디토리얼 시스템입니다.',
      '文字サイズ、行幅、意図した余白で階層を作る静かな編集的システムです。',
    ),
    prompt('Serif headline with quiet sans body', 'Single-column reading flow with wide margins', 'Subtle fade and underline transitions', ['essays', 'portfolios', 'premium docs'], ['No icon grids', 'No saturated accents'], ['gaming launches', 'flash commerce', 'developer dashboards', 'high-energy campaigns']),
    visual('serif rhythm', 'paper-white surface', 'long-form spacing'),
  ),
  profile(
    'kinetic-pop',
    t(
      'Posters, oversized labels, and punched-up actions for pages that should feel loud and immediate.',
      '포스터와 큰 라벨, 강한 액션으로 즉각적이고 에너지 넘치는 페이지에 잘 맞습니다.',
      'ポスター的な大きなラベルと強いアクションで即時性を出します。',
    ),
    prompt('Heavy geometric sans with compressed labels', 'Asymmetric cards and oversized calls to action', 'Springy hover, staggered entrances', ['campaigns', 'events', 'creator products'], ['No muted monochrome', 'Avoid timid spacing'], ['B2B operational dashboards', 'enterprise admin', 'financial reporting', 'medical or legal products']),
    visual('oversized display type', 'primary color surfaces', 'staggered pop rhythm'),
  ),
  profile(
    'cyberpunk-glitch',
    t(
      'A high-voltage interface language for games and speculative fiction, not for products that have to be trusted.',
      '게임과 가상 세계관에 쓰는 강렬한 인터페이스 언어입니다. 신뢰를 져야 하는 제품에는 쓰지 않습니다.',
      'ゲームと仮想世界観に使う高電圧のUIです。信頼を要する製品には使いません。',
    ),
    prompt('Mono labels with neon display headlines', 'Layered dark panels and scanline dividers', 'Glitch flicker, cursor blinks, sharp hovers', ['game launchers', 'speculative fiction', 'crypto toys'], ['Do not overuse blur', 'Keep text contrast high', 'Do not use for security, safety, or trust products'], ['healthcare apps', 'financial trust products', 'children products', 'editorial publications', 'security products']),
    visual('neon terminal type', 'dark glass panels', 'glitch pulses'),
  ),
  profile(
    'swiss-poster',
    t(
      'International Typographic Style translated into a product page: precise, lean, and confident.',
      '국제 타이포그래피 양식을 제품 페이지로 옮긴, 정확하고 군더더기 없는 방향입니다.',
      '国際タイポグラフィ様式をプロダクトページに移した正確で無駄のない方向です。',
    ),
    prompt('Neo-grotesk sans, strict type scale', '12-column grid, hard alignment, red markers', 'Almost static, purposeful state changes only', ['information products', 'guides', 'architecture studios'], ['No centered paragraphs', 'No random decoration'], ['casual consumer apps', 'playful onboarding', 'gaming UI', 'illustrative storytelling']),
    visual('grid-first type', 'flat white canvas', 'poster-like rhythm'),
  ),
  profile(
    'quiet-utility',
    t(
      'A practical product interface that favors scanning, repeated work, and trust over spectacle.',
      '화려함보다 훑어보기 쉬움과 반복 업무, 신뢰를 우선하는 실무형 제품 인터페이스입니다.',
      '派手さよりも一覧性、反復作業、信頼を重視する実務的なUIです。',
    ),
    prompt('Readable sans, compact labels, clear weights', 'Dense but breathable dashboards and forms', 'Fast restrained transitions', ['B2B SaaS', 'ops dashboards', 'admin tools'], ['No oversized hero cards', 'No decorative illustration'], ['consumer marketing pages', 'creator launches', 'campaign sites', 'gaming and entertainment']),
    visual('compact work type', 'white and slate panels', 'steady operational cadence'),
  ),
  profile(
    'platform-core',
    t(
      'A developer-platform surface that looks deployable: auth, docs, billing, and product primitives feel aligned.',
      '인증, 문서, 결제, 제품 기본 요소를 실제 배포할 수 있는 플랫폼처럼 가지런히 맞춥니다.',
      '認証、ドキュメント、課金、製品の基本要素が実際に運用できるプラットフォームのように揃います。',
    ),
    prompt('Neutral sans with documentation mono accents', 'Centered flows plus thin-line resource cards', 'Small fades and focus states', ['developer platforms', 'SaaS onboarding', 'API products'], ['Avoid novelty styling', 'Keep contrast policy strict'], ['playful consumer products', 'lifestyle apps', 'editorial publications', 'art portfolios']),
    visual('platform headline', 'dual-theme cards', 'documentation cadence'),
  ),
  profile(
    'runtime-signal',
    t(
      'Feels like a runtime dashboard and a deploy record in one surface.',
      '런타임 대시보드와 배포 기록을 한 화면에 합친 듯한 인상입니다.',
      'ランタイムダッシュボードとデプロイ記録を一つの画面にまとめたような印象です。',
    ),
    prompt('Crisp grotesk headings and mono metadata', 'One flat dark surface with faint grid lines', 'Precise hover transitions, 160ms at most', ['observability', 'infra dashboards', 'technical docs'], ['No glow overload', 'No low-contrast code'], ['consumer marketing', 'lifestyle apps', 'storytelling pages', 'children or education products']),
    visual('technical heading', 'grid-dark flat surface', 'status signal rhythm'),
  ),
  profile(
    'holographic-fluid',
    t(
      'One iridescent object and soft spatial depth for experimental premium experiences.',
      '무지갯빛 오브젝트 하나와 부드러운 공간 깊이로 실험적인 프리미엄 경험을 만듭니다.',
      '虹色のオブジェクト一つと柔らかな奥行きで、実験的なプレミアム体験を作ります。',
    ),
    prompt('Light soft-serif headings with mono figures', 'One iridescent object beside plain ruled rows', 'Slow fluid shifts, hue follows the pointer', ['AI tools', 'creative portfolios', 'premium launches'], ['Keep text on the dark canvas', 'Respect reduced motion'], ['enterprise admin', 'financial dashboards', 'documentation sites', 'high-density data tools']),
    visual('light soft-serif type', 'one iridescent object on dark', 'slow shimmer cadence'),
  ),
  profile(
    'neon-drift',
    t(
      'A command surface where glow is a status mark, not a poster effect. Other named palettes replace the whole accent pair.',
      '글로우가 포스터 효과가 아니라 상태 표시인 커맨드 면입니다. 다른 이름의 팔레트는 액센트 쌍을 통째로 바꿉니다.',
      'グローをポスター効果ではなく状態表示にするコマンド面。名前付きパレットはアクセントの組をまとめて入れ替える。',
    ),
    prompt('Precise technical sans, no glow on type', 'Matte dark panels, thin active keylines, compact status cells', 'Almost none: a slow scanline or opacity shift only', ['product dashboards', 'creative tools', 'night interfaces'], ['No large glow halos', 'No sci-fi HUD labels', 'Neon only as keylines, chart strokes, and focus'], ['enterprise B2B', 'healthcare', 'legal or financial trust products', 'editorial long-form']),
    visual('calm technical sans', 'matte dark command surface', 'slow scanline'),
  ),
  profile(
    'glass-orbit',
    t(
      'Glass marks what is really glass: the layers of a lens, a lens over a chart, one booking pane. Text and tables sit flat on the plum.',
      '유리는 실제 유리인 대상에만 씁니다. 렌즈의 겹, 차트 위의 렌즈, 예약 패널 하나가 그 예입니다. 텍스트와 표는 자두색 바탕에 평평하게 놓입니다.',
      'ガラスは実際にガラスであるものにだけ使います。レンズの層、チャートに重ねたレンズ、予約パネル一枚がその例です。テキストと表はプラム色の地に平らに置きます。',
    ),
    prompt('Wide flat-sided display with a plain grotesk body', 'Glass panes on the subject only, flat ruled content', 'A 400ms tint fade and 160ms colour changes', ['optics and eyewear', 'premium product pages', 'spatial product UI'], ['Glass only on the subject: panes, a lens, one booking pane', 'No glass cards, gradient text or palette switchers'], ['high-density admin tools', 'editorial documentation', 'wellness or craft brands', 'retro products']),
    visual('wide flat-sided display type', 'rose glass panes over plum', 'layered lens rhythm'),
  ),
  profile(
    'terminal-core',
    t(
      'A command-line mood for developer-native products and technical storytelling.',
      '개발자 친화 제품과 기술 스토리텔링에 어울리는 커맨드라인 무드입니다.',
      '開発者向け製品と技術的ストーリーに合うコマンドラインのムードです。',
    ),
    prompt('Monospace everywhere with restrained weights', 'Console frames, log rows, prompt blocks', 'Cursor blink, line reveal, command copy feedback', ['CLIs', 'developer tools', 'automation products'], ['Do not fake unreadable code', 'Avoid rainbow terminal colors'], ['consumer SaaS', 'marketing campaigns', 'editorial pages', 'wellness and lifestyle']),
    visual('terminal prompt type', 'green-black panels', 'command-line rhythm'),
  ),
  profile(
    'midnight-noir',
    t(
      'Precise figures read in low light: high-contrast serif numerals, ruled lists and square corners for premium services.',
      '어두운 곳에서도 읽히는 정확한 숫자. 대비가 강한 세리프 숫자, 선으로 구분한 목록, 각진 모서리로 프리미엄 서비스를 보여줍니다.',
      '暗い照明でも読める正確な数字。コントラストの強いセリフ体の数字、罫線で区切ったリスト、角ばった枠で高級サービスを示します。',
    ),
    prompt('High-contrast serif figures with a plain sans body', 'Ruled readouts, price lists and booking rows', 'A 160ms colour change on hover only', ['luxury commerce', 'premium services', 'repair and appointment booking'], ['Gold only on what is measured or chosen', 'No bright saturated palette'], ['developer tools', 'operational dashboards', 'casual consumer apps', 'children products']),
    visual('high-contrast serif figures', 'ruled near-black surface', 'quiet measured cadence'),
  ),
  profile(
    'console-launch',
    t(
      'A launch interface that makes setup, status, and next actions feel immediate.',
      '설정과 상태, 다음 할 일을 곧바로 보여 주는 런칭 인터페이스입니다.',
      'セットアップ、状態、次の行動を即座に見せるローンチUIです。',
    ),
    prompt('Mono labels with pragmatic sans content', 'Setup panels, keycaps, status columns', 'Cursor, keypress, and panel activation motion', ['onboarding', 'CLI products', 'beta launches'], ['Avoid heavy marketing hero language', 'Keep actions obvious'], ['marketing landing pages', 'editorial publications', 'consumer commerce', 'luxury brand sites']),
    visual('setup console type', 'dark launch panels', 'activation rhythm'),
  ),
  profile(
    'bento-bloom',
    t(
      'A friendly modular layout for communicating multiple features without visual noise.',
      '시각적 잡음 없이 여러 기능을 전달하는 친근한 모듈형 레이아웃입니다.',
      '複数機能を視覚的なノイズなく伝える親しみやすいモジュール構成です。',
    ),
    prompt('Rounded sans, friendly weights, compact captions', 'Bento grid with feature cards and small metrics', 'Gentle hover lift and card reveal', ['consumer SaaS', 'productivity tools', 'feature pages'], ['No nested cards', 'Avoid one-note pastel wash'], ['luxury brand sites', 'editorial publications', 'security or dev tools', 'finance trust products']),
    visual('friendly product type', 'warm bento cards', 'modular bloom rhythm'),
  ),
  profile(
    'earth-atelier',
    t(
      'Warm tactile design language for brands that need calm craft instead of corporate polish.',
      '기업적인 광택 대신 차분한 공예 감각이 필요한 브랜드를 위한 따뜻하고 손에 잡히는 디자인입니다.',
      '企業的な艶より静かなクラフト感が必要なブランド向けです。',
    ),
    prompt('One-weight serif and sans, hierarchy by size', 'Ruled lists, square corners, cloth drawn to scale', 'A chosen dye soaks in over 0.45s; nothing else moves', ['wellness', 'studios', 'food and craft brands'], ['Colour only as dyed cloth, never flat blocks', 'Avoid hyper-saturated accents'], ['developer tools', 'gaming or tech launches', 'corporate enterprise dashboards', 'high-density data UI']),
    visual('one-weight shop-sign serif', 'dyed cloth on undyed linen', 'ruled shop-list rhythm'),
  ),
  profile(
    'liquid-metal',
    t(
      'A reflective premium technology direction with restrained copy and strong material presence.',
      '절제된 문구와 강한 소재감이 살아 있는, 빛을 반사하는 프리미엄 기술 방향입니다.',
      '控えめなコピーと強い素材感を持つ、光を反射するプレミアム技術表現です。',
    ),
    prompt('Sharp sans with metallic display treatments', 'Chrome cards, black negative space, product-like slabs', 'Specular hover shimmer and slow reveal', ['hardware', 'luxury tech', 'automotive'], ['Do not use rainbow chrome everywhere', 'Keep body text flat'], ['B2B SaaS dashboards', 'editorial content sites', 'wellness and lifestyle', 'children and education']),
    visual('metal display type', 'chrome surfaces', 'reflective cadence'),
  ),
  profile(
    'aurora-gradient',
    t(
      'The aurora glows in one place only, behind the forecast; elsewhere one flat green marks what the visitor has chosen.',
      '오로라 빛은 예보 뒤 한 곳에서만 빛납니다. 그 밖에서는 방문자가 고른 항목을 단색 초록 하나로 표시합니다.',
      'オーロラの光は予報の背後の一箇所だけで輝きます。それ以外では、訪問者が選んだ項目を緑の単色で示します。',
    ),
    prompt('Screen serif headlines and figures, plain sans text', 'One aurora band, ruled boards and timetables', 'Only the band drifts, over 18s to 26s', ['travel and tours', 'event booking', 'night and outdoor brands'], ['No text directly on low-contrast gradients', 'Respect reduced motion'], ['operational dashboards', 'documentation sites', 'finance trust products', 'admin tools']),
    visual('screen serif figures', 'one aurora band on night blue', 'slow drift in one band'),
  ),
  profile(
    'zen-minimalism',
    t(
      'One column of ruled rows in wide empty space, with nothing added for decoration.',
      '넓은 빈 여백 안에 구분선으로 나뉜 행이 한 줄로 놓입니다. 장식은 더하지 않습니다.',
      '広い余白の中に、罫線で区切られた行が一列に並びます。装飾は加えません。',
    ),
    prompt('One monospace, weights 400 to 600, no italics', 'One column from a quarter of the width, ruled rows', 'None but a smooth scroll to the form', ['galleries', 'mindfulness', 'small hospitality bookings'], ['No crowded grids', 'One colour: ink on white'], ['dense data dashboards', 'gaming and entertainment', 'high-energy campaigns', 'feature-rich SaaS']),
    visual('quiet monospace type', 'empty white page', 'breathing rhythm'),
  ),
  profile(
    'mono-type',
    t(
      'Typography as the interface: no color crutches, no extra ornament.',
      '색이나 장식에 기대지 않고 타이포그래피 자체가 인터페이스가 됩니다.',
      '色や装飾に頼らず、タイポグラフィそのものがUIになります。',
    ),
    prompt('Mono or grotesk type with strict weights', 'Text-led layouts, black-white blocks, list systems', 'Instant, editorial transitions', ['docs', 'archives', 'minimal portfolios'], ['No accent palette', 'No heavy shadow'], ['marketing campaigns', 'consumer commerce', 'gaming and playful apps', 'data visualization tools']),
    visual('type-only hierarchy', 'monochrome slabs', 'reading rhythm'),
  ),
  profile(
    'duotone-bold',
    t(
      'A focused two-color system for content libraries, music products, and punchy media surfaces.',
      '콘텐츠 라이브러리, 음악 제품, 강렬한 미디어 면에 어울리는 두 가지 색 중심의 시스템입니다.',
      'コンテンツライブラリ、音楽製品、強いメディア面に合う二色中心のシステムです。',
    ),
    prompt('Heavy sans with compact uppercase labels', 'Duotone cards, horizontal media rails, bold CTAs', 'Card scale hovers and row reveals', ['music apps', 'media libraries', 'creator tools'], ['No multicolor palette creep', 'Keep black base stable'], ['B2B admin', 'finance dashboards', 'documentation sites', 'wellness apps']),
    visual('duotone media type', 'dark vivid cards', 'rail-based rhythm'),
  ),
  profile(
    'mesh-gradient',
    t(
      'One printed poster carries the whole colour field; around it, heavy display type, timetables and tables stay ink on white.',
      '색면 전체는 인쇄된 포스터 한 장이 담당합니다. 그 주변의 굵은 디스플레이 타입, 시간표, 표는 흰 바탕에 잉크로만 찍힙니다.',
      '色面全体は印刷された一枚のポスターが担います。その周囲の太いディスプレイ書体、時刻表、表は白地にインクだけで組みます。',
    ),
    prompt('Heavy tight display with a plain text partner', 'One mesh poster, white ruled sections', 'None: the poster is a print, states change at once', ['events and conferences', 'consumer apps', 'landing pages'], ['The mesh stays on the poster', 'Keep copy areas solid'], ['developer tools', 'admin and data dashboards', 'editorial documentation', 'craft or wellness brands']),
    visual('heavy screen-print display', 'one mesh poster on white', 'printed programme rhythm'),
  ),
  profile(
    'framer-motion',
    t(
      'A motion-first reference where each piece plays in a viewer with its keyframes, curve and layers, like a motion editor.',
      '각 작업이 키프레임, 곡선, 레이어와 함께 뷰어에서 재생되는, 모션 편집기처럼 쓰인 모션 중심 레퍼런스입니다.',
      '各作品がキーフレーム、カーブ、レイヤーとともにビューアーで再生される、モーションエディターのようなモーション中心のリファレンスです。',
    ),
    prompt('Wide display headings, tabular timing figures', 'Viewer, keyframe timeline and inspector per case', 'Looping scenes with shared pause and speed', ['motion studios', 'animation tools', 'creative portfolios'], ['Respect prefers-reduced-motion', 'Only the work moves; nothing decorative'], ['accessibility-critical products', 'documentation sites', 'long-form editorial', 'low-motion contexts']),
    visual('wide motion-studio type', 'dark stages with timelines', 'looped playback rhythm'),
  ),
  profile(
    'claymorphism',
    t(
      'Tactile clay for shapes, answer tiles and one kind of button; everything a parent reads stays ink on white.',
      '도형, 정답 타일, 한 종류의 버튼에만 점토 질감을 씁니다. 부모가 읽는 내용은 모두 흰 바탕에 잉크색으로 둡니다.',
      '図形、回答タイル、一種類のボタンにだけ粘土の質感を使います。保護者が読む内容はすべて白地にインクの色で置きます。',
    ),
    prompt('Round heavy display, highly legible body', 'Clay on the play screen only, ruled reading pages', 'Keys and tiles sink in 80ms; nothing floats', ['education', 'children products', 'creator tools'], ['Clay only on what is touched', 'Do not over-stack shadows'], ['professional B2B', 'finance or legal', 'developer tools', 'security products']),
    visual('round heavy display type', 'clay pieces on white', 'short press rhythm'),
  ),
  profile(
    'neumorphism',
    t(
      'A soft hardware-like UI language for controls, calculators, and tactile settings.',
      '컨트롤, 계산기, 손맛 있는 설정 화면에 어울리는 부드러운 하드웨어형 UI 언어입니다.',
      'コントロール、計算機、触覚的な設定画面に合う柔らかなハードウェア風UIです。',
    ),
    prompt('Grotesk names with mono instrument readings', 'Raised and pressed controls; flat text and charts', 'Keys press in over 120ms', ['settings panels', 'thermostats and IoT controls', 'calculators'], ['Every soft shape keeps a hard edge on its shadow side', 'Avoid large text on embossed surfaces'], ['content-heavy sites', 'editorial publications', 'marketing campaigns', 'high-density dashboards']),
    visual('instrument-panel type', 'raised keys on one grey', 'pressed-state rhythm'),
  ),
  profile(
    'soft-pastel',
    t(
      'Gentle, pleasant interface tone for personal tools and lightweight lifestyle products.',
      '개인용 도구와 가벼운 라이프스타일 제품에 어울리는 부드럽고 편안한 인터페이스 톤입니다.',
      '個人ツールや軽いライフスタイル製品に合う穏やかなUIトーンです。',
    ),
    prompt('A warm serif for what people write, a grotesk for the app', 'Rounded panels in ink on white, pastel only in data', 'One 0.2s rise on the chosen mood', ['personal apps', 'lifestyle products', 'journals'], ['Avoid low-contrast pastel text', 'Pastel only as data: no pastel backgrounds or buttons'], ['enterprise B2B', 'developer tools', 'finance or legal', 'gaming or security']),
    visual('warm serif with a plain grotesk', 'ink on white with pastel data', 'gentle rhythm'),
  ),
  profile(
    'notion-style',
    t(
      'A writing-and-organization surface optimized for clarity, hierarchy, and editing flow.',
      '명료함과 위계, 편집 흐름에 최적화된 작성·정리용 면입니다.',
      '明瞭さ、階層、編集の流れに最適化された作成/整理画面です。',
    ),
    prompt('System-like sans, compact text, tiny labels', 'Sidebar plus block content with subtle dividers', 'Tiny hover affordances and command states', ['knowledge bases', 'dashboards', 'collaboration tools'], ['No heavy shadows', 'No decorative backgrounds'], ['marketing landing pages', 'gaming and entertainment', 'high-energy launches', 'luxury commerce']),
    visual('block editor type', 'clean document surface', 'editorial utility rhythm'),
  ),
  profile(
    'retro-pixel',
    t(
      'A nostalgic game-interface language for playful products and retro communities.',
      '경쾌한 제품과 레트로 커뮤니티에 어울리는 향수 어린 게임 인터페이스 언어입니다.',
      '遊び心ある製品やレトロコミュニティに合う懐かしいゲームUIです。',
    ),
    prompt('Pixel or mono type with hard edges', 'Pixel frames, RPG panels, inventory-like grids', 'Step-based animation and sprite-like hover', ['games', 'communities', 'collectibles'], ['No anti-aliased glossy cards', 'Keep hit targets usable'], ['B2B SaaS', 'professional services', 'finance or legal', 'enterprise admin', 'wellness apps']),
    visual('pixel label type', 'game panels', 'stepped rhythm'),
  ),
  profile(
    'y2k-retro',
    t(
      'The id stays y2k-retro. The page and the /pages/windows-98 alias describe the beveled desktop that is actually shown.',
      'id는 y2k-retro로 둡니다. 페이지와 /pages/windows-98 별칭은 실제로 보이는 베벨 데스크톱을 가리킵니다.',
      'idは y2k-retro のまま。ページと /pages/windows-98 の別名は、実際に表示されるベベルデスクトップを指す。',
    ),
    prompt('Tahoma-like sans, tiny UI labels', 'Window chrome, menu bars, beveled buttons', 'Instant pressed states, no smooth transitions', ['retro docs', 'launchers', 'indie tools'], ['No modern rounded cards', 'Keep spacing compact'], ['modern enterprise SaaS', 'finance or legal trust products', 'wellness and lifestyle apps', 'premium luxury']),
    visual('classic desktop type', 'beveled chrome windows', 'instant UI rhythm'),
  ),
  profile(
    'risograph-print',
    t(
      'A print-shop visual system with tactile paper and deliberate imperfect color separation.',
      '손에 닿는 듯한 종이 질감과 일부러 어긋낸 색 분판이 어우러진 인쇄소풍 시각 시스템입니다.',
      '触感のある紙と意図した色分解のずれを持つ印刷所的な視覚システムです。',
    ),
    prompt('Editorial serif plus stamped labels', 'Paper texture, two-color layers, registration marks', 'Low-fi layer offsets and print proof reveals', ['art projects', 'zines', 'creative studios'], ['Limit to two or three spot colors', 'Keep body text on quiet paper'], ['developer dashboards', 'finance applications', 'enterprise SaaS', 'high-density data tools']),
    visual('printed label type', 'paper ink layers', 'misregistered print rhythm'),
  ),
  profile(
    'paper-cut',
    t(
      'A handcrafted layered system for warm storytelling and tactile product explanations.',
      '따뜻한 스토리텔링과 손에 잡힐 듯한 제품 설명을 위한 수공예 레이어 시스템입니다.',
      '暖かなストーリーテリングと触感ある製品説明のための手作りレイヤーです。',
    ),
    prompt('Friendly serif/sans with cutout labels', 'Layered sheets, tabs, shadow-only depth', 'Lift on hover and staged paper reveals', ['education', 'craft brands', 'story pages'], ['No glossy gradients on paper shapes', 'Keep shadows directional'], ['developer tools', 'B2B SaaS dashboards', 'finance or legal', 'high-density data']),
    visual('craft label type', 'stacked paper layers', 'cutout reveal rhythm'),
  ),
  profile(
    'macos-liquid-glass',
    t(
      'A practical Apple-platform surface for product dashboards that need native familiarity, depth, and careful text clarity.',
      '네이티브한 익숙함과 깊이, 또렷한 텍스트가 필요한 제품 대시보드에 어울리는 Apple 플랫폼형 면입니다.',
      'ネイティブな親しみ、奥行き、テキストの明瞭さが必要なプロダクトダッシュボード向けのAppleプラットフォーム調サーフェスです。',
    ),
    prompt('SF-style system sans with compact labels and clear hierarchy', 'Desktop window chrome, translucent sidebars, sheets, segmented controls, dock layer', 'Subtle refraction shifts, focus rings, and sheet depth transitions', ['macOS apps', 'admin dashboards', 'creative tools'], ['Never place long body copy on busy glass', 'Keep controls functional, not decorative'], ['print-style editorial', 'craft or wellness brands', 'gaming and entertainment', 'retro or nostalgic products']),
    visual('system glass type', 'translucent desktop windows', 'native control rhythm'),
  ),
  profile(
    'fusion-neon-swiss',
    t('Swiss grid discipline holds neon drama in place.', '스위스 그리드가 네온의 드라마를 단단히 붙잡습니다.', 'スイスグリッドがネオンの演出を制御します。'),
    prompt('Clean grotesk with mono clock figures', 'Strict 12-column grid of ruled tables', 'Colour change on hover, 160ms at most', ['AI dashboards', 'event tech', 'launch pages'], ['Keep alignment strict', 'Do not flood every edge with neon'], ['wellness apps', 'editorial long-form', 'children products', 'craft or lifestyle brands']),
    visual('grid-set grotesk type', 'dark ruled tables', 'disciplined colour-code rhythm'),
  ),
  profile(
    'fusion-product-swiss',
    t('Use it when a page should feel clean, real, and optimistic without drifting into generic AI SaaS gradients.', '깔끔하고 진짜 제품처럼 느껴지면서도 흔한 AI SaaS 그라데이션으로 흐르지 않아야 할 때 이 스타일을 씁니다.', 'ページを清潔で実在感のある楽観的な印象にしつつ、よくあるAI SaaSのグラデーションから離したい時に合います。'),
    prompt('Confident grotesk headlines, calm product body copy, mono utility labels', 'Large white canvas, 12-column alignment, product UI frames, small collaboration objects, controlled color islands', 'Short staggered reveals, cursor nudge, comment-card lift, no background spectacle', ['collaboration tools', 'design systems', 'AI product builders', 'creative SaaS launches'], ['Keep the canvas mostly white', 'Use color as object, not atmosphere', 'Show product UI or workflow artifacts', 'Avoid glossy purple gradients'], ['gaming and entertainment', 'craft or wellness brands', 'luxury commerce', 'long-form editorial']),
    visual('clean product headline', 'white canvas with UI frames', 'playful but governed rhythm'),
  ),
  profile(
    'fusion-bento-noir',
    t('Modular luxury for premium platforms with many features.', '기능이 많은 프리미엄 플랫폼에 어울리는 모듈형 럭셔리입니다.', '機能の多いプレミアムなプラットフォームに合うモジュール型ラグジュアリーです。'),
    prompt('Elegant sans/serif pairing', 'One lacquer tray, gold-ruled compartments', 'A 160ms colour change on hover only', ['premium SaaS', 'membership products', 'finance'], ['No playful pastel drift', 'Keep gold sparse'], ['developer tools', 'craft or wellness brands', 'children or education products', 'playful consumer apps']),
    visual('luxury module type', 'one dark lacquer tray', 'premium modular rhythm'),
  ),
  profile(
    'fusion-editorial-terminal',
    t('A magazine format with enough machine-log texture to feel technical.', '기술적인 느낌이 들 만큼 기계 로그 질감을 더한 매거진 형식입니다.', '技術的に感じられる程度に機械ログの質感を加えた、雑誌形式です。'),
    prompt('Serif headlines and prose, mono machine text', 'Article column with margin notes and log figures', 'None: hover only thickens an underline', ['technical docs', 'release pages', 'developer education'], ['Keep body reading comfortable', 'Do not turn the whole page into code'], ['marketing landing pages', 'consumer commerce', 'wellness and lifestyle', 'gaming and entertainment']),
    visual('display-cut serif headline type', 'ruled article and log columns', 'long-read magazine rhythm'),
  ),
  profile(
    'fusion-holo-glass',
    t('Iridescent glass for premium AI and creator products.', '프리미엄 AI·크리에이터 제품에 어울리는 무지갯빛 글래스입니다.', 'プレミアムAIやクリエイター製品に合う虹色のガラス表現です。'),
    prompt('Condensed sans headlines, plain sans text', 'Slow aurora behind one frosted glass panel', 'Brightness follows state, slow color drift', ['AI tools', 'creative suites', 'premium dashboards'], ['Do not place text on uncontrolled gradients', 'Limit blur depth'], ['admin dashboards', 'finance or legal', 'editorial documentation', 'craft and wellness']),
    visual('holo glass type', 'one frosted glass panel', 'slow aurora rhythm'),
  ),
  profile(
    'fusion-kinetic-brutal',
    t('Maximum energy with structural guardrails.', '구조라는 안전선을 두른 최고 에너지의 스타일입니다.', '構造のガードレールを持つ最大エネルギーのスタイルです。'),
    prompt('Heavy sans/mono labels, loud type scale', 'Thick bordered modules, oversized shapes, raw grids', 'Punchy spring motion and abrupt section shifts', ['campaign pages', 'events', 'creator drops'], ['Keep layout readable', 'Use loud color intentionally'], ['B2B trust products', 'finance or legal', 'wellness apps', 'documentation sites']),
    visual('loud block type', 'primary-color wireframes', 'impact rhythm'),
  ),
  profile(
    'fusion-cyber-console',
    t('A terminal page whose three neons each carry one fixed meaning.', '네온 세 가지가 각각 고정된 의미를 하나씩 맡은 터미널 페이지입니다.', '3色のネオンがそれぞれ一つの固定された意味を担うターミナルページです。'),
    prompt('One mono family, hierarchy by weight and width', 'Split terminal window plus ruled command table', 'None: static cursor, instant colour changes', ['game ops', 'speculative launches', 'automation toys'], ['Do not fake inaccessible text', 'Throttle glitch effects', 'Do not use for security products'], ['wellness and lifestyle', 'consumer commerce', 'editorial publications', 'children products', 'security products']),
    visual('wide mono console type', 'neon-ruled terminal panes', 'scanline rhythm'),
  ),
  profile(
    'fusion-grain-mono',
    t('A monochrome paperwork system with faint analog grain and two working colours.', '옅은 아날로그 그레인과 두 가지 작업용 색을 쓰는 모노크롬 문서 체계입니다.', 'かすかなアナログ粒子と二色の作業用カラーを使った、モノクロの書類体系です。'),
    prompt('One typewriter face, regular and bold', 'Ruled forms and tables on faintly grained paper', 'None: values change at once, nothing fades', ['editorial archives', 'music writing', 'zines'], ['Keep grain subtle', 'Preserve line length'], ['developer dashboards', 'enterprise admin', 'gaming and entertainment', 'high-density data']),
    visual('typewriter print type', 'ruled forms on grained paper', 'ruled paperwork rhythm'),
  ),
  profile(
    'fusion-clay-aurora',
    t('A playful but polished tactile surface for onboarding and learning products.', '온보딩과 학습 제품에 어울리는, 경쾌하면서도 다듬어진 촉감 있는 표면입니다.', 'オンボーディングや学習製品に合う、遊び心がありながら洗練された触感のある面です。'),
    prompt('Rounded friendly sans, wide for headlines', 'Clay tokens in pressed trays, one aurora band', 'Keys travel on press in 80ms, no ambient drift', ['education', 'AI companions', 'creative onboarding'], ['Respect reduced motion', 'Keep text off the band of light'], ['enterprise B2B', 'developer tools', 'finance or legal products', 'gaming']),
    visual('rounded wide-set type', 'raised and pressed clay', 'short press-travel rhythm'),
  ),
  profile(
    'fusion-floppy-exe',
    t(
      'A desktop scene that combines beveled windows, a working terminal, and a taskbar for nostalgic dev surfaces.',
      '베벨 윈도우와 실제로 돌아가는 터미널, 작업표시줄로 꾸민 향수 어린 개발자 데스크톱 화면입니다.',
      'ベベルウィンドウ、動作するターミナル、タスクバーで構成された郷愁ある開発者デスクトップシーンです。',
    ),
    prompt('Tahoma for chrome paired with JetBrains Mono for terminal', 'Beveled windows on teal desktop, taskbar with start, phosphor terminal screen', 'Instant pressed states, blinking cursor, no smooth easing', ['retro launchers', 'developer toys', 'playful CLIs', 'creative portfolios'], ['Do not soften the bevels into modern rounded chrome', 'Keep terminal text inside the screen, never on the desktop'], ['enterprise B2B trust products', 'finance or legal', 'wellness apps', 'modern SaaS landing pages']),
    visual('beveled chrome label', 'teal desktop with floating windows', 'pressed-state click rhythm'),
  ),
  profile(
    'fusion-noir-metal',
    t(
      'An elevator service plate. Floor by floor, each room is one photograph graded into a single warm-black palette.',
      '엘리베이터 서비스 플레이트. 층마다 한 장의 사진, 모두 한 가지 따뜻한 검정 톤으로.',
      'エレベーター・サービスプレート。階ごとに一枚の写真、すべて温かい黒の単一トーンへ。',
    ),
    prompt('Space Grotesk 700 (display) paired with Share Tech Mono for LCD readouts', 'Each floor is one viewport with a cinematic photo backdrop, massive Korean/Latin display, a small LCD floor indicator mounted in the right rail', 'Slot-machine LCD floor counter on transit, soft amber halo flash on arrival, scroll-snap one floor per view', ['cinematic brand pages', 'archival institutions', 'real-estate towers', 'building / venue presentations'], ['Photo backdrops must be graded to a single warm-amber palette', 'The chassis stays matte black — amber lives only inside the LCDs and the active rail button'], ['e-commerce', 'children products', 'pastel consumer apps', 'casual gaming']),
    visual('massive bone-white display + amber mono LCD', 'matte black with photo backdrops graded warm-amber', 'one floor per viewport cadence'),
  ),
  profile(
    'fusion-strict-console',
    t(
      'A product page that IS a flight-information display: tokens depart as flights, pricing tiers are fare classes, the CTA is a boarding pass.',
      '비행 정보 표시판 그 자체인 제품 페이지 — 토큰은 항공편처럼 출발하고, 가격 등급은 운임 클래스, CTA는 탑승권입니다.',
      '飛行情報表示板そのものとしての製品ページ — トークンがフライトとして出発し、料金階層は運賃クラス、CTAは搭乗券。',
    ),
    prompt('Oswald / Archivo Black for board characters paired with JetBrains Mono for codes, times, and serials', 'A true-black FIDS board hero with three giant split-flap lines, a working departures grid, three boarding-pass fares, and a boarding-pass CTA', 'Mechanical split-flap reveal on every uppercase character, staggered by char index, with an amber pulse on live beacons', ['B2B SaaS landings with a kinetic signature', 'design system & devtool launches', 'fintech and ops console marketing', 'pages that need cinematic mechanical motion'], ['ONE amber accent only — live beacons, primary CTA, hero accent word, featured stripe', 'True-black surfaces only — no blue or cream tint', 'Respect prefers-reduced-motion — disable all flap animations'], ['lifestyle commerce', 'wellness brands', 'children products', 'consumer entertainment']),
    visual('tall condensed display characters with mono data', 'true-black board with hairline edges and amber beacons', 'mechanical split-flap kinetic at every reveal'),
  ),
  profile(
    'fusion-quiet-manifesto',
    t(
      'The studio page IS a drafting sheet: registration crosshairs, coordinate ruler, bill of materials, detail callout, and a real title block in the bottom-right corner.',
      '스튜디오 페이지 자체가 *도면 시트*입니다. 견당 십자선, 좌표 눈금자, 부품표, 상세 콜아웃, 그리고 도면 규약을 따른 오른쪽 아래 표제란까지.',
      'スタジオ・ページそのものが*図面シート*である: 見当十字、座標ルーラー、部品表、詳細コールアウト、そして製図規約に従う右下の表題欄。',
    ),
    prompt('JetBrains Mono throughout — display title included, no serif anywhere; uniform draftsman stroke and tabular numerics', 'Sheet frame with registration crosshairs and coordinate ruler. Strip header, cover block, dimension-line section separators, general notes table, bill-of-materials grid, detail callout with magnification ring, conventional title block, footer notes', 'No layout motion — only 200 ms colour transitions on hover; rubber stamp rotates -8°', ['design studios pretending to be engineers', 'tech-aesthetic manifesto pages', 'architecture/industrial-design firms', 'editorial about-pages that need to feel earned'], ['One accent only — oxblood — for registration crosses, status dot, detail ring, and rubber stamp', 'Display headline must be monospace, not serif/sans display', 'Vellum cream base — never pure white, never blueprint blue', 'Borders ≥1.5 px solid ink; hairlines no fainter than 28% opacity'], ['e-commerce', 'consumer SaaS landing', 'gaming', 'lifestyle/wellness']),
    visual('monospace display at engineering scale, all caps', 'warm vellum sheet with crosshairs and coordinate grid', 'dimension-line cadence between every section'),
  ),
  profile(
    'fusion-pure-noir',
    t(
      'Editorial prose, then a sticky replay rail, then the usual SaaS close. Space Grotesk 700 is the wordmark; Inter is the UI; a serif is only the editorial prose.',
      '에디토리얼 산문, 그다음 고정 리플레이 레일, 그다음 흔한 SaaS 마무리. Space Grotesk 700은 워드마크, Inter는 UI, 세리프는 에디토리얼 산문에만 씁니다.',
      'エディトリアルの散文、続いて固定のリプレイレール、その後に通常のSaaSの締め。Space Grotesk 700はワードマーク、InterはUI、セリフはエディトリアルの散文だけ。',
    ),
    prompt('Inter for UI, Libre Baskerville for editorial prose, JetBrains Mono for labels, Space Grotesk 700 only on the wordmark', 'Editorial hero, sticky replay rail, then logos, trust, pricing, quote, CTA, and footer', '700ms reveal, 320ms rail, 240ms color, one slow content cycle, and a reduced-motion off switch', ['B2B SaaS marketing', 'developer infrastructure', 'devtool landings', 'product startup home pages'], ['#DAA520 only on the brand wordmark', 'No other chroma, gradient, or glow', 'Do not italicize the wordmark'], ['playful consumer apps', 'lifestyle / wellness', 'kids / education', 'maximalist / Y2K']),
    visual('tight-tracked display sans with mono numerics', 'true-black surfaces with monochrome dividers', 'editorial-marketing rhythm on 120px section gap'),
  ),
  profile(
    'fusion-soft-inflate',
    t(
      'A near-white reading surface where the depth language is the page\'s point. Six clean editorial sections, each surface either RAISED (principle cards, colophon, image plates) or RECESSED (hero meta band, breath well) via dual-shadow neumorphism on a shared material. HERO (mono brand + Plus Jakarta 800 "Soft Inflate" with sky-5 period + Plate I balloon image), MANIFESTO (2-col: fabric plate + manifesto text with sky-5 [ ] brackets), PRINCIPLES (3 raised cards on the room\'s rules), VARIATIONS (3 plates II/III/IV), BREATH WELL (carved single-row readout with live sky-5 numeric), USES (4-row list, NEVER-FOR in sky-5), COLOPHON. Frames + cards breathe via box-shadow amplitude on an 8-second cycle; cursor movement shifts each image\'s saturate/brightness slightly.',
      '깊이의 언어 자체가 *페이지의 핵심*인 거의 순백에 가까운 독서 면. 깔끔한 6개 에디토리얼 섹션으로, 각 면은 공유된 재질 위에 이중 그림자 뉴모피즘으로 *양각(raised)* — principle 카드, colophon, image plates — 이거나 *음각(recessed)* — hero meta band, breath well — 입니다. HERO(모노 브랜드 + Plus Jakarta 800 "Soft Inflate" + sky-5 마침표 + Plate I 풍선 이미지), MANIFESTO(2단: 천 plate + sky-5 [ ] 괄호의 매니페스토), PRINCIPLES(이 공간의 규칙을 담은 양각 카드 3장), VARIATIONS(plate II/III/IV 3장), BREATH WELL(파낸 듯한 단일 행 readout, sky-5 실시간 수치), USES(4행 리스트, NEVER-FOR는 sky-5), COLOPHON. 프레임과 카드가 8초 주기로 box-shadow 진폭을 따라 호흡하고, 커서 움직임에 따라 각 이미지의 saturate·brightness가 미세하게 바뀝니다.',
      '深さの言語が*ページの本質*であるほぼ純白の読み面。清潔な六つのエディトリアル・セクション、各面は*浮き彫り (raised)* — principle カード、colophon、image plates — または*彫り込み (recessed)* — hero meta band、breath well — 共有された素材の上の dual-shadow ニューモーフィズムで表現します。HERO (モノのブランド + Plus Jakarta 800 "Soft Inflate" + sky-5 の句点 + Plate I の風船画像)、MANIFESTO (二段: 布プレート + sky-5 [ ] 括弧のマニフェスト)、PRINCIPLES (部屋のルールについての浮き彫りカード三つ)、VARIATIONS (三プレート II/III/IV)、BREATH WELL (彫り込まれた単一行リードアウト、sky-5 live 数値)、USES (四行リスト、NEVER-FOR sky-5)、COLOPHON。フレーム + カードが八秒周期の box-shadow 振幅で呼吸、カーソル移動が各画像の saturate/brightness を微調整。',
    ),
    prompt(
      'Plus Jakarta Sans 800 for hero title (clamp 3.6-12rem) and section headlines — clean modern geometric. Inter 400/500 for body (line-height 1.7). IBM Plex Mono for labels / meta / readouts. No classical serif, no Archivo Black at display.',
      'Six editorial sections inside a 1280px shell. HERO (centered: mono brand strip + Plus Jakarta title with sky-5 period + Inter italic sub + 16:9 Plate I balloon image, max 1080px + hairline meta band). MANIFESTO (2-col: portrait fabric plate left, eyebrow with sky-5 [ ] brackets + headline + 2 body paragraphs right). VARIATIONS (3-col head + 3 square Plates II/III/IV). BREATH BAR (single row card with title + 3 readouts including sky-5 live numeric). USES (2-col: title + 4-row when/what list, NEVER-FOR row sky-5). COLOPHON (2-col card with display headline + body + spec list + photographer credits row).',
      'Two quiet signals. (1) @property --si-breath-ambient <number> + @keyframes 0.35 ↔ 0.92 over 8s, drives each frame\'s box-shadow throw 18-34px + breath-bar live numeric. (2) pointermove writes --si-cursor-x / --si-cursor-y to root (EMA 0.08), feeds each image\'s saturate / brightness filter. Frame hover translateY(-4px) with image scale 1.04 over 600ms.',
      ['studio launch pages whose first page should read as a careful object rather than a homepage', 'quiet products that arrive in a small box — stationery, perfume, ceramics, slow wellness', 'premium single-product launches with paper-packaging feel — hardware, watches, audio', 'minimal portfolio sites where curated photography carries the page'],
      ['NO warm tint, NO yellow palette, NO grey decision-avoidance — pure white only', 'NO drawn SVG figures (bellows / lungs / cranes) — use REAL UNSPLASH photographs', 'NO origami fold polygons, NO sphere as primary visual', 'NO classical serif display, NO Archivo Black at hero', 'Sky blue appears at four signal moments: title period, manifesto bracket, live breath numeric, NEVER-FOR row label', 'Credit photographers in the colophon (Unsplash license)'],
      ['operations dashboards', 'real-time games', 'cyber / hacker identities', 'fast small-screen consumer apps', 'pricing-heavy marketing pages'],
    ),
    visual('Plus Jakarta Sans display with sky-blue accent moments', 'pure white reading surface with four softly-lit Unsplash photographs', '8-second breathing frames + cursor-driven micro saturation, nothing else moves'),
  ),
  profile(
    'fusion-studio-pixel',
    t(
      'Inspired by agency-first references with huge type and service tiles, then rebuilt as a ticket-board workbench so it reads as Web Stylebook rather than a copy.',
      '큰 헤드라인과 서비스 카드가 있는 에이전시 레퍼런스를 그대로 베끼지 않고, 작업 보드에 붙은 티켓처럼 재구성한 Web Stylebook식 퓨전입니다.',
      '大きな書体とサービスタイルを持つエージェンシー参照に着想を得つつ、そのまま写さずチケットボードのワークベンチとして再構成し、模倣ではなくWeb Stylebookとして読める融合です。',
    ),
    prompt(
      'Rounded agency sans for the main headline, pixel display for the ticket numbers and section counters, mono/tabular labels for brief metadata',
      'Warm asymmetric first viewport, oversized headline, crooked service ticket board with tape/perforation details, then a split process sheet with a sticky pixel index',
      'Service tickets lift by hard shadow only, active ticket strip updates on hover/focus, process marker follows scroll with IntersectionObserver',
      ['digital studios', 'branding agencies', 'web/app service landings', 'productized creative services'],
      ['Keep the background warm and quiet', 'Use pixel type as the counterpoint, not as the whole page', 'Tickets need black hard shadows, perforation dots, tape, and real service labels', 'Do not imitate a specific logo or copy from a reference site'],
      ['enterprise admin dashboards', 'financial products needing sober trust', 'long-form documentation', 'luxury monochrome brands'],
    ),
    visual('rounded agency headline with pixel ticket labels', 'warm canvas with taped service tickets and receipt strip', 'process rhythm driven by numbered pixel markers'),
  ),
]);
if (styleProfiles.size !== styleCatalog.length || styleCatalog.some((style) => !styleProfiles.has(style.id))) {
  throw new Error('Every catalog style must have exactly one profile');
}

export function getStyleProfile(id: string): StyleProfile {
  const found = styleProfiles.get(id);
  if (!found) throw new Error(`Unknown style profile '${id}'`);
  return found;
}
