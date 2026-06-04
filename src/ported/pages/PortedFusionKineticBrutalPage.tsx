import { useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang) => obj[lang];

const PALETTES = [
  { id: 'sun',    name: 'SUN',    bg: '#fff200', ink: '#0a0a0a', accent: '#ff2b1c' },
  { id: 'cobalt', name: 'COBALT', bg: '#1f5bbf', ink: '#ffffff', accent: '#ffea00' },
  { id: 'lime',   name: 'LIME',   bg: '#c5ff00', ink: '#0a0a0a', accent: '#ff2b1c' },
  { id: 'magenta',name: 'MAGENTA',bg: '#ff2b88', ink: '#0a0a0a', accent: '#ffea00' },
];

const COPY = {
  masthead: 'WEB · STYLEBOOK',
  issue: 'HANDBILL 07',
  fusion: 'KINETIC × BRUTAL',
  count: 'N°07 / 09',
  date: '2026 · 03',
  city: 'SEOUL',
  paletteLabel: { en: 'INK / 3 COLOURS', ko: '잉크 / 3색', ja: 'インク / 3色' },
  paletteHint: { en: '↑ click to recolour the poster', ko: '↑ 눌러서 포스터를 다시 인쇄', ja: '↑ ポスターを刷り直す' },
  kicker: { en: 'one night in', ko: '하룻밤의 ·', ja: '一夜の ·' },
  kickerWord: { en: 'concrete.', ko: '콘크리트.', ja: 'コンクリート。' },
  headEn: ['PRESS', 'HOLD', 'RELEASE'],
  headKo: ['누르고', '버티고', '풀어라'],
  headJa: ['押す', '保つ', '離す'],
  switchHint: {
    en: 'click any line — the colour follows',
    ko: '행을 누르면 색이 따라옵니다',
    ja: '行をクリックすると色が追う',
  },
  lede: {
    en: 'Pick three inks. Lay a thick rule. Let the headline almost fall over. Brutal grids hold kinetic typography in place — type that nearly leaves the page but never quite does.',
    ko: '잉크 셋. 두꺼운 룰 한 줄. 헤드라인은 거의 넘어질 듯하게. 브루탈리스트 그리드가 키네틱 타이포를 잡습니다 — 페이지를 떠날 듯하지만 끝내 떠나지 않는 활자.',
    ja: '3色のインク。太い罫線一本。見出しは倒れそうに。ブルータルなグリッドがキネティック・タイポを支える — ページを離れそうで、決して離れない文字。',
  },
  marquee: {
    en: ['ONE RUN ONLY', 'DOORS 20:30', 'EAR-PLUGS AT THE DOOR', 'NO OPENERS', 'CONCRETE HALL', 'CASH IS FASTER', 'ONE RUN ONLY'],
    ko: ['1회 공연', '도어 20:30', '입구에서 귀마개 제공', '오프닝 없음', '콘크리트 홀', '현금이 빠릅니다', '1회 공연'],
    ja: ['1回公演', '開場20:30', '入口で耳栓配布', 'オープナーなし', 'コンクリート・ホール', '現金が早い', '1回公演'],
  },
  setlistHeading: { en: 'SET LIST', ko: '셋 리스트', ja: 'セットリスト' },
  setlistTitle: { en: 'Sixty minutes, six tracks, one breath.', ko: '60분 · 6트랙 · 한 호흡.', ja: '60分・6曲・一息で。' },
  setlist: {
    en: [
      ['01', 'INTERIOR / NIGHT',     '0:00',  '6:14'],
      ['02', 'CONCRETE BREATH',      '6:14',  '4:32'],
      ['03', 'A ROOM WITH NO WALLS', '10:46', '7:08'],
      ['04', 'WIRE & RUST',          '17:54', '5:21'],
      ['05', 'HOLD / RELEASE',       '23:15', '9:44'],
      ['06', 'LEAVE THE LIGHTS ON',  '32:59', '12:01'],
    ],
    ko: [
      ['01', '실내 · 야간',         '0:00',  '6:14'],
      ['02', '콘크리트 호흡',       '6:14',  '4:32'],
      ['03', '벽 없는 방',          '10:46', '7:08'],
      ['04', '전선과 녹',           '17:54', '5:21'],
      ['05', '버티고 풀어라',       '23:15', '9:44'],
      ['06', '불은 켜둔 채로',      '32:59', '12:01'],
    ],
    ja: [
      ['01', '室内・夜',            '0:00',  '6:14'],
      ['02', 'コンクリートの呼吸',  '6:14',  '4:32'],
      ['03', '壁のない部屋',        '10:46', '7:08'],
      ['04', '電線と錆',            '17:54', '5:21'],
      ['05', '保って離す',          '23:15', '9:44'],
      ['06', '灯りはそのままで',    '32:59', '12:01'],
    ],
  },
  callsheetHeading: { en: 'CALL SHEET', ko: '콜 시트', ja: 'コール・シート' },
  callsheetTitle: { en: 'Everyone on time, or no one plays.', ko: '제 시간에. 아니면 연주 없음.', ja: '時間厳守。さもなくば演奏なし。' },
  callsheet: {
    en: [
      ['14:00', 'LOAD-IN',       'crew + backline'],
      ['16:30', 'SOUND CHECK',   'monitor mix locked at 17:30'],
      ['19:30', 'DOORS',         'ear-plugs at every door'],
      ['21:00', 'SHOW',          'opens cold, no announcement'],
      ['22:00', 'ENCORE',        'two tracks max'],
      ['22:30', 'STRIKE',        'venue empty by 23:30'],
    ],
    ko: [
      ['14:00', '로드 인',       '크루 + 백라인'],
      ['16:30', '사운드 체크',   '모니터 17:30 고정'],
      ['19:30', '도어 오픈',     '모든 출입구에 귀마개'],
      ['21:00', '쇼',            '인트로 없이 바로 시작'],
      ['22:00', '앵콜',          '최대 2곡'],
      ['22:30', '철수',          '23:30까지 비움'],
    ],
    ja: [
      ['14:00', 'ロードイン',     'クルー + バックライン'],
      ['16:30', 'サウンドチェック', 'モニター17:30で確定'],
      ['19:30', '開場',           '全入口で耳栓配布'],
      ['21:00', '本番',           'アナウンスなしで開始'],
      ['22:00', 'アンコール',     '最大2曲'],
      ['22:30', '撤収',           '23:30に完全退館'],
    ],
  },
  ticketsHeading: { en: 'TICKETS', ko: '티켓', ja: 'チケット' },
  ticketsTitle: { en: 'Three tiers. Cash is faster.', ko: '세 등급 · 현금이 빠릅니다.', ja: '3等級・現金が早い。' },
  tickets: {
    en: [
      { tier: '01', name: 'STANDING', price: '₩38,000', detail: 'unreserved · ear-plugs supplied' },
      { tier: '02', name: 'BALCONY', price: '₩52,000', detail: 'numbered · raised view' },
      { tier: '03', name: 'PATRON', price: '₩88,000', detail: 'numbered · poster signed' },
    ],
    ko: [
      { tier: '01', name: '스탠딩', price: '₩38,000', detail: '비지정 · 귀마개 제공' },
      { tier: '02', name: '발코니', price: '₩52,000', detail: '지정석 · 높은 시야' },
      { tier: '03', name: '패트런', price: '₩88,000', detail: '지정석 · 사인 포스터' },
    ],
    ja: [
      { tier: '01', name: 'スタンディング', price: '¥4,000', detail: '自由 · 耳栓配布' },
      { tier: '02', name: 'バルコニー', price: '¥5,400', detail: '指定 · 段差視界' },
      { tier: '03', name: 'パトロン', price: '¥9,200', detail: '指定 · サイン入りポスター' },
    ],
  },
  pullHeading: { en: 'HOUSE RULES', ko: '하우스 룰', ja: 'ハウス・ルール' },
  pullTitle: { en: 'On the night.', ko: '공연 당일.', ja: '公演当日。' },
  pull: {
    en: 'WE DO NOT PLAY OVER A LAPTOP. WE DO NOT BOOK AN OPENER WE WOULD NOT WATCH. WE START ON TIME. WE STOP ON TIME.',
    ko: '랩탑 위에서 연주하지 않는다. 보고 싶지 않은 오프닝은 부르지 않는다. 제 시간에 시작한다. 제 시간에 끝낸다.',
    ja: 'ラップトップの上では演奏しない。見たくないオープナーは呼ばない。時間に始め、時間に終える。',
  },
  pullAttr: { en: '— House rules, v04', ko: '— 하우스 룰, v04', ja: '— ハウス・ルール v04' },
  stampRow: {
    en: ['ONE RUN ONLY', 'NO OPENERS', 'START ON TIME', 'N°07 / 09'],
    ko: ['1회 공연', '오프닝 없음', '시간에 시작', 'N°07 / 09'],
    ja: ['1回公演', 'オープナーなし', '時間に始める', 'N°07 / 09'],
  },
} as const;

