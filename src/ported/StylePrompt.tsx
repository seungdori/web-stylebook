import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';
import { usePortedCopyPrompt } from './usePortedPageEffects';
import './stylePrompt.css';

interface StylePromptProps {
  prompts: Record<Lang, string>;
  lang: Lang;
}

/**
 * The style's AI prompt, closed by default. A style page shows a real page in
 * that style; the palette, type and rules that describe the style live here.
 */
export function StylePrompt({ prompts, lang }: StylePromptProps) {
  const handleCopyPrompt = usePortedCopyPrompt(lang);

  return (
    <details className="style-prompt" id="style-prompt">
      <summary>{translate(lang, 'detail.prompt')}</summary>
      <div className="style-prompt__body">
        <pre>{prompts[lang]}</pre>
        <button type="button" data-copy-prompt onClick={handleCopyPrompt}>
          {translate(lang, 'detail.copy')}
        </button>
      </div>
    </details>
  );
}
