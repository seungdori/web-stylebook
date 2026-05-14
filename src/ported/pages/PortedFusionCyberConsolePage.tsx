import { useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang) => obj[lang];

const PALETTES = [
  { id: 'magenta', name: 'MAGENTA', accent: '#ff2db1', ink: '#060608' },
  { id: 'lime',    name: 'LIME',    accent: '#a3ff2d', ink: '#080806' },
  { id: 'amber',   name: 'AMBER',   accent: '#ffb02d', ink: '#0a0805' },
  { id: 'cyan',    name: 'CYAN',    accent: '#2df0ff', ink: '#06080a' },
];

const COPY = {
  masthead: 'WEB · STYLEBOOK',
  issue: 'OPERATOR 08',
  fusion: 'CYBER × CONSOLE',
  count: 'N°08 / 09',
  pid: 'PID 04812 · console.stylebook',
  paletteLabel: { en: 'SIGNAL / 1 HOT', ko: '시그널 / 핫 1', ja: 'シグナル / ホット1' },
  paletteHint: { en: '↑ click to repaint the signal', ko: '↑ 시그널 색 재교체', ja: '↑ シグナルを再着色' },
  kicker: { en: 'a manual for', ko: '오퍼레이터를 위한 ·', ja: 'オペレータのための ·' },
  kickerWord: { en: 'operators.', ko: '매뉴얼.', ja: 'マニュアル。' },
  headEn: ['One', 'hot', 'signal.'],
  headKo: ['뜨거운', '신호', '하나.'],
  headJa: ['熱い', '信号が', 'ひとつ。'],
  switchHint: {
    en: 'click any word — the SIGNAL row follows',
    ko: '단어를 누르면 SIGNAL 행이 따라옵니다',
    ja: '単語をクリックでSIGNAL行が追う',
  },
  lede: {
    en: 'Density without panic. The console gives the page its grid; the cyber accent gives it its temperature. Most rows stay grey. One row glows — exactly while something is changing in the system.',
    ko: '소동 없는 밀도. 콘솔이 페이지의 격자를, 사이버 액센트가 온도를 만듭니다. 대부분의 줄은 회색을 지키고, 한 줄만 빛납니다 — 실제로 시스템에서 무언가가 변하는 동안에만.',
    ja: '騒がしくない密度。コンソールが格子を、サイバーが温度を与える。多くの行は灰のまま、一行だけが光る — 実際にシステムが変わっているあいだだけ。',
  },
  marquee: {
    en: ['1 HOT SIGNAL', 'MONO EVERYWHERE', 'NO GLITCH ART', '⌘K = SEARCH', 'BLINKING CURSOR · 1.1s', '60 fps · M1'],
    ko: ['핫 시그널 1', '모노 단일', '글리치 아트 금지', '⌘K = 검색', '커서 1.1s', '60 fps · M1'],
    ja: ['ホット信号1', 'モノ専用', 'グリッチアート禁止', '⌘K = 検索', 'カーソル1.1s', '60 fps · M1'],
  },
  leadEyebrow: { en: 'FROM THE OPERATOR', ko: '오퍼레이터의 말', ja: 'オペレータより' },
  rules: {
    en: [
      ['§01', 'Mono everywhere. Inter only at the headline.'],
      ['§02', 'One row per screen carries the accent. Body stays grey.'],
      ['§03', 'No glitch art, no scanlines on body content.'],
      ['§04', 'Cursor 1.1 s blink. Pulse dot 2.4 s opacity. Nothing else moves.'],
    ],
    ko: [
      ['§01', '모노 전역. 헤드라인에만 Inter.'],
      ['§02', '한 화면에 액센트 행은 하나. 본문은 회색.'],
      ['§03', '글리치 아트 금지, 본문에 스캔라인 금지.'],
      ['§04', '커서 1.1s, 펄스 도트 2.4s opacity. 그 외 정지.'],
    ],
    ja: [
      ['§01', 'モノを全域に。見出しのみInter。'],
      ['§02', '1画面のアクセント行は1。本文は灰。'],
      ['§03', 'グリッチアート禁止、本文にスキャンライン禁止。'],
      ['§04', 'カーソル1.1s、パルスドット2.4s opacity。それ以外なし。'],
    ],
  },
  consoleHeading: { en: '01 / 04 · Console', ko: '01 / 04 · 콘솔', ja: '01 / 04 · コンソール' },
  consoleTitle: { en: 'One log lane. One status panel.', ko: '로그 한 차선. 상태 패널 하나.', ja: 'ログ1レーン、ステータス1。' },
  log: [
    { time: '03:23:48', tag: 'BOOT', body: 'session.start engine=stylebook', kind: 'normal' },
    { time: '03:23:51', tag: 'TOKEN', body: 'palette/cyber loaded · 4 tokens', kind: 'normal' },
    { time: '03:23:58', tag: 'BUILD', body: 'fusing editorial⊕console.v2 · ok', kind: 'normal' },
    { time: '03:24:02', tag: 'INPUT', body: 'op-01 :: ⌘K · query="signal"', kind: 'muted' },
    { time: '03:24:07', tag: 'NOTICE', body: 'cooling lane within 0.4σ', kind: 'muted' },
    { time: '03:24:09', tag: 'SIGNAL', body: 'glow gate opened — accent locked', kind: 'signal' },
    { time: '03:24:11', tag: 'STAGE', body: 'ready · awaiting render · drift 0.02 s', kind: 'normal' },
    { time: '03:24:14', tag: 'COMMIT', body: 'sheet 08/09 → release-04 · clean', kind: 'normal' },
  ],
  status: {
    en: [
      { dt: 'Runtime', dd: '04:12:33' },
      { dt: 'Accent', dd: 'magenta', hot: true },
      { dt: 'Drift', dd: '0.02 s' },
      { dt: 'Mode', dd: 'operator' },
    ],
    ko: [
      { dt: '런타임', dd: '04:12:33' },
      { dt: '액센트', dd: 'magenta', hot: true },
      { dt: '드리프트', dd: '0.02 s' },
      { dt: '모드', dd: 'operator' },
    ],
    ja: [
      { dt: 'ランタイム', dd: '04:12:33' },
      { dt: 'アクセント', dd: 'magenta', hot: true },
      { dt: 'ドリフト', dd: '0.02 s' },
      { dt: 'モード', dd: 'operator' },
    ],
  },
  typeHeading: { en: '02 / 04 · Type', ko: '02 / 04 · 활자', ja: '02 / 04 · 書体' },
  typeTitle: { en: 'Mono speaks. Inter shouts once.', ko: '모노가 말하고, Inter는 한 번 외친다.', ja: 'モノが語り、Interは一度叫ぶ。' },
  typeRows: [
    { tag: 'DISPLAY · Inter 600', sample: { en: 'signal', ko: '신호', ja: '信号' }, kind: 'display' as const },
    { tag: 'HEADLINE · Inter 600', sample: { en: 'one hot signal', ko: '뜨거운 신호 하나', ja: '熱い信号ひとつ' }, kind: 'h1' as const },
    { tag: 'LOG · Mono 0.86', sample: { en: '03:24 SIGNAL glow gate opened', ko: '03:24 SIGNAL 글로우 게이트 열림', ja: '03:24 SIGNAL グロウゲート開' }, kind: 'log' as const },
    { tag: 'BODY · Mono 0.84', sample: { en: 'Density without panic.', ko: '소동 없는 밀도.', ja: '騒がしくない密度。' }, kind: 'body' as const },
    { tag: 'KEY · Mono 0.74', sample: { en: '⌘K / ⌥E / ⇧?', ko: '⌘K / ⌥E / ⇧?', ja: '⌘K / ⌥E / ⇧?' }, kind: 'key' as const },
  ],
  recipeHeading: { en: '03 / 04 · Recipe', ko: '03 / 04 · 레시피', ja: '03 / 04 · レシピ' },
  recipeTitle: { en: 'Ink + one signal.', ko: '잉크 + 시그널 하나.', ja: 'インク + 信号1。' },
  recipeFormula: {
    en: ['mono base', '·', '1 signal', '·', '1 cursor', '·', 'tabular figures'],
    ko: ['모노 베이스', '·', '시그널 1', '·', '커서 1', '·', 'tabular figures'],
    ja: ['モノ基調', '·', '信号1', '·', 'カーソル1', '·', 'tabular figures'],
  },
  pullHeading: { en: '04 / 04 · Pull quote', ko: '04 / 04 · 풀 인용', ja: '04 / 04 · 引用' },
  pullTitle: { en: 'One line glows.', ko: '한 줄만 빛난다.', ja: '一行だけが光る。' },
  pull: {
    en: '"Most rows stay grey. One row glows — exactly while something is actually changing in the system."',
    ko: '"대부분의 줄은 회색이다. 한 줄만 빛난다 — 실제로 시스템이 변하는 동안에만."',
    ja: '「多くの行は灰のまま。一行だけが光る — 実際に変わっているあいだだけ。」',
  },
  pullAttr: { en: '— Operator manual, v04', ko: '— 오퍼레이터 매뉴얼, v04', ja: '— オペレータ・マニュアル v04' },
  stampRow: {
    en: ['ONE HOT ROW', 'NO GLITCH ART', '⌘K = SEARCH', 'N°08 / 09'],
    ko: ['핫 행 하나', '글리치 금지', '⌘K = 검색', 'N°08 / 09'],
    ja: ['ホット行1', 'グリッチ禁止', '⌘K = 検索', 'N°08 / 09'],
  },
} as const;

