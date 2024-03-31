import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import path from 'path';

export default defineConfig(() => {
  return {
    build: {
      target: 'es2020',
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: format => `index.qwik.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
    },
    test: {
      coverage: {
        provider: 'istanbul',
        lines: 90,
        functions: 90,
        branches: 80,
        statements: 90,
        exclude: ['src/stories/**', 'src/test/test.tsx', 'lib/**', 'src/entry*.tsx', '.storybook/**'],
      },
    },
    plugins: [qwikVite()],
    publicDir: './public',
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './node_modules'),
      },
    },
  };
});
