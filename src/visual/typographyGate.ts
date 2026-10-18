import type { ActiveFontStatus, FontScript } from './fontLoader';
import { fontFaceDescriptor, fontProbeSample } from './fontLoader';
import type { FontMetadata } from './types';

export type TypographyGateState = 'pending' | 'failed' | 'ready';

export interface GateFont {
  family: string;
  status: ActiveFontStatus['status'];
  reason: ActiveFontStatus['reason'];
  loadedScript?: FontScript;
  weights: number[];
  script: FontScript;
}

export interface TypographyGate {
  state: TypographyGateState;
  failedFamilies: string[];
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function preferredStatus(matches: readonly ActiveFontStatus[]): ActiveFontStatus | undefined {
  return matches.find((item) => item.status === 'loading')
    ?? matches.find((item) => item.status === 'error')
    ?? matches.find((item) => item.reason === 'font-face-unavailable' || item.reason === 'font-api-unavailable' || item.reason === 'unverified-source' || item.reason === 'load-failed')
    ?? matches[0];
}

export function gateFonts(fonts: readonly FontMetadata[], statuses: readonly ActiveFontStatus[], script: FontScript): GateFont[] {
  return fonts.map((font) => {
    const status = preferredStatus(statuses.filter((item) => item.family === font.family));
    return {
      family: font.family,
      status: status?.status ?? 'loading',
      reason: status?.reason ?? 'pending',
      loadedScript: status?.loadedScript,
      weights: font.weights.length ? [...font.weights] : [400],
      script: status?.script ?? script,
    };
  });
}

function faceConfirmed(font: GateFont, confirm: (descriptor: string, sample: string) => boolean): boolean {
  if (font.status === 'loading' || font.reason === 'pending') return false;
  if (font.status === 'error' || font.reason === 'load-failed' || font.reason === 'font-api-unavailable' || font.reason === 'font-face-unavailable' || font.reason === 'unverified-source') return false;
  if (font.reason === 'script-not-covered' && !font.loadedScript) return false;
  const script = font.loadedScript ?? (font.reason === 'system-dependent' ? 'latin' : font.script);
  const sample = fontProbeSample(script);
  const weights = font.weights.length ? font.weights : [400];
  return weights.every((weight) => confirm(fontFaceDescriptor(font.family, weight), sample));
}

/**
 * Ready requires a FontFaceSet check for every settled face.
 * A missing check API is a failure: reporting the comparison without one would be a silent pass.
 */
export function assessTypographyGate(panes: readonly (readonly GateFont[])[], confirm: ((descriptor: string, sample: string) => boolean) | null): TypographyGate {
  if (panes.length < 2) return { state: 'pending', failedFamilies: [] };
  const fonts = panes.flat();
  if (panes.some((pane) => pane.length === 0) || fonts.some((font) => font.status === 'loading' || font.reason === 'pending')) {
    return { state: 'pending', failedFamilies: [] };
  }
  if (!confirm) return { state: 'failed', failedFamilies: unique(fonts.map((font) => font.family)) };
  const failedFamilies = unique(fonts.filter((font) => !faceConfirmed(font, confirm)).map((font) => font.family));
  return failedFamilies.length ? { state: 'failed', failedFamilies } : { state: 'ready', failedFamilies: [] };
}

export function fontFamilyDelta(before: readonly string[], after: readonly string[]): { retained: string[]; added: string[] } {
  const previous = new Set(before);
  const next = new Set(after);
  return {
    retained: [...previous].filter((family) => next.has(family)),
    added: [...next].filter((family) => !previous.has(family)),
  };
}
