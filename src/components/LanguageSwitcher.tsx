import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';

interface LanguageSwitcherProps {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

const languages: Lang[] = ['en', 'ko', 'ja'];

const labels: Record<Lang, { name: string; short: string }> = {
  en: { name: 'English', short: 'EN' },
  ko: { name: '한국어', short: 'KO' },
  ja: { name: '日本語', short: 'JA' },
};

export function LanguageSwitcher({ lang, onChange }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const selectLanguage = (nextLang: Lang) => {
    onChange(nextLang);
    setOpen(false);
  };

  return (
    <div className={`language-switcher ${open ? 'is-open' : ''}`} ref={rootRef}>
      <button
        className="language-switcher__trigger"
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={translate(lang, 'lang.label')}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="language-switcher__globe" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3c2.3 2.4 3.4 5.4 3.4 9s-1.1 6.6-3.4 9" />
            <path d="M12 3c-2.3 2.4-3.4 5.4-3.4 9s1.1 6.6 3.4 9" />
          </svg>
        </span>
        <span className="language-switcher__text">
          <span className="language-switcher__name">{labels[lang].name}</span>
        </span>
        <svg className="language-switcher__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="language-switcher__menu" role="listbox" aria-label={translate(lang, 'lang.label')}>
        {languages.map((value) => {
          const active = value === lang;
          return (
            <button
              key={value}
              className={active ? 'is-active' : ''}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => selectLanguage(value)}
            >
              <span className="language-switcher__option-name">{labels[value].name}</span>
              <svg className="language-switcher__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
