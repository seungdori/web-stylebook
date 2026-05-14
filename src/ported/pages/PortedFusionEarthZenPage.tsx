import { useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang) => obj[lang];

const PALETTES = [
  { id: 'iga',     name: 'IGA',     accent: '#8b7d6b', paper: '#f4f0e8', body: '#a3856a', deep: '#5e472f' },
  { id: 'shino',   name: 'SHINO',   accent: '#b08f6c', paper: '#f6efe4', body: '#c0996a', deep: '#6e4d2a' },
  { id: 'kohiki',  name: 'KOHIKI',  accent: '#9aa298', paper: '#f1f2ec', body: '#b9bdb1', deep: '#5d6358' },
  { id: 'tetsu',   name: 'TETSU',   accent: '#5c5046', paper: '#ece7dc', body: '#7a6a5a', deep: '#2f261c' },
];

const COPY = {
  masthead: 'WEB · STYLEBOOK',
  issue: 'FIELD GUIDE 06',
  fusion: 'EARTH × ZEN',
  count: 'N°06 / 09',
  date: '2026 · 03',
  origin: 'IGA · 2024',
  paletteLabel: { en: 'CLAY / 1 EARTH', ko: '흙 / 어스 1', ja: '土 / アース1' },
  paletteHint: { en: '↑ click to recolour the kiln', ko: '↑ 가마를 다시 빚으세요', ja: '↑ 窯を焼き直す' },
  kicker: { en: 'a field guide for', ko: '하나의 사물을 위한 ·', ja: 'ひとつの物のための ·' },
  kickerWord: { en: 'single objects.', ko: '필드 가이드.', ja: 'フィールド・ガイド。' },
  headEn: ['One', 'bowl.', 'One', 'silence.'],
  headKo: ['그릇', '하나.', '침묵', '하나.'],
  headJa: ['ひとつの', '器。', 'ひとつの', '静けさ。'],
  switchHint: {
    en: 'click any word — the accent moves',
    ko: '단어를 누르면 액센트가 옮겨갑니다',
    ja: '単語をクリックでアクセントが動く',
  },
  lede: {
    en: 'Earth provides the material; Zen provides the room around it. Picture-page right; data-page left; a single specimen, gravity-centred, with materials and provenance written in plain.',
    ko: 'Earth는 재료를, Zen은 그 주위 공간을 줍니다. 오른쪽은 사진 면, 왼쪽은 데이터 면. 중력에 끌려 가운데에 놓인 하나의 표본, 재료와 출처는 평이하게 적혀 있습니다.',
    ja: 'Earthは素材を、Zenは周囲の空間を与える。右は写真の面、左はデータの面。重力に引かれて中央に据えられた標本ひとつ、素材と来歴は平易に記される。',
  },
  marquee: {
    en: ['ONE OBJECT', '90% WHITESPACE', 'NO ORNAMENT', 'CORMORANT + IBM PLEX', 'TABULAR DIMENSIONS', 'ASH-TEA GLAZE'],
    ko: ['오브제 하나', '여백 90%', '장식 금지', 'CORMORANT + IBM PLEX', 'tabular 치수', '차 잿물 유약'],
    ja: ['ひとつのオブジェ', '余白90%', '装飾なし', 'CORMORANT + IBM PLEX', 'tabular 寸法', '灰茶釉'],
  },
  leadEyebrow: { en: 'FROM THE FIELD', ko: '현장에서', ja: '現場より' },
  rules: {
    en: [
      ['§01', 'One displayed object per spread. No second hero.'],
      ['§02', 'Materials are tabular. Dimensions get oldstyle figures.'],
      ['§03', 'Cormorant for the moment; IBM Plex for the page.'],
      ['§04', 'Shadows are floor shadows only — never decorative.'],
    ],
    ko: [
      ['§01', '한 스프레드에 표시되는 오브제는 하나. 둘째 히어로 없음.'],
      ['§02', '재료는 tabular. 치수는 oldstyle 숫자.'],
      ['§03', '순간을 위한 Cormorant, 페이지를 위한 IBM Plex.'],
      ['§04', '그림자는 *바닥 그림자*만 — 장식용은 없음.'],
    ],
    ja: [
      ['§01', '1見開きに表示オブジェは1つ。第二のヒーローなし。'],
      ['§02', '素材はtabular。寸法はoldstyle数字。'],
      ['§03', '瞬間にはCormorant、ページにはIBM Plex。'],
      ['§04', '影は床の影だけ — 装飾用は禁止。'],
    ],
  },
  specHeading: { en: '01 / 04 · Specimen', ko: '01 / 04 · 표본', ja: '01 / 04 · 標本' },
  specTitle: { en: 'Bowl, hand-turned, ash-tea glaze.', ko: '주발, 손으로 깎고, 차 잿물 유약.', ja: '茶碗、手挽き、灰茶釉。' },
  specRows: [
    { k: { en: 'Clay', ko: '흙', ja: '土' }, v: 'Iga, semi-coarse · 2200 °C' },
    { k: { en: 'Glaze', ko: '유약', ja: '釉' }, v: 'Ash-tea · 3 dips · matt' },
    { k: { en: 'Mouth', ko: '입', ja: '口縁' }, v: '142 mm · hand-pulled' },
    { k: { en: 'Foot', ko: '굽', ja: '高台' }, v: '86 mm · hand-turned' },
    { k: { en: 'Height', ko: '높이', ja: '高さ' }, v: '96 mm' },
    { k: { en: 'Weight', ko: '무게', ja: '重さ' }, v: '480 g · ±4' },
    { k: { en: 'Origin', ko: '소성', ja: '焼成' }, v: 'Wood-firing, day 14' },
  ],
  typeHeading: { en: '02 / 04 · Type', ko: '02 / 04 · 활자', ja: '02 / 04 · 書体' },
  typeTitle: { en: 'Cormorant for the moment. IBM Plex for the page.', ko: '순간엔 Cormorant, 페이지엔 IBM Plex.', ja: '瞬間にCormorant、ページにIBM Plex。' },
  typeRows: [
    { tag: 'DISPLAY · Cormorant italic', sample: { en: 'silence', ko: '침묵', ja: '静けさ' }, kind: 'display' as const },
    { tag: 'HEADLINE · Cormorant 400', sample: { en: 'A single bowl of warm clay', ko: '따뜻한 흙 한 그릇', ja: '温かな土の器ひとつ' }, kind: 'h1' as const },
    { tag: 'BODY · IBM Plex 300', sample: { en: 'A study in handheld stillness.', ko: '손에 쥐고 보는 정적에 관한 습작.', ja: '手のなかの静けさの習作。' }, kind: 'body' as const },
    { tag: 'TABULAR · IBM Plex 400', sample: { en: '142 mm · 480 g · 96 mm', ko: '142 mm · 480 g · 96 mm', ja: '142 mm · 480 g · 96 mm' }, kind: 'tab' as const },
    { tag: 'CAPTION · IBM Plex 500', sample: { en: 'SPECIMEN 06 · IGA 2024', ko: '표본 06 · 이가 2024', ja: '標本 06 · 伊賀 2024' }, kind: 'cap' as const },
  ],
  recipeHeading: { en: '03 / 04 · Recipe', ko: '03 / 04 · 레시피', ja: '03 / 04 · レシピ' },
  recipeTitle: { en: 'Paper + clay.', ko: '종이 + 흙.', ja: '紙 + 土。' },
  recipeFormula: {
    en: ['warm paper', '·', 'one earth', '·', 'one object', '·', '90% whitespace'],
    ko: ['따뜻한 종이', '·', '어스 하나', '·', '오브제 하나', '·', '여백 90%'],
    ja: ['温かな紙', '·', 'アース1', '·', 'オブジェ1', '·', '余白90%'],
  },
  pullHeading: { en: '04 / 04 · Pull quote', ko: '04 / 04 · 풀 인용', ja: '04 / 04 · 引用' },
  pullTitle: { en: 'Imperfection is what we recognize in ourselves.', ko: '불완전함은 자기 자신에게서 알아보는 것.', ja: '不完全さは、自分自身に気づくこと。' },
  pull: {
    en: '"Imperfection is not what we forgive in an object — it is what we recognize in ourselves."',
    ko: '"불완전함은 오브제에서 용서하는 것이 아니라, 우리 자신에게서 알아보는 것이다."',
    ja: '「不完全さは、器に対して赦すものではない — 自分自身に対して気づくものだ。」',
  },
  pullAttr: { en: '— Soetsu Yanagi, 1928', ko: '— 야나기 무네요시, 1928', ja: '— 柳宗悦、1928' },
  stampRow: {
    en: ['ONE OBJECT', '90% WHITESPACE', 'NO ORNAMENT', 'N°06 / 09'],
    ko: ['오브제 하나', '여백 90%', '장식 금지', 'N°06 / 09'],
    ja: ['オブジェ1', '余白90%', '装飾なし', 'N°06 / 09'],
  },
} as const;

