import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Lang } from '../../data/styles';
import { translate } from '../../data/i18n';
import { withLang } from '../../utils/language';
import { copyText } from '../../utils/clipboard';
import type { HomeCopy } from './homeCopy';

const MCP_CONFIG = `{
  "mcpServers": {
    "web-stylebook": {
      "command": "npx",
      "args": ["-y", "web-stylebook-mcp@latest"]
    }
  }
}`;

const CLI_COMMANDS = `npx webstylebook add toast tooltip
npx webstylebook list`;

type Method = 'prompt' | 'mcp' | 'cli';
const METHODS: Method[] = ['prompt', 'mcp', 'cli'];

function CopyButton({ text, copy }: { text: string; copy: HomeCopy }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  useEffect(() => {
    if (state === 'idle') return;
    const timer = window.setTimeout(() => setState('idle'), 1600);
    return () => window.clearTimeout(timer);
  }, [state]);
  return (
    <button
      className="button button--dark"
      type="button"
      onClick={() => copyText(text).then(() => setState('copied'), () => setState('failed'))}
    >
      <span aria-live="polite">{state === 'copied' ? copy.copied : state === 'failed' ? copy.copyFailed : copy.copy}</span>
    </button>
  );
}

export function ApplySection({ lang, copy }: { lang: Lang; copy: HomeCopy }) {
  const [method, setMethod] = useState<Method>('prompt');
  const tabRefs = useRef<Record<Method, HTMLButtonElement | null>>({ prompt: null, mcp: null, cli: null });
  const labels: Record<Method, string> = { prompt: copy.tabPrompt, mcp: copy.tabMcp, cli: copy.tabCli };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = METHODS.indexOf(method);
    let next: Method | null = null;
    if (event.key === 'ArrowRight') next = METHODS[(index + 1) % METHODS.length];
    if (event.key === 'ArrowLeft') next = METHODS[(index + METHODS.length - 1) % METHODS.length];
    if (event.key === 'Home') next = METHODS[0];
    if (event.key === 'End') next = METHODS[METHODS.length - 1];
    if (!next) return;
    event.preventDefault();
    setMethod(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="home-section home-apply" id="apply" aria-labelledby="apply-title">
      <div className="home-d__wrap home-apply__flow">
        <div className="home-apply__intro">
          <h2 id="apply-title">
            {copy.applyTitle.map((line, index) => (
              <span key={line}>{index > 0 ? <br /> : null}{line}</span>
            ))}
          </h2>
          <p>{copy.applyLead}</p>
        </div>
        <ol className="home-apply__steps">
          <li>
            <h3>{copy.stepChoose}</h3>
            <p>{copy.stepChooseBody}</p>
            <div className="home-apply__links">
              <a className="button" href={withLang('/pages/compare', lang)}>{copy.stepChooseLink}</a>
            </div>
          </li>
          <li>
            <h3>{copy.stepAdjust}</h3>
            <p>{copy.stepAdjustBody}</p>
            <div className="home-apply__links">
              <a className="button" href={withLang('/pages/color-system', lang)}>{copy.stepAdjustColors}</a>
              <a className="button" href={withLang('/pages/typography', lang)}>{copy.stepAdjustType}</a>
            </div>
          </li>
          <li>
            <h3>{copy.stepApply}</h3>
            <p>{copy.stepApplyBody}</p>
            <div className="home-apply__tabs">
              <div className="home-apply__tablist" role="tablist" aria-label={copy.methods}>
                {METHODS.map((item) => (
                  <button
                    key={item}
                    ref={(node) => {
                      tabRefs.current[item] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`apply-tab-${item}`}
                    aria-controls={`apply-panel-${item}`}
                    aria-selected={method === item}
                    tabIndex={method === item ? 0 : -1}
                    onClick={() => setMethod(item)}
                    onKeyDown={onTabKey}
                  >
                    {labels[item]}
                  </button>
                ))}
              </div>
              <div className="home-apply__panel" role="tabpanel" id="apply-panel-prompt" aria-labelledby="apply-tab-prompt" hidden={method !== 'prompt'}>
                <p>{copy.promptBody}</p>
                <div className="home-apply__foot">
                  <a className="button button--dark" href={withLang('/pages/prompt-workflow', lang)}>{translate(lang, 'home.workflow.cta')}</a>
                </div>
              </div>
              <div className="home-apply__panel" role="tabpanel" id="apply-panel-mcp" aria-labelledby="apply-tab-mcp" hidden={method !== 'mcp'}>
                <p>{copy.mcpBody}</p>
                <pre className="home-apply__code"><code>{MCP_CONFIG}</code></pre>
                <div className="home-apply__foot">
                  <CopyButton text={MCP_CONFIG} copy={copy} />
                </div>
              </div>
              <div className="home-apply__panel" role="tabpanel" id="apply-panel-cli" aria-labelledby="apply-tab-cli" hidden={method !== 'cli'}>
                <p>{copy.cliBody}</p>
                <pre className="home-apply__code"><code>{CLI_COMMANDS}</code></pre>
                <div className="home-apply__foot">
                  <CopyButton text={CLI_COMMANDS} copy={copy} />
                  <a className="button" href={withLang('/pages/components', lang)}>{translate(lang, 'nav.components')}</a>
                </div>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
