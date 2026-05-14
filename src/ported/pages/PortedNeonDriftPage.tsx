import { useRef, useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

type NeonPalette = {
  id: string;
  name: string;
  accent: string;
  accentRgb: string;
  accent2: string;
  accent2Rgb: string;
  bg: string;
  text: string;
};

const PALETTES: NeonPalette[] = [
  { id: 'ion',     name: 'ION',     accent: '#2ef2d5', accentRgb: '46, 242, 213', accent2: '#ff745f', accent2Rgb: '255, 116, 95',  bg: '#05070f', text: '#e5f4ff' },
  { id: 'magenta', name: 'MAGENTA', accent: '#ff4ed8', accentRgb: '255, 78, 216', accent2: '#7c5cff', accent2Rgb: '124, 92, 255',  bg: '#0a0612', text: '#f7e9ff' },
  { id: 'hazard',  name: 'HAZARD',  accent: '#f5d300', accentRgb: '245, 211, 0',  accent2: '#ff5a36', accent2Rgb: '255, 90, 54',   bg: '#0a0a08', text: '#fff7d6' },
  { id: 'plasma',  name: 'PLASMA',  accent: '#56c1ff', accentRgb: '86, 193, 255', accent2: '#b5ff4d', accent2Rgb: '181, 255, 77',  bg: '#03081a', text: '#e7f4ff' },
  { id: 'lava',    name: 'LAVA',    accent: '#ff8a3d', accentRgb: '255, 138, 61', accent2: '#ff2e63', accent2Rgb: '255, 46, 99',   bg: '#10060a', text: '#ffeede' },
  { id: 'verdant', name: 'VERDANT', accent: '#7df56a', accentRgb: '125, 245, 106',accent2: '#3ed8e6', accent2Rgb: '62, 216, 230',  bg: '#031007', text: '#e9ffeb' },
  { id: 'mono',    name: 'MONO',    accent: '#e5f4ff', accentRgb: '229, 244, 255',accent2: '#9aa6b8', accent2Rgb: '154, 166, 184', bg: '#06080d', text: '#e5f4ff' },
];

export function PortedNeonDriftPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  const [activeId, setActiveId] = useState('ion');
  const palette = PALETTES.find((p) => p.id === activeId) ?? PALETTES[0];

  const styleVars = {
    ['--accent' as string]: palette.accent,
    ['--accent-2' as string]: palette.accent2,
    ['--accent-rgb' as string]: palette.accentRgb,
    ['--accent-2-rgb' as string]: palette.accent2Rgb,
    ['--bg' as string]: palette.bg,
    ['--text' as string]: palette.text,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className="ported-style-page ported-style-page--neon-drift"
      style={styleVars}
      data-palette={palette.id}
    >
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
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
          {/* ═══ PALETTE SWITCHER ═══ */}
          <div className="nd-palette-switch" role="region" aria-label="Color palette">
            <div className="nd-palette-switch__label">
              <span className="nd-palette-switch__dot" />
              <span data-lang="en">PALETTE / TAP TO RECOLOR</span>
              <span data-lang="ko" hidden>팔레트 / 눌러서 색 바꾸기</span>
              <span data-lang="ja" hidden>パレット / タップして再着色</span>
            </div>
            <div className="nd-palette-switch__chips" role="radiogroup" aria-label="Neon palette">
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={p.id === activeId}
                  className={`nd-palette-chip${p.id === activeId ? ' is-active' : ''}`}
                  onClick={() => setActiveId(p.id)}
                  style={{
                    ['--chip-accent' as string]: p.accent,
                    ['--chip-accent-2' as string]: p.accent2,
                    ['--chip-bg' as string]: p.bg,
                  } as CSSProperties}
                >
                  <span className="nd-palette-chip__swatches" aria-hidden="true">
                    <span className="nd-palette-chip__sw nd-palette-chip__sw--a" />
                    <span className="nd-palette-chip__sw nd-palette-chip__sw--b" />
                  </span>
                  <span className="nd-palette-chip__name">{p.name}</span>
                </button>
              ))}
            </div>
            <div className="nd-palette-switch__readout" aria-hidden="true">
              <span className="nd-palette-switch__hex">{palette.accent.toUpperCase()}</span>
              <span className="nd-palette-switch__plus">+</span>
              <span className="nd-palette-switch__hex">{palette.accent2.toUpperCase()}</span>
            </div>
          </div>

          {/* ═══ DEMO SECTION START ═══ */}
          <div className="nd-demo" id="main-content">
            <section className="nd-interface" aria-label="Neon Drift command interface">
              <span className="nd-interface__corner nd-interface__corner--tl" aria-hidden="true" />
              <span className="nd-interface__corner nd-interface__corner--tr" aria-hidden="true" />
              <span className="nd-interface__corner nd-interface__corner--bl" aria-hidden="true" />
              <span className="nd-interface__corner nd-interface__corner--br" aria-hidden="true" />
              <div className="nd-interface__chrome">
                <span>ND-10</span>
                <span data-lang="en">live interface study</span>
                <span data-lang="ko" hidden>라이브 인터페이스 스터디</span>
                <span data-lang="ja" hidden>ライブインターフェーススタディ</span>
                <span>09:42:18</span>
              </div>
              <div className="nd-interface__body">
                <div className="nd-copy">
                  <span className="nd-kicker" data-lang="en">Neon Command Surface</span>
                  <span className="nd-kicker" data-lang="ko" hidden>네온 커맨드 서피스</span>
                  <span className="nd-kicker" data-lang="ja" hidden>ネオンコマンドサーフェス</span>
                  <h1>NEON<br />DRIFT</h1>
                  <p className="lead" data-lang="en">
                    A refined neon interface language for dashboards, launch consoles, and product surfaces that need energy without visual noise.
                  </p>
                  <p className="lead" data-lang="ko" hidden>
                    대시보드, 런치 콘솔, 제품 화면에 쓰기 좋은 정제된 네온 인터페이스 언어입니다. 에너지는 유지하되
                    시각적 소음은 줄입니다.
                  </p>
                  <p className="lead" data-lang="ja" hidden>
                    ダッシュボード、ローンチコンソール、プロダクト画面に向いた洗練されたネオンインターフェース言語です。エネルギーを保ちつつ視覚ノイズを抑えます。
                  </p>
                  <div className="nd-command-row" aria-label="interface traits">
                    <span>contrast / 12.4</span>
                    <span>motion / calm</span>
                    <span>glow / gated</span>
                  </div>
                </div>
                <div className="nd-product-panel" aria-hidden="true">
                  <div className="nd-product-panel__top">
                    <span />
                    <span />
                    <span />
                    <b>Signal Desk</b>
                    <i className="nd-product-panel__live"><em /> LIVE</i>
                  </div>
                  <div className="nd-product-panel__body">
                    <div className="nd-product-rail">
                      <span className="is-active"><i /> Overview</span>
                      <span><i /> Orders</span>
                      <span><i /> Signals</span>
                      <span><i /> Risk</span>
                      <span><i /> Audit</span>
                    </div>
                    <div className="nd-product-main">
                      <div className="nd-product-main__header">
                        <div className="nd-product-main__heading">
                          <span>Active Surface</span>
                          <div className="nd-product-main__metric">
                            <b>12.4</b>
                            <em className="nd-product-main__delta">▲ 2.4%</em>
                          </div>
                        </div>
                        <div className="nd-product-main__legend">
                          <span><i className="nd-dot nd-dot--teal" /> ion</span>
                          <span><i className="nd-dot nd-dot--coral" /> pulse</span>
                        </div>
                      </div>
                      <div className="nd-product-chart">
                        <svg viewBox="0 0 320 120" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="nd-chart-fill-teal" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor={palette.accent} stopOpacity="0.32" />
                              <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path className="nd-chart-area" d="M0 82 C40 72 52 44 88 52 C128 62 139 92 176 74 C214 56 218 26 252 34 C284 42 296 64 320 52 L320 120 L0 120 Z" />
                          <path className="nd-chart-line-1" d="M0 82 C40 72 52 44 88 52 C128 62 139 92 176 74 C214 56 218 26 252 34 C284 42 296 64 320 52" />
                          <path className="nd-chart-line-2" d="M0 100 C54 92 86 88 126 94 C172 101 200 84 236 76 C276 68 300 72 320 66" />
                          <circle className="nd-chart-marker" cx="252" cy="34" r="3.4" />
                        </svg>
                        <div className="nd-product-chart__axis">
                          <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
                        </div>
                      </div>
                      <div className="nd-product-grid">
                        <span data-trend="up"><b>Glow</b>Active only<i className="nd-spark nd-spark--up" /></span>
                        <span data-trend="flat"><b>Motion</b>Quiet scan<i className="nd-spark nd-spark--flat" /></span>
                        <span data-trend="down"><b>Density</b>Compact<i className="nd-spark nd-spark--down" /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="nd-status-stack" aria-hidden="true">
                <span data-state="active"><b>01</b> luminance budget <i className="nd-status-pulse" /></span>
                <span data-state="ready"><b>02</b> hairline frame <i className="nd-status-bars"><em /><em /><em /></i></span>
                <span data-state="idle"><b>03</b> dark readable body <i className="nd-status-grid"><em /><em /><em /><em /><em /><em /></i></span>
              </div>
            </section>
            <div className="nd-stripe" />
            <div className="nd-desc">
              <span className="nd-neon-sign nd-neon-sign--teal" data-text="STYLE BRIEF" data-lang="en">STYLE BRIEF</span>
              <span className="nd-neon-sign nd-neon-sign--teal" data-text="스타일 개요" data-lang="ko" hidden>스타일 개요</span>
              <span className="nd-neon-sign nd-neon-sign--teal" data-text="スタイル概要" data-lang="ja" hidden>スタイル概要</span>
              <p className="lead" data-lang="en">
                Use neon as an interface signal, not decoration. The strongest glow belongs to active controls and system status, while dense text stays on quiet panels with sharp hairline borders.
              </p>
              <p className="lead" data-lang="ko" hidden>
                네온을 장식이 아니라 인터페이스 신호로 씁니다. 가장 강한 빛은 활성 컨트롤과 시스템 상태에만
                배치하고, 조밀한 텍스트는 조용한 패널과 날카로운 헤어라인 위에 둡니다.
              </p>
              <p className="lead" data-lang="ja" hidden>
                ネオンを装飾ではなくインターフェース信号として使います。最も強い光はアクティブなコントロールとシステム状態に限定し、密なテキストは静かなパネルと鋭いヘアライン上に置きます。
              </p>
              <div className="nd-principles">
                <span>active states</span>
                <span>thin chrome</span>
                <span>low-noise body</span>
              </div>
            </div>
            <div className="nd-stripe" />
            <div className="nd-dashboard">
              <div className="nd-gauge nd-gauge--teal">
                <div className="nd-gauge__header">
                  <div className="nd-gauge__label" data-lang="en">LUMINANCE</div>
                  <div className="nd-gauge__label" data-lang="ko" hidden>휘도</div>
                  <div className="nd-gauge__label" data-lang="ja" hidden>輝度</div>
                  <span className="nd-gauge__value">88<em>%</em></span>
                </div>
                <div className="nd-gauge__name nd-gauge__name--teal" data-lang="en">Controlled Glow</div>
                <div className="nd-gauge__name nd-gauge__name--teal" data-lang="ko" hidden>제어된 글로우</div>
                <div className="nd-gauge__name nd-gauge__name--teal" data-lang="ja" hidden>制御されたグロー</div>
                <div className="nd-gauge__viz nd-gauge__viz--bar">
                  <div className="nd-gauge__bar"><div className="nd-gauge__bar-fill nd-gauge__bar-fill--teal" style={{width: '88%'}} /></div>
                  <div className="nd-gauge__scale"><span>0</span><span>50</span><span>100</span></div>
                </div>
                <div className="nd-gauge__reading" data-lang="en">Glow is reserved for active states</div>
                <div className="nd-gauge__reading" data-lang="ko" hidden>활성 상태에만 강한 빛 사용</div>
                <div className="nd-gauge__reading" data-lang="ja" hidden>強い光はアクティブ状態だけに使用</div>
              </div>
              <div className="nd-gauge nd-gauge--coral">
                <div className="nd-gauge__header">
                  <div className="nd-gauge__label" data-lang="en">DENSITY</div>
                  <div className="nd-gauge__label" data-lang="ko" hidden>밀도</div>
                  <div className="nd-gauge__label" data-lang="ja" hidden>密度</div>
                  <span className="nd-gauge__value">74<em>%</em></span>
                </div>
                <div className="nd-gauge__name nd-gauge__name--coral" data-lang="en">Readable Chrome</div>
                <div className="nd-gauge__name nd-gauge__name--coral" data-lang="ko" hidden>읽히는 크롬 레이어</div>
                <div className="nd-gauge__name nd-gauge__name--coral" data-lang="ja" hidden>読めるクロームレイヤー</div>
                <div className="nd-gauge__viz nd-gauge__viz--dots" aria-hidden="true">
                  {Array.from({ length: 27 }).map((_, i) => (
                    <i key={i} data-lit={i < 20 ? 'true' : 'false'} />
                  ))}
                </div>
                <div className="nd-gauge__reading" data-lang="en">Compact panels, calm body copy</div>
                <div className="nd-gauge__reading" data-lang="ko" hidden>컴팩트한 패널, 차분한 본문</div>
                <div className="nd-gauge__reading" data-lang="ja" hidden>コンパクトなパネル、落ち着いた本문</div>
              </div>
              <div className="nd-gauge nd-gauge--mixed">
                <div className="nd-gauge__header">
                  <div className="nd-gauge__label" data-lang="en">MOTION</div>
                  <div className="nd-gauge__label" data-lang="ko" hidden>모션</div>
                  <div className="nd-gauge__label" data-lang="ja" hidden>モーション</div>
                  <span className="nd-gauge__value">62<em>%</em></span>
                </div>
                <div className="nd-gauge__name nd-gauge__name--teal" data-lang="en">Signal Drift</div>
                <div className="nd-gauge__name nd-gauge__name--teal" data-lang="ko" hidden>시그널 드리프트</div>
                <div className="nd-gauge__name nd-gauge__name--teal" data-lang="ja" hidden>シグナルドリフト</div>
                <div className="nd-gauge__viz nd-gauge__viz--scan" aria-hidden="true">
                  <span className="nd-gauge__scan-rail" />
                  <span className="nd-gauge__scan-beam" />
                  <span className="nd-gauge__scan-track">
                    <em /><em /><em /><em /><em /><em /><em /><em />
                  </span>
                </div>
                <div className="nd-gauge__reading" data-lang="en">Slow scan, quick focus response</div>
                <div className="nd-gauge__reading" data-lang="ko" hidden>느린 스캔, 빠른 포커스 반응</div>
                <div className="nd-gauge__reading" data-lang="ja" hidden>遅いスキャン、速いフォーカス反応</div>
              </div>
            </div>
            <div className="nd-stripe" />
            <div className="nd-palette">
              <div className="nd-palette__title" data-lang="en">Interface Color Tokens</div>
              <div className="nd-palette__title" data-lang="ko" hidden>인터페이스 컬러 토큰</div>
              <div className="nd-palette__title" data-lang="ja" hidden>インターフェースカラートークン</div>
              <div className="nd-tubes">
                <div className="nd-tube" data-role="depth">
                  <div className="nd-tube__light nd-tube__light--bg"><span className="nd-tube__cap" /><span className="nd-tube__cap" /></div>
                  <div className="nd-tube__meta">
                    <span className="nd-tube__label">Depth</span>
                    <span className="nd-tube__role">surface</span>
                  </div>
                  <span className="nd-tube__hex">{palette.bg.toUpperCase()}</span>
                </div>
                <div className="nd-tube" data-role="ink">
                  <div className="nd-tube__light nd-tube__light--text"><span className="nd-tube__cap" /><span className="nd-tube__cap" /></div>
                  <div className="nd-tube__meta">
                    <span className="nd-tube__label">Ink</span>
                    <span className="nd-tube__role">text</span>
                  </div>
                  <span className="nd-tube__hex">{palette.text.toUpperCase()}</span>
                </div>
                <div className="nd-tube" data-role="ion">
                  <div className="nd-tube__light nd-tube__light--teal"><span className="nd-tube__cap" /><span className="nd-tube__cap" /></div>
                  <div className="nd-tube__meta">
                    <span className="nd-tube__label">Ion</span>
                    <span className="nd-tube__role">accent</span>
                  </div>
                  <span className="nd-tube__hex">{palette.accent.toUpperCase()}</span>
                </div>
                <div className="nd-tube" data-role="pulse">
                  <div className="nd-tube__light nd-tube__light--coral"><span className="nd-tube__cap" /><span className="nd-tube__cap" /></div>
                  <div className="nd-tube__meta">
                    <span className="nd-tube__label">Pulse</span>
                    <span className="nd-tube__role">signal</span>
                  </div>
                  <span className="nd-tube__hex">{palette.accent2.toUpperCase()}</span>
                </div>
                <div className="nd-tube" data-role="hairline">
                  <div className="nd-tube__light nd-tube__light--line"><span className="nd-tube__cap" /><span className="nd-tube__cap" /></div>
                  <div className="nd-tube__meta">
                    <span className="nd-tube__label">Hairline</span>
                    <span className="nd-tube__role">border</span>
                  </div>
                  <span className="nd-tube__hex">#1e2c44</span>
                </div>
              </div>
            </div>
            <div className="nd-stripe" />
            <span className="nd-neon-sign nd-neon-sign--coral" data-text="INTERFACE PROTOCOLS" data-lang="en">INTERFACE PROTOCOLS</span>
            <span className="nd-neon-sign nd-neon-sign--coral" data-text="인터페이스 프로토콜" data-lang="ko" hidden>인터페이스 프로토콜</span>
            <span className="nd-neon-sign nd-neon-sign--coral" data-text="インターフェースプロトコル" data-lang="ja" hidden>インターフェースプロトコル</span>
            <div className="nd-tips">
              <article className="nd-tip" data-rule="glow" data-lang="en">
                <div className="nd-tip__visual nd-tip__visual--glow" aria-hidden="true">
                  <i className="nd-tip-dot is-active" />
                  <i className="nd-tip-dot" />
                  <i className="nd-tip-dot" />
                </div>
                <div className="nd-tip__number">Rule 01 / glow</div>
                Treat glow as status feedback, not as ambient decoration
              </article>
              <article className="nd-tip" data-rule="glow" data-lang="ko" hidden>
                <div className="nd-tip__visual nd-tip__visual--glow" aria-hidden="true">
                  <i className="nd-tip-dot is-active" />
                  <i className="nd-tip-dot" />
                  <i className="nd-tip-dot" />
                </div>
                <div className="nd-tip__number">Rule 01 / glow</div>
                글로우는 배경 장식이 아니라 상태 피드백으로 사용
              </article>
              <article className="nd-tip" data-rule="glow" data-lang="ja" hidden>
                <div className="nd-tip__visual nd-tip__visual--glow" aria-hidden="true">
                  <i className="nd-tip-dot is-active" />
                  <i className="nd-tip-dot" />
                  <i className="nd-tip-dot" />
                </div>
                <div className="nd-tip__number">Rule 01 / glow</div>
                グローは背景装飾ではなく状態フィードバックとして使う
              </article>
              <article className="nd-tip" data-rule="layer" data-lang="en">
                <div className="nd-tip__visual nd-tip__visual--layer" aria-hidden="true">
                  <span className="nd-tip-row nd-tip-row--chrome" />
                  <span className="nd-tip-row nd-tip-row--data" />
                  <span className="nd-tip-row nd-tip-row--copy" />
                </div>
                <div className="nd-tip__number">Rule 02 / hierarchy</div>
                Separate chrome, data, and copy with thin but visible hierarchy
              </article>
              <article className="nd-tip" data-rule="layer" data-lang="ko" hidden>
                <div className="nd-tip__visual nd-tip__visual--layer" aria-hidden="true">
                  <span className="nd-tip-row nd-tip-row--chrome" />
                  <span className="nd-tip-row nd-tip-row--data" />
                  <span className="nd-tip-row nd-tip-row--copy" />
                </div>
                <div className="nd-tip__number">Rule 02 / hierarchy</div>
                크롬, 데이터, 카피를 얇지만 명확한 위계로 분리
              </article>
              <article className="nd-tip" data-rule="layer" data-lang="ja" hidden>
                <div className="nd-tip__visual nd-tip__visual--layer" aria-hidden="true">
                  <span className="nd-tip-row nd-tip-row--chrome" />
                  <span className="nd-tip-row nd-tip-row--data" />
                  <span className="nd-tip-row nd-tip-row--copy" />
                </div>
                <div className="nd-tip__number">Rule 02 / hierarchy</div>
                クローム、データ、コピーを細く明確な階層で分ける
              </article>
              <article className="nd-tip" data-rule="frame" data-lang="en">
                <div className="nd-tip__visual nd-tip__visual--frame" aria-hidden="true">
                  <span className="nd-tip-frame">
                    <em /><em /><em />
                  </span>
                </div>
                <div className="nd-tip__number">Rule 03 / compact</div>
                Keep panels compact so the neon frame feels precise
              </article>
              <article className="nd-tip" data-rule="frame" data-lang="ko" hidden>
                <div className="nd-tip__visual nd-tip__visual--frame" aria-hidden="true">
                  <span className="nd-tip-frame">
                    <em /><em /><em />
                  </span>
                </div>
                <div className="nd-tip__number">Rule 03 / compact</div>
                패널을 컴팩트하게 유지해 네온 프레임이 정밀해 보이게 함
              </article>
              <article className="nd-tip" data-rule="frame" data-lang="ja" hidden>
                <div className="nd-tip__visual nd-tip__visual--frame" aria-hidden="true">
                  <span className="nd-tip-frame">
                    <em /><em /><em />
                  </span>
                </div>
                <div className="nd-tip__number">Rule 03 / compact</div>
                パネルをコンパクトに保ち、ネオンフレームを精密に見せる
              </article>
              <article className="nd-tip" data-rule="scan" data-lang="en">
                <div className="nd-tip__visual nd-tip__visual--scan" aria-hidden="true">
                  <span className="nd-tip-scan" />
                </div>
                <div className="nd-tip__number">Rule 04 / motion</div>
                Animate scanlines slowly and reserve fast motion for focus
              </article>
              <article className="nd-tip" data-rule="scan" data-lang="ko" hidden>
                <div className="nd-tip__visual nd-tip__visual--scan" aria-hidden="true">
                  <span className="nd-tip-scan" />
                </div>
                <div className="nd-tip__number">Rule 04 / motion</div>
                스캔라인은 느리게, 빠른 모션은 포커스에만 사용
              </article>
              <article className="nd-tip" data-rule="scan" data-lang="ja" hidden>
                <div className="nd-tip__visual nd-tip__visual--scan" aria-hidden="true">
                  <span className="nd-tip-scan" />
                </div>
                <div className="nd-tip__number">Rule 04 / motion</div>
                スキャンラインは遅く、速い動きはフォーカスだけに使う
              </article>
            </div>
          </div>
          {/* ═══ DEMO SECTION END ═══ */}
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">{`Design a refined Neon Drift interface screen, not a glowing cyberpunk poster.

