import { useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang) => obj[lang];

const PALETTES = [
  { id: 'brass',   name: 'BRASS',   accent: '#c9a96e', ink: '#0c0c10' },
  { id: 'copper',  name: 'COPPER',  accent: '#c47a52', ink: '#0e0a08' },
  { id: 'pewter',  name: 'PEWTER',  accent: '#9aa3a8', ink: '#0a0c0e' },
  { id: 'umber',   name: 'UMBER',   accent: '#a07644', ink: '#0e0b07' },
];

const COPY = {
  masthead: { en: 'WEB · STYLEBOOK', ko: 'WEB · STYLEBOOK', ja: 'WEB · STYLEBOOK' },
  issue: 'ATELIER 12',
  fusion: 'BENTO × NOIR',
  count: 'N°03 / 09',
  date: '2026 · 02',
  city: { en: 'SEOUL', ko: 'SEOUL', ja: 'SEOUL' },
  paletteBarLabel: { en: 'METAL / 1 PER CELL', ko: '메탈 / 한 셀에 하나', ja: 'メタル / 1セル1色' },
  paletteHint: {
    en: '↑ click to recolour the catalogue',
    ko: '↑ 클릭해서 카탈로그를 다시 칠하세요',
    ja: '↑ クリックでカタログを再着色',
  },
  kicker: { en: 'an index in', ko: '컬렉션 색인 ·', ja: 'コレクション索引 ·' },
  headEn: ['Twelve', 'objects.', 'One', 'shelf.'],
  headKo: ['열두', '오브제.', '선반은', '하나.'],
  headJa: ['12の', 'オブジェ。', '棚は', 'ひとつ。'],
  switchHint: {
    en: 'GLOW SELECTOR · click a word to point the brass',
    ko: 'GLOW SELECTOR · 단어를 눌러 황동을 옮겨보세요',
    ja: 'GLOW SELECTOR · 単語をクリックして真鍮を動かす',
  },
  lede: {
    en: 'A modular collection bound in matte black and cold metal. Each cell is a decision, not a decoration. Brass appears once per cell — never twice. The shelf, the index, and the editor all agree.',
    ko: '매트 블랙과 차가운 금속으로 묶인 모듈러 컬렉션. 각 셀은 결정이지 장식이 아닙니다. 황동은 셀당 한 번만 — 두 번은 없습니다. 선반과 색인, 그리고 편집자가 모두 동의합니다.',
    ja: 'マットブラックと冷たい金属で束ねたモジュラー・コレクション。各セルは決定であって装飾ではない。真鍮は1セル1度きり、2度はない。棚も索引も編集者も同意する。',
  },
  marquee: {
    en: ['MODULAR DARK', '1 METAL PER CELL', 'NUMBERED NOT STYLED', 'BRASS WHISPERS', 'NO PASTELS', 'INTER 500', 'EDITION OF 12', 'MODULAR DARK'],
    ko: ['모듈러 다크', '셀당 메탈 1개', '번호만, 장식 없음', '황동은 속삭인다', '파스텔 금지', 'Inter 500', '에디션 12', '모듈러 다크'],
    ja: ['モジュラー・ダーク', '1セル1メタル', '番号のみ、装飾なし', '真鍮は囁く', 'パステル禁止', 'Inter 500', '12部限定', 'モジュラー・ダーク'],
  },
  leadEyebrow: { en: 'FROM THE CURATOR', ko: '큐레이터의 말', ja: 'キュレーターより' },
  rules: {
    en: [
      ['§01', 'Modular spans — 4 / 3 / 2. Cells respect the grid; they never pretend it is not there.'],
      ['§02', 'One brass element per cell. Index, mark, or material — choose one and stop.'],
      ['§03', 'Type stays in Inter at one weight. The temperature is in the material, not the typeface.'],
      ['§04', 'Edition logs are numbered and signed. Numbered things age in public.'],
    ],
    ko: [
      ['§01', '모듈러 span — 4 / 3 / 2. 셀은 그리드를 존중합니다. 없는 척하지 않습니다.'],
      ['§02', '한 셀에 황동 요소는 한 개. 인덱스, 마크, 재료 중 하나만 고르고 멈춥니다.'],
      ['§03', '활자는 Inter 단일 굵기. 온도는 재료에 있지 글꼴에 있지 않습니다.'],
      ['§04', '에디션 로그는 번호가 있고 서명됩니다. 번호 있는 것은 공공장소에서 늙어갑니다.'],
    ],
    ja: [
      ['§01', 'モジュラーspan — 4 / 3 / 2。セルはグリッドを尊重し、ないふりをしない。'],
      ['§02', '1セルに真鍮要素は1つ。インデックス・マーク・素材から1つを選び止める。'],
      ['§03', '書体はInterの一ウェイト。温度は素材にあり、書体にはない。'],
      ['§04', 'エディションログは番号と署名付き。番号付きの物は公の場で老いる。'],
    ],
  },
  collectionHeading: { en: '01 / 04 · Collection', ko: '01 / 04 · 컬렉션', ja: '01 / 04 · コレクション' },
  collectionTitle: {
    en: 'Twelve cells, one shelf.',
    ko: '열두 셀, 하나의 선반.',
    ja: '12のセル、ひとつの棚。',
  },
  collectionHint: {
    en: 'Hover any cell — only one carries the brass at a time.',
    ko: '셀에 호버하세요 — 한 번에 단 하나만 황동을 가집니다.',
    ja: 'セルにホバー — 一度に1セルだけが真鍮を持つ。',
  },
  cells: [
    { idx: '01', kind: { en: 'Object', ko: '오브제', ja: 'オブジェ' }, title: { en: 'Kettle, oxidised', ko: '주전자, 산화', ja: 'やかん、酸化' }, meta: 'Brass · 2024', span: 4 },
    { idx: '02', kind: { en: 'Texture', ko: '직물', ja: '織物' }, title: { en: 'Linen, undyed', ko: '리넨, 무염색', ja: '無染色リネン' }, meta: '240 gsm · 2024', span: 2 },
    { idx: '03', kind: { en: 'Print', ko: '인쇄', ja: '印刷' }, title: { en: '32-page softcover', ko: '32쪽 소프트커버', ja: '32頁ソフトカバー' }, meta: 'Letterpress · 2023', span: 3 },
    { idx: '04', kind: { en: 'Tool', ko: '도구', ja: '道具' }, title: { en: 'Bookbinder’s awl', ko: '제본 송곳', ja: '製本キリ' }, meta: 'Steel · 2023', span: 3 },
    { idx: '05', kind: { en: 'Light', ko: '조명', ja: '照明' }, title: { en: 'Arc lamp', ko: '아크 램프', ja: 'アークランプ' }, meta: 'LED 2700K · 2024', span: 2 },
    { idx: '06', kind: { en: 'Sound', ko: '음', ja: '音' }, title: { en: 'Listening bowl', ko: '청음 그릇', ja: '聴音うつわ' }, meta: 'A4 tuned · 2023', span: 2 },
    { idx: '07', kind: { en: 'Vessel', ko: '용기', ja: '容器' }, title: { en: 'Satin cylinder', ko: '새틴 실린더', ja: 'サテン・シリンダー' }, meta: 'Cast iron · 2024', span: 2 },
  ] as const,
  typeHeading: { en: '02 / 04 · Type', ko: '02 / 04 · 활자', ja: '02 / 04 · 書体' },
  typeTitle: {
    en: 'Inter at one weight. The metal speaks for the rest.',
    ko: 'Inter, 단일 굵기. 나머지는 금속이 말합니다.',
    ja: 'Interの一ウェイト。残りは金属が語る。',
  },
  typeRows: [
    { tag: 'DISPLAY · 500', sample: { en: 'Atelier', ko: '아뜰리에', ja: 'アトリエ' }, kind: 'display' as const },
    { tag: 'HEADLINE · 500', sample: { en: 'Twelve objects, one shelf', ko: '열두 오브제, 하나의 선반', ja: '12のオブジェ、ひとつの棚' }, kind: 'h1' as const },
    { tag: 'CAPS · 500', sample: { en: 'N° 03 / 09', ko: 'N° 03 / 09', ja: 'N° 03 / 09' }, kind: 'caps' as const },
    { tag: 'BODY · 400', sample: { en: 'Brass appears once per cell — never twice.', ko: '황동은 셀당 한 번 — 두 번은 없습니다.', ja: '真鍮は1セル1度、2度はない。' }, kind: 'body' as const },
    { tag: 'MONO · JetBrains', sample: { en: 'Iga, 2200 °C · 142 mm · 480 g', ko: '이가, 2200 °C · 142 mm · 480 g', ja: '伊賀、2200°C · 142 mm · 480 g' }, kind: 'mono' as const },
  ],
  recipeHeading: { en: '03 / 04 · Recipe', ko: '03 / 04 · 레시피', ja: '03 / 04 · レシピ' },
  recipeTitle: { en: '1 ink + 1 metal.', ko: '잉크 1 + 메탈 1.', ja: '1インク + 1メタル。' },
  recipeFormula: {
    en: ['matte ink', '·', '1 metal', '·', '1 element per cell', '·', 'no pastels'],
    ko: ['매트 잉크', '·', '메탈 1', '·', '셀당 요소 1', '·', '파스텔 금지'],
    ja: ['マット・インク', '·', 'メタル 1', '·', '1セル1要素', '·', 'パステル禁止'],
  },
  pullHeading: { en: '04 / 04 · Curator', ko: '04 / 04 · 큐레이터', ja: '04 / 04 · キュレーター' },
  pullTitle: {
    en: 'Restraint is what we refuse to add.',
    ko: '절제란 더하기를 거절하는 것.',
    ja: '抑制とは、加えるのを拒むこと。',
  },
  pull: {
    en: '"Restraint is not what you remove from a thing — it is what you refuse to add to it."',
    ko: '"절제란 무언가에서 빼는 것이 아니다 — 무언가에 더하기를 거절하는 일이다."',
    ja: '「節制とは何かから取り去ることではない — 何かに加えることを拒むことだ。」',
  },
  pullAttr: { en: '— A. Lim, Atelier 12', ko: '— 임 A., 아뜰리에 12', ja: '— リム A.、アトリエ12' },
  stampRow: {
    en: ['EDITION OF 12', 'INTER 500', '1 METAL / CELL', 'N° 03 / 09'],
    ko: ['에디션 12부', 'INTER 500', '셀당 메탈 1개', 'N° 03 / 09'],
    ja: ['12部限定', 'INTER 500', '1セル1メタル', 'N° 03 / 09'],
  },
  kickerWord: { en: 'cold metal.', ko: '차가운 금속.', ja: '冷たい金属。' },
} as const;

