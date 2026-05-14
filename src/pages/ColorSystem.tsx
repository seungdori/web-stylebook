import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Lang } from '../data/styles';
import { localize, styleCatalog } from '../data/styles';
import { translate } from '../data/i18n';
import { contrastLabel, contrastRatio, isDark, normalizeHex, readableOn } from '../utils/color';
import { copyText } from '../utils/clipboard';

type PaletteState = {
  bg: string;
  text: string;
  main: string;
  sub: string;
};

type PreviewCopy = {
  kicker: string;
  title: string;
  body: string;
  primary: string;
  secondary: string;
};

const initialPalette: PaletteState = {
  bg: '#ffffff',
  text: '#09090b',
  main: '#007aff',
  sub: '#16a34a',
};

function defaultPreviewCopy(lang: Lang): PreviewCopy {
  return {
    kicker: translate(lang, 'colors.preview'),
    title: 'Harmony & Balance',
    body: 'Interface colors should support reading, action hierarchy, and repeated scanning without fighting the content.',
    primary: 'Primary Action',
    secondary: 'Secondary',
  };
}

function previewEditLabel(lang: Lang, editing: boolean) {
  if (lang === 'ko') return editing ? '미리보기 편집 완료' : '미리보기 내용 편집';
  if (lang === 'ja') return editing ? 'プレビュー編集を完了' : 'プレビュー内容を編集';
  return editing ? 'Finish editing preview copy' : 'Edit preview copy';
}