PALETTE: ${palette.name} (${palette.accent.toUpperCase()} + ${palette.accent2.toUpperCase()})

DIRECTION:
- Matte dark product UI with restrained ${palette.accent.toUpperCase()} and ${palette.accent2.toUpperCase()} accents.
- Neon appears only as thin active-state keylines, chart strokes, and focus indicators.
- No large glow halos, no sci-fi HUD labels, no decorative neon fog.

COLOR TOKENS:
--bg: ${palette.bg}
--surface: rgba(8, 13, 22, 0.92)
--surface-strong: rgba(10, 17, 27, 0.98)
--line: rgba(129, 156, 170, 0.18)
--text: ${palette.text}
--muted: #7f95a4
--accent: ${palette.accent}
--accent-rgb: ${palette.accentRgb}
--accent-2: ${palette.accent2}
--accent-2-rgb: ${palette.accent2Rgb}

TYPOGRAPHY:
Use a precise technical sans-serif. Keep letter spacing at 0. Headings are large but calm, with no blur-based glow. Body text is compact and readable.

INTERFACE STRUCTURE:
1) A dark command-surface hero with thin chrome, compact navigation, and one realistic product panel.
2) Product panel includes sidebar, toolbar, chart, and three compact status cells.
3) Supporting sections use sparse cards, thin top rules, and quiet labels.

