import { useRef, useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { ColorModeToggle } from '../ColorModeToggle';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

type ConsolePalette = {
  id: string;
  name: string;
  tagline: { en: string; ko: string; ja: string };
  vars: {
    bg: string;
    panel: string;
    surface: string;
    line: string;
    text: string;
    muted: string;
    accent: string;
    accentSoft: string;
    haze: string;
  };
};

/**
 * Shared neutral-black base. Every palette uses the same true-black layers;
 * only the accent (and accent-soft) changes. The user is explicit: console
 * backgrounds must be black-tone — no blue / no cyan / no warm tint on the
 * surfaces themselves.
 */
const NEUTRAL_BASE = {
  bg: '#080808',
  panel: '#121212',
  surface: '#1a1a1a',
  line: '#2a2a2a',
  text: '#e6e6e6',
  muted: '#8a8a8a',
  haze: '#161616',
} as const;

const PALETTES: ConsolePalette[] = [
  {
    id: 'emerald',
    name: 'EMERALD',
    tagline: { en: 'product green on black', ko: '검정 위 프로덕트 그린', ja: '黒の上のプロダクトグリーン' },
    vars: { ...NEUTRAL_BASE, accent: '#10b981', accentSoft: '#6ee7b7' },
  },
  {
    id: 'indigo',
    name: 'INDIGO',
    tagline: { en: 'SaaS indigo accent', ko: 'SaaS 인디고 액센트', ja: 'SaaS インディゴ' },
    vars: { ...NEUTRAL_BASE, accent: '#6366f1', accentSoft: '#a5b4fc' },
  },
  {
    id: 'rose',
    name: 'ROSE',
    tagline: { en: 'signal pink accent', ko: '시그널 핑크 액센트', ja: 'シグナルピンク' },
    vars: { ...NEUTRAL_BASE, accent: '#f43f5e', accentSoft: '#fda4af' },
  },
  {
    id: 'amber',
    name: 'AMBER',
    tagline: { en: 'warning yellow accent', ko: '워닝 옐로우 액센트', ja: 'ウォーニングイエロー' },
    vars: { ...NEUTRAL_BASE, accent: '#f59e0b', accentSoft: '#fcd34d' },
  },
  {
    id: 'slate',
    name: 'SLATE',
    tagline: { en: 'fully neutral grey', ko: '완전 중성 그레이', ja: '完全ニュートラルグレー' },
    vars: { ...NEUTRAL_BASE, accent: '#d4d4d4', accentSoft: '#f5f5f5' },
  },
];

export function PortedConsoleLaunchPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  const [activeId, setActiveId] = useState<string>('emerald');
  const palette = PALETTES.find((p) => p.id === activeId) ?? PALETTES[0];

  const styleVars = {
    ['--bg' as string]: palette.vars.bg,
    ['--panel' as string]: palette.vars.panel,
    ['--surface' as string]: palette.vars.surface,
    ['--line' as string]: palette.vars.line,
    ['--text' as string]: palette.vars.text,
    ['--muted' as string]: palette.vars.muted,
    ['--green' as string]: palette.vars.accent,
    ['--accent' as string]: palette.vars.accent,
    ['--accent-soft' as string]: palette.vars.accentSoft,
    ['--haze' as string]: palette.vars.haze,
  } as CSSProperties;

  const bootArt = `\
  ██████╗  ██████╗ ███╗   ██╗███████╗ ██████╗ ██╗     ███████╗
 ██╔════╝ ██╔═══██╗████╗  ██║██╔════╝██╔═══██╗██║     ██╔════╝
 ██║      ██║   ██║██╔██╗ ██║███████╗██║   ██║██║     █████╗
 ██║      ██║   ██║██║╚██╗██║╚════██║██║   ██║██║     ██╔══╝
 ╚██████╗ ╚██████╔╝██║ ╚████║███████║╚██████╔╝███████╗███████╗
  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚══════╝╚══════╝`;

  return (
    <div
      ref={rootRef}
      className="ported-style-page ported-style-page--console-launch"
      style={styleVars}
      data-palette={palette.id}
    >
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
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
              <ColorModeToggle pageKey="console-launch" />
              <button className="theme-toggle" id="global-theme-reset" aria-label="Reset Global Theme" data-color="Reset Global Theme" title="Reset Global Theme">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
        <main className="shell">
          {/* ══════ THEME SWITCHER ══════ */}
          <section className="theme-switcher" aria-label="Terminal theme switcher">
            <div className="theme-switcher__header">
              <span className="theme-switcher__prompt" aria-hidden="true">$</span>
              <span className="theme-switcher__cmd">design-system --theme</span>
              <span className="theme-switcher__caret" aria-hidden="true" />
            </div>
            <div className="theme-switcher__body">
              <div className="theme-switcher__label">
                <span data-lang="en">SELECT PALETTE</span>
                <span data-lang="ko" hidden>팔레트 선택</span>
                <span data-lang="ja" hidden>パレット選択</span>
              </div>
              <div className="theme-switcher__chips" role="radiogroup" aria-label="Terminal theme">
                {PALETTES.map((p) => {
                  const isActive = p.id === activeId;
                  const tagline = p.tagline[lang as 'en' | 'ko' | 'ja'] ?? p.tagline.en;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      className={`theme-chip${isActive ? ' is-active' : ''}`}
                      onClick={() => setActiveId(p.id)}
                      style={{
                        ['--chip-accent' as string]: p.vars.accent,
                        ['--chip-bg' as string]: p.vars.bg,
                        ['--chip-text' as string]: p.vars.text,
                      } as CSSProperties}
                    >
                      <span className="theme-chip__indicator" aria-hidden="true">{isActive ? '◉' : '○'}</span>
                      <span className="theme-chip__name">{p.name}</span>
                      <span className="theme-chip__swatches" aria-hidden="true">
                        <span className="theme-chip__swatch" style={{ background: p.vars.bg }} />
                        <span className="theme-chip__swatch" style={{ background: p.vars.surface }} />
                        <span className="theme-chip__swatch" style={{ background: p.vars.accent }} />
                      </span>
                      <span className="theme-chip__tagline">{tagline}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ══════ BOOT SPLASH SCREEN ══════ */}
          <section className="boot-splash" aria-label="Boot splash screen">
            <div className="boot-scanlines" aria-hidden="true" />
            <pre className="boot-ascii" aria-hidden="true">{bootArt}</pre>
            <div className="boot-version">
              <span data-lang="en"><strong>Design System</strong> v2.0.0 — {palette.name} Edition</span>
              <span data-lang="ko" hidden><strong>디자인 시스템</strong> v2.0.0 — {palette.name} 에디션</span>
              <span data-lang="ja" hidden><strong>デザインシステム</strong> v2.0.0 — {palette.name} エディション</span>
            </div>
          </section>
          {/* ══════ SYSTEM INITIALIZATION ══════ */}
          <section className="init-sequence" aria-label="System initialization">
            <div className="init-title">
              <span data-lang="en">System Initialization</span>
              <span data-lang="ko" hidden>시스템 초기화</span>
              <span data-lang="ja" hidden>システム初期化</span>
            </div>
            <div className="init-row">
              <span className="init-check" aria-hidden="true">✓</span>
              <span className="init-label" data-lang="en">Loading typography module</span>
              <span className="init-label" data-lang="ko" hidden>타이포그래피 모듈 로딩</span>
              <span className="init-label" data-lang="ja" hidden>タイポグラフィモジュール読込</span>
              <span className="init-bar-track"><span className="init-bar-fill" style={{animationDelay: '0s'}} /></span>
              <span className="init-status">100%</span>
            </div>
            <div className="init-row">
              <span className="init-check" aria-hidden="true">✓</span>
              <span className="init-label" data-lang="en">Loading color system</span>
              <span className="init-label" data-lang="ko" hidden>컬러 시스템 로딩</span>
              <span className="init-label" data-lang="ja" hidden>カラーシステム読込</span>
              <span className="init-bar-track"><span className="init-bar-fill" style={{animationDelay: '0.3s'}} /></span>
              <span className="init-status">100%</span>
            </div>
            <div className="init-row">
              <span className="init-check" aria-hidden="true">✓</span>
              <span className="init-label" data-lang="en">Loading layout engine</span>
              <span className="init-label" data-lang="ko" hidden>레이아웃 엔진 로딩</span>
              <span className="init-label" data-lang="ja" hidden>レイアウトエンジン読込</span>
              <span className="init-bar-track"><span className="init-bar-fill" style={{animationDelay: '0.6s'}} /></span>
              <span className="init-status">100%</span>
            </div>
            <div className="init-row">
              <span className="init-check" aria-hidden="true">✓</span>
              <span className="init-label" data-lang="en">Loading component library</span>
              <span className="init-label" data-lang="ko" hidden>컴포넌트 라이브러리 로딩</span>
              <span className="init-label" data-lang="ja" hidden>コンポーネントライブラリ読込</span>
              <span className="init-bar-track"><span className="init-bar-fill" style={{animationDelay: '0.9s'}} /></span>
              <span className="init-status">100%</span>
            </div>
            <div className="init-row">
              <span className="init-check" aria-hidden="true">✓</span>
              <span className="init-label" data-lang="en">Initializing motion system</span>
              <span className="init-label" data-lang="ko" hidden>모션 시스템 초기화</span>
              <span className="init-label" data-lang="ja" hidden>モーションシステム初期化</span>
              <span className="init-bar-track"><span className="init-bar-fill" style={{animationDelay: '1.2s'}} /></span>
              <span className="init-status">100%</span>
            </div>
            <div className="init-row">
              <span className="init-check" aria-hidden="true">✓</span>
              <span className="init-label" data-lang="en">Verifying accessibility compliance</span>
              <span className="init-label" data-lang="ko" hidden>접근성 규정 검증</span>
              <span className="init-label" data-lang="ja" hidden>アクセシビリティ準拠確認</span>
              <span className="init-bar-track"><span className="init-bar-fill" style={{animationDelay: '1.5s'}} /></span>
              <span className="init-status">100%</span>
            </div>
          </section>
          {/* ══════ TERMINAL OUTPUT ══════ */}
          <section className="term-window" aria-label="Terminal output">
            <div className="term-titlebar">
              <div className="term-dots">
                <span className="term-dot term-dot--red" />
                <span className="term-dot term-dot--yellow" />
                <span className="term-dot term-dot--green" />
              </div>
              <span>console-launch — system-info</span>
              <div style={{width: 42}} />
            </div>
            <div className="term-body">
              <span className="t-prompt">$</span> <span className="t-cmd">design-system --info</span>
              <br />
              <span className="t-sep">───────────────────────────────────</span>
              <br />
              <span className="t-key">  System  </span> <span className="t-val">Design System v2.0</span>
              <br />
              <span className="t-key">  Edition </span> <span className="t-val">{palette.name}</span>
              <br />
              <span className="t-key">  Status  </span> <span className="t-val">● Active</span>
              <br />
              <span className="t-sep">───────────────────────────────────</span>
              <br />
              <span className="t-key">  Modules:</span>
              <br />
              <span className="t-key">    ✓ </span> <span className="t-val">Typography</span>  <span className="t-key">— JetBrains Mono + IBM Plex Sans</span>
              <br />
              <span className="t-key">    ✓ </span> <span className="t-val">Color</span>       <span className="t-key">— 7 tokens, {palette.name.toLowerCase()} palette</span>
              <br />
              <span className="t-key">    ✓ </span> <span className="t-val">Layout</span>      <span className="t-key">— Layered panels, grid system</span>
              <br />
              <span className="t-key">    ✓ </span> <span className="t-val">Components</span>  <span className="t-key">— Tabs, keys, status bars</span>
              <br />
              <span className="t-key">    ✓ </span> <span className="t-val">Motion</span>      <span className="t-key">— Cursor blink, progress fill</span>
              <br />
              <span className="t-sep">───────────────────────────────────</span>
              <br />
              <span className="t-prompt">$</span> <span className="term-cursor" aria-hidden="true" />
            </div>
          </section>
          {/* ══════ IDE SPLIT LAYOUT ══════ */}
          <section className="ide-window" aria-label="IDE interface">
            {/* Tab Bar */}
            <div className="ide-tabs" role="tablist">
              <div className="ide-tab active" role="tab" aria-selected="true">colors.css</div>
              <div className="ide-tab" role="tab" aria-selected="false">typography.css</div>
              <div className="ide-tab" role="tab" aria-selected="false">layout.css</div>
              <div className="ide-tab" role="tab" aria-selected="false">config.json</div>
            </div>
            {/* Three-panel body */}
            <div className="ide-body">
              {/* Left: File Tree */}
              <aside className="ide-sidebar" aria-label="File explorer">
                <div className="ide-sidebar-title">
                  <span data-lang="en">Explorer</span>
                  <span data-lang="ko" hidden>탐색기</span>
                  <span data-lang="ja" hidden>エクスプローラー</span>
                </div>
                <div className="file-item">
                  <span className="file-icon file-icon--folder">▼</span> design-system/
                </div>
                <div className="file-item file-indent">
                  <span className="file-icon file-icon--folder">▼</span> tokens/
                </div>
                <div className="file-item file-indent active" style={{paddingLeft: 40}}>
                  <span className="file-icon file-icon--css">●</span> colors.css
                </div>
                <div className="file-item file-indent" style={{paddingLeft: 40}}>
                  <span className="file-icon file-icon--css">●</span> typography.css
                </div>
                <div className="file-item file-indent" style={{paddingLeft: 40}}>
                  <span className="file-icon file-icon--css">●</span> layout.css
                </div>
                <div className="file-item file-indent">
                  <span className="file-icon file-icon--folder">▶</span> components/
                </div>
                <div className="file-item file-indent">
                  <span className="file-icon file-icon--folder">▶</span> utils/
                </div>
                <div className="file-item">
                  <span className="file-icon file-icon--json">●</span> config.json
                </div>
                <div className="file-item">
                  <span className="file-icon file-icon--js">●</span> index.js
                </div>
              </aside>
              {/* Center: Code Editor */}
              <div className="ide-editor" role="region" aria-label="Code editor">
                <div><span className="line-num"> 1</span><span className="code-comment">{`/* ── ${palette.name}: Color Tokens ── */`}</span></div>
                <div><span className="line-num"> 2</span></div>
                <div><span className="line-num"> 3</span><span className="code-selector">:root</span> <span className="code-punct">{'{'}</span></div>
                <div><span className="line-num"> 4</span>  <span className="code-prop">--bg</span><span className="code-punct">:</span> <span className="code-val">{palette.vars.bg}</span><span className="code-punct">;</span></div>
                <div><span className="line-num"> 5</span>  <span className="code-prop">--panel</span><span className="code-punct">:</span> <span className="code-val">{palette.vars.panel}</span><span className="code-punct">;</span></div>
                <div><span className="line-num"> 6</span>  <span className="code-prop">--surface</span><span className="code-punct">:</span> <span className="code-val">{palette.vars.surface}</span><span className="code-punct">;</span></div>
                <div><span className="line-num"> 7</span>  <span className="code-prop">--line</span><span className="code-punct">:</span> <span className="code-val">{palette.vars.line}</span><span className="code-punct">;</span></div>
                <div><span className="line-num"> 8</span>  <span className="code-prop">--text</span><span className="code-punct">:</span> <span className="code-val">{palette.vars.text}</span><span className="code-punct">;</span></div>
                <div><span className="line-num"> 9</span>  <span className="code-prop">--muted</span><span className="code-punct">:</span> <span className="code-val">{palette.vars.muted}</span><span className="code-punct">;</span></div>
                <div><span className="line-num">10</span>  <span className="code-prop">--accent</span><span className="code-punct">:</span> <span className="code-val">{palette.vars.accent}</span><span className="code-punct">;</span></div>
                <div><span className="line-num">11</span><span className="code-punct">{'}'}</span></div>
                <div><span className="line-num">12</span></div>
                <div><span className="line-num">13</span><span className="code-comment">/* ── Surface Layers ── */</span></div>
                <div><span className="line-num">14</span><span className="code-selector">.workspace</span> <span className="code-punct">{'{'}</span></div>
                <div><span className="line-num">15</span>  <span className="code-prop">background</span><span className="code-punct">:</span> <span className="code-val">linear-gradient(180deg, var(--panel), var(--bg))</span><span className="code-punct">;</span></div>
                <div><span className="line-num">16</span>  <span className="code-prop">border-radius</span><span className="code-punct">:</span> <span className="code-val">14px</span><span className="code-punct">;</span></div>
                <div><span className="line-num">17</span>  <span className="code-prop">border</span><span className="code-punct">:</span> <span className="code-val">1px solid var(--line)</span><span className="code-punct">;</span></div>
                <div><span className="line-num">18</span><span className="code-punct">{'}'}</span><span className="editor-cursor" aria-hidden="true" /></div>
              </div>
              {/* Right: Live Preview */}
              <div className="ide-preview" role="region" aria-label="Live preview">
                <div className="ide-preview-title">
                  <span data-lang="en">Live Preview</span>
                  <span data-lang="ko" hidden>실시간 미리보기</span>
                  <span data-lang="ja" hidden>ライブプレビュー</span>
                </div>
                <div className="preview-swatch-row">
                  <span className="preview-swatch" style={{background: palette.vars.bg}} />
                  <span className="preview-swatch-label">--bg</span>
                </div>
                <div className="preview-swatch-row">
                  <span className="preview-swatch" style={{background: palette.vars.panel}} />
                  <span className="preview-swatch-label">--panel</span>
                </div>
                <div className="preview-swatch-row">
                  <span className="preview-swatch" style={{background: palette.vars.surface}} />
                  <span className="preview-swatch-label">--surface</span>
                </div>
                <div className="preview-swatch-row">
                  <span className="preview-swatch" style={{background: palette.vars.accent}} />
                  <span className="preview-swatch-label">--accent</span>
                </div>
                <div className="preview-type-sample">
                  <h4 data-lang="en">Typography</h4>
                  <h4 data-lang="ko" hidden>타이포그래피</h4>
                  <h4 data-lang="ja" hidden>タイポグラフィ</h4>
                  <p style={{fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem', color: 'var(--accent)'}}>JetBrains Mono 400</p>
                  <p style={{fontFamily: '"IBM Plex Sans KR", sans-serif', fontSize: '0.72rem'}}>IBM Plex Sans KR</p>
                </div>
                <div className="preview-layout-grid">
                  <div className="preview-layout-box" />
                  <div className="preview-layout-box" />
                  <div className="preview-layout-box--wide preview-layout-box" />
                </div>
              </div>
            </div>
            {/* Status Bar */}
            <div className="ide-statusbar">
              <div className="ide-statusbar-left">
                <span><span className="status-dot" /> <span className="status-green">Connected</span></span>
                <span>main</span>
                <span>UTF-8</span>
                <span>{palette.name.toLowerCase()}</span>
              </div>
              <div className="ide-statusbar-right">
                <span>CSS</span>
                <span>Ln 18, Col 1</span>
                <span>Spaces: 2</span>
              </div>
            </div>
          </section>
          {/* ══════ COMPONENT LIBRARY ══════ */}
          <section className="cmp-section" aria-label="Component library">
            <header className="cmp-section__head">
              <span className="cmp-section__prompt" aria-hidden="true">$</span>
              <span className="cmp-section__cmd">design-system --list-components</span>
              <span className="cmp-section__crumb">src/components/*</span>
            </header>

            <div className="cmp-grid">
              {/* ── Buttons ── */}
              <article className="cmp-card">
                <div className="cmp-card__head">
                  <span className="cmp-card__name">Button</span>
                  <span className="cmp-card__path">primary · ghost · danger · disabled</span>
                </div>
                <div className="cmp-card__body cmp-card__body--row">
                  <button type="button" className="cmp-btn cmp-btn--primary">
                    <span aria-hidden="true">▸</span> Deploy
                  </button>
                  <button type="button" className="cmp-btn cmp-btn--ghost">Cancel</button>
                  <button type="button" className="cmp-btn cmp-btn--danger">
                    <span aria-hidden="true">!</span> Force Quit
                  </button>
                  <button type="button" className="cmp-btn cmp-btn--ghost" disabled>Pending…</button>
                </div>
              </article>

              {/* ── Inputs / Form ── */}
              <article className="cmp-card">
                <div className="cmp-card__head">
                  <span className="cmp-card__name">Input</span>
                  <span className="cmp-card__path">text · select · toggle</span>
                </div>
                <div className="cmp-card__body cmp-card__body--stack">
                  <label className="cmp-input">
                    <span className="cmp-input__prefix" aria-hidden="true">$</span>
                    <input
                      type="text"
                      className="cmp-input__field"
                      defaultValue="design-system init"
                      aria-label="Command input"
                      spellCheck={false}
                    />
                    <span className="cmp-input__cursor" aria-hidden="true" />
                  </label>

                  <div className="cmp-select" role="button" tabIndex={0} aria-haspopup="listbox" aria-expanded="false">
                    <span className="cmp-select__label">env</span>
                    <span className="cmp-select__value">production</span>
                    <span className="cmp-select__chevron" aria-hidden="true">▾</span>
                  </div>

                  <div className="cmp-toggle-row">
                    <span className="cmp-toggle-row__label">Auto-deploy on push</span>
                    <button type="button" className="cmp-toggle is-on" role="switch" aria-checked="true">
                      <span className="cmp-toggle__thumb" />
                      <span className="cmp-toggle__on">ON</span>
                      <span className="cmp-toggle__off">OFF</span>
                    </button>
                  </div>
                </div>
              </article>

              {/* ── Status Badges ── */}
              <article className="cmp-card">
                <div className="cmp-card__head">
                  <span className="cmp-card__name">Status</span>
                  <span className="cmp-card__path">badge · keycap</span>
                </div>
                <div className="cmp-card__body cmp-card__body--wrap">
                  <span className="cmp-badge cmp-badge--running">
                    <span className="cmp-badge__dot" aria-hidden="true" />
                    Running
                  </span>
                  <span className="cmp-badge cmp-badge--queued">
                    <span className="cmp-badge__dot" aria-hidden="true" />
                    Queued
                  </span>
                  <span className="cmp-badge cmp-badge--failed">
                    <span className="cmp-badge__dot" aria-hidden="true" />
                    Failed
                  </span>
                  <span className="cmp-badge cmp-badge--idle">
                    <span className="cmp-badge__dot" aria-hidden="true" />
                    Idle
                  </span>
                  <kbd className="cmp-key">⌘</kbd>
                  <kbd className="cmp-key">K</kbd>
                  <span className="cmp-key-sep" aria-hidden="true">/</span>
                  <kbd className="cmp-key">Esc</kbd>
                </div>
              </article>

              {/* ── Alerts ── */}
              <article className="cmp-card">
                <div className="cmp-card__head">
                  <span className="cmp-card__name">Alert</span>
                  <span className="cmp-card__path">info · warn · error</span>
                </div>
                <div className="cmp-card__body cmp-card__body--stack">
                  <div className="cmp-alert cmp-alert--info" role="status">
                    <span className="cmp-alert__icon" aria-hidden="true">i</span>
                    <div className="cmp-alert__body">
                      <strong>Build succeeded</strong>
                      <span>Deployed 14 modules in 2.31s</span>
                    </div>
                  </div>
                  <div className="cmp-alert cmp-alert--warn" role="status">
                    <span className="cmp-alert__icon" aria-hidden="true">!</span>
                    <div className="cmp-alert__body">
                      <strong>Bundle over budget</strong>
                      <span>main.js exceeds 250 KB by 12 KB</span>
                    </div>
                  </div>
                  <div className="cmp-alert cmp-alert--error" role="alert">
                    <span className="cmp-alert__icon" aria-hidden="true">×</span>
                    <div className="cmp-alert__body">
                      <strong>Token mismatch</strong>
                      <span>--accent referenced but undefined</span>
                    </div>
                  </div>
                </div>
              </article>

              {/* ── Stat Tiles ── */}
              <article className="cmp-card cmp-card--wide">
                <div className="cmp-card__head">
                  <span className="cmp-card__name">Stat tiles</span>
                  <span className="cmp-card__path">monospace KPI · 3-up</span>
                </div>
                <div className="cmp-card__body cmp-card__body--stat">
                  <div className="cmp-stat">
                    <span className="cmp-stat__label">P95 LATENCY</span>
                    <span className="cmp-stat__num">142<span className="cmp-stat__unit">ms</span></span>
                    <span className="cmp-stat__delta cmp-stat__delta--down">▼ 8.4%</span>
                  </div>
                  <div className="cmp-stat">
                    <span className="cmp-stat__label">THROUGHPUT</span>
                    <span className="cmp-stat__num">12.8<span className="cmp-stat__unit">k/s</span></span>
                    <span className="cmp-stat__delta cmp-stat__delta--up">▲ 3.1%</span>
                  </div>
                  <div className="cmp-stat">
                    <span className="cmp-stat__label">UPTIME 30D</span>
                    <span className="cmp-stat__num">99.97<span className="cmp-stat__unit">%</span></span>
                    <span className="cmp-stat__delta cmp-stat__delta--flat">— flat</span>
                  </div>
                </div>
              </article>

              {/* ── Progress / Spinner ── */}
              <article className="cmp-card">
                <div className="cmp-card__head">
                  <span className="cmp-card__name">Progress</span>
                  <span className="cmp-card__path">linear · spinner · dots</span>
                </div>
                <div className="cmp-card__body cmp-card__body--stack">
                  <div className="cmp-progress">
                    <span className="cmp-progress__label">Bundling</span>
                    <span className="cmp-progress__track"><span className="cmp-progress__fill" style={{ width: '72%' }} /></span>
                    <span className="cmp-progress__pct">72%</span>
                  </div>
                  <div className="cmp-progress">
                    <span className="cmp-progress__label">Hydrating</span>
                    <span className="cmp-progress__track"><span className="cmp-progress__fill" style={{ width: '34%' }} /></span>
                    <span className="cmp-progress__pct">34%</span>
                  </div>
                  <div className="cmp-spinner-row">
                    <span className="cmp-spinner" aria-hidden="true">
                      <span className="cmp-spinner__seg" />
                      <span className="cmp-spinner__seg" />
                      <span className="cmp-spinner__seg" />
                    </span>
                    <span className="cmp-spinner-row__label">Compiling tokens…</span>
                  </div>
                </div>
              </article>
            </div>
          </section>
          {/* ══════ PROMPT SECTION (unchanged) ══════ */}
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">{`Design a landing page in Console Launch style — IDE-inspired layered dark panels with tab navigation, keycap UI elements, and a runtime palette switcher.

PALETTE SWITCHER (top of page):
- 5 chips (EMERALD, INDIGO, ROSE, AMBER, SLATE). Every palette shares one neutral-black base —
  ONLY the accent changes. Console backgrounds must stay true black; no blue / no cyan tint
  on the surfaces themselves.
  Each chip shows 3 mini swatches: bg / surface / accent.
- Clicking a chip rewrites these CSS custom properties at the root scope:
  --bg, --panel, --surface, --line, --text, --muted, --accent, --accent-soft, --haze
- Every other panel below is driven by those vars — no hard-coded colors elsewhere.
- Shared base (all palettes):
  bg #080808  panel #121212  surface #1a1a1a  line #2a2a2a  text #e6e6e6  muted #8a8a8a  haze #161616
- Per-palette accent only:
  EMERALD  accent #10b981  soft #6ee7b7   (default)
  INDIGO   accent #6366f1  soft #a5b4fc
  ROSE     accent #f43f5e  soft #fda4af
  AMBER    accent #f59e0b  soft #fcd34d
  SLATE    accent #d4d4d4  soft #f5f5f5  (no chroma, fully neutral)

PAGE STRUCTURE:
1) Palette switcher (terminal prompt header "$ design-system --theme", chip group)
2) Boot splash: ASCII CONSOLE banner (preserved newlines via <pre>) + faint CRT scanline overlay + version line in accent
3) System Initialization: 6 rows, each with ✓ + label + filling progress bar + "100%"
4) Terminal Output: macOS-style titlebar + traffic-light dots + system info dump w/ blinking cursor
5) IDE Window: tab bar (colors.css active) + 3-panel body (file explorer / code editor with line numbers / live preview swatches) + status bar
6) AI Prompt block

