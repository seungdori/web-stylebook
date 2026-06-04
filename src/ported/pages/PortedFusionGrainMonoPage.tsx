import { useState, type CSSProperties, type ReactNode } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang) => obj[lang];

const PALETTES = [
  { id: 'rust',   name: 'RUST',   accent: '#b85431', paper: '#f3eee3', ink: '#1a1612' },
  { id: 'sea',    name: 'SEA',    accent: '#2e6f7d', paper: '#eef1ec', ink: '#161a1c' },
  { id: 'plum',   name: 'PLUM',   accent: '#6e3a6a', paper: '#f1ecef', ink: '#1a141a' },
  { id: 'graphite',name: 'GRAPHITE',accent: '#3c3c3c', paper: '#ece9e2', ink: '#0e0e0e' },
];

// rust word marker is %RUST% ... %/RUST%
const COPY = {
  masthead: 'WEB · STYLEBOOK',
  issue: 'FOLIO 09',
  fusion: 'GRAIN × MONO',
  count: 'N°09 / 09',
  press: 'HERMES 3000 · 11 pt',
  paletteLabel: { en: 'INK / 1 WORD', ko: '잉크 / 한 단어', ja: 'インク / 1語' },
  paletteHint: { en: '↑ click to re-print the page', ko: '↑ 페이지 재인쇄', ja: '↑ ページを刷り直す' },
  kicker: { en: 'a manual for', ko: '면지 위에 친 ·', ja: '綿紙の上に打つ ·' },
  kickerWord: { en: 'restrained pages.', ko: '절제의 매뉴얼.', ja: '抑制のマニュアル。' },
  headEn: ['A letter', 'about', 'restraint.'],
  headKo: ['절제에', '관한', '편지.'],
  headJa: ['抑制について', '書かれた', '手紙。'],
  switchHint: {
    en: 'click any word — only one word gets the rust',
    ko: '단어를 누르세요 — 한 단어에만 녹빛이 듭니다',
    ja: '単語をクリック — 1語だけが錆色をまとう',
  },
  lede: {
    en: 'Pick one ink and one rust word. Set the body in 11-point monospace. Print on cotton paper at 240 gsm. Let the page do the work, and let the grain admit that paper exists.',
    ko: '잉크 하나, 녹빛 단어 하나를 고릅니다. 본문은 11포인트 모노스페이스. 면지 240 gsm에 인쇄합니다. 페이지가 일하게 두고, 그레인으로 *종이가 존재한다*는 사실을 드러냅니다.',
    ja: 'インク1、錆語1を選ぶ。本文は11ポイントのモノスペース。240 gsmの綿紙に印刷。ページに仕事をさせ、グレインに*紙の存在*を認めさせる。',
  },
  marquee: {
    en: ['1 INK', '1 RUST WORD', 'COTTON 240 GSM', 'JETBRAINS 11 PT', 'NO ORNAMENT', 'PAGE EXISTS'],
    ko: ['잉크 1', '녹빛 단어 1', '면지 240 gsm', 'JetBrains 11 pt', '장식 금지', '페이지가 존재한다'],
    ja: ['インク1', '錆語1', '綿紙240gsm', 'JetBrains 11pt', '装飾なし', 'ページが存在する'],
  },
  leadEyebrow: { en: 'FROM THE PRESS', ko: '인쇄소에서', ja: '印刷所より' },
  rules: {
    en: [
      ['§01', '1 ink + 1 rust word. Underline the rust word so it stays small.'],
      ['§02', 'JetBrains Mono at 11 pt. No serif. No italic.'],
      ['§03', 'Grain is two radial-dot layers at ≤ 6% combined opacity.'],
      ['§04', 'Folio stamps live in the top edge; closing mark in the bottom right.'],
    ],
    ko: [
      ['§01', '잉크 1 + 녹빛 단어 1. 녹빛 단어는 밑줄을 쳐 *작게* 둡니다.'],
      ['§02', 'JetBrains Mono 11 pt. 세리프 금지, 이탤릭 금지.'],
      ['§03', '그레인은 radial-dot 두 레이어, 합산 6% 이하.'],
      ['§04', '폴리오 스탬프는 상단 가장자리에, 닫는 마크는 우측 하단에.'],
    ],
    ja: [
      ['§01', 'インク1 + 錆語1。錆語は*小さく*アンダーライン。'],
      ['§02', 'JetBrains Mono 11 pt。セリフ禁止、イタリック禁止。'],
      ['§03', 'グレインはradial-dot 2層、合計6%以下。'],
      ['§04', 'フォリオは上縁、終わりのマークは右下。'],
    ],
  },
  manuscriptHeading: { en: '01 / 04 · Manuscript', ko: '01 / 04 · 원고', ja: '01 / 04 · 草稿' },
  manuscriptTitle: { en: 'A letter, three paragraphs, one rust word.', ko: '편지 한 장, 세 단락, 녹빛 단어 하나.', ja: '手紙、三段落、錆語1。' },
  paragraphs: {
    en: [
      'There is a draft I keep on the windowsill, typed in a single 11-point monospace. It does not announce itself. It does not lift its voice. It only insists that every line earn its margin and every word earn its breath.',
      'I have come to believe that grain is just a way of admitting that paper exists. The eye trusts a surface when the surface is slightly imperfect. We mistake that trust for warmth, when what we are actually feeling is the absence of pretence.',
      ['Set the page small. Let the margins do the work. Mark one word in ', 'rust', ', and only when the sentence will not bear it otherwise. That word is the only design decision you are allowed to make today.'],
    ] as (string | string[])[],
    ko: [
      '창틀에 올려둔 초고 한 장이 있습니다. 11포인트 모노스페이스 한 종으로만 쳤습니다. 스스로를 내세우지 않고, 목소리도 높이지 않습니다. 다만 줄마다 제 여백을, 단어마다 제 호흡을 스스로 얻어내라고 요구할 뿐입니다.',
      '그레인이란 결국 종이가 존재한다고 인정하는 방식이라고, 저는 믿게 되었습니다. 눈은 면이 살짝 불완전할 때 비로소 그 면을 신뢰합니다. 우리는 그 신뢰를 따스함으로 오해하지만, 사실 느끼는 것은 가식이 없다는 것입니다.',
      ['판형은 작게 잡고, 여백이 일하게 두세요. 한 단어만 ', '녹빛', '으로 표시하되, 그 단어 없이는 문장이 버티지 못할 때만 그렇게 합니다. 오늘 허용된 디자인 결정은 그 한 단어뿐입니다.'],
    ] as (string | string[])[],
    ja: [
      '窓辺に置いてある下書きがあります。11ポイントのモノスペース一種だけで打った文章。自らを誇示しない。声を張らない。ただ、各行に余白の資格を、各語に呼吸の資格を要求するだけ。',
      'グレインとは要するに、紙が存在することを認める方法だと、私は信じるようになりました。眼はわずかな不完全さがあるとき、ようやく面を信頼します。私たちはその信頼を温かみと取り違えますが、実際は飾らないことを感じているのです。',
      ['版面は小さく。余白に仕事をさせる。一語だけを', '錆色', 'で記し、それも文章がその語なしでは立たないときに限って。今日許される設計上の決定はその一語だけです。'],
    ] as (string | string[])[],
  },
  typeHeading: { en: '02 / 04 · Type ladder', ko: '02 / 04 · 활자 사다리', ja: '02 / 04 · 活字梯子' },
  typeTitle: { en: 'JetBrains Mono · four sizes.', ko: 'JetBrains Mono · 네 크기.', ja: 'JetBrains Mono · 4サイズ。' },
  typeRows: [
    { tag: '08 pt', sample: { en: 'a page that needs an illustration usually needs a better sentence.', ko: '삽화가 필요한 페이지는 대개 더 좋은 문장이 필요할 뿐입니다.', ja: 'イラストが要るページは、たいてい、より良い文章が要るだけだ。' }, kind: 'p8' as const },
    { tag: '11 pt', sample: { en: 'Set the page small. Let the margins do the work.', ko: '판형은 작게. 여백이 일하도록.', ja: '版面は小さく。余白に仕事をさせる。' }, kind: 'p11' as const },
    { tag: '14 pt', sample: { en: 'A letter is not a broadcast.', ko: '편지는 방송이 아니다.', ja: '手紙は放送ではない。' }, kind: 'p14' as const },
    { tag: '20 pt', sample: { en: 'Restraint.', ko: '절제.', ja: '抑制。' }, kind: 'p20' as const },
  ],
  recipeHeading: { en: '03 / 04 · Recipe', ko: '03 / 04 · 레시피', ja: '03 / 04 · レシピ' },
  recipeTitle: { en: 'Paper + ink + one rust word.', ko: '종이 + 잉크 + 녹빛 단어 하나.', ja: '紙 + インク + 錆語1。' },
  recipeFormula: {
    en: ['cotton paper', '·', '1 ink', '·', '1 rust word', '·', 'grain ≤ 6%'],
    ko: ['면지', '·', '잉크 1', '·', '녹빛 단어 1', '·', '그레인 ≤ 6%'],
    ja: ['綿紙', '·', 'インク1', '·', '錆語1', '·', 'グレイン ≤ 6%'],
  },
  pullHeading: { en: '04 / 04 · Pull quote', ko: '04 / 04 · 풀 인용', ja: '04 / 04 · 引用' },
  pullTitle: { en: 'Filed under: typography that does not flinch.', ko: '분류: 흔들리지 않는 타이포그래피.', ja: '分類: 怯まないタイポグラフィ。' },
  pull: {
    en: '"The page is not a frame for content. The page is the slowest, most deliberate kind of interface — a piece of paper that runs at the speed of attention."',
    ko: '"페이지는 내용을 담는 액자가 아닙니다. 페이지는 가장 느리고 가장 신중한 인터페이스 — 주의가 흐르는 속도로 움직이는 종이 한 장입니다."',
    ja: '「ページは内容のフレームではない。ページは最も遅く、最も慎重なインターフェース — 注意の速度で進む一枚の紙である。」',
  },
  pullAttr: { en: '— Press notes, Folio 09', ko: '— 인쇄 노트, 폴리오 09', ja: '— 印刷ノート、フォリオ09' },
  stampRow: {
    en: ['1 RUST WORD', 'JETBRAINS 11 PT', 'COTTON 240 GSM', 'N°09 / 09'],
    ko: ['녹빛 단어 1', 'JETBRAINS 11 PT', '면지 240 gsm', 'N°09 / 09'],
    ja: ['錆語1', 'JETBRAINS 11 PT', '綿紙 240gsm', 'N°09 / 09'],
  },
} as const;