const promptEn = `Kinetic × Brutal — design a single-page CONCERT HANDBILL. The page IS the poster. 3 ink colours, thick rules, offset shadow, live palette switcher (click a swatch to reprint the whole poster).

CONTENT (concert-specific, no design-system filler):
1) Masthead with issue / fusion / city.
2) Click-to-recolour palette switcher.
3) Cover: 3-line Archivo Black headline (click any line to set the accent), reversed middle line rotated -2°, round AIR stamp rotated -12°.
4) Marquee ticker.
5) SET LIST — 6 tracks, monospace cue times (CUE chip, start, duration), thick black rules between rows.
6) CALL SHEET — production timeline on a black band (load-in / sound check / doors / show / encore / strike).
7) Tickets — 3 tier cards with perforation, accent-chip tier label.
8) HOUSE RULES manifesto on a black panel.
9) Stamps row.

TYPOGRAPHY: Archivo Black headline (clamp 3.4 / 12vw / 8 rem, -0.04em, line-height 0.84). Inter 500/700 body. JetBrains Mono for cue times & ticker.

FORBIDDEN: more than 3 ink colours; design-system filler (palette swatch grids, type specimens, recipe cells); soft shadows; rounded corners over 4 px (except AIR stamp).

MOTION: marquee 30 s only; otherwise static. Respect prefers-reduced-motion.`;
const promptKo = `Kinetic × Brutal — 한 페이지짜리 콘서트 핸드빌. 페이지 자체가 포스터. 3색 잉크 / 두꺼운 룰 / 오프셋 그림자 / 라이브 팔레트 스위처(스와치를 누르면 포스터 전체를 다시 인쇄).

컨텐츠(콘서트 전용, 디자인 시스템 채우기 금지):
1) 매스트헤드(이슈 · 퓨전 · 도시).
2) 누르면 색이 바뀌는 팔레트 스위처.
3) 커버: Archivo Black 3행 헤드라인(행을 누르면 포인트 색 지정), 중앙행 반전 -2°, 우상단 AIR 스탬프 -12°.
4) 마키 티커.
5) 셋 리스트 — 6트랙, 모노스페이스 큐 타임(CUE 칩 + 시작 + 길이), 행 사이 두꺼운 흑색 룰.
6) 콜 시트 — 제작 타임라인(로드인 / 사운드체크 / 도어 / 본공연 / 앵콜 / 철수)을 흑색 밴드 위에.
7) 티켓 — 등급 3종, 천공, 등급 라벨은 포인트 색 칩.
8) 하우스 룰 선언문(검은 패널 위에).
9) 스탬프 줄.

타이포: Archivo Black 헤드라인, Inter 500/700 본문, JetBrains Mono(큐 타임 · 티커).

금지: 잉크 4색 이상 / 팔레트 스와치 그리드 · 타입 스페시멘 · 레시피 셀 같은 디자인 시스템 채우기 / 부드러운 그림자 / 4px 초과 라디우스(AIR 스탬프 제외).

모션: 마키 30s만, 그 외 정지. prefers-reduced-motion 존중.`;
const promptJa = `Kinetic × Brutal — 1ページのコンサート・ハンドビル。ページそのものがポスター。3色インク・太罫線・オフセット影、ライブ・パレット切替(スウォッチをクリックすると刷り直し)。

コンテンツ(コンサート特化、デザインシステム的な埋め草は禁止):
1) マストヘッド(号・フュージョン・都市)。
2) クリックで色が変わるパレット切替。
3) カバー: Archivo Black 3行見出し(行クリックでアクセント)、中段反転-2°、右上AIRスタンプ-12°。
4) マーキー・ティッカー。
5) セットリスト — 6曲、モノスペースのキュータイム(CUEチップ + 開始 + 長さ)、行間に太い黒罫線。
6) コール・シート — 制作タイムライン(ロードイン / サウンドチェック / 開場 / 本番 / アンコール / 撤収)を黒帯に。
7) チケット — 3等級カード、ミシン目、等級ラベルはアクセント・チップ。
8) ハウス・ルール宣言(黒地)。
9) スタンプ列。

タイポ: Archivo Black見出し、Inter 500/700本文、JetBrains Mono(キュータイム・ティッカー)。

禁止: 4色超 / パレット・スウォッチ・グリッドやタイプ見本やレシピ・セルなどデザインシステム的な埋め草 / 柔らかい影 / 4px超の角丸(AIRスタンプ除く)。

モーション: マーキー30sのみ、それ以外なし。prefers-reduced-motion尊重。`;

