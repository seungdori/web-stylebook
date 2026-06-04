import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { ColorModeToggle } from '../ColorModeToggle';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedTerminalCorePage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--terminal-core">
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
                <ColorModeToggle pageKey="terminal-core" />
                <button className="theme-toggle" id="global-theme-reset" aria-label="Reset Global Theme" data-color="Reset Global Theme" title="Reset Global Theme">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>
          <section className="crt-monitor" aria-label="Terminal Core Demo">
            <div className="crt-scanline" />
            <div className="crt-bar">
              <div className="crt-bar__dots">
                <span className="crt-bar__dot crt-bar__dot--active" />
                <span className="crt-bar__dot" />
                <span className="crt-bar__dot" />
              </div>
              <span data-lang="en">designer@mainframe:~/design-system</span>
              <span data-lang="ko" hidden>designer@mainframe:~/design-system</span>
              <span data-lang="ja" hidden>designer@mainframe:~/design-system</span>
            </div>
            <div className="crt-screen">
              {/* LOGIN SEQUENCE */}
              <div className="term-section" data-lang="en">
                <pre className="glow">TERMINAL-CORE DESIGN MAINFRAME v4.2.1{"\n"}Copyright (c) 1983 Phosphor Systems Inc.{"\n"}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{"\n"}{"\n"}login: <span className="accent">designer</span>{"\n"}password: ********{"\n"}Last login: Mon Mar{"  "}6 09:41:22 2026 from 10.0.0.1{"\n"}{"\n"}Welcome to TERMINAL-CORE. All sessions are logged.{"\n"}Type 'help' for available commands.{"\n"}{"\n"}<span className="dim">designer@mainframe:~$</span> cat /etc/design-system/manifest.conf{"\n"}{"\n"}<span className="accent">[MANIFEST]</span>{"\n"}name{"        "}= terminal-core{"\n"}version{"     "}= 4.2.1{"\n"}type{"        "}= dark-phosphor-crt{"\n"}family{"      "}= monospace-only{"\n"}{"\n"}<span className="accent">[COLORS]</span>{"\n"}background{"  "}= #071109{"\n"}ink{"         "}= #b9ffbe{"\n"}line{"        "}= #1e4f22{"\n"}soft{"        "}= #0f2512{"\n"}warn{"        "}= #d4ff5c{"\n"}{"\n"}<span className="accent">[TYPOGRAPHY]</span>{"\n"}font{"        "}= JetBrains Mono{"\n"}weights{"     "}= 400, 600, 700, 800{"\n"}h1_scale{"    "}= clamp(1.8rem, 5vw, 3.6rem){"\n"}body_lh{"     "}= 1.7{"\n"}heading_lh{"  "}= 1.05</pre>
              </div>
              <div className="term-section" data-lang="ko" hidden>
                <pre className="glow">TERMINAL-CORE DESIGN MAINFRAME v4.2.1{"\n"}Copyright (c) 1983 Phosphor Systems Inc.{"\n"}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{"\n"}{"\n"}login: <span className="accent">designer</span>{"\n"}password: ********{"\n"}최근 로그인: 2026년 3월 6일 월 09:41:22 (10.0.0.1){"\n"}{"\n"}TERMINAL-CORE에 오신 것을 환영합니다. 모든 세션이 기록됩니다.{"\n"}사용 가능한 명령어를 보려면 'help'를 입력하세요.{"\n"}{"\n"}<span className="dim">designer@mainframe:~$</span> cat /etc/design-system/manifest.conf{"\n"}{"\n"}<span className="accent">[MANIFEST]</span>{"\n"}name{"        "}= terminal-core{"\n"}version{"     "}= 4.2.1{"\n"}type{"        "}= dark-phosphor-crt{"\n"}family{"      "}= 모노스페이스 전용{"\n"}{"\n"}<span className="accent">[COLORS]</span>{"\n"}background{"  "}= #071109{"\n"}ink{"         "}= #b9ffbe{"\n"}line{"        "}= #1e4f22{"\n"}soft{"        "}= #0f2512{"\n"}warn{"        "}= #d4ff5c{"\n"}{"\n"}<span className="accent">[TYPOGRAPHY]</span>{"\n"}font{"        "}= JetBrains Mono{"\n"}weights{"     "}= 400, 600, 700, 800{"\n"}h1_scale{"    "}= clamp(1.8rem, 5vw, 3.6rem){"\n"}body_lh{"     "}= 1.7{"\n"}heading_lh{"  "}= 1.05</pre>
              </div>
              <div className="term-section" data-lang="ja" hidden>
                <pre className="glow">TERMINAL-CORE DESIGN MAINFRAME v4.2.1{"\n"}Copyright (c) 1983 Phosphor Systems Inc.{"\n"}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{"\n"}{"\n"}login: <span className="accent">designer</span>{"\n"}password: ********{"\n"}最終ログイン: 2026年3月6日 月 09:41:22 (10.0.0.1){"\n"}{"\n"}TERMINAL-COREへようこそ。すべてのセッションを記録します。{"\n"}利用可能なコマンドを見るには 'help' と入力してください。{"\n"}{"\n"}<span className="dim">designer@mainframe:~$</span> cat /etc/design-system/manifest.conf{"\n"}{"\n"}<span className="accent">[MANIFEST]</span>{"\n"}name{"        "}= terminal-core{"\n"}version{"     "}= 4.2.1{"\n"}type{"        "}= dark-phosphor-crt{"\n"}family{"      "}= モノスペース専用{"\n"}{"\n"}<span className="accent">[COLORS]</span>{"\n"}background{"  "}= #071109{"\n"}ink{"         "}= #b9ffbe{"\n"}line{"        "}= #1e4f22{"\n"}soft{"        "}= #0f2512{"\n"}warn{"        "}= #d4ff5c{"\n"}{"\n"}<span className="accent">[TYPOGRAPHY]</span>{"\n"}font{"        "}= JetBrains Mono{"\n"}weights{"     "}= 400, 600, 700, 800{"\n"}h1_scale{"    "}= clamp(1.8rem, 5vw, 3.6rem){"\n"}body_lh{"     "}= 1.7{"\n"}heading_lh{"  "}= 1.05</pre>
              </div>
              {/* LS COMMAND: Design Token Files */}
              <div className="term-section" data-lang="en">
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> ls -la ./tokens/{"\n"}{"\n"}total 48{"\n"}drwxr-xr-x{"  "}8 designer staff{"  "}256 Mar{"  "}6 08:12 <span className="accent">.</span>{"\n"}drwxr-xr-x{"  "}4 designer staff{"  "}128 Mar{"  "}5 14:30 <span className="accent">..</span>{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}1.2K Mar{"  "}6 08:12 colors.token{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}840{"  "}Mar{"  "}5 19:44 typography.token{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}512{"  "}Mar{"  "}4 11:20 spacing.token{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}1.8K Mar{"  "}6 07:55 components.token{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}320{"  "}Mar{"  "}3 16:08 motion.token{"\n"}-rwxr-xr-x{"  "}1 designer staff{"  "}2.4K Mar{"  "}6 08:10 <span className="accent">run-audit.sh</span></pre>
              </div>
              <div className="term-section" data-lang="ko" hidden>
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> ls -la ./tokens/{"\n"}{"\n"}합계 48{"\n"}drwxr-xr-x{"  "}8 designer staff{"  "}256{"  "}3월{"  "}6 08:12 <span className="accent">.</span>{"\n"}drwxr-xr-x{"  "}4 designer staff{"  "}128{"  "}3월{"  "}5 14:30 <span className="accent">..</span>{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}1.2K 3월{"  "}6 08:12 colors.token{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}840{"  "}3월{"  "}5 19:44 typography.token{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}512{"  "}3월{"  "}4 11:20 spacing.token{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}1.8K 3월{"  "}6 07:55 components.token{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}320{"  "}3월{"  "}3 16:08 motion.token{"\n"}-rwxr-xr-x{"  "}1 designer staff{"  "}2.4K 3월{"  "}6 08:10 <span className="accent">run-audit.sh</span></pre>
              </div>
              <div className="term-section" data-lang="ja" hidden>
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> ls -la ./tokens/{"\n"}{"\n"}合計 48{"\n"}drwxr-xr-x{"  "}8 designer staff{"  "}256{"  "}3月{"  "}6 08:12 <span className="accent">.</span>{"\n"}drwxr-xr-x{"  "}4 designer staff{"  "}128{"  "}3月{"  "}5 14:30 <span className="accent">..</span>{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}1.2K 3月{"  "}6 08:12 colors.token{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}840{"  "}3月{"  "}5 19:44 typography.token{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}512{"  "}3月{"  "}4 11:20 spacing.token{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}1.8K 3月{"  "}6 07:55 components.token{"\n"}-rw-r--r--{"  "}1 designer staff{"  "}320{"  "}3月{"  "}3 16:08 motion.token{"\n"}-rwxr-xr-x{"  "}1 designer staff{"  "}2.4K 3月{"  "}6 08:10 <span className="accent">run-audit.sh</span></pre>
              </div>
              {/* AUDIT SCRIPT WITH PROGRESS */}
              <div className="term-section" data-lang="en">
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> ./run-audit.sh --verbose{"\n"}{"\n"}<span className="accent">▶ DESIGN SYSTEM AUDIT v2.1</span>{"\n"}{"  "}Scanning tokens...{"     "}[<span className="bar-fill">████████████████████</span><span className="bar-empty" />] 100%{"\n"}{"  "}Checking contrast...{"   "}[<span className="bar-fill">████████████████████</span><span className="bar-empty" />] 100%{"\n"}{"  "}Validating spacing...{"  "}[<span className="bar-fill">████████████████████</span><span className="bar-empty" />] 100%{"\n"}{"  "}Running lint...{"        "}[<span className="bar-fill">████████████████</span><span className="bar-empty">░░░░</span>]{"  "}80%{"\n"}{"  "}Bundling output...{"     "}[<span className="bar-fill">██████████████████</span><span className="bar-empty">░░</span>]{"  "}90%{"\n"}{"\n"}{"  "}✓ 47 tokens validated{"\n"}{"  "}✓ 12 components passed{"\n"}{"  "}⚠ 2 warnings (non-critical){"\n"}{"  "}AUDIT COMPLETE — system nominal</pre>
              </div>
              <div className="term-section" data-lang="ko" hidden>
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> ./run-audit.sh --verbose{"\n"}{"\n"}<span className="accent">▶ 디자인 시스템 감사 v2.1</span>{"\n"}{"  "}토큰 스캔 중...{"        "}[<span className="bar-fill">████████████████████</span><span className="bar-empty" />] 100%{"\n"}{"  "}대비 검사 중...{"        "}[<span className="bar-fill">████████████████████</span><span className="bar-empty" />] 100%{"\n"}{"  "}간격 검증 중...{"        "}[<span className="bar-fill">████████████████████</span><span className="bar-empty" />] 100%{"\n"}{"  "}린트 실행 중...{"        "}[<span className="bar-fill">████████████████</span><span className="bar-empty">░░░░</span>]{"  "}80%{"\n"}{"  "}출력 번들링 중...{"      "}[<span className="bar-fill">██████████████████</span><span className="bar-empty">░░</span>]{"  "}90%{"\n"}{"\n"}{"  "}✓ 47개 토큰 검증 완료{"\n"}{"  "}✓ 12개 컴포넌트 통과{"\n"}{"  "}⚠ 2개 경고 (비핵심){"\n"}{"  "}감사 완료 — 시스템 정상</pre>
              </div>
              <div className="term-section" data-lang="ja" hidden>
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> ./run-audit.sh --verbose{"\n"}{"\n"}<span className="accent">▶ デザインシステム監査 v2.1</span>{"\n"}{"  "}トークンスキャン中...{"  "}[<span className="bar-fill">████████████████████</span><span className="bar-empty" />] 100%{"\n"}{"  "}コントラスト検査中...{"  "}[<span className="bar-fill">████████████████████</span><span className="bar-empty" />] 100%{"\n"}{"  "}スペーシング検証中...{"  "}[<span className="bar-fill">████████████████████</span><span className="bar-empty" />] 100%{"\n"}{"  "}リント実行中...{"        "}[<span className="bar-fill">████████████████</span><span className="bar-empty">░░░░</span>]{"  "}80%{"\n"}{"  "}出力バンドル中...{"      "}[<span className="bar-fill">██████████████████</span><span className="bar-empty">░░</span>]{"  "}90%{"\n"}{"\n"}{"  "}✓ 47トークン検証完了{"\n"}{"  "}✓ 12コンポーネント通過{"\n"}{"  "}⚠ 2件の警告（非クリティカル）{"\n"}{"  "}監査完了 — システム正常</pre>
              </div>
              {/* HTOP-STYLE METRICS */}
              <div className="term-section" data-lang="en">
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> dstop{"\n"}{"\n"}<span className="accent glow-strong">┌─ DESIGN SYSTEM MONITOR ──────────────────────────┐</span>{"\n"}│{"                                                   "}│{"\n"}│{"  "}Color Contrast{"    "}[<span className="bar-fill">██████████████████</span><span className="bar-empty">░░</span>]{"  "}94%{"  "}│{"\n"}│{"  "}Typography Scale{"  "}[<span className="bar-fill">█████████████████</span><span className="bar-empty">░░░</span>]{"  "}1.25 │{"\n"}│{"  "}Grid Columns{"      "}[<span className="bar-fill">████████████████████</span><span className="bar-empty" />]{"  "}12{"   "}│{"\n"}│{"  "}Spacing Unit{"      "}[<span className="bar-fill">████████</span><span className="bar-empty">░░░░░░░░░░░░</span>]{"  "}8px{"  "}│{"\n"}│{"  "}Components{"        "}[<span className="bar-fill">██████████████</span><span className="bar-empty">░░░░░░</span>]{"  "}12{"   "}│{"\n"}│{"  "}Token Files{"       "}[<span className="bar-fill">██████████</span><span className="bar-empty">░░░░░░░░░░</span>]{"  "}6{"    "}│{"\n"}│{"                                                   "}│{"\n"}│{"  "}<span className="dim">CPU: 3.2%{"    "}MEM: 12MB{"    "}UPTIME: 847d 6h 12m</span>{"   "}│{"\n"}<span className="accent glow-strong">└───────────────────────────────────────────────────┘</span></pre>
              </div>
              <div className="term-section" data-lang="ko" hidden>
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> dstop{"\n"}{"\n"}<span className="accent glow-strong">┌─ 디자인 시스템 모니터 ───────────────────────────┐</span>{"\n"}│{"                                                   "}│{"\n"}│{"  "}색상 대비{"         "}[<span className="bar-fill">██████████████████</span><span className="bar-empty">░░</span>]{"  "}94%{"  "}│{"\n"}│{"  "}타이포 스케일{"     "}[<span className="bar-fill">█████████████████</span><span className="bar-empty">░░░</span>]{"  "}1.25 │{"\n"}│{"  "}그리드 열{"         "}[<span className="bar-fill">████████████████████</span><span className="bar-empty" />]{"  "}12{"   "}│{"\n"}│{"  "}간격 단위{"         "}[<span className="bar-fill">████████</span><span className="bar-empty">░░░░░░░░░░░░</span>]{"  "}8px{"  "}│{"\n"}│{"  "}컴포넌트{"          "}[<span className="bar-fill">██████████████</span><span className="bar-empty">░░░░░░</span>]{"  "}12{"   "}│{"\n"}│{"  "}토큰 파일{"         "}[<span className="bar-fill">██████████</span><span className="bar-empty">░░░░░░░░░░</span>]{"  "}6{"    "}│{"\n"}│{"                                                   "}│{"\n"}│{"  "}<span className="dim">CPU: 3.2%{"    "}MEM: 12MB{"    "}가동: 847일 6시간 12분</span> │{"\n"}<span className="accent glow-strong">└───────────────────────────────────────────────────┘</span></pre>
              </div>
              <div className="term-section" data-lang="ja" hidden>
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> dstop{"\n"}{"\n"}<span className="accent glow-strong">┌─ デザインシステムモニター ────────────────────────┐</span>{"\n"}│{"                                                   "}│{"\n"}│{"  "}色コントラスト{"    "}[<span className="bar-fill">██████████████████</span><span className="bar-empty">░░</span>]{"  "}94%{"  "}│{"\n"}│{"  "}タイポスケール{"    "}[<span className="bar-fill">█████████████████</span><span className="bar-empty">░░░</span>]{"  "}1.25 │{"\n"}│{"  "}グリッド列{"        "}[<span className="bar-fill">████████████████████</span><span className="bar-empty" />]{"  "}12{"   "}│{"\n"}│{"  "}間隔単位{"          "}[<span className="bar-fill">████████</span><span className="bar-empty">░░░░░░░░░░░░</span>]{"  "}8px{"  "}│{"\n"}│{"  "}コンポーネント{"    "}[<span className="bar-fill">██████████████</span><span className="bar-empty">░░░░░░</span>]{"  "}12{"   "}│{"\n"}│{"  "}トークンファイル{"  "}[<span className="bar-fill">██████████</span><span className="bar-empty">░░░░░░░░░░</span>]{"  "}6{"    "}│{"\n"}│{"                                                   "}│{"\n"}│{"  "}<span className="dim">CPU: 3.2%{"    "}MEM: 12MB{"    "}稼働: 847日 6時間12分</span>{"  "}│{"\n"}<span className="accent glow-strong">└───────────────────────────────────────────────────┘</span></pre>
              </div>
              {/* MAN PAGE */}
              <div className="term-section" data-lang="en">
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> man terminal-core{"\n"}{"\n"}<span className="accent glow-strong">TERMINAL-CORE(1){"        "}STYLE GUIDE MANUAL{"        "}TERMINAL-CORE(1)</span>{"\n"}{"\n"}<span className="accent">NAME</span>{"\n"}{"       "}terminal-core — phosphor-green CRT design system{"\n"}{"\n"}<span className="accent">SYNOPSIS</span>{"\n"}{"       "}terminal-core [--theme dark-phosphor] [--font mono]{"\n"}{"                     "}[--scanlines on] [--crt-curve subtle]{"\n"}{"\n"}<span className="accent">DESCRIPTION</span>{"\n"}{"       "}A design language inspired by 1980s mainframe terminals,{"\n"}{"       "}MS-DOS command prompts, and early Unix systems. Every{"\n"}{"       "}element is rendered in monospace, green-on-black, with{"\n"}{"       "}authentic CRT scan line overlays and phosphor glow.{"\n"}{"\n"}{"       "}Ideal for developer tools, CLI dashboards, hacker{"\n"}{"       "}aesthetics, and products that value raw functionality{"\n"}{"       "}over decorative polish.{"\n"}{"\n"}<span className="accent">OPTIONS</span>{"\n"}{"       "}--bg #071109{"       "}Deep black-green background{"\n"}{"       "}--ink #b9ffbe{"      "}Phosphor green text{"\n"}{"       "}--line #1e4f22{"     "}Dim green borders{"\n"}{"       "}--soft #0f2512{"     "}Panel surfaces{"\n"}{"       "}--warn #d4ff5c{"     "}Accent / warning yellow-green{"\n"}{"\n"}<span className="accent">FILE TREE</span>{"\n"}{"       "}design-system/{"\n"}{"       "}├── tokens/{"\n"}{"       "}│{"   "}├── colors.token{"\n"}{"       "}│{"   "}├── typography.token{"\n"}{"       "}│{"   "}├── spacing.token{"\n"}{"       "}│{"   "}└── motion.token{"\n"}{"       "}├── components/{"\n"}{"       "}│{"   "}├── terminal-frame.css{"\n"}{"       "}│{"   "}├── command-block.css{"\n"}{"       "}│{"   "}├── status-bar.css{"\n"}{"       "}│{"   "}└── phosphor-text.css{"\n"}{"       "}└── docs/{"\n"}{"           "}├── README.md{"\n"}{"           "}└── CHANGELOG.md{"\n"}{"\n"}<span className="accent">SEE ALSO</span>{"\n"}{"       "}console-launch(1), cyberpunk-glitch(1), neon-drift(1){"\n"}{"\n"}<span className="dim">Phosphor Systems{"          "}v4.2.1{"               "}TERMINAL-CORE(1)</span></pre>
              </div>
              <div className="term-section" data-lang="ko" hidden>
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> man terminal-core{"\n"}{"\n"}<span className="accent glow-strong">TERMINAL-CORE(1){"       "}스타일 가이드 매뉴얼{"       "}TERMINAL-CORE(1)</span>{"\n"}{"\n"}<span className="accent">이름</span>{"\n"}{"       "}terminal-core — 인광 녹색 CRT 디자인 시스템{"\n"}{"\n"}<span className="accent">개요</span>{"\n"}{"       "}terminal-core [--theme dark-phosphor] [--font mono]{"\n"}{"                     "}[--scanlines on] [--crt-curve subtle]{"\n"}{"\n"}<span className="accent">설명</span>{"\n"}{"       "}1980년대 메인프레임 터미널, MS-DOS 커맨드 프롬프트,{"\n"}{"       "}초기 유닉스 시스템에서 영감을 받은 디자인 언어입니다.{"\n"}{"       "}모든 요소를 검은 바탕에 녹색 모노로 그려 내고,{"\n"}{"       "}진짜 CRT 스캔라인과 인광 글로우를 얹습니다.{"\n"}{"\n"}{"       "}개발자 도구, CLI 대시보드, 해커 미학, 장식보다{"\n"}{"       "}순수 기능성을 중시하는 제품에 이상적입니다.{"\n"}{"\n"}<span className="accent">옵션</span>{"\n"}{"       "}--bg #071109{"       "}짙은 흑녹색 배경{"\n"}{"       "}--ink #b9ffbe{"      "}인광 녹색 텍스트{"\n"}{"       "}--line #1e4f22{"     "}어두운 녹색 테두리{"\n"}{"       "}--soft #0f2512{"     "}패널 표면{"\n"}{"       "}--warn #d4ff5c{"     "}강조 / 경고 황녹색{"\n"}{"\n"}<span className="accent">파일 트리</span>{"\n"}{"       "}design-system/{"\n"}{"       "}├── tokens/{"\n"}{"       "}│{"   "}├── colors.token{"\n"}{"       "}│{"   "}├── typography.token{"\n"}{"       "}│{"   "}├── spacing.token{"\n"}{"       "}│{"   "}└── motion.token{"\n"}{"       "}├── components/{"\n"}{"       "}│{"   "}├── terminal-frame.css{"\n"}{"       "}│{"   "}├── command-block.css{"\n"}{"       "}│{"   "}├── status-bar.css{"\n"}{"       "}│{"   "}└── phosphor-text.css{"\n"}{"       "}└── docs/{"\n"}{"           "}├── README.md{"\n"}{"           "}└── CHANGELOG.md{"\n"}{"\n"}<span className="accent">참조</span>{"\n"}{"       "}console-launch(1), cyberpunk-glitch(1), neon-drift(1){"\n"}{"\n"}<span className="dim">Phosphor Systems{"          "}v4.2.1{"               "}TERMINAL-CORE(1)</span></pre>
              </div>
              <div className="term-section" data-lang="ja" hidden>
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> man terminal-core{"\n"}{"\n"}<span className="accent glow-strong">TERMINAL-CORE(1){"      "}スタイルガイドマニュアル{"      "}TERMINAL-CORE(1)</span>{"\n"}{"\n"}<span className="accent">名前</span>{"\n"}{"       "}terminal-core — 蛍光グリーンCRTデザインシステム{"\n"}{"\n"}<span className="accent">概要</span>{"\n"}{"       "}terminal-core [--theme dark-phosphor] [--font mono]{"\n"}{"                     "}[--scanlines on] [--crt-curve subtle]{"\n"}{"\n"}<span className="accent">説明</span>{"\n"}{"       "}1980年代のメインフレーム端末、MS-DOSコマンド{"\n"}{"       "}プロンプト、初期Unixシステムからインスピレーションを{"\n"}{"       "}受けたデザイン言語です。すべての要素をモノスペース、{"\n"}{"       "}グリーン・オン・ブラックで描き、本格的なCRT{"\n"}{"       "}スキャンラインと蛍光グローを重ねます。{"\n"}{"\n"}{"       "}開発者ツール、CLIダッシュボード、ハッカー美学、{"\n"}{"       "}装飾よりも純粋な機能性を重視する製品に最適です。{"\n"}{"\n"}<span className="accent">オプション</span>{"\n"}{"       "}--bg #071109{"       "}深い黒緑の背景{"\n"}{"       "}--ink #b9ffbe{"      "}蛍光グリーンテキスト{"\n"}{"       "}--line #1e4f22{"     "}暗いグリーンの境界線{"\n"}{"       "}--soft #0f2512{"     "}パネル表面{"\n"}{"       "}--warn #d4ff5c{"     "}アクセント / 警告 黄緑{"\n"}{"\n"}<span className="accent">ファイルツリー</span>{"\n"}{"       "}design-system/{"\n"}{"       "}├── tokens/{"\n"}{"       "}│{"   "}├── colors.token{"\n"}{"       "}│{"   "}├── typography.token{"\n"}{"       "}│{"   "}├── spacing.token{"\n"}{"       "}│{"   "}└── motion.token{"\n"}{"       "}├── components/{"\n"}{"       "}│{"   "}├── terminal-frame.css{"\n"}{"       "}│{"   "}├── command-block.css{"\n"}{"       "}│{"   "}├── status-bar.css{"\n"}{"       "}│{"   "}└── phosphor-text.css{"\n"}{"       "}└── docs/{"\n"}{"           "}├── README.md{"\n"}{"           "}└── CHANGELOG.md{"\n"}{"\n"}<span className="accent">参照</span>{"\n"}{"       "}console-launch(1), cyberpunk-glitch(1), neon-drift(1){"\n"}{"\n"}<span className="dim">Phosphor Systems{"          "}v4.2.1{"               "}TERMINAL-CORE(1)</span></pre>
              </div>
              {/* VIM EDITOR VIEW */}
              <div className="term-section" data-lang="en">
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> vim tokens/colors.token{"\n"}{"\n"}<span className="accent">{"  "}1</span> /* ═══════════════════════════════════════{"\n"}<span className="accent">{"  "}2</span>{"  "}* TERMINAL-CORE :: Color Tokens{"\n"}<span className="accent">{"  "}3</span>{"  "}* Last modified: 2026-03-06{"\n"}<span className="accent">{"  "}4</span>{"  "}* ═══════════════════════════════════════ */{"\n"}<span className="accent">{"  "}5</span>{"\n"}<span className="accent">{"  "}6</span> :root {"{"}{"\n"}<span className="accent">{"  "}7</span>{"   "}/* ── Base ── */{"\n"}<span className="accent">{"  "}8</span>{"   "}--bg:{"    "}<span className="accent">#071109</span>;{"\n"}<span className="accent">{"  "}9</span>{"   "}--ink:{"   "}<span className="accent">#b9ffbe</span>;{"\n"}<span className="accent"> 10</span>{"   "}--line:{"  "}<span className="accent">#1e4f22</span>;{"\n"}<span className="accent"> 11</span>{"   "}--soft:{"  "}<span className="accent">#0f2512</span>;{"\n"}<span className="accent"> 12</span>{"   "}--warn:{"  "}<span className="accent">#d4ff5c</span>;{"\n"}<span className="accent"> 13</span>{"\n"}<span className="accent"> 14</span>{"   "}/* ── Derived ── */{"\n"}<span className="accent"> 15</span>{"   "}--surface:{"  "}#08120a;{"\n"}<span className="accent"> 16</span>{"   "}--bar-bg:{"   "}#0a190c;{"\n"}<span className="accent"> 17</span>{"   "}--glow:{"     "}rgba(185,255,190,0.5);{"\n"}<span className="accent"> 18</span>{"   "}--scanline: #061007;{"\n"}<span className="accent"> 19</span> {"}"}{"\n"}<span className="vim-tilde"> 20</span> ~{"\n"}<span className="vim-tilde"> 21</span> ~{"\n"}<span className="vim-tilde"> 22</span> ~</pre>
                <div className="vim-bar">
                  <span>-- INSERT --</span>
                  <span>tokens/colors.token [+] 19L, 412B</span>
                </div>
              </div>
              <div className="term-section" data-lang="ko" hidden>
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> vim tokens/colors.token{"\n"}{"\n"}<span className="accent">{"  "}1</span> /* ═══════════════════════════════════════{"\n"}<span className="accent">{"  "}2</span>{"  "}* TERMINAL-CORE :: 색상 토큰{"\n"}<span className="accent">{"  "}3</span>{"  "}* 최종 수정: 2026-03-06{"\n"}<span className="accent">{"  "}4</span>{"  "}* ═══════════════════════════════════════ */{"\n"}<span className="accent">{"  "}5</span>{"\n"}<span className="accent">{"  "}6</span> :root {"{"}{"\n"}<span className="accent">{"  "}7</span>{"   "}/* ── 기본 ── */{"\n"}<span className="accent">{"  "}8</span>{"   "}--bg:{"    "}<span className="accent">#071109</span>;{"\n"}<span className="accent">{"  "}9</span>{"   "}--ink:{"   "}<span className="accent">#b9ffbe</span>;{"\n"}<span className="accent"> 10</span>{"   "}--line:{"  "}<span className="accent">#1e4f22</span>;{"\n"}<span className="accent"> 11</span>{"   "}--soft:{"  "}<span className="accent">#0f2512</span>;{"\n"}<span className="accent"> 12</span>{"   "}--warn:{"  "}<span className="accent">#d4ff5c</span>;{"\n"}<span className="accent"> 13</span>{"\n"}<span className="accent"> 14</span>{"   "}/* ── 파생 ── */{"\n"}<span className="accent"> 15</span>{"   "}--surface:{"  "}#08120a;{"\n"}<span className="accent"> 16</span>{"   "}--bar-bg:{"   "}#0a190c;{"\n"}<span className="accent"> 17</span>{"   "}--glow:{"     "}rgba(185,255,190,0.5);{"\n"}<span className="accent"> 18</span>{"   "}--scanline: #061007;{"\n"}<span className="accent"> 19</span> {"}"}{"\n"}<span className="vim-tilde"> 20</span> ~{"\n"}<span className="vim-tilde"> 21</span> ~{"\n"}<span className="vim-tilde"> 22</span> ~</pre>
                <div className="vim-bar">
                  <span>-- INSERT --</span>
                  <span>tokens/colors.token [+] 19L, 412B</span>
                </div>
              </div>
              <div className="term-section" data-lang="ja" hidden>
                <pre className="glow"><span className="dim">designer@mainframe:~$</span> vim tokens/colors.token{"\n"}{"\n"}<span className="accent">{"  "}1</span> /* ═══════════════════════════════════════{"\n"}<span className="accent">{"  "}2</span>{"  "}* TERMINAL-CORE :: カラートークン{"\n"}<span className="accent">{"  "}3</span>{"  "}* 最終更新: 2026-03-06{"\n"}<span className="accent">{"  "}4</span>{"  "}* ═══════════════════════════════════════ */{"\n"}<span className="accent">{"  "}5</span>{"\n"}<span className="accent">{"  "}6</span> :root {"{"}{"\n"}<span className="accent">{"  "}7</span>{"   "}/* ── ベース ── */{"\n"}<span className="accent">{"  "}8</span>{"   "}--bg:{"    "}<span className="accent">#071109</span>;{"\n"}<span className="accent">{"  "}9</span>{"   "}--ink:{"   "}<span className="accent">#b9ffbe</span>;{"\n"}<span className="accent"> 10</span>{"   "}--line:{"  "}<span className="accent">#1e4f22</span>;{"\n"}<span className="accent"> 11</span>{"   "}--soft:{"  "}<span className="accent">#0f2512</span>;{"\n"}<span className="accent"> 12</span>{"   "}--warn:{"  "}<span className="accent">#d4ff5c</span>;{"\n"}<span className="accent"> 13</span>{"\n"}<span className="accent"> 14</span>{"   "}/* ── 派生 ── */{"\n"}<span className="accent"> 15</span>{"   "}--surface:{"  "}#08120a;{"\n"}<span className="accent"> 16</span>{"   "}--bar-bg:{"   "}#0a190c;{"\n"}<span className="accent"> 17</span>{"   "}--glow:{"     "}rgba(185,255,190,0.5);{"\n"}<span className="accent"> 18</span>{"   "}--scanline: #061007;{"\n"}<span className="accent"> 19</span> {"}"}{"\n"}<span className="vim-tilde"> 20</span> ~{"\n"}<span className="vim-tilde"> 21</span> ~{"\n"}<span className="vim-tilde"> 22</span> ~</pre>
                <div className="vim-bar">
                  <span>-- INSERT --</span>
                  <span>tokens/colors.token [+] 19L, 412B</span>
                </div>
              </div>
              {/* FINAL PROMPT LINE WITH BLINKING CURSOR */}
              <div className="term-section">
                <pre className="glow glow-strong"><span className="dim">designer@mainframe:~$</span> <span className="cursor" /></pre>
              </div>
            </div>
          </section>
          {/* ============================================
              EXTENDED COMPONENT SHOWCASE
              ============================================ */}

          {/* Phosphor Buttons */}
          <div className="term-section-block" data-tag="[ COMPONENT/BTN ]">
            <h3 className="term-h" data-lang="en">phosphor buttons</h3>
            <h3 className="term-h" data-lang="ko" hidden>phosphor buttons</h3>
            <h3 className="term-h" data-lang="ja" hidden>phosphor buttons</h3>
            <p className="term-sub" data-lang="en">6 variants — primary, ghost, danger, blinking, icon, with hotkey</p>
            <p className="term-sub" data-lang="ko" hidden>6가지 변형 — primary · ghost · danger · 깜빡임 · 아이콘 · 핫키 포함</p>
            <p className="term-sub" data-lang="ja" hidden>6つのバリアント — primary · ghost · danger · 点滅 · アイコン · ホットキー付き</p>
            <div className="term-btn-rack">
              <button type="button" className="term-btn term-btn--primary">
                <span data-lang="en">[F1] EXEC RUN</span>
                <span data-lang="ko" hidden>[F1] 실행</span>
                <span data-lang="ja" hidden>[F1] 実行</span>
              </button>
              <button type="button" className="term-btn">
                <span data-lang="en">[ENTER] CONFIRM</span>
                <span data-lang="ko" hidden>[ENTER] 확인</span>
                <span data-lang="ja" hidden>[ENTER] 確定</span>
              </button>
              <button type="button" className="term-btn term-btn--ghost">
                <span data-lang="en">SHOW LOG</span>
                <span data-lang="ko" hidden>로그 표시</span>
                <span data-lang="ja" hidden>ログ表示</span>
                <span className="kbd">L</span>
              </button>
              <button type="button" className="term-btn term-btn--danger">
                <span data-lang="en">[Ctrl+C] ABORT</span>
                <span data-lang="ko" hidden>[Ctrl+C] 중단</span>
                <span data-lang="ja" hidden>[Ctrl+C] 中断</span>
              </button>
              <button type="button" className="term-btn term-btn--blink">
                <span data-lang="en">awaiting input</span>
                <span data-lang="ko" hidden>입력 대기 중</span>
                <span data-lang="ja" hidden>入力待機中</span>
              </button>
              <button type="button" className="term-btn term-btn--icon" aria-label="Settings">⚙</button>
            </div>
          </div>

          {/* Stats */}
          <div className="term-section-block" data-tag="[ COMPONENT/STAT ]">
            <h3 className="term-h" data-lang="en">design system metrics</h3>
            <h3 className="term-h" data-lang="ko" hidden>design system metrics</h3>
            <h3 className="term-h" data-lang="ja" hidden>design system metrics</h3>
            <p className="term-sub" data-lang="en">4 cards — uptime, coverage, build time, contributors</p>
            <p className="term-sub" data-lang="ko" hidden>카드 4개 — 가동률 · 커버리지 · 빌드 시간 · 기여자</p>
            <p className="term-sub" data-lang="ja" hidden>4枚 — 稼働率 · カバレッジ · ビルド時間 · 貢献者</p>
            <div className="term-stats">
              <div className="term-stat">
                <div className="term-stat__label" data-lang="en">UPTIME</div>
                <div className="term-stat__label" data-lang="ko" hidden>가동률</div>
                <div className="term-stat__label" data-lang="ja" hidden>稼働率</div>
                <div className="term-stat__value">847<small>d</small></div>
                <div className="term-stat__delta">▲ no crashes since boot</div>
                <div className="term-stat__bar"><i style={{width: '99%'}} /></div>
              </div>
              <div className="term-stat">
                <div className="term-stat__label" data-lang="en">TOKEN COV</div>
                <div className="term-stat__label" data-lang="ko" hidden>토큰 커버리지</div>
                <div className="term-stat__label" data-lang="ja" hidden>トークンカバー</div>
                <div className="term-stat__value">94<small>%</small></div>
                <div className="term-stat__delta">▲ 6 pts this sprint</div>
                <div className="term-stat__bar"><i style={{width: '94%'}} /></div>
              </div>
              <div className="term-stat">
                <div className="term-stat__label" data-lang="en">BUILD TIME</div>
                <div className="term-stat__label" data-lang="ko" hidden>빌드 시간</div>
                <div className="term-stat__label" data-lang="ja" hidden>ビルド時間</div>
                <div className="term-stat__value">12.4<small>s</small></div>
                <div className="term-stat__delta stat-card__delta--down">▼ 2.1s faster</div>
                <div className="term-stat__bar"><i style={{width: '38%'}} /></div>
              </div>
              <div className="term-stat">
                <div className="term-stat__label" data-lang="en">CONTRIBUTORS</div>
                <div className="term-stat__label" data-lang="ko" hidden>기여자</div>
                <div className="term-stat__label" data-lang="ja" hidden>貢献者</div>
                <div className="term-stat__value">28</div>
                <div className="term-stat__delta">▲ +3 this month</div>
                <div className="term-stat__bar"><i style={{width: '72%'}} /></div>
              </div>
            </div>
          </div>

          {/* Form Lab */}
          <div className="term-section-block" data-tag="[ COMPONENT/FORM ]">
            <h3 className="term-h" data-lang="en">input form lab</h3>
            <h3 className="term-h" data-lang="ko" hidden>input form lab</h3>
            <h3 className="term-h" data-lang="ja" hidden>input form lab</h3>
            <p className="term-sub" data-lang="en">prompt-prefixed inputs · select · check · radio · toggle · slider</p>
            <p className="term-sub" data-lang="ko" hidden>프롬프트 접두 입력 · 셀렉트 · 체크 · 라디오 · 토글 · 슬라이더</p>
            <p className="term-sub" data-lang="ja" hidden>プロンプト接頭入力 · セレクト · チェック · ラジオ · トグル · スライダー</p>
            <div className="term-form">
              <div className="term-field">
                <span className="term-field__label" data-lang="en">hostname</span>
                <span className="term-field__label" data-lang="ko" hidden>호스트명</span>
                <span className="term-field__label" data-lang="ja" hidden>ホスト名</span>
                <label className="term-input"><input type="text" defaultValue="mainframe.local" /></label>
              </div>
              <div className="term-field">
                <span className="term-field__label" data-lang="en">search logs</span>
                <span className="term-field__label" data-lang="ko" hidden>로그 검색</span>
                <span className="term-field__label" data-lang="ja" hidden>ログ検索</span>
                <label className="term-input"><input type="text" placeholder="grep -i 'token'" /></label>
              </div>
              <div className="term-field">
                <span className="term-field__label" data-lang="en">log verbosity</span>
                <span className="term-field__label" data-lang="ko" hidden>로그 상세도</span>
                <span className="term-field__label" data-lang="ja" hidden>ログ詳細度</span>
                <select className="term-select" defaultValue="info">
                  <option value="silent">silent</option>
                  <option value="info">info</option>
                  <option value="debug">debug</option>
                  <option value="trace">trace</option>
                </select>
              </div>
              <div className="term-field">
                <span className="term-field__label" data-lang="en">flags</span>
                <span className="term-field__label" data-lang="ko" hidden>플래그</span>
                <span className="term-field__label" data-lang="ja" hidden>フラグ</span>
                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                  <span className="term-check on"><span className="term-check__box" /><span data-lang="en">--verbose</span><span data-lang="ko" hidden>--verbose</span><span data-lang="ja" hidden>--verbose</span></span>
                  <span className="term-check on"><span className="term-check__box" /><span>--respect-no-color</span></span>
                  <span className="term-check"><span className="term-check__box" /><span>--strict-mode</span></span>
                </div>
              </div>
              <div className="term-field">
                <span className="term-field__label" data-lang="en">render target</span>
                <span className="term-field__label" data-lang="ko" hidden>렌더 타겟</span>
                <span className="term-field__label" data-lang="ja" hidden>レンダーターゲット</span>
                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                  <span className="term-radio on"><span className="term-radio__circle" /><span data-lang="en">crt-phosphor (default)</span><span data-lang="ko" hidden>crt-phosphor (기본)</span><span data-lang="ja" hidden>crt-phosphor (デフォルト)</span></span>
                  <span className="term-radio"><span className="term-radio__circle" /><span data-lang="en">flat-mono</span><span data-lang="ko" hidden>flat-mono</span><span data-lang="ja" hidden>flat-mono</span></span>
                  <span className="term-radio"><span className="term-radio__circle" /><span>amber-vintage</span></span>
                </div>
              </div>
              <div className="term-field">
                <span className="term-field__label" data-lang="en">switches · slider</span>
                <span className="term-field__label" data-lang="ko" hidden>스위치 · 슬라이더</span>
                <span className="term-field__label" data-lang="ja" hidden>スイッチ · スライダー</span>
                <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                  <span className="term-toggle on"><span className="term-toggle__bar" /><span data-lang="en">scanlines</span><span data-lang="ko" hidden>스캔라인</span><span data-lang="ja" hidden>スキャンライン</span></span>
                  <span className="term-toggle"><span className="term-toggle__bar" /><span data-lang="en">crt-curve</span><span data-lang="ko" hidden>CRT 곡률</span><span data-lang="ja" hidden>CRT 湾曲</span></span>
                  <div>
                    <div className="term-slider"><div className="term-slider__track"><div className="term-slider__fill" /><div className="term-slider__thumb" /></div></div>
                    <div className="term-slider__hint"><span data-lang="en">glow intensity</span><span data-lang="ko" hidden>글로우 강도</span><span data-lang="ja" hidden>グロー強度</span><span>0.60</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Process Table */}
          <div className="term-section-block" data-tag="[ COMPONENT/PROCS ]">
            <h3 className="term-h" data-lang="en">ps aux — running processes</h3>
            <h3 className="term-h" data-lang="ko" hidden>ps aux — 실행 중인 프로세스</h3>
            <h3 className="term-h" data-lang="ja" hidden>ps aux — 実行中のプロセス</h3>
            <p className="term-sub" data-lang="en">design-system daemons, last refreshed: 09:42:13</p>
            <p className="term-sub" data-lang="ko" hidden>디자인 시스템 데몬, 최근 갱신: 09:42:13</p>
            <p className="term-sub" data-lang="ja" hidden>デザインシステムデーモン、最終更新: 09:42:13</p>
            <div style={{overflowX: 'auto'}}>
              <table className="term-table">
                <thead>
                  <tr>
                    <th>PID</th>
                    <th>USER</th>
                    <th>CPU</th>
                    <th>MEM</th>
                    <th data-lang="en">COMMAND</th>
                    <th data-lang="ko" hidden>커맨드</th>
                    <th data-lang="ja" hidden>コマンド</th>
                    <th data-lang="en">STATUS</th>
                    <th data-lang="ko" hidden>상태</th>
                    <th data-lang="ja" hidden>状態</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>0x1F3A</td><td>designer</td><td>3.2%</td><td>12MB</td><td>./token-watcher --hot</td><td><span className="pill-status pill-status--run" data-lang="en">RUN</span><span className="pill-status pill-status--run" data-lang="ko" hidden>실행</span><span className="pill-status pill-status--run" data-lang="ja" hidden>実行</span></td></tr>
                  <tr><td>0x2C04</td><td>designer</td><td>0.8%</td><td>4MB</td><td>./contrast-audit</td><td><span className="pill-status pill-status--run" data-lang="en">RUN</span><span className="pill-status pill-status--run" data-lang="ko" hidden>실행</span><span className="pill-status pill-status--run" data-lang="ja" hidden>実行</span></td></tr>
                  <tr><td>0x4A11</td><td>root</td><td>0.0%</td><td>8MB</td><td>vim tokens/colors.token</td><td><span className="pill-status pill-status--wait" data-lang="en">WAIT</span><span className="pill-status pill-status--wait" data-lang="ko" hidden>대기</span><span className="pill-status pill-status--wait" data-lang="ja" hidden>待機</span></td></tr>
                  <tr><td>0x5B27</td><td>designer</td><td>0.0%</td><td>2MB</td><td>tail -f /var/log/audit</td><td><span className="pill-status pill-status--idle" data-lang="en">IDLE</span><span className="pill-status pill-status--idle" data-lang="ko" hidden>유휴</span><span className="pill-status pill-status--idle" data-lang="ja" hidden>アイドル</span></td></tr>
                  <tr><td>0x71F0</td><td>cron</td><td>0.1%</td><td>1MB</td><td>weekly-snapshot.sh</td><td><span className="pill-status pill-status--idle" data-lang="en">IDLE</span><span className="pill-status pill-status--idle" data-lang="ko" hidden>유휴</span><span className="pill-status pill-status--idle" data-lang="ja" hidden>アイドル</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Badges */}
          <div className="term-section-block" data-tag="[ COMPONENT/BADGE ]">
            <h3 className="term-h" data-lang="en">status badges</h3>
            <h3 className="term-h" data-lang="ko" hidden>status badges</h3>
            <h3 className="term-h" data-lang="ja" hidden>status badges</h3>
            <p className="term-sub" data-lang="en">solid · outline · ghost · danger · blinking signal</p>
            <p className="term-sub" data-lang="ko" hidden>solid · outline · ghost · danger · 깜빡임 시그널</p>
            <p className="term-sub" data-lang="ja" hidden>solid · outline · ghost · danger · 点滅シグナル</p>
            <div className="term-badges">
              <span className="term-badge term-badge--solid">v4.2.1</span>
              <span className="term-badge term-badge--blink" data-lang="en">live</span>
              <span className="term-badge term-badge--blink" data-lang="ko" hidden>실시간</span>
              <span className="term-badge term-badge--blink" data-lang="ja" hidden>ライブ</span>
              <span className="term-badge term-badge--outline" data-lang="en">stable</span>
              <span className="term-badge term-badge--outline" data-lang="ko" hidden>안정</span>
              <span className="term-badge term-badge--outline" data-lang="ja" hidden>安定</span>
              <span className="term-badge term-badge--ghost">a11y · AAA</span>
              <span className="term-badge term-badge--outline">tty 80x24</span>
              <span className="term-badge term-badge--danger" data-lang="en">DEPRECATED</span>
              <span className="term-badge term-badge--danger" data-lang="ko" hidden>지원 종료</span>
              <span className="term-badge term-badge--danger" data-lang="ja" hidden>非推奨</span>
              <span className="term-badge term-badge--solid" data-lang="en">PHOSPHOR</span>
              <span className="term-badge term-badge--solid" data-lang="ko" hidden>인광</span>
              <span className="term-badge term-badge--solid" data-lang="ja" hidden>蛍光</span>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="term-section-block" data-tag="[ COMPONENT/KBD ]">
            <h3 className="term-h" data-lang="en">keyboard shortcuts</h3>
            <h3 className="term-h" data-lang="ko" hidden>keyboard shortcuts</h3>
            <h3 className="term-h" data-lang="ja" hidden>keyboard shortcuts</h3>
            <p className="term-sub" data-lang="en">cheatsheet · 8 essential bindings</p>
            <p className="term-sub" data-lang="ko" hidden>치트시트 · 핵심 단축키 8개</p>
            <p className="term-sub" data-lang="ja" hidden>チートシート · 必須キー8つ</p>
            <div className="term-shortcuts">
              <div className="term-shortcut">
                <span className="term-shortcut__label" data-lang="en">open palette</span>
                <span className="term-shortcut__label" data-lang="ko" hidden>팔레트 열기</span>
                <span className="term-shortcut__label" data-lang="ja" hidden>パレットを開く</span>
                <span className="term-shortcut__keys"><kbd>⌘</kbd><span>+</span><kbd>K</kbd></span>
              </div>
              <div className="term-shortcut">
                <span className="term-shortcut__label" data-lang="en">run audit</span>
                <span className="term-shortcut__label" data-lang="ko" hidden>감사 실행</span>
                <span className="term-shortcut__label" data-lang="ja" hidden>監査実行</span>
                <span className="term-shortcut__keys"><kbd>⌘</kbd><span>+</span><kbd>R</kbd></span>
              </div>
              <div className="term-shortcut">
                <span className="term-shortcut__label" data-lang="en">toggle scanlines</span>
                <span className="term-shortcut__label" data-lang="ko" hidden>스캔라인 토글</span>
                <span className="term-shortcut__label" data-lang="ja" hidden>スキャンライン切替</span>
                <span className="term-shortcut__keys"><kbd>⌥</kbd><span>+</span><kbd>S</kbd></span>
              </div>
              <div className="term-shortcut">
                <span className="term-shortcut__label" data-lang="en">next tab</span>
                <span className="term-shortcut__label" data-lang="ko" hidden>다음 탭</span>
                <span className="term-shortcut__label" data-lang="ja" hidden>次のタブ</span>
                <span className="term-shortcut__keys"><kbd>⌃</kbd><span>+</span><kbd>Tab</kbd></span>
              </div>
              <div className="term-shortcut">
                <span className="term-shortcut__label" data-lang="en">copy token</span>
                <span className="term-shortcut__label" data-lang="ko" hidden>토큰 복사</span>
                <span className="term-shortcut__label" data-lang="ja" hidden>トークンコピー</span>
                <span className="term-shortcut__keys"><kbd>⌘</kbd><span>+</span><kbd>⇧</kbd><span>+</span><kbd>C</kbd></span>
              </div>
              <div className="term-shortcut">
                <span className="term-shortcut__label" data-lang="en">abort task</span>
                <span className="term-shortcut__label" data-lang="ko" hidden>작업 중단</span>
                <span className="term-shortcut__label" data-lang="ja" hidden>タスク中断</span>
                <span className="term-shortcut__keys"><kbd>⌃</kbd><span>+</span><kbd>C</kbd></span>
              </div>
              <div className="term-shortcut">
                <span className="term-shortcut__label" data-lang="en">show help</span>
                <span className="term-shortcut__label" data-lang="ko" hidden>도움말</span>
                <span className="term-shortcut__label" data-lang="ja" hidden>ヘルプ表示</span>
                <span className="term-shortcut__keys"><kbd>?</kbd></span>
              </div>
              <div className="term-shortcut">
                <span className="term-shortcut__label" data-lang="en">quit session</span>
                <span className="term-shortcut__label" data-lang="ko" hidden>세션 종료</span>
                <span className="term-shortcut__label" data-lang="ja" hidden>セッション終了</span>
                <span className="term-shortcut__keys"><kbd>:q</kbd></span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="term-section-block" data-tag="[ COMPONENT/TABS ]">
            <h3 className="term-h" data-lang="en">tmux-style tabs</h3>
            <h3 className="term-h" data-lang="ko" hidden>tmux-style tabs</h3>
            <h3 className="term-h" data-lang="ja" hidden>tmux-style tabs</h3>
            <p className="term-sub" data-lang="en">multiplex your context — bracketed indicators</p>
            <p className="term-sub" data-lang="ko" hidden>컨텍스트 멀티플렉싱 — 대괄호 표시</p>
            <p className="term-sub" data-lang="ja" hidden>コンテキストを多重化 — 角括弧インジケータ</p>
            <div className="term-tabs">
              <button type="button" className="active" data-lang="en">tokens</button>
              <button type="button" className="active" data-lang="ko" hidden>토큰</button>
              <button type="button" className="active" data-lang="ja" hidden>トークン</button>
              <button type="button" data-lang="en">components</button>
              <button type="button" data-lang="ko" hidden>컴포넌트</button>
              <button type="button" data-lang="ja" hidden>コンポーネント</button>
              <button type="button" data-lang="en">audit</button>
              <button type="button" data-lang="ko" hidden>감사</button>
              <button type="button" data-lang="ja" hidden>監査</button>
              <button type="button">docs</button>
              <button type="button">README.md</button>
            </div>
            <div className="term-tab-content">
              <p data-lang="en"><span className="cmd">$ cat tokens/colors.token</span></p>
              <p data-lang="ko" hidden><span className="cmd">$ cat tokens/colors.token</span></p>
              <p data-lang="ja" hidden><span className="cmd">$ cat tokens/colors.token</span></p>
              <p data-lang="en">// 47 tokens · 6 categories · last sync 12s ago</p>
              <p data-lang="ko" hidden>// 토큰 47개 · 카테고리 6개 · 마지막 동기화 12초 전</p>
              <p data-lang="ja" hidden>// 47トークン · 6カテゴリ · 最終同期 12秒前</p>
              <p data-lang="en">Categories: base · derived · semantic · component · motion · type</p>
              <p data-lang="ko" hidden>카테고리: base · derived · semantic · component · motion · type</p>
              <p data-lang="ja" hidden>カテゴリ: base · derived · semantic · component · motion · type</p>
            </div>
          </div>

          {/* Network Monitor + Log Feed */}
          <div className="term-section-block" data-tag="[ COMPONENT/MON ]">
            <h3 className="term-h" data-lang="en">network + log monitor</h3>
            <h3 className="term-h" data-lang="ko" hidden>network + log monitor</h3>
            <h3 className="term-h" data-lang="ja" hidden>network + log monitor</h3>
            <p className="term-sub" data-lang="en">live RX/TX bars + ring buffer log</p>
            <p className="term-sub" data-lang="ko" hidden>실시간 RX/TX 바 + 링 버퍼 로그</p>
            <p className="term-sub" data-lang="ja" hidden>ライブRX/TXバー + リングバッファログ</p>
            <div className="net-grid">
              <div className="net-panel">
                <div className="net-panel__head"><span data-lang="en">RX · INBOUND</span><span data-lang="ko" hidden>RX · 수신</span><span data-lang="ja" hidden>RX · 受信</span><span>4.2 MB/s</span></div>
                <div className="net-bars" aria-hidden="true">
                  {[0,0.1,0.2,0.3,0.15,0.25,0.4,0.3,0.45,0.2,0.1,0.35,0.4,0.5,0.25,0.15,0.3].map((d, i) => (
                    <span key={i} style={{animationDelay: `${d}s`}} />
                  ))}
                </div>
              </div>
              <div className="net-panel">
                <div className="net-panel__head"><span data-lang="en">TX · OUTBOUND</span><span data-lang="ko" hidden>TX · 송신</span><span data-lang="ja" hidden>TX · 送信</span><span>1.8 MB/s</span></div>
                <div className="net-bars" aria-hidden="true">
                  {[0.05,0.15,0.25,0.1,0.35,0.2,0.4,0.15,0.3,0.45,0.25,0.5,0.15,0.3,0.4,0.2,0.1].map((d, i) => (
                    <span key={i} style={{animationDelay: `${d}s`}} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{height: 14}} />
            <div className="log-feed">
              <div className="log-line"><span className="log-time">09:41:22</span><span className="log-level log-level--info">INFO</span><span className="log-msg" data-lang="en">session started for user `designer`</span><span className="log-msg" data-lang="ko" hidden>사용자 `designer` 세션 시작</span><span className="log-msg" data-lang="ja" hidden>ユーザー `designer` のセッションを開始</span></div>
              <div className="log-line"><span className="log-time">09:41:24</span><span className="log-level log-level--ok">OK</span><span className="log-msg" data-lang="en">token-watcher ready · 47 tokens loaded</span><span className="log-msg" data-lang="ko" hidden>token-watcher 준비 완료 · 토큰 47개 로드</span><span className="log-msg" data-lang="ja" hidden>token-watcher 準備完了 · 47トークン読込</span></div>
              <div className="log-line"><span className="log-time">09:42:01</span><span className="log-level log-level--ok">OK</span><span className="log-msg" data-lang="en">contrast-audit pass — all components AA</span><span className="log-msg" data-lang="ko" hidden>contrast-audit 통과 — 모든 컴포넌트 AA</span><span className="log-msg" data-lang="ja" hidden>contrast-audit 合格 — 全コンポーネント AA</span></div>
              <div className="log-line"><span className="log-time">09:42:05</span><span className="log-level log-level--warn">WARN</span><span className="log-msg" data-lang="en">deprecated import in `legacy/Button.tsx:12`</span><span className="log-msg" data-lang="ko" hidden>`legacy/Button.tsx:12`에 사용 중단된 import</span><span className="log-msg" data-lang="ja" hidden>`legacy/Button.tsx:12` に非推奨インポート</span></div>
              <div className="log-line"><span className="log-time">09:42:13</span><span className="log-level log-level--info">INFO</span><span className="log-msg" data-lang="en">peer connected · 10.0.0.4 → mainframe</span><span className="log-msg" data-lang="ko" hidden>피어 연결 · 10.0.0.4 → mainframe</span><span className="log-msg" data-lang="ja" hidden>ピア接続 · 10.0.0.4 → mainframe</span></div>
              <div className="log-line"><span className="log-time">09:42:21</span><span className="log-level log-level--err">ERR</span><span className="log-msg" data-lang="en">token clash detected → `colors.token:9` vs `themes/dim.token:4`</span><span className="log-msg" data-lang="ko" hidden>토큰 충돌 감지 → `colors.token:9` vs `themes/dim.token:4`</span><span className="log-msg" data-lang="ja" hidden>トークン衝突検出 → `colors.token:9` vs `themes/dim.token:4`</span></div>
              <div className="log-line"><span className="log-time">09:42:34</span><span className="log-level log-level--ok">OK</span><span className="log-msg" data-lang="en">build complete · 12.4s · 1.2 MB output</span><span className="log-msg" data-lang="ko" hidden>빌드 완료 · 12.4초 · 1.2MB 출력</span><span className="log-msg" data-lang="ja" hidden>ビルド完了 · 12.4秒 · 1.2MB 出力</span></div>
            </div>
          </div>

          {/* Plan Tiers */}
          <div className="term-section-block" data-tag="[ COMPONENT/PLAN ]">
            <h3 className="term-h" data-lang="en">subscription tiers</h3>
            <h3 className="term-h" data-lang="ko" hidden>subscription tiers</h3>
            <h3 className="term-h" data-lang="ja" hidden>subscription tiers</h3>
            <p className="term-sub" data-lang="en">3 plans — choose your access level</p>
            <p className="term-sub" data-lang="ko" hidden>플랜 3가지 — 접근 등급 선택</p>
            <p className="term-sub" data-lang="ja" hidden>3プラン — アクセスレベルを選択</p>
            <div className="plan-grid">
              <div className="plan-card">
                <div className="plan-card__name">GUEST</div>
                <div className="plan-card__price">$0<small> / mo</small></div>
                <div className="plan-card__cap" data-lang="en">read-only access · 1 session</div>
                <div className="plan-card__cap" data-lang="ko" hidden>읽기 전용 · 세션 1개</div>
                <div className="plan-card__cap" data-lang="ja" hidden>読み取り専用 · 1セッション</div>
                <ul>
                  <li data-lang="en">view all tokens</li>
                  <li data-lang="ko" hidden>모든 토큰 보기</li>
                  <li data-lang="ja" hidden>全トークン閲覧</li>
                  <li data-lang="en">read-only audit log</li>
                  <li data-lang="ko" hidden>읽기 전용 감사 로그</li>
                  <li data-lang="ja" hidden>読み取り専用監査ログ</li>
                  <li className="off" data-lang="en">no exec privileges</li>
                  <li className="off" data-lang="ko" hidden>실행 권한 없음</li>
                  <li className="off" data-lang="ja" hidden>実行権限なし</li>
                </ul>
                <button type="button" className="plan-card__btn" data-lang="en">$ login --guest</button>
                <button type="button" className="plan-card__btn" data-lang="ko" hidden>$ login --guest</button>
                <button type="button" className="plan-card__btn" data-lang="ja" hidden>$ login --guest</button>
              </div>
              <div className="plan-card plan-card--featured">
                <div className="plan-card__name">OPERATOR</div>
                <div className="plan-card__price">$24<small> / mo</small></div>
                <div className="plan-card__cap" data-lang="en">full shell · 4 sessions · audit write</div>
                <div className="plan-card__cap" data-lang="ko" hidden>풀 셸 · 세션 4개 · 감사 쓰기</div>
                <div className="plan-card__cap" data-lang="ja" hidden>フルシェル · 4セッション · 監査書込</div>
                <ul>
                  <li data-lang="en">all GUEST features</li>
                  <li data-lang="ko" hidden>GUEST 전체 기능</li>
                  <li data-lang="ja" hidden>GUEST全機能</li>
                  <li data-lang="en">write/edit tokens</li>
                  <li data-lang="ko" hidden>토큰 쓰기/편집</li>
                  <li data-lang="ja" hidden>トークン書込/編集</li>
                  <li data-lang="en">run audits · ./run-audit.sh</li>
                  <li data-lang="ko" hidden>감사 실행 · ./run-audit.sh</li>
                  <li data-lang="ja" hidden>監査実行 · ./run-audit.sh</li>
                  <li data-lang="en">SSH tunnel access</li>
                  <li data-lang="ko" hidden>SSH 터널 접근</li>
                  <li data-lang="ja" hidden>SSHトンネルアクセス</li>
                </ul>
                <button type="button" className="plan-card__btn" data-lang="en">$ sudo upgrade</button>
                <button type="button" className="plan-card__btn" data-lang="ko" hidden>$ sudo upgrade</button>
                <button type="button" className="plan-card__btn" data-lang="ja" hidden>$ sudo upgrade</button>
              </div>
              <div className="plan-card">
                <div className="plan-card__name">SYSADMIN</div>
                <div className="plan-card__price">$96<small> / mo</small></div>
                <div className="plan-card__cap" data-lang="en">root access · unlimited mainframes</div>
                <div className="plan-card__cap" data-lang="ko" hidden>루트 권한 · 무제한 메인프레임</div>
                <div className="plan-card__cap" data-lang="ja" hidden>root権限 · 無制限メインフレーム</div>
                <ul>
                  <li data-lang="en">all OPERATOR features</li>
                  <li data-lang="ko" hidden>OPERATOR 전체 기능</li>
                  <li data-lang="ja" hidden>OPERATOR全機能</li>
                  <li data-lang="en">root shell · /etc write</li>
                  <li data-lang="ko" hidden>루트 셸 · /etc 쓰기</li>
                  <li data-lang="ja" hidden>rootシェル · /etc書込</li>
                  <li data-lang="en">cron + scheduled tasks</li>
                  <li data-lang="ko" hidden>cron + 예약 작업</li>
                  <li data-lang="ja" hidden>cron + スケジュールタスク</li>
                  <li data-lang="en">priority phosphor support</li>
                  <li data-lang="ko" hidden>우선 인광 지원</li>
                  <li data-lang="ja" hidden>優先蛍光サポート</li>
                </ul>
                <button type="button" className="plan-card__btn" data-lang="en">$ contact ops</button>
                <button type="button" className="plan-card__btn" data-lang="ko" hidden>$ contact ops</button>
                <button type="button" className="plan-card__btn" data-lang="ja" hidden>$ contact ops</button>
              </div>
            </div>
          </div>

          {/* Changelog */}
          <div className="term-section-block" data-tag="[ COMPONENT/CHANGELOG ]">
            <h3 className="term-h" data-lang="en">CHANGELOG.md</h3>
            <h3 className="term-h" data-lang="ko" hidden>CHANGELOG.md</h3>
            <h3 className="term-h" data-lang="ja" hidden>CHANGELOG.md</h3>
            <p className="term-sub" data-lang="en">version history — 4 entries · live marker on current</p>
            <p className="term-sub" data-lang="ko" hidden>버전 히스토리 — 항목 4개 · 현재 버전에 라이브 마커</p>
            <p className="term-sub" data-lang="ja" hidden>バージョン履歴 — 4件 · 現バージョンにライブマーカー</p>
            <div className="changelog">
              <div className="changelog-entry">
                <div className="changelog-entry__date">v4.0.0<small>2025-09-12</small></div>
                <div>
                  <div className="changelog-entry__title" data-lang="en">phosphor engine rewrite</div>
                  <div className="changelog-entry__title" data-lang="ko" hidden>인광 엔진 재작성</div>
                  <div className="changelog-entry__title" data-lang="ja" hidden>蛍光エンジン書き直し</div>
                  <div className="changelog-entry__body" data-lang="en">authentic CRT scan lines · prefers-reduced-motion respected · 12 KB runtime</div>
                  <div className="changelog-entry__body" data-lang="ko" hidden>정통 CRT 스캔라인 · prefers-reduced-motion 존중 · 12KB 런타임</div>
                  <div className="changelog-entry__body" data-lang="ja" hidden>本格的なCRTスキャンライン · prefers-reduced-motion 尊重 · 12KBランタイム</div>
                </div>
              </div>
              <div className="changelog-entry">
                <div className="changelog-entry__date">v4.1.5<small>2026-01-20</small></div>
                <div>
                  <div className="changelog-entry__title" data-lang="en">amber-vintage theme</div>
                  <div className="changelog-entry__title" data-lang="ko" hidden>amber-vintage 테마</div>
                  <div className="changelog-entry__title" data-lang="ja" hidden>amber-vintage テーマ</div>
                  <div className="changelog-entry__body" data-lang="en">monochrome amber-on-black variant for 1970s minicomputer feel</div>
                  <div className="changelog-entry__body" data-lang="ko" hidden>검은 바탕에 단색 amber로 1970년대 미니컴퓨터 느낌을 내는 변형</div>
                  <div className="changelog-entry__body" data-lang="ja" hidden>黒地に単色アンバー。1970年代のミニコンピュータの趣を再現したバリアント</div>
                </div>
              </div>
              <div className="changelog-entry changelog-entry--live">
                <div className="changelog-entry__date">v4.2.1<small>2026-03-06 · now</small></div>
                <div>
                  <div className="changelog-entry__title" data-lang="en">component library expansion</div>
                  <div className="changelog-entry__title" data-lang="ko" hidden>컴포넌트 라이브러리 확장</div>
                  <div className="changelog-entry__title" data-lang="ja" hidden>コンポーネントライブラリ拡張</div>
                  <div className="changelog-entry__body" data-lang="en">buttons, forms, tables, badges, kbd shortcuts, tabs, net monitor, plans, changelog · ascii-bracketed visual language throughout</div>
                  <div className="changelog-entry__body" data-lang="ko" hidden>버튼, 폼, 테이블, 배지, kbd 단축키, 탭, 네트워크 모니터, 플랜, 체인지로그 · 전반에 ASCII 대괄호 비주얼 언어</div>
                  <div className="changelog-entry__body" data-lang="ja" hidden>ボタン、フォーム、テーブル、バッジ、kbdショートカット、タブ、ネットモニター、プラン、チェンジログ · 全体にASCII角括弧ビジュアル言語</div>
                </div>
              </div>
              <div className="changelog-entry">
                <div className="changelog-entry__date">v5.0.0<small>2026-Q4 · planned</small></div>
                <div>
                  <div className="changelog-entry__title" data-lang="en">[planned] tty-bridge</div>
                  <div className="changelog-entry__title" data-lang="ko" hidden>[예정] tty-bridge</div>
                  <div className="changelog-entry__title" data-lang="ja" hidden>[予定] tty-bridge</div>
                  <div className="changelog-entry__body" data-lang="en">native terminal output mirror for shell-first design reviews</div>
                  <div className="changelog-entry__body" data-lang="ko" hidden>셸 우선 디자인 리뷰용 네이티브 터미널 출력 미러</div>
                  <div className="changelog-entry__body" data-lang="ja" hidden>シェルファーストデザインレビュー用のネイティブターミナル出力ミラー</div>
                </div>
              </div>
            </div>
          </div>

          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Terminal Core style — CRT-green monospace interface with scanline texture and command-log narrative.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #071109{"\n"}--panel: #0f2512{"\n"}--surface: #08120a{"\n"}--border: #1e4f22{"\n"}--text: #b9ffbe{"\n"}--accent-1: #d4ff5c{"\n"}--bar-bg: #0a190c{"\n"}Scanline pattern: repeating-linear-gradient(180deg, #061007 0, #061007 2px, #071109 2px, #071109 4px).{"\n"}No other colors.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Heading: "JetBrains Mono" 800{"\n"}Body: "JetBrains Mono" 400{"\n"}Scale: clamp(1.8rem, 5vw, 3.6rem) for h1{"\n"}Body line-height: 1.7{"\n"}Heading line-height: 1.05{"\n"}All text in monospace — no font mixing.{"\n"}{"\n"}UI:{"\n"}Terminal frame: border-radius 16px, border 2px solid var(--border), overflow hidden, box-shadow 0 0 0 1px #0a2010 + 0 20px 36px rgba(0,0,0,0.46).{"\n"}Top bar: bg #0a190c, border-bottom 1px solid var(--border), padding 10px 12px, font-size 0.92rem.{"\n"}Screen area: bg linear-gradient(180deg, #08120a, #061008), padding clamp(18px, 4vw, 34px).{"\n"}Command blocks: border-radius 10px, border 1px solid var(--border), bg #0f2512, padding 10px 12px.{"\n"}Prompt box: border-radius 14px, border 2px solid var(--border), bg #08140a.{"\n"}Buttons: pill shape (border-radius 999px), border 1px solid var(--accent-1), color #ebffab, bg #1a2d09.{"\n"}{"\n"}LAYOUT:{"\n"}Content max-width: min(1040px, 92vw){"\n"}Page padding: 26px 0 80px{"\n"}Screen padding: clamp(18px, 4vw, 34px){"\n"}Command grid: single column, gap 8px{"\n"}Lead max-width: 720px{"\n"}{"\n"}MOTION:{"\n"}Entrance: translateY(10px) → 0, opacity 0 → 1, 600ms ease, stagger 80ms per command block{"\n"}Hover: none specified — keep static, machine-like{"\n"}Respect prefers-reduced-motion.{"\n"}{"\n"}RESPONSIVE:{"\n"}768px: console block font-size reduced, padding shrinks, terminal frame padding adjusts via clamp{"\n"}1024px: full layout with max-width 1040px, generous screen padding{"\n"}{"\n"}FORBIDDEN:{"\n"}- Gradient backgrounds (scanline texture only — repeating-linear-gradient pattern is not a gradient fill){"\n"}- Blur or glassmorphism effects{"\n"}- Sans-serif or serif fonts (monospace only, JetBrains Mono){"\n"}- Rounded corners exceeding 16px{"\n"}- Horizontal scroll at any viewport{"\n"}- Bright white text (use green spectrum only){"\n"}{"\n"}OUTPUT:{"\n"}1) Color + typography tokens as CSS custom properties{"\n"}2) Terminal frame / Hero / Features (command blocks) / Logs / CTA structure{"\n"}3) Semantic HTML + CSS with responsive support</pre>
            <pre data-lang="ko" hidden>Terminal Core 스타일의 랜딩 페이지를 디자인해줘 — CRT 그린 모노스페이스 인터페이스에 스캔라인 텍스처와 명령어 로그 내러티브.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #071109{"\n"}--panel: #0f2512{"\n"}--surface: #08120a{"\n"}--border: #1e4f22{"\n"}--text: #b9ffbe{"\n"}--accent-1: #d4ff5c{"\n"}--bar-bg: #0a190c{"\n"}스캔라인 패턴: repeating-linear-gradient(180deg, #061007 0, #061007 2px, #071109 2px, #071109 4px).{"\n"}다른 색상 사용 금지.{"\n"}{"\n"}타이포그래피:{"\n"}제목: "JetBrains Mono" 800{"\n"}본문: "JetBrains Mono" 400{"\n"}스케일: h1에 clamp(1.8rem, 5vw, 3.6rem){"\n"}본문 줄간격: 1.7{"\n"}제목 줄간격: 1.05{"\n"}모든 텍스트 모노스페이스 — 폰트 혼용 금지.{"\n"}{"\n"}UI:{"\n"}터미널 프레임: border-radius 16px, border 2px solid var(--border), overflow hidden, box-shadow 0 0 0 1px #0a2010 + 0 20px 36px rgba(0,0,0,0.46).{"\n"}상단 바: bg #0a190c, border-bottom 1px solid var(--border), padding 10px 12px, font-size 0.92rem.{"\n"}스크린 영역: bg linear-gradient(180deg, #08120a, #061008), padding clamp(18px, 4vw, 34px).{"\n"}명령어 블록: border-radius 10px, border 1px solid var(--border), bg #0f2512, padding 10px 12px.{"\n"}프롬프트 박스: border-radius 14px, border 2px solid var(--border), bg #08140a.{"\n"}버튼: pill 형태(border-radius 999px), border 1px solid var(--accent-1), color #ebffab, bg #1a2d09.{"\n"}{"\n"}레이아웃:{"\n"}콘텐츠 최대 너비: min(1040px, 92vw){"\n"}페이지 패딩: 26px 0 80px{"\n"}스크린 패딩: clamp(18px, 4vw, 34px){"\n"}명령어 그리드: 단일 열, gap 8px{"\n"}리드 최대 너비: 720px{"\n"}{"\n"}모션:{"\n"}진입: translateY(10px) → 0, opacity 0 → 1, 600ms ease, 명령어 블록당 80ms 스태거{"\n"}호버: 미지정 — 정적이고 기계적으로 유지{"\n"}prefers-reduced-motion 존중.{"\n"}{"\n"}반응형:{"\n"}768px: 콘솔 블록 font-size 축소, 패딩 축소, 터미널 프레임 패딩 clamp로 조정{"\n"}1024px: max-width 1040px로 전체 레이아웃, 넉넉한 스크린 패딩{"\n"}{"\n"}금지사항:{"\n"}- 그라데이션 배경 (스캔라인 텍스처 전용 — repeating-linear-gradient 패턴은 그라데이션 채움이 아님){"\n"}- 블러 또는 글래스모피즘 효과{"\n"}- 산세리프 또는 세리프 폰트 (모노스페이스 전용, JetBrains Mono){"\n"}- 16px 초과 둥근 모서리{"\n"}- 어떤 뷰포트에서도 가로 스크롤 금지{"\n"}- 밝은 흰색 텍스트 (그린 스펙트럼만 사용){"\n"}{"\n"}출력:{"\n"}1) 색상 + 타이포그래피 토큰을 CSS 커스텀 프로퍼티로{"\n"}2) 터미널 프레임 / Hero / Features (명령어 블록) / Logs / CTA 구조{"\n"}3) 반응형 지원이 포함된 시맨틱 HTML + CSS</pre>
            <pre data-lang="ja" hidden>Terminal Coreスタイルのランディングページをデザインしてください — CRTグリーンのモノスペースインターフェースにスキャンラインテクスチャとコマンドログナラティブ。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #071109{"\n"}--panel: #0f2512{"\n"}--surface: #08120a{"\n"}--border: #1e4f22{"\n"}--text: #b9ffbe{"\n"}--accent-1: #d4ff5c{"\n"}--bar-bg: #0a190c{"\n"}スキャンラインパターン: repeating-linear-gradient(180deg, #061007 0, #061007 2px, #071109 2px, #071109 4px)。{"\n"}他の色は使用不可。{"\n"}{"\n"}タイポグラフィ:{"\n"}見出し: "JetBrains Mono" 800{"\n"}本文: "JetBrains Mono" 400{"\n"}スケール: h1にclamp(1.8rem, 5vw, 3.6rem){"\n"}本文行間: 1.7{"\n"}見出し行間: 1.05{"\n"}全テキストモノスペース — フォント混用禁止。{"\n"}{"\n"}UI:{"\n"}ターミナルフレーム: border-radius 16px, border 2px solid var(--border), overflow hidden, box-shadow 0 0 0 1px #0a2010 + 0 20px 36px rgba(0,0,0,0.46)。{"\n"}上部バー: bg #0a190c, border-bottom 1px solid var(--border), padding 10px 12px, font-size 0.92rem。{"\n"}スクリーンエリア: bg linear-gradient(180deg, #08120a, #061008), padding clamp(18px, 4vw, 34px)。{"\n"}コマンドブロック: border-radius 10px, border 1px solid var(--border), bg #0f2512, padding 10px 12px。{"\n"}プロンプトボックス: border-radius 14px, border 2px solid var(--border), bg #08140a。{"\n"}ボタン: ピル形状(border-radius 999px), border 1px solid var(--accent-1), color #ebffab, bg #1a2d09。{"\n"}{"\n"}レイアウト:{"\n"}コンテンツ最大幅: min(1040px, 92vw){"\n"}ページパディング: 26px 0 80px{"\n"}スクリーンパディング: clamp(18px, 4vw, 34px){"\n"}コマンドグリッド: 単一列, gap 8px{"\n"}リード最大幅: 720px{"\n"}{"\n"}モーション:{"\n"}入場: translateY(10px) → 0, opacity 0 → 1, 600ms ease, コマンドブロックごとに80msスタガー{"\n"}ホバー: 未指定 — 静的で機械的に保つ{"\n"}prefers-reduced-motionを尊重。{"\n"}{"\n"}レスポンシブ:{"\n"}768px: コンソールブロックのfont-size縮小、パディング減少、ターミナルフレームパディングをclampで調整{"\n"}1024px: max-width 1040pxでフルレイアウト、ゆとりあるスクリーンパディング{"\n"}{"\n"}禁止事項:{"\n"}- グラデーション背景（スキャンラインテクスチャ専用 — repeating-linear-gradientパターンはグラデーション塗りではない）{"\n"}- ブラーまたはグラスモーフィズム効果{"\n"}- サンセリフまたはセリフフォント（モノスペース専用、JetBrains Mono）{"\n"}- 16px超過の角丸{"\n"}- いかなるビューポートでも横スクロール禁止{"\n"}- 明るい白テキスト（グリーンスペクトラムのみ使用）{"\n"}{"\n"}出力:{"\n"}1) カラー + タイポグラフィトークンをCSSカスタムプロパティとして{"\n"}2) ターミナルフレーム / Hero / Features（コマンドブロック）/ Logs / CTA構造{"\n"}3) レスポンシブ対応を含むセマンティックHTML + CSS</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/glass-orbit.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Glass Orbit</span></a><div className="page-nav__divider" /><a href="/pages/midnight-noir.html"><span><span className="page-nav__label">다음</span>Midnight Noir</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
