import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

const copy = {
  en: {
    eyebrow: 'Fusion / Soft Product Swiss',
    title: 'Design as a place to think, not just a tool.',
    lead: 'Warm paper, friendly display type, and a believable design-file canvas. Color appears as interface material — selections, comments, swatches, cursors — never as a full-page mood.',
    primary: 'Copy prompt',
    secondary: 'Compare sources',
    share: 'Share',
    navBrief: 'Brief',
    navCanvas: 'Canvas',
    navRules: 'Rules',
    navPrompt: 'Prompt',
    styleSectionsAria: 'Style sections',
    collaboratorsAria: 'Collaborators',
    pagesLayersAria: 'Pages and layers',
    inspectorAria: 'Inspector',
    paletteAria: 'Palette',
    styleMetricsAria: 'Style metrics',
    rolesAria: 'Collaboration roles',
    principlesAria: 'Design principles',
    pageNavAria: 'Page navigation',
    twoMinutesLabel: '2m',
    nowLabel: 'now',
    fileName: 'Webstylebook — Homepage v3',
    fileMeta: 'Edited 2 min ago',
    presence: ['Mina', 'Alex', 'June'],
    pageLabel: 'Pages',
    pages: ['Cover', 'Homepage', 'Pricing', 'Components', 'Tokens'],
    layerLabel: 'Layers',
    layers: [
      { name: 'Hero / Frame', kind: 'frame' },
      { name: 'Display heading', kind: 'text' },
      { name: 'Subhead', kind: 'text' },
      { name: 'CTA / Primary', kind: 'component' },
      { name: 'Product card', kind: 'group', active: true },
      { name: 'Collab cursors', kind: 'group' },
    ],
    inspectorLabel: 'Design',
    inspectorRows: [
      ['Fill', 'Warm paper · #FFFDFA'],
      ['Stroke', '1 · #E6DFD2'],
      ['Radius', '14 px'],
      ['Effects', 'Drop shadow · soft'],
    ],
    palette: ['Coral', 'Yellow', 'Blue', 'Green', 'Lilac'],
    autoLayout: 'Auto layout · 24 / 16',
    frameTitle: 'Homepage / first viewport',
    frameHeading: 'A warmer way to ship the first viewport.',
    frameBody: 'Pair Swiss spacing with a single believable canvas. Let color do the small jobs.',
    chipPrimary: 'Get started',
    chipGhost: 'See live',
    commentOne: { author: 'Mina', body: 'This should feel useful before it feels decorative.' },
    commentTwo: { author: 'Alex', body: 'Use color like interface material, not decoration for its own sake.' },
    metrics: [
      ['Canvas', 'Warm paper'],
      ['Grid', '12 · soft columns'],
      ['Color', '5 UI tokens'],
      ['Motion', 'Gentle reveal'],
    ],
    roles: ['Design', 'Product', 'Engineering', 'Research', 'Marketing', 'Support'],
    principles: [
      {
        label: '01',
        title: 'Start with a useful canvas',
        body: 'The hero visual should feel like someone is designing a website inside a tool. That keeps the page specific and avoids the generic product-SaaS smell.',
      },
      {
        label: '02',
        title: 'Use Swiss spacing quietly',
        body: 'The grid is present, but it should not shout. Calm columns and stable type give the colorful objects a reason to exist.',
      },
      {
        label: '03',
        title: 'Make color behave like interface material',
        body: 'Yellow, blue, coral, green, and lilac appear as ribbons, selections, badges, comments, and panels. They never flood the page as a mood layer.',
      },
    ],
    rulesTitle: 'Promptable rules',
    rulesHeading: 'Product proof first. Color second. Grid always.',
    rules: [
      'Warm paper first; never start from a full-screen gradient.',
      'Show one believable web-design canvas above the fold.',
      'Use strong type only for hierarchy, not for every label.',
      'Use soft rounded tool surfaces, but keep layout edges disciplined.',
      'Animate entry and attention states only; avoid decorative looping motion.',
    ],
    promptHeading: 'AI Request Prompt',
    prevLabel: 'Previous',
    nextLabel: 'Next',
  },
  ko: {
    eyebrow: 'Fusion / Soft Product Swiss',
    title: '디자인은 도구가 아니라, 생각하는 장소다.',
    lead: '따뜻한 종이, 친근한 디스플레이 타이포, 그리고 진짜처럼 보이는 디자인 파일 캔버스. 컬러는 선택 영역·코멘트·스와치·커서 같은 인터페이스 재료로 등장하고, 페이지 전체를 무드로 덮지 않습니다.',
    primary: '프롬프트 복사',
    secondary: '원본 스타일 비교',
    share: '공유',
    navBrief: '브리프',
    navCanvas: '캔버스',
    navRules: '규칙',
    navPrompt: '프롬프트',
    styleSectionsAria: '스타일 섹션',
    collaboratorsAria: '협업자',
    pagesLayersAria: '페이지와 레이어',
    inspectorAria: '인스펙터',
    paletteAria: '팔레트',
    styleMetricsAria: '스타일 지표',
    rolesAria: '협업 역할',
    principlesAria: '디자인 원칙',
    pageNavAria: '페이지 내비게이션',
    twoMinutesLabel: '2분',
    nowLabel: '방금',
    fileName: 'Webstylebook — 홈페이지 v3',
    fileMeta: '2분 전 편집',
    presence: ['민아', '알렉스', '준'],
    pageLabel: '페이지',
    pages: ['커버', '홈페이지', '가격', '컴포넌트', '토큰'],
    layerLabel: '레이어',
    layers: [
      { name: '히어로 / 프레임', kind: 'frame' },
      { name: '디스플레이 헤딩', kind: 'text' },
      { name: '서브 헤드', kind: 'text' },
      { name: 'CTA / 주 버튼', kind: 'component' },
      { name: '제품 카드', kind: 'group', active: true },
      { name: '협업 커서', kind: 'group' },
    ],
    inspectorLabel: '디자인',
    inspectorRows: [
      ['채우기', '따뜻한 종이 · #FFFDFA'],
      ['선', '1 · #E6DFD2'],
      ['반경', '14 px'],
      ['효과', '드롭 섀도 · 부드럽게'],
    ],
    palette: ['코랄', '옐로우', '블루', '그린', '라일락'],
    autoLayout: '자동 레이아웃 · 24 / 16',
    frameTitle: '홈페이지 / 첫 화면',
    frameHeading: '첫 화면을 더 따뜻하게 출시하는 방법.',
    frameBody: '스위스식 간격과 하나의 믿을 수 있는 캔버스, 컬러는 작은 일에만 씁니다.',
    chipPrimary: '시작하기',
    chipGhost: '실제로 보기',
    commentOne: { author: '민아', body: '장식처럼 보이기 전에 쓸모 있어 보여야 합니다.' },
    commentTwo: { author: '알렉스', body: '컬러는 장식이 아니라 인터페이스 재료처럼 쓰세요.' },
    metrics: [
      ['캔버스', '따뜻한 종이'],
      ['그리드', '12 · 부드러운 컬럼'],
      ['컬러', 'UI 토큰 5개'],
      ['모션', '잔잔한 등장'],
    ],
    roles: ['디자인', '제품', '엔지니어링', '리서치', '마케팅', '지원'],
    principles: [
      {
        label: '01',
        title: '쓸모 있는 캔버스부터 보여주기',
        body: '히어로 비주얼은 누군가 웹사이트를 디자인 툴 안에서 만들고 있는 장면처럼 보여야 합니다. 그래야 흔한 제품 SaaS 느낌에서 벗어납니다.',
      },
      {
        label: '02',
        title: '스위스 간격을 조용하게 쓰기',
        body: '그리드는 있어야 하지만 소리치면 안 됩니다. 차분한 컬럼과 안정적인 타이포가 있어야 컬러 오브젝트도 이유를 갖습니다.',
      },
      {
        label: '03',
        title: '컬러를 UI 재료처럼 다루기',
        body: '노랑, 파랑, 코랄, 초록, 라일락은 리본, 선택 영역, 배지, 댓글, 패널로 등장합니다. 페이지 전체를 분위기로 덮지 않습니다.',
      },
    ],
    rulesTitle: '프롬프트 규칙',
    rulesHeading: '제품의 증거가 먼저. 컬러는 그 다음. 그리드는 항상.',
    rules: [
      '따뜻한 종이 캔버스를 먼저 잡고, 전체 화면 그라데이션에서 시작하지 않습니다.',
      '첫 화면에는 믿을 수 있는 웹디자인 캔버스 하나를 반드시 보여줍니다.',
      '강한 타이포는 위계에만 쓰고 모든 라벨에 남발하지 않습니다.',
      '툴 표면은 부드럽게 둥글리되 레이아웃의 축은 흐트러뜨리지 않습니다.',
      '등장과 주의 유도 상태만 움직이고, 장식용 루프 모션은 피합니다.',
    ],
    promptHeading: 'AI 요청 프롬프트',
    prevLabel: '이전',
    nextLabel: '다음',
  },
  ja: {
    eyebrow: 'Fusion / Soft Product Swiss',
    title: 'デザインは道具ではなく、考える場所。',
    lead: '温かい紙、親しみのあるディスプレイ書体、そして本物のように見えるデザインファイルのキャンバス。色は選択範囲・コメント・スウォッチ・カーソルなどUI素材として現れ、ページ全体を覆いません。',
    primary: 'プロンプトをコピー',
    secondary: '元スタイルを比較',
    share: '共有',
    navBrief: 'ブリーフ',
    navCanvas: 'キャンバス',
    navRules: 'ルール',
    navPrompt: 'プロンプト',
    styleSectionsAria: 'スタイルセクション',
    collaboratorsAria: '共同作業者',
    pagesLayersAria: 'ページとレイヤー',
    inspectorAria: 'インスペクター',
    paletteAria: 'パレット',
    styleMetricsAria: 'スタイル指標',
    rolesAria: '共同作業の役割',
    principlesAria: 'デザイン原則',
    pageNavAria: 'ページナビゲーション',
    twoMinutesLabel: '2分',
    nowLabel: '今',
    fileName: 'Webstylebook — Homepage v3',
    fileMeta: '2分前に編集',
    presence: ['ミナ', 'アレックス', 'ジュン'],
    pageLabel: 'ページ',
    pages: ['カバー', 'ホームページ', '料金', 'コンポーネント', 'トークン'],
    layerLabel: 'レイヤー',
    layers: [
      { name: 'ヒーロー / フレーム', kind: 'frame' },
      { name: 'ディスプレイ見出し', kind: 'text' },
      { name: 'サブヘッド', kind: 'text' },
      { name: 'CTA / 主ボタン', kind: 'component' },
      { name: 'プロダクトカード', kind: 'group', active: true },
      { name: '共同作業カーソル', kind: 'group' },
    ],
    inspectorLabel: 'デザイン',
    inspectorRows: [
      ['塗り', '温かい紙 · #FFFDFA'],
      ['線', '1 · #E6DFD2'],
      ['角丸', '14 px'],
      ['効果', 'ドロップシャドウ · ソフト'],
    ],
    palette: ['コーラル', 'イエロー', 'ブルー', 'グリーン', 'ライラック'],
    autoLayout: 'オートレイアウト · 24 / 16',
    frameTitle: 'ホームページ / ファーストビュー',
    frameHeading: 'ファーストビューを、もっと温かく出す。',
    frameBody: 'スイス的な余白と、ひとつの信頼できるキャンバス。色は小さな仕事にだけ使う。',
    chipPrimary: 'はじめる',
    chipGhost: '実際に見る',
    commentOne: { author: 'ミナ', body: '装飾に見える前に、役に立つものとして見せる。' },
    commentTwo: { author: 'アレックス', body: '色は装飾ではなく、インターフェース素材として使う。' },
    metrics: [
      ['キャンバス', '温かい紙'],
      ['グリッド', '12 · 柔らかいカラム'],
      ['カラー', 'UIトークン5個'],
      ['モーション', '静かな表示'],
    ],
    roles: ['デザイン', 'プロダクト', 'エンジニアリング', 'リサーチ', 'マーケティング', 'サポート'],
    principles: [
      {
        label: '01',
        title: '役に立つキャンバスから始める',
        body: 'ヒーローのビジュアルは、誰かがデザインツール内でWebサイトを作っている場面に見せます。汎用的なプロダクトSaaS感を抑えられます。',
      },
      {
        label: '02',
        title: 'スイス的な余白を静かに使う',
        body: 'グリッドは必要ですが、主張しすぎてはいけません。落ち着いたカラムと安定した文字組みが、色のオブジェクトに理由を与えます。',
      },
      {
        label: '03',
        title: '色をUI素材として扱う',
        body: '黄色、青、コーラル、緑、ライラックはリボン、選択範囲、バッジ、コメント、パネルとして使います。ページ全体をムードで覆わせません。',
      },
    ],
    rulesTitle: 'プロンプト可能なルール',
    rulesHeading: 'プロダクトの証拠が先。色は次。グリッドはつねに。',
    rules: [
      '温かい紙のキャンバスを先に決め、全画面グラデーションから始めない。',
      'ファーストビューに信頼できるWebデザインキャンバスをひとつ見せる。',
      '強いタイポグラフィは階層にだけ使い、全ラベルには使わない。',
      'ツール面はやわらかく丸めても、レイアウトの軸は崩さない。',
      '表示と注意喚起だけを動かし、装飾ループモーションは避ける。',
    ],
    promptHeading: 'AIリクエストプロンプト',
    prevLabel: '前へ',
    nextLabel: '次へ',
  },
} as const;

