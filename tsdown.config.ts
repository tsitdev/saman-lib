import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: { 'saman-desk': 'src/index.ts' },
  format: {
    esm: {},
    umd: {
      dts: false,
      outputOptions: {
        entryFileNames: '[name].umd.cjs',
      },
    },
  },
  globalName: 'SamanDesk',
  platform: 'browser',
  target: 'es2021',
  fixedExtension: false,
  dts: true,
  minify: true,
  clean: true,
})