const promptEn = `Design a creative single-page field guide in Earth × Zen fusion: the page is a museum specimen sheet — generous whitespace, one object, tabular materials, and a live earth palette switcher.

TOKENS (live): --accent (iga / shino / kohiki / tetsu earth tones), --paper, --body, --deep matched per palette.

TYPOGRAPHY: Cormorant Garamond 400/500 italic for display + IBM Plex Sans KR 300/400/500 for body. Tabular figures for materials.

SECTIONS: masthead, palette switcher, cover hero with clickable headline (one word italic accent) + SVG bowl with rim highlight + floor shadow, marquee, lead band with N°06 + rules, Specimen section with materials dl, Type specimen 5 rows, Recipe 2 cells (paper + earth), Pull quote (Yanagi), stamp row.

FORBIDDEN: two objects, sans-serif headlines, decorative dots / specks / motifs.

OUTPUT: live tokens + 10 sections + mobile collapse.`;
const promptKo = `Earth × Zen 퓨전 — 박물관 표본 시트. 여백이 넓고, 오브제 하나, 재료는 tabular, 라이브 흙 팔레트 스위처가 가마를 다시 빚는다.

토큰(라이브): --accent (iga / shino / kohiki / tetsu), --paper / --body / --deep 매칭.

타이포: Cormorant Garamond 400/500 이탤릭(디스플레이) + IBM Plex Sans KR 300/400/500(본문). 재료는 tabular.

섹션: 매스트헤드 / 팔레트 / 커버(클릭 가능한 4단어 헤드라인 + SVG 도자기) / 마키 / 리드(N°06 + §01~§04) / 01 Specimen + 재료 dl / 02 Type 5행 / 03 Recipe (paper + earth) / 04 Pull quote / 스탬프 줄.

금지: 오브제 둘 / 산세리프 헤드라인 / 장식적 점·모티프.`;
const promptJa = `Earth × Zenフュージョン — 博物館の標本シート。余白を広く、オブジェ1つ、素材はtabular、ライブの土パレットが窯を焼き直す。

トークン(ライブ): --accent (iga / shino / kohiki / tetsu)、--paper / --body / --deep。

タイポ: Cormorant Garamond 400/500 italic(ディスプレイ) + IBM Plex Sans KR 300/400/500(本文)。素材はtabular。

セクション: マストヘッド / パレット / カバー(クリック可能な4語 + SVG 茶碗) / マーキー / リード(N°06 + §01〜§04) / 01 Specimen + 素材dl / 02 Type 5行 / 03 Recipe(紙 + 土) / 04 引用 / スタンプ列。

禁止: オブジェ2つ / サンセリフ見出し / 装飾的なドット・モチーフ。`;

