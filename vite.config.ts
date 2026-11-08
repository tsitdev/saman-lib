import { defineConfig } from 'vite-plus'
import { copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineConfig({
  lint: {
    ignorePatterns: ['dist/**', 'coverage/**', '.vite-hooks/_/**'],
    options: {
      typeAware: true,
      typeCheck: true,
      denyWarnings: true,
    },
    categories: {
      correctness: 'error',
    },
    rules: {
      eqeqeq: 'error',
      'no-debugger': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  fmt: {
    ignorePatterns: ['dist/**', 'coverage/**', 'bun.lock', '.vite-hooks/_/**'],
    semi: false,
    singleQuote: true,
    tabWidth: 2,
    printWidth: 100,
    trailingComma: 'all',
    endOfLine: 'lf',
    sortImports: false,
    sortPackageJson: false,
    proseWrap: 'preserve',
    embeddedLanguageFormatting: 'off',
  },
  staged: {
    '*': 'vp check --fix',
  },
  pack: {
    tsconfig: 'tsconfig.lib.json',
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
    hooks: {
      'build:done': async ({ options }) => {
        if (options.format === 'es') {
          // The UMD entry is CommonJS for require(); give it CommonJS declarations.
          await copyFile(
            resolve(options.outDir, 'saman-desk.d.ts'),
            resolve(options.outDir, 'saman-desk.d.cts'),
          )
        }
      },
    },
  },
  test: {
    environment: 'node',
    restoreMocks: true,
    unstubGlobals: true,
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/core.test.ts', 'tests/react-native.test.ts', 'tests/web.test.ts'],
        },
      },
      {
        test: {
          name: 'package',
          include: ['tests/package.test.ts'],
        },
      },
    ],
  },
})