MOTION:
Use almost none. If needed, a very slow scanline or opacity shift only. Respect prefers-reduced-motion.

FORBIDDEN:
- Oversized bloom/glow
- Gradient text
- Purple-blue AI gradient backgrounds
- Random sci-fi abbreviations
- Decorative orbs or fog
- Cards that look like generic glassmorphism`}</pre>
            <pre data-lang="ko" hidden>{`정제된 Neon Drift 인터페이스 화면을 디자인해줘. 빛나는 사이버펑크 포스터가 아니라 실제 제품 UI처럼 보여야 한다.

팔레트: ${palette.name} (${palette.accent.toUpperCase()} + ${palette.accent2.toUpperCase()})

방향:
- 매트한 다크 제품 UI에 절제된 ${palette.accent.toUpperCase()} / ${palette.accent2.toUpperCase()} 포인트만 사용.
- 네온은 얇은 활성 상태 keyline, 차트 stroke, 포커스 표시로만 사용.
- 큰 글로우 halo, 의미 없는 sci-fi HUD 라벨, 장식용 네온 안개는 금지.

색상 토큰:
--bg: ${palette.bg}
--surface: rgba(8, 13, 22, 0.92)
--surface-strong: rgba(10, 17, 27, 0.98)
--line: rgba(129, 156, 170, 0.18)
--text: ${palette.text}
--muted: #7f95a4
--accent: ${palette.accent}
--accent-rgb: ${palette.accentRgb}
--accent-2: ${palette.accent2}
--accent-2-rgb: ${palette.accent2Rgb}