function VesselSvg({ body, deep }: { body: string; deep: string }) {
  return (
    <svg viewBox="0 0 360 300" className="ez-vessel" aria-label="Specimen bowl">
      <defs>
        <radialGradient id="ez-body" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#f1e2c8" />
          <stop offset="50%" stopColor={body} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>
        <radialGradient id="ez-mouth" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#1d160f" />
          <stop offset="60%" stopColor="#3a2c1f" />
          <stop offset="100%" stopColor={deep} stopOpacity="0.5" />
        </radialGradient>
        <linearGradient id="ez-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7e7c6" stopOpacity="0.95" />
          <stop offset="100%" stopColor={body} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ez-floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={deep} stopOpacity="0.28" />
          <stop offset="100%" stopColor={deep} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="180" cy="276" rx="120" ry="14" fill="url(#ez-floor)" />
      <path d="M64 130 C64 232, 296 232, 296 130 C296 124, 282 118, 260 116 L100 116 C78 118, 64 124, 64 130 Z" fill="url(#ez-body)" />
      <ellipse cx="180" cy="118" rx="116" ry="16" fill="url(#ez-mouth)" />
      <ellipse cx="180" cy="115" rx="116" ry="6" fill="url(#ez-rim)" />
    </svg>
  );
}

export function PortedFusionEarthZenPage({ lang }: PortedStylePageProps) {
  const [paletteId, setPaletteId] = useState('iga');
  const [glowIdx, setGlowIdx] = useState(3);
  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];
  const lng = lang as Lang;
  const styleVars: CSSProperties = {
    ['--ez-accent' as string]: palette.accent,
    ['--ez-paper' as string]: palette.paper,
    ['--ez-body' as string]: palette.body,
    ['--ez-deep' as string]: palette.deep,
  };
  const headWords = lng === 'ko' ? COPY.headKo : lng === 'ja' ? COPY.headJa : COPY.headEn;

  return (
    <FusionShell
      fusionId="fusion-earth-zen"
      lang={lang}
      prev={{ href: '/pages/fusion-holo-glass.html', label: 'Holo × Glass' }}
      next={{ href: '/pages/fusion-kinetic-brutal.html', label: 'Kinetic × Brutal' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
    >
      <div className="ez-shell" style={styleVars} data-palette={palette.id}>
        <header className="ez-masthead">
          <span className="ez-masthead__brand">{COPY.masthead}</span>
          <span className="ez-masthead__chip">{COPY.issue}</span>
          <span className="ez-masthead__chip">{COPY.fusion}</span>
          <span className="ez-masthead__chip ez-masthead__chip--accent">{COPY.count}</span>
          <span className="ez-masthead__rule" />
          <span className="ez-masthead__origin">{COPY.origin}</span>
        </header>

        <div className="ez-palette">
          <span className="ez-palette__label">{L(COPY.paletteLabel, lng)}</span>
          <div className="ez-palette__chips" role="radiogroup">
            {PALETTES.map((p) => (
              <button key={p.id} type="button" role="radio" aria-checked={p.id === paletteId}
                className={`ez-palette__chip ${p.id === paletteId ? 'is-active' : ''}`} onClick={() => setPaletteId(p.id)}>
                <span className="ez-palette__swatch" style={{ background: p.accent }} />
                <span className="ez-palette__swatch" style={{ background: p.paper, border: '1px solid rgba(0,0,0,.08)' }} />
                <span className="ez-palette__name">{p.name}</span>
              </button>
            ))}
          </div>
          <span className="ez-palette__hint">{L(COPY.paletteHint, lng)}</span>
        </div>

        <section className="ez-cover">
          <div className="ez-cover__col">
            <span className="ez-cover__kicker">{L(COPY.kicker, lng)} <em>{L(COPY.kickerWord, lng)}</em></span>
            <h1 className="ez-cover__h1">
              {headWords.map((w, i) => (
                <button key={i} type="button" className={`ez-cover__word ${i === glowIdx ? 'is-accent' : ''}`} onClick={() => setGlowIdx(i)}>{w}</button>
              ))}
            </h1>
            <p className="ez-cover__switchHint">{L(COPY.switchHint, lng)}</p>
            <p className="ez-cover__lede">{L(COPY.lede, lng)}</p>
            <div className="ez-cover__meta"><span>FIELD GUIDE</span><span className="ez-cover__dot" /><span>2026</span><span className="ez-cover__dot" /><span>{palette.name}</span></div>
          </div>
          <figure className="ez-cover__art" aria-hidden="true">
            <VesselSvg body={palette.body} deep={palette.deep} />
          </figure>
        </section>

        <div className="ez-marquee" aria-hidden="true">
          <div className="ez-marquee__track">
            {[...COPY.marquee[lng], ...COPY.marquee[lng]].map((w, i) => (<span key={i}>{w}<em>○</em></span>))}
          </div>
        </div>

        <section className="ez-lead">
          <div className="ez-lead__num" aria-hidden="true">N°06</div>
          <div className="ez-lead__body">
            <span className="ez-lead__eyebrow">{L(COPY.leadEyebrow, lng)}</span>
            <p className="ez-lead__intro">{L(COPY.lede, lng)}</p>
            <ul className="ez-lead__list">
              {COPY.rules[lng].map(([sym, body]) => (<li key={sym}><b>{sym}</b><span>{body}</span></li>))}
            </ul>
          </div>
        </section>

        <section className="ez-section">
          <div className="ez-section-eyebrow"><span className="ez-section-eyebrow__num">{L(COPY.specHeading, lng)}</span><span className="ez-section-eyebrow__rule" /></div>
          <h2 className="ez-section__h2">{L(COPY.specTitle, lng)}</h2>
          <dl className="ez-spec">
            {COPY.specRows.map((r) => (
              <div key={r.v}><dt>{L(r.k, lng)}</dt><dd>{r.v}</dd></div>
            ))}
          </dl>
        </section>

        <section className="ez-section">
          <div className="ez-section-eyebrow"><span className="ez-section-eyebrow__num">{L(COPY.typeHeading, lng)}</span><span className="ez-section-eyebrow__rule" /></div>
          <h2 className="ez-section__h2">{L(COPY.typeTitle, lng)}</h2>
          <ol className="ez-type">
            {COPY.typeRows.map((r, i) => (
              <li key={r.tag}>
                <span className="ez-type__tag">{r.tag}</span>
                <span className={`ez-type__sample ez-type__sample--${r.kind} ${i === 0 ? 'is-accent' : ''}`}>{L(r.sample, lng)}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="ez-section">
          <div className="ez-section-eyebrow"><span className="ez-section-eyebrow__num">{L(COPY.recipeHeading, lng)}</span><span className="ez-section-eyebrow__rule" /></div>
          <h2 className="ez-section__h2">{L(COPY.recipeTitle, lng)}</h2>
          <div className="ez-recipe">
            <div className="ez-recipe__cell" style={{ background: palette.paper, color: '#3a2c1f' }}>
              <span className="ez-recipe__role">PAPER</span>
              <span className="ez-recipe__hex">{palette.paper.toUpperCase()}</span>
              <span className="ez-recipe__plus">+</span>
            </div>
            <div className="ez-recipe__cell" style={{ background: palette.accent, color: palette.paper }}>
              <span className="ez-recipe__role">EARTH</span>
              <span className="ez-recipe__hex">{palette.accent.toUpperCase()}</span>
              <span className="ez-recipe__name">{palette.name}</span>
            </div>
          </div>
          <div className="ez-recipe__formula">
            {COPY.recipeFormula[lng].map((p, i) => <span key={i}>{p}</span>)}
          </div>
        </section>

        <section className="ez-section">
          <div className="ez-section-eyebrow"><span className="ez-section-eyebrow__num">{L(COPY.pullHeading, lng)}</span><span className="ez-section-eyebrow__rule" /></div>
          <h2 className="ez-section__h2">{L(COPY.pullTitle, lng)}</h2>
          <blockquote className="ez-pull">
            <p>{L(COPY.pull, lng)}</p>
            <cite>{L(COPY.pullAttr, lng)}</cite>
          </blockquote>
        </section>

        <section className="ez-stamps" aria-hidden="true">
          {COPY.stampRow[lng].map((s, i) => (<div key={s} className={`ez-stamp ez-stamp--${i}`}>{s}</div>))}
        </section>
      </div>
    </FusionShell>
  );
}
