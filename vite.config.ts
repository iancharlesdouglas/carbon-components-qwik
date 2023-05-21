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
      },
      exclude: [...configDefaults.exclude, 'node_modules/.pnpm/**/*.mjs'],
    },
    plugins: [qwikVite()],
    publicDir: './public',
  };
});