타이포그래피:
정밀한 테크니컬 산세리프를 사용한다. letter spacing은 0. 제목은 크지만 차분해야 하고 blur 기반 글로우를 쓰지 않는다. 본문은 컴팩트하고 읽기 쉬워야 한다.

인터페이스 구조:
1) 얇은 chrome, 컴팩트 내비게이션, 실제 제품 패널이 있는 dark command-surface hero.
2) 제품 패널에는 sidebar, toolbar, chart, 세 개의 compact status cell을 포함.
3) 보조 섹션은 sparse card, 얇은 top rule, 조용한 label로 구성.

모션:
거의 쓰지 않는다. 필요하면 매우 느린 scanline이나 opacity shift만 사용. prefers-reduced-motion 준수.

금지:
- 과한 bloom/glow
- gradient text
- 보라/파랑 AI gradient 배경
- 무작위 sci-fi 약어
- 장식용 orb/fog
- 흔한 glassmorphism 카드`}</pre>
            <pre data-lang="ja" hidden>{`洗練されたNeon Driftのインターフェース画面を設計してください。光るサイバーパンクポスターではなく、実際のプロダクトUIのように見せます。

パレット: ${palette.name} (${palette.accent.toUpperCase()} + ${palette.accent2.toUpperCase()})

方向性:
- マットな暗いプロダクトUIに、抑えた${palette.accent.toUpperCase()} / ${palette.accent2.toUpperCase()}アクセントだけを使う。
- ネオンは細いactive-state keyline、chart stroke、focus indicatorに限定する。
- 大きなglow halo、意味のないsci-fi HUD labels、装飾的なneon fogは禁止。

