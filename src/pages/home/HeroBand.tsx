import { useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { SHOT_HEIGHT, SHOT_WIDTH, shotSrc, shotSrcSet } from './shots';

export interface BandItem {
  id: string;
  name: string;
  description: string;
  href: string;
}

interface HeroBandProps {
  items: BandItem[];
  label: string;
  previousLabel: string;
  nextLabel: string;
  viewLabel: string;
  pauseLabel: string;
  playLabel: string;
}

/* Cards that pass one centre position per second. */
const SPEED = 1 / 4.6;
/* A card farther than this from the centre is off the arc and hidden. */
const HIDE_BEYOND = 3.3;
/* Cards this close to the centre load their image even when the arc clips them. */
const LOAD_WITHIN = 2.5;

interface Drag {
  x: number;
  start: number;
  moved: boolean;
  id: number;
}

/* The band's moving state lives outside React: the position changes every frame, and React
   only hears about the card that is in the centre and whether autoplay is on. */
interface Engine {
  pos: number;
  target: number | null;
  playing: boolean;
  hovered: boolean;
  focused: boolean;
  visible: boolean;
  reduced: boolean;
  userMove: boolean;
  suppressClick: boolean;
  drag: Drag | null;
  current: number;
  raf: number;
  last: number;
}

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function HeroBand({ items, label, previousLabel, nextLabel, viewLabel, pauseLabel, playLabel }: HeroBandProps) {
  const count = items.length;
  const arcRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(() => !reducedMotion());
  const [announcement, setAnnouncement] = useState('');
  const itemsRef = useRef(items);
  const engine = useRef<Engine>({
    pos: 0,
    target: null,
    playing,
    hovered: false,
    focused: false,
    visible: true,
    reduced: reducedMotion(),
    userMove: false,
    suppressClick: false,
    drag: null,
    current: 0,
    raf: 0,
    last: 0,
  });
  const actions = useRef({ kick: () => {}, layout: () => {} });

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useLayoutEffect(() => {
    const arc = arcRef.current;
    if (!arc) return;
    const e = engine.current;
    const wrap = (d: number) => ((((d + count / 2) % count) + count) % count) - count / 2;
    const autoRunning = () => e.playing && !e.hovered && !e.focused && e.visible;

    const layout = () => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const d = wrap(index - e.pos);
        const distance = Math.abs(d);
        card.style.setProperty('--d', d.toFixed(4));
        card.style.visibility = distance > HIDE_BEYOND ? 'hidden' : 'visible';
        card.style.zIndex = String(100 - Math.round(distance * 10));
        const image = card.firstElementChild;
        if (distance <= LOAD_WITHIN && image instanceof HTMLImageElement && image.loading === 'lazy') image.loading = 'eager';
      });
      const near = ((Math.round(e.pos) % count) + count) % count;
      if (near !== e.current) {
        e.current = near;
        setCurrent(near);
      }
    };

    const settle = () => {
      if (!e.userMove) return;
      e.userMove = false;
      const name = itemsRef.current[e.current]?.name ?? '';
      /* A no-break space keeps a repeated name from being swallowed by the live region. */
      setAnnouncement((previous) => (previous === name ? `${name}\u00a0` : name));
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - e.last) / 1000);
      e.last = now;
      if (!e.drag) {
        if (e.target !== null) {
          const diff = e.target - e.pos;
          if (e.reduced || Math.abs(diff) < 0.002) {
            e.pos = e.target;
            e.target = null;
          } else {
            e.pos += diff * Math.min(1, dt * 9);
          }
        } else if (autoRunning()) {
          e.pos += SPEED * dt;
        }
      }
      layout();
      if (e.target === null && !e.drag) settle();
      e.raf = autoRunning() || e.target !== null ? window.requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (e.raf) return;
      e.last = performance.now();
      e.raf = window.requestAnimationFrame(tick);
    };
    actions.current = { kick, layout };

    const observer = new IntersectionObserver(([entry]) => {
      e.visible = entry.isIntersecting;
      kick();
    });
    observer.observe(arc);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => {
      e.reduced = motionQuery.matches;
      if (e.reduced) {
        e.playing = false;
        setPlaying(false);
      }
    };
    motionQuery.addEventListener('change', onMotion);

    layout();
    kick();
    return () => {
      window.cancelAnimationFrame(e.raf);
      e.raf = 0;
      observer.disconnect();
      motionQuery.removeEventListener('change', onMotion);
    };
  }, [count]);

  /* Keyboard focus follows the card that arrives in the centre. */
  useEffect(() => {
    const arc = arcRef.current;
    if (arc?.contains(document.activeElement) && document.activeElement !== cardRefs.current[current]) {
      cardRefs.current[current]?.focus({ preventScroll: true });
    }
  }, [current]);

  const wrap = (d: number) => ((((d + count / 2) % count) + count) % count) - count / 2;

  const setAuto = (on: boolean) => {
    engine.current.playing = on;
    setPlaying(on);
    actions.current.kick();
  };

  const go = (delta: number) => {
    const e = engine.current;
    e.userMove = true;
    setAuto(false);
    e.target = Math.round(e.target ?? e.pos) + delta;
    actions.current.kick();
  };

  const goTo = (index: number) => {
    const e = engine.current;
    e.userMove = true;
    setAuto(false);
    e.target = e.pos + wrap(index - e.pos);
    actions.current.kick();
  };

  const spacing = () => (cardRefs.current[0]?.offsetWidth ?? 300) * 1.063;

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const e = engine.current;
    e.drag = { x: event.clientX, start: e.pos, moved: false, id: event.pointerId };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const e = engine.current;
    const drag = e.drag;
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) {
      /* A drag takes over from any movement still under way, from where the band is now. */
      drag.moved = true;
      drag.start = e.pos + dx / spacing();
      e.target = null;
      event.currentTarget.setPointerCapture(drag.id);
      event.currentTarget.classList.add('is-dragging');
      setAuto(false);
    }
    if (drag.moved) {
      e.pos = drag.start - dx / spacing();
      actions.current.layout();
    }
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const e = engine.current;
    const drag = e.drag;
    if (!drag || event.pointerId !== drag.id) return;
    e.drag = null;
    event.currentTarget.classList.remove('is-dragging');
    if (!drag.moved) return;
    e.suppressClick = true;
    window.setTimeout(() => {
      e.suppressClick = false;
    }, 0);
    e.userMove = true;
    e.target = Math.round(e.pos);
    actions.current.kick();
  };

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') engine.current.hovered = true;
  };

  const onPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    engine.current.hovered = false;
    actions.current.kick();
  };

  const onFocus = () => {
    engine.current.focused = true;
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    engine.current.focused = false;
    actions.current.kick();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    go(event.key === 'ArrowRight' ? 1 : -1);
  };

  const onCardClick = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    const e = engine.current;
    if (e.suppressClick) {
      event.preventDefault();
      return;
    }
    if (Math.abs(wrap(index - e.pos)) > 0.5) {
      event.preventDefault();
      goTo(index);
    }
  };

  const active = items[current];

  return (
    <div className="home-band">
      <div
        className="home-band__arc"
        ref={arcRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      >
        {items.map((item, index) => {
          const start = Math.abs(wrap(index));
          const isCurrent = index === current;
          return (
            <a
              key={item.id}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="home-band__card"
              href={item.href}
              draggable={false}
              tabIndex={isCurrent ? 0 : -1}
              aria-hidden={isCurrent ? undefined : true}
              aria-label={item.name}
              onClick={(event) => onCardClick(event, index)}
            >
              <img
                src={shotSrc(item.id)}
                srcSet={shotSrcSet(item.id)}
                sizes="(max-width: 820px) 66vw, 32vw"
                width={SHOT_WIDTH}
                height={SHOT_HEIGHT}
                alt=""
                draggable={false}
                loading={start <= 2 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : undefined}
                decoding="async"
              />
            </a>
          );
        })}
      </div>

      <div className="home-band__now">
        <button className="icon-button" type="button" aria-label={previousLabel} onClick={() => go(-1)}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
        </button>
        <div className="home-band__captions">
          {items.map((item, index) => (
            <div key={item.id} className={index === current ? 'home-band__caption is-current' : 'home-band__caption'} aria-hidden={index === current ? undefined : true}>
              <p className="home-band__name">{item.name}</p>
              <p className="home-band__desc">{item.description}</p>
            </div>
          ))}
        </div>
        <button className="icon-button" type="button" aria-label={nextLabel} onClick={() => go(1)}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
        </button>
      </div>
      <div className="home-band__actions">
        <a className="button button--dark" href={active?.href} aria-label={active ? `${viewLabel}: ${active.name}` : undefined}>{viewLabel}</a>
        <button className="button" type="button" onClick={() => setAuto(!playing)}>{playing ? pauseLabel : playLabel}</button>
      </div>
      <p className="sr-only" aria-live="polite">{announcement}</p>
    </div>
  );
}
