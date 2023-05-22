import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { configDefaults } from 'vitest/config';

export default defineConfig(() => {
  return {
    build: {
      target: 'es2020',
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.qwik.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
    },
    test: {
      coverage: {
        provider: 'istanbul',
        lines: 98,
        functions: 96,
        branches: 92,
        statements: 98,
      },
    },
    plugins: [qwikVite()],
    publicDir: './public',
  };
});
