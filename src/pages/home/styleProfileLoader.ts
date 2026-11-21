import { useSyncExternalStore } from 'react';
import { isHomePurpose, type StyleProfileLookup } from '../../data/purposeDiscovery';
import { getDesignWorkspace } from '../../visual/useDesignWorkspace';

/**
 * Home needs the style profiles (styleProfiles.ts, about 20 KB gzip) only for a chosen
 * purpose's shortlist, so they load on demand instead of with the first screen.
 */
let lookup: StyleProfileLookup | undefined;
let loading: Promise<StyleProfileLookup> | undefined;
const listeners = new Set<() => void>();

export function loadStyleProfiles(): Promise<StyleProfileLookup> {
  loading ??= import('../../data/styleProfiles').then(
    ({ getStyleProfile }) => {
      lookup = getStyleProfile;
      for (const listener of listeners) listener();
      return getStyleProfile;
    },
    (error: unknown) => {
      // The next purpose choice tries again.
      loading = undefined;
      throw error;
    },
  );
  return loading;
}

/** Starts the load and reports a failure; the shortlist stays pending until a retry succeeds. */
export function requestStyleProfiles(): void {
  loadStyleProfiles().catch((error: unknown) => console.error('[web-stylebook] Style profiles failed to load.', error));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** The profile lookup once it has loaded, otherwise undefined. */
export function useStyleProfiles(): StyleProfileLookup | undefined {
  return useSyncExternalStore(subscribe, () => lookup, () => lookup);
}

/**
 * Run before Home first renders. A purpose restored from the URL or the saved draft
 * then shows its shortlist in the first frame, as it did when the profiles were bundled.
 */
export async function preloadInitialPurposeProfiles(): Promise<void> {
  if (typeof window === 'undefined') return;
  const purpose = new URLSearchParams(window.location.search).get('purpose') ?? getDesignWorkspace().getSnapshot().draft.discovery.purpose;
  if (!isHomePurpose(purpose)) return;
  try {
    await loadStyleProfiles();
  } catch (error) {
    // Home still opens; the shortlist stays pending and the next purpose choice retries.
    console.error('[web-stylebook] Style profiles failed to load.', error);
  }
}
