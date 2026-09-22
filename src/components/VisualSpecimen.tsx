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
  const role = (name: TypographyRoleName): CSSProperties => typographyRoleStyle(spec.typography.roles[name], 'container');
  const tokens = {
    '--vs-canvas': spec.colors.canvas,
    '--vs-surface': spec.colors.surface,
    '--vs-surface-raised': spec.colors.surfaceRaised,
    '--vs-surface-muted': spec.colors.surfaceMuted,
    '--vs-text': spec.colors.text,
    '--vs-text-muted': spec.colors.textMuted,
    '--vs-border': spec.colors.border,
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
      <p data-type-role="caption" style={role('caption')}>{content.metricLabel}</p>
      <p className="visual-specimen__metric-value" data-type-role="data" style={role('data')}>{content.metric}</p>
      <p className="visual-specimen__muted" data-type-role="small" style={role('small')}>{content.caption}</p>
    </aside>
  );

  const rows = (
    <ul className="visual-specimen__items">
      {content.items.map((item, index) => (
        <li className="visual-specimen__item" key={index}>
          {fixtureId === 'editorial' && <span className="visual-specimen__index" data-type-role="caption" style={role('caption')}>0{index + 1}</span>}
          <div className="visual-specimen__item-copy">
            <h5 data-type-role="subheading" style={role('subheading')}>{item.title}</h5>
            <p className="visual-specimen__muted" data-type-role="small" style={role('small')}>{item.detail}</p>
          </div>
          <span className="visual-specimen__item-value" data-type-role="data" style={role('data')}>{item.value}</span>
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
      <header className="visual-specimen__hero">
        <div className="visual-specimen__intro">
          <p className="visual-specimen__eyebrow" data-type-role="caption" style={role('caption')}>{content.eyebrow}</p>
          <h3 data-type-role="display" style={role('display')}>{content.heading}</h3>
          <p className="visual-specimen__body" data-type-role="body" style={role('body')}>{content.body}</p>
          <span className="visual-specimen__action" data-type-role="label" style={role('label')}>{content.label}<span aria-hidden="true">↗</span></span>
        </div>
        {fixtureId !== 'editorial' && metric}
      </header>
      <section className="visual-specimen__section" aria-label={content.sectionHeading}>
        <div className="visual-specimen__section-heading">
          <h4 data-type-role="heading" style={role('heading')}>{content.sectionHeading}</h4>
          <p className="visual-specimen__muted" data-type-role="small" style={role('small')}>{content.sectionBody}</p>
        </div>
        {fixtureId === 'editorial' ? <div className="visual-specimen__editorial-content">{rows}{metric}</div> : rows}
      </section>
      <footer className="visual-specimen__footer" data-type-role="caption" style={role('caption')}>{content.footer}</footer>
    </article>
  );
}
