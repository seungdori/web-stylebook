import { normalizeHex } from '../../utils/color';
import { zVisualColor } from '../../visual/schema';

/** Keep incomplete text local; only validated literal colors enter the shared draft. */
export function parseEditorColor(input: string): string | null {
  const value = normalizeHex(input) ?? input.trim();
  return zVisualColor.safeParse(value).success ? value : null;
}
