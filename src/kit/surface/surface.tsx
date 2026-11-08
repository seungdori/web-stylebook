import type { ComponentPropsWithRef, HTMLAttributes, ReactNode } from 'react';
import '../theme.css';
import './surface.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface ShellProps extends HTMLAttributes<HTMLElement> {
  /** 'div' by default. Use 'section' with aria-labelledby when the Shell is a page region. */
  as?: 'div' | 'section' | 'article' | 'aside';
}

/** The framed outer layer. Put a ShellHeader and a Panel inside it. */
export function Shell({ as: Tag = 'div', className, ...rest }: ShellProps) {
  return <Tag className={cx('ws-shell', className)} {...rest} />;
}

export interface ShellHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** Use a heading level that fits the page outline. */
  titleAs?: 'p' | 'h2' | 'h3' | 'h4';
  titleId?: string;
  meta?: ReactNode;
  actions?: ReactNode;
}

/** Title row in the Shell padding. Extra children (a search field, filters) go below the row. */
export function ShellHeader({ title, titleAs: Title = 'p', titleId, meta, actions, className, children, ...rest }: ShellHeaderProps) {
  return (
    <div className={cx('ws-shell-header', className)} {...rest}>
      <div className="ws-shell-header__row">
        <Title className="ws-shell-header__title" id={titleId}>
          {title}
        </Title>
        {meta !== undefined && meta !== null ? <span className="ws-shell-header__meta">{meta}</span> : null}
        {actions ? <div className="ws-shell-header__actions">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}

/** The white content layer inside a Shell. `ref` reaches the div, for example to hold focus while content reloads. */
export function Panel({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div className={cx('ws-panel', className)} {...rest} />;
}
