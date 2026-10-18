import { useEffect, useMemo, useState } from 'react';
import type { FontMetadata } from './types';
import { scriptForLocale } from './fontLoader';
import { useActiveFonts } from './useActiveFonts';
import { assessTypographyGate, gateFonts } from './typographyGate';

export function useTypographyGate(leftFonts: readonly FontMetadata[], rightFonts: readonly FontMetadata[], locale: string) {
  const leftStatus = useActiveFonts(leftFonts, locale);
  const rightStatus = useActiveFonts(rightFonts, locale);
  const fontKey = `${locale}:${JSON.stringify(leftFonts)}:${JSON.stringify(rightFonts)}`;
  const [fontSetVersion, setFontSetVersion] = useState(0);

  useEffect(() => {
    const fonts = typeof document === 'undefined' ? undefined : document.fonts;
    if (!fonts?.addEventListener) return undefined;
    const bump = () => setFontSetVersion((version) => version + 1);
    fonts.addEventListener('loading', bump);
    fonts.addEventListener('loadingdone', bump);
    fonts.addEventListener('loadingerror', bump);
    let alive = true;
    void fonts.ready.then(() => { if (alive) bump(); });
    return () => {
      alive = false;
      fonts.removeEventListener('loading', bump);
      fonts.removeEventListener('loadingdone', bump);
      fonts.removeEventListener('loadingerror', bump);
    };
  }, [fontKey]);

  const gate = useMemo(() => {
    const fonts = typeof document === 'undefined' ? undefined : document.fonts;
    const confirm = fonts && typeof fonts.check === 'function'
      ? (descriptor: string, sample: string) => fontSetVersion >= 0 && fonts.check(descriptor, sample)
      : null;
    const script = scriptForLocale(locale);
    return assessTypographyGate([
      gateFonts(leftFonts, leftStatus, script),
      gateFonts(rightFonts, rightStatus, script),
    ], confirm);
  }, [leftFonts, rightFonts, leftStatus, rightStatus, locale, fontSetVersion]);

  return { ...gate, leftStatus, rightStatus };
}
