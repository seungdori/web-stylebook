import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedEditorialSilencePage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--editorial-silence">
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
        <main>
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
            <h1 data-lang="en">An editorial layout that builds trust through disciplined whitespace and typography alone</h1>
            <h1 data-lang="ko" hidden>정돈된 여백과 활자만으로 신뢰를 만드는 에디토리얼 레이아웃</h1>
            <h1 data-lang="ja" hidden>整えられた余白と活字だけで信頼を生むエディトリアルレイアウト</h1>
            <p className="deck" data-lang="en">
              This style excels when information delivery is paramount. The key is not simply "reducing decoration," but carefully designing heading hierarchy and paragraph density to create a reading rhythm. Specifying "magazine-style, serif headlines, thin rule dividers" in your prompt keeps results consistent.
            </p>
            <p className="deck" data-lang="ko" hidden>
              정보 전달이 가장 중요한 화면에 잘 맞습니다. 핵심은 "장식을 줄이는 것"이 아니라, 제목 계층과 문단
              밀도를 촘촘히 짜서 읽는 리듬을 만드는 것입니다. 프롬프트에 "잡지형, 세리프 헤드라인, 얇은 선
              분할"을 분명히 적으면 결과가 흔들리지 않습니다.
            </p>
            <p className="deck" data-lang="ja" hidden>
              このスタイルは、情報を伝えることが何より大切な画面で力を発揮します。ポイントは「装飾を減らす」ことではなく、見出しの階層と段落の密度を緻密に組んで読むリズムを作ることです。プロンプトに「雑誌風、セリフ見出し、細い罫線の区切り」と明確に書いておくと、結果がブレません。
            </p>
            <div className="columns">
              <article className="block" data-lang="en">
                <p><strong>Principle 1.</strong> Widen body line-height so bold headings and long paragraphs coexist, reducing reading fatigue.</p>
              </article>
              <article className="block" data-lang="ko" hidden>
                <p><strong>기준 1.</strong> 굵은 제목과 긴 문단이 함께 놓이도록 본문 줄간격을 넓혀 읽는 피로를 줄입니다.</p>
              </article>
              <article className="block" data-lang="ja" hidden>
                <p><strong>基準 1.</strong> 太い見出しと長い段落が同じ画面に並ぶよう本文の行間を広げ、読み疲れを抑えます。</p>
              </article>
              <article className="block" data-lang="en">
                <p><strong>Principle 2.</strong> Use only 2-3 desaturated colors to maintain "content focus."</p>
              </article>
              <article className="block" data-lang="ko" hidden>
                <p><strong>기준 2.</strong> 컬러는 저채도 2~3개만 사용해 "콘텐츠 집중도"를 유지합니다.</p>
              </article>
              <article className="block" data-lang="ja" hidden>
                <p><strong>基準 2.</strong> カラーは低彩度の2〜3色だけに絞り、「コンテンツへの集中」を保ちます。</p>
              </article>
            </div>
          </section>
          <section className="components" aria-labelledby="es-comp-heading">
            <div className="components__head">
              <span className="components__index">§ 02</span>
              <h2 className="components__heading" id="es-comp-heading" data-lang="en">Components</h2>
              <h2 className="components__heading" id="es-comp-heading-ko" data-lang="ko" hidden>컴포넌트</h2>
              <h2 className="components__heading" id="es-comp-heading-ja" data-lang="ja" hidden>コンポーネント</h2>
              <p className="components__deck" data-lang="en">Hairlines, restrained type, and the smallest possible ink. The same vocabulary applied to interface elements.</p>
              <p className="components__deck" data-lang="ko" hidden>가는 선과 절제된 활자, 최소한의 잉크. 같은 문법을 인터페이스 요소에 그대로 적용했습니다.</p>
              <p className="components__deck" data-lang="ja" hidden>細い罫線、節制された活字、最小限のインク。同じ語彙をインターフェース要素にそのまま適用しました。</p>
            </div>
            <div className="components-grid">
              <div className="comp-cell">
                <div className="comp-cell__head">
                  <span className="comp-cell__num">01</span>
                  <span className="comp-cell__label" data-lang="en">Buttons</span>
                  <span className="comp-cell__label" data-lang="ko" hidden>버튼</span>
                  <span className="comp-cell__label" data-lang="ja" hidden>ボタン</span>
                </div>
                <div className="comp-cell__demo demo--buttons">
                  <button className="es-btn es-btn--primary" type="button">
                    <span data-lang="en">Read this issue</span>
                    <span data-lang="ko" hidden>이번 호 읽기</span>
                    <span data-lang="ja" hidden>本号を読む</span>
                  </button>
                  <button className="es-btn es-btn--ghost" type="button">
                    <span data-lang="en">Subscribe</span>
                    <span data-lang="ko" hidden>구독하기</span>
                    <span data-lang="ja" hidden>購読する</span>
                  </button>
                  <a className="es-btn es-btn--text" href="#main-content">
                    <span data-lang="en">More articles</span>
                    <span data-lang="ko" hidden>더 많은 글</span>
                    <span data-lang="ja" hidden>もっと読む</span>
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
              <div className="comp-cell">
                <div className="comp-cell__head">
                  <span className="comp-cell__num">02</span>
                  <span className="comp-cell__label" data-lang="en">Form Fields</span>
                  <span className="comp-cell__label" data-lang="ko" hidden>입력 필드</span>
                  <span className="comp-cell__label" data-lang="ja" hidden>入力フィールド</span>
                </div>
                <div className="comp-cell__demo demo--form">
                  <label className="es-field">
                    <span className="es-field__label" data-lang="en">Email</span>
                    <span className="es-field__label" data-lang="ko" hidden>이메일</span>
                    <span className="es-field__label" data-lang="ja" hidden>メール</span>
                    <input className="es-field__input" type="email" placeholder="name@studio.com" />
                  </label>
                  <label className="es-field">
                    <span className="es-field__label" data-lang="en">Note</span>
                    <span className="es-field__label" data-lang="ko" hidden>메모</span>
                    <span className="es-field__label" data-lang="ja" hidden>メモ</span>
                    <textarea className="es-field__input es-field__input--area" rows={2} defaultValue="" placeholder="A sentence or two — that's enough." />
                  </label>
                </div>
              </div>
              <div className="comp-cell">
                <div className="comp-cell__head">
                  <span className="comp-cell__num">03</span>
                  <span className="comp-cell__label" data-lang="en">Tags</span>
                  <span className="comp-cell__label" data-lang="ko" hidden>태그</span>
                  <span className="comp-cell__label" data-lang="ja" hidden>タグ</span>
                </div>
                <div className="comp-cell__demo demo--tags">
                  <span className="es-tag" data-lang="en">Essay</span>
                  <span className="es-tag" data-lang="ko" hidden>에세이</span>
                  <span className="es-tag" data-lang="ja" hidden>エッセイ</span>
                  <span className="es-tag" data-lang="en">Typography</span>
                  <span className="es-tag" data-lang="ko" hidden>타이포그래피</span>
                  <span className="es-tag" data-lang="ja" hidden>タイポグラフィ</span>
                  <span className="es-tag es-tag--ink" data-lang="en">Long Form</span>
                  <span className="es-tag es-tag--ink" data-lang="ko" hidden>장문</span>
                  <span className="es-tag es-tag--ink" data-lang="ja" hidden>長編</span>
                  <span className="es-tag es-tag--num">N° 12</span>
                </div>
              </div>
              <div className="comp-cell">
                <div className="comp-cell__head">
                  <span className="comp-cell__num">04</span>
                  <span className="comp-cell__label" data-lang="en">Stats</span>
                  <span className="comp-cell__label" data-lang="ko" hidden>지표</span>
                  <span className="comp-cell__label" data-lang="ja" hidden>指標</span>
                </div>
                <div className="comp-cell__demo demo--stats">
                  <div className="es-stat">
                    <div className="es-stat__value">07</div>
                    <div className="es-stat__label" data-lang="en">Issues</div>
                    <div className="es-stat__label" data-lang="ko" hidden>발행 호</div>
                    <div className="es-stat__label" data-lang="ja" hidden>発行号</div>
                  </div>
                  <div className="es-stat">
                    <div className="es-stat__value">142</div>
                    <div className="es-stat__label" data-lang="en">Essays</div>
                    <div className="es-stat__label" data-lang="ko" hidden>에세이</div>
                    <div className="es-stat__label" data-lang="ja" hidden>エッセイ</div>
                  </div>
                  <div className="es-stat">
                    <div className="es-stat__value">12<span className="es-stat__unit">k</span></div>
                    <div className="es-stat__label" data-lang="en">Readers</div>
                    <div className="es-stat__label" data-lang="ko" hidden>독자</div>
                    <div className="es-stat__label" data-lang="ja" hidden>読者</div>
                  </div>
                </div>
              </div>
              <div className="comp-cell comp-cell--wide">
                <div className="comp-cell__head">
                  <span className="comp-cell__num">05</span>
                  <span className="comp-cell__label" data-lang="en">Article Cards</span>
                  <span className="comp-cell__label" data-lang="ko" hidden>아티클 카드</span>
                  <span className="comp-cell__label" data-lang="ja" hidden>記事カード</span>
                </div>
                <div className="comp-cell__demo demo--cards">
                  <article className="es-card">
                    <div className="es-card__meta">
                      <span data-lang="en">Essay · Vol. 02</span>
                      <span data-lang="ko" hidden>에세이 · 제2권</span>
                      <span data-lang="ja" hidden>エッセイ · 第二巻</span>
                      <span className="es-card__dot" aria-hidden>·</span>
                      <span data-lang="en">8 min read</span>
                      <span data-lang="ko" hidden>8분 분량</span>
                      <span data-lang="ja" hidden>8分で読める</span>
                    </div>
                    <h3 className="es-card__title" data-lang="en">The discipline of the empty page</h3>
                    <h3 className="es-card__title" data-lang="ko" hidden>빈 페이지의 규율</h3>
                    <h3 className="es-card__title" data-lang="ja" hidden>白いページがもつ規律</h3>
                    <p className="es-card__text" data-lang="en">Whitespace is not the absence of design — it is the most expensive ink on the page. We argue for paying that cost in full.</p>
                    <p className="es-card__text" data-lang="ko" hidden>여백은 디자인이 빠진 자리가 아니라 페이지에서 가장 비싼 잉크입니다. 그 값은 깎지 말고 다 치르는 게 낫습니다.</p>
                    <p className="es-card__text" data-lang="ja" hidden>余白はデザインの不在ではなく、ページで最も高価なインクです。その代価を惜しまず払うことを勧めます。</p>
                    <a className="es-card__link" href="#main-content">
                      <span data-lang="en">Read essay</span>
                      <span data-lang="ko" hidden>에세이 읽기</span>
                      <span data-lang="ja" hidden>エッセイを読む</span>
                      <span aria-hidden>→</span>
                    </a>
                  </article>
                  <article className="es-card">
                    <div className="es-card__meta">
                      <span data-lang="en">Field Note · 03</span>
                      <span data-lang="ko" hidden>필드 노트 · 03</span>
                      <span data-lang="ja" hidden>フィールドノート · 03</span>
                      <span className="es-card__dot" aria-hidden>·</span>
                      <span data-lang="en">5 min read</span>
                      <span data-lang="ko" hidden>5분 분량</span>
                      <span data-lang="ja" hidden>5分で読める</span>
                    </div>
                    <h3 className="es-card__title" data-lang="en">Two columns are enough</h3>
                    <h3 className="es-card__title" data-lang="ko" hidden>두 열이면 충분하다</h3>
                    <h3 className="es-card__title" data-lang="ja" hidden>二段あれば足りる</h3>
                    <p className="es-card__text" data-lang="en">A short defence of the grid that newspapers have used for two hundred years. There is a reason it has not aged.</p>
                    <p className="es-card__text" data-lang="ko" hidden>신문이 200년 동안 써 온 그리드를 짧게 변호한다. 그 그리드가 낡지 않은 데는 이유가 있다.</p>
                    <p className="es-card__text" data-lang="ja" hidden>新聞が二百年使い続けてきたグリッドへの短い弁明。それが古びない理由は確かにある。</p>
                    <a className="es-card__link" href="#main-content">
                      <span data-lang="en">Read essay</span>
                      <span data-lang="ko" hidden>에세이 읽기</span>
                      <span data-lang="ja" hidden>エッセイを読む</span>
                      <span aria-hidden>→</span>
                    </a>
                  </article>
                </div>
              </div>
              <div className="comp-cell comp-cell--wide">
                <div className="comp-cell__head">
                  <span className="comp-cell__num">06</span>
                  <span className="comp-cell__label" data-lang="en">Editorial List</span>
                  <span className="comp-cell__label" data-lang="ko" hidden>에디토리얼 리스트</span>
                  <span className="comp-cell__label" data-lang="ja" hidden>エディトリアルリスト</span>
                </div>
                <div className="comp-cell__demo demo--list">
                  <ol className="es-list">
                    <li>
                      <span className="es-list__num">01</span>
                      <span className="es-list__text" data-lang="en">Set the type before you reach for an image.</span>
                      <span className="es-list__text" data-lang="ko" hidden>이미지에 손을 대기 전, 활자를 먼저 짠다.</span>
                      <span className="es-list__text" data-lang="ja" hidden>画像に手を伸ばす前に、まず活字を組む。</span>
                    </li>
                    <li>
                      <span className="es-list__num">02</span>
                      <span className="es-list__text" data-lang="en">Use lines, not boxes — let air do the dividing work.</span>
                      <span className="es-list__text" data-lang="ko" hidden>박스가 아니라 선을 쓴다 — 나누는 일은 여백에 맡긴다.</span>
                      <span className="es-list__text" data-lang="ja" hidden>箱ではなく線を使う — 区切る仕事は空気に任せる。</span>
                    </li>
                    <li>
                      <span className="es-list__num">03</span>
                      <span className="es-list__text" data-lang="en">If a paragraph cannot defend itself, cut it.</span>
                      <span className="es-list__text" data-lang="ko" hidden>스스로를 변호하지 못하는 단락은 잘라낸다.</span>
                      <span className="es-list__text" data-lang="ja" hidden>自らを弁護できない段落は削る。</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Editorial Silence style — premium magazine aesthetic built on disciplined whitespace and typography.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--paper: #f8f8f8{"\n"}--ink: #1c1c1e{"\n"}--muted: #52525b{"\n"}--line: #d4d4d4{"\n"}--accent: #3f3f46 (neutral dark gray, single accent){"\n"}--card-bg: rgba(255, 255, 255, 0.5){"\n"}--prompt-bg: #ffffff{"\n"}Background: #f8f8f8 (flat neutral white-gray).{"\n"}No other colors.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Heading: 'Noto Serif' 700, tracking -0.015em{"\n"}Body: 'Instrument Sans' 400{"\n"}Scale: clamp(1.9rem, 5vw, 3.8rem) for h1, 0.95rem for nav{"\n"}Heading line-height: 1.25{"\n"}Body line-height: 1.75{"\n"}Deck (subtitle) line-height: 1.75, color var(--muted), max-width 760px{"\n"}{"\n"}UI:{"\n"}Hero: border-top 2px solid var(--ink), border-bottom 1px solid var(--line), padding 24px 0 30px{"\n"}Text blocks: 1px solid var(--line), padding 16px, background rgba(255, 255, 255, 0.5){"\n"}Buttons: 1px solid var(--ink), background #f4f4f5, color var(--ink), padding 8px 13px, no border-radius{"\n"}No card shadows, no rounded corners — rectilinear form language throughout.{"\n"}{"\n"}LAYOUT:{"\n"}Content max-width: min(980px, 90vw){"\n"}Main padding: 34px 0 72px{"\n"}Column grid: 1.3fr + 1fr, gap 20px{"\n"}Hero: full-width section divider, left-aligned headline + deck{"\n"}{"\n"}MOTION:{"\n"}Entrance: translateY(10px) → 0, opacity 0 → 1, 700ms ease, stagger 100ms{"\n"}Hover: none on text blocks, subtle color shift on buttons only{"\n"}No scroll-triggered animations. Respect prefers-reduced-motion.{"\n"}{"\n"}RESPONSIVE:{"\n"}760px: 2-column grid → 1 column, margins reduced{"\n"}980px: Full 2-column layout, centered container{"\n"}{"\n"}FORBIDDEN:{"\n"}- Horizontal scroll at any viewport{"\n"}- Gradient, glow, or shadow decorative effects{"\n"}- Images or illustrations — text and layout only{"\n"}- More than 1 accent color{"\n"}- Rounded corners (border-radius) on any content element{"\n"}- Animated hover states on text blocks{"\n"}{"\n"}OUTPUT:{"\n"}1) Color + typography tokens as CSS custom properties{"\n"}2) Component structure: Hero divider, Headline + Deck, 2-column text blocks, CTA button{"\n"}3) Semantic HTML + CSS with responsive support</pre>
            <pre data-lang="ko" hidden>Editorial Silence 스타일의 랜딩 페이지를 설계해줘 — 절제된 여백과 타이포그래피로 완성하는 고급 매거진 감성.{"\n"}{"\n"}색상 토큰:{"\n"}--paper: #f8f8f8{"\n"}--ink: #1c1c1e{"\n"}--muted: #52525b{"\n"}--line: #d4d4d4{"\n"}--accent: #3f3f46 (중성 다크 그레이, 단일 강조색){"\n"}--card-bg: rgba(255, 255, 255, 0.5){"\n"}--prompt-bg: #ffffff{"\n"}배경: #f8f8f8 (플랫 중성 화이트 그레이).{"\n"}다른 색상 사용 금지.{"\n"}{"\n"}타이포그래피:{"\n"}제목: 'Noto Serif' 700, tracking -0.015em{"\n"}본문: 'Instrument Sans' 400{"\n"}스케일: h1은 clamp(1.9rem, 5vw, 3.8rem), 내비게이션 0.95rem{"\n"}제목 line-height: 1.25{"\n"}본문 line-height: 1.75{"\n"}데크(부제목) line-height: 1.75, color var(--muted), max-width 760px{"\n"}{"\n"}UI:{"\n"}히어로: border-top 2px solid var(--ink), border-bottom 1px solid var(--line), padding 24px 0 30px{"\n"}텍스트 블록: 1px solid var(--line), padding 16px, background rgba(255, 255, 255, 0.5){"\n"}버튼: 1px solid var(--ink), background #f4f4f5, color var(--ink), padding 8px 13px, border-radius 없음{"\n"}카드 그림자 없음, 둥근 코너 없음 — 전체적으로 직선적 형태 언어 사용.{"\n"}{"\n"}레이아웃:{"\n"}콘텐츠 max-width: min(980px, 90vw){"\n"}메인 padding: 34px 0 72px{"\n"}컬럼 그리드: 1.3fr + 1fr, gap 20px{"\n"}히어로: 전체 너비 섹션 구분선, 좌측 정렬 헤드라인 + 데크{"\n"}{"\n"}모션:{"\n"}등장: translateY(10px) → 0, opacity 0 → 1, 700ms ease, 100ms 스태거{"\n"}호버: 텍스트 블록에는 없음, 버튼에만 미세한 색상 변화{"\n"}스크롤 트리거 애니메이션 없음. prefers-reduced-motion 준수.{"\n"}{"\n"}반응형:{"\n"}760px: 2단 그리드 → 1단, 여백 축소{"\n"}980px: 전체 2단 레이아웃, 중앙 정렬 컨테이너{"\n"}{"\n"}금지사항:{"\n"}- 어떤 뷰포트에서든 가로 스크롤{"\n"}- 그라데이션, 글로우, 그림자 장식 효과{"\n"}- 이미지나 일러스트 — 텍스트와 레이아웃만 사용{"\n"}- 강조색 1개 초과{"\n"}- 콘텐츠 요소에 둥근 코너(border-radius){"\n"}- 텍스트 블록에 애니메이션 호버 상태{"\n"}{"\n"}출력:{"\n"}1) 색상 + 타이포그래피 토큰을 CSS 커스텀 프로퍼티로{"\n"}2) 컴포넌트 구조: 히어로 구분선, 헤드라인 + 데크, 2단 텍스트 블록, CTA 버튼{"\n"}3) 반응형 대응이 포함된 시맨틱 HTML + CSS</pre>
            <pre data-lang="ja" hidden>Editorial Silenceスタイルのランディングページを設計してください — 節度あるホワイトスペースとタイポグラフィだけで仕上げる、上質なマガジンの佇まい。{"\n"}{"\n"}カラートークン:{"\n"}--paper: #f8f8f8{"\n"}--ink: #1c1c1e{"\n"}--muted: #52525b{"\n"}--line: #d4d4d4{"\n"}--accent: #3f3f46（ニュートラルダークグレー、単一アクセント）{"\n"}--card-bg: rgba(255, 255, 255, 0.5){"\n"}--prompt-bg: #ffffff{"\n"}背景: #f8f8f8（フラットニュートラルホワイトグレー）.{"\n"}他の色は使用禁止。{"\n"}{"\n"}タイポグラフィ:{"\n"}見出し: 'Noto Serif' 700, tracking -0.015em{"\n"}本文: 'Instrument Sans' 400{"\n"}スケール: h1はclamp(1.9rem, 5vw, 3.8rem)、ナビゲーション0.95rem{"\n"}見出しline-height: 1.25{"\n"}本文line-height: 1.75{"\n"}デッキ（サブタイトル）line-height: 1.75, color var(--muted), max-width 760px{"\n"}{"\n"}UI:{"\n"}ヒーロー: border-top 2px solid var(--ink), border-bottom 1px solid var(--line), padding 24px 0 30px{"\n"}テキストブロック: 1px solid var(--line), padding 16px, background rgba(255, 255, 255, 0.5){"\n"}ボタン: 1px solid var(--ink), background #f4f4f5, color var(--ink), padding 8px 13px, border-radiusなし{"\n"}カードシャドウなし、角丸なし — 全体を直線的なフォルムで統一。{"\n"}{"\n"}レイアウト:{"\n"}コンテンツmax-width: min(980px, 90vw){"\n"}メインpadding: 34px 0 72px{"\n"}カラムグリッド: 1.3fr + 1fr, gap 20px{"\n"}ヒーロー: 全幅セクションディバイダー、左揃えヘッドライン＋デッキ{"\n"}{"\n"}モーション:{"\n"}登場: translateY(10px) → 0, opacity 0 → 1, 700ms ease, 100msスタガー{"\n"}ホバー: テキストブロックにはなし、ボタンのみ微かな色変化{"\n"}スクロールトリガーのアニメーションなし。prefers-reduced-motionを尊重。{"\n"}{"\n"}レスポンシブ:{"\n"}760px: 2カラムグリッド → 1カラム、余白縮小{"\n"}980px: フル2カラムレイアウト、中央揃えコンテナ{"\n"}{"\n"}禁止事項:{"\n"}- いかなるビューポートでも横スクロール{"\n"}- グラデーション、グロー、シャドウの装飾効果{"\n"}- 画像やイラスト — テキストとレイアウトのみ{"\n"}- アクセントカラー1色超過{"\n"}- コンテンツ要素への角丸（border-radius）{"\n"}- テキストブロックへのアニメーションホバー状態{"\n"}{"\n"}出力:{"\n"}1) カラー＋タイポグラフィトークンをCSSカスタムプロパティとして{"\n"}2) コンポーネント構造: ヒーローディバイダー、ヘッドライン＋デッキ、2カラムテキストブロック、CTAボタン{"\n"}3) レスポンシブ対応を含むセマンティックHTML + CSS</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/brutalist-grid.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Brutalist Grid</span></a><div className="page-nav__divider" /><a href="/pages/kinetic-pop.html"><span><span className="page-nav__label">다음</span>Kinetic Pop</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
