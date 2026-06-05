import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedLiquidMetalPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--liquid-metal">
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
          {/* HERO PANEL */}
          <section className="hero">
            <div className="hero-meta">
              <span className="hero-meta__serial">LM · 04 / 2026</span>
              <span className="hero-meta__dot" />
              <span className="hero-meta__edition" data-lang="en">Edition I — Forged Set</span>
              <span className="hero-meta__edition" data-lang="ko" hidden>제1호 — 단조 세트</span>
              <span className="hero-meta__edition" data-lang="ja" hidden>第一号 — 鍛造セット</span>
            </div>
            <div className="hero-content">
              <h1>LIQUID<br />METAL</h1>
              <div className="hero-subtitle" data-lang="en">Chrome Aesthetics · Pure CSS</div>
              <div className="hero-subtitle" data-lang="ko" hidden>크롬 미학 · 순수 CSS</div>
              <div className="hero-subtitle" data-lang="ja" hidden>クローム美学 · 純粋CSS</div>
              <p className="lead" data-lang="en">
                Premium chrome aesthetics forged from pure CSS. Multi-stop metallic gradients,
                edge-light highlights, and brushed surfaces — every element engineered
                to feel like polished alloy on a black void.
              </p>
              <p className="lead" data-lang="ko" hidden>
                순수 CSS로 단조한 프리미엄 크롬 미학. 다단 메탈릭 그라데이션,
                엣지 라이트 하이라이트, 브러시드 표면까지 — 모든 요소를
                새카만 공간 위 연마된 합금처럼 보이도록 설계했습니다.
              </p>
              <p className="lead" data-lang="ja" hidden>
                純粋なCSSだけで鍛え上げたプレミアムクロームの美学。多段のメタリックグラデーション、
                エッジを縁取る光、ブラシド仕上げの表面 — すべての要素を、漆黒の空間に浮かぶ
                磨き上げた合金のように見せています。
              </p>
              <div className="hero-cta">
                <button className="lm-btn lm-btn--primary" type="button">
                  <span data-lang="en">Inspect Specimen</span>
                  <span data-lang="ko" hidden>샘플 검사</span>
                  <span data-lang="ja" hidden>サンプル検査</span>
                  <span aria-hidden>→</span>
                </button>
                <button className="lm-btn lm-btn--ghost" type="button">
                  <span data-lang="en">Material Sheet</span>
                  <span data-lang="ko" hidden>재질 사양서</span>
                  <span data-lang="ja" hidden>材質仕様書</span>
                </button>
              </div>
            </div>
            <aside className="hero-ingot" aria-hidden="true">
              <div className="hero-ingot__stage">
                <div className="hero-ingot__column">
                  <div className="hero-ingot__sky" />
                  <div className="hero-ingot__horizon" />
                  <div className="hero-ingot__ground" />
                  <div className="hero-ingot__specular" />
                  <div className="hero-ingot__glint" />
                  <div className="hero-ingot__edge hero-ingot__edge--left" />
                  <div className="hero-ingot__edge hero-ingot__edge--right" />
                  <div className="hero-ingot__caps hero-ingot__caps--top" />
                  <div className="hero-ingot__caps hero-ingot__caps--bottom" />
                  <span className="hero-ingot__stamp">LM · 2026</span>
                  <span className="hero-ingot__weight">316L / 9.4 kg</span>
                </div>
                <div className="hero-ingot__reflection" />
                <div className="hero-ingot__floor" />
              </div>
              <div className="hero-ingot__meta">
                <span className="hero-ingot__meta-row">
                  <span className="hero-ingot__meta-key">Reflectance</span>
                  <span className="hero-ingot__meta-val">99.4 %</span>
                </span>
                <span className="hero-ingot__meta-row">
                  <span className="hero-ingot__meta-key">Bevel</span>
                  <span className="hero-ingot__meta-val">1.5 mm</span>
                </span>
                <span className="hero-ingot__meta-row">
                  <span className="hero-ingot__meta-key">Grade</span>
                  <span className="hero-ingot__meta-val">316L</span>
                </span>
              </div>
            </aside>
          </section>
          {/* SPECS PANEL */}
          <div className="specs-panel">
            <div className="specs-header">
              <span className="specs-label" data-lang="en">Technical Specifications</span>
              <span className="specs-label" data-lang="ko" hidden>기술 사양</span>
              <span className="specs-label" data-lang="ja" hidden>技術仕様</span>
              <span className="specs-line" />
            </div>
            <div className="specs-grid">
              <div className="spec-item">
                <div className="spec-item__key" data-lang="en">Base</div>
                <div className="spec-item__key" data-lang="ko" hidden>베이스</div>
                <div className="spec-item__key" data-lang="ja" hidden>ベース</div>
                <div className="spec-item__val">#0C0C0C</div>
              </div>
              <div className="spec-item">
                <div className="spec-item__key" data-lang="en">Chrome</div>
                <div className="spec-item__key" data-lang="ko" hidden>크롬</div>
                <div className="spec-item__key" data-lang="ja" hidden>クローム</div>
                <div className="spec-item__val">#C0C0C0</div>
              </div>
              <div className="spec-item">
                <div className="spec-item__key" data-lang="en">Highlight</div>
                <div className="spec-item__key" data-lang="ko" hidden>하이라이트</div>
                <div className="spec-item__key" data-lang="ja" hidden>ハイライト</div>
                <div className="spec-item__val">#FFFFFF</div>
              </div>
              <div className="spec-item">
                <div className="spec-item__key" data-lang="en">Shadow</div>
                <div className="spec-item__key" data-lang="ko" hidden>그림자</div>
                <div className="spec-item__key" data-lang="ja" hidden>シャドウ</div>
                <div className="spec-item__val">#6B6B6B</div>
              </div>
              <div className="spec-item">
                <div className="spec-item__key" data-lang="en">Typeface</div>
                <div className="spec-item__key" data-lang="ko" hidden>서체</div>
                <div className="spec-item__key" data-lang="ja" hidden>書体</div>
                <div className="spec-item__val">Sora 800</div>
              </div>
              <div className="spec-item">
                <div className="spec-item__key" data-lang="en">Sweep Cycle</div>
                <div className="spec-item__key" data-lang="ko" hidden>스윕 주기</div>
                <div className="spec-item__key" data-lang="ja" hidden>スイープ周期</div>
                <div className="spec-item__val">8s Loop</div>
              </div>
            </div>
          </div>
          <hr className="chrome-divider" />
          {/* FEATURE PLATES */}
          <div className="plates">
            <article className="plate">
              <span className="plate__number">01</span>
              <div className="plate__title" data-lang="en">Chrome Gradient Text</div>
              <div className="plate__title" data-lang="ko" hidden>크롬 그라데이션 텍스트</div>
              <div className="plate__title" data-lang="ja" hidden>クロームグラデーションテキスト</div>
              <p className="plate__desc" data-lang="en">
                Multi-stop vertical gradient mapped to text via background-clip.
                Animated background-position creates a living metallic sheen
                that shifts like light on brushed steel.
              </p>
              <p className="plate__desc" data-lang="ko" hidden>
                background-clip으로 다단 수직 그라데이션을 텍스트에 입힙니다.
                background-position을 움직이면, 브러시드 스틸 위로 빛이 흐르듯
                메탈릭 광택이 살아 움직입니다.
              </p>
              <p className="plate__desc" data-lang="ja" hidden>
                background-clipで多段の縦グラデーションをテキストに重ねます。
                background-positionを動かすと、ブラシドスチールの上を流れる光のように
                メタリックな光沢が生きたまま揺れ動きます。
              </p>
              <div className="plate__line" />
            </article>
            <article className="plate">
              <span className="plate__number">02</span>
              <div className="plate__title" data-lang="en">Light Sweep Animation</div>
              <div className="plate__title" data-lang="ko" hidden>라이트 스윕 애니메이션</div>
              <div className="plate__title" data-lang="ja" hidden>ライトスイープアニメーション</div>
              <p className="plate__desc" data-lang="en">
                A diagonal band of translucent white glides across surfaces
                via ::before pseudo-elements. Simulates the caustic reflection
                of light moving across a polished chrome panel.
              </p>
              <p className="plate__desc" data-lang="ko" hidden>
                ::before 가상 요소로 반투명한 흰색 대각선 띠가
                면 위를 가로질러 미끄러집니다. 광택 크롬 패널 위로
                빛이 지나가며 남기는 반사를 흉내 냅니다.
              </p>
              <p className="plate__desc" data-lang="ja" hidden>
                ::before擬似要素で、半透明の白い斜めの帯が
                表面を滑っていきます。磨き上げたクロームパネルの上を
                光が走り抜ける反射を再現します。
              </p>
              <div className="plate__line" />
            </article>
            <article className="plate">
              <span className="plate__number">03</span>
              <div className="plate__title" data-lang="en">Metallic Surface System</div>
              <div className="plate__title" data-lang="ko" hidden>메탈릭 서피스 시스템</div>
              <div className="plate__title" data-lang="ja" hidden>メタリックサーフェスシステム</div>
              <p className="plate__desc" data-lang="en">
                Every panel uses angled gradients from charcoal to near-black.
                Top-edge highlight lines via ::after create the illusion of
                a beveled metal edge catching ambient light.
              </p>
              <p className="plate__desc" data-lang="ko" hidden>
                모든 패널은 차콜에서 거의 블랙까지 기울어진 그라데이션을 씁니다.
                ::after로 그린 상단 하이라이트 라인이, 주변 빛을 받은
                베벨 메탈 모서리처럼 보이게 합니다.
              </p>
              <p className="plate__desc" data-lang="ja" hidden>
                どのパネルも、チャコールからほぼブラックへと斜めに流れるグラデーションを使います。
                ::afterで引いた上端のハイライトラインが、環境光を受けた
                面取りの縁のような錯覚を生みます。
              </p>
              <div className="plate__line" />
            </article>
          </div>
          <hr className="chrome-divider" />
          {/* CHROME GAUGE */}
          <div className="gauge-section">
            <div className="gauge-header">
              <span className="gauge-title" data-lang="en">Chrome Reflection Gauge</span>
              <span className="gauge-title" data-lang="ko" hidden>크롬 반사 게이지</span>
              <span className="gauge-title" data-lang="ja" hidden>クローム反射ゲージ</span>
              <span className="gauge-title" style={{color: 'var(--chrome)'}}>#000 — #FFF</span>
            </div>
            <div className="gauge-bar" />
            <div className="gauge-labels">
              <span>Shadow</span>
              <span>Chrome-Lo</span>
              <span>Chrome</span>
              <span>Chrome-Hi</span>
              <span>Peak</span>
            </div>
          </div>
          <hr className="chrome-divider" />
          {/* MATERIAL SAMPLE */}
          <div className="material-section">
            <div className="gauge-header">
              <span className="gauge-title" data-lang="en">Material Sample</span>
              <span className="gauge-title" data-lang="ko" hidden>재질 샘플</span>
              <span className="gauge-title" data-lang="ja" hidden>マテリアルサンプル</span>
            </div>
            <div className="material-strip">
              <div className="material-strip__swatch" data-label="#1A1A1A" />
              <div className="material-strip__swatch" data-label="#333333" />
              <div className="material-strip__swatch" data-label="#6B6B6B" />
              <div className="material-strip__swatch" data-label="#9E9E9E" />
              <div className="material-strip__swatch" data-label="#C0C0C0" />
              <div className="material-strip__swatch" data-label="#E0E0E0" />
              <div className="material-strip__swatch" data-label="#FFFFFF" />
            </div>
          </div>
          <hr className="chrome-divider" />
          {/* MODULES */}
          <section className="lm-modules">
            <div className="lm-modules__head">
              <span className="lm-modules__index">§ 04</span>
              <h2 className="lm-modules__title" data-lang="en">Modules</h2>
              <h2 className="lm-modules__title" data-lang="ko" hidden>모듈</h2>
              <h2 className="lm-modules__title" data-lang="ja" hidden>モジュール</h2>
              <p className="lm-modules__deck" data-lang="en">Interface elements drawn from the same alloy — every surface gradient-rolled, every edge beveled.</p>
              <p className="lm-modules__deck" data-lang="ko" hidden>같은 합금에서 빚어낸 인터페이스 요소들 — 면마다 그라데이션으로 압연하고, 모서리마다 베벨을 넣었습니다.</p>
              <p className="lm-modules__deck" data-lang="ja" hidden>同じ合金から鍛え上げたインターフェース要素 — どの面もグラデーションで圧延し、どの縁にも面取りを施しています。</p>
            </div>
            <div className="lm-modules__grid">
              <div className="lm-cell">
                <div className="lm-cell__head">
                  <span className="lm-cell__num">M / 01</span>
                  <span className="lm-cell__label" data-lang="en">Controls</span>
                  <span className="lm-cell__label" data-lang="ko" hidden>컨트롤</span>
                  <span className="lm-cell__label" data-lang="ja" hidden>コントロール</span>
                </div>
                <div className="lm-cell__body lm-demo-controls">
                  <button className="lm-btn lm-btn--primary" type="button">
                    <span data-lang="en">Forge Order</span>
                    <span data-lang="ko" hidden>주조 주문</span>
                    <span data-lang="ja" hidden>鋳造発注</span>
                    <span aria-hidden>→</span>
                  </button>
                  <button className="lm-btn lm-btn--ghost" type="button">
                    <span data-lang="en">Quote</span>
                    <span data-lang="ko" hidden>견적</span>
                    <span data-lang="ja" hidden>見積</span>
                  </button>
                  <a className="lm-btn lm-btn--text" href="#main-content">
                    <span data-lang="en">All grades</span>
                    <span data-lang="ko" hidden>전체 등급</span>
                    <span data-lang="ja" hidden>全グレード</span>
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
              <div className="lm-cell">
                <div className="lm-cell__head">
                  <span className="lm-cell__num">M / 02</span>
                  <span className="lm-cell__label" data-lang="en">Request a Sample</span>
                  <span className="lm-cell__label" data-lang="ko" hidden>샘플 요청</span>
                  <span className="lm-cell__label" data-lang="ja" hidden>サンプル請求</span>
                </div>
                <div className="lm-cell__body lm-demo-form">
                  <label className="lm-field">
                    <span className="lm-field__label" data-lang="en">Studio</span>
                    <span className="lm-field__label" data-lang="ko" hidden>스튜디오</span>
                    <span className="lm-field__label" data-lang="ja" hidden>スタジオ</span>
                    <input className="lm-field__input" type="text" placeholder="Atelier Chromé" />
                  </label>
                  <label className="lm-field">
                    <span className="lm-field__label" data-lang="en">Mail</span>
                    <span className="lm-field__label" data-lang="ko" hidden>메일</span>
                    <span className="lm-field__label" data-lang="ja" hidden>メール</span>
                    <input className="lm-field__input" type="email" placeholder="name@chrome.studio" />
                  </label>
                  <p className="lm-field__hint" data-lang="en">// dispatched in 4 working days</p>
                  <p className="lm-field__hint" data-lang="ko" hidden>// 영업일 기준 4일 내 발송</p>
                  <p className="lm-field__hint" data-lang="ja" hidden>// 営業日4日以内に発送</p>
                </div>
              </div>
              <div className="lm-cell">
                <div className="lm-cell__head">
                  <span className="lm-cell__num">M / 03</span>
                  <span className="lm-cell__label" data-lang="en">Grades</span>
                  <span className="lm-cell__label" data-lang="ko" hidden>등급</span>
                  <span className="lm-cell__label" data-lang="ja" hidden>グレード</span>
                </div>
                <div className="lm-cell__body lm-demo-tags">
                  <span className="lm-tag">Chrome</span>
                  <span className="lm-tag">Brushed</span>
                  <span className="lm-tag">Mirror</span>
                  <span className="lm-tag lm-tag--solid">316L</span>
                  <span className="lm-tag lm-tag--mono">Ø 02–05 mm</span>
                  <span className="lm-tag lm-tag--lit">In Stock</span>
                </div>
              </div>
              <div className="lm-cell lm-cell--gauge">
                <div className="lm-cell__head">
                  <span className="lm-cell__num">M / 04</span>
                  <span className="lm-cell__label" data-lang="en">Reflectance Gauge</span>
                  <span className="lm-cell__label" data-lang="ko" hidden>반사율 게이지</span>
                  <span className="lm-cell__label" data-lang="ja" hidden>反射率ゲージ</span>
                </div>
                <div className="lm-cell__body lm-gauge">
                  <div className="lm-gauge__column" aria-hidden="true">
                    <div className="lm-gauge__ticks">
                      <span><i>100</i></span>
                      <span><i>75</i></span>
                      <span><i>50</i></span>
                      <span><i>25</i></span>
                      <span><i>0</i></span>
                    </div>
                    <div className="lm-gauge__tube">
                      <div className="lm-gauge__fill">
                        <span className="lm-gauge__meniscus" />
                        <span className="lm-gauge__sheen" />
                      </div>
                    </div>
                  </div>
                  <div className="lm-gauge__readout">
                    <div className="lm-gauge__big">
                      <span className="lm-gauge__num">99.4</span>
                      <span className="lm-gauge__pct">%</span>
                    </div>
                    <div className="lm-gauge__caption" data-lang="en">Mercury level held — within tolerance.</div>
                    <div className="lm-gauge__caption" data-lang="ko" hidden>수은주 유지 — 허용 범위 내.</div>
                    <div className="lm-gauge__caption" data-lang="ja" hidden>水銀柱維持 — 許容範囲内。</div>
                    <ul className="lm-gauge__stats">
                      <li><span>Bevel</span><b>1.5 mm</b></li>
                      <li><span>Tones</span><b>04</b></li>
                      <li><span>Lot</span><b>2026 · 04</b></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="lm-cell lm-cell--wide">
                <div className="lm-cell__head">
                  <span className="lm-cell__num">M / 05</span>
                  <span className="lm-cell__label" data-lang="en">Specimen Cards</span>
                  <span className="lm-cell__label" data-lang="ko" hidden>샘플 카드</span>
                  <span className="lm-cell__label" data-lang="ja" hidden>サンプルカード</span>
                </div>
                <div className="lm-cell__body lm-demo-cards">
                  <article className="lm-card">
                    <div className="lm-card__plate lm-card__plate--brushed" aria-hidden>
                      <span className="lm-card__plate-num">01</span>
                      <span className="lm-card__plate-mark" />
                    </div>
                    <div className="lm-card__body">
                      <div className="lm-card__meta">
                        <span data-lang="en">Brushed · Vertical</span>
                        <span data-lang="ko" hidden>브러시드 · 수직</span>
                        <span data-lang="ja" hidden>ブラシド · 垂直</span>
                      </div>
                      <h4 className="lm-card__title" data-lang="en">Specimen 01</h4>
                      <h4 className="lm-card__title" data-lang="ko" hidden>샘플 01</h4>
                      <h4 className="lm-card__title" data-lang="ja" hidden>サンプル 01</h4>
                      <p className="lm-card__text" data-lang="en">Hand-finished vertical brush. Diffuse highlight, low specular return.</p>
                      <p className="lm-card__text" data-lang="ko" hidden>수작업 수직 브러시. 확산형 하이라이트, 낮은 스페큘러.</p>
                      <p className="lm-card__text" data-lang="ja" hidden>手仕上げの垂直ブラッシュ。拡散ハイライト、低スペキュラ。</p>
                    </div>
                  </article>
                  <article className="lm-card">
                    <div className="lm-card__plate lm-card__plate--mirror" aria-hidden>
                      <span className="lm-card__plate-num">02</span>
                      <span className="lm-card__plate-mark" />
                    </div>
                    <div className="lm-card__body">
                      <div className="lm-card__meta">
                        <span data-lang="en">Mirror · Polished</span>
                        <span data-lang="ko" hidden>미러 · 폴리시드</span>
                        <span data-lang="ja" hidden>ミラー · 鏡面</span>
                      </div>
                      <h4 className="lm-card__title" data-lang="en">Specimen 02</h4>
                      <h4 className="lm-card__title" data-lang="ko" hidden>샘플 02</h4>
                      <h4 className="lm-card__title" data-lang="ja" hidden>サンプル 02</h4>
                      <p className="lm-card__text" data-lang="en">Full chrome polish. 99.4% reflectance — close enough to a mirror to fool the eye.</p>
                      <p className="lm-card__text" data-lang="ko" hidden>풀 크롬 폴리싱. 반사율 99.4% — 눈을 속일 만큼 거울에 가깝습니다.</p>
                      <p className="lm-card__text" data-lang="ja" hidden>フルクローム研磨。反射率99.4% — 目を欺くほど鏡に近い。</p>
                    </div>
                  </article>
                  <article className="lm-card">
                    <div className="lm-card__plate lm-card__plate--bevel" aria-hidden>
                      <span className="lm-card__plate-num">03</span>
                      <span className="lm-card__plate-mark" />
                    </div>
                    <div className="lm-card__body">
                      <div className="lm-card__meta">
                        <span data-lang="en">Bevel · Edge Light</span>
                        <span data-lang="ko" hidden>베벨 · 엣지 라이트</span>
                        <span data-lang="ja" hidden>ベベル · エッジライト</span>
                      </div>
                      <h4 className="lm-card__title" data-lang="en">Specimen 03</h4>
                      <h4 className="lm-card__title" data-lang="ko" hidden>샘플 03</h4>
                      <h4 className="lm-card__title" data-lang="ja" hidden>サンプル 03</h4>
                      <p className="lm-card__text" data-lang="en">A 1.5mm chamfer along the edge. The catchlight that does most of the heavy lifting.</p>
                      <p className="lm-card__text" data-lang="ko" hidden>모서리를 따라 1.5mm 모따기. 이 빛 한 줄이 전체 인상을 좌우합니다.</p>
                      <p className="lm-card__text" data-lang="ja" hidden>縁に1.5mmの面取り。印象を決定づける光の一筋。</p>
                    </div>
                  </article>
                </div>
              </div>
              <div className="lm-cell lm-cell--wide">
                <div className="lm-cell__head">
                  <span className="lm-cell__num">M / 06</span>
                  <span className="lm-cell__label" data-lang="en">Production Log</span>
                  <span className="lm-cell__label" data-lang="ko" hidden>생산 로그</span>
                  <span className="lm-cell__label" data-lang="ja" hidden>生産ログ</span>
                </div>
                <div className="lm-cell__body lm-demo-log">
                  <ol className="lm-log">
                    <li>
                      <span className="lm-log__num">01</span>
                      <span className="lm-log__step" data-lang="en">Roll · annealing pass</span>
                      <span className="lm-log__step" data-lang="ko" hidden>롤링 · 어닐링 패스</span>
                      <span className="lm-log__step" data-lang="ja" hidden>圧延 · 焼鈍パス</span>
                      <span className="lm-log__meta">04:12</span>
                    </li>
                    <li>
                      <span className="lm-log__num">02</span>
                      <span className="lm-log__step" data-lang="en">Brush · 320 grit, vertical</span>
                      <span className="lm-log__step" data-lang="ko" hidden>브러시 · 320 그릿, 수직</span>
                      <span className="lm-log__step" data-lang="ja" hidden>ブラッシュ · 320番、垂直</span>
                      <span className="lm-log__meta">04:48</span>
                    </li>
                    <li className="is-now">
                      <span className="lm-log__num">03</span>
                      <span className="lm-log__step" data-lang="en">Polish · cerium oxide, 4-stage</span>
                      <span className="lm-log__step" data-lang="ko" hidden>폴리싱 · 산화세륨, 4단계</span>
                      <span className="lm-log__step" data-lang="ja" hidden>研磨 · 酸化セリウム、4段階</span>
                      <span className="lm-log__meta">NOW · 05:31</span>
                    </li>
                    <li>
                      <span className="lm-log__num">04</span>
                      <span className="lm-log__step" data-lang="en">Inspect · reflectance ≥ 99.0%</span>
                      <span className="lm-log__step" data-lang="ko" hidden>검사 · 반사율 ≥ 99.0%</span>
                      <span className="lm-log__step" data-lang="ja" hidden>検査 · 反射率 ≥ 99.0%</span>
                      <span className="lm-log__meta">— pending</span>
                    </li>
                    <li>
                      <span className="lm-log__num">05</span>
                      <span className="lm-log__step" data-lang="en">Stamp · serial + dispatch</span>
                      <span className="lm-log__step" data-lang="ko" hidden>스탬프 · 시리얼 + 출고</span>
                      <span className="lm-log__step" data-lang="ja" hidden>スタンプ · シリアル + 出荷</span>
                      <span className="lm-log__meta">— pending</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Liquid Metal style — chrome reflections on pure black.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #0c0c0c{"\n"}--text: #f0f0f0{"\n"}--chrome: #c0c0c0{"\n"}--chrome-hi: #ffffff{"\n"}--chrome-lo: #6b6b6b{"\n"}--border: rgba(192, 192, 192, 0.15){"\n"}No other colors.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Heading: "Sora" sans-serif, 800 weight, tracking -0.04em, uppercase{"\n"}Body: "Noto Sans" / "Sora" sans-serif, 400 / 500 weight{"\n"}Scale: 14 / 16 / 17 / 35 / 83px (clamp(2.2rem, 6vw, 5.2rem)){"\n"}Body line-height: 1.8{"\n"}Heading line-height: 0.95{"\n"}Title uses multi-stop gradient text: linear-gradient(180deg, #ffffff 0%, #e0e0e0 20%, #9e9e9e 45%, #c0c0c0 55%, #ffffff 70%, #a0a0a0 100%), background-size 100% 200%, background-clip text.{"\n"}{"\n"}UI:{"\n"}- Hero card: 1px solid var(--border), border-radius 28px, background linear-gradient(165deg, rgba(40,40,40,0.7) 0%, rgba(12,12,12,0.9) 100%), overflow hidden{"\n"}- Tiles: 1px solid var(--border), border-radius 16px, background linear-gradient(145deg, rgba(60,60,60,0.3), rgba(20,20,20,0.6)), 1px top highlight line via ::after (linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)){"\n"}- Tile hover: border-color rgba(192, 192, 192, 0.35){"\n"}- Prompt section: background rgba(20, 20, 20, 0.9), border-radius 20px{"\n"}- Buttons: border 1px solid var(--chrome-lo), border-radius 999px, background linear-gradient(145deg, rgba(60,60,60,0.3), rgba(30,30,30,0.5)), hover adds box-shadow 0 0 20px rgba(192,192,192,0.1){"\n"}{"\n"}LAYOUT:{"\n"}- Container: min(1120px, 92vw) centered, padding 28px 0 80px{"\n"}- Hero padding: clamp(24px, 5vw, 52px){"\n"}- Feature grid: repeat(auto-fit, minmax(200px, 1fr)), gap 12px{"\n"}- Lead paragraph max-width: 700px{"\n"}{"\n"}MOTION:{"\n"}- Light sweep: hero::before pseudo-element, diagonal 105deg gradient band (transparent → rgba(255,255,255,0.08) → transparent), rotate(-15deg), animation translateX(-30%) to translateX(30%) over 8s ease-in-out infinite{"\n"}- Chrome text shift: background-position 0% 0% to 0% 100%, 4s ease-in-out infinite alternate{"\n"}- Tile entrance: translateY(14px) to 0, opacity 0 to 1, 0.7s ease, stagger 0.08s per tile{"\n"}- Button hover: all 0.25s ease{"\n"}{"\n"}RESPONSIVE:{"\n"}- Below 768px: single column tiles, sweep animation disabled (animation: none), chrome title simplified to solid color, hero padding 24px{"\n"}- Above 768px: auto-fit grid 2–4 columns, container 92vw{"\n"}{"\n"}FORBIDDEN:{"\n"}- No color accents — monochrome silver/charcoal only{"\n"}- No flat matte surfaces — every panel must have subtle gradient or inset highlight{"\n"}- No border-radius above 28px{"\n"}- No text-shadow — chrome effect via gradient-clip only{"\n"}- No images or external assets{"\n"}{"\n"}OUTPUT:{"\n"}1. Single HTML file with inline CSS{"\n"}2. Chrome gradient text with animated background-position shift{"\n"}3. Light sweep animation using ::before pseudo-element{"\n"}4. Hero + feature tile grid with top-highlight lines{"\n"}5. Color token custom properties in :root{"\n"}6. Responsive layout using clamp() and auto-fit grid</pre>
            <pre data-lang="ko" hidden>Liquid Metal 스타일의 랜딩 페이지를 디자인해줘 — 순수 블랙 위의 크롬 반사.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #0c0c0c{"\n"}--text: #f0f0f0{"\n"}--chrome: #c0c0c0{"\n"}--chrome-hi: #ffffff{"\n"}--chrome-lo: #6b6b6b{"\n"}--border: rgba(192, 192, 192, 0.15){"\n"}다른 색상 사용 금지.{"\n"}{"\n"}타이포그래피:{"\n"}제목: "Sora" sans-serif, 800 weight, tracking -0.04em, uppercase{"\n"}본문: "Noto Sans" / "Sora" sans-serif, 400 / 500 weight{"\n"}스케일: 14 / 16 / 17 / 35 / 83px (clamp(2.2rem, 6vw, 5.2rem)){"\n"}본문 line-height: 1.8{"\n"}제목 line-height: 0.95{"\n"}제목에 다단 그라데이션 텍스트 적용: linear-gradient(180deg, #ffffff 0%, #e0e0e0 20%, #9e9e9e 45%, #c0c0c0 55%, #ffffff 70%, #a0a0a0 100%), background-size 100% 200%, background-clip text.{"\n"}{"\n"}UI:{"\n"}- 히어로 카드: 1px solid var(--border), border-radius 28px, background linear-gradient(165deg, rgba(40,40,40,0.7) 0%, rgba(12,12,12,0.9) 100%), overflow hidden{"\n"}- 타일: 1px solid var(--border), border-radius 16px, background linear-gradient(145deg, rgba(60,60,60,0.3), rgba(20,20,20,0.6)), ::after로 상단 1px 하이라이트 (linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)){"\n"}- 타일 hover: border-color rgba(192, 192, 192, 0.35){"\n"}- 프롬프트 섹션: background rgba(20, 20, 20, 0.9), border-radius 20px{"\n"}- 버튼: border 1px solid var(--chrome-lo), border-radius 999px, background linear-gradient(145deg, rgba(60,60,60,0.3), rgba(30,30,30,0.5)), hover시 box-shadow 0 0 20px rgba(192,192,192,0.1){"\n"}{"\n"}레이아웃:{"\n"}- 컨테이너: min(1120px, 92vw) 중앙정렬, padding 28px 0 80px{"\n"}- 히어로 padding: clamp(24px, 5vw, 52px){"\n"}- 피처 그리드: repeat(auto-fit, minmax(200px, 1fr)), gap 12px{"\n"}- 리드 문단 max-width: 700px{"\n"}{"\n"}모션:{"\n"}- 빛 sweep: hero::before 가상요소, 105deg 대각선 그라데이션 밴드 (transparent → rgba(255,255,255,0.08) → transparent), rotate(-15deg), translateX(-30%)→translateX(30%) 8s ease-in-out infinite{"\n"}- 크롬 텍스트 shift: background-position 0% 0% → 0% 100%, 4s ease-in-out infinite alternate{"\n"}- 타일 등장: translateY(14px)→0, opacity 0→1, 0.7s ease, 타일당 0.08s 순차 지연{"\n"}- 버튼 hover: all 0.25s ease{"\n"}{"\n"}반응형:{"\n"}- 768px 미만: 단일 열 타일, sweep 애니메이션 비활성(animation: none), 크롬 제목 단색 처리, 히어로 padding 24px{"\n"}- 768px 이상: auto-fit 그리드 2~4열, 컨테이너 92vw{"\n"}{"\n"}금지사항:{"\n"}- 컬러 포인트 금지 — 모노크롬 실버/차콜만 허용{"\n"}- 평면 매트 표면 금지 — 모든 패널에 미세 그라데이션 또는 인셋 하이라이트 필수{"\n"}- 28px 초과 border-radius 금지{"\n"}- text-shadow 금지 — 크롬 효과는 gradient-clip으로만{"\n"}- 이미지나 외부 에셋 금지{"\n"}{"\n"}출력:{"\n"}1. 인라인 CSS가 포함된 단일 HTML 파일{"\n"}2. background-position 애니메이션이 적용된 크롬 그라데이션 텍스트{"\n"}3. ::before 가상요소를 활용한 빛 sweep 애니메이션{"\n"}4. 상단 하이라이트 라인이 있는 히어로 + 피처 타일 그리드{"\n"}5. :root에 색상 토큰 커스텀 프로퍼티{"\n"}6. clamp()와 auto-fit 그리드를 활용한 반응형 레이아웃</pre>
            <pre data-lang="ja" hidden>Liquid Metalスタイルのランディングページをデザインしてください — ピュアブラック上のクローム反射。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #0c0c0c{"\n"}--text: #f0f0f0{"\n"}--chrome: #c0c0c0{"\n"}--chrome-hi: #ffffff{"\n"}--chrome-lo: #6b6b6b{"\n"}--border: rgba(192, 192, 192, 0.15){"\n"}他の色は使用禁止。{"\n"}{"\n"}タイポグラフィ:{"\n"}見出し: "Sora" sans-serif, 800 weight, tracking -0.04em, uppercase{"\n"}本文: "Noto Sans" / "Sora" sans-serif, 400 / 500 weight{"\n"}スケール: 14 / 16 / 17 / 35 / 83px (clamp(2.2rem, 6vw, 5.2rem)){"\n"}本文 line-height: 1.8{"\n"}見出し line-height: 0.95{"\n"}タイトルに多段グラデーションテキスト適用: linear-gradient(180deg, #ffffff 0%, #e0e0e0 20%, #9e9e9e 45%, #c0c0c0 55%, #ffffff 70%, #a0a0a0 100%), background-size 100% 200%, background-clip text。{"\n"}{"\n"}UI:{"\n"}- ヒーローカード: 1px solid var(--border), border-radius 28px, background linear-gradient(165deg, rgba(40,40,40,0.7) 0%, rgba(12,12,12,0.9) 100%), overflow hidden{"\n"}- タイル: 1px solid var(--border), border-radius 16px, background linear-gradient(145deg, rgba(60,60,60,0.3), rgba(20,20,20,0.6)), ::afterで上部1pxハイライトライン (linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)){"\n"}- タイルhover: border-color rgba(192, 192, 192, 0.35){"\n"}- プロンプトセクション: background rgba(20, 20, 20, 0.9), border-radius 20px{"\n"}- ボタン: border 1px solid var(--chrome-lo), border-radius 999px, background linear-gradient(145deg, rgba(60,60,60,0.3), rgba(30,30,30,0.5)), hover時 box-shadow 0 0 20px rgba(192,192,192,0.1){"\n"}{"\n"}レイアウト:{"\n"}- コンテナ: min(1120px, 92vw) 中央揃え, padding 28px 0 80px{"\n"}- ヒーロー padding: clamp(24px, 5vw, 52px){"\n"}- フィーチャーグリッド: repeat(auto-fit, minmax(200px, 1fr)), gap 12px{"\n"}- リード段落 max-width: 700px{"\n"}{"\n"}モーション:{"\n"}- ライトsweep: hero::before擬似要素, 105deg対角線グラデーションバンド（transparent → rgba(255,255,255,0.08) → transparent）, rotate(-15deg), translateX(-30%)→translateX(30%) 8s ease-in-out infinite{"\n"}- クロームテキストshift: background-position 0% 0% → 0% 100%, 4s ease-in-out infinite alternate{"\n"}- タイル登場: translateY(14px)→0, opacity 0→1, 0.7s ease, タイルごとに0.08s順次遅延{"\n"}- ボタンhover: all 0.25s ease{"\n"}{"\n"}レスポンシブ:{"\n"}- 768px未満: 単一列タイル, sweepアニメーション無効（animation: none）, クロームタイトル単色処理, ヒーローpadding 24px{"\n"}- 768px以上: auto-fitグリッド2〜4列, コンテナ92vw{"\n"}{"\n"}禁止事項:{"\n"}- カラーアクセント禁止 — モノクロームシルバー/チャコールのみ{"\n"}- フラットマット表面禁止 — 全パネルに微細グラデーションまたはインセットハイライト必須{"\n"}- 28px超のborder-radius禁止{"\n"}- text-shadow禁止 — クローム効果はgradient-clipのみ{"\n"}- 画像や外部アセット禁止{"\n"}{"\n"}出力:{"\n"}1. インラインCSS付きの単一HTMLファイル{"\n"}2. background-positionアニメーション付きクロームグラデーションテキスト{"\n"}3. ::before擬似要素を活用したライトsweepアニメーション{"\n"}4. 上部ハイライトライン付きヒーロー + フィーチャータイルグリッド{"\n"}5. :rootにカラートークンカスタムプロパティ{"\n"}6. clamp()とauto-fitグリッドを活用したレスポンシブレイアウト</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/earth-atelier.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Earth Atelier</span></a><div className="page-nav__divider" /><a href="/pages/aurora-gradient.html"><span><span className="page-nav__label">다음</span>Aurora Gradient</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
