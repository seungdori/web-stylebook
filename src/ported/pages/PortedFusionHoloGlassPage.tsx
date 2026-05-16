import { useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang) => obj[lang];

const PALETTES = [
  { id: 'pearl',   name: 'PEARL',   accent: '#a5e3ff', mesh1: '#a5e3ff', mesh2: '#a69cf8', mesh3: '#ffb6d1' },
  { id: 'mint',    name: 'MINT',    accent: '#76e2c4', mesh1: '#76e2c4', mesh2: '#a5e3ff', mesh3: '#a69cf8' },
  { id: 'lilac',   name: 'LILAC',   accent: '#c0a5ff', mesh1: '#c0a5ff', mesh2: '#ffb6d1', mesh3: '#a5e3ff' },
  { id: 'rose',    name: 'ROSE',    accent: '#ff8fb3', mesh1: '#ff8fb3', mesh2: '#c0a5ff', mesh3: '#76e2c4' },
];

const COPY = {
  masthead: 'WEB · STYLEBOOK',
  issue: 'PRESS KIT 05',
  fusion: 'HOLO × GLASS',
  count: 'N°05 / 09',
  date: '2026 · 02',
  os: 'visionOS · 2.4 +',
  paletteLabel: { en: 'AURORA / 1 ACCENT', ko: '오로라 / 액센트 1', ja: 'オーロラ / アクセント1' },
  paletteHint: { en: '↑ click to recolour the atmosphere', ko: '↑ 분위기 색을 바꿔보세요', ja: '↑ 雰囲気の色を切替' },
  kicker: { en: 'a press kit in', ko: '한 장의 유리로 만든 ·', ja: 'ガラス一枚で組む ·' },
  kickerWord: { en: 'frosted light.', ko: '프레스 키트.', ja: 'プレスキット。' },
  headEn: ['Soft light', 'through', 'one', 'clear panel.'],
  headKo: ['부드러운 빛이', '맑은', '한 장의', '유리를 통과한다.'],
  headJa: ['柔らかな光が', '一枚の', '透明な', 'パネルを抜ける。'],
  switchHint: {
    en: 'click any word — the pearl glow follows',
    ko: '단어를 누르면 펄 글로우가 따라옵니다',
    ja: '単語をクリックでパールが追う',
  },
  lede: {
    en: 'Holographic colour is atmosphere, not poster. One conic gradient drifts behind a vignette; one frosted panel carries the message. Everything else stays out of focus on purpose.',
    ko: '홀로그래픽 컬러는 *분위기*이지 *포스터*가 아닙니다. conic 한 점이 비네트 뒤에서 흘러갑니다. 프로스티드 패널 하나가 메시지를 짊어집니다. 나머지는 *의도적으로* 초점 바깥에 머뭅니다.',
    ja: 'ホログラフィックカラーは*空気*であって*ポスター*ではない。conicがヴィネットの背後を流れる。フロストガラスの一枚がメッセージを担う。残りは*意図的に*焦点の外側にとどまる。',
  },
  marquee: {
    en: ['BLUR 24', 'SATURATE 140', 'ONE PANEL', 'NO STACKED GLASS', 'PEARL INK', 'visionOS 2.4'],
    ko: ['BLUR 24', 'SATURATE 140', '패널 하나', '글래스 적층 금지', '펄 잉크', 'visionOS 2.4'],
    ja: ['BLUR 24', 'SATURATE 140', 'パネル1枚', 'ガラス重ね禁止', 'パール・インク', 'visionOS 2.4'],
  },
  leadEyebrow: { en: 'FROM THE STUDIO', ko: '스튜디오의 말', ja: 'スタジオより' },
  rules: {
    en: [
      ['§01', 'The atmosphere does the layering. The panel stays at one blur depth.'],
      ['§02', 'One accent for the whole spread — pearl is enough.'],
      ['§03', 'Vignette earns the contrast; saturation never does.'],
      ['§04', 'Respect prefers-reduced-motion — hold the conic at one frame.'],
    ],
    ko: [
      ['§01', '레이어링은 *분위기*가 담당합니다. 패널은 한 단계 블러로 멈춥니다.'],
      ['§02', '한 스프레드 한 액센트 — 펄 하나로 충분합니다.'],
      ['§03', '대비는 *비네트*가 만듭니다. *채도*가 만들지 않습니다.'],
      ['§04', 'prefers-reduced-motion을 존중 — conic은 1프레임 고정.'],
    ],
    ja: [
      ['§01', 'レイヤリングは*空気*が担う。パネルは1段のブラーで止める。'],
      ['§02', '1見開きにアクセント1 — パールだけで足りる。'],
      ['§03', 'コントラストは*ヴィネット*が作る。*彩度*ではない。'],
      ['§04', 'prefers-reduced-motionを尊重 — conicを1フレームに固定。'],
    ],
  },
  panelHeading: { en: '01 / 04 · Panel', ko: '01 / 04 · 패널', ja: '01 / 04 · パネル' },
  panelTitle: { en: 'One panel, three controls.', ko: '패널 하나, 컨트롤 셋.', ja: 'パネル1、コントロール3。' },
  controls: [
    { label: { en: 'Surface blur', ko: '표면 블러', ja: '面ブラー' }, val: '24px' },
    { label: { en: 'Saturation', ko: '채도', ja: '彩度' }, val: '140%' },
    { label: { en: 'Inner rim', ko: '내부 림', ja: '内側リム' }, val: '0.18' },
    { label: { en: 'Shadow', ko: '그림자', ja: '影' }, val: '40 / 80 / -40' },
    { label: { en: 'Radius', ko: '라디우스', ja: '角丸' }, val: '24px' },
    { label: { en: 'Frame', ko: '프레임', ja: 'フレーム' }, val: '1 px · 14%' },
  ],
  typeHeading: { en: '02 / 04 · Type', ko: '02 / 04 · 활자', ja: '02 / 04 · 書体' },
  typeTitle: { en: 'Inter on pearl. No saturated chrome.', ko: 'Inter 위 펄. 크롬에 채도 금지.', ja: 'Inter にパール。クロームに彩度なし。' },
  typeRows: [
    { tag: 'DISPLAY · 500', sample: { en: 'spectrum', ko: '스펙트럼', ja: 'スペクトラム' }, kind: 'display' as const },
    { tag: 'HEADLINE · 500', sample: { en: 'Soft light, one clear panel', ko: '부드러운 빛, 한 장의 유리', ja: '柔らかな光、一枚の硝子' }, kind: 'h1' as const },
    { tag: 'CHIP · Mono', sample: { en: 'backdrop-blur 24', ko: 'backdrop-blur 24', ja: 'backdrop-blur 24' }, kind: 'chip' as const },
    { tag: 'BODY · 400', sample: { en: 'Atmosphere does the layering.', ko: '레이어링은 분위기가 담당합니다.', ja: 'レイヤリングは空気が担う。' }, kind: 'body' as const },
    { tag: 'MONO · 0.78', sample: { en: '0.42 ms · M1 · 60 fps', ko: '0.42 ms · M1 · 60 fps', ja: '0.42 ms · M1 · 60 fps' }, kind: 'mono' as const },
  ],
  recipeHeading: { en: '03 / 04 · Recipe', ko: '03 / 04 · 레시피', ja: '03 / 04 · レシピ' },
  recipeTitle: { en: 'Atmosphere + glass.', ko: '분위기 + 유리.', ja: '空気 + ガラス。' },
  recipeFormula: {
    en: ['conic mesh', '·', '120 px blur', '·', 'one glass panel', '·', 'pearl ink'],
    ko: ['conic 메시', '·', '120 px 블러', '·', '글래스 패널 1', '·', '펄 잉크'],
    ja: ['conicメッシュ', '·', '120pxブラー', '·', 'ガラスパネル1', '·', 'パール・インク'],
  },
  pullHeading: { en: '04 / 04 · Pull quote', ko: '04 / 04 · 풀 인용', ja: '04 / 04 · 引用' },
  pullTitle: { en: 'Closer to weather than to wallpaper.', ko: '벽지가 아니라 날씨에 가깝게.', ja: '壁紙ではなく天候に近く。' },
  pull: {
    en: '"Held in mid-air, the colour reads as atmosphere rather than image — closer to weather than to wallpaper."',
    ko: '"공중에 매달려, 색은 이미지가 아니라 분위기로 읽힌다 — 벽지가 아니라 날씨에 가깝게."',
    ja: '「空中に留まり、色は画像ではなく空気として読まれる — 壁紙ではなく天候のように。」',
  },
  pullAttr: { en: '— Studio note, v1.0', ko: '— 스튜디오 노트, v1.0', ja: '— スタジオノート、v1.0' },
  stampRow: {
    en: ['ONE PANEL', 'NO SATURATION', 'PEARL ACCENT', 'N°05 / 09'],
    ko: ['패널 하나', '채도 증가 금지', '펄 액센트', 'N°05 / 09'],
    ja: ['パネル1', '彩度禁止', 'パール・アクセント', 'N°05 / 09'],
  },
} as const;

