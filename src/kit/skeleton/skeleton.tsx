import type { HTMLAttributes } from 'react';
import '../theme.css';
import './skeleton.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: 'xs' | 'sm' | 'round';
  className?: string;
}

/** A placeholder block. Hidden from assistive technology; wrap a group in SkeletonGroup. */
export function Skeleton({ width = '100%', height = 12, radius = 'xs', className }: SkeletonProps) {
  return (
    <span
      className={cx('ws-skeleton', className)}
      data-radius={radius === 'xs' ? undefined : radius}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export interface SkeletonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** The loading message for screen readers, for example "Loading saved styles". */
  label: string;
}

/**
 * Placeholder blocks plus one loading message. The message sits in its own
 * status region; aria-busy stays on the blocks, so it does not mute the message.
 */
export function SkeletonGroup({ label, className, children, ...rest }: SkeletonGroupProps) {
  return (
    <div className={cx('ws-skeleton-group', className)} {...rest}>
      <span className="ws-skeleton-group__label" role="status">
        {label}
      </span>
      <div className="ws-skeleton-group__blocks" aria-busy="true">
        {children}
      </div>
    </div>
  );
}
