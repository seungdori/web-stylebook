import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedEarthAtelierPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--earth-atelier">
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
        <main className="page">
          <a className="skip-link" href="#main-content" data-i18n="skip">Skip to content</a>
          <nav className="site-nav" role="navigation" aria-label="Main navigation">
            <div className="site-nav__inner">
              <a className="site-nav__logo" href="/">Web Stylebook</a>
              <ul className="site-nav__links">
                <li><a href="/#styles" data-i18n="nav.styles">스타일</a></li>
                <li><a href="/pages/compare" data-i18n="nav.compare">스타일 비교</a></li>
                <li><a href="/pages/color-system" data-i18n="nav.tips">색상 조합</a></li>
                <li><a href="/pages/prompt-workflow" data-i18n="nav.workflow">프롬프트 생성기</a></li>
                <li><a href="/pages/prompt-tips" data-i18n="nav.more-tips">팁</a></li>
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
          {/* ═══ EARTH ATELIER ═══ */}
          <section className="atelier">
            {/* Hero */}
            <div className="hero">
              <div className="hero__mark" aria-hidden="true">
                <span className="hero__mark-line hero__mark-line--accent">Atelier</span>
                <span className="hero__mark-line">Specimen · N° IX</span>
                <span className="hero__mark-line">MMXXVI</span>
                <svg className="hero__sprig" viewBox="0 0 80 24">
                  <path d="M40 2 L40 22" />
                  <path d="M40 7 Q30 7 22 4" />
                  <path d="M40 12 Q28 12 18 8" />
                  <path d="M40 17 Q30 17 24 14" />
                  <path d="M40 7 Q50 7 58 4" />
                  <path d="M40 12 Q52 12 62 8" />
                  <path d="M40 17 Q50 17 56 14" />
                </svg>
              </div>
              <span className="hero__eyebrow" data-lang="en">Earth Atelier</span>
              <span className="hero__eyebrow" data-lang="ko" hidden>Earth Atelier</span>
              <span className="hero__eyebrow" data-lang="ja" hidden>Earth Atelier</span>
              <h1 className="hero__title" data-lang="en">Natural textures,<br />quiet contrast</h1>
              <h1 className="hero__title" data-lang="ko" hidden>자연의 질감,<br />조용한 대비</h1>
              <h1 className="hero__title" data-lang="ja" hidden>自然の質感、<br />静かなコントラスト</h1>
              <p className="hero__lead" data-lang="en">An emotive yet readable interface through warm neutrals, low-brightness text, and restrained organic form. Every detail drawn from earth.</p>
              <p className="hero__lead" data-lang="ko" hidden>따뜻한 중성색과 낮은 명도의 글자, 절제된 유기적 형태로 감성과 가독성을 함께 살린 인터페이스입니다. 모든 디테일이 자연에서 비롯됩니다.</p>
              <p className="hero__lead" data-lang="ja" hidden>温かなニュートラルカラー、明度を抑えた文字、控えめな有機的フォルム。感性に訴えながらも読みやすいインターフェースです。ディテールはすべて自然から。</p>
              <div className="hero__meta">
                <span data-lang="en">Earth Studies</span>
                <span data-lang="ko" hidden>흙의 연구</span>
                <span data-lang="ja" hidden>土の研究</span>
                <span>SS · MMXXVI</span>
                <span>Specimen N° IX</span>
              </div>
            </div>
            {/* Folio TOC */}
            <nav className="folio" aria-label="Atelier index">
              <ol className="folio__list" data-lang="en">
                <li><span className="folio__num">I</span><span className="folio__name">Philosophy</span></li>
                <li><span className="folio__num">II</span><span className="folio__name">Material Palette</span></li>
                <li><span className="folio__num">III</span><span className="folio__name">Composition</span></li>
                <li><span className="folio__num">IV</span><span className="folio__name">Principles</span></li>
                <li><span className="folio__num">V</span><span className="folio__name">Typography</span></li>
              </ol>
              <ol className="folio__list" data-lang="ko" hidden>
                <li><span className="folio__num">I</span><span className="folio__name">철학</span></li>
                <li><span className="folio__num">II</span><span className="folio__name">소재 팔레트</span></li>
                <li><span className="folio__num">III</span><span className="folio__name">배합</span></li>
                <li><span className="folio__num">IV</span><span className="folio__name">원칙</span></li>
                <li><span className="folio__num">V</span><span className="folio__name">타이포그래피</span></li>
              </ol>
              <ol className="folio__list" data-lang="ja" hidden>
                <li><span className="folio__num">I</span><span className="folio__name">哲学</span></li>
                <li><span className="folio__num">II</span><span className="folio__name">素材パレット</span></li>
                <li><span className="folio__num">III</span><span className="folio__name">調合</span></li>
                <li><span className="folio__num">IV</span><span className="folio__name">原則</span></li>
                <li><span className="folio__num">V</span><span className="folio__name">タイポグラフィ</span></li>
              </ol>
            </nav>
            {/* Two-column Intro */}
            <div className="intro">
              <div className="intro__text">
                <span className="section-label" data-lang="en">I — Philosophy</span>
                <span className="section-label" data-lang="ko" hidden>I — 철학</span>
                <span className="section-label" data-lang="ja" hidden>I — 哲学</span>
                <p data-lang="en">A design language rooted in the imperfection of natural materials. Where digital interfaces often feel sterile, Earth Atelier introduces warmth through carefully chosen earth tones and generous breathing room between elements.</p>
                <p data-lang="ko" hidden>자연 소재의 불완전함에 뿌리를 둔 디자인 언어입니다. 디지털 인터페이스는 차갑게 느껴지기 쉽지만, Earth Atelier는 신중하게 고른 어스 톤과 요소 사이의 넉넉한 여백으로 따뜻함을 더합니다.</p>
                <p data-lang="ja" hidden>自然素材の不完全さに根ざしたデザイン言語です。デジタルインターフェースは無機質になりがちですが、Earth Atelier は丁寧に選んだアースカラーと要素間のゆとりある余白で温もりを添えます。</p>
              </div>
              <div className="intro__meta" data-lang="en">
                Palette: Earth<br />
                Contrast: Low<br />
                Radius: Organic<br />
                Motion: Slow<br />
                Typography: Serif + Sans
              </div>
              <div className="intro__meta" data-lang="ko" hidden>
                팔레트: 어스 톤<br />
                대비: 낮음<br />
                곡률: 유기적<br />
                모션: 느림<br />
                서체: 세리프 + 산스
              </div>
              <div className="intro__meta" data-lang="ja" hidden>
                パレット: アース<br />
                コントラスト: 低<br />
                曲率: 有機的<br />
                モーション: 遅い<br />
                書体: セリフ + サンセリフ
              </div>
            </div>
            {/* Material Palette */}
            <div className="palette">
              <span className="section-label" data-lang="en">II — Material Palette</span>
              <span className="section-label" data-lang="ko" hidden>II — 소재 팔레트</span>
              <span className="section-label" data-lang="ja" hidden>II — 素材パレット</span>
              <div className="palette__row">
                <div className="palette__swatch">
                  <div className="palette__color" style={{background: 'var(--sand)'}} />
                  <div className="palette__info">
                    <span className="palette__code">N° 01 · Dunes</span>
                    <span className="palette__name">Sand</span>
                    <span className="palette__hex">#efe6d6</span>
                    <span className="palette__origin" data-lang="en">Untreated linen · Southern dunes</span>
                    <span className="palette__origin" data-lang="ko" hidden>정련하지 않은 리넨 · 남쪽 사구</span>
                    <span className="palette__origin" data-lang="ja" hidden>未晒しのリネン · 南の砂丘</span>
                  </div>
                </div>
                <div className="palette__swatch">
                  <div className="palette__color" style={{background: 'var(--clay)'}} />
                  <div className="palette__info">
                    <span className="palette__code">N° 02 · Terra</span>
                    <span className="palette__name">Clay</span>
                    <span className="palette__hex">#ab6b49</span>
                    <span className="palette__origin" data-lang="en">Wet earth · After rainfall</span>
                    <span className="palette__origin" data-lang="ko" hidden>젖은 흙 · 비가 그친 자리</span>
                    <span className="palette__origin" data-lang="ja" hidden>湿った土 · 雨上がりに</span>
                  </div>
                </div>
                <div className="palette__swatch">
                  <div className="palette__color" style={{background: 'var(--leaf)'}} />
                  <div className="palette__info">
                    <span className="palette__code">N° 03 · Verde</span>
                    <span className="palette__name">Leaf</span>
                    <span className="palette__hex">#5f6a47</span>
                    <span className="palette__origin" data-lang="en">Olive grove · Mid-afternoon</span>
                    <span className="palette__origin" data-lang="ko" hidden>올리브 숲 · 오후의 빛</span>
                    <span className="palette__origin" data-lang="ja" hidden>オリーブの森 · 午後の光</span>
                  </div>
                </div>
                <div className="palette__swatch">
                  <div className="palette__color" style={{background: 'var(--ink)'}} />
                  <div className="palette__info">
                    <span className="palette__code">N° 04 · Noir</span>
                    <span className="palette__name">Ink</span>
                    <span className="palette__hex">#2e2a24</span>
                    <span className="palette__origin" data-lang="en">Aged iron · Marginalia</span>
                    <span className="palette__origin" data-lang="ko" hidden>산화된 철 · 여백의 글씨</span>
                    <span className="palette__origin" data-lang="ja" hidden>酸化した鉄 · 余白の文字</span>
                  </div>
                </div>
                <div className="palette__swatch">
                  <div className="palette__color" style={{background: 'var(--paper)', border: '1px solid rgba(46,42,36,0.1)'}} />
                  <div className="palette__info">
                    <span className="palette__code">N° 05 · Linen</span>
                    <span className="palette__name">Paper</span>
                    <span className="palette__hex">#faf6ee</span>
                    <span className="palette__origin" data-lang="en">Hand-pressed · Cotton fibre</span>
                    <span className="palette__origin" data-lang="ko" hidden>수공 압착 · 면 섬유</span>
                    <span className="palette__origin" data-lang="ja" hidden>手漉き · 綿繊維</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Composition */}
            <div className="composition">
              <span className="section-label" data-lang="en">III — Composition</span>
              <span className="section-label" data-lang="ko" hidden>III — 배합</span>
              <span className="section-label" data-lang="ja" hidden>III — 調合</span>
              <p className="composition__lede" data-lang="en">By volume — the recipe of a quiet interface.</p>
              <p className="composition__lede" data-lang="ko" hidden>용량 기준 — 조용한 인터페이스를 위한 배합.</p>
              <p className="composition__lede" data-lang="ja" hidden>容量基準 — 静かなインターフェースの調合。</p>
              <div className="composition__bar" role="img" aria-label="Paper 42, Sand 24, Ink 18, Leaf 9, Clay 7">
                <span className="composition__seg" style={{background: 'var(--paper)', flexGrow: 42}} />
                <span className="composition__seg" style={{background: 'var(--sand)', flexGrow: 24}} />
                <span className="composition__seg" style={{background: 'var(--ink)', flexGrow: 18}} />
                <span className="composition__seg" style={{background: 'var(--leaf)', flexGrow: 9}} />
                <span className="composition__seg" style={{background: 'var(--clay)', flexGrow: 7}} />
              </div>
              <ul className="composition__legend">
                <li>
                  <span className="composition__dot" style={{background: 'var(--paper)', border: '1px solid var(--line)'}} />
                  <span className="composition__legend-code">N° 05</span>
                  <span className="composition__legend-name">Paper</span>
                  <span className="composition__legend-pct">42<small>%</small></span>
                </li>
                <li>
                  <span className="composition__dot" style={{background: 'var(--sand)'}} />
                  <span className="composition__legend-code">N° 01</span>
                  <span className="composition__legend-name">Sand</span>
                  <span className="composition__legend-pct">24<small>%</small></span>
                </li>
                <li>
                  <span className="composition__dot" style={{background: 'var(--ink)'}} />
                  <span className="composition__legend-code">N° 04</span>
                  <span className="composition__legend-name">Ink</span>
                  <span className="composition__legend-pct">18<small>%</small></span>
                </li>
                <li>
                  <span className="composition__dot" style={{background: 'var(--leaf)'}} />
                  <span className="composition__legend-code">N° 03</span>
                  <span className="composition__legend-name">Leaf</span>
                  <span className="composition__legend-pct">9<small>%</small></span>
                </li>
                <li>
                  <span className="composition__dot" style={{background: 'var(--clay)'}} />
                  <span className="composition__legend-code">N° 02</span>
                  <span className="composition__legend-name">Clay</span>
                  <span className="composition__legend-pct">7<small>%</small></span>
                </li>
              </ul>
            </div>
            {/* Quote */}
            <div className="quote-section">
              <blockquote data-lang="en">Design that feels shaped by hand, not manufactured by machine.</blockquote>
              <blockquote data-lang="ko" hidden>기계가 아닌 손으로 빚어낸 듯한 디자인.</blockquote>
              <blockquote data-lang="ja" hidden>機械ではなく、手で形づくられたようなデザイン。</blockquote>
              <span className="attr" data-lang="en">The Atelier Principle</span>
              <span className="attr" data-lang="ko" hidden>아뜰리에 원칙</span>
              <span className="attr" data-lang="ja" hidden>アトリエの原則</span>
            </div>
            {/* Design Principles */}
            <div className="principles">
              <span className="section-label" data-lang="en">IV — Design Principles</span>
              <span className="section-label" data-lang="ko" hidden>IV — 디자인 원칙</span>
              <span className="section-label" data-lang="ja" hidden>IV — デザイン原則</span>
              <div className="principles__grid">
                <ul className="principles__list" data-lang="en">
                  <li className="principles__item">
                    <span className="principles__num">I</span>
                    <span className="principles__kicker">Chromatic</span>
                    <div className="principles__title">Earth Tones Only</div>
                    <div className="principles__desc">Soil and plant-toned colors replace bright neon. Every hue is pulled from nature.</div>
                  </li>
                  <li className="principles__item">
                    <span className="principles__num">II</span>
                    <span className="principles__kicker">Spatial</span>
                    <div className="principles__title">Generous Space</div>
                    <div className="principles__desc">Breathing room between elements creates a sense of calm. Space is a design material.</div>
                  </li>
                  <li className="principles__item">
                    <span className="principles__num">III</span>
                    <span className="principles__kicker">Temporal</span>
                    <div className="principles__title">Slow Motion</div>
                    <div className="principles__desc">Slow fade and float animations maintain stability. No bounce or elastic effects.</div>
                  </li>
                </ul>
              </div>
              <div className="principles__grid">
                <ul className="principles__list" data-lang="ko" hidden>
                  <li className="principles__item">
                    <span className="principles__num">I</span>
                    <span className="principles__kicker">색</span>
                    <div className="principles__title">흙빛 색상만</div>
                    <div className="principles__desc">밝은 네온 대신 흙과 식물 계열 색을 씁니다. 모든 색을 자연에서 가져옵니다.</div>
                  </li>
                  <li className="principles__item">
                    <span className="principles__num">II</span>
                    <span className="principles__kicker">여백</span>
                    <div className="principles__title">넉넉한 여백</div>
                    <div className="principles__desc">요소 사이를 넉넉히 비워 안정감을 만듭니다. 여백도 하나의 디자인 재료입니다.</div>
                  </li>
                  <li className="principles__item">
                    <span className="principles__num">III</span>
                    <span className="principles__kicker">시간</span>
                    <div className="principles__title">느린 모션</div>
                    <div className="principles__desc">느린 fade/float 모션으로 안정감을 유지합니다. bounce/elastic 효과 없음.</div>
                  </li>
                </ul>
              </div>
              <div className="principles__grid">
                <ul className="principles__list" data-lang="ja" hidden>
                  <li className="principles__item">
                    <span className="principles__num">I</span>
                    <span className="principles__kicker">色彩</span>
                    <div className="principles__title">アースカラーのみ</div>
                    <div className="principles__desc">鮮やかなネオンの代わりに土や植物の色を使います。すべての色は自然から。</div>
                  </li>
                  <li className="principles__item">
                    <span className="principles__num">II</span>
                    <span className="principles__kicker">余白</span>
                    <div className="principles__title">ゆとりある余白</div>
                    <div className="principles__desc">要素間の余裕ある空間が落ち着きを生みます。空間はデザイン素材です。</div>
                  </li>
                  <li className="principles__item">
                    <span className="principles__num">III</span>
                    <span className="principles__kicker">時間</span>
                    <div className="principles__title">ゆっくりモーション</div>
                    <div className="principles__desc">ゆっくりしたfade/floatモーションで安定感を維持。bounce/elastic効果なし。</div>
                  </li>
                </ul>
              </div>
            </div>
            {/* Type Specimen */}
            <div className="specimen">
              <span className="section-label" data-lang="en">V — Typography</span>
              <span className="section-label" data-lang="ko" hidden>V — 타이포그래피</span>
              <span className="section-label" data-lang="ja" hidden>V — タイポグラフィ</span>
              <div className="specimen__row">
                <div className="specimen__serif">
                  <div className="specimen__phrase" data-lang="en">The quietest mark</div>
                  <div className="specimen__phrase" data-lang="ko" hidden>가장 조용한 흔적</div>
                  <div className="specimen__phrase" data-lang="ja" hidden>もっとも静かな印</div>
                  <div className="specimen__display">Cormorant Garamond</div>
                  <div className="specimen__meta">Light 300 — Display / Headings</div>
                  <div className="specimen__alphabet specimen__alphabet--serif">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</div>
                  <div className="specimen__nums specimen__nums--serif">0 1 2 3 4 5 6 7 8 9</div>
                </div>
                <div className="specimen__sans">
                  <div className="specimen__phrase specimen__phrase--sans">Earth · Atelier · Quiet</div>
                  <div className="specimen__sans-display">Inter</div>
                  <div className="specimen__meta">Light 300 / Regular 400 / Medium 500</div>
                  <div className="specimen__alphabet">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</div>
                  <div className="specimen__nums">0 1 2 3 4 5 6 7 8 9</div>
                </div>
              </div>
            </div>
            {/* Colophon */}
            <div className="colophon" aria-hidden="true">
              <svg className="colophon__sprig" viewBox="0 0 160 24">
                <line x1="0" y1="12" x2="56" y2="12" />
                <path d="M80 4 L80 20" />
                <path d="M80 8 Q74 8 68 6" />
                <path d="M80 12 Q72 12 64 9" />
                <path d="M80 16 Q74 16 70 14" />
                <path d="M80 8 Q86 8 92 6" />
                <path d="M80 12 Q88 12 96 9" />
                <path d="M80 16 Q86 16 90 14" />
                <line x1="104" y1="12" x2="160" y2="12" />
              </svg>
              <div className="colophon__text">
                <span data-lang="en">Atelier · Earth Studies</span>
                <span data-lang="ko" hidden>아뜰리에 · 흙의 연구</span>
                <span data-lang="ja" hidden>アトリエ · 土の研究</span>
              </div>
              <div className="colophon__meta">Specimen N° IX — MMXXVI</div>
            </div>
          </section>
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Earth Atelier style — luxury apothecary minimalism inspired by Byredo and Aesop, with warm earth tones and quiet contrast.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--sand: #efe6d6{"\n"}--clay: #ab6b49{"\n"}--leaf: #5f6a47{"\n"}--ink: #2e2a24{"\n"}--paper: #faf6ee{"\n"}--muted: rgba(46, 42, 36, 0.4){"\n"}--line: rgba(46, 42, 36, 0.12){"\n"}Background: flat var(--paper), no gradients on body.{"\n"}No other colors.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Display: 'Cormorant Garamond' 300 (serif, light weight for Byredo-like elegance){"\n"}Body: 'Inter' 300 / 400 / 500 (sans-serif, thin for apothecary feel){"\n"}Scale: clamp(2.8rem, 7vw, 5.6rem) for h1{"\n"}Display line-height: 1.05{"\n"}Body line-height: 1.7–1.85{"\n"}Lead paragraph max-width: 460px{"\n"}{"\n"}UI:{"\n"}Divisions: 1px solid rgba(46, 42, 36, 0.12) — horizontal and vertical lines{"\n"}No rounded cards, no panels, no box-shadows{"\n"}Color swatches: square aspect-ratio, flat fill, grid with gap{"\n"}Buttons: border-radius 0, 1px border, transparent bg, uppercase label, hover fills --ink{"\n"}Accent marks: single 1px vertical lines in --clay at 25% opacity{"\n"}{"\n"}LAYOUT:{"\n"}Content max-width: min(1060px, 90vw){"\n"}Page padding: 28px 20px 84px{"\n"}Section padding: clamp(48px, 7vw, 80px) vertical{"\n"}Asymmetric intro grid: 7fr text | 5fr metadata, border-right divider{"\n"}Principles: 3-column grid with border-left dividers{"\n"}Type specimen: 2-column split (serif | sans), border-right divider{"\n"}{"\n"}MOTION:{"\n"}Entrance: translateY(8px) to 0, opacity 0 to 1, 600ms ease, stagger 80ms{"\n"}No hover effects on content. Button hover: bg fills to --ink, text inverts.{"\n"}No scroll-triggered animations. Respect prefers-reduced-motion.{"\n"}{"\n"}AESTHETIC REFERENCE:{"\n"}Byredo, Aesop — luxury apothecary minimalism{"\n"}Museum label typography, editorial restraint{"\n"}Let whitespace and typography do all the work{"\n"}{"\n"}RESPONSIVE:{"\n"}768px: all multi-column layouts collapse to single column{"\n"}Palette wraps to 3 per row{"\n"}No horizontal scroll at any viewport{"\n"}{"\n"}FORBIDDEN:{"\n"}- Rounded corners on containers or cards{"\n"}- Gradients, glows, noise textures, or decorative SVG{"\n"}- 3D effects, drop shadows, inset shadows{"\n"}- Neon or high-saturation colors{"\n"}- Bounce/elastic motion{"\n"}- Decorative illustrations or ornamental dividers{"\n"}- Cold blue or purple tones{"\n"}{"\n"}OUTPUT:{"\n"}1) Color + typography tokens as CSS custom properties{"\n"}2) Component structure: Hero, Two-col intro, Flat palette, Quote, 3-col Principles, 2-col Type specimen{"\n"}3) Semantic HTML + CSS, single file, responsive</pre>
            <pre data-lang="ko" hidden>Earth Atelier 스타일의 랜딩 페이지를 설계해줘 — Byredo, Aesop에서 영감받은 럭셔리 아포테카리 미니멀리즘, 따뜻한 어스 톤과 조용한 대비.{"\n"}{"\n"}색상 토큰:{"\n"}--sand: #efe6d6{"\n"}--clay: #ab6b49{"\n"}--leaf: #5f6a47{"\n"}--ink: #2e2a24{"\n"}--paper: #faf6ee{"\n"}--muted: rgba(46, 42, 36, 0.4){"\n"}--line: rgba(46, 42, 36, 0.12){"\n"}배경: 단색 var(--paper), body에 그라데이션 없음.{"\n"}다른 색상 사용 금지.{"\n"}{"\n"}타이포그래피:{"\n"}디스플레이: 'Cormorant Garamond' 300 (세리프, Byredo 같은 우아함을 위한 라이트 웨이트){"\n"}본문: 'Inter' 300 / 400 / 500 (산스세리프, 아포테카리 느낌의 얇은 서체){"\n"}스케일: h1은 clamp(2.8rem, 7vw, 5.6rem){"\n"}디스플레이 line-height: 1.05{"\n"}본문 line-height: 1.7–1.85{"\n"}리드 문단 max-width: 460px{"\n"}{"\n"}UI:{"\n"}구분선: 1px solid rgba(46, 42, 36, 0.12) — 수평/수직 라인{"\n"}둥근 카드, 패널, box-shadow 없음{"\n"}색상 스와치: 정사각형 비율, 단색 채움, 갭이 있는 그리드{"\n"}버튼: border-radius 0, 1px 테두리, 투명 배경, 대문자 라벨, 호버 시 --ink 채움{"\n"}액센트 마크: --clay 컬러의 1px 수직 라인, 25% 투명도{"\n"}{"\n"}레이아웃:{"\n"}콘텐츠 max-width: min(1060px, 90vw){"\n"}페이지 padding: 28px 20px 84px{"\n"}섹션 padding: clamp(48px, 7vw, 80px) 수직{"\n"}비대칭 인트로 그리드: 7fr 텍스트 | 5fr 메타데이터, border-right 구분선{"\n"}원칙: border-left 구분선이 있는 3컬럼 그리드{"\n"}서체 견본: 2컬럼 분할 (세리프 | 산스), border-right 구분선{"\n"}{"\n"}모션:{"\n"}등장: translateY(8px) → 0, opacity 0 → 1, 600ms ease, 80ms 시차{"\n"}콘텐츠에 호버 효과 없음. 버튼 호버: 배경이 --ink로, 텍스트 반전.{"\n"}스크롤 트리거 애니메이션 없음. prefers-reduced-motion 준수.{"\n"}{"\n"}미학적 레퍼런스:{"\n"}Byredo, Aesop — 럭셔리 아포테카리 미니멀리즘{"\n"}뮤지엄 라벨 타이포그래피, 에디토리얼 절제{"\n"}여백과 타이포그래피에 모든 것을 맡기도록{"\n"}{"\n"}반응형:{"\n"}768px: 모든 다중 컬럼 레이아웃 단일 컬럼 전환{"\n"}팔레트 3개씩 줄바꿈{"\n"}어떤 뷰포트에서든 가로 스크롤 없음{"\n"}{"\n"}금지사항:{"\n"}- 컨테이너나 카드에 둥근 모서리{"\n"}- 그라데이션, 글로우, 노이즈 텍스처, 장식 SVG{"\n"}- 3D 효과, 드롭 섀도우, 인셋 섀도우{"\n"}- 네온 또는 고채도 색상{"\n"}- bounce/elastic 모션{"\n"}- 장식 일러스트나 장식적 구분선{"\n"}- 차가운 블루 또는 퍼플 톤{"\n"}{"\n"}출력:{"\n"}1) 색상 + 타이포그래피 토큰을 CSS 커스텀 프로퍼티로{"\n"}2) 컴포넌트 구조: 히어로, 2컬럼 인트로, 평면 팔레트, 인용문, 3컬럼 원칙, 2컬럼 서체 견본{"\n"}3) 시맨틱 HTML + CSS, 단일 파일, 반응형</pre>
            <pre data-lang="ja" hidden>Earth Atelierスタイルのランディングページを設計してください — ByredoとAesopにインスパイアされたラグジュアリーアポセカリーミニマリズム、温かなアースカラーと静かなコントラスト。{"\n"}{"\n"}カラートークン:{"\n"}--sand: #efe6d6{"\n"}--clay: #ab6b49{"\n"}--leaf: #5f6a47{"\n"}--ink: #2e2a24{"\n"}--paper: #faf6ee{"\n"}--muted: rgba(46, 42, 36, 0.4){"\n"}--line: rgba(46, 42, 36, 0.12){"\n"}背景: フラットな var(--paper)、bodyにグラデーションなし。{"\n"}他の色は使用禁止。{"\n"}{"\n"}タイポグラフィ:{"\n"}ディスプレイ: 'Cormorant Garamond' 300（セリフ、Byredo的なエレガンスのためのライトウェイト）{"\n"}本文: 'Inter' 300 / 400 / 500（サンセリフ、アポセカリー感のある細い書体）{"\n"}スケール: h1は clamp(2.8rem, 7vw, 5.6rem){"\n"}ディスプレイ line-height: 1.05{"\n"}本文 line-height: 1.7–1.85{"\n"}リード段落 max-width: 460px{"\n"}{"\n"}UI:{"\n"}区切り線: 1px solid rgba(46, 42, 36, 0.12) — 水平・垂直ライン{"\n"}角丸カード、パネル、box-shadow なし{"\n"}カラースウォッチ: 正方形比率、フラット塗り、ギャップ付きグリッド{"\n"}ボタン: border-radius 0、1pxボーダー、透明背景、大文字ラベル、ホバーで--ink塗り{"\n"}アクセントマーク: --clayカラーの1px垂直ライン、25%不透明度{"\n"}{"\n"}レイアウト:{"\n"}コンテンツ max-width: min(1060px, 90vw){"\n"}ページ padding: 28px 20px 84px{"\n"}セクション padding: clamp(48px, 7vw, 80px) 垂直{"\n"}非対称イントログリッド: 7frテキスト | 5frメタデータ、border-right区切り線{"\n"}原則: border-left区切り線付き3カラムグリッド{"\n"}タイプスペシメン: 2カラム分割（セリフ | サンス）、border-right区切り線{"\n"}{"\n"}モーション:{"\n"}登場: translateY(8px) → 0, opacity 0 → 1, 600ms ease, 80msスタガー{"\n"}コンテンツにホバー効果なし。ボタンホバー: 背景が--inkに、テキスト反転。{"\n"}スクロールトリガーアニメーションなし。prefers-reduced-motionを尊重。{"\n"}{"\n"}美学的リファレンス:{"\n"}Byredo、Aesop — ラグジュアリーアポセカリーミニマリズム{"\n"}ミュージアムラベルタイポグラフィ、エディトリアルの節制{"\n"}ホワイトスペースとタイポグラフィにすべてを委ねる{"\n"}{"\n"}レスポンシブ:{"\n"}768px: すべてのマルチカラムレイアウトがシングルカラムに{"\n"}パレットが3個ずつ折り返し{"\n"}いかなるビューポートでも横スクロールなし{"\n"}{"\n"}禁止事項:{"\n"}- コンテナやカードの角丸{"\n"}- グラデーション、グロウ、ノイズテクスチャ、装飾SVG{"\n"}- 3D効果、ドロップシャドウ、インセットシャドウ{"\n"}- ネオンまたは高彩度カラー{"\n"}- bounce/elasticモーション{"\n"}- 装飾イラストや装飾的区切り線{"\n"}- 冷たいブルーやパープルトーン{"\n"}{"\n"}出力:{"\n"}1) カラー＋タイポグラフィトークンをCSSカスタムプロパティとして{"\n"}2) コンポーネント構造: ヒーロー、2カラムイントロ、フラットパレット、引用、3カラム原則、2カラムタイプスペシメン{"\n"}3) セマンティックHTML + CSS、単一ファイル、レスポンシブ</pre>
            <button className="prompt-btn" data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/bento-bloom.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Bento Bloom</span></a><div className="page-nav__divider" /><a href="/pages/liquid-metal.html"><span><span className="page-nav__label">다음</span>Liquid Metal</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
