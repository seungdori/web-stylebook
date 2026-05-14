import { useEffect, useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang) => obj[lang];

const PALETTES = [
  { id: 'signal', name: 'SIGNAL', accent: '#16f2d1', ink: '#06080f', dim: 'rgba(217,221,230,0.6)' },
  { id: 'helix', name: 'HELIX', accent: '#7cc7ff', ink: '#070c1a', dim: 'rgba(208,222,255,0.6)' },
  { id: 'lemon', name: 'LEMON', accent: '#e6ff4d', ink: '#0a0c08', dim: 'rgba(225,232,200,0.6)' },
  { id: 'magma', name: 'MAGMA', accent: '#ff5b3d', ink: '#0c0606', dim: 'rgba(245,210,200,0.6)' },
];

const COLUMNS = [
  { en: 'COMP', ko: '컴포', ja: 'COMP' },
  { en: 'RULE', ko: '규칙', ja: 'RULE' },
  { en: 'TYPE', ko: '활자', ja: 'TYPE' },
  { en: 'GRID', ko: '그리드', ja: 'GRID' },
  { en: 'INK',  ko: '잉크', ja: 'INK' },
  { en: 'GLOW', ko: '빛',   ja: 'GLOW' },
  { en: 'LINE', ko: '룰',   ja: 'LINE' },
  { en: 'TONE', ko: '톤',   ja: 'TONE' },
  { en: 'EDGE', ko: '엣지', ja: 'EDGE' },
  { en: 'PACE', ko: '리듬', ja: 'PACE' },
  { en: 'NOTE', ko: '노트', ja: 'NOTE' },
  { en: 'SIGN', ko: '신호', ja: 'SIGN' },
];

const HEAD_WORDS = ['Order', 'is the loudest', 'signal', 'in the room.'];
const HEAD_WORDS_KO = ['질서가', '곧 방 안에서', '가장 큰 신호', '다.'];
const HEAD_WORDS_JA = ['秩序が', '部屋でいちばん', '大きな信号', 'である。'];

const RULES = {
  en: [
    ['§01', 'Twelve columns hold the page. Asymmetry is permitted; randomness is not.'],
    ['§02', 'Exactly one word per screen carries the accent. The grid takes the rest.'],
    ['§03', 'Body, rules and surfaces stay unlit. Glow earns its place by being alone.'],
    ['§04', 'Inter at one weight, set tight. Hierarchy comes from scale, not colour.'],
  ],
  ko: [
    ['§01', '12열이 페이지를 지탱합니다. 비대칭은 허용되지만 임의성은 금지.'],
    ['§02', '한 화면에 액센트는 정확히 한 단어. 나머지는 모두 그리드가 가져갑니다.'],
    ['§03', '본문·룰·표면은 빛을 받지 않습니다. 글로우는 *혼자일 때* 의미가 됩니다.'],
    ['§04', 'Inter 단일 굵기, 좁은 자간. 위계는 색이 아니라 스케일에서.'],
  ],
  ja: [
    ['§01', '12カラムがページを支える。非対称は許され、ランダムは許されない。'],
    ['§02', '1画面につきアクセント語は1つ。残りはすべてグリッドが受け持つ。'],
    ['§03', '本文・罫線・面は光らない。グロウは*独りでいるとき*に意味になる。'],
    ['§04', 'Interの一ウェイトで詰めて組む。階層は色ではなくスケールで作る。'],
  ],
};

