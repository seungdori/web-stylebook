import { useRef, useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';
import './PortedDuotoneBoldPage.css';

type Palette = {
  id: string;
  name: string;
  accent: string;
  ink: string;
  textOnAccent: string;
};

const PALETTES: Palette[] = [
  { id: 'acid',  name: 'ACID',  accent: '#c5ff00', ink: '#0a0a0a', textOnAccent: '#0a0a0a' },
  { id: 'heat',  name: 'HEAT',  accent: '#ff3b6b', ink: '#0e1230', textOnAccent: '#0e1230' },
  { id: 'tang',  name: 'TANG',  accent: '#ff7a18', ink: '#2a0e3f', textOnAccent: '#2a0e3f' },
  { id: 'paper', name: 'PAPER', accent: '#0c0c0c', ink: '#f6f1e7', textOnAccent: '#f6f1e7' },
];

export function PortedDuotoneBoldPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  const [activeId, setActiveId] = useState('acid');
  const palette = PALETTES.find(p => p.id === activeId) ?? PALETTES[0];

  const styleVars = {
    ['--accent' as string]: palette.accent,
    ['--ink' as string]: palette.ink,
    ['--on-accent' as string]: palette.textOnAccent,
  } as CSSProperties;

  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--duotone-bold" style={styleVars} data-palette={palette.id}>
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
        <main className="shell">
          <a className="skip-link" href="#main-content" data-i18n="skip">Skip to content</a>
          <nav className="site-nav" role="navigation" aria-label="Main navigation">
            <div className="site-nav__inner">
              <a className="site-nav__logo" href="/">Web Stylebook</a>
              <ul className="site-nav__links">
                <li><a href="/#styles" data-i18n="nav.styles">Styles</a></li>
                <li><a href="/pages/compare" data-i18n="nav.compare">Compare</a></li>
                <li><a href="/pages/color-system" data-i18n="nav.tips">Colors</a></li>
                <li><a href="/pages/prompt-workflow" data-i18n="nav.workflow">Workflow</a></li>
                <li><a href="/pages/prompt-tips" data-i18n="nav.more-tips">Tips</a></li>
              </ul>
              <div className="nav-actions">
                <button className="nav-burger" id="nav-burger" aria-label="Toggle menu" aria-expanded="false">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1={3} y1={6} x2={21} y2={6} />
                    <line x1={3} y1={12} x2={21} y2={12} />
                    <line x1={3} y1={18} x2={21} y2={18} />
                  </svg>
                </button>
                <div className="lang-dropdown" id="lang-dropdown">
                  <button className="lang-toggle" id="lang-toggle" data-i18n-aria="lang.toggle.aria" aria-label="Switch language">English</button>
                  <ul className="lang-menu" role="menu">
                    <li><button role="menuitem" data-lang-select="en">English</button></li>
                    <li><button role="menuitem" data-lang-select="ko">한국어</button></li>
                    <li><button role="menuitem" data-lang-select="ja">日本語</button></li>
                  </ul>
                </div>
                <button className="theme-toggle" id="global-theme-reset" aria-label="Reset Global Theme" data-color="Reset Global Theme" title="Reset Global Theme">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>

          {/* ═══════ PALETTE SWITCHER ═══════ */}
          <div className="palette-bar">
            <span className="palette-bar__label">PALETTE / 2-TONE ONLY</span>
            <div className="palette-bar__group" role="radiogroup" aria-label="Color palette">
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={p.id === activeId}
                  className={`palette-chip${p.id === activeId ? ' is-active' : ''}`}
                  onClick={() => setActiveId(p.id)}
                >
                  <span className="palette-chip__swatch" style={{ background: p.accent }} />
                  <span className="palette-chip__swatch" style={{ background: p.ink }} />
                  <span className="palette-chip__name">{p.name}</span>
                </button>
              ))}
            </div>
            <span className="palette-bar__hint" data-lang="en">⇡ click to recolor everything</span>
            <span className="palette-bar__hint" data-lang="ko" hidden>⇡ 클릭해서 전체 색을 바꿔보세요</span>
            <span className="palette-bar__hint" data-lang="ja" hidden>⇡ クリックで全色切替</span>
          </div>

          {/* ═══════ MAGAZINE MASTHEAD ═══════ */}
          <div className="masthead">
            <span className="masthead__brand">WEB · STYLEBOOK</span>
            <span className="masthead__chip">ISSUE 04</span>
            <span className="masthead__chip">VOL. 02</span>
            <span className="masthead__chip">SS · 25</span>
            <span className="masthead__rule" />
            <span className="masthead__price">$ 24</span>
            <span className="masthead__barcode" aria-hidden="true">▮▮▯▮▮▯▮▮▮▯▮▯▮▮▯▮</span>
          </div>

          {/* ═══════ COVER HERO ═══════ */}
          <section className="cover">
            <div className="cover__type">
              <span className="cover__kicker" data-lang="en">a study in</span>
              <span className="cover__kicker" data-lang="ko" hidden>두 가지 색을 위한</span>
              <span className="cover__kicker" data-lang="ja" hidden>2色をめぐる習作</span>
              <h1 className="cover__h1">
                <span className="cover__line">Bold</span>
                <span className="cover__line cover__line--alt">Two-</span>
                <span className="cover__line">Tone.</span>
              </h1>
              <p className="cover__lead" data-lang="en">
                Pick two hexes. Make the whole interface argue between them — type, photos, stickers,
                even the prompt at the bottom. No greys. No third color. No softening gradients.
              </p>
              <p className="cover__lead" data-lang="ko" hidden>
                헥스 두 개를 고릅니다. 타이포, 사진, 스티커, 페이지 하단의 프롬프트까지 — 인터페이스 전체를
                그 두 색끼리 부딪치게 합니다. 회색도, 세 번째 색도, 부드러운 그라데이션도 없습니다.
              </p>
              <p className="cover__lead" data-lang="ja" hidden>
                ヘックスを2つ選びます。タイポも写真もステッカーも、ページ下部のプロンプトまで — インターフェース全体を
                その2色だけでぶつけ合わせます。グレーなし。第3の色なし。ぼかしたグラデーションもなし。
              </p>
              <div className="cover__meta">
                <span>cover</span>
                <span className="cover__dot" />
                <span>spring</span>
                <span className="cover__dot" />
                <span>2025</span>
                <span className="cover__dot" />
                <span data-palette-name>{palette.name}</span>
              </div>
            </div>
            <div className="cover__art" aria-hidden="true">
              <div className="vinyl">
                <div className="vinyl__grooves" />
                <div className="vinyl__sleeve">
                  <span className="vinyl__sleeve-no">№ 04</span>
                  <span className="vinyl__sleeve-side">SIDE A · 33⅓</span>
                </div>
                <div className="vinyl__label">
                  <span>DUO</span>
                  <span>TONE</span>
                </div>
                <div className="vinyl__hole" />
              </div>
              <div className="sticker sticker--circle">
                <span>STRICTLY</span>
                <span className="sticker__big">2</span>
                <span>COLORS ONLY</span>
              </div>
              <div className="sticker sticker--stamp">SPECIMEN №24 / SPRING</div>
              <div className="halftone-blob halftone-blob--a" />
              <div className="halftone-blob halftone-blob--b" />
            </div>
          </section>

          {/* ═══════ MARQUEE ═══════ */}
          <div className="marquee" aria-hidden="true">
            <div className="marquee__track">
              <span>STRICTLY 2 COLORS</span><span className="marquee__star">✦</span>
              <span>EDITORIAL · BOLD · HALFTONE</span><span className="marquee__star">✦</span>
              <span>PRINT IN THE BROWSER</span><span className="marquee__star">✦</span>
              <span>NO GREYS</span><span className="marquee__star">✦</span>
              <span>STRICTLY 2 COLORS</span><span className="marquee__star">✦</span>
              <span>EDITORIAL · BOLD · HALFTONE</span><span className="marquee__star">✦</span>
              <span>PRINT IN THE BROWSER</span><span className="marquee__star">✦</span>
              <span>NO GREYS</span><span className="marquee__star">✦</span>
            </div>
          </div>

          {/* ═══════ LEAD BAND WITH GIANT NUMBER ═══════ */}
          <section className="lead-band">
            <div className="lead-band__num" aria-hidden="true">04</div>
            <div className="lead-band__body">
              <span className="lead-band__eyebrow">FROM THE EDITORS</span>
              <p className="lead-band__intro" data-lang="en">
                Duotone is the discipline of saying "no" to colors. We pick two hexes and let everything else —
                hierarchy, depth, photography — come from <em>scale, contrast, and halftone dots</em>.
              </p>
              <p className="lead-band__intro" data-lang="ko" hidden>
                Duotone은 색을 덜어내는 절제의 훈련입니다. 헥스 두 개만 고르고, 위계·깊이·사진 — 나머지는
                전부 <em>크기, 대비, 하프톤 점</em>으로 풀어냅니다.
              </p>
              <p className="lead-band__intro" data-lang="ja" hidden>
                デュオトーンは色に「ノー」と言う鍛錬です。ヘックスを2つ選んだら、階層も奥行きも写真も、あとは全て
                <em>スケール、コントラスト、ハーフトーンの点</em>で生み出します。
              </p>
              <ul className="lead-band__list">
                <li data-lang="en"><b>01 —</b> One accent. One ink. Nothing in between.</li>
                <li data-lang="ko" hidden><b>01 —</b> 포인트 색 하나, 잉크 하나. 그 사이는 비웁니다.</li>
                <li data-lang="ja" hidden><b>01 —</b> アクセント1つ。インク1つ。間には何もなし。</li>
                <li data-lang="en"><b>02 —</b> Halftone dots replace shadows.</li>
                <li data-lang="ko" hidden><b>02 —</b> 그림자 대신 하프톤 점을 씁니다.</li>
                <li data-lang="ja" hidden><b>02 —</b> 影はハーフトーンドットに置き換え。</li>
                <li data-lang="en"><b>03 —</b> Try the palettes above — the whole page recolors live.</li>
                <li data-lang="ko" hidden><b>03 —</b> 위 팔레트를 눌러보세요 — 페이지 전체 색이 실시간으로 바뀝니다.</li>
                <li data-lang="ja" hidden><b>03 —</b> 上のパレットを試してください — ページ全体の色がその場で切り替わります。</li>
              </ul>
            </div>
          </section>

          {/* ═══════ DUOTONE PHOTO LAB ═══════ */}
          <section className="photo-lab">
            <div className="section-eyebrow">
              <span className="section-eyebrow__num">01 / 04</span>
              <span className="section-eyebrow__rule" />
              <span data-lang="en">Photo Lab</span>
              <span data-lang="ko" hidden>포토 랩</span>
              <span data-lang="ja" hidden>フォトラボ</span>
            </div>
            <h2 className="photo-lab__h2" data-lang="en">Press a photograph through two inks.</h2>
            <h2 className="photo-lab__h2" data-lang="ko" hidden>사진을 두 가지 잉크로 눌러 찍어냅니다.</h2>
            <h2 className="photo-lab__h2" data-lang="ja" hidden>2色のインクで写真を刷る。</h2>
            <div className="photo-grid">
              <article className="photo-card">
                <div className="photo-card__img photo-card__img--portrait" aria-hidden="true">
                  <span className="photo-card__halftone" />
                </div>
                <div className="photo-card__meta">
                  <span className="photo-card__num">№ 01</span>
                  <span className="photo-card__caption" data-lang="en">Portrait, midfield</span>
                  <span className="photo-card__caption" data-lang="ko" hidden>인물, 중경</span>
                  <span className="photo-card__caption" data-lang="ja" hidden>人物, 中景</span>
                  <span className="photo-card__exposure">f/2.8 · 1/125</span>
                </div>
              </article>
              <article className="photo-card">
                <div className="photo-card__img photo-card__img--landscape" aria-hidden="true">
                  <span className="photo-card__halftone" />
                </div>
                <div className="photo-card__meta">
                  <span className="photo-card__num">№ 02</span>
                  <span className="photo-card__caption" data-lang="en">Tide line, dawn</span>
                  <span className="photo-card__caption" data-lang="ko" hidden>해안선, 새벽</span>
                  <span className="photo-card__caption" data-lang="ja" hidden>波打ち際, 夜明け</span>
                  <span className="photo-card__exposure">f/8 · 1/250</span>
                </div>
              </article>
              <article className="photo-card">
                <div className="photo-card__img photo-card__img--still" aria-hidden="true">
                  <span className="photo-card__halftone" />
                </div>
                <div className="photo-card__meta">
                  <span className="photo-card__num">№ 03</span>
                  <span className="photo-card__caption" data-lang="en">Cup &amp; saucer</span>
                  <span className="photo-card__caption" data-lang="ko" hidden>잔과 받침</span>
                  <span className="photo-card__caption" data-lang="ja" hidden>カップと受け皿</span>
                  <span className="photo-card__exposure">f/4 · 1/60</span>
                </div>
              </article>
            </div>
          </section>

          {/* ═══════ TYPE SPECIMEN ═══════ */}
          <section className="type-spectrum">
            <div className="section-eyebrow">
              <span className="section-eyebrow__num">02 / 04</span>
              <span className="section-eyebrow__rule" />
              <span data-lang="en">Type Specimen</span>
              <span data-lang="ko" hidden>타입 스페시먼</span>
              <span data-lang="ja" hidden>タイプサンプル</span>
            </div>
            <div className="type-spectrum__grid">
              <div className="type-spec">
                <span className="type-spec__tag">DISPLAY · W900</span>
                <span className="type-spec__sample type-spec__sample--display">Bold.</span>
              </div>
              <div className="type-spec">
                <span className="type-spec__tag">H1 · W900</span>
                <span className="type-spec__sample type-spec__sample--h1">Two-Tone</span>
              </div>
              <div className="type-spec">
                <span className="type-spec__tag">CAPS · W800</span>
                <span className="type-spec__sample type-spec__sample--caps">EDITORIAL</span>
              </div>
              <div className="type-spec">
                <span className="type-spec__tag">RUNNING · W500</span>
                <span className="type-spec__sample type-spec__sample--body">Set running text in the ink. Keep it tight. Halftone underneath.</span>
              </div>
            </div>
          </section>

          {/* ═══════ COLOR RECIPE ═══════ */}
          <section className="recipe">
            <div className="section-eyebrow">
              <span className="section-eyebrow__num">03 / 04</span>
              <span className="section-eyebrow__rule" />
              <span data-lang="en">Recipe</span>
              <span data-lang="ko" hidden>레시피</span>
              <span data-lang="ja" hidden>レシピ</span>
            </div>
            <div className="recipe-grid">
              <div className="recipe-cell recipe-cell--accent">
                <span className="recipe-cell__role">ACCENT</span>
                <span className="recipe-cell__hex">{palette.accent.toUpperCase()}</span>
                <span className="recipe-cell__name">{palette.name}</span>
              </div>
              <div className="recipe-cell recipe-cell--ink">
                <span className="recipe-cell__role">INK</span>
                <span className="recipe-cell__hex">{palette.ink.toUpperCase()}</span>
                <span className="recipe-cell__plus">+</span>
              </div>
            </div>
            <div className="recipe-formula">
              <span>1 accent</span><span>·</span>
              <span>1 ink</span><span>·</span>
              <span>halftone dots</span><span>·</span>
              <span>scale</span><span>·</span>
              <span data-lang="en">no third color</span>
              <span data-lang="ko" hidden>제3의 색 없음</span>
              <span data-lang="ja" hidden>第3色なし</span>
            </div>
          </section>

          {/* ═══════ STAMP STACK ═══════ */}
          <section className="stamp-row" aria-hidden="true">
            <div className="stamp stamp--diag">SPECIMEN №24</div>
            <div className="stamp stamp--box">PRINTED · IN · BROWSER</div>
            <div className="stamp stamp--circle-sm">
              <span>2 COLORS</span>
              <span>ONLY</span>
            </div>
            <div className="stamp stamp--barcode">|||||·||·||||·|·|||·||||||</div>
          </section>

          {/* ═══════ PROMPT (existing) ═══════ */}
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">{`Design an editorial landing page in Duotone Bold style — strictly two colors at any moment, no greys, no third color.

