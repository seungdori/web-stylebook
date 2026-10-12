import { useMemo, useState } from 'react';
import type { Lang } from '../data/styles';
import { VisualSpecimen } from '../components/VisualSpecimen';
import { resolveVisualContract } from '../visual';
import { TYPOGRAPHY_ROLES } from '../visual/types';
import type { TypographyRoleName } from '../visual/types';
import { useDesignWorkspace } from '../visual/useDesignWorkspace';
import { getActiveSpecimenFonts } from '../visual/fontLoader';
import { useActiveFonts } from '../visual/useActiveFonts';
import { DesignExport, EditorToolbar, PreviewCopyEditor } from './visual-editor/EditorCommon';
import { TypographyRoleLadder } from './visual-editor/TypographyRoleLadder';
import { editorCopy, fontStateLabel, roleName, typographyRoleNames } from './visual-editor/copy';
import { numberFields, parseTypographyDraft } from './visual-editor/typographyDraft';
import type { NumberField, TypographyDraft } from './visual-editor/typographyDraft';
import { useEditorStylePreset } from './visual-editor/useEditorStylePreset';
import './visual-editor/editor.css';

export default function Typography({ lang }: { lang: Lang }) {
  const { resetEpoch } = useDesignWorkspace();
  useEditorStylePreset();
  return <TypographyEditor key={resetEpoch} lang={lang} />;
}

