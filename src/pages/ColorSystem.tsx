import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Lang } from '../data/styles';
import { assessContrast, proposeContrastRepairs, typographyRoleStyle } from '../visual';
import type { ColorRole } from '../visual/types';
import { parseEditorColor } from './visual-editor/colorDraft';
import { getActiveSpecimenFonts } from '../visual/fontLoader';
import { useActiveFonts } from '../visual/useActiveFonts';
import { useDesignWorkspace } from '../visual/useDesignWorkspace';
import { normalizeHex } from '../utils/color';
import { DesignExport, EditorToolbar, PreviewCopyEditor } from './visual-editor/EditorCommon';
import { colorPreviewRegionMap, colorPreviewVariables, colorRoleVariable } from './visual-editor/colorPreview';
import { colorRoleNames, editorCopy, fontStateLabel, roleName } from './visual-editor/copy';
import { useEditorStylePreset } from './visual-editor/useEditorStylePreset';
import './visual-editor/editor.css';

const basicRoles: ColorRole[] = ['canvas', 'surface', 'text', 'actionPrimary', 'actionPrimaryText', 'actionSecondary', 'actionSecondaryText'];
const surfaceRoles: ColorRole[] = ['surfaceRaised', 'surfaceMuted', 'textMuted', 'textInverse', 'link', 'accent', 'accentText', 'accentSecondary', 'accentSecondaryText'];
const stateRoles: ColorRole[] = ['border', 'borderStrong', 'focus', 'positive', 'caution', 'critical', 'info'];

export function ColorSystem({ lang }: { lang: Lang }) {
  const { resetEpoch } = useDesignWorkspace();
  useEditorStylePreset();
  return <ColorEditor key={resetEpoch} lang={lang} />;
}

