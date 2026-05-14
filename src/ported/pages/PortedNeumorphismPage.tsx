import { useRef, useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

type NeuPalette = {
  id: string;
  name: string;
  bg: string;
  textMain: string;
  textMuted: string;
  shadowDarkRgb: string;
  shadowLightRgb: string;
};

const PALETTES: NeuPalette[] = [
  { id: 'cloud',    name: 'CLOUD',    bg: '#e0e5ec', textMain: '#344055', textMuted: '#8a96a8', shadowDarkRgb: '163, 177, 198', shadowLightRgb: '255, 255, 255' },
  { id: 'mint',     name: 'MINT',     bg: '#dff0e6', textMain: '#1f4534', textMuted: '#6e9483', shadowDarkRgb: '149, 184, 162', shadowLightRgb: '255, 255, 255' },
  { id: 'lavender', name: 'LAVENDER', bg: '#e8e3f5', textMain: '#3b2f5e', textMuted: '#8a7fae', shadowDarkRgb: '170, 156, 199', shadowLightRgb: '255, 255, 255' },
  { id: 'peach',    name: 'PEACH',    bg: '#f5e4d7', textMain: '#5a3a26', textMuted: '#b08869', shadowDarkRgb: '199, 162, 130', shadowLightRgb: '255, 250, 245' },
  { id: 'rose',     name: 'ROSE',     bg: '#f5dce3', textMain: '#5d2a3c', textMuted: '#a76b80', shadowDarkRgb: '199, 144, 162', shadowLightRgb: '255, 250, 252' },
  { id: 'sand',     name: 'SAND',     bg: '#ece5d4', textMain: '#4a3e22', textMuted: '#9a8b66', shadowDarkRgb: '181, 165, 124', shadowLightRgb: '255, 252, 240' },
  { id: 'sky',      name: 'SKY',      bg: '#dceaf5', textMain: '#1f3b5e', textMuted: '#6a89a8', shadowDarkRgb: '149, 175, 199', shadowLightRgb: '255, 255, 255' },
  { id: 'dusk',     name: 'DUSK',     bg: '#2c303a', textMain: '#e8ecf3', textMuted: '#8a91a0', shadowDarkRgb: '18, 20, 26',    shadowLightRgb: '64, 70, 84' },
];

export function PortedNeumorphismPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  const [activeId, setActiveId] = useState('cloud');
  const palette = PALETTES.find((p) => p.id === activeId) ?? PALETTES[0];

  const styleVars = {
    ['--bg' as string]: palette.bg,
    ['--text-main' as string]: palette.textMain,
    ['--text-muted' as string]: palette.textMuted,
    ['--shadow-dark-rgb' as string]: palette.shadowDarkRgb,
    ['--shadow-light-rgb' as string]: palette.shadowLightRgb,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className="ported-style-page ported-style-page--neumorphism"
      style={styleVars}
      data-palette={palette.id}
    >
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
          {/* ═══ PALETTE SWITCHER ═══ */}
          <div className="neu-palette" role="region" aria-label="Color palette">
            <span className="neu-palette__label">
              <span data-lang="en">PALETTE</span>
              <span data-lang="ko" hidden>팔레트</span>
              <span data-lang="ja" hidden>パレット</span>
            </span>
            <div className="neu-palette__chips" role="radiogroup" aria-label="Neumorphism palette">
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={p.id === activeId}
                  className={`neu-palette__chip${p.id === activeId ? ' is-active' : ''}`}
                  onClick={() => setActiveId(p.id)}
                  title={p.name}
                  style={{
                    ['--chip-bg' as string]: p.bg,
                    ['--chip-text' as string]: p.textMain,
                    ['--chip-shadow-dark' as string]: `rgb(${p.shadowDarkRgb})`,
                    ['--chip-shadow-light' as string]: `rgb(${p.shadowLightRgb})`,
                  } as CSSProperties}
                >
                  <span className="neu-palette__swatch" aria-hidden="true" />
                  <span className="neu-palette__name">{p.name}</span>
                </button>
              ))}
            </div>
            <span className="neu-palette__hex" aria-hidden="true">{palette.bg.toUpperCase()}</span>
          </div>

          {/* ═══ DEMO SECTION ═══ */}
          <section className="hero" style={{padding: '40px 30px'}}>
            <div className="demo-title">
              <h1>Neumorphism</h1>
              <p data-lang="en">Depth through light and shadow only. Every element shares the same surface color.</p>
              <p data-lang="ko" hidden>오직 빛과 그림자로만 깊이를 표현합니다. 모든 요소가 같은 표면 색상을 공유합니다.</p>
              <p data-lang="ja" hidden>光と影だけで深度を表現。すべての要素が同じ表面色を共有します。</p>
            </div>
          </section>
          {/* SVG filter for circular progress inset effect */}
          <svg width={0} height={0} style={{position: 'absolute'}}>
            <defs>
              <filter id="insetShadowFilter">
                <feFlood floodColor="rgba(163,177,198,0.35)" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feGaussianBlur stdDeviation={2} />
                <feOffset dx={2} dy={2} />
                <feComposite in2="SourceGraphic" operator="arithmetic" k2={1} k3={1} />
              </filter>
            </defs>
          </svg>
          {/* Row 1: Music Player + Volume Knob */}
          <div className="demo-grid">
            <div className="neu-card">
              <h3 data-lang="en">Music Player</h3>
              <h3 data-lang="ko" hidden>뮤직 플레이어</h3>
              <h3 data-lang="ja" hidden>ミュージックプレーヤー</h3>
              <div className="player">
                <div className="player__album"><div className="player__album-inner" /></div>
                <div className="player__info">
                  <p className="player__info-title">Soft Horizons</p>
                  <p className="player__info-artist">The Neumorphs</p>
                </div>
                <div className="player__progress"><div className="player__progress-fill" /></div>
                <div className="player__time"><span>1:47</span><span>2:51</span></div>
                <div className="player__controls">
                  <button className="player-btn player-btn--sm" aria-label="Previous">
                    <svg viewBox="0 0 24 24"><path d="M19 20L9 12l10-8v16zM5 4h2v16H5V4z" /></svg>
                  </button>
                  <button className="player-btn player-btn--lg" aria-label="Play">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </button>
                  <button className="player-btn player-btn--sm" aria-label="Next">
                    <svg viewBox="0 0 24 24"><path d="M5 4l10 8-10 8V4zm12 0h2v16h-2V4z" /></svg>
                  </button>
                </div>
                <div className="neu-slider-track">
                  <div className="neu-slider-thumb" style={{left: '65%'}} />
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '-12px'}}>
                  <span data-lang="en">Volume</span><span data-lang="ko" hidden>볼륨</span><span data-lang="ja" hidden>音量</span>
                  <span>72%</span>
                </div>
              </div>
            </div>
            <div className="neu-card">
              <h3 data-lang="en">Smart Home</h3>
              <h3 data-lang="ko" hidden>스마트 홈</h3>
              <h3 data-lang="ja" hidden>スマートホーム</h3>
              <div style={{display: 'flex', justifyContent: 'space-around', margin: '16px 0 24px'}}>
                <div className="knob-wrapper">
                  <div className="knob-outer">
                    <div className="knob-inner">
                      <div className="knob-indicator" style={{ '--knobRot': '135deg' } as CSSProperties} />
                      <span className="knob-value">22°</span>
                    </div>
                  </div>
                  <span className="knob-label" data-lang="en">Temp</span>
                  <span className="knob-label" data-lang="ko" hidden>온도</span>
                  <span className="knob-label" data-lang="ja" hidden>温度</span>
                </div>
                <div className="knob-wrapper">
                  <div className="knob-outer">
                    <div className="knob-inner">
                      <div className="knob-indicator" style={{ '--knobRot': '60deg' } as CSSProperties} />
                      <span className="knob-value">65%</span>
                    </div>
                  </div>
                  <span className="knob-label" data-lang="en">Humidity</span>
                  <span className="knob-label" data-lang="ko" hidden>습도</span>
                  <span className="knob-label" data-lang="ja" hidden>湿度</span>
                </div>
              </div>
              <div className="toggle-row">
                <span className="toggle-row__label" data-lang="en">Living Room</span>
                <span className="toggle-row__label" data-lang="ko" hidden>거실</span>
                <span className="toggle-row__label" data-lang="ja" hidden>リビング</span>
                <div className="toggle-track active" data-toggle-class="active" role="button" tabIndex={0}><div className="toggle-thumb" /></div>
              </div>
              <div className="toggle-row">
                <span className="toggle-row__label" data-lang="en">Bedroom</span>
                <span className="toggle-row__label" data-lang="ko" hidden>침실</span>
                <span className="toggle-row__label" data-lang="ja" hidden>寝室</span>
                <div className="toggle-track" data-toggle-class="active" role="button" tabIndex={0}><div className="toggle-thumb" /></div>
              </div>
              <div className="toggle-row">
                <span className="toggle-row__label" data-lang="en">Kitchen</span>
                <span className="toggle-row__label" data-lang="ko" hidden>주방</span>
                <span className="toggle-row__label" data-lang="ja" hidden>キッチン</span>
                <div className="toggle-track active" data-toggle-class="active" role="button" tabIndex={0}><div className="toggle-thumb" /></div>
              </div>
            </div>
          </div>
          {/* Row 2: Weather Widget + Clock */}
          <div className="demo-grid">
            <div className="neu-card">
              <h3 data-lang="en">Weather</h3>
              <h3 data-lang="ko" hidden>날씨</h3>
              <h3 data-lang="ja" hidden>天気</h3>
              <div className="weather">
                <div className="weather__icon">
                  <svg viewBox="0 0 24 24"><circle cx={12} cy={12} r={5} /><line x1={12} y1={1} x2={12} y2={3} /><line x1={12} y1={21} x2={12} y2={23} /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1={1} y1={12} x2={3} y2={12} /><line x1={21} y1={12} x2={23} y2={12} /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                </div>
                <div className="weather__temp">24°</div>
                <div className="weather__condition" data-lang="en">Partly Cloudy</div>
                <div className="weather__condition" data-lang="ko" hidden>구름 조금</div>
                <div className="weather__condition" data-lang="ja" hidden>晴れ時々曇り</div>
                <div className="weather__details">
                  <div className="weather__detail">
                    <div className="weather__detail-val">48%</div>
                    <div className="weather__detail-label" data-lang="en">Humidity</div>
                    <div className="weather__detail-label" data-lang="ko" hidden>습도</div>
                    <div className="weather__detail-label" data-lang="ja" hidden>湿度</div>
                  </div>
                  <div className="weather__detail">
                    <div className="weather__detail-val">12 km/h</div>
                    <div className="weather__detail-label" data-lang="en">Wind</div>
                    <div className="weather__detail-label" data-lang="ko" hidden>바람</div>
                    <div className="weather__detail-label" data-lang="ja" hidden>風速</div>
                  </div>
                  <div className="weather__detail">
                    <div className="weather__detail-val">UV 3</div>
                    <div className="weather__detail-label" data-lang="en">Index</div>
                    <div className="weather__detail-label" data-lang="ko" hidden>자외선</div>
                    <div className="weather__detail-label" data-lang="ja" hidden>指数</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="neu-card">
              <h3 data-lang="en">Clock</h3>
              <h3 data-lang="ko" hidden>시계</h3>
              <h3 data-lang="ja" hidden>時計</h3>
              <div style={{paddingTop: 10}}>
                <div className="clock-face">
                  <div className="clock-inner">
                    <div className="clock-dot" />
                    <div className="clock-hand clock-hand--hour" />
                    <div className="clock-hand clock-hand--min" />
                  </div>
                </div>
                <div className="clock-time-text">10:24</div>
                <div className="clock-date-text" data-lang="en">Wednesday, March 6</div>
                <div className="clock-date-text" data-lang="ko" hidden>수요일, 3월 6일</div>
                <div className="clock-date-text" data-lang="ja" hidden>水曜日、3月6日</div>
              </div>
              <div style={{marginTop: 20}}>
                <div className="seg-control">
                  <button className="seg-control__item active" data-lang="en">Analog</button>
                  <button className="seg-control__item active" data-lang="ko" hidden>아날로그</button>
                  <button className="seg-control__item active" data-lang="ja" hidden>アナログ</button>
                  <button className="seg-control__item" data-lang="en">Digital</button>
                  <button className="seg-control__item" data-lang="ko" hidden>디지털</button>
                  <button className="seg-control__item" data-lang="ja" hidden>デジタル</button>
                  <button className="seg-control__item" data-lang="en">World</button>
                  <button className="seg-control__item" data-lang="ko" hidden>세계시간</button>
                  <button className="seg-control__item" data-lang="ja" hidden>世界時計</button>
                </div>
              </div>
            </div>
          </div>
          {/* Row 3: Circular Progress + Input Fields */}
          <div className="demo-grid">
            <div className="neu-card">
              <h3 data-lang="en">Progress</h3>
              <h3 data-lang="ko" hidden>진행률</h3>
              <h3 data-lang="ja" hidden>進捗</h3>
              <div className="progress-row" style={{margin: '16px 0 24px'}}>
                <div className="progress-item">
                  <div className="circ-progress">
                    <svg viewBox="0 0 90 90">
                      <circle className="circ-progress__bg" cx={45} cy={45} r={39} />
                      <circle className="circ-progress__fill" cx={45} cy={45} r={39} style={{strokeDashoffset: 69}} />
                    </svg>
                    <span className="circ-progress__label">72%</span>
                  </div>
                  <div className="progress-item__label">CPU</div>
                </div>
                <div className="progress-item">
                  <div className="circ-progress">
                    <svg viewBox="0 0 90 90">
                      <circle className="circ-progress__bg" cx={45} cy={45} r={39} />
                      <circle className="circ-progress__fill" cx={45} cy={45} r={39} style={{strokeDashoffset: 123}} />
                    </svg>
                    <span className="circ-progress__label">50%</span>
                  </div>
                  <div className="progress-item__label">RAM</div>
                </div>
                <div className="progress-item">
                  <div className="circ-progress">
                    <svg viewBox="0 0 90 90">
                      <circle className="circ-progress__bg" cx={45} cy={45} r={39} />
                      <circle className="circ-progress__fill" cx={45} cy={45} r={39} style={{strokeDashoffset: 180}} />
                    </svg>
                    <span className="circ-progress__label">27%</span>
                  </div>
                  <div className="progress-item__label" data-lang="en">Disk</div>
                  <div className="progress-item__label" data-lang="ko" hidden>디스크</div>
                  <div className="progress-item__label" data-lang="ja" hidden>ディスク</div>
                </div>
              </div>
              <div>
                <div className="lin-progress-label">
                  <span data-lang="en">Download</span><span data-lang="ko" hidden>다운로드</span><span data-lang="ja" hidden>ダウンロード</span>
                  <span>83%</span>
                </div>
                <div className="lin-progress"><div className="lin-progress__fill" style={{width: '83%'}} /></div>
                <div className="lin-progress-label">
                  <span data-lang="en">Upload</span><span data-lang="ko" hidden>업로드</span><span data-lang="ja" hidden>アップロード</span>
                  <span>41%</span>
                </div>
                <div className="lin-progress"><div className="lin-progress__fill" style={{width: '41%'}} /></div>
              </div>
            </div>
            <div className="neu-card">
              <h3 data-lang="en">Form Elements</h3>
              <h3 data-lang="ko" hidden>폼 요소</h3>
              <h3 data-lang="ja" hidden>フォーム要素</h3>
              <div style={{marginTop: 12}}>
                <input className="neu-input" type="text" placeholder="Username" data-i18n-placeholder="Username" />
                <input className="neu-input" type="password" placeholder="Password" data-i18n-placeholder="Password" />
                <input className="neu-input" type="text" placeholder="Search..." data-i18n-placeholder="Search..." />
                <div style={{display: 'flex', gap: 12, marginTop: 6}}>
                  <button className="top-btn" style={{flex: 1, justifyContent: 'center'}} data-lang="en">Sign In</button>
                  <button className="top-btn" style={{flex: 1, justifyContent: 'center'}} data-lang="ko" hidden>로그인</button>
                  <button className="top-btn" style={{flex: 1, justifyContent: 'center'}} data-lang="ja" hidden>ログイン</button>
                  <button className="top-btn neu-card--inset" style={{flex: 1, justifyContent: 'center', boxShadow: 'inset 4px 4px 8px rgba(var(--shadow-dark-rgb), 0.6), inset -4px -4px 8px rgba(var(--shadow-light-rgb), 0.5)'}} data-lang="en">Cancel</button>
                  <button className="top-btn neu-card--inset" style={{flex: 1, justifyContent: 'center', boxShadow: 'inset 4px 4px 8px rgba(var(--shadow-dark-rgb), 0.6), inset -4px -4px 8px rgba(var(--shadow-light-rgb), 0.5)'}} data-lang="ko" hidden>취소</button>
                  <button className="top-btn neu-card--inset" style={{flex: 1, justifyContent: 'center', boxShadow: 'inset 4px 4px 8px rgba(var(--shadow-dark-rgb), 0.6), inset -4px -4px 8px rgba(var(--shadow-light-rgb), 0.5)'}} data-lang="ja" hidden>キャンセル</button>
                </div>
              </div>
            </div>
          </div>
          {/* Row 4: Stats + Shadow Palette (full width) */}
          <div className="demo-grid">
            <div className="neu-card">
              <h3 data-lang="en">Statistics</h3>
              <h3 data-lang="ko" hidden>통계</h3>
              <h3 data-lang="ja" hidden>統計</h3>
              <div className="stat-wells" style={{marginTop: 14}}>
                <div className="stat-well">
                  <div className="stat-well__num">1,284</div>
                  <div className="stat-well__label" data-lang="en">Users</div>
                  <div className="stat-well__label" data-lang="ko" hidden>사용자</div>
                  <div className="stat-well__label" data-lang="ja" hidden>ユーザー</div>
                </div>
                <div className="stat-well">
                  <div className="stat-well__num">96.7%</div>
                  <div className="stat-well__label" data-lang="en">Uptime</div>
                  <div className="stat-well__label" data-lang="ko" hidden>가동률</div>
                  <div className="stat-well__label" data-lang="ja" hidden>稼働率</div>
                </div>
                <div className="stat-well">
                  <div className="stat-well__num">3.2s</div>
                  <div className="stat-well__label" data-lang="en">Avg Load</div>
                  <div className="stat-well__label" data-lang="ko" hidden>평균 로딩</div>
                  <div className="stat-well__label" data-lang="ja" hidden>平均読込</div>
                </div>
              </div>
            </div>
            <div className="neu-card">
              <h3 data-lang="en">Shadow Depth Palette</h3>
              <h3 data-lang="ko" hidden>그림자 깊이 팔레트</h3>
              <h3 data-lang="ja" hidden>シャドウ深度パレット</h3>
              <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 14px'}} data-lang="en">One color, four depths — all {palette.bg.toUpperCase()}</p>
              <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 14px'}} data-lang="ko" hidden>하나의 색상, 네 가지 깊이 — 모두 {palette.bg.toUpperCase()}</p>
              <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 14px'}} data-lang="ja" hidden>1色、4つの深度 — すべて {palette.bg.toUpperCase()}</p>
              <div className="shadow-palette">
                <div className="shadow-swatch shadow-swatch--flat">Flat</div>
                <div className="shadow-swatch shadow-swatch--raised">Raised</div>
                <div className="shadow-swatch shadow-swatch--concave">Concave</div>
                <div className="shadow-swatch shadow-swatch--convex">Convex</div>
              </div>
            </div>
          </div>
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre id="prompt-neu" data-lang="en">{`Design a landing page in Neumorphism style — monochromatic surfaces where depth comes entirely from light and shadow embossing on a single background color.

PALETTE: ${palette.name} (${palette.bg.toUpperCase()})

COLOR TOKENS:
--bg: ${palette.bg}
--text: ${palette.textMain}
--text-muted: ${palette.textMuted}
--shadow-dark-rgb: ${palette.shadowDarkRgb}
--shadow-light-rgb: ${palette.shadowLightRgb}
--shadow-dark: rgba(var(--shadow-dark-rgb), 0.6)
--shadow-light: rgba(var(--shadow-light-rgb), 0.5)
No other colors. Background, cards, and buttons all use ${palette.bg.toUpperCase()}.

TYPOGRAPHY:
Font family: 'Poppins', sans-serif. Weights: 300 (light), 400 (regular), 600 (semibold).
h1: font-weight: 600, font-size: clamp(2.5rem, 5vw, 4rem), letter-spacing: -0.02em.
h2: text-transform: uppercase, font-size: 1.1rem, letter-spacing: 2px, color: ${palette.textMuted}.
Body: font-size: 1.2rem, color: ${palette.textMuted}.
Panel text: font-size: 0.9rem.

UI:
Hero section: background ${palette.bg}, border-radius: 40px, padding: 50px, text-align: center.
Inset panels: background ${palette.bg}, border-radius: 20px, padding: 30px, text-align: left.
Buttons: background ${palette.bg}, border-radius: 30px, padding: 10px 20px (nav) / 15px 40px (CTA), font-weight: 600, color: ${palette.textMain}.
No visible borders on any element.

LAYOUT:
Page container: width: min(1000px, 92vw), margin: 0 auto, padding: 40px 0 80px.
Panel grid: display: grid, grid-template-columns: 1fr 1fr, gap: 40px, margin-top: 40px.

SHADOW SYSTEM (critical — the only depth mechanism):
Raised (convex): 10px 10px 20px rgba(var(--shadow-dark-rgb), 0.6), -10px -10px 20px rgba(var(--shadow-light-rgb), 0.5).
Inset (concave): inset 8px 8px 16px rgba(var(--shadow-dark-rgb), 0.6), inset -8px -8px 16px rgba(var(--shadow-light-rgb), 0.5).
Button raised: 6px 6px 12px rgba(var(--shadow-dark-rgb), 0.6), -6px -6px 12px rgba(var(--shadow-light-rgb), 0.5).
Button active (pressed): inset 4px 4px 8px rgba(var(--shadow-dark-rgb), 0.6), inset -4px -4px 8px rgba(var(--shadow-light-rgb), 0.5).

MOTION:
Button hover: slight scale increase, transition: 0.2s.
Button :active: switches from raised to inset shadow + transform: translateY(2px), transition: 0.2s.
No other animations.

RESPONSIVE:
≤768px: panel grid collapses to grid-template-columns: 1fr (single column).
≥1000px: page width caps at 1000px, 2-column panel grid maintained.

FORBIDDEN:
- border property on any element (depth from box-shadow only)
- Colorful or gradient backgrounds (monochromatic ${palette.bg} only)
- Visible outlines or dividers
- Drop shadows with color tints

OUTPUT:
1) CSS custom properties for raised/inset shadow pairs and color tokens
2) Hero section (centered) + inset panel grid (2 columns) + button set
3) Single-file HTML/CSS with responsive support`}</pre>
            <pre data-lang="ko" hidden>{`Neumorphism 스타일의 랜딩 페이지를 디자인해줘 — 단일 배경색 위에서 빛과 그림자 엠보싱으로만 깊이감을 표현하는 단색 표면.

팔레트: ${palette.name} (${palette.bg.toUpperCase()})

색상 토큰:
--bg: ${palette.bg}
--text: ${palette.textMain}
--text-muted: ${palette.textMuted}
--shadow-dark-rgb: ${palette.shadowDarkRgb}
--shadow-light-rgb: ${palette.shadowLightRgb}
--shadow-dark: rgba(var(--shadow-dark-rgb), 0.6)
--shadow-light: rgba(var(--shadow-light-rgb), 0.5)
다른 색상 사용 금지. 배경, 카드, 버튼 모두 ${palette.bg.toUpperCase()} 사용.

타이포그래피:
폰트: 'Poppins', sans-serif. 웨이트: 300 (light), 400 (regular), 600 (semibold).
h1: font-weight: 600, font-size: clamp(2.5rem, 5vw, 4rem), letter-spacing: -0.02em.
h2: text-transform: uppercase, font-size: 1.1rem, letter-spacing: 2px, color: ${palette.textMuted}.
본문: font-size: 1.2rem, color: ${palette.textMuted}.
패널 텍스트: font-size: 0.9rem.

UI:
히어로 섹션: background ${palette.bg}, border-radius: 40px, padding: 50px, text-align: center.
인셋 패널: background ${palette.bg}, border-radius: 20px, padding: 30px, text-align: left.
버튼: background ${palette.bg}, border-radius: 30px, padding: 10px 20px (내비) / 15px 40px (CTA), font-weight: 600, color: ${palette.textMain}.
어떤 요소에도 보이는 보더 없음.

레이아웃:
페이지 컨테이너: width: min(1000px, 92vw), margin: 0 auto, padding: 40px 0 80px.
패널 그리드: display: grid, grid-template-columns: 1fr 1fr, gap: 40px, margin-top: 40px.

그림자 시스템 (핵심 — 유일한 깊이감 메커니즘):
양각(볼록): 10px 10px 20px rgba(var(--shadow-dark-rgb), 0.6), -10px -10px 20px rgba(var(--shadow-light-rgb), 0.5).
음각(오목): inset 8px 8px 16px rgba(var(--shadow-dark-rgb), 0.6), inset -8px -8px 16px rgba(var(--shadow-light-rgb), 0.5).
버튼 양각: 6px 6px 12px rgba(var(--shadow-dark-rgb), 0.6), -6px -6px 12px rgba(var(--shadow-light-rgb), 0.5).
버튼 active(눌림): inset 4px 4px 8px rgba(var(--shadow-dark-rgb), 0.6), inset -4px -4px 8px rgba(var(--shadow-light-rgb), 0.5).

모션:
버튼 hover: 살짝 확대, transition: 0.2s.
버튼 :active: 양각에서 음각 그림자로 전환 + transform: translateY(2px), transition: 0.2s.
다른 애니메이션 없음.

반응형:
≤768px: 패널 그리드 grid-template-columns: 1fr (1열)로 전환.
≥1000px: 페이지 폭 1000px 고정, 2열 패널 그리드 유지.

금지사항:
- 어떤 요소에도 border 속성 사용 (깊이감은 box-shadow로만)
- 컬러풀하거나 그라데이션 배경 (단색 ${palette.bg}만 허용)
- 보이는 외곽선이나 구분선
- 색조가 있는 드롭 섀도우

출력:
1) 양각/음각 그림자 쌍과 색상 토큰을 위한 CSS 커스텀 속성
2) 히어로 섹션(중앙 정렬) + 인셋 패널 그리드(2열) + 버튼 세트
3) 반응형 대응이 포함된 단일 HTML/CSS 파일`}</pre>
            <pre data-lang="ja" hidden>{`Neumorphismスタイルのランディングページをデザインしてください — 単一の背景色の上で光と影のエンボス加工のみで深度を表現するモノクロマティックな表面。

パレット: ${palette.name} (${palette.bg.toUpperCase()})

カラートークン:
--bg: ${palette.bg}
--text: ${palette.textMain}
--text-muted: ${palette.textMuted}
--shadow-dark-rgb: ${palette.shadowDarkRgb}
--shadow-light-rgb: ${palette.shadowLightRgb}
--shadow-dark: rgba(var(--shadow-dark-rgb), 0.6)
--shadow-light: rgba(var(--shadow-light-rgb), 0.5)
他の色は使用禁止。背景、カード、ボタンすべて${palette.bg.toUpperCase()}を使用。

タイポグラフィ:
フォント: 'Poppins', sans-serif。ウェイト: 300 (light), 400 (regular), 600 (semibold)。
h1: font-weight: 600, font-size: clamp(2.5rem, 5vw, 4rem), letter-spacing: -0.02em。
h2: text-transform: uppercase, font-size: 1.1rem, letter-spacing: 2px, color: ${palette.textMuted}。
本文: font-size: 1.2rem, color: ${palette.textMuted}。
パネルテキスト: font-size: 0.9rem。

UI:
ヒーローセクション: background ${palette.bg}, border-radius: 40px, padding: 50px, text-align: center。
インセットパネル: background ${palette.bg}, border-radius: 20px, padding: 30px, text-align: left。
ボタン: background ${palette.bg}, border-radius: 30px, padding: 10px 20px (ナビ) / 15px 40px (CTA), font-weight: 600, color: ${palette.textMain}。
いかなる要素にも可視のボーダーなし。

レイアウト:
ページコンテナ: width: min(1000px, 92vw), margin: 0 auto, padding: 40px 0 80px。
パネルグリッド: display: grid, grid-template-columns: 1fr 1fr, gap: 40px, margin-top: 40px。

シャドウシステム（重要 — 唯一の深度メカニズム）:
凸（浮き出し）: 10px 10px 20px rgba(var(--shadow-dark-rgb), 0.6), -10px -10px 20px rgba(var(--shadow-light-rgb), 0.5)。
凹（くぼみ）: inset 8px 8px 16px rgba(var(--shadow-dark-rgb), 0.6), inset -8px -8px 16px rgba(var(--shadow-light-rgb), 0.5)。
ボタン凸: 6px 6px 12px rgba(var(--shadow-dark-rgb), 0.6), -6px -6px 12px rgba(var(--shadow-light-rgb), 0.5)。
ボタンactive（押下）: inset 4px 4px 8px rgba(var(--shadow-dark-rgb), 0.6), inset -4px -4px 8px rgba(var(--shadow-light-rgb), 0.5)。

モーション:
ボタンhover: わずかに拡大、transition: 0.2s。
ボタン:active: 凸から凹シャドウに切り替え + transform: translateY(2px), transition: 0.2s。
他のアニメーションなし。

レスポンシブ:
≤768px: パネルグリッドがgrid-template-columns: 1fr（1列）に変更。
≥1000px: ページ幅1000px固定、2列パネルグリッド維持。

禁止事項:
- いかなる要素にもborderプロパティ（深度はbox-shadowのみ）
- カラフルまたはグラデーション背景（モノクロマティック${palette.bg}のみ）
- 可視のアウトラインや仕切り線
- 色調のあるドロップシャドウ

出力:
1) 凸/凹シャドウペアとカラートークンのCSSカスタムプロパティ
2) ヒーローセクション（中央揃え）+ インセットパネルグリッド（2列）+ ボタンセット
3) レスポンシブ対応を含む単一HTML/CSSファイル`}</pre>
            <button className="copy-btn" data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/claymorphism.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Claymorphism</span></a><div className="page-nav__divider" /><a href="/pages/soft-pastel.html"><span><span className="page-nav__label">다음</span>Soft Pastel</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
