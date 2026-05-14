import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedClaymorphismPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--claymorphism">
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
          <section className="hero">
            <div className="hero-copy">
              <span className="hero-eyebrow">UI Style · Soft · Friendly</span>
              <h1>Clay<span className="hero-title-accent">morphism</span></h1>
              <p className="lead" data-lang="en">A friendly UI with a soft, squishy three-dimensional feel like marshmallows or modeling clay. By combining dual shadows, elements appear to float while maintaining a gentle, inflated volume from within.</p>
              <p className="lead" data-lang="ko" hidden>마시멜로나 찰흙처럼 포근하고 푹신한 입체감을 가진 친화형 UI. 더블 그림자를 활용해 요소가 떠오르면서 내부적으로 부풀어오른 부드러운 볼륨감을 줍니다.</p>
              <p className="lead" data-lang="ja" hidden>マシュマロや粘土のように柔らかくふっくらとした立体感を持つ親しみやすいUI。ダブルシャドウを活用し、要素が浮かび上がりながら内側からふくらんだような柔らかなボリューム感を演出します。</p>
              <div className="hero-tags">
                <span className="hero-tag hero-tag--coral">soft</span>
                <span className="hero-tag hero-tag--sky">squishy</span>
                <span className="hero-tag hero-tag--yellow">friendly</span>
                <span className="hero-tag hero-tag--mint">playful</span>
              </div>
            </div>
            <div className="hero-stage" aria-hidden="true">
              <div className="hero-stage__shape hero-stage__shape--blob hero-stage__shape--coral" />
              <div className="hero-stage__shape hero-stage__shape--square hero-stage__shape--sky" />
              <div className="hero-stage__shape hero-stage__shape--pill hero-stage__shape--yellow" />
              <div className="hero-stage__shape hero-stage__shape--triangle hero-stage__shape--mint" />
              <div className="hero-stage__shape hero-stage__shape--ring hero-stage__shape--lilac" />
              <div className="hero-stage__shape hero-stage__shape--dot hero-stage__shape--coral-2" />
              <div className="hero-stage__shape hero-stage__shape--dot hero-stage__shape--sky-2" />
            </div>
          </section>
          <div className="demo">
            {/* Clay Palette */}
            <p className="demo-section-title" data-lang="en">Clay Palette</p>
            <p className="demo-section-title" data-lang="ko" hidden>클레이 팔레트</p>
            <p className="demo-section-title" data-lang="ja" hidden>クレイパレット</p>
            <div className="clay-palette">
              <div><div className="clay-ball clay-ball--coral" /><span className="clay-ball-label">Coral</span></div>
              <div><div className="clay-ball clay-ball--sky" /><span className="clay-ball-label">Sky</span></div>
              <div><div className="clay-ball clay-ball--yellow" /><span className="clay-ball-label">Honey</span></div>
              <div><div className="clay-ball clay-ball--mint" /><span className="clay-ball-label">Mint</span></div>
              <div><div className="clay-ball clay-ball--lilac" /><span className="clay-ball-label">Lilac</span></div>
            </div>
            {/* Button Specimens */}
            <p className="demo-section-title" data-lang="en">Button Specimens</p>
            <p className="demo-section-title" data-lang="ko" hidden>버튼 표본</p>
            <p className="demo-section-title" data-lang="ja" hidden>ボタン標本</p>
            <div className="clay-btn-row">
              <button className="clay-btn-specimen clay-btn--sm clay-btn--coral">Small</button>
              <button className="clay-btn-specimen clay-btn--md clay-btn--sky">Medium</button>
              <button className="clay-btn-specimen clay-btn--lg clay-btn--yellow">Large</button>
              <button className="clay-btn-specimen clay-btn--md clay-btn--mint">Mint</button>
              <button className="clay-btn-specimen clay-btn--sm clay-btn--lilac">Lilac</button>
            </div>
            {/* Clay Character */}
            <p className="demo-section-title" data-lang="en">Clay Character</p>
            <p className="demo-section-title" data-lang="ko" hidden>클레이 캐릭터</p>
            <p className="demo-section-title" data-lang="ja" hidden>クレイキャラクター</p>
            <div className="clay-character-wrap">
              <div className="clay-character clay-character--coral" data-mood="happy">
                <div className="clay-char-head">
                  <div className="clay-char-eye clay-char-eye--l" />
                  <div className="clay-char-eye clay-char-eye--r" />
                  <div className="clay-char-cheek clay-char-cheek--l" />
                  <div className="clay-char-cheek clay-char-cheek--r" />
                  <div className="clay-char-mouth" />
                </div>
                <div className="clay-char-arm clay-char-arm--l" />
                <div className="clay-char-arm clay-char-arm--r" />
                <div className="clay-char-body" />
                <div className="clay-char-foot clay-char-foot--l" />
                <div className="clay-char-foot clay-char-foot--r" />
                <span className="clay-character__name">Coral</span>
              </div>
              <div className="clay-character clay-character--sky" data-mood="curious">
                <div className="clay-char-head">
                  <div className="clay-char-eye clay-char-eye--l" />
                  <div className="clay-char-eye clay-char-eye--r" />
                  <div className="clay-char-cheek clay-char-cheek--l" />
                  <div className="clay-char-cheek clay-char-cheek--r" />
                  <div className="clay-char-mouth clay-char-mouth--small" />
                </div>
                <div className="clay-char-arm clay-char-arm--l" />
                <div className="clay-char-arm clay-char-arm--r" />
                <div className="clay-char-body" />
                <div className="clay-char-foot clay-char-foot--l" />
                <div className="clay-char-foot clay-char-foot--r" />
                <span className="clay-character__name">Sky</span>
              </div>
              <div className="clay-character clay-character--yellow" data-mood="sleepy">
                <div className="clay-char-head">
                  <div className="clay-char-eye clay-char-eye--l clay-char-eye--closed" />
                  <div className="clay-char-eye clay-char-eye--r clay-char-eye--closed" />
                  <div className="clay-char-cheek clay-char-cheek--l" />
                  <div className="clay-char-cheek clay-char-cheek--r" />
                  <div className="clay-char-mouth clay-char-mouth--smile" />
                </div>
                <div className="clay-char-arm clay-char-arm--l" />
                <div className="clay-char-arm clay-char-arm--r" />
                <div className="clay-char-body" />
                <div className="clay-char-foot clay-char-foot--l" />
                <div className="clay-char-foot clay-char-foot--r" />
                <span className="clay-character__name">Honey</span>
              </div>
              <div className="clay-character clay-character--mint" data-mood="cheer">
                <div className="clay-char-head">
                  <div className="clay-char-eye clay-char-eye--l" />
                  <div className="clay-char-eye clay-char-eye--r" />
                  <div className="clay-char-cheek clay-char-cheek--l" />
                  <div className="clay-char-cheek clay-char-cheek--r" />
                  <div className="clay-char-mouth clay-char-mouth--open" />
                </div>
                <div className="clay-char-arm clay-char-arm--l clay-char-arm--up" />
                <div className="clay-char-arm clay-char-arm--r clay-char-arm--up" />
                <div className="clay-char-body" />
                <div className="clay-char-foot clay-char-foot--l" />
                <div className="clay-char-foot clay-char-foot--r" />
                <span className="clay-character__name">Mint</span>
              </div>
            </div>
            {/* Clay Tablet Cards */}
            <p className="demo-section-title" data-lang="en">Clay Tablets</p>
            <p className="demo-section-title" data-lang="ko" hidden>클레이 태블릿</p>
            <p className="demo-section-title" data-lang="ja" hidden>クレイタブレット</p>
            <div className="clay-tablet-grid">
              <article className="clay-tablet">
                <div className="clay-tablet-icon clay-tablet-icon--coral">🧴</div>
                <h4 data-lang="en">Soft &amp; Rounded</h4>
                <h4 data-lang="ko" hidden>부드럽고 둥근</h4>
                <h4 data-lang="ja" hidden>柔らかく丸い</h4>
                <p data-lang="en">Every surface uses generous border-radius (20-40px) to eliminate sharp edges entirely.</p>
                <p data-lang="ko" hidden>모든 표면은 날카로운 모서리를 완전히 제거하기 위해 넉넉한 border-radius(20-40px)를 사용합니다.</p>
                <p data-lang="ja" hidden>すべての表面は大きなborder-radius（20-40px）を使い、鋭い角を完全に排除します。</p>
              </article>
              <article className="clay-tablet">
                <div className="clay-tablet-icon clay-tablet-icon--sky">💧</div>
                <h4 data-lang="en">Dual Shadows</h4>
                <h4 data-lang="ko" hidden>이중 그림자</h4>
                <h4 data-lang="ja" hidden>ダブルシャドウ</h4>
                <p data-lang="en">Outset shadows for depth plus inset shadows for inflated volume — the core clay recipe.</p>
                <p data-lang="ko" hidden>깊이감을 위한 아웃셋 그림자와 부풀어 오른 볼륨감을 위한 인셋 그림자 — 핵심 클레이 레시피.</p>
                <p data-lang="ja" hidden>奥行きのためのアウトセットシャドウと膨らんだボリューム感のためのインセットシャドウ — クレイの核心レシピ。</p>
              </article>
              <article className="clay-tablet">
                <div className="clay-tablet-icon clay-tablet-icon--yellow">✨</div>
                <h4 data-lang="en">Inner Highlights</h4>
                <h4 data-lang="ko" hidden>내부 하이라이트</h4>
                <h4 data-lang="ja" hidden>インナーハイライト</h4>
                <p data-lang="en">Subtle top-light gradients and white inner shadows create the illusion of molded clay catching light.</p>
                <p data-lang="ko" hidden>미묘한 상단 조명 그라데이션과 흰색 내부 그림자가 빛을 받는 점토의 환상을 만듭니다.</p>
                <p data-lang="ja" hidden>微妙なトップライトグラデーションと白いインナーシャドウが、光を受けた粘土の錯覚を生み出します。</p>
              </article>
            </div>
            {/* Toggle Switches */}
            <p className="demo-section-title" data-lang="en">Clay Toggles</p>
            <p className="demo-section-title" data-lang="ko" hidden>클레이 토글</p>
            <p className="demo-section-title" data-lang="ja" hidden>クレイトグル</p>
            <div className="clay-toggles-wrap">
              <div className="clay-toggle-group">
                <span className="clay-toggle-label">Squish</span>
                <button className="clay-toggle active" type="button" data-toggle-class="active">
                  <div className="clay-toggle-knob clay-toggle-knob--coral" />
                </button>
              </div>
              <div className="clay-toggle-group">
                <span className="clay-toggle-label">Bounce</span>
                <button className="clay-toggle" type="button" data-toggle-class="active">
                  <div className="clay-toggle-knob clay-toggle-knob--sky" />
                </button>
              </div>
              <div className="clay-toggle-group">
                <span className="clay-toggle-label">Glow</span>
                <button className="clay-toggle active" type="button" data-toggle-class="active">
                  <div className="clay-toggle-knob clay-toggle-knob--yellow" />
                </button>
              </div>
            </div>
            {/* Color Mixing */}
            <p className="demo-section-title" data-lang="en">Color Mixing</p>
            <p className="demo-section-title" data-lang="ko" hidden>색상 혼합</p>
            <p className="demo-section-title" data-lang="ja" hidden>カラーミキシング</p>
            <div className="clay-mixing-wrap">
              <div className="clay-mix-ball clay-ball--coral" style={{width: 64, height: 64, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #ffb8af 0%, #ff8b7e 60%, #e0706a 100%)', boxShadow: '6px 6px 14px rgba(255,139,126,0.3),inset 5px 5px 10px rgba(255,255,255,0.5),inset -5px -5px 10px rgba(0,0,0,0.1)'}} />
              <span className="clay-mix-plus">+</span>
              <div className="clay-mix-ball clay-ball--sky" style={{width: 64, height: 64, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #c8dbff 0%, #a2c2ff 60%, #7ba6f0 100%)', boxShadow: '6px 6px 14px rgba(162,194,255,0.3),inset 5px 5px 10px rgba(255,255,255,0.5),inset -5px -5px 10px rgba(0,0,0,0.1)'}} />
              <span className="clay-mix-eq">=</span>
              <div className="clay-mix-result" style={{background: 'radial-gradient(circle at 35% 30%, #e0c0f0 0%, #c4a0e0 60%, #a882cc 100%)', boxShadow: '8px 8px 20px rgba(196,160,224,0.35),-4px -4px 10px rgba(255,255,255,0.4),inset 6px 6px 14px rgba(255,255,255,0.5),inset -6px -6px 14px rgba(0,0,0,0.12)'}} />
              <span style={{width: '100%', display: 'block', height: 0}} />
              <div className="clay-mix-ball" style={{width: 64, height: 64, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #ffe4a0 0%, #ffd166 60%, #e8b84a 100%)', boxShadow: '6px 6px 14px rgba(255,209,102,0.3),inset 5px 5px 10px rgba(255,255,255,0.5),inset -5px -5px 10px rgba(0,0,0,0.1)'}} />
              <span className="clay-mix-plus">+</span>
              <div className="clay-mix-ball" style={{width: 64, height: 64, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #b8f0d8 0%, #7edbb0 60%, #5cc495 100%)', boxShadow: '6px 6px 14px rgba(126,219,176,0.3),inset 5px 5px 10px rgba(255,255,255,0.5),inset -5px -5px 10px rgba(0,0,0,0.1)'}} />
              <span className="clay-mix-eq">=</span>
              <div className="clay-mix-result" style={{background: 'radial-gradient(circle at 35% 30%, #d8f0b8 0%, #b8e088 60%, #98c868 100%)', boxShadow: '8px 8px 20px rgba(184,224,136,0.35),-4px -4px 10px rgba(255,255,255,0.4),inset 6px 6px 14px rgba(255,255,255,0.5),inset -6px -6px 14px rgba(0,0,0,0.12)'}} />
            </div>
            {/* Progress Bars */}
            <p className="demo-section-title" data-lang="en">Clay Progress</p>
            <p className="demo-section-title" data-lang="ko" hidden>클레이 진행바</p>
            <p className="demo-section-title" data-lang="ja" hidden>クレイプログレス</p>
            <div className="clay-progress-wrap">
              <div className="clay-progress-item">
                <span className="clay-progress-label" data-lang="en">Softness — 75%</span>
                <span className="clay-progress-label" data-lang="ko" hidden>부드러움 — 75%</span>
                <span className="clay-progress-label" data-lang="ja" hidden>柔らかさ — 75%</span>
                <div className="clay-progress-track"><div className="clay-progress-fill clay-progress-fill--coral" /></div>
              </div>
              <div className="clay-progress-item">
                <span className="clay-progress-label" data-lang="en">Roundness — 50%</span>
                <span className="clay-progress-label" data-lang="ko" hidden>둥근 정도 — 50%</span>
                <span className="clay-progress-label" data-lang="ja" hidden>丸み — 50%</span>
                <div className="clay-progress-track"><div className="clay-progress-fill clay-progress-fill--sky" /></div>
              </div>
              <div className="clay-progress-item">
                <span className="clay-progress-label" data-lang="en">Squishiness — 90%</span>
                <span className="clay-progress-label" data-lang="ko" hidden>뭉글뭉글함 — 90%</span>
                <span className="clay-progress-label" data-lang="ja" hidden>もちもち感 — 90%</span>
                <div className="clay-progress-track"><div className="clay-progress-fill clay-progress-fill--yellow" /></div>
              </div>
            </div>
            {/* Material Properties */}
            <p className="demo-section-title" data-lang="en">Material Properties</p>
            <p className="demo-section-title" data-lang="ko" hidden>재질 속성</p>
            <p className="demo-section-title" data-lang="ja" hidden>マテリアルプロパティ</p>
            <div className="clay-recipe">
              <h4 data-lang="en">CSS Clay Recipe</h4>
              <h4 data-lang="ko" hidden>CSS 클레이 레시피</h4>
              <h4 data-lang="ja" hidden>CSSクレイレシピ</h4>
              <div className="clay-recipe-row">
                <div className="clay-recipe-swatch" style={{background: 'var(--clay-bg)', boxShadow: '4px 4px 8px rgba(0,0,0,0.05),-4px -4px 8px #fff,inset 3px 3px 6px rgba(255,255,255,1),inset -3px -3px 6px rgba(0,0,0,0.02)'}} />
                <span className="clay-recipe-prop">border-radius</span>
                <span className="clay-recipe-code">20px ~ 40px (rounded, never sharp)</span>
              </div>
              <div className="clay-recipe-row">
                <div className="clay-recipe-swatch" style={{background: 'linear-gradient(160deg,#ffb8af,var(--accent))', borderRadius: 12, boxShadow: 'inset 3px 3px 6px rgba(255,255,255,0.5),inset -3px -3px 6px rgba(0,0,0,0.1)'}} />
                <span className="clay-recipe-prop">outset shadow</span>
                <span className="clay-recipe-code">10px 10px 20px rgba(0,0,0,0.05),<br />-10px -10px 20px #fff</span>
              </div>
              <div className="clay-recipe-row">
                <div className="clay-recipe-swatch" style={{background: '#fdfdfd', borderRadius: 12, boxShadow: 'inset 5px 5px 10px rgba(255,255,255,1),inset -5px -5px 10px rgba(0,0,0,0.04)'}} />
                <span className="clay-recipe-prop">inset shadow</span>
                <span className="clay-recipe-code">inset 5px 5px 10px rgba(255,255,255,1),<br />inset -5px -5px 10px rgba(0,0,0,0.05)</span>
              </div>
              <div className="clay-recipe-row">
                <div className="clay-recipe-swatch" style={{background: 'linear-gradient(160deg,#c0d8ff,#a2c2ff)', borderRadius: 12, boxShadow: 'inset 3px 3px 6px rgba(255,255,255,0.5),inset -3px -3px 6px rgba(0,0,0,0.1)'}} />
                <span className="clay-recipe-prop">inner gradient</span>
                <span className="clay-recipe-code">linear-gradient(160deg, lighter 0%, base 100%)<br />+ inset highlights for 3D illusion</span>
              </div>
              <div className="clay-recipe-row">
                <div className="clay-recipe-swatch" style={{background: 'var(--clay-bg)', borderRadius: 12, boxShadow: '4px 4px 8px rgba(0,0,0,0.05)', transform: 'scale(0.92)', transition: 'transform 0.2s'}} />
                <span className="clay-recipe-prop">hover effect</span>
                <span className="clay-recipe-code">transform: scale(0.95)<br />Squish down on interaction</span>
              </div>
            </div>
          </div>
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre id="prompt-clay" data-lang="en">Design a landing page in Claymorphism style — soft, squishy surfaces with marshmallow-like inflated volume.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #e8eaed{"\n"}--clay-bg: #ffffff{"\n"}--card-bg: #fdfdfd{"\n"}--text: #414a52{"\n"}--accent-coral: #ff8b7e{"\n"}--accent-sky: #a2c2ff{"\n"}--accent-yellow: #ffd166{"\n"}No other colors.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Font family: 'Nunito', sans-serif. Weights: 700, 900.{"\n"}h1: clamp(2.5rem, 6vw, 4rem), letter-spacing: -0.03em, text-shadow: 2px 2px 4px rgba(0,0,0,0.1).{"\n"}Body: 1.2rem, line-height: 1.6, opacity: 0.8.{"\n"}Card text: 0.95rem, opacity: 0.8.{"\n"}{"\n"}UI:{"\n"}Hero panel: background #ffffff, border-radius: 40px, text-align: center.{"\n"}Cards: background #fdfdfd, border-radius: 30px, padding: 30px.{"\n"}Icon blocks: 70x70px squares, border-radius: 20px, accent-color background.{"\n"}Buttons: border-radius: 25px, padding: 12px 30px, accent-color background, white text.{"\n"}{"\n"}LAYOUT:{"\n"}Page container: width: min(1050px, 92vw), margin: 0 auto, padding: 28px 0 76px.{"\n"}Card grid: display: grid, grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)), gap: 30px.{"\n"}{"\n"}SHADOWS (critical — every surface must use outset + inset simultaneously):{"\n"}Hero outset: 15px 15px 30px rgba(0,0,0,0.08), -15px -15px 30px rgba(255,255,255,1).{"\n"}Hero inset: inset 10px 10px 15px rgba(255,255,255,1), inset -10px -10px 15px rgba(0,0,0,0.05).{"\n"}Card outset: 10px 10px 20px rgba(0,0,0,0.05), -10px -10px 20px #fff.{"\n"}Card inset: inset 5px 5px 10px rgba(255,255,255,1), inset -5px -5px 10px rgba(0,0,0,0.02).{"\n"}Icon inset: inset 5px 5px 10px rgba(255,255,255,0.5), inset -5px -5px 10px rgba(0,0,0,0.1).{"\n"}Button inset: inset 4px 4px 8px rgba(255,255,255,0.6), inset -4px -4px 8px rgba(0,0,0,0.1).{"\n"}{"\n"}MOTION:{"\n"}Card hover: transform: translateY(-5px), transition: 0.3s ease.{"\n"}No other animations.{"\n"}{"\n"}RESPONSIVE:{"\n"}≤768px: card grid collapses to 1 column, hero padding shrinks via clamp(30px, 5vw, 60px).{"\n"}≥1050px: page width caps at 1050px, 2-column card grid.{"\n"}{"\n"}FORBIDDEN:{"\n"}- Sharp right-angle corners (minimum border-radius: 15px on any surface){"\n"}- Flat single shadows (every element must combine outset + inset){"\n"}- Dark mode or dark backgrounds{"\n"}- Gradients on surfaces{"\n"}- Border lines (depth comes from shadows only){"\n"}{"\n"}OUTPUT:{"\n"}1) CSS custom properties for all shadow pairs, radii, and color tokens{"\n"}2) Hero section (centered) + card grid (2 columns) + CTA button{"\n"}3) Single-file HTML/CSS with responsive support</pre>
            <pre data-lang="ko" hidden>Claymorphism 스타일의 랜딩 페이지를 디자인해줘 — 마시멜로처럼 부풀어 오른 부드럽고 푹신한 표면.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #e8eaed{"\n"}--clay-bg: #ffffff{"\n"}--card-bg: #fdfdfd{"\n"}--text: #414a52{"\n"}--accent-coral: #ff8b7e{"\n"}--accent-sky: #a2c2ff{"\n"}--accent-yellow: #ffd166{"\n"}다른 색상 사용 금지.{"\n"}{"\n"}타이포그래피:{"\n"}폰트: 'Nunito', sans-serif. 웨이트: 700, 900.{"\n"}h1: clamp(2.5rem, 6vw, 4rem), letter-spacing: -0.03em, text-shadow: 2px 2px 4px rgba(0,0,0,0.1).{"\n"}본문: 1.2rem, line-height: 1.6, opacity: 0.8.{"\n"}카드 텍스트: 0.95rem, opacity: 0.8.{"\n"}{"\n"}UI:{"\n"}히어로 패널: background #ffffff, border-radius: 40px, text-align: center.{"\n"}카드: background #fdfdfd, border-radius: 30px, padding: 30px.{"\n"}아이콘 블록: 70x70px 정사각, border-radius: 20px, 액센트 색상 배경.{"\n"}버튼: border-radius: 25px, padding: 12px 30px, 액센트 색상 배경, 흰색 텍스트.{"\n"}{"\n"}레이아웃:{"\n"}페이지 컨테이너: width: min(1050px, 92vw), margin: 0 auto, padding: 28px 0 76px.{"\n"}카드 그리드: display: grid, grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)), gap: 30px.{"\n"}{"\n"}그림자 (핵심 — 모든 표면에 outset + inset 반드시 동시 적용):{"\n"}히어로 outset: 15px 15px 30px rgba(0,0,0,0.08), -15px -15px 30px rgba(255,255,255,1).{"\n"}히어로 inset: inset 10px 10px 15px rgba(255,255,255,1), inset -10px -10px 15px rgba(0,0,0,0.05).{"\n"}카드 outset: 10px 10px 20px rgba(0,0,0,0.05), -10px -10px 20px #fff.{"\n"}카드 inset: inset 5px 5px 10px rgba(255,255,255,1), inset -5px -5px 10px rgba(0,0,0,0.02).{"\n"}아이콘 inset: inset 5px 5px 10px rgba(255,255,255,0.5), inset -5px -5px 10px rgba(0,0,0,0.1).{"\n"}버튼 inset: inset 4px 4px 8px rgba(255,255,255,0.6), inset -4px -4px 8px rgba(0,0,0,0.1).{"\n"}{"\n"}모션:{"\n"}카드 hover: transform: translateY(-5px), transition: 0.3s ease.{"\n"}다른 애니메이션 없음.{"\n"}{"\n"}반응형:{"\n"}≤768px: 카드 그리드 1열로 전환, 히어로 패딩 clamp(30px, 5vw, 60px)으로 축소.{"\n"}≥1050px: 페이지 폭 1050px 고정, 2열 카드 그리드.{"\n"}{"\n"}금지사항:{"\n"}- 날카로운 직각 코너 (최소 border-radius: 15px 이상){"\n"}- 단일 그림자만 사용 (모든 요소에 outset + inset 반드시 조합){"\n"}- 다크 모드 또는 어두운 배경{"\n"}- 표면에 그라데이션 적용{"\n"}- 보더 라인 사용 (깊이감은 그림자로만 표현){"\n"}{"\n"}출력:{"\n"}1) 모든 그림자 쌍, 곡률, 색상 토큰을 위한 CSS 커스텀 속성{"\n"}2) 히어로 섹션(중앙 정렬) + 카드 그리드(2열) + CTA 버튼{"\n"}3) 반응형 대응이 포함된 단일 HTML/CSS 파일</pre>
            <pre data-lang="ja" hidden>Claymorphismスタイルのランディングページをデザインしてください — マシュマロのように膨らんだ柔らかくふっくらとした表面。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #e8eaed{"\n"}--clay-bg: #ffffff{"\n"}--card-bg: #fdfdfd{"\n"}--text: #414a52{"\n"}--accent-coral: #ff8b7e{"\n"}--accent-sky: #a2c2ff{"\n"}--accent-yellow: #ffd166{"\n"}他の色は使用禁止。{"\n"}{"\n"}タイポグラフィ:{"\n"}フォント: 'Nunito', sans-serif。ウェイト: 700, 900。{"\n"}h1: clamp(2.5rem, 6vw, 4rem), letter-spacing: -0.03em, text-shadow: 2px 2px 4px rgba(0,0,0,0.1)。{"\n"}本文: 1.2rem, line-height: 1.6, opacity: 0.8。{"\n"}カードテキスト: 0.95rem, opacity: 0.8。{"\n"}{"\n"}UI:{"\n"}ヒーローパネル: background #ffffff, border-radius: 40px, text-align: center。{"\n"}カード: background #fdfdfd, border-radius: 30px, padding: 30px。{"\n"}アイコンブロック: 70x70px正方形, border-radius: 20px, アクセントカラー背景。{"\n"}ボタン: border-radius: 25px, padding: 12px 30px, アクセントカラー背景, 白テキスト。{"\n"}{"\n"}レイアウト:{"\n"}ページコンテナ: width: min(1050px, 92vw), margin: 0 auto, padding: 28px 0 76px。{"\n"}カードグリッド: display: grid, grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)), gap: 30px。{"\n"}{"\n"}シャドウ（重要 — すべての表面にoutset + insetを必ず同時適用）:{"\n"}ヒーローoutset: 15px 15px 30px rgba(0,0,0,0.08), -15px -15px 30px rgba(255,255,255,1)。{"\n"}ヒーローinset: inset 10px 10px 15px rgba(255,255,255,1), inset -10px -10px 15px rgba(0,0,0,0.05)。{"\n"}カードoutset: 10px 10px 20px rgba(0,0,0,0.05), -10px -10px 20px #fff。{"\n"}カードinset: inset 5px 5px 10px rgba(255,255,255,1), inset -5px -5px 10px rgba(0,0,0,0.02)。{"\n"}アイコンinset: inset 5px 5px 10px rgba(255,255,255,0.5), inset -5px -5px 10px rgba(0,0,0,0.1)。{"\n"}ボタンinset: inset 4px 4px 8px rgba(255,255,255,0.6), inset -4px -4px 8px rgba(0,0,0,0.1)。{"\n"}{"\n"}モーション:{"\n"}カードhover: transform: translateY(-5px), transition: 0.3s ease。{"\n"}他のアニメーションなし。{"\n"}{"\n"}レスポンシブ:{"\n"}≤768px: カードグリッドが1列に変更、ヒーローパディングclamp(30px, 5vw, 60px)に縮小。{"\n"}≥1050px: ページ幅1050px固定、2列カードグリッド。{"\n"}{"\n"}禁止事項:{"\n"}- 鋭い直角コーナー（最小border-radius: 15px以上）{"\n"}- 単一シャドウのみの使用（すべての要素にoutset + insetを必ず組み合わせ）{"\n"}- ダークモードまたは暗い背景{"\n"}- 表面へのグラデーション適用{"\n"}- ボーダーラインの使用（深度はシャドウのみで表現）{"\n"}{"\n"}出力:{"\n"}1) すべてのシャドウペア、角丸、カラートークンのCSSカスタムプロパティ{"\n"}2) ヒーローセクション（中央揃え）+ カードグリッド（2列）+ CTAボタン{"\n"}3) レスポンシブ対応を含む単一HTML/CSSファイル</pre>
            <button className="copy-btn" data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/framer-motion.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Framer Motion</span></a><div className="page-nav__divider" /><a href="/pages/neumorphism.html"><span><span className="page-nav__label">다음</span>Neumorphism</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
