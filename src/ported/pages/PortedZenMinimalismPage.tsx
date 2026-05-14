import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedZenMinimalismPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--zen-minimalism">
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
              <button className="theme-toggle" id="global-theme-reset" aria-label="Reset Global Theme" data-color="Reset Global Theme" title="Reset Global Theme">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
        <div className="zen-demo" id="main-content">
          {/* Hero */}
          <div className="zen-hero">
            <h1 className="zen-hero__title"><i>Less,</i> Precisely.</h1>
            <p className="zen-hero__desc" data-lang="en">
              Zen minimalism is not absence — it is deliberate restraint. Every margin, every weight, every tone is chosen to direct attention to a single focal point. The design disappears so the content can breathe.
            </p>
            <p className="zen-hero__desc" data-lang="ko" hidden>
              젠 미니멀리즘은 부재가 아닌 의도적 절제입니다. 모든 여백, 모든 굵기, 모든 색조는 하나의 초점으로 시선을 이끌기 위해 선택됩니다. 콘텐츠가 숨 쉴 수 있도록 디자인은 사라집니다.
            </p>
            <p className="zen-hero__desc" data-lang="ja" hidden>
              禅ミニマリズムは不在ではなく、意図的な抑制です。すべての余白、すべてのウェイト、すべてのトーンは、一つの焦点に注意を向けるために選ばれます。コンテンツが呼吸できるよう、デザインは消えます。
            </p>
          </div>
          <div className="zen-line" />
          <div className="zen-spacer" />
          {/* Spacing Anatomy */}
          <section className="spacing-anatomy">
            <div className="zen-label" data-lang="en">Spacing Anatomy</div>
            <div className="zen-label" data-lang="ko" hidden>여백 해부학</div>
            <div className="zen-label" data-lang="ja" hidden>余白の解剖学</div>
            <div className="spacing-rows">
              <div className="spacing-row">
                <div className="spacing-row__label">Micro</div>
                <div className="spacing-row__bar"><div className="spacing-bar" style={{width: '8%'}} /></div>
                <div className="spacing-row__value">4–8 px</div>
              </div>
              <div className="spacing-row">
                <div className="spacing-row__label">Element</div>
                <div className="spacing-row__bar"><div className="spacing-bar" style={{width: '20%'}} /></div>
                <div className="spacing-row__value">16–28 px</div>
              </div>
              <div className="spacing-row">
                <div className="spacing-row__label">Section</div>
                <div className="spacing-row__bar"><div className="spacing-bar" style={{width: '45%'}} /></div>
                <div className="spacing-row__value">48–80 px</div>
              </div>
              <div className="spacing-row">
                <div className="spacing-row__label">Ma (間)</div>
                <div className="spacing-row__bar"><div className="spacing-bar" style={{width: '80%'}} /></div>
                <div className="spacing-row__value">10–14 vh</div>
              </div>
            </div>
          </section>
          <hr className="zen-rule" />
          <div className="zen-spacer" />
          {/* Type Scale */}
          <section className="type-scale">
            <div className="zen-label" data-lang="en">Type Scale — Cormorant Garamond 300</div>
            <div className="zen-label" data-lang="ko" hidden>타입 스케일 — Cormorant Garamond 300</div>
            <div className="zen-label" data-lang="ja" hidden>タイプスケール — Cormorant Garamond 300</div>
            <div className="type-specimen">
              <div className="type-specimen__sample" style={{fontSize: 'clamp(2.4rem,5vw,3.6rem)'}}>Display</div>
              <div className="type-specimen__meta">clamp(2.4rem, 5vw, 3.6rem)<br />weight 300 · lh 1.1</div>
            </div>
            <div className="type-specimen">
              <div className="type-specimen__sample" style={{fontSize: '1.6rem'}}>Section Title</div>
              <div className="type-specimen__meta">1.6 rem<br />weight 300 · lh 1.3</div>
            </div>
            <div className="type-specimen">
              <div className="type-specimen__sample" style={{fontSize: '1.1rem', fontStyle: 'italic', color: '#555'}}>Emphasis Text</div>
              <div className="type-specimen__meta">1.1 rem italic<br />weight 300 · lh 1.8</div>
            </div>
            <div className="type-specimen">
              <div className="type-specimen__sample" style={{fontSize: '0.88rem', fontFamily: '"Noto Sans KR",sans-serif', color: '#555'}}>Body text — Noto Sans 300</div>
              <div className="type-specimen__meta">0.88 rem<br />weight 300 · lh 1.9</div>
            </div>
            <div className="type-specimen">
              <div className="type-specimen__sample" style={{fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#666'}}>Label / Caption</div>
              <div className="type-specimen__meta">0.72 rem uppercase<br />tracking 0.15em</div>
            </div>
          </section>
          <hr className="zen-rule" />
          <div className="zen-spacer" />
          {/* Palette */}
          <section className="zen-palette">
            <div className="zen-label" data-lang="en">Palette — Three Tones Only</div>
            <div className="zen-label" data-lang="ko" hidden>팔레트 — 오직 세 가지 톤</div>
            <div className="zen-label" data-lang="ja" hidden>パレット — 三つのトーンのみ</div>
            <div className="palette-swatches">
              <div className="palette-swatch">
                <div className="palette-swatch__color" style={{background: '#2c2c2a'}} />
                <span className="palette-swatch__name">Ink</span>
                <span className="palette-swatch__hex">#2c2c2a</span>
              </div>
              <div className="palette-swatch">
                <div className="palette-swatch__color" style={{background: '#999'}} />
                <span className="palette-swatch__name">Stone</span>
                <span className="palette-swatch__hex">#999999</span>
              </div>
              <div className="palette-swatch">
                <div className="palette-swatch__color" style={{background: '#faf9f7', border: '2px solid #aaa'}} />
                <span className="palette-swatch__name">Paper</span>
                <span className="palette-swatch__hex">#faf9f7</span>
              </div>
            </div>
          </section>
          <hr className="zen-rule" />
          <div className="zen-spacer" />
          {/* Whitespace Demo */}
          <section className="ws-demo">
            <div className="zen-label" data-lang="en">Whitespace Ratio — ~70% Negative Space</div>
            <div className="zen-label" data-lang="ko" hidden>여백 비율 — ~70% 네거티브 스페이스</div>
            <div className="zen-label" data-lang="ja" hidden>余白比率 — 〜70%ネガティブスペース</div>
            <div className="ws-box">
              <span className="ws-box__marker ws-box__marker--top">60 px</span>
              <span className="ws-box__marker ws-box__marker--bottom">60 px</span>
              <span className="ws-box__marker ws-box__marker--left">48 px</span>
              <span className="ws-box__marker ws-box__marker--right">48 px</span>
              <div className="ws-box__guide ws-box__guide--h" style={{top: 60}} />
              <div className="ws-box__guide ws-box__guide--h" style={{bottom: 60}} />
              <div className="ws-box__guide ws-box__guide--v" style={{left: 48}} />
              <div className="ws-box__guide ws-box__guide--v" style={{right: 48}} />
              <div className="ws-box__content">
                <span data-lang="en">Content lives here — surrounded by intentional emptiness</span>
                <span data-lang="ko" hidden>콘텐츠는 여기에 — 의도적 비움으로 둘러싸여</span>
                <span data-lang="ja" hidden>コンテンツはここに — 意図的な空白に囲まれて</span>
              </div>
            </div>
          </section>
          <hr className="zen-rule" />
          <div className="zen-spacer" />
          {/* Design Constraints */}
          <section className="zen-constraints">
            <div className="zen-label" data-lang="en">Design Constraints</div>
            <div className="zen-label" data-lang="ko" hidden>디자인 제약 조건</div>
            <div className="zen-label" data-lang="ja" hidden>デザイン制約</div>
            <div className="constraint">
              <span className="constraint__num">01</span>
              <span className="constraint__text" data-lang="en">Single column only. Max-width 800px. Center-aligned. No grids, no sidebars.</span>
              <span className="constraint__text" data-lang="ko" hidden>단일 컬럼만 사용. 최대 너비 800px. 중앙 정렬. 그리드 없음, 사이드바 없음.</span>
              <span className="constraint__text" data-lang="ja" hidden>単一カラムのみ。最大幅800px。中央揃え。グリッドなし、サイドバーなし。</span>
            </div>
            <div className="constraint">
              <span className="constraint__num">02</span>
              <span className="constraint__text" data-lang="en">Font weight 300 everywhere. Bold is forbidden — hierarchy comes from size and color alone.</span>
              <span className="constraint__text" data-lang="ko" hidden>모든 곳에서 폰트 굵기 300. 볼드 금지 — 계층 구조는 크기와 색상만으로 만든다.</span>
              <span className="constraint__text" data-lang="ja" hidden>すべてでフォントウェイト300。ボールドは禁止 — 階層はサイズと色のみで作る。</span>
            </div>
            <div className="constraint">
              <span className="constraint__num">03</span>
              <span className="constraint__text" data-lang="en">Maximum three colors. Near-black for text, mid-gray for secondary, off-white for background. No accents.</span>
              <span className="constraint__text" data-lang="ko" hidden>최대 세 가지 색상. 텍스트는 거의 검정, 보조는 중간 회색, 배경은 오프화이트. 강조색 없음.</span>
              <span className="constraint__text" data-lang="ja" hidden>最大3色。テキストにほぼ黒、セカンダリに中間グレー、背景にオフホワイト。アクセントなし。</span>
            </div>
            <div className="constraint">
              <span className="constraint__num">04</span>
              <span className="constraint__text" data-lang="en">Borders never exceed 1px. Box-shadows never exceed rgba(0,0,0,0.02). Subtle or invisible.</span>
              <span className="constraint__text" data-lang="ko" hidden>테두리는 1px를 초과하지 않는다. Box-shadow는 rgba(0,0,0,0.02)를 초과하지 않는다. 미묘하거나 보이지 않게.</span>
              <span className="constraint__text" data-lang="ja" hidden>ボーダーは1pxを超えない。Box-shadowはrgba(0,0,0,0.02)を超えない。微妙か見えないように。</span>
            </div>
            <div className="constraint">
              <span className="constraint__num">05</span>
              <span className="constraint__text" data-lang="en">Animations longer than 2 seconds. Ease-in only. No bounce, no spring, no parallax. Motion should feel like breathing.</span>
              <span className="constraint__text" data-lang="ko" hidden>애니메이션은 2초 이상. Ease-in만 사용. 바운스, 스프링, 패럴랙스 없음. 모션은 호흡처럼 느껴져야 한다.</span>
              <span className="constraint__text" data-lang="ja" hidden>アニメーションは2秒以上。Ease-inのみ。バウンス、スプリング、パララックスなし。モーションは呼吸のように感じるべき。</span>
            </div>
            <div className="constraint">
              <span className="constraint__num">06</span>
              <span className="constraint__text" data-lang="en">If an element can be removed without losing meaning, remove it. Every pixel of emptiness is a design decision.</span>
              <span className="constraint__text" data-lang="ko" hidden>의미를 잃지 않고 제거할 수 있는 요소는 제거한다. 비어 있는 모든 픽셀이 디자인 결정이다.</span>
              <span className="constraint__text" data-lang="ja" hidden>意味を失わずに削除できる要素は削除する。空白のすべてのピクセルがデザインの決定である。</span>
            </div>
          </section>
          <div className="zen-spacer" />
          {/* Summary */}
          <div className="zen-summary">
            <p className="zen-summary__text" data-lang="en">
              The space between elements is not empty — it is the design itself.
            </p>
            <p className="zen-summary__text" data-lang="ko" hidden>
              요소 사이의 공간은 비어 있는 것이 아니라 — 그 자체가 디자인이다.
            </p>
            <p className="zen-summary__text" data-lang="ja" hidden>
              要素間の空間は空ではない — それ自体がデザインである。
            </p>
          </div>
          <div className="zen-spacer" />
          <div className="prompt-box">
            <pre data-lang="en">Design a landing page in Zen Minimalism style — deliberate restraint where whitespace and typography hierarchy ARE the design.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #faf9f7{"\n"}--text: #1a1a18{"\n"}--text-secondary: #444444{"\n"}--text-tertiary: #555555{"\n"}--label: #444444{"\n"}--meta: #555555{"\n"}--divider: #dddddd{"\n"}--border: #cccccc{"\n"}--guide: #cccccc{"\n"}Maximum 3 tones: near-black, mid-gray, off-white. No accent colors.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Display: Cormorant Garamond 300, clamp(2.6rem, 5.5vw, 4.8rem), lh 1.1, italic for emphasis{"\n"}Section title: Cormorant Garamond 300, 1.6rem, lh 1.3{"\n"}Labels: Cormorant Garamond 400, 0.78rem, uppercase, tracking 0.18em{"\n"}Body: Noto Sans KR 300, 0.88-0.95rem, lh 1.9{"\n"}Meta: 0.72rem, weight 300{"\n"}-webkit-font-smoothing: antialiased on body{"\n"}Bold is forbidden — hierarchy from size and color only.{"\n"}{"\n"}DEMO STRUCTURE:{"\n"}1) Hero: centered title + design philosophy paragraph{"\n"}2) Spacing Anatomy: 4 horizontal bars showing spacing scale (Micro 4-8px → Ma 10-14vh){"\n"}3) Type Scale: 5 specimens (Display → Label) with size/weight/lh metadata{"\n"}4) Palette: 3 circular swatches (Ink #1a1a18, Stone #999, Paper #faf9f7) with labels{"\n"}5) Whitespace Demo: box with visible margin guides showing 70% negative space ratio{"\n"}6) Design Constraints: 6 numbered rules (single column, weight 300 only, max 3 colors, 1px borders, slow animations, remove what you can){"\n"}{"\n"}UI:{"\n"}- Section labels: 0.78rem uppercase, tracking 0.18em, color #444{"\n"}- Rows: border-top 1px solid #ddd, padding 16-20px 0{"\n"}- Spacing bars: height 2px, background #1a1a18, opacity 0.4 (hover 0.7){"\n"}- Constraint numbers: Cormorant Garamond 300, 1.4rem, color #555{"\n"}- Whitespace box: border 1px solid #ccc, guide lines #ccc, margin labels 0.6rem color #555{"\n"}- Divider: 1px wide, 80px tall, gradient transparent→#aaa→transparent{"\n"}- Button: background none, border 1px solid #1a1a18, padding 12px 30px{"\n"}- Button hover: background #1a1a18, color #fff, transition 0.3s{"\n"}{"\n"}LAYOUT:{"\n"}Container: max-width 860px, margin 0 auto, padding 60px 40px{"\n"}All content single-column, center-aligned. ~70% whitespace ratio.{"\n"}Sections separated by 6vh spacers and 1px horizontal rules.{"\n"}{"\n"}MOTION:{"\n"}Entrance: fade from opacity 0 translateY(10px), 2s ease-in{"\n"}Spacing bars: opacity transition 0.6s on hover{"\n"}No scroll animations, no parallax, no bounce effects.{"\n"}{"\n"}RESPONSIVE:{"\n"}- Mobile: padding 40px 20px, type specimens stack vertically, palette gap shrinks{"\n"}- Desktop: max-width 860px centered, side-by-side specimens{"\n"}{"\n"}FORBIDDEN:{"\n"}- Font weight above 300 (except labels at 400){"\n"}- More than 3 colors / any accent or saturated color{"\n"}- Multi-column grids or complex layouts{"\n"}- Fast animations or bounce/spring easing{"\n"}- Borders thicker than 1px / box-shadows stronger than rgba(0,0,0,0.02){"\n"}- Icons, illustrations, or photographic imagery{"\n"}{"\n"}OUTPUT:{"\n"}1) Color tokens + typography scale with weights and line-heights{"\n"}2) Hero / Spacing Anatomy / Type Scale / Palette / Whitespace Demo / Design Constraints vertical structure{"\n"}3) Single-file HTML/CSS with zen aesthetic and visible design specifications</pre>
            <pre data-lang="ko" hidden>젠 미니멀리즘 스타일의 랜딩 페이지를 디자인해줘 — 여백과 타이포그래피 계층 구조 자체가 디자인인 의도적 절제.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #faf9f7{"\n"}--text: #1a1a18{"\n"}--text-secondary: #444444{"\n"}--text-tertiary: #555555{"\n"}--label: #444444{"\n"}--meta: #555555{"\n"}--divider: #dddddd{"\n"}--border: #cccccc{"\n"}--guide: #cccccc{"\n"}최대 3톤: 거의 검정, 중간 회색, 오프화이트. 강조색 없음.{"\n"}{"\n"}타이포그래피:{"\n"}디스플레이: Cormorant Garamond 300, clamp(2.6rem, 5.5vw, 4.8rem), lh 1.1, 강조에 italic{"\n"}섹션 타이틀: Cormorant Garamond 300, 1.6rem, lh 1.3{"\n"}라벨: Cormorant Garamond 400, 0.78rem, uppercase, tracking 0.18em{"\n"}본문: Noto Sans KR 300, 0.88-0.95rem, lh 1.9{"\n"}메타: 0.72rem, weight 300{"\n"}body에 -webkit-font-smoothing: antialiased{"\n"}볼드 금지 — 계층 구조는 크기와 색상만으로.{"\n"}{"\n"}데모 구조:{"\n"}1) 히어로: 중앙 타이틀 + 디자인 철학 문단{"\n"}2) 여백 해부학: 4개 수평 바로 여백 스케일 표시 (Micro 4-8px → Ma 10-14vh){"\n"}3) 타입 스케일: 5개 샘플 (Display → Label), 크기/굵기/행간 메타데이터 포함{"\n"}4) 팔레트: 3개 원형 스와치 (Ink #1a1a18, Stone #999, Paper #faf9f7) + 라벨{"\n"}5) 여백 데모: 가시적 마진 가이드로 70% 네거티브 스페이스 비율 표시{"\n"}6) 디자인 제약 조건: 6개 번호 규칙 (단일 컬럼, weight 300만, 최대 3색, 1px 테두리, 느린 애니메이션, 제거 가능한 건 제거){"\n"}{"\n"}UI:{"\n"}- 섹션 라벨: 0.78rem uppercase, tracking 0.18em, color #444{"\n"}- 행: border-top 1px solid #ddd, padding 16-20px 0{"\n"}- 여백 바: height 2px, background #1a1a18, opacity 0.4 (호버 시 0.7){"\n"}- 제약 번호: Cormorant Garamond 300, 1.4rem, color #555{"\n"}- 여백 박스: border 1px solid #ccc, 가이드 라인 #ccc, 마진 라벨 0.6rem color #555{"\n"}- 구분선: 1px 너비, 80px 높이, gradient transparent→#aaa→transparent{"\n"}- 버튼: background none, border 1px solid #1a1a18, padding 12px 30px{"\n"}- 버튼 호버: background #1a1a18, color #fff, transition 0.3s{"\n"}{"\n"}레이아웃:{"\n"}컨테이너: max-width 860px, margin 0 auto, padding 60px 40px{"\n"}모든 콘텐츠 단일 컬럼, 중앙 정렬. ~70% 여백 비율.{"\n"}섹션 간 6vh 스페이서와 1px 수평선으로 구분.{"\n"}{"\n"}모션:{"\n"}등장: fade from opacity 0 translateY(10px), 2s ease-in{"\n"}여백 바: 호버 시 opacity transition 0.6s{"\n"}스크롤 애니메이션 없음, 패럴랙스 없음, 바운스 효과 없음.{"\n"}{"\n"}반응형:{"\n"}- 모바일: padding 40px 20px, 타입 샘플 세로 스택, 팔레트 간격 축소{"\n"}- 데스크톱: max-width 860px 중앙 정렬, 가로 배치 샘플{"\n"}{"\n"}금지사항:{"\n"}- font-weight 300 초과 (라벨의 400 제외){"\n"}- 3색 초과 / 강조색이나 채도 높은 색상{"\n"}- 다열 그리드나 복잡한 레이아웃{"\n"}- 빠른 애니메이션이나 bounce/spring 이징{"\n"}- 1px 초과 테두리 / rgba(0,0,0,0.02) 초과 box-shadow{"\n"}- 아이콘, 일러스트, 사진 이미지{"\n"}{"\n"}출력:{"\n"}1) 색상 토큰 + weight·line-height 포함 타이포그래피 스케일{"\n"}2) 히어로 / 여백 해부학 / 타입 스케일 / 팔레트 / 여백 데모 / 디자인 제약 수직 구조{"\n"}3) 젠 미학과 가시적 디자인 사양이 포함된 단일 파일 HTML/CSS</pre>
            <pre data-lang="ja" hidden>ゼンミニマリズムスタイルのランディングページをデザインしてください — 余白とタイポグラフィの階層構造そのものがデザインである意図的な抑制。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #faf9f7{"\n"}--text: #1a1a18{"\n"}--text-secondary: #444444{"\n"}--text-tertiary: #555555{"\n"}--label: #444444{"\n"}--meta: #555555{"\n"}--divider: #dddddd{"\n"}--border: #cccccc{"\n"}--guide: #cccccc{"\n"}最大3トーン：ほぼ黒、中間グレー、オフホワイト。アクセントカラーなし。{"\n"}{"\n"}タイポグラフィ:{"\n"}ディスプレイ: Cormorant Garamond 300, clamp(2.6rem, 5.5vw, 4.8rem), lh 1.1, 強調にitalic{"\n"}セクションタイトル: Cormorant Garamond 300, 1.6rem, lh 1.3{"\n"}ラベル: Cormorant Garamond 400, 0.78rem, uppercase, tracking 0.18em{"\n"}本文: Noto Sans KR 300, 0.88-0.95rem, lh 1.9{"\n"}メタ: 0.72rem, weight 300{"\n"}bodyに -webkit-font-smoothing: antialiased{"\n"}ボールド禁止 — 階層はサイズと色のみで。{"\n"}{"\n"}デモ構造:{"\n"}1) ヒーロー: 中央タイトル + デザイン哲学の段落{"\n"}2) 余白の解剖学: 4つの水平バーで余白スケール表示 (Micro 4-8px → Ma 10-14vh){"\n"}3) タイプスケール: 5つのサンプル (Display → Label)、サイズ/ウェイト/行間メタデータ付き{"\n"}4) パレット: 3つの円形スウォッチ (Ink #1a1a18, Stone #999, Paper #faf9f7) + ラベル{"\n"}5) 余白デモ: 可視マージンガイドで70%ネガティブスペース比率を表示{"\n"}6) デザイン制約: 6つの番号付きルール（単一カラム、weight 300のみ、最大3色、1pxボーダー、遅いアニメーション、削除できるものは削除）{"\n"}{"\n"}UI:{"\n"}- セクションラベル: 0.78rem uppercase, tracking 0.18em, color #444{"\n"}- 行: border-top 1px solid #ddd, padding 16-20px 0{"\n"}- 余白バー: height 2px, background #1a1a18, opacity 0.4 (ホバー時 0.7){"\n"}- 制約番号: Cormorant Garamond 300, 1.4rem, color #555{"\n"}- 余白ボックス: border 1px solid #ccc, ガイドライン #ccc, マージンラベル 0.6rem color #555{"\n"}- 区切り線: 1px幅, 80px高さ, gradient transparent→#aaa→transparent{"\n"}- ボタン: background none, border 1px solid #1a1a18, padding 12px 30px{"\n"}- ボタンホバー: background #1a1a18, color #fff, transition 0.3s{"\n"}{"\n"}レイアウト:{"\n"}コンテナ: max-width 860px, margin 0 auto, padding 60px 40px{"\n"}全コンテンツ単一カラム、中央揃え。〜70%の余白比率。{"\n"}セクション間は6vhスペーサーと1px水平線で区切り。{"\n"}{"\n"}モーション:{"\n"}登場: fade from opacity 0 translateY(10px), 2s ease-in{"\n"}余白バー: ホバー時 opacity transition 0.6s{"\n"}スクロールアニメーションなし、パララックスなし、バウンス効果なし。{"\n"}{"\n"}レスポンシブ:{"\n"}- モバイル: padding 40px 20px, タイプサンプルは縦スタック、パレット間隔縮小{"\n"}- デスクトップ: max-width 860px中央揃え、横並びサンプル{"\n"}{"\n"}禁止事項:{"\n"}- font-weight 300超過（ラベルの400を除く）{"\n"}- 3色超過 / アクセントや彩度の高い色{"\n"}- 多段グリッドや複雑なレイアウト{"\n"}- 速いアニメーションやbounce/springイージング{"\n"}- 1px超過ボーダー / rgba(0,0,0,0.02)超過のbox-shadow{"\n"}- アイコン、イラスト、写真画像{"\n"}{"\n"}出力:{"\n"}1) カラートークン + weight・line-height付きタイポグラフィスケール{"\n"}2) ヒーロー / 余白の解剖学 / タイプスケール / パレット / 余白デモ / デザイン制約の垂直構造{"\n"}3) 禅の美学と可視デザイン仕様を含む単一ファイルHTML/CSS</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </div>
        </div>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/aurora-gradient.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Aurora Gradient</span></a><div className="page-nav__divider" /><a href="/pages/mono-type.html"><span><span className="page-nav__label">다음</span>Mono Type</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
