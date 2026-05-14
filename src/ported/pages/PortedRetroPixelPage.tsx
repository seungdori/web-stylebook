import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedRetroPixelPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--retro-pixel">
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
        <main className="page">
          <a className="skip-link" href="#main-content" data-i18n="skip">Skip to content</a>
          <nav className="site-nav" role="navigation" aria-label="Main navigation">
            <div className="site-nav__inner">
              <a className="site-nav__logo" href="/">Web Stylebook</a>
              <ul className="site-nav__links">
                <li><a href="/#styles" data-i18n="nav.styles">Styles</a></li>
                <li><a href="/pages/compare" data-i18n="nav.compare">Compare</a></li>
                <li><a href="/pages/color-system" data-i18n="nav.tips">Colors</a></li>
                <li><a href="/pages/prompt-workflow" data-i18n="nav.workflow">Workflow</a></li>
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
          {/* ===== GAME FRAME / HERO ===== */}
          <section className="game-frame">
            <div className="title-bar">
              <div className="title-bar__dots">
                <span className="title-bar__dot title-bar__dot--r" />
                <span className="title-bar__dot title-bar__dot--y" />
                <span className="title-bar__dot title-bar__dot--g" />
              </div>
              <span>RETRO_PIXEL.exe v1.0</span>
            </div>
            <div className="screen">
              <h1><em>RETRO</em> PIXEL<br />8-BIT <em>INTERFACE</em></h1>
              <p className="lead" data-lang="en">
                A style inspired by classic Game Boy, NES, and retro arcade aesthetics. Pixel-perfect borders, chunky containers, health bars, RPG dialog boxes, and CSS pixel art. Every element screams 8-bit nostalgia with a modern twist.
              </p>
              <p className="lead" data-lang="ko" hidden>
                클래식 게임보이, NES, 레트로 아케이드 미학에서 영감을 받은 스타일입니다. 픽셀 퍼펙트 테두리, 두꺼운 컨테이너, 체력 바, RPG 대화 상자, CSS 픽셀 아트로 8비트 향수를 현대적으로 재해석합니다.
              </p>
              <p className="lead" data-lang="ja" hidden>
                クラシックなゲームボーイ、NES、レトロアーケードの美学からインスピレーションを得たスタイルです。ピクセルパーフェクトなボーダー、分厚いコンテナ、HPバー、RPGダイアログボックス、CSSピクセルアートで8ビットのノスタルジアをモダンに再解釈します。
              </p>
              {/* Pixel Art Decorations */}
              <div className="pixel-decorations">
                <div>
                  <div className="pixel-heart float-anim" />
                  <div className="pixel-art-label">HP</div>
                </div>
                <div>
                  <div className="pixel-sword" />
                  <div className="pixel-art-label">ATK</div>
                </div>
                <div>
                  <div className="pixel-star float-anim" style={{animationDelay: '0.3s'}} />
                  <div className="pixel-art-label">XP</div>
                </div>
              </div>
              {/* Health / Stats Bars */}
              <div className="stats-row">
                <div className="stat-block">
                  <div className="stat-label">HP - Health</div>
                  <div className="health-bar"><div className="health-bar__fill health-bar__fill--hp" /></div>
                  <div className="stat-value">85 / 100</div>
                </div>
                <div className="stat-block">
                  <div className="stat-label">MP - Mana</div>
                  <div className="health-bar"><div className="health-bar__fill health-bar__fill--mp" /></div>
                  <div className="stat-value">62 / 100</div>
                </div>
                <div className="stat-block">
                  <div className="stat-label">XP - Experience</div>
                  <div className="health-bar"><div className="health-bar__fill health-bar__fill--xp" /></div>
                  <div className="stat-value">4500 / 10000</div>
                </div>
                <div className="stat-block">
                  <div className="stat-label">ATK - Power</div>
                  <div className="health-bar"><div className="health-bar__fill health-bar__fill--atk" /></div>
                  <div className="stat-value">78 / 100</div>
                </div>
              </div>
              {/* Score Display */}
              <div className="score-display">
                <div className="score-item">
                  <div className="score-item__label">Score</div>
                  <div className="score-item__value">089400</div>
                </div>
                <div className="score-item">
                  <div className="score-item__label">Level</div>
                  <div className="score-item__value">LV.12</div>
                </div>
                <div className="score-item">
                  <div className="score-item__label">Coins</div>
                  <div className="score-item__value">x 042</div>
                </div>
                <div className="score-item">
                  <div className="score-item__label">Time</div>
                  <div className="score-item__value">03:27</div>
                </div>
              </div>
              {/* RPG Dialog Box */}
              <div className="dialog-box">
                <div className="dialog-speaker">Old Wizard</div>
                <div className="dialog-text" data-lang="en">
                  Brave designer, you have reached the Pixel Kingdom! Will you accept the quest to build an 8-bit interface<span className="blink-cursor" />
                </div>
                <div className="dialog-text" data-lang="ko" hidden>
                  용감한 디자이너여, 픽셀 왕국에 도착했습니다! 8비트 인터페이스를 구축하는 퀘스트를 수락하시겠습니까<span className="blink-cursor" />
                </div>
                <div className="dialog-text" data-lang="ja" hidden>
                  勇敢なデザイナーよ、ピクセル王国に到着しました！8ビットインターフェースを構築するクエストを受けますか<span className="blink-cursor" />
                </div>
                <div className="dialog-choices">
                  <span className="dialog-choice" data-lang="en">YES</span>
                  <span className="dialog-choice" data-lang="en">NO</span>
                  <span className="dialog-choice" data-lang="ko" hidden>예</span>
                  <span className="dialog-choice" data-lang="ko" hidden>아니오</span>
                  <span className="dialog-choice" data-lang="ja" hidden>はい</span>
                  <span className="dialog-choice" data-lang="ja" hidden>いいえ</span>
                </div>
              </div>
              {/* Inventory Grid */}
              <h3 style={{marginTop: 20, fontSize: 10, color: 'var(--highlight)'}}>INVENTORY</h3>
              <div className="inventory">
                <div className="inv-slot inv-slot--active"><span className="inv-slot__icon">⚔</span><span className="inv-slot__count">1</span></div>
                <div className="inv-slot"><span className="inv-slot__icon">🛡</span><span className="inv-slot__count">1</span></div>
                <div className="inv-slot"><span className="inv-slot__icon">❤</span><span className="inv-slot__count">5</span></div>
                <div className="inv-slot"><span className="inv-slot__icon">⭐</span><span className="inv-slot__count">3</span></div>
                <div className="inv-slot"><span className="inv-slot__icon">💎</span><span className="inv-slot__count">12</span></div>
                <div className="inv-slot"><span className="inv-slot__icon">🔑</span><span className="inv-slot__count">2</span></div>
                <div className="inv-slot" />
                <div className="inv-slot" />
              </div>
              {/* 8-bit Buttons */}
              <div className="btn-row">
                <button className="btn-pixel btn-pixel--primary" data-lang="en">START GAME</button>
                <button className="btn-pixel btn-pixel--primary" data-lang="ko" hidden>게임 시작</button>
                <button className="btn-pixel btn-pixel--primary" data-lang="ja" hidden>ゲーム開始</button>
                <button className="btn-pixel btn-pixel--danger" data-lang="en">GAME OVER</button>
                <button className="btn-pixel btn-pixel--danger" data-lang="ko" hidden>게임 오버</button>
                <button className="btn-pixel btn-pixel--danger" data-lang="ja" hidden>ゲームオーバー</button>
              </div>
              {/* Toast Notification */}
              <div className="toast-8bit">
                <span className="toast-8bit__icon">✔</span>
                <span data-lang="en">Achievement unlocked: Pixel Master!</span>
                <span data-lang="ko" hidden>업적 달성: 픽셀 마스터!</span>
                <span data-lang="ja" hidden>実績解除: ピクセルマスター!</span>
              </div>
            </div>
          </section>

          {/* ===== PIXEL APPLICATIONS — non-game uses ===== */}
          <div className="pixel-suite-intro">
            <span className="pixel-suite-intro__line" />
            <span data-lang="en">// PIXEL ART LIVES BEYOND THE GAME</span>
            <span data-lang="ko" hidden>// 픽셀 아트는 게임 너머에도 산다</span>
            <span data-lang="ja" hidden>// ピクセルアートはゲームの外にも生きる</span>
            <span className="pixel-suite-intro__line" />
          </div>

          {/* ===== PIXEL GALLERY — icons grid ===== */}
          <section className="game-frame pixel-app pixel-app--gallery">
            <div className="title-bar">
              <div className="title-bar__dots">
                <span className="title-bar__dot title-bar__dot--r" />
                <span className="title-bar__dot title-bar__dot--y" />
                <span className="title-bar__dot title-bar__dot--g" />
              </div>
              <span>PIXEL_GALLERY.app — 8 / 8</span>
            </div>
            <div className="screen">
              <div className="pixel-app__eyebrow">
                <span data-lang="en">A sticker sheet of everyday pixel objects.</span>
                <span data-lang="ko" hidden>일상의 픽셀 오브젝트 스티커 시트.</span>
                <span data-lang="ja" hidden>日常のピクセルオブジェクトのステッカーシート。</span>
              </div>
              <div className="icon-grid">
                <div className="icon-tile">
                  <div className="icon-tile__art"><div className="px-icon px-icon--mountain" /></div>
                  <div className="pixel-art-label" data-lang="en">Mountain</div>
                  <div className="pixel-art-label" data-lang="ko" hidden>산</div>
                  <div className="pixel-art-label" data-lang="ja" hidden>山</div>
                </div>
                <div className="icon-tile">
                  <div className="icon-tile__art"><div className="px-icon px-icon--cassette" /></div>
                  <div className="pixel-art-label">Cassette</div>
                </div>
                <div className="icon-tile">
                  <div className="icon-tile__art"><div className="px-icon px-icon--cat" /></div>
                  <div className="pixel-art-label" data-lang="en">Cat</div>
                  <div className="pixel-art-label" data-lang="ko" hidden>고양이</div>
                  <div className="pixel-art-label" data-lang="ja" hidden>猫</div>
                </div>
                <div className="icon-tile">
                  <div className="icon-tile__art"><div className="px-icon px-icon--flower" /></div>
                  <div className="pixel-art-label" data-lang="en">Tulip</div>
                  <div className="pixel-art-label" data-lang="ko" hidden>튤립</div>
                  <div className="pixel-art-label" data-lang="ja" hidden>チューリップ</div>
                </div>
                <div className="icon-tile">
                  <div className="icon-tile__art"><div className="px-icon px-icon--mug" /></div>
                  <div className="pixel-art-label" data-lang="en">Coffee</div>
                  <div className="pixel-art-label" data-lang="ko" hidden>커피</div>
                  <div className="pixel-art-label" data-lang="ja" hidden>コーヒー</div>
                </div>
                <div className="icon-tile">
                  <div className="icon-tile__art"><div className="px-icon px-icon--camera" /></div>
                  <div className="pixel-art-label" data-lang="en">Camera</div>
                  <div className="pixel-art-label" data-lang="ko" hidden>카메라</div>
                  <div className="pixel-art-label" data-lang="ja" hidden>カメラ</div>
                </div>
                <div className="icon-tile">
                  <div className="icon-tile__art"><div className="px-icon px-icon--cloud" /></div>
                  <div className="pixel-art-label" data-lang="en">Cloud</div>
                  <div className="pixel-art-label" data-lang="ko" hidden>구름</div>
                  <div className="pixel-art-label" data-lang="ja" hidden>雲</div>
                </div>
                <div className="icon-tile">
                  <div className="icon-tile__art"><div className="px-icon px-icon--moon" /></div>
                  <div className="pixel-art-label" data-lang="en">Moon</div>
                  <div className="pixel-art-label" data-lang="ko" hidden>달</div>
                  <div className="pixel-art-label" data-lang="ja" hidden>月</div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== PIXEL SCENE — landscape painting ===== */}
          <section className="game-frame pixel-app pixel-app--scene">
            <div className="title-bar">
              <div className="title-bar__dots">
                <span className="title-bar__dot title-bar__dot--r" />
                <span className="title-bar__dot title-bar__dot--y" />
                <span className="title-bar__dot title-bar__dot--g" />
              </div>
              <span>PIXEL_SCENE.bmp — 256 × 144</span>
            </div>
            <div className="screen">
              <div className="pixel-app__eyebrow">
                <span data-lang="en">Pixel landscape — sunset over the ridge.</span>
                <span data-lang="ko" hidden>픽셀 풍경 — 능선 너머로 지는 해.</span>
                <span data-lang="ja" hidden>ピクセル風景 — 稜線に沈む夕日。</span>
              </div>
              <div className="scene">
                <div className="scene__star scene__star--1" />
                <div className="scene__star scene__star--2" />
                <div className="scene__star scene__star--3" />
                <div className="scene__cloud scene__cloud--1" />
                <div className="scene__cloud scene__cloud--2" />
                <div className="scene__sun" />
                <div className="scene__mountain scene__mountain--back" />
                <div className="scene__mountain scene__mountain--front" />
                <div className="scene__tree scene__tree--1" />
                <div className="scene__tree scene__tree--2" />
                <div className="scene__tree scene__tree--3" />
                <div className="scene__ground" />
                <div className="scene__path" />
              </div>
              <div className="scene-meta">
                <span>16 colors</span>
                <span aria-hidden="true">·</span>
                <span>NES palette</span>
                <span aria-hidden="true">·</span>
                <span data-lang="en">Hand-placed pixels</span>
                <span data-lang="ko" hidden>한 픽셀씩 그림</span>
                <span data-lang="ja" hidden>1ピクセルずつ描画</span>
              </div>
            </div>
          </section>

          {/* ===== PIXEL BEATS — retro cassette player ===== */}
          <section className="game-frame pixel-app pixel-app--beats">
            <div className="title-bar">
              <div className="title-bar__dots">
                <span className="title-bar__dot title-bar__dot--r" />
                <span className="title-bar__dot title-bar__dot--y" />
                <span className="title-bar__dot title-bar__dot--g" />
              </div>
              <span>PIXEL_BEATS.app — SIDE A</span>
            </div>
            <div className="screen">
              <div className="pixel-app__eyebrow">
                <span data-lang="en">Audio player styled like a 90s tape deck.</span>
                <span data-lang="ko" hidden>90년대 테이프 데크 스타일 오디오 플레이어.</span>
                <span data-lang="ja" hidden>90年代テープデッキ風のオーディオプレイヤー。</span>
              </div>
              <div className="beats">
                <div className="cassette">
                  <div className="cassette__window">
                    <div className="cassette__tape" />
                    <div className="cassette__reel cassette__reel--l">
                      <div className="cassette__reel-inner" />
                    </div>
                    <div className="cassette__reel cassette__reel--r">
                      <div className="cassette__reel-inner" />
                    </div>
                  </div>
                  <div className="cassette__label">SIDE A · MIX No. 042</div>
                </div>
                <div className="beats__track">
                  <div className="beats__now">▶ NOW PLAYING</div>
                  <div className="beats__title">PIXEL SUNSET</div>
                  <div className="beats__artist">@ retro_synth — 03:42 / 04:18</div>
                  <div className="eq">
                    <span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
                  </div>
                  <div className="beats__controls">
                    <button className="btn-pixel btn-pixel--ghost" type="button" aria-label="Previous">◀◀</button>
                    <button className="btn-pixel btn-pixel--primary" type="button" aria-label="Play">▶</button>
                    <button className="btn-pixel btn-pixel--ghost" type="button" aria-label="Next">▶▶</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== PIXEL TYPE — typography poster ===== */}
          <section className="game-frame pixel-app pixel-app--type">
            <div className="title-bar">
              <div className="title-bar__dots">
                <span className="title-bar__dot title-bar__dot--r" />
                <span className="title-bar__dot title-bar__dot--y" />
                <span className="title-bar__dot title-bar__dot--g" />
              </div>
              <span>PIXEL_TYPE.app — type specimen</span>
            </div>
            <div className="screen">
              <div className="pixel-app__eyebrow">
                <span data-lang="en">Pixel type is not just for menus.</span>
                <span data-lang="ko" hidden>픽셀 타입은 메뉴 전용이 아니다.</span>
                <span data-lang="ja" hidden>ピクセル書体はメニュー専用ではない。</span>
              </div>
              <div className="type-poster">
                <div className="type-poster__row type-poster__row--top">EVERY</div>
                <div className="type-poster__row type-poster__row--mid">PIXEL</div>
                <div className="type-poster__row type-poster__row--btm">MATTERS</div>
                <div className="type-poster__sub">— ed. 1985 / first print</div>
              </div>
              <div className="type-grid">
                <div className="type-card type-card--solid">
                  <div className="type-card__sample">Aa</div>
                  <div className="type-card__name">SOLID</div>
                </div>
                <div className="type-card type-card--outline">
                  <div className="type-card__sample">Aa</div>
                  <div className="type-card__name">OUTLINE</div>
                </div>
                <div className="type-card type-card--shadow">
                  <div className="type-card__sample">Aa</div>
                  <div className="type-card__name">SHADOW</div>
                </div>
                <div className="type-card type-card--neon">
                  <div className="type-card__sample">Aa</div>
                  <div className="type-card__name">NEON</div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== PIXEL DESK — weather widget ===== */}
          <section className="game-frame pixel-app pixel-app--desk">
            <div className="title-bar">
              <div className="title-bar__dots">
                <span className="title-bar__dot title-bar__dot--r" />
                <span className="title-bar__dot title-bar__dot--y" />
                <span className="title-bar__dot title-bar__dot--g" />
              </div>
              <span>PIXEL_DESK.os — widgets</span>
            </div>
            <div className="screen">
              <div className="pixel-app__eyebrow">
                <span data-lang="en">Desktop widgets, 8-bit edition.</span>
                <span data-lang="ko" hidden>데스크탑 위젯, 8비트 에디션.</span>
                <span data-lang="ja" hidden>デスクトップウィジェット、8ビット版。</span>
              </div>
              <div className="desk-grid">
                <div className="desk-card weather-card">
                  <div className="weather-card__head">
                    <span>SEOUL</span>
                    <span>TUE 14</span>
                  </div>
                  <div className="weather-card__body">
                    <div className="px-icon px-icon--sun weather-card__art" />
                    <div className="weather-card__temp">
                      <span className="weather-card__temp-num">21</span>
                      <span className="weather-card__temp-deg">°</span>
                    </div>
                  </div>
                  <div className="weather-card__sub">PARTLY CLOUDY · 17 ~ 24</div>
                  <div className="weather-forecast">
                    <div className="weather-forecast__item"><span>WED</span><div className="px-mini px-mini--sun" /><span>22°</span></div>
                    <div className="weather-forecast__item"><span>THU</span><div className="px-mini px-mini--cloud" /><span>19°</span></div>
                    <div className="weather-forecast__item"><span>FRI</span><div className="px-mini px-mini--rain" /><span>15°</span></div>
                    <div className="weather-forecast__item"><span>SAT</span><div className="px-mini px-mini--cloud" /><span>18°</span></div>
                    <div className="weather-forecast__item"><span>SUN</span><div className="px-mini px-mini--sun" /><span>23°</span></div>
                  </div>
                </div>
                <div className="desk-card sticker-card">
                  <div className="sticker-card__head">DESKTOP STICKERS</div>
                  <div className="sticker-card__grid">
                    <div className="px-mini px-mini--heart" />
                    <div className="px-mini px-mini--star" />
                    <div className="px-mini px-mini--diamond" />
                    <div className="px-mini px-mini--mushroom" />
                    <div className="px-mini px-mini--fish" />
                    <div className="px-mini px-mini--key" />
                  </div>
                  <div className="sticker-card__note">
                    <span data-lang="en">Drag onto anything.</span>
                    <span data-lang="ko" hidden>어디든 끌어다 붙이세요.</span>
                    <span data-lang="ja" hidden>どこにでもドラッグできる。</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== PROMPT SECTION ===== */}
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Retro Pixel / 8-bit style — pixel art aesthetic, Game Boy vibes, chunky bordered containers with CRT scanline overlay.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #1a1c2c (deep midnight blue){"\n"}--bg-light: #333c57 (muted slate){"\n"}--primary: #a7f070 (pixel green){"\n"}--accent: #f77622 (retro orange){"\n"}--secondary: #29adff (electric blue){"\n"}--danger: #ff004d (pixel red){"\n"}--highlight: #ffec27 (coin yellow){"\n"}--text: #a7f070 (green on dark){"\n"}--text-dim: #5d6f4f (muted green){"\n"}--white: #e0f8cf (Game Boy lightest green){"\n"}--border: #5d6f8e (steel blue border){"\n"}No other colors. All tones must feel like an 8-bit palette.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Font: "Press Start 2P" from Google Fonts, fallback monospace{"\n"}Body: 10px, line-height 2.0 (pixel fonts need generous spacing){"\n"}Headings: same font, clamp(1rem, 3.5vw, 2rem), line-height 1.6{"\n"}Labels: 7-8px, uppercase{"\n"}All text must use the pixel font — no font mixing.{"\n"}text-shadow: 3px 3px 0 var(--bg-light) on headings for depth.{"\n"}{"\n"}UI COMPONENTS:{"\n"}- Game frame: 4px solid border, box-shadow inset 0 0 0 2px + outer 0 8px 32px, title bar with colored square dots (no border-radius){"\n"}- Health bars: 16px tall, 2px solid border, filled div with stepped transition (steps(10)){"\n"}{"  "}HP green (#a7f070), MP blue (#29adff), XP orange (#f77622), ATK red (#ff004d){"\n"}- Stat blocks: 3px solid border, semi-transparent bg, 8px uppercase labels{"\n"}- RPG dialog box: 4px solid white border, triangle pointer via CSS ::before, speaker name in yellow, choices prefixed with "&gt; "{"\n"}- Score display: flex row of bordered blocks, value in highlight yellow, label in dim text{"\n"}- Inventory grid: square aspect-ratio slots, 2px border, hover highlights in yellow, active slot in green, item count in corner{"\n"}- 8-bit buttons: 3px solid border, box-shadow for 3D depth (0 4px 0), translateY on hover/active for press effect, no border-radius{"\n"}- Toast notification: 3px solid green border, slide-in animation using steps(){"\n"}- Blinking cursor: "_" character with steps(2) animation at 0.8s{"\n"}{"\n"}PIXEL ART (CSS box-shadow technique):{"\n"}Create decorative pixel art using a tiny div (4px x 4px) with multiple box-shadow declarations.{"\n"}Each shadow = one pixel: Xpx Ypx 0 color{"\n"}Heart: 7 rows of red (#ff004d) pixels in heart shape{"\n"}Sword: blade in white, yellow guard, brown handle, orange pommel{"\n"}Star: 5 rows of yellow (#ffec27) pixels{"\n"}Add floating animation: translateY(0) to translateY(-4px), steps(4), 2s infinite{"\n"}{"\n"}SCANLINE EFFECT:{"\n"}body::after with position fixed, inset 0, z-index 9998, pointer-events none{"\n"}repeating-linear-gradient(180deg, transparent 0-2px, rgba(0,0,0,0.12) 2-4px){"\n"}{"\n"}LAYOUT:{"\n"}Content max-width: min(1040px, 92vw){"\n"}Page padding: 26px 0 80px{"\n"}Stats grid: repeat(auto-fit, minmax(200px, 1fr)), gap 12px{"\n"}Score display: flex-wrap, gap 12px, centered{"\n"}Inventory: repeat(auto-fill, minmax(50px, 1fr)), gap 4px, max-width 400px{"\n"}Screen padding: clamp(20px, 4vw, 40px){"\n"}{"\n"}MOTION:{"\n"}- All animations use steps() easing for pixelated feel{"\n"}- Float: steps(4), 2s infinite{"\n"}- Slide-in: steps(8), 0.5s{"\n"}- Blink: steps(2), 0.8s infinite{"\n"}- Health bar fill: steps(10), 1s transition{"\n"}- Button press: translateY(-2px) hover, translateY(2px) active{"\n"}{"\n"}RESPONSIVE:{"\n"}Below 640px: single column stats, stacked score items, 4-column inventory, smaller font sizes (7-8px for pre), stacked dialog choices{"\n"}Above 640px: multi-column stats grid, flex row scores, 8-column inventory{"\n"}{"\n"}FORBIDDEN:{"\n"}- No border-radius on game elements (pixel = sharp corners){"\n"}- No gradients except scanline overlay{"\n"}- No anti-aliased fonts — pixel font only{"\n"}- No smooth transitions — use steps() for everything{"\n"}- No blur or glassmorphism{"\n"}- No serif or sans-serif fonts{"\n"}- No colors outside the defined 8-bit palette{"\n"}- No opacity below 0.3 on visible elements{"\n"}- image-rendering must be set to pixelated{"\n"}{"\n"}OUTPUT:{"\n"}1. Single HTML file with inline CSS{"\n"}2. CRT scanline overlay on body::after{"\n"}3. CSS pixel art using box-shadow technique (heart, sword, star){"\n"}4. Health bar system with stepped transitions{"\n"}5. RPG dialog box with speaker, text, blinking cursor, and YES/NO choices{"\n"}6. Score display and inventory grid{"\n"}7. 8-bit button system with 3D press effect{"\n"}8. "Press Start 2P" Google Font with monospace fallback</pre>
            <pre data-lang="ko" hidden>Retro Pixel / 8-bit 스타일의 랜딩 페이지를 디자인해줘 — 픽셀 아트 미학, 게임보이 분위기, 두꺼운 테두리 컨테이너에 CRT 스캔라인 오버레이.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #1a1c2c (깊은 미드나이트 블루){"\n"}--bg-light: #333c57 (뮤트 슬레이트){"\n"}--primary: #a7f070 (픽셀 그린){"\n"}--accent: #f77622 (레트로 오렌지){"\n"}--secondary: #29adff (일렉트릭 블루){"\n"}--danger: #ff004d (픽셀 레드){"\n"}--highlight: #ffec27 (코인 옐로){"\n"}--text: #a7f070 (어두운 배경 위 그린){"\n"}--text-dim: #5d6f4f (뮤트 그린){"\n"}--white: #e0f8cf (게임보이 가장 밝은 그린){"\n"}--border: #5d6f8e (스틸 블루 테두리){"\n"}다른 색상 사용 금지. 모든 톤은 8비트 팔레트처럼 느껴져야 합니다.{"\n"}{"\n"}타이포그래피:{"\n"}폰트: Google Fonts의 "Press Start 2P", 폴백 monospace{"\n"}본문: 10px, line-height 2.0 (픽셀 폰트는 넉넉한 간격 필요){"\n"}제목: 같은 폰트, clamp(1rem, 3.5vw, 2rem), line-height 1.6{"\n"}라벨: 7-8px, 대문자{"\n"}모든 텍스트에 픽셀 폰트 사용 — 폰트 혼용 금지.{"\n"}제목에 text-shadow: 3px 3px 0 var(--bg-light) 적용하여 깊이감.{"\n"}{"\n"}UI 컴포넌트:{"\n"}- 게임 프레임: 4px solid 테두리, box-shadow inset 0 0 0 2px + 외부 0 8px 32px, 타이틀 바에 컬러 사각 도트 (border-radius 없음){"\n"}- 체력 바: 16px 높이, 2px solid 테두리, 단계적 트랜지션(steps(10))으로 채워지는 div{"\n"}{"  "}HP 그린(#a7f070), MP 블루(#29adff), XP 오렌지(#f77622), ATK 레드(#ff004d){"\n"}- 스탯 블록: 3px solid 테두리, 반투명 배경, 8px 대문자 라벨{"\n"}- RPG 대화 상자: 4px solid 흰색 테두리, CSS ::before로 삼각형 포인터, 스피커 이름은 노란색, 선택지 앞에 "&gt; " 접두사{"\n"}- 점수 표시: flex 행으로 테두리 블록, 하이라이트 옐로 값, dim 텍스트 라벨{"\n"}- 인벤토리 그리드: 정사각 aspect-ratio 슬롯, 2px 테두리, 호버시 노란 하이라이트, 활성 슬롯은 그린, 코너에 아이템 수{"\n"}- 8비트 버튼: 3px solid 테두리, 3D 깊이감 box-shadow(0 4px 0), hover/active시 translateY로 누르기 효과, border-radius 없음{"\n"}- 토스트 알림: 3px solid 그린 테두리, steps() 슬라이드인 애니메이션{"\n"}- 깜빡이는 커서: "_" 문자, steps(2) 애니메이션 0.8초{"\n"}{"\n"}픽셀 아트 (CSS box-shadow 기법):{"\n"}작은 div(4px x 4px)에 여러 box-shadow 선언으로 장식 픽셀 아트 생성.{"\n"}각 그림자 = 하나의 픽셀: Xpx Ypx 0 color{"\n"}하트: 빨간색(#ff004d) 픽셀로 하트 모양 7줄{"\n"}검: 흰색 칼날, 노란 가드, 갈색 손잡이, 오렌지 폼멜{"\n"}별: 노란색(#ffec27) 픽셀 5줄{"\n"}부유 애니메이션: translateY(0)에서 translateY(-4px), steps(4), 2초 무한{"\n"}{"\n"}스캔라인 효과:{"\n"}body::after에 position fixed, inset 0, z-index 9998, pointer-events none{"\n"}repeating-linear-gradient(180deg, transparent 0-2px, rgba(0,0,0,0.12) 2-4px){"\n"}{"\n"}레이아웃:{"\n"}콘텐츠 최대 너비: min(1040px, 92vw){"\n"}페이지 패딩: 26px 0 80px{"\n"}스탯 그리드: repeat(auto-fit, minmax(200px, 1fr)), gap 12px{"\n"}점수 표시: flex-wrap, gap 12px, 중앙 정렬{"\n"}인벤토리: repeat(auto-fill, minmax(50px, 1fr)), gap 4px, max-width 400px{"\n"}스크린 패딩: clamp(20px, 4vw, 40px){"\n"}{"\n"}모션:{"\n"}- 모든 애니메이션에 steps() 이징으로 픽셀화 느낌{"\n"}- 부유: steps(4), 2초 무한{"\n"}- 슬라이드인: steps(8), 0.5초{"\n"}- 깜빡임: steps(2), 0.8초 무한{"\n"}- 체력 바 채움: steps(10), 1초 트랜지션{"\n"}- 버튼 누르기: hover시 translateY(-2px), active시 translateY(2px){"\n"}{"\n"}반응형:{"\n"}640px 미만: 단일 열 스탯, 세로 점수 항목, 4열 인벤토리, 작은 폰트(pre 7-8px), 세로 대화 선택지{"\n"}640px 이상: 다중 열 스탯 그리드, flex 행 점수, 8열 인벤토리{"\n"}{"\n"}금지사항:{"\n"}- 게임 요소에 border-radius 금지 (픽셀 = 각진 모서리){"\n"}- 스캔라인 오버레이 외 그라데이션 금지{"\n"}- 안티앨리어싱 폰트 금지 — 픽셀 폰트만{"\n"}- 부드러운 트랜지션 금지 — 모든 곳에 steps() 사용{"\n"}- 블러 또는 글래스모피즘 금지{"\n"}- 세리프 또는 산세리프 폰트 금지{"\n"}- 정의된 8비트 팔레트 외 색상 금지{"\n"}- 보이는 요소에 0.3 미만 opacity 금지{"\n"}- image-rendering은 반드시 pixelated 설정{"\n"}{"\n"}출력:{"\n"}1. 인라인 CSS 포함 단일 HTML 파일{"\n"}2. body::after에 CRT 스캔라인 오버레이{"\n"}3. box-shadow 기법의 CSS 픽셀 아트 (하트, 검, 별){"\n"}4. 단계적 트랜지션의 체력 바 시스템{"\n"}5. 스피커, 텍스트, 깜빡이는 커서, YES/NO 선택지가 있는 RPG 대화 상자{"\n"}6. 점수 표시 및 인벤토리 그리드{"\n"}7. 3D 누르기 효과의 8비트 버튼 시스템{"\n"}8. "Press Start 2P" Google Font에 monospace 폴백</pre>
            <pre data-lang="ja" hidden>Retro Pixel / 8-bitスタイルのランディングページをデザインしてください — ピクセルアートの美学、ゲームボーイの雰囲気、太いボーダーのコンテナにCRTスキャンラインオーバーレイ。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #1a1c2c（ディープミッドナイトブルー）{"\n"}--bg-light: #333c57（ミュートスレート）{"\n"}--primary: #a7f070（ピクセルグリーン）{"\n"}--accent: #f77622（レトロオレンジ）{"\n"}--secondary: #29adff（エレクトリックブルー）{"\n"}--danger: #ff004d（ピクセルレッド）{"\n"}--highlight: #ffec27（コインイエロー）{"\n"}--text: #a7f070（暗い背景上のグリーン）{"\n"}--text-dim: #5d6f4f（ミュートグリーン）{"\n"}--white: #e0f8cf（ゲームボーイ最明グリーン）{"\n"}--border: #5d6f8e（スチールブルーボーダー）{"\n"}他の色は使用不可。全トーンは8ビットパレットの雰囲気を持つこと。{"\n"}{"\n"}タイポグラフィ:{"\n"}フォント: Google Fontsの"Press Start 2P"、フォールバックmonospace{"\n"}本文: 10px, line-height 2.0（ピクセルフォントは余裕ある間隔が必要）{"\n"}見出し: 同フォント、clamp(1rem, 3.5vw, 2rem), line-height 1.6{"\n"}ラベル: 7-8px, 大文字{"\n"}全テキストにピクセルフォント使用 — フォント混用禁止。{"\n"}見出しにtext-shadow: 3px 3px 0 var(--bg-light)で奥行き感。{"\n"}{"\n"}UIコンポーネント:{"\n"}- ゲームフレーム: 4px solidボーダー、box-shadow inset 0 0 0 2px + 外側0 8px 32px、タイトルバーにカラー四角ドット（border-radiusなし）{"\n"}- HPバー: 16px高、2px solidボーダー、段階的トランジション(steps(10))で塗りつぶすdiv{"\n"}{"  "}HPグリーン(#a7f070)、MPブルー(#29adff)、XPオレンジ(#f77622)、ATKレッド(#ff004d){"\n"}- ステータスブロック: 3px solidボーダー、半透明背景、8px大文字ラベル{"\n"}- RPGダイアログボックス: 4px solid白ボーダー、CSS ::beforeで三角ポインター、話者名は黄色、選択肢の前に"&gt; "接頭辞{"\n"}- スコア表示: flexの行でボーダー付きブロック、ハイライトイエローの値、dimテキストのラベル{"\n"}- インベントリグリッド: 正方形aspect-ratioスロット、2pxボーダー、ホバーで黄色ハイライト、アクティブスロットはグリーン、コーナーにアイテム数{"\n"}- 8ビットボタン: 3px solidボーダー、3D深度感のbox-shadow(0 4px 0)、hover/activeでtranslateYの押し込み効果、border-radiusなし{"\n"}- トースト通知: 3px solidグリーンボーダー、steps()スライドインアニメーション{"\n"}- 点滅カーソル: "_"文字、steps(2)アニメーション0.8秒{"\n"}{"\n"}ピクセルアート（CSS box-shadowテクニック）:{"\n"}小さなdiv(4px x 4px)に複数のbox-shadow宣言で装飾ピクセルアートを作成。{"\n"}各シャドウ = 1ピクセル: Xpx Ypx 0 color{"\n"}ハート: 赤(#ff004d)ピクセルでハート形7行{"\n"}剣: 白い刃、黄色のガード、茶色のハンドル、オレンジのポメル{"\n"}星: 黄色(#ffec27)ピクセル5行{"\n"}浮遊アニメーション: translateY(0)からtranslateY(-4px)、steps(4)、2秒無限{"\n"}{"\n"}スキャンライン効果:{"\n"}body::afterにposition fixed、inset 0、z-index 9998、pointer-events none{"\n"}repeating-linear-gradient(180deg, transparent 0-2px, rgba(0,0,0,0.12) 2-4px){"\n"}{"\n"}レイアウト:{"\n"}コンテンツ最大幅: min(1040px, 92vw){"\n"}ページパディング: 26px 0 80px{"\n"}ステータスグリッド: repeat(auto-fit, minmax(200px, 1fr)), gap 12px{"\n"}スコア表示: flex-wrap, gap 12px, 中央揃え{"\n"}インベントリ: repeat(auto-fill, minmax(50px, 1fr)), gap 4px, max-width 400px{"\n"}スクリーンパディング: clamp(20px, 4vw, 40px){"\n"}{"\n"}モーション:{"\n"}- 全アニメーションにsteps()イージングでピクセル化の雰囲気{"\n"}- 浮遊: steps(4), 2秒無限{"\n"}- スライドイン: steps(8), 0.5秒{"\n"}- 点滅: steps(2), 0.8秒無限{"\n"}- HPバー塗りつぶし: steps(10), 1秒トランジション{"\n"}- ボタン押下: hoverでtranslateY(-2px), activeでtranslateY(2px){"\n"}{"\n"}レスポンシブ:{"\n"}640px未満: 単一列ステータス、縦方向スコア、4列インベントリ、小さいフォント(pre 7-8px)、縦方向ダイアログ選択肢{"\n"}640px以上: 複数列ステータスグリッド、flex行スコア、8列インベントリ{"\n"}{"\n"}禁止事項:{"\n"}- ゲーム要素にborder-radius禁止（ピクセル = 角張った角）{"\n"}- スキャンラインオーバーレイ以外のグラデーション禁止{"\n"}- アンチエイリアスフォント禁止 — ピクセルフォントのみ{"\n"}- スムーズトランジション禁止 — 全てにsteps()使用{"\n"}- ブラーまたはグラスモーフィズム禁止{"\n"}- セリフまたはサンセリフフォント禁止{"\n"}- 定義された8ビットパレット外の色禁止{"\n"}- 表示要素に0.3未満のopacity禁止{"\n"}- image-renderingは必ずpixelated設定{"\n"}{"\n"}出力:{"\n"}1. インラインCSS付き単一HTMLファイル{"\n"}2. body::afterにCRTスキャンラインオーバーレイ{"\n"}3. box-shadowテクニックのCSSピクセルアート（ハート、剣、星）{"\n"}4. 段階的トランジションのHPバーシステム{"\n"}5. 話者、テキスト、点滅カーソル、はい/いいえ選択肢のRPGダイアログボックス{"\n"}6. スコア表示とインベントリグリッド{"\n"}7. 3D押し込み効果の8ビットボタンシステム{"\n"}8. "Press Start 2P" Google Fontにmonospaceフォールバック</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/notion-style.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Notion Style</span></a><div className="page-nav__divider" /><a href="/pages/y2k-retro.html"><span><span className="page-nav__label">다음</span>Windows 98</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