const promptEn = `Design a creative single-page atelier index in Bento × Noir fusion: the page IS the curator's spread that demonstrates the style through a modular dark catalogue, with a live metal palette switcher and a click-anywhere headline.

PHILOSOPHY:
Bento gives the discipline (modular spans), Noir gives the temperature (matte black + cold metal). Density comes from real specimen data — never from decoration.

TOKENS (live-swappable):
--accent (brass #c9a96e / copper #c47a52 / pewter #9aa3a8 / umber #a07644)
--ink (#0c0c10 / #0e0a08 / #0a0c0e / #0e0b07 — matched to accent)
--surface: ink lightened ~6%

TYPOGRAPHY:
Inter 500 for display and headline (letter-spacing -0.035em). Inter 400 for body. JetBrains Mono for tags, indices, hex.

SECTIONS:
1) Masthead — WEB · STYLEBOOK · ATELIER 12 · BENTO × NOIR · N°03 / 09 · 2026·02 · SEOUL.
2) Palette switcher — 4 metal chips, live recolours the whole page.
3) Cover hero — kicker "an index in / cold metal." → 4-word headline ("Twelve / objects. / One / shelf.") where one word holds the brass. Glow-Selector chip row.
4) Art column — a 6×6 bento mini-grid where one cell carries the brass + a circular "EDITION OF 12" stamp.
5) Marquee — scrolling caps ("1 METAL PER CELL · NUMBERED NOT STYLED · …").
6) Lead band — giant N°03 numeral + curator's intro + 4 rules (§01-§04).
7) Section 01 / Collection — interactive bento collection: 7 cells (span 4/2/3/3/2/2/2). Hover any cell: only that cell takes the brass.
8) Section 02 / Type — 5 rows showing Display, Headline, Caps, Body, Mono. Display row in brass.
9) Section 03 / Recipe — 2 huge cells (INK + METAL) with hex. Recipe line.
10) Section 04 / Pull quote — italic Cormorant quote.
11) Stamp row — 4 brutalist stamps.

FORBIDDEN:
- Cormorant Garamond + Nunito pairings.
- More than one metal element per cell.
- Pastels, hot greys, decorative arcs / diamonds.

MOTION:
Marquee 36 s. Otherwise static. Reduced motion freezes marquee.

OUTPUT:
1) CSS variables swapped by palette switcher.
2) Sections 1–11 in order.
3) Mobile: cover collapses to one column; bento becomes 2 cols; recipe stacks; pull quote stays.`;