const promptEn = `Design a creative press-kit page in Holo × Glass fusion: an atmospheric stylebook spread where one frosted panel carries the message and a live aurora palette switcher recolours the air.

TOKENS (live-swappable):
--accent (pearl #a5e3ff / mint #76e2c4 / lilac #c0a5ff / rose #ff8fb3)
--mesh1/2/3 (matching conic stops)

ATMOSPHERE: one fixed conic gradient orb (120 px blur, 110% saturation, 0.55 opacity) + a radial vignette darkening corners to 70%.

GLASS PANEL: linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03)) + 1 px border + backdrop-filter blur(24) saturate(140) + box-shadow inset 0 1 0 rgba(255,255,255,0.18), 0 40 80 -40 rgba(0,0,0,0.6). Radius 24 px.

SECTIONS: masthead, palette switcher, cover hero with clickable headline (one word in pearl glow), atmospheric art panel, marquee, lead band with rules, panel + controls section, type specimen, recipe (atmosphere + glass), pull quote, stamps.

FORBIDDEN: stacked glass panels, more than one accent, blur over 30 px on the panel.

MOTION: optional 16 s conic hue-rotate, marquee 36 s; otherwise static. Reduced-motion holds both.

OUTPUT: live tokens + the 11 sections + mobile collapse.`;

