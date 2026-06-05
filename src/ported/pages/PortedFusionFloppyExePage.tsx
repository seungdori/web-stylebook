import { useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang) => obj[lang];

type Crt = { id: string; name: string; phosphor: string; glow: string };
const CRTS: Crt[] = [
  { id: 'green',  name: 'GREEN',  phosphor: '#33ff66', glow: 'rgba(51,255,102,0.42)' },
  { id: 'amber',  name: 'AMBER',  phosphor: '#ffb84d', glow: 'rgba(255,184,77,0.42)' },
  { id: 'cyan',   name: 'CYAN',   phosphor: '#7cf0ff', glow: 'rgba(124,240,255,0.42)' },
];

type Line = { kind: 'prompt' | 'out' | 'note'; text: string };

const SCRIPT: Line[] = [
  { kind: 'note',   text: 'Floppy.exe v0.98  © 1998 WebStylebook' },
  { kind: 'note',   text: 'Detecting A: ... 1.44 MB / OK' },
  { kind: 'note',   text: 'C:\\WEB> _' },
  { kind: 'prompt', text: 'cd fusion\\y2k-x-terminal' },
  { kind: 'out',    text: 'now in C:\\WEB\\FUSION\\Y2K-X-TERMINAL' },
  { kind: 'prompt', text: 'echo hello, world' },
  { kind: 'out',    text: 'hello, world' },
  { kind: 'prompt', text: 'dir /b' },
  { kind: 'out',    text: 'readme.txt   floppy.exe   crt.cfg' },
  { kind: 'prompt', text: 'type readme.txt' },
  { kind: 'out',    text: 'beveled chrome on the outside.' },
  { kind: 'out',    text: 'phosphor green on the inside.' },
  { kind: 'out',    text: 'these two were never enemies.' },
  { kind: 'prompt', text: 'run --style fusion' },
  { kind: 'out',    text: 'spawning windows ...' },
  { kind: 'out',    text: 'taskbar attached. start ready.' },
  { kind: 'out',    text: 'OK' },
  { kind: 'prompt', text: '' },
];