export function ColorSystem({ lang }: { lang: Lang }) {
  const [palette, setPalette] = useState<PaletteState>(initialPalette);
  const [filter, setFilter] = useState<'all' | 'dark' | 'light'>('all');
  const [format, setFormat] = useState<'css' | 'json'>('css');
  const [copied, setCopied] = useState(false);
  const [previewEditing, setPreviewEditing] = useState(false);
  const [previewOverrides, setPreviewOverrides] = useState<Partial<PreviewCopy>>({});
  const defaultCopy = useMemo(() => defaultPreviewCopy(lang), [lang]);
  const previewCopy = { ...defaultCopy, ...previewOverrides };

  const presets = useMemo(
    () => styleCatalog.map((style) => {
      const bg = normalizeHex(style.palette[0]) || '#ffffff';
      const text = normalizeHex(style.palette[style.palette.length - 1]) || readableOn(bg);
      const main = normalizeHex(style.accent) || style.palette.find((color) => normalizeHex(color)) || '#007aff';
      const sub = normalizeHex(style.palette[1]) || main;
      return {
        id: style.id,
        name: style.name,
        colors: { bg, text, main, sub },
        dark: isDark(bg),
      };
    }),
    [],
  );

  const filtered = presets.filter((preset) => {
    if (filter === 'dark') return preset.dark;
    if (filter === 'light') return !preset.dark;
    return true;
  });

  function update(key: keyof PaletteState, value: string) {
    const normalized = normalizeHex(value);
    setPalette((current) => ({ ...current, [key]: normalized || value }));
  }

  function randomPalette() {
    const source = filtered.length > 0 ? filtered : presets;
    const preset = source[Math.floor(Math.random() * source.length)];
    setPalette(preset.colors);
  }

  function updatePreviewCopy(key: keyof PreviewCopy, value: string) {
    setPreviewOverrides((current) => ({ ...current, [key]: value }));
  }

  const ratios = [
    ['Text / BG', palette.text, palette.bg],
    ['Main / BG', palette.main, palette.bg],
    ['Sub / BG', palette.sub, palette.bg],
  ].map(([label, fg, bg]) => {
    const ratio = contrastRatio(fg, bg);
    return { label, ratio, grade: contrastLabel(ratio) };
  });

  const exportText = format === 'css'
    ? `:root {\n  --color-bg: ${palette.bg};\n  --color-text: ${palette.text};\n  --color-primary: ${palette.main};\n  --color-secondary: ${palette.sub};\n}`
    : JSON.stringify({ colors: palette }, null, 2);

  async function copyExport() {
    await copyText(exportText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <>
      <section className="page-hero">
        <p className="hero__eyebrow">Color Tokens</p>
        <h1>{translate(lang, 'colors.title')}</h1>
        <p>{translate(lang, 'colors.desc')}</p>
      </section>

      <section className="color-layout" style={{
        '--preview-bg': palette.bg,
        '--preview-text': palette.text,
        '--preview-main': palette.main,
        '--preview-sub': palette.sub,
      } as CSSProperties}>
        <aside className="color-panel">
          {(['bg', 'text', 'main', 'sub'] as const).map((key) => (
            <label key={key} className="color-input-row">
              <span>
                {translate(lang, `colors.${key}`)}
                <small>{palette[key]}</small>
              </span>
              <input type="color" value={normalizeHex(palette[key]) || '#000000'} onChange={(event) => update(key, event.target.value)} />
              <input value={palette[key]} onChange={(event) => update(key, event.target.value)} />
            </label>
          ))}

          <div className="contrast-box">
            {ratios.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.ratio.toFixed(1)}:1</strong>
                <em className={`grade grade--${item.grade.replace(/\s/g, '-').toLowerCase()}`}>{item.grade}</em>
              </div>
            ))}
          </div>
        </aside>

        <section className="color-preview">
          <div className={`preview-card${previewEditing ? ' preview-card--editing' : ''}`}>
            <button
              className={`preview-edit-toggle${previewEditing ? ' is-active' : ''}`}
              type="button"
              aria-label={previewEditLabel(lang, previewEditing)}
              title={previewEditLabel(lang, previewEditing)}
              onClick={() => setPreviewEditing((current) => !current)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 20h4l10.5-10.5-4-4L4 16v4Z" />
                <path d="m13.5 6.5 4 4" />
              </svg>
              <span>{lang === 'ko' ? (previewEditing ? '완료' : '편집') : previewEditing ? 'Done' : 'Edit'}</span>
            </button>

            {previewEditing ? (
              <div className="preview-edit-form">
                <input
                  className="preview-edit-input preview-edit-input--kicker"
                  value={previewCopy.kicker}
                  aria-label="Preview eyebrow"
                  onChange={(event) => updatePreviewCopy('kicker', event.target.value)}
                />
                <input
                  className="preview-edit-input preview-edit-input--title"
                  value={previewCopy.title}
                  aria-label="Preview title"
                  onChange={(event) => updatePreviewCopy('title', event.target.value)}
                />
                <textarea
                  className="preview-edit-textarea"
                  value={previewCopy.body}
                  aria-label="Preview body"
                  onChange={(event) => updatePreviewCopy('body', event.target.value)}
                />
                <div className="preview-actions preview-actions--editing">
                  <input
                    className="preview-action-input preview-action-input--primary"
                    value={previewCopy.primary}
                    aria-label="Primary action text"
                    onChange={(event) => updatePreviewCopy('primary', event.target.value)}
                  />
                  <input
                    className="preview-action-input"
                    value={previewCopy.secondary}
                    aria-label="Secondary action text"
                    onChange={(event) => updatePreviewCopy('secondary', event.target.value)}
                  />
                </div>
              </div>
            ) : (
              <>
                <span className="preview-kicker">{previewCopy.kicker}</span>
                <h2>{previewCopy.title}</h2>
                <p>{previewCopy.body}</p>
                <div className="preview-actions">
                  <button type="button">{previewCopy.primary}</button>
                  <button type="button">{previewCopy.secondary}</button>
                </div>
              </>
            )}
          </div>
        </section>
      </section>

      <section className="palette-section">
        <div className="section__head">
          <h2>{translate(lang, 'colors.presets')}</h2>
          <div className="segmented">
            {(['all', 'dark', 'light'] as const).map((item) => (
              <button className={filter === item ? 'is-active' : ''} key={item} type="button" onClick={() => setFilter(item)}>
                {item === 'all' ? translate(lang, 'home.all') : translate(lang, `colors.${item}`)}
              </button>
            ))}
          </div>
          <button className="button" type="button" onClick={randomPalette}>
            {translate(lang, 'colors.random')}
          </button>
        </div>
        <div className="palette-grid">
          {filtered.map((preset) => (
            <button key={preset.id} type="button" onClick={() => setPalette(preset.colors)}>
              <span className="style-card__palette">
                {Object.values(preset.colors).map((color) => (
                  <i key={color} style={{ background: color }} />
                ))}
              </span>
              {localize(preset.name, lang)}
            </button>
          ))}
        </div>
      </section>

      <section className="export-panel">
        <div>
          <h2>{translate(lang, 'colors.export')}</h2>
          <div className="segmented">
            <button className={format === 'css' ? 'is-active' : ''} type="button" onClick={() => setFormat('css')}>
              {translate(lang, 'colors.css')}
            </button>
            <button className={format === 'json' ? 'is-active' : ''} type="button" onClick={() => setFormat('json')}>
              {translate(lang, 'colors.json')}
            </button>
          </div>
        </div>
        <pre>{exportText}</pre>
        <button className="button button--dark" type="button" onClick={copyExport}>
          {copied ? translate(lang, 'detail.copied') : translate(lang, 'colors.copy')}
        </button>
      </section>
    </>
  );
}
