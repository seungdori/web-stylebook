import { useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang) => obj[lang];

const PALETTES = [
  { id: 'amber',    name: 'AMBER',    accent: '#ffb45a', ink: '#f4ecd6', paper: '#0a0e08' },
  { id: 'emerald',  name: 'EMERALD',  accent: '#7aff9c', ink: '#e6f7e1', paper: '#070d09' },
  { id: 'sapphire', name: 'SAPPHIRE', accent: '#7ac9ff', ink: '#e1eef7', paper: '#070b10' },
  { id: 'crimson',  name: 'CRIMSON',  accent: '#ff6e6e', ink: '#f7e1e1', paper: '#0a0808' },
];

const COPY = {
  masthead: { en: 'WEB · STYLEBOOK', ko: 'WEB · STYLEBOOK', ja: 'WEB · STYLEBOOK' },
  issue: 'ISSUE 04',
  fusion: 'EDITORIAL × TERMINAL',
  count: 'N°04 / 09',
  date: '2026 · 03',
  shell: 'tail -f stylebook.md',
  paletteLabel: { en: 'PALETTE / SERIF INK + MONO ACCENT', ko: '팔레트 / 세리프 잉크 + 모노 액센트', ja: 'パレット / セリフインク + モノアクセント' },
  paletteHint: { en: '↑ click to recolour the issue', ko: '↑ 클릭으로 호의 색을 바꿔보세요', ja: '↑ クリックで号の色を切替' },
  kicker: { en: 'a long read in', ko: '두 컬럼의 읽기 ·', ja: '二段組のロングリード ·' },
  kickerWord: { en: 'two columns.', ko: '두 컬럼.', ja: '二段組。' },
  headEn: ['A document', 'is a', 'system.'],
  headKo: ['문서는', '곧', '시스템.'],
  headJa: ['文書は', 'すなわち', 'システム。'],
  switchHint: {
    en: 'click any word — the drop cap moves with it',
    ko: '단어를 누르면 드롭캡이 따라옵니다',
    ja: '単語をクリックするとドロップキャップが追う',
  },
  lede: {
    en: 'Editorial typography assumes attention; terminal typography assumes a process. Set the serif column for the reader, set a narrow mono lane for the build, and let them watch each other without raising voices.',
    ko: '에디토리얼은 집중을, 터미널은 과정을 전제합니다. 세리프 본문은 독자에게 내어 주고, 좁은 모노 차선은 빌드에 내어 주며, 둘이 목소리를 높이지 않은 채 서로를 지켜보게 둡니다.',
    ja: 'エディトリアルは集中を、ターミナルはプロセスを前提とする。セリフ段を読者に、モノの細い段をビルドに渡し、声を張らずに互いを見守らせる。',
  },
  marquee: {
    en: ['ONE RUST WORD', 'SERIF SETS THE RHYTHM', 'MONO ONLY ANNOTATES', 'NO ASCII ART', 'BUILD LOGS IN MARGINS', 'IOWAN + JETBRAINS', 'ONE RUST WORD'],
    ko: ['녹 단어 하나', '세리프가 리듬', '모노는 주해만', 'ASCII 아트 금지', '마진의 빌드 로그', 'Iowan + JetBrains', '녹 단어 하나'],
    ja: ['錆色は一語', 'セリフがリズム', 'モノは注釈のみ', 'ASCIIアート禁止', '余白にビルドログ', 'Iowan + JetBrains', '錆色は一語'],
  },
  leadEyebrow: { en: 'FROM THE EDITORS', ko: '편집자의 말', ja: '編集部より' },
  rules: {
    en: [
      ['§01', 'Never split a paragraph between two fonts. Marginalia is the mono\'s only allowed range.'],
      ['§02', 'One rust word per spread. The drop cap counts as that word.'],
      ['§03', 'Mono is for state and time, not for emphasis.'],
      ['§04', 'Footnotes are mono and dated; they age, and that is the point.'],
    ],
    ko: [
      ['§01', '한 단락 안에서 두 글꼴을 섞지 마라. 마지널리아만이 모노의 거처.'],
      ['§02', '한 스프레드에 녹 단어는 하나. 드롭캡이 그 한 단어를 차지한다.'],
      ['§03', '모노는 상태와 시간 — 강조용이 아니다.'],
      ['§04', '각주는 모노이고 날짜가 있다. 늙는 것이 본분이다.'],
    ],
    ja: [
      ['§01', '段落内で2書体を混在させない。傍注のみがモノの居場所。'],
      ['§02', '1見開きに錆語は1つ。ドロップキャップでその1語を消費する。'],
      ['§03', 'モノは状態と時間 — 強調のためのものではない。'],
      ['§04', '脚注はモノで日付がある。老いるのが役目。'],
    ],
  },
  spreadHeading: { en: '01 / 04 · Spread', ko: '01 / 04 · 펼침면', ja: '01 / 04 · 見開き' },
  spreadTitle: { en: 'A column reads itself.', ko: '한 컬럼이 스스로를 읽는다.', ja: '一段が自らを読む。' },
  spreadParas: {
    en: [
      'Editorial typography assumes attention. A reader sits with one column and waits for it to deliver. Terminal typography assumes a process: state changes line by line. The two seem opposed, but both belong to writers who refuse to perform.',
      'The fusion is not a code-block dressed up in serif. It is an article whose footnotes, build numbers, and runtime annotations live in a narrow column of monospace — exactly where a magazine would put marginalia.',
    ],
    ko: [
      '에디토리얼 타이포는 집중을 전제로 합니다. 독자는 단 하나의 컬럼 앞에 앉아 그것이 풀어내기를 기다립니다. 터미널 타이포는 과정을 전제로 합니다 — 줄 하나씩 상태가 변합니다. 둘은 대립으로 보이지만, 둘 다 *연기하지 않는 작가*의 자세에 속합니다.',
      '이 융합은 세리프 옷을 입힌 코드 블록이 아닙니다. 본문 옆의 좁은 모노 컬럼에 각주·빌드 번호·런타임 주해를 놓아 두는 것 — 잡지가 마지널리아를 두는 자리입니다.',
    ],
    ja: [
      'エディトリアルは集中を前提とします。読者は一段組の前に座り、語りが届くのを待つ。ターミナルはプロセス — 状態が一行ずつ書き換わる。両者は対立に見えるが、どちらも*演じない書き手*の姿勢に属する。',
      'この融合は、セリフを着せたコードブロックではない。本文の脇の細いモノ段にビルド番号や注釈を置く — 雑誌が傍注を置く場所と同じだ。',
    ],
  },
  margin: {
    en: [
      ['12:04', 'reader/idle · 0 events'],
      ['12:04', 'spec applied: editorial.terminal.v4'],
      ['12:05', 'serif sets the rhythm; mono only annotates.'],
      ['12:07', 'rule §2 reviewed — no exceptions in this issue.'],
      ['12:09', 'colour passes: ink, paper, one rust accent.'],
      ['12:14', 'figure 01 placed, captioned, signed.'],
      ['12:18', 'footnotes locked; build ready.'],
    ],
    ko: [
      ['12:04', 'reader/idle · 0 events'],
      ['12:04', '규약 적용: editorial.terminal.v4'],
      ['12:05', '세리프가 리듬, 모노가 주해.'],
      ['12:07', '규칙 §2 재검토 — 이번 호 예외 없음.'],
      ['12:09', '색은 잉크·종이·녹 한 점.'],
      ['12:14', '도판 01 배치, 캡션, 서명.'],
      ['12:18', '각주 확정, 빌드 준비.'],
    ],
    ja: [
      ['12:04', 'reader/idle · 0 events'],
      ['12:04', '仕様適用: editorial.terminal.v4'],
      ['12:05', 'セリフがリズム、モノが注釈。'],
      ['12:07', '規則 §2 再確認 — 今号は例外なし。'],
      ['12:09', '色はインクと紙、錆の一点のみ。'],
      ['12:14', '図01 を配置、キャプション、署名。'],
      ['12:18', '脚注確定、ビルド準備完了。'],
    ],
  },
  typeHeading: { en: '02 / 04 · Type', ko: '02 / 04 · 활자', ja: '02 / 04 · 書体' },
  typeTitle: { en: 'Serif body. Mono margin. One drop cap.', ko: '세리프 본문, 모노 마진, 드롭캡 하나.', ja: 'セリフ本文、モノ余白、ドロップキャップ1つ。' },
  typeRows: [
    { tag: 'DROP CAP · 3.4em', sample: { en: 'A', ko: '문', ja: 'A' }, kind: 'drop' as const },
    { tag: 'HEADLINE · Serif', sample: { en: 'A document is a system.', ko: '문서는 곧 시스템.', ja: '文書はすなわちシステム。' }, kind: 'h1' as const },
    { tag: 'BODY · Serif 1.05', sample: { en: 'Editorial typography assumes attention.', ko: '에디토리얼은 집중을 전제로 한다.', ja: 'エディトリアルは集中を前提とする。' }, kind: 'body' as const },
    { tag: 'MARGIN · Mono 0.78', sample: { en: '12:09 colour passes', ko: '12:09 색 적용', ja: '12:09 色適用' }, kind: 'mono' as const },
    { tag: 'FOOTNOTE · Mono 0.74', sample: { en: '³ build numbers age in public', ko: '³ 빌드 번호는 공개적으로 늙는다', ja: '³ ビルド番号は公開で老いる' }, kind: 'foot' as const },
  ],
  recipeHeading: { en: '03 / 04 · Recipe', ko: '03 / 04 · 레시피', ja: '03 / 04 · レシピ' },
  recipeTitle: { en: 'Paper + ink + one rust word.', ko: '종이 + 잉크 + 녹 단어 하나.', ja: '紙 + インク + 錆語1。' },
  recipeFormula: {
    en: ['warm paper', '·', 'one ink', '·', 'one rust word', '·', 'mono in margins'],
    ko: ['따뜻한 종이', '·', '잉크 하나', '·', '녹 단어 하나', '·', '마진에 모노'],
    ja: ['温かな紙', '·', 'インク1', '·', '錆語1', '·', '余白にモノ'],
  },
  pullHeading: { en: '04 / 04 · Pull quote', ko: '04 / 04 · 풀 인용', ja: '04 / 04 · 引用' },
  pullTitle: { en: 'A page that runs at the speed of attention.', ko: '주의의 속도로 돌아가는 페이지.', ja: '注意の速度で走るページ。' },
  pull: {
    en: '"A page is not a frame for content. A page is the slowest, most deliberate kind of interface — a piece of software that runs at the speed of attention."',
    ko: '"페이지는 내용의 액자가 아닙니다. 페이지는 가장 느리고 가장 의도된 인터페이스 — 주의의 속도로 동작하는 소프트웨어입니다."',
    ja: '「ページは内容のフレームではない。ページは最も遅く、最も意図的なインターフェース — 注意の速度で動くソフトウェアである。」',
  },
  pullAttr: { en: '— K. Ito, Issue 04', ko: '— 이토 K., 04호', ja: '— 伊藤 K.、04号' },
  stampRow: {
    en: ['SERIF + MONO', 'ONE RUST WORD', 'NO ASCII ART', 'N°04 / 09'],
    ko: ['세리프 + 모노', '녹 단어 하나', 'ASCII 금지', 'N°04 / 09'],
    ja: ['セリフ+モノ', '錆語は1', 'ASCII禁止', 'N°04 / 09'],
  },
  city: { en: 'SEOUL', ko: 'SEOUL', ja: 'SEOUL' },
} as const;

