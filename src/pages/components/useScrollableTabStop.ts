import { useLayoutEffect, useRef } from 'react';

/** A box that scrolls needs a tab stop for keyboard users. One that fits does not. */
export function useScrollableTabStop<T extends HTMLElement>(content: unknown) {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      if (element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight) element.setAttribute('tabindex', '0');
      else element.removeAttribute('tabindex');
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [content]);
  return ref;
}
