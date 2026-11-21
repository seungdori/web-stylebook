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
      'Records and counts on one framed sheet: condensed capitals, typed mono fields and 4px rules, for archives, registers and timetables.',
      '한 장의 틀 안에 기록과 집계를 담습니다. 압축 대문자, 타자체 모노 필드, 4px 선을 씁니다. 기록 보관소, 등록 명부, 시간표에 어울립니다.',
      '一枚の枠の中に記録と集計をまとめます。圧縮された大文字、タイプ風の等幅フィールド、4pxの罫線を使い、アーカイブ、登録簿、時刻表に向きます。',
    ),
    prompt('Condensed upper-case capitals for names and counts, a typed mono for every field', 'One framed sheet of blocks on 4px rules: year bars, ruled listing, record sheet', 'Background colours step in 120ms; nothing moves on its own', ['building archives', 'public registers', 'timetables'], ['Yellow and red only as solid blocks', 'Square corners, no shadows'], ['healthcare', 'children products', 'wellness apps', 'finance trust products']),
    visual('condensed capitals and typed mono', 'white sheet in a black frame', 'blocks on 4px rules'),
  ),
  profile(
    'editorial-silence',
    t(
      'A reading page carried by type alone: a light serif for the work, a quiet sans for the shop, ruled sections and no colour beyond ink and grey.',
      '글자만으로 읽히는 페이지입니다. 작품 본문에는 가벼운 세리프를, 판매 정보에는 차분한 산세리프를 쓰고, 구획은 선으로 나눕니다. 색은 잉크와 회색 외에 쓰지 않습니다.',
      '文字だけで読ませるページです。作品の本文には軽いセリフ体を、販売情報には落ち着いたサンセリフを使い、セクションは罫線で区切ります。色はインクとグレーだけです。',
    ),
    prompt('A light reading serif for the work, a quiet sans for the shop', '12-column page with a wide outer margin and ink-ruled sections', 'A 160ms colour change on hover only', ['publishers and books', 'essays and long reads', 'author pages'], ['Ink and grey only; no accent colour', 'Rules instead of boxes, square corners'], ['gaming launches', 'flash commerce', 'developer dashboards', 'high-energy campaigns']),
    visual('light reading serif', 'near-white page with ink rules', 'long-form reading spacing'),
  ),
  profile(
    'kinetic-pop',
    t(
      'Short, shouted information drawn in thick ink: three loud fills, hard shadows and controls that answer a touch, for pop-ups, festivals and launches.',
      '굵은 잉크로 그린 짧고 큰 정보입니다. 강한 채움 세 가지, 선명한 그림자, 터치에 반응하는 컨트롤을 씁니다. 팝업, 페스티벌, 출시 페이지에 어울립니다.',
      '太いインクで描いた、短く力強い情報です。強い塗り三色、硬い影、タッチに応えるコントロールを使い、ポップアップ、フェスティバル、新製品の発表に向きます。',
    ),
    prompt('A one-weight poster face for words and figures, a plain sans for reading', 'Poster card, die-cut tasting flight, day strip and crate builder', 'Buttons lift 160ms on hover, the chosen day springs in, a ticker slides', ['pop-up shops', 'festivals and events', 'product launches'], ['Colour only as fills, never as text on paper', 'Every shadow a hard ink offset'], ['B2B operational dashboards', 'enterprise admin', 'financial reporting', 'medical or legal products']),
    visual('one-weight poster type', 'warm paper with ink-drawn fills', 'springy pop rhythm'),
  ),
  profile(
    'cyberpunk-glitch',
    t(
      'Numbers read from across a dark room: a near-black grid, three neons with one meaning each, neon frames, and an RGB split that slides only as the page opens. Not for products that have to be trusted.',
      '어두운 방 건너편에서도 읽히는 숫자입니다. 거의 검은 격자, 의미가 하나씩인 네온 세 가지, 네온 프레임을 쓰고, RGB 분할은 페이지가 열릴 때만 미끄러지듯 움직입니다. 신뢰가 중요한 제품에는 맞지 않습니다.',
      '暗い部屋の向こうからでも読める数字です。ほぼ黒の格子、それぞれ意味が一つのネオン三色、ネオン枠を使い、RGBの分離はページが開くときだけスライドします。信頼が求められる製品には向きません。',
    ),
    prompt('A squared display face with a width axis for figures, a plain mono for words', 'Neon frames with corner brackets, a lit price board, a queue screen, a ruled parts grid', 'Name slices slide on open, then hold; 160ms fills on hover', ['night markets and arcades', 'queue and order screens', 'game and event venues'], ['Yellow is now, cyan is on a bench or chosen, magenta is waiting or wrong', 'No endless glitch loops, flicker or flashing', 'Do not use for security, safety, or trust products'], ['healthcare apps', 'financial trust products', 'children products', 'editorial publications', 'security products']),
    visual('squared neon display type', 'near-black grid under scanlines', 'queue-screen rhythm'),
  ),
  profile(
    'swiss-poster',
    t(
      'A poster and a lot of exact information on one page: a single grotesk, black rules and one red, for exhibitions, seasons and festivals.',
      '한 페이지에 포스터와 많은 정확한 정보를 담습니다. 그로테스크 서체 하나, 검은 선, 빨간색 하나를 씁니다. 전시, 공연 시즌, 영화제에 어울립니다.',
      '一枚のページにポスターと、正確な情報を多く載せます。グロテスク体一書体、黒い罫線、赤一色を使い、展覧会、公演シーズン、映画祭に向きます。',
    ),
    prompt('One grotesk, hierarchy by size and weight alone', 'Poster sheet on a 12-column grid, ruled works table, timetable and ticket form', 'None: hover fills or underlines at once', ['museum exhibitions', 'concert seasons', 'film festivals'], ['Red only on the few things that need it', 'Square corners, no shadows'], ['casual consumer apps', 'playful onboarding', 'gaming UI', 'illustrative storytelling']),
    visual('one grotesk at every size', 'white sheet on off-white paper', 'ruled poster rhythm'),
  ),
  profile(
    'quiet-utility',
    t(
      'A screen for daily repeated work: visible lines, tabular money and status colours that mean something, with one slate accent for the primary action.',
      '매일 반복하는 업무를 위한 화면입니다. 선이 잘 보이고, 금액은 자릿수를 맞추며, 의미가 있는 상태 색만 씁니다. 주요 동작에는 슬레이트 포인트 하나를 씁니다.',
      '毎日くり返す業務のための画面です。線を見やすくし、金額は桁をそろえ、意味のある状態色だけを使います。主要な操作には、スレートのアクセントを一つ使います。',
    ),
    prompt('One sans at 400, 500 and 600 with tabular, slashed-zero figures', 'A queue beside the open record, white panels in slate frames', '120ms colour changes on rows and controls only', ['approval tools', 'back-office queues', 'admin tools'], ['Status colour only where it means something', 'No drop shadows, gradients or big-number tiles'], ['consumer marketing pages', 'creator launches', 'campaign sites', 'gaming and entertainment']),
    visual('one sans with tabular figures', 'white panels in slate frames', 'queue-and-record working rhythm'),
  ),
  profile(
    'platform-core',
    t(
      'A developer product shown working: a ruled near-black page in warm off-white type, with the product itself as a live light widget beside its requests and code.',
      '실제로 작동하는 개발자 제품을 보여 줍니다. 선으로 나눈 거의 검은 페이지에 따뜻한 오프화이트 글자를 쓰고, 요청과 코드 옆에 제품 자체를 밝은 실시간 위젯으로 둡니다.',
      '実際に動く開発者向け製品を見せます。罫線で区切ったほぼ黒のページに温かみのあるオフホワイトの文字を使い、リクエストとコードの横に、製品そのものを明るいライブのウィジェットとして置きます。',
    ),
    prompt('A plain geometric sans for everything read, a mono for code, requests and dates', 'Live preview beside requests and code, ruled rows, a sticky page index', '160ms colour and border changes on hover only', ['developer platforms', 'API and SDK products', 'auth and payments services'], ['Off-white is the only accent, never a hue', 'No cards, shadows, gradients or logo walls'], ['playful consumer products', 'lifestyle apps', 'editorial publications', 'art portfolios']),
    visual('plain geometric sans', 'ruled near-black page with one light widget', 'documentation cadence'),
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
      'Live numbers read at night: a matte near-black broadcast screen where neon is a status mark on keylines and traces, never a glow on text.',
      '밤에 읽는 실시간 숫자입니다. 무광 거의 검은 방송 화면에서 네온은 기준선과 궤적 위의 상태 표시로만 쓰며, 글자에 빛을 입히지 않습니다.',
      '夜に読む実況の数字です。つや消しのほぼ黒の放送画面で、ネオンは基準線と軌跡上の状態表示としてだけ使い、文字に光を重ねることはありません。',
    ),
    prompt('One squared, cut-corner family; italic for car numbers and the lap count', 'A console frame with timing tower and trace, ruled tables, a bracket and a time grid', '160ms colour changes on hover; the race is a still frame', ['live sports and esports', 'race and event trackers', 'broadcast companion pages'], ['Teal for the leader and live, coral for pits, magenta for the fastest lap', 'No neon on text, no rounded corners, no large glow halos'], ['enterprise B2B', 'healthcare', 'legal or financial trust products', 'editorial long-form']),
    visual('squared cut-corner type', 'matte near-black broadcast console', 'live timing rhythm'),
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
      'Documentation read at the prompt: phosphor green on near-black, real terminal sessions in rounded frames, ruled command tables and one lime for prompts and errors.',
      '프롬프트에서 읽는 문서입니다. 거의 검은 바탕에 인광 녹색, 둥근 프레임에 담은 실제 터미널 세션, 선으로 나눈 명령 표를 씁니다. 프롬프트와 오류에는 라임색 하나를 씁니다.',
      'プロンプトの前で読むドキュメントです。ほぼ黒の地に蛍光グリーン、角丸の枠に収めた実際のターミナルセッション、罫線で区切ったコマンド表を使い、プロンプトとエラーにはライム一色を使います。',
    ),
    prompt('A pixel terminal face for what the shell prints, a plain mono for prose and sessions', 'Terminal windows, one session down the steps, ruled command tables', 'None: tabs, filter and Copy change state at once', ['CLI documentation', 'databases and build tools', 'developer quickstarts'], ['Lime only on prompts, steps and errors', 'No red errors, blinking cursors or typing effects'], ['consumer SaaS', 'marketing campaigns', 'editorial pages', 'wellness and lifestyle']),
    visual('pixel terminal type', 'phosphor-green screens on near-black', 'step-by-step session rhythm'),
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
      'Read at a glance against a clock: true black, neutral greys, cockpit-display figures and one emerald for what is go.',
      '시계를 보며 한눈에 읽는 화면입니다. 순검정, 무채색 회색, 계기판 디스플레이 숫자를 쓰고, 진행 가능한 항목에만 에메랄드 하나를 씁니다.',
      '時計を見ながら一目で読み取る画面です。真っ黒な地、無彩色のグレー、コックピット・ディスプレイ風の数字を使い、実行可能な項目にだけエメラルド一色を使います。',
    ),
    prompt('A cockpit-display sans for headings and figures, its mono for units and call signs', 'Square panels for the count, window and weather; ruled boards and tables', 'One breathing lamp; 120ms colour changes on hover', ['launch and event days', 'live countdowns', 'go/no-go status boards'], ['Emerald only on go; a hold is a white hatch', 'No red, amber, blue, glow or rounded corners'], ['marketing landing pages', 'editorial publications', 'consumer commerce', 'luxury brand sites']),
    visual('cockpit-display figures', 'true-black ruled panels', 'countdown rhythm'),
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
      'Machined metal and precise figures on one black page: drawn chrome as the only light and numbers like an engraved scale, for audio gear, turntables and lenses.',
      '검은 페이지 하나에 가공된 금속과 정밀한 숫자를 담습니다. 그려진 크롬이 유일한 빛이며, 숫자는 새긴 눈금처럼 보입니다. 오디오 기기, 턴테이블, 렌즈에 어울립니다.',
      '黒一色のページに、加工された金属と正確な数字を載せます。描かれたクロームだけが光で、数字は刻まれた目盛りのように見せます。オーディオ機器、ターンテーブル、レンズに向きます。',
    ),
    prompt('A wide squared face for every measured value, a plain humanist sans for sentences', 'Volume dial as the object, brushed rear panel, power table, impedance scale', 'A 160ms hover and a sliding gain switch; nothing moves on its own', ['audio hardware', 'camera gear', 'precision products'], ['Greys, white and black only', 'Chrome only on the product name and the buy button'], ['B2B SaaS dashboards', 'editorial content sites', 'wellness and lifestyle', 'children and education']),
    visual('wide squared instrument type', 'black base lit by drawn metal', 'calibrated measured cadence'),
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
      'A date, a time and a few big numbers printed in two inks: huge condensed capitals over a halftone field, for race series, club nights and fairs.',
      '날짜, 시간, 큰 숫자 몇 개를 두 가지 잉크로 인쇄합니다. 하프톤 면 위에 매우 큰 압축 대문자를 올립니다. 레이스 시리즈, 클럽 나이트, 박람회에 어울립니다.',
      '日付、時刻、大きな数字をいくつか二色のインクで刷ります。ハーフトーンの面の上に巨大な圧縮大文字を載せ、レースシリーズ、クラブナイト、見本市に向きます。',
    ),
    prompt('Huge condensed capitals for dates and figures, a plain sans for the words', 'Street-poster hero over a dot field, tour-date list, route profile, entry form, results', 'A 160ms colour change on hover; nothing moves on its own', ['race series', 'club nights', 'print fairs'], ['Two inks only: no grey, no third colour', 'Errors as inverted blocks, never red'], ['B2B admin', 'finance dashboards', 'documentation sites', 'wellness apps']),
    visual('huge condensed capitals', 'near-black printed in lime', 'poster-scale rhythm'),
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
      'A shared workspace page that works: white paper beside a warm grey page tree, the system UI font, small corners and one calm blue for focus and checks.',
      '실제로 쓸 수 있는 공유 워크스페이스 페이지입니다. 흰 종이 옆에 따뜻한 회색 페이지 트리를 두고, 시스템 UI 글꼴, 작은 모서리, 포커스와 체크에 쓰는 차분한 파란색 하나를 씁니다.',
      '実際に使える共有ワークスペースのページです。白い紙の横に温かみのあるグレーのページツリーを置き、システムのUIフォント、小さな角、フォーカスとチェックに使う落ち着いた青一色を使います。',
    ),
    prompt('The system UI face only: a tight bold title, 16px/1.6 reading, small app labels', 'Page tree, typed properties, blocks, a comment margin and a database view', '0.12s background changes and a turning triangle; nothing moves on its own', ['team handbooks', 'knowledge bases', 'project checklists'], ['Blue only for focus, checks and the reply box', 'Tags are tinted rectangles; the only shadow is the popover'], ['marketing landing pages', 'gaming and entertainment', 'high-energy launches', 'luxury commerce']),
    visual('system UI type', 'white paper beside a warm grey page tree', 'block-by-block document rhythm'),
  ),
  profile(
    'retro-pixel',
    t(
      'A screen of pixels for places that live on one: notched frames, bitmap figures and one meaning per colour, for arcade bars, game shops and chiptune nights.',
      '픽셀로 살아가는 공간을 위한 화면입니다. 계단형으로 파인 프레임, 비트맵 숫자, 색마다 의미 하나를 담으며, 아케이드 바, 게임 숍, 칩튠 나이트에 어울립니다.',
      'ピクセルで成り立つ場所のための画面です。ノッチ状の枠、ビットマップの数字、色ごとに意味を一つ持たせ、アーケードバー、ゲームショップ、チップチューンの夜に向きます。',
    ),
    prompt('A bitmap face on an 8px step for every figure, a 16-dot screen gothic for reading', 'Cabinet-screen score board, floor map of tiles, roster tables, sign-up panel', 'No transitions; two status marks blink five times, then stay lit', ['arcade bars', 'retro game shops', 'chiptune nights'], ['One meaning per colour', 'No figurative pixel art or game pastiche'], ['B2B SaaS', 'professional services', 'finance or legal', 'enterprise admin', 'wellness apps']),
    visual('bitmap figures on an 8px step', 'dark navy with notched frames', 'stepped screen rhythm'),
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
      'A print studio page that behaves like its press: spot inks overprinted off register on uncoated paper, a heavy book serif and a typed job sheet.',
      '인쇄기처럼 움직이는 인쇄 스튜디오 페이지입니다. 무코팅 용지에 별색 잉크를 어긋나게 겹쳐 찍고, 굵은 책 세리프와 타자로 친 작업 지시서를 씁니다.',
      '印刷機のように振る舞う印刷スタジオのページです。非コート紙に特色インクを見当をずらして重ね刷りし、太い書籍向けセリフ体と、タイプで打った作業指示書を使います。',
    ),
    prompt('A heavy one-weight book serif over a typewriter mono', 'House sheet with crop marks, ruled ink and paper lists, a quote docket', 'None: a button steps into its offset shadow at once', ['print studios', 'zines and small press', 'workshops'], ['Spot inks only as ink, never as reading text', 'Square corners and flat offset shadows'], ['developer dashboards', 'finance applications', 'enterprise SaaS', 'high-density data tools']),
    visual('one-weight book serif with a typed mono', 'cream paper with off-register spot inks', 'printed job-sheet rhythm'),
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
    t('A software feature page where the product\'s interface is the proof: square ruled sections on white, one round sans, and colour only inside the drawn UI.', '제품 인터페이스가 근거가 되는 소프트웨어 기능 페이지입니다. 흰 바탕에 각진 구분 섹션을 두고, 둥근 산세리프 하나를 쓰며, 색은 그려진 UI 안에서만 씁니다.', '製品のインターフェースそのものが根拠になるソフトウェアの機能紹介ページです。白地に四角い罫線のセクションを置き、丸みのあるサンセリフ一書体を使い、色は描かれたUIの中だけに使います。'),
    prompt('One wide round sans at every size, smaller inside the UI', '12-column ruled page around a drawn editor window and one pricing table', 'A 160ms colour change on hover and a 160ms frame fade', ['design and build tools', 'collaboration software', 'SaaS feature pages'], ['Colour only inside the product UI', 'No gradients, pills or abstract shapes on the page'], ['gaming and entertainment', 'craft or wellness brands', 'luxury commerce', 'long-form editorial']),
    visual('wide round product headline', 'white ruled page with a drawn editor', 'square grid with rounded UI inside'),
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
      'A shop page made of one soft material: raised white frames and recessed wells, pillows drawn full of air, and sky blue only for what is chosen, counted or open today.',
      '부드러운 소재 하나로 만든 쇼핑 페이지입니다. 볼록한 흰 프레임과 움푹한 홈, 공기를 가득 넣은 쿠션을 그리며, 하늘색은 오늘 선택했거나 집계하거나 열린 항목에만 씁니다.',
      '一つのやわらかな素材で作った販売ページです。盛り上がった白い枠と凹んだくぼみ、空気をいっぱいに入れたクッションを描き、スカイブルーは今日選ばれた、集計された、または開いている項目にだけ使います。',
    ),
    prompt('A rounded one-weight display over a wide, even sans', 'Raised photographs, a recessed shelf and tray, ruled hours and questions', 'A pillow inflates once when chosen; buttons rise and sink over 160ms', ['soft goods shops', 'small makers', 'home and comfort brands'], ['Sky blue only on what is chosen, counted or open today', 'Every surface raised or recessed with a visible edge; never a pill'], ['operations dashboards', 'real-time games', 'cyber / hacker identities', 'fast small-screen consumer apps', 'pricing-heavy marketing pages']),
    visual('rounded one-weight display', 'raised white frames and recessed wells', 'one soft material, one inflate'),
  ),
  profile(
    'fusion-studio-pixel',
    t(
      'A studio page that shows its working board: taped job tickets, a scope ruler and a quote, drawn in 2px ink with hard offsets and a pixel numeral for every commitment.',
      '작업 보드를 그대로 보여 주는 스튜디오 페이지입니다. 테이프로 붙인 작업 티켓, 범위 눈금자, 견적을 2px 잉크 선과 선명한 오프셋으로 그리며, 약속하는 숫자마다 픽셀 숫자를 씁니다.',
      '作業ボードをそのまま見せるスタジオのページです。テープで貼った作業チケット、スコープの定規、見積もりを、2pxのインクの線と硬いオフセットで描き、約束するすべての数字にはピクセル数字を使います。',
    ),
    prompt('A wide sans for words, a pixel numeral for every number', 'Ticket board beside the headline, then scope ruler, track, prices and slots', 'Buttons and tickets lift over 140ms; nothing else moves', ['design studios', 'agencies', 'productized services'], ['Colour only for a kind of work, an action or what comes next', 'Hard ink offsets and square corners, never blur'], ['enterprise admin dashboards', 'financial products needing sober trust', 'long-form documentation', 'luxury monochrome brands']),
    visual('wide sans headline with pixel numerals', 'cream page with taped, ink-drawn tickets', 'scheduled studio rhythm'),
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
