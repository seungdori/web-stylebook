import { useEffect, useMemo, useState } from 'react';
import type { FontMetadata } from './types';
import { initialFontStatus, loadActiveFont } from './fontLoader';
import type { ActiveFontStatus } from './fontLoader';

export type { ActiveFontStatus } from './fontLoader';
export { getActiveSpecimenFonts } from './fontLoader';

/** Pass only the resolved specimen's active families (or the union of a compared pair). */
export function useActiveFonts(fonts: readonly FontMetadata[], locale: string): ActiveFontStatus[] {
  const serialized = JSON.stringify(fonts);
  const activeFonts = useMemo(() => {
    const unique = new Map<string, FontMetadata>();
    for (const font of JSON.parse(serialized) as FontMetadata[]) {
      // Same family can request different weights in a comparison; retain both requests.
      const key = JSON.stringify(font);
      if (!unique.has(key)) unique.set(key, font);
    }
    return [...unique.values()];
  }, [serialized]);
  const selection = `${locale}:${serialized}`;
  const [snapshot, setSnapshot] = useState<{ selection: string; entries: ActiveFontStatus[] }>();

  useEffect(() => {
    let mounted = true;
    const entries = activeFonts.map((font) => initialFontStatus(font, locale));
    activeFonts.forEach((font, index) => {
      void loadActiveFont(font, locale).then((entry) => {
        if (!mounted) return;
        entries[index] = entry;
        setSnapshot({ selection, entries: [...entries] });
      });
    });
    return () => { mounted = false; };
  }, [activeFonts, locale, selection]);

  return snapshot?.selection === selection ? snapshot.entries : activeFonts.map((font) => initialFontStatus(font, locale));
}