TYPOGRAPHY:
Heading: "IBM Plex Sans" 700
Body: "IBM Plex Sans" 400
Code/Labels: "JetBrains Mono" 700 (brand), 600 (headings), 400 (keys/footer)
Scale: clamp(1.35rem, 3vw, 2rem) for headline, 1.05rem h2, 0.88rem tabs, 0.84rem keys, 0.78rem footer
Body line-height: 1.75

UI:
Each section: 14px radius, 1px solid var(--line), background var(--panel).
Boot splash: var(--panel) + faint scanline overlay (repeating-linear-gradient(transparent 0/1px, color-mix(in srgb, var(--accent) 6%, transparent) 1px/2px))
Workspace: linear-gradient(180deg, var(--panel), var(--bg)).
Tab bar: border-bottom 1px var(--line), tabs radius 9px border 1px var(--line) bg var(--surface), active bg var(--panel) with 2px accent underline.
Keycap tags: radius 6px, border 1px var(--line), bg var(--surface), mono 0.84rem.
Cursor: 10px x 1.1em, radius 2px, bg var(--accent), blink 1.05s steps(1, end) infinite.
Buttons: pill, border 1px color-mix(in srgb, var(--accent) 65%, transparent), color var(--accent-soft), bg transparent.

CHIP DESIGN (palette switcher):
- Each chip: 2x2 grid — indicator dot (top-left), name (top-right), 3 mini swatches (bottom-left), tagline (bottom-right).
- Inactive: bg var(--surface), border 1px var(--line), accent-tinted indicator.
- Active: bg color-mix(in srgb, var(--chip-accent) 18%, var(--panel)), border 1.5px var(--chip-accent), name in chip's accent.

