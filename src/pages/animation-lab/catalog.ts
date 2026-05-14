import type { Lang, LocalizedText } from '../../data/styles';

export type AnimationCategoryId = 'entrance' | 'attention' | 'interaction' | 'state' | 'loading' | 'scroll' | 'ambient';
export type PreviewKind =
  | 'fade'
  | 'fade-up'
  | 'slide'
  | 'scale'
  | 'blur'
  | 'stagger'
  | 'pulse'
  | 'bounce'
  | 'shake'
  | 'wiggle'
  | 'glow'
  | 'ripple'
  | 'hover-lift'
  | 'press'
  | 'tilt'
  | 'modal'
  | 'toast'
  | 'accordion'
  | 'crossfade'
  | 'skeleton'
  | 'spinner'
  | 'progress'
  | 'dots'
  | 'scroll-reveal'
  | 'parallax'
  | 'marquee'
  | 'orbit'
  | 'float'
  | 'gradient';

export interface AnimationCategory {
  id: AnimationCategoryId;
  label: LocalizedText;
  description: LocalizedText;
}

export interface AnimationPattern {
  id: string;
  category: AnimationCategoryId;
  preview: PreviewKind;
  name: LocalizedText;
  aliases: string[];
  short: LocalizedText;
  useWhen: LocalizedText;
  avoidWhen: LocalizedText;
  prompt: LocalizedText;
}

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

export function text(value: LocalizedText, lang: Lang): string {
  return value[lang] || value.en;
}

export const animationCategories: AnimationCategory[] = [
  {
    id: 'entrance',
    label: t('Entrance / Reveal', '등장 / 공개', '入場 / 表示'),
    description: t('How UI appears for the first time.', '요소가 처음 화면에 나타나는 방식입니다.', 'UIが初めて表示される時の動きです。'),
  },
  {
    id: 'attention',
    label: t('Attention', '주의 환기', '注目'),
    description: t('Small motion that asks the user to notice something.', '사용자의 시선을 잠깐 끄는 움직임입니다.', 'ユーザーの注意を短く引く動きです。'),
  },
  {
    id: 'interaction',
    label: t('Interaction', '인터랙션', 'インタラクション'),
    description: t('Feedback for hover, tap, focus, drag, and selection.', 'hover, tap, focus, drag, 선택에 대한 피드백입니다.', 'hover、tap、focus、drag、選択への反応です。'),
  },
  {
    id: 'state',
    label: t('State Change', '상태 변화', '状態変化'),
    description: t('Motion for modals, tabs, accordions, toasts, and page changes.', '모달, 탭, 아코디언, 토스트, 페이지 전환에 쓰는 움직임입니다.', 'モーダル、タブ、アコーディオン、トースト、ページ遷移の動きです。'),
  },
  {
    id: 'loading',
    label: t('Loading', '로딩', '読み込み'),
    description: t('Pending states that explain that work is in progress.', '작업이 진행 중임을 알려주는 대기 상태입니다.', '処理中であることを伝える待機状態です。'),
  },
  {
    id: 'scroll',
    label: t('Scroll', '스크롤', 'スクロール'),
    description: t('Motion tied to viewport entry or scroll position.', '뷰포트 진입이나 스크롤 위치와 연결되는 움직임입니다.', '表示領域への進入やスクロール位置に連動する動きです。'),
  },
  {
    id: 'ambient',
    label: t('Ambient / Decorative', '상시 / 장식', '常時 / 装飾'),
    description: t('Continuous background or brand motion.', '배경이나 브랜드 분위기를 계속 만드는 움직임입니다.', '背景やブランド感を継続的に作る動きです。'),
  },
];

