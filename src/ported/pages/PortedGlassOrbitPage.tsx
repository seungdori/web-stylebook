import { useRef, useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { ColorModeToggle } from '../ColorModeToggle';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';
import './PortedGlassOrbitPage.css';

type GlassPalette = {
  id: string;
  name: string;
  tagline: { en: string; ko: string; ja: string };
  vars: {
    bg1: string;
    bg2: string;
    bg3: string;
    text: string;
    bleedA: string;
    bleedB: string;
    orb1: string;
    orb2: string;
    orb3: string;
  };
};

const GLASS_PALETTES: GlassPalette[] = [
  {
    id: 'dawn',
    name: 'DAWN',
    tagline: { en: 'coral · gold · lavender', ko: '코랄 · 골드 · 라벤더', ja: 'コーラル・ゴールド・ラベンダー' },
    vars: {
      bg1: '#3a1820',
      bg2: '#8a4636',
      bg3: '#d28e6a',
      text: '#fff0e0',
      bleedA: 'rgba(255, 199, 110, 0.45)',
      bleedB: 'rgba(196, 152, 240, 0.32)',
      orb1: 'rgba(255, 180, 110, 0.50)',
      orb2: 'rgba(220, 145, 195, 0.42)',
      orb3: 'rgba(255, 220, 180, 0.40)',
    },
  },
  {
    id: 'noon',
    name: 'NOON',
    tagline: { en: 'sky · sunlight · cyan', ko: '스카이 · 햇살 · 시안', ja: 'スカイ・サンライト・シアン' },
    vars: {
      bg1: '#2d5a85',
      bg2: '#4d7fa8',
      bg3: '#a3c8e0',
      text: '#f5fbff',
      bleedA: 'rgba(255, 255, 255, 0.45)',
      bleedB: 'rgba(150, 215, 245, 0.35)',
      orb1: 'rgba(255, 255, 255, 0.48)',
      orb2: 'rgba(165, 220, 240, 0.50)',
      orb3: 'rgba(120, 180, 230, 0.42)',
    },
  },
  {
    id: 'dusk',
    name: 'DUSK',
    tagline: { en: 'plum · magenta · orange', ko: '플럼 · 마젠타 · 오렌지', ja: 'プラム・マゼンタ・オレンジ' },
    vars: {
      bg1: '#1f1230',
      bg2: '#4b2752',
      bg3: '#7b3f5a',
      text: '#fbeaf3',
      bleedA: 'rgba(255, 100, 200, 0.40)',
      bleedB: 'rgba(255, 145, 90, 0.28)',
      orb1: 'rgba(255, 110, 210, 0.50)',
      orb2: 'rgba(255, 160, 100, 0.40)',
      orb3: 'rgba(220, 130, 230, 0.40)',
    },
  },
  {
    id: 'night',
    name: 'NIGHT',
    tagline: { en: 'deepest black · barely there', ko: '가장 깊은 검정', ja: '最も深い黒' },
    vars: {
      bg1: '#000000',
      bg2: '#010103',
      bg3: '#020207',
      text: '#cfd0d8',
      bleedA: 'rgba(200, 210, 240, 0.025)',
      bleedB: 'rgba(110, 100, 180, 0.03)',
      orb1: 'rgba(140, 160, 220, 0.08)',
      orb2: 'rgba(70, 60, 140, 0.08)',
      orb3: 'rgba(40, 60, 120, 0.10)',
    },
  },
  {
    id: 'abyss',
    name: 'ABYSS',
    tagline: { en: 'near-black · trace cyan/magenta', ko: '니어블랙 · 미세 시안/마젠타', ja: 'ニア・ブラック・微細シアン/マゼンタ' },
    vars: {
      bg1: '#050608',
      bg2: '#0d1018',
      bg3: '#181c26',
      text: '#d9dde6',
      bleedA: 'rgba(80, 220, 240, 0.22)',
      bleedB: 'rgba(220, 80, 200, 0.20)',
      orb1: 'rgba(60, 200, 230, 0.32)',
      orb2: 'rgba(220, 80, 200, 0.30)',
      orb3: 'rgba(120, 200, 240, 0.25)',
    },
  },
];

export function PortedGlassOrbitPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  const [activeId, setActiveId] = useState<string>('dusk');
  const palette = GLASS_PALETTES.find((p) => p.id === activeId) ?? GLASS_PALETTES[2];

  const styleVars = {
    ['--bg1' as string]: palette.vars.bg1,
    ['--bg2' as string]: palette.vars.bg2,
    ['--bg3' as string]: palette.vars.bg3,
    ['--text' as string]: palette.vars.text,
    ['--bleed-a' as string]: palette.vars.bleedA,
    ['--bleed-b' as string]: palette.vars.bleedB,
    ['--orb-1' as string]: palette.vars.orb1,
    ['--orb-2' as string]: palette.vars.orb2,
    ['--orb-3' as string]: palette.vars.orb3,
  } as CSSProperties;

  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--glass-orbit" style={styleVars} data-palette={palette.id}>
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
        <main className="wrap">
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
                <ColorModeToggle pageKey="glass-orbit" />
                <button className="theme-toggle" id="global-theme-reset" aria-label="Reset Global Theme" data-color="Reset Global Theme" title="Reset Global Theme">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>
          {/* ════ TIME-OF-DAY PALETTE SWITCHER ════ */}
          <section className="atmo-switcher" aria-label="Time of day palette">
            <div className="atmo-switcher__head">
              <span className="atmo-switcher__sig" aria-hidden="true">◐</span>
              <span className="atmo-switcher__title">
                <span data-lang="en">Atmosphere</span>
                <span data-lang="ko" hidden>분위기</span>
                <span data-lang="ja" hidden>雰囲気</span>
              </span>
              <span className="atmo-switcher__rule" aria-hidden="true" />
              <span className="atmo-switcher__meta">5 · TIME OF DAY</span>
            </div>
            <div className="atmo-switcher__chips" role="radiogroup" aria-label="Atmosphere preset">
              {GLASS_PALETTES.map((p) => {
                const isActive = p.id === activeId;
                const tagline = p.tagline[lang as 'en' | 'ko' | 'ja'] ?? p.tagline.en;
                const gradient = `linear-gradient(110deg, ${p.vars.bg1}, ${p.vars.bg2} 50%, ${p.vars.bg3})`;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    className={`atmo-chip${isActive ? ' is-active' : ''}`}
                    onClick={() => setActiveId(p.id)}
                  >
                    <span className="atmo-chip__sky" aria-hidden="true" style={{ background: gradient }}>
                      <span className="atmo-chip__bleed atmo-chip__bleed--a" style={{ background: `radial-gradient(circle at 22% 30%, ${p.vars.bleedA}, transparent 60%)` }} />
                      <span className="atmo-chip__bleed atmo-chip__bleed--b" style={{ background: `radial-gradient(circle at 78% 75%, ${p.vars.bleedB}, transparent 60%)` }} />
                      <span className="atmo-chip__orb" style={{ background: `radial-gradient(circle, ${p.vars.orb1}, transparent 65%)` }} />
                    </span>
                    <span className="atmo-chip__text">
                      <span className="atmo-chip__name">{p.name}</span>
                      <span className="atmo-chip__tagline">{tagline}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
          {/* ════ COSMIC ATMOSPHERE ════ */}
          <div className="cosmic-bg" aria-hidden="true">
            <div className="cosmic-bg__orb cosmic-bg__orb--1" />
            <div className="cosmic-bg__orb cosmic-bg__orb--2" />
            <div className="cosmic-bg__orb cosmic-bg__orb--3" />
            <div className="cosmic-bg__grid" />
            <div className="cosmic-bg__grain" />
            <div className="cosmic-bg__star cosmic-bg__star--a" />
            <div className="cosmic-bg__star cosmic-bg__star--b" />
            <div className="cosmic-bg__star cosmic-bg__star--c" />
            <div className="cosmic-bg__star cosmic-bg__star--d" />
            <div className="cosmic-bg__star cosmic-bg__star--e" />
          </div>
          {/* ════ HUD STRIP ════ */}
          <div className="hud-strip" aria-hidden="true">
            <span className="hud-strip__sig">▮▮▯▮▯ </span>
            <span>LAT 24.18°</span>
            <span className="hud-strip__dot" />
            <span>LON 152.04°</span>
            <span className="hud-strip__dot" />
            <span>OBS · GLASS ORBIT</span>
            <span className="hud-strip__dot" />
            <span>FRAME 0274</span>
            <span className="hud-strip__pulse" />
            <span className="hud-strip__live">LIVE</span>
          </div>
          {/* ════ HERO PANEL ════ */}
          <section className="hero">
            <div className="hero__core" aria-hidden="true">
              <div className="hero__core-halo" />
              <div className="hero__core-orb" />
              <div className="hero__core-ring" />
              <div className="hero__core-ring hero__core-ring--alt" />
              <div className="hero__core-flare" />
            </div>
            <div className="hero__eyebrow" aria-hidden="true">
              <span>·</span>
              <span>008 / GLASSMORPHISM CASE STUDY</span>
              <span>·</span>
            </div>
            <h1>Glass Layers<br />Around Data</h1>
            <p className="lead" data-lang="en">
              Treat glassmorphism as nothing more than "transparent cards" and the result falls flat. As this page shows, you have to ask for background depth, per-layer transparency, and edge highlights together to get a result with real density.
            </p>
            <p className="lead" data-lang="ko" hidden>
              글래스모피즘을 그냥 "투명한 카드"로만 다루면 밋밋해집니다. 이 페이지처럼 배경의 깊이,
              레이어마다 다른 투명도, 가장자리 하이라이트를 함께 주문해야 밀도 있는 화면이 나옵니다.
            </p>
            <p className="lead" data-lang="ja" hidden>
              グラスモーフィズムをただの「透明なカード」として扱うと、のっぺりした見た目になります。このページのように、背景の奥行き、レイヤーごとに変える透明度、エッジのハイライトをまとめて指定して、はじめて密度のある画面に仕上がります。
            </p>
            <div className="hero__chips">
              <span className="hero__chip"><b>backdrop-filter</b> blur(18px)</span>
              <span className="hero__chip"><b>saturate</b> 135%</span>
              <span className="hero__chip"><b>border</b> 1px / 28% white</span>
              <span className="hero__chip"><b>inset</b> 0 0 60px rgba(100,180,255,0.12)</span>
            </div>
          </section>
          {/* ════ SPECIMEN — NOW PLAYING ════ */}
          <section className="specimen-section">
            <div className="section-eyebrow">
              <span className="section-eyebrow__num">01 / 06</span>
              <span className="section-eyebrow__bar" />
              <span data-lang="en">Style in Practice</span>
              <span data-lang="ko" hidden>실제 적용 예시</span>
              <span data-lang="ja" hidden>実践</span>
            </div>
            <h2 data-lang="en">Specimen — Now Playing</h2>
            <h2 data-lang="ko" hidden>스페시먼 — 재생 중</h2>
            <h2 data-lang="ja" hidden>スペシメン — 再生中</h2>
            <div className="specimen-row">
              <div className="specimen">
                <div className="specimen__cover" aria-hidden="true">
                  <div className="specimen__cover-disc" />
                  <div className="specimen__cover-ring" />
                  <span className="specimen__cover-tag">FM · 24</span>
                </div>
                <div className="specimen__body">
                  <div className="specimen__meta">
                    <span className="specimen__pulse" />
                    <span data-lang="en">Now Streaming</span>
                    <span data-lang="ko" hidden>스트리밍 중</span>
                    <span data-lang="ja" hidden>ストリーミング中</span>
                  </div>
                  <div className="specimen__title">Lunar Phase 04</div>
                  <div className="specimen__artist">Aurora Sessions</div>
                  <div className="specimen__bars" aria-hidden="true">
                    <span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
                  </div>
                  <div className="specimen__progress" aria-hidden="true">
                    <span className="specimen__progress-fill" />
                    <span className="specimen__progress-thumb" />
                  </div>
                  <div className="specimen__time">
                    <span>02:14</span><span>04:32</span>
                  </div>
                  <div className="specimen__controls">
                    <button type="button" aria-label="previous">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
                    </button>
                    <button type="button" className="is-primary" aria-label="play">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </button>
                    <button type="button" aria-label="next">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm10-12v12h2V6h-2z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
              <aside className="specimen-aside">
                <div className="specimen-aside__row">
                  <span className="specimen-aside__k" data-lang="en">Codec</span>
                  <span className="specimen-aside__k" data-lang="ko" hidden>코덱</span>
                  <span className="specimen-aside__k" data-lang="ja" hidden>コーデック</span>
                  <span className="specimen-aside__v">FLAC · 24bit</span>
                </div>
                <div className="specimen-aside__row">
                  <span className="specimen-aside__k" data-lang="en">Sample</span>
                  <span className="specimen-aside__k" data-lang="ko" hidden>샘플</span>
                  <span className="specimen-aside__k" data-lang="ja" hidden>サンプル</span>
                  <span className="specimen-aside__v">96.0 kHz</span>
                </div>
                <div className="specimen-aside__row">
                  <span className="specimen-aside__k" data-lang="en">Bitrate</span>
                  <span className="specimen-aside__k" data-lang="ko" hidden>비트레이트</span>
                  <span className="specimen-aside__k" data-lang="ja" hidden>ビットレート</span>
                  <span className="specimen-aside__v">2.304 Mbps</span>
                </div>
                <div className="specimen-aside__row">
                  <span className="specimen-aside__k" data-lang="en">Signal</span>
                  <span className="specimen-aside__k" data-lang="ko" hidden>신호</span>
                  <span className="specimen-aside__k" data-lang="ja" hidden>信号</span>
                  <span className="specimen-aside__v specimen-aside__v--good">STABLE ⬤</span>
                </div>
                <div className="specimen-aside__waveform" aria-hidden="true">
                  <svg viewBox="0 0 200 40" preserveAspectRatio="none">
                    <path d="M0 20 Q 10 4, 20 20 T 40 20 T 60 20 T 80 20 T 100 20 T 120 20 T 140 20 T 160 20 T 180 20 T 200 20" stroke="rgba(255,255,255,0.6)" fill="none" strokeWidth="1.2"/>
                    <path d="M0 20 Q 10 30, 20 20 T 40 20 T 60 20 T 80 20 T 100 20 T 120 20 T 140 20 T 160 20 T 180 20 T 200 20" stroke="rgba(120,180,255,0.4)" fill="none" strokeWidth="1"/>
                  </svg>
                </div>
              </aside>
            </div>
          </section>
          {/* ════ ORBIT RING ════ */}
          <section className="orbit-ring-section">
            <div className="section-eyebrow">
              <span className="section-eyebrow__num">02 / 06</span>
              <span className="section-eyebrow__bar" />
              <span data-lang="en">Spatial Depth</span>
              <span data-lang="ko" hidden>공간의 깊이</span>
              <span data-lang="ja" hidden>空間の奥行き</span>
            </div>
            <h2 data-lang="en">Orbit Ring</h2>
            <h2 data-lang="ko" hidden>오비트 링</h2>
            <h2 data-lang="ja" hidden>オービットリング</h2>
            <div className="orbit-ring-wrapper">
              <div className="orbit-ring orbit-ring--outer" />
              <div className="orbit-ring" />
              <div className="orbit-ring-inner" />

              <div className="orbit-core" aria-hidden="true">
                <div className="orbit-core__corona" />
                <div className="orbit-core__sphere">
                  <div className="orbit-core__bands" />
                  <div className="orbit-core__terminator" />
                  <div className="orbit-core__rimlight" />
                </div>
                <div className="orbit-core__halo" />
                <div className="orbit-core__highlight" />
              </div>

              <div className="orbit-comet" aria-hidden="true">
                <span className="orbit-comet__head" />
                <span className="orbit-comet__trail" />
              </div>

              <div className="orbit-tick orbit-tick--a" aria-hidden="true" />
              <div className="orbit-tick orbit-tick--b" aria-hidden="true" />
              <div className="orbit-tick orbit-tick--c" aria-hidden="true" />
              <div className="orbit-tick orbit-tick--d" aria-hidden="true" />
              {/* Satellite 1 — blur(12px) */}
              <div className="satellite satellite--1">
                <span className="satellite__label">blur(12px)</span>
                <span data-lang="en">Foreground layer — crisp edges, lightest glass</span>
                <span data-lang="ko" hidden>전경 레이어 — 선명한 엣지, 가장 가벼운 유리</span>
                <span data-lang="ja" hidden>前景レイヤー — 鮮明なエッジ、最も軽いガラス</span>
              </div>
              {/* Satellite 2 — blur(18px) */}
              <div className="satellite satellite--2">
                <span className="satellite__label">blur(18px)</span>
                <span data-lang="en">Mid layer — softened depth, medium frost</span>
                <span data-lang="ko" hidden>중간 레이어 — 부드러운 깊이, 중간 서리</span>
                <span data-lang="ja" hidden>中間レイヤー — 柔らかな深み、中程度のフロスト</span>
              </div>
              {/* Satellite 3 — blur(24px) */}
              <div className="satellite satellite--3">
                <span className="satellite__label">blur(24px)</span>
                <span data-lang="en">Back layer — heavy diffusion, deep glass</span>
                <span data-lang="ko" hidden>후경 레이어 — 강한 확산, 깊은 유리</span>
                <span data-lang="ja" hidden>後景レイヤー — 強い拡散、深いガラス</span>
              </div>
            </div>
          </section>
          {/* ════ DEPTH STACK ════ */}
          <section className="depth-stack-section">
            <div className="section-eyebrow">
              <span className="section-eyebrow__num">03 / 06</span>
              <span className="section-eyebrow__bar" />
              <span data-lang="en">Layer Cross-Section</span>
              <span data-lang="ko" hidden>레이어 단면</span>
              <span data-lang="ja" hidden>レイヤー断面</span>
            </div>
            <h2 data-lang="en">Depth Stack</h2>
            <h2 data-lang="ko" hidden>뎁스 스택</h2>
            <h2 data-lang="ja" hidden>デプススタック</h2>
            <div className="depth-stack">
              <div className="depth-panel depth-panel--1">
                <span className="depth-panel__num">01</span>
                <span className="depth-panel__copy">
                  <span data-lang="en">Layer 1 — bg: 0.1 alpha</span>
                  <span data-lang="ko" hidden>레이어 1 — bg: 0.1 알파</span>
                  <span data-lang="ja" hidden>レイヤー 1 — bg: 0.1 アルファ</span>
                </span>
                <span className="depth-panel__tag">border 0.15</span>
              </div>
              <div className="depth-panel depth-panel--2">
                <span className="depth-panel__num">02</span>
                <span className="depth-panel__copy">
                  <span data-lang="en">Layer 2 — bg: 0.2 alpha</span>
                  <span data-lang="ko" hidden>레이어 2 — bg: 0.2 알파</span>
                  <span data-lang="ja" hidden>レイヤー 2 — bg: 0.2 アルファ</span>
                </span>
                <span className="depth-panel__tag">border 0.28</span>
              </div>
              <div className="depth-panel depth-panel--3">
                <span className="depth-panel__num">03</span>
                <span className="depth-panel__copy">
                  <span data-lang="en">Layer 3 — bg: 0.3 alpha</span>
                  <span data-lang="ko" hidden>레이어 3 — bg: 0.3 알파</span>
                  <span data-lang="ja" hidden>レイヤー 3 — bg: 0.3 アルファ</span>
                </span>
                <span className="depth-panel__tag">border 0.40</span>
              </div>
            </div>
          </section>
          {/* ════ GLASS PROPERTIES BAR ════ */}
          <section className="glass-props-section">
            <div className="section-eyebrow">
              <span className="section-eyebrow__num">04 / 06</span>
              <span className="section-eyebrow__bar" />
              <span data-lang="en">Spec Sheet</span>
              <span data-lang="ko" hidden>스펙 시트</span>
              <span data-lang="ja" hidden>スペックシート</span>
            </div>
            <div className="glass-props">
              <div className="glass-prop">
                <span className="glass-prop__head">
                  <svg className="glass-prop__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9" opacity=".35"/></svg>
                  <span className="glass-prop__abbr">BLR</span>
                </span>
                <span className="glass-prop__value">18<small>px</small></span>
                <span className="glass-prop__label" data-lang="en">Blur</span>
                <span className="glass-prop__label" data-lang="ko" hidden>블러</span>
                <span className="glass-prop__label" data-lang="ja" hidden>ブラー</span>
                <span className="glass-prop__bar"><span style={{ width: '60%' }} /></span>
              </div>
              <div className="glass-prop">
                <span className="glass-prop__head">
                  <svg className="glass-prop__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><rect x="8" y="8" width="8" height="8" rx="1.5" opacity=".4"/></svg>
                  <span className="glass-prop__abbr">BRD</span>
                </span>
                <span className="glass-prop__value">0.28</span>
                <span className="glass-prop__label" data-lang="en">Border Opacity</span>
                <span className="glass-prop__label" data-lang="ko" hidden>보더 불투명도</span>
                <span className="glass-prop__label" data-lang="ja" hidden>ボーダー不透明度</span>
                <span className="glass-prop__bar"><span style={{ width: '28%' }} /></span>
              </div>
              <div className="glass-prop">
                <span className="glass-prop__head">
                  <svg className="glass-prop__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 18 L9 6 L15 14 L21 8" /></svg>
                  <span className="glass-prop__abbr">BG·α</span>
                </span>
                <span className="glass-prop__value">0.24</span>
                <span className="glass-prop__label" data-lang="en">BG Alpha</span>
                <span className="glass-prop__label" data-lang="ko" hidden>배경 알파</span>
                <span className="glass-prop__label" data-lang="ja" hidden>背景アルファ</span>
                <span className="glass-prop__bar"><span style={{ width: '24%' }} /></span>
              </div>
              <div className="glass-prop">
                <span className="glass-prop__head">
                  <svg className="glass-prop__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="5" y="5" width="11" height="11" rx="2"/><rect x="9" y="9" width="11" height="11" rx="2" opacity=".5"/></svg>
                  <span className="glass-prop__abbr">SHD</span>
                </span>
                <span className="glass-prop__value">28<small>px</small></span>
                <span className="glass-prop__label" data-lang="en">Shadow Offset</span>
                <span className="glass-prop__label" data-lang="ko" hidden>그림자 오프셋</span>
                <span className="glass-prop__label" data-lang="ja" hidden>シャドウオフセット</span>
                <span className="glass-prop__bar"><span style={{ width: '70%' }} /></span>
              </div>
            </div>
          </section>
          {/* ════ REFRACTION MATRIX ════ */}
          <section className="refraction-section">
            <div className="section-eyebrow">
              <span className="section-eyebrow__num">05 / 06</span>
              <span className="section-eyebrow__bar" />
              <span data-lang="en">Refraction Matrix</span>
              <span data-lang="ko" hidden>굴절 매트릭스</span>
              <span data-lang="ja" hidden>屈折マトリクス</span>
            </div>
            <h2 data-lang="en">Refraction Matrix</h2>
            <h2 data-lang="ko" hidden>굴절 매트릭스</h2>
            <h2 data-lang="ja" hidden>屈折マトリクス</h2>
            <p className="refraction-lead" data-lang="en">Same composition, different blur · saturate combos. Live demo — what each line of CSS actually does.</p>
            <p className="refraction-lead" data-lang="ko" hidden>구성은 같고 blur · saturate 조합만 다릅니다. CSS 한 줄이 실제로 무엇을 바꾸는지 바로 확인하세요.</p>
            <p className="refraction-lead" data-lang="ja" hidden>構成は同じで、blur · saturate の組み合わせだけが違います。CSS の1行が実際に何を変えるか、その場で確かめてください。</p>
            <div className="refraction-grid">
              <div className="refraction-tile refraction-tile--a">
                <span className="refraction-tile__inner" />
                <span className="refraction-tile__formula">blur(4px)</span>
                <span className="refraction-tile__sat">saturate 100%</span>
              </div>
              <div className="refraction-tile refraction-tile--b">
                <span className="refraction-tile__inner" />
                <span className="refraction-tile__formula">blur(12px)</span>
                <span className="refraction-tile__sat">saturate 120%</span>
              </div>
              <div className="refraction-tile refraction-tile--c">
                <span className="refraction-tile__inner" />
                <span className="refraction-tile__formula">blur(20px)</span>
                <span className="refraction-tile__sat">saturate 140%</span>
              </div>
              <div className="refraction-tile refraction-tile--d">
                <span className="refraction-tile__inner" />
                <span className="refraction-tile__formula">blur(8px)</span>
                <span className="refraction-tile__sat">saturate 180%</span>
              </div>
              <div className="refraction-tile refraction-tile--e">
                <span className="refraction-tile__inner" />
                <span className="refraction-tile__formula">blur(24px)</span>
                <span className="refraction-tile__sat">saturate 110%</span>
              </div>
              <div className="refraction-tile refraction-tile--f">
                <span className="refraction-tile__inner" />
                <span className="refraction-tile__formula">blur(32px)</span>
                <span className="refraction-tile__sat">saturate 160%</span>
              </div>
            </div>
          </section>
          {/* ════ TOKEN SPECTRUM ════ */}
          <section className="spectrum-section">
            <div className="section-eyebrow">
              <span className="section-eyebrow__num">06 / 06</span>
              <span className="section-eyebrow__bar" />
              <span data-lang="en">Color + Code</span>
              <span data-lang="ko" hidden>컬러 + 코드</span>
              <span data-lang="ja" hidden>カラー + コード</span>
            </div>
            <h2 data-lang="en">Token Spectrum</h2>
            <h2 data-lang="ko" hidden>토큰 스펙트럼</h2>
            <h2 data-lang="ja" hidden>トークンスペクトラム</h2>
            <div className="spectrum">
              <div className="spectrum-chip" style={{ ['--swatch' as string]: '#132039' }}>
                <span className="spectrum-chip__swatch" />
                <span className="spectrum-chip__name">--bg1</span>
                <span className="spectrum-chip__hex">#132039</span>
              </div>
              <div className="spectrum-chip" style={{ ['--swatch' as string]: '#245970' }}>
                <span className="spectrum-chip__swatch" />
                <span className="spectrum-chip__name">--bg2</span>
                <span className="spectrum-chip__hex">#245970</span>
              </div>
              <div className="spectrum-chip" style={{ ['--swatch' as string]: '#7b4f72' }}>
                <span className="spectrum-chip__swatch" />
                <span className="spectrum-chip__name">--bg3</span>
                <span className="spectrum-chip__hex">#7b4f72</span>
              </div>
              <div className="spectrum-chip" style={{ ['--swatch' as string]: 'rgba(37,123,255,0.42)' }}>
                <span className="spectrum-chip__swatch" />
                <span className="spectrum-chip__name">--bleed-a</span>
                <span className="spectrum-chip__hex">rgba(37,123,255,.42)</span>
              </div>
              <div className="spectrum-chip" style={{ ['--swatch' as string]: 'rgba(237,124,195,0.28)' }}>
                <span className="spectrum-chip__swatch" />
                <span className="spectrum-chip__name">--bleed-b</span>
                <span className="spectrum-chip__hex">rgba(237,124,195,.28)</span>
              </div>
              <div className="spectrum-chip" style={{ ['--swatch' as string]: '#eff8ff' }}>
                <span className="spectrum-chip__swatch" />
                <span className="spectrum-chip__name">--text</span>
                <span className="spectrum-chip__hex">#eff8ff</span>
              </div>
            </div>
            <div className="recipe-card">
              <div className="recipe-card__top">
                <span className="recipe-card__dot" />
                <span className="recipe-card__dot" />
                <span className="recipe-card__dot" />
                <span className="recipe-card__path">glass-panel.css</span>
                <span className="recipe-card__lang">CSS</span>
              </div>
              <pre className="recipe-card__code"><code>
{`.glass-panel {
  `}<span className="tok-k">background</span>{`: `}<span className="tok-v">linear-gradient</span>{`(140deg,
    `}<span className="tok-n">rgba</span>{`(255,255,255,0.24),
    `}<span className="tok-n">rgba</span>{`(255,255,255,0.10));
  `}<span className="tok-k">border</span>{`: 1px `}<span className="tok-v">solid</span>{` `}<span className="tok-n">rgba</span>{`(255,255,255,0.28);
  `}<span className="tok-k">border-radius</span>{`: 30px;
  `}<span className="tok-k">backdrop-filter</span>{`: `}<span className="tok-v">blur</span>{`(18px) `}<span className="tok-v">saturate</span>{`(135%);
  `}<span className="tok-k">box-shadow</span>{`:
    0 28px 45px `}<span className="tok-n">rgba</span>{`(0,0,0,0.26),
    `}<span className="tok-v">inset</span>{` 0 0 60px `}<span className="tok-n">rgba</span>{`(100,180,255,0.12);
}`}
              </code></pre>
            </div>
          </section>
          {/* ════ DESCRIPTION BLOCK ════ */}
          <div className="desc-block">
            <p data-lang="en">
              Glass Orbit builds layered transparency through three mechanisms: <strong>backdrop-filter blur</strong> for frosted depth, <strong>graduated border opacity</strong> to separate planes, and <strong>inset box-shadows</strong> that simulate internal light refraction. Each element floats at a distinct depth, creating a convincing orbital composition where panels feel physically stacked in space rather than painted onto a flat canvas.
            </p>
            <p data-lang="ko" hidden>
              Glass Orbit는 투명한 레이어를 세 가지 방식으로 겹쳐 쌓습니다. 서리 낀 깊이를 만드는 <strong>backdrop-filter blur</strong>, 면과 면을 갈라 주는 <strong>단계별 border 불투명도</strong>, 안쪽에서 빛이 굴절하는 느낌을 내는 <strong>inset box-shadow</strong>입니다. 요소마다 깊이가 달라서, 평평한 화면에 그려 넣은 그림이 아니라 패널이 실제로 공간에 쌓여 있는 듯한 궤도 화면이 만들어집니다.
            </p>
            <p data-lang="ja" hidden>
              Glass Orbit は、透明なレイヤーを3つの手法で重ねていきます。フロストの奥行きを生む<strong>backdrop-filter blur</strong>、面と面を分ける<strong>段階的な border の不透明度</strong>、内側で光が屈折するように見せる<strong>inset box-shadow</strong>です。要素ごとに深さが違うので、平らなキャンバスに描いた絵ではなく、パネルが実際に空間へ積み重なったような軌道の画面になります。
            </p>
          </div>
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Glass Orbit style — frosted-glass panels floating over a deep multi-gradient cosmos.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg1: #132039{"\n"}--bg2: #245970{"\n"}--bg3: #7b4f72{"\n"}--text: #eff8ff{"\n"}--border: rgba(255, 255, 255, 0.28){"\n"}--card-border: rgba(255, 255, 255, 0.35){"\n"}--card-bg: rgba(17, 22, 40, 0.25){"\n"}--hero-bg-start: rgba(255, 255, 255, 0.24){"\n"}--hero-bg-end: rgba(255, 255, 255, 0.1){"\n"}Background bleed: radial-gradient(circle at 12% 18%, rgba(37,123,255,0.42), transparent 38%), radial-gradient(circle at 80% 82%, rgba(237,124,195,0.28), transparent 34%).{"\n"}No other colors.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Heading: "Exo 2" 700, tracking default{"\n"}Body: "Noto Sans" 400{"\n"}Scale: clamp(2rem, 5.8vw, 4.8rem) for h1{"\n"}Body line-height: 1.75{"\n"}Heading line-height: 1{"\n"}{"\n"}UI:{"\n"}Hero card: border-radius 30px, border 1px solid var(--border), backdrop-filter blur(18px) saturate(135%), box-shadow 0 28px 45px rgba(0,0,0,0.26).{"\n"}Node cards: border-radius 16px, border 1px solid rgba(255,255,255,0.35), padding 14px, bg rgba(17,22,40,0.25).{"\n"}Prompt box: border-radius 18px, border 1px solid rgba(255,255,255,0.42), bg rgba(9,15,28,0.55).{"\n"}Buttons: pill shape (border-radius 999px), 1px solid rgba(255,255,255,0.52), bg rgba(255,255,255,0.1).{"\n"}{"\n"}LAYOUT:{"\n"}Content max-width: min(1080px, 92vw){"\n"}Wrapper padding: 30px 0 78px{"\n"}Hero padding: clamp(22px, 5vw, 50px){"\n"}Card grid: repeat(auto-fit, minmax(190px, 1fr)), gap 12px{"\n"}Lead max-width: 680px{"\n"}{"\n"}MOTION:{"\n"}Entrance: translateY(14px) → 0, opacity 0 → 1, 800ms ease, stagger 100ms per card{"\n"}Hover: none specified — keep subtle{"\n"}Respect prefers-reduced-motion.{"\n"}{"\n"}RESPONSIVE:{"\n"}768px: card grid collapses to 1 column, hero padding reduces via clamp{"\n"}1024px: full 3-column auto-fit grid, max-width 1080px layout{"\n"}{"\n"}FORBIDDEN:{"\n"}- Opaque solid backgrounds (transparency is essential to the style){"\n"}- Blur-less transparent panels (all glass panels must combine blur + border + shadow){"\n"}- Text contrast below 4.5:1 on any transparent surface{"\n"}- Serif or monospace fonts{"\n"}- Horizontal scroll at any viewport{"\n"}- Sharp corners (minimum border-radius 16px){"\n"}{"\n"}OUTPUT:{"\n"}1) Color + typography tokens as CSS custom properties{"\n"}2) Hero / Stats (3-column node grid) / CTA structure{"\n"}3) Semantic HTML + CSS with responsive support</pre>
            <pre data-lang="ko" hidden>Glass Orbit 스타일의 랜딩 페이지를 디자인해줘 — 깊은 다중 그라데이션 우주 위에 떠 있는 프로스트 글래스 패널.{"\n"}{"\n"}색상 토큰:{"\n"}--bg1: #132039{"\n"}--bg2: #245970{"\n"}--bg3: #7b4f72{"\n"}--text: #eff8ff{"\n"}--border: rgba(255, 255, 255, 0.28){"\n"}--card-border: rgba(255, 255, 255, 0.35){"\n"}--card-bg: rgba(17, 22, 40, 0.25){"\n"}--hero-bg-start: rgba(255, 255, 255, 0.24){"\n"}--hero-bg-end: rgba(255, 255, 255, 0.1){"\n"}배경 번짐: radial-gradient(circle at 12% 18%, rgba(37,123,255,0.42), transparent 38%), radial-gradient(circle at 80% 82%, rgba(237,124,195,0.28), transparent 34%).{"\n"}다른 색상 사용 금지.{"\n"}{"\n"}타이포그래피:{"\n"}제목: "Exo 2" 700, 기본 자간{"\n"}본문: "Noto Sans" 400{"\n"}스케일: h1에 clamp(2rem, 5.8vw, 4.8rem){"\n"}본문 줄간격: 1.75{"\n"}제목 줄간격: 1{"\n"}{"\n"}UI:{"\n"}히어로 카드: border-radius 30px, border 1px solid var(--border), backdrop-filter blur(18px) saturate(135%), box-shadow 0 28px 45px rgba(0,0,0,0.26).{"\n"}노드 카드: border-radius 16px, border 1px solid rgba(255,255,255,0.35), padding 14px, bg rgba(17,22,40,0.25).{"\n"}프롬프트 박스: border-radius 18px, border 1px solid rgba(255,255,255,0.42), bg rgba(9,15,28,0.55).{"\n"}버튼: pill 형태(border-radius 999px), 1px solid rgba(255,255,255,0.52), bg rgba(255,255,255,0.1).{"\n"}{"\n"}레이아웃:{"\n"}콘텐츠 최대 너비: min(1080px, 92vw){"\n"}래퍼 패딩: 30px 0 78px{"\n"}히어로 패딩: clamp(22px, 5vw, 50px){"\n"}카드 그리드: repeat(auto-fit, minmax(190px, 1fr)), gap 12px{"\n"}리드 최대 너비: 680px{"\n"}{"\n"}모션:{"\n"}진입: translateY(14px) → 0, opacity 0 → 1, 800ms ease, 카드당 100ms 스태거{"\n"}호버: 미지정 — 은은하게 유지{"\n"}prefers-reduced-motion 존중.{"\n"}{"\n"}반응형:{"\n"}768px: 카드 그리드 1열로 축소, 히어로 패딩 clamp로 축소{"\n"}1024px: 3열 auto-fit 그리드, max-width 1080px 레이아웃{"\n"}{"\n"}금지사항:{"\n"}- 불투명 단색 배경 (투명도가 스타일의 핵심){"\n"}- blur 없는 투명 패널 (모든 글래스 패널에 blur + border + shadow 조합 필수){"\n"}- 투명 표면 위 텍스트 대비 4.5:1 미만{"\n"}- 세리프 또는 모노스페이스 폰트{"\n"}- 어떤 뷰포트에서도 가로 스크롤 금지{"\n"}- 날카로운 모서리 (최소 border-radius 16px){"\n"}{"\n"}출력:{"\n"}1) 색상 + 타이포그래피 토큰을 CSS 커스텀 프로퍼티로{"\n"}2) Hero / Stats (3열 노드 그리드) / CTA 구조{"\n"}3) 반응형을 지원하는 시맨틱 HTML + CSS</pre>
            <pre data-lang="ja" hidden>Glass Orbitスタイルのランディングページをデザインしてください — 深いマルチグラデーションの宇宙に浮かぶフロストガラスパネル。{"\n"}{"\n"}カラートークン:{"\n"}--bg1: #132039{"\n"}--bg2: #245970{"\n"}--bg3: #7b4f72{"\n"}--text: #eff8ff{"\n"}--border: rgba(255, 255, 255, 0.28){"\n"}--card-border: rgba(255, 255, 255, 0.35){"\n"}--card-bg: rgba(17, 22, 40, 0.25){"\n"}--hero-bg-start: rgba(255, 255, 255, 0.24){"\n"}--hero-bg-end: rgba(255, 255, 255, 0.1){"\n"}背景のにじみ: radial-gradient(circle at 12% 18%, rgba(37,123,255,0.42), transparent 38%), radial-gradient(circle at 80% 82%, rgba(237,124,195,0.28), transparent 34%)。{"\n"}他の色は使用不可。{"\n"}{"\n"}タイポグラフィ:{"\n"}見出し: "Exo 2" 700、デフォルトトラッキング{"\n"}本文: "Noto Sans" 400{"\n"}スケール: h1にclamp(2rem, 5.8vw, 4.8rem){"\n"}本文行間: 1.75{"\n"}見出し行間: 1{"\n"}{"\n"}UI:{"\n"}ヒーローカード: border-radius 30px, border 1px solid var(--border), backdrop-filter blur(18px) saturate(135%), box-shadow 0 28px 45px rgba(0,0,0,0.26)。{"\n"}ノードカード: border-radius 16px, border 1px solid rgba(255,255,255,0.35), padding 14px, bg rgba(17,22,40,0.25)。{"\n"}プロンプトボックス: border-radius 18px, border 1px solid rgba(255,255,255,0.42), bg rgba(9,15,28,0.55)。{"\n"}ボタン: ピル形状(border-radius 999px), 1px solid rgba(255,255,255,0.52), bg rgba(255,255,255,0.1)。{"\n"}{"\n"}レイアウト:{"\n"}コンテンツ最大幅: min(1080px, 92vw){"\n"}ラッパーパディング: 30px 0 78px{"\n"}ヒーローパディング: clamp(22px, 5vw, 50px){"\n"}カードグリッド: repeat(auto-fit, minmax(190px, 1fr)), gap 12px{"\n"}リード最大幅: 680px{"\n"}{"\n"}モーション:{"\n"}入場: translateY(14px) → 0, opacity 0 → 1, 800ms ease, カードごとに100msスタガー{"\n"}ホバー: 未指定 — 微細に保つ{"\n"}prefers-reduced-motionを尊重。{"\n"}{"\n"}レスポンシブ:{"\n"}768px: カードグリッドが1列に縮小、ヒーローパディングがclampで縮小{"\n"}1024px: 3列auto-fitグリッド、max-width 1080pxレイアウト{"\n"}{"\n"}禁止事項:{"\n"}- 不透明な単色背景（透明度がスタイルの核心）{"\n"}- blurなしの透明パネル（全ガラスパネルにblur + border + shadowの組み合わせ必須）{"\n"}- 透明面上のテキストコントラスト4.5:1未満{"\n"}- セリフまたはモノスペースフォント{"\n"}- いかなるビューポートでも横スクロール禁止{"\n"}- 鋭い角（最小border-radius 16px）{"\n"}{"\n"}出力:{"\n"}1) カラー + タイポグラフィトークンをCSSカスタムプロパティとして{"\n"}2) Hero / Stats（3列ノードグリッド）/ CTA構造{"\n"}3) レスポンシブ対応を含むセマンティックHTML + CSS</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/neon-drift.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Neon Drift</span></a><div className="page-nav__divider" /><a href="/pages/terminal-core.html"><span><span className="page-nav__label">다음</span>Terminal Core</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
