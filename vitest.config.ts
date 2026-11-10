import { defineConfig } from 'vitest/config';

const artifacts = process.env.VITEST_ARTIFACTS === '1';

export default defineConfig({
  test: {
    include: artifacts ? ['scripts/__tests__/**/*.artifact.test.ts'] : ['scripts/__tests__/**/*.test.ts'],
    exclude: artifacts
      ? ['packages/**', 'node_modules/**', 'dist/**']
      : ['packages/**', 'node_modules/**', 'dist/**', 'scripts/__tests__/**/*.artifact.test.ts'],
  },
});