const COPY = {
  desktopBrand: 'Web Stylebook 98',
  windowTitle: {
    terminal: { en: 'Floppy.exe — Command Prompt', ko: 'Floppy.exe — 명령 프롬프트', ja: 'Floppy.exe — コマンドプロンプト' },
    about:    { en: 'About — Floppy.exe',  ko: '정보 — Floppy.exe',  ja: '情報 — Floppy.exe' },
    specs:    { en: 'System Properties',    ko: '시스템 속성',         ja: 'システムのプロパティ' },
    palette:  { en: 'Display Properties',   ko: '화면 속성',           ja: 'ディスプレイのプロパティ' },
  },
  menu: {
    en: ['File', 'Edit', 'View', 'Help'],
    ko: ['파일', '편집', '보기', '도움말'],
    ja: ['ファイル', '編集', '表示', 'ヘルプ'],
  },
  aria: {
    desktop: { en: 'Desktop', ko: '데스크톱', ja: 'デスクトップ' },
    minimize: { en: 'Minimize', ko: '최소화', ja: '最小化' },
    maximize: { en: 'Maximize', ko: '최대화', ja: '最大化' },
    close: { en: 'Close', ko: '닫기', ja: '閉じる' },
    terminalScreen: { en: 'Terminal screen', ko: '터미널 화면', ja: 'ターミナル画面' },
    propertiesTabs: { en: 'Properties tabs', ko: '속성 탭', ja: 'プロパティタブ' },
    start: { en: 'Start', ko: '시작', ja: 'スタート' },
    runningTasks: { en: 'Running tasks', ko: '실행 중인 작업', ja: '実行中のタスク' },
  },
  dialog: {
    ok: { en: 'OK', ko: '확인', ja: 'OK' },
    cancel: { en: 'Cancel', ko: '취소', ja: 'キャンセル' },
    apply: { en: 'Apply', ko: '적용', ja: '適用' },
    general: { en: 'General', ko: '일반', ja: '全般' },
    devices: { en: 'Devices', ko: '디바이스', ja: 'デバイス' },
    performance: { en: 'Performance', ko: '성능', ja: 'パフォーマンス' },
  },
  iconHub:    { en: 'Hub',         ko: '허브',     ja: 'ハブ' },
  iconFloppy: { en: 'Floppy.exe',  ko: 'Floppy.exe', ja: 'Floppy.exe' },
  iconReadme: { en: 'readme.txt',  ko: 'readme.txt', ja: 'readme.txt' },
  iconTrash:  { en: 'Recycle Bin', ko: '휴지통',  ja: 'ごみ箱' },
  startLabel: { en: 'Start',       ko: '시작',    ja: 'スタート' },
  startMenu: {
    en: ['Programs ▸', 'Documents ▸', 'Settings ▸', 'Find ▸', '— — —', 'Run...', 'Shut Down...'],
    ko: ['프로그램 ▸', '문서 ▸',     '설정 ▸',     '찾기 ▸',  '— — —', '실행...',  '시스템 종료...'],
    ja: ['プログラム ▸', 'ドキュメント ▸', '設定 ▸',   '検索 ▸',  '— — —', 'ファイル名を指定して実行...', 'Windowsの終了...'],
  },
  taskbarItems: {
    en: ['Floppy.exe', 'About', 'Properties'],
    ko: ['Floppy.exe', '정보', '속성'],
    ja: ['Floppy.exe', '情報', 'プロパティ'],
  },
  hint: {
    en: 'click RUN to step through the boot — then change the CRT colour',
    ko: 'RUN을 눌러 부팅을 한 줄씩 진행하세요 — 그다음 CRT 색을 바꿔보세요',
    ja: 'RUNを押すと起動を一行ずつ進められます — そのあとCRTの色を変えてみてください',
  },
  about: {
    en: [
      'Floppy.exe is a fusion of two well-mannered ancestors:',
      'Windows 98 chrome — bevels, dialog windows, taskbar, Tahoma.',
      'A developer terminal — phosphor screen, prompt rows, blinking cursor.',
      '',
      'The discipline of the fusion:',
      '· The chrome is solid and printed.',
      '· The screen is alive. Only the screen.',
      '· Nothing on the desktop glows. Nothing outside the CRT scans.',
      '',
      'OK to close — your floppy will keep spinning.',
    ],
    ko: [
      'Floppy.exe는 두 조상을 하나로 합쳤습니다:',
      'Windows 98 크롬 — 베벨, 대화 상자, 작업표시줄, Tahoma.',
      '개발자 터미널 — 인광 화면, 프롬프트 행, 깜빡이는 커서.',
      '',
      '퓨전의 원칙:',
      '· 크롬은 단단하고 인쇄물처럼 가만히 있습니다.',
      '· 살아 움직이는 건 화면뿐입니다. 오직 화면만.',
      '· 데스크톱은 빛나지 않습니다. CRT 밖에는 스캔라인이 없습니다.',
      '',
      '확인을 누르세요 — 플로피는 계속 돕니다.',
    ],
    ja: [
      'Floppy.exeは行儀のよい二つの祖先の融合です:',
      'Windows 98のクローム — ベベル、ダイアログ、タスクバー、Tahoma。',
      '開発者ターミナル — リン光画面、プロンプト行、点滅するカーソル。',
      '',
      'フュージョンの規律:',
      '・クロームは硬く、印刷物のように動かない。',
      '・生きているのは画面だけ。画面だけ。',
      '・デスクトップは光らない。CRTの外にスキャンラインはない。',
      '',
      'OKで閉じる — フロッピーは回り続けます。',
    ],
  },
  spec: {
    en: [
      ['Display',     'Tahoma · JetBrains Mono'],
      ['Window',      '3D bevel (white / silver / shadow)'],
      ['Screen',      'Phosphor CRT · scanline 2 px'],
      ['Motion',      'Pressed states · no easing'],
      ['Wallpaper',   'Teal #008080'],
      ['Floppy',      '1.44 MB · always full'],
    ],
    ko: [
      ['디스플레이', 'Tahoma · JetBrains Mono'],
      ['창',         '3D 베벨 (흰색 / 은색 / 그림자)'],
      ['화면',       '인광 CRT · 스캔라인 2 px'],
      ['모션',       '눌림 상태 · 이징 없음'],
      ['배경',       'Teal #008080'],
      ['플로피',     '1.44 MB · 항상 가득'],
    ],
    ja: [
      ['ディスプレイ', 'Tahoma · JetBrains Mono'],
      ['ウィンドウ', '3Dベベル(白 / 銀 / 影)'],
      ['画面',       'リン光CRT · スキャンライン2 px'],
      ['モーション', '押下状態 · イージングなし'],
      ['壁紙',       'Teal #008080'],
      ['フロッピー', '1.44 MB · 常に満杯'],
    ],
  },
  paletteHeading: { en: 'CRT Phosphor', ko: 'CRT 인광',  ja: 'CRTのリン光' },
  paletteHint: {
    en: 'pick a phosphor — only the screen changes',
    ko: '인광을 고르세요 — 화면만 바뀝니다',
    ja: 'リン光を選んでください — 変わるのは画面だけ',
  },
  runLabel: { en: '▶ RUN next', ko: '▶ 다음 RUN', ja: '▶ 次のRUN' },
  resetLabel: { en: '↺ Reset',  ko: '↺ 초기화',  ja: '↺ リセット' },
  endNote: {
    en: '(end of script — press Reset to rewind the floppy)',
    ko: '(스크립트 끝 — Reset을 누르면 플로피를 되감습니다)',
    ja: '(スクリプト終了 — Resetを押すとフロッピーを巻き戻します)',
  },
  clock: '09:42 AM',
  diskLabel: { en: 'A: 1.44 MB',  ko: 'A: 1.44 MB',  ja: 'A: 1.44 MB' },
} as const;

