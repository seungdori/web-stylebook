import type { CSSProperties } from 'react';
import type { Lang, StyleData } from '../data/styles';
import { localize, styleCatalog } from '../data/styles';
import { withLang } from '../utils/language';
import './HomeOpenings.css';

/* Three candidate openings for the home page.
 *
 * They differ in STRUCTURE, not in colour or wording: what organises the
 * screen, what owns more than half the frame, and where the eye lands first.
 * Each is built from the real catalogue so the paste test can actually be
 * applied — none of them would make sense on another product. */

const pick = (ids: string[]): StyleData[] =>
  ids.map((id) => styleCatalog.find((s) => s.id === id)).filter((s): s is StyleData => !!s);

const WALL = pick([
  'brutalist-grid', 'editorial-silence', 'terminal-core', 'kinetic-pop',
  'holographic-fluid', 'mono-type', 'swiss-poster', 'neumorphism',
  'runtime-signal', 'duotone-bold', 'quiet-utility', 'console-launch',
]);

const styleVars = (style: StyleData) => ({
  '--s-accent': style.accent,
  '--s-1': style.palette[0] ?? '#fff',
  '--s-2': style.palette[1] ?? '#eee',
  '--s-3': style.palette[2] ?? '#ccc',
  '--s-4': style.palette[3] ?? '#333',
} as CSSProperties);

/** A miniature of what the style actually looks like: its own palette
 *  driving a heading, a line of text and one control.
 *
 *  The name is deliberately NOT drawn inside the swatch — a palette can put
 *  its darkest value next to its darkest background, and the label would be
 *  the one unreadable thing on a page about legibility. Callers place it. */
function Specimen({ style, size = 'sm' }: { style: StyleData; size?: 'sm' | 'lg' }) {
  return (
    <span className="ho-specimen" data-size={size} style={styleVars(style)}>
      <b className="ho-specimen__head" />
      <i className="ho-specimen__line" />
      <i className="ho-specimen__line ho-specimen__line--short" />
      <em className="ho-specimen__cta" />
    </span>
  );
}

/* ---------------------------------------------------------------- *
 * A — Specimen wall. No hero block; the collection is the opening.
 * ---------------------------------------------------------------- */