const promptEn = `Design a creative single-page manuscript in Grain × Mono fusion: a typewritten letter that demonstrates the style — one ink + one rust word, with grain that proves paper exists. Palette switcher recolours both ink and rust.

TOKENS (live): --accent (rust / sea / plum / graphite) + matched --paper + --ink.
TYPOGRAPHY: JetBrains Mono throughout. No serif, no italic.
SECTIONS: masthead, palette switcher, cover hero with click-to-recolour 3-word headline and a manuscript card on the right, marquee, lead band with rules, Manuscript section (3-paragraph letter, one rust word underlined), Type ladder 4 sizes, Recipe, Pull quote, stamps.
GRAIN: page background 3 px radial-dot at low opacity; card overlay 2 px radial-dot, mix-blend-mode multiply at 0.5, combined ≤ 6%.`;
const promptKo = `Grain × Mono 퓨전 — 면지에 타자한 원고 한 면이 곧 페이지. 잉크 1 + 녹빛 단어 1. 팔레트로 잉크와 녹빛을 함께 바꿉니다.`;
const promptJa = `Grain × Monoフュージョン — 綿紙の上にタイプした原稿がそのままページ。インク1+錆語1。パレットでインクと錆を同時に切替。`;

function renderPara(p: string | string[], i: number): ReactNode {
  if (typeof p === 'string') return <p key={i}>{p}</p>;
  return (
    <p key={i}>
      {p[0]}<em>{p[1]}</em>{p[2]}
    </p>
  );
}

