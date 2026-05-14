import { useCallback, useEffect, type MouseEvent, type RefObject } from 'react';
import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';

function copyLabel(lang: Lang, copied: boolean) {
  return translate(lang, copied ? 'detail.copied' : 'detail.copy');
}

function langLabel(lang: Lang) {
  if (lang === 'ko') return '한국어';
  if (lang === 'ja') return '日本語';
  return 'English';
}

function toggleClassFromDataset(target: HTMLElement) {
  const className = target.dataset.toggleClass;
  if (!className) return;
  target.classList.toggle(className);
}

function applyColorModeInlineFallback(root: HTMLElement, mode: string | null) {
  if (!root.classList.contains('ported-style-page--console-launch')) return;

  if (mode === 'light') {
    root.style.setProperty('background-color', '#f6f8fb', 'important');
    root.style.setProperty(
      'background-image',
      'radial-gradient(circle at 50% -20%, rgba(13, 143, 87, 0.12) 0%, transparent 40%)',
      'important',
    );
    return;
  }

  root.style.removeProperty('background-color');
  root.style.removeProperty('background-image');
}

const i18nAliases: Record<string, string> = {
  'back.hub': 'detail.back',
  'back.hub.aria': 'detail.back',
  'lang.toggle.aria': 'lang.label',
  'nav.more-tips': 'nav.tips',
  'nav.tips': 'nav.colors',
  'page.btn.copy': 'detail.copy',
  'page.heading.prompt': 'detail.prompt',
  'page.nav.hub': 'detail.back',
  'page.nav.next': 'page.next',
  'page.nav.prev': 'page.prev',
  'pw.nav.hub': 'detail.back',
};

const literalI18n: Record<string, Record<Lang, string>> = {
  'nav.compare': {
    en: 'Compare Styles',
    ko: '스타일 비교',
    ja: 'スタイル比較',
  },
  'nav.tips': {
    en: 'Color System',
    ko: '색상 조합',
    ja: '配色',
  },
  'nav.more-tips': {
    en: 'Tips',
    ko: '팁',
    ja: 'ヒント',
  },
  'page.nav.aria': {
    en: 'Page navigation',
    ko: '페이지 내비게이션',
    ja: 'ページナビゲーション',
  },
};

function portedTranslate(lang: Lang, key: string | undefined) {
  if (!key) return null;
  const literal = literalI18n[key]?.[lang];
  if (literal) return literal;
  const normalizedKey = i18nAliases[key] || key;
  const value = translate(lang, normalizedKey);
  return value === normalizedKey && normalizedKey !== key ? translate(lang, key) : value;
}

export function usePortedCopyPrompt(lang: Lang) {
  return useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const prompt = button.closest('.prompt')?.querySelector<HTMLPreElement>('pre:not([hidden])');
      if (!prompt) return;

      const text = prompt.textContent || '';
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      button.textContent = copyLabel(lang, true);
      window.setTimeout(() => {
        button.textContent = copyLabel(lang, false);
      }, 1400);
    },
    [lang],
  );
}