const promptText = {
  en: `Design a web landing page in Soft Product Swiss fusion style: a warm web-design page where Swiss spacing supports a friendly product-editorial canvas.

COLOR TOKENS:
--paper: #fffdfa
--canvas: #ffffff
--ink: #161616
--line: #e6dfd2
--wash: #fbf5ea
--yellow: #ffd84d
--blue: #73d7ff
--coral: #ff765f
--green: #78d88c
--lilac: #cbb7ff
Use color as interface material: rainbow arcs, selection boxes, palette chips, comments, cursors, and small panels. Do not use a full-page gradient.

TYPOGRAPHY:
Heading: confident grotesk sans, 760-840 weight, generous enough to feel friendly, no negative tracking.
Body: readable product sans, 400-520 weight, line-height 1.6.
Utility labels: mono or tabular sans, 11-13px uppercase.

LAYOUT:
Warm paper background with a very quiet grid.
Display heading spans the top; a believable design-file canvas sits below it.
Canvas has: a window chrome (file name + presence avatars), a left pages/layers rail, a central artboard, a right inspector with fills/strokes/effects, and small floating elements (palette swatches, selection box, named cursors, comment cards).
Below the canvas, add role chips, metric cards, three principle cards, and promptable rules.
Product visual must feel like someone is designing a website inside a tool.

MOTION:
Stagger heading, canvas, cursors, and comment cards over 600-900ms.
Use small translateY and scale changes only.
Cursor and comment hover can lift by 4px.
Respect prefers-reduced-motion.

FORBIDDEN:
Purple/blue AI SaaS gradients.
Floating abstract blobs without product meaning.
Heavy black poster frames or hard offset shadows.
Stock photos in the hero.
Decorative loops that do not explain collaboration or workflow.

OUTPUT:
1. CSS variables and component tokens.
2. Responsive heading + full-width design canvas.
3. Role chips, principle cards, and promptable design rules.
4. Mobile layout with no horizontal overflow.`,
  ko: `Soft Product Swiss 퓨전 스타일의 웹 랜딩 페이지를 디자인해줘: 스위스식 간격이 부드러운 제품-에디토리얼 캔버스를 받쳐주는 따뜻한 웹디자인 페이지.

색상 토큰:
--paper: #fffdfa
--canvas: #ffffff
--ink: #161616
--line: #e6dfd2
--wash: #fbf5ea
--yellow: #ffd84d
--blue: #73d7ff
--coral: #ff765f
--green: #78d88c
--lilac: #cbb7ff
컬러는 무지개형 리본, 선택 박스, 팔레트 칩, 댓글, 커서, 작은 패널 같은 인터페이스 재료로 사용. 전체 페이지 그라데이션 금지.

타이포그래피:
헤딩: 자신감 있는 그로테스크 산세리프, 760-840 weight, 친근하게 느껴질 만큼 여유 있게, 음수 자간 금지.
본문: 읽기 좋은 제품 산세리프, 400-520 weight, line-height 1.6.
유틸리티 라벨: 모노 또는 tabular sans, 11-13px uppercase.

레이아웃:
따뜻한 종이 배경과 아주 조용한 그리드.
디스플레이 헤딩은 위, 그 아래에 믿을 수 있는 디자인 파일 캔버스.
캔버스에는: 윈도우 크롬(파일명 + 협업자 아바타), 왼쪽 페이지/레이어 레일, 중앙 아트보드, 오른쪽 인스펙터(fill·stroke·effects), 작은 플로팅 요소(팔레트 스와치, 선택 박스, 이름 커서, 댓글 카드).
캔버스 아래에는 역할 칩, 메트릭 카드, 원칙 카드 3개, 프롬프트 규칙 배치.
제품 비주얼은 누군가 디자인 툴 안에서 웹사이트를 만들고 있는 장면처럼 보여야 함.

모션:
헤딩, 캔버스, 커서, 댓글 카드를 600-900ms 안에서 순차 등장.
작은 translateY와 scale 변화만 사용.
커서와 댓글 hover는 4px만 상승.
prefers-reduced-motion 준수.

금지:
보라/파랑 AI SaaS 그라데이션.
제품 의미 없는 추상 블롭.
두꺼운 검은 포스터 프레임 또는 하드 오프셋 그림자.
히어로의 스톡 사진.
협업이나 워크플로우를 설명하지 않는 장식 루프.

출력:
1. CSS 변수와 컴포넌트 토큰.
2. 반응형 헤딩 + 풀폭 디자인 캔버스.
3. 역할 칩, 원칙 카드, 프롬프트 가능한 디자인 규칙.
4. 가로 스크롤 없는 모바일 레이아웃.`,
  ja: `Soft Product SwissフュージョンスタイルのWebランディングページをデザインしてください。スイス的な余白が、やわらかなプロダクトエディトリアルのキャンバスを支える温かいWebデザインページです。

カラートークン:
--paper: #fffdfa
--canvas: #ffffff
--ink: #161616
--line: #e6dfd2
--wash: #fbf5ea
--yellow: #ffd84d
--blue: #73d7ff
--coral: #ff765f
--green: #78d88c
--lilac: #cbb7ff
色は虹色のリボン、選択ボックス、パレットチップ、コメント、カーソル、小さなパネルなどのインターフェース素材として使う。全画面グラデーションは禁止。

タイポグラフィ:
見出し: 自信のあるグロテスク系サンセリフ、760-840 weight、親しみを感じる余白、ネガティブトラッキングなし。
本文: 読みやすいプロダクトサンセリフ、400-520 weight、line-height 1.6。
ユーティリティラベル: モノまたはtabular sans、11-13px uppercase。

レイアウト:
温かい紙の背景と、とても静かなグリッド。
ディスプレイ見出しは上、その下に信頼できるデザインファイルのキャンバス。
キャンバスには: ウィンドウクローム（ファイル名 + 共同作業者アバター）、左のページ/レイヤーレール、中央のアートボード、右のインスペクター（fill·stroke·effects）、小さなフローティング要素（パレットスウォッチ、選択ボックス、名前付きカーソル、コメントカード）。
キャンバスの下にロールチップ、メトリックカード、原則カード3枚、プロンプト可能なルールを置く。
プロダクトビジュアルは、誰かがデザインツール内でWebサイトを作っている場面に見せる。

モーション:
見出し、キャンバス、カーソル、コメントカードを600-900msで順に表示。
小さなtranslateYとscaleだけを使う。
カーソルとコメントhoverは4pxだけ持ち上げる。
prefers-reduced-motionを尊重。

禁止:
紫/青のAI SaaSグラデーション。
プロダクト意味のない抽象ブロブ。
重い黒のポスターフレームやハードオフセット影。
ヒーローでのストック写真。
共同作業やワークフローを説明しない装飾ループ。

出力:
1. CSS変数とコンポーネントトークン。
2. レスポンシブ見出し + 全幅デザインキャンバス。
3. ロールチップ、原則カード、プロンプト可能なデザインルール。
4. 横スクロールのないモバイルレイアウト。`,
} as const;

