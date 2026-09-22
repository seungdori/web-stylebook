import { useEffect } from 'react';
import { useDesignWorkspace } from '../../visual/useDesignWorkspace';

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
}
