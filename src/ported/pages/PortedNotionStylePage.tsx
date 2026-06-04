import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedNotionStylePage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--notion-style">
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
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
        {/* ===== NOTION UI DEMO ===== */}
        <div className="notion-app" id="main-content">
          {/* Sidebar */}
          <div className="notion-sidebar">
            <div className="sidebar-workspace">
              <div className="workspace-icon">W</div>
              <span>Workspace</span>
            </div>
            <div className="sidebar-search">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2="16.65" y2="16.65" /></svg>
              Search
            </div>
            <div className="sidebar-section">
              <div className="sidebar-section-label">Favorites</div>
              <div className="sidebar-item active">
                <span className="item-icon">📐</span>
                <span>Design System</span>
                <span className="toggle-arrow">▶</span>
              </div>
              <div className="sidebar-item">
                <span className="item-icon">🎯</span>
                <span>Product Roadmap</span>
                <span className="toggle-arrow">▶</span>
              </div>
              <div className="sidebar-item">
                <span className="item-icon">📋</span>
                <span>Meeting Notes</span>
                <span className="toggle-arrow">▶</span>
              </div>
            </div>
            <div className="sidebar-section">
              <div className="sidebar-section-label">Private</div>
              <div className="sidebar-item">
                <span className="item-icon">📝</span>
                <span>Quick Note</span>
              </div>
              <div className="sidebar-item">
                <span className="item-icon">📚</span>
                <span>Reading List</span>
                <span className="toggle-arrow">▶</span>
              </div>
              <div className="sidebar-item">
                <span className="item-icon">✅</span>
                <span>Tasks</span>
              </div>
              <div className="sidebar-item">
                <span className="item-icon">🗂️</span>
                <span>Archive</span>
                <span className="toggle-arrow">▶</span>
              </div>
            </div>
            <div className="sidebar-bottom">
              <div className="sidebar-new-page">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
                New page
              </div>
            </div>
          </div>
          {/* Main content */}
          <div className="notion-main">
            {/* Cover image */}
            <div className="notion-cover">
              <div className="cover-actions">
                <span className="cover-btn">Change cover</span>
                <span className="cover-btn">Reposition</span>
              </div>
            </div>
            {/* Breadcrumb */}
            <div className="breadcrumb">
              <span>Workspace</span>
              <span className="bc-sep">/</span>
              <span>Favorites</span>
              <span className="bc-sep">/</span>
              <span style={{color: 'var(--text)'}}>Design System</span>
            </div>
            {/* Page header */}
            <div className="notion-page-header">
              <div className="page-icon">📐</div>
              <div className="page-title">Design System</div>
            </div>
            {/* Block content */}
            <div className="notion-content">
              <div className="block">
                <span className="block-handle">⠇</span>
                <p>A comprehensive guide to our design tokens, components, and patterns. This document serves as the single source of truth for the product team.</p>
              </div>
              <div className="block">
                <span className="block-handle">⠇</span>
                <h2>Getting Started</h2>
              </div>
              <div className="block">
                <span className="block-handle">⠇</span>
                <p>All components use the <span className="inline-code">--accent</span> token for interactive elements. Typography follows a system font stack for native rendering performance.</p>
              </div>
              {/* Callout block */}
              <div className="block">
                <span className="block-handle">⠇</span>
                <div className="callout-block">
                  <span className="callout-icon">💡</span>
                  <span className="callout-text">Tip: Use slash commands to quickly insert any block type. Type <span className="inline-code">/</span> to get started.</span>
                </div>
              </div>
              <div className="divider-block" />
              <div className="block">
                <span className="block-handle">⠇</span>
                <h3>Color Tokens</h3>
              </div>
              {/* Toggle blocks */}
              <div className="block">
                <span className="block-handle">⠇</span>
                <div className="toggle-block open" data-toggle-class="open" role="button" tabIndex={0}>
                  <div className="toggle-header">
                    <span className="toggle-arrow-btn">▶</span>
                    <span>Primary palette</span>
                  </div>
                  <div className="toggle-content">
                    Background #ffffff, Sidebar #f7f6f3, Text #37352f, Accent #2383e2
                  </div>
                </div>
              </div>
              <div className="block">
                <span className="block-handle">⠇</span>
                <div className="toggle-block" data-toggle-class="open" role="button" tabIndex={0}>
                  <div className="toggle-header">
                    <span className="toggle-arrow-btn">▶</span>
                    <span>Semantic tokens</span>
                  </div>
                  <div className="toggle-content">
                    Success #4daa57, Warning #cb912f, Error #e03e3e, Info #2383e2
                  </div>
                </div>
              </div>
              {/* Code block */}
              <div className="block">
                <span className="block-handle">⠇</span>
                <div className="code-block">:root {'{'}
                  --bg: #ffffff;
                  --text: #37352f;
                  --accent: #2383e2;
                  {'}'}</div>
              </div>
              <div className="block" style={{position: 'relative'}}>
                <span className="block-handle">⠇</span>
                <p className="block-placeholder">Type '/' for commands...</p>
                {/* Slash command popup */}
                <div className="slash-popup">
                  <div className="slash-popup-header">Basic blocks</div>
                  <div className="slash-popup-item selected">
                    <div className="slash-popup-icon">Aa</div>
                    <div className="slash-popup-text">
                      <strong>Text</strong>
                      <span>Just start writing with plain text.</span>
                    </div>
                  </div>
                  <div className="slash-popup-item">
                    <div className="slash-popup-icon" style={{fontSize: 20, fontWeight: 700}}>H1</div>
                    <div className="slash-popup-text">
                      <strong>Heading 1</strong>
                      <span>Big section heading.</span>
                    </div>
                  </div>
                  <div className="slash-popup-item">
                    <div className="slash-popup-icon" style={{fontSize: 18, fontWeight: 700}}>H2</div>
                    <div className="slash-popup-text">
                      <strong>Heading 2</strong>
                      <span>Medium section heading.</span>
                    </div>
                  </div>
                  <div className="slash-popup-item">
                    <div className="slash-popup-icon">☐</div>
                    <div className="slash-popup-text">
                      <strong>To-do list</strong>
                      <span>Track tasks with a to-do list.</span>
                    </div>
                  </div>
                  <div className="slash-popup-item">
                    <div className="slash-popup-icon">▶</div>
                    <div className="slash-popup-text">
                      <strong>Toggle list</strong>
                      <span>Toggles can hide and show content.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ===== PROMPT SECTION ===== */}
        <main className="shell">
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a productivity app page in Notion style — minimal block-based editor UI with sidebar navigation.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #ffffff{"\n"}--sidebar-bg: #f7f6f3{"\n"}--sidebar-hover: #e8e7e4{"\n"}--text: #37352f{"\n"}--text-muted: #787774{"\n"}--accent: #2383e2{"\n"}--accent-soft: #e8f0fe{"\n"}--border: #e9e9e7{"\n"}--block-hover: #f1f1ef{"\n"}--code-bg: #f7f6f3{"\n"}No other colors. Use rgba() variants of these tokens for transparency where needed.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Font stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif{"\n"}Code font: "SFMono-Regular", Menlo, Consolas, monospace{"\n"}Page title: 40px, font-weight 700, line-height 1.2{"\n"}H1: 1.875em, font-weight 700{"\n"}H2: 1.5em, font-weight 700{"\n"}H3: 1.25em, font-weight 700{"\n"}Body: 16px, line-height 1.5{"\n"}Sidebar: 14px for items, 13px for search, 11px uppercase for section labels{"\n"}Code blocks: 14px, line-height 1.6{"\n"}Inline code: 0.9em, color #eb5757, background var(--code-bg), padding 2px 5px, border-radius 3px{"\n"}-webkit-font-smoothing: antialiased on body{"\n"}{"\n"}SIDEBAR (240px wide):{"\n"}- Background: var(--sidebar-bg), border-right 1px solid var(--border){"\n"}- Workspace header: flex row, 22px icon (rounded 4px, gradient accent bg, white letter), font-weight 600{"\n"}- Search bar: padding 6px 10px, border-radius 4px, color var(--text-muted), flex row with search icon{"\n"}- Section labels: 11px, uppercase, letter-spacing 0.04em, font-weight 600, color var(--text-muted){"\n"}- Page items: padding 4px 14px, border-radius 4px, 16px emoji icon, hover background var(--sidebar-hover){"\n"}- Active item: background var(--sidebar-hover), color var(--text), font-weight 500{"\n"}- Toggle arrows: 10px, opacity 0, show on item hover, transition 0.12s{"\n"}- New page button: at sidebar bottom, border-top 1px solid var(--border), plus icon + text{"\n"}- Page tree supports nested indentation (padding-left per level){"\n"}{"\n"}COVER IMAGE:{"\n"}- Full-width, height 180px, gradient or image background{"\n"}- On hover: show "Change cover" and "Reposition" buttons (absolute bottom-right){"\n"}- Cover buttons: padding 4px 10px, background rgba(0,0,0,0.4), color white, font-size 12px, border-radius 4px{"\n"}{"\n"}PAGE HEADER:{"\n"}- Max-width 720px, centered, padding 0 96px{"\n"}- Page icon: 72px emoji, margin-top -36px (overlaps cover), hover scale 1.05{"\n"}- Page title: 40px, font-weight 700, contenteditable appearance{"\n"}{"\n"}BREADCRUMB:{"\n"}- Below cover, padding 10px 96px, max-width 720px centered{"\n"}- Font-size 13px, color var(--text-muted), separator "/" in #c8c7c5{"\n"}- Items are clickable, hover color var(--text){"\n"}{"\n"}BLOCK SYSTEM:{"\n"}- Each block: position relative, padding 3px 0, border-radius 3px{"\n"}- Hover state: background var(--block-hover) with subtle transition 0.1s{"\n"}- Drag handle: absolute left -24px, vertically centered, content "⁞" (6 dots), color #c3c2bf, opacity 0 on default, 1 on block hover, cursor grab, border-radius 3px{"\n"}- Paragraph blocks: font-size 16px, line-height 1.5, padding 3px 2px{"\n"}- Placeholder text: color #c3c2bf, shows "Type '/' for commands..."{"\n"}{"\n"}CALLOUT BLOCK:{"\n"}- Flex row, gap 8px, padding 16px 16px 16px 12px{"\n"}- Background var(--code-bg), border-radius 4px{"\n"}- Left emoji icon 20px, content text at 16px line-height 1.5{"\n"}{"\n"}TOGGLE BLOCK:{"\n"}- Clickable header: flex row, triangle arrow (10px, rotate 90deg when open){"\n"}- Arrow hover: background var(--sidebar-hover), border-radius 3px{"\n"}- Content: padding-left 26px, hidden by default, shown on open state{"\n"}{"\n"}DIVIDER BLOCK:{"\n"}- Height 1px, background var(--border), margin 12px 0{"\n"}{"\n"}CODE BLOCK:{"\n"}- Background var(--code-bg), border-radius 4px, padding 16px{"\n"}- Font-family monospace stack, font-size 14px, line-height 1.6, overflow-x auto{"\n"}{"\n"}SLASH COMMAND POPUP:{"\n"}- Width 320px, background #fff, border 1px solid var(--border), border-radius 6px{"\n"}- Box-shadow: 0 0 0 1px rgba(15,15,15,0.05), 0 3px 6px rgba(15,15,15,0.1), 0 9px 24px rgba(15,15,15,0.2){"\n"}- Section header: 11px uppercase, font-weight 600, color var(--text-muted){"\n"}- Items: flex row, 46x46px icon box (border 1px solid var(--border), border-radius 4px, centered content), title 14px font-weight 500, description 12px color var(--text-muted){"\n"}- Selected/hover item: background var(--block-hover){"\n"}- Entrance animation: fadeUp from translateY(4px) opacity 0, 0.15s ease{"\n"}{"\n"}LAYOUT:{"\n"}- App frame: flex row, max-width 1200px centered, border-radius 12px, border 1px solid var(--border){"\n"}- Box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.06){"\n"}- Content area: flex 1, overflow-y auto{"\n"}- Content max-width: 720px centered with padding 0 96px{"\n"}- Entrance animation: fadeUp from translateY(16px) opacity 0, 0.6s ease{"\n"}{"\n"}MOTION:{"\n"}- App frame: fadeUp 0.6s ease (translateY 16px to 0, opacity 0 to 1){"\n"}- Slash popup: popIn 0.15s ease (translateY 4px to 0, opacity 0 to 1){"\n"}- Page icon: scale hover 0.15s transition{"\n"}- Sidebar items: background transition 0.12s{"\n"}- Toggle arrow: transform rotate transition 0.15s{"\n"}- Block hover: background transition 0.1s{"\n"}- No scroll-triggered animations, no parallax, no 3D transforms{"\n"}{"\n"}RESPONSIVE:{"\n"}- Below 900px: stack sidebar on top (full width, max-height 200px), content padding 0 24px, hide block handles{"\n"}- Below 600px: page title 28px, page icon 52px (margin-top -26px), cover height 120px, content padding 0 16px{"\n"}{"\n"}FORBIDDEN:{"\n"}- No colored backgrounds outside the token system{"\n"}- No rounded pill shapes (border-radius max 12px on containers, 6px on popups, 4px on items){"\n"}- No heavy borders — all borders 1px solid var(--border) or lighter{"\n"}- No serif or decorative fonts — system font stack only{"\n"}- No gradients on UI elements (cover image gradient is the only exception){"\n"}- No drop shadows heavier than the specified values{"\n"}- No bold/saturated accent colors — blue #2383e2 is the only accent{"\n"}{"\n"}OUTPUT:{"\n"}1. Single HTML file with inline CSS{"\n"}2. Two-panel layout: sidebar + main content area with cover image{"\n"}3. Block-based content with drag handles, callouts, toggles, code blocks, dividers{"\n"}4. Slash command popup overlay with block type options{"\n"}5. Breadcrumb navigation with workspace path{"\n"}6. All color tokens as CSS custom properties in :root{"\n"}7. System font stack, no external font dependencies</pre>
            <pre data-lang="ko" hidden>Notion 스타일의 프로덕티비티 앱 페이지를 디자인해줘 — 사이드바 내비게이션이 있는 미니멀 블록 기반 에디터 UI.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #ffffff{"\n"}--sidebar-bg: #f7f6f3{"\n"}--sidebar-hover: #e8e7e4{"\n"}--text: #37352f{"\n"}--text-muted: #787774{"\n"}--accent: #2383e2{"\n"}--accent-soft: #e8f0fe{"\n"}--border: #e9e9e7{"\n"}--block-hover: #f1f1ef{"\n"}--code-bg: #f7f6f3{"\n"}다른 색상 사용 금지. 투명도가 필요한 곳은 이 토큰의 rgba() 변형만 사용.{"\n"}{"\n"}타이포그래피:{"\n"}폰트 스택: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif{"\n"}코드 폰트: "SFMono-Regular", Menlo, Consolas, monospace{"\n"}페이지 제목: 40px, font-weight 700, line-height 1.2{"\n"}H1: 1.875em, font-weight 700{"\n"}H2: 1.5em, font-weight 700{"\n"}H3: 1.25em, font-weight 700{"\n"}본문: 16px, line-height 1.5{"\n"}사이드바: 항목 14px, 검색 13px, 섹션 라벨 11px 대문자{"\n"}코드 블록: 14px, line-height 1.6{"\n"}인라인 코드: 0.9em, color #eb5757, background var(--code-bg), padding 2px 5px, border-radius 3px{"\n"}body에 -webkit-font-smoothing: antialiased{"\n"}{"\n"}사이드바 (240px 너비):{"\n"}- 배경: var(--sidebar-bg), border-right 1px solid var(--border){"\n"}- 워크스페이스 헤더: flex row, 22px 아이콘(rounded 4px, 그래디언트 accent 배경, 흰 글자), font-weight 600{"\n"}- 검색 바: padding 6px 10px, border-radius 4px, color var(--text-muted), 검색 아이콘과 flex row{"\n"}- 섹션 라벨: 11px, 대문자, letter-spacing 0.04em, font-weight 600, color var(--text-muted){"\n"}- 페이지 항목: padding 4px 14px, border-radius 4px, 16px 이모지 아이콘, hover시 background var(--sidebar-hover){"\n"}- 활성 항목: background var(--sidebar-hover), color var(--text), font-weight 500{"\n"}- 토글 화살표: 10px, opacity 0, 항목 hover시 표시, transition 0.12s{"\n"}- 새 페이지 버튼: 사이드바 하단, border-top 1px solid var(--border), 플러스 아이콘 + 텍스트{"\n"}- 페이지 트리는 중첩 들여쓰기 지원 (레벨당 padding-left){"\n"}{"\n"}커버 이미지:{"\n"}- 전체 너비, 높이 180px, 그래디언트 또는 이미지 배경{"\n"}- 호버시: "커버 변경" 및 "위치 조정" 버튼 표시 (절대 위치 우하단){"\n"}- 커버 버튼: padding 4px 10px, background rgba(0,0,0,0.4), color white, font-size 12px, border-radius 4px{"\n"}{"\n"}페이지 헤더:{"\n"}- Max-width 720px, 중앙정렬, padding 0 96px{"\n"}- 페이지 아이콘: 72px 이모지, margin-top -36px(커버 겹침), hover시 scale 1.05{"\n"}- 페이지 제목: 40px, font-weight 700, contenteditable 외관{"\n"}{"\n"}브레드크럼:{"\n"}- 커버 아래, padding 10px 96px, max-width 720px 중앙정렬{"\n"}- Font-size 13px, color var(--text-muted), 구분자 "/" 색상 #c8c7c5{"\n"}- 항목 클릭 가능, hover시 color var(--text){"\n"}{"\n"}블록 시스템:{"\n"}- 각 블록: position relative, padding 3px 0, border-radius 3px{"\n"}- 호버 상태: background var(--block-hover), 부드러운 transition 0.1s{"\n"}- 드래그 핸들: 절대 위치 left -24px, 수직 중앙, "⁞"(6점) 내용, color #c3c2bf, 기본 opacity 0, 블록 hover시 1, cursor grab, border-radius 3px{"\n"}- 단락 블록: font-size 16px, line-height 1.5, padding 3px 2px{"\n"}- 플레이스홀더 텍스트: color #c3c2bf, "Type '/' for commands..." 표시{"\n"}{"\n"}콜아웃 블록:{"\n"}- Flex row, gap 8px, padding 16px 16px 16px 12px{"\n"}- Background var(--code-bg), border-radius 4px{"\n"}- 왼쪽 이모지 아이콘 20px, 콘텐츠 텍스트 16px line-height 1.5{"\n"}{"\n"}토글 블록:{"\n"}- 클릭 가능 헤더: flex row, 삼각형 화살표(10px, 열림시 90도 회전){"\n"}- 화살표 hover: background var(--sidebar-hover), border-radius 3px{"\n"}- 콘텐츠: padding-left 26px, 기본 숨김, 열린 상태에서 표시{"\n"}{"\n"}구분선 블록:{"\n"}- 높이 1px, background var(--border), margin 12px 0{"\n"}{"\n"}코드 블록:{"\n"}- Background var(--code-bg), border-radius 4px, padding 16px{"\n"}- 모노스페이스 폰트 스택, font-size 14px, line-height 1.6, overflow-x auto{"\n"}{"\n"}슬래시 명령 팝업:{"\n"}- Width 320px, background #fff, border 1px solid var(--border), border-radius 6px{"\n"}- Box-shadow: 0 0 0 1px rgba(15,15,15,0.05), 0 3px 6px rgba(15,15,15,0.1), 0 9px 24px rgba(15,15,15,0.2){"\n"}- 섹션 헤더: 11px 대문자, font-weight 600, color var(--text-muted){"\n"}- 항목: flex row, 46x46px 아이콘 박스(border 1px solid var(--border), border-radius 4px, 중앙 콘텐츠), 제목 14px font-weight 500, 설명 12px color var(--text-muted){"\n"}- 선택/호버 항목: background var(--block-hover){"\n"}- 등장 애니메이션: translateY(4px) opacity 0에서 fadeUp, 0.15s ease{"\n"}{"\n"}레이아웃:{"\n"}- 앱 프레임: flex row, max-width 1200px 중앙정렬, border-radius 12px, border 1px solid var(--border){"\n"}- Box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.06){"\n"}- 콘텐츠 영역: flex 1, overflow-y auto{"\n"}- 콘텐츠 max-width: 720px 중앙정렬, padding 0 96px{"\n"}- 등장 애니메이션: translateY(16px) opacity 0에서 fadeUp, 0.6s ease{"\n"}{"\n"}모션:{"\n"}- 앱 프레임: fadeUp 0.6s ease (translateY 16px→0, opacity 0→1){"\n"}- 슬래시 팝업: popIn 0.15s ease (translateY 4px→0, opacity 0→1){"\n"}- 페이지 아이콘: scale hover 0.15s transition{"\n"}- 사이드바 항목: background transition 0.12s{"\n"}- 토글 화살표: transform rotate transition 0.15s{"\n"}- 블록 호버: background transition 0.1s{"\n"}- 스크롤 트리거 애니메이션 없음, 패럴랙스 없음, 3D 변환 없음{"\n"}{"\n"}반응형:{"\n"}- 900px 미만: 사이드바를 상단에 배치(전체 너비, max-height 200px), 콘텐츠 padding 0 24px, 블록 핸들 숨김{"\n"}- 600px 미만: 페이지 제목 28px, 페이지 아이콘 52px(margin-top -26px), 커버 높이 120px, 콘텐츠 padding 0 16px{"\n"}{"\n"}금지사항:{"\n"}- 토큰 시스템 외 컬러 배경 금지{"\n"}- 둥근 필 모양 금지 (컨테이너 max border-radius 12px, 팝업 6px, 항목 4px){"\n"}- 두꺼운 테두리 금지 — 모든 border는 1px solid var(--border) 이하{"\n"}- 세리프나 장식 폰트 금지 — 시스템 폰트 스택만 사용{"\n"}- UI 요소에 그래디언트 금지 (커버 이미지 그래디언트만 예외){"\n"}- 지정값보다 무거운 그림자 금지{"\n"}- 굵거나 채도 높은 강조색 금지 — 파랑 #2383e2가 유일한 accent{"\n"}{"\n"}출력:{"\n"}1. 인라인 CSS가 포함된 단일 HTML 파일{"\n"}2. 사이드바 + 커버 이미지가 있는 메인 콘텐츠의 2패널 레이아웃{"\n"}3. 드래그 핸들, 콜아웃, 토글, 코드 블록, 구분선이 있는 블록 기반 콘텐츠{"\n"}4. 블록 타입 옵션이 있는 슬래시 명령 팝업 오버레이{"\n"}5. 워크스페이스 경로가 있는 브레드크럼 내비게이션{"\n"}6. :root에 CSS 커스텀 프로퍼티로 모든 색상 토큰{"\n"}7. 시스템 폰트 스택, 외부 폰트 의존성 없음</pre>
            <pre data-lang="ja" hidden>Notionスタイルのプロダクティビティアプリページをデザインしてください — サイドバーナビゲーション付きのミニマルブロックベースエディターUI。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #ffffff{"\n"}--sidebar-bg: #f7f6f3{"\n"}--sidebar-hover: #e8e7e4{"\n"}--text: #37352f{"\n"}--text-muted: #787774{"\n"}--accent: #2383e2{"\n"}--accent-soft: #e8f0fe{"\n"}--border: #e9e9e7{"\n"}--block-hover: #f1f1ef{"\n"}--code-bg: #f7f6f3{"\n"}他の色は使用禁止。透明度が必要な場合はこれらのトークンのrgba()バリアントのみ使用。{"\n"}{"\n"}タイポグラフィ:{"\n"}フォントスタック: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif{"\n"}コードフォント: "SFMono-Regular", Menlo, Consolas, monospace{"\n"}ページタイトル: 40px, font-weight 700, line-height 1.2{"\n"}H1: 1.875em, font-weight 700{"\n"}H2: 1.5em, font-weight 700{"\n"}H3: 1.25em, font-weight 700{"\n"}本文: 16px, line-height 1.5{"\n"}サイドバー: アイテム14px、検索13px、セクションラベル11px大文字{"\n"}コードブロック: 14px, line-height 1.6{"\n"}インラインコード: 0.9em, color #eb5757, background var(--code-bg), padding 2px 5px, border-radius 3px{"\n"}bodyに -webkit-font-smoothing: antialiased{"\n"}{"\n"}サイドバー（240px幅）:{"\n"}- 背景: var(--sidebar-bg), border-right 1px solid var(--border){"\n"}- ワークスペースヘッダー: flex row, 22pxアイコン（rounded 4px、グラデーションaccent背景、白文字）, font-weight 600{"\n"}- 検索バー: padding 6px 10px, border-radius 4px, color var(--text-muted), 検索アイコン付きflex row{"\n"}- セクションラベル: 11px, 大文字, letter-spacing 0.04em, font-weight 600, color var(--text-muted){"\n"}- ページアイテム: padding 4px 14px, border-radius 4px, 16px絵文字アイコン, hover時background var(--sidebar-hover){"\n"}- アクティブアイテム: background var(--sidebar-hover), color var(--text), font-weight 500{"\n"}- トグル矢印: 10px, opacity 0, アイテムhover時表示, transition 0.12s{"\n"}- 新規ページボタン: サイドバー下部, border-top 1px solid var(--border), プラスアイコン + テキスト{"\n"}- ページツリーはネスト字下げをサポート（レベルごとにpadding-left）{"\n"}{"\n"}カバー画像:{"\n"}- 全幅、高さ180px、グラデーションまたは画像背景{"\n"}- ホバー時: 「カバー変更」「位置調整」ボタン表示（絶対位置右下）{"\n"}- カバーボタン: padding 4px 10px, background rgba(0,0,0,0.4), color white, font-size 12px, border-radius 4px{"\n"}{"\n"}ページヘッダー:{"\n"}- Max-width 720px, 中央揃え, padding 0 96px{"\n"}- ページアイコン: 72px絵文字, margin-top -36px（カバーに重なる）, hover時scale 1.05{"\n"}- ページタイトル: 40px, font-weight 700, contenteditable外観{"\n"}{"\n"}パンくずリスト:{"\n"}- カバー下, padding 10px 96px, max-width 720px中央揃え{"\n"}- Font-size 13px, color var(--text-muted), セパレーター "/"色#c8c7c5{"\n"}- アイテムはクリック可能, hover時color var(--text){"\n"}{"\n"}ブロックシステム:{"\n"}- 各ブロック: position relative, padding 3px 0, border-radius 3px{"\n"}- ホバー状態: background var(--block-hover), 控えめなtransition 0.1s{"\n"}- ドラッグハンドル: 絶対位置left -24px, 垂直中央, "⁞"（6点）内容, color #c3c2bf, デフォルトopacity 0, ブロックhover時1, cursor grab, border-radius 3px{"\n"}- 段落ブロック: font-size 16px, line-height 1.5, padding 3px 2px{"\n"}- プレースホルダーテキスト: color #c3c2bf, "Type '/' for commands..."表示{"\n"}{"\n"}コールアウトブロック:{"\n"}- Flex row, gap 8px, padding 16px 16px 16px 12px{"\n"}- Background var(--code-bg), border-radius 4px{"\n"}- 左側絵文字アイコン20px, コンテンツテキスト16px line-height 1.5{"\n"}{"\n"}トグルブロック:{"\n"}- クリック可能ヘッダー: flex row, 三角矢印（10px, 開状態で90度回転）{"\n"}- 矢印hover: background var(--sidebar-hover), border-radius 3px{"\n"}- コンテンツ: padding-left 26px, デフォルト非表示, 開状態で表示{"\n"}{"\n"}区切り線ブロック:{"\n"}- 高さ1px, background var(--border), margin 12px 0{"\n"}{"\n"}コードブロック:{"\n"}- Background var(--code-bg), border-radius 4px, padding 16px{"\n"}- モノスペースフォントスタック, font-size 14px, line-height 1.6, overflow-x auto{"\n"}{"\n"}スラッシュコマンドポップアップ:{"\n"}- Width 320px, background #fff, border 1px solid var(--border), border-radius 6px{"\n"}- Box-shadow: 0 0 0 1px rgba(15,15,15,0.05), 0 3px 6px rgba(15,15,15,0.1), 0 9px 24px rgba(15,15,15,0.2){"\n"}- セクションヘッダー: 11px大文字, font-weight 600, color var(--text-muted){"\n"}- アイテム: flex row, 46x46pxアイコンボックス（border 1px solid var(--border), border-radius 4px, 中央コンテンツ）, タイトル14px font-weight 500, 説明12px color var(--text-muted){"\n"}- 選択/ホバーアイテム: background var(--block-hover){"\n"}- 登場アニメーション: translateY(4px) opacity 0からfadeUp, 0.15s ease{"\n"}{"\n"}レイアウト:{"\n"}- アプリフレーム: flex row, max-width 1200px中央揃え, border-radius 12px, border 1px solid var(--border){"\n"}- Box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.06){"\n"}- コンテンツエリア: flex 1, overflow-y auto{"\n"}- コンテンツmax-width: 720px中央揃え, padding 0 96px{"\n"}- 登場アニメーション: translateY(16px) opacity 0からfadeUp, 0.6s ease{"\n"}{"\n"}モーション:{"\n"}- アプリフレーム: fadeUp 0.6s ease (translateY 16px→0, opacity 0→1){"\n"}- スラッシュポップアップ: popIn 0.15s ease (translateY 4px→0, opacity 0→1){"\n"}- ページアイコン: scale hover 0.15s transition{"\n"}- サイドバーアイテム: background transition 0.12s{"\n"}- トグル矢印: transform rotate transition 0.15s{"\n"}- ブロックホバー: background transition 0.1s{"\n"}- スクロールトリガーアニメーションなし、パララックスなし、3Dトランスフォームなし{"\n"}{"\n"}レスポンシブ:{"\n"}- 900px未満: サイドバーを上部に配置（全幅, max-height 200px）, コンテンツpadding 0 24px, ブロックハンドル非表示{"\n"}- 600px未満: ページタイトル28px, ページアイコン52px（margin-top -26px）, カバー高さ120px, コンテンツpadding 0 16px{"\n"}{"\n"}禁止事項:{"\n"}- トークンシステム外のカラー背景禁止{"\n"}- 丸いピル形状禁止（コンテナmax border-radius 12px, ポップアップ6px, アイテム4px）{"\n"}- 太いボーダー禁止 — 全border 1px solid var(--border)以下{"\n"}- セリフや装飾フォント禁止 — システムフォントスタックのみ{"\n"}- UI要素にグラデーション禁止（カバー画像グラデーションのみ例外）{"\n"}- 指定値より重いシャドウ禁止{"\n"}- 濃いまたは彩度の高いアクセントカラー禁止 — 青#2383e2のみがアクセント{"\n"}{"\n"}出力:{"\n"}1. インラインCSS付きの単一HTMLファイル{"\n"}2. サイドバー + カバー画像付きメインコンテンツの2パネルレイアウト{"\n"}3. ドラッグハンドル、コールアウト、トグル、コードブロック、区切り線付きブロックベースコンテンツ{"\n"}4. ブロックタイプオプション付きスラッシュコマンドポップアップオーバーレイ{"\n"}5. ワークスペースパス付きパンくずナビゲーション{"\n"}6. :rootにCSSカスタムプロパティとして全カラートークン{"\n"}7. システムフォントスタック、外部フォント依存なし</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/soft-pastel.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Soft Pastel</span></a><div className="page-nav__divider" /><a href="/pages/retro-pixel.html"><span><span className="page-nav__label">다음</span>Retro Pixel</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