MOTION:
- Init bars fill 1.8s ease-out forwards with staggered delays (0s, 0.3s, 0.6s, 0.9s, 1.2s, 1.5s)
- Cursor blink only — opacity 1↔0, 1050ms steps(1, end) infinite
- Status dot pulse 2.5s ease-in-out infinite
- No entrance animations on layout — keep tool-like
- Respect prefers-reduced-motion

RESPONSIVE:
720px: tabs 0.76rem, init bar 100%, IDE panels stack vertically, chips full-width
1024px: max-width 1280px, IDE 3-column grid (200 / 1fr / 260)

FORBIDDEN:
- Hard-coded color hexes outside of the palette declaration
- Multiple accent colors at once (one --accent per palette)
- Heavy gradients or blur (flat layered surfaces, single linear-gradient on workspace)
- Entrance animations beyond the init progress fill
- Horizontal scroll at any viewport
- Serif fonts

OUTPUT:
1) :root + [data-palette="..."] CSS custom-property sets for the 5 palettes
2) Palette switcher (chip group) + Boot splash + Init sequence + Terminal output + IDE window + Prompt
3) Semantic HTML + CSS with responsive support`}</pre>
            <pre data-lang="ko" hidden>{`Console Launch 스타일의 랜딩 페이지를 디자인해줘 — IDE에서 영감받은 계층적 다크 패널에 탭 내비게이션, 키캡 UI 요소, 그리고 런타임 팔레트 스위처.