const promptKo = `Bento × Noir 퓨전 — 큐레이터의 펼침면이 곧 페이지. 라이브 메탈 팔레트 스위처와 클릭 가능한 헤드라인으로 *스타일을 실연하며 설명*합니다.

토큰(라이브 교체):
--accent (brass #c9a96e / copper #c47a52 / pewter #9aa3a8 / umber #a07644)
--ink (#0c0c10 / #0e0a08 / #0a0c0e / #0e0b07 — 액센트에 매칭)

타이포: Inter 500 디스플레이·헤드라인, Inter 400 본문, JetBrains Mono 태그/인덱스/hex.

섹션:
1) 매스트헤드 — WEB · STYLEBOOK · ATELIER 12 · BENTO × NOIR · N°03 / 09 · 2026·02 · SEOUL.
2) 팔레트 스위처 — 메탈 칩 4개, 라이브 색 교체.
3) 커버 히어로 — "an index in / 차가운 금속." 키커 → 4단어 헤드라인 "Twelve / objects. / One / shelf." 중 한 단어만 황동. Glow Selector.
4) 아트 컬럼 — 6×6 미니 벤토 그리드(한 칸만 황동) + 원형 "EDITION OF 12" 스탬프.
5) 마키 — "1 METAL PER CELL · NUMBERED NOT STYLED · …"
6) 리드 밴드 — 거대 N°03 + 큐레이터 인트로 + §01~§04 규칙 4행.
7) 01 / Collection — 인터랙티브 벤토 7셀(span 4/2/3/3/2/2/2). 호버 시 그 셀만 황동.
8) 02 / Type — 5행 specimen. Display 행만 황동.
9) 03 / Recipe — 두 거대 셀(INK + METAL) + hex + 레시피 행.
10) 04 / Pull quote — 이탤릭 인용 + 좌측 황동 룰.
11) 스탬프 줄 — 4개.

금지: Cormorant + Nunito 페어링 / 셀당 메탈 2개 이상 / 파스텔 / 장식 아치·다이아.

모션: 마키 36s, 그 외 정지. reduced-motion에서 마키 정지.

출력: 팔레트 변수 교체 / 위 1–11 / 모바일에서 커버 1열, 벤토 2열, 레시피 스택.`;