export function PortedFusionKineticBrutalPage({ lang }: PortedStylePageProps) {
  const [paletteId, setPaletteId] = useState('sun');
  const [glowIdx, setGlowIdx] = useState(2);
  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];
  const lng = lang as Lang;
  const styleVars: CSSProperties = {
    ['--kb-bg' as string]: palette.bg,
    ['--kb-ink' as string]: palette.ink,
    ['--kb-accent' as string]: palette.accent,
  };
  const headWords = lng === 'ko' ? COPY.headKo : lng === 'ja' ? COPY.headJa : COPY.headEn;

  return (
    <FusionShell
      fusionId="fusion-kinetic-brutal"
      lang={lang}
      prev={{ href: '/pages/fusion-holo-glass.html', label: 'Holo × Glass' }}
      next={{ href: '/pages/fusion-cyber-console.html', label: 'Cyber × Console' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
    >
      <div className="kb-shell" style={styleVars} data-palette={palette.id}>
        <header className="kb-masthead">
          <span className="kb-masthead__brand">{COPY.masthead}</span>
          <span className="kb-masthead__chip">{COPY.issue}</span>
          <span className="kb-masthead__chip">{COPY.fusion}</span>
          <span className="kb-masthead__chip kb-masthead__chip--accent">{COPY.count}</span>
          <span className="kb-masthead__rule" />
          <span className="kb-masthead__city">{COPY.city} · {COPY.date}</span>
        </header>

        <div className="kb-palette">
          <span className="kb-palette__label">{L(COPY.paletteLabel, lng)}</span>
          <div className="kb-palette__chips" role="radiogroup">
            {PALETTES.map((p) => (
              <button key={p.id} type="button" role="radio" aria-checked={p.id === paletteId}
                className={`kb-palette__chip ${p.id === paletteId ? 'is-active' : ''}`} onClick={() => setPaletteId(p.id)}>
                <span className="kb-palette__swatch" style={{ background: p.bg }} />
                <span className="kb-palette__swatch" style={{ background: p.ink }} />
                <span className="kb-palette__swatch" style={{ background: p.accent }} />
                <span className="kb-palette__name">{p.name}</span>
              </button>
            ))}
          </div>
          <span className="kb-palette__hint">{L(COPY.paletteHint, lng)}</span>
        </div>

        <section className="kb-cover">
          <div className="kb-cover__col">
            <span className="kb-cover__kicker">{L(COPY.kicker, lng)} <em>{L(COPY.kickerWord, lng)}</em></span>
            <h1 className="kb-cover__h1">
              {headWords.map((w, i) => (
                <button key={i} type="button" className={`kb-cover__word kb-cover__word--${i} ${i === glowIdx ? 'is-accent' : ''}`} onClick={() => setGlowIdx(i)}>{w}</button>
              ))}
            </h1>
            <p className="kb-cover__switchHint">{L(COPY.switchHint, lng)}</p>
            <p className="kb-cover__lede">{L(COPY.lede, lng)}</p>
            <div className="kb-cover__meta"><span>FRI 21:00</span><span className="kb-cover__dot" /><span>HALL A</span><span className="kb-cover__dot" /><span>{palette.name}</span></div>
          </div>
          <div className="kb-cover__art" aria-hidden="true">
            <div className="kb-stamp-circle">
              <span>ON</span><strong>AIR</strong><span>N°07</span>
            </div>
          </div>
        </section>

        <div className="kb-marquee" aria-hidden="true">
          <div className="kb-marquee__track">
            {[...COPY.marquee[lng], ...COPY.marquee[lng]].map((w, i) => (<span key={i}>{w}<em>★</em></span>))}
          </div>
        </div>

        <section className="kb-setlist">
          <header className="kb-setlist__head">
            <span className="kb-setlist__eyebrow">{L(COPY.setlistHeading, lng)}</span>
            <h2 className="kb-setlist__title">{L(COPY.setlistTitle, lng)}</h2>
            <span className="kb-setlist__count">06 / 06</span>
          </header>
          <ol className="kb-setlist__rows">
            {COPY.setlist[lng].map(([no, title, start, dur]) => (
              <li key={no} className="kb-setlist__row">
                <span className="kb-setlist__no">{no}</span>
                <span className="kb-setlist__title-cell">{title}</span>
                <span className="kb-setlist__cue">CUE</span>
                <span className="kb-setlist__time">{start}</span>
                <span className="kb-setlist__dur">{dur}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="kb-callsheet">
          <header className="kb-callsheet__head">
            <span className="kb-callsheet__eyebrow">{L(COPY.callsheetHeading, lng)}</span>
            <h2 className="kb-callsheet__title">{L(COPY.callsheetTitle, lng)}</h2>
          </header>
          <ul className="kb-callsheet__rows">
            {COPY.callsheet[lng].map(([time, label, note]) => (
              <li key={time} className="kb-callsheet__row">
                <span className="kb-callsheet__time">{time}</span>
                <span className="kb-callsheet__label">{label}</span>
                <span className="kb-callsheet__note">{note}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="kb-section">
          <div className="kb-section-eyebrow"><span className="kb-section-eyebrow__num">{L(COPY.ticketsHeading, lng)}</span><span className="kb-section-eyebrow__rule" /></div>
          <h2 className="kb-section__h2">{L(COPY.ticketsTitle, lng)}</h2>
          <div className="kb-tickets">
            {COPY.tickets[lng].map((t) => (
              <article key={t.tier} className="kb-ticket">
                <span className="kb-ticket__tier">№ {t.tier}</span>
                <h3 className="kb-ticket__name">{t.name}</h3>
                <span className="kb-ticket__price">{t.price}</span>
                <span className="kb-ticket__perf" aria-hidden="true" />
                <span className="kb-ticket__detail">{t.detail}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="kb-section">
          <div className="kb-section-eyebrow"><span className="kb-section-eyebrow__num">{L(COPY.pullHeading, lng)}</span><span className="kb-section-eyebrow__rule" /></div>
          <h2 className="kb-section__h2">{L(COPY.pullTitle, lng)}</h2>
          <blockquote className="kb-pull">
            <p>{L(COPY.pull, lng)}</p>
            <cite>{L(COPY.pullAttr, lng)}</cite>
          </blockquote>
        </section>

        <section className="kb-stamps" aria-hidden="true">
          {COPY.stampRow[lng].map((s, i) => (<div key={s} className={`kb-stamp kb-stamp--${i}`}>{s}</div>))}
        </section>
      </div>
    </FusionShell>
  );
}
