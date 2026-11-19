import { useState } from 'react';
import type { Lang, LocalizedText } from '../data/styles';
import { localize } from '../data/styles';
import { translate } from '../data/i18n';
import { antiPatterns, principles, promptSnippets } from '../data/promptTips';
import { copyText } from '../utils/clipboard';
import './shell-guides.css';

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

const copy = {
  contents: t('Contents', '목차', '目次'),
  antiNav: t('Anti-patterns', '피해야 할 패턴', 'アンチパターン'),
  principlesNav: t('Principles', '원칙', '原則'),
  snippetsNav: t('Snippets', '스니펫', 'スニペット'),
  antiTitle: t('Patterns AI Defaults To', 'AI가 기본으로 쓰는 패턴', 'AIがつい使ってしまうパターン'),
  antiLead: t(
    'Each trap pairs the vague request that causes it with a specific one that avoids it.',
    '각 함정은 그것을 일으키는 모호한 요청과, 그것을 피하는 구체적인 요청을 짝지어 보여 줍니다.',
    '各落とし穴は、それを招くあいまいな依頼と、それを避ける具体的な依頼を組にして示しています。',
  ),
  trap: t('Trap', '함정', '落とし穴'),
  vague: t('Vague', '모호한 요청', 'あいまいな依頼'),
  specific: t('Specific', '구체적인 요청', '具体的な依頼'),
  principlesTitle: t('Prompting Principles', '프롬프트 작성 원칙', 'プロンプトの原則'),
  principlesLead: t(
    'Decide these before the first draft, and the draft starts closer to what you meant.',
    '첫 초안을 쓰기 전에 이것들을 정해 두면, 초안이 처음 의도에 더 가까워집니다.',
    '最初の下書きの前にこれらを決めておくと、下書きが意図にさらに近い状態から始まります。',
  ),
  snippetsTitle: t('Copy-Ready Snippets', '바로 복사하는 스니펫', 'そのままコピーできるスニペット'),
  snippetsLead: t(
    'Paste a block into your prompt as it is, then change the values to fit your project.',
    '블록을 그대로 프롬프트에 붙여 넣은 다음, 값을 프로젝트에 맞게 바꾸세요.',
    'ブロックをそのままプロンプトに貼り付け、値をプロジェクトに合わせて変えてください。',
  ),
};

export function PromptTips({ lang }: { lang: Lang }) {
  const [copied, setCopied] = useState<string | null>(null);
  const L = (text: LocalizedText) => localize(text, lang);

  async function copySnippet(id: string, text: string) {
    await copyText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1200);
  }

  return (
    <div className="guide-page prompt-tips-page">
      <section className="page-hero page-hero--tips">
        <p className="hero__eyebrow">Prompt Craft</p>
        <h1>{translate(lang, 'tips.title')}</h1>
        <p>{translate(lang, 'tips.desc')}</p>
      </section>

      <nav className="toc" aria-label={L(copy.contents)}>
        <a href="#anti">{L(copy.antiNav)}</a>
        <a href="#principles">{L(copy.principlesNav)}</a>
        <a href="#snippets">{L(copy.snippetsNav)}</a>
      </nav>

      <section className="section" id="anti">
        <div className="section__head">
          <h2>{L(copy.antiTitle)}</h2>
          <p>{L(copy.antiLead)}</p>
        </div>
        <div className="tip-grid">
          {antiPatterns.map((item) => (
            <article className="tip-card" key={localize(item.title, 'en')}>
              <span className="tip-label">{L(copy.trap)}</span>
              <h3>{localize(item.title, lang)}</h3>
              <p>{localize(item.description, lang)}</p>
              <div className="before-after">
                <div className="before-after__case before-after__case--vague">
                  <span className="before-after__label"><span aria-hidden="true">×</span>{L(copy.vague)}</span>
                  <code>{item.vague}</code>
                </div>
                <div className="before-after__case before-after__case--specific">
                  <span className="before-after__label"><span aria-hidden="true">✓</span>{L(copy.specific)}</span>
                  <code>{item.specific}</code>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="principles">
        <div className="section__head">
          <h2>{L(copy.principlesTitle)}</h2>
          <p>{L(copy.principlesLead)}</p>
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
          <h2>{L(copy.snippetsTitle)}</h2>
          <p>{L(copy.snippetsLead)}</p>
        </div>
        <div className="prompt-grid">
          {promptSnippets.map((item) => {
            const id = localize(item.title, 'en');
            return (
              <section className="prompt-block" key={id}>
                <div className="prompt-block__head">
                  <h3>{localize(item.title, lang)}</h3>
                  <button className="button button--dark" type="button" onClick={() => copySnippet(id, item.code)}>
                    {copied === id ? translate(lang, 'detail.copied') : translate(lang, 'colors.copy')}
                  </button>
                </div>
                <pre>{item.code}</pre>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
