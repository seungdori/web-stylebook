import { useRef, type ReactNode } from 'react';
import type { Lang } from '../data/styles';
import { ColorModeToggle } from './ColorModeToggle';
import { usePortedCopyPrompt, usePortedPageEffects } from './usePortedPageEffects';

export interface FusionShellNavLink {
  href: string;
  label: string;
}

export interface FusionShellProps {
  fusionId: string;
  lang: Lang;
  prev?: FusionShellNavLink;
  next?: FusionShellNavLink;
  prompts: Record<Lang, string>;
  children: ReactNode;
  colorModeToggle?: boolean;
  defaultColorMode?: 'light' | 'dark';
}

const navLabels: Record<Lang, { hub: string; styles: string; compare: string; colors: string; workflow: string; tips: string; prev: string; next: string; skip: string; lang: string; theme: string; menu: string; copy: string; promptHeading: string }> = {
  en: {
    hub: 'Hub',
    styles: 'Styles',
    compare: 'Compare',
    colors: 'Colors',
    workflow: 'Prompt Generator',
    tips: 'Tips',
    prev: 'Prev',
    next: 'Next',
    skip: 'Skip to content',
    lang: 'Language',
    theme: 'Reset theme',
    menu: 'Toggle menu',
    copy: 'Copy Prompt',
    promptHeading: 'AI Request Prompt',
  },
  ko: {
    hub: '허브',
    styles: '스타일',
    compare: '비교',
    colors: '색상 조합',
    workflow: '프롬프트 생성기',
    tips: '팁',
    prev: '이전',
    next: '다음',
    skip: '본문 바로가기',
    lang: '언어',
    theme: '테마 초기화',
    menu: '메뉴 열기',
    copy: '프롬프트 복사',
    promptHeading: 'AI 요청 프롬프트',
  },
  ja: {
    hub: 'ハブ',
    styles: 'スタイル',
    compare: '比較',
    colors: '配色',
    workflow: 'プロンプト生成',
    tips: 'ヒント',
    prev: '前へ',
    next: '次へ',
    skip: '本文へスキップ',
    lang: '言語',
    theme: 'テーマをリセット',
    menu: 'メニュー',
    copy: 'プロンプトをコピー',
    promptHeading: 'AIリクエストプロンプト',
  },
};

export function FusionShell({ fusionId, lang, prev, next, prompts, children, colorModeToggle, defaultColorMode }: FusionShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  const labels = navLabels[lang];

  return (
    <div
      ref={rootRef}
      className={`ported-style-page ported-style-page--${fusionId} fusion-page`}
      lang={lang}
      data-color-mode={colorModeToggle ? defaultColorMode : undefined}
      data-default-color-mode={colorModeToggle ? defaultColorMode : undefined}
    >
      <a className="fusion-shell__back" href="/" aria-label={labels.hub}>
        <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>{labels.hub}</span>
      </a>

      <main className="fusion-shell" id="main-content">
        <a className="skip-link" href="#main-content">{labels.skip}</a>

        <nav className="fusion-shell__nav" aria-label="Site">
          <a className="fusion-shell__brand" href="/">Web Stylebook</a>
          <ul className="fusion-shell__links">
            <li><a href="/#styles">{labels.styles}</a></li>
            <li><a href="/pages/compare">{labels.compare}</a></li>
            <li><a href="/pages/color-system">{labels.colors}</a></li>
            <li><a href="/pages/prompt-workflow">{labels.workflow}</a></li>
            <li><a href="/pages/prompt-tips">{labels.tips}</a></li>
          </ul>
          <div className="fusion-shell__actions">
            <div className="lang-dropdown">
              <button className="lang-toggle" type="button" aria-label={labels.lang}>English</button>
              <ul className="lang-menu" role="menu">
                <li><button type="button" role="menuitem" data-lang-select="en">English</button></li>
                <li><button type="button" role="menuitem" data-lang-select="ko">한국어</button></li>
                <li><button type="button" role="menuitem" data-lang-select="ja">日本語</button></li>
              </ul>
            </div>
            {colorModeToggle ? <ColorModeToggle pageKey={fusionId} className="fusion-shell__theme mode-toggle" /> : null}
            <button type="button" id="global-theme-reset" className="fusion-shell__theme" aria-label={labels.theme}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          </div>
        </nav>

        <div className="fusion-shell__content">
          {children}
        </div>

        <details className="prompt fusion-shell__prompt">
          <summary className="fusion-shell__prompt-heading">
            <span className="fusion-shell__prompt-heading-text">{labels.promptHeading}</span>
            <svg className="fusion-shell__prompt-chevron" viewBox="0 0 16 16" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 8 11 13 6" />
            </svg>
          </summary>
          <div className="fusion-shell__prompt-body">
            <pre data-lang="en">{prompts.en}</pre>
            <pre data-lang="ko" hidden>{prompts.ko}</pre>
            <pre data-lang="ja" hidden>{prompts.ja}</pre>
            <button type="button" data-copy-prompt onClick={handleCopyPrompt}>{labels.copy}</button>
          </div>
        </details>
      </main>

      <nav className="fusion-shell__pagenav" aria-label="Page">
        {prev ? (
          <a href={prev.href} className="fusion-shell__pagenav-link fusion-shell__pagenav-link--prev">
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>
              <span className="fusion-shell__pagenav-label">{labels.prev}</span>
              {prev.label}
            </span>
          </a>
        ) : <span />}
        <span className="fusion-shell__pagenav-divider" aria-hidden="true" />
        {next ? (
          <a href={next.href} className="fusion-shell__pagenav-link fusion-shell__pagenav-link--next">
            <span>
              <span className="fusion-shell__pagenav-label">{labels.next}</span>
              {next.label}
            </span>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </a>
        ) : <span />}
      </nav>
    </div>
  );
}
