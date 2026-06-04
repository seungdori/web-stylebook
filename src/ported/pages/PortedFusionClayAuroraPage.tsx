import { useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang) => obj[lang];

const PALETTES = [
  { id: 'mint',    name: 'MINT',    accent: '#5fb09c', body: 'linear-gradient(155deg,#c2efe0 0%,#8acdb8 35%,#5fb09c 100%)', paper: '#f6f4ff' },
  { id: 'peri',    name: 'PERI',    accent: '#6a5dd1', body: 'linear-gradient(155deg,#d6cdff 0%,#a69cf8 50%,#6a5dd1 100%)', paper: '#f0eeff' },
  { id: 'pink',    name: 'PINK',    accent: '#c47b97', body: 'linear-gradient(155deg,#ffe1ec 0%,#ffb6d1 45%,#c47b97 100%)', paper: '#fff1f4' },
  { id: 'apricot', name: 'APRICOT', accent: '#d18c5a', body: 'linear-gradient(155deg,#ffe0c4 0%,#f6b78a 45%,#d18c5a 100%)', paper: '#fff3e8' },
];

const COPY = {
  masthead: 'WEB · STYLEBOOK',
  issue: 'LAB 10',
  fusion: 'CLAY × AURORA',
  count: 'N°10 / 09',
  station: 'NORTH WINDOW · 06:14',
  paletteLabel: { en: 'CLAY / 1 SPECIMEN', ko: '클레이 / 표본 1', ja: 'クレイ / 標本1' },
  paletteHint: { en: '↑ click to morph the specimen', ko: '↑ 표본을 변형', ja: '↑ クリックで標本が変わる' },
  kicker: { en: 'a notebook for', ko: '촉감 표본을 위한 ·', ja: '触感標本のための ·' },
  kickerWord: { en: 'tactile specimens.', ko: '랩 노트북.', ja: 'ラボノート。' },
  headEn: ['One', 'soft', 'object.'],
  headKo: ['부드러운', '사물', '하나.'],
  headJa: ['ひとつの', '柔らかな', '物体。'],
  switchHint: {
    en: 'click any word — the specimen breathes',
    ko: '단어를 누르면 표본이 호흡합니다',
    ja: '単語をクリックすると標本が呼吸する',
  },
  lede: {
    en: 'Claymorphism makes a shape you want to hold. Aurora is the cold weather around it. Together, the page becomes a still life — one tactile object, slow breathing, under three drifting blurs.',
    ko: '클레이모피즘은 *손에 쥐고 싶은* 형태를, 오로라는 그 주위에 *차가운 날씨*를 만듭니다. 둘이 만나면 페이지는 정물이 됩니다 — 흐릿하게 떠도는 빛 세 줄기 아래, 부드러운 표본 하나가 천천히 호흡합니다.',
    ja: 'クレイモーフィズムは*手に取りたい*形を、オーロラはその周囲に*冷たい天候*をつくる。組み合わせると、ページは静物画になる — 漂う3つのぼかしの下で、触感の標本ひとつがゆっくりと呼吸する。',
  },
  marquee: {
    en: ['1 SPECIMEN', 'BREATHE 8s', '3 BLURRED ORBS', 'INSET HIGHLIGHT', 'NO WOBBLE', 'INTER 500'],
    ko: ['표본 1', '호흡 8s', '블러 오브 3', '내부 하이라이트', '흔들림 금지', 'Inter 500'],
    ja: ['標本1', '呼吸8s', 'ブラー・オーブ3', 'インセット・ハイライト', 'ワブル禁止', 'Inter 500'],
  },
  leadEyebrow: { en: 'FROM THE LAB', ko: '랩에서', ja: 'ラボより' },
  rules: {
    en: [
      ['§01', 'One displayed specimen per spread. Sibling specimens stay small.'],
      ['§02', 'Inset highlight top-left; outer shadow bottom-right; floor shadow at 28%.'],
      ['§03', 'Atmosphere = three radial blurs, fixed, 0.45 opacity, behind everything.'],
      ['§04', 'Breathe translateY −12 px / 8 s. Never bounce, never spin, never wobble.'],
    ],
    ko: [
      ['§01', '한 스프레드에 대표 표본은 하나만. 나머지 동반 표본은 작게.'],
      ['§02', '좌상단 인셋 하이라이트, 우하단 외부 그림자, 바닥 그림자 28%.'],
      ['§03', '분위기 = 세 개의 radial 블러, fixed, 0.45 투명도.'],
      ['§04', '호흡 translateY −12 px / 8s. 튕김·회전·흔들림 금지.'],
    ],
    ja: [
      ['§01', '1見開きに表示標本は1つ。兄弟標本は小さく。'],
      ['§02', '左上にインセット・ハイライト、右下に外側影、床影28%。'],
      ['§03', '空気 = 3つのradialぼかし、fixed、不透明度0.45。'],
      ['§04', '呼吸 translateY −12px / 8s。バウンス・回転・ワブル禁止。'],
    ],
  },
  specHeading: { en: '01 / 04 · Specimen', ko: '01 / 04 · 표본', ja: '01 / 04 · 標本' },
  specTitle: { en: 'One tactile object, three sibling colours.', ko: '촉감 표본 하나, 동반 색 셋.', ja: '触感標本1、兄弟色3。' },
  specProps: [
    { k: { en: 'Volume', ko: '부피', ja: '体積' }, v: '1.4 L · pressable' },
    { k: { en: 'Mass', ko: '무게', ja: '質量' }, v: '320 g · low' },
    { k: { en: 'Radius', ko: '라디우스', ja: 'ラジウス' }, v: '38 / 62 / 60 / 40' },
    { k: { en: 'Reflex', ko: '반응', ja: '反応' }, v: 'soft · 8 ms recovery' },
    { k: { en: 'Breathe', ko: '호흡', ja: '呼吸' }, v: '−12 px · 8 s · ease' },
    { k: { en: 'Light', ko: '빛', ja: '光' }, v: 'absorbs ~12 %' },
  ],
  typeHeading: { en: '02 / 04 · Type', ko: '02 / 04 · 활자', ja: '02 / 04 · 書体' },
  typeTitle: { en: 'Inter on dawn paper. One italic moment.', ko: 'Inter, 새벽 종이 위. 한 순간의 이탤릭.', ja: 'Inter、夜明けの紙の上。一瞬のイタリック。' },
  typeRows: [
    { tag: 'DISPLAY · italic', sample: { en: 'soft', ko: '부드러운', ja: '柔らかな' }, kind: 'display' as const },
    { tag: 'HEADLINE · Inter 500', sample: { en: 'One soft object', ko: '부드러운 사물 하나', ja: '柔らかな物体ひとつ' }, kind: 'h1' as const },
    { tag: 'BODY · Inter 400', sample: { en: 'Claymorphism makes a shape you want to hold.', ko: '클레이모피즘은 손에 쥐고 싶은 형태를 만듭니다.', ja: 'クレイモーフィズムは手に取りたい形を作る。' }, kind: 'body' as const },
    { tag: 'TABULAR · Mono', sample: { en: '320 g · 1.4 L · 8 s', ko: '320 g · 1.4 L · 8 s', ja: '320 g · 1.4 L · 8 s' }, kind: 'tab' as const },
    { tag: 'CAPTION · 0.78', sample: { en: 'SPECIMEN N°10 · NORTH WINDOW', ko: '표본 N°10 · 북향 창', ja: '標本 N°10 · 北窓' }, kind: 'cap' as const },
  ],
  recipeHeading: { en: '03 / 04 · Recipe', ko: '03 / 04 · 레시피', ja: '03 / 04 · レシピ' },
  recipeTitle: { en: 'Paper + clay.', ko: '종이 + 클레이.', ja: '紙 + クレイ。' },
  recipeFormula: {
    en: ['dawn paper', '·', '1 clay specimen', '·', '3 blurred orbs', '·', 'breathe 8 s'],
    ko: ['새벽 종이', '·', '클레이 표본 1', '·', '블러 오브 3', '·', '호흡 8 s'],
    ja: ['夜明けの紙', '·', 'クレイ標本1', '·', 'ブラー・オーブ3', '·', '呼吸8s'],
  },
  pullHeading: { en: '04 / 04 · Field note', ko: '04 / 04 · 필드 노트', ja: '04 / 04 · フィールドノート' },
  pullTitle: { en: 'Photographed at 06:14, north window.', ko: '06:14, 북향 창에서 촬영.', ja: '06:14、北窓で撮影。' },
  pull: {
    en: '"Photographed at 06:14 on a north-facing windowsill, while a slow aurora was still bright enough to be felt on the back of the hand."',
    ko: '"북향 창턱에서 06:14에 촬영. 손등으로도 느껴질 만큼 오로라가 아직 밝았다."',
    ja: '「北向きの窓辺で06:14に撮影。手の甲にも感じるほどオーロラはまだ明るかった。」',
  },
  pullAttr: { en: '— M. Aoki, atelier journal', ko: '— 아오키 M., 아뜰리에 저널', ja: '— 青木 M.、アトリエ日誌' },
  stampRow: {
    en: ['1 SPECIMEN', 'BREATHE 8s', '3 ORBS', 'N°10 / 09'],
    ko: ['표본 1', '호흡 8s', '오브 3', 'N°10 / 09'],
    ja: ['標本1', '呼吸8s', 'オーブ3', 'N°10 / 09'],
  },
  siblings: [
    { id: 'a', label: { en: 'mint', ko: '민트', ja: 'ミント' }, hue: 'mint' },
    { id: 'b', label: { en: 'peri', ko: '페리윙클', ja: 'ペリウィンクル' }, hue: 'peri' },
    { id: 'c', label: { en: 'pink', ko: '핑크', ja: 'ピンク' }, hue: 'pink' },
  ],
} as const;