const promptEn = `Design a creative single-page operator manual in Cyber × Console fusion: the page is a console — mono everywhere — where one row glows live, and a palette switcher recolours the signal.

TOKENS (live): --accent (magenta / lime / amber / cyan), --ink (#060608 etc.).

TYPOGRAPHY: JetBrains Mono for almost everything (0.82–0.92rem). Inter 600 only for the headline (clamp 2.2–3.6rem, letter-spacing -0.03em).

SECTIONS: masthead with PID + chips, palette switcher (live), cover hero with click-to-recolour 3-word headline + atmospheric scanline panel, marquee, lead band with rules, Console section (log lines: BOOT/TOKEN/BUILD/INPUT/NOTICE/SIGNAL/STAGE/COMMIT — only SIGNAL row in accent) + status panel (one hot row), Type specimen 5 rows, Recipe (ink + accent), Manifesto pull quote (mono italic), stamps row.

FORBIDDEN: 2 accents, full-screen scanlines on body, glitch overlays.

MOTION: cursor 1.1 s blink, pulse dot 2.4 s, marquee 36 s. Reduced-motion freezes.

OUTPUT: live tokens + 10 sections + mobile collapse.`;
const promptKo = `Cyber × Console 퓨전 — 페이지 자체가 콘솔. 모노 전역, 한 줄만 라이브로 빛나고, 팔레트 스위처가 시그널 색을 재교체.

토큰(라이브): --accent (magenta / lime / amber / cyan), --ink.
타이포: JetBrains Mono(0.82–0.92rem), 헤드라인만 Inter 600.

섹션: 매스트헤드(PID+칩) / 팔레트 / 커버(3단어 클릭 가능 + 스캔라인 패널) / 마키 / 리드 + §01~§04 / 01 Console(BOOT/TOKEN/.../SIGNAL/STAGE/COMMIT 8행 + 상태 패널 1핫) / 02 Type / 03 Recipe / 04 Pull quote / 스탬프.
금지: 2액센트 / 본문 풀스크린 스캔라인 / 글리치.
모션: 커서 1.1s, 펄스 2.4s, 마키 36s.`;
const promptJa = `Cyber × Consoleフュージョン — ページそのものがコンソール。モノ全域、1行だけライブで光り、パレットで信号色を切替。

トークン(ライブ): --accent (magenta / lime / amber / cyan)、--ink。
タイポ: JetBrains Mono(0.82–0.92rem)、見出しのみInter 600。

セクション: マストヘッド(PID+チップ) / パレット / カバー(3語クリック可能 + スキャンライン・パネル) / マーキー / リード+§01〜§04 / 01 Console(8行+ステータス1ホット) / 02 Type / 03 Recipe / 04 Pull / スタンプ。
禁止: 2アクセント / 本文の全画面スキャンライン / グリッチ。
モーション: カーソル1.1s、パルス2.4s、マーキー36s。`;

