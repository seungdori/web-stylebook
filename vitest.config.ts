import { defineConfig } from 'vitest/config';

// Root tests: catalog integrity / determinism. The MCP package has its own config.
export default defineConfig({
  test: {
    include: ['scripts/__tests__/**/*.test.ts'],
    exclude: ['packages/**', 'node_modules/**', 'dist/**'],
  },
});
