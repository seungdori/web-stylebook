import { describe, expect, it } from 'vitest';
import { designPrinciples } from '../../src/catalog/designPrinciples.ts';
import { uxPrinciples } from '../../src/catalog/principles.ts';
import { designScenes } from '../../src/pages/principle-examples/designScenes.tsx';
import { uxScenes } from '../../src/pages/principle-examples/uxScenes.tsx';

const scenes = [
  ['UX', uxScenes, uxPrinciples] as const,
  ['visual-design', designScenes, designPrinciples] as const,
];

describe('principle visual examples', () => {
  it.each(scenes)('covers every %s principle exactly once', (_scope, map, principles) => {
    expect(Object.keys(map).sort()).toEqual(principles.map((principle) => principle.id).sort());
  });

  it.each(scenes)('gives every %s scene its own "what changed" note', (_scope, map) => {
    const notes = Object.values(map).map((scene) => scene.note.en);
    expect(new Set(notes).size).toBe(notes.length);
  });

  it.each(scenes)('writes every %s note in all three languages', (_scope, map) => {
    for (const [id, scene] of Object.entries(map)) {
      for (const lang of ['en', 'ko', 'ja'] as const) {
        expect(scene.note[lang], `${id}.note.${lang}`).toBeTruthy();
      }
    }
  });
});