const promptEn = `Design a creative single-page Win98 desktop scene in Floppy.exe fusion: the page IS a teal-wallpaper desktop with multiple beveled windows and a working terminal inside the hero window.

PARENTS:
Y2k Retro brings the chrome: beveled windows, title bars (active blue / inactive grey), menu bars, dialog text, taskbar with Start.
Terminal Core brings the inside of the hero window: phosphor CRT, prompt rows ("C:\\>" or "$ ") with monospace, blinking cursor, log output.

DISCIPLINE:
1) The chrome never glows. The CRT never goes flat.
2) Glow / scanlines exist ONLY inside the terminal screen rectangle.
3) Bevels are exactly four corners: top + left light (#fff → #dfdfdf), bottom + right dark (#808080 → #000).
4) No anti-aliased shadows. No rounded corners larger than 2 px. No modern transitions.

TOKENS:
--wallpaper #008080  --chrome #c0c0c0  --chrome-edge-light #fff  --chrome-edge-dark #808080  --titlebar-active #000080  --titlebar-text #fff
--crt-bg #060808  --crt-phosphor (green #33ff66 / amber #ffb84d / cyan #7cf0ff) — live-swappable

TYPOGRAPHY:
Chrome: Tahoma 11-12 px, weight 400-700.
Terminal: JetBrains Mono 13 px, tracking 0.

LAYOUT:
1) Desktop viewport — full-bleed teal wallpaper with 3 desktop icons stacked on the left (Hub, Floppy.exe, Recycle Bin).
2) Hero window — Floppy.exe Command Prompt — bevel-out frame, active blue title bar with caption + minimise/maximise/close buttons (visual), menu bar (File / Edit / View / Help). Inside: a bevel-IN phosphor screen with a list of lines, an active cursor square, and a RUN button to step through a 12-line script. CRT colour switcher below the screen.
3) Second window — About — bevel-out, inactive grey title bar, dialog body with bullet list and an OK button. Visually shorter, slightly offset.
4) Third window — System Properties — bevel-out, tabbed-looking dialog with a 6-row property table.
5) Taskbar — fixed at the bottom of the desktop area: Start button (bevel-out with WS flag icon and label), three running app tabs (one pressed = active), clock.

INTERACTIONS:
· RUN button — appends the next script line. Once done, show end-of-script note.
· Reset — clears the screen back to the first 3 boot lines.
· CRT colour — swaps phosphor variable (3 chips).
· Start button — toggles a small Start menu list above it.
· Window title bar — clicking sets that window active (blue title); others go grey.

MOTION:
No smooth easing. Pressed states are instant inversion of the bevel. Cursor blinks at 1 Hz. Phosphor text has a subtle CSS text-shadow at the chosen phosphor colour.

OUTPUT:
1) HTML with bevel-out and bevel-in primitives.
2) Inline state for current CRT, current script step, active window, start menu open.
3) Mobile: hero window stays full width, secondary windows stack below, taskbar sticks to the bottom of the framed desktop.`;

