import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedY2kRetroPage.css';

// A web app set in Windows 98 windows on a teal desktop. FusionShell is the shared style-page
// chrome (back link, nav, prompt, prev/next); its controls are drawn as bevelled Windows 98
// controls in PortedY2kRetroPage.css.

const PROMPTS: Record<Lang, string> = {
  en: `Design a landing page in Windows 98 style — a clean retro UI inspired by Windows 95/98 with beveled chrome surfaces and teal desktop background.

COLOR TOKENS:
--bg: #c0c0c0
--border-out-light: #ffffff
--border-out-dark: #000000
--border-in-light: #dfdfdf
--border-in-dark: #808080
--title-bg: #000080
--title-gradient-end: #1084d0
--window-body: #ffffff
--highlight: #000080
--highlight-text: #ffffff
--desktop-teal: #008080
No other colors.

TYPOGRAPHY:
Body & Headings: "Tahoma", "MS Sans Serif", Arial, sans-serif.
Body size: 13px. Headings: 1.6rem bold, color: #000080.
Menu/status bar: 12px. Tree view: 12px.
No decorative fonts. No text-shadow.

WINDOW COMPONENT:
Frame: background #c0c0c0, padding: 3px, 4-side beveled borders.
Title bar: linear-gradient(90deg, #000080, #1084d0), 12px bold white text, with 16x14px minimize/maximize/close buttons.
Menu bar: horizontal buttons with hover bevel, transparent border by default.
Window body: background #fff, inset beveled borders, padding: 16px.
Status bar: 1-3 fields at bottom, inset borders, 11px font.
Buttons: background #c0c0c0, padding: 6px 20px, beveled borders that invert on :active, dotted outline on :focus-visible.

BEVEL SYSTEM (critical):
Outset (raised): border-top/left 2px solid #ffffff, border-bottom/right 2px solid #000000.
Inset (sunken): border-top/left 2px solid #000000, border-bottom/right 2px solid #ffffff.
Inner depth: box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf.
Window drop shadow: 4px 4px 0 rgba(0,0,0,0.35).

ADDITIONAL COMPONENTS:
Desktop icons: 32px SVG + 11px label, background: #000080 + white text on hover/focus.
Tree view: nested ul with folder/file icons via ::before pseudo-elements, inset container.
Tab bar: beveled tabs, active tab merges with body via matching border-bottom.
Horizontal rule: 1px solid #808080 top + 1px solid #dfdfdf bottom.

LAYOUT:
Page container: width: min(860px, 94vw), margin: 0 auto.
Desktop background: solid #008080.
Windows stack vertically with margin-bottom: 30px.

RESPONSIVE:
<=600px: heading 1.2rem, icons smaller gap, button group stacks vertically.

FORBIDDEN:
- border-radius on any element
- Modern gradients, glassmorphism, blur effects
- Decorative fonts (Impact, Comic Sans, etc.)
- CSS transitions or ease curves
- Soft box-shadows (only hard-edge offsets)
- text-shadow, marquee, or animated text

OUTPUT:
1) CSS custom properties for all bevel and color tokens
2) Window component (title bar + menu bar + body + status bar + buttons)
3) Desktop icons, tree view, tab components
4) Single-file HTML/CSS with responsive support`,
  ko: `Windows 98 스타일의 랜딩 페이지를 디자인해줘 — Windows 95/98에서 영감을 받은 깔끔한 레트로 UI, 베벨 크롬 표면과 틸 데스크톱 배경.

색상 토큰:
--bg: #c0c0c0
--border-out-light: #ffffff
--border-out-dark: #000000
--border-in-light: #dfdfdf
--border-in-dark: #808080
--title-bg: #000080
--title-gradient-end: #1084d0
--window-body: #ffffff
--highlight: #000080
--highlight-text: #ffffff
--desktop-teal: #008080
다른 색상 사용 금지.

타이포그래피:
본문 및 제목: "Tahoma", "MS Sans Serif", Arial, sans-serif.
본문 크기: 13px. 제목: 1.6rem bold, color: #000080.
메뉴/상태바: 12px. 트리 뷰: 12px.
장식적 폰트 금지. text-shadow 금지.

윈도우 컴포넌트:
프레임: background #c0c0c0, padding: 3px, 4면 베벨 보더.
타이틀바: linear-gradient(90deg, #000080, #1084d0), 12px bold 흰색 텍스트, 16x14px 최소화/최대화/닫기 버튼.
메뉴바: 호버 시 베벨이 나타나는 수평 버튼, 기본 상태에서 투명 보더.
윈도우 바디: background #fff, 인셋 베벨 보더, padding: 16px.
상태바: 하단 1-3개 필드, 인셋 보더, 11px 폰트.
버튼: background #c0c0c0, padding: 6px 20px, :active 시 반전되는 베벨 보더, :focus-visible에 점선 아웃라인.

베벨 시스템 (핵심):
Outset(양각): border-top/left 2px solid #ffffff, border-bottom/right 2px solid #000000.
Inset(음각): border-top/left 2px solid #000000, border-bottom/right 2px solid #ffffff.
내부 깊이: box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf.
윈도우 드롭 섀도: 4px 4px 0 rgba(0,0,0,0.35).

추가 컴포넌트:
데스크톱 아이콘: 32px SVG + 11px 라벨, hover/focus 시 배경 #000080 + 흰색 텍스트.
트리 뷰: ::before 의사 요소로 폴더/파일 아이콘이 있는 중첩 ul, 인셋 컨테이너.
탭바: 베벨 탭, 활성 탭은 border-bottom 일치로 바디와 병합.
수평선: 상단 1px solid #808080 + 하단 1px solid #dfdfdf.

레이아웃:
페이지 컨테이너: width: min(860px, 94vw), margin: 0 auto.
데스크톱 배경: 단색 #008080.
윈도우는 수직으로 쌓이며 margin-bottom: 30px.

반응형:
<=600px: 제목 1.2rem, 아이콘 간격 축소, 버튼 그룹 수직 정렬.

금지사항:
- 어떤 요소에도 border-radius
- 모던 그라데이션, 글래스모피즘, 블러 효과
- 장식적 폰트 (Impact, Comic Sans 등)
- CSS transition이나 ease 곡선
- 소프트 box-shadow (하드 엣지 오프셋만 허용)
- text-shadow, 마퀴, 애니메이션 텍스트

출력:
1) 모든 베벨과 색상 토큰의 CSS 커스텀 속성
2) 윈도우 컴포넌트 (타이틀바 + 메뉴바 + 바디 + 상태바 + 버튼)
3) 데스크톱 아이콘, 트리 뷰, 탭 컴포넌트
4) 반응형 대응이 포함된 단일 HTML/CSS 파일`,
  ja: `Windows 98スタイルのランディングページをデザインしてください — Windows 95/98にインスパイアされたクリーンなレトロUI、ベベルクロム表面とティールデスクトップ背景。

カラートークン:
--bg: #c0c0c0
--border-out-light: #ffffff
--border-out-dark: #000000
--border-in-light: #dfdfdf
--border-in-dark: #808080
--title-bg: #000080
--title-gradient-end: #1084d0
--window-body: #ffffff
--highlight: #000080
--highlight-text: #ffffff
--desktop-teal: #008080
他の色は使用禁止。

タイポグラフィ:
本文・見出し: "Tahoma", "MS Sans Serif", Arial, sans-serif。
本文サイズ: 13px。見出し: 1.6rem bold, color: #000080。
メニュー/ステータスバー: 12px。ツリービュー: 12px。
装飾フォント禁止。text-shadow禁止。

ウィンドウコンポーネント:
フレーム: background #c0c0c0, padding: 3px, 4面ベベルボーダー。
タイトルバー: linear-gradient(90deg, #000080, #1084d0), 12px bold白テキスト、16x14px最小化/最大化/閉じるボタン。
メニューバー: ホバーでベベルが表示される水平ボタン、デフォルトは透明ボーダー。
ウィンドウボディ: background #fff, インセットベベルボーダー, padding: 16px。
ステータスバー: 下部1-3フィールド、インセットボーダー、11pxフォント。
ボタン: background #c0c0c0, padding: 6px 20px, :activeで反転するベベルボーダー、:focus-visibleで点線アウトライン。

ベベルシステム（重要）:
Outset（凸）: border-top/left 2px solid #ffffff, border-bottom/right 2px solid #000000。
Inset（凹）: border-top/left 2px solid #000000, border-bottom/right 2px solid #ffffff。
内部深度: box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf。
ウィンドウドロップシャドウ: 4px 4px 0 rgba(0,0,0,0.35)。

追加コンポーネント:
デスクトップアイコン: 32px SVG + 11pxラベル、hover/focus時背景#000080 + 白テキスト。
ツリービュー: ::before疑似要素でフォルダ/ファイルアイコン付きネストul、インセットコンテナ。
タブバー: ベベルタブ、アクティブタブはborder-bottom一致でボディと結合。
水平線: 上1px solid #808080 + 下1px solid #dfdfdf。

レイアウト:
ページコンテナ: width: min(860px, 94vw), margin: 0 auto。
デスクトップ背景: 単色#008080。
ウィンドウは垂直に積み重ね、margin-bottom: 30px。

レスポンシブ:
<=600px: 見出し1.2rem、アイコン間隔縮小、ボタングループ縦並び。

禁止事項:
- いかなる要素にもborder-radius
- モダンなグラデーション、グラスモーフィズム、ブラー効果
- 装飾フォント（Impact、Comic Sansなど）
- CSSトランジションやease曲線
- ソフトbox-shadow（ハードエッジオフセットのみ）
- text-shadow、マーキー、アニメーションテキスト

出力:
1) すべてのベベルとカラートークンのCSSカスタムプロパティ
2) ウィンドウコンポーネント（タイトルバー+メニューバー+ボディ+ステータスバー+ボタン）
3) デスクトップアイコン、ツリービュー、タブコンポーネント
4) レスポンシブ対応を含む単一HTML/CSSファイル`,
};