カラートークン:
--bg: ${palette.bg}
--surface: rgba(8, 13, 22, 0.92)
--surface-strong: rgba(10, 17, 27, 0.98)
--line: rgba(129, 156, 170, 0.18)
--text: ${palette.text}
--muted: #7f95a4
--accent: ${palette.accent}
--accent-rgb: ${palette.accentRgb}
--accent-2: ${palette.accent2}
--accent-2-rgb: ${palette.accent2Rgb}

タイポグラフィ:
精密なtechnical sans-serifを使う。letter spacingは0。見出しは大きくても落ち着かせ、blurベースのglowは使わない。本文はコンパクトで読みやすくする。

インターフェース構造:
1) 細いchrome、コンパクトなnavigation、リアルなproduct panelを持つdark command-surface hero。
2) product panelにはsidebar、toolbar、chart、3つのcompact status cellを入れる。
3) 補助セクションはsparse card、細いtop rule、静かなlabelで構成する。

モーション:
ほとんど使わない。必要な場合のみ非常に遅いscanlineやopacity shiftを使う。prefers-reduced-motionを尊重。

禁止:
- 過剰なbloom/glow
- gradient text
- 紫/青のAI gradient背景
- ランダムなsci-fi略語
- 装飾的なorb/fog
- ありきたりなglassmorphism card`}</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/holographic-fluid.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Holographic Fluid</span></a><div className="page-nav__divider" /><a href="/pages/glass-orbit.html"><span><span className="page-nav__label">다음</span>Glass Orbit</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
