import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedBrutalistGridPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--brutalist-grid">
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
          {/* ════════ DEMO SECTION START ════════ */}
          <section className="grid-master">
            {/* ── HERO: Full-width, oversized type ── */}
            <article className="hero">
              <div className="hero__label">GRID SYSTEM / 12-COL / 2024</div>
              <div className="hero__mega">BRUT<span>ALIST</span></div>
              <h1>No Frills. Pure Structure.</h1>
              <p data-lang="en">
                Brutalist design exposes every structural element. The grid is not hidden — it IS the design. Thick borders, raw typography, visible columns: nothing is decorated, everything is declared. This is architecture, not illustration.
              </p>
              <p data-lang="ko" hidden>
                브루탈리즘 디자인은 모든 구조 요소를 그대로 드러냅니다. 그리드를 숨기지 않고 그리드 자체가 디자인이 됩니다. 굵은 테두리, 날것의 타이포그래피, 그대로 보이는 컬럼까지, 무엇도 꾸미지 않고 모든 것을 선언합니다. 일러스트가 아니라 건축입니다.
              </p>
              <p data-lang="ja" hidden>
                ブルータリズムデザインは、構造要素をすべて表に出します。グリッドを隠さず、グリッドそのものがデザインになります。太いボーダー、生のタイポグラフィ、むき出しのカラム。何も飾らず、すべてを宣言します。イラストではなく建築です。
              </p>
              <div className="stamp">RAW / UNPOLISHED</div>
            </article>
            {/* ── GRID ANATOMY: Numbered columns ── */}
            <div className="grid-anatomy">
              <div className="grid-anatomy__title">Grid Anatomy — 12 Columns / Visible Gutters</div>
              <div className="grid-anatomy__cols">
                <div className="grid-anatomy__col">01</div>
                <div className="grid-anatomy__col">02</div>
                <div className="grid-anatomy__col">03</div>
                <div className="grid-anatomy__col">04</div>
                <div className="grid-anatomy__col">05</div>
                <div className="grid-anatomy__col">06</div>
                <div className="grid-anatomy__col">07</div>
                <div className="grid-anatomy__col">08</div>
                <div className="grid-anatomy__col">09</div>
                <div className="grid-anatomy__col">10</div>
                <div className="grid-anatomy__col">11</div>
                <div className="grid-anatomy__col">12</div>
              </div>
            </div>
            {/* ── SPAN DEMO: Different column spans ── */}
            <div className="span-demo">
              <div className="span-3"><span>SPAN 3</span><span>25%</span></div>
              <div className="span-3b"><span>SPAN 3</span><span>25%</span></div>
              <div className="span-6"><span>SPAN 6</span><span>50%</span></div>
              <div className="span-4"><span>SPAN 4</span><span>33%</span></div>
              <div className="span-8"><span>SPAN 8</span><span>66%</span></div>
              <div className="span-12" data-lang="en">FULL WIDTH — SPAN 12 — THE GRID IS THE DESIGN — STRUCTURE OVER DECORATION</div>
              <div className="span-12" data-lang="ko" hidden>전체 너비 — SPAN 12 — 그리드가 곧 디자인 — 장식보다 구조</div>
              <div className="span-12" data-lang="ja" hidden>全幅 — SPAN 12 — グリッドがデザイン — 装飾より構造</div>
            </div>
            {/* ── MANIFEST (8 col) + SIDE RULES (4 col) ── */}
            <div className="manifest">
              <div className="manifest__title" data-lang="en">Manifest /<br />Spec Sheet</div>
              <div className="manifest__title" data-lang="ko" hidden>매니페스트 /<br />사양서</div>
              <div className="manifest__title" data-lang="ja" hidden>マニフェスト /<br />仕様書</div>
              <div className="manifest__rule" data-lang="en"><strong>01</strong> NO ROUNDED CORNERS. BORDER-RADIUS IS BANNED.</div>
              <div className="manifest__rule" data-lang="ko" hidden><strong>01</strong> 둥근 모서리 없음. BORDER-RADIUS 금지.</div>
              <div className="manifest__rule" data-lang="ja" hidden><strong>01</strong> 角丸なし。BORDER-RADIUSは禁止。</div>
              <div className="manifest__rule" data-lang="en"><strong>02</strong> BORDERS MINIMUM 4PX. EVERY EDGE VISIBLE.</div>
              <div className="manifest__rule" data-lang="ko" hidden><strong>02</strong> 테두리 최소 4PX. 모든 가장자리 표시.</div>
              <div className="manifest__rule" data-lang="ja" hidden><strong>02</strong> ボーダー最低4PX。すべてのエッジを表示。</div>
              <div className="manifest__rule" data-lang="en"><strong>03</strong> NO GRADIENTS. NO SHADOWS. NO GLOW.</div>
              <div className="manifest__rule" data-lang="ko" hidden><strong>03</strong> 그라데이션 없음. 그림자 없음. 글로우 없음.</div>
              <div className="manifest__rule" data-lang="ja" hidden><strong>03</strong> グラデーションなし。シャドウなし。グローなし。</div>
              <div className="manifest__rule" data-lang="en"><strong>04</strong> MONOSPACE FOR DATA. DISPLAY FOR IMPACT.</div>
              <div className="manifest__rule" data-lang="ko" hidden><strong>04</strong> 데이터는 고정폭. 임팩트는 디스플레이 서체.</div>
              <div className="manifest__rule" data-lang="ja" hidden><strong>04</strong> データにはモノスペース。インパクトにはディスプレイ。</div>
              <div className="manifest__rule" data-lang="en"><strong>05</strong> THE GRID IS NOT HIDDEN. THE GRID IS THE DESIGN.</div>
              <div className="manifest__rule" data-lang="ko" hidden><strong>05</strong> 그리드를 숨기지 않는다. 그리드가 곧 디자인이다.</div>
              <div className="manifest__rule" data-lang="ja" hidden><strong>05</strong> グリッドは隠さない。グリッドがデザインである。</div>
              <div className="manifest__rule" data-lang="en"><strong>06</strong> IF IT LOOKS COMFORTABLE, YOU'RE DOING IT WRONG.</div>
              <div className="manifest__rule" data-lang="ko" hidden><strong>06</strong> 편안해 보인다면 잘못하고 있는 것이다.</div>
              <div className="manifest__rule" data-lang="ja" hidden><strong>06</strong> 快適に見えるなら、それは間違っている。</div>
              <div className="stamp stamp--approved" data-lang="en">APPROVED</div>
              <div className="stamp stamp--approved" data-lang="ko" hidden>승인됨</div>
              <div className="stamp stamp--approved" data-lang="ja" hidden>承認済</div>
            </div>
            <aside className="side">
              <h2>Rules</h2>
              <div className="stat" data-lang="en">01. Thick borders (4-6px)</div>
              <div className="stat" data-lang="ko" hidden>01. 굵은 테두리 (4-6px)</div>
              <div className="stat" data-lang="ja" hidden>01. 太いボーダー (4-6px)</div>
              <div className="stat" data-lang="en">02. Zero corner rounding</div>
              <div className="stat" data-lang="ko" hidden>02. 모서리 라운딩 0</div>
              <div className="stat" data-lang="ja" hidden>02. コーナー丸みゼロ</div>
              <div className="stat" data-lang="en">03. Strong text hierarchy</div>
              <div className="stat" data-lang="ko" hidden>03. 강한 텍스트 계층</div>
              <div className="stat" data-lang="ja" hidden>03. 強いテキスト階層</div>
              <div className="stat" data-lang="en">04. Exposed grid system</div>
              <div className="stat" data-lang="ko" hidden>04. 노출된 그리드 시스템</div>
              <div className="stat" data-lang="ja" hidden>04. 露出したグリッドシステム</div>
              <div className="stat" data-lang="en">05. Monospace + Display</div>
              <div className="stat" data-lang="ko" hidden>05. 고정폭 + 디스플레이</div>
              <div className="stat" data-lang="ja" hidden>05. モノスペース + ディスプレイ</div>
              <div className="stat" data-lang="en">06. Black &amp; white dominant</div>
              <div className="stat" data-lang="ko" hidden>06. 흑백 위주</div>
              <div className="stat" data-lang="ja" hidden>06. 白黒が支配的</div>
            </aside>
            {/* ── OVERLAP ZONE: Intentional misalignment ── */}
            <div className="overlap-zone">
              <div className="overlap-a">
                <h3 data-lang="en">Overlap<br />Is Intent</h3>
                <h3 data-lang="ko" hidden>겹침은<br />의도적이다</h3>
                <h3 data-lang="ja" hidden>重なりは<br />意図的</h3>
              </div>
              <div className="overlap-b">
                <h3 data-lang="en">Collision<br />Creates Tension</h3>
                <h3 data-lang="ko" hidden>충돌이<br />긴장을 만든다</h3>
                <h3 data-lang="ja" hidden>衝突が<br />緊張を生む</h3>
              </div>
              <div className="overlap-c" data-lang="en">Z-INDEX: 3 / GRID-COLUMN: 2 / 10 / MARGIN-TOP: 90PX — DELIBERATE STRUCTURAL INTERFERENCE</div>
              <div className="overlap-c" data-lang="ko" hidden>Z-INDEX: 3 / GRID-COLUMN: 2 / 10 / MARGIN-TOP: 90PX — 의도적 구조 간섭</div>
              <div className="overlap-c" data-lang="ja" hidden>Z-INDEX: 3 / GRID-COLUMN: 2 / 10 / MARGIN-TOP: 90PX — 意図的な構造干渉</div>
            </div>
            {/* ── RAW STRUCTURE: Every cell bordered ── */}
            <div className="raw-structure">
              <div className="raw-cell raw-cell--filled">DIV</div>
              <div className="raw-cell">DIV</div>
              <div className="raw-cell raw-cell--accent">DIV</div>
              <div className="raw-cell">DIV</div>
              <div className="raw-cell raw-cell--filled">DIV</div>
              <div className="raw-cell raw-cell--yellow">DIV</div>
              <div className="raw-cell">DIV</div>
              <div className="raw-cell raw-cell--filled">DIV</div>
              <div className="raw-cell">DIV</div>
              <div className="raw-cell raw-cell--accent">DIV</div>
              <div className="raw-cell raw-cell--yellow">DIV</div>
              <div className="raw-cell">DIV</div>
              <div className="raw-cell">DIV</div>
              <div className="raw-cell raw-cell--accent">DIV</div>
              <div className="raw-cell raw-cell--filled">DIV</div>
              <div className="raw-cell raw-cell--yellow">DIV</div>
              <div className="raw-cell">DIV</div>
              <div className="raw-cell raw-cell--filled">DIV</div>
              <div className="raw-cell raw-cell--accent">DIV</div>
              <div className="raw-cell">DIV</div>
              <div className="raw-cell raw-cell--filled">DIV</div>
              <div className="raw-cell">DIV</div>
              <div className="raw-cell raw-cell--yellow">DIV</div>
              <div className="raw-cell raw-cell--filled">DIV</div>
            </div>
            {/* ── INFO PANELS ── */}
            <div className="panels-row">
              <article className="panel" data-lang="en">
                <span className="panel__num">01</span>
                Keep backgrounds flat. Create contrast through borders, text weight, and raw structure. No decoration.
              </article>
              <article className="panel" data-lang="ko" hidden>
                <span className="panel__num">01</span>
                배경은 평면으로 둡니다. 대비는 테두리와 텍스트 굵기, 날것의 구조로 만듭니다. 장식은 쓰지 않습니다.
              </article>
              <article className="panel" data-lang="ja" hidden>
                <span className="panel__num">01</span>
                背景はフラットに。ボーダー、テキストウェイト、生の構造でコントラストを作る。装飾なし。
              </article>
              <article className="panel" data-lang="en">
                <span className="panel__num">02</span>
                Alignment and division over spacing. The grid itself is visible — columns, gutters, borders are the design language.
              </article>
              <article className="panel" data-lang="ko" hidden>
                <span className="panel__num">02</span>
                여백보다 정렬과 분할이 먼저입니다. 그리드 자체가 보입니다. 컬럼과 거터, 테두리가 디자인 언어입니다.
              </article>
              <article className="panel" data-lang="ja" hidden>
                <span className="panel__num">02</span>
                間隔より整列と分割。グリッド自体が見える — カラム、ガター、ボーダーがデザイン言語だ。
              </article>
              <article className="panel" data-lang="en">
                <span className="panel__num">03</span>
                Buttons and elements are solid-color blocks with thick borders. Every component declares its own boundaries.
              </article>
              <article className="panel" data-lang="ko" hidden>
                <span className="panel__num">03</span>
                버튼과 요소는 굵은 테두리를 두른 단색 블록입니다. 컴포넌트마다 자신의 경계를 분명히 드러냅니다.
              </article>
              <article className="panel" data-lang="ja" hidden>
                <span className="panel__num">03</span>
                ボタンと要素は太いボーダーの単色ブロック。すべてのコンポーネントが自身の境界を宣言する。
              </article>
            </div>
          </section>
          {/* ════════ DEMO SECTION END ════════ */}
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Brutalist Grid style — experimental product showcase with raw structure and high-contrast blocks.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #e6e6e1{"\n"}--ink: #111{"\n"}--red: #d72600{"\n"}--yellow: #ffd12f{"\n"}--panel-bg: #fff{"\n"}--side-bg: var(--yellow){"\n"}No other colors. Background is flat var(--bg). No gradients on backgrounds.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Heading: 'Archivo Black' 400 (single weight), uppercase, tracking -0.01em{"\n"}Body: 'IBM Plex Mono' 400 / 500 / 700{"\n"}Scale: clamp(2rem, 5.4vw, 4.2rem) for h1{"\n"}Heading line-height: 0.95{"\n"}Body line-height: 1.65{"\n"}Hero paragraph max-width: 560px{"\n"}{"\n"}UI:{"\n"}Grid container: 12-column grid, 3px solid var(--ink) outer border{"\n"}Hero: grid-column span 8, border-right 3px solid var(--ink), border-bottom 3px solid var(--ink), padding clamp(18px, 3.5vw, 36px), background #fff{"\n"}Sidebar: grid-column span 4, border-bottom 3px solid var(--ink), padding 18px, background var(--yellow){"\n"}Stats: border-top 2px solid var(--ink), padding-top 10px, margin-top 10px, font-weight 700{"\n"}Panels: grid-column span 4, border-right 3px solid var(--ink), padding 16px, background #fff (last panel border-right 0){"\n"}Buttons: 2px solid var(--ink), background var(--red), color #fff, padding 7px 12px, font-family inherit, no border-radius{"\n"}{"\n"}LAYOUT:{"\n"}Content max-width: min(1160px, 94vw){"\n"}Page padding: 20px 0 70px{"\n"}Grid: 12-column, hero 8col + side 4col row, then 3 equal panels row{"\n"}No gap between grid cells — borders serve as dividers{"\n"}{"\n"}MOTION:{"\n"}Entrance: translateX(-8px) → 0, opacity 0 → 1, 550ms steps(2, end), stagger 120ms per panel{"\n"}Hover: none — static interface{"\n"}No scroll-triggered animations. Respect prefers-reduced-motion.{"\n"}{"\n"}RESPONSIVE:{"\n"}850px: All grid items → span 12, border-right removed, single column stack{"\n"}1160px: Full 12-column grid, 8+4 hero split, 3-panel row{"\n"}{"\n"}FORBIDDEN:{"\n"}- Horizontal scroll at any viewport{"\n"}- Smooth gradients, glows, or soft shadows{"\n"}- Rounded corners (border-radius) on any element{"\n"}- Pastel tones or low-contrast color combinations{"\n"}- Decorative imagery or illustrations{"\n"}- Smooth easing functions — use steps() only{"\n"}{"\n"}OUTPUT:{"\n"}1) Color + typography tokens as CSS custom properties{"\n"}2) Component structure: 12-col grid with Hero (8col), Sidebar (4col), Info panels (3x 4col){"\n"}3) Semantic HTML + CSS with responsive support</pre>
            <pre data-lang="ko" hidden>Brutalist Grid 스타일의 랜딩 페이지를 설계해줘 — 날것의 구조와 고대비 블록으로 구성하는 실험적 제품 쇼케이스.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #e6e6e1{"\n"}--ink: #111{"\n"}--red: #d72600{"\n"}--yellow: #ffd12f{"\n"}--panel-bg: #fff{"\n"}--side-bg: var(--yellow){"\n"}다른 색상 사용 금지. 배경은 플랫한 var(--bg). 배경에 그라데이션 없음.{"\n"}{"\n"}타이포그래피:{"\n"}제목: 'Archivo Black' 400 (단일 웨이트), uppercase, tracking -0.01em{"\n"}본문: 'IBM Plex Mono' 400 / 500 / 700{"\n"}스케일: h1은 clamp(2rem, 5.4vw, 4.2rem){"\n"}제목 line-height: 0.95{"\n"}본문 line-height: 1.65{"\n"}히어로 문단 max-width: 560px{"\n"}{"\n"}UI:{"\n"}그리드 컨테이너: 12컬럼 그리드, 3px solid var(--ink) 외곽 테두리{"\n"}히어로: grid-column span 8, border-right 3px solid var(--ink), border-bottom 3px solid var(--ink), padding clamp(18px, 3.5vw, 36px), background #fff{"\n"}사이드바: grid-column span 4, border-bottom 3px solid var(--ink), padding 18px, background var(--yellow){"\n"}스탯: border-top 2px solid var(--ink), padding-top 10px, margin-top 10px, font-weight 700{"\n"}패널: grid-column span 4, border-right 3px solid var(--ink), padding 16px, background #fff (마지막 패널 border-right 0){"\n"}버튼: 2px solid var(--ink), background var(--red), color #fff, padding 7px 12px, font-family inherit, border-radius 없음{"\n"}{"\n"}레이아웃:{"\n"}콘텐츠 max-width: min(1160px, 94vw){"\n"}페이지 padding: 20px 0 70px{"\n"}그리드: 12컬럼, 히어로 8col + 사이드 4col 행, 이어서 패널 3개 균등 행{"\n"}셀 간 gap 없음 — 테두리가 구분선 역할{"\n"}{"\n"}모션:{"\n"}등장: translateX(-8px) → 0, opacity 0 → 1, 550ms steps(2, end), 패널당 120ms 스태거{"\n"}호버: 없음 — 정적 인터페이스{"\n"}스크롤 트리거 애니메이션 없음. prefers-reduced-motion 준수.{"\n"}{"\n"}반응형:{"\n"}850px: 모든 그리드 항목 → span 12, border-right 제거, 단일 열 스택{"\n"}1160px: 전체 12컬럼 그리드, 8+4 히어로 분할, 패널 3열{"\n"}{"\n"}금지사항:{"\n"}- 어떤 뷰포트에서든 가로 스크롤{"\n"}- 부드러운 그라데이션, 글로우, 소프트 섀도우{"\n"}- 어떤 요소에도 둥근 코너(border-radius){"\n"}- 파스텔 톤 또는 저대비 색상 조합{"\n"}- 장식적 이미지나 일러스트{"\n"}- 부드러운 이징 함수 — steps()만 사용{"\n"}{"\n"}출력:{"\n"}1) 색상 + 타이포그래피 토큰을 CSS 커스텀 프로퍼티로{"\n"}2) 컴포넌트 구조: 히어로(8col), 사이드바(4col), 정보 패널(3x 4col)의 12컬럼 그리드{"\n"}3) 반응형 대응이 포함된 시맨틱 HTML + CSS</pre>
            <pre data-lang="ja" hidden>Brutalist Gridスタイルのランディングページを設計してください — 生の構造と高コントラストブロックで構成する実験的な製品ショーケース。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #e6e6e1{"\n"}--ink: #111{"\n"}--red: #d72600{"\n"}--yellow: #ffd12f{"\n"}--panel-bg: #fff{"\n"}--side-bg: var(--yellow){"\n"}他の色は使用禁止。背景はフラットなvar(--bg)。背景にグラデーションなし。{"\n"}{"\n"}タイポグラフィ:{"\n"}見出し: 'Archivo Black' 400（単一ウェイト）, uppercase, tracking -0.01em{"\n"}本文: 'IBM Plex Mono' 400 / 500 / 700{"\n"}スケール: h1はclamp(2rem, 5.4vw, 4.2rem){"\n"}見出しline-height: 0.95{"\n"}本文line-height: 1.65{"\n"}ヒーロー段落max-width: 560px{"\n"}{"\n"}UI:{"\n"}グリッドコンテナ: 12カラムグリッド、3px solid var(--ink)外枠ボーダー{"\n"}ヒーロー: grid-column span 8, border-right 3px solid var(--ink), border-bottom 3px solid var(--ink), padding clamp(18px, 3.5vw, 36px), background #fff{"\n"}サイドバー: grid-column span 4, border-bottom 3px solid var(--ink), padding 18px, background var(--yellow){"\n"}スタッツ: border-top 2px solid var(--ink), padding-top 10px, margin-top 10px, font-weight 700{"\n"}パネル: grid-column span 4, border-right 3px solid var(--ink), padding 16px, background #fff（最後のパネルborder-right 0）{"\n"}ボタン: 2px solid var(--ink), background var(--red), color #fff, padding 7px 12px, font-family inherit, border-radiusなし{"\n"}{"\n"}レイアウト:{"\n"}コンテンツmax-width: min(1160px, 94vw){"\n"}ページpadding: 20px 0 70px{"\n"}グリッド: 12カラム、ヒーロー8col + サイド4colの行、続いてパネル3つの均等行{"\n"}セル間のgapなし — ボーダーがディバイダーの役割{"\n"}{"\n"}モーション:{"\n"}登場: translateX(-8px) → 0, opacity 0 → 1, 550ms steps(2, end), パネルごとに120msスタガー{"\n"}ホバー: なし — 静的インターフェース{"\n"}スクロールトリガーのアニメーションなし。prefers-reduced-motionを尊重。{"\n"}{"\n"}レスポンシブ:{"\n"}850px: 全グリッドアイテム → span 12, border-right削除、単一カラムスタック{"\n"}1160px: フル12カラムグリッド、8+4ヒーロー分割、パネル3列{"\n"}{"\n"}禁止事項:{"\n"}- いかなるビューポートでも横スクロール{"\n"}- 滑らかなグラデーション、グロー、ソフトシャドウ{"\n"}- いかなる要素にも角丸（border-radius）{"\n"}- パステルトーンや低コントラストの色組み合わせ{"\n"}- 装飾的な画像やイラスト{"\n"}- 滑らかなイージング関数 — steps()のみ使用{"\n"}{"\n"}出力:{"\n"}1) カラー＋タイポグラフィトークンをCSSカスタムプロパティとして{"\n"}2) コンポーネント構造: ヒーロー（8col）、サイドバー（4col）、情報パネル（3x 4col）の12カラムグリッド{"\n"}3) レスポンシブ対応を含むセマンティックHTML + CSS</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/prompt-tips"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Prompt Tips — Web Stylebook</span></a><div className="page-nav__divider" /><a href="/pages/editorial-silence.html"><span><span className="page-nav__label">다음</span>Editorial Silence</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
