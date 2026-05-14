import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';

interface LanguageSwitcherProps {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

const labels: Record<Lang, string> = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
};

export function LanguageSwitcher({ lang, onChange }: LanguageSwitcherProps) {
  return (
    <label className="language-switcher">
      <span className="sr-only">{translate(lang, 'lang.label')}</span>
      <select value={lang} onChange={(event) => onChange(event.target.value as Lang)}>
        {Object.entries(labels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