const promptEn = `Design a creative single-page editorial in Editorial × Terminal fusion: the page IS the spread that demonstrates the style — serif body + mono marginalia, one rust word per spread, with a click-anywhere drop cap.

TOKENS (live-swappable):
--accent (rust #a23829 / cobalt #1f5bbf / forest #1f6b3a / oxblood #7a1f1f)
--ink (#1a1916 etc.)
--paper (#f6f4ed etc.)

TYPOGRAPHY:
Body: Iowan Old Style 400 (or Noto Serif KR), 1.05rem, line-height 1.78. Drop cap 3.4em in --accent.
Margin: JetBrains Mono 400, 0.78rem.

SECTIONS:
1) Masthead — WEB · STYLEBOOK · ISSUE 04 · EDITORIAL × TERMINAL · N°04 / 09 · 2026·03 · tail -f stylebook.md.
2) Palette switcher — 4 accent chips that live-recolour the rust word, the marginalia time-tags, and the pull rule.
3) Cover hero — kicker "a long read in / two columns." → 3-word headline ("A document / is a / system.") where one word is the rust drop-cap target. Glow-Selector.
4) Art column — a serif specimen showing a giant first letter with a column-of-mono build log beside it.
5) Marquee — caps "ONE RUST WORD · SERIF SETS THE RHYTHM · MONO ONLY ANNOTATES · …".
6) Lead band — giant N°04 numeral + editorial intro + 4 rules.
7) Section 01 / Spread — 2-column article (serif body + mono marginalia with 7 timestamped rows; one row has a code chip).
8) Section 02 / Type — 5 rows showing Drop cap, Headline, Body, Margin, Footnote.
9) Section 03 / Recipe — 2 huge cells (paper + ink) with hex + recipe line.
10) Section 04 / Pull quote — italic Cormorant quote with 4 px rust left rule.
11) Stamp row — 4 stamps.

MOTION: marquee 36 s, otherwise static.

OUTPUT:
1) Tokens swapped by palette switcher.
2) Sections 1–11.
3) Mobile: 2-col article collapses with margin moving below; everything else stacks.`;

