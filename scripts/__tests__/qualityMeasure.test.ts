import { describe, expect, it } from 'vitest';
import { checkBudgets, measureBytes, selectedPayloadViolations, staticModuleImports } from '../quality-measure.mts';

describe('quality resource gates', () => {
  it('measures UTF-8 bytes and repeatable compressed content hashes', () => {
    const first = measureBytes('한국어');
    expect(first.bytes).toBe(9);
    expect(first).toEqual(measureBytes('한국어'));
    expect(measureBytes('한국어!').sha256).not.toBe(first.sha256);
  });
  it('rejects budget increases and distinguishes missing measurements', () => {
    const budgets = [{ metric: 'selected', max: 100, unit: 'bytes' as const, reason: 'reviewed fixture' }];
    expect(checkBudgets({ selected: 100 }, budgets)[0].status).toBe('pass');
    expect(checkBudgets({ selected: 101 }, budgets)[0].status).toBe('fail');
    expect(checkBudgets({}, budgets)[0].status).toBe('not-run');
  });
  it('catches deliberately injected full-catalog and all-locale payloads', () => {
    const selected = { identity: { styleId: 'brutalist-grid' }, design: { colors: { text: '#111111', accent: '#d72600' } } };
    expect(selectedPayloadViolations(selected)).toEqual([]);
    expect(selectedPayloadViolations({ ...selected, accidental: { referenceLibrary: {} } })).not.toEqual([]);
    expect(selectedPayloadViolations({ ...selected, styles: [{ id: 'a' }, { id: 'b' }] })).not.toEqual([]);
    expect(selectedPayloadViolations({ ...selected, copy: { en: 'one', ko: '하나', ja: '一' } })).not.toEqual([]);
  });
  it('follows real static dependencies without counting dynamic routes or import-looking strings', () => {
    expect(staticModuleImports('import { x } from "./shared.js"; export { y } from "./roles.js"; const s = "import fake from fake"; import("./lazy.js");')).toEqual(['./shared.js', './roles.js']);
  });
});