COLOR TOKENS:
--accent: #c5ff00   (swappable: #ff3b6b, #ff7a18, or invert to #0c0c0c)
--ink: #0a0a0a      (swappable: #0e1230, #2a0e3f, or invert to #f6f1e7)
--on-accent: var(--ink)
No other colors anywhere. Halftone dots (radial-gradient repeating background) stand in for shadows and tints.

TYPOGRAPHY:
Heading: "Plus Jakarta Sans" / "Space Grotesk" 900, tracking -0.04em
Body: "Plus Jakarta Sans" 500, tracking 0
Scale: clamp(3rem, 9vw, 8rem) for h1; oversized slab numerals at clamp(8rem, 16vw, 14rem) as ornament
Set lines to fight each other — break "Two-Tone." across 3 lines.

UI COMPONENTS:
- Palette switcher: 4 chips, each shows the accent + ink swatches; click swaps CSS vars across the page.
- Magazine masthead: brand · ISSUE / VOL / season chips · price · barcode glyphs.
- Cover hero: massive type column + art column with vinyl record (concentric circles, label hole), circular sticker stamp, halftone radial blobs.
- Marquee: scrolling caps strip, accent text on ink rule.
- Lead band: oversized "04" numeral as design element, body copy nested into it.
- Photo Lab: 3 cards. Each "photo" is CSS-only — two colors composed via overlapping radial / linear gradients to suggest a portrait, a horizon, a still life. Halftone dot overlay.
- Type Specimen: 4 rows showing Display / H1 / Caps / Body in the accent on ink.
- Recipe: 2 huge color swatches with hex codes, plus a recipe line.
- Stamp row: diagonal stamp, boxed stamp, circular stamp, barcode glyphs.