const promptEn = `Design a creative single-page lab notebook in Clay × Aurora fusion: a still-life specimen sheet — one tactile clay specimen breathing under three blurred orbs — with a palette switcher that morphs the specimen between four sibling clays.

TOKENS (live): --accent + --body gradient + --paper for each clay (mint / peri / pink / apricot).
ATMOSPHERE: three fixed radial blurs at 40 px blur, 0.45 opacity, behind everything.
SPECIMEN: organic border-radius 38% 62% 60% 40% / 50% 42% 58% 50%; gradient body + inset highlight + outer shadow + floor shadow; breathe translateY −12 px / 8 s.

SECTIONS: masthead, palette switcher, cover (clickable 3-word headline + big specimen), marquee, lead band with rules, Specimen + sibling trio + property dl, Type 5 rows, Recipe (paper + clay), Field-note pull quote, stamps.

OUTPUT: live tokens + 10 sections + mobile collapse.`;
const promptKo = `Clay × Aurora 퓨전 — 라이브 클레이 팔레트(민트/페리/핑크/애프리콧)로 표본이 변형되는 *랩 노트북* 한 면.

토큰(라이브): --accent / --body gradient / --paper.
분위기: 3개의 radial 블러, fixed, 0.45 투명도.
표본: 유기적 라디우스 + 그라데이션 + inset 하이라이트 + 외부 그림자 + 바닥 그림자 + 호흡 -12 px / 8s.

섹션: 매스트헤드 / 팔레트 / 커버(3단어 클릭 + 메인 표본) / 마키 / 리드 + §01~§04 / 01 Specimen + 형제 트리오 + 속성 dl / 02 Type / 03 Recipe / 04 Pull / 스탬프.`;
const promptJa = `Clay × Auroraフュージョン — ライブクレイ・パレット(ミント/ペリ/ピンク/アプリコット)で標本が変形する*ラボノート*の一葉。

トークン(ライブ): --accent / --body グラデ / --paper。
空気: 3つのradialぼかし、fixed、不透明度0.45。
標本: 有機的なradius + グラデ + insetハイライト + 外側影 + 床影 + 呼吸 -12px / 8s。

セクション: マストヘッド / パレット / カバー(3語クリック+メイン標本) / マーキー / リード+§01〜§04 / 01 Specimen+兄弟3+属性dl / 02 Type / 03 Recipe / 04 引用 / スタンプ。`;