function OpeningWall({ lang }: { lang: Lang }) {
  return (
    <div className="ho-wall">
      <div className="ho-wall__bar">
        <span className="ho-wall__count">48</span>
        <p>
          {localize({
            en: 'web design references you can read, compare, and hand to an AI as a prompt.',
            ko: '웹 디자인 레퍼런스를 읽고, 비교하고, AI에게 프롬프트로 넘길 수 있습니다.',
            ja: 'Webデザイン参照を読み、比較し、AIにプロンプトとして渡せます。',
          }, lang)}
        </p>
        <label className="ho-wall__search">
          <input type="search" placeholder={localize({ en: 'Search styles', ko: '스타일 검색', ja: 'スタイル検索' }, lang)} readOnly />
        </label>
      </div>
      <div className="ho-wall__grid">
        {WALL.map((style) => (
          <a key={style.id} href={withLang(style.route, lang)} className="ho-wall__cell">
            <Specimen style={style} />
            <span className="ho-wall__plate">{localize(style.name, lang)}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * B — Comparison bench. The compare mechanic, already running.
 * ---------------------------------------------------------------- */
function OpeningBench({ lang }: { lang: Lang }) {
  const [left, right] = pick(['editorial-silence', 'terminal-core']);
  return (
    <div className="ho-bench">
      <div className="ho-bench__stage">
        <div className="ho-bench__side">
          <Specimen style={left} size="lg" />
          <span className="ho-bench__tag">{localize(left.name, lang)}</span>
        </div>
        <div className="ho-bench__seam">
          <button type="button" aria-label="swap">⇄</button>
        </div>
        <div className="ho-bench__side">
          <Specimen style={right} size="lg" />
          <span className="ho-bench__tag">{localize(right.name, lang)}</span>
        </div>
      </div>
      <div className="ho-bench__copy">
        <h1>
          {localize({
            en: 'Two directions, side by side, before you commit to one.',
            ko: '하나를 고르기 전에, 두 방향을 나란히 놓고 봅니다.',
            ja: '一つに決める前に、二つの方向を並べて見ます。',
          }, lang)}
        </h1>
        <a className="ho-bench__cta" href={withLang('/pages/compare', lang)}>
          {localize({ en: 'Open the bench', ko: '비교대 열기', ja: '比較台を開く' }, lang)} →
        </a>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * C — Handoff. The artifact the product actually produces.
 * ---------------------------------------------------------------- */
function OpeningHandoff({ lang }: { lang: Lang }) {
  const [style] = pick(['runtime-signal']);
  return (
    <div className="ho-handoff">
      <div className="ho-handoff__in">
        <span className="ho-handoff__label">
          {localize({ en: 'Pick a direction', ko: '방향을 고르면', ja: '方向を選ぶと' }, lang)}
        </span>
        <Specimen style={style} size="lg" />
        <span className="ho-handoff__plate">{localize(style.name, lang)}</span>
      </div>
      <div className="ho-handoff__pipe" aria-hidden="true"><i /><b>→</b></div>
      <div className="ho-handoff__out">
        <span className="ho-handoff__label">
          {localize({ en: 'Hand this to the agent', ko: '이걸 그대로 넘깁니다', ja: 'これをそのまま渡します' }, lang)}
        </span>
        <pre className="ho-handoff__code">{`# design.md — ${localize(style.name, lang)}

surface   ${style.palette[0] ?? '#0b0b0d'}
text      ${style.palette[3] ?? '#f4f4f5'}
action    ${style.accent}

density   compact · data-first
motion    140ms ease-out, reduced-motion safe
states    empty · loading · partial · error`}</pre>
        <a className="ho-handoff__cta" href={withLang('/pages/prompt-workflow', lang)}>
          {localize({ en: 'See the full handoff', ko: '전체 인계 파일 보기', ja: '引き継ぎ全体を見る' }, lang)} →
        </a>
      </div>
    </div>
  );
}

const CANDIDATES = [
  {
    key: 'A',
    name: { en: 'Specimen wall', ko: '표본 벽', ja: '標本の壁' },
    device: {
      en: 'No hero block. The catalogue itself opens the page; one sentence and the search sit in a slim bar above it.',
      ko: '히어로 블록이 없습니다. 카탈로그가 곧 첫 화면이고, 한 문장과 검색만 얇은 띠에 올라갑니다.',
      ja: 'ヒーロー枠なし。カタログ自体が最初の画面で、一文と検索だけを細い帯に置きます。',
    },
    Render: OpeningWall,
  },
  {
    key: 'B',
    name: { en: 'Comparison bench', ko: '비교대', ja: '比較台' },
    device: {
      en: 'The compare mechanic runs in the frame: two styles already loaded, a swap control on the seam, headline underneath.',
      ko: '비교 기능이 화면 안에서 돌아갑니다. 스타일 둘이 이미 올라가 있고, 이음매에 교체 버튼, 헤드라인은 그 아래입니다.',
      ja: '比較機能が画面内で動きます。二つのスタイルが既に載り、継ぎ目に入替ボタン、見出しはその下です。',
    },
    Render: OpeningBench,
  },
  {
    key: 'C',
    name: { en: 'Handoff', ko: '인계', ja: '引き継ぎ' },
    device: {
      en: 'Input on the left, the produced design.md on the right, the pipe between them. The output is the hero.',
      ko: '왼쪽에 입력, 오른쪽에 만들어진 design.md, 그 사이를 잇는 관. 결과물이 곧 히어로입니다.',
      ja: '左に入力、右に生成されたdesign.md、その間をつなぐ管。成果物がヒーローです。',
    },
    Render: OpeningHandoff,
  },
] as const;

export function HomeOpenings({ lang }: { lang: Lang }) {
  return (
    <div className="ho-page">
      <header className="ho-page__head">
        <h1>{localize({ en: 'Home opening — candidates', ko: '홈 오프닝 후보', ja: 'ホーム冒頭の候補' }, lang)}</h1>
        <p>
          {localize({
            en: 'Three structurally different openings. Compare what organises the screen, what owns the frame, and where the eye lands.',
            ko: '구조가 서로 다른 오프닝 세 가지입니다. 무엇이 화면을 구성하는지, 무엇이 자리를 차지하는지, 시선이 어디에 먼저 닿는지를 비교하세요.',
            ja: '構造の異なる三つの冒頭です。何が画面を構成し、何が面積を占め、視線がどこに落ちるかを比べてください。',
          }, lang)}
        </p>
      </header>

      {CANDIDATES.map(({ key, name, device, Render }) => (
        <section className="ho-candidate" key={key}>
          <div className="ho-candidate__head">
            <span>{key}</span>
            <strong>{localize(name, lang)}</strong>
            <p>{localize(device, lang)}</p>
          </div>
          <div className="ho-candidate__stage">
            <Render lang={lang} />
          </div>
        </section>
      ))}
    </div>
  );
}
