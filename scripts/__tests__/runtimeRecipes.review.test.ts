// Review: the site build strips recipe evidence through the vite.config.ts plugin.
// These tests load the modules through Vite itself (the same plugin pipeline the dev
// server and the build use) and compare them with what Node scripts and the MCP build read.
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type ViteDevServer } from 'vite';
import recipes from '../../src/visual/recipes.json';
import { runtimeRecipe, type SourceRecipe } from '../../src/visual/recipeSource';
import { visualContracts } from '../../src/visual/contracts';

const root = fileURLToPath(new URL('../..', import.meta.url));
const EVIDENCE = ['supportedModes', 'displayWeightDefaultNote', 'motionSource', 'motionCss', 'displayWeightResolutionSource', 'bodySizeCss', 'bodySizeSource', 'bodyWeightResolved', 'bodyWeightSource'];

let server: ViteDevServer;

beforeAll(async () => {
  server = await createServer({
    root,
    configFile: `${root}vite.config.ts`,
    logLevel: 'silent',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null },
  });
}, 60_000);

afterAll(async () => {
  await server?.close();
});

describe('runtime recipe plugin (vite.config.ts)', () => {
  it('serves recipes.json to the browser without evidence fields', async () => {
    const client = await server.transformRequest('/src/visual/recipes.json');
    expect(client).toBeTruthy();
    for (const field of EVIDENCE) expect(client!.code).not.toContain(`"${field}"`);
    // Fields a contract reads are still there.
    expect(client!.code).toContain('fidelityNotes');
    expect(client!.code).toContain('supportedAlternateModes');
  });

  it('gives the Vite module graph exactly runtimeRecipe(recipes.json)', async () => {
    const mod = await server.ssrLoadModule('/src/visual/recipes.json') as { default: SourceRecipe[] };
    const authored: SourceRecipe[] = recipes;
    expect(mod.default).toStrictEqual(authored.map(runtimeRecipe));
    expect(JSON.stringify(mod.default)).toBe(JSON.stringify(authored.map(runtimeRecipe)));
  });

  it('builds the same 48 contracts, revisions included, through Vite as in Node', async () => {
    const mod = await server.ssrLoadModule('/src/visual/contracts.ts') as { visualContracts: typeof visualContracts };
    expect(Object.keys(mod.visualContracts)).toEqual(Object.keys(visualContracts));
    expect(Object.keys(mod.visualContracts)).toHaveLength(48);
    for (const id of Object.keys(visualContracts)) {
      expect(mod.visualContracts[id]!.revision, id).toBe(visualContracts[id]!.revision);
    }
    expect(JSON.stringify(mod.visualContracts)).toBe(JSON.stringify(visualContracts));
  }, 60_000);
});