const promptKo = `Floppy.exe 퓨전 — 페이지 자체가 *틸 배경의 Win98 데스크톱*. 여러 베벨 윈도우가 떠 있고, 메인 윈도우 안에는 *실제로 돌아가는 터미널*이 있습니다.

부모:
Y2k Retro = 크롬 — 베벨 윈도우, 타이틀 바(액티브 블루 / 비활성 그레이), 메뉴 바, 다이얼로그, 작업표시줄, Start.
Terminal Core = 히어로 윈도우의 *내부* — 인광 CRT, 프롬프트 행("C:\\>" 또는 "$ "), 모노스페이스, 깜빡이는 커서, 로그.

규율:
1) 크롬은 빛나지 않는다. CRT는 평평해지지 않는다.
2) 글로우·스캔라인은 *터미널 화면 사각형 안에서만* 존재.
3) 베벨은 네 모서리: 상·좌 밝게(#fff→#dfdfdf), 하·우 어둡게(#808080→#000).
4) 안티앨리어스 그림자 금지, 2 px 초과 라운드 금지, 모던 트랜지션 금지.

토큰:
--wallpaper #008080  --chrome #c0c0c0  --chrome-edge-light #fff  --chrome-edge-dark #808080  --titlebar-active #000080  --titlebar-text #fff
--crt-bg #060808  --crt-phosphor (green #33ff66 / amber #ffb84d / cyan #7cf0ff) — 라이브 교체

타이포: 크롬 Tahoma 11~12 px. 터미널 JetBrains Mono 13 px.

레이아웃:
1) 데스크톱 뷰포트 — 풀 블리드 틸 배경. 왼쪽에 아이콘 3개 (허브, Floppy.exe, 휴지통).
2) 히어로 윈도우 — Floppy.exe Command Prompt — 외부 베벨, 액티브 블루 타이틀 + 캡션 + min/max/close 버튼, 메뉴 바(File/Edit/View/Help). 내부: 내부 베벨의 인광 CRT 화면 + 라인 리스트 + 깜빡이는 커서 + RUN 버튼(스크립트 한 줄씩). CRT 색 스위처.
3) 두 번째 윈도우 — About — 비활성 그레이 타이틀, 다이얼로그 본문 + OK.
4) 세 번째 윈도우 — System Properties — 6행 속성 표.
5) 작업표시줄 — Start 버튼(베벨 + WS 깃발) + 실행 중 앱 탭 + 시계.

인터랙션:
· RUN — 다음 스크립트 라인 추가. 끝나면 종료 노트.
· Reset — 초기 부팅 3줄로 되감기.
· CRT 색 — 인광 변수 교체.
· Start — 작은 메뉴 토글.
· 윈도우 타이틀 클릭 — 그 창이 액티브.

모션: 부드러운 이징 없음, 베벨 반전이 즉시 일어남. 커서 1 Hz 깜빡임. 인광 텍스트에만 text-shadow.

출력: bevel-out / bevel-in 프리미티브, 인라인 state, 모바일에서 히어로는 풀 폭 유지·서브 창 스택·작업표시줄 고정.`;

