import { describe, expect, it } from 'vite-plus/test'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'

const root = fileURLToPath(new URL('..', import.meta.url))
const require = createRequire(import.meta.url)

describe('published entry points', () => {
  it.each(['esm', 'commonjs'])('can use the %s package entry in Node.js without browser globals', format => {
    const load = format === 'esm'
      ? "import { createSamanDeskWeb, createSamanDeskReactNative, SamanDeskError } from 'samandesk'"
      : "const { createSamanDeskWeb, createSamanDeskReactNative, SamanDeskError } = require('samandesk')"
    const script = load + [
      '',
      "if (typeof createSamanDeskWeb !== 'function') throw new Error('Missing web entry')",
      "const error = new SamanDeskError('INVALID_CONFIG', 'test')",
      "if (!(error instanceof Error) || error.code !== 'INVALID_CONFIG') throw new Error('Invalid error export')",
      "const api = createSamanDeskReactNative({ workspaceID: 'workspace' }, { onStateChange() {}, injectJavaScript() {} })",
      "if (api.getState().source.uri !== 'https://samandesk.com/guest-login/workspace') throw new Error('Invalid initial state')",
      'api.destroy()',
    ].join('\n')
    const args = [...(format === 'esm' ? ['--input-type=module'] : []), '-e', script]
    expect(() => execFileSync(process.execPath, args, { cwd: root, timeout: 10000, stdio: 'pipe' })).not.toThrow()
  })

  it('exposes SamanDesk when the UMD file is loaded as a browser script', () => {
    const context: { SamanDesk?: Record<string, unknown> } = {}
    runInNewContext(readFileSync(resolve(root, 'dist/saman-desk.umd.cjs'), 'utf8'), context)
    expect(context.SamanDesk?.createSamanDeskWeb).toBeTypeOf('function')
    expect(context.SamanDesk?.createSamanDeskReactNative).toBeTypeOf('function')
    expect(context.SamanDesk?.SamanDeskError).toBeTypeOf('function')
  })

  it('ships matching, self-contained declarations for ESM and CommonJS', () => {
    const esm = readFileSync(resolve(root, 'dist/saman-desk.d.ts'), 'utf8')
    const commonjs = readFileSync(resolve(root, 'dist/saman-desk.d.cts'), 'utf8')
    expect(commonjs).toBe(esm)
    expect(esm).not.toMatch(/from ['"](?:node:|bun:|vite|tsdown|happy-dom)/)
  })

  it.each(['typescript', 'typescript-compat'])('type-checks ESM and CommonJS consumers using %s', compilerPackage => {
    const manifestPath = require.resolve(compilerPackage + '/package.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    const compiler = resolve(dirname(manifestPath), manifest.bin.tsc)
    expect(() => execFileSync(process.execPath, [compiler, '-p', 'tests/tsconfig.consumer.json'], {
      cwd: root, timeout: 20000, stdio: 'pipe',
    })).not.toThrow()
  })
})