const promptKo = `Holo × Glass 퓨전 — 한 장의 프로스티드 패널이 메시지를 짊어지고, 라이브 오로라 팔레트로 공기가 다시 칠해지는 *프레스 키트* 한 면.

토큰(라이브): --accent (pearl / mint / lilac / rose) + 세 conic 색.
분위기: fixed conic 1개(120px 블러, 0.55) + radial 비네트(코너 70%).
글래스: 160deg 그라데이션 + 1px 보더 + backdrop-blur 24, saturate 140 + inset/대형 그림자, radius 24.

섹션: 매스트헤드 / 팔레트 / 커버(클릭 가능한 헤드라인) / 분위기 아트 / 마키 / 리드 + §01~§04 / Panel + Controls / Type / Recipe / Pull / Stamps.

금지: 글래스 적층 / 2색 액센트 / 패널 자체의 blur 30px 초과.

모션: conic 16s hue-rotate, 마키 36s, 그 외 정지.`;

const promptJa = `Holo × Glassフュージョン — フロストガラス一枚がメッセージを担い、ライブ・オーロラ・パレットで空気が再着色される*プレスキット*の一葉。

トークン(ライブ): --accent (pearl / mint / lilac / rose) + 3つのconicストップ。
空気: fixedのconic1つ(120pxブラー、0.55) + radialヴィネット(隅70%)。
ガラス: 160degグラデ + 1px縁 + backdrop-blur 24, saturate 140 + 内側rim/大きな影、radius 24。

セクション: マストヘッド / パレット / カバー(クリック可能な見出し) / 空気のアート / マーキー / リード + §01〜§04 / Panel+Controls / Type / Recipe / Pull / Stamps。

禁止: ガラスの重ね置き / 2色めのアクセント / パネル自体のblur 30px超え。

モーション: conic 16s hue-rotate、マーキー36s、それ以外なし。`;