LAYOUT:
- Container: min(1180px, 92vw), 28px 0 120px
- Cover: 2 column grid, type 1.4fr / art 1fr, collapse below 900px
- Photo grid: 3 columns auto-fit minmax(220px, 1fr), gap 16px

MOTION:
- Marquee: 30s linear infinite translate
- Vinyl: 24s linear infinite rotation
- Sticker stamps: idle rotation only
- Halftone blobs: slow 18s drift
- All animations honor prefers-reduced-motion

FORBIDDEN:
- Any third color, including grey
- Soft / pastel / multi-stop gradients
- Drop shadows that are not halftone dots
- Thin font weights (minimum 700)
- Round corners above 4px on most elements (stamps / vinyl excepted)

OUTPUT:
1) CSS custom properties for --accent, --ink, --on-accent. Palette switcher mutates those vars.
2) Magazine layout with masthead + cover + marquee + photo lab + type specimen + recipe + stamps + prompt.
3) Halftone dots as background-image (radial-gradient repeating pattern, 12px tile).
4) All "photographs" composed from two-color CSS gradients.
5) Semantic HTML, responsive at 900px / 640px breakpoints.`}</pre>
            <pre data-lang="ko" hidden>{`Duotone Bold 스타일의 에디토리얼 랜딩 페이지를 디자인해줘 — 어떤 순간에도 단 두 색, 회색 금지, 세 번째 색 금지.