const promptJa = `Bento × Noirフュージョン — キュレーターの見開きそのものがページ。ライブの金属パレット切替と、どの単語にも光を移せる見出しで*スタイルを実演しながら説明する*。

トークン(ライブ切替):
--accent (brass #c9a96e / copper #c47a52 / pewter #9aa3a8 / umber #a07644)
--ink (#0c0c10 / #0e0a08 / #0a0c0e / #0e0b07 — アクセントに合わせて)

タイポ: Interの500で見出し、400で本文、JetBrains Monoでタグ・インデックス・hex。

セクション:
1) マストヘッド — WEB · STYLEBOOK · ATELIER 12 · BENTO × NOIR · N°03 / 09 · 2026·02 · SEOUL。
2) パレット切替 — 4金属チップ、ページ全体を即時再着色。
3) カバー・ヒーロー — キッカー「an index in / 冷たい金属。」→ 4語「Twelve / objects. / One / shelf.」のうち1語に真鍮。
4) アート列 — 6×6のミニベントグリッド(1セルに真鍮) + 円形「EDITION OF 12」スタンプ。
5) マーキー — 「1 METAL PER CELL · NUMBERED NOT STYLED · …」
6) リードバンド — 巨大「N°03」+ 編集部の3文 + §01〜§04の4ルール。
7) 01 / Collection — インタラクティブ・ベント7セル(span 4/2/3/3/2/2/2)。ホバーでそのセルだけが真鍮を持つ。
8) 02 / Type — 5行の標本。Display行だけ真鍮。
9) 03 / Recipe — 巨大2セル(INK+METAL) + hex + レシピ行。
10) 04 / Pull quote — イタリック引用 + 左に真鍮の罫線。
11) スタンプ列 — 4つ。

禁止: Cormorant+Nunitoの組み合わせ / 1セルに金属要素2つ以上 / パステル / 装飾アーチ・ダイア。

モーション: マーキー36s、それ以外なし。reduced-motionでマーキー停止。

出力: パレット変数の切替 / 上記1–11 / モバイルではカバー1段、ベント2列、レシピは縦積み。`;