const COPY = {
  masthead: { en: 'WEB · STYLEBOOK', ko: 'WEB · STYLEBOOK', ja: 'WEB · STYLEBOOK' },
  issue: 'ISSUE 01',
  fusion: 'NEON × SWISS',
  count: 'N°01 / 09',
  priceLabel: { en: 'KST', ko: 'KST', ja: 'JST' },
  date: '2026 · 03',
  kicker: {
    en: 'a field manual for',
    ko: '한 줄의 빛을 위한',
    ja: '一筋の光のための',
  },
  switchLabel: {
    en: 'GLOW SELECTOR · click a word to move the light',
    ko: 'GLOW SELECTOR · 단어를 눌러 빛을 옮겨보세요',
    ja: 'GLOW SELECTOR · 単語をクリックして光を動かす',
  },
  paletteBarLabel: {
    en: 'PALETTE / 1 INK + 1 LIGHT',
    ko: '팔레트 / 잉크 1 + 빛 1',
    ja: 'パレット / 1インク + 1光',
  },
  paletteHint: {
    en: '↑ click to recolour the issue',
    ko: '↑ 클릭해서 호의 색을 바꿔보세요',
    ja: '↑ クリックして号の色を切替',
  },
  lede: {
    en: 'Pick one ink and one light. Set twelve columns. Let the grid stay invisible because it works. Then choose one word — only one — and let it carry the entire signal of the spread.',
    ko: '잉크 하나, 빛 하나를 고릅니다. 12열을 정하고, 작동한다는 이유로 그리드는 보이지 않게 둡니다. 그리고 단 한 단어만 골라, 그 펼침면 전체의 신호를 *혼자* 짊어지게 둡니다.',
    ja: 'インクを1つ、光を1つ選ぶ。12カラムを敷き、機能するからこそグリッドは見えないままにする。そして一語だけを選び、その見開きの信号を一語で*独り*担わせる。',
  },
  marquee: {
    en: ['STRICT GRID', 'ONE WORD', 'NO MULTIPLY', 'SWISS DOES NOT NEGOTIATE', 'ORDER IS LOUDER THAN COLOUR', '12 COLUMNS', 'INTER 500', 'STRICT GRID', 'ONE WORD'],
    ko: ['정확한 그리드', '단 한 단어', '증식 금지', '스위스는 협상하지 않는다', '질서가 색보다 크다', '12 컬럼', 'Inter 500', '정확한 그리드', '단 한 단어'],
    ja: ['厳格なグリッド', 'ただ一語', '色の増殖を禁ず', 'スイスは交渉しない', '秩序は色より大きい', '12カラム', 'Inter 500', '厳格なグリッド', 'ただ一語'],
  },
  leadEyebrow: { en: 'FROM THE EDITORS', ko: '편집자의 말', ja: '編集部より' },
  leadIntroEn: 'Neon × Swiss is the discipline of letting a single term carry the noise of an entire night city. The grid is the audience. The accent is the speaker. The silence between them is the room.',
  leadIntroKo: 'Neon × Swiss는 단 한 단어가 한밤의 도시 전체의 소음을 짊어지도록 두는 훈련입니다. 그리드는 청중이고, 액센트는 화자이며, 둘 사이의 침묵이 곧 방입니다.',
  leadIntroJa: 'Neon × Swissは、ひとつの語が深夜の街全体のざわめきを担うように設計する訓練です。グリッドは聴衆、アクセントは話者、ふたりのあいだの静けさが部屋です。',
  gridEyebrow: { en: '01 / 04', ko: '01 / 04', ja: '01 / 04' },
  gridTitle: { en: 'Where the light is allowed to land.', ko: '빛이 내려앉아도 되는 자리.', ja: '光が降りてよい場所。' },
  gridHelp: {
    en: 'Hover any cell — the glow follows. Only one cell lights at a time.',
    ko: '셀에 마우스를 올려보세요 — 빛이 따라옵니다. 한 번에 단 한 칸.',
    ja: 'セルにホバーしてみてください — 光が追います。一度に1セルだけ。',
  },
  typeEyebrow: { en: '02 / 04', ko: '02 / 04', ja: '02 / 04' },
  typeTitle: { en: 'Inter 500, tracked tight, one weight.', ko: 'Inter 500, 좁은 자간, 단일 굵기.', ja: 'Inter 500、詰めて、一ウェイト。' },
  typeRows: [
    { tag: 'DISPLAY · 500 · -0.04em', sample: { en: 'signal', ko: '신호', ja: '信号' }, kind: 'display' },
    { tag: 'HEADLINE · 500 · -0.035em', sample: { en: 'Order, signal, silence', ko: '질서, 신호, 침묵', ja: '秩序、信号、静けさ' }, kind: 'h1' },
    { tag: 'CAPS · 500 · 0.18em', sample: { en: 'ISSUE / 01', ko: 'ISSUE / 01', ja: 'ISSUE / 01' }, kind: 'caps' },
    { tag: 'BODY · 400 · 1.65', sample: { en: 'The grid is the audience.', ko: '그리드는 청중이다.', ja: 'グリッドは聴衆である。' }, kind: 'body' },
    { tag: 'MONO · JetBrains · 0.04em', sample: { en: 'N°01 / 12 of 12', ko: 'N°01 / 12 of 12', ja: 'N°01 / 12 of 12' }, kind: 'mono' },
  ],
  recipeEyebrow: { en: '03 / 04', ko: '03 / 04', ja: '03 / 04' },
  recipeTitle: { en: 'Recipe · 1 ink + 1 light.', ko: '레시피 · 잉크 1 + 빛 1.', ja: 'レシピ · 1インク + 1光。' },
  recipeFormula: {
    en: ['12 col', '·', 'Inter 500', '·', '1 accent term', '·', 'no glow on body'],
    ko: ['12 열', '·', 'Inter 500', '·', '액센트 단어 1개', '·', '본문에 글로우 금지'],
    ja: ['12列', '·', 'Inter 500', '·', 'アクセント語1', '·', '本文にグロウ禁止'],
  },
  pullEyebrow: { en: '04 / 04', ko: '04 / 04', ja: '04 / 04' },
  pullTitle: { en: 'The single quotation.', ko: '한 줄의 인용.', ja: 'ただ一行の引用。' },
  pull: {
    en: '"The grid is the audience. The accent is the speaker. The silence between them is the room."',
    ko: '"그리드는 청중이고, 액센트는 화자이며, 둘 사이의 침묵이 곧 방이다."',
    ja: '「グリッドは聴衆、アクセントは話者、そのあいだの静けさが部屋である。」',
  },
  pullAttr: { en: '— Tate K., Spring 2026', ko: '— 테이트 K., 2026 봄', ja: '— テイト K.、2026 春' },
  stampRow: ['STRICT GRID', 'INTER 500', 'NO GREYS', 'N°01 / 09'],
  paginationLabel: { en: 'SHEET', ko: '시트', ja: 'シート' },
  paginationOf: { en: 'OF', ko: '/', ja: '/' },
} as const;