const promptJa = `Floppy.exeフュージョン — ページ自体が*ティールの壁紙のWin98デスクトップ*。複数のベベルウィンドウが浮かび、メインウィンドウの中には*実際に動くターミナル*。

親:
Y2k Retro = クローム — ベベルウィンドウ、タイトルバー(アクティブ青 / 非アクティブ灰)、メニューバー、ダイアログ、タスクバー、Start。
Terminal Core = ヒーローウィンドウの*内側* — リン光CRT、プロンプト行(「C:\\>」または「$ 」)、等幅、点滅カーソル、ログ。

規律:
1) クロームは光らない。CRTは平らにならない。
2) グロウ・スキャンラインは*ターミナル画面の長方形内だけ*に存在。
3) ベベルは四隅: 上・左を明るく(#fff→#dfdfdf)、下・右を暗く(#808080→#000)。
4) アンチエイリアスの影禁止、2 pxを超える角丸禁止、モダン・トランジション禁止。

トークン:
--wallpaper #008080  --chrome #c0c0c0  --chrome-edge-light #fff  --chrome-edge-dark #808080  --titlebar-active #000080  --titlebar-text #fff
--crt-bg #060808  --crt-phosphor (緑 #33ff66 / 琥珀 #ffb84d / シアン #7cf0ff) — ライブ切替

タイポ: クロームはTahoma 11~12 px。ターミナルはJetBrains Mono 13 px。

レイアウト:
1) デスクトップ・ビューポート — フルブリードのティール壁紙。左にアイコン3つ(ハブ、Floppy.exe、ごみ箱)。
2) ヒーローウィンドウ — Floppy.exe Command Prompt — 外ベベル、アクティブ青タイトル+キャプション+min/max/close、メニューバー(File/Edit/View/Help)。内側: 内ベベルのリン光CRT画面+行リスト+点滅カーソル+RUNボタン(スクリプトを一行ずつ)。CRT色スイッチャー。
3) 二番目のウィンドウ — About — 非アクティブ灰タイトル、ダイアログ本文+OK。
4) 三番目のウィンドウ — System Properties — 6行のプロパティ表。
5) タスクバー — Startボタン(ベベル+WSの旗)+起動中アプリのタブ+時計。

インタラクション:
· RUN — 次のスクリプト行を追加。終了したら終端ノート。
· Reset — 起動3行へ巻き戻し。
· CRT色 — リン光変数を入替。
· Start — 小メニューをトグル。
· タイトル・クリック — そのウィンドウがアクティブに。

モーション: 滑らかなイージング無し。ベベル反転は即時。カーソル1 Hz点滅。リン光テキストにのみtext-shadow。

出力: bevel-out / bevel-in プリミティブ、インラインのstate、モバイルではヒーローを全幅維持・サブ窓は縦積み・タスクバーは枠付きデスクトップ底に固定。`;

