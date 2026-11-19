import { Fragment } from 'react';
import { motion, useReducedMotion, type Transition } from 'motion/react';
import type { PreviewKind } from './catalog';

export type EaseCurve = 'spring' | 'smooth' | 'linear';

export interface PreviewSpec {
  duration: number;
  easing: string;
  loop: boolean;
}

interface AnimationPreviewProps {
  kind: PreviewKind;
  replayKey: number;
  compact?: boolean;
  /** Shows the settled frame and holds it. Tiles stay still until they are hovered or focused. */
  still?: boolean;
  speed?: number;
  curve?: EaseCurve;
}

/**
 * play: loops repeat. once: loops run one cycle (reduced motion), so a demo still plays
 * when the user asks for it but never keeps moving. still: no motion, the settled frame.
 */
type PlayMode = 'play' | 'once' | 'still';

const SMOOTH_BEZIER = [0.22, 1, 0.36, 1] as const;
const STILL: Transition = { duration: 0 };

function springConfig(speed: number): Transition {
  return {
    type: 'spring',
    stiffness: 320 * speed,
    damping: 22,
    mass: 0.8,
  };
}

function easeConfig(speed: number, curve: EaseCurve): Transition {
  if (curve === 'spring') return springConfig(speed);
  if (curve === 'linear') return { duration: 0.65 / speed, ease: 'linear' };
  return { duration: 0.65 / speed, ease: SMOOTH_BEZIER };
}

export function specFor(kind: PreviewKind, speed: number, curve: EaseCurve): PreviewSpec {
  const entranceCurves: PreviewKind[] = ['fade', 'fade-up', 'slide', 'scale', 'blur', 'stagger', 'modal', 'toast', 'accordion', 'scroll-reveal'];
  const isEntrance = entranceCurves.includes(kind);
  const baseDuration = kind === 'fade' || kind === 'blur' ? 0.65 / speed : isEntrance ? 0.62 / speed : timingFor(kind) / speed;

  let easing: string;
  if (isEntrance) {
    if (curve === 'spring') easing = 'spring(320, 22)';
    else if (curve === 'linear') easing = 'linear';
    else easing = 'cubic-bezier(.22, 1, .36, 1)';
  } else {
    easing = 'linear loop';
  }
  return { duration: baseDuration, easing, loop: !isEntrance };
}

function timingFor(kind: PreviewKind): number {
  switch (kind) {
    case 'pulse': return 1.2;
    case 'bounce': return 0.9;
    case 'shake': return 0.48;
    case 'wiggle': return 0.8;
    case 'glow': return 1.5;
    case 'ripple': return 1.4;
    case 'hover-lift': return 1.4;
    case 'press': return 0.7;
    case 'tilt': return 2.2;
    case 'crossfade': return 1.4;
    case 'spinner': return 0.9;
    case 'progress': return 1.4;
    case 'dots': return 0.7;
    case 'parallax': return 2.8;
    case 'marquee': return 3.4;
    case 'orbit': return 2.4;
    case 'float': return 2.2;
    case 'gradient': return 3.2;
    default: return 1;
  }
}

export function AnimationPreview({ kind, replayKey, compact = false, still = false, speed = 1, curve = 'spring' }: AnimationPreviewProps) {
  const reduced = Boolean(useReducedMotion());
  const mode: PlayMode = still ? 'still' : reduced ? 'once' : 'play';
  const className = ['animation-preview', compact ? 'animation-preview--compact' : '', still ? 'animation-preview--still' : ''].filter(Boolean).join(' ');
  // The wrapper stays mounted and only its contents restart: a tile switches mode on
  // pointer enter, and replacing the node under the pointer would drop the click.
  return (
    <div className={className}>
      <Fragment key={`${kind}-${replayKey}-${speed}-${curve}-${mode}`}>{renderPreview(kind, speed, curve, mode)}</Fragment>
    </div>
  );
}

