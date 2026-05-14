import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { ColorModeToggle } from '../ColorModeToggle';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedMonoTypePage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--mono-type">
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
                <ColorModeToggle pageKey="mono-type" />
                <button className="theme-toggle" id="global-theme-reset" aria-label="Reset Global Theme" data-color="Reset Global Theme" title="Reset Global Theme">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>
          {/* HERO */}
          <section className="hero-specimen">
            <div className="label" data-lang="en">Monospace Specimen</div>
            <div className="label" data-lang="ko" hidden>모노스페이스 서체 견본</div>
            <div className="label" data-lang="ja" hidden>モノスペース書体見本</div>
            <h1>Mono<br />Type</h1>
            <p className="lead" data-lang="en">
              Every character occupies the same width. Every keystroke lands on the same grid.
              This is the typewriter's promise — mechanical precision elevated to typographic art.
            </p>
            <p className="lead" data-lang="ko" hidden>
              모든 문자가 동일한 폭을 차지합니다. 모든 키 입력이 같은 그리드 위에 놓입니다.
              이것이 타자기의 약속 — 기계적 정밀함이 타이포그래피 예술로 승화된 것입니다.
            </p>
            <p className="lead" data-lang="ja" hidden>
              すべての文字が同じ幅を占めます。すべてのキー入力が同じグリッドに着地します。
              これがタイプライターの約束 — 機械的精密さが活版芸術へ昇華されたもの。
            </p>
          </section>
          {/* TYPEWRITER PAPER / SPECIMEN SHEET */}
          <div className="mono-paper" data-lang="en">
            {/* 1. Giant Character Specimen */}
            <div className="specimen">
              <div className="specimen-glyph">Aa</div>
              <div className="specimen-lines">
                <div className="specimen-line specimen-line--ascender">
                  <span className="specimen-line-label">ascender</span>
                </div>
                <div className="specimen-line specimen-line--cap">
                  <span className="specimen-line-label">cap height</span>
                </div>
                <div className="specimen-line specimen-line--xheight">
                  <span className="specimen-line-label">x-height</span>
                </div>
                <div className="specimen-line specimen-line--baseline">
                  <span className="specimen-line-label">baseline</span>
                </div>
                <div className="specimen-line specimen-line--descender">
                  <span className="specimen-line-label">descender</span>
                </div>
              </div>
            </div>
            {/* 2. Width Comparison */}
            <div className="width-compare">
              <div className="width-compare__title">Character Width Comparison</div>
              <div className="width-compare__row">
                <div className="width-compare__block">
                  <div className="width-compare__label">Monospace (fixed)</div>
                  <div className="width-compare__chars">
                    <div className="width-compare__char width-compare__char--mono">W</div>
                    <div className="width-compare__char width-compare__char--mono">i</div>
                    <div className="width-compare__char width-compare__char--mono">M</div>
                    <div className="width-compare__char width-compare__char--mono">l</div>
                  </div>
                  <div className="width-compare__note">= equal width per cell</div>
                </div>
                <div className="width-compare__eq">vs</div>
                <div className="width-compare__block">
                  <div className="width-compare__label">Proportional (variable)</div>
                  <div className="width-compare__chars">
                    <div className="width-compare__char width-compare__char--prop wide">W</div>
                    <div className="width-compare__char width-compare__char--prop narrow">i</div>
                    <div className="width-compare__char width-compare__char--prop wide">M</div>
                    <div className="width-compare__char width-compare__char--prop narrow">l</div>
                  </div>
                  <div className="width-compare__note">= variable width per glyph</div>
                </div>
              </div>
            </div>
            {/* 3. Typewriter Ribbon Palette */}
            <div className="ribbon">
              <div className="ribbon__title">Typewriter Ribbon Palette</div>
              <div className="ribbon__strip">
                <div className="ribbon__swatch" style={{background: '#eeeeee'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>Fresh Ribbon</span>
                </div>
                <div className="ribbon__swatch" style={{background: '#aaaaaa'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>Worn Ink</span>
                </div>
                <div className="ribbon__swatch" style={{background: '#666666'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>Faded Strike</span>
                </div>
                <div className="ribbon__swatch" style={{background: '#333333'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>Ghost Print</span>
                </div>
                <div className="ribbon__swatch" style={{background: '#111111', border: '1px solid var(--line)'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>No Ink</span>
                </div>
              </div>
            </div>
            {/* 4. Annotated Paragraph */}
            <div className="annotated">
              <div className="annotated__title">Typographic Metrics</div>
              <div className="annotated__block">The monospace typeface assigns equal horizontal
                space to every glyph — from the widest M
                to the narrowest i. This constraint,
                born from mechanical necessity, became
                an aesthetic of precision and order.<span className="annotated__metric annotated__metric--lh">line-height: 1.95</span><span className="annotated__metric annotated__metric--ls">letter-spacing: 0.04em</span></div>
            </div>
            {/* 5. Tab Ruler */}
            <div className="tab-ruler">
              <div className="tab-ruler__title">Tab Stops &amp; Ruler</div>
              <div className="tab-ruler__bar" id="tab-ruler-bar" />
            </div>
            {/* 6. Code-Poetry */}
            <div className="code-poetry">
              <div className="code-poetry__title">Code Poetry</div>
              <div className="code-poetry__block">
                <div className="code-poetry__line"><span className="code-poetry__keyword">function</span> writePoetry() {'{'}</div>
                <div className="code-poetry__line code-poetry__indent1"><span className="code-poetry__keyword">const</span> words = <span className="code-poetry__string">"fixed width dreams"</span>;</div>
                <div className="code-poetry__line code-poetry__indent1"><span className="code-poetry__keyword">const</span> grid  = <span className="code-poetry__string">"each letter aligned"</span>;</div>
                <div className="code-poetry__line" />
                <div className="code-poetry__line code-poetry__indent1"><span className="code-poetry__keyword">for</span> (<span className="code-poetry__keyword">let</span> key <span className="code-poetry__keyword">of</span> typewriter) {'{'}</div>
                <div className="code-poetry__line code-poetry__indent2">strike(ribbon, paper);</div>
                <div className="code-poetry__line code-poetry__indent2"><span className="code-poetry__comment">// the mechanical click</span></div>
                <div className="code-poetry__line code-poetry__indent2"><span className="code-poetry__comment">// of metal meeting page</span></div>
                <div className="code-poetry__line code-poetry__indent1">{'}'}</div>
                <div className="code-poetry__line" />
                <div className="code-poetry__line code-poetry__indent1"><span className="code-poetry__keyword">return</span> <span className="code-poetry__string">"precision is beauty"</span>;</div>
                <div className="code-poetry__line">{'}'}</div>
              </div>
            </div>
            {/* 7. Typewriter Corrections */}
            <div className="corrections">
              <div className="corrections__title">Typewriter Corrections</div>
              <div className="corrections__text">
                The <span className="strike">quick</span> <span className="correction">swift</span> fox
                <span className="strike">jumped</span> <span className="correction">leapt</span> over the
                <span className="strike">lazy</span> <span className="correction">sleeping</span> dog.
                Every <span className="strike">mistake</span> <span className="correction">revision</span>
                tells a <span className="strike">story</span> <span className="correction">history</span>
                of thought in motion.
              </div>
            </div>
            {/* 8. Typing Animation */}
            <div className="typing-section">
              <div className="typing-section__title">Live Keystroke</div>
              <span className="typing-text" id="typing-output" /><span className="typing-cursor" />
            </div>
            {/* 9. Status Bar */}
            <div className="status-bar">
              <span className="status-bar__item">Ln 1, Col 1</span>
              <span className="status-bar__sep">|</span>
              <span className="status-bar__item">Chars: <span id="status-chars">0</span></span>
              <span className="status-bar__sep">|</span>
              <span className="status-bar__item">Words: <span id="status-words">0</span></span>
              <span className="status-bar__sep">|</span>
              <span className="status-bar__item">Space Mono</span>
              <span className="status-bar__sep">|</span>
              <span className="status-bar__item">UTF-8</span>
            </div>
            <div className="mono-paper__footer">
              <div className="mono-paper__footer-cluster">
                <span className="mono-paper__footer-model">Olivetti Lettera 32</span>
                <span className="mono-paper__footer-sep">·</span>
                <span>Steel Carriage</span>
                <span className="mono-paper__footer-sep">·</span>
                <span>MMXXVI</span>
              </div>
              <span className="mono-paper__footer-page">Sheet 01 / 01</span>
            </div>
          </div>
          {/* /mono-paper EN */}
          {/* KOREAN VERSION */}
          <div className="mono-paper" data-lang="ko" hidden>
            <div className="specimen">
              <div className="specimen-glyph">Aa</div>
              <div className="specimen-lines">
                <div className="specimen-line specimen-line--ascender">
                  <span className="specimen-line-label">어센더</span>
                </div>
                <div className="specimen-line specimen-line--cap">
                  <span className="specimen-line-label">캡 높이</span>
                </div>
                <div className="specimen-line specimen-line--xheight">
                  <span className="specimen-line-label">x-높이</span>
                </div>
                <div className="specimen-line specimen-line--baseline">
                  <span className="specimen-line-label">기준선</span>
                </div>
                <div className="specimen-line specimen-line--descender">
                  <span className="specimen-line-label">디센더</span>
                </div>
              </div>
            </div>
            <div className="width-compare">
              <div className="width-compare__title">문자 폭 비교</div>
              <div className="width-compare__row">
                <div className="width-compare__block">
                  <div className="width-compare__label">모노스페이스 (고정폭)</div>
                  <div className="width-compare__chars">
                    <div className="width-compare__char width-compare__char--mono">W</div>
                    <div className="width-compare__char width-compare__char--mono">i</div>
                    <div className="width-compare__char width-compare__char--mono">M</div>
                    <div className="width-compare__char width-compare__char--mono">l</div>
                  </div>
                  <div className="width-compare__note">= 셀당 동일한 폭</div>
                </div>
                <div className="width-compare__eq">vs</div>
                <div className="width-compare__block">
                  <div className="width-compare__label">프로포셔널 (가변폭)</div>
                  <div className="width-compare__chars">
                    <div className="width-compare__char width-compare__char--prop wide">W</div>
                    <div className="width-compare__char width-compare__char--prop narrow">i</div>
                    <div className="width-compare__char width-compare__char--prop wide">M</div>
                    <div className="width-compare__char width-compare__char--prop narrow">l</div>
                  </div>
                  <div className="width-compare__note">= 글리프마다 다른 폭</div>
                </div>
              </div>
            </div>
            <div className="ribbon">
              <div className="ribbon__title">타자기 리본 팔레트</div>
              <div className="ribbon__strip">
                <div className="ribbon__swatch" style={{background: '#eeeeee'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>새 리본</span>
                </div>
                <div className="ribbon__swatch" style={{background: '#aaaaaa'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>닳은 잉크</span>
                </div>
                <div className="ribbon__swatch" style={{background: '#666666'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>바랜 타격</span>
                </div>
                <div className="ribbon__swatch" style={{background: '#333333'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>유령 인쇄</span>
                </div>
                <div className="ribbon__swatch" style={{background: '#111111', border: '1px solid var(--line)'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>잉크 없음</span>
                </div>
              </div>
            </div>
            <div className="annotated">
              <div className="annotated__title">타이포그래피 지표</div>
              <div className="annotated__block">모노스페이스 서체는 모든 글리프에 동일한
                수평 공간을 할당합니다 — 가장 넓은 M부터
                가장 좁은 i까지. 기계적 필요에서 태어난
                이 제약은 정밀함과 질서의 미학이
                되었습니다.</div>
            </div>
            <div className="tab-ruler">
              <div className="tab-ruler__title">탭 정지 및 눈금자</div>
              <div className="tab-ruler__bar" id="tab-ruler-bar-ko" />
            </div>
            <div className="code-poetry">
              <div className="code-poetry__title">코드 시</div>
              <div className="code-poetry__block">
                <div className="code-poetry__line"><span className="code-poetry__keyword">function</span> 시를쓰다() {'{'}</div>
                <div className="code-poetry__line code-poetry__indent1"><span className="code-poetry__keyword">const</span> 단어 = <span className="code-poetry__string">"고정폭의 꿈"</span>;</div>
                <div className="code-poetry__line code-poetry__indent1"><span className="code-poetry__keyword">const</span> 격자 = <span className="code-poetry__string">"정렬된 모든 글자"</span>;</div>
                <div className="code-poetry__line" />
                <div className="code-poetry__line code-poetry__indent1"><span className="code-poetry__keyword">for</span> (<span className="code-poetry__keyword">let</span> 키 <span className="code-poetry__keyword">of</span> 타자기) {'{'}</div>
                <div className="code-poetry__line code-poetry__indent2">타격(리본, 종이);</div>
                <div className="code-poetry__line code-poetry__indent2"><span className="code-poetry__comment">// 금속이 종이를 만나는</span></div>
                <div className="code-poetry__line code-poetry__indent2"><span className="code-poetry__comment">// 기계적 딸깍 소리</span></div>
                <div className="code-poetry__line code-poetry__indent1">{'}'}</div>
                <div className="code-poetry__line" />
                <div className="code-poetry__line code-poetry__indent1"><span className="code-poetry__keyword">return</span> <span className="code-poetry__string">"정밀함이 아름다움이다"</span>;</div>
                <div className="code-poetry__line">{'}'}</div>
              </div>
            </div>
            <div className="corrections">
              <div className="corrections__title">타자기 교정</div>
              <div className="corrections__text">
                <span className="strike">빠른</span> <span className="correction">민첩한</span> 여우가
                게으른 개 위를 <span className="strike">뛰어넘었다</span> <span className="correction">도약했다</span>.
                모든 <span className="strike">실수</span> <span className="correction">수정</span>은
                움직이는 사고의 <span className="strike">이야기</span> <span className="correction">역사</span>를 전한다.
              </div>
            </div>
            <div className="typing-section">
              <div className="typing-section__title">실시간 키 입력</div>
              <span className="typing-text" id="typing-output-ko" /><span className="typing-cursor" />
            </div>
            <div className="status-bar">
              <span className="status-bar__item">행 1, 열 1</span>
              <span className="status-bar__sep">|</span>
              <span className="status-bar__item">문자: <span id="status-chars-ko">0</span></span>
              <span className="status-bar__sep">|</span>
              <span className="status-bar__item">단어: <span id="status-words-ko">0</span></span>
              <span className="status-bar__sep">|</span>
              <span className="status-bar__item">Space Mono</span>
              <span className="status-bar__sep">|</span>
              <span className="status-bar__item">UTF-8</span>
            </div>
            <div className="mono-paper__footer">
              <div className="mono-paper__footer-cluster">
                <span className="mono-paper__footer-model">올리베티 Lettera 32</span>
                <span className="mono-paper__footer-sep">·</span>
                <span>강철 캐리지</span>
                <span className="mono-paper__footer-sep">·</span>
                <span>MMXXVI</span>
              </div>
              <span className="mono-paper__footer-page">시트 01 / 01</span>
            </div>
          </div>
          {/* /mono-paper KO */}
          {/* JAPANESE VERSION */}
          <div className="mono-paper" data-lang="ja" hidden>
            <div className="specimen">
              <div className="specimen-glyph">Aa</div>
              <div className="specimen-lines">
                <div className="specimen-line specimen-line--ascender">
                  <span className="specimen-line-label">アセンダー</span>
                </div>
                <div className="specimen-line specimen-line--cap">
                  <span className="specimen-line-label">キャップ高</span>
                </div>
                <div className="specimen-line specimen-line--xheight">
                  <span className="specimen-line-label">x高さ</span>
                </div>
                <div className="specimen-line specimen-line--baseline">
                  <span className="specimen-line-label">ベースライン</span>
                </div>
                <div className="specimen-line specimen-line--descender">
                  <span className="specimen-line-label">ディセンダー</span>
                </div>
              </div>
            </div>
            <div className="width-compare">
              <div className="width-compare__title">文字幅の比較</div>
              <div className="width-compare__row">
                <div className="width-compare__block">
                  <div className="width-compare__label">等幅 (固定幅)</div>
                  <div className="width-compare__chars">
                    <div className="width-compare__char width-compare__char--mono">W</div>
                    <div className="width-compare__char width-compare__char--mono">i</div>
                    <div className="width-compare__char width-compare__char--mono">M</div>
                    <div className="width-compare__char width-compare__char--mono">l</div>
                  </div>
                  <div className="width-compare__note">= セルごとに同じ幅</div>
                </div>
                <div className="width-compare__eq">vs</div>
                <div className="width-compare__block">
                  <div className="width-compare__label">プロポーショナル (可変幅)</div>
                  <div className="width-compare__chars">
                    <div className="width-compare__char width-compare__char--prop wide">W</div>
                    <div className="width-compare__char width-compare__char--prop narrow">i</div>
                    <div className="width-compare__char width-compare__char--prop wide">M</div>
                    <div className="width-compare__char width-compare__char--prop narrow">l</div>
                  </div>
                  <div className="width-compare__note">= グリフごとに異なる幅</div>
                </div>
              </div>
            </div>
            <div className="ribbon">
              <div className="ribbon__title">タイプライターリボンパレット</div>
              <div className="ribbon__strip">
                <div className="ribbon__swatch" style={{background: '#eeeeee'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>新品リボン</span>
                </div>
                <div className="ribbon__swatch" style={{background: '#aaaaaa'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>摩耗インク</span>
                </div>
                <div className="ribbon__swatch" style={{background: '#666666'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>薄い打刻</span>
                </div>
                <div className="ribbon__swatch" style={{background: '#333333'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>ゴースト印字</span>
                </div>
                <div className="ribbon__swatch" style={{background: '#111111', border: '1px solid var(--line)'}}>
                  <span className="ribbon__swatch-label" style={{color: 'var(--muted)'}}>インク切れ</span>
                </div>
              </div>
            </div>
            <div className="annotated">
              <div className="annotated__title">タイポグラフィ指標</div>
              <div className="annotated__block">等幅書体はすべてのグリフに同じ水平スペースを
                割り当てます — 最も広いMから最も狭いiまで。
                機械的必要性から生まれたこの制約は、
                精密さと秩序の美学となりました。</div>
            </div>
            <div className="tab-ruler">
              <div className="tab-ruler__title">タブストップと定規</div>
              <div className="tab-ruler__bar" id="tab-ruler-bar-ja" />
            </div>
            <div className="code-poetry">
              <div className="code-poetry__title">コードポエトリー</div>
              <div className="code-poetry__block">
                <div className="code-poetry__line"><span className="code-poetry__keyword">function</span> 詩を書く() {'{'}</div>
                <div className="code-poetry__line code-poetry__indent1"><span className="code-poetry__keyword">const</span> 言葉 = <span className="code-poetry__string">"固定幅の夢"</span>;</div>
                <div className="code-poetry__line code-poetry__indent1"><span className="code-poetry__keyword">const</span> 格子 = <span className="code-poetry__string">"整列した全ての文字"</span>;</div>
                <div className="code-poetry__line" />
                <div className="code-poetry__line code-poetry__indent1"><span className="code-poetry__keyword">for</span> (<span className="code-poetry__keyword">let</span> キー <span className="code-poetry__keyword">of</span> タイプライター) {'{'}</div>
                <div className="code-poetry__line code-poetry__indent2">打刻(リボン, 紙);</div>
                <div className="code-poetry__line code-poetry__indent2"><span className="code-poetry__comment">// 金属が紙に出会う</span></div>
                <div className="code-poetry__line code-poetry__indent2"><span className="code-poetry__comment">// 機械的なカチッという音</span></div>
                <div className="code-poetry__line code-poetry__indent1">{'}'}</div>
                <div className="code-poetry__line" />
                <div className="code-poetry__line code-poetry__indent1"><span className="code-poetry__keyword">return</span> <span className="code-poetry__string">"精密さこそ美しさ"</span>;</div>
                <div className="code-poetry__line">{'}'}</div>
              </div>
            </div>
            <div className="corrections">
              <div className="corrections__title">タイプライター校正</div>
              <div className="corrections__text">
                <span className="strike">素早い</span> <span className="correction">俊敏な</span>狐が
                怠けた犬を<span className="strike">飛び越えた</span> <span className="correction">跳躍した</span>。
                すべての<span className="strike">間違い</span> <span className="correction">修正</span>は
                動く思考の<span className="strike">物語</span> <span className="correction">歴史</span>を伝える。
              </div>
            </div>
            <div className="typing-section">
              <div className="typing-section__title">ライブキーストローク</div>
              <span className="typing-text" id="typing-output-ja" /><span className="typing-cursor" />
            </div>
            <div className="status-bar">
              <span className="status-bar__item">行 1, 列 1</span>
              <span className="status-bar__sep">|</span>
              <span className="status-bar__item">文字: <span id="status-chars-ja">0</span></span>
              <span className="status-bar__sep">|</span>
              <span className="status-bar__item">単語: <span id="status-words-ja">0</span></span>
              <span className="status-bar__sep">|</span>
              <span className="status-bar__item">Space Mono</span>
              <span className="status-bar__sep">|</span>
              <span className="status-bar__item">UTF-8</span>
            </div>
            <div className="mono-paper__footer">
              <div className="mono-paper__footer-cluster">
                <span className="mono-paper__footer-model">オリベッティ Lettera 32</span>
                <span className="mono-paper__footer-sep">·</span>
                <span>スチールキャリッジ</span>
                <span className="mono-paper__footer-sep">·</span>
                <span>MMXXVI</span>
              </div>
              <span className="mono-paper__footer-page">シート 01 / 01</span>
            </div>
          </div>
          {/* /mono-paper JA */}

          {/* ============================================
              EXTENDED COMPONENT SHOWCASE
              ============================================ */}

          {/* Buttons */}
          <div className="mt-block">
            <div className="mt-block__head">
              <div>
                <div className="mt-block__num">§ X · Action Marks</div>
                <h2 className="mt-block__title" data-lang="en">Buttons & Marks</h2>
                <h2 className="mt-block__title" data-lang="ko" hidden>버튼과 기호</h2>
                <h2 className="mt-block__title" data-lang="ja" hidden>ボタンとマーク</h2>
              </div>
              <span className="mt-block__sub" data-lang="en">7 variants · invert on hover</span>
              <span className="mt-block__sub" data-lang="ko" hidden>7가지 변형 · 호버 시 반전</span>
              <span className="mt-block__sub" data-lang="ja" hidden>7バリアント · ホバーで反転</span>
            </div>
            <div className="mt-btn-rack">
              <button type="button" className="mt-btn mt-btn--solid">
                <span data-lang="en">Specimen Sheet</span>
                <span data-lang="ko" hidden>스페시멘 시트</span>
                <span data-lang="ja" hidden>スペシメンシート</span>
                <span className="arrow">→</span>
              </button>
              <button type="button" className="mt-btn">
                <span data-lang="en">View Grid</span>
                <span data-lang="ko" hidden>그리드 보기</span>
                <span data-lang="ja" hidden>グリッド表示</span>
              </button>
              <button type="button" className="mt-btn mt-btn--dashed">
                <span data-lang="en">Print Sheet</span>
                <span data-lang="ko" hidden>인쇄 시트</span>
                <span data-lang="ja" hidden>シート印刷</span>
              </button>
              <button type="button" className="mt-btn mt-btn--ghost">
                <span data-lang="en">Cancel</span>
                <span data-lang="ko" hidden>취소</span>
                <span data-lang="ja" hidden>キャンセル</span>
              </button>
              <button type="button" className="mt-btn mt-btn--small">+ Add Glyph</button>
              <button type="button" className="mt-btn mt-btn--small mt-btn--ghost">⌥ Options</button>
              <button type="button" className="mt-btn mt-btn--link">
                <span data-lang="en">Read full specification ↗</span>
                <span data-lang="ko" hidden>전체 사양 읽기 ↗</span>
                <span data-lang="ja" hidden>仕様書全文 ↗</span>
              </button>
            </div>
          </div>

          {/* Glyph Grid */}
          <div className="mt-block">
            <div className="mt-block__head">
              <div>
                <div className="mt-block__num">§ XI · Glyph Set</div>
                <h2 className="mt-block__title" data-lang="en">Character Inventory</h2>
                <h2 className="mt-block__title" data-lang="ko" hidden>문자 인벤토리</h2>
                <h2 className="mt-block__title" data-lang="ja" hidden>キャラクターインベントリ</h2>
              </div>
              <span className="mt-block__sub">U+0041 → U+007E · 62 glyphs</span>
            </div>
            <div className="glyph-grid">
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&%$*?!/<>='.split('').map((ch) => (
                <div key={ch} className="glyph-cell" data-code={`U+${ch.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`}>{ch}</div>
              ))}
            </div>
          </div>

          {/* Weight Scale */}
          <div className="mt-block">
            <div className="mt-block__head">
              <div>
                <div className="mt-block__num">§ XII · Weight Axis</div>
                <h2 className="mt-block__title" data-lang="en">Weight Spectrum</h2>
                <h2 className="mt-block__title" data-lang="ko" hidden>웨이트 스펙트럼</h2>
                <h2 className="mt-block__title" data-lang="ja" hidden>ウェイトスペクトラム</h2>
              </div>
              <span className="mt-block__sub">100–900 · 5 stops</span>
            </div>
            <div className="weight-scale">
              <div className="weight-cell"><div className="weight-cell__sample" style={{fontWeight: 100}}>Aa</div><div className="weight-cell__name" data-lang="en">Thin</div><div className="weight-cell__name" data-lang="ko" hidden>씬</div><div className="weight-cell__name" data-lang="ja" hidden>シン</div><div className="weight-cell__num">100</div></div>
              <div className="weight-cell"><div className="weight-cell__sample" style={{fontWeight: 300}}>Aa</div><div className="weight-cell__name" data-lang="en">Light</div><div className="weight-cell__name" data-lang="ko" hidden>라이트</div><div className="weight-cell__name" data-lang="ja" hidden>ライト</div><div className="weight-cell__num">300</div></div>
              <div className="weight-cell"><div className="weight-cell__sample" style={{fontWeight: 400}}>Aa</div><div className="weight-cell__name" data-lang="en">Regular</div><div className="weight-cell__name" data-lang="ko" hidden>레귤러</div><div className="weight-cell__name" data-lang="ja" hidden>レギュラー</div><div className="weight-cell__num">400</div></div>
              <div className="weight-cell"><div className="weight-cell__sample" style={{fontWeight: 700}}>Aa</div><div className="weight-cell__name" data-lang="en">Bold</div><div className="weight-cell__name" data-lang="ko" hidden>볼드</div><div className="weight-cell__name" data-lang="ja" hidden>ボールド</div><div className="weight-cell__num">700</div></div>
              <div className="weight-cell"><div className="weight-cell__sample" style={{fontWeight: 900}}>Aa</div><div className="weight-cell__name" data-lang="en">Black</div><div className="weight-cell__name" data-lang="ko" hidden>블랙</div><div className="weight-cell__name" data-lang="ja" hidden>ブラック</div><div className="weight-cell__num">900</div></div>
            </div>
          </div>

          {/* Kerning Pairs */}
          <div className="mt-block">
            <div className="mt-block__head">
              <div>
                <div className="mt-block__num">§ XIII · Kerning</div>
                <h2 className="mt-block__title" data-lang="en">Tracking Pairs</h2>
                <h2 className="mt-block__title" data-lang="ko" hidden>커닝 페어</h2>
                <h2 className="mt-block__title" data-lang="ja" hidden>カーニングペア</h2>
              </div>
              <span className="mt-block__sub">8 pairs · -0.04em</span>
            </div>
            <div className="kerning-grid">
              <div className="kerning-cell"><div className="kerning-cell__pair">A<em>V</em></div><div className="kerning-cell__label">A · V · -40</div></div>
              <div className="kerning-cell"><div className="kerning-cell__pair">T<em>y</em></div><div className="kerning-cell__label">T · y · -30</div></div>
              <div className="kerning-cell"><div className="kerning-cell__pair">L<em>T</em></div><div className="kerning-cell__label">L · T · -55</div></div>
              <div className="kerning-cell"><div className="kerning-cell__pair">W<em>a</em></div><div className="kerning-cell__label">W · a · -25</div></div>
              <div className="kerning-cell"><div className="kerning-cell__pair">P<em>o</em></div><div className="kerning-cell__label">P · o · -20</div></div>
              <div className="kerning-cell"><div className="kerning-cell__pair">f<em>i</em></div><div className="kerning-cell__label">f · i · liga</div></div>
              <div className="kerning-cell"><div className="kerning-cell__pair">3<em>9</em></div><div className="kerning-cell__label">3 · 9 · num</div></div>
              <div className="kerning-cell"><div className="kerning-cell__pair">→<em>↗</em></div><div className="kerning-cell__label">arrow · pair</div></div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-block">
            <div className="mt-block__head">
              <div>
                <div className="mt-block__num">§ XIV · Specimen Metrics</div>
                <h2 className="mt-block__title" data-lang="en">Type Inventory</h2>
                <h2 className="mt-block__title" data-lang="ko" hidden>타입 인벤토리</h2>
                <h2 className="mt-block__title" data-lang="ja" hidden>タイプインベントリ</h2>
              </div>
              <span className="mt-block__sub" data-lang="en">4 counts</span>
              <span className="mt-block__sub" data-lang="ko" hidden>측정 4종</span>
              <span className="mt-block__sub" data-lang="ja" hidden>4種の計測</span>
            </div>
            <div className="mt-stats">
              <div className="mt-stat">
                <div className="mt-stat__num">01</div>
                <div className="mt-stat__value">847</div>
                <div className="mt-stat__label" data-lang="en">glyphs in family</div>
                <div className="mt-stat__label" data-lang="ko" hidden>패밀리 글리프</div>
                <div className="mt-stat__label" data-lang="ja" hidden>ファミリーグリフ数</div>
              </div>
              <div className="mt-stat">
                <div className="mt-stat__num">02</div>
                <div className="mt-stat__value">5<small> wt</small></div>
                <div className="mt-stat__label" data-lang="en">weight stops</div>
                <div className="mt-stat__label" data-lang="ko" hidden>웨이트 단계</div>
                <div className="mt-stat__label" data-lang="ja" hidden>ウェイト段階</div>
              </div>
              <div className="mt-stat">
                <div className="mt-stat__num">03</div>
                <div className="mt-stat__value">120<small> px</small></div>
                <div className="mt-stat__label" data-lang="en">max display size</div>
                <div className="mt-stat__label" data-lang="ko" hidden>최대 디스플레이</div>
                <div className="mt-stat__label" data-lang="ja" hidden>最大表示サイズ</div>
              </div>
              <div className="mt-stat">
                <div className="mt-stat__num">04</div>
                <div className="mt-stat__value">1985</div>
                <div className="mt-stat__label" data-lang="en">first cast</div>
                <div className="mt-stat__label" data-lang="ko" hidden>최초 주조</div>
                <div className="mt-stat__label" data-lang="ja" hidden>初鋳造</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="mt-block">
            <div className="mt-block__head">
              <div>
                <div className="mt-block__num">§ XV · Order Form</div>
                <h2 className="mt-block__title" data-lang="en">Specimen Order</h2>
                <h2 className="mt-block__title" data-lang="ko" hidden>스페시멘 주문</h2>
                <h2 className="mt-block__title" data-lang="ja" hidden>スペシメン注文</h2>
              </div>
              <span className="mt-block__sub" data-lang="en">input · select · check · toggle · slider</span>
              <span className="mt-block__sub" data-lang="ko" hidden>입력 · 셀렉트 · 체크 · 라디오 · 슬라이더</span>
              <span className="mt-block__sub" data-lang="ja" hidden>入力 · セレクト · チェック · ラジオ · スライダー</span>
            </div>
            <div className="mt-form">
              <div className="mt-field">
                <span className="mt-field__label" data-lang="en">Customer name</span>
                <span className="mt-field__label" data-lang="ko" hidden>고객명</span>
                <span className="mt-field__label" data-lang="ja" hidden>顧客名</span>
                <label className="mt-input"><span className="prefix">→</span><input type="text" defaultValue="Ms. Lee Hyun" /></label>
              </div>
              <div className="mt-field">
                <span className="mt-field__label" data-lang="en">Email</span>
                <span className="mt-field__label" data-lang="ko" hidden>이메일</span>
                <span className="mt-field__label" data-lang="ja" hidden>メール</span>
                <label className="mt-input"><span className="prefix">@</span><input type="text" placeholder="you@studio.com" /></label>
              </div>
              <div className="mt-field">
                <span className="mt-field__label" data-lang="en">Weight</span>
                <span className="mt-field__label" data-lang="ko" hidden>웨이트</span>
                <span className="mt-field__label" data-lang="ja" hidden>ウェイト</span>
                <select className="mt-select" defaultValue="700">
                  <option>Thin · 100</option>
                  <option>Light · 300</option>
                  <option>Regular · 400</option>
                  <option value="700">Bold · 700</option>
                  <option>Black · 900</option>
                </select>
              </div>
              <div className="mt-field">
                <span className="mt-field__label" data-lang="en">Format</span>
                <span className="mt-field__label" data-lang="ko" hidden>포맷</span>
                <span className="mt-field__label" data-lang="ja" hidden>フォーマット</span>
                <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                  <span className="mt-check on"><span className="mt-check__box" /><span>OTF (OpenType)</span></span>
                  <span className="mt-check on"><span className="mt-check__box" /><span>WOFF2 (Web)</span></span>
                  <span className="mt-check"><span className="mt-check__box" /><span>TTF (TrueType)</span></span>
                  <span className="mt-check"><span className="mt-check__box" /><span>VAR (Variable)</span></span>
                </div>
              </div>
              <div className="mt-field">
                <span className="mt-field__label" data-lang="en">License</span>
                <span className="mt-field__label" data-lang="ko" hidden>라이선스</span>
                <span className="mt-field__label" data-lang="ja" hidden>ライセンス</span>
                <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                  <span className="mt-radio"><span className="mt-radio__circle" /><span data-lang="en">Personal (1 user)</span><span data-lang="ko" hidden>개인 (1인)</span><span data-lang="ja" hidden>個人 (1名)</span></span>
                  <span className="mt-radio on"><span className="mt-radio__circle" /><span data-lang="en">Studio (5 users)</span><span data-lang="ko" hidden>스튜디오 (5인)</span><span data-lang="ja" hidden>スタジオ (5名)</span></span>
                  <span className="mt-radio"><span className="mt-radio__circle" /><span data-lang="en">Foundry-wide</span><span data-lang="ko" hidden>주조소 전체</span><span data-lang="ja" hidden>鋳造所全体</span></span>
                </div>
              </div>
              <div className="mt-field">
                <span className="mt-field__label" data-lang="en">Tracking · -0.04em</span>
                <span className="mt-field__label" data-lang="ko" hidden>트래킹 · -0.04em</span>
                <span className="mt-field__label" data-lang="ja" hidden>トラッキング · -0.04em</span>
                <div>
                  <div className="mt-slider"><div className="mt-slider__line"><div className="mt-slider__fill" /><div className="mt-slider__thumb" /></div></div>
                  <div className="mt-slider__hint"><span>-0.08</span><span>-0.04</span><span>+0.00</span></div>
                </div>
              </div>
              <div className="mt-field" style={{gridColumn: '1 / -1'}}>
                <span className="mt-field__label" data-lang="en">Sample text</span>
                <span className="mt-field__label" data-lang="ko" hidden>샘플 텍스트</span>
                <span className="mt-field__label" data-lang="ja" hidden>サンプルテキスト</span>
                <textarea className="mt-textarea" defaultValue={"The quick brown fox jumps over the lazy dog. 0123456789.\n— set in Mono Type, Bold 700, -0.04em tracking"} />
              </div>
            </div>
          </div>

          {/* Spec Table */}
          <div className="mt-block">
            <div className="mt-block__head">
              <div>
                <div className="mt-block__num">§ XVI · Metrics</div>
                <h2 className="mt-block__title" data-lang="en">Font Metrics</h2>
                <h2 className="mt-block__title" data-lang="ko" hidden>폰트 메트릭</h2>
                <h2 className="mt-block__title" data-lang="ja" hidden>フォントメトリクス</h2>
              </div>
              <span className="mt-block__sub" data-lang="en">units per em — 1000</span>
              <span className="mt-block__sub" data-lang="ko" hidden>units per em — 1000</span>
              <span className="mt-block__sub" data-lang="ja" hidden>units per em — 1000</span>
            </div>
            <table className="mt-table">
              <thead>
                <tr>
                  <th data-lang="en">Property</th>
                  <th data-lang="ko" hidden>속성</th>
                  <th data-lang="ja" hidden>プロパティ</th>
                  <th data-lang="en">Value</th>
                  <th data-lang="ko" hidden>값</th>
                  <th data-lang="ja" hidden>値</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>x-height</td><td>520 / 1000</td></tr>
                <tr><td>cap-height</td><td>720 / 1000</td></tr>
                <tr><td>ascender</td><td>820 / 1000</td></tr>
                <tr><td>descender</td><td>-200 / 1000</td></tr>
                <tr><td>line-height</td><td>1.85</td></tr>
                <tr><td>tracking</td><td>-0.04em</td></tr>
                <tr><td>contrast</td><td data-lang="en">low (mono)</td><td data-lang="ko" hidden>낮음 (모노)</td><td data-lang="ja" hidden>低 (モノ)</td></tr>
                <tr><td data-lang="en">opentype features</td><td data-lang="ko" hidden>오픈타입 기능</td><td data-lang="ja" hidden>オープンタイプ機能</td><td>liga · kern · tnum</td></tr>
              </tbody>
            </table>
          </div>

          {/* Tabs */}
          <div className="mt-block">
            <div className="mt-block__head">
              <div>
                <div className="mt-block__num">§ XVII · Sections</div>
                <h2 className="mt-block__title" data-lang="en">Specimen Pages</h2>
                <h2 className="mt-block__title" data-lang="ko" hidden>스페시멘 페이지</h2>
                <h2 className="mt-block__title" data-lang="ja" hidden>スペシメンページ</h2>
              </div>
              <span className="mt-block__sub">underlined active marker</span>
            </div>
            <div className="mt-tabs">
              <button type="button" className="active" data-lang="en">Glyphs</button>
              <button type="button" className="active" data-lang="ko" hidden>글리프</button>
              <button type="button" className="active" data-lang="ja" hidden>グリフ</button>
              <button type="button" data-lang="en">Metrics</button>
              <button type="button" data-lang="ko" hidden>메트릭</button>
              <button type="button" data-lang="ja" hidden>メトリクス</button>
              <button type="button" data-lang="en">Kerning</button>
              <button type="button" data-lang="ko" hidden>커닝</button>
              <button type="button" data-lang="ja" hidden>カーニング</button>
              <button type="button" data-lang="en">License</button>
              <button type="button" data-lang="ko" hidden>라이선스</button>
              <button type="button" data-lang="ja" hidden>ライセンス</button>
            </div>
            <div className="mt-tab-content">
              <p data-lang="en">847 glyphs · <strong>covers Latin · Cyrillic · Greek · Hangul</strong> · stylistic alternates included.</p>
              <p data-lang="ko" hidden>글리프 847개 · <strong>Latin · Cyrillic · Greek · Hangul 지원</strong> · 스타일 대체자 포함.</p>
              <p data-lang="ja" hidden>847グリフ · <strong>Latin · Cyrillic · Greek · Hangul 対応</strong> · スタイル代替を含む。</p>
              <p data-lang="en">Includes <strong>tabular numerals, contextual ligatures, small caps</strong> for editorial typesetting.</p>
              <p data-lang="ko" hidden>편집용 식자에 필요한 <strong>tabular 숫자, 컨텍스트 합자, 소문자 대문자</strong>를 포함합니다.</p>
              <p data-lang="ja" hidden>編集組版に必要な <strong>等幅数字、コンテキスト合字、スモールキャップ</strong>を含みます。</p>
            </div>
          </div>

          {/* Plans */}
          <div className="mt-block">
            <div className="mt-block__head">
              <div>
                <div className="mt-block__num">§ XVIII · Tariff</div>
                <h2 className="mt-block__title" data-lang="en">License Tariff</h2>
                <h2 className="mt-block__title" data-lang="ko" hidden>라이선스 요금표</h2>
                <h2 className="mt-block__title" data-lang="ja" hidden>ライセンス料金表</h2>
              </div>
              <span className="mt-block__sub" data-lang="en">3 tiers · single grid</span>
              <span className="mt-block__sub" data-lang="ko" hidden>3 단계 · 단일 그리드</span>
              <span className="mt-block__sub" data-lang="ja" hidden>3段階 · 単一グリッド</span>
            </div>
            <div className="plan-grid">
              <div className="plan-cell">
                <div className="plan-cell__name" data-lang="en">Personal</div>
                <div className="plan-cell__name" data-lang="ko" hidden>개인</div>
                <div className="plan-cell__name" data-lang="ja" hidden>個人</div>
                <div className="plan-cell__price">$60<small> / once</small></div>
                <div className="plan-cell__cap" data-lang="en">For 1 designer · perpetual desktop use</div>
                <div className="plan-cell__cap" data-lang="ko" hidden>디자이너 1인 · 영구 데스크탑 사용</div>
                <div className="plan-cell__cap" data-lang="ja" hidden>デザイナー1名 · 永続デスクトップ使用</div>
                <ul>
                  <li data-lang="en">all 5 weights</li>
                  <li data-lang="ko" hidden>5 웨이트 전체</li>
                  <li data-lang="ja" hidden>5ウェイト全て</li>
                  <li data-lang="en">OTF + WOFF2 files</li>
                  <li data-lang="ko" hidden>OTF + WOFF2 파일</li>
                  <li data-lang="ja" hidden>OTF + WOFF2 ファイル</li>
                  <li className="off" data-lang="en">no web embedding</li>
                  <li className="off" data-lang="ko" hidden>웹 임베딩 없음</li>
                  <li className="off" data-lang="ja" hidden>ウェブ埋込なし</li>
                </ul>
                <button type="button" className="plan-cell__btn" data-lang="en">Order →</button>
                <button type="button" className="plan-cell__btn" data-lang="ko" hidden>주문 →</button>
                <button type="button" className="plan-cell__btn" data-lang="ja" hidden>注文 →</button>
              </div>
              <div className="plan-cell plan-cell--featured">
                <div className="plan-cell__name" data-lang="en">Studio</div>
                <div className="plan-cell__name" data-lang="ko" hidden>스튜디오</div>
                <div className="plan-cell__name" data-lang="ja" hidden>スタジオ</div>
                <div className="plan-cell__price">$240<small> / once</small></div>
                <div className="plan-cell__cap" data-lang="en">For up to 5 designers · web + desktop</div>
                <div className="plan-cell__cap" data-lang="ko" hidden>최대 5인 · 웹 + 데스크탑</div>
                <div className="plan-cell__cap" data-lang="ja" hidden>最大5名 · ウェブ + デスクトップ</div>
                <ul>
                  <li data-lang="en">all 5 weights + italic</li>
                  <li data-lang="ko" hidden>5 웨이트 + 이탤릭</li>
                  <li data-lang="ja" hidden>5ウェイト + イタリック</li>
                  <li data-lang="en">OTF + WOFF2 + VAR</li>
                  <li data-lang="ko" hidden>OTF + WOFF2 + VAR</li>
                  <li data-lang="ja" hidden>OTF + WOFF2 + VAR</li>
                  <li data-lang="en">unlimited web embed</li>
                  <li data-lang="ko" hidden>무제한 웹 임베딩</li>
                  <li data-lang="ja" hidden>無制限ウェブ埋込</li>
                  <li data-lang="en">priority support</li>
                  <li data-lang="ko" hidden>우선 지원</li>
                  <li data-lang="ja" hidden>優先サポート</li>
                </ul>
                <button type="button" className="plan-cell__btn" data-lang="en">Order →</button>
                <button type="button" className="plan-cell__btn" data-lang="ko" hidden>주문 →</button>
                <button type="button" className="plan-cell__btn" data-lang="ja" hidden>注文 →</button>
              </div>
              <div className="plan-cell">
                <div className="plan-cell__name" data-lang="en">Foundry</div>
                <div className="plan-cell__name" data-lang="ko" hidden>주조소</div>
                <div className="plan-cell__name" data-lang="ja" hidden>鋳造所</div>
                <div className="plan-cell__price">$960<small> / once</small></div>
                <div className="plan-cell__cap" data-lang="en">Unlimited seats · custom adjustments</div>
                <div className="plan-cell__cap" data-lang="ko" hidden>무제한 시트 · 커스텀 조정</div>
                <div className="plan-cell__cap" data-lang="ja" hidden>無制限シート · カスタム調整</div>
                <ul>
                  <li data-lang="en">all Studio features</li>
                  <li data-lang="ko" hidden>Studio 전체 기능</li>
                  <li data-lang="ja" hidden>Studio全機能</li>
                  <li data-lang="en">custom kerning</li>
                  <li data-lang="ko" hidden>커스텀 커닝</li>
                  <li data-lang="ja" hidden>カスタムカーニング</li>
                  <li data-lang="en">private variant cut</li>
                  <li data-lang="ko" hidden>전용 변형 컷</li>
                  <li data-lang="ja" hidden>専用バリアントカット</li>
                  <li data-lang="en">source files</li>
                  <li data-lang="ko" hidden>소스 파일</li>
                  <li data-lang="ja" hidden>ソースファイル</li>
                </ul>
                <button type="button" className="plan-cell__btn" data-lang="en">Contact →</button>
                <button type="button" className="plan-cell__btn" data-lang="ko" hidden>문의 →</button>
                <button type="button" className="plan-cell__btn" data-lang="ja" hidden>問合せ →</button>
              </div>
            </div>
          </div>

          {/* Badges + Shortcuts */}
          <div className="mt-block">
            <div className="mt-block__head">
              <div>
                <div className="mt-block__num">§ XIX · Labels</div>
                <h2 className="mt-block__title" data-lang="en">Marks & Keys</h2>
                <h2 className="mt-block__title" data-lang="ko" hidden>마크와 키</h2>
                <h2 className="mt-block__title" data-lang="ja" hidden>マークとキー</h2>
              </div>
              <span className="mt-block__sub" data-lang="en">badges · keyboard reference</span>
              <span className="mt-block__sub" data-lang="ko" hidden>배지 · 키보드 참조</span>
              <span className="mt-block__sub" data-lang="ja" hidden>バッジ · キーボードリファレンス</span>
            </div>
            <div className="mt-badges" style={{marginBottom: 28}}>
              <span className="mt-badge mt-badge--solid">REV. A</span>
              <span className="mt-badge">MMXXVI</span>
              <span className="mt-badge mt-badge--dot" data-lang="en">In Press</span>
              <span className="mt-badge mt-badge--dot" data-lang="ko" hidden>인쇄 중</span>
              <span className="mt-badge mt-badge--dot" data-lang="ja" hidden>印刷中</span>
              <span className="mt-badge mt-badge--ghost">UTF-8</span>
              <span className="mt-badge mt-badge--ghost">A4 · 210×297</span>
              <span className="mt-badge mt-badge--solid">v2.4.1</span>
              <span className="mt-badge" data-lang="en">SPECIMEN</span>
              <span className="mt-badge" data-lang="ko" hidden>스페시멘</span>
              <span className="mt-badge" data-lang="ja" hidden>スペシメン</span>
            </div>
            <div className="mt-shortcuts">
              <div className="mt-shortcut"><span data-lang="en">Next glyph</span><span data-lang="ko" hidden>다음 글리프</span><span data-lang="ja" hidden>次のグリフ</span><span className="mt-shortcut__keys"><kbd>→</kbd></span></div>
              <div className="mt-shortcut"><span data-lang="en">Toggle grid</span><span data-lang="ko" hidden>그리드 토글</span><span data-lang="ja" hidden>グリッド切替</span><span className="mt-shortcut__keys"><kbd>G</kbd></span></div>
              <div className="mt-shortcut"><span data-lang="en">Increase weight</span><span data-lang="ko" hidden>웨이트 증가</span><span data-lang="ja" hidden>ウェイト増加</span><span className="mt-shortcut__keys"><kbd>⌥</kbd><span>+</span><kbd>↑</kbd></span></div>
              <div className="mt-shortcut"><span data-lang="en">Open inspector</span><span data-lang="ko" hidden>인스펙터 열기</span><span data-lang="ja" hidden>インスペクタを開く</span><span className="mt-shortcut__keys"><kbd>I</kbd></span></div>
              <div className="mt-shortcut"><span data-lang="en">Copy glyph</span><span data-lang="ko" hidden>글리프 복사</span><span data-lang="ja" hidden>グリフコピー</span><span className="mt-shortcut__keys"><kbd>⌘</kbd><span>+</span><kbd>C</kbd></span></div>
              <div className="mt-shortcut"><span data-lang="en">Print sheet</span><span data-lang="ko" hidden>시트 인쇄</span><span data-lang="ja" hidden>シート印刷</span><span className="mt-shortcut__keys"><kbd>⌘</kbd><span>+</span><kbd>P</kbd></span></div>
            </div>
          </div>

          {/* Changelog */}
          <div className="mt-block">
            <div className="mt-block__head">
              <div>
                <div className="mt-block__num">§ XX · Press Record</div>
                <h2 className="mt-block__title" data-lang="en">Edition History</h2>
                <h2 className="mt-block__title" data-lang="ko" hidden>판본 이력</h2>
                <h2 className="mt-block__title" data-lang="ja" hidden>版本履歴</h2>
              </div>
              <span className="mt-block__sub" data-lang="en">4 cuts · across 4 years</span>
              <span className="mt-block__sub" data-lang="ko" hidden>4종 컷 · 4년에 걸쳐</span>
              <span className="mt-block__sub" data-lang="ja" hidden>4種カット · 4年にわたって</span>
            </div>
            <div className="mt-changelog">
              <div className="mt-entry">
                <div className="mt-entry__date">v1.0.0<small>2022 · MAR</small></div>
                <div>
                  <div className="mt-entry__title" data-lang="en">first metal cut</div>
                  <div className="mt-entry__title" data-lang="ko" hidden>최초 금속 컷</div>
                  <div className="mt-entry__title" data-lang="ja" hidden>初の金属カット</div>
                  <div className="mt-entry__body" data-lang="en">5 weights · Latin only · cast at the Lange foundry, Berlin.</div>
                  <div className="mt-entry__body" data-lang="ko" hidden>5 웨이트 · 라틴 전용 · 베를린 Lange 주조소에서 주조.</div>
                  <div className="mt-entry__body" data-lang="ja" hidden>5ウェイト · ラテンのみ · ベルリンのLange鋳造所で鋳造。</div>
                </div>
              </div>
              <div className="mt-entry">
                <div className="mt-entry__date">v1.4.0<small>2023 · NOV</small></div>
                <div>
                  <div className="mt-entry__title" data-lang="en">cyrillic + greek extensions</div>
                  <div className="mt-entry__title" data-lang="ko" hidden>키릴 + 그리스 확장</div>
                  <div className="mt-entry__title" data-lang="ja" hidden>キリル + ギリシャ拡張</div>
                  <div className="mt-entry__body" data-lang="en">added 142 cyrillic and 84 greek glyphs · revised x-height to 520 units.</div>
                  <div className="mt-entry__body" data-lang="ko" hidden>키릴 142자, 그리스 84자 추가 · x-height을 520 단위로 수정.</div>
                  <div className="mt-entry__body" data-lang="ja" hidden>キリル142字、ギリシャ84字追加 · x-heightを520単位に修正。</div>
                </div>
              </div>
              <div className="mt-entry">
                <div className="mt-entry__date">v2.0.0<small>2025 · JAN</small></div>
                <div>
                  <div className="mt-entry__title" data-lang="en">variable axis cut</div>
                  <div className="mt-entry__title" data-lang="ko" hidden>가변축 컷</div>
                  <div className="mt-entry__title" data-lang="ja" hidden>可変軸カット</div>
                  <div className="mt-entry__body" data-lang="en">single variable file · weight axis 100→900 · italic axis added.</div>
                  <div className="mt-entry__body" data-lang="ko" hidden>단일 가변 파일 · 웨이트축 100→900 · 이탤릭축 추가.</div>
                  <div className="mt-entry__body" data-lang="ja" hidden>単一可変ファイル · ウェイト軸 100→900 · イタリック軸追加。</div>
                </div>
              </div>
              <div className="mt-entry">
                <div className="mt-entry__date">v2.4.1<small>2026 · MAR · now</small></div>
                <div>
                  <div className="mt-entry__title" data-lang="en">hangul cut · 1024 glyphs</div>
                  <div className="mt-entry__title" data-lang="ko" hidden>한글 컷 · 1024 글리프</div>
                  <div className="mt-entry__title" data-lang="ja" hidden>ハングルカット · 1024グリフ</div>
                  <div className="mt-entry__body" data-lang="en">first hangul cut at matching x-height · designed for editorial typesetting in mixed scripts.</div>
                  <div className="mt-entry__body" data-lang="ko" hidden>일치하는 x-height의 첫 한글 컷 · 혼용 스크립트 편집 식자용으로 설계.</div>
                  <div className="mt-entry__body" data-lang="ja" hidden>一致するx-heightの初ハングルカット · 混在スクリプトの編集組版向けに設計。</div>
                </div>
              </div>
            </div>
          </div>

          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Mono Type style — typography-only hierarchy on pure black.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #111111{"\n"}--text: #eeeeee{"\n"}--accent: #eeeeee{"\n"}--text-muted: #666666{"\n"}--border: rgba(238, 238, 238, 0.1){"\n"}No other colors.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Heading: "Noto Sans" sans-serif, 700 weight, tracking -0.06em{"\n"}Label: "Space Mono" monospace, 400 / 700 weight, uppercase, tracking 0.08em–0.15em{"\n"}Body: "Noto Sans" sans-serif, 300 weight{"\n"}Scale: 11 / 12 / 13 / 15 / 17 / 48 / 120px (clamp(3rem, 9vw, 7.5rem)){"\n"}Body line-height: 1.85{"\n"}Heading line-height: 0.92{"\n"}Label sizes: 0.7rem (cell-num), 0.75rem (label), 0.82rem (nav), 0.85rem (h2){"\n"}{"\n"}UI:{"\n"}- No cards — content sits directly on background{"\n"}- Hero: border-bottom 1px solid var(--border), padding-bottom 40px, margin-top 48px{"\n"}- Grid: 2-column, gap 1px with background var(--border) as visible grid lines, border 1px solid var(--border){"\n"}- Cells: padding 28px 24px, background var(--bg) to reveal grid lines{"\n"}- Cell numbers: "Space Mono" 0.7rem, var(--text-muted), tracking 0.1em{"\n"}- Prompt section: border-top 1px solid var(--border), margin-top 48px, padding-top 28px{"\n"}- Buttons: border-radius 0, 1px solid var(--border), transparent background, "Space Mono" 0.78rem uppercase, tracking 0.1em, hover inverts to white bg + black text{"\n"}{"\n"}LAYOUT:{"\n"}- Container: min(960px, 90vw) centered, padding 32px 0 80px{"\n"}- Top bar: flex space-between, "Space Mono" 0.82rem uppercase{"\n"}- Lead paragraph: max-width 620px, margin-top 28px{"\n"}- Grid: grid-template-columns 1fr 1fr, gap 1px{"\n"}{"\n"}MOTION:{"\n"}- Cell entrance: opacity 0 to 1, 0.5s ease, stagger 0.1s per cell{"\n"}- Button hover: all 0.2s ease (background + color inversion){"\n"}- No transform animations — only opacity{"\n"}{"\n"}RESPONSIVE:{"\n"}- Below 600px: grid-template-columns 1fr (single column), title clamps down to 3rem, cell padding 20px 16px{"\n"}- Above 600px: strict 2-column grid, container 90vw max 960px{"\n"}{"\n"}FORBIDDEN:{"\n"}- No color of any kind — strictly #111111, #eeeeee, #666666{"\n"}- No border-radius on any element — all corners sharp (border-radius: 0){"\n"}- No decorative elements (icons, illustrations, images, gradients){"\n"}- No box-shadow{"\n"}- No font-weight above 300 for body text{"\n"}{"\n"}OUTPUT:{"\n"}1. Single HTML file with inline CSS{"\n"}2. Extreme type scale: 7.5rem heading vs 300-weight body{"\n"}3. "Space Mono" monospace labels with uppercase and wide tracking{"\n"}4. 2-column grid with 1px visible line separators{"\n"}5. Invert-on-hover square buttons{"\n"}6. Responsive single-column fallback at 600px</pre>
            <pre data-lang="ko" hidden>Mono Type 스타일의 랜딩 페이지를 디자인해줘 — 순수 블랙 위의 타이포그래피 전용 위계.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #111111{"\n"}--text: #eeeeee{"\n"}--accent: #eeeeee{"\n"}--text-muted: #666666{"\n"}--border: rgba(238, 238, 238, 0.1){"\n"}다른 색상 사용 금지.{"\n"}{"\n"}타이포그래피:{"\n"}제목: "Noto Sans" sans-serif, 700 weight, tracking -0.06em{"\n"}라벨: "Space Mono" monospace, 400 / 700 weight, uppercase, tracking 0.08em–0.15em{"\n"}본문: "Noto Sans" sans-serif, 300 weight{"\n"}스케일: 11 / 12 / 13 / 15 / 17 / 48 / 120px (clamp(3rem, 9vw, 7.5rem)){"\n"}본문 line-height: 1.85{"\n"}제목 line-height: 0.92{"\n"}라벨 사이즈: 0.7rem(셀 번호), 0.75rem(라벨), 0.82rem(내비게이션), 0.85rem(h2){"\n"}{"\n"}UI:{"\n"}- 카드 없음 — 콘텐츠가 배경 위에 직접 배치{"\n"}- 히어로: border-bottom 1px solid var(--border), padding-bottom 40px, margin-top 48px{"\n"}- 그리드: 2열, gap 1px에 background var(--border)로 그리드 라인 표시, border 1px solid var(--border){"\n"}- 셀: padding 28px 24px, background var(--bg)로 그리드 라인 노출{"\n"}- 셀 번호: "Space Mono" 0.7rem, var(--text-muted), tracking 0.1em{"\n"}- 프롬프트 섹션: border-top 1px solid var(--border), margin-top 48px, padding-top 28px{"\n"}- 버튼: border-radius 0, 1px solid var(--border), 투명 배경, "Space Mono" 0.78rem uppercase, tracking 0.1em, hover시 흰색 배경 + 검정 텍스트로 반전{"\n"}{"\n"}레이아웃:{"\n"}- 컨테이너: min(960px, 90vw) 중앙정렬, padding 32px 0 80px{"\n"}- 상단 바: flex space-between, "Space Mono" 0.82rem uppercase{"\n"}- 리드 문단: max-width 620px, margin-top 28px{"\n"}- 그리드: grid-template-columns 1fr 1fr, gap 1px{"\n"}{"\n"}모션:{"\n"}- 셀 등장: opacity 0→1, 0.5s ease, 셀당 0.1s 순차 지연{"\n"}- 버튼 hover: all 0.2s ease (배경 + 텍스트 색상 반전){"\n"}- transform 애니메이션 없음 — opacity만 사용{"\n"}{"\n"}반응형:{"\n"}- 600px 미만: grid-template-columns 1fr (단일 열), 제목 최소 3rem, 셀 padding 20px 16px{"\n"}- 600px 이상: 엄격한 2열 그리드, 컨테이너 90vw 최대 960px{"\n"}{"\n"}금지사항:{"\n"}- 어떤 색상도 사용 금지 — 오직 #111111, #eeeeee, #666666만{"\n"}- 모든 요소에 border-radius 금지 — 전부 직각 (border-radius: 0){"\n"}- 장식 요소(아이콘, 일러스트, 이미지, 그라디언트) 금지{"\n"}- box-shadow 금지{"\n"}- 본문 텍스트에 300 초과 font-weight 금지{"\n"}{"\n"}출력:{"\n"}1. 인라인 CSS가 포함된 단일 HTML 파일{"\n"}2. 극단적 타이프 스케일: 7.5rem 제목 vs 300 weight 본문{"\n"}3. uppercase와 넓은 tracking의 "Space Mono" 모노스페이스 라벨{"\n"}4. 1px 가시적 라인 구분자가 있는 2열 그리드{"\n"}5. hover시 반전되는 정사각 모서리 버튼{"\n"}6. 600px에서의 반응형 단일 열 폴백</pre>
            <pre data-lang="ja" hidden>Mono Typeスタイルのランディングページをデザインしてください — ピュアブラック上のタイポグラフィのみの階層。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #111111{"\n"}--text: #eeeeee{"\n"}--accent: #eeeeee{"\n"}--text-muted: #666666{"\n"}--border: rgba(238, 238, 238, 0.1){"\n"}他の色は使用禁止。{"\n"}{"\n"}タイポグラフィ:{"\n"}見出し: "Noto Sans" sans-serif, 700 weight, tracking -0.06em{"\n"}ラベル: "Space Mono" monospace, 400 / 700 weight, uppercase, tracking 0.08em–0.15em{"\n"}本文: "Noto Sans" sans-serif, 300 weight{"\n"}スケール: 11 / 12 / 13 / 15 / 17 / 48 / 120px (clamp(3rem, 9vw, 7.5rem)){"\n"}本文 line-height: 1.85{"\n"}見出し line-height: 0.92{"\n"}ラベルサイズ: 0.7rem（セル番号）, 0.75rem（ラベル）, 0.82rem（ナビ）, 0.85rem（h2）{"\n"}{"\n"}UI:{"\n"}- カードなし — コンテンツが背景上に直接配置{"\n"}- ヒーロー: border-bottom 1px solid var(--border), padding-bottom 40px, margin-top 48px{"\n"}- グリッド: 2列, gap 1pxにbackground var(--border)でグリッドライン表示, border 1px solid var(--border){"\n"}- セル: padding 28px 24px, background var(--bg)でグリッドライン露出{"\n"}- セル番号: "Space Mono" 0.7rem, var(--text-muted), tracking 0.1em{"\n"}- プロンプトセクション: border-top 1px solid var(--border), margin-top 48px, padding-top 28px{"\n"}- ボタン: border-radius 0, 1px solid var(--border), 透明背景, "Space Mono" 0.78rem uppercase, tracking 0.1em, hover時白背景 + 黒テキストに反転{"\n"}{"\n"}レイアウト:{"\n"}- コンテナ: min(960px, 90vw) 中央揃え, padding 32px 0 80px{"\n"}- トップバー: flex space-between, "Space Mono" 0.82rem uppercase{"\n"}- リード段落: max-width 620px, margin-top 28px{"\n"}- グリッド: grid-template-columns 1fr 1fr, gap 1px{"\n"}{"\n"}モーション:{"\n"}- セル登場: opacity 0→1, 0.5s ease, セルごとに0.1s順次遅延{"\n"}- ボタンhover: all 0.2s ease（背景 + テキスト色の反転）{"\n"}- transformアニメーションなし — opacityのみ{"\n"}{"\n"}レスポンシブ:{"\n"}- 600px未満: grid-template-columns 1fr（単一列）, タイトル最小3rem, セルpadding 20px 16px{"\n"}- 600px以上: 厳格な2列グリッド, コンテナ90vw最大960px{"\n"}{"\n"}禁止事項:{"\n"}- 一切のカラー禁止 — #111111, #eeeeee, #666666のみ{"\n"}- 全要素にborder-radius禁止 — すべてシャープエッジ（border-radius: 0）{"\n"}- 装飾要素（アイコン、イラスト、画像、グラデーション）禁止{"\n"}- box-shadow禁止{"\n"}- 本文テキストに300超のfont-weight禁止{"\n"}{"\n"}出力:{"\n"}1. インラインCSS付きの単一HTMLファイル{"\n"}2. 極端なタイプスケール: 7.5rem見出し vs 300 weight本文{"\n"}3. uppercaseと広いtrackingの"Space Mono"モノスペースラベル{"\n"}4. 1px可視ライン区切りのある2列グリッド{"\n"}5. hover時反転するシャープコーナーボタン{"\n"}6. 600pxでのレスポンシブ単一列フォールバック</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/zen-minimalism.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Zen Minimalism</span></a><div className="page-nav__divider" /><a href="/pages/duotone-bold.html"><span><span className="page-nav__label">다음</span>Duotone Bold</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