팔레트 스위처(페이지 상단):
- 칩 5개(EMERALD, INDIGO, ROSE, AMBER, SLATE). 모든 팔레트가 하나의 뉴트럴 블랙 베이스를 공유하고,
  ACCENT만 바뀐다. 콘솔 배경은 반드시 진짜 검정. 표면에 푸르스름한·시안 톤 절대 금지.
  각 칩은 미니 스와치 3개(bg / surface / accent)를 보여줌.
- 칩 클릭 시 루트 스코프의 CSS 커스텀 프로퍼티가 모두 교체됨:
  --bg, --panel, --surface, --line, --text, --muted, --accent, --accent-soft, --haze
- 아래의 모든 패널은 이 변수들로 구동 — 다른 곳에 하드코딩된 색 사용 금지.
- 공통 베이스(모든 팔레트):
  bg #080808  panel #121212  surface #1a1a1a  line #2a2a2a  text #e6e6e6  muted #8a8a8a  haze #161616
- 팔레트별 accent만 변경:
  EMERALD  accent #10b981  soft #6ee7b7   (기본값)
  INDIGO   accent #6366f1  soft #a5b4fc
  ROSE     accent #f43f5e  soft #fda4af
  AMBER    accent #f59e0b  soft #fcd34d
  SLATE    accent #d4d4d4  soft #f5f5f5  (채도 없음, 완전 중성)

