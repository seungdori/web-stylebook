import { useState } from 'react';
import type { Lang } from '../../data/styles';
import { localize, styleCatalog } from '../../data/styles';
import { visualContractToCss } from '../../visual';
import type { ResolvedVisualContract } from '../../visual/types';
import { useDesignWorkspace } from '../../visual/useDesignWorkspace';
import { editorCopy } from './copy';
import { copyText } from '../../utils/clipboard';

export function EditorToolbar({ lang, axis, onReset }: { lang: Lang; axis: 'colors' | 'typography'; onReset: () => void }) {
  const { draft, authored, requestStyleSelection, setMode, setContentLocale, resetAxis, undo, canUndo } = useDesignWorkspace();
  const t = editorCopy[lang];
  return <div className="visual-editor-toolbar">
    <label>{t.style}<select value={draft.styleId} onChange={(event) => { if (requestStyleSelection(event.target.value)) onReset(); }}>
      {styleCatalog.map((style) => <option key={style.id} value={style.id}>{localize(style.name, lang)}</option>)}
    </select></label>
    <label>{t.defaultMode}<select value={draft.mode} disabled={Object.keys(authored.modes).length < 2}
      onChange={(event) => { setMode(event.target.value as 'light' | 'dark'); onReset(); }}>
      {Object.keys(authored.modes).map((mode) => <option key={mode} value={mode}>{mode === 'dark' ? { en: 'Dark', ko: '어두움', ja: 'ダーク' }[lang] : { en: 'Light', ko: '밝음', ja: 'ライト' }[lang]}</option>)}
    </select></label>
    <label>{t.contentLanguage}<select value={draft.contentLocale} onChange={(event) => { setContentLocale(event.target.value as Lang); onReset(); }}>
      <option value="en">English</option><option value="ko">한국어</option><option value="ja">日本語</option>
    </select></label>
    <div className="visual-editor-toolbar__actions">
      <button className="button" type="button" disabled={!canUndo} onClick={() => { undo(); onReset(); }}>{t.undo}</button>
      <button className="button" type="button" onClick={() => { resetAxis(axis); onReset(); }}>{t.reset}</button>
    </div>
  </div>;
}

export function PreviewCopyEditor({ lang }: { lang: Lang }) {
  const { draft, setPreviewCopy } = useDesignWorkspace();
  const t = editorCopy[lang];
  return <details className="visual-editor-copy">
    <summary>{t.editCopy}</summary>
    <div className="visual-editor-fields">
      {(['heading', 'body', 'label', 'caption'] as const).map((key) => <label key={key}>{t[key]}
        <textarea value={draft.previewCopy[key] ?? ''} rows={key === 'body' ? 3 : 1} maxLength={2000}
          placeholder={key === 'heading' ? editorCopy[draft.contentLocale].sampleHeading : key === 'body' ? editorCopy[draft.contentLocale].sampleBody : key === 'label' ? editorCopy[draft.contentLocale].primary : editorCopy[draft.contentLocale].sampleCaption}
          onChange={(event) => setPreviewCopy({ [key]: event.target.value })} />
      </label>)}
    </div>
  </details>;
}

export function DesignExport({ lang, spec, blocked = false }: { lang: Lang; spec: ResolvedVisualContract; blocked?: boolean }) {
  const t = editorCopy[lang];
  const { flush } = useDesignWorkspace();
  const [format, setFormat] = useState<'css' | 'json'>('css');
  const [copyResult, setCopyResult] = useState<'idle' | 'done' | 'error'>('idle');
  const exportText = format === 'css' ? visualContractToCss(spec) : JSON.stringify(spec, null, 2);
  async function copy() {
    try {
      flush();
      await copyText(exportText);
      setCopyResult('done');
    } catch { setCopyResult('error'); }
  }
  return <section className="visual-editor-export" aria-labelledby="visual-export-title">
    <div className="visual-editor-export__head"><h2 id="visual-export-title">{t.export}</h2>
      <div className="segmented">{(['css', 'json'] as const).map((item) => <button key={item} className={format === item ? 'is-active' : ''} type="button" aria-pressed={format === item}
        onClick={() => { setFormat(item); setCopyResult('idle'); }}>{t[item]}</button>)}</div>
      <button className="button button--dark" type="button" disabled={blocked} onClick={copy}>{copyResult === 'done' ? t.copied : t.copy}</button>
    </div>
    {blocked ? <p className="visual-editor-error" role="alert">{t.pending}</p> : <pre tabIndex={0}>{exportText}</pre>}
    {copyResult === 'error' && <p className="visual-editor-error" role="alert">{t.copyError}</p>}
    <p className="visual-editor-note"><code>{spec.styleId}</code> · {spec.contentHash}</p>
  </section>;
}