const promptEn = `Design a creative single-page manifesto in Neon × Swiss fusion: the page IS an Issue 01 spread that demonstrates the style by enacting it, with live recolouring and live glow movement.

COLOUR TOKENS (live-swappable via palette switcher):
--accent (cyan default #16f2d1; helix blue #7cc7ff; lemon #e6ff4d; magma #ff5b3d)
--ink (deep navy #06080f / #070c1a / #0a0c08 / #0c0606 to match accent)
--paper: the same ink (dark page)
--line: ink at 12% / 22%
No greys, no third colour.

TYPOGRAPHY:
Inter 500 for everything. Tracking -0.04em on display, -0.035em on h1.
Mono JetBrains for tags. Tabular figures throughout.

SECTIONS:
1) Masthead — left "WEB · STYLEBOOK", chips "ISSUE 01 / NEON × SWISS / N°01", price + city, a small "12-COL ACTIVE" rule.
2) Palette switcher — 4 chips, click swaps --accent / --ink across the page live.
3) Cover hero — kicker "a field manual for / 한 줄의 빛을 위한" → big 4-word headline where the 3rd word is the live "glow word". A Glow Selector chip-row lets the user choose which of 4 words holds the glow.
4) Marquee — scrolling caps strip with style rules.
5) Lead band — giant numeral "N°01" + editorial intro of 3 sentences.
6) Interactive 12-column grid — hover a cell; only that cell takes the accent. Caption "Only one cell lights at a time."
7) Type specimen — 5 rows (Display / Headline / Caps / Body / Mono) — the Display row carries the glow.
8) Recipe — 2 huge swatches (Ink + Light) with hex, plus a recipe line "12 col · Inter 500 · 1 accent term · no glow on body".
9) Pull quote — italic Inter quote with 4 px accent left rule.
10) Stamp row — 4 brutalist stamps (STRICT GRID / INTER 500 / NO GREYS / N°01 / 09).

GLOW RULE:
At all times exactly one word in the headline carries text-shadow 0 0 24 px <accent>. No glow elsewhere unless triggered by hover on the 12-col grid.

MOTION:
Marquee 30 s linear infinite translate. All other static.

OUTPUT:
1) CSS variables that the palette switcher swaps.
2) Magazine-cover layout with masthead, hero, marquee, lead, grid, specimen, recipe, pull quote, stamps, prompt.
3) Mobile: hero collapses to one column, palette chips wrap, grid keeps 12 columns but reduces row height.`;

