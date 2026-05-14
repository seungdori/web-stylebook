import { useRef, useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

type AuroraPalette = {
  id: string;
  /** display name (mono uppercase, editorial) */
  name: string;
  /** sub-label used in hero-meta__cell Palette dd, locale-aware */
  hero: { en: string; ko: string; ja: string };
  accent: string;     accentRgb: string;
  accent2: string;    accent2Rgb: string;
  accent3: string;    accent3Rgb: string;
  /** light intro stop for the H1 accent word gradient */
  soft: string;
};

const PALETTES: AuroraPalette[] = [
  {
    id: 'northern',
    name: 'NORTHERN',
    hero: { en: 'Cool Triadic', ko: '쿨 트라이아딕', ja: 'クール トライアディック' },
    accent: '#9d7bff', accentRgb: '157, 123, 255',
    accent2: '#6fe7f5', accent2Rgb: '111, 231, 245',
    accent3: '#ff8eb1', accent3Rgb: '255, 142, 177',
    soft: '#c8b4ff',
  },
  {
    id: 'emerald',
    name: 'EMERALD',
    hero: { en: 'Emerald Veil', ko: '에메랄드 베일', ja: 'エメラルドベール' },
    accent: '#7be0a3', accentRgb: '123, 224, 163',
    accent2: '#9beadf', accent2Rgb: '155, 234, 223',
    accent3: '#d2b8ff', accent3Rgb: '210, 184, 255',
    soft: '#b4f0c8',
  },
  {
    id: 'nebula',
    name: 'NEBULA',
    hero: { en: 'Deep Nebula', ko: '딥 네뷸라', ja: 'ディープ ネビュラ' },
    accent: '#7c5cff', accentRgb: '124, 92, 255',
    accent2: '#38bdf8', accent2Rgb: '56, 189, 248',
    accent3: '#f472b6', accent3Rgb: '244, 114, 182',
    soft: '#b4a6ff',
  },
  {
    id: 'polar',
    name: 'POLAR',
    hero: { en: 'Polar Frost', ko: '폴라 프로스트', ja: 'ポーラーフロスト' },
    accent: '#b9d1ff', accentRgb: '185, 209, 255',
    accent2: '#c8efe8', accent2Rgb: '200, 239, 232',
    accent3: '#e9d6ff', accent3Rgb: '233, 214, 255',
    soft: '#d4e3ff',
  },
  {
    id: 'dusk',
    name: 'DUSK',
    hero: { en: 'Twilight Dusk', ko: '트와일라잇 더스크', ja: 'トワイライトダスク' },
    accent: '#d48dff', accentRgb: '212, 141, 255',
    accent2: '#ff8eb1', accent2Rgb: '255, 142, 177',
    accent3: '#6fe7f5', accent3Rgb: '111, 231, 245',
    soft: '#efc8ff',
  },
];

export function PortedAuroraGradientPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  const [activeId, setActiveId] = useState('northern');
  const palette = PALETTES.find((p) => p.id === activeId) ?? PALETTES[0];

  const styleVars = {
    ['--accent' as string]: palette.accent,
    ['--accent-2' as string]: palette.accent2,
    ['--accent-3' as string]: palette.accent3,
    ['--accent-rgb' as string]: palette.accentRgb,
    ['--accent-2-rgb' as string]: palette.accent2Rgb,
    ['--accent-3-rgb' as string]: palette.accent3Rgb,
    ['--accent-soft' as string]: palette.soft,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className="ported-style-page ported-style-page--aurora-gradient"
      style={styleVars}
      data-palette={palette.id}
    >
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
        <div className="aurora" />
        <div className="aurora-mid" />
        <main className="shell">
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
          {/* Palette switcher */}
          <div className="ag-palette-switch" role="region" aria-label="Aurora palette">
            <div className="ag-palette-switch__label">
              <span className="ag-palette-switch__dot" aria-hidden="true" />
              <span data-lang="en">Palette · N° {String(PALETTES.findIndex((p) => p.id === palette.id) + 1).padStart(3, '0')}</span>
              <span data-lang="ko" hidden>팔레트 · N° {String(PALETTES.findIndex((p) => p.id === palette.id) + 1).padStart(3, '0')}</span>
              <span data-lang="ja" hidden>パレット · N° {String(PALETTES.findIndex((p) => p.id === palette.id) + 1).padStart(3, '0')}</span>
            </div>
            <div className="ag-palette-switch__chips" role="radiogroup" aria-label="Aurora palette">
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={p.id === activeId}
                  className={`ag-palette-chip${p.id === activeId ? ' is-active' : ''}`}
                  onClick={() => setActiveId(p.id)}
                  style={{
                    ['--chip-a' as string]: p.accent,
                    ['--chip-b' as string]: p.accent2,
                    ['--chip-c' as string]: p.accent3,
                    ['--chip-a-rgb' as string]: p.accentRgb,
                  } as CSSProperties}
                >
                  <span className="ag-palette-chip__swatches" aria-hidden="true">
                    <span className="ag-palette-chip__dot" style={{background: p.accent}} />
                    <span className="ag-palette-chip__dot" style={{background: p.accent2}} />
                    <span className="ag-palette-chip__dot" style={{background: p.accent3}} />
                  </span>
                  <span className="ag-palette-chip__name">{p.name}</span>
                </button>
              ))}
            </div>
            <div className="ag-palette-switch__readout" aria-hidden="true">
              <span className="ag-palette-switch__hex">{palette.accent.toUpperCase()}</span>
              <span className="ag-palette-switch__sep">/</span>
              <span className="ag-palette-switch__hex">{palette.accent2.toUpperCase()}</span>
              <span className="ag-palette-switch__sep">/</span>
              <span className="ag-palette-switch__hex">{palette.accent3.toUpperCase()}</span>
            </div>
          </div>

          {/* Hero */}
          <section className="hero">
            <div className="hero-eyebrow" aria-hidden="true">
              <span className="hero-eyebrow__index">N° 001</span>
              <span className="hero-eyebrow__rule" />
              <span className="hero-eyebrow__label" data-lang="en">Stylebook · Aurora Gradient</span>
              <span className="hero-eyebrow__label" data-lang="ko" hidden>스타일북 · 오로라 그라디언트</span>
              <span className="hero-eyebrow__label" data-lang="ja" hidden>スタイルブック · オーロラグラディエント</span>
              <span className="hero-eyebrow__year">2026</span>
            </div>
            <h1>
              <span className="hero-title__word">Aurora</span>
              <span className="hero-title__word hero-title__word--accent">Gradient.</span>
            </h1>
            <p className="lead" data-lang="en">
              Place organically flowing gradients like auroras in the background, and layer content on glass panels to create visual depth. When requesting AI, combine keywords like "multi-color blur orbs", "organic movement", and "color bleeding on dark backgrounds" for reliable results.
            </p>
            <p className="lead" data-lang="ko" hidden>
              오로라처럼 유기적으로 흐르는 그라데이션을 배경에 배치하고, 콘텐츠는 글래스 패널 위에 올려
              시각적 깊이를 만듭니다. AI에게 요청할 때는 "다중 색상 블러 오브", "유기적 움직임",
              "어두운 배경 위 색상 번짐" 키워드를 조합하면 안정적 결과를 얻습니다.
            </p>
            <p className="lead" data-lang="ja" hidden>
              オーロラのように有機的に流れるグラデーションを背景に配置し、コンテンツをグラスパネルの上に載せて視覚的な深みを作ります。AIにリクエストする際は「多色ブラーオーブ」「有機的な動き」「暗い背景の上の色にじみ」のキーワードを組み合わせると安定した結果が得られます。
            </p>
            <dl className="hero-meta">
              <div className="hero-meta__cell">
                <dt data-lang="en">Palette</dt>
                <dt data-lang="ko" hidden>팔레트</dt>
                <dt data-lang="ja" hidden>パレット</dt>
                <dd>{palette.hero[lang as 'en' | 'ko' | 'ja'] ?? palette.hero.en}</dd>
              </div>
              <div className="hero-meta__cell">
                <dt data-lang="en">Surface</dt>
                <dt data-lang="ko" hidden>표면</dt>
                <dt data-lang="ja" hidden>サーフェス</dt>
                <dd>Cosmic Dark</dd>
              </div>
              <div className="hero-meta__cell">
                <dt data-lang="en">Texture</dt>
                <dt data-lang="ko" hidden>텍스처</dt>
                <dt data-lang="ja" hidden>テクスチャー</dt>
                <dd>Diffused Light</dd>
              </div>
              <div className="hero-meta__cell">
                <dt data-lang="en">Motion</dt>
                <dt data-lang="ko" hidden>모션</dt>
                <dt data-lang="ja" hidden>モーション</dt>
                <dd>12s Drift</dd>
              </div>
            </dl>
          </section>
          {/* Aurora Bands */}
          <section className="aurora-bands">
            <header className="section-header">
              <span className="section-header__index">01</span>
              <p className="section-header__title" data-lang="en">Spectral Bands</p>
              <p className="section-header__title" data-lang="ko" hidden>스펙트럼 밴드</p>
              <p className="section-header__title" data-lang="ja" hidden>スペクトルバンド</p>
              <span className="section-header__rule" />
              <span className="section-header__meta" data-lang="en">Three chromatic layers</span>
              <span className="section-header__meta" data-lang="ko" hidden>세 개의 색상 층</span>
              <span className="section-header__meta" data-lang="ja" hidden>三つの色層</span>
            </header>
            <div className="aurora-bands__stack">
              <div className="aurora-band aurora-band--1">
                <span className="aurora-band__id">01</span>
                <span className="aurora-band__name" data-lang="en">Ionosphere</span>
                <span className="aurora-band__name" data-lang="ko" hidden>이온층</span>
                <span className="aurora-band__name" data-lang="ja" hidden>電離層</span>
                <span className="aurora-band__wave">557.7 nm</span>
              </div>
              <div className="aurora-band aurora-band--2">
                <span className="aurora-band__id">02</span>
                <span className="aurora-band__name" data-lang="en">Stratosphere</span>
                <span className="aurora-band__name" data-lang="ko" hidden>성층권</span>
                <span className="aurora-band__name" data-lang="ja" hidden>成層圏</span>
                <span className="aurora-band__wave">630.0 nm</span>
              </div>
              <div className="aurora-band aurora-band--3">
                <span className="aurora-band__id">03</span>
                <span className="aurora-band__name" data-lang="en">Troposphere</span>
                <span className="aurora-band__name" data-lang="ko" hidden>대류권</span>
                <span className="aurora-band__name" data-lang="ja" hidden>対流圏</span>
                <span className="aurora-band__wave">427.8 nm</span>
              </div>
            </div>
          </section>
          {/* Light Properties */}
          <section className="light-props">
            <header className="section-header">
              <span className="section-header__index">02</span>
              <p className="section-header__title" data-lang="en">Light Properties</p>
              <p className="section-header__title" data-lang="ko" hidden>빛 속성</p>
              <p className="section-header__title" data-lang="ja" hidden>光のプロパティ</p>
              <span className="section-header__rule" />
              <span className="section-header__meta" data-lang="en">Pigments / Parameters</span>
              <span className="section-header__meta" data-lang="ko" hidden>색소 / 파라미터</span>
              <span className="section-header__meta" data-lang="ja" hidden>色素 / パラメータ</span>
            </header>
            <div className="light-props__grid">
              <div className="orb-list">
                <div className="orb-item">
                  <span className="orb-dot orb-dot--purple" />
                  <span className="orb-label" data-lang="en">Primary<span className="orb-hex">{palette.accent.toUpperCase()}</span></span>
                  <span className="orb-label" data-lang="ko" hidden>프라이머리<span className="orb-hex">{palette.accent.toUpperCase()}</span></span>
                  <span className="orb-label" data-lang="ja" hidden>プライマリー<span className="orb-hex">{palette.accent.toUpperCase()}</span></span>
                </div>
                <div className="orb-item">
                  <span className="orb-dot orb-dot--cyan" />
                  <span className="orb-label" data-lang="en">Secondary<span className="orb-hex">{palette.accent2.toUpperCase()}</span></span>
                  <span className="orb-label" data-lang="ko" hidden>세컨더리<span className="orb-hex">{palette.accent2.toUpperCase()}</span></span>
                  <span className="orb-label" data-lang="ja" hidden>セカンダリー<span className="orb-hex">{palette.accent2.toUpperCase()}</span></span>
                </div>
                <div className="orb-item">
                  <span className="orb-dot orb-dot--pink" />
                  <span className="orb-label" data-lang="en">Highlight<span className="orb-hex">{palette.accent3.toUpperCase()}</span></span>
                  <span className="orb-label" data-lang="ko" hidden>하이라이트<span className="orb-hex">{palette.accent3.toUpperCase()}</span></span>
                  <span className="orb-label" data-lang="ja" hidden>ハイライト<span className="orb-hex">{palette.accent3.toUpperCase()}</span></span>
                </div>
                <div className="orb-item">
                  <span className="orb-dot orb-dot--soft" />
                  <span className="orb-label" data-lang="en">Soft Glimmer<span className="orb-hex">{palette.soft.toUpperCase()}</span></span>
                  <span className="orb-label" data-lang="ko" hidden>소프트 글리머<span className="orb-hex">{palette.soft.toUpperCase()}</span></span>
                  <span className="orb-label" data-lang="ja" hidden>ソフトグリマー<span className="orb-hex">{palette.soft.toUpperCase()}</span></span>
                </div>
                <div className="orb-item">
                  <span className="orb-dot orb-dot--vapor" />
                  <span className="orb-label" data-lang="en">Vapor Edge<span className="orb-hex">RGBA · 0.16</span></span>
                  <span className="orb-label" data-lang="ko" hidden>베이퍼 엣지<span className="orb-hex">RGBA · 0.16</span></span>
                  <span className="orb-label" data-lang="ja" hidden>ベイパーエッジ<span className="orb-hex">RGBA · 0.16</span></span>
                </div>
              </div>
              <div className="stat-list">
                <div className="stat-card">
                  <span className="stat-label" data-lang="en">Blur Radius</span>
                  <span className="stat-label" data-lang="ko" hidden>블러 반경</span>
                  <span className="stat-label" data-lang="ja" hidden>ブラー半径</span>
                  <span className="stat-value">140<small>px</small></span>
                </div>
                <div className="stat-card">
                  <span className="stat-label" data-lang="en">Drift Range</span>
                  <span className="stat-label" data-lang="ko" hidden>드리프트 범위</span>
                  <span className="stat-label" data-lang="ja" hidden>ドリフト範囲</span>
                  <span className="stat-value">60<small>px</small></span>
                </div>
                <div className="stat-card">
                  <span className="stat-label" data-lang="en">Pulse Scale</span>
                  <span className="stat-label" data-lang="ko" hidden>펄스 스케일</span>
                  <span className="stat-label" data-lang="ja" hidden>パルススケール</span>
                  <span className="stat-value">1.2<small>×</small></span>
                </div>
                <div className="stat-card">
                  <span className="stat-label" data-lang="en">Saturation</span>
                  <span className="stat-label" data-lang="ko" hidden>채도</span>
                  <span className="stat-label" data-lang="ja" hidden>彩度</span>
                  <span className="stat-value">68<small>%</small></span>
                </div>
                <div className="stat-card">
                  <span className="stat-label" data-lang="en">Loop Cycle</span>
                  <span className="stat-label" data-lang="ko" hidden>루프 주기</span>
                  <span className="stat-label" data-lang="ja" hidden>ループ周期</span>
                  <span className="stat-value">16<small>s</small></span>
                </div>
              </div>
            </div>
          </section>
          {/* Motion Sequencer */}
          <section className="motion-seq">
            <header className="section-header">
              <span className="section-header__index">03</span>
              <p className="section-header__title" data-lang="en">Motion Sequencer</p>
              <p className="section-header__title" data-lang="ko" hidden>모션 시퀀서</p>
              <p className="section-header__title" data-lang="ja" hidden>モーションシーケンサー</p>
              <span className="section-header__rule" />
              <span className="section-header__meta" data-lang="en">Four keyframes · all ease-in-out</span>
              <span className="section-header__meta" data-lang="ko" hidden>네 개의 키프레임 · 전체 ease-in-out</span>
              <span className="section-header__meta" data-lang="ja" hidden>4 つのキーフレーム · すべて ease-in-out</span>
            </header>
            <div className="motion-seq__list">
              <div className="motion-row">
                <span className="motion-row__id">K01</span>
                <div className="motion-row__main">
                  <div className="motion-row__head">
                    <span className="motion-row__name" data-lang="en">Drift</span>
                    <span className="motion-row__name" data-lang="ko" hidden>드리프트</span>
                    <span className="motion-row__name" data-lang="ja" hidden>ドリフト</span>
                    <span className="motion-row__detail" data-lang="en">::before + ::after translate &amp; scale</span>
                    <span className="motion-row__detail" data-lang="ko" hidden>::before + ::after translate &amp; scale</span>
                    <span className="motion-row__detail" data-lang="ja" hidden>::before + ::after translate &amp; scale</span>
                  </div>
                  <div className="motion-row__track motion-row__track--drift">
                    <span className="motion-row__bar" />
                  </div>
                </div>
                <span className="motion-row__dur">16<small>s</small></span>
              </div>
              <div className="motion-row">
                <span className="motion-row__id">K02</span>
                <div className="motion-row__main">
                  <div className="motion-row__head">
                    <span className="motion-row__name" data-lang="en">Pulse</span>
                    <span className="motion-row__name" data-lang="ko" hidden>펄스</span>
                    <span className="motion-row__name" data-lang="ja" hidden>パルス</span>
                    <span className="motion-row__detail" data-lang="en">.aurora-mid opacity 0.4 → 0.7</span>
                    <span className="motion-row__detail" data-lang="ko" hidden>.aurora-mid opacity 0.4 → 0.7</span>
                    <span className="motion-row__detail" data-lang="ja" hidden>.aurora-mid opacity 0.4 → 0.7</span>
                  </div>
                  <div className="motion-row__track motion-row__track--pulse">
                    <span className="motion-row__bar" />
                  </div>
                </div>
                <span className="motion-row__dur">10<small>s</small></span>
              </div>
              <div className="motion-row">
                <span className="motion-row__id">K03</span>
                <div className="motion-row__main">
                  <div className="motion-row__head">
                    <span className="motion-row__name" data-lang="en">Shimmer</span>
                    <span className="motion-row__name" data-lang="ko" hidden>시머</span>
                    <span className="motion-row__name" data-lang="ja" hidden>シマー</span>
                    <span className="motion-row__detail" data-lang="en">italic word background-position drift</span>
                    <span className="motion-row__detail" data-lang="ko" hidden>이탤릭 워드 background-position drift</span>
                    <span className="motion-row__detail" data-lang="ja" hidden>イタリックワード background-position drift</span>
                  </div>
                  <div className="motion-row__track motion-row__track--shimmer">
                    <span className="motion-row__bar" />
                  </div>
                </div>
                <span className="motion-row__dur">12<small>s</small></span>
              </div>
              <div className="motion-row">
                <span className="motion-row__id">K04</span>
                <div className="motion-row__main">
                  <div className="motion-row__head">
                    <span className="motion-row__name" data-lang="en">Glide</span>
                    <span className="motion-row__name" data-lang="ko" hidden>글라이드</span>
                    <span className="motion-row__name" data-lang="ja" hidden>グライド</span>
                    <span className="motion-row__detail" data-lang="en">hero entrance · translateY 18 → 0</span>
                    <span className="motion-row__detail" data-lang="ko" hidden>히어로 등장 · translateY 18 → 0</span>
                    <span className="motion-row__detail" data-lang="ja" hidden>ヒーロー登場 · translateY 18 → 0</span>
                  </div>
                  <div className="motion-row__track motion-row__track--glide">
                    <span className="motion-row__bar" />
                  </div>
                </div>
                <span className="motion-row__dur">1.0<small>s</small></span>
              </div>
            </div>
          </section>
          {/* Composition Guide */}
          <section className="comp-guide">
            <header className="section-header">
              <span className="section-header__index">04</span>
              <p className="section-header__title" data-lang="en">Composition Guide</p>
              <p className="section-header__title" data-lang="ko" hidden>구성 가이드</p>
              <p className="section-header__title" data-lang="ja" hidden>コンポジションガイド</p>
              <span className="section-header__rule" />
              <span className="section-header__meta" data-lang="en">Three stacked layers</span>
              <span className="section-header__meta" data-lang="ko" hidden>세 개의 적층 레이어</span>
              <span className="section-header__meta" data-lang="ja" hidden>三層のスタック</span>
            </header>
            <div className="comp-guide__grid">
              {/* Card 1: Background Layer */}
              <article className="comp-card">
                <div className="comp-card__bar comp-card__bar--purple" />
                <span className="comp-card__layer">L01</span>
                <div className="comp-card__body">
                  <div className="comp-card__icon comp-card__icon--purple">
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10} /><circle cx={12} cy={12} r={4} /></svg>
                  </div>
                  <h3 className="comp-card__name" data-lang="en">Background Layer</h3>
                  <h3 className="comp-card__name" data-lang="ko" hidden>배경 레이어</h3>
                  <h3 className="comp-card__name" data-lang="ja" hidden>背景レイヤー</h3>
                  <p className="comp-card__desc" data-lang="en">2-3 large blur orbs with organic drift animation create the aurora atmosphere on a dark canvas.</p>
                  <p className="comp-card__desc" data-lang="ko" hidden>2~3개의 대형 블러 오브가 유기적 드리프트 애니메이션으로 어두운 캔버스 위에 오로라 분위기를 만듭니다.</p>
                  <p className="comp-card__desc" data-lang="ja" hidden>2〜3個の大型ブラーオーブが有機的なドリフトアニメーションでダークキャンバス上にオーロラの雰囲気を作ります。</p>
                  <div className="comp-preview comp-preview--orbs" />
                </div>
              </article>
              {/* Card 2: Content Layer */}
              <article className="comp-card">
                <div className="comp-card__bar comp-card__bar--cyan" />
                <span className="comp-card__layer">L02</span>
                <div className="comp-card__body">
                  <div className="comp-card__icon comp-card__icon--cyan">
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x={3} y={3} width={18} height={18} rx={4} /><line x1={3} y1={9} x2={21} y2={9} /></svg>
                  </div>
                  <h3 className="comp-card__name" data-lang="en">Content Layer</h3>
                  <h3 className="comp-card__name" data-lang="ko" hidden>콘텐츠 레이어</h3>
                  <h3 className="comp-card__name" data-lang="ja" hidden>コンテンツレイヤー</h3>
                  <p className="comp-card__desc" data-lang="en">Glass panels with backdrop-filter blur and subtle borders separate content from the aurora background.</p>
                  <p className="comp-card__desc" data-lang="ko" hidden>backdrop-filter 블러와 미세한 보더가 있는 글래스 패널이 콘텐츠를 오로라 배경에서 분리합니다.</p>
                  <p className="comp-card__desc" data-lang="ja" hidden>backdrop-filterブラーと微細なボーダーを持つグラスパネルがコンテンツをオーロラ背景から分離します。</p>
                  <div className="comp-preview comp-preview--glass">
                    <span className="mock-line" />
                    <span className="mock-line" />
                    <span className="mock-line" />
                  </div>
                </div>
              </article>
              {/* Card 3: Text Layer */}
              <article className="comp-card">
                <div className="comp-card__bar comp-card__bar--pink" />
                <span className="comp-card__layer">L03</span>
                <div className="comp-card__body">
                  <div className="comp-card__icon comp-card__icon--pink">
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7" /><line x1={9} y1={20} x2={15} y2={20} /><line x1={12} y1={4} x2={12} y2={20} /></svg>
                  </div>
                  <h3 className="comp-card__name" data-lang="en">Text Layer</h3>
                  <h3 className="comp-card__name" data-lang="ko" hidden>텍스트 레이어</h3>
                  <h3 className="comp-card__name" data-lang="ja" hidden>テキストレイヤー</h3>
                  <p className="comp-card__desc" data-lang="en">Gradient-clip text inherits aurora colors, creating visual unity between background and typography.</p>
                  <p className="comp-card__desc" data-lang="ko" hidden>그라디언트 클립 텍스트가 오로라 색상을 이어받아 배경과 타이포그래피 사이의 시각적 통일감을 만듭니다.</p>
                  <p className="comp-card__desc" data-lang="ja" hidden>グラデーションクリップテキストがオーロラカラーを引き継ぎ、背景とタイポグラフィの間に視覚的な統一感を生み出します。</p>
                  <div className="comp-preview comp-preview--text">
                    <span className="gradient-word" data-lang="en">Aurora Gradient</span>
                    <span className="gradient-word" data-lang="ko" hidden>오로라 그라디언트</span>
                    <span className="gradient-word" data-lang="ja" hidden>オーロラグラデーション</span>
                  </div>
                </div>
              </article>
            </div>
          </section>
          {/* Glass Recipes */}
          <section className="glass-recipes">
            <header className="section-header">
              <span className="section-header__index">05</span>
              <p className="section-header__title" data-lang="en">Glass Recipes</p>
              <p className="section-header__title" data-lang="ko" hidden>글래스 레시피</p>
              <p className="section-header__title" data-lang="ja" hidden>グラスレシピ</p>
              <span className="section-header__rule" />
              <span className="section-header__meta" data-lang="en">Three panel blends</span>
              <span className="section-header__meta" data-lang="ko" hidden>세 가지 패널 블렌드</span>
              <span className="section-header__meta" data-lang="ja" hidden>3 つのパネルブレンド</span>
            </header>
            <div className="glass-recipes__grid">
              <article className="glass-recipe glass-recipe--accent">
                <div className="glass-recipe__swatch" />
                <div className="glass-recipe__body">
                  <span className="glass-recipe__num">R01</span>
                  <h3 className="glass-recipe__name" data-lang="en">Veil · primary</h3>
                  <h3 className="glass-recipe__name" data-lang="ko" hidden>베일 · 프라이머리</h3>
                  <h3 className="glass-recipe__name" data-lang="ja" hidden>ベール · プライマリー</h3>
                  <p className="glass-recipe__desc" data-lang="en">A primary-tinted glass for hero CTAs and feature tiles. Light backdrop blur keeps body text crisp.</p>
                  <p className="glass-recipe__desc" data-lang="ko" hidden>히어로 CTA와 피처 타일을 위한 프라이머리 틴트 글래스. 가벼운 backdrop blur로 본문이 또렷합니다.</p>
                  <p className="glass-recipe__desc" data-lang="ja" hidden>ヒーロー CTA とフィーチャータイル向けのプライマリーティントガラス。軽い backdrop blur で本文がくっきり。</p>
                  <dl className="glass-recipe__specs">
                    <div><dt>fill</dt><dd>rgba(var(--accent-rgb), 0.06)</dd></div>
                    <div><dt>border</dt><dd>rgba(var(--accent-rgb), 0.18)</dd></div>
                    <div><dt>blur</dt><dd>8px</dd></div>
                  </dl>
                </div>
              </article>
              <article className="glass-recipe glass-recipe--mix">
                <div className="glass-recipe__swatch" />
                <div className="glass-recipe__body">
                  <span className="glass-recipe__num">R02</span>
                  <h3 className="glass-recipe__name" data-lang="en">Mist · triadic</h3>
                  <h3 className="glass-recipe__name" data-lang="ko" hidden>미스트 · 트라이아딕</h3>
                  <h3 className="glass-recipe__name" data-lang="ja" hidden>ミスト · トライアディック</h3>
                  <p className="glass-recipe__desc" data-lang="en">A diagonal blend across all three tokens — used for hero footer panels and palette feature strips.</p>
                  <p className="glass-recipe__desc" data-lang="ko" hidden>세 개 토큰 모두를 대각선으로 블렌드 — 히어로 푸터 패널과 팔레트 피처 스트립에 사용.</p>
                  <p className="glass-recipe__desc" data-lang="ja" hidden>3 つのトークンを対角でブレンド — ヒーローフッターパネルとパレットフィーチャーストリップで使用。</p>
                  <dl className="glass-recipe__specs">
                    <div><dt>fill</dt><dd>linear-gradient(118deg, c1·0.12 → c2·0.06 → c3·0.12)</dd></div>
                    <div><dt>border</dt><dd>var(--hairline-bright)</dd></div>
                    <div><dt>blur</dt><dd>12px</dd></div>
                  </dl>
                </div>
              </article>
              <article className="glass-recipe glass-recipe--ink">
                <div className="glass-recipe__swatch" />
                <div className="glass-recipe__body">
                  <span className="glass-recipe__num">R03</span>
                  <h3 className="glass-recipe__name" data-lang="en">Ink · quiet</h3>
                  <h3 className="glass-recipe__name" data-lang="ko" hidden>잉크 · 콰이엇</h3>
                  <h3 className="glass-recipe__name" data-lang="ja" hidden>インク · クワイエット</h3>
                  <p className="glass-recipe__desc" data-lang="en">Near-opaque cosmic ink for long-form copy and prompt boxes. Keeps body text legible over busy orbs.</p>
                  <p className="glass-recipe__desc" data-lang="ko" hidden>긴 본문과 프롬프트 박스를 위한 거의 불투명한 코스믹 잉크. 분주한 오브 위에서도 본문 가독성 유지.</p>
                  <p className="glass-recipe__desc" data-lang="ja" hidden>長文コピーとプロンプトボックス向けのほぼ不透明なコズミックインク。賑やかなオーブの上でも本文が読める。</p>
                  <dl className="glass-recipe__specs">
                    <div><dt>fill</dt><dd>rgba(7, 7, 26, 0.7)</dd></div>
                    <div><dt>border</dt><dd>var(--hairline)</dd></div>
                    <div><dt>blur</dt><dd>14px</dd></div>
                  </dl>
                </div>
              </article>
            </div>
          </section>
          <section className="prompt">
            <header className="section-header section-header--prompt">
              <span className="section-header__index">06</span>
              <h2 className="section-header__title" data-i18n="page.heading.prompt">AI Request Prompt</h2>
              <span className="section-header__rule" />
              <span className="section-header__meta" data-lang="en">Single-file output</span>
              <span className="section-header__meta" data-lang="ko" hidden>단일 파일 출력</span>
              <span className="section-header__meta" data-lang="ja" hidden>単一ファイル出力</span>
            </header>
            <pre data-lang="en">{`Design a landing page in Aurora Gradient style — organic luminous orbs flowing on a cosmic dark canvas. Editorial typography (sans + italic serif accent word) anchors the dreamy gradient atmosphere.

PALETTE: ${palette.name} · ${palette.hero.en} (${palette.accent.toUpperCase()} / ${palette.accent2.toUpperCase()} / ${palette.accent3.toUpperCase()})

COLOR TOKENS:
--bg: #07071a
--bg-soft: #0c0c22
--text: #e9eaf3
--ink-1: rgba(233, 234, 243, 0.96)
--ink-2: rgba(233, 234, 243, 0.66)
--ink-3: rgba(233, 234, 243, 0.42)
--hairline: rgba(233, 234, 243, 0.08)
--hairline-bright: rgba(233, 234, 243, 0.16)
--accent: ${palette.accent}
--accent-2: ${palette.accent2}
--accent-3: ${palette.accent3}
--accent-soft: ${palette.soft}   /* lighter intro stop for the italic title gradient */
--accent-rgb: ${palette.accentRgb}
--accent-2-rgb: ${palette.accent2Rgb}
--accent-3-rgb: ${palette.accent3Rgb}
--line: rgba(var(--accent-rgb), 0.2)
No other accent colors.

TYPOGRAPHY:
Heading sans: Plus Jakarta Sans 300, tracking -0.045em, line-height 0.95
Accent word: Cormorant Garamond italic 500 — this is the signature italic serif sitting beside the sans h1, the only place the palette gradient is used as text fill.
Body: Plus Jakarta Sans 400, line-height 1.85, color var(--ink-2)
Mono: JetBrains Mono / IBM Plex Mono — used for eyebrow labels and the hex readout
Scale: 0.7rem mono eyebrow / 1rem body / clamp(2.6rem, 9vw, 7rem) hero
Title text effect: linear-gradient(118deg, var(--accent-soft) 0%, var(--accent) 28%, var(--accent-2) 58%, var(--accent-3) 92%) with background-clip text and a slow 12s shimmer.

PALETTE SWITCHER (defining feature):
A hairline-bordered pill row above the hero. Each chip carries 3 dot swatches (--accent / --accent-2 / --accent-3) + the mono uppercase name (e.g. ${palette.name}). Active chip: 1px solid var(--accent), soft glow 0 0 18px rgba(var(--accent-rgb), 0.3), name color shifts to var(--accent). A mono readout on the right shows the 3 hex values, slash-separated. Switching chips retints every aurora orb, every accent border/glow, and the prompt block within ~450ms.

UI:
- Hero: no card background, sits directly on the cosmic canvas. Eyebrow row uses mono 0.7rem + hairline rule. Below H1, a 4-column hero-meta dl row separated by hairline verticals (Palette / Surface / Texture / Motion).
- Spectral bands: stacked horizontal bars with hairline border, ID + name on the left, value + hex on the right. Each band's fill uses a linear-gradient between two palette tokens.
- Tiles / cards: border-radius 16px, 1px solid var(--hairline), backdrop-filter blur(8px), background rgba(var(--accent-rgb), 0.06).
- Buttons: border-radius 999px, 1px solid var(--accent), color var(--accent), background rgba(var(--accent-rgb), 0.08), padding 10px 18px. Hover: background rgba(var(--accent-rgb), 0.2), box-shadow 0 0 16px rgba(var(--accent-rgb), 0.3).
- Prompt box: border-radius 20px, 1px solid var(--hairline), backdrop-filter blur(12px), rgba(7, 7, 26, 0.7).

LAYOUT:
Container: width min(1180px, 92vw), padding 56px 24px 120px.
Hero margin-top: clamp(40px, 10vh, 120px).
Section header: numbered (01 / 02 / 03) + name + hairline rule + meta. Padding-top 28px between sections.

MOTION:
Aurora orbs: 2 pseudo-elements (.aurora::before 720x460, .aurora::after 600x600) + 1 mid orb (.aurora-mid 540x380).
Orb gradients (palette-driven):
  ::before linear-gradient(135deg, rgba(var(--accent-rgb), 0.42), rgba(var(--accent-2-rgb), 0.22))
  ::after  linear-gradient(225deg, rgba(var(--accent-3-rgb), 0.32), rgba(var(--accent-rgb), 0.22))
  mid     radial-gradient(ellipse, rgba(var(--accent-2-rgb), 0.22), transparent 70%)
filter: blur(140px) on pseudo-elements, blur(120px) on mid.
@keyframes drift — 16s ease-in-out infinite alternate (::after reversed with -8s delay)
@keyframes pulse — 10s ease-in-out infinite alternate (mid orb)
@keyframes shimmer — 12s ease-in-out infinite on the italic accent word
@keyframes glide — 1s ease both for hero entrance (eyebrow / h1 / lead / meta staggered 0.08s)
Respect prefers-reduced-motion: pause all orb keyframes.

RESPONSIVE:
- Mobile: hero-meta collapses to 2 columns, switcher chips wrap to two rows, orbs shrink with viewport but stay blurred.
- Desktop: max-width 1180px, switcher pill stretches across the top.

FORBIDDEN:
- Solid flat backgrounds without layered blur orbs.
- Borders thicker than 1px on content panels.
- Saturated warm jewel-tones (orange, amber, yellow) — palette swap must respect the active palette only.
- Sharp 0px border-radius on hero panels, tiles, or prompt box.
- Static backgrounds — all orbs continuously drift.
- Multiple gradient text spots — the italic accent word is the ONLY gradient text on the page.

OUTPUT:
1) Full color token list using palette ${palette.name}, plus the four reusable rgba(var(--*-rgb), α) recipes for orbs and accent hover states.
2) Palette switcher row with mono label, 3-dot swatch chips, active glow, and hex readout.
3) Hero / Spectral Bands / Tile grid / Prompt section structure.
4) Single-file HTML/CSS with drift / pulse / shimmer / glide keyframes and a prefers-reduced-motion guard.`}</pre>
            <pre data-lang="ko" hidden>{`오로라 그라디언트 스타일의 랜딩 페이지를 디자인해줘 — 우주적 다크 캔버스 위를 흐르는 유기적 발광 오브. 에디토리얼 타이포그래피(산세리프 + 이탤릭 세리프 강조 워드)가 몽환적인 그라데이션 분위기를 잡아준다.

팔레트: ${palette.name} · ${palette.hero.ko} (${palette.accent.toUpperCase()} / ${palette.accent2.toUpperCase()} / ${palette.accent3.toUpperCase()})

색상 토큰:
--bg: #07071a
--bg-soft: #0c0c22
--text: #e9eaf3
--ink-1: rgba(233, 234, 243, 0.96)
--ink-2: rgba(233, 234, 243, 0.66)
--ink-3: rgba(233, 234, 243, 0.42)
--hairline: rgba(233, 234, 243, 0.08)
--hairline-bright: rgba(233, 234, 243, 0.16)
--accent: ${palette.accent}
--accent-2: ${palette.accent2}
--accent-3: ${palette.accent3}
--accent-soft: ${palette.soft}   /* 이탤릭 타이틀 그라데이션의 밝은 도입 스톱 */
--accent-rgb: ${palette.accentRgb}
--accent-2-rgb: ${palette.accent2Rgb}
--accent-3-rgb: ${palette.accent3Rgb}
--line: rgba(var(--accent-rgb), 0.2)
다른 액센트 색상 사용 금지.

타이포그래피:
헤딩 산세리프: Plus Jakarta Sans 300, tracking -0.045em, line-height 0.95
액센트 워드: Cormorant Garamond italic 500 — h1 옆에 자리한 시그니처 이탤릭 세리프이며, 팔레트 그라데이션이 텍스트 fill로 사용되는 유일한 곳.
본문: Plus Jakarta Sans 400, line-height 1.85, color var(--ink-2)
모노: JetBrains Mono / IBM Plex Mono — 아이브로우 라벨과 hex 리드아웃에 사용
스케일: 0.7rem 모노 아이브로우 / 1rem 본문 / clamp(2.6rem, 9vw, 7rem) 히어로
타이틀 효과: linear-gradient(118deg, var(--accent-soft) 0%, var(--accent) 28%, var(--accent-2) 58%, var(--accent-3) 92%) + background-clip text + 12s shimmer.

팔레트 스위처(핵심 기능):
히어로 위 hairline 보더의 알약 줄. 칩마다 3개 도트 스워치(--accent / --accent-2 / --accent-3) + 모노 대문자 이름(예: ${palette.name}). 활성 칩: 1px solid var(--accent), 부드러운 글로우 0 0 18px rgba(var(--accent-rgb), 0.3), 이름 색상이 var(--accent)로 전환. 우측 모노 리드아웃은 3개 hex를 슬래시로 구분 표시. 칩 변경 시 모든 오로라 오브 / 액센트 보더·글로우 / 프롬프트가 ~450ms 안에 같이 톤이 바뀐다.

UI:
- 히어로: 카드 배경 없음, 우주적 캔버스 위에 그대로 얹는다. 아이브로우 줄은 모노 0.7rem + hairline rule. h1 아래 4열 hero-meta dl (Palette / Surface / Texture / Motion)을 hairline 세로선으로 구분.
- 스펙트럼 밴드: 가로 바 스택, hairline 보더, 좌측 ID + 이름, 우측 값 + hex. 각 밴드의 fill은 팔레트 토큰 2개로 그라데이션.
- 타일 / 카드: border-radius 16px, 1px solid var(--hairline), backdrop-filter blur(8px), background rgba(var(--accent-rgb), 0.06).
- 버튼: border-radius 999px, 1px solid var(--accent), color var(--accent), background rgba(var(--accent-rgb), 0.08), padding 10px 18px. Hover: background rgba(var(--accent-rgb), 0.2), box-shadow 0 0 16px rgba(var(--accent-rgb), 0.3).
- 프롬프트 박스: border-radius 20px, 1px solid var(--hairline), backdrop-filter blur(12px), rgba(7, 7, 26, 0.7).

레이아웃:
컨테이너: width min(1180px, 92vw), padding 56px 24px 120px.
히어로 margin-top: clamp(40px, 10vh, 120px).
섹션 헤더: 넘버(01 / 02 / 03) + 이름 + hairline rule + meta. 섹션 사이 padding-top 28px.

모션:
오로라 오브: 가상 요소 2개 (.aurora::before 720x460, .aurora::after 600x600) + 중간 오브 1개 (.aurora-mid 540x380).
오브 그라데이션(팔레트 기반):
  ::before linear-gradient(135deg, rgba(var(--accent-rgb), 0.42), rgba(var(--accent-2-rgb), 0.22))
  ::after  linear-gradient(225deg, rgba(var(--accent-3-rgb), 0.32), rgba(var(--accent-rgb), 0.22))
  mid     radial-gradient(ellipse, rgba(var(--accent-2-rgb), 0.22), transparent 70%)
filter: 가상 요소 blur(140px), 중간 blur(120px).
@keyframes drift — 16s ease-in-out infinite alternate (::after 는 -8s delay + reverse)
@keyframes pulse — 10s ease-in-out infinite alternate (중간 오브)
@keyframes shimmer — 12s ease-in-out infinite (이탤릭 액센트 워드)
@keyframes glide — 1s ease both, 히어로 등장 (eyebrow / h1 / lead / meta 0.08s 스태거)
prefers-reduced-motion 준수: 모든 오브 keyframe 일시정지.

반응형:
- 모바일: hero-meta 2열, 스위처 칩 두 줄 wrap, 오브는 뷰포트에 맞춰 축소하되 블러 유지.
- 데스크톱: max-width 1180px, 스위처 알약이 상단 가로로 펼쳐짐.

금지:
- 레이어드 블러 오브 없는 단색 평면 배경.
- 콘텐츠 패널에 1px 초과 보더.
- 채도 높은 따뜻한 주얼톤(오렌지/앰버/옐로) — 팔레트 스왑은 활성 팔레트 내에서만.
- 히어로 패널 / 타일 / 프롬프트 박스에 border-radius 0px.
- 정적 배경 — 모든 오브 연속 드리프트.
- 그라데이션 텍스트 다중 사용 — 이탤릭 액센트 워드가 페이지 내 유일한 그라데이션 텍스트여야 함.

출력:
1) 팔레트 ${palette.name} 기준 전체 색상 토큰 + 오브와 액센트 hover에 쓰이는 rgba(var(--*-rgb), α) 레시피.
2) 모노 라벨, 3-도트 스워치 칩, active 글로우, hex 리드아웃 포함 팔레트 스위처 줄.
3) Hero / Spectral Bands / Tile grid / Prompt 섹션 구조.
4) drift / pulse / shimmer / glide 키프레임과 prefers-reduced-motion 가드 포함 단일 파일 HTML/CSS.`}</pre>
            <pre data-lang="ja" hidden>{`オーロラグラディエントスタイルのランディングページをデザインしてください — 宇宙的なダークキャンバスの上を流れる有機的な発光オーブ。エディトリアルタイポグラフィ（サンセリフ + イタリックセリフのアクセントワード）が夢幻的なグラデーションムードを締める。

パレット: ${palette.name} · ${palette.hero.ja} (${palette.accent.toUpperCase()} / ${palette.accent2.toUpperCase()} / ${palette.accent3.toUpperCase()})

カラートークン:
--bg: #07071a
--bg-soft: #0c0c22
--text: #e9eaf3
--ink-1: rgba(233, 234, 243, 0.96)
--ink-2: rgba(233, 234, 243, 0.66)
--ink-3: rgba(233, 234, 243, 0.42)
--hairline: rgba(233, 234, 243, 0.08)
--hairline-bright: rgba(233, 234, 243, 0.16)
--accent: ${palette.accent}
--accent-2: ${palette.accent2}
--accent-3: ${palette.accent3}
--accent-soft: ${palette.soft}   /* イタリックタイトルグラデーションの明るい導入ストップ */
--accent-rgb: ${palette.accentRgb}
--accent-2-rgb: ${palette.accent2Rgb}
--accent-3-rgb: ${palette.accent3Rgb}
--line: rgba(var(--accent-rgb), 0.2)
他のアクセント色は使用禁止。

タイポグラフィ:
見出しサンセリフ: Plus Jakarta Sans 300, tracking -0.045em, line-height 0.95
アクセントワード: Cormorant Garamond italic 500 — h1 の横に並ぶシグネチャーイタリックセリフ。パレットグラデーションがテキスト fill として使われる唯一の場所。
本文: Plus Jakarta Sans 400, line-height 1.85, color var(--ink-2)
モノ: JetBrains Mono / IBM Plex Mono — アイブロウラベルと hex リードアウトで使用
スケール: 0.7rem モノアイブロウ / 1rem 本文 / clamp(2.6rem, 9vw, 7rem) ヒーロー
タイトル効果: linear-gradient(118deg, var(--accent-soft) 0%, var(--accent) 28%, var(--accent-2) 58%, var(--accent-3) 92%) + background-clip text + 12s shimmer。

パレットスイッチャー（核心機能）:
ヒーロー上の hairline ボーダーピル列。各チップに 3 個のドットスウォッチ（--accent / --accent-2 / --accent-3）+ モノ大文字の名前（例: ${palette.name}）。アクティブチップ: 1px solid var(--accent)、ソフトグロー 0 0 18px rgba(var(--accent-rgb), 0.3)、名前色が var(--accent) に切替。右側のモノリードアウトは 3 つの hex をスラッシュ区切りで表示。チップ変更で全オーロラオーブ・アクセントボーダー/グロー・プロンプトが ~450ms 以内に同調して色変わる。

UI:
- ヒーロー: カード背景なし、宇宙的キャンバスに直接配置。アイブロウ行はモノ 0.7rem + hairline rule。h1 の下に 4 列 hero-meta dl (Palette / Surface / Texture / Motion) を hairline 縦線で区切る。
- スペクトラムバンド: 横バーのスタック、hairline ボーダー、左に ID + 名前、右に値 + hex。各バンドの fill はパレットトークン 2 つでグラデーション。
- タイル / カード: border-radius 16px, 1px solid var(--hairline), backdrop-filter blur(8px), background rgba(var(--accent-rgb), 0.06)。
- ボタン: border-radius 999px, 1px solid var(--accent), color var(--accent), background rgba(var(--accent-rgb), 0.08), padding 10px 18px。Hover: background rgba(var(--accent-rgb), 0.2), box-shadow 0 0 16px rgba(var(--accent-rgb), 0.3)。
- プロンプトボックス: border-radius 20px, 1px solid var(--hairline), backdrop-filter blur(12px), rgba(7, 7, 26, 0.7)。

レイアウト:
コンテナ: width min(1180px, 92vw), padding 56px 24px 120px。
ヒーロー margin-top: clamp(40px, 10vh, 120px)。
セクションヘッダー: ナンバー (01 / 02 / 03) + 名前 + hairline rule + meta。セクション間 padding-top 28px。

モーション:
オーロラオーブ: 疑似要素 2 つ (.aurora::before 720x460, .aurora::after 600x600) + 中間オーブ 1 つ (.aurora-mid 540x380)。
オーブグラデーション（パレット駆動）:
  ::before linear-gradient(135deg, rgba(var(--accent-rgb), 0.42), rgba(var(--accent-2-rgb), 0.22))
  ::after  linear-gradient(225deg, rgba(var(--accent-3-rgb), 0.32), rgba(var(--accent-rgb), 0.22))
  mid     radial-gradient(ellipse, rgba(var(--accent-2-rgb), 0.22), transparent 70%)
filter: 疑似要素 blur(140px), 中間 blur(120px)。
@keyframes drift — 16s ease-in-out infinite alternate (::after は -8s delay + reverse)
@keyframes pulse — 10s ease-in-out infinite alternate (中間オーブ)
@keyframes shimmer — 12s ease-in-out infinite (イタリックアクセントワード)
@keyframes glide — 1s ease both, ヒーロー登場 (eyebrow / h1 / lead / meta を 0.08s スタガー)
prefers-reduced-motion 尊重: 全オーブの keyframe を一時停止。

レスポンシブ:
- モバイル: hero-meta 2 列、スイッチャーチップ 2 行 wrap、オーブはビューポートに合わせ縮小するもブラー維持。
- デスクトップ: max-width 1180px、スイッチャーピルが上部に横展開。

禁止:
- レイヤードブラーオーブのない単色フラット背景。
- コンテンツパネルの 1px 超ボーダー。
- 彩度の高い暖色ジュエルトーン（オレンジ・アンバー・イエロー）— パレットスワップは現在のパレット内で完結。
- ヒーローパネル / タイル / プロンプトボックスの border-radius 0px。
- 静的背景 — すべてのオーブが連続ドリフト。
- グラデーションテキストの複数使用 — イタリックアクセントワードがページ内唯一のグラデーションテキスト。

出力:
1) パレット ${palette.name} を使った全カラートークン + オーブとアクセントホバーに使う rgba(var(--*-rgb), α) レシピ。
2) モノラベル、3-ドットスウォッチチップ、active グロー、hex リードアウト入りパレットスイッチャー列。
3) Hero / Spectral Bands / Tile grid / Prompt セクション構造。
4) drift / pulse / shimmer / glide キーフレームと prefers-reduced-motion ガード入り単一ファイル HTML/CSS。`}</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/liquid-metal.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Liquid Metal</span></a><div className="page-nav__divider" /><a href="/pages/zen-minimalism.html"><span><span className="page-nav__label">다음</span>Zen Minimalism</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
