import { useRef, useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

type CyberPalette = {
  id: string;
  name: string;
  bg: string;
  text: string;
  neonY: string;     // primary (warnings, CTA)
  neonYRgb: string;
  neonC: string;     // secondary (data, grid)
  neonCRgb: string;
  neonP: string;     // tertiary (corruption, alerts)
  neonPRgb: string;
};

const PALETTES: CyberPalette[] = [
  { id: 'overdrive', name: 'OVERDRIVE', bg: '#09090b', text: '#e2e8f0', neonY: '#fde047', neonYRgb: '253, 224, 71',  neonC: '#22d3ee', neonCRgb: '34, 211, 238', neonP: '#d946ef', neonPRgb: '217, 70, 239' },
  { id: 'matrix',    name: 'MATRIX',    bg: '#020806', text: '#ccffd9', neonY: '#a3ff5c', neonYRgb: '163, 255, 92',  neonC: '#22ff88', neonCRgb: '34, 255, 136', neonP: '#5cffbf', neonPRgb: '92, 255, 191' },
  { id: 'blade',     name: 'BLADE',     bg: '#0a0608', text: '#fce4cb', neonY: '#ffb547', neonYRgb: '255, 181, 71',  neonC: '#ff6a2c', neonCRgb: '255, 106, 44', neonP: '#ff2b66', neonPRgb: '255, 43, 102' },
  { id: 'vapor',     name: 'VAPOR',     bg: '#0a0716', text: '#ffe1f5', neonY: '#ff5cf0', neonYRgb: '255, 92, 240',  neonC: '#5ad7ff', neonCRgb: '90, 215, 255', neonP: '#a67bff', neonPRgb: '166, 123, 255' },
  { id: 'ghost',     name: 'GHOST',     bg: '#06070a', text: '#e7ecf2', neonY: '#ffffff', neonYRgb: '255, 255, 255', neonC: '#9aa3b2', neonCRgb: '154, 163, 178', neonP: '#ff2e4d', neonPRgb: '255, 46, 77' },
  { id: 'reactor',   name: 'REACTOR',   bg: '#070a06', text: '#e3ffe9', neonY: '#d4ff00', neonYRgb: '212, 255, 0',   neonC: '#00ffd9', neonCRgb: '0, 255, 217',  neonP: '#ff3d3d', neonPRgb: '255, 61, 61' },
];

export function PortedCyberpunkGlitchPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  const [activeId, setActiveId] = useState('overdrive');
  const palette = PALETTES.find((p) => p.id === activeId) ?? PALETTES[0];

  const styleVars = {
    ['--bg' as string]: palette.bg,
    ['--text' as string]: palette.text,
    ['--neon-y' as string]: palette.neonY,
    ['--neon-y-rgb' as string]: palette.neonYRgb,
    ['--neon-c' as string]: palette.neonC,
    ['--neon-c-rgb' as string]: palette.neonCRgb,
    ['--neon-p' as string]: palette.neonP,
    ['--neon-p-rgb' as string]: palette.neonPRgb,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className="ported-style-page ported-style-page--cyberpunk-glitch"
      style={styleVars}
      data-palette={palette.id}
    >
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
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
        <div className="wrap cyber-demo" style={{position: 'relative'}}>
          {/* Binary data background decoration */}
          <div className="binary-bg" aria-hidden="true">01001000 01000001 01000011 01001011 01000101 01000100 00100000 01010011 01011001 01010011 01010100 01000101 01001101 00100000 01000010 01010010 01000101 01000001 01000011 01001000 00100000 01000100 01000101 01010100 01000101 01000011 01010100 01000101 01000100 00100000 01000110 01001001 01010010 01000101 01010111 01000001 01001100 01001100 00100000 01000010 01011001 01010000 01000001 01010011 01010011 01000101 01000100 00100000 01000101 01001110 01000011 01010010 01011001 01010000 01010100 01001001 01001111 01001110 00100000 01000110 01000001 01001001 01001100 01000101 01000100 00100000 01001101 01000101 01001101 01001111 01010010 01011001 00100000 01000100 01010101 01001101 01010000 00100000 01001001 01001110 00100000 01010000 01010010 01001111 01000111 01010010 01000101 01010011 01010011</div>

          {/* ====== PALETTE SWITCHER ====== */}
          <div className="cy-palette" role="region" aria-label="Color palette">
            <div className="cy-palette__row">
              <span className="cy-palette__label">
                <span className="breach-blink" aria-hidden>█</span>
                <span data-lang="en">PALETTE_OVERRIDE //</span>
                <span data-lang="ko" hidden>팔레트_변경 //</span>
                <span data-lang="ja" hidden>パレット_変更 //</span>
              </span>
              <div className="cy-palette__chips" role="radiogroup" aria-label="Cyberpunk palette">
                {PALETTES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={p.id === activeId}
                    className={`cy-palette__chip${p.id === activeId ? ' is-active' : ''}`}
                    onClick={() => setActiveId(p.id)}
                    style={{
                      ['--chip-y' as string]: p.neonY,
                      ['--chip-c' as string]: p.neonC,
                      ['--chip-p' as string]: p.neonP,
                      ['--chip-bg' as string]: p.bg,
                    } as CSSProperties}
                  >
                    <span className="cy-palette__swatches" aria-hidden="true">
                      <span className="cy-palette__sw cy-palette__sw--y" />
                      <span className="cy-palette__sw cy-palette__sw--c" />
                      <span className="cy-palette__sw cy-palette__sw--p" />
                    </span>
                    <span className="cy-palette__name">{p.name}</span>
                  </button>
                ))}
              </div>
              <span className="cy-palette__hex" aria-hidden="true">{palette.neonY.toUpperCase()} · {palette.neonC.toUpperCase()} · {palette.neonP.toUpperCase()}</span>
            </div>
          </div>

          <header>
            <span>SYS.ADMIN // DESIGN_SAMPLE</span>
            <a href="/">[ BACK TO HUB ]</a>
          </header>
          {/* ====== SYSTEM BREACH WARNING ====== */}
          <div className="breach-warning">
            <p className="breach-title"><span className="breach-blink">&gt;&gt;</span> SYSTEM BREACH DETECTED <span className="breach-blink">&lt;&lt;</span></p>
            <p style={{color: 'var(--neon-y)', margin: '6px 0 0 0', fontSize: '0.8rem', opacity: '0.7'}} data-lang="en">WARNING: Unauthorized access detected. Firewall bypassed. Data integrity compromised.</p>
            <p style={{color: 'var(--neon-y)', margin: '6px 0 0 0', fontSize: '0.8rem', opacity: '0.7'}} data-lang="ko" hidden>WARNING: 비인가 접근 감지. 방화벽 우회됨. 데이터 무결성 손상.</p>
            <p style={{color: 'var(--neon-y)', margin: '6px 0 0 0', fontSize: '0.8rem', opacity: '0.7'}} data-lang="ja" hidden>WARNING: 不正アクセス検出。ファイアウォール迂回済。データ整合性損傷。</p>
          </div>
          {/* ====== GLITCH TITLE ====== */}
          <h1 className="glitch-text" data-text="System Over_ride">System<br />Over_ride</h1>
          <p style={{margin: '30px 0', fontSize: '1.2rem', maxWidth: 600}} data-lang="en">
            Cyberpunk aesthetics. Raw glitch animations, neon color contrasts, and a terminal-based structure create a corrupted, dystopian data interface.
          </p>
          <p style={{margin: '30px 0', fontSize: '1.2rem', maxWidth: 600}} data-lang="ko" hidden>
            사이버펑크 미학. 거친 글리치 애니메이션과 네온 색 대비, 터미널 구조로 손상된 디스토피아 데이터 인터페이스를 만듭니다.
          </p>
          <p style={{margin: '30px 0', fontSize: '1.2rem', maxWidth: 600}} data-lang="ja" hidden>
            サイバーパンク美学。荒々しいグリッチ、ネオンの色対比、ターミナル調の構造で、崩壊したディストピア風のデータインターフェースをつくります。
          </p>
          {/* ====== DECRYPTION PROGRESS ====== */}
          <div className="hud-panel hud-panel--magenta" style={{margin: '30px 0'}}>
            <p className="hud-label hud-label--magenta"><span className="breach-blink" style={{color: 'var(--neon-p)'}}>█</span> DECRYPTION_STATUS</p>
            <div style={{marginBottom: 10}}>
              <span style={{fontSize: '0.7rem', color: 'var(--neon-c)'}}>SECTOR_A [FIREWALL]</span>
              <div className="decrypt-bar">
                <div className="decrypt-fill" style={{width: '87%'}} />
                <span className="decrypt-label scramble-text">DECRYPTING... 87%</span>
              </div>
            </div>
            <div style={{marginBottom: 10}}>
              <span style={{fontSize: '0.7rem', color: 'var(--neon-c)'}}>SECTOR_B [MAINFRAME]</span>
              <div className="decrypt-bar">
                <div className="decrypt-fill" style={{width: '42%', background: 'linear-gradient(90deg, var(--neon-y), var(--neon-p))'}} />
                <span className="decrypt-label scramble-text">DECRYPTING... 42%</span>
              </div>
            </div>
            <div>
              <span style={{fontSize: '0.7rem', color: 'var(--neon-p)'}}>SECTOR_C [CORE_DUMP]</span>
              <div className="decrypt-bar" style={{borderColor: 'rgba(217, 70, 239, 0.2)'}}>
                <div className="decrypt-fill" style={{width: '100%', background: 'var(--neon-p)'}} />
                <span className="decrypt-label" style={{color: 'var(--bg)'}}>█ BREACH COMPLETE █</span>
              </div>
            </div>
          </div>
          <button className="btn" style={{marginBottom: 10}}>Execute Action</button>
          {/* ====== CORRUPTED DATA TABLE ====== */}
          <div className="ascii-border" aria-hidden="true">┌─────────────────────── CORRUPTED_DATA_STREAM ───────────────────────┐</div>
          <div className="hud-panel flicker" style={{margin: '0 0 4px 0'}}>
            <p className="hud-label hud-label--cyan"><span style={{color: 'var(--neon-c)'}}>◆</span> DESIGN_SPECS // DATA_TABLE</p>
            {/* EN table */}
            <table className="corrupt-table" data-lang="en">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Typography</td>
                  <td>Syncopate 700 / Share Tech Mono</td>
                  <td className="neon-glow-c">INTACT</td>
                </tr>
                <tr>
                  <td className="cell-glitch">Color_Mode</td>
                  <td className="cell-glitch">NE0N_OVERDR!VE</td>
                  <td className="cell-glitch">C0RRUPT3D</td>
                </tr>
                <tr>
                  <td>Border Radius</td>
                  <td>0px (HARD EDGES ONLY)</td>
                  <td className="neon-glow-c">INTACT</td>
                </tr>
                <tr>
                  <td>Animation</td>
                  <td className="cell-corrupt">███ ERR_KEYFRAME ███</td>
                  <td className="neon-glow-p">UNSTABLE</td>
                </tr>
                <tr>
                  <td>Grid System</td>
                  <td>30px cyan overlay mesh</td>
                  <td className="neon-glow-c">INTACT</td>
                </tr>
                <tr>
                  <td className="cell-glitch">Encryption</td>
                  <td><span className="cell-redacted">CLASSIFIED_DATA</span></td>
                  <td className="cell-glitch">BR34CH3D</td>
                </tr>
              </tbody>
            </table>
            {/* KO table */}
            <table className="corrupt-table" data-lang="ko" hidden>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>타이포그래피</td>
                  <td>Syncopate 700 / Share Tech Mono</td>
                  <td className="neon-glow-c">INTACT</td>
                </tr>
                <tr>
                  <td className="cell-glitch">컬러_모드</td>
                  <td className="cell-glitch">NE0N_OVERDR!VE</td>
                  <td className="cell-glitch">C0RRUPT3D</td>
                </tr>
                <tr>
                  <td>모서리 반경</td>
                  <td>0px (직각 모서리만)</td>
                  <td className="neon-glow-c">INTACT</td>
                </tr>
                <tr>
                  <td>애니메이션</td>
                  <td className="cell-corrupt">███ ERR_KEYFRAME ███</td>
                  <td className="neon-glow-p">UNSTABLE</td>
                </tr>
                <tr>
                  <td>그리드 시스템</td>
                  <td>30px 시안 오버레이 메시</td>
                  <td className="neon-glow-c">INTACT</td>
                </tr>
                <tr>
                  <td className="cell-glitch">암호화</td>
                  <td><span className="cell-redacted">CLASSIFIED_DATA</span></td>
                  <td className="cell-glitch">BR34CH3D</td>
                </tr>
              </tbody>
            </table>
            {/* JA table */}
            <table className="corrupt-table" data-lang="ja" hidden>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>タイポグラフィ</td>
                  <td>Syncopate 700 / Share Tech Mono</td>
                  <td className="neon-glow-c">INTACT</td>
                </tr>
                <tr>
                  <td className="cell-glitch">カラー_モード</td>
                  <td className="cell-glitch">NE0N_OVERDR!VE</td>
                  <td className="cell-glitch">C0RRUPT3D</td>
                </tr>
                <tr>
                  <td>ボーダー半径</td>
                  <td>0px (ハードエッジのみ)</td>
                  <td className="neon-glow-c">INTACT</td>
                </tr>
                <tr>
                  <td>アニメーション</td>
                  <td className="cell-corrupt">███ ERR_KEYFRAME ███</td>
                  <td className="neon-glow-p">UNSTABLE</td>
                </tr>
                <tr>
                  <td>グリッドシステム</td>
                  <td>30px シアンオーバーレイメッシュ</td>
                  <td className="neon-glow-c">INTACT</td>
                </tr>
                <tr>
                  <td className="cell-glitch">暗号化</td>
                  <td><span className="cell-redacted">CLASSIFIED_DATA</span></td>
                  <td className="cell-glitch">BR34CH3D</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="ascii-border" aria-hidden="true">└────────────────────────────────────────────────────────────────────────┘</div>
          {/* Hex dump decoration */}
          <div className="hex-stream" aria-hidden="true">4F 56 45 52 52 49 44 45 20 53 59 53 54 45 4D 20 42 52 45 41 43 48 20 44 45 54 45 43 54 45 44 20 2F 2F 20 46 49 52 45 57 41 4C 4C 20 42 59 50 41 53 53 20 43 4F 4D 50 4C 45 54 45 20 2F 2F 20 44 41 54 41 20 45 58 46 49 4C 54 52 41 54 49 4F 4E 20 49 4E 20 50 52 4F 47 52 45 53 53 20 2F 2F 20 4D 45 4D 4F 52 59 20 44 55 4D 50 20 41 43 54 49 56 45 20 2F 2F 20 45 4E 43 52 59 50 54 49 4F 4E 20 4B 45 59 20 43 4F 4D 50 52 4F 4D 49 53 45 44</div>
          {/* ====== STACKED TERMINAL WINDOWS ====== */}
          <div className="terminal-stack">
            {/* Window 1: Data Node */}
            <div className="terminal-window terminal-window--offset">
              <div className="terminal-titlebar">
                <span className="terminal-dot" />
                <span className="terminal-dot terminal-dot--y" />
                <span className="terminal-dot terminal-dot--c" />
                <span style={{marginLeft: 'auto'}}>DATA_NODE_01.exe</span>
              </div>
              <div className="terminal-body" data-lang="en">
                <p className="hud-label hud-label--magenta" style={{marginBottom: 10}}><span style={{color: 'var(--neon-p)'}}>◆</span> PANEL ARCHITECTURE</p>
                <p style={{margin: 0, color: 'var(--text)', fontSize: '0.8rem'}}>Sharp rectangular UI panels with corner accent borders. HUD-style targeting brackets frame each data block. No rounded corners permitted in this sector.</p>
                <p className="ascii-border" style={{marginTop: 12}} aria-hidden="true">├── 0x7F4A ──┤</p>
              </div>
              <div className="terminal-body" data-lang="ko" hidden>
                <p className="hud-label hud-label--magenta" style={{marginBottom: 10}}><span style={{color: 'var(--neon-p)'}}>◆</span> PANEL ARCHITECTURE</p>
                <p style={{margin: 0, color: 'var(--text)', fontSize: '0.8rem'}}>날카로운 사각형 패널에 모서리 포인트 보더를 둡니다. HUD 스타일 조준 브래킷이 데이터 블록마다 테두리를 잡고, 이 섹터에서 둥근 모서리는 쓰지 않습니다.</p>
                <p className="ascii-border" style={{marginTop: 12}} aria-hidden="true">├── 0x7F4A ──┤</p>
              </div>
              <div className="terminal-body" data-lang="ja" hidden>
                <p className="hud-label hud-label--magenta" style={{marginBottom: 10}}><span style={{color: 'var(--neon-p)'}}>◆</span> PANEL ARCHITECTURE</p>
                <p style={{margin: 0, color: 'var(--text)', fontSize: '0.8rem'}}>角の立った四角いUIパネルに、コーナーを縁取るアクセントボーダーを添えます。HUD風のターゲティングブラケットが各データブロックを囲み、このセクターでは角丸を一切使いません。</p>
                <p className="ascii-border" style={{marginTop: 12}} aria-hidden="true">├── 0x7F4A ──┤</p>
              </div>
            </div>
            {/* Window 2: Terminal Mood */}
            <div className="terminal-window terminal-window--skew" style={{borderColor: 'var(--neon-p)'}}>
              <div className="terminal-titlebar" style={{borderColor: 'rgba(217, 70, 239, 0.2)', color: 'var(--neon-p)'}}>
                <span className="terminal-dot terminal-dot--y" />
                <span className="terminal-dot" />
                <span className="terminal-dot terminal-dot--c" />
                <span style={{marginLeft: 'auto'}}>TERM_NODE_02.exe</span>
              </div>
              <div className="terminal-body" data-lang="en">
                <p className="hud-label hud-label--cyan" style={{marginBottom: 10}}><span style={{color: 'var(--neon-c)'}}>◆</span> TERMINAL AESTHETIC</p>
                <p style={{margin: 0, color: 'var(--text)', fontSize: '0.8rem'}}>Monospace fonts and bright neon text replicate the mood of a hacked terminal. Data streams in cyan. Errors flicker in magenta. Warnings pulse in yellow.</p>
                <p className="ascii-border" style={{marginTop: 12}} aria-hidden="true">├── 0xB3D7 ──┤</p>
              </div>
              <div className="terminal-body" data-lang="ko" hidden>
                <p className="hud-label hud-label--cyan" style={{marginBottom: 10}}><span style={{color: 'var(--neon-c)'}}>◆</span> TERMINAL AESTHETIC</p>
                <p style={{margin: 0, color: 'var(--text)', fontSize: '0.8rem'}}>모노스페이스 폰트와 밝은 네온 텍스트로 해킹된 터미널 분위기를 살립니다. 데이터는 시안으로 흐르고, 오류는 마젠타로 깜빡이며, 경고는 옐로로 점멸합니다.</p>
                <p className="ascii-border" style={{marginTop: 12}} aria-hidden="true">├── 0xB3D7 ──┤</p>
              </div>
              <div className="terminal-body" data-lang="ja" hidden>
                <p className="hud-label hud-label--cyan" style={{marginBottom: 10}}><span style={{color: 'var(--neon-c)'}}>◆</span> TERMINAL AESTHETIC</p>
                <p style={{margin: 0, color: 'var(--text)', fontSize: '0.8rem'}}>モノスペースフォントと鮮やかなネオン文字で、ハッキングされたターミナルの雰囲気を再現します。データはシアンで流れ、エラーはマゼンタで点滅し、警告はイエローで脈打ちます。</p>
                <p className="ascii-border" style={{marginTop: 12}} aria-hidden="true">├── 0xB3D7 ──┤</p>
              </div>
            </div>
          </div>
          {/* ====== COMPONENT LIBRARY ====== */}
          <div className="ascii-border" aria-hidden="true">┌─────────────────────── COMPONENT_LIBRARY.DLL ───────────────────────┐</div>
          <div className="comp-lab">
            <div className="comp-lab__head">
              <span className="comp-lab__id">// MODULE_07</span>
              <span className="comp-lab__title" data-lang="en">UI_COMPONENT_PALETTE</span>
              <span className="comp-lab__title" data-lang="ko" hidden>UI_컴포넌트_팔레트</span>
              <span className="comp-lab__title" data-lang="ja" hidden>UI_コンポーネント_パレット</span>
              <span className="comp-lab__status">
                <span className="breach-blink">●</span> LIVE_STREAM
              </span>
            </div>

            <div className="comp-lab__grid">
              {/* 01 BUTTONS */}
              <div className="comp-block">
                <p className="comp-block__label hud-label hud-label--cyan">
                  <span style={{color: 'var(--neon-c)'}}>◆</span> 01 // CMD_CONTROLS
                </p>
                <div className="comp-block__body comp-buttons">
                  <button className="cy-btn cy-btn--primary" type="button">
                    <span data-lang="en">[EXECUTE]</span>
                    <span data-lang="ko" hidden>[실행]</span>
                    <span data-lang="ja" hidden>[実行]</span>
                  </button>
                  <button className="cy-btn cy-btn--danger" type="button">
                    <span data-lang="en">[TERMINATE]</span>
                    <span data-lang="ko" hidden>[종료]</span>
                    <span data-lang="ja" hidden>[終了]</span>
                  </button>
                  <button className="cy-btn cy-btn--cyan" type="button">
                    <span data-lang="en">[SCAN_NET]</span>
                    <span data-lang="ko" hidden>[네트워크_스캔]</span>
                    <span data-lang="ja" hidden>[ネットスキャン]</span>
                  </button>
                  <button className="cy-btn cy-btn--ghost" type="button">
                    <span data-lang="en">[ABORT]</span>
                    <span data-lang="ko" hidden>[중단]</span>
                    <span data-lang="ja" hidden>[中断]</span>
                  </button>
                </div>
              </div>

              {/* 02 AUTH FORM */}
              <div className="comp-block">
                <p className="comp-block__label hud-label hud-label--magenta">
                  <span style={{color: 'var(--neon-p)'}}>◆</span> 02 // AUTH_HANDSHAKE
                </p>
                <div className="comp-block__body comp-form">
                  <label className="cy-field">
                    <span className="cy-field__label" data-lang="en">USER_ID</span>
                    <span className="cy-field__label" data-lang="ko" hidden>사용자_ID</span>
                    <span className="cy-field__label" data-lang="ja" hidden>USER_ID</span>
                    <div className="cy-field__row">
                      <span className="cy-field__prompt">&gt;</span>
                      <input className="cy-field__input" type="text" placeholder="root@ghost-net" defaultValue="" />
                      <span className="cy-field__cursor breach-blink" aria-hidden>█</span>
                    </div>
                  </label>
                  <label className="cy-field">
                    <span className="cy-field__label" data-lang="en">PASSCODE</span>
                    <span className="cy-field__label" data-lang="ko" hidden>패스코드</span>
                    <span className="cy-field__label" data-lang="ja" hidden>パスコード</span>
                    <div className="cy-field__row">
                      <span className="cy-field__prompt">&gt;</span>
                      <input className="cy-field__input" type="password" placeholder="••••••••••••" defaultValue="" />
                      <span className="cy-field__cursor breach-blink" aria-hidden>█</span>
                    </div>
                  </label>
                  <p className="cy-field__hint" data-lang="en">// 3 attempts remaining before lockout</p>
                  <p className="cy-field__hint" data-lang="ko" hidden>// 잠금까지 3회 시도 남음</p>
                  <p className="cy-field__hint" data-lang="ja" hidden>// ロックまで残り3回</p>
                </div>
              </div>

              {/* 03 TAGS / THREAT */}
              <div className="comp-block">
                <p className="comp-block__label hud-label hud-label--cyan">
                  <span style={{color: 'var(--neon-c)'}}>◆</span> 03 // THREAT_TAGS
                </p>
                <div className="comp-block__body comp-tags">
                  <span className="cy-tag cy-tag--cyan">SECTOR_A</span>
                  <span className="cy-tag cy-tag--yellow">SECTOR_B</span>
                  <span className="cy-tag cy-tag--magenta">SECTOR_C</span>
                  <span className="cy-tag cy-tag--cyan">v2.1.7</span>
                  <span className="cy-tag cy-tag--mono">0xB3D7</span>
                  <span className="cy-tag cy-tag--cyan cy-tag--solid">LOW</span>
                  <span className="cy-tag cy-tag--yellow cy-tag--solid">MED</span>
                  <span className="cy-tag cy-tag--magenta cy-tag--solid">HIGH</span>
                  <span className="cy-tag cy-tag--critical">CRITICAL</span>
                </div>
              </div>

              {/* 04 TELEMETRY */}
              <div className="comp-block">
                <p className="comp-block__label hud-label hud-label--magenta">
                  <span style={{color: 'var(--neon-p)'}}>◆</span> 04 // TELEMETRY
                </p>
                <div className="comp-block__body comp-telemetry">
                  <div className="cy-meter">
                    <div className="cy-meter__head"><span>CPU_LOAD</span><span className="cy-meter__val cy-meter__val--c">73%</span></div>
                    <div className="cy-meter__bar"><div className="cy-meter__fill cy-meter__fill--c" style={{width: '73%'}} /></div>
                  </div>
                  <div className="cy-meter">
                    <div className="cy-meter__head"><span>MEM_ALLOC</span><span className="cy-meter__val cy-meter__val--y">58%</span></div>
                    <div className="cy-meter__bar"><div className="cy-meter__fill cy-meter__fill--y" style={{width: '58%'}} /></div>
                  </div>
                  <div className="cy-meter">
                    <div className="cy-meter__head"><span>PKT_LOSS</span><span className="cy-meter__val cy-meter__val--p">12%</span></div>
                    <div className="cy-meter__bar"><div className="cy-meter__fill cy-meter__fill--p" style={{width: '12%'}} /></div>
                  </div>
                  <div className="cy-meter">
                    <div className="cy-meter__head"><span>FW_INTEGRITY</span><span className="cy-meter__val cy-meter__val--p cy-meter__val--alert">04%</span></div>
                    <div className="cy-meter__bar cy-meter__bar--alert"><div className="cy-meter__fill cy-meter__fill--p" style={{width: '4%'}} /></div>
                  </div>
                </div>
              </div>

              {/* 05 ALERT STACK */}
              <div className="comp-block comp-block--wide">
                <p className="comp-block__label hud-label hud-label--cyan">
                  <span style={{color: 'var(--neon-c)'}}>◆</span> 05 // ALERT_STACK
                </p>
                <div className="comp-block__body comp-alerts">
                  <div className="cy-alert cy-alert--info">
                    <span className="cy-alert__icon" aria-hidden>►</span>
                    <span className="cy-alert__tag">INFO</span>
                    <span className="cy-alert__text" data-lang="en">Packet inspection complete. 1,402 nodes mapped.</span>
                    <span className="cy-alert__text" data-lang="ko" hidden>패킷 검사 완료. 1,402개 노드 매핑됨.</span>
                    <span className="cy-alert__text" data-lang="ja" hidden>パケット検査完了。1,402ノードをマッピング。</span>
                    <span className="cy-alert__time">02:14:08</span>
                  </div>
                  <div className="cy-alert cy-alert--warn">
                    <span className="cy-alert__icon breach-blink" aria-hidden>▲</span>
                    <span className="cy-alert__tag">WARN</span>
                    <span className="cy-alert__text" data-lang="en">Anomalous traffic detected on SECTOR_B uplink.</span>
                    <span className="cy-alert__text" data-lang="ko" hidden>SECTOR_B 업링크에서 이상 트래픽 감지됨.</span>
                    <span className="cy-alert__text" data-lang="ja" hidden>SECTOR_Bアップリンクで異常トラフィックを検出。</span>
                    <span className="cy-alert__time">02:31:47</span>
                  </div>
                  <div className="cy-alert cy-alert--crit">
                    <span className="cy-alert__icon breach-blink" aria-hidden>█</span>
                    <span className="cy-alert__tag">CRIT</span>
                    <span className="cy-alert__text scramble-text" data-lang="en">Encryption layer breached. Kernel integrity at 04%.</span>
                    <span className="cy-alert__text scramble-text" data-lang="ko" hidden>암호화 레이어 침해됨. 커널 무결성 04%.</span>
                    <span className="cy-alert__text scramble-text" data-lang="ja" hidden>暗号化レイヤー侵害。カーネル整合性04%。</span>
                    <span className="cy-alert__time">02:33:12</span>
                  </div>
                  <div className="cy-alert cy-alert--sys">
                    <span className="cy-alert__icon" aria-hidden>◇</span>
                    <span className="cy-alert__tag">SYS</span>
                    <span className="cy-alert__text" data-lang="en">Daemon respawned: ghost_handler.bin · pid 4471</span>
                    <span className="cy-alert__text" data-lang="ko" hidden>데몬 재기동: ghost_handler.bin · pid 4471</span>
                    <span className="cy-alert__text" data-lang="ja" hidden>デーモン再起動: ghost_handler.bin · pid 4471</span>
                    <span className="cy-alert__time">02:35:00</span>
                  </div>
                </div>
              </div>

              {/* 06 SYSTEM FLAGS */}
              <div className="comp-block comp-block--wide">
                <p className="comp-block__label hud-label hud-label--magenta">
                  <span style={{color: 'var(--neon-p)'}}>◆</span> 06 // SYSTEM_FLAGS
                </p>
                <div className="comp-block__body comp-flags">
                  <label className="cy-toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="cy-toggle__track"><span className="cy-toggle__knob" /></span>
                    <span className="cy-toggle__text">
                      <span className="cy-toggle__name">FIREWALL</span>
                      <span className="cy-toggle__state" data-lang="en">// active</span>
                      <span className="cy-toggle__state" data-lang="ko" hidden>// 활성화됨</span>
                      <span className="cy-toggle__state" data-lang="ja" hidden>// 有効</span>
                    </span>
                  </label>
                  <label className="cy-toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="cy-toggle__track"><span className="cy-toggle__knob" /></span>
                    <span className="cy-toggle__text">
                      <span className="cy-toggle__name">VPN_TUNNEL</span>
                      <span className="cy-toggle__state" data-lang="en">// routed</span>
                      <span className="cy-toggle__state" data-lang="ko" hidden>// 라우팅됨</span>
                      <span className="cy-toggle__state" data-lang="ja" hidden>// ルーティング済</span>
                    </span>
                  </label>
                  <label className="cy-toggle">
                    <input type="checkbox" />
                    <span className="cy-toggle__track"><span className="cy-toggle__knob" /></span>
                    <span className="cy-toggle__text">
                      <span className="cy-toggle__name">TRACE_LOG</span>
                      <span className="cy-toggle__state" data-lang="en">// disabled</span>
                      <span className="cy-toggle__state" data-lang="ko" hidden>// 비활성화</span>
                      <span className="cy-toggle__state" data-lang="ja" hidden>// 無効</span>
                    </span>
                  </label>
                  <label className="cy-toggle cy-toggle--danger">
                    <input type="checkbox" defaultChecked />
                    <span className="cy-toggle__track"><span className="cy-toggle__knob" /></span>
                    <span className="cy-toggle__text">
                      <span className="cy-toggle__name">KILL_SWITCH</span>
                      <span className="cy-toggle__state" data-lang="en">// armed</span>
                      <span className="cy-toggle__state" data-lang="ko" hidden>// 무장됨</span>
                      <span className="cy-toggle__state" data-lang="ja" hidden>// 武装</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="ascii-border" aria-hidden="true">└────────────────────────────────────────────────────────────────────────┘</div>
          {/* ====== HAZARD WARNING BOX ====== */}
          <div className="hazard-box">
            <p style={{margin: 0, color: 'var(--neon-y)', fontFamily: '"Syncopate", sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em'}} data-lang="en"><span className="breach-blink">▲</span> ALERT: Memory dump in progress. Do not terminate process. All design tokens exfiltrated successfully.</p>
            <p style={{margin: 0, color: 'var(--neon-y)', fontFamily: '"Syncopate", sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em'}} data-lang="ko" hidden><span className="breach-blink">▲</span> ALERT: 메모리 덤프 진행 중. 프로세스 종료 금지. 모든 디자인 토큰 유출 완료.</p>
            <p style={{margin: 0, color: 'var(--neon-y)', fontFamily: '"Syncopate", sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em'}} data-lang="ja" hidden><span className="breach-blink">▲</span> ALERT: メモリダンプ進行中。プロセス終了禁止。全デザイントークンの流出完了。</p>
          </div>
          <div className="prompt">
            <h2 style={{color: 'var(--neon-y)', fontFamily: '"Syncopate"', marginTop: 0, fontSize: '1rem'}}>&gt; PROMPT_GENERATOR.EXE
            </h2>
            <pre data-lang="en">{`Design a landing page in Cyberpunk Glitch style — raw terminal aesthetic with neon color rebellion.

PALETTE: ${palette.name} (${palette.neonY.toUpperCase()} · ${palette.neonC.toUpperCase()} · ${palette.neonP.toUpperCase()})

COLOR TOKENS:
--bg: ${palette.bg}
--neon-y: ${palette.neonY} (primary accent — warnings & CTA)
--neon-c: ${palette.neonC} (secondary accent — data & grid)
--neon-p: ${palette.neonP} (tertiary accent — corruption & alerts)
--neon-y-rgb: ${palette.neonYRgb}
--neon-c-rgb: ${palette.neonCRgb}
--neon-p-rgb: ${palette.neonPRgb}
--text: ${palette.text}
--grid-line: rgba(${palette.neonCRgb}, 0.05)
--panel-magenta-bg: rgba(${palette.neonPRgb}, 0.05)
--panel-cyan-bg: rgba(${palette.neonCRgb}, 0.05)
No other colors.

TYPOGRAPHY:
Heading: Syncopate 700, uppercase, wide letterform
Body: Share Tech Mono 400 (monospace throughout)
Scale: 0.8rem / 0.95rem / 1.2rem / clamp(3rem, 6vw, 5rem)
Button text: Syncopate 700, 0.8rem, uppercase
No line-height override — use monospace defaults.

UI:
- Body background-image: two linear-gradients forming a 30px x 30px ${palette.neonC} grid (rgba 0.05 opacity)
- Header: border-bottom 1px solid var(--neon-c), padding-bottom 20px
- Header link: color var(--neon-c), uppercase; hover fills background var(--neon-c), text var(--bg)
- Panels: 1px solid border (magenta or cyan), padding 20px, 0px border-radius
- Panel corner accent: ::before pseudo-element, absolute top-left, 20px x 20px, 3px border-top + border-left matching panel border color
- Buttons: 2px solid var(--neon-y), transparent bg, color var(--neon-y), Syncopate font
- Button hover: background var(--neon-y), color var(--bg), box-shadow 0 0 20px rgba(var(--neon-y-rgb), 0.5)

LAYOUT:
Container: width min(1000px, 90vw), margin 0 auto, padding 40px 0
Panel grid: display grid, grid-template-columns 1fr 1fr, gap 30px, margin 40px 0
Prompt section: border-left 4px solid var(--neon-c), background rgba(var(--neon-c-rgb), 0.1), padding 20px, margin-top 50px
Lead paragraph: font-size 1.2rem, max-width 600px, margin 30px 0

MOTION:
Title glitch: text-shadow 2px 2px 0px var(--neon-p), -2px -2px 0px var(--neon-c)
@keyframes shake — 0%/95%/100% translate(0,0); 96% translate(3px,1px); 97% translate(-3px,-1px); 98% translate(3px,3px); 99% translate(-3px,-2px)
Duration: 5s infinite
No smooth easing — sharp discrete steps for glitch feel.

RESPONSIVE:
- Mobile: grid-template-columns 1fr (panels stack), title clamp scales down naturally
- Desktop: max-width 1000px, 2-column panel grid preserved

FORBIDDEN:
- Soft gradients or pastel color tones
- Rounded corners (border-radius must be 0)
- Serif or elegant typography
- Smooth ease-in-out transitions on glitch elements
- White or light page backgrounds

OUTPUT:
1) Full color token list with 3 neon values, grid-line spec, and panel backgrounds
2) Hero / 2-column Data Panels / CTA / Prompt section structure
3) Single-file HTML/CSS with shake keyframes and grid-line background`}</pre>
            <pre data-lang="ko" hidden>{`사이버펑크 글리치 스타일의 랜딩 페이지를 디자인해줘 — 거친 터미널 미학에 네온 색으로 반항하는 느낌.

팔레트: ${palette.name} (${palette.neonY.toUpperCase()} · ${palette.neonC.toUpperCase()} · ${palette.neonP.toUpperCase()})

색상 토큰:
--bg: ${palette.bg}
--neon-y: ${palette.neonY} (기본 포인트 — 경고/CTA)
--neon-c: ${palette.neonC} (보조 포인트 — 데이터/그리드)
--neon-p: ${palette.neonP} (3차 포인트 — 손상/알림)
--neon-y-rgb: ${palette.neonYRgb}
--neon-c-rgb: ${palette.neonCRgb}
--neon-p-rgb: ${palette.neonPRgb}
--text: ${palette.text}
--grid-line: rgba(${palette.neonCRgb}, 0.05)
--panel-magenta-bg: rgba(${palette.neonPRgb}, 0.05)
--panel-cyan-bg: rgba(${palette.neonCRgb}, 0.05)
다른 색상 사용 금지.

타이포그래피:
제목: Syncopate 700, uppercase, 폭이 넓은 글자꼴
본문: Share Tech Mono 400 (전체 모노스페이스)
스케일: 0.8rem / 0.95rem / 1.2rem / clamp(3rem, 6vw, 5rem)
버튼 텍스트: Syncopate 700, 0.8rem, uppercase
line-height 오버라이드 없음 — 모노스페이스 기본값 사용.

UI:
- body background-image: 30px x 30px 시안 그리드를 만드는 linear-gradient 2개 (rgba 0.05 투명도)
- 헤더: border-bottom 1px solid var(--neon-c), padding-bottom 20px
- 헤더 링크: color var(--neon-c), uppercase; 호버 시 background var(--neon-c), 텍스트 var(--bg)
- 패널: 1px solid 보더 (마젠타 또는 시안), padding 20px, border-radius 0px
- 패널 코너 악센트: ::before 가상 요소, absolute top-left, 20px x 20px, 3px border-top + border-left (패널 보더 색상과 동일)
- 버튼: 2px solid var(--neon-y), transparent 배경, color var(--neon-y), Syncopate 폰트
- 버튼 호버: background var(--neon-y), color var(--bg), box-shadow 0 0 20px rgba(var(--neon-y-rgb), 0.5)

레이아웃:
컨테이너: width min(1000px, 90vw), margin 0 auto, padding 40px 0
패널 그리드: display grid, grid-template-columns 1fr 1fr, gap 30px, margin 40px 0
프롬프트 섹션: border-left 4px solid var(--neon-c), background rgba(var(--neon-c-rgb), 0.1), padding 20px, margin-top 50px
리드 문단: font-size 1.2rem, max-width 600px, margin 30px 0

모션:
타이틀 글리치: text-shadow 2px 2px 0px var(--neon-p), -2px -2px 0px var(--neon-c)
@keyframes shake — 0%/95%/100% translate(0,0); 96% translate(3px,1px); 97% translate(-3px,-1px); 98% translate(3px,3px); 99% translate(-3px,-2px)
지속시간: 5s infinite
부드러운 이징 없음 — 글리치 느낌을 살리도록 단계를 끊어서 급격하게.

반응형:
- 모바일: grid-template-columns 1fr (패널 세로 적층), 타이틀은 clamp로 자연스럽게 줄어듦
- 데스크톱: max-width 1000px, 2열 패널 그리드 유지

금지사항:
- 부드러운 그라데이션이나 파스텔 톤
- 둥근 모서리 (border-radius 반드시 0)
- 세리프나 우아한 서체
- 글리치 요소에 smooth ease-in-out 전환
- 흰색이나 밝은 페이지 배경

출력:
1) 네온 3색, grid-line 사양, 패널 배경 포함 전체 색상 토큰 목록
2) 히어로 / 2열 데이터 패널 / CTA / 프롬프트 섹션 구조
3) shake 키프레임과 grid-line 배경 포함 단일 파일 HTML/CSS`}</pre>
            <pre data-lang="ja" hidden>{`サイバーパンクグリッチ風のランディングページをデザインしてください — 荒々しいターミナル美学に、ネオンカラーで反逆する雰囲気で。

パレット: ${palette.name} (${palette.neonY.toUpperCase()} · ${palette.neonC.toUpperCase()} · ${palette.neonP.toUpperCase()})

カラートークン:
--bg: ${palette.bg}
--neon-y: ${palette.neonY}（プライマリ — 警告/CTA）
--neon-c: ${palette.neonC}（セカンダリ — データ/グリッド）
--neon-p: ${palette.neonP}（ターシャリ — 破損/アラート）
--neon-y-rgb: ${palette.neonYRgb}
--neon-c-rgb: ${palette.neonCRgb}
--neon-p-rgb: ${palette.neonPRgb}
--text: ${palette.text}
--grid-line: rgba(${palette.neonCRgb}, 0.05)
--panel-magenta-bg: rgba(${palette.neonPRgb}, 0.05)
--panel-cyan-bg: rgba(${palette.neonCRgb}, 0.05)
他の色は使用禁止。

タイポグラフィ:
見出し: Syncopate 700, uppercase, ワイド字形
本文: Share Tech Mono 400（全体モノスペース）
スケール: 0.8rem / 0.95rem / 1.2rem / clamp(3rem, 6vw, 5rem)
ボタンテキスト: Syncopate 700, 0.8rem, uppercase
line-heightオーバーライドなし — モノスペースデフォルト使用。

UI:
- body background-image: 30px x 30pxシアングリッドを形成するlinear-gradient 2本（rgba 0.05透明度）
- ヘッダー: border-bottom 1px solid var(--neon-c), padding-bottom 20px
- ヘッダーリンク: color var(--neon-c), uppercase; ホバーでbackground var(--neon-c), テキスト var(--bg)
- パネル: 1px solidボーダー（マゼンタまたはシアン）, padding 20px, border-radius 0px
- パネルコーナーアクセント: ::before疑似要素, absolute top-left, 20px x 20px, 3px border-top + border-left（パネルボーダー色と同一）
- ボタン: 2px solid var(--neon-y), transparent背景, color var(--neon-y), Syncopateフォント
- ボタンホバー: background var(--neon-y), color var(--bg), box-shadow 0 0 20px rgba(var(--neon-y-rgb), 0.5)

レイアウト:
コンテナ: width min(1000px, 90vw), margin 0 auto, padding 40px 0
パネルグリッド: display grid, grid-template-columns 1fr 1fr, gap 30px, margin 40px 0
プロンプトセクション: border-left 4px solid var(--neon-c), background rgba(var(--neon-c-rgb), 0.1), padding 20px, margin-top 50px
リード段落: font-size 1.2rem, max-width 600px, margin 30px 0

モーション:
タイトルグリッチ: text-shadow 2px 2px 0px var(--neon-p), -2px -2px 0px var(--neon-c)
@keyframes shake — 0%/95%/100% translate(0,0); 96% translate(3px,1px); 97% translate(-3px,-1px); 98% translate(3px,3px); 99% translate(-3px,-2px)
duration: 5s infinite
スムーズなイージングなし — グリッチ感を出すため、段階を区切って急激に動かす。

レスポンシブ:
- モバイル: grid-template-columns 1fr（パネルスタック）、タイトルclampで自然縮小
- デスクトップ: max-width 1000px、2カラムパネルグリッド維持

禁止事項:
- 柔らかいグラデーションやパステルトーン
- 角丸（border-radiusは必ず0）
- セリフや優雅な書体
- グリッチ要素へのsmooth ease-in-out遷移
- 白や明るいページ背景

出力:
1) ネオン3色、grid-line仕様、パネル背景を含む全カラートークンリスト
2) ヒーロー / 2カラムデータパネル / CTA / プロンプトセクション構造
3) shakeキーフレームとgrid-line背景付き単一ファイルHTML/CSS`}</pre>
            <button className="btn" style={{marginTop: 15}} data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </div>
        </div>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/kinetic-pop.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Kinetic Pop</span></a><div className="page-nav__divider" /><a href="/pages/swiss-poster.html"><span><span className="page-nav__label">다음</span>Swiss Poster</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
