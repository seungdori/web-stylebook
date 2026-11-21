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
    ['light', 'bold', 'editorial'],
    ['#e6e6e1', '#111111', '#ffd12f', '#d72600'],
    '#d72600',
    t(
      'A white sheet in a 5px black frame on a grey ground, divided by 4px black rules, with condensed capitals, typed mono fields, and yellow and red only as solid blocks.',
      '회색 바탕 위의 흰 용지를 5px 검은 테두리로 감싸고 4px 검은 선으로 나눕니다. 압축 대문자와 타자체 모노 필드를 쓰며, 노랑과 빨강은 단색 블록으로만 씁니다.',
      '灰色の地に置いた白い用紙を5pxの黒い枠で囲み、4pxの黒い罫線で区切ります。圧縮された大文字とタイプライター風の等幅フィールドを使い、黄色と赤は単色のブロックとしてだけ用います。',
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
      'A near-white page set almost entirely in type: a light reading serif over a quiet sans, ink rules, square corners and no colour beyond ink and grey.',
      '거의 흰색인 페이지를 글자 중심으로 구성합니다. 가벼운 세리프 본문에 차분한 산세리프를 합치고, 잉크 선으로 나누며 모서리는 직각으로 둡니다. 색은 잉크와 회색만 씁니다.',
      'ほぼ白のページを文字中心に組みます。軽いセリフ体に静かなサンセリフを合わせ、インクの罫線で区切り、角は丸めません。色はインクとグレーだけです。',
    ),
  ),
  detail(
    'kinetic-pop',
    'style',
    'Kinetic Pop',
    ['light', 'bold', 'motion'],
    ['#f6f3ea', '#ffe85d', '#ff4f7b', '#196bff'],
    '#ffe85d',
    t(
      'A warm paper page drawn in thick ink lines, with three loud fills, hard offset shadows and controls that move when you touch them.',
      '굵은 잉크 선으로 그린 따뜻한 종이 페이지입니다. 강렬한 채움 세 가지, 선명한 오프셋 그림자, 손이 닿으면 움직이는 컨트롤을 씁니다.',
      '太いインクの線で描いた温かみのある紙のページです。力強い塗り三色、くっきりしたオフセット影、触れると動くコントロールを使います。',
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
      'A near-black ground under a faint cyan grid and scanlines, with three neons that each mean one thing, square neon frames with corner brackets, and an RGB split on the name.',
      '희미한 시안 격자와 스캔라인 아래 놓인 거의 검은 바탕입니다. 의미가 하나씩 정해진 네온 세 가지, 모서리 괄호가 달린 사각 네온 프레임, 이름에 넣은 RGB 분할을 씁니다.',
      'かすかなシアンの格子と走査線の下に広がるほぼ黒の地。それぞれ意味が一つに決まったネオン三色、角かっこ付きの四角いネオン枠、名前に入れたRGBの分離を使います。',
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
      'An off-white page with one white poster sheet, black type in a single grotesk on a 12-column grid, and one red that marks only what needs it.',
      '오프화이트 페이지 위에 흰 포스터 한 장을 놓습니다. 12열 그리드 위에 그로테스크 서체 하나로 검은 글자를 조판하고, 빨간색은 꼭 필요한 곳에만 씁니다.',
      'オフホワイトのページに白いポスター一枚を置きます。12カラムのグリッドにグロテスク体一書体で黒い文字を組み、赤は必要な箇所だけに使います。',
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
      'One screen of a working tool on white: slate frames around white panels on visible 1px lines, tabular figures for money, a muted slate accent for the primary action and status colours that carry meaning only.',
      '흰 바탕 위의 작업 도구 화면 한 장입니다. 보이는 1px 선으로 흰 패널을 슬레이트 프레임에 담고, 금액은 자릿수를 맞춘 숫자로 표시합니다. 주요 동작에는 차분한 슬레이트 포인트를, 상태 색은 의미가 있을 때만 씁니다.',
      '白地に置いた作業ツールの一画面。見える1pxの線で白いパネルをスレートの枠で囲み、金額は桁をそろえた数字で示します。主要な操作にはくすんだスレートのアクセントを、状態色は意味がある場合だけ使います。',
    ),
  ),
  detail(
    'platform-core',
    'style',
    'Platform Core',
    ['dark', 'tech', 'product', 'minimal'],
    ['#101010', '#151515', '#f3f1ec', '#f4f4f4'],
    '#f3f1ec',
    t(
      'A near-black developer product page with ruled structure and warm off-white type, where one light sign-in widget works on the first screen and the only accent is off-white.',
      '선으로 나눈 구조의 거의 검은 개발자 제품 페이지입니다. 따뜻한 오프화이트 글자를 쓰고, 첫 화면에는 밝은 로그인 위젯 하나를 둡니다. 포인트 색은 오프화이트뿐입니다.',
      '罫線で区切った構成のほぼ黒の開発者向け製品ページ。温かみのあるオフホワイトの文字を使い、最初の画面には明るいサインイン・ウィジェットを一つ置きます。アクセントはオフホワイトだけです。',
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
    ['#05070f', '#0c1626', '#2ef2d5', '#ff745f'],
    '#2ef2d5',
    t(
      'A matte near-black broadcast screen of live numbers, in one squared, cut-corner family, where neon lives only on keylines, traces and focus: teal for the leader and what is live, coral for pits.',
      '실시간 숫자를 보여 주는 무광 거의 검은 방송 화면입니다. 각진 모서리의 한 서체 계열을 쓰며, 네온은 기준선, 궤적, 포커스에만 둡니다. 선두와 라이브 항목은 청록, 피트는 코럴로 표시합니다.',
      '実況の数字を映す、つや消しのほぼ黒の放送画面です。角を切り落とした四角い書体の一系統だけを使い、ネオンは基準線、軌跡、フォーカスにだけ置きます。首位と生中継はティール、ピットはコーラルで示します。',
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
    ['#071109', '#0a190c', '#d4ff5c', '#b9ffbe'],
    '#d4ff5c',
    t(
      'Green phosphor on a near-black screen: terminal windows keep rounded frames and scanlines, everything else is ruled lines and inverse video, and one lime marks prompts, steps and errors.',
      '거의 검은 화면에 녹색 인광을 씁니다. 터미널 창은 둥근 프레임과 스캔라인을 유지하고, 나머지는 구분선과 반전 표시로 구성합니다. 프롬프트, 단계, 오류에는 라임색 하나만 씁니다.',
      '黒に近い画面に緑の蛍光を載せます。ターミナルのウィンドウは角丸の枠と走査線を保ち、それ以外は罫線と反転表示で組みます。ライム色一つで、プロンプト、手順、エラーを示します。',
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
    ['dark', 'tech', 'product'],
    ['#080808', '#111111', '#10b981', '#ececec'],
    '#10b981',
    t(
      'A true-black control-room page in neutral greys and cockpit-display type, where one emerald marks only what is go and a hold is a white hatch.',
      '무채색 회색과 계기판 디스플레이 서체를 쓴 순검정 관제 페이지입니다. 에메랄드 하나는 진행 가능한 항목에만 쓰고, 보류는 흰색 빗금으로 표시합니다.',
      '無彩色のグレーとコックピット・ディスプレイ風の書体で組んだ真っ黒な管制ページです。エメラルド一色は実行可能な項目だけに使い、保留は白いハッチングで示します。',
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
    ['#0a0a0a', '#161616', '#f0f0f0', '#a7a7a7'],
    '#f0f0f0',
    t(
      'One black page where polished and brushed metal is the only light, with no hue anywhere and every number set like an engraved instrument scale.',
      '광택 금속과 헤어라인 금속만이 빛이 되는 검은 페이지입니다. 어떤 색조도 쓰지 않으며, 모든 숫자는 계기판 눈금처럼 새긴 듯 조판합니다.',
      '磨いた金属とヘアライン仕上げの金属だけが光となる、黒一色のページです。色合いは一切使わず、すべての数字は計器の目盛りのように刻んで組みます。',
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
    ['dark', 'bold', 'print'],
    ['#0a0a0a', '#0a0a0a', '#c5ff00', '#c5ff00'],
    '#c5ff00',
    t(
      'Printed in two inks only, near-black and one fluorescent lime, with huge condensed capitals and a halftone dot field that swells into solid ink.',
      '두 가지 잉크로만 인쇄합니다. 거의 검은색과 형광 라임 하나입니다. 매우 큰 압축 대문자와, 점점 부풀어 단색 잉크가 되는 하프톤 점 면을 씁니다.',
      '二色のインクだけで刷ります。ほぼ黒と蛍光ライム一色です。巨大な圧縮大文字と、次第に膨らんでベタのインクになるハーフトーンの点の面を使います。',
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
    ['#ffffff', '#f7f6f3', '#2383e2', '#37352f'],
    '#2383e2',
    t(
      'A document open in a workspace app: white paper beside a warm grey page tree, the system UI font, and one calm blue for focus, checked boxes and the reply box.',
      '워크스페이스 앱에서 열린 문서입니다. 흰 종이 옆에 따뜻한 회색 페이지 트리를 두고, 시스템 UI 글꼴을 씁니다. 포커스, 체크 상자, 답글 상자에만 차분한 파란색 하나를 씁니다.',
      'ワークスペースアプリで開いた文書です。白い紙の横に温かみのあるグレーのページツリーを置き、システムのUIフォントを使います。フォーカス、チェックボックス、返信欄にだけ落ち着いた青一色を使います。',
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
      'An 8-bit screen interface on dark navy, with notched pixel frames, chunky bitmap figures and bright pixel colours that each mean one thing.',
      '짙은 남색 바탕의 8비트 화면 인터페이스입니다. 계단 모양으로 파인 픽셀 프레임, 투박한 비트맵 숫자, 색마다 의미가 하나씩 정해진 밝은 픽셀 색을 씁니다.',
      '濃紺の地に広がる8ビットの画面インターフェースです。ノッチ状の切り欠きを持つピクセル枠、太いビットマップの数字、色ごとに意味が一つに決まった明るいピクセルカラーを使います。',
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
    ['#f5f0e8', '#ff48b0', '#00838a', '#2c3e50'],
    '#2c3e50',
    t(
      'Spot inks on cream uncoated paper, printed one drum at a time: ink-blue type, fluorescent pink and teal overprinted a few pixels off register, screened tints and flat offset shadows.',
      '크림색 무코팅 용지에 별색 잉크를 드럼 하나씩 차례로 찍습니다. 잉크 블루 글자, 형광 핑크와 틸을 몇 픽셀 어긋나게 겹쳐 찍고, 망점 농도와 평면 오프셋 그림자를 씁니다.',
      'クリーム色の非コート紙に特色インクを一色ずつ刷ります。インクブルーの文字、蛍光ピンクとティールを数ピクセルずらして重ね刷りし、網点の淡い色面と平面的なオフセット影を使います。',
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
    ['light', 'product', 'minimal'],
    ['#ffffff', '#f4f4f6', '#0d0d0e', '#6c5cff'],
    '#6c5cff',
    t('A white feature page on a square, ruled 12-column grid, set in one wide round sans, where colour lives only inside the product\'s own interface: selections, cursors, comment pins and swatches.', '각진 12열 격자 위에 놓인 흰색 기능 소개 페이지입니다. 넓고 둥근 산세리프 하나로 조판하며, 색은 제품 자체 인터페이스 안의 선택 상태, 커서, 댓글 핀, 색상 견본에만 씁니다.', '四角く罫線で区切った12カラムのグリッドに置かれた白い機能紹介ページです。ワイドで丸みのあるサンセリフ一書体で組み、色は製品自身のインターフェース内の選択、カーソル、コメントピン、カラーチップにだけ使います。'),
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
    ['light', 'soft', 'product'],
    ['#f2f4f8', '#ffffff', '#0369a1', '#0a0c10'],
    '#0369a1',
    t(
      'White raised frames and recessed wells on a cool off-white, every drawn object blown up with air, a rounded one-weight display, and sky blue only on what is chosen, counted or open today.',
      '차가운 오프화이트 바탕에 볼록한 흰색 프레임과 움푹 들어간 홈을 씁니다. 그려진 모든 사물은 공기를 넣어 부풀린 듯 보이며, 둥근 단일 굵기 디스플레이 서체를 씁니다. 하늘색은 오늘 선택했거나 집계하거나 열려 있는 항목에만 씁니다.',
      '冷たいオフホワイトの地に、盛り上がった白い枠と凹んだくぼみを配置します。描かれるものはすべて空気を入れて膨らませたように見え、丸みのある単一ウェイトのディスプレイ書体を使います。スカイブルーは、今日選ばれた、集計された、または開いている項目だけに使います。',
    ),
    ['neumorphism', 'editorial-silence'],
  ),
  detail(
    'fusion-studio-pixel',
    'fusion',
    'Studio Pixel',
    ['light', 'retro', 'bold'],
    ['#fff4ee', '#080604', '#cc4639', '#2f8b8e'],
    '#cc4639',
    t(
      'A warm cream studio page drawn in 2px ink lines with hard offset shadows: a wide sans for what the studio says, a pixel numeral for every number it commits to, and one colour per kind of work.',
      '따뜻한 크림색 스튜디오 페이지입니다. 2px 잉크 선과 선명한 오프셋 그림자로 그렸습니다. 스튜디오가 말하는 내용은 넓은 산세리프로, 약속한 모든 숫자는 픽셀 숫자로 씁니다. 작업 종류마다 색 하나를 씁니다.',
      '温かみのあるクリーム色のスタジオページです。2pxのインクの線と硬いオフセット影で描きます。スタジオが語る内容には幅の広いサンセリフを、約束するすべての数字にはピクセル数字を使い、作業の種類ごとに色を一つずつ割り当てます。',
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
