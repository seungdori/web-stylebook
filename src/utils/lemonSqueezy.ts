import { useEffect } from 'react';

const lemonSqueezyScriptSrc = 'https://app.lemonsqueezy.com/js/lemon.js';

declare global {
  interface Window {
    createLemonSqueezy?: () => void;
  }
}

export function useLemonSqueezyOverlay(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const initialize = () => {
      window.createLemonSqueezy?.();
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${lemonSqueezyScriptSrc}"]`,
    );

    if (existing) {
      initialize();
      existing.addEventListener('load', initialize, { once: true });
      return () => existing.removeEventListener('load', initialize);
    }

    const script = document.createElement('script');
    script.src = lemonSqueezyScriptSrc;
    script.defer = true;
    script.addEventListener('load', initialize, { once: true });
    document.body.appendChild(script);

    return () => script.removeEventListener('load', initialize);
  }, [enabled]);
}

export function lemonSqueezyButtonClass(className: string, enabled: boolean): string {
  return enabled ? `${className} lemonsqueezy-button` : className;
}
