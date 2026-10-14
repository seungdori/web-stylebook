import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { getVisualContract } from './index';
import { resolveSelectedSpec } from './resolvedSpec';
import { urlWithAlignedStylePreset, urlWithSelection } from './selectionUrl';
import { createDesignWorkspace, DESIGN_DRAFT_STORAGE_KEY, draftResolutionOptions, type DesignWorkspace } from './workspace';
import { parseLang } from '../utils/language';

let browserWorkspace: DesignWorkspace | undefined;
let removeBrowserListeners: (() => void) | undefined;

export function getDesignWorkspace(): DesignWorkspace {
  if (browserWorkspace) return browserWorkspace;
  let storage: Storage | null = null;
  if (typeof window !== 'undefined') {
    try { storage = window.localStorage; } catch { /* The editor still works in memory. */ }
  }
  browserWorkspace = createDesignWorkspace(storage, {
    deferWrites: true,
    initialContentLocale: typeof window === 'undefined' ? 'en' : parseLang(window.location.search, window.location.pathname),
  });
  if (typeof window !== 'undefined') {
    const store = browserWorkspace;
    const onStorage = (event: StorageEvent) => {
      if (event.key === DESIGN_DRAFT_STORAGE_KEY || event.key === null) store.receiveStorage(event.newValue);
    };
    const onPageHide = () => { store.flush(); };
    const onVisibilityChange = () => { if (document.visibilityState === 'hidden') store.flush(); };
    const onLinkClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href]')) store.flush();
    };
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      const current = store.getSnapshot();
      if (!store.flush() && current.modified) { event.preventDefault(); }
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('click', onLinkClick, { capture: true });
    window.addEventListener('beforeunload', onBeforeUnload);
    removeBrowserListeners = () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('click', onLinkClick, { capture: true });
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }
  return browserWorkspace;
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    removeBrowserListeners?.();
    browserWorkspace?.flush();
    browserWorkspace?.dispose();
    removeBrowserListeners = undefined;
    browserWorkspace = undefined;
  });
}

export function useDesignWorkspace() {
  const store = getDesignWorkspace();
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const { draft } = snapshot;
  const authored = useMemo(() => getVisualContract(draft.styleId), [draft.styleId]);
  const resolved = useMemo(() => resolveSelectedSpec(draft.styleId, draftResolutionOptions(draft)), [draft]);
  return { ...store, ...snapshot, authored, resolved };
}

export function publishComparisonSelection(origin: 'user' | 'normalize') {
  if (typeof window === 'undefined') return;
  const draft = getDesignWorkspace().getSnapshot().draft;
  const next = urlWithSelection(window.location.pathname, window.location.search, window.location.hash, draft);
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next === current) return;
  const update = origin === 'user' ? window.history.pushState : window.history.replaceState;
  update.call(window.history, {}, '', next);
}

export function alignCommittedStylePreset(styleId: string) {
  if (typeof window === 'undefined') return;
  const next = urlWithAlignedStylePreset(window.location.pathname, window.location.search, window.location.hash, styleId);
  if (next) window.history.replaceState({}, '', next);
}

export function useComparisonLocation() {
  const { requestComparisonSelection } = useDesignWorkspace();
  useEffect(() => {
    const applyIncoming = () => { requestComparisonSelection(window.location.search); };
    applyIncoming();
    // The landing URL becomes a complete selection snapshot without adding a history entry.
    publishComparisonSelection('normalize');
    const onPop = () => { applyIncoming(); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [requestComparisonSelection]);
}