페이지 구조:
1) 팔레트 스위처(터미널 프롬프트 헤더 "$ design-system --theme" + 칩 그룹)
2) 부트 스플래시: ASCII CONSOLE 배너(<pre>로 줄바꿈 유지) + 옅은 CRT 스캔라인 오버레이 + 액센트 색 버전 라인
3) 시스템 초기화: 6행, 각 행은 ✓ + 라벨 + 채워지는 프로그레스 바 + "100%"
4) 터미널 출력: macOS 스타일 타이틀바 + 트래픽 라이트 + 시스템 정보 덤프 + 깜빡이는 커서
5) IDE 윈도우: 탭 바(colors.css 액티브) + 3패널 본문(파일 탐색기 / 라인 번호 있는 코드 에디터 / 라이브 미리보기 스와치) + 상태 바
6) AI 프롬프트 블록

타이포그래피:
제목: "IBM Plex Sans" 700
본문: "IBM Plex Sans" 400
코드/라벨: "JetBrains Mono" 700 (브랜드), 600 (제목), 400 (키/푸터)
스케일: headline에 clamp(1.35rem, 3vw, 2rem), h2 1.05rem, 탭 0.88rem, 키 0.84rem, 푸터 0.78rem
본문 줄간격: 1.75

UI:
각 섹션: radius 14px, 1px solid var(--line), 배경 var(--panel).
부트 스플래시: var(--panel) + 옅은 스캔라인 오버레이(repeating-linear-gradient(transparent 0/1px, color-mix(in srgb, var(--accent) 6%, transparent) 1px/2px))
워크스페이스: linear-gradient(180deg, var(--panel), var(--bg)).
탭 바: border-bottom 1px var(--line), 탭은 radius 9px 1px solid var(--line) bg var(--surface), 액티브 bg var(--panel) + 액센트 2px 밑줄.
키캡: radius 6px, 1px var(--line), bg var(--surface), mono 0.84rem.
커서: 10px x 1.1em, radius 2px, bg var(--accent), blink 1.05s steps(1, end) infinite.
버튼: pill, border 1px color-mix(in srgb, var(--accent) 65%, transparent), color var(--accent-soft), bg transparent.

