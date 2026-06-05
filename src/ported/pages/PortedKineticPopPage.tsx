import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedKineticPopPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--kinetic-pop">
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
        <main className="container">
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
          {/* ═══ HERO ═══ */}
          <section className="hero">
            <div className="hero-clip">
              <div className="halftone" />
              <span className="blob a" />
              <span className="blob b" />
              <span className="blob c" />
              <div className="geo-shapes">
                <span className="geo geo--circle" />
                <span className="geo geo--triangle" />
                <span className="geo geo--square" />
                <span className="geo geo--star" />
                <span className="geo geo--diamond" />
              </div>
              <div className="hero-content">
                <div className="hero-title" aria-label="BOLD SHAPES FAST RHYTHM">
                  <span className="word">BOLD</span>
                  <span className="word">SHAPES</span>
                  <span className="word">FAST</span>
                  <span className="word">RHYTHM</span>
                </div>
                <p data-lang="en">
                  Pop art energy meets motion design. Thick ink lines, primary colors, and comic-book punch. Two to three high-saturation accents, used big and bold, drive the message home.
                </p>
                <p data-lang="ko" hidden>
                  팝아트의 에너지와 모션 디자인이 만납니다. 굵은 잉크 라인, 원색, 만화 같은 강렬함. 고채도 포인트 2~3개를 크고 대담하게 써서 메시지를 확실히 각인시킵니다.
                </p>
                <p data-lang="ja" hidden>
                  ポップアートのエネルギーとモーションデザインが出会う。太いインクの線、原色、コミックのような一撃。高彩度のアクセントを2〜3色だけ、大きく大胆に使ってメッセージを刻みます。
                </p>
              </div>
            </div>
          </section>
          {/* ═══ MARQUEE TICKER ═══ */}
          <div className="marquee-wrap" aria-hidden="true">
            <div className="marquee-track">
              <span>BOLD SHAPES</span><span className="sep">★</span>
              <span>FAST RHYTHM</span><span className="sep">★</span>
              <span>POP ART</span><span className="sep">★</span>
              <span>THICK LINES</span><span className="sep">★</span>
              <span>PRIMARY COLORS</span><span className="sep">★</span>
              <span>COMIC ENERGY</span><span className="sep">★</span>
              <span>MOTION DESIGN</span><span className="sep">★</span>
              <span>KINETIC POP</span><span className="sep">★</span>
              {/* duplicate for seamless loop */}
              <span>BOLD SHAPES</span><span className="sep">★</span>
              <span>FAST RHYTHM</span><span className="sep">★</span>
              <span>POP ART</span><span className="sep">★</span>
              <span>THICK LINES</span><span className="sep">★</span>
              <span>PRIMARY COLORS</span><span className="sep">★</span>
              <span>COMIC ENERGY</span><span className="sep">★</span>
              <span>MOTION DESIGN</span><span className="sep">★</span>
              <span>KINETIC POP</span><span className="sep">★</span>
            </div>
          </div>
          {/* ═══ ZIGZAG DIVIDER ═══ */}
          <div className="zigzag" aria-hidden="true" />
          {/* ═══ STICKER SHEET ═══ */}
          <section className="sticker-section">
            <h2 data-lang="en">Design Principles</h2>
            <h2 data-lang="ko" hidden>디자인 원칙</h2>
            <h2 data-lang="ja" hidden>デザイン原則</h2>
            <div className="sticker-grid">
              <div className="sticker">
                <span className="sticker-peel" />
                <span className="sticker-label" data-lang="en">01 — Bold Type</span>
                <span className="sticker-label" data-lang="ko" hidden>01 — 대담한 타이포</span>
                <span className="sticker-label" data-lang="ja" hidden>01 — 大胆なタイポ</span>
                <span className="sticker-text" data-lang="en">Oversized headings with thick outlines. Short punchy copy. Repeat the rhythm.</span>
                <span className="sticker-text" data-lang="ko" hidden>굵은 외곽선의 큼직한 헤드라인. 짧고 강렬한 문구. 리듬을 반복하세요.</span>
                <span className="sticker-text" data-lang="ja" hidden>太い輪郭の特大見出し。短く力強いコピー。同じリズムを繰り返しましょう。</span>
              </div>
              <div className="sticker">
                <span className="sticker-peel" />
                <span className="sticker-label" data-lang="en">02 — Shape + Line</span>
                <span className="sticker-label" data-lang="ko" hidden>02 — 도형 + 라인</span>
                <span className="sticker-label" data-lang="ja" hidden>02 — 図形＋ライン</span>
                <span className="sticker-text" data-lang="en">Circles, triangles, squares — each in a pop color. Thick 4-5px ink borders on everything.</span>
                <span className="sticker-text" data-lang="ko" hidden>원, 삼각형, 사각형 — 각각 팝 컬러로 칠합니다. 모든 요소에 4-5px 굵은 잉크 테두리를 두릅니다.</span>
                <span className="sticker-text" data-lang="ja" hidden>丸、三角、四角 — それぞれポップカラーで。全要素に4-5pxの太いインクボーダー。</span>
              </div>
              <div className="sticker">
                <span className="sticker-peel" />
                <span className="sticker-label" data-lang="en">03 — CTA Contrast</span>
                <span className="sticker-label" data-lang="ko" hidden>03 — CTA 대비</span>
                <span className="sticker-label" data-lang="ja" hidden>03 — CTAコントラスト</span>
                <span className="sticker-text" data-lang="en">High-saturation accents for action. Yellow on black. Bold drop shadows. No subtlety.</span>
                <span className="sticker-text" data-lang="ko" hidden>행동을 부르는 고채도 포인트. 검정 위에 노랑. 굵은 드롭 섀도. 섬세함은 필요 없습니다.</span>
                <span className="sticker-text" data-lang="ja" hidden>アクション用の高彩度アクセント。黒地に黄色。太いドロップシャドウ。繊細さ不要。</span>
              </div>
            </div>
          </section>
          {/* ═══ ZIGZAG DIVIDER ═══ */}
          <div className="zigzag" aria-hidden="true" />
          {/* ═══ SPEECH BUBBLES ═══ */}
          <section className="bubble-section">
            <div className="speech-bubble">
              <span className="bubble-tag" data-lang="en">Pro Tip</span>
              <span className="bubble-tag" data-lang="ko" hidden>팁</span>
              <span className="bubble-tag" data-lang="ja" hidden>ヒント</span>
              <span data-lang="en">Limit yourself to 2-3 saturated colors. Pop art is about contrast, not variety.</span>
              <span data-lang="ko" hidden>채도 높은 색을 2~3가지로 제한하세요. 팝아트의 핵심은 다양함이 아니라 대비입니다.</span>
              <span data-lang="ja" hidden>高彩度の2〜3色に絞りましょう。ポップアートの本質は多様性ではなくコントラストです。</span>
            </div>
            <div className="speech-bubble">
              <span className="bubble-tag" data-lang="en">Key Move</span>
              <span className="bubble-tag" data-lang="ko" hidden>핵심</span>
              <span className="bubble-tag" data-lang="ja" hidden>ポイント</span>
              <span data-lang="en">Every element should feel like it's in motion — rotation, scale, and offset shadows create kinetic energy.</span>
              <span data-lang="ko" hidden>모든 요소가 움직이는 듯 보여야 합니다 — 회전, 스케일, 오프셋 섀도가 약동감을 만듭니다.</span>
              <span data-lang="ja" hidden>すべての要素が動いているように見せましょう — 回転、スケール、オフセットシャドウが躍動感を生みます。</span>
            </div>
          </section>
          {/* ═══ ZIGZAG DIVIDER ═══ */}
          <div className="zigzag" aria-hidden="true" />
          {/* ═══ COLOR SPLATS ═══ */}
          <section className="splat-section">
            <h2 data-lang="en">Color Palette</h2>
            <h2 data-lang="ko" hidden>컬러 팔레트</h2>
            <h2 data-lang="ja" hidden>カラーパレット</h2>
            <div className="splats">
              <div className="splat">
                <span className="splat-name">Yellow</span>
                <span className="splat-hex">#ffe85d</span>
              </div>
              <div className="splat">
                <span className="splat-name">Pink</span>
                <span className="splat-hex">#ff4f7b</span>
              </div>
              <div className="splat">
                <span className="splat-name">Blue</span>
                <span className="splat-hex">#196bff</span>
              </div>
              <div className="splat">
                <span className="splat-name">Ink</span>
                <span className="splat-hex">#141313</span>
              </div>
              <div className="splat">
                <span className="splat-name">Paper</span>
                <span className="splat-hex">#f6f3ea</span>
              </div>
            </div>
          </section>
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Kinetic Pop style — dynamic launch campaign aesthetic with bold shapes and high-contrast pop-art rhythms.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--yellow: #ffe85d{"\n"}--pink: #ff4f7b{"\n"}--blue: #196bff{"\n"}--ink: #141313{"\n"}--paper: #f6f3ea{"\n"}--hero-bg: #fff{"\n"}--band-blue: #b4cdfd{"\n"}--band-pink: #ffd4dd{"\n"}Background: radial-gradient(circle at 10% 8%, rgba(255, 79, 123, 0.28), transparent 24%),{"\n"}{"  "}radial-gradient(circle at 90% 18%, rgba(25, 107, 255, 0.22), transparent 28%),{"\n"}{"  "}linear-gradient(180deg, #fffdf2 0%, #f6f3ea 100%).{"\n"}No other colors.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Heading: 'Do Hyeon' 400 (display font, single weight), tracking -0.02em{"\n"}Body: 'Manrope' 400 / 600 / 700 / 800{"\n"}Scale: clamp(2rem, 7vw, 5.2rem) for h1{"\n"}Heading line-height: 0.95{"\n"}Body line-height: 1.7{"\n"}Hero paragraph max-width: 700px{"\n"}{"\n"}UI:{"\n"}Hero: 3px solid var(--ink), border-radius 36px, background #fff, inner clip border-radius 33px, overflow hidden{"\n"}Blob decorations: position absolute, border-radius 999px, yellow blob 170px at top-right, pink blob 120px at bottom-left{"\n"}Bands: 2px solid var(--ink), border-radius 14px, padding 12px, font-weight 700{"\n"}{"  "}Band 1: background var(--yellow){"\n"}{"  "}Band 2: background #b4cdfd{"\n"}{"  "}Band 3: background #ffd4dd{"\n"}Buttons: 2px solid var(--ink), background var(--yellow), border-radius 999px, padding 8px 14px, font-weight 700{"\n"}{"\n"}LAYOUT:{"\n"}Content max-width: min(1120px, 92vw){"\n"}Container padding: 26px 0 78px{"\n"}Band grid: auto-fit, minmax(210px, 1fr), gap 12px{"\n"}Hero padding: clamp(22px, 5vw, 46px){"\n"}{"\n"}MOTION:{"\n"}Entrance: translateY(15px) scale(0.96) → translateY(0) scale(1), opacity 0 → 1, 650ms ease, stagger 80ms{"\n"}Hover: subtle scale lift on bands, transition 200ms ease{"\n"}No scroll-triggered animations. Respect prefers-reduced-motion.{"\n"}{"\n"}RESPONSIVE:{"\n"}768px: Bands stack to 1 column, h1 clamps down to 2rem, hero padding reduces{"\n"}1120px: Full grid layout, blobs visible, centered container{"\n"}{"\n"}FORBIDDEN:{"\n"}- Horizontal scroll at any viewport{"\n"}- Long paragraph text — short copy repetition is the principle{"\n"}- Desaturated or neutral tones as primary colors{"\n"}- Thin or subtle borders — all borders must be 2-3px{"\n"}- Gradient text or complex gradient overlays{"\n"}- More than 3 accent colors{"\n"}{"\n"}OUTPUT:{"\n"}1) Color + typography tokens as CSS custom properties{"\n"}2) Component structure: Hero with blobs, Benefit bands (3), CTA button{"\n"}3) Semantic HTML + CSS with responsive support</pre>
            <pre data-lang="ko" hidden>Kinetic Pop 스타일의 랜딩 페이지를 설계해줘 — 대담한 형태와 고대비 팝아트 리듬감의 역동적인 런칭 캠페인 감성.{"\n"}{"\n"}색상 토큰:{"\n"}--yellow: #ffe85d{"\n"}--pink: #ff4f7b{"\n"}--blue: #196bff{"\n"}--ink: #141313{"\n"}--paper: #f6f3ea{"\n"}--hero-bg: #fff{"\n"}--band-blue: #b4cdfd{"\n"}--band-pink: #ffd4dd{"\n"}배경: radial-gradient(circle at 10% 8%, rgba(255, 79, 123, 0.28), transparent 24%),{"\n"}{"  "}radial-gradient(circle at 90% 18%, rgba(25, 107, 255, 0.22), transparent 28%),{"\n"}{"  "}linear-gradient(180deg, #fffdf2 0%, #f6f3ea 100%).{"\n"}다른 색상 사용 금지.{"\n"}{"\n"}타이포그래피:{"\n"}제목: 'Do Hyeon' 400 (디스플레이 폰트, 단일 웨이트), tracking -0.02em{"\n"}본문: 'Manrope' 400 / 600 / 700 / 800{"\n"}스케일: h1은 clamp(2rem, 7vw, 5.2rem){"\n"}제목 line-height: 0.95{"\n"}본문 line-height: 1.7{"\n"}히어로 문단 max-width: 700px{"\n"}{"\n"}UI:{"\n"}히어로: 3px solid var(--ink), border-radius 36px, background #fff, 내부 클립 border-radius 33px, overflow hidden{"\n"}블롭 장식: position absolute, border-radius 999px, 옐로 블롭 170px 우상단, 핑크 블롭 120px 좌하단{"\n"}밴드: 2px solid var(--ink), border-radius 14px, padding 12px, font-weight 700{"\n"}{"  "}밴드 1: background var(--yellow){"\n"}{"  "}밴드 2: background #b4cdfd{"\n"}{"  "}밴드 3: background #ffd4dd{"\n"}버튼: 2px solid var(--ink), background var(--yellow), border-radius 999px, padding 8px 14px, font-weight 700{"\n"}{"\n"}레이아웃:{"\n"}콘텐츠 max-width: min(1120px, 92vw){"\n"}컨테이너 padding: 26px 0 78px{"\n"}밴드 그리드: auto-fit, minmax(210px, 1fr), gap 12px{"\n"}히어로 padding: clamp(22px, 5vw, 46px){"\n"}{"\n"}모션:{"\n"}등장: translateY(15px) scale(0.96) → translateY(0) scale(1), opacity 0 → 1, 650ms ease, 80ms 스태거{"\n"}호버: 밴드에 미세한 scale 상승, transition 200ms ease{"\n"}스크롤 트리거 애니메이션 없음. prefers-reduced-motion 준수.{"\n"}{"\n"}반응형:{"\n"}768px: 밴드 1열 스택, h1이 2rem까지 축소, 히어로 패딩 감소{"\n"}1120px: 전체 그리드 레이아웃, 블롭 표시, 중앙 정렬 컨테이너{"\n"}{"\n"}금지사항:{"\n"}- 어떤 뷰포트에서든 가로 스크롤{"\n"}- 긴 문단 텍스트 — 짧은 카피 반복이 원칙{"\n"}- 저채도 또는 뉴트럴 톤을 주요 색상으로 사용{"\n"}- 얇거나 미묘한 테두리 — 모든 테두리는 2-3px{"\n"}- 그라데이션 텍스트 또는 복잡한 그라데이션 오버레이{"\n"}- 강조색 3개 초과{"\n"}{"\n"}출력:{"\n"}1) 색상 + 타이포그래피 토큰을 CSS 커스텀 프로퍼티로{"\n"}2) 컴포넌트 구조: 블롭이 있는 히어로, 베네핏 밴드(3개), CTA 버튼{"\n"}3) 반응형 대응이 포함된 시맨틱 HTML + CSS</pre>
            <pre data-lang="ja" hidden>Kinetic Popスタイルのランディングページを設計してください — 大胆な形と高コントラストのポップアートのリズムで、ダイナミックなローンチキャンペーンの世界観を作ります。{"\n"}{"\n"}カラートークン:{"\n"}--yellow: #ffe85d{"\n"}--pink: #ff4f7b{"\n"}--blue: #196bff{"\n"}--ink: #141313{"\n"}--paper: #f6f3ea{"\n"}--hero-bg: #fff{"\n"}--band-blue: #b4cdfd{"\n"}--band-pink: #ffd4dd{"\n"}背景: radial-gradient(circle at 10% 8%, rgba(255, 79, 123, 0.28), transparent 24%),{"\n"}{"  "}radial-gradient(circle at 90% 18%, rgba(25, 107, 255, 0.22), transparent 28%),{"\n"}{"  "}linear-gradient(180deg, #fffdf2 0%, #f6f3ea 100%).{"\n"}他の色は使用禁止。{"\n"}{"\n"}タイポグラフィ:{"\n"}見出し: 'Do Hyeon' 400（ディスプレイフォント、単一ウェイト）, tracking -0.02em{"\n"}本文: 'Manrope' 400 / 600 / 700 / 800{"\n"}スケール: h1はclamp(2rem, 7vw, 5.2rem){"\n"}見出しline-height: 0.95{"\n"}本文line-height: 1.7{"\n"}ヒーロー段落max-width: 700px{"\n"}{"\n"}UI:{"\n"}ヒーロー: 3px solid var(--ink), border-radius 36px, background #fff, 内部クリップborder-radius 33px, overflow hidden{"\n"}ブロブ装飾: position absolute, border-radius 999px, イエローブロブ170px右上、ピンクブロブ120px左下{"\n"}バンド: 2px solid var(--ink), border-radius 14px, padding 12px, font-weight 700{"\n"}{"  "}バンド1: background var(--yellow){"\n"}{"  "}バンド2: background #b4cdfd{"\n"}{"  "}バンド3: background #ffd4dd{"\n"}ボタン: 2px solid var(--ink), background var(--yellow), border-radius 999px, padding 8px 14px, font-weight 700{"\n"}{"\n"}レイアウト:{"\n"}コンテンツmax-width: min(1120px, 92vw){"\n"}コンテナpadding: 26px 0 78px{"\n"}バンドグリッド: auto-fit, minmax(210px, 1fr), gap 12px{"\n"}ヒーローpadding: clamp(22px, 5vw, 46px){"\n"}{"\n"}モーション:{"\n"}登場: translateY(15px) scale(0.96) → translateY(0) scale(1), opacity 0 → 1, 650ms ease, 80msスタガー{"\n"}ホバー: バンドに微かなscale上昇, transition 200ms ease{"\n"}スクロールトリガーのアニメーションなし。prefers-reduced-motionを尊重。{"\n"}{"\n"}レスポンシブ:{"\n"}768px: バンド1列スタック、h1が2remまで縮小、ヒーローパディング減少{"\n"}1120px: フルグリッドレイアウト、ブロブ表示、中央揃えコンテナ{"\n"}{"\n"}禁止事項:{"\n"}- いかなるビューポートでも横スクロール{"\n"}- 長い段落テキスト — 短いコピーの反復が原則{"\n"}- 低彩度またはニュートラルトーンを主要色として使用{"\n"}- 細いまたは繊細なボーダー — 全てのボーダーは2-3px{"\n"}- グラデーションテキストや複雑なグラデーションオーバーレイ{"\n"}- アクセントカラー3色超過{"\n"}{"\n"}出力:{"\n"}1) カラー＋タイポグラフィトークンをCSSカスタムプロパティとして{"\n"}2) コンポーネント構造: ブロブ付きヒーロー、ベネフィットバンド（3つ）、CTAボタン{"\n"}3) レスポンシブ対応を含むセマンティックHTML + CSS</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/editorial-silence.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Editorial Silence</span></a><div className="page-nav__divider" /><a href="/pages/cyberpunk-glitch.html"><span><span className="page-nav__label">다음</span>Cyberpunk Glitch</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