색상 토큰:
--accent: #c5ff00   (교체 가능: #ff3b6b, #ff7a18, 반전 #0c0c0c)
--ink: #0a0a0a      (교체 가능: #0e1230, #2a0e3f, 반전 #f6f1e7)
--on-accent: var(--ink)
다른 색은 어디에도 쓰지 않음. 그림자와 명암은 하프톤 점(radial-gradient 반복 배경)으로 대신함.

타이포그래피:
제목: "Plus Jakarta Sans" / "Space Grotesk" 900, 자간 -0.04em
본문: "Plus Jakarta Sans" 500, 자간 0
스케일: h1에 clamp(3rem, 9vw, 8rem); 장식용 슬랩 숫자는 clamp(8rem, 16vw, 14rem)
"Two-Tone."을 3줄로 부수듯 끊어 배치.

UI 컴포넌트:
- 팔레트 스위처: 칩 4개, 각각 액센트+잉크 스와치 표시. 클릭하면 페이지 전체 CSS 변수가 바뀜.
- 매거진 매스트헤드: 브랜드 · ISSUE/VOL/시즌 칩 · 가격 · 바코드 글리프.
- 커버 히어로: 거대한 타이포 컬럼 + 비닐 레코드(동심원, 라벨, 홀), 원형 스티커 스탬프, 하프톤 라디얼 블롭이 있는 아트 컬럼.
- 마키: 캡스 스크롤 스트립, 잉크 룰 위 액센트 텍스트.
- 리드 밴드: 초대형 "04" 숫자를 디자인 요소로 쓰고, 본문을 그 안에 끼워 넣음.
- 포토 랩: 카드 3개. "사진"은 CSS만 사용 — 두 색의 그라데이션을 겹쳐 인물·수평선·정물을 암시. 하프톤 오버레이.
- 타입 스페시먼: Display/H1/Caps/Body 4행, 액센트 색으로 잉크 위에 표시.
- 레시피: 거대한 색 스와치 2개와 헥스 코드, 레시피 라인.
- 스탬프 줄: 사선 스탬프, 박스 스탬프, 원형 스탬프, 바코드 글리프.

