import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedBentoBloomPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--bento-bloom">
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
            <div className="hero-blooms" aria-hidden="true">
              <svg className="hero-bloom hero-bloom--1" viewBox="0 0 80 80" fill="none">
                <g><circle cx="40" cy="20" r="14" fill="currentColor" opacity="0.85" /><circle cx="60" cy="40" r="14" fill="currentColor" opacity="0.85" /><circle cx="40" cy="60" r="14" fill="currentColor" opacity="0.85" /><circle cx="20" cy="40" r="14" fill="currentColor" opacity="0.85" /><circle cx="40" cy="40" r="10" fill="#fff" /></g>
              </svg>
              <svg className="hero-bloom hero-bloom--2" viewBox="0 0 60 60" fill="none">
                <g><circle cx="30" cy="14" r="10" fill="currentColor" opacity="0.9" /><circle cx="46" cy="30" r="10" fill="currentColor" opacity="0.9" /><circle cx="30" cy="46" r="10" fill="currentColor" opacity="0.9" /><circle cx="14" cy="30" r="10" fill="currentColor" opacity="0.9" /><circle cx="30" cy="30" r="7" fill="#fff" /></g>
              </svg>
              <svg className="hero-bloom hero-bloom--3" viewBox="0 0 40 40" fill="none">
                <g><circle cx="20" cy="10" r="7" fill="currentColor" /><circle cx="30" cy="20" r="7" fill="currentColor" /><circle cx="20" cy="30" r="7" fill="currentColor" /><circle cx="10" cy="20" r="7" fill="currentColor" /><circle cx="20" cy="20" r="4" fill="#fff" /></g>
              </svg>
              <span className="hero-dot hero-dot--a" />
              <span className="hero-dot hero-dot--b" />
              <span className="hero-dot hero-dot--c" />
            </div>
            <div className="hero-eyebrow">
              <span className="hero-tag" data-lang="en">N° 002 · Soft &amp; Modular</span>
              <span className="hero-tag" data-lang="ko" hidden>N° 002 · 부드럽고 모듈러한</span>
              <span className="hero-tag" data-lang="ja" hidden>N° 002 · ソフト &amp; モジュラー</span>
              <span className="hero-chip hero-chip--mint" data-lang="en">Friendly</span>
              <span className="hero-chip hero-chip--mint" data-lang="ko" hidden>친화적</span>
              <span className="hero-chip hero-chip--mint" data-lang="ja" hidden>親しみやすい</span>
              <span className="hero-chip hero-chip--peach" data-lang="en">Pastel</span>
              <span className="hero-chip hero-chip--peach" data-lang="ko" hidden>파스텔</span>
              <span className="hero-chip hero-chip--peach" data-lang="ja" hidden>パステル</span>
              <span className="hero-chip hero-chip--lav" data-lang="en">Modular</span>
              <span className="hero-chip hero-chip--lav" data-lang="ko" hidden>모듈러</span>
              <span className="hero-chip hero-chip--lav" data-lang="ja" hidden>モジュラー</span>
            </div>
            <h1>SOFT BENTO
              UI SYSTEM</h1>
            <p className="lead" data-lang="en">
              A friendly style combining soft colors with modular boxes. Well-suited for dashboards, education, and community pages. Your prompt should include "pastel tones," "large corner radius," and "irregular bento grid" together.
            </p>
            <p className="lead" data-lang="ko" hidden>
              부드러운 색상과 모듈형 박스를 결합한 친화적인 스타일입니다. 대시보드, 교육, 커뮤니티 페이지에
              잘 맞습니다. 프롬프트에는 "파스텔 톤", "큰 모서리", "불규칙 벤토 그리드"를 같이 넣어야 합니다.
            </p>
            <p className="lead" data-lang="ja" hidden>
              柔らかい色合いとモジュラーボックスを組み合わせた親しみやすいスタイルです。ダッシュボード、教育、コミュニティページに適しています。プロンプトには「パステルトーン」「大きな角丸」「不規則なBentoグリッド」を一緒に含める必要があります。
            </p>
            <dl className="hero-stats">
              <div className="hero-stats__cell">
                <dt data-lang="en">Tiles</dt>
                <dt data-lang="ko" hidden>타일</dt>
                <dt data-lang="ja" hidden>タイル</dt>
                <dd>12</dd>
              </div>
              <div className="hero-stats__cell">
                <dt data-lang="en">Palette</dt>
                <dt data-lang="ko" hidden>팔레트</dt>
                <dt data-lang="ja" hidden>パレット</dt>
                <dd>3<span>pastel</span></dd>
              </div>
              <div className="hero-stats__cell">
                <dt data-lang="en">Radius</dt>
                <dt data-lang="ko" hidden>곡률</dt>
                <dt data-lang="ja" hidden>角丸</dt>
                <dd>18px<span>min</span></dd>
              </div>
              <div className="hero-stats__cell">
                <dt data-lang="en">Mood</dt>
                <dt data-lang="ko" hidden>무드</dt>
                <dt data-lang="ja" hidden>ムード</dt>
                <dd>Playful</dd>
              </div>
            </dl>
            {/* Bento Grid */}
            <div className="bento">
              {/* Tile 1: Color System (span 4, mint) */}
              <article className="tile tile--colors" data-lang="en">
                <div className="tile-label">Color System</div>
                <div className="color-swatches">
                  <div className="swatch">
                    <div className="swatch-circle" style={{background: 'var(--mint)'}} />
                    <span className="swatch-hex">#BDF2E0</span>
                  </div>
                  <div className="swatch">
                    <div className="swatch-circle" style={{background: 'var(--peach)'}} />
                    <span className="swatch-hex">#FFD9BF</span>
                  </div>
                  <div className="swatch">
                    <div className="swatch-circle" style={{background: 'var(--lav)'}} />
                    <span className="swatch-hex">#D9CBFF</span>
                  </div>
                </div>
              </article>
              <article className="tile tile--colors" data-lang="ko" hidden>
                <div className="tile-label">색상 시스템</div>
                <div className="color-swatches">
                  <div className="swatch">
                    <div className="swatch-circle" style={{background: 'var(--mint)'}} />
                    <span className="swatch-hex">#BDF2E0</span>
                  </div>
                  <div className="swatch">
                    <div className="swatch-circle" style={{background: 'var(--peach)'}} />
                    <span className="swatch-hex">#FFD9BF</span>
                  </div>
                  <div className="swatch">
                    <div className="swatch-circle" style={{background: 'var(--lav)'}} />
                    <span className="swatch-hex">#D9CBFF</span>
                  </div>
                </div>
              </article>
              <article className="tile tile--colors" data-lang="ja" hidden>
                <div className="tile-label">カラーシステム</div>
                <div className="color-swatches">
                  <div className="swatch">
                    <div className="swatch-circle" style={{background: 'var(--mint)'}} />
                    <span className="swatch-hex">#BDF2E0</span>
                  </div>
                  <div className="swatch">
                    <div className="swatch-circle" style={{background: 'var(--peach)'}} />
                    <span className="swatch-hex">#FFD9BF</span>
                  </div>
                  <div className="swatch">
                    <div className="swatch-circle" style={{background: 'var(--lav)'}} />
                    <span className="swatch-hex">#D9CBFF</span>
                  </div>
                </div>
              </article>
              {/* Tile 2: Typography (span 2, peach) */}
              <article className="tile tile--type" data-lang="en">
                <div className="tile-label">Typography</div>
                <div className="typo-specimen">Jua</div>
                <div className="typo-aa">Aa Bb Cc</div>
                <div className="typo-info">Display: Jua 400<br />Body: Nunito 500 / 700</div>
              </article>
              <article className="tile tile--type" data-lang="ko" hidden>
                <div className="tile-label">타이포그래피</div>
                <div className="typo-specimen">Jua</div>
                <div className="typo-aa">가나다라</div>
                <div className="typo-info">제목: Jua 400<br />본문: Nunito 500 / 700</div>
              </article>
              <article className="tile tile--type" data-lang="ja" hidden>
                <div className="tile-label">タイポグラフィ</div>
                <div className="typo-specimen">Jua</div>
                <div className="typo-aa">Aa Bb Cc</div>
                <div className="typo-info">見出し: Jua 400<br />本文: Nunito 500 / 700</div>
              </article>
              {/* Tile 3: Radius Scale (span 2, white) */}
              <article className="tile tile--radius" data-lang="en">
                <div className="tile-label">Radius Scale</div>
                <div className="radius-demo">
                  <div className="radius-box" />
                  <span className="radius-label">8px</span>
                  <div className="radius-box" />
                  <span className="radius-label">18px</span>
                  <div className="radius-box" />
                  <span className="radius-label">30px</span>
                </div>
              </article>
              <article className="tile tile--radius" data-lang="ko" hidden>
                <div className="tile-label">곡률 스케일</div>
                <div className="radius-demo">
                  <div className="radius-box" />
                  <span className="radius-label">8px</span>
                  <div className="radius-box" />
                  <span className="radius-label">18px</span>
                  <div className="radius-box" />
                  <span className="radius-label">30px</span>
                </div>
              </article>
              <article className="tile tile--radius" data-lang="ja" hidden>
                <div className="tile-label">角丸スケール</div>
                <div className="radius-demo">
                  <div className="radius-box" />
                  <span className="radius-label">8px</span>
                  <div className="radius-box" />
                  <span className="radius-label">18px</span>
                  <div className="radius-box" />
                  <span className="radius-label">30px</span>
                </div>
              </article>
              {/* Tile 4: Grid System (span 2, lavender) */}
              <article className="tile tile--grid" data-lang="en">
                <div className="tile-label">Grid System</div>
                <div className="grid-demo">
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                </div>
              </article>
              <article className="tile tile--grid" data-lang="ko" hidden>
                <div className="tile-label">그리드 시스템</div>
                <div className="grid-demo">
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                </div>
              </article>
              <article className="tile tile--grid" data-lang="ja" hidden>
                <div className="tile-label">グリッドシステム</div>
                <div className="grid-demo">
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot active" />
                  <div className="grid-dot" />
                  <div className="grid-dot" />
                </div>
              </article>
              {/* Tile 5: Components (span 2, white) */}
              <article className="tile tile--components" data-lang="en">
                <div className="tile-label">Components</div>
                <div className="mini-components">
                  <div className="mini-pill">Get Started</div>
                  <div className="mini-tag">New</div>
                  <div className="mini-toggle" />
                </div>
              </article>
              <article className="tile tile--components" data-lang="ko" hidden>
                <div className="tile-label">컴포넌트</div>
                <div className="mini-components">
                  <div className="mini-pill">시작하기</div>
                  <div className="mini-tag">New</div>
                  <div className="mini-toggle" />
                </div>
              </article>
              <article className="tile tile--components" data-lang="ja" hidden>
                <div className="tile-label">コンポーネント</div>
                <div className="mini-components">
                  <div className="mini-pill">始める</div>
                  <div className="mini-tag">New</div>
                  <div className="mini-toggle" />
                </div>
              </article>
              {/* Tile 6: Motto (span 3, mint) */}
              <article className="tile tile--motto" data-lang="en">
                <div className="motto">Friendly,<br />Modular,<br />Playful</div>
              </article>
              <article className="tile tile--motto" data-lang="ko" hidden>
                <div className="motto">친화적,<br />모듈형,<br />유쾌한</div>
              </article>
              <article className="tile tile--motto" data-lang="ja" hidden>
                <div className="motto">親しみやすく、<br />モジュラーで、<br />遊び心のある</div>
              </article>
              {/* Tile 7: Spacing (span 3, peach) */}
              <article className="tile tile--spacing" data-lang="en">
                <div className="tile-label">Spacing</div>
                <div className="spacing-demo">
                  <div className="spacing-bar-row">
                    <div className="spacing-bar" style={{width: 32}} />
                    <span className="spacing-val">8px</span>
                  </div>
                  <div className="spacing-bar-row">
                    <div className="spacing-bar" style={{width: 56}} />
                    <span className="spacing-val">14px</span>
                  </div>
                  <div className="spacing-bar-row">
                    <div className="spacing-bar" style={{width: 80}} />
                    <span className="spacing-val">20px</span>
                  </div>
                  <div className="spacing-bar-row">
                    <div className="spacing-bar" style={{width: 128}} />
                    <span className="spacing-val">32px</span>
                  </div>
                </div>
              </article>
              <article className="tile tile--spacing" data-lang="ko" hidden>
                <div className="tile-label">여백</div>
                <div className="spacing-demo">
                  <div className="spacing-bar-row">
                    <div className="spacing-bar" style={{width: 32}} />
                    <span className="spacing-val">8px</span>
                  </div>
                  <div className="spacing-bar-row">
                    <div className="spacing-bar" style={{width: 56}} />
                    <span className="spacing-val">14px</span>
                  </div>
                  <div className="spacing-bar-row">
                    <div className="spacing-bar" style={{width: 80}} />
                    <span className="spacing-val">20px</span>
                  </div>
                  <div className="spacing-bar-row">
                    <div className="spacing-bar" style={{width: 128}} />
                    <span className="spacing-val">32px</span>
                  </div>
                </div>
              </article>
              <article className="tile tile--spacing" data-lang="ja" hidden>
                <div className="tile-label">スペーシング</div>
                <div className="spacing-demo">
                  <div className="spacing-bar-row">
                    <div className="spacing-bar" style={{width: 32}} />
                    <span className="spacing-val">8px</span>
                  </div>
                  <div className="spacing-bar-row">
                    <div className="spacing-bar" style={{width: 56}} />
                    <span className="spacing-val">14px</span>
                  </div>
                  <div className="spacing-bar-row">
                    <div className="spacing-bar" style={{width: 80}} />
                    <span className="spacing-val">20px</span>
                  </div>
                  <div className="spacing-bar-row">
                    <div className="spacing-bar" style={{width: 128}} />
                    <span className="spacing-val">32px</span>
                  </div>
                </div>
              </article>
              {/* Tile 8: Stats Counter */}
              <article className="tile tile--stats" data-lang="en">
                <div className="tile-label">Numbers</div>
                <div className="stat-rows">
                  <div className="stat-row"><span className="stat-num">24</span><span className="stat-name">Components</span></div>
                  <div className="stat-row"><span className="stat-num">12</span><span className="stat-name">Tiles</span></div>
                  <div className="stat-row"><span className="stat-num">3</span><span className="stat-name">Palettes</span></div>
                </div>
              </article>
              <article className="tile tile--stats" data-lang="ko" hidden>
                <div className="tile-label">숫자</div>
                <div className="stat-rows">
                  <div className="stat-row"><span className="stat-num">24</span><span className="stat-name">컴포넌트</span></div>
                  <div className="stat-row"><span className="stat-num">12</span><span className="stat-name">타일</span></div>
                  <div className="stat-row"><span className="stat-num">3</span><span className="stat-name">팔레트</span></div>
                </div>
              </article>
              <article className="tile tile--stats" data-lang="ja" hidden>
                <div className="tile-label">数値</div>
                <div className="stat-rows">
                  <div className="stat-row"><span className="stat-num">24</span><span className="stat-name">コンポーネント</span></div>
                  <div className="stat-row"><span className="stat-num">12</span><span className="stat-name">タイル</span></div>
                  <div className="stat-row"><span className="stat-num">3</span><span className="stat-name">パレット</span></div>
                </div>
              </article>
              {/* Tile 9: Activity sparkline */}
              <article className="tile tile--spark" data-lang="en">
                <div className="tile-label">Activity</div>
                <div className="spark-headline"><span className="spark-num">+18%</span><span className="spark-arrow">↗</span></div>
                <svg className="sparkline" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
                  <defs><linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity="0.45" /><stop offset="100%" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
                  <path d="M0 45 C 20 30, 40 38, 60 26 S 100 18, 120 22 S 160 8, 200 14 L 200 60 L 0 60 Z" fill="url(#sparkFill)" />
                  <path d="M0 45 C 20 30, 40 38, 60 26 S 100 18, 120 22 S 160 8, 200 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="200" cy="14" r="3" fill="currentColor" />
                </svg>
                <div className="spark-foot"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span></div>
              </article>
              <article className="tile tile--spark" data-lang="ko" hidden>
                <div className="tile-label">활동</div>
                <div className="spark-headline"><span className="spark-num">+18%</span><span className="spark-arrow">↗</span></div>
                <svg className="sparkline" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
                  <defs><linearGradient id="sparkFillKo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity="0.45" /><stop offset="100%" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
                  <path d="M0 45 C 20 30, 40 38, 60 26 S 100 18, 120 22 S 160 8, 200 14 L 200 60 L 0 60 Z" fill="url(#sparkFillKo)" />
                  <path d="M0 45 C 20 30, 40 38, 60 26 S 100 18, 120 22 S 160 8, 200 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="200" cy="14" r="3" fill="currentColor" />
                </svg>
                <div className="spark-foot"><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span></div>
              </article>
              <article className="tile tile--spark" data-lang="ja" hidden>
                <div className="tile-label">アクティビティ</div>
                <div className="spark-headline"><span className="spark-num">+18%</span><span className="spark-arrow">↗</span></div>
                <svg className="sparkline" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
                  <defs><linearGradient id="sparkFillJa" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity="0.45" /><stop offset="100%" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
                  <path d="M0 45 C 20 30, 40 38, 60 26 S 100 18, 120 22 S 160 8, 200 14 L 200 60 L 0 60 Z" fill="url(#sparkFillJa)" />
                  <path d="M0 45 C 20 30, 40 38, 60 26 S 100 18, 120 22 S 160 8, 200 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="200" cy="14" r="3" fill="currentColor" />
                </svg>
                <div className="spark-foot"><span>月</span><span>火</span><span>水</span><span>木</span><span>金</span></div>
              </article>
              {/* Tile 10: Community avatars */}
              <article className="tile tile--community" data-lang="en">
                <div className="tile-label">Community</div>
                <div className="avatar-stack">
                  <span className="avatar avatar--1">Y</span>
                  <span className="avatar avatar--2">M</span>
                  <span className="avatar avatar--3">K</span>
                  <span className="avatar avatar--4">+9</span>
                </div>
                <div className="community-status"><span className="live-dot" />12 online · just now</div>
              </article>
              <article className="tile tile--community" data-lang="ko" hidden>
                <div className="tile-label">커뮤니티</div>
                <div className="avatar-stack">
                  <span className="avatar avatar--1">Y</span>
                  <span className="avatar avatar--2">M</span>
                  <span className="avatar avatar--3">K</span>
                  <span className="avatar avatar--4">+9</span>
                </div>
                <div className="community-status"><span className="live-dot" />12명 접속 · 방금 전</div>
              </article>
              <article className="tile tile--community" data-lang="ja" hidden>
                <div className="tile-label">コミュニティ</div>
                <div className="avatar-stack">
                  <span className="avatar avatar--1">Y</span>
                  <span className="avatar avatar--2">M</span>
                  <span className="avatar avatar--3">K</span>
                  <span className="avatar avatar--4">+9</span>
                </div>
                <div className="community-status"><span className="live-dot" />12人オンライン · たった今</div>
              </article>
              {/* Tile 11: Mood chips */}
              <article className="tile tile--mood" data-lang="en">
                <div className="tile-label">Mood Tags</div>
                <div className="mood-chips">
                  <span className="mood-chip mood-chip--1">soft</span>
                  <span className="mood-chip mood-chip--2">cozy</span>
                  <span className="mood-chip mood-chip--3">round</span>
                  <span className="mood-chip mood-chip--4">warm</span>
                  <span className="mood-chip mood-chip--5">cheerful</span>
                  <span className="mood-chip mood-chip--6">spring</span>
                </div>
              </article>
              <article className="tile tile--mood" data-lang="ko" hidden>
                <div className="tile-label">무드 태그</div>
                <div className="mood-chips">
                  <span className="mood-chip mood-chip--1">부드러움</span>
                  <span className="mood-chip mood-chip--2">아늑함</span>
                  <span className="mood-chip mood-chip--3">둥근</span>
                  <span className="mood-chip mood-chip--4">따뜻한</span>
                  <span className="mood-chip mood-chip--5">유쾌한</span>
                  <span className="mood-chip mood-chip--6">봄</span>
                </div>
              </article>
              <article className="tile tile--mood" data-lang="ja" hidden>
                <div className="tile-label">ムードタグ</div>
                <div className="mood-chips">
                  <span className="mood-chip mood-chip--1">柔らか</span>
                  <span className="mood-chip mood-chip--2">心地よい</span>
                  <span className="mood-chip mood-chip--3">丸い</span>
                  <span className="mood-chip mood-chip--4">温かい</span>
                  <span className="mood-chip mood-chip--5">陽気</span>
                  <span className="mood-chip mood-chip--6">春</span>
                </div>
              </article>
              {/* Tile 12: Bloom illustration / CTA */}
              <article className="tile tile--bloom" data-lang="en">
                <svg className="bloom-art" viewBox="0 0 200 140" fill="none" aria-hidden="true">
                  <circle cx="60" cy="50" r="22" fill="var(--mint)" />
                  <circle cx="92" cy="50" r="22" fill="var(--mint)" />
                  <circle cx="76" cy="30" r="22" fill="var(--mint)" />
                  <circle cx="76" cy="70" r="22" fill="var(--mint)" />
                  <circle cx="76" cy="50" r="12" fill="#fff" />
                  <circle cx="140" cy="90" r="16" fill="var(--peach)" />
                  <circle cx="160" cy="76" r="16" fill="var(--peach)" />
                  <circle cx="160" cy="104" r="16" fill="var(--peach)" />
                  <circle cx="180" cy="90" r="16" fill="var(--peach)" />
                  <circle cx="160" cy="90" r="9" fill="#fff" />
                  <circle cx="40" cy="108" r="10" fill="var(--lav)" />
                  <circle cx="56" cy="120" r="10" fill="var(--lav)" />
                  <circle cx="24" cy="120" r="10" fill="var(--lav)" />
                  <circle cx="40" cy="118" r="6" fill="#fff" />
                </svg>
                <div className="bloom-msg">In full bloom.</div>
                <a className="bloom-cta" href="/#styles">Explore styles <span aria-hidden="true">→</span></a>
              </article>
              <article className="tile tile--bloom" data-lang="ko" hidden>
                <svg className="bloom-art" viewBox="0 0 200 140" fill="none" aria-hidden="true">
                  <circle cx="60" cy="50" r="22" fill="var(--mint)" />
                  <circle cx="92" cy="50" r="22" fill="var(--mint)" />
                  <circle cx="76" cy="30" r="22" fill="var(--mint)" />
                  <circle cx="76" cy="70" r="22" fill="var(--mint)" />
                  <circle cx="76" cy="50" r="12" fill="#fff" />
                  <circle cx="140" cy="90" r="16" fill="var(--peach)" />
                  <circle cx="160" cy="76" r="16" fill="var(--peach)" />
                  <circle cx="160" cy="104" r="16" fill="var(--peach)" />
                  <circle cx="180" cy="90" r="16" fill="var(--peach)" />
                  <circle cx="160" cy="90" r="9" fill="#fff" />
                  <circle cx="40" cy="108" r="10" fill="var(--lav)" />
                  <circle cx="56" cy="120" r="10" fill="var(--lav)" />
                  <circle cx="24" cy="120" r="10" fill="var(--lav)" />
                  <circle cx="40" cy="118" r="6" fill="#fff" />
                </svg>
                <div className="bloom-msg">활짝 피었어요</div>
                <a className="bloom-cta" href="/#styles">스타일 둘러보기 <span aria-hidden="true">→</span></a>
              </article>
              <article className="tile tile--bloom" data-lang="ja" hidden>
                <svg className="bloom-art" viewBox="0 0 200 140" fill="none" aria-hidden="true">
                  <circle cx="60" cy="50" r="22" fill="var(--mint)" />
                  <circle cx="92" cy="50" r="22" fill="var(--mint)" />
                  <circle cx="76" cy="30" r="22" fill="var(--mint)" />
                  <circle cx="76" cy="70" r="22" fill="var(--mint)" />
                  <circle cx="76" cy="50" r="12" fill="#fff" />
                  <circle cx="140" cy="90" r="16" fill="var(--peach)" />
                  <circle cx="160" cy="76" r="16" fill="var(--peach)" />
                  <circle cx="160" cy="104" r="16" fill="var(--peach)" />
                  <circle cx="180" cy="90" r="16" fill="var(--peach)" />
                  <circle cx="160" cy="90" r="9" fill="#fff" />
                  <circle cx="40" cy="108" r="10" fill="var(--lav)" />
                  <circle cx="56" cy="120" r="10" fill="var(--lav)" />
                  <circle cx="24" cy="120" r="10" fill="var(--lav)" />
                  <circle cx="40" cy="118" r="6" fill="#fff" />
                </svg>
                <div className="bloom-msg">満開です</div>
                <a className="bloom-cta" href="/#styles">スタイルを見る <span aria-hidden="true">→</span></a>
              </article>
            </div>
          </section>
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Bento Bloom style — pastel tile mosaic with playful, rounded modularity.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #f8f5ff{"\n"}--text: #2a2141{"\n"}--accent-1: #bdf2e0 (mint){"\n"}--accent-2: #ffd9bf (peach){"\n"}--accent-3: #d9cbff (lavender){"\n"}--tile-white: #fff{"\n"}--border: #c6bae4{"\n"}--hero-border: #d2c6ef{"\n"}--hero-bg: #ffffffb8{"\n"}Background: radial-gradient(circle at 10% 20%, #fff 0, transparent 30%), radial-gradient(circle at 92% 8%, rgba(217,203,255,0.5), transparent 26%), linear-gradient(180deg, #fcf9ff, #f8f5ff).{"\n"}No other colors.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Heading: "Jua" 400, tracking -0.02em{"\n"}Body: "Nunito" 500{"\n"}Scale: clamp(2rem, 6vw, 4.4rem) for h1{"\n"}Body line-height: 1.75{"\n"}Heading line-height: 1{"\n"}{"\n"}UI:{"\n"}Hero panel: border-radius 30px, border 2px solid #d2c6ef, bg #ffffffb8, backdrop-filter blur(3px).{"\n"}Tiles: border-radius 18px, border 1px solid #c6bae4, padding 14px. Each tile gets a distinct pastel bg from the accent palette.{"\n"}Prompt box: border-radius 18px, border 2px solid #d2c6ef, bg #fff.{"\n"}Buttons: pill shape (border-radius 999px), border 1px solid #7a63a8, color #493a74, bg #efe7ff.{"\n"}{"\n"}LAYOUT:{"\n"}Content max-width: min(1050px, 92vw){"\n"}Page padding: 28px 0 76px{"\n"}Hero padding: clamp(22px, 5vw, 44px){"\n"}Bento grid: 6 columns, gap 10px{"\n"}Tile spans: row 1 = span 3 + span 3, row 2 = span 2 + span 2 + span 2{"\n"}Lead max-width: 700px{"\n"}{"\n"}MOTION:{"\n"}Entrance: translateY(10px) scale(0.98) → translateY(0) scale(1), opacity 0 → 1, 600ms ease, stagger 80ms per tile{"\n"}Hover: none specified — keep playful but simple{"\n"}Respect prefers-reduced-motion.{"\n"}{"\n"}RESPONSIVE:{"\n"}720px: all tiles span 6 columns (full-width single column stack){"\n"}1024px: full 6-column bento grid, max-width 1050px layout{"\n"}{"\n"}FORBIDDEN:{"\n"}- Dark or saturated tones (light pastels only){"\n"}- Sharp right-angle corners (minimum border-radius 18px on tiles){"\n"}- Complex motion or 3D transforms{"\n"}- More than 3 pastel accent colors{"\n"}- Horizontal scroll at any viewport{"\n"}- Heavy drop shadows (keep surfaces flat or very subtle){"\n"}{"\n"}OUTPUT:{"\n"}1) Color + typography tokens as CSS custom properties{"\n"}2) Hero / Feature Bento (6-col irregular grid) / Community / CTA structure{"\n"}3) Semantic HTML + CSS with responsive support</pre>
            <pre data-lang="ko" hidden>Bento Bloom 스타일의 랜딩 페이지를 디자인해줘 — 파스텔 타일 모자이크에 둥글고 유쾌한 모듈 구성.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #f8f5ff{"\n"}--text: #2a2141{"\n"}--accent-1: #bdf2e0 (mint){"\n"}--accent-2: #ffd9bf (peach){"\n"}--accent-3: #d9cbff (lavender){"\n"}--tile-white: #fff{"\n"}--border: #c6bae4{"\n"}--hero-border: #d2c6ef{"\n"}--hero-bg: #ffffffb8{"\n"}배경: radial-gradient(circle at 10% 20%, #fff 0, transparent 30%), radial-gradient(circle at 92% 8%, rgba(217,203,255,0.5), transparent 26%), linear-gradient(180deg, #fcf9ff, #f8f5ff).{"\n"}다른 색상 사용 금지.{"\n"}{"\n"}타이포그래피:{"\n"}제목: "Jua" 400, tracking -0.02em{"\n"}본문: "Nunito" 500{"\n"}스케일: h1에 clamp(2rem, 6vw, 4.4rem){"\n"}본문 줄간격: 1.75{"\n"}제목 줄간격: 1{"\n"}{"\n"}UI:{"\n"}히어로 패널: border-radius 30px, border 2px solid #d2c6ef, bg #ffffffb8, backdrop-filter blur(3px).{"\n"}타일: border-radius 18px, border 1px solid #c6bae4, padding 14px. 각 타일에 고유한 파스텔 배경색 적용.{"\n"}프롬프트 박스: border-radius 18px, border 2px solid #d2c6ef, bg #fff.{"\n"}버튼: pill 형태(border-radius 999px), border 1px solid #7a63a8, color #493a74, bg #efe7ff.{"\n"}{"\n"}레이아웃:{"\n"}콘텐츠 최대 너비: min(1050px, 92vw){"\n"}페이지 패딩: 28px 0 76px{"\n"}히어로 패딩: clamp(22px, 5vw, 44px){"\n"}벤토 그리드: 6열, gap 10px{"\n"}타일 span: 1행 = span 3 + span 3, 2행 = span 2 + span 2 + span 2{"\n"}리드 최대 너비: 700px{"\n"}{"\n"}모션:{"\n"}진입: translateY(10px) scale(0.98) → translateY(0) scale(1), opacity 0 → 1, 600ms ease, 타일당 80ms 스태거{"\n"}호버: 미지정 — 유쾌하되 단순하게 유지{"\n"}prefers-reduced-motion 존중.{"\n"}{"\n"}반응형:{"\n"}720px: 모든 타일 6열 span (전체 너비 1열 스택){"\n"}1024px: 6열 벤토 그리드 전체, max-width 1050px 레이아웃{"\n"}{"\n"}금지사항:{"\n"}- 어둡거나 채도 높은 톤 (밝은 파스텔만 허용){"\n"}- 날카로운 직각 모서리 (타일 최소 border-radius 18px){"\n"}- 복잡한 모션이나 3D 트랜스폼{"\n"}- 3개 초과의 파스텔 악센트 컬러{"\n"}- 어떤 뷰포트에서도 가로 스크롤 금지{"\n"}- 강한 드롭 섀도우 (표면은 평면적이거나 매우 미묘하게){"\n"}{"\n"}출력:{"\n"}1) 색상 + 타이포그래피 토큰을 CSS 커스텀 프로퍼티로{"\n"}2) Hero / Feature Bento (6열 불규칙 그리드) / Community / CTA 구조{"\n"}3) 반응형 지원이 포함된 시맨틱 HTML + CSS</pre>
            <pre data-lang="ja" hidden>Bento Bloomスタイルのランディングページをデザインしてください — パステルタイルモザイクに丸みのある遊び心あるモジュール構成。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #f8f5ff{"\n"}--text: #2a2141{"\n"}--accent-1: #bdf2e0 (mint){"\n"}--accent-2: #ffd9bf (peach){"\n"}--accent-3: #d9cbff (lavender){"\n"}--tile-white: #fff{"\n"}--border: #c6bae4{"\n"}--hero-border: #d2c6ef{"\n"}--hero-bg: #ffffffb8{"\n"}背景: radial-gradient(circle at 10% 20%, #fff 0, transparent 30%), radial-gradient(circle at 92% 8%, rgba(217,203,255,0.5), transparent 26%), linear-gradient(180deg, #fcf9ff, #f8f5ff)。{"\n"}他の色は使用不可。{"\n"}{"\n"}タイポグラフィ:{"\n"}見出し: "Jua" 400, tracking -0.02em{"\n"}本文: "Nunito" 500{"\n"}スケール: h1にclamp(2rem, 6vw, 4.4rem){"\n"}本文行間: 1.75{"\n"}見出し行間: 1{"\n"}{"\n"}UI:{"\n"}ヒーローパネル: border-radius 30px, border 2px solid #d2c6ef, bg #ffffffb8, backdrop-filter blur(3px)。{"\n"}タイル: border-radius 18px, border 1px solid #c6bae4, padding 14px。各タイルに固有のパステル背景色を適用。{"\n"}プロンプトボックス: border-radius 18px, border 2px solid #d2c6ef, bg #fff。{"\n"}ボタン: ピル形状(border-radius 999px), border 1px solid #7a63a8, color #493a74, bg #efe7ff。{"\n"}{"\n"}レイアウト:{"\n"}コンテンツ最大幅: min(1050px, 92vw){"\n"}ページパディング: 28px 0 76px{"\n"}ヒーローパディング: clamp(22px, 5vw, 44px){"\n"}Bentoグリッド: 6列, gap 10px{"\n"}タイルspan: 1行目 = span 3 + span 3, 2行目 = span 2 + span 2 + span 2{"\n"}リード最大幅: 700px{"\n"}{"\n"}モーション:{"\n"}入場: translateY(10px) scale(0.98) → translateY(0) scale(1), opacity 0 → 1, 600ms ease, タイルごとに80msスタガー{"\n"}ホバー: 未指定 — 遊び心がありつつシンプルに{"\n"}prefers-reduced-motionを尊重。{"\n"}{"\n"}レスポンシブ:{"\n"}720px: 全タイル6列span（全幅1列スタック）{"\n"}1024px: 6列Bentoグリッド全体、max-width 1050pxレイアウト{"\n"}{"\n"}禁止事項:{"\n"}- 暗い・高彩度のトーン（明るいパステルのみ）{"\n"}- 鋭い直角コーナー（タイル最小border-radius 18px）{"\n"}- 複雑なモーションや3Dトランスフォーム{"\n"}- 3色を超えるパステルアクセントカラー{"\n"}- いかなるビューポートでも横スクロール禁止{"\n"}- 重いドロップシャドウ（表面はフラットまたは非常に微細に）{"\n"}{"\n"}出力:{"\n"}1) カラー + タイポグラフィトークンをCSSカスタムプロパティとして{"\n"}2) Hero / Feature Bento（6列不規則グリッド）/ Community / CTA構造{"\n"}3) レスポンシブ対応を含むセマンティックHTML + CSS</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/console-launch.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Console Launch</span></a><div className="page-nav__divider" /><a href="/pages/earth-atelier.html"><span><span className="page-nav__label">다음</span>Earth Atelier</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