const promptKo = `Editorial × Terminal 퓨전 — 세리프 본문 + 모노 마지널리아 + 한 스프레드에 녹 단어 하나로, *그 결로 그 결을 가르치는* 매거진 한 면.

토큰(라이브):
--accent (rust #a23829 / cobalt #1f5bbf / forest #1f6b3a / oxblood #7a1f1f)
--ink / --paper (액센트에 매칭)

타이포: Iowan Old Style / Noto Serif KR 본문(1.05rem, 행간 1.78), 드롭캡 3.4em 액센트. 모노는 JetBrains 0.78rem.

섹션:
1) 매스트헤드 — Issue 04 · N°04 / 09 · tail -f stylebook.md.
2) 팔레트 스위처 — 4 색, 녹 단어와 시간 태그와 풀 인용 룰이 라이브로 색 교체.
3) 커버 히어로 — "a long read in / 두 컬럼." → 3단어 헤드라인 중 하나가 액센트.
4) 아트 컬럼 — 거대 드롭캡 + 옆에 모노 빌드 로그.
5) 마키 — 규칙 스크롤.
6) 리드 밴드 — 거대 N°04 + 인트로 + §01~§04.
7) 01 / Spread — 2열 article(세리프 본문 + 7행 마진).
8) 02 / Type — 5행 specimen.
9) 03 / Recipe — 종이 + 잉크 2셀 + 레시피.
10) 04 / Pull quote — 이탤릭 인용.
11) 스탬프 줄 4개.

모션: 마키 36s. 그 외 정지.`;