export function PortedFusionBentoNoirPage({ lang }: PortedStylePageProps) {
  const [paletteId, setPaletteId] = useState<string>('brass');
  const [glowIdx, setGlowIdx] = useState<number>(2);
  const [hoverCell, setHoverCell] = useState<number>(0);
  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];
  const lng = lang as Lang;
  const styleVars: CSSProperties = {
    ['--bn-accent' as string]: palette.accent,
    ['--bn-ink' as string]: palette.ink,
  };
  const headWords = lng === 'ko' ? COPY.headKo : lng === 'ja' ? COPY.headJa : COPY.headEn;

  return (
    <FusionShell
      fusionId="fusion-bento-noir"
      lang={lang}
      prev={{ href: '/pages/fusion-product-swiss.html', label: 'Product × Swiss' }}
      next={{ href: '/pages/fusion-editorial-terminal.html', label: 'Editorial × Terminal' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
    >
      <div className="bn-shell" style={styleVars} data-palette={palette.id}>
        <header className="bn-masthead">
          <span className="bn-masthead__brand">{L(COPY.masthead, lng)}</span>
          <span className="bn-masthead__chip">{COPY.issue}</span>
          <span className="bn-masthead__chip">{COPY.fusion}</span>
          <span className="bn-masthead__chip bn-masthead__chip--accent">{COPY.count}</span>
          <span className="bn-masthead__rule" />
          <span className="bn-masthead__date">{COPY.date}</span>
          <span className="bn-masthead__price">{L(COPY.city, lng)}</span>
        </header>

        <div className="bn-palette">
          <span className="bn-palette__label">{L(COPY.paletteBarLabel, lng)}</span>
          <div className="bn-palette__chips" role="radiogroup" aria-label="Palette">
            {PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={p.id === paletteId}
                className={`bn-palette__chip ${p.id === paletteId ? 'is-active' : ''}`}
                onClick={() => setPaletteId(p.id)}
              >
                <span className="bn-palette__swatch" style={{ background: p.accent }} />
                <span className="bn-palette__swatch" style={{ background: p.ink, border: '1px solid rgba(255,255,255,.16)' }} />
                <span className="bn-palette__name">{p.name}</span>
              </button>
            ))}
          </div>
          <span className="bn-palette__hint">{L(COPY.paletteHint, lng)}</span>
        </div>

        <section className="bn-cover">
          <div className="bn-cover__col">
            <span className="bn-cover__kicker">{L(COPY.kicker, lng)} <em>{L(COPY.kickerWord, lng)}</em></span>
            <h1 className="bn-cover__h1">
              {headWords.map((w, i) => (
                <button
                  key={i}
                  type="button"
                  className={`bn-cover__word ${i === glowIdx ? 'is-glow' : ''}`}
                  onClick={() => setGlowIdx(i)}
                >
                  {w}
                </button>
              ))}
            </h1>
            <p className="bn-cover__switchHint">{L(COPY.switchHint, lng)}</p>
            <p className="bn-cover__lede">{L(COPY.lede, lng)}</p>
            <div className="bn-cover__meta">
              <span>cover</span><span className="bn-cover__dot" />
              <span>2026</span><span className="bn-cover__dot" />
              <span>{palette.name}</span>
            </div>
          </div>
          <div className="bn-cover__art" aria-hidden="true">
            <div className="bn-art-frame">
              <div className="bn-art-grid">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span key={i} className={i === 13 ? 'is-glow' : ''} />
                ))}
              </div>
              <div className="bn-art-stamp">
                <span>N°</span><strong>03</strong><span>/ 09</span>
              </div>
              <div className="bn-art-circle">
                <span>EDITION</span>
                <strong>OF 12</strong>
                <span>NUMBERED</span>
              </div>
            </div>
          </div>
        </section>

        <div className="bn-marquee" aria-hidden="true">
          <div className="bn-marquee__track">
            {[...COPY.marquee[lng], ...COPY.marquee[lng]].map((w, i) => (
              <span key={i}>{w}<em>◆</em></span>
            ))}
          </div>
        </div>

        <section className="bn-lead">
          <div className="bn-lead__num" aria-hidden="true">N°03</div>
          <div className="bn-lead__body">
            <span className="bn-lead__eyebrow">{L(COPY.leadEyebrow, lng)}</span>
            <p className="bn-lead__intro">{L(COPY.lede, lng)}</p>
            <ul className="bn-lead__list">
              {COPY.rules[lng].map(([sym, body]) => (
                <li key={sym}><b>{sym}</b><span>{body}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bn-section">
          <div className="bn-section-eyebrow">
            <span className="bn-section-eyebrow__num">{L(COPY.collectionHeading, lng)}</span>
            <span className="bn-section-eyebrow__rule" />
          </div>
          <h2 className="bn-section__h2">{L(COPY.collectionTitle, lng)}</h2>
          <p className="bn-section__hint">{L(COPY.collectionHint, lng)}</p>
          <div className="bn-collection" onMouseLeave={() => setHoverCell(0)}>
            {COPY.cells.map((cell, i) => (
              <article
                key={cell.idx}
                className={`bn-cell bn-cell--span-${cell.span} ${i === hoverCell ? 'is-glow' : ''}`}
                onMouseEnter={() => setHoverCell(i)}
              >
                <span className="bn-cell__idx">{cell.idx} / {L(cell.kind, lng)}</span>
                <h3 className="bn-cell__title">{L(cell.title, lng)}</h3>
                <span className="bn-cell__meta">{cell.meta}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="bn-section">
          <div className="bn-section-eyebrow">
            <span className="bn-section-eyebrow__num">{L(COPY.typeHeading, lng)}</span>
            <span className="bn-section-eyebrow__rule" />
          </div>
          <h2 className="bn-section__h2">{L(COPY.typeTitle, lng)}</h2>
          <ol className="bn-type">
            {COPY.typeRows.map((row, i) => (
              <li key={row.tag}>
                <span className="bn-type__tag">{row.tag}</span>
                <span className={`bn-type__sample bn-type__sample--${row.kind} ${i === 0 ? 'is-glow' : ''}`}>
                  {L(row.sample, lng)}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="bn-section">
          <div className="bn-section-eyebrow">
            <span className="bn-section-eyebrow__num">{L(COPY.recipeHeading, lng)}</span>
            <span className="bn-section-eyebrow__rule" />
          </div>
          <h2 className="bn-section__h2">{L(COPY.recipeTitle, lng)}</h2>
          <div className="bn-recipe">
            <div className="bn-recipe__cell bn-recipe__cell--ink" style={{ background: palette.ink }}>
              <span className="bn-recipe__role">INK</span>
              <span className="bn-recipe__hex">{palette.ink.toUpperCase()}</span>
              <span className="bn-recipe__plus">+</span>
            </div>
            <div className="bn-recipe__cell bn-recipe__cell--accent" style={{ background: palette.accent, color: palette.ink }}>
              <span className="bn-recipe__role">METAL</span>
              <span className="bn-recipe__hex">{palette.accent.toUpperCase()}</span>
              <span className="bn-recipe__name">{palette.name}</span>
            </div>
          </div>
          <div className="bn-recipe__formula">
            {COPY.recipeFormula[lng].map((p, i) => <span key={i}>{p}</span>)}
          </div>
        </section>

        <section className="bn-section">
          <div className="bn-section-eyebrow">
            <span className="bn-section-eyebrow__num">{L(COPY.pullHeading, lng)}</span>
            <span className="bn-section-eyebrow__rule" />
          </div>
          <h2 className="bn-section__h2">{L(COPY.pullTitle, lng)}</h2>
          <blockquote className="bn-pull">
            <p>{L(COPY.pull, lng)}</p>
            <cite>{L(COPY.pullAttr, lng)}</cite>
          </blockquote>
        </section>

        <section className="bn-stamps" aria-hidden="true">
          {COPY.stampRow[lng].map((s, i) => (
            <div key={s} className={`bn-stamp bn-stamp--${i}`}>{s}</div>
          ))}
        </section>
      </div>
    </FusionShell>
  );
}
