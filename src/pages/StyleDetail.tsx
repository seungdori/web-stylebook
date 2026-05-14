import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import type { Lang, StyleData } from '../data/styles';
import { localize } from '../data/styles';
import { getStylePageBlueprint, type StylePageBlueprint } from '../data/stylePages';
import { translate } from '../data/i18n';
import { PromptBlock } from '../components/PromptBlock';
import { PageNav } from '../components/PageNav';
import { withLang } from '../utils/language';
import { portedStylePages } from '../ported/registry';

interface StyleDetailProps {
  style: StyleData;
  lang: Lang;
}

interface RendererProps {
  style: StyleData;
  blueprint: StylePageBlueprint;
  lang: Lang;
}

type StyleRenderer = (props: RendererProps) => ReactNode;

function buildPrompt(style: StyleData, lang: Lang) {
  const name = localize(style.name, lang);
  const summary = localize(style.summary, lang);
  return [
    `Design a web landing page in ${name} style.`,
    `Style summary: ${summary}`,
    `Typography: ${style.promptProfile.typography}.`,
    `Layout: ${style.promptProfile.layout}.`,
    `Motion: ${style.promptProfile.motion}.`,
    `Palette: ${style.palette.join(', ')}. Accent: ${style.accent}.`,
    `Best for: ${style.promptProfile.bestFor.join(', ')}.`,
    `Constraints: ${style.promptProfile.constraints.join('; ')}.`,
    'Return implementation-ready HTML/CSS or component structure with responsive layout, accessible contrast, and QA notes.',
  ].join('\n');
}

function cssVars(style: StyleData, blueprint: StylePageBlueprint): CSSProperties {
  return {
    '--style-bg': blueprint.bg,
    '--style-surface': blueprint.surface,
    '--style-text': blueprint.text,
    '--style-muted': blueprint.muted,
    '--style-line': blueprint.line,
    '--style-accent': style.accent,
    '--style-accent-2': blueprint.accent2,
    '--style-radius': blueprint.radius,
    '--style-heading-font': blueprint.headingFont,
    '--style-body-font': blueprint.bodyFont,
  } as CSSProperties;
}

function StyleTopbar({ style, blueprint, lang }: RendererProps) {
  return (
    <header className="style-topbar">
      <a href={withLang('/', lang)}>{translate(lang, 'detail.back')}</a>
      <span>{blueprint.number}</span>
      <div className="style-topbar__swatches" aria-label={translate(lang, 'card.palette')}>
        {style.palette.map((color) => (
          <i key={color} style={{ background: color }} title={color} />
        ))}
      </div>
    </header>
  );
}

function StyleHero({ style, blueprint, lang, children }: RendererProps & { children?: ReactNode }) {
  return (
    <section className="style-hero">
      <div className="style-hero__copy">
        <p className="style-eyebrow">{style.kind === 'fusion' ? 'Fusion System' : 'Style Reference'} / {blueprint.label}</p>
        <h1>{localize(style.name, lang)}</h1>
        <p className="style-lead">{localize(style.summary, lang)}</p>
        <div className="style-tags">
          {style.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <motion.div
        className="style-hero__specimen"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 130, damping: 20 }}
      >
        <span>{blueprint.number}</span>
        <strong>{blueprint.heroWord}</strong>
        <p>{blueprint.typographyExample}</p>
        {children}
      </motion.div>
    </section>
  );
}

