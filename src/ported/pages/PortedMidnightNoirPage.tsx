import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedMidnightNoirPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--midnight-noir">
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

          {/* HERO — asymmetric 2-col, main left + colophon right */}
          <header className="mn-hero" id="main-content">
            <div className="mn-hero__main">
              <div className="mn-hero__meta">
                <span className="mn-hero__num">N° 01</span>
                <span className="mn-hero__rule" aria-hidden />
                <span className="mn-hero__cat" data-lang="en">Stylebook · Vol. II</span>
                <span className="mn-hero__cat" data-lang="ko" hidden>스타일북 · 제2권</span>
                <span className="mn-hero__cat" data-lang="ja" hidden>スタイルブック · 第二巻</span>
              </div>
              <h1 className="mn-hero__title">
                <span className="mn-hero__title-line">Midnight</span>
                <span className="mn-hero__title-line mn-hero__title-line--accent">Noir</span>
              </h1>
              <p className="mn-hero__sub" data-lang="en">A study in dark restraint — black lacquer architecture, with one note of antique champagne.</p>
              <p className="mn-hero__sub" data-lang="ko" hidden>어둠의 절제에 관한 연구 — 검은 래커의 건축 위에, 단 한 점의 앤틱 샴페인.</p>
              <p className="mn-hero__sub" data-lang="ja" hidden>闇における節制の習作 — 黒漆の建築の上に、ただ一点のアンティークシャンパン。</p>
              <footer className="mn-hero__foot">
                <span className="mn-hero__foot-item">
                  <span className="mn-hero__foot-label" data-lang="en">Edition</span>
                  <span className="mn-hero__foot-label" data-lang="ko" hidden>에디션</span>
                  <span className="mn-hero__foot-label" data-lang="ja" hidden>エディション</span>
                  <span className="mn-hero__foot-value">MMXXVI</span>
                </span>
                <span className="mn-hero__foot-item">
                  <span className="mn-hero__foot-label" data-lang="en">Pressed</span>
                  <span className="mn-hero__foot-label" data-lang="ko" hidden>인쇄</span>
                  <span className="mn-hero__foot-label" data-lang="ja" hidden>刷</span>
                  <span className="mn-hero__foot-value">042 / 500</span>
                </span>
                <span className="mn-hero__foot-item">
                  <span className="mn-hero__foot-label" data-lang="en">Gold ratio</span>
                  <span className="mn-hero__foot-label" data-lang="ko" hidden>골드 비율</span>
                  <span className="mn-hero__foot-label" data-lang="ja" hidden>金の比率</span>
                  <span className="mn-hero__foot-value">≤ 7.0%</span>
                </span>
              </footer>
            </div>
            <aside className="mn-hero__side">
              <div className="mn-hero__panel">
                <span className="mn-hero__panel-label" data-lang="en">— Contents</span>
                <span className="mn-hero__panel-label" data-lang="ko" hidden>— 목차</span>
                <span className="mn-hero__panel-label" data-lang="ja" hidden>— 目次</span>
                <ol className="mn-hero__index">
                  <li><span className="mn-hero__index-num">i</span><span data-lang="en">Manifesto</span><span data-lang="ko" hidden>선언</span><span data-lang="ja" hidden>宣言</span></li>
                  <li><span className="mn-hero__index-num">ii</span><span data-lang="en">Four Principles</span><span data-lang="ko" hidden>네 가지 원칙</span><span data-lang="ja" hidden>四つの原則</span></li>
                  <li><span className="mn-hero__index-num">iii</span><span data-lang="en">Material Palette</span><span data-lang="ko" hidden>재료의 팔레트</span><span data-lang="ja" hidden>素材のパレット</span></li>
                  <li><span className="mn-hero__index-num">iv</span><span data-lang="en">A Specimen</span><span data-lang="ko" hidden>견본</span><span data-lang="ja" hidden>標本</span></li>
                  <li><span className="mn-hero__index-num">v</span><span data-lang="en">Components</span><span data-lang="ko" hidden>컴포넌트</span><span data-lang="ja" hidden>構成要素</span></li>
                  <li><span className="mn-hero__index-num">vi</span><span data-lang="en">Notes</span><span data-lang="ko" hidden>노트</span><span data-lang="ja" hidden>ノート</span></li>
                </ol>
              </div>
              <div className="mn-hero__panel">
                <span className="mn-hero__panel-label" data-lang="en">— Colophon</span>
                <span className="mn-hero__panel-label" data-lang="ko" hidden>— 콜로폰</span>
                <span className="mn-hero__panel-label" data-lang="ja" hidden>— コロフォン</span>
                <p className="mn-hero__colophon" data-lang="en">Set in <i>Cormorant Garamond</i> and Inter. Composed for the Web Stylebook, Anno MMXXVI.</p>
                <p className="mn-hero__colophon" data-lang="ko" hidden><i>Cormorant Garamond</i>와 Inter로 조판. Web Stylebook을 위해 MMXXVI년에 구성됨.</p>
                <p className="mn-hero__colophon" data-lang="ja" hidden><i>Cormorant Garamond</i> と Inter で組版。Web Stylebook のために MMXXVI 年に構成。</p>
              </div>
            </aside>
          </header>

          {/* MANIFESTO — single italic quote, generous space */}
          <section className="mn-manifesto" aria-label="Manifesto">
            <span className="mn-manifesto__label" data-lang="en">— Manifesto</span>
            <span className="mn-manifesto__label" data-lang="ko" hidden>— 선언</span>
            <span className="mn-manifesto__label" data-lang="ja" hidden>— マニフェスト</span>
            <blockquote className="mn-manifesto__text" data-lang="en">
              Restraint is the most expensive material — and the quietest voice in the room.
            </blockquote>
            <blockquote className="mn-manifesto__text" data-lang="ko" hidden>
              절제는 가장 값비싼 재료이며, 방 안에서 가장 조용한 목소리다.
            </blockquote>
            <blockquote className="mn-manifesto__text" data-lang="ja" hidden>
              節制は最も高価な素材であり、部屋の中で最も静かな声である。
            </blockquote>
            <span className="mn-manifesto__attr" data-lang="en">On Midnight Noir · Editor's note</span>
            <span className="mn-manifesto__attr" data-lang="ko" hidden>미드나잇 누아르에 관하여 · 편집자 주</span>
            <span className="mn-manifesto__attr" data-lang="ja" hidden>ミッドナイトノワールについて · 編集後記</span>
          </section>

          {/* FOUR PRINCIPLES — editorial 2-col, no card chrome */}
          <section className="mn-principles" aria-label="Principles">
            <header className="mn-principles__head">
              <span className="mn-principles__index">II</span>
              <h2 className="mn-principles__title" data-lang="en">Four <i>Principles</i></h2>
              <h2 className="mn-principles__title" data-lang="ko" hidden>네 가지 <i>원칙</i></h2>
              <h2 className="mn-principles__title" data-lang="ja" hidden>四つの<i>原則</i></h2>
            </header>
            <div className="mn-principles__grid">
              <article className="mn-principle">
                <span className="mn-principle__num">i.</span>
                <h3 className="mn-principle__title" data-lang="en">Layered Darkness</h3>
                <h3 className="mn-principle__title" data-lang="ko" hidden>겹겹의 어둠</h3>
                <h3 className="mn-principle__title" data-lang="ja" hidden>重なる闇</h3>
                <p className="mn-principle__text" data-lang="en">
                  Three near-blacks, separated by no more than seven percent of lightness, make a depth that no single pigment ever could on its own.
                </p>
                <p className="mn-principle__text" data-lang="ko" hidden>
                  밝기 차이가 7% 이내인 거의 검은 세 톤이, 단일 색상으로는 결코 만들 수 없는 깊이를 빚어낸다.
                </p>
                <p className="mn-principle__text" data-lang="ja" hidden>
                  明度差が七パーセント以内の、ほぼ黒の三色が、単色では到達できない深さを生み出す。
                </p>
              </article>
              <article className="mn-principle">
                <span className="mn-principle__num">ii.</span>
                <h3 className="mn-principle__title" data-lang="en">A Single Voice</h3>
                <h3 className="mn-principle__title" data-lang="ko" hidden>단 하나의 목소리</h3>
                <h3 className="mn-principle__title" data-lang="ja" hidden>ただ一つの声</h3>
                <p className="mn-principle__text" data-lang="en">
                  One champagne note, used the way brass leaf appears on a couture invitation — never twice in the same room, never as decoration.
                </p>
                <p className="mn-principle__text" data-lang="ko" hidden>
                  단 하나의 샴페인 톤. 쿠튀르 초대장에 쓰인 황동 박처럼 — 같은 방에 두 번 등장하지 않으며, 결코 장식으로 쓰이지 않는다.
                </p>
                <p className="mn-principle__text" data-lang="ja" hidden>
                  ただ一つのシャンパントーン。クチュールの招待状に押された真鍮箔のように — 同じ部屋に二度は現れず、決して装飾として用いられない。
                </p>
              </article>
              <article className="mn-principle">
                <span className="mn-principle__num">iii.</span>
                <h3 className="mn-principle__title" data-lang="en">Editorial Type</h3>
                <h3 className="mn-principle__title" data-lang="ko" hidden>에디토리얼 타입</h3>
                <h3 className="mn-principle__title" data-lang="ja" hidden>エディトリアルな書体</h3>
                <p className="mn-principle__text" data-lang="en">
                  A weighted serif carries authority. A quiet grotesk carries everything else. There is no third voice.
                </p>
                <p className="mn-principle__text" data-lang="ko" hidden>
                  무게감 있는 세리프가 권위를 운반한다. 조용한 그로테스크가 그 외 모든 것을 운반한다. 세 번째 목소리는 없다.
                </p>
                <p className="mn-principle__text" data-lang="ja" hidden>
                  重みのあるセリフが権威を運ぶ。静かなグロテスクがそれ以外のすべてを運ぶ。第三の声は持たない。
                </p>
              </article>
              <article className="mn-principle">
                <span className="mn-principle__num">iv.</span>
                <h3 className="mn-principle__title" data-lang="en">Cinematic Space</h3>
                <h3 className="mn-principle__title" data-lang="ko" hidden>시네마틱 공간</h3>
                <h3 className="mn-principle__title" data-lang="ja" hidden>シネマティックな間</h3>
                <p className="mn-principle__text" data-lang="en">
                  Two-thirds of the page is intentionally empty. The tension lives in what the page chose not to fill.
                </p>
                <p className="mn-principle__text" data-lang="ko" hidden>
                  페이지의 3분의 2는 의도적으로 비어 있다. 긴장감은 페이지가 채우지 않기로 선택한 곳에 살아 있다.
                </p>
                <p className="mn-principle__text" data-lang="ja" hidden>
                  ページの三分の二は、意図的に空白である。緊張は、ページが埋めないと選んだ場所に宿る。
                </p>
              </article>
            </div>
          </section>

          {/* COLOR — slim horizontal tonal strips */}
          <section className="mn-palette" aria-label="Material palette">
            <header className="mn-palette__head">
              <span className="mn-palette__index">III</span>
              <h2 className="mn-palette__title" data-lang="en">The Material Palette</h2>
              <h2 className="mn-palette__title" data-lang="ko" hidden>재료의 팔레트</h2>
              <h2 className="mn-palette__title" data-lang="ja" hidden>素材のパレット</h2>
            </header>
            <ul className="mn-palette__list">
              <li className="mn-strip">
                <span className="mn-strip__swatch" style={{background: '#07080B'}} aria-hidden />
                <span className="mn-strip__name" data-lang="en">Vault</span>
                <span className="mn-strip__name" data-lang="ko" hidden>볼트</span>
                <span className="mn-strip__name" data-lang="ja" hidden>ヴォルト</span>
                <span className="mn-strip__role" data-lang="en">Architectural ground</span>
                <span className="mn-strip__role" data-lang="ko" hidden>건축적 바탕</span>
                <span className="mn-strip__role" data-lang="ja" hidden>建築的地</span>
                <span className="mn-strip__hex">#07080B</span>
              </li>
              <li className="mn-strip">
                <span className="mn-strip__swatch" style={{background: '#0C0E12'}} aria-hidden />
                <span className="mn-strip__name" data-lang="en">Chamber</span>
                <span className="mn-strip__name" data-lang="ko" hidden>챔버</span>
                <span className="mn-strip__name" data-lang="ja" hidden>チェンバー</span>
                <span className="mn-strip__role" data-lang="en">Primary surface</span>
                <span className="mn-strip__role" data-lang="ko" hidden>주 표면</span>
                <span className="mn-strip__role" data-lang="ja" hidden>主たる面</span>
                <span className="mn-strip__hex">#0C0E12</span>
              </li>
              <li className="mn-strip">
                <span className="mn-strip__swatch" style={{background: '#121318'}} aria-hidden />
                <span className="mn-strip__name" data-lang="en">Velvet</span>
                <span className="mn-strip__name" data-lang="ko" hidden>벨벳</span>
                <span className="mn-strip__name" data-lang="ja" hidden>ヴェルヴェット</span>
                <span className="mn-strip__role" data-lang="en">Raised surface</span>
                <span className="mn-strip__role" data-lang="ko" hidden>융기 표면</span>
                <span className="mn-strip__role" data-lang="ja" hidden>持ち上がる面</span>
                <span className="mn-strip__hex">#121318</span>
              </li>
              <li className="mn-strip">
                <span className="mn-strip__swatch" style={{background: '#17161A'}} aria-hidden />
                <span className="mn-strip__name" data-lang="en">Lacquer</span>
                <span className="mn-strip__name" data-lang="ko" hidden>래커</span>
                <span className="mn-strip__name" data-lang="ja" hidden>漆</span>
                <span className="mn-strip__role" data-lang="en">Highest plane</span>
                <span className="mn-strip__role" data-lang="ko" hidden>최상위 면</span>
                <span className="mn-strip__role" data-lang="ja" hidden>最上面</span>
                <span className="mn-strip__hex">#17161A</span>
              </li>
              <li className="mn-strip mn-strip--accent">
                <span className="mn-strip__swatch" style={{background: '#C6A15B'}} aria-hidden />
                <span className="mn-strip__name" data-lang="en">Champagne</span>
                <span className="mn-strip__name" data-lang="ko" hidden>샴페인</span>
                <span className="mn-strip__name" data-lang="ja" hidden>シャンパン</span>
                <span className="mn-strip__role" data-lang="en">The single voice</span>
                <span className="mn-strip__role" data-lang="ko" hidden>단 하나의 목소리</span>
                <span className="mn-strip__role" data-lang="ja" hidden>ただ一つの声</span>
                <span className="mn-strip__hex">#C6A15B</span>
              </li>
              <li className="mn-strip">
                <span className="mn-strip__swatch" style={{background: '#80683B'}} aria-hidden />
                <span className="mn-strip__name" data-lang="en">Foxed Gold</span>
                <span className="mn-strip__name" data-lang="ko" hidden>폭스드 골드</span>
                <span className="mn-strip__name" data-lang="ja" hidden>フォックスト・ゴールド</span>
                <span className="mn-strip__role" data-lang="en">Aged accent</span>
                <span className="mn-strip__role" data-lang="ko" hidden>세월 입은 악센트</span>
                <span className="mn-strip__role" data-lang="ja" hidden>時を経た差し色</span>
                <span className="mn-strip__hex">#80683B</span>
              </li>
              <li className="mn-strip">
                <span className="mn-strip__swatch" style={{background: '#E7E0D2'}} aria-hidden />
                <span className="mn-strip__name" data-lang="en">Ivory</span>
                <span className="mn-strip__name" data-lang="ko" hidden>아이보리</span>
                <span className="mn-strip__name" data-lang="ja" hidden>アイボリー</span>
                <span className="mn-strip__role" data-lang="en">The page reads in this</span>
                <span className="mn-strip__role" data-lang="ko" hidden>본문이 읽히는 색</span>
                <span className="mn-strip__role" data-lang="ja" hidden>本文が読まれる色</span>
                <span className="mn-strip__hex">#E7E0D2</span>
              </li>
            </ul>
          </section>

          {/* TYPE SPECIMEN — real sentences, not specs */}
          <section className="mn-type" aria-label="Type specimen">
            <header className="mn-type__head">
              <span className="mn-type__index">IV</span>
              <h2 className="mn-type__title" data-lang="en">A Specimen</h2>
              <h2 className="mn-type__title" data-lang="ko" hidden>견본</h2>
              <h2 className="mn-type__title" data-lang="ja" hidden>標本</h2>
            </header>
            <div className="mn-type__rows">
              <article className="mn-type__row">
                <p className="mn-type__display" data-lang="en">The night begins where the day refuses to end.</p>
                <p className="mn-type__display" data-lang="ko" hidden>하루가 끝나기를 거부하는 곳에서 밤은 시작된다.</p>
                <p className="mn-type__display" data-lang="ja" hidden>昼が終わることを拒む場所から、夜は始まる。</p>
                <p className="mn-type__caption">Cormorant Garamond · 600 · 0.04em</p>
              </article>
              <article className="mn-type__row">
                <p className="mn-type__lede" data-lang="en">A study in three near-blacks and a single note of antique gold — printed in the manner of a couture invitation, then quietly pressed shut.</p>
                <p className="mn-type__lede" data-lang="ko" hidden>거의 검은 세 톤과 단 하나의 앤틱 골드 — 쿠튀르 초대장처럼 인쇄되어, 조용히 봉인된다.</p>
                <p className="mn-type__lede" data-lang="ja" hidden>ほぼ黒の三色と、ただ一つのアンティークゴールド — クチュールの招待状のように刷られ、静かに封じられる。</p>
                <p className="mn-type__caption">Cormorant Garamond · 400 italic · 1.6em line</p>
              </article>
              <article className="mn-type__row">
                <p className="mn-type__body" data-lang="en">Restraint is not absence. It is the quiet evidence that every element on the page was placed there with permission — and that everything else was deliberately, generously, left out.</p>
                <p className="mn-type__body" data-lang="ko" hidden>절제는 부재가 아니다. 페이지 위의 모든 요소가 허락을 받고 자리한다는 조용한 증거이며, 그 외의 모든 것은 의도적으로, 너그럽게 비워졌다는 증거다.</p>
                <p className="mn-type__body" data-lang="ja" hidden>節制は不在ではない。ページ上のあらゆる要素が許しを得て置かれているという静かな証であり、そして残りのすべてが意図的に、寛やかに、外されているという証である。</p>
                <p className="mn-type__caption">Inter · 400 · 0.95rem · lh 1.85</p>
              </article>
              <article className="mn-type__row">
                <p className="mn-type__label" data-lang="en">Caption · Detail · Footnote</p>
                <p className="mn-type__label" data-lang="ko" hidden>캡션 · 디테일 · 각주</p>
                <p className="mn-type__label" data-lang="ja" hidden>キャプション · 細部 · 脚注</p>
                <p className="mn-type__caption">Inter · 500 · 0.62rem · 0.22em uppercase</p>
              </article>
            </div>
          </section>

          {/* COMPONENTS — quiet, four cells */}
          <section className="mn-components" aria-label="Components">
            <header className="mn-components__head">
              <span className="mn-components__index">V</span>
              <h2 className="mn-components__title" data-lang="en">Components</h2>
              <h2 className="mn-components__title" data-lang="ko" hidden>컴포넌트</h2>
              <h2 className="mn-components__title" data-lang="ja" hidden>構成要素</h2>
            </header>
            <div className="mn-components__grid">
              <article className="mn-comp">
                <span className="mn-comp__label" data-lang="en">i. Buttons</span>
                <span className="mn-comp__label" data-lang="ko" hidden>i. 버튼</span>
                <span className="mn-comp__label" data-lang="ja" hidden>i. ボタン</span>
                <div className="mn-comp__demo mn-comp__demo--buttons">
                  <button className="mn-btn mn-btn--primary" type="button">
                    <span data-lang="en">Reserve Edition</span>
                    <span data-lang="ko" hidden>에디션 예약</span>
                    <span data-lang="ja" hidden>エディションを予約</span>
                    <span className="mn-btn__arrow" aria-hidden>→</span>
                  </button>
                  <button className="mn-btn mn-btn--ghost" type="button">
                    <span data-lang="en">Browse Notebook</span>
                    <span data-lang="ko" hidden>노트북 열람</span>
                    <span data-lang="ja" hidden>ノートを見る</span>
                  </button>
                </div>
              </article>
              <article className="mn-comp">
                <span className="mn-comp__label" data-lang="en">ii. Tags</span>
                <span className="mn-comp__label" data-lang="ko" hidden>ii. 태그</span>
                <span className="mn-comp__label" data-lang="ja" hidden>ii. タグ</span>
                <div className="mn-comp__demo mn-comp__demo--tags">
                  <span className="mn-tag" data-lang="en">Editorial</span>
                  <span className="mn-tag" data-lang="ko" hidden>에디토리얼</span>
                  <span className="mn-tag" data-lang="ja" hidden>エディトリアル</span>
                  <span className="mn-tag mn-tag--accent" data-lang="en">Restraint</span>
                  <span className="mn-tag mn-tag--accent" data-lang="ko" hidden>절제</span>
                  <span className="mn-tag mn-tag--accent" data-lang="ja" hidden>節制</span>
                  <span className="mn-tag" data-lang="en">Cinematic</span>
                  <span className="mn-tag" data-lang="ko" hidden>시네마틱</span>
                  <span className="mn-tag" data-lang="ja" hidden>シネマティック</span>
                  <span className="mn-tag mn-tag--num">N° 042</span>
                </div>
              </article>
              <article className="mn-comp">
                <span className="mn-comp__label" data-lang="en">iii. Field</span>
                <span className="mn-comp__label" data-lang="ko" hidden>iii. 입력</span>
                <span className="mn-comp__label" data-lang="ja" hidden>iii. 入力</span>
                <div className="mn-comp__demo">
                  <label className="mn-field">
                    <span className="mn-field__label" data-lang="en">Correspondence</span>
                    <span className="mn-field__label" data-lang="ko" hidden>이메일 주소</span>
                    <span className="mn-field__label" data-lang="ja" hidden>メールアドレス</span>
                    <input className="mn-field__input" type="email" placeholder="name@studio.com" />
                  </label>
                </div>
              </article>
              <article className="mn-comp">
                <span className="mn-comp__label" data-lang="en">iv. Stats</span>
                <span className="mn-comp__label" data-lang="ko" hidden>iv. 지표</span>
                <span className="mn-comp__label" data-lang="ja" hidden>iv. 指標</span>
                <div className="mn-comp__demo mn-comp__demo--stats">
                  <div className="mn-stat">
                    <span className="mn-stat__value">IV</span>
                    <span className="mn-stat__label" data-lang="en">Principles</span>
                    <span className="mn-stat__label" data-lang="ko" hidden>원칙</span>
                    <span className="mn-stat__label" data-lang="ja" hidden>原則</span>
                  </div>
                  <div className="mn-stat">
                    <span className="mn-stat__value">07</span>
                    <span className="mn-stat__label" data-lang="en">Tokens</span>
                    <span className="mn-stat__label" data-lang="ko" hidden>토큰</span>
                    <span className="mn-stat__label" data-lang="ja" hidden>トークン</span>
                  </div>
                  <div className="mn-stat">
                    <span className="mn-stat__value">5<span className="mn-stat__unit">%</span></span>
                    <span className="mn-stat__label" data-lang="en">Gold</span>
                    <span className="mn-stat__label" data-lang="ko" hidden>골드</span>
                    <span className="mn-stat__label" data-lang="ja" hidden>金</span>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* CONSTRAINTS — secondary, small */}
          <section className="mn-notes" aria-label="Notes">
            <span className="mn-notes__label" data-lang="en">Notes — design constraints</span>
            <span className="mn-notes__label" data-lang="ko" hidden>노트 — 디자인 제약</span>
            <span className="mn-notes__label" data-lang="ja" hidden>ノート — デザイン上の制約</span>
            <ol className="mn-notes__list">
              <li>
                <span data-lang="en">No flat black. The ground is layered in three near-darks.</span>
                <span data-lang="ko" hidden>평면 검정 없음. 바탕은 거의 검은 세 톤으로 쌓인다.</span>
                <span data-lang="ja" hidden>フラットな黒は使わない。地はほぼ黒の三色で重ねる。</span>
              </li>
              <li>
                <span data-lang="en">No metallic gradient on display text. Hairlines and numerals only.</span>
                <span data-lang="ko" hidden>디스플레이 텍스트에 메탈릭 그라데이션 없음. 헤어라인과 숫자에만.</span>
                <span data-lang="ja" hidden>大きな文字に金属グラデーションを使わない。ヘアラインと数字のみ。</span>
              </li>
              <li>
                <span data-lang="en">No shadow. Depth is built from surface and space.</span>
                <span data-lang="ko" hidden>그림자 없음. 깊이는 표면과 여백으로 만든다.</span>
                <span data-lang="ja" hidden>影は使わない。深さは面と余白で築く。</span>
              </li>
              <li>
                <span data-lang="en">One accent — antique champagne, used as if it were brass leaf.</span>
                <span data-lang="ko" hidden>하나의 악센트 — 앤틱 샴페인. 황동 박처럼 사용한다.</span>
                <span data-lang="ja" hidden>アクセントは一つ — アンティークシャンパン。真鍮箔のように扱う。</span>
              </li>
              <li>
                <span data-lang="en">Motion is a slow rise — eight pixels, eight hundred milliseconds. Nothing bounces.</span>
                <span data-lang="ko" hidden>모션은 느린 상승 — 8픽셀, 800ms. 아무것도 튀지 않는다.</span>
                <span data-lang="ja" hidden>モーションは緩やかな上昇 — 八ピクセル、八百ミリ秒。跳ねるものは無い。</span>
              </li>
              <li>
                <span data-lang="en">Gold coverage stays beneath seven percent of any composition.</span>
                <span data-lang="ko" hidden>골드 면적은 어떤 구성에서도 전체의 7% 이하로 유지한다.</span>
                <span data-lang="ja" hidden>金の占有面積は、いかなる構成においても全体の七パーセント以下に保つ。</span>
              </li>
            </ol>
          </section>

          {/* ════════ DEMO SECTION END ════════ */}
          <section className="prompt mn-prompt" aria-label="AI brief">
            <div className="mn-prompt__head">
              <span className="mn-prompt__label" data-lang="en">— AI Brief</span>
              <span className="mn-prompt__label" data-lang="ko" hidden>— AI 브리프</span>
              <span className="mn-prompt__label" data-lang="ja" hidden>— AI ブリーフ</span>
              <h2 data-i18n="page.heading.prompt" className="mn-prompt__title">AI Request Prompt</h2>
            </div>
            <pre data-lang="en">Design a landing page in Midnight Noir — quiet luxury. Black lacquer architecture with one note of antique champagne foil.{"\n"}{"\n"}TOKENS{"\n"}--bg #07080B   --surface #0C0E12   --surface-2 #121318   --surface-3 #17161A{"\n"}--line rgba(228,207,157,.12)   --line-strong rgba(228,207,157,.22){"\n"}--gold #C6A15B   --gold-soft #D8C28A   --gold-dim #80683B{"\n"}--text #E7E0D2   --text-muted #9A9388   --text-faint #6F6A61{"\n"}{"\n"}TYPE{"\n"}Display: Cormorant Garamond 600–700, tracking 0.025–0.05em, no outline, no shadow.{"\n"}Body: Inter 400, 0.95rem, line-height 1.85, warm ivory.{"\n"}Labels: Inter 500, 0.62rem, uppercase, tracking 0.20em — gold only on numerals or short labels.{"\n"}{"\n"}LAYOUT{"\n"}Hero fills the viewport; 70% is empty. Title left-aligned, slightly off-center.{"\n"}Most of the title in ivory; one word in muted champagne — never both.{"\n"}Sections separated by space, not borders. 1px hairlines at 0.12 opacity only.{"\n"}One language is shown at a time.{"\n"}{"\n"}MATERIAL{"\n"}Surfaces are layered, not shadowed. Subtle 1% noise overlay.{"\n"}Gold appears as: tiny rules, small numerals, one or two words — total visible coverage under 7%.{"\n"}No glow, no metallic gradient on text, no ornament, no chevron, no sunburst.{"\n"}{"\n"}MOTION{"\n"}Fade and 8px rise, 800ms ease — nothing else. Respect prefers-reduced-motion.{"\n"}{"\n"}OUTPUT{"\n"}Semantic HTML, CSS custom properties, responsive layout, the lightest possible JS.{"\n"}The page must feel like a folded couture invitation — not a dark UI demo.</pre>
            <pre data-lang="ko" hidden>Midnight Noir — 조용한 럭셔리의 랜딩 페이지를 디자인해줘. 단 하나의 앤틱 샴페인 포일 위에 검은 래커의 건축.{"\n"}{"\n"}토큰{"\n"}--bg #07080B   --surface #0C0E12   --surface-2 #121318   --surface-3 #17161A{"\n"}--line rgba(228,207,157,.12)   --line-strong rgba(228,207,157,.22){"\n"}--gold #C6A15B   --gold-soft #D8C28A   --gold-dim #80683B{"\n"}--text #E7E0D2   --text-muted #9A9388   --text-faint #6F6A61{"\n"}{"\n"}타이포그래피{"\n"}디스플레이: Cormorant Garamond 600–700, tracking 0.025–0.05em. 외곽선 없음, 그림자 없음.{"\n"}본문: Inter 400, 0.95rem, line-height 1.85, 따뜻한 아이보리.{"\n"}라벨: Inter 500, 0.62rem, 대문자, tracking 0.20em — 골드는 숫자나 짧은 라벨에만.{"\n"}{"\n"}레이아웃{"\n"}히어로는 뷰포트를 가득 채우되 70%는 비운다. 타이틀은 좌측, 살짝 오프센터.{"\n"}타이틀 대부분은 아이보리, 한 단어만 절제된 샴페인. 둘 다 쓰지 않는다.{"\n"}섹션은 테두리가 아니라 여백으로 나뉜다. 1px 헤어라인은 0.12 투명도로만.{"\n"}한 번에 한 언어만 표시한다.{"\n"}{"\n"}머티리얼{"\n"}표면은 그림자가 아니라 레이어링으로 깊이를 만든다. 1% 노이즈 오버레이.{"\n"}골드는 다음에만 등장: 가는 룰, 작은 숫자, 한두 단어 — 가시 면적 총합 7% 미만.{"\n"}글로우 없음, 텍스트에 메탈릭 그라데이션 없음, 장식 없음, 쉐브론·선버스트 없음.{"\n"}{"\n"}모션{"\n"}페이드 + 8px 상승, 800ms ease — 그 외 없음. prefers-reduced-motion 준수.{"\n"}{"\n"}출력{"\n"}시맨틱 HTML, CSS 커스텀 프로퍼티, 반응형, 최소한의 JS.{"\n"}페이지는 접힌 쿠튀르 초대장처럼 느껴져야 한다 — 다크 UI 데모가 아니라.</pre>
            <pre data-lang="ja" hidden>Midnight Noir — 静かなラグジュアリーのランディングページをデザインしてください。アンティークシャンパンの箔を一点だけ載せた、黒い漆の建築。{"\n"}{"\n"}トークン{"\n"}--bg #07080B   --surface #0C0E12   --surface-2 #121318   --surface-3 #17161A{"\n"}--line rgba(228,207,157,.12)   --line-strong rgba(228,207,157,.22){"\n"}--gold #C6A15B   --gold-soft #D8C28A   --gold-dim #80683B{"\n"}--text #E7E0D2   --text-muted #9A9388   --text-faint #6F6A61{"\n"}{"\n"}タイポグラフィ{"\n"}ディスプレイ: Cormorant Garamond 600–700、tracking 0.025–0.05em。アウトライン無し、シャドウ無し。{"\n"}本文: Inter 400、0.95rem、line-height 1.85、温かなアイボリー。{"\n"}ラベル: Inter 500、0.62rem、大文字、tracking 0.20em — 金は数字や短いラベルにのみ。{"\n"}{"\n"}レイアウト{"\n"}ヒーローはビューポートを満たし、七割を空ける。タイトルは左寄せで、わずかにオフセンター。{"\n"}タイトルの大部分はアイボリー、一語だけ控えめなシャンパン。両方は使わない。{"\n"}セクションは枠ではなく、余白で区切る。1px のヘアラインは 0.12 不透明度のみ。{"\n"}言語は一度に一つだけ表示する。{"\n"}{"\n"}マテリアル{"\n"}面は影ではなく、重なりで深さを作る。1% のノイズオーバーレイ。{"\n"}金は次にのみ現れる：細い罫線、小さな数字、一語か二語 — 可視面積の合計は七パーセント未満。{"\n"}グロー無し、文字に金属グラデーション無し、装飾無し、シェブロン・サンバースト無し。{"\n"}{"\n"}モーション{"\n"}フェードと 8px の上昇、800ms ease — それ以外は無い。prefers-reduced-motion を尊重。{"\n"}{"\n"}出力{"\n"}セマンティック HTML、CSS カスタムプロパティ、レスポンシブ、最小限の JS。{"\n"}ページは、たたまれたクチュールの招待状のように感じられること — ダーク UI のデモではなく。</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt} className="mn-prompt__copy">Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/terminal-core.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Terminal Core</span></a><div className="page-nav__divider" /><a href="/pages/console-launch.html"><span><span className="page-nav__label">다음</span>Console Launch</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
