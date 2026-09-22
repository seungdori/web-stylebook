import { describe, expect, it, vi, afterEach } from 'vitest';
import { parseEditorColor } from '../../src/pages/visual-editor/colorDraft';
import { parseTypographyDraft } from '../../src/pages/visual-editor/typographyDraft';
import type { TypographyRole } from '../../src/visual/types';
import { copyText } from '../../src/utils/clipboard';

const role: TypographyRole = {
  fontFamily: 'Inter, sans-serif', fontWeight: 400, fontStyle: 'normal', sizeMinRem: 1, sizeMaxRem: 2,
  lineHeight: 1.5, letterSpacingEm: 0, paragraphSpacingEm: 1, measureCh: 62,
  textTransform: 'none', wordBreak: 'normal', overflowWrap: 'anywhere', fontVariantNumeric: 'normal',
};

describe('visual editor accepted input boundary', () => {
  it('normalizes hex while retaining explicit alpha and rejects executable or incomplete CSS', () => {
    expect(parseEditorColor('ABC')).toBe('#aabbcc');
    expect(parseEditorColor('rgba(12, 24, 36, 0.4)')).toBe('rgba(12, 24, 36, 0.4)');
    expect(parseEditorColor('#1234')).toBe('#1234');
    for (const value of ['#', '#12', '', '#fff;display:none', 'url(https://example.test)', 'rgb(999, 2, 3)']) expect(parseEditorColor(value)).toBeNull();
  });
  it('keeps incomplete or inverted typography edits outside accepted values', () => {
    expect(parseTypographyDraft(role, { lineHeight: '' }).patch).toBeNull();
    expect(parseTypographyDraft(role, { sizeMinRem: '3' }).errors.sizeMinRem).toBe('scale');
    expect(parseTypographyDraft(role, { sizeMinRem: '3', sizeMaxRem: '4' }).patch).toEqual({ sizeMinRem: 3, sizeMaxRem: 4 });
    expect(role.sizeMinRem).toBe(1);
  });
  it('preserves explicit zero spacing and rejects unsupported font declarations', () => {
    expect(parseTypographyDraft(role, { letterSpacingEm: '0', paragraphSpacingEm: '0' }).patch).toEqual({ letterSpacingEm: 0, paragraphSpacingEm: 0 });
    expect(parseTypographyDraft(role, { fontFamily: "'Noto Sans KR', sans-serif" }).patch).toEqual({ fontFamily: "'Noto Sans KR', sans-serif" });
    expect(parseTypographyDraft(role, { fontFamily: 'Inter; background: url(x)' }).patch).toBeNull();
    expect(parseTypographyDraft(role, { fontWeight: '1000' }).patch).toBeNull();
    expect(parseTypographyDraft(role, { lineHeight: 'Infinity' }).patch).toBeNull();
  });
});

afterEach(() => vi.unstubAllGlobals());
describe('copy feedback reflects actual clipboard outcome', () => {
  it('rejects a denied modern clipboard write', async () => {
    vi.stubGlobal('window', { isSecureContext: true });
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    await expect(copyText('design')).rejects.toThrow('denied');
  });
  it('rejects a false fallback result and still removes its temporary node', async () => {
    const removeChild = vi.fn();
    vi.stubGlobal('window', { isSecureContext: false });
    vi.stubGlobal('navigator', {});
    vi.stubGlobal('document', {
      createElement: () => ({ value: '', setAttribute: vi.fn(), style: {}, select: vi.fn() }),
      body: { appendChild: vi.fn(), removeChild }, execCommand: () => false,
    });
    await expect(copyText('design')).rejects.toThrow('not accepted');
    expect(removeChild).toHaveBeenCalledOnce();
  });
});
