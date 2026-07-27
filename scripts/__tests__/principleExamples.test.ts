import { describe, expect, it } from 'vitest';
import { designPrinciples } from '../../src/catalog/designPrinciples.ts';
import { uxPrinciples } from '../../src/catalog/principles.ts';
import {
  designPrincipleExampleKinds,
  uxPrincipleExampleKinds,
} from '../../src/pages/principle-examples/principleExampleKinds.ts';

describe('principle visual examples', () => {
  it('covers every UX principle exactly once', () => {
    expect(Object.keys(uxPrincipleExampleKinds).sort())
      .toEqual(uxPrinciples.map((principle) => principle.id).sort());
  });

  it('covers every visual-design principle exactly once', () => {
    expect(Object.keys(designPrincipleExampleKinds).sort())
      .toEqual(designPrinciples.map((principle) => principle.id).sort());
  });
});
