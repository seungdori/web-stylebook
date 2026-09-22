import type { CSSProperties } from 'react';
import type { Lang } from '../data/styles';
import { getSpecimenCopy, type SpecimenCopy, type SpecimenFixtureId } from '../data/visualFixtures';
import { typographyRoleStyle, type ResolvedVisualContract, type TypographyRoleName } from '../visual';
import './VisualSpecimen.css';

export type { SpecimenFixtureId } from '../data/visualFixtures';

export interface VisualSpecimenProps {
  spec: ResolvedVisualContract;
  lang: Lang;
  fixtureId?: SpecimenFixtureId;
  copy?: Partial<Pick<SpecimenCopy, 'heading' | 'body' | 'label' | 'caption'>>;
  width?: 'narrow' | 'wide';
  compact?: boolean;
}

/** The same semantic content and markup are used for both sides of a comparison. */
export function VisualSpecimen({ spec, lang, fixtureId = 'product', copy, width = 'wide', compact = false }: VisualSpecimenProps) {
  const content = { ...getSpecimenCopy(fixtureId, lang) };
  for (const key of ['heading', 'body', 'label', 'caption'] as const) {
    const edited = copy?.[key];
    if (edited?.trim()) content[key] = edited;
  }
  // Paragraph spacing is a paragraph token: only running body copy carries it.
  // Headings, labels and captions are spaced by the layout so the rhythm stays even.
  const role = (name: TypographyRoleName, options: { paragraph?: boolean } = {}): CSSProperties => {
    const { marginBlockEnd, ...style } = typographyRoleStyle(spec.typography.roles[name], 'container');
    return options.paragraph ? { ...style, marginBlockEnd } : style;
  };
  // The key figure speaks in the display voice (family, weight, tracking) at a card-sized scale.
  const figure: CSSProperties = {
    ...role('display'),
    fontSize: 'clamp(2.5rem, 1.6rem + 3cqi, 4.25rem)',
    lineHeight: 1,
    maxWidth: 'none',
    fontVariantNumeric: 'tabular-nums lining-nums',
  };
  const tokens = {
    '--vs-canvas': spec.colors.canvas,
    '--vs-surface': spec.colors.surface,
    '--vs-surface-raised': spec.colors.surfaceRaised,
    '--vs-surface-muted': spec.colors.surfaceMuted,
    '--vs-text': spec.colors.text,
    '--vs-text-muted': spec.colors.textMuted,
    '--vs-border': spec.colors.border,
    '--vs-accent': spec.colors.accent,
    '--vs-action-primary': spec.colors.actionPrimary,
    '--vs-action-primary-text': spec.colors.actionPrimaryText,
    '--vs-secondary': spec.colors.accentSecondary,
    '--vs-secondary-text': spec.colors.accentSecondaryText,
    '--vs-unit': `${spec.spacing.unit}px`,
    '--vs-section': `${spec.spacing.section}px`,
    '--vs-stack': `${spec.spacing.stack}px`,
    '--vs-row': `${spec.spacing.row}px`,
    '--vs-gutter': `${spec.spacing.gutter}px`,
    '--vs-border-width': `${spec.borders.width}px`,
    '--vs-border-style': spec.borders.style,
    '--vs-radius-sm': `${spec.radii.sm}px`,
    '--vs-radius-md': `${spec.radii.md}px`,
    '--vs-radius-lg': `${spec.radii.lg}px`,
    '--vs-shadow': spec.shadows.md,
    colorScheme: spec.mode,
    // Fluid type belongs to descendants so cqi uses this specimen's container.
    fontFamily: spec.typography.roles.body.fontFamily,
  } as CSSProperties;

  const metric = (
    <aside className="visual-specimen__metric">
      <p className="visual-specimen__muted" data-type-role="caption" style={role('caption')}>{content.metricLabel}</p>
      <div className="visual-specimen__figure">
        <p className="visual-specimen__metric-value" data-type-role="display" style={figure}>{content.metric}</p>
        <p className="visual-specimen__muted" data-type-role="small" style={role('small')}>{content.caption}</p>
      </div>
    </aside>
  );

  const rows = (
    <ul className="visual-specimen__items">
      {content.items.map((item, index) => (
        <li className="visual-specimen__item" key={index}>
          <span className="visual-specimen__index" data-type-role="data" style={role('data')}>0{index + 1}</span>
          <div className="visual-specimen__item-copy">
            <h5 data-type-role="subheading" style={role('subheading')}>{item.title}</h5>
            <p className="visual-specimen__muted" data-type-role="small" style={role('small')}>{item.detail}</p>
          </div>
          {fixtureId === 'editorial'
            ? <span className="visual-specimen__item-value" data-type-role="data" style={role('data')}>{item.value}</span>
            : <span className="visual-specimen__tag" data-type-role="label" style={role('label')}>{item.value}</span>}
        </li>
      ))}
    </ul>
  );

  return (
    <article
      className={`visual-specimen visual-specimen--${fixtureId}`}
      lang={lang}
      data-fixture={fixtureId}
      data-width={width}
      data-compact={compact || undefined}
      data-visual-hash={spec.contentHash}
      style={tokens}
      aria-label={content.heading}
    >
      <div className="visual-specimen__page">
        <header className="visual-specimen__hero">
          <p className="visual-specimen__eyebrow" data-type-role="caption" style={role('caption')}>{content.eyebrow}</p>
          <h3 data-type-role="display" style={role('display')}>{content.heading}</h3>
          <div className="visual-specimen__deck">
            <div className="visual-specimen__lede">
              <p className="visual-specimen__body" data-type-role="body" style={role('body', { paragraph: true })}>{content.body}</p>
              <span className="visual-specimen__action" data-type-role="label" style={role('label')}>{content.label}<span aria-hidden="true">↗</span></span>
            </div>
            {fixtureId !== 'editorial' && metric}
          </div>
        </header>
        <section className="visual-specimen__section" aria-label={content.sectionHeading}>
          <div className="visual-specimen__section-head">
            <h4 data-type-role="heading" style={role('heading')}>{content.sectionHeading}</h4>
            <p className="visual-specimen__muted" data-type-role="small" style={role('small')}>{content.sectionBody}</p>
          </div>
          {fixtureId === 'editorial' ? <div className="visual-specimen__editorial-content">{rows}{metric}</div> : rows}
        </section>
        <footer className="visual-specimen__footer">
          <p className="visual-specimen__muted" data-type-role="caption" style={role('caption')}>{content.footer}</p>
        </footer>
      </div>
    </article>
  );
}
