/* Screenshots of the style pages, written by `npm run shots` (scripts/capture-style-shots.mts).
   Each is the top 1280x1600 of the page. Every style has a 640px wide WebP; the twelve on the
   hero band, which show at up to a third of a wide screen, also have a 1280px one. */
export const SHOT_WIDTH = 1280;
export const SHOT_HEIGHT = 1600;

/* The twelve style screens on the hero band, in the order they pass the centre. */
export const BAND_STYLE_IDS = [
  'kinetic-pop',
  'runtime-signal',
  'swiss-poster',
  'midnight-noir',
  'macos-liquid-glass',
  'bento-bloom',
  'fusion-product-swiss',
  'holographic-fluid',
  'brutalist-grid',
  'duotone-bold',
  'editorial-silence',
  'fusion-kinetic-brutal',
] as const;

const withLargeShot = new Set<string>(BAND_STYLE_IDS);

export function hasLargeShot(id: string): boolean {
  return withLargeShot.has(id);
}

export function shotSrc(id: string): string {
  return `/shots/${id}-640.webp`;
}

/* Only styles with a 1280px file get a srcset; the others have the one 640px file. */
export function shotSrcSet(id: string): string | undefined {
  return hasLargeShot(id) ? `/shots/${id}-640.webp 640w, /shots/${id}-1280.webp 1280w` : undefined;
}
