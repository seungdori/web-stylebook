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
  const fontStates = useActiveFonts(getActiveSpecimenFonts(resolved), draft.contentLocale);
  const textStyle = (name: keyof typeof resolved.typography.roles) => typographyRoleStyle(resolved.typography.roles[name], 'container');
  const previewVariables = Object.fromEntries(Object.entries(colors).map(([role, value]) => [
    `--role-${role.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, value,
  ])) as CSSProperties;

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
        <div className="color-role-preview" style={{ ...previewVariables, ...textStyle('body'), maxWidth: undefined, borderRadius: resolved.radii.lg }} lang={draft.contentLocale}>
          <form className="color-role-preview__card" style={{ borderRadius: resolved.radii.md, boxShadow: resolved.shadows.md }}
            onSubmit={(event) => { event.preventDefault(); setSampleSaved(true); }}>
            <p className="color-role-preview__muted" style={textStyle('caption')}>{draft.previewCopy.caption || previewText.sampleCaption}</p>
            <h3 style={textStyle('heading')}>{draft.previewCopy.heading || previewText.sampleHeading}</h3>
            <p style={textStyle('body')}>{draft.previewCopy.body || previewText.sampleBody}</p>
            <div className="color-role-preview__raised">
              <label style={textStyle('label')}>{previewText.email}<input type="email" placeholder={previewText.placeholder} onChange={() => setSampleSaved(false)} /></label>
              <p className="color-role-preview__muted" style={textStyle('small')}>{previewText.sampleCaption}</p>
            </div>
            <div className="color-role-preview__actions">
              <button type="submit" style={{ ...textStyle('label'), borderRadius: resolved.radii.sm }}>{draft.previewCopy.label || previewText.primary}</button>
              <button type="button" aria-pressed={sampleSelected} onClick={() => setSampleSelected((value) => !value)} style={{ ...textStyle('label'), borderRadius: resolved.radii.sm }}>{previewText.secondary}</button>
            </div>
            {sampleSelected && <div className="color-role-preview__selection">{previewText.sampleSelection}</div>}
            <a href="#color-preview-notes">{previewText.sampleLink}</a>
            <div className="color-role-preview__states" id="color-preview-notes">
              <p style={{ color: colors.positive }} role="status">{sampleSaved ? `✓ ${previewText.success}` : previewText.success}</p>
              <p style={{ color: colors.caution }}>{previewText.caution}</p>
              <p style={{ color: colors.critical }}>{previewText.critical}</p>
              <p style={{ color: colors.info }}>{previewText.info}</p>
            </div>
          </form>
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