export const animationPatterns: AnimationPattern[] = [
  {
    id: 'fade-in',
    category: 'entrance',
    preview: 'fade',
    name: t('Fade In', '페이드 인', 'フェードイン'),
    aliases: ['opacity reveal', 'fade', 'appear', '투명도', '나타남'],
    short: t('The element appears by changing opacity from 0 to 1.', '투명도 0에서 1로 올라오며 조용히 나타나는 효과입니다.', '不透明度が0から1になって表示されます。'),
    useWhen: t('Use for text, calm dashboards, settings, and content that should not jump.', '텍스트, 차분한 대시보드, 설정 화면처럼 튀면 안 되는 콘텐츠에 좋습니다.', 'テキストや落ち着いた画面に向いています。'),
    avoidWhen: t('Avoid when the user needs spatial direction or strong hierarchy.', '어디서 왔는지 방향감이 필요하거나 강한 위계가 필요할 때는 약합니다.', '方向感や強い階層が必要な時は弱いです。'),
    prompt: t('Use a simple fade-in for calm content reveal.', '차분한 콘텐츠 공개에는 단순한 fade-in을 사용해줘.', '静かな表示にはシンプルなfade-inを使ってください。'),
  },
  {
    id: 'fade-up',
    category: 'entrance',
    preview: 'fade-up',
    name: t('Fade Up', '페이드 업', 'フェードアップ'),
    aliases: ['slide up fade', 'rise', 'fade from bottom', '아래에서 위로', '위로 등장'],
    short: t('The element fades in while moving upward slightly.', '살짝 아래에서 위로 올라오며 나타나는 가장 흔한 웹 reveal입니다.', '少し下から上へ動きながら表示される一般的なrevealです。'),
    useWhen: t('Use for hero copy, cards, sections, and list items.', '히어로 문구, 카드, 섹션, 리스트 항목 등장에 잘 맞습니다.', 'ヒーロー文、カード、セクション、リストに向いています。'),
    avoidWhen: t('Avoid using it on every element with long stagger delays.', '모든 요소에 긴 지연을 걸어 반복하면 페이지가 답답해집니다.', '全要素に長い遅延で使うと遅く感じます。'),
    prompt: t('Use fade-up with short travel and modest stagger.', '짧은 이동 거리와 적당한 stagger의 fade-up을 써줘.', '短い移動距離と控えめなstaggerでfade-upを使ってください。'),
  },
  {
    id: 'slide-in',
    category: 'entrance',
    preview: 'slide',
    name: t('Slide In', '슬라이드 인', 'スライドイン'),
    aliases: ['from left', 'from right', 'drawer in', '옆에서 등장', '밀려옴'],
    short: t('The element enters from one side, making direction obvious.', '요소가 한쪽 방향에서 밀려 들어와 출처나 방향을 보여줍니다.', '横方向から入り、方向性を示します。'),
    useWhen: t('Use for drawers, side panels, navigation, and toasts.', '사이드 패널, 내비게이션, 토스트처럼 방향성이 있는 UI에 좋습니다.', 'サイドパネルやトーストに向いています。'),
    avoidWhen: t('Avoid for large text blocks unless the direction has meaning.', '방향 자체에 의미가 없다면 큰 텍스트 블록에는 과합니다.', '方向に意味がない大きな本文には過剰です。'),
    prompt: t('Use slide-in from the edge that matches the UI source.', 'UI가 생기는 방향과 맞는 edge에서 slide-in되게 해줘.', 'UIの発生源に合う端からslide-inしてください。'),
  },
  {
    id: 'scale-in',
    category: 'entrance',
    preview: 'scale',
    name: t('Scale In', '스케일 인', 'スケールイン'),
    aliases: ['zoom in', 'pop in', 'grow', '커짐', '팝업'],
    short: t('The element grows from a smaller scale into place.', '작은 크기에서 제자리 크기로 커지며 등장합니다.', '小さい状態から通常サイズへ拡大します。'),
    useWhen: t('Use for badges, icons, empty states, cards, and playful surfaces.', '배지, 아이콘, 빈 상태, 카드, playful한 화면에 어울립니다.', 'バッジ、アイコン、カード、遊び心ある画面に向いています。'),
    avoidWhen: t('Avoid on dense enterprise tables or serious reading flows.', '촘촘한 업무 테이블이나 진지한 읽기 흐름에는 가벼워 보일 수 있습니다.', '高密度の業務画面や読書画面では軽く見えます。'),
    prompt: t('Use a subtle scale-in, not a cartoon pop.', '만화처럼 튀지 않는 은은한 scale-in을 써줘.', '派手すぎない控えめなscale-inを使ってください。'),
  },
  {
    id: 'blur-reveal',
    category: 'entrance',
    preview: 'blur',
    name: t('Blur Reveal', '블러 리빌', 'ブラーリビール'),
    aliases: ['blur in', 'soft reveal', 'defocus', '흐림', '초점'],
    short: t('The element starts blurred and sharpens into focus.', '흐린 상태에서 선명해지며 초점이 맞는 느낌을 줍니다.', 'ぼかしから鮮明になり、焦点が合う印象を作ります。'),
    useWhen: t('Use for premium hero text, images, glass surfaces, and editorial reveals.', '프리미엄 히어로, 이미지, 글래스 표면, 에디토리얼 공개에 좋습니다.', '高級感あるヒーローや画像表示に向いています。'),
    avoidWhen: t('Avoid on small text because blur can hurt readability.', '작은 텍스트에는 가독성을 해치므로 피하는 편이 좋습니다.', '小さい文字では可読性を落とします。'),
    prompt: t('Use blur reveal only on large, readable elements.', '큰 요소에만 blur reveal을 제한해서 써줘.', '大きく読める要素にだけblur revealを使ってください。'),
  },
  {
    id: 'stagger',
    category: 'entrance',
    preview: 'stagger',
    name: t('Stagger', '스태거', 'スタガー'),
    aliases: ['sequence', 'cascade', 'delayed list', '순차 등장', '차례대로'],
    short: t('Multiple items animate one after another with a small delay.', '여러 항목이 짧은 간격으로 차례대로 등장하는 패턴입니다.', '複数の要素が少しずつ遅れて順番に表示されます。'),
    useWhen: t('Use for lists, grids, navigation items, and feature cards.', '리스트, 그리드, 내비게이션, 기능 카드 묶음에 좋습니다.', 'リスト、グリッド、ナビ、カード群に向いています。'),
    avoidWhen: t('Avoid long staggers in productivity tools; users wait for content.', '업무 도구에서 지연이 길면 사용자가 콘텐츠를 기다리게 됩니다.', '業務UIで遅延が長いと待たされます。'),
    prompt: t('Use stagger under 80ms per item for dense UI.', '촘촘한 UI에서는 항목당 80ms 이하의 stagger를 써줘.', '高密度UIでは各項目80ms以下のstaggerにしてください。'),
  },
  {
    id: 'pulse',
    category: 'attention',
    preview: 'pulse',
    name: t('Pulse', '펄스', 'パルス'),
    aliases: ['breathing', 'heartbeat', 'soft blink', '숨쉬기', '깜빡임'],
    short: t('The element gently grows, brightens, or changes opacity in a loop.', '크기, 밝기, 투명도가 부드럽게 반복 변화하며 시선을 끕니다.', '大きさや明るさがゆっくり繰り返し変化します。'),
    useWhen: t('Use for live status, recording, active sessions, and gentle attention.', '라이브 상태, 녹화 중, 활성 세션처럼 부드러운 주의 환기에 좋습니다.', 'ライブ状態や録画中などの注意喚起に向いています。'),
    avoidWhen: t('Avoid on large surfaces or many items at once.', '큰 면적이나 많은 요소에 동시에 쓰면 산만합니다.', '大きな面や多数の要素には散漫です。'),
    prompt: t('Use a slow pulse for active status only.', '활성 상태 표시에는 느린 pulse만 써줘.', 'アクティブ状態には遅いpulseだけを使ってください。'),
  },
  {
    id: 'bounce',
    category: 'attention',
    preview: 'bounce',
    name: t('Bounce', '바운스', 'バウンス'),
    aliases: ['jump', 'springy', '통통', '점프'],
    short: t('The element overshoots and settles like it has weight.', '목표 지점을 살짝 넘었다가 돌아와 탄성 있는 느낌을 줍니다.', '目標を少し超えて戻り、弾む感覚を作ります。'),
    useWhen: t('Use for playful buttons, onboarding, education, and rewards.', '놀이성 있는 버튼, 온보딩, 교육, 보상 화면에 좋습니다.', '遊び心あるボタン、オンボーディング、報酬に向いています。'),
    avoidWhen: t('Avoid in serious admin, finance, or security screens.', '관리자, 금융, 보안 화면에서는 신뢰감을 낮출 수 있습니다.', '管理、金融、セキュリティ画面では信頼感を下げます。'),
    prompt: t('Use bounce only for playful confirmation moments.', 'playful한 확인 순간에만 bounce를 써줘.', '遊び心ある確認場面にだけbounceを使ってください。'),
  },
  {
    id: 'shake',
    category: 'attention',
    preview: 'shake',
    name: t('Shake', '셰이크', 'シェイク'),
    aliases: ['error shake', 'wrong password', '좌우 흔들림', '오류'],
    short: t('The element quickly moves left and right to signal a problem.', '좌우로 빠르게 흔들려 오류나 거부 상태를 보여줍니다.', '左右に素早く揺れてエラーを示します。'),
    useWhen: t('Use for form errors, invalid passwords, and blocked actions.', '폼 오류, 잘못된 비밀번호, 막힌 액션에 적합합니다.', 'フォームエラーや無効な操作に向いています。'),
    avoidWhen: t('Avoid for neutral notifications; it feels negative.', '중립 알림에 쓰면 부정적인 의미로 읽힙니다.', '中立通知では否定的に見えます。'),
    prompt: t('Use a short shake for invalid form feedback.', '유효하지 않은 폼 피드백에는 짧은 shake를 써줘.', '無効なフォームには短いshakeを使ってください。'),
  },
  {
    id: 'wiggle',
    category: 'attention',
    preview: 'wiggle',
    name: t('Wiggle', '위글', 'ウィグル'),
    aliases: ['wobble', 'small rotate', '살짝 흔들림', '기울기'],
    short: t('The element rotates slightly back and forth.', '작게 좌우 회전하며 가벼운 장난스러움을 만듭니다.', '小さく左右に回転して遊び心を作ります。'),
    useWhen: t('Use for icons, stickers, draggable items, and playful CTAs.', '아이콘, 스티커, 드래그 가능한 요소, playful CTA에 좋습니다.', 'アイコン、ステッカー、ドラッグ要素に向いています。'),
    avoidWhen: t('Avoid for text paragraphs or precise controls.', '본문 문단이나 정밀 컨트롤에는 어울리지 않습니다.', '本文や精密な操作には不向きです。'),
    prompt: t('Use a tiny wiggle on the icon, not the whole card.', '카드 전체가 아니라 아이콘에만 작은 wiggle을 줘.', 'カード全体ではなくアイコンだけ小さくwiggleしてください。'),
  },
  {
    id: 'glow',
    category: 'attention',
    preview: 'glow',
    name: t('Glow', '글로우', 'グロー'),
    aliases: ['halo', 'neon', 'highlight', '빛남', '네온'],
    short: t('A soft light or shadow intensifies around the element.', '요소 주변 빛이나 그림자가 강해지며 강조합니다.', '周囲の光や影が強くなって強調します。'),
    useWhen: t('Use for focus, active cards, neon systems, and premium actions.', '포커스, 활성 카드, 네온 시스템, 프리미엄 액션에 좋습니다.', 'フォーカス、アクティブカード、ネオンUIに向いています。'),
    avoidWhen: t('Avoid low-contrast text on glowing backgrounds.', '글로우 위에 저대비 텍스트를 올리면 읽기 어렵습니다.', '光る背景の低コントラスト文字は避けます。'),
    prompt: t('Use glow on the border or shadow, while keeping text flat.', '텍스트는 평평하게 두고 border나 shadow에만 glow를 써줘.', '文字は平坦に保ち、borderやshadowだけglowにしてください。'),
  },
  {
    id: 'ripple',
    category: 'attention',
    preview: 'ripple',
    name: t('Ripple / Ping', '리플 / 핑', 'リップル / ピング'),
    aliases: ['material ripple', 'ping', 'wave', '파동', '물결'],
    short: t('A circle expands from a point like a wave.', '한 지점에서 원형 파동이 퍼져나가는 효과입니다.', '一点から円形の波が広がります。'),
    useWhen: t('Use for map markers, live dots, touch feedback, and new activity.', '지도 마커, 라이브 점, 터치 피드백, 새 활동 표시에 좋습니다.', '地図マーカー、ライブ点、タッチ反応に向いています。'),
    avoidWhen: t('Avoid if it competes with important reading content.', '중요한 읽기 콘텐츠와 경쟁하면 산만합니다.', '重要な読書内容と競合すると散漫です。'),
    prompt: t('Use a small ripple from the active dot only.', '활성 dot에서만 작은 ripple이 퍼지게 해줘.', 'アクティブな点からだけ小さなrippleを出してください。'),
  },
  {
    id: 'hover-lift',
    category: 'interaction',
    preview: 'hover-lift',
    name: t('Hover Lift', '호버 리프트', 'ホバーリフト'),
    aliases: ['card lift', 'raise', 'hover up', '카드 들림', '떠오름'],
    short: t('The element moves slightly upward on hover.', 'hover 시 카드나 버튼이 살짝 위로 떠오릅니다.', 'hover時にカードやボタンが少し上がります。'),
    useWhen: t('Use for clickable cards, product tiles, and CTAs.', '클릭 가능한 카드, 제품 타일, CTA에 좋습니다.', 'クリック可能なカードやCTAに向いています。'),
    avoidWhen: t('Avoid if every row in a dense table moves.', '촘촘한 테이블의 모든 행이 움직이면 피로합니다.', '高密度テーブルの全行には疲れます。'),
    prompt: t('Use hover lift with 2-4px movement and a shadow change.', '2-4px 이동과 shadow 변화의 hover lift를 써줘.', '2-4px移動と影変化のhover liftを使ってください。'),
  },
  {
    id: 'press',
    category: 'interaction',
    preview: 'press',
    name: t('Press / Tap', '프레스 / 탭', 'プレス / タップ'),
    aliases: ['button press', 'active state', '눌림', '클릭감'],
    short: t('The element compresses briefly when clicked or tapped.', '클릭하거나 탭할 때 잠깐 눌리는 느낌을 줍니다.', 'クリックやタップ時に一瞬押し込まれる感じを出します。'),
    useWhen: t('Use for buttons, toggles, chips, and mobile controls.', '버튼, 토글, 칩, 모바일 컨트롤에 좋습니다.', 'ボタン、トグル、チップ、モバイル操作に向いています。'),
    avoidWhen: t('Avoid scaling text-heavy layouts too much.', '텍스트가 많은 레이아웃을 크게 줄이면 흔들려 보입니다.', '文字の多いUIを大きく縮小すると揺れます。'),
    prompt: t('Use tap scale around 0.96-0.98 for buttons.', '버튼 tap scale은 0.96-0.98 정도로 해줘.', 'ボタンのtap scaleは0.96-0.98程度にしてください。'),
  },
  {
    id: 'tilt',
    category: 'interaction',
    preview: 'tilt',
    name: t('Tilt', '틸트', 'チルト'),
    aliases: ['3d card', 'rotate x y', '기울기', '3D 카드'],
    short: t('The card rotates slightly in 3D, often following hover.', '카드가 hover에 반응해 3D처럼 살짝 기울어집니다.', 'hoverに反応してカードが3D風に傾きます。'),
    useWhen: t('Use for visual galleries, launch pages, and premium product cards.', '비주얼 갤러리, 런칭 페이지, 프리미엄 제품 카드에 좋습니다.', 'ギャラリーや高級感あるカードに向いています。'),
    avoidWhen: t('Avoid for utilitarian controls where precision matters.', '정확한 조작이 중요한 실무형 컨트롤에는 과합니다.', '正確な操作が重要な業務UIには過剰です。'),
    prompt: t('Use a restrained 3D tilt on hero cards only.', '히어로 카드에만 절제된 3D tilt를 써줘.', 'ヒーローカードだけに控えめな3D tiltを使ってください。'),
  },
  {
    id: 'modal-pop',
    category: 'state',
    preview: 'modal',
    name: t('Modal Pop', '모달 팝', 'モーダルポップ'),
    aliases: ['dialog pop', 'scale modal', '팝업', '대화상자'],
    short: t('A modal fades and scales into the center.', '모달이 중앙에서 투명도와 크기 변화로 나타납니다.', 'モーダルが中央でフェードと拡大で表示されます。'),
    useWhen: t('Use for dialogs, confirmations, command palettes, and focused tasks.', '대화상자, 확인, 커맨드 팔레트, 집중 작업에 좋습니다.', 'ダイアログ、確認、コマンドパレットに向いています。'),
    avoidWhen: t('Avoid excessive bounce for serious confirmations.', '중요 확인창에 과한 bounce를 넣으면 가벼워 보입니다.', '重要な確認で強いbounceは軽く見えます。'),
    prompt: t('Use modal pop with fade, slight scale, and dimmed backdrop.', 'fade, 약한 scale, dimmed backdrop이 있는 modal pop을 써줘.', 'fade、弱いscale、暗いbackdrop付きのmodal popにしてください。'),
  },
  {
    id: 'toast-slide',
    category: 'state',
    preview: 'toast',
    name: t('Toast Slide', '토스트 슬라이드', 'トーストスライド'),
    aliases: ['notification slide', 'snackbar', '알림', '배너'],
    short: t('A small notification slides from an edge.', '작은 알림이 화면 가장자리에서 밀려 들어옵니다.', '小さな通知が画面端から入ります。'),
    useWhen: t('Use for saved, copied, synced, failed, and background events.', '저장, 복사, 동기화, 실패, 백그라운드 이벤트에 좋습니다.', '保存、コピー、同期、失敗通知に向いています。'),
    avoidWhen: t('Avoid for blocking decisions; use a modal instead.', '결정이 필요한 작업에는 토스트보다 모달이 맞습니다.', '判断が必要な時はトーストではなくモーダルです。'),
    prompt: t('Use toast slide from the nearest screen edge.', '가장 가까운 화면 edge에서 toast slide되게 해줘.', '近い画面端からtoast slideしてください。'),
  },
  {
    id: 'accordion',
    category: 'state',
    preview: 'accordion',
    name: t('Accordion Expand', '아코디언 확장', 'アコーディオン展開'),
    aliases: ['collapse', 'expand height', '펼침', '접힘'],
    short: t('A hidden area expands vertically below a header.', '숨겨진 영역이 헤더 아래로 세로 확장됩니다.', '隠れた領域がヘッダー下へ縦に展開します。'),
    useWhen: t('Use for FAQs, settings groups, filters, and progressive disclosure.', 'FAQ, 설정 묶음, 필터, 단계적 정보 공개에 좋습니다.', 'FAQ、設定、フィルター、段階的表示に向いています。'),
    avoidWhen: t('Avoid if height animation causes large layout jumps above the fold.', '첫 화면에서 큰 높이 변화가 레이아웃을 밀면 주의해야 합니다.', '大きな高さ変化でレイアウトが跳ぶ場合は注意です。'),
    prompt: t('Use accordion expand with height and opacity together.', 'height와 opacity를 함께 쓰는 accordion expand를 써줘.', 'heightとopacityを合わせたaccordion展開にしてください。'),
  },
  {
    id: 'crossfade',
    category: 'state',
    preview: 'crossfade',
    name: t('Crossfade', '크로스페이드', 'クロスフェード'),
    aliases: ['tab fade', 'fade between', '전환 페이드', '탭 전환'],
    short: t('One view fades out while the next fades in.', '한 화면이 사라지고 다음 화면이 겹치듯 나타납니다.', '一つの画面が消え、次が重なるように表示されます。'),
    useWhen: t('Use for tabs, media, image swaps, and same-size panels.', '탭, 미디어, 이미지 교체, 같은 크기의 패널에 좋습니다.', 'タブ、画像切替、同サイズパネルに向いています。'),
    avoidWhen: t('Avoid when two views have very different sizes without layout handling.', '두 화면 크기가 크게 다르면 레이아웃 처리 없이 쓰기 어렵습니다.', 'サイズが大きく違うビューでは注意です。'),
    prompt: t('Use crossfade for same-size tab panels.', '같은 크기의 탭 패널에는 crossfade를 써줘.', '同サイズのタブパネルにはcrossfadeを使ってください。'),
  },
  {
    id: 'skeleton-shimmer',
    category: 'loading',
    preview: 'skeleton',
    name: t('Skeleton Shimmer', '스켈레톤 쉬머', 'スケルトンシマー'),
    aliases: ['placeholder shimmer', 'loading skeleton', '회색 뼈대', '반짝임'],
    short: t('Placeholder blocks shimmer while real content loads.', '실제 콘텐츠가 오기 전 회색 뼈대가 빛나듯 움직입니다.', '本物の内容が来る前にプレースホルダーが光ります。'),
    useWhen: t('Use for cards, lists, dashboards, feeds, and predictable content.', '카드, 리스트, 대시보드, 피드처럼 구조가 예측되는 로딩에 좋습니다.', 'カード、リスト、ダッシュボード、フィードに向いています。'),
    avoidWhen: t('Avoid if content shape is unknown or loading is nearly instant.', '구조를 예측할 수 없거나 로딩이 매우 짧으면 불필요합니다.', '形が不明または即時読み込みなら不要です。'),
    prompt: t('Use skeleton shimmer that matches the final content layout.', '최종 콘텐츠 레이아웃과 같은 skeleton shimmer를 써줘.', '最終レイアウトに合うskeleton shimmerを使ってください。'),
  },
  {
    id: 'spinner',
    category: 'loading',
    preview: 'spinner',
    name: t('Spinner', '스피너', 'スピナー'),
    aliases: ['loader', 'circle loader', '돌아감', '로더'],
    short: t('A circular indicator rotates while work is pending.', '작업 대기 중 원형 표시가 계속 회전합니다.', '処理待ち中に円形表示が回転します。'),
    useWhen: t('Use for short unknown waits and compact controls.', '짧고 구조를 알 수 없는 대기나 작은 컨트롤에 좋습니다.', '短く形が不明な待機や小さな操作に向いています。'),
    avoidWhen: t('Avoid as the only feedback for long waits.', '긴 대기에서 스피너만 보여주면 답답합니다.', '長い待機でスピナーだけは不親切です。'),
    prompt: t('Use spinner only for short pending states.', '짧은 pending 상태에만 spinner를 써줘.', '短いpending状態にだけspinnerを使ってください。'),
  },
  {
    id: 'progress-bar',
    category: 'loading',
    preview: 'progress',
    name: t('Progress Bar', '프로그레스 바', 'プログレスバー'),
    aliases: ['loading bar', 'upload progress', '진행률', '게이지'],
    short: t('A bar fills to communicate measurable progress.', '막대가 채워지며 측정 가능한 진행률을 보여줍니다.', 'バーが満ちて測定可能な進捗を示します。'),
    useWhen: t('Use for uploads, installs, generation, exports, and multi-step work.', '업로드, 설치, 생성, 내보내기, 여러 단계 작업에 좋습니다.', 'アップロード、生成、書き出し、複数段階作業に向いています。'),
    avoidWhen: t('Avoid fake exact progress if the backend cannot measure it.', '실제 측정이 안 되는데 정확한 진행률처럼 보이면 신뢰가 떨어집니다.', '測定不能なのに正確に見せると信頼を失います。'),
    prompt: t('Use a progress bar when progress is measurable.', '측정 가능한 작업에는 progress bar를 써줘.', '測定可能な作業にはprogress barを使ってください。'),
  },
  {
    id: 'loading-dots',
    category: 'loading',
    preview: 'dots',
    name: t('Loading Dots', '로딩 도트', 'ローディングドット'),
    aliases: ['typing dots', 'ellipsis', '점점점', '타이핑'],
    short: t('Dots animate in sequence to imply waiting or typing.', '점들이 순서대로 움직이며 대기나 입력 중 상태를 표현합니다.', '点が順番に動き、待機や入力中を示します。'),
    useWhen: t('Use for chat, assistant replies, small cards, and lightweight waits.', '채팅, assistant 응답, 작은 카드, 가벼운 대기에 좋습니다.', 'チャット、返信待ち、小さな待機に向いています。'),
    avoidWhen: t('Avoid for serious long-running tasks without a status message.', '긴 작업에 상태 설명 없이 도트만 두면 부족합니다.', '長い作業で説明なしのdotsだけは不足です。'),
    prompt: t('Use loading dots with a status label.', '상태 라벨과 함께 loading dots를 써줘.', '状態ラベルと一緒にloading dotsを使ってください。'),
  },
  {
    id: 'scroll-reveal',
    category: 'scroll',
    preview: 'scroll-reveal',
    name: t('Scroll Reveal', '스크롤 리빌', 'スクロールリビール'),
    aliases: ['while in view', 'viewport reveal', '스크롤 등장', '뷰포트'],
    short: t('Elements reveal as they enter the viewport.', '요소가 뷰포트에 들어올 때 나타납니다.', '要素が表示領域に入る時に表示されます。'),
    useWhen: t('Use for long landing pages, feature sections, and storytelling.', '긴 랜딩 페이지, 기능 섹션, 스토리텔링에 좋습니다.', '長いランディング、機能セクションに向いています。'),
    avoidWhen: t('Avoid hiding essential information until animation runs.', '핵심 정보를 애니메이션 전까지 숨기는 방식은 피해야 합니다.', '重要情報をアニメ前まで隠すのは避けます。'),
    prompt: t('Use scroll reveal but keep content readable without animation.', 'scroll reveal을 쓰되 애니메이션 없이도 콘텐츠가 읽히게 해줘.', 'scroll revealを使ってもアニメなしで読めるようにしてください。'),
  },
  {
    id: 'parallax',
    category: 'scroll',
    preview: 'parallax',
    name: t('Parallax', '패럴랙스', 'パララックス'),
    aliases: ['depth scroll', 'different speed', '깊이감', '배경 이동'],
    short: t('Foreground and background move at different speeds.', '앞쪽과 뒤쪽 레이어가 서로 다른 속도로 움직여 깊이감을 만듭니다.', '前景と背景が異なる速度で動き、奥行きを作ります。'),
    useWhen: t('Use for editorial heroes, product storytelling, and immersive sections.', '에디토리얼 히어로, 제품 스토리텔링, 몰입형 섹션에 좋습니다.', 'エディトリアルヒーローや没入型セクションに向いています。'),
    avoidWhen: t('Avoid on dense tools, low-power devices, or text-heavy areas.', '업무 도구, 저사양 기기, 텍스트가 많은 영역에는 부담이 큽니다.', '業務UI、低性能端末、文章中心には重いです。'),
    prompt: t('Use subtle parallax only in visual hero sections.', '비주얼 히어로 섹션에만 은은한 parallax를 써줘.', '視覚的ヒーローだけに控えめなparallaxを使ってください。'),
  },
  {
    id: 'marquee',
    category: 'ambient',
    preview: 'marquee',
    name: t('Marquee', '마키', 'マーキー'),
    aliases: ['ticker', 'infinite text loop', '흐르는 텍스트', '티커'],
    short: t('Text or items move horizontally in an infinite loop.', '텍스트나 항목이 가로로 계속 흘러갑니다.', 'テキストや項目が横に流れ続けます。'),
    useWhen: t('Use for partner logos, editorial tickers, tags, and event energy.', '파트너 로고, 티커, 태그, 이벤트 분위기에 좋습니다.', 'ロゴ列、ティッカー、タグ、イベント感に向いています。'),
    avoidWhen: t('Avoid for important copy users must read completely.', '끝까지 읽어야 하는 중요한 문구에는 부적합합니다.', '完全に読む必要がある重要文には不向きです。'),
    prompt: t('Use marquee only for decorative repeated labels.', '장식적인 반복 라벨에만 marquee를 써줘.', '装飾的な反復ラベルにだけmarqueeを使ってください。'),
  },
  {
    id: 'orbit',
    category: 'ambient',
    preview: 'orbit',
    name: t('Orbit', '오빗', 'オービット'),
    aliases: ['circle around', 'rotating satellites', '궤도', '공전'],
    short: t('Small elements rotate around a center point.', '작은 요소들이 중심점을 기준으로 공전합니다.', '小さな要素が中心の周りを回ります。'),
    useWhen: t('Use for AI, systems, dashboards, network, and orbital brand motifs.', 'AI, 시스템, 대시보드, 네트워크, 궤도형 브랜드 모티프에 좋습니다.', 'AI、システム、ネットワーク表現に向いています。'),
    avoidWhen: t('Avoid near dense copy or precise controls.', '촘촘한 본문이나 정밀 컨트롤 근처에서는 산만합니다.', '密な本文や精密操作の近くでは散漫です。'),
    prompt: t('Use a slow orbit as a background motif, not foreground content.', '전면 콘텐츠가 아니라 배경 모티프로 느린 orbit을 써줘.', '前景ではなく背景モチーフとして遅いorbitを使ってください。'),
  },
  {
    id: 'floating',
    category: 'ambient',
    preview: 'float',
    name: t('Floating', '플로팅', 'フローティング'),
    aliases: ['drift', 'bob', 'hovering', '둥둥', '부유'],
    short: t('The element slowly moves up and down or drifts.', '요소가 천천히 위아래로 떠다니거나 이동합니다.', '要素がゆっくり上下または漂うように動きます。'),
    useWhen: t('Use for illustrations, empty states, playful onboarding, and ambient objects.', '일러스트, 빈 상태, playful 온보딩, 분위기 오브젝트에 좋습니다.', 'イラスト、空状態、オンボーディングに向いています。'),
    avoidWhen: t('Avoid on text and form controls.', '텍스트와 폼 컨트롤에는 쓰지 않는 편이 좋습니다.', '文字やフォーム操作には不向きです。'),
    prompt: t('Use slow floating on decorative objects only.', '장식 오브젝트에만 느린 floating을 써줘.', '装飾オブジェクトだけに遅いfloatingを使ってください。'),
  },
  {
    id: 'gradient-drift',
    category: 'ambient',
    preview: 'gradient',
    name: t('Gradient Drift', '그라디언트 드리프트', 'グラデーションドリフト'),
    aliases: ['animated gradient', 'mesh drift', 'color movement', '색 흐름', '메시'],
    short: t('Gradient colors move slowly across a surface.', '그라디언트 색이 표면 위에서 천천히 흐릅니다.', 'グラデーション色が表面上をゆっくり動きます。'),
    useWhen: t('Use for AI tools, creative products, hero backgrounds, and premium surfaces.', 'AI 도구, 크리에이티브 제품, 히어로 배경, 프리미엄 표면에 좋습니다.', 'AIツール、クリエイティブ製品、ヒーロー背景に向いています。'),
    avoidWhen: t('Avoid behind small text or important data.', '작은 텍스트나 중요한 데이터 뒤에는 피해야 합니다.', '小さい文字や重要データの背後では避けます。'),
    prompt: t('Use gradient drift behind solid content panels.', '단단한 콘텐츠 패널 뒤에만 gradient drift를 써줘.', '堅いコンテンツパネルの背後にだけgradient driftを使ってください。'),
  },
];