칩 디자인(팔레트 스위처):
- 각 칩은 2x2 그리드 — 인디케이터 도트(좌상), 이름(우상), 미니 스와치 3개(좌하), 태그라인(우하).
- 비활성: bg var(--surface), 1px var(--line), 액센트 톤 인디케이터.
- 활성: bg color-mix(in srgb, var(--chip-accent) 18%, var(--panel)), 1.5px var(--chip-accent), 이름은 칩 액센트 색.

모션:
- 초기화 바: 1.8s ease-out forwards, 0s/0.3s/0.6s/0.9s/1.2s/1.5s 스태거.
- 커서 깜빡임만 — opacity 1↔0, 1050ms steps(1, end) infinite.
- 상태 도트 펄스 2.5s ease-in-out infinite.
- 레이아웃에 진입 애니메이션 없음.
- prefers-reduced-motion 존중.

반응형:
720px: 탭 0.76rem, 초기화 바 100%, IDE 패널 세로 적층, 칩 풀폭
1024px: max-width 1280px, IDE 3열(200 / 1fr / 260)

금지사항:
- 팔레트 선언 외부의 하드코딩 헥스
- 동시에 여러 액센트 (한 팔레트당 --accent 하나)
- 무거운 그라디언트 / 블러 (플랫 레이어드 표면, 워크스페이스에만 단일 linear-gradient)
- 초기화 프로그레스 외의 진입 애니메이션
- 모든 뷰포트에서 가로 스크롤 금지
- 세리프 폰트