function renderPreview(kind: PreviewKind, speed: number, curve: EaseCurve, mode: PlayMode) {
  const still = mode === 'still';
  const ease = still ? STILL : easeConfig(speed, curve);
  const spring = still ? STILL : springConfig(speed);
  const entrance = curve === 'spring' ? spring : ease;
  const delayed = (transition: Transition, delay: number): Transition => (still ? STILL : { ...transition, delay });
  const loop = (seconds: number, extras: Partial<Transition> = {}): Transition =>
    still ? STILL : { duration: seconds / speed, repeat: mode === 'once' ? 0 : Infinity, ...extras };

  if (kind === 'fade') {
    return <motion.div className="preview-object" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease}>Fade</motion.div>;
  }
  if (kind === 'fade-up') {
    return <motion.div className="preview-object" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={entrance}>Fade Up</motion.div>;
  }
  if (kind === 'slide') {
    return <motion.div className="preview-object preview-object--wide" initial={{ opacity: 0, x: -72 }} animate={{ opacity: 1, x: 0 }} transition={entrance}>Slide In</motion.div>;
  }
  if (kind === 'scale') {
    return <motion.div className="preview-object" initial={{ opacity: 0, scale: 0.62 }} animate={{ opacity: 1, scale: 1 }} transition={entrance}>Scale</motion.div>;
  }
  if (kind === 'blur') {
    return <motion.div className="preview-object" initial={{ opacity: 0, filter: 'blur(12px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={ease}>Blur</motion.div>;
  }
  if (kind === 'stagger') {
    return (
      <div className="preview-stack">
        {['One', 'Two', 'Three'].map((item, index) => (
          <motion.i
            key={item}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={delayed(ease, (index * 0.12) / speed)}
          >
            {item}
          </motion.i>
        ))}
      </div>
    );
  }
  if (kind === 'pulse') {
    return <motion.div className="preview-dot" animate={{ scale: [1, 1.18, 1], opacity: [0.68, 1, 0.68] }} transition={loop(1.2)} />;
  }
  if (kind === 'bounce') {
    return <motion.div className="preview-object" animate={{ y: [0, -34, 0], scaleY: [1, 1, 0.9, 1] }} transition={loop(0.9, { repeatDelay: 0.35 / speed })}>Bounce</motion.div>;
  }
  if (kind === 'shake') {
    return <motion.div className="preview-object preview-object--error" animate={{ x: [0, -12, 10, -7, 5, 0] }} transition={loop(0.48, { repeatDelay: 1 / speed })}>Error</motion.div>;
  }
  if (kind === 'wiggle') {
    return <motion.div className="preview-object preview-object--icon" animate={{ rotate: [0, -8, 7, -4, 0] }} transition={loop(0.8, { repeatDelay: 0.8 / speed })}>★</motion.div>;
  }
  if (kind === 'glow') {
    return <motion.div className="preview-object preview-object--glow" animate={{ boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 0 34px rgba(0,0,0,0.5)', '0 0 0 rgba(0,0,0,0)'] }} transition={loop(1.5)}>Glow</motion.div>;
  }
  if (kind === 'ripple') {
    return (
      <div className="preview-ripple">
        <motion.i animate={{ scale: [0.4, 2.8], opacity: [0.65, 0] }} transition={loop(1.4)} />
        <span />
      </div>
    );
  }
  if (kind === 'hover-lift') {
    return <motion.div className="preview-object" whileHover={{ y: -8 }} animate={{ y: [0, -8, 0] }} transition={loop(1.4)}>Hover</motion.div>;
  }
  if (kind === 'press') {
    return <motion.div className="preview-object" animate={{ scale: [1, 0.94, 1] }} transition={loop(0.7, { repeatDelay: 0.7 / speed })}>Press</motion.div>;
  }
  if (kind === 'tilt') {
    return <motion.div className="preview-object preview-object--tilt" animate={{ rotateX: [0, 8, -4, 0], rotateY: [0, -10, 6, 0] }} transition={loop(2.2)}>Tilt</motion.div>;
  }
  if (kind === 'modal') {
    return <motion.div className="preview-modal" initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }} transition={entrance}><strong>Modal</strong><span /></motion.div>;
  }
  if (kind === 'toast') {
    return <motion.div className="preview-toast" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} transition={entrance}>Saved</motion.div>;
  }
  if (kind === 'accordion') {
    return (
      <motion.div className="preview-accordion" initial={false}>
        <strong>Question</strong>
        <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: 52, opacity: 1 }} transition={ease} />
      </motion.div>
    );
  }
  if (kind === 'crossfade') {
    return <motion.div className="preview-object" animate={{ opacity: [1, 0.2, 1] }} transition={loop(1.4)}>View A/B</motion.div>;
  }
  if (kind === 'skeleton') {
    return <div className="preview-skeleton"><i /><i /><i /></div>;
  }
  if (kind === 'spinner') {
    return <motion.div className="preview-spinner" animate={{ rotate: 360 }} transition={loop(0.9, { ease: 'linear' })} />;
  }
  if (kind === 'progress') {
    return <div className="preview-progress"><motion.i initial={{ width: '12%' }} animate={{ width: '86%' }} transition={loop(1.4, { repeatType: 'reverse' })} /></div>;
  }
  if (kind === 'dots') {
    return <div className="preview-dots">{[0, 1, 2].map((item) => <motion.i key={item} animate={{ y: [0, -10, 0] }} transition={loop(0.7, { delay: (item * 0.14) / speed })} />)}</div>;
  }
  if (kind === 'scroll-reveal') {
    return <div className="preview-scroll"><motion.i initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={ease} /><motion.i initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={delayed(ease, 0.15 / speed)} /></div>;
  }
  if (kind === 'parallax') {
    return <div className="preview-parallax"><motion.i animate={{ y: [-8, 8, -8] }} transition={loop(2.8)} /><motion.b animate={{ y: [14, -14, 14] }} transition={loop(2.8)} /></div>;
  }
  if (kind === 'marquee') {
    return <div className="preview-marquee"><motion.span animate={{ x: ['0%', '-50%'] }} transition={loop(3.4, { ease: 'linear' })}>MARQUEE • TICKER • LOOP • MARQUEE • TICKER • LOOP •</motion.span></div>;
  }
  if (kind === 'orbit') {
    return <div className="preview-orbit"><span /><motion.i animate={{ rotate: 360 }} transition={loop(2.4, { ease: 'linear' })}><b /></motion.i></div>;
  }
  if (kind === 'float') {
    return <motion.div className="preview-object preview-object--soft" animate={{ y: [-8, 8, -8] }} transition={loop(2.2)}>Float</motion.div>;
  }
  return <motion.div className="preview-gradient" animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={loop(3.2)} />;
}
