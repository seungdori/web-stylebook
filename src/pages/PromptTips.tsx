import { useState } from 'react';
import type { Lang } from '../data/styles';
import { localize } from '../data/styles';
import { translate } from '../data/i18n';
import { antiPatterns, principles, promptSnippets } from '../data/promptTips';
import { copyText } from '../utils/clipboard';

export function PromptTips({ lang }: { lang: Lang }) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(id: string, text: string) {
    await copyText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1200);
  }

  return (
    <>
      <section className="page-hero page-hero--tips">
        <p className="hero__eyebrow">Prompt Craft</p>
        <h1>{translate(lang, 'tips.title')}</h1>
        <p>{translate(lang, 'tips.desc')}</p>
      </section>

      <nav className="toc" aria-label="Contents">
        <a href="#anti">Anti-patterns</a>
        <a href="#principles">Principles</a>
        <a href="#snippets">Snippets</a>
      </nav>

      <section className="section" id="anti">
        <div className="section__head">
          <h2>Patterns AI Defaults To</h2>
        </div>
        <div className="tip-grid">
          {antiPatterns.map((item) => (
            <article className="tip-card" key={localize(item.title, 'en')}>
              <span className="tip-label">Trap</span>
              <h3>{localize(item.title, lang)}</h3>
              <p>{localize(item.description, lang)}</p>
              <div className="before-after">
                <code>{item.vague}</code>
                <code>{item.specific}</code>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="principles">
        <div className="section__head">
          <h2>Prompting Principles</h2>
        </div>
        <div className="tip-grid tip-grid--wide">
          {principles.map((item) => (
            <article className="tip-card" key={localize(item.title, 'en')}>
              <h3>{localize(item.title, lang)}</h3>
              <p>{localize(item.description, lang)}</p>
              <pre>{item.tip}</pre>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="snippets">
        <div className="section__head">
          <h2>Copy-Ready Snippets</h2>
        </div>
        <div className="prompt-grid">
          {promptSnippets.map((item) => {
            const id = localize(item.title, 'en');
            return (
              <section className="prompt-block" key={id}>
                <div className="prompt-block__head">
                  <h3>{localize(item.title, lang)}</h3>
                  <button className="button button--dark" type="button" onClick={() => copy(id, item.code)}>
                    {copied === id ? translate(lang, 'detail.copied') : translate(lang, 'colors.copy')}
                  </button>
                </div>
                <pre>{item.code}</pre>
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}