레이아웃:
- 컨테이너: min(1180px, 92vw), 28px 0 120px
- 커버: 2열, 타이포 1.4fr / 아트 1fr, 900px 이하에서 1열
- 포토 그리드: 3열 auto-fit minmax(220px, 1fr), gap 16px

모션:
- 마키: 30s linear infinite translate
- 비닐: 24s linear infinite 회전
- 스티커: 정지된 채 기울인 각도만 유지
- 하프톤 블롭: 18s 느린 드리프트
- 모든 애니메이션은 prefers-reduced-motion 설정을 따름

금지사항:
- 세 번째 색(회색 포함) 사용 금지
- 부드러운·파스텔·다단 그라데이션 금지
- 하프톤 점이 아닌 드롭 섀도 금지
- 얇은 폰트 굵기 금지 (최소 700)
- 4px 이상의 둥근 모서리 금지 (스탬프/비닐 예외)

출력:
1) --accent, --ink, --on-accent용 CSS 커스텀 프로퍼티. 팔레트 스위처가 이 변수를 바꿈.
2) masthead + cover + marquee + photo lab + type specimen + recipe + stamps + prompt로 구성된 매거진 레이아웃.
3) 하프톤 점을 배경 이미지로 사용 (12px 타일, radial-gradient 반복 패턴).
4) 모든 "사진"은 두 색 CSS 그라데이션으로 구성.
5) 시맨틱 HTML, 900px / 640px 반응형.`}</pre>
            <pre data-lang="ja" hidden>{`Duotone Boldスタイルのエディトリアルランディングページをデザインしてください — どの瞬間も2色のみ、グレーなし、第3色なし。