출력:
1) 5개 팔레트에 대한 :root + [data-palette="..."] CSS 커스텀 프로퍼티 세트
2) 팔레트 스위처(칩 그룹) + 부트 스플래시 + 초기화 + 터미널 + IDE + 프롬프트
3) 반응형 시맨틱 HTML + CSS`}</pre>
            <pre data-lang="ja" hidden>{`Console Launchスタイルのランディングページをデザインしてください — IDEからインスピレーションを得た階層的ダークパネルにタブナビゲーション、キーキャップUI要素、ランタイムパレットスイッチャー。

パレットスイッチャー(ページ上部):
- チップ5つ(EMERALD, INDIGO, ROSE, AMBER, SLATE). 全パレットで一つのニュートラル黒ベースを共有し、
  ACCENTだけが切り替わる。コンソールの背景は必ず真の黒。表面に青み・シアン系の色味は厳禁。
  各チップにミニスウォッチ3つ(bg / surface / accent)を表示。
- チップクリックでルートスコープのCSSカスタムプロパティが全て切り替わる:
  --bg, --panel, --surface, --line, --text, --muted, --accent, --accent-soft, --haze
- 他のパネルは全てこれらの変数で駆動 — 他の場所には色のハードコーディング禁止。
- 共通ベース(全パレット):
  bg #080808  panel #121212  surface #1a1a1a  line #2a2a2a  text #e6e6e6  muted #8a8a8a  haze #161616
