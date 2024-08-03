/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { insertHtml, h } from 'vite-plugin-insert-html';

export default defineConfig({
  test: {},
  plugins: [
    nodePolyfills(), // include only buffer in future
    react(),
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        { src: './src/assets/manifest.json', dest: '' },
        { src: './src/assets/scripts', dest: '' },
        { src: './src/assets/confirm-whitelist.html', dest: '' },
        { src: './src/assets/images', dest: 'assets' },
        { src: './src/assets/lib', dest: 'assets' },
      ],
    }),
    insertHtml({
      head: [
        h('link', {
          rel: 'stylesheet',
          href: './assets/index.css',
        }),
      ],
      body: [
        h('script', { src: './assets/index.js', type: 'module' }),
        h('script', { src: './scripts/components/apply-popup-styles.js' }),
      ],
    }),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: 'index.html',
      output: {
        assetFileNames: () => `assets/[name][extname]`,
        entryFileNames: () => `assets/[name].js`,
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});