export function PortedFusionCyberConsolePage({ lang }: PortedStylePageProps) {
  const [paletteId, setPaletteId] = useState('magenta');
  const [glowIdx, setGlowIdx] = useState(1);
  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];
  const lng = lang as Lang;
  const styleVars: CSSProperties = {
    ['--cc-accent' as string]: palette.accent,
    ['--cc-ink' as string]: palette.ink,
  };
  const headWords = lng === 'ko' ? COPY.headKo : lng === 'ja' ? COPY.headJa : COPY.headEn;

  return (
    <FusionShell
      fusionId="fusion-cyber-console"
      lang={lang}
      prev={{ href: '/pages/fusion-kinetic-brutal.html', label: 'Kinetic × Brutal' }}
      next={{ href: '/pages/fusion-grain-mono.html', label: 'Analog Press' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
    >
      <div className="cc-shell" style={styleVars} data-palette={palette.id}>
        <header className="cc-masthead">
          <span className="cc-masthead__brand">{COPY.masthead}</span>
          <span className="cc-masthead__chip">{COPY.issue}</span>
          <span className="cc-masthead__chip">{COPY.fusion}</span>
          <span className="cc-masthead__chip cc-masthead__chip--accent">{COPY.count}</span>
          <span className="cc-masthead__rule" />
          <span className="cc-masthead__pid">{COPY.pid}</span>
        </header>

        <div className="cc-palette">
          <span className="cc-palette__label">{L(COPY.paletteLabel, lng)}</span>
          <div className="cc-palette__chips" role="radiogroup">
            {PALETTES.map((p) => (
              <button key={p.id} type="button" role="radio" aria-checked={p.id === paletteId}
                className={`cc-palette__chip ${p.id === paletteId ? 'is-active' : ''}`} onClick={() => setPaletteId(p.id)}>
                <span className="cc-palette__swatch" style={{ background: p.accent, boxShadow: `0 0 10px ${p.accent}` }} />
                <span className="cc-palette__swatch" style={{ background: p.ink, border: '1px solid rgba(255,255,255,.18)' }} />
                <span className="cc-palette__name">{p.name}</span>
              </button>
            ))}
          </div>
          <span className="cc-palette__hint">{L(COPY.paletteHint, lng)}</span>
        </div>

        <section className="cc-cover">
          <div className="cc-cover__col">
            <span className="cc-cover__kicker">{L(COPY.kicker, lng)} <em>{L(COPY.kickerWord, lng)}</em></span>
            <h1 className="cc-cover__h1">
              {headWords.map((w, i) => (
                <button key={i} type="button" className={`cc-cover__word ${i === glowIdx ? 'is-accent' : ''}`} onClick={() => setGlowIdx(i)}>{w}</button>
              ))}
            </h1>
            <p className="cc-cover__switchHint">{L(COPY.switchHint, lng)}</p>
            <p className="cc-cover__lede">{L(COPY.lede, lng)}</p>
            <div className="cc-cover__meta"><span>OP-01</span><span className="cc-cover__dot" /><span>03:24:11 UTC</span><span className="cc-cover__dot" /><span>{palette.name}</span></div>
          </div>
          <div className="cc-cover__art" aria-hidden="true">
            <div className="cc-scanpanel">
              <span className="cc-scanpanel__dot" />
              <span className="cc-scanpanel__path">/var/log/stylebook.log</span>
              <span className="cc-scanpanel__time">03:24:11</span>
            </div>
          </div>
        </section>

        <div className="cc-marquee" aria-hidden="true">
          <div className="cc-marquee__track">
            {[...COPY.marquee[lng], ...COPY.marquee[lng]].map((w, i) => (<span key={i}>{w}<em>›</em></span>))}
          </div>
        </div>

        <section className="cc-lead">
          <div className="cc-lead__num" aria-hidden="true">N°08</div>
          <div className="cc-lead__body">
            <span className="cc-lead__eyebrow">{L(COPY.leadEyebrow, lng)}</span>
            <p className="cc-lead__intro">{L(COPY.lede, lng)}</p>
            <ul className="cc-lead__list">
              {COPY.rules[lng].map(([sym, body]) => (<li key={sym}><b>{sym}</b><span>{body}</span></li>))}
            </ul>
          </div>
        </section>

        <section className="cc-section">
          <div className="cc-section-eyebrow"><span className="cc-section-eyebrow__num">{L(COPY.consoleHeading, lng)}</span><span className="cc-section-eyebrow__rule" /></div>
          <h2 className="cc-section__h2">{L(COPY.consoleTitle, lng)}</h2>
          <div className="cc-frame">
            <header className="cc-frame__bar"><span className="cc-frame__dot" /><span>/var/log/stylebook.log</span><span style={{ marginLeft: 'auto' }}>03:24:14 UTC</span></header>
            <div className="cc-frame__body">
              <div className="cc-log">
                {COPY.log.map((row, i) => (
                  <div key={i} className={`cc-log__line cc-log__line--${row.kind}`}>
                    <time>{row.time}</time>
                    <span className="cc-log__tag">{row.tag}</span>
                    <span>{row.body}</span>
                  </div>
                ))}
                <div className="cc-log__line cc-log__cursor"><time>03:24:14</time><span className="cc-log__tag">WAIT</span><span> </span></div>
              </div>
              <aside className="cc-status">
                <h3>STATUS</h3>
                <dl>
                  {COPY.status[lng].map((s) => (<div key={s.dt}><dt>{s.dt}</dt><dd className={s.hot ? 'is-hot' : ''}>{s.dd}</dd></div>))}
                </dl>
              </aside>
            </div>
          </div>
        </section>

        <section className="cc-section">
          <div className="cc-section-eyebrow"><span className="cc-section-eyebrow__num">{L(COPY.typeHeading, lng)}</span><span className="cc-section-eyebrow__rule" /></div>
          <h2 className="cc-section__h2">{L(COPY.typeTitle, lng)}</h2>
          <ol className="cc-type">
            {COPY.typeRows.map((r, i) => (
              <li key={r.tag}>
                <span className="cc-type__tag">{r.tag}</span>
                <span className={`cc-type__sample cc-type__sample--${r.kind} ${i === 0 ? 'is-accent' : ''}`}>{L(r.sample, lng)}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="cc-section">
          <div className="cc-section-eyebrow"><span className="cc-section-eyebrow__num">{L(COPY.recipeHeading, lng)}</span><span className="cc-section-eyebrow__rule" /></div>
          <h2 className="cc-section__h2">{L(COPY.recipeTitle, lng)}</h2>
          <div className="cc-recipe">
            <div className="cc-recipe__cell cc-recipe__cell--ink" style={{ background: palette.ink, color: palette.accent }}>
              <span>INK</span>
              <strong>{palette.ink.toUpperCase()}</strong>
              <span className="cc-recipe__plus">+</span>
            </div>
            <div className="cc-recipe__cell cc-recipe__cell--accent" style={{ background: palette.accent, color: palette.ink, boxShadow: `0 0 60px ${palette.accent}33` }}>
              <span>SIGNAL</span>
              <strong>{palette.accent.toUpperCase()}</strong>
              <em>{palette.name}</em>
            </div>
          </div>
          <div className="cc-recipe__formula">
            {COPY.recipeFormula[lng].map((p, i) => <span key={i}>{p}</span>)}
          </div>
        </section>

        <section className="cc-section">
          <div className="cc-section-eyebrow"><span className="cc-section-eyebrow__num">{L(COPY.pullHeading, lng)}</span><span className="cc-section-eyebrow__rule" /></div>
          <h2 className="cc-section__h2">{L(COPY.pullTitle, lng)}</h2>
          <blockquote className="cc-pull">
            <p>{L(COPY.pull, lng)}</p>
            <cite>{L(COPY.pullAttr, lng)}</cite>
          </blockquote>
        </section>

        <section className="cc-stamps" aria-hidden="true">
          {COPY.stampRow[lng].map((s, i) => (<div key={s} className={`cc-stamp cc-stamp--${i}`}>{s}</div>))}
        </section>
      </div>
    </FusionShell>
  );
}
