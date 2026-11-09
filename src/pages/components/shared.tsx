import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from '../../data/styles';
import { copyText } from '../../utils/clipboard';
import { Panel, Shell } from '../../kit/surface/surface';
import { SegmentedControl } from '../../kit/segmented-control/segmented-control';
import { copy, pick, type L } from './copy';
import { CheckIcon, CopyIcon, RefreshIcon } from './icons';
import { usePackageManager, type PackageManager } from './packageManager';
import { useScrollableTabStop } from './useScrollableTabStop';

const RUNNER: Record<PackageManager, string> = {
  npm: 'npx webstylebook add',
  pnpm: 'pnpm dlx webstylebook add',
  bun: 'bunx webstylebook add',
};

/* Copy button ------------------------------------------------------------------ */

export function CopyButton({ text, name, lang }: { text: string; name: string; lang: Lang }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const timer = window.setTimeout(() => setState('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  const label = state === 'copied' ? copy.copied : state === 'failed' ? copy.copyFailed : copy.copy;
  return (
    <span className="cmp-copy">
      {state === 'failed' ? <span className="cmp-copy__error">{pick(copy.copyFailed, lang)}</span> : null}
      <button
        type="button"
        className="cmp-icon-button"
        data-state={state}
        aria-label={`${pick(label, lang)}: ${name}`}
        onClick={() => {
          copyText(text).then(
            () => setState('copied'),
            (error: unknown) => {
              console.error('Copy to clipboard failed', error);
              setState('failed');
            },
          );
        }}
      >
        {state === 'copied' ? CheckIcon : CopyIcon}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === 'idle' ? '' : pick(label, lang)}
      </span>
    </span>
  );
}

export function ReplayButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="cmp-quiet" onClick={onClick}>
      {RefreshIcon}
      {label}
    </button>
  );
}

/* Code ------------------------------------------------------------------------- */

type CodeLanguage = 'tsx' | 'css';

// Enough to color the kit's own files. Each group name is a token class.
const CODE_PATTERNS: Record<CodeLanguage, RegExp> = {
  tsx: /(?<comment>\/\*[\s\S]*?\*\/|\/\/[^\n]*|<!--[\s\S]*?-->)|(?<string>"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(?<keyword>\b(?:import|from|export|default|function|const|let|return|if|else|type|interface|extends|typeof|new|true|false|null|undefined)\b)|(?<tag>(?<![\w])<\/?[A-Za-z][\w.-]*)|(?<attr>\b[a-zA-Z-]+(?==))/g,
  css: /(?<comment>\/\*[\s\S]*?\*\/)|(?<string>"[^"\n]*"|'[^'\n]*')|(?<keyword>@[\w-]+)|(?<attr>^\s*[a-z-]+(?=\s*:)|--[\w-]+)/gm,
};

function languageOf(path: string): CodeLanguage {
  return path.endsWith('.css') ? 'css' : 'tsx';
}

function highlight(code: string, language: CodeLanguage): ReactNode[] {
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const match of code.matchAll(CODE_PATTERNS[language])) {
    const kind = Object.entries(match.groups ?? {}).find(([, text]) => text !== undefined)?.[0];
    parts.push(code.slice(cursor, match.index));
    parts.push(
      <span key={match.index} className={`cmp-tok-${kind}`}>
        {match[0]}
      </span>,
    );
    cursor = match.index + match[0].length;
  }
  parts.push(code.slice(cursor));
  return parts;
}

function CodeBody({ code, path }: { code: string; path: string }) {
  const body = useMemo(() => highlight(code.trimEnd(), languageOf(path)), [code, path]);
  const scroller = useScrollableTabStop<HTMLPreElement>(code);
  return (
    <pre ref={scroller} className="cmp-code__body" role="group" tabIndex={0} aria-label={path}>
      <code>{body}</code>
    </pre>
  );
}

export interface SourceFile {
  path: string;
  code: string;
}

/** Several files, one visible at a time. */
export function CodePane({ files, lang }: { files: SourceFile[]; lang: Lang }) {
  const [active, setActive] = useState('0');
  const file = files[Number(active)];
  return (
    <div className="cmp-code">
      <div className="cmp-code__bar">
        <SegmentedControl
          size="sm"
          label={pick(copy.sourceFiles, lang)}
          value={active}
          options={files.map((item, index) => ({ value: String(index), label: item.path.split('/').pop() ?? item.path }))}
          onValueChange={setActive}
        />
        <CopyButton key={file.path} text={file.code} name={file.path.split('/').pop() ?? file.path} lang={lang} />
      </div>
      <CodeBody code={file.code} path={file.path} />
    </div>
  );
}

/** One file in a framed box. */
export function CodeBlock({ code, title, lang }: { code: string; title: string; lang: Lang }) {
  return (
    <Shell className="cmp-box">
      <div className="cmp-box__bar">
        <code className="cmp-box__title">{title}</code>
        <CopyButton text={code} name={title} lang={lang} />
      </div>
      <Panel>
        <CodeBody code={code} path={title} />
      </Panel>
    </Shell>
  );
}

export function InstallBox({ names, lang }: { names: string[]; lang: Lang }) {
  const { manager, setManager } = usePackageManager();
  const components = names.join(' ');
  const command = `${RUNNER[manager]} ${components}`;
  const scroller = useScrollableTabStop<HTMLPreElement>(command);
  return (
    <Shell className="cmp-box">
      <div className="cmp-box__bar">
        <SegmentedControl
          size="sm"
          label={pick(copy.packageManager, lang)}
          value={manager}
          options={[
            { value: 'npm', label: 'npm' },
            { value: 'pnpm', label: 'pnpm' },
            { value: 'bun', label: 'bun' },
          ]}
          onValueChange={setManager}
        />
        <CopyButton key={command} text={command} name={pick(copy.install, lang)} lang={lang} />
      </div>
      <Panel>
        <pre ref={scroller} className="cmp-code__body" role="group" tabIndex={0} aria-label={pick(copy.install, lang)}>
          <code>
            <span className="cmp-tok-comment">{RUNNER[manager]}</span> {components}
          </code>
        </pre>
      </Panel>
    </Shell>
  );
}

export type PropRow = [name: string, type: string, fallback: string, description: L];

export function PropsTable({ rows, lang }: { rows: PropRow[]; lang: Lang }) {
  const scroller = useScrollableTabStop<HTMLDivElement>(rows.length);
  return (
    <Panel>
      <div ref={scroller} className="cmp-table" role="region" tabIndex={0} aria-label={pick(copy.props, lang)}>
        <table>
          <thead>
            <tr>
              {copy.columns.map((column) => (
                <th scope="col" key={column.en}>
                  {pick(column, lang)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, type, fallback, description]) => (
              <tr key={name}>
                <th scope="row">
                  <code>{name}</code>
                </th>
                <td>
                  <code>{type}</code>
                </td>
                <td>
                  <code>{fallback}</code>
                </td>
                <td>{pick(description, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
