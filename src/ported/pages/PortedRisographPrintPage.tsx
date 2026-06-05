import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedRisographPrintPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--risograph-print">
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
        <div className="halftone-bg" />
        <main className="shell">
          <a className="skip-link" href="#main-content" data-i18n="skip">Skip to content</a>
          <nav className="site-nav" role="navigation" aria-label="Main navigation">
            <div className="site-nav__inner">
              <a className="site-nav__logo" href="/">Web Stylebook</a>
              <ul className="site-nav__links">
                <li><a href="/#styles" data-i18n="nav.styles">Styles</a></li>
                <li><a href="/pages/compare" data-i18n="nav.compare">Compare</a></li>
                <li><a href="/pages/color-system" data-i18n="nav.tips">Colors</a></li>
                <li><a href="/pages/prompt-workflow" data-i18n="nav.workflow">Prompt Builder</a></li>
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
          {/* ═══ Registration Marks ═══ */}
          <div className="reg-marks">
            <div className="reg-mark"><div className="reg-mark-circle" /></div>
            <div className="reg-marks__info">
              <span data-lang="en">RISOGRAPH PRINT — 2-COLOR SEPARATION</span>
              <span data-lang="ko" hidden>리소그래프 프린트 — 2색 분판</span>
              <span data-lang="ja" hidden>リソグラフプリント — 2色分版</span>
            </div>
            <div className="reg-mark"><div className="reg-mark-circle" /></div>
          </div>
          {/* ═══ Misregistration Hero ═══ */}
          <section className="hero">
            <div className="hero__edition">
              <span data-lang="en">Print 042 / 500</span>
              <span data-lang="ko" hidden>프린트 042 / 500</span>
              <span data-lang="ja" hidden>プリント 042 / 500</span>
            </div>
            <h1 className="hero__title">
              <span data-lang="en">Risograph Print</span>
              <span data-lang="ko" hidden>리소그래프 프린트</span>
              <span data-lang="ja" hidden>リソグラフプリント</span>
            </h1>
            <p className="hero__subtitle" data-lang="en">
              Soy-based inks, limited spot colors, and the beautiful imperfections of
              misregistered layers. Each print is unique — slight offsets and halftone
              grain give risograph its unmistakable tactile charm.
            </p>
            <p className="hero__subtitle" data-lang="ko" hidden>
              콩기름 잉크, 몇 안 되는 별색, 그리고 레이어가 어긋나며 생기는 아름다운 불완전함.
              어느 한 장도 같지 않습니다 — 미세한 오프셋과 하프톤 그레인이
              리소그래프만의 독특한 촉감을 만듭니다.
            </p>
            <p className="hero__subtitle" data-lang="ja" hidden>
              大豆インク、限られたスポットカラー、そしてレイヤーのずれが生む美しい不完全さ。
              各プリントはユニーク — わずかなオフセットとハーフトーンのグレインが、
              リソグラフならではの触感的な魅力を生み出します。
            </p>
            <div className="hero__halftone-corner" />
            <div className="hero__crosshair hero__crosshair--tl" aria-hidden="true" />
            <div className="hero__crosshair hero__crosshair--tr" aria-hidden="true" />
            <div className="hero__crosshair hero__crosshair--bl" aria-hidden="true" />
            <div className="hero__meta">
              <div className="hero__meta-item"><span className="hero__meta-key">Run</span><span className="hero__meta-val">500 ed.</span></div>
              <div className="hero__meta-item"><span className="hero__meta-key">Inks</span><span className="hero__meta-val">02 + OP</span></div>
              <div className="hero__meta-item"><span className="hero__meta-key">Paper</span><span className="hero__meta-val">118 gsm</span></div>
              <div className="hero__meta-item"><span className="hero__meta-key">Studio</span><span className="hero__meta-val">Drum Room ▲</span></div>
            </div>
          </section>
          {/* ═══ Press Operator's Log ═══ */}
          <section className="press-log">
            <div className="press-log__binding" aria-hidden="true">
              <span /><span /><span /><span /><span /><span /><span />
            </div>
            <header className="press-log__head">
              <div className="press-log__head-left">
                <div className="press-log__title">
                  <span data-lang="en">Press Operator's Log</span>
                  <span data-lang="ko" hidden>인쇄 오퍼레이터 일지</span>
                  <span data-lang="ja" hidden>印刷オペレーターログ</span>
                </div>
                <div className="press-log__sub">
                  <span data-lang="en">Daily run report · Shift A · Drum Room ▲</span>
                  <span data-lang="ko" hidden>일일 인쇄 보고 · A조 · 드럼룸 ▲</span>
                  <span data-lang="ja" hidden>日次プリントレポート · Aシフト · ドラムルーム ▲</span>
                </div>
              </div>
              <div className="press-log__head-right">
                <div className="press-log__date">2026.05.14</div>
                <div className="press-log__stamp" aria-hidden="true">
                  <span data-lang="en">RUN OK</span>
                  <span data-lang="ko" hidden>RUN OK</span>
                  <span data-lang="ja" hidden>RUN OK</span>
                </div>
              </div>
            </header>
            <div className="press-log__body">
              <ol className="press-log__checks" aria-label="Log entries">
                <li className="press-log__row press-log__row--done">
                  <span className="press-log__check" aria-hidden="true">✔</span>
                  <span className="press-log__entry">
                    <span data-lang="en">Master burned — 600 dpi thermal stencil</span>
                    <span data-lang="ko" hidden>마스터 번 — 600 dpi 열 스텐실</span>
                    <span data-lang="ja" hidden>マスター製版 — 600 dpi サーマルステンシル</span>
                  </span>
                  <span className="press-log__time">08:14</span>
                </li>
                <li className="press-log__row press-log__row--done">
                  <span className="press-log__check" aria-hidden="true">✔</span>
                  <span className="press-log__entry">
                    <span data-lang="en">Drum A loaded · Coral Red #FF6B6B</span>
                    <span data-lang="ko" hidden>드럼 A 장착 · 코랄 레드 #FF6B6B</span>
                    <span data-lang="ja" hidden>ドラムA装着 · コーラルレッド #FF6B6B</span>
                  </span>
                  <span className="press-log__time">08:31</span>
                </li>
                <li className="press-log__row press-log__row--done">
                  <span className="press-log__check" aria-hidden="true">✔</span>
                  <span className="press-log__entry">
                    <span data-lang="en">First pass complete · 500 sheets · 4 sec rest</span>
                    <span data-lang="ko" hidden>1차 인쇄 완료 · 500매 · 4초 휴지</span>
                    <span data-lang="ja" hidden>1度目の刷り完了 · 500枚 · 4秒休止</span>
                  </span>
                  <span className="press-log__time">10:02</span>
                </li>
                <li className="press-log__row press-log__row--done">
                  <span className="press-log__check" aria-hidden="true">✔</span>
                  <span className="press-log__entry">
                    <span data-lang="en">Drum swap · B installed · Teal #4ECDC4</span>
                    <span data-lang="ko" hidden>드럼 교체 · B 장착 · 틸 #4ECDC4</span>
                    <span data-lang="ja" hidden>ドラム交換 · B装着 · ティール #4ECDC4</span>
                  </span>
                  <span className="press-log__time">10:18</span>
                </li>
                <li className="press-log__row press-log__row--active">
                  <span className="press-log__check" aria-hidden="true">◐</span>
                  <span className="press-log__entry">
                    <span data-lang="en">Second pass · in progress · 312 / 500</span>
                    <span data-lang="ko" hidden>2차 인쇄 · 진행 중 · 312 / 500</span>
                    <span data-lang="ja" hidden>2度目の刷り · 進行中 · 312 / 500</span>
                  </span>
                  <span className="press-log__time">10:42</span>
                </li>
                <li className="press-log__row">
                  <span className="press-log__check" aria-hidden="true">○</span>
                  <span className="press-log__entry">
                    <span data-lang="en">Inspection &amp; quality check · 8% sample rate</span>
                    <span data-lang="ko" hidden>검수 및 품질 확인 · 8% 샘플</span>
                    <span data-lang="ja" hidden>検査・品質チェック · 8%サンプル</span>
                  </span>
                  <span className="press-log__time">— : —</span>
                </li>
                <li className="press-log__row">
                  <span className="press-log__check" aria-hidden="true">○</span>
                  <span className="press-log__entry">
                    <span data-lang="en">Bind, number &amp; pack — Editions 001 → 500</span>
                    <span data-lang="ko" hidden>제본·넘버링·포장 — 에디션 001 → 500</span>
                    <span data-lang="ja" hidden>製本·番号付け·梱包 — エディション 001 → 500</span>
                  </span>
                  <span className="press-log__time">— : —</span>
                </li>
              </ol>
              <aside className="press-log__gauges" aria-label="Ink levels">
                <div className="press-gauge">
                  <div className="press-gauge__top">
                    <span className="press-gauge__label">Drum A · Coral</span>
                    <span className="press-gauge__val">78%</span>
                  </div>
                  <div className="press-gauge__bar"><div className="press-gauge__fill press-gauge__fill--ink1" style={{width: '78%'}} /></div>
                </div>
                <div className="press-gauge">
                  <div className="press-gauge__top">
                    <span className="press-gauge__label">Drum B · Teal</span>
                    <span className="press-gauge__val">62%</span>
                  </div>
                  <div className="press-gauge__bar"><div className="press-gauge__fill press-gauge__fill--ink2" style={{width: '62%'}} /></div>
                </div>
                <div className="press-gauge">
                  <div className="press-gauge__top">
                    <span className="press-gauge__label">Paper · Cream 118gsm</span>
                    <span className="press-gauge__val">41%</span>
                  </div>
                  <div className="press-gauge__bar"><div className="press-gauge__fill press-gauge__fill--paper" style={{width: '41%'}} /></div>
                </div>
                <div className="press-log__signature">
                  <div className="press-log__sig-label">
                    <span data-lang="en">Operator on duty</span>
                    <span data-lang="ko" hidden>당직 오퍼레이터</span>
                    <span data-lang="ja" hidden>担当オペレーター</span>
                  </div>
                  <svg className="press-log__sig-glyph" viewBox="0 0 120 32" aria-hidden="true">
                    <path d="M4 24 Q 14 6, 22 18 T 38 16 Q 50 4, 58 22 T 80 14 Q 94 24, 110 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M 90 22 L 116 22" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  </svg>
                  <div className="press-log__sig-name">K. Tanaka · #042</div>
                </div>
              </aside>
            </div>
            <footer className="press-log__foot">
              <span className="press-log__foot-tag">FORM RP-04 / Rev. 12</span>
              <span className="press-log__foot-tag">PROOF ROOM ENTRY</span>
              <span className="press-log__foot-tag">RETAIN 30 DAYS</span>
            </footer>
          </section>
          {/* ═══ Print Proof: Color Separation Layers ═══ */}
          <section className="print-proof">
            <div className="print-proof__label">
              <span data-lang="en">Print Proof — Color Separation Layers</span>
              <span data-lang="ko" hidden>인쇄 교정 — 색 분판 레이어</span>
              <span data-lang="ja" hidden>校正刷り — 色分版レイヤー</span>
            </div>
            <div className="print-proof__layers">
              <div className="proof-layer proof-layer--red">
                <div className="proof-layer__halftone" />
                <div className="proof-layer__shape" />
                <div className="proof-layer__name">
                  <span data-lang="en">Layer 1</span>
                  <span data-lang="ko" hidden>레이어 1</span>
                  <span data-lang="ja" hidden>レイヤー 1</span>
                </div>
                <div className="proof-layer__ink-label">
                  <span data-lang="en">Red Ink Only</span>
                  <span data-lang="ko" hidden>레드 잉크만</span>
                  <span data-lang="ja" hidden>赤インクのみ</span>
                </div>
              </div>
              <div className="proof-layer proof-layer--teal">
                <div className="proof-layer__halftone" />
                <div className="proof-layer__shape" />
                <div className="proof-layer__name">
                  <span data-lang="en">Layer 2</span>
                  <span data-lang="ko" hidden>레이어 2</span>
                  <span data-lang="ja" hidden>レイヤー 2</span>
                </div>
                <div className="proof-layer__ink-label">
                  <span data-lang="en">Teal Ink Only</span>
                  <span data-lang="ko" hidden>틸 잉크만</span>
                  <span data-lang="ja" hidden>ティールインクのみ</span>
                </div>
              </div>
              <div className="proof-layer proof-layer--combined">
                <div className="proof-layer__halftone" />
                <div className="proof-layer__shapes">
                  <div className="proof-layer__shape proof-layer__shape--r" />
                  <div className="proof-layer__shape proof-layer__shape--t" />
                </div>
                <div className="proof-layer__name">
                  <span data-lang="en">Layer 3</span>
                  <span data-lang="ko" hidden>레이어 3</span>
                  <span data-lang="ja" hidden>レイヤー 3</span>
                </div>
                <div className="proof-layer__ink-label">
                  <span data-lang="en">Combined + Overprint</span>
                  <span data-lang="ko" hidden>결합 + 오버프린트</span>
                  <span data-lang="ja" hidden>合成 + オーバープリント</span>
                </div>
              </div>
            </div>
          </section>
          {/* ═══ Geometric Shapes ═══ */}
          <section className="shapes-section">
            <div className="shapes-section__label">
              <span data-lang="en">Risograph Geometric Forms — Halftone &amp; Solid Fills</span>
              <span data-lang="ko" hidden>리소그래프 기하학적 형태 — 하프톤 &amp; 솔리드 채움</span>
              <span data-lang="ja" hidden>リソグラフ幾何学形状 — ハーフトーン＆ソリッド塗り</span>
            </div>
            <div className="shapes-grid">
              <div className="riso-shape riso-shape--circle-red" />
              <div className="riso-shape riso-shape--rect-teal" />
              <div className="riso-shape riso-shape--triangle" />
              <div className="riso-shape riso-shape--circle-teal" />
              <div className="riso-shape riso-shape--rect-red" />
              <div className="riso-shape riso-shape--circle-overprint" />
              <div className="riso-shape riso-shape--misreg-square" />
            </div>
          </section>
          {/* ═══ Color Swatches ═══ */}
          <section className="color-swatches">
            <div className="color-swatches__label">
              <span data-lang="en">Ink Drums — Color Swatch Palette</span>
              <span data-lang="ko" hidden>잉크 드럼 — 색상 견본 팔레트</span>
              <span data-lang="ja" hidden>インクドラム — カラースウォッチパレット</span>
            </div>
            <div className="swatches-grid">
              <article className="swatch">
                <div className="swatch__color swatch__color--ink1" />
                <div className="swatch__info">
                  <div className="swatch__name">
                    <span data-lang="en">Ink 1 — Coral Red</span>
                    <span data-lang="ko" hidden>잉크 1 — 코랄 레드</span>
                    <span data-lang="ja" hidden>インク1 — コーラルレッド</span>
                  </div>
                  <div className="swatch__hex">#ff6b6b</div>
                </div>
              </article>
              <article className="swatch">
                <div className="swatch__color swatch__color--ink2" />
                <div className="swatch__info">
                  <div className="swatch__name">
                    <span data-lang="en">Ink 2 — Teal</span>
                    <span data-lang="ko" hidden>잉크 2 — 틸</span>
                    <span data-lang="ja" hidden>インク2 — ティール</span>
                  </div>
                  <div className="swatch__hex">#4ecdc4</div>
                </div>
              </article>
              <article className="swatch">
                <div className="swatch__color swatch__color--overprint" />
                <div className="swatch__info">
                  <div className="swatch__name">
                    <span data-lang="en">Overprint</span>
                    <span data-lang="ko" hidden>오버프린트</span>
                    <span data-lang="ja" hidden>オーバープリント</span>
                  </div>
                  <div className="swatch__hex">#8b5e3c</div>
                </div>
              </article>
              <article className="swatch">
                <div className="swatch__color swatch__color--paper" />
                <div className="swatch__info">
                  <div className="swatch__name">
                    <span data-lang="en">Paper</span>
                    <span data-lang="ko" hidden>용지</span>
                    <span data-lang="ja" hidden>用紙</span>
                  </div>
                  <div className="swatch__hex">#ede6d6</div>
                </div>
              </article>
            </div>
          </section>
          {/* ═══ Run Specification Sheet ═══ */}
          <section className="spec-sheet">
            <div className="spec-sheet__head">
              <div className="spec-sheet__label">
                <span data-lang="en">Run Specification Sheet — Edition 042 / 500</span>
                <span data-lang="ko" hidden>인쇄 사양서 — 에디션 042 / 500</span>
                <span data-lang="ja" hidden>印刷仕様書 — エディション 042 / 500</span>
              </div>
              <div className="spec-sheet__barcode" aria-hidden="true">
                {Array.from({length: 28}).map((_, i) => (
                  <span key={i} style={{width: `${1 + (i % 4)}px`}} />
                ))}
                <em>042-500-RP</em>
              </div>
            </div>
            <table className="spec-table">
              <tbody>
                <tr>
                  <th>
                    <span data-lang="en">Paper Stock</span>
                    <span data-lang="ko" hidden>용지</span>
                    <span data-lang="ja" hidden>用紙</span>
                  </th>
                  <td>French Speckletone · Cream 80lb</td>
                  <th className="spec-table__th2">
                    <span data-lang="en">Coverage</span>
                    <span data-lang="ko" hidden>커버리지</span>
                    <span data-lang="ja" hidden>カバレッジ</span>
                  </th>
                  <td><span className="spec-bar"><span className="spec-bar__fill spec-bar__fill--ink1" style={{width: '38%'}} /></span><em className="spec-em">38% / Ink A</em></td>
                </tr>
                <tr>
                  <th>
                    <span data-lang="en">Weight</span>
                    <span data-lang="ko" hidden>평량</span>
                    <span data-lang="ja" hidden>坪量</span>
                  </th>
                  <td>118 gsm · uncoated</td>
                  <th className="spec-table__th2">
                    <span data-lang="en">Coverage</span>
                    <span data-lang="ko" hidden>커버리지</span>
                    <span data-lang="ja" hidden>カバレッジ</span>
                  </th>
                  <td><span className="spec-bar"><span className="spec-bar__fill spec-bar__fill--ink2" style={{width: '42%'}} /></span><em className="spec-em">42% / Ink B</em></td>
                </tr>
                <tr>
                  <th>
                    <span data-lang="en">Drum A</span>
                    <span data-lang="ko" hidden>드럼 A</span>
                    <span data-lang="ja" hidden>ドラムA</span>
                  </th>
                  <td>Coral Red · #FF6B6B · soy-based</td>
                  <th className="spec-table__th2">
                    <span data-lang="en">Overprint</span>
                    <span data-lang="ko" hidden>오버프린트</span>
                    <span data-lang="ja" hidden>オーバープリント</span>
                  </th>
                  <td><span className="spec-bar"><span className="spec-bar__fill spec-bar__fill--op" style={{width: '12%'}} /></span><em className="spec-em">12% / A∩B</em></td>
                </tr>
                <tr>
                  <th>
                    <span data-lang="en">Drum B</span>
                    <span data-lang="ko" hidden>드럼 B</span>
                    <span data-lang="ja" hidden>ドラムB</span>
                  </th>
                  <td>Teal · #4ECDC4 · soy-based</td>
                  <th className="spec-table__th2">
                    <span data-lang="en">Speed</span>
                    <span data-lang="ko" hidden>속도</span>
                    <span data-lang="ja" hidden>速度</span>
                  </th>
                  <td>130 ppm · auto-feed</td>
                </tr>
                <tr>
                  <th>
                    <span data-lang="en">Master</span>
                    <span data-lang="ko" hidden>마스터</span>
                    <span data-lang="ja" hidden>マスター</span>
                  </th>
                  <td>Thermal · 600 dpi · A3</td>
                  <th className="spec-table__th2">
                    <span data-lang="en">Temp</span>
                    <span data-lang="ko" hidden>온도</span>
                    <span data-lang="ja" hidden>温度</span>
                  </th>
                  <td>24.0 °C · 48% RH</td>
                </tr>
                <tr>
                  <th>
                    <span data-lang="en">Registration</span>
                    <span data-lang="ko" hidden>맞춤</span>
                    <span data-lang="ja" hidden>見当合わせ</span>
                  </th>
                  <td>
                    <span data-lang="en">Embraced misregistration · ±1.6 px</span>
                    <span data-lang="ko" hidden>의도된 어긋남 · ±1.6 px</span>
                    <span data-lang="ja" hidden>意図的なずれ · ±1.6 px</span>
                  </td>
                  <th className="spec-table__th2">
                    <span data-lang="en">Cost / sheet</span>
                    <span data-lang="ko" hidden>장당 단가</span>
                    <span data-lang="ja" hidden>1枚あたりコスト</span>
                  </th>
                  <td>¥ 240 · USD 1.62</td>
                </tr>
              </tbody>
            </table>
          </section>
          {/* ═══ Typography Specimen ═══ */}
          <section className="type-specimen">
            <div className="type-specimen__grain-overlay" />
            <div className="type-specimen__label">
              <span data-lang="en">Typography Specimen — Limited Color Palette</span>
              <span data-lang="ko" hidden>타이포그래피 견본 — 제한된 색상 팔레트</span>
              <span data-lang="ja" hidden>タイポグラフィ見本 — 限定カラーパレット</span>
            </div>
            <div className="type-specimen__display">
              <span data-lang="en">Space Grotesk 700</span>
              <span data-lang="ko" hidden>Space Grotesk 700</span>
              <span data-lang="ja" hidden>Space Grotesk 700</span>
            </div>
            <p className="type-specimen__body" data-lang="en">
              Risograph printing uses a stencil-based process where each ink color requires a
              separate master and pass through the machine. The result is a tactile, textured
              print with visible halftone patterns and slight color misalignment between layers.
            </p>
            <p className="type-specimen__body" data-lang="ko" hidden>
              리소그래프는 스텐실 방식으로 찍어내며, 잉크 색마다 마스터를 따로 만들어
              기계에 한 번씩 더 통과시킵니다. 그래서 결과물에는 손끝에 닿는 질감과 함께
              하프톤 패턴, 그리고 레이어끼리 살짝 어긋난 색이 남습니다.
            </p>
            <p className="type-specimen__body" data-lang="ja" hidden>
              リソグラフはステンシル方式で刷ります。インクの色ごとにマスターを別々に作り、
              そのたびに機械を一度ずつ通します。だから刷り上がりには手ざわりのある質感が残り、
              ハーフトーンの模様と、レイヤー同士のわずかな色ずれが生まれます。
            </p>
            <div className="type-specimen__mono">
              <span data-lang="en">Space Mono 400 — ABCDEFGHIJKLMNOPQRSTUVWXYZ — 0123456789</span>
              <span data-lang="ko" hidden>Space Mono 400 — ABCDEFGHIJKLMNOPQRSTUVWXYZ — 0123456789</span>
              <span data-lang="ja" hidden>Space Mono 400 — ABCDEFGHIJKLMNOPQRSTUVWXYZ — 0123456789</span>
            </div>
          </section>
          {/* ═══ Editorial Zine Spread ═══ */}
          <section className="zine-spread">
            <div className="zine-spread__grain" aria-hidden="true" />
            <header className="zine-spread__head">
              <div className="zine-spread__folio">
                <span data-lang="en">FOLIO · 014</span>
                <span data-lang="ko" hidden>FOLIO · 014</span>
                <span data-lang="ja" hidden>FOLIO · 014</span>
              </div>
              <div className="zine-spread__column">
                <span data-lang="en">FROM THE DRUM ROOM ▲ NOTES BY THE PRESS</span>
                <span data-lang="ko" hidden>드럼룸에서 ▲ 인쇄기 곁의 노트</span>
                <span data-lang="ja" hidden>ドラムルームより ▲ 印刷機の傍らから</span>
              </div>
              <div className="zine-spread__folio zine-spread__folio--right">
                <span>VOL. 042</span>
              </div>
            </header>
            <h2 className="zine-spread__title">
              <span data-lang="en">A short essay on the <em>graceful misalignment</em> of color</span>
              <span data-lang="ko" hidden>색의 <em>우아한 어긋남</em>에 관한 짧은 에세이</span>
              <span data-lang="ja" hidden>色の<em>美しいずれ</em>に関する短い随筆</span>
            </h2>
            <div className="zine-spread__byline">
              <span data-lang="en">— By the Press Operator, May 14, 2026</span>
              <span data-lang="ko" hidden>— 인쇄 오퍼레이터 씀, 2026년 5월 14일</span>
              <span data-lang="ja" hidden>— 印刷オペレーター記、2026年5月14日</span>
            </div>
            <div className="zine-spread__cols">
              <div className="zine-spread__col">
                <p className="zine-spread__para zine-spread__para--lead">
                  <span className="zine-spread__dropcap" aria-hidden="true">T</span>
                  <span data-lang="en"><span className="zine-spread__dc-target">he</span> drum spins. Coral red lays first, then a beat, then teal. Where the two inks rest on the same fiber of paper, a brown emerges — never planned, never quite the same on any two sheets. This is the secret economy of risograph: a third color is given to you for free, in exchange for never being precise.</span>
                  <span data-lang="ko" hidden><span className="zine-spread__dc-target">럼이</span> 돌아간다. 코랄 레드가 먼저 놓이고, 한 박자 쉰 뒤 틸이 따라온다. 두 잉크가 같은 종이 섬유 위에 함께 머무는 곳에서 갈색이 나타난다 — 의도된 적도 없고, 어떤 두 장도 결코 똑같지 않다. 이것이 리소그래프의 숨은 셈법이다. 정확함을 포기하는 대신, 세 번째 색이 저절로 따라온다.</span>
                  <span data-lang="ja" hidden><span className="zine-spread__dc-target">ドラ</span>ムが回る。まずコーラルレッドを刷り、一拍おいてティールを重ねる。二つのインクが同じ紙の繊維に重なる場所で、茶色が立ち上がる — 狙ったわけでもなく、二枚として同じものはない。これがリソグラフの秘密の経済だ。正確であることを手放す代わりに、第三の色がただで手に入る。</span>
                </p>
                <p className="zine-spread__para">
                  <span data-lang="en">Offset printers in Tokyo and Brooklyn fight their machines to the half-millimeter. The riso operator does the opposite. We do not chase registration; we keep a sharp pencil to <strong>note where it drifts</strong>, so the next pull will fall a hair to the left, or a hair to the right, on purpose.</span>
                  <span data-lang="ko" hidden>도쿄와 브루클린의 오프셋 인쇄공들은 0.5mm까지 기계와 싸운다. 리소 오퍼레이터는 반대로 한다. 우리는 맞춤을 쫓지 않는다. 대신 연필을 날카롭게 깎아 <strong>어디서 어긋났는지</strong>를 기록한다. 다음 한 장은 일부러 머리카락 한 올만큼 왼쪽으로, 혹은 오른쪽으로 떨어진다.</span>
                  <span data-lang="ja" hidden>東京やブルックリンのオフセット印刷工は、半ミリ単位で機械と格闘する。リソのオペレーターは逆だ。私たちは見当合わせを追わない。代わりに鉛筆を尖らせ、<strong>どこでずれたか</strong>を書きとめる。だから次の一枚は、わざと髪の毛一本ぶん左へ、あるいは右へと落ちる。</span>
                </p>
              </div>
              <div className="zine-spread__pull">
                <div className="zine-spread__pull-mark" aria-hidden="true">¶</div>
                <blockquote>
                  <span data-lang="en">The slight misregistration is not a flaw — it is the print's <em>signature</em>.</span>
                  <span data-lang="ko" hidden>미세한 어긋남은 결함이 아니다 — 그것은 인쇄물의 <em>서명</em>이다.</span>
                  <span data-lang="ja" hidden>わずかなずれは欠陥ではない — それは刷り物の<em>署名</em>である。</span>
                </blockquote>
                <div className="zine-spread__pull-attr">
                  <span data-lang="en">— field notebook, drum room, 2026.04</span>
                  <span data-lang="ko" hidden>— 현장 노트, 드럼룸, 2026.04</span>
                  <span data-lang="ja" hidden>— 現場ノート, ドラムルーム, 2026.04</span>
                </div>
              </div>
              <div className="zine-spread__col">
                <p className="zine-spread__para">
                  <span data-lang="en">Each pass leaves a dot, never a line. Together, the dots form the impression of a curve, of a face, of a city skyline at dusk. Press your finger to the paper and the ink is still warm.</span>
                  <span data-lang="ko" hidden>매 인쇄는 점을 남긴다. 결코 선이 아니다. 점들이 모여 곡선의 인상이, 얼굴의 인상이, 황혼 무렵 도시 스카이라인의 인상이 된다. 종이에 손가락을 대보면 잉크는 아직 따뜻하다.</span>
                  <span data-lang="ja" hidden>一度刷るごとに残るのは点であって、線ではない。その点が集まって、曲線の、顔の、黄昏の街並みの輪郭を浮かび上がらせる。紙に指を当てると、インクはまだ温かい。</span>
                </p>
                <p className="zine-spread__para">
                  <span data-lang="en">So: keep the dots loose. Let the layers breathe. Print number 042 of 500. Not perfect — only <strong>itself</strong>.</span>
                  <span data-lang="ko" hidden>그러니 도트는 헐겁게 두자. 레이어가 숨 쉬게 하자. 인쇄 042번 / 500부. 완벽하지 않다 — 다만 <strong>그 자신일 뿐</strong>이다.</span>
                  <span data-lang="ja" hidden>だからドットはゆるく置こう。レイヤーに呼吸させよう。プリント042番 / 500部。完璧ではない — ただ<strong>それ自身</strong>であるだけだ。</span>
                </p>
                <ul className="zine-spread__footnotes">
                  <li>
                    <sup>1</sup>
                    <span data-lang="en">overprint = red + teal × multiply</span>
                    <span data-lang="ko" hidden>오버프린트 = 레드 + 틸 × multiply</span>
                    <span data-lang="ja" hidden>オーバープリント = 赤 + ティール × multiply</span>
                  </li>
                  <li>
                    <sup>2</sup>
                    <span data-lang="en">drum rest interval ≈ 4 sec / sheet</span>
                    <span data-lang="ko" hidden>드럼 휴지 간격 ≈ 4초 / 장</span>
                    <span data-lang="ja" hidden>ドラム休止間隔 ≈ 4秒 / 枚</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="zine-spread__margin zine-spread__margin--left" aria-hidden="true">
              <svg viewBox="0 0 80 20" className="zine-spread__arrow"><path d="M70 10 L 10 10 M 10 10 L 18 4 M 10 10 L 18 16" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>
              <span className="zine-spread__margin-text">
                <span data-lang="en">drum changeover</span>
                <span data-lang="ko" hidden>드럼 교체 시점</span>
                <span data-lang="ja" hidden>ドラム交換</span>
              </span>
            </div>
            <div className="zine-spread__margin zine-spread__margin--right" aria-hidden="true">
              <span className="zine-spread__margin-text zine-spread__margin-text--teal">
                <span data-lang="en">second pass aligns here</span>
                <span data-lang="ko" hidden>2차 인쇄 정렬</span>
                <span data-lang="ja" hidden>2回目はここで揃う</span>
              </span>
              <svg viewBox="0 0 80 20" className="zine-spread__arrow zine-spread__arrow--right"><path d="M10 10 L 70 10 M 70 10 L 62 4 M 70 10 L 62 16" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>
            </div>
          </section>
          {/* ═══ Poster Composition ═══ */}
          <section className="poster">
            <div className="poster__halftone" />
            <div className="poster__big-circle" />
            <div className="poster__big-circle poster__big-circle--offset" />
            <div className="poster__title">
              <span data-lang="en">Beautiful <em>Imperfection</em></span>
              <span data-lang="ko" hidden>아름다운 <em>불완전함</em></span>
              <span data-lang="ja" hidden>美しい<em>不完全さ</em></span>
            </div>
            <div className="poster__sub">
              <span data-lang="en">Each print is one of a kind</span>
              <span data-lang="ko" hidden>모든 인쇄물은 유일무이합니다</span>
              <span data-lang="ja" hidden>すべてのプリントは唯一無二</span>
            </div>
            <div className="poster__edition">Ed. 042 / 500</div>
          </section>
          {/* ═══ Catalog of Mini Zine Covers ═══ */}
          <section className="catalog">
            <div className="catalog__head">
              <div className="catalog__label">
                <span data-lang="en">Issue Catalog — Drum Room Press, 2024–2026</span>
                <span data-lang="ko" hidden>이슈 카탈로그 — 드럼룸 프레스, 2024–2026</span>
                <span data-lang="ja" hidden>イシューカタログ — ドラムルームプレス, 2024–2026</span>
              </div>
              <div className="catalog__counter">8 / 8</div>
            </div>
            <div className="catalog__grid">
              <article className="cover cover--red">
                <div className="cover__halftone" aria-hidden="true" />
                <div className="cover__no">№ 001</div>
                <div className="cover__title">DOT</div>
                <div className="cover__sub">
                  <span data-lang="en">on the smallest mark a press can make</span>
                  <span data-lang="ko" hidden>인쇄기가 남길 수 있는 가장 작은 자국</span>
                  <span data-lang="ja" hidden>印刷機が残せる最も小さな点について</span>
                </div>
                <div className="cover__stamp">SOLD OUT</div>
              </article>
              <article className="cover cover--teal">
                <div className="cover__halftone" aria-hidden="true" />
                <div className="cover__no">№ 002</div>
                <div className="cover__title">GRAIN</div>
                <div className="cover__sub">
                  <span data-lang="en">paper fiber as collaborator</span>
                  <span data-lang="ko" hidden>공동작업자로서의 종이 섬유</span>
                  <span data-lang="ja" hidden>共同制作者としての紙の繊維</span>
                </div>
                <div className="cover__stamp">SOLD OUT</div>
              </article>
              <article className="cover cover--paper">
                <div className="cover__halftone cover__halftone--dense" aria-hidden="true" />
                <div className="cover__no">№ 003</div>
                <div className="cover__title cover__title--alt">INK<br/>BLEED</div>
                <div className="cover__sub">
                  <span data-lang="en">edges as soft territory</span>
                  <span data-lang="ko" hidden>부드러운 영역으로서의 가장자리</span>
                  <span data-lang="ja" hidden>柔らかな領域としての縁</span>
                </div>
                <div className="cover__stamp">IN STOCK</div>
              </article>
              <article className="cover cover--overprint">
                <div className="cover__halftone" aria-hidden="true" />
                <div className="cover__no">№ 004</div>
                <div className="cover__title">PRESS</div>
                <div className="cover__sub">
                  <span data-lang="en">an evening with the drum</span>
                  <span data-lang="ko" hidden>드럼과 함께한 어느 저녁</span>
                  <span data-lang="ja" hidden>ドラムと過ごす一夜</span>
                </div>
                <div className="cover__stamp">IN STOCK</div>
              </article>
              <article className="cover cover--paper cover--rot-left">
                <div className="cover__halftone cover__halftone--dense" aria-hidden="true" />
                <div className="cover__no">№ 005</div>
                <div className="cover__title cover__title--small">MARGIN<br/>NOTES</div>
                <div className="cover__sub">
                  <span data-lang="en">what we wrote in the gutter</span>
                  <span data-lang="ko" hidden>여백에 적어둔 것들</span>
                  <span data-lang="ja" hidden>余白に書きとめたこと</span>
                </div>
                <div className="cover__stamp">PREORDER</div>
              </article>
              <article className="cover cover--red cover--rot-right">
                <div className="cover__halftone" aria-hidden="true" />
                <div className="cover__no">№ 006</div>
                <div className="cover__title">RUN</div>
                <div className="cover__sub">
                  <span data-lang="en">five hundred and no two alike</span>
                  <span data-lang="ko" hidden>500부, 어느 것도 똑같지 않다</span>
                  <span data-lang="ja" hidden>500部、どれ一つ同じものはない</span>
                </div>
                <div className="cover__stamp">PREORDER</div>
              </article>
              <article className="cover cover--teal">
                <div className="cover__halftone" aria-hidden="true" />
                <div className="cover__no">№ 007</div>
                <div className="cover__title cover__title--small">MIS<br/>REG</div>
                <div className="cover__sub">
                  <span data-lang="en">a defense of the off-by-one</span>
                  <span data-lang="ko" hidden>한 칸 어긋남에 대한 변호</span>
                  <span data-lang="ja" hidden>一マスのずれを擁護する</span>
                </div>
                <div className="cover__stamp">COMING</div>
              </article>
              <article className="cover cover--ink3">
                <div className="cover__halftone" aria-hidden="true" />
                <div className="cover__no">№ 008</div>
                <div className="cover__title cover__title--light">SOY</div>
                <div className="cover__sub cover__sub--light">
                  <span data-lang="en">an oil that smells of beans &amp; paper</span>
                  <span data-lang="ko" hidden>콩 냄새와 종이 냄새가 나는 기름</span>
                  <span data-lang="ja" hidden>豆と紙の匂いがする油</span>
                </div>
                <div className="cover__stamp cover__stamp--light">COMING</div>
              </article>
            </div>
          </section>
          {/* ═══ Studio History Timeline ═══ */}
          <section className="riso-history">
            <div className="riso-history__label">
              <span data-lang="en">Studio Lineage — A Brief History of the Drum</span>
              <span data-lang="ko" hidden>스튜디오 계보 — 드럼의 간략한 역사</span>
              <span data-lang="ja" hidden>スタジオの系譜 — ドラムの簡略史</span>
            </div>
            <ol className="riso-history__rail">
              <li className="riso-history__node">
                <span className="riso-history__dot" />
                <div className="riso-history__year">1946</div>
                <div className="riso-history__txt">
                  <span data-lang="en">Riso Kagaku founded in Tokyo. Mimeograph ink, hand cranks.</span>
                  <span data-lang="ko" hidden>도쿄에서 리소 카가쿠 창업. 미메오그래프 잉크, 수동 핸들.</span>
                  <span data-lang="ja" hidden>東京で理想科学創業。謄写版インクと手回し機。</span>
                </div>
              </li>
              <li className="riso-history__node">
                <span className="riso-history__dot riso-history__dot--ink1" />
                <div className="riso-history__year">1986</div>
                <div className="riso-history__txt">
                  <span data-lang="en">First fully automatic Risograph (RA-4200). One drum, soy-based ink.</span>
                  <span data-lang="ko" hidden>첫 완전 자동 리소그래프(RA-4200) 출시. 단일 드럼, 콩기름 잉크.</span>
                  <span data-lang="ja" hidden>初の全自動リソグラフ(RA-4200)発売。シングルドラム、大豆インク。</span>
                </div>
              </li>
              <li className="riso-history__node">
                <span className="riso-history__dot riso-history__dot--ink2" />
                <div className="riso-history__year">1999</div>
                <div className="riso-history__txt">
                  <span data-lang="en">Dual-drum models arrive. Two passes, one pull — overprint is born.</span>
                  <span data-lang="ko" hidden>듀얼 드럼 모델 등장. 한 번에 두 패스 — 오버프린트의 탄생.</span>
                  <span data-lang="ja" hidden>デュアルドラム機登場。一度の給紙で二色刷り — オーバープリント誕生。</span>
                </div>
              </li>
              <li className="riso-history__node">
                <span className="riso-history__dot" />
                <div className="riso-history__year">2014</div>
                <div className="riso-history__txt">
                  <span data-lang="en">Indie studios in Brooklyn, Berlin, Seoul, Osaka rediscover the press.</span>
                  <span data-lang="ko" hidden>브루클린, 베를린, 서울, 오사카의 독립 스튜디오들이 인쇄기를 재발견.</span>
                  <span data-lang="ja" hidden>ブルックリン、ベルリン、ソウル、大阪の独立スタジオが再発見。</span>
                </div>
              </li>
              <li className="riso-history__node riso-history__node--now">
                <span className="riso-history__dot riso-history__dot--op" />
                <div className="riso-history__year">2026</div>
                <div className="riso-history__txt">
                  <span data-lang="en">Drum Room Press · Edition 042 · this proof, on this paper.</span>
                  <span data-lang="ko" hidden>드럼룸 프레스 · 에디션 042 · 지금 이 교정, 이 종이 위에.</span>
                  <span data-lang="ja" hidden>ドラムルームプレス · エディション 042 · 今この校正、この紙の上で。</span>
                </div>
                <span className="riso-history__you-are-here">
                  <span data-lang="en">YOU ARE HERE ▲</span>
                  <span data-lang="ko" hidden>현재 위치 ▲</span>
                  <span data-lang="ja" hidden>現在地 ▲</span>
                </span>
              </li>
            </ol>
          </section>
          {/* ═══ Design Principle Cards ═══ */}
          <section className="principles">
            <div className="principles__label">
              <span data-lang="en">Design Principles — Risograph Aesthetic</span>
              <span data-lang="ko" hidden>디자인 원칙 — 리소그래프 에스테틱</span>
              <span data-lang="ja" hidden>デザイン原則 — リソグラフエステティック</span>
            </div>
            <div className="principles__grid">
              <article className="principle-card">
                <div className="principle-card__number">01</div>
                <div className="principle-card__title">
                  <span data-lang="en">Limited Palette</span>
                  <span data-lang="ko" hidden>제한된 팔레트</span>
                  <span data-lang="ja" hidden>限定パレット</span>
                </div>
                <div className="principle-card__desc">
                  <span data-lang="en">Use only 2-3 spot colors. New hues emerge from overprinting, not from adding more inks.</span>
                  <span data-lang="ko" hidden>별색은 2~3개만 씁니다. 새로운 색은 잉크를 더하는 게 아니라 색을 겹쳐 찍어 만듭니다.</span>
                  <span data-lang="ja" hidden>2〜3色のスポットカラーのみ使用。新しい色相はインク追加ではなくオーバープリントから生まれます。</span>
                </div>
              </article>
              <article className="principle-card">
                <div className="principle-card__number">02</div>
                <div className="principle-card__title">
                  <span data-lang="en">Misregistration</span>
                  <span data-lang="ko" hidden>어긋남</span>
                  <span data-lang="ja" hidden>ずれ</span>
                </div>
                <div className="principle-card__desc">
                  <span data-lang="en">Embrace the slight offset between color layers. 1-2px shifts create authentic analog character.</span>
                  <span data-lang="ko" hidden>색 레이어가 살짝 어긋나도 그대로 두세요. 1~2px만 밀려도 진짜 아날로그다운 느낌이 살아납니다.</span>
                  <span data-lang="ja" hidden>色レイヤー間のわずかなオフセットを受け入れましょう。1〜2pxのずれが本物のアナログ感を生み出します。</span>
                </div>
              </article>
              <article className="principle-card">
                <div className="principle-card__number">03</div>
                <div className="principle-card__title">
                  <span data-lang="en">Halftone Texture</span>
                  <span data-lang="ko" hidden>하프톤 텍스처</span>
                  <span data-lang="ja" hidden>ハーフトーンテクスチャ</span>
                </div>
                <div className="principle-card__desc">
                  <span data-lang="en">Dot patterns replace smooth gradients. Use CSS radial-gradient to simulate halftone screens.</span>
                  <span data-lang="ko" hidden>매끄러운 그라데이션 대신 도트 패턴을 씁니다. CSS radial-gradient로 하프톤 스크린을 흉내 냅니다.</span>
                  <span data-lang="ja" hidden>滑らかなグラデーションの代わりにドットパターンを使います。CSS radial-gradientでハーフトーンスクリーンを再現します。</span>
                </div>
              </article>
              <article className="principle-card">
                <div className="principle-card__number">04</div>
                <div className="principle-card__title">
                  <span data-lang="en">Paper + Ink Bleed</span>
                  <span data-lang="ko" hidden>종이 + 잉크 번짐</span>
                  <span data-lang="ja" hidden>紙 + インクにじみ</span>
                </div>
                <div className="principle-card__desc">
                  <span data-lang="en">Warm cream backgrounds evoke uncoated paper. Soft box-shadow and blur mimic ink bleeding at edges.</span>
                  <span data-lang="ko" hidden>따뜻한 크림색 배경은 코팅하지 않은 종이를 떠올리게 합니다. 부드러운 box-shadow와 blur로 가장자리에 잉크가 번진 듯한 느낌을 냅니다.</span>
                  <span data-lang="ja" hidden>温かみのあるクリーム背景がノーコート紙を連想させます。ソフトなbox-shadowとblurがエッジのインクにじみを再現します。</span>
                </div>
              </article>
            </div>
          </section>
          {/* ═══ Registration Marks (Bottom) ═══ */}
          <div className="reg-marks" style={{marginTop: 24}}>
            <div className="reg-mark"><div className="reg-mark-circle" /></div>
            <div className="reg-marks__info">
              <span data-lang="en">END OF PROOF — APPROVED FOR PRINT RUN</span>
              <span data-lang="ko" hidden>교정 종료 — 인쇄 승인됨</span>
              <span data-lang="ja" hidden>校正終了 — 印刷承認済み</span>
            </div>
            <div className="reg-mark"><div className="reg-mark-circle" /></div>
          </div>
          {/* ═══ Prompt Section ═══ */}
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Risograph Print style — soy-based ink aesthetic with limited spot colors on warm cream paper.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #f5f0e8 (warm cream paper){"\n"}--ink-1: #ff6b6b (risograph coral red — primary ink){"\n"}--ink-2: #4ecdc4 (risograph teal — secondary ink){"\n"}--ink-3: #2c3e50 (dark navy — text/borders){"\n"}--overprint: #8b5e3c (red + teal overlap = brown){"\n"}--paper: #ede6d6 (slightly darker paper for cards){"\n"}No other colors. New hues come only from overprint blending.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Display: "Space Grotesk" sans-serif, 700 weight, tracking -0.03em{"\n"}Body/Details: "Space Mono" monospace, 400 weight{"\n"}Scale: 12 / 14 / 16 / 20 / 28 / 56 / 88px (clamp(2.4rem, 7vw, 5.5rem)){"\n"}Body line-height: 1.7–1.8{"\n"}Display line-height: 1.05{"\n"}{"\n"}UI:{"\n"}- Cards/sections: 2px solid var(--ink-3), border-radius 4px (sharp, printerly){"\n"}- Misregistration effect on headlines: duplicate text layers in ink-1 and ink-2 with 1-2px translate offset, opacity 0.7, mix-blend-mode: multiply{"\n"}- Halftone dot backgrounds using CSS radial-gradient (0.5-1.5px dots, 4-8px spacing){"\n"}- Ink bleed effects: box-shadow and blurred ::after pseudo-elements at shape edges{"\n"}- Registration crosshair marks with circles at page edges{"\n"}- Print edition numbering ("Print 042 / 500"){"\n"}- Color separation proof showing individual ink layers and combined overprint{"\n"}{"\n"}LAYOUT:{"\n"}- Container: min(1080px, 92vw) centered, padding 28px 20px 80px{"\n"}- Hero padding: clamp(28px, 5vw, 56px) with halftone corner accent{"\n"}- 3-column print proof grid, 4-column swatch grid{"\n"}- Principle cards: auto-fit grid, minmax(240px, 1fr), gap 12px{"\n"}{"\n"}TEXTURE:{"\n"}- SVG feTurbulence paper grain: fixed, inset 0, opacity 0.06, baseFrequency 0.85, numOctaves 4, 256px repeat{"\n"}- Halftone dot overlay on fixed background: radial-gradient dots, opacity 0.06{"\n"}- Grain texture on typography specimens via dot pattern overlay{"\n"}- Geometric shapes with solid and halftone fills to demonstrate ink coverage{"\n"}{"\n"}MOTION:{"\n"}- Card/element entrance: translateY(12px) to 0, opacity 0 to 1, 0.6s ease, stagger 0.1s{"\n"}- Button hover: background rgba(255, 107, 107, 0.12), all 0.25s ease{"\n"}- No smooth gradients — all texture comes from dots and grain{"\n"}{"\n"}RESPONSIVE:{"\n"}- Below 768px: print proof layers stack to single column, swatches to 2-column, shapes wrap tighter{"\n"}- Above 768px: full grid layouts, generous padding{"\n"}{"\n"}FORBIDDEN:{"\n"}- No smooth gradients (use halftone dots instead){"\n"}- No drop shadows (use ink bleed blur only){"\n"}- No rounded corners above 4px (sharp printerly aesthetic){"\n"}- No more than 3 ink colors + overprint{"\n"}- No photographic images — all visual interest from shapes, dots, and color{"\n"}{"\n"}OUTPUT:{"\n"}1. Single HTML file with inline CSS{"\n"}2. Paper texture using SVG feTurbulence in body::after{"\n"}3. Misregistered headline with offset color layers{"\n"}4. Print proof section with color separation layers{"\n"}5. Geometric shape showcase with halftone and solid fills{"\n"}6. Color swatch palette, typography specimen, poster composition{"\n"}7. Design principle cards with halftone backgrounds and misregistered borders</pre>
            <pre data-lang="ko" hidden>리소그래프 프린트 스타일의 랜딩 페이지를 디자인해줘 — 따뜻한 크림색 종이 위에 콩기름 잉크 에스테틱과 제한된 별색.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #f5f0e8 (따뜻한 크림색 종이){"\n"}--ink-1: #ff6b6b (리소그래프 코랄 레드 — 1차 잉크){"\n"}--ink-2: #4ecdc4 (리소그래프 틸 — 2차 잉크){"\n"}--ink-3: #2c3e50 (다크 네이비 — 텍스트/테두리){"\n"}--overprint: #8b5e3c (레드 + 틸 겹침 = 브라운){"\n"}--paper: #ede6d6 (약간 어두운 종이 카드용){"\n"}다른 색상 사용 금지. 새로운 색조는 오버프린트 블렌딩에서만.{"\n"}{"\n"}타이포그래피:{"\n"}디스플레이: "Space Grotesk" sans-serif, 700 weight, tracking -0.03em{"\n"}본문/세부: "Space Mono" monospace, 400 weight{"\n"}스케일: 12 / 14 / 16 / 20 / 28 / 56 / 88px (clamp(2.4rem, 7vw, 5.5rem)){"\n"}본문 line-height: 1.7–1.8{"\n"}디스플레이 line-height: 1.05{"\n"}{"\n"}UI:{"\n"}- 카드/섹션: 2px solid var(--ink-3), border-radius 4px (날카롭고 인쇄적인){"\n"}- 헤드라인의 어긋남 효과: ink-1과 ink-2로 복제된 텍스트 레이어, 1-2px translate 오프셋, opacity 0.7, mix-blend-mode: multiply{"\n"}- CSS radial-gradient 하프톤 도트 배경 (0.5-1.5px 도트, 4-8px 간격){"\n"}- 잉크 번짐 효과: 도형 가장자리에 box-shadow와 blurred ::after 의사 요소{"\n"}- 페이지 가장자리에 십자 표시 등록 마크와 원{"\n"}- 인쇄 에디션 넘버링 ("Print 042 / 500"){"\n"}- 개별 잉크 레이어와 결합 오버프린트를 보여주는 색 분판 교정{"\n"}{"\n"}레이아웃:{"\n"}- 컨테이너: min(1080px, 92vw) 중앙정렬, padding 28px 20px 80px{"\n"}- 히어로 padding: clamp(28px, 5vw, 56px), 하프톤 코너 악센트{"\n"}- 3열 인쇄 교정 그리드, 4열 견본 그리드{"\n"}- 원칙 카드: auto-fit 그리드, minmax(240px, 1fr), gap 12px{"\n"}{"\n"}텍스처:{"\n"}- SVG feTurbulence 종이 그레인: fixed, inset 0, opacity 0.06, baseFrequency 0.85, numOctaves 4, 256px 반복{"\n"}- 고정 배경 하프톤 도트 오버레이: radial-gradient 도트, opacity 0.06{"\n"}- 도트 패턴 오버레이를 통한 타이포그래피 견본 그레인 텍스처{"\n"}- 솔리드와 하프톤 채움으로 잉크 커버리지를 보여주는 기하학적 도형{"\n"}{"\n"}모션:{"\n"}- 카드/요소 등장: translateY(12px)→0, opacity 0→1, 0.6s ease, 0.1s 순차{"\n"}- 버튼 hover: background rgba(255, 107, 107, 0.12), all 0.25s ease{"\n"}- 부드러운 그라데이션 없음 — 모든 텍스처는 도트와 그레인으로{"\n"}{"\n"}반응형:{"\n"}- 768px 미만: 인쇄 교정 레이어 단일 열로, 견본 2열로, 도형 더 빽빽하게{"\n"}- 768px 이상: 전체 그리드 레이아웃, 넉넉한 패딩{"\n"}{"\n"}금지사항:{"\n"}- 부드러운 그라데이션 금지 (대신 하프톤 도트 사용){"\n"}- 드롭 섀도우 금지 (잉크 번짐 blur만 사용){"\n"}- 4px 이상의 둥근 모서리 금지 (날카로운 인쇄 에스테틱){"\n"}- 3가지 잉크 색상 + 오버프린트 초과 금지{"\n"}- 사진 이미지 금지 — 모든 시각적 흥미는 도형, 도트, 색상에서{"\n"}{"\n"}출력:{"\n"}1. 인라인 CSS가 포함된 단일 HTML 파일{"\n"}2. body::after에 SVG feTurbulence를 사용한 종이 텍스처{"\n"}3. 오프셋 색상 레이어의 어긋난 헤드라인{"\n"}4. 색 분판 레이어가 포함된 인쇄 교정 섹션{"\n"}5. 하프톤과 솔리드 채움의 기하학적 도형 쇼케이스{"\n"}6. 색상 견본 팔레트, 타이포그래피 견본, 포스터 구성{"\n"}7. 하프톤 배경과 어긋난 테두리의 디자인 원칙 카드</pre>
            <pre data-lang="ja" hidden>リソグラフプリントスタイルのランディングページをデザインしてください — 温かみのあるクリーム色の紙に大豆インクのエステティックと限定スポットカラー。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #f5f0e8（温かみのあるクリーム色の紙）{"\n"}--ink-1: #ff6b6b（リソグラフ コーラルレッド — プライマリインク）{"\n"}--ink-2: #4ecdc4（リソグラフ ティール — セカンダリインク）{"\n"}--ink-3: #2c3e50（ダークネイビー — テキスト/ボーダー）{"\n"}--overprint: #8b5e3c（赤 + ティール重なり = ブラウン）{"\n"}--paper: #ede6d6（やや濃い紙 カード用）{"\n"}他の色は使用禁止。新しい色相はオーバープリントブレンドからのみ。{"\n"}{"\n"}タイポグラフィ:{"\n"}ディスプレイ: "Space Grotesk" sans-serif, 700 weight, tracking -0.03em{"\n"}本文/詳細: "Space Mono" monospace, 400 weight{"\n"}スケール: 12 / 14 / 16 / 20 / 28 / 56 / 88px (clamp(2.4rem, 7vw, 5.5rem)){"\n"}本文 line-height: 1.7–1.8{"\n"}ディスプレイ line-height: 1.05{"\n"}{"\n"}UI:{"\n"}- カード/セクション: 2px solid var(--ink-3), border-radius 4px（シャープで印刷的）{"\n"}- 見出しのずれ効果: ink-1とink-2で複製テキストレイヤー、1-2px translateオフセット、opacity 0.7、mix-blend-mode: multiply{"\n"}- CSS radial-gradientハーフトーンドット背景（0.5-1.5pxドット、4-8px間隔）{"\n"}- インクにじみ効果: 形状エッジにbox-shadowとblurred ::after疑似要素{"\n"}- ページエッジにクロスヘア登録マークと円{"\n"}- 印刷エディション番号（"Print 042 / 500"）{"\n"}- 個別インクレイヤーと合成オーバープリントを示す色分版校正{"\n"}{"\n"}レイアウト:{"\n"}- コンテナ: min(1080px, 92vw) 中央揃え, padding 28px 20px 80px{"\n"}- ヒーロー padding: clamp(28px, 5vw, 56px)、ハーフトーンコーナーアクセント{"\n"}- 3列校正グリッド、4列スウォッチグリッド{"\n"}- 原則カード: auto-fitグリッド、minmax(240px, 1fr)、gap 12px{"\n"}{"\n"}テクスチャ:{"\n"}- SVG feTurbulence紙グレイン: fixed, inset 0, opacity 0.06, baseFrequency 0.85, numOctaves 4, 256px繰り返し{"\n"}- 固定背景ハーフトーンドットオーバーレイ: radial-gradientドット、opacity 0.06{"\n"}- ドットパターンオーバーレイによるタイポグラフィ見本グレインテクスチャ{"\n"}- ソリッドとハーフトーン塗りでインクカバレッジを示す幾何学形状{"\n"}{"\n"}モーション:{"\n"}- カード/要素登場: translateY(12px)→0, opacity 0→1, 0.6s ease, 0.1s順次{"\n"}- ボタンhover: background rgba(255, 107, 107, 0.12), all 0.25s ease{"\n"}- 滑らかなグラデーションなし — すべてのテクスチャはドットとグレインから{"\n"}{"\n"}レスポンシブ:{"\n"}- 768px未満: 校正レイヤー単一列、スウォッチ2列、形状はよりコンパクトに{"\n"}- 768px以上: フルグリッドレイアウト、ゆとりのあるパディング{"\n"}{"\n"}禁止事項:{"\n"}- 滑らかなグラデーション禁止（代わりにハーフトーンドット使用）{"\n"}- ドロップシャドウ禁止（インクにじみblurのみ使用）{"\n"}- 4px以上の角丸禁止（シャープな印刷エステティック）{"\n"}- 3つのインク色 + オーバープリントを超える禁止{"\n"}- 写真画像禁止 — すべての視覚的興味は形状、ドット、色から{"\n"}{"\n"}出力:{"\n"}1. インラインCSS付きの単一HTMLファイル{"\n"}2. body::afterにSVG feTurbulenceを使用した紙テクスチャ{"\n"}3. オフセット色レイヤーのずれた見出し{"\n"}4. 色分版レイヤー付き校正セクション{"\n"}5. ハーフトーンとソリッド塗りの幾何学形状ショーケース{"\n"}6. カラースウォッチパレット、タイポグラフィ見本、ポスター構成{"\n"}7. ハーフトーン背景とずれたボーダーのデザイン原則カード</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/y2k-retro.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Windows 98</span></a><div className="page-nav__divider" /><a href="/pages/paper-cut.html"><span><span className="page-nav__label">다음</span>Paper Cut / Layered</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