export function PortedFusionClayAuroraPage({ lang }: PortedStylePageProps) {
  const [paletteId, setPaletteId] = useState('mint');
  const [glowIdx, setGlowIdx] = useState(1);
  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];
  const lng = lang as Lang;
  const styleVars: CSSProperties = {
    ['--ca-accent' as string]: palette.accent,
    ['--ca-body' as string]: palette.body,
    ['--ca-paper' as string]: palette.paper,
  };
  const headWords = lng === 'ko' ? COPY.headKo : lng === 'ja' ? COPY.headJa : COPY.headEn;

  return (
    <FusionShell
      fusionId="fusion-clay-aurora"
      lang={lang}
      prev={{ href: '/pages/fusion-grain-mono.html', label: 'Analog Press' }}
      next={{ href: '/pages/fusion-floppy-exe.html', label: 'Floppy.exe' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
    >
      <div className="ca-shell" style={styleVars} data-palette={palette.id}>
        <div className="ca-atmos" aria-hidden="true" />

        <header className="ca-masthead">
          <span className="ca-masthead__brand">{COPY.masthead}</span>
          <span className="ca-masthead__chip">{COPY.issue}</span>
          <span className="ca-masthead__chip">{COPY.fusion}</span>
          <span className="ca-masthead__chip ca-masthead__chip--accent">{COPY.count}</span>
          <span className="ca-masthead__rule" />
          <span className="ca-masthead__station">{COPY.station}</span>
        </header>

        <div className="ca-palette">
          <span className="ca-palette__label">{L(COPY.paletteLabel, lng)}</span>
          <div className="ca-palette__chips" role="radiogroup">
            {PALETTES.map((p) => (
              <button key={p.id} type="button" role="radio" aria-checked={p.id === paletteId}
                className={`ca-palette__chip ${p.id === paletteId ? 'is-active' : ''}`} onClick={() => setPaletteId(p.id)}>
                <span className="ca-palette__swatch" style={{ background: p.accent }} />
                <span className="ca-palette__swatch" style={{ background: p.paper, border: '1px solid rgba(0,0,0,.1)' }} />
                <span className="ca-palette__name">{p.name}</span>
              </button>
            ))}
          </div>
          <span className="ca-palette__hint">{L(COPY.paletteHint, lng)}</span>
        </div>

        <section className="ca-cover">
          <div className="ca-cover__col">
            <span className="ca-cover__kicker">{L(COPY.kicker, lng)} <em>{L(COPY.kickerWord, lng)}</em></span>
            <h1 className="ca-cover__h1">
              {headWords.map((w, i) => (
                <button key={i} type="button" className={`ca-cover__word ${i === glowIdx ? 'is-accent' : ''}`} onClick={() => setGlowIdx(i)}>{w}</button>
              ))}
            </h1>
            <p className="ca-cover__switchHint">{L(COPY.switchHint, lng)}</p>
            <p className="ca-cover__lede">{L(COPY.lede, lng)}</p>
            <div className="ca-cover__meta"><span>LAB 10</span><span className="ca-cover__dot" /><span>2026</span><span className="ca-cover__dot" /><span>{palette.name}</span></div>
          </div>
          <figure className="ca-cover__art" aria-hidden="true">
            <span className="ca-blob" style={{ background: palette.body }} />
            <figcaption className="ca-tag">SPECIMEN N°10 · {palette.name}</figcaption>
          </figure>
        </section>

        <div className="ca-marquee" aria-hidden="true">
          <div className="ca-marquee__track">
            {[...COPY.marquee[lng], ...COPY.marquee[lng]].map((w, i) => (<span key={i}>{w}<em>○</em></span>))}
          </div>
        </div>

        <section className="ca-lead">
          <div className="ca-lead__num" aria-hidden="true">N°10</div>
          <div className="ca-lead__body">
            <span className="ca-lead__eyebrow">{L(COPY.leadEyebrow, lng)}</span>
            <p className="ca-lead__intro">{L(COPY.lede, lng)}</p>
            <ul className="ca-lead__list">
              {COPY.rules[lng].map(([sym, body]) => (<li key={sym}><b>{sym}</b><span>{body}</span></li>))}
            </ul>
          </div>
        </section>

        <section className="ca-section">
          <div className="ca-section-eyebrow"><span className="ca-section-eyebrow__num">{L(COPY.specHeading, lng)}</span><span className="ca-section-eyebrow__rule" /></div>
          <h2 className="ca-section__h2">{L(COPY.specTitle, lng)}</h2>
          <div className="ca-siblings">
            {PALETTES.slice(1).map((p) => (
              <article key={p.id} className="ca-sibling">
                <span className="ca-blob ca-blob--small" style={{ background: p.body }} />
                <span className="ca-sibling__name">{p.name}</span>
                <span className="ca-sibling__hex">{p.accent.toUpperCase()}</span>
              </article>
            ))}
          </div>
          <dl className="ca-props">
            {COPY.specProps.map((r) => (
              <div key={r.v}><dt>{L(r.k, lng)}</dt><dd>{r.v}</dd></div>
            ))}
          </dl>
        </section>

        <section className="ca-section">
          <div className="ca-section-eyebrow"><span className="ca-section-eyebrow__num">{L(COPY.typeHeading, lng)}</span><span className="ca-section-eyebrow__rule" /></div>
          <h2 className="ca-section__h2">{L(COPY.typeTitle, lng)}</h2>
          <ol className="ca-type">
            {COPY.typeRows.map((r, i) => (
              <li key={r.tag}>
                <span className="ca-type__tag">{r.tag}</span>
                <span className={`ca-type__sample ca-type__sample--${r.kind} ${i === 0 ? 'is-accent' : ''}`}>{L(r.sample, lng)}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="ca-section">
          <div className="ca-section-eyebrow"><span className="ca-section-eyebrow__num">{L(COPY.recipeHeading, lng)}</span><span className="ca-section-eyebrow__rule" /></div>
          <h2 className="ca-section__h2">{L(COPY.recipeTitle, lng)}</h2>
          <div className="ca-recipe">
            <div className="ca-recipe__cell" style={{ background: palette.paper, color: '#281f48' }}>
              <span>PAPER</span><strong>{palette.paper.toUpperCase()}</strong>
              <span className="ca-recipe__plus">+</span>
            </div>
            <div className="ca-recipe__cell" style={{ background: palette.accent, color: 'white' }}>
              <span>CLAY</span><strong>{palette.accent.toUpperCase()}</strong>
              <em>{palette.name}</em>
            </div>
          </div>
          <div className="ca-recipe__formula">
            {COPY.recipeFormula[lng].map((p, i) => <span key={i}>{p}</span>)}
          </div>
        </section>

        <section className="ca-section">
          <div className="ca-section-eyebrow"><span className="ca-section-eyebrow__num">{L(COPY.pullHeading, lng)}</span><span className="ca-section-eyebrow__rule" /></div>
          <h2 className="ca-section__h2">{L(COPY.pullTitle, lng)}</h2>
          <blockquote className="ca-pull">
            <p>{L(COPY.pull, lng)}</p>
            <cite>{L(COPY.pullAttr, lng)}</cite>
          </blockquote>
        </section>

        <section className="ca-stamps" aria-hidden="true">
          {COPY.stampRow[lng].map((s, i) => (<div key={s} className={`ca-stamp ca-stamp--${i}`}>{s}</div>))}
        </section>
      </div>
    </FusionShell>
  );
}
