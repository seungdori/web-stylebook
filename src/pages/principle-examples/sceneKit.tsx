import type { ReactNode } from 'react';
import type { Lang, LocalizedText } from '../../data/styles';
import { localize } from '../../data/styles';

export type Variant = 'before' | 'after';

export type SceneProps = { variant: Variant; lang: Lang };

/** Shorthand for the trilingual strings every scene is written in. */
export const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

/** Binds `lang` once so a scene body can read as plain text. */
export function reader(lang: Lang) {
  return (text: LocalizedText) => localize(text, lang);
}

type Tone = 'ink' | 'muted' | 'accent' | 'danger' | 'ghost';

/** The specimen surface. `caption` names what the reader is looking at. */
export function Scene({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <div className="pex-scene">
      {caption ? <span className="pex-scene__caption">{caption}</span> : null}
      <div className="pex-scene__body">{children}</div>
    </div>
  );
}

export function Stack({ gap = 8, children }: { gap?: number; children: ReactNode }) {
  return <div className="pex-stack" style={{ gap }}>{children}</div>;
}

export function Cluster({ gap = 6, wrap, align, children }: {
  gap?: number;
  wrap?: boolean;
  align?: 'start' | 'center' | 'between';
  children: ReactNode;
}) {
  return (
    <div
      className="pex-cluster"
      data-align={align}
      style={{ gap, flexWrap: wrap ? 'wrap' : 'nowrap' }}
    >
      {children}
    </div>
  );
}

export function Grid({ cols = 2, gap = 8, children }: { cols?: number; gap?: number; children: ReactNode }) {
  return (
    <div className="pex-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}>
      {children}
    </div>
  );
}

/** A bordered region — used wherever a principle is about grouping or elevation. */
export function Panel({ label, tone, elevation, children }: {
  label?: string;
  tone?: Tone;
  elevation?: 0 | 1 | 2;
  children: ReactNode;
}) {
  return (
    <div className="pex-panel" data-tone={tone} data-elevation={elevation}>
      {label ? <span className="pex-panel__label">{label}</span> : null}
      {children}
    </div>
  );
}

/** Body text at a real size, so type principles can be judged by eye. */
export function Text({ children, size = 11, tone = 'ink', weight = 400, leading = 1.5, measure }: {
  children: ReactNode;
  size?: number;
  tone?: Tone;
  weight?: number;
  leading?: number;
  measure?: number;
}) {
  return (
    <p
      className="pex-text"
      data-tone={tone}
      style={{ fontSize: size, fontWeight: weight, lineHeight: leading, maxWidth: measure ? `${measure}ch` : undefined }}
    >
      {children}
    </p>
  );
}

/** Small monospace annotation: sizes, ratios, counts, token names. */
export function Note({ children, tone = 'muted' }: { children: ReactNode; tone?: Tone }) {
  return <span className="pex-note" data-tone={tone}>{children}</span>;
}

export function Badge({ children, tone = 'muted' }: { children: ReactNode; tone?: Tone }) {
  return <span className="pex-badge" data-tone={tone}>{children}</span>;
}

export function Button({ label, tone = 'ghost', size = 'md', focus, hint }: {
  label: string;
  tone?: Tone;
  size?: 'sm' | 'md' | 'lg';
  focus?: boolean;
  hint?: string;
}) {
  return (
    <span className="pex-button" data-tone={tone} data-size={size} data-focus={focus ? 'on' : undefined}>
      {label}
      {hint ? <i>{hint}</i> : null}
    </span>
  );
}

/** A list row. `state` carries the row's role in the principle being shown. */
export function Row({ label, meta, control, state, gap }: {
  label: string;
  meta?: string;
  control?: 'check' | 'radio' | 'none';
  state?: 'default' | 'primary' | 'quiet' | 'danger';
  gap?: number;
}) {
  return (
    <div className="pex-row" data-state={state} style={gap != null ? { marginBottom: gap } : undefined}>
      {control && control !== 'none' ? <i className="pex-row__control" data-control={control} /> : null}
      <span className="pex-row__label">{label}</span>
      {meta ? <span className="pex-row__meta">{meta}</span> : null}
    </div>
  );
}

/** A form field. Spacing between label, input and hint is settable so
 *  relational-spacing and proximity can be demonstrated literally. */
export function Field({ label, value, placeholder, hint, error, tone, labelGap = 4, hintGap = 4, height }: {
  label?: string;
  value?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  tone?: Tone;
  labelGap?: number;
  hintGap?: number;
  height?: number;
}) {
  return (
    <div className="pex-field" data-tone={tone}>
      {label ? <span className="pex-field__label" style={{ marginBottom: labelGap }}>{label}</span> : null}
      <span className="pex-field__input" data-filled={value ? 'on' : undefined} style={height ? { height } : undefined}>
        {value ?? placeholder ?? ''}
      </span>
      {hint ? <span className="pex-field__hint" style={{ marginTop: hintGap }}>{hint}</span> : null}
      {error ? <span className="pex-field__error" style={{ marginTop: hintGap }}>{error}</span> : null}
    </div>
  );
}

/** A named colour block. The whole point of the colour principles is that
 *  the *name* is visible next to the value. */
export function Swatch({ color, name, value, ratio }: {
  color: string;
  name: string;
  value?: string;
  ratio?: string;
}) {
  return (
    <span className="pex-swatch">
      <i style={{ background: color }} />
      <b>{name}</b>
      {value ? <em>{value}</em> : null}
      {ratio ? <em data-ratio="on">{ratio}</em> : null}
    </span>
  );
}

export function Meter({ value, total, label, tone = 'accent' }: {
  value: number;
  total: number;
  label?: string;
  tone?: Tone;
}) {
  return (
    <span className="pex-meter" data-tone={tone}>
      <i>
        {Array.from({ length: total }, (_, index) => (
          <b key={index} data-on={index < value ? 'on' : undefined} />
        ))}
      </i>
      {label ? <em>{label}</em> : null}
    </span>
  );
}

/** A labelled image stand-in. No external assets, but it behaves like a photo:
 *  a subject region that text can collide with. */
export function Media({ ratio = '16 / 9', overlay, fallback, broken, focal = 'center', busy }: {
  ratio?: string;
  overlay?: string;
  /** Alt text shown when the image fails. */
  fallback?: string;
  /** Failed image with nothing to fall back to. */
  broken?: boolean;
  focal?: 'center' | 'left';
  busy?: boolean;
}) {
  const failed = broken || fallback != null;
  return (
    <span
      className="pex-media"
      data-fallback={failed ? 'on' : undefined}
      data-broken={broken ? 'on' : undefined}
      data-busy={busy && !failed ? 'on' : undefined}
      style={{ aspectRatio: ratio }}
    >
      {failed ? <b>{fallback ?? ''}</b> : <i data-focal={focal} />}
      {overlay && !failed ? <em data-focal={focal}>{overlay}</em> : null}
    </span>
  );
}
