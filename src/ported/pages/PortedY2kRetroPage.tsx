import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedY2kRetroPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--y2k-retro">
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
        <main className="page" id="main-content">
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
          {/* Hero Window */}
          <section className="window hero">
            <div className="title-bar">
              <svg className="title-bar-icon" viewBox="0 0 16 16" fill="none">
                <rect x={1} y={3} width={14} height={10} fill="#c0c0c0" stroke="#fff" strokeWidth={1} />
                <rect x={1} y={3} width={14} height={3} fill="#000080" />
                <rect x={3} y={7} width={4} height={1} fill="#000" />
                <rect x={3} y={9} width={7} height={1} fill="#808080" />
              </svg>
              <span className="title-bar-text">Welcome to Windows 98</span>
              <div className="title-bar-controls">
                <button aria-label="Minimize">_</button>
                <button aria-label="Maximize">□</button>
                <button aria-label="Close">✕</button>
              </div>
            </div>
            <div className="menu-bar">
              <button>File</button>
              <button>Edit</button>
              <button>View</button>
              <button>Help</button>
            </div>
            <div className="window-body">
              <h1>Windows 98</h1>
              <p data-lang="en">A clean retro UI inspired by the classic Windows 95/98 desktop. Ideal for developer tools, documentation sites, and nostalgic landing pages that want structure over spectacle.</p>
              <p data-lang="ko" hidden>클래식 Windows 95/98 데스크톱에서 영감을 받은 깔끔한 레트로 UI입니다. 개발자 도구, 문서 사이트, 화려함보다 구조를 원하는 노스탤지어 랜딩 페이지에 이상적입니다.</p>
              <p data-lang="ja" hidden>クラシックなWindows 95/98デスクトップにインスパイアされたクリーンなレトロUIです。開発ツール、ドキュメントサイト、派手さよりも構造を重視するノスタルジックなランディングページに最適です。</p>
              <div className="desktop-icons">
                <a className="desktop-icon" href="#">
                  <svg viewBox="0 0 32 32" fill="none">
                    <rect x={4} y={2} width={24} height={28} fill="#fff" stroke="#000" strokeWidth="1.5" />
                    <rect x={8} y={6} width={16} height={2} fill="#000080" />
                    <rect x={8} y={10} width={12} height={1} fill="#808080" />
                    <rect x={8} y={13} width={14} height={1} fill="#808080" />
                    <rect x={8} y={16} width={10} height={1} fill="#808080" />
                    <rect x={8} y={19} width={13} height={1} fill="#808080" />
                  </svg>
                  <span>README.txt</span>
                </a>
                <a className="desktop-icon" href="#">
                  <svg viewBox="0 0 32 32" fill="none">
                    <rect x={2} y={8} width={28} height={22} rx={0} fill="#ffff80" stroke="#000" strokeWidth="1.5" />
                    <rect x={2} y={4} width={14} height={6} fill="#ffff80" stroke="#000" strokeWidth="1.5" />
                  </svg>
                  <span>My Projects</span>
                </a>
                <a className="desktop-icon" href="#">
                  <svg viewBox="0 0 32 32" fill="none">
                    <rect x={4} y={4} width={24} height={20} fill="#000080" stroke="#000" strokeWidth="1.5" />
                    <rect x={6} y={6} width={20} height={16} fill="#008080" />
                    <rect x={8} y={25} width={16} height={3} fill="#c0c0c0" stroke="#000" strokeWidth={1} />
                  </svg>
                  <span>Display</span>
                </a>
                <a className="desktop-icon" href="#">
                  <svg viewBox="0 0 32 32" fill="none">
                    <circle cx={16} cy={16} r={12} fill="#c0c0c0" stroke="#000" strokeWidth="1.5" />
                    <rect x={15} y={8} width={2} height={9} fill="#000" />
                    <rect x={15} y={15} width={7} height={2} fill="#000" />
                    <circle cx={16} cy={16} r={2} fill="#000" />
                  </svg>
                  <span>Settings</span>
                </a>
                <a className="desktop-icon" href="#">
                  <svg viewBox="0 0 32 32" fill="none">
                    <rect x={3} y={5} width={26} height={20} fill="#c0c0c0" stroke="#000" strokeWidth="1.5" />
                    <rect x={5} y={7} width={22} height={14} fill="#fff" stroke="#808080" strokeWidth={1} />
                    <path d="M8 16h16M16 9v12" stroke="#000080" strokeWidth={2} />
                    <rect x={10} y={25} width={12} height={3} fill="#808080" stroke="#000" strokeWidth={1} />
                  </svg>
                  <span>Net Setup</span>
                </a>
                <a className="desktop-icon" href="#">
                  <svg viewBox="0 0 32 32" fill="none">
                    <path d="M9 7h14l-2 21H11L9 7Z" fill="#c0c0c0" stroke="#000" strokeWidth="1.5" />
                    <path d="M12 4h8l1 3H11l1-3Z" fill="#dfdfdf" stroke="#000" strokeWidth="1.5" />
                    <path d="M13 12h6M13 16h6M13 20h5" stroke="#808080" strokeWidth={1} />
                  </svg>
                  <span>Recycle Bin</span>
                </a>
              </div>
              <div className="btn-group">
                <button className="btn-win">OK</button>
                <button className="btn-win">Cancel</button>
              </div>
            </div>
            <div className="status-bar">
              <div className="status-bar-field">Ready</div>
              <div className="status-bar-field">640x480</div>
              <div className="status-bar-field">16-bit</div>
            </div>
          </section>
          {/* Properties Window */}
          <section className="window">
            <div className="title-bar">
              <span className="title-bar-text">Style Properties</span>
              <div className="title-bar-controls">
                <button aria-label="Close">✕</button>
              </div>
            </div>
            <div className="tab-bar">
              <button className="tab active">General</button>
              <button className="tab">Colors</button>
              <button className="tab">Layout</button>
            </div>
            <div className="window-body" style={{marginTop: 0, borderTop: '2px solid var(--border-out-light)'}}>
              <div className="tree-view">
                <ul>
                  <li>Windows 98 Style
                    <ul>
                      <li className="file">Beveled borders (outset + inset)</li>
                      <li className="file">Title bar gradient (#000080 to #1084d0)</li>
                      <li className="file">Menu bar with hover states</li>
                      <li className="file">Status bar at window bottom</li>
                      <li>Typography
                        <ul>
                          <li className="file">Tahoma / MS Sans Serif</li>
                          <li className="file">12-13px body, system font sizing</li>
                        </ul>
                      </li>
                      <li>Color System
                        <ul>
                          <li className="file">#c0c0c0 - Window background</li>
                          <li className="file">#000080 - Highlight / Title bar</li>
                          <li className="file">#008080 - Desktop teal</li>
                          <li className="file">#ffffff / #000000 - Bevel light/dark</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <hr />
              <p style={{fontSize: 12, color: '#333', margin: '4px 0 0'}}>No border-radius. No transitions. No blur. Just bevels.</p>
            </div>
          </section>
          {/* Desktop System Window */}
          <section className="window">
            <div className="title-bar">
              <span className="title-bar-text">C:\WINDOWS\Style Kit</span>
              <div className="title-bar-controls">
                <button aria-label="Minimize">_</button>
                <button aria-label="Maximize">□</button>
                <button aria-label="Close">✕</button>
              </div>
            </div>
            <div className="menu-bar">
              <button>File</button>
              <button>Tools</button>
              <button>Options</button>
              <button>Help</button>
            </div>
            <div className="window-body">
              <div className="y2k-system-grid">
                <div className="y2k-preview-pane">
                  <div className="y2k-monitor" aria-hidden>
                    <div className="y2k-monitor__screen">
                      <span>WEB</span>
                      <b>98</b>
                    </div>
                    <div className="y2k-monitor__stand" />
                  </div>
                  <div>
                    <h2 data-lang="en">Desktop surface, not a theme skin</h2>
                    <h2 data-lang="ko" hidden>테마 스킨이 아니라 데스크톱 표면</h2>
                    <h2 data-lang="ja" hidden>テーマスキンではなくデスクトップ表面</h2>
                    <p data-lang="en">Use the window chrome as the layout system: title bars name each task, status bars carry state, and every button has a mechanical pressed state.</p>
                    <p data-lang="ko" hidden>윈도우 크롬 자체를 레이아웃 시스템으로 씁니다. 타이틀바는 작업 이름을 붙이고, 상태바는 상태를 싣고, 모든 버튼은 기계적인 눌림 상태를 가집니다.</p>
                    <p data-lang="ja" hidden>ウィンドウクローム自体をレイアウトシステムとして使います。タイトルバーは作業名を示し、ステータスバーは状態を運び、すべてのボタンは機械的な押下状態を持ちます。</p>
                  </div>
                </div>
                <div className="y2k-spec-list">
                  <div className="y2k-spec-row">
                    <span>Chrome</span>
                    <strong data-lang="en">Raised frame + blue active title</strong>
                    <strong data-lang="ko" hidden>양각 프레임 + 파란 활성 타이틀</strong>
                    <strong data-lang="ja" hidden>凸フレーム + 青いアクティブタイトル</strong>
                  </div>
                  <div className="y2k-spec-row">
                    <span>Density</span>
                    <strong data-lang="en">Small controls, real labels, no airy cards</strong>
                    <strong data-lang="ko" hidden>작은 컨트롤, 실제 라벨, 넓은 카드 금지</strong>
                    <strong data-lang="ja" hidden>小さなコントロール、実ラベル、余白カード禁止</strong>
                  </div>
                  <div className="y2k-spec-row">
                    <span>Depth</span>
                    <strong data-lang="en">Inset panels for input, outset panels for action</strong>
                    <strong data-lang="ko" hidden>입력은 음각, 액션은 양각 패널</strong>
                    <strong data-lang="ja" hidden>入力は凹、アクションは凸パネル</strong>
                  </div>
                  <div className="y2k-spec-row">
                    <span>Color</span>
                    <strong data-lang="en">Teal desktop, gray chrome, one blue highlight</strong>
                    <strong data-lang="ko" hidden>틸 데스크톱, 회색 크롬, 파란 하이라이트 하나</strong>
                    <strong data-lang="ja" hidden>ティールのデスクトップ、灰色クローム、青いハイライトひとつ</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="status-bar">
              <div className="status-bar-field">Style kit ready</div>
              <div className="status-bar-field">4 objects</div>
            </div>
          </section>

          {/* Component Sampler */}
          <section className="window">
            <div className="title-bar">
              <span className="title-bar-text">Control Panel \ Components</span>
              <div className="title-bar-controls">
                <button aria-label="Minimize">_</button>
                <button aria-label="Maximize">□</button>
                <button aria-label="Close">✕</button>
              </div>
            </div>
            <div className="tab-bar">
              <button className="tab active">Controls</button>
              <button className="tab">Fields</button>
              <button className="tab">Meters</button>
              <button className="tab">Alerts</button>
            </div>
            <div className="window-body" style={{marginTop: 0, borderTop: '2px solid var(--border-out-light)'}}>
              <div className="y2k-controls-grid">
                <fieldset className="y2k-fieldset">
                  <legend>Buttons</legend>
                  <div className="y2k-stack">
                    <button className="btn-win" type="button" data-lang="en">Install</button>
                    <button className="btn-win" type="button" data-lang="ko" hidden>설치</button>
                    <button className="btn-win" type="button" data-lang="ja" hidden>インストール</button>
                    <button className="btn-win y2k-btn-default" type="button">Apply</button>
                    <button className="btn-win" type="button" disabled>Disabled</button>
                  </div>
                </fieldset>
                <fieldset className="y2k-fieldset">
                  <legend>Fields</legend>
                  <label className="y2k-check"><input type="checkbox" defaultChecked /> <span data-lang="en">Show desktop chrome</span><span data-lang="ko" hidden>데스크톱 크롬 표시</span><span data-lang="ja" hidden>デスクトップクロームを表示</span></label>
                  <label className="y2k-check"><input type="checkbox" /> <span data-lang="en">Use animated helpers</span><span data-lang="ko" hidden>애니메이션 헬퍼 사용</span><span data-lang="ja" hidden>アニメーションヘルパーを使用</span></label>
                  <label className="y2k-input-row">
                    <span data-lang="en">Path</span>
                    <span data-lang="ko" hidden>경로</span>
                    <span data-lang="ja" hidden>パス</span>
                    <input value="C:\\WEB\\STYLEBOOK" readOnly />
                  </label>
                </fieldset>
                <fieldset className="y2k-fieldset">
                  <legend>Progress</legend>
                  <div className="y2k-progress"><span style={{width: '68%'}} /></div>
                  <div className="y2k-meter-label">
                    <span data-lang="en">Copying bevel system...</span>
                    <span data-lang="ko" hidden>베벨 시스템 복사 중...</span>
                    <span data-lang="ja" hidden>ベベルシステムをコピー中...</span>
                    <b>68%</b>
                  </div>
                  <div className="y2k-mini-status">C:\WINDOWS\SYSTEM\UI.DLL</div>
                </fieldset>
                <fieldset className="y2k-fieldset y2k-dialog-sample">
                  <legend>Dialog</legend>
                  <div className="y2k-dialog-icon" aria-hidden>!</div>
                  <p data-lang="en">This style works best when every surface behaves like a real application window.</p>
                  <p data-lang="ko" hidden>이 스타일은 모든 표면이 실제 애플리케이션 창처럼 작동할 때 가장 잘 살아납니다.</p>
                  <p data-lang="ja" hidden>このスタイルは、すべての面が実アプリのウィンドウのように振る舞う時に最もよく活きます。</p>
                </fieldset>
              </div>
            </div>
            <div className="status-bar">
              <div className="status-bar-field">Controls: 12</div>
              <div className="status-bar-field">No radius</div>
              <div className="status-bar-field">No blur</div>
            </div>
          </section>

          {/* Application Layout Window */}
          <section className="window">
            <div className="title-bar">
              <span className="title-bar-text">Untitled - Web App Layout</span>
              <div className="title-bar-controls">
                <button aria-label="Minimize">_</button>
                <button aria-label="Maximize">□</button>
                <button aria-label="Close">✕</button>
              </div>
            </div>
            <div className="menu-bar">
              <button>Project</button>
              <button>Window</button>
              <button>Data</button>
              <button>Help</button>
            </div>
            <div className="window-body">
              <div className="y2k-app-layout">
                <aside className="y2k-sidebar">
                  <div className="y2k-sidebar__item is-selected">Dashboard.exe</div>
                  <div className="y2k-sidebar__item">Orders.db</div>
                  <div className="y2k-sidebar__item">Reports.xls</div>
                  <div className="y2k-sidebar__item">Settings.ini</div>
                </aside>
                <div className="y2k-main-panel">
                  <div className="y2k-toolbar">
                    <button type="button">New</button>
                    <button type="button">Open</button>
                    <button type="button">Save</button>
                    <span />
                    <button type="button">Print</button>
                  </div>
                  <table className="y2k-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th data-lang="en">Module</th>
                        <th data-lang="ko" hidden>모듈</th>
                        <th data-lang="ja" hidden>モジュール</th>
                        <th data-lang="en">Use</th>
                        <th data-lang="ko" hidden>용도</th>
                        <th data-lang="ja" hidden>用途</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>OK</td><td>Window shell</td><td data-lang="en">Primary sections</td><td data-lang="ko" hidden>주요 섹션</td><td data-lang="ja" hidden>主要セクション</td></tr>
                      <tr><td>OK</td><td>Dialog panel</td><td data-lang="en">Confirmations and alerts</td><td data-lang="ko" hidden>확인과 알림</td><td data-lang="ja" hidden>確認と通知</td></tr>
                      <tr><td>OK</td><td>Tree view</td><td data-lang="en">Nested navigation</td><td data-lang="ko" hidden>중첩 내비게이션</td><td data-lang="ja" hidden>ネストナビゲーション</td></tr>
                      <tr><td>WARN</td><td>Hero copy</td><td data-lang="en">Keep short and literal</td><td data-lang="ko" hidden>짧고 직설적으로 유지</td><td data-lang="ja" hidden>短く直接的に保つ</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="status-bar">
              <div className="status-bar-field">4 rows selected</div>
              <div className="status-bar-field">webapp.w98</div>
            </div>
          </section>
          {/* Prompt Window */}
          <section className="window prompt">
            <div className="title-bar">
              <span className="title-bar-text">C:\PROMPT\generate.bat</span>
              <div className="title-bar-controls">
                <button aria-label="Minimize">_</button>
                <button aria-label="Maximize">□</button>
                <button aria-label="Close">✕</button>
              </div>
            </div>
            <div className="menu-bar">
              <button>File</button>
              <button>Edit</button>
              <button>View</button>
            </div>
            <div className="window-body" style={{background: 'var(--bg)'}}>
              <h3 style={{marginTop: 0, fontSize: 13}} data-i18n="page.heading.prompt">AI Request Prompt</h3>
              <pre id="prompt-y2k" data-lang="en">Design a landing page in Windows 98 style — a clean retro UI inspired by Windows 95/98 with beveled chrome surfaces and teal desktop background.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #c0c0c0{"\n"}--border-out-light: #ffffff{"\n"}--border-out-dark: #000000{"\n"}--border-in-light: #dfdfdf{"\n"}--border-in-dark: #808080{"\n"}--title-bg: #000080{"\n"}--title-gradient-end: #1084d0{"\n"}--window-body: #ffffff{"\n"}--highlight: #000080{"\n"}--highlight-text: #ffffff{"\n"}--desktop-teal: #008080{"\n"}No other colors.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Body &amp; Headings: "Tahoma", "MS Sans Serif", Arial, sans-serif.{"\n"}Body size: 13px. Headings: 1.6rem bold, color: #000080.{"\n"}Menu/status bar: 12px. Tree view: 12px.{"\n"}No decorative fonts. No text-shadow.{"\n"}{"\n"}WINDOW COMPONENT:{"\n"}Frame: background #c0c0c0, padding: 3px, 4-side beveled borders.{"\n"}Title bar: linear-gradient(90deg, #000080, #1084d0), 12px bold white text, with 16x14px minimize/maximize/close buttons.{"\n"}Menu bar: horizontal buttons with hover bevel, transparent border by default.{"\n"}Window body: background #fff, inset beveled borders, padding: 16px.{"\n"}Status bar: 1-3 fields at bottom, inset borders, 11px font.{"\n"}Buttons: background #c0c0c0, padding: 6px 20px, beveled borders that invert on :active, dotted outline on :focus-visible.{"\n"}{"\n"}BEVEL SYSTEM (critical):{"\n"}Outset (raised): border-top/left 2px solid #ffffff, border-bottom/right 2px solid #000000.{"\n"}Inset (sunken): border-top/left 2px solid #000000, border-bottom/right 2px solid #ffffff.{"\n"}Inner depth: box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf.{"\n"}Window drop shadow: 4px 4px 0 rgba(0,0,0,0.35).{"\n"}{"\n"}ADDITIONAL COMPONENTS:{"\n"}Desktop icons: 32px SVG + 11px label, background: #000080 + white text on hover/focus.{"\n"}Tree view: nested ul with folder/file icons via ::before pseudo-elements, inset container.{"\n"}Tab bar: beveled tabs, active tab merges with body via matching border-bottom.{"\n"}Horizontal rule: 1px solid #808080 top + 1px solid #dfdfdf bottom.{"\n"}{"\n"}LAYOUT:{"\n"}Page container: width: min(860px, 94vw), margin: 0 auto.{"\n"}Desktop background: solid #008080.{"\n"}Windows stack vertically with margin-bottom: 30px.{"\n"}{"\n"}RESPONSIVE:{"\n"}&lt;=600px: heading 1.2rem, icons smaller gap, button group stacks vertically.{"\n"}{"\n"}FORBIDDEN:{"\n"}- border-radius on any element{"\n"}- Modern gradients, glassmorphism, blur effects{"\n"}- Decorative fonts (Impact, Comic Sans, etc.){"\n"}- CSS transitions or ease curves{"\n"}- Soft box-shadows (only hard-edge offsets){"\n"}- text-shadow, marquee, or animated text{"\n"}{"\n"}OUTPUT:{"\n"}1) CSS custom properties for all bevel and color tokens{"\n"}2) Window component (title bar + menu bar + body + status bar + buttons){"\n"}3) Desktop icons, tree view, tab components{"\n"}4) Single-file HTML/CSS with responsive support</pre>
              <pre data-lang="ko" hidden>Windows 98 스타일의 랜딩 페이지를 디자인해줘 — Windows 95/98에서 영감을 받은 깔끔한 레트로 UI, 베벨 크롬 표면과 틸 데스크톱 배경.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #c0c0c0{"\n"}--border-out-light: #ffffff{"\n"}--border-out-dark: #000000{"\n"}--border-in-light: #dfdfdf{"\n"}--border-in-dark: #808080{"\n"}--title-bg: #000080{"\n"}--title-gradient-end: #1084d0{"\n"}--window-body: #ffffff{"\n"}--highlight: #000080{"\n"}--highlight-text: #ffffff{"\n"}--desktop-teal: #008080{"\n"}다른 색상 사용 금지.{"\n"}{"\n"}타이포그래피:{"\n"}본문 및 제목: "Tahoma", "MS Sans Serif", Arial, sans-serif.{"\n"}본문 크기: 13px. 제목: 1.6rem bold, color: #000080.{"\n"}메뉴/상태바: 12px. 트리 뷰: 12px.{"\n"}장식적 폰트 금지. text-shadow 금지.{"\n"}{"\n"}윈도우 컴포넌트:{"\n"}프레임: background #c0c0c0, padding: 3px, 4면 베벨 보더.{"\n"}타이틀바: linear-gradient(90deg, #000080, #1084d0), 12px bold 흰색 텍스트, 16x14px 최소화/최대화/닫기 버튼.{"\n"}메뉴바: 호버 시 베벨이 나타나는 수평 버튼, 기본 상태에서 투명 보더.{"\n"}윈도우 바디: background #fff, 인셋 베벨 보더, padding: 16px.{"\n"}상태바: 하단 1-3개 필드, 인셋 보더, 11px 폰트.{"\n"}버튼: background #c0c0c0, padding: 6px 20px, :active 시 반전되는 베벨 보더, :focus-visible에 점선 아웃라인.{"\n"}{"\n"}베벨 시스템 (핵심):{"\n"}Outset(양각): border-top/left 2px solid #ffffff, border-bottom/right 2px solid #000000.{"\n"}Inset(음각): border-top/left 2px solid #000000, border-bottom/right 2px solid #ffffff.{"\n"}내부 깊이: box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf.{"\n"}윈도우 드롭 섀도: 4px 4px 0 rgba(0,0,0,0.35).{"\n"}{"\n"}추가 컴포넌트:{"\n"}데스크톱 아이콘: 32px SVG + 11px 라벨, hover/focus 시 배경 #000080 + 흰색 텍스트.{"\n"}트리 뷰: ::before 의사 요소로 폴더/파일 아이콘이 있는 중첩 ul, 인셋 컨테이너.{"\n"}탭바: 베벨 탭, 활성 탭은 border-bottom 일치로 바디와 병합.{"\n"}수평선: 상단 1px solid #808080 + 하단 1px solid #dfdfdf.{"\n"}{"\n"}레이아웃:{"\n"}페이지 컨테이너: width: min(860px, 94vw), margin: 0 auto.{"\n"}데스크톱 배경: 단색 #008080.{"\n"}윈도우는 수직으로 쌓이며 margin-bottom: 30px.{"\n"}{"\n"}반응형:{"\n"}&lt;=600px: 제목 1.2rem, 아이콘 간격 축소, 버튼 그룹 수직 정렬.{"\n"}{"\n"}금지사항:{"\n"}- 어떤 요소에도 border-radius{"\n"}- 모던 그라데이션, 글래스모피즘, 블러 효과{"\n"}- 장식적 폰트 (Impact, Comic Sans 등){"\n"}- CSS transition이나 ease 곡선{"\n"}- 소프트 box-shadow (하드 엣지 오프셋만 허용){"\n"}- text-shadow, 마퀴, 애니메이션 텍스트{"\n"}{"\n"}출력:{"\n"}1) 모든 베벨과 색상 토큰의 CSS 커스텀 속성{"\n"}2) 윈도우 컴포넌트 (타이틀바 + 메뉴바 + 바디 + 상태바 + 버튼){"\n"}3) 데스크톱 아이콘, 트리 뷰, 탭 컴포넌트{"\n"}4) 반응형 대응이 포함된 단일 HTML/CSS 파일</pre>
              <pre data-lang="ja" hidden>Windows 98スタイルのランディングページをデザインしてください — Windows 95/98にインスパイアされたクリーンなレトロUI、ベベルクロム表面とティールデスクトップ背景。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #c0c0c0{"\n"}--border-out-light: #ffffff{"\n"}--border-out-dark: #000000{"\n"}--border-in-light: #dfdfdf{"\n"}--border-in-dark: #808080{"\n"}--title-bg: #000080{"\n"}--title-gradient-end: #1084d0{"\n"}--window-body: #ffffff{"\n"}--highlight: #000080{"\n"}--highlight-text: #ffffff{"\n"}--desktop-teal: #008080{"\n"}他の色は使用禁止。{"\n"}{"\n"}タイポグラフィ:{"\n"}本文・見出し: "Tahoma", "MS Sans Serif", Arial, sans-serif。{"\n"}本文サイズ: 13px。見出し: 1.6rem bold, color: #000080。{"\n"}メニュー/ステータスバー: 12px。ツリービュー: 12px。{"\n"}装飾フォント禁止。text-shadow禁止。{"\n"}{"\n"}ウィンドウコンポーネント:{"\n"}フレーム: background #c0c0c0, padding: 3px, 4面ベベルボーダー。{"\n"}タイトルバー: linear-gradient(90deg, #000080, #1084d0), 12px bold白テキスト、16x14px最小化/最大化/閉じるボタン。{"\n"}メニューバー: ホバーでベベルが表示される水平ボタン、デフォルトは透明ボーダー。{"\n"}ウィンドウボディ: background #fff, インセットベベルボーダー, padding: 16px。{"\n"}ステータスバー: 下部1-3フィールド、インセットボーダー、11pxフォント。{"\n"}ボタン: background #c0c0c0, padding: 6px 20px, :activeで反転するベベルボーダー、:focus-visibleで点線アウトライン。{"\n"}{"\n"}ベベルシステム（重要）:{"\n"}Outset（凸）: border-top/left 2px solid #ffffff, border-bottom/right 2px solid #000000。{"\n"}Inset（凹）: border-top/left 2px solid #000000, border-bottom/right 2px solid #ffffff。{"\n"}内部深度: box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf。{"\n"}ウィンドウドロップシャドウ: 4px 4px 0 rgba(0,0,0,0.35)。{"\n"}{"\n"}追加コンポーネント:{"\n"}デスクトップアイコン: 32px SVG + 11pxラベル、hover/focus時背景#000080 + 白テキスト。{"\n"}ツリービュー: ::before疑似要素でフォルダ/ファイルアイコン付きネストul、インセットコンテナ。{"\n"}タブバー: ベベルタブ、アクティブタブはborder-bottom一致でボディと結合。{"\n"}水平線: 上1px solid #808080 + 下1px solid #dfdfdf。{"\n"}{"\n"}レイアウト:{"\n"}ページコンテナ: width: min(860px, 94vw), margin: 0 auto。{"\n"}デスクトップ背景: 単色#008080。{"\n"}ウィンドウは垂直に積み重ね、margin-bottom: 30px。{"\n"}{"\n"}レスポンシブ:{"\n"}&lt;=600px: 見出し1.2rem、アイコン間隔縮小、ボタングループ縦並び。{"\n"}{"\n"}禁止事項:{"\n"}- いかなる要素にもborder-radius{"\n"}- モダンなグラデーション、グラスモーフィズム、ブラー効果{"\n"}- 装飾フォント（Impact、Comic Sansなど）{"\n"}- CSSトランジションやease曲線{"\n"}- ソフトbox-shadow（ハードエッジオフセットのみ）{"\n"}- text-shadow、マーキー、アニメーションテキスト{"\n"}{"\n"}出力:{"\n"}1) すべてのベベルとカラートークンのCSSカスタムプロパティ{"\n"}2) ウィンドウコンポーネント（タイトルバー+メニューバー+ボディ+ステータスバー+ボタン）{"\n"}3) デスクトップアイコン、ツリービュー、タブコンポーネント{"\n"}4) レスポンシブ対応を含む単一HTML/CSSファイル</pre>
              <button className="btn-win" data-i18n="page.btn.copy" style={{marginTop: 12}} type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
            </div>
            <div className="status-bar">
              <div className="status-bar-field">Prompt loaded</div>
              <div className="status-bar-field">UTF-8</div>
            </div>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/retro-pixel.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Retro Pixel</span></a><div className="page-nav__divider" /><a href="/pages/risograph-print.html"><span><span className="page-nav__label">다음</span>Risograph Print</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