export function PortedFusionGrainMonoPage({ lang }: PortedStylePageProps) {
  const [paletteId, setPaletteId] = useState('rust');
  const [glowIdx, setGlowIdx] = useState(2);
  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];
  const lng = lang as Lang;
  const styleVars: CSSProperties = {
    ['--gm-accent-source' as string]: palette.accent,
    ['--gm-accent' as string]: palette.accent,
    ['--gm-paper' as string]: palette.paper,
    ['--gm-ink' as string]: palette.ink,
  };
  const headWords = lng === 'ko' ? COPY.headKo : lng === 'ja' ? COPY.headJa : COPY.headEn;

  return (
    <FusionShell
      fusionId="fusion-grain-mono"
      lang={lang}
      prev={{ href: '/pages/fusion-cyber-console.html', label: 'Cyber × Console' }}
      next={{ href: '/pages/fusion-clay-aurora.html', label: 'Clay × Aurora' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
      colorModeToggle
      defaultColorMode="dark"
    >
      <div className="gm-shell" style={styleVars} data-palette={palette.id}>
        <header className="gm-masthead">
          <span className="gm-masthead__brand">{COPY.masthead}</span>
          <span className="gm-masthead__chip">{COPY.issue}</span>
          <span className="gm-masthead__chip">{COPY.fusion}</span>
          <span className="gm-masthead__chip gm-masthead__chip--accent">{COPY.count}</span>
          <span className="gm-masthead__rule" />
          <span className="gm-masthead__press">{COPY.press}</span>
        </header>

        <div className="gm-palette">
          <span className="gm-palette__label">{L(COPY.paletteLabel, lng)}</span>
          <div className="gm-palette__chips" role="radiogroup">
            {PALETTES.map((p) => (
              <button key={p.id} type="button" role="radio" aria-checked={p.id === paletteId}
                className={`gm-palette__chip ${p.id === paletteId ? 'is-active' : ''}`} onClick={() => setPaletteId(p.id)}>
                <span className="gm-palette__swatch" style={{ background: p.accent }} />
                <span className="gm-palette__swatch" style={{ background: p.paper, border: '1px solid rgba(0,0,0,0.12)' }} />
                <span className="gm-palette__name">{p.name}</span>
              </button>
            ))}
          </div>
          <span className="gm-palette__hint">{L(COPY.paletteHint, lng)}</span>
        </div>

        <section className="gm-cover">
          <div className="gm-cover__col">
            <span className="gm-cover__kicker">{L(COPY.kicker, lng)} <em>{L(COPY.kickerWord, lng)}</em></span>
            <h1 className="gm-cover__h1">
              {headWords.map((w, i) => (
                <button key={i} type="button" className={`gm-cover__word ${i === glowIdx ? 'is-accent' : ''}`} onClick={() => setGlowIdx(i)}>{w}</button>
              ))}
            </h1>
            <p className="gm-cover__switchHint">{L(COPY.switchHint, lng)}</p>
            <p className="gm-cover__lede">{L(COPY.lede, lng)}</p>
            <div className="gm-cover__meta"><span>FOLIO 09</span><span className="gm-cover__dot" /><span>2026</span><span className="gm-cover__dot" /><span>{palette.name}</span></div>
          </div>
          <aside className="gm-cover__card" aria-hidden="true">
            <header className="gm-card__head"><span>FOLIO 09 / MANUSCRIPT</span><span>HERMES 3000 · 11 PT</span></header>
            <p className="gm-card__title">A letter about restraint.</p>
            <p className="gm-card__body">Set the page small. Let the margins do the work. Mark one word in <em>rust</em>.</p>
            <p className="gm-card__mark">— FILED · TYPOGRAPHY THAT DOES NOT FLINCH</p>
          </aside>
        </section>

        <div className="gm-marquee" aria-hidden="true">
          <div className="gm-marquee__track">
            {[...COPY.marquee[lng], ...COPY.marquee[lng]].map((w, i) => (<span key={i}>{w}<em>·</em></span>))}
          </div>
        </div>

        <section className="gm-lead">
          <div className="gm-lead__num" aria-hidden="true">N°09</div>
          <div className="gm-lead__body">
            <span className="gm-lead__eyebrow">{L(COPY.leadEyebrow, lng)}</span>
            <p className="gm-lead__intro">{L(COPY.lede, lng)}</p>
            <ul className="gm-lead__list">
              {COPY.rules[lng].map(([sym, body]) => (<li key={sym}><b>{sym}</b><span>{body}</span></li>))}
            </ul>
          </div>
        </section>

        <section className="gm-section">
          <div className="gm-section-eyebrow"><span className="gm-section-eyebrow__num">{L(COPY.manuscriptHeading, lng)}</span><span className="gm-section-eyebrow__rule" /></div>
          <h2 className="gm-section__h2">{L(COPY.manuscriptTitle, lng)}</h2>
          <article className="gm-manuscript">
            {COPY.paragraphs[lng].map((p, i) => renderPara(p, i))}
          </article>
        </section>

        <section className="gm-section">
          <div className="gm-section-eyebrow"><span className="gm-section-eyebrow__num">{L(COPY.typeHeading, lng)}</span><span className="gm-section-eyebrow__rule" /></div>
          <h2 className="gm-section__h2">{L(COPY.typeTitle, lng)}</h2>
          <ol className="gm-type">
            {COPY.typeRows.map((r) => (
              <li key={r.tag}>
                <span className="gm-type__tag">{r.tag}</span>
                <span className={`gm-type__sample gm-type__sample--${r.kind}`}>{L(r.sample, lng)}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="gm-section">
          <div className="gm-section-eyebrow"><span className="gm-section-eyebrow__num">{L(COPY.recipeHeading, lng)}</span><span className="gm-section-eyebrow__rule" /></div>
          <h2 className="gm-section__h2">{L(COPY.recipeTitle, lng)}</h2>
          <div className="gm-recipe">
            <div className="gm-recipe__cell" style={{ background: palette.paper, color: palette.ink }}>
              <span>PAPER</span><strong>{palette.paper.toUpperCase()}</strong>
              <span className="gm-recipe__plus">+</span>
            </div>
            <div className="gm-recipe__cell" style={{ background: palette.ink, color: palette.paper }}>
              <span>INK</span><strong>{palette.ink.toUpperCase()}</strong>
              <em style={{ color: palette.accent }}>+ {palette.accent.toUpperCase()} · {palette.name}</em>
            </div>
          </div>
          <div className="gm-recipe__formula">
            {COPY.recipeFormula[lng].map((p, i) => <span key={i}>{p}</span>)}
          </div>
        </section>

        <section className="gm-section">
          <div className="gm-section-eyebrow"><span className="gm-section-eyebrow__num">{L(COPY.pullHeading, lng)}</span><span className="gm-section-eyebrow__rule" /></div>
          <h2 className="gm-section__h2">{L(COPY.pullTitle, lng)}</h2>
          <blockquote className="gm-pull">
            <p>{L(COPY.pull, lng)}</p>
            <cite>{L(COPY.pullAttr, lng)}</cite>
          </blockquote>
        </section>

        <section className="gm-stamps" aria-hidden="true">
          {COPY.stampRow[lng].map((s, i) => (<div key={s} className={`gm-stamp gm-stamp--${i}`}>{s}</div>))}
        </section>
      </div>
    </FusionShell>
  );
}
