import { defineConfig } from 'vitest/config';

// Runs every *.test.ts across the monorepo. Pure logic (repositories, utils) uses
// the node environment; the memory adapters mean tests need no real backend.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['packages/**/*.test.ts', 'apps/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  },
});
