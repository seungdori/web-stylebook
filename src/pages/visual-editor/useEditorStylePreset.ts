import { useEffect } from 'react';
import { alignCommittedStylePreset, getDesignWorkspace, useDesignWorkspace } from '../../visual/useDesignWorkspace';

export function useEditorStylePreset() {
  const { requestStylePreset } = useDesignWorkspace();
  useEffect(() => {
    const applyIncoming = () => {
      const id = new URLSearchParams(window.location.search).get('stylePreset');
      if (id) requestStylePreset(id);
    };
    applyIncoming();
    window.addEventListener('popstate', applyIncoming);
    return () => window.removeEventListener('popstate', applyIncoming);
  }, [requestStylePreset]);

  useEffect(() => {
    const store = getDesignWorkspace();
    let styleId = store.getSnapshot().draft.styleId;
    return store.subscribe(() => {
      const snapshot = store.getSnapshot();
      if (snapshot.pendingStyleId || snapshot.linkError === 'invalid-selection') return;
      if (snapshot.draft.styleId === styleId) return;
      styleId = snapshot.draft.styleId;
      alignCommittedStylePreset(styleId);
    });
  }, []);
}
