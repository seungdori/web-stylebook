import { useEffect, useRef, useState } from 'react';
import type { Lang, StyleData } from '../../data/styles';
import { StyleCard } from '../../components/StyleCard';

interface StyleShelfProps {
  id: string;
  title: string;
  styles: StyleData[];
  lang: Lang;
  previousLabel: string;
  nextLabel: string;
}

export const SHELF_CARD_SIZES = '(max-width: 820px) 280px, 348px';

/* One horizontal row of cards with previous and next buttons. A button reports itself as
   unavailable at the matching end of the row; it stays focusable so focus is never lost.
   Screenshots load only for a row near the viewport and, inside the row, for cards within
   one row width of what is shown: the browser's own lazy loading fetches a whole row. */
export function StyleShelf({ id, title, styles, lang, previousLabel, nextLabel }: StyleShelfProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [near, setNear] = useState(false);
  const [reached, setReached] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || near) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setNear(true);
    }, { rootMargin: '600px 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, [near]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver((entries) => {
      const ids = entries.filter((entry) => entry.isIntersecting).map((entry) => (entry.target as HTMLElement).dataset.styleId ?? '');
      if (ids.length) setReached((previous) => (ids.every((item) => previous.has(item)) ? previous : new Set([...previous, ...ids])));
    }, { root: track, rootMargin: '0px 100% 0px 100%' });
    track.querySelectorAll('li').forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [styles]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const max = track.scrollWidth - track.clientWidth;
      setEdges({ start: track.scrollLeft <= 1, end: track.scrollLeft >= max - 1 });
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    track.addEventListener('scroll', schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(track);
    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener('scroll', schedule);
      observer.disconnect();
    };
  }, [styles]);

  const move = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    if ((direction < 0 && edges.start) || (direction > 0 && edges.end)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' });
  };

  const headingId = `shelf-${id}`;
  return (
    <section className="home-shelf" aria-labelledby={headingId} ref={sectionRef}>
      <div className="home-shelf__head">
        <h3 id={headingId}>{title}</h3>
        <span className="home-shelf__count">{styles.length}</span>
        <div className="home-shelf__nav">
          <button className="icon-button" type="button" aria-label={`${previousLabel}: ${title}`} aria-disabled={edges.start || undefined} onClick={() => move(-1)}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
          </button>
          <button className="icon-button" type="button" aria-label={`${nextLabel}: ${title}`} aria-disabled={edges.end || undefined} onClick={() => move(1)}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
          </button>
        </div>
      </div>
      <ul className="home-shelf__track" ref={trackRef}>
        {styles.map((style) => (
          <li key={style.id} data-style-id={style.id}>
            <StyleCard style={style} lang={lang} sizes={SHELF_CARD_SIZES} showImage={near && reached.has(style.id)} />
          </li>
        ))}
      </ul>
    </section>
  );
}
