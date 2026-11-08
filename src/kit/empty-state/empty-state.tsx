import type { HTMLAttributes, ReactNode } from 'react';
import '../theme.css';
import './empty-state.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** A 20px line icon for the situation. */
  icon?: ReactNode;
  /** What is empty or what failed, in one sentence. */
  title: ReactNode;
  /** What to do next. */
  description?: ReactNode;
  /** Usually one button. */
  actions?: ReactNode;
  /** 'critical' uses the error colors and role="alert", so the message is announced. */
  tone?: 'neutral' | 'critical';
  /**
   * A dashed frame with the kit background, for use outside a Panel. The kit
   * is light only: on a dark page, use a Panel or framed.
   */
  framed?: boolean;
  titleAs?: 'p' | 'h2' | 'h3' | 'h4';
}

export function EmptyState({
  icon,
  title,
  description,
  actions,
  tone = 'neutral',
  framed = false,
  titleAs: Title = 'p',
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      role={tone === 'critical' ? 'alert' : undefined}
      {...rest}
      className={cx('ws-empty', className)}
      data-tone={tone}
      data-framed={framed ? '' : undefined}
    >
      {icon ? (
        <span className="ws-empty__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <Title className="ws-empty__title">{title}</Title>
      {description ? <p className="ws-empty__description">{description}</p> : null}
      {actions ? <div className="ws-empty__actions">{actions}</div> : null}
    </div>
  );
}