function ColorEditor({ lang }: { lang: Lang }) {
  const workspace = useDesignWorkspace();
  const { draft, resolved, setColorRole, acceptRepair } = workspace;
  const [inputs, setInputs] = useState<Partial<Record<ColorRole, string>>>({});
  const [sampleSaved, setSampleSaved] = useState(false);
  const [sampleSelected, setSampleSelected] = useState(false);
  const t = editorCopy[lang];
  const previewText = editorCopy[draft.contentLocale];
  const checks = useMemo(() => assessContrast(resolved), [resolved]);
  const repairs = useMemo(() => proposeContrastRepairs(resolved), [resolved]);
  const pending = Object.values(inputs).some((value) => parseEditorColor(value) === null);
  const colors = resolved.colors;
  const paintedRoles = useMemo(() => ({
    heading: draft.previewCopy.heading || previewText.sampleHeading,
    body: [
      draft.previewCopy.body || previewText.sampleBody,
      previewText.sampleCaption, previewText.sampleLink, previewText.sampleSelection,
      previewText.success, previewText.caution, previewText.critical, previewText.info,
      roleName(colorRoleNames.accent, lang), roleName(colorRoleNames.textInverse, lang), roleName(colorRoleNames.focus, lang),
    ].join('\n'),
    caption: draft.previewCopy.caption || previewText.sampleCaption,
    label: [previewText.email, draft.previewCopy.label || previewText.primary, previewText.secondary, previewText.placeholder].join('\n'),
    small: previewText.sampleCaption,
  }), [draft.previewCopy, previewText, lang]);
  const fontStates = useActiveFonts(getActiveSpecimenFonts(resolved, paintedRoles), draft.contentLocale);
  const textStyle = (name: keyof typeof resolved.typography.roles) => typographyRoleStyle(resolved.typography.roles[name], 'container');
  const regions = useMemo(() => colorPreviewRegionMap(resolved.components), [resolved.components]);
  const region = (id: string) => {
    const found = regions.get(id);
    if (!found) throw new Error(`Color preview is missing '${id}'`);
    return found;
  };
  const frame = {
    borderWidth: resolved.borders.width,
    borderStyle: resolved.borders.style,
    borderColor: colorRoleVariable('border'),
  };

  function update(role: ColorRole, value: string) {
    setInputs((previous) => ({ ...previous, [role]: value }));
    const parsed = parseEditorColor(value);
    if (parsed !== null) setColorRole(role, parsed);
  }
  function field(role: ColorRole) {
    const value = inputs[role] ?? colors[role];
    const invalid = parseEditorColor(value) === null;
    const name = roleName(colorRoleNames[role], lang);
    const picker = normalizeHex(colors[role]);
    return <div className="visual-editor-role" key={role}>
      <label htmlFor={`color-${role}`}>{name}</label>
      {picker ? <input type="color" value={picker} aria-label={name} onChange={(event) => update(role, event.target.value)} />
        : <span style={{ background: colors[role], height: 36, border: '1px solid var(--line)' }} aria-hidden="true" />}
      <input id={`color-${role}`} type="text" value={value} spellCheck={false} aria-invalid={invalid} aria-describedby={invalid ? `color-${role}-error` : undefined}
        onChange={(event) => update(role, event.target.value)} />
      {invalid && <p id={`color-${role}-error`} className="visual-editor-error">{t.invalidColor}</p>}
    </div>;
  }
  return <div className="visual-editor">
    <section className="page-hero"><h1>{t.colorsTitle}</h1><p>{t.colorsDescription}</p></section>
    <EditorToolbar lang={lang} axis="colors" onReset={() => setInputs({})} />
    <div className="visual-editor-layout">
      <aside className="visual-editor-controls">
        <fieldset><legend>{t.basics}</legend>{basicRoles.map(field)}</fieldset>
        <details><summary>{t.surfaces}</summary><fieldset>{surfaceRoles.map(field)}</fieldset></details>
        <details><summary>{t.states}</summary><fieldset>{stateRoles.map(field)}</fieldset></details>
        <p className="visual-editor-note">{t.defaultMode}: {resolved.mode === 'dark' ? { en: 'Dark', ko: '어두움', ja: 'ダーク' }[lang] : { en: 'Light', ko: '밝음', ja: 'ライト' }[lang]}</p>
      </aside>
      <section className="visual-editor-preview" aria-labelledby="color-preview-title">
        <div className="visual-editor-preview__head"><h2 id="color-preview-title">{t.preview}</h2></div>
        <div className="color-role-preview" data-pair="body-canvas" lang={draft.contentLocale} style={{ ...colorPreviewVariables(colors), ...textStyle('body'), ...region('body-canvas').style, ...frame, maxWidth: undefined, borderRadius: resolved.radii.lg, colorScheme: resolved.mode } as CSSProperties}>
          <form className="color-role-preview__card" data-pair="body-panel" style={{ ...region('body-panel').style, ...frame, borderRadius: resolved.radii.md, boxShadow: resolved.shadows.md }}
            onSubmit={(event) => { event.preventDefault(); setSampleSaved(true); }}>
            <p className="color-role-preview__muted" data-pair="muted-panel" style={{ ...textStyle('caption'), ...region('muted-panel').style }}>{draft.previewCopy.caption || previewText.sampleCaption}</p>
            <h3 style={textStyle('heading')}>{draft.previewCopy.heading || previewText.sampleHeading}</h3>
            <p style={textStyle('body')}>{draft.previewCopy.body || previewText.sampleBody}</p>
            <div className="color-role-preview__muted-surface" data-pair="muted-surface" style={region('muted-surface').style}>{previewText.sampleCaption}</div>
            <div className="color-role-preview__raised" data-pair="input-placeholder" style={{ backgroundColor: region('input-placeholder').style.backgroundColor }}>
              <label style={textStyle('label')}>{previewText.email}
                <input data-pair="input-boundary" type="email" placeholder={previewText.placeholder} onChange={() => setSampleSaved(false)}
                  style={{ ...region('input-placeholder').style, color: colorRoleVariable('text'), ...region('input-boundary').style, borderWidth: resolved.borders.width, borderRadius: resolved.radii.sm }} />
              </label>
              <p className="color-role-preview__muted" style={{ ...textStyle('small'), color: colorRoleVariable('textMuted') }}>{previewText.sampleCaption}</p>
            </div>
            <div className="color-role-preview__actions">
              <button data-pair="primary-action" type="submit" style={{ ...textStyle('label'), ...region('primary-action').style, borderRadius: resolved.radii.sm }}>{draft.previewCopy.label || previewText.primary}</button>
              <button data-pair="secondary-action" type="button" aria-pressed={sampleSelected} onClick={() => setSampleSelected((value) => !value)} style={{ ...textStyle('label'), ...region('secondary-action').style, borderRadius: resolved.radii.sm }}>{previewText.secondary}</button>
            </div>
            <div className="color-role-preview__selection" data-pair="selection" data-selected={sampleSelected || undefined} style={{ ...region('selection').style, borderRadius: resolved.radii.sm, outline: sampleSelected ? `3px solid ${colorRoleVariable('focus')}` : undefined }}>{previewText.sampleSelection}</div>
            <div className="color-role-preview__identities">
              <p className="color-role-preview__chip" data-pair="accent-identity" style={{ ...region('accent-identity').style, borderRadius: resolved.radii.sm }}>{roleName(colorRoleNames.accent, lang)}</p>
              <p className="color-role-preview__chip" data-pair="inverse-text" style={{ ...region('inverse-text').style, borderRadius: resolved.radii.sm }}>{roleName(colorRoleNames.textInverse, lang)}</p>
              <span className="color-role-preview__focus-sample" data-pair="focus-surface" style={{ ...region('focus-surface').style, borderRadius: resolved.radii.sm }}>{roleName(colorRoleNames.focus, lang)}</span>
            </div>
            <div className="color-role-preview__states" id="color-preview-notes">
              <p data-pair="positive-status" style={region('positive-status').style} role="status">{sampleSaved ? `✓ ${previewText.success}` : previewText.success}</p>
              <p data-pair="caution-status" style={region('caution-status').style}>{previewText.caution}</p>
              <p data-pair="critical-status" style={region('critical-status').style}>{previewText.critical}</p>
              <p data-pair="info-status" style={region('info-status').style}>{previewText.info}</p>
            </div>
          </form>
          <div className="color-role-preview__canvas-row">
            <a data-pair="link-canvas" href="#color-preview-notes" style={region('link-canvas').style}>{previewText.sampleLink}</a>
            <span className="color-role-preview__focus-sample" data-pair="focus-canvas" style={{ ...region('focus-canvas').style, borderRadius: resolved.radii.sm }}>{roleName(colorRoleNames.focus, lang)}</span>
          </div>
          <div className="color-role-preview__rule" data-pair="decorative-separator" role="separator" style={region('decorative-separator').style} />
        </div>
        <PreviewCopyEditor lang={lang} />
        <details className="visual-editor-fonts"><summary>{t.fontStatus}</summary><ul>{fontStates.map((font, index) => <li key={`${font.family}-${index}`} data-font-status={font.status}>
          {font.family} — {fontStateLabel(font, lang)}
        </li>)}</ul><p className="visual-editor-note">{t.fontNote}</p></details>
      </section>
    </div>
    <section className="visual-editor-contrast" aria-labelledby="color-contrast-title">
      <h2 id="color-contrast-title">{t.contrast}</h2>
      <table><thead><tr><th scope="col">{t.preview}</th><th scope="col">{t.ratio}</th><th scope="col">{t.result}</th></tr></thead>
        <tbody>{checks.map((check) => <tr key={check.id}>
          <td>{roleName(colorRoleNames[check.foreground], lang)} / {roleName(colorRoleNames[check.background], lang)}</td>
          <td>{check.ratio === null ? '—' : `${check.ratio.toFixed(2)}:1`}{check.threshold !== null && <small> / {check.threshold}:1</small>}</td>
          <td data-result={check.status}>{check.status === 'pass' ? t.pass : check.status === 'fail' ? t.fail : check.status === 'not-applicable' ? t.na : t.rendered}</td>
        </tr>)}</tbody>
      </table><p className="visual-editor-note">{t.contrastNote}</p>
    </section>
    {repairs.length > 0 && <details className="visual-editor-repairs"><summary>{t.repairs} ({repairs.length})</summary>
      {repairs.map((repair) => <div key={repair.id} className="visual-editor-repair"><p>{roleName(colorRoleNames[repair.role], lang)}: <code>{repair.before}</code> → <code>{repair.after}</code></p>
        <button className="button" type="button" onClick={() => { acceptRepair(repair); setInputs((previous) => { const next = { ...previous }; delete next[repair.role]; return next; }); }}>{t.repair}</button>
      </div>)}
    </details>}
    <details className="visual-editor-copy"><summary>{t.usage}</summary><ul lang="en">{resolved.usage.preserve.map((rule) => <li key={rule}>{rule}</li>)}</ul></details>
    <DesignExport lang={lang} spec={resolved} blocked={pending} />
  </div>;
}