export function PortedY2kRetroPage({ lang }: PortedStylePageProps) {
  return (
    <FusionShell
      fusionId="y2k-retro"
      lang={lang}
      prev={{ href: '/pages/retro-pixel.html', label: 'Retro Pixel' }}
      next={{ href: '/pages/risograph-print.html', label: 'Risograph Print' }}
      prompts={PROMPTS}
    >
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
          <p data-lang="ko" hidden>클래식 Windows 95/98 데스크톱에서 영감을 받은 깔끔한 레트로 UI입니다. 개발자 도구, 문서 사이트, 화려함보다 짜임새를 앞세우는 추억 어린 랜딩 페이지에 잘 맞습니다.</p>
          <p data-lang="ja" hidden>クラシックなWindows 95/98デスクトップから着想したクリーンなレトロUIです。開発ツールやドキュメントサイト、そして派手さより骨組みを大事にしたい懐かしのランディングページにぴったりです。</p>
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
                <h2 data-lang="ko" hidden>테마 스킨이 아니라 데스크톱 그 자체</h2>
                <h2 data-lang="ja" hidden>テーマスキンではなく、デスクトップそのもの</h2>
                <p data-lang="en">Use the window chrome as the layout system: title bars name each task, status bars carry state, and every button has a mechanical pressed state.</p>
                <p data-lang="ko" hidden>윈도우 크롬 자체를 레이아웃 시스템으로 씁니다. 타이틀바에 작업 이름을 붙이고, 상태바에 상태를 표시하고, 모든 버튼이 기계식으로 눌립니다.</p>
                <p data-lang="ja" hidden>ウィンドウクローム自体をレイアウトシステムとして使います。タイトルバーが作業名を示し、ステータスバーが状態を伝え、ボタンはどれも押すと機械式のように沈み込みます。</p>
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
                <strong data-lang="ko" hidden>작은 컨트롤, 실제 라벨, 여백 큰 카드 금지</strong>
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
              <p data-lang="ko" hidden>모든 면이 실제 애플리케이션 창처럼 동작할 때 이 스타일이 가장 잘 맞습니다.</p>
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
    </FusionShell>
  );
}