export function PortedFusionHoloGlassPage({ lang }: PortedStylePageProps) {
  const [paletteId, setPaletteId] = useState('pearl');
  const [glowIdx, setGlowIdx] = useState(0);
  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];
  const lng = lang as Lang;
  const styleVars: CSSProperties = {
    ['--hg-accent' as string]: palette.accent,
    ['--hg-mesh-1' as string]: palette.mesh1,
    ['--hg-mesh-2' as string]: palette.mesh2,
    ['--hg-mesh-3' as string]: palette.mesh3,
  };
  const headWords = lng === 'ko' ? COPY.headKo : lng === 'ja' ? COPY.headJa : COPY.headEn;

  return (
    <FusionShell
      fusionId="fusion-holo-glass"
      lang={lang}
      prev={{ href: '/pages/fusion-editorial-terminal.html', label: 'Editorial × Terminal' }}
      next={{ href: '/pages/fusion-kinetic-brutal.html', label: 'Kinetic × Brutal' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
    >
      <div className="hg-shell" style={styleVars} data-palette={palette.id}>
        <div className="hg-atmos" aria-hidden="true" />
        <header className="hg-masthead">
          <span className="hg-masthead__brand">{COPY.masthead}</span>
          <span className="hg-masthead__chip">{COPY.issue}</span>
          <span className="hg-masthead__chip">{COPY.fusion}</span>
          <span className="hg-masthead__chip hg-masthead__chip--accent">{COPY.count}</span>
          <span className="hg-masthead__rule" />
          <span className="hg-masthead__os">{COPY.os}</span>
        </header>

        <div className="hg-palette">
          <span className="hg-palette__label">{L(COPY.paletteLabel, lng)}</span>
          <div className="hg-palette__chips" role="radiogroup">
            {PALETTES.map((p) => (
              <button key={p.id} type="button" role="radio" aria-checked={p.id === paletteId}
                className={`hg-palette__chip ${p.id === paletteId ? 'is-active' : ''}`}
                onClick={() => setPaletteId(p.id)}>
                <span className="hg-palette__swatch" style={{ background: p.accent }} />
                <span className="hg-palette__swatch" style={{ background: p.mesh2 }} />
                <span className="hg-palette__name">{p.name}</span>
              </button>
            ))}
          </div>
          <span className="hg-palette__hint">{L(COPY.paletteHint, lng)}</span>
        </div>

        <section className="hg-cover">
          <div className="hg-cover__col">
            <span className="hg-cover__kicker">{L(COPY.kicker, lng)} <em>{L(COPY.kickerWord, lng)}</em></span>
            <h1 className="hg-cover__h1">
              {headWords.map((w, i) => (
                <button key={i} type="button" className={`hg-cover__word ${i === glowIdx ? 'is-glow' : ''}`} onClick={() => setGlowIdx(i)}>{w}</button>
              ))}
            </h1>
            <p className="hg-cover__switchHint">{L(COPY.switchHint, lng)}</p>
            <p className="hg-cover__lede">{L(COPY.lede, lng)}</p>
            <div className="hg-cover__meta"><span>cover</span><span className="hg-cover__dot" /><span>2026</span><span className="hg-cover__dot" /><span>{palette.name}</span></div>
          </div>
          <div className="hg-cover__art" aria-hidden="true">
            <div className="hg-glass-panel">
              <span className="hg-glass-panel__chip">{COPY.os}</span>
              <strong className="hg-glass-panel__title">{L({ en: 'Frosted', ko: '프로스티드', ja: 'フロスト' }, lng)}</strong>
              <span className="hg-glass-panel__sub">{L({ en: 'one panel · one accent', ko: '패널 하나 · 액센트 하나', ja: 'パネル1 · アクセント1' }, lng)}</span>
              <div className="hg-glass-panel__dot" />
            </div>
          </div>
        </section>

        <div className="hg-marquee" aria-hidden="true">
          <div className="hg-marquee__track">
            {[...COPY.marquee[lng], ...COPY.marquee[lng]].map((w, i) => (<span key={i}>{w}<em>○</em></span>))}
          </div>
        </div>

        <section className="hg-lead">
          <div className="hg-lead__num" aria-hidden="true">N°05</div>
          <div className="hg-lead__body">
            <span className="hg-lead__eyebrow">{L(COPY.leadEyebrow, lng)}</span>
            <p className="hg-lead__intro">{L(COPY.lede, lng)}</p>
            <ul className="hg-lead__list">
              {COPY.rules[lng].map(([sym, body]) => (<li key={sym}><b>{sym}</b><span>{body}</span></li>))}
            </ul>
          </div>
        </section>

        <section className="hg-section">
          <div className="hg-section-eyebrow">
            <span className="hg-section-eyebrow__num">{L(COPY.panelHeading, lng)}</span>
            <span className="hg-section-eyebrow__rule" />
          </div>
          <h2 className="hg-section__h2">{L(COPY.panelTitle, lng)}</h2>
          <div className="hg-controls-panel">
            {COPY.controls.map((c, i) => (
              <div key={i} className="hg-control">
                <span className="hg-control__label">{L(c.label, lng)}</span>
                <span className="hg-control__value">{c.val}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="hg-section">
          <div className="hg-section-eyebrow">
            <span className="hg-section-eyebrow__num">{L(COPY.typeHeading, lng)}</span>
            <span className="hg-section-eyebrow__rule" />
          </div>
          <h2 className="hg-section__h2">{L(COPY.typeTitle, lng)}</h2>
          <ol className="hg-type">
            {COPY.typeRows.map((r, i) => (
              <li key={r.tag}>
                <span className="hg-type__tag">{r.tag}</span>
                <span className={`hg-type__sample hg-type__sample--${r.kind} ${i === 0 ? 'is-glow' : ''}`}>{L(r.sample, lng)}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="hg-section">
          <div className="hg-section-eyebrow">
            <span className="hg-section-eyebrow__num">{L(COPY.recipeHeading, lng)}</span>
            <span className="hg-section-eyebrow__rule" />
          </div>
          <h2 className="hg-section__h2">{L(COPY.recipeTitle, lng)}</h2>
          <div className="hg-recipe">
            <div className="hg-recipe__cell hg-recipe__cell--mesh">
              <span className="hg-recipe__role">ATMOSPHERE</span>
              <span className="hg-recipe__hex">conic · 120 px</span>
              <span className="hg-recipe__plus">+</span>
            </div>
            <div className="hg-recipe__cell hg-recipe__cell--glass">
              <span className="hg-recipe__role">GLASS</span>
              <span className="hg-recipe__hex">{palette.accent.toUpperCase()}</span>
              <span className="hg-recipe__name">{palette.name}</span>
            </div>
          </div>
          <div className="hg-recipe__formula">
            {COPY.recipeFormula[lng].map((p, i) => <span key={i}>{p}</span>)}
          </div>
        </section>

        <section className="hg-section">
          <div className="hg-section-eyebrow">
            <span className="hg-section-eyebrow__num">{L(COPY.pullHeading, lng)}</span>
            <span className="hg-section-eyebrow__rule" />
          </div>
          <h2 className="hg-section__h2">{L(COPY.pullTitle, lng)}</h2>
          <blockquote className="hg-pull">
            <p>{L(COPY.pull, lng)}</p>
            <cite>{L(COPY.pullAttr, lng)}</cite>
          </blockquote>
        </section>

        <section className="hg-stamps" aria-hidden="true">
          {COPY.stampRow[lng].map((s, i) => (<div key={s} className={`hg-stamp hg-stamp--${i}`}>{s}</div>))}
        </section>
      </div>
    </FusionShell>
  );
}