- パレットごとに変わるのは accent のみ:
  EMERALD  accent #10b981  soft #6ee7b7   (デフォルト)
  INDIGO   accent #6366f1  soft #a5b4fc
  ROSE     accent #f43f5e  soft #fda4af
  AMBER    accent #f59e0b  soft #fcd34d
  SLATE    accent #d4d4d4  soft #f5f5f5  (彩度なし、完全ニュートラル)

ページ構造:
1) パレットスイッチャー(ターミナルプロンプトヘッダ "$ design-system --theme" + チップグループ)
2) ブートスプラッシュ: ASCII CONSOLEバナー(<pre>で改行保持) + 薄いCRTスキャンライン + アクセント色のバージョン行
3) システム初期化: 6行、各行に ✓ + ラベル + 充填プログレスバー + "100%"
4) ターミナル出力: macOSスタイルタイトルバー + トラフィックライト + システム情報ダンプ + 点滅カーソル
5) IDEウィンドウ: タブバー(colors.css アクティブ) + 3パネル本体(ファイルエクスプローラ / 行番号付きコードエディタ / ライブプレビュースウォッチ) + ステータスバー
6) AIプロンプトブロック

タイポグラフィ:
見出し: "IBM Plex Sans" 700
本文: "IBM Plex Sans" 400
コード/ラベル: "JetBrains Mono" 700 (ブランド)、600 (見出し)、400 (キー/フッター)
スケール: headlineにclamp(1.35rem, 3vw, 2rem)、h2 1.05rem、タブ0.88rem、キー0.84rem、フッター0.78rem
本文行間: 1.75

UI:
各セクション: radius 14px, 1px solid var(--line), 背景 var(--panel)。
ブートスプラッシュ: var(--panel) + 薄いスキャンラインオーバーレイ(repeating-linear-gradient(transparent 0/1px, color-mix(in srgb, var(--accent) 6%, transparent) 1px/2px))
ワークスペース: linear-gradient(180deg, var(--panel), var(--bg))。
タブバー: border-bottom 1px var(--line)、タブは radius 9px 1px solid var(--line) bg var(--surface)、アクティブ bg var(--panel) + アクセント2px下線。
キーキャップ: radius 6px, 1px var(--line), bg var(--surface), mono 0.84rem。
カーソル: 10px x 1.1em, radius 2px, bg var(--accent), 点滅 1.05s steps(1, end) infinite。
ボタン: pill, border 1px color-mix(in srgb, var(--accent) 65%, transparent), color var(--accent-soft), bg transparent。

チップデザイン(パレットスイッチャー):
- 各チップは2x2グリッド — インジケータドット(左上)、名前(右上)、ミニスウォッチ3つ(左下)、タグライン(右下)。
- 非アクティブ: bg var(--surface), 1px var(--line), アクセントトーンインジケータ。
- アクティブ: bg color-mix(in srgb, var(--chip-accent) 18%, var(--panel)), 1.5px var(--chip-accent), 名前はチップのアクセント色。

モーション:
- 初期化バー: 1.8s ease-out forwards、0s/0.3s/0.6s/0.9s/1.2s/1.5sスタガー。
- カーソル点滅のみ — opacity 1↔0, 1050ms steps(1, end) infinite。
- ステータスドットパルス 2.5s ease-in-out infinite。
- レイアウトに入場アニメーションなし。
- prefers-reduced-motionを尊重。

レスポンシブ:
720px: タブ0.76rem, 初期化バー100%, IDEパネル縦積み, チップ全幅
1024px: max-width 1280px, IDE 3列(200 / 1fr / 260)

禁止事項:
- パレット宣言以外でのハードコードヘックス
- 同時に複数のアクセント(1パレットにつき --accent 1つ)
- 重いグラデーション/ぼかし(フラットレイヤード、ワークスペースのみ単一linear-gradient)
- 初期化プログレス以外の入場アニメーション
- いかなるビューポートでも横スクロール禁止
- セリフフォント

出力:
1) 5つのパレット用 :root + [data-palette="..."] CSSカスタムプロパティセット
2) パレットスイッチャー(チップグループ) + ブートスプラッシュ + 初期化 + ターミナル + IDE + プロンプト
3) レスポンシブセマンティックHTML + CSS`}</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
          <div className="foot">
            <span>mode: console-launch</span>
            <span>palette: {palette.name.toLowerCase()}</span>
            <span>status: all systems operational</span>
          </div>
          <p className="back"><a href="/"><span data-i18n="pw.nav.hub">Go to Hub</span></a></p>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/midnight-noir.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Midnight Noir</span></a><div className="page-nav__divider" /><a href="/pages/bento-bloom.html"><span><span className="page-nav__label">다음</span>Bento Bloom</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
