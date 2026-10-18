import { describe, expect, it } from 'vitest';
import { buildSelectedHandoff, selectedHandoffToPrompt } from '../../src/visual/handoff';
import { clearScreenshot, readScreenshot, saveScreenshot, SCREENSHOT_EVIDENCE_KEY, screenshotByteLength } from '../../src/visual/screenshotEvidence';
import { resolveVisualContract } from '../../src/visual';
import { createInitialDraft, parseDesignDraft } from '../../src/visual/workspace';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const dataUrl = `data:image/png;base64,${png.toString('base64')}`;

function memory() {
  const values = new Map<string, string>();
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

describe('local screenshot evidence', () => {
  it('stores the image in browser storage and keeps the draft free of pixels', () => {
    const storage = memory();
    const saved = saveScreenshot(storage, { name: 'settings.png', mime: 'image/png', byteLength: png.length, dataUrl });
    expect(saved.ok).toBe(true);
    if (!saved.ok) return;
    expect(saved.record.meta.byteLength).toBe(png.length);
    expect(saved.record.meta).not.toHaveProperty('colors');
    expect(JSON.stringify(saved.record.meta)).not.toMatch(/#[0-9a-f]{3,8}/i);
    expect(readScreenshot(storage)?.dataUrl).toBe(dataUrl);
    expect(storage.values.size).toBe(1);
    expect(storage.getItem(SCREENSHOT_EVIDENCE_KEY)).toContain('data:image/png;base64,');

    const draft = createInitialDraft();
    draft.taskMode = 'refine-existing';
    draft.refinement = { ...draft.refinement, evidenceKind: 'screenshot-only', screenshot: saved.record.meta, sourceReference: 'settings.png' };
    const raw = JSON.stringify(draft);
    expect(raw).not.toContain('data:image');
    expect(raw).not.toContain(png.toString('base64'));
    const parsed = parseDesignDraft(raw);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.draft.refinement.screenshot).toEqual(saved.record.meta);
    const polluted = JSON.stringify({ ...draft, refinement: { ...draft.refinement, screenshot: { ...saved.record.meta, dataUrl } } });
    expect(parseDesignDraft(polluted).ok).toBe(false);

    const handoff = buildSelectedHandoff(resolveVisualContract('brutalist-grid'), {
      taskMode: 'refine-existing',
      refinement: parsed.draft.refinement,
    });
    const prompt = selectedHandoffToPrompt(handoff);
    expect(handoff.refinement?.confidence).toBe('limited');
    expect(handoff.refinement?.operations).toEqual([]);
    expect(handoff.refinement?.targetRegions).toEqual([]);
    expect(prompt).toContain('Evidence completeness: screenshot-only');
    expect(prompt).toContain('Confidence: limited');
    expect(prompt).toContain('No computed values are included.');
    expect(prompt).not.toMatch(/verified: true|"verified":true/);
    expect(screenshotByteLength(dataUrl, 'image/png')).toBe(png.length);
    clearScreenshot(storage);
    expect(readScreenshot(storage)).toBeNull();
  });

  it('rejects a non-image, a mismatched payload, and a file that cannot be stored', () => {
    const storage = memory();
    expect(saveScreenshot(storage, { name: 'notes.txt', mime: 'text/plain', byteLength: 4, dataUrl: 'data:text/plain;base64,bm90ZQ==' }).ok).toBe(false);
    expect(saveScreenshot(storage, { name: 'shot.png', mime: 'image/png', byteLength: 3, dataUrl }).ok).toBe(false);
    expect(saveScreenshot({ getItem: () => null, setItem: () => { throw new Error('quota'); } }, { name: 'shot.png', mime: 'image/png', byteLength: png.length, dataUrl }).ok).toBe(false);
    expect(storage.values.size).toBe(0);
  });
});