export function usePortedPageEffects(rootRef: RefObject<HTMLElement | null>, lang: Lang) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    root.classList.toggle('ported-style-page--embedded', window.self !== window.top);

    const modeButton = root.querySelector<HTMLButtonElement>('#color-mode-toggle');
    if (modeButton) {
      const pageKey = modeButton.dataset.modeToggle || 'global';
      const defaultMode = root.dataset.defaultColorMode;
      try {
        const stored = window.localStorage.getItem(`color-mode:${pageKey}`);
        if (stored === 'light' || stored === 'dark') {
          root.setAttribute('data-color-mode', stored);
        } else if (defaultMode === 'light' || defaultMode === 'dark') {
          root.setAttribute('data-color-mode', defaultMode);
        }
      } catch {
        if (defaultMode === 'light' || defaultMode === 'dark') {
          root.setAttribute('data-color-mode', defaultMode);
        }
      }
      applyColorModeInlineFallback(root, root.getAttribute('data-color-mode'));
    }

    root.querySelectorAll<HTMLElement>('[data-lang]').forEach((node) => {
      node.hidden = node.dataset.lang !== lang;
    });

    root.querySelectorAll<HTMLButtonElement>('[data-lang-select]').forEach((button) => {
      button.setAttribute('aria-pressed', button.dataset.langSelect === lang ? 'true' : 'false');
      button.classList.toggle('active', button.dataset.langSelect === lang);
    });

    root.querySelectorAll<HTMLButtonElement>('.lang-toggle').forEach((button) => {
      button.textContent = langLabel(lang);
    });

    root.querySelectorAll<HTMLElement>('[data-i18n]').forEach((node) => {
      const value = portedTranslate(lang, node.dataset.i18n);
      if (value) node.textContent = value;
    });

    root.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((node) => {
      const value = portedTranslate(lang, node.dataset.i18nAria);
      if (value) node.setAttribute('aria-label', value);
    });

    root.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((node) => {
      const value = portedTranslate(lang, node.dataset.i18nTitle);
      if (value) node.setAttribute('title', value);
    });

    root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach((node) => {
      const value = portedTranslate(lang, node.dataset.i18nPlaceholder);
      if (value) node.setAttribute('placeholder', value);
    });

    root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-value]').forEach((node) => {
      const value = portedTranslate(lang, node.dataset.i18nValue);
      if (value) node.value = value;
    });
  }, [lang, rootRef]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onClick = (event: Event) => {
      const target = event.target as Element | null;
      const classToggle = target?.closest<HTMLElement>('[data-toggle-class]');
      if (classToggle) {
        event.preventDefault();
        toggleClassFromDataset(classToggle);
        return;
      }

      const langToggle = target?.closest<HTMLButtonElement>('.lang-toggle');
      if (langToggle) {
        event.preventDefault();
        langToggle.closest('.lang-dropdown')?.classList.toggle('open');
        return;
      }

      const langButton = target?.closest<HTMLButtonElement>('[data-lang-select]');
      if (langButton) {
        event.preventDefault();
        const nextLang = langButton.dataset.langSelect as Lang | undefined;
        const url = new URL(window.location.href);
        if (!nextLang || nextLang === 'en') url.searchParams.delete('lang');
        else url.searchParams.set('lang', nextLang);
        langButton.closest('.lang-dropdown')?.classList.remove('open');
        window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }

      const burger = target?.closest<HTMLButtonElement>('#nav-burger');
      if (burger) {
        const expanded = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        root.querySelector('.site-nav__links')?.classList.toggle('open', !expanded);
        root.querySelector('.site-nav__links')?.classList.toggle('is-open', !expanded);
        return;
      }

      const modeToggle = target?.closest<HTMLButtonElement>('#color-mode-toggle');
      if (modeToggle) {
        event.preventDefault();
        const pageKey = modeToggle.dataset.modeToggle || 'global';
        const current = root.getAttribute('data-color-mode');
        const next = current === 'light' ? 'dark' : 'light';
        root.setAttribute('data-color-mode', next);
        applyColorModeInlineFallback(root, next);
        try {
          window.localStorage.setItem(`color-mode:${pageKey}`, next);
        } catch {
          // ignore quota errors
        }
        return;
      }

      const themeReset = target?.closest<HTMLButtonElement>('#global-theme-reset');
      if (themeReset) {
        event.preventDefault();
        document.documentElement.removeAttribute('data-global-theme');
        root.removeAttribute('data-global-theme');
        return;
      }

      const link = target?.closest<HTMLAnchorElement>('a[href]');
      if (!link || event.defaultPrevented) return;
      if (event instanceof MouseEvent && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (lang !== 'en') url.searchParams.set('lang', lang);
      else url.searchParams.delete('lang');
      link.href = `${url.pathname}${url.search}${url.hash}`;
    };

    root.addEventListener('click', onClick);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const target = event.target as Element | null;
      const classToggle = target?.closest<HTMLElement>('[data-toggle-class]');
      if (!classToggle) return;
      event.preventDefault();
      toggleClassFromDataset(classToggle);
    };

    root.addEventListener('keydown', onKeyDown);
    return () => {
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKeyDown);
    };
  }, [lang, rootRef]);
}
