import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedPaperCutPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--paper-cut">
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
          {/* ═══ Paper Hero Title ═══ */}
          <section className="paper-hero">
            <div className="paper-hero__title">
              <span className="paper-hero__letter" data-lang="en">Paper</span>
              <span className="paper-hero__letter" data-lang="en">Cut</span>
              <span className="paper-hero__letter" data-lang="en">Layered</span>
              <span className="paper-hero__letter" data-lang="en">Design</span>
              <span className="paper-hero__letter" data-lang="ko" hidden>페이퍼</span>
              <span className="paper-hero__letter" data-lang="ko" hidden>컷</span>
              <span className="paper-hero__letter" data-lang="ko" hidden>레이어드</span>
              <span className="paper-hero__letter" data-lang="ko" hidden>디자인</span>
              <span className="paper-hero__letter" data-lang="ja" hidden>ペーパー</span>
              <span className="paper-hero__letter" data-lang="ja" hidden>カット</span>
              <span className="paper-hero__letter" data-lang="ja" hidden>レイヤード</span>
              <span className="paper-hero__letter" data-lang="ja" hidden>デザイン</span>
            </div>
            <p className="paper-hero__subtitle" data-lang="en">
              Layers of cut paper stacked with shadows creating depth. Like a popup book or paper collage art —
              each layer casts a real shadow on the layer below. Flat matte colors, no gradients within shapes.
            </p>
            <p className="paper-hero__subtitle" data-lang="ko" hidden>
              잘라낸 종이 레이어를 그림자와 함께 쌓아 깊이감을 만듭니다. 팝업 북이나 종이 콜라주 아트처럼 —
              각 레이어가 아래 레이어에 실제 그림자를 드리웁니다. 플랫 매트 컬러, 형태 내 그라데이션 없음.
            </p>
            <p className="paper-hero__subtitle" data-lang="ja" hidden>
              切り紙のレイヤーを影と共に重ねて奥行きを生み出します。ポップアップブックや紙のコラージュアートのように —
              各レイヤーが下のレイヤーに実際の影を落とします。フラットマットカラー、形状内のグラデーションなし。
            </p>
          </section>
          {/* ═══ Stacked Paper Layers ═══ */}
          <section className="demo-section">
            <div className="section-label">
              <span data-lang="en">Stacked Paper Layers — Hover to Separate</span>
              <span data-lang="ko" hidden>겹쳐진 종이 레이어 — 마우스를 올려 분리</span>
              <span data-lang="ja" hidden>重ねた紙のレイヤー — ホバーで分離</span>
            </div>
            <div className="stacked-layers">
              <div className="stacked-layer">
                <span data-lang="en">Layer 5 · Bottom</span>
                <span data-lang="ko" hidden>레이어 5 · 하단</span>
                <span data-lang="ja" hidden>レイヤー5 · 最下層</span>
              </div>
              <div className="stacked-layer">
                <span data-lang="en">Layer 4</span>
                <span data-lang="ko" hidden>레이어 4</span>
                <span data-lang="ja" hidden>レイヤー4</span>
              </div>
              <div className="stacked-layer">
                <span data-lang="en">Layer 3</span>
                <span data-lang="ko" hidden>레이어 3</span>
                <span data-lang="ja" hidden>レイヤー3</span>
              </div>
              <div className="stacked-layer">
                <span data-lang="en">Layer 2</span>
                <span data-lang="ko" hidden>레이어 2</span>
                <span data-lang="ja" hidden>レイヤー2</span>
              </div>
              <div className="stacked-layer">
                <span data-lang="en">Layer 1 · Top</span>
                <span data-lang="ko" hidden>레이어 1 · 상단</span>
                <span data-lang="ja" hidden>レイヤー1 · 최상단</span>
              </div>
            </div>
          </section>
          {/* ═══ Mountain Landscape Scene ═══ */}
          <section className="demo-section">
            <div className="section-label">
              <span data-lang="en">Paper Cut Landscape — Layered Depth Scene</span>
              <span data-lang="ko" hidden>페이퍼 컷 풍경 — 레이어드 깊이 장면</span>
              <span data-lang="ja" hidden>ペーパーカット風景 — レイヤード奥行きシーン</span>
            </div>
            <div className="landscape">
              <div className="landscape__sun" />
              <div className="landscape__cloud"><span /></div>
              <div className="mountain--bg" />
              <div className="mountain--mid" />
              <div className="mountain--fg" />
              <div className="tree" />
              <div className="tree" />
              <div className="tree" />
              <div className="tree" />
              <div className="landscape__label">
                <span data-lang="en">3 Depth Layers + Foreground Elements</span>
                <span data-lang="ko" hidden>3단계 깊이 레이어 + 전경 요소</span>
                <span data-lang="ja" hidden>3段階の深度レイヤー + 前景要素</span>
              </div>
            </div>
          </section>
          {/* ═══ Pop-Up Paper Cards ═══ */}
          <section className="demo-section">
            <div className="section-label">
              <span data-lang="en">Pop-Up Cards — Hover to Lift</span>
              <span data-lang="ko" hidden>팝업 카드 — 마우스를 올려 들어올리기</span>
              <span data-lang="ja" hidden>ポップアップカード — ホバーで持ち上げる</span>
            </div>
            <div className="popup-cards">
              <article className="popup-card">
                <div className="popup-card__icon">Aa</div>
                <div className="popup-card__title">
                  <span data-lang="en">Flat Colors Only</span>
                  <span data-lang="ko" hidden>플랫 컬러만 사용</span>
                  <span data-lang="ja" hidden>フラットカラーのみ</span>
                </div>
                <div className="popup-card__desc">
                  <span data-lang="en">No gradients within shapes. Each paper layer is a single solid color, just like real craft paper.</span>
                  <span data-lang="ko" hidden>형태 내에 그라데이션 없음. 각 종이 레이어는 실제 공예 종이처럼 단일 솔리드 컬러입니다.</span>
                  <span data-lang="ja" hidden>形状内のグラデーションなし。各紙レイヤーは実際のクラフト紙のように単一のソリッドカラーです。</span>
                </div>
              </article>
              <article className="popup-card">
                <div className="popup-card__icon">||</div>
                <div className="popup-card__title">
                  <span data-lang="en">Shadow = Depth</span>
                  <span data-lang="ko" hidden>그림자 = 깊이</span>
                  <span data-lang="ja" hidden>影 = 深さ</span>
                </div>
                <div className="popup-card__desc">
                  <span data-lang="en">Depth comes only from box-shadows. Each layer casts a hard-edged shadow on the layer below.</span>
                  <span data-lang="ko" hidden>깊이는 box-shadow에서만 나옵니다. 각 레이어가 아래 레이어에 날카로운 그림자를 드리웁니다.</span>
                  <span data-lang="ja" hidden>深さはbox-shadowのみで表現。各レイヤーが下のレイヤーに鮮明な影を落とします。</span>
                </div>
              </article>
              <article className="popup-card">
                <div className="popup-card__icon">&lt;/&gt;</div>
                <div className="popup-card__title">
                  <span data-lang="en">Rough Edges</span>
                  <span data-lang="ko" hidden>거친 가장자리</span>
                  <span data-lang="ja" hidden>粗いエッジ</span>
                </div>
                <div className="popup-card__desc">
                  <span data-lang="en">Torn paper edges created with CSS clip-path using irregular polygon points for authentic craft feel.</span>
                  <span data-lang="ko" hidden>불규칙한 폴리곤 포인트를 사용한 CSS clip-path로 찢어진 종이 가장자리를 만들어 진정한 공예 느낌을 줍니다.</span>
                  <span data-lang="ja" hidden>不規則なポリゴンポイントを使用したCSS clip-pathで引き裂かれた紙のエッジを作成し、本格的なクラフト感を表現します。</span>
                </div>
              </article>
            </div>
          </section>
          <div className="fold-divider" />
          {/* ═══ Layer Anatomy ═══ */}
          <section className="demo-section">
            <div className="section-label">
              <span data-lang="en">Layer Anatomy — 5 Depth Levels with Shadow &amp; Z-Index</span>
              <span data-lang="ko" hidden>레이어 해부도 — 그림자 &amp; Z-Index가 있는 5단계 깊이</span>
              <span data-lang="ja" hidden>レイヤー解剖図 — 影とZ-Indexによる5段階の深さ</span>
            </div>
            <div className="layer-anatomy">
              <div className="anatomy-layer">
                <span>
                  <span data-lang="en">Layer 1 — White Paper</span>
                  <span data-lang="ko" hidden>레이어 1 — 흰 종이</span>
                  <span data-lang="ja" hidden>レイヤー1 — 白い紙</span>
                </span>
                <span className="anatomy-layer__meta">z-index: 5 · shadow: 4px</span>
              </div>
              <div className="anatomy-layer">
                <span>
                  <span data-lang="en">Layer 2 — Peach Paper</span>
                  <span data-lang="ko" hidden>레이어 2 — 피치 종이</span>
                  <span data-lang="ja" hidden>レイヤー2 — ピーチペーパー</span>
                </span>
                <span className="anatomy-layer__meta">z-index: 4 · shadow: 5px</span>
              </div>
              <div className="anatomy-layer">
                <span>
                  <span data-lang="en">Layer 3 — Sage Green</span>
                  <span data-lang="ko" hidden>레이어 3 — 세이지 그린</span>
                  <span data-lang="ja" hidden>レイヤー3 — セージグリーン</span>
                </span>
                <span className="anatomy-layer__meta">z-index: 3 · shadow: 6px</span>
              </div>
              <div className="anatomy-layer">
                <span>
                  <span data-lang="en">Layer 4 — Dusty Blue</span>
                  <span data-lang="ko" hidden>레이어 4 — 더스티 블루</span>
                  <span data-lang="ja" hidden>レイヤー4 — ダスティブルー</span>
                </span>
                <span className="anatomy-layer__meta">z-index: 2 · shadow: 7px</span>
              </div>
              <div className="anatomy-layer">
                <span>
                  <span data-lang="en">Layer 5 — Poppy Red</span>
                  <span data-lang="ko" hidden>레이어 5 — 파피 레드</span>
                  <span data-lang="ja" hidden>レイヤー5 — ポピーレッド</span>
                </span>
                <span className="anatomy-layer__meta">z-index: 1 · shadow: 8px</span>
              </div>
            </div>
          </section>
          {/* ═══ Torn Paper Edge ═══ */}
          <section className="demo-section torn-paper">
            <div className="section-label">
              <span data-lang="en">Torn Paper Edge — CSS clip-path Irregular Polygon</span>
              <span data-lang="ko" hidden>찢어진 종이 가장자리 — CSS clip-path 불규칙 폴리곤</span>
              <span data-lang="ja" hidden>引き裂かれた紙のエッジ — CSS clip-path 不規則ポリゴン</span>
            </div>
            <div className="torn-paper__top">
              <div className="torn-paper__title">
                <span data-lang="en">Torn Edge Effect</span>
                <span data-lang="ko" hidden>찢어진 가장자리 효과</span>
                <span data-lang="ja" hidden>引き裂きエッジ効果</span>
              </div>
              <div className="torn-paper__text" style={{color: 'rgba(45,42,38,0.65)'}}>
                <span data-lang="en">Created using CSS clip-path with dozens of irregular polygon points. The bottom edge of this white paper and the top edge of the green paper below mirror each other to create the illusion of a tear.</span>
                <span data-lang="ko" hidden>수십 개의 불규칙한 폴리곤 포인트가 있는 CSS clip-path를 사용하여 생성됩니다. 이 흰 종이의 하단 가장자리와 아래 녹색 종이의 상단 가장자리가 서로 거울처럼 맞물려 찢어진 듯한 환상을 만듭니다.</span>
                <span data-lang="ja" hidden>数十の不規則なポリゴンポイントを持つCSS clip-pathで作成されます。この白い紙の下端と下の緑の紙の上端が互いに鏡像となり、引き裂かれた錯覚を作り出します。</span>
              </div>
            </div>
            <div className="torn-paper__bottom">
              <div className="torn-paper__title">
                <span data-lang="en">Matching Tear Below</span>
                <span data-lang="ko" hidden>아래쪽 맞물리는 찢김</span>
                <span data-lang="ja" hidden>下側の一致する引き裂き</span>
              </div>
              <div className="torn-paper__text">
                <span data-lang="en">The complementary edge creates a seamless torn paper illusion between two different colored paper layers.</span>
                <span data-lang="ko" hidden>보완적인 가장자리가 두 가지 다른 색의 종이 레이어 사이에 매끈한 찢어진 종이 환상을 만듭니다.</span>
                <span data-lang="ja" hidden>補完的なエッジが、2つの異なる色の紙レイヤー間にシームレスな引き裂かれた紙の錯覚を生み出します。</span>
              </div>
            </div>
          </section>
          <div className="fold-divider" />
          {/* ═══ Color Palette Swatches ═══ */}
          <section className="demo-section">
            <div className="section-label">
              <span data-lang="en">Paper Color Palette — Flat Swatches with Curled Corner</span>
              <span data-lang="ko" hidden>종이 컬러 팔레트 — 컬링된 모서리가 있는 플랫 스와치</span>
              <span data-lang="ja" hidden>ペーパーカラーパレット — カール角のあるフラットスウォッチ</span>
            </div>
            <div className="palette-grid">
              <div className="palette-swatch">
                <div className="palette-swatch__color" style={{background: 'var(--layer-1)'}} />
                <div className="palette-swatch__info">
                  <div className="palette-swatch__name">
                    <span data-lang="en">White Paper</span>
                    <span data-lang="ko" hidden>흰 종이</span>
                    <span data-lang="ja" hidden>白い紙</span>
                  </div>
                  <div className="palette-swatch__hex">#ffffff</div>
                </div>
              </div>
              <div className="palette-swatch">
                <div className="palette-swatch__color" style={{background: 'var(--layer-2)'}} />
                <div className="palette-swatch__info">
                  <div className="palette-swatch__name">
                    <span data-lang="en">Peach Paper</span>
                    <span data-lang="ko" hidden>피치 종이</span>
                    <span data-lang="ja" hidden>ピーチペーパー</span>
                  </div>
                  <div className="palette-swatch__hex">#f0c4a8</div>
                </div>
              </div>
              <div className="palette-swatch">
                <div className="palette-swatch__color" style={{background: 'var(--layer-3)'}} />
                <div className="palette-swatch__info">
                  <div className="palette-swatch__name">
                    <span data-lang="en">Sage Green</span>
                    <span data-lang="ko" hidden>세이지 그린</span>
                    <span data-lang="ja" hidden>セージグリーン</span>
                  </div>
                  <div className="palette-swatch__hex">#7eb8a0</div>
                </div>
              </div>
              <div className="palette-swatch">
                <div className="palette-swatch__color" style={{background: 'var(--layer-4)'}} />
                <div className="palette-swatch__info">
                  <div className="palette-swatch__name">
                    <span data-lang="en">Dusty Blue</span>
                    <span data-lang="ko" hidden>더스티 블루</span>
                    <span data-lang="ja" hidden>ダスティブルー</span>
                  </div>
                  <div className="palette-swatch__hex">#5b7fa4</div>
                </div>
              </div>
              <div className="palette-swatch">
                <div className="palette-swatch__color" style={{background: 'var(--layer-5)'}} />
                <div className="palette-swatch__info">
                  <div className="palette-swatch__name">
                    <span data-lang="en">Poppy Red</span>
                    <span data-lang="ko" hidden>파피 레드</span>
                    <span data-lang="ja" hidden>ポピーレッド</span>
                  </div>
                  <div className="palette-swatch__hex">#e85d4a</div>
                </div>
              </div>
              <div className="palette-swatch">
                <div className="palette-swatch__color" style={{background: 'var(--bg)'}} />
                <div className="palette-swatch__info">
                  <div className="palette-swatch__name">
                    <span data-lang="en">Craft Paper BG</span>
                    <span data-lang="ko" hidden>크래프트 종이 배경</span>
                    <span data-lang="ja" hidden>クラフト紙背景</span>
                  </div>
                  <div className="palette-swatch__hex">#e8e0d4</div>
                </div>
              </div>
            </div>
          </section>
          {/* ═══ Design Principle Tab Cards ═══ */}
          <section className="demo-section">
            <div className="section-label">
              <span data-lang="en">Design Principles — Manila Folder Tabs</span>
              <span data-lang="ko" hidden>디자인 원칙 — 마닐라 폴더 탭</span>
              <span data-lang="ja" hidden>デザイン原則 — マニラフォルダータブ</span>
            </div>
            <div className="tab-cards">
              <article className="tab-card">
                <div className="tab-card__tab">
                  <span data-lang="en">Depth</span>
                  <span data-lang="ko" hidden>깊이</span>
                  <span data-lang="ja" hidden>深さ</span>
                </div>
                <div className="tab-card__title">
                  <span data-lang="en">Shadow Stacking</span>
                  <span data-lang="ko" hidden>그림자 스태킹</span>
                  <span data-lang="ja" hidden>シャドウスタッキング</span>
                </div>
                <div className="tab-card__desc">
                  <span data-lang="en">Each layer gets a hard-edged box-shadow (4-8px offset, no blur). Higher layers get larger shadows for realistic parallax depth.</span>
                  <span data-lang="ko" hidden>각 레이어에 날카로운 box-shadow(4-8px 오프셋, 블러 없음)를 적용합니다. 높은 레이어일수록 더 큰 그림자로 실감나는 시차 깊이감을 줍니다.</span>
                  <span data-lang="ja" hidden>各レイヤーにシャープなbox-shadow（4-8pxオフセット、ブラーなし）を適用。高いレイヤーほど大きな影でリアルな視差の深さを表現します。</span>
                </div>
              </article>
              <article className="tab-card">
                <div className="tab-card__tab">
                  <span data-lang="en">Color</span>
                  <span data-lang="ko" hidden>색상</span>
                  <span data-lang="ja" hidden>カラー</span>
                </div>
                <div className="tab-card__title">
                  <span data-lang="en">Matte &amp; Flat</span>
                  <span data-lang="ko" hidden>매트 &amp; 플랫</span>
                  <span data-lang="ja" hidden>マット＆フラット</span>
                </div>
                <div className="tab-card__desc">
                  <span data-lang="en">Colors are solid and flat like real craft paper. No gradients within shapes. Depth is expressed through shadow, never through color transitions.</span>
                  <span data-lang="ko" hidden>실제 공예 종이처럼 색상은 솔리드하고 플랫합니다. 형태 내 그라데이션 없음. 깊이는 그림자를 통해 표현되며, 색상 전환으로는 절대 표현하지 않습니다.</span>
                  <span data-lang="ja" hidden>実際のクラフト紙のように色はソリッドでフラット。形状内のグラデーションなし。深さは影で表現し、色の遷移では決して表現しません。</span>
                </div>
              </article>
              <article className="tab-card">
                <div className="tab-card__tab">
                  <span data-lang="en">Edge</span>
                  <span data-lang="ko" hidden>엣지</span>
                  <span data-lang="ja" hidden>エッジ</span>
                </div>
                <div className="tab-card__title">
                  <span data-lang="en">Cut &amp; Torn</span>
                  <span data-lang="ko" hidden>자르기 &amp; 찢기</span>
                  <span data-lang="ja" hidden>カット＆テア</span>
                </div>
                <div className="tab-card__desc">
                  <span data-lang="en">Use CSS clip-path with irregular polygon points for torn edges. Clean cuts use simple border-radius. Mix both for variety.</span>
                  <span data-lang="ko" hidden>불규칙한 폴리곤 포인트가 있는 CSS clip-path로 찢어진 가장자리를 만듭니다. 깔끔한 절단은 단순한 border-radius를 사용합니다. 둘 다 섞어 다양성을 줍니다.</span>
                  <span data-lang="ja" hidden>不規則なポリゴンポイントを持つCSS clip-pathで引き裂かれたエッジを作成。きれいなカットにはシンプルなborder-radiusを使用。両方を混ぜて多様性を出します。</span>
                </div>
              </article>
              <article className="tab-card">
                <div className="tab-card__tab">
                  <span data-lang="en">Motion</span>
                  <span data-lang="ko" hidden>모션</span>
                  <span data-lang="ja" hidden>モーション</span>
                </div>
                <div className="tab-card__title">
                  <span data-lang="en">Lift &amp; Float</span>
                  <span data-lang="ko" hidden>들기 &amp; 뜨기</span>
                  <span data-lang="ja" hidden>リフト＆フロート</span>
                </div>
                <div className="tab-card__desc">
                  <span data-lang="en">On hover, cards lift with translateY and cast larger shadows. This mimics picking up a piece of paper from a desk surface.</span>
                  <span data-lang="ko" hidden>호버 시 카드가 translateY로 들리고 더 큰 그림자를 드리웁니다. 책상 위에서 종이를 집어 드는 것을 모방합니다.</span>
                  <span data-lang="ja" hidden>ホバー時にカードがtranslateYで持ち上がり、より大きな影を落とします。机の上から紙を拾い上げる動作を模倣します。</span>
                </div>
              </article>
            </div>
          </section>
          <div className="fold-divider" />
          {/* ═══ Origami Bird ═══ */}
          <section className="demo-section">
            <div className="section-label">
              <span data-lang="en">CSS Origami Bird — Built from Triangles</span>
              <span data-lang="ko" hidden>CSS 종이접기 새 — 삼각형으로 구성</span>
              <span data-lang="ja" hidden>CSS折り紙の鳥 — 三角形で構成</span>
            </div>
            <div className="origami-wrap">
              <div>
                <div className="origami-bird">
                  <div className="origami-bird__wing-l" />
                  <div className="origami-bird__wing-r" />
                  <div className="origami-bird__body" />
                  <div className="origami-bird__tail" />
                  <div className="origami-bird__head" />
                </div>
                <div className="origami-label">
                  <span data-lang="en">CSS border triangles + drop-shadow filter</span>
                  <span data-lang="ko" hidden>CSS 보더 삼각형 + drop-shadow 필터</span>
                  <span data-lang="ja" hidden>CSS border三角形 + drop-shadowフィルター</span>
                </div>
              </div>
            </div>
          </section>
          {/* ═══ Prompt Section ═══ */}
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Paper Cut / Layered style — mimicking paper craft with stacked layers and hard-edged shadows.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #e8e0d4 (warm craft paper background){"\n"}--layer-1: #ffffff (top white paper){"\n"}--layer-2: #f0c4a8 (peach/salmon paper){"\n"}--layer-3: #7eb8a0 (sage green paper){"\n"}--layer-4: #5b7fa4 (dusty blue paper){"\n"}--layer-5: #e85d4a (poppy red paper){"\n"}--text: #2d2a26 (dark brown ink){"\n"}--shadow: rgba(0,0,0,0.15) (layer shadow){"\n"}No other colors. All shape fills are flat/solid — no gradients within shapes.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Display: "Outfit" sans-serif, 700-900 weight, tracking -0.02em{"\n"}Body: "Nunito" sans-serif, 400-600 weight{"\n"}Scale: clamp(2.4rem, 7vw, 5.5rem) for hero, 1.1-1.3rem for cards{"\n"}Body line-height: 1.7-1.8{"\n"}Display line-height: 1.05{"\n"}{"\n"}UI:{"\n"}- Cards: solid flat backgrounds (no gradients), border-radius 14-18px{"\n"}- Hard-edged box-shadow: 4-8px offset, 0 blur, rgba(0,0,0,0.15){"\n"}- Torn paper edges: CSS clip-path with irregular polygon points (20+ points for realistic tear){"\n"}- Curled corner on swatches: small triangle in corner using linear-gradient(135deg){"\n"}- Paper fold creases: subtle 1px linear-gradient lines{"\n"}- Manila folder tabs: absolute-positioned elements above cards with matching colors{"\n"}- Origami shapes built from CSS border triangles with drop-shadow filter{"\n"}{"\n"}LAYOUT:{"\n"}- Container: min(1080px, 92vw) centered{"\n"}- Card grids: repeat(auto-fit, minmax(220px, 1fr)), gap 20px{"\n"}- Layer anatomy: stacked divs with incremental margin-left for cascade effect{"\n"}- Mountain landscape: overlapping clip-path shapes at different z-index levels{"\n"}{"\n"}MOTION:{"\n"}- Card hover: translateY(-6px) + shadow grows from 6px to 12px offset{"\n"}- Stacked layers: spread apart on parent hover with translateX/Y{"\n"}- Card entrance: translateY(16px) to 0, opacity 0 to 1, 0.6s ease, stagger 0.1s{"\n"}- Origami bird wings: gentle flapping with CSS keyframe animation (rotate + translateY){"\n"}- All transitions: 0.3s ease{"\n"}{"\n"}DEPTH TECHNIQUE:{"\n"}- NO blur on shadows — hard-edged only (box-shadow: Xpx Ypx 0 color){"\n"}- Higher layers = larger shadow offset (simulates physical distance from surface){"\n"}- z-index corresponds to visual stacking order{"\n"}- Hover lifts elements by reducing translateY AND increasing shadow offset simultaneously{"\n"}{"\n"}RESPONSIVE:{"\n"}- Below 768px: single column cards, reduced layer offsets, landscape height 220px{"\n"}- Above 768px: auto-fit grids fill 2-3 columns{"\n"}{"\n"}FORBIDDEN:{"\n"}- No gradients within shape fills (flat paper colors only){"\n"}- No blur on box-shadows (hard paper shadow only){"\n"}- No glass/blur effects{"\n"}- No dark mode — this is a light, crafty aesthetic{"\n"}- No rounded/soft shadows — edges must be crisp{"\n"}{"\n"}OUTPUT:{"\n"}1. Single HTML file with inline CSS{"\n"}2. Paper texture using subtle SVG noise in body::after{"\n"}3. CSS custom properties in :root for all paper colors{"\n"}4. Mountain landscape scene using clip-path layers{"\n"}5. Interactive hover states showing paper lift effect{"\n"}6. Origami bird from CSS triangles</pre>
            <pre data-lang="ko" hidden>Paper Cut / Layered 스타일의 랜딩 페이지를 디자인해줘 — 쌓인 레이어와 날카로운 그림자로 종이 공예를 모방.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #e8e0d4 (따뜻한 크래프트 종이 배경){"\n"}--layer-1: #ffffff (최상위 흰 종이){"\n"}--layer-2: #f0c4a8 (피치/살몬 종이){"\n"}--layer-3: #7eb8a0 (세이지 그린 종이){"\n"}--layer-4: #5b7fa4 (더스티 블루 종이){"\n"}--layer-5: #e85d4a (파피 레드 종이){"\n"}--text: #2d2a26 (진한 갈색 잉크){"\n"}--shadow: rgba(0,0,0,0.15) (레이어 그림자){"\n"}다른 색상 사용 금지. 모든 형태 채움은 플랫/솔리드 — 형태 내 그라데이션 없음.{"\n"}{"\n"}타이포그래피:{"\n"}디스플레이: "Outfit" sans-serif, 700-900 weight, tracking -0.02em{"\n"}본문: "Nunito" sans-serif, 400-600 weight{"\n"}스케일: 히어로 clamp(2.4rem, 7vw, 5.5rem), 카드 1.1-1.3rem{"\n"}본문 line-height: 1.7-1.8{"\n"}디스플레이 line-height: 1.05{"\n"}{"\n"}UI:{"\n"}- 카드: 솔리드 플랫 배경(그라데이션 없음), border-radius 14-18px{"\n"}- 날카로운 box-shadow: 4-8px 오프셋, 블러 0, rgba(0,0,0,0.15){"\n"}- 찢어진 종이 가장자리: 불규칙한 폴리곤 포인트(사실적 찢김을 위해 20개 이상)의 CSS clip-path{"\n"}- 스와치의 컬링된 모서리: linear-gradient(135deg)를 사용한 작은 삼각형{"\n"}- 종이 접힌 자국: 미묘한 1px linear-gradient 선{"\n"}- 마닐라 폴더 탭: 매칭 색상의 카드 위 absolute-positioned 요소{"\n"}- CSS 보더 삼각형과 drop-shadow 필터로 만든 종이접기 형태{"\n"}{"\n"}레이아웃:{"\n"}- 컨테이너: min(1080px, 92vw) 중앙정렬{"\n"}- 카드 그리드: repeat(auto-fit, minmax(220px, 1fr)), gap 20px{"\n"}- 레이어 해부도: 캐스케이드 효과를 위한 점진적 margin-left의 쌓인 div{"\n"}- 산 풍경: 다른 z-index 레벨의 겹치는 clip-path 형태{"\n"}{"\n"}모션:{"\n"}- 카드 호버: translateY(-6px) + 그림자 6px에서 12px 오프셋으로 증가{"\n"}- 쌓인 레이어: 부모 호버 시 translateX/Y로 펼침{"\n"}- 카드 등장: translateY(16px)→0, opacity 0→1, 0.6s ease, 0.1s 순차 지연{"\n"}- 종이접기 새 날개: CSS 키프레임 애니메이션(rotate + translateY)으로 부드러운 펄럭임{"\n"}- 모든 전환: 0.3s ease{"\n"}{"\n"}깊이 기법:{"\n"}- 그림자에 블러 없음 — 날카로운 엣지만 (box-shadow: Xpx Ypx 0 color){"\n"}- 높은 레이어 = 더 큰 그림자 오프셋 (표면에서의 물리적 거리 시뮬레이션){"\n"}- z-index는 시각적 쌓임 순서에 대응{"\n"}- 호버 시 translateY 감소 AND 그림자 오프셋 동시 증가{"\n"}{"\n"}반응형:{"\n"}- 768px 미만: 단일 열 카드, 레이어 오프셋 감소, 풍경 높이 220px{"\n"}- 768px 이상: auto-fit 그리드 2-3열 채움{"\n"}{"\n"}금지사항:{"\n"}- 형태 채움에 그라데이션 금지 (플랫 종이 색상만){"\n"}- box-shadow에 블러 금지 (날카로운 종이 그림자만){"\n"}- 유리/블러 효과 금지{"\n"}- 다크 모드 없음 — 밝고 공예적인 에스테틱{"\n"}- 둥글고/부드러운 그림자 없음 — 엣지는 선명해야 함{"\n"}{"\n"}출력:{"\n"}1. 인라인 CSS가 포함된 단일 HTML 파일{"\n"}2. body::after에 미묘한 SVG 노이즈를 사용한 종이 텍스처{"\n"}3. 모든 종이 색상을 위한 :root CSS 커스텀 프로퍼티{"\n"}4. clip-path 레이어를 사용한 산 풍경 장면{"\n"}5. 종이 들어올림 효과를 보여주는 인터랙티브 호버 상태{"\n"}6. CSS 삼각형으로 만든 종이접기 새</pre>
            <pre data-lang="ja" hidden>Paper Cut / Layeredスタイルのランディングページをデザインしてください — 重ねたレイヤーとシャープな影で紙工芸を模倣。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #e8e0d4（温かみのあるクラフト紙の背景）{"\n"}--layer-1: #ffffff（最上層の白い紙）{"\n"}--layer-2: #f0c4a8（ピーチ/サーモンの紙）{"\n"}--layer-3: #7eb8a0（セージグリーンの紙）{"\n"}--layer-4: #5b7fa4（ダスティブルーの紙）{"\n"}--layer-5: #e85d4a（ポピーレッドの紙）{"\n"}--text: #2d2a26（ダークブラウンインク）{"\n"}--shadow: rgba(0,0,0,0.15)（レイヤーシャドウ）{"\n"}他の色は使用禁止。すべての形状の塗りはフラット/ソリッド — 形状内のグラデーションなし。{"\n"}{"\n"}タイポグラフィ:{"\n"}ディスプレイ: "Outfit" sans-serif, 700-900 weight, tracking -0.02em{"\n"}本文: "Nunito" sans-serif, 400-600 weight{"\n"}スケール: ヒーロー clamp(2.4rem, 7vw, 5.5rem)、カード 1.1-1.3rem{"\n"}本文 line-height: 1.7-1.8{"\n"}ディスプレイ line-height: 1.05{"\n"}{"\n"}UI:{"\n"}- カード: ソリッドフラット背景（グラデーションなし）、border-radius 14-18px{"\n"}- シャープなbox-shadow: 4-8pxオフセット、ブラー0、rgba(0,0,0,0.15){"\n"}- 引き裂かれた紙のエッジ: 不規則なポリゴンポイント（リアルな引き裂きのために20以上）のCSS clip-path{"\n"}- スウォッチのカール角: linear-gradient(135deg)を使用した小さな三角形{"\n"}- 紙の折り目: 微妙な1px linear-gradientライン{"\n"}- マニラフォルダータブ: マッチする色のカード上のabsolute-positioned要素{"\n"}- CSS border三角形とdrop-shadowフィルターで作った折り紙の形{"\n"}{"\n"}レイアウト:{"\n"}- コンテナ: min(1080px, 92vw) 中央揃え{"\n"}- カードグリッド: repeat(auto-fit, minmax(220px, 1fr)), gap 20px{"\n"}- レイヤー解剖図: カスケード効果のための段階的margin-leftの積み重ねたdiv{"\n"}- 山の風景: 異なるz-indexレベルの重なるclip-path形状{"\n"}{"\n"}モーション:{"\n"}- カードホバー: translateY(-6px) + 影が6pxから12pxオフセットに増加{"\n"}- 重ねたレイヤー: 親ホバー時にtranslateX/Yで展開{"\n"}- カード登場: translateY(16px)→0, opacity 0→1, 0.6s ease, 0.1s順次遅延{"\n"}- 折り紙の鳥の翼: CSSキーフレームアニメーション（rotate + translateY）で穏やかな羽ばたき{"\n"}- すべてのトランジション: 0.3s ease{"\n"}{"\n"}深さの技法:{"\n"}- 影にブラーなし — シャープエッジのみ（box-shadow: Xpx Ypx 0 color）{"\n"}- 高いレイヤー = より大きな影オフセット（表面からの物理的距離をシミュレート）{"\n"}- z-indexは視覚的な積み重ね順序に対応{"\n"}- ホバーはtranslateYを減少させ、同時に影オフセットを増加{"\n"}{"\n"}レスポンシブ:{"\n"}- 768px未満: 単一列カード、レイヤーオフセット削減、風景の高さ220px{"\n"}- 768px以上: auto-fitグリッド2-3列{"\n"}{"\n"}禁止事項:{"\n"}- 形状の塗りにグラデーション禁止（フラットな紙の色のみ）{"\n"}- box-shadowにブラー禁止（シャープな紙の影のみ）{"\n"}- ガラス/ブラー効果禁止{"\n"}- ダークモードなし — 明るくクラフト的なエステティック{"\n"}- 丸い/柔らかい影なし — エッジはクリスプでなければならない{"\n"}{"\n"}出力:{"\n"}1. インラインCSS付きの単一HTMLファイル{"\n"}2. body::afterに微妙なSVGノイズを使用した紙テクスチャ{"\n"}3. すべての紙の色のための:root CSSカスタムプロパティ{"\n"}4. clip-pathレイヤーを使用した山の風景シーン{"\n"}5. 紙の持ち上げ効果を示すインタラクティブなホバー状態{"\n"}6. CSS三角形で作った折り紙の鳥</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/risograph-print.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Risograph Print</span></a><div className="page-nav__divider" /><a href="/pages/macos-liquid-glass.html"><span><span className="page-nav__label">다음</span>macOS Liquid Glass</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