function Overview({ style, blueprint, lang }: RendererProps) {
  return (
    <section className="style-overview-grid">
      <article className="style-panel style-panel--overview">
        <span className="style-panel__label">Overview</span>
        <h2>{translate(lang, 'detail.profile')}</h2>
        <p>{blueprint.overview}</p>
        {style.fusionOf ? (
          <div className="fusion-source">
            {style.fusionOf.map((id) => (
              <a key={id} href={withLang(`/pages/${id}.html`, lang)}>
                {id.replace(/-/g, ' ')}
              </a>
            ))}
          </div>
        ) : null}
      </article>
      <article className="style-panel">
        <span className="style-panel__label">{translate(lang, 'detail.bestFor')}</span>
        <ul className="style-token-list">
          {style.promptProfile.bestFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
      <article className="style-panel">
        <span className="style-panel__label">{translate(lang, 'detail.constraints')}</span>
        <ul className="style-rule-list">
          {style.promptProfile.constraints.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}

function Lab({ style, blueprint }: RendererProps) {
  return (
    <section className="style-lab" aria-label="Palette typography interaction examples">
      <article className="style-lab__card style-lab__card--palette">
        <span>Palette</span>
        <div className="style-lab__swatches">
          {style.palette.map((color) => (
            <i key={color} style={{ background: color }}>
              <small>{color}</small>
            </i>
          ))}
        </div>
      </article>
      <article className="style-lab__card style-lab__card--type">
        <span>Typography</span>
        <strong>{blueprint.typographyExample}</strong>
        <p>{style.promptProfile.typography}</p>
      </article>
      <article className="style-lab__card style-lab__card--layout">
        <span>Layout</span>
        <strong>{blueprint.layoutExample}</strong>
        <p>{style.promptProfile.layout}</p>
      </article>
      <article className="style-lab__card style-lab__card--motion">
        <span>Interaction</span>
        <button type="button">{blueprint.interactionExample}</button>
        <p>{style.promptProfile.motion}</p>
      </article>
    </section>
  );
}

function MetricStrip({ blueprint }: { blueprint: StylePageBlueprint }) {
  return (
    <div className="style-metrics">
      {blueprint.metrics.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

function GridRenderer({ blueprint }: RendererProps) {
  return (
    <section className="style-motif style-motif--grid">
      <div className="motif-heading">
        <span>{blueprint.motifTitle}</span>
        <strong>{blueprint.heroWord}</strong>
      </div>
      <div className="motif-grid-board">
        {Array.from({ length: 12 }, (_, index) => (
          <i key={index}>{String(index + 1).padStart(2, '0')}</i>
        ))}
      </div>
      <div className="motif-span-board">
        {blueprint.motifItems.map((item, index) => (
          <b key={item} className={`span-${index + 1}`}>
            {item}
          </b>
        ))}
      </div>
      <MetricStrip blueprint={blueprint} />
    </section>
  );
}

function EditorialRenderer({ blueprint }: RendererProps) {
  return (
    <section className="style-motif style-motif--editorial">
      <aside>
        <span>{blueprint.number}</span>
        <p>{blueprint.motifTitle}</p>
      </aside>
      <article>
        <h2>{blueprint.heroWord}</h2>
        <p>{blueprint.overview}</p>
        <blockquote>{blueprint.typographyExample}</blockquote>
      </article>
      <div className="motif-notes">
        {blueprint.motifItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function PosterRenderer({ blueprint }: RendererProps) {
  return (
    <section className="style-motif style-motif--poster">
      <div className="poster-stack">
        <strong>{blueprint.heroWord}</strong>
        {blueprint.motifItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <MetricStrip blueprint={blueprint} />
    </section>
  );
}

function TerminalRenderer({ blueprint }: RendererProps) {
  return (
    <section className="style-motif style-motif--terminal">
      <div className="terminal-window">
        <div className="terminal-window__bar">
          <i />
          <i />
          <i />
          <span>{blueprint.motifTitle}</span>
        </div>
        <pre>{[
          `$ init ${blueprint.heroWord.toLowerCase().replace(/\s+/g, '-')}`,
          `> typography: ${blueprint.typographyExample}`,
          `> layout: ${blueprint.layoutExample}`,
          `> motion: ${blueprint.interactionExample}`,
          '> status: rendered from React source',
        ].join('\n')}</pre>
      </div>
      <div className="terminal-modules">
        {blueprint.motifItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function DashboardRenderer({ blueprint }: RendererProps) {
  return (
    <section className="style-motif style-motif--dashboard">
      <div className="dashboard-toolbar">
        <span>{blueprint.motifTitle}</span>
        <button type="button">{blueprint.interactionExample}</button>
      </div>
      <div className="dashboard-grid">
        {blueprint.motifItems.map((item, index) => (
          <article key={item} className={index === 0 ? 'is-wide' : ''}>
            <span>{item}</span>
            <strong>{blueprint.metrics[index % blueprint.metrics.length][1]}</strong>
            <p>{index % 2 === 0 ? blueprint.layoutExample : blueprint.typographyExample}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function GradientRenderer({ blueprint }: RendererProps) {
  return (
    <section className="style-motif style-motif--gradient">
      <div className="gradient-field">
        <i />
        <i />
        <i />
        <strong>{blueprint.heroWord}</strong>
      </div>
      <div className="gradient-cards">
        {blueprint.motifItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function GlassRenderer({ blueprint }: RendererProps) {
  return (
    <section className="style-motif style-motif--glass">
      <div className="orbit-stage">
        <i />
        <i />
        <strong>{blueprint.heroWord}</strong>
      </div>
      <div className="glass-stack">
        {blueprint.motifItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function MaterialRenderer({ blueprint }: RendererProps) {
  return (
    <section className="style-motif style-motif--material">
      <div className="material-object">
        <strong>{blueprint.heroWord}</strong>
        <span>{blueprint.motifTitle}</span>
      </div>
      <div className="material-kit">
        {blueprint.motifItems.map((item) => (
          <button key={item} type="button">{item}</button>
        ))}
      </div>
    </section>
  );
}

function RetroRenderer({ blueprint }: RendererProps) {
  return (
    <section className="style-motif style-motif--retro">
      <div className="retro-window">
        <div className="retro-titlebar">
          <span>{blueprint.heroWord}</span>
          <i>_</i>
          <i>[]</i>
          <i>x</i>
        </div>
        <div className="retro-content">
          {blueprint.motifItems.map((item) => (
            <button key={item} type="button">{item}</button>
          ))}
        </div>
      </div>
      <MetricStrip blueprint={blueprint} />
    </section>
  );
}

function PrintRenderer({ blueprint }: RendererProps) {
  return (
    <section className="style-motif style-motif--print">
      <div className="print-sheet">
        <span>{blueprint.number}</span>
        <strong>{blueprint.heroWord}</strong>
        <p>{blueprint.overview}</p>
      </div>
      <div className="print-marks">
        {blueprint.motifItems.map((item) => (
          <i key={item}>{item}</i>
        ))}
      </div>
    </section>
  );
}

function MotionRenderer({ blueprint }: RendererProps) {
  return (
    <section className="style-motif style-motif--motion">
      <div className="motion-bento">
        {blueprint.motifItems.map((item, index) => (
          <motion.article
            key={item}
            whileHover={{ y: -6, rotateX: 4, rotateY: index % 2 === 0 ? -4 : 4 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          >
            <span>{item}</span>
            <strong>{blueprint.metrics[index % blueprint.metrics.length][1]}</strong>
          </motion.article>
        ))}
      </div>
      <div className="motion-path">
        <i />
        <strong>{blueprint.heroWord}</strong>
      </div>
    </section>
  );
}

function FusionRenderer({ style, blueprint, lang }: RendererProps) {
  const sources = style.fusionOf || blueprint.motifItems.slice(0, 2);
  return (
    <section className="style-motif style-motif--fusion">
      <div className="fusion-stage">
        {sources.map((source, index) => (
          <article key={source}>
            <span>{index === 0 ? 'Source A' : 'Source B'}</span>
            <strong>{source.replace(/-/g, ' ')}</strong>
          </article>
        ))}
        <div>
          <span>Result</span>
          <strong>{localize(style.name, lang)}</strong>
        </div>
      </div>
      <div className="fusion-notes">
        {blueprint.motifItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

const rendererRegistry: Record<StylePageBlueprint['renderer'], StyleRenderer> = {
  grid: GridRenderer,
  editorial: EditorialRenderer,
  poster: PosterRenderer,
  terminal: TerminalRenderer,
  dashboard: DashboardRenderer,
  gradient: GradientRenderer,
  glass: GlassRenderer,
  material: MaterialRenderer,
  retro: RetroRenderer,
  print: PrintRenderer,
  motion: MotionRenderer,
  fusion: FusionRenderer,
};

export function StyleDetail({ style, lang }: StyleDetailProps) {
  const PortedStylePage = portedStylePages[style.id];
  if (PortedStylePage) {
    return <PortedStylePage style={style} lang={lang} />;
  }

  const blueprint = getStylePageBlueprint(style.id);
  const prompt = buildPrompt(style, lang);
  const Renderer = rendererRegistry[blueprint.renderer];

  return (
    <article
      className={`style-experience style-experience--${style.id} style-experience--${style.kind}`}
      style={cssVars(style, blueprint)}
    >
      <StyleTopbar style={style} blueprint={blueprint} lang={lang} />
      <StyleHero style={style} blueprint={blueprint} lang={lang}>
        <MetricStrip blueprint={blueprint} />
      </StyleHero>
      <Overview style={style} blueprint={blueprint} lang={lang} />
      <Lab style={style} blueprint={blueprint} lang={lang} />
      <Renderer style={style} blueprint={blueprint} lang={lang} />
      <PromptBlock title={translate(lang, 'detail.prompt')} text={prompt} lang={lang} />
      <PageNav currentPath={style.route} lang={lang} />
    </article>
  );
}