function TypographyEditor({ lang }: { lang: Lang }) {
  const { draft, resolved, setTypographyRole } = useDesignWorkspace();
  const t = editorCopy[lang];
  const [role, setRole] = useState<TypographyRoleName>('heading');
  const [inputs, setInputs] = useState<Partial<Record<TypographyRoleName, TypographyDraft>>>({});
  const [width, setWidth] = useState<'narrow' | 'wide'>('wide');
  const [showOriginal, setShowOriginal] = useState(false);
  const original = useMemo(() => resolveVisualContract(draft.styleId, {
    mode: draft.mode, contentLocale: draft.contentLocale,
    overrides: { ...draft.overrides, typography: undefined, fonts: undefined }, acceptedRepairs: draft.acceptedRepairs,
  }), [draft.styleId, draft.mode, draft.contentLocale, draft.overrides, draft.acceptedRepairs]);
  const fonts = useMemo(() => showOriginal ? [...getActiveSpecimenFonts(resolved), ...getActiveSpecimenFonts(original)] : getActiveSpecimenFonts(resolved),
    [showOriginal, resolved, original]);
  const fontStates = useActiveFonts(fonts, draft.contentLocale);
  const current = resolved.typography.roles[role];
  const validation = parseTypographyDraft(current, inputs[role] ?? {});
  const pending = TYPOGRAPHY_ROLES.some((name) => parseTypographyDraft(resolved.typography.roles[name], inputs[name] ?? {}).patch === null);
  const changes = TYPOGRAPHY_ROLES.flatMap((name) => Object.entries(resolved.typography.roles[name]).flatMap(([field, value]) => {
    const before = original.typography.roles[name][field as keyof typeof current];
    return before === value ? [] : [{ role: name, field, before, value, kind: changeKind(field) }];
  }));
  const fontChanges = changes.filter((change) => change.kind === 'font');
  const spacingChanges = changes.filter((change) => change.kind === 'spacing');
  const otherChanges = changes.filter((change) => change.kind === 'other');

  function update(field: keyof TypographyDraft, value: string) {
    const next = { ...inputs[role], [field]: value };
    setInputs((previous) => ({ ...previous, [role]: next }));
    const parsed = parseTypographyDraft(current, next);
    if (parsed.patch) setTypographyRole(role, parsed.patch);
  }
  function errorFor(field: keyof TypographyDraft) {
    const error = validation.errors[field];
    return error === 'font' ? t.invalidFont : error === 'scale' ? t.invalidScale : t.invalidNumber;
  }
  function number(field: NumberField) {
    const limits = numberFields[field];
    const invalid = Boolean(validation.errors[field]);
    return <label key={field} className="visual-editor-number">{t[field]}
      <input type="text" inputMode="decimal" value={inputs[role]?.[field] ?? current[field]}
        aria-invalid={invalid} aria-describedby={`type-${field}-help${invalid ? ` type-${field}-error` : ''}`}
        onChange={(event) => update(field, event.target.value)} />
      <small id={`type-${field}-help`}>{limits.min} – {limits.max}</small>
      {invalid && <span id={`type-${field}-error`} className="visual-editor-error">{errorFor(field)}</span>}
    </label>;
  }
  const fontInvalid = Boolean(validation.errors.fontFamily);
  const family = current.fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
  const metadata = resolved.typography.fonts.find((font) => font.family === family);
  const unavailableWeight = metadata?.source === 'external' && !metadata.weights.includes(current.fontWeight);
  return <div className="visual-editor">
    <section className="page-hero"><h1>{t.typographyTitle}</h1><p>{t.typographyDescription}</p></section>
    <EditorToolbar lang={lang} axis="typography" onReset={() => setInputs({})} />
    <div className="visual-editor-layout">
      <aside className="visual-editor-controls">
        <label>{t.role}<select value={role} onChange={(event) => setRole(event.target.value as TypographyRoleName)}>
          {TYPOGRAPHY_ROLES.map((name) => <option key={name} value={name}>{roleName(typographyRoleNames[name], lang)}</option>)}
        </select></label>
        <fieldset>{(['sizeMinRem', 'sizeMaxRem', 'fontWeight', 'lineHeight'] as const).map(number)}</fieldset>
        {unavailableWeight && <p className="visual-editor-note" role="status">{family} · {current.fontWeight}: {t.weightWarning}</p>}
        <details><summary>{t.advanced}</summary><div className="visual-editor-fields">
          {(['letterSpacingEm', 'measureCh', 'paragraphSpacingEm'] as const).map(number)}
        </div>
          <label>{t.fontFamily}<input value={inputs[role]?.fontFamily ?? current.fontFamily} spellCheck={false}
            aria-invalid={fontInvalid} aria-describedby={fontInvalid ? 'type-font-error' : undefined}
            onChange={(event) => update('fontFamily', event.target.value)} />
            {fontInvalid && <span id="type-font-error" className="visual-editor-error">{t.invalidFont}</span>}
          </label>
        </details>
      </aside>
      <section className="visual-editor-preview" aria-labelledby="type-preview-title">
        <div className="visual-editor-preview__head"><h2 id="type-preview-title">{t.edited}</h2>
          <div className="segmented" aria-label={t.previewWidth}>{(['narrow', 'wide'] as const).map((value) => <button type="button" key={value} aria-pressed={width === value}
            className={width === value ? 'is-active' : ''} onClick={() => setWidth(value)}>{t[value]}</button>)}</div>
          <label><input type="checkbox" checked={showOriginal} onChange={(event) => setShowOriginal(event.target.checked)} />{t.showOriginal}</label>
        </div>
        <VisualSpecimen spec={resolved} fixtureId={draft.fixtureId} lang={draft.contentLocale} copy={draft.previewCopy} width={width} />
        <div className="type-workbench-intro">
          <h3>{t.roleLadder}</h3>
          <p className="visual-editor-note">{t.roleLadderNote}</p>
          {draft.contentLocale !== 'en' && <p className="visual-editor-note">{t.localeAdjustNote}</p>}
        </div>
        <TypographyRoleLadder spec={resolved} contentLocale={draft.contentLocale} uiLang={lang} width={width} activeRole={role} />
        {showOriginal && <div className="visual-editor-original"><h3>{t.original}</h3>
          <VisualSpecimen spec={original} fixtureId={draft.fixtureId} lang={draft.contentLocale} copy={draft.previewCopy} width={width} />
        </div>}
        <PreviewCopyEditor lang={lang} />
        <div className="visual-editor-fonts" aria-live="polite"><h3>{t.fontStatus}</h3>
          <ul>{fontStates.map((font, index) => <li key={`${font.family}-${index}`} data-font-status={font.status}>
            <strong>{font.family}</strong> — {fontStateLabel(font, lang)}
          </li>)}</ul><p className="visual-editor-note">{t.fontNote}</p>
        </div>
        <details><summary>{t.changes} ({changes.length})</summary>
          {changes.length ? <>
            <ChangeList title={t.fontChanges} changes={fontChanges} lang={lang} labels={t} />
            <ChangeList title={t.spacingChanges} changes={spacingChanges} lang={lang} labels={t} />
            <ChangeList title={t.otherChanges} changes={otherChanges} lang={lang} labels={t} />
          </> : <p className="visual-editor-note">{t.unchanged}</p>}
        </details>
      </section>
    </div>
    <DesignExport lang={lang} spec={resolved} blocked={pending} />
  </div>;
}

const fontFields = new Set(['fontFamily', 'fontWeight', 'fontStyle']);
const spacingFields = new Set(['sizeMinRem', 'sizeMaxRem', 'lineHeight', 'letterSpacingEm', 'paragraphSpacingEm', 'measureCh']);

function changeKind(field: string): 'font' | 'spacing' | 'other' {
  if (fontFields.has(field)) return 'font';
  if (spacingFields.has(field)) return 'spacing';
  return 'other';
}

function ChangeList({ title, changes, lang, labels }: {
  title: string;
  changes: Array<{ role: TypographyRoleName; field: string; before: unknown; value: unknown }>;
  lang: Lang;
  labels: (typeof editorCopy)['en'];
}) {
  if (!changes.length) return null;
  return <>
    <h3 className="type-workbench__group">{title} ({changes.length})</h3>
    <ul className="visual-editor-changes">{changes.map((change) => <li key={`${change.role}-${change.field}`}>
      {roleName(typographyRoleNames[change.role], lang)} · {labels[change.field as keyof typeof labels] ?? change.field}: {String(change.before)} → {String(change.value)}
    </li>)}</ul>
  </>;
}
