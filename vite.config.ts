import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { runtimeRecipe, type SourceRecipe } from './src/visual/recipeSource';

const recipesPath = fileURLToPath(new URL('./src/visual/recipes.json', import.meta.url));

/**
 * recipes.json keeps authoring evidence that no visual contract reads.
 * The site bundles only the fields contracts.ts builds from (see recipeSource.ts);
 * Node scripts and tests read the whole file.
 */
function runtimeRecipes(): Plugin {
  return {
    name: 'webstylebook:runtime-recipes',
    enforce: 'pre',
    load(id) {
      if (id !== recipesPath) return null;
      const recipes = JSON.parse(readFileSync(id, 'utf8')) as SourceRecipe[];
      return JSON.stringify(recipes.map(runtimeRecipe));
    },
  };
}

export default defineConfig({
  plugins: [react(), runtimeRecipes()],
  // Loopback only. The dev server can read the project tree; bind it wider with
  // `npm run dev -- --host` when that is intentional.
  // Pro Kit remains public: its route is product documentation, not paid assets.
  server: {
    host: '127.0.0.1',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