const promptKo = `Neon × Swiss 퓨전 — 창의적 단일 페이지 매니페스토. 페이지가 곧 *Issue 01 스프레드*이며, 라이브 색 교체와 라이브 글로우 이동으로 *스타일을 실연*하며 *스타일을 설명*합니다.

컬러 토큰(팔레트 스위처로 라이브 교체):
--accent (기본 시안 #16f2d1; helix #7cc7ff; lemon #e6ff4d; magma #ff5b3d)
--ink (액센트에 맞춘 짙은 잉크: #06080f / #070c1a / #0a0c08 / #0c0606)
--line: 잉크 12% / 22%
회색 금지, 3색 금지.

타이포그래피:
Inter 500 단일. 디스플레이 자간 -0.04em, 헤드라인 -0.035em.
태그·코드는 JetBrains Mono. 모든 곳에 tabular figures.

섹션:
1) 매스트헤드 — 좌 "WEB · STYLEBOOK", 칩 "ISSUE 01 / NEON × SWISS / N°01", 가격 + 도시, "12-COL ACTIVE" 룰.
2) 팔레트 스위처 — 칩 4개, 클릭으로 페이지 전체 --accent / --ink 즉시 교체.
3) 커버 히어로 — 키커 "한 줄의 빛을 위한" → 4단어 헤드라인 중 1단어가 *라이브 글로우 단어*. Glow Selector 칩으로 4단어 중 어떤 단어가 빛날지 선택.
4) 마키 — 스타일 규칙을 적은 대문자 스크롤 스트립.
5) 리드 밴드 — 거대한 "N°01" 숫자 + 편집자의 말 3문장.
6) 인터랙티브 12열 그리드 — 셀에 호버하면 그 셀만 액센트. 캡션 "한 번에 단 한 칸만 빛납니다."
7) 타입 스페시먼 — 5행(Display/Headline/Caps/Body/Mono). Display 행이 글로우.
8) 레시피 — 2개의 거대한 스와치(Ink + Light)와 hex, 그리고 레시피 라인 "12 col · Inter 500 · 1 accent term · no glow on body".
9) 풀 인용 — 이탤릭 Inter 인용에 4 px 액센트 좌측 룰.
10) 스탬프 줄 — 브루탈리스트 스탬프 4개 (STRICT GRID / INTER 500 / NO GREYS / N°01 / 09).

글로우 규칙:
헤드라인의 정확히 한 단어에만 text-shadow 0 0 24 px <accent>. 12열 그리드의 hover 외에는 어디에도 글로우 금지.

모션:
마키 30s linear infinite. 그 외 정지.

출력:
1) 팔레트 스위처가 변경하는 CSS 변수.
2) 매스트헤드/히어로/마키/리드/그리드/스페시먼/레시피/풀인용/스탬프/프롬프트의 매거진 표지 레이아웃.
3) 모바일: 히어로 1열, 팔레트 칩 wrap, 그리드는 12열 유지하되 행 높이 축소.`;

