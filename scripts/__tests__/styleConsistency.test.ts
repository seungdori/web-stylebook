import { describe, expect, it } from 'vitest';
import { auditStyleConsistency, contrastRatio } from '../lib/style-consistency.mts';

describe('style reference consistency', () => {
  it('keeps catalog, prompts, tokens, tags, and citations in agreement', () => {
    const issues = auditStyleConsistency();
    expect(issues, issues.map((issue) => `${issue.id}: ${issue.message}`).join('\n')).toEqual([]);
  });

  it('measures the reported failing pairs below 4.5:1 before the corrected ink', () => {
    expect(contrastRatio('#8a96a8', '#e0e5ec')).toBeCloseTo(2.37, 1);
    expect(contrastRatio('#ffffff', '#ff9a76')).toBeCloseTo(2.07, 1);
    expect(contrastRatio('#586476', '#e0e5ec')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio('#3d3229', '#ff9a76')).toBeGreaterThanOrEqual(4.5);
  });
});
