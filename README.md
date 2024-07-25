# Cyclone Wallet Extension

// isDirty GW form


// Bitcoin
// CryptoJS


`
"type": "module",
"files": [
"dist"
],
"main": "./dist/cyclone-wallet.umd.cjs",
"module": "./dist/cyclone-wallet.js",
"exports": {
".": {
"import": "./dist/cyclone-wallet.js",
"require": "./dist/cyclone-wallet.umd.cjs"
}
},
`

`
// import path from 'node:path';
// import react from '@vitejs/plugin-react';
// import { defineConfig } from 'vite';
// import { viteStaticCopy } from 'vite-plugin-static-copy';
// import tsconfigPaths from 'vite-tsconfig-paths';
// import { nodePolyfills } from 'vite-plugin-node-polyfills';
//
// export default defineConfig({
//   plugins: [
//     nodePolyfills(), // include only buffer in future
//     react(),
//     tsconfigPaths(),
//     viteStaticCopy({
//       targets: [
//         { src: './src/assets/images', dest: 'assets' },
//         { src: './src/assets/lib', dest: 'assets' },
//       ],
//     }),
//   ],
//   build: {
//     lib: {
//       entry: path.resolve(__dirname, 'src/index.tsx'),
//       name: 'CycloneWallet',
//       fileName: 'cyclone-wallet',
//     },
//   },
//   css: {
//     modules: {
//       localsConvention: 'camelCaseOnly',
//     },
//   },
// });
`