const promptJa = `Neon × Swissフュージョン — 創造的なシングルページ・マニフェスト。ページそのものが*Issue 01スプレッド*であり、ライブの色替えとライブのグロウ移動で*スタイルを実演し*、同時に*スタイルを説明する*。

カラートークン(パレットスイッチャーでライブ切替):
--accent (デフォルト・シアン #16f2d1; helix #7cc7ff; lemon #e6ff4d; magma #ff5b3d)
--ink (アクセントに合わせた深いインク: #06080f / #070c1a / #0a0c08 / #0c0606)
--line: インク 12% / 22%
グレー禁止、3色禁止。

タイポグラフィ:
Inter 500のみ。ディスプレイ字間 -0.04em、見出し -0.035em。
タグ・コードはJetBrains Mono。tabular figures全域。

セクション:
1) マストヘッド — 左に「WEB · STYLEBOOK」、チップ「ISSUE 01 / NEON × SWISS / N°01」、価格+都市、「12-COL ACTIVE」罫線。
2) パレット・スイッチャー — チップ4つ、クリックでページ全体の --accent / --ink を即時交換。
3) カバー・ヒーロー — キッカー「一筋の光のための」→ 4語の見出し、うち1語がライブ・グロウ語。Glow Selectorで4語のどれが光るかを切替。
4) マーキー — スタイル規則を載せた大文字スクロール帯。
5) リードバンド — 巨大な「N°01」数字+編集部の文章を3行。
6) インタラクティブ12カラム・グリッド — セルにホバーするとそのセルだけアクセントになる。キャプション「一度に1セルだけ光る。」
7) タイプ標本 — 5行(Display/Headline/Caps/Body/Mono)。Display行がグロウ。
8) レシピ — 2つの巨大スウォッチ(Ink + Light)+hex、レシピ行「12 col · Inter 500 · 1 accent term · no glow on body」。
9) プルクオート — イタリックInterに4px アクセントの左罫線。
10) スタンプ列 — ブルータリストのスタンプ4つ (STRICT GRID / INTER 500 / NO GREYS / N°01 / 09)。

グロウ規則:
見出しの正確に1語にtext-shadow 0 0 24 px <accent>。12カラムのホバー以外に光らせない。

モーション:
マーキー30s linear infinite。それ以外は静止。

出力:
1) パレット・スイッチャーが切り替えるCSS変数。
2) マストヘッド/ヒーロー/マーキー/リード/グリッド/標本/レシピ/引用/スタンプ/プロンプトの雑誌表紙レイアウト。
3) モバイル: ヒーロー1段組、パレット折り返し、グリッドは12列のまま行高を縮める。`;