export function PortedFusionFloppyExePage({ lang }: PortedStylePageProps) {
  const [crtId, setCrtId] = useState<string>('green');
  const [step, setStep] = useState<number>(3); // first 3 lines pre-printed (boot)
  const [activeWindow, setActiveWindow] = useState<'terminal' | 'about' | 'specs'>('terminal');
  const [startOpen, setStartOpen] = useState<boolean>(false);

  const crt = CRTS.find((c) => c.id === crtId) ?? CRTS[0];
  const lng = lang as Lang;
  const visibleLines = SCRIPT.slice(0, step);
  const atEnd = step >= SCRIPT.length;

  const cssVars: CSSProperties = {
    ['--fl-phosphor' as string]: crt.phosphor,
    ['--fl-phosphor-glow' as string]: crt.glow,
  };

  const runNext = () => {
    if (atEnd) return;
    setStep((s) => Math.min(s + 1, SCRIPT.length));
  };
  const reset = () => setStep(3);

  const windowClass = (win: 'terminal' | 'about' | 'specs') =>
    `fl-window ${activeWindow === win ? 'is-active' : ''}`;

  return (
    <FusionShell
      fusionId="fusion-floppy-exe"
      lang={lang}
      prev={{ href: '/pages/fusion-clay-aurora.html', label: 'Clay × Aurora' }}
      next={{ href: '/pages/fusion-noir-metal.html', label: 'Noir Metal' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
    >
      <div className="fl-shell" style={cssVars} data-crt={crt.id}>
        <div className="fl-desktop">

          {/* Desktop icons */}
          <aside className="fl-icons" aria-label={L(COPY.aria.desktop, lng)}>
            <a className="fl-icon" href="/" title="Hub">
              <span className="fl-icon__art fl-icon__art--hub" aria-hidden="true">
                <svg viewBox="0 0 32 32" width={32} height={32}>
                  <rect x="3" y="6" width="26" height="20" fill="#c0c0c0" stroke="#000" strokeWidth="1.5" />
                  <rect x="3" y="6" width="26" height="3" fill="#000080" />
                  <rect x="6" y="12" width="20" height="2" fill="#000" />
                  <rect x="6" y="16" width="14" height="2" fill="#000" />
                  <rect x="6" y="20" width="16" height="2" fill="#000" />
                </svg>
              </span>
              <span className="fl-icon__label">{L(COPY.iconHub, lng)}</span>
            </a>
            <button type="button" className="fl-icon" onClick={() => setActiveWindow('terminal')} title="Floppy.exe">
              <span className="fl-icon__art fl-icon__art--floppy" aria-hidden="true">
                <svg viewBox="0 0 32 32" width={32} height={32}>
                  <rect x="3" y="3" width="26" height="26" fill="#000080" stroke="#000" strokeWidth="1.5" />
                  <rect x="6" y="3" width="20" height="11" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
                  <rect x="8" y="5" width="6" height="7" fill="#000080" />
                  <rect x="8" y="18" width="16" height="9" fill="#dfdfdf" stroke="#000" strokeWidth="1" />
                </svg>
              </span>
              <span className="fl-icon__label">{L(COPY.iconFloppy, lng)}</span>
            </button>
            <button type="button" className="fl-icon" onClick={() => setActiveWindow('about')} title="readme.txt">
              <span className="fl-icon__art fl-icon__art--readme" aria-hidden="true">
                <svg viewBox="0 0 32 32" width={32} height={32}>
                  <path d="M7 3 H21 L25 7 V29 H7 Z" fill="#fff" stroke="#000" strokeWidth="1.5" />
                  <path d="M21 3 V7 H25" fill="none" stroke="#000" strokeWidth="1.5" />
                  <line x1="10" y1="13" x2="22" y2="13" stroke="#000" strokeWidth="1" />
                  <line x1="10" y1="17" x2="22" y2="17" stroke="#000" strokeWidth="1" />
                  <line x1="10" y1="21" x2="18" y2="21" stroke="#000" strokeWidth="1" />
                </svg>
              </span>
              <span className="fl-icon__label">{L(COPY.iconReadme, lng)}</span>
            </button>
            <span className="fl-icon" aria-disabled="true">
              <span className="fl-icon__art" aria-hidden="true">
                <svg viewBox="0 0 32 32" width={32} height={32}>
                  <rect x="6" y="9" width="20" height="20" fill="#c0c0c0" stroke="#000" strokeWidth="1.5" />
                  <rect x="4" y="6" width="24" height="4" fill="#c0c0c0" stroke="#000" strokeWidth="1.5" />
                  <line x1="12" y1="14" x2="12" y2="26" stroke="#000" strokeWidth="1" />
                  <line x1="16" y1="14" x2="16" y2="26" stroke="#000" strokeWidth="1" />
                  <line x1="20" y1="14" x2="20" y2="26" stroke="#000" strokeWidth="1" />
                </svg>
              </span>
              <span className="fl-icon__label">{L(COPY.iconTrash, lng)}</span>
            </span>
          </aside>

          {/* HERO Terminal window */}
          <section className={windowClass('terminal')} onMouseDown={() => setActiveWindow('terminal')} aria-label={L(COPY.windowTitle.terminal, lng)}>
            <header className="fl-titlebar">
              <span className="fl-titlebar__icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" width={14} height={14}>
                  <rect x="1" y="1" width="14" height="14" fill="#000" stroke="#fff" strokeWidth="0.5" />
                  <text x="3" y="11" fill={crt.phosphor} fontFamily="monospace" fontSize="9">{'>_'}</text>
                </svg>
              </span>
              <span className="fl-titlebar__caption">{L(COPY.windowTitle.terminal, lng)}</span>
              <span className="fl-titlebar__buttons">
                <button type="button" className="fl-tbtn" aria-label={L(COPY.aria.minimize, lng)}>_</button>
                <button type="button" className="fl-tbtn" aria-label={L(COPY.aria.maximize, lng)}>□</button>
                <button type="button" className="fl-tbtn" aria-label={L(COPY.aria.close, lng)}>×</button>
              </span>
            </header>
            <nav className="fl-menubar">
              {COPY.menu[lng].map((m) => (
                <button type="button" key={m} className="fl-mbtn"><u>{m[0]}</u>{m.slice(1)}</button>
              ))}
            </nav>
            <div className="fl-screen-wrap">
              <div className="fl-screen" aria-label={L(COPY.aria.terminalScreen, lng)} data-end={atEnd ? 'true' : 'false'}>
                <ol className="fl-lines" aria-live="polite">
                  {visibleLines.map((line, i) => (
                    <li key={i} className={`fl-line fl-line--${line.kind}`}>
                      {line.kind === 'prompt' ? <span className="fl-line__prefix">C:\WEB&gt;</span> : null}
                      <span className="fl-line__text">{line.text}</span>
                    </li>
                  ))}
                  {!atEnd ? (
                    <li className="fl-line fl-line--cursor">
                      <span className="fl-line__prefix">C:\WEB&gt;</span>
                      <span className="fl-cursor" aria-hidden="true">▍</span>
                    </li>
                  ) : (
                    <li className="fl-line fl-line--note">
                      <span className="fl-line__text">{L(COPY.endNote, lng)}</span>
                    </li>
                  )}
                </ol>
                <span className="fl-scanlines" aria-hidden="true" />
              </div>
              <div className="fl-controls">
                <button type="button" className="fl-runbtn fl-bevel-out" onClick={runNext} disabled={atEnd}>
                  {L(COPY.runLabel, lng)}
                </button>
                <button type="button" className="fl-runbtn fl-runbtn--alt fl-bevel-out" onClick={reset}>
                  {L(COPY.resetLabel, lng)}
                </button>
                <span className="fl-controls__hint">{L(COPY.hint, lng)}</span>
              </div>
              <div className="fl-crtbar" role="radiogroup" aria-label={L(COPY.paletteHeading, lng)}>
                <span className="fl-crtbar__label">{L(COPY.paletteHeading, lng)}:</span>
                {CRTS.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    role="radio"
                    aria-checked={c.id === crtId}
                    className={`fl-crt-chip ${c.id === crtId ? 'is-on fl-bevel-in' : 'fl-bevel-out'}`}
                    onClick={() => setCrtId(c.id)}
                  >
                    <span className="fl-crt-chip__dot" style={{ background: c.phosphor, boxShadow: `0 0 6px ${c.glow}` }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* About window */}
          <section className={windowClass('about')} onMouseDown={() => setActiveWindow('about')} aria-label={L(COPY.windowTitle.about, lng)}>
            <header className="fl-titlebar">
              <span className="fl-titlebar__icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" width={14} height={14}>
                  <circle cx="8" cy="8" r="7" fill="#fff" stroke="#000" strokeWidth="1" />
                  <text x="6" y="12" fill="#000080" fontFamily="serif" fontWeight="700" fontSize="11">i</text>
                </svg>
              </span>
              <span className="fl-titlebar__caption">{L(COPY.windowTitle.about, lng)}</span>
              <span className="fl-titlebar__buttons">
                <button type="button" className="fl-tbtn" aria-label={L(COPY.aria.close, lng)}>×</button>
              </span>
            </header>
            <div className="fl-dialog">
              <ul className="fl-about__lines">
                {COPY.about[lng].map((l, i) => (
                  <li key={i} className={l === '' ? 'is-spacer' : ''}>{l}</li>
                ))}
              </ul>
              <div className="fl-dialog__buttons">
                <button type="button" className="fl-dbtn fl-bevel-out is-default">{L(COPY.dialog.ok, lng)}</button>
                <button type="button" className="fl-dbtn fl-bevel-out">{L(COPY.dialog.cancel, lng)}</button>
              </div>
            </div>
          </section>

          {/* Specs window */}
          <section className={windowClass('specs')} onMouseDown={() => setActiveWindow('specs')} aria-label={L(COPY.windowTitle.specs, lng)}>
            <header className="fl-titlebar">
              <span className="fl-titlebar__icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" width={14} height={14}>
                  <rect x="1" y="2" width="14" height="10" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
                  <rect x="3" y="4" width="10" height="6" fill="#000080" />
                  <rect x="5" y="12" width="6" height="2" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
                </svg>
              </span>
              <span className="fl-titlebar__caption">{L(COPY.windowTitle.specs, lng)}</span>
              <span className="fl-titlebar__buttons">
                <button type="button" className="fl-tbtn" aria-label={L(COPY.aria.close, lng)}>×</button>
              </span>
            </header>
            <div className="fl-dialog">
              <div className="fl-tabs" role="tablist" aria-label={L(COPY.aria.propertiesTabs, lng)}>
                <span className="fl-tab is-active" role="tab" aria-selected="true">{L(COPY.dialog.general, lng)}</span>
                <span className="fl-tab" role="tab">{L(COPY.dialog.devices, lng)}</span>
                <span className="fl-tab" role="tab">{L(COPY.dialog.performance, lng)}</span>
              </div>
              <div className="fl-tabpanel fl-bevel-in">
                <dl className="fl-spec">
                  {COPY.spec[lng].map(([k, v]) => (
                    <div className="fl-spec__row" key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </div>
              <div className="fl-dialog__buttons">
                <button type="button" className="fl-dbtn fl-bevel-out is-default">{L(COPY.dialog.ok, lng)}</button>
                <button type="button" className="fl-dbtn fl-bevel-out">{L(COPY.dialog.cancel, lng)}</button>
                <button type="button" className="fl-dbtn fl-bevel-out">{L(COPY.dialog.apply, lng)}</button>
              </div>
            </div>
          </section>

          {/* Taskbar */}
          <footer className="fl-taskbar">
            <button
              type="button"
              className={`fl-startbtn ${startOpen ? 'is-open fl-bevel-in' : 'fl-bevel-out'}`}
              onClick={() => setStartOpen((v) => !v)}
            >
              <span className="fl-startbtn__flag" aria-hidden="true">
                <svg viewBox="0 0 16 16" width={14} height={14}>
                  <rect x="1" y="1" width="6" height="6" fill="#ff3b30" />
                  <rect x="8" y="1" width="7" height="6" fill="#33c759" />
                  <rect x="1" y="8" width="6" height="7" fill="#00b8ff" />
                  <rect x="8" y="8" width="7" height="7" fill="#ffd60a" />
                </svg>
              </span>
              <span><b>{L(COPY.startLabel, lng)}</b></span>
            </button>
            {startOpen ? (
              <ul className="fl-startmenu fl-bevel-out" role="menu" aria-label={L(COPY.aria.start, lng)}>
                {COPY.startMenu[lng].map((entry, i) => (
                  <li key={i} className={entry.startsWith('—') ? 'is-sep' : ''} role="menuitem">{entry}</li>
                ))}
              </ul>
            ) : null}
            <span className="fl-taskbar__divider" />
            <ul className="fl-tasks" aria-label={L(COPY.aria.runningTasks, lng)}>
              {COPY.taskbarItems[lng].map((label, i) => {
                const win: 'terminal' | 'about' | 'specs' = i === 0 ? 'terminal' : i === 1 ? 'about' : 'specs';
                const isActive = activeWindow === win;
                return (
                  <li key={label}>
                    <button
                      type="button"
                      className={`fl-task ${isActive ? 'is-active fl-bevel-in' : 'fl-bevel-out'}`}
                      onClick={() => setActiveWindow(win)}
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
            <span className="fl-taskbar__tray fl-bevel-in">
              <span className="fl-tray__disk" aria-hidden="true">⌬</span>
              <span className="fl-tray__clock">{COPY.clock}</span>
            </span>
          </footer>
        </div>

        {/* Caption strip beneath the desktop frame */}
        <div className="fl-caption">
          <span><b>{COPY.desktopBrand}</b></span>
          <span>·</span>
          <span>Y2k Retro × Terminal Core</span>
          <span>·</span>
          <span>{L(COPY.diskLabel, lng)}</span>
        </div>
      </div>
    </FusionShell>
  );
}
