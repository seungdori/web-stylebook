import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedSoftPastelPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--soft-pastel">
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
        <div className="soft-bg" />
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
                <button className="theme-toggle" id="global-theme-reset" aria-label="Reset Global Theme" data-color="Reset Global Theme" title="Reset Global Theme">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>
          {/* ===== HERO ===== */}
          <section className="hero">
            <div className="badge" data-lang="en">Soft Pastel UI</div>
            <div className="badge" data-lang="ko" hidden>Soft Pastel UI</div>
            <div className="badge" data-lang="ja" hidden>Soft Pastel UI</div>
            <h1>Friendly &amp; <em>Warm</em><br />Design System</h1>
            <p className="lead" data-lang="en">
              Ultra-soft pastel tones, rounded pill shapes, and warm cream backgrounds
              create interfaces that feel approachable, cozy, and delightful.
            </p>
            <p className="lead" data-lang="ko" hidden>
              극도로 부드러운 파스텔 톤, 둥근 필 형태, 따뜻한 크림 배경이 어우러져
              친근하고 포근하며 기분 좋은 인터페이스를 만듭니다.
            </p>
            <p className="lead" data-lang="ja" hidden>
              極めて柔らかいパステルトーン、丸いピル型シェイプ、温かみのあるクリーム背景が
              親しみやすく、心地よく、楽しいインターフェースを生み出します。
            </p>
          </section>
          {/* ===== MOCK APP WIDGET ===== */}
          <section className="mock-app">
            <div className="mock-app__topbar">
              <span className="mock-app__title" data-lang="en">Notifications</span>
              <span className="mock-app__title" data-lang="ko" hidden>알림</span>
              <span className="mock-app__title" data-lang="ja" hidden>通知</span>
              <div className="mock-app__dots">
                <span className="mock-app__dot mock-app__dot--peach" />
                <span className="mock-app__dot mock-app__dot--blue" />
                <span className="mock-app__dot mock-app__dot--lavender" />
              </div>
            </div>
            <div className="notif-list">
              <div className="notif-item">
                <div className="notif-avatar notif-avatar--peach">A</div>
                <div className="notif-body">
                  <div className="notif-name" data-lang="en">Aurora Kim</div>
                  <div className="notif-name" data-lang="ko" hidden>김오로라</div>
                  <div className="notif-name" data-lang="ja" hidden>キム・オーロラ</div>
                  <div className="notif-msg" data-lang="en">Loved the new pastel palette!</div>
                  <div className="notif-msg" data-lang="ko" hidden>새로운 파스텔 팔레트 정말 좋아요!</div>
                  <div className="notif-msg" data-lang="ja" hidden>新しいパステルパレットが素敵!</div>
                </div>
                <div className="notif-meta">
                  <span className="notif-time">2m</span>
                  <span className="notif-count">3</span>
                </div>
              </div>
              <div className="notif-item">
                <div className="notif-avatar notif-avatar--blue">S</div>
                <div className="notif-body">
                  <div className="notif-name" data-lang="en">Sky Park</div>
                  <div className="notif-name" data-lang="ko" hidden>박하늘</div>
                  <div className="notif-name" data-lang="ja" hidden>パク・スカイ</div>
                  <div className="notif-msg" data-lang="en">The rounded buttons feel so cozy</div>
                  <div className="notif-msg" data-lang="ko" hidden>둥근 버튼이 정말 포근한 느낌이에요</div>
                  <div className="notif-msg" data-lang="ja" hidden>丸いボタンが心地よい感じ</div>
                </div>
                <div className="notif-meta">
                  <span className="notif-time">15m</span>
                </div>
              </div>
              <div className="notif-item">
                <div className="notif-avatar notif-avatar--lavender">L</div>
                <div className="notif-body">
                  <div className="notif-name" data-lang="en">Luna Lee</div>
                  <div className="notif-name" data-lang="ko" hidden>이루나</div>
                  <div className="notif-name" data-lang="ja" hidden>リー・ルナ</div>
                  <div className="notif-msg" data-lang="en">Shared the design tokens with team</div>
                  <div className="notif-msg" data-lang="ko" hidden>디자인 토큰을 팀에 공유했어요</div>
                  <div className="notif-msg" data-lang="ja" hidden>デザイントークンをチームに共有しました</div>
                </div>
                <div className="notif-meta">
                  <span className="notif-time">1h</span>
                  <span className="notif-count" style={{background: 'var(--accent-3)'}}>1</span>
                </div>
              </div>
            </div>
            <div className="toggle-group">
              <div className="toggle-row">
                <span className="toggle-text" data-lang="en">Warm Mode</span>
                <span className="toggle-text" data-lang="ko" hidden>따뜻한 모드</span>
                <span className="toggle-text" data-lang="ja" hidden>ウォームモード</span>
                <div className="toggle-switch" />
              </div>
              <div className="toggle-row">
                <span className="toggle-text" data-lang="en">Rounded Corners</span>
                <span className="toggle-text" data-lang="ko" hidden>둥근 모서리</span>
                <span className="toggle-text" data-lang="ja" hidden>角丸</span>
                <div className="toggle-switch" />
              </div>
              <div className="toggle-row">
                <span className="toggle-text" data-lang="en">Neon Colors</span>
                <span className="toggle-text" data-lang="ko" hidden>네온 컬러</span>
                <span className="toggle-text" data-lang="ja" hidden>ネオンカラー</span>
                <div className="toggle-switch toggle-switch--off" />
              </div>
            </div>
            <div className="progress-section">
              <div className="progress-item">
                <div className="progress-head">
                  <span data-lang="en">Warmth</span>
                  <span data-lang="ko" hidden>따뜻함</span>
                  <span data-lang="ja" hidden>温かさ</span>
                  <span>78%</span>
                </div>
                <div className="progress-track"><div className="progress-fill progress-fill--peach" /></div>
              </div>
              <div className="progress-item">
                <div className="progress-head">
                  <span data-lang="en">Softness</span>
                  <span data-lang="ko" hidden>부드러움</span>
                  <span data-lang="ja" hidden>柔らかさ</span>
                  <span>62%</span>
                </div>
                <div className="progress-track"><div className="progress-fill progress-fill--blue" /></div>
              </div>
              <div className="progress-item">
                <div className="progress-head">
                  <span data-lang="en">Friendliness</span>
                  <span data-lang="ko" hidden>친근함</span>
                  <span data-lang="ja" hidden>親しみやすさ</span>
                  <span>45%</span>
                </div>
                <div className="progress-track"><div className="progress-fill progress-fill--lavender" /></div>
              </div>
            </div>
          </section>
          {/* ===== COLOR PALETTE ===== */}
          <section className="palette">
            <div className="palette__label" data-lang="en">Color Palette</div>
            <div className="palette__label" data-lang="ko" hidden>컬러 팔레트</div>
            <div className="palette__label" data-lang="ja" hidden>カラーパレット</div>
            <div className="palette__row">
              <div className="swatch">
                <div className="swatch__circle swatch__circle--peach" />
                <span className="swatch__name">Peach</span>
                <span className="swatch__hex">#ff9a76</span>
              </div>
              <div className="swatch">
                <div className="swatch__circle swatch__circle--blue" />
                <span className="swatch__name">Sky Blue</span>
                <span className="swatch__hex">#a8d8ea</span>
              </div>
              <div className="swatch">
                <div className="swatch__circle swatch__circle--lavender" />
                <span className="swatch__name">Lavender</span>
                <span className="swatch__hex">#c3b1e1</span>
              </div>
              <div className="swatch">
                <div className="swatch__circle swatch__circle--mint" />
                <span className="swatch__name">Mint</span>
                <span className="swatch__hex">#8ecf92</span>
              </div>
            </div>
          </section>
          {/* ===== COMPONENT SHOWCASE 2x2 ===== */}
          <div className="showcase">
            {/* Card 1: Buttons */}
            <div className="showcase__card">
              <div className="showcase__heading" data-lang="en">Buttons</div>
              <div className="showcase__heading" data-lang="ko" hidden>버튼</div>
              <div className="showcase__heading" data-lang="ja" hidden>ボタン</div>
              <div className="demo-btns">
                <span className="demo-btn demo-btn--peach" data-lang="en">Primary</span>
                <span className="demo-btn demo-btn--peach" data-lang="ko" hidden>기본</span>
                <span className="demo-btn demo-btn--peach" data-lang="ja" hidden>プライマリ</span>
                <span className="demo-btn demo-btn--blue" data-lang="en">Secondary</span>
                <span className="demo-btn demo-btn--blue" data-lang="ko" hidden>보조</span>
                <span className="demo-btn demo-btn--blue" data-lang="ja" hidden>セカンダリ</span>
                <span className="demo-btn demo-btn--o-peach" data-lang="en">Outline</span>
                <span className="demo-btn demo-btn--o-peach" data-lang="ko" hidden>아웃라인</span>
                <span className="demo-btn demo-btn--o-peach" data-lang="ja" hidden>アウトライン</span>
                <span className="demo-btn demo-btn--o-lavender" data-lang="en">Ghost</span>
                <span className="demo-btn demo-btn--o-lavender" data-lang="ko" hidden>고스트</span>
                <span className="demo-btn demo-btn--o-lavender" data-lang="ja" hidden>ゴースト</span>
              </div>
            </div>
            {/* Card 2: Tags */}
            <div className="showcase__card">
              <div className="showcase__heading" data-lang="en">Tags</div>
              <div className="showcase__heading" data-lang="ko" hidden>태그</div>
              <div className="showcase__heading" data-lang="ja" hidden>タグ</div>
              <div className="demo-pills">
                <span className="demo-pill demo-pill--peach"><span className="demo-pill__dot" /><span data-lang="en">Design</span><span data-lang="ko" hidden>디자인</span><span data-lang="ja" hidden>デザイン</span></span>
                <span className="demo-pill demo-pill--blue"><span className="demo-pill__dot" /><span data-lang="en">Pastel</span><span data-lang="ko" hidden>파스텔</span><span data-lang="ja" hidden>パステル</span></span>
                <span className="demo-pill demo-pill--lavender"><span className="demo-pill__dot" /><span data-lang="en">Soft UI</span><span data-lang="ko" hidden>소프트 UI</span><span data-lang="ja" hidden>ソフトUI</span></span>
                <span className="demo-pill demo-pill--mint"><span className="demo-pill__dot" /><span data-lang="en">Friendly</span><span data-lang="ko" hidden>친근한</span><span data-lang="ja" hidden>フレンドリー</span></span>
              </div>
            </div>
            {/* Card 3: Inputs */}
            <div className="showcase__card">
              <div className="showcase__heading" data-lang="en">Inputs</div>
              <div className="showcase__heading" data-lang="ko" hidden>입력</div>
              <div className="showcase__heading" data-lang="ja" hidden>入力</div>
              <div className="demo-inputs">
                <div className="demo-search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2="16.65" y2="16.65" /></svg>
                  <span className="demo-search__text" data-lang="en">Search components...</span>
                  <span className="demo-search__text" data-lang="ko" hidden>컴포넌트 검색...</span>
                  <span className="demo-search__text" data-lang="ja" hidden>コンポーネント検索...</span>
                </div>
                <input className="demo-field" type="text" placeholder="hello@pastel.design" readOnly />
              </div>
            </div>
            {/* Card 4: Toasts */}
            <div className="showcase__card">
              <div className="showcase__heading" data-lang="en">Toasts</div>
              <div className="showcase__heading" data-lang="ko" hidden>토스트</div>
              <div className="showcase__heading" data-lang="ja" hidden>トースト</div>
              <div className="demo-toasts">
                <div className="demo-toast demo-toast--ok">
                  <div className="demo-toast__icon">✓</div>
                  <span data-lang="en">Saved successfully</span>
                  <span data-lang="ko" hidden>저장되었습니다</span>
                  <span data-lang="ja" hidden>保存しました</span>
                </div>
                <div className="demo-toast demo-toast--info">
                  <div className="demo-toast__icon">i</div>
                  <span data-lang="en">New update available</span>
                  <span data-lang="ko" hidden>새 업데이트가 있습니다</span>
                  <span data-lang="ja" hidden>新しいアップデートがあります</span>
                </div>
                <div className="demo-toast demo-toast--warn">
                  <div className="demo-toast__icon">!</div>
                  <span data-lang="en">Check your settings</span>
                  <span data-lang="ko" hidden>설정을 확인해주세요</span>
                  <span data-lang="ja" hidden>設定を確認してください</span>
                </div>
              </div>
            </div>
          </div>
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Soft Pastel style — friendly rounded shapes on warm cream.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #fef7f0{"\n"}--card: rgba(255, 255, 255, 0.7){"\n"}--border: rgba(61, 50, 41, 0.08){"\n"}--text: #3d3229{"\n"}--text-muted: #9b8e82{"\n"}--accent-1: #ff9a76{"\n"}--accent-2: #a8d8ea{"\n"}--accent-3: #c3b1e1{"\n"}No other colors. Mint #8ecf92 allowed only for pill dot indicators.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Heading: "Nunito" sans-serif, 800 weight, tracking -0.02em{"\n"}Body: "Noto Sans" / "Nunito" sans-serif, 400 / 500 weight{"\n"}Badge: "Nunito" 700 weight, 0.72rem, uppercase, tracking 0.05em{"\n"}Scale: 12 / 14 / 15 / 17 / 19 / 34 / 67px (clamp(2rem, 5.5vw, 4.2rem)){"\n"}Body line-height: 1.8{"\n"}Heading line-height: 1.1{"\n"}{"\n"}UI:{"\n"}- Hero card: 1px solid var(--border), border-radius 36px, background var(--card), backdrop-filter blur(16px), box-shadow 0 16px 48px rgba(0,0,0,0.04){"\n"}- Badge: inline-block, background var(--accent-1), color white, padding 4px 12px, border-radius 999px, uppercase{"\n"}- Pill tags: border-radius 999px, padding 8px 16px, 8px colored dot before text{"\n"}{"  "}Pill 1: rgba(255,154,118,0.15) bg, #d97548 text, accent-1 dot{"\n"}{"  "}Pill 2: rgba(168,216,234,0.2) bg, #5a9ab5 text, accent-2 dot{"\n"}{"  "}Pill 3: rgba(195,177,225,0.18) bg, #7b6b9e text, accent-3 dot{"\n"}{"  "}Pill 4: rgba(168,230,170,0.18) bg, #5a9960 text, #8ecf92 dot{"\n"}- Prompt section: background var(--card), border-radius 28px, backdrop-filter blur(10px){"\n"}- Buttons: border none, background var(--accent-1), color white, border-radius 999px, padding 11px 22px, font-weight 600, box-shadow 0 4px 12px rgba(255,154,118,0.3), hover translateY(-1px) + box-shadow 0 6px 20px rgba(255,154,118,0.4){"\n"}{"\n"}LAYOUT:{"\n"}- Container: min(1040px, 92vw) centered, padding 28px 0 80px{"\n"}- Hero padding: clamp(28px, 5vw, 52px){"\n"}- Pill layout: flex-wrap, gap 8px{"\n"}- Lead paragraph max-width: 640px{"\n"}- Ambient background: fixed div with 3 radial-gradients:{"\n"}{"  "}radial-gradient(ellipse at 15% 15%, rgba(255,154,118,0.15), transparent 50%){"\n"}{"  "}radial-gradient(ellipse at 85% 25%, rgba(168,216,234,0.15), transparent 50%){"\n"}{"  "}radial-gradient(ellipse at 50% 85%, rgba(195,177,225,0.12), transparent 45%){"\n"}{"\n"}MOTION:{"\n"}- Pill entrance: scale(0.9) to scale(1), opacity 0 to 1, 0.5s ease, stagger 0.08s per pill{"\n"}- Button hover: translateY(-1px), 0.25s ease, shadow expansion{"\n"}- No rotation or 3D transforms{"\n"}{"\n"}RESPONSIVE:{"\n"}- Below 768px: single column layout, pill font-size 0.8rem, hero padding 28px, title clamps to 2rem, badge font-size 0.65rem{"\n"}- Above 768px: pills in a row, full backdrop-filter, container 92vw{"\n"}{"\n"}FORBIDDEN:{"\n"}- No dark backgrounds or text darker than #3d3229{"\n"}- No sharp corners — minimum border-radius 28px on cards, 999px on pills/buttons{"\n"}- No saturated or neon colors — all tones must be pastel{"\n"}- No heavy box-shadow darker than rgba(0,0,0,0.04) on cards{"\n"}- No monospace or serif fonts{"\n"}{"\n"}OUTPUT:{"\n"}1. Single HTML file with inline CSS{"\n"}2. Warm cream base with 3-layer pastel ambient gradient background{"\n"}3. Pill-shaped tag system with colored dots and tinted backgrounds{"\n"}4. Frosted glass hero card with badge{"\n"}5. Color token custom properties in :root{"\n"}6. Responsive layout using CSS clamp() and flex-wrap</pre>
            <pre data-lang="ko" hidden>Soft Pastel 스타일의 랜딩 페이지를 디자인해줘 — 따뜻한 크림 위의 친근한 둥근 형태.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #fef7f0{"\n"}--card: rgba(255, 255, 255, 0.7){"\n"}--border: rgba(61, 50, 41, 0.08){"\n"}--text: #3d3229{"\n"}--text-muted: #9b8e82{"\n"}--accent-1: #ff9a76{"\n"}--accent-2: #a8d8ea{"\n"}--accent-3: #c3b1e1{"\n"}다른 색상 사용 금지. 민트 #8ecf92는 필 도트 인디케이터에만 허용.{"\n"}{"\n"}타이포그래피:{"\n"}제목: "Nunito" sans-serif, 800 weight, tracking -0.02em{"\n"}본문: "Noto Sans" / "Nunito" sans-serif, 400 / 500 weight{"\n"}배지: "Nunito" 700 weight, 0.72rem, uppercase, tracking 0.05em{"\n"}스케일: 12 / 14 / 15 / 17 / 19 / 34 / 67px (clamp(2rem, 5.5vw, 4.2rem)){"\n"}본문 line-height: 1.8{"\n"}제목 line-height: 1.1{"\n"}{"\n"}UI:{"\n"}- 히어로 카드: 1px solid var(--border), border-radius 36px, background var(--card), backdrop-filter blur(16px), box-shadow 0 16px 48px rgba(0,0,0,0.04){"\n"}- 배지: inline-block, background var(--accent-1), color white, padding 4px 12px, border-radius 999px, uppercase{"\n"}- 필 태그: border-radius 999px, padding 8px 16px, 텍스트 앞에 8px 컬러 도트{"\n"}{"  "}필 1: rgba(255,154,118,0.15) 배경, #d97548 텍스트, accent-1 도트{"\n"}{"  "}필 2: rgba(168,216,234,0.2) 배경, #5a9ab5 텍스트, accent-2 도트{"\n"}{"  "}필 3: rgba(195,177,225,0.18) 배경, #7b6b9e 텍스트, accent-3 도트{"\n"}{"  "}필 4: rgba(168,230,170,0.18) 배경, #5a9960 텍스트, #8ecf92 도트{"\n"}- 프롬프트 섹션: background var(--card), border-radius 28px, backdrop-filter blur(10px){"\n"}- 버튼: border none, background var(--accent-1), color white, border-radius 999px, padding 11px 22px, font-weight 600, box-shadow 0 4px 12px rgba(255,154,118,0.3), hover시 translateY(-1px) + box-shadow 0 6px 20px rgba(255,154,118,0.4){"\n"}{"\n"}레이아웃:{"\n"}- 컨테이너: min(1040px, 92vw) 중앙정렬, padding 28px 0 80px{"\n"}- 히어로 padding: clamp(28px, 5vw, 52px){"\n"}- 필 레이아웃: flex-wrap, gap 8px{"\n"}- 리드 문단 max-width: 640px{"\n"}- 앰비언트 배경: fixed div에 3개 radial-gradient:{"\n"}{"  "}radial-gradient(ellipse at 15% 15%, rgba(255,154,118,0.15), transparent 50%){"\n"}{"  "}radial-gradient(ellipse at 85% 25%, rgba(168,216,234,0.15), transparent 50%){"\n"}{"  "}radial-gradient(ellipse at 50% 85%, rgba(195,177,225,0.12), transparent 45%){"\n"}{"\n"}모션:{"\n"}- 필 등장: scale(0.9)→scale(1), opacity 0→1, 0.5s ease, 필당 0.08s 순차 지연{"\n"}- 버튼 hover: translateY(-1px), 0.25s ease, 그림자 확장{"\n"}- 회전이나 3D 변환 없음{"\n"}{"\n"}반응형:{"\n"}- 768px 미만: 단일 열 레이아웃, 필 font-size 0.8rem, 히어로 padding 28px, 제목 최소 2rem, 배지 font-size 0.65rem{"\n"}- 768px 이상: 필이 한 줄로 배치, 풀 backdrop-filter, 컨테이너 92vw{"\n"}{"\n"}금지사항:{"\n"}- 다크 배경이나 #3d3229보다 어두운 텍스트 금지{"\n"}- 날카로운 모서리 금지 — 카드 최소 border-radius 28px, 필/버튼은 999px{"\n"}- 채도 높은 색상이나 네온 컬러 금지 — 모든 톤 파스텔 유지{"\n"}- 카드에 rgba(0,0,0,0.04)보다 진한 box-shadow 금지{"\n"}- 모노스페이스나 세리프 폰트 금지{"\n"}{"\n"}출력:{"\n"}1. 인라인 CSS가 포함된 단일 HTML 파일{"\n"}2. 3레이어 파스텔 앰비언트 그라데이션의 따뜻한 크림 배경{"\n"}3. 컬러 도트와 틴티드 배경이 있는 필 형태 태그 시스템{"\n"}4. 배지가 포함된 프로스티드 글래스 히어로 카드{"\n"}5. :root에 색상 토큰 커스텀 프로퍼티{"\n"}6. CSS clamp()와 flex-wrap을 활용한 반응형 레이아웃</pre>
            <pre data-lang="ja" hidden>Soft Pastelスタイルのランディングページをデザインしてください — 温かみのあるクリーム上のフレンドリーな丸い形状。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #fef7f0{"\n"}--card: rgba(255, 255, 255, 0.7){"\n"}--border: rgba(61, 50, 41, 0.08){"\n"}--text: #3d3229{"\n"}--text-muted: #9b8e82{"\n"}--accent-1: #ff9a76{"\n"}--accent-2: #a8d8ea{"\n"}--accent-3: #c3b1e1{"\n"}他の色は使用禁止。ミント#8ecf92はピルドットインジケーターにのみ許可。{"\n"}{"\n"}タイポグラフィ:{"\n"}見出し: "Nunito" sans-serif, 800 weight, tracking -0.02em{"\n"}本文: "Noto Sans" / "Nunito" sans-serif, 400 / 500 weight{"\n"}バッジ: "Nunito" 700 weight, 0.72rem, uppercase, tracking 0.05em{"\n"}スケール: 12 / 14 / 15 / 17 / 19 / 34 / 67px (clamp(2rem, 5.5vw, 4.2rem)){"\n"}本文 line-height: 1.8{"\n"}見出し line-height: 1.1{"\n"}{"\n"}UI:{"\n"}- ヒーローカード: 1px solid var(--border), border-radius 36px, background var(--card), backdrop-filter blur(16px), box-shadow 0 16px 48px rgba(0,0,0,0.04){"\n"}- バッジ: inline-block, background var(--accent-1), color white, padding 4px 12px, border-radius 999px, uppercase{"\n"}- ピルタグ: border-radius 999px, padding 8px 16px, テキスト前に8pxカラードット{"\n"}{"  "}ピル1: rgba(255,154,118,0.15)背景, #d97548テキスト, accent-1ドット{"\n"}{"  "}ピル2: rgba(168,216,234,0.2)背景, #5a9ab5テキスト, accent-2ドット{"\n"}{"  "}ピル3: rgba(195,177,225,0.18)背景, #7b6b9eテキスト, accent-3ドット{"\n"}{"  "}ピル4: rgba(168,230,170,0.18)背景, #5a9960テキスト, #8ecf92ドット{"\n"}- プロンプトセクション: background var(--card), border-radius 28px, backdrop-filter blur(10px){"\n"}- ボタン: border none, background var(--accent-1), color white, border-radius 999px, padding 11px 22px, font-weight 600, box-shadow 0 4px 12px rgba(255,154,118,0.3), hover時 translateY(-1px) + box-shadow 0 6px 20px rgba(255,154,118,0.4){"\n"}{"\n"}レイアウト:{"\n"}- コンテナ: min(1040px, 92vw) 中央揃え, padding 28px 0 80px{"\n"}- ヒーロー padding: clamp(28px, 5vw, 52px){"\n"}- ピルレイアウト: flex-wrap, gap 8px{"\n"}- リード段落 max-width: 640px{"\n"}- アンビエント背景: fixed divに3つのradial-gradient:{"\n"}{"  "}radial-gradient(ellipse at 15% 15%, rgba(255,154,118,0.15), transparent 50%){"\n"}{"  "}radial-gradient(ellipse at 85% 25%, rgba(168,216,234,0.15), transparent 50%){"\n"}{"  "}radial-gradient(ellipse at 50% 85%, rgba(195,177,225,0.12), transparent 45%){"\n"}{"\n"}モーション:{"\n"}- ピル登場: scale(0.9)→scale(1), opacity 0→1, 0.5s ease, ピルごとに0.08s順次遅延{"\n"}- ボタンhover: translateY(-1px), 0.25s ease, シャドウ拡張{"\n"}- 回転や3Dトランスフォームなし{"\n"}{"\n"}レスポンシブ:{"\n"}- 768px未満: 単一列レイアウト, ピルfont-size 0.8rem, ヒーローpadding 28px, タイトル最小2rem, バッジfont-size 0.65rem{"\n"}- 768px以上: ピルが一列に配置, フルbackdrop-filter, コンテナ92vw{"\n"}{"\n"}禁止事項:{"\n"}- ダーク背景や#3d3229より暗いテキスト禁止{"\n"}- 鋭い角禁止 — カード最小border-radius 28px、ピル/ボタンは999px{"\n"}- 彩度の高い色やネオンカラー禁止 — 全トーンパステル維持{"\n"}- カードにrgba(0,0,0,0.04)より濃いbox-shadow禁止{"\n"}- モノスペースやセリフフォント禁止{"\n"}{"\n"}出力:{"\n"}1. インラインCSS付きの単一HTMLファイル{"\n"}2. 3レイヤーパステルアンビエントグラデーションの温かいクリーム背景{"\n"}3. カラードットとティンテッド背景のピル型タグシステム{"\n"}4. バッジ付きフロストガラスヒーローカード{"\n"}5. :rootにカラートークンカスタムプロパティ{"\n"}6. CSS clamp()とflex-wrapを活用したレスポンシブレイアウト</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/neumorphism.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Neumorphism</span></a><div className="page-nav__divider" /><a href="/pages/notion-style.html"><span><span className="page-nav__label">다음</span>Notion Style</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