export function PortedFusionNeonSwissPage({ lang }: PortedStylePageProps) {
  const [paletteId, setPaletteId] = useState<string>('signal');
  const [glowIdx, setGlowIdx] = useState<number>(2);
  const [hoverCell, setHoverCell] = useState<number>(6);

  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];

  // For each click on a palette chip, ripple a small accent-flash on the cover
  useEffect(() => {
    document.documentElement.style.setProperty('--ns-active-accent', palette.accent);
  }, [palette]);

  const styleVars: CSSProperties = {
    ['--ns-accent' as string]: palette.accent,
    ['--ns-ink' as string]: palette.ink,
  };

  const lng = lang as Lang;
  const headWords = lng === 'ko' ? HEAD_WORDS_KO : lng === 'ja' ? HEAD_WORDS_JA : HEAD_WORDS;

  return (
    <FusionShell
      fusionId="fusion-neon-swiss"
      lang={lang}
      prev={{ href: '/pages/macos-liquid-glass.html', label: 'macOS Liquid Glass' }}
      next={{ href: '/pages/fusion-product-swiss.html', label: 'Product × Swiss' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
    >
      <div className="ns-shell" style={styleVars} data-palette={palette.id}>
        {/* MASTHEAD */}
        <header className="ns-masthead">
          <span className="ns-masthead__brand">{L(COPY.masthead, lng)}</span>
          <span className="ns-masthead__chip">{COPY.issue}</span>
          <span className="ns-masthead__chip">{COPY.fusion}</span>
          <span className="ns-masthead__chip ns-masthead__chip--accent">{COPY.count}</span>
          <span className="ns-masthead__rule" />
          <span className="ns-masthead__date">{COPY.date}</span>
          <span className="ns-masthead__price">{L(COPY.priceLabel, lng)}</span>
        </header>

        {/* PALETTE SWITCHER */}
        <div className="ns-palette">
          <span className="ns-palette__label">{L(COPY.paletteBarLabel, lng)}</span>
          <div className="ns-palette__chips" role="radiogroup" aria-label="Palette">
            {PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={p.id === paletteId}
                className={`ns-palette__chip ${p.id === paletteId ? 'is-active' : ''}`}
                onClick={() => setPaletteId(p.id)}
              >
                <span className="ns-palette__swatch" style={{ background: p.accent, boxShadow: `0 0 14px ${p.accent}55` }} />
                <span className="ns-palette__swatch" style={{ background: p.ink, border: '1px solid rgba(255,255,255,.16)' }} />
                <span className="ns-palette__name">{p.name}</span>
              </button>
            ))}
          </div>
          <span className="ns-palette__hint">{L(COPY.paletteHint, lng)}</span>
        </div>

        {/* COVER */}
        <section className="ns-cover">
          <div className="ns-cover__col">
            <span className="ns-cover__kicker">{L(COPY.kicker, lng)}</span>
            <h1 className="ns-cover__h1">
              {headWords.map((w, i) => (
                <button
                  key={i}
                  type="button"
                  className={`ns-cover__word ${i === glowIdx ? 'is-glow' : ''}`}
                  onClick={() => setGlowIdx(i)}
                  aria-label={`Make "${w}" glow`}
                >
                  {w}
                </button>
              ))}
            </h1>
            <p className="ns-cover__switchHint">{L(COPY.switchLabel, lng)}</p>
            <p className="ns-cover__lede">{L({ en: COPY.lede.en, ko: COPY.lede.ko, ja: COPY.lede.ja }, lng)}</p>
            <div className="ns-cover__meta">
              <span>cover</span><span className="ns-cover__dot" />
              <span>spring</span><span className="ns-cover__dot" />
              <span>2026</span><span className="ns-cover__dot" />
              <span data-palette-name>{palette.name}</span>
            </div>
          </div>

          <div className="ns-cover__art" aria-hidden="true">
            <div className="ns-art-frame">
              <div className="ns-art-cross" />
              <div className="ns-art-grid">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span key={i} className={i === 14 ? 'is-glow' : ''} />
                ))}
              </div>
              <div className="ns-art-stamp">
                <span>N°</span>
                <strong>01</strong>
                <span>/ 09</span>
              </div>
              <div className="ns-art-tick" />
              <div className="ns-art-circle">
                <span>STRICT</span>
                <strong>SIGNAL</strong>
                <span>NO GREYS</span>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="ns-marquee" aria-hidden="true">
          <div className="ns-marquee__track">
            {[...COPY.marquee[lng], ...COPY.marquee[lng]].map((w, i) => (
              <span key={i}>
                {w}
                <em>✦</em>
              </span>
            ))}
          </div>
        </div>

        {/* LEAD BAND */}
        <section className="ns-lead">
          <div className="ns-lead__num" aria-hidden="true">N°01</div>
          <div className="ns-lead__body">
            <span className="ns-lead__eyebrow">{L(COPY.leadEyebrow, lng)}</span>
            <p className="ns-lead__intro">
              {lng === 'ko' ? COPY.leadIntroKo : lng === 'ja' ? COPY.leadIntroJa : COPY.leadIntroEn}
            </p>
            <ul className="ns-lead__list">
              {RULES[lng].map(([sym, body]) => (
                <li key={sym}><b>{sym}</b><span>{body}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* INTERACTIVE 12-COL */}
        <section className="ns-section">
          <div className="ns-section-eyebrow">
            <span className="ns-section-eyebrow__num">{L(COPY.gridEyebrow, lng)}</span>
            <span className="ns-section-eyebrow__rule" />
            <span>{L({ en: 'Grid · Light', ko: '그리드 · 빛', ja: 'グリッド · 光' }, lng)}</span>
          </div>
          <h2 className="ns-section__h2">{L(COPY.gridTitle, lng)}</h2>
          <p className="ns-section__hint">{L(COPY.gridHelp, lng)}</p>
          <div className="ns-grid12" onMouseLeave={() => setHoverCell(6)}>
            {COLUMNS.map((c, i) => (
              <div
                key={i}
                className={`ns-grid12__col ${i === hoverCell ? 'is-glow' : ''}`}
                onMouseEnter={() => setHoverCell(i)}
              >
                <span className="ns-grid12__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="ns-grid12__name">{L(c, lng)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* TYPE SPECIMEN */}
        <section className="ns-section">
          <div className="ns-section-eyebrow">
            <span className="ns-section-eyebrow__num">{L(COPY.typeEyebrow, lng)}</span>
            <span className="ns-section-eyebrow__rule" />
            <span>{L({ en: 'Type Specimen', ko: '타입 스페시먼', ja: 'タイプ標本' }, lng)}</span>
          </div>
          <h2 className="ns-section__h2">{L(COPY.typeTitle, lng)}</h2>
          <ol className="ns-type">
            {COPY.typeRows.map((row, i) => (
              <li key={row.tag}>
                <span className="ns-type__tag">{row.tag}</span>
                <span className={`ns-type__sample ns-type__sample--${row.kind} ${i === 0 ? 'is-glow' : ''}`}>
                  {L(row.sample, lng)}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* RECIPE */}
        <section className="ns-section">
          <div className="ns-section-eyebrow">
            <span className="ns-section-eyebrow__num">{L(COPY.recipeEyebrow, lng)}</span>
            <span className="ns-section-eyebrow__rule" />
            <span>{L({ en: 'Recipe', ko: '레시피', ja: 'レシピ' }, lng)}</span>
          </div>
          <h2 className="ns-section__h2">{L(COPY.recipeTitle, lng)}</h2>
          <div className="ns-recipe">
            <div className="ns-recipe__cell ns-recipe__cell--ink" style={{ background: palette.ink }}>
              <span className="ns-recipe__role">INK</span>
              <span className="ns-recipe__hex">{palette.ink.toUpperCase()}</span>
              <span className="ns-recipe__plus">+</span>
            </div>
            <div className="ns-recipe__cell ns-recipe__cell--accent" style={{ background: palette.accent, color: palette.ink }}>
              <span className="ns-recipe__role">LIGHT</span>
              <span className="ns-recipe__hex">{palette.accent.toUpperCase()}</span>
              <span className="ns-recipe__name">{palette.name}</span>
            </div>
          </div>
          <div className="ns-recipe__formula">
            {COPY.recipeFormula[lng].map((p, i) => <span key={i}>{p}</span>)}
          </div>
        </section>

        {/* PULL QUOTE */}
        <section className="ns-section">
          <div className="ns-section-eyebrow">
            <span className="ns-section-eyebrow__num">{L(COPY.pullEyebrow, lng)}</span>
            <span className="ns-section-eyebrow__rule" />
            <span>{L({ en: 'Pull quote', ko: '풀 인용', ja: 'プルクオート' }, lng)}</span>
          </div>
          <h2 className="ns-section__h2">{L(COPY.pullTitle, lng)}</h2>
          <blockquote className="ns-pull">
            <p>{L({ en: COPY.pull.en, ko: COPY.pull.ko, ja: COPY.pull.ja }, lng)}</p>
            <cite>{L(COPY.pullAttr, lng)}</cite>
          </blockquote>
        </section>

        {/* STAMPS */}
        <section className="ns-stamps" aria-hidden="true">
          <div className="ns-stamp ns-stamp--diag">{COPY.stampRow[0]}</div>
          <div className="ns-stamp ns-stamp--box">{COPY.stampRow[1]}</div>
          <div className="ns-stamp ns-stamp--circle">
            <span>{COPY.stampRow[2]}</span>
            <strong>·</strong>
            <span>2026</span>
          </div>
          <div className="ns-stamp ns-stamp--barcode">{COPY.stampRow[3]}</div>
        </section>
      </div>
    </FusionShell>
  );
}
