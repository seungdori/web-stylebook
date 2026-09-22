import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { getVisualContract, resolveVisualContract } from './index';
import { createDesignWorkspace, DESIGN_DRAFT_STORAGE_KEY, type DesignWorkspace } from './workspace';
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
  const resolved = useMemo(() => resolveVisualContract(draft.styleId, {
    mode: draft.mode, contentLocale: draft.contentLocale,
    overrides: draft.overrides, acceptedRepairs: draft.acceptedRepairs,
  }), [draft.styleId, draft.mode, draft.contentLocale, draft.overrides, draft.acceptedRepairs]);
  return { ...store, ...snapshot, authored, resolved };
}

export function useComparisonLocation() {
  const { requestComparisonSelection } = useDesignWorkspace();
  useEffect(() => {
    const applyIncoming = () => { requestComparisonSelection(window.location.search); };
    applyIncoming();
    window.addEventListener('popstate', applyIncoming);
    return () => window.removeEventListener('popstate', applyIncoming);
  }, [requestComparisonSelection]);
}