const layerIcon: Record<string, string> = {
  frame: 'F',
  text: 'T',
  component: '◇',
  group: '▢',
};

export function PortedFusionProductSwissPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  const c = copy[lang];

  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--fusion-product-swiss">
      <a className="skip-link" href="#main-content" data-i18n="skip">Skip to content</a>
      <a className="page-back-link" href="/" data-i18n-aria="back.hub.aria" aria-label="Back to Hub">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span data-i18n="back.hub">Back to Hub</span>
      </a>

      <div className="ps-shell">
        <header className="ps-nav">
          <a className="ps-brand" href="#main-content" aria-label="Product x Swiss">
            <span className="ps-brand__mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>Product × Swiss</span>
          </a>
          <nav aria-label={c.styleSectionsAria} className="ps-nav__links">
            <a href="#brief">{c.navBrief}</a>
            <a href="#canvas">{c.navCanvas}</a>
            <a href="#rules">{c.navRules}</a>
            <a href="#style-prompt">{c.navPrompt}</a>
          </nav>
          <div className="ps-nav__actions">
            <div className="lang-dropdown" id="lang-dropdown">
              <button className="lang-toggle" id="lang-toggle" data-i18n-aria="lang.toggle.aria" aria-label="Switch language">English</button>
              <ul className="lang-menu" role="menu">
                <li><button role="menuitem" data-lang-select="en">English</button></li>
                <li><button role="menuitem" data-lang-select="ko">한국어</button></li>
                <li><button role="menuitem" data-lang-select="ja">日本語</button></li>
              </ul>
            </div>
            <a className="ps-btn ps-btn--outline" href="/pages/compare.html?left=fusion-product-swiss&right=swiss-poster">{c.secondary}</a>
          </div>
        </header>

        <main id="main-content">
          <section className="ps-hero" id="brief">
            <p className="ps-eyebrow">{c.eyebrow}</p>
            <h1 className="ps-display">{c.title}</h1>
            <div className="ps-hero__foot">
              <p className="ps-lead">{c.lead}</p>
              <div className="ps-actions">
                <a className="ps-btn ps-btn--dark" href="#style-prompt">{c.primary}</a>
                <a className="ps-btn ps-btn--ghost" href="/pages/swiss-poster.html">Swiss Poster ↗</a>
              </div>
            </div>
          </section>

          <section className="ps-canvas" id="canvas" aria-label={c.fileName}>
            <header className="ps-canvas__chrome">
              <div className="ps-canvas__chrome-left">
                <span className="ps-traffic" aria-hidden="true"><i /><i /><i /></span>
                <span className="ps-file">
                  <span className="ps-file__icon" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="ps-file__text">
                    <strong>{c.fileName}</strong>
                    <small>{c.fileMeta}</small>
                  </span>
                </span>
              </div>
              <div className="ps-canvas__chrome-right">
                <div className="ps-presence" aria-label={c.collaboratorsAria}>
                  {c.presence.map((person, idx) => (
                    <span key={person} className={`ps-presence__avatar ps-presence__avatar--${idx}`}>{person.slice(0, 1)}</span>
                  ))}
                </div>
                <span className="ps-zoom">100%</span>
                <button type="button" className="ps-canvas__share">{c.share}</button>
              </div>
            </header>

            <div className="ps-canvas__body">
              <aside className="ps-rail" aria-label={c.pagesLayersAria}>
                <p className="ps-rail__label">{c.pageLabel}</p>
                <ul className="ps-rail__pages">
                  {c.pages.map((page, idx) => (
                    <li key={page} className={idx === 1 ? 'is-active' : ''}>
                      <span aria-hidden="true">▾</span>
                      {page}
                    </li>
                  ))}
                </ul>
                <p className="ps-rail__label">{c.layerLabel}</p>
                <ul className="ps-rail__layers">
                  {c.layers.map((layer) => (
                    <li key={layer.name} className={'active' in layer && layer.active ? 'is-active' : ''}>
                      <span className={`ps-layer-icon ps-layer-icon--${layer.kind}`} aria-hidden="true">
                        {layerIcon[layer.kind]}
                      </span>
                      {layer.name}
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="ps-stage">
                <div className="ps-ruler" aria-hidden="true" />
                <div className="ps-artboard">
                  <div className="ps-artboard__tag">{c.frameTitle} · 1440</div>
                  <div className="ps-mini">
                    <div className="ps-mini__nav">
                      <span />
                      <span />
                      <span />
                      <em>↗</em>
                    </div>
                    <div className="ps-mini__body">
                      <div className="ps-mini__copy">
                        <span className="ps-mini__chip">v3 · Spring</span>
                        <h3>{c.frameHeading}</h3>
                        <p>{c.frameBody}</p>
                        <div className="ps-mini__buttons">
                          <span className="ps-mini__cta">{c.chipPrimary}</span>
                          <span className="ps-mini__cta ps-mini__cta--ghost">{c.chipGhost}</span>
                        </div>
                      </div>
                      <div className="ps-mini__product" aria-hidden="true">
                        <div className="ps-mini__card ps-mini__card--lilac">
                          <span />
                          <span />
                          <span />
                        </div>
                        <div className="ps-mini__card ps-mini__card--yellow">
                          <em>↑ 28%</em>
                          <span />
                        </div>
                        <div className="ps-mini__card ps-mini__card--blue">
                          <i />
                          <i />
                          <i />
                        </div>
                        <div className="ps-mini__card ps-mini__card--green">
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ps-selection" aria-hidden="true">
                    <span className="ps-selection__handle ps-selection__handle--tl" />
                    <span className="ps-selection__handle ps-selection__handle--tr" />
                    <span className="ps-selection__handle ps-selection__handle--bl" />
                    <span className="ps-selection__handle ps-selection__handle--br" />
                    <span className="ps-selection__dim">240 × 168</span>
                  </div>

                  <div className="ps-cursor ps-cursor--coral" aria-hidden="true">
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 2 L17 9 L10 11 L8 17 Z" /></svg>
                    <span>Alex</span>
                  </div>
                  <div className="ps-cursor ps-cursor--blue" aria-hidden="true">
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 2 L17 9 L10 11 L8 17 Z" /></svg>
                    <span>Mina</span>
                  </div>

                  <article className="ps-comment ps-comment--one">
                    <header>
                      <span className="ps-comment__avatar">{c.commentOne.author.slice(0, 1)}</span>
                      <strong>{c.commentOne.author}</strong>
                      <em>· {c.twoMinutesLabel}</em>
                    </header>
                    <p>{c.commentOne.body}</p>
                  </article>
                  <article className="ps-comment ps-comment--two">
                    <header>
                      <span className="ps-comment__avatar ps-comment__avatar--alt">{c.commentTwo.author.slice(0, 1)}</span>
                      <strong>{c.commentTwo.author}</strong>
                      <em>· {c.nowLabel}</em>
                    </header>
                    <p>{c.commentTwo.body}</p>
                  </article>
                </div>
              </div>

              <aside className="ps-inspector" aria-label={c.inspectorAria}>
                <p className="ps-rail__label">{c.inspectorLabel}</p>
                <dl className="ps-inspector__rows">
                  {c.inspectorRows.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="ps-inspector__palette" aria-label={c.paletteAria}>
                  {c.palette.map((swatch, idx) => (
                    <span key={swatch} className={`ps-swatch ps-swatch--${idx}`} title={swatch} />
                  ))}
                </div>
                <div className="ps-inspector__autolayout">{c.autoLayout}</div>
                <div className="ps-inspector__bars" aria-hidden="true">
                  <span style={{ width: '74%' }} />
                  <span style={{ width: '52%' }} />
                  <span style={{ width: '88%' }} />
                </div>
              </aside>
            </div>
          </section>

          <section className="ps-metrics" aria-label={c.styleMetricsAria}>
            {c.metrics.map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </section>

          <section className="ps-roles" aria-label={c.rolesAria}>
            <p className="ps-rail__label">{c.eyebrow.split(' / ')[1]}</p>
            <ul>
              {c.roles.map((role, idx) => (
                <li key={role} className={`ps-roles__pill ps-roles__pill--${idx}`}>{role}</li>
              ))}
            </ul>
          </section>

          <section className="ps-principles" aria-label={c.principlesAria}>
            {c.principles.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </article>
            ))}
          </section>

          <section className="ps-rules" id="rules">
            <div className="ps-rules__head">
              <p className="ps-eyebrow ps-eyebrow--alt">{c.rulesTitle}</p>
              <h2>{c.rulesHeading}</h2>
            </div>
            <ol>
              {c.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
          </section>

          <section className="prompt ps-prompt" id="style-prompt">
            <div className="ps-prompt__head">
              <h2>{c.promptHeading}</h2>
              <button type="button" data-copy-prompt onClick={handleCopyPrompt}>{c.primary}</button>
            </div>
            <pre>{promptText[lang]}</pre>
          </section>
        </main>
      </div>

      <footer className="page-footer">
        <a href="/">Web Stylebook</a> · Product × Swiss
      </footer>
      <nav className="page-nav" aria-label={c.pageNavAria}>
        <a href="/pages/fusion-neon-swiss.html">
          <span>
            <span className="page-nav__label">{c.prevLabel}</span>
            Neon × Swiss
          </span>
        </a>
        <div className="page-nav__divider" />
        <a href="/pages/fusion-bento-noir.html">
          <span>
            <span className="page-nav__label">{c.nextLabel}</span>
            Bento × Noir
          </span>
        </a>
      </nav>
    </div>
  );
}
