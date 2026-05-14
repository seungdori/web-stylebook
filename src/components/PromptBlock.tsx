import { useState } from 'react';
import { copyText } from '../utils/clipboard';
import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';

interface PromptBlockProps {
  title: string;
  text: string;
  lang: Lang;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function PromptBlock({ title, text, lang, collapsible = false, defaultCollapsed = false }: PromptBlockProps) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  async function copy() {
    await copyText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <section className={`prompt-block ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="prompt-block__head">
        <h3>{title}</h3>
        <div>
          {collapsible ? (
            <button className="button" type="button" onClick={() => setCollapsed((value) => !value)}>
              {translate(lang, collapsed ? 'prompt.expand' : 'prompt.collapse')}
            </button>
          ) : null}
          <button className="button button--dark" type="button" onClick={copy}>
            {copied ? translate(lang, 'detail.copied') : translate(lang, 'detail.copy')}
          </button>
        </div>
      </div>
      <pre>{text}</pre>
    </section>
  );
}