カラートークン:
--accent: #c5ff00   (切替可: #ff3b6b, #ff7a18, 反転 #0c0c0c)
--ink: #0a0a0a      (切替可: #0e1230, #2a0e3f, 反転 #f6f1e7)
--on-accent: var(--ink)
他の色は一切使用不可。影と濃淡はハーフトーンドット(radial-gradient反復背景)で表現。

タイポグラフィ:
見出し: "Plus Jakarta Sans" / "Space Grotesk" 900, 字間 -0.04em
本文: "Plus Jakarta Sans" 500, 字間 0
スケール: h1にclamp(3rem, 9vw, 8rem); 装飾用スラブ数字はclamp(8rem, 16vw, 14rem)
"Two-Tone."を3行に分けて配置。

UIコンポーネント:
- パレットスイッチャー: チップ4つ、それぞれアクセント+インクスウォッチ表示。クリックでページ全体のCSS変数が変わる。
- マガジンマストヘッド: ブランド · ISSUE/VOL/シーズンチップ · 価格 · バーコードグリフ。
- カバーヒーロー: 巨大タイポカラム + ビニールレコード(同心円、ラベル、ホール)、円形ステッカースタンプ、ハーフトーンラジアルブロブのあるアートカラム。
- マーキー: キャップススクロールストリップ、インクルール上のアクセントテキスト。
- リードバンド: デザイン要素としての超大型"04"数字、本文がその中にネスト。
- フォトラボ: カード3つ。"写真"はCSSのみ — 2色のグラデーション重ねで人物・水平線・静物を示唆。ハーフトーンオーバーレイ。
- タイプサンプル: Display/H1/Caps/Body 4行、アクセント色でインク上に表示。
- レシピ: 巨大カラースウォッチ2つとヘックスコード、レシピライン。
- スタンプ列: 斜めスタンプ、ボックススタンプ、サークルスタンプ、バーコードグリフ。

レイアウト:
- コンテナ: min(1180px, 92vw), 28px 0 120px
- カバー: 2列、タイポ 1.4fr / アート 1fr、900px以下で1列
- フォトグリッド: 3列 auto-fit minmax(220px, 1fr), gap 16px

モーション:
- マーキー: 30s linear infinite translate
- ビニール: 24s linear infinite 回転
- ステッカー: 傾き固定のみ(アニメーションなし)
- ハーフトーンブロブ: 18sゆっくりドリフト
- 全てprefers-reduced-motionを尊重

禁止事項:
- 第3色(グレー含む)使用禁止
- ソフト/パステル/多段グラデーション禁止
- ハーフトーンドット以外のドロップシャドウ禁止
- 細いフォントウェイト禁止(最低700)
- 4px以上の角丸禁止(スタンプ/ビニール除く)

出力:
1) --accent, --ink, --on-accent のCSSカスタムプロパティ。パレットスイッチャーがこれらを変更。
2) masthead + cover + marquee + photo lab + type specimen + recipe + stamps + promptで構成されるマガジンレイアウト。
3) 背景画像としてのハーフトーンドット(12pxタイル、radial-gradient反復パターン)。
4) 全ての"写真"は2色のCSSグラデーションで構成。
5) セマンティックHTML, 900px / 640px レスポンシブ。`}</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/mono-type.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Mono Type</span></a><div className="page-nav__divider" /><a href="/pages/mesh-gradient.html"><span><span className="page-nav__label">다음</span>Mesh Gradient</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