const promptJa = `Editorial × Terminalフュージョン — セリフ本文 + モノ傍注 + 1見開きに錆語1つ。スタイルそのものでスタイルを語る雑誌の一葉。

トークン(ライブ):
--accent (rust #a23829 / cobalt #1f5bbf / forest #1f6b3a / oxblood #7a1f1f)
--ink / --paper (アクセントに揃える)

タイポ: Iowan Old Style / Noto Serif KR 本文(1.05rem、line-height 1.78)、ドロップキャップ3.4emをアクセント色。モノはJetBrains 0.78rem。

セクション:
1) マストヘッド。 2) パレット切替(4色)。 3) カバー(3語の見出し、1語が錆色)。 4) アート(巨大ドロップキャップ + モノのビルドログ)。 5) マーキー。 6) リード(N°04 + §01〜§04)。 7) 01 / Spread(2段、傍注7行)。 8) 02 / Type(5行)。 9) 03 / Recipe。 10) 04 / Pull quote。 11) スタンプ列。

モーション: マーキー36s、それ以外なし。`;

export function PortedFusionEditorialTerminalPage({ lang }: PortedStylePageProps) {
  const [paletteId, setPaletteId] = useState('amber');
  const [glowIdx, setGlowIdx] = useState(0);
  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];
  const lng = lang as Lang;
  const styleVars: CSSProperties = {
    ['--et-accent-source' as string]: palette.accent,
    ['--et-accent' as string]: palette.accent,
    ['--et-ink' as string]: palette.ink,
    ['--et-paper' as string]: palette.paper,
  };
  const headWords = lng === 'ko' ? COPY.headKo : lng === 'ja' ? COPY.headJa : COPY.headEn;

  return (
    <FusionShell
      fusionId="fusion-editorial-terminal"
      lang={lang}
      prev={{ href: '/pages/fusion-bento-noir.html', label: 'Bento × Noir' }}
      next={{ href: '/pages/fusion-holo-glass.html', label: 'Holo × Glass' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
      colorModeToggle
      defaultColorMode="dark"
    >
      <div className="et-shell" style={styleVars} data-palette={palette.id}>
        <header className="et-masthead">
          <span className="et-masthead__pill"><b>●</b> stylebook.04</span>
          <span className="et-masthead__brand">{L(COPY.masthead, lng)}</span>
          <span className="et-masthead__chip">{COPY.issue}</span>
          <span className="et-masthead__chip">{COPY.fusion}</span>
          <span className="et-masthead__chip et-masthead__chip--accent">{COPY.count}</span>
          <span className="et-masthead__rule" />
          <span className="et-masthead__cmd"><b>$</b> {COPY.shell}<span className="et-term__cursor" /></span>
        </header>

        <div className="et-palette">
          <span className="et-palette__label">{L(COPY.paletteLabel, lng)}</span>
          <div className="et-palette__chips" role="radiogroup">
            {PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={p.id === paletteId}
                className={`et-palette__chip ${p.id === paletteId ? 'is-active' : ''}`}
                onClick={() => setPaletteId(p.id)}
              >
                <span className="et-palette__swatch" style={{ background: p.accent }} />
                <span className="et-palette__name">{p.name}</span>
              </button>
            ))}
          </div>
          <span className="et-palette__hint">{L(COPY.paletteHint, lng)}</span>
        </div>

        <section className="et-cover">
          <div className="et-cover__col">
            <span className="et-cover__kicker">{L(COPY.kicker, lng)} <em>{L(COPY.kickerWord, lng)}</em></span>
            <h1 className="et-cover__h1">
              {headWords.map((w, i) => (
                <button
                  key={i}
                  type="button"
                  className={`et-cover__word ${i === glowIdx ? 'is-accent' : ''}`}
                  onClick={() => setGlowIdx(i)}
                >{w}</button>
              ))}
            </h1>
            <p className="et-cover__switchHint">{L(COPY.switchHint, lng)}</p>
            <p className="et-cover__lede">{L(COPY.lede, lng)}</p>
            <div className="et-cover__meta">
              <span>cover</span><span className="et-cover__dot" />
              <span>spring 2026</span><span className="et-cover__dot" />
              <span>{palette.name}</span>
            </div>
          </div>
          <aside className="et-cover__spec" aria-hidden="true">
            <div className="et-cover__spec-grid">
              <span className="et-cover__spec-corner et-cover__spec-corner--tl">┌</span>
              <span className="et-cover__spec-corner et-cover__spec-corner--tr">┐</span>
              <span className="et-cover__spec-corner et-cover__spec-corner--bl">└</span>
              <span className="et-cover__spec-corner et-cover__spec-corner--br">┘</span>
              <div className="et-cover__cap">
                {lng === 'ko' ? '문' : 'A'}
                <span className="et-term__cursor et-cover__cap-cursor" />
              </div>
            </div>
            <dl className="et-cover__spec-meta">
              <div><dt>family</dt><dd>iowan old style</dd></div>
              <div><dt>weight</dt><dd>500 · regular</dd></div>
              <div><dt>cap-em</dt><dd>9.2em · drop</dd></div>
              <div><dt>phosphor</dt><dd className="is-accent">{palette.name.toLowerCase()} · {palette.accent}</dd></div>
              <div><dt>state</dt><dd className="is-accent"><b className="et-term__pulse" /> rendering · 24fps</dd></div>
            </dl>
          </aside>
        </section>

        <div className="et-marquee" aria-hidden="true">
          <span className="et-marquee__tag">tail -f</span>
          <div className="et-marquee__track">
            {[...COPY.marquee[lng], ...COPY.marquee[lng]].map((w, i) => (
              <span key={i}>{w}<em>›</em></span>
            ))}
          </div>
        </div>

        <section className="et-lead">
          <div className="et-lead__num-col" aria-hidden="true">
            <span className="et-lead__num-label">ISSUE</span>
            <div className="et-lead__num">N°04</div>
            <span className="et-lead__num-rule" />
            <span className="et-lead__num-cmd">man stylebook.04</span>
          </div>
          <div className="et-lead__body">
            <span className="et-lead__eyebrow">{L(COPY.leadEyebrow, lng)}</span>
            <p className="et-lead__intro">{L(COPY.lede, lng)}</p>
            <ul className="et-lead__list">
              {COPY.rules[lng].map(([sym, body]) => (
                <li key={sym}><b>{sym}</b><span>{body}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <div className="et-cmd" aria-hidden="true">
          <span className="et-cmd__prompt">$</span>
          <span className="et-cmd__text">render --section 01 --kind spread --columns 2 stylebook.04.md</span>
          <span className="et-cmd__sep">::</span>
          <span className="et-cmd__ok">ok</span>
        </div>
        <section className="et-section">
          <div className="et-section-eyebrow">
            <span className="et-section-eyebrow__index">01</span>
            <span className="et-section-eyebrow__sep">/</span>
            <span className="et-section-eyebrow__total">04</span>
            <span className="et-section-eyebrow__rule" />
            <span className="et-section-eyebrow__label">{lng === 'ko' ? '펼침면 · SPREAD' : lng === 'ja' ? '見開き · SPREAD' : 'Spread'}</span>
          </div>
          <h2 className="et-section__h2">{L(COPY.spreadTitle, lng)}</h2>
          <article className="et-article">
            <div className="et-article__body">
              {COPY.spreadParas[lng].map((p, i) => (
                <p key={i} data-line={String(i * 7 + 24).padStart(3, '0')}>{p}</p>
              ))}
            </div>
            <aside className="et-article__margin" aria-hidden="true">
              <header className="et-article__margin-head">
                <span className="et-article__margin-mark">// runtime</span>
                <span className="et-article__margin-dot" />
              </header>
              {COPY.margin[lng].map(([t, b], i) => (
                <div key={i}>
                  <span className="et-article__margin-prompt">›</span>
                  <time>{t}</time>
                  <span>{b}</span>
                </div>
              ))}
              <div className="et-article__margin-cursor">
                <span className="et-article__margin-prompt">›</span>
                <span className="et-term__cursor" />
              </div>
            </aside>
          </article>
          <footer className="et-vim" aria-hidden="true">
            <span className="et-vim__mode">-- READING --</span>
            <span>stylebook.04.md</span>
            <span className="et-vim__spacer" />
            <span>spread · 67% · {lng}</span>
            <span>ln 47 · col 8</span>
          </footer>
        </section>

        <div className="et-cmd" aria-hidden="true">
          <span className="et-cmd__prompt">$</span>
          <span className="et-cmd__text">specimen --family iowan --size em --rows 5 type.txt</span>
          <span className="et-cmd__sep">::</span>
          <span className="et-cmd__ok">ok</span>
        </div>
        <section className="et-section">
          <div className="et-section-eyebrow">
            <span className="et-section-eyebrow__index">02</span>
            <span className="et-section-eyebrow__sep">/</span>
            <span className="et-section-eyebrow__total">04</span>
            <span className="et-section-eyebrow__rule" />
            <span className="et-section-eyebrow__label">{lng === 'ko' ? '활자 · TYPE' : lng === 'ja' ? '書体 · TYPE' : 'Type'}</span>
          </div>
          <h2 className="et-section__h2">{L(COPY.typeTitle, lng)}</h2>
          <ol className="et-type">
            {COPY.typeRows.map((r, i) => (
              <li key={r.tag}>
                <span className="et-type__row-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="et-type__tag">{r.tag}</span>
                <span className={`et-type__sample et-type__sample--${r.kind}`}>{L(r.sample, lng)}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="et-cmd" aria-hidden="true">
          <span className="et-cmd__prompt">$</span>
          <span className="et-cmd__text">mix --paper crt --phosphor {palette.name.toLowerCase()} --layer 1</span>
          <span className="et-cmd__sep">::</span>
          <span className="et-cmd__ok">ok</span>
        </div>
        <section className="et-section">
          <div className="et-section-eyebrow">
            <span className="et-section-eyebrow__index">03</span>
            <span className="et-section-eyebrow__sep">/</span>
            <span className="et-section-eyebrow__total">04</span>
            <span className="et-section-eyebrow__rule" />
            <span className="et-section-eyebrow__label">{lng === 'ko' ? '레시피 · RECIPE' : lng === 'ja' ? 'レシピ · RECIPE' : 'Recipe'}</span>
          </div>
          <h2 className="et-section__h2">{L(COPY.recipeTitle, lng)}</h2>
          <div className="et-recipe">
            <div className="et-recipe__cell et-recipe__cell--paper">
              <span className="et-recipe__role">// crt-paper</span>
              <span className="et-recipe__hex">{palette.paper.toUpperCase()}</span>
              <span className="et-recipe__bar et-recipe__bar--paper" />
              <span className="et-recipe__note">phosphor · 1985 · matte</span>
            </div>
            <div className="et-recipe__plus" aria-hidden="true">+</div>
            <div className="et-recipe__cell et-recipe__cell--ink">
              <span className="et-recipe__role" style={{ color: palette.accent }}>// {palette.name.toLowerCase()}-glow</span>
              <span className="et-recipe__hex" style={{ color: palette.accent }}>{palette.accent.toUpperCase()}</span>
              <span className="et-recipe__bar et-recipe__bar--ink" style={{ background: palette.accent, boxShadow: `0 0 24px ${palette.accent}` }} />
              <span className="et-recipe__note">cap · accent · cursor</span>
            </div>
          </div>
          <div className="et-recipe__formula">
            <span className="et-recipe__formula-prompt">$</span>
            <span className="et-recipe__formula-cmd">echo</span>
            {COPY.recipeFormula[lng].map((p, i) => <span key={i}>{p}</span>)}
          </div>
        </section>

        <div className="et-cmd" aria-hidden="true">
          <span className="et-cmd__prompt">$</span>
          <span className="et-cmd__text">quote --frame phosphor --italic on quote.txt</span>
          <span className="et-cmd__sep">::</span>
          <span className="et-cmd__ok">ok</span>
        </div>
        <section className="et-section">
          <div className="et-section-eyebrow">
            <span className="et-section-eyebrow__index">04</span>
            <span className="et-section-eyebrow__sep">/</span>
            <span className="et-section-eyebrow__total">04</span>
            <span className="et-section-eyebrow__rule" />
            <span className="et-section-eyebrow__label">{lng === 'ko' ? '풀 인용 · PULL' : lng === 'ja' ? '引用 · PULL' : 'Pull quote'}</span>
          </div>
          <h2 className="et-section__h2">{L(COPY.pullTitle, lng)}</h2>
          <blockquote className="et-pull">
            <span className="et-pull__bracket et-pull__bracket--open" aria-hidden="true">「</span>
            <p>{L(COPY.pull, lng)}</p>
            <span className="et-pull__bracket et-pull__bracket--close" aria-hidden="true">」</span>
            <cite>{L(COPY.pullAttr, lng)}</cite>
          </blockquote>
        </section>

        <section className="et-stamps" aria-hidden="true">
          {COPY.stampRow[lng].map((s, i) => (
            <div key={s} className={`et-stamp et-stamp--${i}`}>
              <b className="et-stamp__dot" />
              <span>{s}</span>
            </div>
          ))}
        </section>

        <footer className="et-process" aria-hidden="true">
          <div className="et-process__line">
            <span className="et-process__prompt">$</span>
            <span>build · stylebook.04 · ok</span>
            <span className="et-process__spacer" />
            <span>17 frames · 4 sections · 1 rust word</span>
          </div>
          <div className="et-process__line et-process__line--final">
            <span className="et-process__prompt">$</span>
            <span className="et-term__cursor" />
          </div>
        </footer>
      </div>
    </FusionShell>
  );
}
